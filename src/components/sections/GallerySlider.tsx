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

export default function GallerySlider({ items, projectTitle, compact = false }: Props) {
  const scrollRef     = useRef<HTMLDivElement>(null);
  const cursorEl      = useRef<HTMLDivElement>(null);
  const target        = useRef({ x: -200, y: -200 });
  const current       = useRef({ x: -200, y: -200 });
  const raf           = useRef<number>(0);
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [inSlider,       setInSlider]       = useState(false);
  const [hoverSide,      setHoverSide]      = useState<"left" | "right" | null>(null);
  const [isPointerFine,  setIsPointerFine]  = useState(false);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Full vs compact card sizes
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
    // reset scroll when switching modes
    el.scrollLeft = 0;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [items, compact]);

  useEffect(() => {
    if (!isPointerFine) return;
    const LERP = 0.11;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      if (cursorEl.current) {
        cursorEl.current.style.transform =
          `translate(calc(${current.current.x}px - 50%), calc(${current.current.y}px - 50%))`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [isPointerFine]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    target.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverSide(e.clientX - rect.left < rect.width / 2 ? "left" : "right");
  };

  const handleClick = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: hoverSide === "left" ? -SLIDE_STEP : SLIDE_STEP, behavior: "smooth" });
  };

  const cursorVisible =
    inSlider && isPointerFine &&
    ((hoverSide === "left" && canScrollLeft) || (hoverSide === "right" && canScrollRight));

  // Use real items or 3 gray placeholders
  const hasImages = items.length > 0;
  const displayCount = hasImages ? items.length : 3;

  const activeCaption = hasImages ? items[activeIdx]?.caption : undefined;

  return (
    <>
      {isPointerFine && (
        <div
          ref={cursorEl}
          className="slider-cursor"
          style={{ opacity: cursorVisible ? 1 : 0 }}
        >
          <div className="slider-cursor__ring" />
          <div className="slider-cursor__arrow">
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              style={{ transform: hoverSide === "left" ? "scaleX(-1)" : "none" }}
            >
              <path d="M4 10h12M11 5l5 5-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}

      <div
        className={isPointerFine ? "cursor-none" : ""}
        data-cursor="hide"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setInSlider(true)}
        onMouseLeave={() => { setInSlider(false); setHoverSide(null); }}
        onClick={isPointerFine ? handleClick : undefined}
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
              style={{
                width: `${cardW(i)}px`,
                height: `${cardH}px`,
                transition: "width 300ms ease, height 300ms ease",
              }}
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

        {/* Caption — updates as you scroll */}
        {!compact && (
          <div className="h-[40px] flex items-center px-[32px] mt-[16px]">
            {activeCaption && (
              <p className="text-[12px] leading-[1.2] text-[#282828]">{activeCaption}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
