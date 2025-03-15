import {Geist as font} from "next/font/google";

export const fontSans = font({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
});

export const siteConfig = {
  name: "Audonaciones",
  url: "https://audonaciones.com",
  ogImage: "https://audonaciones.com/og.png",
  description: "Doná y enviá un mensaje de audio",
  links: {
    twitter: "",
    github: "",
  },
};
