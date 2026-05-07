// Test específic El Vendrell — 80 preguntes nivell alt.
// Cultura, política, Pau Casals, festes i Policia Local del Vendrell.
// Per a oposicions de la Policia Local del Vendrell.
import type { TestTopic } from './types';

const vendrell: TestTopic = {
  slug: 'vendrell',
  title: 'El Vendrell',
  description: 'cultura, política, Pau Casals, castells i Policia Local',
  icon: '🎻',
  accent: 'from-sky-500 to-indigo-600',
  category: 'municipi',
  municipi: 'El Vendrell',
  questions: [
    // ── BLOC 1 — Geografia, comarca i nuclis ─────────────────────
    {
      id: 'vendrell-1',
      text: 'De quina comarca és capital la vila del Vendrell?',
      options: ['Del Baix Penedès.', "De l'Alt Penedès.", 'Del Tarragonès.', 'Del Garraf.'],
      correct: 0,
    },
    {
      id: 'vendrell-2',
      text: 'Aproximadament, quants habitants té el municipi del Vendrell segons l\'INE 2025?',
      options: [
        'Uns 41.000 habitants.',
        'Uns 28.000 habitants.',
        'Uns 55.000 habitants.',
        'Uns 68.000 habitants.',
      ],
      correct: 0,
    },
    {
      id: 'vendrell-3',
      text: 'Quina extensió aproximada té el terme municipal del Vendrell?',
      options: ['Uns 18 km².', 'Uns 25 km².', 'Uns 36-37 km².', 'Uns 60 km².'],
      correct: 2,
    },
    {
      id: 'vendrell-4',
      text: 'Quin d\'aquests NO és un dels tres barris marítims del Vendrell?',
      options: ['Sant Salvador.', 'Coma-ruga.', 'El Francàs.', 'Salou.'],
      correct: 3,
    },
    {
      id: 'vendrell-5',
      text: 'Quin antic municipi independent es va incorporar al terme del Vendrell el 1946?',
      options: ['Sant Vicenç de Calders.', 'Bonastre.', 'Albinyana.', 'Santa Oliva.'],
      correct: 0,
    },
    {
      id: 'vendrell-6',
      text: 'Amb quin altre municipi limita el Vendrell pel sector est?',
      options: ['Tarragona.', 'Calafell.', 'Vilanova i la Geltrú.', 'Sitges.'],
      correct: 1,
    },
    {
      id: 'vendrell-7',
      text: 'Per quina banda limita el Vendrell amb el mar Mediterrani?',
      options: ['Pel nord.', "Per l'oest.", "Per l'est.", 'Pel sud.'],
      correct: 3,
    },
    {
      id: 'vendrell-8',
      text: 'Quina riera principal travessa el municipi del Vendrell?',
      options: [
        'La riera de la Bisbal.',
        'La riera de Riudebitlles.',
        'La riera de Llinars.',
        'La riera del Foix.',
      ],
      correct: 0,
    },
    {
      id: 'vendrell-9',
      text: 'Quin nucli marítim és conegut per la presència de la Reserva Marina de la Masia Blanca?',
      options: ['Sant Salvador.', 'El Francàs.', 'Coma-ruga.', 'Sant Vicenç.'],
      correct: 2,
    },
    {
      id: 'vendrell-10',
      text: 'Aproximadament, quina longitud total de costa té el municipi del Vendrell?',
      options: ['Uns 3 km.', 'Uns 5 km.', 'Uns 7 km.', 'Uns 12 km.'],
      correct: 2,
    },

    // ── BLOC 2 — Govern municipal i política ─────────────────────
    {
      id: 'vendrell-11',
      text: 'Qui és l\'alcalde del Vendrell durant el mandat 2023-2027?',
      options: [
        'Martí Carnicer i Vidal.',
        'Pilar Sánchez Peña.',
        'Marc Robert i Borrellas.',
        'Kenneth Martínez Molina.',
      ],
      correct: 3,
    },
    {
      id: 'vendrell-12',
      text: 'A quin partit polític pertany l\'alcalde Kenneth Martínez?',
      options: ['A ERC.', 'Al PSC.', 'A Junts per Catalunya.', 'Al PPC.'],
      correct: 1,
    },
    {
      id: 'vendrell-13',
      text: 'Quants regidors i regidores conformen el Ple de l\'Ajuntament del Vendrell?',
      options: ['13 regidors.', '17 regidors.', '21 regidors.', '25 regidors.'],
      correct: 2,
    },
    {
      id: 'vendrell-14',
      text: 'Amb quin partit va formalitzar el PSC un acord de govern al Vendrell el 2023?',
      options: [
        'Amb Som Poble-ERC.',
        'Amb Comuns El Vendrell.',
        'Amb el Partit Popular.',
        'Amb Vox.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-15',
      text: 'Quina d\'aquestes formacions NO té representació al consistori vendrellenc 2023-2027?',
      options: [
        'Som Poble-ERC.',
        'Primer El Vendrell.',
        'Fem Vendrell.',
        'Convergents per Catalunya.',
      ],
      correct: 3,
    },
    {
      id: 'vendrell-16',
      text: 'Com es coneix el pla estratègic municipal de transformació presentat pel govern del Vendrell?',
      options: [
        'Pla Director 2025.',
        'Agenda Urbana El Vendrell 2030.',
        'Estratègia Capital Penedès.',
        'Pla Vendrell Avança.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-17',
      text: "Quina llei estatal obliga a incrementar la recollida selectiva fins al 60% l'any 2026?",
      options: [
        'La Llei 22/2011.',
        'La Llei 7/2022 de residus.',
        'La Llei 16/2002.',
        'La Llei 11/2014.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-18',
      text: 'Quina d\'aquestes regidories porta un membre del PP segons el pacte de govern del Vendrell?',
      options: [
        'Educació i Cultura.',
        'Joventut i Esports.',
        'Promoció Econòmica i Comerç.',
        'Habitatge i Serveis Socials.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-19',
      text: 'En quin any va ser elegit per primer cop alcalde del Vendrell Kenneth Martínez?',
      options: ["L'any 2015.", "L'any 2019.", "L'any 2023.", "L'any 2007."],
      correct: 1,
    },
    {
      id: 'vendrell-20',
      text: 'Amb quina ciutat de Puerto Rico està agermanat el Vendrell?',
      options: ['Amb San Juan.', 'Amb Mayagüez.', 'Amb Ponce.', 'Amb Aguadilla.'],
      correct: 1,
    },

    // ── BLOC 3 — Pau Casals i música ────────────────────────────
    {
      id: 'vendrell-21',
      text: 'En quin any va néixer Pau Casals al Vendrell?',
      options: ["L'any 1860.", "L'any 1865.", "L'any 1882.", "L'any 1876."],
      correct: 3,
    },
    {
      id: 'vendrell-22',
      text: 'Quina data exacta del calendari es commemora el naixement de Pau Casals?',
      options: ['El 29 de desembre.', "L'1 de gener.", 'El 15 de novembre.', "El 23 d'abril."],
      correct: 0,
    },
    {
      id: 'vendrell-23',
      text: 'Quin instrument musical va popularitzar Pau Casals arreu del món?',
      options: ['El violí.', 'El piano.', 'El violoncel.', "L'orgue."],
      correct: 2,
    },
    {
      id: 'vendrell-24',
      text: 'On va morir Pau Casals l\'any 1973?',
      options: [
        'A Prada de Conflent.',
        'A Barcelona.',
        'Al Vendrell.',
        'A San Juan de Puerto Rico.',
      ],
      correct: 3,
    },
    {
      id: 'vendrell-25',
      text: 'Quin any es commemora el 150è aniversari del naixement de Pau Casals?',
      options: ["L'any 2025.", "L'any 2026.", "L'any 2027.", "L'any 2028."],
      correct: 1,
    },
    {
      id: 'vendrell-26',
      text: 'Quin barri marítim del Vendrell acull el Museu Pau Casals?',
      options: ['Sant Salvador.', 'Coma-ruga.', 'El Francàs.', 'Sant Vicenç.'],
      correct: 0,
    },
    {
      id: 'vendrell-27',
      text: 'Quina obra interpretada per Pau Casals s\'ha convertit en un símbol universal de pau?',
      options: [
        "L'himne de la Joia.",
        'La Sardana de les Monges.',
        'El cant dels ocells.',
        'El cant de la Senyera.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-28',
      text: 'Quin nom rep el famós violoncel emblemàtic de Pau Casals?',
      options: ['Stradivari.', 'Goffriller.', 'Amati.', 'Guarneri.'],
      correct: 1,
    },
    {
      id: 'vendrell-29',
      text: 'Quin any va fundar Pau Casals la seva pròpia orquestra a Barcelona?',
      options: ["L'any 1907.", "L'any 1915.", "L'any 1920.", "L'any 1932."],
      correct: 2,
    },
    {
      id: 'vendrell-30',
      text: 'A quin lloc es va exiliar Pau Casals durant la Guerra Civil i el franquisme?',
      options: ['A Mèxic DF.', 'A París.', 'A Londres.', 'A Prada de Conflent.'],
      correct: 3,
    },
    {
      id: 'vendrell-31',
      text: 'Quina obra musical de J.S. Bach va recompondre i enregistrar Pau Casals?',
      options: [
        'Les Variacions Goldberg.',
        'El Clavecí ben temperat.',
        'Les Suites per a violoncel sol.',
        'La Passió segons Sant Mateu.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-32',
      text: 'Quin nom porta l\'auditori municipal del Vendrell, en homenatge al músic universal?',
      options: [
        'Auditori Pau Casals.',
        'Auditori Anselm Clavé.',
        'Auditori Eduard Toldrà.',
        'Auditori Frederic Mompou.',
      ],
      correct: 0,
    },

    // ── BLOC 4 — Patrimoni i monuments ──────────────────────────
    {
      id: 'vendrell-33',
      text: 'Quina ermita romànica del segle XI es troba al barri marítim de Sant Salvador?',
      options: [
        "L'ermita de Sant Antoni.",
        "L'ermita de Sant Salvador.",
        "L'ermita de Sant Magí.",
        "L'ermita de Sant Pere.",
      ],
      correct: 1,
    },
    {
      id: 'vendrell-34',
      text: 'Qui és l\'autor del Monument als Castellers situat al Vendrell?',
      options: [
        'Frederic Marès.',
        'Apel·les Fenosa.',
        'Josep Cañas i Cañas.',
        'Josep Maria Subirachs.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-35',
      text: 'Qui és l\'autor de l\'escultura de Pau Casals situada a la Plaça Nova del Vendrell?',
      options: ['Manolo Hugué.', 'Josep Llimona.', 'Josep Viladomat.', 'Pablo Gargallo.'],
      correct: 2,
    },
    {
      id: 'vendrell-36',
      text: 'En quina època es documenta per primera vegada la masia fortificada de Can Francàs?',
      options: ['Al segle XII.', 'Al segle XVI.', 'Al segle XVIII.', 'Al segle XIV.'],
      correct: 3,
    },
    {
      id: 'vendrell-37',
      text: 'En quin any apareix documentada per primera vegada la vila amb el nom de Venrel?',
      options: ["L'any 988.", "L'any 1037.", "L'any 1098.", "L'any 1145."],
      correct: 1,
    },
    {
      id: 'vendrell-38',
      text: 'A quin monestir pertanyien els pobles de la zona durant la repoblació medieval?',
      options: [
        'Al monestir de Poblet.',
        'Al monestir de Santes Creus.',
        'Al monestir de Montserrat.',
        'Al monestir de Sant Cugat.',
      ],
      correct: 3,
    },
    {
      id: 'vendrell-39',
      text: 'Quin il·lustre escriptor català de finals del segle XIX té casa pairal al Vendrell (Cal Guimerà)?',
      options: ['Jacint Verdaguer.', 'Joan Maragall.', 'Àngel Guimerà.', 'Narcís Oller.'],
      correct: 2,
    },
    {
      id: 'vendrell-40',
      text: 'Quin reconeixement va rebre la costa del Vendrell per primer cop l\'any 1988?',
      options: [
        'La Bandera Blava.',
        'El Distintiu Q de Qualitat.',
        'La Marca Eco-Platja.',
        'El Segell Mediterrani.',
      ],
      correct: 0,
    },

    // ── BLOC 5 — Festes i cultura popular ───────────────────────
    {
      id: 'vendrell-41',
      text: 'Qui és la patrona de la vila del Vendrell?',
      options: [
        'Santa Anna.',
        'Santa Tecla.',
        'La Mare de Déu del Roser.',
        'Santa Eulàlia.',
      ],
      correct: 0,
    },
    {
      id: 'vendrell-42',
      text: 'Quin dia se celebra el dia gran de la Festa Major del Vendrell?',
      options: ["El 23 d'abril.", 'El 24 de juny.', "El 6 d'agost.", 'El 26 de juliol.'],
      correct: 3,
    },
    {
      id: 'vendrell-43',
      text: 'Quants dies dura la Festa Major del Vendrell?',
      options: ['Dos dies.', 'Tres dies.', 'Quatre dies.', 'Una setmana.'],
      correct: 2,
    },
    {
      id: 'vendrell-44',
      text: 'Quin dia se celebra la Festa Major de Sant Salvador, al barri marítim?',
      options: ['El 15 de juliol.', "El 6 d'agost.", "El 15 d'agost.", "El 31 d'agost."],
      correct: 1,
    },
    {
      id: 'vendrell-45',
      text: 'Quin dia se celebra la Festa Major de Coma-ruga?',
      options: ["El 15 d'agost.", "El 6 d'agost.", "El 31 d'agost.", 'El 25 de juliol.'],
      correct: 0,
    },
    {
      id: 'vendrell-46',
      text: 'Quin nom rep el drac de foc emblemàtic del Vendrell, una de les bèsties més grans d\'Europa?',
      options: ['El Bou.', 'La Mulassa.', 'El Diable Roig.', 'El Caramot.'],
      correct: 3,
    },
    {
      id: 'vendrell-47',
      text: 'En quin any va ser creat el Caramot, el drac de foc del Vendrell?',
      options: ["L'any 1976.", "L'any 1980.", "L'any 1984.", "L'any 1992."],
      correct: 2,
    },
    {
      id: 'vendrell-48',
      text: 'Quina llargada aproximada té el Caramot del Vendrell?',
      options: ['Uns 10 metres.', 'Uns 15 metres.', 'Uns 20 metres.', 'Uns 30 metres.'],
      correct: 2,
    },
    {
      id: 'vendrell-49',
      text: 'Des de quin any documental es té constància del Ball de Diables del Vendrell?',
      options: ['Des del 1798.', 'Des del 1820.', 'Des del 1845.', 'Des del 1875.'],
      correct: 2,
    },
    {
      id: 'vendrell-50',
      text: 'Com es coneix la festa gastronòmica que se celebra el primer cap de setmana de febrer al Vendrell?',
      options: [
        'La Calçotada Popular.',
        'La Xatonada Popular.',
        'La Cassolada.',
        'La Fideuada.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-51',
      text: 'Des de quin any se celebra la Xatonada Popular del Vendrell?',
      options: ['Des del 1962.', 'Des del 1976.', 'Des del 1985.', 'Des del 1995.'],
      correct: 2,
    },
    {
      id: 'vendrell-52',
      text: 'Quina festa amb origen medieval relacionada amb el temps de la collita se celebra a primers de juliol al Vendrell?',
      options: [
        'La Festa Major Petita.',
        'Les Festes del Pa Beneit.',
        'Els Tres Tombs.',
        'La Diada del Patrimoni.',
      ],
      correct: 1,
    },

    // ── BLOC 6 — Castells i colles ─────────────────────────────
    {
      id: 'vendrell-53',
      text: 'Quina és la colla castellera històrica del Vendrell, considerada la degana del món casteller?',
      options: [
        'Els Nens del Vendrell.',
        'La Colla Vella del Vendrell.',
        'Els Castellers del Penedès.',
        'La Colla del Baix Penedès.',
      ],
      correct: 0,
    },
    {
      id: 'vendrell-54',
      text: 'En quin any van ser fundats els Nens del Vendrell?',
      options: ["L'any 1926.", "L'any 1900.", "L'any 1945.", "L'any 1970."],
      correct: 0,
    },
    {
      id: 'vendrell-55',
      text: 'Quin color de camisa porten els Nens del Vendrell?',
      options: [
        'Camisa blava turquesa.',
        'Camisa verda.',
        'Camisa vermella.',
        'Camisa lila.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-56',
      text: 'Quin castell històric van descarregar els Nens del Vendrell el 15 d\'octubre de 1951 a la Plaça Vella?',
      options: [
        'El primer 4 de 8 del segle XX.',
        'El primer 3 de 8 descarregat del segle XX.',
        'El primer 5 de 8 documentat.',
        'El primer pilar de 7 amb folre.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-57',
      text: 'Quina edició del Concurs de Castells de Tarragona van guanyar els Nens del Vendrell el 1970?',
      options: ['La 2a edició.', 'La 3a edició.', 'La 4a edició.', 'La 5a edició.'],
      correct: 3,
    },
    {
      id: 'vendrell-58',
      text: 'Com es deia la colla castellera vendrellenca creada el 1993 i dissolta el 2004?',
      options: [
        'La Colla Jove del Vendrell.',
        'Els Xiquets del Penedès.',
        'La Colla Nova del Vendrell.',
        'Els Castellers del Vendrell.',
      ],
      correct: 2,
    },
    {
      id: 'vendrell-59',
      text: 'Quin color de camisa duia la dissolta Colla Nova del Vendrell?',
      options: ['Blau turquesa.', 'Groc.', 'Taronja.', 'Negra.'],
      correct: 0,
    },
    {
      id: 'vendrell-60',
      text: 'Quin sant patró dels castellers va instituir la festa la colla dels Nens del Vendrell l\'any 1947?',
      options: ['Sant Roc.', 'Sant Cristòfol.', 'Sant Jordi.', 'Sant Zacaries.'],
      correct: 3,
    },

    // ── BLOC 7 — Museus, gastronomia i turisme ─────────────────
    {
      id: 'vendrell-61',
      text: 'Quin museu del Vendrell conserva el llegat arqueològic del Baix Penedès?',
      options: [
        'El Museu Diocesà.',
        'El Museu Arqueològic del Vendrell.',
        'El Museu del Mar.',
        'El Museu de la Música.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-62',
      text: 'Quin plat gastronòmic identifica el Vendrell i tota la zona del Penedès i Garraf?',
      options: ["L'arròs negre.", 'El xató.', 'La fideuà.', "L'escudella catalana."],
      correct: 1,
    },
    {
      id: 'vendrell-63',
      text: 'Quina denominació d\'origen acompanya els vins de la zona del Vendrell?',
      options: [
        'DO Empordà.',
        'DO Tarragona.',
        'DO Costers del Segre.',
        'DO Penedès.',
      ],
      correct: 3,
    },
    {
      id: 'vendrell-64',
      text: 'Quina d\'aquestes ciutats NO forma part de la Ruta del Xató, juntament amb el Vendrell?',
      options: ['Sitges.', 'Vilanova i la Geltrú.', 'Calafell.', 'Tarragona.'],
      correct: 3,
    },
    {
      id: 'vendrell-65',
      text: 'Quina postre tradicional típic del Vendrell, fet amb sucre i clara d\'ou, té un nom singular?',
      options: ['Els bufats.', 'Els carquinyolis.', 'Les coquetes.', 'Les neules.'],
      correct: 0,
    },
    {
      id: 'vendrell-66',
      text: 'Com es diu la fira multisectorial més important del Vendrell, celebrada a l\'octubre?',
      options: [
        'La Fira de Sant Martí.',
        'La Fira de Santa Teresa.',
        'La Fira de Tots Sants.',
        'La Fira del Vi.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-67',
      text: 'Com es diu el nom propi que té el programa d\'activitats d\'estiu a les platges del Vendrell?',
      options: ['Turismar.', 'Estiu al Mar.', 'Vendrellestiu.', 'Mar i Festa.'],
      correct: 0,
    },
    {
      id: 'vendrell-68',
      text: 'Quin antic edifici sanitari, avui hotel de cinc estrelles, es troba a Coma-ruga?',
      options: [
        'El Sanatori de Sant Joan de Déu.',
        'El Sanatori del Cardenal Vidal.',
        "L'Hospital del Salvador.",
        "L'Hospital del Mar.",
      ],
      correct: 0,
    },

    // ── BLOC 8 — Policia Local, seguretat i miscel·lània ───────
    {
      id: 'vendrell-69',
      text: 'Quin és el telèfon d\'emergències general europeu al qual també respon la Policia Local del Vendrell?',
      options: ['091.', '092.', '112.', '062.'],
      correct: 2,
    },
    {
      id: 'vendrell-70',
      text: 'Quin reglament municipal regula la nomenclatura dels carrers del Vendrell?',
      options: [
        'El Reglament Orgànic Municipal.',
        'El Reglament del Nomenclàtor dels Carrers.',
        "El Pla d'Ordenació Urbanística.",
        "L'Ordenança de Convivència.",
      ],
      correct: 1,
    },
    {
      id: 'vendrell-71',
      text: 'Què és el Caramot, més enllà de la festa, dins de la cultura popular vendrellenca?',
      options: [
        'Una colla castellera.',
        'Una bèstia de foc en forma de drac.',
        'Un ball religiós tradicional.',
        'Un instrument musical.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-72',
      text: 'Quina d\'aquestes ciutats NO és una ciutat agermanada amb el Vendrell?',
      options: ['Sabaudia.', 'Lavaur.', 'Mayagüez.', 'Florència.'],
      correct: 3,
    },
    {
      id: 'vendrell-73',
      text: 'Quin paisatge geogràfic limita el Vendrell pel nord?',
      options: [
        'La Serra del Cadí.',
        'Els contraforts del massís de Garraf i bloc del Gaià.',
        'Els Pirineus orientals.',
        'El delta del Llobregat.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-74',
      text: 'Com es coneixia a Sant Vicenç de Calders entre els anys 1937 i la postguerra?',
      options: [
        'Sant Vicenç Vell.',
        'Calders del Baix Penedès.',
        'Sant Vicenç de Mar.',
        'Vicenç-Tarragonès.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-75',
      text: 'Quin és l\'origen etimològic més acceptat del nom Vendrell?',
      options: [
        "De l'àrab 'vendrell'.",
        "Del grec 'venedos'.",
        "Del basc 'bendel'.",
        "Del llatí 'venerellus', diminutiu de Venus.",
      ],
      correct: 3,
    },
    {
      id: 'vendrell-76',
      text: 'En quina ubicació exacta del Vendrell descansen les restes de Pau Casals des del 1979?',
      options: [
        'Al cementiri de Sant Salvador.',
        'Al cementiri municipal del Vendrell.',
        "Al panteó de l'església parroquial.",
        'Al jardí del Museu Pau Casals.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-77',
      text: 'Quina distinció pòstuma li va concedir la Generalitat a Pau Casals l\'any 1979?',
      options: [
        'La Creu de Sant Jordi.',
        "La Medalla d'Or de la Generalitat.",
        "El Premi d'Honor Lluís Companys.",
        'El Premi Internacional de la Pau.',
      ],
      correct: 1,
    },
    {
      id: 'vendrell-78',
      text: 'Quin partit polític té el seu càrrec amb el regidor Albert Rovira Lope com a portaveu el 2026?',
      options: ['PSC.', 'Vox.', 'Som Poble-ERC-AM.', 'Comuns El Vendrell.'],
      correct: 2,
    },
    {
      id: 'vendrell-79',
      text: 'Quina ciutat acull l\'oficina secundària de la Fundació Pau Casals, a banda del Vendrell?',
      options: ['Madrid.', 'Tarragona.', 'Lleida.', 'Barcelona.'],
      correct: 3,
    },
    {
      id: 'vendrell-80',
      text: 'Què va passar amb el Vendrell durant els segles X i XI, en el seu origen històric?',
      options: [
        'Va ser fundat com a colònia romana.',
        'Va passar a domini almohade.',
        'Va ser repoblat a partir de la conquesta cristiana cap al sud.',
        'Va declarar-se ciutat lliure imperial.',
      ],
      correct: 2,
    },
  ],
};

export default vendrell;
