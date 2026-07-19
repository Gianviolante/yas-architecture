# 📊 Grid System Analysis — v0 Consultation Brief

## Stato Attuale del Sistema di Grid

### ✅ Cosa funziona bene
- Breakpoints chiari: mobile (no prefix) → `md:` 768px → `lg:` 1024px
- Custom utility `.page-px` per padding intelligente
- Responsive design implementato su tutte le pagine
- Max-width container 1440px ben gestito
- Sticky navigation e filtri funzionanti

---

## ⚠️ Problemi Identificati (Priorità)

### 🔴 **ALTA** — Inconsistenza Padding Orizzontale
**Problema**: Sito usa 3 approcci diversi contemporaneamente
```tsx
// Approach 1: Fisso
px-[15px] md:px-[30px]

// Approach 2: Fallback
px-4 md:px-[30px]

// Approach 3: Intelligente (.page-px)
.page-px  /* scala con viewport */
```
**Impatto**: Layout non coerente su ultra-wide (1440px+)
**Soluzione v0**: Normalizzare tutto a `.page-px`

---

### 🟠 **MEDIA** — Hardcoded Hex Colors (invece di Token)
**Problema**: Colori diretti nel JSX, non usano token Tailwind
```tsx
className="border-[#333] text-[#333] bg-[#d9d9d9]"
/* Dovrebbe referenziare variabili da globals.css */
```
**Impatto**: Manutenzione difficile, tema cambia = refactor manuale
**Soluzione v0**: Creare componenti di colore che usano token

---

### 🟠 **MEDIA** — Gap/Spacing Inconsistente
**Problema**: 5+ valori diversi senza standard
```
gap-[8px]   (filtri)
gap-[12px]  (gallery)
gap-[14px]  (sezioni)
gap-[15px]  (immagini)
gap-[25px]  (home links)
```
**Soluzione v0**: Standardizzare a 4 valori (xs, sm, md, lg)

---

### 🟡 **BASSA** — Inline Styles per Valori Statici
**Problema**: `style={{}}` usato invece di classi Tailwind
```tsx
style={{ top: "8px", left: "16px" }}  /* ← dovrebbe essere classe */
style={{ fontSize: "clamp(...)" }}    /* ← ok, dinamico */
```
**Impatto**: Codice più verbose, difficile da mantenere

---

### 🟡 **BASSA** — Mix Altezze Fisse vs Aspect-Ratio
**Problema**: Alcuni componenti usano hardcoded heights, altri aspect-ratio
```tsx
h-[245px] md:h-[410px] lg:h-[631px]    /* ← fragile */
aspect-[345/256]                        /* ← meglio */
```

---

## 📋 Componenti da Normalizzare (per v0)

### 1. **Sezione Hero** (`src/app/page.tsx`)
- Testi con `style={{}}` → usare classi
- Positioning assoluto → potrebbe usare grid/flex

### 2. **Pagina Progetti** (`src/components/sections/ProgettiClient.tsx`)
- Filtri mobile/tablet/desktop → componente grid responsivo unificato
- Small cards grid → normalizzare gap
- Index table (6 col) → usare aspect-ratio

### 3. **Gallery/Carousel** (`src/components/sections/HomeProjectsCarousel.tsx`)
- Gap cards → standardizzare
- Responsive breakpoints → align con sistema

### 4. **Link Cards Home**
- FlexGrow hardcodato → potrebbe usare grid auto-fit

---

## 🎯 Cosa Chiedere a v0

### Prompt suggerito per v0:
```
Analizza e normalizza il sistema di grid del sito YAS Architecture (Next.js + Tailwind v4).

PROBLEMI TROVATI:
1. Padding orizzontale inconsistente (px-[15px], px-4, .page-px alternati)
2. Colori hardcodati (#333, #d9d9d9) invece di token Tailwind
3. Gap non standardizzato (gap-[8px] a gap-[25px])
4. Inline styles per valori statici
5. Mix altezze fisse vs aspect-ratio

OBIETTIVI:
- Unificare padding → sempre .page-px
- Creare spacing scale standard (4-5 valori)
- Convertire colori a token
- Convertire altezze a aspect-ratio
- Rimuovere inline styles non dinamici

PAGINE PRIORITARIE:
1. Homepage hero + link cards
2. Pagina Progetti (filtri + card grid)
3. Gallery carousel

Genera componenti normalizzati con Tailwind CSS v4, responsive, mantenendo design minimalista.
```

---

## 📊 Metriche Prima/Dopo

| Metrica | Prima | Dopo (v0) |
|---|---|---|
| **Approach padding** | 3 diversi | 1 standardizzato |
| **Gap values** | 5+ | 4 standardizzati |
| **Inline styles** | ~20+ | ~5 (solo dinamici) |
| **Colori hardcodati** | ~15+ | 0 (tutti token) |
| **Maintainability** | 🟡 Medio | 🟢 Alto |
| **Consistency** | 🟡 Medio | 🟢 Alto |

---

## 🚀 Output Atteso da v0

v0 dovrebbe generare:
1. Componente `<Container>` wrapper per padding standardizzato
2. Componente `<Grid>` (responsive, auto-cols)
3. Componente `<Spacer>` per gap standardizzato
4. Tailwind config snippet con spacing scale
5. Componenti rifattorizzate (Hero, FilterBar, CardGrid)
6. Color token mapping

---

## Link Utili
- Sito: https://yas-architecture.vercel.app
- Repo: https://github.com/Gianviolante/yas-architecture
- Tailwind config: `tailwind.config.ts`
- CSS theme: `src/app/globals.css`
