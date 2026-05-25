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
  { href: "/progetti", label: "Progetti", img: "/assets/home-link-1.jpg",  flexGrow: 449 },
  { href: "/studio",   label: "Studio",   img: "/assets/home-studio.jpg",  flexGrow: 333 },
  { href: "/team",     label: "Team",     img: "/assets/home-link-2.jpg",  flexGrow: 333 },
  { href: "/eventi",   label: "Eventi",   img: "/assets/home-link-3.jpg",  flexGrow: 217 },
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
        <div className="pt-[80px]">

          {/* ── 1. HERO ──────────────────────────────────────────────── */}
          <section className="md:hidden flex items-center justify-center h-[160px]">
            <h1 className="font-bold text-black leading-none text-[64px]">yas-arch</h1>
          </section>
          <section className="relative h-[439px] overflow-hidden hidden md:block">
            <h1
              className="absolute font-bold text-black leading-none whitespace-nowrap select-none"
              style={{ fontSize: "clamp(8rem,19.8vw,285px)", top: "7px", left: "198px" }}
            >
              yas-arch
            </h1>

            <div
              className="absolute text-[12px] leading-[1.2] text-[#282828] text-right"
              style={{ top: "79px", right: "calc(100% - 499px)" }}
            >
              <p>Studio architettura</p>
              <p>e design</p>
            </div>

            <p
              className="absolute text-[12px] leading-[1.2] text-[#282828]"
              style={{ top: "79px", left: "765px" }}
            >
              Apulian inspiration guide
            </p>

            <div
              className="absolute text-[12px] leading-[1.2] text-black text-right"
              style={{ top: "327px", right: "calc(100% - 972px)" }}
            >
              <p>Via Dè Gracchi, 47</p>
              <p>72100 Brindisi (BR) Italia</p>
              <p>T +39 351 531 7762</p>
              <p>info@yas-arch.com</p>
            </div>
          </section>

          {/* ── 2. LINKS ─────────────────────────────────────────────── */}
          <section className="px-4 md:px-[30px]">
            <div className="flex flex-col sm:flex-row sm:h-[371px] gap-[15px]">
              {NAV_LINKS.map(({ href, label, img, flexGrow }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ flexGrow, flexShrink: 1, flexBasis: 0 }}
                  className="flex flex-col group"
                >
                  <p className="text-[12px] leading-[1.5] text-[#282828] shrink-0">{label}</p>
                  <div className="relative flex-1 overflow-hidden bg-[#d9d9d9] min-h-[180px] sm:min-h-0">
                    <Image src={img} alt={label} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 3. APULIA ────────────────────────────────────────────── */}
          <section className="relative h-[345px] overflow-hidden hidden md:block">
            <h2
              className="absolute font-bold text-black leading-none whitespace-nowrap select-none"
              style={{ fontSize: "clamp(8rem,19.8vw,285px)", top: 0, left: "29px" }}
            >
              Apulia
            </h2>

            <p
              className="absolute text-[12px] leading-[1.2] text-[#282828]"
              style={{ top: "78px", left: "755px" }}
            >
              Apulian inspiration guide
            </p>

            <div
              className="absolute text-[12px] leading-[1.2] text-[#282828] text-right right-[32px]"
              style={{ top: "123px" }}
            >
              <Link href="/progetti?tipologia=Interior Design" className="block hover:opacity-60 transition-opacity">Interior design→</Link>
              <Link href="/progetti?tipologia=Architettura"    className="block hover:opacity-60 transition-opacity">Architecture →</Link>
              <Link href="/progetti"                           className="block hover:opacity-60 transition-opacity">Tutti i progetti→</Link>
            </div>
          </section>

          {/* ── 4. DESCRIPTION + slider ──────────────────────────────── */}
          <section className="page-px pt-[40px]">
            <div className="text-[24px] leading-normal text-black mb-14">
              {home?.introDescription
                ? <PortableText value={home.introDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-[17.5px] leading-[1.5] text-[#282828]">
                {home?.bodyLeft
                  ? <PortableText value={home.bodyLeft as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                  : <p>{FALLBACK_BODY_LEFT}</p>}
              </div>
              <div className="text-[17.5px] leading-[1.2] text-[#282828]">
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
          <section className="page-px py-10">
            <p className="text-[16px] leading-normal text-black text-center mb-6">Lo studio</p>
            <div className="text-[24px] leading-normal text-black mb-10">
              {home?.studioDescription
                ? <PortableText value={home.studioDescription as Parameters<typeof PortableText>[0]["value"]} components={ptBlock} />
                : <p>{FALLBACK_INTRO}</p>}
            </div>
            <div className="relative h-[631px] mx-auto max-w-[1027px] mb-10">
              <Image src="/assets/home-studio.jpg" alt="Lo studio" fill className="object-cover" />
            </div>
            <div className="flex justify-center">
              <Link
                href="/studio"
                className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
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
