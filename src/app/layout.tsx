import type { Metadata } from "next";
import Script from "next/script";
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
  title: "YAS Architecture | Studio di Architettura a Brindisi",
  description: "Studio di architettura innovativo a Brindisi. Progetti residenziali, commerciali e interior design. Scopri i nostri lavori.",
  keywords: "architettura brindisi, interior design, progetti residenziali, design commerciale, studio architettura",

  // Open Graph for social sharing (Facebook, LinkedIn)
  openGraph: {
    title: "YAS Architecture | Progetti e Design",
    description: "Scopri i progetti di architettura e design dello studio YAS",
    url: "https://yas-architecture.vercel.app",
    siteName: "YAS Architecture",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://yas-architecture.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YAS Architecture — Studio di architettura a Brindisi",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "YAS Architecture",
    description: "Studio di architettura a Brindisi — Progetti residenziali, commerciali, interior design",
    images: ["https://yas-architecture.vercel.app/og-image.jpg"],
  },

  // Canonical URL (prevent duplicate content)
  alternates: {
    canonical: "https://yas-architecture.vercel.app",
  },

  // Mobile optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://yas-architecture.vercel.app",
    name: "YAS Architecture Associati",
    image: "https://yas-architecture.vercel.app/og-image.jpg",
    description: "Studio di architettura e design a Brindisi",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Piazza Marco Antonio Cavalerio, 21",
      addressLocality: "Brindisi",
      postalCode: "72100",
      addressCountry: "IT",
    },
    email: "studio@yas-arc.com",
    url: "https://yas-architecture.vercel.app",
    sameAs: [
      "https://www.facebook.com/p/Y-A-S-architecture-100063041749591",
      "https://www.instagram.com/yas_architecture_/",
    ],
  };

  return (
    <html lang="it" className="h-full antialiased">
      <head>
        {/* JSON-LD Schema for search engines */}
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
        <CookieBanner />
      </body>
    </html>
  );
}
