// "Troba la mateixa imatge canviant la posició de l'ull."
//
// Una escena rodona —una carretera amb cotxes, una platja amb una barca—
// i un ull a fora que diu des d'on la mires. Les quatre opcions tenen
// l'ull en un altre lloc: cal trobar la que és la MATEIXA escena vista des
// d'allà.
//
// És el mateix principi que el disc que gira: canviar l'ull de lloc és
// girar l'escena. I per tant es comprova igual — s'alinea l'ull i es
// compara el contingut. Amb una diferència que no és petita: el disc porta
// figures geomètriques i això porta una escena amb color, que és com surt
// al quadern nou i s'entén molt millor d'un cop d'ull.
//
// Els distractors són reflexos, no girs. Un reflex no es pot fer coincidir
// per molt que el giris —sempre que l'escena no sigui simètrica, i això
// també es comprova.
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

const POSICIONS = 12;                 // les hores del rellotge
const mod = (n) => ((n % POSICIONS) + POSICIONS) % POSICIONS;

// ── Les escenes ──────────────────────────────────────────────────
// Cada escena té un fons partit per una franja (la carretera o la riba) i
// uns objectes a banda i banda.
export const ESCENES = {
  carretera: {
    fons: '#8CC26B', franja: '#B9BEC4', ratlla: '#FFFFFF',
    objectes: ['cotxe', 'arbre', 'arbust'],
  },
  platja: {
    fons: '#7EC8E3', franja: '#E8D3A0', ratlla: null,
    objectes: ['barca', 'palmera', 'roca'],
  },
  riu: {
    fons: '#9AD46F', franja: '#6FB7E8', ratlla: null,
    objectes: ['barca', 'arbre', 'roca'],
  },
};

/** Girar-ho tot: l'escena i l'ull alhora. */
export const gira = (e, k) => ({
  ...e,
  ull: mod(e.ull + k),
  franja: mod(e.franja + k),
  objectes: e.objectes.map((o) => ({ ...o, pos: mod(o.pos + k) })),
});

/** Reflectir. Les posicions es capgiren i els objectes es volten. */
export const reflecteix = (e) => ({
  ...e,
  ull: mod(-e.ull),
  franja: mod(-e.franja),
  objectes: e.objectes.map((o) => ({ ...o, pos: mod(-o.pos), volteig: !o.volteig })),
});

/**
 * Com es veu l'escena un cop col·locat l'ull a lloc. Dues escenes són la
 * mateixa si això els surt igual.
 */
export function clau(e) {
  const u = e.ull;
  return `${e.mena}|f${mod(e.franja - u)}|`
    + e.objectes.map((o) => `${o.tipus}@${mod(o.pos - u)}${o.volteig ? '!' : ''}`)
      .sort().join(',');
}

/** Una escena és simètrica si el seu reflex es pot fer coincidir girant-la. */
export function esSimetrica(e) {
  for (let k = 0; k < POSICIONS; k++) if (clau(gira(reflecteix(e), k)) === clau(e)) return true;
  return false;
}

// ── Fer-ne una ──────────────────────────────────────────────────
function escenaNova(r) {
  const mena = tria(r, Object.keys(ESCENES));
  const def = ESCENES[mena];
  const franja = entre(r, 0, POSICIONS - 1);
  const quants = entre(r, 3, 4);
  const lliures = barreja(r, Array.from({ length: POSICIONS }, (_, i) => i));
  const posades = [];
  for (const p of lliures) {
    if (posades.some((q) => Math.min(mod(q - p), mod(p - q)) < 2)) continue;
    posades.push(p);
    if (posades.length === quants) break;
  }
  if (posades.length < quants) return null;
  const objectes = posades.map((pos) => ({
    pos, tipus: tria(r, def.objectes), volteig: r() < 0.5,
  }));
  return { mena, ull: entre(r, 0, POSICIONS - 1), franja, objectes };
}

export function generaItem(seed) {
  const r = rng(seed, 37);
  for (let intent = 0; intent < 400; intent++) {
    const model = escenaNova(r);
    if (!model) continue;
    if (esSimetrica(model)) continue;

    // La bona: la mateixa escena amb l'ull en un altre lloc.
    const bona = gira(model, entre(r, 1, POSICIONS - 1));
    if (bona.ull === model.ull) continue;

    const reflex = reflecteix(model);
    const dolents = [];
    for (const k of barreja(r, Array.from({ length: POSICIONS }, (_, i) => i))) {
      const d = gira(reflex, k);
      if (clau(d) === clau(model)) continue;
      if (d.ull === bona.ull) continue;
      if (dolents.some((x) => x.ull === d.ull)) continue;
      dolents.push(d);
      if (dolents.length === 3) break;
    }
    if (dolents.length < 3) continue;

    const correcta = posicioBona(seed, 4, 'fuga');
    const opcions = [];
    let i = 0;
    for (let n = 0; n < 4; n++) opcions.push(n === correcta ? bona : dolents[i++]);

    return {
      seed, model, opcions, correcta,
      control: {
        laEscenaNoEsSimetrica: !esSimetrica(model),
        quantesCoincideixen: opcions.filter((o) => clau(o) === clau(model)).length,
        laMarcadaCoincideix: clau(opcions[correcta]) === clau(model),
        totesTenenElsMateixosObjectes: opcions.every((o) =>
          o.objectes.length === model.objectes.length),
        totesSonLaMateixaMena: opcions.every((o) => o.mena === model.mena),
        ullsDiferents: new Set(opcions.map((o) => o.ull)).size === 4,
        laBonaTeUnAltreUll: bona.ull !== model.ull,
      },
    };
  }
  throw new Error(`no s'ha pogut generar el punt de fuga ${seed}`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#2C3E56';
const angle = (pos) => (-90 + pos * (360 / POSICIONS)) * (Math.PI / 180);

function objecte(cx, cy, rad, o) {
  const a = angle(o.pos);
  const x = cx + rad * 0.6 * Math.cos(a);
  const y = cy + rad * 0.6 * Math.sin(a);
  const s = rad * 0.16;
  const g = (cos) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})`
    + `${o.volteig ? ' scale(-1 1)' : ''}">${cos}</g>`;
  switch (o.tipus) {
    case 'cotxe':
      return g(`<rect x="${-s}" y="${-s * 0.62}" width="${s * 2}" height="${s * 1.24}" rx="${s * 0.3}"`
        + ` fill="#3B5BA5" stroke="${NEGRE}" stroke-width="1"/>`
        + `<rect x="${-s * 0.45}" y="${-s * 0.4}" width="${s * 0.85}" height="${s * 0.8}" fill="#CFE3F5"/>`);
    case 'barca':
      return g(`<path d="M ${-s * 1.1} 0 L ${s * 1.1} 0 L ${s * 0.6} ${s * 0.7} L ${-s * 0.6} ${s * 0.7} Z"`
        + ` fill="#C0532F" stroke="${NEGRE}" stroke-width="1"/>`
        + `<line x1="0" y1="0" x2="0" y2="${-s}" stroke="${NEGRE}" stroke-width="1.4"/>`);
    case 'arbre':
      return g(`<rect x="${-s * 0.16}" y="0" width="${s * 0.32}" height="${s * 0.8}" fill="#7A5230"/>`
        + `<circle cx="0" cy="${-s * 0.3}" r="${s * 0.8}" fill="#3E7D3A" stroke="${NEGRE}" stroke-width="0.9"/>`);
    case 'palmera':
      return g(`<rect x="${-s * 0.13}" y="${-s * 0.2}" width="${s * 0.26}" height="${s}" fill="#8A6A3A"/>`
        + `<path d="M 0 ${-s * 0.3} q ${-s} ${-s * 0.45} ${-s * 1.15} ${s * 0.25}`
        + ` M 0 ${-s * 0.3} q ${s} ${-s * 0.45} ${s * 1.15} ${s * 0.25}"`
        + ` fill="none" stroke="#2F7D4F" stroke-width="${(s * 0.4).toFixed(1)}" stroke-linecap="round"/>`);
    case 'roca':
      return g(`<path d="M ${-s * 0.9} ${s * 0.5} L ${-s * 0.4} ${-s * 0.6} L ${s * 0.5} ${-s * 0.4}`
        + ` L ${s * 0.9} ${s * 0.5} Z" fill="#9AA0A6" stroke="${NEGRE}" stroke-width="1"/>`);
    default:  // arbust
      return g(`<circle cx="${-s * 0.4}" cy="0" r="${s * 0.5}" fill="#4E8C46"/>`
        + `<circle cx="${s * 0.35}" cy="${s * 0.1}" r="${s * 0.6}" fill="#3E7D3A"`
        + ` stroke="${NEGRE}" stroke-width="0.8"/>`);
  }
}

/** L'escena sencera: el disc, la franja i el que hi ha a sobre. */
function escena(cx, cy, rad, e, id) {
  const def = ESCENES[e.mena];
  const a = angle(e.franja);
  const px = Math.cos(a), py = Math.sin(a);
  const gruix = rad * 0.42;
  const qx = -py * gruix, qy = px * gruix;
  const L = rad * 1.5;
  const franja = `<polygon points="${(cx + px * L + qx).toFixed(1)},${(cy + py * L + qy).toFixed(1)} `
    + `${(cx - px * L + qx).toFixed(1)},${(cy - py * L + qy).toFixed(1)} `
    + `${(cx - px * L - qx).toFixed(1)},${(cy - py * L - qy).toFixed(1)} `
    + `${(cx + px * L - qx).toFixed(1)},${(cy + py * L - qy).toFixed(1)}" fill="${def.franja}"/>`
    + (def.ratlla
      ? `<line x1="${(cx + px * L).toFixed(1)}" y1="${(cy + py * L).toFixed(1)}"`
        + ` x2="${(cx - px * L).toFixed(1)}" y2="${(cy - py * L).toFixed(1)}"`
        + ` stroke="${def.ratlla}" stroke-width="2" stroke-dasharray="7 6"/>`
      : '');

  // L'ull, a fora, mirant cap al centre.
  const au = angle(e.ull);
  const ux = cx + rad * 1.34 * Math.cos(au), uy = cy + rad * 1.34 * Math.sin(au);
  const vx = cx + rad * 1.08 * Math.cos(au), vy = cy + rad * 1.08 * Math.sin(au);
  const ang = Math.atan2(vy - uy, vx - ux);
  const punta = (t2, l) => `${(vx - l * Math.cos(ang + t2)).toFixed(1)},${(vy - l * Math.sin(ang + t2)).toFixed(1)}`;

  return `<clipPath id="c${id}"><circle cx="${cx}" cy="${cy}" r="${rad}"/></clipPath>`
    + `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${def.fons}"/>`
    + `<g clip-path="url(#c${id})">${franja}`
    + e.objectes.map((o) => objecte(cx, cy, rad, o)).join('') + '</g>'
    + `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${NEGRE}" stroke-width="2"/>`
    + `<ellipse cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" rx="7" ry="4.4" fill="#fff"`
    + ` stroke="${NEGRE}" stroke-width="1.4"/>`
    + `<circle cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="2" fill="${NEGRE}"/>`
    + `<line x1="${ux.toFixed(1)}" y1="${uy.toFixed(1)}" x2="${vx.toFixed(1)}" y2="${vy.toFixed(1)}"`
    + ` stroke="${NEGRE}" stroke-width="1.3"/>`
    + `<polygon points="${vx.toFixed(1)},${vy.toFixed(1)} ${punta(0.42, 6)} ${punta(-0.42, 6)}" fill="${NEGRE}"/>`;
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

// El marc ha de donar cabuda al disc I a l'ull, que va a fora, a 1,34 radis
// del centre i fa 7 d'ample més la vora. Amb 2,95 hi cabia just i el pinzell
// de l'ull quedava mig tallat; amb 3,1 hi ha aire.
const capsa = (rad) => Math.round(rad * 3.1);

export function svgEnunciat(item, rad = 48) {
  const w = capsa(rad);
  return embolcall(w, w, escena(w / 2, w / 2, rad, item.model, `m${item.seed}`));
}

export function svgOpcio(item, i, rad = 48) {
  const w = capsa(rad);
  return embolcall(w, w, escena(w / 2, w / 2, rad, item.opcions[i], `o${item.seed}_${i}`));
}

export function svgFull(items) {
  const alt = 190, rad = 52;
  const cos = items.map((it, i) => {
    const y = i * alt + 40;
    const sep = 132;
    return `<g><text x="16" y="${y - 22}" font-family="ui-sans-serif,system-ui,sans-serif"`
      + ` font-size="13" fill="${NEGRE}"><tspan font-weight="700">${i + 1}.</tspan>`
      + " Troba la mateixa imatge canviant la posició de l'ull.</text>"
      + escena(90, y + 46, rad, it.model, `e${i}`)
      + it.opcions.map((_, k) => escena(238 + k * sep, y + 46, rad, it.opcions[k], `p${i}_${k}`)
        + `<text x="${238 + k * sep}" y="${y + 46 + rad * 1.62}" text-anchor="middle"`
        + ` font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="700"`
        + ` fill="${NEGRE}">${'ABCD'[k]}</text>`).join('')
      + '</g>';
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${items.length * alt + 60}" viewBox="0 0 760 ${items.length * alt + 60}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}
