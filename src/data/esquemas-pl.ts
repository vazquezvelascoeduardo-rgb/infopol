// ─────────────────────────────────────────────────────────────────
// Esquemes ràpids · Lleis de Policia Local
//
// Format gemini al d'Esquemes Mossos però amb tema visual BLAU OPERATIVA
// (vs. terracota de l'acadèmia). 4 seccions navegables: Resum, Cronologia,
// Personatges/Articles, Per a l'examen.
//
// Categoria visual per cada llei (CE, Codi Penal, Trànsit…) per agrupar
// l'índex.
// ─────────────────────────────────────────────────────────────────

export type LleiEra = {
  id: string;
  name: string;
  range: string;
  color: string;
  soft: string;
};

export type LleiMilestone = {
  eraId: string;
  date: string;
  title: string;
  note?: string;
  star?: boolean;
  personId?: string;
};

export type LleiPerson = {
  id: string;
  name: string;
  eraId: string;
  period: string;
  role: string;
  fact: string;
  initials: string;
  icon: 'crown' | 'sword' | 'scroll' | 'flag';
};

export type LleiExamItem = {
  date: string;
  text: string;
};

export type LleiCategoria =
  | 'constitucio'
  | 'codi-penal'
  | 'fcs'
  | 'menors'
  | 'transit'
  | 'municipi'
  | 'eac'
  | 'lecrim'
  | 'sc'
  | 'armes';

export const CATEGORIA_META: Record<LleiCategoria, { label: string; emoji: string; color: string; soft: string }> = {
  constitucio: { label: 'Constitució', emoji: '📜', color: '#3B6BF5', soft: '#D8E2FE' },
  'codi-penal': { label: 'Codi Penal', emoji: '⚖️', color: '#C0392B', soft: '#F4D2CE' },
  fcs: { label: 'Forces i cossos', emoji: '🛡️', color: '#1B7A5C', soft: '#C6EBDD' },
  menors: { label: 'Menors', emoji: '👶', color: '#9747D6', soft: '#F5E9FF' },
  transit: { label: 'Trànsit', emoji: '🚗', color: '#FF7A1A', soft: '#FFE0CB' },
  municipi: { label: 'Municipal', emoji: '🏛️', color: '#9C7A2A', soft: '#F4E6BC' },
  eac: { label: "Estatut d'Autonomia", emoji: '🟡', color: '#9C7A2A', soft: '#FFF1D2' },
  lecrim: { label: 'LECrim', emoji: '⚖️', color: '#5E3A8A', soft: '#E3D4F2' },
  sc: { label: 'Seguretat ciutadana', emoji: '🛡️', color: '#C13030', soft: '#FFE4E4' },
  armes: { label: 'Armes', emoji: '🔫', color: '#3A3A45', soft: '#D5D5DA' },
};

export type EsquemaLlei = {
  id: string;
  /** Slug per a la URL `/policia-local/esquemes/:slug`. */
  slug: string;
  categoria: LleiCategoria;
  kicker: string;
  title: string;
  titleHighlight?: string;
  introOneLiner: string;
  kpis: { value: string; label: string; mono?: boolean }[];
  eras: LleiEra[];
  timeline: LleiMilestone[];
  people: LleiPerson[];
  exam: LleiExamItem[];
  /** Slug del topic de tests a /policia-local/:slug (opcional). */
  testSlug?: string;
  labels?: {
    eras?: string;
    timeline?: string;
    people?: string;
  };
};

// ═══════════════════════════════════════════════════════════════
// CE 1978 — Constitució Espanyola
// ═══════════════════════════════════════════════════════════════
const CE78_ERAS: LleiEra[] = [
  { id: 'tardofranquismo', name: 'Tardofranquisme', range: '1975', color: '#6E5D38', soft: '#EFE7CF' },
  { id: 'transicion', name: 'Transició', range: '1976 — 77', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'elaboracion', name: 'Elaboració', range: '1977 — 78', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'aprobacion', name: 'Aprovació', range: 'oct — dic 1978', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'vigencia', name: 'En vigor', range: '1979 →', color: '#0E1A36', soft: '#D2D8E5' },
  { id: 'reformas', name: 'Reformes', range: '1992 · 2011', color: '#C0392B', soft: '#F4D2CE' },
];

const CE78_TIMELINE: LleiMilestone[] = [
  { eraId: 'tardofranquismo', date: '20 NOV 1975', title: 'Mort de Franco', note: 'Acaba la dictadura · proclamació de Joan Carles I com a rei.', star: true, personId: 'ce-jc1' },
  { eraId: 'tardofranquismo', date: '22 NOV 1975', title: 'Joan Carles I jura les Lleis Fonamentals' },
  { eraId: 'transicion', date: 'JUL 1976', title: 'Adolfo Suárez · president del Govern', note: 'Nomenat pel rei amb una terna del Consell del Regne.', star: true, personId: 'ce-suarez' },
  { eraId: 'transicion', date: '18 NOV 1976', title: 'Llei per a la Reforma Política', note: 'Aprovada per les Corts franquistes.', personId: 'ce-tfm' },
  { eraId: 'transicion', date: '15 DES 1976', title: 'Referèndum Llei Reforma Política', note: 'Sí · 94% · participació 77%.', star: true },
  { eraId: 'transicion', date: '9 ABR 1977', title: 'Legalització del PCE' },
  { eraId: 'transicion', date: '15 JUN 1977', title: 'Primeres eleccions democràtiques', note: 'Després de 41 anys.', star: true },
  { eraId: 'elaboracion', date: 'AGO 1977', title: 'Comissió constitucional · 7 ponents', note: 'Cisneros, Fraga, Peces-Barba, Pérez-Llorca, Roca, Solé Tura, Herrero.', star: true },
  { eraId: 'elaboracion', date: '5 GEN 1978', title: "Publicació de l'avantprojecte", note: 'BOC · debat parlamentari obert.' },
  { eraId: 'aprobacion', date: '31 OCT 1978', title: 'Aprovació al Congrés i Senat', note: '325 sí · 6 no · 14 abst.', star: true },
  { eraId: 'aprobacion', date: '6 DES 1978', title: 'Referèndum constitucional', note: 'Sí · 87,9% · participació 67%.', star: true },
  { eraId: 'aprobacion', date: '27 DES 1978', title: 'Sanció reial · promulgació', note: 'Joan Carles I la sanciona davant les Corts.', personId: 'ce-jc1' },
  { eraId: 'aprobacion', date: '29 DES 1978', title: 'Publicació al BOE', note: 'Entrada en vigor el mateix dia.', star: true },
  { eraId: 'vigencia', date: '1979 — 1983', title: "Aprovació dels Estatuts d'Autonomia", note: 'Catalunya · País Basc · Galícia · Andalusia (via art. 151)…' },
  { eraId: 'reformas', date: '27 AGO 1992', title: '1a reforma · art. 13.2', note: 'Tractat de Maastricht · sufragi passiu UE.', star: true },
  { eraId: 'reformas', date: '27 SET 2011', title: '2a reforma · art. 135', note: 'Equilibri pressupostari · sostre de deute.', star: true },
];

const CE78_PEOPLE: LleiPerson[] = [
  // Ponents (Padres de la Constitución)
  { id: 'ce-cisneros', name: 'Gabriel Cisneros', eraId: 'elaboracion', period: '1940 — 2007', role: 'UCD', initials: 'GC', icon: 'scroll', fact: 'Ponent · UCD. Llarg recorregut com a diputat constituent.' },
  { id: 'ce-fraga', name: 'Manuel Fraga', eraId: 'elaboracion', period: '1922 — 2012', role: 'Alianza Popular', initials: 'MF', icon: 'scroll', fact: "Ponent · AP. Fundador d'AP, fonamental per l'encaix de la dreta." },
  { id: 'ce-pecesbarba', name: 'G. Peces-Barba', eraId: 'elaboracion', period: '1938 — 2012', role: 'PSOE', initials: 'PB', icon: 'scroll', fact: 'Ponent · PSOE. Catedràtic, principal redactor de la part dogmàtica.' },
  { id: 'ce-perezllorca', name: 'J. P. Pérez-Llorca', eraId: 'elaboracion', period: '1940 — 2019', role: 'UCD', initials: 'PLL', icon: 'scroll', fact: 'Ponent · UCD. Redactor de la part orgànica i les Corts.' },
  { id: 'ce-roca', name: 'Miquel Roca i Junyent', eraId: 'elaboracion', period: '1940 →', role: 'Minoria Catalana', initials: 'MR', icon: 'scroll', fact: "Ponent · únic català. Treballa l'encaix de les autonomies." },
  { id: 'ce-soletura', name: 'Jordi Solé Tura', eraId: 'elaboracion', period: '1930 — 2009', role: 'PCE-PSUC', initials: 'JST', icon: 'scroll', fact: "Ponent · representant de l'esquerra catalana i del PCE." },
  { id: 'ce-herrero', name: 'M. Herrero R. de Miñón', eraId: 'elaboracion', period: '1940 →', role: 'UCD', initials: 'HRM', icon: 'scroll', fact: 'Ponent · UCD. Especialista en dret constitucional i drets històrics.' },
  // Altres clau
  { id: 'ce-jc1', name: 'Joan Carles I', eraId: 'transicion', period: '1938 →', role: "Rei d'Espanya", initials: 'JCI', icon: 'crown', fact: 'Promou la reforma · nomena Suárez · sanciona la CE el 27/12/1978.' },
  { id: 'ce-suarez', name: 'Adolfo Suárez', eraId: 'transicion', period: '1932 — 2014', role: 'President del Govern', initials: 'AS', icon: 'flag', fact: 'Lidera la transició · UCD · primer president democràtic (1977).' },
  { id: 'ce-tfm', name: 'T. Fernández-Miranda', eraId: 'tardofranquismo', period: '1915 — 1980', role: 'Pres. Corts', initials: 'TFM', icon: 'sword', fact: 'Arquitecte tècnic de la reforma · "de la ley a la ley".' },
];

const CE78_EXAM: LleiExamItem[] = [
  { date: '6 desembre 1978', text: 'Referèndum constitucional · 87,9% sí amb 67% de participació.' },
  { date: '27 desembre 1978', text: 'Sanció reial per Joan Carles I davant les Corts.' },
  { date: '29 desembre 1978', text: 'Publicació al BOE i entrada en vigor el mateix dia.' },
  { date: '7 ponents', text: 'Cisneros, Fraga, Peces-Barba, Pérez-Llorca, Roca, Solé Tura, Herrero.' },
  { date: '1 català', text: 'Miquel Roca i Junyent (Minoria Catalana) · únic ponent català.' },
  { date: '169 art. · 11 títols', text: 'Estructura formal + 4 disp. add. + 9 transitòries + 1 derogatòria + 1 final.' },
  { date: '2 reformes', text: '1992 (art. 13.2 · sufragi UE) i 2011 (art. 135 · estabilitat pressupostària).' },
  { date: 'Art. 168', text: 'Reforma agreujada (drets fonamentals i Corona) · 2/3 + dissolució + referèndum.' },
  { date: 'Art. 167', text: 'Reforma ordinària · 3/5 de cada cambra.' },
];

const CE_1978: EsquemaLlei = {
  id: 'esq-pl-ce1978',
  slug: 'ce-1978',
  categoria: 'constitucio',
  kicker: 'POLICIA LOCAL · CE 1978',
  title: 'Constitució',
  titleHighlight: 'Espanyola',
  introOneLiner: "De la mort de Franco (20/11/1975) al BOE del 29/12/1978: cronologia de la transició democràtica, els 7 ponents constitucionals i les 2 úniques reformes (1992 i 2011).",
  kpis: [
    { value: '29 dic. 1978', label: 'entrada en vigor', mono: true },
    { value: '7', label: 'ponents' },
    { value: '169', label: 'articles' },
    { value: '11', label: 'títols' },
    { value: '2', label: 'reformes' },
  ],
  eras: CE78_ERAS,
  timeline: CE78_TIMELINE,
  people: CE78_PEOPLE,
  exam: CE78_EXAM,
  testSlug: 'ce-1978-constitucion-espanola-esquema-operativo-policial',
};

// ─── Registre d'esquemes de PL disponibles ─────────────────────
const ESQUEMAS_PL: Record<string, EsquemaLlei> = {
  [CE_1978.slug]: CE_1978,
};

export function getEsquemaLlei(slug: string): EsquemaLlei | undefined {
  return ESQUEMAS_PL[slug];
}

export function listEsquemasLleis(): EsquemaLlei[] {
  return Object.values(ESQUEMAS_PL);
}

/** Agrupa per categoria respectant l'ordre de definició. */
export function groupByCategoria(): Record<LleiCategoria, EsquemaLlei[]> {
  const groups = {} as Record<LleiCategoria, EsquemaLlei[]>;
  for (const e of listEsquemasLleis()) {
    (groups[e.categoria] ??= []).push(e);
  }
  return groups;
}
