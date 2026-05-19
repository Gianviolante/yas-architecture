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
  { href: "/eventi", label: "Eventi" },
];

const progettiSubLinks = [
  { href: "/progetti?tipologia=Residenziale",    label: "Residenziali" },
  { href: "/progetti?tipologia=Commerciale",     label: "Commerciali" },
  { href: "/progetti?tipologia=Interior Design", label: "Interior Design" },
  { href: "/progetti?tipologia=Architettura",    label: "Architettura" },
  { href: "/progetti",                           label: "Tutti i progetti" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progettiOpen, setProgettiOpen] = useState(true);
  // const [progettiDropdown, setProgettiDropdown] = useState(false);
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

  const isActive = (href: string) =>
    href === "/progetti"
      ? pathname === "/progetti" || pathname.startsWith("/progetti/")
      : pathname === href || pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[53px] transition-all duration-200 ease-out",
          scrolled || menuOpen || pathname !== "/"
            ? "bg-white drop-shadow-[0px_0px_4px_rgba(0,0,0,0.2)]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-[1440px] mx-auto page-px h-full flex items-center justify-between gap-[430px_0]">
          {/* Desktop left nav */}
          <div className="hidden md:flex items-center gap-[10px]">
            {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-[14px] leading-normal transition-colors duration-200",
                    isActive(href)
                      ? "text-[#d9d9d9] cursor-default pointer-events-none"
                      : "text-[#1a1a1a] hover:text-[#d9d9d9]"
                  )}
                >
                  {label}
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -ml-2 text-xl leading-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Logo — center absolute */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="YAS Architecture — Home"
          >
            <Image
              src="/assets/logo-yas.svg"
              alt="YAS Architecture"
              width={102}
              height={31}
              priority
            />
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
              className="w-full flex items-center justify-between px-6 py-5 text-[14px] font-medium"
              onClick={() => setProgettiOpen((v) => !v)}
            >
              <span>Progetti</span>
              <span className="text-xl leading-none text-black/40">{progettiOpen ? "−" : "+"}</span>
            </button>
            {progettiOpen && (
              <div className="pb-4">
                {progettiSubLinks.map(({ href, label }) => (
                  <Link key={label} href={href} className="block px-10 py-2 text-[12px] text-black/50 hover:text-black">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {[
            { href: "/studio", label: "Studio" },
            { href: "/team", label: "Team" },
            { href: "/eventi", label: "Eventi" },
            { href: "/contatti", label: "Contatti" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between border-b border-gray-light px-6 py-5 text-[14px] font-medium hover:bg-gray-lightest"
            >
              {label}
              <span className="text-xl leading-none text-black/40">+</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
