// Proves del cub de Rubik.
//
// Definir bé els moviments és tota la feina: un cicle mal posat dona un cub
// que sembla bo i no ho és, i mirant-lo no es nota. Per això les proves no
// miren el dibuix, miren coses que han de ser certes sí o sí:
//
//  1. Girar quatre vegades la mateixa cara ho deixa tot com estava.
//  2. Un gir i el seu contrari, també.
//  3. Els colors no es creen ni es perden.
//  4. I la que ho tanca: (R U R' U') repetit SIS vegades torna el cub al
//     punt de partida. És un fet conegut del cub de Rubik, no una cosa que
//     em pugui inventar; si els meus cicles estiguessin mal fets, no
//     sortiria. El mateix passa amb (R U R' U' R' F R2 U' R' U' R U R' F'),
//     que és un algoritme de dotze passos que deixa el cub com estava.
import * as R from './rubik.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

/** Un cub amb els 54 adhesius diferents: així es veu si algun es perd. */
function cubMarcat() {
  const c = {};
  for (const cara of R.CARES) c[cara] = Array.from({ length: 9 }, (_, i) => `${cara}${i}`);
  return c;
}
/**
 * Llegeix la notació del cub: `R` gira la dreta, `R'` al revés i `R2` dues
 * vegades. El «2» és fàcil de passar per alt i llavors els algoritmes no
 * surten; a mi em va passar.
 */
const seq = (cub, text) => text.trim().split(/\s+/).reduce((c, m) => {
  if (m.includes('2')) return R.mou(R.mou(c, m[0], true), m[0], true);
  return R.mou(c, m[0], !m.includes("'"));
}, cub);

titol('1. Quatre girs iguals ho deixen tot com estava');
{
  const base = cubMarcat();
  for (const cara of R.CARES) {
    let c = base;
    for (let i = 0; i < 4; i++) c = R.mou(c, cara, true);
    cal(`${cara} quatre vegades`, R.clau(c) === R.clau(base), cara);
    let d = base;
    for (let i = 0; i < 4; i++) d = R.mou(d, cara, false);
    cal(`${cara}' quatre vegades`, R.clau(d) === R.clau(base), cara);
    cal(`${cara} canvia alguna cosa`, R.clau(R.mou(base, cara, true)) !== R.clau(base), cara);
  }
}

titol('2. Un gir i el seu contrari es desfan');
{
  const base = cubMarcat();
  for (const cara of R.CARES) {
    cal(`${cara} i ${cara}'`, R.clau(R.mou(R.mou(base, cara, true), cara, false)) === R.clau(base), cara);
    cal(`${cara}' i ${cara}`, R.clau(R.mou(R.mou(base, cara, false), cara, true)) === R.clau(base), cara);
    // Dos mitjos girs també.
    const dos = R.mou(R.mou(base, cara, true), cara, true);
    cal(`${cara}2 fet dues vegades`, R.clau(R.mou(R.mou(dos, cara, true), cara, true)) === R.clau(base), cara);
  }
}

titol('3. Cap adhesiu es perd ni es duplica');
{
  let c = cubMarcat();
  const tots = () => R.CARES.flatMap((x) => c[x]).sort().join(',');
  const abans = tots();
  const noms = R.CARES;
  for (let i = 0; i < 200; i++) {
    c = R.mou(c, noms[i % 6], i % 3 !== 0);
    cal('els 54 adhesius hi són tots', new Set(R.CARES.flatMap((x) => c[x])).size === 54, `pas ${i}`);
  }
  cal('i són exactament els mateixos', tots() === abans);
  cal('cada cara segueix tenint nou caselles',
    R.CARES.every((x) => c[x].length === 9));
}

titol('4. La prova que ho tanca: els algoritmes coneguts del cub');
{
  const base = cubMarcat();
  // (R U R' U') sis vegades torna al principi. És un fet del cub de Rubik.
  let c = base;
  for (let i = 0; i < 6; i++) c = seq(c, "R U R' U'");
  cal("(R U R' U') sis vegades torna al punt de partida", R.clau(c) === R.clau(base));
  // I abans de la sisena, NO hi ha de ser: si hi fos, els moviments no
  // estarien fent res.
  let d = base;
  for (let i = 0; i < 5; i++) d = seq(d, "R U R' U'");
  cal('...i amb cinc encara no hi és', R.clau(d) !== R.clau(base));

  // El «sexy move» amb la seva inversa.
  cal("R U R' U' desfet amb U R U' R'",
    R.clau(seq(seq(base, "R U R' U'"), "U R U' R'")) === R.clau(base));

  // T-perm: aplicat dues vegades, deixa el cub com estava.
  const t = "R U R' U' R' F R2 U' R' U' R U R' F'";
  cal('el T-perm fet dues vegades no canvia res',
    R.clau(seq(seq(base, t), t)) === R.clau(base));
  cal('...però fet una sola vegada, sí', R.clau(seq(base, t)) !== R.clau(base));

  // Sune, d'ordre 6 sobre un cub resolt.
  let s = base;
  for (let i = 0; i < 6; i++) s = seq(s, "R U R' U R U2 R'");
  cal('el Sune sis vegades torna al punt de partida', R.clau(s) === R.clau(base));
}

const N = 250;
titol(`5. ${N} ítems`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = R.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }

  // Refet aquí: s'apliquen els moviments des de zero i es compara.
  const meva = R.mouTot(it.inici, it.moviments);
  cal('la marcada és la que surt de fer els moviments',
    R.clauVisible(it.opcions[it.correcta]) === R.clauVisible(meva), `llavor ${seed}`);
  cal('cap altra opció no hi coincideix',
    it.opcions.filter((o) => R.clauVisible(o) === R.clauVisible(meva)).length === 1, `llavor ${seed}`);
  cal('dos moviments', it.moviments.length === 2, `llavor ${seed}`);
  cal('els colors es conserven a totes les opcions',
    it.opcions.every((o) => R.comptaColors(o) === R.comptaColors(it.inici)), `llavor ${seed}`);
  cal('el cub de partida té caselles pintades',
    R.comptaColors(it.inici).includes('magenta')
    || R.comptaColors(it.inici).includes('blau')
    || R.comptaColors(it.inici).includes('groc'), `llavor ${seed}`);
  // Es pot desfer: si es fan els moviments al revés i en ordre invers,
  // s'ha de tornar al cub de partida.
  const desfet = R.mouTot(meva, [...it.moviments].reverse().map((m) => ({ ...m, horari: !m.horari })));
  cal('desfer els moviments torna al cub de partida',
    R.clau(desfet) === R.clau(it.inici), `llavor ${seed}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('6. Varietat i dibuix');
{
  const vistes = new Set();
  for (let seed = 1; seed <= 400; seed++) {
    const it = R.generaItem(seed);
    vistes.add(R.clauVisible(it.inici) + '|' + it.moviments.map((m) => m.cara + (m.horari ? '' : "'")).join(''));
  }
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  console.log(`  ${vistes.size} ítems diferents de 400 llavors`);

  const it = R.generaItem(1);
  const e = R.svgEnunciat(it), o = R.svgOpcio(it, 0);
  cal('l\'enunciat és un SVG sencer', e.startsWith('<svg') && !/NaN|undefined/.test(e));
  cal('l\'opció també', o.startsWith('<svg') && !/NaN|undefined/.test(o));
  cal('el dibuix porta viewBox', e.includes('viewBox') && o.includes('viewBox'));
  // 27 caselles + 3 contorns per cub.
  const cares = (o.match(/<polygon/g) || []).length;
  cal('hi ha les 27 caselles i els 3 contorns', cares === 30, `${cares}`);
  const full = R.svgFull([1, 2, 3].map((s) => R.generaItem(s)));
  cal('el full surt sencer', !/NaN|undefined/.test(full));
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
