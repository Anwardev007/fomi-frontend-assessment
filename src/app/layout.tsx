import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fomi — Turn imagination into images",
  description:
    "Fomi is the AI creative platform for professional image and video generation. Text-to-image, AI editing, upscaling, and curated templates — built for creators who ship.",
  keywords: [
    "Fomi",
    "AI image generation",
    "text-to-image",
    "AI video",
    "creative workspace",
    "image upscaling",
    "AI art",
  ],
  authors: [{ name: "Fomi" }],
  openGraph: {
    title: "Fomi — Turn imagination into images",
    description:
      "The AI creative platform for professional image & video generation.",
    siteName: "Fomi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fomi — Turn imagination into images",
    description:
      "The AI creative platform for professional image & video generation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Sonner position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
