"use client";

import { useState } from "react";

const SOCIAL = [
  { label: "Fb", href: "https://facebook.com" },
  { label: "Ig", href: "https://instagram.com" },
  { label: "Be", href: "https://behance.net" },
  { label: "Pi", href: "https://pinterest.com" },
];

export default function ContattiClient() {
  const [form, setForm] = useState({
    nome: "", cognome: "", indirizzo: "", paese: "",
    citta: "", cap: "", email: "", telefono: "",
    messaggio: "", privacy: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const privacyBlocked = form.privacy === "non-acconsento";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privacyBlocked) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-[53px]">
      {/* ── Hero section ───────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-[32px] pt-16 pb-12 space-y-14">
        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Get in touch</p>
          <a
            href="mailto:info@yas-arch.com"
            className="text-[36px] leading-[1.2] text-black hover:opacity-60 transition-opacity"
          >
            info@yas-arch.com
          </a>
        </div>

        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Have a new project</p>
          <a
            href="#form"
            className="text-[36px] leading-[1.2] text-black underline decoration-solid underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Start a project
          </a>
        </div>

        <div className="flex items-center gap-[50px]">
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
      <div id="form" className="max-w-[1440px] mx-auto px-[32px] pt-10 pb-20">
        <div className="flex items-baseline justify-between mb-10">
          <p className="text-[16px] leading-[1.2] text-black">Richiedi informazioni</p>
          <p className="text-[11px] leading-[1.2] text-black/40">* campi obbligatori</p>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr] gap-16">
          {/* Left — contact info */}
          <div className="space-y-8">
            <div>
              <p className="text-[12px] leading-normal text-black mb-1">Office</p>
              <p className="text-[16px] leading-[1.2] text-black">Via Dè Gracchi, 47</p>
              <p className="text-[16px] leading-[1.2] text-black">72100 Brindisi (BR) Italia</p>
            </div>
            <div>
              <p className="text-[12px] leading-normal text-black mb-1">Careers</p>
              <a href="mailto:hr@yas-arch.com" className="text-[16px] leading-[1.2] text-black hover:opacity-60 transition-opacity">
                hr@yas-arch.com
              </a>
            </div>
            <div>
              <p className="text-[12px] leading-normal text-black mb-1">PR&amp;Collaborations</p>
              <a href="mailto:public@yas-arch.com" className="text-[16px] leading-[1.2] text-black hover:opacity-60 transition-opacity">
                public@yas-arch.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          {status === "sent" ? (
            <div className="py-20">
              <p className="text-[16px] text-black mb-1">Messaggio inviato!</p>
              <p className="text-[12px] text-black/50">Ti risponderemo al più presto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row 1: Nome | Cognome */}
              <div className="grid grid-cols-[2fr_3fr] border-t border-black">
                <Field label="Nome" value={form.nome} onChange={set("nome")} autoComplete="given-name" borderRight />
                <Field label="Cognome" value={form.cognome} onChange={set("cognome")} autoComplete="family-name" />
              </div>

              {/* Row 2: Indirizzo | Paese */}
              <div className="grid grid-cols-[3fr_2fr] border-t border-black">
                <Field label="Indirizzo *" value={form.indirizzo} onChange={set("indirizzo")} autoComplete="street-address" required borderRight />
                <Field label="Paese" value={form.paese} onChange={set("paese")} autoComplete="country-name" />
              </div>

              {/* Row 3: Città | CAP */}
              <div className="grid grid-cols-[3fr_2fr] border-t border-black">
                <Field label="Città *" value={form.citta} onChange={set("citta")} autoComplete="address-level2" required borderRight />
                <Field label="CAP" value={form.cap} onChange={set("cap")} autoComplete="postal-code" />
              </div>

              {/* Row 4: e-mail | Telefono */}
              <div className="grid grid-cols-[3fr_2fr] border-t border-b border-black">
                <Field label="e-mail *" value={form.email} onChange={set("email")} type="email" autoComplete="email" required borderRight />
                <Field label="Telefono" value={form.telefono} onChange={set("telefono")} type="tel" autoComplete="tel" />
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
                    className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black/40 resize-none"
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
                    Errore nell&apos;invio. Riprova o scrivi a info@yas-arch.com
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === "sending" || privacyBlocked}
                    className="text-[16px] leading-[22px] text-[#333] px-[24px] py-[10px] rounded-[100px] bg-[#e9ebed] hover:bg-[#d9dadb] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Invio…" : "Invia"}
                  </button>
                </div>
              </div>
            </form>
          )}
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
    <label className={`h-[90px] px-1 flex flex-col justify-center cursor-text${borderRight ? " border-r border-black" : ""}`}>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black/40"
      />
    </label>
  );
}
