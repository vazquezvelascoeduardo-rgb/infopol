// Parser del test 100 preguntes Sabadell · genera src/data/tests/sabadell.ts.
// Format idèntic al de Calafell:
//   **N.** Text de pregunta
//   a) opció  (o **a) opció** si és correcta)
//   ...

import fs from 'node:fs';

const MD_PATH = '_tmp_pdf/sabadell-test.md';
const OUT_PATH = 'src/data/tests/sabadell.ts';

const md = fs.readFileSync(MD_PATH, 'utf8');
const lines = md.split(/\r?\n/);

const Q_RE = /^\*\*(\d+)\.\*\*\s+(.+)$/;
const OPT_CORRECT_RE = /^\s*\*\*([a-d])\)\s+(.+?)\*\*\s*$/;
const OPT_RE = /^\s*([a-d])\)\s+(.+?)\s*$/;

const questions = [];
let cur = null;

function flushCurrent() {
  if (cur && cur.options.every(Boolean) && cur.correct != null) {
    questions.push(cur);
  } else if (cur) {
    console.warn('SKIP num', cur.num, '— opts:', cur.options.map(o => !!o), 'correct:', cur.correct);
  }
  cur = null;
}

for (const line of lines) {
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
    const cm = OPT_CORRECT_RE.exec(line);
    if (cm) {
      const idx = cm[1].charCodeAt(0) - 'a'.charCodeAt(0);
      cur.options[idx] = cm[2].trim();
      cur.correct = idx;
      continue;
    }
    const om = OPT_RE.exec(line);
    if (om) {
      const idx = om[1].charCodeAt(0) - 'a'.charCodeAt(0);
      cur.options[idx] = om[2].trim();
      continue;
    }
  }
}
flushCurrent();

console.log('Total preguntes parsejades:', questions.length);
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (const q of questions) dist[q.correct]++;
console.log('Distribució A/B/C/D:', dist[0], '/', dist[1], '/', dist[2], '/', dist[3]);

function esc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

const out = [
  "// Test 100 preguntes — Policia Municipal Sabadell.",
  "// 7 blocs: dades, govern, patrimoni, policia, ordenances, transport, actualitat.",
  "import type { TestTopic } from './types';",
  '',
  'const sabadell: TestTopic = {',
  "  slug: 'sabadell',",
  "  title: 'Sabadell',",
  "  description: 'Temari de Policia Municipal de Sabadell · 100 preguntes en 7 blocs.',",
  "  icon: '🏭',",
  "  accent: 'from-red-500 to-rose-700',",
  "  category: 'municipi',",
  "  municipi: 'Sabadell',",
  '  questions: [',
];

for (const q of questions) {
  out.push('    {');
  out.push(`      id: 'sabadell-${q.num}',`);
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
out.push('export default sabadell;');
out.push('');

fs.writeFileSync(OUT_PATH, out.join('\n'), 'utf8');
console.log('Generat →', OUT_PATH);
