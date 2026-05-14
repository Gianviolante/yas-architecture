import { defineType, defineField } from "sanity";

export const teamMemberSchema = defineType({
  name: "teamMember",
  title: "Membro del team",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Ruolo (es. Principal Architect)", type: "string" }),
    defineField({ name: "photo", title: "Foto", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", title: "Biografia", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "type", title: "Tipo", type: "string",
      options: { list: ["Studio", "Designer", "Partner"] },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
