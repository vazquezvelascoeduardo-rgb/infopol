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

export const ESPORTS_UPDATED_AT = '2026-09-14';

// Generat per scripts/directoris/publica.mjs a partir de dades.mjs.
// No ho editis a mà: canvia dades.mjs i torna'l a executar.
export const ESPORTS: SportSection[] = [
  {
    "id": "futbol-seleccions",
    "title": "Futbol: seleccions",
    "shortLabel": "Seleccions",
    "icon": "🌍",
    "accent": "from-red-500 to-yellow-500",
    "subsections": [
      {
        "title": "Mundial 2026 (EUA, Mèxic i Canadà)",
        "icon": "🏆",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Campiona del món",
            "name": "Espanya",
            "detail": "1-0 a l'Argentina a la pròrroga, el 19 de juliol a Nova York-Nova Jersey · gol de Ferran Torres al minut 106 · segon Mundial després del de 2010",
            "recent": true
          },
          {
            "flag": "🇪🇸",
            "position": "Seleccionador",
            "name": "Luis de la Fuente"
          },
          {
            "flag": "🇪🇸",
            "position": "Pilota d'Or del torneig",
            "name": "Rodri",
            "detail": "Plata: Leo Messi · bronze: Kylian Mbappé"
          },
          {
            "flag": "🇫🇷",
            "position": "Bota d'Or (màxim golejador)",
            "name": "Kylian Mbappé",
            "detail": "10 gols · l'únic jugador que l'ha guanyada dues vegades"
          },
          {
            "flag": "🇪🇸",
            "position": "Guant d'Or (millor porter)",
            "name": "Unai Simón",
            "detail": "Espanya només va encaixar un gol en set partits"
          },
          {
            "flag": "🇪🇸",
            "position": "Millor jugador jove",
            "name": "Pau Cubarsí"
          },
          {
            "flag": "🌍",
            "position": "Novetats del torneig",
            "name": "48 seleccions i tres països organitzadors",
            "detail": "El primer Mundial amb aquest format"
          }
        ]
      },
      {
        "title": "Altres competicions",
        "icon": "🥇",
        "entries": [
          {
            "flag": "🏴",
            "position": "Eurocopa femenina 2025",
            "name": "Anglaterra",
            "detail": "Guanya Espanya als penals (3-1) després de l'1-1, a Basilea · Espanya, subcampiona"
          },
          {
            "flag": "🇵🇹",
            "position": "Lliga de Nacions 2025",
            "name": "Portugal",
            "detail": "Guanya Espanya a la final als penals"
          }
        ]
      }
    ]
  },
  {
    "id": "futbol-clubs",
    "title": "Futbol: clubs",
    "shortLabel": "Clubs",
    "icon": "⚽",
    "accent": "from-blue-600 to-indigo-800",
    "subsections": [
      {
        "title": "Competicions europees i mundials 2025-26",
        "icon": "🏆",
        "entries": [
          {
            "flag": "🇫🇷",
            "position": "Champions League",
            "name": "Paris Saint-Germain",
            "detail": "1-1 contra l'Arsenal i 4-3 als penals, a Budapest el 30 de maig · revalida el títol"
          },
          {
            "flag": "🏴",
            "position": "Europa League",
            "name": "Aston Villa",
            "detail": "3-0 al Friburg a Istanbul · el seu primer títol en aquesta competició"
          },
          {
            "flag": "🏴",
            "position": "Conference League",
            "name": "Crystal Palace",
            "detail": "1-0 al Rayo Vallecano a Leipzig"
          },
          {
            "flag": "🇫🇷",
            "position": "Supercopa d'Europa 2026",
            "name": "Paris Saint-Germain",
            "detail": "2-1 a l'Aston Villa a Salzburg, el 12 d'agost",
            "recent": true
          },
          {
            "flag": "🇫🇷",
            "position": "Copa Intercontinental 2025",
            "name": "Paris Saint-Germain",
            "detail": "Guanya el Flamengo als penals després de l'1-1"
          },
          {
            "flag": "🏴",
            "position": "Mundial de Clubs 2025",
            "name": "Chelsea",
            "detail": "3-0 al PSG a la final"
          },
          {
            "flag": "🇪🇸",
            "position": "Champions femenina",
            "name": "FC Barcelona",
            "detail": "4-0 a l'OL Lyonnes a Oslo · el seu quart títol"
          }
        ]
      },
      {
        "title": "Lligues i copes 2025-26",
        "icon": "🇪🇸",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "LaLiga",
            "name": "FC Barcelona",
            "detail": "Segona lliga seguida"
          },
          {
            "flag": "🇪🇸",
            "position": "Copa del Rei",
            "name": "Reial Societat",
            "detail": "2-2 amb l'Atlètic de Madrid i 4-3 als penals, a La Cartuja el 18 d'abril · la seva quarta Copa"
          },
          {
            "flag": "🇪🇸",
            "position": "Supercopa d'Espanya 2026",
            "name": "FC Barcelona",
            "detail": "3-2 al Reial Madrid a Jiddah · la seva 16a Supercopa"
          },
          {
            "flag": "🇪🇸",
            "position": "Liga F",
            "name": "FC Barcelona",
            "detail": "Setena seguida"
          },
          {
            "flag": "🏴",
            "position": "Premier League",
            "name": "Arsenal",
            "detail": "La primera en 22 anys"
          },
          {
            "flag": "🇮🇹",
            "position": "Serie A",
            "name": "Inter de Milà",
            "detail": "El seu 21è scudetto"
          },
          {
            "flag": "🇩🇪",
            "position": "Bundesliga",
            "name": "Bayern de Munic"
          },
          {
            "flag": "🇫🇷",
            "position": "Ligue 1",
            "name": "Paris Saint-Germain",
            "detail": "Cinquena seguida"
          }
        ]
      },
      {
        "title": "Dirigents",
        "icon": "👔",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "President del FC Barcelona",
            "name": "Joan Laporta",
            "detail": "Reelegit el 15 de març de 2026 amb el 68 % dels vots, davant de Víctor Font"
          },
          {
            "flag": "🇪🇸",
            "position": "President del Reial Madrid",
            "name": "Florentino Pérez"
          },
          {
            "flag": "🇪🇸",
            "position": "President de la RFEF",
            "name": "Rafael Louzán"
          },
          {
            "flag": "🇪🇸",
            "position": "President de LaLiga",
            "name": "Javier Tebas"
          },
          {
            "flag": "🌍",
            "position": "President de la FIFA",
            "name": "Gianni Infantino"
          },
          {
            "flag": "🇪🇺",
            "position": "President de la UEFA",
            "name": "Aleksander Čeferin"
          },
          {
            "flag": "🇪🇸",
            "position": "President del Comitè Olímpic Espanyol",
            "name": "Alejandro Blanco"
          }
        ]
      }
    ]
  },
  {
    "id": "tennis",
    "title": "Tennis",
    "shortLabel": "Tennis",
    "icon": "🎾",
    "accent": "from-lime-500 to-green-700",
    "subsections": [
      {
        "title": "Grand Slams 2026",
        "icon": "🏆",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Open d'Austràlia · masculí",
            "name": "Carlos Alcaraz",
            "detail": "Guanya Novak Djokovic (2-6, 6-2, 6-3, 7-5) i completa el Grand Slam de carrera"
          },
          {
            "flag": "🇰🇿",
            "position": "Open d'Austràlia · femení",
            "name": "Elena Rybakina",
            "detail": "Guanya Aryna Sabalenka (6-4, 4-6, 6-4)"
          },
          {
            "flag": "🇩🇪",
            "position": "Roland Garros · masculí",
            "name": "Alexander Zverev",
            "detail": "Guanya Flavio Cobolli (7-6, 6-4, 6-3) · el seu primer Grand Slam"
          },
          {
            "flag": "🇷🇺",
            "position": "Roland Garros · femení",
            "name": "Mirra Andreeva",
            "detail": "Guanya Maja Chwalińska (6-3, 6-2) · primer Grand Slam, amb 19 anys"
          },
          {
            "flag": "🇮🇹",
            "position": "Wimbledon · masculí",
            "name": "Jannik Sinner",
            "detail": "Guanya Zverev (6-7, 7-6, 6-3, 6-4) · segon Wimbledon seguit"
          },
          {
            "flag": "🇨🇿",
            "position": "Wimbledon · femení",
            "name": "Linda Nosková",
            "detail": "Guanya Karolína Muchová en una final txeca"
          },
          {
            "flag": "🇩🇪",
            "position": "US Open · masculí",
            "name": "Alexander Zverev",
            "detail": "Guanya Ben Shelton (6-3, 7-6, 5-7, 6-2) el 13 de setembre · el seu segon Grand Slam de l'any",
            "recent": true
          },
          {
            "flag": "🇰🇿",
            "position": "US Open · femení",
            "name": "Elena Rybakina",
            "detail": "Guanya Sabalenka (6-4, 5-7, 6-2)",
            "recent": true
          }
        ]
      },
      {
        "title": "Altres",
        "icon": "🎾",
        "entries": [
          {
            "flag": "🇮🇹",
            "position": "Copa Davis 2025",
            "name": "Itàlia",
            "detail": "Guanya Espanya a la final · tercera seguida"
          },
          {
            "flag": "🇮🇹",
            "position": "ATP Finals 2025",
            "name": "Jannik Sinner",
            "detail": "Guanya Alcaraz a la final"
          },
          {
            "flag": "🇰🇿",
            "position": "WTA Finals 2025",
            "name": "Elena Rybakina",
            "detail": "Guanya Sabalenka a la final"
          },
          {
            "flag": "🇮🇹",
            "position": "Número 1 del rànquing ATP",
            "name": "Jannik Sinner",
            "detail": "A 14 de setembre de 2026"
          }
        ]
      }
    ]
  },
  {
    "id": "basquet",
    "title": "Bàsquet",
    "shortLabel": "Bàsquet",
    "icon": "🏀",
    "accent": "from-orange-500 to-amber-700",
    "subsections": [
      {
        "title": "Temporada 2025-26",
        "icon": "🏀",
        "entries": [
          {
            "flag": "🇺🇸",
            "position": "NBA",
            "name": "New York Knicks",
            "detail": "Guanyen els San Antonio Spurs (4-1) · primer títol des de 1973 · MVP de les finals: Jalen Brunson"
          },
          {
            "flag": "🇨🇦",
            "position": "MVP de la temporada NBA",
            "name": "Shai Gilgeous-Alexander",
            "detail": "Oklahoma City Thunder · el segon seguit"
          },
          {
            "flag": "🇬🇷",
            "position": "Eurolliga",
            "name": "Olympiacos",
            "detail": "Guanya el Reial Madrid (92-85) a Atenes · MVP: Evan Fournier"
          },
          {
            "flag": "🇪🇸",
            "position": "Lliga Endesa (ACB)",
            "name": "València Basket",
            "detail": "Guanya el Barça a la final · segona lliga del club"
          },
          {
            "flag": "🇪🇸",
            "position": "Copa del Rei",
            "name": "Baskonia",
            "detail": "Guanya el Reial Madrid a la final · setena Copa"
          },
          {
            "flag": "🇺🇸",
            "position": "Mundial femení 2026",
            "name": "Estats Units",
            "detail": "97-79 a França a la final · cinquè títol seguit",
            "recent": true
          },
          {
            "flag": "🇺🇸",
            "position": "WNBA 2025",
            "name": "Las Vegas Aces",
            "detail": "Escombren els Phoenix Mercury (4-0)"
          }
        ]
      }
    ]
  },
  {
    "id": "motor",
    "title": "Motor",
    "shortLabel": "Motor",
    "icon": "🏎️",
    "accent": "from-red-600 to-rose-800",
    "subsections": [
      {
        "title": "Fórmula 1",
        "icon": "🏎️",
        "entries": [
          {
            "flag": "🇬🇧",
            "position": "Campió del món 2025",
            "name": "Lando Norris",
            "detail": "McLaren · el seu primer títol; Verstappen a dos punts i Piastri tercer"
          },
          {
            "flag": "🇮🇹",
            "position": "Líder del Mundial 2026",
            "name": "Kimi Antonelli",
            "detail": "Mercedes · 292 punts i vuit victòries després del GP d'Espanya a Madrid; 2n George Russell, 3r Lewis Hamilton",
            "recent": true
          }
        ]
      },
      {
        "title": "Motociclisme",
        "icon": "🏍️",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Campió de MotoGP 2025",
            "name": "Marc Márquez",
            "detail": "Ducati · setè títol a la categoria reina"
          },
          {
            "flag": "🇪🇸",
            "position": "Líder de MotoGP 2026",
            "name": "Marc Márquez",
            "detail": "Passa al capdavant després del doble triomf a Misano, empatat a punts amb Jorge Martín",
            "recent": true
          }
        ]
      },
      {
        "title": "Dakar 2026",
        "icon": "🏜️",
        "entries": [
          {
            "flag": "🇶🇦",
            "position": "Cotxes",
            "name": "Nasser Al-Attiyah",
            "detail": "Dacia · el seu sisè Dakar · 2n Nani Roma; Carlos Sainz, 5è"
          },
          {
            "flag": "🇦🇷",
            "position": "Motos",
            "name": "Luciano Benavides",
            "detail": "KTM · guanya per només 2 segons Ricky Brabec, el final més ajustat de la història"
          }
        ]
      }
    ]
  },
  {
    "id": "ciclisme",
    "title": "Ciclisme",
    "shortLabel": "Ciclisme",
    "icon": "🚴",
    "accent": "from-yellow-400 to-pink-600",
    "subsections": [
      {
        "title": "Grans Voltes 2026",
        "icon": "🚴",
        "entries": [
          {
            "flag": "🇸🇮",
            "position": "Tour de França",
            "name": "Tadej Pogačar",
            "detail": "El seu cinquè Tour: iguala Anquetil, Merckx, Hinault i Indurain · 2n Remco Evenepoel, 3r Isaac del Toro · va sortir de Barcelona"
          },
          {
            "flag": "🇩🇰",
            "position": "Giro d'Itàlia",
            "name": "Jonas Vingegaard",
            "detail": "Completa les tres Grans Voltes · 2n Felix Gall, 3r Jai Hindley"
          },
          {
            "flag": "🇪🇸",
            "position": "Vuelta a Espanya",
            "name": "Enric Mas",
            "detail": "Movistar · primer guanyador espanyol des de Contador el 2014 · 2n Primož Roglič, 3r Felix Gall · final a l'Alhambra de Granada",
            "recent": true
          }
        ]
      },
      {
        "title": "2025",
        "icon": "📅",
        "entries": [
          {
            "flag": "🇸🇮",
            "position": "Tour de França 2025",
            "name": "Tadej Pogačar",
            "detail": "2n Jonas Vingegaard"
          },
          {
            "flag": "🇩🇰",
            "position": "Vuelta a Espanya 2025",
            "name": "Jonas Vingegaard",
            "detail": "2n João Almeida"
          },
          {
            "flag": "🇸🇮",
            "position": "Mundial en ruta 2025 (Kigali)",
            "name": "Tadej Pogačar",
            "detail": "El segon seguit"
          }
        ]
      }
    ]
  },
  {
    "id": "altres-esports",
    "title": "Altres esports",
    "shortLabel": "Altres",
    "icon": "🏅",
    "accent": "from-teal-500 to-emerald-700",
    "subsections": [
      {
        "title": "Jocs Olímpics d'Hivern de Milà-Cortina 2026",
        "icon": "⛷️",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Balanç espanyol",
            "name": "1 or i 2 bronzes",
            "detail": "El millor resultat de la història d'Espanya en uns Jocs d'hivern"
          },
          {
            "flag": "🇪🇸",
            "position": "Or en esquí de muntanya (esprint)",
            "name": "Oriol Cardona",
            "detail": "Primer or olímpic d'hivern espanyol des de Paquito Fernández Ochoa (1972)"
          },
          {
            "flag": "🇪🇸",
            "position": "Bronzes en esquí de muntanya",
            "name": "Ana Alonso",
            "detail": "A l'esprint i al relleu mixt, amb Cardona"
          }
        ]
      },
      {
        "title": "Atletisme i natació",
        "icon": "🏃",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Europeu d'atletisme 2026 (Birmingham)",
            "name": "María Pérez i Paul McGrath",
            "detail": "Els dos ors espanyols, tots dos en marxa; María Pérez amb rècord del món"
          },
          {
            "flag": "🇪🇸",
            "position": "Mundial de natació 2025 (Singapur)",
            "name": "Iris Tió",
            "detail": "Tres ors en natació artística"
          },
          {
            "flag": "🇪🇸",
            "position": "Europeu de natació 2026 (París)",
            "name": "Iris Tió",
            "detail": "Or en solo tècnic · Hugo González, plata en 200 estils"
          }
        ]
      },
      {
        "title": "Handbol",
        "icon": "🤾",
        "entries": [
          {
            "flag": "🇩🇰",
            "position": "Europeu masculí 2026",
            "name": "Dinamarca",
            "detail": "34-27 a Alemanya a la final"
          },
          {
            "flag": "🇳🇴",
            "position": "Mundial femení 2025",
            "name": "Noruega",
            "detail": "Alemanya, subcampiona"
          },
          {
            "flag": "🇪🇸",
            "position": "Champions League 2026",
            "name": "FC Barcelona",
            "detail": "37-34 al Füchse Berlin a Colònia · el seu 12è títol"
          }
        ]
      },
      {
        "title": "Golf, rugbi i futbol americà",
        "icon": "⛳",
        "entries": [
          {
            "flag": "🇬🇧",
            "position": "Masters 2026",
            "name": "Rory McIlroy"
          },
          {
            "flag": "🇬🇧",
            "position": "PGA Championship 2026",
            "name": "Aaron Rai",
            "detail": "El seu primer major"
          },
          {
            "flag": "🇺🇸",
            "position": "US Open de golf 2026",
            "name": "Wyndham Clark",
            "detail": "El seu segon US Open"
          },
          {
            "flag": "🇳🇿",
            "position": "The Open 2026",
            "name": "Ryan Fox",
            "detail": "El seu primer major"
          },
          {
            "flag": "🇫🇷",
            "position": "Sis Nacions 2026",
            "name": "França",
            "detail": "Revalida el títol"
          },
          {
            "flag": "🇺🇸",
            "position": "Super Bowl LX",
            "name": "Seattle Seahawks",
            "detail": "29-13 als New England Patriots · MVP: Kenneth Walker III"
          }
        ]
      }
    ]
  }
];
