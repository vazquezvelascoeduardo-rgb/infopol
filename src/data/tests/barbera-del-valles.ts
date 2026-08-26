// Test específic Barberà del Vallès — àmbit municipal (teòric) + coneixement del municipi.
// 300 preguntes per a oposicions d'Agent de Policia Local de Barberà del Vallès.
import type { TestTopic } from './types';

const barberaDelValles: TestTopic = {
  "slug": "barbera-del-valles",
  "title": "Barberà del Vallès",
  "description": "teòric municipal i cultura de la ciutat: organització, ordenances, patrimoni i festes",
  "icon": "🏛️",
  "accent": "from-orange-500 to-red-600",
  "category": "municipi",
  "municipi": "Barberà del Vallès",
  "badge": "🆕 2026",
  "questions": [
    {
      "id": "barbera-del-valles-t1",
      "text": "Qui ocupa l'Alcaldia de Barberà del Vallès en el mandat 2023-2027?",
      "options": [
        "Xavier Garcés Trillo",
        "Daniel González Cabrera",
        "Guillem Vilaregut Pérez",
        "Pere Pubill i Linares"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t2",
      "text": "Quin és el nombre legal de membres del Ple de l'Ajuntament de Barberà del Vallès?",
      "options": [
        "17 regidors i regidores",
        "21 regidors i regidores",
        "25 regidors i regidores",
        "19 regidors i regidores"
      ],
      "correct": 1,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t3",
      "text": "En quina data es va celebrar la sessió constitutiva de la Corporació i la investidura de l'alcalde?",
      "options": [
        "17 de juny de 2023",
        "28 de juny de 2023",
        "28 de maig de 2023",
        "3 de juliol de 2023"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t4",
      "text": "Amb quants vots va ser investit alcalde el cap de la llista més votada, en no assolir cap candidat la majoria absoluta?",
      "options": [
        "11 vots",
        "7 vots",
        "8 vots",
        "9 vots"
      ],
      "correct": 1,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t5",
      "text": "Quina formació va obtenir més regidors a les eleccions municipals de 28 de maig de 2023?",
      "options": [
        "PSC-CP, amb 7 regidors",
        "TxB-ARA PL, amb 3 regidors",
        "ERC-AM, amb 2 regidors",
        "PCPB, amb 3 regidors"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t6",
      "text": "Quants regidors o regidores no adscrits hi ha actualment al Ple municipal?",
      "options": [
        "2",
        "3",
        "Cap",
        "1"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t7",
      "text": "A qui correspon actualment la delegació de \"Policia Local i Seguretat comunitària\"?",
      "options": [
        "Directament a l'alcalde, sense delegació",
        "Al 2n tinent d'alcaldia, Pere Pubill i Linares",
        "Al 1r tinent d'alcaldia, Daniel González Cabrera",
        "A la regidora Gemma Vinardell i Amat"
      ],
      "correct": 2,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t8",
      "text": "Qui té atribuïda la matèria de \"Procediments sancionadors d'àmbit local\"?",
      "options": [
        "Carles Ortiz i Guarch",
        "Daniel González Cabrera",
        "Pere Pubill i Linares",
        "Mònica Sempere Creus"
      ],
      "correct": 2,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t9",
      "text": "Qui té delegades les competències de \"Mobilitat, transport públic i zones d'estacionament\"?",
      "options": [
        "Mònica Sempere Creus, 3a tinenta d'alcaldia",
        "Carles Ortiz i Guarch, 4t tinent d'alcaldia",
        "Susana González Rivas",
        "Joan Francesc Múñoz Altimira, 5è tinent d'alcaldia"
      ],
      "correct": 3,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t10",
      "text": "Quina regidora té delegades les àrees de Protecció Civil, Benestar Animal i Convivència i civisme?",
      "options": [
        "Gemma Vinardell i Amat",
        "Mònica Sempere Creus",
        "Susana González Rivas",
        "Isabel Otero Cuesta"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t11",
      "text": "Quan se celebren les sessions ordinàries del Ple de Barberà del Vallès?",
      "options": [
        "Els penúltims dimecres laborables de cada mes, a les 19 hores",
        "Els segons dimarts de cada mes, a les 18.30 hores",
        "Els primers dilluns de cada mes, a les 18 hores",
        "Els últims dijous de cada mes, a les 19 hores"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t12",
      "text": "Què passa si el dia fixat per a la sessió ordinària del Ple coincideix amb un dia festiu?",
      "options": [
        "La sessió es trasllada al dimecres següent",
        "La sessió s'ajorna 48 hores",
        "La sessió es fa el dimecres immediat anterior",
        "La sessió es converteix automàticament en extraordinària"
      ],
      "correct": 2,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t13",
      "text": "Com està composta la Junta de Govern Local de Barberà del Vallès?",
      "options": [
        "Per l'alcalde-president i 5 regidors, que són els cinc tinents d'alcaldia",
        "Per l'alcalde-president i 7 regidors",
        "Per l'alcalde-president i 4 regidors",
        "Per l'alcalde-president i els portaveus de tots els grups municipals"
      ],
      "correct": 0,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t14",
      "text": "Quin és el règim de sessions ordinàries de la Junta de Govern Local?",
      "options": [
        "Els dimarts a les 9.00 h",
        "Els dijous a les 12.00 h, totes resolutives",
        "Els dimecres laborables, alternant sessions resolutives a les 11.00 h i sessions deliberants a les 18.00 h",
        "Els dilluns a les 10.00 h, totes deliberants"
      ],
      "correct": 2,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t15",
      "text": "Quantes comissions informatives permanents va acordar crear el Ple de 28 de juny de 2023?",
      "options": [
        "Cap; les funcions les assumeix la Junta de Portaveus",
        "Tres, corresponents als tres grans àmbits de gestió",
        "Una per cada àrea de govern",
        "Una de sola, de caràcter deliberant, per a tots els àmbits de gestió"
      ],
      "correct": 3,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t16",
      "text": "Qui presideix, per delegació de l'Alcaldia i amb efectes de 8 de febrer de 2024, la Comissió Informativa Permanent?",
      "options": [
        "Daniel González Cabrera",
        "Pere Pubill i Linares",
        "Mònica Sempere Creus",
        "L'alcalde, sense possibilitat de delegació"
      ],
      "correct": 1,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t17",
      "text": "Quin és el llindar de competència del Ple en matèria de contractacions i concessions?",
      "options": [
        "Quan superin el 10% dels recursos ordinaris i, en tot cas, 3.005.060,52 €",
        "Quan superin el 10% dels recursos ordinaris del pressupost i, en tot cas, 6.010.121,04 €",
        "Quan superin el 25% dels recursos ordinaris i, en tot cas, 12.020.242,08 €",
        "Quan superin el 20% dels recursos ordinaris i, en tot cas, 3.005.060,52 €"
      ],
      "correct": 1,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t18",
      "text": "On es troba la Casa Consistorial de Barberà del Vallès?",
      "options": [
        "Carrer Estoril, 2",
        "Passeig del Doctor Moragas, 2",
        "Avinguda Generalitat, 70",
        "Carrer Circumval·lació, 16"
      ],
      "correct": 2,
      "reference": "Teòric · Organització municipal i cartipàs"
    },
    {
      "id": "barbera-del-valles-t19",
      "text": "Quan es va aprovar DEFINITIVAMENT el Reglament Orgànic Municipal de Barberà del Vallès i quan es va publicar el seu text íntegre al BOPB?",
      "options": [
        "Aprovat definitivament pel Ple de 28 de juny de 2023 i text íntegre publicat al BOPB de 8 d'agost de 2023",
        "Aprovat definitivament pel Ple de 21 de desembre de 2022 i text íntegre publicat al BOPB de 5 de gener de 2023",
        "Aprovat definitivament pel Ple de 22 de març de 2023 i text íntegre publicat al BOPB de 20 d'abril de 2023",
        "Aprovat definitivament pel Ple de 26 de març de 2010 i text íntegre publicat al BOPB de 14 d'agost de 2014"
      ],
      "correct": 2,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t20",
      "text": "De quants articles consta el ROM de Barberà del Vallès?",
      "options": [
        "108",
        "126",
        "138",
        "74"
      ],
      "correct": 1,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t21",
      "text": "Segons l'article 6 del ROM, quin és el règim lingüístic de l'Ajuntament?",
      "options": [
        "El català i el castellà s'utilitzen indistintament en tota la documentació",
        "El ROM no regula la qüestió lingüística",
        "El català només s'utilitza en les actes del Ple",
        "El català és la llengua pròpia i d'ús normal; tota la documentació municipal s'ha de redactar en català, sens perjudici del dret de la ciutadania a relacionar-s'hi en castellà"
      ],
      "correct": 3,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t22",
      "text": "Segons l'article 7 del ROM, quan es constitueix la Corporació després d'unes eleccions municipals?",
      "options": [
        "El quinzè dia natural posterior a les eleccions",
        "El vintè dia natural posterior a les eleccions, a les 12 hores",
        "El trentè dia natural posterior a les eleccions",
        "El vintè dia hàbil posterior a les eleccions"
      ],
      "correct": 1,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t23",
      "text": "Segons el mateix article 7 del ROM, si s'ha presentat recurs contenciós electoral, la Corporació es constitueix:",
      "options": [
        "El quarantè dia posterior a les eleccions",
        "En el mateix termini ordinari, sense cap alteració",
        "El trentè dia posterior a les eleccions",
        "El seixantè dia posterior a les eleccions"
      ],
      "correct": 0,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t24",
      "text": "Segons l'article 9 del ROM, si a la sessió constitutiva no s'assoleix el quòrum de la majoria absoluta dels electes, la sessió queda automàticament convocada:",
      "options": [
        "Cinc dies després",
        "Dos dies després",
        "L'endemà",
        "Una hora després"
      ],
      "correct": 1,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t25",
      "text": "Segons l'article 33 del ROM, el nomenament com a membre de la Junta de Govern Local s'entén tàcitament acceptat si no hi ha renúncia expressa en el termini de:",
      "options": [
        "24 hores",
        "10 dies naturals",
        "5 dies hàbils",
        "3 dies hàbils"
      ],
      "correct": 3,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t26",
      "text": "Segons l'article 36 del ROM, amb quina periodicitat mínima ha de celebrar sessions ordinàries de caràcter resolutiu la Junta de Govern Local?",
      "options": [
        "Mensualment",
        "Cada deu dies",
        "Setmanalment",
        "Com a mínim cada quinze dies"
      ],
      "correct": 3,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t27",
      "text": "Segons l'article 37 del ROM, amb quina antelació mínima s'ha de trametre la convocatòria de les sessions de la Junta de Govern Local?",
      "options": [
        "24 hores",
        "48 hores",
        "Dos dies hàbils",
        "72 hores"
      ],
      "correct": 0,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t28",
      "text": "Segons l'article 38 del ROM, com es constitueix la Junta de Govern Local en segona convocatòria?",
      "options": [
        "48 hores després, amb un terç dels seus membres",
        "24 hores després, amb majoria absoluta dels seus membres",
        "Una hora després, amb un terç dels seus membres i mai amb un nombre inferior a tres",
        "Dos dies després, amb la meitat més un dels membres"
      ],
      "correct": 2,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t29",
      "text": "Segons l'article 52 del ROM, la segona convocatòria de les sessions del Ple es produeix:",
      "options": [
        "Dos dies hàbils després",
        "Una hora després",
        "48 hores després",
        "24 hores després"
      ],
      "correct": 2,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t30",
      "text": "Segons l'article 53 del ROM (principi d'unitat d'acte), quina és l'hora límit de finalització de les sessions del Ple?",
      "options": [
        "Les 24 hores del mateix dia, amb una pròrroga preferentment no superior a 30 minuts",
        "Les 22.30 hores, prorrogable fins a la mitjanit",
        "Les 24 hores, sense possibilitat de pròrroga",
        "Les 23 hores, prorrogable 60 minuts"
      ],
      "correct": 0,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t31",
      "text": "Segons l'article 65 del ROM, quina durada té la intervenció de la ciutadania en el torn de precs i preguntes?",
      "options": [
        "3 minuts, amb dret de rèplica de 2 minuts",
        "5 minuts, sense dret de rèplica",
        "Un màxim de 5 minuts, amb dret de rèplica del grup al·ludit de 3 minuts",
        "10 minuts, amb dret de rèplica de 5 minuts"
      ],
      "correct": 2,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t32",
      "text": "Segons l'article 94 del ROM, quina naturalesa té la Junta de Portaveus?",
      "options": [
        "És un òrgan necessari amb funcions executives delegades de l'Alcaldia",
        "És un òrgan resolutiu i les seves decisions són vinculants",
        "És una comissió informativa de caràcter especial",
        "És un òrgan complementari, deliberant i consultiu, no resolutiu; les seves decisions no són preceptives ni vinculants ni generen acte administratiu"
      ],
      "correct": 3,
      "reference": "Teòric · Reglament orgànic municipal"
    },
    {
      "id": "barbera-del-valles-t33",
      "text": "On es troba la comissaria de la Policia Local de Barberà del Vallès?",
      "options": [
        "Carrer Estoril, 2",
        "Carrer Circumval·lació, 16",
        "Passeig del Doctor Moragas, 2",
        "Avinguda Generalitat, 70"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t34",
      "text": "Quin és el telèfon de la Policia Local de Barberà del Vallès?",
      "options": [
        "937 190 090",
        "937 191 815",
        "937 185 464",
        "937 297 171"
      ],
      "correct": 0,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t35",
      "text": "Quin és el número d'emergències de la Policia Local des d'un telèfon fix?",
      "options": [
        "112, en exclusiva",
        "092",
        "091",
        "088"
      ],
      "correct": 1,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t36",
      "text": "Segons el Pla Local de Seguretat 2024-2027, de quants efectius consta la plantilla de la Policia Local?",
      "options": [
        "35 persones",
        "40 persones",
        "50 persones",
        "45 persones"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t37",
      "text": "Quina és la màxima categoria del cos segons l'organigrama de la Policia Local recollit al Pla Local de Seguretat?",
      "options": [
        "Sotsinspector",
        "Inspector Cap",
        "Intendent",
        "Sergent"
      ],
      "correct": 1,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t38",
      "text": "Quants sergents preveu l'organigrama de comandament de la Policia Local?",
      "options": [
        "5",
        "2",
        "3",
        "4"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t39",
      "text": "Quines són les àrees assignades als sergents segons l'organigrama de la Policia Local?",
      "options": [
        "Seguretat Ciutadana, Atestats i Formació",
        "Trànsit, Judicial i Medi Ambient",
        "Administració, Trànsit i Proximitat",
        "Recursos Materials i Via Pública; Trànsit; i Seguretat Ciutadana"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t40",
      "text": "Quin era el parc mòbil de la Policia Local l'any 2023?",
      "options": [
        "6 cotxes i 3 motocicletes",
        "5 cotxes i 6 motocicletes",
        "4 cotxes i 5 motocicletes",
        "5 cotxes (1 furgoneta, 3 vehicles logotipats i 1 camuflat) i 4 motocicletes"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t41",
      "text": "De quants etilòmetres disposava la Policia Local segons l'inventari de 2023?",
      "options": [
        "3 etilòmetres evidencials i 2 etilòmetres de mostreig",
        "1 etilòmetre evidencial i 4 de mostreig",
        "2 etilòmetres evidencials i 3 etilòmetres de mostreig",
        "2 etilòmetres evidencials i 2 de mostreig"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t42",
      "text": "Quants dispositius elèctrics de control (Taser) té la Policia Local segons el Pla Local de Seguretat?",
      "options": [
        "Cap",
        "2",
        "4",
        "1"
      ],
      "correct": 1,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t43",
      "text": "Quants desfibril·ladors (DEA) van a bord de patrulles de la Policia Local?",
      "options": [
        "15",
        "5",
        "4",
        "2"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t44",
      "text": "Quantes actuacions va dur a terme la Policia Local l'any 2022?",
      "options": [
        "7.124",
        "6.421",
        "7.421",
        "4.721"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t45",
      "text": "A quina Àrea Bàsica Policial i a quina Regió Policial pertany Barberà del Vallès?",
      "options": [
        "ABP de Cerdanyola, Regió Policial Metropolitana Nord",
        "ABP de Ripollet, Regió Policial Central",
        "ABP de Sabadell, Regió Policial Metropolitana Nord",
        "ABP de Cerdanyola, Regió Policial Metropolitana Sud"
      ],
      "correct": 0,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t46",
      "text": "Quines comissaries inclou l'ABP de Cerdanyola, a banda de la pròpia?",
      "options": [
        "Barberà del Vallès, Badia del Vallès i Santa Perpètua de Mogoda",
        "Barberà del Vallès, Montcada i Ripollet",
        "Barberà del Vallès, Cerdanyola i Badia del Vallès",
        "Barberà del Vallès, Sabadell i Ripollet"
      ],
      "correct": 1,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t47",
      "text": "On es troba la comissaria dels Mossos d'Esquadra de Barberà del Vallès?",
      "options": [
        "Avinguda Generalitat, 70",
        "Passeig del Doctor Moragas, 2",
        "Carrer Estoril, 2",
        "El municipi no disposa de comissaria pròpia de Mossos d'Esquadra"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t48",
      "text": "On es troba el parc de Bombers de la Generalitat de referència per a Barberà del Vallès?",
      "options": [
        "Ripollet",
        "Cerdanyola del Vallès",
        "Santa Perpètua de Mogoda",
        "Sabadell"
      ],
      "correct": 1,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t49",
      "text": "Quina norma estableix l'obligatorietat de la Junta Local de Seguretat per a tots els municipis amb Policia Local?",
      "options": [
        "L'article 25 de la Llei 7/1985, reguladora de les bases del règim local",
        "L'article 9 de la Llei 4/1997, de protecció civil de Catalunya",
        "L'article 9 de la Llei 16/1991, de les policies locals de Catalunya",
        "L'article 9 de la Llei 4/2003, d'ordenació del sistema de seguretat pública de Catalunya"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t50",
      "text": "Qui integra la Comissió Local de Seguretat (comissió tècnica) de Barberà del Vallès?",
      "options": [
        "El Cap de la Policia Local, el Regidor de Mobilitat i Seguretat, el Cap de Serveis Socials i el Cap de l'Oficina de Polítiques de Gènere",
        "L'alcalde, el Cap de la Policia Local i el Cap de l'ABP dels Mossos d'Esquadra",
        "Els cinc tinents d'alcaldia i el Cap de la Policia Local",
        "L'alcalde, els portaveus dels grups municipals i el secretari"
      ],
      "correct": 0,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t51",
      "text": "Qui va aprovar el Pla Local de Seguretat 2024-2027 de Barberà del Vallès, i quan?",
      "options": [
        "El Ple municipal, el 18 de novembre de 2020",
        "L'alcalde, mitjançant decret, el 8 de febrer de 2024",
        "La Junta Local de Seguretat, el 12 de desembre de 2023",
        "La Junta de Govern Local, el 12 de desembre de 2023"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t52",
      "text": "Quants objectius estratègics conté el Pla Local de Seguretat 2024-2027?",
      "options": [
        "6",
        "5",
        "7",
        "4"
      ],
      "correct": 0,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t53",
      "text": "Fins a quina xifra recomana el Pla Local de Seguretat incrementar progressivament la plantilla de la Policia Local?",
      "options": [
        "45 efectius consolidats",
        "55 efectius consolidats",
        "60 efectius consolidats",
        "50 efectius consolidats"
      ],
      "correct": 3,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t54",
      "text": "Quina o quines d'aquestes actuacions preveu el Pla Local de Seguretat 2024-2027?",
      "options": [
        "La construcció d'una galeria de tir pròpia a la comissaria",
        "El desplegament de dispositius de videovigilància amb lectors de matrícules",
        "Les respostes a) i b) són correctes",
        "Cap de les anteriors"
      ],
      "correct": 2,
      "reference": "Teòric · Policia local, junta local de seguretat i pla local de seguretat"
    },
    {
      "id": "barbera-del-valles-t55",
      "text": "Com es va aprovar el text refós vigent de l'Ordenança general per a la convivència i el civisme de Barberà del Vallès?",
      "options": [
        "Per Decret d'Alcaldia núm. 2014LLDC001709, de 28 de juliol de 2014, publicat íntegrament al BOPB de 14 d'agost de 2014",
        "Per acord del Ple de 26 de març de 2010, publicat al BOPB de 14 d'agost de 2014",
        "Per Decret d'Alcaldia de 28 de juliol de 2010, publicat al BOPB d'agost de 2010",
        "Per acord del Ple de 27 de desembre de 2012, publicat al BOPB de l'1 de febrer de 2013"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t56",
      "text": "Quina és l'estructura del text refós de l'Ordenança de convivència i civisme?",
      "options": [
        "7 títols i 108 articles",
        "6 títols i 138 articles",
        "10 títols i 74 articles",
        "6 títols i 126 articles"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t57",
      "text": "Quan va entrar en vigor l'Ordenança general per a la convivència i el civisme, en la seva redacció original?",
      "options": [
        "L'1 de febrer de 2013",
        "L'1 de maig de 2010",
        "El 14 d'agost de 2014",
        "El 26 de març de 2010"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t58",
      "text": "Quina matèria regula el Títol VI de l'Ordenança de convivència i civisme?",
      "options": [
        "Les vies i els espais públics",
        "Els usos i les activitats a les vies i espais públics",
        "L'entorn urbà",
        "Les infraccions i les sancions"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t59",
      "text": "Segons l'article 122.1.a) de l'Ordenança de convivència i civisme, quina és l'escala de multes?",
      "options": [
        "Lleus, fins a 750 €; greus, fins a 1.500 €; molt greus, fins a 3.000 €",
        "Lleus, de 100 a 400 €; greus, de 401 a 1.000 €; molt greus, de 1.001 a 3.000 €",
        "Lleus, multa de fins a 300,00 €; greus, de 300,01 a 900,00 €; molt greus, de 900,01 a 1.800,00 €",
        "Lleus, fins a 100 €; greus, 200 €; molt greus, 500 €"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t60",
      "text": "Segons l'article 131 de l'Ordenança de convivència i civisme, quan prescriuen les INFRACCIONS?",
      "options": [
        "Molt greus als 3 anys, greus als 2 anys i lleus als 6 mesos",
        "Molt greus als 3 anys, greus als 2 anys i lleus a l'any",
        "Molt greus als 2 anys, greus a l'any i lleus als 6 mesos",
        "Molt greus als 4 anys, greus als 2 anys i lleus a l'any"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t61",
      "text": "Segons el mateix article 131, quan prescriuen les SANCIONS?",
      "options": [
        "Als 5 anys, als 3 anys i a l'any, respectivament",
        "Als 3 anys les imposades per molt greus, als 2 anys per greus i a l'any per lleus",
        "Als 3 anys les imposades per molt greus, als 2 anys per greus i als 6 mesos per lleus",
        "A l'any, en tots els casos"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t62",
      "text": "Interrompuda la prescripció per la iniciació del procediment amb coneixement de l'interessat, es reprèn el termini si l'expedient resta paralitzat per causa no imputable al presumpte responsable durant:",
      "options": [
        "Més de 3 mesos",
        "Més de 15 dies",
        "Més de 6 mesos",
        "Més d'un mes"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t63",
      "text": "Segons l'article 120.1 de l'Ordenança de civisme, la reiteració en infraccions greus en els darrers cinc anys es qualifica com a infracció:",
      "options": [
        "Lleu",
        "Greu",
        "Molt greu",
        "No té cap efecte sobre la qualificació"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t64",
      "text": "Segons l'article 120.2 de l'Ordenança de civisme, en quin període ha d'haver-hi reiteració en infraccions lleus perquè la conducta es qualifiqui de greu?",
      "options": [
        "En els darrers tres mesos",
        "En els darrers sis mesos",
        "En els darrers cinc anys",
        "En el darrer any"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t65",
      "text": "Segons l'article 121.1.j) de l'Ordenança de civisme, hi ha reincidència quan es comet més d'una infracció de la mateixa naturalesa, declarada per resolució ferma, en el termini de:",
      "options": [
        "Un any",
        "Tres mesos",
        "Dos anys",
        "Sis mesos"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t66",
      "text": "Segons l'article 127.5 de l'Ordenança de civisme, a qui correspon la potestat sancionadora?",
      "options": [
        "A la Junta de Govern Local",
        "A la Junta de Portaveus",
        "Al Ple de la Corporació",
        "A l'alcalde/essa, o a altres òrgans municipals amb competència per atribució sectorial, desconcentració o delegació"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t67",
      "text": "Segons l'article 126.1 de l'Ordenança de civisme, quan es vol substituir la sanció pecuniària a un menor per mesures correctores:",
      "options": [
        "Cal l'opinió dels pares o tutors, que serà vinculant",
        "Només cal si el menor té menys de 14 anys",
        "Cal l'opinió dels pares o tutors, que és preceptiva però no vinculant",
        "No cal cap tràmit amb els pares o tutors"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t68",
      "text": "Segons l'article 126.2 de l'Ordenança de civisme, els pares, tutors o guardadors responen dels danys causats pels menors en qualitat de responsables civils:",
      "options": [
        "Solidaris",
        "Subsidiaris",
        "Responsables penals directes",
        "No responen en cap cas"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t69",
      "text": "Segons l'article 137 de l'Ordenança de civisme, en quin termini es pot sol·licitar la substitució de la sanció econòmica per treballs voluntaris per a la comunitat o tasques socioeducatives?",
      "options": [
        "15 dies des de la notificació de la resolució",
        "Tres mesos des de la notificació de la resolució",
        "10 dies hàbils des de la notificació de la resolució",
        "Un mes des de la notificació de la resolució"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t70",
      "text": "Segons la disposició addicional 4a de l'Ordenança de civisme, com s'actualitzen les quanties de les multes de l'article 122?",
      "options": [
        "Per acord de la Junta de Govern Local, sense necessitat de modificar l'ordenança",
        "Per acord del Ple, amb modificació de l'ordenança",
        "Per resolució del regidor delegat de Convivència",
        "Per decret de l'Alcaldia"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t71",
      "text": "Segons l'article 31 de l'Ordenança de civisme, quin és l'horari permès per a obres i treballs a la via pública?",
      "options": [
        "De dilluns a divendres no festius, de 8 a 21 h; dissabtes, de 9 a 14 h",
        "De dilluns a divendres no festius, de 8 a 20 h; dissabtes, de 10 a 13 h",
        "De dilluns a divendres, de 7 a 22 h; dissabtes, de 10 a 14 h",
        "De dilluns a divendres no festius, de 8 a 20 h; dissabtes no festius, de 9 a 14 h"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t72",
      "text": "Segons l'article 41 de l'Ordenança de civisme, quins períodes d'instal·lació de terrasses estableix l'ordenança?",
      "options": [
        "Dos períodes: de l'1 d'abril al 31 d'octubre i de l'1 de novembre al 31 de març",
        "Quatre períodes trimestrals",
        "Un únic període anual, coincident amb l'any natural",
        "Un únic període, de l'1 de maig al 30 de setembre"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t73",
      "text": "Segons l'article 60.1 de l'Ordenança de civisme, què queda prohibit als espais públics fora dels àmbits i les dates expressament autoritzats?",
      "options": [
        "Únicament la venda de begudes alcohòliques",
        "El consum, la venda i la distribució de begudes alcohòliques",
        "Únicament el consum de begudes alcohòliques",
        "Únicament el consum per part de menors d'edat"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t74",
      "text": "Segons l'article 60.5 de l'Ordenança de civisme, què poden fer els agents de l'autoritat amb les begudes alcohòliques consumides indegudament a la via pública?",
      "options": [
        "No poden adoptar cap mesura sobre les begudes",
        "Han de lliurar-les obligatòriament al dipòsit municipal",
        "Només poden intervenir-les amb autorització judicial prèvia",
        "Poden retirar-les o intervenir-les per a la seva destrucció ulterior"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t75",
      "text": "Segons els articles 77 i 135.2 de l'Ordenança de civisme, els grafits i les pintades realitzats sobre monuments, edificis públics o mobiliari urbà es qualifiquen com a infracció:",
      "options": [
        "Lleu",
        "Molt greu",
        "L'ordenança no els tipifica",
        "Greu"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t76",
      "text": "Segons l'article 62.2 de l'Ordenança de civisme, quina mesura correspon davant la tinença o el transport d'armes —fins i tot amb llicència— sense respectar-ne les condicions, o d'estris susceptibles de ser usats com a armes?",
      "options": [
        "Un advertiment verbal de l'agent actuant",
        "El decomís per part de la Policia Local",
        "La immobilització cautelar de l'objecte durant 48 hores",
        "El trasllat de l'objecte al dipòsit municipal"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t77",
      "text": "Segons l'article 63.5 de l'Ordenança de civisme, com es considera la mendicitat que utilitza menors de forma directa o indirecta?",
      "options": [
        "Especialment greu",
        "No està tipificada per l'ordenança",
        "Infracció lleu",
        "Infracció greu"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t78",
      "text": "Segons l'article 90.1 de l'Ordenança de civisme, quin és el temps màxim d'ocupació de les zones reservades a càrrega i descàrrega, llevat d'indicació distinta de la senyalització?",
      "options": [
        "15 minuts",
        "20 minuts",
        "30 minuts",
        "45 minuts"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t79",
      "text": "Segons l'article 90.2 de l'Ordenança de civisme, en quina franja horària NO s'admeten activitats de càrrega i descàrrega al nucli urbà?",
      "options": [
        "Entre les 22 h i les 8 h",
        "Entre les 22 h i les 7 h",
        "Entre les 21 h i les 8 h",
        "Entre les 23 h i les 6 h"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t80",
      "text": "En relació amb els articles 116 i 117 de l'Ordenança de civisme, quina d'aquestes afirmacions és certa?",
      "options": [
        "Els fets constatats pels agents de l'autoritat tenen valor probatori",
        "Es poden incorporar a l'expedient imatges obtingudes per fotografia o filmació digital",
        "L'instructor pot declarar confidencials les dades del denunciant quan aquest ho sol·liciti",
        "Totes les respostes anteriors són correctes"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança general per a la convivència i el civisme"
    },
    {
      "id": "barbera-del-valles-t81",
      "text": "Quina és l'estructura de l'Ordenança reguladora de la tinença i protecció dels animals de Barberà del Vallès (any 2019)?",
      "options": [
        "Títol preliminar i 10 títols, amb 74 articles",
        "4 capítols, amb 31 articles",
        "Títol preliminar i 6 títols, amb 138 articles",
        "Títol preliminar i 7 títols, amb 108 articles"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t82",
      "text": "Segons l'article 19.1 de l'Ordenança d'animals, com han d'anar els gossos i les fures a les vies i espais públics?",
      "options": [
        "Amb collar i microxip, sense necessitat de placa",
        "N'hi ha prou amb la corretja",
        "Lligats amb corretja, amb collar i placa d'identificació amb el nom de l'animal i, com a mínim, el telèfon de la persona propietària",
        "Sempre amb morrió, amb independència de la raça"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t83",
      "text": "Segons l'article 20.3 de l'Ordenança d'animals, quina obligació específica tenen les persones propietàries de gossos i fures respecte de l'orina?",
      "options": [
        "Han de netejar-la amb detergent biodegradable",
        "Han de diluir-la amb aigua",
        "L'ordenança no regula l'orina, només les deposicions fecals",
        "Els animals no poden orinar a la via pública en cap cas"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t84",
      "text": "Segons l'article 21.3 de l'Ordenança d'animals, com han d'anar els gossos potencialment perillosos als espais reservats per a gossos?",
      "options": [
        "Poden anar deslligats i sense morrió",
        "Sempre lligats i, a més, amb morrió",
        "Poden anar deslligats, però sempre amb morrió",
        "No hi poden accedir en cap cas"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t85",
      "text": "Quantes races figuren expressament catalogades com a gossos potencialment perillosos a l'article 27 de l'Ordenança d'animals?",
      "options": [
        "13",
        "8",
        "10",
        "15"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t86",
      "text": "Quina d'aquestes races NO figura al llistat de l'article 27 de l'Ordenança d'animals?",
      "options": [
        "Fila Brasileiro",
        "Akita Inu",
        "Pastor alemany",
        "Dog de Burdeus"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t87",
      "text": "Segons l'article 30.3 de l'Ordenança d'animals, quina és la validesa de la llicència administrativa municipal per a la tinença de gossos potencialment perillosos?",
      "options": [
        "2 anys",
        "3 anys",
        "1 any",
        "5 anys, renovable per períodes successius d'igual durada"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t88",
      "text": "Segons l'article 30.2 de l'Ordenança d'animals, qui ha de portar la llicència a sobre quan es condueix un gos potencialment perillós per espais públics?",
      "options": [
        "Només cal exhibir-la a requeriment de l'agent, dins de les 24 hores següents",
        "Ningú: n'hi ha prou amb el microxip identificatiu",
        "Únicament la persona propietària de l'animal",
        "Tota persona que el condueixi, encara que no en sigui la propietària"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t89",
      "text": "Segons l'article 30.5 de l'Ordenança d'animals, en quin termini s'ha de comunicar qualsevol variació de les dades que figuren a la llicència de gos potencialment perillós?",
      "options": [
        "30 dies",
        "15 dies",
        "10 dies",
        "48 hores"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t90",
      "text": "Segons l'article 32.2 de l'Ordenança d'animals, com han d'anar els gossos potencialment perillosos a les vies públiques, parts comunes d'immobles, transports públics i espais d'ús públic?",
      "options": [
        "Amb corretja d'un metre com a màxim, sense necessitat de morrió",
        "Amb corretja no extensible de fins a 2,5 metres i morrió",
        "Amb corretja extensible de fins a 1,5 metres i morrió",
        "Lligats amb cadena o corretja no extensible de menys de 2 metres i proveïts de morrió"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t91",
      "text": "Segons l'article 32.3 de l'Ordenança d'animals, quants gossos potencialment perillosos pot portar una mateixa persona?",
      "options": [
        "No hi ha límit establert",
        "Fins a tres",
        "Fins a dos",
        "Un de sol"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t92",
      "text": "Segons l'article 32.6 de l'Ordenança d'animals, en quin termini màxim s'ha de comunicar al Registre Municipal la sostracció o la pèrdua d'un gos potencialment perillós?",
      "options": [
        "30 dies",
        "48 hores",
        "24 hores",
        "15 dies"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t93",
      "text": "Segons l'article 34 de l'Ordenança d'animals, en quins terminis cal inscriure gossos, gats i fures al cens municipal?",
      "options": [
        "30 dies des del naixement i 15 dies des de l'adquisició",
        "3 mesos com a màxim des del naixement, o 30 dies des de l'adquisició, el canvi de residència o el canvi de propietari",
        "6 mesos des del naixement i 30 dies des de l'adquisició",
        "3 mesos des del naixement i 15 dies des de l'adquisició"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t94",
      "text": "Segons l'article 35 de l'Ordenança d'animals, en quin termini s'ha de comunicar al cens la sostracció o la pèrdua d'un animal de companyia?",
      "options": [
        "24 hores",
        "30 dies",
        "15 dies",
        "48 hores"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t95",
      "text": "Segons l'article 53 de l'Ordenança d'animals, quin és el termini per recuperar un animal recollit, transcorregut el qual es considera abandonat?",
      "options": [
        "15 dies",
        "20 dies",
        "30 dies",
        "10 dies"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t96",
      "text": "Segons l'article 65.4 de l'Ordenança d'animals, quina escala de multes s'aplica a les infraccions pròpies de l'ordenança?",
      "options": [
        "Lleus de 100 a 400 €; greus de 401 a 1.000 €; molt greus de 1.001 a 3.000 €",
        "Lleus de 100 a 400 €; greus de 401 a 2.000 €; molt greus de 2.001 a 20.000 €",
        "Lleus fins a 300 €; greus de 300,01 a 900 €; molt greus de 900,01 a 1.800 €",
        "Lleus de 60,10 a 150,25 €; greus de 150,25 a 1.502,53 €; molt greus de 1.502,53 a 30.050,60 €"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t97",
      "text": "Segons l'article 63.2 de l'Ordenança d'animals, quin òrgan és competent per sancionar les infraccions greus i molt greus relatives a la tinença de gossos potencialment perillosos?",
      "options": [
        "El Ple de la Corporació",
        "L'Alcaldia",
        "La Junta de Govern Local",
        "La direcció general competent de la Generalitat de Catalunya"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t98",
      "text": "Segons l'article 68 de l'Ordenança d'animals, quina reducció comporta el pagament anticipat de la multa, condicionat a la renúncia expressa a interposar recursos?",
      "options": [
        "El 50%",
        "El 30%",
        "El 10%",
        "El 20%"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança reguladora de la tinença i protecció dels animals"
    },
    {
      "id": "barbera-del-valles-t99",
      "text": "Quina és l'estructura de l'Ordenança municipal de sorolls i vibracions de Barberà del Vallès?",
      "options": [
        "Títol preliminar i 10 títols, amb 74 articles",
        "4 capítols i 31 articles, una disposició addicional i 3 annexos",
        "6 títols i 138 articles",
        "Títol preliminar i 7 títols, amb 108 articles"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t100",
      "text": "Segons l'Annex I, Taula 1, de l'Ordenança de sorolls i vibracions, quin és el nivell sonor màxim a l'exterior en ZONA INDUSTRIAL durant el dia (de 8 a 22 h)?",
      "options": [
        "55 dB(A)",
        "70 dB(A)",
        "65 dB(A)",
        "60 dB(A)"
      ],
      "correct": 2,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t101",
      "text": "Segons el mateix Annex I, quin és el nivell sonor màxim a l'exterior durant la nit (de 22 a 8 h) en totes les zones excepte la industrial?",
      "options": [
        "55 dB(A)",
        "35 dB(A)",
        "30 dB(A)",
        "45 dB(A)"
      ],
      "correct": 3,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t102",
      "text": "Segons el mateix Annex I, quin és el nivell sonor màxim admissible al DORMITORI durant el dia (de 8 a 22 h) en zones no industrials?",
      "options": [
        "35 dB(A)",
        "30 dB(A)",
        "25 dB(A)",
        "45 dB(A)"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t103",
      "text": "Segons l'article 31 de l'Ordenança de sorolls i vibracions, quin òrgan sanciona les infraccions?",
      "options": [
        "El Ple",
        "El regidor delegat de Medi Ambient, en exclusiva",
        "L'Alcaldia",
        "La Junta de Govern Local"
      ],
      "correct": 2,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t104",
      "text": "Segons la disposició final de l'Ordenança de sorolls i vibracions, quan entra en vigor?",
      "options": [
        "Als 20 dies hàbils de la publicació al BOP",
        "Als 15 dies de la publicació completa al BOP",
        "L'endemà de la publicació al BOP",
        "Al mes de la publicació al BOP"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t105",
      "text": "Segons l'Ordenança de sorolls i vibracions, quin nivell sonor no es pot superar en punts accessibles a clients o usuaris dels establiments?",
      "options": [
        "80 dB(A)",
        "90 dB(A)",
        "85 dB(A)",
        "100 dB(A)"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t106",
      "text": "Segons l'article 85.2.b) de l'Ordenança de convivència i civisme, en quina franja horària queda prohibida l'emissió de qualsevol soroll que alteri la tranquil·litat veïnal, excepte activitats populars o festives autoritzades?",
      "options": [
        "Entre les 23 h i les 7 h",
        "Entre les 21 h i les 8 h",
        "Entre les 22 h i les 7 h",
        "Entre les 22 h i les 8 h"
      ],
      "correct": 3,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t107",
      "text": "Segons l'article 87.5 de l'Ordenança de convivència i civisme, en quin horari es poden fer reparacions domèstiques i canvis de mobles?",
      "options": [
        "Entre les 9 h i les 20 h en laborables, i entre les 10 h i les 19 h en festius",
        "Entre les 8 h i les 22 h en laborables, i entre les 10 h i les 20 h en festius",
        "Entre les 8 h i les 20 h en laborables, i entre les 9 h i les 14 h en festius",
        "Entre les 8 h i les 21 h en dies laborables, i entre les 10 h i les 20 h en dies festius i vigílies de festius"
      ],
      "correct": 3,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t108",
      "text": "Segons l'article 88.1 de l'Ordenança de convivència i civisme, en quines franges horàries cal evitar els sorolls en els actes que es facin a la via pública?",
      "options": [
        "Entre les 21 h i les 7 h en laborables, i entre les 22 h i les 8 h en festius",
        "Entre les 21 h i les 8 h en dies laborables, i entre les 22 h i les 9 h en dies festius i vigílies",
        "Entre les 20 h i les 8 h en laborables, i entre les 22 h i les 10 h en festius",
        "Entre les 22 h i les 8 h en laborables, i entre les 23 h i les 9 h en festius"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t109",
      "text": "Segons l'article 91 de l'Ordenança de convivència i civisme, durant quant de temps com a màxim es pot mantenir el motor en funcionament amb el vehicle aturat?",
      "options": [
        "1 minut",
        "2 minuts",
        "30 segons",
        "5 minuts"
      ],
      "correct": 1,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t110",
      "text": "Segons l'article 92.3 de l'Ordenança de convivència i civisme, quin tràmit cal per instal·lar avisadors acústics d'emplaçament fix?",
      "options": [
        "Llicència atorgada per decret d'Alcaldia",
        "Autorització de la Junta de Govern Local",
        "Comunicació prèvia a la Policia Local, amb domicili, telèfon i certificat de l'instal·lador",
        "Autorització de la regidoria de Medi Ambient"
      ],
      "correct": 2,
      "reference": "Teòric · Sorolls, vibracions i descans veïnal"
    },
    {
      "id": "barbera-del-valles-t111",
      "text": "Quan va entrar en vigor l'Ordenança municipal de circulació i mobilitat de Barberà del Vallès?",
      "options": [
        "El 5 de gener de 2023",
        "El 21 de desembre de 2022",
        "El 31 de gener de 2023",
        "L'1 de maig de 2023"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t112",
      "text": "Quina és l'estructura de l'Ordenança municipal de circulació i mobilitat?",
      "options": [
        "Títol preliminar i 10 títols, amb 74 articles",
        "4 capítols i 31 articles, amb 3 annexos",
        "6 títols i 138 articles, amb 2 annexos",
        "Títol preliminar i 7 títols, amb 108 articles i 3 annexos"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t113",
      "text": "Segons l'article 36.1 de l'Ordenança de circulació i mobilitat, quin és el límit genèric de velocitat a les vies urbanes de plataforma única?",
      "options": [
        "15 km/h",
        "30 km/h",
        "20 km/h",
        "10 km/h"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t114",
      "text": "Segons el mateix article 36.1, quin és el límit genèric de velocitat a les vies urbanes amb un únic carril per sentit de circulació?",
      "options": [
        "30 km/h",
        "40 km/h",
        "50 km/h",
        "20 km/h"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t115",
      "text": "Segons l'article 36.5 de l'Ordenança de circulació i mobilitat, quin és el límit genèric de velocitat a les autopistes i autovies dins del terme municipal?",
      "options": [
        "120 km/h",
        "90 km/h",
        "80 km/h",
        "100 km/h"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t116",
      "text": "Segons l'article 36.3 de l'Ordenança de circulació i mobilitat, a quina velocitat màxima poden circular els vehicles que transporten mercaderies perilloses per vies de dos o més carrils per sentit i per travessies?",
      "options": [
        "20 km/h",
        "50 km/h",
        "30 km/h",
        "40 km/h"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t117",
      "text": "Segons l'article 89 de l'Ordenança de circulació i mobilitat, amb quina antelació mínima cal avisar i col·locar els senyals provisionals quan es retiren vehicles per causa de necessitat (actes públics, neteja, poda, obres o reserves temporals)?",
      "options": [
        "48 hores",
        "24 hores",
        "7 dies",
        "72 hores"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t118",
      "text": "Segons l'article 37 de l'Ordenança de circulació i mobilitat, a quina velocitat màxima poden circular els VMP i els cicles pels carrils bici NO segregats de l'espai de vianants?",
      "options": [
        "20 km/h",
        "25 km/h",
        "10 km/h",
        "6 km/h"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t119",
      "text": "Segons l'article 29.2 de l'Ordenança de circulació i mobilitat, quina és l'edat mínima per conduir un vehicle de mobilitat personal (VMP)?",
      "options": [
        "15 anys",
        "12 anys",
        "14 anys",
        "16 anys"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t120",
      "text": "Segons l'article 29.3 de l'Ordenança de circulació i mobilitat, quin és el règim del casc per a les persones conductores de VMP?",
      "options": [
        "És recomanable, però no obligatori",
        "És obligatori, degudament homologat",
        "Només és obligatori quan es circula per la calçada",
        "Només és obligatori per als menors de 16 anys"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t121",
      "text": "Segons l'article 23.4 de l'Ordenança de circulació i mobilitat, entre quins valors ha d'estar la velocitat màxima per disseny d'un VMP?",
      "options": [
        "Entre 6 i 20 km/h",
        "Entre 6 i 25 km/h",
        "Entre 6 i 30 km/h",
        "Entre 10 i 25 km/h"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t122",
      "text": "Segons l'article 23.1 de l'Ordenança de circulació i mobilitat, quina consideració tenen els patins, patinets i monopatins sense motor, o amb motor que no permet superar els 6 km/h?",
      "options": [
        "Tenen la consideració de cicles",
        "Tenen la consideració de ciclomotors",
        "Són JOGUINES i no tenen la consideració de vehicles de mobilitat personal",
        "Són VMP de tipus A"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t123",
      "text": "Segons l'article 29.8 de l'Ordenança de circulació i mobilitat, quina distància mínima de separació ha de mantenir un VMP respecte dels vianants i de la línia de façanes?",
      "options": [
        "0,5 metres",
        "2 metres",
        "1,5 metres",
        "1 metre"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t124",
      "text": "Segons l'article 30.1 de l'Ordenança de circulació i mobilitat, poden circular els VMP per les voreres?",
      "options": [
        "No, excepte si hi ha un carril de vorera bici",
        "Sí, sempre que ho facin a pas de vianant",
        "Només els conduïts per menors de 16 anys",
        "Sí, sempre que no superin els 10 km/h"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t125",
      "text": "Segons l'article 24.2 de l'Ordenança de circulació i mobilitat, per quines vies NO poden circular els VMP?",
      "options": [
        "Poden circular per túnels urbans sempre que portin llums enceses",
        "No poden circular per travessies, vies interurbanes, autopistes ni autovies dins del terme municipal, ni tampoc per túnels urbans",
        "Poden circular per travessies sempre que no superin els 20 km/h",
        "Únicament per les autopistes"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t126",
      "text": "Segons l'article 24.1 de l'Ordenança de circulació i mobilitat, qui pot circular en bicicleta per la vorera?",
      "options": [
        "Ningú, en cap circumstància",
        "Els menors de 14 anys",
        "Els menors de 16 anys",
        "Els menors de 12 anys amb casc homologat i els adults que els acompanyin"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t127",
      "text": "Segons l'article 24.18.d) de l'Ordenança de circulació i mobilitat, per a qui és obligatori el casc de protecció homologat en bicicleta?",
      "options": [
        "Només quan es circula per vies interurbanes",
        "Per a tots els menors de 18 anys",
        "Per als menors de 12 anys",
        "Per als menors de 16 anys, sense excepció i amb independència de la via"
      ],
      "correct": 3,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t128",
      "text": "Segons l'article 24.8 de l'Ordenança de circulació i mobilitat, quines distàncies ha de respectar un vehicle de motor en avançar un cicle o VMP i en circular al seu darrere?",
      "options": [
        "Canviar de carril i deixar un mínim d'1,5 metres en avançar, i mai menys de 3 metres circulant al darrere d'una bicicleta",
        "1 metre en avançar i 2 metres per darrere",
        "1,5 metres en avançar i 5 metres per darrere",
        "2 metres en avançar i 5 metres per darrere"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t129",
      "text": "Segons l'article 24.14 de l'Ordenança de circulació i mobilitat, durant quant de temps es dipositen a dependències policials les bicicletes i els VMP retirats per estar aparentment abandonats o mancats d'elements essencials?",
      "options": [
        "2 mesos",
        "20 dies",
        "30 dies",
        "15 dies"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t130",
      "text": "Segons l'article 33.2 de l'Ordenança de circulació i mobilitat, quan pot recollir el propietari un VMP intervingut i traslladat al dipòsit municipal?",
      "options": [
        "A partir del dia hàbil següent al de la retirada, prèvia liquidació de la taxa corresponent",
        "Un cop transcorregudes 72 hores",
        "Un cop transcorregudes 24 hores",
        "Immediatament, en el mateix moment de la intervenció"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t131",
      "text": "Segons l'article 31.1 de l'Ordenança de circulació i mobilitat, quin règim s'aplica als VMP conduïts per les forces i cossos de seguretat o pels serveis públics en exercici de les seves funcions?",
      "options": [
        "Poden circular per qualsevol tipus de via, rodada o de vianants",
        "Només poden circular per la calçada",
        "Necessiten una autorització expressa de l'alcalde per a cada servei",
        "No s'estableix cap excepció al règim general"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t132",
      "text": "Segons l'article 57 de l'Ordenança de circulació i mobilitat, quant de temps es pot estacionar sense comprovant a les zones amb limitació horària senyalitzades per a gestions imprescindibles en serveis sanitaris o farmacèutics?",
      "options": [
        "Un màxim de 30 minuts",
        "Un màxim de 15 minuts",
        "Un màxim de 10 minuts",
        "Un màxim de 20 minuts"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t133",
      "text": "Segons els apartats 6 i 7 de l'article 57 de l'Ordenança de circulació i mobilitat, quines dimensions màximes han de tenir els vehicles per estacionar a les zones d'estacionament regulat?",
      "options": [
        "1,82 metres d'amplada i 4,5 metres de longitud",
        "2 metres d'amplada i 5 metres de longitud",
        "1,82 metres d'amplada i 5 metres de longitud",
        "1,90 metres d'amplada i 5,50 metres de longitud"
      ],
      "correct": 2,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t134",
      "text": "Segons l'article 60.1 de l'Ordenança de circulació i mobilitat, en quin cas es pot retirar i traslladar al dipòsit municipal un vehicle estacionat en zona regulada?",
      "options": [
        "Quan es depassi en més de 30 minuts el temps abonat",
        "Quan no s'hagi abonat la taxa o quan es depassi el triple del temps abonat",
        "Quan es depassi el doble del temps abonat",
        "Quan es depassi en més d'una hora el temps abonat"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t135",
      "text": "Segons l'article 59.3 de l'Ordenança de circulació i mobilitat, quina consideració tenen els vigilants de les zones d'estacionament regulat?",
      "options": [
        "Auxiliars de la Policia Local",
        "Agents de l'autoritat a tots els efectes",
        "Funcionaris de carrera adscrits a la Policia Local",
        "Personal laboral sense cap facultat de denúncia"
      ],
      "correct": 0,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t136",
      "text": "Segons l'article 101 de l'Ordenança de circulació i mobilitat, quins són els imports de les sancions?",
      "options": [
        "Lleus 91 €, greus 301 €, molt greus 602 €",
        "Lleus, multes de fins a 100 €; greus, 200 €; molt greus, 500 €",
        "Lleus 100 €, greus 300 €, molt greus 600 €",
        "Lleus fins a 300 €, greus fins a 900 €, molt greus fins a 1.800 €"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t137",
      "text": "Segons l'article 100.1 de l'Ordenança de circulació i mobilitat, quin òrgan sanciona les infraccions en matèria de circulació?",
      "options": [
        "La Junta de Govern Local",
        "L'alcalde/essa o el/la regidor/a delegat/ada",
        "El Ple de la Corporació",
        "L'instructor de l'expedient sancionador"
      ],
      "correct": 1,
      "reference": "Teòric · Ordenança municipal de circulació i mobilitat, VMP i estacionament"
    },
    {
      "id": "barbera-del-valles-t138",
      "text": "Quina matèria regulen els articles 93 a 111, dins del Títol V de l'Ordenança general per a la convivència i el civisme?",
      "options": [
        "Els residus, els contenidors, la recollida i els abocaments",
        "La tinença d'animals de companyia",
        "Els sorolls i les vibracions",
        "Les terrasses i els vetlladors a la via pública"
      ],
      "correct": 0,
      "reference": "Teòric · Residus, neteja viària i altres ordenances i reglaments"
    },
    {
      "id": "barbera-del-valles-t139",
      "text": "Quin és el límit màxim diari d'aportació gratuïta per a particulars amb turisme a la Deixalleria Municipal de Barberà del Vallès?",
      "options": [
        "1.000 kg per dia",
        "No hi ha cap límit establert",
        "250 kg per dia",
        "500 kg per dia"
      ],
      "correct": 3,
      "reference": "Teòric · Residus, neteja viària i altres ordenances i reglaments"
    },
    {
      "id": "barbera-del-valles-t140",
      "text": "En el nou model de recollida de residus amb contenidors tancats, quines fraccions NO tenen identificació d'usuari?",
      "options": [
        "La fracció resta",
        "L'orgànica",
        "El paper/cartró i el vidre",
        "Els envasos"
      ],
      "correct": 2,
      "reference": "Teòric · Residus, neteja viària i altres ordenances i reglaments"
    },
    {
      "id": "barbera-del-valles-t141",
      "text": "En quina situació de tramitació es troba l'Ordenança municipal reguladora de mercats de venda no sedentària de Barberà del Vallès?",
      "options": [
        "Va ser aprovada definitivament l'any 2019",
        "L'aprovació inicial es va publicar al BOPB el 8 d'agost de 2025",
        "No consta cap tramitació iniciada",
        "Va ser aprovada pel Ple de 20 de maig de 2026"
      ],
      "correct": 1,
      "reference": "Teòric · Residus, neteja viària i altres ordenances i reglaments"
    },
    {
      "id": "barbera-del-valles-t142",
      "text": "Quan es va aprovar definitivament l'Ordenança municipal d'espais naturals i zones verdes de Barberà del Vallès?",
      "options": [
        "El 22 de març de 2023",
        "El 27 d'abril de 1994",
        "El 21 de desembre de 2022",
        "El 26 de març de 2010"
      ],
      "correct": 1,
      "reference": "Teòric · Residus, neteja viària i altres ordenances i reglaments"
    },
    {
      "id": "barbera-del-valles-t143",
      "text": "Quin és el planejament general urbanístic vigent a Barberà del Vallès?",
      "options": [
        "El Pla General d'Ordenació (PGO), amb text refós aprovat definitivament per la Comissió Territorial d'Urbanisme de Barcelona el 28 de gener de 2010",
        "Unes Normes subsidiàries de planejament de 1994",
        "Un POUM aprovat definitivament l'any 2010",
        "Un POUM aprovat definitivament l'any 2023"
      ],
      "correct": 0,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t144",
      "text": "Quina és l'estructura del Pla d'Actuació Municipal (PAM) 2023-2027, aprovat pel Ple de 24 de juliol de 2024?",
      "options": [
        "4 reptes de ciutat, 10 eixos estratègics, 25 objectius i 200 accions",
        "6 reptes de ciutat, 6 eixos estratègics, 30 objectius i 61 accions",
        "4 reptes de ciutat, 12 eixos estratègics, 30 objectius específics i 262 accions",
        "6 reptes de ciutat, 12 eixos estratègics, 30 objectius i 262 accions"
      ],
      "correct": 2,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t145",
      "text": "Com es va aprovar i homologar el Document Únic de Protecció Civil Municipal (DUPROCIM) de Barberà del Vallès?",
      "options": [
        "Aprovat per la Junta de Govern Local i homologat el 12 de desembre de 2013",
        "Aprovat per la Junta Local de Seguretat el 12 de desembre de 2023",
        "Aprovat pel Ple municipal el 18 de novembre de 2020 i homologat per la Direcció General de Protecció Civil el 18 de desembre de 2021",
        "Aprovat pel Ple i homologat el 12 de desembre de 2013"
      ],
      "correct": 2,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t146",
      "text": "De quants desfibril·ladors (DEA) disposava el municipi segons el Pla Local de Seguretat 2024-2027?",
      "options": [
        "15",
        "10",
        "5",
        "20"
      ],
      "correct": 0,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t147",
      "text": "Segons l'Ordenança fiscal 2.7, taxa per prestacions de la Policia Local, quina és la tarifa per hora o fracció d'un AGENT?",
      "options": [
        "37,14 €",
        "33,74 €",
        "62,56 €",
        "31,28 €"
      ],
      "correct": 3,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t148",
      "text": "Segons la mateixa Ordenança fiscal 2.7, quin increment s'aplica a les tarifes quan el servei es presta entre les 22 h i les 6 h o en dies festius?",
      "options": [
        "Un 25%",
        "Un 30%",
        "Un 50%",
        "Un 20%"
      ],
      "correct": 0,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t149",
      "text": "Segons l'Ordenança fiscal 2.7, quin és l'import de la retirada i el trasllat de vehicles al dipòsit municipal (grua) en condicions normals?",
      "options": [
        "46,20 €",
        "62,56 €",
        "134,30 €",
        "51,00 €"
      ],
      "correct": 2,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-t150",
      "text": "Segons l'Ordenança fiscal 2.14, quin és l'horari de la zona d'estacionament regulat de Barberà del Vallès?",
      "options": [
        "De dilluns a divendres, de 8.00 a 14.00 h i de 16.00 a 20.00 h, inclòs el mes d'agost",
        "De dilluns a dissabte, de 9.00 a 14.00 h i de 16.00 a 20.00 h",
        "Tots els dies de la setmana, de 9.00 a 20.00 h de manera continuada",
        "De dilluns a divendres, de 9.00 a 14.00 h i de 16.30 a 20.00 h; s'exceptuen dissabtes, festius i el mes d'agost"
      ],
      "correct": 3,
      "reference": "Teòric · Planejament, ordenances fiscals i protecció civil"
    },
    {
      "id": "barbera-del-valles-c1",
      "text": "A quina comarca pertany el municipi de Barberà del Vallès?",
      "options": [
        "Al Vallès Oriental",
        "Al Baix Llobregat",
        "Al Vallès Occidental",
        "Al Barcelonès"
      ],
      "correct": 2,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c2",
      "text": "Quina és la superfície del terme municipal de Barberà del Vallès?",
      "options": [
        "8,31 km²",
        "13,08 km²",
        "5,64 km²",
        "10,92 km²"
      ],
      "correct": 0,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c3",
      "text": "A quina altitud sobre el nivell del mar se situa el municipi?",
      "options": [
        "96 metres",
        "112 metres",
        "178 metres",
        "146 metres"
      ],
      "correct": 3,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c4",
      "text": "Amb quants municipis limita Barberà del Vallès?",
      "options": [
        "Amb quatre",
        "Amb sis",
        "Amb cinc",
        "Amb set"
      ],
      "correct": 1,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c5",
      "text": "Quin dels municipis següents NO és limítrof amb Barberà del Vallès?",
      "options": [
        "Sant Quirze del Vallès",
        "Ripollet",
        "Montcada i Reixac",
        "Santa Perpètua de Mogoda"
      ],
      "correct": 0,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c6",
      "text": "Quin riu travessa el terme municipal i el divideix en dues bandes?",
      "options": [
        "El riu Sec",
        "La riera de Caldes",
        "El riu Besòs",
        "El riu Ripoll"
      ],
      "correct": 3,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c7",
      "text": "Quin és el segon curs d'aigua del terme, situat a la banda occidental?",
      "options": [
        "La riera de Caldes",
        "El riu Sec",
        "El torrent de Can Gili",
        "El riu Ripoll"
      ],
      "correct": 1,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c8",
      "text": "Quin és el codi postal de Barberà del Vallès?",
      "options": [
        "08202",
        "08291",
        "08210",
        "08226"
      ],
      "correct": 2,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c9",
      "text": "Quin és el codi INE del municipi?",
      "options": [
        "08252",
        "08205",
        "08187",
        "08900"
      ],
      "correct": 0,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c10",
      "text": "Quin municipi limita amb Barberà del Vallès pel sud-oest?",
      "options": [
        "Ripollet",
        "Badia del Vallès",
        "Cerdanyola del Vallès",
        "Sabadell"
      ],
      "correct": 1,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c11",
      "text": "Quin municipi limita amb Barberà del Vallès pel nord-oest?",
      "options": [
        "Montcada i Reixac",
        "Cerdanyola del Vallès",
        "Santa Perpètua de Mogoda",
        "Sabadell"
      ],
      "correct": 3,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c12",
      "text": "En quina unitat geogràfica s'inscriu el terme de Barberà del Vallès?",
      "options": [
        "A la Depressió Central Catalana",
        "A la plana de l'Empordà",
        "A la Depressió Prelitoral (Depressió del Vallès)",
        "A la Serralada Transversal"
      ],
      "correct": 2,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c13",
      "text": "A quin àmbit del Pla territorial general de Catalunya pertany el municipi?",
      "options": [
        "A l'Àmbit Metropolità de Barcelona",
        "A l'Àmbit de les Comarques Centrals",
        "A l'Àmbit del Camp de Tarragona",
        "A l'Àmbit de Ponent"
      ],
      "correct": 0,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c14",
      "text": "Forma part Barberà del Vallès de l'Àrea Metropolitana de Barcelona (AMB)?",
      "options": [
        "No, no en forma part",
        "Sí, n'és membre de ple dret",
        "Només a efectes tributaris",
        "Només des de l'any 2023"
      ],
      "correct": 1,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c15",
      "text": "Quin dels torrents següents aboca al riu Ripoll a la zona del bosc de Santiga?",
      "options": [
        "El torrent de la Bòbila",
        "El torrent dels Ametllers",
        "El torrent de Can Feu",
        "El torrent de Can Llobateres"
      ],
      "correct": 3,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c16",
      "text": "Quina sèquia històrica alimenta la zona humida de la Font de Can Gili?",
      "options": [
        "La sèquia Monar",
        "La sèquia Comtal",
        "El rec del Molí",
        "La sèquia de Santiga"
      ],
      "correct": 0,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c17",
      "text": "Segons el Pla Local d'Habitatge, quin percentatge del terme municipal és sòl urbà?",
      "options": [
        "El 51%",
        "El 62%",
        "El 73%",
        "El 85%"
      ],
      "correct": 2,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c18",
      "text": "On se situa la trama industrial de Barberà del Vallès?",
      "options": [
        "A ponent del riu Sec",
        "A l'est del terme municipal",
        "Al nord, tocant a Sabadell",
        "Al centre del nucli urbà"
      ],
      "correct": 1,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c19",
      "text": "A quantes hectàrees equival la superfície del terme municipal?",
      "options": [
        "A 1.031 hectàrees",
        "A 683 hectàrees",
        "A 912 hectàrees",
        "A 831 hectàrees"
      ],
      "correct": 3,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c20",
      "text": "En quina direcció travessa el riu Ripoll el terme municipal?",
      "options": [
        "De nord a sud",
        "D'est a oest",
        "De nord-oest a sud-est",
        "De sud-oest a nord-est"
      ],
      "correct": 2,
      "reference": "Cultura · Geografia i territori"
    },
    {
      "id": "barbera-del-valles-c21",
      "text": "Quina era la població de Barberà del Vallès a 1 de gener de 2025?",
      "options": [
        "32.680 habitants",
        "34.031 habitants",
        "35.412 habitants",
        "33.082 habitants"
      ],
      "correct": 1,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c22",
      "text": "Quina és la densitat de població del municipi l'any 2025?",
      "options": [
        "2.845,7 hab./km²",
        "3.310,4 hab./km²",
        "5.207,9 hab./km²",
        "4.095,2 hab./km²"
      ],
      "correct": 3,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c23",
      "text": "Quin és el gentilici dels habitants de Barberà del Vallès?",
      "options": [
        "Barberenc / barberenca",
        "Barberès / barberesa",
        "Barberí / barberina",
        "Barberenyà / barberenyana"
      ],
      "correct": 0,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c24",
      "text": "Quantes entitats singulars de població té el municipi?",
      "options": [
        "Una",
        "Tres",
        "Dues",
        "Quatre"
      ],
      "correct": 2,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c25",
      "text": "Quina és la segona entitat singular de població del municipi?",
      "options": [
        "Can Serra",
        "La Romànica",
        "Santiga",
        "Can Gorgs"
      ],
      "correct": 1,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c26",
      "text": "Quants barris oficials té Barberà del Vallès?",
      "options": [
        "Nou",
        "Set",
        "Onze",
        "Dotze"
      ],
      "correct": 0,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c27",
      "text": "Quin dels següents NO és un barri oficial de Barberà del Vallès?",
      "options": [
        "Can Gorgs II",
        "Parc d'Europa",
        "Estació–Ca n'Esteper",
        "Badia del Vallès"
      ],
      "correct": 3,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c28",
      "text": "Quin és el barri més extens en superfície?",
      "options": [
        "El Casc Antic",
        "El Parc Central",
        "Can Gorgs II",
        "La Romànica"
      ],
      "correct": 2,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c29",
      "text": "Quin és el barri de menor superfície del municipi?",
      "options": [
        "La Romànica",
        "Can Serra",
        "Parc d'Europa",
        "Can Gorgs"
      ],
      "correct": 0,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c30",
      "text": "El barri Parc d'Europa ocupa els terrenys d'una antiga factoria. Quina?",
      "options": [
        "APLI",
        "TYC, S.A.",
        "Baricentro",
        "Foneria Colomer"
      ],
      "correct": 1,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c31",
      "text": "Amb quin nom es coneixien les actuacions urbanístiques que van originar el barri Parc Central?",
      "options": [
        "Roma",
        "Milà",
        "Nàpols",
        "Torí"
      ],
      "correct": 2,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c32",
      "text": "En quantes seccions censals es divideix el municipi?",
      "options": [
        "En 18",
        "En 22",
        "En 26",
        "En 15"
      ],
      "correct": 1,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c33",
      "text": "Quins barris responen a la trama urbana de ciutat jardí?",
      "options": [
        "El Casc Antic i La Romànica",
        "El Parc Central i el Parc d'Europa",
        "Eixample–Can Llobet i Estació–Ca n'Esteper",
        "Can Gorgs i Can Gorgs II"
      ],
      "correct": 3,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c34",
      "text": "Quina va ser la causa de la forta davallada de població entre 1950 i 1960?",
      "options": [
        "L'annexió del barri de la Creu de Barberà a Sabadell",
        "La creació del municipi de Badia del Vallès",
        "L'emigració massiva cap a la ciutat de Barcelona",
        "El tancament dels molins paperers del riu Ripoll"
      ],
      "correct": 0,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c35",
      "text": "Quantes persones de nacionalitat estrangera consten empadronades el 2025?",
      "options": [
        "1.980",
        "2.540",
        "3.265",
        "4.953"
      ],
      "correct": 2,
      "reference": "Cultura · Demografia i barris"
    },
    {
      "id": "barbera-del-valles-c36",
      "text": "De quin any data la primera menció documental del terme de Barberà?",
      "options": [
        "De l'any 1005",
        "De l'any 1080",
        "De l'any 878",
        "De l'any 985"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c37",
      "text": "A quin monestir pertanyia el document de l'any 985 que esmenta un alou al terme?",
      "options": [
        "A Sant Llorenç del Munt",
        "A Sant Cugat del Vallès",
        "A Montserrat",
        "A Sant Pere de les Puel·les"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c38",
      "text": "De quina forma llatina, documentada al segle X, deriva el topònim Barberà?",
      "options": [
        "De Barberanus",
        "De Barbarianum",
        "De Barbarius",
        "De Barbaranus"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c39",
      "text": "Quin rei va confirmar l'any 986 els alous de Sant Cugat al terme de Barberanus?",
      "options": [
        "Carlemany",
        "Robert II",
        "Lotari",
        "Hug Capet"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c40",
      "text": "Qui va dividir el castell de Barberà, l'any 1005, entre la Seu de Barcelona i la basílica de Sant Miquel Arcàngel?",
      "options": [
        "El comte Ramon Borrell",
        "Berenguer Ramon II",
        "Bernat de Barberà",
        "El vescomte Guitard, en el seu testament"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c41",
      "text": "Quins comtes van confirmar l'any 1006 aquella donació?",
      "options": [
        "Ramon Borrell i Ermessenda de Carcassona",
        "Borrell II i Ledgarda de Tolosa",
        "Ramon Berenguer I i Almodis de la Marca",
        "Berenguer Ramon I i Sança de Castella"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c42",
      "text": "L'any 1080, Ramon Berenguer II va cedir la senyoria del castell de Barberà a:",
      "options": [
        "Bernat de Ribes",
        "La família dels Montcada",
        "El seu germà Berenguer Ramon II",
        "L'orde del Temple"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c43",
      "text": "L'any 1232, el castlà Bernat de Barberà era feudatari de quina família?",
      "options": [
        "Dels Pinós",
        "Dels Montcada",
        "Dels Cardona",
        "Dels Ribes"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c44",
      "text": "L'any 1320, Ramon de Barberà va vendre el castell i el terme a:",
      "options": [
        "Bernat de Montcada",
        "Galceran de Pinós",
        "Guillem de Sant Vicenç",
        "Bernat de Ribes"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c45",
      "text": "Què va destruir, l'any 1448, el castell antic situat prop de Santa Maria?",
      "options": [
        "Un terratrèmol",
        "Un incendi",
        "Un setge de tropes reials",
        "Una riuada del riu Ripoll"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c46",
      "text": "Quin monarca va cedir l'any 1599 la senyoria del castell als Galceran de Pinós?",
      "options": [
        "Felip II",
        "Felip III",
        "Felip IV",
        "Carles II"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c47",
      "text": "En quin any Felip V va nomenar Josep Galceran de Pinós i de Rocabertí primer marquès de Barberà?",
      "options": [
        "El 1685",
        "El 1694",
        "El 1702",
        "El 1714"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c48",
      "text": "Per quin motiu Felip V va manar abatre el castell de Barberà?",
      "options": [
        "Per l'amenaça de ruïna de l'edifici",
        "Per instal·lar-hi una caserna reial",
        "Per la manca d'hereus del marquesat",
        "Per la fidelitat del marquès a l'arxiduc Carles"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c49",
      "text": "En quin any es va construir l'Hostal Nou, al camí ral de Barcelona?",
      "options": [
        "El 1583",
        "El 1619",
        "El 1660",
        "El 1755"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c50",
      "text": "Quin va ser el segon nucli urbà de Barberà, format entorn de l'estació de ferrocarril i emprat com a lloc d'estiueig?",
      "options": [
        "Can Gorgs–Eixample",
        "La Sagrera",
        "Santiga",
        "Can Salvatella"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c51",
      "text": "En quin any va entrar en servei l'estació de ferrocarril de Barberà del Vallès?",
      "options": [
        "El 1875",
        "El 1900",
        "El 1848",
        "El 1855"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c52",
      "text": "Fins a quina data es va mantenir Barberà fidel a la República durant la Guerra Civil?",
      "options": [
        "Fins al 26 de febrer de 1939",
        "Fins al 26 de gener de 1939",
        "Fins a l'1 d'abril de 1939",
        "Fins al 18 de juliol de 1938"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c53",
      "text": "L'any 1959, el barri de la Creu de Barberà es va annexionar a quin municipi?",
      "options": [
        "A Cerdanyola del Vallès",
        "A Ripollet",
        "A Sabadell",
        "A Santa Perpètua de Mogoda"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c54",
      "text": "L'any 1985, la commemoració del mil·lenari de Barberà va coincidir amb la inauguració de:",
      "options": [
        "El Teatre Municipal Cooperativa",
        "La plaça de la Vila",
        "La biblioteca Esteve Paluzie",
        "El Mercat Onze de Setembre"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c55",
      "text": "De quins termes municipals es va segregar el territori que va formar el municipi de Badia?",
      "options": [
        "Únicament de Barberà del Vallès",
        "De Barberà del Vallès i de Sabadell",
        "De Cerdanyola del Vallès i de Sabadell",
        "De Barberà del Vallès i de Cerdanyola del Vallès"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c56",
      "text": "Quina norma va crear el municipi de Badia?",
      "options": [
        "El Decret 169/1985, de 14 de maig",
        "La Llei 23/2015, de 29 de juliol",
        "La Llei 1/1994, de 22 de febrer",
        "La Llei 8/1987, de 15 d'abril"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c57",
      "text": "Amb quin nom es va crear inicialment el nou municipi el 1994?",
      "options": [
        "Badia",
        "Ciutat Badia",
        "Badia del Vallès",
        "Badia de Barberà"
      ],
      "correct": 0,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c58",
      "text": "Què era Ciutat Badia abans de constituir-se en municipi?",
      "options": [
        "Un districte de Sabadell",
        "Una mancomunitat de Barberà i Cerdanyola",
        "Una entitat municipal descentralitzada",
        "Un barri del terme municipal de Ripollet"
      ],
      "correct": 1,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c59",
      "text": "En quina data es va constituir l'Ajuntament del nou municipi de Badia?",
      "options": [
        "El 22 de febrer de 1994",
        "El 14 de març de 1994",
        "El 14 d'abril de 1994",
        "El 8 d'abril de 1994"
      ],
      "correct": 2,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c60",
      "text": "Amb quin nom va ser rebatejat el municipi després de ser ocupat el 1939?",
      "options": [
        "Barbará del Vallés",
        "San Esteban de Barbará",
        "Villa de Barbará",
        "Santa María de Barbará"
      ],
      "correct": 3,
      "reference": "Cultura · Història, orígens i segregació de Badia del Vallès"
    },
    {
      "id": "barbera-del-valles-c61",
      "text": "De quin esmalt és el camper de l'escut de Barberà del Vallès?",
      "options": [
        "De gules",
        "D'or",
        "De sinople",
        "D'atzur"
      ],
      "correct": 1,
      "reference": "Cultura · Escut, bandera i símbols"
    },
    {
      "id": "barbera-del-valles-c62",
      "text": "Quin element figura com a timbre de l'escut municipal?",
      "options": [
        "Una corona de marquès",
        "Una corona de baró",
        "Una corona mural de vila",
        "Una corona comtal"
      ],
      "correct": 0,
      "reference": "Cultura · Escut, bandera i símbols"
    },
    {
      "id": "barbera-del-valles-c63",
      "text": "Les dues pinyes de sinople de l'escut són les armes parlants de quina família?",
      "options": [
        "Dels Montcada",
        "Dels Ribes",
        "Dels Rocabertí",
        "Dels Pinós"
      ],
      "correct": 3,
      "reference": "Cultura · Escut, bandera i símbols"
    },
    {
      "id": "barbera-del-valles-c64",
      "text": "En quin any es va aprovar l'escut oficial del municipi (Decret 169/1985)?",
      "options": [
        "El 1975",
        "El 1980",
        "El 1985",
        "El 2001"
      ],
      "correct": 2,
      "reference": "Cultura · Escut, bandera i símbols"
    },
    {
      "id": "barbera-del-valles-c65",
      "text": "Quin és el color del camp de la bandera municipal, aprovada l'any 2001?",
      "options": [
        "Vermell",
        "Groc",
        "Verd fosc",
        "Blanc"
      ],
      "correct": 0,
      "reference": "Cultura · Escut, bandera i símbols"
    },
    {
      "id": "barbera-del-valles-c66",
      "text": "Amb quin nom popular es coneix l'església de Santa Maria de Barberà?",
      "options": [
        "La Sagrera",
        "La Catedral del Vallès",
        "La Rodona",
        "La Romànica"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c67",
      "text": "A quin estil arquitectònic pertany l'església de Santa Maria de Barberà?",
      "options": [
        "Al gòtic català",
        "Al romànic llombard",
        "Al barroc",
        "Al renaixentista"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c68",
      "text": "De quan data el temple actual de Santa Maria de Barberà?",
      "options": [
        "Del segle IX",
        "De la primera meitat del segle X",
        "De la segona meitat del segle XI",
        "Del segle XIII"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c69",
      "text": "Quina és la planta de l'església de Santa Maria de Barberà?",
      "options": [
        "Planta basilical de tres naus",
        "Planta circular",
        "Planta de creu grega",
        "Planta de creu llatina"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c70",
      "text": "Quants absis té l'església de Santa Maria de Barberà?",
      "options": [
        "Tres",
        "Un",
        "Dos",
        "Cinc"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c71",
      "text": "Sota el pontificat de quin bisbe de Barcelona es va consagrar el temple?",
      "options": [
        "De sant Ermengol",
        "De sant Ot",
        "De sant Oleguer",
        "De sant Ramon de Penyafort"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c72",
      "text": "L'any 1143, Santa Maria consta com a parròquia en la cessió de drets a quin orde?",
      "options": [
        "A l'orde de l'Hospital",
        "A l'orde del Temple",
        "A l'orde de Sant Jordi",
        "A l'orde del Císter"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c73",
      "text": "En quin any es van descobrir les pintures murals de Santa Maria, amagades darrere d'un retaule?",
      "options": [
        "El 1919",
        "El 1936",
        "El 1949",
        "El 1966"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c74",
      "text": "Qui va protagonitzar la troballa d'aquelles pintures murals?",
      "options": [
        "Josep Puig i Cadafalch",
        "Miquel Crusafont",
        "Esteve Paluzie",
        "Mossèn Manuel Trens"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c75",
      "text": "A quin autor s'atribueixen les pintures murals de Santa Maria de Barberà?",
      "options": [
        "Al Mestre de Taüll",
        "Al Mestre de Cardona",
        "Al Mestre de Pedret",
        "Al Mestre de la Seu d'Urgell"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c76",
      "text": "Quina és la imatge central de l'absis principal de Santa Maria?",
      "options": [
        "El Judici Final",
        "El Sant Sopar",
        "El Pantocràtor (Maiestas Domini)",
        "L'Apocalipsi de sant Joan"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c77",
      "text": "Quina figura de protecció té l'església de Santa Maria de Barberà?",
      "options": [
        "Bé Cultural d'Interès Nacional (BCIN)",
        "Bé Cultural d'Interès Local (BCIL)",
        "Bé inventariat del patrimoni cultural",
        "No té cap figura de protecció"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c78",
      "text": "Amb quin nom popular es coneix el castell de Barberà?",
      "options": [
        "El castell del Marquès",
        "El castell de Santiga",
        "El castell de la Romànica",
        "El castell dels Moros"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c79",
      "text": "Quina data figura inscrita al mur de l'edifici actual del castell?",
      "options": [
        "1448",
        "1583",
        "1604",
        "1702"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c80",
      "text": "A quins sants està dedicada la capella del castell de Barberà?",
      "options": [
        "A sant Jordi i santa Eulàlia",
        "A sant Silvestre i santa Coloma",
        "A sant Pere i sant Pau",
        "A santa Maria i sant Oleguer"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c81",
      "text": "En quin any va adquirir l'Ajuntament el castell de Barberà?",
      "options": [
        "El 1979",
        "El 1985",
        "El 1992",
        "El 1988"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c82",
      "text": "Quin gènere de primat fòssil del Miocè es va descobrir al jaciment del Castell de Barberà?",
      "options": [
        "Pierolapithecus",
        "Dryopithecus",
        "Barberapithecus",
        "Hispanopithecus"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c83",
      "text": "Quin tipus de restes fòssils es van trobar l'any 1970 al jaciment de Can Simeó?",
      "options": [
        "Restes de mamuts",
        "Restes de tortugues d'aigua dolça",
        "Restes de cocodrils",
        "Restes de dinosaures"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c84",
      "text": "Amb quin altre nom es coneix la torre de guaita de Ca n'Altimira?",
      "options": [
        "La Palomera",
        "La Talaia",
        "La Torre del Moro",
        "La Torre Nova"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c85",
      "text": "Quin era el molí paperer més gran del terme de Barberà?",
      "options": [
        "El Molí d'en Santo",
        "El Molí d'en Dou",
        "El Molí Vermell",
        "El Molí d'en Planes"
      ],
      "correct": 2,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c86",
      "text": "Quin va ser l'únic molí de Barberà que només era fariner?",
      "options": [
        "El Molí d'en Planes",
        "El Molí Vermell",
        "El Molí d'en Santo",
        "El Molí del Gall"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c87",
      "text": "De quin any data el primer document conegut de la masia de Can Salvatella?",
      "options": [
        "De 1448",
        "De 1619",
        "De 1755",
        "De 1583"
      ],
      "correct": 3,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c88",
      "text": "De quantes naus consta el Mercat Onze de Setembre?",
      "options": [
        "De dues",
        "De tres",
        "D'una",
        "De quatre"
      ],
      "correct": 1,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c89",
      "text": "Quines restes arqueològiques es van descobrir a la zona del parc de Can Llobateres?",
      "options": [
        "Un poblat i forns ibèrics",
        "Un amfiteatre romà",
        "Un monestir benedictí",
        "Un dolmen megalític"
      ],
      "correct": 0,
      "reference": "Cultura · Patrimoni i monuments"
    },
    {
      "id": "barbera-del-valles-c90",
      "text": "Quina és la data tradicional de la Festa Major de Barberà del Vallès?",
      "options": [
        "El segon diumenge d'agost",
        "El darrer diumenge de juny",
        "El primer diumenge de juliol",
        "El primer diumenge de setembre"
      ],
      "correct": 2,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c91",
      "text": "Quin dia se celebra l'Aplec del Pa?",
      "options": [
        "El Dijous Sant",
        "El Dilluns de Pasqua",
        "El Diumenge de Rams",
        "El Dimecres de Cendra"
      ],
      "correct": 1,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c92",
      "text": "Quants panets beneïts es van repartir a l'Aplec del Pa de 2025?",
      "options": [
        "500",
        "1.000",
        "2.000",
        "3.000"
      ],
      "correct": 3,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c93",
      "text": "Quin reconeixement té l'Aplec del Pa a la ciutat?",
      "options": [
        "És patrimoni cultural immaterial de la ciutat",
        "És Bé Cultural d'Interès Nacional",
        "És Festa Patrimonial d'Interès Nacional",
        "És Festa d'Interès Turístic Estatal"
      ],
      "correct": 0,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c94",
      "text": "Com es diuen els gegants vells de Barberà del Vallès?",
      "options": [
        "Josep Galceran i Agustina",
        "Silvestre i Coloma",
        "Sebastià i Clotilde",
        "Ermemir i Mariona"
      ],
      "correct": 2,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c95",
      "text": "Com s'anomena el ball folk ciutadà de la Festa Major, batejat a partir del primat fòssil trobat al municipi?",
      "options": [
        "El Ripollenc",
        "La Barberenca",
        "El Castellot",
        "El Barberapitec"
      ],
      "correct": 3,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c96",
      "text": "En quin any es van construir els Gegants Marquesos, Josep Galceran de Pinós i Agustina d'Urries?",
      "options": [
        "El 1992",
        "El 2008",
        "El 2000",
        "El 1984"
      ],
      "correct": 1,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c97",
      "text": "Quina alçada tenen els Gegants Marquesos?",
      "options": [
        "2,10 metres",
        "4,20 metres",
        "3,50 metres",
        "2,80 metres"
      ],
      "correct": 2,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c98",
      "text": "En quin any es va construir la gegantona Mariona?",
      "options": [
        "El 1992",
        "El 1984",
        "El 1995",
        "El 2008"
      ],
      "correct": 0,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c99",
      "text": "En quin any es va constituir formalment la Colla de Geganters i Grallers de Barberà del Vallès?",
      "options": [
        "El 1984",
        "El 1988",
        "El 1990",
        "El 1991"
      ],
      "correct": 3,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c100",
      "text": "En quin any va ser Barberà del Vallès Ciutat Gegantera de Catalunya?",
      "options": [
        "El 1998",
        "El 2000",
        "El 2004",
        "El 2010"
      ],
      "correct": 1,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c101",
      "text": "En el ritu dels Tres Tombs de Sant Antoni Abat, en quin sentit es fan les tres voltes?",
      "options": [
        "En sentit contrari a les agulles del rellotge",
        "En el mateix sentit de les agulles del rellotge",
        "Alternant els dos sentits a cada volta",
        "Sempre en línia recta, sense girar"
      ],
      "correct": 0,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c102",
      "text": "En quin any es va formar, per fusió, la Colla de Diables de Barberà del Vallès?",
      "options": [
        "El 1997",
        "El 1991",
        "El 2000",
        "El 2007"
      ],
      "correct": 3,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c103",
      "text": "Quin nom rep la biblioteca municipal de Barberà del Vallès?",
      "options": [
        "Marta Mata",
        "Miquel Martí i Pol",
        "Esteve Paluzie",
        "Elisa Badia"
      ],
      "correct": 2,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c104",
      "text": "En quin any es va inaugurar l'edifici actual de la biblioteca municipal?",
      "options": [
        "El 1980",
        "El 2009",
        "El 2007",
        "El 2015"
      ],
      "correct": 1,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c105",
      "text": "En quin any es va inaugurar el Teatre Municipal Cooperativa (TMC)?",
      "options": [
        "El 2007",
        "El 2009",
        "El 1999",
        "El 2014"
      ],
      "correct": 0,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c106",
      "text": "Quin és l'aforament del Teatre Municipal Cooperativa?",
      "options": [
        "250 espectadors",
        "350 espectadors",
        "480 espectadors",
        "720 espectadors"
      ],
      "correct": 2,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c107",
      "text": "Sobre quin equipament preexistent s'aixeca el Teatre Municipal Cooperativa?",
      "options": [
        "Sobre l'antiga fàbrica TYC",
        "Sobre la Cooperativa Agrícola",
        "Sobre l'Hostal Nou",
        "Sobre el Casal de Cultura"
      ],
      "correct": 1,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c108",
      "text": "En quina freqüència emet Ràdio Barberà?",
      "options": [
        "89.5 FM",
        "101.3 FM",
        "107.2 FM",
        "98.1 FM"
      ],
      "correct": 3,
      "reference": "Cultura · Festes i cultura popular"
    },
    {
      "id": "barbera-del-valles-c109",
      "text": "Quina activitat va desenvolupar Esteve Paluzie i Cantalozella, que va obrir el seu primer col·legi a Barberà?",
      "options": [
        "Pedagog, paleògraf i editor",
        "Metge i naturalista",
        "Arquitecte modernista",
        "Militar i polític carlí"
      ],
      "correct": 0,
      "reference": "Cultura · Personatges"
    },
    {
      "id": "barbera-del-valles-c110",
      "text": "Qui va ser Josep Comas i Comadran?",
      "options": [
        "El fundador de Ràdio Barberà",
        "El primer marquès de Barberà",
        "Alcalde i promotor de la Creu de Barberà",
        "Descobridor de les pintures romàniques"
      ],
      "correct": 2,
      "reference": "Cultura · Personatges"
    },
    {
      "id": "barbera-del-valles-c111",
      "text": "Durant quins anys va ser Ana del Frago Barés alcaldessa de Barberà del Vallès?",
      "options": [
        "De 1999 a 2003",
        "De 2015 a 2019",
        "De 2019 a 2023",
        "De 2006 a 2015"
      ],
      "correct": 3,
      "reference": "Cultura · Personatges"
    },
    {
      "id": "barbera-del-valles-c112",
      "text": "Per quina formació va accedir Sílvia Fuster i Alay a l'alcaldia el 2015?",
      "options": [
        "Pel PSC",
        "Per la PCPB",
        "Per ERC",
        "Per CiU"
      ],
      "correct": 1,
      "reference": "Cultura · Personatges"
    },
    {
      "id": "barbera-del-valles-c113",
      "text": "A quina disciplina esportiva es dedica Víctor Rodríguez Romero, nascut a Barberà del Vallès el 1989?",
      "options": [
        "Al futbol",
        "Al ciclisme",
        "Al bàsquet",
        "A l'handbol"
      ],
      "correct": 0,
      "reference": "Cultura · Personatges"
    },
    {
      "id": "barbera-del-valles-c114",
      "text": "En quin any es va inaugurar el centre comercial Baricentro?",
      "options": [
        "El 1975",
        "El 1978",
        "El 1980",
        "El 1985"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c115",
      "text": "Quina fita històrica té el centre comercial Baricentro?",
      "options": [
        "És el més gran d'Europa",
        "És el primer centre comercial de l'Estat espanyol",
        "És el primer amb cinemes de Catalunya",
        "És el primer construït totalment sota terra"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c116",
      "text": "Entre els termes municipals de Barberà del Vallès i quin altre municipi se situa Baricentro?",
      "options": [
        "Sabadell",
        "Cerdanyola del Vallès",
        "Badia del Vallès",
        "Ripollet"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c117",
      "text": "Quins són els dos grans polígons industrials de Barberà del Vallès?",
      "options": [
        "La Zona Franca i Can Roqueta",
        "Can Feu i Sant Pau",
        "Santiga i Can Salvatella",
        "Can Gorgs i Can Serra"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c118",
      "text": "Quin pes té el sòl industrial sobre la superfície total del municipi?",
      "options": [
        "Gairebé el 50%",
        "Al voltant del 15%",
        "Prop del 30%",
        "Més del 70%"
      ],
      "correct": 0,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c119",
      "text": "Quin sector concentra més afiliacions al règim general de la Seguretat Social al municipi?",
      "options": [
        "Els serveis",
        "La indústria",
        "La construcció",
        "L'agricultura"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c120",
      "text": "Quin és el PIB per habitant de Barberà del Vallès l'any 2023?",
      "options": [
        "20.086 euros",
        "31.450 euros",
        "45.900 euros",
        "52.180 euros"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c121",
      "text": "Quines indústries tradicionals es van desenvolupar lligades als molins del riu Ripoll?",
      "options": [
        "La ceràmica i el vidre",
        "La siderúrgia",
        "El paper i el cotó",
        "L'adoberia i la pell"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c122",
      "text": "Quin ens públic és el titular de l'estació de ferrocarril de Barberà del Vallès?",
      "options": [
        "Ferrocarrils de la Generalitat de Catalunya (FGC)",
        "L'Àrea Metropolitana de Barcelona",
        "Adif",
        "L'Ajuntament de Barberà del Vallès"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c123",
      "text": "Quina línia de Rodalies té parada a l'estació de Barberà del Vallès?",
      "options": [
        "La R3",
        "La R4",
        "La R8",
        "La R2"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c124",
      "text": "Per quina línia circulen els trens que travessen el baixador en desús de Baricentro?",
      "options": [
        "Per la R4",
        "Per la R7",
        "Per la R2 nord",
        "Per la R8"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c125",
      "text": "Quines dues estacions estan projectades a Barberà dins la futura Línia Orbital Ferroviària?",
      "options": [
        "Can Llobet i Santiga",
        "Can Gorgs i Can Serra",
        "La Romànica i el Casc Antic",
        "Baricentro i Can Salvatella"
      ],
      "correct": 0,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c126",
      "text": "Quina ciutat comunica amb Barcelona la carretera C-58, que passa per Barberà?",
      "options": [
        "Girona",
        "Manresa",
        "Terrassa",
        "Mataró"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c127",
      "text": "Què és Nodus Barberà?",
      "options": [
        "Un centre cívic de barri",
        "Un institut de secundària",
        "Un mercat municipal",
        "Un centre de negocis municipal"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c128",
      "text": "Quina superfície té el Parc Central del Vallès, situat entre Barberà i Sabadell?",
      "options": [
        "5 hectàrees",
        "20 hectàrees",
        "47 hectàrees",
        "36 hectàrees"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c129",
      "text": "Quina de les escoles següents és una escola pública de primària de Barberà del Vallès?",
      "options": [
        "L'Escola Marta Mata",
        "L'Escola Joan Maragall",
        "L'Escola Pau Casals",
        "L'Escola Àngel Guimerà"
      ],
      "correct": 0,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c130",
      "text": "Quin dels centres següents NO és un institut de Barberà del Vallès?",
      "options": [
        "L'Institut La Romànica",
        "L'Institut Bitàcola",
        "L'Institut Can Planas",
        "L'Institut Egara"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c131",
      "text": "Quin és l'hospital de referència del municipi?",
      "options": [
        "L'Hospital Germans Trias i Pujol",
        "L'Hospital de Sabadell – Parc Taulí",
        "L'Hospital de Terrassa",
        "L'Hospital Vall d'Hebron"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c132",
      "text": "Quins centres d'atenció primària hi ha al municipi?",
      "options": [
        "Només el CAP Rosa dels Vents",
        "El CAP Barberà i el CAP Santiga",
        "El CAP Barberà i el CAP Rosa dels Vents",
        "El CAP Can Gorgs i el CAP La Romànica"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c133",
      "text": "On es troba el punt d'atenció continuada (PAC) de referència per a Barberà del Vallès?",
      "options": [
        "A Sabadell",
        "A Ripollet",
        "A Cerdanyola del Vallès",
        "A Badia del Vallès"
      ],
      "correct": 3,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c134",
      "text": "Quin nom rep el camp de futbol municipal situat al nucli de Barberà?",
      "options": [
        "Antoni Serra i Pujol",
        "Maria Reverter",
        "Elisa Badia",
        "Can Llobet"
      ],
      "correct": 0,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c135",
      "text": "Quantes piscines cobertes consten al municipi segons les dades d'espais esportius de 2024?",
      "options": [
        "Una",
        "Dues",
        "Quatre",
        "Sis"
      ],
      "correct": 2,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c136",
      "text": "Quants establiments hotelers hi havia a Barberà del Vallès l'any 2025?",
      "options": [
        "Un",
        "Tres",
        "Cinc",
        "Cap"
      ],
      "correct": 1,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c137",
      "text": "A quant ascendeix el pressupost municipal de l'any 2026?",
      "options": [
        "A 64,2 milions d'euros",
        "A 59,9 milions d'euros",
        "A 52,7 milions d'euros",
        "A 71,5 milions d'euros"
      ],
      "correct": 0,
      "reference": "Cultura · Economia, polígons, transport, ensenyament, sanitat i esports"
    },
    {
      "id": "barbera-del-valles-c138",
      "text": "Quina superfície aproximada té el bosc de Can Gorgs, l'àrea verda més gran dins del nucli urbà?",
      "options": [
        "5.700 m²",
        "20.000 m²",
        "36.000 m²",
        "47.000 m²"
      ],
      "correct": 3,
      "reference": "Cultura · Medi ambient i riu Ripoll"
    },
    {
      "id": "barbera-del-valles-c139",
      "text": "Quina extensió té el bosc de Santiga, format per alzinar i pineda de pi blanc?",
      "options": [
        "12 hectàrees",
        "20 hectàrees",
        "36 hectàrees",
        "47 hectàrees"
      ],
      "correct": 2,
      "reference": "Cultura · Medi ambient i riu Ripoll"
    },
    {
      "id": "barbera-del-valles-c140",
      "text": "A quin molí està associada una de les zones humides del Parc Fluvial del riu Ripoll?",
      "options": [
        "Al Molí d'en Santo",
        "Al Molí Vermell",
        "Al Molí d'en Planes",
        "Al Molí del Gall"
      ],
      "correct": 1,
      "reference": "Cultura · Medi ambient i riu Ripoll"
    },
    {
      "id": "barbera-del-valles-c141",
      "text": "Amb quin altre nom es coneix el torrent de Can Llobateres?",
      "options": [
        "Torrent dels Oms",
        "Torrent de la Verneda",
        "Torrent del Castell",
        "Torrent dels Àlbers"
      ],
      "correct": 3,
      "reference": "Cultura · Medi ambient i riu Ripoll"
    },
    {
      "id": "barbera-del-valles-c142",
      "text": "Quin percentatge de recollida selectiva de residus es va assolir el 2024?",
      "options": [
        "El 45,9%",
        "El 32,1%",
        "El 54,1%",
        "El 61,3%"
      ],
      "correct": 0,
      "reference": "Cultura · Medi ambient i riu Ripoll"
    },
    {
      "id": "barbera-del-valles-c143",
      "text": "Qui és l'alcalde de Barberà del Vallès?",
      "options": [
        "Pere Pubill i Linares",
        "Sílvia Fuster Alay",
        "Xavier Garcés Trillo",
        "Daniel González Cabrera"
      ],
      "correct": 2,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c144",
      "text": "Quin és el nombre legal de regidors del Ple de l'Ajuntament de Barberà del Vallès?",
      "options": [
        "17",
        "21",
        "25",
        "19"
      ],
      "correct": 1,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c145",
      "text": "Qui va ser el primer alcalde democràtic de Barberà del Vallès (1979-1983)?",
      "options": [
        "Antonio Lobo",
        "José Antonio Robles",
        "Josep Comas i Comadran",
        "Ana del Frago Barés"
      ],
      "correct": 0,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c146",
      "text": "Fins a quin any va ocupar l'alcaldia José Antonio Robles de manera continuada des de 1983?",
      "options": [
        "Fins al 1991",
        "Fins al 1999",
        "Fins al 2011",
        "Fins al 2006"
      ],
      "correct": 3,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c147",
      "text": "On es troba la seu de l'Ajuntament de Barberà del Vallès?",
      "options": [
        "A la plaça de la Vila, 1",
        "A l'avinguda Generalitat, 70",
        "Al passeig del Doctor Moragas, 2",
        "Al carrer Nemesi Valls, 16"
      ],
      "correct": 1,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c148",
      "text": "Quan se celebren les sessions ordinàries del Ple municipal?",
      "options": [
        "El primer dilluns de cada mes",
        "L'últim divendres de cada mes",
        "El penúltim dimecres laborable de cada mes",
        "Cada quinze dies, els dimarts"
      ],
      "correct": 2,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c149",
      "text": "Quin mes es considera període de vacances a efectes de sessions ordinàries del Ple?",
      "options": [
        "L'agost",
        "El juliol",
        "El desembre",
        "El setembre"
      ],
      "correct": 0,
      "reference": "Cultura · Alcaldia i ple municipal"
    },
    {
      "id": "barbera-del-valles-c150",
      "text": "Quin càrrec supramunicipal ocupa l'alcalde de Barberà del Vallès des del desembre de 2024?",
      "options": [
        "President de la Diputació de Barcelona",
        "Vicepresident de l'Àrea Metropolitana de Barcelona",
        "Delegat del Govern de la Generalitat",
        "President del Consell Comarcal del Vallès Occidental"
      ],
      "correct": 3,
      "reference": "Cultura · Alcaldia i ple municipal"
    }
  ]
};

export default barberaDelValles;
