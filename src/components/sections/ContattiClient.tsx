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
    nome: "", cognome: "", indirizzo: "", stato: "",
    citta: "", cap: "", email: "", telefono: "",
    messaggio: "", privacy: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        {/* Get in touch */}
        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Get in touch</p>
          <a
            href="mailto:info@yas-arch.com"
            className="text-[36px] leading-[1.2] text-black hover:opacity-60 transition-opacity"
          >
            info@yas-arch.com
          </a>
        </div>

        {/* Have a new project */}
        <div>
          <p className="text-[16px] leading-[1.2] text-black mb-2">Have a new project</p>
          <a
            href="#form"
            className="text-[36px] leading-[1.2] text-black underline decoration-solid underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Start a project
          </a>
        </div>

        {/* Social links — plain text at 24px */}
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
        <p className="text-[16px] leading-[1.2] text-black mb-10">Richiedi informazioni</p>

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
              {/* Row 1: Nome (40%) | Cognome (60%) */}
              <div className="grid grid-cols-[2fr_3fr] border-t border-black">
                <Field label="Nome" value={form.nome} onChange={set("nome")} borderRight />
                <Field label="Cognome" value={form.cognome} onChange={set("cognome")} />
              </div>

              {/* Row 2: Indirizzo (60%) | Stato (40%) */}
              <div className="grid grid-cols-[3fr_2fr] border-t border-b border-black">
                <Field label="Indirizzo*" value={form.indirizzo} onChange={set("indirizzo")} required borderRight tall />
                <Field label="Stato" value={form.stato} onChange={set("stato")} tall />
              </div>

              {/* Row 3: Città (60%) | Cap (40%) */}
              <div className="grid grid-cols-[3fr_2fr] border-b border-black">
                <Field label="Città*" value={form.citta} onChange={set("citta")} required borderRight tall />
                <Field label="Cap" value={form.cap} onChange={set("cap")} tall />
              </div>

              {/* Row 4: e-mail (60%) | Telefono (40%) */}
              <div className="grid grid-cols-[3fr_2fr] border-b border-black">
                <Field label="e-mail*" value={form.email} onChange={set("email")} type="email" required borderRight tall />
                <Field label="Telefono" value={form.telefono} onChange={set("telefono")} type="tel" tall />
              </div>

              {/* Row 5: Messaggio full width */}
              <div className="border-b border-black">
                <label className="px-1 py-3 block cursor-text">
                  <textarea
                    placeholder="Messaggio*"
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

                {status === "error" && (
                  <p className="text-[12px] text-red-600">
                    Errore nell&apos;invio. Riprova o scrivi a info@yas-arch.com
                  </p>
                )}

                {/* Invia — left aligned, filled gray pill */}
                <div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="text-[16px] leading-[22px] text-[#333] px-[24px] py-[10px] rounded-[100px] bg-[#e9ebed] hover:bg-[#d9dadb] transition-colors duration-200 disabled:opacity-40"
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
  borderRight = false, tall = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  borderRight?: boolean;
  tall?: boolean;
}) {
  return (
    <label className={`px-1 py-3 ${tall ? "min-h-[115px]" : "min-h-[90px]"} ${borderRight ? "border-r border-black" : ""} flex flex-col justify-start cursor-text`}>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent text-[12px] leading-[1.2] text-black outline-none placeholder:text-black"
      />
    </label>
  );
}
