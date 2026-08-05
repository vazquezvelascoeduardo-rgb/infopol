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
  capa: '#CFE0EF',
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
  U: [['F', [0, 1, 2]], ['L', [0, 1, 2]], ['B', [0, 1, 2]], ['R', [0, 1, 2]]],
  D: [['F', [6, 7, 8]], ['R', [6, 7, 8]], ['B', [6, 7, 8]], ['L', [6, 7, 8]]],
  F: [['U', [6, 7, 8]], ['R', [0, 3, 6]], ['D', [2, 1, 0]], ['L', [8, 5, 2]]],
  B: [['U', [2, 1, 0]], ['L', [0, 3, 6]], ['D', [6, 7, 8]], ['R', [8, 5, 2]]],
  L: [['U', [0, 3, 6]], ['F', [0, 3, 6]], ['D', [0, 3, 6]], ['B', [8, 5, 2]]],
  R: [['U', [8, 5, 2]], ['B', [0, 3, 6]], ['D', [8, 5, 2]], ['F', [8, 5, 2]]],
};

/** Aplica un moviment. `cara` és una de les sis; `horari`, cap on gira. */
export function mou(cub, cara, horari = true) {
  const out = Object.fromEntries(Object.entries(cub).map(([k, v]) => [k, [...v]]));
  // La cara que gira.
  out[cara] = horari ? giraCara(cub[cara]) : giraCara(giraCara(giraCara(cub[cara])));
  // I la cinta de caselles de les quatre cares del voltant.
  const cicle = CICLES[cara];
  for (let i = 0; i < 4; i++) {
    const [deCara, deIdx] = cicle[horari ? i : (i + 1) % 4];
    const [aCara, aIdx] = cicle[horari ? (i + 1) % 4 : i];
    for (let k = 0; k < 3; k++) out[aCara][aIdx[k]] = cub[deCara][deIdx[k]];
  }
  return out;
}

/** Aplica una llista de moviments, cadascun { cara, horari }. */
export const mouTot = (cub, moviments) =>
  moviments.reduce((c, m) => mou(c, m.cara, m.horari), cub);

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

const MOVIMENTS = ['U', 'D', 'F', 'B', 'L', 'R'];

// Els moviments que es demanen són només de les tres cares que es veuen.
// No és per fer-ho més fàcil: és perquè la fletxa es dibuixa sobre la cara
// que gira, i si la cara fos de les del darrere, la fletxa quedaria amagada
// pel cub o s'hauria de posar al costat, i llavors es veuria des de l'altre
// costat i el sentit sortiria capgirat. Val més tres cares que es vegin bé
// que sis que enganyin.
const GIRABLES = ['U', 'F', 'R'];

export function generaItem(seed) {
  const r = rng(seed, 31);
  for (let intent = 0; intent < 400; intent++) {
    const inici = cubNou(r);
    if (!inici) continue;

    const moviments = [0, 1].map(() => ({
      cara: tria(r, GIRABLES), horari: r() < 0.5,
    }));
    // Dos moviments que es desfan l'un a l'altre deixarien el cub igual.
    if (moviments[0].cara === moviments[1].cara
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
      { c: mouTot(bona, [{ cara: tria(r, MOVIMENTS), horari: true }]), error: 'un moviment de més' },
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
const PLA = {
  U: { c: [0.5, 1, 0.5], n: [0, 1, 0], a: [1, 0, 0], b: [0, 0, -1] },
  F: { c: [0.5, 0.5, 1], n: [0, 0, 1], a: [1, 0, 0], b: [0, 1, 0] },
  R: { c: [1, 0.5, 0.5], n: [1, 0, 0], a: [0, 0, -1], b: [0, 1, 0] },
};

/** Els noms de les cares, per escriure'ls a sota. */
export const NOM_CARA = { U: 'dalt', D: 'baix', F: 'davant', B: 'darrere', L: 'esquerra', R: 'dreta' };

/** Un cub petit amb la capa que gira pintada i una fletxa a sobre. */
function dibuixaMoviment(cx, cy, mov, s) {
  const pla = PLA[mov.cara];
  const pt = (p) => {
    const q = proj(p[0], p[1], p[2], s);
    return { x: cx + q.x, y: cy + q.y };
  };

  // La capa que es mou, pintada, perquè es vegi quina és sense llegir res.
  const cub = cubBlanc();
  cub[mov.cara] = Array(9).fill('capa');

  // L'arc: tres quarts de volta, una mica separat de la cara perquè no es
  // confongui amb les ratlles de les caselles.
  const R0 = 0.62, FORA = 0.14, PASSOS = 26;
  const TOMB = (Math.PI * 3) / 2;
  const desde = mov.cara === 'U' ? Math.PI * 0.15 : -Math.PI * 0.35;
  const signe = mov.horari ? -1 : 1;        // horari = angle que decreix

  const punt = (t) => {
    const th = desde + signe * t * TOMB;
    const co = Math.cos(th), si = Math.sin(th);
    return pt([0, 1, 2].map((k) =>
      pla.c[k] + pla.n[k] * FORA + R0 * (co * pla.a[k] + si * pla.b[k])));
  };

  const cami = Array.from({ length: PASSOS + 1 }, (_, i) => punt(i / PASSOS));
  const linia = `<polyline points="${cami.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
    + ` fill="none" stroke="${NEGRE}" stroke-width="2.4" stroke-linecap="round"`
    + ` stroke-linejoin="round"/>`;

  // La punta, orientada amb la tangent d'on acaba l'arc. Així apunta on va
  // de veritat, i canvia sola quan canvia el sentit.
  const fi = cami[PASSOS], abans = cami[PASSOS - 2];
  const ang = Math.atan2(fi.y - abans.y, fi.x - abans.x);
  const L = s * 0.30, OBRE = 0.44;
  const ala = (g) => `${(fi.x - L * Math.cos(ang + g)).toFixed(1)},`
    + `${(fi.y - L * Math.sin(ang + g)).toFixed(1)}`;
  const punta = `<polygon points="${fi.x.toFixed(1)},${fi.y.toFixed(1)} ${ala(OBRE)} `
    + `${ala(-OBRE)}" fill="${NEGRE}"/>`;

  return dibuixaCub(cx, cy, cub, s) + linia + punta;
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

/** L'enunciat: el cub de partida i els dos moviments. */
export function svgEnunciat(item, s = 34) {
  // Els cubs dels moviments són gairebé tan grossos com el de partida. Al
  // principi eren la meitat i la fletxa hi quedava com una molla de pa: hi
  // cabia un arc de dotze punts d'ample, i no s'entenia res.
  const w = 340, h = 140;
  const petit = s * 0.76;
  const lletra = (x, y, t, mida, pes) => `<text x="${x}" y="${y}" text-anchor="middle"`
    + ` font-family="ui-sans-serif,system-ui,sans-serif" font-size="${mida}"`
    + ` font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

  const cos = dibuixaCub(78, 78, item.inici, s)
    + item.moviments.map((m, i) => {
      const x = 200 + i * 90;
      // Tres línies a sota: quin moviment és, quina cara gira i cap on. La
      // fletxa ja ho diu, però escrit no hi ha res a interpretar.
      return dibuixaMoviment(x, 60, m, petit)
        + lletra(x, 104, `${i === 0 ? '1r' : '2n'} moviment`, 9.5, 600)
        + lletra(x, 118, `cara de ${NOM_CARA[m.cara]}`, 10.5, 700)
        + lletra(x, 131, m.horari ? 'sentit horari' : 'sentit antihorari', 9.5, 500);
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
  const alt = 180;
  const cos = items.map((it, i) => {
    const y = i * alt;
    const op = it.opcions.map((_, k) => {
      const x = 330 + k * 92;
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
