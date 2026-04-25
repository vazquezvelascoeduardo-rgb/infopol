// Carregador de checklists operatius del mòdul Trànsit.
//
// Cada escenari (alcoholèmia, drogues, velocitat, etc.) és un fitxer
// JSON amb un graf de nodes. L'usuari respon preguntes seguint
// `opcions[].va_a` fins arribar a un node final que mostra el resultat
// (sanció, pena, accions, base legal, etc.).
//
// L'índex `_index-trafic.json` defineix l'ordre i el títol que s'usa
// a la llista de la pàgina /operativa/trafico.

// ── Tipus ─────────────────────────────────────────────────────────

export type ChecklistResultKind =
  | 'ok' // tot correcte
  | 'administrativa' // infracció administrativa
  | 'penal' // delicte
  | 'procediment'; // procediment a seguir (no implica sanció directa)

export type ChecklistOption = {
  etiqueta: string;
  va_a: string;
};

export type ChecklistIntermediateNode = {
  titol?: string;
  text?: string;
  info?: string;
  opcions: ChecklistOption[];
  final?: false;
};

export type ChecklistFinalNode = {
  final: true;
  tipus?: ChecklistResultKind;
  titol: string;
  text?: string;
  import?: string;
  punts?: string;
  pena?: string;
  accio?: string;
  accions?: string[];
  requisits?: string[];
  document?: string;
  base_legal?: string[];
  info?: string;
};

export type ChecklistNode = ChecklistIntermediateNode | ChecklistFinalNode;

export function isFinalNode(n: ChecklistNode): n is ChecklistFinalNode {
  return n.final === true;
}

export type Checklist = {
  id: string;
  titol: string;
  categoria: string;
  icono?: string;
  base_legal?: string[];
  inici: string;
  nodes: Record<string, ChecklistNode>;
};

export type ChecklistIndexEntry = {
  id: string;
  titol: string;
  fitxer: string;
  ordre: number;
};

export type ChecklistIndex = {
  modul: string;
  titol: string;
  descripcio?: string;
  escenaris: ChecklistIndexEntry[];
};

// ── Càrrega via Vite glob (build-time) ────────────────────────────

// Carreguem TOTS els JSON de la carpeta com a mòduls. La clau és la
// ruta sencera; ens interessa només el nom del fitxer.
const checklistFiles = import.meta.glob(
  '/src/data/trafico-checklists/*.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>;

let indexRaw: ChecklistIndex | undefined;
const checklistsByFile = new Map<string, Checklist>();
for (const [path, mod] of Object.entries(checklistFiles)) {
  const name = path.split('/').pop()!;
  if (name === '_index-trafic.json') {
    indexRaw = mod as ChecklistIndex;
  } else {
    checklistsByFile.set(name, mod as Checklist);
  }
}

if (!indexRaw) {
  throw new Error(
    'src/data/trafico-checklists/_index-trafic.json no trobat. Cal que existeixi.',
  );
}

// ── API pública ───────────────────────────────────────────────────

export const TRAFICO_INDEX: ChecklistIndex = {
  ...indexRaw,
  // ordenem per `ordre` per estabilitat.
  escenaris: [...indexRaw.escenaris].sort((a, b) => a.ordre - b.ordre),
};

export function getChecklist(id: string): Checklist | undefined {
  const entry = TRAFICO_INDEX.escenaris.find((e) => e.id === id);
  if (!entry) return undefined;
  return checklistsByFile.get(entry.fitxer);
}

export function getChecklistEntry(id: string): ChecklistIndexEntry | undefined {
  return TRAFICO_INDEX.escenaris.find((e) => e.id === id);
}
