import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DonationForm} from "@/components/donation-form";

export default function DonationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Hacé una Donación</CardTitle>
          <CardDescription>Apoyá nuestra causa y dejá un mensaje de audio</CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm />
        </CardContent>
      </Card>
    </main>
  );
}
