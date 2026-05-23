"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/sanity/types";

const CARD_STEP = 263 + 15;

interface Props {
  projects: Project[];
  title?: string;
}

export default function ProjectsSlider({ projects, title = "Vedi altri progetti" }: Props) {
  const scrollRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoverSide,      setHoverSide]      = useState<"left" | "right" | null>(null);
  const [isPointerFine,  setIsPointerFine]  = useState(false);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [projects]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX - rect.left < rect.width / 2 ? "left" : "right";
    setHoverSide(side);
    if (!containerRef.current) return;
    if (side === "left" && canScrollLeft)        containerRef.current.setAttribute("cursor-type", "prev");
    else if (side === "right" && canScrollRight) containerRef.current.setAttribute("cursor-type", "next");
    else                                          containerRef.current.removeAttribute("cursor-type");
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
    containerRef.current?.removeAttribute("cursor-type");
  };

  const handleClick = (e: React.MouseEvent) => {
    // Se il click è su una foto-link, lascia che il Link navighi
    if ((e.target as Element).closest("a")) return;
    scrollRef.current?.scrollBy({ left: hoverSide === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="relative pb-[48px]"
      onMouseMove={isPointerFine ? handleMouseMove : undefined}
      onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
      onClick={isPointerFine ? handleClick : undefined}
    >
      <p className="px-[32px] text-[24px] leading-normal text-black mb-[21px]">
        {title}
      </p>
      <div
        ref={scrollRef}
        className="flex gap-x-[15px] overflow-x-auto px-[32px] pb-[4px] no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {projects.map((p) => (
          <div key={p._id} className="flex-none" style={{ width: "263px" }}>
            {/* Immagine: cursor nav (solo cerchio), click apre il progetto */}
            <Link
              href={`/progetti/${p.slug.current}`}
              className="block relative overflow-hidden mb-[8px] group"
              style={{ width: "263px", height: "202px" }}
              ref={(el) => { el?.setAttribute("cursor-type", "nav"); }}
            >
              {p.coverImageUrl ? (
                <Image
                  src={p.coverImageUrl}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full bg-[#d9d9d9]" />
              )}
            </Link>
            {/* Testo: nessun cursor custom */}
            <p className="text-[15px] leading-[1.5] text-[#282828] mb-[6px]">
              {p.title}{p.location ? `, ${p.location}` : ""}
            </p>
            <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4]">
              {p.typology ?? "Residenziale"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
