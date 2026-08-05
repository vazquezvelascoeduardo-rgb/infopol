// «Quina cara correspon a l'interrogant?»
//
// Un cub i, al costat, un desplegable del mateix cub amb unes quantes
// caselles dibuixades i una amb un interrogant. Cal dir quina figura hi va.
//
// ── Com està fet, i per què ─────────────────────────────────────
//
// Tot això surt de mirar el quadern. Les dues primeres versions que vaig fer
// no s'entenien, i el motiu era sempre el mateix: em faltava informació al
// dibuix.
//
// 1. EL CUB ÉS TRANSPARENT. Es veuen les sis cares: les tres del davant
//    nítides i les tres del darrere en gris fluix, com si es miressin a
//    través. I es veuen com es veurien de veritat —del revés—, perquè una
//    cara del fons es mira per la banda de dins. Sense això, la figura de
//    l'interrogant es podia haver d'endevinar sense haver-la vist mai.
//
// 2. HI HA MARQUES A LES ARESTES. Unes quantes arestes del cub van pintades
//    amb una ratlla de colors, i les mateixes arestes surten al desplegable.
//    És el truc del quadern, que ho diu amb aquestes paraules: «fixa't en
//    les referències, on hi ha buits i com connecten amb altres cares». Són
//    les que permeten saber com encaixa el desplegable amb el cub, i les que
//    fan que es vegi el gir de cada cara encara que la figura sigui rodona.
//
// 3. LES CARES ES GIREN SOLES. La figura no es dibuixa «girada tants
//    quarts»: es dibuixa damunt del quadrat de la cara tal com queda en
//    plegar, fent servir el marc que dona el motor. Girar el cub, doncs, és
//    literalment retallar el desplegable i plegar-lo.
//
// ── Que la resposta sigui única ──────────────────────────────────
//
// No es dona per fet: es compta. Es proven totes les maneres de girar el cub
// i es mira quines quadren amb el que es veu —les figures, i les arestes
// pintades al lloc que toca—. Si en surt més d'una resposta possible per a
// l'interrogant, l'ítem es llença i es prova una altra combinació.
import { barreja, posicioBona, rng, tria } from './atzar.mjs';
import {
  clau, creu, igual, neg, origen, plega, projecta, suma, valid, V, FORMES,
} from './plegat.mjs';
import { COLORS } from './ruleta.mjs';

const NEGRE = '#15151C';
const FLUIX = '#C3C7CE';

// ── Les figures ─────────────────────────────────────────────────
// Les del quadern: geomètriques, de ratlla i de colors. Que siguin
// simètriques no fa res, perquè el que diu com està posada la cara són les
// marques de les arestes, no la figura.
export const FIGURES = {
  quadrat: 'M 0.24 0.24 H 0.76 V 0.76 H 0.24 Z',
  cercle: 'M 0.5 0.22 A 0.28 0.28 0 1 1 0.4999 0.22 Z',
  triangle: 'M 0.5 0.2 L 0.79 0.75 H 0.21 Z',
  estrella: 'M 0.5 0.18 L 0.60 0.40 L 0.82 0.5 L 0.60 0.60 L 0.5 0.82'
    + ' L 0.40 0.60 L 0.18 0.5 L 0.40 0.40 Z',
  hexagon: 'M 0.5 0.19 L 0.77 0.345 V 0.655 L 0.5 0.81 L 0.23 0.655 V 0.345 Z',
  aspa: 'M 0.24 0.24 L 0.76 0.76 M 0.76 0.24 L 0.24 0.76',
  ela: 'M 0.28 0.2 V 0.76 H 0.74',
  creu: 'M 0.5 0.2 V 0.8 M 0.22 0.5 H 0.78',
};

/** El repertori: cada figura de cada color. */
const REPERTORI = [];
for (const forma of Object.keys(FIGURES)) {
  for (const c of COLORS) REPERTORI.push({ forma, color: c.id });
}
const noms = (s) => `${s.forma}/${s.color}`;
const pinta = (id) => (COLORS.find((c) => c.id === id) || COLORS[0]).pinta;

// ── Les arestes ─────────────────────────────────────────────────
// Una aresta del cub és el tros que comparteixen dues cares. Es reconeix
// pel parell de normals, sense ordre: {dalt, davant} és la mateixa aresta
// que {davant, dalt}.
const clauAresta = (a, b) => [clau(a), clau(b)].sort().join('~');

/** Els dos vèrtexs d'una aresta: els del cub que són a totes dues cares. */
function vertexsAresta(a, b) {
  const punt = (p, q) => p.x * q.x + p.y * q.y + p.z * q.z;
  const tots = [];
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) tots.push(V(x, y, z));
  const toca = (p, n) => punt(p, n) === Math.max(...tots.map((q) => punt(q, n)));
  return tots.filter((p) => toca(p, a) && toca(p, b));
}

/** Les dotze arestes del cub. */
const ARESTES = [];
{
  const dirs = [V(1, 0, 0), V(-1, 0, 0), V(0, 1, 0), V(0, -1, 0), V(0, 0, 1), V(0, 0, -1)];
  for (let i = 0; i < dirs.length; i++) {
    for (let j = i + 1; j < dirs.length; j++) {
      if (igual(dirs[i], neg(dirs[j]))) continue;      // cares oposades: no toquen
      ARESTES.push({ a: dirs[i], b: dirs[j], k: clauAresta(dirs[i], dirs[j]) });
    }
  }
}

/**
 * Els quatre costats d'una cara, amb quina aresta del cub és cadascun.
 * El marc de la cara és (u, v): u cap a la dreta del paper i v cap avall.
 */
const costats = (cara) => [
  { de: V(0, 0, 0), a: cara.u, aresta: clauAresta(cara.n, neg(cara.v)) },   // de dalt
  { de: cara.u, a: suma(cara.u, cara.v), aresta: clauAresta(cara.n, cara.u) },   // de la dreta
  { de: cara.v, a: suma(cara.u, cara.v), aresta: clauAresta(cara.n, cara.v) },   // de baix
  { de: V(0, 0, 0), a: cara.v, aresta: clauAresta(cara.n, neg(cara.u)) },   // de l'esquerra
];

// ── Fer un ítem ──────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed, 17);

  for (let intent = 0; intent < 400; intent++) {
    const forma = tria(r, Object.keys(FORMES));
    const celles = FORMES[forma].map(([nx, ny]) => ({ nx, ny, dibuix: `${nx},${ny}` }));
    const cares = plega(celles);
    if (!valid(cares)) continue;

    // Cada casella, amb el marc que li toca al cub.
    const info = {};
    for (const [k, c] of cares) info[k] = { ...c, clau: k };
    const claus = celles.map((c) => c.dibuix);

    // Sis figures diferents, una per casella.
    const figures = barreja(r, REPERTORI).slice(0, 6);
    const simbol = {};
    claus.forEach((k, i) => { simbol[k] = figures[i]; });

    // Dues o tres arestes pintades, de colors diferents. Són les
    // referències: el que permet saber com encaixa el desplegable amb el cub.
    const quantes = 2 + Math.floor(r() * 2);
    const triades = barreja(r, ARESTES).slice(0, quantes);
    const colorsMarca = barreja(r, COLORS).slice(0, quantes);
    const marques = {};
    triades.forEach((e, i) => { marques[e.k] = colorsMarca[i].pinta; });

    // El forat i les caselles dibuixades. Es prova, i si no serveix es torna
    // a provar: quines combinacions valen depèn de la forma del desplegable
    // i de quines arestes hagin sortit.
    const forat = tria(r, claus);
    const ancores = barreja(r, claus.filter((k) => k !== forat)).slice(0, 2);

    const possibles = respostes({ info, claus, simbol, marques, ancores, forat });
    if (possibles.size !== 1) continue;
    if (!possibles.has(noms(simbol[forat]))) continue;

    // Les quatre opcions són les quatre caselles que NO estan dibuixades.
    // Cap no es pot descartar de bones a primeres: totes són cares del cub.
    const lliures = claus.filter((k) => !ancores.includes(k));
    if (lliures.length !== 4) continue;
    const totes = [simbol[forat], ...lliures.filter((k) => k !== forat).map((k) => simbol[k])];
    if (new Set(totes.map(noms)).size !== 4) continue;

    const desti = posicioBona(seed, 4, 'interrogant');
    const opcions = totes.slice(1);
    opcions.splice(desti, 0, simbol[forat]);

    return {
      seed, forma, celles, info, ancores, forat, simbol, marques,
      opcions,
      correcta: desti,
      control: {
        capAncoraAlForat: !ancores.includes(forat),
        duesAncores: ancores.length === 2,
        respostaUnica: possibles.size === 1,
        sisFiguresDiferents: new Set(claus.map((k) => noms(simbol[k]))).size === 6,
        arestesPintades: Object.keys(marques).length >= 2,
        totesLesOpcionsSonCaresDelCub:
          opcions.every((o) => claus.some((k) => noms(simbol[k]) === noms(o))),
      },
    };
  }
  return null;
}

/**
 * Què podria anar a l'interrogant, mirant només el que es veu.
 *
 * Es proven les 24 maneres de girar el cub. Una serveix si tot quadra:
 *
 *  · on hi ha una casella dibuixada, la cara on va a parar ha de portar
 *    aquella figura al cub;
 *  · i les arestes pintades han de caure on es veuen pintades.
 *
 * Com que el cub es veu sencer —les tres cares del davant i les tres del
 * darrere—, la figura de l'interrogant sempre es pot llegir. El que cal
 * comprovar és que no n'hi hagi dues de possibles.
 */
function respostes({ info, claus, simbol, marques, ancores, forat }) {
  const fora = new Set();
  for (const g of GIRS) {
    // El cub girat: cada casella va a parar a una cara.
    const posa = {};
    for (const k of claus) {
      posa[k] = { n: g(info[k].n), u: g(info[k].u), v: g(info[k].v) };
    }
    // Les figures han de coincidir a les caselles dibuixades. Com que la
    // figura de cada casella no canvia, això és mirar que la cara on cau
    // sigui la mateixa que al cub de veritat.
    let va = true;
    for (const k of ancores) {
      if (!igual(posa[k].n, info[k].n)) { va = false; break; }
    }
    if (!va) continue;
    // I les arestes pintades: cada costat de cada casella ha de caure sobre
    // una aresta del mateix color que al cub.
    for (const k of claus) {
      for (let i = 0; i < 4 && va; i++) {
        const abans = costats(info[k])[i].aresta;
        const ara = costats(posa[k])[i].aresta;
        if ((marques[abans] || null) !== (marques[ara] || null)) va = false;
      }
      if (!va) break;
    }
    if (!va) continue;
    // Quina casella cau on cau la de l'interrogant.
    const quina = claus.find((k) => igual(posa[k].n, info[forat].n));
    fora.add(noms(simbol[quina]));
  }
  return fora;
}

// Les 24 maneres de girar un cub, com a funcions sobre els vectors.
const GIRS = [];
{
  const GZ = (p) => V(-p.y, p.x, p.z);
  const GX = (p) => V(p.x, -p.z, p.y);
  const vistes = new Map();
  const prova = [V(1, 0, 0), V(0, 1, 0), V(0, 0, 1)];
  const empremta = (g) => prova.map((p) => clau(g(p))).join('|');
  const cua = [(p) => p];
  vistes.set(empremta(cua[0]), cua[0]);
  while (cua.length) {
    const g = cua.shift();
    for (const h of [GZ, GX]) {
      const n = (p) => h(g(p));
      const k = empremta(n);
      if (!vistes.has(k)) { vistes.set(k, n); cua.push(n); }
    }
  }
  GIRS.push(...vistes.values());
}

// ── El dibuix ────────────────────────────────────────────────────
const figuraSvg = (s, gruix = 0.075) =>
  `<path d="${FIGURES[s.forma]}" fill="none" stroke="${pinta(s.color)}"`
  + ` stroke-width="${gruix}" stroke-linejoin="round" stroke-linecap="round"/>`;

/**
 * El cub, transparent. Es dibuixen les sis cares: primer les del fons, en
 * gris fluix, i després les del davant a sobre. Cada figura va damunt del
 * quadrat de la seva cara —fent servir el marc que ha sortit de plegar—, o
 * sigui que el gir no s'inventa: és el que queda en plegar de debò.
 */
function cubTransparent(cx, cy, item, s) {
  const pt = (p) => {
    const q = projecta(p, s);
    return { x: cx + q.x, y: cy + q.y };
  };
  const mira = V(1, 1, 1);
  const davant = (n) => n.x * mira.x + n.y * mira.y + n.z * mira.z > 0;

  const cara = (k, fosca) => {
    const c = item.info[k];
    const O3 = origen(c);
    const O = pt(O3), A = pt(suma(O3, c.u)), B = pt(suma(O3, c.v));
    const C = pt(suma(suma(O3, c.u), c.v));
    const pts = [O, A, C, B].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const m = `matrix(${(A.x - O.x).toFixed(4)} ${(A.y - O.y).toFixed(4)} `
      + `${(B.x - O.x).toFixed(4)} ${(B.y - O.y).toFixed(4)} `
      + `${O.x.toFixed(3)} ${O.y.toFixed(3)})`;
    // Les del fons van del SEU color, però esvaïdes: és un cub de vidre, no
    // un cub amb ombres. Al quadern es veuen així, i pintar-les de gris
    // hauria amagat de quin color és cada figura, que és mitja resposta.
    const fig = fosca
      ? `<path d="${FIGURES[item.simbol[k].forma]}" fill="none"`
        + ` stroke="${pinta(item.simbol[k].color)}" stroke-opacity="0.32"`
        + ` stroke-width="0.075" stroke-linejoin="round" stroke-linecap="round"/>`
      : figuraSvg(item.simbol[k]);
    return (fosca ? '' : `<polygon points="${pts}" fill="#fff" fill-opacity="0.82"/>`)
      + `<g transform="${m}">${fig}</g>`
      // Els costats: negres els del davant, fluixos els del fons, i de
      // color els que estan marcats.
      + costats(c).map((costat) => {
        const P = pt(suma(O3, costat.de)), Q = pt(suma(O3, costat.a));
        const color = item.marques[costat.aresta];
        if (!color && fosca) return '';
        return `<line x1="${P.x.toFixed(1)}" y1="${P.y.toFixed(1)}"`
          + ` x2="${Q.x.toFixed(1)}" y2="${Q.y.toFixed(1)}"`
          + ` stroke="${color || (fosca ? FLUIX : NEGRE)}"`
          + ` stroke-width="${color ? 2.6 : 1.4}"`
          + `${color ? ' stroke-dasharray="4 3"' : ''}`
          + `${fosca && !color ? ' stroke-opacity="0.55"' : ''} stroke-linecap="round"/>`;
      }).join('');
  };

  const claus = item.celles.map((c) => c.dibuix);
  return claus.filter((k) => !davant(item.info[k].n)).map((k) => cara(k, true)).join('')
    + claus.filter((k) => davant(item.info[k].n)).map((k) => cara(k, false)).join('');
}

/** El desplegable: les caselles dibuixades, l'interrogant i les marques. */
function desplegable(x, y, item, c) {
  const minX = Math.min(...item.celles.map((q) => q.nx));
  const minY = Math.min(...item.celles.map((q) => q.ny));
  return item.celles.map((ce) => {
    const px = x + (ce.nx - minX) * c, py = y + (ce.ny - minY) * c;
    let dins = '';
    if (ce.dibuix === item.forat) {
      dins = `<text x="${(px + c / 2).toFixed(1)}" y="${(py + c * 0.7).toFixed(1)}" `
        + `text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" `
        + `font-weight="700" font-size="${(c * 0.55).toFixed(1)}" fill="${NEGRE}">?</text>`;
    } else if (item.ancores.includes(ce.dibuix)) {
      dins = `<g transform="matrix(${c} 0 0 ${c} ${px} ${py})">`
        + `${figuraSvg(item.simbol[ce.dibuix])}</g>`;
    }
    // Els quatre costats, en el mateix ordre que al cub: dalt, dreta, baix,
    // esquerra. Els marcats van del seu color.
    const vores = [
      [px, py, px + c, py], [px + c, py, px + c, py + c],
      [px, py + c, px + c, py + c], [px, py, px, py + c],
    ];
    const cs = costats(item.info[ce.dibuix]);
    return `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff"/>${dins}`
      + vores.map(([x1, y1, x2, y2], i) => {
        const color = item.marques[cs[i].aresta];
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`
          + ` stroke="${color || NEGRE}" stroke-width="${color ? 3 : 1.4}"`
          + `${color ? ' stroke-dasharray="4 3"' : ''} stroke-linecap="round"/>`;
      }).join('');
  }).join('');
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" `
  + `preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

export const MIDA_ENUNCIAT = { w: 268, h: 138 };

export function svgEnunciat(item) {
  const { w, h } = MIDA_ENUNCIAT;
  const c = 30;
  const ampla = (Math.max(...item.celles.map((q) => q.nx))
    - Math.min(...item.celles.map((q) => q.nx)) + 1) * c;
  const alta = (Math.max(...item.celles.map((q) => q.ny))
    - Math.min(...item.celles.map((q) => q.ny)) + 1) * c;
  return embolcall(w, h,
    cubTransparent(52, h / 2 + 26, item, 30)
    + desplegable(w - ampla - 12, (h - alta) / 2, item, c));
}

export function svgOpcio(item, i, w = 50) {
  return embolcall(w, w,
    `<g transform="matrix(${w} 0 0 ${w} 0 0)">${figuraSvg(item.opcions[i], 0.075)}</g>`);
}

export function svgFull(items) {
  const alt = 174;
  const X0 = 14 + MIDA_ENUNCIAT.w + 34;
  const cos = items.map((it, i) => {
    const y = i * alt;
    const op = it.opcions.map((_, k) => {
      const x = X0 + k * 72;
      return `<g transform="translate(${x} ${y + 44})">`
        + svgOpcio(it, k).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>'
        + `<text x="${x + 25}" y="${y + 114}" text-anchor="middle" `
        + `font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" `
        + `font-weight="700" fill="${NEGRE}">${'ABCD'[k]}</text>`;
    }).join('');
    return `<g><text x="16" y="${y + 22}" font-family="ui-sans-serif,system-ui,sans-serif"`
      + ` font-size="13" fill="${NEGRE}"><tspan font-weight="700">${i + 1}.</tspan>`
      + ' Quina cara correspon a l\'interrogant?</text>'
      + `<g transform="translate(14 ${y + 28})">`
      + svgEnunciat(it).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>' + op + '</g>';
  }).join('');
  const w = X0 + 3 * 72 + 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" `
    + `height="${items.length * alt + 24}" viewBox="0 0 ${w} ${items.length * alt + 24}">`
    + `<rect width="100%" height="100%" fill="#fff"/>${cos}</svg>`;
}
