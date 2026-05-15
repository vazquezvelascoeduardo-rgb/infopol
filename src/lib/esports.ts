// Directori d'esports — recopilació d'esdeveniments esportius rellevants
// agrupats per mes. Mateixa estructura que personalitats.ts: seccions
// amb subseccions i entrades, navegació ràpida al cim.
//
// Reutilitzem el mateix shape que LeaderSection per poder compartir el
// component SectionView del UI.

export type SportEntry = {
  /** Competició / etapa (ex. "MUNDIAL 2025 · FINAL"). */
  position: string;
  /** Resultat principal (ex. "Marc Márquez · 7è títol MotoGP"). */
  name: string;
  /** Context, marcador, dates, dades secundàries. */
  detail?: string;
  /** Bandera (emoji) — país del guanyador o icona de l'esdeveniment. */
  flag?: string;
  /** Marca com a fita històrica destacada. */
  recent?: boolean;
};

export type SportSubsection = {
  /** Esport (ex. "MotoGP", "Tennis", "Futbol"). */
  title?: string;
  /** Icona del subgrup (mostrada al costat del títol). */
  icon?: string;
  /** Si és true, renderitza les entrades en grid 2 col a sm+. */
  compact?: boolean;
  entries: SportEntry[];
};

export type SportSection = {
  id: string;
  title: string;
  /** Etiqueta breu per a la nav ràpida (ex: "Maig '26"). */
  shortLabel: string;
  icon: string;
  /** Gradient Tailwind per a la capçalera. */
  accent: string;
  subsections: SportSubsection[];
};

export const ESPORTS_UPDATED_AT = '2026-05-15';

export const ESPORTS: SportSection[] = [
  {
    id: 'maig-2026',
    title: 'Maig 2026',
    shortLabel: "Mai '26",
    icon: '📅',
    accent: 'from-emerald-500 to-teal-700',
    subsections: [
      {
        title: 'Futbol',
        icon: '⚽',
        entries: [
          {
            flag: '🇫🇷',
            position: 'UEFA CHAMPIONS LEAGUE · SEMIFINALS DISPUTADES 5-6 MAIG',
            name: 'PSG i Arsenal a la final del 30 maig (Puskás Aréna, Budapest)',
            detail: "Arsenal 1-0 Atlético de Madrid (2-1 global) el 5/5 — primera final europea de l'Arsenal des de 2006. Bayern 1-1 PSG el 6/5 (5-6 global) — PSG, campió defensor, repeteix final.",
            recent: true,
          },
          {
            flag: '🇪🇸',
            position: 'CHAMPIONS LEAGUE FEMENINA · SEMIFINAL TORNADA 3 MAIG · CAMP NOU',
            name: 'FC Barcelona 4-2 Bayern Munich (5-3 global) — 6a final consecutiva (rècord absolut)',
            detail: 'Gols: Paralluelo (13′), Putellas (21′ i 58′) i Pajor (54′). El Barça disputarà la final del 23 maig a Ullevaal Stadion (Oslo) contra OL Lyonnes. Trenca el rècord de 5 finals consecutives que compartia amb Lyon.',
            recent: true,
          },
          {
            flag: '🇪🇸',
            position: 'LALIGA EA SPORTS · FINAL DE TEMPORADA 24 MAIG',
            name: 'Lluita Barça vs Madrid pel títol fins l\'última jornada',
            detail: 'F.C. Barcelona líder i vigent campió; Real Madrid persegueix.',
          },
        ],
      },
      {
        title: 'Tennis',
        icon: '🎾',
        entries: [
          {
            flag: '🇮🇹',
            position: 'MUTUA MADRID OPEN · FINAL 3 MAIG',
            name: 'Jannik Sinner derrota Zverev 6-1, 6-2 — RÈCORD HISTÒRIC',
            detail: '1r tenista a guanyar 5 Masters 1000 consecutius. Sinner no afronta cap pilota de break en tot el torneig i guanya el 93% dels punts amb el primer servei. 9a victòria consecutiva sobre Zverev.',
            recent: true,
          },
          {
            flag: '🇫🇷',
            position: 'ROLAND GARROS · 18 MAIG - 7 JUNY',
            name: '2n Grand Slam de la temporada · Alcaraz fora per lesió al canell',
            detail: 'Carlos Alcaraz (bicampió defensor) renuncia per lesió al canell dret — també es perd Roma. Sinner gran favorit absolut. Ben Shelton ocupa el 2n cap de sèrie. Lorenzo Musetti també causa baixa.',
            recent: true,
          },
        ],
      },
      {
        title: 'Bàsquet',
        icon: '🏀',
        entries: [
          {
            flag: '🇬🇷',
            position: 'EUROLLIGA · FINAL FOUR 22-24 MAIG · ATENES',
            name: 'Semifinals: Olympiacos-Fenerbahçe i Real Madrid-Valencia Basket',
            detail: 'Telekom Center Athens. 22 maig 18:00: Olympiacos (local) vs Fenerbahçe Beko. 22 maig 21:00: Real Madrid vs Valencia Basket (final 100% espanyola possible). Primera edició sense partit pel 3r lloc.',
            recent: true,
          },
        ],
      },
      {
        title: 'Ciclisme',
        icon: '🚴',
        entries: [
          {
            flag: '🇩🇰',
            position: "GIRO D'ITÀLIA · 109a EDICIÓ · 8-31 MAIG · 7 ETAPES DISPUTADES",
            name: 'Jonas Vingegaard (Visma | Lease a Bike) líder amb maglia rosa',
            detail: "Vingegaard guanya l'etapa 7 (arribada Blockhaus) i pren el lideratge. Etapes prèvies: Paul Magnier (1ª i 3ª), Guillermo Thomas Silva (2ª, fotofinish a Veliko Tarnovo), Jhonatan Narváez (4ª a Cosenza), Igor Arrieta (5ª a Potenza), Davide Ballerini (6ª). Arribada final a Roma el 31 maig.",
            recent: true,
          },
        ],
      },
    ],
  },

  {
    id: 'abril-2026',
    title: 'Abril 2026',
    shortLabel: "Abr '26",
    icon: '📅',
    accent: 'from-amber-500 to-orange-600',
    subsections: [
      {
        title: 'Futbol',
        icon: '⚽',
        entries: [
          {
            flag: '🇪🇸',
            position: 'COPA DEL REI 2025-26 · FINAL 18 ABRIL · LA CARTUJA (SEVILLA)',
            name: 'Real Sociedad campiona — 4-3 als penals davant l\'Atlético de Madrid',
            detail: '2-2 al temps reglamentari. 3r títol de Copa per a la Real Sociedad. Gols: Barrenetxea (1\'), Lookman (18\'), Oyarzabal (45+1\', p.) i Julián Álvarez (83\').',
            recent: true,
          },
          {
            flag: '🇫🇷',
            position: 'CHAMPIONS LEAGUE 2025-26 · QUARTS DE FINAL (7-15 ABRIL)',
            name: 'PSG, Bayern, Arsenal i Atlético a semifinals',
            detail: 'Atlético de Madrid elimina F.C. Barcelona (3-2 global). PSG (campió defensor) elimina Liverpool (4-0). Arsenal elimina Sporting CP (1-0). Bayern de Múnich elimina Real Madrid (6-4). Semifinals: PSG vs Bayern · Arsenal vs Atlético de Madrid.',
          },
        ],
      },
      {
        title: 'Bàsquet',
        icon: '🏀',
        entries: [
          {
            flag: '🇬🇷',
            position: 'EUROLLIGA 2025-26 · PLAYOFFS 28 ABRIL',
            name: 'Vezenkov MVP de la temporada',
            detail: 'Sasha Vezenkov (Olympiacos) escollit MVP el 26 abril. Valencia Basket (subcampió fase regular) i Real Madrid representen Espanya als quarts. Barcelona eliminat al play-in davant Mònaco.',
          },
        ],
      },
      {
        title: 'Tennis',
        icon: '🎾',
        entries: [
          {
            flag: '🇪🇸',
            position: 'MUTUA MADRID OPEN 2026 · OBERTURA 22 ABRIL',
            name: 'Alcaraz absent per lesió',
            detail: 'Caja Mágica de Madrid. Alcaraz es perd la gira de terra batuda. Casper Ruud (vigent campió) cau a quarts davant la revelació Alexander Blockx (Bèlgica).',
          },
        ],
      },
    ],
  },

  {
    id: 'marc-2026',
    title: 'Març 2026',
    shortLabel: "Mar '26",
    icon: '📅',
    accent: 'from-rose-500 to-orange-600',
    subsections: [
      {
        title: 'Tennis',
        icon: '🎾',
        entries: [
          {
            flag: '🇮🇹',
            position: 'INDIAN WELLS 2026 · FINAL 15 MARÇ',
            name: 'Jannik Sinner campió davant Daniil Medvedev (7-6 8-6, 7-6 7-4)',
            detail: '3r home de la història (i el més jove) en guanyar els 6 ATP 1000 de pista dura, després de Federer i Djokovic. Femení: Aryna Sabalenka guanya el seu primer Indian Wells (3-6, 6-3, 7-6) davant Rybakina, vengent-se de la final d\'Austràlia.',
            recent: true,
          },
          {
            flag: '🇮🇹',
            position: 'MASTERS 1000 MIAMI · FINAL 29 MARÇ',
            name: 'Sinner completa el Sunshine Double (6-4, 6-4 davant Lehečka)',
            detail: 'Primer home a aconseguir-ho sense cedir cap set. Primer Sunshine Double masculí des de Federer 2017. Femení: Sabalenka revalida el títol davant Coco Gauff (6-2, 4-6, 6-3), completant també el Sunshine Double · 10è títol WTA 1000.',
            recent: true,
          },
        ],
      },
      {
        title: 'Rugbi',
        icon: '🏉',
        entries: [
          {
            flag: '🇫🇷',
            position: 'VI NACIONS 2026 · ÚLTIMA JORNADA 14 MARÇ',
            name: 'França revalida el títol per 2n any consecutiu',
            detail: 'França venç Anglaterra 48-46 al Stade de France amb un cop de càstig al darrer minut, executat per Thomas Ramos (màxim anotador del torneig). Louis Bielle-Biarrey (França) Jugador del Campionat amb 9 assajos (rècord en una sola edició).',
          },
        ],
      },
      {
        title: 'Ciclisme',
        icon: '🚴',
        entries: [
          {
            flag: '🇩🇰',
            position: 'VOLTA A CATALUNYA · 105a EDICIÓ · 23-29 MARÇ',
            name: 'Jonas Vingegaard guanya la general (Visma | Lease a Bike)',
            detail: 'Sortida a Sant Feliu de Guíxols, arribada a Barcelona. 2 victòries d\'etapa (La Molina/Coll de Pal i Queralt). Podi: Lenny Martinez (Bahrain Victorious) 2n; Florian Lipowitz (Red Bull-BORA-hansgrohe) 3r.',
          },
        ],
      },
    ],
  },

  {
    id: 'febrer-2026',
    title: 'Febrer 2026',
    shortLabel: "Feb '26",
    icon: '📅',
    accent: 'from-cyan-500 to-blue-700',
    subsections: [
      {
        title: 'Jocs Olímpics d\'Hivern',
        icon: '❄️',
        entries: [
          {
            flag: '🇮🇹',
            position: 'JJOO HIVERN MILANO-CORTINA 2026 · 6-22 FEBRER',
            name: 'Edició més exitosa de la història per a Espanya',
            detail: 'Tres medalles per a Espanya gràcies al debut olímpic de l\'esquí de muntanya en 48 hores.',
            recent: true,
          },
          {
            flag: '🥇',
            position: 'OR · ESQUÍ DE MUNTANYA · ESPRINT MASCULÍ',
            name: 'Oriol Cardona (Catalunya)',
            detail: '1r or espanyol als Jocs d\'Hivern des de Paquito Fernández Ochoa a Sapporo 1972 — 54 anys d\'espera.',
            recent: true,
          },
          {
            flag: '🥉',
            position: 'BRONZE · ESQUÍ DE MUNTANYA · ESPRINT FEMENÍ',
            name: 'Ana Alonso',
            detail: 'Només 4 mesos després de patir un atropellament.',
          },
          {
            flag: '🥉',
            position: 'BRONZE · ESQUÍ DE MUNTANYA · RELLEU MIXT',
            name: 'Cardona i Alonso',
            detail: '1rs esportistes espanyols amb més d\'una medalla en uns Jocs d\'Hivern.',
            recent: true,
          },
        ],
      },
      {
        title: 'NFL',
        icon: '🏈',
        entries: [
          {
            flag: '🇺🇸',
            position: 'SUPER BOWL LX · 8 FEBRER · LEVI\'S STADIUM',
            name: 'Seattle Seahawks 29 — 13 New England Patriots',
            detail: 'Santa Clara, Califòrnia. 2n títol Super Bowl per als Seahawks (1r el 2014). Kenneth Walker III (135 iardes terrestres) MVP. Bad Bunny encapçala el show de mig temps — primer artista llatí en solitari.',
            recent: true,
          },
        ],
      },
      {
        title: 'Handbol',
        icon: '🤾',
        entries: [
          {
            flag: '🇩🇰',
            position: 'EUROPEU MASCULÍ · FINAL 1 FEBRER',
            name: 'Dinamarca campió per primer cop (34-27 davant Alemanya)',
            detail: 'Mathias Gidsel (Dinamarca) MVP del campionat. Disputat a Dinamarca, Suècia i Noruega del 15/01 al 1/02.',
            recent: true,
          },
        ],
      },
    ],
  },

  {
    id: 'gener-2026',
    title: 'Gener 2026',
    shortLabel: "Gen '26",
    icon: '📅',
    accent: 'from-purple-500 to-violet-700',
    subsections: [
      {
        title: 'Dakar',
        icon: '🏁',
        entries: [
          {
            flag: '🇶🇦',
            position: 'DAKAR 2026 · 48a EDICIÓ · COTXES (ULTIMATE)',
            name: 'Nasser Al-Attiyah guanya — 6è Dakar de la seva carrera',
            detail: 'Dacia Sandrider — 1r triomf històric per a Dacia. Carlos Sainz acaba 5è; Nani Roma 2n; Cristina Gutiérrez 11a.',
            recent: true,
          },
          {
            flag: '🇦🇷',
            position: 'DAKAR 2026 · MOTOS',
            name: 'Luciano Benavides guanya per només 2 segons sobre Ricky Brabec',
            detail: 'Una de les arribades més ajustades de la història del Dakar en motos.',
            recent: true,
          },
          {
            flag: '🇪🇸',
            position: 'DAKAR 2026 · CHALLENGER',
            name: 'Pau Navarro — 1r triomf espanyol del Dakar 2026',
            detail: 'Categoria Challenger.',
          },
        ],
      },
      {
        title: 'Futbol',
        icon: '⚽',
        entries: [
          {
            flag: '🇪🇸',
            position: 'SUPERCOPA D\'ESPANYA 2026 · FINAL 11 GENER',
            name: 'F.C. Barcelona 3-2 Real Madrid · 16è títol (rècord)',
            detail: 'King Saud University Stadium (Yeda, Aràbia Saudita). Revaliden el de 2025. Gols: Raphinha (2) i Lewandowski; Vinícius Jr. i Gonzalo García pel Madrid. Raphinha MVP.',
            recent: true,
          },
        ],
      },
      {
        title: 'Tennis',
        icon: '🎾',
        entries: [
          {
            flag: '🇪🇸',
            position: 'OPEN D\'AUSTRÀLIA 2026 · FINAL MASCULINA 1 FEBRER',
            name: 'Carlos Alcaraz fa HISTÒRIA — Career Grand Slam als 22 anys',
            detail: 'Remunta Djokovic 2-6, 6-2, 6-3, 7-5. 7è Grand Slam. Tenista més jove en completar el Career Grand Slam (22 anys, 8 mesos i 27 dies). Trenca la ratxa de 10 victòries consecutives de Djokovic en finals d\'Austràlia.',
            recent: true,
          },
          {
            flag: '🇰🇿',
            position: 'OPEN D\'AUSTRÀLIA 2026 · FINAL FEMENINA',
            name: 'Elena Rybakina derrota Aryna Sabalenka (6-4, 4-6, 6-4)',
            detail: '2n Grand Slam de la seva carrera després de Wimbledon 2022.',
          },
        ],
      },
      {
        title: 'Handbol',
        icon: '🤾',
        entries: [
          {
            flag: '🇩🇰',
            position: 'EUROPEU MASCULÍ 2026 · 15 GENER - 1 FEBRER',
            name: 'Disputat a Dinamarca, Suècia i Noruega',
            detail: 'Final del torneig disputada l\'1 de febrer (vegeu secció Febrer). Dinamarca s\'imposa a Alemanya 34-27.',
          },
        ],
      },
    ],
  },

  {
    id: 'desembre-2025',
    title: 'Desembre 2025',
    shortLabel: "Des '25",
    icon: '📅',
    accent: 'from-blue-500 to-indigo-700',
    subsections: [
      {
        title: 'Futbol',
        icon: '⚽',
        entries: [
          {
            flag: '🇪🇸',
            position: 'NATIONS LEAGUE FEMENINA · FINAL',
            name: 'Espanya revalida el títol — 3-0 global davant Alemanya',
            detail: '0-0 a l\'anada a Kaiserslautern; 3-0 a la tornada al Riyadh Air Metropolitano de Madrid (gairebé 56.000 espectadors). Gols: Claudia Pina (2) i Vicky López. Segon títol Nations League per a la selecció dirigida per Sonia Bermúdez.',
            recent: true,
          },
        ],
      },
      {
        title: 'Formula 1',
        icon: '🏎️',
        entries: [
          {
            flag: '🇬🇧',
            position: 'MUNDIAL F1 2025 · GP ABU DHABI · 7 DESEMBRE',
            name: 'Lando Norris campió del món — 1r títol mundial',
            detail: '423 punts · només 2 punts per davant de Max Verstappen (que guanya la cursa) i 13 sobre Oscar Piastri. 11è britànic campió del món, trenca la ratxa de 4 títols consecutius de Verstappen. McLaren conquereix el seu 1r títol de pilots des de 2008.',
            recent: true,
          },
        ],
      },
      {
        title: 'Handbol',
        icon: '🤾',
        entries: [
          {
            flag: '🇳🇴',
            position: 'MUNDIAL FEMENÍ 2025 · FINAL 14 DESEMBRE · ROTTERDAM',
            name: 'Noruega campiona del món (23-20 davant Alemanya)',
            detail: '5è Mundial per a Noruega. Henny Reistad (Noruega) MVP del torneig. França bronze. Espanya queda fora a la Main Round.',
            recent: true,
          },
        ],
      },
    ],
  },

  {
    id: 'novembre-2025',
    title: 'Novembre 2025',
    shortLabel: "Nov '25",
    icon: '📅',
    accent: 'from-slate-500 to-slate-700',
    subsections: [
      {
        title: 'MotoGP',
        icon: '🏍️',
        entries: [
          {
            flag: '🇪🇸',
            position: 'MUNDIAL MOTOGP 2025 · FINAL VALÈNCIA',
            name: 'Marc Márquez campió del món — 7è títol MotoGP, 9è total',
            detail: 'Ducati Lenovo Team. Iguala Valentino Rossi en títols totals. Es va proclamar campió matemàticament al GP del Japó al setembre i no va participar a la cursa final per lesió.',
            recent: true,
          },
          {
            flag: '🇮🇹',
            position: 'GP VALÈNCIA · 16 NOVEMBRE',
            name: 'Marco Bezzecchi (Aprilia) guanya l\'última cursa al Circuit Ricardo Tormo',
            detail: 'Álex Márquez subcampió del món. Ducati Team s\'enduu el títol per equips per 4t any consecutiu.',
          },
        ],
      },
      {
        title: 'Tennis',
        icon: '🎾',
        entries: [
          {
            flag: '🇮🇹',
            position: 'ATP FINALS 2025 · FINAL 16 NOVEMBRE · TORÍ',
            name: 'Sinner revalida el títol — 7-6(4) i 7-5 davant Alcaraz',
            detail: 'Davant del públic italià, Sinner repeteix el triomf de l\'edició anterior. Alcaraz acaba l\'any com a número 1 del món malgrat la derrota a la final.',
            recent: true,
          },
          {
            flag: '🇮🇹',
            position: 'COPA DAVIS 2025 · FINAL · BOLONYA',
            name: 'Itàlia 4t títol — 3r consecutiu (gesta inèdita en més de 50 anys)',
            detail: 'Itàlia derrota Espanya 2-0 (sense Sinner ni Musetti per Itàlia, ni Alcaraz per Espanya). Matteo Berrettini guanya Pablo Carreño i Flavio Cobolli remunta Jaume Munar.',
            recent: true,
          },
        ],
      },
      {
        title: 'Handbol',
        icon: '🤾',
        entries: [
          {
            flag: '🇩🇪',
            position: 'MUNDIAL FEMENÍ 2025 · OBERTURA 27 NOVEMBRE',
            name: 'Comença el 27è Mundial — organitzat per Alemanya i Països Baixos',
            detail: '32 seleccions. Final el 14 de desembre (vegeu secció Desembre — Noruega campiona).',
          },
        ],
      },
    ],
  },
];
