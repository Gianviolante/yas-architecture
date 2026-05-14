import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { projectBySlugQuery, allProjectsQuery } from "@/lib/sanity/queries";
import type { Project, SanityImage } from "@/lib/sanity/types";

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

  const otherProjects = allProjects.filter((p) => p.slug.current !== slug).slice(0, 6);

  const heroUrl = project.heroImage ? urlFor(project.heroImage).width(1440).url() : null;
  const galleryUrls = project.gallery?.map((img) => urlFor(img).width(800).url()) ?? [];

  return (
    <div>
      {/* Hero image — full bleed, navbar overlaps */}
      <div className="relative w-full aspect-[16/7] bg-gray-lighter">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Title + meta section */}
      <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-12">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-5xl font-bold">{project.title}</h1>
          <Link href="/progetti" className="text-xs text-black/40 hover:text-black transition-colors mt-4 whitespace-nowrap">
            Torna a progetti ↑
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Meta info */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              {project.location && (
                <>
                  <span className="text-black/40">Location</span>
                  <span>{project.location}</span>
                </>
              )}
              {project.year && (
                <>
                  <span className="text-black/40">Anno</span>
                  <span>{project.year}</span>
                </>
              )}
              {project.area && (
                <>
                  <span className="text-black/40">Area</span>
                  <span>{project.area} mq</span>
                </>
              )}
              {project.typology && (
                <>
                  <span className="text-black/40">Tipologia</span>
                  <span>{project.typology}</span>
                </>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <span className="text-xs px-3 py-1 rounded-full border border-gray-light text-black/50">
                {project.typology}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-gray-light text-black/50">
                {project.status}
              </span>
            </div>
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="pt-2">
                <p className="text-black/40 mb-1">Team</p>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.map((m) => (
                    <span key={m._id} className="text-xs text-black/60">{m.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-black/70 leading-relaxed">
            {/* PortableText rendering — plain fallback for now */}
            {typeof project.description === "string"
              ? project.description
              : project.description
              ? <p>Descrizione disponibile nel CMS.</p>
              : null}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-8 pb-16">
          {/* First gallery image — full width */}
          {galleryUrls[0] && (
            <div className="relative w-full aspect-[16/7] bg-gray-lighter mb-4">
              <Image src={galleryUrls[0]} alt={`${project.title} — immagine`} fill className="object-cover" />
            </div>
          )}

          {/* Rest of gallery — 3 col grid */}
          {galleryUrls.length > 1 && (
            <>
              <p className="text-xs text-black/40 mb-4">Raccolta come immagini</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryUrls.slice(1).map((url, i) => (
                  <div key={i} className="relative aspect-[4/3] bg-gray-lighter overflow-hidden">
                    <Image src={url} alt={`${project.title} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Other projects */}
      {otherProjects.length > 0 && (
        <div className="border-t border-gray-light pt-12 pb-16">
          <div className="max-w-[1440px] mx-auto px-8">
            <p className="text-xs text-black/40 uppercase tracking-widest mb-6">Vedi altri progetti</p>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-8 px-8 scrollbar-hide">
              {otherProjects.map((p) => (
                <Link
                  key={p._id}
                  href={`/progetti/${p.slug.current}`}
                  className="shrink-0 w-48 group"
                >
                  <div className="aspect-[4/3] bg-gray-lighter overflow-hidden mb-2">
                    {p.coverImageUrl && (
                      <Image
                        src={p.coverImageUrl}
                        alt={p.title}
                        width={192}
                        height={144}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{p.title}</p>
                  <p className="text-xs text-black/40 truncate">{p.location}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border border-gray-light text-black/40">
                    {p.typology}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
