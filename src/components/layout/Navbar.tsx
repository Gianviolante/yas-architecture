"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/progetti", label: "Progetti" },
  { href: "/studio", label: "Studio" },
  { href: "/team", label: "Team" },
];

const progettiSubLinks = [
  { href: "/progetti?tipologia=Residenziale",    label: "Residenziali" },
  { href: "/progetti?tipologia=Commerciale",     label: "Commerciali" },
  { href: "/progetti",                           label: "Tutti i progetti" },
];

/** Circular chip with + or − */
function AccordionChip({ open }: { open: boolean }) {
  return (
    <div className="size-[26px] rounded-full border border-[#1a1a1a] flex items-center justify-center shrink-0">
      {open ? (
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
          <path d="M0 1H12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 0V12M0 6H12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [progettiOpen, setProgettiOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // chiudi il menu mobile su cambio pagina — adjust-during-render
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/progetti"
      ? pathname === "/progetti" || pathname.startsWith("/progetti/")
      : pathname === href || pathname.startsWith(href);

  /** Link disabilitato (già sulla pagina esatta, non sulle sotto-pagine) */
  const isDisabled = (href: string) => pathname === href;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[60px] md:h-[80px] transition-all duration-200 ease-out",
          scrolled || menuOpen || pathname !== "/"
            ? "bg-white drop-shadow-[0px_0px_4px_rgba(0,0,0,0.2)]"
            : "bg-transparent"
        )}
      >
        <nav className="px-4 md:px-[30px] h-full flex items-center justify-between">

          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-[10px]">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-[14px] leading-normal transition-colors duration-200",
                  isDisabled(href)
                    ? "text-[#d9d9d9] cursor-default pointer-events-none"
                    : isActive(href)
                      ? "text-[#d9d9d9] hover:text-[#1a1a1a]"
                      : "text-[#1a1a1a] hover:text-[#d9d9d9]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger — icone esatte davidegroppi.com */}
          <button
            className="md:hidden p-2 -ml-2 flex items-center justify-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                <path fillRule="evenodd" clipRule="evenodd" d="M12,11.3L22.3,1L23,1.7L12.7,12L23,22.3L22.3,23L12,12.7L1.7,23L1,22.3L11.3,12L1,1.7L1.7,1C1.7,1,12,11.3,12,11.3z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a">
                <path fillRule="evenodd" clipRule="evenodd" d="M24,18v1H0v-1H24z M24,12v1H0v-1H24z M24,6v1H0V6H24z"/>
              </svg>
            )}
          </button>

          {/* Logo — center absolute */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="YAS Architecture — Home">
            <Image src="/assets/logo-yas.svg" alt="YAS Architecture" width={102} height={31} priority />
          </Link>

          {/* Desktop right nav */}
          <div className="hidden md:flex items-center gap-[15px]">
            <Link
              href="/contatti"
              className={cn(
                "text-[11.82px] leading-normal px-[17.727px] py-[7.386px] rounded-[100px] transition-colors duration-200 whitespace-nowrap",
                pathname === "/contatti"
                  ? "bg-[#333] text-white"
                  : "bg-[#e9ebed] text-[#333] hover:bg-[#d9dadb]"
              )}
            >
              Contatti
            </Link>
            <button className="text-[11.82px] leading-normal px-[17.727px] py-[7.386px] rounded-[100px] bg-[#e9ebed] text-[#333] hover:bg-[#d9dadb] transition-colors duration-200">
              IT
            </button>
            <button aria-label="Cerca" className="relative size-[24px] shrink-0">
              <Image src="/assets/icon-search.svg" alt="Cerca" fill />
            </button>
          </div>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-[11px] px-3 py-1 rounded-full bg-[#e9ebed] text-[#333]">IT</button>
            <button aria-label="Cerca" className="relative size-6 shrink-0">
              <Image src="/assets/icon-search.svg" alt="Cerca" fill />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile dropdown menu ─────────────────────────────────────── */}
      <div
        className={cn(
          "fixed top-[60px] left-0 right-0 z-40 bg-white md:hidden transition-all duration-300 ease-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto drop-shadow-[0px_6px_4px_rgba(0,0,0,0.2)]"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <nav>

          {/* Progetti — accordion */}
          <div className="border-b border-black">
            <button
              className="w-full flex items-center justify-between px-[10px] py-[10px]"
              onClick={() => setProgettiOpen((v) => !v)}
              aria-expanded={progettiOpen}
            >
              <span className="text-[22px] leading-normal text-[#1a1a1a] px-0">Progetti</span>
              <AccordionChip open={progettiOpen} />
            </button>

            {/* Sub-items */}
            <div
              className={cn(
                "overflow-hidden transition-[max-height] duration-200 ease-out",
                progettiOpen ? "max-h-[240px]" : "max-h-0"
              )}
            >
              {progettiSubLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="block px-5 py-[9px] text-[17px] text-[#1a1a1a] hover:opacity-60 transition-opacity"
                >
                  {label}
                </Link>
              ))}
              <p className="px-5 pb-4 pt-[6px] text-[12px] text-[#1a1a1a]/60 italic">
                Filtra ricerca
              </p>
            </div>
          </div>

          {/* Studio — chip icon, navigates on click */}
          <Link
            href="/studio"
            className="flex items-center justify-between border-b border-black px-[10px] py-[10px]"
          >
            <span className="text-[22px] leading-normal text-[#1a1a1a]">Studio</span>
            <AccordionChip open={false} />
          </Link>

          {/* Team — plain link, no icon */}
          {[
            { href: "/team", label: "Team" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center border-b border-black px-[10px] py-[10px]"
            >
              <span className="text-[22px] leading-normal text-[#1a1a1a]">{label}</span>
            </Link>
          ))}

          {/* Contatti — no border-b */}
          <Link href="/contatti" className="flex items-center px-[10px] py-[10px]">
            <span className="text-[22px] leading-normal text-[#1a1a1a]">Contatti</span>
          </Link>

        </nav>
      </div>
    </>
  );
}
