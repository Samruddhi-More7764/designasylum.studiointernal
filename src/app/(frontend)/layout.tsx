import type { Metadata } from "next";
import { Doto, Figtree, Playfair_Display } from "next/font/google";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import "./globals.css";

// Confirmed via design.md: font-family Figtree, weight 400, style Regular.
// Loaded without a fixed `weight` so the full variable-font weight range is
// available; only weight 400 is confirmed by Figma today, but this avoids
// hard-blocking future sections that may need other confirmed weights later.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

// Confirmed via design.md: font-family Playfair Display, weight 400,
// style Italic (used for the accent word inside headings) and Regular.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Contact office clocks. Figma uses Doto Black for the digits.
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: "900",
});

export const metadata: Metadata = {
  title: "Design Asylum",
  description: "Design Asylum landing page — built from Figma design specs.",
};

// Incremental Static Regeneration (ISR): Serve instant pre-rendered pages (<50ms)
// and background revalidate every 120 seconds or on-demand via CMS hooks.
export const revalidate = 120;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${playfairDisplay.variable} ${doto.variable} h-full scroll-smooth antialiased`}
    >
      <GoogleTagManager />
      <head>
        {/*
          Satoshi (design.md: font-family Satoshi, weight 400, style Regular)
          is not available on Google Fonts, so it can't go through next/font/google.
          It is loaded here via Fontshare's hosted CSS API (its official distributor).
          TODO: once licensed font files are supplied, migrate to next/font/local
          for full self-hosting/optimization parity with Figtree and Playfair Display.
        */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <GoogleTagManagerNoscript />
        <div className="mx-auto flex min-h-full w-full max-w-[1470px] flex-1 flex-col bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
