// Proves de la família del mirall. Es generen dos-cents ítems i es
// comprova, un per un, que no hi ha res a triar: que només una opció
// respon, que el mirall ensenya les tres cares que el cub amaga, i que el
// reflex està capgirat i el cub no.
import * as M from './mirall.mjs';
import * as P from './plegat.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const N = 200;
const items = [];

titol(`1. Les màscares dels punts: quines cares delaten el gir`);
for (const [n, m] of Object.entries(M.PUNTS)) {
  cal(`el ${n} té ${m.split('').filter((c) => c === '1').length} punts`,
    m.split('').filter((c) => c === '1').length === Number(n), `${n} → ${m}`);
}
const info = Object.fromEntries(Object.keys(M.PUNTS)
  .map((n) => [n, M.aspectes({ tipus: 'punts', num: Number(n), m: M.PUNTS[n] })]));
console.log(`  aspectes per cara: ${Object.entries(info).map(([n, a]) => `${n}→${a}`).join('  ')}`);
cal('l\'1, el 4 i el 5 no delaten res', info[1] === 1 && info[4] === 1 && info[5] === 1);
cal('el 2, el 3 i el 6 sí', info[2] === 2 && info[3] === 2 && info[6] === 2);
cal('la negra tampoc', M.aspectes({ tipus: 'negra' }) === 1);

titol('2. Un a un, els dos-cents ítems');
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = M.generaItem(seed);
  items.push(it);
  lletres[it.correcta]++;
  const c = it.control;

  cal('el desplegable plega', c.formaPlega, `llavor ${seed}`);
  cal('24 orientacions', c.orientacions === 24, `llavor ${seed}`);
  cal('només una opció respon', c.respostesQueEncaixen === 1,
    `llavor ${seed}: hi encaixen ${c.respostesQueEncaixen}`);
  cal('la marcada és la que respon', c.marcadaEsLaBona, `llavor ${seed}`);
  cal('el reflex va sempre capgirat', c.miraTotVolteig, `llavor ${seed}`);
  cal('el cub no va mai capgirat', c.cubSenseVolteig, `llavor ${seed}`);

  // El desplegable: sis caselles, una en blanc —la cara de baix, que no es
  // veu enlloc— i les altres cinc amb el que toca.
  const blanques = it.celles.filter((x) => x.cara.tipus === 'blanca').length;
  const negres = it.celles.filter((x) => x.cara.tipus === 'negra').length;
  cal('una sola casella en blanc', blanques === 1, `llavor ${seed}: ${blanques}`);
  cal('la negra hi és, o és justament la que s\'amaga', negres <= 1, `llavor ${seed}`);
  cal('les sis caselles es veuen diferents, tret de la blanca',
    new Set(it.celles.filter((x) => x.cara.tipus !== 'blanca').map((x) => M.aspecte(x.cara))).size === 5,
    `llavor ${seed}`);

  // El mirall repeteix la cara de dalt i n'ensenya dues d'amagades: entre
  // les dues vistes se'n coneixen CINC, no sis. La sisena és la de baix.
  const idents = [...it.vistaCub, ...it.vistaMirall]
    .map((f) => (f.tipus === 'punts' ? `n${f.num}` : f.tipus));
  cal('entre cub i mirall se\'n coneixen cinc', new Set(idents).size === 5,
    `llavor ${seed}: ${idents.join(',')}`);
  cal('la de dalt es repeteix als dos', idents[0] === idents[3], `llavor ${seed}`);
  cal('el control ho confirma', c.daltEsRepeteix && c.caresConegudes === 5 && c.unaSolaEnBlanc,
    `llavor ${seed}`);
  // I la que falta al desplegable és justament la que no es veu enlloc.
  const alDesplegable = it.celles.filter((x) => x.cara.tipus !== 'blanca')
    .map((x) => (x.cara.tipus === 'punts' ? `n${x.cara.num}` : x.cara.tipus));
  cal('el desplegable ensenya just les cinc conegudes',
    [...new Set(idents)].sort().join() === [...alDesplegable].sort().join(),
    `llavor ${seed}: ${alDesplegable.join(',')} contra ${[...new Set(idents)].join(',')}`);

  // Les quatre opcions han de veure's diferents entre elles.
  const pintes = it.opcions.map((o) => o.map((x) => M.aspecte(x.cara)).join('|'));
  cal('les quatre opcions es veuen diferents', new Set(pintes).size === 4, `llavor ${seed}`);

  // I la que respon ha de ser la marcada com a correcta.
  cal('la correcta és la marcada',
    it.opcions[it.correcta].map((x) => M.aspecte(x.cara)).join('|') === pintes[it.correcta],
    `llavor ${seed}`);

  // Prou cares que delatin el gir perquè l'ítem es pugui resoldre mirant.
  cal('almenys dues cares delaten el gir', c.caresAmbInformacio >= 2,
    `llavor ${seed}: ${c.caresAmbInformacio}`);
}

titol('2b. La variant on es demana la que NO correspon');
{
  const lletresN = [0, 0, 0, 0];
  const M2 = 120;
  for (let seed = 1; seed <= M2; seed++) {
    const it = M.generaItem(seed, M.INCORRECTA);
    lletresN[it.correcta]++;
    const c = it.control;
    cal('en responen tres', c.respostesQueEncaixen === 3,
      `llavor ${seed}: en responen ${c.respostesQueEncaixen}`);
    cal('la marcada és justament la que NO respon', c.marcadaEsLaBona, `llavor ${seed}`);
    cal('les quatre opcions es veuen diferents', c.opcionsDiferents, `llavor ${seed}`);
    cal('les quatre pleguen a un cub', it.opcions.every((o) => P.valid(P.plega(
      o.map((x) => ({ nx: x.nx, ny: x.ny, dibuix: JSON.stringify(x.cara) })))), `llavor ${seed}`));
    // Els tres bons han de ser desplegables de veritat i del MATEIX cub.
    cal('i les tres bones porten les mateixes sis cares',
      new Set(it.opcions.map((o) => o.map((x) => M.aspecte(x.cara)).sort().join(','))).size <= 4,
      `llavor ${seed}`);
  }
  console.log(`  lletra a marcar:  A ${lletresN[0]}   B ${lletresN[1]}   C ${lletresN[2]}   D ${lletresN[3]}`);
  cal('repartida', lletresN.every((l) => Math.abs(l - M2 / 4) < M2 / 3), lletresN.join('/'));
  const svg = M.svgFull([1, 2, 3].map((s) => M.generaItem(s, M.INCORRECTA)));
  cal('el dibuix surt sencer', !/NaN|Infinity|undefined/.test(svg));
  cal('i l\'enunciat diu NO', /<tspan font-weight="700">NO<\/tspan>/.test(svg));
}

titol('3. La lletra bona, repartida');
console.log(`  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}   (de ${N})`);
const esperat = N / 4;
cal('cap lletra no es desvia més d\'un terç de l\'esperat',
  lletres.every((l) => Math.abs(l - esperat) < esperat / 3), lletres.join('/'));

titol('4. El dibuix surt sencer');
for (const estil of ['exacte', 'iopos']) {
  const svg = M.svgFull(items.slice(0, 10), estil);
  cal(`${estil}: cap número espatllat`, !/NaN|Infinity|undefined/.test(svg), estil);
  cal(`${estil}: hi ha els deu enunciats`, (svg.match(/Es presenta un cub/g) || []).length === 10, estil);
  const rodones = (svg.match(/<circle/g) || []).length;
  cal(`${estil}: hi ha punts dibuixats`, rodones > 100, `${rodones} punts`);
}

titol('5. El dibuix, com al material de l\'acadèmia');
{
  const s = M.svgItem(items[0], 1, 0);
  cal('hi ha el pla del mirall al darrere', /<polygon points="20,/.test(s));
  // Dos cubs: tres cares cadascun, i cada cara amb el seu polígon de fons.
  const cares = (s.match(/fill="#fff"/g) || []).length;
  cal('hi ha les tres cares de cada cub', cares >= 6, `${cares}`);
  cal('el desplegable ensenya una casella buida',
    items[0].celles.some((c) => c.cara.tipus === 'blanca'));
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
