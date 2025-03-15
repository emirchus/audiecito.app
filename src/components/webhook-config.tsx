"use client";

import {useState, useEffect} from "react";
import {Loader2, CheckCircle, AlertCircle, Copy, ExternalLink} from "lucide-react";

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface WebhookConfigProps {
  isConfigured: boolean;
  refreshStatus: () => Promise<void>;
}

export function WebhookConfig({isConfigured, refreshStatus}: WebhookConfigProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Obtener la URL del webhook
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

    setWebhookUrl(`${baseUrl}/api/webhooks/mercadopago`);
  }, []);

  const configureWebhook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/integration/configure-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
        }),
      });

      if (response.ok) {
        setSuccess("Webhook configurado correctamente en Mercado Pago");
        await refreshStatus();
      } else {
        const data = await response.json();

        setError(data.error || "Error al configurar el webhook");
      }
    } catch (error) {
      console.error("Error al configurar webhook:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(webhookUrl)
      .then(() => {
        setSuccess("URL copiada al portapapeles");
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((err) => {
        setError("Error al copiar la URL");
        setTimeout(() => setError(null), 3000);
      });
  };

  return (
    <div className="space-y-4">
      {isConfigured ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Webhook configurado</AlertTitle>
          <AlertDescription className="text-green-700">
            El webhook está configurado correctamente en Mercado Pago.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Webhook no configurado</AlertTitle>
          <AlertDescription>
            Configura el webhook para recibir notificaciones de pagos en tiempo real.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="webhookUrl">URL del Webhook</Label>
        <div className="flex">
          <Input readOnly className="flex-1" id="webhookUrl" value={webhookUrl} />
          <Button className="ml-2" variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Esta es la URL que debes configurar en Mercado Pago para recibir notificaciones.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Configuración Manual</h3>
        <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          <li>
            Inicia sesión en tu cuenta de{" "}
            <a
              className="inline-flex items-center text-primary hover:underline"
              href="https://www.mercadopago.com.ar/developers/panel"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mercado Pago Developers <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </li>
          <li>Ve a la sección &quot;Webhooks&quot;</li>
          <li>Haz clic en &quot;Crear webhook&quot;</li>
          <li>Ingresa la URL del webhook mostrada arriba</li>
          <li>Selecciona el evento &quot;payment&quot; (pago)</li>
          <li>Guarda la configuración</li>
        </ol>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Configuración Automática</h3>
        <p className="text-xs text-muted-foreground">
          También puedes configurar el webhook automáticamente haciendo clic en el botón de abajo.
          Esto requiere que hayas configurado correctamente el Access Token.
        </p>

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

        <Button className="w-full" disabled={isLoading || isConfigured} onClick={configureWebhook}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Configurando...
            </>
          ) : isConfigured ? (
            "Webhook ya configurado"
          ) : (
            "Configurar Webhook Automáticamente"
          )}
        </Button>
      </div>
    </div>
  );
}
