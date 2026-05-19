import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import ProgettiClient from "@/components/sections/ProgettiClient";

export const revalidate = 60;

export const metadata = {
  title: "Progetti — YAS Architecture",
};

export default async function ProgettiPage({
  searchParams,
}: {
  searchParams: Promise<{ tipologia?: string }>;
}) {
  const [projects, params] = await Promise.all([
    sanityClient.fetch(allProjectsQuery) as Promise<Project[]>,
    searchParams,
  ]);

  return <ProgettiClient projects={projects} initialTypology={params.tipologia} />;
}
