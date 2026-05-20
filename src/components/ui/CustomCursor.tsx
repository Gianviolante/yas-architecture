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
    let hidden = false;   // true when over a [data-cursor="hide"] area
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!initialized) {
        x = mouseX;
        y = mouseY;
        initialized = true;
      }
    };

    function tick() {
      if (initialized) {
        x += (mouseX - x) / 4;
        y += (mouseY - y) / 4;

        cursor.style.transform = `translate(${x}px, ${y}px)`;

        if (hidden) {
          // Override inline opacity each frame so it stays hidden
          cursor.style.opacity    = "0";
          cursor.style.visibility = "hidden";
        } else {
          o += (1 - o) / 10;
          cursor.style.opacity    = String(Math.min(o, 1));
          if (o > 0.02) cursor.style.visibility = "visible";
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    // ── Hover detection ───────────────────────────────────────────────
    const HOVER_SEL = "a, button, img, [data-cursor]";
    const HIDE_SEL  = "[data-cursor='hide']";

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(HIDE_SEL)) {
        hidden = true;
        cursor.classList.remove("cursor--over");
        return;
      }
      hidden = false;
      if (t.closest(HOVER_SEL)) {
        cursor.classList.add("cursor--over");
      } else {
        cursor.classList.remove("cursor--over");
      }
    };
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to?.closest(HIDE_SEL))  hidden = false;
      if (!to?.closest(HOVER_SEL)) cursor.classList.remove("cursor--over");
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
