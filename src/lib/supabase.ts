"use server";

import {createClient} from "./supabase/server";

// Agregar la definición del tipo Donation si no existe
// Agregar al inicio del archivo (después de las importaciones):

export interface Donation {
  id?: string;
  amount: number;
  username: string | null;
  is_anonymous: boolean;
  audio_url: string | null;
  payment_id: string | null;
  payment_status: string;
  external_reference?: string;
  created_at?: string;
  updated_at?: string;
}

// Actualizar la función updateDonationStatus para registrar el historial de cambios

// Función para actualizar el estado de una donación
export async function updateDonationStatus(
  donationId: string,
  paymentId: string,
  status: "pending" | "approved" | "rejected",
): Promise<boolean> {
  try {
    const supabase = await createClient();
    // Primero obtener el estado actual
    const {data: currentDonation, error: fetchError} = await supabase
      .from("donations")
      .select("payment_status")
      .eq("id", donationId)
      .single();

    if (fetchError) {
      console.error("Error al obtener el estado actual de la donación:", fetchError);

      return false;
    }

    // Si el estado no ha cambiado, no hacer nada
    if (currentDonation && currentDonation.payment_status === status) {
      return true;
    }

    // Actualizar el estado
    const {error: updateError} = await supabase
      .from("donations")
      .update({
        payment_id: paymentId,
        payment_status: status,
      })
      .eq("id", donationId);

    if (updateError) {
      console.error("Error al actualizar estado de donación:", updateError);

      return false;
    }

    // Registrar el cambio en el historial
    if (currentDonation) {
      const {error: historyError} = await supabase.from("donation_status_history").insert({
        donation_id: donationId,
        previous_status: currentDonation.payment_status,
        new_status: status,
        payment_id: paymentId,
      });

      if (historyError) {
        console.error("Error al registrar historial de estado:", historyError);
        // No fallamos la operación completa si solo falla el historial
      }
    }

    return true;
  } catch (error) {
    console.error("Error al procesar la actualización de donación:", error);

    return false;
  }
}

// Función para obtener el historial de estados de una donación
export async function getDonationStatusHistory(donationId: string) {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from("donation_status_history")
      .select("*")
      .eq("donation_id", donationId)
      .order("created_at", {ascending: false});

    if (error) {
      console.error("Error al obtener historial de estados:", error);

      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error al procesar la consulta de historial:", error);

    return [];
  }
}

// Agregar las funciones que podrían faltar

// Función para obtener una donación por ID
export async function getDonationById(donationId: string) {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from("donations")
      .select("*")
      .eq("id", donationId)
      .single();

    if (error) {
      console.error("Error al obtener donación por ID:", error);

      return null;
    }

    return data as Donation;
  } catch (error) {
    console.error("Error al procesar la consulta de donación:", error);

    return null;
  }
}

// Función para obtener una donación por referencia externa
export async function getDonationByExternalReference(externalReference: string) {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from("donations")
      .select("*")
      .eq("external_reference", externalReference)
      .single();

    if (error) {
      console.error("Error al obtener donación por referencia externa:", error);

      return null;
    }

    return data as Donation;
  } catch (error) {
    console.error("Error al procesar la consulta de donación:", error);

    return null;
  }
}

// Función para obtener todas las donaciones
export async function getAllDonations() {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from("donations")
      .select("*")
      .order("created_at", {ascending: false});

    if (error) {
      console.error("Error al obtener todas las donaciones:", error);

      return [];
    }

    return data as Donation[];
  } catch (error) {
    console.error("Error al procesar la consulta de donaciones:", error);

    return [];
  }
}

// Función para subir un archivo de audio a Supabase Storage
export async function uploadAudio(audioBlob: Blob): Promise<string | null> {
  try {
    const supabase = await createClient();
    const fileName = `audio_${Date.now()}.wav`;
    const {data, error} = await supabase.storage
      .from("audio-messages")
      .upload(fileName, audioBlob, {
        contentType: "audio/wav",
      });

    if (error) {
      console.error("Error al subir audio:", error);

      return null;
    }

    // Obtener la URL pública del archivo
    const {data: publicUrlData} = supabase.storage.from("audio-messages").getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error al procesar la subida de audio:", error);

    return null;
  }
}
