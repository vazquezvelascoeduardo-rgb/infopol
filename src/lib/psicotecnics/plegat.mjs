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

// ── Orientació amb volteig ───────────────────────────────────────
// `quarts` només sap tornar girs, i amb girs no n'hi ha prou: una cara
// vista des de dins —que és el que passa amb el mirall— surt capgirada, i
// cap gir no fa això. `orientacio` torna { q, volteig }: primer s'inverteix
// esquerra-dreta si toca, i després es gira q quarts de volta.
//
// El marc de referència pot ser dels dos sentits. Per això el gir de 90°
// no es fa al voltant de la normal de fora, sinó al voltant de v×u, que és
// cap a on mira el marc: així ρ(u)=v i ρ(v)=−u sempre.
export function orientacio(cara, ref) {
  const eix = creu(ref.v, ref.u);
  const rho = (w) => creu(w, eix);
  let u = ref.u, v = ref.v;
  for (let q = 0; q < 4; q++) {
    if (igual(cara.u, u) && igual(cara.v, v)) return { q, volteig: false };
    if (igual(cara.u, neg(u)) && igual(cara.v, v)) return { q, volteig: true };
    u = rho(u); v = rho(v);
  }
  return null;   // no pot passar: les vuit possibilitats hi són totes
}

// ── Les dues vistes: el cub i el seu mirall ──────────────────────
// El cub es mira des del vèrtex (1,1,1). Es veuen les cares +Y, +Z i +X.
//
// El mirall és un pla darrere del cub, de cara a qui mira. Amb aquesta
// col·locació —i només amb aquesta— el reflex ensenya justament les tres
// cares amagades. I com que el pla del mirall no toca les direccions de la
// pantalla, el reflex es projecta exactament on es projectaria el cub: el
// mateix hexàgon, però amb les cares del darrere. Per això no cal reflectir
// res per dibuixar-lo; n'hi ha prou de dibuixar les cares de darrere.
//
// Es veuen des de dins, i per això els seus marcs tenen v×u = −n: qualsevol
// cara de veritat hi surt amb volteig. Aquesta és la marca del mirall.
export const VISTA_CUB = [
  { nom: 'dalt',     n: V(0, 1, 0), o: V(0, 1, 0), u: V(1, 0, 0),  v: V(0, 0, 1) },
  { nom: 'esquerra', n: V(0, 0, 1), o: V(0, 1, 1), u: V(1, 0, 0),  v: V(0, -1, 0) },
  { nom: 'dreta',    n: V(1, 0, 0), o: V(1, 1, 1), u: V(0, 0, -1), v: V(0, -1, 0) },
];

export const VISTA_MIRALL = [
  { nom: 'baix',      n: V(0, -1, 0), o: V(0, 0, 0), u: V(1, 0, 0),  v: V(0, 0, 1) },
  { nom: 'darrere-d', n: V(0, 0, -1), o: V(0, 1, 0), u: V(1, 0, 0),  v: V(0, -1, 0) },
  { nom: 'darrere-e', n: V(-1, 0, 0), o: V(0, 1, 0), u: V(0, -1, 0), v: V(0, 0, 1) },
];

// Les sis cares mirades des de fora. Serveix per fer l'empremta d'un cub:
// dos cubs són el mateix si alguna de les 24 orientacions els iguala.
export const CARES = [
  { nom: '+Y', n: V(0, 1, 0),  o: V(0, 1, 0), u: V(1, 0, 0),  v: V(0, 0, 1) },
  { nom: '+Z', n: V(0, 0, 1),  o: V(0, 1, 1), u: V(1, 0, 0),  v: V(0, -1, 0) },
  { nom: '+X', n: V(1, 0, 0),  o: V(1, 1, 1), u: V(0, 0, -1), v: V(0, -1, 0) },
  { nom: '-Y', n: V(0, -1, 0), o: V(0, 0, 1), u: V(1, 0, 0),  v: V(0, 0, -1) },
  { nom: '-Z', n: V(0, 0, -1), o: V(0, 0, 0), u: V(1, 0, 0),  v: V(0, 1, 0) },
  { nom: '-X', n: V(-1, 0, 0), o: V(0, 1, 0), u: V(0, 0, 1),  v: V(0, -1, 0) },
];

/** Què es veu a cada posició d'una vista: el dibuix, el gir i el volteig. */
export function vista(cub, refs) {
  return refs.map((ref) => {
    const cara = cub.find((f) => igual(f.n, ref.n));
    const { q, volteig } = orientacio(cara, ref);
    return { dibuix: cara.dibuix, q, volteig };
  });
}

// ── El mirall de l'examen ────────────────────────────────────────
// Un mirall pla, VERTICAL, posat darrere del cub i girat 45°. És el que es
// veu dibuixat al material: un paral·lelogram inclinat al darrere.
//
// Cap mirall pla no pot ensenyar les TRES cares amagades en la postura
// isomètrica de sempre. Això no és una limitació del dibuix, és que no
// existeix; i per això l'enunciat de l'examen diu "algunes de les cares
// ocultes". Aquest n'ensenya dues —la del darrere i la de l'esquerra— i
// repeteix la de DALT, que és justament la que permet orientar el reflex.
//
// La que no es veu enlloc és la de BAIX. Aquesta és la casella que als
// desplegables de l'examen va en blanc.
//
// El pla del mirall és el que contenen la vertical i la direcció (1,0,−1);
// la seva normal és (1,0,1), que mira cap a qui llegeix.
export const reflex = (p) => V(-p.z, p.y, -p.x);

/** La imatge d'un cub al mirall. Surt girada del revés: v×u passa a ser −n. */
export function reflecteix(cub) {
  return cub.map((f) => ({
    dibuix: f.dibuix, u: reflex(f.u), v: reflex(f.v), n: reflex(f.n),
  }));
}

// ── Projecció isomètrica ─────────────────────────────────────────
// El cub va de 0 a 1 als tres eixos. +Y puja a la pantalla; +X baixa cap a
// la dreta i +Z cap a l'esquerra. La y de la pantalla creix cap avall.
export const K = Math.cos(Math.PI / 6);
export const projecta = (p, s = 1) => ({
  x: (p.x - p.z) * K * s,
  y: ((p.x + p.z) * 0.5 - p.y) * s,
});
export const suma = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
export const escala = (a, k) => V(a.x * k, a.y * k, a.z * k);

const punt = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

/** El cantó de la cara on comença el marc (o, o+u, o+v i o+u+v hi són tots). */
export function origen(cara) {
  const vertexs = [];
  for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) vertexs.push(V(x, y, z));
  // El pla de la cara: els quatre vèrtexs que van més enllà en la normal.
  const top = Math.max(...vertexs.map((p) => punt(p, cara.n)));
  const cantons = vertexs.filter((p) => punt(p, cara.n) === top);
  const dins = (p) => cantons.some((c) => igual(c, p));
  return cantons.find((o) => dins(suma(o, cara.u)) && dins(suma(o, cara.v))
    && dins(suma(suma(o, cara.u), cara.v)));
}

// ── Formes de desenvolupament ────────────────────────────────────
// Perquè no vagin tots amb la mateixa creu: als exàmens n'hi ha de creu,
// de T, de tira amb esglaons i de L.
// Totes sis passen el control de `valid`. N'hi havia tres que no plegaven
// —dues peces del mateix costat de la tira, i un quadrat de 2×2— i el
// control les va enxampar. Si se'n toca cap, que les proves ho tornin a dir.
export const FORMES = {
  creu: [[1, 1], [1, 0], [0, 1], [2, 1], [3, 1], [1, 2]],
  te: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]],
  zigazaga: [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]],
  ela: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]],
  escala: [[0, 1], [1, 1], [1, 0], [2, 1], [2, 2], [3, 2]],
  tira: [[0, 1], [1, 1], [2, 1], [2, 0], [3, 1], [3, 2]],
};
