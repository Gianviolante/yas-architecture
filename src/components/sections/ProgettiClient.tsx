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
  { label: "In corso",        value: "In corso" },
  { label: "In approvazione", value: "In approvazione" },
  { label: "Realizzato",      value: "Realizzato" },
];

interface Props { projects: Project[]; }

export default function ProgettiClient({ projects }: Props) {
  const [view,             setView]             = useState<"grid" | "index">("grid");
  const [typologyFilters,  setTypologyFilters]  = useState<Set<Typology>>(new Set());
  const [statoFilters,     setStatoFilters]     = useState<Set<ProjectStatus>>(new Set());
  const [hoveredId,        setHoveredId]        = useState<string | null>(null);

  const filtered = useMemo(() => projects.filter((p) => {
    const matchType  = typologyFilters.size === 0 || typologyFilters.has(p.typology);
    const matchStato = statoFilters.size    === 0 || statoFilters.has(p.status);
    return matchType && matchStato;
  }), [projects, typologyFilters, statoFilters]);

  const hasFilters = typologyFilters.size > 0 || statoFilters.size > 0;

  const activeLabel = [
    ...[...typologyFilters].map(t =>
      [...AREA_FILTERS, ...CAT_FILTERS].find(f => f.value === t)?.label.toLowerCase() ?? t.toLowerCase()
    ),
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

  // Split large into rows of 2 for correct row-gap between each pair
  const largeRows: Project[][] = [];
  for (let i = 0; i < large.length; i += 2) largeRows.push(large.slice(i, i + 2));

  const hoveredProject = hoveredId ? projects.find(p => p._id === hoveredId) ?? null : null;

  const chip = (active: boolean) =>
    `inline-flex items-center border-2 rounded-[100px] px-[16px] py-[7px] text-[12px] leading-[1.4] whitespace-nowrap transition-colors duration-200 cursor-pointer ${
      active
        ? "bg-black border-black text-white"
        : "border-[#333] text-[#333] hover:bg-black hover:border-black hover:text-white"
    }`;

  return (
    <div className="pt-[53px]">

      {/* ── Intro text ─────────────────────────────────────────────── */}
      <div className="page-px pt-[37px] pb-[26px]">
        <p className="text-[24px] leading-normal text-black">
          I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità.
          Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la
          distinzione delle diverse categorie informative e indirizzando lo spostamento dell&apos;occhio del lettore tra di esse.
        </p>
      </div>

      {/* ── Sticky filter bar ──────────────────────────────────────── */}
      <div className="sticky top-[53px] z-40 bg-white shadow-[0px_6px_4px_rgba(0,0,0,0.1)] page-px pt-[8px] pb-[10px]">

        {/* Labels */}
        <div className="grid grid-cols-3 gap-[14px] mb-[4px]">
          <p className="text-[12px] leading-[22px] text-[#282828]">Area</p>
          <p className="text-[12px] leading-[22px] text-[#282828]">Categoria</p>
          <p className="text-[12px] leading-[22px] text-[#282828]">Stato</p>
        </div>

        {/* Filter buttons */}
        <div className="grid grid-cols-3 gap-[14px]">
          <div className="flex flex-wrap gap-[8px]">
            {/* "Tutti" is active only when nothing is selected */}
            <button onClick={() => setTypologyFilters(new Set())} className={chip(typologyFilters.size === 0)}>
              Tutti i progetti
            </button>
            {AREA_FILTERS.slice(1).map(({ label, value }) => (
              <button key={value} onClick={() => toggleTypology(value as Typology)} className={chip(typologyFilters.has(value as Typology))}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {CAT_FILTERS.map(({ label, value }) => (
              <button key={value} onClick={() => toggleTypology(value)} className={chip(typologyFilters.has(value))}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {STATO_FILTERS.map(({ label, value }) => (
              <button key={value} onClick={() => toggleStato(value)} className={chip(statoFilters.has(value))}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter summary + Reset */}
        <div className="flex items-center justify-between mt-[10px] min-h-[22px]">
          <p className="text-[12px] leading-[22px] text-[#282828]">
            <span>Filtra per: </span>
            {hasFilters && (
              <span className="text-[#d9d9d9]">{activeLabel}</span>
            )}
          </p>
          {hasFilters && (
            <button onClick={reset} className="flex items-center gap-[6px] text-[12px] leading-[22px] text-[#282828] hover:opacity-50 transition-opacity">
              Reset
              <Image src="/assets/icon-reset.svg" alt="" width={10} height={8} />
            </button>
          )}
        </div>
      </div>

      {/* ── Projects content ───────────────────────────────────────── */}
      <div className="page-px pb-16">

        {/* View toggle */}
        <div className="flex items-baseline justify-between py-[8px] mb-[21px]">
          <p className={`text-[24px] font-bold leading-normal text-black ${view === "grid" ? "invisible" : ""}`}>
            Yas-arch progetti index
          </p>
          <button
            onClick={() => setView(v => v === "grid" ? "index" : "grid")}
            className="text-[17.5px] leading-[1.5] text-[#282828] hover:opacity-60 transition-opacity"
          >
            {view === "grid" ? "Visualizza come index" : "Visualizza come griglia"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="text-[12px] text-[#282828]/40 py-16 text-center">Nessun progetto trovato.</p>
        ) : view === "grid" ? (
          <GridView largeRows={largeRows} small={small} />
        ) : (
          <IndexView
            projects={filtered}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            hoveredProject={hoveredProject}
          />
        )}
      </div>

      {/* ── Projects slider ───────────────────────────────────────── */}
      <ProjectsSlider projects={projects} />

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div className="page-px pb-16 flex justify-end">
        <Link
          href="/contatti"
          className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
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
    <div className="flex flex-col gap-y-[38px]">
      {/* Large cards: 2 per row */}
      {largeRows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 gap-x-[15px]">
          {row.map((p) => <ProjectCard key={p._id} project={p} size="large" />)}
        </div>
      ))}

      {/* Small cards: 3 per row */}
      {small.length > 0 && (
        <div className="grid grid-cols-3 gap-x-[15px] gap-y-[38px]">
          {small.map((p) => <ProjectCard key={p._id} project={p} size="small" />)}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project: p, size }: { project: Project; size: "large" | "small" }) {
  const imgH = size === "large" ? "h-[484px]" : "h-[335px]";
  return (
    <Link href={`/progetti/${p.slug.current}`} className="block group">
      <div className={`relative ${imgH} overflow-hidden mb-[6px]`}>
        {p.coverImageUrl ? (
          <Image
            src={p.coverImageUrl}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>
      <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-[2px]">
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
  const [inTable, setInTable] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -400, y: -400 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleTableLeave = () => {
    setInTable(false);
    onHover(null);
  };

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
      <div className="relative">
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
              <tr
                key={p._id}
                onMouseEnter={() => onHover(p._id)}
                onMouseLeave={() => onHover(null)}
                className="border-b border-black"
              >
                {/* Progetto */}
                <td className="py-[20px] pr-6">
                  <Link href={`/progetti/${p.slug.current}`} className="block">
                    <p className="text-[17.5px] leading-[1.5] text-[#282828]">{p.title}</p>
                    {p.location && (
                      <p className="text-[12px] leading-[1.5] text-[#282828]/60">{p.location}</p>
                    )}
                  </Link>
                </td>
                {/* Location */}
                <td className="py-[20px] pr-6 text-[14px] leading-[1.5] text-[#282828]">
                  {p.location ?? "—"}
                </td>
                {/* Stato */}
                <td className="py-[20px] pr-6 text-[14px] leading-[1.5] text-[#282828]">
                  {p.status ?? "—"}
                </td>
                {/* Anno */}
                <td className="py-[20px] pr-6 text-[14px] leading-[1.5] text-[#282828]">
                  {p.year ?? "—"}
                </td>
                {/* Mq */}
                <td className="py-[20px] pr-6 text-[14px] leading-[1.5] text-[#282828]">
                  {p.area ?? "—"}
                </td>
                {/* Categoria */}
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
            top: 0,
            left: 0,
            opacity: hoveredProject && inTable ? 1 : 0,
            transform: `translate(${mousePos.x + 24}px, ${Math.max(210, mousePos.y - 260)}px)`,
            transition: "opacity 200ms ease, transform 80ms ease-out",
          }}
        >
          {hoveredProject?.coverImageUrl ? (
            <Image
              src={hoveredProject.coverImageUrl}
              alt={hoveredProject.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>
      </div>
    </>
  );
}
