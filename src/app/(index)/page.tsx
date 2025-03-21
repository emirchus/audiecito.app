import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import FeaturesSection from "./components/features";

export default function HeroSection() {
  return (
    <main>
      <div
        aria-hidden
        className="absolute inset-0 isolate z-2 hidden opacity-50 contain-strict lg:block"
      >
        <div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        <div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section className="overflow-hidden bg-white dark:bg-transparent">
        <div className="relative mx-auto max-w-5xl px-6 py-28 lg:pt-32 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold text-balance md:text-5xl lg:text-6xl">
              Audiecito
            </h1>
            <p className="mx-auto my-8 max-w-2xl text-xl">
              Empezá a recibir audios de tus viewers y donaciones de todo el mundo con un solo link.
            </p>

            <Button asChild className="px-5" size="lg">
              <Link href="#">
                <span className="btn-label">Crear una cuenta</span>
              </Link>
            </Button>
            <span className="text-muted-foreground mt-2 block text-center text-sm">
              100% gratis
            </span>
          </div>
        </div>

        <div className="mx-auto -mt-16 max-w-7xl">
          <div className="-mr-16 pl-16 perspective-distant lg:-mr-56 lg:pl-56">
            <div className="[transform:rotateX(20deg);]">
              <div className="relative skew-x-[.36rad] lg:h-176">
                <div
                  aria-hidden
                  className="from-background to-background absolute -inset-16 z-1 bg-linear-to-b via-transparent sm:-inset-32"
                />
                <div
                  aria-hidden
                  className="from-background to-background absolute -inset-16 z-1 bg-white/50 bg-linear-to-r via-transparent sm:-inset-32 dark:bg-transparent"
                />

                <div
                  aria-hidden
                  className="absolute -inset-16 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] [--color-border:var(--color-zinc-400)] sm:-inset-32 dark:[--color-border:color-mix(in_oklab,var(--color-white)_20%,transparent)]"
                />
                <div
                  aria-hidden
                  className="from-background absolute inset-0 z-11 bg-gradient-to-l"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 z-2 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                />

                <Image
                  alt="tailus ui hero section"
                  className="relative z-1 rounded-(--radius) border dark:hidden"
                  height={2074}
                  src="/app.png"
                  width={2880}
                />
                <Image
                  alt="tailus ui hero section"
                  className="relative z-1 hidden rounded-(--radius) border dark:block"
                  height={2074}
                  src="/app-dark.png"
                  width={2880}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background relative z-10 py-16">
        <div className="m-auto max-w-5xl px-6">
          <h2 className="text-center text-lg font-medium">Encontrá a tus streamers favoritos.</h2>
          <div className="*:hover:bg-accent *:hover:text-accent-foreground mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 font-bold *:rounded-md *:p-2 sm:gap-x-16 sm:gap-y-12">
            <a href="https://twitch.tv/alexby11">Alexby11</a>
            <a href="https://twitch.tv/bananirou">Bananirou</a>
            <a href="https://twitch.tv/emirchus">Emirchus</a>
            <a href="https://twitch.tv/rubius">Rubius</a>
            <a href="https://twitch.tv/auronplay">Auronplay</a>
            <a href="https://twitch.tv/ibai">Ibai</a>
            <a href="https://twitch.tv/elxokas">ElXokas</a>
            <a href="https://twitch.tv/illojuann">IlloJuan</a>
          </div>
        </div>
      </section>

      <FeaturesSection />
    </main>
  );
}
