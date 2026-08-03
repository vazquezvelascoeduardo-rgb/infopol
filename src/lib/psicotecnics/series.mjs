// Dues famílies més de sèries, calcades de les que surten als exàmens.
//
//  · GRAELLA — una graella de 3×3 amb un quadrat negre fix al centre i
//    dues marques que van girant per la vora. Cal endevinar on cauen al
//    cinquè quadre.
//  · COMPTATGE — quadrats a dalt i cercles a baix que creixen a ritmes
//    diferents i desfasats. És el que fa que no es vegi a la primera.
//
// A totes dues la resposta surt d'aplicar la regla; els distractors,
// d'aplicar-ne una de torta (un pas de més, el gir al revés, un dels dos
// elements quiet). Per això s'assemblen a la bona.
function rng(seed) { let s = (seed * 2246822519) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const tria = (r, a) => a[Math.floor(r() * a.length)];

// ── Família: graella 3×3 ─────────────────────────────────────────
// Les vuit caselles de la vora, en ordre horari.
const VORA = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];

export function generaGraella(seed) {
  const r = rng(seed);
  const p0 = Math.floor(r() * 8);           // on comença l'estrella
  const q0 = (p0 + 3 + Math.floor(r() * 3)) % 8; // i el cercle, separat
  const pas = tria(r, [1, -1, 2, -2]);      // quant es mou l'estrella
  const pasC = tria(r, [1, -1, 2, -2]);     // i el cercle
  const pos = (inici, p, i) => VORA[((inici + p * i) % 8 + 8) % 8];

  const quadres = [0, 1, 2, 3].map((i) => ({
    estrella: pos(p0, pas, i), cercle: pos(q0, pasC, i),
  }));
  const bona = { estrella: pos(p0, pas, 4), cercle: pos(q0, pasC, 4) };

  const candidats = [
    { estrella: pos(p0, pas, 5), cercle: pos(q0, pasC, 4) },   // l'estrella, un pas de més
    { estrella: pos(p0, pas, 4), cercle: pos(q0, -pasC, 4) },  // el cercle, al revés
    { estrella: pos(p0, -pas, 4), cercle: pos(q0, pasC, 4) },  // l'estrella, al revés
    { estrella: pos(p0, pas, 3), cercle: pos(q0, pasC, 5) },   // desfasats
    { estrella: pos(p0, pas, 4), cercle: pos(q0, pasC, 3) },   // el cercle, quiet
  ];
  const k = (o) => `${o.estrella}|${o.cercle}`;
  const dolentes = [];
  for (const c of candidats) {
    if (k(c) === k(bona)) continue;
    if (dolentes.some((d) => k(d) === k(c))) continue;
    dolentes.push(c);
    if (dolentes.length === 3) break;
  }
  const opcions = [bona, ...dolentes].sort(() => r() - 0.5);
  return { quadres, opcions, correcta: opcions.findIndex((o) => k(o) === k(bona)) };
}

// ── Família: comptatge ───────────────────────────────────────────
export function generaComptatge(seed) {
  const r = rng(seed);
  // Cada element creix cada `cada` quadres, començant amb `base`.
  const a = { base: 1 + Math.floor(r() * 2), cada: tria(r, [2, 2, 3]), desf: 0 };
  const b = { base: Math.floor(r() * 2), cada: tria(r, [2, 3]), desf: 1 };
  const val = (e, i) => e.base + Math.floor((i + e.desf) / e.cada);

  const quadres = [0, 1, 2, 3].map((i) => ({ dalt: val(a, i), baix: val(b, i) }));
  const bona = { dalt: val(a, 4), baix: val(b, 4) };
  const candidats = [
    { dalt: bona.dalt, baix: bona.baix + 1 },
    { dalt: bona.dalt - 1, baix: bona.baix + 1 },
    { dalt: bona.dalt - 1, baix: bona.baix },
    { dalt: bona.dalt + 1, baix: bona.baix },
  ];
  const k = (o) => `${o.dalt}-${o.baix}`;
  const dolentes = [];
  for (const c of candidats) {
    if (k(c) === k(bona) || c.dalt < 0 || c.baix < 0 || c.dalt > 4 || c.baix > 4) continue;
    if (dolentes.some((d) => k(d) === k(c))) continue;
    dolentes.push(c);
    if (dolentes.length === 3) break;
  }
  const opcions = [bona, ...dolentes].sort(() => r() - 0.5);
  return { quadres, opcions, correcta: opcions.findIndex((o) => k(o) === k(bona)) };
}

// ── Dibuix ───────────────────────────────────────────────────────
const estrella = (cx, cy, R) => {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? R * 0.45 : R;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    p.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="none" stroke="#15151C" stroke-width="1.6" stroke-linejoin="round"/>`;
};

function graella(x, y, q, c = 26) {
  let s = '';
  for (let f = 0; f < 3; f++) {
    for (let col = 0; col < 3; col++) {
      s += `<rect x="${x + col * c}" y="${y + f * c}" width="${c}" height="${c}" fill="#fff" stroke="#15151C" stroke-width="1.2"/>`;
    }
  }
  s += `<rect x="${x + c + c * 0.18}" y="${y + c + c * 0.18}" width="${c * 0.64}" height="${c * 0.64}" fill="#15151C"/>`;
  if (q) {
    const [ex, ey] = q.estrella; const [cx2, cy2] = q.cercle;
    s += estrella(x + ex * c + c / 2, y + ey * c + c / 2, c * 0.3);
    s += `<circle cx="${x + cx2 * c + c / 2}" cy="${y + cy2 * c + c / 2}" r="${c * 0.28}" fill="#15151C"/>`;
  } else {
    s += `<text x="${x + 1.5 * c}" y="${y + 1.5 * c + 9}" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="26" font-weight="700" fill="#15151C">?</text>`;
  }
  return s;
}

function caixaComptatge(x, y, q, L = 78) {
  let s = `<rect x="${x}" y="${y}" width="${L}" height="${L}" fill="#fff" stroke="#15151C" stroke-width="1.6"/>`;
  if (!q) {
    return s + `<text x="${x + L / 2}" y="${y + L / 2 + 10}" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="28" font-weight="700" fill="#15151C">?</text>`;
  }
  const m = 9, t = 13;
  for (let i = 0; i < q.dalt; i++) s += `<rect x="${x + m + i * (t + 4)}" y="${y + m}" width="${t}" height="${t}" fill="#15151C"/>`;
  for (let i = 0; i < q.baix; i++) s += `<circle cx="${x + L - m - t / 2 - i * (t + 4)}" cy="${y + L - m - t / 2}" r="${t / 2}" fill="none" stroke="#15151C" stroke-width="1.6"/>`;
  return s;
}

export function svgGraella(item, num) {
  const q = item.quadres.map((v, i) => graella(30 + i * 92, 46, v)).join('') + graella(30 + 4 * 92, 46, null);
  const op = item.opcions.map((o, i) => graella(60 + i * 130, 178, o)).join('')
    + item.opcions.map((_, i) => `<text x="${60 + i * 130 + 39}" y="284" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" font-weight="700" fill="#15151C">${'ABCD'[i]}</text>`).join('');
  return `<g><text x="20" y="28" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" fill="#15151C"><tspan font-weight="700">${num}.</tspan> Trieu la figura que completa millor la sèrie:</text>${q}
  <line x1="30" y1="160" x2="560" y2="160" stroke="#15151C" stroke-width="1"/>${op}</g>`;
}

export function svgComptatge(item, num) {
  const q = item.quadres.map((v, i) => caixaComptatge(30 + i * 96, 42, v)).join('') + caixaComptatge(30 + 4 * 96, 42, null);
  const op = item.opcions.map((o, i) => caixaComptatge(50 + i * 130, 160, o)).join('')
    + item.opcions.map((_, i) => `<text x="${50 + i * 130 + 39}" y="258" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13" font-weight="700" fill="#15151C">${'ABCD'[i]}</text>`).join('');
  return `<g><text x="20" y="28" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" fill="#15151C"><tspan font-weight="700">${num}.</tspan> Trieu la figura que completa millor la sèrie:</text>${q}
  <line x1="30" y1="142" x2="560" y2="142" stroke="#15151C" stroke-width="1"/>${op}</g>`;
}
