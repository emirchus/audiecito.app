import {redirect} from "next/navigation";

import {getSession} from "@/lib/auth";
import {getIntegrationStatus} from "@/lib/integration";
import {IntegrationPageClient} from "@/app/(index)/integration/components/integration-page-client";

export default async function IntegrationPage() {
  // Verificar si el usuario está autenticado
  const session = await getSession();

  // Si no hay sesión, redirigir al login
  if (!session) {
    redirect("/login");
  }

  // Obtener el estado inicial de la integración
  const initialStatus = await getIntegrationStatus();

  // Renderizar la página de integración
  return <IntegrationPageClient initialStatus={initialStatus} />;
}
