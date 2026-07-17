const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTHS = [480, 1200, 2400];
const FORMATS = [
  { format: 'jpeg', options: { quality: 80 } },
  { format: 'webp', options: { quality: 75 } },
  { format: 'avif', options: { quality: 75 } },
];

const SOURCE_DIR = './public/source-images'; // Cartella con immagini originali
const OUTPUT_DIR = './public/images/optimized';

async function optimizeImages() {
  // Crea cartella output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Leggi immagini sorgente
  const files = fs.readdirSync(SOURCE_DIR).filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  console.log(`📸 Ottimizzando ${files.length} immagini...`);

  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, file);
    const basename = path.parse(file).name;

    try {
      for (const width of WIDTHS) {
        for (const { format, options } of FORMATS) {
          const outputPath = path.join(
            OUTPUT_DIR,
            `${basename}-${width}w.${format}`
          );

          await sharp(sourcePath)
            .resize(width, width, {
              fit: 'cover',
              position: 'center',
            })
            [format](options)
            .toFile(outputPath);

          const stats = fs.statSync(outputPath);
          const sizeKb = (stats.size / 1024).toFixed(2);
          console.log(`  ✅ ${basename}-${width}w.${format} (${sizeKb}KB)`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Errore con ${file}:`, error.message);
    }
  }

  console.log(`\n✨ Ottimizzazione completata!`);
  console.log(`📁 Immagini salvate in: ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
