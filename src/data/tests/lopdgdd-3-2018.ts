// LO 3/2018, de 5 de desembre, de protecció de dades personals i
// garantia dels drets digitals. Consentiment, deure de confidencialitat,
// videovigilància i drets de l'interessat.
import type { TestTopic } from './types';

const lopdgdd: TestTopic = {
  slug: 'lopdgdd-3-2018',
  title: "Protecció de dades · LO 3/2018",
  description: "LOPDGDD: consentiment del menor, deure de confidencialitat, videovigilància i drets digitals.",
  icon: '🔐',
  accent: 'from-teal-500 to-emerald-700',
  category: 'temari',
  questions: [
    {
      id: 'lopd-1',
      text: "El tractament de dades personals d'un menor d'edat només es pot fonamentar en el seu consentiment quan sigui més gran de:",
      options: [
        "12 anys.",
        "13 anys.",
        "14 anys.",
        "16 anys.",
      ],
      correct: 2,
    },
    {
      id: 'lopd-2',
      text: "El deure de confidencialitat que estableix l'article 5 de la LOPDGDD:",
      options: [
        "Afecta els responsables, els encarregats i totes les persones que intervinguin en qualsevol fase del tractament, i es manté encara que hagi finalitzat la relació amb el responsable o encarregat.",
        "Només afecta el responsable del tractament i s'extingeix en acabar la relació laboral.",
        "Substitueix els deures de secret professional previstos a la normativa aplicable.",
        "Només s'aplica quan es tracten categories especials de dades.",
      ],
      correct: 0,
    },
    {
      id: 'lopd-3',
      text: "En els tractaments amb finalitats de videovigilància, les imatges:",
      options: [
        "S'han de suprimir en el termini màxim de 15 dies des de la seva captació.",
        "S'han de conservar obligatòriament durant un any.",
        "S'han de suprimir en el termini màxim d'un mes, sense cap excepció.",
        "S'han de suprimir en el termini màxim d'un mes des de la captació, llevat que hagin de ser conservades per acreditar la comissió d'actes que atemptin contra la integritat de persones, béns o instal·lacions, cas en què s'han de posar a disposició de l'autoritat competent en un màxim de 72 hores des que es va tenir coneixement de l'existència de la gravació.",
      ],
      correct: 3,
    },
    {
      id: 'lopd-4',
      text: "Respecte de la captació d'imatges de la via pública mitjançant càmeres o videocàmeres:",
      options: [
        "Està prohibida en tot cas per a les persones físiques o jurídiques privades.",
        "Només se'n poden captar imatges en la mesura que resulti imprescindible per preservar la seguretat de les persones i els béns, i mai es pot captar l'interior d'un domicili privat.",
        "És lliure sempre que s'informi mitjançant un cartell.",
        "Requereix autorització prèvia i expressa de l'Agència Espanyola de Protecció de Dades.",
      ],
      correct: 1,
    },
    {
      id: 'lopd-5',
      text: "El tractament d'imatges i sons obtinguts amb càmeres i videocàmeres per les Forces i Cossos de Seguretat, quan tingui finalitats de prevenció, investigació, detecció o enjudiciament d'infraccions penals:",
      options: [
        "Es regeix íntegrament pel Reglament (UE) 2016/679.",
        "Es regeix exclusivament per la LO 3/2018.",
        "Es regeix per la legislació de transposició de la Directiva (UE) 2016/680.",
        "Està exclòs de tota normativa de protecció de dades.",
      ],
      correct: 2,
    },
    {
      id: 'lopd-6',
      text: "El deure d'informació en els tractaments amb finalitats de videovigilància s'entén complert:",
      options: [
        "Mitjançant la col·locació d'un dispositiu informatiu en un lloc prou visible que identifiqui, com a mínim, l'existència del tractament, la identitat del responsable i la possibilitat d'exercir els drets previstos als articles 15 a 22 del RGPD.",
        "Mitjançant la comunicació individual i per escrit a cada persona afectada.",
        "Mitjançant la inscripció del sistema en un registre públic de càmeres.",
        "Mitjançant la publicació d'un anunci al butlletí oficial corresponent.",
      ],
      correct: 0,
    },
    {
      id: 'lopd-7',
      text: "D'acord amb els articles 72 a 74 de la LOPDGDD, les infraccions prescriuen:",
      options: [
        "Molt greus als 5 anys, greus als 3 anys i lleus als 2 anys.",
        "Molt greus als 3 anys, greus als 2 anys i lleus a l'any.",
        "Molt greus als 3 anys, greus a l'any i lleus als 6 mesos.",
        "Totes al cap de 3 anys, amb independència de la seva qualificació.",
      ],
      correct: 1,
    },
    {
      id: 'lopd-8',
      text: "Segons l'article 78 de la LOPDGDD, la prescripció de les sancions es determina:",
      options: [
        "Segons la qualificació de la infracció: 3, 2 i 1 any respectivament.",
        "Sempre en el termini de 4 anys des de la seva imposició.",
        "En el termini d'un any per a totes les sancions.",
        "En funció de l'import: les iguals o inferiors a 40.000 € prescriuen a l'any; les compreses entre 40.001 i 300.000 € als dos anys; les superiors a 300.000 € als tres anys.",
      ],
      correct: 3,
    },
    {
      id: 'lopd-9',
      text: "Respecte de la instal·lació de sistemes de videovigilància i de gravació de sons al lloc de treball:",
      options: [
        "És lliure en tot l'espai del centre de treball si s'informa prèviament la plantilla.",
        "Requereix sempre el consentiment individual de cada treballador.",
        "No s'admet en cap cas la instal·lació de sistemes de gravació de sons ni de videovigilància en llocs destinats al descans o l'esbarjo dels treballadors o empleats públics.",
        "Només es permet la gravació de so, mai la d'imatge.",
      ],
      correct: 2,
    },
    {
      id: 'lopd-10',
      text: "El dret a la desconnexió digital a l'àmbit laboral:",
      options: [
        "Correspon únicament als treballadors del sector privat.",
        "Correspon als treballadors i als empleats públics, i les seves modalitats d'exercici se subjecten al que estableixi la negociació col·lectiva o, si no n'hi ha, al que s'acordi entre l'empresa i els representants dels treballadors.",
        "Només s'aplica al personal amb funcions directives.",
        "Exigeix autorització prèvia de l'Agència Espanyola de Protecció de Dades.",
      ],
      correct: 1,
    },
  ],
};

export default lopdgdd;
