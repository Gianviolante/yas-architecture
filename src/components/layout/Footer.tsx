"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", paese: "", privacy: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to API route
    setSent(true);
  };

  return (
    <footer className="border-t border-gray-light mt-auto">
      {/* Main footer grid */}
      <div className="max-w-[1440px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left half: company info + links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Company info */}
          <div className="text-sm text-black/70 space-y-1">
            <p className="font-medium text-black mb-3">YAS Architecture srl</p>
            <p>Via Dè Gracchi, 47</p>
            <p>72100 Brindisi (BR) Italia</p>
            <p>T +39 351 531 7762</p>
            <p>info@yas-arch.com</p>
            <div className="pt-4 space-y-1">
              <p>© YAS Architecture Srl</p>
              <p>Cap.Soc. i.v. € 100.000,00</p>
              <p>P.I./C.F./Iscr. Reg. Imp. 01250700789</p>
              <p>Bari REA PN 87998</p>
            </div>
          </div>

          {/* Contatti */}
          <div className="text-sm text-black/70 space-y-1">
            <p className="font-medium text-black mb-3">Contatti</p>
            <p>Informazioni generali</p>
            <a href="mailto:info@yas-arch.com" className="block hover:text-black transition-colors">
              info@yas-arch.com
            </a>
            <p className="pt-2">Informazioni commerciali</p>
            <a href="mailto:sales@yas-arch.org" className="block hover:text-black transition-colors">
              sales@yas-arch.org
            </a>
          </div>

          {/* Studio links */}
          <div className="text-sm text-black/70 space-y-1">
            <p className="font-medium text-black mb-3">Studio</p>
            <Link href="/team" className="block hover:text-black transition-colors">Team</Link>
            <Link href="/progetti" className="block hover:text-black transition-colors">Progetti</Link>
            <Link href="/eventi" className="block hover:text-black transition-colors">Eventi</Link>
            <Link href="/press" className="block hover:text-black transition-colors">Press</Link>
            <button className="flex items-center gap-1 hover:text-black transition-colors mt-2">
              Partners <span className="text-xs">↓</span>
            </button>
          </div>
        </div>

        {/* Right half: newsletter */}
        <div>
          <p className="text-sm font-medium text-black mb-5">Iscriviti alla nostra newsletter</p>
          {sent ? (
            <p className="text-sm text-black/60">Grazie per l&apos;iscrizione!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="border-b border-gray-light bg-transparent text-sm py-2 outline-none focus:border-black transition-colors placeholder:text-black/40"
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={form.cognome}
                  onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                  className="border-b border-gray-light bg-transparent text-sm py-2 outline-none focus:border-black transition-colors placeholder:text-black/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="e-mail*"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border-b border-gray-light bg-transparent text-sm py-2 outline-none focus:border-black transition-colors placeholder:text-black/40"
                />
                <input
                  type="text"
                  placeholder="Paese"
                  value={form.paese}
                  onChange={(e) => setForm({ ...form, paese: e.target.value })}
                  className="border-b border-gray-light bg-transparent text-sm py-2 outline-none focus:border-black transition-colors placeholder:text-black/40"
                />
              </div>
              <p className="text-xs text-black/50 pt-1">
                Cliccando su &ldquo;Invia&rdquo; dichiaro di aver letto e accettato l&apos;informativa Privacy
              </p>
              <div className="flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="acconsento"
                    onChange={(e) => setForm({ ...form, privacy: e.target.value })}
                    className="accent-black"
                  />
                  Acconsento
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="non-acconsento"
                    onChange={(e) => setForm({ ...form, privacy: e.target.value })}
                    className="accent-black"
                  />
                  Non acconsento
                </label>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="text-sm px-8 py-2 rounded-full border border-black/30 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  Invia
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-light">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Legal links */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs text-black/50">
            <Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/cookie-solution" className="hover:text-black transition-colors">Cookie Solution</Link>
            <Link href="/cookie-settings" className="hover:text-black transition-colors">Cookie Settings</Link>
          </div>

          {/* Social + Maps */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-black/50 mr-1">Seguici su</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center hover:border-black transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center hover:border-black transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center hover:border-black transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
            <a
              href="https://maps.google.com/?q=Via+De+Gracchi+47+Brindisi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-1.5 rounded-full border border-black/30 hover:border-black transition-colors"
            >
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
