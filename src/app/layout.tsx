import type { Metadata } from "next";
import { Figtree, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Design Asylum",
  description: "Design Asylum landing page — built from Figma design specs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        {/*
          Satoshi (design.md: font-family Satoshi, weight 400, style Regular)
          is not available on Google Fonts, so it can't go through next/font/google.
          It is loaded here via Fontshare's hosted CSS API (its official distributor).
          TODO: once licensed font files are supplied, migrate to next/font/local
          for full self-hosting/optimization parity with Figtree and Playfair Display.
        */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
