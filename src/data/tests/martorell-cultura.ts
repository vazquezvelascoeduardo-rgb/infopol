// Test específic Martorell — coneixement del municipi.
// 150 preguntes de cultura de la ciutat per a Agent de Policia Local de Martorell.
import type { TestTopic } from './types';

const martorellCultura: TestTopic = {
  "slug": "martorell-cultura",
  "title": "Martorell · Cultura de la ciutat",
  "description": "geografia, història, patrimoni, festes i institucions de Martorell",
  "icon": "🏘️",
  "accent": "from-teal-500 to-emerald-600",
  "category": "municipi",
  "municipi": "Martorell",
  "questions": [
    {
      "id": "martorell-cultura-1",
      "text": "A quina comarca pertany el municipi de Martorell?",
      "options": [
        "A l'Alt Penedès",
        "A l'Anoia",
        "Al Baix Llobregat",
        "Al Vallès Occidental"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-2",
      "text": "A quina província pertany Martorell?",
      "options": [
        "A la de Tarragona",
        "A la de Girona",
        "A la de Barcelona",
        "A la de Lleida"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-3",
      "text": "Quina és la categoria administrativa tradicional de Martorell?",
      "options": [
        "Vila",
        "Ciutat",
        "Llogaret",
        "Entitat municipal descentralitzada"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-4",
      "text": "Quina altitud oficial té Martorell segons l'Idescat?",
      "options": [
        "26 m sobre el nivell del mar",
        "112 m sobre el nivell del mar",
        "156 m sobre el nivell del mar",
        "56 m sobre el nivell del mar"
      ],
      "correct": 3,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-5",
      "text": "Quin és el codi postal de Martorell?",
      "options": [
        "08620",
        "08770",
        "08850",
        "08760"
      ],
      "correct": 3,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-6",
      "text": "A quin partit judicial pertany Martorell?",
      "options": [
        "Al de Martorell",
        "Al de Sant Feliu de Llobregat",
        "Al d'Igualada",
        "Al de Vilafranca del Penedès"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-7",
      "text": "A quina Àrea Bàsica Policial (ABP) està adscrit el municipi de Martorell?",
      "options": [
        "A l'ABP de Martorell",
        "A l'ABP de Sant Andreu de la Barca",
        "A l'ABP d'Esparreguera",
        "A l'ABP de Cornellà de Llobregat"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-8",
      "text": "Quantes entitats singulars de població té el terme municipal de Martorell segons l'Idescat?",
      "options": [
        "1",
        "2",
        "4",
        "9"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-9",
      "text": "Quin municipi limita amb Martorell pel nord-est?",
      "options": [
        "Abrera",
        "Collbató",
        "Pallejà",
        "Gelida"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-10",
      "text": "Quin municipi limita amb Martorell per l'est i pertany al Vallès Occidental?",
      "options": [
        "Sant Esteve Sesrovires",
        "Corbera de Llobregat",
        "Castellbisbal",
        "Sant Vicenç dels Horts"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-11",
      "text": "Quin municipi limita amb Martorell pel sud-est?",
      "options": [
        "Masquefa",
        "Sant Andreu de la Barca",
        "Olesa de Montserrat",
        "Piera"
      ],
      "correct": 1,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-12",
      "text": "Quin municipi limita amb Martorell per l'oest i el nord-oest?",
      "options": [
        "Castellví de Rosanes",
        "Sant Esteve Sesrovires",
        "Esparreguera",
        "Sant Llorenç d'Hortons"
      ],
      "correct": 1,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-13",
      "text": "Amb quants municipis limita el terme de Martorell?",
      "options": [
        "Amb 3",
        "Amb 4",
        "Amb 5",
        "Amb 8"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-14",
      "text": "Quin fet fluvial defineix el terme de Martorell?",
      "options": [
        "El naixement del riu Anoia",
        "La desembocadura del Llobregat al mar",
        "La confluència del riu Anoia amb el riu Llobregat",
        "La confluència del Cardener amb el Llobregat"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-15",
      "text": "Per quin marge del Llobregat hi desemboca el riu Anoia?",
      "options": [
        "Pel marge dret",
        "Pel marge esquerre",
        "Per tots dos marges, en dos braços",
        "L'Anoia no és afluent del Llobregat"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-16",
      "text": "El congost de Martorell està format pels contraforts de quines muntanyes?",
      "options": [
        "De les muntanyes de Prades",
        "Del massís del Montseny",
        "De la serra de Collserola",
        "De les muntanyes de l'Ordal"
      ],
      "correct": 3,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-17",
      "text": "Com es denomina turísticament l'aiguabarreig de l'Anoia i el Llobregat i el pas d'infraestructures a Martorell?",
      "options": [
        "La Cruïlla de Catalunya",
        "El Nus del Llobregat",
        "El Portal del Penedès",
        "L'Aiguabarreig de l'Ordal"
      ],
      "correct": 1,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-18",
      "text": "Quina altitud té el turó del Pou del Merli, que té vèrtex geodèsic?",
      "options": [
        "96 m",
        "156 m",
        "267 m",
        "312 m"
      ],
      "correct": 1,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-19",
      "text": "A més de la serra de les Torretes, quines dues serres consten al terme de Martorell?",
      "options": [
        "La serra de la Correiola i la serra de l'Ataix",
        "La serra de l'Obac i la serra de Rubió",
        "La serra de Marina i la serra de l'Ordal",
        "La serra del Cadí i la serra de Queralt"
      ],
      "correct": 0,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-20",
      "text": "Quantes fonts s'han identificat al terme de Martorell i quantes funcionen correctament?",
      "options": [
        "8 identificades i 3 en servei",
        "12 identificades i 12 en servei",
        "19 identificades i 8 en servei",
        "30 identificades i 19 en servei"
      ],
      "correct": 2,
      "reference": "Geografia i territori"
    },
    {
      "id": "martorell-cultura-21",
      "text": "Quina població tenia Martorell segons el padró d'1 de gener de 2025 (Idescat)?",
      "options": [
        "21.314 habitants",
        "25.470 habitants",
        "28.989 habitants",
        "34.120 habitants"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-22",
      "text": "Quina densitat de població té Martorell segons l'Idescat (2025)?",
      "options": [
        "253,0 hab./km²",
        "1.482,5 hab./km²",
        "2.271,9 hab./km²",
        "4.980,0 hab./km²"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-23",
      "text": "Quin és el gentilici dels habitants de Martorell?",
      "options": [
        "Martorellès, martorellesa",
        "Martorellenc, martorellenca",
        "Martorellí, martorellina",
        "Llobregatenc, llobregatenca"
      ],
      "correct": 1,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-24",
      "text": "Quantes persones de nacionalitat estrangera consten empadronades a Martorell segons l'Idescat?",
      "options": [
        "1.274",
        "2.583",
        "4.857",
        "7.209"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-25",
      "text": "Quin percentatge aproximat de la població de Martorell té nacionalitat estrangera?",
      "options": [
        "Al voltant del 5%",
        "Al voltant del 10%",
        "Al voltant del 17%",
        "Al voltant del 30%"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-26",
      "text": "Quantes llars consten a Martorell segons les dades de l'Idescat?",
      "options": [
        "4.041",
        "5.883",
        "7.191",
        "9.966"
      ],
      "correct": 3,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-27",
      "text": "Quants habitants tenia Martorell l'any 1857?",
      "options": [
        "4.136",
        "808",
        "7.926",
        "13.086"
      ],
      "correct": 0,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-28",
      "text": "A quina causa s'atribueix la davallada demogràfica de Martorell de l'any 1900, quan la vila baixà fins als 3.221 habitants?",
      "options": [
        "A l'emigració cap a Amèrica",
        "A la Guerra del Francès",
        "A la fil·loxera",
        "A l'epidèmia de grip"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-29",
      "text": "En quin període es va produir el creixement demogràfic més espectacular de Martorell, per immigració industrial?",
      "options": [
        "Entre 1900 i 1910",
        "Entre 1930 i 1940",
        "Entre 1960 i 1970",
        "Entre 1990 i 2000"
      ],
      "correct": 2,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-30",
      "text": "Quin és el barri que constitueix el nucli originari de Martorell, situat al marge dret de l'Anoia i lleugerament elevat sobre la plana d'inundació?",
      "options": [
        "El barri de Buenos Aires",
        "El barri de les Bòbiles",
        "El barri del Camí Fondo",
        "El barri de la Vila"
      ],
      "correct": 3,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-31",
      "text": "Quin dels següents SÍ que és un barri de Martorell?",
      "options": [
        "Ca n'Oliveres",
        "Pou del Merli",
        "Els Convents",
        "Santa Llúcia"
      ],
      "correct": 1,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-32",
      "text": "Quin barri de Martorell consta com a barri de nova creació, en construcció?",
      "options": [
        "La Sínia",
        "Rosanes",
        "Can Bros",
        "Portal d'Anoia"
      ],
      "correct": 0,
      "reference": "Demografia i barris"
    },
    {
      "id": "martorell-cultura-33",
      "text": "Quin és el vestigi humà més antic documentat al terme de Martorell?",
      "options": [
        "Un poblat ibèric al turó del Pou del Merli",
        "Una vil·la romana al Camí Fondo",
        "Dues tombes del Neolític a l'antiga Bòbila Bonastre",
        "Un dolmen a la serra de les Torretes"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-34",
      "text": "Què s'ha trobat a Martorell en relació amb els ibers?",
      "options": [
        "Ceràmiques ibèriques en diversos jaciments, però cap resta humana de pobladors ibers",
        "Un poblat ibèric complet i la seva necròpolis",
        "Restes humanes de més de cinquanta individus ibers",
        "Cap indici de presència ibèrica"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-35",
      "text": "Amb quina població romana s'ha identificat tradicionalment Martorell?",
      "options": [
        "Amb *Egara*",
        "Amb *Ad Fines*",
        "Amb *Baetulo*",
        "Amb *Iluro*"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-36",
      "text": "Quin nom donaven els romans al riu Llobregat?",
      "options": [
        "*Anoia*",
        "*Sicoris*",
        "*Rubricatus*",
        "*Ticis*"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-37",
      "text": "Quina via romana passava per Martorell?",
      "options": [
        "La Via Domitia",
        "La Via Heraclea del Vallès",
        "La Via Mercadera",
        "La Via Augusta"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-38",
      "text": "En quin any se situa la batalla d'Ad Pontes, entre musulmans i francs, a la rodalia del pont del Diable?",
      "options": [
        "L'any 711",
        "L'any 985",
        "L'any 1114",
        "L'any 792"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-39",
      "text": "De quin any data la primera menció documental del nom \"Martorell\"?",
      "options": [
        "De l'any 985",
        "De l'any 1032",
        "De l'any 1114",
        "De l'any 1205"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-40",
      "text": "En quin any es va fundar el priorat de Sant Genís de Rocafort?",
      "options": [
        "El 1032",
        "El 1114",
        "El 1167",
        "El 1042"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-41",
      "text": "Qui van fundar el priorat de Sant Genís de Rocafort?",
      "options": [
        "Guillem (II) Bonfill i la seva esposa Sicarda",
        "Roger Bernat de Foix i la seva esposa",
        "Guilleuma de Castellvell i el seu fill",
        "El comte Ramon Berenguer III i la comtessa Dolça"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-42",
      "text": "A quina baronia pertanyia Martorell a l'edat mitjana?",
      "options": [
        "A la baronia de Rocafort",
        "A la baronia de Castellvell, amb centre al castell de Sant Jaume",
        "A la baronia d'Eroles",
        "A la baronia de Montserrat"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-43",
      "text": "Qui va derrotar els almoràvits a la batalla de Martorell de l'any 1114, lliurada al congost?",
      "options": [
        "Ramon Berenguer III de Barcelona, amb els comtes d'Urgell i Cerdanya",
        "Jaume I el Conqueridor",
        "Pere el Gran",
        "Alfons el Magnànim"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-44",
      "text": "De quin any són els documents que acrediten l'existència de l'hospital de Martorell?",
      "options": [
        "De 1042",
        "De 1114",
        "De 1344",
        "De 1216"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-45",
      "text": "De quin any data la primera citació de la Fira de Sant Bartomeu, que se celebrava al costat del pont del Diable?",
      "options": [
        "De 1032",
        "De 1167",
        "De 1396",
        "De 1282"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-46",
      "text": "En quin any va rebre Martorell el privilegi fundacional del municipi, atorgat per Roger Bernat de Foix?",
      "options": [
        "El 1282",
        "El 1296",
        "El 1344",
        "El 1422"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-47",
      "text": "Quin privilegi va rebre Martorell l'any 1396, en incorporar-se a la Corona arran de la invasió de Mateu I de Foix?",
      "options": [
        "El de ser declarat \"carrer de Barcelona\"",
        "El de celebrar mercat setmanal",
        "El d'encunyar moneda pròpia",
        "El de constituir-se en marquesat"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-48",
      "text": "Qui va concedir el 23 de març de 1422 el privilegi d'una segona fira per Sant Marc, origen de l'actual Fira de Primavera?",
      "options": [
        "El rei Martí l'Humà",
        "El rei Joan I",
        "El rei Pere el Cerimoniós",
        "La reina Maria de Castella, esposa d'Alfons el Magnànim"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-49",
      "text": "Quina confraria es va crear a Martorell l'any 1577, arran de la notable immigració francesa del segle XVI?",
      "options": [
        "La Confraria de Sant Antoni Abat",
        "La Confraria del Roser",
        "La Confraria dels Estrangers",
        "La Confraria de Sant Bartomeu"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-50",
      "text": "Des de quin any Martorell és centre d'un marquesat, fet que explica la corona de marquès de l'escut?",
      "options": [
        "Des del 1422",
        "Des del 1577",
        "Des del 1637",
        "Des del 1686"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-51",
      "text": "Qui va ocupar i saquejar Martorell el 21 de gener de 1641, durant la guerra dels Segadors?",
      "options": [
        "El duc de Berwick",
        "El general Vives",
        "El baró d'Eroles",
        "El virrei Pedro Fajardo de Requesens-Zúñiga"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-52",
      "text": "En quin any es va establir a la vila de Martorell la comunitat de frares caputxins?",
      "options": [
        "El 1637",
        "El 1686",
        "El 1732",
        "El 1835"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-53",
      "text": "Què va passar a Martorell l'any 1714, durant la Guerra de Successió?",
      "options": [
        "La vila fou incendiada per complet",
        "S'hi va signar la capitulació de Catalunya",
        "El castell de Rosanes fou pres i se'n va volar la torre de l'homenatge",
        "S'hi va instal·lar la cort de l'arxiduc Carles"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-54",
      "text": "En quin any es va acordar la construcció de la caserna de cavalleria de Martorell, per allotjar-hi les tropes?",
      "options": [
        "El 1732",
        "El 1686",
        "El 1808",
        "El 1842"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-55",
      "text": "Com va acabar la presència francesa a Martorell durant la Guerra del Francès?",
      "options": [
        "Amb la crema de la vila el 1814",
        "Amb la rendició dels francesos al baró d'Eroles l'any 1814",
        "Amb l'ocupació permanent del castell de Rosanes",
        "Amb la retirada pactada el 1809"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-56",
      "text": "Fins a quin any va funcionar la colònia fabril tèxtil de Can Bros?",
      "options": [
        "Fins al 1936",
        "Fins al 1945",
        "Fins al 1961",
        "Fins al 1967"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-57",
      "text": "Fins a quin any van estar actives les mines de plom del terme de Martorell?",
      "options": [
        "Fins al 1935",
        "Fins al 1961",
        "Fins al 1973",
        "Fins al 1993"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-58",
      "text": "L'any 1945, quin percentatge de la superfície del terme de Martorell era vinya, majoritàriament de la varietat xarel·lo?",
      "options": [
        "El 37%",
        "El 12%",
        "El 55%",
        "El 80%"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-59",
      "text": "Quan va arribar el primer tren a Martorell i quan va entrar en servei l'estació actual d'Adif?",
      "options": [
        "El 1893 i el 1912, respectivament",
        "El 1856 (estació provisional) i el 1859, respectivament",
        "El 1912 i el 1924, respectivament",
        "El 1859 i el 1893, respectivament"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-60",
      "text": "Qui va proclamar la Segona República a Martorell el 14 d'abril de 1931?",
      "options": [
        "Francesc Riera",
        "Vicenç Ros i Batllevell",
        "Francesc Santacana i Romeu",
        "Francesc Pujols i Morgades"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-61",
      "text": "Quins tres edificis religiosos de Martorell van ser incendiats i destruïts l'any 1936?",
      "options": [
        "El convent dels caputxins, la capella de Sant Joan i Sant Genís de Rocafort",
        "L'església parroquial de Santa Maria, l'ermita de Santa Margarida i la capella de la Torre de Santa Llúcia",
        "La capella de Sant Bartomeu, l'església de Can Bros i l'ermita del Pou del Merli",
        "Cap: els edificis religiosos de Martorell es van salvar"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-62",
      "text": "Què va passar a Martorell el 23 de gener de 1939?",
      "options": [
        "Hi van entrar les tropes franquistes sense combat",
        "S'hi va instal·lar el govern de la Generalitat",
        "S'hi va celebrar l'última sessió del Ple republicà",
        "L'exèrcit republicà en retirada va volar els ponts i, cap a les 9 del matí, l'aviació alemanya va bombardejar el carrer del Mur i el seu entorn"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "martorell-cultura-63",
      "text": "Quins són els quatre senyals parlants que figuren a l'escut de Martorell?",
      "options": [
        "El mar, la mà, la torre i el martell",
        "El pont, el riu, el castell i la vinya",
        "La torre, la creu, l'espasa i el llibre",
        "El martell, l'enclusa, la roda i la flama"
      ],
      "correct": 0,
      "reference": "Escut i símbols"
    },
    {
      "id": "martorell-cultura-64",
      "text": "Quin timbre corona l'escut oficial de Martorell?",
      "options": [
        "Una corona mural de vila",
        "Una corona comtal",
        "Una corona de marquès",
        "Una corona reial oberta"
      ],
      "correct": 2,
      "reference": "Escut i símbols"
    },
    {
      "id": "martorell-cultura-65",
      "text": "Quan es va aprovar oficialment l'escut de Martorell?",
      "options": [
        "El 23 de març de 1995",
        "El 29 de juny de 1992, publicat al DOGC núm. 1618",
        "El 13 de juliol de 1985",
        "El 10 de maig de 1990"
      ],
      "correct": 1,
      "reference": "Escut i símbols"
    },
    {
      "id": "martorell-cultura-66",
      "text": "Com és la bandera oficial de Martorell?",
      "options": [
        "Apaïsada, de proporcions 2 d'alt per 3 d'ample, amb tres franges verticals iguals verda, blanca i blava, i la torre groga al cantó",
        "Quadrada, blanca amb el martell vermell al centre",
        "Apaïsada, amb dues franges horitzontals verda i blava i l'escut sencer al centre",
        "Apaïsada, amb quatre pals grocs i vermells i la torre blanca al cantó"
      ],
      "correct": 0,
      "reference": "Escut i símbols"
    },
    {
      "id": "martorell-cultura-67",
      "text": "De quin any és, segons l'estudi tècnic, la construcció romana del pont del Diable?",
      "options": [
        "De l'any 100 dC",
        "De l'any 218 aC",
        "De l'any 10 aC",
        "De l'any 50 dC"
      ],
      "correct": 2,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-68",
      "text": "Quin era el nom antic del pont del Diable de Martorell?",
      "options": [
        "Pont de Sant Bartomeu",
        "Pont de Sant Genís",
        "Pont d'Ad Fines",
        "Pont de la Vila"
      ],
      "correct": 0,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-69",
      "text": "Quina llargada tenia el pont romà de Martorell?",
      "options": [
        "43 metres",
        "21 metres",
        "90 metres",
        "130 metres"
      ],
      "correct": 3,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-70",
      "text": "Quantes marques epigràfiques s'han identificat a l'estrep occidental del pont del Diable?",
      "options": [
        "3",
        "17",
        "12",
        "43"
      ],
      "correct": 1,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-71",
      "text": "Quina legió romana ha deixat més marques epigràfiques al pont del Diable?",
      "options": [
        "La legió VI Victrix",
        "La legió X Gemina",
        "La legió VII Gemina",
        "La legió IV Macedònica"
      ],
      "correct": 3,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-72",
      "text": "On es troba actualment l'arc honorífic del conjunt del pont del Diable?",
      "options": [
        "Al centre del pont, sobre el pilar principal",
        "Al marge dret, dins el nucli de la Vila",
        "Dins el terme de Castellví de Rosanes",
        "Al marge esquerre, dins el terme municipal de Castellbisbal"
      ],
      "correct": 3,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-73",
      "text": "Quina singularitat va tenir el pont del Diable fins al segle XIV?",
      "options": [
        "Va ser l'únic pont de tota la vall baixa del Llobregat",
        "Va ser l'únic pont de peatge de Catalunya",
        "Va ser l'únic pont de fusta de la comarca",
        "Va ser l'únic pont amb capella dedicada al Roser"
      ],
      "correct": 0,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-74",
      "text": "Quina reconstrucció del pont del Diable està documentada l'any 1143?",
      "options": [
        "La construcció de l'arc honorífic",
        "L'aixecament de la capella de Sant Bartomeu",
        "L'ampliació del tauler per al pas de carruatges",
        "La reconstrucció després que una riuada s'endugués el pilar central"
      ],
      "correct": 3,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-75",
      "text": "Sota la direcció de qui es va iniciar l'any 1283 l'obra gòtica del pont del Diable?",
      "options": [
        "De Juan Martín Cermeño",
        "De Bernat Sellés",
        "De Camil Pallàs",
        "De Josep Ros i Ros"
      ],
      "correct": 1,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-76",
      "text": "Quina institució té encarregades la gestió i la conservació del pont del Diable?",
      "options": [
        "La Fundació Francesc Pujols",
        "El Museu Municipal Vicenç Ros",
        "El Centre d'Estudis Martorellencs",
        "L'Ateneu de Martorell"
      ],
      "correct": 1,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-77",
      "text": "Quin enginyer militar va dirigir la restauració del pont del Diable de l'any 1768?",
      "options": [
        "Bernat Sellés",
        "Juan Martín Cermeño",
        "Josep Lluís Sert",
        "Camil Pallàs"
      ],
      "correct": 1,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-78",
      "text": "Què va passar amb el pont del Diable el gener de 1939?",
      "options": [
        "Va quedar sepultat per una riuada",
        "Va ser incendiat per la població",
        "L'arc central va ser volat per l'exèrcit republicà en retirada",
        "Va ser desmuntat i traslladat pedra a pedra"
      ],
      "correct": 2,
      "reference": "El pont del diable i el patrimoni romà"
    },
    {
      "id": "martorell-cultura-79",
      "text": "Quin número de protecció com a Bé Cultural d'Interès Nacional té el pont del Diable, i amb quin municipi comparteix la declaració?",
      "options": [
        "1023-MH, compartit amb Abrera",
        "4168-MH, no el comparteix amb ningú",
        "1027-MH, compartit amb Castellví de Rosanes",
        "157-MH, compartit amb Castellbisbal"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-80",
      "text": "On es troba el Seny de les Hores, declarat Bé Cultural d'Interès Nacional?",
      "options": [
        "A la plaça de la Vila, 45",
        "Al carrer de Mur, 63",
        "A l'avinguda de Vicenç Ros, 2",
        "Al carrer de Francesc Santacana, 15"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-81",
      "text": "Quin dels següents elements de Martorell està declarat Bé Cultural d'Interès Nacional (BCIN)?",
      "options": [
        "La Farmàcia Bujons",
        "L'Ateneu de Martorell",
        "La Casa Gralla",
        "El castell de Rosanes del Peiret"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-82",
      "text": "En quins anys es va construir la Torre de les Hores del carrer de Mur, com a casa d'estiueig?",
      "options": [
        "Entre 1834 i 1836",
        "Entre 1928 i 1931",
        "Entre 1965 i 1969",
        "Entre 1888 i 1890"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-83",
      "text": "Quina institució té la seu a la Torre de les Hores des de l'any 1992?",
      "options": [
        "El Centre d'Estudis Martorellencs",
        "El Patronat Municipal de Serveis d'Atenció a les Persones",
        "L'Escola Municipal de Música",
        "La Fundació Francesc Pujols"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-84",
      "text": "Qui va fundar l'any 1876 L'Enrajolada, Casa Museu Santacana?",
      "options": [
        "Vicenç Ros i Batllevell",
        "Francesc Santacana i Campmany",
        "Francesc Santacana i Romeu",
        "Lluís Faraudo de Saint-Germain"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-85",
      "text": "Qui va ampliar L'Enrajolada l'any 1916?",
      "options": [
        "La Diputació de Barcelona",
        "L'Ajuntament de Martorell",
        "El pintor Joaquim Mir",
        "Francesc Santacana i Romeu, net del fundador"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-86",
      "text": "En quin any es va incorporar a L'Enrajolada la col·lecció Faraudo?",
      "options": [
        "El 1916",
        "El 1967",
        "El 1972",
        "El 1982"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-87",
      "text": "Quines característiques té el refugi antiaeri de la plaça de la Vila?",
      "options": [
        "Té 130 metres i es va construir el 1941",
        "És una galeria a cel obert descoberta el 2005",
        "És una estructura subterrània de 35 metres de la Guerra Civil, descoberta el 1990",
        "És una cripta medieval reutilitzada durant la Guerra Civil"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-88",
      "text": "En quin any es va inaugurar el Museu Municipal Vicenç Ros?",
      "options": [
        "El 1876",
        "El 1945",
        "El 1962",
        "El 1972"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-89",
      "text": "Quin edifici ocupa el Museu Municipal Vicenç Ros?",
      "options": [
        "La Casa Par",
        "L'antic convent dels caputxins",
        "L'antiga caserna de cavalleria",
        "L'antiga fàbrica de paper"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-90",
      "text": "Com és el fons ceràmic del Museu Municipal Vicenç Ros?",
      "options": [
        "120 elements arquitectònics",
        "81 peces inventariades",
        "1.500 rajoles i 35 peces",
        "350 peces i prop de 15.000 rajoles"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-91",
      "text": "En quin any va adquirir el Museu Vicenç Ros la col·lecció del pintor Joaquim Mir?",
      "options": [
        "El 1945",
        "El 1972",
        "El 1982",
        "El 1992"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-92",
      "text": "Què va passar l'any 1982 amb el fons numismàtic del Museu Municipal Vicenç Ros?",
      "options": [
        "Es va cedir a la Diputació de Barcelona",
        "Es va traslladar a L'Enrajolada",
        "Es va ampliar amb la col·lecció Faraudo",
        "La major part va desaparèixer en un robatori"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-93",
      "text": "On està ubicat el Museu Muxart, espai d'art contemporani dedicat al pintor Jaume Muxart?",
      "options": [
        "A la Torre de les Hores",
        "A la Casa Par",
        "A l'antic convent dels caputxins",
        "A Cal Nicolau"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-94",
      "text": "A quin monestir va quedar unit el priorat de Sant Genís de Rocafort l'any 1282?",
      "options": [
        "Al monestir de Sant Miquel de Cruïlles",
        "Al monestir de Montserrat",
        "Al monestir de Sant Cugat del Vallès",
        "Al monestir de Poblet"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-95",
      "text": "Què se sap de la capella de Sant Bartomeu de Martorell?",
      "options": [
        "És l'actual seu del Museu Muxart",
        "Es va reconstruir entre 1941 i 1944",
        "Està documentada des de 1208 i fou enderrocada el 1835, durant la Carlinada",
        "És l'única capella romànica conservada íntegra al terme"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-96",
      "text": "Quina entitat gestiona el jaciment de Santa Margarida de Martorell, declarat Bé Cultural d'Interès Local?",
      "options": [
        "El Centre d'Estudis Martorellencs",
        "La Fundació Francesc Pujols",
        "L'Ateneu de Martorell",
        "El Consorci del Patrimoni del Baix Llobregat"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-97",
      "text": "Què representen els dos personatges esgrafiats sobre el balcó de la Casa de la Vila de Martorell?",
      "options": [
        "Els fundadors del priorat de Sant Genís",
        "Els rius Llobregat i Anoia",
        "Els Reis Catòlics",
        "Sant Bartomeu i Sant Antoni Abat"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-98",
      "text": "Qui va projectar l'any 1928 el Cafè del Progrés, en estil noucentista, i quan s'hi va afegir el teatre?",
      "options": [
        "Josep Ros i Ros; el teatre s'hi va afegir el 1931",
        "Josep Lluís Sert; el teatre s'hi va afegir el 1935",
        "Camil Pallàs; el teatre s'hi va afegir el 1941",
        "Bernat Sellés; el teatre s'hi va afegir el 1906"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-99",
      "text": "Quin ús té actualment Cal Nicolau, edifici neoclàssic de 1834 de la plaça de la Vila?",
      "options": [
        "És la seu de la Policia Local",
        "És la biblioteca municipal",
        "És la seu de l'Escola Municipal de Música",
        "És el mercat municipal"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-100",
      "text": "Quina és la singularitat de la Farmàcia Bujons de Martorell?",
      "options": [
        "És l'edifici més antic conservat de la vila",
        "Va ser un establiment actiu entre 1842 i 1957, amb mobiliari modernista, restaurat el 1989 com a equipament cultural",
        "És l'única farmàcia romànica de Catalunya",
        "És la seu del Museu Municipal Vicenç Ros"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-101",
      "text": "Quins dos edificis escolars de Martorell són obra de l'arquitecte Josep Lluís Sert?",
      "options": [
        "L'escola José Echegaray i l'escola Juan Ramón Jiménez",
        "El col·legi La Mercè i l'Institut Pompeu Fabra",
        "L'escola Lola Anglada i l'escola Mercè Rodoreda",
        "El col·legi Els Convents i l'antiga Escola Montserrat"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "martorell-cultura-102",
      "text": "Quin dia se celebra la Festa Major de Martorell?",
      "options": [
        "El 24 d'agost",
        "El 15 d'agost",
        "El 17 de gener",
        "El 25 d'abril"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-103",
      "text": "A quina advocació està dedicada la Festa Major de Martorell?",
      "options": [
        "A Sant Bartomeu",
        "A Sant Antoni Abat",
        "A la Mare de Déu del Roser",
        "A Santa Maria de l'Assumpta (l'Assumpció)"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-104",
      "text": "Què és l'Artesanàlia, element propi de la Festa Major de Martorell?",
      "options": [
        "Un concurs de castells",
        "Un certamen literari",
        "Una mostra d'oficis artesans",
        "Una fira de vins i caves"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-105",
      "text": "Què és el Cercafoc de la Festa Major de Martorell?",
      "options": [
        "Un espectacle pirotècnic de tancament sobre el riu",
        "Un concurs de cuina popular",
        "El passeig de totes les figures festives amb els seus balls",
        "La representació teatral de la llegenda del pont"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-106",
      "text": "Quan se celebren Els Tres Tombs de Martorell?",
      "options": [
        "El primer cap de setmana d'octubre",
        "El darrer cap de setmana d'abril",
        "El dimarts de Carnaval",
        "El diumenge anterior a la festivitat de Sant Antoni Abat (17 de gener)"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-107",
      "text": "Quina és la celebració més antiga de Martorell i de quin any data la seva confraria?",
      "options": [
        "Els Tres Tombs; la confraria es va establir el 1647",
        "La Festa Major; la confraria es va establir el 1422",
        "El Ball de la Quadrilla; la confraria es va establir el 1577",
        "La Festa del Roser; la confraria es va establir el 1686"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-108",
      "text": "De qui és patró Sant Antoni Abat, titular dels Tres Tombs?",
      "options": [
        "Dels pagesos i dels vinyaters",
        "Dels comerciants i firaires",
        "Dels músics i geganters",
        "Dels animals de peu rodó i de les persones que hi treballen"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-109",
      "text": "Quina entitat organitza Els Tres Tombs de Martorell i en quin any es va iniciar?",
      "options": [
        "L'Esbart Dansaire, el 1954",
        "El Centre Cultural i Recreatiu El Progrés, el 1906",
        "Els Amics de Sant Antoni Abat, el 1968",
        "El Centre d'Estudis Martorellencs, el 1972"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-110",
      "text": "Qui va recuperar el Ball de la Quadrilla l'any 1956 i quina entitat l'organitza?",
      "options": [
        "Els Geganters de Martorell; l'organitza el Patronat Municipal",
        "Els Amics de Sant Antoni Abat; l'organitza l'Ateneu",
        "L'Esbart Dansaire; l'organitza El Progrés",
        "El Centre d'Estudis Martorellencs; l'organitza l'Ajuntament"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-111",
      "text": "Quan se celebra la Fira de Primavera de Martorell?",
      "options": [
        "El primer cap de setmana d'octubre",
        "El cap de setmana de Sant Jordi",
        "Per Corpus",
        "El darrer cap de setmana d'abril"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-112",
      "text": "Quin és l'origen històric de la Fira de Primavera de Martorell?",
      "options": [
        "La Fira de Sant Bartomeu, citada el 1282",
        "L'antiga Fira de Sant Marc, nascuda del privilegi reial de 1422",
        "La Fira de Comerç i Indústria, creada el 1988",
        "La Festa del Most, recuperada el 1988"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-113",
      "text": "Què és el Pas Martorell?",
      "options": [
        "Una cursa popular per la serra de les Torretes",
        "Un mercat medieval al barri de la Vila",
        "El recorregut processional dels gegants per Festa Major",
        "Un festival musical d'estiu, amb concerts al pont del Diable i a la piscina d'estiu"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-114",
      "text": "En quin any es va incorporar la Fira de Comerç i Indústria a la Fira de Primavera?",
      "options": [
        "El 1976",
        "El 2011",
        "El 1992",
        "El 1988"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-115",
      "text": "On se celebra tradicionalment l'ou com balla de Corpus a Martorell?",
      "options": [
        "Al claustre del convent dels caputxins",
        "Al jardí de la font del museu de L'Enrajolada",
        "A la plaça de la Vila",
        "Al pont del Diable"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-116",
      "text": "Quan se celebra la Festa del Roser – Vimart de Martorell?",
      "options": [
        "El darrer cap de setmana d'abril",
        "El primer cap de setmana d'agost",
        "El segon cap de setmana de novembre",
        "El primer cap de setmana d'octubre"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-117",
      "text": "Des de quin any s'incorpora el Vimart, fira del vi i el cava, a la Festa del Roser?",
      "options": [
        "Des del 1988",
        "Des del 2011",
        "Des del 1976",
        "Des del 2015"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-118",
      "text": "Quina festa se celebra a Martorell el mes de novembre, amb distribució de moniato i coca?",
      "options": [
        "La festa de la Mare de Déu del Tiscar",
        "La Festa del Most",
        "La Festa del Roser",
        "La Diada de Sant Antoni Abat"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-119",
      "text": "Des de quin any es representen Els Pastorets a Martorell?",
      "options": [
        "Des del 1906",
        "Des del 1931",
        "Des del 1956",
        "Des del 1946"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-120",
      "text": "Quins personatges representen els gegants vells de Martorell, el Ferran i la Isabel?",
      "options": [
        "Els barons de Castellvell",
        "Els rius Anoia i Llobregat",
        "Els Reis Catòlics",
        "Els fundadors de Sant Genís de Rocafort"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-121",
      "text": "Quins són els gegants nous de Martorell, estrenats el 25 d'abril de 1992, i d'on surten?",
      "options": [
        "L'Anoia i el Llobregat, que representen els dos rius",
        "El Diable i la Vella (Velleta), personatges de la llegenda del pont del Diable",
        "El Ferran i la Isabel, que representen els Reis Catòlics",
        "El Secretari Garvil i la seva esposa"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "martorell-cultura-122",
      "text": "Qui va ser Josep Palet i Bartomeu (Martorell, 1877 – Milà, 1946)?",
      "options": [
        "Un tenor de carrera internacional, que debutà al Liceu i, el 1911, a La Scala",
        "Un pintor paisatgista deixeble de Joaquim Mir",
        "L'arquitecte de l'Ateneu de Martorell",
        "Un compositor i organista del segle XIX"
      ],
      "correct": 0,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-123",
      "text": "En quin any va ser proclamat Josep Palet i Bartomeu \"Fill Predilecte de la Vila\"?",
      "options": [
        "El 1946",
        "El 1877",
        "El 1911",
        "El 1970"
      ],
      "correct": 0,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-124",
      "text": "Quins períodes va ser batlle de Martorell Vicenç Ros i Batllevell?",
      "options": [
        "Entre 1924 i 1930, i entre 1940 i 1951",
        "Entre 1931 i 1936, i entre 1939 i 1945",
        "Únicament entre 1945 i 1970",
        "Entre 1906 i 1924"
      ],
      "correct": 0,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-125",
      "text": "Qui va ser Francesc Pujols i Morgades (Barcelona, 1882 – Martorell, 1962)?",
      "options": [
        "L'alcalde que va proclamar la Segona República",
        "Un filòsof i escriptor que va residir a la Torre de les Hores i que dona nom a la biblioteca municipal",
        "El fundador del Museu Municipal de Martorell",
        "L'arquitecte del col·legi Els Convents"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-126",
      "text": "Quin fill il·lustre de Martorell és conegut com el \"patriarca de la música montserratina\"?",
      "options": [
        "Gabriel Manalt",
        "Joan Cererols",
        "Leandre Sunyer i Puigventós",
        "Josep Palet i Bartomeu"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-127",
      "text": "Qui va ser Gabriel Manalt (1657-1687)?",
      "options": [
        "Un tenor",
        "Un organista i compositor",
        "Un arquitecte",
        "Un ceramista"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "martorell-cultura-128",
      "text": "Segons la comunicació oficial de SEAT, quin dia es va inaugurar la fàbrica de SEAT a Martorell?",
      "options": [
        "El 25 de juny de 1986",
        "El 25 d'abril de 1992",
        "El 9 de maig de 2022",
        "El 23 de febrer de 1993"
      ],
      "correct": 3,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-129",
      "text": "Quina superfície ocupa el recinte de SEAT a Martorell?",
      "options": [
        "280.000 m²",
        "2,8 milions de m²",
        "12,76 km²",
        "450.000 m²"
      ],
      "correct": 1,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-130",
      "text": "Quants empleats directes té la planta de SEAT a Martorell?",
      "options": [
        "Més de 12.000",
        "Al voltant de 2.300",
        "Al voltant de 455",
        "Més de 30.000"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-131",
      "text": "A quin ritme surt un vehicle de la línia de producció de SEAT Martorell?",
      "options": [
        "Un cotxe cada 30 segons",
        "Un cotxe cada 30 minuts",
        "Un cotxe cada 5 minuts",
        "Un cotxe cada hora"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-132",
      "text": "Quin percentatge de dones té la plantilla de SEAT Martorell?",
      "options": [
        "L'11%",
        "El 45%",
        "El 21%",
        "El 5%"
      ],
      "correct": 2,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-133",
      "text": "Quina indústria química funciona a Martorell des del 1972, avui sota el nom d'INEOS-Inovyn?",
      "options": [
        "L'antiga Solvay, dedicada al clor, la sosa càustica i el PVC",
        "L'antiga Cerestar, dedicada als midons",
        "L'antiga Fontdevila i Torres, dedicada al tèxtil",
        "L'antiga fàbrica de paper del Congost"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-134",
      "text": "Quin és el producte destacat de Cargill Ibérica SLU, antiga Cerestar Ibérica, a Martorell?",
      "options": [
        "El clorur de vinil",
        "La dextrosa apirògena",
        "El sulfat de coure",
        "El paper d'estrassa"
      ],
      "correct": 1,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-135",
      "text": "Quins són els polígons industrials del terme de Martorell?",
      "options": [
        "La Torre, SEAT, Solvay, Can Bros, Can Cases–Can Sunyol i el Congost",
        "Sant Llorenç, la Torre i Rosanes",
        "El Pla, Camí Fondo i les Bòbiles",
        "Ca n'Oliveres, Santa Llúcia i Can Cases"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-136",
      "text": "Quin sector aporta la major part del PIB de Martorell?",
      "options": [
        "Els serveis",
        "La construcció",
        "La indústria",
        "L'agricultura"
      ],
      "correct": 2,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-137",
      "text": "Què és el Parc Forestal de Can Cases?",
      "options": [
        "Un parc temàtic privat",
        "Una reserva natural de fauna estrictament protegida",
        "Un bosc d'utilitat pública d'interès social i recreatiu reconegut per la Generalitat",
        "Un polígon industrial reconvertit en zona verda"
      ],
      "correct": 2,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-138",
      "text": "Des de quin any l'Hospital Sant Joan de Déu de Martorell ocupa la seva ubicació actual, al barri de Buenos Aires?",
      "options": [
        "Des del 1967",
        "Des del 1862",
        "Des del 1842",
        "Des del 2019"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-139",
      "text": "Què caracteritza l'estació de Martorell Central?",
      "options": [
        "És un intercanviador que reuneix l'estació d'Adif (Rodalies) i l'estació d'FGC",
        "És exclusivament una estació d'FGC",
        "És la terminal de la línia S8 d'FGC",
        "És l'única estació d'alta velocitat del Baix Llobregat"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-140",
      "text": "Quan va passar a denominar-se \"Martorell Central\" l'estació d'Adif que abans es deia simplement \"Martorell\"?",
      "options": [
        "El 21 de maig de 2007",
        "El 9 de maig de 2022",
        "El 20 de juny de 2024",
        "El 23 de febrer de 1993"
      ],
      "correct": 1,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-141",
      "text": "Què caracteritza l'estació de Martorell-Enllaç?",
      "options": [
        "És una estació d'Adif inaugurada el 1859",
        "Està situada dins el terme de Castellbisbal",
        "És una estació prevista de la Línia Orbital Ferroviària",
        "És una estació d'FGC inaugurada el 1912, terminal de la línia S8 i punt de bifurcació cap a Manresa i Igualada"
      ],
      "correct": 3,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-142",
      "text": "Dins de quin terme municipal està situada l'estació d'FGC anomenada \"Martorell Vila\"?",
      "options": [
        "Dins el terme de Castellbisbal",
        "Dins el terme de Martorell",
        "Dins el terme de Sant Andreu de la Barca",
        "Dins el terme de Castellví de Rosanes"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-143",
      "text": "Quines dues vies d'alta capacitat travessen el terme municipal de Martorell?",
      "options": [
        "L'AP-2 i la B-224",
        "La C-32 i la C-15",
        "L'autovia A-2 i l'autopista AP-7",
        "L'A-2 i l'AP-2"
      ],
      "correct": 2,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-144",
      "text": "Quan es va inaugurar l'actual Biblioteca de Martorell \"Francesc Pujols\"?",
      "options": [
        "El 28 de març de 2015",
        "El 21 de maig de 2007",
        "El 20 de juny de 2024",
        "El 13 d'abril de 2021"
      ],
      "correct": 0,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-145",
      "text": "Amb quines dues poblacions està agermanat Martorell?",
      "options": [
        "Amb Borgo a Mozzano (Itàlia) i Aranjuez (Espanya)",
        "Amb Chevilly-Larue (França) i Sabadell (Catalunya)",
        "Amb Milà (Itàlia) i Chevilly-Larue (França)",
        "Amb Chevilly-Larue (França) i Borgo a Mozzano (Itàlia)"
      ],
      "correct": 3,
      "reference": "Economia, seat, polígons, transport i equipaments"
    },
    {
      "id": "martorell-cultura-146",
      "text": "Qui és l'alcalde de Martorell?",
      "options": [
        "Xavier Fonollosa i Comas",
        "Salvador Esteve i Figueras",
        "Lluís Amat Ferrer",
        "Dora Ramon i Cabot"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "martorell-cultura-147",
      "text": "Des de quin any és alcalde de Martorell Xavier Fonollosa i Comas?",
      "options": [
        "Des del 2015, amb tres mandats consecutius (2015, 2019 i 2023)",
        "Des del 2007",
        "Des del 2019",
        "Des del 2003"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "martorell-cultura-148",
      "text": "Quins períodes va ser alcalde de Martorell Salvador Esteve i Figueras?",
      "options": [
        "Entre 2003 i 2007",
        "Entre 1979 i 1987",
        "Entre 1987 i 2003, i entre 2007 i 2015",
        "Entre 1991 i 2015, sense interrupció"
      ],
      "correct": 2,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "martorell-cultura-149",
      "text": "Quants regidors integren el Ple de l'Ajuntament de Martorell?",
      "options": [
        "17",
        "21",
        "25",
        "13"
      ],
      "correct": 1,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "martorell-cultura-150",
      "text": "Quina és la composició del Ple de Martorell del mandat 2023-2027?",
      "options": [
        "Junts 12, PSC 4, Movem 4, ERC 1",
        "Junts 8, PSC 4, Movem 4, ERC 3, PP 1, SOM 1",
        "Junts 16, Movem Martorell 2, PSC 2 i ERC 1",
        "Junts 16, PSC 3, Movem 1, ERC 1"
      ],
      "correct": 2,
      "reference": "Alcaldia i ple municipal"
    }
  ]
};

export default martorellCultura;
