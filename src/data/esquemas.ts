// ─────────────────────────────────────────────────────────────────
// Esquemes ràpids · format visual alternatiu al Temari clàssic.
//
// Per a cada tema (començant per A.1 Mossos · Història) oferim una
// pàgina amb 4 seccions: Resum amb etapes, Línia temporal, Personatges
// i Per a l'examen. L'objectiu és que l'opositor pugui repassar
// visualment en 5 minuts un tema gros.
//
// Aquesta estructura és mirror de `infopolapp/src/data/esquemas.ts`
// (mòbil). Mantenir-les sincronitzades quan s'afegeixen temes nous.
// ─────────────────────────────────────────────────────────────────

export type Era = {
  id: string;
  name: string;
  range: string;
  color: string;
  soft: string;
};

export type Milestone = {
  eraId: string;
  date: string;
  title: string;
  note?: string;
  star?: boolean;
  personId?: string;
};

export type EsquemaPerson = {
  id: string;
  name: string;
  eraId: string;
  period: string;
  role: string;
  fact: string;
  initials: string;
  icon: 'crown' | 'sword' | 'scroll' | 'flag';
};

export type ExamItem = {
  date: string;
  text: string;
};

export type Esquema = {
  id: string;
  /** Slug del tema del temari amb el que s'enllaça (per accedir-hi des de MossosTemariTema). */
  temaSlug: string;
  ambit: 'A' | 'B' | 'C';
  kicker: string;
  title: string;
  titleHighlight?: string;
  introOneLiner: string;
  kpis: { value: string; label: string; mono?: boolean }[];
  eras: Era[];
  timeline: Milestone[];
  people: EsquemaPerson[];
  exam: ExamItem[];
  testHref?: string;
};

// ═══════════════════════════════════════════════════════════════
// A.1 — Història de Catalunya (Part I)
// ═══════════════════════════════════════════════════════════════
const A1_ERAS: Era[] = [
  { id: 'antiguitat', name: 'Antiguitat', range: '— 218 a.C.', color: '#B89060', soft: '#F3E8D6' },
  { id: 'romana', name: 'Catalunya romana', range: '218 a.C. — s. V', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'visigotic', name: 'Visigots / musulmans', range: 's. V — 720', color: '#6B7C3B', soft: '#E8EDD4' },
  { id: 'carolingia', name: 'Naixement (carolingis)', range: '720 — 988', color: '#C56A2C', soft: '#F8DEC4' },
  { id: 'feudal', name: 'Catalunya feudal', range: 's. XI — XIII', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'aragonesa', name: 'Expansió cat·aragonesa', range: 's. XIII — XIV', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'crisi', name: 'Crisi · baixa edat', range: 's. XIV — XV', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'habsburg', name: 'Monarquia hispànica', range: 's. XVI — XVII', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'borbo', name: 'Successió i s. XVIII', range: 's. XVIII', color: '#C0392B', soft: '#F4D2CE' },
];

const A1_TIMELINE: Milestone[] = [
  { eraId: 'antiguitat', date: '~ 450.000 anys', title: 'Home de Talteüll', note: 'Restes humanes més antigues a Catalunya.' },
  { eraId: 'antiguitat', date: '~ 70.000 anys', title: 'Mandíbula de Banyoles' },
  { eraId: 'romana', date: '218 a.C.', title: 'Arriben els Escipió a Empúries', note: 'Inici de la romanització.', star: true },
  { eraId: 'romana', date: 's. I — III', title: 'Tàrraco capital de la Hispania Citerior', note: 'Fòrum, termes, amfiteatre, circ.' },
  { eraId: 'visigotic', date: 's. V — VIII', title: 'Regne visigot · capital Toledo', note: 'Catolicisme convertit (s. VI).' },
  { eraId: 'visigotic', date: '711', title: 'Invasió musulmana derrota els visigots' },
  { eraId: 'visigotic', date: 'cap al 720', title: 'Ocupació de la Catalunya Vella' },
  { eraId: 'carolingia', date: '732', title: 'Batalla de Poitiers', note: "Carles Martell atura l'avanç musulmà." },
  { eraId: 'carolingia', date: '785', title: 'Carlemany pren Girona', note: 'Inici de la Marca Hispànica.', star: true },
  { eraId: 'carolingia', date: '801', title: 'Conquesta de Barcelona' },
  { eraId: 'carolingia', date: '878', title: 'Guifré el Pilós unifica comtats centrals', star: true, personId: 'guifre' },
  { eraId: 'carolingia', date: '988', title: 'Borrell II · independència de fet', note: 'No renova el vassallatge al rei franc.', star: true, personId: 'borrell' },
  { eraId: 'feudal', date: '1137', title: "Ramon Berenguer IV + Peronella d'Aragó", note: 'Naix la Confederació Catalanoaragonesa.', star: true, personId: 'rbiv' },
  { eraId: 'feudal', date: '1213', title: 'Batalla de Muret', note: 'Mor Pere I el Catòlic combatent els croats.', personId: 'perecatolic' },
  { eraId: 'aragonesa', date: '1229', title: 'Conquesta de Mallorca · Jaume I', personId: 'jaume1' },
  { eraId: 'aragonesa', date: '1238', title: 'Conquesta de València · Jaume I', star: true, personId: 'jaume1' },
  { eraId: 'aragonesa', date: '1282', title: 'Vespres Sicilianes · Sicília a la Corona' },
  { eraId: 'crisi', date: '1348', title: 'La pesta negra', note: 'Mor 1/3 — 1/2 de la població.', star: true },
  { eraId: 'crisi', date: '1412', title: 'Compromís de Casp', note: "Ferran d'Antequera, primer Trastàmara.", personId: 'ferrantequera' },
  { eraId: 'crisi', date: '1462 — 72', title: 'Guerra civil catalana' },
  { eraId: 'habsburg', date: '1640', title: 'Esclat de la Guerra dels Segadors', note: 'Corpus de Sang.', star: true, personId: 'pauclaris' },
  { eraId: 'habsburg', date: '1659', title: 'Tractat dels Pirineus', note: 'Pèrdua de Rosselló, Conflent, Vallespir.', star: true },
  { eraId: 'borbo', date: '1701', title: 'Felip V (Borbó) entra a Madrid' },
  { eraId: 'borbo', date: '1705', title: 'Pacte de Gènova', note: "Catalunya dona suport a Carles d'Àustria." },
  { eraId: 'borbo', date: '11 SET 1714', title: 'Caiguda de Barcelona', note: 'Onze de Setembre · Diada nacional.', star: true, personId: 'casanova' },
  { eraId: 'borbo', date: '1716', title: 'Decret de Nova Planta', note: 'Fi de les institucions catalanes.', star: true, personId: 'felipv' },
];

const A1_PEOPLE: EsquemaPerson[] = [
  { id: 'guifre', name: 'Guifré el Pilós', eraId: 'carolingia', period: '~840 — 897',
    role: 'Comte de Barcelona', initials: 'GP', icon: 'crown',
    fact: '"Pare de la nació" — unifica els comtats centrals i fa el càrrec hereditari.' },
  { id: 'borrell', name: 'Borrell II', eraId: 'carolingia', period: '~927 — 992',
    role: 'Comte de Barcelona', initials: 'BII', icon: 'crown',
    fact: 'El 988 deixa de renovar el vassallatge al rei franc — independència de fet.' },
  { id: 'rbiv', name: 'Ramon Berenguer IV', eraId: 'feudal', period: '~1113 — 1162',
    role: 'Comte de Barcelona', initials: 'RB', icon: 'crown',
    fact: "Es promet amb Peronella d'Aragó (1137) i crea la Confederació Catalanoaragonesa." },
  { id: 'perecatolic', name: 'Pere I el Catòlic', eraId: 'feudal', period: '1178 — 1213',
    role: "Rei d'Aragó · comte de BCN", initials: 'PI', icon: 'sword',
    fact: 'Mor a Muret defensant els occitans dels croats francesos.' },
  { id: 'jaume1', name: 'Jaume I el Conqueridor', eraId: 'aragonesa', period: '1208 — 1276',
    role: "Rei d'Aragó · comte de BCN", initials: 'JI', icon: 'crown',
    fact: "Conquesta Mallorca (1229) i València (1238). Inici de l'expansió mediterrània." },
  { id: 'ferrantequera', name: "Ferran d'Antequera", eraId: 'crisi', period: '1380 — 1416',
    role: 'Primer rei Trastàmara', initials: 'FA', icon: 'crown',
    fact: 'Elegit al Compromís de Casp (1412) — final de la nissaga catalana.' },
  { id: 'pauclaris', name: 'Pau Claris', eraId: 'habsburg', period: '1586 — 1641',
    role: 'President de la Generalitat', initials: 'PC', icon: 'scroll',
    fact: 'Proclama la República Catalana (1641) sota protecció francesa.' },
  { id: 'casanova', name: 'Rafael Casanova', eraId: 'borbo', period: '1660 — 1743',
    role: 'Conseller en cap de BCN', initials: 'RC', icon: 'flag',
    fact: "Símbol de la defensa de Barcelona l'11 de setembre de 1714." },
  { id: 'felipv', name: 'Felip V de Borbó', eraId: 'borbo', period: '1683 — 1746',
    role: "Rei d'Espanya", initials: 'FV', icon: 'crown',
    fact: 'Imposa el Decret de Nova Planta (1716): aboleix les institucions pròpies.' },
];

const A1_EXAM: ExamItem[] = [
  { date: '218 a.C.', text: 'Arribada dels romans a Empúries — inici de la romanització.' },
  { date: '1137', text: "Berenguer IV es promet amb Peronella d'Aragó · neix la Confederació." },
  { date: '1212', text: "Las Navas de Tolosa — punt d'inflexió contra l'Al-Àndalus." },
  { date: '1412', text: 'Compromís de Casp · final de la nissaga catalana · Trastàmara.' },
  { date: '1640', text: 'Corpus de Sang i Guerra dels Segadors.' },
  { date: '1713', text: "Tractat d'Utrecht — Catalunya queda sola." },
  { date: '1714', text: '11 de setembre · caiguda de Barcelona.' },
  { date: '1716', text: 'Decret de Nova Planta · final de les institucions pròpies.' },
];

const ESQUEMA_A1: Esquema = {
  id: 'esq-mos-a1',
  temaSlug: 'a1-historia-de-catalunya-part-i',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.1',
  title: 'Història de Catalunya',
  titleHighlight: '(Part I)',
  introOneLiner:
    "De la prehistòria al Decret de Nova Planta: cobreix l'època romana, el naixement a la Marca Hispànica, la monarquia hispànica, la Guerra dels Segadors i la Guerra de Successió — amb la pèrdua de les institucions catalanes el 1714.",
  kpis: [
    { value: '450k', label: 'anys de presència humana' },
    { value: '9', label: 'etapes' },
    { value: '26', label: 'dates clau' },
    { value: '9', label: 'personatges' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A1_ERAS,
  timeline: A1_TIMELINE,
  people: A1_PEOPLE,
  exam: A1_EXAM,
  testHref: '/mossos/a1-historia-de-catalunya-part-i',
};

// ─── Registre d'esquemes disponibles ───────────────────────────
const ESQUEMAS: Record<string, Esquema> = {
  [ESQUEMA_A1.id]: ESQUEMA_A1,
};

export function getEsquema(id: string): Esquema | undefined {
  return ESQUEMAS[id];
}

/** Llista tots els esquemes disponibles. */
export function listEsquemas(): Esquema[] {
  return Object.values(ESQUEMAS);
}

/** Troba un esquema pel slug del tema associat (per oferir-lo des de MossosTemariTema). */
export function getEsquemaForTemaSlug(slug: string): Esquema | undefined {
  return listEsquemas().find((e) => e.temaSlug === slug);
}
