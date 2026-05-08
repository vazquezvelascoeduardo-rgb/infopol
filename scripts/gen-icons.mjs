// scripts/gen-icons.mjs
// Genera els icones PNG (apple-touch-icon, pwa-192, pwa-512) a partir
// del nou shield-i sobre fons paper amb cantonades arrodonides (estil
// "tile" iOS/Android). Path-only — no depèn de cap tipografia.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'public');

const PAPER = '#FAF6EF';
const INK = '#0E0E0E';
const TER = '#F26B1F';

// Tile complet: fons paper arrodonit + shield-i centrat al 60% de la mida.
function tileSvg(size) {
  const r = Math.round(size * 0.22); // radi cantonades estil iOS
  const inner = Math.round(size * 0.62); // mida del shield dins del tile
  const pad = Math.round((size - inner) / 2);
  // Escala el shield (viewBox natiu 64×64) a `inner`.
  const k = inner / 64;
  const shield = `
    <g transform="translate(${pad}, ${pad}) scale(${k})">
      <path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill="${INK}"/>
      <circle cx="32" cy="22" r="4.2" fill="${TER}"/>
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill="${TER}"/>
    </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${PAPER}"/>
  ${shield}
</svg>`;
}

// Maskable: el sistema retalla el 10% exterior. Mantenim el shield al
// 50% per estar dins de la "safe zone" + fons paper sòlid (sense radi).
function maskableSvg(size) {
  const inner = Math.round(size * 0.5);
  const pad = Math.round((size - inner) / 2);
  const k = inner / 64;
  const shield = `
    <g transform="translate(${pad}, ${pad}) scale(${k})">
      <path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill="${INK}"/>
      <circle cx="32" cy="22" r="4.2" fill="${TER}"/>
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill="${TER}"/>
    </g>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${PAPER}"/>
  ${shield}
</svg>`;
}

async function render(svgString, outPath) {
  const buf = Buffer.from(svgString);
  await sharp(buf, { density: 300 }).png().toFile(outPath);
  console.log('· wrote', outPath);
}

await render(tileSvg(180), join(out, 'apple-touch-icon.png'));
await render(tileSvg(192), join(out, 'pwa-192x192.png'));
await render(tileSvg(512), join(out, 'pwa-512x512.png'));
await render(maskableSvg(512), join(out, 'pwa-512x512-maskable.png'));

console.log('done.');
