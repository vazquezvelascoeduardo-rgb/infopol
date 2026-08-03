// "Quina de les quatre imatges següents es correspon amb el model de
//  l'esquerra?"
//
// Un disc amb coses a dins i una fletxa a fora que diu com està posat. Les
// quatre opcions són el mateix disc girat, cadascuna amb la seva fletxa:
// cal girar-lo mentalment fins que les fletxes coincideixin i mirar si el
// que hi ha a dins queda igual.
//
// La fletxa és el que fa que l'exercici tingui sentit. Sense ella, un disc
// girat i un disc reflectit es podrien confondre; amb ella, n'hi ha prou
// d'alinear-la i comparar. I això és exactament el que fa el programa per
// comprovar-ho: normalitza el contingut respecte de la fletxa. Dos discs
// són el mateix si, un cop alineats, el que hi ha a dins coincideix.
//
// Els distractors són reflexos, no girs. Un reflex no es pot fer coincidir
// per molt que el giris —sempre que el contingut no sigui simètric, i això
// també es comprova— i per tant només una opció respon.
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

const POSICIONS = 12;                 // les hores del rellotge
const NEGRE = '#15151C';
const GRIS = '#b9bec4';

// ── El disc ──────────────────────────────────────────────────────
// Tot va en posicions de rellotge: la 0 és a dalt i cada pas són 30°.
export const TIPUS = ['hexagon', 'rodona', 'caixa'];

const mod = (n) => ((n % POSICIONS) + POSICIONS) % POSICIONS;

/** Girar-ho tot k passos: el que hi ha a dins i la fletxa alhora. */
export function gira(disc, k) {
  return {
    fletxa: mod(disc.fletxa + k),
    banda: { ...disc.banda, pos: mod(disc.banda.pos + k) },
    elements: disc.elements.map((e) => ({ ...e, pos: mod(e.pos + k) })),
  };
}

/** Reflectir-ho. Les posicions es capgiren i les caixes es volten. */
export function reflecteix(disc) {
  return {
    fletxa: mod(-disc.fletxa),
    banda: { ...disc.banda, pos: mod(-disc.banda.pos) },
    elements: disc.elements.map((e) => ({
      ...e, pos: mod(-e.pos), volteig: e.tipus === 'caixa' ? !e.volteig : e.volteig,
    })),
  };
}

/**
 * Com es veu el disc un cop alineada la fletxa. Aquesta és la clau de tot:
 * dos discs són el mateix si això els surt igual.
 */
export function clau(disc) {
  const f = disc.fletxa;
  const b = `${disc.banda.tipus}@${mod(disc.banda.pos - f)}`;
  const e = disc.elements
    .map((x) => `${x.tipus}@${mod(x.pos - f)}${x.volteig ? '!' : ''}`)
    .sort().join(',');
  return `${b}|${e}`;
}

/** Un disc és simètric si el seu reflex es pot fer coincidir girant-lo. */
export function esSimetric(disc) {
  const r = reflecteix(disc);
  for (let k = 0; k < POSICIONS; k++) if (clau(gira(r, k)) === clau(disc)) return true;
  return clau(r) === clau(disc);
}

// ── Fer-ne un ───────────────────────────────────────────────────
function discNou(r) {
  const banda = {
    tipus: tria(r, ['franja', 'ipsilon']),
    pos: entre(r, 0, POSICIONS - 1),
  };
  // Entre tres i quatre coses, en posicions diferents i separades.
  const quants = entre(r, 3, 4);
  const lliures = barreja(r, Array.from({ length: POSICIONS }, (_, i) => i));
  const posades = [];
  for (const p of lliures) {
    if (posades.some((q) => Math.min(mod(q - p), mod(p - q)) < 2)) continue;
    posades.push(p);
    if (posades.length === quants) break;
  }
  if (posades.length < quants) return null;
  const elements = posades.map((pos) => {
    const tipus = tria(r, TIPUS);
    return { pos, tipus, volteig: tipus === 'caixa' ? r() < 0.5 : false };
  });
  // Almenys una caixa: és l'element que delata el reflex més clarament.
  if (!elements.some((e) => e.tipus === 'caixa')) {
    elements[Math.floor(r() * elements.length)] = {
      pos: elements[0].pos, tipus: 'caixa', volteig: r() < 0.5,
    };
  }
  return { fletxa: entre(r, 0, POSICIONS - 1), banda, elements };
}

// ── Generació ────────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed, 7);
  for (let intent = 0; intent < 400; intent++) {
    const model = discNou(r);
    if (!model) continue;
    // Si fos simètric, el reflex es podria fer coincidir girant-lo i hi
    // hauria més d'una resposta bona.
    if (esSimetric(model)) continue;

    // La bona: el model girat. Que giri de debò, no zero passos.
    const bona = gira(model, entre(r, 1, POSICIONS - 1));

    // Els distractors: reflexos girats. Cap no pot coincidir amb el model.
    const reflex = reflecteix(model);
    const dolents = [];
    for (const k of barreja(r, Array.from({ length: POSICIONS }, (_, i) => i))) {
      const d = gira(reflex, k);
      if (clau(d) === clau(model)) continue;             // no hauria de passar
      if (dolents.some((x) => clau(x) === clau(d) && x.fletxa === d.fletxa)) continue;
      if (d.fletxa === bona.fletxa) continue;            // que no es confonguin a ull
      dolents.push(d);
      if (dolents.length === 3) break;
    }
    if (dolents.length < 3) continue;

    const correcta = posicioBona(seed, 4, 'disc');
    const opcions = [];
    let i = 0;
    for (let n = 0; n < 4; n++) opcions.push(n === correcta ? bona : dolents[i++]);

    return {
      seed, model, opcions, correcta,
      control: {
        elModelNoEsSimetric: !esSimetric(model),
        // Un cop alineada la fletxa, només una opció ha de coincidir.
        quantesCoincideixen: opcions.filter((o) => clau(o) === clau(model)).length,
        laMarcadaCoincideix: clau(opcions[correcta]) === clau(model),
        totesTenenElMateixContingut: opcions.every((o) =>
          o.elements.length === model.elements.length),
        fletxesDiferents: new Set(opcions.map((o) => o.fletxa)).size >= 3,
        laBonaEstaGirada: bona.fletxa !== model.fletxa,
      },
    };
  }
  throw new Error(`no s'ha pogut generar el disc ${seed}`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const angle = (pos) => (-90 + pos * (360 / POSICIONS)) * (Math.PI / 180);

function element(cx, cy, rad, e) {
  const a = angle(e.pos);
  const x = cx + rad * 0.58 * Math.cos(a);
  const y = cy + rad * 0.58 * Math.sin(a);
  const graus = (e.pos * (360 / POSICIONS)).toFixed(1);
  if (e.tipus === 'hexagon') {
    const p = [];
    for (let i = 0; i < 6; i++) {
      const t = (i * 60 + 30) * (Math.PI / 180);
      p.push(`${(x + rad * 0.13 * Math.cos(t)).toFixed(1)},${(y + rad * 0.13 * Math.sin(t)).toFixed(1)}`);
    }
    return `<polygon points="${p.join(' ')}" fill="${GRIS}" stroke="${NEGRE}" stroke-width="1"/>`;
  }
  if (e.tipus === 'rodona') {
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rad * 0.13).toFixed(1)}"`
      + ` fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`
      + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rad * 0.05).toFixed(1)}" fill="${NEGRE}"/>`;
  }
  // La caixa: un rectangle amb un quadradet a una punta. És el que delata
  // el reflex, perquè el quadradet canvia de banda.
  const w = rad * 0.34, h = rad * 0.17;
  const s = e.volteig ? -1 : 1;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${graus}) scale(${s} 1)">`
    + `<rect x="${(-w / 2).toFixed(1)}" y="${(-h / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"`
    + ` fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`
    + `<rect x="${(-w / 2 + w * 0.08).toFixed(1)}" y="${(-h / 2 + h * 0.22).toFixed(1)}"`
    + ` width="${(h * 0.56).toFixed(1)}" height="${(h * 0.56).toFixed(1)}" fill="${NEGRE}"/></g>`;
}

function banda(cx, cy, rad, b) {
  const braç = (pos) => {
    const a = angle(pos);
    const gruix = rad * 0.19;
    const px = Math.cos(a), py = Math.sin(a);
    const qx = -py * gruix, qy = px * gruix;
    return `${(cx + qx).toFixed(1)},${(cy + qy).toFixed(1)} `
      + `${(cx + px * rad + qx).toFixed(1)},${(cy + py * rad + qy).toFixed(1)} `
      + `${(cx + px * rad - qx).toFixed(1)},${(cy + py * rad - qy).toFixed(1)} `
      + `${(cx - qx).toFixed(1)},${(cy - qy).toFixed(1)}`;
  };
  const braços = b.tipus === 'franja'
    ? [b.pos, mod(b.pos + 6)]
    : [b.pos, mod(b.pos + 4), mod(b.pos + 8)];
  return braços.map((p) => `<polygon points="${braç(p)}" fill="${GRIS}"/>`).join('');
}

function disc(cx, cy, rad, d) {
  const a = angle(d.fletxa);
  const x1 = cx + rad * 1.42 * Math.cos(a), y1 = cy + rad * 1.42 * Math.sin(a);
  const x2 = cx + rad * 1.1 * Math.cos(a), y2 = cy + rad * 1.1 * Math.sin(a);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const p = (t, l) => `${(x2 - l * Math.cos(ang + t)).toFixed(1)},${(y2 - l * Math.sin(ang + t)).toFixed(1)}`;
  return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#fff" stroke="${NEGRE}" stroke-width="1.3"/>`
    + banda(cx, cy, rad, d.banda)
    + `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${NEGRE}" stroke-width="1.3"/>`
    + d.elements.map((e) => element(cx, cy, rad, e)).join('')
    + `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"`
    + ` stroke="${NEGRE}" stroke-width="1.4"/>`
    + `<polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${p(0.4, 7)} ${p(-0.4, 7)}" fill="${NEGRE}"/>`;
}

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

export function svgItem(item, num, y0 = 0) {
  const rad = 42, sep = 118;
  const model = disc(75, y0 + 92, rad, item.model);
  const opcions = item.opcions.map((o, i) => {
    const cx = 205 + i * sep;
    return disc(cx, y0 + 92, rad, o) + txt(cx, y0 + 158, `${'abcd'[i]})`, 12, 700, 'middle');
  }).join('');
  return `<g>${txt(16, y0 + 20, `<tspan font-weight="700">${num}.</tspan> Quina de les quatre imatges següents es correspon amb el model de l'esquerra?`)}
  ${txt(75, y0 + 158, 'model', 10, 600, 'middle')}${model}${opcions}</g>`;
}

export function svgFull(items) {
  const alt = 178;
  const cos = items.map((it, i) => svgItem(it, i + 1, i * alt)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="690" height="${items.length * alt + 20}" viewBox="0 0 690 ${items.length * alt + 20}">
  <rect preserveAspectRatio="xMidYMid meet" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per peces, per a l'app ────────────────────────────────
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;
const capsa = (rad) => rad * 3;         // el disc més el marge de la fletxa

export function svgEnunciat(item, rad = 46) {
  const w = capsa(rad);
  return embolcall(w, w, disc(w / 2, w / 2, rad, item.model));
}

export function svgOpcio(item, i, rad = 46) {
  const w = capsa(rad);
  return embolcall(w, w, disc(w / 2, w / 2, rad, item.opcions[i]));
}
