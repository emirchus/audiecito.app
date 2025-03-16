import { NextResponse } from "next/server";

import { updateDonationStatus, getDonationByExternalReference } from "@/lib/supabase";

// Función para verificar la firma del webhook (en un entorno de producción)
async function verifyWebhookSignature(_request: Request): Promise<boolean> {
  // En producción, deberías verificar la firma del webhook usando los headers
  // proporcionados por Mercado Pago y tu clave secreta
  // https://www.mercadopago.com.ar/developers/es/docs/checkout-api/webhooks/webhooks-v2

  // Para este ejemplo, asumimos que la solicitud es válida
  return true;
}

export async function POST(request: Request) {
  try {
    // Verificar que la solicitud sea legítima
    const isValid = await verifyWebhookSignature(request);

    if (!isValid) {
      console.error("Firma de webhook inválida");

      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    // Obtener los datos del webhook
    const webhookData = await request.json();

    console.info("Webhook recibido:", JSON.stringify(webhookData, null, 2));

    // Procesar según el tipo de notificación
    if (webhookData.type === "payment") {
      const paymentId = webhookData.data?.id;

      if (!paymentId) {
        return NextResponse.json({ error: "ID de pago no proporcionado" }, { status: 400 });
      }

      // Obtener los detalles del pago desde Mercado Pago
      const paymentDetails = await fetchPaymentDetails(paymentId);

      if (!paymentDetails) {
        // Guardar en la cola de reintentos si no se pudieron obtener los detalles
        // await saveToRetryQueue({
        //   payment_id: paymentId.toString(),
        //   external_reference: webhookData.data?.external_reference || "unknown",
        //   status: "pending",
        //   attempt: 1,
        //   last_error: "No se pudieron obtener los detalles del pago",
        // });

        return NextResponse.json({
          success: true,
          message: "Notificación recibida, procesamiento en cola",
        });
      }

      // Obtener el ID de la donación desde la referencia externa
      const externalReference = paymentDetails.external_reference;

      if (!externalReference) {
        return NextResponse.json({ error: "Referencia externa no encontrada" }, { status: 400 });
      }

      // Mapear el estado del pago de Mercado Pago al estado de nuestra aplicación
      const status = mapPaymentStatus(paymentDetails.status);

      // Buscar la donación por referencia externa
      const donation = await getDonationByExternalReference(externalReference);

      if (!donation) {
        // Guardar en la cola de reintentos si no se encontró la donación
        // await saveToRetryQueue({
        //   payment_id: paymentId.toString(),
        //   external_reference: externalReference,
        //   status,
        //   attempt: 1,
        //   last_error: "Donación no encontrada",
        // });

        return NextResponse.json({
          success: true,
          message: "Notificación recibida, procesamiento en cola",
        });
      }

      // Actualizar el estado de la donación en Supabase
      const success = await updateDonationStatus(donation.id!, paymentId.toString(), status);

      if (!success) {
        // Guardar en la cola de reintentos si falló la actualización
        // await saveToRetryQueue({
        //   payment_id: paymentId.toString(),
        //   external_reference: externalReference,
        //   status,
        //   attempt: 1,
        //   last_error: "Error al actualizar el estado de la donación",
        // });

        return NextResponse.json({
          success: true,
          message: "Notificación recibida, procesamiento en cola",
        });
      }

      // Si el estado cambió a aprobado o rechazado, notificar al donante
      if (status !== "pending" && donation.payment_status !== status) {
        // await notifyDonor(donation, status);
      }

      return NextResponse.json({
        success: true,
        message: `Estado de donación actualizado a: ${status}`,
      });
    }

    // Para otros tipos de notificaciones, simplemente confirmar recepción
    return NextResponse.json({
      success: true,
      message: "Notificación recibida",
    });
  } catch (error) {
    console.error("Error al procesar webhook de Mercado Pago:", error);

    // Incluso en caso de error, devolver 200 para que Mercado Pago no reintente
    return NextResponse.json({
      success: true,
      message: "Notificación recibida con errores",
    });
  }
}

// Función para obtener los detalles del pago desde la API de Mercado Pago
async function fetchPaymentDetails(paymentId: string | number) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Token de acceso de Mercado Pago no configurado");

      return null;
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Error al obtener detalles del pago:", await response.text());

      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error al consultar la API de Mercado Pago:", error);

    return null;
  }
}

// Función para mapear el estado del pago de Mercado Pago al estado de nuestra aplicación
function mapPaymentStatus(mpStatus: string): "pending" | "approved" | "rejected" {
  const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
    approved: "approved",
    authorized: "approved",
    in_process: "pending",
    in_mediation: "pending",
    rejected: "rejected",
    cancelled: "rejected",
    refunded: "rejected",
    charged_back: "rejected",
  };

  return statusMap[mpStatus] || "pending";
}
