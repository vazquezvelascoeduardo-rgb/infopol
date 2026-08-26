// Test específic Piera — àmbit municipal (teòric).
// 150 preguntes de coneixements professionals per a Agent de Policia Local de Piera.
import type { TestTopic } from './types';

const piera: TestTopic = {
  "slug": "piera",
  "title": "Piera · Teòric",
  "description": "organització municipal, ROM, policia local i ordenances",
  "icon": "🏛️",
  "accent": "from-orange-500 to-red-600",
  "category": "municipi",
  "municipi": "Piera",
  "badge": "🆕 2026",
  "questions": [
    {
      "id": "piera-1",
      "text": "Qui ocupa l'Alcaldia de l'Ajuntament de Piera en el mandat 2023-2027?",
      "options": [
        "Carme (M. Carmen) González Anjaumà.",
        "Neus Núñez Bosch.",
        "Josep Llopart Gardela.",
        "Jordi Madrid Roca."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-2",
      "text": "Quin és el nombre legal de membres del Ple de l'Ajuntament de Piera?",
      "options": [
        "Tretze.",
        "Quinze.",
        "Setze.",
        "Disset."
      ],
      "correct": 3,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-3",
      "text": "En la sessió constitutiva de 17 de juny de 2023, l'alcaldessa de Piera va resultar elegida:",
      "options": [
        "Per majoria absoluta, amb 9 vots dels 17 possibles.",
        "Per majoria simple, amb 7 vots.",
        "Automàticament, per encapçalar la llista més votada.",
        "En segona votació, per sorteig entre els caps de llista."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-4",
      "text": "Per quina candidatura va ser elegida l'alcaldessa de Piera?",
      "options": [
        "Esquerra Republicana - Piera (ERC-AM).",
        "Junts per Piera.",
        "Sumem per Piera, coalició electoral liderada pel PSC.",
        "Som Piera - somMÉScat."
      ],
      "correct": 2,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-5",
      "text": "A data d'agost de 2026, quina és la composició del Ple de Piera per grups?",
      "options": [
        "Sumem 5 · ERC 4 · Junts 3 · Som Piera 2 · VOX 2 · PP 1.",
        "Sumem 5 · ERC 4 · Junts 3 · Som Piera 2 · VOX 2 · 1 regidor no adscrit.",
        "Sumem 6 · ERC 4 · Junts 3 · Som Piera 2 · VOX 1 · 1 regidor no adscrit.",
        "Sumem 5 · ERC 4 · Junts 3 · Som Piera 2 · VOX 1 · 2 regidors no adscrits."
      ],
      "correct": 3,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-6",
      "text": "Quants grups municipals hi ha constituïts a l'Ajuntament de Piera a data d'agost de 2026?",
      "options": [
        "Cinc.",
        "Sis.",
        "Quatre.",
        "Set."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-7",
      "text": "Pel que fa a les mocions de censura a l'Ajuntament de Piera, és cert que:",
      "options": [
        "Es va aprovar una moció de censura el desembre de 2023, ja dins del mandat 2023-2027.",
        "Mai no n'ha prosperat cap a Piera.",
        "El desembre de 2020, dins el mandat 2019-2023, va prosperar una moció de censura que va portar Josep Llopart Gardela a l'Alcaldia.",
        "La darrera es va aprovar el juliol de 2025, arran del pas d'un regidor de VOX a no adscrit."
      ],
      "correct": 2,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-8",
      "text": "Quantes tinences d'alcaldia estableix el cartipàs municipal 2023-2027 de Piera?",
      "options": [
        "Tres.",
        "Quatre.",
        "Cinc.",
        "Sis."
      ],
      "correct": 2,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-9",
      "text": "Qui ocupa la primera tinença d'alcaldia de Piera en el mandat 2023-2027?",
      "options": [
        "Neus Núñez Bosch (ERC).",
        "Iban Pujol Maried (Sumem per Piera).",
        "Raquel Calsina Galán (ERC).",
        "Gemma Millán Gibert (Sumem per Piera)."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-10",
      "text": "Quin regidor té delegades les competències d'Hisenda, Seguretat i Civisme i Organització Interna, i és per tant el regidor de referència de la Policia Local?",
      "options": [
        "Jorge Javier Bernués Jorba.",
        "Àngel Sabaté Solà.",
        "Iban Pujol Maried.",
        "Josep Marc Romeu Torres."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-11",
      "text": "En quina data es va celebrar el Ple d'organització (cartipàs) del mandat 2023-2027?",
      "options": [
        "El 17 de juny de 2023.",
        "El 5 de juliol de 2023.",
        "El 26 de juny de 2023.",
        "El 28 de maig de 2023."
      ],
      "correct": 1,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-12",
      "text": "Segons l'acord del Ple de 5 de juliol de 2023, les sessions ordinàries del Ple de Piera se celebren:",
      "options": [
        "L'últim dimecres de cada mes.",
        "L'últim dimecres no festiu del primer, tercer, cinquè, setè, novè i onzè mes de l'any.",
        "El primer dimecres dels mesos parells.",
        "Cada dos mesos, el darrer divendres."
      ],
      "correct": 1,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-13",
      "text": "Quantes sessions plenàries ordinàries se celebren cada any a Piera com a conseqüència d'aquesta periodicitat?",
      "options": [
        "Dotze.",
        "Quatre.",
        "Sis.",
        "Onze."
      ],
      "correct": 2,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-14",
      "text": "La Junta de Govern Local de Piera està integrada per:",
      "options": [
        "L'alcaldessa, que la presideix, i cinc regidors o regidores.",
        "L'alcaldessa i tres regidors o regidores.",
        "Cinc regidors, un per cada grup municipal.",
        "L'alcaldessa i sis regidors o regidores."
      ],
      "correct": 0,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-15",
      "text": "Segons l'acord del Ple de 5 de juliol de 2023 i la informació publicada al web municipal, la Junta de Govern Local de Piera fa sessió ordinària:",
      "options": [
        "Cada dimecres a les 18 hores.",
        "Cada dilluns a les 18 hores.",
        "Els dilluns no festius a les 16:30 hores.",
        "El primer dilluns de cada mes a les 12 hores."
      ],
      "correct": 2,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-16",
      "text": "Segons l'article 34.1 del Reglament Orgànic Municipal de Piera, la Junta de Govern Local es reuneix ordinàriament:",
      "options": [
        "Cada quinze dies, els dimarts a les 9 hores.",
        "Els dilluns no festius a les 16:30 hores.",
        "L'últim dimecres de cada mes.",
        "Cada setmana, els dilluns a les 18 hores; si és festiu, l'endemà a la mateixa hora."
      ],
      "correct": 3,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-17",
      "text": "Les sessions de la Junta de Govern Local de Piera:",
      "options": [
        "Són sempre públiques.",
        "Són públiques quan s'hi tracten assumptes de seguretat ciutadana.",
        "Són públiques si ho acorda el Ple per majoria absoluta.",
        "No són públiques, tot i que puntualment poden ser-ho."
      ],
      "correct": 3,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-18",
      "text": "Quantes comissions informatives permanents té constituïdes l'Ajuntament de Piera segons la informació oficial del web municipal?",
      "options": [
        "Tres.",
        "Quatre.",
        "Cinc.",
        "Sis."
      ],
      "correct": 1,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-19",
      "text": "Qui presideix les comissions informatives de l'Ajuntament de Piera?",
      "options": [
        "El regidor o regidora delegat de l'àrea corresponent.",
        "El regidor o regidora de més edat de cada comissió.",
        "Un vocal escollit per la mateixa comissió en la sessió constitutiva.",
        "L'alcaldessa, que presideix les quatre comissions."
      ],
      "correct": 3,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-20",
      "text": "Quin import va fixar el Ple de 5 de juliol de 2023 en concepte d'assistència a una comissió informativa?",
      "options": [
        "280,00 euros.",
        "170,00 euros.",
        "150,00 euros.",
        "100,00 euros."
      ],
      "correct": 1,
      "reference": "Organització municipal i cartipàs"
    },
    {
      "id": "piera-21",
      "text": "L'aprovació definitiva del Reglament Orgànic Municipal (ROM) de Piera es va publicar al BOPB de:",
      "options": [
        "10 d'agost de 2022.",
        "23 d'abril de 2021.",
        "20 de gener de 2020.",
        "14 de gener de 2005."
      ],
      "correct": 2,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-22",
      "text": "Segons l'article 9.2 del ROM de Piera, el quòrum de constitució del Ple és:",
      "options": [
        "La majoria absoluta del nombre legal de membres.",
        "La meitat més un dels regidors electes.",
        "Dos terços del nombre legal de membres.",
        "Un terç del nombre legal de membres, mantingut durant tota la sessió, amb la presència de l'alcalde/essa i del secretari/ària o els seus substituts legals."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-23",
      "text": "D'acord amb l'article 9.3 del ROM, una sessió del Ple pot deixar de ser pública:",
      "options": [
        "Per decisió unilateral de la presidència.",
        "A petició d'una quarta part dels regidors.",
        "Per acord del Ple adoptat per majoria absoluta, en assumptes que puguin afectar el dret a l'honor, a la intimitat o a la pròpia imatge.",
        "En cap cas: totes les sessions són sempre públiques."
      ],
      "correct": 2,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-24",
      "text": "Pel que fa al públic assistent a les sessions del Ple, el ROM de Piera (art. 9.5) estableix que:",
      "options": [
        "Pot intervenir en el debat amb autorització prèvia de la presidència.",
        "No pot enregistrar les sessions en cap cas.",
        "Pot manifestar el seu grat o desgrat sempre que ho faci de manera moderada.",
        "Pot gravar àudio i vídeo sense permís exprés i difondre'l lliurement, però no pot participar ni manifestar grat o desgrat."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-25",
      "text": "Quina és l'antelació mínima de la convocatòria de les sessions del Ple segons l'article 10.2 del ROM de Piera?",
      "options": [
        "Tres dies hàbils.",
        "Dos dies hàbils.",
        "Cinc dies naturals.",
        "Vint-i-quatre hores."
      ],
      "correct": 1,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-26",
      "text": "Segons l'article 8.2 del ROM, la sessió extraordinària del Ple a sol·licitud dels regidors requereix:",
      "options": [
        "Un terç dels regidors, amb un màxim de dues sol·licituds anuals per regidor.",
        "Una quarta part dels regidors, sense que cap d'ells en pugui sol·licitar més de tres a l'any.",
        "La meitat dels regidors, sense límit anual de sol·licituds.",
        "La petició d'un grup municipal, amb un màxim de quatre sol·licituds a l'any."
      ],
      "correct": 1,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-27",
      "text": "Si l'alcaldessa no convoca la sessió extraordinària sol·licitada dins dels 15 dies hàbils, el ROM de Piera preveu que:",
      "options": [
        "El Ple queda automàticament convocat el desè dia hàbil següent a la finalització del termini, a les dotze hores.",
        "La sol·licitud decau i cal tornar-la a presentar.",
        "La convoca el secretari o secretària en el termini de cinc dies.",
        "El Ple queda convocat l'endemà a les 18 hores."
      ],
      "correct": 0,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-28",
      "text": "Quin ha de ser el primer punt de l'ordre del dia d'una sessió extraordinària urgent del Ple (art. 8.3 del ROM)?",
      "options": [
        "L'aprovació de l'acta de la sessió anterior.",
        "La ratificació de la urgència de la convocatòria per majoria simple.",
        "La ratificació de la urgència per majoria absoluta.",
        "La lectura íntegra del decret de convocatòria."
      ],
      "correct": 1,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-29",
      "text": "Segons l'article 20.1 del ROM de Piera, els precs:",
      "options": [
        "Se sotmeten sempre a votació del Ple.",
        "No es poden ni debatre ni votar.",
        "Es poden debatre però no votar.",
        "Només els poden formular els portaveus dels grups municipals."
      ],
      "correct": 2,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-30",
      "text": "Els precs i les preguntes presentats per escrit a l'alcaldia amb una antelació mínima d'un dia abans del Ple:",
      "options": [
        "Es contesten sempre en la sessió següent.",
        "No es contesten en sessió, sinó únicament per escrit.",
        "Es contesten per escrit en el termini d'un mes.",
        "Es contesten ordinàriament en la mateixa sessió o, motivant-ne el retard, en la següent."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-31",
      "text": "I els precs i les preguntes formulats oralment durant la sessió:",
      "options": [
        "S'han de contestar immediatament en tot cas.",
        "Decauen si no es contesten en el mateix acte.",
        "Es contesten ordinàriament en la sessió següent, sens perjudici que es puguin respondre immediatament.",
        "Es contesten per escrit en el termini de deu dies."
      ],
      "correct": 2,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-32",
      "text": "Quantes mocions pot presentar cada grup polític, com a màxim, segons l'article 21.3 del ROM de Piera?",
      "options": [
        "Una.",
        "Tres.",
        "Quatre.",
        "Dues."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-33",
      "text": "Presentada en forma una moció de censura, l'article 28.4 del ROM de Piera estableix que:",
      "options": [
        "El Ple queda automàticament convocat a les dotze hores del desè dia hàbil següent al del registre de l'escrit.",
        "L'alcaldia l'ha de convocar en el termini de cinc dies naturals.",
        "La sessió se celebra l'endemà del registre de l'escrit.",
        "La data la fixa lliurement l'alcaldia."
      ],
      "correct": 0,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-34",
      "text": "La sessió plenària en què es debat una moció de censura, segons l'article 28.5 del ROM:",
      "options": [
        "La presideix l'alcalde o alcaldessa en tot cas.",
        "La presideix una mesa d'edat, integrada pels regidors de major i menor edat dels presents, excloent-ne l'alcalde/essa i el candidat proposat.",
        "La presideix el candidat o candidata proposat a l'Alcaldia.",
        "La presideix el secretari o secretària de la Corporació."
      ],
      "correct": 1,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-35",
      "text": "A quins assumptes es pot vincular la qüestió de confiança segons l'article 29 del ROM de Piera?",
      "options": [
        "A qualsevol moció presentada per l'equip de govern.",
        "Al nomenament dels tinents i tinentes d'alcaldia.",
        "A l'aprovació de la plantilla de personal i de la relació de llocs de treball.",
        "Als pressupostos anuals, al reglament orgànic, a les ordenances fiscals i a l'aprovació que posi fi a la tramitació d'instruments de planejament."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-36",
      "text": "Pel que fa a la intervenció dels ciutadans en el Ple (arts. 124.2 i 124.3 del ROM), és cert que:",
      "options": [
        "Només s'obre torn de paraula un cop closa oficialment la sessió.",
        "Només s'obre torn de paraula una hora abans de la sessió.",
        "La intervenció ciutadana no hi està prevista.",
        "Hi ha dos torns: un una hora abans de cada sessió plenària ordinària i un altre un cop closa oficialment la sessió."
      ],
      "correct": 3,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-37",
      "text": "Les dotacions econòmiques als grups municipals NO es poden destinar, segons l'article 73.4 del ROM, a:",
      "options": [
        "La contractació de personal, l'adquisició de béns que constitueixin actius fixos ni la campanya o propaganda electoral.",
        "El lloguer de local ni els subministraments bàsics.",
        "Les despeses de gestoria ni el material d'oficina.",
        "L'organització d'actes."
      ],
      "correct": 0,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-38",
      "text": "La justificació de les dotacions als grups municipals corresponent a l'any vençut s'ha de presentar, segons l'article 73.5 del ROM:",
      "options": [
        "Abans del 31 de desembre.",
        "Abans del 30 de juny.",
        "Abans del 15 de febrer de cada any.",
        "Dins dels tres mesos següents al tancament de l'exercici."
      ],
      "correct": 2,
      "reference": "Reglament orgànic municipal"
    },
    {
      "id": "piera-39",
      "text": "Com es denomina la norma pròpia que regula el cos de la Policia Local de Piera?",
      "options": [
        "Reglament d'armament i mitjans de defensa de la Policia Local de Piera.",
        "Ordenança municipal de seguretat ciutadana i policia de Piera.",
        "Reglament intern de la Policia Local de la Vila de Piera i Protocol d'ús dels dispositius conductors d'energia.",
        "Reglament de règim intern dels cossos de seguretat de la Vila de Piera."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-40",
      "text": "L'aprovació definitiva de la modificació del Reglament intern de la Policia Local de Piera es va publicar al BOPB de:",
      "options": [
        "23 d'abril de 2021.",
        "23 de febrer de 2022.",
        "11 de juny de 2025.",
        "20 de gener de 2020."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-41",
      "text": "Segons l'article 1 del Reglament intern, la Policia Local de Piera és:",
      "options": [
        "Un cos de naturalesa militar integrat en les forces i cossos de seguretat de l'Estat.",
        "Un institut armat, de naturalesa civil, integrat en un cos únic, amb estructura i organització jerarquitzada.",
        "Un servei administratiu municipal sense estructura jerarquitzada.",
        "Un cos auxiliar i dependent del cos de Mossos d'Esquadra."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-42",
      "text": "Segons l'article 12.1 del Reglament intern, la Policia Local de Piera s'estructura actualment en:",
      "options": [
        "Escala superior, escala executiva, escala intermèdia i escala bàsica.",
        "Escala executiva i escala bàsica.",
        "Escala intermèdia (sotsinspector/a i sergent) i escala bàsica (caporal i agent).",
        "Escala tècnica i escala bàsica."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-43",
      "text": "D'acord amb la plantilla orgànica vigent de l'Ajuntament de Piera i amb la convocatòria de places de 2024, la categoria d'agent de la Policia Local es classifica en el:",
      "options": [
        "Grup C, subgrup C2.",
        "Grup B.",
        "Grup A, subgrup A2.",
        "Grup C, subgrup C1."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-44",
      "text": "Quantes places de Policia Local recull la plantilla orgànica de 2025 de l'Ajuntament de Piera?",
      "options": [
        "22 places.",
        "25 places.",
        "27 places (1 sotsinspector/a, 1 sergent, 3 caporals i 22 agents).",
        "30 places."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-45",
      "text": "Segons l'article 11 del Reglament intern, el cap del cos de la Policia Local de Piera:",
      "options": [
        "És el membre de la plantilla de major graduació i ha de pertànyer com a mínim a l'escala intermèdia.",
        "És nomenat lliurement per l'alcaldia entre qualsevol agent del cos.",
        "Ha de pertànyer necessàriament a l'escala executiva.",
        "És el regidor o regidora delegat de Seguretat Ciutadana."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-46",
      "text": "El comandament de la Policia Local de Piera, segons l'article 10 del Reglament intern:",
      "options": [
        "Correspon al cap del cos amb caràcter exclusiu.",
        "Correspon per llei al regidor o regidora de Seguretat Ciutadana.",
        "L'exerceix l'alcalde o alcaldessa, que el pot delegar en un membre de la Corporació.",
        "Correspon a la Junta de Govern Local."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-47",
      "text": "Qui és l'òrgan competent per imposar la sanció de separació del servei a un membre de la Policia Local de Piera?",
      "options": [
        "L'alcalde o alcaldessa.",
        "La Junta de Govern Local.",
        "El cap del cos, a proposta de l'instructor.",
        "El Ple de la Corporació."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-48",
      "text": "Segons l'article 10.6 del Reglament intern, l'alcalde o alcaldessa de Piera presideix:",
      "options": [
        "Únicament la Junta Local de Seguretat.",
        "La Junta Local de Seguretat i el Consell de Seguretat de l'Anoia.",
        "La Comissió de Seguretat i Civisme i el Consell Comarcal de l'Anoia.",
        "La Junta Local de Seguretat, la Comissió de Seguretat i Civisme i el Comitè d'Ètica de la Policia."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-49",
      "text": "Pel que fa a l'àmbit d'actuació de la Policia Local de Piera (art. 6 del Reglament intern):",
      "options": [
        "No pot actuar mai fora del terme municipal, sense excepcions.",
        "Només pot actuar fora del terme municipal en situacions d'emergència i amb autorització prèvia de l'autoritat competent, donant-ne compte al Departament de Governació.",
        "Pot actuar lliurement dins de tota la comarca de l'Anoia.",
        "Pot actuar fora del terme municipal amb la simple autorització del cap del cos."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-50",
      "text": "Quins són els elements d'acreditació dels membres de la Policia Local de Piera segons l'article 21?",
      "options": [
        "El carnet professional i el número d'identificació personal.",
        "La placa insígnia i l'arma reglamentària.",
        "L'uniforme reglamentari i el document nacional d'identitat.",
        "La targeta d'identitat professional i la placa insígnia, personals i intransferibles."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-51",
      "text": "Respecte de la placa insígnia, l'article 23 del Reglament intern estableix que:",
      "options": [
        "Perd la seva validesa quan el titular cessa en el servei, tant temporalment com definitivament.",
        "És propietat de l'agent un cop superat el període de pràctiques.",
        "Només es lliura als membres amb comandament.",
        "Té una validesa de cinc anys renovables."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-52",
      "text": "En cas de cessament en el servei actiu o de suspensió de funcions, la targeta d'identitat professional i la placa insígnia s'han de retornar:",
      "options": [
        "Al cap del cos.",
        "Al departament de Recursos Humans de l'Ajuntament.",
        "A l'Alcaldia.",
        "A la Intervenció d'Armes de la Guàrdia Civil."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-53",
      "text": "Quants uniformes bàsics preveu l'article 27.4 del Reglament intern de la Policia Local de Piera?",
      "options": [
        "Tres: de gala, de representació i operatiu.",
        "Dos: l'uniforme de representació i l'uniforme de treball operatiu.",
        "Quatre, segons l'estació de l'any i el servei.",
        "Un de sol, amb variants d'hivern i d'estiu."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-54",
      "text": "Segons l'article 5 del Reglament intern, els membres de la Policia Local de Piera:",
      "options": [
        "Han de ser funcionaris de carrera i tenen en tot moment la condició d'agents de l'autoritat en l'exercici de les seves funcions o en ocasió d'aquestes.",
        "Poden ser personal laboral fix quan així ho determini la plantilla.",
        "Només tenen la condició d'agents de l'autoritat quan van uniformats.",
        "Tenen la condició d'agents de l'autoritat únicament en actes de servei programats."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-55",
      "text": "L'armament bàsic dels membres de la Policia Local de Piera, segons l'article 29.1.a, consisteix en:",
      "options": [
        "Pistola semiautomàtica del calibre 7,65 mm.",
        "Revòlver del calibre 45.",
        "Pistola semiautomàtica del calibre 9 mm Pb o revòlver del calibre 38.",
        "Exclusivament pistola semiautomàtica del calibre 9 mm Parabellum."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-56",
      "text": "Pel que fa a les defenses (art. 29.1.c del Reglament intern):",
      "options": [
        "Han de ser homologades i es poden utilitzar defenses extensibles homologades, havent superat el curs específic corresponent.",
        "Estan prohibides en tot cas dins del terme municipal.",
        "Només se'n poden utilitzar de rígides, mai extensibles.",
        "Cada agent pot triar lliurement el model que consideri més adequat."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-57",
      "text": "Segons el Protocol d'ús del dispositiu conductor d'energia (DCE) de Piera:",
      "options": [
        "Qualsevol agent del cos el pot utilitzar sense requisits addicionals.",
        "El DCE substitueix la resta de mitjans de defensa de l'agent.",
        "N'hi ha prou amb una formació teòrica prèvia.",
        "El seu ús és restringit als membres expressament autoritzats que hagin superat la formació teoricopràctica necessària, i els qui tinguin l'arma de foc reglamentària intervinguda o retirada no estan autoritzats a utilitzar-lo."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-58",
      "text": "A efectes del Protocol de Piera, s'entén com a utilització del DCE:",
      "options": [
        "Únicament la descàrrega amb sondes sobre una persona.",
        "Únicament els casos en què es produeixen lesions.",
        "El fet de treure'l de la funda i efectuar un arc elèctric amb finalitat dissuasiva.",
        "El simple fet de portar-lo a la funda durant el servei."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-59",
      "text": "Els efectius policials que disposin de DCE, segons el punt 4.4 del Protocol:",
      "options": [
        "Queden dispensats de portar altres mitjans de defensa.",
        "Han de tenir disponible també un desfibril·lador extern automàtic (DEA) i un dispositiu personal de gravació (DPG).",
        "Han de portar sempre dues unitats de DCE.",
        "Han de renunciar a l'ús de la defensa reglamentària."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-60",
      "text": "Un cop utilitzat el DCE, el Protocol de Piera estableix que:",
      "options": [
        "Cal esperar en tot cas els serveis sanitaris per extreure les sondes.",
        "L'extracció de les sondes la pot fer qualsevol ciutadà present.",
        "Cal netejar la zona amb alcohol abans de retirar les sondes.",
        "Cal preservar els elements utilitzats, emprar guants de protecció per extreure les sondes i informar de l'ús i de les circumstàncies."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-61",
      "text": "En quin any es va publicar al BOPB el Reglament d'ús d'aeronaus pilotades per control remot del cos de Policia Local de Piera?",
      "options": [
        "2021.",
        "2025.",
        "2022.",
        "2020."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-62",
      "text": "Quantes aeronaus i de quin model recull l'article 5 del Reglament de drons de la Policia Local de Piera?",
      "options": [
        "Dos drons de la marca DJI, model Phantom 4.",
        "Tres drons de diferents models segons el tipus de servei.",
        "Un dron de la marca DJI, model Mini 3 Pro.",
        "Un únic dron de la marca DJI, model Mavic III Thermal."
      ],
      "correct": 3,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-63",
      "text": "Quina de les limitacions següents recull l'article 12 del Reglament de drons de Piera?",
      "options": [
        "Es pot pilotar des de vehicles en moviment sense cap restricció.",
        "Un mateix pilot pot atendre fins a dues aeronaus simultàniament.",
        "No es pot pilotar des de vehicles en moviment, llevat d'una planificació que ho garanteixi, i ni el pilot ni els observadors poden atendre més d'una aeronau alhora.",
        "No hi ha cap limitació sobre l'ús de l'espai aeri."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-64",
      "text": "El personal tècnic, administratiu o d'oficis adscrit a la Policia Local de Piera (art. 13 del Reglament intern):",
      "options": [
        "Té la condició d'agent de l'autoritat mentre estigui de servei.",
        "No pot realitzar tasques policíaques ni que requereixin la condició d'agent de l'autoritat, i no li és aplicable el Reglament intern.",
        "Pot fer tasques de vigilància de la via pública amb uniforme.",
        "Pot substituir els agents en tasques administratives de denúncia."
      ],
      "correct": 1,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-65",
      "text": "Quina és l'adreça de la comissaria de la Policia Local de Piera actualment en servei?",
      "options": [
        "Avinguda de la Carretera d'Igualada, 103.",
        "Carrer de la Plaça, 16-18.",
        "Carrer Folch i Torres, 35.",
        "Centre de Serveis \"La Bòbila\"."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-66",
      "text": "Respecte de la comissaria compartida entre la Policia Local i els Mossos d'Esquadra a Piera, és cert que:",
      "options": [
        "És un projecte previst a l'Avinguda de la Carretera d'Igualada, 103, que encara no està en funcionament.",
        "Va entrar en servei l'any 2025 i és la seu actual del cos.",
        "Està situada al carrer Folch i Torres, 35, i ja acull els dos cossos.",
        "És la seu de l'Àrea Bàsica Policial dels Mossos d'Esquadra de l'Anoia."
      ],
      "correct": 0,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-67",
      "text": "Segons la carta de serveis de la Policia Local de Piera publicada al web municipal:",
      "options": [
        "El servei de policia local és un servei mínim obligatori per a tots els municipis.",
        "Les línies de servei són exclusivament la seguretat i el trànsit.",
        "Es fa constar que no es tracta d'un servei obligatori, i les línies de servei són seguretat, prevenció, educació viària, atenció especialitzada a les víctimes i relacions amb la comunitat.",
        "El servei es presta de manera mancomunada amb els municipis veïns."
      ],
      "correct": 2,
      "reference": "Policia local: reglament intern, escales, règim disciplinari, armament, dce i drons"
    },
    {
      "id": "piera-68",
      "text": "L'aprovació definitiva de l'Ordenança de convivència ciutadana i civisme i de la tinença d'animals domèstics de Piera es va publicar al BOPB de:",
      "options": [
        "10 d'agost de 2022.",
        "14 d'abril de 2014.",
        "18 d'abril de 2008.",
        "26 de juny de 2010."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-69",
      "text": "Segons l'article 52.4 de l'Ordenança de civisme de Piera, la crema de rostolls:",
      "options": [
        "És lliure a les zones agrícoles del terme municipal.",
        "Només està prohibida entre l'1 de juny i el 30 de setembre.",
        "No és permesa al nucli urbà, a les urbanitzacions ni a les zones naturals i agrícoles, excepte amb permisos expressos de l'Ajuntament.",
        "Està permesa sempre que es faci a més de 500 metres de qualsevol habitatge."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-70",
      "text": "Segons l'article 122 de l'Ordenança de civisme de Piera, les infraccions LLEUS de CIVISME se sancionen amb multes de:",
      "options": [
        "100 a 750 euros.",
        "50 a 750 euros.",
        "300 a 3.000 euros.",
        "Fins a 90 euros."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-71",
      "text": "I les infraccions GREUS de CIVISME, segons el mateix article 122:",
      "options": [
        "De 751 a 3.000 euros.",
        "De 3.001 a 9.000 euros.",
        "Fins a 300 euros.",
        "De 751 a 1.500 euros."
      ],
      "correct": 3,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-72",
      "text": "Les infraccions MOLT GREUS de CIVISME de l'Ordenança de Piera se sancionen amb multes de:",
      "options": [
        "De 1.501 a 45.000 euros.",
        "De 1.501 a 3.000 euros.",
        "Fins a 600 euros.",
        "De 9.001 a 45.000 euros."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-73",
      "text": "Quina afirmació sobre el règim sancionador de l'article 122 de l'Ordenança de civisme de Piera és correcta?",
      "options": [
        "Estableix una única escala de multes per a totes les infraccions de l'ordenança.",
        "Remet íntegrament a les quanties de la legislació estatal de seguretat ciutadana.",
        "Estableix expressament dos règims de sancions diferenciats: un per a les infraccions de civisme i un altre per a les de tinença d'animals.",
        "Estableix tres règims diferents: civisme, animals i circulació."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-74",
      "text": "La reducció per pagament prevista a l'article 126 de l'Ordenança de civisme de Piera consisteix en:",
      "options": [
        "Una reducció del 50 % si es paga en el termini de 20 dies naturals.",
        "Una reducció del 50 % si es paga dins de les 24 hores següents.",
        "Una reducció del 30 % si es paga dins dels 15 dies hàbils següents.",
        "Una reducció del 20 % de l'import mínim de la sanció si es paga dins dels 3 dies hàbils posteriors a la imposició de la denúncia, assumint-ne la culpabilitat."
      ],
      "correct": 3,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-75",
      "text": "Quin efecte té el pagament amb la reducció de l'article 126 de l'Ordenança de civisme?",
      "options": [
        "Suspèn el procediment fins a la resolució definitiva.",
        "Permet recórrer igualment en via administrativa dins del termini ordinari.",
        "Només comporta el reconeixement parcial dels fets.",
        "Comporta la terminació del procediment i la renúncia a la interposició de recursos en via administrativa."
      ],
      "correct": 3,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-76",
      "text": "Segons l'article 123 de l'Ordenança de civisme de Piera, les infraccions prescriuen:",
      "options": [
        "Al cap d'un any les lleus, tres anys les greus i cinc anys les molt greus.",
        "Al cap de tres mesos les lleus, un any les greus i dos anys les molt greus.",
        "Al cap de sis mesos les lleus, dos anys les greus i tres anys les molt greus.",
        "Totes al cap de quatre anys."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-77",
      "text": "Una sanció imposada per una infracció LLEU de l'Ordenança de civisme de Piera prescriu al cap de:",
      "options": [
        "Sis mesos.",
        "Un any.",
        "Dos anys.",
        "Tres anys."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-78",
      "text": "Segons l'article 127 de l'Ordenança de civisme de Piera, la competència per imposar les sancions correspon:",
      "options": [
        "A l'alcalde o alcaldessa, tret de les que corresponguin al Ple per atribució legal, i és delegable en altres òrgans municipals.",
        "Exclusivament al Ple de la Corporació.",
        "Al cap de la Policia Local, com a instructor nat dels expedients.",
        "A la Junta de Govern Local, sense possibilitat de delegació."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-79",
      "text": "El titular d'un vehicle amb el qual s'ha comès una infracció de l'Ordenança de civisme de Piera és responsable (art. 124):",
      "options": [
        "Sempre subsidiari, condueixi o no el vehicle.",
        "Directe si el conduïa en el moment de la infracció, i subsidiari si no n'era el conductor.",
        "Sempre directe, condueixi o no el vehicle.",
        "Solidari en tot cas amb el conductor."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-80",
      "text": "L'article 124.2 de l'Ordenança de civisme de Piera considera responsables subsidiaris:",
      "options": [
        "Els organitzadors d'espectacles públics.",
        "Els titulars de llicències municipals.",
        "Les persones titulars o propietàries dels habitatges o parcel·les, si no s'identifiquen els autors dels fets.",
        "Els agents cívics que hagin presenciat els fets."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-81",
      "text": "Quan diverses infraccions de l'Ordenança de civisme de Piera guarden entre si relació de causa a efecte (art. 125.1):",
      "options": [
        "S'imposa únicament la sanció corresponent a la infracció més greu.",
        "S'imposen totes les sancions acumulativament.",
        "S'imposa la mitjana aritmètica de les sancions.",
        "S'imposa la sanció més elevada incrementada en un 50 %."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-82",
      "text": "En la substitució de les sancions pecuniàries per mesures correctores en el cas de menors (art. 114.2 de l'Ordenança de civisme):",
      "options": [
        "No cal demanar l'opinió dels pares, mares o tutors.",
        "L'opinió dels pares, mares o tutors és preceptiva però no vinculant.",
        "Només cal el consentiment dels pares si el menor té menys de catorze anys.",
        "Cal sol·licitar l'opinió dels pares, mares o tutors, que és vinculant."
      ],
      "correct": 3,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-83",
      "text": "Segons l'article 114.3 de l'Ordenança de civisme de Piera, els pares, mares, tutors o guardadors són, respecte dels danys produïts per les infraccions comeses pels menors que en depenen:",
      "options": [
        "Responsables penals directes.",
        "Responsables civils subsidiaris.",
        "Responsables solidaris en tot cas i sense excepció.",
        "No en són responsables en cap cas."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-84",
      "text": "Els agents cívics previstos a l'article 107 de l'Ordenança de civisme de Piera:",
      "options": [
        "Tenen la condició d'agents de l'autoritat i poden formular denúncies amb valor probatori.",
        "Poden identificar les persones presumptament infractores i requerir-los la documentació.",
        "Poden fer funcions de vigilància però no tenen la condició d'agents de l'autoritat, i poden demanar a la Policia Local que exerceixi les funcions d'autoritat.",
        "Són membres de la Policia Local destinats en tasques de proximitat."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-85",
      "text": "Segons l'article 110.1 de l'Ordenança de civisme de Piera, els fets constatats pels agents de l'autoritat:",
      "options": [
        "Constitueixen prova plena i no admeten prova en contrari.",
        "No tenen cap valor probatori si el denunciat els nega.",
        "Tenen valor probatori, sens perjudici de les proves que puguin aportar els interessats en defensa dels seus drets o interessos.",
        "Només tenen valor probatori si van acompanyats de fotografia."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-86",
      "text": "Pel que fa a la incorporació d'imatges als expedients (art. 110.2 de l'Ordenança de civisme):",
      "options": [
        "Es poden incorporar imatges obtingudes per fotografia, filmació digital o altres mitjans tecnològics, i l'ús de videocàmeres requereix les autoritzacions previstes i el respecte del principi de proporcionalitat.",
        "Està prohibida en tot cas la incorporació d'imatges.",
        "Només es poden incorporar imatges obtingudes per càmeres fixes de titularitat municipal.",
        "Les imatges es poden obtenir lliurement sense cap autorització ni límit."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-87",
      "text": "Quan la persona denunciada no acredita la seva residència habitual en territori espanyol (art. 113.2 de l'Ordenança de civisme):",
      "options": [
        "L'agent li ha d'oferir la possibilitat de fer efectiva la sanció immediatament i, si no ho fa, s'han d'adoptar mesures cautelars per assegurar l'ingrés de l'import mínim.",
        "S'ha d'arxivar la denúncia per impossibilitat de notificació.",
        "S'ha de conduir necessàriament la persona a dependències policials.",
        "S'ha de tramitar l'expedient sense cap especialitat."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-88",
      "text": "El sistema de mediació previst a l'article 116 de l'Ordenança de civisme de Piera:",
      "options": [
        "És obligatori abans d'incoar qualsevol expedient sancionador.",
        "Té caràcter voluntari, i l'òrgan competent pot reconduir el procediment a mediació per acord motivat.",
        "Només s'aplica a les infraccions molt greus.",
        "Substitueix sempre la sanció pecuniària."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-89",
      "text": "Fer grafits, pintades o inscripcions sobre el mobiliari urbà i la senyalització viària està tipificat a l'article 119.9 de l'Ordenança de civisme de Piera com a infracció:",
      "options": [
        "Greu.",
        "Molt greu.",
        "Lleu.",
        "No tipificada per l'ordenança municipal."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-90",
      "text": "Ara bé, quan la col·locació de cartells o pancartes es fa sobre monuments o edificis públics especialment catalogats o sobre mobiliari urbà i l'objecte de la propaganda té contingut comercial, l'Ordenança de civisme de Piera qualifica la infracció com a:",
      "options": [
        "Lleu, amb l'import màxim del tram.",
        "Greu.",
        "Molt greu.",
        "Greu, amb la possibilitat de reducció del 50 %."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-91",
      "text": "La falta de respecte, desconsideració o conducta agressiva envers els agents i els empleats municipals en el desenvolupament de les seves funcions està tipificada a l'article 120.4 com a infracció:",
      "options": [
        "Greu.",
        "Lleu.",
        "Molt greu.",
        "Lleu si no hi ha insults i greu si n'hi ha."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-92",
      "text": "Segons els articles 121.1 i 121.2 de l'Ordenança de civisme de Piera, les conductes de menyspreu a la dignitat de les persones i els comportaments discriminatoris esdevenen infracció MOLT GREU quan:",
      "options": [
        "Es cometen en horari nocturn.",
        "S'adrecen contra persones grans, infants o persones amb discapacitat.",
        "Es cometen a l'interior d'un equipament municipal.",
        "Les comet una persona reincident."
      ],
      "correct": 1,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-93",
      "text": "Exercir la mendicitat, directament o indirectament, amb acompanyament de menors, està tipificat a l'Ordenança de civisme de Piera com a infracció:",
      "options": [
        "Molt greu.",
        "Greu.",
        "Lleu.",
        "No tipificada."
      ],
      "correct": 0,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-94",
      "text": "En canvi, mendicar a les vies i als espais públics, sense pressió ni coacció i sense acompanyament de menors, està tipificat com a infracció:",
      "options": [
        "Molt greu.",
        "Greu.",
        "Lleu.",
        "No constitueix cap infracció de l'ordenança."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-95",
      "text": "Com defineix l'horari nocturn l'article 54.1.c de l'Ordenança de civisme de Piera?",
      "options": [
        "De les 23 a les 7 hores tots els dies de l'any.",
        "De les 22 a les 6 hores tots els dies de l'any.",
        "Entre les 22 i les 8 hores de dilluns a dijous, i entre les 24 i les 8 hores de divendres a diumenge, dies festius i vigílies de festiu.",
        "Entre les 24 i les 8 hores tots els dies de la setmana."
      ],
      "correct": 2,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-96",
      "text": "Segons l'article 50.4 de l'Ordenança de civisme de Piera, la prohibició de fumar als espais senyalitzats com a \"entorns sense fum\" s'estén:",
      "options": [
        "Només a l'interior de l'espai delimitat.",
        "Fins a un perímetre de 10 metres.",
        "Fins a un perímetre de 25 metres.",
        "Fins a un perímetre de 50 metres al voltant d'aquests espais."
      ],
      "correct": 3,
      "reference": "Ordenança de civisme i convivència ciutadana"
    },
    {
      "id": "piera-97",
      "text": "Segons l'article 122 de l'Ordenança de convivència ciutadana i civisme i de la tinença d'animals domèstics de Piera, les infraccions LLEUS en matèria de TINENÇA D'ANIMALS se sancionen amb multes de:",
      "options": [
        "50 a 750 euros.",
        "300 a 3.000 euros.",
        "Fins a 300 euros.",
        "150 a 300 euros."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-98",
      "text": "I les infraccions GREUS en matèria de TINENÇA D'ANIMALS:",
      "options": [
        "De 751 a 1.500 euros.",
        "Fins a 3.000 euros.",
        "De 1.501 a 3.000 euros.",
        "De 3.001 a 9.000 euros."
      ],
      "correct": 3,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-99",
      "text": "Les infraccions MOLT GREUS en matèria de TINENÇA D'ANIMALS se sancionen, segons la mateixa ordenança, amb multes de:",
      "options": [
        "De 3.001 a 9.000 euros.",
        "De 9.001 a 45.000 euros.",
        "De 1.501 a 3.000 euros.",
        "Fins a 60.000 euros."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-100",
      "text": "En quina norma fonamenta l'Ordenança de Piera les quanties del règim sancionador de tinença d'animals?",
      "options": [
        "A la Llei 50/1999, de 23 de desembre, sobre règim jurídic de la tinença d'animals potencialment perillosos.",
        "A la Llei 6/1993, de 15 de juliol, reguladora dels residus.",
        "Al Decret legislatiu 2/2008, de 15 d'abril, Text refós de la Llei de protecció dels animals.",
        "A la Llei orgànica 4/2015, de protecció de la seguretat ciutadana."
      ],
      "correct": 2,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-101",
      "text": "En quin termini màxim s'han d'inscriure els animals domèstics de companyia al cens municipal de Piera?",
      "options": [
        "Un mes.",
        "Tres mesos.",
        "Quinze dies.",
        "Sis mesos."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-102",
      "text": "La desaparició o pèrdua d'un animal de companyia s'ha de comunicar al cens municipal en el termini de:",
      "options": [
        "48 hores des que se'n té coneixement.",
        "24 hores des que se'n té coneixement.",
        "15 dies des que se'n té coneixement.",
        "Un mes des que se'n té coneixement."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-103",
      "text": "Un cop obtinguda la llicència municipal per a la tinença d'un gos potencialment perillós, la inscripció al Registre censal municipal s'ha de sol·licitar dins del termini de:",
      "options": [
        "15 dies.",
        "3 mesos.",
        "48 hores.",
        "30 dies."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-104",
      "text": "No recollir les deposicions dels gossos a la via pública està tipificat a l'Ordenança de Piera (art. 120.74) com a infracció:",
      "options": [
        "Lleu.",
        "Molt greu.",
        "No està tipificada, només comporta el requeriment de neteja.",
        "Greu, tret dels gossos pigall."
      ],
      "correct": 3,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-105",
      "text": "No abocar aigua per diluir les miccions dels gossos a la via pública, als espais públics i a les façanes particulars està tipificat (art. 119.46) com a infracció:",
      "options": [
        "Lleu.",
        "Greu.",
        "Molt greu.",
        "Greu si es produeix sobre una façana particular."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-106",
      "text": "Permetre que els gossos facin les seves necessitats fisiològiques als parcs infantils o als jardins d'ús dels infants està tipificat a l'article 120.67 com a infracció:",
      "options": [
        "Lleu.",
        "Molt greu.",
        "Lleu, amb l'obligació afegida de netejar la zona.",
        "Greu."
      ],
      "correct": 3,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-107",
      "text": "No inscriure un gos potencialment perillós en el registre municipal està tipificat a l'article 119.53 de l'Ordenança de Piera com a infracció:",
      "options": [
        "Greu.",
        "Lleu.",
        "Molt greu.",
        "Greu si el gos no està assegurat i molt greu si tampoc no està identificat."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-108",
      "text": "Portar un gos potencialment perillós deslligat i sense morrió a la via pública, als espais públics i a les parts comunes dels immobles col·lectius està tipificat a l'article 120.68 com a infracció:",
      "options": [
        "Lleu.",
        "Lleu la primera vegada i greu en cas de reiteració.",
        "Molt greu.",
        "Greu."
      ],
      "correct": 3,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-109",
      "text": "No contractar l'assegurança de responsabilitat civil exigida per a la tinença i conducció de gossos potencialment perillosos està tipificat a l'article 120.70 com a infracció:",
      "options": [
        "Lleu.",
        "Greu.",
        "Molt greu.",
        "No està tipificada per l'ordenança municipal."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-110",
      "text": "Quina d'aquestes races figura expressament a la llista de gossos potencialment perillosos de l'article 93.1.1 de l'Ordenança de Piera?",
      "options": [
        "Pastor alemany.",
        "Bòxer.",
        "Dòberman.",
        "Gos d'atura català."
      ],
      "correct": 2,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-111",
      "text": "A qui correspon la determinació de la potencial perillositat d'un gos, segons l'article 94 de l'Ordenança de Piera?",
      "options": [
        "A l'Ajuntament, en base a criteris objectius, d'ofici o després de notificació o denúncia, amb informe previ d'un veterinari oficial o col·legiat designat o habilitat per l'autoritat competent.",
        "Al Departament d'Interior de la Generalitat de Catalunya.",
        "Al cap de la Policia Local, mitjançant informe d'actuació.",
        "Al col·legi oficial de veterinaris, amb caràcter vinculant i exclusiu."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-112",
      "text": "Segons l'article 96 de l'Ordenança de Piera, la llicència municipal per a la tinença de gossos potencialment perillosos:",
      "options": [
        "S'ha de dur a sobre quan es condueixi l'animal per la via pública o pels espais públics.",
        "S'ha de conservar al domicili i exhibir-la només si es requereix per escrit.",
        "Només és exigible si el gos pertany a una de les races de l'annex I del RD 287/2002.",
        "L'expedeix la Generalitat de Catalunya."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-113",
      "text": "Quina és la validesa de la llicència municipal per a la tinença de gossos potencialment perillosos a Piera (art. 98.2)?",
      "options": [
        "Dos anys.",
        "Cinc anys, renovable per períodes iguals successius.",
        "Deu anys.",
        "Indefinida mentre no es revoqui."
      ],
      "correct": 1,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-114",
      "text": "L'assegurança de responsabilitat civil per danys a tercers exigida per a la tinença de gossos potencialment perillosos ha de tenir, segons l'Ordenança de Piera, una cobertura no inferior a:",
      "options": [
        "60.000 euros.",
        "100.000 euros.",
        "120.000 euros.",
        "150.000 euros."
      ],
      "correct": 2,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-115",
      "text": "Segons l'article 100.a de l'Ordenança de Piera, els gossos potencialment perillosos han d'anar lligats:",
      "options": [
        "Amb corretja extensible de fins a 5 metres.",
        "Amb cadena o corretja d'una longitud mínima de 3 metres.",
        "Amb cadena o corretja no extensible, que ha de tenir menys de 2 metres.",
        "Amb arnès homologat, sense limitació de longitud."
      ],
      "correct": 2,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-116",
      "text": "Si un gos potencialment perillós causa lesions a una persona, el seu propietari ha de comunicar l'agressió i presentar la documentació sanitària a les autoritats municipals en el termini màxim de:",
      "options": [
        "24 hores posteriors als fets.",
        "48 hores posteriors als fets.",
        "7 dies posteriors als fets.",
        "15 dies posteriors als fets."
      ],
      "correct": 0,
      "reference": "Règim de tinença d'animals i gossos potencialment perillosos"
    },
    {
      "id": "piera-117",
      "text": "Segons l'article 31.1 de l'Ordenança municipal de circulació de Piera, la velocitat màxima a les vies públiques del municipi és, amb caràcter general, de:",
      "options": [
        "30 km/h.",
        "20 km/h.",
        "40 km/h.",
        "50 km/h."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-118",
      "text": "I a les zones de circulació restringida, segons la mateixa ordenança:",
      "options": [
        "30 km/h.",
        "10 km/h.",
        "La velocitat del pas d'una persona.",
        "20 km/h."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-119",
      "text": "Segons l'article 7 de l'Ordenança municipal reguladora de l'estacionament limitat i amb control horari de Piera, els titulars de targeta de persona amb discapacitat i altres persones d'atenció preferent:",
      "options": [
        "Han d'obtenir igualment el comprovant horari, però amb tarifa reduïda.",
        "Poden estacionar sense obligació de treure comprovant de regulació horària, col·locant ben visibles les targetes o autoritzacions.",
        "Només poden estacionar en les places expressament reservades.",
        "Tenen dret a una hora addicional sobre el temps màxim general."
      ],
      "correct": 1,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-120",
      "text": "Segons l'article 31.4 de l'Ordenança municipal de circulació de Piera, les infraccions a les normes sobre velocitat que recull aquell precepte tenen la consideració de:",
      "options": [
        "Lleus.",
        "Greus.",
        "Molt greus.",
        "Lleus, greus o molt greus segons l'excés de velocitat."
      ],
      "correct": 1,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-121",
      "text": "Segons l'article 35.1 de l'Ordenança municipal de circulació de Piera, les infraccions LLEUS (grup A) se sancionen amb multa de:",
      "options": [
        "Fins a 90 euros.",
        "Fins a 100 euros.",
        "De 50 a 750 euros.",
        "Fins a 200 euros."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-122",
      "text": "Les infraccions GREUS (grup B) de l'Ordenança municipal de circulació de Piera se sancionen amb multa de:",
      "options": [
        "Fins a 200 euros.",
        "Fins a 300 euros.",
        "De 751 a 1.500 euros.",
        "Fins a 600 euros."
      ],
      "correct": 1,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-123",
      "text": "I les infraccions MOLT GREUS (grup C) de la mateixa ordenança:",
      "options": [
        "Fins a 1.000 euros.",
        "De 1.501 a 3.000 euros.",
        "Fins a 3.000 euros.",
        "Fins a 600 euros."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-124",
      "text": "La reducció per pagament que estableix l'article 35.8 de l'Ordenança municipal de circulació de Piera és:",
      "options": [
        "De fins al 50 % del preu de la multa, només per a les sancions lleus, si es fan efectives dins de les 24 hores següents a la data d'imposició de la denúncia.",
        "Del 50 % de l'import, per a qualsevol infracció, si es paga dins dels 20 dies naturals.",
        "Del 20 % de l'import mínim, si es paga dins dels 3 dies hàbils.",
        "Del 30 % de l'import, per a les infraccions lleus i greus, dins dels 10 dies."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-125",
      "text": "Segons l'article 33 de l'Ordenança municipal de circulació de Piera:",
      "options": [
        "La competència per imposar les sancions correspon a l'alcalde o alcaldessa, i la iniciació i instrucció dels procediments sancionadors correspon a la Regidoria de Seguretat Ciutadana.",
        "La competència sancionadora correspon al cap de la Policia Local.",
        "La competència sancionadora correspon al Servei Català de Trànsit en tot cas.",
        "La instrucció correspon a la Junta de Govern Local i la sanció al Ple."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-126",
      "text": "A quant es valora cada hora de treball en benefici de la comunitat a efectes de substituir una sanció de trànsit, segons l'article 35.4 de l'Ordenança municipal de circulació de Piera?",
      "options": [
        "10 euros.",
        "12 euros.",
        "15 euros.",
        "18 euros, adaptables automàticament segons l'IPC."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-127",
      "text": "La validació d'una sanció de trànsit mitjançant cursos de reciclatge d'educació viària o treballs en benefici de la comunitat (art. 35.2) requereix:",
      "options": [
        "Que es tracti de sancions fermes per infraccions lleus i greus que no comportin suspensió de la llicència, que l'infractor no sigui reincident en més de dues infraccions de trànsit durant un any i que ho sol·liciti prèviament a l'alcaldia.",
        "Que es tracti de qualsevol infracció, inclosa la molt greu, si l'infractor és menor d'edat.",
        "Que la sanció no superi els 300 euros i que l'infractor sigui resident a Piera.",
        "Que ho proposi d'ofici l'instructor de l'expedient, sense sol·licitud de l'interessat."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-128",
      "text": "Instal·lar, retirar, traslladar, ocultar o modificar senyalització viària sense autorització municipal prèvia està tipificat a l'Ordenança municipal de circulació de Piera (art. 4.2 i annex III) com a infracció:",
      "options": [
        "Lleu, amb multa de 60 euros.",
        "Molt greu, amb multa de 600 euros.",
        "Greu, amb multa de 120 euros.",
        "Greu, amb multa de 300 euros."
      ],
      "correct": 2,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-129",
      "text": "Circular per les voreres o per les parts de la via destinades exclusivament als vianants amb patins, patinets, monopatins, bicicletes o tricicles d'infants, excedint la velocitat normal del pas de l'home, fent ziga-zagues o sense respectar la preferència dels vianants, està tipificat a l'annex III de l'Ordenança municipal de circulació de Piera com a infracció:",
      "options": [
        "Greu, amb multa de 150 euros.",
        "Greu, amb multa de 120 euros.",
        "Lleu, amb multa de 60 euros.",
        "Molt greu, amb multa de 600 euros."
      ],
      "correct": 2,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-130",
      "text": "Segons l'article 25.1.q de l'Ordenança municipal de circulació de Piera, es pot retirar un vehicle per situació d'abandonament quan hagi restat estacionat en el mateix lloc de la via pública durant més de:",
      "options": [
        "48 hores.",
        "7 dies.",
        "10 dies.",
        "15 dies."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-131",
      "text": "Segons l'article 25.1.u de la mateixa ordenança, també es pot retirar un vehicle quan:",
      "options": [
        "Hagin passat 48 hores des d'una immobilització sense esmenar-ne les causes.",
        "Hagin passat 24 hores d'una immobilització sense que se n'hagin esmenat les causes.",
        "Hagin passat 15 dies des de la immobilització.",
        "L'agent ho consideri convenient, sense termini previ."
      ],
      "correct": 1,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-132",
      "text": "En matèria de zona blava, l'article 25.1.t de l'Ordenança municipal de circulació de Piera permet retirar el vehicle quan:",
      "options": [
        "S'excedeixi en 15 minuts el límit horari màxim.",
        "S'ocupi més d'una plaça d'estacionament.",
        "S'estacioni una motocicleta en una plaça de zona blava.",
        "S'estacioni sense col·locar en lloc visible el document de control horari o quan se sobrepassi en una hora el límit horari màxim de la zona."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-133",
      "text": "Segons l'article 32.3 de l'Ordenança municipal de circulació de Piera, les bicicletes que circulen per una via sense carril bici:",
      "options": [
        "Han de circular per la vorera respectant la preferència dels vianants.",
        "Han de circular pel centre del carril de la dreta.",
        "Poden triar lliurement entre la calçada i la vorera.",
        "Han de circular per la calçada, tan a prop de la vorera com sigui possible, i pel carril contigu al reservat quan hi hagi carrils reservats a altres vehicles."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-134",
      "text": "El denunciat per determinades infraccions de zona blava pot evitar la tramitació de l'expedient si, segons l'article 23.2 de l'Ordenança municipal de circulació de Piera:",
      "options": [
        "Dins del temps màxim d'una hora des de la imposició de la denúncia, obté a la màquina el tiquet especial d'anul·lació i el diposita a la bústia juntament amb la butlleta, o el lliura a l'inspector.",
        "Paga l'import de la denúncia dins de les 48 hores següents.",
        "Presenta al·legacions per escrit dins dels 20 dies següents.",
        "Acredita davant la Policia Local que és resident al municipi."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-135",
      "text": "Les despeses derivades de la retirada i el dipòsit d'un vehicle (art. 26.1 de l'Ordenança municipal de circulació de Piera):",
      "options": [
        "Van a compte del titular, que les ha d'abonar prèviament a la devolució del vehicle, sens perjudici del dret a recórrer, i no es cobren en els casos degudament justificats de sostracció del vehicle.",
        "Es liquiden sempre a posteriori mitjançant notificació al domicili.",
        "Les assumeix l'Ajuntament quan la denúncia és recorreguda.",
        "Es cobren en tot cas, fins i tot en els supòsits de sostracció del vehicle."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-136",
      "text": "Segons l'article 26.2 de l'Ordenança municipal de circulació de Piera, les taxes per estada al dipòsit municipal es comencen a meritar:",
      "options": [
        "Des del moment de l'entrada del vehicle al dipòsit.",
        "Des de les 24 hores següents a la retirada del vehicle.",
        "Un cop transcorregudes 24 hores des de la notificació del cessament de l'ordre de dipòsit.",
        "Des del setè dia d'estada al dipòsit."
      ],
      "correct": 2,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-137",
      "text": "Quan un vehicle roman al dipòsit municipal més de dos mesos des de la notificació sense ser retirat:",
      "options": [
        "S'aplica el procediment previst per als vehicles abandonats i es pot tractar com a residu sòlid urbà.",
        "Es retorna d'ofici al domicili del titular.",
        "Es subhasta immediatament sense cap tràmit previ.",
        "Es manté indefinidament al dipòsit meritant taxa d'estada."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-138",
      "text": "Si el vehicle presumptament abandonat manté la placa de matriculació o disposa de qualsevol marca identificable, l'article 27.3 de l'Ordenança municipal de circulació de Piera obliga a requerir el titular perquè el retiri del dipòsit en un termini màxim de:",
      "options": [
        "48 hores.",
        "15 dies.",
        "Un mes.",
        "Dos mesos."
      ],
      "correct": 1,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-139",
      "text": "Quin és el temps màxim d'estacionament continuat en zona blava segons l'article 23 de l'Ordenança municipal de circulació de Piera?",
      "options": [
        "30 minuts.",
        "90 minuts.",
        "120 minuts.",
        "60 minuts."
      ],
      "correct": 3,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-140",
      "text": "Que una motocicleta, un ciclomotor o una bicicleta estacionin en una plaça de zona blava:",
      "options": [
        "Està expressament tipificat com a infracció a l'article 23.1.f de l'Ordenança municipal de circulació de Piera.",
        "No és infracció, perquè aquests vehicles estan exempts del control horari.",
        "És infracció només si ocupen més d'una plaça.",
        "És infracció molt greu amb retirada immediata del vehicle."
      ],
      "correct": 0,
      "reference": "Ordenança municipal de circulació, retirada de vehicles i zona blava"
    },
    {
      "id": "piera-141",
      "text": "Segons l'article 5 de l'Ordenança reguladora de la venda ambulant no sedentària de Piera, el mercat setmanal se celebra:",
      "options": [
        "Cada dimecres.",
        "Cada dissabte, excepte si escau en un dels catorze dies festius.",
        "Cada divendres i cada diumenge.",
        "Cada dijous, i el dissabte quan el dijous sigui festiu."
      ],
      "correct": 1,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-142",
      "text": "Segons l'article 42 de l'Ordenança reguladora de la venda ambulant no sedentària de Piera, les infraccions LLEUS se sancionen amb:",
      "options": [
        "Multa de 50 a 750 euros.",
        "Multa de fins a 150 euros.",
        "Advertiment verbal o escrit, o multa de fins a 90 euros.",
        "Revocació de l'autorització."
      ],
      "correct": 2,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-143",
      "text": "Segons l'article 26 de la mateixa ordenança, l'horari d'instal·lació de les parades del mercat setmanal de Piera és:",
      "options": [
        "De 6:00 a 8:00 hores, amb desmuntatge de 14:00 a 15:00 hores.",
        "De 7:30 a 9:00 hores, amb desmuntatge de 13:00 a 14:00 hores, i sense poder accedir al recorregut del mercat abans de les 7:00 hores.",
        "De 8:00 a 10:00 hores, amb desmuntatge lliure.",
        "De 7:00 a 9:30 hores, amb desmuntatge de 14:00 a 15:30 hores."
      ],
      "correct": 1,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-144",
      "text": "Segons l'article 43 de l'Ordenança reguladora de la gestió de residus de Piera, les infraccions MOLT GREUS se sancionen amb multa de:",
      "options": [
        "Fins a 3.000 euros.",
        "De 9.001 a 45.000 euros.",
        "De 1.001 a 3.000 euros.",
        "Fins a 60.000 euros."
      ],
      "correct": 3,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-145",
      "text": "Quan la proposta de resolució d'un expedient sancionador en matèria de residus contingui una sanció que, per la seva quantia o caràcter, no sigui competència municipal, l'article 46.3 de l'Ordenança de residus de Piera estableix que:",
      "options": [
        "La sanció s'ha de reduir fins al límit de la competència municipal.",
        "L'expedient s'ha d'arxivar per manca de competència.",
        "La resolució l'ha d'adoptar igualment l'alcaldia, amb informe previ de Secretaria.",
        "L'alcalde ha d'elevar l'expedient a l'òrgan competent de la Generalitat de Catalunya."
      ],
      "correct": 3,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-146",
      "text": "Segons l'article 19 del Reglament d'ús de la deixalleria municipal de Piera, les infraccions LLEUS se sancionen amb multa de:",
      "options": [
        "150 a 300 euros.",
        "50 a 750 euros.",
        "301 a 1.000 euros.",
        "Fins a 300 euros."
      ],
      "correct": 0,
      "reference": "Venda no sedentària, residus i deixalleria"
    },
    {
      "id": "piera-147",
      "text": "Segons l'Ordenança fiscal núm. 18 vigent de l'Ajuntament de Piera, la retirada d'un automòbil turisme de fins a 3.500 kg de PMA en tarifa A és de:",
      "options": [
        "91,01 euros.",
        "177,68 euros.",
        "223,66 euros.",
        "136,15 euros."
      ],
      "correct": 1,
      "reference": "Ordenances fiscals (grua i ivtm) i planejament"
    },
    {
      "id": "piera-148",
      "text": "Segons l'Ordenança fiscal núm. 3, reguladora de l'impost sobre vehicles de tracció mecànica, la quota corresponent a un turisme de menys de 8 cavalls fiscals a Piera és de:",
      "options": [
        "25,24 euros.",
        "68,16 euros.",
        "35,34 euros.",
        "8,84 euros."
      ],
      "correct": 0,
      "reference": "Ordenances fiscals (grua i ivtm) i planejament"
    },
    {
      "id": "piera-149",
      "text": "Com es defineix la tarifa A del quadre de taxes de retirada de vehicles de l'Ordenança fiscal núm. 18 de Piera?",
      "options": [
        "La retirada aplicada a les motocicletes i els ciclomotors.",
        "La retirada aplicada als vehicles de fins a 3.500 kg de PMA.",
        "La retirada aplicada de dilluns a divendres, llevat de festius, de 8 a 20 hores.",
        "La retirada aplicada els caps de setmana i els dies festius."
      ],
      "correct": 2,
      "reference": "Ordenances fiscals (grua i ivtm) i planejament"
    },
    {
      "id": "piera-150",
      "text": "El Pla d'ordenació urbanística municipal (POUM) de Piera:",
      "options": [
        "Va ser aprovat definitivament l'any 2008 per l'Ajuntament en Ple.",
        "Va ser aprovat definitivament el 3 de maig de 2018 per la Comissió Territorial d'Urbanisme de la Catalunya Central.",
        "Es troba encara en fase d'aprovació inicial.",
        "Va ser aprovat definitivament el 2018 per la Comissió Territorial d'Urbanisme de Barcelona."
      ],
      "correct": 1,
      "reference": "Ordenances fiscals (grua i ivtm) i planejament"
    }
  ]
};

export default piera;
