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
  const galleryItems = (project.gallery ?? []).map((img: SanityImage) => ({
    url: urlFor(img).width(1200).url(),
    caption: img.caption,
  }));
  const [secondImage, ...sliderItems] = galleryItems;

  const ptComponents = {
    block: { normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-[1em]">{children}</p> },
  };

  return (
    <div className="bg-white">

      {/* ── Hero image ─────────────────────────────────────────────── */}
      <div className="relative mx-[15px] mt-[60px] md:mt-[74px] h-[245px] md:h-[752px] overflow-hidden">
        {heroUrl ? (
          <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
        {/* Counter overlaid — desktop only */}
        {galleryItems.length > 0 && (
          <p className="hidden md:block absolute bottom-[16px] right-[16px] text-[12px] leading-[1.5] text-white/70">
            1 / {galleryItems.length + 1}
          </p>
        )}
      </div>

      {/* Counter — mobile only, below hero */}
      {galleryItems.length > 0 && (
        <p className="md:hidden text-right text-[12px] leading-[1.5] text-[#282828] mx-[15px] mt-[6px]">
          1 / {galleryItems.length + 1}
        </p>
      )}

      {/* ── Title ──────────────────────────────────────────────────── */}
      {/* Mobile: just the title */}
      <div className="md:hidden page-px pt-[14px]">
        <h1 className="text-[48px] font-bold leading-[1.3] text-[#282828]">
          {project.title}
        </h1>
      </div>

      {/* Desktop: title + back link */}
      <div className="hidden md:flex items-start justify-between page-px pt-[20px]">
        <h1
          className="font-bold leading-[1.3] text-[#282828]"
          style={{ fontSize: "clamp(60px, 8.3vw, 120px)" }}
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
      <div className="flex flex-col lg:flex-row gap-x-[32px] page-px pt-[16px] md:pt-[24px] pb-[24px] md:pb-[40px]">

        {/* LEFT: meta lines + (desktop-only) column labels + chips + team */}
        <div className="w-full lg:w-[577px] lg:shrink-0">
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
            <div className="flex gap-[24px] mt-[24px] mb-[6px]">
              <p className="text-[12px] leading-[1.3] text-[#282828]">Area</p>
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
          className="flex-1 text-[16px] md:text-[17.4px] leading-[1.4] md:leading-[1.2] text-[#282828] mt-[16px] lg:mt-0"
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

      {/* ── Second full-width image ────────────────────────────────── */}
      <div className="relative mx-[15px] h-[245px] md:h-[718px]">
        {secondImage ? (
          <Image
            src={secondImage.url}
            alt={secondImage.caption ?? `${project.title} — interno`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>

      {/* ── Gallery slider ─────────────────────────────────────────── */}
      <GallerySection items={sliderItems} projectTitle={project.title} />

      {/* ── Divider bar ────────────────────────────────────────────── */}
      <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)] mt-[48px]" />

      {/* ── Other projects slider ──────────────────────────────────── */}
      {otherProjects.length > 0 && (
        <div className="pt-[32px]">
          <ProjectsSlider projects={otherProjects} />
        </div>
      )}

      {/* ── Vai a tutti i progetti ─────────────────────────────────── */}
      <div className="page-px pb-12 pt-4 md:pt-0">
        <Link
          href="/progetti"
          className="flex items-center justify-center w-full md:w-auto md:mx-auto border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
        >
          Vai a tutti i progetti
        </Link>
      </div>

    </div>
  );
}
