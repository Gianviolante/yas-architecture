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
  const [isPointerFine, setIsPointerFine] = useState(true);

  useEffect(() => {
    setIsPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((i) => (i + 1) % SLIDES.length);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const side = e.clientX - e.currentTarget.getBoundingClientRect().left < e.currentTarget.offsetWidth / 2 ? "prev" : "next";
    // scrivi solo se cambia — evita di floodare il MutationObserver del
    // cursore ad ogni mousemove (vedi stesso fix in GallerySlider)
    if (containerRef.current?.getAttribute("cursor-type") === side) return;
    containerRef.current?.setAttribute("cursor-type", side);
  };

  const handleMouseLeave = () => containerRef.current?.removeAttribute("cursor-type");

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const isLeftHalf = e.clientX - e.currentTarget.getBoundingClientRect().left < e.currentTarget.offsetWidth / 2;
    if (isLeftHalf) prev(); else next();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/9" }}
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
            <Image src={src} alt="" fill className="object-cover" priority={i === 0} />
          </div>
        ))}
      </div>

      <p className="absolute bottom-4 right-[29px] text-[12px] leading-[1.5] text-[#282828] text-right pointer-events-none">
        {idx + 1} / {SLIDES.length}
      </p>

      {!isPointerFine && (
        <>
          <button onClick={prev} aria-label="Slide precedente"
            className="absolute left-[5px] top-1/2 -translate-y-1/2 z-20 size-[48px] flex items-center justify-center rounded-full border-2 border-white mix-blend-difference">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
            </svg>
          </button>
          <button onClick={next} aria-label="Slide successivo"
            className="absolute right-[5px] top-1/2 -translate-y-1/2 z-20 size-[48px] flex items-center justify-center rounded-full border-2 border-white mix-blend-difference">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path fillRule="evenodd" clipRule="evenodd" d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
