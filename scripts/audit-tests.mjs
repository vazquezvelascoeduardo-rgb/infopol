// Auditoria de contradiccions entre preguntes de test.
// Agrupa preguntes amb el MATEIX text normalitzat i avisa si tenen
// respostes correctes diferents (= almenys una és errònia).
// També llista possibles duplicats exactes.
// Ús: node scripts/audit-tests.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/data/tests';
const Q = /\{\s*id:\s*'([^']+)',\s*text:\s*'((?:[^'\\]|\\.)*)',\s*options:\s*\[([\s\S]*?)\],\s*correct:\s*(\d)/g;
const O = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
const un = (x) => x.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
const norm = (s) =>
  un(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

// Marca de pregunta efímera/temporal (per filtrar falsos positius).
const EPH = /\bactual|actualment|aquest any|vigent|examen de \d|recentment|act\. 20\d\d|a 20\d\d/i;

const byQuestion = new Map(); // normQ -> [{file,id,correctNorm,correctText,text,eph}]
let totalQ = 0;

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.ts') || ['index.ts', 'types.ts'].includes(f)) continue;
  const s = fs.readFileSync(path.join(DIR, f), 'utf8');
  let m;
  while ((m = Q.exec(s))) {
    const text = un(m[2]);
    const opts = [...m[3].matchAll(O)].map((x) => un(x[1] ?? x[2] ?? ''));
    const correct = +m[4];
    if (!opts[correct]) continue;
    totalQ++;
    const key = norm(m[2]);
    if (!key) continue;
    const entry = {
      file: f, id: m[1], text,
      correctText: opts[correct], correctNorm: norm(opts[correct]),
      eph: EPH.test(text),
    };
    if (!byQuestion.has(key)) byQuestion.set(key, []);
    byQuestion.get(key).push(entry);
  }
}

let contradictions = 0, dups = 0;
const out = [];
for (const [, arr] of byQuestion) {
  if (arr.length < 2) continue;
  const answers = new Set(arr.map((e) => e.correctNorm));
  // Si totes són efímeres (actuals), saltem (poden variar legítimament).
  const allEph = arr.every((e) => e.eph);
  if (answers.size > 1 && !allEph) {
    contradictions++;
    out.push(`⚠️ CONTRADICCIÓ:\n  "${arr[0].text}"`);
    for (const e of arr) out.push(`     [${e.file} ${e.id}] -> ${e.correctText}`);
    out.push('');
  } else if (answers.size === 1) {
    dups++;
  }
}

console.log(out.join('\n'));
console.log('─'.repeat(60));
console.log(`Preguntes analitzades: ${totalQ}`);
console.log(`Grups de preguntes idèntiques amb resposta CONTRADICTÒRIA: ${contradictions}`);
console.log(`Grups de preguntes idèntiques amb la MATEIXA resposta (duplicats): ${dups}`);
