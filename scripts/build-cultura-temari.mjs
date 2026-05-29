// Converteix les dades del disseny (cultura-data-a.jsx + cultura-data-b.jsx)
// en un mòdul TypeScript tipat: src/data/cultura-temari.ts
import fs from 'node:fs';

const DESIGN = '_tmp_pdf/design_pkg/infopol-template/project';
const rawA = fs.readFileSync(`${DESIGN}/cultura-data-a.jsx`, 'utf8');
const rawB = fs.readFileSync(`${DESIGN}/cultura-data-b.jsx`, 'utf8');

// Extreu el contingut entre `window.CULTURA_AREAS.push(` i el `);` final.
function extract(raw) {
  const start = raw.indexOf('window.CULTURA_AREAS.push(');
  const body = raw.slice(start + 'window.CULTURA_AREAS.push('.length);
  // L'últim `);` tanca el push. Retallem fins a l'últim `)`.
  const lastParen = body.lastIndexOf(');');
  return body.slice(0, lastParen).trim();
}

const aBody = extract(rawA); // àrees 1-8 (objectes separats per coma)
const bBody = extract(rawB); // àrees 9-16

// Combinem els dos cossos en un sol array.
const combined = `${aBody},\n${bBody}`;

const header = `// Temari de Cultura General — 16 àrees, ~400 fets clau.
// Dades curades del temari oficial (contingut en castellà, chrome en català).
// Generat des del disseny de Claude Design via scripts/build-cultura-temari.mjs.
//
// Tipus de bloc:
//   sub     → divisor de subsecció { k:'sub', label }
//   defs    → llista terme→definició { k:'defs', title, items:[[t,d],...] }
//   records → targetes etiqueta/valor/nota { k:'records', title, items:[[l,v,n],...] }
//   table   → taula { k:'table', title, head:[...], rows:[[...],...] }
//   chips   → etiquetes { k:'chips', title, items:[...] }
//   works   → obres per autor { k:'works', title, items:[{n,m?,w:[...]}] }
//   quotes  → cites { k:'quotes', title, items:[[cita,autor],...] }

export type CulturaBlock =
  | { k: 'sub'; label: string }
  | { k: 'defs'; title?: string; items: [string, string][] }
  | { k: 'records'; title?: string; items: [string, string, string][] }
  | { k: 'table'; title?: string; head: string[]; rows: string[][] }
  | { k: 'chips'; title?: string; items: string[] }
  | { k: 'works'; title?: string; items: { n: string; m?: string; w: string[] }[] }
  | { k: 'quotes'; title?: string; items: [string, string][] };

export type CulturaArea = {
  id: string;
  ca: string;
  es: string;
  icon: string;
  blurb: string;
  blocks: CulturaBlock[];
};

export const CULTURA_AREAS: CulturaArea[] = [
${combined}
];
`;

fs.writeFileSync('src/data/cultura-temari.ts', header, 'utf8');
console.log('Generat src/data/cultura-temari.ts');
