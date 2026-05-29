// Fusiona els tests legals (markdown a _tmp_pdf/legal_md) als TestTopic
// existents, o crea topics nous. Dedup per text de pregunta normalitzat.
//
// Ús: node scripts/merge-legal-tests.mjs
import fs from 'node:fs';
import path from 'node:path';

const MD_DIR = '_tmp_pdf/legal_md';
const TESTS_DIR = 'src/data/tests';

// ── Mapeig fitxer → topic ──────────────────────────────────────────
// target: slug del fitxer .ts existent · prefix: prefix d'id
// new: si és topic nou, metadades per crear-lo.
const JOBS = [
  { md: 'test_constitucio_50 (1).md', target: 'ce78', prefix: 'ce78' },
  { md: 'test_EAC_50.md', target: 'eac', prefix: 'eac' },
  { md: 'test_CodiPenal_50.md', target: 'cp-10-1995', prefix: 'cp' },
  { md: 'test_LECrim_Detencio_50.md', target: 'lecrim', prefix: 'lecrim' },
  { md: 'test_LO2-1986_50.md', target: 'lofcs-2-1986', prefix: 'lofcs' },
  { md: 'test_Llei16-1991_50.md', target: 'lpc-16-1991', prefix: 'lpc' },
  { md: 'test_Llei4-2003_50.md', target: 'lossp-4-2003', prefix: 'lossp' },
  { md: 'test_LO4-2015_SegCiutadana_50.md', target: 'lopsc-4-2015', prefix: 'lopsc' },
  { md: 'test_LO5-2000_Menors_50.md', target: 'lorpm-5-2000', prefix: 'lorpm' },
  { md: 'test_Deontologia_50.md', target: 'codi-etica-policia', prefix: 'codi-etica' },
  { md: 'test_RDL6-2015_Transit_50.md', target: 'transit-lsv', prefix: 'transit' },
  // ── Topics NOUS ──
  { md: 'test_RGC_Circulacio_50.md', target: 'rgc-1428-2003', prefix: 'rgc', isNew: true,
    meta: { title: 'Reglament General de Circulació (RD 1428/2003)', description: 'normes de circulació, velocitat, senyals, maniobres', icon: '🚸', accent: 'from-amber-500 to-orange-700' } },
  { md: 'test_LO4-2000_Estrangeria_50.md', target: 'lo4-2000-estrangeria', prefix: 'estrangeria', isNew: true,
    meta: { title: 'Estrangeria (LO 4/2000)', description: 'drets dels estrangers, situacions, CIE, expulsió', icon: '🌍', accent: 'from-teal-500 to-teal-700' } },
  { md: 'test_ProteccioCivil_50.md', target: 'proteccio-civil', prefix: 'proteccio-civil', isNew: true,
    meta: { title: 'Protecció Civil (Llei 4/1997)', description: 'plans PROCICAT, INUNCAT, NEUCAT, INFOCAT, autoritats i fases', icon: '🚨', accent: 'from-orange-500 to-red-700' } },
  { md: 'test_Igualtat_Genere_50.md', target: 'igualtat-genere', prefix: 'igualtat', isNew: true,
    meta: { title: 'Igualtat i violència de gènere (LO 3/2007 · LO 1/2004)', description: 'igualtat efectiva, violència de gènere, actuació policial', icon: '⚖️', accent: 'from-pink-500 to-rose-700' } },
];

// ── Parser de markdown ─────────────────────────────────────────────
const Q_RE = /^\*\*(\d+)\.\*\*\s+(.+)$/;
const OPT_CORRECT_RE = /^-\s+\*\*([a-d])\)\s+(.+?)\*\*\s*$/;
const OPT_RE = /^-\s+([a-d])\)\s+(.+?)\s*$/;

function parseMd(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const qs = [];
  let cur = null;
  const flush = () => {
    if (cur && cur.options.every(Boolean) && cur.correct != null) qs.push(cur);
    else if (cur) console.warn('  SKIP incompleta', cur.num, path.basename(file));
    cur = null;
  };
  for (const line of lines) {
    // Atura al solucionari
    if (/^##\s+SOLUCIONARI/i.test(line)) { flush(); break; }
    const qm = Q_RE.exec(line);
    if (qm) { flush(); cur = { num: +qm[1], text: qm[2].trim(), options: ['', '', '', ''], correct: null }; continue; }
    if (cur) {
      const cm = OPT_CORRECT_RE.exec(line);
      if (cm) { const i = cm[1].charCodeAt(0) - 97; cur.options[i] = cm[2].trim(); cur.correct = i; continue; }
      const om = OPT_RE.exec(line);
      if (om) { const i = om[1].charCodeAt(0) - 97; cur.options[i] = om[2].trim(); continue; }
    }
  }
  flush();
  return qs;
}

// ── Normalització per dedup ────────────────────────────────────────
function norm(s) {
  return (s || '')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Escapar per a TS (single-quoted) ───────────────────────────────
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function qToTs(prefix, num, q) {
  const lines = [];
  lines.push('    {');
  lines.push(`      id: '${prefix}-${num}',`);
  lines.push(`      text: '${esc(q.text)}',`);
  lines.push('      options: [');
  for (const o of q.options) lines.push(`        '${esc(o)}',`);
  lines.push('      ],');
  lines.push(`      correct: ${q.correct},`);
  lines.push('    },');
  return lines.join('\n');
}

// ── Extreu textos existents + max id d'un fitxer .ts ───────────────
function existingTexts(tsContent) {
  const set = new Set();
  const re1 = /\btext:\s*'((?:[^'\\]|\\.)*)'/g;
  const re2 = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re1.exec(tsContent))) set.add(norm(m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\')));
  while ((m = re2.exec(tsContent))) set.add(norm(m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\')));
  return set;
}
function maxId(tsContent, prefix) {
  const re = new RegExp(`id:\\s*'${prefix}-(\\d+)'`, 'g');
  let m, max = 0;
  while ((m = re.exec(tsContent))) max = Math.max(max, +m[1]);
  return max;
}

// ── Procés ─────────────────────────────────────────────────────────
let totalAdded = 0, totalDup = 0;
const newTopicFiles = [];

for (const job of JOBS) {
  const mdPath = path.join(MD_DIR, job.md);
  if (!fs.existsSync(mdPath)) { console.warn('NO existeix', job.md); continue; }
  const parsed = parseMd(mdPath);

  if (job.isNew) {
    // Dedup intern del propi fitxer
    const seen = new Set();
    const uniq = [];
    for (const q of parsed) { const k = norm(q.text); if (seen.has(k)) continue; seen.add(k); uniq.push(q); }
    const body = uniq.map((q, i) => qToTs(job.prefix, i + 1, q)).join('\n');
    const ts = `// ${job.meta.title}\n// ${uniq.length} preguntes · format examen oficial PL Catalunya.\nimport type { TestTopic } from './types';\n\nconst topic: TestTopic = {\n  slug: '${job.target}',\n  title: '${esc(job.meta.title)}',\n  description: '${esc(job.meta.description)}',\n  icon: '${job.meta.icon}',\n  accent: '${job.meta.accent}',\n  questions: [\n${body}\n  ],\n};\n\nexport default topic;\n`;
    fs.writeFileSync(path.join(TESTS_DIR, job.target + '.ts'), ts, 'utf8');
    newTopicFiles.push(job.target);
    console.log(`NOU ${job.target.padEnd(22)} +${uniq.length} preguntes`);
    totalAdded += uniq.length;
    continue;
  }

  // Topic existent: dedup contra existents + append
  const tsPath = path.join(TESTS_DIR, job.target + '.ts');
  let ts = fs.readFileSync(tsPath, 'utf8');
  const existing = existingTexts(ts);
  let nextId = maxId(ts, job.prefix) + 1;
  const seen = new Set(existing);
  const toAdd = [];
  let dup = 0;
  for (const q of parsed) {
    const k = norm(q.text);
    if (seen.has(k)) { dup++; continue; }
    seen.add(k);
    toAdd.push(qToTs(job.prefix, nextId++, q));
  }
  if (toAdd.length) {
    const block = toAdd.join('\n');
    const closeRe = / {2}\],(\r?\n)\};/;
    const m = closeRe.exec(ts);
    if (!m) { console.error('  No trobat tancament a', job.target); continue; }
    ts = ts.slice(0, m.index) + block + '\n' + ts.slice(m.index);
    fs.writeFileSync(tsPath, ts, 'utf8');
  }
  console.log(`${job.target.padEnd(26)} +${toAdd.length} noves · ${dup} dup`);
  totalAdded += toAdd.length;
  totalDup += dup;
}

console.log('─'.repeat(50));
console.log(`TOTAL afegides: ${totalAdded} · duplicades saltades: ${totalDup}`);
if (newTopicFiles.length) console.log('Topics nous a registrar a index.ts:', newTopicFiles.join(', '));
