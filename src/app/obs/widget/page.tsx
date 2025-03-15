"use client";

import type {Donation} from "@/lib/supabase";

import {useEffect, useState, useRef} from "react";
import {createClient} from "@supabase/supabase-js";

import {DonationAlert} from "@/components/donation-alert";

export default function OBSWidget() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const donationQueueRef = useRef<Donation[]>([]);
  const processingRef = useRef(false);

  // Inicializar cliente de Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Procesar la cola de donaciones
  const processDonationQueue = async () => {
    if (processingRef.current || donationQueueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;

    // Obtener la siguiente donación de la cola
    const nextDonation = donationQueueRef.current.shift();

    setCurrentDonation(nextDonation || null);

    if (nextDonation) {
      // Mostrar la alerta
      setIsShowingAlert(true);

      // Esperar a que termine la alerta (incluye el tiempo de reproducción del audio)
      // Mínimo 10 segundos entre alertas
      setTimeout(() => {
        setIsShowingAlert(false);

        // Esperar 2 segundos adicionales antes de procesar la siguiente donación
        setTimeout(() => {
          processingRef.current = false;
          processDonationQueue(); // Procesar la siguiente donación
        }, 2000);
      }, 10000); // 10 segundos mínimo
    } else {
      processingRef.current = false;
    }
  };

  // Agregar una donación a la cola
  const addToQueue = (donation: Donation) => {
    // Solo agregar donaciones aprobadas y que no estén ya en la cola
    if (
      donation.payment_status === "approved" &&
      !donationQueueRef.current.some((d) => d.id === donation.id) &&
      (!currentDonation || currentDonation.id !== donation.id)
    ) {
      donationQueueRef.current.push(donation);
      setDonations([...donationQueueRef.current]); // Actualizar estado para UI

      // Iniciar procesamiento si no está en curso
      if (!processingRef.current) {
        processDonationQueue();
      }
    }
  };

  // Escuchar cambios en tiempo real
  useEffect(() => {
    // Cargar donaciones aprobadas recientes al inicio
    const loadRecentDonations = async () => {
      const {data} = await supabase
        .from("donations")
        .select("*")
        .eq("payment_status", "approved")
        .order("created_at", {ascending: false})
        .limit(5);

      if (data && data.length > 0) {
        // Agregar la donación más reciente a la cola
        addToQueue(data[0] as Donation);
      }
    };

    loadRecentDonations();

    // Suscribirse a cambios en la tabla de donaciones
    const subscription = supabase
      .channel("donations-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "donations",
          filter: "payment_status=eq.approved",
        },
        (payload) => {
          // Cuando una donación cambia a aprobada, agregarla a la cola
          const newDonation = payload.new as Donation;

          addToQueue(newDonation);
        },
      )
      .subscribe();

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [addToQueue, supabase]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Widget transparente cuando no hay alertas */}
      {!isShowingAlert && <div className="pointer-events-none absolute inset-0" />}

      {/* Alerta de donación */}
      {isShowingAlert && currentDonation && <DonationAlert donation={currentDonation} />}
    </div>
  );
}
