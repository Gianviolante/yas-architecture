import { sanityClient } from "@/lib/sanity/client";
import { allEventsQuery } from "@/lib/sanity/queries";
import type { Event } from "@/lib/sanity/types";
import EventiClient from "@/components/sections/EventiClient";

export const revalidate = 60;
export const metadata = { title: "Eventi — YAS Architecture" };

export default async function EventiPage() {
  const events: Event[] = await sanityClient.fetch(allEventsQuery);
  return <EventiClient events={events} />;
}
