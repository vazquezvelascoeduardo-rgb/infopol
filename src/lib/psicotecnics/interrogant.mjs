// «Quina cara correspon a l'interrogant?»
//
// Es veu un cub muntat, amb tres cares a la vista, i al costat un
// desplegable del mateix cub amb tres caselles dibuixades, un interrogant i
// dues en blanc. Cal dir quina figura va a l'interrogant, I COM ESTÀ GIRADA.
//
// ── El gir de cada cara ─────────────────────────────────────────
//
// Això és el que fa l'exercici, i la primera versió no ho tenia: dibuixava
// les figures del cub totes dretes, sense el gir que els toca en plegar. Amb
// el desplegable a la mà les arestes no quadraven. L'Eduardo ho va dir: «las
// caras no están orientadas bien para cuando se hace el despliegue; tienes
// que contar cómo gira las caras y cada una cómo se gira».
//
// Ara el gir surt del motor de plegar, que ja sap dir, per a cada manera de
// girar el cub, quina cara queda a cada lloc i amb quants quarts de volta.
// Al desplegable les figures van dretes; al cub, girades com toca.
//
// Per això les figures són totes de gairell —una ela, un escaire, una
// bandera, un ganxo— i cap no és rodona ni simètrica. Si ho fossin, girar-
// les no es veuria i l'exercici no tindria on agafar-se. Es comprova una per
// una que les vuit maneres de posar-les es vegin diferents.
//
// I les respostes són la figura amb el seu gir: entre les quatre n'hi ha
// alguna que és la figura bona MAL GIRADA, que és l'errada de qui plega bé
// però no compta els quarts de volta.
//
// ── Quantes caselles s'han de dibuixar, i quines ─────────────────
//
// Això no ho vaig endevinar: ho vaig comptar. Es van provar totes les
// combinacions de caselles dibuixades sobre totes les maneres de girar el
// cub, i només n'hi ha una que funcioni:
//
//   TRES caselles dibuixades, de les quals EXACTAMENT UNA es vegi al cub.
//
//   · Amb menys de tres, la resposta no és única. L'ancora que es veu diu
//     quina cara és, però encara queden quatre maneres de girar el cub al
//     seu voltant, i fan falta les altres dues —que van a parar al darrere—
//     per acabar de lligar-ho.
//   · Si se'n veiessin dues, hi hauria drecera: les cares que es veuen són
//     tres, i si dues estiguessin dibuixades, l'interrogant seria per força
//     la tercera sense haver de plegar res. Per això se n'exigeixen dues de
//     visibles SENSE dibuixar.
import { barreja, posicioBona, rng, tria } from './atzar.mjs';
import { orientacions, plega, valid, vistaDe, FORMES } from './plegat.mjs';
import { COLORS } from './ruleta.mjs';

const NEGRE = '#15151C';

// ── Les figures ─────────────────────────────────────────────────
// Totes de gairell, cap simètrica: girar-les s'ha de veure. Van escrites
// com una llista de vèrtexs dins d'un quadrat de costat 1.
export const FIGURES = {
  ela: [[0.24, 0.14], [0.46, 0.14], [0.46, 0.62], [0.84, 0.62], [0.84, 0.86], [0.24, 0.86]],
  escaire: [[0.16, 0.16], [0.86, 0.84], [0.16, 0.84]],
  bandera: [[0.26, 0.10], [0.38, 0.10], [0.38, 0.20], [0.86, 0.34],
    [0.38, 0.50], [0.38, 0.90], [0.26, 0.90]],
  ganxo: [[0.18, 0.16], [0.82, 0.16], [0.82, 0.80], [0.58, 0.80], [0.58, 0.40],
    [0.42, 0.40], [0.42, 0.62], [0.18, 0.62]],
  pastilla: [[0.18, 0.20], [0.62, 0.20], [0.84, 0.42], [0.84, 0.84], [0.18, 0.84]],
  fletxa: [[0.14, 0.52], [0.52, 0.14], [0.52, 0.34], [0.86, 0.34],
    [0.86, 0.60], [0.52, 0.60], [0.52, 0.82]],
  peu: [[0.28, 0.12], [0.48, 0.12], [0.48, 0.60], [0.82, 0.68], [0.84, 0.88], [0.28, 0.88]],
};

/** Els vèrtexs d'una figura girada q quarts de volta dins del seu quadrat. */
export function vertexs(forma, q) {
  let p = FIGURES[forma];
  for (let i = 0; i < ((q % 4) + 4) % 4; i++) p = p.map(([x, y]) => [1 - y, x]);
  return p;
}

/** El repertori: cada figura de cada color. */
const REPERTORI = [];
for (const forma of Object.keys(FIGURES)) {
  for (const c of COLORS) REPERTORI.push({ forma, color: c.id });
}

const noms = (s) => `${s.forma}/${s.color}`;
const ambGir = (s) => `${s.forma}/${s.color}@${s.gir}`;
const pinta = (id) => (COLORS.find((c) => c.id === id) || COLORS[0]).pinta;

// ── Fer un ítem ──────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed, 17);

  for (let intent = 0; intent < 300; intent++) {
    // El desplegable. El `dibuix` de cada casella és la seva pròpia clau:
    // així el plegat surt de la forma i prou, i les figures s'hi posen
    // després. Plegar una vegada val per a totes les proves que vindran.
    const forma = tria(r, Object.keys(FORMES));
    const celles = FORMES[forma].map(([nx, ny]) => ({ nx, ny, dibuix: `${nx},${ny}` }));
    const cares = plega(celles);
    if (!valid(cares)) continue;
    const cub = [...cares.values()];

    // Per a cadascuna de les 24 maneres de girar el cub: quina casella queda
    // a dalt, a l'esquerra i a la dreta, i amb quants quarts de volta. Això
    // ho diu el motor, i és el mateix que fan servir els cubs desplegats.
    const mirades = orientacions(cub).map((o) => vistaDe(o).map((t) => {
      const [k, q] = t.split('@');
      return { casella: k, gir: Number(q) };
    }));

    const laVista = tria(r, mirades);

    // Sis figures diferents, una per casella.
    const figures = barreja(r, REPERTORI).slice(0, 6);
    const simbol = {};
    celles.forEach((c, i) => { simbol[c.dibuix] = figures[i]; });

    // L'interrogant, en una casella que es vegi al cub: si anés a una cara
    // del darrere, la figura no es podria saber de cap manera.
    const on = entre3(r);
    const forat = laVista[on].casella;

    // Tres ancores, exactament una de visible.
    const altres = celles.map((c) => c.dibuix).filter((k) => k !== forat);
    const ancores = barreja(r, altres).slice(0, 3);
    const visiblesAncorades = ancores.filter((k) => laVista.some((v) => v.casella === k));
    if (visiblesAncorades.length !== 1) continue;
    if (laVista.filter((v) => !ancores.includes(v.casella)).length < 2) continue;

    const possibles = respostes({ mirades, laVista, ancores, simbol, forat });
    if (possibles === null || possibles.size !== 1) continue;

    // La bona: la figura del forat, amb el gir que li toca al cub.
    const bona = { ...simbol[forat], gir: laVista[on].gir };
    if (!possibles.has(ambGir(bona))) continue;

    // Els distractors. Un és sempre la figura BONA MAL GIRADA: és l'errada
    // de qui plega bé però no compta els quarts de volta, i sense ella
    // l'exercici es respondria sense mirar com està posada la figura.
    const malGirada = { ...simbol[forat], gir: (bona.gir + 1 + Math.floor(r() * 3)) % 4 };
    // Els altres dos, figures que NO surten dibuixades al desplegable: si
    // n'hi sortís cap, es descartaria de seguida, perquè dues cares d'un cub
    // no porten mai la mateixa figura.
    const dibuixades = new Set(ancores.map((k) => noms(simbol[k])));
    const cands = barreja(r, REPERTORI)
      .filter((f) => noms(f) !== noms(bona) && !dibuixades.has(noms(f)))
      .slice(0, 2)
      .map((f) => ({ ...f, gir: Math.floor(r() * 4) }));
    if (cands.length < 2) continue;

    const totes = [bona, malGirada, ...cands];
    if (new Set(totes.map(ambGir)).size !== 4) continue;

    const desti = posicioBona(seed, 4, 'interrogant');
    const opcions = totes.slice(1);
    opcions.splice(desti, 0, bona);

    return {
      seed, forma, celles, ancores, forat, simbol, laVista,
      opcions,
      correcta: desti,
      control: {
        elForatEsVeu: laVista.some((v) => v.casella === forat),
        capAncoraAlForat: !ancores.includes(forat),
        tresAncores: ancores.length === 3,
        nomesUnaAncoraEsVeu: visiblesAncorades.length === 1,
        quedenDuesCaresVisiblesSenseDibuixar:
          laVista.filter((v) => !ancores.includes(v.casella)).length >= 2,
        respostaUnica: possibles.size === 1,
        sisFiguresDiferents: new Set(celles.map((c) => noms(simbol[c.dibuix]))).size === 6,
        hiHaLaBonaMalGirada: opcions.some((o) =>
          noms(o) === noms(bona) && o.gir !== bona.gir),
        capOpcioJaDibuixada: opcions.every((o) =>
          noms(o) === noms(bona) || !dibuixades.has(noms(o))),
      },
    };
  }
  return null;
}

const entre3 = (r) => Math.floor(r() * 3);

/**
 * Què podria anar a l'interrogant, mirant només el que es veu.
 *
 * Es proven les 24 maneres de girar el cub. Una serveix si, a les tres
 * posicions que es veuen, hi cau el que toca: on hi ha una casella ancorada
 * hi ha d'anar la seva figura I amb el gir que es veu al cub, i on n'hi ha
 * una de lliure hi ha d'anar una figura que NO estigui ancorada —una figura
 * ancorada ja té el seu lloc i no pot sortir en dos llocs alhora.
 *
 * Torna null si en alguna manera que serveix l'interrogant queda fora de la
 * vista: llavors la seva figura no es podria saber i l'ítem no val.
 */
function respostes({ mirades, laVista, ancores, simbol, forat }) {
  const ancorades = new Set(ancores.map((k) => noms(simbol[k])));
  const veig = laVista.map((v) => ({ figura: simbol[v.casella], gir: v.gir }));
  const fora = new Set();
  for (const t of mirades) {
    let va = true;
    for (let i = 0; i < 3 && va; i++) {
      if (ancores.includes(t[i].casella)) {
        va = noms(simbol[t[i].casella]) === noms(veig[i].figura) && t[i].gir === veig[i].gir;
      } else {
        va = !ancorades.has(noms(veig[i].figura));
      }
    }
    if (!va) continue;
    const quin = t.findIndex((v) => v.casella === forat);
    if (quin === -1) return null;
    fora.add(ambGir({ ...veig[quin].figura, gir: veig[quin].gir }));
  }
  return fora;
}

// ── El dibuix ────────────────────────────────────────────────────
/** Una figura dins d'un quadrat de costat 1, girada q quarts de volta. */
function figuraUnitat(s, gir = 0) {
  const p = vertexs(s.forma, gir);
  return `<polygon points="${p.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(' ')}"`
    + ` fill="none" stroke="${pinta(s.color)}" stroke-width="0.085"`
    + ` stroke-linejoin="round"/>`;
}

/** El cub muntat, amb les tres cares que es veuen i cadascuna amb el seu gir. */
function cubMuntat(cx, cy, item, s) {
  const K = Math.cos(Math.PI / 6);
  const proj = (p) => ({ x: cx + (p[0] - p[2]) * K * s, y: cy + (p[0] + p[2]) * 0.5 * s - p[1] * s });
  const su = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  // Els mateixos marcs que fa servir el motor per dir el gir de cada cara.
  const REF = [
    { o: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },   // dalt
    { o: [0, 1, 1], u: [1, 0, 0], v: [0, -1, 0] },  // esquerra
    { o: [1, 1, 1], u: [0, 0, -1], v: [0, -1, 0] }, // dreta
  ];
  return REF.map((c, i) => {
    const O = proj(c.o), A = proj(su(c.o, c.u)), B = proj(su(c.o, c.v));
    const C = proj(su(su(c.o, c.u), c.v));
    const pts = [O, A, C, B].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    // La matriu porta el quadrat de costat 1 al paral·lelogram de la cara,
    // o sigui que la figura es pot dibuixar com si fos plana.
    const m = `matrix(${(A.x - O.x).toFixed(4)} ${(A.y - O.y).toFixed(4)} `
      + `${(B.x - O.x).toFixed(4)} ${(B.y - O.y).toFixed(4)} `
      + `${O.x.toFixed(3)} ${O.y.toFixed(3)})`;
    const v = item.laVista[i];
    return `<polygon points="${pts}" fill="#fff"/>`
      + `<g transform="${m}">${figuraUnitat(item.simbol[v.casella], v.gir)}</g>`
      + `<polygon points="${pts}" fill="none" stroke="${NEGRE}" stroke-width="1.5" `
      + `stroke-linejoin="round"/>`;
  }).join('');
}

/** El desplegable. Les figures dibuixades hi van dretes: és el paper. */
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
        + `${figuraUnitat(item.simbol[ce.dibuix], 0)}</g>`;
    }
    return `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff"/>${dins}`
      + `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="none" `
      + `stroke="${NEGRE}" stroke-width="1.5"/>`;
  }).join('');
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" `
  + `preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

export const MIDA_ENUNCIAT = { w: 258, h: 132 };

export function svgEnunciat(item) {
  const { w, h } = MIDA_ENUNCIAT;
  const c = 30;
  const ampla = (Math.max(...item.celles.map((q) => q.nx))
    - Math.min(...item.celles.map((q) => q.nx)) + 1) * c;
  const alta = (Math.max(...item.celles.map((q) => q.ny))
    - Math.min(...item.celles.map((q) => q.ny)) + 1) * c;
  return embolcall(w, h,
    cubMuntat(48, h / 2 + 24, item, 30)
    + desplegable(w - ampla - 12, (h - alta) / 2, item, c));
}

export function svgOpcio(item, i, w = 50) {
  const o = item.opcions[i];
  return embolcall(w, w,
    `<g transform="matrix(${w} 0 0 ${w} 0 0)">${figuraUnitat(o, o.gir)}</g>`);
}

export function svgFull(items) {
  const alt = 168;
  const X0 = 14 + MIDA_ENUNCIAT.w + 34;
  const cos = items.map((it, i) => {
    const y = i * alt;
    const op = it.opcions.map((_, k) => {
      const x = X0 + k * 72;
      return `<g transform="translate(${x} ${y + 42})">`
        + svgOpcio(it, k).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>'
        + `<text x="${x + 25}" y="${y + 110}" text-anchor="middle" `
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
