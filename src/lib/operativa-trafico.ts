// Carregador de checklists operatius del mòdul Trànsit.
//
// Cada escenari (alcoholèmia, drogues, velocitat, etc.) és un fitxer
// JSON amb un graf de nodes. L'usuari respon preguntes seguint
// `opcions[].va_a` fins arribar a un node final que mostra el resultat
// (sanció, pena, accions, base legal, etc.).
//
// L'índex `_index-trafic.json` defineix l'ordre i el títol que s'usa
// a la llista de la pàgina /operativa/trafico.

// ── Tipus base ────────────────────────────────────────────────────

export type ChecklistResultKind =
  | 'ok' // tot correcte
  | 'administrativa' // infracció administrativa
  | 'penal' // delicte
  | 'procediment' // procediment a seguir (no implica sanció directa)
  | 'mixta' // combinació admin + penal
  | 'avis'; // avís / atenció (no és sanció ni procediment formal)

export type ChecklistOption = {
  etiqueta: string;
  va_a: string;
};

// Diccionari clau→valor (ex.: marges_error_etilometre,
// terminis_itv_vigents, tipus_cinemometres, etc.).
export type StringDict = Record<string, string>;

// ── Node intermedi ────────────────────────────────────────────────

export type ChecklistIntermediateNode = {
  final?: false;
  titol?: string;
  text?: string;
  info?: string;
  // Llistes auxiliars opcionals que ajuden a executar el control:
  checklist_previ?: string[]; // passos previs (preparació etilòmetre, etc.)
  checklist_evidencial?: string[]; // passos en la prova evidencial
  checklist_simptomes?: string[]; // símptomes a observar
  frase_advertiment?: string; // text exacte d'advertiment al conductor
  opcions: ChecklistOption[];
};

// ── Node final ────────────────────────────────────────────────────

export type ChecklistFinalNode = {
  final: true;
  tipus?: ChecklistResultKind;
  titol: string;
  text?: string;

  // — Per a la butlleta de denúncia —
  concepte_butlleta?: string;
  article_butlleta?: string;
  barem?: string;
  // Si la via és penal però existeix sanció administrativa paral·lela.
  'concepte_butlleta_paral·lel'?: string;
  article_paralel_admin?: string;

  // — Multa / punts / pena —
  import?: string;
  punts?: string;
  punts_bici_vmp?: string;
  pena?: string;
  pena_apartat_1?: string;
  pena_apartat_2?: string;
  pena_amb_perill?: string;
  pena_sense_perill_concret?: string;
  pena_imprudencia_greu?: string;
  pena_imprudencia_menys_greu?: string;
  pena_referencial?: string;

  // — Actuacions (totes opcionals; algunes són string, altres llista) —
  accio?: string;
  accions?: string | string[];
  accions_operatives?: string | string[];
  accions_ordenades?: string[];
  accions_ordenades_critiques?: string[];

  // — Documentació —
  document?: string;
  documentacio?: string;
  documentacio_clau?: string | string[];
  tiquet?: string;

  // — Drets, requisits, excepcions, exemples —
  drets_informar_conductor?: string[];
  requisits?: string[];
  requisits_clau?: string[];
  requisits_obligatoris?: string[];
  excepcions?: string;
  excepcions_legitimes?: string[];
  exemples?: string | string[];
  exemples_condicions?: string[];
  'exemples_jurisprudència'?: string[];

  // — Frases d'advertiment / símptomes / elements —
  frase_advertiment_estandard?: string;
  simptomes_clau_acreditar?: string[];
  elements_a_acreditar?: string[];
  elements_provatoris_clau?: string[];

  // — Informació addicional (notes contextuals) —
  info?: string;
  info_clau?: string;
  info_extra?: string;
  info_butlleta?: string;
  info_aplicabilitat?: string;
  info_immobilitzacio?: string;
  info_reformes_habituals?: string[];

  // — Altres —
  obligatorietat?: string;
  responsabilitat?: string;
  competencia?: string;
  compatible_amb?: string;
  concurs_195_cp?: string;
  diferencia_amb_admin?: string;

  // — Base legal —
  base_legal?: string[];
};

export type ChecklistNode = ChecklistIntermediateNode | ChecklistFinalNode;

export function isFinalNode(n: ChecklistNode): n is ChecklistFinalNode {
  return n.final === true;
}

// ── Checklist (root) ──────────────────────────────────────────────

// Camps "tècnics" opcionals al nivell del checklist. Es mostren al
// runner com a notes desplegables (referències ràpides aplicables a
// tot l'escenari, no a un node concret).
export type Checklist = {
  id: string;
  titol: string;
  categoria: string;
  icono?: string;
  inici: string;
  base_legal?: string[];
  comprovacions_previes?: string[];
  prioritats_actuacio?: string[];
  notes_finals?: string[];
  // Diccionaris (clau lliure → text). El runner els pinta com a taules.
  marges_error_etilometre?: StringDict;
  marges_error_cinemometres?: StringDict;
  tipus_cinemometres?: StringDict;
  limits_genics_via?: StringDict;
  terminis_itv_vigents?: StringDict;
  terminis_caducitat_permis?: StringDict;
  estats_itv_possibles?: StringDict;
  diferencia_clau?: string | StringDict;
  diferencia_clau_admin_penal?: StringDict;
  substancies_detectades_drogotest?: string[];
  barem_oficial_sct?: string;
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

// Helper: normalitza un camp que pot ser string o string[] a sempre
// string[]. Útil per pintar uniformement (acceptem tots dos formats
// perquè els JSON tenen tots dos casos).
export function asList(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  return [v];
}
