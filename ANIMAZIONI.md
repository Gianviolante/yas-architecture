# 🎬 Animazioni Framer Motion — Guida d'uso

Framer Motion è installato e disponibile per creare animazioni eleganti e minimaliste su tutto il sito.

## Componenti disponibili

### 1. **FadeInOnScroll** — Fade-in al scroll
Anima un elemento quando entra nel viewport (apparizione smooth + slide-up).

```tsx
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

<FadeInOnScroll>
  <div>Questo elemento apparirà quando scrollerai fino a qui</div>
</FadeInOnScroll>

// Con delay personalizzato
<FadeInOnScroll delay={0.2}>
  <div>Apparirà con un delay di 200ms</div>
</FadeInOnScroll>
```

**Parametri:**
- `children` (ReactNode) — Contenuto da animare
- `delay` (number, default 0) — Delay in secondi prima dell'animazione
- `className` (string, optional) — CSS classes aggiuntive

---

### 2. **StaggerContainer** — Animazioni in sequenza
Anima i figli uno per uno con stagger (effetto "cascade").

```tsx
import StaggerContainer from "@/components/ui/StaggerContainer";

<StaggerContainer staggerDelay={0.1}>
  <div>Primo elemento</div>
  <div>Secondo elemento (appare dopo 100ms)</div>
  <div>Terzo elemento (appare dopo 200ms)</div>
</StaggerContainer>
```

**Parametri:**
- `children` (ReactNode) — Contenuto (array o singolo elemento)
- `staggerDelay` (number, default 0.1) — Delay tra i figli in secondi
- `className` (string, optional) — CSS classes

---

### 3. **PageTransition** — Transizioni tra pagine
Già integrato nel layout principale. Tutti i cambi pagina hanno automaticamente un fade-in smooth (300ms).

Non richiede azione — è applicato a tutto il sito.

---

## Esempi pratici

### Animare una gallery al scroll
```tsx
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

{projects.map((project, idx) => (
  <FadeInOnScroll key={project.id} delay={idx * 0.05}>
    <ProjectCard {...project} />
  </FadeInOnScroll>
))}
```

### Animare card con stagger
```tsx
import StaggerContainer from "@/components/ui/StaggerContainer";

<StaggerContainer staggerDelay={0.08}>
  {team.map(member => (
    <TeamMemberCard key={member.id} {...member} />
  ))}
</StaggerContainer>
```

---

## Design principles

✅ **Minimalista** — Durate corte (0.5-0.6s), easing soft
✅ **Performante** — Usa `will-change` e GPU acceleration
✅ **Elegante** — Effetti non invasivi, focus sulla content
✅ **Accessibile** — Rispetta `prefers-reduced-motion`

---

## Configurazione avanzata

Se hai bisogno di animazioni custom più complesse, puoi usare direttamente Framer Motion:

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Contenuto
</motion.div>
```

Documenti ufficiali: https://www.framer.com/motion/
