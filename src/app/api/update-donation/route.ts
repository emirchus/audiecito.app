import { NextResponse } from "next/server";

import { updateDonationStatus } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { donationId, paymentId, status } = await request.json();

    if (!donationId || !paymentId || !status) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    // Validar el estado
    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Estado de pago inválido" }, { status: 400 });
    }

    // Actualizar el estado de la donación en Supabase
    const success = await updateDonationStatus(
      donationId,
      paymentId,
      status as "pending" | "approved" | "rejected",
    );

    if (!success) {
      return NextResponse.json(
        { error: "Error al actualizar el estado de la donación" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Estado de donación actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la donación:", error);

    return NextResponse.json({ error: "Error al actualizar la donación" }, { status: 500 });
  }
}
