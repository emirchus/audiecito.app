import { NextResponse } from "next/server";

import { uploadAudio } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo de audio" },
        { status: 400 },
      );
    }

    // Convertir el archivo a Blob
    const audioBlob = await audioFile
      .arrayBuffer()
      .then((buffer) => new Blob([buffer], { type: "audio/wav" }));

    // Subir el audio a Supabase Storage
    const audioUrl = await uploadAudio(audioBlob);

    if (!audioUrl) {
      return NextResponse.json({ error: "Error al subir el archivo de audio" }, { status: 500 });
    }

    // Devolver la URL del audio
    return NextResponse.json({
      success: true,
      audioUrl,
      message: "Audio subido correctamente",
    });
  } catch (error) {
    console.error("Error al subir el audio:", error);

    return NextResponse.json({ error: "Error al subir el audio" }, { status: 500 });
  }
}
