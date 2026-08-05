// Proves del punt de fuga.
//
// La comprovació és la mateixa que al disc, i per un motiu: canviar l'ull
// de lloc és girar l'escena. Per tant s'alinea l'ull i es compara el
// contingut, que és exactament el que fa qui resol l'exercici.
//
// I es comprova que l'escena no sigui simètrica. Si ho fos, el seu reflex
// es podria fer coincidir girant-lo, i els distractors —que són reflexos—
// també serien respostes bones.
import * as F from './fuga.mjs';

let fets = 0, fallats = 0;
const cal = (nom, condicio, detall = '') => {
  fets++;
  if (condicio) return;
  fallats++;
  if (fallats <= 12) console.log(`  FALLA  ${nom}${detall ? ' — ' + detall : ''}`);
};
const titol = (t) => console.log(`\n${t}`);

titol('1. Girar i reflectir es comporten com han de fer-ho');
{
  for (let s = 1; s <= 60; s++) {
    const e = F.generaItem(s).model;
    for (let k = 0; k < 12; k++) {
      cal('girar no canvia el contingut un cop alineat l\'ull',
        F.clau(F.gira(e, k)) === F.clau(e), `k=${k}`);
    }
    cal('dotze girs tornen a l\'origen', JSON.stringify(F.gira(e, 12)) === JSON.stringify(e));
    cal('reflectir dues vegades no fa res',
      JSON.stringify(F.reflecteix(F.reflecteix(e))) === JSON.stringify(e));
    if (!F.esSimetrica(e)) {
      cal('reflectir SÍ que el canvia', F.clau(F.reflecteix(e)) !== F.clau(e));
      for (let k = 0; k < 12; k++) {
        cal('i no hi ha cap gir que ho arregli',
          F.clau(F.gira(F.reflecteix(e), k)) !== F.clau(e), `k=${k}`);
      }
    }
  }
}

// ── Cap objecte no pot estar dibuixat simètric ───────────────────
// Aquesta prova hi és perquè em va faltar, i el que passava era greu de
// debò: hi havia ítems amb DUES respostes que es miraven igual.
//
// El motiu. Els distractors són reflexos, i un reflex es nota perquè les
// coses queden del revés. Però el cotxe estava dibuixat amb la finestra al
// mig i l'arbre amb la copa centrada: voltejar-los no es veia. La clau que
// fa servir el programa sí que compta el volteig, o sigui que deia que el
// distractor era diferent de la bona... i a la pantalla es veien iguals.
// Sis ítems de cada quatre mil.
//
// Ara cap objecte no és simètric i es comprova un per un, amb números: es
// treuen tots els punts del dibuix —amb el color i tot, perquè dues formes
// iguals de colors diferents també es distingeixen— i es mira si el conjunt
// és el mateix després de girar-lo com un mirall. Si ho fos, voltejar
// l'objecte no es veuria i la família tornaria a tenir el forat.
function puntsDe(svg) {
  const punts = [];
  const posa = (x, y, color) => punts.push({ x, y, color });
  for (const m of svg.matchAll(/<polygon points="([^"]+)" fill="([^"]+)"/g)) {
    for (const p of m[1].trim().split(/\s+/)) {
      const [x, y] = p.split(',').map(Number);
      posa(x, y, m[2]);
    }
  }
  for (const m of svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="([^"]+)"/g)) {
    const [x, y, w, h] = [1, 2, 3, 4].map((i) => Number(m[i]));
    posa(x, y, m[5]); posa(x + w, y, m[5]); posa(x, y + h, m[5]); posa(x + w, y + h, m[5]);
  }
  for (const m of svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)" fill="([^"]+)"/g)) {
    const [x, y, r] = [1, 2, 3].map((i) => Number(m[i]));
    posa(x - r, y, m[4]); posa(x + r, y, m[4]); posa(x, y - r, m[4]); posa(x, y + r, m[4]);
  }
  return punts;
}

/**
 * Si dos conjunts de punts són el mateix dibuix. Amb un pèl de marge, no
 * amb igualtat exacta: les coordenades van escrites amb un decimal, i dos
 * dibuixos que a la pantalla són idèntics poden sortir amb una dècima de
 * diferència. Comparant-los clavats, un objecte simètric de debò passaria
 * per asimètric només per l'arrodoniment —m'hi vaig trobar comprovant que
 * aquesta prova enxampés el cotxe vell.
 */
function mateixDibuix(a, b, tol = 0.25) {
  if (a.length !== b.length) return false;
  const lliures = [...b];
  for (const p of a) {
    const i = lliures.findIndex((q) => q.color === p.color
      && Math.abs(q.x - p.x) <= tol && Math.abs(q.y - p.y) <= tol);
    if (i === -1) return false;
    lliures.splice(i, 1);
  }
  return true;
}

titol('1b. Cap objecte no està dibuixat simètric');
{
  const tipus = [...new Set(Object.values(F.ESCENES).flatMap((e) => e.objectes))];
  cal('hi ha objectes a mirar', tipus.length >= 6, `${tipus.length}`);
  for (const t of tipus) {
    const svg = F.svgObjecte(t);
    const punts = puntsDe(svg);
    cal(`${t}: el dibuix es pot mesurar`, punts.length >= 4, `${t}: ${punts.length} punts`);
    // El mateix conjunt de punts, però com si l'haguessin posat davant d'un
    // mirall vertical.
    const mirat = punts.map((p) => ({ ...p, x: -p.x }));
    cal(`${t}: no és simètric, o sigui que voltejar-lo es nota`,
      !mateixDibuix(punts, mirat), t);
    cal(`${t}: no fa servir corbes, que no es podrien mesurar`,
      !/<path/.test(svg), t);
  }
}

titol('1c. No hi ha dos opcions que es vegin igual');
{
  // La comprovació de debò: dues opcions no poden tenir el mateix dibuix.
  // Es comparen TAL COM ES PINTEN, sense alinear res —alineant l'ull els
  // tres distractors es fondrien en un, perquè són el mateix reflex amb
  // l'ull en tres llocs, i a la pantalla es veuen ben diferents.
  //
  // I no es compara el TEXT del SVG, sinó on cauen els punts de debò. La
  // diferència importa: un objecte voltejat porta un `scale(-1 1)` a dins,
  // o sigui que el text sempre surt diferent encara que a la pantalla es
  // vegi exactament igual. Que és justament el que passava. Aquí es
  // resolen les translacions i els voltejos primer, i després es mira on ha
  // quedat cada punt.
  const resol = (svg) => svg.replace(
    /<g transform="translate\(([-\d.]+) ([-\d.]+)\)( scale\(-1 1\))?">(.*?)<\/g>/gs,
    (_, tx, ty, volteig, dins) => {
      const k = volteig ? -1 : 1;
      const mou = (x, y) => [Number(tx) + k * Number(x), Number(ty) + Number(y)];
      return dins
        .replace(/points="([^"]+)"/g, (__, p) => `points="${p.trim().split(/\s+/)
          .map((q) => mou(...q.split(',')).map((v) => v.toFixed(2)).join(',')).join(' ')}"`)
        .replace(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)"/g, (__, x, y, w) => {
          // En voltejar, el rectangle es dibuixa des de l'altre cantó.
          const [nx, ny] = mou(volteig ? Number(x) + Number(w) : x, y);
          return `<rect x="${nx.toFixed(2)}" y="${ny.toFixed(2)}" width="${w}"`;
        })
        .replace(/<circle cx="([-\d.]+)" cy="([-\d.]+)"/g, (__, x, y) => {
          const [nx, ny] = mou(x, y);
          return `<circle cx="${nx.toFixed(2)}" cy="${ny.toFixed(2)}"`;
        });
    });

  for (let seed = 1; seed <= 600; seed++) {
    const it = F.generaItem(seed);
    const cares = it.opcions.map((_, i) => {
      const p = puntsDe(resol(F.svgOpcio(it, i)));
      cal('el dibuix de l\'opció es pot mesurar', p.length > 8, `llavor ${seed}`);
      return p;
    });
    for (let a = 0; a < 4; a++) {
      for (let b = a + 1; b < 4; b++) {
        cal('les quatre opcions es veuen diferents', !mateixDibuix(cares[a], cares[b]),
          `llavor ${seed}: ${'ABCD'[a]} i ${'ABCD'[b]} es veuen igual`);
      }
    }
  }
}

const N = 250;
titol(`2. ${N} ítems, alineant l'ull a mà`);
const lletres = [0, 0, 0, 0];
for (let seed = 1; seed <= N; seed++) {
  const it = F.generaItem(seed);
  lletres[it.correcta]++;
  for (const [nom, v] of Object.entries(it.control)) {
    if (typeof v === 'boolean') cal(`control ${nom}`, v, `llavor ${seed}`);
  }
  cal('només una opció coincideix', it.control.quantesCoincideixen === 1,
    `llavor ${seed}: ${it.control.quantesCoincideixen}`);

  const objectiu = F.clau(it.model);
  const bones = it.opcions.filter((o) => F.clau(o) === objectiu);
  cal('en coincideix exactament una', bones.length === 1, `llavor ${seed}: ${bones.length}`);
  cal('i és la marcada', F.clau(it.opcions[it.correcta]) === objectiu, `llavor ${seed}`);

  // Les altres tres han de ser reflexos, no girs.
  it.opcions.forEach((o, i) => {
    if (i === it.correcta) return;
    const esGir = Array.from({ length: 12 }, (_, k) => F.clau(F.gira(it.model, k))).includes(F.clau(o));
    cal('els distractors no són girs', !esGir, `llavor ${seed}, opció ${'ABCD'[i]}`);
    const esReflex = Array.from({ length: 12 }, (_, k) =>
      F.clau(F.gira(F.reflecteix(it.model), k))).includes(F.clau(o));
    cal('els distractors són reflexos', esReflex, `llavor ${seed}, opció ${'ABCD'[i]}`);
  });

  // Que no es pugui respondre sense girar: totes han de portar el mateix.
  const peces = (e) => e.objectes.map((o) => o.tipus).sort().join(',');
  cal('totes porten els mateixos objectes',
    it.opcions.every((o) => peces(o) === peces(it.model)), `llavor ${seed}`);
  cal('i són la mateixa mena d\'escena',
    it.opcions.every((o) => o.mena === it.model.mena), `llavor ${seed}`);
  cal('la bona no té l\'ull on el tenia el model',
    it.opcions[it.correcta].ull !== it.model.ull, `llavor ${seed}`);
  cal('els quatre ulls són diferents',
    new Set(it.opcions.map((o) => o.ull)).size === 4, `llavor ${seed}`);
}
console.log(`  lletra bona:  A ${lletres[0]}   B ${lletres[1]}   C ${lletres[2]}   D ${lletres[3]}`);
cal('la lletra bona va repartida',
  lletres.every((l) => Math.abs(l - N / 4) < N / 8), lletres.join('/'));

titol('3. Varietat i dibuix');
{
  const vistes = new Set();
  for (let seed = 1; seed <= 400; seed++) vistes.add(F.clau(F.generaItem(seed).model));
  cal('dos-cents ítems diferents com a mínim', vistes.size >= 200, `${vistes.size}`);
  console.log(`  ${vistes.size} escenes diferents de 400 llavors`);

  const it = F.generaItem(1);
  const e = F.svgEnunciat(it), o = F.svgOpcio(it, 0);
  cal('l\'enunciat és un SVG sencer', e.startsWith('<svg') && !/NaN|undefined/.test(e));
  cal('l\'opció també', o.startsWith('<svg') && !/NaN|undefined/.test(o));
  cal('porten viewBox', e.includes('viewBox') && o.includes('viewBox'));
  // Cada escena té el seu clipPath amb un identificador únic: si es
  // repetissin, els discs es retallarien els uns amb els altres.
  const full = F.svgFull([1, 2, 3].map((s) => F.generaItem(s)));
  const ids = [...full.matchAll(/<clipPath id="([^"]+)"/g)].map((m) => m[1]);
  cal('cap identificador de retall repetit', new Set(ids).size === ids.length,
    `${ids.length} retalls, ${new Set(ids).size} diferents`);
  cal('el full surt sencer', !/NaN|undefined/.test(full));
  cal('hi ha les cinc escenes de cada ítem', ids.length === 3 * 5, `${ids.length}`);
}

console.log(`\n${fets - fallats}/${fets} proves passades`
  + (fallats ? `  —  ${fallats} FALLADES` : '  —  tot correcte'));
process.exit(fallats ? 1 : 0);
