"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {createClient} from "./supabase/server";

interface RetryQueueItem {
  payment_id: string;
  external_reference: string;
  status: "pending" | "approved" | "rejected";
  attempt: number;
  last_error?: string;
}

// Función para guardar un item en la cola de reintentos
export async function saveToRetryQueue(item: RetryQueueItem): Promise<boolean> {
  try {
    // Calcular el tiempo para el próximo reintento usando backoff exponencial
    const nextRetryMinutes = Math.pow(2, item.attempt - 1) * 5; // 5, 10, 20, 40 minutos...
    const nextRetryAt = new Date(Date.now() + nextRetryMinutes * 60 * 1000);
    const supabase = await createClient();
    const {error} = await supabase.from("webhook_retry_queue").insert({
      payment_id: item.payment_id,
      external_reference: item.external_reference,
      status: item.status,
      attempt: item.attempt,
      last_error: item.last_error,
      next_retry_at: nextRetryAt.toISOString(),
    });

    if (error) {
      console.error("Error al guardar en la cola de reintentos:", error);

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al procesar la cola de reintentos:", error);

    return false;
  }
}

// Función para marcar un item como procesado
export async function markRetryItemAsProcessed(id: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {error} = await supabase
      .from("webhook_retry_queue")
      .update({processed: true})
      .eq("id", id);

    if (error) {
      console.error("Error al marcar item como procesado:", error);

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al actualizar la cola de reintentos:", error);

    return false;
  }
}

// Función para obtener items pendientes de reprocesamiento
export async function getPendingRetryItems(limit = 10): Promise<any[]> {
  try {
    const supabase = await createClient();
    const {data, error} = await supabase
      .from("webhook_retry_queue")
      .select("*")
      .eq("processed", false)
      .lte("next_retry_at", new Date().toISOString())
      .order("next_retry_at", {ascending: true})
      .limit(limit);

    if (error) {
      console.error("Error al obtener items pendientes:", error);

      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error al consultar la cola de reintentos:", error);

    return [];
  }
}
