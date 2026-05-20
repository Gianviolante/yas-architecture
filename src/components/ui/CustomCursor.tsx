"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — small dot + lagging ring.
 * On images / [data-cursor="hover"] elements: ring expands and pulses.
 * Only active on pointer-fine devices (no touch).
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = 0, mouseY = 0;
    let dotX   = 0, dotY   = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = 0;
    let visible = false;

    // Smooth lerp — ring lags behind for a premium feel
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function tick() {
      dotX  = lerp(dotX,  mouseX, 0.25);
      dotY  = lerp(dotY,  mouseY, 0.25);
      ringX = lerp(ringX, mouseX, 0.10);
      ringY = lerp(ringY, mouseY, 0.10);

      dot.style.translate  = `${dotX}px ${dotY}px`;
      ring.style.translate = `${ringX}px ${ringY}px`;

      rafId = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        // First move — snap cursor to position immediately and show
        dotX = ringX = mouseX;
        dotY = ringY = mouseY;
        dot.style.opacity  = "1";
        ring.style.opacity = "1";
        visible = true;
      }
    };

    const onLeave = () => {
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
      visible = false;
    };

    // ── Hover detection ──────────────────────────────────────────────
    const SELECTORS = [
      "img",
      "a",
      "button",
      "[data-cursor]",
      ".group",
    ].join(",");

    function setHover(active: boolean) {
      dot.classList.toggle("cursor-dot--hover",   active);
      ring.classList.toggle("cursor-ring--hover", active);
    }

    // Event delegation — works even for elements added later
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(SELECTORS)) setHover(true);
    };
    const onExit = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement | null;
      if (!target?.closest(SELECTORS)) setHover(false);
    };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover",  onEnter);
    document.addEventListener("mouseout",   onExit);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover",  onEnter);
      document.removeEventListener("mouseout",   onExit);
    };
  }, []);

  return (
    <>
      {/* Dot — precise, fast */}
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot"
      />
      {/* Ring — lagging, pulses on hover */}
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
      />
    </>
  );
}
