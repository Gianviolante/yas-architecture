import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { studioQuery, allProjectsQuery } from "@/lib/sanity/queries";
import type { Studio, SanityImage, Project } from "@/lib/sanity/types";

export const revalidate = 60;
export const metadata = { title: "Studio — YAS Architecture" };

const builder = imageUrlBuilder(sanityClient);
function urlFor(source: SanityImage) { return builder.image(source); }

const ptComponents = {
  block: { normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p> },
};

const INTRO_FALLBACK = `I benefici derivanti dall'utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento dell'occhio del lettore tra di esse.`;

const BODY_FALLBACK = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use…`;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[16px] leading-normal text-black text-center mb-[26px]">{children}</p>;
}

function Divider() {
  return <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />;
}

function PlaceholderImg({ className }: { className?: string }) {
  return <div className={`bg-[#d9d9d9] ${className ?? ""}`} />;
}

export default async function StudioPage() {
  const [studio, allProjects]: [Studio, Project[]] = await Promise.all([
    sanityClient.fetch(studioQuery),
    sanityClient.fetch(allProjectsQuery),
  ]);

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 2);

  const heroUrl        = studio?.heroImage     ? urlFor(studio.heroImage).width(1440).url()      : null;
  const mainImageUrl   = studio?.mainImage     ? urlFor(studio.mainImage).width(1440).url()       : null;
  const teamPortraitUrl = studio?.teamPortrait ? urlFor(studio.teamPortrait).width(800).url()     : null;
  const spaziUrls      = (studio?.spaziImages ?? []).map((img) => ({
    url: urlFor(img).width(700).url(), caption: img.caption,
  }));
  const crescitaUrls   = (studio?.crescitaImages ?? []).map((img) => urlFor(img).width(800).url());

  return (
    <div className="bg-white">

      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div className="sticky top-[53px] z-40 bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)] h-[75px] flex items-center justify-center gap-[8px]">
        <span className="inline-flex items-center bg-black border-2 border-black rounded-[100px] px-[24px] py-[10px] text-[16px] text-white leading-[22px]">
          Lo studio
        </span>
        <Link
          href="/team"
          className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-black hover:border-black hover:text-white transition-colors duration-200"
        >
          Designer
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 1 — Lo studio
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[40px]">
        <SectionLabel>Lo studio</SectionLabel>

        {/* Intro text */}
        <div className="page-px mb-[32px] text-[24px] leading-normal text-black">
          {studio?.description
            ? <PortableText value={studio.description as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            : <p>{INTRO_FALLBACK}</p>}
        </div>

        {/* Hero image — centered 1027×631, with nav arrow */}
        <div className="relative" style={{ paddingLeft: "182px", paddingRight: "231px" }}>
          <div className="relative overflow-hidden" style={{ height: "631px" }}>
            {heroUrl
              ? <Image src={heroUrl} alt="Studio" fill className="object-cover" />
              : <PlaceholderImg className="absolute inset-0" />}
          </div>
          {/* Right arrow — mix-blend-difference */}
          <div className="absolute right-[183px] top-1/2 -translate-y-1/2 size-[48px] mix-blend-difference pointer-events-none">
            <Image src="/assets/nav-circle.svg" alt="" fill className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src="/assets/nav-arrow-right.svg" alt="" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 2 — Lo spazio
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[40px]">
        <SectionLabel>Lo spazio</SectionLabel>

        {/* Description */}
        <div className="page-px mb-[40px] text-[24px] font-medium leading-[1.2] text-[#282828]">
          {studio?.spaziDescription
            ? <PortableText value={studio.spaziDescription as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            : <p>{BODY_FALLBACK}</p>}
        </div>

        {/* Two images */}
        <div className="flex gap-[12px] px-[238px]">
          {[0, 1].map((i) => (
            <div key={i} className="flex-1">
              <div className="relative overflow-hidden mb-[12px]" style={{ height: "632px" }}>
                {spaziUrls[i]
                  ? <Image src={spaziUrls[i].url} alt={spaziUrls[i].caption ?? `Spazio ${i + 1}`} fill className="object-cover" />
                  : <PlaceholderImg className="absolute inset-0" />}
              </div>
              <p className="text-[17.5px] leading-[1.5] text-[#282828]">
                {spaziUrls[i]?.caption ?? "Dettaglio progettuale"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 3 — Crescita e innovazione
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[40px]">
        <SectionLabel>Crescita e innovazione</SectionLabel>

        {/* Description */}
        <div className="page-px mb-[40px] text-[24px] font-medium leading-[1.2] text-[#282828]">
          {studio?.crescitaDescription
            ? <PortableText value={studio.crescitaDescription as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            : <p>{BODY_FALLBACK}</p>}
        </div>

        {/* Two images */}
        <div className="flex gap-[15px] page-px">
          {[0, 1].map((i) => (
            <div key={i} className="relative overflow-hidden flex-1" style={{ height: "483px" }}>
              {crescitaUrls[i]
                ? <Image src={crescitaUrls[i]} alt={`Crescita ${i + 1}`} fill className="object-cover" />
                : <PlaceholderImg className="absolute inset-0" />}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 4 — yas-arch wordmark
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden py-[40px]">
        {/* Huge wordmark */}
        <p
          className="font-bold text-black leading-none select-none"
          style={{ fontSize: "clamp(120px, 19.8vw, 285px)", paddingLeft: "168px" }}
        >
          yas-arch
        </p>

        {/* Overlay text — top left */}
        <div className="absolute top-[40px] text-[12px] leading-[1.2] text-[#282828]" style={{ right: "calc(100% - 469px)" }}>
          <p>Studio</p>
          <p className="mt-[8px] w-[200px]">{BODY_FALLBACK.slice(0, 80)}…</p>
        </div>

        {/* Overlay text — top right */}
        <p className="absolute top-[40px] text-[12px] leading-[1.2] text-[#282828]" style={{ right: "calc(100% - 1066px)" }}>
          Apulian inspiration guide
        </p>

        {/* Bottom left */}
        <p className="absolute text-[12px] leading-[1.2] text-[#282828]" style={{ bottom: "60px", right: "calc(100% - 484px)" }}>
          Architettura, design
        </p>

        {/* Bottom right — address */}
        <div className="absolute text-[12px] leading-[1.2] text-black" style={{ bottom: "40px", right: "calc(100% - 941px)", textAlign: "right" }}>
          <p>Via Dè Gracchi, 47</p>
          <p>72100 Brindisi (BR) Italia</p>
          <p>T +39 351 531 7762</p>
          <p>info@yas-arch.com</p>
        </div>
      </div>

      {/* Full-width separator image */}
      <div className="relative mx-[15px]" style={{ height: "718px" }}>
        {mainImageUrl
          ? <Image src={mainImageUrl} alt="Studio" fill className="object-cover" />
          : <PlaceholderImg className="absolute inset-0" />}
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 5 — Il team
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[40px]">
        <SectionLabel>Il team</SectionLabel>

        {/* Intro */}
        <div className="page-px mb-[40px] text-[24px] leading-normal text-black">
          {studio?.teamDescription
            ? <PortableText value={studio.teamDescription as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            : <p>{INTRO_FALLBACK}</p>}
        </div>

        {/* Portrait — centered 705px */}
        <div className="flex justify-center mb-[40px]">
          <div className="relative overflow-hidden" style={{ width: "705px", height: "908px" }}>
            {teamPortraitUrl
              ? <Image src={teamPortraitUrl} alt="Team YAS Architecture" fill className="object-cover" />
              : <PlaceholderImg className="absolute inset-0" />}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/team"
            className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
          >
            Conosci il team
          </Link>
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          SEZIONE 6 — Progetti
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[60px]">
        <SectionLabel>Progetti</SectionLabel>

        {/* Description */}
        <div className="page-px mb-[40px] text-[24px] leading-normal text-black">
          {studio?.progettiDescription
            ? <PortableText value={studio.progettiDescription as Parameters<typeof PortableText>[0]["value"]} components={ptComponents} />
            : <p>{BODY_FALLBACK}</p>}
        </div>

        {/* Two project cards */}
        <div className="flex gap-[15px] page-px mb-[24px]">
          {(featuredProjects.length > 0 ? featuredProjects : [{}, {}] as Project[]).slice(0, 2).map((p, i) => (
            <div key={p._id ?? i} className="flex-1">
              {p._id ? (
                <Link href={`/progetti/${p.slug.current}`} className="block group">
                  <div className="relative overflow-hidden mb-[8px]" style={{ height: "550px" }}>
                    {p.coverImageUrl
                      ? <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      : <PlaceholderImg className="absolute inset-0" />}
                  </div>
                  <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-[6px]">
                    {p.title}{p.location ? `, ${p.location}` : ""}
                  </p>
                  <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4]">
                    {p.typology}
                  </span>
                </Link>
              ) : (
                <div className="bg-[#d9d9d9] mb-[8px]" style={{ height: "550px" }} />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-[16px]">
          <Link
            href="/progetti"
            className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
          >
            Vai a tutti i progetti
          </Link>
        </div>
      </div>

    </div>
  );
}
