import { defineType, defineField } from "sanity";

export const studioSchema = defineType({
  name: "studioInfo",
  title: "Studio (informazioni)",
  type: "document",
  fields: [
    defineField({ name: "description", title: "Descrizione", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "images", title: "Immagini", type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  // singleton gestito via structureTool in sanity.config.ts (documentId fisso)
});
