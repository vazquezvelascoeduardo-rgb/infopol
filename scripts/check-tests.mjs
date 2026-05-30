// Revisió estructural de tots els bancs de preguntes de test.
// Detecta: correct fora de rang, opcions duplicades, opcions buides.
// Ús: node scripts/check-tests.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/data/tests';
const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f));

let issues = 0;
const OPT_RE = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
const Q_RE = /id:\s*'([^']+)'[\s\S]*?options:\s*\[([\s\S]*?)\][\s\S]*?correct:\s*(\d+)/g;

for (const f of files) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  let m;
  while ((m = Q_RE.exec(src))) {
    const id = m[1];
    const optsRaw = m[2];
    const correct = Number(m[3]);
    const opts = [...optsRaw.matchAll(OPT_RE)].map((x) => x[1] ?? x[2] ?? '');
    if (opts.length < 2) continue;
    if (correct < 0 || correct >= opts.length) {
      console.log(`${f} ${id}: correct ${correct} fora de rang (${opts.length} opcions)`);
      issues++;
    }
    const norm = opts.map((o) => o.toLowerCase().replace(/\s+/g, ' ').trim());
    const dups = [...new Set(norm.filter((v, i) => norm.indexOf(v) !== i))];
    if (dups.length) {
      console.log(`${f} ${id}: opcions duplicades -> ${dups.join(' | ')}`);
      issues++;
    }
    if (opts.some((o) => !o.trim())) {
      console.log(`${f} ${id}: opció buida`);
      issues++;
    }
  }
}
console.log('---');
console.log(issues ? `${issues} problemes estructurals trobats` : 'Cap problema estructural detectat');
