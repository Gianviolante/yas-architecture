"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCsrfToken } from "@/lib/utils/csrf";

const SOCIAL = [
  { label: "Fb", href: "https://www.facebook.com/p/Y-A-S-architecture-100063041749591" },
  { label: "Ig", href: "https://www.instagram.com/yas_architecture_/" },
];

const INITIAL_FORM_STATE = {
  nome: "", cognome: "", indirizzo: "", paese: "",
  citta: "", cap: "", email: "", telefono: "",
  messaggio: "", privacy: "",
};

export default function ContattiClient() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const privacyBlocked = form.privacy === "non-acconsento";

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (status === "sent") {
      const timer = setTimeout(() => setStatus("idle"), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privacyBlocked) return;
    setStatus("sending");
    try {
      const csrfToken = getCsrfToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, csrfToken }),
        credentials: "include", // Include cookies in request
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) {
        setForm(INITIAL_FORM_STATE);
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-[60px] md:pt-[53px]">

      {/* ── Hero section ───────────────────────────────────────────── */}
      <div className="page-px pt-[40px] md:pt-[50px] space-y-[40px] md:space-y-[60px]">
        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Get in touch</p>
          <a
            href="mailto:studio@yas-arc.com"
            className="text-[28px] md:text-[36px] leading-[1.2] text-black hover:opacity-60 transition-opacity break-all"
          >
            studio@yas-arc.com
          </a>
        </div>

        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Have a new project</p>
          <a
            href="#form"
            className="text-[28px] md:text-[36px] leading-[1.2] text-black underline decoration-solid underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Start a project
          </a>
        </div>

        <div className="flex items-center gap-[32px] md:gap-[50px] pb-[40px] md:pb-[52px]">
          {SOCIAL.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[24px] leading-[1.2] text-black hover:opacity-50 transition-opacity"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Shadow divider ─────────────────────────────────────────── */}
      <div className="w-full h-[75px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />

      {/* ── Form section ───────────────────────────────────────────── */}
      <div id="form" className="page-px pt-[24px] md:pt-[32px] pb-20">
        <div className="flex items-baseline justify-between mb-[24px] md:mb-[32px]">
          <p className="text-[16px] leading-[1.2] text-black">Richiedi informazioni</p>
          <p className="text-[11px] leading-[1.2] text-black/40">* campi obbligatori</p>
        </div>

        {/* Two-column layout: contact info + form */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr] gap-[32px] md:gap-[40px] lg:gap-16">

          {/* Left — contact info */}
          <div className="space-y-[24px] md:space-y-8">
            <div>
              <p className="text-[12px] leading-normal text-black mb-1">Office</p>
              <p className="text-[16px] leading-[1.2] text-black">Piazza Marco Antonio Cavalerio, 21</p>
              <p className="text-[16px] leading-[1.2] text-black">72100 Brindisi (BR) Italia</p>
            </div>
            <div>
              <p className="text-[12px] leading-normal text-black mb-1">Contact</p>
              <a href="mailto:studio@yas-arc.com" className="text-[16px] leading-[1.2] text-black hover:opacity-60 transition-opacity">
                studio@yas-arc.com
              </a>
            </div>
          </div>

          {/* Right — form + toast */}
          <div className="relative">
            {/* Toast notification */}
            <AnimatePresence>
              {status === "sent" && (
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
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Row 1: Nome | Cognome */}
              <div className="grid grid-cols-2 md:grid-cols-[2fr_3fr] border-t border-black">
                <div className="py-3 px-1 border-r border-black">
                  <input type="text" placeholder="Nome" value={form.nome} onChange={set("nome")} autoComplete="given-name" className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
                <div className="py-3 px-1">
                  <input type="text" placeholder="Cognome" value={form.cognome} onChange={set("cognome")} autoComplete="family-name" className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 2: Indirizzo (full width) */}
              <div className="border-t border-black">
                <div className="py-3 px-1">
                  <input type="text" placeholder="Indirizzo *" value={form.indirizzo} onChange={set("indirizzo")} autoComplete="street-address" required className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 3: Città (full width) */}
              <div className="border-t border-black">
                <div className="py-3 px-1">
                  <input type="text" placeholder="Città *" value={form.citta} onChange={set("citta")} autoComplete="address-level2" required className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 4: Paese | CAP */}
              <div className="grid grid-cols-[2fr_1fr] md:grid-cols-[3fr_2fr] border-t border-black">
                <div className="py-3 px-1 border-r border-black">
                  <input type="text" placeholder="Paese" value={form.paese} onChange={set("paese")} autoComplete="country-name" className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
                <div className="py-3 px-1">
                  <input type="text" placeholder="CAP" value={form.cap} onChange={set("cap")} autoComplete="postal-code" className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 5: Telefono (full width) */}
              <div className="border-t border-black">
                <div className="py-3 px-1">
                  <input type="tel" placeholder="Telefono" value={form.telefono} onChange={set("telefono")} autoComplete="tel" className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 6: E-mail (full width) */}
              <div className="border-t border-b border-black">
                <div className="py-3 px-1">
                  <input type="email" placeholder="e-mail *" value={form.email} onChange={set("email")} autoComplete="email" required className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black" />
                </div>
              </div>

              {/* Row 5: Messaggio */}
              <div className="border-b border-black">
                <label className="px-1 py-3 block cursor-text min-h-[120px]">
                  <textarea
                    placeholder="Messaggio *"
                    required
                    value={form.messaggio}
                    onChange={set("messaggio")}
                    rows={4}
                    className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black resize-none"
                  />
                </label>
              </div>

              {/* Privacy + submit */}
              <div className="mt-6 space-y-4">
                <p className="text-[12px] leading-[1.2] text-black max-w-xl">
                  Cliccando su &ldquo;Invia&rdquo; dichiaro di aver letto e accettato l&apos;informativa Privacy
                </p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-[11px] cursor-pointer">
                    <input type="radio" name="privacy" value="acconsento"
                      onChange={set("privacy")} required className="size-[13px] accent-black" />
                    <span className="text-[12px] leading-[1.2] text-black">Acconsento</span>
                  </label>
                  <label className="flex items-center gap-[11px] cursor-pointer">
                    <input type="radio" name="privacy" value="non-acconsento"
                      onChange={set("privacy")} className="size-[13px] accent-black" />
                    <span className="text-[12px] leading-[1.2] text-black">Non acconsento</span>
                  </label>
                </div>

                {privacyBlocked && (
                  <p className="text-[12px] text-black/50">
                    Per inviare il modulo è necessario acconsentire al trattamento dei dati.
                  </p>
                )}

                {status === "error" && (
                  <p className="text-[12px] text-red-600">
                    Errore nell&apos;invio. Riprova o scrivi a studio@yas-arc.com
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === "sending" || privacyBlocked}
                    className="w-full md:w-auto text-[16px] leading-[22px] text-[--foreground] px-[24px] py-[10px] rounded-[100px] bg-[var(--surface-muted)] hover:bg-[--border] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Invio…" : "Invia richiesta"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Field component ─────────────────────────────────────────────── */
function Field({
  label, value, onChange, type = "text", required = false,
  autoComplete, borderRight = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  borderRight?: boolean;
}) {
  return (
    <label className={`h-[90px] px-1 py-3 flex flex-col justify-start cursor-text${borderRight ? " md:border-r border-black" : ""}`}>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black"
      />
    </label>
  );
}
