import { NextResponse } from "next/server";

import { signOutAction } from "@/lib/auth";

export async function POST() {
  try {
    // Cerrar la sesión
    await signOutAction();

    // Devolver respuesta exitosa
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);

    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 });
  }
}
