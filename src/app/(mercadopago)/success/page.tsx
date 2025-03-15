import Link from "next/link";
import {CheckCircle} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SuccessDetails} from "@/components/success-details";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">¡Gracias!</CardTitle>
          <CardDescription>Tu donación fue exitosa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            Gracias por tu generosa donación. Tu apoyo significa mucho para nosotros y nos ayudará a
            continuar con nuestra misión.
          </p>

          <SuccessDetails />

          <p className="text-sm text-muted-foreground">
            Se ha enviado un correo de confirmación a tu dirección de email.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Hacer Otra Donación</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
