// Test específic Mataró — 80 preguntes nivell alt.
// Cultura, política, personatges modernistes, festes (Les Santes) i Policia Local.
// Per a oposicions de la Policia Local de Mataró.
import type { TestTopic } from './types';

const mataro: TestTopic = {
  slug: 'mataro',
  title: 'Mataró',
  description: 'cultura, política, modernisme, Les Santes i Policia Local',
  icon: '🏖️',
  accent: 'from-cyan-500 to-blue-600',
  category: 'municipi',
  municipi: 'Mataró',
  questions: [
    // ── BLOC 1 — Geografia, comarca i història ───────────────────
    {
      id: 'mataro-1',
      text: 'De quina comarca és capital la ciutat de Mataró?',
      options: ['Del Maresme.', 'Del Vallès Oriental.', 'Del Barcelonès.', 'Del Garraf.'],
      correct: 0,
    },
    {
      id: 'mataro-2',
      text: 'Aproximadament, quants habitants té la ciutat de Mataró segons l\'INE 2025?',
      options: [
        'Uns 95.000 habitants.',
        'Uns 131.000 habitants.',
        'Uns 165.000 habitants.',
        'Uns 180.000 habitants.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-3',
      text: 'Quina extensió aproximada té el terme municipal de Mataró?',
      options: ['Uns 12 km².', 'Uns 18 km².', 'Uns 35 km².', 'Uns 22-23 km².'],
      correct: 3,
    },
    {
      id: 'mataro-4',
      text: 'A quina distància aproximada de Barcelona es troba Mataró?',
      options: ['A 15 km.', 'A 22 km.', 'A 45 km.', 'A 30 km.'],
      correct: 3,
    },
    {
      id: 'mataro-5',
      text: 'Com es deia Mataró durant l\'època romana?',
      options: ['Iluro.', 'Baetulo.', 'Tarraco.', 'Egara.'],
      correct: 0,
    },
    {
      id: 'mataro-6',
      text: 'En quin any va obtenir Mataró el títol de ciutat?',
      options: ["L'any 1599.", "L'any 1702.", "L'any 1812.", "L'any 1840."],
      correct: 1,
    },
    {
      id: 'mataro-7',
      text: 'En quin any es va trencar el règim feudal a Mataró i va passar a ser ciutat de jurisdicció reial?',
      options: ["L'any 1424.", "L'any 1492.", "L'any 1568.", "L'any 1640."],
      correct: 0,
    },
    {
      id: 'mataro-8',
      text: 'Quina activitat industrial va destacar especialment a Mataró durant la revolució industrial del segle XIX?',
      options: [
        'La indústria paperera.',
        'La metal·lúrgia pesant.',
        'La manufactura tèxtil del gènere de punt.',
        'La producció de ceràmica.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-9',
      text: 'Mataró concentra aproximadament quin percentatge de la població del Maresme?',
      options: [
        'Al voltant del 15%.',
        'Al voltant del 50%.',
        'Al voltant del 40%.',
        'Al voltant del 27%.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-10',
      text: 'Quin parc natural està situat a prop de Mataró i forma part del seu entorn?',
      options: [
        'El parc del Foix.',
        'El parc del Garraf.',
        'El parc del Montnegre i el Corredor.',
        'El parc del Cadí-Moixeró.',
      ],
      correct: 2,
    },

    // ── BLOC 2 — Govern municipal i política ─────────────────────
    {
      id: 'mataro-11',
      text: 'Qui és l\'alcalde de Mataró durant el mandat 2023-2027?',
      options: [
        'Joan Antoni Barón Espinar.',
        'David Bote Paz.',
        'Manuel Mas Estela.',
        'Joan Mora i Bosch.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-12',
      text: 'A quin partit polític pertany l\'alcalde de Mataró?',
      options: [
        'A ERC-MES-AM.',
        'A Junts per Mataró.',
        'Al PSC-Candidatura de Progrés.',
        'A En Comú Podem.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-13',
      text: 'Quants regidors i regidores conformen el Ple de l\'Ajuntament de Mataró?',
      options: ['21 regidors.', '25 regidors.', '27 regidors.', '31 regidors.'],
      correct: 2,
    },
    {
      id: 'mataro-14',
      text: 'Quants regidors té el grup municipal del PSC-Candidatura de Progrés a Mataró?',
      options: ['7 regidors.', '9 regidors.', '11 regidors.', '13 regidors.'],
      correct: 2,
    },
    {
      id: 'mataro-15',
      text: 'Amb quina formació política governa el PSC a Mataró durant el mandat 2023-2027?',
      options: [
        'Amb ERC-MES-AM.',
        'Amb Junts per Mataró.',
        'Amb el PP.',
        'Amb En Comú Podem-Confluència.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-16',
      text: 'On està situada la seu principal de l\'Ajuntament de Mataró?',
      options: [
        'A la Riera, 48.',
        'A la Plaça Gran.',
        'A la Plaça de Cuba.',
        "A l'Avinguda d'Ernest Lluch.",
      ],
      correct: 0,
    },
    {
      id: 'mataro-17',
      text: 'Com es coneix la sala de reunions principal on celebra les sessions la Junta de Govern Local?',
      options: [
        'La Sala dels Lleons.',
        'La Sala Capitular.',
        'La Sala Noble.',
        'La Sala dels Fanals.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-18',
      text: 'Quin dia del mes se celebra ordinàriament el Ple de l\'Ajuntament de Mataró?',
      options: [
        'El primer dilluns no festiu.',
        'El primer dijous no festiu.',
        'El primer dimarts no festiu.',
        "L'últim divendres del mes.",
      ],
      correct: 1,
    },
    {
      id: 'mataro-19',
      text: 'Quants regidors té l\'oposició de Vox a l\'Ajuntament de Mataró durant el mandat actual?',
      options: ['1 regidor.', '2 regidors.', '3 regidors.', '4 regidors.'],
      correct: 3,
    },
    {
      id: 'mataro-20',
      text: 'Quina formació política aporta un únic regidor a l\'oposició al consistori mataroní?',
      options: ['El PP.', 'Junts per Mataró.', 'ERC-MES-AM.', 'La CUP-AMUNT.'],
      correct: 3,
    },

    // ── BLOC 3 — Personatges il·lustres ──────────────────────────
    {
      id: 'mataro-21',
      text: 'Quin arquitecte modernista de fama mundial va néixer a Mataró el 17 d\'octubre de 1867?',
      options: [
        'Lluís Domènech i Montaner.',
        'Antoni Gaudí.',
        'Josep Puig i Cadafalch.',
        'Enric Sagnier.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-22',
      text: 'En quin any va morir Josep Puig i Cadafalch?',
      options: ["L'any 1926.", "L'any 1939.", "L'any 1968.", "L'any 1956."],
      correct: 3,
    },
    {
      id: 'mataro-23',
      text: 'Quin altre gran arquitecte modernista, no nascut a Mataró, va treballar a la ciutat entre 1878 i 1882?',
      options: [
        'Antoni Gaudí.',
        'Josep Maria Jujol.',
        'Lluís Domènech i Montaner.',
        'Cèsar Martinell.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-24',
      text: 'Per a quina entitat va treballar Antoni Gaudí a Mataró?',
      options: [
        'Per a la Diputació de Barcelona.',
        "Per a la Caixa d'Estalvis Laietana.",
        'Per a la Cooperativa Obrera Mataronesa.',
        'Per al Bisbat de Barcelona.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-25',
      text: 'Qui va promoure la construcció del primer ferrocarril de la Península Ibèrica entre Barcelona i Mataró?',
      options: ['Eusebi Güell.', 'Miquel Biada.', 'Macià Vila.', 'Antoni Brusi.'],
      correct: 1,
    },
    {
      id: 'mataro-26',
      text: 'En quin any es va inaugurar la línia de ferrocarril Barcelona-Mataró, primera de la Península Ibèrica?',
      options: ["L'any 1832.", "L'any 1848.", "L'any 1862.", "L'any 1875."],
      correct: 1,
    },
    {
      id: 'mataro-27',
      text: 'Quina obra emblemàtica de Puig i Cadafalch a Mataró acull avui la Fundació Iluro?',
      options: [
        'La Casa Coll i Regàs.',
        'La Casa Sisternes.',
        'La Casa Parera.',
        'La Casa de la Beneficència.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-28',
      text: 'En quin any es va construir la Casa Coll i Regàs?',
      options: ["L'any 1885.", "L'any 1898.", "L'any 1910.", "L'any 1925."],
      correct: 1,
    },
    {
      id: 'mataro-29',
      text: 'Quin nom rep popularment la primera obra modernista d\'Antoni Gaudí a Mataró?',
      options: [
        'La Casa Vicens.',
        'La Nau Gaudí.',
        'El Capricho.',
        'La Casa de la Diputació.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-30',
      text: 'Quin tipus de servei va dissenyar Puig i Cadafalch en l\'edifici de la Beneficència del 1894 a Mataró?',
      options: [
        'Una escola pública.',
        'Una biblioteca municipal.',
        "Una casa d'asil i atenció social.",
        'Un mercat municipal.',
      ],
      correct: 2,
    },

    // ── BLOC 4 — Patrimoni i monuments ──────────────────────────
    {
      id: 'mataro-31',
      text: 'Com es diu la basílica principal de Mataró, situada al centre històric?',
      options: [
        'La Basílica de Santa Anna.',
        'La Basílica de Sant Joan.',
        'La Basílica de Santa Maria.',
        'La Catedral del Salvador.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-32',
      text: 'Sobre les restes de quina ciutat romana s\'aixeca el centre històric de Mataró?',
      options: ['Sobre Egara.', 'Sobre Iluro.', 'Sobre Baetulo.', 'Sobre Auso.'],
      correct: 1,
    },
    {
      id: 'mataro-33',
      text: 'Quin estil arquitectònic predomina al voltant de la Basílica de Santa Maria de Mataró?',
      options: ['Romànic pur.', 'Gòtic flamíger.', 'Modernista.', 'Barroc.'],
      correct: 3,
    },
    {
      id: 'mataro-34',
      text: 'Com es diu la fundació cultural privada que gestiona la Casa Coll i Regàs?',
      options: [
        'La Fundació La Caixa.',
        'La Fundació Iluro.',
        'La Fundació Cabanellas.',
        'La Fundació Mataró Cultura.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-35',
      text: 'Quina ermita popular acull cada 28 d\'octubre la festa de la compra del «sabre»?',
      options: [
        "L'ermita de Sant Jaume.",
        "L'ermita de Sant Antoni.",
        "L'ermita del Remei.",
        "L'ermita de Sant Simó.",
      ],
      correct: 3,
    },
    {
      id: 'mataro-36',
      text: 'Què és el «sabre», dolç tradicional que es ven el dia de Sant Simó a Mataró?',
      options: [
        'Una galeta seca petita.',
        'Un brioix farcit de crema.',
        "Una peça de rebosteria amb forma d'espasa.",
        'Un caramel amb forma de creu.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-37',
      text: 'Quin any va ser inaugurat l\'edifici actual del mercat de la plaça de Cuba?',
      options: ["L'any 1898.", "L'any 1912.", "L'any 1955.", "L'any 1936."],
      correct: 3,
    },
    {
      id: 'mataro-38',
      text: 'Quin any va ser construït el cementiri municipal de Mataró, considerat un museu neoclàssic?',
      options: ["L'any 1750.", "L'any 1787.", "L'any 1820.", "L'any 1865."],
      correct: 1,
    },
    {
      id: 'mataro-39',
      text: 'Què va albergar fins l\'any 2000 l\'edifici llegat de l\'indià Antoni-Martí Cabanellas?',
      options: [
        'Un hospital militar.',
        'Una escola superior.',
        'Una caserna de la Guàrdia Civil.',
        'Un asil gestionat per Germanetes dels Pobres.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-40',
      text: 'Com es diu el carrer principal i comercial més important del centre de Mataró?',
      options: ['La Riera.', 'La Rambla.', 'El Passeig Marítim.', 'El carrer Argentona.'],
      correct: 0,
    },

    // ── BLOC 5 — Festa Major: Les Santes ───────────────────────
    {
      id: 'mataro-41',
      text: 'Com es diu la Festa Major de Mataró?',
      options: ['La Festa del Mar.', 'Les Santes.', 'El Robafaves.', 'La Diada Major.'],
      correct: 1,
    },
    {
      id: 'mataro-42',
      text: 'Quines són les patrones de Mataró que donen nom a Les Santes?',
      options: [
        'Santa Eulàlia i Santa Madrona.',
        'Santa Maria i Santa Tecla.',
        'Santa Juliana i Santa Semproniana.',
        'Santa Anna i Santa Quitèria.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-43',
      text: 'Quin dia és la diada principal de Les Santes?',
      options: ['El 26 de juliol.', "El 23 d'abril.", "El 6 d'agost.", 'El 27 de juliol.'],
      correct: 3,
    },
    {
      id: 'mataro-44',
      text: 'Entre quins dies se celebra actualment la Festa Major de Les Santes?',
      options: [
        'Del 22 al 26 de juliol.',
        'Del 24 al 28 de juliol.',
        'Del 26 al 30 de juliol.',
        'Del 25 al 29 de juliol.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-45',
      text: 'En quin any es va celebrar la primera Festa Major de Les Santes a Mataró, segons la documentació?',
      options: ["L'any 1722.", "L'any 1773.", "L'any 1812.", "L'any 1848."],
      correct: 1,
    },
    {
      id: 'mataro-46',
      text: 'Quin any van arribar a Mataró les primeres relíquies de les Santes en una urna de plata?',
      options: ["L'any 1675.", "L'any 1722.", "L'any 1773.", "L'any 1835."],
      correct: 1,
    },
    {
      id: 'mataro-47',
      text: 'En quin any van ser declarades Les Santes Festa Patrimonial d\'Interès Nacional?',
      options: ["L'any 2002.", "L'any 2005.", "L'any 2010.", "L'any 2018."],
      correct: 2,
    },
    {
      id: 'mataro-48',
      text: 'Com s\'anomena el bloc d\'actes previs a la Festa Major fins al 24 de juliol?',
      options: ["L'Avantfesta.", 'El Portal.', 'La Vetlla.', 'La Trobada.'],
      correct: 1,
    },
    {
      id: 'mataro-49',
      text: 'Com s\'anomena l\'acte oficial d\'inauguració de Les Santes que fa l\'alcalde des del balcó de l\'Ajuntament?',
      options: ['El Pregó.', "L'Obertura.", 'La Crida.', "L'Anunci."],
      correct: 2,
    },
    {
      id: 'mataro-50',
      text: 'Quin gegant principal del seguici popular de Mataró té el nom de «Robafaves»?',
      options: [
        'El Gegant Vell.',
        'El Gegant del Mar.',
        'El Gegant de la Família Robafaves.',
        'El Gegant del Pi.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-51',
      text: 'Quina d\'aquestes NO és una figura del seguici popular de Les Santes de Mataró?',
      options: [
        'La Momerota i la Momeroteta.',
        'El Drac de Mataró.',
        "L'Àliga.",
        'La Patum.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-52',
      text: 'Com s\'anomena l\'acte tradicional de remullada amb aigua que se celebra durant la Nit Boja del 25 de juliol?',
      options: ['La Banyada.', 'La Ruixada.', 'El Bateig.', 'El Toll.'],
      correct: 1,
    },

    // ── BLOC 6 — Castellers i cultura popular ──────────────────
    {
      id: 'mataro-53',
      text: 'Com es diu la colla castellera de Mataró?',
      options: [
        'Els Nens del Maresme.',
        'Capgrossos de Mataró.',
        "Castellers d'Iluro.",
        'Joves Mataronins.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-54',
      text: 'En quin acte tradicional de la nit del 23 de juny celebren les bruixes una baixada al carrer de Sant Joan?',
      options: [
        'La Baixada de les Bruixes.',
        'El Vol Negre.',
        'La Cercavila Màgica.',
        'La Nit del Foc.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-55',
      text: 'Quin element del cicle de Carnestoltes a Mataró és el «rei» de la festa?',
      options: ["L'En Burinot.", "L'En Fumera.", "L'En Pellofa.", "L'En Magraner."],
      correct: 2,
    },
    {
      id: 'mataro-56',
      text: 'Què apareix entronitzada a la plaça de la Peixateria després de Dimecres de Cendra?',
      options: [
        'La Vella Quaresma.',
        'La Mare dels Anys.',
        'La Reina Pasqual.',
        'La Senyora Dejuni.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-57',
      text: 'Qui acompanya la Geganta i en Robafaves al seguici popular mataroní?',
      options: [
        'En Trompeta i la Bufona.',
        "L'Hereu i la Pubilla.",
        'En Bufaforats i la Toneta.',
        "L'Esquerdat i la Núria.",
      ],
      correct: 2,
    },
    {
      id: 'mataro-58',
      text: 'Què representa la Momerota dins del seguici popular?',
      options: [
        'Un origen religiós medieval.',
        'Un origen carnavalesc.',
        'Una al·legoria militar.',
        'Una commemoració històrica.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-59',
      text: 'Quina d\'aquestes festes mataronines està vinculada estretament amb una ermita marítima de la ciutat?',
      options: [
        'La Festa de Sant Simó.',
        'La Festa de Sant Antoni.',
        'La Festa del Carme.',
        'La Festa del Roser.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-60',
      text: 'Quina coral participa habitualment a la solemne Missa de Les Santes?',
      options: [
        'La Coral Polifònica.',
        'El Cor Madrigal.',
        'La Coral La Nota.',
        "L'Orfeó Maresmenc.",
      ],
      correct: 2,
    },

    // ── BLOC 7 — Economia, universitat i transports ────────────
    {
      id: 'mataro-61',
      text: 'Com es diu el parc tecnològic i universitari de Mataró?',
      options: ['BarcelonaTech.', 'TecnoCampus.', 'Maresme Innova.', 'ParcLaietà.'],
      correct: 1,
    },
    {
      id: 'mataro-62',
      text: 'A quina universitat està adscrit el centre universitari TecnoCampus actualment?',
      options: [
        'A la Universitat de Barcelona.',
        'A la Universitat Autònoma de Barcelona.',
        'A la Universitat Politècnica de Catalunya.',
        'A la Universitat Pompeu Fabra.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-63',
      text: 'Sota quina universitat estava adscrita anteriorment l\'Escola Universitària Politècnica de Mataró durant més de 30 anys?',
      options: ['La UPC.', 'La UB.', 'La UPF.', 'La UAB.'],
      correct: 0,
    },
    {
      id: 'mataro-64',
      text: 'En quin any es va decidir impulsar el projecte del TecnoCampus a Mataró?',
      options: ["L'any 1990.", "L'any 1995.", "L'any 1999.", "L'any 2005."],
      correct: 2,
    },
    {
      id: 'mataro-65',
      text: 'Quin alcalde mataroní va presidir l\'impuls del projecte del TecnoCampus?',
      options: [
        'David Bote Paz.',
        'Joan Antoni Barón.',
        'Joan Mora i Bosch.',
        'Manuel Mas Estela.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-66',
      text: 'Quina autopista comunica Mataró amb Barcelona pel litoral?',
      options: ["L'AP-7.", "L'A-2.", 'La C-32.', 'La C-58.'],
      correct: 2,
    },
    {
      id: 'mataro-67',
      text: 'Quina línia de Rodalies connecta Mataró amb Barcelona?',
      options: ['La R1.', 'La R2.', 'La R3.', 'La R4.'],
      correct: 0,
    },
    {
      id: 'mataro-68',
      text: 'Com es diu el centre comercial principal situat al terme municipal de Mataró?',
      options: ["L'Illa Diagonal.", 'Mataró Parc.', 'Maremàgnum.', 'Splau.'],
      correct: 1,
    },
    {
      id: 'mataro-69',
      text: 'Què és la Fundació Iluro, dins del context cultural mataroní?',
      options: [
        'Una entitat esportiva històrica.',
        'Una fundació cultural privada propietària de la Casa Coll i Regàs.',
        'Una associació de comerciants del centre.',
        'Una entitat ferroviària històrica.',
      ],
      correct: 1,
    },
    {
      id: 'mataro-70',
      text: 'Quina d\'aquestes activitats NO va destacar tradicionalment a Mataró?',
      options: [
        'La construcció naval.',
        'El comerç marítim.',
        'La indústria tèxtil del gènere de punt.',
        'La pesca atunera.',
      ],
      correct: 3,
    },

    // ── BLOC 8 — Policia Local, seguretat i miscel·lània ───────
    {
      id: 'mataro-71',
      text: 'Quin telèfon d\'atenció general té l\'Ajuntament de Mataró?',
      options: ['93 758 21 00.', '93 745 12 12.', '93 169 65 00.', '93 790 84 74.'],
      correct: 0,
    },
    {
      id: 'mataro-72',
      text: 'Quin és el codi postal del centre històric de Mataró?',
      options: ['08001.', '08301.', '08360.', '08401.'],
      correct: 1,
    },
    {
      id: 'mataro-73',
      text: 'Quin universitari mataroní va ser ministra de Ciència i Innovació en la inauguració del TecnoCampus el 2010?',
      options: [
        'Cristina Garmendia.',
        'Carme Chacón.',
        'Soraya Rodríguez.',
        'Elena Salgado.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-74',
      text: 'Quin organisme municipal s\'encarrega de la promoció econòmica a Mataró?',
      options: [
        "L'IMPEM.",
        "L'OAL.",
        'El Consorci IMUREM.',
        "L'Agència de Desenvolupament.",
      ],
      correct: 0,
    },
    {
      id: 'mataro-75',
      text: 'Què és PUMSA, dins de la gestió pública mataronina?',
      options: [
        'Un organisme tributari local.',
        'Un consorci comarcal.',
        "Una societat municipal d'urbanisme i promoció.",
        'Una fundació hospitalària.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-76',
      text: 'Quina llei estatal regula les bases del règim local citada a les actes municipals de Mataró?',
      options: [
        "La Llei 7/1985, de 2 d'abril.",
        'La Llei Orgànica 4/2015.',
        'La Llei 4/2003 de Catalunya.',
        'La Llei 39/2015.',
      ],
      correct: 0,
    },
    {
      id: 'mataro-77',
      text: 'Què s\'aplica a Mataró com a sanció per posseir un gos potencialment perillós sense llicència municipal?',
      options: [
        'Una multa de 300,52 €.',
        'Una multa de 1.200,00 €.',
        'Una multa de 2.404,06 €.',
        'Una multa de 6.000,00 €.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-78',
      text: 'Quina d\'aquestes platges NO és pròpia del terme municipal de Mataró?',
      options: [
        'La platja del Callao.',
        'La platja del Varador.',
        'La platja de Sant Simó.',
        'La platja de la Picòrdia.',
      ],
      correct: 3,
    },
    {
      id: 'mataro-79',
      text: 'Quin acte popular tradicional té lloc cada Sant Jordi a Mataró, a banda de llibres i roses?',
      options: [
        'Una desfilada militar.',
        'Una mostra gastronòmica.',
        'La trobada de gegants i actuació castellera.',
        'Una regata al port.',
      ],
      correct: 2,
    },
    {
      id: 'mataro-80',
      text: 'Quin any va començar a recuperar i organitzar Les Santes el moviment ciutadà «Les Santes: Fem-ne Festa Major»?',
      options: ["L'any 1936.", "L'any 1979.", "L'any 1992.", "L'any 2002."],
      correct: 1,
    },
  ],
};

export default mataro;
