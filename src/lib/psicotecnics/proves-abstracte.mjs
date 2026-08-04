// Proves de la matriu abstracta.
//
// L'Eduardo comprova que es vegi bé; el resultat no el pot comprovar. O
// sigui que d'aquesta banda ha de sortir tot, i per això aquí la regla es
// torna a aplicar des de zero sobre les caselles ja fetes, sense mirar com
// s'han construït. I sobretot: es comprova que NOMÉS l'o-exclusiu explica
// la matriu. Si la unió també la expliqués, l'ítem tindria dues respostes.
import * as A from './abstracte.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

// L'o-exclusiu, escrit a part del que fa el generador.
const xor = (a, b) => [...a.filter((e) => !b.includes(e)), ...b.filter((e) => !a.includes(e))];
const k = A.clau;

titol('1. L\'o-exclusiu es comporta com ha de fer-ho');
{
  const c = ['cercle'], q = ['quadrat'], cq = ['cercle', 'quadrat'];
  cal('el que es repeteix marxa', k(xor(cq, c)) === k(q));
  cal('el que no es repeteix es queda', k(xor(c, q)) === k(cq));
  cal('una cosa amb ella mateixa dona buit', k(xor(cq, cq)) === '(buit)');
  cal('l\'ordre no compta', k(xor(c, q)) === k(xor(q, c)));
  // L'exemple del material: (rodona+vertical) i (rodona+horitzontal) → creu.
  cal('l\'exemple de l\'acadèmia surt',
    k(xor(['cercle', 'vertical'], ['cercle', 'horitzontal'])) === k(['vertical', 'horitzontal']));
  cal('i el segon: (rombe+creu) i (creu) → rombe',
    k(xor(['rombe', 'vertical', 'horitzontal'], ['vertical', 'horitzontal'])) === k(['rombe']));
}

const N = 250;
titol(`2. ${N} matrius, amb la regla aplicada de nou`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = A.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }

  cal('quatre opcions, com totes les famílies', it.opcions.length === 4, `llavor ${seed}`);
  cal('tres files de tres', it.files.length === 3 && it.files.every((f) => f.length === 3),
    `llavor ${seed}`);

  // Les tres files, comprovades des de zero.
  it.files.forEach((f, i) => {
    cal('la fila compleix la regla', k(xor(f[0], f[1])) === k(f[2]), `llavor ${seed}, fila ${i + 1}`);
    cal('cap casella buida', f.every((c) => c.length > 0), `llavor ${seed}, fila ${i + 1}`);
    cal('cap casella carregada', f.every((c) => c.length <= 3), `llavor ${seed}, fila ${i + 1}`);
    cal('cap element repetit dins d\'una casella',
      f.every((c) => new Set(c).size === c.length), `llavor ${seed}`);
    cal('tots els elements són del catàleg',
      f.flat().every((e) => A.ELEMENTS.includes(e)), `llavor ${seed}`);
  });

  // La resposta: ha de ser l'o-exclusiu de l'última fila, i cap altra.
  const [a, b] = it.files[2];
  const meva = xor(a, b);
  cal('la marcada és la que surt d\'aplicar la regla',
    k(it.opcions[it.correcta]) === k(meva),
    `llavor ${seed}: diu ${k(it.opcions[it.correcta])}, en surt ${k(meva)}`);
  cal('i cap altra opció no hi coincideix',
    it.opcions.filter((o) => k(o) === k(meva)).length === 1, `llavor ${seed}`);

  // Que no hi hagi dues explicacions bones.
  const expliquen = A.reglesQueExpliquen(it.files);
  cal('només una regla explica la matriu', expliquen.length === 1,
    `llavor ${seed}: ${expliquen.join(', ')}`);
  cal('i és l\'o-exclusiu', expliquen[0] === 'xor', `llavor ${seed}: ${expliquen[0]}`);

  // Almenys dues files han de compartir elements: si no en compartissin
  // cap, la unió també explicaria la matriu.
  cal('almenys dues files comparteixen elements', it.control.filesQueComparteixen >= 2,
    `llavor ${seed}: ${it.control.filesQueComparteixen}`);
}
console.log(`  lletra bona:  a ${lletres[0]}   b ${lletres[1]}   c ${lletres[2]}   d ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('3. El dibuix surt sencer');
{
  const svg = A.svgFull([1, 2, 3, 4, 5].map((s) => A.generaItem(s)));
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha els cinc enunciats', (svg.match(/completa millor la matriu/g) || []).length === 5);
  cal('hi ha la incògnita a cada matriu', (svg.match(/>\?</g) || []).length === 5);
  // Nou caselles de matriu + quatre opcions, per ítem.
  const marcs = (svg.match(/<rect [^>]*stroke-width="1.3"/g) || []).length;
  cal('hi ha 13 caselles per ítem', marcs === 5 * 13, `${marcs}`);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
