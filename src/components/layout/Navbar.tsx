"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <div className="size-[26px] rounded-full border border-primary flex items-center justify-center shrink-0">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {/* Horizontal line (always visible) */}
        <path d="M0 6H12" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Vertical line (fades when open) */}
        <motion.path
          d="M6 0V12"
          stroke="var(--text-primary)"
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
              <motion.div key={href} className="relative">
                <Link
                  href={href}
                  className={cn(
                    "text-sm leading-normal transition-colors duration-200 block py-1",
                    isDisabled(href)
                      ? "text-[--text-secondary] cursor-default pointer-events-none"
                      : isActive(href)
                        ? "text-[--text-secondary] hover:text-primary"
                        : "text-primary hover:text-[--text-secondary]"
                  )}
                  cursor-type="nav"
                >
                  {label}
                </Link>
                {/* Underline animation */}
                {!isDisabled(href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-[1px] bg-current"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile hamburger — animated lines */}
          <AnimatedHamburger isOpen={menuOpen} onClick={() => setMenuOpen((v) => !v)} />

          {/* Logo — center absolute with micro bounce */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link href="/" aria-label="YAS Architecture — Home" cursor-type="nav">
              <Image src="/assets/logo-yas.svg" alt="YAS Architecture" width={102} height={31} priority />
            </Link>
          </motion.div>

          {/* Desktop right nav */}
          <div className="hidden md:flex items-center gap-[15px]">
            <Link
              href="/contatti"
              className={cn(
                "text-[11.82px] leading-normal px-[17.727px] py-[7.386px] rounded-full transition-colors duration-200 whitespace-nowrap",
                pathname === "/contatti"
                  ? "bg-[--border] text-white"
                  : "bg-[#E5E7EB] text-[--foreground] hover:bg-[--border]"
              )}
              cursor-type="nav"
            >
              Contatti
            </Link>
          </div>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <Link
              href="/contatti"
              className={cn(
                "text-[11.82px] leading-normal px-[13px] py-[6px] rounded-full transition-colors duration-200 whitespace-nowrap",
                pathname === "/contatti"
                  ? "bg-[--border] text-white"
                  : "bg-[#E5E7EB] text-[--foreground] hover:bg-[--border]"
              )}
              cursor-type="nav"
            >
              Contatti
            </Link>
          </div>
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
              cursor-type="nav"
            >
              <span className="text-[22px] leading-normal text-primary px-0">Progetti</span>
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
                  className="block px-5 py-[9px] text-[17px] text-primary hover:opacity-60 transition-opacity"
                  cursor-type="nav"
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Studio — accordion */}
          <div className="border-b border-black">
            <button
              className="w-full flex items-center justify-between px-[10px] py-[10px]"
              onClick={() => setStudioOpen((v) => !v)}
              aria-expanded={studioOpen}
              cursor-type="nav"
            >
              <span className="text-[22px] leading-normal text-primary px-0">Studio</span>
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
                  className="block px-5 py-[9px] text-[17px] text-primary hover:opacity-60 transition-opacity"
                  cursor-type="nav"
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
              cursor-type="nav"
            >
              <span className="text-[22px] leading-normal text-primary">{label}</span>
            </Link>
          ))}

          {/* Contatti — no border-b */}
          <Link href="/contatti" className="flex items-center px-[10px] py-[10px]" cursor-type="nav">
            <span className="text-[22px] leading-normal text-primary">Contatti</span>
          </Link>

        </nav>
      </motion.div>
    </>
  );
}

