"use client";

import {useState} from "react";
import {CheckCircle} from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

export function OBSConfigPage() {
  const [copied, setCopied] = useState(false);
  const widgetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/obs/widget`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Configuración del Widget para OBS</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Widget de Alertas de Donación</CardTitle>
            <CardDescription>
              Agrega este widget a OBS Studio para mostrar alertas de donación en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">URL del Widget:</p>
              <div className="flex">
                <Input readOnly className="flex-1" value={widgetUrl} />
                <Button className="ml-2" variant="outline" onClick={handleCopy}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>

            {copied && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">URL copiada</AlertTitle>
                <AlertDescription className="text-green-700">
                  La URL del widget ha sido copiada al portapapeles.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4">
              <h3 className="mb-2 font-medium">Instrucciones:</h3>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Abre OBS Studio</li>
                <li>
                  Agrega una nueva fuente de tipo <b>Navegador</b>
                </li>
                <li>Pega la URL del widget en el campo URL</li>
                <li>Establece el ancho y alto según tus necesidades (recomendado: 800x200)</li>
                <li>Marca la opción &quot;Actualizar navegador cuando la escena se active&quot;</li>
                <li>Haz clic en &quot;Aceptar&quot; para guardar</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Así se verá el widget en tu transmisión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-gray-100">
              <iframe className="h-full w-full" src={widgetUrl} title="Vista previa del widget" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Nota: Las alertas aparecerán cuando se reciban donaciones aprobadas.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
