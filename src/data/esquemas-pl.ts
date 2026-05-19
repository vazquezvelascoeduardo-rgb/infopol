// ─────────────────────────────────────────────────────────────────
// Esquemes ràpids · Lleis de Policia Local
//
// Format gemini al d'Esquemes Mossos però amb tema visual BLAU OPERATIVA.
// CADA LLEI S'ADAPTA al que realment cau: la 3a secció ja no és sempre
// "Personatges" — pot ser "Articles clau", "Tipus penals", "Categories
// d'armes", "Escales", "Infraccions"…
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
  itemId?: string; // chip cap a l'item destacat (article, escala, etc.)
};

/**
 * Item de la 3a secció. Generalització de "Personatge".
 * - Per a una llei: típicament un ARTICLE clau (number, matèria, fet).
 * - Per a un codi penal: un TIPUS de delicte.
 * - Per a un reglament d'armes: una CATEGORIA d'armes.
 * Visualment es renderitza amb una card uniforme.
 */
export type LleiItem = {
  id: string;
  /** Mostrat com a títol principal de la card (ex: "Art. 14"). */
  name: string;
  /** Per agrupar i acolorir (cap a una era). */
  eraId: string;
  /** Subtítol curtjat (ex: "Igualtat davant la llei"). */
  period: string;
  /** Etiqueta de categoria (ex: "Drets fonamentals"). */
  role: string;
  /** Cos del fet · el que cal recordar. */
  fact: string;
  /** Etiqueta curta que es mostra en el cercle (ex: "14", "DL", "B1"). */
  initials: string;
  /** Icona auxiliar (default: scroll). */
  icon?: 'scroll' | 'sword' | 'flag' | 'crown';
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
  slug: string;
  categoria: LleiCategoria;
  kicker: string;
  title: string;
  titleHighlight?: string;
  introOneLiner: string;
  kpis: { value: string; label: string; mono?: boolean }[];
  eras: LleiEra[];
  timeline: LleiMilestone[];
  items: LleiItem[];
  exam: LleiExamItem[];
  testSlug?: string;
  /** Etiquetes personalitzables per a cada llei. */
  labels?: {
    eras?: string;       // default "Etapes"
    timeline?: string;   // default "Cronologia"
    items?: string;      // default "Articles clau" o el que correspongui
    itemsTab?: string;   // text del tab (curt)
  };
};

// ═══════════════════════════════════════════════════════════════
// CE 1978 — Constitució Espanyola
// Focus: ARTICLES IMPRESCINDIBLES que es pregunten cada any.
// (Els ponents no es pregunten mai, així que no surten.)
// ═══════════════════════════════════════════════════════════════
const CE78_ERAS: LleiEra[] = [
  // Cronològiques
  { id: 'transicio', name: 'Transició democràtica', range: '1975 — 1977', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'aprovacio', name: 'Aprovació · 1978', range: 'oct — dic 1978', color: '#1B7A5C', soft: '#C6EBDD' },
  // Temàtiques (articles)
  { id: 'preliminar', name: 'Títol Preliminar', range: 'art. 1 — 9', color: '#6E5D38', soft: '#EFE7CF' },
  { id: 'drets', name: 'Drets · Títol I', range: 'art. 10 — 55', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'organs', name: 'Òrgans · Títols II — VI', range: 'art. 56 — 127', color: '#0E1A36', soft: '#D2D8E5' },
  { id: 'territorial', name: 'Territori · Títol VIII', range: 'art. 137 — 158', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'tc', name: 'TC · Títol IX', range: 'art. 159 — 165', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'reformes', name: 'Reformes · Títol X', range: 'art. 166 — 169', color: '#C0392B', soft: '#F4D2CE' },
];

const CE78_TIMELINE: LleiMilestone[] = [
  { eraId: 'transicio', date: '20 NOV 1975', title: 'Mort de Franco', note: 'Acaba la dictadura. Proclamació de Joan Carles I com a rei.', star: true },
  { eraId: 'transicio', date: '4 GEN 1977', title: 'Llei per a la Reforma Política', note: 'Sí 94% al referèndum. "De la ley a la ley."' },
  { eraId: 'transicio', date: '15 JUN 1977', title: 'Primeres eleccions democràtiques', note: 'Després de 41 anys.', star: true },
  { eraId: 'aprovacio', date: '31 OCT 1978', title: 'Aprovació al Congrés i Senat', note: '325 sí · 6 no · 14 abst.', star: true },
  { eraId: 'aprovacio', date: '6 DES 1978', title: 'Referèndum constitucional', note: 'Sí 87,9% · participació 67%.', star: true },
  { eraId: 'aprovacio', date: '27 DES 1978', title: 'Sanció reial · promulgació', note: 'Joan Carles I la sanciona davant les Corts.' },
  { eraId: 'aprovacio', date: '29 DES 1978', title: 'Publicació al BOE · entrada en vigor', note: 'Mateix dia.', star: true },
  { eraId: 'reformes', date: '27 AGO 1992', title: '1a reforma · art. 13.2', note: 'Tractat de Maastricht. Sufragi passiu UE a municipals.', star: true, itemId: 'art-13' },
  { eraId: 'reformes', date: '27 SET 2011', title: '2a reforma · art. 135', note: 'Equilibri pressupostari · sostre de deute.', star: true, itemId: 'art-135' },
];

// ─── ARTICLES IMPRESCINDIBLES ──────────────────────────────────
// Aquests són els que cauen sempre. Si en saps aquests 12, vas molt
// servit al test. Cada un situa l'opositor: número + matèria + per
// què el preguntarien.
const CE78_ITEMS: LleiItem[] = [
  { id: 'art-1', name: 'Art. 1', eraId: 'preliminar', initials: '1', icon: 'scroll',
    period: 'Estat social i democràtic', role: 'Títol Preliminar',
    fact: '"Espanya es constitueix en un Estat social i democràtic de Dret." Forma política = Monarquia parlamentària. La sobirania resideix en el poble.' },
  { id: 'art-2', name: 'Art. 2', eraId: 'preliminar', initials: '2', icon: 'scroll',
    period: 'Unitat + autonomia', role: 'Títol Preliminar',
    fact: 'Indissoluble unitat de la nació espanyola + dret a l\'autonomia de les nacionalitats i regions + solidaritat entre totes.' },
  { id: 'art-3', name: 'Art. 3', eraId: 'preliminar', initials: '3', icon: 'scroll',
    period: 'Llengües oficials', role: 'Títol Preliminar',
    fact: 'Castellà = oficial a tot l\'Estat. Les altres llengües (català, gallec, eusquera) són oficials a les seves CCAA.' },
  { id: 'art-14', name: 'Art. 14', eraId: 'drets', initials: '14', icon: 'scroll',
    period: 'Igualtat davant la llei', role: 'Drets fonamentals',
    fact: 'Tots els espanyols són iguals davant la llei. Cap discriminació per naixement, raça, sexe, religió, opinió. ⭐ S\'inclou a la Secció 1a per protecció (recurs empara).' },
  { id: 'art-17', name: 'Art. 17', eraId: 'drets', initials: '17', icon: 'sword',
    period: 'Llibertat i seguretat · detenció', role: 'Drets fonamentals',
    fact: 'Dret a la llibertat. ⚠️ Detenció màxim 72 hores. Habeas corpus. Dret del detingut: ser informat, no declarar, assistència lletrada. PREGUNTA CLÀSSICA D\'EXAMEN.' },
  { id: 'art-18', name: 'Art. 18', eraId: 'drets', initials: '18', icon: 'sword',
    period: 'Honor · intimitat · domicili', role: 'Drets fonamentals',
    fact: 'Honor, intimitat personal/familiar i pròpia imatge. Inviolabilitat del domicili (entrada amb consentiment titular, autorització judicial o flagrant delicte). Secret comunicacions.' },
  { id: 'art-24', name: 'Art. 24', eraId: 'drets', initials: '24', icon: 'scroll',
    period: 'Tutela judicial efectiva', role: 'Drets fonamentals',
    fact: 'Tutela judicial efectiva · jutge predeterminat per la llei · defensa i lletrat · presumpció d\'innocència · no declarar contra si mateix.' },
  { id: 'art-25', name: 'Art. 25', eraId: 'drets', initials: '25', icon: 'scroll',
    period: 'Legalitat penal', role: 'Drets fonamentals',
    fact: '"Nullum crimen sine lege." Penes orientades a reeducació i reinserció social. Treball remunerat per als penats.' },
  { id: 'art-56', name: 'Art. 56', eraId: 'organs', initials: '56', icon: 'crown',
    period: 'El Rei · cap de l\'Estat', role: 'Corona · Títol II',
    fact: 'Rei = cap de l\'Estat, símbol de la unitat i permanència. Inviolable i no responsable. Actes refrendats pel President del Govern o ministres.' },
  { id: 'art-66', name: 'Art. 66', eraId: 'organs', initials: '66', icon: 'flag',
    period: 'Corts Generals', role: 'Títol III',
    fact: 'Corts = Congrés + Senat. Representen el poble espanyol. 3 funcions: potestat legislativa + aprovar pressupostos + control del Govern.' },
  { id: 'art-97', name: 'Art. 97', eraId: 'organs', initials: '97', icon: 'flag',
    period: 'Govern', role: 'Títol IV',
    fact: 'El Govern dirigeix la política interior i exterior, l\'Administració civil i militar i la defensa. Funció executiva + potestat reglamentària.' },
  { id: 'art-117', name: 'Art. 117', eraId: 'organs', initials: '117', icon: 'scroll',
    period: 'Poder judicial', role: 'Títol VI',
    fact: 'Justícia emana del poble, en nom del Rei. Jutges INDEPENDENTS, INAMOVIBLES, RESPONSABLES i sotmesos a la llei. Unitat jurisdiccional (excepció: militar).' },
  { id: 'art-137', name: 'Art. 137', eraId: 'territorial', initials: '137', icon: 'flag',
    period: 'Organització territorial', role: 'Títol VIII',
    fact: 'L\'Estat s\'organitza en municipis, províncies i CCAA. Totes gaudeixen d\'autonomia per a la gestió dels seus interessos.' },
  { id: 'art-149-1-29', name: 'Art. 149.1.29', eraId: 'territorial', initials: '149', icon: 'sword',
    period: 'Seguretat pública = Estat', role: 'Títol VIII',
    fact: '⭐ ARTICLE CRÍTIC PER A POLICIES. Competència exclusiva de l\'Estat en seguretat pública, sens perjudici que les CCAA puguin crear policies.' },
  { id: 'art-159', name: 'Art. 159', eraId: 'tc', initials: '159', icon: 'crown',
    period: 'Tribunal Constitucional', role: 'Títol IX',
    fact: 'TC = 12 magistrats nomenats pel Rei. 4+4 (Congrés+Senat 3/5) + 2 Govern + 2 CGPJ. Mandat 9 anys, renovació per terceres parts.' },
  { id: 'art-167', name: 'Art. 167', eraId: 'reformes', initials: '167', icon: 'scroll',
    period: 'Reforma ordinària', role: 'Títol X',
    fact: 'Reforma per via ordinària: 3/5 de cada cambra. Referèndum si ho demanen 1/10 dels diputats o senadors.' },
  { id: 'art-168', name: 'Art. 168', eraId: 'reformes', initials: '168', icon: 'crown',
    period: 'Reforma agreujada', role: 'Títol X',
    fact: '⚠️ Reforma de Títol Preliminar, Drets fonamentals (Sec. 1a) o Corona: 2/3 cada cambra → dissolució → noves Corts ratifiquen 2/3 → referèndum OBLIGATORI.' },
];

const CE78_EXAM: LleiExamItem[] = [
  { date: '6 desembre 1978', text: 'Referèndum constitucional · 87,9% sí amb 67% de participació.' },
  { date: '29 desembre 1978', text: 'Publicació al BOE i entrada en vigor el mateix dia.' },
  { date: '169 art. · 11 títols', text: 'Estructura formal + 4 disp. add. + 9 transitòries + 1 derogatòria + 1 final.' },
  { date: 'Art. 14 + 15-29', text: 'Drets fonamentals · igualtat + Secció 1a · recurs d\'empara al TC.' },
  { date: 'Art. 17', text: 'Detenció màxima 72 hores. Habeas corpus. Drets del detingut.' },
  { date: 'Art. 149.1.29', text: 'Seguretat pública = competència exclusiva ESTATAL.' },
  { date: '2 reformes', text: '1992 (art. 13.2 · sufragi UE) i 2011 (art. 135 · estabilitat pressupostària).' },
  { date: 'Art. 168', text: 'Reforma agreujada · 2/3 + dissolució + referèndum OBLIGATORI.' },
  { date: 'Art. 159', text: 'TC: 12 magistrats, 9 anys, renovació per terceres parts. 4+4+2+2.' },
  { date: 'TC ≠ TS', text: 'Tribunal Constitucional és intèrpret CE. NO forma part del poder judicial.' },
];

const CE_1978: EsquemaLlei = {
  id: 'esq-pl-ce1978',
  slug: 'ce-1978',
  categoria: 'constitucio',
  kicker: 'POLICIA LOCAL · CE 1978',
  title: 'Constitució',
  titleHighlight: 'Espanyola',
  introOneLiner: 'Norma suprema de l\'Estat. Aprovada en referèndum el 6 desembre 1978 amb el 87,9% de sí. Entrada en vigor el 29 desembre. 169 articles, 11 títols, només 2 reformes (1992 i 2011).',
  kpis: [
    { value: '29 dic. 1978', label: 'entrada en vigor', mono: true },
    { value: '169', label: 'articles' },
    { value: '11', label: 'títols' },
    { value: '17', label: 'articles clau' },
    { value: '2', label: 'reformes' },
  ],
  eras: CE78_ERAS,
  timeline: CE78_TIMELINE,
  items: CE78_ITEMS,
  exam: CE78_EXAM,
  testSlug: 'ce-1978-constitucion-espanola-esquema-operativo-policial',
  labels: {
    items: 'Articles imprescindibles',
    itemsTab: 'Articles',
  },
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

export function groupByCategoria(): Record<LleiCategoria, EsquemaLlei[]> {
  const groups = {} as Record<LleiCategoria, EsquemaLlei[]>;
  for (const e of listEsquemasLleis()) {
    (groups[e.categoria] ??= []).push(e);
  }
  return groups;
}
