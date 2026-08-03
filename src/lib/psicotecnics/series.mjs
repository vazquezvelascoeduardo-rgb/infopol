// Sèries de figures: quatre quadres i un cinquè per endevinar.
//
// Quatre models, tots quatre trets dels exàmens:
//
//  · GRAELLA   — una graella de 3×3 amb un quadrat negre fix al centre i
//    dues marques que van girant per la vora (iOpos, pregunta 4).
//  · COMPTATGE — quadrats a dalt i cercles a baix que creixen a ritmes
//    diferents i desfasats (iOpos, 14).
//  · RELLOTGE  — dues agulles que giren a ritmes diferents (iOpos, 44).
//  · SECTORS   — un cercle de dotze trossos que es va omplint (iOpos, 24).
//
// El perill de tota sèrie és el mateix i no és que la regla sigui difícil:
// és que n'hi hagi DUES que expliquin els quatre quadres i donin cinquens
// diferents. Aleshores l'ítem no té resposta. Passava aquí: amb un pas de
// dos, la marca torna al punt de partida cada quatre quadres, i llavors
// "avança dos" i "retrocedeix dos" expliquen el mateix.
//
// Per això cada model porta el seu catàleg de regles i es prova sencer
// contra els quadres que es veuen. Si n'hi encaixa més d'una i no coincideixen
// en el cinquè, l'ítem es llença. És el mateix control que fan les sèries
// de números.
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

const NEGRE = '#15151C';
const QUADRES = 4;                     // quants se'n veuen abans de la incògnita

// ── Muntatge comú ────────────────────────────────────────────────
function munta(seed, sal, quadres, bona, candidats, clau, extra) {
  const dolentes = [];
  for (const c of candidats) {
    if (c == null) continue;
    if (clau(c) === clau(bona)) continue;
    if (dolentes.some((d) => clau(d) === clau(c))) continue;
    dolentes.push(c);
    if (dolentes.length === 3) break;
  }
  if (dolentes.length < 3) return null;
  const correcta = posicioBona(seed, 4, sal);
  const opcions = [];
  let i = 0;
  for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : dolentes[i++]);
  return {
    quadres, opcions, correcta,
    control: {
      quatreOpcionsDiferents: new Set(opcions.map(clau)).size === 4,
      nomesUnaEsLaBona: opcions.filter((o) => clau(o) === clau(bona)).length === 1,
      ...extra,
    },
  };
}

// ── 1. Graella 3×3 ───────────────────────────────────────────────
// Les vuit caselles de la vora, en ordre horari.
const VORA = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
const PASSOS = [1, -1, 2, -2, 3, -3];
const pos = (inici, p, i) => ((inici + p * i) % 8 + 8) % 8;

/** Quines parelles de passos expliquen els quadres que es veuen. */
function reglesGraella(quadres) {
  const out = [];
  for (const pa of PASSOS) for (const pb of PASSOS) {
    const okA = quadres.every((q, i) => q.estrella === pos(quadres[0].estrella, pa, i));
    const okB = quadres.every((q, i) => q.cercle === pos(quadres[0].cercle, pb, i));
    if (okA && okB) {
      out.push({
        estrella: pos(quadres[0].estrella, pa, QUADRES),
        cercle: pos(quadres[0].cercle, pb, QUADRES),
      });
    }
  }
  return out;
}

export function generaGraella(seed) {
  const r = rng(seed, 11);
  for (let intent = 0; intent < 400; intent++) {
    const p0 = entre(r, 0, 7);
    const q0 = (p0 + 3 + Math.floor(r() * 3)) % 8;
    const pas = tria(r, PASSOS);
    const pasC = tria(r, PASSOS);

    const quadres = Array.from({ length: QUADRES }, (_, i) => ({
      estrella: pos(p0, pas, i), cercle: pos(q0, pasC, i),
    }));
    // Que no se solapin mai: si caiguessin a la mateixa casella, el dibuix
    // taparia una de les dues i el quadre no es podria llegir.
    if (quadres.some((q) => q.estrella === q.cercle)) continue;
    const bona = { estrella: pos(p0, pas, QUADRES), cercle: pos(q0, pasC, QUADRES) };
    if (bona.estrella === bona.cercle) continue;

    // Que la regla sigui única: totes les que expliquin els quadres han de
    // donar el mateix cinquè.
    const encaixen = reglesGraella(quadres);
    const clau = (o) => `${o.estrella}|${o.cercle}`;
    if (new Set(encaixen.map(clau)).size !== 1) continue;
    if (clau(encaixen[0]) !== clau(bona)) continue;

    const it = munta(seed, 'graella', quadres, bona, [
      { estrella: pos(p0, pas, QUADRES + 1), cercle: bona.cercle },
      { estrella: bona.estrella, cercle: pos(q0, -pasC, QUADRES) },
      { estrella: pos(p0, -pas, QUADRES), cercle: bona.cercle },
      { estrella: pos(p0, pas, QUADRES - 1), cercle: pos(q0, pasC, QUADRES + 1) },
      { estrella: bona.estrella, cercle: pos(q0, pasC, QUADRES - 1) },
      { estrella: pos(p0, pas, QUADRES + 2), cercle: bona.cercle },
    ].filter((c) => c.estrella !== c.cercle), clau,
    { reglesQueEncaixen: encaixen.length, capSolapament: true });
    if (it) return { seed, mena: 'graella', ...it };
  }
  throw new Error(`no s'ha pogut generar la graella ${seed}`);
}

// ── 2. Comptatge ─────────────────────────────────────────────────
const val = (e, i) => e.base + Math.floor((i + e.desf) / e.cada);

function reglesComptatge(quadres) {
  const out = [];
  for (let baseA = 0; baseA <= 3; baseA++) for (const cadaA of [1, 2, 3]) for (const desfA of [0, 1, 2]) {
    const a = { base: baseA, cada: cadaA, desf: desfA };
    if (!quadres.every((q, i) => q.dalt === val(a, i))) continue;
    for (let baseB = 0; baseB <= 3; baseB++) for (const cadaB of [1, 2, 3]) for (const desfB of [0, 1, 2]) {
      const b = { base: baseB, cada: cadaB, desf: desfB };
      if (!quadres.every((q, i) => q.baix === val(b, i))) continue;
      out.push({ dalt: val(a, QUADRES), baix: val(b, QUADRES) });
    }
  }
  return out;
}

export function generaComptatge(seed) {
  const r = rng(seed, 13);
  for (let intent = 0; intent < 400; intent++) {
    const a = { base: entre(r, 1, 2), cada: tria(r, [2, 2, 3]), desf: 0 };
    const b = { base: entre(r, 0, 1), cada: tria(r, [2, 3]), desf: 1 };
    const quadres = Array.from({ length: QUADRES }, (_, i) => ({ dalt: val(a, i), baix: val(b, i) }));
    const bona = { dalt: val(a, QUADRES), baix: val(b, QUADRES) };
    if (bona.dalt > 4 || bona.baix > 4) continue;
    // Que es vegi que creixen: si un dels dos no es mou en tot l'exercici,
    // no hi ha res a deduir.
    if (quadres[0].dalt === bona.dalt || quadres[0].baix === bona.baix) continue;

    const clau = (o) => `${o.dalt}-${o.baix}`;
    const encaixen = reglesComptatge(quadres);
    if (new Set(encaixen.map(clau)).size !== 1) continue;
    if (clau(encaixen[0]) !== clau(bona)) continue;

    const it = munta(seed, 'comptatge', quadres, bona, [
      { dalt: bona.dalt, baix: bona.baix + 1 },
      { dalt: bona.dalt - 1, baix: bona.baix + 1 },
      { dalt: bona.dalt - 1, baix: bona.baix },
      { dalt: bona.dalt + 1, baix: bona.baix },
      { dalt: bona.dalt, baix: bona.baix - 1 },
    ].filter((c) => c.dalt >= 0 && c.baix >= 0 && c.dalt <= 5 && c.baix <= 5), clau,
    { reglesQueEncaixen: encaixen.length });
    if (it) return { seed, mena: 'comptatge', ...it };
  }
  throw new Error(`no s'ha pogut generar el comptatge ${seed}`);
}

// ── 3. Rellotge ──────────────────────────────────────────────────
// Dues agulles sobre dotze posicions, cadascuna amb el seu pas.
const h = (inici, p, i) => ((inici + p * i) % 12 + 12) % 12;
const PASSOS_H = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];

function reglesRellotge(quadres) {
  const out = [];
  for (const pa of PASSOS_H) for (const pb of PASSOS_H) {
    if (!quadres.every((q, i) => q.gran === h(quadres[0].gran, pa, i))) continue;
    if (!quadres.every((q, i) => q.petita === h(quadres[0].petita, pb, i))) continue;
    out.push({ gran: h(quadres[0].gran, pa, QUADRES), petita: h(quadres[0].petita, pb, QUADRES) });
  }
  return out;
}

export function generaRellotge(seed) {
  const r = rng(seed, 17);
  for (let intent = 0; intent < 400; intent++) {
    const g0 = entre(r, 0, 11);
    const p0 = entre(r, 0, 11);
    const pg = tria(r, PASSOS_H);
    const pp = tria(r, PASSOS_H);
    if (pg === pp) continue;                    // que no vagin enganxades
    const quadres = Array.from({ length: QUADRES }, (_, i) => ({
      gran: h(g0, pg, i), petita: h(p0, pp, i),
    }));
    if (quadres.some((q) => q.gran === q.petita)) continue;
    const bona = { gran: h(g0, pg, QUADRES), petita: h(p0, pp, QUADRES) };
    if (bona.gran === bona.petita) continue;

    const clau = (o) => `${o.gran}|${o.petita}`;
    const encaixen = reglesRellotge(quadres);
    if (new Set(encaixen.map(clau)).size !== 1) continue;
    if (clau(encaixen[0]) !== clau(bona)) continue;

    const it = munta(seed, 'rellotge', quadres, bona, [
      { gran: h(g0, pg, QUADRES + 1), petita: bona.petita },
      { gran: bona.gran, petita: h(p0, pp, QUADRES + 1) },
      { gran: h(g0, -pg, QUADRES), petita: bona.petita },
      { gran: bona.gran, petita: h(p0, -pp, QUADRES) },
      { gran: bona.petita, petita: bona.gran },
      { gran: h(g0, pg, QUADRES - 1), petita: bona.petita },
    ].filter((c) => c.gran !== c.petita), clau,
    { reglesQueEncaixen: encaixen.length });
    if (it) return { seed, mena: 'rellotge', ...it };
  }
  throw new Error(`no s'ha pogut generar el rellotge ${seed}`);
}

// ── 4. Sectors ───────────────────────────────────────────────────
// Un cercle de dotze trossos que se'n van omplint uns quants cada quadre,
// i alhora el conjunt gira.
export function generaSectors(seed) {
  const r = rng(seed, 19);
  for (let intent = 0; intent < 400; intent++) {
    const inici = entre(r, 1, 3);
    const creix = tria(r, [1, 2]);
    const gir = tria(r, [0, 1, -1]);
    const desde = entre(r, 0, 11);
    const plens = (i) => inici + creix * i;
    if (plens(QUADRES) > 11) continue;

    const quadres = Array.from({ length: QUADRES }, (_, i) => ({
      plens: plens(i), desde: ((desde + gir * i) % 12 + 12) % 12,
    }));
    const bona = { plens: plens(QUADRES), desde: ((desde + gir * QUADRES) % 12 + 12) % 12 };

    // La regla, comprovada enumerant: quants n'entren i quant gira.
    const clau = (o) => `${o.plens}@${o.desde}`;
    const encaixen = [];
    for (let ini = 0; ini <= 4; ini++) for (const cr of [1, 2, 3]) for (const gr of [0, 1, -1, 2, -2]) {
      const ok = quadres.every((q, i) =>
        q.plens === ini + cr * i && q.desde === ((desde + gr * i) % 12 + 12) % 12);
      if (ok) encaixen.push({ plens: ini + cr * QUADRES, desde: ((desde + gr * QUADRES) % 12 + 12) % 12 });
    }
    if (new Set(encaixen.map(clau)).size !== 1) continue;
    if (clau(encaixen[0]) !== clau(bona)) continue;

    const it = munta(seed, 'sectors', quadres, bona, [
      { plens: bona.plens + creix, desde: bona.desde },
      { plens: bona.plens - creix, desde: bona.desde },
      { plens: bona.plens, desde: ((bona.desde + 1) % 12 + 12) % 12 },
      { plens: bona.plens, desde: ((bona.desde - 2) % 12 + 12) % 12 },
      { plens: bona.plens + 1, desde: bona.desde },
    ].filter((c) => c.plens >= 1 && c.plens <= 12), clau,
    { reglesQueEncaixen: encaixen.length });
    if (it) return { seed, mena: 'sectors', ...it };
  }
  throw new Error(`no s'ha pogut generar els sectors ${seed}`);
}

export const MENES = {
  graella: generaGraella, comptatge: generaComptatge,
  rellotge: generaRellotge, sectors: generaSectors,
};

export function generaItem(seed, mena = null) {
  const noms = Object.keys(MENES);
  const nom = mena || noms[posicioBona(seed, noms.length, 'menaSerie')];
  return MENES[nom](seed);
}

// ── Dibuix ───────────────────────────────────────────────────────
const estrella = (cx, cy, R) => {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? R * 0.45 : R;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    p.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="none" stroke="${NEGRE}" stroke-width="1.5" stroke-linejoin="round"/>`;
};

const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

function dibuixaGraella(x, y, q, c = 24) {
  let s = '';
  for (let f = 0; f < 3; f++) {
    for (let col = 0; col < 3; col++) {
      s += `<rect x="${x + col * c}" y="${y + f * c}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`;
    }
  }
  s += `<rect x="${x + c + c * 0.16}" y="${y + c + c * 0.16}" width="${c * 0.68}" height="${c * 0.68}" fill="${NEGRE}"/>`;
  const [ex, ey] = VORA[q.estrella];
  s += estrella(x + ex * c + c / 2, y + ey * c + c / 2, c * 0.32);
  const [cx2, cy2] = VORA[q.cercle];
  s += `<circle cx="${x + cx2 * c + c / 2}" cy="${y + cy2 * c + c / 2}" r="${c * 0.28}" fill="${NEGRE}"/>`;
  return s;
}

function dibuixaComptatge(x, y, q, c = 76) {
  let s = `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`;
  for (let i = 0; i < q.dalt; i++) {
    s += `<rect x="${x + 7 + i * 15}" y="${y + 9}" width="11" height="11" fill="${NEGRE}"/>`;
  }
  for (let i = 0; i < q.baix; i++) {
    s += `<circle cx="${x + 12.5 + i * 15}" cy="${y + c - 15}" r="5.5" fill="none" stroke="${NEGRE}" stroke-width="1.4"/>`;
  }
  return s;
}

function dibuixaRellotge(x, y, q, c = 76) {
  const cx = x + c / 2, cy = y + c / 2, R = c * 0.4;
  let s = `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${NEGRE}" stroke-width="1.2"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    s += `<line x1="${(cx + R * 0.86 * Math.cos(a)).toFixed(1)}" y1="${(cy + R * 0.86 * Math.sin(a)).toFixed(1)}"`
      + ` x2="${(cx + R * Math.cos(a)).toFixed(1)}" y2="${(cy + R * Math.sin(a)).toFixed(1)}"`
      + ` stroke="${NEGRE}" stroke-width="1"/>`;
  }
  const agulla = (p, llarg, gruix) => {
    const a = (p * 30 - 90) * Math.PI / 180;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + R * llarg * Math.cos(a)).toFixed(1)}"`
      + ` y2="${(cy + R * llarg * Math.sin(a)).toFixed(1)}" stroke="${NEGRE}" stroke-width="${gruix}"`
      + ' stroke-linecap="round"/>';
  };
  return s + agulla(q.gran, 0.82, 1.6) + agulla(q.petita, 0.5, 3)
    + `<circle cx="${cx}" cy="${cy}" r="2.2" fill="${NEGRE}"/>`;
}

function dibuixaSectors(x, y, q, c = 76) {
  const cx = x + c / 2, cy = y + c / 2, R = c * 0.4;
  let s = `<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`;
  for (let i = 0; i < 12; i++) {
    const ple = Array.from({ length: q.plens }, (_, k) => (q.desde + k) % 12).includes(i);
    const a1 = (i * 30 - 90) * Math.PI / 180, a2 = ((i + 1) * 30 - 90) * Math.PI / 180;
    s += `<path d="M ${cx} ${cy} L ${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)}`
      + ` A ${R} ${R} 0 0 1 ${(cx + R * Math.cos(a2)).toFixed(1)} ${(cy + R * Math.sin(a2)).toFixed(1)} Z"`
      + ` fill="${ple ? '#8f959c' : '#fff'}" stroke="${NEGRE}" stroke-width="0.9"/>`;
  }
  return s;
}

const DIBUIX = {
  graella: (x, y, q) => dibuixaGraella(x, y, q),
  comptatge: dibuixaComptatge,
  rellotge: dibuixaRellotge,
  sectors: dibuixaSectors,
};
const AMPLE = { graella: 72, comptatge: 76, rellotge: 76, sectors: 76 };

export function svgItem(item, num, y0 = 0) {
  const a = AMPLE[item.mena], sep = a + 16;
  const dib = DIBUIX[item.mena];
  const serie = item.quadres.map((q, i) => dib(20 + i * sep, y0 + 30, q)).join('')
    + `<rect x="${20 + QUADRES * sep}" y="${y0 + 30}" width="${a}" height="${a}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`
    + txt(20 + QUADRES * sep + a / 2, y0 + 30 + a * 0.68, '?', 26, 700, 'middle');
  const yo = y0 + 42 + a;
  const opcions = item.opcions.map((o, i) => dib(20 + i * sep, yo, o)
    + txt(20 + i * sep + a / 2, yo + a + 14, `${'ABCD'[i]}`, 12, 700, 'middle')).join('');
  return `<g>${txt(16, y0 + 20, `<tspan font-weight="700">${num}.</tspan> Trieu la figura que completa millor la sèrie:`)}
  ${serie}<line x1="16" y1="${yo - 8}" x2="${20 + 5 * sep}" y2="${yo - 8}" stroke="#c9ccd1" stroke-width="1"/>${opcions}</g>`;
}

export function svgFull(items) {
  let y = 8;
  const cos = items.map((it, i) => {
    const s = svgItem(it, i + 1, y);
    y += 2 * AMPLE[it.mena] + 76;
    return s;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="510" height="${y + 20}" viewBox="0 0 510 ${y + 20}">
  <rect preserveAspectRatio="xMidYMid meet" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per peces, per a l'app ────────────────────────────────
const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

export function svgEnunciat(item) {
  const a = AMPLE[item.mena], sep = a + 10;
  const dib = DIBUIX[item.mena];
  const cos = item.quadres.map((q, i) => dib(i * sep, 0, q)).join('')
    + `<rect x="${QUADRES * sep}" y="0" width="${a}" height="${a}" fill="#fff" stroke="${NEGRE}" stroke-width="1.1"/>`
    + txt(QUADRES * sep + a / 2, a * 0.68, '?', a * 0.36, 700, 'middle');
  return embolcall(QUADRES * sep + a, a, cos);
}

export function svgOpcio(item, i) {
  const a = AMPLE[item.mena];
  return embolcall(a, a, DIBUIX[item.mena](0, 0, item.opcions[i]));
}
