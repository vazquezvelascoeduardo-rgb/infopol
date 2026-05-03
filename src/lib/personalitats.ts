// Directori de Personalitats — líders actuals de les principals
// institucions que afecten l'àmbit policial i jurídic.
// Actualitzat manualment. La data de l'última actualització es mostra
// al cim de la pàgina.
//
// Quan algú canvia de càrrec, s'actualitza l'entrada i, si es vol
// destacar el canvi recent, es marca amb `recent: true` (afegeix una
// pastilla "🔴 NOU" a la UI).

export type Leader = {
  /** Càrrec o posició (ex. "Presidenta del Parlament Europeu"). */
  position: string;
  /** Nom de la persona. */
  name: string;
  /** Detall opcional (mandat, lloc, antecedents, etc.). */
  detail?: string;
  /** Si és un canvi recent (mostra etiqueta visual). */
  recent?: boolean;
  /** URL Wikipedia / oficial per a més info (opcional). */
  url?: string;
};

export type LeaderSubsection = {
  /** Títol del subgrup (ex. "UNIÓ EUROPEA"). */
  title?: string;
  entries: Leader[];
};

export type LeaderSection = {
  id: string;
  title: string;
  icon: string;
  /** Gradient Tailwind per a la capçalera. */
  accent: string;
  subsections: LeaderSubsection[];
};

export const PERSONALITATS_UPDATED_AT = '2026-05-02';

export const PERSONALITATS: LeaderSection[] = [
  {
    id: 'eu-internacional',
    title: 'Institucions europees i internacionals',
    icon: '🌍',
    accent: 'from-blue-500 to-indigo-700',
    subsections: [
      {
        title: 'Unió Europea',
        entries: [
          { position: 'Presidenta del Parlament Europeu', name: 'Roberta Metsola', detail: 'Estrasburg · mandat fins maig 2026' },
          { position: 'President del Consell Europeu',    name: 'António Costa',   detail: 'Brussel·les' },
          { position: 'Presidenta de la Comissió Europea', name: 'Ursula von der Leyen', detail: 'Brussel·les' },
          { position: 'Vicepresident 1r de la Comissió',   name: 'Maroš Šefčovič' },
          { position: 'Alta Representant UE Afers Exteriors', name: 'Kaja Kallas', detail: 'Des de desembre 2024 (substitueix Borrell)', recent: true },
          { position: 'Presidència del Consell de la UE',  name: 'Xipre', detail: 'Gener-juny 2026 · després Irlanda (jul-des 2026)', recent: true },
          { position: 'President del Tribunal de Justícia UE', name: 'Koen Lenaerts', detail: 'Luxemburg' },
          { position: 'Presidenta del Tribunal Europeu de Drets Humans', name: "Síofra O'Leary", detail: 'Estrasburg' },
          { position: 'Presidenta del Banc Europeu d\'Inversions', name: 'Nadia Calviño Santamaría', detail: 'Luxemburg' },
          { position: 'Presidenta del BCE', name: 'Christine Lagarde', detail: 'Frankfurt' },
          { position: 'Vicepresident del BCE', name: 'Luis de Guindos' },
          { position: 'Defensora del Poble Europeu', name: "Emily O'Reilly" },
        ],
      },
      {
        title: 'Organitzacions internacionals',
        entries: [
          { position: 'Secretari General de l\'ONU', name: 'António Guterres', detail: 'Fins desembre 2026' },
          { position: 'Vicesecretària general de l\'ONU', name: 'Amina J. Mohammed' },
          { position: 'Presidenta Assemblea General ONU', name: 'Annalena Baerbock', detail: 'Alemanya · des setembre 2025 · 80a sessió', recent: true },
          { position: 'Presidenta del FMI', name: 'Kristalina Georgieva', detail: 'Washington D.C.' },
          { position: 'President del Banc Mundial', name: 'Ajay Banga', detail: 'Washington D.C.' },
          { position: 'Secretari General de l\'OTAN', name: 'Mark Rutte', detail: "Des d'1 d'octubre 2024 · Brussel·les" },
          { position: 'Director General de l\'OMS', name: 'Tedros Adhanom Ghebreyesus', detail: 'Ginebra' },
          { position: 'Responsable de l\'OMS a Europa', name: 'Hans Henri P. Kluge' },
          { position: 'Directora general UNESCO', name: 'Audrey Azoulay', detail: 'París' },
          { position: 'Directora Executiva d\'Europol', name: 'Catherine De Bolle', detail: 'Mandat finalitzat 1 maig 2026 · successor en selecció' },
          { position: 'Secretari General d\'Interpol', name: 'Valdecy Urquiza', detail: 'Brasil · des de novembre 2024 (substitueix Stock)', recent: true },
          { position: 'President d\'Interpol', name: 'Lucas Philippe', detail: 'Des de novembre 2025 (substitueix Al-Raisi)', recent: true },
        ],
      },
      {
        title: 'Vaticà',
        entries: [
          { position: 'Papa', name: 'Lleó XIV (Robert Francis Prevost)', detail: 'Des del 8 maig 2025 · primer Papa nascut als EUA · El Papa Francesc va morir el 21 d\'abril 2025', recent: true },
          { position: 'Cardenal Secretari d\'Estat', name: 'Pietro Parolin' },
        ],
      },
    ],
  },

  {
    id: 'europa',
    title: 'Presidents i caps de govern europeus',
    icon: '🇪🇺',
    accent: 'from-indigo-500 to-blue-700',
    subsections: [
      {
        entries: [
          { position: 'President de França', name: 'Emmanuel Macron', detail: 'Des de 2017' },
          { position: 'Primer Ministre de França', name: 'Sébastien Lecornu', detail: 'Des del 9 setembre 2025 · 4t PM en 2 anys', recent: true },
          { position: 'Alcaldessa de París', name: 'Anne Hidalgo', detail: 'Des de 2014' },
          { position: 'President República Italiana', name: 'Sergio Mattarella' },
          { position: 'Primera Ministra d\'Itàlia', name: 'Giorgia Meloni', detail: 'Des de 2022' },
          { position: 'Canceller d\'Alemanya', name: 'Friedrich Merz', detail: 'Des de maig 2025 (substitueix Scholz)', recent: true },
          { position: 'Primer Ministre de Bèlgica', name: 'Bart De Wever', detail: 'Des del 3 febrer 2025 · primer nacionalista flamenc', recent: true },
          { position: 'Primer Ministre Països Baixos', name: 'Rob Jetten', detail: 'Des del 23 febrer 2026 (substitueix Schoof)', recent: true },
          { position: 'Primer Ministre del Regne Unit', name: 'Keir Starmer', detail: 'Des de juliol 2024' },
          { position: 'Taoiseach d\'Irlanda', name: 'Micheál Martin', detail: 'Des de gener 2025', recent: true },
          { position: 'Primera Ministra d\'Irlanda del Nord', name: "Michelle O'Neill" },
          { position: 'President de Portugal', name: 'António José Seguro', detail: 'Des del 9 març 2026 (substitueix Rebelo de Sousa)', recent: true },
          { position: 'Primer Ministre de Portugal', name: 'Luís Montenegro', detail: 'Des de 2024' },
          { position: 'President de Rússia', name: 'Vladimir Putin', detail: '5a legislatura' },
          { position: 'Primer Ministre de Rússia', name: 'Mikhail Mishustin' },
          { position: 'President de Finlàndia', name: 'Alexander Stubb', detail: 'Des de març 2024 (substitueix Niinistö)', recent: true },
          { position: 'Primer Ministre de Noruega', name: 'Jonas Gahr Støre' },
          { position: 'Primera Ministra de Dinamarca', name: 'Mette Frederiksen' },
          { position: 'Primer Ministre de Suècia', name: 'Ulf Kristersson' },
          { position: 'President de Bielorússia', name: 'Aleksandr Lukaixenko', detail: 'Des de 1994' },
          { position: 'Primer Ministre d\'Hongria', name: 'Viktor Orbán', detail: 'Des de 2010' },
          { position: 'President d\'Estònia', name: 'Alar Karis' },
          { position: 'Primer Ministre d\'Estònia', name: 'Kristen Michal', detail: 'Substitueix Kallas', recent: true },
          { position: 'President de Romania', name: 'Nicușor Dan', detail: 'Des de maig 2025 (substitueix Iohannis)', recent: true },
          { position: 'Canceller d\'Àustria', name: 'Christian Stocker', detail: 'Des del 3 març 2025 (substitueix Nehammer)', recent: true },
          { position: 'President de Txèquia', name: 'Petr Pavel', detail: 'Des de 2023' },
          { position: 'Primer Ministre de Txèquia', name: 'Andrej Babiš', detail: 'Des del 9 desembre 2025 (substitueix Fiala)', recent: true },
          { position: 'President de Polònia', name: 'Karol Nawrocki', detail: 'Des d\'agost 2025 (substitueix Duda)', recent: true },
          { position: 'Primer Ministre de Polònia', name: 'Donald Tusk' },
          { position: 'Primer Ministre d\'Eslovàquia', name: 'Robert Fico' },
        ],
      },
    ],
  },

  {
    id: 'llatinoamerica',
    title: 'Presidents llatinoamericans',
    icon: '🌎',
    accent: 'from-emerald-500 to-teal-700',
    subsections: [
      {
        entries: [
          { position: 'President de Mèxic', name: 'Claudia Sheinbaum', detail: 'Des d\'octubre 2024' },
          { position: 'President d\'Argentina', name: 'Javier Milei', detail: 'Des de desembre 2023' },
          { position: 'President de Brasil', name: 'Luiz Inácio Lula da Silva' },
          { position: 'President de Xile', name: 'José Antonio Kast', detail: 'Electe desembre 2025 · pren possessió març 2026', recent: true },
          { position: 'President de Bolívia', name: 'Rodrigo Paz', detail: 'Electe 2025 (substitueix Arce)', recent: true },
          { position: 'President del Perú', name: 'José María Balcázar', detail: 'Substitueix Boluarte', recent: true },
          { position: 'President de Colòmbia', name: 'Gustavo Petro', detail: 'Eleccions maig 2026' },
          { position: 'President d\'Equador', name: 'Daniel Noboa', detail: 'Reelegit abril 2025' },
          { position: 'Presidenta encarregada Veneçuela', name: 'Delcy Rodríguez', detail: 'Des del 5 gener 2026 · Nicolás Maduro arrestat als EUA (Operació Resolve, 3 gener 2026)', recent: true },
          { position: 'President de l\'Uruguai', name: 'Yamandú Orsi', detail: 'Des de març 2025 (substitueix Lacalle Pou)', recent: true },
          { position: 'President de Cuba', name: 'Miguel Díaz-Canel', detail: 'Des de 2019' },
          { position: 'President de Paraguai', name: 'Santiago Peña' },
          { position: 'President de Panamà', name: 'José Raúl Mulino' },
          { position: 'Presidenta d\'Hondures', name: 'Xiomara Castro' },
          { position: 'President de Guatemala', name: 'Bernardo Arévalo' },
          { position: 'President del Salvador', name: 'Nayib Bukele' },
          { position: 'President República Dominicana', name: 'Luis Abinader' },
          { position: 'President de Costa Rica', name: 'Rodrigo Chaves', detail: 'Eleccions febrer 2026' },
        ],
      },
    ],
  },

  {
    id: 'altres-internacional',
    title: 'Altres líders internacionals',
    icon: '🌐',
    accent: 'from-rose-500 to-orange-600',
    subsections: [
      {
        title: 'Estats Units',
        entries: [
          { position: 'President EUA (47è)', name: 'Donald Trump', detail: 'Des del 20 gener 2025', recent: true },
          { position: 'Vicepresident EUA', name: 'JD Vance', recent: true },
          { position: 'Secretari d\'Estat', name: 'Marco Rubio', recent: true },
          { position: 'Secretari del Tresor', name: 'Scott Bessent', detail: 'Substitueix Yellen', recent: true },
          { position: 'Secretari de Defensa/Guerra', name: 'Pete Hegseth', recent: true },
          { position: 'Secretari Seguretat Nacional', name: 'Markwayne Mullin', detail: 'Des del 24 març 2026', recent: true },
          { position: 'Fiscal General (interí)', name: 'Todd Blanche', detail: 'Des del 2 abril 2026 · Bondi destituïda', recent: true },
          { position: 'Secretari de Salut (HHS)', name: 'Robert F. Kennedy Jr.', recent: true },
          { position: 'President Reserva Federal', name: 'Jerome Powell' },
        ],
      },
      {
        title: 'Orient Mitjà',
        entries: [
          { position: 'President de Síria', name: 'Ahmed al-Sharaa', detail: "Des del 29 gener 2025 · caigut Assad desembre 2024", recent: true },
          { position: 'Líder Suprem d\'Iran', name: 'Mojtaba Khamenei', detail: "Des del 8 març 2026 · Ali Khamenei assassinat 28 febrer 2026 (Operation Epic Fury EUA-Israel)", recent: true },
          { position: 'President d\'Iran', name: 'Masoud Pezeshkian', detail: 'Des de juliol 2024' },
          { position: 'President d\'Israel', name: 'Isaac Herzog' },
          { position: 'Primer Ministre d\'Israel', name: 'Binyamín Netanyahu', detail: 'Des de 2022' },
          { position: 'Rei d\'Aràbia Saudita', name: 'Salmán bin Abdulaziz', detail: 'Des de 2015' },
          { position: 'Príncep hereu Aràbia Saudita', name: 'Mohammed bin Salman (MBS)' },
          { position: 'President d\'Iraq', name: 'Abdul Latif Rashid' },
          { position: 'President d\'Egipte', name: 'Abdel Fattah al-Sisi' },
          { position: 'President de Turquia', name: 'Recep Tayyip Erdoğan' },
          { position: 'Rei del Marroc', name: 'Mohammed VI', detail: 'Des de 1999' },
          { position: 'Primer Ministre del Marroc', name: 'Aziz Akhannouch' },
        ],
      },
      {
        title: 'Àsia i Pacífic',
        entries: [
          { position: 'President de la Xina', name: 'Xi Jinping', detail: 'Des de 2013' },
          { position: 'Primera Ministra del Japó', name: 'Sanae Takaichi', detail: "Des d'octubre 2025 · primera dona PM", recent: true },
          { position: 'Emperador del Japó', name: 'Naruhito' },
          { position: 'President de Corea del Sud', name: 'Lee Jae-myung', detail: 'Des de juny 2025 · Yoon destituït', recent: true },
          { position: 'Líder Suprem Corea del Nord', name: 'Kim Jong-un', detail: 'Des de 2011' },
          { position: 'Primer Ministre de l\'Índia', name: 'Narendra Modi' },
          { position: 'Presidenta de l\'Índia', name: 'Droupadi Murmu' },
          { position: 'Primer Ministre d\'Austràlia', name: 'Anthony Albanese', detail: 'Reelegit maig 2025' },
          { position: 'Primer Ministre del Canadà', name: 'Mark Carney', detail: 'Des de març 2025 (substitueix Trudeau)', recent: true },
        ],
      },
    ],
  },

  {
    id: 'espanya',
    title: 'Govern d\'Espanya (XV Legislatura)',
    icon: '🇪🇸',
    accent: 'from-amber-500 to-orange-600',
    subsections: [
      {
        title: 'Consell de Ministres · última remodelació 26 març 2026 (sortida de Montero)',
        entries: [
          { position: 'President del Govern', name: 'Pedro Sánchez' },
          { position: 'Vicepresident 1r i Ministre Economia', name: 'Carlos Cuerpo', detail: 'Promogut a VP1 el 26/3/2026', recent: true },
          { position: 'Vicepresidenta 2a i Ministra Treball', name: 'Yolanda Díaz' },
          { position: 'Vicepresidenta 3a i Ministra Transició Ecològica', name: 'Sara Aagesen' },
          { position: 'Ministre d\'Hisenda', name: 'Arcadi España García', detail: 'Des del 27/3/2026 (substitueix Montero)', recent: true },
          { position: 'Ministre d\'Afers Exteriors, UE i Cooperació', name: 'José Manuel Albares' },
          { position: 'Ministre Presidència, Justícia i Relacions Corts', name: 'Félix Bolaños' },
          { position: 'Ministra de Defensa', name: 'Margarita Robles' },
          { position: 'Ministre d\'Indústria i Turisme', name: 'Jordi Hereu' },
          { position: 'Ministre d\'Interior', name: 'Fernando Grande-Marlaska' },
          { position: 'Ministra Ciència, Innovació i Universitats', name: 'Diana Morant' },
          { position: 'Ministra d\'Educació, FP i Esports', name: 'Milagros Tolón', detail: 'Des de desembre 2025 (substitueix Alegría)', recent: true },
          { position: 'Ministre Política Territorial i Memòria Democràtica', name: 'Ángel Víctor Torres' },
          { position: 'Ministre Transports i Mobilitat Sostenible', name: 'Óscar Puente' },
          { position: 'Ministre Agricultura, Pesca i Alimentació', name: 'Luis Planas' },
          { position: 'Ministra Inclusió, Seguretat Social i Migracions, i Portaveu', name: 'Elma Saiz', detail: 'Portaveu des de desembre 2025', recent: true },
          { position: 'Ministra Habitatge i Agenda Urbana', name: 'Isabel Rodríguez' },
          { position: 'Ministre Transformació Digital i Funció Pública', name: 'Óscar López', detail: 'Des de setembre 2024 (substitueix Escrivá)', recent: true },
          { position: 'Ministra d\'Igualtat', name: 'Ana Redondo' },
          { position: 'Ministre de Cultura', name: 'Ernest Urtasun' },
          { position: 'Ministra de Sanitat', name: 'Mónica García' },
          { position: 'Ministra Infància i Joventut', name: 'Sira Rego' },
          { position: 'Ministre Drets Socials, Consum i Agenda 2030', name: 'Pablo Bustinduy' },
        ],
      },
      {
        title: 'Alts càrrecs institucionals',
        entries: [
          { position: 'Rei d\'Espanya', name: 'Felip VI' },
          { position: 'Presidenta del Congrés', name: 'Francina Armengol' },
          { position: 'President del Senat', name: 'Pedro Rollán' },
          { position: 'Fiscal General de l\'Estat', name: 'Álvaro García Ortiz' },
          { position: 'Presidenta CGPJ i Tribunal Suprem', name: 'Isabel Perelló Doménech' },
          { position: 'President del Tribunal Constitucional', name: 'Cándido Conde-Pumpido' },
          { position: 'Governador del Banc d\'Espanya', name: 'José Luis Escrivá', detail: 'Des de setembre 2024', recent: true },
          { position: 'Defensor del Poble', name: 'Ángel Gabilondo' },
          { position: 'Director General Protecció Civil', name: 'Leonardo Marcos' },
        ],
      },
      {
        title: 'Presidents de Comunitats Autònomes',
        entries: [
          { position: 'Catalunya', name: 'Salvador Illa Roca', detail: '133è · des d\'agost 2024' },
          { position: 'Madrid', name: 'Isabel Díaz Ayuso' },
          { position: 'Andalusia', name: 'Juan Manuel Moreno Bonilla' },
          { position: 'Comunitat Valenciana', name: 'Carlos Mazón' },
          { position: 'Galícia', name: 'Alfonso Rueda Valenzuela' },
          { position: 'País Basc', name: 'Imanol Pradales' },
          { position: 'Castella i Lleó', name: 'Alfonso Fernández Mañueco' },
          { position: 'Castella - la Manxa', name: 'Emiliano García-Page Sánchez' },
          { position: 'Aragó', name: 'Jorge Azcón' },
          { position: 'Astúries', name: 'Adrián Barbón Rodríguez' },
          { position: 'Múrcia', name: 'Fernando López Miras' },
          { position: 'Cantàbria', name: 'María José Sáenz de Buruaga' },
          { position: 'Extremadura', name: 'María Guardiola Martín' },
          { position: 'La Rioja', name: 'Gonzalo Capellán' },
          { position: 'Navarra', name: 'María Chivite Navascués' },
          { position: 'Illes Balears', name: 'Marga Prohens' },
          { position: 'Canàries', name: 'Fernando Clavijo' },
          { position: 'Ceuta', name: 'Juan Jesús Vivas' },
          { position: 'Melilla', name: 'Juan José Imbroda' },
        ],
      },
    ],
  },

  {
    id: 'catalunya',
    title: 'Govern de Catalunya (XV Legislatura)',
    icon: '🇪🇸',
    accent: 'from-red-500 to-amber-600',
    subsections: [
      {
        title: 'Consell Executiu',
        entries: [
          { position: 'President de la Generalitat (133è)', name: 'Salvador Illa Roca' },
          { position: 'Conseller de Presidència', name: 'Albert Dalmau' },
          { position: 'Consellera d\'Economia i Finances', name: 'Alícia Romero' },
          { position: 'Consellera d\'Interior i Seguretat Pública', name: 'Núria Parlon Gil' },
          { position: 'Conseller de Justícia i Qualitat Democràtica', name: 'Ramon Espadaler' },
          { position: 'Consellera de Territori, Habitatge i Transició Ecològica i Portaveu', name: 'Sílvia Paneque' },
          { position: 'Consellera de Salut', name: 'Olga Pané' },
          { position: 'Consellera d\'Educació i FP', name: 'Esther Niubó' },
          { position: 'Consellera de Drets Socials i Inclusió', name: 'Mònica Martínez Bravo' },
          { position: 'Conseller d\'Empresa i Treball', name: 'Miquel Sàmper' },
          { position: 'Consellera d\'Igualtat i Feminisme', name: 'Eva Menor' },
          { position: 'Conseller d\'Acció Exterior i UE', name: 'Jaume Duch' },
          { position: 'Conseller d\'Esports', name: 'Berni Álvarez' },
          { position: 'Consellera de Cultura', name: 'Sònia Hernández Almodóvar' },
          { position: 'Conseller d\'Agricultura, Ramaderia i Pesca', name: 'Òscar Ordeig' },
          { position: 'Consellera d\'Universitats', name: 'Núria Montserrat Pulido' },
          { position: 'Conseller de Política Lingüística', name: 'Francesc Xavier Vila' },
        ],
      },
      {
        title: 'Alts càrrecs institucionals catalans',
        entries: [
          { position: 'President del Parlament de Catalunya', name: 'Josep Rull' },
          { position: 'Vicepresidenta del Parlament', name: 'Alba Vergés Bosch' },
          { position: 'Síndica de Greuges de Catalunya', name: 'Esther Giménez-Salinas' },
          { position: 'Síndic de Barcelona', name: 'David Bondia' },
          { position: 'Alcalde de Barcelona', name: 'Jaume Collboni' },
          { position: 'Director General Mossos d\'Esquadra', name: 'Josep Lluís Trapero', detail: 'Des d\'agost 2024' },
          { position: 'Comissari en Cap dels Mossos', name: 'Miquel Esquius', detail: 'Es jubila agost 2026' },
          { position: 'Sots-cap executiva dels Mossos', name: 'Alícia Moriana' },
          { position: 'Presidenta TSJC', name: 'Mercè Caso', detail: 'Substitueix Barrientos', recent: true },
          { position: 'Directora Protecció Civil de Catalunya', name: 'Marta Cassany Virgili' },
          { position: 'Director General Prevenció i Extinció d\'Incendis', name: 'Joan Delort' },
          { position: 'Delegat Govern Espanyol a Catalunya', name: 'Carlos Prieto' },
          { position: 'President d\'Òmnium Cultural', name: 'Xavier Antich', detail: 'Des de 2022 (substitueix Cuixart)', recent: true },
          { position: 'President de l\'ANC', name: 'Lluís Llach', detail: 'Des de 2025' },
        ],
      },
    ],
  },
];

