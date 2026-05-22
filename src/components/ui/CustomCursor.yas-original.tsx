"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor system — faithful recreation of davidegroppi.com
 *
 * Structure:
 *  [data-cursor-el]            ← positioned by JS via translate(x,y)
 *    .circle                   ← pulsing ring (twinkle animation)
 *      .circle::before         ← the ring border, scale(.1) → scale(1) on hover
 *      <svg class="cursor-*">  ← icons, hidden by default, shown per type
 *
 * Cursor types (set on hover via event delegation):
 *  idle    → no ring visible
 *  nav     → ring only (links/buttons)
 *  expand  → ring + + icon (images)
 *  drag    → ring + ←→ icon (sliders)
 *  prev    → ring + ← icon
 *  next    → ring + → icon
 *  blank   → ring + ↗ icon (external links)
 *  close   → ring + × icon
 *
 * Elements that trigger types:
 *  a, button                    → nav
 *  img                          → expand
 *  [data-cursor-type="drag"]    → drag
 *  [data-cursor-type="*"]       → that type
 */

const ICON_TYPES = ["expand", "drag", "prev", "next", "blank", "close"] as const;

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    // Non-null assertion captured in closure
    const cursorEl = el;

    const html  = document.documentElement;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos: { x: number; y: number; o: number } | null = null;
    let rafId  = 0;
    let current = "idle";

    // ── Set cursor type + update classes (mirrors Groppi's switch) ───
    function setType(type: string) {
      if (current === type) return;
      current = type;

      if (type === "nav") {
        cursorEl.className = "over";
      } else if (type !== "idle") {
        cursorEl.className = `over ${type}`;
      } else {
        cursorEl.className = "";
      }

      if (type !== "idle" && window.innerWidth >= 1024) {
        html.classList.add("cursor--active");
      } else {
        html.classList.remove("cursor--active");
      }
    }

    function tick() {
      if (pos) {
        pos.x += (mouse.x - pos.x) / 4;
        pos.y += (mouse.y - pos.y) / 4;
        pos.o += (1 - pos.o) / 10;
        cursorEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        cursorEl.style.opacity   = String(pos.o);
      }
      rafId = requestAnimationFrame(tick);
    }

    // ── Event listeners ──────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Snap to cursor position on first move (no jump from 0,0)
      if (!pos) pos = { x: e.clientX, y: e.clientY, o: 0 };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      // Explicit cursor-type attribute wins (sliders, special areas)
      const explicit = t.closest("[data-cursor-type]")?.getAttribute("data-cursor-type");
      if (explicit) { setType(explicit); return; }

      // Link / button → nav ring
      if (t.closest("a, button")) { setType("nav"); return; }

      // Image → expand ring + icon
      if (t.closest("img")) { setType("expand"); return; }

      setType("idle");
    };

    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to?.closest("a, button, img, [data-cursor-type]")) {
        setType("idle");
      }
    };

    const onLeave = () => setType("idle");

    const onResize = () => {
      if (current !== "idle") {
        window.innerWidth >= 1024
          ? html.classList.add("cursor--active")
          : html.classList.remove("cursor--active");
      }
    };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",       onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",       onResize);
      html.classList.remove("cursor--active");
    };
  }, []);

  return (
    <>
      {/* ── SVG sprite — cursor icons (from davidegroppi.com) ───────── */}
      <svg width="0" height="0" className="sr-only" aria-hidden="true">
        <symbol id="cursor-expand" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.7 11.3L12.8 11.3 12.8 2.4 11.3 2.4 11.3 11.3 2.4 11.3 2.4 12.8 11.3 12.8 11.3 21.7 12.8 21.7 12.8 12.8 21.7 12.8z"/>
        </symbol>
        <symbol id="cursor-drag" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M3.4 12.7L7.2 15.4 6.2 16.4 0.1 12 6.2 7.6 7.2 8.7 3.4 11.3 10.5 11.3 10.5 12.7z"/>
          <path fillRule="evenodd" clipRule="evenodd"
            d="M13.5 12.7L13.5 11.3 20.6 11.3 16.8 8.7 17.8 7.6 23.9 12 17.8 16.4 16.8 15.4 20.6 12.7z"/>
        </symbol>
        <symbol id="cursor-prev" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
        </symbol>
        <symbol id="cursor-next" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
        </symbol>
        <symbol id="cursor-blank" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M17 5.9L8 5.9 8 4.4 19.6 4.4 19.5 16 18 16 18.1 7 5.4 19.6 4.4 18.6z"/>
        </symbol>
        <symbol id="cursor-close" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 11L19.8 3.1 20.9 4.2 13 12 20.9 19.8 19.8 20.9 12 13 4.2 20.9 3.1 19.8 11 12 3.1 4.2 4.2 3.1z"/>
        </symbol>
      </svg>

      {/* ── Cursor element ───────────────────────────────────────────── */}
      <div ref={ref} data-cursor-el aria-hidden="true">
        <div className="circle">
          {ICON_TYPES.map((t) => (
            <svg key={t} className={`cursor-${t}`}>
              <use href={`#cursor-${t}`} />
            </svg>
          ))}
        </div>
      </div>
    </>
  );
}
