"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/progetti", label: "Progetti" },
  { href: "/studio", label: "Studio" },
  { href: "/team", label: "Team" },
  { href: "/eventi", label: "Eventi" },
];

const progettiSubLinks = [
  { href: "/progetti?tipologia=Residenziale", label: "Residenziali" },
  { href: "/progetti?tipologia=Commerciale", label: "Commerciali" },
  { href: "/progetti", label: "Tutti i progetti" },
  { href: "/progetti#filtri", label: "Filtra ricerca" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progettiOpen, setProgettiOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[53px] transition-all duration-200 ease-out",
          scrolled || menuOpen
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-light"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm tracking-wide transition-all duration-200 ease-out relative pb-px",
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:transition-all after:duration-200",
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "text-black after:bg-black"
                    : "text-black/70 hover:text-black after:bg-transparent hover:after:bg-black/30"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <span className="text-xl leading-none">✕</span>
            ) : (
              <span className="text-xl leading-none">☰</span>
            )}
          </button>

          {/* Logo — center absolute */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 whitespace-nowrap"
          >
            <span className="w-5 h-5 rounded-full border border-black/70 inline-block shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-[0.22em] uppercase">YAS</span>
              <span className="text-[9px] font-normal tracking-[0.28em] uppercase text-black/60">ARCHITECTURE</span>
            </span>
          </Link>

          {/* Desktop right nav */}
          <div className="hidden md:flex items-center gap-5 text-sm">
            <Link
              href="/contatti"
              className={cn(
                "text-sm px-4 py-1 rounded-full border transition-colors duration-200",
                pathname === "/contatti"
                  ? "border-black text-black"
                  : "border-black/30 text-black/70 hover:border-black hover:text-black"
              )}
            >
              Contatti
            </Link>
            <span className="text-gray-light">|</span>
            <button className="text-black/70 hover:text-black transition-colors duration-200 text-xs tracking-widest uppercase">
              IT
            </button>
            <button className="text-black/70 hover:text-black transition-colors duration-200" aria-label="Cerca">
              <SearchIcon />
            </button>
          </div>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-3 text-sm">
            <button className="text-black/70 hover:text-black text-xs tracking-widest uppercase">IT</button>
            <button className="text-black/70 hover:text-black" aria-label="Cerca">
              <SearchIcon />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white flex flex-col pt-[53px] transition-transform duration-300 ease-out md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 overflow-y-auto">
          {/* Progetti accordion */}
          <div className="border-b border-gray-light">
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-base font-medium"
              onClick={() => setProgettiOpen((v) => !v)}
            >
              <span>Progetti</span>
              <span className="text-xl leading-none text-gray-dark">
                {progettiOpen ? "−" : "+"}
              </span>
            </button>
            {progettiOpen && (
              <div className="pb-4">
                {progettiSubLinks.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="block px-10 py-2 text-sm text-gray-dark hover:text-black"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other links */}
          {[
            { href: "/studio", label: "Studio" },
            { href: "/team", label: "Team" },
            { href: "/eventi", label: "Eventi" },
            { href: "/contatti", label: "Contatti" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between border-b border-gray-light px-6 py-5 text-base font-medium hover:bg-gray-lightest"
            >
              {label}
              <span className="text-xl leading-none text-gray-dark">+</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5" />
      <line x1="11" y1="11" x2="14.5" y2="14.5" />
    </svg>
  );
}
