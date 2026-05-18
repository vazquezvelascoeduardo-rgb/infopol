// ─────────────────────────────────────────────────────────────────
// Esquemes ràpids · format visual alternatiu al Temari clàssic.
//
// Per a cada tema oferim una pàgina amb 4 seccions:
//   1. Resum amb etapes/blocs
//   2. Línia temporal (o "dades clau" en temes no històrics)
//   3. Personatges (o "elements/conceptes clau")
//   4. Per a l'examen
//
// L'objectiu és que l'opositor pugui repassar visualment en 5 minuts
// un tema gros abans d'un test.
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
  /** Etiquetes personalitzables per a temes no històrics (ex: "Blocs" en lloc de "Etapes"). */
  labels?: {
    eras?: string;
    timeline?: string;
    people?: string;
  };
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
  { eraId: 'carolingia', date: '878', title: 'Guifré el Pilós unifica comtats centrals', star: true, personId: 'a1-guifre' },
  { eraId: 'carolingia', date: '988', title: 'Borrell II · independència de fet', note: 'No renova el vassallatge al rei franc.', star: true, personId: 'a1-borrell' },
  { eraId: 'feudal', date: '1137', title: "Ramon Berenguer IV + Peronella d'Aragó", note: 'Naix la Confederació Catalanoaragonesa.', star: true, personId: 'a1-rbiv' },
  { eraId: 'feudal', date: '1213', title: 'Batalla de Muret', note: 'Mor Pere I el Catòlic combatent els croats.', personId: 'a1-perecatolic' },
  { eraId: 'aragonesa', date: '1229', title: 'Conquesta de Mallorca · Jaume I', personId: 'a1-jaume1' },
  { eraId: 'aragonesa', date: '1238', title: 'Conquesta de València · Jaume I', star: true, personId: 'a1-jaume1' },
  { eraId: 'aragonesa', date: '1282', title: 'Vespres Sicilianes · Sicília a la Corona' },
  { eraId: 'crisi', date: '1348', title: 'La pesta negra', note: 'Mor 1/3 — 1/2 de la població.', star: true },
  { eraId: 'crisi', date: '1412', title: 'Compromís de Casp', note: "Ferran d'Antequera, primer Trastàmara.", personId: 'a1-ferrantequera' },
  { eraId: 'crisi', date: '1462 — 72', title: 'Guerra civil catalana' },
  { eraId: 'habsburg', date: '1640', title: 'Esclat de la Guerra dels Segadors', note: 'Corpus de Sang.', star: true, personId: 'a1-pauclaris' },
  { eraId: 'habsburg', date: '1659', title: 'Tractat dels Pirineus', note: 'Pèrdua de Rosselló, Conflent, Vallespir.', star: true },
  { eraId: 'borbo', date: '1701', title: 'Felip V (Borbó) entra a Madrid' },
  { eraId: 'borbo', date: '1705', title: 'Pacte de Gènova', note: "Catalunya dona suport a Carles d'Àustria." },
  { eraId: 'borbo', date: '11 SET 1714', title: 'Caiguda de Barcelona', note: 'Onze de Setembre · Diada nacional.', star: true, personId: 'a1-casanova' },
  { eraId: 'borbo', date: '1716', title: 'Decret de Nova Planta', note: 'Fi de les institucions catalanes.', star: true, personId: 'a1-felipv' },
];

const A1_PEOPLE: EsquemaPerson[] = [
  { id: 'a1-guifre', name: 'Guifré el Pilós', eraId: 'carolingia', period: '~840 — 897', role: 'Comte de Barcelona', initials: 'GP', icon: 'crown', fact: '"Pare de la nació" — unifica els comtats centrals i fa el càrrec hereditari.' },
  { id: 'a1-borrell', name: 'Borrell II', eraId: 'carolingia', period: '~927 — 992', role: 'Comte de Barcelona', initials: 'BII', icon: 'crown', fact: 'El 988 deixa de renovar el vassallatge al rei franc — independència de fet.' },
  { id: 'a1-rbiv', name: 'Ramon Berenguer IV', eraId: 'feudal', period: '~1113 — 1162', role: 'Comte de Barcelona', initials: 'RB', icon: 'crown', fact: "Es promet amb Peronella d'Aragó (1137) i crea la Confederació Catalanoaragonesa." },
  { id: 'a1-perecatolic', name: 'Pere I el Catòlic', eraId: 'feudal', period: '1178 — 1213', role: "Rei d'Aragó · comte de BCN", initials: 'PI', icon: 'sword', fact: 'Mor a Muret defensant els occitans dels croats francesos.' },
  { id: 'a1-jaume1', name: 'Jaume I el Conqueridor', eraId: 'aragonesa', period: '1208 — 1276', role: "Rei d'Aragó · comte de BCN", initials: 'JI', icon: 'crown', fact: "Conquesta Mallorca (1229) i València (1238). Inici de l'expansió mediterrània." },
  { id: 'a1-ferrantequera', name: "Ferran d'Antequera", eraId: 'crisi', period: '1380 — 1416', role: 'Primer rei Trastàmara', initials: 'FA', icon: 'crown', fact: 'Elegit al Compromís de Casp (1412) — final de la nissaga catalana.' },
  { id: 'a1-pauclaris', name: 'Pau Claris', eraId: 'habsburg', period: '1586 — 1641', role: 'President de la Generalitat', initials: 'PC', icon: 'scroll', fact: 'Proclama la República Catalana (1641) sota protecció francesa.' },
  { id: 'a1-casanova', name: 'Rafael Casanova', eraId: 'borbo', period: '1660 — 1743', role: 'Conseller en cap de BCN', initials: 'RC', icon: 'flag', fact: "Símbol de la defensa de Barcelona l'11 de setembre de 1714." },
  { id: 'a1-felipv', name: 'Felip V de Borbó', eraId: 'borbo', period: '1683 — 1746', role: "Rei d'Espanya", initials: 'FV', icon: 'crown', fact: 'Imposa el Decret de Nova Planta (1716): aboleix les institucions pròpies.' },
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
  introOneLiner: "De la prehistòria al Decret de Nova Planta: cobreix l'època romana, el naixement a la Marca Hispànica, la monarquia hispànica, la Guerra dels Segadors i la Guerra de Successió — amb la pèrdua de les institucions catalanes el 1714.",
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

// ═══════════════════════════════════════════════════════════════
// A.2 — Història de Catalunya (Part II)
// ═══════════════════════════════════════════════════════════════
const A2_ERAS: Era[] = [
  { id: 'xix', name: 'Crisi Antic Règim', range: '1789 — 1874', color: '#B89060', soft: '#F3E8D6' },
  { id: 'industrial', name: 'Industrialització · obrerisme', range: 's. XIX', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'restauracio', name: 'Restauració · catalanisme', range: '1874 — 1898', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'primerterc', name: 'Primer terç s. XX', range: '1898 — 1931', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'republica', name: 'República i Guerra Civil', range: '1931 — 1939', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'franquisme', name: 'Franquisme', range: '1939 — 1975', color: '#3A3A45', soft: '#D5D5DA' },
  { id: 'transicio', name: 'Transició · autogovern', range: '1975 — 2000', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'xxi', name: 'Segle XXI', range: '2000 — actualitat', color: '#A4476E', soft: '#F4D8E4' },
];

const A2_TIMELINE: Milestone[] = [
  { eraId: 'xix', date: '1789', title: 'Revolució Francesa', note: "Trenca l'Antic Règim. Conseqüències directes a Catalunya." },
  { eraId: 'xix', date: '1793 — 95', title: 'Guerra Gran', note: 'Tropes franceses contra la monarquia espanyola.' },
  { eraId: 'xix', date: '1808 — 14', title: 'Guerra del Francès', note: 'Ocupació napoleònica + aixecament popular. Setge de Girona.' },
  { eraId: 'xix', date: '1812', title: 'Constitució de Cadis', note: 'Primera Constitució liberal espanyola. Hi participa Antoni de Capmany.', star: true },
  { eraId: 'xix', date: '1820 — 23', title: 'Trienni Liberal', note: 'Pronunciament del coronel Riego. Primera desamortització.' },
  { eraId: 'xix', date: '1833 — 40', title: 'Primera Guerra Carlina', note: 'Maria Cristina+Isabel vs Carles. Suport carlí: pagesia.', star: true },
  { eraId: 'industrial', date: '1833', title: 'Fàbrica Bonaplata', note: 'Primera moguda per vapor a Barcelona. Cremada per ludistes.', star: true },
  { eraId: 'industrial', date: '1848', title: 'Tren Barcelona–Mataró', note: "Primera línia ferroviària d'Espanya.", star: true },
  { eraId: 'xix', date: '1868', title: 'Sexenni Revolucionari', note: 'Insurrecció del general Prim. Isabel II marxa.', personId: 'a2-prim' },
  { eraId: 'xix', date: '1873 — 74', title: 'Primera República', note: 'Francesc Pi i Margall (català, federal) president.', personId: 'a2-pimargall' },
  { eraId: 'industrial', date: '1870', title: 'Primer Congrés Obrer (BCN)', note: 'I Internacional. Triomf de tesis bakuninistes.' },
  { eraId: 'industrial', date: '1879', title: 'Fundació del PSOE', note: 'Pablo Iglesias (Madrid).' },
  { eraId: 'industrial', date: '1888', title: 'Fundació de la UGT', note: 'Barcelona. Sindicat marxista.', star: true },
  { eraId: 'restauracio', date: '1876', title: 'Constitució Restauració', note: 'Cánovas del Castillo. Alternança i caciquisme.', star: true, personId: 'a2-canovas' },
  { eraId: 'restauracio', date: '1885', title: 'Memorial de Greuges', note: 'Defensa del dret civil català.' },
  { eraId: 'restauracio', date: '1886', title: '"Lo catalanisme" (Almirall)', note: 'Obra cabdal del catalanisme.', personId: 'a2-almirall' },
  { eraId: 'restauracio', date: '1892', title: 'Bases de Manresa', note: 'Unió Catalanista.', star: true },
  { eraId: 'restauracio', date: '1898', title: 'Desfeta colonial', note: 'Cuba, Puerto Rico, Filipines. Impuls catalanisme polític.' },
  { eraId: 'primerterc', date: '1901', title: 'Fundació Lliga Regionalista', note: 'Prat de la Riba, Cambó.', personId: 'a2-pratriba' },
  { eraId: 'primerterc', date: '1907', title: 'Solidaritat Catalana', note: '41 de 44 diputats.' },
  { eraId: 'primerterc', date: 'Juliol 1909', title: 'Setmana Tràgica', note: "Revolta contra crida a Marroc. Execució de Ferrer i Guàrdia.", star: true },
  { eraId: 'primerterc', date: '1910', title: 'Naix la CNT', note: 'Anarcosindicalista.' },
  { eraId: 'primerterc', date: '1914 — 25', title: 'Mancomunitat de Catalunya', note: 'Prat de la Riba i Puig i Cadafalch.', star: true },
  { eraId: 'primerterc', date: '1919', title: 'Vaga de la Canadenca', note: "Pistolerisme. Llei de fugues." },
  { eraId: 'primerterc', date: 'Set. 1923', title: "Cop d'estat de Primo de Rivera", note: 'Dissolució de la Mancomunitat (1925).' },
  { eraId: 'republica', date: '14 abril 1931', title: 'Proclamació de la República', note: 'Macià proclama República Catalana → Generalitat.', star: true, personId: 'a2-macia' },
  { eraId: 'republica', date: 'Set. 1932', title: 'Estatut definitiu', note: 'Aprovat després del cop frustrat de Sanjurjo.', star: true },
  { eraId: 'republica', date: '6 oct. 1934', title: 'Fets del Sis d\'Octubre', note: "Companys proclama l'Estat Català. Suspensió Generalitat.", personId: 'a2-companys' },
  { eraId: 'republica', date: '17 — 18 juliol 1936', title: 'Aixecament militar', note: 'Inici Guerra Civil.', star: true },
  { eraId: 'republica', date: 'Maig 1937', title: 'Fets de Maig', note: 'CNT/POUM vs ERC/PSUC. Telefònica.' },
  { eraId: 'republica', date: '26 gener 1939', title: 'Caiguda de Barcelona', note: '9 febrer: frontera francesa. Inici de l\'exili.', star: true },
  { eraId: 'franquisme', date: '15 oct. 1940', title: 'Afusellament de Lluís Companys', note: 'Castell de Montjuïc. Lliurat per la Gestapo.', star: true, personId: 'a2-companys' },
  { eraId: 'franquisme', date: '1964', title: 'Fundació CCOO', note: 'Comissions Obreres.' },
  { eraId: 'franquisme', date: '1971', title: 'Assemblea de Catalunya', note: '"Llibertat, amnistia i estatut d\'autonomia".', star: true },
  { eraId: 'franquisme', date: '20 nov. 1975', title: 'Mort de Franco', note: 'Final de la dictadura.', star: true },
  { eraId: 'transicio', date: '15 juny 1977', title: 'Primeres eleccions democràtiques' },
  { eraId: 'transicio', date: '23 oct. 1977', title: 'Tarradellas torna', note: 'Generalitat provisional.', star: true, personId: 'a2-tarradellas' },
  { eraId: 'transicio', date: '1978', title: 'Constitució espanyola', note: 'Estatut de Sau (1978).', star: true },
  { eraId: 'transicio', date: '25 oct. 1979', title: 'Referèndum Estatut de Sau', star: true },
  { eraId: 'transicio', date: '20 març 1980', title: 'Jordi Pujol elegit president', note: '126è president. Govern fins al 2003.', star: true, personId: 'a2-pujol' },
  { eraId: 'transicio', date: '1992', title: 'Jocs Olímpics de Barcelona', note: 'Alcaldia de Pasqual Maragall.', personId: 'a2-maragall' },
  { eraId: 'xxi', date: '2003 — 06', title: 'Maragall president', note: 'Elabora nou Estatut.', personId: 'a2-maragall' },
  { eraId: 'xxi', date: '19 juliol 2006', title: 'Estatut LO 6/2006', note: 'Nou Estatut d\'autonomia.', star: true },
  { eraId: 'xxi', date: '28 juny 2010', title: 'STC retalla l\'Estatut', star: true },
  { eraId: 'xxi', date: '9 nov. 2014', title: 'Consulta no vinculant', note: 'Suspesa pel TC.' },
  { eraId: 'xxi', date: '1 oct. 2017', title: "Referèndum d'independència", star: true },
  { eraId: 'xxi', date: '27 oct. 2017', title: 'Aplicació article 155 CE', note: 'Cessament del president.', star: true },
];

const A2_PEOPLE: EsquemaPerson[] = [
  { id: 'a2-prim', name: 'General Prim', eraId: 'xix', period: '1814 — 1870', role: 'Militar i polític', initials: 'GP', icon: 'sword', fact: 'Lidera la insurrecció del 1868 que comença el Sexenni Revolucionari.' },
  { id: 'a2-pimargall', name: 'Francesc Pi i Margall', eraId: 'xix', period: '1824 — 1901', role: 'President I República', initials: 'PiM', icon: 'scroll', fact: 'Català federalista, arriba a la presidència de la Primera República el 1873.' },
  { id: 'a2-canovas', name: 'Cánovas del Castillo', eraId: 'restauracio', period: '1828 — 1897', role: 'Polític espanyol', initials: 'CC', icon: 'crown', fact: 'Artífex del sistema de la Restauració amb la Constitució de 1876.' },
  { id: 'a2-almirall', name: 'Valentí Almirall', eraId: 'restauracio', period: '1841 — 1904', role: 'Pensador catalanista', initials: 'VA', icon: 'scroll', fact: 'Escriu "Lo catalanisme" (1886), obra fundacional del catalanisme polític.' },
  { id: 'a2-pratriba', name: 'Enric Prat de la Riba', eraId: 'primerterc', period: '1870 — 1917', role: 'President Mancomunitat', initials: 'PR', icon: 'scroll', fact: 'Funda la Lliga Regionalista (1901) i presideix la Mancomunitat (1914).' },
  { id: 'a2-macia', name: 'Francesc Macià', eraId: 'republica', period: '1859 — 1933', role: 'President Generalitat', initials: 'FM', icon: 'flag', fact: 'Proclama la República Catalana el 14 d\'abril 1931. Estat Català.' },
  { id: 'a2-companys', name: 'Lluís Companys', eraId: 'republica', period: '1882 — 1940', role: 'President Generalitat', initials: 'LC', icon: 'flag', fact: 'Proclama l\'Estat Català el 6 oct. 1934. Afusellat pel franquisme (1940).' },
  { id: 'a2-tarradellas', name: 'Josep Tarradellas', eraId: 'transicio', period: '1899 — 1988', role: 'President a l\'exili', initials: 'JT', icon: 'scroll', fact: 'Torna el 23 oct. 1977. "Ja sóc aquí". Generalitat provisional.' },
  { id: 'a2-pujol', name: 'Jordi Pujol', eraId: 'transicio', period: '1930 — ', role: '126è President Generalitat', initials: 'JP', icon: 'crown', fact: 'Govern de CiU 1980—2003. Reconstrucció Administració catalana, CCMA i Mossos.' },
  { id: 'a2-maragall', name: 'Pasqual Maragall', eraId: 'xxi', period: '1941 — ', role: 'President Generalitat', initials: 'PM', icon: 'scroll', fact: 'Alcalde JJOO 1992. President 2003—2006. Elabora Estatut LO 6/2006.' },
];

const A2_EXAM: ExamItem[] = [
  { date: '1812', text: 'Constitució de Cadis · primera Constitució espanyola, de caire liberal.' },
  { date: '1848', text: 'Tren Barcelona–Mataró · primera línia ferroviària d\'Espanya.' },
  { date: '1876', text: 'Constitució de la Restauració (Cánovas). Alternança i caciquisme.' },
  { date: '1892', text: 'Bases de Manresa · Unió Catalanista.' },
  { date: '1909', text: 'Setmana Tràgica · execució de Ferrer i Guàrdia.' },
  { date: '1914', text: 'Mancomunitat de Catalunya (Prat de la Riba).' },
  { date: '14 abril 1931', text: 'Proclamació de la República · Macià proclama República Catalana.' },
  { date: '26 gener 1939', text: 'Caiguda de Barcelona · inici de l\'exili.' },
  { date: '1979', text: 'Estatut de Sau referendat el 25 d\'octubre.' },
  { date: '1-O 2017', text: 'Referèndum d\'independència. Aplicació del 155 el 27 d\'octubre.' },
];

const ESQUEMA_A2: Esquema = {
  id: 'esq-mos-a2',
  temaSlug: 'a2-historia-de-catalunya-part-ii',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.2',
  title: 'Història de Catalunya',
  titleHighlight: '(Part II)',
  introOneLiner: "De la Revolució Francesa (1789) fins al segle XXI: fi de l'Antic Règim, industrialització, catalanisme, Segona República, Guerra Civil, franquisme, Transició i autogovern actual.",
  kpis: [
    { value: '230', label: 'anys', mono: true },
    { value: '8', label: 'etapes' },
    { value: '46', label: 'dates clau' },
    { value: '10', label: 'personatges' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: A2_ERAS,
  timeline: A2_TIMELINE,
  people: A2_PEOPLE,
  exam: A2_EXAM,
  testHref: '/mossos/a2-historia-de-catalunya-part-ii',
};

// ═══════════════════════════════════════════════════════════════
// A.3 — Història de la policia a Catalunya
// ═══════════════════════════════════════════════════════════════
const A3_ERAS: Era[] = [
  { id: 'medieval', name: 'Catalunya medieval', range: 'sense cos permanent', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'origens', name: 'Origen dels Mossos', range: '1719 — 1723', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'xix', name: 'Transformacions s. XIX', range: '1800 — 1900', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'xx-primer', name: 'Primeres dècades s. XX', range: '1900 — 1939', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'franquisme', name: 'Franquisme', range: '1939 — 1975', color: '#3A3A45', soft: '#D5D5DA' },
  { id: 'democracia', name: 'Democràcia · desplegament', range: '1978 — 2008', color: '#3B6BF5', soft: '#D8E2FE' },
];

const A3_TIMELINE: Milestone[] = [
  { eraId: 'medieval', date: 'Edat mitjana', title: 'Sometent i sagramental', note: 'No hi va haver mai un cos permanent. Defensa de la Pau i Treva.' },
  { eraId: 'origens', date: '1719', title: 'Esquadres de paisans', note: 'Tensions amb França. Distribuïdes pels corregiments.' },
  { eraId: 'origens', date: '1721', title: 'Dissolució general', note: 'Excepte la de Valls (Riudoms, Rodonyà).' },
  { eraId: 'origens', date: '1723', title: 'Veciana comandant', note: 'Institucionalització dels Mossos. Família Veciana fins al s. XVIII.', star: true, personId: 'a3-veciana' },
  { eraId: 'xix', date: '1812', title: 'Constitució de Cadis', note: 'Alcaldes responsables de pau i seguretat.' },
  { eraId: 'xix', date: '1835 — 37', title: 'Final de la família Veciana', note: 'Passen a oficials de l\'exèrcit.' },
  { eraId: 'xix', date: '26 nov. 1843', title: 'Guàrdia Municipal de Barcelona', star: true },
  { eraId: 'xix', date: '1844', title: 'Fundació de la Guàrdia Civil', note: 'Eix troncal de la seguretat pública estatal.', star: true },
  { eraId: 'xix', date: '1877', title: 'Restitució dels Mossos', note: 'La Diputació de Barcelona els restitueix.', star: true },
  { eraId: 'xix', date: '1880', title: 'Reglament dels Mossos', star: true },
  { eraId: 'xx-primer', date: '1905 — 08', title: 'Llei policia governativa', note: 'Dos cossos: Vigilancia i Seguridad. Dirección General de Seguridad.' },
  { eraId: 'xx-primer', date: '1909', title: 'Setmana Tràgica', note: 'Repressió de GC + sometent + Mossos.' },
  { eraId: 'xx-primer', date: '1917', title: 'Extinció gradual dels Mossos', note: 'Diputació aprova la dissolució.' },
  { eraId: 'xx-primer', date: '1919', title: 'Revitalització dels Mossos', note: 'Pistolerisme.' },
  { eraId: 'xx-primer', date: '1923', title: 'Dictadura Primo de Rivera', note: 'Mossos sota Capitania i governador civil.' },
  { eraId: 'xx-primer', date: '14 ago. 1930', title: 'Dissolució i reorganització', note: 'Decret.' },
  { eraId: 'xx-primer', date: '14 abr. 1931', title: 'Escofet a les ordres de Macià', personId: 'a3-escofet' },
  { eraId: 'xx-primer', date: '14 oct. 1932', title: 'Mossos a tot Catalunya', note: 'Decret de Macià.', star: true },
  { eraId: 'xx-primer', date: '1934', title: 'Mossos desarmats', note: "Fets d'octubre, atacar l'exèrcit." },
  { eraId: 'franquisme', date: '1939', title: 'Suspensió dels Mossos', note: 'Final de la Guerra Civil.', star: true },
  { eraId: 'franquisme', date: '1952', title: 'Restitució (Diputació BCN)', note: 'Marquès de Castell-Florite. Integrats a l\'exèrcit.' },
  { eraId: 'democracia', date: '1978', title: 'Constitució espanyola', note: 'Model policial pluralista: estatal · autonòmic · local.', star: true },
  { eraId: 'democracia', date: '1983', title: 'Llei de creació de la PG-ME', note: 'Parlament de Catalunya aprova la Policia de la Generalitat.', star: true },
  { eraId: 'democracia', date: '1985', title: 'Escola de Policia · Mollet', note: 'Avui ISPC.', star: true },
  { eraId: 'democracia', date: 'Nov. 1994', title: 'Inici del desplegament · Osona', note: 'Primera comarca. Seguida del Ripollès i la Selva.', star: true },
  { eraId: 'democracia', date: '1997 — 98', title: 'Competències de trànsit' },
  { eraId: 'democracia', date: 'Nov. 2008', title: 'Final del desplegament', note: 'Terres de l\'Ebre i Camp de Tarragona.', star: true },
];

const A3_PEOPLE: EsquemaPerson[] = [
  { id: 'a3-veciana', name: 'Pere Anton Veciana i Rabasa', eraId: 'origens', period: '1682 — 1763', role: 'Fundador dels Mossos', initials: 'PV', icon: 'sword', fact: 'Nomenat comandant el 1723. La família Veciana comanda els Mossos durant tot el s. XVIII.' },
  { id: 'a3-escofet', name: 'Frederic Escofet', eraId: 'xx-primer', period: '1898 — 1987', role: 'Capità dels Mossos', initials: 'FE', icon: 'flag', fact: 'El 14 d\'abril 1931 es posa a les ordres de Francesc Macià, simbolitzant l\'adhesió dels Mossos a la República.' },
  { id: 'a3-perezfarras', name: 'Pérez Farràs', eraId: 'xx-primer', period: 's. XX', role: 'Comandant dels Mossos', initials: 'PF', icon: 'sword', fact: 'Substitueix Escofet al capdavant dels Mossos durant la República.' },
];

const A3_EXAM: ExamItem[] = [
  { date: '1719', text: 'Es creen les esquadres de paisans.' },
  { date: '1721', text: 'Dissolució general, excepte la de Valls.' },
  { date: '1723', text: 'Veciana comandant · institucionalització dels Mossos.' },
  { date: '1843', text: 'Guàrdia Municipal de Barcelona (26 de novembre).' },
  { date: '1844', text: 'Fundació de la Guàrdia Civil.' },
  { date: '1877 — 80', text: 'Restitució i Reglament dels Mossos (Diputació BCN).' },
  { date: '1983', text: 'Llei de creació de la Policia de la Generalitat.' },
  { date: '1985', text: 'Escola de Policia inaugura Mollet del Vallès.' },
  { date: '1994', text: 'Desplegament comença per Osona.' },
  { date: '2008', text: 'Final del desplegament · Terres de l\'Ebre i Camp de Tarragona.' },
];

const ESQUEMA_A3: Esquema = {
  id: 'esq-mos-a3',
  temaSlug: 'a3-historia-de-la-policia-a-catalunya',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.3',
  title: 'Història de la policia',
  titleHighlight: 'a Catalunya',
  introOneLiner: "De l'origen del sometent i el sagramental medievals fins al desplegament dels Mossos (1994—2008). Per què els Mossos són la policia més antiga d'Europa.",
  kpis: [
    { value: '300+', label: 'anys d\'història' },
    { value: '6', label: 'etapes' },
    { value: '27', label: 'dates clau' },
    { value: '3', label: 'figures cabdals' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A3_ERAS,
  timeline: A3_TIMELINE,
  people: A3_PEOPLE,
  exam: A3_EXAM,
  testHref: '/mossos/a3-historia-de-la-policia-a-catalunya',
};

// ═══════════════════════════════════════════════════════════════
// A.4 — Àmbit sociolingüístic
// ═══════════════════════════════════════════════════════════════
const A4_ERAS: Era[] = [
  { id: 'origens', name: 'Orígens', range: 's. VII — XII', color: '#B89060', soft: '#F3E8D6' },
  { id: 'expansio', name: 'Expansió · Segle d\'Or', range: 's. XIII — XV', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'retroces', name: 'Retrocés', range: 's. XVI — XVIII', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'recuperacio', name: 'Recuperació · Renaixença', range: 's. XIX', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'normativitzacio', name: 'Normativització', range: 's. XX — XXI', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'aranes', name: 'Llengua aranesa', range: '1175 — 2010', color: '#1FB286', soft: '#CDF0E1' },
];

const A4_TIMELINE: Milestone[] = [
  { eraId: 'origens', date: '813', title: 'Concili de Tours', note: "L'Església mana predicar en la llengua del poble.", star: true },
  { eraId: 'origens', date: 's. VII — XII', title: 'Diglòssia', note: 'Llatí (A) en àmbits formals; català (B) en privats.' },
  { eraId: 'origens', date: 's. XII', title: "Homilies d'Organyà", note: 'Primer text en català (8 fulls de sermó).', star: true },
  { eraId: 'aranes', date: '1175', title: "Tractat d'Emparança", note: 'Unió voluntària de l\'Aran a la corona catalanoaragonesa.', star: true },
  { eraId: 'expansio', date: '1232 — 1315', title: 'Ramon Llull', note: 'Naixement de la prosa catalana. Blanquerna.', star: true, personId: 'a4-llull' },
  { eraId: 'expansio', date: 's. XIII — XIV', title: 'Quatre Grans Cròniques', note: 'Jaume I, Desclot, Muntaner, Pere el Cerimoniós.' },
  { eraId: 'expansio', date: '1340 — 1413', title: 'Bernat Metge · Lo somni', note: 'Primera obra humanística a Espanya.', personId: 'a4-metge' },
  { eraId: 'expansio', date: '1412', title: 'Compromís de Casp', note: 'Trastàmara. Rei i cort parlen castellà.' },
  { eraId: 'expansio', date: 's. XV', title: "Segle d'Or", note: 'Ausiàs March, Joanot Martorell (Tirant lo Blanc).', star: true, personId: 'a4-martorell' },
  { eraId: 'retroces', date: '1659', title: 'Tractat dels Pirineus', note: 'Rosselló, Conflent, Capcir, Vallespir, mitja Cerdanya → França.', star: true },
  { eraId: 'retroces', date: '1700', title: 'Edicte de Lluís XIV', note: 'Prohibeix el català al Rosselló.' },
  { eraId: 'retroces', date: '1707', title: 'Decret Nova Planta · València' },
  { eraId: 'retroces', date: '1715', title: 'Decret Nova Planta · Mallorca' },
  { eraId: 'retroces', date: '1716', title: 'Decret Nova Planta · Principat', note: 'Anul·la l\'oficialitat del català.', star: true },
  { eraId: 'recuperacio', date: '1833', title: '"La pàtria" de Aribau', note: 'Inici simbòlic de la Renaixença.', star: true, personId: 'a4-aribau' },
  { eraId: 'recuperacio', date: '1859', title: 'Restabliment Jocs Florals' },
  { eraId: 'recuperacio', date: '1892', title: 'Bases de Manresa' },
  { eraId: 'normativitzacio', date: '1906', title: 'I Congrés Internacional', note: 'De la Llengua Catalana (Mossèn Alcover).' },
  { eraId: 'normativitzacio', date: '1907', title: 'Funda IEC', note: 'Prat de la Riba crea l\'Institut d\'Estudis Catalans.', star: true },
  { eraId: 'normativitzacio', date: '1913', title: 'Normes ortogràfiques', note: 'Pompeu Fabra.', star: true, personId: 'a4-fabra' },
  { eraId: 'normativitzacio', date: '1917', title: 'Diccionari Ortogràfic (Fabra)' },
  { eraId: 'normativitzacio', date: '1918', title: 'Gramàtica Catalana (Fabra)', star: true, personId: 'a4-fabra' },
  { eraId: 'normativitzacio', date: '1926', title: 'Inici DCVB', note: 'Diccionari Català-Valencià-Balear (Alcover i Moll).', personId: 'a4-alcover' },
  { eraId: 'normativitzacio', date: '1932', title: 'Diccionari General (Fabra)', note: 'Normes de Castelló.', star: true },
  { eraId: 'normativitzacio', date: '1939 — 75', title: 'Franquisme · prohibició' },
  { eraId: 'normativitzacio', date: '1961', title: 'Creació d\'Òmnium Cultural' },
  { eraId: 'aranes', date: '1979', title: "Estatut · protecció de l'aranès", note: 'Art. 3.4 EAC.' },
  { eraId: 'aranes', date: '1983', title: 'Llei 7/1983 LNL', note: 'Aranès llengua pròpia d\'Aran.' },
  { eraId: 'aranes', date: '13 juliol 1990', title: 'Llei 16/1990 Vall d\'Aran', note: 'Oficialitat territorialitzada + Conselh Generau.', star: true },
  { eraId: 'aranes', date: '2006', title: 'EAC · occità oficial', note: 'A tot Catalunya (art. 6.5).', star: true },
  { eraId: 'aranes', date: '1 oct. 2010', title: 'Llei 35/2010 occità', note: 'Aranès oficial a tot Catalunya.', star: true },
  { eraId: 'normativitzacio', date: '24 oct. 2016', title: 'Nova Ortografia IEC' },
  { eraId: 'normativitzacio', date: 'Des. 2016', title: 'Nova Gramàtica IEC', note: 'Ratificada el 29 set. 2016, presentada el desembre.', star: true },
];

const A4_PEOPLE: EsquemaPerson[] = [
  { id: 'a4-llull', name: 'Ramon Llull', eraId: 'expansio', period: '1232 — 1315', role: 'Filòsof i escriptor', initials: 'RL', icon: 'scroll', fact: 'Naixement de la prosa catalana. Blanquerna, Llibre de Contemplació.' },
  { id: 'a4-metge', name: 'Bernat Metge', eraId: 'expansio', period: '1340 — 1413', role: 'Escriptor humanista', initials: 'BM', icon: 'scroll', fact: 'Lo somni · primera obra humanística a la península Ibèrica.' },
  { id: 'a4-martorell', name: 'Joanot Martorell', eraId: 'expansio', period: '~1413 — 1468', role: 'Escriptor', initials: 'JM', icon: 'scroll', fact: 'Tirant lo Blanc · obra cabdal del Segle d\'Or català.' },
  { id: 'a4-aribau', name: 'Bonaventura Carles Aribau', eraId: 'recuperacio', period: '1798 — 1862', role: 'Escriptor', initials: 'BA', icon: 'scroll', fact: '"La pàtria" (1833) · inici simbòlic de la Renaixença.' },
  { id: 'a4-fabra', name: 'Pompeu Fabra', eraId: 'normativitzacio', period: '1868 — 1948', role: 'Lingüista', initials: 'PF', icon: 'scroll', fact: 'Normes ortogràfiques (1913), Gramàtica (1918), Diccionari General (1932).' },
  { id: 'a4-alcover', name: 'Antoni Maria Alcover', eraId: 'normativitzacio', period: '1862 — 1932', role: 'Lingüista', initials: 'AA', icon: 'scroll', fact: 'I Congrés Internacional (1906). Inici del DCVB amb Moll.' },
];

const A4_EXAM: ExamItem[] = [
  { date: '813', text: 'Concili de Tours · l\'Església predica en la llengua del poble.' },
  { date: 's. XII', text: 'Homilies d\'Organyà · primer text en català.' },
  { date: '1707/1715/1716', text: 'Decrets de Nova Planta · València / Mallorca / Principat.' },
  { date: '1833', text: '"La pàtria" d\'Aribau · inici Renaixença.' },
  { date: '1907', text: 'Prat de la Riba funda l\'IEC.' },
  { date: '1913/18/32', text: 'Pompeu Fabra · Normes / Gramàtica / Diccionari General.' },
  { date: '1979/2006/2010', text: 'EAC, Estatut 2006 i Llei 35/2010 · estatuts de l\'aranès.' },
  { date: '2016', text: 'Nova Gramàtica i Ortografia de l\'IEC.' },
  { date: 'Concepte', text: 'Catalunya = únic territori amb 3 llengües oficials (català, castellà, occità).' },
  { date: 'Diglòssia', text: 'Llengua A (alta) vs B (baixa). El català ha estat B durant segles.' },
];

const ESQUEMA_A4: Esquema = {
  id: 'esq-mos-a4',
  temaSlug: 'a4-ambit-sociolinguistic',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.4',
  title: 'Àmbit',
  titleHighlight: 'sociolingüístic',
  introOneLiner: "Història i situació actual de la llengua catalana: orígens, esplendor medieval, retrocés, Renaixença, normativització de Pompeu Fabra i cooficialitat actual amb castellà i occità (aranès).",
  kpis: [
    { value: '~ 1.200', label: 'anys d\'història' },
    { value: '6', label: 'etapes' },
    { value: '33', label: 'fites clau' },
    { value: '6', label: 'figures cabdals' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A4_ERAS,
  timeline: A4_TIMELINE,
  people: A4_PEOPLE,
  exam: A4_EXAM,
  testHref: '/mossos/a4-ambit-sociolinguistic',
};

// ═══════════════════════════════════════════════════════════════
// A.5 — Marc geogràfic de Catalunya
// (Tema no històric · "etapes" = blocs temàtics)
// ═══════════════════════════════════════════════════════════════
const A5_ERAS: Era[] = [
  { id: 'admin', name: 'Divisió administrativa', range: '32.108 km²', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'pirineu', name: 'Pirineu', range: '250 km · Pica 3.143 m', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'depressio', name: 'Depressió Central', range: 'planes sedimentàries', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'mediterrani', name: 'Sistema Mediterrani', range: 'Prelitoral + Litoral', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'transversal', name: 'Transversal · volcans', range: 'Olot · 515 km costa', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'climes', name: 'Climes', range: 'mediterrani + variants', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'hidrografia', name: 'Hidrografia', range: '4 xarxes · 2 vessants', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'poblacio', name: 'Població', range: '7,76 M hab.', color: '#5E3A8A', soft: '#E3D4F2' },
];

const A5_TIMELINE: Milestone[] = [
  { eraId: 'admin', date: '32.108 km²', title: 'Extensió de Catalunya', note: 'Extrem nord-est península Ibèrica.', star: true },
  { eraId: 'admin', date: '4', title: 'Províncies', note: 'Barcelona, Tarragona, Lleida, Girona.', star: true },
  { eraId: 'admin', date: '42', title: 'Comarques', note: 'Moianès creat el 2015.', star: true },
  { eraId: 'admin', date: '947', title: 'Municipis (2019)', note: 'Unitat administrativa bàsica.' },
  { eraId: 'admin', date: '8', title: 'Vegueries (Llei 27 juliol 2010)', note: 'Penedès afegit el 2017.', star: true },
  { eraId: 'pirineu', date: '3.143 m', title: 'Pica d\'Estats', note: 'Punt més alt de Catalunya · Pirineu axial.', star: true },
  { eraId: 'pirineu', date: '2.913 m', title: 'Puigmal' },
  { eraId: 'pirineu', date: '2.916 m', title: 'Tossa Plana de Lles' },
  { eraId: 'pirineu', date: '2.648 m', title: 'Cadí · Prepirineu' },
  { eraId: 'pirineu', date: '2.497 m', title: 'Pedraforca' },
  { eraId: 'pirineu', date: '2.276 m', title: 'Moixeró' },
  { eraId: 'depressio', date: 'Altiplans', title: 'Lluçanès · Moianès · Segarra' },
  { eraId: 'depressio', date: 'Conques', title: 'Vic · Bages · Òdena · Barberà' },
  { eraId: 'depressio', date: 'Planes', title: 'Urgell · Lleida' },
  { eraId: 'mediterrani', date: '1.706 m', title: "Turó de l'Home · Montseny", note: 'Punt culminant del Sistema Mediterrani.', star: true },
  { eraId: 'mediterrani', date: '1.236 m', title: 'Montserrat' },
  { eraId: 'mediterrani', date: '1.203 m', title: 'Prades' },
  { eraId: 'mediterrani', date: '512 m', title: 'Collserola · Litoral' },
  { eraId: 'mediterrani', date: '658 m', title: 'Garraf · Litoral' },
  { eraId: 'transversal', date: 'Volcans', title: 'Pla d\'Olot', note: 'Santa Margarida · Croscat · Castellfollit de la Roca.', star: true },
  { eraId: 'transversal', date: '515 km', title: 'Litoral · costa', note: 'De Portbou al riu de la Sénia.', star: true },
  { eraId: 'transversal', date: '320 km²', title: 'Delta de l\'Ebre' },
  { eraId: 'climes', date: 'Dominant', title: 'Mediterrani temperat' },
  { eraId: 'climes', date: 'Únic', title: 'Atlàntic · Vall d\'Aran', star: true },
  { eraId: 'climes', date: '> 1.500 m', title: 'Alpí i subalpí · Pirineu' },
  { eraId: 'climes', date: '17,1°C / 3°C', title: 'Tortosa (50 m) vs Estany Gento (>2.000 m)', note: 'Mitjana anual.' },
  { eraId: 'hidrografia', date: 'Vessant Atl.', title: 'Garona · Vall d\'Aran', note: 'Únic riu atlàntic.', star: true },
  { eraId: 'hidrografia', date: 'Afluents Ebre', title: 'Segre, Noguera Ribagorçana, Noguera Pallaresa, Valira' },
  { eraId: 'hidrografia', date: 'Pirineus-Med.', title: 'Muga, Fluvià, Ter, Llobregat' },
  { eraId: 'hidrografia', date: 'Sist. Med.', title: 'Tordera, Besòs, Foix, Gaià, Francolí, Sénia' },
  { eraId: 'poblacio', date: '2021', title: '7.763.362 hab.', note: '65% àmbit metropolità BCN.', star: true },
  { eraId: 'poblacio', date: '241 hab/km²', title: 'Densitat de població' },
  { eraId: 'poblacio', date: '82,4 anys', title: 'Esperança de vida', note: 'Homes 79,7 · dones 85,0.' },
];

const A5_PEOPLE: EsquemaPerson[] = [
  { id: 'a5-pica', name: "Pica d'Estats", eraId: 'pirineu', period: '3.143 m', role: 'Cim més alt de Catalunya', initials: 'PE', icon: 'sword', fact: 'Cim emblemàtic del Pirineu axial. Punt més elevat del territori català.' },
  { id: 'a5-turo', name: "Turó de l'Home", eraId: 'mediterrani', period: '1.706 m', role: 'Cim Sistema Mediterrani', initials: 'TH', icon: 'sword', fact: 'Punt culminant de la Serralada Prelitoral · massís del Montseny.' },
  { id: 'a5-montserrat', name: 'Montserrat', eraId: 'mediterrani', period: '1.236 m', role: 'Símbol nacional', initials: 'MS', icon: 'flag', fact: 'Massís icònic de la Serralada Prelitoral. Patrona de Catalunya.' },
  { id: 'a5-ebre', name: 'Riu Ebre', eraId: 'hidrografia', period: '910 km', role: 'Riu principal', initials: 'EB', icon: 'scroll', fact: 'Vessant mediterrani. Delta de 320 km². Afluents catalans: Segre, Nogueres.' },
  { id: 'a5-aran', name: 'Vall d\'Aran', eraId: 'climes', period: 'Vessant atlàntic', role: 'Districte especial', initials: 'VA', icon: 'flag', fact: 'Únic territori amb clima atlàntic i únic riu (Garona) del vessant atlàntic.' },
  { id: 'a5-bcn', name: 'Àrea metropolitana BCN', eraId: 'poblacio', period: '65% població', role: 'Concentració urbana', initials: 'BM', icon: 'crown', fact: 'Concentra el 65% dels 7,76 M d\'habitants de Catalunya.' },
];

const A5_EXAM: ExamItem[] = [
  { date: '32.108 km²', text: 'Extensió de Catalunya.' },
  { date: '4 / 42 / 947', text: 'Províncies / comarques / municipis.' },
  { date: '8', text: 'Vegueries (Penedès afegit el 2017).' },
  { date: '3.143 m', text: "Pica d'Estats · punt més alt de Catalunya." },
  { date: '1.706 m', text: "Turó de l'Home · punt culminant del Sistema Mediterrani." },
  { date: 'Olot', text: 'Volcans: Santa Margarida, Croscat, Castellfollit de la Roca.' },
  { date: '515 km', text: 'Costa catalana.' },
  { date: "Vall d'Aran", text: 'Únic territori amb clima atlàntic. Garona = únic riu atlàntic.' },
  { date: '7,76 M', text: 'Població Catalunya 2021. 65% àmbit metropolità BCN.' },
  { date: '2015 / 2017', text: 'Moianès (42a comarca) / Penedès (8a vegueria).' },
];

const ESQUEMA_A5: Esquema = {
  id: 'esq-mos-a5',
  temaSlug: 'a5-marc-geografic-de-catalunya',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.5',
  title: 'Marc geogràfic',
  titleHighlight: 'de Catalunya',
  introOneLiner: 'Divisió territorial, relleu (Pirineus, Depressió Central, Sistema Mediterrani), climes, hidrografia, vegetació i població. Molta dada concreta a memoritzar.',
  kpis: [
    { value: '32.108', label: 'km²' },
    { value: '8', label: 'blocs temàtics' },
    { value: '32', label: 'dades clau' },
    { value: '6', label: 'elements destacats' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A5_ERAS,
  timeline: A5_TIMELINE,
  people: A5_PEOPLE,
  exam: A5_EXAM,
  testHref: '/mossos/a5-marc-geografic-de-catalunya',
  labels: { eras: 'Blocs', timeline: 'Dades clau', people: 'Elements destacats' },
};

// ═══════════════════════════════════════════════════════════════
// A.6 — Entorn social a Catalunya
// ═══════════════════════════════════════════════════════════════
const A6_ERAS: Era[] = [
  { id: 'onades', name: 'Tres onades migratòries', range: 's. XX — XXI', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'dades', name: 'Dades actuals', range: '2021 — 2022', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'estatal', name: 'Marc legal estatal', range: 'LO 8/2000', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'catala', name: 'Marc legal català', range: '1993 — 2020', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'models', name: "Models d'integració", range: '3 teories', color: '#A4476E', soft: '#F4D8E4' },
  { id: 'igualtat', name: "Igualtat d'oportunitats", range: '1999 — 2019', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'serveis', name: 'Serveis socials', range: 'Estat del benestar', color: '#0BB4C2', soft: '#CCEEF1' },
];

const A6_TIMELINE: Milestone[] = [
  { eraId: 'onades', date: 'Anys 20-30', title: 'Primera onada', note: 'Aragó, País Valencià, Múrcia, Almeria.', star: true },
  { eraId: 'onades', date: 'Postguerra-70', title: 'Segona onada', note: 'Andalusia i altres regions espanyoles. ~3 M (1901-1980).', star: true },
  { eraId: 'onades', date: 'Fi anys 80', title: 'Tercera onada', note: 'Estrangers · Marroc, Llatinoamèrica, Est Europa, Àsia.', star: true },
  { eraId: 'dades', date: '2021', title: '7.763.362 hab.', note: 'Catalunya.' },
  { eraId: 'dades', date: '16,11%', title: '1.250.665 estrangers', note: 'Aprox. un terç de catalans nascuts fora.', star: true },
  { eraId: 'dades', date: '2022', title: 'Continents', note: 'Europa 31% · Amèrica 28% · Àfrica 26% · Àsia/Oceania 15%.' },
  { eraId: 'dades', date: 'Top', title: 'Nacionalitats estrangeres', note: 'Marroquí >19%, romanès, italià, xinès.' },
  { eraId: 'dades', date: '61,56%', title: 'Estrangers al metro BCN' },
  { eraId: 'estatal', date: 'LO 8/2000', title: "Drets i llibertats dels estrangers", note: 'Marc estatal d\'integració social.', star: true },
  { eraId: 'estatal', date: '30 oct. 2009', title: 'Llei 12/2009', note: 'Dret d\'asil i protecció subsidiària.' },
  { eraId: 'estatal', date: '20 abr. 2011', title: 'RD 557/2011', note: 'Reglament de la LO 4/2000.' },
  { eraId: 'estatal', date: 'Nacionalitat', title: '10 anys general · 5 refugiats', note: '2 iberoamericans, Portugal, sefardís, etc.', star: true },
  { eraId: 'catala', date: '1993', title: "1r Pla interdepartamental d'immigració" },
  { eraId: 'catala', date: '2008', title: 'Pacte nacional per la immigració', note: 'Taula de Ciutadania i Immigració.' },
  { eraId: 'catala', date: '7 maig 2010', title: "Llei 10/2010 d'acollida", note: 'De persones immigrades i retornades.', star: true },
  { eraId: 'catala', date: '2014', title: 'Decret 150/2014', note: "Serveis d'acollida." },
  { eraId: 'catala', date: '2017 — 2020', title: 'Pla de Ciutadania i Migracions' },
  { eraId: 'models', date: 'Model 1', title: 'Assimilació', note: 'L\'immigrant adopta la cultura receptora.' },
  { eraId: 'models', date: 'Model 2', title: 'Melting pot · gresol', note: 'Nadius i immigrants creen nova cultura comuna.', star: true },
  { eraId: 'models', date: 'Model 3', title: 'Pluralisme cultural', note: 'Principis comuns + peculiaritats privades.', star: true },
  { eraId: 'igualtat', date: '5 nov. 1999', title: 'Llei 39/1999', note: 'Conciliació vida familiar i laboral.' },
  { eraId: 'igualtat', date: '22 març 2007', title: 'LO 3/2007', note: 'Igualtat efectiva dones-homes.' },
  { eraId: 'igualtat', date: '5 jul. 2006', title: 'Llei 8/2006', note: 'Mesures de conciliació sector públic català.' },
  { eraId: 'igualtat', date: '24 abr. 2008', title: 'Llei 5/2008', note: 'Erradicar la violència masclista.' },
  { eraId: 'igualtat', date: '21 jul. 2015', title: 'Llei 17/2015', note: 'Primera llei catalana d\'igualtat efectiva.', star: true },
  { eraId: 'igualtat', date: '1 març 2019', title: 'RDL 6/2019', note: '16 setmanes de permís per a l\'altre progenitor.', star: true },
  { eraId: 'igualtat', date: '1989', title: 'Institut Català de les Dones', note: 'ICD creat.' },
  { eraId: 'serveis', date: 'Llei 12/2007', title: 'Serveis socials', note: 'Marc legal de referència català.', star: true },
  { eraId: 'serveis', date: '4 dim.', title: 'Estat del benestar', note: 'Transferències · serveis · intervenció normativa · ocupació.' },
  { eraId: 'serveis', date: 'Atenció', title: 'Primària + especialitzada', note: 'Treballadors socials, educadors. Gent gran, discapacitat, infants.' },
];

const A6_PEOPLE: EsquemaPerson[] = [
  { id: 'a6-lo82000', name: 'LO 8/2000', eraId: 'estatal', period: 'Estatal', role: 'Drets dels estrangers', initials: 'LO', icon: 'scroll', fact: 'Drets i llibertats dels estrangers a Espanya i la seva integració social.' },
  { id: 'a6-llei102010', name: 'Llei 10/2010', eraId: 'catala', period: '7 maig 2010', role: 'Llei d\'acollida', initials: 'L10', icon: 'scroll', fact: "D'acollida de persones immigrades i retornades a Catalunya." },
  { id: 'a6-llei122007', name: 'Llei 12/2007', eraId: 'serveis', period: '2007', role: 'Serveis socials', initials: 'L12', icon: 'scroll', fact: 'Marc legal de referència dels serveis socials a Catalunya.' },
  { id: 'a6-llei172015', name: 'Llei 17/2015', eraId: 'igualtat', period: '21 juliol 2015', role: 'Igualtat dones-homes', initials: 'L17', icon: 'scroll', fact: 'Primera llei catalana d\'igualtat efectiva entre dones i homes.' },
  { id: 'a6-icd', name: 'Institut Català de les Dones', eraId: 'igualtat', period: 'Des de 1989', role: 'Institució catalana', initials: 'ICD', icon: 'flag', fact: 'Organisme català per a les polítiques d\'igualtat de gènere.' },
  { id: 'a6-pacte', name: 'Pacte Nacional Immigració', eraId: 'catala', period: '2008', role: 'Pacte social', initials: 'PN', icon: 'flag', fact: 'Acord polític i social per a la gestió de la immigració. Taula de Ciutadania.' },
];

const A6_EXAM: ExamItem[] = [
  { date: '3 onades', text: 'Anys 20-30 · postguerra-70 · des fi anys 80. La tercera és la més preguntada.' },
  { date: 'Llei 10/2010', text: 'Llei catalana d\'acollida (de 7 de maig).' },
  { date: 'Llei 17/2015', text: 'Llei catalana d\'igualtat efectiva (21 de juliol).' },
  { date: 'Llei 12/2007', text: 'Llei catalana de serveis socials.' },
  { date: '3 models', text: 'Assimilació · melting pot · pluralisme cultural. Diferenciació clàssica.' },
  { date: 'RDL 6/2019', text: '16 setmanes de permís per a l\'altre progenitor.' },
  { date: 'LO 8/2000', text: 'Marc estatal de drets dels estrangers.' },
  { date: 'ICD', text: 'Institut Català de les Dones · creat el 1989.' },
  { date: '16,11%', text: 'Estrangers a Catalunya (2021).' },
  { date: '10/5/2', text: 'Anys per nacionalitat · general/refugiat/iberoamericà-sefardí.' },
];

const ESQUEMA_A6: Esquema = {
  id: 'esq-mos-a6',
  temaSlug: 'a6-entorn-social-a-catalunya',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.6',
  title: 'Entorn social',
  titleHighlight: 'a Catalunya',
  introOneLiner: 'Fet migratori i estructura social actual de Catalunya: tres onades, polítiques d\'immigració, models d\'integració, igualtat d\'oportunitats i sistema de serveis socials.',
  kpis: [
    { value: '7,76 M', label: 'habitants 2021' },
    { value: '7', label: 'blocs temàtics' },
    { value: '30', label: 'fites clau' },
    { value: '6', label: 'normes i institucions' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A6_ERAS,
  timeline: A6_TIMELINE,
  people: A6_PEOPLE,
  exam: A6_EXAM,
  testHref: '/mossos/a6-entorn-social-a-catalunya',
  labels: { eras: 'Blocs', timeline: 'Marc legal i dades', people: 'Normes clau' },
};

// ═══════════════════════════════════════════════════════════════
// A.7 — Tecnologies de la informació
// ═══════════════════════════════════════════════════════════════
const A7_ERAS: Era[] = [
  { id: 'societat', name: 'Societat del coneixement', range: 'Des de 1981', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'iot', name: 'IoT · cibersocietat', range: 'Smart buildings', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'efectes', name: 'Efectes de les TIC', range: 'Canvis socials', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'seguretat', name: 'Seguretat informació', range: 'Tríada CIA', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'admin', name: 'Administració electrònica', range: 'Llei 39/2015 · 40/2015', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'control', name: 'Comunicació i control', range: 'Videovigilància · big data', color: '#A4476E', soft: '#F4D8E4' },
];

const A7_TIMELINE: Milestone[] = [
  { eraId: 'societat', date: '1981', title: 'Naixement societat de la informació', note: 'Microsoft MS-DOS + IBM PC.', star: true },
  { eraId: 'societat', date: 'Concepte', title: 'Multimèdia', note: 'Integració de so, imatge i text.' },
  { eraId: 'societat', date: 'Concepte', title: 'Hipermèdia', note: 'Multimèdia + hipertext.' },
  { eraId: 'societat', date: 'Concepte', title: 'Realitat virtual' },
  { eraId: 'societat', date: 'Concepte', title: "Grans xarxes d'ordinadors" },
  { eraId: 'societat', date: 'Concepte', title: 'Internet', note: 'Xarxa global d\'ordinadors interconnectats.' },
  { eraId: 'societat', date: 'Concepte', title: 'Telefonia mòbil', note: 'Funcions PC + Internet.' },
  { eraId: 'iot', date: 'IoT', title: 'Internet of Things', note: 'Interconnexió massiva de dispositius (videovigilància, domòtica, automoció).', star: true },
  { eraId: 'iot', date: 'EN', title: 'Safety vs. Security', note: 'Safety = física/ambiental · Security = lògica/control d\'accés.', star: true },
  { eraId: 'iot', date: 'Risc', title: 'Smart buildings', note: 'Gestió remota integrada. Risc de comprometre la seguretat.' },
  { eraId: 'efectes', date: 'Mercat treball', title: 'Sector secundari → terciari', note: 'Desplaçament a serveis.' },
  { eraId: 'efectes', date: 'Producció', title: 'Robotització i automatització' },
  { eraId: 'efectes', date: 'Formació', title: 'Major qualificació exigida' },
  { eraId: 'seguretat', date: 'C', title: 'Confidencialitat', note: 'Informació només accessible a autoritzats.', star: true },
  { eraId: 'seguretat', date: 'I', title: 'Integritat', note: 'Informació no modificada sense autorització.', star: true },
  { eraId: 'seguretat', date: 'A', title: 'Disponibilitat', note: 'Accessible quan es vol accedir-hi.', star: true },
  { eraId: 'seguretat', date: 'Amenaces', title: 'Malware', note: 'Virus, troians, ransomware, spyware.' },
  { eraId: 'seguretat', date: 'Amenaces', title: 'Phishing', note: 'Enginyeria social per obtenir credencials.' },
  { eraId: 'seguretat', date: 'Amenaces', title: 'DDoS', note: 'Denegació de servei.' },
  { eraId: 'admin', date: '1 oct. 2015', title: 'Llei 39/2015', note: 'Procediment administratiu comú.', star: true },
  { eraId: 'admin', date: '1 oct. 2015', title: 'Llei 40/2015', note: 'Règim jurídic del sector públic.', star: true },
  { eraId: 'admin', date: 'UE 910/2014', title: 'Reglament eIDAS', note: 'Signatura electrònica reconeguda a la UE.', star: true },
  { eraId: 'admin', date: 'Tipus 1', title: 'Signatura simple', note: 'Dades electròniques associades.' },
  { eraId: 'admin', date: 'Tipus 2', title: 'Signatura avançada', note: 'Identifica signant + detecta canvis.' },
  { eraId: 'admin', date: 'Tipus 3', title: 'Signatura qualificada', note: 'Mateix valor que la manuscrita.', star: true },
  { eraId: 'admin', date: 'CAT', title: 'idCAT · idCAT Mòbil · DNIe · Cl@ve', note: 'Identificadors a Catalunya.' },
  { eraId: 'control', date: 'LO 4/1997', title: 'Videovigilància', note: 'Espais públics.' },
  { eraId: 'control', date: 'LO 7/2021', title: 'Llei tractament dades policia', note: 'Reforma videovigilància.' },
  { eraId: 'control', date: 'Concepte', title: 'Big data · policia predictiva', note: 'Algoritmes per anticipar hot spots.' },
  { eraId: 'control', date: 'LOPDGDD 3/2018', title: 'Protecció de dades · Espanya', note: 'De 5 de desembre.', star: true },
  { eraId: 'control', date: 'UE 2016/679', title: 'RGPD europeu', note: 'Reglament general de protecció de dades.', star: true },
];

const A7_PEOPLE: EsquemaPerson[] = [
  { id: 'a7-cia', name: 'Tríada CIA', eraId: 'seguretat', period: 'Principis seguretat', role: 'Concepte fonamental', initials: 'CIA', icon: 'sword', fact: 'Confidencialitat · Integritat · Disponibilitat. Pilars de la seguretat de la informació.' },
  { id: 'a7-llei39', name: 'Llei 39/2015', eraId: 'admin', period: '1 octubre 2015', role: 'Procediment administratiu', initials: 'L39', icon: 'scroll', fact: 'Relació electrònica obligatòria amb persones jurídiques. No confondre amb la 40/2015.' },
  { id: 'a7-llei40', name: 'Llei 40/2015', eraId: 'admin', period: '1 octubre 2015', role: 'Règim sector públic', initials: 'L40', icon: 'scroll', fact: 'Règim jurídic del sector públic. Es preguntada confonent-la amb la 39/2015.' },
  { id: 'a7-eidas', name: 'eIDAS UE 910/2014', eraId: 'admin', period: 'Reglament UE', role: 'Signatura electrònica', initials: 'eID', icon: 'scroll', fact: 'Signatura electrònica reconeguda a tota la UE. Equivalent a la manuscrita.' },
  { id: 'a7-rgpd', name: 'RGPD UE 2016/679', eraId: 'control', period: 'Reglament UE', role: 'Protecció de dades', initials: 'RGPD', icon: 'scroll', fact: 'Reglament general europeu. Marc de protecció de dades personals.' },
  { id: 'a7-lopdgdd', name: 'LOPDGDD 3/2018', eraId: 'control', period: '5 desembre 2018', role: 'Llei estatal', initials: 'LOPD', icon: 'scroll', fact: 'Llei orgànica de protecció de dades i garantia dels drets digitals (Espanya).' },
];

const A7_EXAM: ExamItem[] = [
  { date: '1981', text: 'Inici societat de la informació · MS-DOS + IBM PC.' },
  { date: 'CIA', text: 'Confidencialitat · Integritat · Disponibilitat.' },
  { date: 'Sig. qualificada', text: 'Mateix valor jurídic que la signatura manuscrita.' },
  { date: 'LOPDGDD 3/2018', text: 'Llei orgànica protecció de dades de 5 de desembre.' },
  { date: '39/2015 vs 40/2015', text: 'Procediment administratiu (39) ≠ Règim sector públic (40). Cauen sovint.' },
  { date: 'RGPD UE 2016/679', text: 'Reglament europeu de protecció de dades.' },
  { date: 'eIDAS UE 910/2014', text: 'Reglament europeu signatura electrònica.' },
  { date: 'Safety vs Security', text: 'EN: safety = física · security = lògica. En llatí · "seguretat" únic.' },
  { date: 'idCAT/idCAT Mòbil/DNIe/Cl@ve', text: 'Identificadors digitals a Catalunya.' },
  { date: 'LO 4/1997 i LO 7/2021', text: 'Videovigilància en espais públics.' },
];

const ESQUEMA_A7: Esquema = {
  id: 'esq-mos-a7',
  temaSlug: 'a7-les-tecnologies-de-la-informacio-en-el-segle-xxi',
  ambit: 'A',
  kicker: 'ÀMBIT A · TEMA A.7',
  title: 'Tecnologies de la',
  titleHighlight: 'informació · s. XXI',
  introOneLiner: 'Societat del coneixement, impacte de les TIC, seguretat de la informació (tríada CIA), administració electrònica i signatura electrònica, videovigilància i big data policial.',
  kpis: [
    { value: '1981', label: 'naixement', mono: true },
    { value: '6', label: 'blocs temàtics' },
    { value: '31', label: 'conceptes clau' },
    { value: '6', label: 'normes i conceptes' },
    { value: '~ 5 min', label: 'lectura', mono: true },
  ],
  eras: A7_ERAS,
  timeline: A7_TIMELINE,
  people: A7_PEOPLE,
  exam: A7_EXAM,
  testHref: '/mossos/a7-les-tecnologies-de-la-informacio-en-el-segle-xxi',
  labels: { eras: 'Blocs', timeline: 'Conceptes i normes', people: 'Normes clau' },
};

// ─── Registre d'esquemes disponibles ───────────────────────────
const ESQUEMAS: Record<string, Esquema> = {
  [ESQUEMA_A1.id]: ESQUEMA_A1,
  [ESQUEMA_A2.id]: ESQUEMA_A2,
  [ESQUEMA_A3.id]: ESQUEMA_A3,
  [ESQUEMA_A4.id]: ESQUEMA_A4,
  [ESQUEMA_A5.id]: ESQUEMA_A5,
  [ESQUEMA_A6.id]: ESQUEMA_A6,
  [ESQUEMA_A7.id]: ESQUEMA_A7,
};

export function getEsquema(id: string): Esquema | undefined {
  return ESQUEMAS[id];
}

export function listEsquemas(): Esquema[] {
  return Object.values(ESQUEMAS);
}

export function getEsquemaForTemaSlug(slug: string): Esquema | undefined {
  return listEsquemas().find((e) => e.temaSlug === slug);
}
