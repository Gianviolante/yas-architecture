import { defineType, defineField } from "sanity";

export const homeSchema = defineType({
  name: "home",
  title: "Home (contenuti)",
  type: "document",
  fields: [
    defineField({
      name: "introDescription",
      title: "Testo introduttivo (sezione descrizione)",
      description: "Testo grande 24px nella sezione descrizione",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyLeft",
      title: "Colonna sinistra (sezione descrizione)",
      description: "Testo più piccolo, colonna sinistra",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyRight",
      title: "Colonna destra (sezione descrizione)",
      description: "Testo più piccolo, colonna destra",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "studioDescription",
      title: "Testo sezione Studio (in homepage)",
      description: "Testo grande 24px nella sezione Lo studio in homepage",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home — contenuti" }),
  },
});
