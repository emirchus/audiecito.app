import { v4 as uuidv4 } from "uuid";

// Assume createDonationRecord is imported or defined elsewhere
// For example:
// import { createDonationRecord } from '@/lib/supabase';

// Mock implementation for demonstration purposes
async function createDonationRecord({
  amount,
  username,
  is_anonymous,
  audio_url,
  payment_id,
  payment_status,
  external_reference,
}: {
  amount: number;
  username: string | null;
  is_anonymous: boolean;
  audio_url: string | null;
  payment_id: string | null;
  payment_status: string;
  external_reference: string;
}) {
  // In a real application, this would interact with your Supabase database
  console.info("Creating donation record:", {
    amount,
    username,
    is_anonymous,
    audio_url,
    payment_id,
    payment_status,
    external_reference,
  });

  return "mock-donation-id"; // Replace with the actual donation ID from Supabase
}

// Assume baseUrl is defined elsewhere
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  const { amount, isAnonymous, username, audioUrl } = await req.json();

  // Modificar la parte donde se crea el registro de donación en Supabase

  // Generar un ID único para la donación y usarlo como referencia externa
  const externalReference = uuidv4();

  // Crear un registro de donación en Supabase
  const dbDonationId = await createDonationRecord({
    amount,
    username: isAnonymous ? null : username,
    is_anonymous: isAnonymous,
    audio_url: audioUrl,
    payment_id: null,
    payment_status: "pending",
    external_reference: externalReference,
  });

  // Y luego en la parte donde se crea la preferencia de Mercado Pago:
  const donationId = "default-donation-id"; // Provide a default value or handle the case where dbDonationId is null

  // Crear objeto de preferencia
  const preferenceData = {
    items: [
      {
        title: isAnonymous ? "Donación Anónima" : "Donación",
        quantity: 1,
        currency_id: "ARS",
        unit_price: amount,
      },
    ],
    back_urls: {
      success: `${baseUrl}/success?donation_id=${dbDonationId || donationId}`,
      failure: `${baseUrl}/failure?donation_id=${dbDonationId || donationId}`,
      pending: `${baseUrl}/pending?donation_id=${dbDonationId || donationId}`,
    },
    auto_return: "approved",
    external_reference: externalReference,
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    metadata: {
      donation_id: dbDonationId || donationId,
      audio_url: audioUrl || null,
      username: isAnonymous ? null : username,
      is_anonymous: isAnonymous,
    },
  };

  // The rest of your code to create the Mercado Pago preference goes here
  // For example:
  // const preference = await mercadopago.preferences.create(preferenceData);
  // return NextResponse.json({ preferenceId: preference.body.id });

  return new Response(JSON.stringify({ preferenceData }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
