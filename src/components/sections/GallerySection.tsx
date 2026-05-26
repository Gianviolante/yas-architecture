"use client";

import { useState } from "react";
import GallerySlider, { type GalleryItem } from "@/components/sections/GallerySlider";

interface Props {
  items: GalleryItem[];
  projectTitle: string;
}

export default function GallerySection({ items, projectTitle }: Props) {
  const [compact, setCompact] = useState(false);

  return (
    <div className="mt-[26px]">
      <button
        onClick={() => setCompact((v) => !v)}
        className="hidden md:block px-[47px] text-[12px] leading-[1.2] text-[#282828] mb-[16px] hover:opacity-60 transition-opacity"
      >
        {compact ? "Visualizza come slider" : "Visualizza come miniature"}
      </button>
      <GallerySlider items={items} projectTitle={projectTitle} compact={compact} />
    </div>
  );
}
