import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import ProgettiClient from "@/components/sections/ProgettiClient";

export const revalidate = 60;

export const metadata = {
  title: "Progetti — YAS Architecture",
};

export default async function ProgettiPage() {
  const projects: Project[] = await sanityClient.fetch(allProjectsQuery);

  return <ProgettiClient projects={projects} />;
}
