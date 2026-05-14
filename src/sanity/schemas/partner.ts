import { defineType, defineField } from "sanity";

export const partnerSchema = defineType({
  name: "partner",
  title: "Partner / Associato",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "address", title: "Indirizzo", type: "text", rows: 2 }),
    defineField({ name: "website", title: "Sito web", type: "url" }),
  ],
});
