import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { OBSConfigPage } from "@/components/obs-config-page";

export default async function OBSConfigRoute() {
  // Verificar si el usuario está autenticado
  const session = await getSession();

  // Si no hay sesión, redirigir al login
  if (!session) {
    redirect("/login");
  }

  // Renderizar la página de configuración de OBS
  return <OBSConfigPage />;
}
