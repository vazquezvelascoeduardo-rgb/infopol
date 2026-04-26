// Cercador transversal del mòdul Operativa (Trànsit + Penal).
//
// Indexa TOTS els camps de cada checklist (titol, text, info, accions,
// concepte_butlleta, base_legal, etc.) i de l'índex (titols dels
// escenaris). Quan l'usuari escriu una paraula a la barra de cerca:
//   - Recorre cada checklist
//   - Per cada node mira si algun string conté la consulta (sense
//     accents, sense majúscules)
//   - Agrupa els resultats per escenari (1 card per escenari) i mostra
//     fins a 3 fragments coincidents amb context
//
// L'enllaç de cada resultat porta al runner del checklist (pantalla
// inicial). Des d'allà l'usuari recorre les opcions normalment.

import {
  TRAFICO_INDEX,
  getChecklist as getTraficoChecklist,
} from './operativa-trafico';
import {
  PENAL_INDEX,
  getPenalChecklist,
} from './operativa-penal';

export type OpSearchModule = 'trafico' | 'penal';

export type OpSearchHit = {
  // Camp on s'ha trobat (per a debug / icona). Exemples: 'titol',
  // 'concepte_butlleta', 'accions_ordenades', etc.
  field: string;
  // Snippet amb la paraula coincident (la marquem amb <mark> al render).
  snippet: string;
  // ID del node (només per a hits dins de nodes).
  nodeId?: string;
  // Si el node és final, ho indiquem (per pintar-ho amb el color del tipus).
  isFinal?: boolean;
  // Tipus del node final (penal/admin/ok/...) si aplica.
  tipus?: string;
};

export type OpSearchResult = {
  module: OpSearchModule;
  scenarioId: string;
  scenarioTitle: string;
  // Per al mòdul penal: bloc al qual pertany l'escenari (color + label).
  blocLabel?: string;
  blocColor?: string;
  // URL al runner del checklist.
  url: string;
  // Hits trobats (limitats a uns quants per a no inundar).
  hits: OpSearchHit[];
  // Score per a ordenar.
  score: number;
};

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Recorre recursivament un objecte/array i emet [path, string] per a
// cada string descobert. El path identifica el camp d'origen (per ex.
// 'concepte_butlleta', 'accions_ordenades').
function* walkStrings(
  obj: unknown,
  field: string = '',
): Generator<{ field: string; value: string }> {
  if (typeof obj === 'string') {
    yield { field, value: obj };
  } else if (Array.isArray(obj)) {
    for (const item of obj) yield* walkStrings(item, field);
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      yield* walkStrings(v, field || k);
    }
  }
}

// Genera un snippet curt centrat al voltant de la coincidència.
function makeSnippet(text: string, qNorm: string, ctx = 50): string {
  const idx = normalize(text).indexOf(qNorm);
  if (idx < 0) return text.slice(0, 120);
  const start = Math.max(0, idx - ctx);
  const end = Math.min(text.length, idx + qNorm.length + ctx);
  const slice = text.slice(start, end);
  return (start > 0 ? '…' : '') + slice + (end < text.length ? '…' : '');
}

const MAX_HITS_PER_SCENARIO = 3;

export function searchOperativa(query: string): OpSearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const qn = normalize(q);
  const out: OpSearchResult[] = [];

  // ── Trànsit ─────────────────────────────────────────────────────
  for (const entry of TRAFICO_INDEX.escenaris) {
    const cl = getTraficoChecklist(entry.id);
    if (!cl) continue;
    const hits: OpSearchHit[] = [];
    let titleMatch = false;

    if (normalize(entry.titol).includes(qn)) {
      titleMatch = true;
      hits.push({ field: 'titol', snippet: entry.titol });
    }

    for (const [nodeId, node] of Object.entries(cl.nodes)) {
      if (hits.length >= MAX_HITS_PER_SCENARIO) break;
      for (const { field, value } of walkStrings(node)) {
        if (value.length < 3) continue;
        if (!normalize(value).includes(qn)) continue;
        hits.push({
          field,
          snippet: makeSnippet(value, qn),
          nodeId,
          isFinal: (node as { final?: boolean }).final === true,
          tipus: (node as { tipus?: string }).tipus,
        });
        break; // un hit per node (ja n'hi ha prou)
      }
    }

    if (hits.length > 0) {
      out.push({
        module: 'trafico',
        scenarioId: entry.id,
        scenarioTitle: entry.titol,
        url: `/operativa/trafico/${entry.id}`,
        hits,
        score: titleMatch ? 100 + hits.length : 50 + hits.length,
      });
    }
  }

  // ── Penal ──────────────────────────────────────────────────────
  for (const bloc of PENAL_INDEX.blocs) {
    for (const entry of bloc.escenaris) {
      const cl = getPenalChecklist(entry.id);
      if (!cl) continue;
      const hits: OpSearchHit[] = [];
      let titleMatch = false;

      if (normalize(entry.titol).includes(qn)) {
        titleMatch = true;
        hits.push({ field: 'titol', snippet: entry.titol });
      }

      // També busquem als camps de l'arrel del checklist (descripció,
      // base_legal, principi_clau...) excepte els nodes (els tractem
      // a part). Així una cerca "robatori" troba la seva base legal.
      for (const [k, v] of Object.entries(cl)) {
        if (k === 'nodes' || k === 'id' || k === 'titol' || k === 'icono' || k === 'inici') continue;
        if (hits.length >= MAX_HITS_PER_SCENARIO) break;
        for (const { field, value } of walkStrings(v, k)) {
          if (value.length < 3) continue;
          if (!normalize(value).includes(qn)) continue;
          hits.push({ field, snippet: makeSnippet(value, qn) });
          break;
        }
      }

      for (const [nodeId, node] of Object.entries(cl.nodes)) {
        if (hits.length >= MAX_HITS_PER_SCENARIO) break;
        for (const { field, value } of walkStrings(node)) {
          if (value.length < 3) continue;
          if (!normalize(value).includes(qn)) continue;
          hits.push({
            field,
            snippet: makeSnippet(value, qn),
            nodeId,
            isFinal: (node as { final?: boolean }).final === true,
            tipus: (node as { tipus?: string }).tipus,
          });
          break;
        }
      }

      if (hits.length > 0) {
        out.push({
          module: 'penal',
          scenarioId: entry.id,
          scenarioTitle: entry.titol,
          blocLabel: bloc.bloc,
          blocColor: bloc.color,
          url: `/operativa/penal/${entry.id}`,
          hits,
          score: titleMatch ? 100 + hits.length : 50 + hits.length,
        });
      }
    }
  }

  return out.sort((a, b) => b.score - a.score);
}
