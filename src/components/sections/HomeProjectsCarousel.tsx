"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/sanity/types";
import { usePointerFine } from "@/lib/hooks/usePointerFine";

const PLACEHOLDERS = [
  { id: "p1", img: "/assets/home-project-1.jpg", label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p2", img: "/assets/home-project-2.jpg", label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p3", img: "/assets/home-slide-1.jpg",   label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p4", img: "/assets/home-slide-2.jpg",   label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
];

const EDGE_ZONE = 140;

interface Props { projects: Project[]; }

export default function HomeProjectsCarousel({ projects }: Props) {
  const isPointerFine = usePointerFine();
  const [idx, setIdx]             = useState(0);
  const [stepPx, setStepPx]       = useState(0);
  const [isMobile, setIsMobile]   = useState(false);

  const viewportRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const useSanity = projects.length > 0;
  const total     = useSanity ? projects.length : PLACEHOLDERS.length;

  // su mobile mostra 1 card alla volta, su desktop 2
  const maxIdx  = Math.max(0, isMobile ? total - 1 : total - 2);
  // clamp derivato (niente setState in effect): se maxIdx si riduce
  // dopo un resize, l'indice effettivo resta in range
  const shownIdx = Math.min(idx, maxIdx);
  const canPrev = shownIdx > 0;
  const canNext = shownIdx < maxIdx;

  const prev = () => setIdx(Math.max(0, shownIdx - 1));
  const next = () => setIdx(Math.min(maxIdx, shownIdx + 1));

  // rileva pointer fine

  // step responsivo
  useEffect(() => {
    const update = () => {
      if (!viewportRef.current) return;
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const w = viewportRef.current.offsetWidth;
      // mobile: 1 card (full width) + gap 14px | desktop: metà + gap 14px
      setStepPx(mobile ? w + 14 : (w + 14) / 2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < EDGE_ZONE && canPrev) {
      containerRef.current.setAttribute("cursor-type", "prev");
    } else if (x > rect.width - EDGE_ZONE && canNext) {
      containerRef.current.setAttribute("cursor-type", "next");
    } else {
      containerRef.current.removeAttribute("cursor-type");
    }
  };

  const handleMouseLeave = () => {
    containerRef.current?.removeAttribute("cursor-type");
  };

  return (
    <section className="relative">
      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />

      <div className="px-[15px] md:px-[32px] pt-8 pb-16">
        <p className="text-[16px] leading-normal text-black text-center mb-6">Progetti</p>
        <p className="text-[16px] md:text-[24px] font-medium leading-[1.2] text-[#282828] mb-10">
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
          &lsquo;Content here, content here&rsquo;, making it look like readable English. Many desktop publishing packages and web page editors now use…
        </p>

        <div
          ref={containerRef}
          className="relative mb-10"
          onMouseMove={isPointerFine ? handleMouseMove : undefined}
          onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
        >
          {/* Overlay trasparenti sui bordi: intercettano il click prima che
              arrivi alle Link delle card, così vicino al bordo si scrolla
              invece di aprire il progetto. */}
          {isPointerFine && (
            <>
              <button
                aria-label="Progetto precedente"
                onClick={prev}
                className="absolute inset-y-0 left-0 z-10"
                style={{ width: EDGE_ZONE, cursor: "none", pointerEvents: canPrev ? "auto" : "none" }}
              />
              <button
                aria-label="Progetto successivo"
                onClick={next}
                className="absolute inset-y-0 right-0 z-10"
                style={{ width: EDGE_ZONE, cursor: "none", pointerEvents: canNext ? "auto" : "none" }}
              />
            </>
          )}
          <div className="overflow-hidden" ref={viewportRef}>
            <div
              className="flex gap-[14px] transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${shownIdx * stepPx}px)` }}
            >
              {useSanity
                ? projects.map((p) => (
                    <div key={p._id} className="w-full md:w-[calc(50%-7px)] shrink-0">
                      <Link
                        href={`/progetti/${p.slug.current}`}
                        className="block group"
                      >
                        {/* immagine con frecce overlay su mobile */}
                        <div className="relative h-[376px] md:h-[322px] lg:h-[550px] overflow-hidden mb-4">
                          {p.coverImageUrl
                            ? <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            : <div className="w-full h-full bg-[#d9d9d9]" />}

                          {/* frecce mobile — overlay sull'immagine */}
                          <div className="md:hidden">
                            {canPrev && (
                              <button
                                onClick={(e) => { e.preventDefault(); prev(); }}
                                className="absolute left-[5px] top-[164px] size-[48px] flex items-center justify-center rounded-full border-2 border-white mix-blend-difference"
                                aria-label="Progetto precedente"
                              >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
                                </svg>
                              </button>
                            )}
                            {canNext && (
                              <button
                                onClick={(e) => { e.preventDefault(); next(); }}
                                className="absolute right-[5px] top-[164px] size-[48px] flex items-center justify-center rounded-full border-2 border-white mix-blend-difference"
                                aria-label="Progetto successivo"
                              >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-2 group-hover:opacity-70 transition-opacity">
                          {p.title}{p.location ? `, ${p.location}` : ""}
                        </p>
                        <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[10px] py-[3px] text-[11px] text-[#333] leading-[1.4] whitespace-nowrap">
                          {p.typology ?? "Residenziale"}
                        </span>
                      </Link>
                    </div>
                  ))
                : PLACEHOLDERS.map((p) => (
                    <div key={p.id} className="w-full md:w-[calc(50%-7px)] shrink-0">
                      <div className="relative h-[376px] md:h-[322px] lg:h-[550px] overflow-hidden mb-4">
                        <Image src={p.img} alt="" fill className="object-cover" />
                      </div>
                      <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-2">{p.label}</p>
                      <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[10px] py-[3px] text-[11px] text-[#333] leading-[1.4] whitespace-nowrap">
                        {p.typology}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* bottone: full-width mobile, centrato desktop */}
        <div className="md:flex md:justify-center">
          <Link
            href="/progetti"
            className="flex items-center justify-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200 w-full md:w-auto"
          >
            Vai a tutti i progetti
          </Link>
        </div>
      </div>

      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />
    </section>
  );
}
