import type { Metadata } from "next";
import { Sacramento, Playfair_Display, Lato } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

/**
 * Hero isimleri — el yazısı / romantik (Google Fonts).
 * Not: Great Vibes'ın büyük "A"sı küçük harf "a"ya benziyordu, bu yüzden
 * büyük harfleri daha net okunan Sacramento'ya geçildi.
 */
const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-hero",
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duygu & Alper — Düğün",
  description: "Düğünümüzü kutlamak için bize katılın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${lato.variable} ${sacramento.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
