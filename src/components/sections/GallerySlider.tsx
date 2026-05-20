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
  const scrollRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [hoverSide,      setHoverSide]      = useState<"left" | "right" | null>(null);
  const [isPointerFine,  setIsPointerFine]  = useState(false);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    const side = e.clientX - rect.left < rect.width / 2 ? "left" : "right";
    setHoverSide(side);

    // Update global cursor type based on scroll availability
    if (!containerRef.current) return;
    if (side === "left" && canScrollLeft) {
      containerRef.current.setAttribute("data-cursor-type", "prev");
    } else if (side === "right" && canScrollRight) {
      containerRef.current.setAttribute("data-cursor-type", "next");
    } else {
      containerRef.current.removeAttribute("data-cursor-type");
    }
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
    containerRef.current?.removeAttribute("data-cursor-type");
  };

  const handleClick = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: hoverSide === "left" ? -SLIDE_STEP : SLIDE_STEP, behavior: "smooth" });
  };

  const hasImages   = items.length > 0;
  const displayCount = hasImages ? items.length : 3;
  const activeCaption = hasImages ? items[activeIdx]?.caption : undefined;

  return (
    <div
      ref={containerRef}
      className={isPointerFine ? "cursor-none" : ""}
      onMouseMove={isPointerFine ? handleMouseMove : undefined}
      onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
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

      {!compact && (
        <div className="h-[40px] flex items-center px-[32px] mt-[16px]">
          {activeCaption && (
            <p className="text-[12px] leading-[1.2] text-[#282828]">{activeCaption}</p>
          )}
        </div>
      )}
    </div>
  );
}
