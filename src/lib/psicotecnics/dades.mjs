// Taules i gràfics: llegir dades i treure'n un número.
//
// Al Mossos 2022 és el segon bloc més gran —set preguntes de les quaranta-sis
// primeres— i sempre va igual: es presenta una taula, un gràfic de sectors o
// un de barres, i després dues o tres preguntes sobre les mateixes dades.
//
// Aquí la resposta no s'endevina, es calcula, i per tant es pot garantir del
// tot. Dues regles, les mateixes que al bloc numèric:
//
//  1. Res de comes que no surtin rodones. Els percentatges han de donar
//     enters i les mitjanes, mig punt com a molt. Si les dades no ho donen,
//     es llencen i se'n fan unes altres.
//  2. La resposta es torna a treure de les DADES ja fetes, no dels números
//     que les han generat. Les proves ho refan des de la taula.
import { rng, tria, entre, barreja, posicioBona } from './atzar.mjs';

const NEGRE = '#15151C';
// Els milers amb punt, sempre igual. S'exporta perquè les proves puguin
// escriure els números tal com han de sortir i comparar-los.
export const formatNum = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const num = formatNum;

// ── Muntatge ─────────────────────────────────────────────────────
function munta(seed, enunciat, bona, candidats, extra, sal) {
  const vistos = new Set([bona]);
  const dolents = [];
  for (const c of candidats) {
    if (c == null || c.text == null || vistos.has(c.text)) continue;
    vistos.add(c.text);
    dolents.push(c);
    if (dolents.length === 3) break;
  }
  if (dolents.length < 3) return null;
  const correcta = posicioBona(seed, 4, sal);
  const opcions = [];
  let i = 0;
  for (let k = 0; k < 4; k++) opcions.push(k === correcta ? bona : dolents[i++].text);
  return {
    enunciat, opcions, correcta, perque: dolents.map((d) => d.error),
    control: { opcionsDiferents: new Set(opcions).size === 4, ...extra },
  };
}

// ── 1. Taula de doble entrada ────────────────────────────────────
const MESOS = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny'];
const TAULES = [
  { titol: 'ingressos i altes hospitalàries', a: 'Ingressos', b: 'Altes', files: MESOS, cosa: 'ingressats' },
  { titol: 'avisos rebuts i resolts', a: 'Rebuts', b: 'Resolts', files: MESOS, cosa: 'avisos' },
  { titol: 'denúncies posades i pagades', a: 'Posades', b: 'Pagades', files: MESOS, cosa: 'denúncies' },
];

function itemTaula(r, seed) {
  const t = tria(r, TAULES);
  const quantes = entre(r, 4, 5);
  const files = t.files.slice(0, quantes).map((nom) => ({
    nom, a: entre(r, 3, 40) * 25, b: entre(r, 2, 30) * 25,
  }));
  const mena = tria(r, ['sumaCreuada', 'diferencia', 'pendents']);

  if (mena === 'sumaCreuada') {
    const [i, j, k, l] = barreja(r, files.map((_, n) => n)).slice(0, 4);
    if (l === undefined) return null;
    const sumaA = files[i].a + files[j].a;
    const sumaB = files[k].b + files[l].b;
    const bona = `${num(sumaA)} i ${num(sumaB)}`;
    return {
      mena: 'taula', taula: t, files,
      ...munta(seed,
        `Quants ${t.cosa} consten com a «${t.a}» al total de ${files[i].nom} i ${files[j].nom}, `
        + `i quants com a «${t.b}» al total de ${files[k].nom} i ${files[l].nom}?`,
        bona,
        [
          { text: `${num(sumaB)} i ${num(sumaA)}`, error: 'donar-los canviats' },
          { text: `${num(sumaA + 25)} i ${num(sumaB)}`, error: 'sumar malament la primera' },
          { text: `${num(sumaA)} i ${num(sumaB - 25)}`, error: 'sumar malament la segona' },
          { text: `${num(files[i].a + files[j].b)} i ${num(sumaB)}`, error: 'agafar una casella de l\'altra columna' },
          { text: `${num(sumaA - 50)} i ${num(sumaB + 50)}`, error: 'descomptar-se a totes dues' },
        ],
        { sumaA, sumaB }, 'taula'),
    };
  }

  if (mena === 'diferencia') {
    const [i, j] = barreja(r, files.map((_, n) => n)).slice(0, 2);
    const di = files[i].a - files[i].b;
    const dj = files[j].a - files[j].b;
    const bona = `${num(Math.abs(di - dj))}`;
    return {
      mena: 'taula', taula: t, files,
      ...munta(seed,
        `Si comparem la columna «${t.a}» amb la de «${t.b}», quina és la diferència `
        + `entre ${files[i].nom} i ${files[j].nom}?`,
        bona,
        [
          { text: `${num(Math.abs(di + dj))}`, error: 'sumar les dues diferències' },
          { text: `${num(Math.abs(files[i].a - files[j].a))}`, error: 'comparar només la primera columna' },
          { text: `${num(Math.abs(files[i].b - files[j].b))}`, error: 'comparar només la segona' },
          { text: `${num(Math.abs(di - dj) + 25)}`, error: 'passar-se de poc' },
          { text: `${num(Math.abs(di))}`, error: 'donar només una de les dues diferències' },
        ],
        { di, dj }, 'taula'),
    };
  }

  // pendents: el que ha entrat menys el que ha sortit.
  const totalA = files.reduce((s, f) => s + f.a, 0);
  const totalB = files.reduce((s, f) => s + f.b, 0);
  if (totalA <= totalB) return null;
  return {
    mena: 'taula', taula: t, files,
    ...munta(seed,
      `Al final del període, quants ${t.cosa} consten com a «${t.a}» però encara no com a «${t.b}»?`,
      `${num(totalA - totalB)}`,
      [
        { text: `${num(totalB)}`, error: 'donar el total de la segona columna' },
        { text: `${num(totalA)}`, error: 'donar el total de la primera' },
        { text: `${num(totalA + totalB)}`, error: 'sumar-ho tot' },
        { text: `${num(totalA - totalB + 50)}`, error: 'descomptar-se' },
        { text: `${num(Math.abs(files[0].a - files[0].b))}`, error: 'mirar només la primera fila' },
      ],
      { totalA, totalB }, 'taula'),
  };
}

// ── 2. Gràfic de sectors ─────────────────────────────────────────
const SECTORS = [
  { titol: 'les hores al dia que la gent inverteix a veure la televisió', unitat: 'hores', cosa: 'veuen' },
  { titol: 'els dies de guàrdia que fa cada agent al mes', unitat: 'dies', cosa: 'en fan' },
];

function itemSectors(r, seed) {
  const s = tria(r, SECTORS);
  const total = tria(r, [2000, 4000, 5000, 8000]);
  const quants = entre(r, 4, 5);
  // Els valors han de donar percentatges enters: es reparteixen en centèsimes.
  const parts = [];
  let queda = 100;
  for (let i = 0; i < quants - 1; i++) {
    const max = queda - (quants - 1 - i) * 5;
    if (max < 5) return null;
    const p = entre(r, 5, Math.min(max, 45));
    parts.push(p);
    queda -= p;
  }
  parts.push(queda);
  if (parts.some((p) => p < 5) || parts.reduce((a, b) => a + b, 0) !== 100) return null;
  const dades = parts.map((p, i) => ({
    etiqueta: `${i + 1} ${i === 0 ? s.unitat.replace(/s$/, '') : s.unitat}`,
    pct: p, valor: (total * p) / 100,
  }));
  if (dades.some((d) => !Number.isInteger(d.valor))) return null;

  const mena = tria(r, ['acumulat', 'exclos']);
  if (mena === 'acumulat') {
    const fins = entre(r, 1, quants - 1);
    const pct = dades.slice(0, fins).reduce((a, d) => a + d.pct, 0);
    return {
      mena: 'sectors', sectors: s, total, dades,
      ...munta(seed,
        `Quin percentatge dels enquestats ${s.cosa} com a màxim ${fins} ${fins === 1 ? s.unitat.replace(/s$/, '') : s.unitat} al dia?`,
        `${pct}%`,
        [
          { text: `${100 - pct}%`, error: 'donar la resta' },
          { text: `${dades[fins - 1].pct}%`, error: 'donar només l\'últim tros' },
          { text: `${pct + 5}%`, error: 'passar-se' },
          { text: `${pct - 5}%`, error: 'quedar-se curt' },
          { text: `${dades[0].pct}%`, error: 'donar només el primer tros' },
        ],
        { pct }, 'sectors'),
    };
  }
  const [i, j] = barreja(r, dades.map((_, n) => n)).slice(0, 2);
  const pct = 100 - dades[i].pct - dades[j].pct;
  return {
    mena: 'sectors', sectors: s, total, dades,
    ...munta(seed,
      `A quin percentatge dels enquestats corresponen els que NO ${s.cosa} exactament `
      + `${dades[i].etiqueta} o ${dades[j].etiqueta} al dia?`,
      `${pct}%`,
      [
        { text: `${100 - pct}%`, error: 'donar justament els dos trossos' },
        { text: `${dades[i].pct}%`, error: 'donar-ne només un' },
        { text: `${pct + 5}%`, error: 'passar-se' },
        { text: `${pct - 10}%`, error: 'quedar-se curt' },
        { text: `${dades[j].pct}%`, error: 'donar l\'altre' },
      ],
      { pct }, 'sectors'),
  };
}

// ── 3. Gràfic de barres ──────────────────────────────────────────
const NOMS = ['Josep', 'Jaume', 'Roser', 'Rebeca', 'Alba', 'Marc', 'Núria'];

function itemBarres(r, seed) {
  const series = tria(r, [['Precisió', 'Dificultat'], ['Teòrica', 'Pràctica'], ['Tir', 'Físiques']]);
  const quants = 5;
  const gent = barreja(r, NOMS).slice(0, quants).map((nom) => ({
    nom, a: entre(r, 3, 10), b: entre(r, 3, 10),
  }));
  const mena = tria(r, ['mitjanes', 'extrems']);

  if (mena === 'mitjanes') {
    const tres = barreja(r, gent.map((_, n) => n)).slice(0, 3);
    const sumaTres = tres.reduce((s, i) => s + gent[i].b, 0);
    const sumaTots = gent.reduce((s, g) => s + g.b, 0);
    // La diferència ha de sortir rodona: mig punt com a molt.
    const dif15 = sumaTres * 5 - sumaTots * 3;      // (mitjana3 − mitjanaTots) × 15
    if (dif15 % 15 !== 0 && dif15 % 15 !== 7.5) {
      if (Math.abs(dif15 * 2) % 15 !== 0) return null;
    }
    const dif = dif15 / 15;
    if (Math.abs(dif * 2 - Math.round(dif * 2)) > 1e-9) return null;
    const fmt = (x) => (x === 0 ? '0' : `${x > 0 ? '+' : '−'}${String(Math.abs(x)).replace('.', ',')}`);
    const noms = tres.map((i) => gent[i].nom);
    return {
      mena: 'barres', series, gent,
      ...munta(seed,
        `Tenint en compte les puntuacions de «${series[1]}», quina és la diferència entre la `
        + `mitjana obtinguda per ${noms.slice(0, -1).join(', ')} i ${noms[noms.length - 1]} `
        + 'respecte a la de tots els participants?',
        fmt(dif),
        [
          { text: fmt(-dif), error: 'restar-ho al revés' },
          { text: fmt(dif + 0.5), error: 'passar-se de mig punt' },
          { text: fmt(dif - 0.5), error: 'quedar-se curt de mig punt' },
          { text: fmt(dif + 1), error: 'passar-se d\'un punt' },
          { text: '0', error: 'donar per fet que no hi ha diferència' },
        ],
        { dif, sumaTres, sumaTots }, 'barres'),
    };
  }

  const maxB = Math.max(...gent.map((g) => g.b));
  const minA = Math.min(...gent.map((g) => g.a));
  const bona = maxB - minA;
  if (bona <= 0) return null;
  return {
    mena: 'barres', series, gent,
    ...munta(seed,
      `Quina diferència hi ha entre la puntuació més alta en «${series[1]}» `
      + `i la més baixa en «${series[0]}»?`,
      `${bona}`,
      [
        { text: `${bona + 1}`, error: 'passar-se d\'un punt' },
        { text: `${bona - 1}`, error: 'quedar-se curt d\'un punt' },
        { text: `${Math.max(...gent.map((g) => g.a)) - Math.min(...gent.map((g) => g.b))}`, error: 'canviar les dues sèries' },
        { text: `${maxB}`, error: 'donar només la més alta' },
        { text: `${bona + 2}`, error: 'passar-se de dos' },
      ],
      { maxB, minA }, 'barres'),
  };
}

// ── Generació ────────────────────────────────────────────────────
export const MENES = { taula: itemTaula, sectors: itemSectors, barres: itemBarres };

export function generaItem(seed, mena = null) {
  const r = rng(seed, 5);
  const noms = Object.keys(MENES);
  const nom = mena || noms[Math.floor(r() * noms.length)];
  for (let intent = 0; intent < 3000; intent++) {
    const it = MENES[nom](r, seed);
    if (it && it.opcions && it.control.opcionsDiferents) return { seed, ...it };
  }
  throw new Error(`no s'ha pogut generar l'ítem de dades ${seed} (${nom})`);
}

// ── Dibuix ───────────────────────────────────────────────────────
const txt = (x, y, t, mida = 12, pes = 400, ancora = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancora}" font-family="ui-sans-serif,system-ui,sans-serif"`
  + ` font-size="${mida}" font-weight="${pes}" fill="${NEGRE}">${t}</text>`;

function dibuixaTaula(item, x0, y0) {
  const w = 92, h = 22;
  let s = `<rect x="${x0 + w}" y="${y0}" width="${w}" height="${h}" fill="#eef0f3" stroke="${NEGRE}" stroke-width="1"/>`
    + `<rect x="${x0 + 2 * w}" y="${y0}" width="${w}" height="${h}" fill="#eef0f3" stroke="${NEGRE}" stroke-width="1"/>`
    + txt(x0 + w * 1.5, y0 + 15, item.taula.a, 11, 700, 'middle')
    + txt(x0 + w * 2.5, y0 + 15, item.taula.b, 11, 700, 'middle');
  item.files.forEach((f, i) => {
    const y = y0 + h * (i + 1);
    s += `<rect x="${x0}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`
      + `<rect x="${x0 + w}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`
      + `<rect x="${x0 + 2 * w}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${NEGRE}" stroke-width="1"/>`
      + txt(x0 + 8, y + 15, f.nom, 11)
      + txt(x0 + w * 1.5, y + 15, num(f.a), 11, 400, 'middle')
      + txt(x0 + w * 2.5, y + 15, num(f.b), 11, 400, 'middle');
  });
  return s;
}

function dibuixaSectors(item, cx, cy, rad) {
  let ang = -Math.PI / 2;
  const grisos = ['#15151C', '#5a5f66', '#9aa0a6', '#c9ccd1', '#e7e9ec'];
  let s = '';
  item.dades.forEach((d, i) => {
    const a2 = ang + (d.pct / 100) * Math.PI * 2;
    const gran = d.pct > 50 ? 1 : 0;
    const p1 = { x: cx + rad * Math.cos(ang), y: cy + rad * Math.sin(ang) };
    const p2 = { x: cx + rad * Math.cos(a2), y: cy + rad * Math.sin(a2) };
    s += `<path d="M ${cx} ${cy} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} `
      + `A ${rad} ${rad} 0 ${gran} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" `
      + `fill="${grisos[i % grisos.length]}" stroke="#fff" stroke-width="1.5"/>`;
    const mig = (ang + a2) / 2;
    const lx = cx + (rad + 26) * Math.cos(mig), ly = cy + (rad + 26) * Math.sin(mig);
    s += txt(lx, ly, `${num(d.valor)}`, 11, 700, 'middle')
      + txt(lx, ly + 12, d.etiqueta, 10, 400, 'middle');
    ang = a2;
  });
  return s;
}

function dibuixaBarres(item, x0, y0) {
  const w = 170, h = 15;
  let s = '';
  item.gent.forEach((g, i) => {
    const y = y0 + i * (h * 2 + 6);
    s += txt(x0 - 6, y + 11, g.nom, 10, 400, 'end')
      + `<rect x="${x0}" y="${y}" width="${(g.a / 10) * w}" height="${h}" fill="#c9ccd1" stroke="${NEGRE}" stroke-width="0.8"/>`
      + `<rect x="${x0}" y="${y + h + 1}" width="${(g.b / 10) * w}" height="${h}" fill="#5a5f66" stroke="${NEGRE}" stroke-width="0.8"/>`;
  });
  const yEix = y0 + item.gent.length * (h * 2 + 6);
  s += `<line x1="${x0}" y1="${yEix}" x2="${x0 + w}" y2="${yEix}" stroke="${NEGRE}" stroke-width="1"/>`;
  for (let v = 0; v <= 10; v += 2) {
    const x = x0 + (v / 10) * w;
    s += `<line x1="${x}" y1="${yEix}" x2="${x}" y2="${yEix + 4}" stroke="${NEGRE}" stroke-width="1"/>`
      + txt(x, yEix + 15, `${v}`, 9, 400, 'middle');
  }
  s += `<rect x="${x0}" y="${yEix + 22}" width="10" height="9" fill="#c9ccd1" stroke="${NEGRE}" stroke-width="0.8"/>`
    + txt(x0 + 14, yEix + 30, item.series[0], 10)
    + `<rect x="${x0 + 80}" y="${yEix + 22}" width="10" height="9" fill="#5a5f66" stroke="${NEGRE}" stroke-width="0.8"/>`
    + txt(x0 + 94, yEix + 30, item.series[1], 10);
  return s;
}

/** Talla l'enunciat en línies perquè no se surti del full. */
function linies(t, max = 78) {
  const out = [];
  let l = '';
  for (const p of t.split(' ')) {
    if ((l + ' ' + p).trim().length > max) { out.push(l.trim()); l = p; } else l += ' ' + p;
  }
  if (l.trim()) out.push(l.trim());
  return out;
}

export function svgItem(item, num_, y0 = 0) {
  const ls = linies(item.enunciat);
  const cap = ls.map((l, i) => txt(16, y0 + 20 + i * 15,
    i === 0 ? `<tspan font-weight="700">${num_}.</tspan> ${l}` : l)).join('');
  const yg = y0 + 24 + ls.length * 15;
  let grafic = '', alt;
  if (item.mena === 'taula') { grafic = dibuixaTaula(item, 40, yg); alt = (item.files.length + 1) * 22; }
  else if (item.mena === 'sectors') { grafic = dibuixaSectors(item, 200, yg + 78, 62); alt = 175; }
  else { grafic = dibuixaBarres(item, 80, yg); alt = item.gent.length * 36 + 40; }
  const opcions = item.opcions.map((o, i) =>
    txt(20 + i * 110, yg + alt + 18, `${'abcd'[i]}) ${o}`, 12)).join('');
  return { svg: `<g>${cap}${grafic}${opcions}</g>`, alt: 24 + ls.length * 15 + alt + 32 };
}

export function svgFull(items) {
  let y = 8;
  const cos = items.map((it, i) => {
    const { svg, alt } = svgItem(it, i + 1, y);
    y += alt;
    return svg;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="${y + 20}" viewBox="0 0 520 ${y + 20}">
  <rect width="100%" height="100%" fill="#fff"/>
  ${cos}
</svg>`;
}

// ── Dibuix per a l'app ───────────────────────────────────────────
// Les opcions són text: només cal el gràfic.
export function svgEnunciat(item) {
  let cos, w, h;
  if (item.mena === 'taula') {
    cos = dibuixaTaula(item, 0, 0); w = 276; h = (item.files.length + 1) * 22 + 2;
  } else if (item.mena === 'sectors') {
    cos = dibuixaSectors(item, 150, 92, 62); w = 300; h = 190;
  } else {
    cos = dibuixaBarres(item, 62, 4); w = 250; h = item.gent.length * 36 + 46;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%">${cos}</svg>`;
}
