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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  return (
    <div className="relative pb-[48px]">
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
            {/* Immagine — cursor attivo solo qui */}
            <Link
              href={`/progetti/${p.slug.current}`}
              className="block relative overflow-hidden mb-[8px] group"
              style={{ width: "263px", height: "202px" }}
              ref={(el) => { el?.setAttribute("cursor-type", "blank"); }}
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
            {/* Testo — nessun cursor custom */}
            <p className="text-[15px] leading-[1.5] text-[#282828] mb-[6px]">
              {p.title}{p.location ? `, ${p.location}` : ""}
            </p>
            <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4]">
              {p.typology ?? "Residenziale"}
            </span>
          </div>
        ))}
      </div>

      {/* Bottoni scroll */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy("left")}
          aria-label="Scorri a sinistra"
          className="absolute left-[20px] top-[calc(21px+101px)] -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center z-10"
        >
          <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
          <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10 -scale-x-100" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy("right")}
          aria-label="Scorri a destra"
          className="absolute right-[20px] top-[calc(21px+101px)] -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center z-10"
        >
          <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
          <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10" />
        </button>
      )}
    </div>
  );
}
