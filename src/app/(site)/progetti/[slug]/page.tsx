import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { projectBySlugQuery, allProjectsQuery } from "@/lib/sanity/queries";
import type { Project, SanityImage } from "@/lib/sanity/types";
import GallerySection from "@/components/sections/GallerySection";
import ProjectsSlider from "@/components/sections/ProjectsSlider";

export const revalidate = 60;

const builder = imageUrlBuilder(sanityClient);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project | null = await sanityClient.fetch(projectBySlugQuery, { slug });
  return { title: project ? `${project.title} — YAS Architecture` : "Progetto" };
}

export default async function ProgettoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects]: [Project | null, Project[]] = await Promise.all([
    sanityClient.fetch(projectBySlugQuery, { slug }),
    sanityClient.fetch(allProjectsQuery),
  ]);

  if (!project) notFound();

  const otherProjects = allProjects.filter((p) => p.slug.current !== slug);

  const heroUrl = project.heroImage ? urlFor(project.heroImage).width(1440).url() : null;

  // Gallery: first image → full-bleed block, rest → slider
  // L'aspect ratio è codificato nell'asset _ref ("...-6732x4490-jpg"):
  // serve a non croppare le foto verticali nel blocco orizzontale.
  const parseAspect = (img: SanityImage): number | null => {
    const m = img.asset?._ref?.match(/-(\d+)x(\d+)-/);
    return m ? Number(m[1]) / Number(m[2]) : null;
  };
  const galleryItems = (project.gallery ?? []).map((img: SanityImage) => ({
    url: urlFor(img).width(1200).url(),
    caption: img.caption,
    aspect: parseAspect(img),
  }));
  const [secondImage, ...sliderItems] = galleryItems;
  const secondIsPortrait = secondImage?.aspect != null && secondImage.aspect < 1;

  const ptComponents = {
    block: { normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-[1em]">{children}</p> },
  };

  return (
    <div className="bg-white">

      {/* ── Hero image ─────────────────────────────────────────────── */}
      {/* aspect-ratio invece di altezze fisse per breakpoint: cosí il
          rapporto resta costante a qualsiasi larghezza (prima diventava
          molto più larga/bassa sui monitor ultra-wide perché la larghezza
          cresceva ma l'altezza restava fissa). */}
      <div className="relative mx-4 md:mx-[30px] mt-[60px] md:mt-[72px] aspect-[16/9] overflow-hidden">
        {heroUrl ? (
          <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      {/* Mobile: just the title */}
      {/* Testo: torna a page-px (cap 1440px) — a piena larghezza il blocco
          meta+descrizione lasciava un vuoto enorme a destra (la descrizione
          ha un max-width fisso), le immagini invece restano piena larghezza. */}
      <div className="md:hidden page-px pt-[14px]">
        <h1 className="text-[48px] font-bold tracking-tight leading-[1.3] text-[#282828]">
          {project.title}
        </h1>
      </div>

      {/* Desktop: title + back link */}
      <div className="hidden md:flex items-start justify-between page-px pt-[20px]">
        <h1
          className="font-bold tracking-tight leading-[1.3] text-[#282828]"
          style={{ fontSize: "clamp(60px, 14.4vw, 120px)" }}
        >
          {project.title}
        </h1>
        <Link
          href="/progetti"
          className="text-[12px] leading-[1.3] text-[#282828] hover:opacity-60 transition-opacity whitespace-nowrap mt-[16px] shrink-0"
        >
          Torna a progetti →
        </Link>
      </div>

      {/* ── Meta + description + chips ─────────────────────────────── */}
      {/*
          DOM order: [meta] [description] [mobile-chips]
          Mobile (flex-col): meta → description → chips ✓
          Desktop (flex-row lg): left(meta+chips) | right(description) ✓
      */}
      <div className="flex flex-col md:flex-row gap-x-[32px] page-px pt-[16px] md:pt-[24px] pb-[24px] md:pb-[40px]">

        {/* LEFT: meta lines + (tablet/desktop) column labels + chips + team */}
        <div className="w-full md:w-1/3 md:shrink-0 lg:w-[577px]">
          <div className="text-[12px] leading-[1.3] text-[#282828] space-y-[4px]">
            {project.typology    && <p>Area: {project.typology}</p>}
            {project.year        && <p>Timeline: {project.year}</p>}
            {project.location    && <p>Location: {project.location}</p>}
            {project.area        && <p>Superficie: {project.area} mq</p>}
            {project.concept     && <p>Concept: {project.concept}</p>}
            {project.projectTeam && <p>Progetto: {project.projectTeam}</p>}
            {project.rendering   && <p>Rendering: {project.rendering}</p>}
            {project.photographer && <p>Fotografo: {project.photographer}</p>}
          </div>

          {/* Desktop only: column labels + chips + team */}
          <div className="hidden md:block">
            <div className="flex gap-[8px] mt-[24px]">
              {/* Area column */}
              <div className="flex flex-col gap-[6px]">
                <p className="text-[12px] leading-[1.3] text-[#282828]">Area</p>
                <span className="inline-flex items-center border-[1.179px] border-[#333] rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-[#333] leading-[1.4] whitespace-nowrap">
                  {project.typology}
                </span>
              </div>
              {/* Stato column */}
              <div className="flex flex-col gap-[6px]">
                <p className="text-[12px] leading-[1.3] text-[#282828]">Stato</p>
                <span className="inline-flex items-center border-[1.179px] border-[#333] rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-[#333] leading-[1.4] whitespace-nowrap">
                  {project.status}
                </span>
              </div>
            </div>
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="mt-[24px]">
                <p className="text-[12px] leading-[1.3] text-[#282828] mb-[6px]">Team</p>
                <div className="flex flex-wrap gap-[8px]">
                  {project.teamMembers.map((m) => (
                    <span key={m._id} className="text-[12px] leading-[1.3] text-[#282828]/60">{m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: description */}
        <div
          className="flex-1 text-[16px] md:text-[17.4px] leading-[1.4] md:leading-[1.2] text-[#282828] mt-[16px] md:mt-0"
          style={{ maxWidth: "798px" }}
        >
          {project.description ? (
            <PortableText value={project.description as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
          ) : (
            <p className="text-[#d9d9d9]">Nessuna descrizione disponibile.</p>
          )}
        </div>

        {/* MOBILE ONLY: chips below description */}
        <div className="md:hidden mt-[20px]">
          <div className="flex gap-[8px] mb-[8px]">
            <p className="text-[12px] leading-[1.3] text-[#282828] w-[94px]">Area</p>
            <p className="text-[12px] leading-[1.3] text-[#282828]">Stato</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="inline-flex items-center border-[1.179px] border-[#333] rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-[#333] leading-[1.4] whitespace-nowrap">
              {project.typology}
            </span>
            <span className="inline-flex items-center border-[1.179px] border-[#333] rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-[#333] leading-[1.4] whitespace-nowrap">
              {project.status}
            </span>
          </div>
        </div>

      </div>

      {/* ── Two square images (Groppi-style) ──────────────────────── */}
      {galleryItems.length >= 2 && (
        <div className="mx-4 md:mx-[30px] gap-[16px] md:gap-[24px] grid grid-cols-2 mt-[48px]">
          {galleryItems.slice(0, 2).map((img, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden bg-[#d9d9d9]">
              <Image
                src={img.url}
                alt={img.caption ?? `${project.title} — ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Gallery slider ─────────────────────────────────────────── */}
      {galleryItems.length > 2 && (
        <GallerySection items={galleryItems.slice(2)} projectTitle={project.title} />
      )}

      {/* ── Divider bar ────────────────────────────────────────────── */}
      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)] mt-[48px]" />

      {/* ── Other projects slider ──────────────────────────────────── */}
      {otherProjects.length > 0 && (
        <div className="pt-[32px]">
          <ProjectsSlider projects={otherProjects} />
        </div>
      )}

      {/* ── Vai a tutti i progetti ─────────────────────────────────── */}
      <div className="page-px pb-12 pt-4 md:pt-0 md:flex md:justify-center">
        <Link
          href="/progetti"
          className="flex items-center justify-center w-full md:w-auto border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
        >
          Vai a tutti i progetti
        </Link>
      </div>

    </div>
  );
}
