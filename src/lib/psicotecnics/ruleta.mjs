// La ruleta: una sèrie de tota la vida, però posada en cercle.
//
// El quadern ho diu amb aquestes paraules: «imagina't la ruleta com una sèrie
// qualsevol en línia recta on les figures segueixen uns patrons que has
// d'endevinar, amb la diferència que estan presentades en forma circular. El
// fet que les figures formin un cercle no canvia la dinàmica». I al final:
// «pensa que és un patró en una línia recta».
//
// Aquí el patró va per partida doble, i això és el que fa l'exercici:
//
//   · la FORMA es repeteix cada pf posicions
//   · el COLOR es repeteix cada pc posicions
//
// Amb pf i pc primers entre si, el dibuix sencer no es torna a repetir fins
// al cap de pf·pc posicions. Qui ho mira veu una desfilada que sembla que no
// es repeteixi mai, i qui ho resol ha de veure les dues rodes per separat.
//
// D'aquí en surten sols els quatre distractors, que és el que costa més de
// trobar a les famílies abstractes: la bona, la de la forma bona amb el color
// equivocat, la del color bo amb la forma equivocada, i la que falla en tots
// dos. Les quatre són plausibles i les tres dolentes ho són per un motiu
// diferent.
//
// Que la resposta sigui única no es dona per fet: es comprova contra un
// catàleg de regles. Si algun altre parell de períodes explica igual de bé
// tot el que es veu i demana una altra figura al forat, l'ítem es llença.
import { barreja, posicioBona, rng } from './atzar.mjs';

const NEGRE = '#15151C';

// ── El material ──────────────────────────────────────────────────
// Formes que no es confonen entre elles ni de lluny ni de pressa.
export const FORMES = ['cercle', 'quadrat', 'triangle', 'rombe', 'estrella', 'hexagon', 'creu'];

// Colors que se separen bé, també per a qui no distingeix el vermell del
// verd: el to i la foscor canvien alhora.
export const COLORS = [
  { id: 'blau', pinta: '#2F6DA4' },
  { id: 'taronja', pinta: '#D2762F' },
  { id: 'verd', pinta: '#3E8E5A' },
  { id: 'magenta', pinta: '#A8437E' },
  { id: 'groc', pinta: '#E3B62A' },
];

// Els parells de períodes que serveixen. Han de ser primers entre si —si no,
// el dibuix es tornaria a repetir abans i el patró seria més curt del que
// sembla— i el seu producte ha de caber dues vegades en una volta de vint-i-
// quatre com a molt. Amb més figures es toquen entre elles i al mòbil no es
// llegeixen. Per això no hi ha el 3×5: el patró faria quinze i la volta
// n'hauria de tenir trenta.
const PERIODES = [[2, 3], [3, 2], [2, 5], [5, 2], [3, 4], [4, 3]];

const mcd = (a, b) => (b ? mcd(b, a % b) : a);

// ── Llegir el patró ──────────────────────────────────────────────
/**
 * Mira si una roda de període p explica el que es veu, i si ho fa, diu què
 * hi ha a cada residu. Torna null si dues posicions del mateix residu porten
 * coses diferents: llavors aquest període no pot ser.
 */
function rodaQueEncaixa(valors, p, forat) {
  const taula = new Array(p).fill(null);
  for (let i = 0; i < valors.length; i++) {
    if (i === forat) continue;
    const r = i % p;
    if (taula[r] === null) taula[r] = valors[i];
    else if (taula[r] !== valors[i]) return null;
  }
  // Si el residu del forat no ha sortit enlloc més, aquest període no diu
  // res sobre el forat i no serveix per respondre.
  if (taula[forat % p] === null) return null;
  return taula;
}

/**
 * Totes les respostes que es poden defensar mirant només el que es veu.
 * Es proven tots els períodes fins a la meitat de la volta —més enllà ja no
 * es repetiria mai i no seria un patró— i es queden els que ho expliquen
 * tot. Si en surt més d'una resposta diferent, l'ítem és ambigu.
 */
function respostesDefensables(formes, colors, forat) {
  const n = formes.length;
  const posaFormes = new Set(), posaColors = new Set();
  for (let p = 1; p <= Math.floor(n / 2); p++) {
    const t = rodaQueEncaixa(formes, p, forat);
    if (t) posaFormes.add(t[forat % p]);
  }
  for (let p = 1; p <= Math.floor(n / 2); p++) {
    const t = rodaQueEncaixa(colors, p, forat);
    if (t) posaColors.add(t[forat % p]);
  }
  return { formes: posaFormes, colors: posaColors };
}

// ── Fer un ítem ──────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed);

  for (let intent = 0; intent < 200; intent++) {
    const [pf, pc] = PERIODES[Math.floor(r() * PERIODES.length)];
    if (mcd(pf, pc) !== 1) continue;
    const periode = pf * pc;

    // La volta ha de contenir el patró sencer com a mínim dues vegades: si
    // no, no hi hauria manera de llegir-lo. I ha de caber al dibuix.
    const voltes = [];
    for (let k = 2; k <= 4; k++) if (periode * k <= 24) voltes.push(k);
    if (!voltes.length) continue;
    const n = periode * voltes[Math.floor(r() * voltes.length)];

    const rodaF = barreja(r, FORMES).slice(0, pf);
    const rodaC = barreja(r, COLORS).slice(0, pc);

    const formes = Array.from({ length: n }, (_, i) => rodaF[i % pf]);
    const colors = Array.from({ length: n }, (_, i) => rodaC[i % pc].id);

    // El forat, en qualsevol lloc menys les dues primeres posicions: allà
    // dalt de tot es llegeix pitjor i sempre semblaria el començament.
    const forat = 2 + Math.floor(r() * (n - 3));

    // ¿Es pot respondre d'una altra manera? Si sí, fora.
    const pot = respostesDefensables(formes, colors, forat);
    if (pot.formes.size !== 1 || pot.colors.size !== 1) continue;

    const formaBona = formes[forat], colorBo = colors[forat];
    if (!pot.formes.has(formaBona) || !pot.colors.has(colorBo)) continue;

    // Les tres dolentes: forma bona amb color canviat, color bo amb forma
    // canviada, i totes dues canviades. Sempre amb material que ja surt a la
    // volta, perquè no es pugui encertar per descart.
    const altraF = rodaF.filter((f) => f !== formaBona);
    const altraC = rodaC.filter((c) => c.id !== colorBo);
    if (!altraF.length || !altraC.length) continue;
    const f2 = altraF[Math.floor(r() * altraF.length)];
    const cc = barreja(r, altraC);
    // Quan la roda de colors només en té dos, l'únic color que queda ha de
    // fer les dues feines: la de la figura bona mal pintada i la de la que
    // falla en tot. Les quatre opcions segueixen sent diferents, perquè són
    // dues figures per dos colors.
    const c2 = cc[1] || cc[0];

    const totes = [
      { forma: formaBona, color: colorBo },
      { forma: formaBona, color: cc[0].id },
      { forma: f2, color: colorBo },
      { forma: f2, color: c2.id },
    ];
    // Quatre dibuixos diferents, sempre.
    const cares = totes.map((o) => `${o.forma}/${o.color}`);
    if (new Set(cares).size !== 4) continue;

    // La lletra bona surt d'un atzar a part: si sortís d'aquest mateix, els
    // ítems descartats desviarien el repartiment cap a unes lletres o unes
    // altres.
    const desti = posicioBona(seed, 4, 'ruleta');
    const opcions = [...totes.slice(1)];
    opcions.splice(desti, 0, totes[0]);

    return {
      seed, n, pf, pc, forat,
      formes, colors,
      opcions,
      correcta: desti,
      control: {
        periodesPrimersEntreSi: mcd(pf, pc) === 1,
        elPatroEsRepeteix: n % (pf * pc) === 0 && n / (pf * pc) >= 2,
        respostaUnica: pot.formes.size === 1 && pot.colors.size === 1,
        quantesCoincideixen: opcions
          .filter((o) => o.forma === formaBona && o.color === colorBo).length,
      },
    };
  }
  return null;
}

// ── El dibuix ────────────────────────────────────────────────────
const pinta = (id) => (COLORS.find((c) => c.id === id) || COLORS[0]).pinta;

/** Una forma centrada a (cx, cy) que cap en un cercle de radi r. */
export function formaSvg(nom, cx, cy, r, color) {
  const p = (punts) => `<polygon points="${punts.map(([x, y]) =>
    `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" fill="${color}" `
    + `stroke="${NEGRE}" stroke-width="1.1" stroke-linejoin="round"/>`;
  const regular = (costats, gir) => p(Array.from({ length: costats }, (_, i) => {
    const a = gir + (i * 2 * Math.PI) / costats;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }));

  switch (nom) {
    case 'cercle':
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" `
        + `fill="${color}" stroke="${NEGRE}" stroke-width="1.1"/>`;
    case 'quadrat': {
      const c = r * 0.76;
      return `<rect x="${(cx - c).toFixed(1)}" y="${(cy - c).toFixed(1)}" `
        + `width="${(c * 2).toFixed(1)}" height="${(c * 2).toFixed(1)}" `
        + `fill="${color}" stroke="${NEGRE}" stroke-width="1.1"/>`;
    }
    case 'triangle': return regular(3, -Math.PI / 2);
    case 'rombe': return regular(4, -Math.PI / 2);
    case 'hexagon': return regular(6, -Math.PI / 2);
    case 'estrella':
      return p(Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 === 0 ? r : r * 0.45;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      }));
    case 'creu': {
      const b = r * 0.3, g = r * 0.78;
      return p([
        [cx - b, cy - g], [cx + b, cy - g], [cx + b, cy - b], [cx + g, cy - b],
        [cx + g, cy + b], [cx + b, cy + b], [cx + b, cy + g], [cx - b, cy + g],
        [cx - b, cy + b], [cx - g, cy + b], [cx - g, cy - b], [cx - b, cy - b],
      ]);
    }
    default: return '';
  }
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" `
  + `preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

/**
 * La volta. El radi de cada figura surt de quantes n'hi hagi, perquè amb
 * vint-i-quatre no es toquin i amb dotze no quedin perdudes.
 */
export function svgEnunciat(item, radi = 62) {
  const rf = Math.min(radi * 0.30, (Math.PI * radi) / item.n * 0.78);
  const marge = rf + 5;
  const w = Math.round((radi + marge) * 2);
  const c = w / 2;

  let cos = `<circle cx="${c}" cy="${c}" r="${(radi - rf - 3).toFixed(1)}" `
    + `fill="#EAF2F8" stroke="#B8CFE0" stroke-width="1.4" stroke-dasharray="5 4"/>`;

  for (let i = 0; i < item.n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / item.n;
    const x = c + radi * Math.cos(a), y = c + radi * Math.sin(a);
    if (i === item.forat) {
      cos += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rf.toFixed(1)}" `
        + `fill="#fff" stroke="${NEGRE}" stroke-width="1.4" stroke-dasharray="3 3"/>`
        + `<text x="${x.toFixed(1)}" y="${(y + rf * 0.42).toFixed(1)}" `
        + `text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" `
        + `font-weight="700" font-size="${(rf * 1.25).toFixed(1)}" fill="${NEGRE}">?</text>`;
    } else {
      cos += formaSvg(item.formes[i], x, y, rf * 0.88, pinta(item.colors[i]));
    }
  }
  return embolcall(w, w, cos);
}

export function svgOpcio(item, i, w = 54) {
  const o = item.opcions[i];
  return embolcall(w, w, formaSvg(o.forma, w / 2, w / 2, w * 0.38, pinta(o.color)));
}

export function svgFull(items) {
  const alt = 230;
  const cos = items.map((it, i) => {
    const y = i * alt + 40;
    const rot = svgEnunciat(it).replace(/^<svg[^>]*>|<\/svg>$/g, '');
    const capsa = Math.round((62 + Math.min(62 * 0.30, (Math.PI * 62) / it.n * 0.78) + 5) * 2);
    return `<g><text x="16" y="${y - 18}" font-family="ui-sans-serif,system-ui,sans-serif"`
      + ` font-size="13" fill="${NEGRE}"><tspan font-weight="700">${i + 1}.</tspan>`
      + ' Quina figura falta a la ruleta?</text>'
      + `<g transform="translate(20 ${y}) scale(${(170 / capsa).toFixed(3)})">${rot}</g>`
      + it.opcions.map((_, k) => {
        const ox = 240 + k * 96;
        return `<text x="${ox + 24}" y="${y + 16}" text-anchor="middle" `
          + `font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" `
          + `font-weight="700" fill="${NEGRE}">${'ABCD'[k]}</text>`
          + `<g transform="translate(${ox} ${y + 26})">`
          + svgOpcio(it, k).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>';
      }).join('') + '</g>';
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="660" height="${items.length * alt + 60}" `
    + `viewBox="0 0 660 ${items.length * alt + 60}"><rect width="660" `
    + `height="${items.length * alt + 60}" fill="#fff"/>${cos}</svg>`;
}
