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

  const heroUrl = project.heroImage ? urlFor(project.heroImage).width(2880).auto('format').quality(100).url() : null;

  // Gallery: first image → full-bleed block, rest → slider
  // L'aspect ratio è codificato nell'asset _ref ("...-6732x4490-jpg"):
  // serve a non croppare le foto verticali nel blocco orizzontale.
  const parseAspect = (img: SanityImage): number | null => {
    const m = img.asset?._ref?.match(/-(\d+)x(\d+)-/);
    return m ? Number(m[1]) / Number(m[2]) : null;
  };
  const galleryItems = (project.gallery ?? []).map((img: SanityImage) => ({
    url: urlFor(img).width(2400).auto('format').quality(100).url(),
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

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="page-px pt-[74px] md:pt-[100px] lg:pt-[120px] pb-[16px]">
        <div className="h-[32px] md:h-auto flex items-center justify-start text-[12px] md:text-[14px] leading-none text-black tracking-wide uppercase">
          <Link href="/progetti" className="font-light hover:opacity-60 transition-opacity">Progetti</Link>
          <span className="mx-[8px] font-light">–</span>
          <span className="font-medium">{project.title}</span>
        </div>
      </div>

      {/* ── Hero image ─────────────────────────────────────────────── */}
      {/* Mobile: aspect-square fullwidth | Desktop: aspect-[16/9] with margins */}
      <div className="relative md:mx-[30px] md:mt-0 overflow-hidden">
        {/* Mobile fullwidth square */}
        <div className="md:hidden relative w-full aspect-square bg-[#d9d9d9]">
          {heroUrl ? (
            <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>

        {/* Desktop: standard aspect-[16/9] with margins */}
        <div className="hidden md:block relative aspect-[16/9]">
          {heroUrl ? (
            <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      {/* Mobile: just the title */}
      {/* Testo: torna a page-px (cap 1440px) — a piena larghezza il blocco
          meta+descrizione lasciava un vuoto enorme a destra (la descrizione
          ha un max-width fisso), le immagini invece restano piena larghezza. */}
      <div className="md:hidden page-px pt-[14px]">
        <h1 className="text-[48px] font-bold tracking-tight leading-[1.3] text-black">
          {project.title}
        </h1>
      </div>

      {/* Desktop: title + back link */}
      <div className="hidden md:flex items-start justify-between page-px pt-[20px]">
        <h1
          className="font-bold tracking-tight leading-[1.3] text-black"
          style={{ fontSize: "clamp(60px, 14.4vw, 120px)" }}
        >
          {project.title}
        </h1>
        <Link
          href="/progetti"
          className="text-[12px] leading-[1.3] text-black hover:opacity-60 transition-opacity whitespace-nowrap mt-[16px] shrink-0"
        >
          Torna a progetti →
        </Link>
      </div>

      {/* ── Meta + description + chips ─────────────────────────────── */}
      {/* Regular grid: mobile 1-col, desktop 2-col equal width */}
      {/* Row 1: Info Panel | Description (aligned columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[24px] page-px pt-[16px] md:pt-[24px] pb-[24px] md:pb-[40px]">

        {/* LEFT (Col 1): meta lines + (tablet/desktop) column labels + chips + team */}
        <div>
          <div className="text-[12px] leading-[1.3] text-black space-y-[4px]">
            {project.typology    && <p><strong>Area:</strong> {project.typology}</p>}
            {project.year        && <p><strong>Timeline:</strong> {project.year}</p>}
            {project.location    && <p><strong>Location:</strong> {project.location}</p>}
            {project.area        && <p><strong>Superficie:</strong> {project.area} mq</p>}
            {project.concept     && <p><strong>Concept:</strong> {project.concept}</p>}
            {project.projectTeam && <p><strong>Progetto:</strong> {project.projectTeam}</p>}
            {project.rendering   && <p><strong>Rendering:</strong> {project.rendering}</p>}
            {project.photographer && <p><strong>Fotografo:</strong> {project.photographer}</p>}
          </div>

          {/* Desktop only: column labels + chips + team */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-[8px] mt-[24px] w-fit">
              {/* Area column */}
              <div className="flex flex-col gap-[6px]">
                <p className="text-[12px] leading-[1.3] text-black">Area</p>
                <div className="flex flex-wrap gap-[8px]">
                  {project.typology?.map((type) => (
                    <span key={type} className="inline-flex items-center border-[1.179px] border-black rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-black leading-[1.4] whitespace-nowrap">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              {/* Stato column */}
              <div className="flex flex-col gap-[6px]">
                <p className="text-[12px] leading-[1.3] text-black">Stato</p>
                <div className="flex flex-wrap gap-[8px]">
                  <span className="inline-flex items-center border-[1.179px] border-black rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-black leading-[1.4] whitespace-nowrap">
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="mt-[24px]">
                <p className="text-[12px] leading-[1.3] text-black mb-[6px]">Team</p>
                <div className="flex flex-wrap gap-[8px]">
                  {project.teamMembers.map((m) => (
                    <span key={m._id} className="text-[12px] leading-[1.3] text-black/60">{m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT (Col 2): description + condividi */}
        <div>
          <div className="text-[16px] md:text-[17.4px] leading-[1.4] md:leading-[1.2] text-black">
            {project.description ? (
              <PortableText value={project.description as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            ) : (
              <p className="text-[#d9d9d9]">Nessuna descrizione disponibile.</p>
            )}
          </div>
          {/* Desktop: Condividi below description */}
          <div className="hidden md:flex items-center gap-[12px] pt-[32px]">
            <p className="text-[12px] font-semibold leading-[1.3] text-black">Condividi</p>
            <div className="flex gap-[12px]">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Condividi su Facebook"
                className="text-[16px] font-bold text-black hover:opacity-60 transition-opacity"
              >
                f
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Condividi su LinkedIn"
                className="text-[16px] font-bold text-black hover:opacity-60 transition-opacity"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: chips stack below description (Col 1-2) */}
        <div className="md:hidden col-span-1">
          <div className="mb-[16px]">
            <p className="text-[12px] leading-[1.3] text-black mb-[8px]">Area</p>
            <div className="flex flex-wrap gap-[8px]">
              {project.typology?.map((type) => (
                <span key={type} className="inline-flex items-center border-[1.179px] border-black rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-black leading-[1.4] whitespace-nowrap">
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] leading-[1.3] text-black mb-[8px]">Stato</p>
            <div className="flex flex-wrap gap-[8px]">
              <span className="inline-flex items-center border-[1.179px] border-black rounded-[100px] px-[14px] py-[6px] text-[9.44px] text-black leading-[1.4] whitespace-nowrap">
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Condividi (Share) - mobile only (desktop version is inside description) */}
        <div className="col-span-1 md:hidden">
          <div className="flex items-center gap-[12px] pt-[24px] md:pt-[32px]">
            <p className="text-[12px] font-semibold leading-[1.3] text-black">Condividi</p>
            <div className="flex gap-[12px]">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Condividi su Facebook"
                className="text-[16px] font-bold text-black hover:opacity-60 transition-opacity"
              >
                f
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Condividi su LinkedIn"
                className="text-[16px] font-bold text-black hover:opacity-60 transition-opacity"
              >
                in
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Gallery slider (includes two square images on mobile) ────── */}
      {galleryItems.length > 0 && (
        <GallerySection
          items={galleryItems.slice(2)}
          projectTitle={project.title}
          allGalleryItems={galleryItems}
        />
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
          className="flex items-center justify-center w-full md:w-auto border-2 border-black rounded-[100px] px-[24px] py-[10px] text-[16px] text-black leading-[22px] hover:bg-black hover:text-white transition-colors duration-200"
        >
          Vai a tutti i progetti
        </Link>
      </div>

    </div>
  );
}
