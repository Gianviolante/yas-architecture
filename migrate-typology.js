import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2021-06-07",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function migrateTypology() {
  console.log("🔄 Starting typology migration...\n");

  const projects = await client.fetch(`*[_type == "project"]`);
  console.log(`Found ${projects.length} projects\n`);

  let migratedCount = 0;

  for (const project of projects) {
    const { _id, title, typology } = project;

    // Check if typology is a string (needs migration)
    if (typeof typology === "string") {
      try {
        await client.patch(_id).set({ typology: [typology] }).commit();
        console.log(`✅ ${title}: "${typology}" → ["${typology}"]`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ ${title}: ${error.message}`);
      }
    } else if (Array.isArray(typology)) {
      console.log(`⏭️  ${title}: Already an array`);
    } else {
      console.log(`⚠️  ${title}: Unexpected type`);
    }
  }

  console.log(`\n✨ Migration complete! ${migratedCount} projects updated.`);
}

migrateTypology().catch(console.error);
