"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import AnimatedHamburger from "@/components/ui/AnimatedHamburger";

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

const studioSubLinks = [
  { href: "/studio",    label: "Studio" },
  { href: "/team",      label: "Designers" },
];

/** Circular chip with + or − */
function AccordionChip({ open }: { open: boolean }) {
  return (
    <div className="size-[26px] rounded-full border border-[#1a1a1a] flex items-center justify-center shrink-0">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {/* Horizontal line (always visible) */}
        <path d="M0 6H12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Vertical line (fades when open) */}
        <motion.path
          d="M6 0V12"
          stroke="#1a1a1a"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [progettiOpen, setProgettiOpen] = useState(true);
  const [studioOpen, setStudioOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  // Mappa pathname a nome pagina per il titolo
  const getPageName = () => {
    if (pathname === "/" || pathname === "") return "";
    if (pathname.startsWith("/progetti")) return "Progetti";
    if (pathname.startsWith("/studio")) return "Studio";
    if (pathname.startsWith("/team")) return "Team";
    if (pathname.startsWith("/contatti")) return "Contatti";
    return "";
  };

  const pageName = getPageName();

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
        <nav className="page-px h-full flex items-center justify-between">

          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-[20px]">
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

          {/* Mobile hamburger — animated lines */}
          <AnimatedHamburger isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} />

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
                  : "bg-[var(--surface-muted)] text-[--foreground] hover:bg-[--border]"
              )}
            >
              Contatti
            </Link>
          </div>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-2" />
        </nav>
      </header>

      {/* ── Mobile dropdown menu ─────────────────────────────────────── */}
      {/* z-50: sopra qualsiasi barra sticky di pagina (Team/Studio z-40,
          filtri Progetti z-40) — il menu di navigazione deve sempre
          restare in primo piano, come su qualsiasi sito. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "fixed top-[60px] left-0 right-0 z-50 bg-white md:hidden drop-shadow-[0px_6px_4px_rgba(0,0,0,0.2)]",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
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
            <motion.div
              initial={false}
              animate={{ height: progettiOpen ? "auto" : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
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
            </motion.div>
          </div>

          {/* Studio — accordion */}
          <div className="border-b border-black">
            <button
              className="w-full flex items-center justify-between px-[10px] py-[10px]"
              onClick={() => setStudioOpen((v) => !v)}
              aria-expanded={studioOpen}
            >
              <span className="text-[22px] leading-normal text-[#1a1a1a] px-0">Studio</span>
              <AccordionChip open={studioOpen} />
            </button>

            {/* Sub-items */}
            <motion.div
              initial={false}
              animate={{ height: studioOpen ? "auto" : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {studioSubLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="block px-5 py-[9px] text-[17px] text-[#1a1a1a] hover:opacity-60 transition-opacity"
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          </div>

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
      </motion.div>
    </>
  );
}

