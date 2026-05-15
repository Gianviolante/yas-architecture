import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeSlider from "@/components/sections/HomeSlider";
import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = {
  title: "YAS Architecture",
  description: "Studio di architettura e design — Brindisi, Italia",
};

const NAV_LINKS = [
  { href: "/progetti", label: "Progetti", img: "/assets/home-link-1.jpg",  flex: "flex-[449]" },
  { href: "/studio",   label: "Studio",   img: "/assets/home-studio.jpg",  flex: "flex-[333]" },
  { href: "/team",     label: "Team",     img: "/assets/home-link-2.jpg",  flex: "flex-[333]" },
  { href: "/eventi",   label: "Eventi",   img: "/assets/home-link-3.jpg",  flex: "flex-[217]" },
];

export default async function HomePage() {
  const projects: Project[] = await sanityClient.fetch(allProjectsQuery).catch(() => []);
  const featured = projects.slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="pt-[53px]">

          {/* ── 1. HERO ──────────────────────────────────────────────── */}
          <section className="relative h-[439px] overflow-hidden">
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
          <section className="px-[32px]">
            <div className="flex gap-[14px] h-[408px]">
              {NAV_LINKS.map(({ href, label, img, flex }) => (
                <Link key={href} href={href} className={`${flex} relative group overflow-hidden`}>
                  <p className="absolute top-0 left-0 text-[12px] leading-[1.5] text-[#282828] z-10">{label}</p>
                  <div className="absolute inset-0 top-[37px]">
                    <Image
                      src={img}
                      alt={label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 3. APULIA ────────────────────────────────────────────── */}
          <section className="relative h-[345px] overflow-hidden">
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
          <section className="px-[32px]">
            <p className="text-[24px] leading-normal text-black mb-14">
              I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità.
              Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la
              distinzione delle diverse categorie informative e indirizzando lo spostamento dell&apos;occhio del lettore tra di esse.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-12">
              <p className="text-[17.5px] leading-[1.5] text-[#282828]">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <p className="text-[17.5px] leading-[1.2] text-[#282828]">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
                &lsquo;Content here, content here&rsquo;, making it look like readable English. Many desktop publishing packages and
                web page editors now use…
              </p>
            </div>
          </section>

          <div className="mx-[15px]">
            <HomeSlider />
          </div>

          {/* ── 5. PROJECT BLOCK ─────────────────────────────────────── */}
          <section className="relative">
            <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />
            <div className="px-[32px] pt-8 pb-16">
              <p className="text-[16px] leading-normal text-black text-center mb-6">Progetti</p>
              <p className="text-[24px] font-medium leading-[1.2] text-[#282828] mb-10">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
                &lsquo;Content here, content here&rsquo;, making it look like readable English. Many desktop publishing packages and web page editors now use…
              </p>

              <div className="grid grid-cols-2 gap-[14px] mb-10">
                {featured.length > 0 ? (
                  featured.map((p) => (
                    <Link key={p._id} href={`/progetti/${p.slug.current}`} className="group">
                      <div className="relative h-[550px] overflow-hidden mb-4">
                        {p.coverImageUrl ? (
                          <Image src={p.coverImageUrl} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="w-full h-full bg-[#d9d9d9]" />
                        )}
                      </div>
                      <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-2">
                        {p.title}{p.location ? `, ${p.location}` : ""}
                      </p>
                      <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[12px] text-[#333] leading-[22px]">
                        {p.typology ?? "Residenziale"}
                      </span>
                    </Link>
                  ))
                ) : (
                  [
                    { img: "/assets/home-project-1.jpg", label: "Marina One Residence, Marina Way – SG" },
                    { img: "/assets/home-project-2.jpg", label: "Marina One Residence, Marina Way – SG" },
                  ].map(({ img, label }, i) => (
                    <div key={i}>
                      <div className="relative h-[550px] overflow-hidden mb-4">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                      <p className="text-[17.5px] leading-[1.5] text-[#282828] mb-2">{label}</p>
                      <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[12px] text-[#333] leading-[22px]">
                        Residential
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-center">
                <Link
                  href="/progetti"
                  className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] text-[#333] leading-[22px] hover:bg-[#333] hover:text-white transition-colors duration-200"
                >
                  Vai a tutti i progetti
                </Link>
              </div>
            </div>
          </section>

          {/* ── 6. STUDIO BLOCK ──────────────────────────────────────── */}
          <section className="px-[32px] py-10">
            <p className="text-[16px] leading-normal text-black text-center mb-6">Lo studio</p>
            <p className="text-[24px] leading-normal text-black mb-10">
              I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità.
              Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la
              distinzione delle diverse categorie informative e indirizzando lo spostamento dell&apos;occhio del lettore tra di esse.
            </p>
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
