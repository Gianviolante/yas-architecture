"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — replicates davidegroppi.com behaviour.
 *
 * A 60px circle with mix-blend-mode:difference (white → inverts underlying colours).
 * ::before starts at scale(0.1) and expands to scale(1) on hover.
 * Continuous "twinkle" pulse: scale(0.9) ↔ scale(1).
 * Follows mouse with lerp ÷ 4 for a smooth lag effect.
 * Only active on pointer:fine (mouse/trackpad) devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current!;

    let mouseX = 0, mouseY = 0;
    let x = 0, y = 0, o = 0;
    let initialized = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!initialized) {
        // Snap to position on first move (no lerp jump from 0,0)
        x = mouseX;
        y = mouseY;
        initialized = true;
      }
    };

    function tick() {
      if (initialized) {
        x += (mouseX - x) / 4;   // lerp ÷ 4 — same as davidegroppi
        y += (mouseY - y) / 4;
        o += (1 - o) / 10;       // opacity fade-in

        cursor.style.transform = `translate(${x}px, ${y}px)`;
        cursor.style.opacity   = String(Math.min(o, 1));
        if (o > 0.02) cursor.style.visibility = "visible";
      }
      rafId = requestAnimationFrame(tick);
    }

    // ── Hover: add/remove .over on links, buttons, images ────────────
    const HOVER_SEL = "a, button, img, [data-cursor]";

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(HOVER_SEL)) {
        cursor.classList.add("cursor--over");
      }
    };
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to?.closest(HOVER_SEL)) {
        cursor.classList.remove("cursor--over");
      }
    };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.documentElement.classList.add("cursor-active");

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.documentElement.classList.remove("cursor-active");
    };
  }, []);

  return (
    <div ref={cursorRef} aria-hidden className="cursor-wrap">
      <div className="cursor-circle" />
    </div>
  );
}
