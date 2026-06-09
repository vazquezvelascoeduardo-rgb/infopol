// Genera public/sitemap.xml amb les rutes públiques principals.
// S'executa automàticament abans del build (script "prebuild").
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE = 'https://infopol.app';
const today = new Date().toISOString().slice(0, 10);

// Rutes públiques estables (accessibles sense sessió o d'alt valor SEO).
// { loc, changefreq, priority }
const ROUTES = [
  ['/', 'daily', '1.0'],
  ['/operativa', 'weekly', '0.9'],
  ['/superbuscador', 'weekly', '0.8'],
  ['/calculadora-alcohol', 'monthly', '0.7'],
  ['/croquis', 'monthly', '0.7'],
  ['/cultura-general', 'weekly', '0.7'],
  ['/actualitat', 'weekly', '0.6'],
  ['/noticies', 'daily', '0.8'],
  // Fitxes públiques de /leyes (vegeu PUBLIC_LEYES_CARDS a App.tsx)
  ['/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026', 'weekly', '0.8'],
  ['/leyes/s/novetats/vmp-vpl-novetats-2026', 'monthly', '0.6'],
  ['/leyes/s/novetats/quarta-reforma-constitucio-2026', 'monthly', '0.6'],
  ['/avis-legal', 'yearly', '0.2'],
  ['/privacitat', 'yearly', '0.2'],
];

const body = ROUTES.map(([loc, cf, pr]) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`,
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml generat amb ${ROUTES.length} rutes (${today}).`);
