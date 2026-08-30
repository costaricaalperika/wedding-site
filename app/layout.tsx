import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Lato } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

/** Hero isimleri — el yazısı / romantik (Google Fonts) */
const greatVibes = Great_Vibes({
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
  title: "Duygu & Alper — Wedding",
  description: "Join us to celebrate our wedding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${lato.variable} ${greatVibes.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
