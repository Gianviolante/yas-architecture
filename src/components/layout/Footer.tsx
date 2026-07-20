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

            {/* Col 2 — Contatti */}
            <div className={`${txt} w-full md:w-[232px] md:shrink-0 mb-4 md:mb-0`}>
              <p>Contatti</p>
              <a href="mailto:studio@yas-arc.com" className="block hover:underline">studio@yas-arc.com</a>
            </div>

            {/* Col 3 — Studio links */}
            <div className={`${txt}`}>
              <Link href="/studio" className="block hover:underline">Studio</Link>
              <Link href="/team" className="block hover:underline">Team</Link>
              <Link href="/progetti" className="block hover:underline">Progetti</Link>
            </div>
          </div>

          {/* Bottom row — same 3-column alignment */}
          <div className="flex flex-col md:flex-row items-start md:items-end mt-10 gap-4 md:gap-0">
            {/* Col 1 — Privacy */}
            <div className={`${txt} w-full md:w-[232px] md:shrink-0`}>
              <p>Privacy Policy</p>
              <p>Coockie Solution</p>
              <p>Coockie Settings</p>
            </div>

            {/* Col 2 — Seguici su + social icons */}
            <div className="w-full md:w-[232px] md:shrink-0">
              <p className={`${txt} mb-[7px]`}>Seguici su</p>
              <div className="flex items-center gap-[12px]">
                <SocialIcon href="https://facebook.com" label="Facebook" icon="/assets/icon-facebook-v.svg" />
                <SocialIcon href="https://instagram.com" label="Instagram" icon="/assets/icon-instagram-v.svg" />
              </div>
            </div>

            {/* Col 3 — Google Maps */}
            <div>
              <a
                href="https://maps.google.com/?q=Piazza+Marco+Antonio+Cavalerio+21+72100+Brindisi+BR+Italia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] leading-[22px] text-[--foreground] border-2 border-[--foreground] px-[24px] py-[10px] rounded-[100px] hover:bg-[#333] hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* ── Right block — Contatti (490px) ─────────────────────── */}
        <div className="w-full lg:w-[490px] lg:shrink-0">
          <p className={`${txt} mb-[17px]`}>Contatti</p>

          {sent ? (
            <p className={`${txt} text-black/50`}>Grazie, ti risponderemo il prima possibile!</p>
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
                    className="text-[16px] leading-[22px] text-[--foreground] px-[24px] py-[10px] rounded-[100px] bg-[--surface-muted] hover:bg-[--border] transition-colors duration-200"
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
