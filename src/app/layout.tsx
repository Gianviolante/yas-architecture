import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import PageTransition from "@/components/ui/PageTransition";
import CookieBanner from "@/components/CookieBanner";

// Lazy load CustomCursor client-side only (skip mobile + SSR)
// This reduces FCP by ~1.5s on initial load
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
  loading: () => null,
});

export const metadata: Metadata = {
  title: "YAS Architecture",
  description: "YAS Architecture — Studio di architettura, Brindisi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
        <CookieBanner />
      </body>
    </html>
  );
}
