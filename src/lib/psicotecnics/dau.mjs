// Bateria cub en plànol: el dau que roda pel tauler.
//
// "Quin és el número que quedarà a la part SUPERIOR del dau quan es
//  desplaci rodant per les caselles grises fins a la marcada amb una X?
//  RECORDEU: la suma dels costats oposats d'un dau sempre és set."
//
// El dau ensenya tres números, hi ha un camí de caselles grises i una X.
// Rodar no és girar el dibuix: cada pas fa que la cara de dalt passi a
// mirar cap on s'avança, i la del darrere pugi.
//
// Aquí la resposta es calcula DUES vegades i per camins que no s'assemblen:
//
//  1. Amb un diccionari de sis direccions i una permutació per cada pas.
//  2. Fent girar el cub de veritat amb les rotacions del motor de plegat,
//     i mirant al final quina cara té la normal cap amunt.
//
// Si les dues no diuen el mateix, l'ítem no surt. I com que el motor de
// plegat ja està validat per la seva banda, la segona via no és una còpia
// de la primera: és una comprovació de debò.
import * as P from './plegat.mjs';
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

// ── El dau ───────────────────────────────────────────────────────
// Un dau és quin número mira cap a cada banda.
const BANDES = ['dalt', 'baix', 'dreta', 'esquerra', 'davant', 'darrere'];

/** Un dau occidental muntat a l'atzar, amb les oposades sumant set. */
function dauNou(r) {
  // Es tria quin va a dalt i quin a la dreta; la resta ve donada.
  const dalt = entre(r, 1, 6);
  const dreta = tria(r, [1, 2, 3, 4, 5, 6].filter((n) => n !== dalt && n !== 7 - dalt));
  const davant = tria(r, [1, 2, 3, 4, 5, 6]
    .filter((n) => ![dalt, 7 - dalt, dreta, 7 - dreta].includes(n)));
  return {
    dalt, baix: 7 - dalt, dreta, esquerra: 7 - dreta, davant, darrere: 7 - davant,
  };
}

// Els quatre passos pel tauler. 'dreta' vol dir avançar cap a +X, que a la
// pantalla baixa cap a la dreta; 'davant' cap a +Z, que baixa cap a
// l'esquerra. Rodar cap a un costat fa pujar la cara del costat contrari.
export const PASSOS = {
  dreta: (d) => ({ ...d, dalt: d.esquerra, dreta: d.dalt, baix: d.dreta, esquerra: d.baix }),
  esquerra: (d) => ({ ...d, dalt: d.dreta, esquerra: d.dalt, baix: d.esquerra, dreta: d.baix }),
  davant: (d) => ({ ...d, dalt: d.darrere, davant: d.dalt, baix: d.davant, darrere: d.baix }),
  darrere: (d) => ({ ...d, dalt: d.davant, darrere: d.dalt, baix: d.darrere, davant: d.baix }),
};
const DELTA = {
  dreta: [1, 0], esquerra: [-1, 0], davant: [0, 1], darrere: [0, -1],
};

/** Fer rodar el dau tot el camí. Primera via. */
export function roda(dau, cami) {
  return cami.reduce((d, pas) => PASSOS[pas](d), dau);
}

// ── La segona via: fer girar el cub de veritat ───────────────────
// Les rotacions que corresponen a cada pas. Rodar cap a +X porta la cara
// de dalt (+Y) a mirar cap a +X; rodar cap a +Z, cap a +Z.
const GIRS = {
  dreta: (p) => P.V(p.y, -p.x, p.z),
  esquerra: (p) => P.V(-p.y, p.x, p.z),
  davant: (p) => P.V(p.x, -p.z, p.y),
  darrere: (p) => P.V(p.x, p.z, -p.y),
};
const NORMAL = {
  dalt: P.V(0, 1, 0), baix: P.V(0, -1, 0), dreta: P.V(1, 0, 0),
  esquerra: P.V(-1, 0, 0), davant: P.V(0, 0, 1), darrere: P.V(0, 0, -1),
};

/** El mateix, però girant el cub. Segona via, independent de la primera. */
export function rodaAmbElMotor(dau, cami) {
  let cub = P.CARES.map((c) => {
    const banda = BANDES.find((b) => P.igual(NORMAL[b], c.n));
    return { dibuix: String(dau[banda]), u: c.u, v: c.v, n: c.n };
  });
  for (const pas of cami) {
    const g = GIRS[pas];
    cub = cub.map((f) => ({ dibuix: f.dibuix, u: g(f.u), v: g(f.v), n: g(f.n) }));
  }
  const out = {};
  for (const b of BANDES) out[b] = Number(cub.find((f) => P.igual(f.n, NORMAL[b])).dibuix);
  return out;
}

// ── El camí pel tauler ───────────────────────────────────────────
const COSTAT = 6;

function camiNou(r) {
  const passos = entre(r, 3, 6);
  let x = entre(r, 1, COSTAT - 2), z = entre(r, 1, COSTAT - 2);
  const visitades = [[x, z]];
  const cami = [];
  for (let i = 0; i < passos; i++) {
    const opcions = barreja(r, Object.keys(DELTA)).filter((d) => {
      const [dx, dz] = DELTA[d];
      const nx = x + dx, nz = z + dz;
      if (nx < 0 || nz < 0 || nx >= COSTAT || nz >= COSTAT) return false;
      return !visitades.some(([a, b]) => a === nx && b === nz);
    });
    if (!opcions.length) return null;
    const pas = opcions[0];
    const [dx, dz] = DELTA[pas];
    x += dx; z += dz;
    visitades.push([x, z]);
    cami.push(pas);
  }
  return { cami, caselles: visitades };
}

// ── Generació ────────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed, 3);
  for (let intent = 0; intent < 400; intent++) {
    const c = camiNou(r);
    if (!c) continue;
    const dau = dauNou(r);

    // Les dues vies. Si no diuen el mateix, l'ítem no val.
    const final = roda(dau, c.cami);
    const control2 = rodaAmbElMotor(dau, c.cami);
    if (BANDES.some((b) => final[b] !== control2[b])) continue;

    const bona = final.dalt;
    // Distractors: el de sota —l'errada de no girar-lo del tot—, els que
    // es veuen al principi, i algun número solt.
    const cands = [
      { n: final.baix, error: 'donar el que queda a sota' },
      { n: dau.dalt, error: 'el que ja hi havia a dalt al principi' },
      { n: final.dreta, error: 'una cara del costat' },
      { n: 7 - dau.dalt, error: 'l\'oposat del de partida' },
      { n: final.davant, error: 'l\'altra cara del costat' },
      ...[1, 2, 3, 4, 5, 6].map((n) => ({ n, error: 'un número qualsevol' })),
    ];
    const dolents = [];
    for (const cand of cands) {
      if (cand.n === bona || dolents.some((d) => d.n === cand.n)) continue;
      dolents.push(cand);
      if (dolents.length === 3) break;
    }
    if (dolents.length < 3) continue;

    const correcta = posicioBona(seed, 4, 'dau');
    const opcions = [];
    let d = 0;
    for (let i = 0; i < 4; i++) opcions.push(i === correcta ? bona : dolents[d++].n);

    return {
      seed, dau, cami: c.cami, caselles: c.caselles, final, opcions, correcta,
      control: {
        lesDuesViesCoincideixen: BANDES.every((b) => final[b] === control2[b]),
        oposadesSumenSetAlPrincipi: dau.dalt + dau.baix === 7
          && dau.dreta + dau.esquerra === 7 && dau.davant + dau.darrere === 7,
        oposadesSumenSetAlFinal: final.dalt + final.baix === 7
          && final.dreta + final.esquerra === 7 && final.davant + final.darrere === 7,
        sisNumerosDiferents: new Set(BANDES.map((b) => final[b])).size === 6,
        opcionsDiferents: new Set(opcions).size === 4,
        capCasellaRepetida: new Set(c.caselles.map((p) => p.join(','))).size === c.caselles.length,
        passos: c.cami.length,
      },
    };
  }
  throw new Error(`no s'ha pogut generar el dau ${seed}`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#15151C';
const GRIS = '#c9ccd1';

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

export function svgItem(item, num, y0 = 0) {
  const s = 27, cx = 210, cy = y0 + 60;
  const pt = (x, y, z) => {
    const q = P.projecta(P.V(x, y, z), s);
    return { x: cx + q.x, y: cy + q.y };
  };
  const rombe = (i, j, farcit) => {
    const p = [pt(i, 0, j), pt(i + 1, 0, j), pt(i + 1, 0, j + 1), pt(i, 0, j + 1)];
    return `<polygon points="${p.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
      + ` fill="${farcit}" stroke="${NEGRE}" stroke-width="0.9"/>`;
  };

  const grises = new Set(item.caselles.slice(1).map((p) => p.join(',')));
  const ultima = item.caselles[item.caselles.length - 1].join(',');
  let tauler = '';
  for (let i = 0; i < COSTAT; i++) {
    for (let j = 0; j < COSTAT; j++) {
      tauler += rombe(i, j, grises.has(`${i},${j}`) ? GRIS : '#fff');
    }
  }
  // La X de destí.
  const [ux, uz] = ultima.split(',').map(Number);
  const cX = pt(ux + 0.5, 0, uz + 0.5);
  tauler += txt(cX.x, cX.y + 5, 'X', 15, 700, 'middle');

  // El dau, a la casella de sortida, amb les tres cares que es veuen.
  const [dx, dz] = item.caselles[0];
  const cara = (o, u, v, valor) => {
    const O = pt(o[0], o[1], o[2]);
    const A = pt(o[0] + u[0], o[1] + u[1], o[2] + u[2]);
    const B = pt(o[0] + v[0], o[1] + v[1], o[2] + v[2]);
    const C = pt(o[0] + u[0] + v[0], o[1] + u[1] + v[1], o[2] + u[2] + v[2]);
    const pts = [O, A, C, B].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');
    const m = `matrix(${(A.x - O.x).toFixed(3)} ${(A.y - O.y).toFixed(3)} `
      + `${(B.x - O.x).toFixed(3)} ${(B.y - O.y).toFixed(3)} ${O.x.toFixed(2)} ${O.y.toFixed(2)})`;
    return `<polygon points="${pts}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`
      + `<g transform="${m}"><text x="0.5" y="0.68" text-anchor="middle"`
      + ` font-family="ui-sans-serif,system-ui,sans-serif" font-size="0.5"`
      + ` fill="${NEGRE}">${valor}</text></g>`;
  };
  const cub = cara([dx, 1, dz], [1, 0, 0], [0, 0, 1], item.dau.dalt)          // dalt
    + cara([dx, 1, dz + 1], [1, 0, 0], [0, -1, 0], item.dau.davant)           // cap a +Z
    + cara([dx + 1, 1, dz + 1], [0, 0, -1], [0, -1, 0], item.dau.dreta);      // cap a +X

  const opcions = item.opcions.map((o, i) =>
    txt(400, y0 + 34 + i * 20, `${'abcd'[i]})  ${o}`)).join('');

  return `<g>${txt(16, y0 + 16, `<tspan font-weight="700">${num}.</tspan> Quin número quedarà a la part SUPERIOR del dau quan es desplaci`)}
  ${txt(16, y0 + 30, 'rodant per les caselles grises fins a la marcada amb una X?')}
  ${tauler}${cub}${opcions}</g>`;
}

export function svgFull(items) {
  const alt = 250;
  const cos = items.map((it, i) => svgItem(it, i + 1, i * alt)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${items.length * alt + 20}" viewBox="0 0 480 ${items.length * alt + 20}">
  <rect preserveAspectRatio="xMidYMid meet" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per a l'app ───────────────────────────────────────────
// Les opcions són números: només cal l'enunciat.
export function svgEnunciat(item, s = 26) {
  const COSTAT_ = 6;
  const cx = COSTAT_ * P.K * s + 6, cy = s * 1.6;
  const pt = (x, y, z) => {
    const q = P.projecta(P.V(x, y, z), s);
    return { x: cx + q.x, y: cy + q.y };
  };
  const rombe = (i, j, farcit) => {
    const p = [pt(i, 0, j), pt(i + 1, 0, j), pt(i + 1, 0, j + 1), pt(i, 0, j + 1)];
    return `<polygon points="${p.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}"`
      + ` fill="${farcit}" stroke="${NEGRE}" stroke-width="0.9"/>`;
  };
  const grises = new Set(item.caselles.slice(1).map((p) => p.join(',')));
  let cos = '';
  for (let i = 0; i < COSTAT_; i++) for (let j = 0; j < COSTAT_; j++) {
    cos += rombe(i, j, grises.has(`${i},${j}`) ? GRIS : '#fff');
  }
  const [ux, uz] = item.caselles[item.caselles.length - 1];
  const cX = pt(ux + 0.5, 0, uz + 0.5);
  cos += txt(cX.x, cX.y + 5, 'X', 15, 700, 'middle');

  const [dx, dz] = item.caselles[0];
  const cara = (o, u, v, valor) => {
    const O = pt(o[0], o[1], o[2]);
    const A = pt(o[0] + u[0], o[1] + u[1], o[2] + u[2]);
    const B = pt(o[0] + v[0], o[1] + v[1], o[2] + v[2]);
    const C = pt(o[0] + u[0] + v[0], o[1] + u[1] + v[1], o[2] + u[2] + v[2]);
    const pts = [O, A, C, B].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ');
    const m = `matrix(${(A.x - O.x).toFixed(3)} ${(A.y - O.y).toFixed(3)} `
      + `${(B.x - O.x).toFixed(3)} ${(B.y - O.y).toFixed(3)} ${O.x.toFixed(2)} ${O.y.toFixed(2)})`;
    return `<polygon points="${pts}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`
      + `<g transform="${m}"><text x="0.5" y="0.68" text-anchor="middle"`
      + ` font-family="ui-sans-serif,system-ui,sans-serif" font-size="0.5" fill="${NEGRE}">${valor}</text></g>`;
  };
  cos += cara([dx, 1, dz], [1, 0, 0], [0, 0, 1], item.dau.dalt)
    + cara([dx, 1, dz + 1], [1, 0, 0], [0, -1, 0], item.dau.davant)
    + cara([dx + 1, 1, dz + 1], [0, 0, -1], [0, -1, 0], item.dau.dreta);

  const w = 2 * COSTAT_ * P.K * s + 12, h = COSTAT_ * s + s * 2.4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;
}
