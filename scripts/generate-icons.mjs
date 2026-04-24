// Script per generar els PNGs de la PWA a partir del SVG base.
// S'executa amb `npm run icons`.
// Crea: pwa-192x192.png, pwa-512x512.png i apple-touch-icon.png.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');

const svgPath = path.join(publicDir, 'favicon.svg');
const svg = await readFile(svgPath);

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  const out = path.join(publicDir, name);
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  await writeFile(out, buf);
  console.log('Generat:', name);
}
