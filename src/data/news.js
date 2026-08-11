// Daily news — updated automatically each evening
// Last update: 11·08·2026

export const CATS_NOTICIA = {
  politica:      { label: 'Política',       color: 'operativa' },
  economia:      { label: 'Economia',       color: 'leyes' },
  internacional: { label: 'Internacional',  color: 'transito' },
  societat:      { label: 'Societat',       color: 'atajos' },
  successos:     { label: 'Successos',      color: 'noticias' },
  esports:       { label: 'Esports',        color: 'psico' },
};

export const NOTICIAS = [
  // ── POLÍTICA ──────────────────────────────────────────────────────
  {
    id: 'n2026-08-11-001',
    date: '11·08·2026',
    cat: 'politica',
    tag: 'Política · Espanya',
    title: 'Feijóo anuncia moció de censura a Sánchez en 48 hores',
    desc: 'El líder del PP amenaça amb presentar una moció de censura si Junts i el PNV mostren "un punt de dignitat" envers el Govern central.',
    url: 'https://www.elnacional.cat/es/politica/feijoo-promete-mocion-censura-sanchez-en-48-horas-si-junts-pnv-tienen-ramalazo-dignidad_1680358_102.html',
  },
  {
    id: 'n2026-08-11-002',
    date: '11·08·2026',
    cat: 'politica',
    tag: 'Política · Ceuta',
    title: 'Albares: "Retornarem fins a l\'última persona que intenti entrar a Ceuta"',
    desc: 'El ministre d\'Exteriors adverteix que tots els migrants que vulguin entrar a Ceuta seran retornats a Marroc, enmig de la crisi migratòria a la frontera.',
    url: 'https://www.elnacional.cat/es/politica/albares-avisa-migrantes-quieran-entrar-ceuta-regresaran-marruecos-hasta-ultima-persona_1680268_102.html',
  },

  // ── ECONOMIA ──────────────────────────────────────────────────────
  {
    id: 'n2026-08-11-003',
    date: '11·08·2026',
    cat: 'economia',
    tag: 'Economia · Mercats',
    title: 'L\'Ibex-35 marca nou rècord i tanca per sobre dels 20.200 punts',
    desc: 'El principal índex borsari espanyol assoleix màxims històrics gràcies al bon comportament del sector bancari i energètic.',
    url: 'https://www.elnacional.cat/oneconomia/es/mercados/indices-ibex-35-marca-nuevo-record-cierra-encima-20200-puntos_1680409_102.html',
  },
  {
    id: 'n2026-08-11-004',
    date: '11·08·2026',
    cat: 'economia',
    tag: 'Economia · Habitatge',
    title: 'L\'habitatge a Catalunya s\'encareix un 5% en el segon trimestre',
    desc: 'Els preus immobiliaris segueixen a l\'alça. Barcelona registra un dèficit de 8.800 habitatges nous per cobrir la demanda actual.',
    url: 'https://www.elnacional.cat/oneconomia/es/economia/vivienda-en-catalunya-se-encarece-5-en-segundo-trimestre_1680283_102.html',
  },

  // ── INTERNACIONAL ─────────────────────────────────────────────────
  {
    id: 'n2026-08-11-005',
    date: '11·08·2026',
    cat: 'internacional',
    tag: 'Internacional · Colòmbia',
    title: 'Terratrèmol a Colòmbia: 224 morts i hospitals desbordats',
    desc: 'Un sisme de gran magnitud colpeja el país. S\'ha decretat toc de queda a les zones afectades mentre s\'acceleren els treballs de rescat.',
    url: 'https://www.elnacional.cat/es/internacional/desastre-colombia-terremoto-muertos-hospitales-desbordados-toque-queda_1680028_102.html',
  },
  {
    id: 'n2026-08-11-006',
    date: '11·08·2026',
    cat: 'internacional',
    tag: 'Internacional · Ucraïna',
    title: 'Ucraïna destrueix el sistema S-400 que protegia la residència de Putin al mar Negre',
    desc: 'Les forces ucraïneses impacten les defenses antiaèries russes en una operació que apunta directament a la infraestructura de seguretat del Kremlin.',
    url: 'https://www.elnacional.cat/es/internacional/ucrania-deja-tocado-sistema-s-400-protegia-residencia-putin-mar-negro_1680163_102.html',
  },
  {
    id: 'n2026-08-11-007',
    date: '11·08·2026',
    cat: 'internacional',
    tag: 'Internacional · Síria',
    title: 'Síria condemna a mort Bashar al-Assad en el primer judici contra l\'exdictador',
    desc: 'Un tribunal sirià dicta la primera sentència de pena capital contra Assad pels crims comesos durant el seu règim.',
    url: 'https://www.elnacional.cat/es/internacional/siria-condena-muerte-dictador-bashar-al-assad-primer-juicio-contra-regimen_1680214_102.html',
  },

  // ── SOCIETAT ──────────────────────────────────────────────────────
  {
    id: 'n2026-08-11-008',
    date: '11·08·2026',
    cat: 'societat',
    tag: 'Societat · Catalunya',
    title: 'Eclipse solar: miradors plens i col·lapses de trànsit a tota Catalunya',
    desc: 'Barcelona es prepara per al fenomen astronòmic amb trànsit reforçat. Trànsit preveu l\'AP-7 col·lapsada i recomana vies alternatives.',
    url: 'https://www.elnacional.cat/es/barcelona/barcelona-se-prepara-tarde-miradores-llenos-trafico-reforzado-eclipse_1680295_102.html',
  },
  {
    id: 'n2026-08-11-009',
    date: '11·08·2026',
    cat: 'societat',
    tag: 'Societat · Cultura',
    title: 'Mor als 100 anys Jordi Vila-Abadal, psiquiatra i referent del catalanisme cívic',
    desc: 'L\'exmonjo de Montserrat i figura del catalanisme cívic tanca una vida centenària plena de compromís cultural i intel·lectual.',
    url: 'https://www.elnacional.cat/es/sociedad/muere-100-anos-jordi-vila-abadal-psiquiatra-exmonje-montserrat-referente-catalanismo-civico_1680445_102.html',
  },

  // ── SUCCESSOS ─────────────────────────────────────────────────────
  {
    id: 'n2026-08-11-010',
    date: '11·08·2026',
    cat: 'successos',
    tag: 'Successos · El Prat',
    title: 'Tiroteig al Prat de Llobregat: baralla familiar acaba amb dispars',
    desc: 'Un enfrontament entre famílies al Prat de Llobregat acaba amb un tiroteig. És el quart incident violent registrat a Catalunya en poques hores.',
    url: 'https://elcaso.elnacional.cat/es/noticias/pelea-familias-prat-llobregat-tiroteo-cuatro-catalunya-horas_1680034102.html',
  },
  {
    id: 'n2026-08-11-011',
    date: '11·08·2026',
    cat: 'successos',
    tag: 'Successos · Operatiu',
    title: 'Cop al top manta a Torredembarra: 45.000€ en mercaderia falsificada',
    desc: 'Un operatiu policial a Torredembarra intervé mercaderia falsificada valorada en 45.000 euros en tan sols quatre dies de vigilància.',
    url: 'https://elcaso.elnacional.cat/es/noticias/golpe-top-manta-torredembarra_1680403102.html',
  },
  {
    id: 'n2026-08-11-012',
    date: '11·08·2026',
    cat: 'successos',
    tag: 'Successos · Rescat',
    title: 'Troben mort el parapentista desaparegut a Àger després de quatre dies de cerca',
    desc: 'L\'operatiu de rescat a Àger conclou amb la localització del cos del parapentista. La recerca havia mobilitzat múltiples cossos d\'emergències.',
    url: 'https://elcaso.elnacional.cat/es/noticias/hallan-muerto-parapentista-desaparecido-ager_1680379102.html',
  },

  // ── ESPORTS ───────────────────────────────────────────────────────
  {
    id: 'n2026-08-11-013',
    date: '11·08·2026',
    cat: 'esports',
    tag: 'Esports · Mundial 2026',
    title: 'Espanya, campiona del món! Ferrán Torres decideix la final davant l\'Argentina (1-0)',
    desc: 'Gol de Ferrán Torres al minut 106 de la pròrroga. Espanya s\'emporta el seu quart Mundial davant una Argentina de Messi que no va poder repetir el triomf del 2022.',
    url: 'https://cnnespanol.cnn.com/2026/07/19/deportes/live-news/espana-argentina-final-mundial-2026-en-vivo-resultado-goles-orix',
  },
  {
    id: 'n2026-08-11-014',
    date: '11·08·2026',
    cat: 'esports',
    tag: 'Esports · Barça',
    title: 'Rodri posa data al seu fitxatge pel Barça: negociacions en l\'etapa final',
    desc: 'El centrecampista i MVP del Mundial ha demanat als seus agents que accelerin les negociacions. El Barça confia a tancar l\'operació en dies.',
    url: 'https://www.elnacional.cat/es/deportes/rodri-pide-sus-agentes-aceleren-negociaciones-pone-fecha-fichaje-por-barca-inminente_1680187_102.html',
  },
];
