// Construeix src/data/tests/reus.ts a partir dels JSON extrets dels
// exàmens reals de Reus (a _tmp_pdf/reus/reus_*.json).
//
// - Deduplica preguntes repetides entre anys. Dues preguntes es
//   consideren LA MATEIXA si coincideixen el text normalitzat I el text
//   de la resposta correcta (així no fusionem preguntes "actuals" amb
//   resposta diferent segons l'any).
// - Cada pregunta indica a `reference` els anys en què ha sortit:
//   "Reus 2019" o "Reus 2019 · 2022".
//
// Ús: node scripts/build-reus-test.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIR = '_tmp_pdf/reus';
const OUT = 'src/data/tests/reus.ts';

function norm(s) {
  return (s || '')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\s+/g, ' ').trim();
}

const files = fs.readdirSync(DIR)
  .filter((f) => /^reus_.*\.json$/.test(f))
  .sort(); // 2017, 2019, 2020... ordre cronològic per nom

const map = new Map(); // key -> { text, options, correct, years:Set }
let totalRaw = 0, dupMerged = 0;

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const year = data.year;
  if (!Array.isArray(data.questions)) continue;
  for (const q of data.questions) {
    if (!q || !Array.isArray(q.options) || q.options.length !== 4) continue;
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) continue;
    if (q.options.some((o) => !String(o).trim())) continue;
    totalRaw++;
    const correctText = q.options[q.correct];
    const key = norm(q.text) + ' ||CORR|| ' + norm(correctText);
    if (map.has(key)) {
      map.get(key).years.add(year);
      dupMerged++;
    } else {
      map.set(key, {
        text: String(q.text).replace(/\s+/g, ' ').trim(),
        options: q.options.map((o) => String(o).replace(/\s+/g, ' ').trim()),
        correct: q.correct,
        years: new Set([year]),
      });
    }
  }
}

const items = [...map.values()];

// Genera el cos del fitxer .ts
const blocks = items.map((q, i) => {
  const years = [...q.years].sort((a, b) => a - b);
  const ref = 'Reus ' + years.join(' · ');
  const lines = [];
  lines.push('    {');
  lines.push(`      id: 'reus-${i + 1}',`);
  lines.push(`      text: '${esc(q.text)}',`);
  lines.push('      options: [');
  for (const o of q.options) lines.push(`        '${esc(o)}',`);
  lines.push('      ],');
  lines.push(`      correct: ${q.correct},`);
  lines.push(`      reference: '${esc(ref)}',`);
  lines.push('    },');
  return lines.join('\n');
});

const ts = `// Test de Reus — preguntes d'exàmens oficials reals d'anys anteriors.
// Guàrdia Urbana de Reus (proves culturals/teòriques) i caporal.
// Generat automàticament per scripts/build-reus-test.mjs a partir dels
// exàmens. Cada pregunta indica l'any (o anys) en què ha sortit.
// ${items.length} preguntes úniques · ${totalRaw} brutes · ${dupMerged} duplicades fusionades.
import type { TestTopic } from './types';

const topic: TestTopic = {
  slug: 'reus',
  title: 'Reus',
  description: 'Exàmens oficials d\\'anys anteriors (Guàrdia Urbana i caporal) · 2017–2025.',
  icon: '🌹',
  accent: 'from-rose-500 to-red-700',
  category: 'municipi',
  municipi: 'Reus',
  questions: [
${blocks.join('\n')}
  ],
};

export default topic;
`;

fs.writeFileSync(OUT, ts, 'utf8');
console.log(`Escrit ${OUT}`);
console.log(`Preguntes úniques: ${items.length} · brutes: ${totalRaw} · duplicades fusionades: ${dupMerged}`);
// Resum d'anys
const byYear = {};
for (const q of items) for (const y of q.years) byYear[y] = (byYear[y] || 0) + 1;
console.log('Per any (preguntes úniques que hi apareixen):', byYear);
const multi = items.filter((q) => q.years.size > 1).length;
console.log(`Preguntes que han sortit en més d'un any: ${multi}`);
