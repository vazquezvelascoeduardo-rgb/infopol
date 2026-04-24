// Script d'importació de HTML a fitxes.
// Ús:  npm run import
//
// Llegeix tots els fitxers .html dins de /_import (recursiu) i els copia
// TAL QUAL (preservant tot el disseny: colors, gradients, timelines,
// icones, etc.) dins de /content/<modul>/<slug>.html
//
// Classificació (regles explícites + paraules clau):
//   1r) Si el nom de fitxer/carpeta conté una "regla explícita" (més avall),
//       s'hi assigna directament. Això cobreix:
//         - codi-penal:  només el Codi penal (cp, codi penal, codigo penal)
//         - fcs:         codi ètica, armament, llei 4/2003, 16/91, LO 2/86, reglament armes
//         - municipi:    llei 7/1985 i ordenances
//         - transit:     catàleg infraccions (incloent VMP)
//         - ce78:        constitució espanyola
//         - eac:         estatut d'autonomia de Catalunya
//         - sc:          seguretat ciutadana / LOPSC
//         - lecrim:      enjudiciament criminal
//         - menors:      menors (LO 5/2000, LORPM)
//   2n) Si no, es revisa el contingut (primers ~8 KB).
//   3r) Si encara no es pot classificar, va a /content/_sense-classificar/.

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMPORT_DIR = path.join(ROOT, '_import');
const CONTENT_DIR = path.join(ROOT, 'content');
const UNCLASSIFIED_DIR = path.join(CONTENT_DIR, '_sense-classificar');

// ---- Regles de classificació ---------------------------------------------
// Les regles s'avaluen EN ORDRE (la primera que encaixa, guanya).
// Per cada mòdul indiquem paraules clau que han de coincidir a la ruta
// (nom de fitxer o subcarpeta) o al contingut.
//
// Algunes regles incorporen "exclusions" (exclude): si el text coincideix
// amb una paraula que no ha d'estar, es descarta la regla.
// Això evita que, p.ex., una fitxa de "FCS" que menciona "Codi penal"
// acabi en codi-penal.
const RULES = [
  // Codi penal: només fitxes del propi Codi penal
  {
    slug: 'codi-penal',
    include: [
      'codi-penal',
      'codi penal',
      'codigo-penal',
      'codigo penal',
      'codi_penal',
      'lo 10/1995',
      'lo 10-1995',
      'lo10-1995',
      'lo 10 1995',
    ],
    exclude: [],
  },
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
      '16/91',
      '16-91',
      '16 91',
      'lo 2/86',
      'lo 2-86',
      'lo 2/1986',
      'lo 2-1986',
      '2/1986',
      'reglament armes',
      'reglament d armes',
      "reglament d'armes",
      'reglamento armas',
      'reglamento de armas',
      'fcs',
    ],
    exclude: [],
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
      'ordenan',
      'bases del regim local',
      'bases del régimen local',
      'lbrl',
      'municipi',
      'municipal',
      'viladecans',
    ],
    exclude: [],
  },
  // Trànsit
  {
    slug: 'transit',
    include: [
      'cataleg-infraccions',
      'catàleg infraccions',
      'cataleg infraccions',
      'catálogo infracciones',
      'catalogo infracciones',
      'vmp',
      'transit',
      'trànsit',
      'tráfico',
      'trafico',
      'circulació',
      'circulacion',
      'seguretat viaria',
      'seguretat viària',
      'seguridad vial',
    ],
    exclude: [],
  },
  // CE78
  {
    slug: 'ce78',
    include: [
      'ce78',
      'ce-78',
      'ce 78',
      'constitució espanyola',
      'constitucion española',
      'constitucion espanyola',
      'constitucion',
      'constitucional',
    ],
    exclude: [],
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
      'generalitat de catalunya',
    ],
    exclude: [],
  },
  // SC (Seguretat Ciutadana)
  {
    slug: 'sc',
    include: [
      'lopsc',
      'seguretat ciutadana',
      'seguridad ciudadana',
      'lo 4/2015',
      'lo 4-2015',
      '4/2015',
    ],
    exclude: [],
  },
  // LECrim
  {
    slug: 'lecrim',
    include: [
      'lecrim',
      'lecr',
      'enjudiciament criminal',
      'enjuiciamiento criminal',
      'atestat',
      'atestado',
      'habeas corpus',
    ],
    exclude: [],
  },
  // Menors
  {
    slug: 'menors',
    include: [
      'menors',
      'menores',
      'lorpm',
      'lo 5/2000',
      'lo 5-2000',
      '5/2000',
      'responsabilitat penal del menor',
      'responsabilidad penal del menor',
    ],
    exclude: [],
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

function ruleMatchesHaystack(rule, haystack) {
  for (const ex of rule.exclude) {
    if (haystack.includes(normalize(ex))) return false;
  }
  for (const kw of rule.include) {
    if (haystack.includes(normalize(kw))) return true;
  }
  return false;
}

// Retorna { slug, reason } o null.
function classify(relPath, htmlContentNormalized) {
  const pathHay = normalize(relPath);
  // 1) Per ruta
  for (const r of RULES) {
    if (ruleMatchesHaystack(r, pathHay)) {
      return { slug: r.slug, reason: `ruta coincideix amb regla de ${r.slug}` };
    }
  }
  // 2) Per contingut
  for (const r of RULES) {
    if (ruleMatchesHaystack(r, htmlContentNormalized)) {
      return { slug: r.slug, reason: `contingut coincideix amb regla de ${r.slug}` };
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

async function main() {
  if (!existsSync(IMPORT_DIR)) {
    console.error(`No existeix la carpeta ${IMPORT_DIR}.`);
    console.error('Crea-la i copia-hi els .html que vulguis importar.');
    process.exit(1);
  }

  let processed = 0;
  let unclassified = 0;
  const stats = {};

  for await (const file of walk(IMPORT_DIR)) {
    const html = await readFile(file, 'utf8');
    const rel = path.relative(IMPORT_DIR, file);
    const htmlNormalized = normalize(html.slice(0, 16000));

    const cls = classify(rel, htmlNormalized);
    const fallbackName = path.basename(file, path.extname(file));
    const title = extractTitle(html, fallbackName);

    let targetDir;
    let decisionMsg;
    if (cls) {
      targetDir = path.join(CONTENT_DIR, cls.slug);
      decisionMsg = `→ ${cls.slug} (${cls.reason})`;
      stats[cls.slug] = (stats[cls.slug] ?? 0) + 1;
    } else {
      targetDir = UNCLASSIFIED_DIR;
      decisionMsg = '→ _sense-classificar (cap regla no ha coincidit)';
      unclassified++;
    }

    await ensureDir(targetDir);
    const baseSlug = slugify(title) || slugify(fallbackName);
    const outPath = await uniquePath(targetDir, baseSlug, '.html');
    // Copiem el HTML TAL QUAL (preservem tot el disseny).
    await writeFile(outPath, html, 'utf8');

    processed++;
    const sizeLabel = await getStatLabel(file);
    console.log(`[${processed}] ${rel}  ${sizeLabel}`);
    console.log(`    ${decisionMsg}`);
    console.log(`    ${path.relative(ROOT, outPath)}`);
  }

  console.log('\nResum:');
  for (const [slug, n] of Object.entries(stats).sort()) {
    console.log(`  ${slug}: ${n}`);
  }
  if (unclassified > 0) {
    console.log(`  _sense-classificar: ${unclassified}`);
    console.log(
      '\nRevisa la carpeta content/_sense-classificar/ i mou els .html a',
    );
    console.log('la carpeta del mòdul correcte. Un cop moguts, refresca la');
    console.log('pàgina (npm run dev es recarrega sol).');
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
