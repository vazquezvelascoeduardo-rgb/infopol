// Proves del disc que gira.
//
// La comprovació que compta: alinear la fletxa i comparar el contingut.
// Això és exactament el que fa qui resol l'exercici, i per tant si el
// programa hi diu que només una opció coincideix, és que només una hi
// coincideix de veritat.
//
// A més es comprova que el model no sigui simètric. Si ho fos, el seu
// reflex es podria fer coincidir girant-lo, i aleshores els distractors
// —que són reflexos— també serien respostes bones.
import * as D from './disc.mjs';
import { rng } from './atzar.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

titol('1. Girar i reflectir es comporten com han de fer-ho');
{
  const r = rng(4242);
  for (let i = 0; i < 300; i++) {
    const d = D.generaItem(1 + (i % 50)).model;
    // Girar no canvia el que es veu un cop alineada la fletxa: aquesta és
    // tota la gràcia de l'exercici.
    for (let k = 0; k < 12; k++) {
      cal('girar no canvia el contingut alineat', D.clau(D.gira(d, k)) === D.clau(d), `k=${k}`);
    }
    cal('dotze girs tornen a l\'origen', JSON.stringify(D.gira(d, 12)) === JSON.stringify(d));
    cal('reflectir dues vegades no fa res',
      JSON.stringify(D.reflecteix(D.reflecteix(d))) === JSON.stringify(d));
    // I reflectir SÍ que el canvia, sempre que no sigui simètric.
    if (!D.esSimetric(d)) {
      cal('reflectir canvia el contingut alineat', D.clau(D.reflecteix(d)) !== D.clau(d));
      for (let k = 0; k < 12; k++) {
        cal('i no hi ha cap gir que ho arregli',
          D.clau(D.gira(D.reflecteix(d), k)) !== D.clau(d), `k=${k}`);
      }
    }
  }
}

const N = 250;
titol(`2. ${N} ítems, alineant la fletxa a mà`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = D.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }
  cal('només una opció coincideix', it.control.quantesCoincideixen === 1,
    `llavor ${seed}: ${it.control.quantesCoincideixen}`);

  // Refet aquí: alinear la fletxa de cada opció amb la del model i comparar.
  const objectiu = D.clau(it.model);
  const coincideixen = it.opcions.filter((o) => D.clau(o) === objectiu);
  cal('en coincideix exactament una', coincideixen.length === 1,
    `llavor ${seed}: ${coincideixen.length}`);
  cal('i és la marcada', D.clau(it.opcions[it.correcta]) === objectiu, `llavor ${seed}`);

  // Les altres tres han de ser reflexos, no girs.
  it.opcions.forEach((o, i) => {
    if (i === it.correcta) return;
    const esGir = Array.from({ length: 12 }, (_, k) => D.clau(D.gira(it.model, k)))
      .includes(D.clau(o));
    cal('els distractors no són girs del model', !esGir, `llavor ${seed}, opció ${'abcd'[i]}`);
    const esReflex = Array.from({ length: 12 }, (_, k) => D.clau(D.gira(D.reflecteix(it.model), k)))
      .includes(D.clau(o));
    cal('els distractors són reflexos', esReflex, `llavor ${seed}, opció ${'abcd'[i]}`);
  });

  // La bona ha d'estar girada de debò: si tingués la fletxa igual que el
  // model, es respondria sense pensar.
  cal('la bona no té la fletxa del model',
    it.opcions[it.correcta].fletxa !== it.model.fletxa, `llavor ${seed}`);

  // Totes les opcions han de portar les mateixes peces: si una en tingués
  // més o menys, es descartaria comptant i no girant.
  const peces = (d) => d.elements.map((e) => e.tipus).sort().join(',');
  cal('totes porten les mateixes peces',
    it.opcions.every((o) => peces(o) === peces(it.model)), `llavor ${seed}`);
  cal('i la mateixa banda',
    it.opcions.every((o) => o.banda.tipus === it.model.banda.tipus), `llavor ${seed}`);
}
console.log(`  lletra bona:  a ${lletres[0]}   b ${lletres[1]}   c ${lletres[2]}   d ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('3. El dibuix surt sencer');
{
  const svg = D.svgFull([1, 2, 3].map((s) => D.generaItem(s)));
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha els tres enunciats', (svg.match(/es correspon amb el model/g) || []).length === 3);
  // Cinc discs per ítem, i cada disc porta dos cercles de contorn.
  const cercles = (svg.match(/<circle[^>]*r="42"/g) || []).length;
  cal('hi ha cinc discs per ítem', cercles === 3 * 5 * 2, `${cercles}`);
  cal('hi ha les fletxes', (svg.match(/<polygon points="[\d.]+,[\d.]+ /g) || []).length > 15);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
