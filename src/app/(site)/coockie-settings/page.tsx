"use client";

import { useState, useEffect } from "react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CoockieSettingsPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Non togglabile
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleSave = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    alert("Preferenze salvate!");
  };

  const handleReset = () => {
    const defaultPrefs = { essential: true, analytics: false, marketing: false };
    setPreferences(defaultPrefs);
    localStorage.setItem("cookiePreferences", JSON.stringify(defaultPrefs));
    alert("Preferenze ripristinate!");
  };

  if (!isMounted) return null;

  return (
    <div className="pt-[60px] md:pt-[80px]">
      <div className="page-px py-[40px] md:py-[60px]">
        <h1 className="text-[36px] md:text-[48px] font-bold leading-[1.3] text-black mb-[40px]">
          Impostazioni Cookie
        </h1>

        <div className="max-w-[798px]">
          <div className="text-[16px] md:text-[17.5px] leading-[1.6] text-black space-y-6 mb-8">
            <p>
              Personalizza le tue preferenze sui cookie. Puoi modificare le tue scelte in qualsiasi momento.
            </p>
          </div>

          {/* Cookie Settings */}
          <div className="space-y-4 mb-8">
            {/* Essential Cookies */}
            <div className="border-2 border-black rounded-[8px] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[18px] font-semibold text-black mb-2">
                    Cookie Essenziali
                  </h3>
                  <p className="text-[14px] text-black/70">
                    Necessari per il funzionamento del sito web. Include sessioni e sicurezza.
                  </p>
                  <p className="text-[12px] text-black/50 mt-2">
                    Durata: Sessione
                  </p>
                </div>
                <div className="text-[12px] font-semibold text-black/60 ml-4 shrink-0">
                  Sempre attivi
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="border-2 border-black rounded-[8px] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-[18px] font-semibold text-black mb-2">
                    Cookie Analytics
                  </h3>
                  <p className="text-[14px] text-black/70">
                    <strong>Provider:</strong> Google Analytics<br />
                    Ci aiutano a capire come usi il nostro sito e migliorare la tua esperienza.
                  </p>
                  <p className="text-[12px] text-black/50 mt-2">
                    Durata: 2 anni
                  </p>
                </div>
                <label className="ml-4 flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleToggle("analytics")}
                    className="size-[20px] accent-black cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="border-2 border-black rounded-[8px] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-[18px] font-semibold text-black mb-2">
                    Cookie Marketing
                  </h3>
                  <p className="text-[14px] text-black/70">
                    Utilizzati per tracciare il tuo comportamento e personalizzare annunci e contenuti.
                  </p>
                  <p className="text-[12px] text-black/50 mt-2">
                    Durata: 30 giorni - 2 anni
                  </p>
                </div>
                <label className="ml-4 flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleToggle("marketing")}
                    className="size-[20px] accent-black cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-col md:flex-row">
            <button
              onClick={handleSave}
              className="text-[16px] leading-[22px] px-[24px] py-[10px] bg-black text-white rounded-[100px] hover:opacity-80 transition-opacity"
            >
              Salva preferenze
            </button>
            <button
              onClick={handleReset}
              className="text-[16px] leading-[22px] px-[24px] py-[10px] border-2 border-black text-black rounded-[100px] hover:opacity-60 transition-opacity"
            >
              Ripristina default
            </button>
          </div>

          {/* Info */}
          <div className="mt-12 pt-8 border-t-2 border-black/20">
            <p className="text-[12px] text-black/60">
              Per domande sulle nostre politiche cookie, contattaci a{" "}
              <a href="mailto:studio@yas-arc.com" className="underline hover:opacity-60">
                studio@yas-arc.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
