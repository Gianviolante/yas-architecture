import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeSlider from "@/components/sections/HomeSlider";
import HomeProjectsCarousel from "@/components/sections/HomeProjectsCarousel";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import ArrowLink from "@/components/ui/ArrowLink";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery, homeQuery } from "@/lib/sanity/queries";
import type { Project, Home } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = {
  title: "YAS Architecture",
  description: "Studio di architettura e design — Brindisi, Italia",
};

const DEFAULT_NAV_LINKS = [
  { href: "/progetti", label: "Progetti", img: "/assets/home-link-1.jpg", flexGrow: 449, mobileH: 268 },
  { href: "/studio",   label: "Studio",   img: "/assets/home-studio.jpg", flexGrow: 333, mobileH: 361 },
  { href: "/team",     label: "Team",     img: "/assets/home-link-2.jpg", flexGrow: 333, mobileH: 361 },
];

const ptBlock = {
  block: { normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p> },
};

const FALLBACK_INTRO = `I benefici derivanti dall'utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento dell'occhio del lettore tra di esse.`;
const FALLBACK_BODY_LEFT = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`;
const FALLBACK_BODY_RIGHT = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, making it look like readable English.`;

export default async function HomePage() {
  const [projects, home]: [Project[], Home | null] = await Promise.all([
    sanityClient.fetch(allProjectsQuery).catch(() => []),
    sanityClient.fetch(homeQuery).catch(() => null),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="pt-[100px] md:pt-[120px]">

          {/* ── 1. HERO — mobile ─────────────────────────────────────── */}
          <section className="md:hidden relative h-[360px] overflow-hidden">
            {/* labels top */}
            <div className="absolute text-[12px] leading-[1.2]" style={{ top: "8px", left: "16px", color: "#000000" }}>
              {home?.heroSubtitleLeft ? (
                <PortableText value={home.heroSubtitleLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <p>Studio architettura e design</p>
              )}
            </div>
            <div className="absolute text-[12px] leading-[1.2] text-right whitespace-nowrap" style={{ top: "8px", right: "15px", color: "#000000" }}>
              <p>{home?.heroSubtitleRight}</p>
            </div>

            {/* big title */}
            <AnimatedTitle
              text={home?.heroTitleMain || "yas-arc"}
              className="absolute font-bold text-black select-none"
              style={{ fontSize: "clamp(85px, 42vw, 160px)", lineHeight: "0.8", top: "28px", left: "12px", width: "100%", paddingRight: "16px" }}
            />

            {/* address bottom-left */}
            <div className="absolute text-[12px] leading-[1.2] text-black" style={{ top: "299px", left: "16px" }}>
              {home?.heroAddress ? (
                <PortableText value={home.heroAddress as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <>
                  <p>Piazza Marco Antonio Cavalerio, 21</p>
                  <p>72100 Brindisi, Italia</p>
                  <p>studio@yas-arc.com</p>
                </>
              )}
            </div>

            {/* links bottom-right */}
            <div className="absolute text-[12px] leading-[1.2] text-black text-right" style={{ top: "301px", right: "15px" }}>
              <ArrowLink href="/progetti?tipologia=Interior Design">Interior design→</ArrowLink>
              <ArrowLink href="/progetti?tipologia=Architettura">Architecture →</ArrowLink>
              <ArrowLink href="/progetti">Tutti i progetti→</ArrowLink>
            </div>
          </section>

          {/* ── 1. HERO — tablet + desktop ───────────────────────────── */}
          <section className="hidden md:grid grid-cols-3 grid-rows-[auto_auto_minmax(80px,auto)] gap-y-[8px] lg:gap-y-[4px] gap-x-[32px] md:gap-x-[48px] lg:gap-x-[64px] overflow-hidden page-px md:py-[24px] lg:pt-[8px] lg:pb-[32px]">
            {/* Row 1 - Top-left: Subtitle (Studio architettura e design) */}
            <div className="col-start-1 row-start-1 text-[12px] md:text-[16px] leading-[0.8] text-black flex items-end">
              {home?.heroSubtitleLeft ? (
                <PortableText value={home.heroSubtitleLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <p>Studio architettura e design</p>
              )}
            </div>

            {/* Row 1 - Top-center: Subtitle (Inspired by Apulian tradition) */}
            <div className="col-start-2 row-start-1 text-[12px] md:text-[16px] leading-[0.8] text-left flex items-end">
              <p>{home?.heroSubtitleRight}</p>
            </div>

            {/* Row 2 - Title (left aligned) */}
            <div className="col-start-1 row-start-2 flex items-start">
              <AnimatedTitle
                text={home?.heroTitleMain || "yas-arc"}
                className="font-bold text-black leading-none whitespace-nowrap select-none"
                style={{ fontSize: "clamp(8rem,19.8vw,285px)" }}
              />
            </div>

            {/* Row 3 - Bottom-left: Address */}
            <div className="col-start-1 row-start-3 text-[12px] md:text-[16px] leading-[1.2] text-black flex items-end">
              {home?.heroAddress ? (
                <PortableText value={home.heroAddress as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <div>
                  <p>Piazza Marco Antonio Cavalerio, 21</p>
                  <p>72100 Brindisi, Italia</p>
                  <p>studio@yas-arc.com</p>
                </div>
              )}
            </div>
          </section>

          {/* ── 2. LINKS ─────────────────────────────────────────────── */}
          <section className="page-px mt-[32px] md:mt-[48px] lg:mt-[64px]">
            <div className="flex flex-col gap-[25px] md:flex-row md:gap-[15px] md:h-[225px] lg:h-[371px] overflow-hidden">
              {(home?.navLinks?.length ? home.navLinks.filter((link: any) => link?.href) : DEFAULT_NAV_LINKS).map(({ href, label, image, img, flexGrow, mobileHeight, mobileH }: any) => {
                const imageUrl = (image as any)?.url || img;
                const height = mobileHeight || mobileH;
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{ flexGrow, flexShrink: 1, flexBasis: 0 }}
                    className="flex flex-col group"
                  >
                    <p className="text-[12px] leading-[1.5] text-black shrink-0">{label}</p>
                    <div
                      className="relative flex-1 overflow-hidden bg-[#d9d9d9] md:min-h-0"
                      style={{ minHeight: `${height}px` }}
                    >
                      <Image src={imageUrl} alt={label} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 3. ARCHITECTURE — mobile ───────────────────────────────────── */}
          <section className="md:hidden relative h-[208px] overflow-hidden mt-[40px]">
            <h2
              className="absolute font-bold text-black select-none"
              style={{ fontSize: "clamp(60px, 30vw, 85px)", lineHeight: "0.8", top: 0, left: "16px", width: "100%", paddingRight: "16px" }}
            >
              Architecture
            </h2>
            <div className="absolute text-[12px] leading-[1.2] text-black text-right" style={{ top: "162px", right: "15px" }}>
              <ArrowLink href="/progetti?tipologia=Interior Design">Interior design→</ArrowLink>
              <ArrowLink href="/progetti?tipologia=Architettura">Architecture →</ArrowLink>
              <ArrowLink href="/progetti">Tutti i progetti→</ArrowLink>
            </div>
          </section>

          {/* ── 3. ARCHITECTURE — tablet + desktop ─────────────────────────── */}
          <section className="hidden md:grid grid-cols-2 gap-[153px] page-px py-[32px] overflow-hidden mt-[24px] lg:mt-[32px] items-baseline">
            {/* Row 1 - Title (Architecture) left */}
            <div className="col-start-1 row-start-1">
              <AnimatedTitle
                text="Architecture"
                className="font-bold text-black leading-none whitespace-nowrap select-none"
                style={{ fontSize: "clamp(8rem,19.8vw,160px)" }}
              />
            </div>

            {/* Row 1 - Bottom-right: Project links */}
            <div className="col-start-2 row-start-1 text-[12px] leading-[1.2] text-black flex flex-col justify-start self-start text-right" style={{ paddingTop: "24px" }}>
              <div>
                <ArrowLink href="/progetti?tipologia=Interior Design">Interior design→</ArrowLink>
                <ArrowLink href="/progetti?tipologia=Architettura">Architecture →</ArrowLink>
                <ArrowLink href="/progetti">Tutti i progetti→</ArrowLink>
              </div>
            </div>
          </section>

          {/* ── 4. DESCRIPTION + slider ──────────────────────────────── */}
          <section className="page-px pt-[40px]">
            <div className="text-[16px] md:text-[24px] leading-normal text-black mb-6 md:mb-14">
              {home?.introDescription
                ? <PortableText value={home.introDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-12">
              <div className="text-[16px] md:text-[17.5px] leading-[1.5] text-black">
                {home?.bodyLeft
                  ? <PortableText value={home.bodyLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                  : <p>{FALLBACK_BODY_LEFT}</p>}
              </div>
              {/* bodyRight hidden on mobile — Figma shows single column */}
              <div className="hidden md:block text-[17.5px] leading-[1.2] text-black">
                {home?.bodyRight
                  ? <PortableText value={home.bodyRight as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                  : <p>{FALLBACK_BODY_RIGHT}</p>}
              </div>
            </div>
          </section>

          <div className="page-px">
            <HomeSlider slides={home?.sliderImages?.map((img: any) => img.url || img) || undefined} />
          </div>

          {/* ── 5. PROJECT BLOCK ─────────────────────────────────────── */}
          <HomeProjectsCarousel projects={projects} progettiDescription={home?.progettiDescription} />

          {/* ── 6. STUDIO BLOCK ──────────────────────────────────────── */}
          <section className="page-px py-10">
            <p className="text-[16px] leading-normal text-black text-center mb-6">Lo studio</p>
            <div className="text-[24px] leading-normal text-black mb-6 md:mb-10">
              {home?.studioDescription
                ? <PortableText value={home.studioDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            {/* immagine: 400px mobile / 411px tablet / 631px desktop */}
            <div className="relative h-[400px] md:h-[411px] lg:h-[631px] mx-auto md:max-w-[668px] lg:max-w-[1027px] mb-8 md:mb-10">
              {home?.studioImage?.url ? (
                <Image src={home.studioImage.url} alt="Lo studio" fill className="object-cover" />
              ) : (
                <Image src="/assets/home-studio.jpg" alt="Lo studio" fill className="object-cover" priority />
              )}
            </div>
            {/* bottone: full-width mobile, centrato desktop */}
            <div className="md:flex md:justify-center">
              <Link
                href="/studio"
                className="flex items-center justify-center border-2 border-[#000] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#000] leading-[22px] hover:bg-black hover:text-white transition-colors duration-200 w-full md:w-auto"
              >
                Vedi lo studio
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
