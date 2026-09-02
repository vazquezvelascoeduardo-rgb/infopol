// Afegeix les preguntes d'un .md al test d'actualitat, SENSE tocar les que
// ja hi ha.
//
// El seu germà import-actualitat-md.mjs regenera el fitxer sencer a partir
// d'un sol .md: si s'executés ara s'emportaria per davant les 260 preguntes
// acumulades. Aquest hi afegeix una tanda nova i prou.
//
// ús: node scripts/afegeix-actualitat-md.mjs <fitxer.md> <prefix-id>
//     node scripts/afegeix-actualitat-md.mjs ~/Downloads/test.md act-ago26

import fs from 'node:fs';

const MD_PATH = process.argv[2];
const PREFIX = process.argv[3];
const OUT_PATH = 'src/data/tests/actualitat-pl-2026.ts';

if (!MD_PATH || !PREFIX) {
  console.error('ús: node scripts/afegeix-actualitat-md.mjs <fitxer.md> <prefix-id>');
  process.exit(1);
}

const Q_RE = /^\*\*(\d+)\.\s+(.+?)\*\*\s*$/;
const OPT_RE = /^-\s+(?:\*\*)?([a-d])\)\s+(.+?)(?:\*\*)?\s*$/;
const OPT_CORRECT_RE = /^-\s+\*\*([a-d])\)\s+(.+?)\*\*\s*$/;

const lines = fs.readFileSync(MD_PATH, 'utf8').split(/\r?\n/);
const questions = [];
let q = null;
for (const line of lines) {
  const qm = Q_RE.exec(line);
  if (qm) {
    if (q) questions.push(q);
    q = { num: parseInt(qm[1], 10), text: qm[2].trim(), options: ['', '', '', ''], correct: null };
    continue;
  }
  if (!q) continue;
  const cm = OPT_CORRECT_RE.exec(line);
  if (cm) {
    const i = cm[1].charCodeAt(0) - 97;
    q.options[i] = cm[2].trim();
    q.correct = i;
    continue;
  }
  const om = OPT_RE.exec(line);
  if (om) q.options[om[1].charCodeAt(0) - 97] = om[2].trim();
}
if (q) questions.push(q);

// Res a mitges: una pregunta sense resposta correcta o amb una opció buida
// arribaria al test i l'agent la fallaria sempre.
const incompletes = questions.filter((x) => x.correct == null || x.options.some((o) => !o));
if (incompletes.length) {
  console.error(`${incompletes.length} preguntes incompletes. No s'afegeix res.`);
  for (const x of incompletes.slice(0, 5)) {
    console.error(' ', x.num, x.text.slice(0, 60), '| correcta:', x.correct, '| opcions:', x.options);
  }
  process.exit(1);
}

const original = fs.readFileSync(OUT_PATH, 'utf8');

// Els ids han de ser únics dins del test: si el prefix ja s'ha fet servir,
// millor aturar-se que no pas duplicar-los.
const idsExistents = new Set([...original.matchAll(/id: '([^']+)'/g)].map((m) => m[1]));
const nous = questions.map((x) => `${PREFIX}-${x.num}`);
const xocs = nous.filter((id) => idsExistents.has(id));
if (xocs.length) {
  console.error(`${xocs.length} ids ja existeixen (${xocs.slice(0, 3).join(', ')}...). No s'afegeix res.`);
  process.exit(1);
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const blocs = questions.map((x) =>
  [
    '    {',
    `      id: '${PREFIX}-${x.num}',`,
    `      text: '${esc(x.text)}',`,
    '      options: [',
    ...x.options.map((o) => `        '${esc(o)}',`),
    '      ],',
    `      correct: ${x.correct},`,
    '    },',
  ].join('\n'),
);

// S'insereix just abans del tancament de l'array de preguntes.
const tanca = original.lastIndexOf('  ],\n};');
if (tanca === -1) {
  console.error("no s'ha trobat el final de questions[] a " + OUT_PATH);
  process.exit(1);
}
const sortida = original.slice(0, tanca) + blocs.join('\n') + '\n' + original.slice(tanca);
fs.writeFileSync(OUT_PATH, sortida, 'utf8');

console.log(`Afegides ${questions.length} preguntes amb el prefix "${PREFIX}".`);
console.log('Total al fitxer:', (sortida.match(/id: '/g) || []).length);
