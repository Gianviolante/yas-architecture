import { defineType, defineField } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", title: "Data", type: "datetime" }),
    defineField({ name: "description", title: "Descrizione", type: "array", of: [{ type: "block" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
