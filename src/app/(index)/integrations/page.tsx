import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getIntegrationStatus } from "@/lib/integration";
import { IntegrationPageClient } from "@/app/(index)/integrations/components/integration-page-client";

export default async function IntegrationPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const initialStatus = await getIntegrationStatus();

  // Renderizar la página de integración
  return <IntegrationPageClient initialStatus={initialStatus} />;
}
