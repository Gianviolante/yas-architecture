import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { vercelProtectionBypassTool } from "@sanity/vercel-protection-bypass";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  basePath: "/admin",
  name: "yas-architecture",
  title: "YAS Architecture CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    vercelProtectionBypassTool(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("YAS Architecture")
          .items([
            S.listItem().title("Progetti").schemaType("project").child(S.documentTypeList("project")),
            S.listItem().title("Team").schemaType("teamMember").child(S.documentTypeList("teamMember")),
            S.listItem().title("Studio").schemaType("studio").child(
              S.document().schemaType("studio").documentId("studio")
            ),
            S.listItem().title("Home (contenuti)").schemaType("home").child(
              S.document().schemaType("home").documentId("home-singleton")
            ),
            S.listItem().title("Eventi").schemaType("event").child(S.documentTypeList("event")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
