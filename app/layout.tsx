/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/client/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tab Bite — Modern QR Ordering for Restaurants",
    template: "%s | Tab Bite",
  },
  description:
    "Per-table QR menus and WhatsApp ordering for restaurants: guests scan at their table, you see the right table number, and you can run dine-in or local delivery without marketplace commission.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://tapbite.org"
  ),
  openGraph: {
    siteName: "Tab Bite",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tapbite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col ">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
