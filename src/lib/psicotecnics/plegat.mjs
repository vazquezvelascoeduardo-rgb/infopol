// Plegat de veritat: del desplegable al cub.
//
// El fallo de la v3: jo autorava els dibuixos per CARA, en un marc
// canònic inventat per mi, i després pintava el desplegable sense cap
// gir. Però quan doblegues una creu, cada cara queda girada respecte de
// les altres segons per on la plegues. El desplegable que es veia no era
// el desenvolupament de cap cub, i per això la resposta no quadrava.
//
// Ara va al revés, que és com ha de ser: el desplegable és l'origen. Cada
// casella porta el seu dibuix tal com es veu al paper, i d'allà es dedueix
// quina cara del cub és i amb quin marc. El cub es dibuixa a partir d'això.
//
// El plegat es fa caminant pel desplegable: cada pas cap a un veí aplica
// el gir de doblegar per aquella aresta. Serveix per a qualsevol forma de
// desenvolupament —creu, T, tira, ziga-zaga, L—, no només per a la creu.

// ── Vectors enters ───────────────────────────────────────────────
export const V = (x, y, z) => ({ x, y, z });
export const clau = (a) => `${a.x},${a.y},${a.z}`;
export const igual = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z;
export const neg = (a) => V(-a.x, -a.y, -a.z);
export const creu = (a, b) => V(
  a.y * b.z - a.z * b.y,
  a.z * b.x - a.x * b.z,
  a.x * b.y - a.y * b.x,
);

// El paper és el pla XY mirat des de +Z: dreta = +X, avall = -Y.
// Una cara plana té marc u = +X (la seva dreta) i v = -Y (el seu avall);
// la seva normal exterior és n = v × u, i apunta cap a qui mira.
const U_PLA = V(1, 0, 0);
const V_PLA = V(0, -1, 0);

// Girs de doblegar. Cada pas pel desplegable doblega la resta cap enrere.
const R = {
  dreta: (p) => V(p.z, p.y, -p.x),
  esquerra: (p) => V(-p.z, p.y, p.x),
  amunt: (p) => V(p.x, p.z, -p.y),
  avall: (p) => V(p.x, -p.z, p.y),
};
const VEINS = [
  { dx: 1, dy: 0, gir: 'dreta' },
  { dx: -1, dy: 0, gir: 'esquerra' },
  { dx: 0, dy: -1, gir: 'amunt' },
  { dx: 0, dy: 1, gir: 'avall' },
];

/**
 * Plega un desplegable i retorna, per a cada casella, quina cara del cub
 * és i amb quin marc.
 *
 * `cel·les` és una llista de { nx, ny, dibuix }. La primera és la base i
 * es queda mirant qui llegeix.
 */
export function plega(celles) {
  const per = new Map(celles.map((c) => [`${c.nx},${c.ny}`, c]));
  const cares = new Map();          // "nx,ny" → { dibuix, u, v, n }
  const base = celles[0];
  // T és el que hem anat doblegant fins aquí. Es composa per la dreta:
  // fer un pas nou vol dir doblegar ABANS del que ja portàvem.
  const cua = [{ nx: base.nx, ny: base.ny, T: (p) => p }];
  cares.set(`${base.nx},${base.ny}`, marc(base, (p) => p));

  while (cua.length) {
    const { nx, ny, T } = cua.shift();
    for (const { dx, dy, gir } of VEINS) {
      const k = `${nx + dx},${ny + dy}`;
      if (!per.has(k) || cares.has(k)) continue;
      const g = R[gir];
      const Tn = (p) => T(g(p));
      cares.set(k, marc(per.get(k), Tn));
      cua.push({ nx: nx + dx, ny: ny + dy, T: Tn });
    }
  }
  return cares;
}

function marc(cella, T) {
  const u = T(U_PLA), v = T(V_PLA);
  return { dibuix: cella.dibuix, u, v, n: creu(v, u) };
}

/** Un desplegable és vàlid si les sis caselles donen sis cares diferents. */
export function valid(cares) {
  const n = new Set([...cares.values()].map((c) => clau(c.n)));
  return cares.size === 6 && n.size === 6;
}

// ── Girar el cub sencer ──────────────────────────────────────────
const GZ = (p) => V(-p.y, p.x, p.z);
const GX = (p) => V(p.x, -p.z, p.y);

export function orientacions(cub) {
  const empremta = (c) => c.map((f) => `${f.dibuix}${clau(f.u)}${clau(f.v)}`).sort().join('|');
  const gira = (c, g) => c.map((f) => ({ dibuix: f.dibuix, u: g(f.u), v: g(f.v), n: creu(g(f.v), g(f.u)) }));
  const vistes = new Map([[empremta(cub), cub]]);
  const cua = [cub];
  while (cua.length) {
    const c = cua.shift();
    for (const g of [GZ, GX]) {
      const n = gira(c, g), k = empremta(n);
      if (!vistes.has(k)) { vistes.set(k, n); cua.push(n); }
    }
  }
  return [...vistes.values()];
}

// ── Com es veu un cub en isomètrica ──────────────────────────────
// Es veuen tres cares: +Y a dalt, +Z a l'esquerra i +X a la dreta.
// Cadascuna té el seu marc de referència per al dibuix.
export const VISIBLES = [
  { n: V(0, 1, 0), u: V(1, 0, 0), v: V(0, 0, 1) },   // dalt
  { n: V(0, 0, 1), u: V(1, 0, 0), v: V(0, -1, 0) },  // esquerra
  { n: V(1, 0, 0), u: V(0, 0, -1), v: V(0, -1, 0) }, // dreta
];

/** Quants quarts de volta hi ha del marc de referència al marc real. */
function quarts(cara, ref) {
  if (igual(cara.u, ref.u)) return 0;
  if (igual(cara.u, ref.v)) return 1;
  if (igual(cara.u, neg(ref.u))) return 2;
  return 3;
}

export function vistaDe(cub) {
  return VISIBLES.map((ref) => {
    const cara = cub.find((f) => igual(f.n, ref.n));
    return `${cara.dibuix}@${quarts(cara, ref)}`;
  });
}

// ── Formes de desenvolupament ────────────────────────────────────
// Perquè no vagin tots amb la mateixa creu: als exàmens n'hi ha de creu,
// de T, de tira amb esglaons i de L.
export const FORMES = {
  creu: [[1, 1], [1, 0], [0, 1], [2, 1], [3, 1], [1, 2]],
  te: [[1, 1], [0, 1], [2, 1], [3, 1], [1, 0], [2, 0]],
  zigazaga: [[0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [3, 1]],
  ela: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [2, 1]],
  escala: [[0, 1], [1, 1], [1, 0], [2, 1], [2, 2], [3, 2]],
  tira: [[0, 1], [1, 1], [2, 1], [2, 0], [3, 1], [3, 2]],
};
