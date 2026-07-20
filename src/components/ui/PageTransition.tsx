"use client";

import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page fade-in animation without Framer Motion
 * CSS-only solution reduces bundle by ~35KB (Framer Motion)
 * Identical visual result, better performance
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
