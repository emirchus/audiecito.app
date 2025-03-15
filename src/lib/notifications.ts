import type {Donation} from "./supabase";

// Función para registrar notificaciones (sin envío de email)
export async function notifyDonor(
  donation: Donation,
  status: "approved" | "rejected",
): Promise<boolean> {
  try {
    // Simplemente registramos la notificación en los logs
    console.log(`[NOTIFICACIÓN] Donación ${donation.id} cambió a estado: ${status}`);

    // Aquí podrías implementar otras formas de notificación si lo deseas
    // Por ejemplo, guardar en una tabla de notificaciones en Supabase

    return true;
  } catch (error) {
    console.error("Error al registrar notificación:", error);

    return false;
  }
}
