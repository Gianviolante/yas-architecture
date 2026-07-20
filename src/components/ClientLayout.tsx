"use client";

import dynamic from "next/dynamic";
import PageTransition from "@/components/ui/PageTransition";
import CookieBanner from "@/components/CookieBanner";

// Lazy load CustomCursor client-side only (skip mobile + SSR)
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
  loading: () => null,
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
      <CookieBanner />
    </>
  );
}
