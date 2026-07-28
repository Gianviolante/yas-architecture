"use client";

import { useState } from "react";
import Image from "next/image";
import GallerySlider, { type GalleryItem } from "@/components/sections/GallerySlider";

interface Props {
  items: GalleryItem[];
  projectTitle: string;
  allGalleryItems?: GalleryItem[]; // Tutti gli item inclusi i primi 2
  onLightboxOpen?: (index: number) => void;
}

export default function GallerySection({ items, projectTitle, allGalleryItems, onLightboxOpen }: Props) {
  const [compact, setCompact] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Se allGalleryItems è fornito, mostra le due foto quadrate
  const showSquareImages = allGalleryItems && allGalleryItems.length >= 2;

  const handleSquareImageClick = (index: number) => {
    setLightboxIndex(index);
    onLightboxOpen?.(index);
  };

  return (
    <div className="mt-[26px]">
      {/* Two square images (YAS-style) - clickable on mobile - grid aligned */}
      {showSquareImages && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px] page-px mb-[48px]">
          {allGalleryItems!.slice(0, 2).map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleSquareImageClick(idx)}
              cursor-type="expand"
              className="relative aspect-square overflow-hidden bg-[#d9d9d9] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={img.url}
                alt={img.caption ?? `${projectTitle} — ${idx + 1}`}
                fill
                className="object-cover md:pointer-events-none"
              />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setCompact((v) => !v)}
        className="hidden md:block page-px text-[12px] leading-[1.2] text-primary mb-[16px] hover:opacity-60 transition-opacity"
      >
        {compact ? "Visualizza come slider" : "Visualizza come miniature"}
      </button>
      <GallerySlider
        items={items}
        projectTitle={projectTitle}
        compact={compact}
        initialLightboxIndex={lightboxIndex}
        allItems={allGalleryItems}
        onImageClick={(index) => setLightboxIndex(index)}
      />
    </div>
  );
}
