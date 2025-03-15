"use client";

import {useState, useRef} from "react";
import {Mic, Square} from "lucide-react";

import {Button} from "@/components/ui/button";

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob | null) => void;
}

export function AudioRecorder({onAudioRecorded}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"});
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioUrl);
        onAudioRecorded(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder a tu micrófono. Por favor, verificá los permisos.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!isRecording ? (
        <Button
          className="flex w-full items-center gap-2"
          disabled={isRecording || !!audioUrl}
          variant="outline"
          onClick={startRecording}
        >
          <Mic className="h-4 w-4" /> Grabar Mensaje de Audio
        </Button>
      ) : (
        <Button
          className="flex w-full animate-pulse items-center gap-2"
          variant="destructive"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4" /> Detener Grabación
        </Button>
      )}

      {audioUrl && (
        <div className="w-full rounded-md border bg-muted p-3">
          <audio controls className="w-full" src={audioUrl}>
            <track kind="captions" src={audioUrl} />
          </audio>
          <Button
            className="mt-2"
            size="sm"
            variant="ghost"
            onClick={() => {
              setAudioUrl(null);
              onAudioRecorded(null);
            }}
          >
            Grabar Nuevamente
          </Button>
        </div>
      )}
    </div>
  );
}
