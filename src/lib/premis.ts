// Directori de premis — recopilació de premis més rellevants de
// novembre 2025 fins a maig 2026, organitzats per mes. Mateix patró
// que esports.ts i personalitats.ts.
//
// El shape és el mateix que LeaderSection per reaprofitar SectionView.

export type AwardEntry = {
  /** Premi i edició (ex. "PREMI CERVANTES 2025 · 125.000 €"). */
  position: string;
  /** Guanyador/a o obra premiada. */
  name: string;
  /** Detalls (obra, dotació, gala, dates...). */
  detail?: string;
  /** Bandera (emoji) — país del guanyador o icona del premi. */
  flag?: string;
  /** Marca com a premi destacat. */
  recent?: boolean;
};

export type AwardSubsection = {
  title?: string;
  icon?: string;
  compact?: boolean;
  entries: AwardEntry[];
};

export type AwardSection = {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  accent: string;
  subsections: AwardSubsection[];
};

export const PREMIS_UPDATED_AT = '2026-09-14';

// Generat per scripts/directoris/publica.mjs a partir de dades.mjs.
// No ho editis a mà: canvia dades.mjs i torna'l a executar.
export const PREMIS: AwardSection[] = [
  {
    "id": "nobel-2025",
    "title": "Premis Nobel 2025",
    "shortLabel": "Nobel",
    "icon": "🥇",
    "accent": "from-amber-400 to-yellow-600",
    "subsections": [
      {
        "title": "Els sis Nobel de 2025 (els de 2026 s'anuncien a l'octubre)",
        "icon": "🥇",
        "entries": [
          {
            "flag": "🇻🇪",
            "position": "Nobel de la Pau",
            "name": "María Corina Machado",
            "detail": "Líder opositora veneçolana, per la lluita pels drets democràtics a Veneçuela"
          },
          {
            "flag": "🇭🇺",
            "position": "Nobel de Literatura",
            "name": "László Krasznahorkai",
            "detail": "Escriptor hongarès"
          },
          {
            "flag": "🔬",
            "position": "Nobel de Medicina",
            "name": "Mary E. Brunkow, Fred Ramsdell i Shimon Sakaguchi",
            "detail": "Per la tolerància immunitària perifèrica (cèl·lules T reguladores)"
          },
          {
            "flag": "⚛️",
            "position": "Nobel de Física",
            "name": "John Clarke, Michel H. Devoret i John M. Martinis",
            "detail": "Per l'efecte túnel quàntic macroscòpic en circuits elèctrics"
          },
          {
            "flag": "🧪",
            "position": "Nobel de Química",
            "name": "Susumu Kitagawa, Richard Robson i Omar M. Yaghi",
            "detail": "Per les estructures metal·lorgàniques (MOF)"
          },
          {
            "flag": "💶",
            "position": "Nobel d'Economia",
            "name": "Joel Mokyr, Philippe Aghion i Peter Howitt",
            "detail": "Per explicar el creixement econòmic impulsat per la innovació"
          }
        ]
      }
    ]
  },
  {
    "id": "princesa-asturies",
    "title": "Premis Princesa d'Astúries",
    "shortLabel": "Princesa d'Astúries",
    "icon": "👑",
    "accent": "from-blue-500 to-indigo-700",
    "subsections": [
      {
        "title": "Edició 2026 · lliurament a Oviedo el 23 d'octubre",
        "icon": "👑",
        "entries": [
          {
            "flag": "🇬🇧",
            "position": "Lletres",
            "name": "Julian Barnes",
            "detail": "Escriptor britànic"
          },
          {
            "flag": "🇺🇸",
            "position": "Arts",
            "name": "Patti Smith",
            "detail": "Cantant, poeta i escriptora"
          },
          {
            "flag": "🇯🇵",
            "position": "Comunicació i Humanitats",
            "name": "Studio Ghibli",
            "detail": "Estudi d'animació japonès"
          },
          {
            "flag": "🇬🇧",
            "position": "Ciències Socials",
            "name": "Timothy Garton Ash",
            "detail": "Historiador britànic"
          },
          {
            "flag": "🔬",
            "position": "Investigació Científica i Tècnica",
            "name": "David Klenerman, Shankar Balasubramanian i Pascal Mayer",
            "detail": "Per la seqüenciació de nova generació de l'ADN"
          },
          {
            "flag": "🇳🇴",
            "position": "Cooperació Internacional",
            "name": "Reserva Mundial de Llavors de Svalbard"
          },
          {
            "flag": "🇦🇷",
            "position": "Esports",
            "name": "Leo Messi"
          },
          {
            "flag": "🚀",
            "position": "Concòrdia",
            "name": "Christina Koch",
            "detail": "Astronauta de la NASA (missió Artemis II)"
          }
        ]
      },
      {
        "title": "Edició 2025",
        "icon": "📜",
        "compact": true,
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Lletres",
            "name": "Eduardo Mendoza"
          },
          {
            "flag": "🇲🇽",
            "position": "Arts",
            "name": "Graciela Iturbide",
            "detail": "Fotògrafa"
          },
          {
            "flag": "🇩🇪",
            "position": "Comunicació i Humanitats",
            "name": "Byung-Chul Han",
            "detail": "Filòsof"
          },
          {
            "flag": "🇺🇸",
            "position": "Ciències Socials",
            "name": "Douglas Massey"
          },
          {
            "flag": "🧬",
            "position": "Investigació Científica i Tècnica",
            "name": "Mary-Claire King"
          },
          {
            "flag": "🇮🇹",
            "position": "Cooperació Internacional",
            "name": "Mario Draghi"
          },
          {
            "flag": "🇺🇸",
            "position": "Esports",
            "name": "Serena Williams"
          },
          {
            "flag": "🇲🇽",
            "position": "Concòrdia",
            "name": "Museu Nacional d'Antropologia de Mèxic"
          }
        ]
      }
    ]
  },
  {
    "id": "cinema",
    "title": "Cinema",
    "shortLabel": "Cinema",
    "icon": "🎬",
    "accent": "from-rose-500 to-red-700",
    "subsections": [
      {
        "title": "Oscars 2026 (98a edició, 15 de març)",
        "icon": "🏆",
        "entries": [
          {
            "flag": "🎬",
            "position": "Millor pel·lícula",
            "name": "One Battle After Another",
            "detail": "La gran guanyadora, amb sis Oscars"
          },
          {
            "flag": "🎬",
            "position": "Millor direcció",
            "name": "Paul Thomas Anderson",
            "detail": "One Battle After Another"
          },
          {
            "flag": "🎬",
            "position": "Millor actor",
            "name": "Michael B. Jordan",
            "detail": "Sinners"
          },
          {
            "flag": "🎬",
            "position": "Millor actriu",
            "name": "Jessie Buckley",
            "detail": "Hamnet"
          },
          {
            "flag": "🎬",
            "position": "Millor actor secundari",
            "name": "Sean Penn",
            "detail": "One Battle After Another"
          },
          {
            "flag": "🎬",
            "position": "Millor actriu secundària",
            "name": "Amy Madigan",
            "detail": "Weapons"
          },
          {
            "flag": "🇳🇴",
            "position": "Millor pel·lícula internacional",
            "name": "Sentimental Value",
            "detail": "Noruega"
          },
          {
            "flag": "🎬",
            "position": "Millor pel·lícula d'animació",
            "name": "KPop Demon Hunters"
          }
        ]
      },
      {
        "title": "Goya 2026 (40a edició)",
        "icon": "🇪🇸",
        "entries": [
          {
            "flag": "🎬",
            "position": "Millor pel·lícula",
            "name": "Los domingos",
            "detail": "D'Alauda Ruiz de Azúa; també guió original i actriu"
          },
          {
            "flag": "🎬",
            "position": "Millor direcció",
            "name": "Alauda Ruiz de Azúa",
            "detail": "Los domingos"
          },
          {
            "flag": "🎬",
            "position": "Millor actor protagonista",
            "name": "José Ramón Soroiz",
            "detail": "Maspalomas"
          },
          {
            "flag": "🎬",
            "position": "Millor actriu protagonista",
            "name": "Patricia López Arnaiz",
            "detail": "Los domingos"
          },
          {
            "flag": "🎬",
            "position": "Millor direcció novella",
            "name": "Eva Libertad",
            "detail": "Sorda"
          },
          {
            "flag": "🎬",
            "position": "Millor actor secundari",
            "name": "Álvaro Cervantes",
            "detail": "Sorda"
          },
          {
            "flag": "🎬",
            "position": "Millor actriu revelació",
            "name": "Miriam Garlo",
            "detail": "Sorda"
          }
        ]
      },
      {
        "title": "Premis Gaudí 2026",
        "icon": "🎞️",
        "entries": [
          {
            "flag": "🎬",
            "position": "Millor pel·lícula",
            "name": "Frontera",
            "detail": "De Judith Colell"
          },
          {
            "flag": "🎬",
            "position": "Millor pel·lícula en llengua no catalana",
            "name": "Sorda"
          },
          {
            "flag": "🎬",
            "position": "Més premiada",
            "name": "Sirât",
            "detail": "D'Oliver Laxe, amb vuit premis"
          }
        ]
      },
      {
        "title": "Festivals i altres premis",
        "icon": "🌟",
        "entries": [
          {
            "flag": "🇷🇴",
            "position": "Palma d'Or de Canes 2026",
            "name": "Fjord",
            "detail": "De Cristian Mungiu, la seva segona Palma"
          },
          {
            "flag": "🇪🇸",
            "position": "Millor direcció a Canes 2026 (ex aequo)",
            "name": "Javier Ambrossi i Javier Calvo (Los Javis)",
            "detail": "Per La bola negra; comparteixen el premi amb Pawel Pawlikowski"
          },
          {
            "flag": "🇷🇺",
            "position": "Gran Premi de Canes 2026",
            "name": "Minotaure",
            "detail": "D'Andrei Zviàguintsev"
          },
          {
            "flag": "🇩🇰",
            "position": "Lleó d'Or de Venècia 2026",
            "name": "Woman Unknown",
            "detail": "De May el-Toukhy · millor actor: John Malkovich",
            "recent": true
          },
          {
            "flag": "🇩🇪",
            "position": "Os d'Or de Berlín 2026",
            "name": "Yellow Letters",
            "detail": "D'İlker Çatak"
          },
          {
            "flag": "🇪🇸",
            "position": "Conxa d'Or de Sant Sebastià 2025",
            "name": "Los domingos",
            "detail": "D'Alauda Ruiz de Azúa"
          },
          {
            "flag": "🇬🇧",
            "position": "Globus d'Or 2026 · drama",
            "name": "Hamnet",
            "detail": "Comèdia o musical: One Battle After Another"
          },
          {
            "flag": "🇬🇧",
            "position": "BAFTA 2026 · millor pel·lícula",
            "name": "One Battle After Another"
          }
        ]
      }
    ]
  },
  {
    "id": "lletres",
    "title": "Lletres",
    "shortLabel": "Lletres",
    "icon": "📚",
    "accent": "from-emerald-500 to-teal-700",
    "subsections": [
      {
        "title": "En català",
        "icon": "📗",
        "entries": [
          {
            "flag": "📖",
            "position": "Premi d'Honor de les Lletres Catalanes 2026",
            "name": "Biel Mesquida",
            "detail": "58a edició, atorgat per Òmnium Cultural"
          },
          {
            "flag": "📖",
            "position": "Premi Sant Jordi de novel·la 2025",
            "name": "Roc Casagran",
            "detail": "Somiàvem una illa"
          },
          {
            "flag": "📖",
            "position": "Premi Ramon Llull 2026",
            "name": "Agnès Marquès",
            "detail": "La segona vida de Ginebra Vern"
          }
        ]
      },
      {
        "title": "En castellà",
        "icon": "📘",
        "entries": [
          {
            "flag": "🇲🇽",
            "position": "Premi Cervantes 2025",
            "name": "Gonzalo Celorio",
            "detail": "Escriptor mexicà; el va rebre dels Reis el 23 d'abril de 2026 a Alcalá de Henares · 125.000 €"
          },
          {
            "flag": "🇪🇸",
            "position": "Premi Nacional de les Lletres Espanyoles 2025",
            "name": "María Victoria Atencia",
            "detail": "Poeta malaguenya"
          },
          {
            "flag": "🇪🇸",
            "position": "Premi Nacional de Narrativa 2025",
            "name": "Paco Cerdà",
            "detail": "Presentes"
          },
          {
            "flag": "📖",
            "position": "Premi Planeta 2025",
            "name": "Juan del Val",
            "detail": "Vera, una historia de amor · finalista: Ángela Banzas · 1.000.000 €"
          },
          {
            "flag": "📖",
            "position": "Premi Nadal 2026",
            "name": "David Uclés",
            "detail": "La ciudad de las luces muertas"
          },
          {
            "flag": "🇲🇽",
            "position": "Premi Alfaguara 2026",
            "name": "David Toscana",
            "detail": "El ejército ciego"
          }
        ]
      },
      {
        "title": "Internacionals",
        "icon": "🌍",
        "entries": [
          {
            "flag": "🇬🇧",
            "position": "Premi Booker 2025",
            "name": "David Szalay",
            "detail": "Flesh"
          },
          {
            "flag": "🇫🇷",
            "position": "Premi Goncourt 2025",
            "name": "Laurent Mauvignier",
            "detail": "La maison vide"
          },
          {
            "flag": "🇺🇸",
            "position": "Premi Pulitzer de ficció 2026",
            "name": "Daniel Kraus",
            "detail": "Angel Down"
          }
        ]
      }
    ]
  },
  {
    "id": "musica",
    "title": "Música",
    "shortLabel": "Música",
    "icon": "🎵",
    "accent": "from-fuchsia-500 to-purple-700",
    "subsections": [
      {
        "title": "Grammy 2026 (68a edició)",
        "icon": "🎤",
        "entries": [
          {
            "flag": "🇵🇷",
            "position": "Àlbum de l'any",
            "name": "Bad Bunny",
            "detail": "DeBÍ TiRAR MáS FOToS · el primer àlbum majoritàriament en castellà que ho guanya"
          },
          {
            "flag": "🇺🇸",
            "position": "Enregistrament de l'any",
            "name": "Kendrick Lamar i SZA",
            "detail": "luther"
          },
          {
            "flag": "🇺🇸",
            "position": "Cançó de l'any",
            "name": "Billie Eilish",
            "detail": "Wildflower"
          },
          {
            "flag": "🇬🇧",
            "position": "Millor artista revelació",
            "name": "Olivia Dean"
          }
        ]
      },
      {
        "title": "Grammy Llatins 2025",
        "icon": "🎸",
        "entries": [
          {
            "flag": "🇵🇷",
            "position": "Àlbum de l'any",
            "name": "Bad Bunny",
            "detail": "DeBÍ TiRAR MáS FOToS"
          },
          {
            "flag": "🇪🇸",
            "position": "Enregistrament de l'any",
            "name": "Alejandro Sanz",
            "detail": "Palmeras en el jardín"
          },
          {
            "flag": "🇨🇴",
            "position": "Cançó de l'any",
            "name": "Karol G",
            "detail": "Si antes te hubiera conocido"
          },
          {
            "flag": "🎶",
            "position": "Millor artista revelació",
            "name": "Paloma Morphy"
          }
        ]
      },
      {
        "title": "Eurovisió",
        "icon": "🎙️",
        "entries": [
          {
            "flag": "🇧🇬",
            "position": "Eurovisió 2026 (Viena)",
            "name": "Bulgària",
            "detail": "Dara, amb «Bangaranga» · 516 punts; primera victòria del país"
          },
          {
            "flag": "🇪🇸",
            "position": "Espanya a Eurovisió 2026",
            "name": "No hi va participar",
            "detail": "Boicot per la participació d'Israel"
          },
          {
            "flag": "🇪🇸",
            "position": "Benidorm Fest 2026",
            "name": "Tony Grox i Lucycalys",
            "detail": "Primer guanyador que no va representar Espanya, pel boicot"
          }
        ]
      }
    ]
  },
  {
    "id": "ciencia-societat",
    "title": "Ciència, arquitectura i societat",
    "shortLabel": "Ciència i societat",
    "icon": "🔭",
    "accent": "from-cyan-500 to-blue-700",
    "subsections": [
      {
        "title": "Ciència i arquitectura",
        "icon": "🔭",
        "entries": [
          {
            "flag": "🇨🇱",
            "position": "Premi Pritzker 2026 (arquitectura)",
            "name": "Smiljan Radić",
            "detail": "Arquitecte xilè"
          },
          {
            "flag": "🇩🇪",
            "position": "Premi Abel 2026 (matemàtiques)",
            "name": "Gerd Faltings",
            "detail": "Primer alemany que el guanya"
          },
          {
            "flag": "📐",
            "position": "Medalla Fields 2026",
            "name": "Yu Deng, John Pardon, Jacob Tsimerman i Hong Wang",
            "detail": "Per primera vegada, dos matemàtics xinesos en la mateixa edició"
          }
        ]
      },
      {
        "title": "Societat i drets",
        "icon": "🕊️",
        "entries": [
          {
            "flag": "🇪🇺",
            "position": "Premi Sàkharov 2025",
            "name": "Andrzej Poczobut i Mzia Amaglobeli",
            "detail": "Periodistes empresonats a Bielorússia i Geòrgia"
          },
          {
            "flag": "🇮🇹",
            "position": "Premi Carlemany 2026",
            "name": "Mario Draghi"
          },
          {
            "flag": "🤖",
            "position": "Persona de l'Any 2025 de la revista Time",
            "name": "Els arquitectes de la intel·ligència artificial",
            "detail": "Entre d'altres, Jensen Huang, Sam Altman, Mark Zuckerberg i Elon Musk"
          },
          {
            "flag": "🟥",
            "position": "Creus de Sant Jordi 2026",
            "name": "Sílvia Munt, Enric Majó, Júlia Otero, Fermí Puig, Victòria Camps, Maite Carranza i Joan Fontcuberta, entre d'altres",
            "detail": "També la Universitat de Barcelona, entre les entitats"
          }
        ]
      }
    ]
  },
  {
    "id": "premis-esportius",
    "title": "Premis esportius",
    "shortLabel": "Premis esportius",
    "icon": "🏅",
    "accent": "from-yellow-500 to-orange-600",
    "subsections": [
      {
        "title": "Futbol",
        "icon": "⚽",
        "entries": [
          {
            "flag": "🇫🇷",
            "position": "Pilota d'Or 2025",
            "name": "Ousmane Dembélé",
            "detail": "PSG · la primera de la seva carrera"
          },
          {
            "flag": "🇪🇸",
            "position": "Pilota d'Or femenina 2025",
            "name": "Aitana Bonmatí",
            "detail": "Barça · la tercera seguida"
          },
          {
            "flag": "🇪🇸",
            "position": "Trofeu Kopa 2025 (millor jove)",
            "name": "Lamine Yamal",
            "detail": "El segon; en femení, Vicky López"
          },
          {
            "flag": "🇫🇷",
            "position": "The Best FIFA 2025",
            "name": "Ousmane Dembélé i Aitana Bonmatí",
            "detail": "Millors entrenadors: Luis Enrique i Sarina Wiegman"
          },
          {
            "flag": "🇫🇷",
            "position": "Golden Boy 2025",
            "name": "Désiré Doué",
            "detail": "PSG"
          }
        ]
      },
      {
        "title": "Laureus 2026 (Madrid)",
        "icon": "🏅",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Esportista masculí",
            "name": "Carlos Alcaraz"
          },
          {
            "flag": "🇧🇾",
            "position": "Esportista femenina",
            "name": "Aryna Sabalenka"
          },
          {
            "flag": "🇪🇸",
            "position": "Esportista revelació jove",
            "name": "Lamine Yamal"
          },
          {
            "flag": "🇩🇪",
            "position": "Premi a la inspiració",
            "name": "Toni Kroos"
          },
          {
            "flag": "🇫🇷",
            "position": "Equip",
            "name": "Paris Saint-Germain"
          },
          {
            "flag": "🇬🇧",
            "position": "Revelació",
            "name": "Lando Norris"
          }
        ]
      }
    ]
  }
];
