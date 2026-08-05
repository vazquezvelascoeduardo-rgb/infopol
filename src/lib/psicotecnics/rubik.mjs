// "Com quedarà el cub després dels moviments?"
//
// Un cub de 3×3×3 amb unes quantes caselles pintades, dos moviments de
// capa dibuixats amb fletxes, i quatre cubs per triar. És el model del
// quadern nou, i és el primer que porta color.
//
// Els moviments són els de sempre del cub de Rubik: girar una cara un
// quart de volta. Definir-los bé és el 90% de la feina, perquè un cicle
// mal posat dona un cub que sembla bo i no ho és.
//
// Per això no me'n refio i ho comprovo amb tres coses que no depenen de
// com estigui escrit el codi:
//
//  1. Girar quatre vegades la mateixa cara ho deixa tot com estava.
//  2. Un gir i el seu contrari, també.
//  3. I la bona: la seqüència (R U R' U') repetida SIS vegades torna el
//     cub al punt de partida. És un fet conegut del cub de Rubik i no té
//     res a veure amb el meu codi; si els meus moviments estiguessin mal
//     definits, no sortiria.
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

// ── Les sis cares ────────────────────────────────────────────────
// Cada cara són nou caselles, de la 0 a la 8, per files i mirant-la des
// de fora. La U és la de dalt, la F la del davant, la R la de la dreta.
export const CARES = ['U', 'D', 'F', 'B', 'L', 'R'];

/** Els colors del quadern: fons blanc i tres tintes. */
export const COLORS = {
  blanc: '#FFFFFF',
  magenta: '#C2185B',
  blau: '#2C3E56',
  groc: '#F2C14E',
  // No és un color del cub: és el tint de la capa que gira, al dibuix dels
  // moviments. Allà el cub va tot blanc i això és l'únic que hi ha pintat.
  capa: '#C6C9CE',
};
const TINTES = ['magenta', 'blau', 'groc'];

/** Un cub tot blanc. */
const cubBlanc = () =>
  Object.fromEntries(CARES.map((c) => [c, Array(9).fill('blanc')]));

/** Gira les nou caselles d'una cara un quart de volta en sentit horari. */
const giraCara = (c) => [c[6], c[3], c[0], c[7], c[4], c[1], c[8], c[5], c[2]];

// Els cicles de cada moviment: quines tres caselles de quina cara van a
// parar a quines. Es llegeix «el que hi ha a A passa a B».
const CICLES = {
  // eslint-disable-next-line -- les capes del mig s'hi afegeixen més avall
  U: [['F', [0, 1, 2]], ['L', [0, 1, 2]], ['B', [0, 1, 2]], ['R', [0, 1, 2]]],
  D: [['F', [6, 7, 8]], ['R', [6, 7, 8]], ['B', [6, 7, 8]], ['L', [6, 7, 8]]],
  F: [['U', [6, 7, 8]], ['R', [0, 3, 6]], ['D', [2, 1, 0]], ['L', [8, 5, 2]]],
  B: [['U', [2, 1, 0]], ['L', [0, 3, 6]], ['D', [6, 7, 8]], ['R', [8, 5, 2]]],
  L: [['U', [0, 3, 6]], ['F', [0, 3, 6]], ['D', [0, 3, 6]], ['B', [8, 5, 2]]],
  R: [['U', [8, 5, 2]], ['B', [0, 3, 6]], ['D', [8, 5, 2]], ['F', [8, 5, 2]]],
};

// Les tres capes del mig. No són cares: són la llesca central del cub, i
// quan giren no hi ha cap cara que roti sobre ella mateixa, només la cinta.
//
// Cadascuna gira en el mateix sentit que la cara que té a sobre, o sigui
// que «horari» vol dir el mateix mirant des del mateix costat. La notació
// de tota la vida no ho fa així —la M gira com l'esquerra i la E com la de
// baix— però aquí la fletxa s'ha de veure des de davant, i si la llesca
// girés com una cara amagada, el sentit sortiria capgirat a la pantalla.
//
// Els índexs són els de la cara del costat, però de la fila o la columna
// del mig: on la de dalt agafa 0,1,2 la del mig agafa 3,4,5.
const CICLES_MIG = {
  MU: [['F', [3, 4, 5]], ['L', [3, 4, 5]], ['B', [3, 4, 5]], ['R', [3, 4, 5]]],
  MF: [['U', [3, 4, 5]], ['R', [1, 4, 7]], ['D', [5, 4, 3]], ['L', [7, 4, 1]]],
  MR: [['U', [7, 4, 1]], ['B', [1, 4, 7]], ['D', [7, 4, 1]], ['F', [7, 4, 1]]],
};
Object.assign(CICLES, CICLES_MIG);

/** Les capes del mig, per saber quines no fan girar cap cara. */
export const CAPES_MIG = Object.keys(CICLES_MIG);

/** Aplica un moviment. `cara` és una de les sis o una capa del mig. */
export function mou(cub, cara, horari = true) {
  const out = Object.fromEntries(Object.entries(cub).map(([k, v]) => [k, [...v]]));
  // La cara que gira. Les capes del mig no en tenen cap.
  if (!CICLES_MIG[cara]) {
    out[cara] = horari ? giraCara(cub[cara]) : giraCara(giraCara(giraCara(cub[cara])));
  }
  // I la cinta de caselles de les quatre cares del voltant.
  const cicle = CICLES[cara];
  for (let i = 0; i < 4; i++) {
    const [deCara, deIdx] = cicle[horari ? i : (i + 1) % 4];
    const [aCara, aIdx] = cicle[horari ? (i + 1) % 4 : i];
    for (let k = 0; k < 3; k++) out[aCara][aIdx[k]] = cub[deCara][deIdx[k]];
  }
  return out;
}

// ── Els moviments que es demanen ─────────────────────────────────
// Un moviment és un EIX, un BLOC DE CAPES seguides i un SENTIT. Amb això hi
// entra tot: una cara sola, la capa del mig, la de darrere, i també «les
// dues de dalt» o «les dues de baix», que és el que va demanar l'Eduardo.
//
// El sentit es diu sempre mirant des del costat que es veu —des de dalt,
// des de davant o des de la dreta—, i per això la capa del fons va marcada
// per girar-la al revés: la de baix girada «horària des de dalt» és, per a
// la funció `mou`, un gir antihorari, perquè `mou` la mira des de sota.
//
// Que això estigui ben lligat no és cosa de creure-s'ho: girar les tres
// capes d'un eix alhora ha de ser girar EL CUB SENCER, i amb un cub que té
// cada cara d'un color es veu de seguida si no ho fos.
export const EIXOS = {
  y: {
    des: 'dalt',
    capes: [['U', true], ['MU', true], ['D', false]],
    soles: ['la de dalt', 'la del mig', 'la de baix'],
    dobles: ['les 2 de dalt', 'les 2 de baix'],
  },
  z: {
    des: 'davant',
    capes: [['F', true], ['MF', true], ['B', false]],
    soles: ['la de davant', 'la del mig', 'la del darrere'],
    dobles: ['les 2 de davant', 'les 2 del darrere'],
  },
  x: {
    des: 'la dreta',
    capes: [['R', true], ['MR', true], ['L', false]],
    soles: ['la de la dreta', 'la del mig', "la de l'esquerra"],
    dobles: ['les 2 de la dreta', "les 2 de l'esquerra"],
  },
};

/** Fa un moviment { eix, desde, quantes, horari }. */
export function aplica(cub, mov) {
  const e = EIXOS[mov.eix];
  let c = cub;
  for (let i = mov.desde; i < mov.desde + mov.quantes; i++) {
    const [cara, mateixSentit] = e.capes[i];
    c = mou(c, cara, mov.horari === mateixSentit);
  }
  return c;
}

/** Aplica una llista de moviments. */
export const mouTot = (cub, moviments) => moviments.reduce(aplica, cub);

/** Com es diu, per escriure-ho a sota del dibuix. */
export function nomDelMoviment(mov) {
  const e = EIXOS[mov.eix];
  return mov.quantes === 1 ? e.soles[mov.desde] : e.dobles[mov.desde === 0 ? 0 : 1];
}

/** Com es veu un cub. Dos cubs són el mateix si això coincideix. */
export const clau = (cub) => CARES.map((c) => cub[c].join('')).join('|');

/** Només les tres cares que es veuen al dibuix. Això és el que es compara. */
export const clauVisible = (cub) => ['U', 'F', 'R'].map((c) => cub[c].join('')).join('|');

// ── Fer-ne un ───────────────────────────────────────────────────
// Es pinten unes quantes caselles de les tres cares que es veuen. Les de
// darrere es deixen blanques: no surten al dibuix i pintar-les només
// serviria per fer sortir colors del no-res quan el cub gira.
function cubNou(r) {
  const cub = cubBlanc();
  const quantes = entre(r, 4, 6);
  const posades = new Set();
  for (let i = 0; i < quantes; i++) {
    const cara = tria(r, ['U', 'F', 'R']);
    const idx = entre(r, 0, 8);
    const k = `${cara}${idx}`;
    if (posades.has(k)) continue;
    posades.add(k);
    cub[cara][idx] = tria(r, TINTES);
  }
  return posades.size >= 4 ? cub : null;
}

// Els blocs de capes que es poden demanar: cadascuna sola, les dues de
// davant i les dues del fons. Les tres alhora no: això és girar el cub
// sencer i no canvia res de lloc.
const BLOCS = [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2]];

export function generaItem(seed) {
  const r = rng(seed, 31);
  for (let intent = 0; intent < 400; intent++) {
    const inici = cubNou(r);
    if (!inici) continue;

    const moviments = [0, 1].map(() => {
      const [desde, quantes] = tria(r, BLOCS);
      return { eix: tria(r, Object.keys(EIXOS)), desde, quantes, horari: r() < 0.5 };
    });
    // Dos moviments que es desfan l'un a l'altre deixarien el cub igual.
    const mateix = (a, b) => a.eix === b.eix && a.desde === b.desde && a.quantes === b.quantes;
    if (mateix(moviments[0], moviments[1])
      && moviments[0].horari !== moviments[1].horari) continue;

    const bona = mouTot(inici, moviments);
    // Que es noti que ha passat alguna cosa a les cares que es veuen.
    if (clauVisible(bona) === clauVisible(inici)) continue;

    // Distractors: el que sortiria d'equivocar-se d'una manera concreta.
    const cands = [
      { c: mouTot(inici, [moviments[0]]), error: 'fer només el primer moviment' },
      { c: mouTot(inici, [moviments[1]]), error: 'fer només el segon' },
      { c: mouTot(inici, [moviments[1], moviments[0]]), error: 'fer-los en l\'altre ordre' },
      {
        c: mouTot(inici, moviments.map((m) => ({ ...m, horari: !m.horari }))),
        error: 'girar-los tots dos al revés',
      },
      {
        c: mouTot(inici, [{ ...moviments[0], horari: !moviments[0].horari }, moviments[1]]),
        error: 'girar el primer al revés',
      },
      {
        c: mouTot(inici, [moviments[0], { ...moviments[1], horari: !moviments[1].horari }]),
        error: 'girar el segon al revés',
      },
      {
        c: aplica(bona, { eix: tria(r, Object.keys(EIXOS)), desde: 0, quantes: 1, horari: true }),
        error: 'un moviment de més',
      },
    ];
    const dolents = [];
    for (const cand of barreja(r, cands)) {
      if (clauVisible(cand.c) === clauVisible(bona)) continue;
      if (dolents.some((d) => clauVisible(d.c) === clauVisible(cand.c))) continue;
      dolents.push(cand);
      if (dolents.length === 3) break;
    }
    if (dolents.length < 3) continue;

    const correcta = posicioBona(seed, 4, 'rubik');
    const opcions = [];
    let d = 0;
    for (let i = 0; i < 4; i++) opcions.push(i === correcta ? bona : dolents[d++].c);

    return {
      seed, inici, moviments, opcions, correcta,
      perque: dolents.map((x) => x.error),
      control: {
        // Els colors no es creen ni es perden: girar només els mou.
        colorsEsConserven: comptaColors(inici) === comptaColors(bona),
        nomesUnaCoincideix: opcions.filter((o) => clauVisible(o) === clauVisible(bona)).length === 1,
        laMarcadaEsLaBona: clauVisible(opcions[correcta]) === clauVisible(bona),
        quatreOpcionsDiferents: new Set(opcions.map(clauVisible)).size === 4,
        elCubCanvia: clauVisible(bona) !== clauVisible(inici),
      },
    };
  }
  throw new Error(`no s'ha pogut generar el cub de Rubik ${seed}`);
}

/** Quantes caselles hi ha de cada color, en un text per comparar. */
export function comptaColors(cub) {
  const n = {};
  for (const c of CARES) for (const p of cub[c]) n[p] = (n[p] || 0) + 1;
  return Object.keys(n).sort().map((k) => `${k}:${n[k]}`).join(',');
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#15151C';
const K = Math.cos(Math.PI / 6);
const proj = (x, y, z, s) => ({ x: (x - z) * K * s, y: (x + z) * 0.5 * s - y * s });

// Les tres cares que es veuen, amb el marc de cadascuna dins del cub.
// `o` és el cantó on comença, `u` cap on van les columnes i `v` les files.
const VISTA = [
  { cara: 'U', o: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { cara: 'F', o: [0, 1, 1], u: [1, 0, 0], v: [0, -1, 0] },
  { cara: 'R', o: [1, 1, 1], u: [0, 0, -1], v: [0, -1, 0] },
];

/** Un cub sencer, amb les nou caselles de cada cara que es veu. */
function dibuixaCub(cx, cy, cub, s) {
  const pt = (p) => {
    const q = proj(p[0], p[1], p[2], s);
    return { x: cx + q.x, y: cy + q.y };
  };
  const suma = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
  let out = '';
  for (const v of VISTA) {
    for (let f = 0; f < 3; f++) {
      for (let c = 0; c < 3; c++) {
        const base = suma(suma(v.o, v.u, c / 3), v.v, f / 3);
        const p = [
          pt(base),
          pt(suma(base, v.u, 1 / 3)),
          pt(suma(suma(base, v.u, 1 / 3), v.v, 1 / 3)),
          pt(suma(base, v.v, 1 / 3)),
        ];
        out += `<polygon points="${p.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
          + ` fill="${COLORS[cub[v.cara][f * 3 + c]]}" stroke="${NEGRE}" stroke-width="0.7"/>`;
      }
    }
    // El contorn de la cara, més gruixut, perquè es vegi el cub.
    const p = [pt(v.o), pt(suma(v.o, v.u, 1)), pt(suma(suma(v.o, v.u, 1), v.v, 1)), pt(suma(v.o, v.v, 1))];
    out += `<polygon points="${p.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
      + ` fill="none" stroke="${NEGRE}" stroke-width="1.6" stroke-linejoin="round"/>`;
  }
  return out;
}

// ── La fletxa del moviment ───────────────────────────────────────
// La primera fletxa que vaig fer no servia: era un mig arc al costat del
// cub, sempre horitzontal, i la punta anava clavada al mateix lloc apuntant
// sempre igual. Girar a la dreta i girar a l'esquerra només es diferenciaven
// perquè l'arc passava per sobre o per sota. L'Eduardo ho va dir de seguida:
// «no se aprecia hacia dónde giran».
//
// Ara la fletxa es dibuixa AL PLA DE LA CARA que gira, o sigui que s'inclina
// amb el cub, i la punta surt de la tangent de debò de l'arc. A més, la capa
// que es mou va pintada, i a sota hi ha el nom de la cara i el sentit escrit.
// Tres coses que diuen el mateix: si una no es veu bé, les altres dues
// encara hi són.
//
// Per a cada cara: on és el centre, cap on mira i una base del seu pla
// escollida perquè a × b apunti cap a fora. Amb aquesta base, l'angle que
// creix gira en sentit ANTIhorari per a qui mira la cara de front —el
// conveni de tota la vida—, i per tant el sentit horari és l'angle que
// decreix.
//
// Les capes del mig fan servir el mateix pla que la cara que tenen a sobre
// —giren en el mateix sentit—, però amb el centre al mig del cub i un radi
// més gros, de manera que l'arc surt per fora de la silueta i es veu com un
// cinturó. Si tingués el radi de la cara quedaria amagat dins del cub.
// Un pla per eix, amb la normal cap al costat que es veu.
const PLA = {
  y: { n: [0, 1, 0], a: [1, 0, 0], b: [0, 0, -1] },
  z: { n: [0, 0, 1], a: [1, 0, 0], b: [0, 1, 0] },
  x: { n: [1, 0, 0], a: [0, 0, -1], b: [0, 1, 0] },
};

/**
 * Quines caselles de cada cara es mouen. Serveix per pintar-les al dibuix
 * del moviment: es llegeixen dels mateixos cicles que fan el gir, no d'una
 * llista a part, o sigui que no poden dir una cosa diferent.
 */
export function casellesQueEsMouen(mov) {
  const fora = Object.fromEntries(CARES.map((c) => [c, new Set()]));
  const e = EIXOS[mov.eix];
  for (let i = mov.desde; i < mov.desde + mov.quantes; i++) {
    const cara = e.capes[i][0];
    if (!CICLES_MIG[cara]) for (let k = 0; k < 9; k++) fora[cara].add(k);
    for (const [c, idx] of CICLES[cara]) for (const k of idx) fora[c].add(k);
  }
  return Object.fromEntries(Object.entries(fora).map(([c, s]) => [c, [...s]]));
}

/** Un cub petit amb el que gira pintat i una fletxa a sobre. */
function dibuixaMoviment(cx, cy, mov, s) {
  const pla = PLA[mov.eix];
  const pt = (p) => {
    const q = proj(p[0], p[1], p[2], s);
    return { x: cx + q.x, y: cy + q.y };
  };

  // El que es mou, pintat, perquè es vegi sense llegir res. Surt dels
  // mateixos cicles que fan el gir.
  const cub = cubBlanc();
  for (const [c, idx] of Object.entries(casellesQueEsMouen(mov))) {
    for (const i of idx) cub[c][i] = 'capa';
  }

  // On va l'arc, mesurat al llarg de la normal. Les tres capes ocupen
  // [2/3, 1], [1/3, 2/3] i [0, 1/3] comptant des del costat que es veu.
  //
  //  · Si el bloc toca la cara de fora, l'arc va PER FORA d'aquesta cara,
  //    que és com es dibuixa de tota la vida «gira aquesta cara».
  //  · Si no, l'arc es posa a l'alçada del bloc i amb el radi més gros, de
  //    manera que surt per fora de la silueta i queda fet un cinturó. Amb el
  //    radi de la cara quedaria amagat dins del cub.
  const cinturo = mov.desde > 0;
  const alt = cinturo ? 1 - (2 * mov.desde + mov.quantes) / 6 : 1.14;
  const R0 = cinturo ? 0.88 : 0.62;
  const PASSOS = 26;
  const TOMB = (Math.PI * 3) / 2;
  const desde = (mov.eix === 'y' || cinturo) ? Math.PI * 0.15 : -Math.PI * 0.35;
  const signe = mov.horari ? -1 : 1;        // horari = angle que decreix

  // La fletxa és una CINTA, no una ratlla. Al quadern és una fletxa negra
  // ben gruixuda i es llegeix de lluny; una ratlla de dos punts, no. Es fa
  // amb dos arcs, un per fora i un per dins, tancats en un sol polígon.
  const GRUIX = 0.075;
  const punt = (t, r) => {
    const th = desde + signe * t * TOMB;
    const co = Math.cos(th), si = Math.sin(th);
    return pt([0, 1, 2].map((k) =>
      0.5 + pla.n[k] * (alt - 0.5) + r * (co * pla.a[k] + si * pla.b[k])));
  };

  // El cos: PASSOS+1 punts per fora i els mateixos per dins, a l'inrevés.
  // Així les proves poden retrobar la línia del mig fent la mitjana del punt
  // i del seu company, que és el que diu cap on gira la fletxa.
  const defora = Array.from({ length: PASSOS + 1 }, (_, i) => punt(i / PASSOS, R0 + GRUIX / 2));
  const dedins = Array.from({ length: PASSOS + 1 }, (_, i) => punt(i / PASSOS, R0 - GRUIX / 2));
  const cami = Array.from({ length: PASSOS + 1 }, (_, i) => punt(i / PASSOS, R0));
  const cos = [...defora, ...[...dedins].reverse()];
  const linia = `<polygon points="${cos.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
    + ` fill="${NEGRE}" stroke="none"/>`;

  // La punta, orientada amb la tangent d'on acaba l'arc. Així apunta on va
  // de veritat, i canvia sola quan canvia el sentit. Va ampla, com la del
  // quadern: el que es veu primer d'una fletxa és cap on apunta.
  const fi = cami[PASSOS], abans = cami[PASSOS - 2];
  const ang = Math.atan2(fi.y - abans.y, fi.x - abans.x);
  const L = s * 0.42, OBRE = 0.52;
  const ala = (g) => `${(fi.x - L * Math.cos(ang + g)).toFixed(1)},`
    + `${(fi.y - L * Math.sin(ang + g)).toFixed(1)}`;
  const punta = `<polygon points="${fi.x.toFixed(1)},${fi.y.toFixed(1)} ${ala(OBRE)} `
    + `${ala(-OBRE)}" fill="${NEGRE}"/>`;

  return dibuixaCub(cx, cy, cub, s) + linia + punta;
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

/**
 * Què ocupa l'enunciat. Va a part perquè el full de paper hi ha de deixar
 * lloc: quan vaig fer els cubs dels moviments més grossos, l'enunciat va
 * passar de 300 a 340 d'ample i al full va quedar per sobre de la primera
 * resposta. L'Eduardo ho va veure de seguida: «el primer cubo sale colapsado
 * con el ejemplo». Ara la mida surt d'aquí i el full la fa servir.
 */
export const MIDA_ENUNCIAT = { w: 344, h: 128 };

/** L'enunciat: el cub de partida i els dos moviments. */
export function svgEnunciat(item, s = 34) {
  // Els cubs dels moviments són gairebé tan grossos com el de partida. Al
  // principi eren la meitat i la fletxa hi quedava com una molla de pa: hi
  // cabia un arc de dotze punts d'ample, i no s'entenia res.
  const w = MIDA_ENUNCIAT.w, h = MIDA_ENUNCIAT.h;
  const petit = s * 0.70;
  const lletra = (x, y, t, mida, pes) => `<text x="${x}" y="${y}" text-anchor="middle"`
    + ` font-family="ui-sans-serif,system-ui,sans-serif" font-size="${mida}"`
    + ` font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

  const cos = dibuixaCub(72, 66, item.inici, s)
    + item.moviments.map((m, i) => {
      const x = 196 + i * 92;
      // A sota, només quin moviment és. Res de dir quina capa gira ni cap on:
      // això és la feina de la fletxa, i si la fletxa no s'entén, el que
      // s'ha d'arreglar és la fletxa. Al quadern tampoc no hi diu res més
      // que «primer moviment» i «segon moviment».
      return dibuixaMoviment(x, 62, m, petit)
        + lletra(x, 116, i === 0 ? 'PRIMER MOVIMENT' : 'SEGON MOVIMENT', 10, 700);
    }).join('');
  return embolcall(w, h, cos);
}

export function svgOpcio(item, i, s = 30) {
  return svgCub(item.opcions[i], s);
}

/** Un cub sol, dibuixat. Les proves el fan servir per mirar on va cada casella. */
export function svgCub(cub, s = 30) {
  const w = 2 * K * s + 8, h = 2 * s + 8;
  return embolcall(w, h, dibuixaCub(w / 2, h / 2, cub, s));
}

export function svgFull(items) {
  const alt = 190;
  // Les respostes comencen just després de l'enunciat, amb un dit de marge.
  const X0 = 10 + MIDA_ENUNCIAT.w + 30;
  const cos = items.map((it, i) => {
    const y = i * alt;
    const op = it.opcions.map((_, k) => {
      const x = X0 + k * 72;
      return `<g transform="translate(${x} ${y + 74})">`
        + dibuixaCub(0, 0, it.opcions[k], 26) + '</g>'
        + `<text x="${x}" y="${y + 126}" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif"`
        + ` font-size="12" font-weight="700" fill="${NEGRE}">${'ABCD'[k]}</text>`;
    }).join('');
    return `<g><text x="16" y="${y + 20}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13"`
      + ` fill="${NEGRE}"><tspan font-weight="700">${i + 1}.</tspan> Com quedarà el cub després dels moviments?</text>`
      + `<g transform="translate(10 ${y + 14})">${svgEnunciat(it).replace(/<\/?svg[^>]*>/g, '')}</g>`
      + op + '</g>';
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="${items.length * alt + 20}" viewBox="0 0 700 ${items.length * alt + 20}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}
