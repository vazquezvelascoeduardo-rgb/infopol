// Carregador del mòdul Penal / Seguretat Ciutadana.
//
// Estructura semblant a operativa-trafico però amb un índex agrupat
// per BLOCS (Operatiu/LOPSC, Persones, Patrimoni, Ordre Públic,
// Emergències). Cada bloc té un color i una icona pròpies.
//
// Reutilitzem les definicions de Checklist/Node de operativa-trafico
// perquè els JSON segueixen exactament el mateix format de nodes.

import type { Checklist } from './operativa-trafico';

export type PenalBloc = {
  bloc: string;
  color: string; // hex (ex: "#3b82f6")
  icono: string; // emoji
  escenaris: PenalIndexEntry[];
};

export type PenalIndexEntry = {
  id: string;
  titol: string;
  fitxer: string;
  ordre: number;
};

export type PenalIndex = {
  modul: string;
  titol: string;
  descripcio?: string;
  data_versio?: string;
  total_escenaris?: number;
  blocs: PenalBloc[];
  actes_referencies?: string[];
};

// Taula d'actes (referència ràpida — pantalla independent)
export type ActaReferencia = {
  codi: string;
  titol: string;
  base_legal?: string;
  quan_usar?: string | string[];
  estructura?: string[];
  exemple?: string;
};

export type TaulaActes = {
  titol: string;
  actes: ActaReferencia[];
};

// ── Càrrega via Vite glob (build-time) ────────────────────────────

const penalFiles = import.meta.glob('/src/data/penal-checklists/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

let indexRaw: PenalIndex | undefined;
let taulaActes: TaulaActes | undefined;
const checklistsByFile = new Map<string, Checklist>();

for (const [path, mod] of Object.entries(penalFiles)) {
  const name = path.split('/').pop()!;
  if (name === '_index-penal.json') {
    indexRaw = mod as PenalIndex;
  } else if (name === '_taula-actes-policials.json') {
    taulaActes = mod as TaulaActes;
  } else {
    checklistsByFile.set(name, mod as Checklist);
  }
}

if (!indexRaw) {
  throw new Error(
    'src/data/penal-checklists/_index-penal.json no trobat. Cal que existeixi.',
  );
}

// ── API pública ───────────────────────────────────────────────────

export const PENAL_INDEX: PenalIndex = {
  ...indexRaw,
  blocs: indexRaw.blocs.map((b) => ({
    ...b,
    escenaris: [...b.escenaris].sort((a, b) => a.ordre - b.ordre),
  })),
};

export const PENAL_TAULA_ACTES: TaulaActes | undefined = taulaActes;

// Tots els escenaris en una llista plana (per cerca, etc.)
export const PENAL_ALL_ENTRIES: PenalIndexEntry[] = PENAL_INDEX.blocs.flatMap(
  (b) => b.escenaris,
);

export function getPenalChecklist(id: string): Checklist | undefined {
  const entry = PENAL_ALL_ENTRIES.find((e) => e.id === id);
  if (!entry) return undefined;
  return checklistsByFile.get(entry.fitxer);
}

export function getPenalEntry(id: string): PenalIndexEntry | undefined {
  return PENAL_ALL_ENTRIES.find((e) => e.id === id);
}

// Retorna el bloc al qual pertany un escenari (per pintar el color a la
// capçalera del runner).
export function getPenalBlocForId(id: string): PenalBloc | undefined {
  return PENAL_INDEX.blocs.find((b) => b.escenaris.some((e) => e.id === id));
}
