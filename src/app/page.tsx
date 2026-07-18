import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeSlider from "@/components/sections/HomeSlider";
import HomeProjectsCarousel from "@/components/sections/HomeProjectsCarousel";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery, homeQuery } from "@/lib/sanity/queries";
import type { Project, Home } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = {
  title: "YAS Architecture",
  description: "Studio di architettura e design — Brindisi, Italia",
};

const NAV_LINKS = [
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
        <div className="pt-[60px] md:pt-[80px]">

          {/* ── 1. HERO — mobile ─────────────────────────────────────── */}
          <section className="md:hidden relative h-[382px] overflow-hidden">
            {/* labels top */}
            <div className="absolute text-[12px] leading-[1.2]" style={{ top: "8px", left: "16px", color: "#000000" }}>
              {home?.heroSubtitleLeft ? (
                <PortableText value={home.heroSubtitleLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <>
                  <p>Studio architettura</p>
                  <p>e design</p>
                </>
              )}
            </div>
            <p className="absolute text-[12px] leading-[1.2] text-right" style={{ top: "8px", right: "15px", color: "#000000" }}>
              {home?.heroSubtitleRight || "Apulian inspiration guide"}
            </p>

            {/* big title */}
            <h1
              className="absolute font-bold text-black select-none"
              style={{ fontSize: "clamp(64px, 18vw, 120px)", lineHeight: "0.8", top: "50px", left: "12px", width: "100%", paddingRight: "16px" }}
            >
              {home?.heroTitleMain || "yas-arch"}
            </h1>

            {/* address bottom-left */}
            <div className="absolute text-[12px] leading-[1.2] text-black" style={{ top: "254px", left: "16px" }}>
              {home?.heroAddress ? (
                <PortableText value={home.heroAddress as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <>
                  <p>Via Dè Gracchi, 47</p>
                  <p>72100 Brindisi (BR) Italia</p>
                  <p>T +39 351 531 7762</p>
                  <p>info@yas-arch.com</p>
                </>
              )}
            </div>

            {/* links bottom-right */}
            <div className="absolute text-[12px] leading-[1.2] text-[#282828] text-right" style={{ top: "256px", right: "15px" }}>
              <Link href="/progetti?tipologia=Interior Design" className="block hover:opacity-60 transition-opacity">Interior design→</Link>
              <Link href="/progetti?tipologia=Architettura"    className="block hover:opacity-60 transition-opacity">Architecture →</Link>
              <Link href="/progetti"                           className="block hover:opacity-60 transition-opacity">Tutti i progetti→</Link>
            </div>
          </section>

          {/* ── 1. HERO — tablet + desktop ───────────────────────────── */}
          <section className="relative md:h-[295px] lg:h-[439px] overflow-hidden hidden md:block">
            <h1
              className="absolute font-bold text-black leading-none whitespace-nowrap select-none md:top-[23px] md:left-[81px] lg:top-[7px] lg:left-[198px]"
              style={{ fontSize: "clamp(8rem,19.8vw,285px)" }}
            >
              {home?.heroTitleMain || "yas-arch"}
            </h1>

            <div
              className="absolute text-[12px] leading-[1.2] text-right md:top-[48px] md:right-[calc(100%-362px)] lg:top-[79px] lg:right-[calc(100%-499px)]"
              style={{ color: "#000000" }}
            >
              {home?.heroSubtitleLeft ? (
                <PortableText value={home.heroSubtitleLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <>
                  <p>Studio architettura</p>
                  <p>e design</p>
                </>
              )}
            </div>

            <p
              className="absolute text-[12px] leading-[1.2] md:top-[48px] md:left-[462px] lg:top-[79px] lg:left-[765px]"
              style={{ color: "#000000" }}
            >
              {home?.heroSubtitleRight || "Apulian inspiration guide"}
            </p>

            <div
              className="absolute text-[12px] leading-[1.2] text-black text-right md:top-[221px] md:right-[calc(100%-545px)] lg:top-[327px] lg:right-[calc(100%-972px)]"
            >
              {home?.heroAddress ? (
                <PortableText value={home.heroAddress as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
              ) : (
                <>
                  <p>Via Dè Gracchi, 47</p>
                  <p>72100 Brindisi (BR) Italia</p>
                  <p>T +39 351 531 7762</p>
                  <p>info@yas-arch.com</p>
                </>
              )}
            </div>
          </section>

          {/* ── 2. LINKS ─────────────────────────────────────────────── */}
          <section className="px-[15px] lg:px-[30px]">
            <div className="flex flex-col gap-[25px] md:flex-row md:gap-[15px] md:h-[225px] lg:h-[371px]">
              {NAV_LINKS.map(({ href, label, img, flexGrow, mobileH }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ flexGrow, flexShrink: 1, flexBasis: 0 }}
                  className="flex flex-col group"
                >
                  <p className="text-[12px] leading-[1.5] text-[#282828] shrink-0">{label}</p>
                  <div
                    className="relative flex-1 overflow-hidden bg-[#d9d9d9] md:min-h-0"
                    style={{ minHeight: `${mobileH}px` }}
                  >
                    <Image src={img} alt={label} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 3. APULIA — mobile ───────────────────────────────────── */}
          <section className="md:hidden relative h-[208px] overflow-hidden">
            <h2
              className="absolute font-bold text-black select-none"
              style={{ fontSize: "128px", lineHeight: "0.67", top: 0, left: "6px", width: "363px" }}
            >
              Apulia
            </h2>
            <p className="absolute text-[12px] leading-[1.2] text-[#282828]" style={{ top: "3px", left: "109px" }}>
              Apulian inspiration guide
            </p>
            <div className="absolute text-[12px] leading-[1.2] text-[#282828] text-right" style={{ top: "162px", right: "15px" }}>
              <Link href="/progetti?tipologia=Interior Design" className="block hover:opacity-60 transition-opacity">Interior design→</Link>
              <Link href="/progetti?tipologia=Architettura"    className="block hover:opacity-60 transition-opacity">Architecture →</Link>
              <Link href="/progetti"                           className="block hover:opacity-60 transition-opacity">Tutti i progetti→</Link>
            </div>
          </section>

          {/* ── 3. APULIA — tablet + desktop ─────────────────────────── */}
          <section className="relative md:h-[206px] lg:h-[345px] overflow-hidden hidden md:block">
            <h2
              className="absolute font-bold text-black leading-none whitespace-nowrap select-none"
              style={{ fontSize: "clamp(8rem,19.8vw,285px)", top: 0, left: "29px" }}
            >
              Apulia
            </h2>

            <p
              className="absolute text-[12px] leading-[1.2] text-[#282828] md:top-[45px] md:left-[136px] lg:top-[78px] lg:left-[755px]"
            >
              Apulian inspiration guide
            </p>

            <div
              className="absolute text-[12px] leading-[1.2] text-[#282828] text-right right-[32px] md:top-[70px] lg:top-[123px]"
            >
              <Link href="/progetti?tipologia=Interior Design" className="block hover:opacity-60 transition-opacity">Interior design→</Link>
              <Link href="/progetti?tipologia=Architettura"    className="block hover:opacity-60 transition-opacity">Architecture →</Link>
              <Link href="/progetti"                           className="block hover:opacity-60 transition-opacity">Tutti i progetti→</Link>
            </div>
          </section>

          {/* ── 4. DESCRIPTION + slider ──────────────────────────────── */}
          <section className="px-[15px] md:page-px pt-[40px]">
            <div className="text-[16px] md:text-[24px] leading-normal text-black mb-6 md:mb-14">
              {home?.introDescription
                ? <PortableText value={home.introDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 md:mb-12">
              <div className="text-[16px] md:text-[17.5px] leading-[1.5] text-[#282828]">
                {home?.bodyLeft
                  ? <PortableText value={home.bodyLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                  : <p>{FALLBACK_BODY_LEFT}</p>}
              </div>
              {/* bodyRight hidden on mobile — Figma shows single column */}
              <div className="hidden md:block text-[17.5px] leading-[1.2] text-[#282828]">
                {home?.bodyRight
                  ? <PortableText value={home.bodyRight as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                  : <p>{FALLBACK_BODY_RIGHT}</p>}
              </div>
            </div>
          </section>

          <div className="mx-[15px]">
            <HomeSlider />
          </div>

          {/* ── 5. PROJECT BLOCK ─────────────────────────────────────── */}
          <HomeProjectsCarousel projects={projects} />

          {/* ── 6. STUDIO BLOCK ──────────────────────────────────────── */}
          <section className="px-[15px] md:page-px py-10">
            <p className="text-[16px] leading-normal text-black text-center mb-6">Lo studio</p>
            <div className="text-[24px] leading-normal text-black mb-6 md:mb-10">
              {home?.studioDescription
                ? <PortableText value={home.studioDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            {/* immagine: 245px mobile / 411px tablet / 631px desktop */}
            <div className="relative h-[245px] md:h-[411px] lg:h-[631px] mx-auto md:max-w-[668px] lg:max-w-[1027px] mb-2 md:mb-10">
              {home?.studioImage?.asset?.url ? (
                <Image src={home.studioImage.asset.url} alt="Lo studio" fill className="object-cover" />
              ) : (
                <Image src="/assets/home-studio.jpg" alt="Lo studio" fill className="object-cover" />
              )}
            </div>
            {/* contatore "4 / 6" — visibile solo su mobile */}
            <p className="md:hidden text-[12px] leading-[1.5] text-[#282828] text-right mb-6">4 / 6</p>
            {/* bottone: full-width mobile, centrato desktop */}
            <div className="md:flex md:justify-center">
              <Link
                href="/studio"
                className="flex items-center justify-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200 w-full md:w-auto"
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
