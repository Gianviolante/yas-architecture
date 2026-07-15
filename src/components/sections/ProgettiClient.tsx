"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project, Typology, ProjectStatus } from "@/lib/sanity/types";
import ProjectsSlider from "@/components/sections/ProjectsSlider";

const AREA_FILTERS: { label: string; value: Typology | "all" }[] = [
  { label: "Tutti i progetti", value: "all" },
  { label: "Architettura",     value: "Architettura" },
  { label: "Interior design",  value: "Interior Design" },
];
const CAT_FILTERS: { label: string; value: Typology }[] = [
  { label: "Residenziali", value: "Residenziale" },
  { label: "Commerciali",  value: "Commerciale" },
  { label: "Altro",        value: "Altro" },
];
const STATO_FILTERS: { label: string; value: ProjectStatus }[] = [
  { label: "In corso",   value: "In corso" },
  { label: "Progetti",   value: "Progetti" },
  { label: "Realizzato", value: "Realizzato" },
];

interface Props { projects: Project[]; initialTypology?: string; }

export default function ProgettiClient({ projects, initialTypology }: Props) {
  const [view,            setView]            = useState<"grid" | "index">("grid");
  const [typologyFilters, setTypologyFilters] = useState<Set<Typology>>(() => {
    const all = [...AREA_FILTERS.map(f => f.value), ...CAT_FILTERS.map(f => f.value)].filter(v => v !== "all") as Typology[];
    if (initialTypology && all.includes(initialTypology as Typology)) return new Set([initialTypology as Typology]);
    return new Set();
  });
  const [statoFilters,   setStatoFilters]    = useState<Set<ProjectStatus>>(new Set());
  const [hoveredId,      setHoveredId]       = useState<string | null>(null);

  const filtered = useMemo(() => projects.filter((p) => {
    const matchType  = typologyFilters.size === 0 || typologyFilters.has(p.typology);
    const matchStato = statoFilters.size    === 0 || statoFilters.has(p.status);
    return matchType && matchStato;
  }), [projects, typologyFilters, statoFilters]);

  const hasFilters  = typologyFilters.size > 0 || statoFilters.size > 0;
  const activeLabel = [
    ...[...typologyFilters].map(t => [...AREA_FILTERS, ...CAT_FILTERS].find(f => f.value === t)?.label.toLowerCase() ?? t.toLowerCase()),
    ...[...statoFilters].map(s => s.toLowerCase()),
  ].join(", ");

  const toggleTypology = (value: Typology) =>
    setTypologyFilters(prev => { const n = new Set(prev); n.has(value) ? n.delete(value) : n.add(value); return n; });
  const toggleStato = (value: ProjectStatus) =>
    setStatoFilters(prev => { const n = new Set(prev); n.has(value) ? n.delete(value) : n.add(value); return n; });
  const reset = () => { setTypologyFilters(new Set()); setStatoFilters(new Set()); };

  // Featured → large 2-col (max 4), rest → small 3-col
  const large = filtered.filter((p) => p.featured).slice(0, 4);
  const small = filtered.filter((p) => !p.featured);
  const largeRows: Project[][] = [];
  for (let i = 0; i < large.length; i += 2) largeRows.push(large.slice(i, i + 2));

  const hoveredProject = hoveredId ? projects.find(p => p._id === hoveredId) ?? null : null;

  // Desktop chip (compact)
  const chipDt = (active: boolean) =>
    `inline-flex items-center border-2 rounded-[100px] px-[16px] py-[7px] text-[12px] leading-[1.4] whitespace-nowrap transition-colors duration-200 cursor-pointer ${
      active ? "bg-black border-black text-white" : "border-[#333] text-[#333] hover:bg-black hover:border-black hover:text-white"
    }`;

  // Mobile chip (larger, 42px height per Figma)
  const chipMb = (active: boolean) =>
    `inline-flex items-center border-2 rounded-[100px] px-[24px] py-[10px] text-[16px] leading-[22px] whitespace-nowrap transition-colors duration-200 cursor-pointer shrink-0 ${
      active ? "bg-black border-black text-white" : "border-[#333] text-[#333]"
    }`;

  return (
    <div className="pt-[60px] md:pt-[80px]">

      {/* ── Intro text ─────────────────────────────────────────────── */}
      {/* page-px (cap 1440px): a piena larghezza le righe di testo diventano
          troppo lunghe da leggere sui monitor ultra-wide. Griglia/index
          restano piena larghezza — le immagini ne beneficiano, il testo no. */}
      <div className="page-px pt-[30px] pb-[20px] md:pt-[37px] md:pb-[26px]">
        <p className="text-[16px] md:text-[24px] leading-normal text-black">
          I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità.
          Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la
          distinzione delle diverse categorie informative e indirizzando lo spostamento dell&apos;occhio del lettore tra di esse.
        </p>
      </div>

      {/* ── Sticky filter bar ──────────────────────────────────────── */}
      <div className="sticky top-[60px] md:top-[80px] z-40 bg-white shadow-[0px_6px_4px_rgba(0,0,0,0.1)]">

        {/* ── Mobile filter (stacked groups, horizontal scroll) ─────── */}
        <div className="md:hidden pt-[16px] pb-[10px]">

          {/* Area */}
          <p className="text-[12px] leading-[1.5] text-[#282828] px-[15px]">Area</p>
          <div className="overflow-x-auto">
            <div className="flex gap-[8px] px-[15px] py-[11px]">
              <button onClick={() => setTypologyFilters(new Set())} className={chipMb(typologyFilters.size === 0)}>
                Tutti i progetti
              </button>
              {AREA_FILTERS.slice(1).map(({ label, value }) => (
                <button key={value} onClick={() => toggleTypology(value as Typology)} className={chipMb(typologyFilters.has(value as Typology))}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <p className="text-[12px] leading-[1.5] text-[#282828] px-[15px]">Categoria</p>
          <div className="overflow-x-auto">
            <div className="flex gap-[8px] px-[15px] py-[11px]">
              {CAT_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleTypology(value)} className={chipMb(typologyFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stato */}
          <p className="text-[12px] leading-[1.5] text-[#282828] px-[15px]">Stato</p>
          <div className="overflow-x-auto">
            <div className="flex gap-[8px] px-[15px] py-[11px]">
              {STATO_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleStato(value)} className={chipMb(statoFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters summary */}
          <div className="flex items-center justify-between px-[15px] min-h-[22px] pb-[8px]">
            <p className="text-[12px] leading-[22px] text-[#282828]">
              <span>Filtra per: </span>
              {hasFilters && <span className="text-[#d9d9d9]">{activeLabel}</span>}
            </p>
            {hasFilters && (
              <button onClick={reset} className="flex items-center gap-[6px] text-[12px] leading-[22px] text-[#282828]">
                Reset
                <Image src="/assets/icon-reset.svg" alt="" width={10} height={8} />
              </button>
            )}
          </div>
        </div>

        {/* ── Tablet filter (Area full row, Categoria|Stato 2-col) ────── */}
        <div className="hidden md:block lg:hidden page-px pt-[16px] pb-[10px]">
          {/* Row 1: Area */}
          <p className="text-[12px] leading-[22px] text-[#282828] mb-[4px]">Area</p>
          <div className="flex flex-wrap gap-[8px] mb-[12px]">
            <button onClick={() => setTypologyFilters(new Set())} className={chipDt(typologyFilters.size === 0)}>
              Tutti i progetti
            </button>
            {AREA_FILTERS.slice(1).map(({ label, value }) => (
              <button key={value} onClick={() => toggleTypology(value as Typology)} className={chipDt(typologyFilters.has(value as Typology))}>
                {label}
              </button>
            ))}
          </div>
          {/* Row 2: Categoria | Stato side-by-side */}
          <div className="grid grid-cols-2 gap-[14px] mb-[4px]">
            <p className="text-[12px] leading-[22px] text-[#282828]">Categoria</p>
            <p className="text-[12px] leading-[22px] text-[#282828]">Stato</p>
          </div>
          <div className="grid grid-cols-2 gap-[14px]">
            <div className="flex flex-wrap gap-[8px]">
              {CAT_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleTypology(value)} className={chipDt(typologyFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {STATO_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleStato(value)} className={chipDt(statoFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-[10px] min-h-[22px]">
            <p className="text-[12px] leading-[22px] text-[#282828]">
              <span>Filtra per: </span>
              {hasFilters && <span className="text-[#d9d9d9]">{activeLabel}</span>}
            </p>
            {hasFilters && (
              <button onClick={reset} className="flex items-center gap-[6px] text-[12px] leading-[22px] text-[#282828] hover:opacity-50 transition-opacity">
                Reset
                <Image src="/assets/icon-reset.svg" alt="" width={10} height={8} />
              </button>
            )}
          </div>
        </div>

        {/* ── Desktop filter (3-col grid) ────────────────────────────── */}
        <div className="hidden lg:block page-px pt-[16px] pb-[10px]">
          <div className="grid grid-cols-3 gap-[14px] mb-[4px]">
            <p className="text-[12px] leading-[22px] text-[#282828]">Area</p>
            <p className="text-[12px] leading-[22px] text-[#282828]">Categoria</p>
            <p className="text-[12px] leading-[22px] text-[#282828]">Stato</p>
          </div>
          <div className="grid grid-cols-3 gap-[14px]">
            <div className="flex flex-wrap gap-[8px]">
              <button onClick={() => setTypologyFilters(new Set())} className={chipDt(typologyFilters.size === 0)}>
                Tutti i progetti
              </button>
              {AREA_FILTERS.slice(1).map(({ label, value }) => (
                <button key={value} onClick={() => toggleTypology(value as Typology)} className={chipDt(typologyFilters.has(value as Typology))}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {CAT_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleTypology(value)} className={chipDt(typologyFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {STATO_FILTERS.map(({ label, value }) => (
                <button key={value} onClick={() => toggleStato(value)} className={chipDt(statoFilters.has(value))}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-[10px] min-h-[22px]">
            <p className="text-[12px] leading-[22px] text-[#282828]">
              <span>Filtra per: </span>
              {hasFilters && <span className="text-[#d9d9d9]">{activeLabel}</span>}
            </p>
            {hasFilters && (
              <button onClick={reset} className="flex items-center gap-[6px] text-[12px] leading-[22px] text-[#282828] hover:opacity-50 transition-opacity">
                Reset
                <Image src="/assets/icon-reset.svg" alt="" width={10} height={8} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Projects content ───────────────────────────────────────── */}
      <div className="pb-16">

        {/* View toggle */}
        <div className="page-px flex items-baseline justify-between py-[8px] mb-[21px]">
          <p className={`hidden md:block text-[24px] font-bold leading-normal text-black ${view === "grid" ? "invisible" : ""}`}>
            Yas-arch progetti index
          </p>
          <button
            onClick={() => setView(v => v === "grid" ? "index" : "grid")}
            className="ml-auto text-[16px] md:text-[17.5px] leading-[1.5] text-[#282828] hover:opacity-60 transition-opacity"
          >
            {view === "grid" ? "Visualizza come index" : "Visualizza come griglia"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="page-px text-[12px] text-[#282828]/40 py-16 text-center">Nessun progetto trovato.</p>
        ) : view === "grid" ? (
          <div className="px-4 md:px-[30px]">
            <GridView largeRows={largeRows} small={small} />
          </div>
        ) : (
          <div className="px-4 md:px-[30px]">
            <IndexView
              projects={filtered}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              hoveredProject={hoveredProject}
            />
          </div>
        )}
      </div>

      {/* ── Projects slider ────────────────────────────────────────── */}
      <ProjectsSlider projects={projects} />

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div className="page-px pb-16 flex justify-center md:justify-end">
        <Link
          href="/contatti"
          className="flex items-center justify-center w-full md:w-auto border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
        >
          Contattaci per un progetto
        </Link>
      </div>
    </div>
  );
}

/* ── Grid view ───────────────────────────────────────────────────── */

function GridView({ largeRows, small }: { largeRows: Project[][]; small: Project[] }) {
  return (
    <div className="flex flex-col gap-y-[26px] md:gap-y-[38px]">
      {/* Featured: 1 col mobile, 2 col desktop */}
      {largeRows.map((row, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-x-[15px] gap-y-[26px] md:gap-y-[38px]">
          {row.map((p) => <ProjectCard key={p._id} project={p} size="large" />)}
        </div>
      ))}
      {/* Others: 1 col mobile, 2 col tablet, 3 col desktop, 4 su schermi molto larghi (2xl, 1536px+) */}
      {small.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-[15px] gap-y-[26px] md:gap-y-[38px]">
          {small.map((p) => <ProjectCard key={p._id} project={p} size="small" />)}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project: p, size }: { project: Project; size: "large" | "small" }) {
  // Aspect ratio al posto di altezze fisse: le card scalano in proporzione
  // alla larghezza colonna a qualsiasi viewport (stessi rapporti del design
  // ai riferimenti 375/768/1440).
  const imgAspect = size === "large"
    ? "aspect-[345/256] md:aspect-[339/280] lg:aspect-[683/484]"
    : "aspect-[345/256] md:aspect-[339/280] lg:aspect-[450/335]";
  return (
    <Link href={`/progetti/${p.slug.current}`} className="block group">
      <div className={`relative ${imgAspect} overflow-hidden mb-[6px]`}>
        {p.coverImageUrl ? (
          <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>
      {/* Una riga, troncata con ellissi: chip allineato tra le card della
          griglia indipendentemente dalla lunghezza del titolo */}
      <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-[4px] truncate">
        {p.title}{p.location ? `, ${p.location}` : ""}
      </p>
      <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4]">
        {p.typology ?? "Residenziale"}
      </span>
    </Link>
  );
}

/* ── Index view ──────────────────────────────────────────────────── */

function IndexView({
  projects, hoveredId, onHover, hoveredProject,
}: {
  projects: Project[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  hoveredProject: Project | null;
}) {
  const [inTable,   setInTable]   = useState(false);
  const [mousePos,  setMousePos]  = useState({ x: -400, y: -400 });

  const handleMouseMove  = (e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
  const handleTableLeave = () => { setInTable(false); onHover(null); };

  const cols = [
    { label: "Progetto",  cls: "w-[34%]" },
    { label: "Location",  cls: "w-[25%]" },
    { label: "Stato",     cls: "w-[17%]" },
    { label: "Anno",      cls: "w-[9%]"  },
    { label: "Mq",        cls: "w-[8%]"  },
    { label: "Categoria", cls: "w-[7%]"  },
  ];

  return (
    <>
      {/* ── Mobile index rows ───────────────────────────────────── */}
      <div className="md:hidden -mx-4">
        {projects.map((p) => (
          <Link
            key={p._id}
            href={`/progetti/${p.slug.current}`}
            className="block border-b border-black"
          >
            <div className="flex px-[15px] py-[18px] gap-[8px]">
              {/* Left: location, title, typology desc, status */}
              <div className="flex-1 min-w-0">
                {p.location && (
                  <p className="text-[12px] text-[#282828] leading-[1.5]">{p.location}</p>
                )}
                <p className="text-[24px] text-[#282828] leading-[1.3] mt-[0]">{p.title}</p>
                {p.typology && (
                  <p className="text-[12px] text-[#282828]/70 leading-[1.5]">{p.typology}</p>
                )}
                <p className="text-[12px] text-[#282828] leading-[1.5]">{p.status}</p>
              </div>
              {/* Right: year top, typology chip bottom */}
              <div className="flex flex-col justify-between items-end shrink-0 pt-[0]">
                {p.year && (
                  <p className="text-[24px] text-[#282828] leading-[1.3]">{p.year}</p>
                )}
                <span className="inline-flex items-center border border-[#333] rounded-[100px] px-[10px] py-[3px] text-[9.44px] text-[#333] leading-[1.4] whitespace-nowrap">
                  {p.typology}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Desktop index table ─────────────────────────────────── */}
      <div className="hidden md:block relative">
        <table
          className="w-full"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setInTable(true)}
          onMouseLeave={handleTableLeave}
        >
          <thead>
            <tr className="border-b border-black">
              {cols.map(({ label, cls }) => (
                <th key={label} className={`text-left text-[12px] leading-[1.5] text-[#282828] font-normal pb-[12px] ${cls}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} onMouseEnter={() => onHover(p._id)} onMouseLeave={() => onHover(null)} className="border-b border-black">
                <td className="py-[20px] pr-6">
                  <Link href={`/progetti/${p.slug.current}`} className="block">
                    <p className="text-[17.5px] md:text-[24px] lg:text-[17.5px] leading-[1.5] text-[#282828]">{p.title}</p>
                    {p.location && <p className="text-[12px] leading-[1.5] text-[#282828]/60">{p.location}</p>}
                  </Link>
                </td>
                <td className="py-[20px] pr-6 text-[14px] md:text-[16px] leading-[1.5] text-[#282828]">{p.location ?? "—"}</td>
                <td className="py-[20px] pr-6 text-[14px] md:text-[16px] leading-[1.5] text-[#282828]">{p.status ?? "—"}</td>
                <td className="py-[20px] pr-6 text-[14px] md:text-[16px] leading-[1.5] text-[#282828]">{p.year ?? "—"}</td>
                <td className="py-[20px] pr-6 text-[14px] md:text-[16px] leading-[1.5] text-[#282828]">{p.area ?? "—"}</td>
                <td className="py-[20px]">
                  <span className="inline-flex items-center border border-[#333] rounded-[100px] px-[10px] py-[3px] text-[11px] text-[#333] leading-[1.4] whitespace-nowrap">
                    {p.typology}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Anteprima immagine — segue il mouse */}
        <div
          className="fixed w-[220px] h-[280px] pointer-events-none z-30"
          style={{
            top: 0, left: 0,
            opacity: hoveredProject && inTable ? 1 : 0,
            transform: `translate(${mousePos.x + 24}px, ${Math.max(210, mousePos.y - 260)}px)`,
            transition: "opacity 200ms ease, transform 80ms ease-out",
          }}
        >
          {(hoveredProject?.hoverImageUrl ?? hoveredProject?.coverImageUrl) ? (
            <Image src={(hoveredProject!.hoverImageUrl ?? hoveredProject!.coverImageUrl)!} alt={hoveredProject!.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>
      </div>
    </>
  );
}
