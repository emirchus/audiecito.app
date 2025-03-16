/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";

import { createClient } from "@/lib/supabase/server";

// Tipo para el estado de la integración
interface IntegrationStatus {
  connected: boolean;
  accessToken: boolean;
  publicKey: boolean;
  webhookConfigured: boolean;
  lastChecked: string | null;
}

// Función para obtener el estado de la integración
export const getIntegrationStatus = async (): Promise<IntegrationStatus> => {
  const supabase = await createClient();

  // Obtener el estado de la integración
  const { data: status } = await supabase.from("integration_status").select("*").single();

  // Obtener las credenciales
  const { data: credentials } = await supabase.from("integration_credentials").select("*").single();

  return {
    connected: status?.connected ?? false,
    accessToken: Boolean(credentials?.access_token),
    publicKey: Boolean(credentials?.public_key),
    webhookConfigured: status?.webhook_configured ?? false,
    lastChecked: status?.last_checked ?? null,
  };
};

// Función para guardar el estado de la integración
export async function saveIntegrationStatus(status: IntegrationStatus): Promise<void> {
  try {
    const supabase = await createClient();
    // Verificar si ya existe un registro
    const { data: existingStatus } = await supabase
      .from("integration_status")
      .select("id")
      .single();

    if (existingStatus) {
      // Actualizar el registro existente
      await supabase
        .from("integration_status")
        .update({
          connected: status.connected,
          access_token_valid: status.accessToken,
          public_key_valid: status.publicKey,
          webhook_configured: status.webhookConfigured,
          last_checked: status.lastChecked,
        })
        .eq("id", existingStatus.id);
    } else {
      // Crear un nuevo registro
      await supabase.from("integration_status").insert({
        connected: status.connected,
        access_token_valid: status.accessToken,
        public_key_valid: status.publicKey,
        webhook_configured: status.webhookConfigured,
        last_checked: status.lastChecked,
      });
    }
  } catch (error) {
    console.error("Error al guardar el estado de la integración:", error);
  }
}

// Función para verificar el Access Token
async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    if (!accessToken) return false;

    // Intentar obtener información de la cuenta
    const response = await fetch("https://api.mercadopago.com/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error al verificar el Access Token:", error);

    return false;
  }
}

// Función para verificar el webhook
export async function verifyWebhook(accessToken: string): Promise<boolean> {
  try {
    if (!accessToken) return false;

    // Obtener los webhooks configurados
    const response = await fetch("https://api.mercadopago.com/v1/webhooks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return false;

    const webhooks = await response.json();

    // Verificar si hay algún webhook configurado para nuestra URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const webhookUrl = `${baseUrl}/api/webhooks/mercadopago`;

    return webhooks.some((webhook: any) => webhook.url === webhookUrl);
  } catch (error) {
    console.error("Error al verificar el webhook:", error);

    return false;
  }
}

// Función para validar las credenciales
export async function validateCredentials(
  accessToken: string,
  publicKey: string,
): Promise<boolean> {
  try {
    // Verificar el Access Token
    const isAccessTokenValid = await verifyAccessToken(accessToken);

    // Si el Access Token no es válido, las credenciales no son válidas
    if (!isAccessTokenValid) return false;

    // Verificar que la Public Key tenga el formato correcto
    const publicKeyRegex =
      /^APP_USR-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isPublicKeyValid = publicKeyRegex.test(publicKey);

    return isPublicKeyValid;
  } catch (error) {
    console.error("Error al validar las credenciales:", error);

    return false;
  }
}

// Función para guardar las credenciales
export async function saveCredentials(accessToken: string, publicKey: string): Promise<void> {
  try {
    const supabase = await createClient();
    // Verificar si ya existen credenciales
    const { data: existingCredentials } = await supabase
      .from("integration_credentials")
      .select("id")
      .single();

    if (existingCredentials) {
      // Actualizar las credenciales existentes
      await supabase
        .from("integration_credentials")
        .update({
          access_token: accessToken,
          public_key: publicKey,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCredentials.id);
    } else {
      // Crear nuevas credenciales
      await supabase.from("integration_credentials").insert({
        access_token: accessToken,
        public_key: publicKey,
      });
    }

    // Actualizar las variables de entorno en Vercel (esto solo funcionaría en un entorno real)
    // En este ejemplo, simplemente actualizamos las variables en el cliente de Supabase
    await supabase.from("environment_variables").upsert(
      [
        {
          key: "MERCADO_PAGO_ACCESS_TOKEN",
          value: accessToken,
        },
        {
          key: "NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY",
          value: publicKey,
        },
      ],
      {
        onConflict: "key",
      },
    );
  } catch (error) {
    console.error("Error al guardar las credenciales:", error);
    throw error;
  }
}

// Función para configurar el webhook
export async function configureWebhook(
  webhookUrl: string,
): Promise<{ success: boolean; error?: string; webhookId?: string }> {
  try {
    const supabase = await createClient();
    // Obtener el Access Token
    const { data: credentials } = await supabase
      .from("integration_credentials")
      .select("access_token")
      .single();

    if (!credentials || !credentials.access_token) {
      return {
        success: false,
        error: "No se encontró el Access Token",
      };
    }

    // Verificar si ya existe un webhook configurado
    const response = await fetch("https://api.mercadopago.com/v1/webhooks", {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Error al obtener los webhooks configurados",
      };
    }

    const webhooks = await response.json();

    // Buscar si ya existe un webhook para nuestra URL

    const existingWebhook = webhooks.find((webhook: any) => webhook.url === webhookUrl);

    if (existingWebhook) {
      // El webhook ya está configurado
      return {
        success: true,
        webhookId: existingWebhook.id,
      };
    }

    // Crear un nuevo webhook
    const createResponse = await fetch("https://api.mercadopago.com/v1/webhooks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: ["payment"],
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();

      return {
        success: false,
        error: errorData.message || "Error al crear el webhook",
      };
    }

    const newWebhook = await createResponse.json();

    return {
      success: true,
      webhookId: newWebhook.id,
    };
  } catch (error) {
    console.error("Error al configurar el webhook:", error);

    return {
      success: false,
      error: "Error al configurar el webhook",
    };
  }
}

// Función para crear una donación de prueba
export async function createTestDonation(
  amount: number,
): Promise<{ success: boolean; error?: string; checkoutUrl?: string }> {
  try {
    const supabase = await createClient();
    // Obtener las credenciales
    const { data: credentials } = await supabase
      .from("integration_credentials")
      .select("*")
      .single();

    if (!credentials) {
      return {
        success: false,
        error: "No se encontraron las credenciales",
      };
    }

    // Generar un ID único para la donación
    const externalReference = uuidv4();

    // Crear un registro de donación en Supabase
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        amount,
        username: "Usuario de Prueba",
        is_anonymous: false,
        payment_status: "pending",
        external_reference: externalReference,
      })
      .select("id")
      .single();

    if (donationError || !donation) {
      return {
        success: false,
        error: "Error al crear el registro de donación",
      };
    }

    // Crear la preferencia en Mercado Pago
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const preferenceData = {
      items: [
        {
          title: "Donación de Prueba",
          quantity: 1,
          currency_id: "ARS",
          unit_price: amount,
        },
      ],
      back_urls: {
        success: `${baseUrl}/success?donation_id=${donation.id}`,
        failure: `${baseUrl}/failure?donation_id=${donation.id}`,
        pending: `${baseUrl}/pending?donation_id=${donation.id}`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      metadata: {
        donation_id: donation.id,
        test: true,
      },
    };

    // Crear la preferencia en Mercado Pago
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        success: false,
        error: errorData.message || "Error al crear la preferencia de pago",
      };
    }

    const preference = await response.json();

    return {
      success: true,
      checkoutUrl: preference.init_point,
    };
  } catch (error) {
    console.error("Error al crear la donación de prueba:", error);

    return {
      success: false,
      error: "Error al crear la donación de prueba",
    };
  }
}
