// Repassa les 170 preguntes generades buscant senyals que alguna cosa ha
// anat malament a l'extracció: opcions tallades, restes del quadernet,
// enunciats sense pregunta, respostes fora de rang.
import fs from 'node:fs';

const OUT = 'C:/Users/edugu/Documents/infopol/src/data/tests';
const SLUGS = [
  'mossos-examen-2017',
  'mossos-examen-2020',
  'mossos-examen-2023',
  'mossos-examen-2024',
  'mossos-examen-2025',
];

const SOSPITES = [
  [/\bde la Sub$|\bdel$|\bde l’$|\bla$|\bel$/i, 'acaba a mitja frase'],
  [/NO OBRIU|ESPEREU-VOS|PASSEU DE PÀGINA|qüestionari consta|INSTRUCCIONS/i, 'text del quadernet'],
  [/Model \d+$|MODEL \d+/i, 'capçalera de model'],
  [/^\s*$/, 'buit'],
];

let total = 0;
let avisos = 0;
const repartiment = [0, 0, 0, 0];

for (const s of SLUGS) {
  const t = fs.readFileSync(`${OUT}/${s}.ts`, 'utf8');
  const blocs = t.split(/\n    \{\n/).slice(1);
  for (const b of blocs) {
    total++;
    const id = /id: '(.*)'/.exec(b)?.[1] ?? '?';
    const text = /text: '(.*)',/.exec(b)?.[1] ?? '';
    const opts = [...b.matchAll(/^\s{8}'(.*)',$/gm)].map((m) => m[1]);
    const correct = Number(/correct: (\d)/.exec(b)?.[1] ?? -1);
    repartiment[correct] = (repartiment[correct] ?? 0) + 1;

    const problemes = [];
    if (opts.length !== 4) problemes.push(`té ${opts.length} opcions`);
    if (correct < 0 || correct > 3) problemes.push('resposta fora de rang');
    if (text.length < 15) problemes.push('enunciat molt curt');
    for (const camp of [text, ...opts]) {
      for (const [re, motiu] of SOSPITES) {
        if (re.test(camp)) problemes.push(`${motiu}: "${camp.slice(-42)}"`);
      }
    }
    if (problemes.length) {
      avisos++;
      console.log(`⚠ ${id}: ${problemes.join(' · ')}`);
    }
  }
}

console.log(`\nTotal: ${total} preguntes · ${avisos} amb avisos`);
console.log('Repartiment de respostes A/B/C/D:', repartiment.join(' / '));
