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
      name: "typology", title: "Tipologia", type: "array",
      of: [{ type: "string" }],
      options: { list: ["Architettura", "Interior Design", "Residenziale", "Commerciale", "Altro"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status", title: "Stato", type: "string",
      options: { list: ["In corso", "Progetti", "Realizzato"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "In evidenza (card grande)",
      type: "boolean",
      description: "Spunta per mostrare questo progetto nella card grande in cima alla griglia. Max 4 consigliati.",
      initialValue: false,
    }),
    defineField({ name: "coverImage", title: "Immagine copertina (card)", type: "image", options: { hotspot: true } }),
    defineField({ name: "hoverImage", title: "Immagine hover (anteprima lista)", type: "image", options: { hotspot: true },
      description: "Immagine mostrata nell'anteprima quando passi il mouse sul progetto nella vista a lista. Se non inserita, viene usata l'immagine copertina." }),
    defineField({ name: "heroImage", title: "Hero image (pagina progetto)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery", title: "Galleria immagini", type: "array",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({ name: "caption", title: "Didascalia", type: "string" }),
        ],
      }],
    }),
    defineField({ name: "concept", title: "Concept", type: "string",
      description: "Es: arch. Angelo Melcarne" }),
    defineField({ name: "projectTeam", title: "Progetto (team esteso)", type: "string",
      description: "Es: YAS architecture associati + arch. Antonio De Castro" }),
    defineField({ name: "photographer", title: "Fotografo", type: "string",
      description: "Es: Studio Voda + Pierluigi Schena" }),
    defineField({ name: "rendering", title: "Rendering", type: "string",
      description: "Es: YAS Architecture" }),
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
