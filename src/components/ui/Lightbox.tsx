"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/components/sections/GallerySlider";
import { animateValue, groppiEase } from "@/lib/utils/animate";

interface Props {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

const DURATION        = 700;  // ms — allineato allo speed:700 dello Swiper di Groppi
const SWIPE_THRESHOLD  = 50;   // px touch
const WHEEL_THRESHOLD  = 60;   // px trackpad/rotellina
const NAV_COOLDOWN     = 600;  // ms tra una navigazione e la prossima

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
  const wrapperRef    = useRef<HTMLDivElement>(null); // overflow-hidden — clip del track
  const trackRef      = useRef<HTMLDivElement>(null); // transform target — scorre fisicamente
  const closeRef      = useRef<HTMLButtonElement>(null);
  const prevRef       = useRef<HTMLButtonElement>(null);
  const nextRef       = useRef<HTMLButtonElement>(null);

  // refs per wheel / drag / animazione — non servono re-render
  const idxRef      = useRef(initialIndex);
  const wheelAccum  = useRef(0);
  const lastNav     = useRef(0);
  const wheelTimer  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragStartX  = useRef<number | null>(null);
  const cancelAnim  = useRef<(() => void) | null>(null);

  useEffect(() => { idxRef.current = idx; }, [idx]);

  const canPrev = idx > 0;
  const canNext = idx < items.length - 1;

  // ── legge/imposta translateX del track (anche mid-animation) ──────────
  const getTrackX = useCallback((): number => {
    const t = trackRef.current;
    if (!t) return 0;
    const raw = window.getComputedStyle(t).transform;
    return raw === "none" ? 0 : new DOMMatrix(raw).m41;
  }, []);
  const setTrackX = useCallback((x: number) => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  // ── goTo: anima il TRACK con rAF + curva Groppi, come lo Swiper
  // effect:"slide" (speed:700) del loro modal-gallery ────────────────────
  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    if (clamped === idxRef.current) return;
    const width = wrapperRef.current?.clientWidth ?? 0;
    idxRef.current = clamped;
    setIdx(clamped);
    const from = getTrackX();
    const to   = -clamped * width;
    cancelAnim.current?.();
    cancelAnim.current = animateValue(from, to, DURATION, groppiEase, setTrackX);
  }, [items.length, getTrackX, setTrackX]);

  const prev = () => goTo(idxRef.current - 1);
  const next = () => goTo(idxRef.current + 1);

  // helper con cooldown — evita doppio trigger dalla stessa gesture
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

  // Posiziona il track sull'immagine iniziale (no animazione) e riallinea al resize
  useEffect(() => {
    const align = () => {
      cancelAnim.current?.();
      const width = wrapperRef.current?.clientWidth ?? 0;
      setTrackX(-idxRef.current * width);
    };
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [setTrackX]);

  // Blocca scroll body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Tastiera
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  tryPrev();
      if (e.key === "ArrowRight") tryNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // cursor-type sui bottoni — come Groppi (.btn--prev/.btn--next/.btn--close)
  useEffect(() => {
    closeRef.current?.setAttribute("cursor-type", "close");
    prevRef.current?.setAttribute("cursor-type",  "prev");
    nextRef.current?.setAttribute("cursor-type",  "next");
  }, []);

  // ── Wheel/trackpad — asse dominante, come Swiper mousewheel di Groppi
  // (forceToAxis: false → usa deltaX o deltaY, quale dei due è più grande).
  // Così la rotellina verticale normale naviga la gallery, non solo lo
  // swipe orizzontale da trackpad.
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const absX  = Math.abs(e.deltaX);
    const absY  = Math.abs(e.deltaY);
    const delta = absX >= absY ? e.deltaX : e.deltaY;

    // resetta accumulatore se la gesture si interrompe
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

  // ── Drag/swipe unificato mouse + touch (Pointer Events) ──────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    cancelAnim.current?.();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer non attivo, ignora */ }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
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
    else goTo(idxRef.current); // Ritorna alla posizione originale se il drag è troppo piccolo
  };
  const onPointerCancel = () => { dragStartX.current = null; };

  // cursor drag sull'area immagine (desktop)
  const onMouseEnter = () => wrapperRef.current?.setAttribute("cursor-type", "drag");
  const onMouseLeave = () => wrapperRef.current?.removeAttribute("cursor-type");

  // arrow hover — freccia scompare, cursore diventa la freccia
  const onArrowMouseEnter = (arrowType: "prev" | "next") => {
    // L'attributo cursor-type è già impostato nell'effect, qui solo gestisci hover
  };
  const onArrowMouseLeave = () => {
    // arrow ritorna visible (via CSS)
  };

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

      {/* ── Area immagine — track orizzontale animato ─────────────────── */}
      <div className="flex-1 flex items-center justify-center px-[60px] md:px-[80px] py-[60px] min-h-0">
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

      {/* ── Barra in basso ──────────────────────────────────────────── */}
      <div className="relative h-[56px] shrink-0 flex items-center justify-center px-[20px]">

        <button
          ref={prevRef}
          onClick={tryPrev}
          onMouseEnter={() => onArrowMouseEnter("prev")}
          onMouseLeave={onArrowMouseLeave}
          aria-label="Immagine precedente"
          disabled={!canPrev}
          className="arrow-nav absolute left-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-0 disabled:opacity-20"
        >
          <ArrowLeft />
        </button>

        <p className="text-[16px] leading-[1.5] text-[#282828]">
          {idx + 1} / {items.length}
        </p>

        <button
          ref={nextRef}
          onClick={tryNext}
          onMouseEnter={() => onArrowMouseEnter("next")}
          onMouseLeave={onArrowMouseLeave}
          aria-label="Immagine successiva"
          disabled={!canNext}
          className="arrow-nav absolute right-[15px] size-[40px] flex items-center justify-center transition-opacity hover:opacity-0 disabled:opacity-20"
        >
          <ArrowRight />
        </button>

      </div>

    </div>
  );
}
