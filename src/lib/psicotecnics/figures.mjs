// Dues famílies bessones, que a l'examen surten cada cinc preguntes:
//
//  · "Quina figura és la imatge de mostra reflectida en un mirall?"
//  · "Quina figura és la imatge de mostra però girada (sense reflectir)?"
//
// Són la mateixa pregunta del revés, i per això van juntes. El que les fa
// tenir una sola resposta és com es reparteixen les opcions:
//
//  · A la del mirall, la bona és el reflex i les altres tres són girs. Cap
//    altra opció no és un reflex, i per tant no hi ha res a discutir.
//  · A la del gir, la bona és un gir i les altres tres són reflexos.
//
// Ho vaig treure de la 35 del simulacre: la mostra té una ratlla vertical
// i un punt blanc a dalt a l'esquerra; la bona té la ratlla igual i el punt
// blanc a dalt a la DRETA. És el reflex per l'eix vertical, sense cap gir.
// I el distractor és la mostra girada mitja volta.
//
// La figura no es descriu amb un dibuix sinó amb una GRAELLA de caselles
// plenes més una casella marcada. Així el programa pot comprovar sol que
// la figura no té cap simetria —si en tingués, girar-la i reflectir-la
// donaria el mateix i l'ítem no tindria resposta— i que dues opcions no es
// veuen mai iguals. Del contorn de les caselles en surt un polígon
// irregular, que és la pinta que tenen les de l'examen.

const N = 5;                         // la graella és de 5×5

function rng(seed) {
  let s = (seed * 1597334677) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// ── Les vuit maneres de posar una figura ─────────────────────────
// Primer el volteig (esquerra-dreta) i després els girs, com al cub.
const gir = ([x, y]) => [N - 1 - y, x];          // un quart de volta horari
const volt = ([x, y]) => [N - 1 - x, y];         // scale(-1,1)

function mou(cella, q, volteig) {
  let c = volteig ? volt(cella) : cella;
  for (let i = 0; i < q; i++) c = gir(c);
  return c;
}

/** Una figura mirada de una de les vuit maneres. */
export function transforma(fig, q, volteig) {
  return {
    plenes: fig.plenes.map((c) => mou(c, q, volteig)),
    marca: mou(fig.marca, q, volteig),
  };
}

/** Com es veu una figura. Dues figures són la mateixa si això coincideix. */
export const aspecte = (fig) =>
  [...fig.plenes.map((c) => c.join(',')).sort().join(' '), '|', fig.marca.join(',')].join('');

/** De quantes maneres diferents es pot veure. Vuit vol dir sense simetries. */
export const maneres = (fig) => {
  const v = new Set();
  for (let q = 0; q < 4; q++) for (const b of [false, true]) v.add(aspecte(transforma(fig, q, b)));
  return v.size;
};

// ── Fer una figura ───────────────────────────────────────────────
// Es fa créixer una taca de caselles veïnes, i s'hi marca una casella.
// Després es comprova que no tingui cap simetria; si en té, es torna a fer.
function figura(r) {
  for (let intent = 0; intent < 300; intent++) {
    const quantes = 8 + Math.floor(r() * 5);
    const plenes = [[2, 2]];
    const dins = new Set(['2,2']);
    while (plenes.length < quantes) {
      const [x, y] = plenes[Math.floor(r() * plenes.length)];
      const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(r() * 4)];
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
      if (dins.has(`${nx},${ny}`)) continue;
      dins.add(`${nx},${ny}`); plenes.push([nx, ny]);
    }
    const fig = { plenes, marca: plenes[Math.floor(r() * plenes.length)] };
    // Que ompli prou la graella: si no, les figures surten totes iguals.
    const ampla = new Set(plenes.map((c) => c[0])).size;
    const alta = new Set(plenes.map((c) => c[1])).size;
    if (ampla < 3 || alta < 3) continue;
    if (maneres(fig) === 8) return fig;      // cap simetria: serveix
  }
  return null;
}

// ── Els ítems ────────────────────────────────────────────────────
export const MIRALL = 'mirall';
export const GIR = 'gir';

/**
 * `mena` és MIRALL o GIR.
 *  · MIRALL: la bona és el reflex per l'eix vertical; les altres, girs.
 *  · GIR: la bona és un gir; les altres, reflexos.
 */
export function generaItem(seed, mena = MIRALL) {
  const r = rng(seed);
  for (let intent = 0; intent < 200; intent++) {
    const mostra = figura(r);
    if (!mostra) continue;

    const girs = [1, 2, 3].map((q) => transforma(mostra, q, false));
    const reflexos = [0, 1, 2, 3].map((q) => transforma(mostra, q, true));

    let bona, altres;
    if (mena === MIRALL) {
      bona = reflexos[0];                                   // reflex sense girar
      altres = girs;                                        // els tres girs
    } else {
      const q = 1 + Math.floor(r() * 3);
      bona = transforma(mostra, q, false);
      altres = barreja(r, reflexos).slice(0, 3);
    }

    const totes = [bona, ...altres];
    // Cap opció repetida, i cap igual a la mostra.
    const pintes = totes.map(aspecte);
    if (new Set(pintes).size !== 4) continue;
    if (pintes.includes(aspecte(mostra))) continue;
    // I —el que compta— que només una opció sigui del tipus demanat.
    const esReflex = (f) => reflexos.some((x) => aspecte(x) === aspecte(f));
    const esGir = (f) => girs.concat([mostra]).some((x) => aspecte(x) === aspecte(f));
    const bones = totes.filter((f) => (mena === MIRALL ? esReflex(f) : esGir(f))).length;
    if (bones !== 1) continue;

    const correcta = Math.floor(r() * 4);
    const opcions = [];
    let i = 0;
    for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : altres[i++]);

    return {
      seed, mena, mostra, opcions, correcta,
      control: {
        senseSimetries: maneres(mostra) === 8,
        opcionsDiferents: new Set(opcions.map(aspecte)).size === 4,
        quantesResponen: bones,
        capIgualALaMostra: !opcions.some((o) => aspecte(o) === aspecte(mostra)),
      },
    };
  }
  throw new Error(`no s'ha pogut generar la figura ${seed}`);
}

function barreja(r, a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ── Dibuix ───────────────────────────────────────────────────────
const NEGRE = '#15151C';

/**
 * La figura. Les caselles plenes es pinten juntes —sense vora entre elles,
 * que si no semblarien blocs— i només se'n resegueix el contorn de fora.
 * D'aquí en surt el polígon irregular.
 */
function dibuixa(x0, y0, fig, c) {
  const dins = new Set(fig.plenes.map((p) => p.join(',')));
  const px = (x, y) => [x0 + x * c, y0 + y * c];
  let s = fig.plenes.map(([x, y]) => {
    const [a, b] = px(x, y);
    return `<rect x="${a}" y="${b}" width="${c + 0.5}" height="${c + 0.5}" fill="#fff"/>`;
  }).join('');
  // El contorn: cada aresta que separa una casella plena d'una de buida.
  for (const [x, y] of fig.plenes) {
    const costats = [
      [[0, 0], [1, 0], [x, y - 1]],
      [[1, 0], [1, 1], [x + 1, y]],
      [[1, 1], [0, 1], [x, y + 1]],
      [[0, 1], [0, 0], [x - 1, y]],
    ];
    for (const [a, b, veí] of costats) {
      if (dins.has(veí.join(','))) continue;
      const [ax, ay] = px(x + a[0], y + a[1]);
      const [bx, by] = px(x + b[0], y + b[1]);
      s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${NEGRE}" stroke-width="2" stroke-linecap="square"/>`;
    }
  }
  const [mx, my] = px(fig.marca[0] + 0.5, fig.marca[1] + 0.5);
  s += `<circle cx="${mx}" cy="${my}" r="${c * 0.22}" fill="${NEGRE}"/>`;
  return s;
}

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

const ENUNCIAT = {
  [MIRALL]: 'Quina figura és la imatge de mostra reflectida en un mirall?',
  [GIR]: 'Quina figura és la imatge de mostra però girada (sense reflectir)?',
};

export function svgItem(item, num, y0 = 0) {
  const c = 15, cau = N * c + 12;
  const marc = (x, y) => `<rect x="${x}" y="${y}" width="${cau}" height="${cau}" fill="none" stroke="${NEGRE}" stroke-width="1.6"/>`;
  const mostra = `${marc(18, y0 + 34)}${dibuixa(24, y0 + 40, item.mostra, c)}`;
  const opcions = item.opcions.map((o, i) => {
    const x = 170 + i * (cau + 26);
    return `${marc(x, y0 + 34)}${dibuixa(x + 6, y0 + 40, o, c)}`
      + txt(x + cau / 2, y0 + 34 + cau + 15, 'ABCD'[i], 12, 700, 'middle');
  }).join('');
  return `<g>${txt(16, y0 + 22, `<tspan font-weight="700">${num}.</tspan> ${ENUNCIAT[item.mena]}`)}
  ${mostra}${opcions}</g>`;
}

export function svgFull(items) {
  const alt = 145;
  const cos = items.map((it, i) => svgItem(it, i + 1, i * alt)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="${items.length * alt + 20}" viewBox="0 0 620 ${items.length * alt + 20}">
  <rect preserveAspectRatio="xMidYMid meet" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per peces, per a l'app ────────────────────────────────
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

function marcAmbFigura(fig, c) {
  const cau = N * c + 12;
  return embolcall(cau, cau,
    `<rect x="0.8" y="0.8" width="${cau - 1.6}" height="${cau - 1.6}" fill="#fff" stroke="${NEGRE}" stroke-width="1.6"/>`
    + dibuixa(6, 6, fig, c));
}

export const svgEnunciat = (item, c = 17) => marcAmbFigura(item.mostra, c);
export const svgOpcio = (item, i, c = 17) => marcAmbFigura(item.opcions[i], c);
