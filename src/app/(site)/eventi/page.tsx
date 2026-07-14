import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { allEventsQuery } from "@/lib/sanity/queries";
import type { Event } from "@/lib/sanity/types";
import EventiClient from "@/components/sections/EventiClient";

export const revalidate = 60;
export const metadata = { title: "Eventi — YAS Architecture" };

// Pagina nascosta su richiesta cliente (2026-07-14) — rimuovere questo notFound() per riattivarla.
export default async function EventiPage() {
  notFound();
  const events: Event[] = await sanityClient.fetch(allEventsQuery);
  return <EventiClient events={events} />;
}
