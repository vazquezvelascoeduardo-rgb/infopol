// Script d'importació de HTML a fitxes.
// Ús:  npm run import
//
// Què fa:
//   1. BUIDA les carpetes de /content (només els .html) perquè la importació
//      sigui idempotent i no deixi duplicats.
//   2. Llegeix tots els .html dins de /_import (recursiu) i els copia
//      TAL QUAL (preservant tot el disseny) a /content/<modul>/<slug>.html
//   3. Classifica cada fitxer:
//        a) Regles explícites del manifest _import/rules.txt (si existeix).
//        b) Regles de paraules clau (nom del fitxer → contingut).
//        c) Si no hi ha coincidència clara → /content/_sense-classificar/
//
// Els fitxers .md escrits a mà NO es toquen.
//
// Manifest (opcional): crea un fitxer _import/rules.txt amb línies tipus:
//     nom-fitxer.html -> fcs
//     un-altre.html -> transit
// Les coincidències poden ser parcials (substring del nom del fitxer).

import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMPORT_DIR = path.join(ROOT, '_import');
const CONTENT_DIR = path.join(ROOT, 'content');
const UNCLASSIFIED_DIR = path.join(CONTENT_DIR, '_sense-classificar');

// Mòduls vàlids. Han de coincidir amb els slugs de src/lib/content.ts.
const MODULE_SLUGS = [
  'ce78',
  'codi-penal',
  'eac',
  'fcs',
  'lecrim',
  'menors',
  'municipi',
  'sc',
  'transit',
];

// ---- Regles de classificació ---------------------------------------------
//
// IMPORTANT: l'ordre importa. La primera regla que encaixa, guanya.
// Posem les regles MÉS ESPECÍFIQUES primer; Codi penal va al final per no
// "robar" fitxes d'altres mòduls que facin referència al Codi penal.
//
// `pathOnly: true` significa que la regla només es comprova al nom del fitxer
// (no al contingut). És útil per Codi penal, que només hi ha de ser el propi CP.
const RULES = [
  // FCS
  {
    slug: 'fcs',
    include: [
      'codi etica',
      'codi-etica',
      "codi d'etica",
      'codi d etica',
      'etica policial',
      'armament',
      'armamento',
      'llei 4/2003',
      'llei 4-2003',
      'ley 4/2003',
      'ley 4-2003',
      '4/2003',
      '16/1991',
      '16-1991',
      '16/91',
      '16-91',
      'lo 2/1986',
      'lo 2-1986',
      'lo 2/86',
      'lo 2-86',
      '2/1986',
      'reglament armes',
      "reglament d'armes",
      'reglament d armes',
      'reglamento armas',
      'reglamento de armas',
    ],
  },
  // Municipi
  {
    slug: 'municipi',
    include: [
      'llei 7/1985',
      'llei 7-1985',
      'ley 7/1985',
      'ley 7-1985',
      '7/1985',
      '7-1985',
      'lbrl',
      'bases del regim local',
      'bases del régimen local',
      'ordenan', // cobreix "ordenança", "ordenanza", "ordenanzas", "ordenances"
    ],
  },
  // Trànsit — ESTRICTE: només catàleg d'infraccions i VMP
  {
    slug: 'transit',
    include: [
      'cataleg infraccions',
      'catàleg infraccions',
      'cataleg-infraccions',
      'catalogo infracciones',
      'catálogo infracciones',
      'catalogo-infracciones',
      'vmp',
    ],
  },
  // Menors
  {
    slug: 'menors',
    include: [
      'lorpm',
      'lo 5/2000',
      'lo 5-2000',
      '5/2000',
      '5-2000',
      'responsabilitat penal del menor',
      'responsabilidad penal del menor',
      'menor edat',
      'menor de edad',
    ],
  },
  // CE78
  {
    slug: 'ce78',
    include: [
      'ce78',
      'ce-78',
      'ce 78',
      'constitucio espanyola',
      'constitución española',
      'constitucion espanola',
      'constitucion espanyola',
      'constitució espanyola',
      'constitucion 1978',
      'constitució 1978',
    ],
  },
  // EAC
  {
    slug: 'eac',
    include: [
      'eac',
      "estatut d'autonomia",
      'estatut autonomia',
      'estatut de catalunya',
      'lo 6/2006',
      'lo 6-2006',
      '6/2006',
      '6-2006',
    ],
  },
  // SC
  {
    slug: 'sc',
    include: [
      'lopsc',
      'seguretat ciutadana',
      'seguridad ciudadana',
      'lo 4/2015',
      'lo 4-2015',
      '4/2015',
      '4-2015',
    ],
  },
  // LECrim
  {
    slug: 'lecrim',
    include: [
      'lecrim',
      'enjudiciament criminal',
      'enjuiciamiento criminal',
    ],
  },
  // Codi penal — ÚLTIM i només per nom de fitxer.
  {
    slug: 'codi-penal',
    pathOnly: true,
    include: [
      'codi-penal',
      'codi penal',
      'codi_penal',
      'codigo-penal',
      'codigo penal',
      'codigo_penal',
      'lo 10/1995',
      'lo 10-1995',
      '10/1995',
    ],
  },
];

// ---- Utilitats -----------------------------------------------------------

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(s) {
  return (
    normalize(s)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'fitxa'
  );
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) yield full;
  }
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ');
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

function extractTitle(html, fallback) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t && t[1].trim()) return decodeEntities(stripTags(t[1])).trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1].trim()) return decodeEntities(stripTags(h1[1])).trim();
  return fallback;
}

function ruleMatches(rule, haystack) {
  for (const kw of rule.include) {
    if (haystack.includes(normalize(kw))) return true;
  }
  return false;
}

function classifyByRules(relPath, htmlNormalized) {
  const pathHay = normalize(relPath);
  // 1) Per ruta: totes les regles
  for (const r of RULES) {
    if (ruleMatches(r, pathHay)) {
      return { slug: r.slug, reason: `ruta (${r.slug})` };
    }
  }
  // 2) Per contingut: només regles que NO siguin `pathOnly`
  for (const r of RULES) {
    if (r.pathOnly) continue;
    if (ruleMatches(r, htmlNormalized)) {
      return { slug: r.slug, reason: `contingut (${r.slug})` };
    }
  }
  return null;
}

// Llegeix _import/rules.txt (opcional). Format:
//   nom-parcial-del-fitxer.html -> slug-modul
//   ...
// Línies que comencen amb # són comentaris.
async function loadManifest() {
  const p = path.join(IMPORT_DIR, 'rules.txt');
  if (!existsSync(p)) return [];
  const text = await readFile(p, 'utf8');
  const rules = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(.+?)\s*->\s*([a-z0-9-]+)\s*$/i);
    if (!m) continue;
    const pattern = m[1].trim();
    const slug = m[2].trim();
    if (!MODULE_SLUGS.includes(slug)) {
      console.warn(`  ⚠ Regla ignorada (mòdul desconegut): ${line}`);
      continue;
    }
    rules.push({ pattern: normalize(pattern), slug });
  }
  return rules;
}

function classifyByManifest(relPath, manifest) {
  const hay = normalize(relPath);
  for (const r of manifest) {
    if (hay.includes(r.pattern)) {
      return { slug: r.slug, reason: `manifest (${r.pattern} → ${r.slug})` };
    }
  }
  return null;
}

async function ensureDir(d) {
  await mkdir(d, { recursive: true });
}

async function uniquePath(dir, baseSlug, ext) {
  let candidate = path.join(dir, `${baseSlug}${ext}`);
  let i = 2;
  while (existsSync(candidate)) {
    candidate = path.join(dir, `${baseSlug}-${i}${ext}`);
    i++;
  }
  return candidate;
}

// Esborra tots els .html dels mòduls i de _sense-classificar perquè la
// importació sigui idempotent. Els .md i els .gitkeep no es toquen.
async function cleanContent() {
  const dirs = [
    ...MODULE_SLUGS.map((s) => path.join(CONTENT_DIR, s)),
    UNCLASSIFIED_DIR,
  ];
  let removed = 0;
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const entry of await readdir(d)) {
      if (entry.toLowerCase().endsWith('.html')) {
        await unlink(path.join(d, entry));
        removed++;
      }
    }
  }
  return removed;
}

async function main() {
  if (!existsSync(IMPORT_DIR)) {
    console.error(`No existeix la carpeta ${IMPORT_DIR}.`);
    console.error('Crea-la i copia-hi els .html que vulguis importar.');
    process.exit(1);
  }

  const manifest = await loadManifest();
  if (manifest.length > 0) {
    console.log(`Manifest _import/rules.txt: ${manifest.length} regla/es carregades.`);
  }

  const removed = await cleanContent();
  if (removed > 0) {
    console.log(`Neteja prèvia: eliminats ${removed} fitxers .html antics.\n`);
  }

  let processed = 0;
  let unclassified = 0;
  const stats = {};

  for await (const file of walk(IMPORT_DIR)) {
    // Ignorem el propi rules.txt i qualsevol no-.html.
    if (path.basename(file).toLowerCase() === 'rules.txt') continue;
    const html = await readFile(file, 'utf8');
    const rel = path.relative(IMPORT_DIR, file);
    const htmlNormalized = normalize(html.slice(0, 16000));

    // 1) Manifest → 2) Regles
    const cls =
      classifyByManifest(rel, manifest) ?? classifyByRules(rel, htmlNormalized);

    const fallbackName = path.basename(file, path.extname(file));
    const title = extractTitle(html, fallbackName);

    let targetDir;
    let decisionMsg;
    if (cls) {
      targetDir = path.join(CONTENT_DIR, cls.slug);
      decisionMsg = `→ ${cls.slug}   ${cls.reason}`;
      stats[cls.slug] = (stats[cls.slug] ?? 0) + 1;
    } else {
      targetDir = UNCLASSIFIED_DIR;
      decisionMsg = '→ _sense-classificar   cap regla no ha coincidit';
      unclassified++;
    }

    await ensureDir(targetDir);
    const baseSlug = slugify(title) || slugify(fallbackName);
    const outPath = await uniquePath(targetDir, baseSlug, '.html');
    await writeFile(outPath, html, 'utf8');

    processed++;
    const sizeLabel = await getStatLabel(file);
    console.log(`[${processed}] ${rel}  ${sizeLabel}`);
    console.log(`    ${decisionMsg}`);
    console.log(`    ${path.relative(ROOT, outPath)}`);
  }

  console.log('\n──────── Resum ────────');
  for (const slug of MODULE_SLUGS) {
    const n = stats[slug] ?? 0;
    console.log(`  ${slug.padEnd(14)}: ${n}`);
  }
  if (unclassified > 0) {
    console.log(`  _sense-classificar: ${unclassified}`);
  }
  console.log(`  Total importat: ${processed}`);

  if (unclassified > 0) {
    console.log(
      '\nHi ha fitxers sense classificar a content/_sense-classificar/.',
    );
    console.log(
      'Pots moure-ls a mà a la carpeta correcta, o afegir una regla al',
    );
    console.log('manifest _import/rules.txt (p. ex.):');
    console.log('    nom-parcial.html -> transit');
  }
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
