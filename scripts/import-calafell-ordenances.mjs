// Parser de les 50 preguntes d'Ordenances de Calafell.
// Genera el bloc TS amb IDs calafell-251 a calafell-300 i el insereix
// al fitxer src/data/tests/calafell.ts ABANS del tancament del array.

import fs from 'node:fs';

const MD_PATH = '_tmp_pdf/calafell-ordenances.md';
const TS_PATH = 'src/data/tests/calafell.ts';
const ID_OFFSET = 250; // les noves preguntes comencen a calafell-251

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
    console.warn('SKIP num', cur.num, 'opts:', cur.options.map(o => !!o), 'correct:', cur.correct);
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

console.log('Preguntes ordenances parsejades:', questions.length);
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (const q of questions) dist[q.correct]++;
console.log('Distribució A/B/C/D:', dist[0], '/', dist[1], '/', dist[2], '/', dist[3]);

// Genera el bloc TS de les noves preguntes
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

const block = [];
for (const q of questions) {
  block.push('    {');
  block.push(`      id: 'calafell-${q.num + ID_OFFSET}',`);
  block.push(`      text: '${esc(q.text)}',`);
  block.push('      options: [');
  for (const o of q.options) block.push(`        '${esc(o)}',`);
  block.push('      ],');
  block.push(`      correct: ${q.correct},`);
  block.push('    },');
}

// Llegir el TS existent i inserir el bloc abans del `]`
let ts = fs.readFileSync(TS_PATH, 'utf8');

// Comprovació anti-duplicació: si ja conté calafell-251 → no fer res.
if (ts.includes("'calafell-251'")) {
  console.log('⚠️ Ja existeixen preguntes >250 al TS. No s\'insereix res (idempotent).');
  process.exit(0);
}

// Inserim just abans del tancament del array `questions`. Busquem
// `  ],` seguit (amb CR/LF opcionals) de `};`. Així funciona tant en
// LF (Unix) com en CRLF (Windows).
const closeRe = /  \],(\r?\n)\};/;
const m = closeRe.exec(ts);
if (!m) {
  console.error('No s\'ha trobat el tancament `  ],\\n};` del array. Avorta.');
  process.exit(1);
}
const closeIdx = m.index;
const before = ts.slice(0, closeIdx);
const after = ts.slice(closeIdx);
const newTs = before + block.join('\n') + '\n' + after;

// Actualitza el comentari del capçal i la descripció
const updated = newTs
  .replace('// Test 250 preguntes — Policia Local Calafell.', '// Test 300 preguntes — Policia Local Calafell.')
  .replace('// 6 blocs: Constitucional, Penal/Processal, Administrativa, Trànsit, Comunitària, Cultura local.',
           '// 6 blocs (1-250): Constitucional · Penal · Administrativa · Trànsit · Comunitària · Cultura local.\n// Annex (251-300): Ordenances municipals de Calafell (convivència, animals, platges, sorolls, circulació, mercats, terrasses).')
  .replace("description: 'Temari oficial Agent PL Calafell (BOPT 9/3/2026) · 250 preguntes en 6 blocs.',",
           "description: 'Temari oficial Agent PL Calafell (BOPT 9/3/2026) · 250 preguntes + 50 d\\'ordenances municipals.',");

fs.writeFileSync(TS_PATH, updated, 'utf8');
console.log('✅ Inserides', questions.length, 'preguntes (IDs', ID_OFFSET + 1, '-', ID_OFFSET + questions.length, ') a', TS_PATH);
