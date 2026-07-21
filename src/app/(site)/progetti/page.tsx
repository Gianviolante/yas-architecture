import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery, progettiIntroQuery } from "@/lib/sanity/queries";
import type { Project, ProgettiIntro } from "@/lib/sanity/types";
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
  const [projects, progettiIntro, params] = await Promise.all([
    sanityClient.fetch(allProjectsQuery) as Promise<Project[]>,
    sanityClient.fetch(progettiIntroQuery) as Promise<ProgettiIntro | null>,
    searchParams,
  ]);

  return <ProgettiClient projects={projects} progettiIntro={progettiIntro} initialTypology={params.tipologia} />;
}
