import {NextResponse} from "next/server";

import {signInWithEmailAndPasswordAction} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const {email, password} = await request.json();

    if (!email || !password) {
      return NextResponse.json({error: "Email y contraseña son obligatorios"}, {status: 400});
    }

    // En una implementación real, verificarías las credenciales
    // Por ahora, aceptamos cualquier combinación para pruebas
    // Pero recomendamos usar la sugerida: admin@example.com / password

    // Iniciar sesión
    const session = await signInWithEmailAndPasswordAction(email, password);

    console.log(session);

    // Devolver la sesión
    return NextResponse.json({success: true, session});
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return NextResponse.json({error: "Error al iniciar sesión"}, {status: 500});
  }
}
