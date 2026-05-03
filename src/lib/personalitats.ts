// Directori de Personalitats — líders actuals de les principals
// institucions que afecten l'àmbit policial i jurídic.
// Actualitzat manualment. La data de l'última actualització es mostra
// al cim de la pàgina.

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
  /**
   * Bandera o emblema (emoji) — chip visual a l'esquerra de l'entrada.
   * Per a països ('🇫🇷', '🇮🇹'...) o emblemes institucionals
   * ('🇪🇺', '🇺🇳', '🇻🇦', '🏛️'...).
   */
  flag?: string;
};

export type LeaderSubsection = {
  /** Títol del subgrup (ex. "UNIÓ EUROPEA"). */
  title?: string;
  /** Icona del subgrup (mostrada al costat del títol). */
  icon?: string;
  /** Si és true, renderitza les entrades en grid 2 col a sm+. */
  compact?: boolean;
  entries: Leader[];
};

export type LeaderSection = {
  id: string;
  title: string;
  /** Etiqueta breu per a la navegació ràpida (ex: 'Espanya'). */
  shortLabel: string;
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
    shortLabel: 'Internacional',
    icon: '🌍',
    accent: 'from-blue-500 to-indigo-700',
    subsections: [
      {
        title: 'Unió Europea',
        icon: '🇪🇺',
        entries: [
          { flag: '🇪🇺', position: 'Presidenta del Parlament Europeu', name: 'Roberta Metsola', detail: 'Estrasburg · mandat fins maig 2026' },
          { flag: '🇪🇺', position: 'President del Consell Europeu',    name: 'António Costa',   detail: 'Brussel·les' },
          { flag: '🇪🇺', position: 'Presidenta de la Comissió Europea', name: 'Ursula von der Leyen', detail: 'Brussel·les' },
          { flag: '🇪🇺', position: 'Vicepresident 1r de la Comissió',   name: 'Maroš Šefčovič' },
          { flag: '🇪🇺', position: 'Alta Representant UE Afers Exteriors', name: 'Kaja Kallas', detail: 'Des de desembre 2024 (substitueix Borrell)', recent: true },
          { flag: '🇨🇾', position: 'Presidència del Consell de la UE (1S 2026)', name: 'Xipre', detail: 'Gener-juny 2026 · després Irlanda (jul-des 2026)', recent: true },
          { flag: '🇪🇺', position: 'President del Tribunal de Justícia UE', name: 'Koen Lenaerts', detail: 'Luxemburg' },
          { flag: '🇪🇺', position: 'Presidenta del Tribunal Europeu de Drets Humans', name: "Síofra O'Leary", detail: 'Estrasburg' },
          { flag: '🇪🇺', position: 'Presidenta del Banc Europeu d\'Inversions', name: 'Nadia Calviño Santamaría', detail: 'Luxemburg' },
          { flag: '🇪🇺', position: 'Presidenta del BCE', name: 'Christine Lagarde', detail: 'Frankfurt' },
          { flag: '🇪🇺', position: 'Vicepresident del BCE', name: 'Luis de Guindos' },
          { flag: '🇪🇺', position: 'Defensora del Poble Europeu', name: "Emily O'Reilly" },
        ],
      },
      {
        title: 'Organitzacions internacionals',
        icon: '🌐',
        entries: [
          { flag: '🇺🇳', position: 'Secretari General de l\'ONU', name: 'António Guterres', detail: 'Fins desembre 2026' },
          { flag: '🇺🇳', position: 'Vicesecretària general de l\'ONU', name: 'Amina J. Mohammed' },
          { flag: '🇺🇳', position: 'Presidenta Assemblea General ONU', name: 'Annalena Baerbock', detail: 'Alemanya · des setembre 2025 · 80a sessió', recent: true },
          { flag: '💵', position: 'Presidenta del FMI', name: 'Kristalina Georgieva', detail: 'Washington D.C.' },
          { flag: '💵', position: 'President del Banc Mundial', name: 'Ajay Banga', detail: 'Washington D.C.' },
          { flag: '🛡️', position: 'Secretari General de l\'OTAN', name: 'Mark Rutte', detail: "Des d'1 d'octubre 2024 · Brussel·les" },
          { flag: '🩺', position: 'Director General de l\'OMS', name: 'Tedros Adhanom Ghebreyesus', detail: 'Ginebra' },
          { flag: '🩺', position: 'Responsable de l\'OMS a Europa', name: 'Hans Henri P. Kluge' },
          { flag: '🎓', position: 'Directora general UNESCO', name: 'Audrey Azoulay', detail: 'París' },
          { flag: '👮', position: 'Directora Executiva d\'Europol', name: 'Catherine De Bolle', detail: 'Mandat finalitzat 1 maig 2026 · successor en selecció' },
          { flag: '🚓', position: 'Secretari General d\'Interpol', name: 'Valdecy Urquiza', detail: 'Brasil · des de novembre 2024 (substitueix Stock)', recent: true },
          { flag: '🚓', position: 'President d\'Interpol', name: 'Lucas Philippe', detail: 'Des de novembre 2025 (substitueix Al-Raisi)', recent: true },
        ],
      },
      {
        title: 'Vaticà',
        icon: '✝️',
        entries: [
          { flag: '🇻🇦', position: 'Papa', name: 'Lleó XIV (Robert Francis Prevost)', detail: 'Des del 8 maig 2025 · primer Papa nascut als EUA · El Papa Francesc va morir el 21 d\'abril 2025', recent: true },
          { flag: '🇻🇦', position: 'Cardenal Secretari d\'Estat', name: 'Pietro Parolin' },
        ],
      },
    ],
  },

  {
    id: 'europa',
    title: 'Presidents i caps de govern europeus',
    shortLabel: 'Europa',
    icon: '🇪🇺',
    accent: 'from-indigo-500 to-blue-700',
    subsections: [
      {
        entries: [
          { flag: '🇫🇷', position: 'President de França', name: 'Emmanuel Macron', detail: 'Des de 2017' },
          { flag: '🇫🇷', position: 'Primer Ministre de França', name: 'Sébastien Lecornu', detail: 'Des del 9 setembre 2025 · 4t PM en 2 anys', recent: true },
          { flag: '🇫🇷', position: 'Alcaldessa de París', name: 'Anne Hidalgo', detail: 'Des de 2014' },
          { flag: '🇮🇹', position: 'President República Italiana', name: 'Sergio Mattarella' },
          { flag: '🇮🇹', position: 'Primera Ministra d\'Itàlia', name: 'Giorgia Meloni', detail: 'Des de 2022' },
          { flag: '🇩🇪', position: 'Canceller d\'Alemanya', name: 'Friedrich Merz', detail: 'Des de maig 2025 (substitueix Scholz)', recent: true },
          { flag: '🇧🇪', position: 'Primer Ministre de Bèlgica', name: 'Bart De Wever', detail: 'Des del 3 febrer 2025 · primer nacionalista flamenc', recent: true },
          { flag: '🇳🇱', position: 'Primer Ministre Països Baixos', name: 'Rob Jetten', detail: 'Des del 23 febrer 2026 (substitueix Schoof)', recent: true },
          { flag: '🇬🇧', position: 'Primer Ministre del Regne Unit', name: 'Keir Starmer', detail: 'Des de juliol 2024' },
          { flag: '🇮🇪', position: 'Taoiseach d\'Irlanda', name: 'Micheál Martin', detail: 'Des de gener 2025', recent: true },
          { flag: '🇬🇧', position: 'Primera Ministra d\'Irlanda del Nord', name: "Michelle O'Neill" },
          { flag: '🇵🇹', position: 'President de Portugal', name: 'António José Seguro', detail: 'Des del 9 març 2026 (substitueix Rebelo de Sousa)', recent: true },
          { flag: '🇵🇹', position: 'Primer Ministre de Portugal', name: 'Luís Montenegro', detail: 'Des de 2024' },
          { flag: '🇷🇺', position: 'President de Rússia', name: 'Vladimir Putin', detail: '5a legislatura' },
          { flag: '🇷🇺', position: 'Primer Ministre de Rússia', name: 'Mikhail Mishustin' },
          { flag: '🇫🇮', position: 'President de Finlàndia', name: 'Alexander Stubb', detail: 'Des de març 2024 (substitueix Niinistö)', recent: true },
          { flag: '🇳🇴', position: 'Primer Ministre de Noruega', name: 'Jonas Gahr Støre' },
          { flag: '🇩🇰', position: 'Primera Ministra de Dinamarca', name: 'Mette Frederiksen' },
          { flag: '🇸🇪', position: 'Primer Ministre de Suècia', name: 'Ulf Kristersson' },
          { flag: '🇧🇾', position: 'President de Bielorússia', name: 'Aleksandr Lukaixenko', detail: 'Des de 1994' },
          { flag: '🇭🇺', position: 'Primer Ministre d\'Hongria', name: 'Viktor Orbán', detail: 'Des de 2010' },
          { flag: '🇪🇪', position: 'President d\'Estònia', name: 'Alar Karis' },
          { flag: '🇪🇪', position: 'Primer Ministre d\'Estònia', name: 'Kristen Michal', detail: 'Substitueix Kallas', recent: true },
          { flag: '🇷🇴', position: 'President de Romania', name: 'Nicușor Dan', detail: 'Des de maig 2025 (substitueix Iohannis)', recent: true },
          { flag: '🇦🇹', position: 'Canceller d\'Àustria', name: 'Christian Stocker', detail: 'Des del 3 març 2025 (substitueix Nehammer)', recent: true },
          { flag: '🇨🇿', position: 'President de Txèquia', name: 'Petr Pavel', detail: 'Des de 2023' },
          { flag: '🇨🇿', position: 'Primer Ministre de Txèquia', name: 'Andrej Babiš', detail: 'Des del 9 desembre 2025 (substitueix Fiala)', recent: true },
          { flag: '🇵🇱', position: 'President de Polònia', name: 'Karol Nawrocki', detail: 'Des d\'agost 2025 (substitueix Duda)', recent: true },
          { flag: '🇵🇱', position: 'Primer Ministre de Polònia', name: 'Donald Tusk' },
          { flag: '🇸🇰', position: 'Primer Ministre d\'Eslovàquia', name: 'Robert Fico' },
        ],
      },
    ],
  },

  {
    id: 'llatinoamerica',
    title: 'Presidents llatinoamericans',
    shortLabel: 'Llatinoamèrica',
    icon: '🌎',
    accent: 'from-emerald-500 to-teal-700',
    subsections: [
      {
        entries: [
          { flag: '🇲🇽', position: 'President de Mèxic', name: 'Claudia Sheinbaum', detail: 'Des d\'octubre 2024' },
          { flag: '🇦🇷', position: 'President d\'Argentina', name: 'Javier Milei', detail: 'Des de desembre 2023' },
          { flag: '🇧🇷', position: 'President de Brasil', name: 'Luiz Inácio Lula da Silva' },
          { flag: '🇨🇱', position: 'President de Xile', name: 'José Antonio Kast', detail: 'Electe desembre 2025 · pren possessió març 2026', recent: true },
          { flag: '🇧🇴', position: 'President de Bolívia', name: 'Rodrigo Paz', detail: 'Electe 2025 (substitueix Arce)', recent: true },
          { flag: '🇵🇪', position: 'President del Perú', name: 'José María Balcázar', detail: 'Substitueix Boluarte', recent: true },
          { flag: '🇨🇴', position: 'President de Colòmbia', name: 'Gustavo Petro', detail: 'Eleccions maig 2026' },
          { flag: '🇪🇨', position: 'President d\'Equador', name: 'Daniel Noboa', detail: 'Reelegit abril 2025' },
          { flag: '🇻🇪', position: 'Presidenta encarregada Veneçuela', name: 'Delcy Rodríguez', detail: 'Des del 5 gener 2026 · Nicolás Maduro arrestat als EUA (Operació Resolve, 3 gener 2026)', recent: true },
          { flag: '🇺🇾', position: 'President de l\'Uruguai', name: 'Yamandú Orsi', detail: 'Des de març 2025 (substitueix Lacalle Pou)', recent: true },
          { flag: '🇨🇺', position: 'President de Cuba', name: 'Miguel Díaz-Canel', detail: 'Des de 2019' },
          { flag: '🇵🇾', position: 'President de Paraguai', name: 'Santiago Peña' },
          { flag: '🇵🇦', position: 'President de Panamà', name: 'José Raúl Mulino' },
          { flag: '🇭🇳', position: 'Presidenta d\'Hondures', name: 'Xiomara Castro' },
          { flag: '🇬🇹', position: 'President de Guatemala', name: 'Bernardo Arévalo' },
          { flag: '🇸🇻', position: 'President del Salvador', name: 'Nayib Bukele' },
          { flag: '🇩🇴', position: 'President República Dominicana', name: 'Luis Abinader' },
          { flag: '🇨🇷', position: 'President de Costa Rica', name: 'Rodrigo Chaves', detail: 'Eleccions febrer 2026' },
        ],
      },
    ],
  },

  {
    id: 'altres-internacional',
    title: 'Altres líders internacionals',
    shortLabel: 'EUA i Àsia',
    icon: '🌐',
    accent: 'from-rose-500 to-orange-600',
    subsections: [
      {
        title: 'Estats Units',
        icon: '🇺🇸',
        entries: [
          { flag: '🇺🇸', position: 'President EUA (47è)', name: 'Donald Trump', detail: 'Des del 20 gener 2025', recent: true },
          { flag: '🇺🇸', position: 'Vicepresident EUA', name: 'JD Vance', recent: true },
          { flag: '🇺🇸', position: 'Secretari d\'Estat', name: 'Marco Rubio', recent: true },
          { flag: '🇺🇸', position: 'Secretari del Tresor', name: 'Scott Bessent', detail: 'Substitueix Yellen', recent: true },
          { flag: '🇺🇸', position: 'Secretari de Defensa/Guerra', name: 'Pete Hegseth', recent: true },
          { flag: '🇺🇸', position: 'Secretari Seguretat Nacional', name: 'Markwayne Mullin', detail: 'Des del 24 març 2026', recent: true },
          { flag: '🇺🇸', position: 'Fiscal General (interí)', name: 'Todd Blanche', detail: 'Des del 2 abril 2026 · Bondi destituïda', recent: true },
          { flag: '🇺🇸', position: 'Secretari de Salut (HHS)', name: 'Robert F. Kennedy Jr.', recent: true },
          { flag: '🇺🇸', position: 'President Reserva Federal', name: 'Jerome Powell' },
        ],
      },
      {
        title: 'Orient Mitjà',
        icon: '🕌',
        entries: [
          { flag: '🇸🇾', position: 'President de Síria', name: 'Ahmed al-Sharaa', detail: "Des del 29 gener 2025 · caigut Assad desembre 2024", recent: true },
          { flag: '🇮🇷', position: 'Líder Suprem d\'Iran', name: 'Mojtaba Khamenei', detail: "Des del 8 març 2026 · Ali Khamenei assassinat 28 febrer 2026 (Operation Epic Fury EUA-Israel)", recent: true },
          { flag: '🇮🇷', position: 'President d\'Iran', name: 'Masoud Pezeshkian', detail: 'Des de juliol 2024' },
          { flag: '🇮🇱', position: 'President d\'Israel', name: 'Isaac Herzog' },
          { flag: '🇮🇱', position: 'Primer Ministre d\'Israel', name: 'Binyamín Netanyahu', detail: 'Des de 2022' },
          { flag: '🇸🇦', position: 'Rei d\'Aràbia Saudita', name: 'Salmán bin Abdulaziz', detail: 'Des de 2015' },
          { flag: '🇸🇦', position: 'Príncep hereu Aràbia Saudita', name: 'Mohammed bin Salman (MBS)' },
          { flag: '🇮🇶', position: 'President d\'Iraq', name: 'Abdul Latif Rashid' },
          { flag: '🇪🇬', position: 'President d\'Egipte', name: 'Abdel Fattah al-Sisi' },
          { flag: '🇹🇷', position: 'President de Turquia', name: 'Recep Tayyip Erdoğan' },
          { flag: '🇲🇦', position: 'Rei del Marroc', name: 'Mohammed VI', detail: 'Des de 1999' },
          { flag: '🇲🇦', position: 'Primer Ministre del Marroc', name: 'Aziz Akhannouch' },
        ],
      },
      {
        title: 'Àsia i Pacífic',
        icon: '⛩️',
        entries: [
          { flag: '🇨🇳', position: 'President de la Xina', name: 'Xi Jinping', detail: 'Des de 2013' },
          { flag: '🇯🇵', position: 'Primera Ministra del Japó', name: 'Sanae Takaichi', detail: "Des d'octubre 2025 · primera dona PM", recent: true },
          { flag: '🇯🇵', position: 'Emperador del Japó', name: 'Naruhito' },
          { flag: '🇰🇷', position: 'President de Corea del Sud', name: 'Lee Jae-myung', detail: 'Des de juny 2025 · Yoon destituït', recent: true },
          { flag: '🇰🇵', position: 'Líder Suprem Corea del Nord', name: 'Kim Jong-un', detail: 'Des de 2011' },
          { flag: '🇮🇳', position: 'Primer Ministre de l\'Índia', name: 'Narendra Modi' },
          { flag: '🇮🇳', position: 'Presidenta de l\'Índia', name: 'Droupadi Murmu' },
          { flag: '🇦🇺', position: 'Primer Ministre d\'Austràlia', name: 'Anthony Albanese', detail: 'Reelegit maig 2025' },
          { flag: '🇨🇦', position: 'Primer Ministre del Canadà', name: 'Mark Carney', detail: 'Des de març 2025 (substitueix Trudeau)', recent: true },
        ],
      },
    ],
  },

  {
    id: 'espanya',
    title: 'Govern d\'Espanya (XV Legislatura)',
    shortLabel: 'Espanya',
    icon: '🇪🇸',
    accent: 'from-amber-500 to-orange-600',
    subsections: [
      {
        title: 'Consell de Ministres · última remodelació 26 març 2026',
        icon: '🏛️',
        entries: [
          { flag: '🇪🇸', position: 'President del Govern', name: 'Pedro Sánchez' },
          { flag: '🇪🇸', position: 'Vicepresident 1r i Ministre Economia', name: 'Carlos Cuerpo', detail: 'Promogut a VP1 el 26/3/2026', recent: true },
          { flag: '🇪🇸', position: 'Vicepresidenta 2a i Ministra Treball', name: 'Yolanda Díaz' },
          { flag: '🇪🇸', position: 'Vicepresidenta 3a i Ministra Transició Ecològica', name: 'Sara Aagesen' },
          { flag: '🇪🇸', position: 'Ministre d\'Hisenda', name: 'Arcadi España García', detail: 'Des del 27/3/2026 (substitueix Montero)', recent: true },
          { flag: '🇪🇸', position: 'Ministre d\'Afers Exteriors, UE i Cooperació', name: 'José Manuel Albares' },
          { flag: '🇪🇸', position: 'Ministre Presidència, Justícia i Relacions Corts', name: 'Félix Bolaños' },
          { flag: '🇪🇸', position: 'Ministra de Defensa', name: 'Margarita Robles' },
          { flag: '🇪🇸', position: 'Ministre d\'Indústria i Turisme', name: 'Jordi Hereu' },
          { flag: '🇪🇸', position: 'Ministre d\'Interior', name: 'Fernando Grande-Marlaska' },
          { flag: '🇪🇸', position: 'Ministra Ciència, Innovació i Universitats', name: 'Diana Morant' },
          { flag: '🇪🇸', position: 'Ministra d\'Educació, FP i Esports', name: 'Milagros Tolón', detail: 'Des de desembre 2025 (substitueix Alegría)', recent: true },
          { flag: '🇪🇸', position: 'Ministre Política Territorial i Memòria Democràtica', name: 'Ángel Víctor Torres' },
          { flag: '🇪🇸', position: 'Ministre Transports i Mobilitat Sostenible', name: 'Óscar Puente' },
          { flag: '🇪🇸', position: 'Ministre Agricultura, Pesca i Alimentació', name: 'Luis Planas' },
          { flag: '🇪🇸', position: 'Ministra Inclusió, Seguretat Social i Migracions, i Portaveu', name: 'Elma Saiz', detail: 'Portaveu des de desembre 2025', recent: true },
          { flag: '🇪🇸', position: 'Ministra Habitatge i Agenda Urbana', name: 'Isabel Rodríguez' },
          { flag: '🇪🇸', position: 'Ministre Transformació Digital i Funció Pública', name: 'Óscar López', detail: 'Des de setembre 2024 (substitueix Escrivá)', recent: true },
          { flag: '🇪🇸', position: 'Ministra d\'Igualtat', name: 'Ana Redondo' },
          { flag: '🇪🇸', position: 'Ministre de Cultura', name: 'Ernest Urtasun' },
          { flag: '🇪🇸', position: 'Ministra de Sanitat', name: 'Mónica García' },
          { flag: '🇪🇸', position: 'Ministra Infància i Joventut', name: 'Sira Rego' },
          { flag: '🇪🇸', position: 'Ministre Drets Socials, Consum i Agenda 2030', name: 'Pablo Bustinduy' },
        ],
      },
      {
        title: 'Alts càrrecs institucionals',
        icon: '⚖️',
        entries: [
          { flag: '👑', position: 'Rei d\'Espanya', name: 'Felip VI' },
          { flag: '🏛️', position: 'Presidenta del Congrés', name: 'Francina Armengol' },
          { flag: '🏛️', position: 'President del Senat', name: 'Pedro Rollán' },
          { flag: '⚖️', position: 'Fiscal General de l\'Estat', name: 'Álvaro García Ortiz' },
          { flag: '⚖️', position: 'Presidenta CGPJ i Tribunal Suprem', name: 'Isabel Perelló Doménech' },
          { flag: '⚖️', position: 'President del Tribunal Constitucional', name: 'Cándido Conde-Pumpido' },
          { flag: '💵', position: 'Governador del Banc d\'Espanya', name: 'José Luis Escrivá', detail: 'Des de setembre 2024', recent: true },
          { flag: '🛡️', position: 'Defensor del Poble', name: 'Ángel Gabilondo' },
          { flag: '🚨', position: 'Director General Protecció Civil', name: 'Leonardo Marcos' },
        ],
      },
      {
        title: 'Forces i Cossos de Seguretat de l\'Estat (FCSE)',
        icon: '👮',
        entries: [
          // ── GUÀRDIA CIVIL ────────────────────────────────────────────
          { flag: '🚓', position: 'Directora General de la Guàrdia Civil', name: 'Mercedes González Fernández', detail: 'Des de novembre 2023 · càrrec polític designat pel Govern' },
          { flag: '🎖️', position: 'Director Adjunt Operatiu (DAO) GC', name: 'Pedro Vázquez Jarava', detail: 'Tinent General · màxim càrrec operatiu professional del cos' },
          { flag: '🎖️', position: 'Cap d\'Estat Major (JEME) GC', name: 'Antonio Sierras Pérez', detail: 'Tinent General · planificació, doctrina i operacions' },
          { flag: '🚦', position: 'Cap Agrupación de Tráfico (ATGC)', name: 'Cristóbal Cremades García-Calvo', detail: 'Coronel · controls de via interurbana, accidents, BAC' },
          { flag: '🌳', position: 'Cap del SEPRONA', name: 'Designat pel cos', detail: 'Servei de Protecció de la Natura · medi ambient, fauna, residus' },

          // ── POLICIA NACIONAL (CNP) ────────────────────────────────────
          { flag: '👮', position: 'Director General de la Policia Nacional', name: 'Francisco Pardo Piqueras', detail: 'Càrrec polític · designat pel Govern' },
          { flag: '🎖️', position: 'Director Adjunt Operatiu (DAO) CNP', name: 'Manuel Soriano Aladrén', detail: 'Comissari Principal · màxim càrrec operatiu' },
          { flag: '🕵️', position: 'Comissari General d\'Informació', name: 'Eugenio Pereiro Blanco', detail: 'CGI · antiterrorisme i amenaces internes' },
          { flag: '🚔', position: 'Comissari General de Seguretat Ciutadana', name: 'Juan Carlos Castro Estévez', detail: 'Ordre públic, manifestacions, UIP' },
          { flag: '🔍', position: 'Comissari General de Policia Judicial', name: 'María Olga Martín-Loeches Rodríguez', detail: 'Investigació criminal · UDEV, UDYCO' },
          { flag: '🛂', position: 'Comissari General d\'Estrangeria i Fronteres', name: 'Antonio López López', detail: 'CGEF · CIE, expulsions, control fronterer' },
        ],
      },
      {
        title: 'Presidents de Comunitats Autònomes',
        icon: '🗺️',
        compact: true,
        entries: [
          { flag: '🟥', position: 'Catalunya', name: 'Salvador Illa Roca', detail: '133è · des d\'agost 2024' },
          { flag: '🟥', position: 'Madrid', name: 'Isabel Díaz Ayuso' },
          { flag: '🟩', position: 'Andalusia', name: 'Juan Manuel Moreno Bonilla' },
          { flag: '🟦', position: 'Comunitat Valenciana', name: 'Carlos Mazón' },
          { flag: '🟦', position: 'Galícia', name: 'Alfonso Rueda Valenzuela' },
          { flag: '🟥', position: 'País Basc', name: 'Imanol Pradales' },
          { flag: '🟪', position: 'Castella i Lleó', name: 'Alfonso Fernández Mañueco' },
          { flag: '🟫', position: 'Castella - la Manxa', name: 'Emiliano García-Page Sánchez' },
          { flag: '🟨', position: 'Aragó', name: 'Jorge Azcón' },
          { flag: '🟦', position: 'Astúries', name: 'Adrián Barbón Rodríguez' },
          { flag: '🟧', position: 'Múrcia', name: 'Fernando López Miras' },
          { flag: '🟥', position: 'Cantàbria', name: 'María José Sáenz de Buruaga' },
          { flag: '🟩', position: 'Extremadura', name: 'María Guardiola Martín' },
          { flag: '🟥', position: 'La Rioja', name: 'Gonzalo Capellán' },
          { flag: '🟥', position: 'Navarra', name: 'María Chivite Navascués' },
          { flag: '🟦', position: 'Illes Balears', name: 'Marga Prohens' },
          { flag: '🟨', position: 'Canàries', name: 'Fernando Clavijo' },
          { flag: '🟥', position: 'Ceuta', name: 'Juan Jesús Vivas' },
          { flag: '🟧', position: 'Melilla', name: 'Juan José Imbroda' },
        ],
      },
    ],
  },

  {
    id: 'catalunya',
    title: 'Govern de Catalunya (XV Legislatura)',
    shortLabel: 'Catalunya',
    icon: '🏛️',
    accent: 'from-red-500 to-amber-600',
    subsections: [
      {
        title: 'Consell Executiu',
        icon: '🏛️',
        entries: [
          { flag: '🟥', position: 'President de la Generalitat (133è)', name: 'Salvador Illa Roca' },
          { flag: '🟥', position: 'Conseller de Presidència', name: 'Albert Dalmau' },
          { flag: '🟥', position: 'Consellera d\'Economia i Finances', name: 'Alícia Romero' },
          { flag: '🟥', position: 'Consellera d\'Interior i Seguretat Pública', name: 'Núria Parlon Gil' },
          { flag: '🟥', position: 'Conseller de Justícia i Qualitat Democràtica', name: 'Ramon Espadaler' },
          { flag: '🟥', position: 'Consellera de Territori, Habitatge i Transició Ecològica i Portaveu', name: 'Sílvia Paneque' },
          { flag: '🟥', position: 'Consellera de Salut', name: 'Olga Pané' },
          { flag: '🟥', position: 'Consellera d\'Educació i FP', name: 'Esther Niubó' },
          { flag: '🟥', position: 'Consellera de Drets Socials i Inclusió', name: 'Mònica Martínez Bravo' },
          { flag: '🟥', position: 'Conseller d\'Empresa i Treball', name: 'Miquel Sàmper' },
          { flag: '🟥', position: 'Consellera d\'Igualtat i Feminisme', name: 'Eva Menor' },
          { flag: '🟥', position: 'Conseller d\'Acció Exterior i UE', name: 'Jaume Duch' },
          { flag: '🟥', position: 'Conseller d\'Esports', name: 'Berni Álvarez' },
          { flag: '🟥', position: 'Consellera de Cultura', name: 'Sònia Hernández Almodóvar' },
          { flag: '🟥', position: 'Conseller d\'Agricultura, Ramaderia i Pesca', name: 'Òscar Ordeig' },
          { flag: '🟥', position: 'Consellera d\'Universitats', name: 'Núria Montserrat Pulido' },
          { flag: '🟥', position: 'Conseller de Política Lingüística', name: 'Francesc Xavier Vila' },
        ],
      },
      {
        title: 'Alts càrrecs institucionals catalans',
        icon: '🎖️',
        entries: [
          { flag: '🏛️', position: 'President del Parlament de Catalunya', name: 'Josep Rull' },
          { flag: '🏛️', position: 'Vicepresidenta del Parlament', name: 'Alba Vergés Bosch' },
          { flag: '🛡️', position: 'Síndica de Greuges de Catalunya', name: 'Esther Giménez-Salinas' },
          { flag: '🛡️', position: 'Síndic de Barcelona', name: 'David Bondia' },
          { flag: '🏙️', position: 'Alcalde de Barcelona', name: 'Jaume Collboni' },
          { flag: '👮', position: 'Director General Mossos d\'Esquadra', name: 'Josep Lluís Trapero', detail: 'Des d\'agost 2024' },
          { flag: '👮', position: 'Comissari en Cap dels Mossos', name: 'Miquel Esquius', detail: 'Es jubila agost 2026' },
          { flag: '👮', position: 'Sots-cap executiva dels Mossos', name: 'Alícia Moriana' },
          { flag: '⚖️', position: 'Presidenta TSJC', name: 'Mercè Caso', detail: 'Substitueix Barrientos', recent: true },
          { flag: '🚨', position: 'Directora Protecció Civil de Catalunya', name: 'Marta Cassany Virgili' },
          { flag: '🚒', position: 'Director General Prevenció i Extinció d\'Incendis', name: 'Joan Delort' },
          { flag: '🇪🇸', position: 'Delegat Govern Espanyol a Catalunya', name: 'Carlos Prieto' },
          { flag: '🎗️', position: 'President d\'Òmnium Cultural', name: 'Xavier Antich', detail: 'Des de 2022 (substitueix Cuixart)', recent: true },
          { flag: '🎗️', position: 'President de l\'ANC', name: 'Lluís Llach', detail: 'Des de 2025' },
        ],
      },
    ],
  },
];
