"use client";

import type {Donation} from "@/lib/supabase";

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

interface PendingDetailsProps {
  className?: string;
}

export function PendingDetails({className}: PendingDetailsProps) {
  const searchParams = useSearchParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: "",
    paymentType: "",
  });

  useEffect(() => {
    async function fetchDonationDetails() {
      try {
        const donationId = searchParams.get("donation_id");
        const payment_id = searchParams.get("payment_id") || "N/A";
        const payment_type = searchParams.get("payment_type") || "N/A";

        setPaymentDetails({
          paymentId: payment_id,
          paymentType: payment_type,
        });

        // Si tenemos un ID de donación, obtener los detalles
        if (donationId) {
          const response = await fetch(`/api/get-donation?id=${donationId}`);

          if (response.ok) {
            const data = await response.json();

            setDonation(data.donation);

            // Si tenemos un ID de pago, actualizar el estado de la donación
            if (payment_id !== "N/A") {
              await fetch("/api/update-donation", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  donationId,
                  paymentId: payment_id,
                  status: "pending",
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
    <div className={`rounded-md border border-yellow-200 bg-yellow-50 p-4 text-left ${className}`}>
      <h3 className="mb-2 font-medium text-yellow-700">Detalles del Pago</h3>
      <p className="text-sm">
        ID de Pago: <span className="font-medium">{paymentDetails.paymentId}</span>
      </p>
      <p className="text-sm">
        Tipo de Pago: <span className="font-medium capitalize">{paymentDetails.paymentType}</span>
      </p>

      {donation && (
        <div className="mt-3 border-t border-yellow-200 pt-3">
          <p className="text-sm">
            Monto: <span className="font-medium">${donation.amount}</span>
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
        </div>
      )}
    </div>
  );
}
