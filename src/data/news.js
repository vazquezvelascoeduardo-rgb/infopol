// Noticias InfoPol — actualitzades diàriament
// Categories: politica, economia, policial, esports, cultura, internacional

export const NEWS_CATEGORIES = [
  { id: 'tots',          label: 'Tots',          icon: 'newspaper' },
  { id: 'politica',      label: 'Política',       icon: 'scale' },
  { id: 'economia',      label: 'Economia',       icon: 'chart' },
  { id: 'policial',      label: 'Policial',       icon: 'shield' },
  { id: 'esports',       label: 'Esports',        icon: 'trophy' },
  { id: 'cultura',       label: 'Cultura',        icon: 'book' },
  { id: 'internacional', label: 'Internacional',  icon: 'globe' },
];

export const NEWS = [
  // ─── POLÍTICA ────────────────────────────────────────────────
  {
    id: 'NOT-20260929-001',
    date: '2026-09-29',
    category: 'politica',
    source: 'Infobae',
    title: 'La justícia aplica l\'amnistia a Marta Rovira i Illa espera Puigdemont al Parlament',
    summary: 'El Tribunal Provincial de Barcelona ha acordat aplicar la llei d\'amnistia a la líder d\'ERC Marta Rovira en la causa oberta pel referèndum il·legal de l\'1 d\'octubre de 2017. El president Salvador Illa ha demanat que la llei s\'executi sense més demores i ha expressat el desig que Carles Puigdemont participi en la propera sessió del Parlament.',
    url: 'https://www.infobae.com/espana/2026/09/29/la-justicia-amnistia-a-la-independentista-marta-rovira-e-illa-espera-que-puigdemont-este-en-el-proximo-debate-del-parlament/',
  },
  {
    id: 'NOT-20260929-002',
    date: '2026-09-29',
    category: 'politica',
    source: 'El Español',
    title: 'Debat de política general al Parlament: Illa defensa la seva gestió davant els grups',
    summary: 'Comença la primera jornada del debat de política general al Parlament de Catalunya amb la intervenció del president de la Generalitat, Salvador Illa. Els principals grups de l\'oposició qüestionen la política d\'habitatge i la gestió pressupostària del govern.',
    url: 'https://www.elespanol.com/espana/politica/20260929/ultima-hora-politica-directo-cuerpo-insiste-presupuestos-pese-plazo-constitucional-vence-manana/1003744401676_10.html',
  },
  {
    id: 'NOT-20260929-003',
    date: '2026-09-29',
    category: 'politica',
    source: 'The Objective',
    title: 'El govern aprova dos decrets d\'habitatge: prohibició de desnonaments fins al 2030 i renovació automàtica de lloguers',
    summary: 'El Consell de Ministres ha aprovat dos decrets d\'habitatge. El primer inclou la prohibició de desnonaments fins al 2030, regulació dels lloguers temporals i d\'habitacions, i augment de l\'IVA en pisos turístics. El segon estableix la renovació automàtica dels contractes de lloguer de dos anys.',
    url: 'https://theobjective.com/espana/2026-09-29/sumario-tarde-pulso-gobierno-decreto-vivienda-carta-carvajal/',
  },

  // ─── ECONOMIA ────────────────────────────────────────────────
  {
    id: 'NOT-20260929-004',
    date: '2026-09-29',
    category: 'economia',
    source: 'El Independiente',
    title: 'La inflació es dispara al 4,9% al setembre, el màxim en tres anys',
    summary: 'L\'IPC de setembre ha pujat al 4,9% interanual, sis dècimes per sobre de l\'agost i el nivell més alt des del febrer del 2023. La principal causa és l\'encariment dels carburants i lubrificants (+21,6% en productes energètics). La taxa subjacent se situa al 3,1%, dos dècimes per sobre del mes anterior.',
    url: 'https://www.elindependiente.com/economia/2026/09/29/inflacion-4-septiembre-dato-alto-2002/',
  },
  {
    id: 'NOT-20260929-005',
    date: '2026-09-29',
    category: 'economia',
    source: 'Infobae',
    title: 'L\'IBEX 35 cau un 0,42% arran del repunt de la inflació',
    summary: 'La Borsa espanyola ha tancat amb una caiguda del 0,42%, cedint 82,8 punts fins als 19.517,5 enteros, arran de la publicació de les dades del CPI que han superat les previsions del mercat. Els analistes adverteixen que el BCE podria reconsiderar les rebaixes de tipus si la tendència continua.',
    url: 'https://www.infobae.com/espana/agencias/2026/09/29/el-ibex-cae-un-042-tras-repuntar-la-inflacion-y-pese-a-la-ligera-bajada-del-crudo/',
  },

  // ─── POLICIAL / JUDICIAL ─────────────────────────────────────
  {
    id: 'NOT-20260929-006',
    date: '2026-09-29',
    category: 'policial',
    source: 'Moncloa',
    title: 'Els Mossos investiguen un segrest exprés a Calella, el tercer a Catalunya en menys d\'un mes',
    summary: 'Els Mossos d\'Esquadra investiguen diverses persones per sostreure presumptament per la força un home que era dins del seu vehicle a Calella el 28 de setembre. És el tercer segrest exprés en menys d\'un mes a Catalunya: l\'anterior va tenir lloc al districte de Sant Martí de Barcelona i un altre a la AP-7 a l\'altura de Montornès del Vallès.',
    url: 'https://www.moncloa.com/2026/09/22/secuestro-expres-catalunya-sant-marti-3435958/',
  },
  {
    id: 'NOT-20260929-007',
    date: '2026-09-29',
    category: 'policial',
    source: 'Catalunya Press',
    title: 'Els delictes baixen un 8,4% a Catalunya fins a l\'agost, amb 361.074 casos registrats',
    summary: 'Catalunya ha registrat 361.074 delictes entre el gener i l\'agost del 2026, un descens del 8,4% respecte al mateix període de l\'any anterior. A més, els judicis immediats per delictes lleus a Barcelona es resolen ara en tan sols 10 dies d\'espera, enfront dels 8,8 mesos que es registraven a finals del 2024.',
    url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-09-19/6016129-delitos-caen-84-catalunya-hasta-agosto-361074-casos-registrados',
  },
  {
    id: 'NOT-20260929-008',
    date: '2026-09-29',
    category: 'policial',
    source: 'Moncloa',
    title: 'Interior i Barcelona signen el conveni Mossos-Guàrdia Urbana per coordinar la seguretat a la ciutat',
    summary: 'El Departament d\'Interior de la Generalitat i l\'Ajuntament de Barcelona han signat el conveni de coordinació entre els Mossos d\'Esquadra i la Guàrdia Urbana per reforçar la seguretat ciutadana a la capital catalana, evitar duplicitats i millorar la resposta operativa conjunta.',
    url: 'https://www.moncloa.com/2026/09/17/convenio-mossos-guardia-urbana-barcelona-3433162',
  },

  // ─── ESPORTS ─────────────────────────────────────────────────
  {
    id: 'NOT-20260929-009',
    date: '2026-09-29',
    category: 'esports',
    source: 'Eurosport',
    title: 'Espanya - Croàcia a la Lliga de Nacions: avui a les 20:45h al Sánchez-Pizjuán',
    summary: 'La selecció espanyola rep Croàcia al Ramón Sánchez-Pizjuán de Sevilla en la segona jornada de la fase de grups de la Lliga de les Nacions de la UEFA. Ambdós equips van guanyar en el seu debut. El partit es podrà veure en obert per La 1 de TVE i RTVE Play.',
    url: 'https://www.eurosport.es/futbol/uefa-nations-league/2026-2027/espana-croacia-seleccion-cuando-es-fecha-horario-y-donde-ver-por-tv-y-online-streaming-martes-29-septiembre_sto23340973/story.shtml',
  },
  {
    id: 'NOT-20260929-010',
    date: '2026-09-29',
    category: 'esports',
    source: 'Yahoo Sports',
    title: 'El Barça lidera La Lliga amb set victòries en set partits, millor inici de la història del club',
    summary: 'El FC Barcelona ha superat el millor inici de la història del club amb set victòries en els set primers partits de La Lliga, consolidant-se al capdavant de la classificació. L\'equip de Flick afronta la pròxima setmana els vuitens de final de la Champions League.',
    url: 'https://sports.yahoo.com/articles/fc-barcelona-news-29-september-090000585.html',
  },

  // ─── CULTURA / PREMIS ─────────────────────────────────────────
  {
    id: 'NOT-20260929-011',
    date: '2026-09-29',
    category: 'cultura',
    source: 'RSEQ',
    title: 'Premis Nacionals d\'Investigació 2026: Daniel Maspoch i tres científics més, guardonats',
    summary: 'El govern espanyol ha atorgat els Premis Nacionals d\'Investigació 2026. Entre els guanyadors figuren Daniel Maspoch (química de materials), Jesús Martínez de la Fuente (nanomedicina), Katherine Villa i Miguel Anaya. Els premis reconeixen les aportacions científiques de major impacte realitzades a Espanya.',
    url: 'https://rseq.org/premios-nacionales-de-investigacion-2026/',
  },
  {
    id: 'NOT-20260929-012',
    date: '2026-09-29',
    category: 'cultura',
    source: 'Hipermedula',
    title: 'La Fundació SGAE convoca els Premis d\'Investigació en Cultura 2026',
    summary: 'La Fundació SGAE ha obert la convocatòria dels seus Premis d\'Investigació en Cultura 2026, destinats a reconèixer treballs acadèmics i assajos sobre el sector cultural espanyol. La dotació econòmica i les bases es poden consultar al web de la fundació fins a finals d\'octubre.',
    url: 'https://hipermedula.org/2026/09/premios-fundacion-sgae-de-investigacion-en-cultura-2026/',
  },

  // ─── INTERNACIONAL ────────────────────────────────────────────
  {
    id: 'NOT-20260929-013',
    date: '2026-09-29',
    category: 'internacional',
    source: 'Unitel / EFE',
    title: 'L\'huracà Polo amenaça la Baixa Califòrnia Sur amb més de 3.000 militars desplegats',
    summary: 'L\'huracà Polo s\'aproxima a la Baixa Califòrnia Sur (Mèxic) provocant forts vents i onades intenses a la costa. Les autoritats mexicanes han desplegat més de 3.000 militars i efectius de protecció civil per donar resposta a l\'emergència i evacuar les zones de major risc.',
    url: 'https://unitel.bo/noticias/agencias/temas-del-dia-de-efe-internacional-del-martes-29-de-septiembre-de-2026-1200-gmt-KO23788828',
  },
  {
    id: 'NOT-20260929-014',
    date: '2026-09-29',
    category: 'internacional',
    source: 'EFE Internacional',
    title: 'Macron inicia una visita d\'estat de dos dies a Espanya',
    summary: 'El president de França, Emmanuel Macron, ha iniciat una visita d\'estat de dos dies a Espanya per reforçar les relacions bilaterals i abordar qüestions d\'agenda europea, com la política migratòria, la defensa i la transició energètica. La visita inclou una reunió amb el president Pedro Sánchez al Palau de La Moncloa.',
    url: 'https://www.infobae.com/america/agencias/2026/09/29/temas-del-dia-de-efe-internacional-del-martes-29-de-septiembre-de-2026-1200-gmt/',
  },
  {
    id: 'NOT-20260929-015',
    date: '2026-09-29',
    category: 'internacional',
    source: 'Unitel / EFE',
    title: 'Toronto acull la conferència "Pathways to Peace" per al retorn de nens ucraïnesos deportats',
    summary: 'Canadà, Ucraïna i Noruega coprresideixen a Toronto la segona conferència internacional "Pathways to Peace" centrada en el retorn de nens ucraïnesos deportats a Rússia, detinguts civils i presoners de guerra. La cimera reuneix representants de més de 40 països i conclou avui 29 de setembre.',
    url: 'https://unitel.bo/noticias/agencias/temas-del-dia-de-efe-internacional-del-martes-29-de-septiembre-de-2026-1200-gmt-KO23788828',
  },
];
