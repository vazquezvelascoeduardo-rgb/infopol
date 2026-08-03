// Bateria abstracte: la matriu de figures de línia.
//
// La regla, treta del material de l'acadèmia (sessió 5, exercici 2): a cada
// fila, el TERCER quadre porta els elements que surten a UN dels dos
// primers i no als dos. És un o-exclusiu.
//
//   (rodona + ratlla vertical) i (rodona + ratlla horitzontal)
//     → la rodona hi és als dos i marxa; queden les dues ratlles: una creu.
//   (rombe + creu) i (creu)
//     → la creu hi és als dos i marxa; queda el rombe.
//
// Als exàmens n'hi ha CINC opcions, de la a a la e, no quatre.
//
// El perill d'aquesta família és que la matriu tingui dues explicacions
// bones —la unió i l'o-exclusiu coincideixen si els dos quadres no
// comparteixen mai res— i aleshores l'ítem no té resposta. Per evitar-ho
// es prova tot el catàleg de regles contra les tres files, i si n'hi ha
// dues que hi encaixen, l'ítem es llença.

function rng(seed) {
  let s = (seed * 2246822519) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
import { posicioBona } from './atzar.mjs';

const tria = (r, a) => a[Math.floor(r() * a.length)];

function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ── Els elements ─────────────────────────────────────────────────
// Figures de línia, sense farcit, que es poden superposar sense tapar-se.
export const ELEMENTS = [
  'cercle', 'quadrat', 'rombe', 'vertical', 'horitzontal', 'diagonal', 'antidiagonal', 'punt',
];

/** Una casella és un conjunt d'elements. Es guarda ordenat per comparar-lo. */
export const clau = (conj) => ELEMENTS.filter((e) => conj.includes(e)).join('+') || '(buit)';
const iguals = (a, b) => clau(a) === clau(b);

// ── Les regles candidates ────────────────────────────────────────
// Només una ha d'explicar les tres files. Si n'hi ha dues, fora.
const REGLES = {
  xor: (a, b) => [...a.filter((e) => !b.includes(e)), ...b.filter((e) => !a.includes(e))],
  unio: (a, b) => [...new Set([...a, ...b])],
  interseccio: (a, b) => a.filter((e) => b.includes(e)),
  nomesA: (a) => [...a],
  nomesB: (a, b) => [...b],
  aMenysB: (a, b) => a.filter((e) => !b.includes(e)),
  bMenysA: (a, b) => b.filter((e) => !a.includes(e)),
};

/** Quines regles expliquen totes les files. */
export function reglesQueExpliquen(files) {
  return Object.keys(REGLES).filter((nom) =>
    files.every((f) => iguals(REGLES[nom](f[0], f[1]), f[2])));
}

// ── Generació ────────────────────────────────────────────────────
function fila(r, compartir) {
  const bossa = barreja(r, ELEMENTS);
  const comuns = compartir ? bossa.slice(0, 1 + Math.floor(r() * 2)) : [];
  const resta = bossa.slice(comuns.length);
  const nA = 1 + Math.floor(r() * 2);
  const nB = 1 + Math.floor(r() * 2);
  const soloA = resta.slice(0, nA);
  const soloB = resta.slice(nA, nA + nB);
  if (soloB.length < nB) return null;
  const a = [...comuns, ...soloA];
  const b = [...comuns, ...soloB];
  const c = [...soloA, ...soloB];
  if (c.length < 1 || c.length > 3) return null;
  if (a.length > 3 || b.length > 3) return null;
  return [a, b, c];
}

export function generaItem(seed) {
  const r = rng(seed);
  for (let intent = 0; intent < 600; intent++) {
    // Almenys dues files han de compartir elements: si no en compartissin
    // cap, la unió i l'o-exclusiu donarien el mateix i hi hauria dues
    // explicacions bones.
    const compartir = barreja(r, [true, true, r() < 0.5]);
    const files = [];
    for (let i = 0; i < 3; i++) {
      const f = fila(r, compartir[i]);
      if (!f) break;
      files.push(f);
    }
    if (files.length < 3) continue;

    // Les nou caselles no s'han de repetir: si no, es veu a ull.
    const totes = files.flat().map(clau);
    if (new Set(totes).size !== 9) continue;

    const explica = reglesQueExpliquen(files);
    if (explica.length !== 1 || explica[0] !== 'xor') continue;

    // La bona és la tercera de l'última fila; les altres, regles torçades.
    const [a, b, bona] = files[2];
    const cands = [
      { c: REGLES.unio(a, b), error: 'ajuntar-ho tot' },
      { c: REGLES.interseccio(a, b), error: 'quedar-se només amb el que es repeteix' },
      { c: a, error: 'copiar el primer quadre' },
      { c: b, error: 'copiar el segon quadre' },
      { c: REGLES.aMenysB(a, b), error: 'treure del primer el que hi ha al segon' },
      { c: REGLES.bMenysA(a, b), error: 'treure del segon el que hi ha al primer' },
      { c: [...bona, tria(r, ELEMENTS.filter((e) => !bona.includes(e)))], error: 'un element de més' },
      { c: bona.slice(0, -1), error: 'un element de menys' },
    ];
    const dolents = [];
    for (const cand of barreja(r, cands)) {
      if (cand.c.length === 0 || cand.c.length > 4) continue;
      if (iguals(cand.c, bona)) continue;
      if (dolents.some((d) => iguals(d.c, cand.c))) continue;
      dolents.push(cand);
      if (dolents.length === 4) break;
    }
    if (dolents.length < 4) continue;

    const correcta = posicioBona(seed, 5, 'abstracte');
    const opcions = [];
    let d = 0;
    for (let i = 0; i < 5; i++) opcions.push(i === correcta ? bona : dolents[d++].c);

    return {
      seed, files, opcions, correcta,
      perque: dolents.map((x) => x.error),
      control: {
        unaSolaRegla: explica.length === 1,
        laReglaEsXor: explica[0] === 'xor',
        // Cada fila, comprovada a part de com s'ha construït.
        totesLesFilesCompleixen: files.every((f) => iguals(REGLES.xor(f[0], f[1]), f[2])),
        cincOpcionsDiferents: new Set(opcions.map(clau)).size === 5,
        nomesUnaEsLaBona: opcions.filter((o) => iguals(o, bona)).length === 1,
        capCasellaRepetida: new Set(totes).size === 9,
        filesQueComparteixen: files.filter((f) => f[0].some((e) => f[1].includes(e))).length,
      },
    };
  }
  throw new Error(`no s'ha pogut generar la matriu ${seed}`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#15151C';

/** Un element dins del quadre unitat. Tot són línies, res de farcit. */
function element(nom) {
  const l = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${NEGRE}" stroke-width="0.045"/>`;
  switch (nom) {
    case 'cercle': return `<circle cx="0.5" cy="0.5" r="0.37" fill="none" stroke="${NEGRE}" stroke-width="0.045"/>`;
    case 'punt': return `<circle cx="0.5" cy="0.5" r="0.13" fill="none" stroke="${NEGRE}" stroke-width="0.045"/>`;
    case 'quadrat': return `<rect x="0.15" y="0.15" width="0.7" height="0.7" fill="none" stroke="${NEGRE}" stroke-width="0.045"/>`;
    case 'rombe': return `<polygon points="0.5,0.09 0.91,0.5 0.5,0.91 0.09,0.5" fill="none" stroke="${NEGRE}" stroke-width="0.045"/>`;
    case 'vertical': return l(0.5, 0.06, 0.5, 0.94);
    case 'horitzontal': return l(0.06, 0.5, 0.94, 0.5);
    case 'diagonal': return l(0.12, 0.12, 0.88, 0.88);
    default: return l(0.88, 0.12, 0.12, 0.88);      // antidiagonal
  }
}

/** Una casella: el marc i el que hi ha dins. */
function casella(x, y, conj, c) {
  return `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.3"/>`
    + `<g transform="matrix(${c} 0 0 ${c} ${x} ${y})">${conj.map(element).join('')}</g>`;
}

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

export function svgItem(item, num, y0 = 0) {
  const c = 46, x0 = 20;
  const matriu = item.files.map((f, i) => f.map((conj, j) => {
    const x = x0 + j * c, y = y0 + 34 + i * c;
    // L'última casella és la incògnita.
    if (i === 2 && j === 2) {
      return `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.3"/>`
        + txt(x + c / 2, y + c * 0.68, '?', 26, 700, 'middle');
    }
    return casella(x, y, conj, c);
  }).join('')).join('');

  const opcions = item.opcions.map((o, i) => {
    const x = x0 + 190 + i * (c + 16);
    return casella(x, y0 + 60, o, c)
      + txt(x + c / 2, y0 + 60 + c + 16, `${'abcde'[i]})`, 12, 700, 'middle');
  }).join('');

  return `<g>${txt(x0, y0 + 22, `<tspan font-weight="700">${num}.</tspan> Trieu la imatge que completa millor la matriu:`)}
  ${matriu}${opcions}</g>`;
}

export function svgFull(items) {
  const alt = 200;
  const cos = items.map((it, i) => svgItem(it, i + 1, i * alt)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="530" height="${items.length * alt + 20}" viewBox="0 0 530 ${items.length * alt + 20}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per peces, per a l'app ────────────────────────────────
// A la pantalla d'un mòbil l'enunciat i cada opció han d'anar per separat:
// les opcions són botons, i un sol SVG gegant no es podria prémer.
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%">${cos}</svg>`;

export function svgEnunciat(item, c = 54) {
  const cos = item.files.map((f, i) => f.map((conj, j) => {
    if (i === 2 && j === 2) {
      return `<rect x="${j * c}" y="${i * c}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.4"/>`
        + txt(j * c + c / 2, i * c + c * 0.68, '?', c * 0.55, 700, 'middle');
    }
    return casella(j * c, i * c, conj, c);
  }).join('')).join('');
  return embolcall(3 * c, 3 * c, cos);
}

export function svgOpcio(item, i, c = 54) {
  return embolcall(c, c, casella(0, 0, item.opcions[i], c));
}
