"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — visible ONLY on images (not in sliders).
 * Everywhere else the browser default cursor is used.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current!;

    let mouseX = 0, mouseY = 0;
    let x = 0, y = 0;
    let o = 0;           // opacity: lerps 0→1 when over image, 1→0 when not
    let onImg = false;   // true only when hovering an image outside sliders
    let initialized = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!initialized) {
        x = mouseX; y = mouseY;
        initialized = true;
      }
    };

    function tick() {
      if (initialized) {
        x += (mouseX - x) / 4;
        y += (mouseY - y) / 4;
        cursor.style.transform = `translate(${x}px, ${y}px)`;

        const target = onImg ? 1 : 0;
        o += (target - o) / 10;

        cursor.style.opacity    = String(Math.max(0, Math.min(o, 1)));
        cursor.style.visibility = o > 0.02 ? "visible" : "hidden";
      }
      rafId = requestAnimationFrame(tick);
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const img = t.closest("img");
      // Show only on img elements that are NOT inside a slider
      onImg = !!(img && !img.closest("[data-cursor='hide']"));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover",  onOver);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
    };
  }, []);

  return (
    <div ref={cursorRef} aria-hidden className="cursor-wrap">
      <div className="cursor-circle" />
    </div>
  );
}
