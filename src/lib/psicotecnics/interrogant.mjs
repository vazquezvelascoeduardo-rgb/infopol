// «Quina cara correspon a l'interrogant?»
//
// Es veu un cub muntat, amb tres cares a la vista, i al costat un
// desplegable del mateix cub amb dues caselles dibuixades, una amb un
// interrogant i tres en blanc. Cal dir quina figura va a l'interrogant.
//
// És germà dels cubs desplegats que ja hi havia, però al revés: allà es
// donava el desplegable sencer i calia triar el cub; aquí es dona el cub i
// falta una casella del desplegable. Per resoldre'l s'ha de plegar el
// desplegable de cap, veure quina cara toca l'interrogant i llegir-la del
// cub. És el que hi ha al quadern, a la pàgina 29.
//
// ── Quantes caselles s'han de dibuixar, i quines ─────────────────
//
// Això no ho vaig endevinar: ho vaig comptar. Es van provar totes les
// combinacions de caselles dibuixades sobre totes les maneres de girar el
// cub, i només n'hi ha UNA que funcioni:
//
//   TRES caselles dibuixades, de les quals EXACTAMENT UNA es vegi al cub.
//
//   · Amb menys de tres, la resposta no és única. L'ancora que es veu diu
//     quina cara és, però encara queden quatre maneres de girar el cub al
//     seu voltant, i fan falta les altres dues —que van a parar al darrere—
//     per acabar de lligar-ho.
//   · Si se'n veiessin dues, hi hauria drecera: les cares que es veuen són
//     tres, i si dues estiguessin dibuixades, l'interrogant seria per força
//     la tercera sense haver de plegar res. Per això se n'exigeixen dues de
//     visibles SENSE dibuixar.
//
// De 432 combinacions possibles, 144 compleixen les dues coses. La resta
// surten ambigües o deixen l'interrogant en una cara que no es veu, i
// llavors la seva figura no es podria saber de cap manera.
//
// Els tres distractors són figures que NO surten dibuixades al desplegable.
// Si n'hi sortís cap, es podria descartar de seguida: dues cares d'un cub
// no porten mai la mateixa figura. En canvi no cal que siguin cares del
// cub: qui ho resol només en veu tres, o sigui que una figura de fora és
// igual de plausible que una de les tres que no veu.
//
// ── Que la resposta sigui única ──────────────────────────────────
//
// Això no es dona per fet, es compta. El plegat no depèn de les figures,
// només de la forma del desplegable, o sigui que es plega una vegada i se
// sap, per a cadascuna de les 24 maneres de girar el cub, quines tres
// caselles queden a la vista. Després es miren totes les que quadren amb el
// que es veu, i s'apunta què hauria d'anar a l'interrogant en cada cas. Si
// en surt més d'una resposta, l'ítem no surt.
import { barreja, posicioBona, rng, tria } from './atzar.mjs';
import { orientacions, plega, valid, vista, VISTA_CUB, FORMES, K, projecta, suma, V } from './plegat.mjs';
import { COLORS, FORMES as FIGURES, formaSvg } from './ruleta.mjs';

const NEGRE = '#15151C';

/** Les figures que es fan servir, amb el seu color. Sis per cub. */
const REPERTORI = [];
for (const forma of FIGURES) for (const c of COLORS) REPERTORI.push({ forma, color: c.id });

const noms = (s) => `${s.forma}/${s.color}`;
const pinta = (id) => (COLORS.find((c) => c.id === id) || COLORS[0]).pinta;

// ── Fer un ítem ──────────────────────────────────────────────────
export function generaItem(seed) {
  const r = rng(seed, 17);

  for (let intent = 0; intent < 300; intent++) {
    // El desplegable. El `dibuix` de cada casella és la seva pròpia clau:
    // així el plegat surt de la forma i prou, i les figures s'hi posen
    // després. Plegar una vegada val per a totes les proves que vindran.
    const forma = tria(r, Object.keys(FORMES));
    const celles = FORMES[forma].map(([nx, ny]) => ({ nx, ny, dibuix: `${nx},${ny}` }));
    const cares = plega(celles);
    if (!valid(cares)) continue;
    const cub = [...cares.values()];

    // Per a cadascuna de les 24 maneres de girar el cub, quines caselles
    // queden a dalt, a l'esquerra i a la dreta.
    const mirades = orientacions(cub).map((o) => vista(o, VISTA_CUB).map((x) => x.dibuix));

    // La que es dibuixa.
    const laVista = tria(r, mirades);

    // Deu figures diferents: sis per a les cares i quatre per triar-ne els
    // distractors, que no han de ser cares del cub.
    const figures = barreja(r, REPERTORI).slice(0, 10);
    const simbol = {};
    celles.forEach((c, i) => { simbol[c.dibuix] = figures[i]; });

    // L'interrogant, en una casella que es vegi al cub: si anés a una cara
    // del darrere, la figura no es podria saber de cap manera.
    const forat = tria(r, laVista);

    // Tres ancores, exactament una de visible.
    const altres = celles.map((c) => c.dibuix).filter((k) => k !== forat);
    const ancores = barreja(r, altres).slice(0, 3);
    if (ancores.filter((k) => laVista.includes(k)).length !== 1) continue;
    // I que quedin dues cares visibles sense dibuixar: si no, hi ha drecera.
    if (laVista.filter((k) => !ancores.includes(k)).length < 2) continue;

    const observat = laVista.map((k) => simbol[k]);
    const possibles = respostes({ mirades, observat, ancores, simbol, forat });
    if (possibles === null || possibles.size !== 1) continue;
    if (!possibles.has(noms(simbol[forat]))) continue;

    // Els distractors: figures que no surten dibuixades al desplegable.
    const dibuixades = new Set(ancores.map((k) => noms(simbol[k])));
    const bona = simbol[forat];
    const cands = figures.filter((f) => noms(f) !== noms(bona) && !dibuixades.has(noms(f)));
    if (cands.length < 3) continue;
    const totes = [bona, ...barreja(r, cands).slice(0, 3)];
    if (new Set(totes.map(noms)).size !== 4) continue;

    const desti = posicioBona(seed, 4, 'interrogant');
    const opcions = totes.slice(1);
    opcions.splice(desti, 0, bona);

    return {
      seed, forma, celles, ancores, forat, simbol, laVista,
      opcions,
      correcta: desti,
      control: {
        elForatEsVeu: laVista.includes(forat),
        capAncoraAlForat: !ancores.includes(forat),
        tresAncores: ancores.length === 3,
        nomesUnaAncoraEsVeu: ancores.filter((k) => laVista.includes(k)).length === 1,
        quedenDuesCaresVisiblesSenseDibuixar:
          laVista.filter((k) => !ancores.includes(k)).length >= 2,
        respostaUnica: possibles.size === 1,
        sisFiguresDiferents: new Set(celles.map((c) => noms(simbol[c.dibuix]))).size === 6,
        capOpcioJaDibuixada: totes.every((f, i) =>
          i === 0 || !ancores.some((k) => noms(simbol[k]) === noms(f))),
      },
    };
  }
  return null;
}

/**
 * Què podria anar a l'interrogant, mirant només el que es veu.
 *
 * Es proven les 24 maneres de girar el cub. Una serveix si, a les tres
 * posicions que es veuen, hi cau el que toca: on hi ha una casella ancorada
 * hi ha d'anar la seva figura, i on n'hi ha una de lliure hi ha d'anar una
 * figura que NO estigui ancorada —una figura ancorada ja té el seu lloc i no
 * pot sortir en dos llocs alhora.
 *
 * Torna null si en alguna manera que serveix l'interrogant queda fora de la
 * vista: llavors la seva figura no es podria saber i l'ítem no val.
 */
function respostes({ mirades, observat, ancores, simbol, forat }) {
  const ancorades = new Set(ancores.map((k) => noms(simbol[k])));
  const fora = new Set();
  for (const t of mirades) {
    let va = true;
    for (let i = 0; i < 3 && va; i++) {
      if (ancores.includes(t[i])) va = noms(simbol[t[i]]) === noms(observat[i]);
      else va = !ancorades.has(noms(observat[i]));
    }
    if (!va) continue;
    const on = t.indexOf(forat);
    if (on === -1) return null;
    fora.add(noms(observat[on]));
  }
  return fora;
}

// ── El dibuix ────────────────────────────────────────────────────
/** Una figura dins d'un quadrat de costat 1, per posar-la on faci falta. */
function figuraUnitat(s) {
  return formaSvg(s.forma, 0.5, 0.5, 0.33, pinta(s.color),
    { contorn: true, gruix: 0.09, decimals: 3 });
}

/** El cub muntat, amb les tres cares que es veuen. */
function cubMuntat(cx, cy, item, s) {
  const pt = (p) => {
    const q = projecta(p, s);
    return { x: cx + q.x, y: cy + q.y };
  };
  return VISTA_CUB.map((ref, i) => {
    const o = origenDe(ref);
    const O = pt(o), A = pt(suma(o, ref.u)), B = pt(suma(o, ref.v));
    const C = pt(suma(suma(o, ref.u), ref.v));
    const pts = [O, A, C, B].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    // La matriu porta el quadrat de costat 1 al paral·lelogram de la cara,
    // o sigui que la figura es pot dibuixar com si fos plana.
    const m = `matrix(${(A.x - O.x).toFixed(4)} ${(A.y - O.y).toFixed(4)} `
      + `${(B.x - O.x).toFixed(4)} ${(B.y - O.y).toFixed(4)} `
      + `${O.x.toFixed(3)} ${O.y.toFixed(3)})`;
    return `<polygon points="${pts}" fill="#fff"/>`
      + `<g transform="${m}">${figuraUnitat(item.simbol[item.laVista[i]])}</g>`
      + `<polygon points="${pts}" fill="none" stroke="${NEGRE}" stroke-width="1.5" `
      + `stroke-linejoin="round"/>`;
  }).join('');
}

/** El cantó de la cara des d'on va el marc. Les tres visibles el tenen fix. */
const ORIGENS = { dalt: V(0, 1, 0), esquerra: V(0, 1, 1), dreta: V(1, 1, 1) };
const origenDe = (ref) => ORIGENS[ref.nom];

/** El desplegable, amb les ancores dibuixades i l'interrogant al seu lloc. */
function desplegable(x, y, item, c) {
  const minX = Math.min(...item.celles.map((q) => q.nx));
  const minY = Math.min(...item.celles.map((q) => q.ny));
  return item.celles.map((ce) => {
    const px = x + (ce.nx - minX) * c, py = y + (ce.ny - minY) * c;
    let dins = '';
    if (ce.dibuix === item.forat) {
      dins = `<text x="${(px + c / 2).toFixed(1)}" y="${(py + c * 0.7).toFixed(1)}" `
        + `text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" `
        + `font-weight="700" font-size="${(c * 0.55).toFixed(1)}" fill="${NEGRE}">?</text>`;
    } else if (item.ancores.includes(ce.dibuix)) {
      dins = `<g transform="matrix(${c} 0 0 ${c} ${px} ${py})">`
        + `${figuraUnitat(item.simbol[ce.dibuix])}</g>`;
    }
    return `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="#fff"/>${dins}`
      + `<rect x="${px}" y="${py}" width="${c}" height="${c}" fill="none" `
      + `stroke="${NEGRE}" stroke-width="1.5"/>`;
  }).join('');
}

const embolcall = (w, h, cos) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" `
  + `preserveAspectRatio="xMidYMid meet">${cos}</svg>`;

export const MIDA_ENUNCIAT = { w: 258, h: 132 };

export function svgEnunciat(item) {
  const { w, h } = MIDA_ENUNCIAT;
  const c = 30;
  const ampla = (Math.max(...item.celles.map((q) => q.nx))
    - Math.min(...item.celles.map((q) => q.nx)) + 1) * c;
  const alta = (Math.max(...item.celles.map((q) => q.ny))
    - Math.min(...item.celles.map((q) => q.ny)) + 1) * c;
  return embolcall(w, h,
    cubMuntat(48, h / 2 + 24, item, 30)
    + desplegable(w - ampla - 12, (h - alta) / 2, item, c));
}

export function svgOpcio(item, i, w = 50) {
  return embolcall(w, w,
    `<g transform="matrix(${w} 0 0 ${w} 0 0)">${figuraUnitat(item.opcions[i])}</g>`);
}

export function svgFull(items) {
  const alt = 168;
  const X0 = 14 + MIDA_ENUNCIAT.w + 34;
  const cos = items.map((it, i) => {
    const y = i * alt;
    const op = it.opcions.map((_, k) => {
      const x = X0 + k * 72;
      return `<g transform="translate(${x} ${y + 42})">`
        + svgOpcio(it, k).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>'
        + `<text x="${x + 25}" y="${y + 110}" text-anchor="middle" `
        + `font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" `
        + `font-weight="700" fill="${NEGRE}">${'ABCD'[k]}</text>`;
    }).join('');
    return `<g><text x="16" y="${y + 22}" font-family="ui-sans-serif,system-ui,sans-serif"`
      + ` font-size="13" fill="${NEGRE}"><tspan font-weight="700">${i + 1}.</tspan>`
      + ' Quina cara correspon a l\'interrogant?</text>'
      + `<g transform="translate(14 ${y + 28})">`
      + svgEnunciat(it).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g>' + op + '</g>';
  }).join('');
  const w = X0 + 3 * 72 + 60;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" `
    + `height="${items.length * alt + 24}" viewBox="0 0 ${w} ${items.length * alt + 24}">`
    + `<rect width="100%" height="100%" fill="#fff"/>${cos}</svg>`;
}
