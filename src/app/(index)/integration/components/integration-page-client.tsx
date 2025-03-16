"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { WebhookConfig } from "@/components/webhook-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationStatus } from "@/app/(index)/integration/components/integration-status";
import { TestDonation } from "@/app/(index)/integration/components/test-donation";

import { CredentialsForm } from "./credentials-form";

interface IntegrationPageClientProps {
  initialStatus: {
    connected: boolean;
    accessToken: boolean;
    publicKey: boolean;
    webhookConfigured: boolean;
    lastChecked: string | null;
  };
}

export function IntegrationPageClient({ initialStatus }: IntegrationPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState(initialStatus);

  // Función para actualizar el estado de la integración
  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/integration/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        setIntegrationStatus(data);
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la integración:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Integración con Mercado Pago</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Panel de estado */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Estado de la Integración</CardTitle>
            <CardDescription>Estado actual de la conexión con Mercado Pago</CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationStatus isLoading={isLoading} status={integrationStatus} />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={isLoading}
              variant="outline"
              onClick={refreshStatus}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualizar Estado
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Panel principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configuración de Mercado Pago</CardTitle>
            <CardDescription>
              Conecta tu cuenta de Mercado Pago para recibir donaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials">
              <TabsList className="mb-4">
                <TabsTrigger value="credentials">Credenciales</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
                <TabsTrigger disabled value="webhook">
                  Webhook
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credentials">
                <CredentialsForm
                  hasCredentials={integrationStatus.accessToken && integrationStatus.publicKey}
                  refreshStatus={refreshStatus}
                />
              </TabsContent>

              <TabsContent value="webhook">
                <WebhookConfig
                  isConfigured={integrationStatus.webhookConfigured}
                  refreshStatus={refreshStatus}
                />
              </TabsContent>

              <TabsContent value="test">
                <TestDonation
                  isIntegrationReady={
                    integrationStatus.accessToken &&
                    integrationStatus.publicKey &&
                    integrationStatus.webhookConfigured
                  }
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
