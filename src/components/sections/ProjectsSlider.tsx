"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/sanity/types";
import { usePointerFine } from "@/lib/hooks/usePointerFine";

const CARD_STEP = 263 + 15;
const EDGE_ZONE = 140; // px dal bordo

interface Props {
  projects: Project[];
  title?: string;
}

export default function ProjectsSlider({ projects, title = "Vedi altri progetti" }: Props) {
  const scrollRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPointerFine = usePointerFine();
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


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
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < EDGE_ZONE && canScrollLeft) {
      containerRef.current.setAttribute("cursor-type", "prev");
    } else if (x > rect.width - EDGE_ZONE && canScrollRight) {
      containerRef.current.setAttribute("cursor-type", "next");
    } else {
      containerRef.current.removeAttribute("cursor-type");
    }
  };

  const handleMouseLeave = () => {
    containerRef.current?.removeAttribute("cursor-type");
  };

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -CARD_STEP, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  CARD_STEP, behavior: "smooth" });

  return (
    <div className="relative pb-[48px]">
      <p className="px-[15px] md:px-[32px] text-[12px] md:text-[24px] leading-normal text-black mb-[16px] md:mb-[21px]">
        {title}
      </p>

      <div
        ref={containerRef}
        className="relative"
        onMouseMove={isPointerFine ? handleMouseMove : undefined}
        onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
      >
        {/* Overlay trasparenti sui bordi: intercettano il click prima che
            arrivi alle Link delle card, così vicino al bordo si scrolla
            invece di aprire il progetto. */}
        {isPointerFine && (
          <>
            <button
              aria-label="Progetti precedenti"
              onClick={scrollLeft}
              className="absolute inset-y-0 left-0 z-10"
              style={{ width: EDGE_ZONE, cursor: "none", pointerEvents: canScrollLeft ? "auto" : "none" }}
            />
            <button
              aria-label="Progetti successivi"
              onClick={scrollRight}
              className="absolute inset-y-0 right-0 z-10"
              style={{ width: EDGE_ZONE, cursor: "none", pointerEvents: canScrollRight ? "auto" : "none" }}
            />
          </>
        )}
        <div
          ref={scrollRef}
          className="flex gap-x-[15px] overflow-x-auto px-[15px] md:px-[32px] pb-[4px] no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((p) => (
            <Link
              key={p._id}
              href={`/progetti/${p.slug.current}`}
              className="flex-none block group"
              style={{ width: "263px" }}
            >
              <div className="relative overflow-hidden mb-[8px]" style={{ width: "263px", height: "202px" }}>
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
              </div>
              <p className="text-[15px] leading-[1.5] text-[#282828] mb-[6px]">
                {p.title}{p.location ? `, ${p.location}` : ""}
              </p>
              <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4] whitespace-nowrap">
                {p.typology ?? "Residenziale"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
