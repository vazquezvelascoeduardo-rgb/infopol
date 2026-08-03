// Proves de les famílies de paraules.
//
// Aquí les proves comproven MENYS que a la resta, i convé dir-ho clar:
// comproven que els ítems siguin coherents amb la taula, no que la taula
// sigui bona. Si hi hagués un sinònim discutible, això no ho veuria.
//
// El que sí que garanteixen —i no és poc— és que cap dels tres distractors
// no compleix la relació que demana l'enunciat, que no es repeteix cap
// paraula, i que la taula no s'ha contradit ella mateixa.
import * as V from './verbal.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 15) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

titol('1. La taula de paraules no es contradiu');
{
  const vistes = new Set();
  for (const e of V.PARAULES) {
    cal('cap paraula repetida a la taula', !vistes.has(e.p), e.p);
    vistes.add(e.p);
    cal('té sinònim', !!e.s, e.p);
    cal('el sinònim no és la paraula', e.s !== e.p, e.p);
    cal('l\'antònim no és la paraula', e.a !== e.p, e.p);
    cal('sinònim i antònim no coincideixen', !e.a || e.s !== e.a, e.p);
    cal('cap «proper» no és el sinònim', !e.propers.includes(e.s), `${e.p}: ${e.s}`);
    cal('cap «proper» no és l\'antònim', !e.a || !e.propers.includes(e.a), `${e.p}: ${e.a}`);
    cal('cap «proper» no és la paraula', !e.propers.includes(e.p), e.p);
    cal('els «propers» no es repeteixen', new Set(e.propers).size === e.propers.length, e.p);
    cal('almenys tres «propers» o antònim', e.propers.length + (e.a ? 1 : 0) >= 3, e.p);
    cal('tot en minúscula', [e.p, e.s, ...(e.a ? [e.a] : []), ...e.propers]
      .every((w) => w === w.toLowerCase()), e.p);
  }
  console.log(`  ${V.PARAULES.length} paraules, ${V.PARAULES.filter((e) => e.a).length} amb antònim`);
}

titol('2. Les relacions de les analogies són tancades');
{
  for (const [nom, rel] of Object.entries(V.RELACIONS)) {
    const esquerres = rel.parelles.map(([a]) => a);
    const dretes = rel.parelles.map(([, b]) => b);
    cal('cap element d\'esquerra repetit', new Set(esquerres).size === esquerres.length, nom);
    // Que la relació sigui una funció: a cada esquerra li toca una dreta.
    for (const [a, b] of rel.parelles) {
      cal('la parella es compleix', V.compleix(nom, a, b), `${nom}: ${a}→${b}`);
      const quantes = rel.parelles.filter(([x]) => x === a).length;
      cal('cada element té una sola parella', quantes === 1, `${nom}: ${a}`);
    }
    cal('almenys cinc parelles', rel.parelles.length >= 5, `${nom}: ${rel.parelles.length}`);
  }
  console.log(`  ${Object.keys(V.RELACIONS).length} relacions, `
    + `${Object.values(V.RELACIONS).reduce((s, r) => s + r.parelles.length, 0)} parelles`);
}

const N = 400;
titol(`3. ${N} ítems de paraules`);
{
  const lletres = [0, 0, 0, 0];
  const menes = {};
  for (let seed = 1; seed <= N; seed++) {
    const it = V.generaParaula(seed);
    if (!it) { cal('l\'ítem s\'ha generat', false, `llavor ${seed}`); continue; }
    lletres[it.correcta]++;
    menes[it.mena] = (menes[it.mena] || 0) + 1;
    for (const [nom, v] of Object.entries(it.control)) cal(`control ${nom}`, v, `llavor ${seed}`);

    // Refet des de la taula: la bona ha de ser el sinònim o l'antònim,
    // segons el que digui l'enunciat, i cap altra opció no ho pot ser.
    const e = V.PARAULES.find((x) => x.p === it.paraula);
    cal('la paraula és a la taula', !!e, `llavor ${seed}: ${it.paraula}`);
    if (!e) continue;
    const esperada = it.mena === V.SEMBLANT ? e.s : e.a;
    cal('la marcada és la que diu la taula', it.opcions[it.correcta] === esperada,
      `llavor ${seed}: diu ${it.opcions[it.correcta]}, la taula diu ${esperada}`);
    cal('cap altra opció no és la que demana',
      it.opcions.filter((o) => o === esperada).length === 1, `llavor ${seed}`);
    cal('l\'enunciat diu el que toca',
      it.enunciat.includes(it.mena) && it.enunciat.includes(it.paraula.toUpperCase()),
      `llavor ${seed}`);
  }
  console.log(`  lletra bona:  a ${lletres[0]}   b ${lletres[1]}   c ${lletres[2]}   d ${lletres[3]}`);
  console.log(`  menes: ${Object.entries(menes).map(([k, v]) => `${k} ${v}`).join('   ')}`);
  cal('surten les dues menes', Object.keys(menes).length === 2);
  cal('la lletra bona va repartida',
    lletres.every((l) => Math.abs(l - N / 4) < N / 7), lletres.join('/'));
}

titol(`4. ${N} analogies`);
{
  const lletres = [0, 0, 0, 0];
  const rels = {};
  for (let seed = 1; seed <= N; seed++) {
    const it = V.generaAnalogia(seed);
    lletres[it.correcta]++;
    rels[it.relacio] = (rels[it.relacio] || 0) + 1;
    for (const [nom, v] of Object.entries(it.control)) cal(`control ${nom}`, v, `llavor ${seed}`);

    // Refet: la bona ha de completar la relació amb c, i cap altra.
    const bones = it.opcions.filter((o) => V.compleix(it.relacio, it.c, o));
    cal('només una opció completa la relació', bones.length === 1,
      `llavor ${seed}: ${bones.join(', ')}`);
    cal('i és la marcada', bones[0] === it.opcions[it.correcta], `llavor ${seed}`);
    cal('la parella d\'exemple també es compleix', V.compleix(it.relacio, it.a, it.b),
      `llavor ${seed}: ${it.a}→${it.b}`);
    cal('les dues parelles són diferents', it.a !== it.c && it.b !== it.opcions[it.correcta],
      `llavor ${seed}`);
    cal('cap paraula de l\'enunciat no surt entre les opcions',
      !it.opcions.some((o) => [it.a, it.b, it.c].includes(o)), `llavor ${seed}`);
  }
  console.log(`  lletra bona:  a ${lletres[0]}   b ${lletres[1]}   c ${lletres[2]}   d ${lletres[3]}`);
  console.log(`  relacions: ${Object.keys(rels).length} de ${Object.keys(V.RELACIONS).length}`);
  cal('surten totes les relacions',
    Object.keys(rels).length === Object.keys(V.RELACIONS).length, JSON.stringify(rels));
  cal('la lletra bona va repartida',
    lletres.every((l) => Math.abs(l - N / 4) < N / 7), lletres.join('/'));
}

titol('5. El repartidor i el full de text');
{
  const menes = {};
  for (let s = 1; s <= 200; s++) menes[V.generaItem(s).mena] = (menes[V.generaItem(s).mena] || 0) + 1;
  cal('surten les dues famílies', Object.keys(menes).length >= 2, JSON.stringify(menes));
  const full = V.textFull([1, 2, 3, 4].map((s) => V.generaItem(s)));
  cal('el full no té forats', !/undefined|NaN|\$\{/.test(full));
  cal('hi ha quatre enunciats', (full.match(/^\d\./gm) || []).length === 4);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
