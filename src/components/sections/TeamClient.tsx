"use client";

import { useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils/cn";
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

export default function TeamClient({ teamMembers, partners }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("studio");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const studioMembers = teamMembers.filter((m) => m.type === "Studio");
  const designers = teamMembers.filter((m) => m.type === "Designer");
  const displayed = activeTab === "studio" ? studioMembers : designers;

  return (
    <div className="pt-[53px]">
      {/* Sub-nav tabs */}
      <div className="max-w-[1440px] mx-auto px-8 pt-8 pb-6 flex justify-center gap-1">
        {(["studio", "designers"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-sm px-5 py-1.5 rounded-full border transition-all duration-200 capitalize",
              activeTab === tab
                ? "border-black bg-black text-white"
                : "border-gray-light text-black/60 hover:border-black/40 hover:text-black"
            )}
          >
            {tab === "studio" ? "Lo studio" : "Designers"}
          </button>
        ))}
      </div>

      {/* Section heading + intro */}
      <div className="max-w-[1440px] mx-auto px-8 pb-10">
        <p className="text-xs text-black/40 uppercase tracking-widest text-center mb-4">Il team</p>
        <p className="text-sm text-black/70 leading-relaxed max-w-2xl mx-auto text-center">
          I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia,
          continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva,
          facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento
          dell&apos;occhio tra di esse.
        </p>
      </div>

      {/* Team grid */}
      <div className="max-w-[1440px] mx-auto px-8 pb-16">
        {displayed.length === 0 ? (
          <p className="text-sm text-black/40 text-center py-12">Nessun membro trovato.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-0">
            {displayed.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                expanded={expandedId === member._id}
                onToggle={() => setExpandedId(expandedId === member._id ? null : member._id)}
                urlFor={urlFor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Partners section */}
      {partners.length > 0 && (
        <div className="border-t border-gray-light pt-12 pb-16">
          <div className="max-w-[1440px] mx-auto px-8">
            <p className="text-xs text-black/40 uppercase tracking-widest text-center mb-4">
              Associati e Partners
            </p>
            <p className="text-sm text-black/70 leading-relaxed max-w-2xl mx-auto text-center mb-10">
              I benefici derivanti dall&apos;utilizzo di una griglia sono evidenti: chiarezza, efficienza, economia,
              continuità. Prima di ogni altra cosa, una griglia introduce ordine sistematico a una struttura visiva,
              facilitando la distinzione delle diverse categorie informative e indirizzando lo spostamento
              dell&apos;occhio tra di esse.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((p) => (
                <div key={p._id} className="text-sm text-black/70 space-y-1">
                  <p className="font-medium text-black">{p.name}</p>
                  {p.address && <p className="text-xs">{p.address}</p>}
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs px-4 py-1 rounded-full border border-gray-light hover:border-black transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({
  member,
  expanded,
  onToggle,
  urlFor,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
  urlFor: (img: SanityImage) => { width: (n: number) => { url: () => string } };
}) {
  return (
    <div className="border-b border-gray-light pb-6 mb-6">
      {/* Portrait */}
      <div className="relative aspect-[3/4] bg-gray-lighter overflow-hidden mb-3">
        {member.photo ? (
          <Image
            src={urlFor(member.photo).width(400).url()}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gray-lighter" />
        )}
      </div>

      {/* Name + role + expand */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full border border-gray-light text-black/50">
            {member.role}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-full border border-gray-light flex items-center justify-center text-black/40 hover:border-black hover:text-black transition-all duration-200 shrink-0"
          aria-label={expanded ? "Chiudi bio" : "Leggi bio"}
        >
          <span className="text-base leading-none">{expanded ? "−" : "+"}</span>
        </button>
      </div>

      {/* Expandable bio */}
      {expanded && !!member.bio && (
        <div className="mt-4 text-xs text-black/60 leading-relaxed">
          <PortableText value={member.bio as Parameters<typeof PortableText>[0]["value"]} />
        </div>
      )}
    </div>
  );
}
