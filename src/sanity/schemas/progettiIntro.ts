import { defineType, defineField } from "sanity";

export const progettiIntroSchema = defineType({
  name: "progettiIntro",
  title: "Progetti — Testo introduttivo",
  type: "document",
  fields: [
    defineField({
      name: "text",
      title: "Testo introduttivo",
      type: "array",
      of: [{ type: "block" }],
      description: "Testo che appare in cima alla pagina progetti",
    }),
  ],
});
