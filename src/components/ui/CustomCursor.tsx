"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor — logica identica a davidegroppi.com
 *
 * Fix rispetto alla versione precedente:
 *   – L'elemento usa data-cursor-el="" (attributo data-* garantito sul DOM da React)
 *     invece di cursor="" che React strippava, causando il mancato match CSS
 *     e il render visibile delle icone SVG sulla pagina.
 *   – Sprite SVG nascosto con style={{ display:"none" }} anziché sr-only.
 *
 * Logica (mirrors Groppi's CursorTypeComponent + CursorComponent):
 *   – Per ogni a/button senza cursor-type → assegna "nav"
 *   – mouseenter → mostra cursore col tipo corretto
 *   – mouseleave → torna idle
 *   – MutationObserver: registra nuovi nodi e rileva cambio cursor-type
 *     (necessario per slider che cambiano cursor-type su mousemove)
 *   – RAF loop: lerp ÷4 posizione, ÷10 opacità (identico a Groppi)
 *   – active solo se window.innerWidth >= 1024
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
    const _el = ref.current;
    if (!_el || !window.matchMedia("(pointer: fine)").matches) return;
    const el = _el; // HTMLDivElement — TypeScript preserva il tipo nei closure

    const html  = document.documentElement;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos:    { x: number; y: number; o: number } | null = null;
    let rafId   = 0;
    let active_ = false;
    let type_: CursorType = "idle";

    // ── active setter (identico a Groppi) ─────────────────────────────
    function setActive(val: boolean) {
      if (active_ === val) return;
      active_ = val;
      if (active_ && type_ !== "idle") html.classList.add("cursor--active");
      else                              html.classList.remove("cursor--active");
    }

    // ── cursorType setter (switch identico a Groppi) ──────────────────
    function setType(type: CursorType) {
      if (type_ === type) return;
      type_ = type;
      switch (type) {
        case "nav":  el.className = "over";        break;
        case "idle": el.className = "";             break;
        default:     el.className = `over ${type}`; break;
      }
      if (active_ && type_ !== "idle") html.classList.add("cursor--active");
      else                              html.classList.remove("cursor--active");
    }

    // ── RAF loop (lerp ÷4 pos, ÷10 opacity — identico a Groppi) ──────
    function tick() {
      if (active_ && pos !== null) {
        pos.x += (mouse.x - pos.x) / 4;
        pos.y += (mouse.y - pos.y) / 4;
        pos.o += (1 - pos.o) / 10;
        el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        el.style.opacity   = String(pos.o);
      }
      rafId = requestAnimationFrame(tick);
    }

    // ── mousemove ─────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!pos) pos = { x: e.clientX, y: e.clientY, o: 0 };
    };

    // ── resize (active solo su desktop) ───────────────────────────────
    const onResize = () => setActive(window.innerWidth >= 1024);

    // ── Registrazione per-elemento (mirrors CursorTypeComponent) ──────
    const registered = new WeakSet<Element>();
    let hovered: Element | null = null;

    function registerNode(node: Element) {
      if (registered.has(node)) return;
      registered.add(node);

      // Se a/button senza cursor-type → "nav" (logica Groppi)
      if (!node.hasAttribute("cursor-type")) {
        const tag = node.nodeName.toLowerCase();
        if (tag === "a" || tag === "button") node.setAttribute("cursor-type", "nav");
      }

      const t = node.getAttribute("cursor-type");
      if (!t || !(CURSOR_TYPES as readonly string[]).includes(t)) return;

      node.addEventListener("mouseenter", () => {
        hovered = node;
        setType((node.getAttribute("cursor-type") || "idle") as CursorType);
      });
      node.addEventListener("mouseleave", () => {
        if (hovered === node) hovered = null;
        setType("idle");
      });
    }

    function scan(root: Document | Element = document) {
      root.querySelectorAll<Element>("[cursor-type], a, button").forEach(registerNode);
    }

    // ── MutationObserver ──────────────────────────────────────────────
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // Nuovi nodi aggiunti al DOM
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            const node = n as Element;
            const tag = node.nodeName.toLowerCase();
            if (tag === "a" || tag === "button" || node.hasAttribute("cursor-type")) {
              registerNode(node);
            }
            node.querySelectorAll<Element>("[cursor-type], a, button").forEach(registerNode);
          });
        }
        // cursor-type modificato (slider lo cambiano su mousemove)
        if (m.type === "attributes" && m.attributeName === "cursor-type") {
          const target = m.target as Element;
          const newType = target.getAttribute("cursor-type") as CursorType | null;
          registerNode(target);
          if (hovered && (hovered === target || target.contains(hovered))) {
            setType(newType ?? "idle");
          }
        }
      }
    });

    // ── Init ──────────────────────────────────────────────────────────
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize",    onResize);
    setActive(window.innerWidth >= 1024);
    scan();
    mo.observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ["cursor-type"],
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
      {/*
        Sprite SVG — display:none garantisce che non sia mai visibile.
        I <symbol> sono template puri, non si renderizzano mai da soli.
      */}
      <svg
        aria-hidden="true"
        style={{ display: "none" }}
      >
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

      {/*
        Elemento cursore.
        data-cursor-el="" — attributo data-* garantito sul DOM da React.
        Senza questo match il CSS non si applica e le icone diventano visibili.
      */}
      <div ref={ref} data-cursor-el="" aria-hidden="true">
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
