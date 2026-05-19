import { defineType, defineField } from "sanity";

export const studioSchema = defineType({
  name: "studio",
  title: "Studio (informazioni)",
  type: "document",
  fields: [
    defineField({ name: "description",         title: "Testo introduttivo (Lo studio)", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "spaziDescription",    title: "Testo sezione Lo spazio",        type: "array", of: [{ type: "block" }] }),
    defineField({ name: "crescitaDescription", title: "Testo sezione Crescita",         type: "array", of: [{ type: "block" }] }),
    defineField({ name: "teamDescription",     title: "Testo sezione Il team",          type: "array", of: [{ type: "block" }] }),
    defineField({ name: "progettiDescription", title: "Testo sezione Progetti",         type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "heroImage", title: "Hero image (Lo studio)", type: "image", options: { hotspot: true },
    }),
    defineField({
      name: "spaziImages", title: "Immagini Lo spazio (2)", type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [defineField({ name: "caption", title: "Didascalia", type: "string" })] }],
    }),
    defineField({
      name: "crescitaImages", title: "Immagini Crescita (2)", type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "mainImage", title: "Immagine separatore full-width", type: "image", options: { hotspot: true },
    }),
    defineField({
      name: "teamPortrait", title: "Ritratto team (Il team)", type: "image", options: { hotspot: true },
    }),
  ],
});
