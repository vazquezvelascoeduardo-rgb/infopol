// Mossos d'Esquadra · Àmbit C · Tema C5
// El codi deontològic policial — 30 preguntes oficials.
import type { TestTopic } from './types';

const mossosC5: TestTopic = {
  slug: 'mossos-c5',
  title: 'C.5 · Codi deontològic',
  description: 'Principis ètics, codi europeu, drets, ús força, dignitat',
  icon: '🌟',
  accent: 'from-purple-500 to-purple-700',
  category: 'mossos',
  ambit: 'C',
  subtema: 5,
  questions: [
    { id: 'mossos-c5-1', text: 'Quina és la unitat territorial bàsica de la PG-ME?', options: ['La comissaria general', 'El districte policial', 'La Regió Policial (RP)', "L'àrea bàsica policial (ABP)"], correct: 3 },
    { id: 'mossos-c5-2', text: 'La Regió Policial (RP) coordina:', options: ['Diverses comissaries generals', "Els serveis del Departament d'Interior", 'Únicament les comissaries de districte', "Un conjunt d'ABP"], correct: 3 },
    { id: 'mossos-c5-3', text: "En quantes escales s'estructura jeràrquicament la PG-ME?", options: ['4 escales', '3 escales', '5 escales', '6 escales'], correct: 2 },
    { id: 'mossos-c5-4', text: 'Quin concepte implica la vigilància i control normatiu municipal?', options: ['Policia administrativa', 'Policia judicial', 'Policia governativa', 'Policia preventiva'], correct: 0 },
    { id: 'mossos-c5-5', text: 'Què són les comissaries generals?', options: ['Estructures organitzatives policials', 'Òrgans territorials operatius', "Unitats d'investigació especialitzades", 'Departaments administratius del govern'], correct: 0 },
    { id: 'mossos-c5-6', text: 'Què significa "norma reguladora"?', options: ['Norma de caràcter intern', 'Norma sancionadora', "Norma que fixa les regles d'una activitat", 'Norma que crea un dret'], correct: 2 },
    { id: 'mossos-c5-7', text: 'El model de proximitat es fonamenta en:', options: ['Operativa silenciosa', 'Especialització territorial', 'Distància professional amb la ciutadania', 'Aproximació al ciutadà'], correct: 3 },
    { id: 'mossos-c5-8', text: "L'eficàcia com a principi implica:", options: ["Rapidesa en l'actuació", "Compliment dels objectius amb eficiència", "Estalvi de recursos", 'Resultats sense considerar mitjans'], correct: 1 },
    { id: 'mossos-c5-9', text: 'El mandat constitucional fa referència a:', options: ['Els acords amb la comunitat', 'Les normes deontològiques exclusivament', "L'obligació de respectar la Constitució", 'Les ordres del comandament'], correct: 2 },
    { id: 'mossos-c5-10', text: 'El codi de deontologia policial defineix:', options: ['Els procediments operatius', 'Les sancions disciplinàries', "L'estructura jeràrquica", 'Els principis ètics professionals'], correct: 3 },
    { id: 'mossos-c5-11', text: 'La funció del codi de deontologia és:', options: ['Substituir la legislació vigent', "Guiar l'actuació ètica dels policies", 'Establir el règim disciplinari', 'Sancionar conductes incorrectes'], correct: 1 },
    { id: 'mossos-c5-12', text: "El codi europeu d'ètica es basa en:", options: ["La protecció de l'Estat de dret", "L'eficàcia operativa", 'La cooperació internacional', 'La protecció dels Estats membres'], correct: 0 },
    { id: 'mossos-c5-13', text: 'Segons el codi europeu, la policia ha de protegir:', options: ['Els interessos econòmics', 'Els drets i les llibertats fonamentals', 'Únicament els drets civils', "Exclusivament l'ordre públic"], correct: 1 },
    { id: 'mossos-c5-14', text: 'El respecte a la dignitat humana és:', options: ['Una recomanació opcional', "Un principi fonamental d'actuació policial", 'Una obligació subsidiària', 'Un objectiu a llarg termini'], correct: 1 },
    { id: 'mossos-c5-15', text: "L'actuació policial ha de tenir com a prioritat:", options: ['La protecció de la persona', "L'ordre públic", "El compliment d'objectius operatius", "La detenció dels infractors"], correct: 0 },
    { id: 'mossos-c5-16', text: 'La confiança ciutadana es guanya amb:', options: ['Professionalitat i transparència', 'Distància professional', 'Visibilitat permanent', 'Demostracions de força'], correct: 0 },
    { id: 'mossos-c5-17', text: "Els cossos policials han d'evitar:", options: ["L'arbitrarietat i l'abús de poder", 'La proximitat ciutadana', "L'ús d'uniforme en serveis especials", 'La col·laboració interpolicial'], correct: 0 },
    { id: 'mossos-c5-18', text: 'Quin principi estableix la no-discriminació?', options: ['Eficàcia de servei', 'Adequació jeràrquica', 'Igualtat de tracte', 'Proporcionalitat'], correct: 2 },
    { id: 'mossos-c5-19', text: "La transparència en l'actuació policial implica:", options: ['Retiment de comptes davant la ciutadania', 'Compartir informació amb la premsa', 'Difondre dades operatives sensibles', 'Publicar tots els atestats'], correct: 0 },
    { id: 'mossos-c5-20', text: 'La imparcialitat vol dir:', options: ['Actuar només per ordres', 'No actuar mai contra autoritats', 'No actuar en funció d\'interessos personals o polítics', 'Mantenir-se al marge dels conflictes'], correct: 2 },
    { id: 'mossos-c5-21', text: 'El principi de proporcionalitat regula:', options: ['La distribució de recursos', "L'ús de la força policial", "L'organització territorial", "L'horari laboral"], correct: 1 },
    { id: 'mossos-c5-22', text: 'El codi deontològic serveix per:', options: ['Garantir una conducta ètica professional', "Definir l'organigrama jeràrquic", 'Sancionar agents corruptes', "Establir l'estructura policial"], correct: 0 },
    { id: 'mossos-c5-23', text: "El principi d'integritat exigeix:", options: ['Disciplina jeràrquica estricta', 'Lleialtat al comandament', 'Honestedat i absència de corrupció', "Compliment d'ordres sense qüestionar"], correct: 2 },
    { id: 'mossos-c5-24', text: 'Un bon agent ha de ser:', options: ['Discret i autoritari', 'Submís i diligent', 'Obedient i silenciós', 'Formatiu, responsable i autònom'], correct: 3 },
    { id: 'mossos-c5-25', text: 'El respecte a la pluralitat implica:', options: ["L'acceptació de diversitats ètniques, culturals i socials", 'Convivència entre cossos policials', "Acceptació d'opinions polítiques", 'Tolerància política'], correct: 0 },
    { id: 'mossos-c5-26', text: 'El dret a la intimitat es protegeix:', options: ['En tota intervenció policial', 'Quan ho demana el ciutadà', 'Únicament en domicilis particulars', 'Només davant del jutge'], correct: 0 },
    { id: 'mossos-c5-27', text: 'El codi deontològic prohibeix:', options: ['Identificacions sense motiu', 'Sancions administratives', 'Maltractaments, tortures i tractes degradants', 'Detencions preventives'], correct: 2 },
    { id: 'mossos-c5-28', text: "L'ús de la força és legítim quan:", options: ['Hi ha perill general', 'És necessari i proporcionat per la situació', "És imprescindible per la detenció", 'Ho ordena el comandament'], correct: 1 },
    { id: 'mossos-c5-29', text: 'El principi de servei a la comunitat implica:', options: ['Posar-se al servei de les necessitats ciutadanes', 'Crear vincles personals amb veïns', 'Mantenir presència territorial', 'Atendre tots els ciutadans per igual'], correct: 0 },
    { id: 'mossos-c5-30', text: 'El tracte policial ha de ser:', options: ['Cordial i pròxim', 'Humà, respectuós i sense discriminació', 'Distant però professional', 'Objectiu i fred'], correct: 1 },
  ],
};

export default mossosC5;
