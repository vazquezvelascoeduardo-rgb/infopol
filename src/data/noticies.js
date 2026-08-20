// Notícies publicades el 20 d'agost de 2026
// Es genera diàriament a les 22:00 amb un resum breu + enllaç a la font
export const NOTICIES_META = {
  updatedAt: '2026-08-20T22:00:00+02:00',
  updatedLabel: '20 d\'agost de 2026',
};

export const NOTICIES = [
  // ── Catalunya ───────────────────────────────────────────────
  {
    id: 'cat-temps-20260820',
    date: '08·20',
    scope: 'catalunya',
    tag: 'Catalunya · Temps',
    title: 'Canvi radical de temps: pluges fortes a Barcelona i baixada tèrmica',
    desc: 'Arriba el primer trencament de l\'estiu amb tempestes, pluja intensa a l\'AMB i un descens marcat de temperatures que s\'estén a la resta del país.',
    url: 'https://www.elnacional.cat/ca/temps-avui/temps-catalunya-dijous-20-agost-arriba-canvi-radical-temps-catalunya-pluja-forta-barcelona_1683547_102.html',
    source: 'elnacional.cat',
  },
  {
    id: 'cat-illa-agenda-20260820',
    date: '08·20',
    scope: 'catalunya',
    tag: 'Catalunya · Política',
    title: 'El Govern d\'Illa manté l\'agenda d\'estiu centrada en pressupostos i habitatge',
    desc: 'Amb Alícia Romero al capdavant d\'Economia, l\'executiu treballa el retorn de setembre amb els comptes de 2027 i el desplegament del decret d\'habitatge.',
    url: 'https://www.elnacional.cat/es/politica.html',
    source: 'elnacional.cat',
  },

  // ── Espanya · Política ──────────────────────────────────────
  {
    id: 'esp-menors-pp-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Espanya · Política',
    title: 'L\'acollida de menors desencadena una nova guerra entre Govern i PP',
    desc: 'La distribució de menors migrants no acompanyats torna a enfrontar la Moncloa amb les comunitats del PP, que denuncien manca de recursos i previsió.',
    url: 'https://www.eldiario.es/adelanto/20-de-agosto-de-2026/',
    source: 'elDiario.es',
  },
  {
    id: 'esp-ceuta-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Espanya · Migració',
    title: 'El Govern evacua 500 nenes de Ceuta tot i proclamar la normalitat',
    desc: 'Interior activa el trasllat urgent de menors des dels centres saturats mentre la Justícia investiga una màfia que mou immigrants cap a la Península.',
    url: 'https://www.eldiario.es/adelanto/20-de-agosto-de-2026/',
    source: 'elDiario.es',
  },
  {
    id: 'esp-feijoo-marroc-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Espanya · Política',
    title: 'Feijóo planta cara al Marroc: "No admetré xantatges"',
    desc: 'El líder del PP endureix el discurs sobre la frontera sud i acusa Rabat d\'utilitzar la pressió migratòria com a moneda de canvi diplomàtica.',
    url: 'https://www.pressdigital.es/articulo/economia/2026-08-20/5988740-principales-titulares-periodicos-jueves-20-agosto',
    source: 'pressdigital.es',
  },

  // ── Espanya · Economia ──────────────────────────────────────
  {
    id: 'esp-creixement-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Espanya · Economia',
    title: 'Espanya vol tornar a batre les previsions de creixement el 2026',
    desc: 'El Ministeri d\'Economia confia liderar per tercer any consecutiu les grans economies de la zona euro, amb el consum intern i el turisme com a motors.',
    url: 'https://www.eldiario.es/economia/espana-busca-batir-previsiones-crecimiento-2026-liderar-grandes-economias-tercer-ano_1_12879125.html',
    source: 'elDiario.es',
  },
  {
    id: 'esp-hisenda-mercalicante-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Espanya · Economia',
    title: 'Arcadi España visita Mercalicante per reforçar la xarxa Mercasa',
    desc: 'El ministre d\'Hisenda es reuneix amb Mercasa i els operadors del mercat central per abordar inversions logístiques i control de preus alimentaris.',
    url: 'https://www.infobae.com/espana/agencias/2026/08/19/temas-del-dia-de-efe-espana-del-jueves-20-de-agosto-de-2026/',
    source: 'infobae.com',
  },

  // ── Successos / Legal ───────────────────────────────────────
  {
    id: 'suc-valladolid-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Successos · Valladolid',
    title: 'Detingut un jove per agredir un agent i saltar-se una ordre d\'allunyament',
    desc: 'La Policia Nacional el va arrestar després d\'una baralla en una immobiliària, on va destrossar mobiliari i va tornar a acostar-se a la víctima protegida.',
    url: 'https://www.diariodevalladolid.es/valladolid/260820/285693/detenido-joven-valladolid-tras-agredir-agente-robar-destrozar-inmobiliaria-saltarse-orden-alejamiento.html',
    source: 'diariodevalladolid.es',
  },
  {
    id: 'suc-alacant-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Successos · Alacant',
    title: 'Detinguda una cuidadora per apropiar-se de més de 40.000 € a una parella d\'ancians',
    desc: 'La dona, de 26 anys, hauria fet extraccions successives amb la targeta de la parella que atenia fins a buidar bona part dels seus estalvis.',
    url: 'https://www.eldebate.com/espana/comunidad-valenciana/20260820/detenida-cuidadora-acusada-robar-40000-euros-pareja-ancianos-atendia-alicante_450901.html',
    source: 'eldebate.com',
  },

  // ── Internacional ───────────────────────────────────────────
  {
    id: 'int-iran-uae-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Internacional · Orient Mitjà',
    title: 'Els EAU decreten un embargament total a l\'Iran i Trump anuncia noves sancions',
    desc: 'Emirats Àrabs Units talla el comerç amb Teheran mentre la Casa Blanca presenta l\'"operació econòmica més aixafant" mai vista contra el règim iranià.',
    url: 'https://www.democracynow.org/2026/8/20/headlines',
    source: 'democracynow.org',
  },
  {
    id: 'int-israel-siria-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Internacional · Israel-Síria',
    title: 'L\'administració Trump critica Israel per un nou atac aeri a Síria',
    desc: 'Washington marca distàncies amb Netanyahu després del bombardeig i reclama contenció mentre continua la mediació al Golf.',
    url: 'https://www.democracynow.org/2026/8/20/headlines',
    source: 'democracynow.org',
  },
  {
    id: 'int-kushner-hamas-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Internacional · Gaza',
    title: 'Kushner es reuneix amb Hamàs a Egipte per desencallar l\'alto el foc',
    desc: 'El gendre de Trump lidera una trobada discreta al Caire per revifar les negociacions estancades sobre Gaza i la retenció d\'hostatges.',
    url: 'https://www.democracynow.org/2026/8/20/headlines',
    source: 'democracynow.org',
  },
  {
    id: 'int-cpi-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Internacional · Justícia',
    title: 'La CPI qualifica d\'"atac flagrant" les sancions dels EUA contra els seus alts càrrecs',
    desc: 'El Tribunal Penal Internacional respon a les mesures de Washington i promet seguir investigant crims a Ucraïna, Gaza i altres escenaris.',
    url: 'https://www.justsecurity.org/154606/early-edition-august-20-2026/',
    source: 'justsecurity.org',
  },
  {
    id: 'int-ebola-congo-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Internacional · Salut',
    title: 'El brot d\'ebola al Congo supera els 5.000 casos i quasi 2.400 morts',
    desc: 'L\'OMS reforça equips sobre el terreny davant una letalitat de gairebé el 50 %, amb dèficit de vacunes i dificultats logístiques a l\'est del país.',
    url: 'https://havanatimes.org/news/international-news-briefs-for-thursday-august-20-2026/',
    source: 'havanatimes.org',
  },

  // ── Cultura · Descobriments · Premis ─────────────────────────
  {
    id: 'cul-vacuna-melanoma-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Ciència · Salut',
    title: 'Moderna i Merck anuncien l\'èxit de la primera vacuna contra el melanoma',
    desc: 'Els assajos de fase III confirmen una reducció significativa de les recaigudes en pacients d\'alt risc. Es preveu la sol·licitud de comercialització aviat.',
    url: 'https://www.eldiario.es/adelanto/20-de-agosto-de-2026/',
    source: 'elDiario.es',
  },
  {
    id: 'cul-eugenio-espejo-20260820',
    date: '08·20',
    scope: 'internacional',
    tag: 'Cultura · Premis',
    title: 'Equador lliura els Premis Nacionals Eugenio Espejo 2026',
    desc: 'La màxima distinció del país reconeix tres trajectòries en literatura, art i ciència, amb medalla, dotació econòmica i pensió vitalícia.',
    url: 'https://www.infobae.com/america/america-latina/2026/08/05/ecuador-reconocio-a-tres-referentes-de-la-cultura-y-la-ciencia-con-el-premio-eugenio-espejo-2026/',
    source: 'infobae.com',
  },

  // ── Esports ─────────────────────────────────────────────────
  {
    id: 'esp-rodri-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Esports · Futbol',
    title: 'Rodri passa el reconeixement mèdic i viatja a Barcelona per la Supercopa',
    desc: 'El centrecampista del City rep l\'alta abans del compromís continental amb el combinat espanyol, en una pretemporada marcada per les càrregues físiques.',
    url: 'https://www.eurosport.es/futbol/mercado-de-fichajes-2026/2026/real-madrid-se-lanza-por-centrocampista-revelacion-primera-jornada-liga-autor-mejor-gol_sto23329210/story.shtml',
    source: 'eurosport.es',
  },
  {
    id: 'esp-atleti-kangin-20260820',
    date: '08·20',
    scope: 'espanya',
    tag: 'Esports · Fitxatges',
    title: 'L\'Atlètic de Madrid presenta Kang-in Lee com a nou reforç ofensiu',
    desc: 'El sud-coreà arriba des del PSG per donar una alternativa creativa a Simeone en atac, en una pretemporada on el Reial Madrid i el Barça també han golejat.',
    url: 'https://www.eurosport.es/futbol/mercado-de-fichajes-2026/2026/real-madrid-se-lanza-por-centrocampista-revelacion-primera-jornada-liga-autor-mejor-gol_sto23329210/story.shtml',
    source: 'eurosport.es',
  },
];

export const NOTICIES_SCOPES = [
  { id: 'all', label: 'Totes' },
  { id: 'catalunya', label: 'Catalunya' },
  { id: 'espanya', label: 'Espanya' },
  { id: 'internacional', label: 'Internacional' },
];
