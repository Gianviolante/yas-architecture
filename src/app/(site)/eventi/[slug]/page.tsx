import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { eventBySlugQuery } from "@/lib/sanity/queries";
import type { Event } from "@/lib/sanity/types";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(eventBySlugQuery, { slug });
  return { title: event ? `${event.title} — YAS Architecture` : "Evento" };
}

export default async function EventoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event: Event | null = await sanityClient.fetch(eventBySlugQuery, { slug });

  if (!event) notFound();

  const gallery = event.gallery ?? [];

  // Format date — e.g. "12 marzo 2024"
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white">

      {/* ── Hero image ─────────────────────────────────────────────── */}
      <div className="relative mx-[15px] mt-[74px]" style={{ height: "752px" }}>
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>

      {/* ── Intro description ──────────────────────────────────────── */}
      <div className="page-px pt-[32px] pb-[8px]">
        {event.description ? (
          <div className="text-[24px] leading-normal text-[#282828]">
            <PortableText
              value={event.description as Parameters<typeof PortableText>[0]["value"]}
              components={{
                block: {
                  normal: ({ children }) => <p className="mb-[0.75em]">{children}</p>,
                },
              }}
            />
          </div>
        ) : (
          <p className="text-[24px] leading-normal text-[#d9d9d9]">
            Descrizione introduttiva non disponibile.
          </p>
        )}
      </div>

      {/* ── Meta + body ────────────────────────────────────────────── */}
      <div className="flex gap-x-[32px] page-px pt-[24px] pb-[48px]">

        {/* Left: meta info */}
        <div className="shrink-0" style={{ width: "577px" }}>
          <div className="text-[12px] leading-[1.5] text-[#282828] space-y-[4px]">
            {event.typology && (
              <p>
                <span className="text-[#9d9d9d]">Tipologia: </span>
                {event.typology}
              </p>
            )}
            {event.area && (
              <p>
                <span className="text-[#9d9d9d]">Area: </span>
                {event.area}
              </p>
            )}
            {event.timeline && (
              <p>
                <span className="text-[#9d9d9d]">Timeline: </span>
                {event.timeline}
              </p>
            )}
            {event.location && (
              <p>
                <span className="text-[#9d9d9d]">Location: </span>
                {event.location}
              </p>
            )}
            {formattedDate && (
              <p>
                <span className="text-[#9d9d9d]">Data: </span>
                {formattedDate}
              </p>
            )}
            {event.type && (
              <p>
                <span className="text-[#9d9d9d]">Tipo: </span>
                {event.type}
              </p>
            )}
          </div>
        </div>

        {/* Right: body text */}
        <div className="flex-1 text-[17.4px] leading-[1.2] text-[#282828]">
          {event.body ? (
            <PortableText
              value={event.body as Parameters<typeof PortableText>[0]["value"]}
              components={{
                block: {
                  normal: ({ children }) => <p className="mb-[1em]">{children}</p>,
                },
              }}
            />
          ) : (
            <p className="text-[#d9d9d9]">Contenuto non disponibile.</p>
          )}
        </div>
      </div>

      {/* ── Gallery: two side-by-side images ───────────────────────── */}
      {gallery.length > 0 && (
        <div
          className="flex gap-[12px] pb-[60px]"
          style={{ paddingLeft: "253px", paddingRight: "15px" }}
        >
          {gallery.slice(0, 2).map((img, i) => (
            <div
              key={i}
              className="relative shrink-0"
              style={{ width: "579px", height: "632px" }}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.caption ?? `${event.title} — foto ${i + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#d9d9d9]" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div className="page-px pb-[60px]">
        <Link
          href="/eventi"
          className="inline-flex items-center gap-[8px] border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
        >
          ← News ed Eventi
        </Link>
      </div>

    </div>
  );
}
