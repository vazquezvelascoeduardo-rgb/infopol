// Genera els TestTopics dels exàmens oficials de Mossos.
//
// Cada examen és un test propi, com el dia de la prova. El que no passa la
// validació no s'escriu: val més un examen amb 47 preguntes bones que un
// amb 50 i tres inventades.
import fs from 'node:fs';
import path from 'node:path';
import { preguntes, plantilles, fusiona } from './parseja.mjs';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ''));
const OUT = 'C:/Users/edugu/Documents/infopol/src/data/tests';

// Els sis exàmens que tenen el text llegible i la plantilla neta. El de
// 46/19 (Models-subprova-...-4619) es queda fora: la seva plantilla té les
// "C" llegides com a "e", i endevinar-les seria posar respostes falses.
const EXAMENS = [
  {
    fitxer: 'Subprova-coneixements-Model-01-4617.txt',
    slug: 'mossos-examen-2017',
    title: 'Mossos 2017 · Model 01',
    any: 2017,
  },
  {
    fitxer: '0-PLANTILLA-PREGUNTES-I-RESPOSTES-CONEIXEMENTS-46-002-19.txt',
    slug: 'mossos-examen-2020',
    title: 'Mossos 2020 · Model 01',
    any: 2020,
  },
  {
    fitxer: 'CONEIXEMENTS-MODEL-01-02-I-PLANTILLA-RESPOSTES-4623.txt',
    slug: 'mossos-examen-2023',
    title: 'Mossos 2023 · Model 01',
    any: 2023,
  },
    {
    fitxer: 'Preguntes-i-plantilla-de-respostes-de-la-subprova-de-coneixement.txt',
    slug: 'mossos-examen-2024',
    title: 'Mossos 2024 · Model 01',
    any: 2024,
  },
  {
    fitxer: '4.-Preguntes-i-plantilla-de-respostes-de-la-subprova-de-coneixements.txt',
    slug: 'mossos-examen-2025',
    title: 'Mossos 2025 · Model 01',
    any: 2025,
  },
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

let totalOk = 0;
const resum = [];

for (const ex of EXAMENS) {
  const text = fs.readFileSync(path.join(DIR, ex.fitxer), 'utf8');
  const qs = preguntes(text);
  const { colA, colB } = plantilles(text);
  const { model1 } = fusiona(colA, colB);

  const bones = [];
  const fora = [];
  for (const q of qs) {
    const r = model1.get(q.num);
    const motiu =
      !r ? 'sense resposta a la plantilla'
      : q.text.length < 12 ? 'enunciat massa curt'
      : q.opts.some((o) => o.length < 1) ? 'alguna opció buida'
      : new Set(q.opts).size !== 4 ? 'opcions repetides'
      : null;
    if (motiu) { fora.push(`${q.num}: ${motiu}`); continue; }
    bones.push({ ...q, correct: 'ABCD'.indexOf(r) });
  }

  resum.push({ slug: ex.slug, trobades: qs.length, bones: bones.length, fora });
  totalOk += bones.length;

  const L = [
    `// ${ex.title} — examen oficial de la subprova de coneixements.`,
    '//',
    '// Surt del PDF oficial de la convocatòria, amb la seva plantilla de',
    "// respostes. Generat amb scripts/mossos-examens.mjs: no s'edita a mà, es",
    '// torna a generar.',
    "import type { TestTopic } from './types';",
    '',
    'const examen: TestTopic = {',
    `  slug: '${ex.slug}',`,
    `  title: '${esc(ex.title)}',`,
    `  description: 'Examen oficial de Mossos d\\'Esquadra de ${ex.any}, amb les respostes de la plantilla oficial.',`,
    "  icon: '📄',",
    "  accent: 'from-slate-500 to-slate-700',",
    "  category: 'mossos-examens',",
    '  questions: [',
  ];
  for (const q of bones) {
    L.push('    {');
    L.push(`      id: '${ex.slug}-${q.num}',`);
    L.push(`      text: '${esc(q.text)}',`);
    L.push('      options: [');
    for (const o of q.opts) L.push(`        '${esc(o)}',`);
    L.push('      ],');
    L.push(`      correct: ${q.correct},`);
    L.push('    },');
  }
  L.push('  ],', '};', '', 'export default examen;', '');
  fs.writeFileSync(path.join(OUT, `${ex.slug}.ts`), L.join('\n'), 'utf8');
}

console.log('EXAMEN'.padEnd(30), 'TROBADES', 'BONES');
for (const r of resum) {
  console.log(r.slug.padEnd(30), String(r.trobades).padStart(8), String(r.bones).padStart(6));
  if (r.fora.length) console.log('   fora:', r.fora.slice(0, 6).join(' | '), r.fora.length > 6 ? `(+${r.fora.length - 6})` : '');
}
console.log('\nTOTAL preguntes bones:', totalOk);
