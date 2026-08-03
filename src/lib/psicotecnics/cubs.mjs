// Ítems de cubs, ara sobre el plegat de veritat.
import * as P from './plegat.mjs';

const K = Math.cos(Math.PI / 6);

// Desenvolupaments candidats: la tira de quatre amb una peça a dalt i una
// a baix, a totes les combinacions, més els dos que ja havien passat la
// prova. Es filtren pel validador: només queden els que pleguen.
function formes() {
  const candidats = [];
  // Tira de quatre amb una peça a dalt i una a baix, a totes les posicions.
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      candidats.push([[0, 1], [1, 1], [2, 1], [3, 1], [a, 0], [b, 2]]);
    }
  }
  // Tira de tres amb dues a sobre i una a sota, i les escales.
  for (let a = 0; a < 3; a++) {
    for (let b = 0; b < 3; b++) {
      if (a === b) continue;
      candidats.push([[0, 1], [1, 1], [2, 1], [a, 0], [b, 0], [1, 2]]);
      candidats.push([[0, 1], [1, 1], [2, 1], [a, 0], [b, 2], [2, 2]]);
    }
  }
  candidats.push([[0, 1], [1, 1], [1, 0], [2, 1], [2, 2], [3, 2]]);
  candidats.push([[0, 1], [1, 1], [2, 1], [2, 0], [3, 1], [3, 2]]);
  candidats.push([[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]]);

  const vistes = new Set();
  const totes = [];
  for (const f of candidats) {
    const k = JSON.stringify([...f].sort());
    if (vistes.has(k)) continue;
    vistes.add(k);
    if (new Set(f.map((c) => c.join(','))).size !== 6) continue;
    const c = P.plega(f.map(([nx, ny], i) => ({ nx, ny, dibuix: 'x' + i })));
    if (P.valid(c)) totes.push(f);
  }
  return totes;
}
export const FORMES = formes();

const DIBUIXOS = ['ple', 'tri-ne', 'tri-nw', 'tri-se', 'tri-sw', 'barra-v', 'meitat-sup', 'buit', 'fletxa', 'quadret'];

function rng(seed) { let s = (seed * 2654435761) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const tria = (r, a) => a[Math.floor(r() * a.length)];

export function generaItem(seed) {
  const r = rng(seed);
  const forma = tria(r, FORMES);
  const dib = [...DIBUIXOS].sort(() => r() - 0.5).slice(0, 6);
  const celles = forma.map(([nx, ny], i) => ({ nx, ny, dibuix: dib[i] }));
  const cares = P.plega(celles);
  const cub = [...cares.values()];
  const totes = P.orientacions(cub);
  const possibles = new Set(totes.map(P.vistaDe).map((v) => v.join('|')));
  const bona = P.vistaDe(tria(r, totes));

  const dolentes = [];
  for (let i = 0; i < 8000 && dolentes.length < 3; i++) {
    const t = P.vistaDe(tria(r, totes)).slice();
    const pos = Math.floor(r() * 3);
    if (r() < 0.55) {
      const [d, q] = t[pos].split('@');
      t[pos] = `${d}@${(Number(q) + 1 + Math.floor(r() * 3)) % 4}`;
    } else {
      const altre = tria(r, dib.filter((d) => !t.some((p) => p.startsWith(`${d}@`))));
      if (!altre) continue;
      t[pos] = `${altre}@${Math.floor(r() * 4)}`;
    }
    const k = t.join('|');
    if (possibles.has(k) || dolentes.some((d) => d.join('|') === k)) continue;
    dolentes.push(t);
  }
  const opcions = [bona, ...dolentes].sort(() => r() - 0.5);
  return {
    celles, opcions, correcta: opcions.findIndex((o) => o.join('|') === bona.join('|')),
    control: { caresValides: P.valid(cares), orientacions: totes.length, vistes: possibles.size },
  };
}

// ── Dibuix ───────────────────────────────────────────────────────
function figura(nom) {
  switch (nom) {
    case 'ple': return '<rect x="0" y="0" width="1" height="1" fill="#15151C"/>';
    case 'buit': return '';
    case 'tri-ne': return '<polygon points="0,0 1,0 1,1" fill="#15151C"/>';
    case 'tri-nw': return '<polygon points="0,0 1,0 0,1" fill="#15151C"/>';
    case 'tri-se': return '<polygon points="1,0 1,1 0,1" fill="#15151C"/>';
    case 'tri-sw': return '<polygon points="0,0 1,1 0,1" fill="#15151C"/>';
    case 'barra-v': return '<rect x="0.34" y="0" width="0.32" height="1" fill="#15151C"/>';
    case 'meitat-sup': return '<rect x="0" y="0" width="1" height="0.5" fill="#15151C"/>';
    case 'quadret': return '<rect x="0.36" y="0.12" width="0.28" height="0.28" fill="#15151C"/>';
    default: return '<polygon points="0.5,0.12 0.78,0.55 0.6,0.55 0.6,0.88 0.4,0.88 0.4,0.55 0.22,0.55" fill="#15151C"/>';
  }
}
const girada = (codi) => {
  const [nom, q] = codi.split('@');
  return `<g transform="rotate(${Number(q) * 90} 0.5 0.5)">${figura(nom)}</g>`;
};

const proj = (p, s) => ({ x: (p[0] - p[2]) * K * s, y: (p[0] + p[2]) * 0.5 * s - p[1] * s });

function cub(cx, cy, vista, s = 38) {
  const REF = [
    { o: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },   // dalt
    { o: [0, 1, 1], u: [1, 0, 0], v: [0, -1, 0] },  // esquerra
    { o: [1, 1, 1], u: [0, 0, -1], v: [0, -1, 0] }, // dreta
  ];
  const su = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const pt = (p) => { const q = proj(p, s); return { x: cx + q.x, y: cy + q.y }; };
  return REF.map((c, i) => {
    const O = pt(c.o), A = pt(su(c.o, c.u)), B = pt(su(c.o, c.v)), C = pt(su(su(c.o, c.u), c.v));
    const pts = [O, A, C, B].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const m = `matrix(${(A.x - O.x).toFixed(4)} ${(A.y - O.y).toFixed(4)} ${(B.x - O.x).toFixed(4)} ${(B.y - O.y).toFixed(4)} ${O.x.toFixed(3)} ${O.y.toFixed(3)})`;
    return `<polygon points="${pts}" fill="#fff"/><g transform="${m}">${girada(vista[i])}</g>`
      + `<polygon points="${pts}" fill="none" stroke="#15151C" stroke-width="1.5" stroke-linejoin="round"/>`;
  }).join('');
}

function desplegable(x, y, celles, c = 38) {
  return celles.map((ce) => {
    const px = x + ce.nx * c, py = y + ce.ny * c;
    return `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff"/>`
      + `<g transform="matrix(${c} 0 0 ${c} ${px} ${py})">${figura(ce.dibuix)}</g>`
      + `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="none" stroke="#15151C" stroke-width="1.5"/>`;
  }).join('');
}

export function svgItem(item, num) {
  const minX = Math.min(...item.celles.map((c) => c.nx));
  const minY = Math.min(...item.celles.map((c) => c.ny));
  const norm = item.celles.map((c) => ({ ...c, nx: c.nx - minX, ny: c.ny - minY }));
  const op = item.opcions.map((o, i) => cub(330 + i * 104, 130, o)
    + `<text x="${330 + i * 104}" y="205" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="700" fill="#15151C">${'ABCD'[i]}</text>`).join('');
  return `<g><text x="20" y="28" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" fill="#15151C"><tspan font-weight="700">${num}.</tspan> Quina de les opcions correspon amb el cub desplegat una vegada muntat?</text>
  ${desplegable(28, 52, norm)}${op}</g>`;
}
