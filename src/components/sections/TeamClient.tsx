"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import type { TeamMember, Partner, SanityImage } from "@/lib/sanity/types";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

interface Props {
  teamMembers: TeamMember[];
  partners: Partner[];
}

type Tab = "studio" | "designers";

const FALLBACK_INTRO = `I benefici derivanti dall'utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia, continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva, facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento dell'occhio del lettore tra di esse.`;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[16px] leading-normal text-black text-center mb-[26px]">{children}</p>;
}

function Divider() {
  return <div className="w-full h-[48px] bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)]" />;
}

export default function TeamClient({ teamMembers, partners }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("designers");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const studioMembers = teamMembers.filter((m) => m.type === "Studio");
  const designers = teamMembers.filter((m) => m.type === "Designer");
  const displayed = activeTab === "studio" ? studioMembers : designers;

  const placeholders = Array(6).fill(null) as null[];
  const cards = displayed.length > 0 ? displayed : placeholders;

  return (
    <div className="bg-white">

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-[53px] z-40 bg-white shadow-[0px_6px_8px_0px_rgba(0,0,0,0.1)] h-[75px] flex items-center justify-center gap-[8px]">
        <Link
          href="/studio"
          className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] py-[10px] text-[16px] leading-[22px] text-[#333] hover:bg-black hover:border-black hover:text-white transition-colors duration-200"
        >
          Lo studio
        </Link>
        <button
          onClick={() => setActiveTab("designers")}
          className={`inline-flex items-center border-2 rounded-[100px] px-[24px] py-[10px] text-[16px] leading-[22px] transition-colors duration-200 ${
            activeTab === "designers"
              ? "bg-black border-black text-white"
              : "border-[#333] text-[#333] hover:bg-black hover:border-black hover:text-white"
          }`}
        >
          Designers
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          Il team
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[60px] pb-[40px]">
        <p className="text-[16px] leading-normal text-black text-center mb-[26px]">Il team</p>
        <div className="page-px mb-[32px] text-[24px] leading-normal text-black">
          <p>{FALLBACK_INTRO}</p>
        </div>

        {/* 3-column grid */}
        <div className="page-px grid grid-cols-3 gap-x-[15px]">
          {cards.slice(0, 6).map((member, i) => (
            <MemberCard
              key={member?._id ?? i}
              member={member}
              expanded={!!member && expandedId === member._id}
              onToggle={member ? () => setExpandedId(expandedId === member._id ? null : member._id) : undefined}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════
          Associati e Partners
      ══════════════════════════════════════════════════════════════ */}
      <div className="pt-[37px] pb-[60px]">
        <SectionLabel>Associati e Partners</SectionLabel>

        <div className="page-px mb-[72px] text-[24px] leading-normal text-black">
          <p>{FALLBACK_INTRO}</p>
        </div>

        {/* 4-column grid */}
        <div className="page-px grid grid-cols-4 gap-x-[15px]">
          {(partners.length > 0 ? partners : (Array(4).fill(null) as null[])).map((p, i) => (
            <div key={p?._id ?? i}>
              <p className="text-[16px] leading-[1.2] text-black mb-[8px]">
                {p?.name ?? `Associato ${i + 1}`}
              </p>
              <div className="text-[16px] leading-[1.2] text-black mb-[16px]">
                {p?.address ? (
                  <p>{p.address}</p>
                ) : (
                  <>
                    <p>Via Dè Gracchi, 47</p>
                    <p>72100 Brindisi (BR) Italia</p>
                    <p>T +39 351 531 7762</p>
                    <p>info@yas-arch.com</p>
                  </>
                )}
              </div>
              {p?.website ? (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-[1.5px] border-[#333] rounded-[100px] px-[14px] py-[4px] text-[11px] text-[#333] leading-normal hover:bg-[#333] hover:text-white transition-colors duration-200"
                >
                  Website
                </a>
              ) : (
                <div className="inline-flex items-center border-[1.5px] border-[#333] rounded-[100px] px-[14px] py-[4px] text-[11px] text-[#333] leading-normal">
                  Website
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MemberCard({
  member,
  expanded,
  onToggle,
}: {
  member: TeamMember | null;
  expanded: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="mb-[40px]">
      {/* Photo */}
      <div className="relative w-full overflow-hidden mb-[12px]" style={{ height: "451px" }}>
        {member?.photo ? (
          <Image
            src={urlFor(member.photo).width(449).url()}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#d9d9d9]" />
        )}
      </div>

      {/* Name + toggle button */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[17.5px] leading-[1.5] text-[#282828]">
            {member?.name ?? "Nome Cognome"}
          </p>
          <div
            className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[24px] overflow-hidden text-[12px] text-[#333] leading-[22px]"
            style={{ height: "27px" }}
          >
            {member?.role ?? "Principal Architect"}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-[#282828] text-[28px] font-light leading-none shrink-0 hover:opacity-50 transition-all duration-300"
          style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-label={expanded ? "Chiudi bio" : "Apri bio"}
        >
          +
        </button>
      </div>

      {/* Expandable bio */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: expanded ? "600px" : "0px", opacity: expanded ? 1 : 0 }}
      >
        <div className="mt-[12px] text-[17.5px] leading-[1.5] text-[#282828]">
          {member?.bio ? (
            <PortableText
              value={member.bio as Parameters<typeof PortableText>[0]["value"]}
              components={{
                block: { normal: ({ children }) => <p className="mb-[1em]">{children}</p> },
              }}
            />
          ) : (
            <p>
              Architetto con esperienza pluriennale nella progettazione residenziale e commerciale.
              Specializzato nel design d&apos;interni e nella valorizzazione degli spazi attraverso
              soluzioni innovative e materiali di qualità.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
