// El catàleg: una sola porta d'entrada per a les catorze categories.
//
// Cada família té la seva forma per dins —uns tornen números, altres
// màscares, altres graelles— i això està bé, perquè cadascuna necessita el
// que necessita. Però l'app no ha de saber-ho. Aquí tot surt igual:
//
//   { id, categoria, enunciat, svg, opcions: [{ text, svg }], correcta }
//
// I el dibuix surt SEMPRE com una cadena SVG. A la web es pinta directa; a
// l'app, `react-native-svg` té `SvgXml`, que empassa la mateixa cadena tal
// com és. Un sol generador per a les dues, sense imatges i sense build: se
// n'hi va per OTA com la resta del contingut.
import * as cubs from './cubs.mjs';
import * as mirall from './mirall.mjs';
import * as figures from './figures.mjs';
import * as disc from './disc.mjs';
import * as abstracte from './abstracte.mjs';
import * as dau from './dau.mjs';
import * as series from './series.mjs';
import * as comptar from './comptar.mjs';
import * as numeric from './numeric.mjs';
import * as dades from './dades.mjs';
import * as verbal from './verbal.mjs';

const opcionsSvg = (mod, it, n) =>
  Array.from({ length: n }, (_, i) => ({ svg: mod.svgOpcio(it, i) }));
const opcionsText = (it) => it.opcions.map((o) => ({ text: String(o) }));

// ── Les catorze categories ───────────────────────────────────────
// `fes(seed)` torna l'ítem ja en el format de dalt.
export const CATEGORIES = [
  {
    id: 'cubs-desplegat',
    nom: 'Cubs desplegats',
    descripcio: 'Quin cub surt del desplegable',
    grafica: true,
    fes: (seed) => {
      // Una de cada quatre demana la que NO correspon, com als exàmens.
      const mena = seed % 4 === 3 ? 'incorrecta' : 'correcta';
      const it = cubs.generaItem(seed, mena);
      return {
        enunciat: mena === 'incorrecta'
          ? 'Quina de les opcions NO correspon amb el cub desplegat una vegada muntat?'
          : 'Quina de les opcions correspon amb el cub desplegat una vegada muntat?',
        svg: cubs.svgEnunciat(it),
        opcions: opcionsSvg(cubs, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'cubs-mirall',
    nom: 'Cubs i mirall',
    descripcio: 'Un cub, un mirall i quin desplegable li correspon',
    grafica: true,
    fes: (seed) => {
      const mena = seed % 4 === 3 ? mirall.INCORRECTA : mirall.CORRECTA;
      const it = mirall.generaItem(seed, mena);
      return {
        enunciat: 'Es presenta un cub i un mirall, on es mostren les cares ocultes. '
          + (mena === mirall.INCORRECTA
            ? 'Quina de les següents opcions, un cop formada, NO representa el cub?'
            : 'Quina de les següents opcions, un cop formada, representa el cub?'),
        svg: mirall.svgEnunciat(it),
        opcions: opcionsSvg(mirall, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'figura-reflectida',
    nom: 'Imatge reflectida',
    descripcio: 'Quina figura és la imatge en un mirall',
    grafica: true,
    fes: (seed) => {
      const it = figures.generaItem(seed, figures.MIRALL);
      return {
        enunciat: 'Quina figura és la imatge de mostra reflectida en un mirall?',
        svg: figures.svgEnunciat(it),
        opcions: opcionsSvg(figures, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'figura-girada',
    nom: 'Imatge girada',
    descripcio: 'Quina figura és la mateixa girada, sense reflectir',
    grafica: true,
    fes: (seed) => {
      const it = figures.generaItem(seed, figures.GIR);
      return {
        enunciat: 'Quina figura és la imatge de mostra però girada (sense reflectir)?',
        svg: figures.svgEnunciat(it),
        opcions: opcionsSvg(figures, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'disc',
    nom: 'Rotació de disc',
    descripcio: 'Quin disc és el model girat',
    grafica: true,
    fes: (seed) => {
      const it = disc.generaItem(seed);
      return {
        enunciat: 'Quina de les quatre imatges següents es correspon amb el model?',
        svg: disc.svgEnunciat(it),
        opcions: opcionsSvg(disc, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'abstracte',
    nom: 'Matriu abstracta',
    descripcio: 'Completar la matriu de figures de línia',
    grafica: true,
    fes: (seed) => {
      const it = abstracte.generaItem(seed);
      return {
        enunciat: 'Trieu la imatge que completa millor la matriu:',
        svg: abstracte.svgEnunciat(it),
        opcions: opcionsSvg(abstracte, it, 5),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'series-figures',
    nom: 'Sèries de figures',
    descripcio: 'Quina figura continua la sèrie',
    grafica: true,
    fes: (seed) => {
      const it = series.generaItem(seed);
      return {
        enunciat: 'Trieu la figura que completa millor la sèrie:',
        svg: series.svgEnunciat(it),
        opcions: opcionsSvg(series, it, 4),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'dau-planol',
    nom: 'El dau que roda',
    descripcio: 'Quin número queda a dalt en arribar a la X',
    grafica: true,
    fes: (seed) => {
      const it = dau.generaItem(seed);
      return {
        enunciat: 'Quin número quedarà a la part SUPERIOR del dau quan es desplaci rodant '
          + 'per les caselles grises fins a la marcada amb una X? '
          + 'RECORDEU: la suma dels costats oposats d\'un dau sempre és set.',
        svg: dau.svgEnunciat(it),
        opcions: opcionsText(it),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'comptar-simbols',
    nom: 'Comptar símbols',
    descripcio: 'Quants n\'hi ha d\'iguals o de diferents',
    grafica: true,
    fes: (seed) => {
      const mena = seed % 2 ? comptar.IGUALS : comptar.DIFERENTS;
      const it = comptar.generaComptatge(seed, mena);
      return {
        enunciat: `Quants símbols ${mena} a aquest hi ha en la següent sèrie?`,
        svgObjectiu: comptar.svgObjectiu(it),
        svg: comptar.svgEnunciat(it),
        opcions: opcionsText(it),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'correspondencies',
    nom: 'Correspondències',
    descripcio: 'Quantes són correctes o incorrectes',
    grafica: true,
    fes: (seed) => {
      const mena = seed % 2 ? comptar.CORRECTES : comptar.INCORRECTES;
      const it = comptar.generaCorrespondencies(seed, mena);
      return {
        enunciat: `Quantes correspondències ${mena.toUpperCase()} hi ha en la segona taula?`,
        svg: comptar.svgEnunciat(it),
        opcions: opcionsText(it),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'numeric',
    nom: 'Aritmètica i sèries',
    descripcio: 'Problemes, percentatges, probabilitat i sèries de números',
    grafica: false,
    fes: (seed) => {
      const it = numeric.generaItem(seed);
      return {
        enunciat: it.enunciat, svg: null,
        opcions: opcionsText(it), correcta: it.correcta,
      };
    },
  },
  {
    id: 'dades',
    nom: 'Taules i gràfics',
    descripcio: 'Llegir una taula, un gràfic de sectors o un de barres',
    grafica: true,
    fes: (seed) => {
      const it = dades.generaItem(seed);
      return {
        enunciat: it.enunciat,
        svg: dades.svgEnunciat(it),
        opcions: opcionsText(it),
        correcta: it.correcta,
      };
    },
  },
  {
    id: 'sinonims',
    nom: 'Sinònims i antònims',
    descripcio: 'La paraula de significat més semblant o més oposat',
    grafica: false,
    fes: (seed) => {
      const it = verbal.generaParaula(seed);
      return {
        enunciat: it.enunciat, svg: null,
        opcions: opcionsText(it), correcta: it.correcta,
      };
    },
  },
  {
    id: 'analogies',
    nom: 'Analogies verbals',
    descripcio: 'Completar l\'analogia entre parelles de paraules',
    grafica: false,
    fes: (seed) => {
      const it = verbal.generaAnalogia(seed);
      return {
        enunciat: it.enunciat, svg: null,
        opcions: opcionsText(it), correcta: it.correcta,
      };
    },
  },
];

export const PER_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// ── Els blocs d'aptituds ─────────────────────────────────────────
// Els exàmens no van per categories soltes: van per aptituds, i la nota
// surt de com et vagi a cadascuna. Les catorze categories reparteixen en
// cinc blocs, que són els de sempre a les proves policials.
export const BLOCS = [
  {
    id: 'verbal',
    nom: 'Aptitud verbal',
    descripcio: 'Vocabulari i relacions entre paraules',
    categories: ['sinonims', 'analogies'],
  },
  {
    id: 'numeric',
    nom: 'Aptitud numèrica',
    descripcio: 'Càlcul, proporcions, gràfics i sèries de números',
    categories: ['numeric', 'dades'],
  },
  {
    id: 'espacial',
    nom: 'Aptitud espacial',
    descripcio: 'Cubs, plegats, girs i reflexos',
    categories: ['cubs-desplegat', 'cubs-mirall', 'figura-reflectida',
      'figura-girada', 'disc', 'dau-planol'],
  },
  {
    id: 'abstracte',
    nom: 'Raonament abstracte',
    descripcio: 'Trobar la regla i continuar-la',
    categories: ['abstracte', 'series-figures'],
  },
  {
    id: 'atencio',
    nom: 'Atenció i percepció',
    descripcio: 'Comptar i comparar de pressa i sense equivocar-se',
    categories: ['comptar-simbols', 'correspondencies'],
  },
];

export const BLOC_DE = Object.fromEntries(
  BLOCS.flatMap((b) => b.categories.map((c) => [c, b.id])),
);

/** Un ítem de la categoria que sigui, sempre amb la mateixa forma. */
export function genera(categoriaId, seed) {
  const cat = PER_ID[categoriaId];
  if (!cat) throw new Error(`categoria desconeguda: ${categoriaId}`);
  const it = cat.fes(seed);
  return { id: `${categoriaId}:${seed}`, categoria: categoriaId, ...it };
}

// ── Els simulacres ───────────────────────────────────────────────
// Els dos exàmens de referència no porten la mateixa barreja, o sigui que
// n'hi ha dos. Els pesos surten de comptar què hi surt a cada examen.
export const SIMULACRES = {
  mossos: {
    nom: 'Mossos d\'Esquadra',
    pesos: {
      'comptar-simbols': 15, dades: 12, abstracte: 10, sinonims: 10, numeric: 9,
      disc: 5, 'series-figures': 7, correspondencies: 3, 'cubs-desplegat': 3,
      'dau-planol': 3, analogies: 3,
    },
  },
  iopos: {
    nom: 'iOpos / Policia Local',
    pesos: {
      sinonims: 8, analogies: 8, numeric: 16, 'cubs-desplegat': 8, 'cubs-mirall': 8,
      'series-figures': 8, abstracte: 8, 'figura-reflectida': 8, 'figura-girada': 8,
    },
  },
};

/**
 * La llista de categories d'un simulacre de `quantes` preguntes, respectant
 * els pesos. Es reparteix per la part sencera i el que sobra va a les que
 * s'han quedat més curtes: així un simulacre de deu no deixa fora els
 * blocs grans.
 */
export function repartiment(perfil, quantes) {
  const pesos = SIMULACRES[perfil].pesos;
  const total = Object.values(pesos).reduce((a, b) => a + b, 0);
  const exacte = Object.entries(pesos).map(([id, p]) => ({ id, ideal: (p * quantes) / total }));
  const out = exacte.map((e) => ({ ...e, n: Math.floor(e.ideal) }));
  let falten = quantes - out.reduce((s, e) => s + e.n, 0);
  out.sort((a, b) => (b.ideal - b.n) - (a.ideal - a.n));
  for (let i = 0; falten > 0; i = (i + 1) % out.length, falten--) out[i].n++;
  return out.filter((e) => e.n > 0).map(({ id, n }) => ({ id, n }));
}

/**
 * Un examen d'un sol bloc d'aptitud, repartit entre les seves categories.
 * Serveix per treballar la que et falla sense fer l'examen sencer.
 */
export function repartimentBloc(blocId, quantes) {
  const cats = BLOCS.find((b) => b.id === blocId).categories;
  const out = cats.map((id) => ({ id, n: Math.floor(quantes / cats.length) }));
  let falten = quantes - out.reduce((s, e) => s + e.n, 0);
  for (let i = 0; falten > 0; i = (i + 1) % out.length, falten--) out[i].n++;
  return out.filter((e) => e.n > 0);
}

/** Un simulacre sencer, ja barrejat però amb les categories repartides. */
export function simulacre(perfil, quantes, llavor = 1) {
  const plan = BLOCS.some((b) => b.id === perfil)
    ? repartimentBloc(perfil, quantes)
    : repartiment(perfil, quantes);
  const items = [];
  let k = 0;
  for (const { id, n } of plan) {
    for (let i = 0; i < n; i++) items.push(genera(id, llavor * 1000 + k++));
  }
  // Barreja determinista: la mateixa llavor dona sempre el mateix examen.
  let s = (llavor * 2654435761) >>> 0;
  for (let i = items.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

// ── El temps ─────────────────────────────────────────────────────
// L'examen oficial són 80 preguntes en 35 minuts: 26,25 segons cadascuna.
// Els altres formats mantenen el mateix ritme.
export const SEGONS_PER_PREGUNTA = (35 * 60) / 80;
export const LLARGADES = [10, 30, 80];

export const segonsPer = (quantes) => Math.round(quantes * SEGONS_PER_PREGUNTA);

export function tempsText(quantes) {
  const s = segonsPer(quantes);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
