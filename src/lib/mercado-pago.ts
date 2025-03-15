export async function initMercadoPago() {
  // Dynamic import of Mercado Pago SDK
  const {loadMercadoPago} = await import("@mercadopago/sdk-js");

  try {
    const mp = await loadMercadoPago();

    console.log("SDK de Mercado Pago inicializado correctamente");

    return mp;
  } catch (error) {
    console.error("Error al inicializar el SDK de Mercado Pago:", error);
    throw error;
  }
}

// Create a donation and return the checkout URL
export async function createDonation(
  amount: number,
  audioBlob: Blob | null,
  username: string | null = null,
): Promise<string> {
  try {
    // First, if we have an audio blob, upload it to our API
    let audioUrl = null;

    if (audioBlob) {
      const formData = new FormData();

      formData.append("audio", audioBlob, "message.wav");

      const uploadResponse = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir el mensaje de audio");
      }

      const uploadData = await uploadResponse.json();

      audioUrl = uploadData.audioUrl;
    }

    // Create a donation preference with Mercado Pago
    const response = await fetch("/api/create-donation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        audioUrl,
        username,
        isAnonymous: username === null,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la donación");
    }

    const data = await response.json();

    return data.checkoutUrl;
  } catch (error) {
    console.error("Error al crear la donación:", error);
    throw error;
  }
}
