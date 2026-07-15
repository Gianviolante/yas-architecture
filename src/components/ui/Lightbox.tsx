"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/components/sections/GallerySlider";

interface Props {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;   // px touch
const WHEEL_THRESHOLD = 60;   // px trackpad
const NAV_COOLDOWN    = 600;  // ms tra una navigazione e la prossima

const ArrowLeft  = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
    <path fillRule="evenodd" clipRule="evenodd" d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
  </svg>
);

export default function Lightbox({ items, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);
  const imgAreaRef    = useRef<HTMLDivElement>(null);
  const closeRef      = useRef<HTMLButtonElement>(null);
  const prevRef       = useRef<HTMLButtonElement>(null);
  const nextRef       = useRef<HTMLButtonElement>(null);

  // refs per wheel / drag — non servono re-render
  const wheelAccum  = useRef(0);
  const lastNav     = useRef(0);
  const wheelTimer  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX  = useRef<number | null>(null);

  const prev = () => setIdx((i: number) => Math.max(0, i - 1));
  const next = () => setIdx((i: number) => Math.min(items.length - 1, i + 1));

  const canPrev = idx > 0;
  const canNext = idx < items.length - 1;

  // helper con cooldown
  const tryPrev = () => {
    const now = Date.now();
    if (now - lastNav.current < NAV_COOLDOWN) return;
    if (!canPrev) return;
    prev(); lastNav.current = now;
  };
  const tryNext = () => {
    const now = Date.now();
    if (now - lastNav.current < NAV_COOLDOWN) return;
    if (!canNext) return;
    next(); lastNav.current = now;
  };

  // Blocca scroll body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Tastiera
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(items.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, items.length]);

  // cursor-type sui bottoni — come Groppi (.btn--prev/.btn--next)
  useEffect(() => {
    closeRef.current?.setAttribute("cursor-type", "close");
    prevRef.current?.setAttribute("cursor-type",  "prev");
    nextRef.current?.setAttribute("cursor-type",  "next");
  }, []);

  // ── Trackpad horizontal scroll (wheel) ──────────────────────────────
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // ignora scroll verticale puro
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.5) return;

    // resetta accumulatore se la gesture si interrompe
    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);

    wheelAccum.current += e.deltaX;

    if (wheelAccum.current > WHEEL_THRESHOLD) {
      wheelAccum.current = 0;
      tryNext();
    } else if (wheelAccum.current < -WHEEL_THRESHOLD) {
      wheelAccum.current = 0;
      tryPrev();
    }
  };

  // ── Drag/swipe unificato mouse + touch (Pointer Events) ──────────────
  // Prima qui c'erano solo onTouchStart/onTouchEnd: funzionava lo swipe
  // su mobile ma non il drag col mouse su desktop, dove restavano solo
  // le frecce. I Pointer Events coprono entrambi gli input.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer non attivo, ignora */ }
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) tryNext();
    else if (delta > SWIPE_THRESHOLD) tryPrev();
  };
  const onPointerCancel = () => { dragStartX.current = null; };

  // cursor drag sull'area immagine (desktop)
  const onMouseEnter = () => imgAreaRef.current?.setAttribute("cursor-type", "drag");
  const onMouseLeave = () => imgAreaRef.current?.removeAttribute("cursor-type");

  const item = items[idx];

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">

      {/* ── Chiudi × ────────────────────────────────────────────────── */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-[15px] right-[15px] z-10 size-[40px] flex items-center justify-center hover:opacity-40 transition-opacity"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
          <path fillRule="evenodd" clipRule="evenodd" d="M12,11.3L22.3,1L23,1.7L12.7,12L23,22.3L22.3,23L12,12.7L1.7,23L1,22.3L11.3,12L1,1.7L1.7,1C1.7,1,12,11.3,12,11.3z"/>
        </svg>
      </button>

      {/* ── Area immagine ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-[60px] md:px-[80px] py-[60px] min-h-0">
        <div
          ref={imgAreaRef}
          className="relative w-full h-full max-w-[960px] select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          {item && (
            <Image
              key={item.url}
              src={item.url}
              alt={item.caption ?? `Immagine ${idx + 1}`}
              fill
              className="object-contain pointer-events-none"
              sizes="(max-width: 768px) 100vw, 960px"
              priority
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* ── Barra in basso ──────────────────────────────────────────── */}
      <div className="relative h-[56px] shrink-0 flex items-center justify-center px-[20px]">

        <button
          ref={prevRef}
          onClick={prev}
          aria-label="Immagine precedente"
          disabled={!canPrev}
          className="absolute left-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-40 disabled:opacity-20"
        >
          <ArrowLeft />
        </button>

        <p className="text-[16px] leading-[1.5] text-[#282828]">
          {idx + 1} / {items.length}
        </p>

        <button
          ref={nextRef}
          onClick={next}
          aria-label="Immagine successiva"
          disabled={!canNext}
          className="absolute right-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-40 disabled:opacity-20"
        >
          <ArrowRight />
        </button>

      </div>

    </div>
  );
}
