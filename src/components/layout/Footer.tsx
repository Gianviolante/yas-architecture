"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const txt = "text-[12px] leading-[1.2] text-black font-normal";

export default function Footer() {
  const [form, setForm] = useState({ nome: "", cognome: "", email: "", paese: "", privacy: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="border-t border-gray-light">
      <div className="max-w-[1440px] mx-auto px-[29px] py-10 flex justify-between gap-8">

        {/* ── Left block — Info (≈681px) ────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Title */}
          <p className={`${txt} mb-[17px]`}>YAS Architecture srl</p>

          {/* 3 columns — grow to fill space */}
          <div className="flex flex-1">
            {/* Col 1 — Company address */}
            <div className={`${txt} w-[232px] shrink-0 space-y-0`}>
              <p>Via Dè Gracchi, 47</p>
              <p>72100 Brindisi (BR) Italia</p>
              <p>T +39 351 531 7762</p>
              <p>info@yas-arch.com</p>
              <p>&nbsp;</p>
              <p>© YAS Architecture Srl</p>
              <p>Cap.Soc. i.v. € 100.000,00</p>
              <p>P.I./C.F./Iscr. Reg. Imp. 01250700789</p>
              <p>Bari REA PN 87998</p>
            </div>

            {/* Col 2 — Contatti */}
            <div className={`${txt} w-[232px] shrink-0`}>
              <p>Contatti</p>
              <p>informazioni generali</p>
              <a href="mailto:info@yas-arch.com" className="block hover:underline">info@yas-arch.com</a>
              <p>informazioni commerciali</p>
              <a href="mailto:sales@yas-arch.org" className="block hover:underline">sales@yas-arch.org</a>
            </div>

            {/* Col 3 — Studio links */}
            <div className={`${txt}`}>
              <Link href="/studio" className="block hover:underline">Studio</Link>
              <Link href="/team" className="block hover:underline">Team</Link>
              <Link href="/progetti" className="block hover:underline">Progetti</Link>
              <Link href="/eventi" className="block hover:underline">Eventi</Link>
              <Link href="/press" className="block hover:underline">Press</Link>
              <p>&nbsp;</p>
              <button className={`${txt} hover:underline`}>Partners↓</button>
            </div>
          </div>

          {/* Bottom row — same 3-column alignment */}
          <div className="flex items-end mt-10">
            {/* Col 1 — Privacy */}
            <div className={`${txt} w-[232px] shrink-0`}>
              <p>Privacy Policy</p>
              <p>Coockie Solution</p>
              <p>Coockie Settings</p>
            </div>

            {/* Col 2 — Seguici su + social icons */}
            <div className="w-[232px] shrink-0">
              <p className={`${txt} mb-[7px]`}>Seguici su</p>
              <div className="flex items-center gap-[12px]">
                <SocialIcon href="https://facebook.com" label="Facebook" icon="/assets/icon-facebook-v.svg" />
                <SocialIcon href="https://instagram.com" label="Instagram" icon="/assets/icon-instagram-v.svg" />
                <SocialIcon href="https://linkedin.com" label="LinkedIn" icon="/assets/icon-linkedin-1.svg" />
              </div>
            </div>

            {/* Col 3 — Google Maps */}
            <div>
              <a
                href="https://maps.google.com/?q=Via+De+Gracchi+47+Brindisi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] leading-[22px] text-[#333] border-2 border-[#333] px-[24px] py-[10px] rounded-[100px] hover:bg-[#333] hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* ── Right block — Newsletter (490px) ─────────────────────── */}
        <div className="w-[490px] shrink-0">
          <p className={`${txt} mb-[17px]`}>Iscriviti alla nostra newsletter</p>

          {sent ? (
            <p className={`${txt} text-black/50`}>Grazie per l&apos;iscrizione!</p>
          ) : (
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

              {/* Row 2: e-mail (60%) | Paese (40%) */}
              <div className="border-t border-b border-black flex">
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
                    type="text"
                    placeholder="Paese"
                    value={form.paese}
                    onChange={(e) => setForm({ ...form, paese: e.target.value })}
                    autoComplete="country-name"
                    className={`${txt} w-full bg-transparent outline-none placeholder:text-black`}
                  />
                </label>
              </div>

              {/* Privacy + submit */}
              <div className="mt-4">
                <p className={`${txt} w-[263px] mb-3`}>
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
                    className="text-[16px] leading-[22px] text-[#333] px-[24px] py-[10px] rounded-[100px] bg-[#e9ebed] hover:bg-[#d9dadb] transition-colors duration-200"
                  >
                    Invia
                  </button>
                </div>
              </div>
            </form>
          )}
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
