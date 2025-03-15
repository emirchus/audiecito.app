import Link from "next/link";
import {Clock} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {PendingDetails} from "@/components/pending-details";

export default function PendingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-600">Pago Pendiente</CardTitle>
          <CardDescription>Tu donación está siendo procesada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>Gracias por tu donación. Tu pago está siendo procesado actualmente.</p>

          <PendingDetails />

          <p className="text-sm text-muted-foreground">
            Recibirás un correo de confirmación una vez que se complete el pago.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
