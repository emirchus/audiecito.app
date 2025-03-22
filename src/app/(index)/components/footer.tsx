import { Mic, Twitter } from "lucide-react";
import Link from "next/link";

import ThemeToggle from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dashed py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-0">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="">
            <Link aria-label="go home" className="block size-fit" href="/">
              <Mic className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm">
            <span className="block font-medium">Audiecito</span>
            <p>
              Audiecito es una plataforma que permite a los streamers generar un link de donaciones
              para recibir audios ó mensajes de sus seguidores.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Audiecito, Todos los derechos reservados
          </span>
          <div className="order-first flex flex-wrap items-center justify-center gap-6 text-sm md:order-last">
            <a
              aria-label="X/Twitter"
              className="text-muted-foreground hover:text-primary block"
              href="https://x.com/emirchus"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Twitter className="size-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
