"use client";

import type { Donation } from "@/lib/supabase";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface DonationAlertProps {
  donation: Donation;
}

export function DonationAlert({ donation }: DonationAlertProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);

  useEffect(() => {
    // Reproducir audio si existe
    if (donation.audio_url && audioRef.current) {
      const playAudio = async () => {
        try {
          setAudioPlaying(true);
          await audioRef.current?.play();
        } catch (error) {
          console.error("Error al reproducir audio:", error);
          setAudioEnded(true);
        }
      };

      playAudio();
    } else {
      // Si no hay audio, marcar como terminado
      setAudioEnded(true);
    }
  }, [donation.audio_url]);

  // Manejar fin de reproducción
  const handleAudioEnd = () => {
    setAudioPlaying(false);
    setAudioEnded(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-linear-to-r from-blue-600 to-purple-600 shadow-lg"
        exit={{ y: 100, opacity: 0 }}
        initial={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="mr-2 h-6 w-6 animate-pulse text-red-400" />
              <h3 className="text-xl font-bold">¡Nueva Donación!</h3>
            </div>
            <div className="text-2xl font-bold">${donation.amount}</div>
          </div>

          <div className="mb-4">
            <p className="text-lg">
              {donation.is_anonymous
                ? "Donante Anónimo"
                : `${donation.username || "Alguien"} ha donado`}
            </p>
          </div>

          {donation.audio_url && (
            <div className="mt-4">
              <audio
                ref={audioRef}
                className="hidden"
                src={donation.audio_url}
                onEnded={handleAudioEnd}
              >
                <track kind="captions" src={donation.audio_url} />
              </audio>

              {audioPlaying && (
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={_}
                        className="animate-sound-wave h-8 w-2 rounded-full bg-white"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "0.8s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
