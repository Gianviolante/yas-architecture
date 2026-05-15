"use client";

import { useState } from "react";
import Image from "next/image";

const SLIDES = [
  "/assets/home-slide-1.jpg",
  "/assets/home-slide-2.jpg",
  "/assets/home-studio.jpg",
  "/assets/home-link-1.jpg",
];

export default function HomeSlider() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIdx((i) => (i + 1) % SLIDES.length);

  return (
    <div className="relative w-full h-[752px] overflow-hidden">
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

      {/* Nav arrows — mix-blend-difference */}
      <button
        onClick={prev}
        className="absolute left-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center"
        aria-label="Precedente"
      >
        <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
        <Image src="/assets/nav-arrow-left.svg" alt="" width={20} height={20} className="relative z-10" />
      </button>
      <button
        onClick={next}
        className="absolute right-[15px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference flex items-center justify-center"
        aria-label="Successivo"
      >
        <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
        <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} className="relative z-10" />
      </button>

      {/* Counter */}
      <p className="absolute bottom-4 right-[29px] text-[12px] leading-[1.5] text-[#282828] text-right mix-blend-difference">
        {idx + 1} / {SLIDES.length}
      </p>
    </div>
  );
}
