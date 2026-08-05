// Proves de «quina cara correspon a l'interrogant?».
//
// Aquí el dibuix no és decoració: el cub es veu sencer i les arestes van
// pintades, i d'això depèn que l'exercici es pugui resoldre. Per això les
// proves van pel dibuix i no per les dades.
//
//  1. PLEGANT DE DEBÒ. Es fabrica el desplegable amb les sis figures a
//     dins, es plega amb el motor i es mira quina figura cau a la cara de
//     l'interrogant. Aquest camí no fa servir res del que diu el programa.
//
//  2. RESOLENT-HO COM QUI FA L'EXAMEN. Amb el que es veu i prou, es proven
//     les 24 maneres de girar el cub i s'apunta què podria anar a
//     l'interrogant en cadascuna que quadri. N'ha de sortir una i prou.
//
//  3. LLEGINT EL SVG. Que al cub hi hagi les sis cares, que les tres del
//     fons hi siguin, i que cada aresta pintada surti amb el mateix color al
//     cub i al desplegable. Si això no es complís, les referències no
//     servirien de res i l'exercici no es podria resoldre.
import * as I from './interrogant.mjs';
import { clau, igual, plega, valid } from './plegat.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const noms = (s) => `${s.forma}/${s.color}`;

titol('1. Plegant el desplegable de debò');
{
  for (let seed = 1; seed <= 300; seed++) {
    const it = I.generaItem(seed);
    cal('surt ítem', it !== null, `llavor ${seed}`);
    if (!it) continue;

    // Plegat des de zero, amb les figures a dins.
    const celles = it.celles.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: noms(it.simbol[c.dibuix]) }));
    const cares = plega(celles);
    cal('el desplegable plega bé', valid(cares), `llavor ${seed}: ${it.forma}`);
    if (!valid(cares)) continue;

    // La cara on cau l'interrogant, i quina figura hi ha.
    const n = it.info[it.forat].n;
    const alla = [...cares.values()].find((f) => igual(f.n, n));
    cal('la cara de l\'interrogant existeix al cub plegat', !!alla, `llavor ${seed}`);
    if (!alla) continue;
    cal('la figura marcada és la que cau a la cara de l\'interrogant',
      alla.dibuix === noms(it.opcions[it.correcta]),
      `llavor ${seed}: plegant surt ${alla.dibuix}, marcada ${noms(it.opcions[it.correcta])}`);
    cal('i cap altra opció no hi coincideix',
      it.opcions.filter((o) => noms(o) === alla.dibuix).length === 1, `llavor ${seed}`);

    // Les sis cares del cub, totes diferents i totes al seu lloc.
    cal('les sis cares porten figures diferents',
      new Set([...cares.values()].map((f) => f.dibuix)).size === 6, `llavor ${seed}`);
    for (const c of it.celles) {
      const f = [...cares.values()].find((x) => igual(x.n, it.info[c.dibuix].n));
      cal('cada casella cau on diu el programa',
        f && f.dibuix === noms(it.simbol[c.dibuix]), `llavor ${seed} ${c.dibuix}`);
      // I amb el mateix marc: el gir de la cara no se l'inventa ningú.
      cal('i amb el mateix marc, o sigui amb el mateix gir',
        f && igual(f.u, it.info[c.dibuix].u) && igual(f.v, it.info[c.dibuix].v),
        `llavor ${seed} ${c.dibuix}`);
    }
  }
}

titol('2. Resolent-ho amb el que es veu, i prou');
{
  // Les 24 maneres de girar, refetes aquí per no fer servir les del programa.
  const V = (x, y, z) => ({ x, y, z });
  const GZ = (p) => V(-p.y, p.x, p.z);
  const GX = (p) => V(p.x, -p.z, p.y);
  const girs = [];
  {
    const vistes = new Map();
    const prova = [V(1, 0, 0), V(0, 1, 0), V(0, 0, 1)];
    const emp = (g) => prova.map((p) => clau(g(p))).join('|');
    const cua = [(p) => p];
    vistes.set(emp(cua[0]), cua[0]);
    while (cua.length) {
      const g = cua.shift();
      for (const h of [GZ, GX]) {
        const nou = (p) => h(g(p));
        if (!vistes.has(emp(nou))) { vistes.set(emp(nou), nou); cua.push(nou); }
      }
    }
    girs.push(...vistes.values());
  }
  cal('hi ha vint-i-quatre maneres de girar el cub', girs.length === 24, `${girs.length}`);

  const neg = (p) => V(-p.x, -p.y, -p.z);
  const parell = (a, b) => [clau(a), clau(b)].sort().join('~');
  const quatreCostats = (c) => [
    parell(c.n, neg(c.v)), parell(c.n, c.u), parell(c.n, c.v), parell(c.n, neg(c.u)),
  ];

  for (let seed = 1; seed <= 300; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;
    const claus = it.celles.map((c) => c.dibuix);
    const pot = new Set();
    for (const g of girs) {
      const posa = {};
      for (const k of claus) {
        posa[k] = { n: g(it.info[k].n), u: g(it.info[k].u), v: g(it.info[k].v) };
      }
      // Les caselles dibuixades han de quedar on eren.
      let va = claus.filter((k) => it.ancores.includes(k))
        .every((k) => igual(posa[k].n, it.info[k].n));
      // I les arestes pintades, al mateix lloc.
      for (const k of claus) {
        const abans = quatreCostats(it.info[k]), ara = quatreCostats(posa[k]);
        for (let i = 0; i < 4 && va; i++) {
          if ((it.marques[abans[i]] || null) !== (it.marques[ara[i]] || null)) va = false;
        }
        if (!va) break;
      }
      if (!va) continue;
      const quina = claus.find((k) => igual(posa[k].n, it.info[it.forat].n));
      pot.add(noms(it.simbol[quina]));
    }
    cal('només hi pot anar una figura', pot.size === 1,
      `llavor ${seed}: ${[...pot].join(' o ')}`);
    cal('i és la marcada', pot.has(noms(it.opcions[it.correcta])), `llavor ${seed}`);
  }
}

titol('3. El dibuix ensenya el que ha d\'ensenyar');
{
  for (let seed = 1; seed <= 120; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;
    const svg = I.svgEnunciat(it);
    cal('el dibuix està sencer', !/NaN|undefined/.test(svg), `llavor ${seed}`);

    // Les sis figures del cub hi han de ser: tres nítides i tres al fons.
    // Les del fons van d'un gris que no fa servir res més.
    const fluixes = (svg.match(/stroke-opacity="0\.55"/g) || []).length;
    cal('les tres cares del fons es veuen', fluixes === 3, `llavor ${seed}: ${fluixes}`);
    const totes = (svg.match(/<path d="M [^"]*" fill="none"/g) || []).length;
    cal('hi ha les sis cares del cub, més les del desplegable',
      totes >= 6, `llavor ${seed}: ${totes}`);

    // Les arestes pintades. Cada color ha de sortir al cub I al desplegable:
    // si només sortís en un lloc, la referència no serviria de res.
    for (const color of new Set(Object.values(it.marques))) {
      const quantes = (svg.match(new RegExp(`stroke="${color}"`, 'g')) || []).length;
      cal('cada aresta pintada surt al cub i al desplegable', quantes >= 2,
        `llavor ${seed}, ${color}: només ${quantes} vegades`);
    }
    cal('hi ha dues arestes pintades com a mínim',
      new Set(Object.values(it.marques)).size >= 2, `llavor ${seed}`);
    cal('un sol interrogant', (svg.match(/>\?</g) || []).length === 1, `llavor ${seed}`);
    // Sis caselles al desplegable.
    const quadres = (svg.match(/<rect [^>]*fill="#fff"\/>/g) || []).length;
    cal('sis caselles al desplegable', quadres === 6, `llavor ${seed}: ${quadres}`);
  }
}

const N = 300;
titol(`4. ${N} ítems: forma de l'ítem i repartiment`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = I.generaItem(seed);
  cal('surt ítem', it !== null, `llavor ${seed}`);
  if (!it) continue;
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }
  cal('quatre opcions', it.opcions.length === 4, `llavor ${seed}`);
  cal('cap opció repetida', new Set(it.opcions.map(noms)).size === 4, `llavor ${seed}`);
  cal('sis caselles', it.celles.length === 6, `llavor ${seed}`);
  cal('l\'interrogant no està dibuixat', !it.ancores.includes(it.forat), `llavor ${seed}`);
  // Totes les opcions són cares del cub: cap no es pot descartar sense pensar.
  const alCub = new Set(it.celles.map((c) => noms(it.simbol[c.dibuix])));
  cal('totes les opcions són cares del cub',
    it.opcions.every((o) => alCub.has(noms(o))), `llavor ${seed}`);
  // I cap no surt ja dibuixada al desplegable: seria descartable de seguida.
  const dibuixades = new Set(it.ancores.map((k) => noms(it.simbol[k])));
  cal('cap opció no surt ja dibuixada al desplegable',
    it.opcions.every((o) => !dibuixades.has(noms(o))), `llavor ${seed}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('5. Varietat');
{
  const vistes = new Set(), formes = new Set();
  for (let seed = 1; seed <= 400; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;
    formes.add(it.forma);
    vistes.add(`${it.forma}|${it.celles.map((c) => noms(it.simbol[c.dibuix])).join(',')}`
      + `|${it.forat}|${[...it.ancores].sort().join(',')}`
      + `|${Object.keys(it.marques).sort().join(',')}`);
  }
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  cal('surten totes les formes de desplegable', formes.size === 6, `${formes.size}`);
  console.log(`  ${vistes.size} ítems diferents de 400 llavors, amb ${formes.size} desplegables`);

  const full = I.svgFull([1, 2].map((s) => I.generaItem(s)));
  cal('el full surt sencer', !/NaN|undefined/.test(full));
  const xs = [...full.matchAll(/<g transform="translate\((-?[\d.]+) (-?[\d.]+)\)">/g)]
    .map((m) => Number(m[1]));
  const respostes = xs.filter((x) => x !== 14);
  cal('l\'enunciat acaba abans que comenci la primera resposta',
    14 + I.MIDA_ENUNCIAT.w <= Math.min(...respostes),
    `l'enunciat arriba a ${14 + I.MIDA_ENUNCIAT.w} i la resposta comença a ${Math.min(...respostes)}`);
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
