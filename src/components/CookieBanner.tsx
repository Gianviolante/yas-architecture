"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    // Controlla se l'utente ha già accettato i cookie
    const cookieConsent = localStorage.getItem("cookieConsent");
    setIsVisible(!cookieConsent);
  }, []);

  // Evita flicker di hydration — non renderizza finché non è idratato
  if (isVisible === null) return null;
  if (!isVisible) return null;

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-black">
      <div className="page-px py-[12px] md:py-[16px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
        <p className="text-[12px] leading-[1.5] text-black flex-1">
          Utilizziamo i cookie per migliorare la tua esperienza. Accettando, acconsenti al nostro utilizzo.{" "}
          <Link href="/coockie-solution" className="underline hover:opacity-60 transition-opacity">
            Scopri di più
          </Link>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="text-[12px] leading-[1.5] px-[20px] py-[8px] border-2 border-black rounded-[100px] hover:opacity-60 transition-opacity"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="text-[12px] leading-[1.5] px-[20px] py-[8px] bg-black text-white rounded-[100px] hover:opacity-80 transition-opacity"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
