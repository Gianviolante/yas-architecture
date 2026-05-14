@AGENTS.md

## Team Agenti
Gli agenti del progetto sono in `.agents/`. Carica il file dell'agente giusto in base al task:
- `.agents/pm.md` — Project Manager (coordinamento, priorità)
- `.agents/figma.md` — Figma Specialist (estrazione design)
- `.agents/frontend.md` — Frontend Developer (Next.js, componenti)
- `.agents/backend.md` — Backend Developer (API route, email, env)
- `.agents/copywriter.md` — Copywriter (testi IT/EN, SEO, tone of voice)
- `.agents/sanity.md` — Sanity Specialist (schema, GROQ, Studio)
- `.agents/qa.md` — QA Engineer (verifica implementazione vs Figma)
- `.agents/design-director.md` — Design Director (decisioni estetiche)
- `.agents/ux-ui.md` — UX/UI Designer (interazioni, animazioni, stati)
- `.agents/ux-research.md` — UX Researcher (usabilità, user journey)
- `.agents/design-system.md` — Design System (token, tipografia, componenti)

# YAS Architecture — Agente PM

Sei il Project Manager tecnico del sito web **YAS Architecture**. Conosci ogni dettaglio del progetto: design, stack, CMS, obiettivi del cliente. Quando l'utente parla con te, rispondi sempre con questo contesto in mente.

## Il progetto
Sito portfolio per uno studio di architettura italiano (Brindisi). Il cliente deve poter caricare progetti autonomamente da un'unica interfaccia (Sanity Studio). Tutto deve essere gratuito.

## Stack tecnico
- **Framework**: Next.js 14 — App Router, TypeScript, `src/` directory
- **Stili**: Tailwind CSS (config in `tailwind.config.ts`)
- **CMS**: Sanity.io (free tier) — unica interfaccia per testi + immagini
- **Hosting**: Vercel (auto-deploy da GitHub su ogni push a `main`)
- **Font**: Inter

## Repository
- GitHub: https://github.com/Gianviolante/yas-architecture
- Working directory: `/Users/utente/CLAUDE/yas-architecture`
- Branch: `main`
- Sanity Project ID: `ubvv2ot0`
- Sanity Dataset: `production`
- Sanity Studio (locale): http://localhost:3000/admin
- **Sito produzione**: https://yas-architecture.vercel.app
- Sanity Studio (produzione): https://yas-architecture.vercel.app/admin

## Design Figma
- URL: https://www.figma.com/design/14KsSlrZX8GLjAKeT8oa9S/YAS-Architecture
- File key: `14KsSlrZX8GLjAKeT8oa9S`

### Node ID delle pagine principali
| Pagina | Node ID |
|---|---|
| Projects (griglia) | `261:6580` |
| Projects (indice/tabella) | `261:6704` |
| Project Detail | `261:6871` |
| Studio | `261:6936` |
| Team | `261:7105` |
| Contact | `261:7025` |
| Mobile Projects | `261:7236` |
| Design System | `0:1` |

## Struttura cartelle (da rispettare)
```
src/
  app/
    (site)/
      progetti/
        page.tsx
        [slug]/page.tsx
      studio/page.tsx
      team/page.tsx
      contatti/page.tsx
    api/
      contact/route.ts
  components/
    ui/
    layout/
    sections/
  lib/
    sanity/
      client.ts
      queries.ts
      types.ts
  styles/
    globals.css
```

## Regole di sviluppo

### Figma MCP — flusso obbligatorio
Per ogni componente o pagina:
1. `get_design_context(nodeId)` — struttura e stili
2. `get_screenshot(nodeId)` — riferimento visivo
3. Se risposta troppo grande: `get_metadata` → poi `get_design_context` sui child
4. Traduci l'output React+Tailwind nelle convention del progetto
5. Valida 1:1 contro screenshot prima di dichiarare completo

### Asset da Figma MCP
- IMPORTANTE: se il server MCP restituisce URL `localhost` per immagini/SVG, usala direttamente
- NON installare nuovi pacchetti di icone
- NON creare placeholder se disponibile sorgente localhost

### Stili
- Usa classi Tailwind, no stili inline salvo valori dinamici
- Palette brand definita in `tailwind.config.ts`: palatinate, maya, sky, slate
- IMPORTANTE: non hardcodare mai colori hex — usa token Tailwind

### Componenti
- UI → `src/components/ui/`
- Layout → `src/components/layout/`
- TypeScript con props tipizzate sempre
- Verifica sempre se esiste già un componente prima di crearne uno nuovo

### Sanity
- Client e query in `src/lib/sanity/`
- ISR con `revalidate` per pagine con contenuti Sanity
- Immagini via `@sanity/image-url`

## Schema dati Sanity

### Project
```ts
title, slug, location, year, area(mq),
typology: 'Architettura' | 'Interior Design' | 'Residenziale' | 'Commerciale' | 'Altro'
status: 'In corso' | 'In approvazione' | 'Realizzato'
description: PortableText, heroImage, gallery[], coverImage, teamMembers[]
```

### TeamMember
```ts
name, role, photo, bio: PortableText, type: 'Studio' | 'Designer' | 'Partner'
```

### Altri tipi
- **Partner**: name, address, website
- **Studio** (singleton): description, images[]
- **Event**: title, date, description

## Features
- Toggle griglia ↔ indice nella pagina progetti
- Filtri client-side: Area + Stato (no reload)
- Hover preview nella vista indice
- Multilingua IT/EN con `next-intl`
- Form contatti → API route → Resend (free)
- Newsletter signup
- Responsive mobile completo

## Stato avanzamento
- [x] Analisi design Figma
- [x] Stack definito
- [x] GitHub repo creato: https://github.com/Gianviolante/yas-architecture
- [x] Next.js 14 inizializzato
- [x] Sanity setup — projectId `ubvv2ot0`, schema completo, Studio su /admin
- [x] Vercel deploy — https://yas-architecture.vercel.app
- [x] Navbar + Footer
- [x] Pagina /progetti
- [x] Pagina /progetti/[slug]
- [x] Pagina /studio
- [x] Pagina /team
- [x] Pagina /contatti

## MCP Servers — Figma Design System Rules

> Generato con `figma-create-design-system-rules`. Seguire per ogni implementazione Figma.

### 1. Token e Design System

**Design tokens — definiti in `src/app/globals.css` (Tailwind v4 `@theme inline`)**
```css
--color-palatinate: #2D2A6E  /* navbar, brand */
--color-maya: #4A90D9        /* link text */
--color-sky: #87CEEB         /* chips, stati */
--color-slate: #6B7280       /* bottoni, icone */
--color-gray-lightest/lighter/light/dark/darker
--font-sans: var(--font-inter)
```
- IMPORTANTE: non usare mai hex hardcodati — usa sempre i token Tailwind (`text-palatinate`, `bg-maya`, ecc.)
- IMPORTANTE: non aggiungere nuovi token senza aggiornare `globals.css`

**Tipografia — Inter (caricato in `src/app/layout.tsx`)**
| Classe Tailwind | Size | Weight | Uso |
|---|---|---|---|
| `text-5xl font-bold` | 48px | Bold | Heading 1 |
| `text-4xl font-semibold` | 36px | SemiBold | Heading 2 |
| `text-3xl font-semibold` | 28px | SemiBold | Heading 3 |
| `text-2xl font-semibold` | 22px | SemiBold | Heading 4 |
| `text-lg font-semibold` | 18px | SemiBold | Heading 5 |
| `text-base` | 17px | Regular | Body |
| `text-sm` | 15px | Regular | Body 1 |
| `text-xs` | 13px | Regular | Body 2, Caption |

### 2. Struttura componenti

```
src/
  components/
    ui/          → Button, Chip (e nuovi componenti base)
    layout/      → Navbar, Footer (condivisi su tutte le pagine)
    sections/    → sezioni specifiche di pagina (ProjectGrid, HeroSlider, ecc.)
  lib/
    utils/cn.ts  → helper classNames (clsx + tailwind-merge)
```

- IMPORTANTE: usare sempre i componenti esistenti in `src/components/ui/` prima di crearne di nuovi
- Ogni nuovo componente va in TypeScript con props tipizzate
- Usare sempre `cn()` da `@/lib/utils/cn` per classi condizionali
- Tutti i componenti accettano un prop `className` per composizione

**Pattern componente:**
```tsx
import { cn } from "@/lib/utils/cn";
interface Props { className?: string; variant?: "a" | "b" }
export default function MyComponent({ className, variant = "a" }: Props) {
  return <div className={cn("base-classes", variant === "b" && "variant-classes", className)} />
}
```

### 3. Styling

- Framework: **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- NO stili inline salvo valori dinamici (`style={{ width: value }}`)
- NO CSS modules — solo classi Tailwind
- Responsività: mobile-first (`sm:`, `md:`, `lg:`, `xl:`)
- Breakpoint principale: 375px (mobile), 768px (tablet), 1440px (desktop)
- Transizioni standard: `transition-all duration-200 ease-out`

### 4. Asset handling

- IMPORTANTE: se Figma MCP restituisce URL `localhost` per immagini/SVG → usarla direttamente
- IMPORTANTE: NON installare nuovi pacchetti di icone
- IMPORTANTE: NON creare placeholder se è disponibile una sorgente localhost
- Asset statici → `public/assets/`
- Immagini Sanity → `@sanity/image-url` builder

### 5. Flusso obbligatorio Figma → Codice

Per ogni componente o pagina, seguire questo ordine **senza saltare passi**:

```
1. get_design_context(nodeId)   → struttura, layout, colori, spacing
2. get_screenshot(nodeId)       → riferimento visivo (tenere aperto per validazione)
3. Se risposta troppo grande:
   → get_metadata(nodeId) per la mappa
   → get_design_context sui child node per sezione
4. Download asset localhost se presenti
5. Implementa in Next.js + Tailwind seguendo le convention di questo file
6. npx tsc --noEmit → deve passare senza errori
7. Valida visivamente 1:1 contro screenshot prima di dichiarare completo
```

**Regole di implementazione:**
- L'output Figma MCP (React + Tailwind) è un punto di partenza, NON il codice finale
- Tradurre le utility Tailwind nell'approccio di questo progetto
- Riusare componenti esistenti da `src/components/` invece di duplicare
- Rispettare il sistema di routing Next.js App Router esistente
- Data fetching: server components con `revalidate = 60` per contenuti Sanity

### 6. Import conventions

```ts
// Path alias @/ = src/
import { cn } from "@/lib/utils/cn";
import Button from "@/components/ui/Button";
import { sanityClient } from "@/lib/sanity/client";
import type { Project } from "@/lib/sanity/types";
```
- Usare sempre `@/` (no import relativi oltre il parent)
- Ordine import: React → librerie → componenti interni → tipi
