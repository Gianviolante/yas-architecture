"use client";

import { useState } from "react";

export default function ContattiClient() {
  const [form, setForm] = useState({
    nome: "", cognome: "", indirizzo: "", stato: "",
    citta: "", cap: "", email: "", telefono: "",
    messaggio: "", privacy: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
      {/* Hero CTA section */}
      <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-12">
        <div className="space-y-10">
          <div>
            <p className="text-xs text-black/40 uppercase tracking-widest mb-2">Get in touch</p>
            <a
              href="mailto:info@yas-arch.com"
              className="text-3xl font-semibold hover:text-black/60 transition-colors"
            >
              info@yas-arch.com
            </a>
          </div>

          <div>
            <p className="text-xs text-black/40 uppercase tracking-widest mb-2">Have a new project</p>
            <a
              href="#form"
              className="text-3xl font-semibold underline underline-offset-4 hover:text-black/60 transition-colors"
            >
              Start a project
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6 text-sm text-black/50">
            {[
              { label: "Fb", href: "https://facebook.com" },
              { label: "Ig", href: "https://instagram.com" },
              { label: "Be", href: "https://behance.net" },
              { label: "Pi", href: "https://pinterest.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-light" />

      {/* Form section */}
      <div id="form" className="max-w-[1440px] mx-auto px-8 pt-12 pb-16 grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Left: contacts info */}
        <div className="space-y-8 text-sm">
          <p className="text-base font-medium">Richiedi informazioni</p>

          <div className="space-y-1">
            <p className="text-xs text-black/40 uppercase tracking-widest">Office</p>
            <p>Via Dè Gracchi, 47</p>
            <p>72100 Brindisi (BR) Italia</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-black/40 uppercase tracking-widest">Careers</p>
            <a href="mailto:hr@yas-arch.com" className="hover:text-black/60 transition-colors">
              hr@yas-arch.com
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-black/40 uppercase tracking-widest">PR&Collaborations</p>
            <a href="mailto:public@yas-arch.com" className="hover:text-black/60 transition-colors">
              public@yas-arch.com
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div className="md:col-span-2">
          {status === "sent" ? (
            <div className="py-16 text-center">
              <p className="text-base font-medium mb-2">Messaggio inviato!</p>
              <p className="text-sm text-black/50">Ti risponderemo al più presto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nome" value={form.nome} onChange={set("nome")} />
                <FormField label="Cognome" value={form.cognome} onChange={set("cognome")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Indirizzo*" value={form.indirizzo} onChange={set("indirizzo")} required />
                <FormField label="Stato" value={form.stato} onChange={set("stato")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Città*" value={form.citta} onChange={set("citta")} required />
                <FormField label="Cap" value={form.cap} onChange={set("cap")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="e-mail*" value={form.email} onChange={set("email")} type="email" required />
                <FormField label="Telefono" value={form.telefono} onChange={set("telefono")} type="tel" />
              </div>

              {/* Messaggio */}
              <div className="relative">
                <textarea
                  placeholder="Messaggio*"
                  required
                  value={form.messaggio}
                  onChange={set("messaggio")}
                  rows={4}
                  className="w-full border-b border-gray-light bg-transparent text-sm py-3 outline-none focus:border-black transition-colors placeholder:text-black/30 resize-none"
                />
              </div>

              {/* Privacy */}
              <div className="pt-2 space-y-3">
                <p className="text-xs text-black/50">
                  Cliccando su &ldquo;Invia&rdquo; dichiaro di aver letto e accettato l&apos;informativa Privacy
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="privacy" value="acconsento" onChange={set("privacy")} className="accent-black" required />
                    Acconsento
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="privacy" value="non-acconsento" onChange={set("privacy")} className="accent-black" />
                    Non acconsento
                  </label>
                </div>
              </div>

              {status === "error" && (
                <p className="text-xs text-red-500">Errore nell&apos;invio. Riprova o scrivi a info@yas-arch.com</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="text-sm px-8 py-2 rounded-full border border-black/30 hover:border-black hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-40"
                >
                  {status === "sending" ? "Invio..." : "Invia"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label, value, onChange, type = "text", required = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative border-b border-gray-light focus-within:border-black transition-colors">
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent text-sm py-3 outline-none placeholder:text-black/30"
      />
    </div>
  );
}
