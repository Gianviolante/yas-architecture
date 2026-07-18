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

      {/* ── Desktop: Side-by-side layout (hero left, content right) ──── */}
      <div className="md:flex md:gap-[30px] md:px-[30px] md:mt-[120px]">

        {/* ── Left column: Hero image (1:1 square - responsive like Groppi) ──────────────────── */}
        <div className="flex-shrink-0 w-full md:max-w-[50%] mx-4 md:mx-0 mt-[60px] md:mt-0 aspect-square overflow-hidden relative">
          {heroUrl ? (
            <Image src={heroUrl} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>

        {/* ── Right column: Content (title, meta, description, share) ── */}
        <div className="flex-1">

          {/* Title */}
          <div className="page-px md:p-0 pt-[24px] md:pt-[20px]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-[40px]">
              <h1
                className="text-[48px] md:text-[60px] font-bold tracking-tight leading-[1.3] text-[#282828]"
                style={{ fontSize: "clamp(48px, 10vw, 80px)" }}
              >
                {project.title}
              </h1>
              <Link
                href="/progetti"
                className="text-[12px] leading-[1.3] text-[#282828] hover:opacity-60 transition-opacity whitespace-nowrap md:mt-[12px]"
              >
                Torna a progetti →
              </Link>
            </div>
          </div>

          {/* Meta Information */}
          <div className="page-px md:p-0 pt-[16px] md:pt-[24px] pb-[24px]">
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

          {/* Description */}
          <div className="page-px md:p-0 pt-[32px] md:pt-[40px] pb-[24px] md:pb-[40px]">
            <div
              className="text-[15px] md:text-[17px] leading-[1.6] md:leading-[1.5] text-[#282828]"
              style={{ maxWidth: "798px" }}
            >
              {project.description ? (
                <PortableText value={project.description as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
              ) : (
                <p className="text-[#d9d9d9]">Nessuna descrizione disponibile.</p>
              )}
            </div>
          </div>

          {/* Condividi (Share) Section */}
          <div className="page-px md:p-0 pb-[40px] md:pb-0 md:pt-[24px] pt-[24px] md:mt-[40px]">
            <div className="flex items-center gap-[12px]">
              <p className="text-[12px] font-semibold leading-[1.3] text-[#282828]">Condividi</p>
              <div className="flex gap-[12px]">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Condividi su Facebook"
                  className="flex items-center justify-center w-[20px] h-[20px] text-[#888] hover:text-[#282828] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Condividi su LinkedIn"
                  className="flex items-center justify-center w-[20px] h-[20px] text-[#888] hover:text-[#282828] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.426-.103.25-.129.599-.129.949v5.43h-3.554s.05-8.807 0-9.726h3.554v1.375c.428-.659 1.191-1.596 2.897-1.596 2.116 0 3.702 1.382 3.702 4.356v5.591zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.706 0-.962.771-1.709 1.96-1.709 1.188 0 1.914.747 1.939 1.709 0 .948-.751 1.706-1.984 1.706zm1.946 11.597H3.392V9.726h3.891v10.726zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile only: Torna a progetti link */}
      <div className="md:hidden page-px py-[16px] border-t border-[#e5e5e5]">
        <Link
          href="/progetti"
          className="text-[12px] leading-[1.3] text-[#282828] hover:opacity-60 transition-opacity"
        >
          Torna a progetti →
        </Link>
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
