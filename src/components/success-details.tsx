"use client";

import type { Donation } from "@/lib/supabase";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SuccessDetailsProps {
  className?: string;
}

export function SuccessDetails({ className }: SuccessDetailsProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDonationDetails() {
      try {
        const donationId = searchParams.get("donation_id");
        const paymentId = searchParams.get("payment_id");

        if (!donationId) {
          setError("No se encontró el ID de la donación");
          setIsLoading(false);

          return;
        }

        // Obtener detalles de la donación desde la API
        const response = await fetch(`/api/get-donation?id=${donationId}`);

        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la donación");
        }

        const data = await response.json();

        setDonation(data.donation);

        // Si tenemos un ID de pago, actualizar el estado de la donación
        if (paymentId) {
          await fetch("/api/update-donation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              donationId,
              paymentId,
              status: "approved",
            }),
          });
        }
      } catch (err) {
        console.error("Error al cargar los detalles de la donación:", err);
        setError("No se pudieron cargar los detalles de la donación");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDonationDetails();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className={`bg-muted rounded-md p-4 text-center ${className}`}>
        <p>Cargando detalles de la donación...</p>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className={`bg-destructive/10 rounded-md p-4 text-center ${className}`}>
        <p className="text-destructive">{error || "No se encontraron detalles de la donación"}</p>
      </div>
    );
  }

  return (
    <div className={`bg-muted rounded-md p-4 text-left ${className}`}>
      <h3 className="mb-2 font-medium">Detalles de la Donación</h3>
      <p className="text-sm">
        Monto: <span className="font-medium">${donation.amount}</span>
      </p>
      <p className="text-sm">
        ID de Pago: <span className="font-medium">{donation.payment_id || "Pendiente"}</span>
      </p>
      <p className="text-sm">
        Estado: <span className="font-medium capitalize">{donation.payment_status}</span>
      </p>
      {!donation.is_anonymous && donation.username && (
        <p className="text-sm">
          Donante: <span className="font-medium">{donation.username}</span>
        </p>
      )}
      {donation.is_anonymous && (
        <p className="text-sm">
          Donante: <span className="font-medium">Anónimo</span>
        </p>
      )}
      {donation.audio_url && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-medium">Mensaje de audio:</p>
          <audio controls className="mt-1 w-full" src={donation.audio_url}>
            <track kind="captions" src={donation.audio_url} />
          </audio>
        </div>
      )}
    </div>
  );
}
