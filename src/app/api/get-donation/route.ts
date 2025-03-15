import {NextResponse} from "next/server";

import {getDonationById} from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const donationId = url.searchParams.get("id");

    if (!donationId) {
      return NextResponse.json({error: "ID de donación no proporcionado"}, {status: 400});
    }

    // Obtener la donación de Supabase
    const donation = await getDonationById(donationId);

    if (!donation) {
      return NextResponse.json({error: "Donación no encontrada"}, {status: 404});
    }

    return NextResponse.json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Error al obtener la donación:", error);

    return NextResponse.json({error: "Error al obtener la donación"}, {status: 500});
  }
}
