import {NextResponse} from "next/server";

import {getSession} from "@/lib/auth";

export async function GET() {
  try {
    // Obtener la sesión actual
    const session = await getSession();

    // Devolver la sesión como JSON
    return NextResponse.json({session});
  } catch (error) {
    console.error("Error al obtener la sesión:", error);

    return NextResponse.json({error: "Error al obtener la sesión"}, {status: 500});
  }
}
