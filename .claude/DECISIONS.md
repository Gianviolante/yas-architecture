# YAS Architecture — Decisioni & Stato

**Data aggiornamento**: 2026-07-16  
**Ultimo agente**: Claude (general)  
**Handoff attivo**: Color audit — controllo colori neri non puri (#171717, #1a1a1a)

---

## ✅ Avanzamento

- [x] Analisi design Figma
- [x] Stack definito (Next.js 14, Tailwind, Sanity, Vercel)
- [x] GitHub repo creato: https://github.com/Gianviolante/yas-architecture
- [x] Next.js 14 inizializzato
- [x] Sanity setup — projectId `ubvv2ot0`, production dataset
- [x] Vercel deploy — https://yas-architecture.vercel.app
- [x] Navbar + Footer
- [x] Pagina /progetti
- [x] Pagina /progetti/[slug]
- [x] Pagina /studio
- [x] Pagina /team
- [x] Pagina /contatti
- [ ] **Audit colori** — fix colori neri non puri (in progress)
- [ ] Ottimizzazione asset responsivi (da davidegroppi.com benchmark)

---

## 🎨 Brand & Design Decisions

### Palette
| Token | Hex | Usage |
|-------|-----|-------|
| palatinate | #2D2A6E | navbar, brand |
| maya | #4A90D9 | link text |
| sky | #87CEEB | chips, states |
| slate | #6B7280 | buttons, icons |

### Colori Neri — ISSUES FOUND
- **Body/Nav/Footer**: `#171717` (rgb 23,23,23) — dovrebbe essere #000000
- **Testi/Link**: `#1a1a1a` (rgb 26,26,26) — dovrebbe essere #000000
- **Pagina**: selection background `#171717` — dovrebbe essere #000000

**Azione**: Standardizzare a nero puro (#000000) oppure confermare grigio intenzionale.

### Font
- **Inter** caricato in `src/app/layout.tsx`
- Tipografia standard in CLAUDE.md

---

## 🔧 Technical Decisions

### Data Fetching
- ISR con `revalidate = 60` per contenuti Sanity
- Server components di default
- Immagini via `@sanity/image-url`

### Styling
- Tailwind CSS v4 (no inline styles, no CSS modules)
- Mobile-first: 375px, 768px, 1440px breakpoints
- Token solo da `@theme inline` in globals.css

### Componenti
- UI → `src/components/ui/`
- Layout → `src/components/layout/`
- Sections → `src/components/sections/`
- Always TypeScript + props tipizzate

---

## 📋 Handoff Attivo

**Task**: Audit colori neri + fix vs davidegroppi.com benchmark  
**Status**: In progress  
**Findings**:
- Body color `#171717` (not pure black)
- Navbar/link text `#1a1a1a` (not pure black)
- Selection bg `#171717` (not pure black)
- h1.text-black = `#000000` ✅ (correct)

**Prossimo step**: Decide if intentional or fix all to #000000.

---

## 📸 Asset & Responsive

**In review**: Rapporto di aspetto progetti su davidegroppi.com vs YAS  
(mobile-first optimization needed)

---

## 🗂 File Key References

| Item | Value |
|------|-------|
| Figma | https://www.figma.com/design/14KsSlrZX8GLjAKeT8oa9S/YAS-Architecture |
| GitHub | https://github.com/Gianviolante/yas-architecture |
| Sanity Studio (prod) | https://yas-architecture.vercel.app/admin |
| Sanity Project ID | ubvv2ot0 |

---

## 🚀 Token Optimization Strategy

Implementata 2026-07-16:
- CLAUDE.md snellito (-60% base tokens)
- Questo file (DECISIONS.md) caricato on-demand
- Memory per persistent context
- Abitudini: `/clear` tra task, `/compact` per lunghe conversazioni

Vedi `/Users/utente/CLAUDE/resources/token-optimization/IMPLEMENTED_STRATEGY.md` per details.
