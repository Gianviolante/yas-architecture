"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/sanity/types";

const CATEGORIES = [
  { label: "Residenziali",    href: "/progetti?tipologia=Residenziale" },
  { label: "Commerciali",     href: "/progetti?tipologia=Commerciale" },
  { label: "Interior Design", href: "/progetti?tipologia=Interior Design" },
  { label: "Architettura",    href: "/progetti?tipologia=Architettura" },
  { label: "Tutti i progetti", href: "/progetti" },
];

interface Props {
  projects: Project[];
}

export default function HomeHeroSection({ projects }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (projects.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(id);
  }, [projects.length]);

  const project = projects[current] ?? null;

  return (
    <div className="flex gap-[40px] page-px py-[48px] items-start">
      {/* Left column — carousel */}
      <div className="w-[420px] shrink-0">
        {/* Image */}
        <div className="relative h-[380px] overflow-hidden">
          {project?.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#d9d9d9]" />
          )}
        </div>

        {/* Dot navigation */}
        {projects.length > 1 && (
          <div className="flex gap-[6px] mt-[10px]">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`w-[8px] h-[8px] rounded-full transition-colors duration-200 ${
                  i === current ? "bg-[#282828]" : "bg-[#d9d9d9]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Caption */}
        {project && (
          <div className="mt-[8px]">
            <p className="text-[17.5px] leading-[1.5] text-[#282828]">
              {[project.location, project.title].filter(Boolean).join(", ")}
            </p>
            {project.typology && (
              <span className="inline-flex items-center border-2 border-[#333] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[#333] leading-[1.4] mt-[4px]">
                {project.typology}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right column — category links */}
      <div className="flex-1 flex flex-col justify-center min-h-[380px]">
        {CATEGORIES.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[48px] font-light leading-[1.1] text-[#282828] hover:text-[#b0b0b0] transition-colors duration-200"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
