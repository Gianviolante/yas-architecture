"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/components/sections/GallerySlider";
import { animateValue, easeLinear } from "@/lib/utils/animate";

interface Props {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

const DURATION = 400;
const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 60;
const NAV_COOLDOWN = 600;

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const idxRef = useRef(initialIndex);
  const wheelAccum = useRef(0);
  const lastNav = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const cancelAnim = useRef<(() => void) | null>(null);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  const canPrev = idx > 0;
  const canNext = idx < items.length - 1;

  const getTrackX = useCallback((): number => {
    const t = trackRef.current;
    if (!t) return 0;
    const raw = window.getComputedStyle(t).transform;
    return raw === "none" ? 0 : new DOMMatrix(raw).m41;
  }, []);

  const setTrackX = useCallback((x: number) => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    if (clamped === idxRef.current) return;
    const width = Math.round(wrapperRef.current?.getBoundingClientRect().width ?? 0);
    idxRef.current = clamped;
    setIdx(clamped);
    const from = getTrackX();
    const to = -clamped * width;
    cancelAnim.current?.();
    cancelAnim.current = animateValue(from, to, DURATION, easeLinear, setTrackX);
  }, [items.length, getTrackX, setTrackX]);

  const prev = () => goTo(idxRef.current - 1);
  const next = () => goTo(idxRef.current + 1);

  const tryPrev = () => {
    const now = Date.now();
    if (now - lastNav.current < NAV_COOLDOWN) return;
    lastNav.current = now;
    prev();
  };

  const tryNext = () => {
    const now = Date.now();
    if (now - lastNav.current < NAV_COOLDOWN) return;
    lastNav.current = now;
    next();
  };

  useEffect(() => {
    const align = () => {
      cancelAnim.current?.();
      const width = Math.round(wrapperRef.current?.getBoundingClientRect().width ?? 0);
      setTrackX(-idxRef.current * width);
    };
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [setTrackX]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") tryPrev();
      if (e.key === "ArrowRight") tryNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.setAttribute("cursor-type", "close");
    prevRef.current?.setAttribute("cursor-type", "prev");
    nextRef.current?.setAttribute("cursor-type", "next");
  }, []);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    const delta = absX >= absY ? e.deltaX : e.deltaY;

    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);

    wheelAccum.current += delta;

    if (wheelAccum.current > WHEEL_THRESHOLD) {
      wheelAccum.current = 0;
      tryNext();
    } else if (wheelAccum.current < -WHEEL_THRESHOLD) {
      wheelAccum.current = 0;
      tryPrev();
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    cancelAnim.current?.();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    e.preventDefault();
    const delta = e.clientX - dragStartX.current;
    const width = wrapperRef.current?.clientWidth ?? 0;
    const from = -idxRef.current * width;
    setTrackX(from + delta);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) tryNext();
    else if (delta > SWIPE_THRESHOLD) tryPrev();
    else goTo(idxRef.current);
  };

  const onPointerCancel = () => { dragStartX.current = null; };

  const onMouseEnter = () => wrapperRef.current?.setAttribute("cursor-type", "drag");
  const onMouseLeave = () => wrapperRef.current?.removeAttribute("cursor-type");

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
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

      <div className="flex-1 flex items-center justify-center px-0 md:px-[80px] py-[60px] min-h-0">
        <div
          ref={wrapperRef}
          className="relative w-full h-full max-w-[960px] overflow-hidden select-none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div ref={trackRef} className="flex h-full" style={{ willChange: "transform" }}>
            {items.map((it, i) => (
              <div key={it.url} className="relative flex-none w-full h-full">
                <Image
                  src={it.url}
                  alt={it.caption ?? `Immagine ${i + 1}`}
                  fill
                  className="object-contain pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 960px"
                  priority={i === initialIndex}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[56px] shrink-0 flex items-center justify-center px-[20px]">
        <button
          ref={prevRef}
          onClick={tryPrev}
          aria-label="Immagine precedente"
          disabled={!canPrev}
          className="arrow-nav absolute left-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-0"
        >
          <ArrowLeft />
        </button>

        <p className="text-[16px] leading-[1.5] text-[#282828]">
          {idx + 1} / {items.length}
        </p>

        <button
          ref={nextRef}
          onClick={tryNext}
          aria-label="Immagine successiva"
          disabled={!canNext}
          className="arrow-nav absolute right-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-0"
        >
          <ArrowRight />
        </button>
      </div>

    </div>
  );
}
