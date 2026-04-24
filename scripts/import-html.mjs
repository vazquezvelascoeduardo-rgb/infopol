// Script d'importació automàtica de HTML a fitxes Markdown.
// Ús:  npm run import
//
// Llegeix tots els fitxers .html dins de /_import (recursiu),
// els converteix a Markdown i els desa a /content/<modul>/<slug>.md
// classificant-los automàticament per paraules clau.
//
// Classificació:
//   1r) Si el nom del fitxer o la subcarpeta conté una paraula clau
//       d'un mòdul, s'hi assigna directament.
//   2r) Si no, s'analitza el contingut (primers 4 KB) i es compten
//       coincidències de les paraules clau de cada mòdul. Guanya el
//       que tingui més.
//   3r) Si no hi ha cap coincidència clara, va a /content/_sense-classificar/
//       perquè el revisis manualment.

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMPORT_DIR = path.join(ROOT, '_import');
const CONTENT_DIR = path.join(ROOT, 'content');
const UNCLASSIFIED_DIR = path.join(CONTENT_DIR, '_sense-classificar');

// Definició dels mòduls i paraules clau que fem servir per classificar.
// Les claus han de coincidir amb els slugs dels mòduls a src/lib/content.ts.
const MODULE_KEYWORDS = {
  ce78: [
    'constitució espanyola',
    'constitucion española',
    'ce 78',
    'ce78',
    'ce-78',
    'constitució',
    'constitucional',
  ],
  'codi-penal': [
    'codi penal',
    'código penal',
    'lo 10/1995',
    'art. cp',
    'art cp',
    'del·licte',
    'delicte',
    'delito',
    'lesions',
    'furts',
    'robatori',
    'homicidi',
  ],
  eac: [
    "estatut d'autonomia",
    'estatut autonomia',
    'eac',
    'lo 6/2006',
    'generalitat',
  ],
  fcs: [
    'forces i cossos',
    'fuerzas y cuerpos',
    'fcs',
    'lo 2/1986',
    'mossos',
    'policia local',
    'policía local',
    'guàrdia civil',
    'guardia civil',
    "policia nacional",
    "policía nacional",
  ],
  lecrim: [
    "enjudiciament criminal",
    "enjuiciamiento criminal",
    'lecrim',
    'lecr',
    'atestat',
    'atestado',
    'detenció',
    'detención',
    'habeas corpus',
  ],
  menors: [
    'menor',
    'menors',
    'menores',
    'lo 5/2000',
    'lorpm',
    'responsabilitat penal del menor',
  ],
  municipi: [
    'municipi',
    'municipal',
    'ordenança',
    'ordenanza',
    'ajuntament',
    'ayuntamiento',
    'llei municipal',
    'ley municipal',
    'regim local',
    'règim local',
    'viladecans',
  ],
  sc: [
    'seguretat ciutadana',
    'seguridad ciudadana',
    'lopsc',
    'lo 4/2015',
    'protecció de la seguretat',
  ],
  transit: [
    'trànsit',
    'transit',
    'tráfico',
    'trafico',
    'circulació',
    'circulación',
    'seguretat viària',
    'seguridad vial',
    'rdl 6/2015',
    'rgc',
    'reglament general',
    'reglamento general',
    'permís de conduir',
    'permiso de conducir',
    'alcoholèmia',
    'alcoholemia',
  ],
};

// Configurem el convertidor HTML → Markdown.
const td = new TurndownService({
  headingStyle: 'atx', // # en comptes de ===
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});
// Netegem tags que Google Docs afegeix i no aporten res.
td.remove(['style', 'script']);

// Normalitza un text: minúscules i sense accents. Útil per cercar paraules clau.
function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Genera un slug apte per nom de fitxer (minúscules, sense accents, amb guions).
function slugify(s) {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'fitxa';
}

// Recorre un directori recursivament i retorna tots els fitxers .html.
async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) yield full;
  }
}

// Extreu un títol a partir del HTML: prova <title>, després el primer <h1>.
function extractTitle(html, fallback) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title && title[1].trim()) return decodeEntities(stripTags(title[1])).trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1].trim()) return decodeEntities(stripTags(h1[1])).trim();
  return fallback;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Classifica un fitxer mirant primer la ruta (nom de fitxer + carpeta) i
// després el cos normalitzat. Retorna { slug, reason } o null si no hi ha
// cap coincidència.
function classify(filePath, htmlNormalized) {
  const hay = normalize(filePath);
  // 1) Per ruta: si una paraula clau apareix al path, assignem directament.
  for (const [slug, kws] of Object.entries(MODULE_KEYWORDS)) {
    for (const kw of kws) {
      if (hay.includes(normalize(kw))) return { slug, reason: `ruta conté “${kw}”` };
    }
  }
  // 2) Per contingut: comptem coincidències.
  const scores = {};
  for (const [slug, kws] of Object.entries(MODULE_KEYWORDS)) {
    let s = 0;
    for (const kw of kws) {
      const n = normalize(kw);
      // Comptem ocurrències (aproximades).
      const re = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = htmlNormalized.match(re);
      if (matches) s += matches.length;
    }
    if (s > 0) scores[slug] = s;
  }
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  const [best, bestScore] = entries[0];
  return { slug: best, reason: `contingut (${bestScore} coincidències)` };
}

// Converteix HTML a Markdown net.
function htmlToMarkdown(html) {
  // Eliminem la capçalera Head (amb tot el CSS de Google Docs) per evitar soroll.
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  let md = td.turndown(body);
  // Netegem línies buides consecutives i trailing spaces.
  md = md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

async function ensureDir(d) {
  await mkdir(d, { recursive: true });
}

// Evita col·lisions de noms afegint un sufix numèric si cal.
async function uniquePath(dir, baseSlug) {
  let candidate = path.join(dir, `${baseSlug}.md`);
  let i = 2;
  while (existsSync(candidate)) {
    candidate = path.join(dir, `${baseSlug}-${i}.md`);
    i++;
  }
  return candidate;
}

async function main() {
  if (!existsSync(IMPORT_DIR)) {
    console.error(`No existeix la carpeta ${IMPORT_DIR}.`);
    console.error("Crea-la i copia-hi els .html que vulguis importar.");
    process.exit(1);
  }

  let processed = 0;
  let unclassified = 0;
  const stats = {};

  for await (const file of walk(IMPORT_DIR)) {
    const html = await readFile(file, 'utf8');
    const rel = path.relative(IMPORT_DIR, file);
    const htmlNormalized = normalize(html.slice(0, 8000)); // primers ~8 KB

    const cls = classify(rel, htmlNormalized);
    const fallbackName = path.basename(file, path.extname(file));
    const title = extractTitle(html, fallbackName);
    const body = htmlToMarkdown(html);

    let targetDir;
    let decisionMsg;
    if (cls) {
      targetDir = path.join(CONTENT_DIR, cls.slug);
      decisionMsg = `→ ${cls.slug} (${cls.reason})`;
      stats[cls.slug] = (stats[cls.slug] ?? 0) + 1;
    } else {
      targetDir = UNCLASSIFIED_DIR;
      decisionMsg = '→ _sense-classificar (no s’ha pogut assignar cap mòdul)';
      unclassified++;
    }

    await ensureDir(targetDir);
    const outPath = await uniquePath(targetDir, slugify(title) || slugify(fallbackName));
    const frontmatter = `---\ntitle: ${JSON.stringify(title)}\n---\n\n`;
    await writeFile(outPath, frontmatter + body + '\n', 'utf8');

    processed++;
    const fileLabel = await getStatLabel(file);
    console.log(`[${processed}] ${rel}  ${fileLabel}`);
    console.log(`    ${decisionMsg}`);
    console.log(`    ${path.relative(ROOT, outPath)}`);
  }

  console.log('\nResum:');
  for (const [slug, n] of Object.entries(stats).sort()) {
    console.log(`  ${slug}: ${n}`);
  }
  if (unclassified > 0) {
    console.log(`  _sense-classificar: ${unclassified}`);
    console.log('\nRevisa la carpeta content/_sense-classificar/ i mou els fitxers');
    console.log('al mòdul correcte manualment.');
  }
  console.log(`\nTotal importat: ${processed}`);
}

async function getStatLabel(file) {
  try {
    const s = await stat(file);
    return `(${Math.round(s.size / 1024)} KB)`;
  } catch {
    return '';
  }
}

main().catch((err) => {
  console.error('Error durant la importació:', err);
  process.exit(1);
});
