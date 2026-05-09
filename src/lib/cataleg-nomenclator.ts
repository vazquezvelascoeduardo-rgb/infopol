// Nomenclàtor SCT 2026 · biblioteca de "conceptes oficials per al butlletí".
//
// Els checklists d'Operativa › Trànsit (`src/data/trafico-checklists/*.json`)
// són la font canònica dels conceptes que escriuen els agents al butlletí
// de denúncia: cada node té parells `article_butlleta` + `concepte_butlleta`.
// Aquí les recollim, les indexem per `(lawId, article)` i les exposem
// tant al SuperBuscador (mòdul React) com a la fitxa del catàleg
// (vanilla JS, via window.__infopolNomenclator).

import alcoholemia from '../data/trafico-checklists/alcoholemia.json';
import asseguranca from '../data/trafico-checklists/asseguranca.json';
import accident from '../data/trafico-checklists/accident.json';
import itv from '../data/trafico-checklists/itv.json';
import docFalsa from '../data/trafico-checklists/doc-falsa.json';
import drogues from '../data/trafico-checklists/drogues.json';
import temerari from '../data/trafico-checklists/temerari-negligent.json';
import matricules from '../data/trafico-checklists/matricules.json';
import permis from '../data/trafico-checklists/permis.json';
import mobil from '../data/trafico-checklists/mobil-cinturo-casc.json';
import tintats from '../data/trafico-checklists/tintats-llums.json';
import velocitat from '../data/trafico-checklists/velocitat.json';
import vehicleAbandonat from '../data/trafico-checklists/vehicle-abandonat.json';

export type NomEntry = {
  /** Codi intern de la llei (lsv, rgc, rgcond, rgv, seg, cp). */
  law: string;
  /** Article normalitzat en minúscules (ex. "76.g", "129.2.b"). */
  article: string;
  /** Concepte oficial per al butlletí (text complet, en català). */
  concept: string;
  /** Article tal i com surt al checklist ("Art. 76.G TRLSV"). */
  rawArticle: string;
};

const SOURCES: { id: string; data: unknown }[] = [
  { id: 'alcoholemia', data: alcoholemia },
  { id: 'asseguranca', data: asseguranca },
  { id: 'accident', data: accident },
  { id: 'itv', data: itv },
  { id: 'doc-falsa', data: docFalsa },
  { id: 'drogues', data: drogues },
  { id: 'temerari', data: temerari },
  { id: 'matricules', data: matricules },
  { id: 'permis', data: permis },
  { id: 'mobil', data: mobil },
  { id: 'tintats', data: tintats },
  { id: 'velocitat', data: velocitat },
  { id: 'vehicle-abandonat', data: vehicleAbandonat },
];

// "Art. 76.G TRLSV" → [{law: 'lsv', article: '76.g'}]
// "Art. 25 RGV · Art. 76.G TRLSV" → 2 entrades (split per '·' o '+')
function parseArticleRef(rawRef: string): { law: string; article: string }[] {
  const out: { law: string; article: string }[] = [];
  for (const part of rawRef.split(/\s*[·+]\s*/)) {
    const am = part.match(/art\.?\s*(\S+)/i);
    if (!am) continue;
    // Treu signes de puntuació no rellevants però conserva números, dots i lletres.
    const article = am[1].replace(/[^\w.]/g, '').toLowerCase();
    if (!article) continue;
    let law = '';
    if (/rg\s+conductors|rg\s*cond\.?|reglament general de conductors/i.test(part)) law = 'rgcond';
    else if (/rdl\s*8\/?\s*2004|asseguran|\bsoa\b/i.test(part)) law = 'seg';
    else if (/\btrlsv\b|\blsv\b/i.test(part)) law = 'lsv';
    else if (/\brgv\b|reglament general de vehicles/i.test(part)) law = 'rgv';
    else if (/\brgc\b|reglament general de circulaci/i.test(part)) law = 'rgc';
    else if (/\bcp\b|codi penal|codigo penal/i.test(part)) law = 'cp';
    if (law) out.push({ law, article });
  }
  return out;
}

// Recorre l'arbre de nodes del checklist agafant tots els objectes amb
// `concepte_butlleta` i `article_butlleta`.
function collectFromNode(node: unknown, entries: NomEntry[]): void {
  if (!node || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const concept = obj.concepte_butlleta;
  const articleRef = obj.article_butlleta;
  if (typeof concept === 'string' && typeof articleRef === 'string') {
    for (const ref of parseArticleRef(articleRef)) {
      entries.push({
        law: ref.law,
        article: ref.article,
        concept: concept.trim(),
        rawArticle: articleRef.trim(),
      });
    }
  }
  for (const value of Object.values(obj)) {
    if (Array.isArray(value)) {
      for (const v of value) collectFromNode(v, entries);
    } else if (value && typeof value === 'object') {
      collectFromNode(value, entries);
    }
  }
}

let cachedEntries: NomEntry[] | null = null;
let cachedIndex: Map<string, NomEntry[]> | null = null;

function ensureCache(): void {
  if (cachedEntries && cachedIndex) return;
  const entries: NomEntry[] = [];
  for (const src of SOURCES) {
    collectFromNode(src.data, entries);
  }
  // Dedupliquem per (law, article, concept) — un mateix concepte pot
  // aparèixer a diversos checklists.
  const seen = new Set<string>();
  const dedup: NomEntry[] = [];
  for (const e of entries) {
    const k = `${e.law}|${e.article}|${e.concept}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(e);
  }
  const idx = new Map<string, NomEntry[]>();
  for (const e of dedup) {
    const key = `${e.law}:${e.article}`;
    if (!idx.has(key)) idx.set(key, []);
    idx.get(key)!.push(e);
  }
  cachedEntries = dedup;
  cachedIndex = idx;
}

export function getNomenclatorEntries(): NomEntry[] {
  ensureCache();
  return cachedEntries!;
}

// Cerca el concepte oficial per a un parell (lawId, article).
//   - lawId: 'lsv' | 'rgc' | 'rgcond' | 'rgv' | 'seg' | 'cp'
//   - article: tal com surt al catàleg (p.ex. "76.G", "117.1", "20"…)
// Si hi ha múltiples conceptes per al mateix article, prova de triar el
// que s'assembla més al text de la fila (per "rowText"), o retorna el
// primer si no n'hi ha cap clar guanyador.
export function findOfficialConcept(
  lawId: string,
  article: string | undefined,
  rowText?: string,
): NomEntry | null {
  if (!article) return null;
  ensureCache();
  const normArticle = article.replace(/[^\w.]/g, '').toLowerCase();
  const candidates = cachedIndex!.get(`${lawId}:${normArticle}`);
  if (!candidates || candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  // Múltiples candidats: triem el de major similitud lexical amb rowText.
  if (rowText) {
    const norm = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const target = norm(rowText);
    const scored = candidates.map((c) => {
      const t = norm(c.concept);
      // Comptem paraules de ≥4 lletres compartides — n'hi ha prou per
      // distingir conceptes molt similars d'un mateix article.
      let s = 0;
      for (const w of new Set(target.split(/\W+/).filter((w) => w.length >= 4))) {
        if (t.includes(w)) s++;
      }
      return { c, s };
    });
    scored.sort((a, b) => b.s - a.s);
    return scored[0].c;
  }
  return candidates[0];
}

// Exposa l'índex al window perquè els scripts inline de les fitxes
// (rendaritzades per HtmlInline en vanilla JS) puguin fer la mateixa
// cerca. La forma del payload és un objecte { "law:article": [...] }.
export function exposeNomenclatorToWindow(): void {
  if (typeof window === 'undefined') return;
  ensureCache();
  const flat: Record<string, NomEntry[]> = {};
  for (const [key, list] of cachedIndex!.entries()) {
    flat[key] = list;
  }
  (window as unknown as { __infopolNomenclator?: Record<string, NomEntry[]> })
    .__infopolNomenclator = flat;
}
