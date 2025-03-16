import { Geist_Mono as font } from "next/font/google";

export const fontSans = font({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geist-sans",
});

export const siteConfig = {
  name: "AudacitoApp",
  url: "https://audacito.app",
  ogImage: "https://audacito.app/og.png",
  description: "Doná y enviás un mensaje de audio",
  links: {
    twitter: "",
    github: "",
  },
};
