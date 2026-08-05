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

// ── La fletxa gira cap on gira el cub ────────────────────────────
// Aquesta part hi és perquè em va faltar. La fletxa antiga tenia la punta
// clavada al mateix lloc apuntant sempre igual, i el sentit no s'entenia.
// Ara es comprova amb números, i no una cosa sinó dues, amb el mateix
// criteri: MIRANT LA PANTALLA, l'angle que creix gira cap a la dreta.
//
//  a) On va a parar una casella quan es fa el moviment. Es pinta una casella
//     de la cara que gira, es dibuixa el cub abans i després, es busca on ha
//     anat i es mira cap a quin costat ha rodat al voltant del centre de la
//     cara. Això lliga els cicles amb el dibuix.
//  b) Cap on dona la volta la fletxa. Del camí que es dibuixa se'n treu
//     l'àrea amb signe, que diu el sentit del recorregut.
//
// Si totes dues donen el mateix signe, la fletxa diu la veritat. Si els
// cicles estiguessin definits al revés, o la fletxa girés al revés, els
// signes no coincidirien i això petaria.
const centroide = (punts) => ({
  x: punts.reduce((s, p) => s + p[0], 0) / punts.length,
  y: punts.reduce((s, p) => s + p[1], 0) / punts.length,
});

/** Els polígons d'un color, amb el seu centre. */
function trobaColor(svg, pinta) {
  const fora = [];
  for (const m of svg.matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)) {
    if (m[2].toUpperCase() !== pinta.toUpperCase()) continue;
    fora.push(centroide(m[1].trim().split(/\s+/).map((p) => p.split(',').map(Number))));
  }
  return fora;
}

/**
 * Cap on gira un recorregut i quant, en radiants amb signe. Es va sumant el
 * gir de cada tram respecte de l'anterior. A la pantalla, on la y creix cap
 * avall, positiu vol dir que gira cap a la dreta.
 *
 * No es fa amb l'àrea. El camí de la fletxa és obert —són tres quarts de
 * volta— i l'àrea d'un camí obert depèn d'on caigui la corda que el tanca,
 * no del sentit; ho vaig provar i donava signes que no volien dir res. El
 * gir acumulat, en canvi, no depèn de res més que de la forma de la corba, i
 * a sobre diu quants graus fa, que també s'ha de comprovar.
 */
function girAcumulat(punts) {
  let total = 0, signes = new Set();
  for (let i = 1; i < punts.length - 1; i++) {
    const u = { x: punts[i].x - punts[i - 1].x, y: punts[i].y - punts[i - 1].y };
    const v = { x: punts[i + 1].x - punts[i].x, y: punts[i + 1].y - punts[i].y };
    const creu = u.x * v.y - u.y * v.x;
    const dins = u.x * v.x + u.y * v.y;
    total += Math.atan2(creu, dins);
    if (Math.abs(creu) > 1e-9) signes.add(Math.sign(creu));
  }
  return { total, sempreIgual: signes.size === 1 };
}

titol('5. La fletxa gira cap on gira el cub');
{
  const CARES_VISIBLES = ['U', 'F', 'R'];
  for (const cara of CARES_VISIBLES) {
    for (const idx of [0, 1, 2, 3, 5, 6, 7, 8]) {   // totes menys la central
      const abans = R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {});
      abans[cara] = [...abans[cara]];
      abans[cara][idx] = 'magenta';
      abans[cara][4] = 'groc';                       // el centre, per fer d'eix
      const despres = R.mou(abans, cara, true);      // un gir horari

      const eixA = trobaColor(R.svgCub(abans), R.COLORS.groc);
      const marcaA = trobaColor(R.svgCub(abans), R.COLORS.magenta);
      const marcaB = trobaColor(R.svgCub(despres), R.COLORS.magenta);
      cal('el centre de la cara es troba al dibuix', eixA.length === 1, `${cara}`);
      cal('la casella pintada es troba abans', marcaA.length === 1, `${cara} ${idx}`);
      cal('i després', marcaB.length === 1, `${cara} ${idx}`);
      if (eixA.length !== 1 || marcaA.length !== 1 || marcaB.length !== 1) continue;

      const ang = (p) => Math.atan2(p.y - eixA[0].y, p.x - eixA[0].x);
      const salt = (d) => {
        let x = d;
        while (x <= 0) x += 2 * Math.PI;
        while (x > 2 * Math.PI) x -= 2 * Math.PI;
        return x;
      };
      const delta = salt(ang(marcaB[0]) - ang(marcaA[0]));
      // El que es comprova és el SENTIT, no el nombre de graus. En
      // perspectiva els angles no es conserven: la cara es veu de gairell i
      // un quart de volta de debò surt a la pantalla com seixanta graus des
      // d'una aresta i com cent vint des de la següent. Les cantonades sí que
      // donen noranta, per simetria. O sigui que exigir noranta seria exigir
      // una cosa falsa; el que ha de ser cert sempre és que roda cap a la
      // dreta, i que quatre girs facin la volta sencera.
      cal('la casella roda cap a la dreta', delta > 0.2 && delta < Math.PI - 0.2,
        `${cara}${idx}: ha girat ${(delta * 180 / Math.PI).toFixed(0)}°`);

      // Quatre girs, quatre salts, una volta justa.
      let c = abans, suma = 0, anterior = marcaA[0];
      for (let k = 0; k < 4; k++) {
        c = R.mou(c, cara, true);
        const ara = trobaColor(R.svgCub(c), R.COLORS.magenta)[0];
        suma += salt(ang(ara) - ang(anterior));
        anterior = ara;
      }
      cal('quatre girs fan una volta sencera', Math.abs(suma - 2 * Math.PI) < 1e-6,
        `${cara}${idx}: ${(suma * 180 / Math.PI).toFixed(2)}°`);

      // I al revés, cap a l'esquerra.
      const enrere = trobaColor(R.svgCub(R.mou(abans, cara, false)), R.COLORS.magenta)[0];
      const enDarrere = salt(ang(enrere) - ang(marcaA[0]));
      cal('girant al revés, roda cap a l\'esquerra',
        enDarrere > Math.PI + 0.2 && enDarrere < 2 * Math.PI - 0.2,
        `${cara}${idx}: ${(enDarrere * 180 / Math.PI).toFixed(0)}°`);
    }
  }

  // I ara la fletxa. Es dibuixa un ítem amb el moviment que es vol i se'n
  // llegeix el camí.
  for (const cara of CARES_VISIBLES) {
    for (const horari of [true, false]) {
      const fals = { inici: R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {}),
        moviments: [{ cara, horari }, { cara, horari }] };
      const svg = R.svgEnunciat(fals);
      const camins = [...svg.matchAll(/<polyline points="([^"]+)"/g)]
        .map((m) => m[1].trim().split(/\s+/).map((p) => {
          const [x, y] = p.split(',').map(Number); return { x, y };
        }));
      cal('hi ha una fletxa per moviment', camins.length === 2, `${cara}: ${camins.length}`);
      if (camins.length !== 2) continue;
      const g = girAcumulat(camins[0]);
      const graus = (g.total * 180) / Math.PI;
      cal('la fletxa gira cap on toca',
        horari ? g.total > 0 : g.total < 0,
        `${cara} ${horari ? 'horari' : 'antihorari'}: ${graus.toFixed(0)}°`);
      // El gir ha de ser gros i d'una tirada. No es pot demanar que siguin
      // just els 270° que fa l'arc al pla de la cara: la cara es veu de
      // gairell, el cercle surt fet una el·lipse i un tros de 270° del
      // cercle no en fa 270 de l'el·lipse —surten entre 240 i 270 segons on
      // comenci—. El que sí que ha de ser cert sempre és que doni clarament
      // la volta, i cap a un sol costat.
      cal('i fa una volta llarga', Math.abs(graus) > 200 && Math.abs(graus) < 355,
        `${cara}: ${Math.abs(graus).toFixed(0)}°`);
      cal('sense canviar de sentit enmig', g.sempreIgual, `${cara}`);
      // I que es vegi: una fletxa curta no diu res.
      let llarg = 0;
      for (let k = 1; k < camins[0].length; k++) {
        llarg += Math.hypot(camins[0][k].x - camins[0][k - 1].x,
          camins[0][k].y - camins[0][k - 1].y);
      }
      cal('la fletxa és prou llarga per veure-la', llarg > 45,
        `${cara}: ${llarg.toFixed(0)} de llarg`);
    }
  }
}

titol('5b. La punta de la fletxa va on acaba el camí i apunta on va');
{
  for (const cara of ['U', 'F', 'R']) {
    for (const horari of [true, false]) {
      const fals = { inici: R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {}),
        moviments: [{ cara, horari }, { cara, horari }] };
      const svg = R.svgEnunciat(fals);
      const cami = svg.match(/<polyline points="([^"]+)"/)[1].trim().split(/\s+/)
        .map((p) => { const [x, y] = p.split(',').map(Number); return { x, y }; });
      // La punta és el primer polígon de tres vèrtexs negre.
      const p = [...svg.matchAll(/<polygon points="([^"]+)" fill="#15151C"/g)]
        .map((m) => m[1].trim().split(/\s+/).map((q) => q.split(',').map(Number)))
        .filter((q) => q.length === 3)[0];
      cal('hi ha punta', !!p, `${cara}`);
      if (!p) continue;
      const fi = cami[cami.length - 1];
      const morro = { x: p[0][0], y: p[0][1] };
      cal('el morro de la punta és on acaba el camí',
        Math.hypot(morro.x - fi.x, morro.y - fi.y) < 0.5, `${cara}`);
      // Apunta cap on anava el camí: el morro va per davant del centre de la
      // punta, en la direcció de la marxa.
      const centre = { x: (p[0][0] + p[1][0] + p[2][0]) / 3, y: (p[0][1] + p[1][1] + p[2][1]) / 3 };
      const marxa = { x: fi.x - cami[cami.length - 3].x, y: fi.y - cami[cami.length - 3].y };
      const cap = (morro.x - centre.x) * marxa.x + (morro.y - centre.y) * marxa.y;
      cal('i la punta apunta en el sentit de la marxa', cap > 0,
        `${cara} ${horari ? 'horari' : 'antihorari'}: ${cap.toFixed(1)}`);
    }
  }
}

const N = 250;
titol(`6. ${N} ítems`);
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

titol('7. Varietat i dibuix');
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
