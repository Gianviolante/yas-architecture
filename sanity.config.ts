import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "yas-architecture",
  title: "YAS Architecture CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("YAS Architecture")
          .items([
            S.listItem().title("Progetti").schemaType("project").child(S.documentTypeList("project")),
            S.listItem().title("Team").schemaType("teamMember").child(S.documentTypeList("teamMember")),
            S.listItem().title("Partner").schemaType("partner").child(S.documentTypeList("partner")),
            S.listItem().title("Studio").schemaType("studioInfo").child(
              S.document().schemaType("studioInfo").documentId("studioInfo")
            ),
            S.listItem().title("Eventi").schemaType("event").child(S.documentTypeList("event")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
