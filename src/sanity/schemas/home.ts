import { defineType, defineField } from "sanity";

export const homeSchema = defineType({
  name: "home",
  title: "Home (contenuti)",
  type: "document",
  fields: [
    // ── HERO SECTION ──────────────────────────────────────
    defineField({
      name: "heroSubtitleLeft",
      title: "Hero: Sottotitolo sinistro",
      description: "Es. 'Studio architettura' e 'e design'",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "heroTitleMain",
      title: "Hero: Titolo principale",
      description: "Es. 'yas-arch' — testo grande della sezione hero",
      type: "string",
    }),
    defineField({
      name: "heroSubtitleRight",
      title: "Hero: Sottotitolo destro",
      description: "Es. 'Apulian inspiration guide'",
      type: "string",
    }),
    defineField({
      name: "heroAddress",
      title: "Hero: Indirizzo e contatti",
      description: "Indirizzo, telefono, email",
      type: "array",
      of: [{ type: "block" }],
    }),
    // ── DESCRIZIONE SECTION ──────────────────────────────
    defineField({
      name: "introDescription",
      title: "Sezione Descrizione: Testo introduttivo",
      description: "Testo grande 24px nella sezione descrizione",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyLeft",
      title: "Sezione Descrizione: Colonna sinistra",
      description: "Testo più piccolo, colonna sinistra",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bodyRight",
      title: "Sezione Descrizione: Colonna destra",
      description: "Testo più piccolo, colonna destra (hidden su mobile)",
      type: "array",
      of: [{ type: "block" }],
    }),
    // ── STUDIO SECTION ───────────────────────────────────
    defineField({
      name: "studioDescription",
      title: "Sezione Studio: Testo descrizione",
      description: "Testo grande 24px nella sezione Lo studio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "studioImage",
      title: "Sezione Studio: Immagine",
      description: "Immagine della sezione Lo studio (245px mobile / 631px desktop)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home — contenuti editabili" }),
  },
});
