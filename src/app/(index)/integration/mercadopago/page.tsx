import {redirect} from "next/navigation";

import {getSession} from "@/lib/auth";

export default async function MercadoPagoCallback({
  searchParams,
}: {
  searchParams: {code?: string; state?: string};
}) {
  // Verificar si el usuario está autenticado
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Verificar que el código de autorización esté presente
  if (!searchParams.code) {
    redirect("/integration?error=missing_code");
  }

  try {
    // Enviar el código de autorización al backend para obtener los tokens
    const response = await fetch("/api/integration/mercadopago/oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: searchParams.code,
        state: searchParams.state,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al procesar la autorización");
    }

    // Redireccionar a la página de integración con éxito
    redirect("/integration?success=true");
  } catch (error) {
    console.error("Error en callback de MercadoPago:", error);
    redirect("/integration?error=auth_failed");
  }
}
