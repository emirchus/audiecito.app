"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {CreditCard} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {initMercadoPago, createDonation} from "@/lib/mercado-pago";
import {AudioRecorder} from "@/components/audio-recorder";

export function DonationForm() {
  const [amount, setAmount] = useState<string>("100");
  const [username, setUsername] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle donation submission
  const handleDonation = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Por favor, ingresá un monto válido");

      return;
    }

    if (!isAnonymous && !username.trim()) {
      alert("Por favor, ingresá tu nombre o marcá la opción de donación anónima");

      return;
    }

    setIsLoading(true);
    try {
      // Initialize Mercado Pago
      await initMercadoPago();

      // Create donation and redirect to Mercado Pago checkout
      const checkoutUrl = await createDonation(
        Number.parseFloat(amount),
        audioBlob,
        isAnonymous ? null : username,
      );

      // Redirect to Mercado Pago checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Error al crear la URL de pago");
      }
    } catch (error) {
      console.error("Error al procesar la donación:", error);
      alert("Hubo un error al procesar tu donación. Por favor, intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Monto de la Donación (ARS)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            className="pl-8"
            id="amount"
            min="1"
            placeholder="100"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Tu Nombre</Label>
        <Input
          disabled={isAnonymous}
          id="username"
          placeholder="Juan Pérez"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="mt-2 flex items-center space-x-2">
          <Checkbox
            checked={isAnonymous}
            id="anonymous"
            onCheckedChange={(checked) => {
              setIsAnonymous(checked === true);
              if (checked) setUsername("");
            }}
          />
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="anonymous"
          >
            Hacer donación anónima
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mensaje de Audio (Opcional)</Label>
        <AudioRecorder onAudioRecorded={setAudioBlob} />
      </div>

      <Button
        className="flex w-full items-center gap-2"
        disabled={isLoading}
        onClick={handleDonation}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Procesando...
          </div>
        ) : (
          <>
            <CreditCard className="h-4 w-4" /> Donar Ahora
          </>
        )}
      </Button>
    </div>
  );
}
