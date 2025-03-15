"use client";

import {useState} from "react";
import {Loader2, AlertCircle, CheckCircle} from "lucide-react";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface TestDonationProps {
  isIntegrationReady: boolean;
}

export function TestDonation({isIntegrationReady}: TestDonationProps) {
  const [amount, setAmount] = useState("10");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testPaymentUrl, setTestPaymentUrl] = useState<string | null>(null);

  const createTestDonation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setTestPaymentUrl(null);

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError("Por favor, ingresa un monto válido");

        return;
      }

      const response = await fetch("/api/integration/test-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setSuccess("Donación de prueba creada correctamente");
        setTestPaymentUrl(data.checkoutUrl);
      } else {
        const data = await response.json();

        setError(data.error || "Error al crear la donación de prueba");
      }
    } catch (error) {
      console.error("Error al crear donación de prueba:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isIntegrationReady) {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integración incompleta</AlertTitle>
        <AlertDescription>
          Para realizar pruebas, primero debes configurar las credenciales y el webhook de Mercado
          Pago.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Modo de prueba</AlertTitle>
        <AlertDescription>
          Estas pruebas se realizan en modo de producción pero puedes usar las tarjetas de prueba de
          Mercado Pago.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="testAmount">Monto de prueba (ARS)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            className="pl-8"
            id="testAmount"
            min="1"
            placeholder="10"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">¡Éxito!</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Button className="w-full" disabled={isLoading} onClick={createTestDonation}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando donación...
          </>
        ) : (
          "Crear Donación de Prueba"
        )}
      </Button>

      {testPaymentUrl && (
        <div className="pt-4">
          <Alert>
            <AlertTitle>Donación creada</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Haz clic en el botón para completar el pago de prueba:</p>
              <Button className="w-full" onClick={() => window.open(testPaymentUrl, "_blank")}>
                Ir a Mercado Pago
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
