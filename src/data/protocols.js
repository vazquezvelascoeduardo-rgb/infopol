// ─────────────────────────────────────────────────────────────────────────────
//  PROTOCOLS D'ACTUACIÓ
//
//  ATENCIÓ — abast d'aquest fitxer:
//  Aquests passos són una guia de consulta redactada a partir de normativa
//  pública (TRLSV, RGC, LECrim, LO 4/2015, CP i CE). NO reprodueixen cap
//  procediment normalitzat de treball, instrucció interna ni doctrina de cap
//  cos policial, i no els substitueixen. Davant de qualsevol discrepància
//  preval la instrucció del cos.
//
//  Cada pas ha de citar la norma pública que l'empara. Si un pas no es pot
//  fonamentar en una norma publicada, no ha de constar aquí.
// ─────────────────────────────────────────────────────────────────────────────

export const PROTOCOLS_AVIS =
  "Guia de consulta elaborada a partir de normativa pública. No reprodueix ni " +
  "substitueix cap procediment normalitzat de treball ni cap instrucció interna " +
  "del cos; davant de discrepància, preval la instrucció del cos.";

// Operational protocols for police agents — based on Spanish/Catalan police procedures

export const PROTOCOLS = [
  {
    id: 'alcohol',
    cat: 'alcohol',
    icon: 'beaker',
    category: 'Trànsit · Control',
    title: 'Control d\'alcoholèmia',
    desc: 'Procediment complet per a controls preventius i positius per alcohol o drogues.',
    tags: ['Alcohol', 'Drogues', 'Trànsit'],
    steps: [
      {
        n: 1,
        title: 'Aturar el vehicle',
        desc: 'Senyalitzar l\'aturada amb la targeta STOP o llums del vehicle policial. Situar-se en posició de seguretat al costat del conductor.',
        warning: null,
      },
      {
        n: 2,
        title: 'Identificació i comprovació documental',
        desc: 'Sol·licitar permís de conduir, documentació del vehicle i assegurança en vigor. Verificar al sistema.',
        warning: null,
      },
      {
        n: 3,
        title: 'Prova de detecció d\'alcohol',
        desc: 'Informar el conductor de l\'obligatorietat de sotmetre\'s a la prova (art. 14.2 TRLSV). Realitzar-la amb etilòmetre homologat.',
        warning: 'Si es nega: delicte de l\'art. 383 CP (negativa a les proves), amb pena de presó de 6 mesos a 1 any i privació del permís de més d\'1 i fins a 4 anys. Procedir a detenció.',
      },
      {
        n: 4,
        title: 'Lectura del resultat i decisió',
        desc: 'Precepte infringit: art. 14.1 TRLSV. Conductor general: fins a 0,25 sense infracció; de 0,26 a 0,50 → 500 € i 4 punts; superior a 0,50 → 1.000 € i 6 punts. Professionals i novells: el tram sancionable comença a 0,16. Menors: qualsevol taxa superior a 0. Consulta el barem complet a Barems · Alcoholèmia.',
        warning: null,
      },
      {
        n: 5,
        title: 'Prova contraprova (si > 0,25)',
        desc: 'Esperar 10 minuts i repetir la prova amb un nou etilòmetre. Informar el conductor del dret a la segona prova.',
        warning: null,
      },
      {
        n: 6,
        title: 'Si el resultat és > 0,60 mg/l (DELICTE)',
        desc: 'A partir de 0,60 mg/l en aire espirat (o 1,2 g/l en sang) el fet és delicte de l\'art. 379.2 CP en tot cas. Decau la via administrativa: no es formula denúncia, s\'instrueix atestat. Lectura de drets (art. 520 LECrim).',
        warning: 'Atenció: Comunicar al metge forense si hi ha signes d\'intoxicació greu. No deixar el conductor sol.',
      },
    ],
  },
  {
    id: 'identificacio',
    cat: 'operativa',
    icon: 'user',
    category: 'Seguretat Ciutadana',
    title: 'Identificació de persones',
    desc: 'Procediment d\'identificació en via pública. Art. 16 LO 4/2015 (l\'art. 20 regula els registres corporals externs, no la identificació).',
    tags: ['Identificació', 'LO 4/2015', 'Seguretat'],
    steps: [
      {
        n: 1,
        title: 'Fonament i motivació',
        desc: 'L\'art. 16.1 LO 4/2015 només empara el requeriment quan hi ha indicis que la persona ha participat en la comissió d\'una infracció, o quan és raonablement necessari per prevenir un delicte. Documentar quin dels dos supòsits concorre.',
        warning: null,
      },
      {
        n: 2,
        title: 'Sol·licitud d\'identificació',
        desc: 'Identificar-se com a agent de l\'autoritat (placa o TIP). Sol·licitar documentació identificativa: DNI, NIE, passaport o permís de conduir.',
        warning: null,
      },
      {
        n: 3,
        title: 'Si no porta documentació',
        desc: 'Pot identificar-se per qualsevol altre mitjà. Si no és possible o s\'hi nega: trasllat a dependències per identificar-la, pel temps estrictament necessari i mai per damunt de 6 hores (art. 16.2 LO 4/2015).',
        warning: 'El trasllat per identificació NO és detenció. La persona no ha de ser posada en cel·la.',
      },
      {
        n: 4,
        title: 'Documentació de l\'actuació',
        desc: 'Anotar l\'hora d\'inici i fi de l\'actuació. Reflectir les dades del requerit i la motivació. Lliurar còpia si el requerit la sol·licita.',
        warning: null,
      },
    ],
  },
  {
    id: 'detencio',
    cat: 'alcohol',
    icon: 'lock',
    category: 'Seguretat Ciutadana · CP',
    title: 'Detenció cautelar',
    desc: 'Procediment de detenció per delicte flagrant. Art. 492 i 520 LECrim.',
    tags: ['Detenció', 'Drets', 'LECrim'],
    steps: [
      {
        n: 1,
        title: 'Verificar el supòsit de detenció',
        desc: 'Delicte flagrant (s\'està cometent o s\'acaba de cometre). Indicis racionals de participació. Fuga previsible o risc de destrucció de proves.',
        warning: 'No es pot detenir per infracció administrativa. Cal fonament penal.',
      },
      {
        n: 2,
        title: 'Comunicar la detenció',
        desc: 'Informar clarament el detingut: "Queda vostè detingut per indicis de [delicte]. Té el dret a no declarar i a un advocat."',
        warning: null,
      },
      {
        n: 3,
        title: 'Lectura de drets (art. 520 LECrim)',
        desc: '1) Dret a no declarar. 2) Dret a no declarar-se culpable. 3) Dret a advocat. 4) Dret a intèrpret. 5) Dret a informar un familiar. 6) Dret a reconeixement mèdic. 7) Dret a intèrpret.',
        warning: null,
      },
      {
        n: 4,
        title: 'Registre de pertinences i escorcoll',
        desc: 'Escorcoll de seguretat per a objectes perillosos. Registrar i inventariar totes les pertinences. Lliurar rebut del dipòsit.',
        warning: 'L\'escorcoll personal requereix motiu justificat. Documentar sempre.',
      },
      {
        n: 5,
        title: 'Comunicació a dependències',
        desc: 'Comunicar la detenció a la sala. Anotar l\'hora exacta (el termini de 72h comença des de la detenció). Avisar el familiar designat (si ho autoritza el detingut).',
        warning: null,
      },
      {
        n: 6,
        title: 'Aixecar atestat',
        desc: 'Redactar atestat complet amb: dades del detingut, motiu de la detenció, hora, lloc, diligències practicades i drets llegits. Presentar al Jutjat de Guàrdia.',
        warning: null,
      },
    ],
  },
  {
    id: 'accident',
    cat: 'operativa',
    icon: 'car',
    category: 'Trànsit · Accidents',
    title: 'Accident de trànsit',
    desc: 'Actuació en accidents de circulació. Lesions, danys i atestat.',
    tags: ['Accident', 'Lesions', 'Atestat'],
    steps: [
      {
        n: 1,
        title: 'Seguretat i protecció de la zona',
        desc: 'Senyalitzar la zona amb triangles de prevenció i luces. Establir un perímetre de seguretat. Sol·licitar ambulància si hi ha ferits.',
        warning: null,
      },
      {
        n: 2,
        title: 'Atenció als ferits',
        desc: 'Valorar l\'estat dels implicats. No moure ferits greus tret que hi hagi perill imminent. Mantenir conversa per monitoritzar l\'estat de consciència.',
        warning: null,
      },
      {
        n: 3,
        title: 'Identificació d\'implicats i testimonis',
        desc: 'Identificar tots els conductors, passatgers i testimonis. Recollir dades d\'assegurança de tots els vehicles implicats.',
        warning: null,
      },
      {
        n: 4,
        title: 'Inspecció ocular del lloc',
        desc: 'Documentar la posició dels vehicles, marques de frenada, focus d\'impacte i restes. Prendre fotografies i croquis. Mesurar les distàncies.',
        warning: null,
      },
      {
        n: 5,
        title: 'Prova d\'alcohol i drogues',
        desc: 'Practicar prova d\'alcoholèmia a tots els conductors (obligatori si hi ha víctimes). Documentar el resultat.',
        warning: 'Si el conductor dona una taxa superior a 0,60 mg/l en aire espirat: delicte de l\'art. 379.2 CP. No s\'acumula sanció administrativa.',
      },
      {
        n: 6,
        title: 'Aixecar atestat o diligències',
        desc: 'Si hi ha ferits o possible delicte: atestat complert. Si són danys materials: diligències d\'accident + DTE si escau.',
        warning: null,
      },
    ],
  },
  {
    id: 'violencia-domestica',
    cat: 'operativa',
    icon: 'shield',
    category: 'Seguretat Ciutadana · VD',
    title: 'Violència domèstica',
    desc: 'Actuació davant d\'episodis de violència en l\'àmbit domèstic i familiar.',
    tags: ['Violència domèstica', 'Víctima', 'VIOGEN'],
    steps: [
      {
        n: 1,
        title: 'Accés al domicili i primera valoració',
        desc: 'L\'entrada sense consentiment ni resolució judicial només és possible en cas de flagrant delicte (art. 18.2 CE i art. 553 LECrim) o estat de necessitat acreditat. Documentar què s\'ha percebut que ho justifica.',
        warning: 'La seguretat de la víctima és prioritària. No deixar mai la víctima sola amb l\'agressor.',
      },
      {
        n: 2,
        title: 'Separació i entrevista',
        desc: 'Separar víctima i agressor en espais físics independents. Entrevistar la víctima en privat. Documentar lesions (fotografies si autoritza).',
        warning: null,
      },
      {
        n: 3,
        title: 'Valoració del risc (VIOGEN)',
        desc: 'Aplicar el formulari de valoració policial del risc (VPR). Classificar el nivell de risc: no apreciat, baix, mitjà, alt, extrem.',
        warning: null,
      },
      {
        n: 4,
        title: 'Detenció de l\'agressor',
        desc: 'Si hi ha indicis de delicte flagrant o si la víctima ha patit lesions: procedir a la detenció. Aplicar mesures cautelars (retenció d\'armes si n\'hi ha).',
        warning: null,
      },
      {
        n: 5,
        title: 'Atestat i comunicació judicial',
        desc: 'Aixecar atestat complet. Notificar al Jutjat de Guàrdia i al Ministeri Fiscal. Informar la víctima dels seus drets i dels recursos disponibles (OAV).',
        warning: null,
      },
    ],
  },
];
