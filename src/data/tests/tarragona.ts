// Test específic Tarragona — 80 preguntes nivell alt.
// Cultura, política, patrimoni romà, festes i Guàrdia Urbana de Tarragona.
// Per a oposicions d'Agent de la Guàrdia Urbana de Tarragona.
import type { TestTopic } from './types';

const tarragona: TestTopic = {
  slug: 'tarragona',
  title: 'Tarragona',
  description: 'cultura, política, patrimoni romà, festes i Guàrdia Urbana',
  icon: '🏛️',
  accent: 'from-amber-500 to-red-600',
  category: 'municipi',
  municipi: 'Tarragona',
  questions: [
    // ── BLOC 1 — Geografia, població i comarca ───────────────────
    {
      id: 'tarragona-1',
      text: 'De quina comarca és capital la ciutat de Tarragona?',
      options: ['Del Tarragonès.', 'Del Baix Camp.', "De l'Alt Camp.", 'Del Baix Penedès.'],
      correct: 0,
    },
    {
      id: 'tarragona-2',
      text: 'Aproximadament, quants habitants té el municipi de Tarragona segons l\'INE 2025?',
      options: [
        'Uns 110.000 habitants.',
        'Uns 125.000 habitants.',
        'Uns 143.000 habitants.',
        'Uns 165.000 habitants.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-3',
      text: 'En quants districtes administratius es divideix el municipi de Tarragona?',
      options: ['En 3 districtes.', 'En 5 districtes.', 'En 7 districtes.', 'En 11 districtes.'],
      correct: 1,
    },
    {
      id: 'tarragona-4',
      text: 'Quin riu travessa el terme municipal de Tarragona dividint-lo en dues parts?',
      options: ['El Llobregat.', 'El Gaià.', 'El Ter.', 'El Francolí.'],
      correct: 3,
    },
    {
      id: 'tarragona-5',
      text: 'A quina distància aproximada es troba Tarragona de Barcelona?',
      options: ['A 95 km.', 'A 60 km.', 'A 150 km.', 'A 200 km.'],
      correct: 0,
    },
    {
      id: 'tarragona-6',
      text: 'Quin altre riu, a banda del Francolí, desemboca dins del terme municipal de Tarragona?',
      options: ['El riu Gaià.', 'El riu Llobregat.', "L'Ebre.", 'El Ter.'],
      correct: 0,
    },
    {
      id: 'tarragona-7',
      text: 'La província de Tarragona limita amb diferents províncies. Quina d\'aquestes NO hi limita?',
      options: ['Castelló.', 'Lleida.', 'Girona.', 'Saragossa.'],
      correct: 2,
    },
    {
      id: 'tarragona-8',
      text: 'Tarragona forma part del litoral conegut com a:',
      options: ['Costa Brava.', 'Costa Daurada.', 'Costa del Garraf.', 'Costa del Maresme.'],
      correct: 1,
    },
    {
      id: 'tarragona-9',
      text: 'Quin espai natural protegit es troba dins del terme municipal de Tarragona?',
      options: [
        'Tamarit-Punta de la Móra.',
        'Cap de Creus.',
        "El delta de l'Ebre.",
        "Aiguamolls de l'Empordà.",
      ],
      correct: 0,
    },
    {
      id: 'tarragona-10',
      text: 'Quina és la divisió territorial funcional on s\'inclou el municipi de Tarragona?',
      options: ['Pirineus.', 'Penedès.', "Terres de l'Ebre.", 'Camp de Tarragona.'],
      correct: 3,
    },

    // ── BLOC 2 — Govern municipal i política ─────────────────────
    {
      id: 'tarragona-11',
      text: 'Qui és l\'alcalde de Tarragona des del 17 de juny de 2023?',
      options: [
        'Pau Ricomà i Vallhonrat.',
        'Rubén Viñuales Elías.',
        'Josep Fèlix Ballesteros Casanova.',
        'Joan Miquel Nadal i Malé.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-12',
      text: 'A quin partit polític pertany l\'alcalde Rubén Viñuales?',
      options: ['A ERC.', 'A Junts per Catalunya.', 'Al PSC-PSOE.', 'Al PPC.'],
      correct: 2,
    },
    {
      id: 'tarragona-13',
      text: 'Quantes formacions polítiques tenen representació al consistori de Tarragona durant el mandat 2023-2027?',
      options: [
        '6 formacions polítiques.',
        '5 formacions polítiques.',
        '4 formacions polítiques.',
        '8 formacions polítiques.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-14',
      text: 'On està situada la seu principal de l\'Ajuntament de Tarragona?',
      options: ['Al Pla de la Seu.', 'A la plaça del Rei.', 'A la Rambla Nova.', 'A la plaça de la Font.'],
      correct: 3,
    },
    {
      id: 'tarragona-15',
      text: 'Quina és la professió principal de l\'alcalde Rubén Viñuales abans de l\'alcaldia?',
      options: [
        'Advocat i professor.',
        'Metge i empresari.',
        'Enginyer i arquitecte.',
        'Periodista i escriptor.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-16',
      text: 'A quina universitat es va llicenciar en Dret l\'alcalde de Tarragona?',
      options: [
        'A la Universitat de Barcelona.',
        'A la Universitat Pompeu Fabra.',
        'A la Universitat Autònoma de Barcelona.',
        'A la Universitat Rovira i Virgili.',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-17',
      text: 'En quin barri obrer es va criar l\'actual alcalde de Tarragona?',
      options: [
        'Al barri del Serrallo.',
        'Al barri de Sant Pere i Sant Pau.',
        'Al barri de Camp Clar.',
        'Al barri de Bonavista.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-18',
      text: 'Quina especialitat jurídica té l\'alcalde Viñuales?',
      options: [
        'Dret públic i dret penal.',
        'Dret laboral i administratiu.',
        'Dret mercantil i societari.',
        'Dret civil i de família.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-19',
      text: 'Quin any va ser elegit democràticament per primer cop un alcalde de Tarragona per sufragi universal?',
      options: ["L'any 1977.", "L'any 1985.", "L'any 1979.", "L'any 1981."],
      correct: 2,
    },
    {
      id: 'tarragona-20',
      text: 'Amb quina formació política va pactar el PSC el pressupost municipal del 2026 a Tarragona?',
      options: ['Amb ERC.', 'Amb En Comú Podem.', 'Amb Junts per Catalunya.', 'Amb el PPC.'],
      correct: 2,
    },

    // ── BLOC 3 — Patrimoni romà i UNESCO ─────────────────────────
    {
      id: 'tarragona-21',
      text: 'En quin any va ser declarat el Conjunt Arqueològic de Tàrraco Patrimoni Mundial per la UNESCO?',
      options: ["L'any 2000.", "L'any 1995.", "L'any 2005.", "L'any 2010."],
      correct: 0,
    },
    {
      id: 'tarragona-22',
      text: 'Quina data exacta es commemora com a Dia del Patrimoni Mundial a Tarragona?',
      options: ['El 23 de setembre.', "L'11 de setembre.", 'El 30 de novembre.', 'El 17 de juny.'],
      correct: 2,
    },
    {
      id: 'tarragona-23',
      text: 'Quin emperador romà va ordenar construir el Fòrum Provincial de Tàrraco vers l\'any 73 dC?',
      options: ['August.', 'Trajà.', 'Adrià.', 'Vespasià.'],
      correct: 3,
    },
    {
      id: 'tarragona-24',
      text: 'Sota el regnat de quin emperador es va construir el Circ romà de Tàrraco a finals del segle I dC?',
      options: ['Domicià.', 'Neró.', 'Calígula.', 'Tiberi.'],
      correct: 0,
    },
    {
      id: 'tarragona-25',
      text: 'Quina era la longitud aproximada del Circ romà de Tàrraco?',
      options: ['Uns 325 metres.', 'Uns 220 metres.', 'Uns 150 metres.', 'Uns 400 metres.'],
      correct: 0,
    },
    {
      id: 'tarragona-26',
      text: 'Quina província romana tenia Tàrraco com a capital durant l\'època imperial?',
      options: ['Hispania Bètica.', 'Lusitània.', 'Hispania Citerior.', 'Gallaecia.'],
      correct: 2,
    },
    {
      id: 'tarragona-27',
      text: 'Qui va desembarcar a Tarragona l\'any 218 aC durant les guerres púniques?',
      options: ['Juli Cèsar.', 'Marc Antoni.', 'Octavi August.', 'Cneu Corneli Escipió.'],
      correct: 3,
    },
    {
      id: 'tarragona-28',
      text: 'Quina construcció romana va ser la primera gran obra realitzada a Tàrraco?',
      options: ['La muralla.', 'El circ.', "L'amfiteatre.", 'El fòrum provincial.'],
      correct: 0,
    },
    {
      id: 'tarragona-29',
      text: 'Dins de l\'amfiteatre romà, posteriorment, s\'hi va construir una basílica dedicada a quins màrtirs?',
      options: [
        'Sant Pau, sant Joan i sant Pere.',
        'Fructuós, Auguri i Eulogi.',
        'Magí, Tecla i Pau.',
        'Sebastià, Cosme i Damià.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-30',
      text: 'Quin monument romà es troba a uns 20 km al nord-est de Tàrraco, sobre la Via Augusta?',
      options: [
        "L'aqüeducte de les Ferreres.",
        'El mausoleu de Centcelles.',
        "L'arc de Berà.",
        'La vil·la dels Munts.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-31',
      text: 'On es troba situat el mausoleu de Centcelles, vinculat a Tàrraco?',
      options: ['A Altafulla.', 'A Vila-seca.', 'Al Catllar.', 'A Constantí.'],
      correct: 3,
    },
    {
      id: 'tarragona-32',
      text: 'Com es coneix popularment l\'aqüeducte de les Ferreres?',
      options: ['Pont Vell.', 'Pont del Diable.', "Pont de l'Aigua.", 'Pont Romà.'],
      correct: 1,
    },

    // ── BLOC 4 — Catedral i patrimoni medieval ──────────────────
    {
      id: 'tarragona-33',
      text: 'A qui està dedicada la Catedral Basílica Metropolitana i Primada de Tarragona?',
      options: [
        'A santa Maria del Miracle.',
        'A sant Magí.',
        'A santa Tecla.',
        'A sant Fructuós.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-34',
      text: 'En quin segle es va iniciar la construcció de la Catedral de Tarragona?',
      options: ['Al segle XI.', 'Al segle XII.', 'Al segle XIII.', 'Al segle XIV.'],
      correct: 1,
    },
    {
      id: 'tarragona-35',
      text: 'En quin any es va consagrar la Catedral de Tarragona?',
      options: ["L'any 1280.", "L'any 1410.", "L'any 1331.", "L'any 1492."],
      correct: 2,
    },
    {
      id: 'tarragona-36',
      text: 'De quin estil arquitectònic és la Catedral de Tarragona?',
      options: [
        'Romànic pur.',
        'Barroc tardà.',
        'Neoclàssic.',
        'Transició del romànic al gòtic.',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-37',
      text: 'Quin escultor va realitzar el retaule major de la Catedral entre 1426 i 1436?',
      options: ['Pere Blai.', 'Jaume Cascalls.', 'Pere Joan.', 'Gil de Siloé.'],
      correct: 2,
    },
    {
      id: 'tarragona-38',
      text: 'Quin material va emprar Pere Joan per al retaule major de la Catedral?',
      options: [
        'Marbre blanc.',
        'Alabastre policromat.',
        'Fusta de noguera.',
        'Bronze daurat.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-39',
      text: 'Quin diàmetre aproximat té la rosassa gòtica de la façana principal de la Catedral?',
      options: ['Uns 7 metres.', 'Uns 14 metres.', 'Uns 18 metres.', 'Uns 10,5 metres.'],
      correct: 3,
    },
    {
      id: 'tarragona-40',
      text: 'Sobre quin tipus de construcció anterior es va aixecar la Catedral de Tarragona?',
      options: [
        'Sobre un temple romà i una mesquita.',
        'Sobre un teatre romà.',
        'Sobre un palau visigòtic.',
        'Sobre un monestir benedictí.',
      ],
      correct: 0,
    },

    // ── BLOC 5 — Festes i cultura popular ───────────────────────
    {
      id: 'tarragona-41',
      text: 'Quina és la patrona de la ciutat de Tarragona?',
      options: ['Santa Eulàlia.', 'Santa Tecla.', 'Santa Maria del Mar.', 'Santa Madrona.'],
      correct: 1,
    },
    {
      id: 'tarragona-42',
      text: 'Quin dia se celebra la diada de Santa Tecla a Tarragona?',
      options: ["L'11 de setembre.", "El 19 d'agost.", 'El 24 de setembre.', 'El 23 de setembre.'],
      correct: 3,
    },
    {
      id: 'tarragona-43',
      text: 'En quin any van arribar les relíquies de Santa Tecla a Tarragona, des d\'Armènia?',
      options: ["L'any 1170.", "L'any 1450.", "L'any 1321.", "L'any 1572."],
      correct: 2,
    },
    {
      id: 'tarragona-44',
      text: 'Quantes colles castelleres té la ciutat de Tarragona actualment?',
      options: ['Dues colles.', 'Tres colles.', 'Quatre colles.', 'Cinc colles.'],
      correct: 2,
    },
    {
      id: 'tarragona-45',
      text: 'Quina d\'aquestes NO és una colla castellera de Tarragona?',
      options: [
        'Xiquets de Tarragona.',
        'Castellers de Sants.',
        'Colla Jove dels Xiquets de Tarragona.',
        'Xiquets del Serrallo.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-46',
      text: 'De quin color és la camisa dels Xiquets de Tarragona?',
      options: ['Verda.', 'Lila.', 'Blava.', 'Ratllada blanc i vermell.'],
      correct: 3,
    },
    {
      id: 'tarragona-47',
      text: 'De quin color és la camisa de la Colla Jove dels Xiquets de Tarragona?',
      options: ['Verda.', 'Lila.', 'Groga.', 'Blanca.'],
      correct: 1,
    },
    {
      id: 'tarragona-48',
      text: 'En quin any es van fundar els Castellers de Sant Pere i Sant Pau?',
      options: ["L'any 1970.", "L'any 1990.", "L'any 1979.", "L'any 1988."],
      correct: 1,
    },
    {
      id: 'tarragona-49',
      text: 'En quin barri marítim van sorgir els Xiquets del Serrallo l\'any 1988?',
      options: [
        'Al barri del Serrallo.',
        'Al barri de la Part Alta.',
        'Al barri de Bonavista.',
        'Al barri de Torreforta.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-50',
      text: 'Cada quants anys se celebra a Tarragona el Concurs de Castells?',
      options: [
        'Cada any.',
        'Cada cinc anys.',
        'Cada tres anys.',
        'Cada dos anys (anys parells).',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-51',
      text: 'Quin reconeixement van rebre les Festes de Santa Tecla per part del Govern espanyol l\'any 2002?',
      options: [
        "Festa d'Interès Turístic Local.",
        'Festa Patrimonial Universal.',
        "Festa d'Interès Turístic Nacional.",
        'Festa de Caràcter Tradicional.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-52',
      text: 'Quin és el pasdoble que s\'ha convertit en l\'himne popular de les festes de Santa Tecla?',
      options: ['Amparito Roca.', "L'Empordà.", 'Marina.', 'El Virolai.'],
      correct: 0,
    },

    // ── BLOC 6 — Elements del seguici popular ──────────────────
    {
      id: 'tarragona-53',
      text: 'Quin element del seguici popular fa la baixada característica al començament de Santa Tecla?',
      options: ['El Lleó.', 'El Drac.', "L'Àliga.", 'La Mulassa.'],
      correct: 2,
    },
    {
      id: 'tarragona-54',
      text: 'Què és el Magí de les Timbales del seguici popular tarragoní?',
      options: [
        'Una colla castellera.',
        'Un element festiu del seguici.',
        'Una entitat gastronòmica.',
        'Una agrupació musical.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-55',
      text: 'Quins gegants formen part del seguici tradicional de Tarragona?',
      options: [
        'Gegants Moros i Gegants Vells.',
        'Gegants Catalans i Gegants Andalusos.',
        'Gegants Reials i Gegants Nous.',
        'Gegants Marítims i Gegants Pagesos.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-56',
      text: 'Quin és el recorregut aproximat dels pilars caminant entre la plaça de les Cols i l\'Ajuntament?',
      options: ['Uns 200 metres.', 'Un quilòmetre.', 'Uns 700 metres.', 'Uns 410 metres.'],
      correct: 3,
    },
    {
      id: 'tarragona-57',
      text: 'Quin acte pirotècnic obre les festes de Santa Tecla i està documentat des de l\'any 1550?',
      options: ['El correfoc.', 'La Tronada.', 'El castell de focs.', 'La Crida.'],
      correct: 1,
    },
    {
      id: 'tarragona-58',
      text: 'On té lloc la diada castellera de Santa Tecla, el 23 de setembre?',
      options: [
        'A la plaça de les Cols.',
        'A la plaça de la Font.',
        'Al Pla de la Seu.',
        'A la Rambla Nova.',
      ],
      correct: 1,
    },

    // ── BLOC 7 — Barris, equipaments i urbanisme ────────────────
    {
      id: 'tarragona-59',
      text: 'Com es coneix popularment el barri marítim i pesquer de Tarragona?',
      options: ['La Part Alta.', 'Camp Clar.', 'El Serrallo.', 'Bonavista.'],
      correct: 2,
    },
    {
      id: 'tarragona-60',
      text: 'Quin barri tarragoní inclou el Mas Corsini, el Miracle i el Mas del Frare?',
      options: ['Sant Pere i Sant Pau.', 'Bonavista.', 'Torreforta.', 'El Serrallo.'],
      correct: 0,
    },
    {
      id: 'tarragona-61',
      text: 'Quin és el nom oficial de l\'empresa pública que gestiona el transport urbà de Tarragona?',
      options: ['TMB Tarragona.', 'TUSGSAL.', 'AMB Bus.', 'EMT Tarragona.'],
      correct: 3,
    },
    {
      id: 'tarragona-62',
      text: 'A quina ciutat es troba l\'aeroport més proper a Tarragona, situat a uns 8-10 km?',
      options: ['A Salou.', 'A Reus.', 'A Cambrils.', 'A Vila-seca.'],
      correct: 1,
    },
    {
      id: 'tarragona-63',
      text: 'Quin és el telèfon d\'emergències de la Guàrdia Urbana de Tarragona?',
      options: ['El 091.', 'El 062.', 'El 080.', 'El 092.'],
      correct: 3,
    },
    {
      id: 'tarragona-64',
      text: 'Quin port és considerat el port pesquer més important de Catalunya?',
      options: [
        'El de Tarragona.',
        'El de Vilanova i la Geltrú.',
        'El de Barcelona.',
        'El de Palamós.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-65',
      text: 'Com es coneix la part antiga i medieval del centre històric de Tarragona?',
      options: ['La Vila Vella.', 'El Call Major.', 'La Part Alta.', 'El Raval.'],
      correct: 2,
    },
    {
      id: 'tarragona-66',
      text: 'Quin gran festival recrea l\'època romana a Tarragona durant el mes de maig?',
      options: ['Tàrraco Antiqva.', 'Festival Roma.', 'Imperium Tarraco.', 'Tarraco Viva.'],
      correct: 3,
    },

    // ── BLOC 8 — Guàrdia Urbana i seguretat ────────────────────
    {
      id: 'tarragona-67',
      text: 'Què signifiquen les sigles UMIRC dins de la Guàrdia Urbana de Tarragona?',
      options: [
        "Unitat Mòbil d'Investigació i Recerca Criminal.",
        'Unitat de Mediació i Resolució de Conflictes.',
        "Unitat Metropolitana d'Intervenció Ràpida Ciutadana.",
        'Unitat de Manteniment, Inspecció i Reglament Cívic.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-68',
      text: 'A quina divisió de la Guàrdia Urbana de Tarragona està adscrita la UMIRC?',
      options: [
        'A la Divisió Territorial.',
        'A la Divisió de Trànsit.',
        'A la Divisió de Policia Judicial.',
        'A la Divisió de Serveis Centrals.',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-69',
      text: 'En quantes grans divisions s\'estructura actualment la Guàrdia Urbana de Tarragona?',
      options: ['En 3 divisions.', 'En 4 divisions.', 'En 5 divisions.', 'En 7 divisions.'],
      correct: 2,
    },
    {
      id: 'tarragona-70',
      text: 'Quina d\'aquestes unitats NO pertany a la Divisió de Serveis Centrals de la Guàrdia Urbana de Tarragona?',
      options: [
        'La Unitat de Drons (UDRON).',
        'La Unitat Canina (UCAN).',
        'La Unitat de Medi Ambient (UMA).',
        'La Unitat de Policia de Proximitat (UPP).',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-71',
      text: 'Quines són les sigles de la unitat de la Guàrdia Urbana dedicada a la investigació bàsica?',
      options: ['UAB.', 'URB.', 'UPB.', 'UIB.'],
      correct: 3,
    },
    {
      id: 'tarragona-72',
      text: 'Quin tipus de model policial vol potenciar la Guàrdia Urbana de Tarragona en el seu desplegament actual?',
      options: [
        'Un model de policia reactiva.',
        'Un model de policia de proximitat.',
        'Un model de policia exclusivament administrativa.',
        'Un model de policia merament repressiva.',
      ],
      correct: 1,
    },

    // ── BLOC 9 — Museus, cultura i miscel·lània ────────────────
    {
      id: 'tarragona-73',
      text: 'Com es diu el museu nacional dedicat a l\'arqueologia situat a Tarragona?',
      options: [
        'MNAT (Museu Nacional Arqueològic de Tarragona).',
        "MAT (Museu d'Arqueologia de Tarragona).",
        "MUHIT (Museu d'Història Tarragonina).",
        'MNAC Tarragona.',
      ],
      correct: 0,
    },
    {
      id: 'tarragona-74',
      text: 'Quin museu municipal gestiona els recintes de l\'amfiteatre, el circ i el Pretori?',
      options: [
        'El Museu Bíblic.',
        "El Museu d'Història de Tarragona (MHT).",
        'El Museu del Port.',
        'El Museu Diocesà.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-75',
      text: 'Com es descriu l\'escut oficial de la ciutat de Tarragona?',
      options: [
        "Quatre barres vermelles sobre fons d'or.",
        'Creu de sant Jordi sobre fons blanc.',
        "Camp d'or amb quatre verats en ones de gules en pal.",
        'Senyera reial coronada amb llorer.',
      ],
      correct: 2,
    },
    {
      id: 'tarragona-76',
      text: 'Des de quin any Tarragona és de jurisdicció reial, fet que justifica la seva heràldica?',
      options: ['Des del 1137.', 'Des del 1245.', 'Des del 1359.', 'Des del 1173.'],
      correct: 3,
    },
    {
      id: 'tarragona-77',
      text: 'Quina d\'aquestes vil·les romanes vinculades al patrimoni de Tàrraco es troba a Altafulla?',
      options: [
        'La vil·la de Centcelles.',
        'La vil·la de la Llosa.',
        'La vil·la del Moro.',
        'La vil·la dels Munts.',
      ],
      correct: 3,
    },
    {
      id: 'tarragona-78',
      text: 'La Necròpolis paleocristiana de Tarragona és considerada:',
      options: [
        "La més petita d'Hispània.",
        'Una excavació recent del segle XX.',
        'Un cementiri exclusivament jueu.',
        "Una de les més extenses i importants de l'Occident romà.",
      ],
      correct: 3,
    },
    {
      id: 'tarragona-79',
      text: 'Quina universitat pública té la seu principal al Camp de Tarragona?',
      options: [
        'La Universitat Autònoma de Barcelona.',
        'La Universitat Rovira i Virgili.',
        'La Universitat Pompeu Fabra.',
        'La Universitat Oberta de Catalunya.',
      ],
      correct: 1,
    },
    {
      id: 'tarragona-80',
      text: 'Què va passar amb Tarragona el 30 de novembre de l\'any 2000, data emblemàtica per a la ciutat?',
      options: [
        "Va ser declarada capital cultural d'Europa.",
        'El seu conjunt arqueològic va ser declarat Patrimoni Mundial UNESCO.',
        "Es va inaugurar la línia d'AVE Madrid-Barcelona.",
        'Es va fundar la Universitat Rovira i Virgili.',
      ],
      correct: 1,
    },
  ],
};

export default tarragona;
