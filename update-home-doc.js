#!/usr/bin/env node
const sanityClient = require('@sanity/client');

const client = sanityClient.default({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ubvv2ot0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2025-01-15',
  useCdn: false
});

const patch = {
  sliderImages: [],
  navLinks: [
    {
      href: "/progetti",
      label: "Progetti",
      image: { _type: "image", asset: { _ref: "image-abc123-1200x800-jpg" } },
      flexGrow: 449,
      mobileHeight: 268
    },
    {
      href: "/studio",
      label: "Studio",
      image: { _type: "image", asset: { _ref: "image-def456-1200x800-jpg" } },
      flexGrow: 333,
      mobileHeight: 361
    },
    {
      href: "/team",
      label: "Team",
      image: { _type: "image", asset: { _ref: "image-ghi789-1200x800-jpg" } },
      flexGrow: 333,
      mobileHeight: 361
    }
  ]
};

client.patch('home-singleton')
  .set(patch)
  .commit()
  .then(() => {
    console.log('✅ Documento aggiornato con successo!');
  })
  .catch(err => {
    console.error('❌ Errore:', err);
  });
