/**
 * Seed script — popola Sanity con progetti di esempio.
 * Esegui con: node scripts/seed-projects.mjs
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const projects = [
  // ── Featured (card grandi) ─────────────────────────────────
  {
    _type: "project",
    title: "Lamia Santolina",
    slug: { _type: "slug", current: "lamia-santolina" },
    location: "Carovigno, BR",
    year: 2024,
    area: 320,
    typology: "Architettura",
    status: "Realizzato",
    featured: true,
  },
  {
    _type: "project",
    title: "IBCenter",
    slug: { _type: "slug", current: "ibcenter" },
    location: "Brindisi, IT",
    year: 2023,
    area: 1200,
    typology: "Commerciale",
    status: "Realizzato",
    featured: true,
  },
  {
    _type: "project",
    title: "Casaparque",
    slug: { _type: "slug", current: "casaparque" },
    location: "Panama City, PA",
    year: 2023,
    area: 4500,
    typology: "Residenziale",
    status: "Realizzato",
    featured: true,
  },
  {
    _type: "project",
    title: "Habitat Puerto Pilón",
    slug: { _type: "slug", current: "habitat-puerto-pilon" },
    location: "Colón, PA",
    year: 2022,
    area: 8000,
    typology: "Residenziale",
    status: "Realizzato",
    featured: true,
  },
  // ── Non featured (card piccole) ────────────────────────────
  {
    _type: "project",
    title: "Net Ferry Headquarters",
    slug: { _type: "slug", current: "net-ferry-headquarters" },
    location: "Brindisi, IT",
    year: 2022,
    area: 2400,
    typology: "Commerciale",
    status: "Realizzato",
    featured: false,
  },
  {
    _type: "project",
    title: "Villa L",
    slug: { _type: "slug", current: "villa-l" },
    location: "Brindisi, IT",
    year: 2022,
    area: 450,
    typology: "Architettura",
    status: "Realizzato",
    featured: false,
  },
  {
    _type: "project",
    title: "Ex-Gelato Pavillo",
    slug: { _type: "slug", current: "ex-gelato-pavillo" },
    location: "Lecce, IT",
    year: 2023,
    area: 680,
    typology: "Interior Design",
    status: "In corso",
    featured: false,
  },
  {
    _type: "project",
    title: "L'arte del Gelato",
    slug: { _type: "slug", current: "arte-del-gelato" },
    location: "New York, NY",
    year: 2023,
    area: 120,
    typology: "Interior Design",
    status: "Realizzato",
    featured: false,
  },
  {
    _type: "project",
    title: "Residenza Appia",
    slug: { _type: "slug", current: "residenza-appia" },
    location: "Brindisi, IT",
    year: 2024,
    area: 280,
    typology: "Architettura",
    status: "In approvazione",
    featured: false,
  },
  {
    _type: "project",
    title: "Marina View",
    slug: { _type: "slug", current: "marina-view" },
    location: "Ostuni, BR",
    year: 2024,
    area: 520,
    typology: "Architettura",
    status: "In corso",
    featured: false,
  },
];

async function seed() {
  console.log(`Connessione a Sanity (project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID})…`);

  // Elimina progetti esistenti per evitare duplicati
  const existing = await client.fetch(`*[_type == "project"]._id`);
  if (existing.length > 0) {
    console.log(`Trovati ${existing.length} progetti esistenti — eliminazione…`);
    await Promise.all(existing.map((id) => client.delete(id)));
  }

  console.log(`Creazione di ${projects.length} progetti…`);
  for (const project of projects) {
    const doc = await client.create(project);
    console.log(`  ✓ ${doc.title} (${doc._id})`);
  }

  console.log("\nSeed completato.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
