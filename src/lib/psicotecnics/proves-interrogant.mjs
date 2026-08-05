// Proves de «quina cara correspon a l'interrogant?».
//
// El que ha de ser cert es comprova per dos camins que no es toquen:
//
//  1. PLEGANT DE DEBÒ. Es fabrica el desplegable amb les sis figures a
//     dins, es plega amb el motor, es busca la manera de girar-lo que
//     ensenya el que ensenya el cub dibuixat, i es mira quina figura queda
//     on hi ha l'interrogant. Aquest camí no fa servir res del que diu el
//     programa: només el motor de plegar i el dibuix.
//
//  2. RESOLENT-HO COM QUI FA L'EXAMEN. Amb el que es veu i prou —les tres
//     cares del cub i les tres caselles dibuixades— es proven les 24
//     maneres de girar el cub i s'apunta què podria anar a l'interrogant en
//     cadascuna que quadri. N'ha de sortir una i prou.
//
// I es comprova que no hi hagi drecera: que quedin dues cares visibles
// sense dibuixar. Si només en quedés una, seria aquella i no caldria plegar.
import * as I from './interrogant.mjs';
import { orientacions, plega, valid, vista, VISTA_CUB } from './plegat.mjs';

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

    // El desplegable amb les figures a dins, plegat des de zero.
    const celles = it.celles.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: noms(it.simbol[c.dibuix]) }));
    const cares = plega(celles);
    cal('el desplegable plega bé', valid(cares), `llavor ${seed}: ${it.forma}`);
    if (!valid(cares)) continue;

    // Quina manera de girar-lo ensenya el que ensenya el cub dibuixat.
    const hauria = it.laVista.map((k) => noms(it.simbol[k]));
    const quadren = orientacions([...cares.values()])
      .map((o) => vista(o, VISTA_CUB).map((x) => x.dibuix))
      .filter((v) => v.join('|') === hauria.join('|'));
    cal('hi ha una manera de girar-lo que dona el cub dibuixat',
      quadren.length >= 1, `llavor ${seed}`);
    // Amb sis figures diferents i tres cares mirades, no n'hi pot haver dues.
    cal('i només una', quadren.length === 1, `llavor ${seed}: ${quadren.length}`);

    // La casella de l'interrogant és una de les tres que es veuen, i la
    // figura que hi va és la que està marcada com a bona.
    const on = it.laVista.indexOf(it.forat);
    cal('l\'interrogant cau en una cara que es veu', on !== -1, `llavor ${seed}`);
    if (on === -1) continue;
    cal('la figura marcada és la que surt de plegar',
      noms(it.opcions[it.correcta]) === hauria[on],
      `llavor ${seed}: plegant surt ${hauria[on]}, marcada ${noms(it.opcions[it.correcta])}`);
    cal('i cap altra opció no hi coincideix',
      it.opcions.filter((o) => noms(o) === hauria[on]).length === 1, `llavor ${seed}`);
  }
}

titol('2. Resolent-ho amb el que es veu, i prou');
{
  for (let seed = 1; seed <= 300; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;

    // El plegat no depèn de les figures: la forma del desplegable ja diu,
    // per a cada manera de girar el cub, quines caselles queden a la vista.
    const claus = it.celles.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: `${c.nx},${c.ny}` }));
    const mirades = orientacions([...plega(claus).values()])
      .map((o) => vista(o, VISTA_CUB).map((x) => x.dibuix));

    const dibuixades = new Set(it.ancores.map((k) => noms(it.simbol[k])));
    const veig = it.laVista.map((k) => noms(it.simbol[k]));

    // Totes les maneres de girar que quadren amb el que es veu.
    const pot = new Set();
    let forada = false;
    for (const t of mirades) {
      let va = true;
      for (let i = 0; i < 3 && va; i++) {
        // On hi ha una casella dibuixada, hi ha d'anar la seva figura. On
        // n'hi ha una de sense dibuixar, no hi pot anar una figura que ja
        // està dibuixada en una altra casella: cada figura té un sol lloc.
        if (it.ancores.includes(t[i])) va = noms(it.simbol[t[i]]) === veig[i];
        else va = !dibuixades.has(veig[i]);
      }
      if (!va) continue;
      const on = t.indexOf(it.forat);
      if (on === -1) { forada = true; break; }
      pot.add(veig[on]);
    }
    cal('l\'interrogant no queda mai fora de la vista', !forada, `llavor ${seed}`);
    cal('només hi pot anar una figura', pot.size === 1, `llavor ${seed}: ${[...pot].join(' o ')}`);
    cal('i és la marcada', pot.has(noms(it.opcions[it.correcta])), `llavor ${seed}`);
  }
}

const N = 300;
titol(`3. ${N} ítems: forma de l'ítem i repartiment`);
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
  cal('tres caselles dibuixades', it.ancores.length === 3, `llavor ${seed}`);
  cal('l\'interrogant no és una d\'elles', !it.ancores.includes(it.forat), `llavor ${seed}`);

  // La drecera: si de les tres cares que es veuen només en quedés una sense
  // dibuixar, seria aquella i no caldria plegar res.
  cal('queden dues cares visibles sense dibuixar',
    it.laVista.filter((k) => !it.ancores.includes(k)).length >= 2, `llavor ${seed}`);
  // I cap opció no pot sortir ja dibuixada al desplegable: seria descartable
  // sense pensar, perquè dues cares no porten mai la mateixa figura.
  const dibuixades = new Set(it.ancores.map((k) => noms(it.simbol[k])));
  cal('cap opció no surt ja dibuixada al desplegable',
    it.opcions.every((o) => !dibuixades.has(noms(o))), `llavor ${seed}`);
  // Les sis cares, totes diferents.
  cal('les sis cares porten figures diferents',
    new Set(it.celles.map((c) => noms(it.simbol[c.dibuix]))).size === 6, `llavor ${seed}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('4. Varietat i dibuix');
{
  const vistes = new Set();
  const formes = new Set();
  for (let seed = 1; seed <= 400; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;
    formes.add(it.forma);
    vistes.add(it.forma + '|' + it.celles.map((c) => noms(it.simbol[c.dibuix])).join(',')
      + '|' + it.forat + '|' + [...it.ancores].sort().join(','));
  }
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  cal('surten totes les formes de desplegable', formes.size === 6, `${formes.size}`);
  console.log(`  ${vistes.size} ítems diferents de 400 llavors, amb ${formes.size} desplegables`);

  const it = I.generaItem(1);
  const e = I.svgEnunciat(it), o = I.svgOpcio(it, 0);
  cal('l\'enunciat és un SVG sencer', e.startsWith('<svg') && !/NaN|undefined/.test(e));
  cal('l\'opció també', o.startsWith('<svg') && !/NaN|undefined/.test(o));
  cal('porten viewBox', e.includes('viewBox') && o.includes('viewBox'));
  cal('el full surt sencer', !/NaN|undefined/.test(I.svgFull([1, 2, 3].map((s) => I.generaItem(s)))));

  // Al desplegable hi ha d'haver sis caselles, tres amb figura, un
  // interrogant i dues en blanc.
  for (let seed = 1; seed <= 80; seed++) {
    const item = I.generaItem(seed);
    const svg = I.svgEnunciat(item);
    // Les caselles del desplegable són els rectangles amb vora.
    const quadres = (svg.match(/<rect [^>]*stroke="#15151C"/g) || []).length;
    cal('sis caselles dibuixades', quadres === 6, `llavor ${seed}: ${quadres}`);
    cal('un sol interrogant', (svg.match(/>\?</g) || []).length === 1, `llavor ${seed}`);
    // Tres cares al cub muntat, amb el seu contorn.
    const contorns = (svg.match(/<polygon [^>]*stroke="#15151C"/g) || []).length;
    cal('tres cares al cub muntat', contorns === 3, `llavor ${seed}: ${contorns}`);
  }

  // Al full, l'enunciat no ha de trepitjar la primera resposta.
  const full = I.svgFull([1, 2].map((s) => I.generaItem(s)));
  const xs = [...full.matchAll(/<g transform="translate\((-?[\d.]+) (-?[\d.]+)\)">/g)]
    .map((m) => Number(m[1]));
  const respostes = xs.filter((x) => x !== 14);
  cal('l\'enunciat acaba abans que comenci la primera resposta',
    14 + I.MIDA_ENUNCIAT.w <= Math.min(...respostes),
    `l'enunciat arriba a ${14 + I.MIDA_ENUNCIAT.w} i la resposta comença a ${Math.min(...respostes)}`);
  const ample = Number(full.match(/width="(\d+)"/)[1]);
  cal('l\'última resposta cap al full', Math.max(...respostes) + 50 <= ample,
    `arriba a ${Math.max(...respostes) + 50} i el full fa ${ample}`);
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
