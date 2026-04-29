// Test Codi d'etica de la Policia de Catalunya — Acord GOV/25/2015,
// de 24 de febrer.
// 10 preguntes nivell alt: principis basics, valors, Comite d'Etica
// (composicio 5+3+2), ambit d'aplicacio.
import type { TestTopic } from './types';

const codiEtica: TestTopic = {
  slug: 'codi-etica-policia',
  title: "Codi d'ètica de la Policia de Catalunya (GOV/25/2015)",
  description: 'principis, valors, Comitè d\'Ètica',
  icon: '⚜️',
  accent: 'from-indigo-500 to-violet-700',
  questions: [
    {
      id: 'codi-etica-1',
      text: "L'Acord GOV/25/2015, de 24 de febrer, regula:",
      options: [
        "El Codi d'ètica de la Policia de Catalunya.",
        "L'estructura del cos de Mossos d'Esquadra de Catalunya.",
        'El règim disciplinari aplicable a les policies locals catalanes.',
        "L'organització territorial dels serveis de seguretat pública.",
      ],
      correct: 0,
    },
    {
      id: 'codi-etica-2',
      text: "El Comitè d'Ètica de la Policia de Catalunya està format per:",
      options: [
        "8 membres, distribuïts entre les diferents administracions implicades.",
        "12 membres, designats per la Comissió de Policia de Catalunya en plenari.",
        "10 membres: 5 acadèmics, 3 dels Mossos i 2 de policies locals.",
        "15 membres, distribuïts paritàriament entre les administracions catalanes.",
      ],
      correct: 2,
    },
    {
      id: 'codi-etica-3',
      text: "El Comitè d'Ètica de la Policia de Catalunya s'adscriu a:",
      options: [
        "L'Institut de Seguretat Pública de Catalunya (ISPC).",
        'El Parlament de Catalunya, com a òrgan de control extern.',
        "La Sindicatura de Greuges, com a defensa de drets fonamentals.",
        "El departament competent en matèria de seguretat pública.",
      ],
      correct: 3,
    },
    {
      id: 'codi-etica-4',
      text: "El principi d'\"exemplaritat\", segons el codi d'ètica, implica:",
      options: [
        "Limitar l'actuació al torn estricte de servei i mai fora d'aquest.",
        "Actuar de manera justa, rigorosa i íntegra, sense avantatges indeguts.",
        "Sotmetre's a l'autoritat jeràrquica sense control de legalitat.",
        "Mantenir secret professional sobre tota la informació rebuda.",
      ],
      correct: 1,
    },
    {
      id: 'codi-etica-5',
      text: "La deontologia, segons el codi d'ètica policial, és:",
      options: [
        "El conjunt de deures professionals que han d'inspirar la totalitat de la conducta del professional.",
        "Un conjunt de normes administratives sancionadores per al cos policial actuant.",
        'El règim disciplinari aplicable als membres dels cossos policials catalans.',
        "La regulació jurídica del comportament privat dels agents policials en exercici.",
      ],
      correct: 0,
    },
    {
      id: 'codi-etica-6',
      text: "Els valors fonamentals que recull el codi d'ètica de la Policia de Catalunya inclouen:",
      options: [
        "Únicament la legalitat i el respecte als drets fonamentals de les persones.",
        "Únicament la professionalitat i la dedicació al servei en exercici del càrrec.",
        "Integritat, professionalitat, respecte, exemplaritat i responsabilitat.",
        "Únicament la integritat i la lleialtat institucional cap al cos i el càrrec.",
      ],
      correct: 2,
    },
    {
      id: 'codi-etica-7',
      text: "Quina és una funció pròpia del Comitè d'Ètica de la Policia de Catalunya?",
      options: [
        "Imposar sancions disciplinàries als membres del cos de Mossos.",
        "Vetllar per l'aplicació del codi d'ètica i emetre informes i recomanacions.",
        'Aprovar el règim disciplinari aplicable a les policies locals catalanes.',
        "Coordinar les actuacions operatives entre els cossos policials catalans.",
      ],
      correct: 1,
    },
    {
      id: 'codi-etica-8',
      text: "El codi d'ètica de la Policia de Catalunya és aplicable a:",
      options: [
        "Únicament als membres del cos de Mossos d'Esquadra en exercici.",
        "Únicament als membres dels cossos de policia local catalans.",
        "Tots els cossos de policia de Catalunya, inclosos Mossos i policies locals.",
        "Únicament als comandaments superiors dels cossos policials catalans.",
      ],
      correct: 2,
    },
    {
      id: 'codi-etica-9',
      text: "Els membres del Comitè d'Ètica acadèmics són:",
      options: [
        "3 membres designats per la Comissió de Policia de Catalunya en sessió plenària.",
        "2 membres designats pel Parlament de Catalunya per majoria absoluta dels seus membres.",
        "10 membres designats pel departament competent en matèria de seguretat pública.",
        "5 membres, persones de prestigi en l'àmbit ètic, jurídic o policial.",
      ],
      correct: 3,
    },
    {
      id: 'codi-etica-10',
      text: "El principi d'\"integritat\", segons el codi d'ètica policial, implica:",
      options: [
        "Actuar amb honestedat i rectitud, refusant qualsevol benefici indegut.",
        "Limitar l'ús de la força als supòsits estrictament previstos per la llei.",
        "Mantenir reserva sobre les informacions conegudes per raó del càrrec.",
        "Sotmetre's a l'autoritat jeràrquica del cap del cos en tot moment.",
      ],
      correct: 0,
    },
  ],
};

export default codiEtica;
