// Academy data — Mossos d'Esquadra exam content (official 17-theme syllabus)

export const TEMES = [
  { id: 1, title: 'La Constitució Espanyola de 1978', cat: 'leyes', icon: 'scale', lessons: 14, done: 14, status: 'done' },
  { id: 2, title: 'L\'Estatut d\'Autonomia de Catalunya', cat: 'leyes', icon: 'book', lessons: 10, done: 10, status: 'done' },
  { id: 3, title: 'Drets fonamentals i llibertats públiques', cat: 'operativa', icon: 'shield', lessons: 12, done: 7, status: 'active' },
  { id: 4, title: 'L\'organització policial de Catalunya', cat: 'academia', icon: 'briefcase', lessons: 8, done: 0, status: 'locked' },
  { id: 5, title: 'El Codi Penal (delictes rellevants)', cat: 'transito', icon: 'hash', lessons: 18, done: 0, status: 'locked' },
  { id: 6, title: 'La Llei d\'Enjudiciament Criminal', cat: 'leyes', icon: 'book', lessons: 12, done: 0, status: 'locked' },
  { id: 7, title: 'La Llei de Seguretat Ciutadana', cat: 'operativa', icon: 'shield', lessons: 8, done: 0, status: 'locked' },
  { id: 8, title: 'La Llei de Seguretat Vial i trànsit', cat: 'transito', icon: 'car', lessons: 14, done: 0, status: 'locked' },
  { id: 9, title: 'Dret administratiu i procediment', cat: 'leyes', icon: 'pen', lessons: 10, done: 0, status: 'locked' },
  { id: 10, title: 'Dret penal general', cat: 'alcohol', icon: 'lock', lessons: 12, done: 0, status: 'locked' },
  { id: 11, title: 'La Llei Orgànica de Forces i Cossos', cat: 'operativa', icon: 'badge', lessons: 6, done: 0, status: 'locked' },
  { id: 12, title: 'Relacions internacionals i cooperació policial', cat: 'academia', icon: 'map', lessons: 8, done: 0, status: 'locked' },
  { id: 13, title: 'Psicologia i sociologia aplicades', cat: 'psico', icon: 'spark', lessons: 10, done: 0, status: 'locked' },
  { id: 14, title: 'Informàtica i tecnologies policials', cat: 'tests', icon: 'bolt', lessons: 6, done: 0, status: 'locked' },
  { id: 15, title: 'Llengua catalana (nivell B2)', cat: 'academia', icon: 'book', lessons: 8, done: 0, status: 'locked' },
  { id: 16, title: 'Cultura general i actualitat', cat: 'psico', icon: 'star', lessons: 8, done: 0, status: 'locked' },
  { id: 17, title: 'Deontologia policial i ètica', cat: 'atajos', icon: 'heart', lessons: 6, done: 0, status: 'locked' },
];

export const TEST_QUESTIONS = [
  {
    id: 'q001',
    tema: 3,
    temaTitle: 'Tema 3 · Drets fonamentals',
    question: 'Quin article de la Constitució Espanyola estableix que tothom té dret a la vida i a la integritat física i moral?',
    options: ['Article 14 CE', 'Article 15 CE', 'Article 16 CE', 'Article 17 CE'],
    correct: 1,
    explanation: 'L\'art. 15 CE protegeix el dret a la vida i la integritat física i moral, prohibint la tortura i les penes inhumanes i degradants.',
    xp: 24,
  },
  {
    id: 'q002',
    tema: 1,
    temaTitle: 'Tema 1 · Constitució',
    question: 'Quants articles té la Constitució Espanyola de 1978?',
    options: ['159 articles', '169 articles', '176 articles', '152 articles'],
    correct: 1,
    explanation: 'La Constitució Espanyola consta de 169 articles, distribuïts en un Títol Preliminar i nou Títols numerats.',
    xp: 18,
  },
  {
    id: 'q003',
    tema: 1,
    temaTitle: 'Tema 1 · Constitució',
    question: 'Quin article de la CE estableix l\'Estat espanyol com a Estat social i democràtic de Dret?',
    options: ['Art. 1.1 CE', 'Art. 2 CE', 'Art. 3 CE', 'Art. 9.3 CE'],
    correct: 0,
    explanation: 'L\'article 1.1 CE proclama que "España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político."',
    xp: 20,
  },
  {
    id: 'q004',
    tema: 3,
    temaTitle: 'Tema 3 · Drets fonamentals',
    question: 'El dret a la tutela judicial efectiva es recull a quin article de la CE?',
    options: ['Art. 23 CE', 'Art. 24 CE', 'Art. 25 CE', 'Art. 17 CE'],
    correct: 1,
    explanation: 'L\'article 24 CE reconeix el dret fonamental a la tutela judicial efectiva, que inclou el dret a un jutge predeterminat per la llei i a no patir indefensió.',
    xp: 22,
  },
  {
    id: 'q005',
    tema: 4,
    temaTitle: 'Tema 4 · Organització policial de Catalunya',
    question: 'Quina és la norma legal específica que regula el cos de la Policia de la Generalitat - Mossos d\'Esquadra?',
    options: ['LO 2/1986 de Forces i Cossos de Seguretat', 'Llei 10/1994 de la Policia de la Generalitat - Mossos d\'Esquadra', 'Llei 4/2003 d\'ordenació del sistema de seguretat pública', 'Estatut d\'Autonomia de Catalunya'],
    correct: 1,
    explanation: 'La Llei 10/1994, d\'11 de juliol. Matís, perquè aquí és on es falla: la LO 2/1986 és la norma estatal marc de tots els cossos; la Llei 4/2003 ordena el sistema de seguretat pública de Catalunya en conjunt (no el cos); i l\'Estatut atribueix la competència, però no regula el cos.',
    xp: 26,
  },
  {
    id: 'q006',
    tema: 3,
    temaTitle: 'Tema 3 · Drets fonamentals',
    question: 'L\'article 18 de la CE protegeix quin dret?',
    options: ['Llibertat ideològica i religiosa', 'Dret a l\'honor, intimitat i pròpia imatge', 'Llibertat d\'expressió i d\'informació', 'Dret de reunió i manifestació'],
    correct: 1,
    explanation: 'L\'art. 18 CE garanteix el dret a l\'honor, a la intimitat personal i familiar i a la pròpia imatge. També reconeix la inviolabilitat del domicili i el secret de les comunicacions.',
    xp: 20,
  },
  {
    id: 'q007',
    tema: 5,
    temaTitle: 'Tema 5 · Codi Penal',
    question: 'Quin article del Codi Penal tipifica la pèrdua o inutilitat d\'un òrgan o membre PRINCIPAL, o una greu deformitat?',
    options: ['Art. 147 CP', 'Art. 148 CP', 'Art. 149 CP', 'Art. 150 CP'],
    correct: 2,
    explanation: 'L\'art. 149 CP castiga amb presó de 6 a 12 anys la pèrdua o inutilitat d\'un òrgan o membre principal o d\'un sentit, la impotència, l\'esterilitat, una greu deformitat o una greu malaltia somàtica o psíquica. L\'art. 150 és el supòsit menor: òrgan o membre NO principal, o deformitat (presó de 3 a 6 anys).',
    xp: 28,
  },
  {
    id: 'q008',
    tema: 6,
    temaTitle: 'Tema 6 · LECrim',
    question: 'Com a regla general, i fora dels supòsits especials de l\'art. 520 bis LECrim, quant pot durar com a màxim una detenció policial sense posada a disposició judicial?',
    options: ['24 hores', '48 hores', '72 hores', '96 hores'],
    correct: 2,
    explanation: 'Art. 17.2 CE i art. 520 LECrim: 72 hores com a màxim, i sempre pel temps estrictament necessari. Matís imprescindible: en els delictes de l\'art. 384 bis (bandes armades o terrorisme) l\'art. 520 bis LECrim permet una pròrroga de fins a 48 hores més, prèvia autorització judicial. Per això la pregunta acota «com a regla general».',
    xp: 30,
  },
];

export const FLASHCARDS = [
  {
    id: 'fc001',
    tema: 'Tema 5 · CP',
    question: 'Quina és la pena per al delicte d\'omissió del deure de socors (art. 195 CP)?',
    answer: 'Art. 195.1: multa de 3 a 12 mesos. Art. 195.3: si la víctima ho és per un accident ocasionat fortuïtament per qui va ometre l\'auxili, presó de 6 a 18 mesos; si l\'accident es deu a imprudència, presó de 6 mesos a 4 anys.',
    cat: 'leyes',
  },
  {
    id: 'fc002',
    tema: 'Tema 1 · CE',
    question: 'Quins són els valors superiors de l\'ordenament jurídic espanyol (art. 1.1 CE)?',
    answer: 'La llibertat, la justícia, la igualtat i el pluralisme polític.',
    cat: 'leyes',
  },
  {
    id: 'fc003',
    tema: 'Tema 3 · Drets fonamentals',
    question: 'Quins drets reconeix l\'art. 17 CE?',
    answer: 'El dret a la llibertat i a la seguretat personal. Ningú pot ser privat de llibertat, tret dels casos i en la forma prevista a la llei.',
    cat: 'operativa',
  },
  {
    id: 'fc004',
    tema: 'Tema 5 · CP',
    question: 'Quines conductes integren el delicte de l\'art. 379.2 CP?',
    answer: 'Conduir un vehicle de motor o ciclomotor sota la influència de drogues tòxiques, estupefaents, substàncies psicotròpiques O de begudes alcohòliques. I, «en tot cas», amb una taxa d\'alcohol en aire espirat superior a 0,60 mg/l o en sang superior a 1,2 g/l. Dos matisos: l\'article no és només d\'alcohol, i per sota de 0,60 encara hi pot haver delicte si es prova la influència.',
    cat: 'alcohol',
  },
  {
    id: 'fc005',
    tema: 'Tema 6 · LECrim',
    question: 'Quins drets té el detingut en el moment de la detenció (art. 520 LECrim)?',
    answer: 'Entre d\'altres (l\'art. 520.2 LECrim no és una llista tancada): no declarar; no declarar-se culpable; designar advocat i entrevistar-s\'hi reservadament; accedir als elements de les actuacions essencials per impugnar la detenció; ser assistit per intèrpret; comunicar la detenció a un familiar; ser reconegut pel metge forense.',
    cat: 'operativa',
  },
  {
    id: 'fc006',
    tema: 'Tema 7 · LO 4/2015',
    question: 'Quines infraccions es consideren molt greus a la LO 4/2015 de Seguretat Ciutadana?',
    answer: 'Art. 35: (1) reunions o manifestacions no comunicades o prohibides en infraestructures on es presten serveis bàsics, quan generin risc per a la vida o la integritat física; (2) incompliments greus en matèria d\'armes, explosius, cartutxeria o pirotècnia; (3) celebrar espectacles públics trencant una prohibició o suspensió per raons de seguretat pública; (4) projectar feixos de llum sobre pilots o conductors. Compte: les reunions davant el Congrés, el Senat o les assemblees, l\'ús no autoritzat d\'uniforme i l\'obstrucció a l\'autoritat són infraccions GREUS de l\'art. 36, no molt greus.',
    cat: 'leyes',
  },
];

// ATENCIÓ: aquestes marques NO són les del barem oficial de cap convocatòria.
// Els mínims de les proves físiques els fixen les bases de cada convocatòria
// publicades al DOGC i canvien d'una a una altra. Serveixen com a referència
// d'entrenament i la pantalla ho ha d'advertir.
export const PHYSICAL_TESTS_AVIS =
  "Marques de referència per entrenar, NO oficials. Els mínims exigibles els " +
  "fixen les bases de cada convocatòria publicades al DOGC: consulta-les sempre " +
  "abans de donar una marca per bona.";

export const PHYSICAL_TESTS = [
  {
    id: 'course-navette',
    icon: 'bolt',
    name: 'Course-navette',
    unit: 'palets',
    description: 'Test de resistència aeròbica progressiva (Léger). S\'ha d\'arribar al mínim especificat segons edat i sexe.',
    minimums: {
      'H_18_30': { min: 9.0, label: 'Home 18–30 anys' },
      'H_31_40': { min: 8.0, label: 'Home 31–40 anys' },
      'D_18_30': { min: 7.0, label: 'Dona 18–30 anys' },
      'D_31_40': { min: 6.0, label: 'Dona 31–40 anys' },
    },
  },
  {
    id: 'circuit-agilitat',
    icon: 'flame',
    name: 'Circuit d\'agilitat',
    unit: 'seg.',
    description: 'Circuit cronometrat amb obstacles, girs i desplaçaments ràpids. Cal no superar el temps màxim.',
    minimums: {
      'H_18_30': { min: 13.0, label: 'Home 18–30 anys', inverse: true },
      'H_31_40': { min: 14.0, label: 'Home 31–40 anys', inverse: true },
      'D_18_30': { min: 15.0, label: 'Dona 18–30 anys', inverse: true },
      'D_31_40': { min: 16.0, label: 'Dona 31–40 anys', inverse: true },
    },
  },
  {
    id: 'press-banca',
    icon: 'briefcase',
    name: 'Press de banca',
    unit: 'reps',
    description: 'Força del tren superior. Repeticions amb el 70% del pes corporal fins al màxim.',
    minimums: {
      'H_18_30': { min: 18, label: 'Home 18–30 anys' },
      'H_31_40': { min: 14, label: 'Home 31–40 anys' },
      'D_18_30': { min: 10, label: 'Dona 18–30 anys' },
      'D_31_40': { min: 8, label: 'Dona 31–40 anys' },
    },
  },
  {
    id: 'salt-horitzontal',
    icon: 'route',
    name: 'Salt horitzontal',
    unit: 'm',
    description: 'Força explosiva del tren inferior. Salt des de parada amb els dos peus junts.',
    minimums: {
      'H_18_30': { min: 2.0, label: 'Home 18–30 anys' },
      'H_31_40': { min: 1.85, label: 'Home 31–40 anys' },
      'D_18_30': { min: 1.60, label: 'Dona 18–30 anys' },
      'D_31_40': { min: 1.50, label: 'Dona 31–40 anys' },
    },
  },
];
