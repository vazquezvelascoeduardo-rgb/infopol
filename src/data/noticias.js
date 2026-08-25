// Noticias diàries InfoPol — actualitzades cada nit a les 22h
// Les entrades segueixen el format: { date, cat, tag, area, title, desc, url }
// cat → clau de color (dels tokens: operativa, leyes, atajos, transito, psico, alcohol, physical)

export const NOTICIAS = [
  // ── 25 AGOST 2026 ─────────────────────────────────────────────────────────

  // POLÍTICA CATALANA
  {
    date: '08·25',
    cat: 'operativa',
    tag: 'Política',
    area: 'Catalunya',
    title: 'Puigdemont i la finançació singular encenen l\'estiu polític català',
    desc: 'La tornada del president a l\'activitat i la negociació del nou model de finançament, que depèn de Junts al Congrés, preocupen el Govern de Salvador Illa de cara a la tardor.',
    url: 'https://www.moncloa.com/2026/08/24/financiacion-singular-cataluna-otono-politico-3420051/',
  },
  {
    date: '08·24',
    cat: 'operativa',
    tag: 'Política',
    area: 'Catalunya',
    title: 'Salvador Illa afronta una tardor de vagues educatives i pressió en habitatge',
    desc: 'El Govern prepara mesures per a setembre davant la convocatòria de vagues en l\'educació pública i la demanda creixent d\'habitatge assequible a les àrees metropolitanes.',
    url: 'https://www.catalunyapress.es/articulo/politica-catalunya/2026-08-24/5991523-catalunya-calienta-motores-otono-politico-marcado-nuevos-frentes-alianzas',
  },

  // POLÍTICA ESPANYA
  {
    date: '08·25',
    cat: 'operativa',
    tag: 'Política',
    area: 'Espanya',
    title: 'Primer Consell de Ministres de la tardor: Sánchez marca l\'agenda per a setembre',
    desc: 'El govern central reprèn l\'activitat amb un ordre del dia centrat en habitatge, immigració i la reforma fiscal. El PP exigeix canvis en el sistema de finançament autonòmic.',
    url: 'https://www.eldiario.es/economia/espana-busca-batir-previsiones-crecimiento-2026-liderar-grandes-economias-tercer-ano_1_12879125.html',
  },

  // ECONOMIA
  {
    date: '08·25',
    cat: 'leyes',
    tag: 'Economia',
    area: 'Espanya',
    title: 'La Borsa espanyola supera per primera vegada els 20.000 punts',
    desc: 'Espanya lidera les economies avançades amb un creixement del 2,2% el 2026, per davant dels EUA (1,7%) i duplicant el ritme d\'Alemanya i França. El PIB català creix un 2,9% el 2025.',
    url: 'https://www.eldiario.es/economia/espana-busca-batir-previsiones-crecimiento-2026-liderar-grandes-economias-tercer-ano_1_12879125.html',
  },
  {
    date: '08·23',
    cat: 'leyes',
    tag: 'Economia',
    area: 'Catalunya',
    title: 'Taxa d\'atur catalana al 10,1% al Q2 2026, per sota de la mitjana estatal',
    desc: 'El mercat de treball a Catalunya es manté resistent. El turisme creix un 5,9% interanual fins a l\'abril, impulsant sectors com l\'hostaleria, el comerç i el transport.',
    url: 'https://www.caixabankresearch.com/en/publications/autonomous-community-profiles/catalonia',
  },

  // INTERNACIONAL
  {
    date: '08·25',
    cat: 'atajos',
    tag: 'Internacional',
    area: 'Mundial',
    title: 'NASA: dues astronautes realitzen una caminada espacial de 7 hores a l\'ISS',
    desc: 'Les astronautes han completat tasques de manteniment rutinari i preparatiu per a la futura desorbita del laboratori espacial. La caminada ha durat 6 hores i 53 minuts.',
    url: 'https://es-us.noticias.yahoo.com/noticias-25-agosto-2026-ma%C3%B1ana-050008862.html',
  },
  {
    date: '08·25',
    cat: 'atajos',
    tag: 'Internacional',
    area: 'Cuba',
    title: 'Amnistia Internacional lliura 27.000 cartes al dissident cubà Otero Alcántara',
    desc: 'L\'artista i pres polític Luis Manuel Otero Alcántara rep el suport global als cinc anys de la seva empresonament a Cuba. Segueix sent un símbol de la repressió cultural a l\'illa.',
    url: 'https://www.infobae.com/america/agencias/2026/08/25/temas-del-dia-de-efe-internacional-del-martes-25-de-agosto-de-2026-1400-horas/',
  },

  // ESPORTS
  {
    date: '08·25',
    cat: 'transito',
    tag: 'Esports',
    area: 'Catalunya',
    title: 'El FC Barcelona debuta a La Liga el 27 d\'agost contra l\'Athletic Club al Camp Nou',
    desc: 'Arrenca la temporada 2026-27. El Barça entra directament a la fase de grups de la Champions League per 23a temporada consecutiva. La pretemporada va tancar amb el Trofeu Joan Gamper.',
    url: 'https://www.si.com/es-us/futbol/pretemporada-2026-del-fc-barcelona-fechas-de-la-gira-partidos-entradas-y-como-ver-los-encuentros',
  },

  // CULTURA / CIÈNCIA
  {
    date: '08·25',
    cat: 'psico',
    tag: 'Ciència',
    area: 'Espanya',
    title: 'Premis Nacionals d\'Investigació 2026: reconeixement a la genètica forense i a la recerca d\'ARN',
    desc: 'El Ministeri de Ciència premia Ángel Carracedo i Carmen Álvarez (USC) i Laura Santos (UDC). Les 20 modalitats, dotades amb 30.000 € cadascuna, reconeixen l\'excel·lència científica espanyola.',
    url: 'https://www.infosalus.com/salud-investigacion/noticia-ciencia-concede-premios-nacionales-investigacion-2026-reconocen-excelencia-investigadores-20260730172439.html',
  },
  {
    date: '08·24',
    cat: 'psico',
    tag: 'Cultura',
    area: 'Internacional',
    title: 'Premis Gairdner 2026: els descobriments científics que podrien anticipar el proper Nobel',
    desc: 'Els Premis Gairdner, sovint precursors del Nobel de Medicina, reconeixen enguany treballs pioners en immunologia cel·lular i edició genòmica aplicada a malalties rares.',
    url: 'https://datociencia.com/premios-gairdner-2026-los-descubrimientos-cientificos-que-podrian-anticipar-el-proximo-nobel/',
  },

  // SUCCESSOS / POLICIALS
  {
    date: '08·25',
    cat: 'alcohol',
    tag: 'Successos',
    area: 'Catalunya',
    title: 'Mossos detenen 6 persones per robatoris violents de cadenes i polseres a Barcelona',
    desc: 'L\'Operació "Kanpai Càtena" contra els furts violents en barris de Barcelona ha acabat amb sis detinguts que acumulen un total de 208 antecedents policials. La majoria d\'actuacions es van produir als barris de Gràcia i Sants.',
    url: 'https://www.metropoliabierta.cat/successos/20260815/cop-lladres-cadenes-mossos-detenen-sis-delinquents-barcelona-antecedents/1003742787078_0.html',
  },
  {
    date: '08·19',
    cat: 'alcohol',
    tag: 'Successos',
    area: 'Catalunya',
    title: 'Els Mossos "cansats" de detenir el mateix lladre recidiu a la Costa Brava',
    desc: 'Un jove ha estat detingut set vegades al mes d\'agost a L\'Escala (Girona) per sostreure objectes de turistes a la platja. El sistema penal permet el seu alliberament repetit perquè les sostraccions no superen el llindar de gravetat.',
    url: 'https://www.cronicaglobal.cat/vida/20260819/lladre-agost-costa-brava-mossos-cansats-detenir-lo/1003742787849_0.html',
  },
];
