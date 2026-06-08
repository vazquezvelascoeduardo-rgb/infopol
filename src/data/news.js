// Noticias d'actualitat general — actualitzades cada dia a les 22 h
// Afegir al davant (noves al principi). Màxim 90 dies d'historial.
//
// Camps:
//   id        → 'news-YYYYMMDD-NNN'
//   date      → 'YYYY-MM-DD'
//   dateLabel → 'MM·DD'
//   cat       → 'politica' | 'economia' | 'cultura' | 'esports' | 'policia' | 'descobriment' | 'societat'
//   scope     → 'Catalunya' | 'Espanya' | 'Internacional'
//   tag       → 'Àmbit · Categoria'
//   title     → títol en català
//   desc      → resum breu (1–2 frases) en català
//   url       → URL de la notícia original

export const NOTICIAS = [

  // ── 2026-06-08 ──────────────────────────────────────────────────

  {
    id: 'news-20260608-001',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'policia',
    scope: 'Internacional',
    tag: 'Internacional · Conflicte',
    title: 'Iran i Israel reprenen els atacs amb míssils',
    desc: 'Els dos estats reinicien l\'escalada bèl·lica; els EUA continuen la mediació per al cessament de les hostilitats i el retorn dels ostatges.',
    url: 'https://www.telemundo.com/noticias/noticias-telemundo/internacional/video/esto-es-noticia-en-el-mundo-este-lunes-8-de-junio-de-2026-tmvo13191895',
  },
  {
    id: 'news-20260608-002',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'societat',
    scope: 'Internacional',
    tag: 'Internacional · Catàstrofe',
    title: 'Un sisme a les Filipines deixa almenys 32 morts',
    desc: 'Un terratrèmol de magnitud significativa sacsa les illes Filipines provocant víctimes mortals i esllavissades en diverses regions.',
    url: 'https://www.telemundo.com/noticias/noticias-telemundo/internacional/video/esto-es-noticia-en-el-mundo-este-lunes-8-de-junio-de-2026-tmvo13191895',
  },
  {
    id: 'news-20260608-003',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'politica',
    scope: 'Internacional',
    tag: 'Internacional · Política',
    title: 'Roberto Sánchez aventatja Keiko Fujimori a la segona volta del Perú',
    desc: 'El candidat d\'esquerres s\'imposa en els primers recomptes de la segona volta presidencial peruana, mentre Fujimori al·lega irregularitats.',
    url: 'https://www.telemundo.com/noticias/noticias-telemundo/internacional/video/esto-es-noticia-en-el-mundo-este-lunes-8-de-junio-de-2026-tmvo13191895',
  },
  {
    id: 'news-20260608-004',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'politica',
    scope: 'Internacional',
    tag: 'Internacional · Defensa',
    title: 'Alemanya i França trenquen l\'aliança per al caça de combat europeu FCAS',
    desc: 'La ruptura del projecte valorat en 100.000 M€ obliga la UE a replantejar la seva estratègia de defensa aeronàutica conjunta.',
    url: 'https://www.infobae.com/espana/',
  },
  {
    id: 'news-20260608-005',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'politica',
    scope: 'Internacional',
    tag: 'Internacional · Política',
    title: 'Trump abandona una entrevista de la NBC en ser preguntat sobre el seu historial',
    desc: 'El president dels EUA abandona en directe un programa de televisió nacional quan la periodista li qüestiona decisions polèmiques del seu mandat.',
    url: 'https://www.infobae.com/espana/',
  },
  {
    id: 'news-20260608-006',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'esports',
    scope: 'Espanya',
    tag: 'Espanya · Esports',
    title: 'La Selecció espanyola s\'enfronta a Aràbia Saudita en amistós pre-Mundial',
    desc: 'Luis de la Fuente fa servir el partit per ajustar la plantilla; Lamine Yamal és dubte per molèsties al turmell a pocs dies de l\'inici del Mundial 2026.',
    url: 'https://cnnespanol.cnn.com/2026/06/02/deportes/calendario-seleccion-espana-mundial-2026-orix',
  },
  {
    id: 'news-20260608-007',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'economia',
    scope: 'Espanya',
    tag: 'Espanya · Economia',
    title: 'L\'OCDE eleva la previsió del PIB espanyol al 2,2% per a 2026',
    desc: 'L\'organisme millora en una dècima el seu pronòstic per a Espanya i alerta d\'una inflació que pot arribar al 3,3%, situant el país com la gran economia europea amb millor evolució.',
    url: 'https://www.merca2.es/2026/06/03/previsiones-ocde-espana-2026-2388975/',
  },
  {
    id: 'news-20260608-008',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'policia',
    scope: 'Espanya',
    tag: 'Espanya · Criminalitat',
    title: 'Els homicidis i assassinats a Espanya pugen un 10,6% al primer trimestre de 2026',
    desc: 'El balanç de criminalitat del Ministeri de l\'Interior registra 595.240 infraccions penals entre gener i març, amb un fort repunt de la violència letal.',
    url: 'https://www.deia.eus/actualidad/sociedad/2026/06/04/homicidios-asesinatos-suben-10-6-espana-11157409.html',
  },
  {
    id: 'news-20260608-009',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'policia',
    scope: 'Catalunya',
    tag: 'Catalunya · Seguretat',
    title: 'Els Mossos i la Guàrdia Urbana desmantellen cinc xarxes de furts amb 136 investigats',
    desc: 'L\'operatiu del primer trimestre del 2026 permet una caiguda del 6% en el total de la criminalitat a Catalunya, contrarrestant la tendència estatal a l\'alça.',
    url: 'https://mossos.gencat.cat/en/comunicacio/noticies/index.html',
  },
  {
    id: 'news-20260608-010',
    date: '2026-06-08',
    dateLabel: '06·08',
    cat: 'descobriment',
    scope: 'Internacional',
    tag: 'Internacional · Ciència',
    title: 'La NASA detecta una «corona còsmica» al cúmul estel·lar NGC 602',
    desc: 'Les imatges del telescopi espacial revelen el cicle de vida estelar en una de les galàxies veïnes de la Via Làctia, la Petita Núvol de Magalhanes.',
    url: 'https://ciencia.nasa.gov/multimedia/calendario-de-ciencia-de-la-nasa-2026/',
  },

];
