// Detecta preguntes "efímeres" del tema Reus (càrrecs, premis, rànkings,
// fets d'actualitat lligats a un any) per poder actualitzar-les a 2026.
// Ús: node scripts/reus-ephemeral.mjs
import fs from 'node:fs';

const src = fs.readFileSync('src/data/tests/reus.ts', 'utf8');

// Parseig dels blocs de pregunta.
const blockRe = /\{\s*id: '([^']+)',\s*text: '((?:[^'\\]|\\.)*)',\s*options: \[([\s\S]*?)\],\s*correct: (\d),\s*reference: '((?:[^'\\]|\\.)*)',\s*\}/g;
const optRe = /'((?:[^'\\]|\\.)*)'/g;
const unesc = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

// Només marcadors de temps PRESENT: preguntes que demanen l'estat
// "ara mateix" (i per tant s'han d'actualitzar o ancorar a l'any).
const KW = [
  'actual', 'actualment', 'aquest any', 'aquesta any', 'recentment',
  'vigent', 'a dia', "ara mateix", 'darrerament',
];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const out = [];
let m;
while ((m = blockRe.exec(src))) {
  const id = m[1];
  const text = unesc(m[2]);
  const options = [...m[3].matchAll(optRe)].map((x) => unesc(x[1]));
  const correct = +m[4];
  const reference = unesc(m[5]);
  const hay = norm(text);
  if (KW.some((k) => hay.includes(norm(k)))) {
    out.push({ id, text, options, correct, reference });
  }
}

fs.writeFileSync('_tmp_pdf/reus/ephemeral.json', JSON.stringify(out, null, 2), 'utf8');
console.log(`Candidates efímeres: ${out.length}`);
for (const q of out) {
  console.log(`\n[${q.id}] (${q.reference})\n  ${q.text}`);
  q.options.forEach((o, i) => console.log(`   ${i === q.correct ? '✔' : ' '} ${'abcd'[i]}) ${o}`));
}
