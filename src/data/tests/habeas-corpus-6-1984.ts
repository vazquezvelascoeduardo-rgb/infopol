// LO 6/1984, de 24 de maig, reguladora del procediment d'habeas corpus.
// Competència judicial, legitimació, terminis i el deure de l'agent actuant.
import type { TestTopic } from './types';

const habeasCorpus: TestTopic = {
  slug: 'habeas-corpus-6-1984',
  title: "Habeas corpus · LO 6/1984",
  description: "Procediment d'habeas corpus: supòsits de detenció il·legal, qui el pot demanar, jutge competent i terminis.",
  icon: '⚖️',
  accent: 'from-violet-500 to-purple-700',
  category: 'temari',
  questions: [
    {
      id: 'habeas-1',
      text: "Mitjançant el procediment d'Habeas Corpus es podrà obtenir:",
      options: [
        "La nul·litat de les actuacions policials practicades durant la detenció.",
        "La immediata posada a disposició de l'autoritat judicial competent de qualsevol persona detinguda il·legalment.",
        "La posada en llibertat immediata i automàtica de qualsevol persona detinguda.",
        "La indemnització pels danys derivats d'una detenció il·legal.",
      ],
      correct: 1,
    },
    {
      id: 'habeas-2',
      text: "Quin dels següents supòsits NO es considera, a l'efecte d'aquesta llei, una persona il·legalment detinguda?",
      options: [
        "La detinguda per una autoritat, agent, funcionari públic o particular sense que concorrin els supòsits legals o sense haver-se complert les formalitats i requisits exigits per les lleis.",
        "La que estigui il·lícitament internada en qualsevol establiment o lloc.",
        "La detinguda per un termini superior al assenyalat a les lleis, si transcorregut aquest no és posada en llibertat o lliurada al jutge més pròxim al lloc de la detenció.",
        "La detinguda en virtut d'una ordre de detenció dictada pel jutge competent i amb compliment de totes les garanties legals.",
      ],
      correct: 3,
    },
    {
      id: 'habeas-3',
      text: "És competent per conèixer de la sol·licitud d'Habeas Corpus:",
      options: [
        "El jutge d'instrucció del lloc on es trobi la persona privada de llibertat; si no consta, el del lloc on s'hagi produït la detenció i, en defecte dels anteriors, el del lloc on s'hagin tingut les últimes notícies sobre el parador del detingut.",
        "El jutge penal del lloc on es trobi la persona privada de llibertat.",
        "El jutge d'instrucció del domicili de la persona detinguda, en tot cas.",
        "El jutge degà del partit judicial on radiqui la dependència policial.",
      ],
      correct: 0,
    },
    {
      id: 'habeas-4',
      text: "En l'àmbit de la jurisdicció militar, la sol·licitud d'Habeas Corpus l'ha de conèixer:",
      options: [
        "El jutge d'instrucció ordinari del lloc de la detenció.",
        "El Tribunal Militar Territorial corresponent.",
        "El jutge togat militar d'instrucció constituït a la capçalera de la circumscripció jurisdiccional on es va efectuar la detenció.",
        "La Sala Militar del Tribunal Suprem.",
      ],
      correct: 2,
    },
    {
      id: 'habeas-5',
      text: "Si la detenció obeeix a l'aplicació de la llei orgànica que desenvolupa els supòsits previstos a l'article 55.2 de la Constitució, el procediment s'ha de seguir davant:",
      options: [
        "El jutge d'instrucció del lloc de la detenció.",
        "L'Audiència Nacional en ple.",
        "El jutge de guàrdia del lloc on es va practicar la detenció.",
        "El jutge central d'instrucció corresponent.",
      ],
      correct: 3,
    },
    {
      id: 'habeas-6',
      text: "Qui NO està legitimat per instar el procediment d'Habeas Corpus?",
      options: [
        "El Ministeri Fiscal i el Defensor del Poble.",
        "Qualsevol ciutadà o testimoni que tingui coneixement de la detenció.",
        "L'advocat defensor de la persona privada de llibertat.",
        "El cònjuge o persona unida per anàloga relació d'afectivitat, els descendents, ascendents i germans del privat de llibertat.",
      ],
      correct: 1,
    },
    {
      id: 'habeas-7',
      text: "Respecte de la forma d'iniciar el procediment:",
      options: [
        "S'inicia, llevat que s'incoï d'ofici, per mitjà d'escrit o compareixença, sense que sigui preceptiva la intervenció d'advocat ni de procurador.",
        "Requereix necessàriament escrit signat per advocat i procurador.",
        "Només es pot iniciar per compareixença personal davant el jutjat de guàrdia.",
        "Exigeix demanda formal amb proposició de prova documental.",
      ],
      correct: 0,
    },
    {
      id: 'habeas-8',
      text: "L'autoritat governativa, l'agent d'aquesta o el funcionari públic sota la custòdia del qual es trobi la persona privada de llibertat:",
      options: [
        "Poden valorar la procedència de la sol·licitud i arxivar-la si la consideren infundada.",
        "Han de traslladar la sol·licitud al Ministeri Fiscal en el termini de 24 hores.",
        "Estan obligats a posar immediatament en coneixement del jutge competent la sol·licitud d'Habeas Corpus, i si incompleixen aquesta obligació seran advertits pel jutge, sense perjudici de les responsabilitats penals i disciplinàries en què puguin incórrer.",
        "Només han de tramitar-la si el detingut la formula per escrit i amb assistència lletrada.",
      ],
      correct: 2,
    },
    {
      id: 'habeas-9',
      text: "El termini per practicar totes les actuacions i dictar la resolució que escaigui és de:",
      options: [
        "12 hores des de la presentació de la sol·licitud.",
        "24 hores comptades des que sigui dictada la interlocutòria (auto) d'incoació.",
        "48 hores des de la presentació de la sol·licitud.",
        "72 hores des de la detenció.",
      ],
      correct: 1,
    },
    {
      id: 'habeas-10',
      text: "Contra la interlocutòria (auto) que acorda la incoació del procediment o que denega la sol·licitud per improcedent:",
      options: [
        "Es pot interposar recurs de reforma en el termini de 3 dies.",
        "Es pot interposar recurs d'apel·lació davant l'Audiència Provincial.",
        "Es pot interposar recurs d'empara directe davant el Tribunal Constitucional.",
        "No hi cap cap recurs; la resolució es notifica en tot cas al Ministeri Fiscal.",
      ],
      correct: 3,
    },
  ],
};

export default habeasCorpus;
