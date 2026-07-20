import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // STRATEGIA SMART: Abilita ottimizzazione Next.js
    // Sanity CDN rimane come fallback con auto=format&q=80
    // Next.js aggiunge caching layer + ulteriore compressione per thumbnails
    unoptimized: false,

    // Formati supportati (in ordine di preferenza)
    formats: ["image/avif", "image/webp"],

    // Dimensioni responsive per architecture portfolio
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 768, 1024],

    // Cache aggressiva (1 anno) per immagini architettura ad alta qualità
    minimumCacheTTL: 60 * 60 * 24 * 365,

    // Dangerously allow SVG (per loghi)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
