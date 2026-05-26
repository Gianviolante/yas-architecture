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
  const scrollRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPointerFine,  setIsPointerFine]  = useState(false);
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoverSide,      setHoverSide]      = useState<"left" | "right" | null>(null);
  const [breakpoint,     setBreakpoint]     = useState<"mobile" | "tablet" | "desktop">("mobile");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBreakpoint(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile  = breakpoint === "mobile";
  const isTablet  = breakpoint === "tablet";

  const cardW = (i: number) => {
    if (compact) return 263;
    if (isMobile) return i === 0 ? 222 : 193;
    if (isTablet) return i === 0 ? 307 : 267;
    return i === 0 ? 580 : 505;
  };
  const cardH = compact ? 202 : (isMobile ? 242 : isTablet ? 335 : 633);
  const gap   = compact ? 15  : (isMobile ? 30  : isTablet ? 40  : 77);
  const SLIDE_STEP = cardW(0) + gap;

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
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < EDGE_ZONE && canScrollLeft) {
      setHoverSide("left");
      containerRef.current.setAttribute("cursor-type", "prev");
    } else if (x > rect.width - EDGE_ZONE && canScrollRight) {
      setHoverSide("right");
      containerRef.current.setAttribute("cursor-type", "next");
    } else {
      setHoverSide(null);
      containerRef.current.removeAttribute("cursor-type");
    }
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
    containerRef.current?.removeAttribute("cursor-type");
  };

  const handleClick = () => {
    if (hoverSide === "left")  scrollRef.current?.scrollBy({ left: -SLIDE_STEP, behavior: "smooth" });
    if (hoverSide === "right") scrollRef.current?.scrollBy({ left:  SLIDE_STEP, behavior: "smooth" });
  };

  const hasImages     = items.length > 0;
  const displayCount  = hasImages ? items.length : 3;
  const activeCaption = hasImages ? items[activeIdx]?.caption : undefined;

  return (
    <div>
      <div
        ref={containerRef}
        onMouseMove={isPointerFine ? handleMouseMove : undefined}
        onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
        onClick={isPointerFine ? handleClick : undefined}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pl-[15px] md:pl-[30px] no-scrollbar"
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
      </div>

      {!compact && (
        <div className="h-[40px] flex items-center px-[32px] mt-[16px]">
          {activeCaption && <p className="text-[12px] leading-[1.2] text-[#282828]">{activeCaption}</p>}
        </div>
      )}
    </div>
  );
}
