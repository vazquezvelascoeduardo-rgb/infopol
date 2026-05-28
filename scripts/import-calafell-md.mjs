// Parser del test 250 preguntes Calafell · genera src/data/tests/calafell.ts.
// Format esperat:
//   **N.** Text de pregunta
//   a) opció  (o **a) opció** si és correcta)
//   b) opció  ...
//   ... (línia buida o nova pregunta)

import fs from 'node:fs';

const MD_PATH = '_tmp_pdf/calafell-test.md';
const OUT_PATH = 'src/data/tests/calafell.ts';

const md = fs.readFileSync(MD_PATH, 'utf8');
const lines = md.split(/\r?\n/);

// Patró pregunta: **N.** text
const Q_RE = /^\*\*(\d+)\.\*\*\s+(.+)$/;
// Patró opció correcta: **a) text**  (capturada per pluralitat)
const OPT_CORRECT_RE = /^\s*\*\*([a-d])\)\s+(.+?)\*\*\s*$/;
// Patró opció normal: a) text
const OPT_RE = /^\s*([a-d])\)\s+(.+?)\s*$/;

const questions = [];
let cur = null;

function flushCurrent() {
  if (cur && cur.options.every(Boolean) && cur.correct != null) {
    questions.push(cur);
  } else if (cur) {
    console.warn('SKIP incompleta pregunta', cur.num, '— opcions:', cur.options.map(o => !!o), 'correct:', cur.correct);
  }
  cur = null;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const qm = Q_RE.exec(line);
  if (qm) {
    flushCurrent();
    cur = {
      num: parseInt(qm[1], 10),
      text: qm[2].trim(),
      options: ['', '', '', ''],
      correct: null,
    };
    continue;
  }

  if (cur) {
    // Mira primer opció correcta (més específica)
    const cm = OPT_CORRECT_RE.exec(line);
    if (cm) {
      const letter = cm[1];
      const text = cm[2].trim();
      const idx = letter.charCodeAt(0) - 'a'.charCodeAt(0);
      cur.options[idx] = text;
      cur.correct = idx;
      continue;
    }
    const om = OPT_RE.exec(line);
    if (om) {
      const letter = om[1];
      const text = om[2].trim();
      const idx = letter.charCodeAt(0) - 'a'.charCodeAt(0);
      cur.options[idx] = text;
      continue;
    }
    // Si trobem una pregunta completa amb 4 opcions, podem flush per nova secció
    if (cur.options.every(Boolean) && cur.correct != null && (line === '' || line.startsWith('## '))) {
      flushCurrent();
    }
  }
}
flushCurrent();

console.log('Total preguntes parsejades:', questions.length);
const dups = new Set();
const uniq = [];
for (const q of questions) {
  if (dups.has(q.num)) {
    console.warn('DUPLICAT num', q.num);
    continue;
  }
  dups.add(q.num);
  uniq.push(q);
}
console.log('Únics:', uniq.length);

// Estadística distribució correctes
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (const q of uniq) dist[q.correct]++;
console.log('Distribució correctes (A/B/C/D):', dist[0], '/', dist[1], '/', dist[2], '/', dist[3]);

// Genera TS
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

const out = [
  "// Test 250 preguntes — Policia Local Calafell.",
  "// Temari oficial d'Agent (BOPT 9/3/2026). Format examen PL Catalunya.",
  "// 6 blocs: Constitucional, Penal/Processal, Administrativa, Trànsit, Comunitària, Cultura local.",
  "import type { TestTopic } from './types';",
  '',
  'const calafell: TestTopic = {',
  "  slug: 'calafell',",
  "  title: 'Calafell',",
  "  description: 'Temari oficial Agent PL Calafell (BOPT 9/3/2026) · 250 preguntes en 6 blocs.',",
  "  icon: '🏖️',",
  "  accent: 'from-cyan-500 to-blue-700',",
  "  category: 'municipi',",
  "  municipi: 'Calafell',",
  '  questions: [',
];

for (const q of uniq) {
  out.push('    {');
  out.push(`      id: 'calafell-${q.num}',`);
  out.push(`      text: '${esc(q.text)}',`);
  out.push('      options: [');
  for (const o of q.options) out.push(`        '${esc(o)}',`);
  out.push('      ],');
  out.push(`      correct: ${q.correct},`);
  out.push('    },');
}

out.push('  ],');
out.push('};');
out.push('');
out.push('export default calafell;');
out.push('');

fs.writeFileSync(OUT_PATH, out.join('\n'), 'utf8');
console.log('Generat →', OUT_PATH);
