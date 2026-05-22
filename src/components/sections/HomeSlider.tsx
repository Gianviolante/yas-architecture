"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  "/assets/home-slide-1.jpg",
  "/assets/home-slide-2.jpg",
  "/assets/home-studio.jpg",
  "/assets/home-link-1.jpg",
];

export default function HomeSlider() {
  const [idx, setIdx] = useState(0);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((i) => (i + 1) % SLIDES.length);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsPointerFine(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const side = e.clientX - e.currentTarget.getBoundingClientRect().left < e.currentTarget.offsetWidth / 2 ? "prev" : "next";
    containerRef.current?.setAttribute("cursor-type", side);
  };

  const handleMouseLeave = () => containerRef.current?.removeAttribute("cursor-type");

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.clientX - e.currentTarget.getBoundingClientRect().left < e.currentTarget.offsetWidth / 2 ? prev() : next();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[752px] overflow-hidden"
      onMouseMove={isPointerFine ? handleMouseMove : undefined}
      onMouseLeave={isPointerFine ? handleMouseLeave : undefined}
      onClick={isPointerFine ? handleClick : undefined}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((src, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      <p className="absolute bottom-4 right-[29px] text-[12px] leading-[1.5] text-[#282828] text-right pointer-events-none">
        {idx + 1} / {SLIDES.length}
      </p>

      {!isPointerFine && (
        <>
          <button onClick={prev} aria-label="Precedente"
            className="absolute left-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center">
            <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
            <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10 -scale-x-100" />
          </button>
          <button onClick={next} aria-label="Successivo"
            className="absolute right-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center">
            <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
            <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10" />
          </button>
        </>
      )}
    </div>
  );
}
