// Proves de les famílies del mirall pla i del gir.
//
// La comprovació que compta és que, a cada ítem, només una opció sigui del
// que demana l'enunciat. La resta de proves són per assegurar que les
// transformacions són les que dic que són: si el grup de les vuit maneres
// no es comportés com toca, tota la resta seria fum.
import * as F from './figures.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const N = 150;

titol('1. Les vuit maneres es comporten com han de fer-ho');
{
  // Una figura qualsevol per provar l'àlgebra.
  const f = F.generaItem(7, F.MIRALL).mostra;
  const a = F.aspecte;
  cal('quatre girs tornen a l\'origen', a(F.transforma(f, 0, false)) === a(f));
  for (let q = 0; q < 4; q++) {
    cal('voltejar dues vegades no fa res',
      a(F.transforma(F.transforma(f, 0, true), 0, true)) === a(f));
    // volteig i després gir q  ==  gir (4−q) i després volteig
    cal(`volteig·gir${q} = gir${(4 - q) % 4}·volteig`,
      a(F.transforma(f, q, true))
      === a(F.transforma(F.transforma(f, (4 - q) % 4, false), 0, true)), `q=${q}`);
  }
  // Un reflex per l'eix horitzontal és el vertical més mitja volta.
  cal('reflectir per l\'altre eix és el mateix més mitja volta',
    a(F.transforma(f, 2, true)) === a(F.transforma(F.transforma(f, 0, true), 2, false)));
  cal('les vuit maneres són vuit', F.maneres(f) === 8);
}

for (const mena of [F.MIRALL, F.GIR]) {
  titol(`2. ${N} ítems de "${mena === F.MIRALL ? 'reflectida' : 'girada sense reflectir'}"`);
  const lletres = [0, 0, 0, 0];
  for (let seed = 1; seed <= N; seed++) {
    const it = F.generaItem(seed, mena);
    lletres[it.correcta]++;
    const c = it.control;

    cal('la mostra no té simetries', c.senseSimetries, `llavor ${seed}`);
    cal('les quatre opcions es veuen diferents', c.opcionsDiferents, `llavor ${seed}`);
    cal('cap opció no és la mostra tal qual', c.capIgualALaMostra, `llavor ${seed}`);
    cal('només una opció respon', c.quantesResponen === 1,
      `llavor ${seed}: en responen ${c.quantesResponen}`);

    // La marca sempre dins de la figura.
    for (const f of [it.mostra, ...it.opcions]) {
      cal('la marca cau dins de la figura',
        f.plenes.some((p) => p[0] === f.marca[0] && p[1] === f.marca[1]), `llavor ${seed}`);
      cal('la figura no perd caselles', f.plenes.length === it.mostra.plenes.length, `llavor ${seed}`);
    }

    // La comprovació de debò, feta a part del generador: es reconstrueixen
    // les vuit maneres des de la mostra i es mira cada opció una per una.
    const girs = [0, 1, 2, 3].map((q) => F.aspecte(F.transforma(it.mostra, q, false)));
    const reflexos = [0, 1, 2, 3].map((q) => F.aspecte(F.transforma(it.mostra, q, true)));
    it.opcions.forEach((o, i) => {
      const a = F.aspecte(o);
      cal('cada opció surt de la mostra', girs.includes(a) || reflexos.includes(a), `llavor ${seed}`);
      const esReflex = reflexos.includes(a);
      const hauria = (i === it.correcta) === (mena === F.MIRALL ? esReflex : !esReflex);
      cal(mena === F.MIRALL
        ? 'la bona és reflex i les altres no'
        : 'la bona és gir i les altres no', hauria, `llavor ${seed}, opció ${'ABCD'[i]}`);
    });

    if (mena === F.MIRALL) {
      cal('la bona és el reflex per l\'eix vertical, sense girar',
        F.aspecte(it.opcions[it.correcta]) === F.aspecte(F.transforma(it.mostra, 0, true)),
        `llavor ${seed}`);
    }
  }
  console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
  cal('la lletra bona va repartida',
    lletres.every((l) => Math.abs(l - N / 4) < N / 12), lletres.join('/'));

  const svg = F.svgFull([1, 2, 3].map((s) => F.generaItem(s, mena)));
  cal('el dibuix surt sencer', !/NaN|Infinity|undefined/.test(svg));
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
