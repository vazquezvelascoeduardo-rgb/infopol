// Test específic Sitges — coneixement del municipi.
// 150 preguntes de cultura de la ciutat per a Agent de Policia Local de Sitges.
import type { TestTopic } from './types';

const sitgesCultura: TestTopic = {
  "slug": "sitges-cultura",
  "title": "Sitges · Cultura de la ciutat",
  "description": "geografia, història, patrimoni, festes i institucions de Sitges",
  "icon": "🏘️",
  "accent": "from-teal-500 to-emerald-600",
  "category": "municipi",
  "municipi": "Sitges",
  "questions": [
    {
      "id": "sitges-cultura-1",
      "text": "A quina comarca pertany el municipi de Sitges?",
      "options": [
        "Al Baix Penedès",
        "A l'Alt Penedès",
        "Al Baix Llobregat",
        "Al Garraf"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-2",
      "text": "A quina província pertany el municipi de Sitges?",
      "options": [
        "A la de Girona",
        "A la de Lleida",
        "A la de Tarragona",
        "A la de Barcelona"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-3",
      "text": "Quin és el gentilici dels habitants de Sitges?",
      "options": [
        "Sitgetà, sitgetana",
        "Garrafenc, garrafenca",
        "Suburenc, suburenca",
        "Sitgesà, sitgesana"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-4",
      "text": "Amb quin sobrenom tradicional es coneix la vila de Sitges?",
      "options": [
        "La Perla del Garraf",
        "La Blanca Subur",
        "La Vila dels Indians",
        "La Blanca Fragata"
      ],
      "correct": 1,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-5",
      "text": "Quin és el codi INE del municipi de Sitges?",
      "options": [
        "08270",
        "08268",
        "08307",
        "08810"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-6",
      "text": "Quin codi postal correspon al nucli de Garraf?",
      "options": [
        "08810",
        "08872",
        "08871",
        "08870"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-7",
      "text": "A quina altitud sobre el nivell del mar se situa el nucli de Sitges?",
      "options": [
        "48 metres",
        "2 metres",
        "10 metres",
        "25 metres"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-8",
      "text": "Quin dels municipis següents limita amb el terme municipal de Sitges?",
      "options": [
        "Canyelles",
        "Sant Sadurní d'Anoia",
        "Cubelles",
        "Olivella"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-9",
      "text": "Quina longitud té el front marítim del terme municipal de Sitges?",
      "options": [
        "16,5 quilòmetres",
        "21,5 quilòmetres",
        "12 quilòmetres",
        "8,5 quilòmetres"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-10",
      "text": "Quina altitud té el Puig Sabataire, un dels cims del terme de Sitges?",
      "options": [
        "465 metres",
        "426 metres",
        "512 metres",
        "308 metres"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-11",
      "text": "Quins són els tres nuclis de població que recull el padró municipal de Sitges?",
      "options": [
        "Sitges, les Botigues i Campdàsens",
        "Sitges, Vallcarca i Miralpeix",
        "Sitges, les Botigues i Garraf",
        "Sitges, Garraf i Vallcarca"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-12",
      "text": "Quina riera desemboca a l'extrem de ponent de la platja de Sitges, a la zona de Terramar?",
      "options": [
        "La riera de Vallbona",
        "La riera de Vallcarca",
        "La riera de Ribes",
        "El torrent d'Aiguadolç"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-13",
      "text": "L'antic torrent de la Bassa Rodona correspon avui a quin carrer de Sitges?",
      "options": [
        "Al carrer de Rafael Llopart",
        "Al carrer de Sant Gaudenci",
        "Al carrer de les Parellades",
        "Al carrer d'Espanya"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-14",
      "text": "L'antic torrent de Sant Damià correspon avui a quin carrer de Sitges?",
      "options": [
        "Al carrer de Rafael Llopart",
        "Al carrer de Sant Francesc",
        "Al carrer del Bonaire",
        "Al carrer Major"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-15",
      "text": "Què és la Falconera?",
      "options": [
        "Un penya-segat amb una cova semisubmarina i una deu submarina molt cabalosa",
        "Un avenc de grans dimensions situat prop de la Plana Novella",
        "Un cim del massís del Garraf situat al límit amb el terme de Begues",
        "Una cala del nucli de Garraf amb un petit port pesquer tradicional"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-16",
      "text": "En quins anys es projectà la ciutat-jardí de Terramar?",
      "options": [
        "El 1928-1929",
        "El 1908-1909",
        "El 1918-1919",
        "El 1898-1899"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-17",
      "text": "Quines urbanitzacions hi ha al nucli de les Botigues de Sitges?",
      "options": [
        "Llevantina, Aiguadolç i Can Girona",
        "Garraf II, el Passeig Marítim i Rat Penat",
        "Vallpineda, Quintmar i Montgavina",
        "Terramar, el Vinyet i Santa Bàrbara"
      ],
      "correct": 1,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-18",
      "text": "En quina competició ciclista fou catalogat de primera categoria el port de Rat Penat, el 7 de setembre de 2010?",
      "options": [
        "Al Giro d'Itàlia",
        "Al Tour de França",
        "A la Volta a Espanya",
        "A la Volta a Catalunya"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-19",
      "text": "Quants portals tenia la muralla nova de Sitges, del segle XVII?",
      "options": [
        "Quatre",
        "Sis",
        "Tres",
        "Vuit"
      ],
      "correct": 1,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "sitges-cultura-20",
      "text": "Segons el padró continu actualitzat el 31 de juliol de 2026, quants habitants tenia el municipi de Sitges?",
      "options": [
        "33.120 habitants",
        "34.829 habitants",
        "36.204 habitants",
        "31.694 habitants"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-21",
      "text": "Quants habitants tenia el nucli de les Botigues de Sitges segons el padró de 31 de juliol de 2026?",
      "options": [
        "3.480 habitants",
        "2.590 habitants",
        "545 habitants",
        "1.230 habitants"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-22",
      "text": "Quants habitants tenia el nucli de Garraf segons el padró de 31 de juliol de 2026?",
      "options": [
        "1.045 habitants",
        "2.590 habitants",
        "245 habitants",
        "545 habitants"
      ],
      "correct": 3,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-23",
      "text": "Quin percentatge de població de nacionalitat estrangera tenia Sitges el 2025?",
      "options": [
        "Al voltant del 27,5%",
        "Al voltant del 41,0%",
        "Al voltant del 18,0%",
        "Al voltant del 12,5%"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-24",
      "text": "Quantes persones nascudes a l'estranger residien a Sitges el 2025?",
      "options": [
        "11.429",
        "17.450",
        "8.979",
        "3.811"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-25",
      "text": "Quantes persones addicionals aportava la població estacional (ETCA) a Sitges el 2024?",
      "options": [
        "5.080",
        "1.200",
        "9.640",
        "12.300"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-26",
      "text": "Quants naixements es van registrar a Sitges el 2025?",
      "options": [
        "341",
        "256",
        "96",
        "188"
      ],
      "correct": 3,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-27",
      "text": "Quantes llars unipersonals hi havia a Sitges segons el cens del 2021?",
      "options": [
        "4.080",
        "12.861",
        "6.430",
        "1.860"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-28",
      "text": "Quants focs tenia el conjunt del terme de Sitges segons el fogatjament de 1365-1370?",
      "options": [
        "1.606 focs",
        "196 focs",
        "57 focs",
        "320 focs"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "sitges-cultura-29",
      "text": "A quina cova del terme de Sitges es van trobar una mandíbula i una falange de neandertal datades en 53.000 anys?",
      "options": [
        "A la cova de Sant Llorenç",
        "A la cova de la Falconera",
        "A la cova del Gegant",
        "A la Cova Verda"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-30",
      "text": "En quines coves del terme de Sitges s'han documentat vasos campaniformes?",
      "options": [
        "A la cova del Gegant i a la cova dels Corrals",
        "A la cova de la Falconera i a la Cova Verda",
        "A la cova del Gegant i a la Cova Verda",
        "A la Cova Verda i a la cova de Sant Llorenç"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-31",
      "text": "D'on prové el topònim de Sitges?",
      "options": [
        "D'un antic cognom senyorial d'origen franc",
        "Dels dipòsits excavats per emmagatzemar-hi gra",
        "D'una paraula àrab que designa un port natural",
        "Del nom llatí de la ciutat romana de Súbur"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-32",
      "text": "De quin any és el primer esment documental del castell de Sitges?",
      "options": [
        "Del 1135",
        "Del 1303",
        "Del 1240",
        "Del 1041"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-33",
      "text": "Qui infeudà el castell de Sitges a Mir Geribert l'any 1041?",
      "options": [
        "L'abat del monestir de Sant Cugat",
        "El bisbe de Barcelona Guislabert",
        "El comte Ramon Berenguer I",
        "El bisbe de Vic Oliba"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-34",
      "text": "On s'aixecava el castell de Sitges?",
      "options": [
        "A l'extrem occidental del terme, damunt de Can Girona",
        "Al turó on hi ha el santuari del Vinyet",
        "Al capdamunt de la platja del nucli de Garraf",
        "Al puig de la Vila Vella, on avui hi ha l'Ajuntament"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-35",
      "text": "En quin any fou enderrocat el castell de Sitges?",
      "options": [
        "El 1888",
        "El 1869",
        "El 1649",
        "El 1903"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-36",
      "text": "Bernat de Fonollar era cavaller de la cort de quin monarca?",
      "options": [
        "De Pere III",
        "D'Alfons IV",
        "De Jaume I",
        "De Jaume II"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-37",
      "text": "A qui deixà Bernat de Fonollar la castlania de Sitges en el testament del 1326?",
      "options": [
        "Al monestir de Montserrat",
        "Al monestir de Poblet",
        "A l'orde del Temple",
        "A la Pia Almoina de Barcelona"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-38",
      "text": "Des de quin any Sitges féu de port de sortida del Penedès, arran de la petició de Vilafranca?",
      "options": [
        "Des del 1445",
        "Des del 1545",
        "Des del 1345",
        "Des del 1245"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-39",
      "text": "En quin conflicte bèl·lic Sitges resistí, el 1649, un atac castellà per terra i per mar?",
      "options": [
        "A la Guerra del Francès",
        "A la Guerra dels Segadors",
        "A la Primera Guerra Carlina",
        "A la Guerra de Successió"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-40",
      "text": "Quin carrer de Sitges recorda l'atac carlí de l'1 de maig de 1838?",
      "options": [
        "El carrer de Sant Bartomeu",
        "El carrer del Bonaire",
        "El carrer 1r de Maig",
        "El carrer Nou"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-41",
      "text": "Segons les dades del 1833, quin percentatge dels catalans que comerciaven amb Amèrica eren sitgetans?",
      "options": [
        "Al voltant del 10%",
        "Més del 27%",
        "Menys del 5%",
        "Més del 50%"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-42",
      "text": "Segons la tradició, d'on prové el nom de la malvasia de Sitges?",
      "options": [
        "Del port italià d'Amalfi",
        "Del port de Monembasia, al Peloponès",
        "De l'illa grega de Quios",
        "De la ciutat siciliana de Marsala"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-43",
      "text": "En quin any arribà el ferrocarril a Sitges?",
      "options": [
        "El 1901",
        "El 1881",
        "El 1892",
        "El 1863"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-44",
      "text": "Qui impulsà la línia de ferrocarril que arribà a Sitges el 1881?",
      "options": [
        "Francesc Gumà i Ferran",
        "Francesc Berenguer i Mestres",
        "Eusebi Güell i Bacigalupi",
        "Salvador Casacuberta"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-45",
      "text": "Què esdevingué la fàbrica de ciment de Vallcarca l'any 1933?",
      "options": [
        "La fàbrica més gran del Baix Llobregat",
        "La primera cimentera d'Europa",
        "La primera fàbrica de ciment de l'Estat espanyol",
        "La primera fàbrica de vidre de Catalunya"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-46",
      "text": "En quin any es fundà el Foment Sitgetà, pioner de la promoció turística?",
      "options": [
        "El 1901",
        "El 1916",
        "El 1925",
        "El 1886"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-47",
      "text": "Quin fou el primer gran hotel de Sitges, obert el 1916?",
      "options": [
        "L'Hotel Romàntic",
        "L'Hotel Subur",
        "L'Hotel Meliá Sitges",
        "El Gran Hotel Terramar"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-48",
      "text": "En quin any arribà Santiago Rusiñol per primer cop a Sitges?",
      "options": [
        "El 1894",
        "El 1899",
        "El 1891",
        "El 1885"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-49",
      "text": "Quantes edicions van tenir les Festes Modernistes de Sitges?",
      "options": [
        "Set, entre el 1892 i el 1902",
        "Cinc, entre el 1892 i el 1899",
        "Tres, entre el 1892 i el 1897",
        "Nou, entre el 1890 i el 1899"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-50",
      "text": "A quina de les Festes Modernistes es traslladaren en processó els dos quadres del Greco fins al Cau Ferrat?",
      "options": [
        "A la segona, el 1893",
        "A la tercera, el 1894",
        "A la primera, el 1892",
        "A la cinquena, el 1899"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "sitges-cultura-51",
      "text": "Quines figures apareixen a l'escut oficial de Sitges?",
      "options": [
        "Una nau d'or navegant sobre ones d'argent i atzur",
        "Tres torres d'argent obertes sobre un camper de gules",
        "Un castell obert d'or sobremuntat d'una creu grega patent d'argent",
        "Un margalló d'or acompanyat de quatre pals de gules"
      ],
      "correct": 2,
      "reference": "Escut i símbols"
    },
    {
      "id": "sitges-cultura-52",
      "text": "De quin color és el camp de l'escut de Sitges?",
      "options": [
        "D'argent",
        "De sinople",
        "D'atzur",
        "De gules"
      ],
      "correct": 3,
      "reference": "Escut i símbols"
    },
    {
      "id": "sitges-cultura-53",
      "text": "Quin timbre corona l'escut oficial de Sitges?",
      "options": [
        "Una corona comtal",
        "Una corona reial oberta",
        "Una corona mural de ciutat",
        "Una corona mural de vila"
      ],
      "correct": 3,
      "reference": "Escut i símbols"
    },
    {
      "id": "sitges-cultura-54",
      "text": "Quan fou aprovat oficialment l'escut heràldic de Sitges?",
      "options": [
        "El 2 de desembre de 1984",
        "El 27 de desembre de 1994",
        "El 2 de desembre de 2004",
        "El 12 de febrer de 2010"
      ],
      "correct": 2,
      "reference": "Escut i símbols"
    },
    {
      "id": "sitges-cultura-55",
      "text": "Quin estil i quina època té l'església parroquial de Sant Bartomeu i Santa Tecla?",
      "options": [
        "Barroca, del segle XVII",
        "Gòtica, del segle XIV",
        "Romànica, del segle XII",
        "Neoclàssica, del segle XVIII"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-56",
      "text": "Quan fou beneïda l'església parroquial de Sant Bartomeu i Santa Tecla?",
      "options": [
        "El 15 d'agost de 1690",
        "El 24 d'agost de 1665",
        "El 18 de juliol de 1672",
        "El 23 de setembre de 1681"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-57",
      "text": "De qui és el retaule renaixentista del 1499 de l'església parroquial de Sitges?",
      "options": [
        "Del pintor Pere Serra",
        "Del pintor Lluís Borrassà",
        "Del pintor napolità Nicolau de Credença",
        "Del pintor Jaume Forner"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-58",
      "text": "Per encàrrec de qui pintà Darius Vilàs la capella del Santíssim i el presbiteri de la parroquial?",
      "options": [
        "De Charles Deering",
        "De Miquel Utrillo",
        "De Manuel Llopis i de Casades",
        "De Santiago Rusiñol"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-59",
      "text": "Qui són els patrons de la vila de Sitges?",
      "options": [
        "Sant Bartomeu i sant Joan Baptista",
        "Sant Joan Baptista i santa Margarida",
        "Sant Bartomeu i Santa Tecla",
        "Sant Sebastià i Santa Tecla"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-60",
      "text": "Què era originàriament l'edifici del Museu del Cau Ferrat?",
      "options": [
        "Un casal neoclàssic de la família Llopis",
        "La casa-taller de Santiago Rusiñol",
        "L'antic mercat del peix de la vila",
        "L'antic hospital de Sant Joan Baptista"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-61",
      "text": "Amb quin material es van fer bona part de les obres del Cau Ferrat?",
      "options": [
        "Amb marbre portat del Camp de Tarragona",
        "Amb pedres del vell castell enderrocat",
        "Amb totxo vist de la fàbrica Batlló",
        "Amb pedra de la pedrera de la Falconera"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-62",
      "text": "En quin any Santiago Rusiñol llegà el Cau Ferrat a la vila de Sitges?",
      "options": [
        "El 1894",
        "El 1910",
        "El 1945",
        "El 1931"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-63",
      "text": "Quines obres excepcionals de pintura antiga conserva el Museu del Cau Ferrat?",
      "options": [
        "Dos quadres del Greco",
        "Un tríptic de Rubens",
        "Dos retrats de Goya",
        "Tres taules de Velázquez"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-64",
      "text": "De quin gran museu és secció el Museu del Cau Ferrat?",
      "options": [
        "Del Museu d'Història de Catalunya",
        "Del Museu Nacional d'Art de Catalunya",
        "Del Museu Picasso de Barcelona",
        "Del Museu Frederic Marès"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-65",
      "text": "Quin edifici adquirí Charles Deering el 1910 per convertir-lo en residència?",
      "options": [
        "L'edifici del Mercat Vell, a la plaça de l'Ajuntament",
        "L'antic Hospital de Sant Joan Baptista",
        "El casal de Can Falç, al passeig de la Ribera",
        "El Palau del Rei Moro, al carrer d'en Bosch"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-66",
      "text": "A qui encarregà Charles Deering la construcció del conjunt de Maricel?",
      "options": [
        "A Gaietà Buïgas i Monravà",
        "A Francesc Rogent i Pedrosa",
        "A Miquel Utrillo i Morlius",
        "A Salvador Vinyals i Sabaté"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-67",
      "text": "Quin estil arquitectònic té el Palau de Maricel?",
      "options": [
        "Noucentista",
        "Neomudèjar",
        "Neogòtic",
        "Modernista"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-68",
      "text": "Quin element destaca al Saló d'Or del Palau de Maricel?",
      "options": [
        "Un artesonat mudèjar del segle XV",
        "Una xemeneia monumental d'alabastre blanc",
        "Una vidriera atribuïda a Lluís Rigalt",
        "Un mosaic romà procedent de Súbur"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-69",
      "text": "Qui és l'autor dels capitells del conjunt de Maricel?",
      "options": [
        "L'escultor Manolo Hugué",
        "L'escultor Enric Clarasó",
        "L'escultor Josep Llimona",
        "L'escultor Pere Jou"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-70",
      "text": "Què passà amb la col·lecció artística de Charles Deering el setembre de 1921?",
      "options": [
        "La donà a la vila de Sitges",
        "La traslladà al Museu del Cau Ferrat",
        "La vengué a la Diputació de Barcelona",
        "Se l'endugué als Estats Units"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-71",
      "text": "Amb quina col·lecció es creà el Museu de Maricel l'any 1970?",
      "options": [
        "Amb la de Lola Anglada",
        "Amb la de Manuel Llopis i de Casades",
        "Amb la del doctor Jesús Pérez Rosales",
        "Amb la de Charles Deering"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-72",
      "text": "De qui són els sis plafons del Museu de Maricel al·legòrics de la Primera Guerra Mundial?",
      "options": [
        "De Pere Pruna",
        "De Josep Maria Sert",
        "De Darius Vilàs",
        "D'Arcadi Mas i Fondevila"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-73",
      "text": "En quin any es construí el casal neoclàssic que avui acull el Museu Romàntic Can Llopis?",
      "options": [
        "El 1793",
        "El 1890",
        "El 1849",
        "El 1672"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-74",
      "text": "Quantes peces té la col·lecció de nines de Lola Anglada que es conserva al Museu Romàntic?",
      "options": [
        "Més de 1.300",
        "Unes 700",
        "Unes 250",
        "Més de 3.000"
      ],
      "correct": 0,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-75",
      "text": "Qui signà, el 1889, els plànols del Mercat Vell de Sitges?",
      "options": [
        "L'arquitecte Josep M. Martino",
        "L'arquitecte municipal Gaietà Buïgas i Monravà",
        "L'arquitecte Francesc Berenguer i Mestres",
        "L'arquitecte Salvador Vinyals i Sabaté"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-76",
      "text": "Quan s'inaugurà el Mercat Vell de Sitges?",
      "options": [
        "El 24 d'agost de 1889",
        "El 15 d'agost de 1890",
        "El 15 d'agost de 1900",
        "El 23 de setembre de 1886"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-77",
      "text": "Qui fou l'arquitecte de la Casa de la Vila de Sitges, bastida el 1888-1889?",
      "options": [
        "Gaietà Buïgas",
        "Francesc Rogent",
        "Salvador Vinyals",
        "Miquel Utrillo"
      ],
      "correct": 2,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-78",
      "text": "Quina època i quin estil té el Palau del Rei Moro?",
      "options": [
        "Romànic, del segle XI",
        "Barroc, del segle XVII",
        "Renaixentista, del segle XVI",
        "Gòtic, d'origen medieval, del segle XIV"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-79",
      "text": "Des de quin any està documentat el santuari de la Mare de Déu del Vinyet?",
      "options": [
        "Des del 1727",
        "Des del 1174",
        "Des del 1552",
        "Des del 1322"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-80",
      "text": "De què és patrona la Mare de Déu del Vinyet?",
      "options": [
        "Dels pescadors de Sitges",
        "De l'Arxiprestat del Garraf",
        "Dels vinaters del Penedès",
        "De la Diòcesi de Sant Feliu de Llobregat"
      ],
      "correct": 1,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-81",
      "text": "Quants béns culturals d'interès nacional (BCIN) hi ha declarats al terme de Sitges?",
      "options": [
        "Quatre",
        "Vint-i-cinc",
        "Set",
        "Deu"
      ],
      "correct": 3,
      "reference": "Patrimoni, museus i monuments"
    },
    {
      "id": "sitges-cultura-82",
      "text": "Quin dia se celebra la Festa Major de Sitges, dedicada al patró sant Bartomeu?",
      "options": [
        "El 5 d'agost",
        "El 24 d'agost",
        "El 23 de setembre",
        "El 15 d'agost"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-83",
      "text": "Quins són els dos dies principals de la Festa Major de Sitges, coneguts com «les 36 hores»?",
      "options": [
        "El 23 i el 24 d'agost",
        "El 21 i el 22 d'agost",
        "El 22 i el 23 d'agost",
        "El 24 i el 25 d'agost"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-84",
      "text": "En quin any la Generalitat declarà la Festa Major de Sitges Festa Tradicional d'Interès Nacional?",
      "options": [
        "El 2006",
        "El 1985",
        "El 1991",
        "El 1965"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-85",
      "text": "Quin dia de la Festa Major té lloc el Lliurament de la Bandera?",
      "options": [
        "El 24 d'agost",
        "El 21 d'agost",
        "El 23 d'agost",
        "El 22 d'agost"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-86",
      "text": "A quina hora del 23 d'agost té lloc l'Entrada de Gralles de la Festa Major?",
      "options": [
        "A les 12 del migdia",
        "A les 11 de la nit",
        "A les 6 del matí",
        "A les 2 de la tarda"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-87",
      "text": "Quants morterets es disparen a la Sortida de les Dues, el 23 d'agost?",
      "options": [
        "21 morterets",
        "24 morterets",
        "36 morterets",
        "12 morterets"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-88",
      "text": "On es dispara el Castell de Foc de la Festa Major, el 23 d'agost a les 23 hores?",
      "options": [
        "A Baix a Mar",
        "Al Cap de la Vila",
        "A la plaça de l'Ajuntament",
        "Al port d'Aiguadolç"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-89",
      "text": "Què caracteritza la Matinal del 24 d'agost, a les 6 del matí?",
      "options": [
        "Es reparteix xató i malvasia a tots els assistents al Cap de la Vila",
        "Hi surten breaks carregats de flors que s'ofereixen a les sitgetanes",
        "Es fa una baixada de torxes des del santuari del Vinyet fins al mar",
        "Es dispara una traca de morterets des de les escales de la Punta"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-90",
      "text": "Qui és l'autor de la sardana «La Processó de Sant Bartomeu», interpretada cada any al Cap de la Vila?",
      "options": [
        "Enric Morera i Viura",
        "Joaquim Nin i Castellanos",
        "Blai Fontanals i Argenter",
        "Antoni Català i Vidal"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-91",
      "text": "De quin any és la primera referència documental del Ball de Diables de Sitges?",
      "options": [
        "Del 1612",
        "Del 1897",
        "Del 1814",
        "Del 1853"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-92",
      "text": "Per quants balladors està formada la Moixiganga de Sitges?",
      "options": [
        "Per 21 balladors",
        "Per 10 balladors",
        "Per 15 balladors",
        "Per 12 balladors"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-93",
      "text": "Quina posició ocupa la Moixiganga dins del seguici de balls populars de Sitges?",
      "options": [
        "Obre sempre el seguici, davant dels gegants",
        "Va immediatament darrere del Ball de Diables",
        "Va entre els cabeçuts i el Ball de Bastons",
        "Tanca sempre el seguici, just davant del Sant"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-94",
      "text": "Com arribà a Sitges el Drac, conegut com «la Fera Foguera», el 23 d'agost de 1922?",
      "options": [
        "En vaixell",
        "A coll dels portants",
        "En tren",
        "En carruatge"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-95",
      "text": "Quins són els noms dels Gegants Vells de la Vila, estrenats el 1897?",
      "options": [
        "Jaume i Violant",
        "Facund i Maria",
        "Sebastià i Margarida",
        "Bartomeu i Tecla"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-96",
      "text": "Qui dissenyà els Gegants Vells de la Vila de Sitges?",
      "options": [
        "Pere Jou",
        "Agustí Ferrer i Pino",
        "Lluís Labarta",
        "Nicolau Ortiz"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-97",
      "text": "En quin any s'estrenaren els Gegants Americanos, també anomenats Cubanos?",
      "options": [
        "El 1965",
        "El 1979",
        "El 1922",
        "El 1945"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-98",
      "text": "De quin any és la primera referència a la presència de gegants a Sitges?",
      "options": [
        "Del 1758",
        "Del 1897",
        "Del 1853",
        "Del 1814"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-99",
      "text": "En quina data s'incorporà l'Àliga al seguici de Sitges?",
      "options": [
        "El 23 de setembre de 1965",
        "El 5 d'agost de 1984",
        "El 24 d'agost de 1922",
        "El 5 d'agost de 1945"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-100",
      "text": "Quin dia se celebra la festa de Santa Tecla, coneguda com la Festa Major Petita?",
      "options": [
        "El 23 d'agost",
        "El 24 d'agost",
        "El 23 de setembre",
        "El 5 d'agost"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-101",
      "text": "Quins dies emmarquen el Carnaval de Sitges?",
      "options": [
        "Del Dijous Gras al Dimecres de Cendra",
        "Del Dijous Gras al Diumenge de Carnaval",
        "Del Dimecres de Cendra al Dilluns de Pasqua",
        "Del Dimarts de Carnaval al Diumenge de Rams"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-102",
      "text": "Quina nit del Carnaval de Sitges se celebra la Rua de l'Extermini?",
      "options": [
        "La nit del divendres",
        "La nit del diumenge",
        "La nit del dissabte",
        "La nit del dimarts"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-103",
      "text": "Quina nit del Carnaval de Sitges se celebra la Rua de la Disbauxa?",
      "options": [
        "La nit del dijous",
        "La nit del dilluns",
        "La nit del dimarts",
        "La nit del diumenge"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-104",
      "text": "Quin és el lema del Carnaval de Sitges?",
      "options": [
        "«Sitges, la festa no s'atura!»",
        "«Per Carnaval tot s'hi val!»",
        "«Carnaval, rei del temporal!»",
        "«Qui no riu per Carnaval, no riu mai!»"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-105",
      "text": "De quin any és el primer document que acredita la celebració del Corpus a Sitges?",
      "options": [
        "Del 1264",
        "Del 1358",
        "Del 1635",
        "Del 1478"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-106",
      "text": "En quin any se celebrà la primera Exposició Nacional de Clavells de Sitges, amb l'assessorament de Miquel Utrillo?",
      "options": [
        "El 1965",
        "El 1890",
        "El 1918",
        "El 1951"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-107",
      "text": "En quin any el Corpus de Sitges fou declarat Festa Patrimonial d'Interès Nacional?",
      "options": [
        "El 1952",
        "El 2010",
        "El 2023",
        "El 1965"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-108",
      "text": "Quina entitat organitza la Festa de la Verema de Sitges?",
      "options": [
        "El Grup d'Estudis Sitgetans",
        "La Societat Recreativa El Retiro",
        "L'Agrupació de Balls Populars de Sitges",
        "El Foment de Sitges"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "sitges-cultura-109",
      "text": "Quin és el nom oficial actual del festival de cinema de Sitges?",
      "options": [
        "Sitges – Setmana Internacional de Cinema Fantàstic i de Terror",
        "Sitges – Festival Internacional de Cinema de Catalunya",
        "Sitges – Festival Internacional de Cinema Fantàstic de Catalunya",
        "Sitges – Mostra Internacional de Cinema Fantàstic del Garraf"
      ],
      "correct": 2,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-110",
      "text": "En quin any se celebrà la primera edició del festival de cinema de Sitges?",
      "options": [
        "El 1957",
        "El 1975",
        "El 1968",
        "El 1982"
      ],
      "correct": 2,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-111",
      "text": "Amb quin nom se celebrà la primera edició del festival de cinema de Sitges?",
      "options": [
        "I Setmana Internacional de Cinema Fantàstic",
        "I Mostra de Cinema de Terror de Sitges",
        "I Certamen Internacional de Cinema Insòlit",
        "I Festival de Cinema Fantàstic de Catalunya"
      ],
      "correct": 0,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-112",
      "text": "Quina edició del festival de cinema de Sitges es programa per als dies 8 a 18 d'octubre de 2026?",
      "options": [
        "La 62a",
        "La 59a",
        "La 54a",
        "La 49a"
      ],
      "correct": 1,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-113",
      "text": "Quina característica singular té el festival de cinema de Sitges en l'àmbit mundial?",
      "options": [
        "És l'únic festival del món dedicat al cinema mut",
        "És el festival amb més seccions competitives del món",
        "És el festival de cinema més antic d'Europa",
        "És el primer festival del món dedicat al cinema fantàstic"
      ],
      "correct": 3,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-114",
      "text": "Quin equipament acull la seu principal del festival de cinema de Sitges?",
      "options": [
        "L'Hotel Meliá Sitges",
        "El Cinema El Retiro",
        "El Centre Cultural Joan Maragall",
        "El Casino Prado Suburense"
      ],
      "correct": 0,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-115",
      "text": "Quin dia se celebra el Ral·li Internacional de cotxes d'època Barcelona-Sitges?",
      "options": [
        "El darrer diumenge de gener",
        "El primer dissabte de maig",
        "El primer diumenge de març",
        "El darrer diumenge d'octubre"
      ],
      "correct": 2,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-116",
      "text": "Quins vehicles poden participar al Ral·li Internacional de cotxes d'època Barcelona-Sitges?",
      "options": [
        "Únicament cotxes fabricats entre el 1928 i el 1950",
        "Cotxes anteriors al 1950 i motocicletes anteriors al 1960",
        "Cotxes anteriors al 1928 i motocicletes anteriors al 1935",
        "Cotxes anteriors al 1908 i motocicletes anteriors al 1915"
      ],
      "correct": 2,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-117",
      "text": "Quin és el vehicle més emblemàtic del Ral·li Barcelona-Sitges, propietat de l'Ajuntament de Barcelona?",
      "options": [
        "«La Sitgetana», un Hispano-Suiza del 1912",
        "«La Fera», un Ford T del 1920",
        "«La Blanca», un Citroën del 1925",
        "«La Genoveva», un Renault del 1908"
      ],
      "correct": 3,
      "reference": "Festival de cinema, ral·li i grans esdeveniments"
    },
    {
      "id": "sitges-cultura-118",
      "text": "On va néixer Santiago Rusiñol i Prats?",
      "options": [
        "A Manlleu",
        "A Aranjuez",
        "A Barcelona",
        "A Sitges"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-119",
      "text": "On va morir Santiago Rusiñol, el 13 de juny de 1931?",
      "options": [
        "A Barcelona",
        "A Aranjuez",
        "A Sitges",
        "A París"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-120",
      "text": "Quina relació té Miquel Utrillo i Morlius amb Sitges?",
      "options": [
        "Hi nasqué el 1862 i hi fundà l'Escola Luminista",
        "Hi morí el 1934 i hi projectà el conjunt de Maricel",
        "Hi nasqué el 1862 i hi bastí el Museu Romàntic",
        "Hi morí el 1934 i hi fundà el setmanari L'Eco de Sitges"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-121",
      "text": "Quina revista fundà i dirigí el sitgetà Josep Carbonell i Gener entre el 1926 i el 1929?",
      "options": [
        "Monitor",
        "Terramar",
        "L'Amic de les Arts",
        "Fora Grillons!"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-122",
      "text": "Quin sitgetà, nascut el 1813, fou el creador del rom Bacardí?",
      "options": [
        "Salvador Carbonell i Puig",
        "Facund Bacardí i Massó",
        "Joan Bacardí i Massó",
        "Andreu Brugal i Montaner"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-123",
      "text": "Quina afirmació sobre el pintor Ramon Casas i Carbó és correcta?",
      "options": [
        "Va néixer a Sitges i hi va impulsar les Festes Modernistes",
        "Va néixer a Barcelona i va morir a Sitges el 1932",
        "Va néixer i morir a Barcelona, tot i la seva vinculació amb Sitges",
        "Va néixer a Sitges i va morir a Aranjuez el 1932"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-124",
      "text": "Quin pintor, mort a Sitges el 1934, és considerat el fundador de l'Escola Luminista de Sitges?",
      "options": [
        "Artur Carbonell i Carbonell",
        "Joaquim Espalter i Rull",
        "Arcadi Mas i Fondevila",
        "Joaquim Sunyer i de Miró"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-125",
      "text": "Quin esportista sitgetà guanyà una etapa del Tour de França l'any 2003?",
      "options": [
        "Joaquim Rodríguez",
        "Àlex Marquès",
        "Sergi Escobar",
        "Joan Antoni Flecha"
      ],
      "correct": 3,
      "reference": "Personatges"
    },
    {
      "id": "sitges-cultura-126",
      "text": "Quants amarratges té el Port de Sitges-Aiguadolç?",
      "options": [
        "642",
        "498",
        "350",
        "1.048"
      ],
      "correct": 0,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-127",
      "text": "En quin any entrà en funcionament el Port de Sitges-Aiguadolç?",
      "options": [
        "El 1962",
        "El 1992",
        "El 1975",
        "El 1986"
      ],
      "correct": 2,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-128",
      "text": "En quin any s'inaugurà Port Ginesta, a les Botigues de Sitges?",
      "options": [
        "El 1975",
        "El 1986",
        "El 2002",
        "El 1992"
      ],
      "correct": 1,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-129",
      "text": "Amb quina finalitat es construí el port de Garraf l'any 1902?",
      "options": [
        "Per donar servei a la fàbrica de ciment de Vallcarca",
        "Per exportar la malvasia de Sitges cap a Amèrica",
        "Per acollir la flota pesquera del nucli de Sitges",
        "Per donar sortida a la pedra de la pedrera de la Falconera"
      ],
      "correct": 3,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-130",
      "text": "A quina línia de Rodalies de Catalunya pertany l'estació de Sitges?",
      "options": [
        "A la R1",
        "A la R4",
        "A la R2 Sud",
        "A la R3"
      ],
      "correct": 2,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-131",
      "text": "En quin any entrà en servei l'autopista C-32, anomenada Pau Casals?",
      "options": [
        "El 1992",
        "El 1989",
        "El 1981",
        "El 1998"
      ],
      "correct": 0,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-132",
      "text": "On es troba l'Hospital Residència Sant Camil, hospital públic de referència del Garraf?",
      "options": [
        "A Sant Pere de Ribes",
        "A Vilafranca del Penedès",
        "A Sitges",
        "A Vilanova i la Geltrú"
      ],
      "correct": 0,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-133",
      "text": "Com es diu el polígon industrial del terme municipal de Sitges?",
      "options": [
        "Mas Alba",
        "Els Molins",
        "Vallcarca",
        "Can Girona"
      ],
      "correct": 0,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-134",
      "text": "On està instal·lat l'Arxiu Municipal Històric de Sitges, obert el 1976?",
      "options": [
        "Al Mercat Vell",
        "Al Palau de Maricel",
        "Al Museu Romàntic Can Llopis",
        "A la Casa de la Vila"
      ],
      "correct": 1,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-135",
      "text": "Què acull la Fundació Stämpfli, oberta al públic el 2011 a l'antic Mercat del Peix?",
      "options": [
        "Una col·lecció d'art contemporani",
        "Una col·lecció de nines dels segles XVII-XIX",
        "Una col·lecció d'arts decoratives del segle XIX",
        "Una col·lecció de pintura romànica i gòtica"
      ],
      "correct": 0,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-136",
      "text": "De quin any és la primera referència escrita del xató, publicada a L'Eco de Sitges?",
      "options": [
        "Del 1918",
        "Del 1853",
        "Del 1951",
        "Del 1896"
      ],
      "correct": 3,
      "reference": "Economia, turisme, equipaments i transport"
    },
    {
      "id": "sitges-cultura-137",
      "text": "Quina espècie vegetal és considerada el símbol del massís del Garraf?",
      "options": [
        "El margalló",
        "El pi blanc",
        "El garric",
        "El llentiscle"
      ],
      "correct": 0,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-138",
      "text": "Quina superfície protegida té el Parc del Garraf?",
      "options": [
        "8.120,50 hectàrees",
        "12.374,32 hectàrees",
        "21.640,75 hectàrees",
        "4.385,00 hectàrees"
      ],
      "correct": 1,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-139",
      "text": "Quants municipis comprèn el Parc del Garraf?",
      "options": [
        "Set",
        "Dotze",
        "Cinc",
        "Nou"
      ],
      "correct": 3,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-140",
      "text": "Quina administració gestiona el Parc del Garraf?",
      "options": [
        "El Departament de Territori de la Generalitat",
        "L'Ajuntament de Sitges",
        "La Diputació de Barcelona",
        "El Consell Comarcal del Garraf"
      ],
      "correct": 2,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-141",
      "text": "En quin any s'aprovà el Pla Especial del Parc del Garraf?",
      "options": [
        "El 1986",
        "El 2002",
        "El 1975",
        "El 1992"
      ],
      "correct": 0,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-142",
      "text": "Quantes banderes blaves va recollir Sitges l'any 2026?",
      "options": [
        "Onze: nou platges i dos ports",
        "Tretze: onze platges i dos ports",
        "Nou: vuit platges i un port",
        "Set: sis platges i un port"
      ],
      "correct": 0,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-143",
      "text": "Quina posició ocupa Sitges pel que fa a platges distingides amb la bandera blava?",
      "options": [
        "És el tercer municipi català, darrere de Roses i Lloret",
        "És el municipi català amb més platges distingides",
        "És el municipi espanyol amb més platges distingides",
        "És el segon municipi català, darrere de Calafell"
      ],
      "correct": 1,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-144",
      "text": "Quina és la platja de més superfície del terme municipal de Sitges?",
      "options": [
        "La platja de la Fragata",
        "La platja de Sant Sebastià",
        "La platja de Terramar",
        "La platja de les Botigues"
      ],
      "correct": 3,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-145",
      "text": "A quina platja de Sitges es permet l'accés dels gossos en temporada alta?",
      "options": [
        "A la platja dels Balmins",
        "A la platja de Vallcarca",
        "A la platja de la Barra",
        "A la platja de l'Estanyol"
      ],
      "correct": 1,
      "reference": "Medi ambient, platges i parc del garraf"
    },
    {
      "id": "sitges-cultura-146",
      "text": "Qui exerceix l'alcaldia de Sitges en el mandat 2023-2027?",
      "options": [
        "Mònica Gallardo Montornés",
        "Carme Gasulla Blanco",
        "Aurora Carbonell i Abella",
        "Eva Martín Martínez"
      ],
      "correct": 2,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "sitges-cultura-147",
      "text": "A quina formació política pertany l'alcaldessa de Sitges?",
      "options": [
        "A Esquerra Republicana de Catalunya",
        "A Sitges Grup Independent",
        "A Junts per Sitges",
        "Al Partit dels Socialistes de Catalunya"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "sitges-cultura-148",
      "text": "Des de quin any exerceix l'alcaldia de Sitges Aurora Carbonell i Abella?",
      "options": [
        "Des del juny del 2019",
        "Des del juny del 2023",
        "Des del juny del 2015",
        "Des del juny del 2011"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "sitges-cultura-149",
      "text": "Quants regidors i regidores integren el Ple de l'Ajuntament de Sitges?",
      "options": [
        "19",
        "17",
        "25",
        "21"
      ],
      "correct": 3,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "sitges-cultura-150",
      "text": "Qui va precedir Aurora Carbonell en l'alcaldia de Sitges, entre el 2011 i el 2019?",
      "options": [
        "Pere Junyent i Dolcet",
        "Jordi Serra i Villalbí",
        "Jordi Baijet i Vidal",
        "Miquel Forns i Fusté"
      ],
      "correct": 3,
      "reference": "Alcaldia i ple municipal"
    }
  ]
};

export default sitgesCultura;
