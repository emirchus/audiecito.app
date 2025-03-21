import { Space_Grotesk as font } from "next/font/google";

export const fontSans = font({
  subsets: ["latin"],
  weight: ["400", "500", "700", "600"],
  variable: "--font-sans",
});

export const siteConfig = {
  name: "Audiecito",
  url: "https://audiecito.com",
  ogImage: "https://audiecito.com/og.png",
  description: "Doná y enviás un mensaje de audio",
  links: {
    twitter: "",
    github: "",
  },
};
