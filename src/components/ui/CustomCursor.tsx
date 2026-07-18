"use client";

import { useEffect, useRef } from "react";

const CURSOR_TYPES = [
  "idle","nav","drag","expand","blank","close",
  "add","remove","prev","next","play","audio-on","audio-off","scroll",
] as const;
type CursorType = (typeof CURSOR_TYPES)[number];

const ICON_TYPES = [
  "nav","drag","expand","blank","close","add","remove",
  "prev","next","play","audio-on","audio-off","scroll",
] as const;

// CSS iniettato direttamente dal componente — bypass completo di Tailwind/PostCSS
const CURSOR_CSS = `
  [data-cursor-el] {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    mix-blend-mode: difference;
    opacity: 0;
    z-index: 1000000;
  }
  [data-cursor-el] .circle {
    position: absolute;
    width: 60px;
    height: 60px;
    overflow: hidden;
    pointer-events: none;
    animation: cursor-twinkle 1s ease-in-out infinite alternate both;
  }
  @keyframes cursor-twinkle {
    0%  { transform: translateX(-50%) translateY(-50%) scale(.9); }
    to  { transform: translateX(-50%) translateY(-50%) scale(1); }
  }
  [data-cursor-el] .circle::before {
    content: "";
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid #fff;
    transform: scale(.1);
    transition: .25s ease-in-out;
    transition-property: border-color, transform;
  }
  [data-cursor-el] svg {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
    fill: #fff;
    pointer-events: none;
    opacity: 0;
    transform: scale(.5);
    transition: .25s ease-in-out;
    transition-property: transform, opacity;
  }
  [data-cursor-el].over .circle::before { transform: scale(1); }
  [data-cursor-el].add       .cursor-add,
  [data-cursor-el].audio-off .cursor-audio-off,
  [data-cursor-el].audio-on  .cursor-audio-on,
  [data-cursor-el].close     .cursor-close,
  [data-cursor-el].drag      .cursor-drag,
  [data-cursor-el].expand    .cursor-expand,
  [data-cursor-el].next      .cursor-next,
  [data-cursor-el].play      .cursor-play,
  [data-cursor-el].prev      .cursor-prev,
  [data-cursor-el].remove    .cursor-remove,
  [data-cursor-el].blank     .cursor-blank,
  [data-cursor-el].scroll    .cursor-scroll { opacity: 1; transform: scale(1); }
  .cursor--active * { cursor: none !important; }
`;

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _el = ref.current;
    if (!_el || !window.matchMedia("(pointer: fine)").matches) return;
    const el = _el;

    const html  = document.documentElement;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos:    { x: number; y: number; o: number } | null = null;
    let rafId   = 0;
    let active_ = false;
    let type_: CursorType = "idle";

    function setActive(val: boolean) {
      if (active_ === val) return;
      active_ = val;
      if (active_ && type_ !== "idle") html.classList.add("cursor--active");
      else                              html.classList.remove("cursor--active");
    }

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

    function tick() {
      if (active_ && pos !== null) {
        // Groppi segue il mouse quasi istantaneamente — lerp stretto.
        // Se il target è un bottone piccolo, si aggancia al suo centro
        // (snap magnetico) invece del punto esatto del mouse.
        const magnet = magneticTarget();
        const targetX = magnet ? magnet.x : mouse.x;
        const targetY = magnet ? magnet.y : mouse.y;
        pos.x += (targetX - pos.x) / 2;
        pos.y += (targetY - pos.y) / 2;
        // lerpa verso 1 solo se su elemento interattivo, verso 0 altrimenti
        const target = type_ !== "idle" ? 1 : 0;
        pos.o += (target - pos.o) / 10;
        el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        el.style.opacity   = String(pos.o < 0.005 ? 0 : pos.o);
      }
      rafId = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!pos) pos = { x: e.clientX, y: e.clientY, o: 0 };
    };

    const onResize = () => setActive(window.innerWidth >= 1024);

    const registered = new WeakSet<Element>();
    let hovered: Element | null = null;

    // Snap magnetico: su bottoni piccoli (frecce, chiudi — icona fissa) il
    // follower si centra esattamente sull'elemento invece di seguire il
    // mouse libero. È quello che permette a mix-blend-mode:difference di
    // "cancellare" otticamente l'icona statica sotto (trucco di Groppi,
    // verificato dal vivo: l'icona statica resta sempre opacity:1, sparisce
    // solo per sovrapposizione pixel-perfect col cursore). Su aree grandi
    // (immagini con cursor-type="expand"/"drag") niente snap: lì il cursore
    // deve restare libero di seguire il mouse.
    const MAGNETIC_MAX = 60;
    function magneticTarget(): { x: number; y: number } | null {
      if (!hovered) return null;
      const r = hovered.getBoundingClientRect();
      if (r.width > MAGNETIC_MAX || r.height > MAGNETIC_MAX) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // Aggiungi cursor-type="nav" a tutti i link che non lo hanno
    function addCursorTypeToLinks(root: Document | Element = document) {
      root.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        if (!link.hasAttribute("cursor-type")) {
          link.setAttribute("cursor-type", "nav");
        }
      });
    }

    // Come Groppi: il cursore custom appare su link e elementi marcati
    // esplicitamente con cursor-type.
    function registerNode(node: Element) {
      const t = node.getAttribute("cursor-type");
      if (!t || !(CURSOR_TYPES as readonly string[]).includes(t)) return;
      // registrato solo quando i listener vengono davvero agganciati, così
      // un nodo che riceve cursor-type più tardi non resta senza listener
      if (registered.has(node)) return;
      registered.add(node);
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
      addCursorTypeToLinks(root);
      root.querySelectorAll<Element>("[cursor-type]").forEach(registerNode);
    }

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            const node = n as Element;
            // Aggiungi cursor-type="nav" ai link se non ce l'hanno già
            if (node.tagName === "A" && !node.hasAttribute("cursor-type")) {
              node.setAttribute("cursor-type", "nav");
            }
            node.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
              if (!link.hasAttribute("cursor-type")) {
                link.setAttribute("cursor-type", "nav");
              }
            });
            if (node.hasAttribute("cursor-type")) registerNode(node);
            node.querySelectorAll<Element>("[cursor-type]").forEach(registerNode);
          });
        }
        if (m.type === "attributes" && m.attributeName === "cursor-type") {
          const target = m.target as Element;
          const newType = target.getAttribute("cursor-type") as CursorType | null;
          registerNode(target);
          // Controlla se il mouse è fisicamente sopra il target (risolve il bug
          // "primo hover": hovered è null perché mouseenter non aveva ancora un
          // listener, ma il mouse è già dentro → usiamo getBoundingClientRect)
          const rect = target.getBoundingClientRect();
          const mouseOver =
            mouse.x >= rect.left && mouse.x <= rect.right &&
            mouse.y >= rect.top  && mouse.y <= rect.bottom;
          if (mouseOver || (hovered && (hovered === target || target.contains(hovered)))) {
            setType(newType ?? "idle");
          }
        }
      }
    });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize",    onResize);
    setActive(window.innerWidth >= 1024);
    scan();
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["cursor-type"] });
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
      {/* CSS iniettato inline — garantito indipendente da Tailwind */}
      <style dangerouslySetInnerHTML={{ __html: CURSOR_CSS }} />

      {/* Sprite SVG — display:none, i <symbol> non renderizzano mai */}
      <svg aria-hidden="true" style={{ display: "none" }}>
        <symbol id="cursor-nav" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M1.6 12.7L1.6 11.3 19.2 11.3 12.3 5.7 13.3 4.6 22.4 12 13.3 19.4 12.3 18.3 19.2 12.7z"/>
        </symbol>
        <symbol id="cursor-drag" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.4 12.7L7.2 15.4 6.2 16.4 0.1 12 6.2 7.6 7.2 8.7 3.4 11.3 10.5 11.3 10.5 12.7z"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M13.5 12.7L13.5 11.3 20.6 11.3 16.8 8.7 17.8 7.6 23.9 12 17.8 16.4 16.8 15.4 20.6 12.7z"/>
        </symbol>
        <symbol id="cursor-expand" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M21.7 11.3L12.8 11.3 12.8 2.4 11.3 2.4 11.3 11.3 2.4 11.3 2.4 12.8 11.3 12.8 11.3 21.7 12.8 21.7 12.8 12.8 21.7 12.8z"/>
        </symbol>
        <symbol id="cursor-blank" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M17 5.9L8 5.9 8 4.4 19.6 4.4 19.5 16 18 16 18.1 7 5.4 19.6 4.4 18.6z"/>
        </symbol>
        <symbol id="cursor-close" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12,11.3L22.3,1L23,1.7L12.7,12L23,22.3L22.3,23L12,12.7L1.7,23L1,22.3L11.3,12L1,1.7L1.7,1C1.7,1,12,11.3,12,11.3z"/>
        </symbol>
        <symbol id="cursor-add" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M21.7 11.3L12.8 11.3 12.8 2.4 11.3 2.4 11.3 11.3 2.4 11.3 2.4 12.8 11.3 12.8 11.3 21.7 12.8 21.7 12.8 12.8 21.7 12.8z"/>
        </symbol>
        <symbol id="cursor-remove" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.4 11.3H21.7V12.8H2.4z"/>
        </symbol>
        <symbol id="cursor-prev" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.1,12l7.5,6.2L9,19l-9-7.5L9,4l0.6,0.8L2.1,11H24v1C24,12,2.1,12,2.1,12z"/>
        </symbol>
        <symbol id="cursor-next" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M21.9,12l-7.5,6.2L15,19l9-7.5L15,4l-0.6,0.8l7.5,6.2H0v1C0,12,21.9,12,21.9,12z"/>
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
          <path fillRule="evenodd" clipRule="evenodd" d="M12,2C8.1,2,5,5.1,5,9v6c0,3.9,3.1,7,7,7s7-3.1,7-7V9C19,5.1,15.9,2,12,2z M11.3,6.3h1.4v5.4h-1.4V6.3z"/>
        </symbol>
      </svg>

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
