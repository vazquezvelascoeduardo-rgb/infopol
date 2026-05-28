// Parser del fitxer .md del test d'actualitat PL Catalunya 2025-2026.
// Genera src/data/tests/actualitat-pl-2026.ts amb el TestTopic complet.

import fs from 'node:fs';

const MD_PATH = 'C:/Users/edugu/Downloads/test_actualitat_PL_Catalunya_ampliat.md';
const OUT_PATH = 'src/data/tests/actualitat-pl-2026.ts';

const md = fs.readFileSync(MD_PATH, 'utf8');
const lines = md.split(/\r?\n/);

// Mira si una linia es l'inici d'una pregunta: **N. Text?**
const Q_RE = /^\*\*(\d+)\.\s+(.+?)\*\*\s*$/;
// Mira si una linia es una opcio: - **a) Text** (correcta) o - a) Text
const OPT_RE = /^\-\s+(?:\*\*)?([a-d])\)\s+(.+?)(?:\*\*)?\s*$/;
const OPT_CORRECT_RE = /^\-\s+\*\*([a-d])\)\s+(.+?)\*\*\s*$/;

const questions = [];
let currentQ = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const qm = Q_RE.exec(line);
  if (qm) {
    if (currentQ) questions.push(currentQ);
    currentQ = {
      num: parseInt(qm[1], 10),
      text: qm[2].trim(),
      options: ['', '', '', ''],
      correct: null,
    };
    continue;
  }

  if (currentQ) {
    // Mira si es opcio correcta primer (mes especifica)
    const cm = OPT_CORRECT_RE.exec(line);
    if (cm) {
      const letter = cm[1];
      const text = cm[2].trim();
      const idx = letter.charCodeAt(0) - 'a'.charCodeAt(0);
      currentQ.options[idx] = text;
      currentQ.correct = idx;
      continue;
    }
    const om = OPT_RE.exec(line);
    if (om) {
      const letter = om[1];
      const text = om[2].trim();
      const idx = letter.charCodeAt(0) - 'a'.charCodeAt(0);
      currentQ.options[idx] = text;
      continue;
    }
  }
}
if (currentQ) questions.push(currentQ);

console.log('Total preguntes parsejades:', questions.length);
const incomplete = questions.filter(
  (q) => q.options.some((o) => !o) || q.correct == null,
);
console.log('Incompletes:', incomplete.length);
if (incomplete.length) {
  console.log('Mostra:', incomplete.slice(0, 3).map(q => ({ num: q.num, text: q.text.slice(0, 40), opts: q.options, correct: q.correct })));
}

// Genera el fitxer TS
function escapeString(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const tsLines = [
  "// Test d'Actualitat 2025-2026 — Policia Local de Catalunya.",
  "// 75 preguntes (càrrecs CAT, ESP, INT, Vaticà, premis, esports, política, social).",
  "// Format igual que la resta de TestTopics (slug, title, icon, accent, questions[]).",
  "import type { TestTopic } from './types';",
  '',
  'const actualitat: TestTopic = {',
  "  slug: 'actualitat-pl-2026',",
  "  title: 'Actualitat 2025–2026',",
  "  description: 'Càrrecs vigents, premis, esports i fets clau (CAT + ESP + INT, actualitzat maig 2026).',",
  "  icon: '📰',",
  "  accent: 'from-amber-500 to-orange-600',",
  "  category: 'actualitat',",
  '  questions: [',
];

for (const q of questions) {
  tsLines.push('    {');
  tsLines.push(`      id: 'actualitat-${q.num}',`);
  tsLines.push(`      text: '${escapeString(q.text)}',`);
  tsLines.push('      options: [');
  for (const opt of q.options) tsLines.push(`        '${escapeString(opt)}',`);
  tsLines.push('      ],');
  tsLines.push(`      correct: ${q.correct},`);
  tsLines.push('    },');
}

tsLines.push('  ],');
tsLines.push('};');
tsLines.push('');
tsLines.push('export default actualitat;');
tsLines.push('');

fs.writeFileSync(OUT_PATH, tsLines.join('\n'), 'utf8');
console.log('Generat →', OUT_PATH);
