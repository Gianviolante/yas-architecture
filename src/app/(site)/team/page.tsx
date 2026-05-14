import { sanityClient } from "@/lib/sanity/client";
import { allTeamMembersQuery, allPartnersQuery } from "@/lib/sanity/queries";
import type { TeamMember, Partner } from "@/lib/sanity/types";
import TeamClient from "@/components/sections/TeamClient";

export const revalidate = 60;

export const metadata = {
  title: "Team — YAS Architecture",
};

export default async function TeamPage() {
  const [teamMembers, partners]: [TeamMember[], Partner[]] = await Promise.all([
    sanityClient.fetch(allTeamMembersQuery),
    sanityClient.fetch(allPartnersQuery),
  ]);

  return <TeamClient teamMembers={teamMembers} partners={partners} />;
}
