// Construeix src/data/tests/terrassa-2026.ts a partir de l'examen oficial
// de Terrassa 2026 (Cultural + Teòric, Model 1). Usa la resposta en
// negreta (correcta de contingut) i la verifica contra la plantilla
// oficial. Salta preguntes anul·lades. Q42 Cultural: s'usa el contingut
// correcte (c) tot i que la plantilla marca d (errada coneguda).
// Ús: node scripts/build-terrassa-2026.mjs
import fs from 'node:fs';

const MD = '_tmp_pdf/terrassa2026.md';
const OUT = 'src/data/tests/terrassa-2026.ts';

const Q_RE = /^\*\*(\d+)\.\*\*\s+(.+)$/;
// Correcta: permet text/anotacions després del tancament en negreta.
const OPT_CORRECT_RE = /^-\s+\*\*([a-d])\)\s+(.+?)\*\*/;
const OPT_RE = /^-\s+([a-d])\)\s+(.+?)\s*$/;

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  .replace(/\s*\*\(.*?\)\*\s*$/, '').replace(/\s+/g, ' ').trim();

const lines = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
const stopIdx = lines.findIndex((l) => /^#\s+PLANTILLES/i.test(l));
const body = lines.slice(0, stopIdx >= 0 ? stopIdx : lines.length);

const qs = [];
let cur = null;
let section = '';
const flush = () => {
  if (cur && cur.options.every(Boolean) && cur.correct != null) qs.push(cur);
  else if (cur) console.warn(`  SKIP ${cur.section} ${cur.num} (incompleta/anul·lada)`);
  cur = null;
};
for (const line of body) {
  if (/^#\s+PRIMER EXERCICI/i.test(line)) { flush(); section = 'C'; continue; }
  if (/^#\s+SEGON EXERCICI/i.test(line)) { flush(); section = 'T'; continue; }
  const qm = Q_RE.exec(line);
  if (qm) { flush(); cur = { section, num: +qm[1], text: qm[2].trim(), options: ['', '', '', ''], correct: null }; continue; }
  if (cur) {
    const cm = OPT_CORRECT_RE.exec(line);
    if (cm) { const k = cm[1].charCodeAt(0) - 97; cur.options[k] = cm[2].trim(); cur.correct = k; continue; }
    const om = OPT_RE.exec(line);
    if (om) { const k = om[1].charCodeAt(0) - 97; cur.options[k] = om[2].trim(); continue; }
  }
}
flush();

// Plantilla oficial per verificar.
const plantilla = { C: {}, T: {} };
const tblStart = stopIdx >= 0 ? stopIdx : lines.length;
let curTbl = null;
for (let i = tblStart; i < lines.length; i++) {
  const l = lines[i];
  if (/Cultural\s*—\s*Model 1/i.test(l)) curTbl = 'C';
  else if (/Te[òo]ric\s*—\s*Model 1/i.test(l)) curTbl = 'T';
  if (curTbl && l.includes('|')) {
    for (const m of l.matchAll(/(\d+)\s+([a-d])\b/g)) plantilla[curTbl][+m[1]] = m[2];
  }
}

// Overrides manuals per a conflictes verificats:
//  - C42: Tirant lo Blanc → Joanot Martorell (c). La plantilla marca d (errada).
//  - T36: subinspector → escala intermèdia (b) per la Llei 16/1991.
//         La negreta del MD marcava c (executiva), incorrecte.
const OVERRIDE = { C42: 2, T36: 1 };
let conflicts = 0, overridden = 0;
for (const q of qs) {
  const key = `${q.section}${q.num}`;
  if (OVERRIDE[key] != null && OVERRIDE[key] !== q.correct) {
    q.correct = OVERRIDE[key];
    overridden++;
    continue;
  }
  const sol = plantilla[q.section]?.[q.num];
  if (sol && 'abcd'.indexOf(sol) !== q.correct) {
    conflicts++;
    console.warn(`  ⚠️ ${q.section}${q.num}: negreta=${'abcd'[q.correct]} vs plantilla=${sol} (no resolt)`);
  }
}
console.log(`Overrides aplicats: ${overridden}`);

const blocks = qs.map((q, i) => {
  const b = ['    {', `      id: 'terr26-${i + 1}',`, `      text: '${esc(q.text)}',`, '      options: ['];
  for (const o of q.options) b.push(`        '${esc(o)}',`);
  b.push('      ],', `      correct: ${q.correct},`, `      reference: '${q.section === 'C' ? 'Cultural' : 'Teòric'} · Terrassa 2026',`, '    },');
  return b.join('\n');
});

const ts = `// Examen oficial Agent Policia Municipal de Terrassa 2026 (Model 1).
// Convocatòria 1f/AGENTS/2026 · 30/05/2026 · cultural + teòric.
// ${qs.length} preguntes (Q48 cultural anul·lada, exclosa). Generat per
// scripts/build-terrassa-2026.mjs amb la plantilla oficial de correcció.
import type { TestTopic } from './types';

const topic: TestTopic = {
  slug: 'terrassa-2026',
  title: 'Terrassa · Examen Agent 2026',
  description: 'Examen oficial 30/05/2026 (Model 1) · cultural + teòric, amb respostes.',
  icon: '🏛️',
  accent: 'from-sky-500 to-blue-700',
  category: 'municipi',
  municipi: 'Terrassa',
  badge: '🆕 2026',
  questions: [
${blocks.join('\n')}
  ],
};

export default topic;
`;
fs.writeFileSync(OUT, ts, 'utf8');
console.log('─'.repeat(50));
console.log(`Escrit ${OUT} · ${qs.length} preguntes · conflictes negreta↔plantilla: ${conflicts}`);
