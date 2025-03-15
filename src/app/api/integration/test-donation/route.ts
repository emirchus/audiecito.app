import {NextResponse} from "next/server";

import {createTestDonation} from "@/lib/integration";
import {getSession} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getSession();

    if (!session) {
      return NextResponse.json({error: "No autorizado"}, {status: 401});
    }

    const {amount} = await request.json();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({error: "Monto inválido"}, {status: 400});
    }

    // Crear una donación de prueba
    const result = await createTestDonation(Number(amount));

    if (!result.success) {
      return NextResponse.json(
        {error: result.error || "Error al crear la donación de prueba"},
        {status: 400},
      );
    }

    return NextResponse.json({
      success: true,
      message: "Donación de prueba creada correctamente",
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error) {
    console.error("Error al crear la donación de prueba:", error);

    return NextResponse.json({error: "Error al crear la donación de prueba"}, {status: 500});
  }
}
