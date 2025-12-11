import type React from "react";
import type { Metadata } from "next";
import { Coming_Soon } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const coming_soon = Coming_Soon({ weight: ["400"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peeples Donuts | Family Owned, Family Operated",
  description:
    "Join the donut mining revolution - Pool together, earn together",
  icons: {
    icon: [
      {
        url: "/favicons/favicon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicons/favicon-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicons/favicon-32x32.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicons/favicon-32x32.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${coming_soon.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
