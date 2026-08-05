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
import { orientacions, plega, valid, vistaDe } from './plegat.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

const noms = (s) => `${s.forma}/${s.color}`;
const ambGir = (s, gir = s.gir) => `${s.forma}/${s.color}@${gir}`;

titol('1. Plegant el desplegable de debò, amb el gir de cada cara');
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

    // Quina manera de girar-lo ensenya el que ensenya el cub dibuixat. Es
    // compara la figura I els quarts de volta: és el que fa que l'exercici
    // sigui aquest i no un altre.
    const hauria = it.laVista.map((v) => `${noms(it.simbol[v.casella])}@${v.gir}`);
    const quadren = orientacions([...cares.values()])
      .map((o) => vistaDe(o))
      .filter((v) => v.join('|') === hauria.join('|'));
    cal('hi ha una manera de girar-lo que dona el cub dibuixat',
      quadren.length >= 1, `llavor ${seed}: ${hauria.join(' ')}`);
    // Amb sis figures diferents i tres cares mirades, no n'hi pot haver dues.
    cal('i només una', quadren.length === 1, `llavor ${seed}: ${quadren.length}`);

    // La casella de l'interrogant és una de les tres que es veuen, i la
    // figura que hi va —amb el seu gir— és la que està marcada com a bona.
    const on = it.laVista.findIndex((v) => v.casella === it.forat);
    cal('l\'interrogant cau en una cara que es veu', on !== -1, `llavor ${seed}`);
    if (on === -1) continue;
    cal('la figura marcada, amb el seu gir, és la que surt de plegar',
      ambGir(it.opcions[it.correcta]) === hauria[on],
      `llavor ${seed}: plegant surt ${hauria[on]}, marcada ${ambGir(it.opcions[it.correcta])}`);
    cal('i cap altra opció no hi coincideix',
      it.opcions.filter((o) => ambGir(o) === hauria[on]).length === 1, `llavor ${seed}`);
  }
}

titol('1b. Cap figura no és simètrica: girar-la s\'ha de veure');
{
  const norm = (p) => [...p].map((q) => q.map((v) => v.toFixed(4)).join(',')).sort().join('|');
  for (const forma of Object.keys(I.FIGURES)) {
    const vistes = new Set();
    for (let q = 0; q < 4; q++) {
      vistes.add(norm(I.vertexs(forma, q)));
      // I també del revés, per si mai una cara sortís capgirada.
      vistes.add(norm(I.vertexs(forma, q).map(([x, y]) => [1 - x, y])));
    }
    cal(`${forma}: les vuit maneres de posar-la es veuen diferents`,
      vistes.size === 8, `${forma}: només ${vistes.size}`);
    // I que quatre girs tornin al principi.
    cal(`${forma}: quatre girs tornen al principi`,
      norm(I.vertexs(forma, 4)) === norm(I.vertexs(forma, 0)), forma);
  }
}

titol('2. Resolent-ho amb el que es veu, i prou');
{
  for (let seed = 1; seed <= 300; seed++) {
    const it = I.generaItem(seed);
    if (!it) continue;

    // El plegat no depèn de les figures: la forma del desplegable ja diu,
    // per a cada manera de girar el cub, quines caselles queden a la vista i
    // amb quants quarts de volta.
    const claus = it.celles.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: `${c.nx},${c.ny}` }));
    const mirades = orientacions([...plega(claus).values()])
      .map((o) => vistaDe(o).map((t) => {
        const tall = t.lastIndexOf('@');
        return { casella: t.slice(0, tall), gir: Number(t.slice(tall + 1)) };
      }));

    const dibuixades = new Set(it.ancores.map((k) => noms(it.simbol[k])));
    const veig = it.laVista.map((v) => ({ fig: noms(it.simbol[v.casella]), gir: v.gir }));

    // Totes les maneres de girar que quadren amb el que es veu.
    const pot = new Set();
    let forada = false;
    for (const t of mirades) {
      let va = true;
      for (let i = 0; i < 3 && va; i++) {
        // On hi ha una casella dibuixada, hi ha d'anar la seva figura i amb
        // el gir que es veu al cub. On n'hi ha una de sense dibuixar, no hi
        // pot anar una figura que ja està dibuixada en una altra casella:
        // cada figura té un sol lloc.
        if (it.ancores.includes(t[i].casella)) {
          va = noms(it.simbol[t[i].casella]) === veig[i].fig && t[i].gir === veig[i].gir;
        } else {
          va = !dibuixades.has(veig[i].fig);
        }
      }
      if (!va) continue;
      const on = t.findIndex((v) => v.casella === it.forat);
      if (on === -1) { forada = true; break; }
      pot.add(`${veig[on].fig}@${veig[on].gir}`);
    }
    cal('l\'interrogant no queda mai fora de la vista', !forada, `llavor ${seed}`);
    cal('només hi pot anar una figura, amb un sol gir', pot.size === 1,
      `llavor ${seed}: ${[...pot].join(' o ')}`);
    cal('i és la marcada', pot.has(ambGir(it.opcions[it.correcta])), `llavor ${seed}`);
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
  cal('cap opció repetida', new Set(it.opcions.map((o) => ambGir(o))).size === 4, `llavor ${seed}`);
  cal('sis caselles', it.celles.length === 6, `llavor ${seed}`);
  cal('tres caselles dibuixades', it.ancores.length === 3, `llavor ${seed}`);
  cal('l\'interrogant no és una d\'elles', !it.ancores.includes(it.forat), `llavor ${seed}`);

  // La drecera: si de les tres cares que es veuen només en quedés una sense
  // dibuixar, seria aquella i no caldria plegar res.
  cal('queden dues cares visibles sense dibuixar',
    it.laVista.filter((v) => !it.ancores.includes(v.casella)).length >= 2, `llavor ${seed}`);
  // I cap opció no pot sortir ja dibuixada al desplegable: seria descartable
  // sense pensar, perquè dues cares no porten mai la mateixa figura.
  const dibuixades = new Set(it.ancores.map((k) => noms(it.simbol[k])));
  cal('cap opció no surt ja dibuixada al desplegable',
    it.opcions.every((o) => noms(o) === noms(it.opcions[it.correcta]) || !dibuixades.has(noms(o))), `llavor ${seed}`);
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
