// "Es presenta un cub i un mirall, on es mostren les cares ocultes.
//  Quina de les següents opcions, un cop formada, representa el cub?"
//
// Com als exàmens: un dau de punts amb una cara pintada de negre. La cara
// negra no és decoració —trenca la regla que les oposades sumin set, que si
// no faria l'ítem regalat: amb tres cares en sabries les altres tres.
//
// El mirall és un pla darrere del cub. Amb aquesta col·locació el reflex
// ensenya justament les tres cares amagades, i es projecta al mateix
// hexàgon que el cub però amb les cares del darrere. Es veuen des de dins,
// i per això surten capgirades: aquesta és la feina del volteig.
//
// El que fa que l'ítem tingui una sola resposta no és el número de cada
// cara, és com es veu. El 2, el 3 i el 6 canvien si els gires; l'1, el 4,
// el 5 i la negra, no. Per això aquí una cara no és un nom, és una
// màscara de 3×3, i dues cares són la mateixa només si es veuen igual.
import * as P from './plegat.mjs';

// ── Atzar repetible ──────────────────────────────────────────────
function rng(seed) {
  let s = (seed * 2654435761) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const tria = (r, a) => a[Math.floor(r() * a.length)];
// Barreja de debò. La d'abans, `sort(() => r() - 0.5)`, no reparteix igual:
// és el motiu que la lletra bona sortís desigual.
function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ── Les cares del dau ────────────────────────────────────────────
// Els punts, en una graella de 3×3. Files de dalt a baix, columnes
// d'esquerra a dreta.
export const PUNTS = {
  1: '000010000',
  2: '100000001',
  3: '100010001',
  4: '101000101',
  5: '101010101',
  6: '101101101',
};

const rot90 = (m) => {           // un quart de volta en sentit horari
  let o = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o += m[(2 - c) * 3 + r];
  return o;
};
const volteja = (m) => {         // scale(-1,1): esquerra i dreta canviades
  let o = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o += m[r * 3 + (2 - c)];
  return o;
};

/** Com queda una cara després de voltejar-la i girar-la q quarts. */
export function capgira(cara, q, volteig) {
  // La negra i la blanca es veuen igual de qualsevol manera.
  if (cara.tipus !== 'punts') return cara;
  let m = volteig ? volteja(cara.m) : cara.m;
  for (let i = 0; i < q; i++) m = rot90(m);
  return { tipus: 'punts', num: cara.num, m };
}
/** Dues cares són la mateixa si es veuen igual. El número no compta. */
export const aspecte = (c) => (c.tipus === 'punts' ? `p${c.m}` : c.tipus);

/** Quantes cares diferents té una cara segons com la giris i la voltegis. */
export function aspectes(cara) {
  const vistos = new Set();
  for (let q = 0; q < 4; q++) for (const v of [false, true]) {
    vistos.add(aspecte(capgira(cara, q, v)));
  }
  return vistos.size;
}

// ── Formes de desenvolupament ────────────────────────────────────
// Es generen i es filtren pel control: només queden les que pleguen.
function formesValides() {
  const cands = [];
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
    cands.push([[0, 1], [1, 1], [2, 1], [3, 1], [a, 0], [b, 2]]);
  }
  cands.push([[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]]);
  cands.push([[0, 1], [1, 1], [1, 0], [2, 1], [2, 2], [3, 2]]);
  cands.push([[0, 1], [1, 1], [2, 1], [2, 0], [3, 1], [3, 2]]);
  return cands.filter((f) => {
    if (new Set(f.map((c) => c.join(','))).size !== 6) return false;
    return P.valid(P.plega(f.map(([nx, ny], i) => ({ nx, ny, dibuix: 'c' + i }))));
  });
}
export const FORMES = formesValides();

// ── Del desplegable al cub ───────────────────────────────────────
const clau = (cara) => (cara.tipus === 'punts' ? `p:${cara.num}:${cara.m}` : cara.tipus);
const descla = (k) => (k.startsWith('p:')
  ? { tipus: 'punts', num: Number(k.split(':')[1]), m: k.split(':')[2] }
  : { tipus: k });

const munta = (celles) => [...P.plega(celles.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: clau(c.cara) }))).values()];

/** Què es veu, cara per cara, en una de les dues vistes. */
const comEsVeu = (cub, refs) => P.vista(cub, refs)
  .map((f) => aspecte(capgira(descla(f.dibuix), f.q, f.volteig)));

/**
 * Les dues vistes juntes: el cub i el seu reflex al mirall.
 *
 * Els dos es dibuixen en postura isomètrica normal. El reflex ensenya la
 * cara de dalt (repetida, i per això es pot orientar), la del darrere i la
 * de l'esquerra. La de BAIX no surt enlloc: és la casella en blanc.
 */
const escena = (cub) => [
  ...comEsVeu(cub, P.VISTA_CUB),
  ...comEsVeu(P.reflecteix(cub), P.VISTA_CUB),
].join('|');

/** La cara que no es veu ni al cub ni al mirall: la de baix. */
const caraDeBaix = (cub) => cub.find((f) => P.igual(f.n, P.V(0, -1, 0)));

/** Un desplegable respon a l'escena si alguna de les 24 posicions la dona. */
const respon = (celles, esc) => P.orientacions(munta(celles)).some((c) => escena(c) === esc);

/**
 * El camí invers: d'un cub, un desplegable.
 *
 * Fa falta per als ítems on el que es demana és la que NO correspon: allà
 * calen TRES desplegables diferents que plequen tots al mateix cub, i a
 * mà no en surten. Es plega la forma amb marques per saber quin marc li
 * toca a cada casella, i després s'hi posa el dibuix de la cara que hi va,
 * girat el que calgui perquè en plegar quedi ben posat.
 *
 * Que això sigui correcte no me'l crec jo: es comprova plegant el que surt
 * i mirant que doni el cub de partida.
 */
function desplega(cub, forma) {
  const buit = P.plega(forma.map(([nx, ny], i) => ({ nx, ny, dibuix: '#' + i })));
  const celles = [];
  for (const [k, marc] of buit) {
    const [nx, ny] = k.split(',').map(Number);
    const f = cub.find((c) => P.igual(c.n, marc.n));
    if (!f) return null;
    const o = P.orientacio(f, marc);
    // Els dos marcs són de fora del cub: aquí no hi pot haver volteig.
    if (!o || o.volteig) return null;
    celles.push({ nx, ny, cara: capgira(descla(f.dibuix), o.q, false) });
  }
  return celles.length === 6 ? celles : null;
}

/** Empremta d'un cub: la mateixa per a dos desplegables que donin el mateix cub. */
const empremta = (celles) => P.orientacions(munta(celles))
  .map((c) => P.vista(c, P.CARES).map((f) => aspecte(capgira(descla(f.dibuix), f.q, f.volteig))).join(','))
  .sort()[0];

// ── Generació d'un ítem ──────────────────────────────────────────
// Hi ha dues maneres de preguntar-ho, i als exàmens surten totes dues:
//
//  · CORRECTA   — quina de les quatre representa el cub. N'hi ha una que
//    respon i tres que no.
//  · INCORRECTA — quina NO el representa. Aleshores són TRES les que
//    responen i una la que no, i això obliga a fabricar tres desplegables
//    diferents que pleguin tots al mateix cub. Per això hi ha `desplega`.
export const CORRECTA = 'correcta';
export const INCORRECTA = 'incorrecta';

/** Com es veu un desplegable: la forma i el que porta cada casella. */
const pintaDe = (celles) => {
  const mx = Math.min(...celles.map((c) => c.nx));
  const my = Math.min(...celles.map((c) => c.ny));
  return [...celles]
    .map((c) => `${c.nx - mx},${c.ny - my}:${aspecte(c.cara)}`)
    .sort().join('|');
};

export function generaItem(seed, mena = CORRECTA) {
  const r = rng(seed);

  for (let intent = 0; intent < 400; intent++) {
    const forma = tria(r, FORMES);
    // Cinc números diferents i una cara negra, repartits per les caselles.
    const nums = barreja(r, [1, 2, 3, 4, 5, 6]).slice(0, 5);
    const bossa = barreja(r, [...nums.map((n) => ({ tipus: 'punts', num: n, m: PUNTS[n] })), { tipus: 'negra' }]);
    const bones = forma.map(([nx, ny], i) => ({
      nx, ny, cara: capgira(bossa[i], Math.floor(r() * 4), false),
    }));

    const cub = munta(bones);
    const totes = P.orientacions(cub);
    const mostrat = tria(r, totes);
    const esc = escena(mostrat);

    // La cara de baix no es veu ni al cub ni al mirall, i per això al
    // desplegable va en blanc. És el que diu l'enunciat de l'examen: "las
    // caras posteriores de los desarrollos están en blanco".
    const amagada = caraDeBaix(mostrat).dibuix;
    const ambBlanc = (llista) => llista.map((c) => (clau(c.cara) === amagada
      ? { ...c, cara: { tipus: 'blanca' } } : c));
    const bonesB = ambBlanc(bones);
    if (!respon(bonesB, esc)) continue;      // ha de seguir responent

    // Els que responen, si en calen tres: el desplegable de partida i dos
    // més fets desplegant el mateix cub, girat, sobre altres formes.
    const responen = [bonesB];
    if (mena === INCORRECTA) {
      for (const forma2 of barreja(r, FORMES)) {
        if (responen.length === 3) break;
        for (const girat of barreja(r, totes)) {
          const d = desplega(girat, forma2);
          if (!d) continue;
          if (responen.some((b) => pintaDe(b) === pintaDe(d))) continue;
          if (!respon(d, esc)) continue;          // ha de sortir el mateix cub
          responen.push(d);
          break;
        }
      }
      if (responen.length < 3) continue;
    }

    // Distractors: el mateix desplegable amb algun canvi que el faci un
    // altre cub. Es comprova que cap no respongui a l'escena.
    const calen = mena === INCORRECTA ? 1 : 3;
    const dolents = [];
    for (let i = 0; i < 3000 && dolents.length < calen; i++) {
      const c = bonesB.map((x) => ({ ...x }));
      const quantes = r() < 0.6 ? 1 : 2;
      for (let k = 0; k < quantes; k++) {
        if (r() < 0.55) {                       // girar el dibuix d'una casella
          const j = Math.floor(r() * 6);
          c[j] = { ...c[j], cara: capgira(c[j].cara, 1 + Math.floor(r() * 3), false) };
        } else {                                // bescanviar dues caselles
          const j = Math.floor(r() * 6);
          let l = Math.floor(r() * 6);
          if (l === j) l = (j + 1) % 6;
          const t = c[j].cara; c[j] = { ...c[j], cara: c[l].cara }; c[l] = { ...c[l], cara: t };
        }
      }
      if (responen.some((b) => pintaDe(b) === pintaDe(c))) continue;         // es veu igual
      if (dolents.some((d) => pintaDe(d) === pintaDe(c))) continue;
      if (respon(c, esc)) continue;                                         // seria correcta
      if (empremta(c) === empremta(bonesB)) continue;                        // és el mateix cub
      dolents.push(c);
    }
    if (dolents.length < calen) continue;

    // La lletra que s'ha de marcar, repartida de debò: es tria la posició,
    // no es barreja. A la variant INCORRECTA la marcada és la que NO respon.
    const correcta = Math.floor(r() * 4);
    const resta = mena === INCORRECTA ? responen : dolents;
    const marcada = mena === INCORRECTA ? dolents[0] : bonesB;
    const opcions = [];
    let d = 0;
    for (let i = 0; i < 4; i++) opcions.push(i === correcta ? marcada : resta[d++]);

    return {
      seed, mena,
      celles: bonesB,
      vistaCub: P.vista(mostrat, P.VISTA_CUB).map((f) => capgira(descla(f.dibuix), f.q, f.volteig)),
      vistaMirall: P.vista(P.reflecteix(mostrat), P.VISTA_CUB)
        .map((f) => capgira(descla(f.dibuix), f.q, f.volteig)),
      opcions,
      correcta,
      control: {
        formaPlega: P.valid(P.plega(bones.map((c) => ({ nx: c.nx, ny: c.ny, dibuix: clau(c.cara) })))),
        orientacions: totes.length,
        // Quantes de les sis cares canvien d'aspecte si les gires: són les
        // que fan que l'ítem es pugui resoldre.
        caresAmbInformacio: bones.filter((c) => aspectes(c.cara) > 1).length,
        respostesQueEncaixen: opcions.filter((o) => respon(o, esc)).length,
        // La que s'ha de marcar ha de ser l'única que es comporta al revés
        // que les altres tres.
        marcadaEsLaBona: mena === INCORRECTA
          ? !respon(opcions[correcta], esc) : respon(opcions[correcta], esc),
        opcionsDiferents: new Set(opcions.map(pintaDe)).size === 4,
        miraTotVolteig: P.vista(P.reflecteix(mostrat), P.VISTA_CUB).every((f) => f.volteig),
        cubSenseVolteig: P.vista(mostrat, P.VISTA_CUB).every((f) => !f.volteig),
        // El reflex repeteix la cara de dalt i n'ensenya dues d'amagades.
        daltEsRepeteix: P.vista(mostrat, P.VISTA_CUB)[0].dibuix
          === P.vista(P.reflecteix(mostrat), P.VISTA_CUB)[0].dibuix,
        caresConegudes: new Set([
          ...P.vista(mostrat, P.VISTA_CUB).map((f) => f.dibuix),
          ...P.vista(P.reflecteix(mostrat), P.VISTA_CUB).map((f) => f.dibuix),
        ]).size,
        unaSolaEnBlanc: bonesB.filter((c) => c.cara.tipus === 'blanca').length === 1,
      },
    };
  }
  throw new Error(`no s'ha pogut generar l'ítem ${seed}`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#15151C';

/** Els punts d'una cara, dins del quadrat unitat. */
function cara(c, radi = 0.115) {
  if (c.tipus === 'blanca') return '';        // la cara que no es veu enlloc
  if (c.tipus === 'negra') return `<rect x="0" y="0" width="1" height="1" fill="${NEGRE}"/>`;
  let s = '';
  for (let r = 0; r < 3; r++) for (let col = 0; col < 3; col++) {
    if (c.m[r * 3 + col] !== '1') continue;
    s += `<circle cx="${(col + 0.5) / 3}" cy="${(r + 0.5) / 3}" r="${radi}" fill="${NEGRE}"/>`;
  }
  return s;
}

/** Un cub en isomètrica. `refs` diu quines tres cares es veuen. */
function hexagon(cx, cy, refs, cares, s, gir180) {
  const pt = (p) => {
    const q = P.projecta(p, s);
    return gir180 ? { x: cx - q.x, y: cy - q.y } : { x: cx + q.x, y: cy + q.y };
  };
  return refs.map((ref, i) => {
    const O = pt(ref.o);
    const A = pt(P.suma(ref.o, ref.u));
    const B = pt(P.suma(ref.o, ref.v));
    const C = pt(P.suma(P.suma(ref.o, ref.u), ref.v));
    const pts = [O, A, C, B].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const m = `matrix(${(A.x - O.x).toFixed(4)} ${(A.y - O.y).toFixed(4)} `
      + `${(B.x - O.x).toFixed(4)} ${(B.y - O.y).toFixed(4)} ${O.x.toFixed(3)} ${O.y.toFixed(3)})`;
    return `<polygon points="${pts}" fill="#fff"/><g transform="${m}">${cara(cares[i])}</g>`
      + `<polygon points="${pts}" fill="none" stroke="${NEGRE}" stroke-width="1.4" stroke-linejoin="round"/>`;
  }).join('');
}

function desplegable(x, y, celles, c = 23) {
  const minX = Math.min(...celles.map((e) => e.nx));
  const minY = Math.min(...celles.map((e) => e.ny));
  return celles.map((e) => {
    const px = x + (e.nx - minX) * c, py = y + (e.ny - minY) * c;
    return `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff"/>`
      + `<g transform="matrix(${c} 0 0 ${c} ${px} ${py})">${cara(e.cara, 0.1)}</g>`
      + `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="none" stroke="${NEGRE}" stroke-width="1.2"/>`;
  }).join('');
}
const ampladaDesplegable = (celles, c = 23) =>
  (Math.max(...celles.map((e) => e.nx)) - Math.min(...celles.map((e) => e.nx)) + 1) * c;

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

/**
 * Un ítem sencer.
 *
 * Com al material de l'acadèmia: el mirall és un paral·lelogram inclinat al
 * darrere, el reflex va a dalt a l'esquerra i el cub a baix a la dreta, i
 * tots dos es dibuixen en postura isomètrica normal.
 */
export function svgItem(item, num, y0 = 0) {
  const s = 27;
  const escena = `<g>
    <polygon points="20,${y0 + 52} 176,${y0 + 44} 176,${y0 + 140} 20,${y0 + 148}"
      fill="none" stroke="#9aa0a6" stroke-width="1.2"/>
    ${hexagon(78, y0 + 84, P.VISTA_CUB, item.vistaMirall, s * 0.78, false)}
    ${hexagon(146, y0 + 136, P.VISTA_CUB, item.vistaCub, s, false)}
  </g>`;
  const amples = item.opcions.map((o) => ampladaDesplegable(o));
  let x = 316;
  const opcions = item.opcions.map((o, i) => {
    const bloc = `${txt(x, y0 + 56, 'ABCD'[i], 12, 700)}${desplegable(x, y0 + 62, o)}`;
    x += Math.max(amples[i], 60) + 22;
    return bloc;
  }).join('');
  const pregunta = item.mena === INCORRECTA
    ? 'Quina de les següents opcions, un cop formada, <tspan font-weight="700">NO</tspan> representa el cub?'
    : 'Quina de les següents opcions, un cop formada, representa el cub?';
  return `<g>${txt(16, y0 + 24, `<tspan font-weight="700">${num}.</tspan> Es presenta un cub i un mirall, on es mostren les cares ocultes.`)}
  ${txt(16, y0 + 38, pregunta)}
  ${escena}${opcions}</g>`;
}

export function svgFull(items) {
  const alt = 186;
  const cos = items.map((it, i) => svgItem(it, i + 1, i * alt)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${items.length * alt + 20}" viewBox="0 0 900 ${items.length * alt + 20}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per peces, per a l'app ────────────────────────────────
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%">${cos}</svg>`;

export function svgEnunciat(item, s = 30) {
  const w = 190, h = 152;
  const cos = `<polygon points="8,16 154,8 154,110 8,118" fill="none" stroke="#9aa0a6" stroke-width="1.2"/>`
    + hexagon(66, 52, P.VISTA_CUB, item.vistaMirall, s * 0.76, false)
    + hexagon(134, 104, P.VISTA_CUB, item.vistaCub, s, false);
  return embolcall(w, h, cos);
}

export function svgOpcio(item, i, c = 26) {
  const o = item.opcions[i];
  const w = (Math.max(...o.map((x) => x.nx)) - Math.min(...o.map((x) => x.nx)) + 1) * c;
  const h = (Math.max(...o.map((x) => x.ny)) - Math.min(...o.map((x) => x.ny)) + 1) * c;
  return embolcall(w + 3, h + 3, desplegable(1.5, 1.5, o, c));
}
