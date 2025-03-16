import { NextResponse } from "next/server";

import { configureWebhook } from "@/lib/integration";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
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

    const { webhookUrl } = await request.json();

    if (!webhookUrl) {
      return NextResponse.json({ error: "URL del webhook es obligatoria" }, { status: 400 });
    }

    // Configurar el webhook en Mercado Pago
    const result = await configureWebhook(webhookUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Error al configurar el webhook" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Webhook configurado correctamente",
      webhookId: result.webhookId,
    });
  } catch (error) {
    console.error("Error al configurar el webhook:", error);

    return NextResponse.json({ error: "Error al configurar el webhook" }, { status: 500 });
  }
}
