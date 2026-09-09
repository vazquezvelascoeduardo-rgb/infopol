// Notícies del dia — actualitzat automàticament cada dia a les 22:00
// Data: 09/09/2026

export const CATEGORIES = {
  politica:      { label: 'Política',       icon: 'scale',     cat: 'operativa' },
  economia:      { label: 'Economia',        icon: 'briefcase', cat: 'psico'     },
  esports:       { label: 'Esports',         icon: 'trophy',    cat: 'atajos'    },
  successos:     { label: 'Successos',       icon: 'siren',     cat: 'alcohol'   },
  ciencia:       { label: 'Ciència',         icon: 'spark',     cat: 'physical'  },
  internacional: { label: 'Internacional',   icon: 'bolt',      cat: 'leyes'     },
};

export const AMBITS = ['Tots', 'Catalunya', 'Espanya', 'Internacional'];

export const NOTICIAS = [
  // ── SUCCESSOS / POLICIALS ─────────────────────────────────────────
  {
    id: 'n001',
    categoria: 'successos',
    ambit: 'Catalunya',
    titol: 'Trapero dimite com a director dels Mossos; Sílvia Catà, primera comissaria en cap',
    resum: 'Josep Lluís Trapero ha presentat la dimissió al capdavant de la policia catalana. El comissari Ferran López assumeix el lideratge i Sílvia Catà es convertirà en la primera dona comissaria en cap de la corporació.',
    font: 'Infobae',
    url: 'https://www.infobae.com/espana/agencias/2026/09/09/trapero-dimite-como-director-de-los-mossos-y-le-sustituye-el-comisario-ferran-lopez/',
    data: '09/09/2026',
  },
  {
    id: 'n002',
    categoria: 'successos',
    ambit: 'Catalunya',
    titol: 'Crim de Manresa: llibertat vigilada per als dos darrers menors detinguts',
    resum: "El jutge ordena llibertat vigilada amb tractament terapèutic als dos menors de 15 i 16 anys detinguts per la mort de Carles V., de 45 anys, apunyalat al carrer la matinada de l'1 de setembre a Manresa. La investigació segueix oberta.",
    font: 'Infobae',
    url: 'https://www.infobae.com/espana/agencias/2026/09/09/ordenan-libertad-vigilada-a-los-dos-ultimos-menores-detenidos-por-el-crimen-de-manresa/',
    data: '09/09/2026',
  },

  // ── POLÍTICA ──────────────────────────────────────────────────────
  {
    id: 'n003',
    categoria: 'politica',
    ambit: 'Catalunya',
    titol: 'Alerta per tempestes intenses: suspensió de classes i teletreball recomanat',
    resum: 'Protecció Civil activa l\'alerta màxima per pluges torrencials a Catalunya, Balears, Múrcia i la Comunitat Valenciana. Diverses poblacions suspenen classes i les autoritats recomanen el teletreball.',
    font: 'Periodista Digital',
    url: 'https://www.periodistadigital.com/periodismo/20260909/10-asuntos-mueven-politica-periodismo-espana-miercoles-9-septiembre-2026-noticia-689405245200/',
    data: '09/09/2026',
  },
  {
    id: 'n004',
    categoria: 'politica',
    ambit: 'Espanya',
    titol: "El CNI va alertar del risc d'entrada irregular a Ceuta hores abans de l'incident",
    resum: "Els serveis d'intel·ligència espanyols van enviar un informe al Govern alertant del risc d'entrada massiva de migrants per Ceuta, un episodi que ara centra el debat parlamentari sobre la coordinació de les forces de seguretat.",
    font: 'Euronews',
    url: 'https://es.euronews.com/2026/09/09/euronews-hoy-las-noticias-del-miercoles-9-de-septiembre-de-2026-el-cni-alerto-de-la-entrad',
    data: '09/09/2026',
  },
  {
    id: 'n005',
    categoria: 'politica',
    ambit: 'Espanya',
    titol: "Espanya s'uneix a la coalició que deixa d'importar béns de les colònies israelianes",
    resum: "Juntament amb el Regne Unit, el Canadà i les nacions escandinaves, Espanya anuncia que deixarà d'importar productes procedents de les colònies israelianes en territori palestí, considerades il·legals sota el dret internacional.",
    font: 'Infobae / EFE Internacional',
    url: 'https://www.infobae.com/america/agencias/2026/09/09/temas-del-dia-de-efe-internacional-del-miercoles-9-de-septiembre-de-2026-1200-gmt/',
    data: '09/09/2026',
  },

  // ── ECONOMIA ──────────────────────────────────────────────────────
  {
    id: 'n006',
    categoria: 'economia',
    ambit: 'Espanya',
    titol: 'Espanya cau al lloc 14 del rànquing del FMI, superada per Mèxic i Austràlia',
    resum: "Tot i assolir un PIB rècord de 2,09 bilions de dòlars el 2026, Espanya retrocedeix dues posicions al rànquing mundial. L'acceleració d'economies emergents explica el canvi, sense que impliqui una davallada de l'economia espanyola.",
    font: 'elEconomista',
    url: 'https://www.eleconomista.es/economia/',
    data: '09/09/2026',
  },
  {
    id: 'n007',
    categoria: 'economia',
    ambit: 'Espanya',
    titol: 'La rendibilitat bruta del lloguer a Espanya puja al 8% al juliol',
    resum: 'La forta demanda i l\'escassetat d\'oferta porten la rendibilitat del lloguer al nivell més alt dels últims anys. El mercat de l\'habitatge segueix tensionat, especialment a les grans capitals i zones turístiques.',
    font: 'elEconomista',
    url: 'https://www.eleconomista.es/economia/',
    data: '09/09/2026',
  },
  {
    id: 'n008',
    categoria: 'economia',
    ambit: 'Internacional',
    titol: 'La CE proposa una llei per donar més poder a les ciutats per regular pisos turístics',
    resum: "La Comissió Europea presenta una proposta legislativa per blindar el dret de les ciutats a limitar els habitatges d'ús turístic (HUT) a les zones tensionades, en resposta a la pressió sobre el mercat de l'habitatge a tota la UE.",
    font: 'elEconomista',
    url: 'https://www.eleconomista.es/economia/',
    data: '09/09/2026',
  },

  // ── ESPORTS ───────────────────────────────────────────────────────
  {
    id: 'n009',
    categoria: 'esports',
    ambit: 'Espanya',
    titol: 'La Vuelta a Espanya 2026: 18a etapa, contrarellotge entre El Puerto de Santa María i Jerez',
    resum: "El pelotó afronta una etapa decisiva de 32,1 km en contrarellotge individual entre El Puerto de Santa María i Jerez de la Frontera. L'etapa pot canviar la classificació general a pocs dies per a Madrid.",
    font: 'ESPN Deportes',
    url: 'https://espndeportes.espn.com/futbol/equipo/calendario/_/id/164/spain',
    data: '09/09/2026',
  },
  {
    id: 'n010',
    categoria: 'esports',
    ambit: 'Catalunya',
    titol: 'El Barça debuta a la Champions League rebent el Feyenoord al Camp Nou',
    resum: "El FC Barcelona inicia la fase de lliga de la Champions League amb el Feyenoord neerlandès com a primer rival. L\'Atlético de Madrid, per la seva banda, viatja al terreny del Liverpool en la jornada inaugural europea.",
    font: 'ElNacional.cat',
    url: 'https://www.elnacional.cat/es/deportes.html',
    data: '09/09/2026',
  },
  {
    id: 'n011',
    categoria: 'esports',
    ambit: 'Catalunya',
    titol: 'La 47a Lliga Catalana de bàsquet arrenca a Tarragona',
    resum: "La Lliga Catalana de bàsquet celebra la seva 47a edició al Palau d'Esports Catalunya de Tarragona del 9 al 13 de setembre, amb els principals equips catalans lluitant pel títol inaugural de la temporada.",
    font: 'ElNacional.cat',
    url: 'https://www.elnacional.cat/es/deportes.html',
    data: '09/09/2026',
  },

  // ── INTERNACIONAL ─────────────────────────────────────────────────
  {
    id: 'n012',
    categoria: 'internacional',
    ambit: 'Internacional',
    titol: 'EUA destrueix cinc vaixells petroliers iranians al Mar Roig en represàlia per atac de míssils',
    resum: 'Després que l\'Iran llancés míssils contra una base nord-americana a Jordània, les forces dels EUA van destruir cinc petroliers iranians. El conflicte eleva la tensió al Pròxim Orient i impacta els preus del petroli.',
    font: 'Euronews',
    url: 'https://es.euronews.com/2026/09/09/euronews-hoy-las-noticias-del-miercoles-9-de-septiembre-de-2026-el-cni-alerto-de-la-entrad',
    data: '09/09/2026',
  },
  {
    id: 'n013',
    categoria: 'internacional',
    ambit: 'Internacional',
    titol: "Netanyahu demanda el diari 'Haaretz' per revelar l'avís previ dels atemptats del 7-O",
    resum: "El primer ministre israelià inicia accions legals contra el diari Haaretz després que publiqués que el Govern havia rebut avisos d'intel·ligència sobre l'atac de Hamas del 7 d'octubre. La demanda ha generat un ampli debat sobre la llibertat de premsa.",
    font: 'Euronews / EFE',
    url: 'https://es.euronews.com/2026/09/09/euronews-hoy-las-noticias-del-miercoles-9-de-septiembre-de-2026-el-cni-alerto-de-la-entrad',
    data: '09/09/2026',
  },
  {
    id: 'n014',
    categoria: 'internacional',
    ambit: 'Internacional',
    titol: 'Nou atac rus amb drons sobre Kíiv: sis ferits a la capital ucraïnesa',
    resum: 'Les forces russes han atacat novament Kíiv amb drons en una onada nocturna. Les defenses antiaèries ucraïneses han interceptat la majoria de projectils però l\'impacte ha causat sis ferits i danys a edificis residencials.',
    font: 'Euronews',
    url: 'https://es.euronews.com/2026/09/09/euronews-hoy-las-noticias-del-miercoles-9-de-septiembre-de-2026-el-cni-alerto-de-la-entrad',
    data: '09/09/2026',
  },

  // ── CIÈNCIA / PREMIS ──────────────────────────────────────────────
  {
    id: 'n015',
    categoria: 'ciencia',
    ambit: 'Internacional',
    titol: "Premi Kavli d'Astrofísica 2026: Amina Helmi identifica la darrera gran fusió galàctica de la Via Làctia",
    resum: "L'astrofísica argentina Amina Helmi, formada a la Universitat Nacional de La Plata, rep a Oslo el Premi Kavli 2026 per haver identificat, usant dades del satèl·lit Gaia, la darrera gran col·lisió galáctica que va modelar la nostra galàxia fa milers de milions d'anys.",
    font: 'El Cronista',
    url: 'https://www.cronista.com/informacion-gral/orgullo-argentino-una-cientifica-que-estudio-en-la-plata-recibio-el-nobel-de-astrofisica-2026-por-un-descubrimiento-sobre-la-via-lactea/',
    data: '09/09/2026',
  },
  {
    id: 'n016',
    categoria: 'ciencia',
    ambit: 'Internacional',
    titol: "Nobel 2026: els primers anuncis arriben el 5 d'octubre, des de Medicina fins a Economia",
    resum: 'La setmana del Nobel 2026 s\'obre el 5 d\'octubre amb Medicina, seguida de Física i Química, i tanca amb Economia el 12 d\'octubre. Els Premis Gairdner d\'enguany s\'assenyalen com a possibles anticipadors dels guardonats.',
    font: 'Mundiario / DATOCIENCIA',
    url: 'https://www.mundiario.com/articulo/sociedad/nobel-2026-octubre-semana-descubrimientos/20260909114806440112.html',
    data: '09/09/2026',
  },
];
