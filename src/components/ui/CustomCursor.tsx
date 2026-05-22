"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor system — faithful 1:1 copy of davidegroppi.com
 *
 * Logic (mirrors Groppi's CursorTypeComponent + CursorComponent):
 *
 *  CursorTypeComponent (selector: '[cursor-type], a, button'):
 *    – If a/button has no cursor-type → assigns "nav"
 *    – mouseenter → setCursorType(type)
 *    – mouseleave → setCursorType("idle")
 *
 *  CursorComponent (selector: '[cursor]'):
 *    – RAF loop: lerp ÷4 position, ÷10 opacity  (same as Groppi)
 *    – active only when window.innerWidth >= 1024
 *    – className switch matches Groppi's cursorType setter exactly
 *
 *  Extra (React adapter):
 *    – MutationObserver watches DOM for new a/button/[cursor-type] nodes
 *    – Also watches cursor-type attribute changes (needed for sliders that
 *      update cursor-type on mousemove — e.g. HomeSlider, GallerySlider)
 *
 * HTML attribute:  cursor=""         (matches Groppi's [cursor] selector)
 * CSS classes:     over / over prev  (matches Groppi's class switch)
 */

const CURSOR_TYPES = [
  "idle","nav","drag","expand","blank","close",
  "add","remove","prev","next","play","audio-on","audio-off","scroll",
] as const;
type CursorType = (typeof CURSOR_TYPES)[number];

const ICON_TYPES = [
  "nav","drag","expand","blank","close","add","remove",
  "prev","next","play","audio-on","audio-off","scroll",
] as const;

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _node = ref.current;
    if (!_node || !window.matchMedia("(pointer: fine)").matches) return;
    // Capture after null-check so TypeScript preserves HTMLDivElement in closures
    const cursorNode = _node;

    const html  = document.documentElement;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let position: { x: number; y: number; o: number } | null = null;
    let rafId   = 0;
    let active_ = false;
    let cType_: CursorType = "idle";

    // ── active setter (mirrors Groppi) ────────────────────────────────
    function setActive(val: boolean) {
      if (active_ === val) return;
      active_ = val;
      if (active_ && cType_ !== "idle") html.classList.add("cursor--active");
      else                               html.classList.remove("cursor--active");
    }

    // ── cursorType setter (mirrors Groppi's switch exactly) ───────────
    function setCursorType(type: CursorType) {
      if (cType_ === type) return;
      cType_ = type;
      switch (type) {
        case "nav":   cursorNode.setAttribute("class", "over");        break;
        case "idle":  cursorNode.setAttribute("class", "");             break;
        default:      cursorNode.setAttribute("class", `over ${type}`); break;
      }
      if (active_ && cType_ !== "idle") html.classList.add("cursor--active");
      else                               html.classList.remove("cursor--active");
    }

    // ── RAF render loop (mirrors Groppi's render$) ────────────────────
    function tick() {
      if (active_ && position !== null) {
        position.x += (mouse.x - position.x) / 4;
        position.y += (mouse.y - position.y) / 4;
        position.o += (1 - position.o) / 10;
        cursorNode.style.transform = `translate(${position.x}px, ${position.y}px)`;
        cursorNode.style.opacity   = String(position.o);
      }
      rafId = requestAnimationFrame(tick);
    }

    // ── mousemove (mirrors Groppi's move$) ────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!position) position = { x: e.clientX, y: e.clientY, o: 0 };
    };

    // ── resize (mirrors Groppi's resize$) ─────────────────────────────
    const onResize = () => setActive(window.innerWidth >= 1024);

    // ── Per-element registration (mirrors CursorTypeComponent) ────────
    const registered = new WeakSet<Element>();
    let hoveredNode: Element | null = null;

    function registerNode(el: Element) {
      if (registered.has(el)) return;
      registered.add(el);

      // If no explicit cursor-type on a/button → assign "nav" (Groppi logic)
      if (!el.hasAttribute("cursor-type")) {
        const tag = el.nodeName.toLowerCase();
        if (tag === "a" || tag === "button") {
          el.setAttribute("cursor-type", "nav");
        }
      }

      const rawType = el.getAttribute("cursor-type");
      if (!rawType || !(CURSOR_TYPES as readonly string[]).includes(rawType)) return;

      el.addEventListener("mouseenter", () => {
        hoveredNode = el;
        const t = (el.getAttribute("cursor-type") || "idle") as CursorType;
        setCursorType(t);
      });
      el.addEventListener("mouseleave", () => {
        if (hoveredNode === el) hoveredNode = null;
        setCursorType("idle");
      });
    }

    function scanAndRegister(root: Document | Element = document) {
      root.querySelectorAll<Element>("[cursor-type], a, button").forEach(registerNode);
    }

    // ── MutationObserver ──────────────────────────────────────────────
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // New nodes added to DOM
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            const el = n as Element;
            const tag = el.nodeName.toLowerCase();
            if (tag === "a" || tag === "button" || el.hasAttribute("cursor-type")) {
              registerNode(el);
            }
            el.querySelectorAll<Element>("[cursor-type], a, button").forEach(registerNode);
          });
        }

        // cursor-type attribute changed (sliders call setAttribute on mousemove)
        if (m.type === "attributes" && m.attributeName === "cursor-type") {
          const target = m.target as Element;
          const newType = target.getAttribute("cursor-type") as CursorType | null;

          if (!newType) {
            // attribute removed → idle
            if (hoveredNode && (hoveredNode === target || target.contains(hoveredNode))) {
              setCursorType("idle");
            }
          } else {
            // attribute added/changed
            registerNode(target);
            if (hoveredNode && (hoveredNode === target || target.contains(hoveredNode))) {
              setCursorType(newType);
            }
          }
        }
      }
    });

    // ── Init ──────────────────────────────────────────────────────────
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize",    onResize);
    setActive(window.innerWidth >= 1024);
    scanAndRegister();
    mo.observe(document.body, {
      childList:       true,
      subtree:         true,
      attributes:      true,
      attributeFilter: ["cursor-type"],
    });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize",    onResize);
      mo.disconnect();
      html.classList.remove("cursor--active");
    };
  }, []);

  return (
    <>
      {/* ── SVG sprite — exact paths from davidegroppi.com ────────── */}
      <svg width="0" height="0" className="sr-only" aria-hidden="true">
        <symbol id="cursor-nav" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M1.6 12.7L1.6 11.3 19.2 11.3 12.3 5.7 13.3 4.6 22.4 12 13.3 19.4 12.3 18.3 19.2 12.7z"/>
        </symbol>
        <symbol id="cursor-drag" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M3.4 12.7L7.2 15.4 6.2 16.4 0.1 12 6.2 7.6 7.2 8.7 3.4 11.3 10.5 11.3 10.5 12.7z"/>
          <path fillRule="evenodd" clipRule="evenodd"
            d="M13.5 12.7L13.5 11.3 20.6 11.3 16.8 8.7 17.8 7.6 23.9 12 17.8 16.4 16.8 15.4 20.6 12.7z"/>
        </symbol>
        <symbol id="cursor-expand" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.7 11.3L12.8 11.3 12.8 2.4 11.3 2.4 11.3 11.3 2.4 11.3 2.4 12.8 11.3 12.8 11.3 21.7 12.8 21.7 12.8 12.8 21.7 12.8z"/>
        </symbol>
        <symbol id="cursor-blank" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M17 5.9L8 5.9 8 4.4 19.6 4.4 19.5 16 18 16 18.1 7 5.4 19.6 4.4 18.6z"/>
        </symbol>
        <symbol id="cursor-close" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 11L19.8 3.1 20.9 4.2 13 12 20.9 19.8 19.8 20.9 12 13 4.2 20.9 3.1 19.8 11 12 3.1 4.2 4.2 3.1z"/>
        </symbol>
        <symbol id="cursor-add" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.7 11.3L12.8 11.3 12.8 2.4 11.3 2.4 11.3 11.3 2.4 11.3 2.4 12.8 11.3 12.8 11.3 21.7 12.8 21.7 12.8 12.8 21.7 12.8z"/>
        </symbol>
        <symbol id="cursor-remove" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.4 11.3H21.7V12.8H2.4z"/>
        </symbol>
        <symbol id="cursor-prev" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
        </symbol>
        <symbol id="cursor-next" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
        </symbol>
        <symbol id="cursor-play" viewBox="0 0 24 24">
          <path d="M3,22V2l18,10L3,22z"/>
        </symbol>
        <symbol id="cursor-audio-on" viewBox="0 0 24 24">
          <path d="M5,17H0V7h5V17z M7,7v10l9,5V2L7,7z M24,11h-5v2h5V11z M22.4,4.8l-4.3,2.5l1,1.7l4.3-2.5L22.4,4.8z M23.4,17.5L19.1,15l-1,1.7l4.3,2.5L23.4,17.5z"/>
        </symbol>
        <symbol id="cursor-audio-off" viewBox="0 0 24 24">
          <path d="M5,17H0V7h5V17z M7,7v10l9,5V2L7,7z M22.3,12l1.6-1.7L22.6,9L21,10.7L19.3,9L18,10.3l1.7,1.7L18,13.7l1.3,1.3l1.7-1.7l1.7,1.7l1.3-1.3C24,13.6,22.3,12,22.3,12z"/>
        </symbol>
        <symbol id="cursor-scroll" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12,2C8.1,2,5,5.1,5,9v6c0,3.9,3.1,7,7,7s7-3.1,7-7V9C19,5.1,15.9,2,12,2z M11.3,6.3h1.4v5.4h-1.4V6.3z"/>
        </symbol>
      </svg>

      {/* ── Cursor element — attribute "cursor" matches Groppi's [cursor] selector ── */}
      <div ref={ref} {...{ cursor: "" } as React.HTMLAttributes<HTMLDivElement>} aria-hidden="true">
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
