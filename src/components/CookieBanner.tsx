"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    const savedPrefs = localStorage.getItem("cookiePreferences");

    if (cookieConsent) {
      setIsVisible(false);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  if (isVisible === null) return null;

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    localStorage.setItem("cookieConsent", "rejected");
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly));
    setPreferences(essentialOnly);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setIsVisible(false);
    setShowModal(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-black">
        <div className="page-px py-[12px] md:py-[16px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <p className="text-[12px] leading-[1.5] text-black flex-1">
            Utilizziamo i cookie per migliorare la tua esperienza. Puoi personalizzare le tue preferenze.{" "}
            <Link href="/coockie-solution" className="underline hover:opacity-60 transition-opacity">
              Scopri di più
            </Link>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="text-[12px] leading-[1.5] px-[20px] py-[8px] border-2 border-black rounded-[100px] hover:opacity-60 transition-opacity"
            >
              Personalizza
            </button>
            <button
              onClick={handleRejectAll}
              className="text-[12px] leading-[1.5] px-[20px] py-[8px] border-2 border-black rounded-[100px] hover:opacity-60 transition-opacity"
            >
              Rifiuta
            </button>
            <button
              onClick={handleAcceptAll}
              className="text-[12px] leading-[1.5] px-[20px] py-[8px] bg-black text-white rounded-[100px] hover:opacity-80 transition-opacity"
            >
              Accetta tutto
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] max-w-[500px] w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <h2 className="text-[24px] font-bold text-black mb-4">
                Personalizza Cookie
              </h2>

              <div className="space-y-4 mb-8">
                {/* Essential Cookies */}
                <div className="border border-black/20 rounded-[8px] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-black">Cookie Essenziali</p>
                      <p className="text-[12px] text-black/60 mt-1">
                        Necessari per il funzionamento del sito (sessioni, sicurezza)
                      </p>
                    </div>
                    <div className="text-[12px] text-black/40 ml-4">
                      Sempre attivi
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-black/20 rounded-[8px] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-black">Cookie Analytics</p>
                      <p className="text-[12px] text-black/60 mt-1">
                        Google Analytics: analizza come usi il sito
                      </p>
                    </div>
                    <label className="ml-4 flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            analytics: e.target.checked,
                          })
                        }
                        className="size-[18px] accent-black cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-black/20 rounded-[8px] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-black">Cookie Marketing</p>
                      <p className="text-[12px] text-black/60 mt-1">
                        Tracciamento pubblicitario e retargeting
                      </p>
                    </div>
                    <label className="ml-4 flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            marketing: e.target.checked,
                          })
                        }
                        className="size-[18px] accent-black cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[12px] leading-[1.5] px-[20px] py-[8px] border-2 border-black rounded-[100px] hover:opacity-60 transition-opacity"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="text-[12px] leading-[1.5] px-[20px] py-[8px] bg-black text-white rounded-[100px] hover:opacity-80 transition-opacity"
                >
                  Salva preferenze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
