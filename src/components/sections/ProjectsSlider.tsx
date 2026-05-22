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
  const scrollRef      = useRef<HTMLDivElement>(null);
  const cursorEl       = useRef<HTMLDivElement>(null);
  const target         = useRef({ x: -200, y: -200 });
  const current        = useRef({ x: -200, y: -200 });
  const raf            = useRef<number>(0);

  const [inSlider,       setInSlider]       = useState(false);
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
    el.scrollBy({ left: hoverSide === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  const cursorVisible =
    inSlider && isPointerFine &&
    ((hoverSide === "left" && canScrollLeft) || (hoverSide === "right" && canScrollRight));

  return (
    <>
      {isPointerFine && (
        <div
          ref={cursorEl}
          className="fixed top-0 left-0 pointer-events-none z-[9999] size-[48px] mix-blend-difference"
          style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 200ms ease" }}
        >
          <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image
              src="/assets/nav-arrow-right.svg"
              alt=""
              width={20}
              height={20}
              className={hoverSide === "left" ? "-scale-x-100" : ""}
            />
          </div>
        </div>
      )}

      <div
        className="relative pb-[48px]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setInSlider(true)}
        onMouseLeave={() => { setInSlider(false); setHoverSide(null); }}
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
            <Link
              key={p._id}
              href={`/progetti/${p.slug.current}`}
              className="flex-none block group"
              style={{ width: "263px" }}
              onClick={(e) => isPointerFine && e.preventDefault()}
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
              <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4]">
                {p.typology ?? "Residenziale"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
