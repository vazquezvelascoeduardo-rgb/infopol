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
/**
 * La línia del mig de cada fletxa.
 *
 * La fletxa és una cinta, no una ratlla: un polígon amb la meitat dels punts
 * per fora de l'arc i l'altra meitat per dins, a l'inrevés. La línia que diu
 * cap on gira és la del mig, i s'obté fent la mitjana de cada punt amb el
 * seu company de l'altra vora.
 */
function cintes(svg) {
  const fora = [];
  for (const m of svg.matchAll(/<polygon points="([^"]+)" fill="#15151C" stroke="none"\/>/g)) {
    const p = m[1].trim().split(/\s+/).map((q) => {
      const [x, y] = q.split(',').map(Number); return { x, y };
    });
    if (p.length < 8 || p.length % 2 !== 0) continue;
    const n = p.length / 2;
    fora.push(Array.from({ length: n }, (_, i) => ({
      x: (p[i].x + p[p.length - 1 - i].x) / 2,
      y: (p[i].y + p[p.length - 1 - i].y) / 2,
    })));
  }
  return fora;
}

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

// Els quinze moviments que es poden demanar: tres eixos per cinc blocs de
// capes. Cadascun, en els dos sentits.
const TOTS = Object.keys(R.EIXOS).flatMap((eix) =>
  [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2]].map(([desde, quantes]) => ({ eix, desde, quantes })));

titol('4b. Les capes del mig');
{
  // La prova que ho tanca, i que no me la puc inventar: girar una cara, la
  // seva capa del mig i la de l'altra banda al revés és girar EL CUB SENCER.
  // Si es fa amb un cub que té cada cara d'un color, cada cara ha de seguir
  // sent d'un sol color. Si els cicles de la capa del mig estiguessin mal
  // posats, quedarien caselles barrejades i es veuria.
  const uniforme = () => Object.fromEntries(R.CARES.map((c) => [c, Array(9).fill(c)]));
  const eixos = [
    ['dalt', [['U', true], ['MU', true], ['D', false]]],
    ['dalt al revés', [['U', false], ['MU', false], ['D', true]]],
    ['davant', [['F', true], ['MF', true], ['B', false]]],
    ['davant al revés', [['F', false], ['MF', false], ['B', true]]],
    ['dreta', [['R', true], ['MR', true], ['L', false]]],
    ['dreta al revés', [['R', false], ['MR', false], ['L', true]]],
  ];
  for (const [nom, passos] of eixos) {
    let c = uniforme();
    for (const [cara, h] of passos) c = R.mou(c, cara, h);
    cal(`girar el cub sencer per l'eix de ${nom} deixa cada cara d'un color`,
      R.CARES.every((x) => new Set(c[x]).size === 1), nom);
    cal('...i el cub no es queda igual', R.clau(c) !== R.clau(uniforme()), nom);
  }

  // I el mateix per als blocs de dues capes: «les dues de dalt» més «la de
  // baix» ha de ser, altre cop, el cub sencer girat. Això comprova que un
  // bloc estigui ben compost, que és el que va demanar l'Eduardo: «también
  // puedes mover las 2 de abajo, las 2 de arriba».
  for (const eix of Object.keys(R.EIXOS)) {
    for (const [bloc, resta] of [[[0, 2], [2, 1]], [[1, 2], [0, 1]]]) {
      for (const horari of [true, false]) {
        let c = R.aplica(uniforme(), { eix, desde: bloc[0], quantes: bloc[1], horari });
        c = R.aplica(c, { eix, desde: resta[0], quantes: resta[1], horari });
        cal(`el bloc ${bloc.join('+')} i la capa que queda fan el cub sencer`,
          R.CARES.every((x) => new Set(c[x]).size === 1), `${eix} ${bloc.join('+')}`);
        cal('...i el cub no es queda igual', R.clau(c) !== R.clau(uniforme()), eix);
      }
    }
    // Un bloc i el mateix bloc al revés es desfan.
    for (const [desde, quantes] of [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2]]) {
      const anada = R.aplica(cubMarcat(), { eix, desde, quantes, horari: true });
      const tornada = R.aplica(anada, { eix, desde, quantes, horari: false });
      cal('un bloc i el seu contrari es desfan', R.clau(tornada) === R.clau(cubMarcat()),
        `${eix} ${desde}+${quantes}`);
      cal('i fer-lo una vegada canvia alguna cosa',
        R.clau(anada) !== R.clau(cubMarcat()), `${eix} ${desde}+${quantes}`);
      // Quatre vegades, la volta sencera.
      let q = cubMarcat();
      for (let i = 0; i < 4; i++) q = R.aplica(q, { eix, desde, quantes, horari: true });
      cal('quatre vegades torna al punt de partida', R.clau(q) === R.clau(cubMarcat()),
        `${eix} ${desde}+${quantes}`);
    }
  }

  const base = cubMarcat();
  for (const m of R.CAPES_MIG) {
    let c = base;
    for (let i = 0; i < 4; i++) c = R.mou(c, m, true);
    cal(`${m} quatre vegades torna al punt de partida`, R.clau(c) === R.clau(base), m);
    cal(`${m} una vegada canvia alguna cosa`, R.clau(R.mou(base, m, true)) !== R.clau(base), m);
    cal(`${m} i ${m}' es desfan`,
      R.clau(R.mou(R.mou(base, m, true), m, false)) === R.clau(base), m);
    // Una capa del mig no fa girar cap cara sobre ella mateixa: els centres
    // de les sis cares es queden on són? No: quatre en canvien. El que sí
    // que és cert és que mou dotze caselles i cap més.
    const despres = R.mou(base, m, true);
    const mogudes = R.CARES.flatMap((x) => base[x].filter((v, i) => despres[x][i] !== v));
    cal(`${m} mou dotze caselles, ni una més`, mogudes.length === 12,
      `${m}: ${mogudes.length}`);
    // I no toca cap cantonada: les capes del mig només mouen arestes i
    // centres. Les cantonades són els índexs 0, 2, 6 i 8.
    const cantonades = R.CARES.flatMap((x) => [0, 2, 6, 8].filter((i) => despres[x][i] !== base[x][i]));
    cal(`${m} no toca cap cantonada`, cantonades.length === 0, `${m}: ${cantonades.length}`);
  }
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

  // I ara la fletxa, per als sis moviments que es demanen: les tres cares
  // que es veuen i les tres capes del mig. Les capes del mig giren en el
  // mateix sentit que la cara que tenen a sobre —això ho garanteix la prova
  // 4b, on U · MU · D' resulta ser el cub sencer girat—, i com que la fletxa
  // es dibuixa al mateix pla, ha de girar cap al mateix costat.
  // Només les de l'eix horitzontal són corbes. Les altres dues són rectes i
  // es comproven a la 5e, que és una altra cosa.
  for (const mov of TOTS.filter((m) => m.eix === 'y')) {
    for (const horari of [true, false]) {
      const fals = { inici: R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {}),
        moviments: [{ ...mov, horari }, { ...mov, horari }] };
      const svg = R.svgEnunciat(fals);
      const camins = cintes(svg);
      cal('hi ha una fletxa per moviment', camins.length === 2, `${mov.eix}${mov.desde}: ${camins.length}`);
      if (camins.length !== 2) continue;
      const g = girAcumulat(camins[0]);
      const graus = (g.total * 180) / Math.PI;
      cal('la fletxa gira cap on toca',
        horari ? g.total > 0 : g.total < 0,
        `${mov.eix}${mov.desde}+${mov.quantes} ${horari ? 'horari' : 'antihorari'}: ${graus.toFixed(0)}°`);
      // La fletxa és curta a posta —un ganxo, com la del quadern— però ha de
      // corbar-se prou perquè es vegi que és un gir i no una ratlla recta.
      // El número exacte no es pot demanar: la capa es veu de gairell, el
      // cercle surt fet una el·lipse i un tros de 94° del cercle no en fa 94
      // de l'el·lipse. El que ha de ser cert sempre és que es corbi, i cap a
      // un sol costat.
      cal('i es corba prou per veure que és un gir',
        Math.abs(graus) > 30 && Math.abs(graus) < 130,
        `${mov.eix}${mov.desde}+${mov.quantes}: ${Math.abs(graus).toFixed(0)}°`);
      cal('sense canviar de sentit enmig', g.sempreIgual, `${mov.eix}${mov.desde}`);
      // I que es vegi: una fletxa curta no diu res.
      let llarg = 0;
      for (let k = 1; k < camins[0].length; k++) {
        llarg += Math.hypot(camins[0][k].x - camins[0][k - 1].x,
          camins[0][k].y - camins[0][k - 1].y);
      }
      // Curta, però no un pessic: ha de fer com a mínim un terç de l'ample
      // del cub petit, que és d'uns 40 punts.
      cal('la fletxa és prou llarga per veure-la', llarg > 25,
        `${mov.eix}${mov.desde}: ${llarg.toFixed(0)} de llarg`);
      // I la punta ha de ser ben visible al costat del cos.
      cal('la punta és gran comparada amb el cos', llarg < 60,
        `${mov.eix}${mov.desde}: ${llarg.toFixed(0)} de llarg`);
    }
  }
}

titol('5e. Les fletxes rectes pugen o baixen cap on va la capa de debò');
{
  // Als eixos vertical i frontal la fletxa és una barra recta amunt o avall.
  // Que apunti bé no es pot deduir del dibuix mateix: s'ha de comparar amb
  // el que fa el cub. Es pinta una casella del bloc, es fa el moviment, i es
  // mira si al dibuix ha pujat o ha baixat. La casella que es mira és la que
  // cau més a prop de la fletxa, que és on el moviment és vertical clavat.
  const centreDe = (punts) => ({
    x: punts.reduce((s, p) => s + p[0], 0) / punts.length,
    y: punts.reduce((s, p) => s + p[1], 0) / punts.length,
  });
  const S = 24;
  const centreDelMarc = (svg) => {
    const [w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
    return { x: w / 2, y: h / 2 };
  };
  for (const mov of TOTS.filter((m) => m.eix !== 'y')) {
    for (const horari of [true, false]) {
      const m = { ...mov, horari };
      // El moviment dibuixat tot sol, amb el cub al mig del marc: així es
      // pot comparar amb `svgCub`, que també va centrat i a la mateixa
      // escala. És l'única manera de saber quina casella queda sota la
      // fletxa sense endevinar-ho.
      const svg = R.svgMoviment(m, S);
      const oM = centreDelMarc(svg);

      // El cos de la fletxa és una cinta, com les corbes: se'n treu la línia
      // del mig. La punta és el polígon negre de tres vèrtexs.
      const camins = cintes(svg);
      const puntes = [...svg.matchAll(/<polygon points="([^"]+)" fill="#15151C"/g)]
        .map((x) => x[1].trim().split(/\s+/).map((q) => q.split(',').map(Number)))
        .filter((p) => p.length === 3);
      cal('hi ha un cos de fletxa', camins.length === 1, `${mov.eix}${mov.desde}: ${camins.length}`);
      cal('i una punta', puntes.length === 1, `${mov.eix}${mov.desde}: ${puntes.length}`);
      if (!camins.length || !puntes.length) continue;
      const cami = camins[0];
      const fi = cami[cami.length - 1];
      const pun = centreDe(puntes[0]);
      // Cap on mira. El MORRO de la punta va per davant i el centre del
      // triangle queda darrere, o sigui que la fletxa apunta amunt quan el
      // morro és per sobre del centre. Ho vaig escriure al revés i totes
      // les comprovacions de sentit sortien capgirades.
      const amunt = fi.y < pun.y ? -1 : 1;
      // El ganxo ha d'acabar mirant amunt o avall: el darrer tros de la
      // corba ha de ser molt més vertical que horitzontal.
      const cua = { x: cami[cami.length - 1].x - cami[cami.length - 3].x,
        y: cami[cami.length - 1].y - cami[cami.length - 3].y };
      cal('la fletxa acaba mirant amunt o avall', Math.abs(cua.y) > Math.abs(cua.x) * 2.5,
        `${mov.eix}${mov.desde}: acaba (${cua.x.toFixed(1)}, ${cua.y.toFixed(1)})`);
      // I ha de ser un ganxo, no una ratlla: s'ha de corbar.
      const g = girAcumulat(cami);
      cal('i es corba, que per això és una fletxa de gir',
        Math.abs(g.total * 180 / Math.PI) > 40, `${mov.eix}${mov.desde}`);
      // Cap on gira la fletxa. Una fletxa que acaba amunt o avall no és una
      // fletxa «sense gir»: està posada a un costat de l'eix i apunta cap a
      // algun lloc, i això ja diu un sentit de rotació. Es mesura amb el
      // producte creuat de la posició per la direcció: positiu vol dir cap a
      // la dreta, a la pantalla, on la y creix cap avall.
      //
      // El punt on s'aplica és on ACABA la fletxa, que és el que toca el pla
      // del gir. El centre del cos no serveix: el ganxo s'obre cap enfora i
      // el seu centre queda desplaçat.
      const P = { x: fi.x - oM.x, y: fi.y - oM.y };
      const D = { x: fi.x - cami[cami.length - 3].x, y: fi.y - cami[cami.length - 3].y };
      const giraLaFletxa = Math.sign(P.x * D.y - P.y * D.x);
      cal('la fletxa diu algun sentit', giraLaFletxa !== 0, `${mov.eix}${mov.desde}`);

      // I cap on gira el cub: se sumen els moments de totes les caselles que
      // es mouen. Es va provar de triar «la casella que hi ha sota la
      // fletxa» i no funciona: la fletxa és fora del cub i la perspectiva la
      // puja, o sigui que la més propera a la pantalla acaba sent una
      // cantonada que es mou de gairell. El moment de totes plegades, en
      // canvi, és el sentit del gir i prou.
      let moment = 0, seguides = 0;
      for (const [c, idx] of Object.entries(R.casellesQueEsMouen(m))) {
        for (const i of idx) {
          const abans = R.CARES.reduce((o, x) => ({ ...o, [x]: Array(9).fill('blanc') }), {});
          abans[c] = [...abans[c]];
          abans[c][i] = 'magenta';
          const svgA = R.svgCub(abans, S);
          const oC = centreDelMarc(svgA);
          const A = trobaColor(svgA, R.COLORS.magenta);
          const B = trobaColor(R.svgCub(R.aplica(abans, m), S), R.COLORS.magenta);
          // Si desapareix cap al darrere, no es pot seguir.
          if (A.length !== 1 || B.length !== 1) continue;
          seguides++;
          const rx = A[0].x - oC.x, ry = A[0].y - oC.y;
          moment += rx * (B[0].y - A[0].y) - ry * (B[0].x - A[0].x);
        }
      }
      cal('hi ha caselles que es puguin seguir', seguides >= 2,
        `${mov.eix}${mov.desde}: ${seguides}`);
      cal('la fletxa gira cap on gira la capa', Math.sign(moment) === giraLaFletxa,
        `${mov.eix}${mov.desde}+${mov.quantes} ${horari ? 'horari' : 'antihorari'}: `
        + `la fletxa va ${amunt < 0 ? 'amunt' : 'avall'} i el cub gira `
        + `${moment > 0 ? 'cap a la dreta' : 'cap a l\'esquerra'}`);
    }
  }
}

titol('5b. La punta de la fletxa va on acaba el camí i apunta on va');
{
  for (const mov of TOTS.filter((m) => m.eix === 'y')) {
    for (const horari of [true, false]) {
      const fals = { inici: R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {}),
        moviments: [{ ...mov, horari }, { ...mov, horari }] };
      const svg = R.svgEnunciat(fals);
      const cami = cintes(svg)[0];
      cal('hi ha cinta', !!cami, `${mov.eix}${mov.desde}`);
      if (!cami) continue;
      // La punta és el primer polígon de tres vèrtexs negre.
      const p = [...svg.matchAll(/<polygon points="([^"]+)" fill="#15151C"/g)]
        .map((m) => m[1].trim().split(/\s+/).map((q) => q.split(',').map(Number)))
        .filter((q) => q.length === 3)[0];
      cal('hi ha punta', !!p, `${mov.eix}${mov.desde}`);
      if (!p) continue;
      const fi = cami[cami.length - 1];
      const morro = { x: p[0][0], y: p[0][1] };
      cal('el morro de la punta és on acaba el camí',
        Math.hypot(morro.x - fi.x, morro.y - fi.y) < 0.5, `${mov.eix}${mov.desde}`);
      // Apunta cap on anava el camí: el morro va per davant del centre de la
      // punta, en la direcció de la marxa.
      const centre = { x: (p[0][0] + p[1][0] + p[2][0]) / 3, y: (p[0][1] + p[1][1] + p[2][1]) / 3 };
      const marxa = { x: fi.x - cami[cami.length - 3].x, y: fi.y - cami[cami.length - 3].y };
      const cap = (morro.x - centre.x) * marxa.x + (morro.y - centre.y) * marxa.y;
      cal('i la punta apunta en el sentit de la marxa', cap > 0,
        `${mov.eix}${mov.desde} ${horari ? 'horari' : 'antihorari'}: ${cap.toFixed(1)}`);
    }
  }
}

titol('5c. Al dibuix del moviment hi ha pintat exactament el que es mou');
{
  for (const mov of TOTS) {
    const fals = { inici: R.CARES.reduce((c, x) => ({ ...c, [x]: Array(9).fill('blanc') }), {}),
      moviments: [{ ...mov, horari: true }, { ...mov, horari: true }] };
    const svg = R.svgEnunciat(fals);
    const pintades = trobaColor(svg, R.COLORS.capa).length;
    // Del dibuix només se'n veuen tres cares, o sigui que es compten les
    // caselles que es mouen d'aquestes tres. I hi ha dos cubs de moviment.
    const mou = R.casellesQueEsMouen(mov);
    const toca = ['U', 'F', 'R'].reduce((s, c) => s + new Set(mou[c]).size, 0);
    cal('hi ha pintat el que es mou, ni més ni menys', pintades === toca * 2,
      `${mov.eix}${mov.desde}+${mov.quantes}: pintades ${pintades}, n'hi hauria d'haver ${toca * 2}`);
    cal('i alguna cosa hi ha pintada', toca > 0, mov.eix + mov.desde);
  }
}

titol('5d. Al full, l\'enunciat no trepitja la primera resposta');
{
  // Això hi és perquè va passar: en fer els cubs dels moviments més grossos,
  // l'enunciat va passar de 300 a 340 d'ample i al full va quedar per sobre
  // del primer cub de resposta. Ara es mira amb números.
  const full = R.svgFull([1, 2].map((s) => R.generaItem(s)));
  cal('el full surt sencer', !/NaN|undefined/.test(full));
  const grups = [...full.matchAll(/<g transform="translate\((-?[\d.]+) (-?[\d.]+)\)">/g)]
    .map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
  const enunciats = grups.filter((g) => g.x === 10);
  cal('hi ha un enunciat per pregunta', enunciats.length === 2, `${enunciats.length}`);
  const respostes = grups.filter((g) => g.x !== 10).map((g) => g.x);
  const primera = Math.min(...respostes);
  // El cub de la resposta va centrat al seu punt, o sigui que comença mig
  // cub abans.
  const mitjCub = Math.cos(Math.PI / 6) * 26;
  cal('l\'enunciat acaba abans que comenci la primera resposta',
    10 + R.MIDA_ENUNCIAT.w <= primera - mitjCub,
    `l'enunciat arriba a ${10 + R.MIDA_ENUNCIAT.w} i la resposta comença a `
    + `${(primera - mitjCub).toFixed(0)}`);
  // I que el full sigui prou ample per a l'última.
  const ample = Number(full.match(/width="(\d+)"/)[1]);
  cal('l\'última resposta cap al full', Math.max(...respostes) + mitjCub <= ample,
    `arriba a ${(Math.max(...respostes) + mitjCub).toFixed(0)} i el full fa ${ample}`);
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
    vistes.add(R.clauVisible(it.inici) + '|' + it.moviments.map((m) => m.eix + m.desde + m.quantes + (m.horari ? '' : "'")).join(''));
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
