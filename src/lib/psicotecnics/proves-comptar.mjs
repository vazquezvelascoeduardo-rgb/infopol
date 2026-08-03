// Proves d'atenció: comptar símbols i correspondències.
//
// Aquí la comprovació és senzilla però ha de ser de debò: els ítems es
// fabriquen decidint primer quants n'hi ha d'haver, i les proves ho compten
// a part, a la graella ja feta. Si la fabricació i el recompte no diuen el
// mateix, l'ítem no surt.
import * as C from './comptar.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const N = 300;

for (const mena of [C.IGUALS, C.DIFERENTS]) {
  titol(`1. Comptar símbols "${mena}" — ${N} ítems`);
  const lletres = [0, 0, 0, 0];
  for (let seed = 1; seed <= N; seed++) {
    const it = C.generaComptatge(seed, mena);
    lletres[it.correcta]++;
    for (const [k, v] of Object.entries(it.control)) cal(`control ${k}`, v, `llavor ${seed}`);

    // El recompte, fet aquí i sense mirar res del generador.
    const totes = it.graella.flat();
    const iguals = totes.filter((s) => s === it.objectiu).length;
    const meva = mena === C.IGUALS ? iguals : totes.length - iguals;
    cal('la resposta marcada és la que surt de comptar',
      it.opcions[it.correcta] === meva,
      `llavor ${seed}: diu ${it.opcions[it.correcta]}, en surten ${meva}`);
    cal('cap altra opció no hi coincideix',
      it.opcions.filter((o) => o === meva).length === 1, `llavor ${seed}`);
    cal('tots els símbols són dels quatre', totes.every((s) => C.SIMBOLS.includes(s)), `llavor ${seed}`);
    cal('les files són plenes', it.graella.every((f) => f.length === 20), `llavor ${seed}`);
    // Que no sigui regalat: ni gairebé tots ni gairebé cap.
    cal('la proporció no és extrema', iguals > totes.length * 0.2 && iguals < totes.length * 0.7,
      `llavor ${seed}: ${iguals} de ${totes.length}`);
  }
  console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
  cal('la lletra bona va repartida',
    lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));
}

for (const mena of [C.CORRECTES, C.INCORRECTES]) {
  titol(`2. Correspondències "${mena}" — ${N} ítems`);
  const lletres = [0, 0, 0, 0];
  for (let seed = 1; seed <= N; seed++) {
    const it = C.generaCorrespondencies(seed, mena);
    lletres[it.correcta]++;
    for (const [k, v] of Object.entries(it.control)) cal(`control ${k}`, v, `llavor ${seed}`);

    // Es torna a comprovar llegint les dues taules, com faria l'opositor.
    const diu = Object.fromEntries(it.taula.map((t) => [t.simbol, t.num]));
    const encerts = it.prova.filter((p) => diu[p.simbol] === p.num).length;
    const meva = mena === C.CORRECTES ? encerts : it.prova.length - encerts;
    cal('la resposta marcada és la que surt de comprovar',
      it.opcions[it.correcta] === meva,
      `llavor ${seed}: diu ${it.opcions[it.correcta]}, en surten ${meva}`);
    cal('cap altra opció no hi coincideix',
      it.opcions.filter((o) => o === meva).length === 1, `llavor ${seed}`);
    cal('la taula de referència no repeteix símbols',
      new Set(it.taula.map((t) => t.simbol)).size === it.taula.length, `llavor ${seed}`);
    cal('ni números', new Set(it.taula.map((t) => t.num)).size === it.taula.length, `llavor ${seed}`);
    // Ni totes bé ni totes malament: si no, es veuria a ull.
    cal('n\'hi ha de bones i de dolentes', encerts > 0 && encerts < it.prova.length,
      `llavor ${seed}: ${encerts} de ${it.prova.length}`);
  }
  console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
  cal('la lletra bona va repartida',
    lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));
}

titol('3. El dibuix surt sencer');
{
  const barrejats = [
    C.generaComptatge(1, C.IGUALS), C.generaCorrespondencies(1, C.CORRECTES),
    C.generaComptatge(2, C.DIFERENTS), C.generaCorrespondencies(2, C.INCORRECTES),
  ];
  const svg = C.svgFull(barrejats);
  cal('cap número espatllat', !/NaN|Infinity|undefined/.test(svg));
  cal('hi ha les dues menes de pregunta',
    /iguals a aquest/.test(svg) && /CORRECTES/.test(svg) && /diferents a aquest/.test(svg)
    && /INCORRECTES/.test(svg));
  const caixes = (svg.match(/<rect/g) || []).length;
  cal('hi ha caselles dibuixades', caixes > 100, `${caixes} caselles`);
}

console.log(`\n${fets - fallats}/${fets} proves passades` + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
