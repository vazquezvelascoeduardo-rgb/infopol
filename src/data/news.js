// Noticias InfoPol — actualitzades diàriament

export const CATEGORIES = [
  { id: 'tot',         label: 'Tot',       icon: 'grid' },
  { id: 'politica',   label: 'Política',  icon: 'scale' },
  { id: 'economia',   label: 'Economia',  icon: 'chart' },
  { id: 'internacional', label: 'Internacional', icon: 'globe' },
  { id: 'cultura',    label: 'Cultura',   icon: 'book' },
  { id: 'esports',    label: 'Esports',   icon: 'trophy' },
  { id: 'policials',  label: 'Policials', icon: 'shield' },
];

export const CAT_STYLE = {
  politica:      { solid: '#E89421', soft: '#FBE7C2', ink: '#6B3F08' },
  economia:      { solid: '#1FB286', soft: '#CDF0E1', ink: '#0B5A3D' },
  internacional: { solid: '#3B6BF5', soft: '#D8E2FE', ink: '#0E2B7A' },
  cultura:       { solid: '#F0B400', soft: '#FCEFB8', ink: '#5C4400' },
  esports:       { solid: '#FF7A1A', soft: '#FFE0CB', ink: '#7A2E04' },
  policials:     { solid: '#E04F5F', soft: '#FBDADC', ink: '#7A1B22' },
};

export const NEWS = [
  // ── POLÍTICA ───────────────────────────────────────────────────
  {
    id: 'p1',
    date: '08·11·2026',
    category: 'politica',
    tag: 'Eleccions 29N',
    title: 'Arrenca la campanya per a les generals del 29 de novembre',
    desc: 'Pedro Sánchez ha confirmat la convocatòria de les eleccions generals per al 29N. El PSOE comença la campanya amb Jordi Hereu encapçalant la llista del PSC per Barcelona.',
    url: 'https://www.eldiario.es/politica/ultima-hora-actualidad-politica-directo_6_13646030.html',
  },
  {
    id: 'p2',
    date: '08·11·2026',
    category: 'politica',
    tag: 'Enquestes',
    title: 'El PP s\'obre pas i Catalunya es perfila com l\'últim bastió socialista',
    desc: 'Un nou sondatge publicat avui dona avantatge al PP i a Vox sobre el PSOE a escala estatal. Catalunya seria l\'única comunitat on el PSC mantindria un fort suport.',
    url: 'https://www.elnacional.cat/es/politica.html',
  },
  {
    id: 'p3',
    date: '07·11·2026',
    category: 'politica',
    tag: 'Junts · 29N',
    title: 'Nogueras exigeix la gestió fiscal de Catalunya com a condició postelectoral',
    desc: 'Míriam Nogueras (Junts) fixa que la recaptació i la gestió d\'impostos a Catalunya sigui una condició innegociable per donar suport a qualsevol govern format després del 29N.',
    url: 'https://www.elnacional.cat/es/politica/que-candidatos-elecciones-generales-2026-puedes-votar-en-catalunya_1717678_102.html',
  },

  // ── ECONOMIA ───────────────────────────────────────────────────
  {
    id: 'e1',
    date: '02·11·2026',
    category: 'economia',
    tag: 'Banc d\'Espanya',
    title: 'El PIB creix un 2,6% el 2026 però la inflació s\'encareix fins al 3,9%',
    desc: 'El Banc d\'Espanya publica les projeccions del 3r trimestre: l\'economia espanyola manté el dinamisme però la tensió geopolítica a l\'Orient Mitjà pressiona els preus de l\'energia.',
    url: 'https://www.bde.es/wbe/en/publicaciones/analisis-economico-investigacion/proyecciones-macro-informe-trimestral/proyecciones-e-informe-trimestral-de-la-economia-espanola-tercer-trimestre-2026.html',
  },
  {
    id: 'e2',
    date: '02·11·2026',
    category: 'economia',
    tag: 'BCE · Tipus',
    title: 'El BCE manté els tipus d\'interès sense canvis en la reunió d\'octubre',
    desc: 'El Banc Central Europeu ha decidit mantenir els tipus de referència estables. Els analistes apunten a una possible baixada al primer trimestre de 2027 si la inflació de la zona euro cedeix.',
    url: 'https://www.coev.com/proyecciones-macroeconomicas-e-informe-trimestral-de-la-economia-espanola-tercer-trimestre-2026',
  },

  // ── INTERNACIONAL ──────────────────────────────────────────────
  {
    id: 'i1',
    date: '08·11·2026',
    category: 'internacional',
    tag: 'Ucraïna',
    title: 'Més de 850.000 persones sense llum a Ucraïna per nous atacs russos',
    desc: 'Rússia ha reprès els bombardejos a la xarxa elèctrica ucraïnesa. Euronews informa que els atacs d\'aquesta setmana han deixat centenars de milers de civils sense subministrament.',
    url: 'https://es.euronews.com/video/2026/11/08/ultimas-noticias-08-noviembre-2026-tarde',
  },
  {
    id: 'i2',
    date: '07·11·2026',
    category: 'internacional',
    tag: 'Polònia',
    title: 'Tiroteig a Cracòvia el 7 de novembre: s\'investiga el mòbil',
    desc: 'Les autoritats poloneses investiguen un tiroteig registrat a Cracòvia. Euronews el recull com un dels fets de seguretat més greus a la capital cultural polonesa en els darrers anys.',
    url: 'https://es.euronews.com/video/2026/11/08/ultimas-noticias-08-noviembre-2026-tarde',
  },
  {
    id: 'i3',
    date: '06·11·2026',
    category: 'internacional',
    tag: 'Egipte',
    title: 'Xoc de trens a Egipte deixa 4 morts i 88 ferits',
    desc: 'Un accident ferroviari al Caire ha provocat quatre víctimes mortals i 88 ferits, alguns en estat crític. Les autoritats egipcies han obert una investigació sobre les causes de la col·lisió.',
    url: 'https://www.infobae.com/america/agencias/2026/11/06/viernes-6-de-noviembre-de-2026-0800-gmt/',
  },

  // ── CULTURA / CIÈNCIA ──────────────────────────────────────────
  {
    id: 'c1',
    date: 'Oct 2026',
    category: 'cultura',
    tag: 'Nobel Física',
    title: 'Francis Halzen, Nobel de Física per detectar neutrins d\'alta energia des de l\'Antàrtida',
    desc: 'L\'Observatori IceCube, situat al pol sud, ha permès a Halzen i el seu equip captar neutrins d\'origen astrofísic, obrint una nova finestra per observar l\'univers.',
    url: 'https://es-us.noticias.yahoo.com/nobel-ciencia-2026-qui%C3%A9nes-ganadores-091446335.html',
  },
  {
    id: 'c2',
    date: 'Oct 2026',
    category: 'cultura',
    tag: 'Nobel Medicina',
    title: 'Karl Deisseroth premia per la optogenètica: controlar neurones amb llum',
    desc: 'El Nobel de Medicina 2026 recau en Deisseroth, Hegemann i Nagel pel desenvolupament de canals iònics activats per llum, una tècnica revolucionària per estudiar el cervell viu.',
    url: 'https://es.qz.com/2026-premios-nobel-fsica-qumica-medicina-literatura',
  },
  {
    id: 'c3',
    date: 'Oct 2026',
    category: 'cultura',
    tag: 'Nobel Química',
    title: 'Kagan i Soai, Nobel de Química per la simetria de les molècules',
    desc: 'El premi Nobel de Química 2026 reconeix la feina del científic francès Henri B. Kagan i el japonès Kenso Soai sobre les imatges especulars moleculars, fonamentals per al disseny de fàrmacs.',
    url: 'https://es.qz.com/2026-premios-nobel-fsica-qumica-medicina-literatura',
  },

  // ── ESPORTS ────────────────────────────────────────────────────
  {
    id: 'es1',
    date: '19·07·2026',
    category: 'esports',
    tag: 'Mundial 2026',
    title: 'Espanya, campiona del Món! Derrota Argentina en la pròrroga (1–0)',
    desc: 'La selecció espanyola es va proclamar campiona del Món al MetLife Stadium de Nova Jersey el 19 de juliol de 2026, en un encontre que va decidir-se en la pròrroga contra Argentina.',
    url: 'https://www.primicias.ec/tag/mundial-2026/5/',
  },
  {
    id: 'es2',
    date: '08·11·2026',
    category: 'esports',
    tag: 'Nations League',
    title: 'Espanya s\'enfronta a la República Txeca el 12N i a Anglaterra el 15N',
    desc: 'La selecció espanyola tanca la fase de grups de la UEFA Nations League amb dos duels clau. El primer, dimecres 12 de novembre a les 20:45h; el segon, dissabte 15 de novembre.',
    url: 'https://espndeportes.espn.com/futbol/equipo/calendario/_/id/164/spain',
  },

  // ── POLICIALS / LEGALS ─────────────────────────────────────────
  {
    id: 'pl1',
    date: '2026',
    category: 'policials',
    tag: 'Catalunya · Armes',
    title: 'Catalunya suma 24 tiroteos el 2026: el risc per a víctimes alienes augmenta un 30%',
    desc: 'El Diari Catalunya recull un increment significatiu dels incidents amb armes de foc a la comunitat. El nombre de tiroteos ha crescut respecte al 2025, amb major risc per a transeünts.',
    url: 'https://diaricatalunya.cat/en/barcelones/general/cataluna-suma-24-tiroteos-en-2026-crece-el-riesgo-de-victimas-ajenas',
  },
  {
    id: 'pl2',
    date: '2026',
    category: 'policials',
    tag: 'Tribunal Suprem · Amnistia',
    title: 'El Suprem extingeix la responsabilitat penal de Junqueras i altres leaders del Procés per la llei d\'amnistia',
    desc: 'El Tribunal Suprem aplica la sentència del Tribunal Constitucional i declara extingida la responsabilitat penal d\'Oriol Junqueras, Raül Romeva, Jordi Turull i Dolors Bassa.',
    url: 'https://www.elindependiente.com/espana/2026/08/02/curso-judicial-sentencias-historicas-seis-frentes-psoe/amp/',
  },
];
