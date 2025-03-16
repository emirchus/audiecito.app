"use client";

import type { Donation } from "@/lib/supabase";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface FailureDetailsProps {
  className?: string;
}

export function FailureDetails({ className }: FailureDetailsProps) {
  const searchParams = useSearchParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [errorDetails, setErrorDetails] = useState({
    errorCode: "",
    errorMessage: "",
  });

  useEffect(() => {
    async function fetchDonationDetails() {
      try {
        const donationId = searchParams.get("donation_id");
        const error = searchParams.get("error") || "unknown_error";
        const paymentId = searchParams.get("payment_id");

        // Map error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
          rejected: "Tu pago fue rechazado. Por favor, intentá con otro método de pago.",
          cc_rejected_insufficient_amount:
            "Fondos insuficientes. Por favor, probá con otra tarjeta.",
          cc_rejected_bad_filled_security_code: "El código de seguridad es incorrecto.",
          cc_rejected_bad_filled_date: "La fecha de vencimiento de la tarjeta es incorrecta.",
          cc_rejected_bad_filled_other: "Hubo un error con los datos de tu tarjeta.",
          unknown_error: "Hubo un error desconocido al procesar tu pago.",
        };

        setErrorDetails({
          errorCode: error,
          errorMessage: errorMessages[error] || errorMessages["unknown_error"],
        });

        // Si tenemos un ID de donación, obtener los detalles
        if (donationId) {
          const response = await fetch(`/api/get-donation?id=${donationId}`);

          if (response.ok) {
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
                  status: "rejected",
                }),
              });
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar los detalles de la donación:", err);
      }
    }

    fetchDonationDetails();
  }, [searchParams]);

  return (
    <div className={`bg-destructive/10 rounded-md p-4 text-left ${className}`}>
      <p className="text-destructive text-sm">{errorDetails.errorMessage}</p>
      {errorDetails.errorCode && (
        <p className="text-muted-foreground mt-2 text-xs">
          Código de error: {errorDetails.errorCode}
        </p>
      )}

      {donation && (
        <div className="border-destructive/20 mt-3 border-t pt-3">
          <p className="text-sm">
            Monto: <span className="font-medium">${donation.amount}</span>
          </p>
          {!donation.is_anonymous && donation.username && (
            <p className="text-sm">
              Donante: <span className="font-medium">{donation.username}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
