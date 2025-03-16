import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DonationForm } from "@/components/donation-form";

export default function DonationPage() {
  return (
    <main className="from-primary to-secondary flex min-h-screen flex-col items-center justify-center bg-linear-to-b p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-2xl font-bold">Hacé una Donación</CardTitle>
          <CardDescription>Apoyá nuestra causa y dejá un mensaje de audio</CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm />
        </CardContent>
      </Card>
    </main>
  );
}
