// Atenció i rapidesa: comptar símbols i comprovar correspondències.
//
// Al Mossos 2022 aquestes dues famílies són el bloc més gran de tots —vuit
// preguntes de comptar i dues de correspondències de les quaranta-sis
// primeres— i no mesuren enginy, mesuren velocitat: vuitanta preguntes en
// trenta-cinc minuts són vint-i-sis segons cadascuna.
//
// Els símbols estan triats per assemblar-se de dos en dos: la ema i la ena,
// i les mateixes amb cua. Si fossin fàcils de distingir, l'exercici no
// mesuraria res.
//
// És l'única família on la resposta no s'ha de deduir: es compta. Per això
// es fabrica al revés —es decideix primer quants n'hi ha d'haver i després
// es col·loquen—, i les proves ho compten a part per veure si quadra.

import { posicioBona } from './atzar.mjs';

function rng(seed) {
  let s = (seed * 2891336453) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const entre = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const tria = (r, a) => a[Math.floor(r() * a.length)];
function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const NEGRE = '#15151C';

// ── Comptar símbols ──────────────────────────────────────────────
export const SIMBOLS = ['m', 'n', 'mc', 'nc'];   // les dues amb cua són 'mc' i 'nc'
export const IGUALS = 'iguals';
export const DIFERENTS = 'diferents';

/**
 * `mena` és IGUALS ("quants n'hi ha iguals a aquest") o DIFERENTS
 * ("quants n'hi ha de diferents").
 */
export function generaComptatge(seed, mena = IGUALS) {
  const r = rng(seed);
  const files = entre(r, 2, 3);
  const columnes = 20;
  const total = files * columnes;
  const objectiu = tria(r, SIMBOLS);

  // Primer es decideix quants n'hi ha d'haver, i després es reparteixen.
  // Fet al revés —col·locar i després comptar— seria fàcil descomptar-se.
  const quants = entre(r, Math.round(total * 0.3), Math.round(total * 0.55));
  const altres = SIMBOLS.filter((s) => s !== objectiu);
  const bossa = [];
  for (let i = 0; i < quants; i++) bossa.push(objectiu);
  for (let i = quants; i < total; i++) bossa.push(tria(r, altres));
  const plana = barreja(r, bossa);
  const graella = [];
  for (let f = 0; f < files; f++) graella.push(plana.slice(f * columnes, (f + 1) * columnes));

  const bona = mena === IGUALS ? quants : total - quants;

  // Distractors: descomptar-se de poc, o comptar el que no toca.
  const cands = [bona + 1, bona - 1, bona + 2, bona - 2, bona + 3, total - bona, bona + 4]
    .filter((x) => x > 0 && x <= total && x !== bona);
  const dolents = [];
  for (const c of barreja(r, cands)) {
    if (dolents.includes(c)) continue;
    dolents.push(c);
    if (dolents.length === 3) break;
  }
  if (dolents.length < 3) return generaComptatge(seed + 7919, mena);

  const correcta = posicioBona(seed, 4, 'comptatge');
  const opcions = [];
  let d = 0;
  for (let i = 0; i < 4; i++) opcions.push(i === correcta ? bona : dolents[d++]);

  // El recompte, fet a part de com s'ha construït.
  const recompte = graella.flat().filter((s) => s === objectiu).length;

  return {
    seed, mena, objectiu, graella, opcions, correcta,
    control: {
      totalQuadra: graella.flat().length === total,
      recompteQuadra: recompte === quants,
      respostaQuadra: (mena === IGUALS ? recompte : total - recompte) === opcions[correcta],
      opcionsDiferents: new Set(opcions).size === 4,
      dinsDeRang: opcions.every((o) => o > 0 && o <= total),
    },
  };
}

// ── Correspondències ─────────────────────────────────────────────
// Una taula que diu quin número li toca a cada símbol, i una segona taula
// per comprovar. Es demana quantes n'hi ha de correctes o d'incorrectes.
export const GREGUES = ['Ω', 'Φ', 'Θ', 'Ψ', 'Σ', 'Λ', 'Ξ', 'Π'];
export const CORRECTES = 'correctes';
export const INCORRECTES = 'incorrectes';

export function generaCorrespondencies(seed, mena = CORRECTES) {
  const r = rng(seed * 31 + 17);
  const quants = entre(r, 4, 6);
  const simbols = barreja(r, GREGUES).slice(0, quants);
  const taula = simbols.map((s, i) => ({ simbol: s, num: i + 1 }));
  const correcte = Object.fromEntries(taula.map((t) => [t.simbol, t.num]));

  const caselles = entre(r, 8, 10);
  const encerts = entre(r, 2, caselles - 2);
  // Es decideix quantes n'han de ser correctes i després es fabriquen.
  const plan = barreja(r, [
    ...Array(encerts).fill(true), ...Array(caselles - encerts).fill(false),
  ]);
  const prova = plan.map((ok) => {
    const s = tria(r, simbols);
    if (ok) return { simbol: s, num: correcte[s] };
    const altres = taula.map((t) => t.num).filter((n) => n !== correcte[s]);
    return { simbol: s, num: tria(r, altres) };
  });

  const bones = prova.filter((p) => p.num === correcte[p.simbol]).length;
  const bona = mena === CORRECTES ? bones : caselles - bones;

  const cands = [bona + 1, bona - 1, bona + 2, bona - 2, caselles - bona, bona + 3]
    .filter((x) => x >= 0 && x <= caselles && x !== bona);
  const dolents = [];
  for (const c of barreja(r, cands)) {
    if (dolents.includes(c)) continue;
    dolents.push(c);
    if (dolents.length === 3) break;
  }
  if (dolents.length < 3) return generaCorrespondencies(seed + 5231, mena);

  const correcta = posicioBona(seed, 4, 'correspondencies');
  const opcions = [];
  let d = 0;
  for (let i = 0; i < 4; i++) opcions.push(i === correcta ? bona : dolents[d++]);

  return {
    seed, mena, taula, prova, opcions, correcta,
    control: {
      encertsQuadren: bones === encerts,
      respostaQuadra: (mena === CORRECTES ? bones : caselles - bones) === opcions[correcta],
      opcionsDiferents: new Set(opcions).size === 4,
      totsElsSimbolsSonDeLaTaula: prova.every((p) => correcte[p.simbol] !== undefined),
      totsElsNumerosSonDeLaTaula: prova.every((p) => taula.some((t) => t.num === p.num)),
    },
  };
}

// ── Dibuix ───────────────────────────────────────────────────────
/** Els quatre símbols. La cua és el que els fa costar de distingir. */
function simbol(x, y, quin, mida = 15) {
  const lletra = quin[0];                       // 'm' o 'n'
  const cua = quin.length > 1;
  const t = `<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif"`
    + ` font-style="italic" font-size="${mida}" fill="${NEGRE}">${lletra}</text>`;
  if (!cua) return t;
  // Una cueta que baixa a la dreta del traç final.
  const dx = mida * 0.26, dy = mida * 0.1;
  return t + `<path d="M ${x + dx} ${y - dy} q ${mida * 0.09} ${mida * 0.24} `
    + `${-mida * 0.12} ${mida * 0.3}" fill="none" stroke="${NEGRE}" stroke-width="1.1"/>`;
}

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

const caixa = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`;

export function svgComptatge(item, num, y0 = 0) {
  const c = 25, x0 = 16;
  const pregunta = item.mena === IGUALS
    ? 'Quants símbols iguals a aquest'
    : 'Quants símbols diferents a aquest';
  const ampleText = 8 + String(num).length * 7 + pregunta.length * 6.1;
  const cap = txt(x0, y0 + 24, `<tspan font-weight="700">${num}.</tspan> ${pregunta}`)
    + caixa(x0 + ampleText, y0 + 11, 20, 18)
    + simbol(x0 + ampleText + 10, y0 + 25, item.objectiu)
    + txt(x0 + ampleText + 26, y0 + 24, 'hi ha en la següent sèrie?');

  const graella = item.graella.map((fila, f) => fila.map((s, i) => {
    const x = x0 + i * c, y = y0 + 36 + f * c;
    return caixa(x, y, c, c) + simbol(x + c / 2, y + c * 0.68, s);
  }).join('')).join('');

  const yOp = y0 + 36 + item.graella.length * c + 20;
  const opcions = item.opcions.map((o, i) =>
    txt(x0 + 20 + i * 120, yOp, `${'abcd'[i]}) ${o}`)).join('');
  return `<g>${cap}${graella}${opcions}</g>`;
}

export function svgCorrespondencies(item, num, y0 = 0) {
  const c = 34, x0 = 16;
  const ref = item.taula.map((t, i) => {
    const x = x0 + 120 + i * c;
    return caixa(x, y0 + 34, c, 20) + `<text x="${x + c / 2}" y="${y0 + 49}" text-anchor="middle"`
      + ` font-family="Georgia,serif" font-size="14" fill="${NEGRE}">${t.simbol}</text>`
      + caixa(x, y0 + 54, c, 20) + txt(x + c / 2, y0 + 69, `${t.num}`, 13, 400, 'middle');
  }).join('');

  const pr = item.prova.map((p, i) => {
    const x = x0 + 120 + i * c;
    return caixa(x, y0 + 96, c, 20) + `<text x="${x + c / 2}" y="${y0 + 111}" text-anchor="middle"`
      + ` font-family="Georgia,serif" font-size="14" fill="${NEGRE}">${p.simbol}</text>`
      + caixa(x, y0 + 116, c, 20) + txt(x + c / 2, y0 + 131, `${p.num}`, 13, 400, 'middle');
  }).join('');

  const quines = item.mena === CORRECTES
    ? '<tspan font-weight="700">CORRECTES</tspan>' : '<tspan font-weight="700">INCORRECTES</tspan>';
  const opcions = item.opcions.map((o, i) =>
    txt(x0 + 20 + i * 120, y0 + 158, `${'abcd'[i]}) ${o}`)).join('');
  return `<g>${txt(x0, y0 + 22, `<tspan font-weight="700">${num}.</tspan> Quantes correspondències ${quines} hi ha en la segona taula?`)}
  ${txt(x0, y0 + 50, 'referència', 10, 600)}${ref}
  ${txt(x0, y0 + 112, 'a comprovar', 10, 600)}${pr}${opcions}</g>`;
}

export function svgFull(items) {
  let y = 10;
  const cos = items.map((it, i) => {
    const esComptatge = !!it.graella;
    const alt = esComptatge ? 60 + it.graella.length * 25 + 40 : 180;
    const s = esComptatge ? svgComptatge(it, i + 1, y) : svgCorrespondencies(it, i + 1, y);
    y += alt;
    return s;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="${y + 20}" viewBox="0 0 560 ${y + 20}">
  <rect preserveAspectRatio="xMidYMid meet" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per a l'app ───────────────────────────────────────────
// Aquestes dues famílies tenen les opcions en números, o sigui que només
// cal dibuixar l'enunciat.
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

export function svgEnunciat(item) {
  if (item.graella) {
    const c = 25, files = item.graella.length;
    const cos = item.graella.map((fila, f) => fila.map((s, i) =>
      caixa(i * c, f * c, c, c) + simbol(i * c + c / 2, f * c + c * 0.68, s)).join('')).join('');
    return embolcall(20 * c, files * c, cos);
  }
  const c = 34, w = Math.max(item.taula.length, item.prova.length) * c;
  const fila = (llista, y) => llista.map((p, i) =>
    caixa(i * c, y, c, 20)
    + `<text x="${i * c + c / 2}" y="${y + 15}" text-anchor="middle" font-family="Georgia,serif"`
    + ` font-size="14" fill="${NEGRE}">${p.simbol}</text>`
    + caixa(i * c, y + 20, c, 20) + txt(i * c + c / 2, y + 35, `${p.num}`, 13, 400, 'middle')).join('');
  // Alt: 14 + 40 de la primera taula, 76 + 40 de la segona, i dos de coixí.
  return embolcall(w, 118, txt(0, 10, 'referència', 10, 600) + fila(item.taula, 14)
    + txt(0, 72, 'a comprovar', 10, 600) + fila(item.prova, 76));
}

/** El símbol que es demana, per posar-lo dins de l'enunciat. */
export const svgObjectiu = (item) =>
  embolcall(22, 22, caixa(1, 1, 20, 20) + simbol(11, 16, item.objectiu));
