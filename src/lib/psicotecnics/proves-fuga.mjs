// Proves del punt de fuga.
//
// La comprovació és la mateixa que al disc, i per un motiu: canviar l'ull
// de lloc és girar l'escena. Per tant s'alinea l'ull i es compara el
// contingut, que és exactament el que fa qui resol l'exercici.
//
// I es comprova que l'escena no sigui simètrica. Si ho fos, el seu reflex
// es podria fer coincidir girant-lo, i els distractors —que són reflexos—
// també serien respostes bones.
import * as F from './fuga.mjs';

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
  for (let s = 1; s <= 60; s++) {
    const e = F.generaItem(s).model;
    for (let k = 0; k < 12; k++) {
      cal('girar no canvia el contingut un cop alineat l\'ull',
        F.clau(F.gira(e, k)) === F.clau(e), `k=${k}`);
    }
    cal('dotze girs tornen a l\'origen', JSON.stringify(F.gira(e, 12)) === JSON.stringify(e));
    cal('reflectir dues vegades no fa res',
      JSON.stringify(F.reflecteix(F.reflecteix(e))) === JSON.stringify(e));
    if (!F.esSimetrica(e)) {
      cal('reflectir SÍ que el canvia', F.clau(F.reflecteix(e)) !== F.clau(e));
      for (let k = 0; k < 12; k++) {
        cal('i no hi ha cap gir que ho arregli',
          F.clau(F.gira(F.reflecteix(e), k)) !== F.clau(e), `k=${k}`);
      }
    }
  }
}

const N = 250;
titol(`2. ${N} ítems, alineant l'ull a mà`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = F.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }
  cal('només una opció coincideix', it.control.quantesCoincideixen === 1,
    `llavor ${seed}: ${it.control.quantesCoincideixen}`);

  const objectiu = F.clau(it.model);
  const bones = it.opcions.filter((o) => F.clau(o) === objectiu);
  cal('en coincideix exactament una', bones.length === 1, `llavor ${seed}: ${bones.length}`);
  cal('i és la marcada', F.clau(it.opcions[it.correcta]) === objectiu, `llavor ${seed}`);

  // Les altres tres han de ser reflexos, no girs.
  it.opcions.forEach((o, i) => {
    if (i === it.correcta) return;
    const esGir = Array.from({ length: 12 }, (_, k) => F.clau(F.gira(it.model, k))).includes(F.clau(o));
    cal('els distractors no són girs', !esGir, `llavor ${seed}, opció ${'ABCD'[i]}`);
    const esReflex = Array.from({ length: 12 }, (_, k) =>
      F.clau(F.gira(F.reflecteix(it.model), k))).includes(F.clau(o));
    cal('els distractors són reflexos', esReflex, `llavor ${seed}, opció ${'ABCD'[i]}`);
  });

  // Que no es pugui respondre sense girar: totes han de portar el mateix.
  const peces = (e) => e.objectes.map((o) => o.tipus).sort().join(',');
  cal('totes porten els mateixos objectes',
    it.opcions.every((o) => peces(o) === peces(it.model)), `llavor ${seed}`);
  cal('i són la mateixa mena d\'escena',
    it.opcions.every((o) => o.mena === it.model.mena), `llavor ${seed}`);
  cal('la bona no té l\'ull on el tenia el model',
    it.opcions[it.correcta].ull !== it.model.ull, `llavor ${seed}`);
  cal('els quatre ulls són diferents',
    new Set(it.opcions.map((o) => o.ull)).size === 4, `llavor ${seed}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('3. Varietat i dibuix');
{
  const vistes = new Set();
  for (let seed = 1; seed <= 400; seed++) vistes.add(F.clau(F.generaItem(seed).model));
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  console.log(`  ${vistes.size} escenes diferents de 400 llavors`);

  const it = F.generaItem(1);
  const e = F.svgEnunciat(it), o = F.svgOpcio(it, 0);
  cal('l\'enunciat és un SVG sencer', e.startsWith('<svg') && !/NaN|undefined/.test(e));
  cal('l\'opció també', o.startsWith('<svg') && !/NaN|undefined/.test(o));
  cal('porten viewBox', e.includes('viewBox') && o.includes('viewBox'));
  // Cada escena té el seu clipPath amb un identificador únic: si es
  // repetissin, els discs es retallarien els uns amb els altres.
  const full = F.svgFull([1, 2, 3].map((s) => F.generaItem(s)));
  const ids = [...full.matchAll(/<clipPath id="([^"]+)"/g)].map((m) => m[1]);
  cal('cap identificador de retall repetit', new Set(ids).size === ids.length,
    `${ids.length} retalls, ${new Set(ids).size} diferents`);
  cal('el full surt sencer', !/NaN|undefined/.test(full));
  cal('hi ha les cinc escenes de cada ítem', ids.length === 3 * 5, `${ids.length}`);
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
