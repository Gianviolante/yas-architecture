"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già accettato i cookie
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-black">
      <div className="page-px py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-[12px] md:text-[13px] leading-[1.5] text-black flex-1">
          Utilizziamo i cookie per migliorare la tua esperienza. Accettando, acconsenti al nostro utilizzo.{" "}
          <Link href="/coockie-solution" className="underline hover:opacity-60">
            Scopri di più
          </Link>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="text-[12px] leading-[1.5] px-3 py-2 border border-black rounded-full hover:opacity-60 transition-opacity"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="text-[12px] leading-[1.5] px-3 py-2 bg-black text-white rounded-full hover:opacity-80 transition-opacity"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
