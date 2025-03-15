import {NextResponse} from "next/server";

import {saveCredentials, validateCredentials} from "@/lib/integration";
import {getSession} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verificar si el usuario está autenticado
    const session = await getSession();

    if (!session) {
      return NextResponse.json({error: "No autorizado"}, {status: 401});
    }

    // Verificar si el usuario es administrador
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {error: "No tienes permisos para realizar esta acción"},
        {status: 403},
      );
    }

    const {accessToken, publicKey} = await request.json();

    if (!accessToken || !publicKey) {
      return NextResponse.json(
        {error: "Access Token y Public Key son obligatorios"},
        {status: 400},
      );
    }

    // Validar las credenciales antes de guardarlas
    const isValid = await validateCredentials(accessToken, publicKey);

    if (!isValid) {
      return NextResponse.json(
        {error: "Las credenciales proporcionadas no son válidas"},
        {status: 400},
      );
    }

    // Guardar las credenciales
    await saveCredentials(accessToken, publicKey);

    return NextResponse.json({
      success: true,
      message: "Credenciales guardadas correctamente",
    });
  } catch (error) {
    console.error("Error al guardar las credenciales:", error);

    return NextResponse.json({error: "Error al guardar las credenciales"}, {status: 500});
  }
}
