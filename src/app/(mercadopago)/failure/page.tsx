import Link from "next/link";
import {AlertCircle} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {FailureDetails} from "@/components/failure-details";

export default function FailurePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Pago Fallido</CardTitle>
          <CardDescription>Hubo un problema con tu donación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>No pudimos procesar tu donación en este momento.</p>

          <FailureDetails />
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/">
            <Button>Intentar Nuevamente</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Contactar Soporte</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
