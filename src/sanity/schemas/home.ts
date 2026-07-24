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
      description: "Es. 'yas-arc' — testo grande della sezione hero",
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
    // ── SLIDER IMAGES ────────────────────────────────────
    defineField({
      name: "sliderImages",
      title: "Sezione Slider: Immagini",
      description: "Immagini dello slider (aspect ratio 16:9)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    // ── NAV LINKS ────────────────────────────────────────
    defineField({
      name: "navLinks",
      title: "Sezione Link: Progetti/Studio/Team",
      description: "Link e immagini per i tre link principali",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              description: "Es. /progetti, /studio, /team",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Es. Progetti, Studio, Team",
            }),
            defineField({
              name: "image",
              title: "Immagine",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "flexGrow",
              title: "Flex Grow (desktop)",
              type: "number",
              description: "Proporzione della larghezza — Es. 449, 333",
            }),
            defineField({
              name: "mobileHeight",
              title: "Mobile Height (px)",
              type: "number",
              description: "Altezza mobile in pixel — Es. 268, 361",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "href",
              media: "image",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home — contenuti editabili" }),
  },
});
