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

export default async function ProgettoPageV2({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects]: [Project | null, Project[]] = await Promise.all([
    sanityClient.fetch(projectBySlugQuery, { slug }),
    sanityClient.fetch(allProjectsQuery),
  ]);

  if (!project) notFound();

  const otherProjects = allProjects.filter((p) => p.slug.current !== slug);

  const heroUrl = project.heroImage ? urlFor(project.heroImage).width(1440).url() : null;

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

      {/* ── Hero image (1:1 square - Groppi style) ──────────────────── */}
      <div className="relative mx-4 md:mx-[30px] mt-[60px] md:mt-[72px] aspect-square overflow-hidden">
        {heroUrl ? (
          <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]" />
        )}
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      <div className="md:hidden page-px pt-[14px]">
        <h1 className="text-[48px] font-bold tracking-tight leading-[1.3] text-[#282828]">
          {project.title}
        </h1>
      </div>

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

      {/* ── Meta Information (Groppi-style: labeled rows) ──────────── */}
      {/* Mobile: full-width list */}
      {/* Desktop: left column narrow, right column content */}
      <div className="page-px pt-[16px] md:pt-[24px] pb-[24px] md:pb-[40px]">
        <div className="space-y-[8px] md:space-y-[12px]">
          {project.typology && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Area</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.typology}</p>
            </div>
          )}
          {project.year && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Timeline</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.year}</p>
            </div>
          )}
          {project.location && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Location</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.location}</p>
            </div>
          )}
          {project.area && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Superficie</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.area} mq</p>
            </div>
          )}
          {project.concept && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Concept</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.concept}</p>
            </div>
          )}
          {project.projectTeam && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Progetto</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.projectTeam}</p>
            </div>
          )}
          {project.rendering && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Rendering</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.rendering}</p>
            </div>
          )}
          {project.photographer && (
            <div className="flex flex-col md:flex-row md:gap-[40px]">
              <p className="text-[12px] leading-[1.3] text-[#282828] font-semibold md:w-[140px] md:flex-shrink-0">Fotografo</p>
              <p className="text-[12px] leading-[1.3] text-[#282828]">{project.photographer}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Description ────────────────────────────────────────────── */}
      <div className="page-px pb-[24px] md:pb-[40px]">
        <div
          className="flex-1 text-[16px] md:text-[17.4px] leading-[1.4] md:leading-[1.2] text-[#282828]"
          style={{ maxWidth: "798px" }}
        >
          {project.description ? (
            <PortableText value={project.description as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
          ) : (
            <p className="text-[#d9d9d9]">Nessuna descrizione disponibile.</p>
          )}
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
