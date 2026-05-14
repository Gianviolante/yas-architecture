"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Project, Typology, ProjectStatus } from "@/lib/sanity/types";

const AREA_FILTERS: { label: string; value: Typology | "all" }[] = [
  { label: "Tutti i progetti", value: "all" },
  { label: "Architettura", value: "Architettura" },
  { label: "Interior Design", value: "Interior Design" },
  { label: "Residenziali", value: "Residenziale" },
  { label: "Commerciali", value: "Commerciale" },
  { label: "Altro", value: "Altro" },
];

const STATO_FILTERS: { label: string; value: ProjectStatus }[] = [
  { label: "In corso", value: "In corso" },
  { label: "In approvazione", value: "In approvazione" },
  { label: "Realizzato", value: "Realizzato" },
];

interface Props {
  projects: Project[];
}

export default function ProgettiClient({ projects }: Props) {
  const [view, setView] = useState<"grid" | "index">("grid");
  const [areaFilter, setAreaFilter] = useState<Typology | "all">("all");
  const [statoFilters, setStatoFilters] = useState<Set<ProjectStatus>>(new Set());
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchArea = areaFilter === "all" || p.typology === areaFilter;
      const matchStato = statoFilters.size === 0 || statoFilters.has(p.status);
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase());
      return matchArea && matchStato && matchSearch;
    });
  }, [projects, areaFilter, statoFilters, search]);

  const toggleStato = (s: ProjectStatus) => {
    setStatoFilters((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const hasFilters = areaFilter !== "all" || statoFilters.size > 0 || search !== "";

  const hoveredProject = hoveredId ? (projects.find((p) => p._id === hoveredId) ?? null) : null;

  return (
    <div className="pt-[53px]">
      {/* Intro text */}
      <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-8">
        <p className="text-sm text-black/70 max-w-3xl leading-relaxed">
          I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia,
          continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva,
          facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento dell&apos;occhio
          tra di esse.
        </p>
      </div>

      {/* Filter bar */}
      <div className="max-w-[1440px] mx-auto px-8 pb-6 space-y-3">
        <div className="flex flex-wrap gap-x-8 gap-y-3 items-start">
          {/* Area */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-black/40 uppercase tracking-widest">Area</span>
            <div className="flex flex-wrap gap-2">
              {AREA_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setAreaFilter(value)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full border transition-all duration-200",
                    areaFilter === value
                      ? "border-black bg-black text-white"
                      : "border-gray-light text-black/60 hover:border-black/40 hover:text-black"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stato */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-black/40 uppercase tracking-widest">Stato</span>
            <div className="flex flex-wrap gap-2">
              {STATO_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => toggleStato(value)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full border transition-all duration-200",
                    statoFilters.has(value)
                      ? "border-black bg-black text-white"
                      : "border-gray-light text-black/60 hover:border-black/40 hover:text-black"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search + reset + toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="text"
              placeholder="Filtra per: scrivi la regione dell'architettura"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs text-black/50 placeholder:text-black/30 border-b border-gray-light bg-transparent py-1.5 outline-none focus:border-black transition-colors w-72"
            />
            {hasFilters && (
              <button
                onClick={() => {
                  setAreaFilter("all");
                  setStatoFilters(new Set());
                  setSearch("");
                }}
                className="text-xs text-black/40 hover:text-black transition-colors"
              >
                ↺ Reset
              </button>
            )}
          </div>
          <button
            onClick={() => setView(view === "grid" ? "index" : "grid")}
            className="text-xs text-black/50 hover:text-black transition-colors whitespace-nowrap"
          >
            {view === "grid" ? "Visualizza come indice" : "Visualizza come griglia"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-8 pb-16">
        {filtered.length === 0 ? (
          <p className="text-sm text-black/40 py-16 text-center">Nessun progetto trovato.</p>
        ) : view === "grid" ? (
          <GridView projects={filtered} />
        ) : (
          <IndexView
            projects={filtered}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            hoveredProject={hoveredProject}
          />
        )}
      </div>

      {/* CTA */}
      <div className="max-w-[1440px] mx-auto px-8 pb-16 flex justify-center">
        <Link
          href="/contatti"
          className="text-sm px-8 py-3 rounded-full border border-black/30 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
        >
          Contattaci per un progetto
        </Link>
      </div>
    </div>
  );
}

/* ── Grid View ──────────────────────────────────────────────────── */

function GridView({ projects }: { projects: Project[] }) {
  return (
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
      {projects.map((p) => (
        <Link
          key={p._id}
          href={`/progetti/${p.slug.current}`}
          className="break-inside-avoid mb-4 block group"
        >
          <div className="overflow-hidden bg-gray-lightest">
            {p.coverImageUrl ? (
              <Image
                src={p.coverImageUrl}
                alt={p.title}
                width={600}
                height={400}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ height: "auto" }}
              />
            ) : (
              <div className="aspect-[4/3] bg-gray-lighter" />
            )}
          </div>
          <div className="mt-2 px-0.5">
            <p className="text-sm font-medium">{p.title}</p>
            <p className="text-xs text-black/50">{p.location}</p>
            <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full border border-gray-light text-black/50">
              {p.typology}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Index View ─────────────────────────────────────────────────── */

function IndexView({
  projects,
  hoveredId,
  onHover,
  hoveredProject,
}: {
  projects: Project[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  hoveredProject: Project | null;
}) {
  return (
    <div className="relative">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-base font-medium">Yas-arch progetti index</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-light">
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[35%]">Progetto</th>
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[20%]">Location</th>
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[15%]">Status</th>
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[8%]">Anno</th>
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[8%]">Mq</th>
            <th className="text-left text-xs text-black/40 font-normal pb-3 w-[14%]">Category</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p._id}
              onMouseEnter={() => onHover(p._id)}
              onMouseLeave={() => onHover(null)}
              className={cn(
                "border-b border-gray-light transition-colors duration-150 cursor-pointer",
                hoveredId === p._id ? "bg-gray-lightest" : "hover:bg-gray-lightest"
              )}
            >
              <td className="py-4 pr-4">
                <Link href={`/progetti/${p.slug.current}`} className="block">
                  <p className="font-medium">{p.title}</p>
                  {p.subtitle && <p className="text-xs text-black/40 mt-0.5">{p.subtitle}</p>}
                </Link>
              </td>
              <td className="py-4 pr-4 text-black/60">{p.location}</td>
              <td className="py-4 pr-4 text-black/60">{p.status}</td>
              <td className="py-4 pr-4 text-black/60">{p.year}</td>
              <td className="py-4 pr-4 text-black/60">{p.area ? `${p.area}` : "—"}</td>
              <td className="py-4">
                <span className="text-xs px-2.5 py-1 rounded-full border border-gray-light text-black/50">
                  {p.typology}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hover preview */}
      {hoveredProject?.coverImageUrl && (
        <div className="fixed right-12 top-1/2 -translate-y-1/2 w-64 pointer-events-none z-30 shadow-xl">
          <Image
            src={hoveredProject.coverImageUrl}
            alt={hoveredProject.title}
            width={256}
            height={192}
            className="w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
