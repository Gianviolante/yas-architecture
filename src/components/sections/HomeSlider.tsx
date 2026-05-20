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
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [inSlider, setInSlider] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const cursorEl = useRef<HTMLDivElement>(null);
  const target   = useRef({ x: -200, y: -200 });
  const current  = useRef({ x: -200, y: -200 });
  const raf      = useRef<number>(0);

  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((i) => (i + 1) % SLIDES.length);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsPointerFine(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
    if (hoverSide === "left") prev();
    else if (hoverSide === "right") next();
  };

  return (
    <>
      {/* Custom cursor */}
      {isPointerFine && (
        <div
          ref={cursorEl}
          className="fixed top-0 left-0 pointer-events-none z-[9999] size-[48px] mix-blend-difference"
          style={{
            opacity: inSlider ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
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
        className={`relative w-full h-[752px] overflow-hidden ${isPointerFine ? "cursor-none" : ""}`}
        data-cursor="hide"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setInSlider(true)}
        onMouseLeave={() => { setInSlider(false); setHoverSide(null); }}
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

        {/* Counter */}
        <p className="absolute bottom-4 right-[29px] text-[12px] leading-[1.5] text-[#282828] text-right mix-blend-difference pointer-events-none">
          {idx + 1} / {SLIDES.length}
        </p>

        {/* Mobile / touch buttons */}
        {!isPointerFine && (
          <>
            <button
              onClick={prev}
              aria-label="Precedente"
              className="absolute left-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center"
            >
              <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
              <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10 -scale-x-100" />
            </button>
            <button
              onClick={next}
              aria-label="Successivo"
              className="absolute right-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center"
            >
              <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
              <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
