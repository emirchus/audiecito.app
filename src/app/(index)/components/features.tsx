import Image from "next/image";

import ObsIcon from "@/components/icons/obs";
import MercadoPagoIcon from "@/components/icons/mercado-pago";
import PayPalIcon from "@/components/icons/paypal";
import StripeIcon from "@/components/icons/stripe";

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-semibold lg:text-5xl">Integrá con tus redes</h2>
              <p className="mt-6">
                Audiecito te permite integrar tus redes sociales con tu cuenta de Audiecito.
              </p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <ObsIcon className="size-5" />
                Soporte a OBS
              </li>
              <li>
                <MercadoPagoIcon className="size-5" />
                Integración con MercadoPago
              </li>
              <li>
                <PayPalIcon className="size-5" />
                Integrado con PayPal
              </li>
              <li>
                <StripeIcon className="size-5" />
                Integración con Stripe
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative hidden rounded-3xl border p-3 md:block lg:col-span-3">
            <div className="relative aspect-76/59 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                alt="payments illustration dark"
                className="hidden rounded-[15px] dark:block"
                height={929}
                src="/app-dark.png"
                width={1207}
              />
              <Image
                alt="payments illustration light"
                className="rounded-[15px] shadow dark:hidden"
                height={929}
                src="/app.png"
                width={1207}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
