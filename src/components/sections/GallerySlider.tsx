"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export interface GalleryItem {
  url: string;
  caption?: string;
}

interface Props {
  items: GalleryItem[];
  projectTitle: string;
  compact?: boolean;
}

const EDGE_ZONE = 140;

export default function GallerySlider({ items, projectTitle, compact = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isPointerFine,  setIsPointerFine]  = useState(false);
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showPrev,       setShowPrev]       = useState(false);
  const [showNext,       setShowNext]       = useState(false);

  const cardW = (i: number) => compact ? 263 : i === 0 ? 580 : 505;
  const cardH = compact ? 202 : 633;
  const gap   = compact ? 15  : 77;
  const SLIDE_STEP = (compact ? 263 : 580) + gap;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsPointerFine(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / SLIDE_STEP), Math.max(0, items.length - 1)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [items, compact]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setShowPrev(x < EDGE_ZONE && canScrollLeft);
    setShowNext(x > rect.width - EDGE_ZONE && canScrollRight);
  };

  const handleMouseLeave = () => {
    setShowPrev(false);
    setShowNext(false);
  };

  const slideTo = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -SLIDE_STEP : SLIDE_STEP, behavior: "smooth" });
  };

  const hasImages     = items.length > 0;
  const displayCount  = hasImages ? items.length : 3;
  const activeCaption = hasImages ? items[activeIdx]?.caption : undefined;

  return (
    <div>
      <div
        className="relative"
        onMouseMove={isPointerFine ? handleMouseMove : undefined}
        onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pl-[30px] no-scrollbar"
          style={{ scrollbarWidth: "none", gap: `${gap}px`, transition: "gap 300ms ease" }}
        >
          {Array.from({ length: displayCount }).map((_, i) => (
            <div
              key={i}
              className="flex-none relative overflow-hidden bg-[#d9d9d9]"
              style={{ width: `${cardW(i)}px`, height: `${cardH}px`, transition: "width 300ms ease, height 300ms ease" }}
            >
              {hasImages && items[i]?.url && (
                <Image
                  src={items[i].url}
                  alt={items[i].caption ?? `${projectTitle} — ${i + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Freccia sinistra */}
        <button
          onClick={() => slideTo("left")}
          aria-label="Immagine precedente"
          className="absolute left-[30px] top-1/2 -translate-y-1/2 size-[48px] flex items-center justify-center z-10 transition-opacity duration-200"
          style={{ opacity: isPointerFine ? (showPrev ? 1 : 0) : (canScrollLeft ? 1 : 0), pointerEvents: showPrev || !isPointerFine ? "auto" : "none" }}
        >
          <span className="absolute inset-0 rounded-full border border-white/70" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Freccia destra */}
        <button
          onClick={() => slideTo("right")}
          aria-label="Immagine successiva"
          className="absolute right-[30px] top-1/2 -translate-y-1/2 size-[48px] flex items-center justify-center z-10 transition-opacity duration-200"
          style={{ opacity: isPointerFine ? (showNext ? 1 : 0) : (canScrollRight ? 1 : 0), pointerEvents: showNext || !isPointerFine ? "auto" : "none" }}
        >
          <span className="absolute inset-0 rounded-full border border-white/70" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {!compact && (
        <div className="h-[40px] flex items-center px-[32px] mt-[16px]">
          {activeCaption && <p className="text-[12px] leading-[1.2] text-[#282828]">{activeCaption}</p>}
        </div>
      )}
    </div>
  );
}
