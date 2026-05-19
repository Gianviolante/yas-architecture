import { defineType, defineField } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug", title: "Slug", type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type", title: "Tipo", type: "string",
      options: { list: ["News", "Evento"], layout: "radio" },
      initialValue: "Evento",
    }),
    defineField({ name: "date", title: "Data", type: "datetime" }),
    defineField({
      name: "coverImage", title: "Immagine copertina", type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "location",    title: "Location",     type: "string" }),
    defineField({ name: "area",         title: "Area",         type: "string" }),
    defineField({ name: "timeline",     title: "Timeline",     type: "string" }),
    defineField({ name: "typology",     title: "Tipologia",    type: "string" }),
    defineField({ name: "description",  title: "Descrizione (intro)", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "body",         title: "Testo corpo",  type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "gallery", title: "Galleria immagini", type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", media: "coverImage" },
  },
});
