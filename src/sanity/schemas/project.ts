import { defineType, defineField } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Progetto",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location (es. Panama City, PA)", type: "string" }),
    defineField({ name: "year", title: "Anno", type: "number" }),
    defineField({ name: "area", title: "Area (mq)", type: "number" }),
    defineField({
      name: "typology", title: "Tipologia", type: "string",
      options: { list: ["Architettura", "Interior Design", "Residenziale", "Commerciale", "Altro"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status", title: "Stato", type: "string",
      options: { list: ["In corso", "In approvazione", "Realizzato"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "coverImage", title: "Immagine copertina (card)", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroImage", title: "Hero image (pagina progetto)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery", title: "Galleria immagini", type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "description", title: "Descrizione", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "teamMembers", title: "Team", type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "coverImage" },
  },
});
