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
  { eraId: 'reformes', date: '15 FEB 2024', title: '3a reforma · art. 49', note: 'Substitució de "disminuïts" per "persones amb discapacitat". Terminologia inclusiva.', star: true, itemId: 'art-49' },
  { eraId: 'reformes', date: '19 MAI 2026', title: '4a reforma · art. 69.3', note: 'Formentera amb senador propi (independent d\'Eivissa). Sancionada per Felip VI.', star: true, itemId: 'art-69' },
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
  { id: 'art-49', name: 'Art. 49', eraId: 'reformes', initials: '49', icon: 'scroll',
    period: 'Persones amb discapacitat', role: 'Drets fonamentals · principis rectors',
    fact: '🆕 REFORMAT 15/02/2024 (3a reforma). Substitueix "disminuïts" per "persones amb discapacitat". Atenció especial dels poders públics + drets per llei + protecció dels drets recollits a la CE.' },
  { id: 'art-56', name: 'Art. 56', eraId: 'organs', initials: '56', icon: 'crown',
    period: 'El Rei · cap de l\'Estat', role: 'Corona · Títol II',
    fact: 'Rei = cap de l\'Estat, símbol de la unitat i permanència. Inviolable i no responsable. Actes refrendats pel President del Govern o ministres.' },
  { id: 'art-66', name: 'Art. 66', eraId: 'organs', initials: '66', icon: 'flag',
    period: 'Corts Generals', role: 'Títol III',
    fact: 'Corts = Congrés + Senat. Representen el poble espanyol. 3 funcions: potestat legislativa + aprovar pressupostos + control del Govern.' },
  { id: 'art-69', name: 'Art. 69', eraId: 'organs', initials: '69', icon: 'flag',
    period: 'Composició del Senat', role: 'Títol III',
    fact: '🆕 REFORMAT 19/05/2026 (4a reforma). Senat = cambra de representació territorial. 4 senadors per província, Ceuta i Melilla 2. Apartat 3 (illes): Gran Canària, Mallorca i Tenerife 3 senadors cadascuna; Eivissa, Menorca, Formentera, Fuerteventura, Gomera, Hierro, Lanzarote i La Palma 1 senador cadascuna. Formentera passa a tenir senador propi.' },
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
  { date: '4 reformes', text: '1992 (art. 13.2 sufragi UE) · 2011 (art. 135 estabilitat pressupostària) · 2024 (art. 49 "persones amb discapacitat") · 2026 (art. 69.3 senador propi a Formentera).' },
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
  introOneLiner: 'Norma suprema de l\'Estat. Aprovada en referèndum el 6 desembre 1978 amb el 87,9% de sí. Entrada en vigor el 29 desembre. 169 articles, 11 títols, 4 reformes (1992, 2011, 2024 i 2026 — Formentera senador propi).',
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

// ═══════════════════════════════════════════════════════════════
// EAC 2006 — Estatut d'Autonomia de Catalunya
// Focus: ARTICLES CLAU (especialment art. 164 seguretat pública)
// ═══════════════════════════════════════════════════════════════
const EAC_ERAS: LleiEra[] = [
  { id: 'antecedent', name: 'Estatut 1979', range: 'LO 4/1979', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'reforma', name: 'Reforma EAC', range: '2004 — 2006', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'stc', name: 'STC 31/2010', range: 'retallada', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'simbols', name: 'Identitat · Títol Prel.', range: 'art. 1 — 14', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'drets', name: 'Drets · Títol I', range: 'art. 15 — 54', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'institucions', name: 'Institucions · II', range: 'art. 55 — 94', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'competencies', name: 'Competències · IV', range: 'art. 110 — 173', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'seguretat', name: 'Seguretat pública', range: 'art. 164', color: '#0E1A36', soft: '#D2D8E5' },
];
const EAC_TIMELINE: LleiMilestone[] = [
  { eraId: 'antecedent', date: '18 DES 1979', title: 'LO 4/1979 · Estatut de Sau', note: 'Primer Estatut d\'autonomia.' },
  { eraId: 'reforma', date: '9 FEB 2004', title: 'Inici procés de reforma' },
  { eraId: 'reforma', date: '30 SET 2005', title: 'Aprovació Ple Parlament', note: '120 sí · 15 no.' },
  { eraId: 'reforma', date: '30 MAR 2006', title: 'Aprovació Congrés' },
  { eraId: 'reforma', date: '10 MAI 2006', title: 'Aprovació Senat' },
  { eraId: 'reforma', date: '18 JUN 2006', title: 'Referèndum positiu', star: true },
  { eraId: 'reforma', date: '19 JUL 2006', title: 'LO 6/2006 · promulgació', star: true },
  { eraId: 'reforma', date: '9 AGO 2006', title: 'Entrada en vigor', star: true },
  { eraId: 'stc', date: '28 JUN 2010', title: 'STC 31/2010 · retallades', note: 'Llengua, Síndic, CGE, justícia, finances locals.', star: true },
];
const EAC_ITEMS: LleiItem[] = [
  { id: 'eac-1', name: 'Art. 1', eraId: 'simbols', initials: '1', period: 'Catalunya = nacionalitat', role: 'Identitat', fact: 'Catalunya, com a nacionalitat, exerceix el seu autogovern constituïda en Comunitat Autònoma. Al preàmbul es defineix com a NACIÓ.' },
  { id: 'eac-6', name: 'Art. 6', eraId: 'simbols', initials: '6', period: 'Llengua pròpia', role: 'Identitat', fact: 'Català = llengua pròpia. Català i castellà = oficials. Tothom té el dret i el deure de conèixer-les. ⚠️ La STC 31/2010 va declarar inconstitucional el "deure" de conèixer-lo.' },
  { id: 'eac-8', name: 'Art. 8', eraId: 'simbols', initials: '8', period: 'Símbols nacionals', role: 'Identitat', fact: 'Bandera quadribarrada · Diada 11 de setembre · himne "Els segadors".' },
  { id: 'eac-11', name: 'Art. 11', eraId: 'simbols', initials: '11', period: 'Aran realitat nacional', role: 'Identitat', fact: 'L\'Aran té realitat nacional pròpia (occità/aranès). Llengua oficial pròpia. ⭐ Llei 35/2010 fa l\'aranès oficial a tot Catalunya.' },
  { id: 'eac-15', name: 'Art. 15', eraId: 'drets', initials: '15', period: 'Drets de les persones', role: 'Drets', fact: 'Punt de partida del Títol I. Els drets s\'apliquen a tothom (ciutadans i estrangers segons normativa).' },
  { id: 'eac-55', name: 'Art. 55', eraId: 'institucions', initials: '55', period: 'Parlament', role: 'Institucions', fact: 'El Parlament representa el poble de Catalunya. 135 diputats (mín 100/màx 150). Inviolable.' },
  { id: 'eac-67', name: 'Art. 67', eraId: 'institucions', initials: '67', period: 'President de la Generalitat', role: 'Institucions', fact: 'Triple condició: cap del Govern, més alta representació de Catalunya, representant ordinari de l\'Estat.' },
  { id: 'eac-68', name: 'Art. 68', eraId: 'institucions', initials: '68', period: 'Govern', role: 'Institucions', fact: 'Òrgan superior col·legiat. Funció executiva + potestat reglamentària. Decrets legislatius (63) i decrets llei (64).' },
  { id: 'eac-78', name: 'Art. 78', eraId: 'institucions', initials: '78', period: 'Síndic de Greuges', role: 'Institucions', fact: 'Defensa drets fonamentals. Elegit pel Parlament per 3/5. Mandat 6 anys NO reelegible.' },
  { id: 'eac-110', name: 'Art. 110', eraId: 'competencies', initials: '110', period: 'Competències EXCLUSIVES', role: 'Competències', fact: 'Atribueixen íntegrament potestat legislativa, reglamentària i executiva. Només la Generalitat.' },
  { id: 'eac-111', name: 'Art. 111', eraId: 'competencies', initials: '111', period: 'Competències COMPARTIDES', role: 'Competències', fact: 'Legislativa + reglamentària + executiva en el MARC DE LES BASES que fixa l\'Estat.' },
  { id: 'eac-112', name: 'Art. 112', eraId: 'competencies', initials: '112', period: 'Competències EXECUTIVES', role: 'Competències', fact: 'Potestat reglamentària + funció executiva sobre la normativa estatal.' },
  { id: 'eac-164', name: 'Art. 164', eraId: 'seguretat', initials: '164', period: 'Seguretat pública', role: 'CRÍTIC OPOSICIÓ', fact: '⭐⭐⭐ ARTICLE MÉS PREGUNTAT. 164.1: planificació, creació PG-ME, control trànsit. 164.2: comandament suprem PG-ME + coordinació policies locals. 164.4: Junta de Seguretat paritària presidida pel president. 164.5: camps PG-ME (seguretat ciutadana + administrativa + judicial).' },
];
const EAC_EXAM: LleiExamItem[] = [
  { date: 'LO 6/2006', text: 'EAC vigent · 19 juliol 2006 · entrada en vigor 9 d\'agost.' },
  { date: 'STC 31/2010', text: 'Retallades en llengua, Síndic, CGE, justícia, finances locals.' },
  { date: 'Art. 164', text: 'Planificació + creació MdE + trànsit. ⭐ Article cabdal per a opositors policia.' },
  { date: '7 títols · 223 art.', text: 'Estructura formal. Títol IV = competències · V = relacions institucionals.' },
  { date: '3 tipus competències', text: 'Exclusives (110) / compartides (111) / executives (112).' },
  { date: 'Junta Seguretat', text: 'Paritària Generalitat-Estat. Presidida pel president de la Generalitat.' },
  { date: 'Catalunya', text: 'Nacionalitat (art. 1) · al preàmbul = nació.' },
  { date: 'Símbols (art. 8)', text: 'Bandera quadribarrada · Diada 11 setembre · "Els segadors".' },
];
const EAC_2006: EsquemaLlei = {
  id: 'esq-pl-eac', slug: 'eac-2006', categoria: 'eac',
  kicker: 'POLICIA LOCAL · EAC 2006', title: 'Estatut', titleHighlight: "d'Autonomia",
  introOneLiner: 'LO 6/2006 de 19 de juliol. Entrada en vigor 9 d\'agost 2006. Norma institucional bàsica de Catalunya. STC 31/2010 va retallar articles clau. L\'art. 164 (seguretat pública) és el més preguntat.',
  kpis: [
    { value: 'LO 6/2006', label: 'norma vigent', mono: true },
    { value: '223', label: 'articles' },
    { value: '13', label: 'articles clau' },
    { value: '164', label: 'art. cabdal', mono: true },
    { value: 'STC 31/2010', label: 'retalla', mono: true },
  ],
  eras: EAC_ERAS, timeline: EAC_TIMELINE, items: EAC_ITEMS, exam: EAC_EXAM,
  testSlug: 'eac-2006-estatut-d-autonomia-de-catalunya-esquema-operativo-policial',
  labels: { items: 'Articles imprescindibles', itemsTab: 'Articles' },
};

// ═══════════════════════════════════════════════════════════════
// Codi Penal · LO 10/1995
// Focus: TIPUS PENALS per famílies (els que cauen als operatius)
// ═══════════════════════════════════════════════════════════════
const CP_ERAS: LleiEra[] = [
  { id: 'cp-vida', name: 'Contra la vida', range: 'art. 138 — 143', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'cp-integritat', name: 'Integritat · llibertat', range: 'art. 147 — 177', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'cp-llibertatsex', name: 'Llibertat sexual', range: 'art. 178 — 194', color: '#9747D6', soft: '#F5E9FF' },
  { id: 'cp-patrimoni', name: 'Patrimoni', range: 'art. 234 — 257', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'cp-transit', name: 'Seguretat trànsit', range: 'art. 379 — 385 ter', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'cp-autoritat', name: "Contra l'autoritat", range: 'art. 550 — 561', color: '#0E1A36', soft: '#D2D8E5' },
  { id: 'cp-altres', name: 'Altres rellevants', range: 'art. 234+', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'cp-reformes', name: 'Reformes recents', range: '2015 — 2026', color: '#3B6BF5', soft: '#D8E2FE' },
];
const CP_TIMELINE: LleiMilestone[] = [
  { eraId: 'cp-reformes', date: '23 NOV 1995', title: 'LO 10/1995 · "Codi penal de la democràcia"', star: true },
  { eraId: 'cp-reformes', date: '2010', title: 'Reforma LO 5/2010', note: 'Responsabilitat penal persones jurídiques.' },
  { eraId: 'cp-reformes', date: '2015', title: 'Reforma LO 1/2015', note: 'Elimina faltes (passen a delictes lleus).', star: true },
  { eraId: 'cp-reformes', date: '2022', title: 'LO 10/2022 "Solo sí es sí"', note: 'Reformula delictes sexuals.', star: true, itemId: 'cp-178' },
  { eraId: 'cp-reformes', date: '2026', title: 'LO 1/2026 multireincidència', star: true, itemId: 'cp-66' },
];
const CP_ITEMS: LleiItem[] = [
  { id: 'cp-138', name: 'Art. 138', eraId: 'cp-vida', initials: '138', period: 'Homicidi', role: 'Contra la vida', fact: 'El que mata a altre. 10-15 anys de presó. Forma bàsica.' },
  { id: 'cp-139', name: 'Art. 139', eraId: 'cp-vida', initials: '139', period: 'Assassinat', role: 'Contra la vida', fact: 'Mata amb concorrència de: aleivosía, preu/recompensa, ensanyament, facilitar altre delicte. 15-25 anys.' },
  { id: 'cp-142', name: 'Art. 142', eraId: 'cp-vida', initials: '142', period: 'Homicidi imprudent', role: 'Contra la vida', fact: 'Per imprudència greu (presó 1-4 anys) o menys greu (multa). Trànsit: típicament aquí.' },
  { id: 'cp-147', name: 'Art. 147', eraId: 'cp-integritat', initials: '147', period: 'Lesions', role: 'Integritat física', fact: 'Causar a altre, per qualsevol mitjà, una lesió que requereixi tractament mèdic o quirúrgic. Forma bàsica.' },
  { id: 'cp-153', name: 'Art. 153', eraId: 'cp-integritat', initials: '153', period: 'Violència gènere/domèstica', role: 'CRÍTIC PL', fact: '⭐ Maltractament d\'obra sense lesió contra parella, exparella, persones especialment vulnerables. Pena agreujada respecte a lesions ordinàries.' },
  { id: 'cp-163', name: 'Art. 163', eraId: 'cp-integritat', initials: '163', period: 'Detenció il·legal', role: 'Llibertat', fact: 'Empresonament o detenció sense ser autoritat competent. Si es prolonga > 15 dies o és per part d\'autoritat: pena agreujada.' },
  { id: 'cp-178', name: 'Art. 178', eraId: 'cp-llibertatsex', initials: '178', period: 'Agressió sexual', role: 'CRÍTIC PL', fact: '⭐ Post-LO 10/2022: TOTA conducta sexual sense consentiment = agressió. El consentiment ha de ser exprés.' },
  { id: 'cp-234', name: 'Art. 234', eraId: 'cp-patrimoni', initials: '234', period: 'Furt', role: 'Patrimoni', fact: 'Apoderament de cosa moble aliena sense voluntat del propietari. Bàsic ≥ 400€. Per sota = delicte lleu.' },
  { id: 'cp-237', name: 'Art. 237', eraId: 'cp-patrimoni', initials: '237', period: 'Robatori', role: 'Patrimoni', fact: 'Apoderament amb FORÇA en les coses (238) o VIOLÈNCIA/INTIMIDACIÓ en persones (242). ⚠️ Robatori amb violència = SEMPRE delicte (sense mínim).' },
  { id: 'cp-379', name: 'Art. 379', eraId: 'cp-transit', initials: '379', period: 'Velocitat / alcoholèmia', role: 'CRÍTIC PL TRÀNSIT', fact: '⭐ 379.1: velocitat > límit + 60 urbà / + 80 interurbà. 379.2: conduir sota influència d\'alcohol/drogues. ≥ 0,60 mg/L aire o 1,2 g/L sang = sempre delicte.' },
  { id: 'cp-380', name: 'Art. 380', eraId: 'cp-transit', initials: '380', period: 'Conducció temerària', role: 'CRÍTIC PL TRÀNSIT', fact: 'Conduir amb temeritat manifesta posant en concret perill la vida o integritat. Multa + privació conducció.' },
  { id: 'cp-383', name: 'Art. 383', eraId: 'cp-transit', initials: '383', period: "Negativa a les proves", role: 'CRÍTIC PL TRÀNSIT', fact: '⭐ Negar-se a sotmetre\'s a les proves d\'alcoholèmia/drogues = delicte. Presó 6 mesos - 1 any.' },
  { id: 'cp-384', name: 'Art. 384', eraId: 'cp-transit', initials: '384', period: 'Conduir sense permís', role: 'CRÍTIC PL TRÀNSIT', fact: 'Conduir amb permís retirat per pèrdua punts, amb privació judicial, o sense haver-lo obtingut mai. Multa o presó.' },
  { id: 'cp-550', name: 'Art. 550', eraId: 'cp-autoritat', initials: '550', period: 'Atemptat', role: "Contra l'autoritat", fact: '⭐ Agressió, intimidació greu o resistència activa greu contra autoritat, els seus agents (POLICIES) o funcionaris públics.' },
  { id: 'cp-556', name: 'Art. 556', eraId: 'cp-autoritat', initials: '556', period: 'Desobediència · resistència', role: "Contra l'autoritat", fact: 'Resistència o desobediència greu a l\'autoritat sense arribar a l\'agressió de l\'art. 550. Diferenciar bé d\'atemptat.' },
];
const CP_EXAM: LleiExamItem[] = [
  { date: 'LO 10/1995', text: 'Codi Penal vigent de "la democràcia" (23 de novembre).' },
  { date: '138 vs 139', text: 'Homicidi (10-15) vs Assassinat (15-25 amb circumstància qualificada).' },
  { date: 'Art. 153', text: 'Maltractament d\'obra a parella/familiar SENSE necessitat de lesió.' },
  { date: 'Art. 379.2', text: 'Alcoholèmia delicte: ≥ 0,60 mg/L aire o ≥ 1,2 g/L sang.' },
  { date: 'Art. 383', text: 'Negativa a les proves = sempre delicte. Pena = presó.' },
  { date: 'Art. 550', text: 'Atemptat contra agents = TIPUS clau per policies.' },
  { date: 'Furt > 400€', text: 'Per sota són delictes lleus (anteriorment "faltes").' },
  { date: 'LO 1/2015', text: '⚠️ Elimina les "faltes" → passen a delictes lleus.' },
  { date: 'LO 10/2022', text: '"Solo sí es sí" reforma agressions sexuals (art. 178).' },
];
const CODI_PENAL: EsquemaLlei = {
  id: 'esq-pl-cp', slug: 'codigo-penal', categoria: 'codi-penal',
  kicker: 'POLICIA LOCAL · CP LO 10/1995', title: 'Codi', titleHighlight: 'Penal',
  introOneLiner: 'LO 10/1995 de 23 de novembre, el "Codi penal de la democràcia". Té 639 articles distribuïts en Llibre I (Part general), Llibre II (delictes) i Llibre III (faltes, suprimit el 2015). Tipus rellevants per a la PL: trànsit (379-385), violència gènere (153) i atemptat (550).',
  kpis: [
    { value: 'LO 10/1995', label: 'norma vigent', mono: true },
    { value: '639', label: 'articles' },
    { value: '15', label: 'tipus clau' },
    { value: '8', label: 'famílies' },
    { value: '2015', label: 'sense faltes', mono: true },
  ],
  eras: CP_ERAS, timeline: CP_TIMELINE, items: CP_ITEMS, exam: CP_EXAM,
  testSlug: 'codigo-penal-esquema-policial',
  labels: { items: 'Tipus penals clau', itemsTab: 'Tipus' },
};

// ═══════════════════════════════════════════════════════════════
// LO 1/2026 — Multireincidència
// Focus: NOVETATS recents (delictes lleus + multireincidència)
// ═══════════════════════════════════════════════════════════════
const MULTI_ERAS: LleiEra[] = [
  { id: 'm-ant', name: 'Antecedents', range: 'pre-2026', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'm-llei', name: 'LO 1/2026', range: 'gener 2026', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'm-tipus', name: 'Tipus afectats', range: 'furts · ocupació', color: '#3B6BF5', soft: '#D8E2FE' },
];
const MULTI_TIMELINE: LleiMilestone[] = [
  { eraId: 'm-ant', date: '2015', title: 'LO 1/2015 elimina faltes', note: 'Furts < 400€ passen a delicte lleu.' },
  { eraId: 'm-ant', date: '2022 — 25', title: 'Problemàtica multireincidència', note: 'Augment robatoris/furts amb mateixos autors recidivants.' },
  { eraId: 'm-llei', date: '2026', title: 'LO 1/2026 multireincidència', star: true },
  { eraId: 'm-llei', date: 'Objectiu', title: 'Endurir penes a reincidents', note: 'Sumar penes lleus per a reincidents habituals.' },
];
const MULTI_ITEMS: LleiItem[] = [
  { id: 'm-concepte', name: 'Multireincidència', eraId: 'm-tipus', initials: 'MR', period: 'Concepte clau', role: 'Definició', fact: 'Persona condemnada ≥ 3 vegades per delicte lleu del mateix títol. La 4a vegada → tractament agreujat (es pot apreciar com a delicte menys greu).' },
  { id: 'm-furt', name: 'Furt multirein.', eraId: 'm-tipus', initials: 'FU', period: 'Art. 235 bis', role: 'Aplicació', fact: 'Furts < 400€ acumulats: el 4t passa a delicte menys greu amb pena de presó (no només multa).' },
  { id: 'm-procediment', name: 'Procediment', eraId: 'm-tipus', initials: 'PR', period: 'Diligències ràpides', role: 'Operatiu', fact: 'Per a la PL: documentar bé antecedents, vincular fets, atestat tipus diligències urgents.' },
  { id: 'm-ocupacio', name: 'Ocupació il·legal', eraId: 'm-tipus', initials: 'OC', period: 'Art. 245 reformat', role: 'Aplicació', fact: 'Procediment ràpid per a desallotjament en ocupacions reincidents. Acumulació de causes.' },
];
const MULTI_EXAM: LleiExamItem[] = [
  { date: 'LO 1/2026', text: 'Endureix les penes per a delinqüents multireincidents.' },
  { date: '≥ 3 condemnes', text: 'Aplicació de l\'agreujament per multireincidència.' },
  { date: 'Furt acumulatiu', text: '4t furt lleu del mateix tipus → pot esdevenir delicte menys greu.' },
  { date: 'Diligències', text: 'PL: atestat amb antecedents penals i vinculació de causes.' },
];
const LO_1_2026: EsquemaLlei = {
  id: 'esq-pl-lo12026', slug: 'lo-1-2026-multireincidencia', categoria: 'codi-penal',
  kicker: 'POLICIA LOCAL · LO 1/2026', title: 'Multi', titleHighlight: 'reincidència',
  introOneLiner: 'Reforma del Codi Penal del 2026 per endurir les penes contra els delinqüents que repeteixen delictes lleus (típicament furts < 400€ i ocupacions). Resposta a la "porta giratòria".',
  kpis: [
    { value: 'LO 1/2026', label: 'norma', mono: true },
    { value: '≥ 3', label: 'condemnes prèvies' },
    { value: '4', label: 'punts clau' },
    { value: '< 400€', label: 'llindar furt', mono: true },
  ],
  eras: MULTI_ERAS, timeline: MULTI_TIMELINE, items: MULTI_ITEMS, exam: MULTI_EXAM,
  testSlug: 'lo-1-2026-multireincidencia',
  labels: { items: 'Conceptes clau', itemsTab: 'Conceptes' },
};

// ═══════════════════════════════════════════════════════════════
// LECRIM — Llei d'Enjudiciament Criminal
// Focus: ART. 520 detenció · garanties processals
// ═══════════════════════════════════════════════════════════════
const LECRIM_ERAS: LleiEra[] = [
  { id: 'le-ant', name: 'Antecedents', range: '1882', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'le-detencio', name: 'Detenció · drets', range: 'art. 489 — 527', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'le-instruccio', name: 'Instrucció', range: 'art. 299 — 313', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'le-policia', name: 'Policia judicial', range: 'art. 282 — 298', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'le-procediments', name: 'Procediments', range: 'ordinari · abreviat · ràpid', color: '#5E3A8A', soft: '#E3D4F2' },
];
const LECRIM_TIMELINE: LleiMilestone[] = [
  { eraId: 'le-ant', date: '14 SET 1882', title: 'LECrim original', note: 'Una de les lleis més antigues vigents.' },
  { eraId: 'le-ant', date: '1978', title: 'Adaptació a la CE', note: 'Modificacions per garantir drets fonamentals (art. 17 i 24 CE).' },
  { eraId: 'le-ant', date: '2002', title: 'Llei 38/2002 · judici ràpid', note: 'Procediment ràpid per a delictes lleus i flagrants.' },
  { eraId: 'le-ant', date: '2015', title: 'Reforma LO 13/2015', note: 'Garanties del detingut · accés a actuacions.', star: true },
];
const LECRIM_ITEMS: LleiItem[] = [
  { id: 'le-282', name: 'Art. 282', eraId: 'le-policia', initials: '282', period: 'Funcions policia judicial', role: 'Policia judicial', fact: 'Esbrinar delictes públics, fer diligències per comprovar-los, descobrir delinqüents i recollir efectes/proves. Sota la dependència del jutge instructor i el Ministeri Fiscal.' },
  { id: 'le-489', name: 'Art. 489', eraId: 'le-detencio', initials: '489', period: 'Detenció', role: 'Detenció', fact: 'Ningú pot ser detingut sinó en els casos i en la forma que les lleis prescriguin.' },
  { id: 'le-490', name: 'Art. 490', eraId: 'le-detencio', initials: '490', period: 'Detenció per particular', role: 'Detenció', fact: '⚠️ Qualsevol pot detenir: a qui intentés cometre delicte (al moment), delinqüent en flagrant delicte, fugat de presó, processat o condemnat en rebel·lia, contumaç. NO és obligació.' },
  { id: 'le-491', name: 'Art. 491', eraId: 'le-detencio', initials: '491', period: 'Lliurament al jutge', role: 'Detenció', fact: 'El particular que detingui haurà de justificar la detenció i lliurar la persona al jutge més proper.' },
  { id: 'le-492', name: 'Art. 492', eraId: 'le-detencio', initials: '492', period: 'Quan ha de detenir l\'agent', role: 'CRÍTIC PL', fact: '⭐ L\'autoritat o agent ha de detenir: (1) condemnat per sentència ferma · (2) processat per delicte de presó > 6 anys o > 3 si antecedents · (3) flagrant delicte · (4) sospitós de delicte amb risc fuga.' },
  { id: 'le-495', name: 'Art. 495', eraId: 'le-detencio', initials: '495', period: 'Delicte lleu · sense detenció', role: 'Detenció', fact: 'Pels delictes lleus NO es detindrà, llevat que el presumpte autor no consti com a domiciliat o no presti fiança per la possible responsabilitat.' },
  { id: 'le-520', name: 'Art. 520', eraId: 'le-detencio', initials: '520', period: 'Drets del detingut', role: 'CRÍTIC PL', fact: '⭐⭐⭐ DRETS: ser informat dels fets i drets · guardar silenci · no declarar contra si mateix · designar advocat · entrevista reservada · ser reconegut per metge · comunicar la detenció a familiar · assistència gratuïta d\'intèrpret. Lectura en llengua comprensible.' },
  { id: 'le-520-bis', name: 'Art. 520 bis', eraId: 'le-detencio', initials: 'BIS', period: 'Detenció terrorisme', role: 'Detenció', fact: 'Pot ampliar-se fins a 48 h més (total 5 dies) per autoritat judicial. Incomunicació possible.' },
  { id: 'le-520-ter', name: 'Art. 520 ter', eraId: 'le-detencio', initials: 'TER', period: 'Pirateria/alta mar', role: 'Detenció', fact: 'Detenció especial en aigües jurisdiccionals.' },
  { id: 'le-527', name: 'Art. 527', eraId: 'le-detencio', initials: '527', period: 'Incomunicació', role: 'Detenció', fact: 'Excepcional, només per autorització judicial expressa. Restringeix l\'art. 520. Casos de terrorisme/criminalitat organitzada.' },
  { id: 'le-ord', name: 'Procediment ordinari', eraId: 'le-procediments', initials: 'OR', period: 'Penes > 9 anys', role: 'Procediments', fact: 'Per a delictes greus amb pena privativa de llibertat superior a 9 anys.' },
  { id: 'le-abr', name: 'Procediment abreviat', eraId: 'le-procediments', initials: 'AB', period: 'Penes ≤ 9 anys', role: 'Procediments', fact: 'Per a la majoria de delictes ≤ 9 anys. ⭐ El que més utilitza la PL.' },
  { id: 'le-rap', name: 'Judici ràpid', eraId: 'le-procediments', initials: 'JR', period: 'Pena ≤ 5 anys', role: 'Procediments', fact: 'Per a flagrant o instrucció senzilla, pena ≤ 5 anys. Diligències urgents per la PL (atestat ràpid).' },
];
const LECRIM_EXAM: LleiExamItem[] = [
  { date: 'Art. 520', text: '⭐⭐⭐ Drets del detingut: PREGUNTA SEGURA. Memoritza-los tots.' },
  { date: 'Art. 492', text: 'Quan és OBLIGATÒRIA la detenció per l\'agent. 4 supòsits.' },
  { date: 'Art. 490', text: 'Detenció per particular: 5 supòsits, NO obligació.' },
  { date: '72 hores', text: 'Termini màxim de detenció policial (art. 17 CE + LECrim).' },
  { date: 'Art. 520 bis', text: '+48h en terrorisme amb autorització judicial (total 5 dies).' },
  { date: 'Art. 495', text: 'En delictes lleus: NO detenció (excepte sense domicili/fiança).' },
  { date: 'Judici ràpid', text: 'Diligències urgents PL: atestat ràpid per a flagrants ≤ 5 anys.' },
  { date: '4 procediments', text: 'Ordinari (>9) · abreviat (≤9) · ràpid (≤5) · jurat.' },
];
const LECRIM: EsquemaLlei = {
  id: 'esq-pl-lecrim', slug: 'lecrim', categoria: 'lecrim',
  kicker: 'POLICIA LOCAL · LECrim', title: "Llei d'Enjudiciament", titleHighlight: 'Criminal',
  introOneLiner: 'Llei processal penal del 1882, reformada moltíssimes vegades. Per a la PL el que importa: arts. 282 (policia judicial), 489-527 (detenció), 520 (drets del detingut) i procediment del judici ràpid.',
  kpis: [
    { value: '1882', label: 'antiguitat', mono: true },
    { value: '520', label: 'art. clau detenció', mono: true },
    { value: '13', label: 'articles clau' },
    { value: '72 h', label: 'detenció màx.' },
    { value: '4', label: 'procediments' },
  ],
  eras: LECRIM_ERAS, timeline: LECRIM_TIMELINE, items: LECRIM_ITEMS, exam: LECRIM_EXAM,
  testSlug: 'lecrim-esquema-policial',
  labels: { items: 'Articles imprescindibles', itemsTab: 'Articles' },
};

// ═══════════════════════════════════════════════════════════════
// LO 5/2000 LORPM — Llei reguladora responsabilitat penal menors
// Focus: EDAT PENAL, drets del menor, mesures
// ═══════════════════════════════════════════════════════════════
const LORPM_ERAS: LleiEra[] = [
  { id: 'l5-ant', name: 'Antecedents', range: 'pre-2000', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'l5-llei', name: 'LO 5/2000', range: 'gener 2001', color: '#9747D6', soft: '#F5E9FF' },
  { id: 'l5-ambit', name: 'Àmbit aplicació', range: '14 — 18 anys', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'l5-drets', name: 'Drets del menor', range: 'art. 17 LORPM', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'l5-mesures', name: 'Mesures', range: 'art. 7', color: '#1B7A5C', soft: '#C6EBDD' },
];
const LORPM_TIMELINE: LleiMilestone[] = [
  { eraId: 'l5-ant', date: '12 GEN 2000', title: 'Aprovació LO 5/2000', star: true },
  { eraId: 'l5-llei', date: '13 GEN 2001', title: 'Entrada en vigor', star: true },
  { eraId: 'l5-llei', date: '2006', title: 'Reforma LO 8/2006', note: 'Endureix mesures per a delictes greus.' },
];
const LORPM_ITEMS: LleiItem[] = [
  { id: 'l5-1', name: 'Art. 1', eraId: 'l5-ambit', initials: '1', period: 'Àmbit subjectiu', role: 'CRÍTIC PL', fact: '⭐⭐ S\'aplica a majors de 14 i menors de 18 anys per fets tipificats com a delicte o falta. Menors de 14 anys NO penals (mesures civils via fiscalia menors).' },
  { id: 'l5-3', name: 'Art. 3', eraId: 'l5-ambit', initials: '3', period: '< 14 anys', role: 'Àmbit', fact: 'Els menors de 14 anys quedaran subjectes al CC i altres disposicions. La protecció dels seus drets correspon al Ministeri Fiscal.' },
  { id: 'l5-4', name: 'Art. 4', eraId: 'l5-ambit', initials: '4', period: 'Tram 18-21 (derogat)', role: 'Àmbit', fact: '⚠️ El "règim de joves de 18-21 anys" mai va entrar en vigor (suspès indefinidament). NO s\'aplica.' },
  { id: 'l5-7', name: 'Art. 7', eraId: 'l5-mesures', initials: '7', period: 'Catàleg de mesures', role: 'Mesures', fact: 'Internament règim tancat/semi-obert/obert · permanència caps setmana · llibertat vigilada · serveis benefici comunitat · tractament ambulatori · prestacions educatives.' },
  { id: 'l5-17', name: 'Art. 17', eraId: 'l5-drets', initials: '17', period: 'Drets del menor detingut', role: 'CRÍTIC PL', fact: '⭐ Drets menor: informació immediata · advocat (designat o ofici) · assistència psicològica · familiars · NO declarar sense advocat NI representant legal · Fiscal Menors avisat IMMEDIATAMENT.' },
  { id: 'l5-procediment', name: 'Fiscal Menors', eraId: 'l5-drets', initials: 'FM', period: 'Fiscal especialitzat', role: 'Operatiu', fact: 'Tot menor detingut ha de ser posat a disposició del Fiscal de Menors immediatament i com a màxim en 24h.' },
  { id: 'l5-jurisdiccio', name: 'Jutjat Menors', eraId: 'l5-drets', initials: 'JM', period: 'Òrgan jurisdiccional', role: 'Operatiu', fact: 'A cada província. Jutge especialitzat. Procediment propi, separat de l\'adult.' },
];
const LORPM_EXAM: LleiExamItem[] = [
  { date: '14 — 18 anys', text: '⭐ Àmbit d\'aplicació LORPM. < 14 = NO penals.' },
  { date: '24 hores', text: 'Posada a disposició màxima del Fiscal de Menors.' },
  { date: 'Art. 7', text: 'Catàleg de mesures: internament (3 modalitats) + 5 més.' },
  { date: '18 — 21 anys', text: '⚠️ El règim mai va entrar en vigor. NO confondre.' },
  { date: 'Fiscal Menors', text: 'Avisar IMMEDIATAMENT en cas de detenció.' },
  { date: 'Art. 17', text: 'Drets ampliats del menor: advocat + representant legal + psicologia.' },
];
const LO_5_2000: EsquemaLlei = {
  id: 'esq-pl-lorpm', slug: 'lo-5-2000-lorpm', categoria: 'menors',
  kicker: 'POLICIA LOCAL · LORPM LO 5/2000', title: 'Responsabilitat penal', titleHighlight: 'del menor',
  introOneLiner: 'LO 5/2000 reguladora de la responsabilitat penal dels menors. Aplica a 14-18 anys. Sistema sancionador/educatiu separat de l\'adult. Fiscal de Menors avisat sempre.',
  kpis: [
    { value: 'LO 5/2000', label: 'norma', mono: true },
    { value: '14 — 18', label: 'edat aplicació' },
    { value: '7', label: 'conceptes clau' },
    { value: '24 h', label: 'a fiscal màx.' },
  ],
  eras: LORPM_ERAS, timeline: LORPM_TIMELINE, items: LORPM_ITEMS, exam: LORPM_EXAM,
  testSlug: 'lo-5-2000-lorpm-esquema-policial',
  labels: { items: 'Articles clau', itemsTab: 'Articles' },
};

// ═══════════════════════════════════════════════════════════════
// LO 4/2015 — Seguretat Ciutadana ("Llei mordassa")
// Focus: INFRACCIONS per gravetat (lleus / greus / molt greus)
// ═══════════════════════════════════════════════════════════════
const LO42015_ERAS: LleiEra[] = [
  { id: 'lo4-llei', name: 'Llei i estructura', range: '2015 →', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'lo4-id', name: 'Identificació', range: 'art. 16', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'lo4-lleus', name: 'Infraccions LLEUS', range: 'art. 37 · 100€-600€', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'lo4-greus', name: 'Infraccions GREUS', range: 'art. 36 · 601€-30.000€', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'lo4-mg', name: 'Infraccions MOLT GREUS', range: 'art. 35 · 30.001€-600.000€', color: '#C0392B', soft: '#F4D2CE' },
];
const LO42015_TIMELINE: LleiMilestone[] = [
  { eraId: 'lo4-llei', date: '30 MAR 2015', title: 'Aprovació LO 4/2015', note: '"Llei mordassa" segons crítics.', star: true },
  { eraId: 'lo4-llei', date: '1 JUL 2015', title: 'Entrada en vigor', star: true },
  { eraId: 'lo4-llei', date: '2021', title: 'STC 13/2021 anul·la art. 36.23', note: 'Difusió imatges agents.' },
  { eraId: 'lo4-llei', date: '54 articles', title: 'Estructura general', note: '5 capítols + disposicions.' },
];
const LO42015_ITEMS: LleiItem[] = [
  { id: 'lo4-16', name: 'Art. 16', eraId: 'lo4-id', initials: '16', period: 'Identificació', role: 'CRÍTIC PL', fact: '⭐⭐ Diligències d\'identificació: si la persona no col·labora i hi ha indicis racionals, trasllat dependències per a identificació. Màx 6h. Anotat en llibre-registre.' },
  { id: 'lo4-17', name: 'Art. 17', eraId: 'lo4-id', initials: '17', period: 'Restriccions i identificacions massives', role: 'Operatiu', fact: 'Per prevenir delictes greus en grans concentracions o esdeveniments. Identificacions en lloc i autoritzat.' },
  { id: 'lo4-18', name: 'Art. 18', eraId: 'lo4-id', initials: '18', period: 'Comprovacions i registres corporals', role: 'CRÍTIC PL', fact: '⭐ Cacheig superficial sobre la persona quan hi hagi indicis racionals que porta objectes/instruments del delicte. Es respectarà la dignitat.' },
  { id: 'lo4-37', name: 'Art. 37', eraId: 'lo4-lleus', initials: '37', period: 'INFRACCIONS LLEUS', role: 'CRÍTIC PL · multa 100-600€', fact: '⭐ 17 supòsits. Destacats: 37.1 (alteració seguretat espais públics), 37.5 (negativa a identificació), 37.13 (consum begudes alcohòliques en espais públics que pugui afectar tranquil·litat), 37.7 (consum drogues a la via pública).' },
  { id: 'lo4-36', name: 'Art. 36', eraId: 'lo4-greus', initials: '36', period: 'INFRACCIONS GREUS', role: 'CRÍTIC PL · multa 601-30.000€', fact: '⭐ 23 supòsits. Destacats: 36.6 (desobediència o resistència que no sigui delicte), 36.8 (pertorbació seguretat en actes públics), 36.23 (anul·lat parcialment pel TC).' },
  { id: 'lo4-35', name: 'Art. 35', eraId: 'lo4-mg', initials: '35', period: 'INFRACCIONS MOLT GREUS', role: 'Multa 30.001-600.000€', fact: '3 supòsits: reunions/manifestacions a infraestructures crítiques, fabricació no autoritzada d\'armes, projecció raig làser a vehicles aeris.' },
  { id: 'lo4-39', name: 'Art. 39', eraId: 'lo4-mg', initials: '39', period: 'Sancions accessòries', role: 'Sancions', fact: 'Pot incloure: retirada armes, suspensió de drets administratius, decomís d\'efectes.' },
  { id: 'lo4-prescripcio', name: 'Prescripció', eraId: 'lo4-lleus', initials: 'PR', period: 'Terminis', role: 'CRÍTIC PL', fact: '⭐ Lleus: 6 mesos · Greus: 1 any · Molt greus: 2 anys. Sancions: lleus 1 any, greus 2 anys, molt greus 3 anys.' },
];
const LO42015_EXAM: LleiExamItem[] = [
  { date: 'Art. 35-36-37', text: '⭐ Tres nivells: molt greu / greu / lleu. Memoritzar els imports.' },
  { date: 'Art. 16', text: 'Diligències identificació: 6h màxim a dependències.' },
  { date: 'Art. 18', text: 'Cacheig superficial amb indicis racionals. Dignitat respectada.' },
  { date: 'Multes', text: 'Lleus 100-600€ · Greus 601-30.000€ · Molt greus 30.001-600.000€.' },
  { date: 'Prescripció', text: 'Infraccions: 6m / 1a / 2a. Sancions: 1a / 2a / 3a.' },
  { date: '37.5', text: 'Negativa a identificació davant agent = LLEU.' },
  { date: '36.6', text: 'Desobediència/resistència sense delicte = GREU.' },
  { date: '1 juliol 2015', text: 'Entrada en vigor.' },
];
const LO_4_2015: EsquemaLlei = {
  id: 'esq-pl-lo42015', slug: 'lo-4-2015-sc', categoria: 'sc',
  kicker: 'POLICIA LOCAL · LO 4/2015', title: 'Protecció', titleHighlight: 'Seguretat Ciutadana',
  introOneLiner: 'La "llei mordassa". Marc operatiu diari de la PL: identificacions, cacheigs, infraccions administratives en tres nivells (lleu/greu/molt greu) amb multes que van de 100€ a 600.000€.',
  kpis: [
    { value: 'LO 4/2015', label: 'norma', mono: true },
    { value: '54', label: 'articles' },
    { value: '8', label: 'articles clau' },
    { value: '3', label: 'nivells infracció' },
    { value: '6 h', label: 'identif. màx.' },
  ],
  eras: LO42015_ERAS, timeline: LO42015_TIMELINE, items: LO42015_ITEMS, exam: LO42015_EXAM,
  testSlug: 'lo-4-2015-seguridad-ciudadana',
  labels: { items: 'Articles i infraccions', itemsTab: 'Infraccions' },
};

// ═══════════════════════════════════════════════════════════════
// LO 2/1986 — FCS
// Focus: PRINCIPIS BÀSICS art. 5 (CO-PR) i cossos
// ═══════════════════════════════════════════════════════════════
const FCS_ERAS: LleiEra[] = [
  { id: 'fcs-norma', name: 'Llei i àmbit', range: '13 març 1986', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'fcs-cossos', name: 'Tipus de cossos', range: 'art. 2', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'fcs-principis', name: 'Principis bàsics art. 5', range: '6 grans grups', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'fcs-funcions', name: 'Funcions', range: 'art. 11 · 38', color: '#9C7A2A', soft: '#F4E6BC' },
];
const FCS_TIMELINE: LleiMilestone[] = [
  { eraId: 'fcs-norma', date: '13 MAR 1986', title: 'LO 2/1986 · FCS', note: 'Desplega l\'art. 104 CE.', star: true },
  { eraId: 'fcs-norma', date: '2007', title: 'Reforma LO 9/2007', note: 'Adapta a Directiva UE.' },
  { eraId: 'fcs-norma', date: 'Art. 104 CE', title: 'Mandat constitucional', note: 'Habilitació per regular FCS.' },
];
const FCS_ITEMS: LleiItem[] = [
  { id: 'fcs-2', name: 'Art. 2', eraId: 'fcs-cossos', initials: '2', period: 'Tipus de FCS', role: 'CRÍTIC', fact: '⭐ 3 tipus: a) FCSE (Estat: Policia Nacional + Guàrdia Civil) · b) Cossos policia CCAA · c) Cossos policia local.' },
  { id: 'fcs-5-1', name: 'Art. 5.1', eraId: 'fcs-principis', initials: '5.1', period: 'Adequació ordenament', role: 'PRINCIPI 1', fact: '⭐ Respecte CE + neutralitat + integritat + jerarquia (l\'obediència deguda MAI ampara ordres delictives) + col·laborar amb Justícia.' },
  { id: 'fcs-5-2', name: 'Art. 5.2', eraId: 'fcs-principis', initials: '5.2', period: 'Relacions amb la comunitat', role: 'PRINCIPI 2', fact: '⭐⭐ Impedir abusos · tracte correcte · decisió davant dany greu/immediat (CO-PR: Congruència, Oportunitat, Proporcionalitat). Armes només amb risc racionalment greu.' },
  { id: 'fcs-5-3', name: 'Art. 5.3', eraId: 'fcs-principis', initials: '5.3', period: 'Tractament de detinguts', role: 'PRINCIPI 3', fact: 'Identificació en moment detenció · vetllar per vida, integritat, honor i dignitat · compliment tràmits i terminis.' },
  { id: 'fcs-5-4', name: 'Art. 5.4', eraId: 'fcs-principis', initials: '5.4', period: 'Dedicació professional', role: 'PRINCIPI 4', fact: 'Total dedicació · intervenció en qualsevol temps i lloc, dins o fora de servei.' },
  { id: 'fcs-5-5', name: 'Art. 5.5', eraId: 'fcs-principis', initials: '5.5', period: 'Secret professional', role: 'PRINCIPI 5', fact: 'Rigorós secret de la informació coneguda en la funció policial.' },
  { id: 'fcs-5-6', name: 'Art. 5.6', eraId: 'fcs-principis', initials: '5.6', period: 'Responsabilitat', role: 'PRINCIPI 6', fact: 'Responsabilitat personal i directa pels actes en l\'actuació professional.' },
  { id: 'fcs-co-pr', name: 'CO-PR', eraId: 'fcs-principis', initials: 'COPR', period: 'Congruència · Oportunitat · Proporcionalitat', role: 'CRÍTIC EXAMEN', fact: '⭐⭐⭐ MEMORITZAR. Principi clau d\'ús de la força (art. 5.2.c). PREGUNTA ASSEGURADA.' },
  { id: 'fcs-11', name: 'Art. 11', eraId: 'fcs-funcions', initials: '11', period: 'Funcions FCSE', role: 'Funcions', fact: 'Vetllar pel compliment lleis, auxili, prevenir comissió delictes, investigar delictes, captura delinqüents, ordre públic, vigilància espais, protecció autoritats.' },
  { id: 'fcs-38', name: 'Art. 38', eraId: 'fcs-funcions', initials: '38', period: 'Funcions autonòmiques', role: 'Funcions', fact: 'PRÒPIES (vigilància CA, disposicions CA) · COMPARTIDES (resolució conflictes, accidents, natura) · COL·LABORACIÓ (disposicions Estat, judicial, grans concentracions).' },
  { id: 'fcs-53', name: 'Art. 53', eraId: 'fcs-funcions', initials: '53', period: 'Funcions PL', role: 'CRÍTIC PL', fact: '⭐⭐ Protegir autoritats locals · vigilar edificis municipals · ordenar/dirigir trànsit nucli urbà · atestats accidents urbans · policia administrativa (ordenances) · policia judicial · prevenció · col·laboració FCSE.' },
];
const FCS_EXAM: LleiExamItem[] = [
  { date: 'Art. 5 (6 grups)', text: '⭐⭐⭐ 6 principis bàsics: ordenament · comunitat · detinguts · dedicació · secret · responsabilitat.' },
  { date: 'CO-PR', text: 'Congruència · Oportunitat · Proporcionalitat (art. 5.2.c).' },
  { date: 'Art. 2', text: '3 tipus de FCS: FCSE + CCAA + Locals.' },
  { date: 'Art. 53', text: 'Funcions de la PL: memoritzar les 8-9 funcions.' },
  { date: 'Obediència deguda', text: 'MAI ampara ordres delictives o contràries a la CE.' },
  { date: 'Armes', text: 'Ús només amb risc racionalment greu per vida o integritat.' },
  { date: 'Art. 104 CE', text: 'Mandat constitucional que habilita la LO 2/1986.' },
];
const LO_2_1986: EsquemaLlei = {
  id: 'esq-pl-lo21986', slug: 'lo-2-1986-fcs', categoria: 'fcs',
  kicker: 'POLICIA LOCAL · FCS LO 2/1986', title: 'Forces i Cossos', titleHighlight: 'de Seguretat',
  introOneLiner: 'Llei capital del sistema policial espanyol. Defineix els 3 tipus de FCS (estatal, autonòmica, local) i els 6 principis bàsics d\'actuació de l\'art. 5 — la PREGUNTA més clàssica de l\'oposició.',
  kpis: [
    { value: 'LO 2/1986', label: 'norma', mono: true },
    { value: '13 març', label: 'data', mono: true },
    { value: '6', label: 'principis bàsics' },
    { value: '3', label: 'tipus de cossos' },
    { value: 'CO-PR', label: 'memoritzar', mono: true },
  ],
  eras: FCS_ERAS, timeline: FCS_TIMELINE, items: FCS_ITEMS, exam: FCS_EXAM,
  testSlug: 'lo-2-1986-fcs-esquema-policial',
  labels: { items: 'Articles i principis', itemsTab: 'Articles' },
};

// ═══════════════════════════════════════════════════════════════
// Llei 4/2003 — Sistema seguretat pública CAT
// Focus: ÒRGANS de coordinació
// ═══════════════════════════════════════════════════════════════
const L42003_ERAS: LleiEra[] = [
  { id: 'l4-norma', name: 'Llei 4/2003', range: '7 abril', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'l4-autoritats', name: 'Autoritats', range: 'Govern · alcaldes', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'l4-organs', name: 'Òrgans coordinació', range: 'CSC · CGSeg · CPC · JLS', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'l4-pla', name: 'Planificació', range: 'PGSC quadriennal', color: '#9C7A2A', soft: '#F4E6BC' },
];
const L42003_TIMELINE: LleiMilestone[] = [
  { eraId: 'l4-norma', date: '7 ABR 2003', title: 'Llei 4/2003', note: 'D\'ordenació del sistema de seguretat pública.', star: true },
  { eraId: 'l4-norma', date: 'Unanimitat', title: 'Aprovació parlamentària', note: 'Aprovada per UNANIMITAT al Parlament.', star: true },
  { eraId: 'l4-norma', date: '17 OCT 1994', title: 'Acords històrics (antecedent)', note: 'Desbloqueig del desplegament dels Mossos.' },
];
const L42003_ITEMS: LleiItem[] = [
  { id: 'l4-csc', name: 'CSC', eraId: 'l4-organs', initials: 'CSC', period: 'Consell Seguretat Catalunya', role: 'MÀXIM òrgan', fact: '⭐ Màxim òrgan consultiu i participatiu del sistema. Informe anual. Presidit per la persona titular del Departament.' },
  { id: 'l4-cgseg', name: 'CGSeg', eraId: 'l4-organs', initials: 'CG', period: 'Comissió Govern Seguretat', role: 'Estratègic', fact: 'Òrgan polític d\'estratègia. Presidida pel/per la PRESIDENT/A DE LA GENERALITAT. Consellers afectats per matèries de seguretat.' },
  { id: 'l4-cpc', name: 'CPC', eraId: 'l4-organs', initials: 'CPC', period: 'Comissió Policia Catalunya', role: 'Operatiu', fact: '⭐ Òrgan consultiu de coordinació PG-ME ↔ policies locals. Substitueix la Comissió de Coordinació de Policies Locals. Presidida pel conseller.' },
  { id: 'l4-crs', name: 'CRS', eraId: 'l4-organs', initials: 'CRS', period: 'Comissions regionals seguretat', role: 'Territorial', fact: 'Una per regió policial. Coordinen actuacions al territori.' },
  { id: 'l4-jls', name: 'JLS', eraId: 'l4-organs', initials: 'JLS', period: 'Juntes Locals Seguretat', role: 'CRÍTIC PL', fact: '⭐⭐ OBLIGATÒRIES als municipis amb policia local. Presidides per L\'ALCALDE. NO confondre amb la Junta de Seguretat de Catalunya (paritària, presidida pel president Generalitat).' },
  { id: 'l4-mco', name: 'MCO', eraId: 'l4-organs', initials: 'MCO', period: 'Mesa Coordinació Operativa', role: 'Operatiu', fact: 'Òrgan permanent i estable que depèn de cada JLS. Coordinació operativa diària.' },
  { id: 'l4-conseller', name: 'Conseller Interior', eraId: 'l4-autoritats', initials: 'CI', period: 'Autoritat superior', role: 'Autoritats', fact: 'Dirigeix la política de seguretat de Catalunya.' },
  { id: 'l4-alcalde', name: 'Alcaldes', eraId: 'l4-autoritats', initials: 'AL', period: 'Autoritats locals', role: 'Autoritats', fact: 'Autoritat superior en matèria de seguretat pública en l\'àmbit local.' },
  { id: 'l4-pgsc', name: 'PGSC', eraId: 'l4-pla', initials: 'PGSC', period: 'Pla General Seguretat CAT', role: 'CRÍTIC EXAMEN', fact: '⭐⭐ Periodicitat QUADRIENNAL. Aprovat pel Govern. Tràmits: CGSeg → CSC → Parlament. NO confondre amb el PSV (trànsit, triennal).' },
];
const L42003_EXAM: LleiExamItem[] = [
  { date: 'Llei 4/2003', text: '7 d\'abril · ordenació del sistema. APROVADA PER UNANIMITAT.' },
  { date: 'PGSC', text: 'QUADRIENNAL. NO triennal (el triennal és el PSV de trànsit).' },
  { date: '3 components', text: 'Autoritats + cossos + òrgans de coordinació.' },
  { date: 'JLS', text: 'Obligatòries amb policia local. Presidides per l\'alcalde.' },
  { date: 'CGSeg', text: 'Presidida pel/per la president/a de la Generalitat.' },
  { date: 'Juntes ≠', text: 'JS Catalunya (paritària, president) ≠ JLS (Llei 4/2003, alcalde) ≠ MCO (operativa, depèn de JLS).' },
  { date: 'CPC', text: 'Comissió Policia Catalunya: PG-ME + policies locals.' },
];
const LLEI_4_2003: EsquemaLlei = {
  id: 'esq-pl-l42003', slug: 'llei-4-2003', categoria: 'fcs',
  kicker: 'POLICIA LOCAL · Llei 4/2003', title: 'Sistema de Seguretat', titleHighlight: 'Pública de Catalunya',
  introOneLiner: 'Llei 4/2003 de 7 d\'abril, aprovada per UNANIMITAT al Parlament. Defineix el sistema català de seguretat: autoritats, cossos i òrgans de coordinació (CSC, CPC, JLS, MCO) + Pla General quadriennal.',
  kpis: [
    { value: 'Llei 4/2003', label: 'norma', mono: true },
    { value: '7 abril', label: 'data', mono: true },
    { value: '9', label: 'òrgans i conceptes' },
    { value: 'PGSC 4 anys', label: 'planificació', mono: true },
  ],
  eras: L42003_ERAS, timeline: L42003_TIMELINE, items: L42003_ITEMS, exam: L42003_EXAM,
  testSlug: 'llei-4-2003-sistema-seguretat-publica-catalunya-esquema-policial',
  labels: { items: 'Òrgans del sistema', itemsTab: 'Òrgans' },
};

// ═══════════════════════════════════════════════════════════════
// Llei 16/1991 — Policies Locals de Catalunya
// Focus: ESCALES i categories policials
// ═══════════════════════════════════════════════════════════════
const L161991_ERAS: LleiEra[] = [
  { id: 'l16-norma', name: 'Llei 16/1991', range: '10 juliol', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'l16-creacio', name: 'Creació · comandament', range: '> 10.000 hab.', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'l16-escales', name: 'Escales i categories', range: '4 escales', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'l16-funcions', name: 'Funcions PL', range: 'art. 11', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'l16-ambit', name: 'Àmbit · dipòsit', range: 'municipi propi', color: '#5E3A8A', soft: '#E3D4F2' },
];
const L161991_TIMELINE: LleiMilestone[] = [
  { eraId: 'l16-norma', date: '10 JUL 1991', title: 'Llei 16/1991', note: 'Desplega l\'art. 164.2 EAC.', star: true },
  { eraId: 'l16-norma', date: 'Art. 164.2 EAC', title: 'Marc estatutari', note: 'Coordinació de policies locals per la Generalitat.' },
];
const L161991_ITEMS: LleiItem[] = [
  { id: 'l16-creacio', name: 'Creació del cos', eraId: 'l16-creacio', initials: 'CR', period: '> 10.000 habitants', role: 'CRÍTIC PL', fact: '⭐ Tots els municipis amb > 10.000 hab. poden crear-ne. Excepcionalment per autorització del conseller d\'Interior amb menys.' },
  { id: 'l16-cap', name: 'Comandament', eraId: 'l16-creacio', initials: 'AL', period: 'Alcalde', role: 'CRÍTIC PL', fact: '⭐ Comandament del cos: ALCALDE. Comandament directe: el cap del cos (major graduació).' },
  { id: 'l16-superior', name: 'Escala SUPERIOR', eraId: 'l16-escales', initials: 'SU', period: 'A1', role: 'Escala', fact: '⭐ Superintendent · Intendent major · Intendent. Grup A1 (necessita grau).' },
  { id: 'l16-executiva', name: 'Escala EXECUTIVA', eraId: 'l16-escales', initials: 'EX', period: 'A2', role: 'Escala', fact: 'Inspector. Grup A2 (diplomatura/grau).' },
  { id: 'l16-intermedia', name: 'Escala INTERMÈDIA', eraId: 'l16-escales', initials: 'IN', period: 'C1', role: 'Escala', fact: '⭐ Sotsinspector · Sergent. Grup C1 (batxillerat).' },
  { id: 'l16-basica', name: 'Escala BÀSICA', eraId: 'l16-escales', initials: 'BA', period: 'C2', role: 'Escala', fact: '⭐ Caporal · AGENT. Grup C2 (ESO). Per on entra tothom.' },
  { id: 'l16-nosuport', name: 'NO escala suport', eraId: 'l16-escales', initials: 'NO', period: 'Distintiu vs PG-ME', role: 'CRÍTIC EXAMEN', fact: '⭐⭐ La PL té 4 escales, NO 5. La PG-ME sí té escala de suport (facultatiu · tècnic). PREGUNTA CLÀSSICA.' },
  { id: 'l16-11', name: 'Art. 11', eraId: 'l16-funcions', initials: '11', period: 'Funcions de la PL', role: 'CRÍTIC PL', fact: 'a) Protegir autoritats · b) Trànsit urbà · c) Atestats accidents · d) Policia administrativa · e) Judicial · f) Prevenció · g) Col·laboració · h) Conflictes · i) Espais públics · j) Auxili · k) Medi ambient · l) Seguretat viària.' },
  { id: 'l16-ambit', name: 'Àmbit territorial', eraId: 'l16-ambit', initials: 'AM', period: 'Municipi propi', role: 'CRÍTIC PL', fact: '⭐ Només municipi propi. EXCEPCIÓ: municipis limítrofs en cas d\'emergència excepcional, donant compte al conseller d\'Interior.' },
  { id: 'l16-deposit', name: 'Dipòsit detinguts', eraId: 'l16-ambit', initials: 'DD', period: 'Cap partit judicial', role: 'Operatiu', fact: 'Municipis cap de partit judicial sense establiment penitenciari assumeixen el dipòsit de persones detingudes a disposició judicial.' },
  { id: 'l16-sense', name: 'Municipis sense PL', eraId: 'l16-ambit', initials: 'NS', period: 'Vigilants/algutzirs', role: 'Operatiu', fact: 'Poden tenir: guàrdies, vigilants, agents, algutzirs. ⚠️ NI UN sol pot dur arma. Funcions limitades.' },
];
const L161991_EXAM: LleiExamItem[] = [
  { date: 'Llei 16/1991', text: '10 juliol · policies locals de Catalunya.' },
  { date: '> 10.000', text: 'Habitants per crear policia local.' },
  { date: 'Alcalde', text: 'Comandament del cos. Comandament directe: cap del cos.' },
  { date: '4 escales', text: 'Bàsica · intermèdia · executiva · superior. NO té de suport.' },
  { date: 'Categories', text: 'Agent, caporal · sergent, sotsinspector · inspector · intendent, intendent major, superintendent.' },
  { date: 'Àmbit', text: 'Municipi propi. Excepció: emergència en limítrofs.' },
  { date: '4 vs 5', text: '⭐ PL = 4 escales · PG-ME = 5 (té suport). PREGUNTA CLÀSSICA.' },
  { date: 'Sense arma', text: 'Vigilants/algutzirs de municipis sense PL NO poden portar arma.' },
];
const LLEI_16_1991: EsquemaLlei = {
  id: 'esq-pl-l161991', slug: 'llei-16-1991', categoria: 'fcs',
  kicker: 'POLICIA LOCAL · Llei 16/1991', title: 'Policies Locals', titleHighlight: 'de Catalunya',
  introOneLiner: 'Llei 16/1991 de 10 de juliol. La teva pròpia llei. Defineix l\'estructura del cos (4 escales, NO 5 com PG-ME), el comandament (alcalde), l\'àmbit territorial (municipi propi) i les 12 funcions de la PL.',
  kpis: [
    { value: 'Llei 16/1991', label: 'norma', mono: true },
    { value: '4', label: 'escales' },
    { value: '> 10.000', label: 'hab. per crear' },
    { value: '12', label: 'funcions PL' },
    { value: 'alcalde', label: 'comandament' },
  ],
  eras: L161991_ERAS, timeline: L161991_TIMELINE, items: L161991_ITEMS, exam: L161991_EXAM,
  testSlug: 'llei-16-1991-policies-locals-catalunya-esquema-policial',
  labels: { items: 'Estructura i funcions', itemsTab: 'Estructura' },
};

// ═══════════════════════════════════════════════════════════════
// Codi d'Ètica de la Policia de Catalunya
// Focus: NORMES clau + valors
// ═══════════════════════════════════════════════════════════════
const CODI_ETICA_ERAS: LleiEra[] = [
  { id: 'ce-eur', name: 'Marc europeu', range: 'REC(2001)10', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'ce-cat-aplicacio', name: 'Aplicació a CAT', range: 'INT/1828/2004', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'ce-cat', name: 'Codi català', range: 'GOV/25/2015', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'ce-valors', name: 'Valors i deures', range: 'mínims ètics', color: '#FF7A1A', soft: '#FFE0CB' },
];
const CODI_ETICA_TIMELINE: LleiMilestone[] = [
  { eraId: 'ce-eur', date: '19 SET 2001', title: 'REC(2001)10', note: 'Comitè Ministres Consell d\'Europa.', star: true },
  { eraId: 'ce-cat-aplicacio', date: '14 JUN 2004', title: 'INT/1828/2004', note: 'Aplicació a la PG-ME.', star: true },
  { eraId: 'ce-cat', date: '2007', title: 'Comitè d\'Ètica creat' },
  { eraId: 'ce-cat', date: '24 FEB 2015', title: 'GOV/25/2015 · Codi català', star: true },
];
const CODI_ETICA_ITEMS: LleiItem[] = [
  { id: 'ce-rec', name: 'REC(2001)10', eraId: 'ce-eur', initials: 'EU', period: 'Codi europeu', role: 'CRÍTIC EXAMEN', fact: '⭐ Recomanació del Comitè de Ministres del Consell d\'Europa, 19 setembre 2001. Codi europeu d\'ètica de la policia. Fonament: CEDH.' },
  { id: 'ce-int', name: 'INT/1828/2004', eraId: 'ce-cat-aplicacio', initials: 'INT', period: 'Resolució CAT', role: 'Norma', fact: 'Resolució del 14 juny 2004 d\'incorporació i aplicació del Codi europeu a la PG-ME.' },
  { id: 'ce-gov', name: 'GOV/25/2015', eraId: 'ce-cat', initials: 'GOV', period: 'Codi català', role: 'CRÍTIC EXAMEN', fact: '⭐⭐ Acord del Govern de 24 febrer 2015. Aprova el Codi d\'Ètica de la Policia de Catalunya. ⚠️ NO reglamenta pràctiques: és eina PEDAGÒGICA I INSPIRADORA.' },
  { id: 'ce-comite', name: "Comitè d'Ètica", eraId: 'ce-cat', initials: 'CE', period: '2007', role: 'Institució', fact: 'Comitè d\'Ètica de la Policia de Catalunya creat el 2007 com a eina de recerca i consulta. Proposa el Codi.' },
  { id: 'ce-coe', name: "Consell d'Europa", eraId: 'ce-eur', initials: 'CoE', period: 'NO és UE', role: 'CRÍTIC', fact: '⭐ Organisme de drets humans · seu Estrasburg · 46 estats. DIFERENT del Consell de la UE (ministres) i del Consell Europeu (caps Estat).' },
  { id: 'ce-vigilants', name: 'Vigilants municipals', eraId: 'ce-valors', initials: 'VM', period: 'Marc aplicable', role: 'Aplicació', fact: 'El Codi català és també MARC DE REFERÈNCIA per als vigilants municipals (preàmbul).' },
  { id: 'ce-valors-key', name: 'Valors clau', eraId: 'ce-valors', initials: 'VA', period: 'Mínims ètics', role: 'Contingut', fact: 'Bones pràctiques · actuació no discriminatòria · respecte dignitat i autonomia · cooperació · col·laboració amb la Justícia · gestió responsable de la informació · proximitat.' },
  { id: 'ce-doble', name: 'Doble garantia', eraId: 'ce-valors', initials: 'DG', period: 'Concepte', role: 'Concepte', fact: 'La deontologia és DOBLE GARANTIA: per al ciutadà I per al mateix policia.' },
];
const CODI_ETICA_EXAM: LleiExamItem[] = [
  { date: 'GOV/25/2015', text: '24 febrer 2015. Codi d\'Ètica de la Policia de Catalunya.' },
  { date: 'REC(2001)10', text: '19 setembre 2001. Codi europeu d\'ètica de la policia.' },
  { date: 'INT/1828/2004', text: '14 juny 2004. Aplicació a la PG-ME.' },
  { date: 'Comitè d\'Ètica', text: 'Creat el 2007. Eina de recerca i consulta.' },
  { date: 'NO reglamenta', text: 'El Codi català és eina PEDAGÒGICA I INSPIRADORA · NO reglamenta pràctiques.' },
  { date: '3 Consells', text: "Consell d'Europa (Estrasburg, 46 estats, DDHH) ≠ UE (ministres) ≠ Europeu (caps Estat)." },
  { date: 'Vigilants', text: 'El Codi català és també marc per a vigilants municipals.' },
];
const CODI_ETICA: EsquemaLlei = {
  id: 'esq-pl-deontologia', slug: 'codi-etica-policia-catalunya', categoria: 'fcs',
  kicker: 'POLICIA LOCAL · Codi ètica', title: 'Codi', titleHighlight: "d'Ètica Policial",
  introOneLiner: 'Marc deontològic. Codi europeu REC(2001)10 del Consell d\'Europa (19 set. 2001), aplicat a Catalunya per INT/1828/2004 i complementat amb el Codi català GOV/25/2015 del 24 febrer 2015.',
  kpis: [
    { value: 'GOV/25/2015', label: 'codi català', mono: true },
    { value: '2001', label: 'codi europeu', mono: true },
    { value: '8', label: 'conceptes clau' },
    { value: '2007', label: 'Comitè creat', mono: true },
  ],
  eras: CODI_ETICA_ERAS, timeline: CODI_ETICA_TIMELINE, items: CODI_ETICA_ITEMS, exam: CODI_ETICA_EXAM,
  testSlug: 'codi-d-etica-policia-catalunya-deontologia-policial-esquema-operatiu-policial',
  labels: { items: 'Normes i conceptes', itemsTab: 'Normes' },
};

// ═══════════════════════════════════════════════════════════════
// Reglament d'Armes (RD 137/1993)
// Focus: 7 CATEGORIES d'armes
// ═══════════════════════════════════════════════════════════════
const REG_ARMES_ERAS: LleiEra[] = [
  { id: 'ra-norma', name: 'Norma', range: 'RD 137/1993', color: '#3A3A45', soft: '#D5D5DA' },
  { id: 'ra-cat', name: 'Categories armes', range: '7 categories', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'ra-llic', name: 'Llicències · guies', range: 'A · B · C · D · E · F', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'ra-control', name: 'Control intervenció', range: "GC · Intervenció d'Armes", color: '#9C7A2A', soft: '#F4E6BC' },
];
const REG_ARMES_TIMELINE: LleiMilestone[] = [
  { eraId: 'ra-norma', date: '29 GEN 1993', title: 'RD 137/1993 · Reglament Armes', note: 'Vigent amb diverses reformes.', star: true },
  { eraId: 'ra-norma', date: '2008', title: 'Reforma RD 976/2008', note: 'Actualització categories i transposició UE.' },
];
const REG_ARMES_ITEMS: LleiItem[] = [
  { id: 'ra-1', name: 'Categoria 1ª', eraId: 'ra-cat', initials: '1', period: 'Armes de foc curtes', role: 'CRÍTIC EXAMEN', fact: '⭐ Pistoles, revòlvers. Llicència B. Particulars (B1) o de seguretat (B2: vigilants seguretat).' },
  { id: 'ra-2', name: 'Categoria 2ª', eraId: 'ra-cat', initials: '2', period: 'Armes de foc llargues', role: 'Armes', fact: 'Subdividida en 2.1 (cala-aire) i 2.2 (escopetes ratllades, fusells). Llicències E o D segons subtipus.' },
  { id: 'ra-3', name: 'Categoria 3ª', eraId: 'ra-cat', initials: '3', period: 'Armes llargues amb ànima llisa', role: 'Armes', fact: '3.1 (escopetes esportives), 3.2 (caça menor), 3.3 (carabines aire/gas). Llicència E.' },
  { id: 'ra-4', name: 'Categoria 4ª', eraId: 'ra-cat', initials: '4', period: 'Carabines i pistoles aire/gas', role: 'Armes', fact: 'Categoria especial. Llicència D o E. Per a tir o caça menor.' },
  { id: 'ra-5', name: 'Categoria 5ª', eraId: 'ra-cat', initials: '5', period: 'Armes blanques i defensa', role: 'Armes', fact: 'Armes blanques no prohibides, bastons de defensa. Llicència C per a vigilants particulars.' },
  { id: 'ra-6', name: 'Categoria 6ª', eraId: 'ra-cat', initials: '6', period: 'Armes històriques i prohibides', role: 'Armes', fact: 'Armes històriques, simulacre, electroxoc particular (prohibides excepte FCS).' },
  { id: 'ra-7', name: 'Categoria 7ª', eraId: 'ra-cat', initials: '7', period: 'Armes prohibides', role: 'CRÍTIC', fact: '⭐ Armes prohibides en general: les especialment perilloses. Catàleg específic.' },
  { id: 'ra-A', name: 'Llicència A', eraId: 'ra-llic', initials: 'A', period: 'FCS', role: 'Llicències', fact: 'Funcionaris FCS, FFAA, autoritats.' },
  { id: 'ra-B', name: 'Llicència B', eraId: 'ra-llic', initials: 'B', period: 'Pistola / revòlver', role: 'CRÍTIC PL', fact: '⭐ B1: particulars (excepcional). B2: vigilants de seguretat privada armats. Categoria 1ª.' },
  { id: 'ra-C', name: 'Llicència C', eraId: 'ra-llic', initials: 'C', period: 'Vigilants seguretat', role: 'Llicències', fact: 'Per a vigilants de seguretat privada amb arma curta (cat. 1ª).' },
  { id: 'ra-D', name: 'Llicència D', eraId: 'ra-llic', initials: 'D', period: 'Caça major', role: 'Llicències', fact: 'Per a armes de caça major (rifles ratllats).' },
  { id: 'ra-E', name: 'Llicència E', eraId: 'ra-llic', initials: 'E', period: 'Caça menor i tir', role: 'Llicències', fact: 'Per a escopetes (cat. 3ª) i carabines aire/gas (cat. 4ª).' },
  { id: 'ra-F', name: 'Llicència F', eraId: 'ra-llic', initials: 'F', period: 'Concursants tir esportiu', role: 'Llicències', fact: 'Tiradors federats. Per armes de tir esportiu.' },
  { id: 'ra-control', name: 'Intervenció Armes', eraId: 'ra-control', initials: 'IA', period: 'Guàrdia Civil', role: 'Control', fact: '⭐ Òrgan competent per a la concessió de llicències, guies i renovacions. Depèn de la Guàrdia Civil (Direcció General).' },
];
const REG_ARMES_EXAM: LleiExamItem[] = [
  { date: 'RD 137/1993', text: '29 gener · Reglament d\'Armes vigent.' },
  { date: '7 categories', text: 'Memoritzar les 7 categories d\'armes.' },
  { date: 'Llicències', text: 'A · B · C · D · E · F. Saber quina per a què.' },
  { date: 'Categoria 1ª', text: 'Pistoles i revòlvers. Llicència B (particular) o C (vigilant).' },
  { date: 'Categoria 7ª', text: 'Armes PROHIBIDES (catàleg específic).' },
  { date: 'Intervenció', text: 'Guàrdia Civil · Intervenció d\'Armes. Llicències i renovacions.' },
];
const REG_ARMES: EsquemaLlei = {
  id: 'esq-pl-regarmes', slug: 'reglament-armes', categoria: 'armes',
  kicker: 'POLICIA LOCAL · Reglament Armes', title: 'Reglament', titleHighlight: "d'Armes",
  introOneLiner: 'RD 137/1993, de 29 de gener. Regula tinença i ús d\'armes a Espanya. 7 categories d\'armes + 6 tipus de llicències. La Guàrdia Civil és l\'òrgan competent.',
  kpis: [
    { value: 'RD 137/1993', label: 'norma', mono: true },
    { value: '7', label: 'categories armes' },
    { value: '6', label: 'tipus llicències' },
    { value: 'GC', label: 'control', mono: true },
  ],
  eras: REG_ARMES_ERAS, timeline: REG_ARMES_TIMELINE, items: REG_ARMES_ITEMS, exam: REG_ARMES_EXAM,
  testSlug: 'reglamento-de-armas-esquema-policial',
  labels: { items: 'Categories i llicències', itemsTab: 'Categories' },
};

// ═══════════════════════════════════════════════════════════════
// Decret 219/1996 — Reglament armament policies locals
// Focus: ARMAMENT específic PL
// ═══════════════════════════════════════════════════════════════
const D219_ERAS: LleiEra[] = [
  { id: 'd2-norma', name: 'Norma', range: '12 juny 1996', color: '#3A3A45', soft: '#D5D5DA' },
  { id: 'd2-arma', name: 'Armes reglamentàries', range: 'PL Catalunya', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'd2-port', name: 'Port i custòdia', range: 'normes', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'd2-form', name: 'Formació i tir', range: 'requeriments', color: '#1B7A5C', soft: '#C6EBDD' },
];
const D219_TIMELINE: LleiMilestone[] = [
  { eraId: 'd2-norma', date: '12 JUN 1996', title: 'Decret 219/1996', note: 'Reglament d\'armament policies locals Catalunya.', star: true },
];
const D219_ITEMS: LleiItem[] = [
  { id: 'd2-arma-reg', name: 'Arma reglamentària', eraId: 'd2-arma', initials: 'AR', period: 'Pistola semiautomàtica 9mm', role: 'CRÍTIC PL', fact: '⭐ Pistola semiautomàtica calibre 9mm Parabellum. Categoria 1ª del Reglament d\'Armes. Marca i model designats per cada cos.' },
  { id: 'd2-municio', name: 'Munició', eraId: 'd2-arma', initials: 'MU', period: '9mm Parabellum', role: 'Armes', fact: 'Cartutxos de plom encamisat. Lliurats pel cos. Comptabilitzats individualment.' },
  { id: 'd2-defensa', name: 'Defensa reglamentària', eraId: 'd2-arma', initials: 'DR', period: 'Bastó / esprai', role: 'Armes', fact: 'Defensa rígida o extensible + esprai de defensa (CS o OC). Reglamentàries.' },
  { id: 'd2-grilletes', name: 'Manilles', eraId: 'd2-arma', initials: 'MN', period: 'Mitjà coercitiu', role: 'Operatiu', fact: 'Mitjà coercitiu reglamentari. Ús segons proporcionalitat. Sempre amb justificació.' },
  { id: 'd2-port-servei', name: 'Port en servei', eraId: 'd2-port', initials: 'PS', period: 'OBLIGATORI', role: 'CRÍTIC PL', fact: '⭐ El port d\'arma és OBLIGATORI durant el servei. Excepcions: serveis administratius o quan ho exigeixi la naturalesa del servei.' },
  { id: 'd2-port-fora', name: 'Port fora servei', eraId: 'd2-port', initials: 'PF', period: 'FACULTATIU', role: 'CRÍTIC PL', fact: '⭐ Fora de servei és FACULTATIU. L\'agent decideix. Si la porta, segueix subjecte a les normes d\'ús.' },
  { id: 'd2-custodia', name: 'Custòdia', eraId: 'd2-port', initials: 'CU', period: 'Armer cos', role: 'Custodia', fact: 'L\'arma es custodia a l\'armer del cos. Lliurament i recepció signada. Comptabilitat estricta.' },
  { id: 'd2-tir', name: 'Pràctiques de tir', eraId: 'd2-form', initials: 'TR', period: 'Mínim anual', role: 'Formació', fact: 'Pràctiques periòdiques obligatòries. Mínim establert pel cos. Apte/no apte. ISPC organitza cursos.' },
  { id: 'd2-incident', name: 'Incident amb arma', eraId: 'd2-port', initials: 'IN', period: 'Comunicació', role: 'CRÍTIC PL', fact: '⭐ Qualsevol ús (fins i tot d\'amenaça) de l\'arma de foc s\'ha de COMUNICAR IMMEDIATAMENT al cap del cos i a la Junta Local. Atestat detallat.' },
];
const D219_EXAM: LleiExamItem[] = [
  { date: 'Decret 219/1996', text: '12 juny · armament policies locals Catalunya.' },
  { date: 'Pistola 9mm', text: 'Arma reglamentària PL Catalunya. Categoria 1ª.' },
  { date: 'Port servei', text: 'OBLIGATORI durant el servei. Facultatiu fora.' },
  { date: 'Mitjans coercitius', text: 'Arma + defensa + esprai + manilles. Proporcionalitat (CO-PR).' },
  { date: 'Incident', text: 'Comunicació immediata al cap del cos i a la Junta Local.' },
  { date: 'Tir anual', text: 'Pràctiques obligatòries periòdiques.' },
];
const DECRET_219_1996: EsquemaLlei = {
  id: 'esq-pl-d219', slug: 'decret-219-1996', categoria: 'armes',
  kicker: 'POLICIA LOCAL · Decret 219/1996', title: 'Armament', titleHighlight: 'policies locals',
  introOneLiner: 'Decret 219/1996 de 12 de juny. Regula l\'armament reglamentari de les policies locals de Catalunya: pistola 9mm semiautomàtica, defensa, esprai, manilles. Port OBLIGATORI en servei, FACULTATIU fora.',
  kpis: [
    { value: 'D 219/1996', label: 'norma', mono: true },
    { value: '9 mm', label: 'calibre', mono: true },
    { value: '4', label: 'mitjans coercitius' },
    { value: 'obligatori', label: 'port servei' },
  ],
  eras: D219_ERAS, timeline: D219_TIMELINE, items: D219_ITEMS, exam: D219_EXAM,
  testSlug: 'decret-219-1996-reglament-d-armament-policies-locals-esquema-operatiu-policial',
  labels: { items: 'Armament i normes', itemsTab: 'Armament' },
};

// ═══════════════════════════════════════════════════════════════
// LRBRL Llei 7/1985 — Bases del Règim Local
// Focus: COMPETÈNCIES municipals
// ═══════════════════════════════════════════════════════════════
const LRBRL_ERAS: LleiEra[] = [
  { id: 'lr-norma', name: 'Llei 7/1985', range: '2 abril', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'lr-ents', name: 'Ents locals', range: 'art. 3', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'lr-municipi', name: 'Municipi · organització', range: 'art. 11 — 32', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'lr-comp', name: 'Competències', range: 'art. 25 — 28', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'lr-prov', name: 'Província', range: 'art. 31 — 41', color: '#5E3A8A', soft: '#E3D4F2' },
];
const LRBRL_TIMELINE: LleiMilestone[] = [
  { eraId: 'lr-norma', date: '2 ABR 1985', title: 'Llei 7/1985 · LRBRL', note: 'Llei de bases del règim local. Marc estatal.', star: true },
  { eraId: 'lr-norma', date: '2013', title: 'Reforma Llei 27/2013', note: 'Racionalització i sostenibilitat administració local.', star: true },
  { eraId: 'lr-norma', date: 'CAT', title: 'DLeg 2/2003', note: 'Text refós Llei municipal CAT (TRLMRLC) · 28 abril.', star: true },
];
const LRBRL_ITEMS: LleiItem[] = [
  { id: 'lr-3', name: 'Art. 3', eraId: 'lr-ents', initials: '3', period: 'Ents locals', role: 'CRÍTIC', fact: '⭐ Ents locals territorials: MUNICIPI · PROVÍNCIA · ILLA (Balears i Canàries). + Comarques, àrees metropolitanes, mancomunitats, entitats locals menors.' },
  { id: 'lr-11', name: 'Art. 11', eraId: 'lr-municipi', initials: '11', period: 'Municipi · definició', role: 'Municipi', fact: 'Entitat local bàsica. Comprèn: territori, població i organització.' },
  { id: 'lr-19', name: 'Art. 19', eraId: 'lr-municipi', initials: '19', period: 'Organització municipal', role: 'Municipi', fact: 'Ajuntament: alcalde + tinents alcalde + ple. Comissió Govern (executiu). Mediadors, comissions informatives.' },
  { id: 'lr-21', name: 'Art. 21', eraId: 'lr-municipi', initials: '21', period: 'Competències ALCALDE', role: 'CRÍTIC PL', fact: '⭐ Dirigir el govern i l\'administració municipal · representar l\'Ajuntament · convocar i presidir les sessions del Ple · dictar bans · dirigir, inspeccionar i impulsar serveis · gestionar i exigir tributs · ordenar publicació · sancions per infraccions ordenances · CAP SUPERIOR DEL PERSONAL · ⭐ AUTORITAT SUPREMA EN MATÈRIA DE SEGURETAT EN ÀMBIT LOCAL · ⭐ COMANDAMENT POLICIA LOCAL.' },
  { id: 'lr-22', name: 'Art. 22', eraId: 'lr-municipi', initials: '22', period: 'Competències del PLE', role: 'Municipi', fact: 'Control i fiscalització · aprovació pressupostos i ordenances · plantilla i RPT · aprovació plans urbanístics · alteració terme municipal · plans i delegacions.' },
  { id: 'lr-25', name: 'Art. 25', eraId: 'lr-comp', initials: '25', period: 'Competències pròpies', role: 'CRÍTIC PL', fact: '⭐⭐ ARTICLE CABDAL. 25.2 enumera competències pròpies: urbanisme, medi ambient, abastament i sanejament, infraestructura viària, atenció social primària, transport, cultura, esports, parcs, neteja, cementiris, salut pública, mercats, festes locals, biblioteques, comunicació, ⭐ POLICIA LOCAL · trànsit · protecció civil · prevenció extinció incendis.' },
  { id: 'lr-26', name: 'Art. 26', eraId: 'lr-comp', initials: '26', period: 'Serveis obligatoris', role: 'CRÍTIC', fact: '⭐ TOTS els municipis: enllumenat, cementiri, recollida residus, neteja viària, abastament aigua, clavegueram, accés nuclis, pavimentació, control aliments i begudes. > 5.000 hab.: parc públic, biblioteca, mercat, residus. > 20.000: ⭐ POLICIA LOCAL · protecció civil · serveis socials · extinció incendis · instal·lacions esportives. > 50.000: transport col·lectiu urbà · medi ambient urbà.' },
  { id: 'lr-141', name: 'Art. 141', eraId: 'lr-prov', initials: '141', period: 'Província', role: 'Província', fact: 'Agrupació de municipis. Govern: Diputació provincial.' },
];
const LRBRL_EXAM: LleiExamItem[] = [
  { date: 'Llei 7/1985', text: '2 abril · LRBRL. Marc estatal règim local.' },
  { date: 'TRLMRLC 2003', text: 'DLeg 2/2003 · 28 abril · text refós Llei municipal CAT.' },
  { date: 'Art. 25.2', text: '⭐ Competències pròpies del municipi · incloent POLICIA LOCAL.' },
  { date: 'Art. 26', text: 'Serveis obligatoris · POLICIA LOCAL en municipis > 20.000 hab.' },
  { date: 'Art. 21', text: '⭐ L\'alcalde és cap superior del personal i COMANDAMENT PL.' },
  { date: '> 20.000', text: 'Llindar municipi per a POLICIA LOCAL obligatòria.' },
  { date: 'Ents locals', text: 'Municipi + província + illa (territorials) + comarques + àrees metro + mancomunitats.' },
  { date: 'Reforma 2013', text: 'Llei 27/2013 racionalització i sostenibilitat administració local.' },
];
const LRBRL: EsquemaLlei = {
  id: 'esq-pl-lrbrl', slug: 'lrbrl-llei-7-1985', categoria: 'municipi',
  kicker: 'POLICIA LOCAL · LRBRL 7/1985', title: 'Bases del', titleHighlight: 'Règim Local',
  introOneLiner: 'Llei 7/1985 de 2 d\'abril. Marc estatal de l\'administració local. Art. 21 (competències alcalde - cap PL) i art. 25-26 (competències municipals incloent policia local) són els més preguntats.',
  kpis: [
    { value: 'Llei 7/1985', label: 'norma', mono: true },
    { value: '2 abril', label: 'data', mono: true },
    { value: '8', label: 'articles clau' },
    { value: '> 20.000', label: 'hab. PL obligatòria' },
  ],
  eras: LRBRL_ERAS, timeline: LRBRL_TIMELINE, items: LRBRL_ITEMS, exam: LRBRL_EXAM,
  testSlug: 'lrbrl-ley-7-1985-bases-del-regimen-local-esquema-operativo-policial',
  labels: { items: 'Articles clau', itemsTab: 'Articles' },
};

// ═══════════════════════════════════════════════════════════════
// Balises V16 (Trànsit)
// Focus: NOVA OBLIGACIÓ 2026
// ═══════════════════════════════════════════════════════════════
const V16_ERAS: LleiEra[] = [
  { id: 'v16-norma', name: 'Marc legal', range: 'RD + DGT', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'v16-tipus', name: 'Tipus V16', range: 'connectada · sense conn.', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'v16-us', name: 'Ús i col·locació', range: 'sobre vehicle', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'v16-sancio', name: 'Sancions', range: 'no portar-la', color: '#C0392B', soft: '#F4D2CE' },
];
const V16_TIMELINE: LleiMilestone[] = [
  { eraId: 'v16-norma', date: '2021', title: 'Aprovada normativa V16', note: 'Real Decreto 1030/2022 i actualitzacions DGT.' },
  { eraId: 'v16-norma', date: '1 GEN 2026', title: 'V16 CONNECTADA obligatòria', note: 'Substitueix definitivament els triangles.', star: true },
];
const V16_ITEMS: LleiItem[] = [
  { id: 'v16-que', name: 'Què és?', eraId: 'v16-tipus', initials: 'V16', period: 'Llum d\'emergència', role: 'Definició', fact: 'Llum led groga ambre amagatzemada al vehicle. SUBSTITUEIX els triangles d\'emergència. Visible 1 km, llum 360°.' },
  { id: 'v16-conn', name: 'V16 connectada', eraId: 'v16-tipus', initials: 'CO', period: 'OBLIGATÒRIA 2026', role: 'CRÍTIC PL', fact: '⭐ La que entra en vigor obligatòria l\'1 de gener 2026. Envia automàticament la posició del vehicle aturat a la DGT (servei 3.0).' },
  { id: 'v16-sense', name: 'V16 sense connexió', eraId: 'v16-tipus', initials: 'SC', period: 'Vigent fins 2025', role: 'Tipus', fact: 'La versió sense connexió només era vàlida fins al 31/12/2025. A partir de 2026 NO es pot fer servir.' },
  { id: 'v16-us', name: 'Com utilitzar-la', eraId: 'v16-us', initials: 'US', period: 'En cas d\'emergència', role: 'Operatiu', fact: 'Col·locar-la al sostre del vehicle (imant), activar-la (es queda autònomament durant 30 min mínim). NO cal sortir del cotxe.' },
  { id: 'v16-pertot', name: 'A qui afecta?', eraId: 'v16-us', initials: 'AF', period: 'Tots els turismes', role: 'Operatiu', fact: 'Tots els turismes, furgonetes, vehicles mixtos i camions. Motos i bicicletes NO obligades.' },
  { id: 'v16-triangle', name: 'Triangles', eraId: 'v16-tipus', initials: 'TR', period: 'Substitueix', role: '⚠️ CANVI CLAU', fact: '⚠️ A partir de 2026, els TRIANGLES JA NO SÓN VÀLIDS per senyalitzar. La V16 connectada els substitueix.' },
  { id: 'v16-sancio', name: 'Sanció', eraId: 'v16-sancio', initials: 'SA', period: 'Infracció lleu', role: 'CRÍTIC PL', fact: '⭐ No portar la V16 (o equivalent) NO és infracció directa, però SÍ ho és no senyalitzar correctament una incidència → multa 200€ (infracció lleu de trànsit).' },
];
const V16_EXAM: LleiExamItem[] = [
  { date: '1 gener 2026', text: '⭐ Entrada en vigor obligatòria de la V16 CONNECTADA.' },
  { date: 'Substitueix', text: 'V16 → triangles d\'emergència. A partir de 2026 NO valen.' },
  { date: 'Color', text: 'Llum led GROC AMBRE 360°.' },
  { date: '1 km visibilitat', text: 'Distància mínima a què s\'ha de veure.' },
  { date: 'V16 connectada', text: 'Envia ubicació en temps real a la DGT (servei 3.0).' },
  { date: 'Sense connexió', text: 'Versió antiga, NO vàlida des de 2026.' },
];
const BALISES_V16: EsquemaLlei = {
  id: 'esq-pl-v16', slug: 'balises-v16', categoria: 'transit',
  kicker: 'POLICIA LOCAL · Balises V16', title: 'Balises', titleHighlight: 'V16',
  introOneLiner: 'Llum d\'emergència LED groc ambre que substitueix els triangles d\'emergència. A partir de l\'1 de gener 2026 és obligatòria la versió CONNECTADA (envia ubicació a la DGT 3.0).',
  kpis: [
    { value: '1 gen 2026', label: 'obligatòria', mono: true },
    { value: 'V16', label: 'denominació', mono: true },
    { value: '1 km', label: 'visibilitat' },
    { value: '7', label: 'aspectes clau' },
  ],
  eras: V16_ERAS, timeline: V16_TIMELINE, items: V16_ITEMS, exam: V16_EXAM,
  testSlug: 'balizas-v16',
  labels: { items: 'Aspectes clau', itemsTab: 'Aspectes' },
};

// ═══════════════════════════════════════════════════════════════
// VMP — Vehicles de Mobilitat Personal
// Focus: REGULACIÓ trànsit VMP + Comunicat 6/2026 SCT
// (Inclou les 5 noves infraccions i la distinció VMP/VPL)
// ═══════════════════════════════════════════════════════════════
const VMP_ERAS: LleiEra[] = [
  { id: 'vmp-norma', name: 'Marc legal', range: 'DGT 2020+', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'vmp-def', name: 'Definició i tipus', range: 'patinets · monocicles', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'vmp-circul', name: 'Circulació · vies', range: 'on poden anar', color: '#1B7A5C', soft: '#C6EBDD' },
  { id: 'vmp-infraccions', name: 'Infraccions trànsit', range: 'sancions', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'vmp-registre', name: 'Registre VPL · RD 52/2026', range: 'NOU 2026', color: '#9747D6', soft: '#F5E9FF' },
  { id: 'vmp-noves', name: '5 noves infraccions', range: 'Com. 6/2026', color: '#C0392B', soft: '#F4D2CE' },
];
const VMP_TIMELINE: LleiMilestone[] = [
  { eraId: 'vmp-norma', date: '10 NOV 2020', title: 'RD 970/2020 · marc VMP', note: 'Inclou els VMP al RGC per primera vegada. Requereix certificat de circulació i identificació.', star: true },
  { eraId: 'vmp-norma', date: '22 GEN 2024', title: 'Final del període transitori VMP', note: 'A partir d\'aquesta data tots els VMP comercialitzats necessiten certificat.' },
  { eraId: 'vmp-norma', date: '24 JUL 2025', title: 'Llei 5/2025 DA 1a', note: 'Modifica la Llei RC i assegurança. Introdueix l\'obligació d\'assegurar els VPL.', star: true },
  { eraId: 'vmp-registre', date: '28 GEN 2026', title: 'RD 52/2026 · Registre VPL', note: 'Modifica el RGV i el RD 2822/1998 per regular el Registre Nacional de VPL.', star: true },
  { eraId: 'vmp-registre', date: '30 GEN 2026', title: 'Entrada en vigor RD 52/2026', star: true },
  { eraId: 'vmp-infraccions', date: '2026', title: 'Comunicats 3/2026 i 4/2026', note: 'Donen d\'alta al catàleg la infracció per circular sense AOV.' },
  { eraId: 'vmp-noves', date: '15 MAI 2026', title: 'Signatura Comunicat 6/2026', note: 'Director Ramon Lamiel · Servei Català de Trànsit.' },
  { eraId: 'vmp-noves', date: '18 MAI 2026', title: 'Vigor Comunicat 6/2026 · 5 noves infraccions', note: 'Afegides al catàleg del SCT.', star: true, itemId: 'vmp-c6-resum' },
  { eraId: 'vmp-registre', date: '22 GEN 2027', title: 'Final règim transitori VMP no certificats', note: 'A partir d\'aquí els VMP amb etiqueta Z ja no podran circular.', star: true },
];
const VMP_ITEMS: LleiItem[] = [
  { id: 'vmp-def', name: 'Definició VMP', eraId: 'vmp-def', initials: 'DF', period: 'RD 970/2020', role: 'Definició', fact: 'Vehicles d\'1 o més rodes, dotats d\'una sola plaça i propulsats EXCLUSIVAMENT per motors elèctrics. Velocitat màxima per disseny: 6 — 25 km/h.' },
  { id: 'vmp-no-veh', name: 'NO són VMP', eraId: 'vmp-def', initials: 'NO', period: 'Exclusions', role: 'CRÍTIC PL', fact: '⭐ NO són VMP: vehicles per persones amb mobilitat reduïda, ciclomotors, motocicletes, bicicletes (assistides o no), joguets (< 6 km/h).' },
  { id: 'vmp-vs-vpl', name: 'VMP ≠ VPL', eraId: 'vmp-registre', initials: 'V/V', period: 'Distinció crítica', role: '⭐⭐⭐ NOU 2026', fact: '⭐⭐⭐ VMP "vehicle a motor" (segons MOM al RNV) → SEMPRE necessita AOV · sanció 800 € sense. VPL = Vehicle Personal Lleuger certificat I inscrit → necessita AOV · sanció 300 € (150 € reducció). NO confondre.' },
  { id: 'vmp-rnv', name: 'Registre Nacional', eraId: 'vmp-registre', initials: 'RNV', period: 'RD 52/2026', role: '⭐ NOU 2026', fact: '⭐ Registre Nacional de Vehicles Personals Lleugers · OBLIGATORI inscriure-hi tots els VMP. Sense inscripció no es pot exigir l\'AOV. NO inscriure = infracció lleu de 100 €.' },
  { id: 'vmp-m-z', name: 'Etiqueta M vs Z', eraId: 'vmp-registre', initials: 'M/Z', period: 'Identificació', role: '⭐ NOU 2026', fact: '⭐ M = certificat (comercialitzat des del 22/01/2024, sense caducitat) · Z = no certificat (anterior 22/01/2024, RÈGIM TRANSITORI fins al 22/01/2027). Mnemotècnia: M de Modern · Z de Zona transitòria.' },
  { id: 'vmp-edat', name: 'Edat mínima', eraId: 'vmp-circul', initials: '16', period: '16 anys a CAT', role: 'CRÍTIC PL', fact: '⭐ No hi ha edat estatal. Catalunya: 16 anys mínim per circular. Moltes ordenances municipals també 15-16.' },
  { id: 'vmp-vies', name: 'On poden circular', eraId: 'vmp-circul', initials: 'VI', period: 'Carrils bici · zones 30', role: 'CRÍTIC PL', fact: '⭐ Carrils bici (preferent) · zones 30 · vies amb límit ≤ 30 km/h · NO autopistes/autovies · NO voreres ni espais peatonals (excepte ordenances específiques).' },
  { id: 'vmp-casc', name: 'Casc', eraId: 'vmp-circul', initials: 'CA', period: 'Variable', role: 'Equipament', fact: 'No obligatori a estatal. ⚠️ Sí obligatori per ordenança a Barcelona i moltes ciutats. Comprovar normativa local.' },
  { id: 'vmp-alcohol', name: 'Alcoholèmia', eraId: 'vmp-infraccions', initials: 'AL', period: 'Sí s\'aplica', role: 'CRÍTIC PL', fact: '⭐⭐ Sí s\'aplica la normativa d\'alcoholèmia. Conductor VMP = conductor a efectes de trànsit. Taxa: 0,5 g/L sang o 0,15 mg/L aire. Drogues: tolerància zero.' },
  { id: 'vmp-mobil', name: 'Telèfon · auriculars', eraId: 'vmp-infraccions', initials: 'MO', period: 'PROHIBIT', role: 'Infraccions', fact: '⭐ Prohibit conduir VMP amb auriculars o utilitzant el mòbil sense sistema mans lliures. Infracció greu: 200 € + 3 punts (si tenen carnet).' },
  { id: 'vmp-passatgers', name: 'Passatgers', eraId: 'vmp-infraccions', initials: 'PS', period: 'PROHIBIT', role: 'Infraccions', fact: 'NO es pot portar passatgers ni càrrega no autoritzada. Una plaça → un conductor.' },
  { id: 'vmp-c6-resum', name: 'Com. 6/2026 · 5 infraccions', eraId: 'vmp-noves', initials: '5', period: '18/05/2026', role: '⭐ NOU CATÀLEG SCT', fact: '⭐⭐ Comunicat 6/2026 afegeix 5 noves opcions normatives al catàleg SCT (totes amb base art. 22 RGV). Vigor 18/05/2026.' },
  { id: 'vmp-c6-i1', name: 'Sense etiqueta o placa', eraId: 'vmp-noves', initials: '1', period: '🟢 LLEU', role: 'Sanció 80 €', fact: 'No disposar i exhibir en un VMP l\'etiqueta identificativa o la placa de marcatge del fabricant. 80 € (40 € amb 50% descompte).' },
  { id: 'vmp-c6-i2', name: 'No inscrit al RNV', eraId: 'vmp-noves', initials: '2', period: '🟢 LLEU', role: 'Sanció 100 €', fact: 'No inscriure el VMP al Registre Nacional de Vehicles. 100 € (50 € descompte). Imprescindible per donar compliment a la DA 1a Llei 5/2025.' },
  { id: 'vmp-c6-i3', name: 'Annex XXI greu seg.', eraId: 'vmp-noves', initials: '3', period: '🔴 MOLT GREU', role: '⭐ Sanció 500 €', fact: '⭐ L\'única MOLT GREU de les noves. Manipulació del control de velocitat, modificació estructural… afectació greu seguretat viària. 500 € (250 € descompte).' },
  { id: 'vmp-c6-i4', name: 'Annex XXI il·luminació', eraId: 'vmp-noves', initials: '4', period: '🟠 GREU', role: 'Sanció 200 €', fact: 'No funciona el sistema d\'il·luminació, rodes, etc. 200 € (100 € descompte).' },
  { id: 'vmp-c6-i5', name: 'Annex XXI menors', eraId: 'vmp-noves', initials: '5', period: '🟢 LLEU', role: 'Sanció 80 €', fact: 'Dispositiu sonor, cavallet, etc. 80 € (40 € descompte).' },
  { id: 'vmp-aov-800', name: 'AOV · VMP a motor', eraId: 'vmp-infraccions', initials: '800', period: 'MOLT GREU', role: '⭐ CRÍTIC PL', fact: '⭐ Sanció 800 € · circular amb VMP "considerat vehicle a motor" sense AOV. Sempre obligat (art. 2.1 Llei RC i assegurança).' },
  { id: 'vmp-aov-300', name: 'AOV · VPL', eraId: 'vmp-infraccions', initials: '300', period: 'MOLT GREU', role: '⭐ Modificat 2026', fact: '⭐ Sanció 300 € (150 € reducció) · circular amb VPL certificat i inscrit sense AOV. ⚠️ La sanció era 350 € — modificada el 2026 per alinear-se amb la DGT.' },
  { id: 'vmp-menors', name: 'Menors (art. 82 LSV)', eraId: 'vmp-noves', initials: 'MN', period: 'Solidaritat', role: 'CRÍTIC PL', fact: '⭐ Si el responsable és menor d\'edat, els pares, tutors, acollidors i guardadors legals o de fet responen SOLIDÀRIAMENT de la multa. Fer constar les seves dades a la butlleta.' },
  { id: 'vmp-pes', name: 'Pes a butlleta', eraId: 'vmp-noves', initials: 'P', period: 'VMP no inscrit', role: 'Operatiu', fact: '⭐ Si el VMP NO està inscrit al RNV, l\'agent ha d\'indicar OBLIGATÒRIAMENT el pes (MOM) a la butlleta. El pes permet determinar si és VMP a motor (800 €) o VPL (300 €).' },
  { id: 'vmp-concurrencia', name: 'Concurrència infraccions', eraId: 'vmp-noves', initials: 'CO', period: 'NO alhora', role: 'Operatiu', fact: '⚠️ NO s\'han de tramitar denúncies alhora per: (a) "no tenir certificat" + "no estar inscrit" als VMP des 22/01/2024 · (b) "sense placa" si no té certificat, o "sense etiqueta" si no està inscrit.' },
];
const VMP_EXAM: LleiExamItem[] = [
  { date: 'RD 970/2020', text: 'Reforma del RGC que regula els VMP per primera vegada.' },
  { date: '⭐ RD 52/2026', text: 'NOU 2026. Regula el Registre Nacional de Vehicles Personals Lleugers (VPL). Vigor 30/01/2026.' },
  { date: '⭐ Com. 6/2026 SCT', text: 'NOU 2026. 5 noves infraccions al catàleg + modificació imp. AOV VPL. Vigor 18/05/2026.' },
  { date: 'VMP a motor vs VPL', text: '⭐⭐ Distinció CRÍTICA. Sense AOV: VMP a motor = 800 € · VPL = 300 € (150 € reducció).' },
  { date: 'Etiqueta M vs Z', text: '⭐ M = certificat (des 22/01/2024, sense caducitat) · Z = règim transitori (fins 22/01/2027).' },
  { date: 'Art. 22 RGV', text: '⭐ Base normativa de TOTES les 5 noves infraccions del Com. 6/2026.' },
  { date: 'Infracció #3', text: '⭐ L\'única MOLT GREU de les noves (500 €) · manipulació velocitat/modificació estructural.' },
  { date: 'No inscrit RNV', text: 'Cal indicar el PES (MOM) a la butlleta · permet diferenciar VMP a motor de VPL.' },
  { date: 'Menors art. 82 LSV', text: 'Pares/tutors responen SOLIDÀRIAMENT de la multa. Fer constar les seves dades.' },
  { date: 'Concurrència', text: 'NO denunciar alhora "sense certificat + no inscrit" ni "sense placa + no certificat".' },
  { date: '6 — 25 km/h', text: 'Velocitat màxima per disseny dels VMP.' },
  { date: '16 anys', text: 'Edat mínima a Catalunya per conduir VMP.' },
  { date: 'Alcoholèmia', text: 'S\'aplica al conductor VMP igual que un altre vehicle. Taxa: 0,5 g/L o 0,15 mg/L.' },
];
const VMP: EsquemaLlei = {
  id: 'esq-pl-vmp', slug: 'vmp', categoria: 'transit',
  kicker: 'POLICIA LOCAL · VMP / VPL', title: 'VMP', titleHighlight: 'i VPL',
  introOneLiner: 'Vehicles de Mobilitat Personal (patinets elèctrics) i Vehicles Personals Lleugers. Marc legal complet: RD 970/2020, Llei 5/2025 DA 1a, RD 52/2026 (Registre Nacional) i Comunicat 6/2026 SCT amb 5 noves infraccions.',
  kpis: [
    { value: 'RD 52/2026', label: 'Registre VPL', mono: true },
    { value: 'Com. 6/2026', label: 'SCT vigent', mono: true },
    { value: '5 noves', label: 'infraccions' },
    { value: '800 € / 300 €', label: 'AOV VMP / VPL', mono: true },
    { value: 'M / Z', label: 'etiqueta cert.', mono: true },
  ],
  eras: VMP_ERAS, timeline: VMP_TIMELINE, items: VMP_ITEMS, exam: VMP_EXAM,
  testSlug: 'vmp-esquema-operativo-policial',
  labels: { items: 'Conceptes i infraccions', itemsTab: 'Conceptes' },
};

// ─── Registre d'esquemes de PL disponibles ─────────────────────
const ESQUEMAS_PL: Record<string, EsquemaLlei> = {
  [CE_1978.slug]: CE_1978,
  [EAC_2006.slug]: EAC_2006,
  [CODI_PENAL.slug]: CODI_PENAL,
  [LO_1_2026.slug]: LO_1_2026,
  [LECRIM.slug]: LECRIM,
  [LO_5_2000.slug]: LO_5_2000,
  [LO_4_2015.slug]: LO_4_2015,
  [LO_2_1986.slug]: LO_2_1986,
  [LLEI_4_2003.slug]: LLEI_4_2003,
  [LLEI_16_1991.slug]: LLEI_16_1991,
  [CODI_ETICA.slug]: CODI_ETICA,
  [REG_ARMES.slug]: REG_ARMES,
  [DECRET_219_1996.slug]: DECRET_219_1996,
  [LRBRL.slug]: LRBRL,
  [BALISES_V16.slug]: BALISES_V16,
  [VMP.slug]: VMP,
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
