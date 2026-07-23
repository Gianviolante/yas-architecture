"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { metadata, viewport } from "next-sanity/studio";

export const dynamic = "force-static";
export { metadata, viewport };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
