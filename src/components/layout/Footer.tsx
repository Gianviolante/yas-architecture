"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { getCsrfToken } from "@/lib/utils/csrf";

const txt = "text-[16px] md:text-[12px] leading-[1.2] text-black font-normal";

export default function Footer() {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", messaggio: "", paese: "", privacy: "", telefono: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [paeseOptions, setPaeseOptions] = useState<string[]>([]);
  const [showPaeseDropdown, setShowPaeseDropdown] = useState(false);
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (showToast || toastError) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastError(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast, toastError]);

  // Autocomplete paese via Nominatim
  const handlePaeseChange = (value: string) => {
    setForm({ ...form, paese: value });

    if (!value.trim()) {
      setPaeseOptions([]);
      setShowPaeseDropdown(false);
      return;
    }

    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }

    autocompleteTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`
        );
        const data = await res.json();
        const options = data.map((item: any) => item.name || item.display_name).slice(0, 5);
        setPaeseOptions(options);
        setShowPaeseDropdown(true);
      } catch {
        setPaeseOptions([]);
      }
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.messaggio) {
      setToastError(true);
      return;
    }
    if (form.privacy !== "acconsento") {
      setToastError(true);
      return;
    }

    setIsLoading(true);
    try {
      const csrfToken = getCsrfToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          cognome: form.cognome,
          email: form.email,
          messaggio: form.messaggio,
          telefono: form.telefono,
          csrfToken,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setToastError(true);
        return;
      }

      setShowToast(true);
      setForm({ nome: "", cognome: "", email: "", messaggio: "", paese: "", privacy: "", telefono: "" });
    } catch {
      setToastError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer>
      <div className="page-px py-10 flex flex-col lg:flex-row justify-between gap-8">

        {/* ── Left block — Info (≈681px) ────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Title */}
          <p className={`${txt} mb-[17px]`}>YAS Architecture Associati</p>

          {/* 3 columns — grow to fill space */}
          <div className="flex flex-col md:flex-row flex-1">
            {/* Col 1 — Company address */}
            <div className={`${txt} w-full md:w-[232px] md:shrink-0 mb-4 md:mb-0 space-y-0`}>
              <p>Piazza Marco Antonio Cavalerio, 21</p>
              <p>72100 Brindisi (BR) Italia</p>
              <p>studio@yas-arc.com</p>
              <p>&nbsp;</p>
              <p>© YAS Architecture Associati</p>
              <p>P.I. 02690340746</p>
              <p>Codice univoco: M5UXCR1</p>
            </div>

            {/* Col 2 — Contatti + links (lg only) */}
            <div className={`${txt} w-full md:w-[232px] md:shrink-0 mb-4 md:mb-0 flex flex-col`}>
              <div>
                <p>Contatti</p>
                <a href="mailto:studio@yas-arc.com" className="block hover:underline">studio@yas-arc.com</a>
              </div>
              <div className="hidden md:hidden lg:block xl:hidden">
                <p>&nbsp;</p>
                <Link href="/studio" className="block hover:underline">Studio</Link>
                <Link href="/team" className="block hover:underline">Team</Link>
                <Link href="/progetti" className="block hover:underline">Progetti</Link>
              </div>
            </div>

            {/* Col 3 — Studio links (hidden on lg, shown on xl+) */}
            <div className={`${txt} hidden lg:hidden xl:block`}>
              <Link href="/studio" className="block hover:underline">Studio</Link>
              <Link href="/team" className="block hover:underline">Team</Link>
              <Link href="/progetti" className="block hover:underline">Progetti</Link>
            </div>
          </div>

          {/* Bottom row — same 3-column alignment */}
          <div className="flex flex-col md:flex-row items-start md:items-end mt-10 gap-4 md:gap-0">
            {/* Col 1 — Privacy */}
            <div className={`${txt} w-full md:w-[232px] md:shrink-0 flex flex-col`}>
              <div className="space-y-0">
                <Link href="/privacy-policy" className="block hover:opacity-60 transition-opacity">Privacy Policy</Link>
                <Link href="/coockie-solution" className="block hover:opacity-60 transition-opacity">Coockie Solution</Link>
                <Link href="/coockie-settings" className="block hover:opacity-60 transition-opacity">Coockie Settings</Link>
              </div>
              <p className="mt-4">Design & Development: <a href="https://www.linkedin.com/in/gianmarcoviolante/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">G. Violante</a></p>
            </div>

            {/* Col 2 — Seguici su + social icons */}
            <div className="w-full md:w-[232px] md:shrink-0">
              <p className={`${txt} mb-[7px]`}>Seguici su</p>
              <div className="flex items-center gap-[12px]">
                <SocialIcon href="https://www.facebook.com/p/Y-A-S-architecture-100063041749591" label="Facebook" icon="/assets/icon-facebook-v.svg" />
                <SocialIcon href="https://www.instagram.com/yas_architecture_/" label="Instagram" icon="/assets/icon-instagram-v.svg" />
              </div>
            </div>

            {/* Col 3 — Google Maps */}
            <div className="flex items-end">
              <Button
                href="https://share.google/BSNYmdJOcLu7FA4fE"
                variant="outlined"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right block — Contatti (490px) ─────────────────────── */}
        <div className="w-full lg:w-[490px] lg:shrink-0 relative">
          {/* Toast notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-8 right-8 z-50"
              >
                <div className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-lg shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                    <path d="M16.5 5L8.5 15L3.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-[14px] font-medium leading-[1.2]">Richiesta inviata</p>
                    <p className="text-[12px] text-white/70 leading-[1.2]">Ti risponderemo presto</p>
                  </div>
                </div>
              </motion.div>
            )}
            {toastError && (
              <motion.div
                initial={{ opacity: 0, y: 20, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-8 right-8 z-50"
              >
                <div className="flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                    <path d="M10 4v6m0 4v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-[14px] font-medium leading-[1.2]">Errore invio</p>
                    <p className="text-[12px] text-white/70 leading-[1.2]">Controlla i dati e riprova</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className={`${txt} mb-[17px]`}>Contatti</p>

          <form onSubmit={handleSubmit}>
              {/* Row 1: Nome (40%) | Cognome (60%) */}
              <div className="border-t border-black flex">
                <label className="flex-[196] border-r border-black py-[14px] px-1 cursor-text">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    autoComplete="given-name"
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black`}
                  />
                </label>
                <label className="flex-[294] py-[14px] px-1 cursor-text">
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={form.cognome}
                    onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                    autoComplete="family-name"
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black`}
                  />
                </label>
              </div>

              {/* Row 2: e-mail (60%) | Telefono (40%) */}
              <div className="border-t border-black flex">
                <label className="flex-[294] border-r border-black py-[14px] px-1 cursor-text">
                  <input
                    type="email"
                    placeholder="e-mail*"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black`}
                  />
                </label>
                <label className="flex-[196] py-[14px] px-1 cursor-text">
                  <input
                    type="tel"
                    placeholder="Telefono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    autoComplete="tel"
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black`}
                  />
                </label>
              </div>

              {/* Row 3: Messaggio textarea */}
              <div className="border-t border-b border-black">
                <label className="block py-[14px] px-1 cursor-text">
                  <textarea
                    placeholder="Messaggio*"
                    required
                    value={form.messaggio}
                    onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black resize-none`}
                    rows={4}
                  />
                </label>
              </div>

              {/* Privacy + submit */}
              <div className="mt-4">
                <p className={`${txt} w-full md:w-[263px] mb-3`}>
                  Cliccando su &ldquo;Invia&rdquo; dichiaro di aver letto e accettato l&apos;informativa Privacy
                </p>
                <div className="flex items-center gap-[11px] mb-3">
                  <label className="flex items-center gap-[11px] cursor-pointer">
                    <input
                      type="radio" name="newsletter-privacy" value="acconsento"
                      onChange={(e) => setForm({ ...form, privacy: e.target.value })}
                      className="size-[13px] accent-black"
                    />
                    <span className={txt}>Acconsento</span>
                  </label>
                  <label className="flex items-center gap-[11px] cursor-pointer ml-6">
                    <input
                      type="radio" name="newsletter-privacy" value="non-acconsento"
                      onChange={(e) => setForm({ ...form, privacy: e.target.value })}
                      className="size-[13px] accent-black"
                    />
                    <span className={txt}>Non acconsento</span>
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-[16px] leading-[22px] text-[--foreground] px-[24px] py-[10px] rounded-[100px] bg-[var(--surface-muted)] hover:bg-[--border] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Invio in corso..." : "Invia"}
                  </button>
                </div>
              </div>
            </form>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative size-[35px] flex items-center justify-center shrink-0"
    >
      <Image src="/assets/social-circle.svg" alt="" fill className="absolute inset-0" />
      <span className="relative z-10 size-[18px] flex items-center justify-center">
        <Image src={icon} alt={label} width={16} height={16} className="object-contain" />
      </span>
    </a>
  );
}
