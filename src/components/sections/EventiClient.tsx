"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Event, EventType } from "@/lib/sanity/types";

interface Props {
  events: Event[];
}

const FALLBACK_INTRO = `I benefici derivanti dall'utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento dell'occhio del lettore tra di esse.`;

const PLACEHOLDER_EVENTS = [
  { title: "Spazio Libero" },
  { title: "Museum of Dreamer" },
  { title: "Vertigo Film Fest" },
  { title: "Spazio Libero" },
  { title: "Museum of Dreamer" },
  { title: "Vertigo Film Fest" },
  { title: "Spazio Libero" },
  { title: "Museum of Dreamer" },
  { title: "Vertigo Film Fest" },
];

type Filter = EventType | null;

export default function EventiClient({ events }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>(null);

  const filtered = events.length > 0
    ? (activeFilter ? events.filter((e) => e.type === activeFilter) : events)
    : [];

  const displayed = filtered.length > 0 ? filtered : null;

  const filterLabel = activeFilter
    ? activeFilter.toLowerCase()
    : null;

  return (
    <div className="bg-white">

      {/* ── Section label ───────────────────────────────────────────── */}
      <div className="pt-[37px]">
        <p className="text-[16px] leading-normal text-black text-center mb-[26px]">
          Eventi
        </p>

        {/* Intro text */}
        <div className="page-px mb-[32px] text-[24px] leading-normal text-black">
          <p>{FALLBACK_INTRO}</p>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <div className="sticky top-[53px] z-40 bg-white shadow-[0px_6px_4px_rgba(0,0,0,0.1)] h-[144px]">
        <div className="page-px h-full flex flex-col justify-start">

          {/* Row 1 — Area label */}
          <p className="text-[12px] leading-[1.5] text-[#282828] pt-[8px]">Area</p>

          {/* Row 2 — Filter chips */}
          <div className="flex gap-[8px] mt-[8px]">
            {(["News", "Evento"] as EventType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                className={`inline-flex items-center border-2 rounded-[100px] px-[24px] py-[10px] text-[16px] leading-[22px] transition-colors duration-200 ${
                  activeFilter === type
                    ? "bg-black border-black text-white"
                    : "border-[#333] text-[#333] hover:bg-black hover:border-black hover:text-white"
                }`}
              >
                {type === "Evento" ? "Eventi" : type}
              </button>
            ))}
          </div>

          {/* Row 3 — Active filter status + reset */}
          <div className="flex items-center justify-between mt-[16px]">
            <p className="text-[12px] leading-[1.5] text-[#282828]">
              {filterLabel ? (
                <>
                  <span>Filtra per: </span>
                  <span className="text-[#d9d9d9]">{filterLabel}</span>
                </>
              ) : (
                <span className="text-[#d9d9d9]">Nessun filtro attivo</span>
              )}
            </p>
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="flex items-center gap-[4px] text-[12px] leading-[1.5] text-[#282828] hover:opacity-60 transition-opacity"
              >
                <span>↺</span>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Events grid ─────────────────────────────────────────────── */}
      <div className="page-px pt-[37px] pb-[60px]">
        <div className="grid grid-cols-3 gap-x-[15px] gap-y-[53px]">
          {displayed
            ? displayed.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            : PLACEHOLDER_EVENTS.map((p, i) => (
                <PlaceholderCard key={i} title={p.title} />
              ))}
        </div>

        {/* CTA */}
        <div className="flex justify-end mt-[80px]">
          <Link
            href="/contatti"
            className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
          >
            Contattaci per informazioni
          </Link>
        </div>
      </div>

    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const content = (
    <>
      <div className="relative w-full overflow-hidden mb-[7px]" style={{ height: "319px" }}>
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#d9d9d9]" />
        )}
      </div>
      <p className="text-[17.5px] leading-[1.5] text-[#282828]">{event.title}</p>
    </>
  );

  if (event.slug?.current) {
    return (
      <Link href={`/eventi/${event.slug.current}`} className="block group">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div>
      <div className="w-full bg-[#d9d9d9] mb-[7px]" style={{ height: "319px" }} />
      <p className="text-[17.5px] leading-[1.5] text-[#282828]">{title}</p>
    </div>
  );
}
