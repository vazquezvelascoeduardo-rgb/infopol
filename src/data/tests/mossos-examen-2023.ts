// Mossos 2023 · Model 01 — examen oficial de la subprova de coneixements.
//
// Surt del PDF oficial de la convocatòria, amb la seva plantilla de
// respostes. Generat amb scripts/mossos-examens.mjs: no s'edita a mà, es
// torna a generar.
import type { TestTopic } from './types';

const examen: TestTopic = {
  slug: 'mossos-examen-2023',
  title: 'Mossos 2023 · Model 01',
  description: 'Examen oficial de Mossos d\'Esquadra de 2023, amb les respostes de la plantilla oficial.',
  icon: '📄',
  accent: 'from-slate-500 to-slate-700',
  category: 'mossos-examens',
  questions: [
    {
      id: 'mossos-examen-2023-1',
      text: 'Què conté la part inicial de l’articulat de l’Estatut d’autonomia de Catalunya, aprovat l’any 2006?',
      options: [
        'El conjunt de motivacions que fonamenten la regulació estatutària; això és un element important per a la interpretació del text, ja que té valor normatiu.',
        'Les invocacions al passat històric, el dret inalienable de Catalunya a l’autogovern i la voluntat de construir una societat democràtica i avançada.',
        'Els principis i les definicions generals relatius als elements fonamentals de l’autogovern català, en els vessants identitari i institucional.',
        'La definició del català com a llengua pròpia de Catalunya i el reconeixement de l’oficialitat de les llengües catalana i castellana, així com el valencià i balear.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-2',
      text: 'Com s’estructura la Interpol?',
      options: [
        'Assemblea General, Comitè Executiu i Secretaria General.',
        'Comissió General, Comitè Nacional i Secretaria d’Operacions.',
        'Assemblea Executiva, Comitè General i Secretaria d’Operacions.',
        'Comissió Personal, Assemblea Local i Secretaria Executiva.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-3',
      text: 'Segons l’article 72 de l’Estatut d’autonomia de Catalunya, quins són els òrgans consultius del Govern?',
      options: [
        'El Consell de Treball, Econòmic i Social i la Sindicatura de Comptes.',
        'La Comissió Jurídica Assessora i el Consell de Treball, Econòmic i Social.',
        'La Sindicatura de Greuges i l’Administració de la Generalitat.',
        'L’Administració pública i la Comissió Jurídica Assessora.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-4',
      text: 'La sociolingüística és una disciplina que estudia:',
      options: [
        'L’ús lingüístic condicionat pel context socioeconòmic, la interrelació de l’economia amb la llengua.',
        'La capacitat de comunicació de l’ésser humà segons el desenvolupament de les llengües, la interrelació de la llengua amb la capacitat social de l’ésser humà.',
        'L’evolució de diferents llengües segons factors geogràfics, la interrelació de la llengua amb els diferents dialectes.',
        'L’ús lingüístic condicionat pel context social, la interrelació de la llengua amb la societat. 2',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-5',
      text: 'Quina és la definició de deontologia professional?',
      options: [
        'És el conjunt de coneixements que determinen les competències que té un professional en l’execució de la seva activitat.',
        'És el conjunt de principis i regles ètiques que regulen i guien una activitat professional.',
        'És el conjunt de principis que, basats en la lògica, determinen l’actuació policial.',
        'És el conjunt de valors i creences acceptades en una societat que serveixen de model de conducta.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-6',
      text: 'Com es poden classificar els reglaments segons la relació que tenen amb la llei?',
      options: [
        'Organitzatius i executius.',
        'Executius i independents.',
        'Independents i jurídics.',
        'Jurídics i organitzatius.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-7',
      text: 'Qui ha estat guardonada com a millor artista revelació en els premis Enderrock l’any 2023?',
      options: [
        'Antonia Font.',
        'Rigoberta Bandini.',
        'Mariona Escoda.',
        'Rosalia.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-8',
      text: 'Quins dialectes té el català?',
      options: [
        'Oriental i occidental.',
        'Oriental i central.',
        'Occidental i meridional.',
        'Oriental i septentrional.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-9',
      text: 'Catalunya està formada per tres grans unitats de relleu, que són:',
      options: [
        'Els Pirineus, les Gavarres i el Montsec.',
        'La Depressió Central, el Pirineu axial i Montserrat.',
        'El Sistema Mediterrani, el Massís del Montgrí i la Serralada Transversal.',
        'Els Pirineus, la Depressió Central i el Sistema Mediterrani.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-10',
      text: 'Segons l’actual Estatut d’autonomia de Catalunya, quines són competències pròpies de la Generalitat?',
      options: [
        'La creació de l’examen per obtenir el carnet de conduir.',
        'El control i la vigilància del trànsit.',
        'La matriculació de vehicles.',
        'L’expedició de llicències de circulació. 3',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-11',
      text: 'Quina de les funcions següents poden exercir les comunitats autònomes, a través dels seus cossos de policia, en col·laboració amb altres forces i cossos de seguretat de l’Estat?',
      options: [
        'Vetllar per l’acompliment de les disposicions i ordres de la comunitat.',
        'Inspeccionar activitats sota les competències de la comunitat i la denúncia de qualsevol activitat il·lícita.',
        'Prestació d’auxili en accidents i catàstrofes.',
        'Participar en funcions de policia judicial.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-12',
      text: 'Quins dos partits polítics dinàstics es van alternar en el poder polític a partir de l’aprovació d’una nova constitució l’any 1876?',
      options: [
        'El republicà i el conservador.',
        'El liberal i el socialista.',
        'El socialista i el carlista.',
        'El conservador i el liberal.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-13',
      text: 'Quins nivells hi ha dins la coordinació entre el cos de Mossos d’Esquadra i les forces i cossos de seguretat de l’Estat?',
      options: [
        'Contenciós i administratiu.',
        'Institucional i operatiu.',
        'Jurisdiccional i territorial.',
        'Penal i d’instrucció.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-14',
      text: 'Les garanties jurisdiccionals són mecanismes de protecció que actuen un cop s’ha produït la vulneració del dret i es divideixen en:',
      options: [
        'El recurs contenciós administratiu, el recurs davant el Tribunal Europeu de Drets Humans i el recurs per part dels òrgans executius.',
        'El recurs jurisdiccional civil, el recurs per part dels òrgans legislatius i el recurs d’empara constitucional.',
        'El recurs d’empara constitucional, el recurs per part dels òrgans judicials i el recurs jurisdiccional laboral.',
        'El recurs d’empara ordinari, el recurs d’empara constitucional i el recurs davant el Tribunal Europeu de Drets Humans. 4',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-15',
      text: 'Quins dels processos següents s’inclouen dins del Sistema de gestió de la qualitat de la Direcció General de la Policia?',
      options: [
        'El procés d’atenció i ajuda al menor i el procés d’atenció telefònica de recursos de denúncies a la ciutadania.',
        'El procés de revisió de condemnes i el procés de presa de declaracions ràpides.',
        'El procés de denúncies i el procés d’atenció telefònica de denúncies ràpides.',
        'El procés de la detenció i el procés d’atenció a les víctimes de violència masclista, domèstica i altres víctimes vulnerables.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-16',
      text: 'El Ministeri Fiscal exerceix les seves funcions d’acord amb els principis:',
      options: [
        'D’imparcialitat, independència i responsabilitat.',
        'D’exclusivitat, subjecció a la legalitat i unitat jurisdiccional.',
        'D’unitat d’actuació, dependència jeràrquica i subjecció a la legalitat i imparcialitat.',
        'D’autonomia administrativa i reglamentària, potestat legislativa i dependència jeràrquica.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-17',
      text: 'Segons la Llei 10/1994, d\'11 de juliol, de la Policia de la Generalitat - Mossos d\'Esquadra, a quina escala pertany la categoria de sergent/a?',
      options: [
        'Superior.',
        'Executiva.',
        'Bàsica.',
        'Intermèdia.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-18',
      text: 'Quins tipus de lleis preveu la Constitució espanyola en funció de la matèria que han de regular?',
      options: [
        'Llei orgànica, llei de pressupostos, llei de transferència o delegació, llei d’harmonització i llei marc.',
        'Llei estatal, llei orgànica, llei autonòmica, llei de pressupostos i llei de transferència o delegació.',
        'Llei de comissió, llei de lectura única, llei estatal, llei orgànica i llei de pressupostos.',
        'Llei autonòmica, llei estatal, llei de comissió, llei d’harmonització i llei de lectura única.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-19',
      text: 'A quins països es van produir dos terratrèmols de magnitud superior a 7 a l’escala Richter, el 6 de febrer de 2023?',
      options: [
        'Turquia i Bulgària.',
        'Síria i Turquia.',
        'Egipte i Israel.',
        'Síria i Israel. 5',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2023-20',
      text: 'Quin esdeveniment va conduir a la crisi política que va tenir lloc als segles XIV i XV?',
      options: [
        'La mort de Martí l’Humà sense descendència, que va propiciar que a la llarga la corona d\'Aragó perdés fins i tot la seva monarquia pròpia.',
        'El comerç pel Mediterrani va començar a ser pertorbat per la presència dels turcs i per la competència amb altres ciutats mercantils, com ara Gènova o Venècia.',
        'S’havia arribat a un sostre productiu que no podia alimentar una població que havia crescut en els últims segles, per la qual cosa es van succeir les revoltes.',
        'Els enfrontaments entre la Busca i la Biga, grups socials urbans amb interessos econòmics contraposats i que volien controlar el poder de Barcelona.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-21',
      text: 'Els valors de la Policia de la Generalitat - Mossos d’Esquadra estan basats en:',
      options: [
        'La solidaritat, el compromís, la proximitat, el servei i l’estabilitat.',
        'El compromís, la proximitat, l’ètica, la seguretat i l’eficiència.',
        'La seguretat, el servei, la proximitat, el benestar i la solidaritat.',
        'La proximitat, el compromís, la integritat, la voluntat de servei i l’eficàcia.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-22',
      text: 'La signatura electrònica permet que un emissor pugui enviar missatges a un receptor complint les tres propietats següents:',
      options: [
        'Automatització, interacció i no retorn.',
        'Austeritat, interès i no reemborsament.',
        'Emmagatzemable, intel·ligibilitat i no repetició.',
        'Autenticitat, integritat i no repudi.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-23',
      text: 'Quina va ser una de les principals fites de la Mancomunitat de Catalunya?',
      options: [
        'Dedicar esforços per al desenvolupament de més vies de tren, potenciar l’agricultura i la formació de treballadors no qualificats.',
        'Potenciar la cultura i la indústria catalana, fet que va provocar un creixement econòmic espectacular, tot obtenint un augment dels beneficis empresarials i una pujada de sous dels treballadors/es.',
        'Invertir en la modernització de Catalunya, mitjançant el desenvolupament de la xarxa de carreteres, l’impuls a la indústria i a l’agricultura i la formació tècnica de treballadors/es qualificats/des.',
        'Potenciar i normalitzar la llengua espanyola i disminuir l’ús de la llengua catalana, però potenciar-ne la seva cultura. 6',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-24',
      text: 'Quina és la definició de “plenitud” com una de les característiques de l’ordenament jurídic espanyol?',
      options: [
        'L’ordenament jurídic ha de ser complet; sempre hi ha d’haver una norma aplicable per a cada supòsit de fet.',
        'L’ordenament jurídic situa cadascun dels seus elements en una determinada posició dins de l’estructura, de forma que fa possible les transformacions internes mentre es manté la unitat estructural.',
        'L’ordenament jurídic ha de preveure els mecanismes necessaris per modificar normes i permetre adaptar-ne el contingut.',
        'L’ordenament jurídic té en compte l’Estat de les autonomies com a organització territorial de l’Estat espanyol i la seva presència a la Unió Europea.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-25',
      text: 'Quin moviment cultural arreu d’Europa reivindica el retorn a l’esplendor de l’edat mitjana?',
      options: [
        'El Renaixement.',
        'La Il·lustració.',
        'El Romanticisme.',
        'El Classicisme.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-26',
      text: 'Qui ha guanyat la Pilota d’Or 2022?',
      options: [
        'Laia Sanz.',
        'Paula Badosa.',
        'Alexia Putellas.',
        'Aitana Bonmatí.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-27',
      text: 'Quines són les competències del Parlament Europeu?',
      options: [
        'D’iniciativa, de control i d’execució.',
        'De control, d’emissió de dictàmens i d’execució.',
        'D’execució, legislatives i de coordinació.',
        'De control polític, legislatives i pressupostàries.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2023-28',
      text: 'Dins del dret comunitari derivat de la Unió Europea, quina és la definició de les directives?',
      options: [
        'Són actes obligatoris que miren d’orientar i promoure un determinat comportament, sense caràcter vinculant per als seus destinataris.',
        'Són actes que tenen abast general, obligatoris i directament aplicables a cada estat membre.',
        'Són actes obligatoris que vinculen jurídicament el seu destinatari, però no tenen eficàcia jurídica immediata.',
        'Són actes obligatoris que expressen un judici o valoració respecte a una determinada actuació d’un o més estats membres. FI DE LA PROVA. 7',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2023-29',
      text: 'Quin va ser l’objectiu de l’acord Schengen signat a Luxemburg l’any 1985?',
      options: [
        'La creació d’una zona de lliure circulació, que implicava la supressió dels controls, tant de persones com de vehicles i mercaderies.',
        'La instauració d’un mercat comú per reactivar l’economia dels països membres a través de la integració de les seves respectives economies.',
        'La generalització del procediment de codecisió com a procediment legislatiu ordinari.',
        'L’establiment d’un nou sistema de cooperació política, econòmica i monetària.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2023-30',
      text: 'Quins són els factors que fan possible la formació de la llengua catalana?',
      options: [
        'La seguretat, el servei, la proximitat, el benestar i la solidaritat.',
        'La solidaritat, el compromís, la proximitat, el servei i l’estabilitat.',
        'La proximitat, el compromís, la integritat, la voluntat de servei i l’eficàcia.',
        'El compromís, la proximitat, l’ètica, la seguretat i l’eficiència.',
      ],
      correct: 1,
    },
  ],
};

export default examen;
