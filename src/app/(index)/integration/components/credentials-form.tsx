"use client";
import {CheckCircle, Check} from "lucide-react";
import {useState} from "react";

import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/provider/auth-provider";

export // Componente para el formulario de credenciales
function CredentialsForm({
  refreshStatus,
  hasCredentials,
}: {
  refreshStatus: () => Promise<void>;
  hasCredentials: boolean;
}) {
  const {user} = useAuth();
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="space-y-4">
      {hasCredentials && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Credenciales configuradas</AlertTitle>
          <AlertDescription className="text-green-700">
            Las credenciales de Mercado Pago están configuradas correctamente.
          </AlertDescription>
        </Alert>
      )}

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessToken">
            Access Token
            <span className="text-muted-foreground ml-2 text-xs">(Producción)</span>
          </Label>
          <Input
            readOnly
            id="accessToken"
            placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publicKey">
            Public Key
            <span className="text-muted-foreground ml-2 text-xs">(Producción)</span>
          </Label>
          <Input
            readOnly
            id="publicKey"
            placeholder="APP_USR-00000000-0000-0000-0000-000000000000"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>

        <Button
          asChild={!hasCredentials}
          className="w-full"
          disabled={hasCredentials}
          type="submit"
        >
          {hasCredentials ? (
            <>
              <Check className="mr-2 size-4" />
              Integrado
            </>
          ) : (
            <a
              href={`https://auth.mercadopago.com.ar/authorization?client_id=${process.env.NEXT_PUBLIC_MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${user?.id}&redirect_uri=${process.env.NEXT_PUBLIC_MP_REDIRECT_URI}`}
              rel="noreferrer"
              target="_blank"
            >
              Iniciar Integración
            </a>
          )}
        </Button>
      </form>
    </div>
  );
}
