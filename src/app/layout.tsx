import type React from "react";
import type {Metadata} from "next";

import {Inter} from "next/font/google";

import "./globals.css";
import {Header} from "@/components/header/header";
import {Footer} from "@/components/footer";
import {AuthProvider} from "@/provider/auth-provider";
import {createClient} from "@/lib/supabase/server";
import {cn} from "@/lib/utils";
import {fontSans, siteConfig} from "@/lib/config";

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{url: siteConfig.ogImage, alt: siteConfig.name}],
  },
  twitter: {
    title: siteConfig.name,
    card: "summary",
    site: siteConfig.links.twitter,
    images: [{url: siteConfig.ogImage, alt: siteConfig.name}],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <html lang="es-AR">
      <body className={cn("bg-background min-h-screen font-sans antialiased", fontSans.variable)}>
        <AuthProvider user={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
