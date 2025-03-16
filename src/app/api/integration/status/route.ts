import { NextResponse } from "next/server";

import { getIntegrationStatus } from "@/lib/integration";
import { getSession } from "@/lib/auth";

export async function GET(_request: Request) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a esta información" },
        { status: 403 },
      );
    }

    const status = await getIntegrationStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error al obtener el estado de la integración:", error);

    return NextResponse.json(
      { error: "Error al obtener el estado de la integración" },
      { status: 500 },
    );
  }
}

export async function POST(_request: Request) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 },
      );
    }

    const status = await getIntegrationStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error al actualizar el estado de la integración:", error);

    return NextResponse.json(
      { error: "Error al actualizar el estado de la integración" },
      { status: 500 },
    );
  }
}
