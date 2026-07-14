import { sanityClient } from "@/lib/sanity/client";
import { allTeamMembersQuery } from "@/lib/sanity/queries";
import type { TeamMember } from "@/lib/sanity/types";
import TeamClient from "@/components/sections/TeamClient";

export const revalidate = 60;

export const metadata = {
  title: "Team — YAS Architecture",
};

export default async function TeamPage() {
  const teamMembers: TeamMember[] = await sanityClient.fetch(allTeamMembersQuery);

  return <TeamClient teamMembers={teamMembers} />;
}
