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

// ── Actualització a 2026 de preguntes efímeres ─────────────────────
// Detecció d'efímeres (marcadors de temps present).
const EPH_KW = ['actual', 'actualment', 'aquest any', 'recentment', 'vigent', 'a dia', 'darrerament'];
const isEphemeral = (text) => {
  const h = norm(text);
  return EPH_KW.some((k) => h.includes(norm(k)));
};

// UPDATE: càrrecs nacionals/internacionals estables i verificables → 2026.
// setOption: [índex, nou text] · correct: índex de la resposta correcta.
const UPDATES = {
  'reus-107': { correct: 0 },                                          // Brasil → Lula
  'reus-486': { correct: 1 },                                          // Brasil → Lula
  'reus-470': { correct: 2 },                                          // EUA → Trump
  'reus-707': { setOption: [2, 'JD Vance'], correct: 2 },              // VP EUA → Vance
  'reus-473': { setOption: [0, 'Salvador Illa i Roca'], correct: 0 },  // Pres. Generalitat → Illa
  'reus-93':  { setOption: [0, 'Ursula von der Leyen'], correct: 0 },  // Pres. Comissió Europea
  'reus-47':  { setOption: [0, 'José Luis Martínez-Almeida'], correct: 0 }, // Alcalde Madrid
  'reus-159': { setOption: [0, 'Luis de la Fuente'], correct: 0 },     // Seleccionador Espanya
  'reus-280': { setOption: [0, 'Luis de la Fuente'], correct: 0 },     // Seleccionador Espanya

  // ── Premis anuals → adaptats a l'última edició (verificat per web) ──
  // Oscars 98a edició (2026): One Battle After Another · Paul Thomas Anderson · Michael B. Jordan
  'reus-2': {
    text: "Quina pel·lícula ha guanyat l'Oscar a la millor pel·lícula a la 98a edició (2026)?",
    options: ['One Battle After Another', 'Anora', 'The Brutalist', 'Sinners'], correct: 0,
  },
  'reus-137': {
    text: "Qui ha guanyat l'Oscar al millor director a la 98a edició dels Oscars (2026)?",
    options: ['Paul Thomas Anderson', 'Sean Baker', 'Christopher Nolan', 'Jonathan Glazer'], correct: 0,
  },
  'reus-414': { // treu el "últims" enganyós → ancorat a la seva edició
    text: "Qui va guanyar l'Oscar al millor director als Premis Òscar 2022 (94a edició)?", correct: 0,
  },
  'reus-478': {
    text: "Qui ha guanyat l'Oscar al millor actor protagonista a la 98a edició dels Oscars (2026)?",
    options: ['Michael B. Jordan', 'Timothée Chalamet', 'Colman Domingo', 'Ralph Fiennes'], correct: 0,
  },
  // Goya 40a edició (2026): Los domingos · Patricia López Arnáiz
  'reus-115': {
    text: 'Quina pel·lícula ha guanyat el Goya 2026 a la millor pel·lícula?',
    options: ['Los domingos', 'Sirat', 'Sorda', 'Maspalomas'], correct: 0,
  },
  'reus-828': {
    text: 'Qui va guanyar el premi Goya 2026 a la millor actriu protagonista?', correct: 1,
  },
  // Cervantes 2025: Gonzalo Celorio
  'reus-164': {
    text: 'Qui ha guanyat el Premi Cervantes 2025?',
    options: ['Gonzalo Celorio', 'Ida Vitale', 'Luis Mateo Díez', 'Álvaro Pombo'], correct: 0,
  },
  // Planeta 2025: Juan del Val
  'reus-182': {
    text: 'Qui ha guanyat el Premi Planeta 2025 amb la novel·la «Vera, una historia de amor»?',
    options: ['Juan del Val', 'Ángela Banzas', 'Sonsoles Ónega', 'Paloma Sánchez-Garnica'], correct: 0,
  },
  // Nobel de la Pau 2025: María Corina Machado
  'reus-117': {
    text: 'Qui va rebre el Premi Nobel de la Pau 2025?',
    options: ['María Corina Machado', 'Nihon Hidankyo', 'Narges Mohammadi', 'Volodímir Zelenski'], correct: 0,
  },
  // Cannes 78a edició (2025): millor actor Wagner Moura
  'reus-199': {
    text: 'Qui va guanyar el premi al millor actor al Festival de Cannes 2025?',
    options: ['Wagner Moura', 'Jafar Panahi', 'Joaquin Phoenix', 'Pedro Pascal'], correct: 0,
  },
};

// LEAVE: efímeres "de mentida" — fets permanents o càrrecs encara vigents
// el 2026. No es toquen.
const LEAVE = new Set([
  'reus-15', 'reus-25', 'reus-37', 'reus-69', 'reus-104', 'reus-148', 'reus-162',
  'reus-200', 'reus-228', 'reus-260', 'reus-269', 'reus-275', 'reus-276', 'reus-283',
  'reus-290', 'reus-293', 'reus-301', 'reus-305', 'reus-358', 'reus-363', 'reus-365',
  'reus-430', 'reus-476', 'reus-597', 'reus-708', 'reus-728', 'reus-745', 'reus-835',
]);

let nUpdated = 0, nAnchored = 0;
items.forEach((q, i) => {
  const id = `reus-${i + 1}`;
  const years = [...q.years].sort((a, b) => a - b);
  if (UPDATES[id]) {
    const u = UPDATES[id];
    if (u.text) q.text = u.text;
    if (u.options) q.options = u.options.slice();
    if (u.setOption) q.options[u.setOption[0]] = u.setOption[1];
    if (typeof u.correct === 'number') q.correct = u.correct;
    q._refSuffix = ' · act. 2026';
    nUpdated++;
  } else if (!LEAVE.has(id) && isEphemeral(q.text)) {
    q.text = `${q.text} (a l'examen de ${years[0]})`;
    nAnchored++;
  }
});

// Genera el cos del fitxer .ts
const blocks = items.map((q, i) => {
  const years = [...q.years].sort((a, b) => a - b);
  const ref = 'Reus ' + years.join(' · ') + (q._refSuffix || '');
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
console.log(`Efímeres actualitzades a 2026: ${nUpdated} · ancorades a l'any: ${nAnchored}`);
