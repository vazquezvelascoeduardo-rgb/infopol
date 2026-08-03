// Proves del dau que roda.
//
// L'Eduardo mira que es vegi bé; el número no el pot comprovar. O sigui
// que la garantia ha de sortir d'aquí, i per això la resposta es calcula
// per dues vies que no s'assemblen: un diccionari de sis bandes, i el
// motor de plegat fent girar el cub de veritat.
//
// A més hi ha tres invariants que no depenen de com estigui escrit el codi:
// rodar quatre vegades cap al mateix costat torna a deixar-ho tot igual;
// rodar i desfer el pas també; i les oposades han de sumar set sempre.
import * as D from './dau.mjs';
import { rng } from './atzar.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const BANDES = ['dalt', 'baix', 'dreta', 'esquerra', 'davant', 'darrere'];
const igual = (a, b) => BANDES.every((k) => a[k] === b[k]);
const set = (d) => d.dalt + d.baix === 7 && d.dreta + d.esquerra === 7 && d.davant + d.darrere === 7;
const CONTRARI = { dreta: 'esquerra', esquerra: 'dreta', davant: 'darrere', darrere: 'davant' };

titol('1. Els invariants de rodar');
{
  const r = rng(12345);
  for (let i = 0; i < 200; i++) {
    // Un dau qualsevol, muntat a mà perquè la prova no depengui del generador.
    const dalt = 1 + Math.floor(r() * 6);
    const dreta = [1, 2, 3, 4, 5, 6].filter((n) => n !== dalt && n !== 7 - dalt)[Math.floor(r() * 4)];
    const davant = [1, 2, 3, 4, 5, 6]
      .filter((n) => ![dalt, 7 - dalt, dreta, 7 - dreta].includes(n))[Math.floor(r() * 2)];
    const d = { dalt, baix: 7 - dalt, dreta, esquerra: 7 - dreta, davant, darrere: 7 - davant };
    cal('el dau de partida ja suma set', set(d));

    for (const pas of Object.keys(D.PASSOS)) {
      cal('quatre passos iguals ho deixen tot com estava',
        igual(D.roda(d, [pas, pas, pas, pas]), d), pas);
      cal('un pas i el contrari, igual',
        igual(D.roda(d, [pas, CONTRARI[pas]]), d), pas);
      cal('després d\'un pas encara suma set', set(D.roda(d, [pas])), pas);
      cal('un pas canvia alguna cosa', !igual(D.roda(d, [pas]), d), pas);
      // La cara de dalt ha d'anar a parar cap on s'avança.
      const desp = D.roda(d, [pas]);
      cal('la de dalt passa a mirar cap on s\'ha rodat', desp[pas] === d.dalt, pas);
      // I la de dalt nova ha de ser la del costat contrari.
      cal('i puja la del costat contrari', desp.dalt === d[CONTRARI[pas]], pas);
    }
  }
}

titol('2. Les dues vies diuen el mateix, sempre');
{
  const r = rng(999);
  const noms = Object.keys(D.PASSOS);
  for (let i = 0; i < 400; i++) {
    const dalt = 1 + Math.floor(r() * 6);
    const dreta = [1, 2, 3, 4, 5, 6].filter((n) => n !== dalt && n !== 7 - dalt)[Math.floor(r() * 4)];
    const davant = [1, 2, 3, 4, 5, 6]
      .filter((n) => ![dalt, 7 - dalt, dreta, 7 - dreta].includes(n))[Math.floor(r() * 2)];
    const d = { dalt, baix: 7 - dalt, dreta, esquerra: 7 - dreta, davant, darrere: 7 - davant };
    const cami = Array.from({ length: 1 + Math.floor(r() * 8) }, () => noms[Math.floor(r() * 4)]);
    const a = D.roda(d, cami);
    const b = D.rodaAmbElMotor(d, cami);
    cal('el diccionari i el motor coincideixen', igual(a, b),
      `camí ${cami.join('>')}: ${JSON.stringify(a)} contra ${JSON.stringify(b)}`);
    cal('i el resultat segueix sumant set', set(a));
  }
}

const N = 300;
titol(`3. ${N} ítems`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = D.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }

  // Tornar a fer rodar el dau des de zero, per les dues vies.
  const a = D.roda(it.dau, it.cami);
  const b = D.rodaAmbElMotor(it.dau, it.cami);
  cal('la resposta marcada és la que surt de fer-lo rodar',
    it.opcions[it.correcta] === a.dalt,
    `llavor ${seed}: diu ${it.opcions[it.correcta]}, en surt ${a.dalt}`);
  cal('i les dues vies hi coincideixen', a.dalt === b.dalt, `llavor ${seed}`);
  cal('cap altra opció no hi coincideix',
    it.opcions.filter((o) => o === a.dalt).length === 1, `llavor ${seed}`);
  cal('totes les opcions són números de dau',
    it.opcions.every((o) => o >= 1 && o <= 6), `llavor ${seed}`);

  // El camí: dins del tauler i sense passar dues vegades per la mateixa.
  cal('el camí no repeteix caselles',
    new Set(it.caselles.map((p) => p.join(','))).size === it.caselles.length, `llavor ${seed}`);
  cal('el camí no se surt del tauler',
    it.caselles.every(([x, z]) => x >= 0 && z >= 0 && x < 6 && z < 6), `llavor ${seed}`);
  cal('hi ha tants passos com caselles menys una',
    it.cami.length === it.caselles.length - 1, `llavor ${seed}`);
  cal('el camí té entre tres i sis passos',
    it.cami.length >= 3 && it.cami.length <= 6, `llavor ${seed}: ${it.cami.length}`);

  // Que no sigui regalat: si el dau no es mogués, la de dalt seria la
  // mateixa. Amb un camí de tres passos o més, no ho pot ser sempre.
  if (it.cami.length % 4 !== 0) {
    // (amb quatre passos en línia recta sí que hi tornaria, i és legítim)
  }
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('4. El dibuix surt sencer');
{
  const svg = D.svgFull([1, 2, 3].map((s) => D.generaItem(s)));
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha els tres enunciats', (svg.match(/part SUPERIOR/g) || []).length === 3);
  cal('hi ha la X de destí', (svg.match(/>X</g) || []).length === 3);
  // 36 caselles de tauler + 3 cares del dau, per ítem.
  const poligons = (svg.match(/<polygon/g) || []).length;
  cal('hi ha el tauler i el dau', poligons === 3 * (36 + 3), `${poligons}`);
  cal('hi ha caselles grises', (svg.match(/fill="#c9ccd1"/g) || []).length > 6);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
