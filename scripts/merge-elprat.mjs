// Fusiona test_prat_500.md al tema elprat existent. Dedup per text
// normalitzat. Verifica negreta ↔ solucionari i avisa de conflictes.
// Ús: node scripts/merge-elprat.mjs
import fs from 'node:fs';

const MD = '_tmp_pdf/test_prat_500.md';
const TS = 'src/data/tests/elprat.ts';
const PREFIX = 'elprat';

const Q_RE = /^\*\*(\d+)\.\s+(.+?)\*\*\s*$/;
const OPT_CORRECT_RE = /^-\s+\*\*([a-d])\)\s+(.+?)\*\*\s*$/;
const OPT_RE = /^-\s+([a-d])\)\s+(.+?)\s*$/;

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\s+/g, ' ').trim();

const lines = fs.readFileSync(MD, 'utf8').split(/\r?\n/);

// 1) Solucionari (clau de respostes) per verificar.
const solIdx = lines.findIndex((l) => /^##\s+SOLUCIONARI/i.test(l));
const solucionari = {};
if (solIdx >= 0) {
  const blob = lines.slice(solIdx).join('\n');
  for (const m of blob.matchAll(/(\d+)\s*-\s*([a-d])/g)) solucionari[+m[1]] = m[2];
}

// 2) Preguntes (atura al solucionari).
const qs = [];
let cur = null;
const flush = () => {
  if (cur && cur.options.every(Boolean) && cur.correct != null) qs.push(cur);
  else if (cur) console.warn('  SKIP incompleta', cur.num);
  cur = null;
};
for (let i = 0; i < (solIdx >= 0 ? solIdx : lines.length); i++) {
  const line = lines[i];
  const qm = Q_RE.exec(line);
  if (qm) { flush(); cur = { num: +qm[1], text: qm[2].trim(), options: ['', '', '', ''], correct: null }; continue; }
  if (cur) {
    const cm = OPT_CORRECT_RE.exec(line);
    if (cm) { const k = cm[1].charCodeAt(0) - 97; cur.options[k] = cm[2].trim(); cur.correct = k; continue; }
    const om = OPT_RE.exec(line);
    if (om) { const k = om[1].charCodeAt(0) - 97; cur.options[k] = om[2].trim(); continue; }
  }
}
flush();

// 3) Verificació negreta ↔ solucionari.
let conflicts = 0;
for (const q of qs) {
  const sol = solucionari[q.num];
  if (sol && 'abcd'.indexOf(sol) !== q.correct) {
    conflicts++;
    console.warn(`  ⚠️ CONFLICTE pregunta ${q.num}: negreta=${'abcd'[q.correct]} vs solucionari=${sol}`);
  }
}

// 4) Dedup contra elprat existent + intern.
let ts = fs.readFileSync(TS, 'utf8');
const existing = new Set();
for (const m of ts.matchAll(/\btext:\s*'((?:[^'\\]|\\.)*)'/g)) {
  existing.add(norm(m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\')));
}
let maxId = 0;
for (const m of ts.matchAll(new RegExp(`id:\\s*'${PREFIX}-(\\d+)'`, 'g'))) maxId = Math.max(maxId, +m[1]);

const seen = new Set(existing);
let nextId = maxId + 1;
let dup = 0;
const blocks = [];
for (const q of qs) {
  const key = norm(q.text);
  if (seen.has(key)) { dup++; continue; }
  seen.add(key);
  const b = ['    {', `      id: '${PREFIX}-${nextId++}',`, `      text: '${esc(q.text)}',`, '      options: ['];
  for (const o of q.options) b.push(`        '${esc(o)}',`);
  b.push('      ],', `      correct: ${q.correct},`, '    },');
  blocks.push(b.join('\n'));
}

if (blocks.length) {
  const closeRe = / {2}\],(\r?\n)\};/;
  const m = closeRe.exec(ts);
  if (!m) { console.error('No trobat tancament a elprat.ts'); process.exit(1); }
  ts = ts.slice(0, m.index) + blocks.join('\n') + '\n' + ts.slice(m.index);
  fs.writeFileSync(TS, ts, 'utf8');
}

console.log('─'.repeat(50));
console.log(`Parsejades: ${qs.length} · noves afegides: ${blocks.length} · duplicades: ${dup}`);
console.log(`Conflictes negreta↔solucionari: ${conflicts}`);
console.log(`Total elprat ara: ${maxId + blocks.length}`);
