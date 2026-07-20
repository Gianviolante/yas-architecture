"use client";

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/Lightbox";
import { usePointerFine } from "@/lib/hooks/usePointerFine";
import { animateValue, groppiEase } from "@/lib/utils/animate";

export interface GalleryItem {
  url: string;
  caption?: string;
}

interface Props {
  items: GalleryItem[];
  projectTitle: string;
  compact?: boolean;
}

const DURATION      = 700;
const NAV_THRESHOLD = 0.25;
const DRAG_MIN      = 5;
const RUBBER        = 0.25;
const WHEEL_WAIT    = DURATION + 80;
const EDGE_ZONE     = 140; // px per i button trasparenti ai lati

// Store esterno per breakpoint — pattern useSyncExternalStore, niente setState in effect
function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
const getBreakpoint = (): "mobile" | "tablet" | "desktop" => {
  const w = window.innerWidth;
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
};

export default function GallerySlider({ items, projectTitle, compact = false }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null); // overflow:hidden — clip
  const trackRef   = useRef<HTMLDivElement>(null); // transform target — si muove fisicamente

  const isPointerFine = usePointerFine();
  const breakpoint    = useSyncExternalStore(subscribeResize, getBreakpoint, () => "mobile" as const);

  const [current,       setCurrent]       = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isDragging      = useRef(false);
  const hasDragged      = useRef(false);
  const startX          = useRef(0);
  const baseTranslate   = useRef(0);
  const currentRef      = useRef(0);
  const cancelAnim      = useRef<(() => void) | null>(null);
  const wheelActive     = useRef(false);
  const wheelTimer      = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { currentRef.current = current; }, [current]);

  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";

  const cardW = useCallback((i: number) => {
    if (compact) return 263;
    if (isMobile) return i === 0 ? 222 : 193;
    if (isTablet) return i === 0 ? 307 : 267;
    return i === 0 ? 580 : 505;
  }, [compact, isMobile, isTablet]);

  const cardH = compact ? 202 : (isMobile ? 242 : isTablet ? 335 : 633);
  const gap   = compact ? 15  : (isMobile ? 30  : isTablet ? 40  : 77);
  const pl    = isMobile ? 15 : 30;

  const getSnapPositions = useCallback(() => {
    const n = Math.max(items.length, 1);
    const pos: number[] = [0];
    for (let i = 1; i < n; i++) {
      pos[i] = pos[i - 1] + cardW(i - 1) + gap;
    }
    return pos;
  }, [items.length, cardW, gap]);

  // ── legge translateX visivo corrente (anche mid-animation) ────────────
  const getTrackX = useCallback((): number => {
    const t = trackRef.current;
    if (!t) return 0;
    const raw = window.getComputedStyle(t).transform;
    return raw === "none" ? 0 : new DOMMatrix(raw).m41;
  }, []);

  // ── imposta transform senza animazione ────────────────────────────────
  const setTrackX = useCallback((x: number) => {
    const t = trackRef.current;
    if (t) t.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  // ── goTo: anima il TRACK (il div fisico) con rAF + curva Groppi ───────
  // Il track si muove fisicamente verso sinistra/destra portando con sé
  // tutte le card — esattamente come fa Groppi con il suo SwiperComponent.
  const goTo = useCallback((idx: number) => {
    const snapPos = getSnapPositions();
    const clamped = Math.max(0, Math.min(Math.max(0, items.length - 1), idx));
    currentRef.current = clamped;
    setCurrent(clamped);
    const from = getTrackX();       // posizione visiva attuale
    const to   = -snapPos[clamped]; // posizione target
    cancelAnim.current?.();         // ferma eventuale animazione in corso
    cancelAnim.current = animateValue(from, to, DURATION, groppiEase, setTrackX);
  }, [getSnapPositions, items.length, getTrackX, setTrackX]);

  // ── reset su cambio items/compact — adjust-during-render (solo state, no ref)
  const [prevResetKey, setPrevResetKey] = useState<{ items: GalleryItem[]; compact: boolean }>({ items, compact });
  if (prevResetKey.items !== items || prevResetKey.compact !== compact) {
    setPrevResetKey({ items, compact });
    setCurrent(0);
  }
  // Riallinea il track su cambio layout/reset. currentRef è già sincronizzato
  // dall'effect sopra (gira prima di questo nell'ordine di definizione).
  useEffect(() => {
    cancelAnim.current?.();
    const snapPos = getSnapPositions();
    const cur = Math.min(currentRef.current, Math.max(0, items.length - 1));
    currentRef.current = cur;
    setTrackX(-snapPos[cur]);
  }, [breakpoint, items, compact, getSnapPositions, setTrackX]);

  // ── wheel / trackpad — listener nativo non-passivo ────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !isPointerFine || items.length === 0) return;

    const onWheel = (e: WheelEvent) => {
      if (wheelActive.current || isDragging.current) return;
      const absX  = Math.abs(e.deltaX);
      const absY  = Math.abs(e.deltaY);
      const delta = absX >= absY ? e.deltaX : e.deltaY;
      const cur   = currentRef.current;

      if (delta > 10 && cur < items.length - 1) {
        e.preventDefault(); e.stopPropagation();
        wheelActive.current = true;
        goTo(cur + 1);
        clearTimeout(wheelTimer.current);
        wheelTimer.current = setTimeout(() => { wheelActive.current = false; }, WHEEL_WAIT);
      } else if (delta < -10 && cur > 0) {
        e.preventDefault(); e.stopPropagation();
        wheelActive.current = true;
        goTo(cur - 1);
        clearTimeout(wheelTimer.current);
        wheelTimer.current = setTimeout(() => { wheelActive.current = false; }, WHEEL_WAIT);
      } else if (Math.abs(delta) > 5) {
        e.preventDefault();
      }
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", onWheel);
  }, [isPointerFine, goTo, items]);

  // ── drag ──────────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelAnim.current?.();              // ferma animazione: prende posizione visiva corrente
    isDragging.current  = true;
    hasDragged.current  = false;
    startX.current      = e.clientX;
    baseTranslate.current = getTrackX(); // posizione visiva al momento del click
    e.currentTarget.setPointerCapture(e.pointerId);
    wrapperRef.current?.setAttribute("cursor-type", "drag");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > DRAG_MIN) hasDragged.current = true;
    const cur    = currentRef.current;
    const maxIdx = items.length - 1;
    const atEdge = (cur === 0 && dx > 0) || (cur === maxIdx && dx < 0);
    const eff    = atEdge ? dx * RUBBER : dx;
    setTrackX(baseTranslate.current + eff);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - startX.current;

    if (!hasDragged.current && items.length > 0) {
      // tap → lightbox
      const snapPos  = getSnapPositions();
      const cur      = currentRef.current;
      const wLeft    = wrapperRef.current?.getBoundingClientRect().left ?? 0;
      const contentX = e.clientX - wLeft - pl + snapPos[cur];
      let accum = 0; let idx = items.length - 1;
      for (let i = 0; i < items.length; i++) {
        if (contentX < accum + cardW(i)) { idx = i; break; }
        accum += cardW(i) + gap;
      }
      setLightboxIndex(idx);
      return;
    }

    if (!hasDragged.current) { goTo(currentRef.current); return; }

    // Soglia basata sulla larghezza della card corrente, non sull'intero
    // wrapper: su desktop il wrapper può essere largo 1440px e più card
    // sono visibili insieme, quindi usare la larghezza del contenitore
    // avrebbe richiesto un drag enorme (es. 360px) per passare a quella
    // successiva. Con la larghezza della singola card la soglia resta
    // proporzionata a quanto l'utente si aspetta di dover trascinare.
    const cur = currentRef.current;
    const thr = cardW(cur) * NAV_THRESHOLD;
    if      (dx < -thr) goTo(cur + 1);
    else if (dx >  thr) goTo(cur - 1);
    else                goTo(cur);
  };

  const onPointerCancel = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    goTo(currentRef.current);
  };

  // ── cursore ────────────────────────────────────────────────────────────
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || items.length === 0) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const snapPos  = getSnapPositions();
    const cur      = currentRef.current;
    const wLeft    = wrapper.getBoundingClientRect().left;
    // usa la posizione snap (non quella mid-animation) per il cursore
    const contentX = e.clientX - wLeft - pl + snapPos[cur];
    let over = false; let accum = 0;
    for (let i = 0; i < items.length; i++) {
      const w = cardW(i);
      if (contentX >= accum && contentX < accum + w) { over = true; break; }
      accum += w + gap;
    }
    // Scrivi l'attributo solo se cambia davvero: settarlo ad ogni mousemove
    // (anche con lo stesso valore) genera una raffica di mutation events per
    // il MutationObserver del cursore, che per ognuna fa un
    // getBoundingClientRect() — con il mouse in movimento veloce la coda si
    // accumula e il cursore custom resta "indietro" per un po'.
    const wantedType = over ? "expand" : null;
    if (wrapper.getAttribute("cursor-type") === wantedType) return;
    if (wantedType) wrapper.setAttribute("cursor-type", wantedType);
    else            wrapper.removeAttribute("cursor-type");
  };

  const onMouseLeave = () => wrapperRef.current?.removeAttribute("cursor-type");

  const hasImages     = items.length > 0;
  const displayCount  = hasImages ? items.length : 3;
  const activeCaption = hasImages ? items[current]?.caption : undefined;

  return (
    <div>
      {/* Wrapper: overflow-hidden → taglia il track fuori viewport */}
      {/* Track:   transform       → il DIV fisico scorre orizzontalmente */}
      <div
        ref={wrapperRef}
        className={`select-none relative${isPointerFine ? " overflow-hidden" : ""}`}
        onMouseMove={isPointerFine ? onMouseMove : undefined}
        onMouseLeave={isPointerFine ? onMouseLeave : undefined}
        onPointerDown={isPointerFine ? onPointerDown : undefined}
        onPointerMove={isPointerFine ? onPointerMove : undefined}
        onPointerUp={isPointerFine ? onPointerUp : undefined}
        onPointerCancel={isPointerFine ? onPointerCancel : undefined}
      >
        <div
          ref={trackRef}
          className={`flex${!isPointerFine ? " overflow-x-auto no-scrollbar" : ""}`}
          style={{
            paddingLeft: `${pl}px`,
            gap: `${gap}px`,
            ...(isPointerFine
              ? { willChange: "transform" }
              : { scrollbarWidth: "none" }),
          }}
        >
          {Array.from({ length: displayCount }).map((_, i) => (
            <div
              key={i}
              className="flex-none relative overflow-hidden bg-[#d9d9d9]"
              style={{
                width:      `${cardW(i)}px`,
                height:     `${cardH}px`,
                transition: "width 300ms ease, height 300ms ease",
              }}
            >
              {hasImages && items[i]?.url && (
                <Image
                  src={items[i].url}
                  alt={items[i].caption ?? `${projectTitle} — ${i + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* Transparent edge zones for carousel navigation (desktop only) */}
        {isPointerFine && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute inset-y-0 left-0 z-10"
              style={{
                width: `${EDGE_ZONE}px`,
                cursor: "none",
                pointerEvents: current > 0 ? "auto" : "none",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              aria-label="Scroll gallery left"
            />
            <button
              onClick={() => goTo(current + 1)}
              className="absolute inset-y-0 right-0 z-10"
              style={{
                width: `${EDGE_ZONE}px`,
                cursor: "none",
                pointerEvents: current < items.length - 1 ? "auto" : "none",
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              aria-label="Scroll gallery right"
            />
          </>
        )}
      </div>

      {/* Navigation arrows disabled for now */}

      {/* Caption below gallery */}
      {!compact && (
        <div className="px-[32px] mt-[16px]">
          <p className="text-[12px] leading-[1.2] text-[#282828]">
            {activeCaption}
          </p>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
