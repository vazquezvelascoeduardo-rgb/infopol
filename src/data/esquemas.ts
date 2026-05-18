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

// ═══════════════════════════════════════════════════════════════
// B.1 — Estatut d'autonomia de Catalunya (EAC)
// ═══════════════════════════════════════════════════════════════
const B1_ERAS: Era[] = [
  { id: 'antecedents', name: 'Antecedents · reforma 2006', range: '1979 → 2006', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'naturalesa', name: 'Naturalesa jurídica', range: 'paccionada · supraordenada', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'estructura', name: 'Contingut · estructura', range: '7 títols · 223 articles', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'simbols', name: 'Símbols i identitat', range: 'Catalunya = nacionalitat', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'drets', name: 'Drets (Títol I)', range: 'arts. 15-54', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'competencies', name: 'Competències (Títol IV)', range: 'arts. 110-173', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'seguretat', name: 'Seguretat pública (164)', range: 'art. 164 EAC', color: '#C0392B', soft: '#F4D2CE' },
];

const B1_TIMELINE: Milestone[] = [
  { eraId: 'antecedents', date: 'LO 4/1979', title: "Primer Estatut d'autonomia", note: 'De 18 de desembre.' },
  { eraId: 'antecedents', date: '9 feb. 2004', title: 'Inici del procés de reforma' },
  { eraId: 'antecedents', date: '30 set. 2005', title: 'Aprovació al Ple del Parlament', note: '120 a favor / 15 en contra.' },
  { eraId: 'antecedents', date: '30 març 2006', title: 'Aprovació al Congrés' },
  { eraId: 'antecedents', date: '10 maig 2006', title: 'Aprovació al Senat' },
  { eraId: 'antecedents', date: '18 juny 2006', title: 'Referèndum positiu', star: true },
  { eraId: 'antecedents', date: '19 juliol 2006', title: 'LO 6/2006 · promulgació', star: true },
  { eraId: 'antecedents', date: '9 agost 2006', title: 'Entrada en vigor de l\'EAC', star: true },
  { eraId: 'antecedents', date: '28 juny 2010', title: 'STC 31/2010', note: 'Declara inconstitucionals diversos articles.', star: true },
  { eraId: 'naturalesa', date: 'Art. 147.1 CE', title: 'Norma institucional bàsica' },
  { eraId: 'naturalesa', date: 'Bloc constit.', title: 'Forma part del bloc de constitucionalitat' },
  { eraId: 'naturalesa', date: 'Art. 152.2 CE', title: 'Referèndum preceptiu i vinculant', note: 'Per a la reforma.' },
  { eraId: 'estructura', date: '7 títols', title: 'Estructura formal', note: 'I drets · II institucions · III judicial · IV competències · V relacions · VI finançament · VII reforma.', star: true },
  { eraId: 'estructura', date: '223 articles', title: 'Articulat' },
  { eraId: 'estructura', date: 'Preàmbul', title: 'Catalunya com a nació', note: 'Sense valor normatiu, però interpretatiu.' },
  { eraId: 'simbols', date: 'Art. 1', title: 'Catalunya = nacionalitat', star: true },
  { eraId: 'simbols', date: 'Art. 6', title: 'Català · llengua pròpia', note: 'Català i castellà = oficials.' },
  { eraId: 'simbols', date: 'Art. 11', title: 'Aranès oficial', note: "Llengua pròpia de l'Aran." },
  { eraId: 'simbols', date: 'Art. 8', title: 'Símbols nacionals', note: 'Bandera, Diada 11/9, "Els segadors".' },
  { eraId: 'drets', date: 'Capítol I', title: 'Drets àmbit civil i social' },
  { eraId: 'drets', date: 'Capítol II', title: "Drets polítics i de l'Administració" },
  { eraId: 'drets', date: 'Capítol III', title: 'Drets i deures lingüístics' },
  { eraId: 'drets', date: 'Capítol IV', title: 'Garanties dels drets', note: 'Recurs davant el TSJC.' },
  { eraId: 'drets', date: 'Capítol V', title: 'Principis rectors' },
  { eraId: 'competencies', date: 'Art. 110', title: 'Competències exclusives', note: 'Legislativa + reglamentària + executiva.', star: true },
  { eraId: 'competencies', date: 'Art. 111', title: 'Competències compartides', note: 'Marc de les bases que fixa l\'Estat.', star: true },
  { eraId: 'competencies', date: 'Art. 112', title: 'Competències executives', note: 'Potestat reglamentària + funció executiva.', star: true },
  { eraId: 'seguretat', date: 'Art. 164.1', title: 'Planificació + MdE + trànsit', note: 'Generalitat: planificació, creació PG-ME, control trànsit.', star: true },
  { eraId: 'seguretat', date: 'Art. 164.2', title: 'Comandament suprem PG-ME', note: 'Coordinació policies locals.', star: true },
  { eraId: 'seguretat', date: 'Art. 164.4', title: 'Junta de Seguretat', note: 'Paritària Generalitat-Estat. Presidida pel president.', star: true },
  { eraId: 'seguretat', date: 'Art. 164.5', title: 'Camps PG-ME', note: 'Seguretat ciutadana · policia administrativa · policia judicial.', star: true },
];

const B1_PEOPLE: EsquemaPerson[] = [
  { id: 'b1-lo62006', name: 'LO 6/2006', eraId: 'antecedents', period: '19 juliol 2006', role: 'EAC vigent', initials: 'LO6', icon: 'scroll', fact: 'Estatut d\'autonomia vigent. Entrada en vigor 9 d\'agost 2006.' },
  { id: 'b1-stc312010', name: 'STC 31/2010', eraId: 'antecedents', period: '28 juny 2010', role: 'Sentència del TC', initials: 'STC', icon: 'scroll', fact: 'Declara inconstitucionals articles sobre llengua, Consell de Garanties, Síndic, justícia, tributs.' },
  { id: 'b1-art164', name: 'Article 164 EAC', eraId: 'seguretat', period: 'Seguretat pública', role: 'Competència Generalitat', initials: '164', icon: 'sword', fact: 'Article clau d\'oposició. Planificació, creació MdE, trànsit i comandament.' },
  { id: 'b1-art1491', name: 'Art. 149.1.29 CE', eraId: 'seguretat', period: 'Seguretat estatal', role: 'Competència Estat', initials: '149', icon: 'scroll', fact: 'Competència exclusiva de l\'Estat sobre seguretat pública. NO confondre amb art. 164 EAC.' },
];

const B1_EXAM: ExamItem[] = [
  { date: 'LO 6/2006', text: "EAC vigent · 19 juliol 2006 · entrada en vigor 9 d'agost." },
  { date: 'STC 31/2010', text: 'Retallades dels articles sobre llengua, justícia, finances locals.' },
  { date: 'Art. 164 EAC', text: 'Planificació + creació MdE + trànsit. NO confondre amb 149.1.29 CE.' },
  { date: '7 títols · 223 art.', text: 'Estructura formal. Títol IV = competències · V = relacions institucionals.' },
  { date: '3 tipus competències', text: 'Exclusives (110) / compartides (111) / executives (112).' },
  { date: 'Junta Seguretat', text: 'Paritària, presidida pel president de la Generalitat.' },
  { date: 'Catalunya', text: 'Nacionalitat (art. 1) · preàmbul la defineix com a nació.' },
  { date: 'Símbols (art. 8)', text: 'Bandera quadribarrada · Diada 11 setembre · "Els segadors".' },
];

const ESQUEMA_B1: Esquema = {
  id: 'esq-mos-b1',
  temaSlug: 'b1-l-estatut-d-autonomia-de-catalunya-eac',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.1',
  title: 'Estatut d\'autonomia',
  titleHighlight: 'de Catalunya',
  introOneLiner: "L'EAC vigent és la LO 6/2006, de 19 de juliol, entrada en vigor el 9 d'agost. Norma institucional bàsica, doble naturalesa. La STC 31/2010 va declarar inconstitucionals diversos articles.",
  kpis: [
    { value: '223', label: 'articles' },
    { value: '7', label: 'blocs temàtics' },
    { value: '31', label: 'fites clau' },
    { value: '4', label: 'normes i articles' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B1_ERAS,
  timeline: B1_TIMELINE,
  people: B1_PEOPLE,
  exam: B1_EXAM,
  testHref: '/mossos/b1-l-estatut-d-autonomia-de-catalunya-eac',
  labels: { eras: 'Blocs', timeline: 'Articles i dates', people: 'Normes clau' },
};

// ═══════════════════════════════════════════════════════════════
// B.2 — Institucions polítiques de Catalunya
// ═══════════════════════════════════════════════════════════════
const B2_ERAS: Era[] = [
  { id: 'generalitat', name: 'Generalitat', range: 'sistema parlamentari', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'parlament', name: 'Parlament', range: '135 diputats', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'presidencia', name: 'Presidència', range: 'triple condició', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'govern', name: 'Govern · Administració', range: 'art. 68 EAC', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'institucions', name: 'Altres institucions', range: 'estatutàries', color: '#0BB4C2', soft: '#CCEEF1' },
];

const B2_TIMELINE: Milestone[] = [
  { eraId: 'generalitat', date: 'Composició', title: 'Parlament + Presidència + Govern' },
  { eraId: 'generalitat', date: 'Art. 152.1 CE', title: 'Sistema parlamentari', note: 'President i Govern responsables davant el Parlament.', star: true },
  { eraId: 'generalitat', date: 'Llei 13/2008', title: 'Presidència i Govern', note: 'De 5 de novembre.', star: true },
  { eraId: 'parlament', date: '135', title: 'Diputats actuals', note: 'Mín. 100 / màx. 150.', star: true },
  { eraId: 'parlament', date: 'BCN 85', title: 'Diputats Barcelona' },
  { eraId: 'parlament', date: 'TGN 18', title: 'Diputats Tarragona' },
  { eraId: 'parlament', date: 'GIR 17', title: 'Diputats Girona' },
  { eraId: 'parlament', date: 'LLE 15', title: 'Diputats Lleida' },
  { eraId: 'parlament', date: '4 anys', title: 'Mandat' },
  { eraId: 'parlament', date: '22 des. 2005', title: 'Reglament del Parlament' },
  { eraId: 'parlament', date: 'Inviolabilitat', title: 'Prerrogativa diputat', note: 'Opinions, manifestacions i vots.', star: true },
  { eraId: 'parlament', date: 'Immunitat', title: 'No detenció a Catalunya', note: 'Excepte delicte flagrant.', star: true },
  { eraId: 'parlament', date: 'Fur', title: 'TSJC (dins) · TS Sala Penal (fora)' },
  { eraId: 'parlament', date: 'Mesa', title: '1 president + 2 vicepresidents + 4 secretaris' },
  { eraId: 'parlament', date: 'Dip. Permanent', title: '23 membres', note: 'Continuïtat entre sessions.' },
  { eraId: 'parlament', date: '16/8 — 31/12', title: '1r període ordinari', star: true },
  { eraId: 'parlament', date: '15/1 — 31/7', title: '2n període ordinari', star: true },
  { eraId: 'parlament', date: 'DOGC', title: 'Publicació de lleis i pressupostos' },
  { eraId: 'presidencia', date: '1a votació', title: 'Majoria absoluta', star: true },
  { eraId: 'presidencia', date: '2a (48h)', title: 'Majoria simple', star: true },
  { eraId: 'presidencia', date: '2 mesos', title: 'Sense investidura → dissolució automàtica', star: true },
  { eraId: 'presidencia', date: 'Rei', title: 'Nomenament pel Rei' },
  { eraId: 'presidencia', date: 'Triple', title: 'Cap Govern + president CA + representant Estat' },
  { eraId: 'govern', date: 'Composició', title: 'President + (vicepresident) + consellers' },
  { eraId: 'govern', date: 'Art. 63 EAC', title: 'Decrets legislatius', note: 'Per delegació del Parlament.' },
  { eraId: 'govern', date: 'Art. 64 EAC', title: 'Decrets llei', note: 'Necessitat extraordinària i urgent.' },
  { eraId: 'govern', date: 'Departaments', title: 'Estructura administrativa' },
  { eraId: 'institucions', date: 'Art. 76-77', title: 'CGE · Consell de Garanties Estatutàries', note: '2/3 Parlament + 1/3 Govern.', star: true },
  { eraId: 'institucions', date: 'Art. 78', title: 'Síndic de Greuges', note: 'Defensa drets fonamentals.', star: true, personId: 'b2-sindic' },
  { eraId: 'institucions', date: '6 anys', title: 'Mandat Síndic · NO reelegible', star: true },
  { eraId: 'institucions', date: '3/5', title: 'Majoria elecció Síndic' },
  { eraId: 'institucions', date: 'Art. 80', title: 'Sindicatura de Comptes', note: '7 síndics · 6 anys · 3/5.', star: true },
  { eraId: 'institucions', date: 'Art. 82', title: 'CAC · Audiovisual', note: 'Autoritat reguladora independent.' },
];

const B2_PEOPLE: EsquemaPerson[] = [
  { id: 'b2-parlament', name: 'Parlament', eraId: 'parlament', period: '135 diputats', role: 'Cambra única', initials: 'PCT', icon: 'flag', fact: 'BCN 85 + TGN 18 + GIR 17 + LLE 15. Mandat 4 anys. Seu: Parc Ciutadella.' },
  { id: 'b2-llei132008', name: 'Llei 13/2008', eraId: 'generalitat', period: '5 nov. 2008', role: 'Llei Presidència', initials: 'L13', icon: 'scroll', fact: 'De la presidència de la Generalitat i del Govern.' },
  { id: 'b2-sindic', name: 'Síndic de Greuges', eraId: 'institucions', period: '6 anys · no reelegible', role: 'Defensor de drets', initials: 'SG', icon: 'flag', fact: 'Elegit pel Parlament per 3/5. Coopera amb Defensor del Poble.' },
  { id: 'b2-cge', name: 'Consell de Garanties Estatutàries', eraId: 'institucions', period: '2/3 Parl. + 1/3 Govern', role: 'Òrgan consultiu', initials: 'CGE', icon: 'scroll', fact: 'Dictamina sobre adequació a EAC i CE.' },
  { id: 'b2-sindicatura', name: 'Sindicatura de Comptes', eraId: 'institucions', period: '7 síndics · 6 anys', role: 'Fiscalització externa', initials: 'SC', icon: 'scroll', fact: 'Depèn orgànicament del Parlament. Designació per 3/5.' },
  { id: 'b2-cac', name: 'Consell de l\'Audiovisual', eraId: 'institucions', period: 'CAC', role: 'Autoritat reguladora', initials: 'CAC', icon: 'flag', fact: 'Comunicació audiovisual. Potestats reglamentària, sancionadora i inspectora.' },
];

const B2_EXAM: ExamItem[] = [
  { date: '135', text: 'Diputats. 85 BCN + 18 TGN + 17 GIR + 15 LLE. Mandat 4 anys.' },
  { date: '16/8-31/12 + 15/1-31/7', text: 'Períodes ordinaris de sessions.' },
  { date: '1a abs. / 2a simple', text: 'Investidura. 2 mesos sense → dissolució automàtica.' },
  { date: '6 anys / 3/5', text: 'Síndic de Greuges. NO reelegible.' },
  { date: '7 síndics / 6 anys / 3/5', text: 'Sindicatura de Comptes.' },
  { date: 'Diputat', text: 'Inviolabilitat (opinions) + immunitat (no detenció excepte flagrant) + fur (TSJC dins, TS fora).' },
  { date: 'Llei 13/2008', text: 'Presidència de la Generalitat i del Govern.' },
  { date: 'CGE', text: '2/3 a proposta del Parlament + 1/3 del Govern.' },
];

const ESQUEMA_B2: Esquema = {
  id: 'esq-mos-b2',
  temaSlug: 'b2-les-institucions-politiques-de-catalunya',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.2',
  title: 'Institucions polítiques',
  titleHighlight: 'de Catalunya',
  introOneLiner: 'Sistema institucional d\'autogovern. Generalitat = Parlament + Presidència + Govern. Sistema parlamentari. Institucions estatutàries (CGE, Síndic, Sindicatura, CAC).',
  kpis: [
    { value: '135', label: 'diputats' },
    { value: '5', label: 'blocs temàtics' },
    { value: '33', label: 'fites clau' },
    { value: '6', label: 'institucions' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B2_ERAS,
  timeline: B2_TIMELINE,
  people: B2_PEOPLE,
  exam: B2_EXAM,
  testHref: '/mossos/b2-les-institucions-politiques-de-catalunya',
  labels: { eras: 'Blocs', timeline: 'Articles i dades', people: 'Institucions' },
};

// ═══════════════════════════════════════════════════════════════
// B.3 — L'ordenament jurídic de l'Estat
// ═══════════════════════════════════════════════════════════════
const B3_ERAS: Era[] = [
  { id: 'ordenament', name: 'Ordenament jurídic', range: 'principis', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'ce', name: 'Constitució espanyola', range: '1978 · 169 art.', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'llei', name: 'La llei', range: 'orgànica · ordinària', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'rangllei', name: 'Normes amb rang de llei', range: 'decret llei · legislatiu', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'reglament', name: 'Reglament', range: 'poder executiu', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'tractats', name: 'Tractats internacionals', range: 'art. 93-96 CE', color: '#1FB286', soft: '#CDF0E1' },
];

const B3_TIMELINE: Milestone[] = [
  { eraId: 'ordenament', date: 'Principi 1', title: 'Jerarquia', note: 'La norma superior preval.', star: true },
  { eraId: 'ordenament', date: 'Principi 2', title: 'Temporalitat', note: 'Norma posterior deroga anterior.' },
  { eraId: 'ordenament', date: 'Principi 3', title: 'Especialitat', note: 'Norma especial preval sobre general.' },
  { eraId: 'ordenament', date: 'Principi 4', title: 'Competència', note: "Aprovació per òrgan competent." },
  { eraId: 'ordenament', date: 'Art. 149.3 CE', title: 'Clàusula supletorietat + prevalença', star: true },
  { eraId: 'ce', date: '6 des. 1978', title: 'Aprovada en referèndum', star: true },
  { eraId: 'ce', date: '169 art.', title: '11 títols + preàmbul', star: true },
  { eraId: 'ce', date: '1992', title: 'Reforma art. 13.2', note: 'Sufragi passiu UE a municipals.', star: true },
  { eraId: 'ce', date: '2011', title: 'Reforma art. 135', note: 'Estabilitat pressupostària.', star: true },
  { eraId: 'ce', date: 'Títol prel.', title: 'Principis · forma Estat · llengües' },
  { eraId: 'ce', date: 'Títol I', title: 'Drets fonamentals' },
  { eraId: 'ce', date: 'Títol II', title: 'Corona' },
  { eraId: 'ce', date: 'Títol III', title: 'Corts Generals' },
  { eraId: 'ce', date: 'Títol IV', title: 'Govern · Administració' },
  { eraId: 'ce', date: 'Títol V', title: 'Relacions Govern-Corts' },
  { eraId: 'ce', date: 'Títol VI', title: 'Poder judicial' },
  { eraId: 'ce', date: 'Títol VII', title: 'Economia i finances' },
  { eraId: 'ce', date: 'Títol VIII', title: 'Organització territorial' },
  { eraId: 'ce', date: 'Títol IX', title: 'Tribunal Constitucional' },
  { eraId: 'ce', date: 'Títol X', title: 'Reforma constitucional' },
  { eraId: 'llei', date: 'Art. 53.1 CE', title: 'Reserva de llei', note: 'Drets fonamentals.' },
  { eraId: 'llei', date: 'Art. 87 CE', title: 'Iniciativa legislativa', note: 'Govern · Congrés · Senat · parlaments CCAA · ciutadans.' },
  { eraId: 'llei', date: 'Art. 81 CE', title: 'Llei orgànica', note: 'DD.FF., EEAA, règim electoral. Majoria absoluta Congrés.', star: true },
  { eraId: 'llei', date: 'Ordinària', title: 'Resta de matèries', note: 'Majoria simple.' },
  { eraId: 'llei', date: 'Art. 150', title: 'Lleis de bases / marc / harmonització' },
  { eraId: 'rangllei', date: 'Art. 86 CE', title: 'Decret llei', note: 'Necessitat extraordinària. Convalidació 30 dies.', star: true },
  { eraId: 'rangllei', date: 'Limitacions DL', title: 'NO institucions, drets, CCAA, electoral', star: true },
  { eraId: 'rangllei', date: 'Art. 82 CE', title: 'Decret legislatiu', note: 'Per delegació del Parlament.', star: true },
  { eraId: 'rangllei', date: 'DLeg tipus', title: 'Text articulat / text refós' },
  { eraId: 'reglament', date: 'Classes', title: 'Jurídics / administratius' },
  { eraId: 'reglament', date: 'Contenciós-adm.', title: 'Control judicial' },
  { eraId: 'tractats', date: 'Art. 96 CE', title: 'Recepció interna', note: 'Vàlidament celebrats i publicats al BOE.' },
  { eraId: 'tractats', date: 'Art. 93 CE', title: 'Cessió competències a UE', note: 'Requereix llei orgànica.', star: true },
  { eraId: 'tractats', date: 'Art. 94.1 CE', title: 'Autorització Corts', note: 'Caràcter polític, militar, drets, hisenda, lleis.' },
  { eraId: 'tractats', date: 'Art. 94.2 CE', title: 'Informació immediata a les Corts' },
];

const B3_PEOPLE: EsquemaPerson[] = [
  { id: 'b3-ce', name: 'Constitució 1978', eraId: 'ce', period: '6 desembre 1978', role: 'Norma suprema', initials: 'CE', icon: 'crown', fact: '169 articles + 11 títols + preàmbul. Només 2 reformes (1992 i 2011).' },
  { id: 'b3-loorg', name: 'Llei orgànica', eraId: 'llei', period: 'Art. 81 CE', role: 'Reserva especial', initials: 'LO', icon: 'scroll', fact: 'DD.FF., EEAA, règim electoral. Majoria absoluta del Congrés en votació final.' },
  { id: 'b3-decretllei', name: 'Decret llei', eraId: 'rangllei', period: 'Art. 86 CE', role: 'Normes urgents', initials: 'DL', icon: 'sword', fact: 'Per necessitat extraordinària. Convalidació pel Congrés en 30 dies. Limitacions materials.' },
  { id: 'b3-decretleg', name: 'Decret legislatiu', eraId: 'rangllei', period: 'Art. 82 CE', role: 'Per delegació', initials: 'DLeg', icon: 'scroll', fact: 'Text articulat o text refós. NO es pot delegar matèria de llei orgànica.' },
  { id: 'b3-art93', name: 'Tractat art. 93', eraId: 'tractats', period: 'Cessió competències', role: 'Tractat UE', initials: '93', icon: 'flag', fact: 'Cessió de competències a organització supranacional. Cas UE = llei orgànica.' },
];

const B3_EXAM: ExamItem[] = [
  { date: '2', text: 'Reformes CE: art. 13.2 (1992) i art. 135 (2011).' },
  { date: '169 + 11', text: 'Articles + títols de la CE.' },
  { date: 'LO art. 81', text: 'Llei orgànica · majoria absoluta del Congrés en votació final.' },
  { date: 'DL vs DLeg', text: 'DL = urgència (convalidació 30 dies) · DLeg = delegació parlamentària.' },
  { date: 'DL limitacions', text: 'NO institucions bàsiques, drets, règim CCAA, dret electoral.' },
  { date: 'Art. 93 CE', text: 'Cessió competències a UE → llei orgànica.' },
  { date: '4 principis', text: 'Jerarquia · temporalitat · especialitat · competència.' },
  { date: 'Reglament', text: 'Norma del poder executiu, subordinada a la llei.' },
];

const ESQUEMA_B3: Esquema = {
  id: 'esq-mos-b3',
  temaSlug: 'b3-l-ordenament-juridic-de-l-estat',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.3',
  title: 'Ordenament jurídic',
  titleHighlight: "de l'Estat",
  introOneLiner: 'Conjunt sistemàtic de normes, encapçalat per la CE de 1978. Inclou lleis (orgàniques i ordinàries), normes amb rang de llei (decrets llei i legislatius), reglaments i tractats.',
  kpis: [
    { value: '1978', label: 'CE', mono: true },
    { value: '6', label: 'blocs temàtics' },
    { value: '35', label: 'fites clau' },
    { value: '5', label: 'tipus de normes' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B3_ERAS,
  timeline: B3_TIMELINE,
  people: B3_PEOPLE,
  exam: B3_EXAM,
  testHref: '/mossos/b3-l-ordenament-juridic-de-l-estat',
  labels: { eras: 'Blocs', timeline: 'Articles i normes', people: 'Tipus de norma' },
};

// ═══════════════════════════════════════════════════════════════
// B.4 — Drets humans i drets constitucionals
// ═══════════════════════════════════════════════════════════════
const B4_ERAS: Era[] = [
  { id: 'declaracions', name: 'Declaracions internacionals', range: '1948-2000', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'titol1', name: 'Títol I CE', range: 'arts. 10-55', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'penal', name: 'Procés penal · garanties', range: 'arts. 17 i 24', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'normatives', name: 'Garanties normatives', range: 'arts. 53 i 168', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'defensor', name: 'Defensor del Poble', range: 'art. 54', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'jurisd', name: 'Garanties jurisdiccionals', range: 'art. 53.2', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'suspensio', name: 'Suspensió de drets', range: 'art. 55', color: '#A4476E', soft: '#F4D8E4' },
];

const B4_TIMELINE: Milestone[] = [
  { eraId: 'declaracions', date: '10 des. 1948', title: 'DUDH', note: "Declaració Universal dels Drets Humans (ONU).", star: true },
  { eraId: 'declaracions', date: '4 nov. 1950', title: 'CEDH (Roma)', note: 'Conveni Europeu de Drets Humans · Consell d\'Europa.', star: true },
  { eraId: 'declaracions', date: '1966', title: 'PIDCP + PIDESC' },
  { eraId: 'declaracions', date: 'Estrasburg', title: 'TEDH · Tribunal Europeu', star: true },
  { eraId: 'declaracions', date: '2000 (Niça)', title: 'Carta Drets Fonamentals UE', note: 'Valor de tractat des de Lisboa 2009.' },
  { eraId: 'declaracions', date: '4 generacions', title: 'Civils-polítics / econòmics-socials / solidaritat / tecnologia' },
  { eraId: 'titol1', date: 'Cap. I (11-13)', title: 'Espanyols i estrangers' },
  { eraId: 'titol1', date: 'Cap. II Sec. 1', title: 'Drets fonamentals (15-29)', note: 'Màxima protecció · recurs empara.', star: true },
  { eraId: 'titol1', date: 'Cap. II Sec. 2', title: 'Drets i deures ciutadans (30-38)' },
  { eraId: 'titol1', date: 'Cap. III', title: 'Principis rectors (39-52)', note: 'Mínima protecció.' },
  { eraId: 'titol1', date: 'Art. 14', title: 'Igualtat davant la llei', note: 'Mateixa protecció que Secció 1a.', star: true },
  { eraId: 'titol1', date: 'Art. 15', title: 'Dret a la vida i integritat' },
  { eraId: 'titol1', date: 'Art. 16', title: 'Llibertat ideològica i religiosa' },
  { eraId: 'titol1', date: 'Art. 17', title: 'Llibertat i seguretat · 72 h detenció', star: true },
  { eraId: 'titol1', date: 'Art. 18', title: 'Honor, intimitat, inviolabilitat domicili', star: true },
  { eraId: 'titol1', date: 'Art. 20', title: 'Llibertats d\'expressió i informació' },
  { eraId: 'titol1', date: 'Art. 24', title: 'Tutela judicial efectiva', star: true },
  { eraId: 'titol1', date: 'Art. 25', title: 'Legalitat penal · reeducació' },
  { eraId: 'penal', date: '72 h', title: 'Detenció màxima (art. 17)', note: '5 dies en terrorisme (suspensió individual).', star: true },
  { eraId: 'penal', date: 'Habeas corpus', title: 'Posada a disposició judicial', star: true },
  { eraId: 'penal', date: 'Drets detingut', title: 'Ser informat · no declarar · advocat · habeas corpus', star: true },
  { eraId: 'penal', date: 'Art. 24', title: 'Garanties processals', note: 'Tutela, jutge predeterminat, defensa, prova, presumpció d\'innocència.' },
  { eraId: 'penal', date: 'Art. 25', title: 'Nullum crimen sine lege', note: 'Penes orientades a reeducació i reinserció.' },
  { eraId: 'normatives', date: 'Art. 81 CE', title: 'Reserva de llei orgànica', note: 'Drets de Secció 1a.', star: true },
  { eraId: 'normatives', date: 'Art. 53.1 CE', title: 'Contingut essencial', note: 'Vincula tots els poders públics.' },
  { eraId: 'normatives', date: 'Art. 168 CE', title: 'Reforma agreujada', note: 'Drets fonamentals i Corona. Referèndum obligatori.', star: true },
  { eraId: 'defensor', date: 'LO 3/1981', title: 'Defensor del Poble', note: 'De 6 d\'abril. Designat per les Corts.', star: true },
  { eraId: 'defensor', date: '5 anys', title: 'Mandat', note: 'Pot interposar empara i inconstitucionalitat.' },
  { eraId: 'jurisd', date: 'Recurs empara', title: 'TC · Drets art. 14 + Secció 1a + 30', note: 'Subsidiari · termini 30 dies.', star: true },
  { eraId: 'jurisd', date: 'LO 6/1984', title: 'Habeas corpus', note: 'De 24 de maig.', star: true },
  { eraId: 'jurisd', date: 'Preferent i sumari', title: 'Procediment tribunals ordinaris' },
  { eraId: 'suspensio', date: 'LO 4/1981', title: 'Estats alarma, excepció i setge', note: "D'1 de juny.", star: true },
  { eraId: 'suspensio', date: 'Art. 55.1', title: 'Suspensió general', note: 'Excepció o setge (NO alarma).' },
  { eraId: 'suspensio', date: 'Art. 55.2', title: 'Suspensió individual', note: 'Bandes armades o terrorisme.' },
];

const B4_PEOPLE: EsquemaPerson[] = [
  { id: 'b4-dudh', name: 'DUDH', eraId: 'declaracions', period: '10 desembre 1948', role: 'Declaració ONU', initials: 'DUDH', icon: 'scroll', fact: "Declaració Universal dels Drets Humans, marc internacional bàsic." },
  { id: 'b4-cedh', name: 'CEDH', eraId: 'declaracions', period: '4 novembre 1950', role: 'Conveni Roma', initials: 'CEDH', icon: 'scroll', fact: "Conveni Europeu de Drets Humans. Consell d'Europa. TEDH a Estrasburg." },
  { id: 'b4-art17', name: 'Art. 17 CE', eraId: 'penal', period: '72 hores', role: 'Llibertat i seguretat', initials: '17', icon: 'sword', fact: 'Detenció màxima 72 h. Habeas corpus. Drets del detingut.' },
  { id: 'b4-lo31981', name: 'LO 3/1981', eraId: 'defensor', period: '6 abril 1981', role: 'Defensor del Poble', initials: 'LO3', icon: 'flag', fact: 'Llei orgànica del Defensor del Poble. Mandat 5 anys.' },
  { id: 'b4-lo41981', name: 'LO 4/1981', eraId: 'suspensio', period: "1 juny 1981", role: "Estats d'excepció", initials: 'LO4', icon: 'scroll', fact: 'Llei orgànica dels estats d\'alarma, excepció i setge.' },
  { id: 'b4-lo61984', name: 'LO 6/1984', eraId: 'jurisd', period: '24 maig 1984', role: 'Habeas corpus', initials: 'LO6', icon: 'scroll', fact: 'Llei orgànica reguladora del procediment d\'habeas corpus.' },
];

const B4_EXAM: ExamItem[] = [
  { date: '72 h', text: 'Detenció màxima (art. 17). 5 dies en terrorisme via art. 55.2.' },
  { date: 'Art. 14 + 15-29', text: 'Drets de la Secció 1a + igualtat. Recurs d\'empara.' },
  { date: 'Art. 168', text: 'Reforma agreujada per drets fonamentals i Corona. Referèndum obligatori.' },
  { date: "Estat alarma", text: 'NO suspèn drets. Excepció i setge sí (art. 55.1).' },
  { date: 'LO 3/1981 / 4/1981 / 6/1984', text: 'Defensor del Poble / Estats / Habeas corpus.' },
  { date: 'Recurs empara', text: 'Subsidiari · cal exhaurir via ordinària · 30 dies.' },
  { date: 'Drets detingut', text: 'Ser informat · no declarar · advocat · habeas corpus.' },
  { date: 'DUDH / CEDH', text: '10 desembre 1948 (ONU) / 4 novembre 1950 (Roma).' },
];

const ESQUEMA_B4: Esquema = {
  id: 'esq-mos-b4',
  temaSlug: 'b4-els-drets-humans-i-els-drets-constitucionals',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.4',
  title: 'Drets humans i',
  titleHighlight: 'drets constitucionals',
  introOneLiner: 'Drets fonamentals i llibertats públiques al Títol I CE. Marc internacional (DUDH, CEDH), classificació segons grau de protecció, garanties normatives (LO), institucionals (Defensor) i jurisdiccionals (empara).',
  kpis: [
    { value: '7', label: 'blocs temàtics' },
    { value: '34', label: 'fites clau' },
    { value: '6', label: 'normes i drets' },
    { value: '72 h', label: 'detenció màx.' },
    { value: '~ 7 min', label: 'lectura', mono: true },
  ],
  eras: B4_ERAS,
  timeline: B4_TIMELINE,
  people: B4_PEOPLE,
  exam: B4_EXAM,
  testHref: '/mossos/b4-els-drets-humans-i-els-drets-constitucionals',
  labels: { eras: 'Blocs', timeline: 'Articles i lleis', people: 'Normes clau' },
};

// ═══════════════════════════════════════════════════════════════
// B.5 — Institucions polítiques de l'Estat
// ═══════════════════════════════════════════════════════════════
const B5_ERAS: Era[] = [
  { id: 'corts', name: 'Corts Generals', range: 'Congrés + Senat', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'govern', name: 'Govern', range: 'Llei 50/1997', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'corona', name: 'Corona', range: 'arts. 56-65', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'altres', name: 'Altres institucions', range: 'TCu · Estat · CES', color: '#5E3A8A', soft: '#E3D4F2' },
];

const B5_TIMELINE: Milestone[] = [
  { eraId: 'corts', date: 'Art. 66 CE', title: 'Representen el poble espanyol', note: 'Sistema bicameral.', star: true },
  { eraId: 'corts', date: '350', title: 'Diputats actuals', note: 'Mín. 300 / màx. 400.', star: true },
  { eraId: 'corts', date: "D'Hondt", title: 'Sistema electoral proporcional' },
  { eraId: 'corts', date: '18 anys', title: 'Edat per votar i ser elegit' },
  { eraId: 'corts', date: 'Art. 69 CE', title: 'Senat · representació territorial', note: '4 senadors per província (regla general).' },
  { eraId: 'corts', date: 'Senadors CAT', title: '8 autonòmics + 16 directes' },
  { eraId: 'corts', date: 'Inviol+Imm+Fur', title: 'Prerrogatives parlamentàries', note: 'TS Sala Penal.' },
  { eraId: 'corts', date: 'Setembre-desembre', title: '1r període ordinari' },
  { eraId: 'corts', date: 'Febrer-juny', title: '2n període ordinari' },
  { eraId: 'corts', date: '21 membres', title: 'Diputació Permanent (mín.)' },
  { eraId: 'govern', date: 'Llei 50/1997', title: 'Llei del Govern', note: '27 de novembre.', star: true },
  { eraId: 'govern', date: 'Art. 97 CE', title: 'Funcions del Govern', note: 'Política interior/exterior, Administració, defensa, funció executiva, potestat reglamentària.', star: true },
  { eraId: 'govern', date: '1a votació', title: 'Investidura: majoria absoluta', star: true },
  { eraId: 'govern', date: '2a (48h)', title: 'Majoria simple', star: true },
  { eraId: 'govern', date: '2 mesos', title: 'Sense èxit → dissolució automàtica', star: true },
  { eraId: 'govern', date: 'Art. 99 CE', title: 'Procediment investidura' },
  { eraId: 'govern', date: 'Art. 113 CE', title: 'Moció censura constructiva', note: '1/10 dip · candidat alternatiu · majoria absoluta.', star: true },
  { eraId: 'govern', date: 'Art. 112 CE', title: 'Qüestió de confiança', note: 'Majoria simple.' },
  { eraId: 'corona', date: 'Art. 56 CE', title: 'Rei = cap de l\'Estat', star: true },
  { eraId: 'corona', date: 'Art. 57 CE', title: 'Successió a la Corona', note: 'Primogenitura · representació · mascle sobre femella (mateix grau).', star: true },
  { eraId: 'corona', date: '18 anys', title: 'Major d\'edat per regnar' },
  { eraId: 'corona', date: 'Príncep d\'Astúries', title: 'Títol del successor' },
  { eraId: 'corona', date: 'Art. 62 CE', title: 'Funcions del Rei', note: 'Sancionar lleis, convocar Corts, nomenar President, FFAA, gràcia.' },
  { eraId: 'corona', date: 'Art. 56.3 CE', title: 'Inviolable · no responsable', star: true },
  { eraId: 'corona', date: 'Refrendament', title: 'Contrasignat per President o ministres', star: true },
  { eraId: 'corona', date: 'Art. 59 CE', title: 'Regència' },
  { eraId: 'altres', date: 'Art. 136 CE', title: 'Tribunal de Comptes', note: 'Fiscalització externa. LO 2/1982.', star: true },
  { eraId: 'altres', date: 'Art. 107 CE', title: "Consell d'Estat", note: 'Suprem òrgan consultiu del Govern. LO 3/1980.', star: true },
  { eraId: 'altres', date: 'CES', title: 'Consell Econòmic i Social', note: 'Òrgan consultiu socioeconòmic.' },
];

const B5_PEOPLE: EsquemaPerson[] = [
  { id: 'b5-congres', name: 'Congrés dels Diputats', eraId: 'corts', period: '350 diputats', role: 'Cambra representació popular', initials: 'CD', icon: 'flag', fact: 'Sistema D\'Hondt. Mandat 4 anys. Mín. 300 / màx. 400.' },
  { id: 'b5-senat', name: 'Senat', eraId: 'corts', period: 'Cambra territorial', role: 'Composició mixta', initials: 'SE', icon: 'flag', fact: 'Senadors directes (4 per província) + autonòmics (1 per CA + 1 per cada milió).' },
  { id: 'b5-llei501997', name: 'Llei 50/1997', eraId: 'govern', period: '27 nov. 1997', role: 'Llei del Govern', initials: 'L50', icon: 'scroll', fact: 'Regula composició, organització i funcionament del Govern.' },
  { id: 'b5-art113', name: 'Moció censura', eraId: 'govern', period: 'Art. 113 CE', role: 'Constructiva', initials: '113', icon: 'sword', fact: 'Inclou candidat alternatiu. Majoria absoluta. Presentada per 1/10 dels diputats.' },
  { id: 'b5-tcu', name: 'Tribunal de Comptes', eraId: 'altres', period: 'LO 2/1982', role: 'Fiscalització externa', initials: 'TCu', icon: 'scroll', fact: 'Depèn directament de les Corts Generals. 12 maig 1982.' },
  { id: 'b5-conestat', name: "Consell d'Estat", eraId: 'altres', period: 'LO 3/1980', role: 'Òrgan consultiu', initials: 'CdE', icon: 'scroll', fact: 'Suprem òrgan consultiu del Govern. 22 abril 1980.' },
];

const B5_EXAM: ExamItem[] = [
  { date: '350', text: 'Diputats Congrés. Mín. 300 / màx. 400. Sistema D\'Hondt.' },
  { date: 'Investidura', text: '1a abs. / 2a (48h) simple / 2 mesos sense → dissolució (idèntic al sistema català).' },
  { date: 'Art. 113', text: 'Moció censura constructiva: 1/10 diputats, majoria absoluta, candidat.' },
  { date: 'Art. 112', text: 'Qüestió de confiança: majoria simple.' },
  { date: 'Successió', text: 'Primogenitura · representació · mascle sobre femella (mateix grau).' },
  { date: 'Refrendament', text: 'Actes del Rei contrasignats (President del Govern o ministres).' },
  { date: 'Llei 50/1997', text: 'Llei del Govern (27 de novembre).' },
  { date: 'Lleis orgàniques', text: 'TCu = LO 2/1982 · Consell d\'Estat = LO 3/1980 · Defensor del Poble = LO 3/1981.' },
];

const ESQUEMA_B5: Esquema = {
  id: 'esq-mos-b5',
  temaSlug: 'b5-les-institucions-politiques-de-l-estat',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.5',
  title: 'Institucions polítiques',
  titleHighlight: "de l'Estat",
  introOneLiner: 'Corts Generals (Congrés i Senat) + Govern (Llei 50/1997) + Corona (arts. 56-65 CE) + altres òrgans constitucionals (TCu, Consell d\'Estat, CES, Defensor del Poble).',
  kpis: [
    { value: '350', label: 'diputats Congrés' },
    { value: '4', label: 'blocs temàtics' },
    { value: '29', label: 'fites clau' },
    { value: '6', label: 'institucions' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B5_ERAS,
  timeline: B5_TIMELINE,
  people: B5_PEOPLE,
  exam: B5_EXAM,
  testHref: '/mossos/b5-les-institucions-politiques-de-l-estat',
  labels: { eras: 'Blocs', timeline: 'Articles i lleis', people: 'Institucions' },
};

// ═══════════════════════════════════════════════════════════════
// B.6 — Òrgans jurisdiccionals: poder judicial i TC
// ═══════════════════════════════════════════════════════════════
const B6_ERAS: Era[] = [
  { id: 'judicial', name: 'Poder judicial', range: 'Títol VI CE · LOPJ', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'cgpj', name: 'CGPJ', range: 'art. 122 CE', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'fiscal', name: 'Ministeri Fiscal', range: 'art. 124 CE', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'tc', name: 'Tribunal Constitucional', range: 'Títol IX · LOTC', color: '#C0392B', soft: '#F4D2CE' },
];

const B6_TIMELINE: Milestone[] = [
  { eraId: 'judicial', date: 'Art. 117 CE', title: 'Potestat jurisdiccional', note: 'Jutjar i fer executar el jutjat.', star: true },
  { eraId: 'judicial', date: 'LO 6/1985', title: 'LOPJ · 1 juliol', note: 'Llei orgànica del Poder Judicial.', star: true },
  { eraId: 'judicial', date: 'Justícia', title: 'Emanada del poble · en nom del Rei' },
  { eraId: 'judicial', date: 'Jutges', title: 'Independents · inamovibles · responsables', star: true },
  { eraId: 'judicial', date: 'Unitat', title: 'Unitat jurisdiccional', note: 'Excepció: jurisdicció militar.' },
  { eraId: 'judicial', date: 'TS', title: 'Tribunal Suprem · Madrid', note: 'Superior excepte garanties constitucionals.', star: true },
  { eraId: 'judicial', date: 'AN', title: 'Audiència Nacional', note: 'Terrorisme, narcotràfic, delictes econòmics.' },
  { eraId: 'judicial', date: 'TSJC', title: 'TSJ de Catalunya', note: "Culmina organització judicial a CAT." },
  { eraId: 'judicial', date: 'Aud. Prov.', title: 'Una per província' },
  { eraId: 'judicial', date: '5 ordres', title: 'Civil · penal · contenciós · social · militar', star: true },
  { eraId: 'cgpj', date: 'Art. 122 CE', title: "Òrgan de govern del poder judicial", star: true },
  { eraId: 'cgpj', date: 'President', title: 'El del Tribunal Suprem' },
  { eraId: 'cgpj', date: '20 vocals', title: 'Designats per les Corts · 3/5', note: '10 Congrés + 10 Senat.', star: true },
  { eraId: 'cgpj', date: '12 + 8', title: 'Jutges + juristes', note: 'Juristes amb +15 anys d\'exercici.' },
  { eraId: 'cgpj', date: '5 anys', title: 'Mandat', star: true },
  { eraId: 'cgpj', date: 'Funcions', title: 'Nomenaments · inspecció · règim disciplinari' },
  { eraId: 'cgpj', date: '2 TC', title: 'Proposa 2 magistrats TC' },
  { eraId: 'fiscal', date: 'Art. 124 CE', title: 'Autonomia funcional', star: true },
  { eraId: 'fiscal', date: 'Llei 50/1981', title: 'Estatut Orgànic MF', note: '30 de desembre.', star: true },
  { eraId: 'fiscal', date: 'FGE', title: "Fiscal General de l'Estat", note: 'Rei a proposta del Govern, escoltat CGPJ.' },
  { eraId: 'fiscal', date: '4 principis', title: 'Unitat · dependència jeràrquica · legalitat · imparcialitat' },
  { eraId: 'tc', date: 'LO 2/1979', title: 'LOTC · 3 octubre', note: 'Llei orgànica del Tribunal Constitucional.', star: true },
  { eraId: 'tc', date: 'Intèrpret', title: 'Suprem intèrpret de la Constitució', note: 'NO forma part del poder judicial.', star: true },
  { eraId: 'tc', date: '12 magistrats', title: 'Nomenats pel Rei', star: true },
  { eraId: 'tc', date: '4+4+2+2', title: 'Congrés · Senat · Govern · CGPJ', note: 'Congrés i Senat per 3/5.', star: true },
  { eraId: 'tc', date: '9 anys', title: 'Mandat · renovació per terços', star: true },
  { eraId: 'tc', date: '+ 15 anys', title: "Anys mínims d'exercici" },
  { eraId: 'tc', date: 'Ple · 2 sales · 4 seccions', title: 'Estructura interna' },
  { eraId: 'tc', date: 'Recurs inconst.', title: 'Contra lleis · 3 mesos', note: 'PG, DP, 50 dip, 50 sen, CCAA.', star: true },
  { eraId: 'tc', date: 'Recurs empara', title: 'Drets art. 14 + Sec. 1a + 30' },
  { eraId: 'tc', date: 'Q. inconst.', title: 'Plantejada per un jutge' },
];

const B6_PEOPLE: EsquemaPerson[] = [
  { id: 'b6-lopj', name: 'LOPJ · LO 6/1985', eraId: 'judicial', period: '1 juliol 1985', role: 'Llei capital', initials: 'LOPJ', icon: 'scroll', fact: 'Llei orgànica del Poder Judicial. Memoritza la data exacta.' },
  { id: 'b6-cgpj', name: 'CGPJ', eraId: 'cgpj', period: '5 anys', role: 'Govern del poder judicial', initials: 'CGPJ', icon: 'crown', fact: '20 vocals (12 jutges + 8 juristes) + president del TS. Designats per les Corts per 3/5.' },
  { id: 'b6-mf', name: 'Ministeri Fiscal', eraId: 'fiscal', period: 'Llei 50/1981', role: 'Autonomia funcional', initials: 'MF', icon: 'sword', fact: 'Promou acció de justícia. FGE nomenat pel Rei a proposta del Govern.' },
  { id: 'b6-tc', name: 'Tribunal Constitucional', eraId: 'tc', period: '12 magistrats · 9 anys', role: 'Intèrpret suprem CE', initials: 'TC', icon: 'crown', fact: 'NO és poder judicial. 4+4+2+2 (Congrés·Senat·Govern·CGPJ). Renovació per terços.' },
  { id: 'b6-lotc', name: 'LOTC · LO 2/1979', eraId: 'tc', period: '3 octubre 1979', role: 'Llei del TC', initials: 'LOTC', icon: 'scroll', fact: 'Llei orgànica del Tribunal Constitucional. Sentències vinculants i cosa jutjada.' },
];

const B6_EXAM: ExamItem[] = [
  { date: 'LOPJ', text: 'LO 6/1985, d\'1 de juliol. Llei capital del poder judicial.' },
  { date: 'LOTC', text: 'LO 2/1979, de 3 d\'octubre. Llei del Tribunal Constitucional.' },
  { date: 'CGPJ', text: '20 vocals + president (TS). 12 jutges + 8 juristes. Mandat 5 anys.' },
  { date: 'TC', text: '12 magistrats. 4+4+2+2. Mandat 9 anys, renovació per terços.' },
  { date: 'TC ≠ Poder judicial', text: 'TC és òrgan constitucional independent del poder judicial.' },
  { date: 'Recurs inconst.', text: '3 mesos. Legitimats: PG, DP, 50 dip, 50 sen, parlaments/governs CCAA.' },
  { date: '5 ordres', text: 'Civil · penal · contenciós-administratiu · social · militar.' },
  { date: 'Estatut Fiscal', text: 'Llei 50/1981 (30 desembre).' },
];

const ESQUEMA_B6: Esquema = {
  id: 'esq-mos-b6',
  temaSlug: 'b6-els-organs-jurisdiccionals-poder-judicial-i-tribunal-constitucional',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.6',
  title: 'Òrgans jurisdiccionals',
  titleHighlight: 'i Tribunal Constitucional',
  introOneLiner: 'Poder judicial (Títol VI CE, LOPJ 6/1985). Òrgan de govern: CGPJ. Ministeri Fiscal vetlla per la legalitat. Tribunal Constitucional és l\'intèrpret suprem de la CE (no forma part del poder judicial).',
  kpis: [
    { value: '4', label: 'blocs temàtics' },
    { value: '31', label: 'fites clau' },
    { value: '5', label: 'institucions' },
    { value: '12+20', label: 'TC + CGPJ', mono: true },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B6_ERAS,
  timeline: B6_TIMELINE,
  people: B6_PEOPLE,
  exam: B6_EXAM,
  testHref: '/mossos/b6-els-organs-jurisdiccionals-poder-judicial-i-tribunal-constitucional',
  labels: { eras: 'Blocs', timeline: 'Articles i lleis', people: 'Institucions' },
};

// ═══════════════════════════════════════════════════════════════
// B.7 — Organització territorial de l'Estat
// ═══════════════════════════════════════════════════════════════
const B7_ERAS: Era[] = [
  { id: 'models', name: 'Models territorials', range: 'unitari · federal · autonòmic', color: '#B89060', soft: '#F3E8D6' },
  { id: 'ce1978', name: 'CE 1978 · Títol VIII', range: 'principi dispositiu', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'ccaa', name: 'Comunitats autònomes', range: '17 CCAA + 2 ciutats', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'municipis', name: 'Municipis', range: 'LRBRL 7/1985', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'provincies', name: 'Províncies', range: 'art. 141 CE', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'comarques', name: 'Comarques', range: '42 actuals', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'vegueries', name: 'Vegueries', range: 'Llei 30/2010', color: '#0BB4C2', soft: '#CCEEF1' },
];

const B7_TIMELINE: Milestone[] = [
  { eraId: 'models', date: 'Unitari', title: 'Un únic centre de poder', note: 'França.' },
  { eraId: 'models', date: 'Federal', title: 'Divisió constitucional', note: 'Alemanya, EUA.' },
  { eraId: 'models', date: 'Autonòmic', title: 'Descentralització política', note: 'Espanya, Itàlia.', star: true },
  { eraId: 'ce1978', date: 'Art. 2 CE', title: 'Unitat + autonomia + solidaritat', star: true },
  { eraId: 'ce1978', date: 'Art. 137 CE', title: 'Municipis · províncies · CCAA', star: true },
  { eraId: 'ce1978', date: 'Art. 143', title: 'Via lenta', note: 'La resta de comunitats.' },
  { eraId: 'ce1978', date: 'Art. 151', title: 'Via ràpida', note: 'CAT, PV, GAL + Andalusia.', star: true },
  { eraId: 'ce1978', date: 'Art. 148 CE', title: 'Matèries CCAA' },
  { eraId: 'ce1978', date: 'Art. 149 CE', title: 'Competències exclusives Estat', star: true },
  { eraId: 'ce1978', date: 'Art. 149.3', title: 'Clàusula de tancament', note: 'Residual + supletorietat + prevalença.', star: true },
  { eraId: 'ccaa', date: '17 + 2', title: 'CCAA + Ceuta i Melilla' },
  { eraId: 'ccaa', date: 'Art. 152.1 CE', title: 'Institucions autonòmiques', note: 'Assemblea + Consell de Govern + President + TSJ.' },
  { eraId: 'ccaa', date: 'LO 1 i 2/1995', title: 'Ceuta i Melilla' },
  { eraId: 'municipis', date: 'Art. 140 CE', title: 'Entitat local bàsica', star: true },
  { eraId: 'municipis', date: 'Llei 7/1985', title: 'LRBRL · 2 abril', note: 'Llei de bases del règim local.', star: true },
  { eraId: 'municipis', date: 'DLeg 2/2003', title: 'TRLMRLC · 28 abril', note: 'Text refós Llei municipal CAT.', star: true },
  { eraId: 'municipis', date: 'Ajuntament', title: 'Alcalde + regidors', note: 'Regidors per sufragi universal. Alcalde pels regidors.' },
  { eraId: 'municipis', date: 'Competències', title: 'Seguretat, urbanisme, trànsit, aigua, residus', note: 'Patrimoni, medi ambient, mercats, serveis socials.' },
  { eraId: 'provincies', date: 'Art. 141 CE', title: 'Agrupació de municipis' },
  { eraId: 'provincies', date: 'Diputacions', title: 'Govern i administració' },
  { eraId: 'provincies', date: 'CAT: 4', title: 'BCN, GIR, LLE, TGN', star: true },
  { eraId: 'provincies', date: 'Límits', title: "Modificació per llei orgànica" },
  { eraId: 'comarques', date: 'Art. 83 EAC', title: 'Reconeixement EAC' },
  { eraId: 'comarques', date: 'DLeg 4/2003', title: '4 novembre · TRLOCC', note: 'Text refós Llei d\'organització comarcal.', star: true },
  { eraId: 'comarques', date: 'CAT: 42', title: 'Comarques actuals', note: 'Moianès (2015), Lluçanès (2023).', star: true },
  { eraId: 'comarques', date: 'Consell comarcal', title: 'Govern · elecció indirecta' },
  { eraId: 'vegueries', date: 'Art. 90 EAC', title: 'Govern intermunicipal' },
  { eraId: 'vegueries', date: 'Llei 30/2010', title: '3 agost · de vegueries', star: true },
  { eraId: 'vegueries', date: 'CAT: 7', title: 'Vegueries previstes', note: 'Alt Pirineu i Aran · BCN · Camp TGN · CAT Central · GIR · LLE · Penedès · Terres Ebre.', star: true },
];

const B7_PEOPLE: EsquemaPerson[] = [
  { id: 'b7-lrbrl', name: 'LRBRL · Llei 7/1985', eraId: 'municipis', period: '2 abril 1985', role: 'Bases règim local', initials: 'LRBRL', icon: 'scroll', fact: 'Llei de bases del règim local. Marc estatal dels municipis.' },
  { id: 'b7-trlmrlc', name: 'TRLMRLC · DLeg 2/2003', eraId: 'municipis', period: '28 abril 2003', role: 'Llei municipal CAT', initials: 'TRL', icon: 'scroll', fact: 'Text refós de la Llei municipal i de règim local de Catalunya.' },
  { id: 'b7-llei302010', name: 'Llei 30/2010', eraId: 'vegueries', period: '3 agost 2010', role: 'Llei de vegueries', initials: 'L30', icon: 'scroll', fact: '7 vegueries previstes. Doble naturalesa: divisió territorial Generalitat + ens local.' },
  { id: 'b7-art137', name: 'Art. 137 CE', eraId: 'ce1978', period: 'Organització territorial', role: 'Principi bàsic', initials: '137', icon: 'flag', fact: 'L\'Estat s\'organitza en municipis, províncies i CCAA. Autonomia per a tots.' },
];

const B7_EXAM: ExamItem[] = [
  { date: 'Estat autonòmic', text: 'Títol VIII CE. Principi dispositiu.' },
  { date: 'Art. 151 vs 143', text: 'Via ràpida (CAT, PV, GAL, AND) / via lenta (la resta).' },
  { date: 'Art. 148 vs 149', text: 'Competències CCAA vs Estat. 149.3 = clàusula de tancament.' },
  { date: '4 / 42 / 7', text: 'Províncies / comarques (Moianès 2015, Lluçanès 2023) / vegueries.' },
  { date: 'LRBRL · 7/1985', text: 'Llei estatal de bases del règim local (2 abril).' },
  { date: 'TRLMRLC · 2/2003', text: 'Text refós català (28 abril).' },
  { date: 'Llei 30/2010', text: 'Llei de vegueries (3 agost).' },
  { date: 'Comarques', text: 'Govern indirecte: consell comarcal triat pels regidors municipals.' },
];

const ESQUEMA_B7: Esquema = {
  id: 'esq-mos-b7',
  temaSlug: 'b7-l-organitzacio-territorial-de-l-estat',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.7',
  title: 'Organització territorial',
  titleHighlight: "de l'Estat",
  introOneLiner: 'Municipis + províncies + CCAA (art. 137 CE). Estat autonòmic basat en principi dispositiu. A Catalunya: municipis, comarques, vegueries i províncies.',
  kpis: [
    { value: '17+2', label: 'CCAA + ciutats' },
    { value: '7', label: 'blocs temàtics' },
    { value: '29', label: 'fites clau' },
    { value: '4', label: 'normes clau' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: B7_ERAS,
  timeline: B7_TIMELINE,
  people: B7_PEOPLE,
  exam: B7_EXAM,
  testHref: '/mossos/b7-l-organitzacio-territorial-de-l-estat',
  labels: { eras: 'Blocs', timeline: 'Articles i lleis', people: 'Normes clau' },
};

// ═══════════════════════════════════════════════════════════════
// B.8 — La Unió Europea
// ═══════════════════════════════════════════════════════════════
const B8_ERAS: Era[] = [
  { id: 'origen', name: 'Origen · tractats', range: '1951 → 2007', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'ampliacions', name: 'Ampliacions', range: '1973 → 2013 · Brexit', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'originari', name: 'Dret originari', range: 'TUE · TFUE · Carta', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'derivat', name: 'Dret derivat', range: 'art. 288 TFUE', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'principis', name: 'Principis del dret UE', range: 'primacia · efecte directe', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'institucions', name: 'Institucions', range: '7 institucions (TUE 13)', color: '#1FB286', soft: '#CDF0E1' },
];

const B8_TIMELINE: Milestone[] = [
  { eraId: 'origen', date: '1951', title: 'Tractat de París · CECA', note: '6 estats: FR, RFA, IT, BE, NL, LU.', star: true },
  { eraId: 'origen', date: '1957', title: 'Tractats de Roma · CEE + EURATOM', star: true },
  { eraId: 'origen', date: '1967', title: 'Tractat de Brussel·les · fusió' },
  { eraId: 'origen', date: '1986', title: 'Acta Única Europea', note: 'Mercat únic per al 1993.' },
  { eraId: 'origen', date: '1992', title: 'Tractat de Maastricht · TUE', note: 'Crea la UE. 3 pilars. Ciutadania europea.', star: true },
  { eraId: 'origen', date: '1997', title: "Tractat d'Amsterdam", note: 'Integra Schengen.' },
  { eraId: 'origen', date: '2001', title: 'Tractat de Niça' },
  { eraId: 'origen', date: '2007', title: 'Tractat de Lisboa', note: '1 desembre 2009 entrada en vigor. Vigent.', star: true },
  { eraId: 'ampliacions', date: '1973', title: 'Regne Unit, Irlanda, Dinamarca' },
  { eraId: 'ampliacions', date: '1981', title: 'Grècia' },
  { eraId: 'ampliacions', date: '1986', title: 'Espanya i Portugal', star: true },
  { eraId: 'ampliacions', date: '1995', title: 'Àustria, Suècia, Finlàndia' },
  { eraId: 'ampliacions', date: '2004', title: '10 estats', note: 'PL, HU, CZ, SK, SI, EE, LV, LT, CY, MT.', star: true },
  { eraId: 'ampliacions', date: '2007', title: 'Bulgària i Romania' },
  { eraId: 'ampliacions', date: '2013', title: 'Croàcia' },
  { eraId: 'ampliacions', date: '31 gener 2020', title: 'Brexit · Regne Unit deixa la UE', star: true },
  { eraId: 'ampliacions', date: 'Actual', title: '27 estats membres', star: true },
  { eraId: 'originari', date: 'TUE + TFUE', title: 'Tractats constitutius', note: 'Reformats per Lisboa.' },
  { eraId: 'originari', date: 'Carta DDFF', title: 'Niça 2000 · valor de tractat', note: 'Des de Lisboa 2009.' },
  { eraId: 'derivat', date: 'Reglament', title: 'Directament aplicable', note: 'Obligatori en tots els seus elements.', star: true },
  { eraId: 'derivat', date: 'Directiva', title: 'Resultat obligatori', note: 'Transposició per cada estat.', star: true },
  { eraId: 'derivat', date: 'Decisió', title: 'Per als destinataris', star: true },
  { eraId: 'derivat', date: 'Recomanació', title: 'NO vinculant' },
  { eraId: 'principis', date: 'Primacia', title: 'Preval sobre dret intern', star: true },
  { eraId: 'principis', date: 'Efecte directe', title: 'Invocable davant tribunals nacionals', star: true },
  { eraId: 'principis', date: 'Subsidiarietat', title: 'UE actua quan no es pot fer millor pels estats' },
  { eraId: 'principis', date: 'Proporcionalitat', title: "No excedeix del necessari" },
  { eraId: 'institucions', date: 'PE', title: 'Parlament Europeu · Estrasburg', note: '705 escons. Espanya 61. 5 anys.', star: true },
  { eraId: 'institucions', date: 'Consell Eur.', title: 'Caps Estat/Govern · Brussel·les', note: 'NO legisla. President 2,5 anys (renovable 1 cop).' },
  { eraId: 'institucions', date: 'Consell UE', title: 'Ministres · Brussel·les', note: 'Colegislador. Presidència rotatòria.' },
  { eraId: 'institucions', date: 'Comissió', title: 'Òrgan executiu · Brussel·les', note: 'Iniciativa legislativa. 27 comissaris. Mandat 5 anys.' },
  { eraId: 'institucions', date: 'TJUE', title: 'Tribunal Justícia · Luxemburg', note: 'Q. prejudicial.', star: true },
  { eraId: 'institucions', date: 'BCE', title: 'Banc Central · Frankfurt', note: 'Política monetària euro.' },
  { eraId: 'institucions', date: 'TC Europeu', title: 'Tribunal de Comptes · Luxemburg' },
];

const B8_PEOPLE: EsquemaPerson[] = [
  { id: 'b8-lisboa', name: 'Tractat de Lisboa', eraId: 'origen', period: '2007 · vigor 2009', role: 'Tractat vigent', initials: 'TL', icon: 'scroll', fact: 'Reforma profunda. Substitueix la Constitució europea rebutjada el 2005. Integra la Carta DDFF.' },
  { id: 'b8-maastricht', name: 'Tractat de Maastricht', eraId: 'origen', period: '1992', role: 'Crea la UE', initials: 'TM', icon: 'scroll', fact: 'TUE · 3 pilars (comunitari, PESC, JAI). Ciutadania europea. UEM.' },
  { id: 'b8-pe', name: 'Parlament Europeu', eraId: 'institucions', period: 'Estrasburg', role: '705 escons', initials: 'PE', icon: 'flag', fact: 'Eleccions cada 5 anys. Espanya: 61 eurodiputats. Funcions: legislativa, pressupostària, control.' },
  { id: 'b8-comissio', name: 'Comissió Europea', eraId: 'institucions', period: 'Brussel·les', role: 'Òrgan executiu', initials: 'CE', icon: 'crown', fact: 'Iniciativa legislativa. 27 comissaris. President designat pel Consell Europeu i confirmat pel PE.' },
  { id: 'b8-tjue', name: 'TJUE', eraId: 'institucions', period: 'Luxemburg', role: 'Tribunal de Justícia', initials: 'TJ', icon: 'scroll', fact: 'Garantia el respecte del dret de la UE. Qüestió prejudicial = la més important per jutges nacionals.' },
  { id: 'b8-bce', name: 'BCE', eraId: 'institucions', period: 'Frankfurt', role: 'Banc Central Europeu', initials: 'BCE', icon: 'scroll', fact: "Política monetària zona euro. Independent. Manté l'estabilitat dels preus." },
];

const B8_EXAM: ExamItem[] = [
  { date: 'Tractats clau', text: 'París 1951 (CECA) · Roma 1957 (CEE+EURATOM) · Maastricht 1992 (UE) · Lisboa 2007/2009 (vigent).' },
  { date: '1986', text: "Ingrés d'Espanya i Portugal." },
  { date: '27', text: 'Estats membres. Brexit: 31 gener 2020.' },
  { date: 'Dret derivat', text: 'Reglament (directe) / directiva (transposició) / decisió (destinataris). NO confondre.' },
  { date: 'Primacia + efecte directe', text: 'Principis cabdals del dret de la UE.' },
  { date: 'PE: 705', text: '705 escons. Espanya 61. Eleccions cada 5 anys.' },
  { date: 'Seus', text: 'TJUE = Luxemburg · BCE = Frankfurt · PE = Estrasburg.' },
  { date: '3 Consells ≠', text: 'Consell Europeu (caps Estat) ≠ Consell UE (ministres) ≠ Consell d\'Europa (NO és UE, 46 estats, drets humans).' },
];

const ESQUEMA_B8: Esquema = {
  id: 'esq-mos-b8',
  temaSlug: 'b8-la-unio-europea',
  ambit: 'B',
  kicker: 'ÀMBIT B · TEMA B.8',
  title: 'La Unió',
  titleHighlight: 'Europea',
  introOneLiner: "Organització supranacional iniciada el 1951 (CECA). Tractat vigent: Lisboa 2007 (vigor 2009). Espanya hi és des de 1986. 27 estats. Dret originari + derivat. 7 institucions.",
  kpis: [
    { value: '27', label: 'estats membres' },
    { value: '6', label: 'blocs temàtics' },
    { value: '35', label: 'fites clau' },
    { value: '6', label: 'institucions' },
    { value: '~ 7 min', label: 'lectura', mono: true },
  ],
  eras: B8_ERAS,
  timeline: B8_TIMELINE,
  people: B8_PEOPLE,
  exam: B8_EXAM,
  testHref: '/mossos/b8-la-unio-europea',
  labels: { eras: 'Blocs', timeline: 'Tractats i normes', people: 'Institucions UE' },
};

// ═══════════════════════════════════════════════════════════════
// C.1 — Competències Generalitat en matèria de seguretat
// ═══════════════════════════════════════════════════════════════
const C1_ERAS: Era[] = [
  { id: 'definicio', name: 'Definició · marc CE', range: 'Títol VIII · art. 150', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'emergencies', name: 'Emergències · prot. civil', range: 'exclusiva', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'joc', name: 'Joc i espectacles', range: 'exclusiva', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'segprivada', name: 'Seguretat privada', range: 'executiva', color: '#0BB4C2', soft: '#CCEEF1' },
  { id: 'segpublica', name: 'Seguretat pública (164 EAC)', range: 'CRÍTIC', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'transit', name: 'Trànsit i seguretat viària', range: 'LO 6/1997', color: '#FF7A1A', soft: '#FFE0CB' },
];

const C1_TIMELINE: Milestone[] = [
  { eraId: 'definicio', date: 'Títol VIII CE', title: 'Organització territorial' },
  { eraId: 'definicio', date: 'Art. 149.1.29', title: 'Seguretat pública = Estat exclusiu', note: 'Sens perjudici de policies CCAA.', star: true },
  { eraId: 'definicio', date: 'Art. 150 CE', title: 'Vies de transferència' },
  { eraId: 'definicio', date: 'Art. 150.1', title: 'Lleis marc' },
  { eraId: 'definicio', date: 'Art. 150.2', title: 'LO de transferència/delegació', note: 'Cas del trànsit.', star: true },
  { eraId: 'emergencies', date: 'Exclusiva', title: 'Protecció civil', note: 'Regulació, planificació i execució.' },
  { eraId: 'emergencies', date: 'Inclou', title: 'Prevenció i extinció d\'incendis' },
  { eraId: 'emergencies', date: 'Executiva', title: 'Salvament marítim' },
  { eraId: 'emergencies', date: 'Participa', title: "Execució seguretat nuclear" },
  { eraId: 'joc', date: 'Exclusiva', title: 'Joc, apostes i casinos', note: 'Quan l\'activitat es fa exclusivament a CAT.' },
  { eraId: 'joc', date: 'Estatal', title: "Joc àmbit estatal · Comissió Bilateral" },
  { eraId: 'joc', date: 'Exclusiva', title: 'Espectacles i activitats recreatives' },
  { eraId: 'segprivada', date: 'Executiva', title: 'Seguretat privada · legislació estatal' },
  { eraId: 'segprivada', date: 'Funcions', title: 'Autorització, inspecció, sanció', note: 'Centres formació · coordinació policies.' },
  { eraId: 'segpublica', date: '164.1.a', title: 'Planificació i regulació', note: 'Ordenació policies locals.', star: true },
  { eraId: 'segpublica', date: '164.1.b', title: 'Creació i organització PG-ME', star: true },
  { eraId: 'segpublica', date: '164.1.c', title: 'Control i vigilància del trànsit', star: true },
  { eraId: 'segpublica', date: 'Executives', title: 'Reunió i manifestació · medi ambient' },
  { eraId: 'segpublica', date: '164.2', title: 'Comandament suprem PG-ME', note: 'Coordinació policies locals.', star: true },
  { eraId: 'segpublica', date: '164.4', title: 'Junta de Seguretat', note: 'Paritària. Presidida pel president de la Generalitat.', star: true },
  { eraId: 'segpublica', date: '164.5.a', title: 'Seguretat ciutadana i ordre públic', star: true },
  { eraId: 'segpublica', date: '164.5.b', title: 'Policia administrativa', star: true },
  { eraId: 'segpublica', date: '164.5.c', title: 'Policia judicial i investigació criminal', note: 'Crim organitzat i terrorisme.', star: true },
  { eraId: 'transit', date: 'Llei 10/1994', title: "Llei de PG-ME · art. 12.1.6", note: 'Funcions transferibles via 150.2.' },
  { eraId: 'transit', date: 'LO 6/1997', title: 'Transferència del trànsit', note: '15 de desembre.', star: true },
  { eraId: 'transit', date: 'Excepcions', title: 'Permisos · examen · matriculació', note: 'Queden a l\'Estat.', star: true },
  { eraId: 'transit', date: 'Llei 14/1997', title: 'Servei Català de Trànsit', note: '24 de desembre.', star: true },
  { eraId: 'transit', date: 'EAC 2006', title: 'Trànsit = competència pròpia', note: 'Art. 164.1 EAC.' },
];

const C1_PEOPLE: EsquemaPerson[] = [
  { id: 'c1-art164', name: 'Article 164 EAC', eraId: 'segpublica', period: 'Crític oposició', role: 'Seguretat pública CAT', initials: '164', icon: 'sword', fact: 'Article cabdal. Planificació, creació MdE, trànsit, comandament i camps d\'actuació.' },
  { id: 'c1-art1491', name: 'Art. 149.1.29 CE', eraId: 'definicio', period: 'Seguretat estatal', role: 'Competència Estat', initials: '149', icon: 'crown', fact: 'Seguretat pública = competència exclusiva de l\'Estat. NO confondre amb 164 EAC.' },
  { id: 'c1-lo61997', name: 'LO 6/1997', eraId: 'transit', period: '15 desembre 1997', role: 'Transferència trànsit', initials: 'LO6', icon: 'scroll', fact: 'Transferència de competències executives en trànsit. Via art. 150.2 CE.' },
  { id: 'c1-llei141997', name: 'Llei 14/1997', eraId: 'transit', period: '24 desembre 1997', role: 'Crea el SCT', initials: 'L14', icon: 'scroll', fact: 'Servei Català de Trànsit. Organisme autònom.' },
  { id: 'c1-juntaseg', name: 'Junta de Seguretat', eraId: 'segpublica', period: 'Art. 164.4 EAC', role: 'Paritària Generalitat-Estat', initials: 'JS', icon: 'flag', fact: 'Presidida pel/per la president/a de la Generalitat. NO confondre amb la Junta de Seguretat de Catalunya (Llei 4/2003).' },
];

const C1_EXAM: ExamItem[] = [
  { date: '149.1.29 vs 164', text: 'Estat (seguretat pública exclusiva) ↔ Generalitat (planificació, MdE, trànsit).' },
  { date: 'LO 6/1997', text: 'Transferència del trànsit (15 desembre).' },
  { date: 'Llei 14/1997', text: 'Servei Català de Trànsit (24 desembre).' },
  { date: '3 funcions PG-ME', text: '164.5: seguretat ciutadana / policia administrativa / policia judicial.' },
  { date: 'Art. 150.2 CE', text: 'Via de transferència via llei orgànica (cas del trànsit).' },
  { date: 'Excepcions trànsit', text: 'Permisos i llicències · examen · matriculació · permís circulació.' },
  { date: 'Junta Seguretat', text: 'Paritària (5+5), presidida pel president de la Generalitat.' },
  { date: 'Comissió Bilateral', text: 'Joc àmbit estatal · deliberació en aquesta comissió.' },
];

const ESQUEMA_C1: Esquema = {
  id: 'esq-mos-c1',
  temaSlug: 'c1-les-competencies-de-la-generalitat-en-materia-de-seguretat',
  ambit: 'C',
  kicker: 'ÀMBIT C · TEMA C.1',
  title: 'Competències',
  titleHighlight: 'de seguretat',
  introOneLiner: 'Art. 149.1.29 CE (Estat) i art. 164 EAC (Generalitat). Inclou protecció civil, joc, espectacles, seguretat privada, seguretat pública i trànsit (LO 6/1997).',
  kpis: [
    { value: '164', label: 'art. EAC clau', mono: true },
    { value: '6', label: 'blocs temàtics' },
    { value: '27', label: 'fites clau' },
    { value: '5', label: 'normes i articles' },
    { value: '~ 6 min', label: 'lectura', mono: true },
  ],
  eras: C1_ERAS,
  timeline: C1_TIMELINE,
  people: C1_PEOPLE,
  exam: C1_EXAM,
  testHref: '/mossos/c1-les-competencies-de-la-generalitat-en-materia-de-seguretat',
  labels: { eras: 'Blocs', timeline: 'Articles i lleis', people: 'Normes clau' },
};

// ═══════════════════════════════════════════════════════════════
// C.2 — Departament d'Interior i Seguretat Pública
// ═══════════════════════════════════════════════════════════════
const C2_ERAS: Era[] = [
  { id: 'funcions', name: 'Funcions departament', range: 'Decret 133/2024', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'estructura', name: 'Estructura · DDGG', range: 'Decret 12/2023', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'dgp', name: 'Direcció General Policia', range: 'Decret 57/2023', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'mossos', name: 'PG-ME · cronologia', range: '1719 → 2008', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'ispc', name: 'ISPC', range: 'Mollet del Vallès', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'sct', name: 'Servei Català de Trànsit', range: 'Llei 14/1997', color: '#1FB286', soft: '#CDF0E1' },
  { id: 'cent12', name: 'Centre 112', range: 'Llei 9/2007', color: '#0BB4C2', soft: '#CCEEF1' },
];

const C2_TIMELINE: Milestone[] = [
  { eraId: 'funcions', date: 'Decret 133/2024', title: 'Creació i àmbits departaments', note: "D'11 d'agost.", star: true },
  { eraId: 'funcions', date: 'Funcions', title: 'Seguretat ciutadana · trànsit · emergències · incendis' },
  { eraId: 'estructura', date: 'Decret 12/2023', title: 'Reestructuració Interior', note: 'De 24 de gener.' },
  { eraId: 'estructura', date: 'DG', title: 'DG Bombers + Protecció Civil + Adm. Seguretat' },
  { eraId: 'estructura', date: 'DG locals', title: 'DG Coordinació Policies Locals' },
  { eraId: 'estructura', date: 'DG rurals', title: 'DG Agents Rurals' },
  { eraId: 'dgp', date: 'Decret 57/2023', title: 'Reestructuració DGP', note: 'De 21 de març.', star: true },
  { eraId: 'dgp', date: 'Estructura', title: 'Prefectura + Centre Comandament' },
  { eraId: 'dgp', date: 'Regions', title: 'Comissaria Superior Territorial → RP → ABP' },
  { eraId: 'mossos', date: '21 abril 1719', title: 'Creació dels Mossos', note: 'Capità general de Catalunya.', star: true },
  { eraId: 'mossos', date: '1729', title: 'Veciana comandant en cap', note: 'Família dirigeix 115 anys (fins 1836).', star: true },
  { eraId: 'mossos', date: '1868', title: 'Revolució Gloriosa', note: 'Prim aboleix el cos.' },
  { eraId: 'mossos', date: '1982', title: 'Traspàs a la Generalitat', note: '+ 280 places noves.' },
  { eraId: 'mossos', date: 'Llei 19/1983', title: '14 juliol · Policia Autonòmica', note: 'Refundació.', star: true },
  { eraId: 'mossos', date: '1985', title: 'Primer accés de dones · Mollet', note: 'Resolució 39/II Parlament.', star: true },
  { eraId: 'mossos', date: 'LO 2/1986', title: 'Funcions residuals · estancament' },
  { eraId: 'mossos', date: '1990', title: 'Trasllats presos i menors' },
  { eraId: 'mossos', date: 'Llei 10/1994', title: '11 juliol · Policia integral', star: true },
  { eraId: 'mossos', date: '17 oct. 1994', title: 'Acords Junta Seguretat · desbloqueig', star: true },
  { eraId: 'mossos', date: '4 des. 1994', title: 'Primer desplegament · Osona', star: true },
  { eraId: 'mossos', date: '1998', title: 'Primer traspàs trànsit · Figueres' },
  { eraId: 'mossos', date: '2000', title: 'Trànsit a tot el territori' },
  { eraId: 'mossos', date: '27 juny 2004', title: 'Primera patrulla a Barcelona' },
  { eraId: 'mossos', date: '2005', title: 'Inici desplegament BCN · 10 comissaries' },
  { eraId: 'mossos', date: 'Nov. 2008', title: 'Final del desplegament', note: 'Camp Tarragona · Terres Ebre.', star: true },
  { eraId: 'mossos', date: 'Decret 415/2011', title: 'Funció policial', note: 'De 13 desembre.' },
  { eraId: 'mossos', date: 'SISD', title: 'Aplicació detencions', star: true },
  { eraId: 'mossos', date: 'SIAV', title: 'Aplicació víctimes vulnerables', star: true },
  { eraId: 'ispc', date: 'ISPC', title: 'Formació i selecció', note: 'Policia + bombers + rurals + protecció civil.' },
  { eraId: 'ispc', date: 'Mollet', title: 'Escola Policia Catalunya', star: true },
  { eraId: 'sct', date: 'Llei 14/1997', title: 'Crea el SCT', note: '24 desembre.', star: true },
  { eraId: 'sct', date: 'RD 391/1998', title: 'Traspàs efectiu trànsit', note: '13 març.' },
  { eraId: 'sct', date: 'PSV', title: 'Pla Seguretat Viària · triennal', note: 'Horitzó 0 víctimes 2050.', star: true },
  { eraId: 'sct', date: 'Estructura', title: '3 subdireccions + 4 serveis territorials' },
  { eraId: 'cent12', date: 'Llei 9/2007', title: '30 juliol · regula 112', star: true },
  { eraId: 'cent12', date: '24h/365', title: 'Públic · gratuït · universal · permanent' },
  { eraId: 'cent12', date: 'Reus + BCN', title: '2 centres', note: 'Continuïtat servei.', star: true },
  { eraId: 'cent12', date: '30 set. 2012', title: 'Desactivació 085 i 088', note: 'Integració al 112.', star: true },
];

const C2_PEOPLE: EsquemaPerson[] = [
  { id: 'c2-llei191983', name: 'Llei 19/1983', eraId: 'mossos', period: '14 juliol 1983', role: 'Refundació PG-ME', initials: 'L19', icon: 'scroll', fact: 'Crea la Policia Autonòmica de la Generalitat, absorbint els Mossos.' },
  { id: 'c2-llei101994', name: 'Llei 10/1994', eraId: 'mossos', period: '11 juliol 1994', role: 'Policia integral', initials: 'L10', icon: 'scroll', fact: 'PG-ME com a policia ordinària i integral. Marc del desplegament.' },
  { id: 'c2-veciana', name: 'Pere Anton Veciana', eraId: 'mossos', period: '1729 · 115 anys', role: 'Comandant en cap', initials: 'PV', icon: 'sword', fact: 'Família Veciana dirigeix els Mossos durant 115 anys (fins al 1836).' },
  { id: 'c2-llei141997', name: 'Llei 14/1997', eraId: 'sct', period: '24 desembre 1997', role: 'Servei Català de Trànsit', initials: 'L14', icon: 'scroll', fact: 'Crea el SCT com a organisme autònom administratiu adscrit al Departament d\'Interior.' },
  { id: 'c2-llei92007', name: 'Llei 9/2007', eraId: 'cent12', period: '30 juliol 2007', role: 'Centre 112', initials: 'L9', icon: 'flag', fact: 'Regula el 112 a Catalunya. Servei 24h/365 dies. Reus + Barcelona.' },
  { id: 'c2-decrets', name: 'Decrets 12/2023 i 57/2023', eraId: 'estructura', period: 'Reestructuració', role: 'Dpt. Interior · DGP', initials: 'D23', icon: 'scroll', fact: 'Estructura actual del Dpt. Interior (24 gener) i de la DGP (21 març).' },
];

const C2_EXAM: ExamItem[] = [
  { date: 'Cronologia MdE', text: '1719 (creació) → 1868 (abolició Prim) → 1982 (Generalitat) → 1983 (Llei 19) → 1994 (Llei 10) → 2008 (final desplegament).' },
  { date: 'Decrets vigents', text: '133/2024 (departaments) · 12/2023 (Dpt. Interior) · 57/2023 (DGP).' },
  { date: 'Mollet', text: 'Escola de Policia de Catalunya. Forma part de l\'ISPC.' },
  { date: 'Lleis clau', text: '19/1983 = PG-ME · 10/1994 = integral · 14/1997 = SCT · 9/2007 = 112.' },
  { date: 'SIAV / SISD', text: 'Víctimes vulnerables / detencions.' },
  { date: '112', text: 'Telèfon únic europeu (Dec. 91/396/CEE). Reus + BCN. Desactivació 085/088 el 2012.' },
  { date: 'PSV', text: 'Pla de Seguretat Viària · triennal. Horitzó 0 víctimes 2050.' },
  { date: 'Veciana', text: '1729 comandant en cap. Família dirigeix 115 anys.' },
];

const ESQUEMA_C2: Esquema = {
  id: 'esq-mos-c2',
  temaSlug: 'c2-el-departament-d-interior-i-seguretat-publica',
  ambit: 'C',
  kicker: 'ÀMBIT C · TEMA C.2',
  title: "Departament d'Interior",
  titleHighlight: 'i Seguretat Pública',
  introOneLiner: 'Estructura del Dpt. Interior, DGP, PG-ME (1719-2008), ISPC (Mollet), Servei Català de Trànsit (Llei 14/1997) i Centre 112 Catalunya (Llei 9/2007).',
  kpis: [
    { value: '1719', label: 'creació Mossos', mono: true },
    { value: '7', label: 'blocs temàtics' },
    { value: '38', label: 'fites clau' },
    { value: '6', label: 'normes clau' },
    { value: '~ 7 min', label: 'lectura', mono: true },
  ],
  eras: C2_ERAS,
  timeline: C2_TIMELINE,
  people: C2_PEOPLE,
  exam: C2_EXAM,
  testHref: '/mossos/c2-el-departament-d-interior-i-seguretat-publica',
  labels: { eras: 'Blocs', timeline: 'Cronologia i normes', people: 'Lleis i figures' },
};

// ═══════════════════════════════════════════════════════════════
// C.3 — La coordinació policial
// ═══════════════════════════════════════════════════════════════
const C3_ERAS: Era[] = [
  { id: 'concepte', name: 'Concepte i cossos', range: 'PG-ME · locals · FCSE', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'fcse', name: 'Coordinació FCSE', range: 'LO 2/1986 art. 38', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'llei42003', name: 'Llei 4/2003 ordenació', range: 'CRÍTIC', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'interpol', name: 'Interpol', range: 'mundial · 195 països', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'europol', name: 'Europol', range: 'UE · La Haia', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'schengen', name: 'Schengen · SIS', range: 'C.SIS Estrasburg', color: '#1FB286', soft: '#CDF0E1' },
];

const C3_TIMELINE: Milestone[] = [
  { eraId: 'concepte', date: 'Cossos a CAT', title: 'PG-ME + policies locals + FCSE' },
  { eraId: 'concepte', date: '164.4 EAC', title: 'Articulació Generalitat-FCSE' },
  { eraId: 'concepte', date: '164.2 EAC', title: 'Articulació Generalitat-locals' },
  { eraId: 'fcse', date: 'Junta de Seguretat', title: 'Òrgan paritari (5+5)', note: 'Presidida pel president de la Generalitat.', star: true },
  { eraId: 'fcse', date: '28 des. 1982', title: 'Resolució que la regula' },
  { eraId: 'fcse', date: 'Unanimitat', title: 'Acords' },
  { eraId: 'fcse', date: '17 oct. 1994', title: 'Acords històrics', note: 'Desbloqueig desplegament MdE.', star: true },
  { eraId: 'fcse', date: 'Art. 38 LO 2/1986', title: 'Funcions policies autonòmiques' },
  { eraId: 'fcse', date: 'Pròpies', title: 'Vigilància CA · disposicions CA · inspecció · coacció' },
  { eraId: 'fcse', date: 'Compartides', title: 'Resolució conflictes · accidents · natura' },
  { eraId: 'fcse', date: 'Col·laboració', title: 'Disposicions Estat · policia judicial · grans concentracions' },
  { eraId: 'llei42003', date: 'Llei 4/2003', title: 'Ordenació seguretat pública CAT', note: '7 d\'abril. Aprovada per unanimitat.', star: true },
  { eraId: 'llei42003', date: 'Principis', title: 'Prevenció · proximitat · descentralització · eficàcia · coordinació' },
  { eraId: 'llei42003', date: 'Components', title: 'Autoritats + cossos + òrgans coordinació' },
  { eraId: 'llei42003', date: 'Autoritats', title: 'Govern · Conseller · Alcaldes · Delegats territorials' },
  { eraId: 'llei42003', date: 'CSC', title: 'Consell Seguretat Catalunya', note: 'Màxim òrgan consultiu. Informe anual.', star: true },
  { eraId: 'llei42003', date: 'CGSeg', title: 'Comissió Govern Seguretat', note: 'Presidida pel president.' },
  { eraId: 'llei42003', date: 'CPC', title: 'Comissió Policia Catalunya', note: 'Presidida pel conseller.' },
  { eraId: 'llei42003', date: 'JLS', title: 'Juntes Locals de Seguretat', note: 'Obligatòries amb policia local. Presidides per alcalde.', star: true },
  { eraId: 'llei42003', date: 'MCO', title: 'Mesa de Coordinació Operativa', note: 'Permanent. Depèn de cada JLS.' },
  { eraId: 'llei42003', date: 'PGSC', title: 'Pla General Seguretat Catalunya', note: 'QUADRIENNAL · NO triennal.', star: true },
  { eraId: 'interpol', date: '1914', title: 'Mònaco · primera reunió' },
  { eraId: 'interpol', date: '1923 Viena', title: 'Comissió Internacional Policia Criminal' },
  { eraId: 'interpol', date: '1946', title: 'Nom Interpol' },
  { eraId: 'interpol', date: '1956', title: 'OIPC-Interpol' },
  { eraId: 'interpol', date: '195', title: 'Països membres' },
  { eraId: 'interpol', date: 'Lió', title: 'Seu Secretaria General', star: true },
  { eraId: 'interpol', date: 'Art. 2', title: 'Assistència recíproca + prevenció dret comú' },
  { eraId: 'interpol', date: 'Art. 3', title: 'NO assumptes polítics/militars/religiosos', star: true },
  { eraId: 'interpol', date: 'OCN', title: 'Oficina Central Nacional · 1 per país' },
  { eraId: 'interpol', date: 'Comitè', title: '13 personalitats' },
  { eraId: 'europol', date: 'La Haia', title: 'Seu Europol', star: true },
  { eraId: 'europol', date: 'SNIC', title: 'SNIC-Europol · oficina espanyola' },
  { eraId: 'schengen', date: 'C.SIS Estrasburg', title: 'Sistema central', star: true },
  { eraId: 'schengen', date: 'N.SIS', title: 'Sistemes nacionals' },
  { eraId: 'schengen', date: 'SIRENE', title: 'Intercanvi informació complementària' },
  { eraId: 'schengen', date: 'Dades', title: 'Detencions · desaparicions · vigilància · vehicles' },
];

const C3_PEOPLE: EsquemaPerson[] = [
  { id: 'c3-llei42003', name: 'Llei 4/2003', eraId: 'llei42003', period: '7 abril 2003', role: 'Ordenació seguretat CAT', initials: 'L4', icon: 'scroll', fact: 'Aprovada per unanimitat al Parlament. Crea CSC, JLS, MCO i Pla General.' },
  { id: 'c3-juntaseg', name: 'Junta Seguretat CAT', eraId: 'fcse', period: 'Art. 164.4 EAC', role: 'Paritària 5+5', initials: 'JS', icon: 'flag', fact: 'Presidida pel president de la Generalitat. Acords per unanimitat. 28 desembre 1982.' },
  { id: 'c3-jls', name: 'Juntes Locals de Seguretat', eraId: 'llei42003', period: 'Llei 4/2003', role: 'Obligatòries', initials: 'JLS', icon: 'flag', fact: 'Als municipis amb policia local. Presidides per l\'alcalde. NO confondre amb Junta de Seguretat de Catalunya.' },
  { id: 'c3-interpol', name: 'Interpol', eraId: 'interpol', period: 'Lió · 1923', role: 'Policia mundial', initials: 'IP', icon: 'flag', fact: '195 països. Estatut observador ONU. NO assumptes polítics, militars, religiosos.' },
  { id: 'c3-europol', name: 'Europol', eraId: 'europol', period: 'La Haia', role: 'Policia UE', initials: 'EP', icon: 'flag', fact: 'Informació policial UE. A Espanya: Servei Nacional d\'Intel·ligència Criminal (SNIC).' },
  { id: 'c3-sis', name: 'Sistema Schengen (SIS)', eraId: 'schengen', period: 'C.SIS Estrasburg', role: 'Base de dades europea', initials: 'SIS', icon: 'sword', fact: 'Suport cooperació judicial. Oficines SIRENE per intercanvi complementari.' },
];

const C3_EXAM: ExamItem[] = [
  { date: 'Llei 4/2003', text: "D'ordenació del sistema de seguretat pública (7 abril). Aprovada per unanimitat." },
  { date: 'Juntes ≠', text: 'JS Catalunya (paritària, president) ≠ JLS (Llei 4/2003, alcalde) ≠ Junta Portaveus (Parl.).' },
  { date: '17 oct. 1994', text: 'Acords històrics: desbloqueig MdE.' },
  { date: 'PGSC', text: 'Pla General de Seguretat: QUADRIENNAL (NO triennal — PSV sí).' },
  { date: 'Interpol', text: 'Mundial · 195 països · seu Lió · 1923 (Viena). Estatut observador ONU.' },
  { date: 'Europol', text: 'UE · seu La Haia. Espanya: SNIC-Europol.' },
  { date: 'Schengen SIS', text: 'C.SIS central Estrasburg. Oficines SIRENE a cada país.' },
  { date: 'Òrgans Llei 4/2003', text: 'CSC · CGSeg · CPC · regionals · JLS · MCO.' },
];

const ESQUEMA_C3: Esquema = {
  id: 'esq-mos-c3',
  temaSlug: 'c3-la-coordinacio-policial',
  ambit: 'C',
  kicker: 'ÀMBIT C · TEMA C.3',
  title: 'Coordinació',
  titleHighlight: 'policial',
  introOneLiner: 'Coordinació entre PG-ME, policies locals i FCSE (LO 2/1986). Llei 4/2003 d\'ordenació del sistema de seguretat pública. Cooperació internacional: Interpol, Europol, Schengen.',
  kpis: [
    { value: '195', label: 'països Interpol' },
    { value: '6', label: 'blocs temàtics' },
    { value: '37', label: 'fites clau' },
    { value: '6', label: 'institucions clau' },
    { value: '~ 7 min', label: 'lectura', mono: true },
  ],
  eras: C3_ERAS,
  timeline: C3_TIMELINE,
  people: C3_PEOPLE,
  exam: C3_EXAM,
  testHref: '/mossos/c3-la-coordinacio-policial',
  labels: { eras: 'Blocs', timeline: 'Òrgans i articles', people: 'Institucions clau' },
};

// ═══════════════════════════════════════════════════════════════
// C.4 — Marc legal de la seguretat
// ═══════════════════════════════════════════════════════════════
const C4_ERAS: Era[] = [
  { id: 'lo21986', name: 'LO 2/1986 estatal', range: '13 març · FCS', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'principis', name: 'Principis bàsics art. 5', range: '6 grans grups', color: '#C0392B', soft: '#F4D2CE' },
  { id: 'llei101994', name: 'Llei 10/1994 PG-ME', range: '11 juliol · integral', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'estructurapgme', name: 'Estructura PG-ME', range: '5 escales', color: '#5E3A8A', soft: '#E3D4F2' },
  { id: 'llei161991', name: 'Llei 16/1991 locals', range: '10 juliol · CAT', color: '#9C7A2A', soft: '#F4E6BC' },
  { id: 'estructuralocal', name: 'Estructura policia local', range: '4 escales', color: '#0BB4C2', soft: '#CCEEF1' },
];

const C4_TIMELINE: Milestone[] = [
  { eraId: 'lo21986', date: 'LO 2/1986', title: '13 març · FCS', note: 'Desplega art. 104 CE.', star: true },
  { eraId: 'lo21986', date: 'Art. 2', title: '3 tipus de FCS', note: 'FCSE + autonòmiques + locals.', star: true },
  { eraId: 'lo21986', date: 'Art. 38', title: 'Funcions autonòmiques', note: 'Pròpies / compartides / col·laboració.' },
  { eraId: 'principis', date: '5.1', title: 'Adequació ordenament jurídic', star: true },
  { eraId: 'principis', date: 'Obediència', title: 'MAI ordres delictives', note: 'Obediència deguda no ampara.', star: true },
  { eraId: 'principis', date: '5.2', title: 'Relacions amb la comunitat', note: 'Tracte correcte.' },
  { eraId: 'principis', date: '5.2.c', title: 'Congruència · Oportunitat · Proporcionalitat', note: 'CO-PR. Memoritzar.', star: true },
  { eraId: 'principis', date: '5.2.d', title: 'Ús d\'armes', note: 'Només risc racionalment greu.' },
  { eraId: 'principis', date: '5.3', title: 'Tractament de detinguts', note: 'Identificació, integritat, terminis.' },
  { eraId: 'principis', date: '5.4', title: 'Dedicació professional', note: 'Total · dins i fora servei.' },
  { eraId: 'principis', date: '5.5', title: 'Secret professional' },
  { eraId: 'principis', date: '5.6', title: 'Responsabilitat personal i directa' },
  { eraId: 'llei101994', date: 'Llei 10/1994', title: '11 juliol · PG-ME', note: 'Policia ordinària i integral.', star: true },
  { eraId: 'llei101994', date: 'Antecedent', title: 'Llei 19/1983 · 14 juliol' },
  { eraId: 'llei101994', date: 'DA 2a', title: 'Aplicació arts. 5, 6, 7, 8 LO 2/1986' },
  { eraId: 'llei101994', date: 'Art. 11', title: 'Funcions PG-ME', note: 'Seguretat ciutadana, administrativa, judicial, conflictes, cooperació, transferides.', star: true },
  { eraId: 'llei101994', date: 'LO 4/2015', title: 'Protecció seguretat ciutadana', note: '30 març.', star: true },
  { eraId: 'llei101994', date: 'ABP', title: 'Àrea Bàsica Policial', note: 'NO inclou parts de diferents comarques.', star: true },
  { eraId: 'llei101994', date: 'RP', title: 'Regió Policial · coordinació jeràrquica' },
  { eraId: 'estructurapgme', date: 'Bàsica', title: 'Mosso · Caporal', star: true },
  { eraId: 'estructurapgme', date: 'Intermèdia', title: 'Sergent · Sotsinspector', star: true },
  { eraId: 'estructurapgme', date: 'Executiva', title: 'Inspector', star: true },
  { eraId: 'estructurapgme', date: 'Superior', title: 'Intendent · Comissari · Major', star: true },
  { eraId: 'estructurapgme', date: 'Suport', title: 'Facultatiu · Tècnic', note: 'Distintiu de PG-ME respecte a policia local.', star: true },
  { eraId: 'estructurapgme', date: 'CdP', title: 'Consell de la Policia', note: 'Paritari Administració-membres.' },
  { eraId: 'llei161991', date: 'Llei 16/1991', title: '10 juliol · Policies Locals CAT', note: 'Desplega art. 164.2 EAC.', star: true },
  { eraId: 'llei161991', date: '> 10.000', title: 'Habitants per crear policia local', star: true },
  { eraId: 'llei161991', date: 'Excepció', title: 'Conseller d\'Interior pot autoritzar amb menys' },
  { eraId: 'llei161991', date: 'Comandament', title: "Alcalde · cap del cos directe", star: true },
  { eraId: 'llei161991', date: 'Àmbit', title: 'Només municipi propi', note: 'Excepció: emergència en limítrofs.', star: true },
  { eraId: 'llei161991', date: 'Art. 11', title: 'Funcions policies locals', note: 'Trànsit urbà, atestats, policia administrativa, judicial, seguretat viària.' },
  { eraId: 'llei161991', date: 'Sense cos', title: 'Guàrdies/vigilants/agents/algutzirs', note: 'Cap pot dur arma.' },
  { eraId: 'llei161991', date: 'Dipòsit', title: 'Detinguts a municipis cap de partit', note: 'Sense establiment penitenciari.' },
  { eraId: 'estructuralocal', date: 'Superior', title: 'Superintendent · Intendent major · Intendent' },
  { eraId: 'estructuralocal', date: 'Executiva', title: 'Inspector' },
  { eraId: 'estructuralocal', date: 'Intermèdia', title: 'Sotsinspector · Sergent' },
  { eraId: 'estructuralocal', date: 'Bàsica', title: 'Caporal · Agent', note: 'NO té escala de suport.', star: true },
];

const C4_PEOPLE: EsquemaPerson[] = [
  { id: 'c4-lo21986', name: 'LO 2/1986', eraId: 'lo21986', period: '13 març 1986', role: 'Llei estatal FCS', initials: 'LO2', icon: 'scroll', fact: 'Forces i cossos de seguretat. Desplega art. 104 CE. Estableix els principis bàsics d\'actuació (art. 5).' },
  { id: 'c4-llei101994', name: 'Llei 10/1994', eraId: 'llei101994', period: '11 juliol 1994', role: 'Llei PG-ME', initials: 'L10', icon: 'scroll', fact: 'PG-ME com a policia ordinària i integral. Estableix funcions, ABP i RP.' },
  { id: 'c4-llei161991', name: 'Llei 16/1991', eraId: 'llei161991', period: '10 juliol 1991', role: 'Policies locals CAT', initials: 'L16', icon: 'scroll', fact: 'Desplega l\'art. 164.2 EAC. Crea cos amb > 10.000 hab. Comandament: alcalde.' },
  { id: 'c4-copr', name: 'CO-PR', eraId: 'principis', period: 'Art. 5.2.c', role: 'Principis ús força', initials: 'CO', icon: 'sword', fact: 'Congruència · Oportunitat · Proporcionalitat. Memoritzar.' },
  { id: 'c4-lo42015', name: 'LO 4/2015', eraId: 'llei101994', period: '30 març 2015', role: 'Seguretat ciutadana', initials: 'LO4', icon: 'scroll', fact: '"Llei mordassa". Marc d\'actuació policial actual.' },
  { id: 'c4-5escales', name: 'Escales PG-ME', eraId: 'estructurapgme', period: '5 escales', role: 'Jerarquia', initials: '5E', icon: 'crown', fact: 'Bàsica · intermèdia · executiva · superior · suport (l\'única diferència amb les 4 de policia local).' },
];

const C4_EXAM: ExamItem[] = [
  { date: '3 lleis clau', text: 'LO 2/1986 (estatal) · Llei 10/1994 (PG-ME) · Llei 16/1991 (locals).' },
  { date: '6 principis art. 5', text: 'Ordenament · comunitat · detinguts · dedicació · secret · responsabilitat. PREGUNTA CLÀSSICA.' },
  { date: 'CO-PR', text: 'Congruència · Oportunitat · Proporcionalitat (art. 5.2.c).' },
  { date: 'Escales PG-ME', text: '5: bàsica, intermèdia, executiva, superior, suport.' },
  { date: 'Escales locals', text: '4: bàsica, intermèdia, executiva, superior (NO té suport).' },
  { date: 'ABP', text: 'Una ABP NO inclou parts de diferents comarques.' },
  { date: 'Policia local', text: '> 10.000 hab. Comandament: alcalde. Àmbit: municipi propi.' },
  { date: 'LO 4/2015', text: 'Protecció de la seguretat ciutadana (30 març).' },
];

const ESQUEMA_C4: Esquema = {
  id: 'esq-mos-c4',
  temaSlug: 'c4-el-marc-legal-de-la-seguretat',
  ambit: 'C',
  kicker: 'ÀMBIT C · TEMA C.4',
  title: 'Marc legal',
  titleHighlight: 'de la seguretat',
  introOneLiner: 'Tres lleis cabdals: LO 2/1986 (estatal), Llei 10/1994 (PG-ME) i Llei 16/1991 (policies locals). Defineixen els principis bàsics d\'actuació, funcions, estructura jeràrquica i àmbits.',
  kpis: [
    { value: '3', label: 'lleis cabdals' },
    { value: '6', label: 'blocs temàtics' },
    { value: '37', label: 'fites clau' },
    { value: '6', label: 'normes i conceptes' },
    { value: '~ 7 min', label: 'lectura', mono: true },
  ],
  eras: C4_ERAS,
  timeline: C4_TIMELINE,
  people: C4_PEOPLE,
  exam: C4_EXAM,
  testHref: '/mossos/c4-el-marc-legal-de-la-seguretat',
  labels: { eras: 'Blocs', timeline: 'Articles i principis', people: 'Lleis clau' },
};

// ═══════════════════════════════════════════════════════════════
// C.5 — Codi deontològic policial
// ═══════════════════════════════════════════════════════════════
const C5_ERAS: Era[] = [
  { id: 'deontologia', name: 'Deontologia policial', range: 'principis ètics', color: '#FF7A1A', soft: '#FFE0CB' },
  { id: 'europeu', name: 'Codi europeu', range: 'REC(2001)10', color: '#3B6BF5', soft: '#D8E2FE' },
  { id: 'catala', name: 'Codi català', range: 'GOV/25/2015', color: '#C0392B', soft: '#F4D2CE' },
];

const C5_TIMELINE: Milestone[] = [
  { eraId: 'deontologia', date: 'Concepte', title: 'Deures mínims exigibles' },
  { eraId: 'deontologia', date: 'Origen', title: 'Sorgeix del propi col·lectiu professional' },
  { eraId: 'deontologia', date: 'Plasma', title: 'Codis deontològics escrits' },
  { eraId: 'deontologia', date: 'Doble garantia', title: 'Per al ciutadà i per al policia', star: true },
  { eraId: 'deontologia', date: 'Específica', title: 'Protecció de drets humans', note: 'No només complir la llei: mostrar respecte.', star: true },
  { eraId: 'deontologia', date: 'Garants', title: "L'Estat i la policia, garants dels drets" },
  { eraId: 'europeu', date: '19 set. 2001', title: 'REC(2001)10', note: 'Comitè Ministres Consell d\'Europa.', star: true },
  { eraId: 'europeu', date: 'Codi europeu', title: 'Ètica de la policia' },
  { eraId: 'europeu', date: 'Fonament', title: 'Convenció Europea dels Drets Humans', star: true },
  { eraId: 'europeu', date: 'Estat de dret', title: 'Principi base · qualsevol democràcia' },
  { eraId: 'europeu', date: 'INT/1828/2004', title: '14 juny · Resolució incorporació CAT', star: true },
  { eraId: 'europeu', date: 'Aplicació', title: 'Membres PG-ME adequen funcions al Codi' },
  { eraId: 'catala', date: '2007', title: "Comitè d'Ètica de la Policia de Catalunya", note: 'Eina de recerca i consulta.', star: true },
  { eraId: 'catala', date: '24 febrer 2015', title: 'Acord GOV/25/2015', note: 'Aprova el Codi d\'Ètica de la Policia de Catalunya.', star: true },
  { eraId: 'catala', date: 'Naturalesa', title: 'NO reglamenta pràctiques concretes', star: true },
  { eraId: 'catala', date: 'Eina', title: 'Pedagògica i inspiradora' },
  { eraId: 'catala', date: 'Identifica', title: 'Mínims ètics comuns · principis · valors' },
  { eraId: 'catala', date: 'Marc', title: 'També per a vigilants municipals', note: 'Segons preàmbul.', star: true },
  { eraId: 'catala', date: 'Modificable', title: 'S\'adapta a l\'evolució de la societat' },
  { eraId: 'catala', date: 'Continguts', title: 'Autonomia d\'actuació · drets · deures · bones pràctiques' },
  { eraId: 'catala', date: 'Promou', title: 'Actuació no discriminatòria · respecte dignitat' },
  { eraId: 'catala', date: 'Destaca', title: 'Cooperació · col·laboració justícia · informació' },
  { eraId: 'catala', date: 'Caràcter', title: 'Proximitat · pedagògic · convivència' },
  { eraId: 'catala', date: 'Objectiu', title: 'Credibilitat del cos · confiança ciutadana' },
];

const C5_PEOPLE: EsquemaPerson[] = [
  { id: 'c5-rec2001', name: 'REC(2001)10', eraId: 'europeu', period: '19 setembre 2001', role: 'Codi europeu', initials: 'REC', icon: 'scroll', fact: 'Recomanació del Comitè de Ministres del Consell d\'Europa. Codi europeu d\'ètica de la policia.' },
  { id: 'c5-int1828', name: 'INT/1828/2004', eraId: 'europeu', period: '14 juny 2004', role: 'Aplicació a CAT', initials: 'INT', icon: 'scroll', fact: 'Resolució d\'incorporació i aplicació del Codi europeu a la PG-ME.' },
  { id: 'c5-gov252015', name: 'GOV/25/2015', eraId: 'catala', period: '24 febrer 2015', role: 'Codi català', initials: 'GOV', icon: 'flag', fact: 'Acord del Govern que aprova el Codi d\'Ètica de la Policia de Catalunya.' },
  { id: 'c5-comite', name: "Comitè d'Ètica de la Policia", eraId: 'catala', period: 'Creat 2007', role: 'Eina de recerca', initials: 'CdE', icon: 'flag', fact: 'Proposa el Codi català. Eina de consulta.' },
  { id: 'c5-consellep', name: "Consell d'Europa", eraId: 'europeu', period: 'Estrasburg', role: 'Organisme drets humans', initials: 'CoE', icon: 'crown', fact: 'NO és UE. 46 estats. Va aprovar REC(2001)10.' },
];

const C5_EXAM: ExamItem[] = [
  { date: '3 normes clau', text: 'REC(2001)10 (CoE) · INT/1828/2004 (CAT) · GOV/25/2015 (Codi CAT).' },
  { date: '2007', text: 'Creació del Comitè d\'Ètica de la Policia de Catalunya.' },
  { date: 'GOV/25/2015', text: 'Codi d\'ètica · 24 febrer · NO reglamenta pràctiques concretes.' },
  { date: 'REC(2001)10', text: '19 setembre 2001. Comitè Ministres Consell d\'Europa.' },
  { date: 'Naturalesa', text: 'Eina pedagògica i inspiradora · no reglamentària.' },
  { date: '3 Consells', text: "Consell d'Europa (Estrasburg, 46 estats, DDHH) ≠ Consell UE (ministres) ≠ Consell Europeu (caps Estat)." },
  { date: 'Convenció', text: 'Fonament del Codi europeu: Convenció Europea dels Drets Humans.' },
  { date: 'Vigilants municipals', text: 'El Codi català és també marc per a ells (preàmbul).' },
];

const ESQUEMA_C5: Esquema = {
  id: 'esq-mos-c5',
  temaSlug: 'c5-el-codi-deontologic-policial',
  ambit: 'C',
  kicker: 'ÀMBIT C · TEMA C.5',
  title: 'Codi',
  titleHighlight: 'deontològic policial',
  introOneLiner: "Codi europeu d'ètica de la policia REC(2001)10 (Consell d'Europa, 19 set. 2001) + Acord GOV/25/2015 que aprova el Codi d'Ètica de la Policia de Catalunya. Comitè d'Ètica creat el 2007.",
  kpis: [
    { value: '2015', label: 'Codi CAT', mono: true },
    { value: '3', label: 'blocs temàtics' },
    { value: '24', label: 'fites clau' },
    { value: '5', label: 'normes i institucions' },
    { value: '~ 4 min', label: 'lectura', mono: true },
  ],
  eras: C5_ERAS,
  timeline: C5_TIMELINE,
  people: C5_PEOPLE,
  exam: C5_EXAM,
  testHref: '/mossos/c5-el-codi-deontologic-policial',
  labels: { eras: 'Blocs', timeline: 'Normes i conceptes', people: 'Normes clau' },
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
  [ESQUEMA_B1.id]: ESQUEMA_B1,
  [ESQUEMA_B2.id]: ESQUEMA_B2,
  [ESQUEMA_B3.id]: ESQUEMA_B3,
  [ESQUEMA_B4.id]: ESQUEMA_B4,
  [ESQUEMA_B5.id]: ESQUEMA_B5,
  [ESQUEMA_B6.id]: ESQUEMA_B6,
  [ESQUEMA_B7.id]: ESQUEMA_B7,
  [ESQUEMA_B8.id]: ESQUEMA_B8,
  [ESQUEMA_C1.id]: ESQUEMA_C1,
  [ESQUEMA_C2.id]: ESQUEMA_C2,
  [ESQUEMA_C3.id]: ESQUEMA_C3,
  [ESQUEMA_C4.id]: ESQUEMA_C4,
  [ESQUEMA_C5.id]: ESQUEMA_C5,
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
