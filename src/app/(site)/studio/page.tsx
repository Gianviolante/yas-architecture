import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import { studioQuery } from "@/lib/sanity/queries";
import type { Studio, SanityImage } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = {
  title: "Studio — YAS Architecture",
};

const builder = imageUrlBuilder(sanityClient);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

export default async function StudioPage() {
  const studio: Studio = await sanityClient.fetch(studioQuery);
  const images = studio?.images ?? [];

  return (
    <div className="pt-[53px]">
      {/* Intro text */}
      <div className="max-w-[1440px] mx-auto px-8 pt-10 pb-10">
        <div className="max-w-2xl text-sm text-black/70 leading-relaxed">
          {studio?.description ? (
            <PortableText value={studio.description as Parameters<typeof PortableText>[0]["value"]} />
          ) : (
            <p>
              I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia,
              continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva,
              facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento
              dell&apos;occhio tra di esse.
            </p>
          )}
        </div>
      </div>

      {/* First image row — 2+1 layout */}
      {images.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-8 pb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2 relative aspect-[16/9] bg-gray-lighter overflow-hidden">
            <Image src={urlFor(images[0]).width(900).url()} alt="Studio" fill className="object-cover" />
          </div>
          {images[1] && (
            <div className="relative aspect-[16/9] bg-gray-lighter overflow-hidden">
              <Image src={urlFor(images[1]).width(500).url()} alt="Studio" fill className="object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Second row — text + 2 images */}
      <div className="max-w-[1440px] mx-auto px-8 pb-10 grid grid-cols-3 gap-8">
        <div className="text-sm text-black/70 leading-relaxed">
          <p>
            It is a long established fact that a reader will be distracted by the readable content of a page when
            looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
            of letters, as opposed to using Content here, content here, making it look like readable English.
          </p>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {images.slice(2, 4).map((img, i) => (
            <div key={i} className="relative aspect-[4/3] bg-gray-lighter overflow-hidden">
              <Image src={urlFor(img).width(400).url()} alt="Studio" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Large brand type */}
      <div className="overflow-hidden py-8 border-y border-gray-light mb-10">
        <p className="text-[clamp(5rem,15vw,14rem)] font-bold leading-none tracking-tight px-8 text-black">
          yas-arch
        </p>
      </div>

      {/* Three-column image grid with captions */}
      {images.length > 4 && (
        <div className="max-w-[1440px] mx-auto px-8 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.slice(4, 7).map((img, i) => (
            <div key={i}>
              <div className="relative aspect-[4/3] bg-gray-lighter overflow-hidden mb-3">
                <Image src={urlFor(img).width(400).url()} alt="Studio" fill className="object-cover" />
              </div>
              <p className="text-xs text-black/50 leading-relaxed">
                It is a long established fact that a reader will be distracted by the readable content of a page.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Portrait + text */}
      {images.length > 7 && (
        <div className="max-w-[1440px] mx-auto px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] bg-gray-lighter overflow-hidden">
            <Image src={urlFor(images[7]).width(600).url()} alt="Studio team" fill className="object-cover" />
          </div>
          <div className="text-sm text-black/70 leading-relaxed space-y-4">
            <p>
              I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia,
              continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva,
              facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento
              dell&apos;occhio tra di esse.
            </p>
            <p>
              It is a long established fact that a reader will be distracted by the readable content of a page when
              looking at its layout.
            </p>
          </div>
        </div>
      )}

      {/* Final image row */}
      {images.length > 8 && (
        <div className="max-w-[1440px] mx-auto px-8 pb-16 grid grid-cols-2 gap-4">
          {images.slice(8, 10).map((img, i) => (
            <div key={i} className="relative aspect-[16/9] bg-gray-lighter overflow-hidden">
              <Image src={urlFor(img).width(700).url()} alt="Studio" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
