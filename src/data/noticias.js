// Mapa: categoria → token de color (T.cat keys)
export const CAT_COLOR = {
  politica:      "operativa",
  policial:      "leyes",
  economia:      "atajos",
  internacional: "transito",
  ciencia:       "physical",
  cultura:       "academia",
  esports:       "psico",
  meteo:         "tests",
};

// cat: clau de CAT_COLOR
// geo: 'Catalunya' | 'Espanya' | 'Internacional'
// date: 'DD·MM'
// tag: etiqueta curta
// title: títol breu
// desc: resum 1-2 frases
// url: font original
export const NOTICIAS = [
  // ── POLICIALS / LEGALS ─────────────────────────────────────────────
  {
    id: 1,
    date: "12·11",
    cat: "policial",
    geo: "Catalunya",
    tag: "Vaga general",
    title: "52 detinguts a Barcelona pels altercats de la vaga: 6 menors",
    desc: "Els Mossos d'Esquadra van detenir 52 joves durant els disturbis de dimecres a Barcelona. Interior anuncia una investigació sobre les càrregues policials i els socis del govern exigeixen la dimissió del ministre Marlaska.",
    url: "https://www.infobae.com/espana/agencias/2026/11/12/temas-del-dia-de-efe-espana-del-jueves-12-de-noviembre-de-2026-1330-horas/",
  },
  {
    id: 2,
    date: "12·11",
    cat: "policial",
    geo: "Espanya",
    tag: "Fiscalia Europea",
    title: "La Fiscalia Europea investiga un possible frau en la compra de polseres antimaltractament",
    desc: "La institució europea obre diligències sobre la contractació pública de dispositius de seguiment per a víctimes de violència de gènere a Espanya.",
    url: "https://www.infobae.com/espana/agencias/2026/11/12/temas-del-dia-de-efe-espana-del-jueves-12-de-noviembre-de-2026-1330-horas/",
  },

  // ── POLÍTICA ───────────────────────────────────────────────────────
  {
    id: 3,
    date: "12·11",
    cat: "politica",
    geo: "Espanya",
    tag: "Eleccions 29N",
    title: "Primera vaga general en 14 anys: el govern entra a la precampanya tocada",
    desc: "La vaga del dimecres —la vuitena de la democràcia— deixa el govern en precampanya electoral de cara al 29N amb la qüestió de les càrregues policials com a pedra de toc del debat polític.",
    url: "https://www.infobae.com/espana/agencias/2026/11/11/hoy-sera-noticia-jueves-12-de-noviembre",
  },
  {
    id: 4,
    date: "12·11",
    cat: "politica",
    geo: "Espanya",
    tag: "Habitatge",
    title: "El Congrés aprova un dels dos decrets d'habitatge; cau el de renovació automàtica de lloguers",
    desc: "La Diputació Permanent va aprovar el primer decret d'habitatge per 35 vots contra 34, però va tombar el de renovació automàtica de lloguers en no tenir el suport del PNV.",
    url: "https://www.infobae.com/espana/agencias/2026/11/12/temas-del-dia-de-efe-espana-del-jueves-12-de-noviembre-de-2026-1330-horas/",
  },
  {
    id: 5,
    date: "12·11",
    cat: "politica",
    geo: "Catalunya",
    tag: "Baròmetre CEO",
    title: "Aliança Catalana supera Junts al primer baròmetre de 2026; el PSC d'Illa revalida victòria",
    desc: "Segons el Centre d'Estudis d'Opinió, Aliança Catalana creix i supera Junts en intenció de vot, mentre el PSC de Salvador Illa es mantindria com a primera força si hi hagués eleccions avui.",
    url: "https://theobjective.com/espana/cataluna/",
  },
  {
    id: 6,
    date: "12·11",
    cat: "politica",
    geo: "Catalunya",
    tag: "Finançament",
    title: "Dalmau exigeix a Junts que aclareixi el seu suport al nou model de finançament",
    desc: "El conseller d'Economia obre la pressió sobre Junts perquè es pronunciï sobre el model singular de finançament en tramitació al Congrés.",
    url: "https://www.democrata.es/catalunya/",
  },
  {
    id: 7,
    date: "12·11",
    cat: "politica",
    geo: "Catalunya",
    tag: "Parlament",
    title: "El Parlament tramita una llei per fixar un salari mínim de referència català",
    desc: "La cambra catalana debat un projecte de llei que busca establir un salari mínim propi per a Catalunya com a referència en la negociació col·lectiva.",
    url: "https://www.democrata.es/catalunya/",
  },

  // ── INTERNACIONAL ──────────────────────────────────────────────────
  {
    id: 8,
    date: "12·11",
    cat: "internacional",
    geo: "Internacional",
    tag: "Ucraïna · Pau",
    title: "Witkoff i Kushner viatgen a Moscou per veure Putin; Zelenski els rebrà a Dublín",
    desc: "Els enviats de la Casa Blanca es reuniran amb el president rus després de les negociacions trilaterals d'Abu Dabi. Moscou parla d'avenços cap a la pau però adverteix que la inclusió d'Europa podria frenar el procés.",
    url: "https://www.infobae.com/america/agencias/2026/11/12/temas-del-dia-de-efe-internacional-del-jueves-12-de-noviembre-de-2026-1200-gmt/",
  },
  {
    id: 9,
    date: "12·11",
    cat: "internacional",
    geo: "Internacional",
    tag: "Gaza",
    title: "Israel ataca l'hospital Nasser al sud de Gaza: almenys 6 morts i 30 ferits",
    desc: "Un atac israelià contra el complex hospitalari Nasser de Khan Yunis durant la matinada ha causat almenys sis víctimes mortals i una trentena de ferits, segons fonts sanitàries de la Franja.",
    url: "https://www.infobae.com/america/agencias/2026/11/12/temas-del-dia-de-efe-internacional-del-jueves-12-de-noviembre-de-2026-1200-gmt/",
  },
  {
    id: 10,
    date: "12·11",
    cat: "internacional",
    geo: "Internacional",
    tag: "COP31",
    title: "La COP31 a Turquia entra a la quarta jornada amb el finançament climàtic com a eix",
    desc: "La cimera del clima de l'ONU a Istanbul aborda la reducció d'emissions i el fons de compensació per als països més vulnerables. Més de 190 delegacions participen en les negociacions.",
    url: "https://es-us.noticias.yahoo.com/euronews-noticias-jueves-12-noviembre-170013884.html",
  },
  {
    id: 11,
    date: "12·11",
    cat: "internacional",
    geo: "Internacional",
    tag: "Papa Lleó XIV",
    title: "El Papa Lleó XIV arriba al Perú i és rebut per la presidenta Keiko Fujimori",
    desc: "El Pontífex es troba en visita oficial al país andí, on mantindrà reunions amb autoritats civils, la societat civil i el cos diplomàtic a Lima.",
    url: "https://www.infobae.com/america/agencias/2026/11/12/temas-del-dia-de-efe-internacional-del-jueves-12-de-noviembre-de-2026-1200-gmt/",
  },

  // ── ECONOMIA ──────────────────────────────────────────────────────
  {
    id: 12,
    date: "12·11",
    cat: "economia",
    geo: "Internacional",
    tag: "Tecnologia",
    title: "Jensen Huang dimiteix com a CEO de Nvidia enmig d'un escàndol; Colette Kress el substituirà",
    desc: "El fundador i director executiu d'Nvidia deixa el càrrec al bell mig de sospites d'espionatge xinès i d'una polèmica personal. La vicepresidenta executiva i directora financera assumirà la direcció de manera interina.",
    url: "https://es-us.noticias.yahoo.com/euronews-noticias-jueves-12-noviembre-170013884.html",
  },
  {
    id: 13,
    date: "12·11",
    cat: "economia",
    geo: "Espanya",
    tag: "Estadística",
    title: "L'INE publica l'Estadística Contínua de Població a 1 d'octubre de 2026",
    desc: "L'Institut Nacional d'Estadística actualitza les dades demogràfiques d'Espanya que serviran de referència per a la distribució de recursos autonòmics.",
    url: "https://www.infobae.com/espana/agencias/2026/11/11/hoy-sera-noticia-jueves-12-de-noviembre",
  },

  // ── CIÈNCIA ────────────────────────────────────────────────────────
  {
    id: 14,
    date: "10·26",
    cat: "ciencia",
    geo: "Internacional",
    tag: "Nobel Química 2026",
    title: `Henri Kagan i Kenso Soai guanyen el Nobel de Química per les "molècules espell"`,
    desc: "L'Acadèmia Sueca ha premiat els investigadors per descobrir la quiralitat asimètrica, un mecanisme pel qual molècules sense simetria es reprodueixen a si mateixes amb la mateixa orientació espacial.",
    url: "https://www.laestrella.com.pa/mundo/nobel-de-quimica-2026-henri-kagan-y-kenso-soai-ganan-por-el-hallazgo-de-las-moleculas-espejo-DO26288759",
  },
  {
    id: 15,
    date: "10·26",
    cat: "ciencia",
    geo: "Internacional",
    tag: "Nobel Física 2026",
    title: "Francis Halzen guanya el Nobel de Física per detectar neutrins còsmics des del gel antàrtic",
    desc: "El físic belga és guardonat per la seva contribució al detector de neutrins IceCube, encastat al gel de l'Antàrtida, que ha obert una nova finestra per observar l'univers.",
    url: "https://impactotic.co/ciencia/premios-nobel-2026-de-ciencia-ganadores/",
  },
  {
    id: 16,
    date: "01·26",
    cat: "ciencia",
    geo: "Internacional",
    tag: "Premi Fronteres",
    title: "MacDonald i Jarillo-Herrero premiats per la twistrònica, l'art de retorçar el grafè",
    desc: "El Premi Fronteres del Coneixement en Ciències Bàsiques recau en els dos físics que van descobrir propietats supraconductores en girar lleugerament capes de grafè, fundant la twistrònica.",
    url: "https://www.premiosfronterasdelconocimiento.es/wp-content/uploads/sites/2/2026/01/NdP_XVIII_Premio_Fronteras_Ciencias_Basicas.pdf",
  },

  // ── METEOROLOGIA ───────────────────────────────────────────────────
  {
    id: 17,
    date: "12·11",
    cat: "meteo",
    geo: "Catalunya",
    tag: "Temps",
    title: "Borrasques Bruna i Charles porten pluges intenses als Pirineus i al litoral català",
    desc: "L'AEMET preveu precipitacions abundants a Catalunya, Galícia, el Cantàbric i Canàries. La cota de neu baixa fins als 1.200 metres als Pirineus.",
    url: "https://www.infobae.com/espana/agencias/2026/11/12/temas-del-dia-de-efe-espana-del-jueves-12-de-noviembre-de-2026-1330-horas/",
  },
];
