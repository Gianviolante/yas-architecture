import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Disabilita l'ottimizzazione di Next.js per evitare 403 su Vercel
    // Le immagini verranno servite direttamente dal CDN
    unoptimized: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
