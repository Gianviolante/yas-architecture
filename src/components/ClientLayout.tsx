"use client";

import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/ui/PageTransition";
import CookieBanner from "@/components/CookieBanner";

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
