import {CheckCircle, XCircle, AlertTriangle, Clock} from "lucide-react";
import {format} from "date-fns";
import {es} from "date-fns/locale";

import {Badge} from "@/components/ui/badge";

interface IntegrationStatusProps {
  status: {
    connected: boolean;
    accessToken: boolean;
    publicKey: boolean;
    webhookConfigured: boolean;
    lastChecked: string | null;
  };
  isLoading: boolean;
}

export function IntegrationStatus({status, isLoading}: IntegrationStatusProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Estado General:</span>
        <StatusBadge
          activeText="Conectado"
          inactiveText="Desconectado"
          isActive={status.connected}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Access Token:</span>
          <StatusIndicator isActive={status.accessToken} isLoading={isLoading} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Public Key:</span>
          <StatusIndicator isActive={status.publicKey} isLoading={isLoading} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Webhook:</span>
          <StatusIndicator isActive={status.webhookConfigured} isLoading={isLoading} />
        </div>
      </div>

      {status.lastChecked && (
        <div className="border-t pt-2 text-xs text-muted-foreground">
          <Clock className="mr-1 inline-block h-3 w-3" />
          Última verificación:{" "}
          {format(new Date(status.lastChecked), "dd/MM/yyyy HH:mm:ss", {locale: es})}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  isActive,
  activeText,
  inactiveText,
  isLoading,
}: {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Badge className="bg-gray-100" variant="outline">
        <span className="animate-pulse">Verificando...</span>
      </Badge>
    );
  }

  if (isActive) {
    return <Badge variant="default">{activeText}</Badge>;
  }

  return <Badge variant="destructive">{inactiveText}</Badge>;
}

function StatusIndicator({isActive, isLoading}: {isActive: boolean; isLoading: boolean}) {
  if (isLoading) {
    return (
      <span className="flex items-center text-gray-400">
        <AlertTriangle className="h-4 w-4 animate-pulse" />
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="flex items-center text-green-600">
        <CheckCircle className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="flex items-center text-red-500">
      <XCircle className="h-4 w-4" />
    </span>
  );
}
