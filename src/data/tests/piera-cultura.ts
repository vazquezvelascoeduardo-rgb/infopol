// Test específic Piera — coneixement del municipi.
// 150 preguntes de cultura de la ciutat per a Agent de Policia Local de Piera.
import type { TestTopic } from './types';

const pieraCultura: TestTopic = {
  "slug": "piera-cultura",
  "title": "Piera · Cultura de la ciutat",
  "description": "geografia, història, patrimoni, festes i institucions de Piera",
  "icon": "🏘️",
  "accent": "from-teal-500 to-emerald-600",
  "category": "municipi",
  "municipi": "Piera",
  "questions": [
    {
      "id": "piera-cultura-1",
      "text": "A quina comarca pertany el municipi de Piera?",
      "options": [
        "A l'Alt Penedès",
        "Al Baix Llobregat",
        "A l'Anoia",
        "Al Bages"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-2",
      "text": "A quina província pertany Piera?",
      "options": [
        "A la de Barcelona",
        "A la de Tarragona",
        "A la de Lleida",
        "A la de Girona"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-3",
      "text": "Quin és el codi postal de Piera?",
      "options": [
        "08782",
        "08760",
        "08784",
        "08791"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-4",
      "text": "A quin partit judicial pertany Piera?",
      "options": [
        "Al de Martorell",
        "Al de Vilafranca del Penedès",
        "Al de Vilanova i la Geltrú",
        "Al d'Igualada"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-5",
      "text": "Quina és l'adreça oficial de l'Ajuntament de Piera?",
      "options": [
        "Plaça de Joan Orpí, 1",
        "Avinguda del Gall Mullat, 7",
        "Carrer de la Plaça, 16-18",
        "Carrer de l'Estació, 3"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-6",
      "text": "Quin és el NIF de l'Ajuntament de Piera?",
      "options": [
        "P0816000D",
        "P0812300B",
        "P0816400A",
        "P0818200C"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-7",
      "text": "Quina posició ocupa Piera dins de l'Anoia pel que fa a l'extensió del terme municipal?",
      "options": [
        "És el segon municipi més extens, després d'Igualada",
        "És el tercer municipi més extens, després d'Òdena i la Llacuna",
        "És el municipi més extens de la comarca",
        "És el municipi de menor extensió de la comarca"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-8",
      "text": "A quina comarca natural s'adscriu tradicionalment Piera?",
      "options": [
        "Al Montserratí",
        "A la Segarra calafina",
        "Al Penedès marítim",
        "A la Conca d'Òdena"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-9",
      "text": "Amb quants municipis limita el terme de Piera?",
      "options": [
        "Amb 5 municipis",
        "Amb 9 municipis",
        "Amb 7 municipis",
        "Amb 12 municipis"
      ],
      "correct": 1,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-10",
      "text": "Quants dels municipis limítrofs de Piera pertanyen a la comarca de l'Alt Penedès?",
      "options": [
        "Tres: Sant Llorenç d'Hortons, Sant Sadurní i Torrelavit",
        "Un de sol: el terme veí de Sant Sadurní d'Anoia",
        "Dos: Gelida i Sant Llorenç d'Hortons",
        "Cap ni un: tots els municipis limítrofs són de l'Anoia"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-11",
      "text": "Quin municipi limita amb Piera pel costat oest?",
      "options": [
        "Capellades",
        "La Torre de Claramunt",
        "Cabrera d'Anoia",
        "Carme"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-12",
      "text": "Quina afirmació sobre Vallbona d'Anoia és correcta?",
      "options": [
        "És un municipi independent, limítrof amb Piera",
        "És la urbanització més poblada del terme de Piera",
        "És un dels barris històrics del nucli antic de Piera",
        "És una entitat municipal descentralitzada de Piera"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-13",
      "text": "Quina urbanització de Piera té un nom que sovint es confon amb el del municipi veí de Vallbona d'Anoia?",
      "options": [
        "La Fortesa",
        "Can Bou",
        "El Portell",
        "Vallbonica"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-14",
      "text": "Quin és el riu principal del terme de Piera?",
      "options": [
        "El riu Anoia",
        "El riu Llobregat",
        "El riu Foix",
        "El riu Ripoll"
      ],
      "correct": 0,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-15",
      "text": "On desemboca el riu Anoia?",
      "options": [
        "Al mar, a Vilanova i la Geltrú",
        "Al Cardener, a Manresa",
        "Al Llobregat, a Martorell",
        "Al Foix, a Castellet i la Gornal"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-16",
      "text": "Quin curs d'aigua passa pel costat de la vila de Piera?",
      "options": [
        "La riera de Piera, que hi desemboca",
        "La riera de Can Bonastre, al sud del nucli",
        "La riera de Ca n'Aguilera",
        "La riera de Rubí, en el seu tram alt"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-17",
      "text": "Quina d'aquestes rieres consta documentada al terme de Piera?",
      "options": [
        "La riera de Can Bonastre",
        "La riera de Piera",
        "La riera de Rubí",
        "La riera de la Guinovarda"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-18",
      "text": "Quin és el cim més alt de l'entorn de Piera, situat al límit amb el Bruc?",
      "options": [
        "El turó de l'Avellana, de 706 m",
        "El Castellet, de 812 m",
        "La Fembra Morta, de 766 m",
        "El Pujol, de 645 m"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-19",
      "text": "Com es coneix el paratge argilós erosionat situat entre Piera, Can Mussarro i Can Mata, comparat amb «un canó del Colorado en miniatura»?",
      "options": [
        "Els Xaragalls del Portell",
        "El Cau del Teixó, prop de la Ventosa",
        "La Vall Argilosa de la Guinovarda",
        "Les Flandes"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-20",
      "text": "Quin dels següents nuclis o urbanitzacions NO forma part del municipi de Piera?",
      "options": [
        "Can Canals de Masbover",
        "Vallbona d'Anoia",
        "El Bosc de l'Àliga",
        "Cap de les respostes anteriors: totes tres pertanyen a Piera"
      ],
      "correct": 1,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-21",
      "text": "Quin dels nuclis tradicionals de Piera se situa a més altitud, a 420 m?",
      "options": [
        "El Bedorc, a 194 m",
        "Sant Jaume Sesoliveres, a 187 m",
        "La Fortesa",
        "Ca n'Aguilera"
      ],
      "correct": 3,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-22",
      "text": "Quants embassaments hi ha dins del terme municipal de Piera?",
      "options": [
        "Un, el pantà de la Guinovarda",
        "Dos, tots dos sobre el riu Anoia",
        "Cap ni un: no n'hi ha cap dins del terme",
        "Tres petits embassaments de reg"
      ],
      "correct": 2,
      "reference": "Geografia, nuclis i urbanitzacions"
    },
    {
      "id": "piera-cultura-23",
      "text": "En quina forquilla se situa la població de Piera segons les fonts oficials més recents?",
      "options": [
        "Entre 17.500 i 18.000 habitants",
        "Entre 8.000 i 8.500 habitants",
        "Entre 12.000 i 12.500 habitants",
        "Entre 24.000 i 25.000 habitants"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-24",
      "text": "Quina posició ocupa Piera entre els municipis més poblats de l'Anoia?",
      "options": [
        "És el segon municipi més poblat, després d'Igualada",
        "És el municipi més poblat de la comarca",
        "És el tercer, després d'Igualada i Vilanova del Camí",
        "És el quart, després d'Igualada, Vilanova del Camí i Masquefa"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-25",
      "text": "Quin és el gentilici dels habitants de Piera?",
      "options": [
        "Pieretans i pieretanes",
        "Apiarencs i apiarenques",
        "Pierencs i pierenques",
        "Pieresos i piereses"
      ],
      "correct": 2,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-26",
      "text": "Quin és el gentilici dels habitants del Bedorc?",
      "options": [
        "Bedorquesos i bedorqueses",
        "Bedorquins i bedorquines",
        "Bedorcans i bedorcanes",
        "Bedorquencs i bedorquenques"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-27",
      "text": "Segons l'Idescat (2025), quina densitat de població té Piera?",
      "options": [
        "150,0 habitants per km²",
        "253,0 habitants per km²",
        "312,7 habitants per km²",
        "478,5 habitants per km²"
      ],
      "correct": 2,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-28",
      "text": "Quin percentatge dels habitatges familiars de Piera són habitatges no principals, reflex del pes de la segona residència?",
      "options": [
        "Al voltant del 5%",
        "Al voltant del 29%",
        "Al voltant del 50%",
        "Al voltant del 70%"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-29",
      "text": "Quin fet explica la caiguda de 893 habitants que va patir Piera entre el 1887 i el 1897?",
      "options": [
        "Una epidèmia de còlera que assolà tota la comarca",
        "L'emigració pel tancament de les quatre papereres",
        "Una gran riuada del riu Anoia que anegà la vila",
        "La fil·loxera, que va destruir la vinya"
      ],
      "correct": 3,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-30",
      "text": "Segons l'estadística de població estacional (ETCA), Piera és un municipi…",
      "options": [
        "receptor de població, amb una població estacional molt positiva",
        "en equilibri exacte entre la població resident i l'estacional",
        "exportador de població, amb població estacional negativa",
        "sense dades de població estacional disponibles a l'Idescat"
      ],
      "correct": 2,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-31",
      "text": "Quin percentatge de la població de Piera té nacionalitat estrangera, segons l'Idescat (2025)?",
      "options": [
        "Al voltant del 9,8%",
        "Al voltant del 2,1%",
        "Al voltant del 18,5%",
        "Al voltant del 27,3%"
      ],
      "correct": 0,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-32",
      "text": "Segons la sèrie històrica, quants habitants tenia Piera l'any 1970?",
      "options": [
        "6.013 habitants",
        "3.813 habitants",
        "10.048 habitants",
        "1.924 habitants"
      ],
      "correct": 1,
      "reference": "Demografia"
    },
    {
      "id": "piera-cultura-33",
      "text": "De quin mot llatí deriva el topònim Piera?",
      "options": [
        "De petraria, que significa 'pedrera'",
        "D'apiarium, que significa 'abellar'",
        "De pirus, que significa 'perera'",
        "De piperia, que significa 'lloc de pebre'"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-34",
      "text": "Quin topònim del terme de Piera es considera un dels escassíssims noms preromans de l'Anoia?",
      "options": [
        "El Bedorc",
        "La Fortesa",
        "Ca n'Aguilera",
        "Sant Jaume Sesoliveres"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-35",
      "text": "Quina troballa arqueològica excepcional es va fer l'any 1970 a la cova de la Ventosa de Piera?",
      "options": [
        "Un mosaic romà policromat de finals del segle II dC",
        "Un tresor de més de dues-centes monedes visigòtiques d'or",
        "Un taller de vidre bufat d'època ibèrica plena",
        "Un enterrament amb aixovar campaniforme pirinenc"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-36",
      "text": "Quina moneda ibèrica es va trobar al jaciment de Sant Jaume Sesoliveres?",
      "options": [
        "Una moneda de Kese (Tarragona)",
        "Una moneda d'Iltirta (Lleida)",
        "Una moneda d'Emporion (Empúries)",
        "Una moneda d'Arse (Sagunt)"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-37",
      "text": "De quin emperador romà és la moneda trobada a Sant Jaume Sesoliveres?",
      "options": [
        "De l'emperador August",
        "De l'emperador Trajà",
        "De l'emperador Claudi (41-54 dC)",
        "De l'emperador Constantí"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-38",
      "text": "Què s'ha trobat a Piera corresponent a l'època visigòtica?",
      "options": [
        "Una necròpolis amb més de vint sepultures excavades",
        "Els fonaments d'una basílica al costat del castell",
        "Un conjunt notable de fíbules i sivelles de bronze",
        "Cap vestigi de cap mena"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-39",
      "text": "En quin segle se situa la carta de població del lloc de Freixe, primera notícia documental relacionada amb el castell de Piera?",
      "options": [
        "Al segle VIII",
        "Al segle XII",
        "Al segle X",
        "Al segle XIV"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-40",
      "text": "A quin monestir va pertànyer el castell de Piera entre els anys 963 i 1010?",
      "options": [
        "Al monestir de Montserrat",
        "Al monestir de Sant Cugat del Vallès",
        "Al monestir de Poblet",
        "Al monestir de Sant Pere de les Puel·les"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-41",
      "text": "Segons la documentació del segle X, quins llocs dominava el castell de Fontanet, a més de Piera?",
      "options": [
        "Capellades, Òdena i la Pobla de Claramunt",
        "Sant Sadurní d'Anoia, Gelida i part de Subirats",
        "Pierola, Vallbona, Cabrera i part de Masquefa",
        "Igualada, Jorba i part de Castellolí"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-42",
      "text": "Quina activitat industrial de Piera consta documentada ja l'any 1031?",
      "options": [
        "Un gran forn de vidre bufat senyorial",
        "Una drassana fluvial a la vora del riu Anoia",
        "Un molí de paper de drap del monestir",
        "La Ferreria, farga d'armes i eines"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-43",
      "text": "L'any 1063 els vescomtes de Barcelona van cedir Piera i Castellet als comtes de Barcelona. Què van rebre a canvi?",
      "options": [
        "El castell de Pierola, en permuta",
        "El castell de Claramunt",
        "Una renda anual de 200 lliures",
        "El terme de Masquefa"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-44",
      "text": "Quin any Santa Maria de Piera consta ja com a església parroquial?",
      "options": [
        "L'any 1002",
        "L'any 1260",
        "L'any 1380",
        "L'any 1159"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-45",
      "text": "Quin bisbe de Barcelona va consagrar de nou l'església de Santa Maria de Piera l'any 1260?",
      "options": [
        "Guislabert",
        "Berenguer de Palou",
        "Arnau de Gurb",
        "Ponç de Gualba"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-46",
      "text": "Quin privilegi va atorgar Jaume I als seus vassalls pierencs l'any 1264?",
      "options": [
        "L'exempció perpètua del pagament del delme reial",
        "El dret de celebrar dues fires anuals franques",
        "Poder resoldre a la vila les causes i els plets",
        "La facultat d'elegir directament el batlle reial"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-47",
      "text": "Quina va ser l'estada més llarga documentada de Jaume I al castell de Piera?",
      "options": [
        "De gener a març de 1229",
        "D'agost a desembre de 1268",
        "Tot l'any 1276",
        "De maig a juny de 1250"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-48",
      "text": "Qui va ser nomenat per Jaume I, el 1265, per tenir el castell de Piera preparat per a les vingudes reials, iniciant una nissaga que hi va romandre fins al segle XVIII?",
      "options": [
        "Albert de Castellvell",
        "Berenguer de Guàrdia",
        "Guillem de Sescorts",
        "Guillem de Capellades"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-49",
      "text": "Quin monarca va emetre l'any 1320 un privilegi d'inalienabilitat del castell i la vila de Piera?",
      "options": [
        "Pere II",
        "Jaume II",
        "Alfons II",
        "Pere III"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-50",
      "text": "Com es coneix la crisi que l'any 1333 va donar els primers símptomes de la davallada baixmedieval a Piera?",
      "options": [
        "«La fam dels rabassaires»",
        "«El mal any de la fil·loxera»",
        "«La pesta dels pierencs»",
        "«Lo mal any primer»"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-51",
      "text": "A qui va vendre Alfons el Magnànim la baronia de Piera l'any 1431, per 9.000 florins?",
      "options": [
        "Al monestir de Poblet",
        "Al monestir de Pedralbes",
        "Al comte de Cardona",
        "Al bisbat de Barcelona"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-52",
      "text": "Qui va ser la primera abadessa i baronessa de Piera, morta l'any 1447?",
      "options": [
        "Elisenda de Montcada",
        "Riquilda de Barcelona",
        "Anna Maria Sescorts",
        "Isabel de Viala"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-53",
      "text": "Quin dia de la setmana se celebrava originàriament el mercat medieval de Piera?",
      "options": [
        "El dimarts",
        "El dilluns",
        "El divendres",
        "El diumenge"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-54",
      "text": "La fira medieval de Piera se celebrava anualment entre dues festivitats. Quines?",
      "options": [
        "De Sant Joan (24 de juny) a Sant Pere (29 de juny)",
        "De Tots Sants (1 de novembre) a Sant Martí (11 de novembre)",
        "De Santa Maria d'Agost (15) a Sant Bartomeu (24)",
        "De Sant Josep (19 de març) a Sant Jordi (23 d'abril)"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-55",
      "text": "De quina vegueria era Piera centre d'una de les tres sotsvegueries?",
      "options": [
        "De la vegueria del Penedès",
        "De la vegueria de Barcelona",
        "De la vegueria del Bages",
        "De la vegueria de Vilafranca-Igualada"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-56",
      "text": "Quin dels tres sectors històrics de la vila de Piera era el nucli més antic?",
      "options": [
        "El Raval Superior o Sobirà",
        "El Raval Inferior o Jussà",
        "El Mercadal emmurallat",
        "El barri de Montserrat"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-57",
      "text": "Quins forns esmenta el capbreu de Piera de l'any 1553?",
      "options": [
        "Dos forns de vidre bufat i un forn de calç viva",
        "El forn del pa i el forn de guix de la vila",
        "El de la teula, el dels càntirs i el de les olles",
        "Tres forns de fondre ferro annexos a la Ferreria"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-58",
      "text": "Quin canvi va comportar el Decret de Nova Planta per a Piera?",
      "options": [
        "La supressió del municipi i la seva annexió al terme d'Igualada",
        "La fi del règim insaculatori i el pas al corregiment de Vilafranca",
        "La creació d'un ajuntament electiu de dotze regidors vitalicis",
        "El manteniment íntegre del règim medieval de vegueries"
      ],
      "correct": 1,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-59",
      "text": "Amb quina excusa es va enderrocar el Portal d'en Selva, o Portal Sobirà, l'any 1759?",
      "options": [
        "Amb l'excusa d'una epidèmia de pesta declarada",
        "Per fer-hi passar la carretera de Capellades a Martorell",
        "Per aprofitar-ne la pedra per al nou campanar",
        "Amb l'excusa d'una visita de Carles III"
      ],
      "correct": 3,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-60",
      "text": "Quin any va afectar per primera vegada la fil·loxera les vinyes de Piera?",
      "options": [
        "L'any 1888",
        "L'any 1860",
        "L'any 1897",
        "L'any 1913"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-61",
      "text": "Quina data van entrar les tropes franquistes a Piera?",
      "options": [
        "El 22 de gener de 1939",
        "El 26 de gener de 1939",
        "El 18 de juliol de 1936",
        "El 4 d'abril de 1938"
      ],
      "correct": 0,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-62",
      "text": "Qui va ser el primer alcalde democràtic de Piera, elegit després de les eleccions municipals del 3 d'abril de 1979?",
      "options": [
        "Pere Farrés i Bonastre, del PSC",
        "Jaume Salvador Guixà i Soteras, de CiU",
        "Josep Manuel Lacambra i Pellicer (CiU)",
        "Josep Parramon, regidor independent"
      ],
      "correct": 2,
      "reference": "Història"
    },
    {
      "id": "piera-cultura-63",
      "text": "Quina és la situació de Piera pel que fa a l'escut i la bandera municipals?",
      "options": [
        "Té escut oficial des del 1991, però encara no té bandera aprovada",
        "No té escut ni bandera oficials aprovats",
        "Té escut i bandera oficials, tots dos publicats en el seu dia al DOGC",
        "Té bandera oficial, però l'escut continua sent el del monestir de Pedralbes"
      ],
      "correct": 1,
      "reference": "Símbols i denominació"
    },
    {
      "id": "piera-cultura-64",
      "text": "Piera és un dels sis municipis de l'Anoia sense escut ni bandera oficials. Quin dels següents municipis es troba en la mateixa situació?",
      "options": [
        "Igualada",
        "Capellades",
        "Òdena",
        "Vilanova del Camí"
      ],
      "correct": 0,
      "reference": "Símbols i denominació"
    },
    {
      "id": "piera-cultura-65",
      "text": "Quina divisa van haver de fer servir obligatòriament els segells i l'escut de Piera des del 1756 fins al 1822?",
      "options": [
        "La divisa del monestir de Pedralbes",
        "Les quatre barres de la Corona d'Aragó",
        "La divisa dels comtes de Cardona",
        "La creu del monestir de Sant Cugat"
      ],
      "correct": 0,
      "reference": "Símbols i denominació"
    },
    {
      "id": "piera-cultura-66",
      "text": "Quin és el nom oficial de la corporació municipal de Piera?",
      "options": [
        "Ajuntament de la Ciutat de Piera",
        "Ajuntament de la Vila de Piera",
        "Ajuntament de Piera d'Anoia (Barcelona)",
        "Ajuntament de la Vila Reial de Piera"
      ],
      "correct": 1,
      "reference": "Símbols i denominació"
    },
    {
      "id": "piera-cultura-67",
      "text": "Quants béns culturals d'interès nacional (BCIN) hi ha a Piera?",
      "options": [
        "Un de sol, el castell de Piera o de Fontanet",
        "Cinc, repartits entre castells i esglésies",
        "Cap ni un: tot el patrimoni pierenc és d'interès local",
        "Tres, tots tres castells"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-68",
      "text": "Quins són els tres BCIN del terme de Piera?",
      "options": [
        "El castell de Piera, el castell de Fontanet i el castell de Freixe",
        "El castell de Piera, l'església de Santa Maria i el Portal Romanyà",
        "El castell de Piera, el castell de Freixe i el castell del Castellet",
        "Cap de les respostes anteriors no és correcta"
      ],
      "correct": 2,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-69",
      "text": "Què és el castell de Fontanet?",
      "options": [
        "És un castell independent situat al nucli del Bedorc",
        "És la torre de guaita del poble de Sant Jaume Sesoliveres",
        "És el nom que rep avui el castell del Castellet",
        "És el nom antic del castell de Piera"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-70",
      "text": "Amb quins altres noms es coneix el castell del Castellet, un dels BCIN de Piera?",
      "options": [
        "Castell de Fontanet o castell Sobirà",
        "Castell del Bedorc o castell de la Ventosa",
        "Castell de Freixe o castell del Tretzè",
        "Castell de la Fortesa o castell de Creixà"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-71",
      "text": "On està situat el castell de Piera?",
      "options": [
        "En un petit turó al costat de l'església de Santa Maria",
        "Al fons de la vall de la riera de Ca n'Aguilera, prop del molí",
        "Al cim de la Fembra Morta, al límit amb el terme del Bruc",
        "Al centre de la urbanització de Can Claramunt, al sud del terme"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-72",
      "text": "Quin gruix tenen les parets del castell de Piera a la part baixa?",
      "options": [
        "Dos metres",
        "Mig metre",
        "Cinc metres",
        "Vuit metres"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-73",
      "text": "Qui va enllestir la restauració del castell de Piera l'any 1916?",
      "options": [
        "L'arquitecte modernista Francesc Berenguer i Mestres",
        "Ramon de Viala i de Ayguavives, baró d'Almenar",
        "L'esgrafiador Ferran Serra, per encàrrec dels Sescorts",
        "Sebastià M. de Plaja, per encàrrec de l'Ajuntament"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-74",
      "text": "Segons la llegenda recollida per les fonts, què hauria fet Jaume I a la costa dels Xiprers de Piera?",
      "options": [
        "Fundar-hi una capella dedicada a Sant Bonifaci de Cerdanya",
        "Signar-hi la carta de població del lloc de Freixe",
        "Pujar-la de genolls en acció de gràcies per la conquesta de Mallorca",
        "Rebre-hi els ambaixadors del rei de Castella i de Lleó"
      ],
      "correct": 2,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-75",
      "text": "Amb quin nom popular es coneix també el castell de Piera?",
      "options": [
        "Torre del Rellotge de la vila",
        "Torre dels Sescorts",
        "Torre Vella de la Ferreria",
        "Torre del Castell de Jaume I"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-76",
      "text": "A quina advocació està dedicada l'església parroquial de la vila de Piera?",
      "options": [
        "A Sant Bonifaci de Cerdanya",
        "A Santa Maria",
        "A la Mare de Déu de la Mercè",
        "A Sant Cristòfol màrtir"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-77",
      "text": "Quines característiques té el campanar de l'església de Santa Maria de Piera?",
      "options": [
        "Planta circular amb coronament de merlets, del segle XIV",
        "Base quadrada i pis vuitavat, del segle XVIII",
        "Espadanya de dos ulls sobre la façana, del segle XVI",
        "Base octogonal i cos cilíndric, aixecat al segle XIX"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-78",
      "text": "Quin any es va col·locar la primera pedra del nou campanar de Santa Maria de Piera, amb el mestre d'obres Joan Marió de Capellades?",
      "options": [
        "L'any 1630",
        "L'any 1792",
        "L'any 1883",
        "L'any 1819"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-79",
      "text": "Quina és la planta de l'església de Santa Maria de Piera?",
      "options": [
        "Tres naus amb creuer, cimbori i deambulatori de cinc absidioles",
        "Nau única amb capelles laterals",
        "Planta de creu grega amb cimbori central i quatre absis",
        "Nau única sense capelles laterals, coberta amb encavallades"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-80",
      "text": "A quina advocació està dedicada l'església de Ca n'Aguilera?",
      "options": [
        "A la Mare de Déu de la Mercè",
        "A Santa Maria d'Apiària",
        "A Sant Nicasi",
        "A Santa Magdalena"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-81",
      "text": "Qui va projectar l'església de Ca n'Aguilera, construïda l'any 1910?",
      "options": [
        "Josep Puig i Cadafalch, deixeble d'Elies Rogent",
        "Lluís Domènech i Montaner, autor del Palau",
        "Francesc Berenguer i Mestres",
        "Sebastià M. de Plaja, restaurador del castell"
      ],
      "correct": 2,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-82",
      "text": "Quina església del terme de Piera depèn actualment de la parròquia de Sant Sadurní d'Anoia?",
      "options": [
        "Sant Jaume Sesoliveres",
        "Sant Sebastià del Bedorc",
        "Santa Creu de Creixà",
        "Santa Maria de la Fortesa"
      ],
      "correct": 2,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-83",
      "text": "Amb quin altre nom es coneix l'ermita de Sant Nicolau de Freixe?",
      "options": [
        "Ermita del Tretzè",
        "Ermita del Remei de Mas Bonans",
        "Ermita de Santa Creu de Palau",
        "Ermita vella del Portell"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-84",
      "text": "Quin element patrimonial de Piera, del segle XIV, conserva gravat l'escut del monestir de Pedralbes?",
      "options": [
        "El Pou de Gel, al camí del Sauló",
        "La Torre del Rellotge de la plaça de la Creu",
        "La Casa de la Volta, al carrer de la Salut",
        "El Portal Romanyà o portal d'en Golart"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-85",
      "text": "Qui és l'autor dels esgrafiats que decoren la façana de la Casa Sastre de Piera?",
      "options": [
        "Ferran Serra",
        "Francesc Berenguer i Mestres",
        "Josep Mata i Marta Grífol",
        "El pintor Torras i Viver"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-86",
      "text": "Amb quin nom històric es coneix la plaça de Joan Orpí de Piera?",
      "options": [
        "La plaça de la Creu",
        "El Mercadal",
        "La plaça de les Monges",
        "La plaça del Peix, al Raval Jussà"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-87",
      "text": "De quins segles és la Casa de la Volta de Piera, testimoni del Raval Jussà?",
      "options": [
        "Dels segles X-XI",
        "Dels segles XIII-XIV",
        "Dels segles XVII-XVIII",
        "Del segle XX"
      ],
      "correct": 1,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-88",
      "text": "Quin edifici modernista de Piera, datat el 1902, es troba al carrer Doctor Carles, 9?",
      "options": [
        "Cal Metge Vidal, del segle XVI",
        "Ca la Pentinadora, noucentista",
        "Cal Borrull, dels segles XIII-XV",
        "Cal Facundo o Cal Flo"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-89",
      "text": "Quina activitat es feia a l'Hostal de Can Bonastre, del segle XVIII?",
      "options": [
        "El pesatge oficial del gra del mercat setmanal",
        "La fabricació de càntirs i olles de terrissa",
        "El canvi de rècules de mules de les diligències",
        "La recaptació del delme del monestir de Pedralbes"
      ],
      "correct": 2,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-90",
      "text": "Quantes masies figuren inventariades al terme de Piera?",
      "options": [
        "12",
        "35",
        "150",
        "72"
      ],
      "correct": 3,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-91",
      "text": "Quin ús successiu ha tingut l'edifici de les Caves Pagès Entrena, l'antiga fàbrica de Ca l'Esquerrà?",
      "options": [
        "Molí fariner, paperera i tractament de teixits",
        "Forn de vidre, caserna de carrabiners i escola pública",
        "Molí d'oli, bòbila i magatzem municipal de gra",
        "Farga d'armes, paperera i pou de gel senyorial"
      ],
      "correct": 0,
      "reference": "Patrimoni i monuments"
    },
    {
      "id": "piera-cultura-92",
      "text": "Quins són els dos festius locals oficials de Piera?",
      "options": [
        "El 23 d'abril (Sant Jordi) i el 24 d'agost (Sant Bartomeu)",
        "El 28 d'abril i el 8 de setembre",
        "L'1 de febrer (Sant Nicasi) i el 25 de juliol (Sant Jaume el Major)",
        "El 20 de gener (Sant Sebastià) i el 8 de setembre (Festa Major)"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-93",
      "text": "En quin mes se celebra la Festa Major de Piera?",
      "options": [
        "A l'abril",
        "Al juliol",
        "Al setembre",
        "Al gener"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-94",
      "text": "Qui és el patró de la vila de Piera?",
      "options": [
        "Sant Bonifaci de Cerdanya",
        "Sant Bartomeu apòstol",
        "Sant Nicasi de Reims",
        "Sant Cristòfol màrtir"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-95",
      "text": "Quin any va ser proclamat patró de Piera Sant Bonifaci de Cerdanya, coincidint amb l'arribada d'una relíquia des de Montserrat?",
      "options": [
        "L'any 1669",
        "L'any 1553",
        "L'any 1759",
        "L'any 1888"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-96",
      "text": "Com es diu la fira multisectorial que se celebra a Piera al voltant del 28 d'abril?",
      "options": [
        "La Fira de Sant Josep",
        "La Festa del Most i de la Verema",
        "La Fira de la Terrissa i la Ceràmica",
        "La Fira i Festes del Sant Crist"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-97",
      "text": "Segons la llegenda, qui va indicar on es trobava la imatge miraclera del Sant Crist de Piera?",
      "options": [
        "Maria Lleopard, vídua de Santa Creu de Creixà",
        "Elisenda de Montcada, abadessa del monestir de Pedralbes",
        "Un pastor del veïnat de Ca n'Aguilera",
        "El bisbe de Barcelona Arnau de Gurb"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-98",
      "text": "Quin fenomen meteorològic s'invocava tradicionalment amb el Sant Crist de Piera?",
      "options": [
        "La calamarsa",
        "El vent de mestral",
        "La boira",
        "La pluja"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-99",
      "text": "A quin nucli del terme de Piera se celebra la Festa Major d'Hivern de Sant Nicasi?",
      "options": [
        "Al Bedorc",
        "A Ca n'Aguilera",
        "A la Fortesa",
        "A Sant Jaume Sesoliveres"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-100",
      "text": "Quin fet va originar, l'any 1889, la festa de Sant Nicasi a Sant Jaume Sesoliveres?",
      "options": [
        "Una sequera que va assecar totes les fonts del terme",
        "Una plaga de pesta amb gran mortalitat infantil",
        "L'arribada de la fil·loxera a les vinyes del poble",
        "Un gran incendi forestal que va cremar tot el nucli"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-101",
      "text": "Des de quin any la festa de Sant Nicasi se celebra el primer diumenge de febrer, i no l'1 de febrer?",
      "options": [
        "Des del 1970",
        "Des del 1889",
        "Des del 1941",
        "Des del 1995"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-102",
      "text": "Qui protagonitza la processó tradicional de Sant Nicasi a Sant Jaume Sesoliveres?",
      "options": [
        "Els veïns majors de vuitanta anys nascuts al poble",
        "Els qui han tingut fills en els darrers dotze mesos",
        "Els pubills i pubilles elegits durant la Festa Major",
        "Els membres del Grup de Falcons de Piera i la colla gegantera"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-103",
      "text": "Qui és el patró de Sant Jaume Sesoliveres i quin dia se celebra?",
      "options": [
        "Sant Nicasi, el primer diumenge de febrer",
        "Sant Sebastià, el 20 de gener",
        "Sant Jaume el Major, el 25 de juliol",
        "Sant Bonifaci de Cerdanya, el 8 de setembre"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-104",
      "text": "Quina festa se celebra al gener al nucli del Bedorc?",
      "options": [
        "La festa de Sant Nicasi",
        "L'aplec del Remei",
        "La Castanyada Rock",
        "La festa de Sant Sebastià"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-105",
      "text": "En quin mes se celebra l'aplec del Remei de Mas Bonans?",
      "options": [
        "Al febrer",
        "Al setembre",
        "Al maig",
        "Al novembre"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-106",
      "text": "Quina data se celebra el festival Castanyada Rock de Piera?",
      "options": [
        "El 24 de juny",
        "El 28 d'abril",
        "El 31 d'octubre",
        "El 6 de gener"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-107",
      "text": "Des de quin any se celebra el Concurs de Teatre Vila de Piera?",
      "options": [
        "Des del 1967",
        "Des del 1925",
        "Des del 1953",
        "Des del 1995"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-108",
      "text": "Com es diuen els gegants de Piera?",
      "options": [
        "Bonifaci i Mercè",
        "Jaume i Elisenda",
        "Orpí i Maria Lleopard",
        "Fontanet i Apiària"
      ],
      "correct": 1,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-109",
      "text": "En honor de qui van ser batejats els gegants de Piera?",
      "options": [
        "De Joan Orpí i del Pou i de la seva esposa",
        "Del baró d'Almenar i de la baronessa d'Ayguavives",
        "De Sant Bonifaci i de la Mare de Déu de la Mercè",
        "Del rei Jaume I i de l'abadessa Elisenda de Montcada"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-110",
      "text": "Quin any es van construir els gegants de Piera, obra de Josep Mata i Marta Grífol?",
      "options": [
        "L'any 1995",
        "L'any 1964",
        "L'any 1988",
        "L'any 2005"
      ],
      "correct": 0,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-111",
      "text": "Quina afirmació sobre el Grup de Falcons de Piera és correcta?",
      "options": [
        "És l'única colla castellera de tota la comarca de l'Anoia",
        "És la colla de bastoners del municipi, fundada el 1995",
        "És un grup gimnàstic i acrobàtic, no una colla castellera",
        "És el grup de diables infantil de la vila de Piera"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-112",
      "text": "Quina afirmació és certa sobre les colles castelleres a Piera?",
      "options": [
        "Piera té una colla castellera fundada l'any 1995",
        "Els Falcons de Piera són la colla castellera del municipi",
        "La colla castellera de Piera és la degana de l'Anoia",
        "Cap de les respostes anteriors no és correcta"
      ],
      "correct": 3,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-113",
      "text": "Com es diu la coral de Piera que consta al registre municipal d'entitats?",
      "options": [
        "Coral Apiària",
        "Coral Ressò de Piera",
        "Coral Xicoira",
        "Coral Sant Bonifaci"
      ],
      "correct": 2,
      "reference": "Festes i cultura popular"
    },
    {
      "id": "piera-cultura-114",
      "text": "Quin personatge nascut a Piera l'any 1593 va ser el fundador de Barcelona de Veneçuela?",
      "options": [
        "Josep Vidal i Munné",
        "Lluís Valencià, oïdor militar",
        "Alexandre Mata, fundador de l'Ateneu",
        "Joan Orpí i del Pou"
      ],
      "correct": 3,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-115",
      "text": "Amb quin pseudònim es va embarcar Joan Orpí cap a Amèrica l'any 1623?",
      "options": [
        "Juan de Piera i del Pou",
        "Gaspar del Pou",
        "Gregorio Izquierdo",
        "Andrés Apiario"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-116",
      "text": "Quina va ser la principal aportació científica de Josep Vidal i Munné, nascut a Piera el 1896?",
      "options": [
        "La primera vacuna catalana contra la ràbia canina",
        "La vacuna contra la brucel·losi bovina",
        "El descobriment del bacil de la tuberculosi aviària",
        "La creació del primer banc de sang veterinari d'Europa"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-117",
      "text": "Quin càrrec va ocupar Josep Vidal i Munné entre el 1934 i el 1936?",
      "options": [
        "Director general de Ramaderia de la Generalitat de Catalunya",
        "Primer president del Col·legi de Veterinaris de Catalunya",
        "Rector de la Facultat de Veterinària de Saragossa",
        "President de la Unió de Rabassaires de Catalunya"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-118",
      "text": "Quin esportista d'elit va néixer a Piera el 17 d'octubre de 1986?",
      "options": [
        "Marc Coma, pilot de ral·lis tot terreny",
        "Joan Mir, pilot de motociclisme de velocitat",
        "Toni Bou, pilot de trial",
        "Laia Sanz, pilota de trial i d'enduro"
      ],
      "correct": 2,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-119",
      "text": "Quina relació té Elisenda de Montcada amb Piera?",
      "options": [
        "Hi va néixer el 1380 i hi és enterrada, al costat del castell",
        "En va ser la primera baronessa, però no hi va néixer",
        "Va ser mestressa del castell de Freixe fins a la seva mort, el 1447",
        "Va ser l'esposa del vescomte Udalard II i senyora de la vila"
      ],
      "correct": 1,
      "reference": "Personatges"
    },
    {
      "id": "piera-cultura-120",
      "text": "Quin conreu ocupa la major part de les terres llaurades de Piera?",
      "options": [
        "L'olivera, amb 1.091 hectàrees",
        "Els cereals per a gra, amb 1.091 hectàrees",
        "La vinya, amb 1.091 hectàrees",
        "Els fruiters de secà, amb 1.091 hectàrees"
      ],
      "correct": 2,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-121",
      "text": "A quina denominació d'origen pertany la vinya de Piera?",
      "options": [
        "A la DO Costers del Segre",
        "A la DO Pla de Bages",
        "A la DO Conca de Barberà",
        "A la DO Penedès"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-122",
      "text": "Quina tradició artesanal està documentada a Piera des del capbreu del 1553?",
      "options": [
        "El vidre bufat i la vidrieria",
        "La filigrana i l'argenteria",
        "El treball del suro i la tapineria",
        "La terrissa i la ceràmica"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-123",
      "text": "Quin és l'únic celler documentat amb seu al municipi de Piera?",
      "options": [
        "Caves Pagès Entrena",
        "Can Bonastre Wine Resort",
        "Caves Ca l'Esquerrà del Bedorc",
        "Caves Sescorts del Portell"
      ],
      "correct": 0,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-124",
      "text": "Quina espècie ramadera és, amb molta diferència, la més important de Piera?",
      "options": [
        "El bestiar porcí, amb uns 171.000 caps",
        "El bestiar oví, amb uns 171.000 caps",
        "L'aviram, amb uns 171.000 caps",
        "El bestiar boví, amb uns 171.000 caps"
      ],
      "correct": 2,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-125",
      "text": "Quin dia se celebra el mercat setmanal de Piera?",
      "options": [
        "El dilluns",
        "El dimecres",
        "El divendres",
        "El dissabte"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-126",
      "text": "Quan se celebra la fira d'artesania de Piera?",
      "options": [
        "L'últim diumenge de cada mes",
        "El primer dissabte de cada mes",
        "Dos cops l'any, per Nadal i per Sant Joan",
        "Cada dijous, coincidint amb el mercat setmanal"
      ],
      "correct": 1,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-127",
      "text": "Què diu l'Idescat sobre l'oferta d'allotjament turístic de Piera?",
      "options": [
        "Cap hotel",
        "Cap càmping",
        "Un únic establiment de turisme rural",
        "Totes les respostes anteriors són correctes"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-128",
      "text": "A quina línia ferroviària pertany l'estació de Piera?",
      "options": [
        "A la línia R4 de Rodalies de Catalunya, de Manresa a Vilafranca",
        "A la línia Llobregat-Anoia de FGC",
        "A la línia Barcelona-Vallès dels Ferrocarrils de la Generalitat",
        "A la línia d'alta velocitat de Barcelona a Lleida"
      ],
      "correct": 1,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-129",
      "text": "Quines línies de FGC tenen parada a l'estació de Piera?",
      "options": [
        "Les línies S3 i S4",
        "Les línies R6 i R60",
        "Les línies R5 i R50",
        "Les línies L8 i R5"
      ],
      "correct": 1,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-130",
      "text": "A quina zona tarifària pertany l'estació de Piera?",
      "options": [
        "A la zona 4C",
        "A la zona 1A",
        "A la zona 3B",
        "A la zona 6C"
      ],
      "correct": 0,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-131",
      "text": "Quines són les estacions veïnes de la de Piera a la línia Llobregat-Anoia?",
      "options": [
        "Capellades, cap a Igualada, i Gelida, cap a Barcelona",
        "Els Hostalets de Pierola i la Pobla de Claramunt",
        "Martorell Vila i Sant Sadurní d'Anoia",
        "Masquefa i Vallbona d'Anoia"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-132",
      "text": "Quantes estacions de ferrocarril hi ha dins del terme municipal de Piera?",
      "options": [
        "Una de sola",
        "Dues, la de Piera i la del Bedorc",
        "Tres, repartides pels nuclis del terme",
        "Cap ni una: la més propera és la de Masquefa"
      ],
      "correct": 0,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-133",
      "text": "Quina carretera travessava tradicionalment el nucli urbà de Piera abans de la construcció de la variant?",
      "options": [
        "La B-224, de Capellades a Martorell",
        "La C-15, de Vilanova i la Geltrú a Igualada",
        "La C-37, d'Igualada a Manresa i Vic",
        "L'A-2, de Barcelona a Lleida per Igualada"
      ],
      "correct": 0,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-134",
      "text": "Amb quina denominació oficial va quedar designada la variant de Piera, posada en servei el 12 d'abril de 2024?",
      "options": [
        "B-224 (denominació mantinguda)",
        "C-54",
        "C-15 (eix Vilanova-Igualada)",
        "BV-2242 (via de Sant Sadurní)"
      ],
      "correct": 1,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-135",
      "text": "Quina obra d'art singular incorpora la variant de Piera?",
      "options": [
        "Un túnel de 340 metres sota el turó del castell de Piera",
        "Un pont penjant de 120 metres sobre el riu Anoia",
        "Una rotonda elevada sobre la línia Llobregat-Anoia de FGC",
        "Un viaducte de 77 metres sobre la riera de Ca n'Aguilera"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-136",
      "text": "On es troba la Comissaria de la Policia Local de Piera?",
      "options": [
        "Al carrer Folch i Torres, 35",
        "Al carrer de la Plaça, 16-18, a la Casa de la Vila",
        "A l'avinguda del Gall Mullat, 7",
        "Al passeig del Prat, 2-4"
      ],
      "correct": 0,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-137",
      "text": "Quina particularitat té el Centre d'Atenció Primària (CAP) de Piera?",
      "options": [
        "Només obre els matins, de dilluns a divendres",
        "Està obert les 24 hores",
        "És un consultori local depenent del CAP de Masquefa",
        "Està gestionat directament per l'Ajuntament de Piera"
      ],
      "correct": 1,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-138",
      "text": "Quin any es va fundar l'Agrupació Esportiva Piera, el club de futbol del municipi?",
      "options": [
        "L'any 1920",
        "L'any 1959",
        "L'any 1960",
        "L'any 1940"
      ],
      "correct": 3,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-139",
      "text": "Quin equipament esportiu de Piera té una capacitat d'unes 1.000 places i hi juga l'Hoquei Club Piera?",
      "options": [
        "El Camp Municipal d'Esports del passeig del Prat",
        "La Piscina Municipal coberta",
        "El Pavelló Poliesportiu El Prat",
        "El Centre de Serveis La Bòbila"
      ],
      "correct": 2,
      "reference": "Economia, equipaments, transport i esports"
    },
    {
      "id": "piera-cultura-140",
      "text": "Quines espècies dominen la coberta forestal del terme de Piera?",
      "options": [
        "Els pins pinyers i blancs, i els alzinars",
        "Les fagedes i els avetars d'alta muntanya",
        "Les suredes i els boscos de castanyers",
        "Els boscos de ribera de pollancres i verns"
      ],
      "correct": 0,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-141",
      "text": "Quin espai natural de Piera, situat al nord-oest del Bedorc, ha estat declarat arbreda monumental?",
      "options": [
        "La pineda de Can Ferrer del Coll",
        "El paratge de les Flandes",
        "La pineda del Portell",
        "L'alzinar de Can Mata"
      ],
      "correct": 0,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-142",
      "text": "De quin any daten els arbres monumentals que envolten la font del Prat de Piera?",
      "options": [
        "Del 1759",
        "Del 1864",
        "Del 1910",
        "Del 1953"
      ],
      "correct": 1,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-143",
      "text": "Quina generació de residus municipals té Piera, segons l'Idescat?",
      "options": [
        "0,85 kg per habitant i dia, per sota de la mitjana catalana",
        "1,28 kg per habitant i dia, igual que la mitjana comarcal",
        "2,95 kg per habitant i dia, la xifra més alta de Catalunya",
        "1,81 kg per habitant i dia"
      ],
      "correct": 3,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-144",
      "text": "Quin percentatge de recollida selectiva té Piera, segons l'Idescat?",
      "options": [
        "El 49,2%, exactament la mitjana catalana",
        "El 43,0%",
        "El 65,4%, molt per damunt de la mitjana catalana",
        "El 21,7%, la xifra més baixa de l'Anoia"
      ],
      "correct": 1,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-145",
      "text": "Quina afirmació és correcta sobre el POUM de Piera?",
      "options": [
        "Va ser aprovat definitivament el 3 de maig de 2018",
        "El va aprovar la Comissió Territorial d'Urbanisme de la Catalunya Central",
        "Preveu corredors verds que connecten el nucli urbà amb 19 barris",
        "Totes les respostes anteriors són correctes"
      ],
      "correct": 3,
      "reference": "Medi ambient"
    },
    {
      "id": "piera-cultura-146",
      "text": "Qui exerceix l'alcaldia de Piera des del juny de 2023?",
      "options": [
        "Josep Llopart Gardela, de Junts per Piera",
        "Jordi Madrid Roca, de Som Piera",
        "Carme González Anjaumà (Sumem per Piera)",
        "Neus Núñez Bosch, d'Esquerra Republicana"
      ],
      "correct": 2,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "piera-cultura-147",
      "text": "Quants regidors i regidores integren el Ple de l'Ajuntament de Piera?",
      "options": [
        "17",
        "13",
        "15",
        "21"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "piera-cultura-148",
      "text": "Quins grups formen el govern municipal de Piera del mandat 2023-2027?",
      "options": [
        "Sumem per Piera i ERC, amb 9 regidors",
        "Junts per Piera i Vox Piera, amb 9 regidors",
        "Sumem per Piera en solitari, amb 9 regidors",
        "Esquerra Republicana i Som Piera, amb 9 regidors"
      ],
      "correct": 0,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "piera-cultura-149",
      "text": "Qui ocupa la primera tinença d'alcaldia de Piera en el mandat 2023-2027?",
      "options": [
        "Iban Pujol Maried (Sumem per Piera)",
        "Raquel Calsina Galán (ERC-Piera)",
        "Gemma Millán Gibert (Sumem per Piera)",
        "Neus Núñez Bosch (ERC)"
      ],
      "correct": 3,
      "reference": "Alcaldia i ple municipal"
    },
    {
      "id": "piera-cultura-150",
      "text": "Quina data va prosperar la moció de censura que va convertir Josep Llopart Gardela en alcalde de Piera?",
      "options": [
        "El 17 de juny de 2023",
        "El 23 de juny de 2009",
        "El 28 de maig de 2023",
        "El 4 de desembre de 2020"
      ],
      "correct": 3,
      "reference": "Alcaldia i ple municipal"
    }
  ]
};

export default pieraCultura;
