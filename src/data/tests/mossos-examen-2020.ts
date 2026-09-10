// Mossos 2020 · Model 01 — examen oficial de la subprova de coneixements.
//
// Surt del PDF oficial de la convocatòria, amb la seva plantilla de
// respostes. Generat amb scripts/mossos-examens.mjs: no s'edita a mà, es
// torna a generar.
import type { TestTopic } from './types';

const examen: TestTopic = {
  slug: 'mossos-examen-2020',
  title: 'Mossos 2020 · Model 01',
  description: 'Examen oficial de Mossos d\'Esquadra de 2020, amb les respostes de la plantilla oficial.',
  icon: '📄',
  accent: 'from-slate-500 to-slate-700',
  category: 'mossos-examens',
  questions: [
    {
      id: 'mossos-examen-2020-1',
      text: 'Jacint Verdaguer (1845-1902) destaca com a:',
      options: [
        'Poeta.',
        'Pintor.',
        'Músic.',
        'Militar.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-2',
      text: 'La figura del Defensor/a del Poble pertany al grup de garanties:',
      options: [
        'Estratègiques.',
        'Normatives.',
        'Institucionals.',
        'Jurisdiccionals.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-3',
      text: 'Els municipis estan representats per:',
      options: [
        'Consellers/es.',
        'Diputats/ades.',
        'Gestors/es.',
        'Regidors/es.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-4',
      text: 'La Divisió d’Afers Interns s’encarrega de:',
      options: [
        'Les tasques de mediació i la resolució alternativa de conflictes socials en matèria de seguretat.',
        'L’elaboració de material de caire jurídic i de les relacions amb els organismes judicials en què intervinguin membres de la Policia de la Generalitat – Mossos d’Esquadra.',
        'Les relacions protocol·làries i la definició de les polítiques de comunicació.',
        'Les funcions relacionades amb les activitats presumptament il·lícites o contràries a l’ètica professional que puguin comportar sancions disciplinàries dels membres de la Policia de la Generalitat – Mossos d’Esquadra.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-5',
      text: 'Quina escala de la Policia de la Generalitat – Mossos d’Esquadra comprèn les categories de mosso/a i de caporal/a?',
      options: [
        'Bàsica.',
        'Intermèdia.',
        'Executiva.',
        'Superior.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-6',
      text: 'La ciutat més important de la Catalunya romana fou:',
      options: [
        'Barcino.',
        'Cartago Nova.',
        'Ilerda.',
        'Tarraco.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-7',
      text: 'Quins climes de Catalunya es caracteritzen per tenir més estabilitat de les temperatures?',
      options: [
        'Continentals.',
        'Interiors.',
        'D’alta muntanya.',
        'Litorals. 4',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-8',
      text: 'Les garanties específiques del procés penal són: dret a ser informat de l’acusació, dret a no declarar contra un mateix i a no confessar-se culpable i:',
      options: [
        'Dret a recórrer la decisió.',
        'Dret a una resolució motivada.',
        'Dret a la presumpció d’innocència.',
        'Dret a utilitzar mitjans de prova pertinents.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-9',
      text: 'Quina de les següents potestats s’atribueix a les Corts Generals?',
      options: [
        'Judicial.',
        'Executiva.',
        'Sancionadora.',
        'Legislativa.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-10',
      text: 'L’elecció de consellers/es del ple del consell comarcal és de caràcter:',
      options: [
        'Directe.',
        'Indirecte.',
        'Voluntari.',
        'Parlamentari.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-11',
      text: 'Les quatre comissaries generals que componen la Comissaria Superior de Coordinació Central són: la Comissaria General d’Investigació Criminal, la Comissaria General d’Informació, la Comissaria General de Recursos Operatius i la:',
      options: [
        'Comissaria General de Mobilitat.',
        'Comissaria General de Coordinació Territorial.',
        'Comissaria General Tècnica de Planificació de la Seguretat.',
        'Comissaria General de Proximitat i Atenció al Ciutadà.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-12',
      text: 'Els principis bàsics d’actuació de les forces i els cossos de seguretat s’ordenen en sis eixos fonamentals: adequació a l’ordenament jurídic, relacions amb la comunitat, tractament de les persones detingudes, dedicació professional, secret professional i:',
      options: [
        'Subordinació.',
        'Responsabilitat.',
        'Discrecionalitat.',
        'Autonomia.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-13',
      text: 'El català és una llengua:',
      options: [
        'Romànica.',
        'Celta.',
        'Germànica.',
        'Eslava.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-14',
      text: 'Catalunya està formada per tres grans unitats de relleu, que són:',
      options: [
        'Els Pirineus, la Depressió Central i el Sistema Mediterrani.',
        'Els Pirineus, les Comarques Centrals i les Terres de l’Ebre.',
        'Els Pirineus, la Serralada Transversal i les Planes Litorals.',
        'Els Pirineus, la Catalunya Central i el Camp de Tarragona. 5 No us atureu, passeu la p àgina i continueu responent',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-15',
      text: 'Les Corts Generals tenen una estructura bicameral formada pel Congrés dels Diputats i:',
      options: [
        'El Consell d’Estat.',
        'El Senat.',
        'El Consell de Ministres.',
        'El Govern.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-16',
      text: 'La Unió Europea és una organització supraestatal, basada en la unitat política, econòmica i monetària, construïda mitjançant la:',
      options: [
        'Signatura de diversos tractats internacionals entre els països que en formen part.',
        'Votació a cada estat membre de la Constitució europea.',
        'Declaració compartida dels estats europeus.',
        'Declaració del poder judicial de cada estat membre.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-17',
      text: 'El Centre d’Atenció i Gestió de Trucades d’Urgència 112 Catalunya té centres actius a Barcelona i:',
      options: [
        'Tarragona.',
        'Girona.',
        'Lleida.',
        'Reus.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-18',
      text: 'Quan es parla de la igualtat de gènere es fa referència a:',
      options: [
        'La igualtat i no discriminació per raó de sexe.',
        'La igualtat i no discriminació per raons culturals.',
        'La igualtat i no discriminació per raons econòmiques.',
        'La igualtat i no discriminació per raons polítiques.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-19',
      text: 'El corrent cultural que condiciona el segle XV és:',
      options: [
        'El romanticisme.',
        'L’obscurantisme.',
        'L’humanisme.',
        'El racionalisme.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-20',
      text: 'El model d’integració que implica a tots els membres de la societat en la creació d’una nova cultura general s’anomena:',
      options: [
        'Assimilació.',
        'Melting pot.',
        'Pluralisme cultural.',
        'Conciliació.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-21',
      text: 'El principis configuradors del poder judicial són l’exclusivitat i la:',
      options: [
        'Concurrència.',
        'Unitat jurisdiccional.',
        'Diversitat.',
        'Compatibilitat. 6',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-22',
      text: 'La coordinació de la tècnica operativa de les policies locals de Catalunya és una de les principals funcions de la:',
      options: [
        'Direcció General d’Anàlisi i Prospectiva.',
        'Direcció General de Protecció Civil.',
        'Direcció General de Prevenció, Extinció d’Incendis i Salvaments.',
        'Direcció General d’Administració de Seguretat.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-23',
      text: 'A Catalunya, la coordinació en matèria policial entre la Policia de la Generalitat – Mossos d’Esquadra i les forces i cossos de seguretat de l’Estat s’articula a través dels acords:',
      options: [
        'Del Departament d’Interior.',
        'De l’Institut de Seguretat Pública de Catalunya.',
        'De la Junta de Seguretat de Catalunya.',
        'Del Consell de Seguretat de Catalunya.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-24',
      text: 'A quina ciutat es va celebrar la Cimera Mundial del Clima (COP25) el passat mes de desembre de 2019?',
      options: [
        'Rio de Janeiro.',
        'Santiago de Xile.',
        'Madrid.',
        'París.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-25',
      text: 'L’autor de Tirant lo Blanc, considerada l’obra mestra de la narrativa medieval catalana i universal, és:',
      options: [
        'Ausiàs March.',
        'Jaume Roig.',
        'Roís de Corella.',
        'Joanot Martorell.',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-26',
      text: 'A Catalunya, quin organisme es va crear l’any 1989 amb el repte de dissenyar estratègies de transversalitat que garanteixin que totes les polítiques incorporin la perspectiva de gènere i de les dones?',
      options: [
        'El Consell General de Serveis Socials.',
        'L’Institut Català de les Dones.',
        'La Direcció General de la Inspecció de Treball.',
        'L’Institut de Paritat de Gènere.',
      ],
      correct: 1,
    },
    {
      id: 'mossos-examen-2020-27',
      text: 'Jutges/esses i magistrats/ades formen un cos únic i el seu estatut es regula a:',
      options: [
        'La Constitució espanyola.',
        'La Llei orgànica del Tribunal Constitucional.',
        'La Llei orgànica del poder judicial.',
        'L’Estatut Judicial.',
      ],
      correct: 2,
    },
    {
      id: 'mossos-examen-2020-28',
      text: 'L’any 1985 es convoca la segona promoció de la Policia de la Generalitat – Mossos d’Esquadra i per primer cop es permet l’accés al cos:',
      options: [
        'A membres de les policies locals.',
        'A membres de la Guàrdia Civil.',
        'A membres de l’exèrcit espanyol.',
        'A les dones. 7 FINAL DE LA PROVA SI HEU ACABAT ABANS DEL TEMPS CONCEDIT, REVISEU LES VOSTRES RESPOSTES',
      ],
      correct: 3,
    },
    {
      id: 'mossos-examen-2020-29',
      text: 'Aconseguir i desenvolupar, dins del marc de les lleis dels diferents països i el respecte a la Declaració Universal dels Drets Humans, l’assistència recíproca entre les autoritats de policia criminal és un objectiu general de:',
      options: [
        'La Interpol.',
        'L’Europol.',
        'L’Organització de les Nacions Unides.',
        'L’oficina SIRENE.',
      ],
      correct: 0,
    },
    {
      id: 'mossos-examen-2020-30',
      text: 'Amb quin nom es coneix el procés de negociació política per a la sortida del Regne Unit de la Unió Europea?',
      options: [
        'Exit.',
        'Impeachment.',
        'Brexit.',
        'Mainstreaming. Departament d’Interior,',
      ],
      correct: 2,
    },
  ],
};

export default examen;
