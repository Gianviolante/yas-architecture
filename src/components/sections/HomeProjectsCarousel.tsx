"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/sanity/types";

const PLACEHOLDERS = [
  { id: "p1", img: "/assets/home-project-1.jpg", label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p2", img: "/assets/home-project-2.jpg", label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p3", img: "/assets/home-slide-1.jpg",   label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
  { id: "p4", img: "/assets/home-slide-2.jpg",   label: "Marina One Residence, Marina Way – SG", typology: "Residential" },
];

const EDGE_ZONE = 140;

interface Props { projects: Project[]; }

export default function HomeProjectsCarousel({ projects }: Props) {
  const [idx, setIdx]         = useState(0);
  const [stepPx, setStepPx]   = useState(0);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const viewportRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const useSanity = projects.length > 0;
  const total     = useSanity ? projects.length : PLACEHOLDERS.length;
  const maxIdx    = Math.max(0, total - 2);
  const canPrev   = idx > 0;
  const canNext   = idx < maxIdx;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(maxIdx, i + 1));

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsPointerFine(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const update = () => {
      if (viewportRef.current)
        setStepPx((viewportRef.current.offsetWidth + 14) / 2);
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
      setHoverSide("left");
      containerRef.current.setAttribute("cursor-type", "prev");
    } else if (x > rect.width - EDGE_ZONE && canNext) {
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

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("a")) return;
    if (hoverSide === "left")  prev();
    if (hoverSide === "right") next();
  };

  return (
    <section className="relative">
      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />

      <div className="px-[32px] pt-8 pb-16">
        <p className="text-[16px] leading-normal text-black text-center mb-6">Progetti</p>
        <p className="text-[24px] font-medium leading-[1.2] text-[#282828] mb-10">
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
          &lsquo;Content here, content here&rsquo;, making it look like readable English. Many desktop publishing packages and web page editors now use…
        </p>

        <div
          ref={containerRef}
          className="relative mb-10"
          onMouseMove={isPointerFine ? handleMouseMove : undefined}
          onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
          onClick={isPointerFine ? handleClick : undefined}
        >
          <div className="overflow-hidden" ref={viewportRef}>
            <div
              className="flex gap-[14px] transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${idx * stepPx}px)` }}
            >
              {useSanity
                ? projects.map((p) => (
                    <div key={p._id} className="w-[calc(50%-7px)] shrink-0">
                      <Link
                        href={`/progetti/${p.slug.current}`}
                        className="block group"
                        onClick={(e) => isPointerFine && hoverSide !== null && e.preventDefault()}
                      >
                        <div className="relative h-[550px] overflow-hidden mb-4">
                          {p.coverImageUrl
                            ? <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            : <div className="w-full h-full bg-[#d9d9d9]" />}
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
                    <div key={p.id} className="w-[calc(50%-7px)] shrink-0">
                      <div className="relative h-[550px] overflow-hidden mb-4">
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

        <div className="flex justify-center">
          <Link
            href="/progetti"
            className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
          >
            Vai a tutti i progetti
          </Link>
        </div>
      </div>

      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />
    </section>
  );
}
