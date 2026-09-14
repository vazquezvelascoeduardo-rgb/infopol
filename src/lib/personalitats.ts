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

export const PERSONALITATS_UPDATED_AT = '2026-09-14';

// Generat per scripts/directoris/publica.mjs a partir de dades.mjs.
// No ho editis a mà: canvia dades.mjs i torna'l a executar.
export const PERSONALITATS: LeaderSection[] = [
  {
    "id": "espanya-govern",
    "title": "Govern d'Espanya",
    "shortLabel": "Govern",
    "icon": "🇪🇸",
    "accent": "from-red-500 to-amber-600",
    "subsections": [
      {
        "title": "Presidència i vicepresidències",
        "icon": "🏛️",
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "President del Govern",
            "name": "Pedro Sánchez",
            "detail": "PSOE · XV legislatura"
          },
          {
            "flag": "🇪🇸",
            "position": "Vicepresident primer i ministre d'Economia, Comerç i Empresa",
            "name": "Carlos Cuerpo",
            "detail": "PSOE · vicepresident primer des de la remodelació de març de 2026"
          },
          {
            "flag": "🇪🇸",
            "position": "Vicepresidenta segona i ministra de Treball i Economia Social",
            "name": "Yolanda Díaz",
            "detail": "Sumar"
          },
          {
            "flag": "🇪🇸",
            "position": "Vicepresidenta tercera i ministra per a la Transició Ecològica i el Repte Demogràfic",
            "name": "Sara Aagesen",
            "detail": "PSOE"
          }
        ]
      },
      {
        "title": "Ministres",
        "icon": "💼",
        "compact": true,
        "entries": [
          {
            "flag": "🇪🇸",
            "position": "Afers Exteriors, Unió Europea i Cooperació",
            "name": "José Manuel Albares"
          },
          {
            "flag": "🇪🇸",
            "position": "Presidència, Justícia i Relacions amb les Corts",
            "name": "Félix Bolaños"
          },
          {
            "flag": "🇪🇸",
            "position": "Defensa",
            "name": "Margarita Robles"
          },
          {
            "flag": "🇪🇸",
            "position": "Hisenda",
            "name": "Arcadi España",
            "detail": "Des de març de 2026; substitueix María Jesús Montero"
          },
          {
            "flag": "🇪🇸",
            "position": "Interior",
            "name": "Fernando Grande-Marlaska"
          },
          {
            "flag": "🇪🇸",
            "position": "Transports i Mobilitat Sostenible",
            "name": "Óscar Puente"
          },
          {
            "flag": "🇪🇸",
            "position": "Educació, Formació Professional i Esports",
            "name": "Milagros Tolón",
            "detail": "Substitueix Pilar Alegría"
          },
          {
            "flag": "🇪🇸",
            "position": "Indústria i Turisme",
            "name": "Jordi Hereu"
          },
          {
            "flag": "🇪🇸",
            "position": "Agricultura, Pesca i Alimentació",
            "name": "Luis Planas"
          },
          {
            "flag": "🇪🇸",
            "position": "Política Territorial i Memòria Democràtica",
            "name": "Ángel Víctor Torres"
          },
          {
            "flag": "🇪🇸",
            "position": "Habitatge i Agenda Urbana",
            "name": "Isabel Rodríguez"
          },
          {
            "flag": "🇪🇸",
            "position": "Cultura",
            "name": "Ernest Urtasun",
            "detail": "Sumar"
          },
          {
            "flag": "🇪🇸",
            "position": "Sanitat",
            "name": "Mónica García",
            "detail": "Sumar"
          },
          {
            "flag": "🇪🇸",
            "position": "Drets Socials, Consum i Agenda 2030",
            "name": "Pablo Bustinduy",
            "detail": "Sumar"
          },
          {
            "flag": "🇪🇸",
            "position": "Ciència, Innovació i Universitats",
            "name": "Diana Morant"
          },
          {
            "flag": "🇪🇸",
            "position": "Igualtat",
            "name": "Ana Redondo"
          },
          {
            "flag": "🇪🇸",
            "position": "Inclusió, Seguretat Social i Migracions",
            "name": "Elma Saiz"
          },
          {
            "flag": "🇪🇸",
            "position": "Transformació Digital i de la Funció Pública",
            "name": "Óscar López"
          },
          {
            "flag": "🇪🇸",
            "position": "Joventut i Infància",
            "name": "Sira Rego",
            "detail": "Sumar"
          }
        ]
      }
    ]
  },
  {
    "id": "espanya-estat",
    "title": "Estat: Corona, Corts i alts òrgans",
    "shortLabel": "Estat",
    "icon": "👑",
    "accent": "from-amber-500 to-orange-700",
    "subsections": [
      {
        "title": "Corona",
        "icon": "👑",
        "entries": [
          {
            "flag": "👑",
            "position": "Rei d'Espanya",
            "name": "Felip VI"
          },
          {
            "flag": "👑",
            "position": "Reina",
            "name": "Letícia"
          },
          {
            "flag": "👑",
            "position": "Princesa d'Astúries",
            "name": "Elionor de Borbó",
            "detail": "Hereva de la Corona"
          },
          {
            "flag": "👑",
            "position": "Cap de la Casa de S. M. el Rei",
            "name": "Camilo Villarino"
          }
        ]
      },
      {
        "title": "Corts Generals i partits",
        "icon": "🗳️",
        "entries": [
          {
            "flag": "🏛️",
            "position": "Presidenta del Congrés dels Diputats",
            "name": "Francina Armengol",
            "detail": "PSOE"
          },
          {
            "flag": "🏛️",
            "position": "President del Senat",
            "name": "Pedro Rollán",
            "detail": "PP"
          },
          {
            "flag": "🔵",
            "position": "PP · líder de l'oposició",
            "name": "Alberto Núñez Feijóo"
          },
          {
            "flag": "🟢",
            "position": "Vox · president",
            "name": "Santiago Abascal"
          },
          {
            "flag": "🟣",
            "position": "Podem · secretària general",
            "name": "Ione Belarra"
          },
          {
            "flag": "🟡",
            "position": "ERC · president",
            "name": "Oriol Junqueras"
          },
          {
            "flag": "🟠",
            "position": "Junts · president",
            "name": "Carles Puigdemont"
          },
          {
            "flag": "🟩",
            "position": "PNB · president de l'Euzkadi Buru Batzar",
            "name": "Aitor Esteban"
          },
          {
            "flag": "🟩",
            "position": "EH Bildu · coordinador general",
            "name": "Arnaldo Otegi"
          }
        ]
      },
      {
        "title": "Justícia i òrgans de l'Estat",
        "icon": "⚖️",
        "entries": [
          {
            "flag": "⚖️",
            "position": "President del Tribunal Constitucional",
            "name": "Cándido Conde-Pumpido"
          },
          {
            "flag": "⚖️",
            "position": "Presidenta del Tribunal Suprem i del CGPJ",
            "name": "Isabel Perelló",
            "detail": "Primera dona al càrrec"
          },
          {
            "flag": "⚖️",
            "position": "Fiscal General de l'Estat",
            "name": "Teresa Peramato",
            "detail": "Des de desembre de 2025; substitueix Álvaro García Ortiz, condemnat pel Tribunal Suprem"
          },
          {
            "flag": "⚖️",
            "position": "President de l'Audiència Nacional",
            "name": "Juan Manuel Fernández"
          },
          {
            "flag": "📊",
            "position": "Presidenta del Tribunal de Comptes",
            "name": "Enriqueta Chicano"
          },
          {
            "flag": "📜",
            "position": "Presidenta del Consell d'Estat",
            "name": "Carmen Calvo"
          },
          {
            "flag": "🛡️",
            "position": "Defensor del Poble",
            "name": "Ángel Gabilondo"
          },
          {
            "flag": "💶",
            "position": "Governador del Banc d'Espanya",
            "name": "José Luis Escrivá"
          }
        ]
      },
      {
        "title": "Seguretat i defensa",
        "icon": "🚓",
        "entries": [
          {
            "flag": "👮",
            "position": "Director General de la Policia Nacional",
            "name": "Francisco Pardo Piqueras"
          },
          {
            "flag": "🚓",
            "position": "Directora General de la Guàrdia Civil",
            "name": "Mercedes González"
          },
          {
            "flag": "🕵️",
            "position": "Directora del CNI",
            "name": "Esperanza Casteleiro"
          },
          {
            "flag": "🎖️",
            "position": "Cap d'Estat Major de la Defensa (JEMAD)",
            "name": "Teodoro E. López Calderón",
            "detail": "Almirall general"
          },
          {
            "flag": "🇪🇸",
            "position": "Delegat del Govern a Catalunya",
            "name": "Carlos Prieto"
          }
        ]
      }
    ]
  },
  {
    "id": "espanya-comunitats",
    "title": "Presidents autonòmics",
    "shortLabel": "Comunitats",
    "icon": "🗺️",
    "accent": "from-emerald-500 to-teal-700",
    "subsections": [
      {
        "title": "Les 17 comunitats i les 2 ciutats autònomes",
        "icon": "🗺️",
        "entries": [
          {
            "flag": "🟩",
            "position": "Andalusia",
            "name": "Juanma Moreno",
            "detail": "PP · guanya les eleccions del 17 de maig de 2026, però perd la majoria absoluta (53 escons)"
          },
          {
            "flag": "🟨",
            "position": "Aragó",
            "name": "Jorge Azcón",
            "detail": "PP · eleccions anticipades el 8 de febrer de 2026"
          },
          {
            "flag": "🟦",
            "position": "Astúries",
            "name": "Adrián Barbón",
            "detail": "PSOE"
          },
          {
            "flag": "🟪",
            "position": "Illes Balears",
            "name": "Marga Prohens",
            "detail": "PP"
          },
          {
            "flag": "🟨",
            "position": "Canàries",
            "name": "Fernando Clavijo",
            "detail": "Coalició Canària"
          },
          {
            "flag": "🟩",
            "position": "Cantàbria",
            "name": "María José Sáenz de Buruaga",
            "detail": "PP"
          },
          {
            "flag": "🟫",
            "position": "Castella-la Manxa",
            "name": "Emiliano García-Page",
            "detail": "PSOE"
          },
          {
            "flag": "🟪",
            "position": "Castella i Lleó",
            "name": "Alfonso Fernández Mañueco",
            "detail": "PP · guanya les eleccions del 15 de març de 2026 sense majoria absoluta"
          },
          {
            "flag": "🟥",
            "position": "Catalunya",
            "name": "Salvador Illa",
            "detail": "PSC · 133è president de la Generalitat, des d'agost de 2024"
          },
          {
            "flag": "🟥",
            "position": "Comunitat de Madrid",
            "name": "Isabel Díaz Ayuso",
            "detail": "PP"
          },
          {
            "flag": "🟧",
            "position": "Comunitat Valenciana",
            "name": "Juanfran Pérez Llorca",
            "detail": "PP · des de desembre de 2025; substitueix Carlos Mazón, que va dimitir per la gestió de la DANA"
          },
          {
            "flag": "🟩",
            "position": "Extremadura",
            "name": "María Guardiola",
            "detail": "PP · reelegida després de les eleccions anticipades de desembre de 2025"
          },
          {
            "flag": "🟦",
            "position": "Galícia",
            "name": "Alfonso Rueda",
            "detail": "PP"
          },
          {
            "flag": "🟥",
            "position": "La Rioja",
            "name": "Gonzalo Capellán",
            "detail": "PP"
          },
          {
            "flag": "🟥",
            "position": "Navarra",
            "name": "María Chivite",
            "detail": "PSN-PSOE"
          },
          {
            "flag": "🟩",
            "position": "País Basc",
            "name": "Imanol Pradales",
            "detail": "PNB · lehendakari des de juny de 2024"
          },
          {
            "flag": "🟧",
            "position": "Regió de Múrcia",
            "name": "Fernando López Miras",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Ceuta (ciutat autònoma)",
            "name": "Juan Jesús Vivas",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Melilla (ciutat autònoma)",
            "name": "Juan José Imbroda",
            "detail": "PP"
          }
        ]
      }
    ]
  },
  {
    "id": "espanya-alcaldes",
    "title": "Alcaldes de les grans ciutats",
    "shortLabel": "Alcaldes",
    "icon": "🏙️",
    "accent": "from-sky-500 to-blue-700",
    "subsections": [
      {
        "title": "Les ciutats més poblades",
        "icon": "🏙️",
        "compact": true,
        "entries": [
          {
            "flag": "🏙️",
            "position": "Madrid",
            "name": "José Luis Martínez-Almeida",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Barcelona",
            "name": "Jaume Collboni",
            "detail": "PSC"
          },
          {
            "flag": "🏙️",
            "position": "València",
            "name": "María José Catalá",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Saragossa",
            "name": "Natalia Chueca",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Sevilla",
            "name": "José Luis Sanz",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Màlaga",
            "name": "Francisco de la Torre",
            "detail": "PP · alcalde des del 2000"
          },
          {
            "flag": "🏙️",
            "position": "Múrcia",
            "name": "Rebeca Pérez",
            "detail": "PP · des del 22 de maig de 2026, després de la mort de José Ballesta",
            "recent": true
          },
          {
            "flag": "🏙️",
            "position": "Palma",
            "name": "Jaime Martínez",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Las Palmas de Gran Canaria",
            "name": "Carolina Darias",
            "detail": "PSOE"
          },
          {
            "flag": "🏙️",
            "position": "Alacant",
            "name": "Luis Barcala",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Bilbao",
            "name": "Juan Mari Aburto",
            "detail": "PNB"
          },
          {
            "flag": "🏙️",
            "position": "Còrdova",
            "name": "José María Bellido",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Valladolid",
            "name": "Jesús Julio Carnero",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Vigo",
            "name": "Abel Caballero",
            "detail": "PSdeG-PSOE"
          },
          {
            "flag": "🏙️",
            "position": "L'Hospitalet de Llobregat",
            "name": "David Quirós",
            "detail": "PSC · des de juny de 2024"
          },
          {
            "flag": "🏙️",
            "position": "Gijón",
            "name": "Carmen Moriyón",
            "detail": "Foro Asturias"
          },
          {
            "flag": "🏙️",
            "position": "Vitòria",
            "name": "Maider Etxebarria",
            "detail": "PSE-EE"
          },
          {
            "flag": "🏙️",
            "position": "A Corunya",
            "name": "Inés Rey",
            "detail": "PSdeG-PSOE"
          },
          {
            "flag": "🏙️",
            "position": "Elx",
            "name": "Pablo Ruz",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Granada",
            "name": "Marifrán Carazo",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Terrassa",
            "name": "Jordi Ballart",
            "detail": "Tot per Terrassa"
          },
          {
            "flag": "🏙️",
            "position": "Badalona",
            "name": "Xavier García Albiol",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Sabadell",
            "name": "Marta Farrés",
            "detail": "PSC"
          },
          {
            "flag": "🏙️",
            "position": "Oviedo",
            "name": "Alfredo Canteli",
            "detail": "PP"
          },
          {
            "flag": "🏙️",
            "position": "Pamplona",
            "name": "Joseba Asiron",
            "detail": "EH Bildu · des de desembre de 2023"
          },
          {
            "flag": "🏙️",
            "position": "Sant Sebastià",
            "name": "Jon Insausti",
            "detail": "PNB · des d'octubre de 2025"
          }
        ]
      },
      {
        "title": "Altres capitals de província",
        "icon": "📍",
        "compact": true,
        "entries": [
          {
            "flag": "📍",
            "position": "Almeria",
            "name": "María del Mar Vázquez",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Cadis",
            "name": "Bruno García",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Huelva",
            "name": "Pilar Miranda",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Jaén",
            "name": "Julio Millán",
            "detail": "PSOE · des de gener de 2025, per moció de censura"
          },
          {
            "flag": "📍",
            "position": "Castelló de la Plana",
            "name": "Begoña Carrasco",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Santander",
            "name": "Gema Igual",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Logronyo",
            "name": "Conrado Escobar",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Burgos",
            "name": "Cristina Ayala",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Salamanca",
            "name": "Carlos García Carbayo",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Lleó",
            "name": "José Antonio Diez",
            "detail": "PSOE"
          },
          {
            "flag": "📍",
            "position": "Palència",
            "name": "Miriam Andrés",
            "detail": "PSOE"
          },
          {
            "flag": "📍",
            "position": "Sòria",
            "name": "Javier Antón",
            "detail": "PSOE · des de l'abril de 2026"
          },
          {
            "flag": "📍",
            "position": "Segòvia",
            "name": "José Mazarías",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Toledo",
            "name": "Carlos Velázquez",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Ciudad Real",
            "name": "Francisco Cañizares",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Guadalajara",
            "name": "Ana Guarinos",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Albacete",
            "name": "Manuel Serrano",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Badajoz",
            "name": "Ignacio Gragera",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Càceres",
            "name": "Rafael Mateos",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Osca",
            "name": "Lorena Orduna",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Terol",
            "name": "Emma Buj",
            "detail": "PP"
          },
          {
            "flag": "📍",
            "position": "Santiago de Compostel·la",
            "name": "Goretti Sanmartín",
            "detail": "BNG"
          },
          {
            "flag": "📍",
            "position": "Lugo",
            "name": "Elena Candia",
            "detail": "PP · des de maig de 2026, per moció de censura"
          },
          {
            "flag": "📍",
            "position": "Ourense",
            "name": "Gonzalo Pérez Jácome",
            "detail": "Democracia Ourensana"
          },
          {
            "flag": "📍",
            "position": "Pontevedra",
            "name": "Miguel Anxo Fernández Lores",
            "detail": "BNG · alcalde des de 1999"
          },
          {
            "flag": "📍",
            "position": "Santa Cruz de Tenerife",
            "name": "José Manuel Bermúdez",
            "detail": "Coalició Canària"
          },
          {
            "flag": "📍",
            "position": "Girona",
            "name": "Lluc Salellas",
            "detail": "Guanyem Girona"
          },
          {
            "flag": "📍",
            "position": "Lleida",
            "name": "Fèlix Larrosa",
            "detail": "PSC"
          },
          {
            "flag": "📍",
            "position": "Tarragona",
            "name": "Rubén Viñuales",
            "detail": "PSC"
          }
        ]
      },
      {
        "title": "Àrea de Barcelona i Baix Llobregat",
        "icon": "🌊",
        "compact": true,
        "entries": [
          {
            "flag": "🌊",
            "position": "Mataró",
            "name": "David Bote",
            "detail": "PSC"
          },
          {
            "flag": "🌊",
            "position": "Reus",
            "name": "Sandra Guaita",
            "detail": "PSC · primera alcaldessa de la ciutat"
          },
          {
            "flag": "🌊",
            "position": "Sant Cugat del Vallès",
            "name": "Josep Maria Vallès",
            "detail": "Junts"
          },
          {
            "flag": "🌊",
            "position": "Santa Coloma de Gramenet",
            "name": "Mireia González",
            "detail": "PSC · des d'agost de 2024, quan Núria Parlon va passar a consellera"
          },
          {
            "flag": "🌊",
            "position": "Cornellà de Llobregat",
            "name": "Antonio Balmón",
            "detail": "PSC · alcalde des de 2004"
          },
          {
            "flag": "🌊",
            "position": "Sant Boi de Llobregat",
            "name": "Lluïsa Moret",
            "detail": "PSC · també presidenta de la Diputació de Barcelona"
          },
          {
            "flag": "🌊",
            "position": "Castelldefels",
            "name": "Manuel Reyes",
            "detail": "PP"
          },
          {
            "flag": "🌊",
            "position": "Gavà",
            "name": "Gemma Badia",
            "detail": "PSC"
          },
          {
            "flag": "🌊",
            "position": "El Prat de Llobregat",
            "name": "Alba Bou",
            "detail": "Comuns · des de gener de 2025"
          },
          {
            "flag": "🌊",
            "position": "Viladecans",
            "name": "Olga Morales",
            "detail": "PSC · des d'octubre de 2024; primera alcaldessa de la ciutat"
          }
        ]
      }
    ]
  },
  {
    "id": "catalunya",
    "title": "Catalunya",
    "shortLabel": "Catalunya",
    "icon": "🏛️",
    "accent": "from-yellow-500 to-red-600",
    "subsections": [
      {
        "title": "Govern de la Generalitat",
        "icon": "🏛️",
        "entries": [
          {
            "flag": "🟥",
            "position": "President de la Generalitat",
            "name": "Salvador Illa",
            "detail": "PSC · 133è president, des d'agost de 2024"
          },
          {
            "flag": "🟥",
            "position": "Conseller de la Presidència",
            "name": "Albert Dalmau"
          },
          {
            "flag": "🟥",
            "position": "Consellera d'Economia i Finances",
            "name": "Alícia Romero"
          },
          {
            "flag": "🟥",
            "position": "Consellera d'Interior i Seguretat Pública",
            "name": "Núria Parlon",
            "detail": "Abans, alcaldessa de Santa Coloma de Gramenet"
          },
          {
            "flag": "🟥",
            "position": "Conseller de Justícia i Qualitat Democràtica",
            "name": "Ramon Espadaler"
          },
          {
            "flag": "🟥",
            "position": "Consellera de Territori, Habitatge i Transició Ecològica",
            "name": "Sílvia Paneque",
            "detail": "També portaveu del Govern"
          },
          {
            "flag": "🟥",
            "position": "Consellera de Salut",
            "name": "Olga Pané"
          },
          {
            "flag": "🟥",
            "position": "Consellera d'Educació i Formació Professional",
            "name": "Esther Niubó"
          },
          {
            "flag": "🟥",
            "position": "Conseller de Drets Socials i Inclusió",
            "name": "Raúl Moreno",
            "detail": "Substitueix Mònica Martínez Bravo"
          },
          {
            "flag": "🟥",
            "position": "Conseller d'Empresa i Treball",
            "name": "Miquel Sàmper"
          },
          {
            "flag": "🟥",
            "position": "Consellera d'Igualtat i Feminismes",
            "name": "Eva Menor"
          },
          {
            "flag": "🟥",
            "position": "Conseller d'Unió Europea i Acció Exterior",
            "name": "Jaume Duch"
          },
          {
            "flag": "🟥",
            "position": "Consellera de Recerca i Universitats",
            "name": "Núria Montserrat"
          },
          {
            "flag": "🟥",
            "position": "Conseller d'Agricultura, Ramaderia, Pesca i Alimentació",
            "name": "Òscar Ordeig"
          },
          {
            "flag": "🟥",
            "position": "Conseller d'Esports",
            "name": "Berni Álvarez"
          },
          {
            "flag": "🟥",
            "position": "Consellera de Cultura",
            "name": "Sònia Hernández"
          },
          {
            "flag": "🟥",
            "position": "Conseller de Política Lingüística",
            "name": "Francesc Xavier Vila"
          }
        ]
      },
      {
        "title": "Seguretat",
        "icon": "👮",
        "entries": [
          {
            "flag": "👮",
            "position": "Director General de la Policia",
            "name": "Ferran López",
            "detail": "Pren possessió el 15 de setembre de 2026; substitueix Josep Lluís Trapero, que va dimitir el 9 de setembre. Ja havia estat cap dels Mossos el 2017-2018",
            "recent": true
          },
          {
            "flag": "👮",
            "position": "Comissària en cap dels Mossos d'Esquadra",
            "name": "Sílvia Catà",
            "detail": "Pren possessió el 15 de setembre de 2026; primera dona al capdavant del cos; substitueix Miquel Esquius, que es jubila",
            "recent": true
          }
        ]
      },
      {
        "title": "Parlament i institucions",
        "icon": "⚖️",
        "entries": [
          {
            "flag": "🏛️",
            "position": "President del Parlament de Catalunya",
            "name": "Josep Rull",
            "detail": "Junts · des de juny de 2024"
          },
          {
            "flag": "🛡️",
            "position": "Síndica de Greuges de Catalunya",
            "name": "Esther Giménez-Salinas"
          },
          {
            "flag": "⚖️",
            "position": "Presidenta del Tribunal Superior de Justícia de Catalunya",
            "name": "Mercè Caso",
            "detail": "Des d'abril de 2025"
          },
          {
            "flag": "⚖️",
            "position": "Fiscal superior de Catalunya",
            "name": "Francisco Bañeres"
          },
          {
            "flag": "🇪🇸",
            "position": "Delegat del Govern espanyol a Catalunya",
            "name": "Carlos Prieto"
          },
          {
            "flag": "🏛️",
            "position": "Presidenta de la Diputació de Barcelona",
            "name": "Lluïsa Moret",
            "detail": "PSC · alcaldessa de Sant Boi"
          }
        ]
      },
      {
        "title": "Partits i entitats",
        "icon": "🗳️",
        "entries": [
          {
            "flag": "🔴",
            "position": "PSC · primer secretari",
            "name": "Salvador Illa"
          },
          {
            "flag": "🟠",
            "position": "Junts · president",
            "name": "Carles Puigdemont"
          },
          {
            "flag": "🟡",
            "position": "ERC · president",
            "name": "Oriol Junqueras"
          },
          {
            "flag": "🔵",
            "position": "PP català · president",
            "name": "Alejandro Fernández"
          },
          {
            "flag": "🟢",
            "position": "Vox Catalunya · líder",
            "name": "Ignacio Garriga"
          },
          {
            "flag": "⚫",
            "position": "Aliança Catalana · líder",
            "name": "Sílvia Orriols"
          },
          {
            "flag": "🎗️",
            "position": "President d'Òmnium Cultural",
            "name": "Xavier Antich"
          },
          {
            "flag": "🎗️",
            "position": "President de l'Assemblea Nacional Catalana",
            "name": "Lluís Llach"
          }
        ]
      }
    ]
  },
  {
    "id": "unio-europea",
    "title": "Unió Europea",
    "shortLabel": "UE",
    "icon": "🇪🇺",
    "accent": "from-blue-500 to-indigo-700",
    "subsections": [
      {
        "title": "Institucions de la UE",
        "icon": "🇪🇺",
        "entries": [
          {
            "flag": "🇪🇺",
            "position": "Presidenta de la Comissió Europea",
            "name": "Ursula von der Leyen",
            "detail": "Segon mandat, des de desembre de 2024"
          },
          {
            "flag": "🇪🇺",
            "position": "President del Consell Europeu",
            "name": "António Costa",
            "detail": "Des de desembre de 2024"
          },
          {
            "flag": "🇪🇺",
            "position": "Presidenta del Parlament Europeu",
            "name": "Roberta Metsola",
            "detail": "Mandat fins al gener de 2027"
          },
          {
            "flag": "🇪🇺",
            "position": "Alta Representant per a Afers Exteriors",
            "name": "Kaja Kallas",
            "detail": "També vicepresidenta de la Comissió"
          },
          {
            "flag": "💶",
            "position": "Presidenta del Banc Central Europeu",
            "name": "Christine Lagarde"
          },
          {
            "flag": "💶",
            "position": "President de l'Eurogrup",
            "name": "Kyriakos Pierrakakis",
            "detail": "Grècia · des de gener de 2026"
          },
          {
            "flag": "⚖️",
            "position": "President del Tribunal de Justícia de la UE",
            "name": "Koen Lenaerts"
          },
          {
            "flag": "💶",
            "position": "Presidenta del Banc Europeu d'Inversions",
            "name": "Nadia Calviño"
          },
          {
            "flag": "🛡️",
            "position": "Defensora del Poble Europeu",
            "name": "Teresa Anjinho"
          },
          {
            "flag": "🇮🇪",
            "position": "Presidència del Consell de la UE",
            "name": "Irlanda",
            "detail": "Juliol-desembre de 2026; després, Lituània (gener-juny de 2027)"
          },
          {
            "flag": "👮",
            "position": "Director executiu d'Europol (en funcions)",
            "name": "Jürgen Ebner",
            "detail": "Des de maig de 2026, quan Catherine De Bolle va plegar"
          }
        ]
      }
    ]
  },
  {
    "id": "organismes",
    "title": "Organismes internacionals",
    "shortLabel": "Organismes",
    "icon": "🌐",
    "accent": "from-cyan-500 to-sky-700",
    "subsections": [
      {
        "title": "ONU i agències",
        "icon": "🇺🇳",
        "entries": [
          {
            "flag": "🇺🇳",
            "position": "Secretari general de l'ONU",
            "name": "António Guterres",
            "detail": "Mandat fins al 31 de desembre de 2026. El Consell de Seguretat tria el successor; als sondejos lideren Carolyn Rodrigues Birkett, Rebeca Grynspan i Rafael Grossi"
          },
          {
            "flag": "🇺🇳",
            "position": "President de l'Assemblea General de l'ONU",
            "name": "Khalilur Rahman",
            "detail": "Bangladesh · 81a sessió, des del 8 de setembre de 2026",
            "recent": true
          },
          {
            "flag": "🩺",
            "position": "Director general de l'OMS",
            "name": "Tedros Adhanom Ghebreyesus"
          },
          {
            "flag": "🎓",
            "position": "Director general de la UNESCO",
            "name": "Khaled El-Enany",
            "detail": "Egipte · des de novembre de 2025; primer director general d'un país àrab"
          },
          {
            "flag": "🏕️",
            "position": "Alt Comissionat de l'ONU per als Refugiats (ACNUR)",
            "name": "Barham Salih",
            "detail": "Expresident d'Iraq · des de gener de 2026"
          },
          {
            "flag": "⚛️",
            "position": "Director general de l'OIEA",
            "name": "Rafael Grossi"
          },
          {
            "flag": "🕊️",
            "position": "Alt Comissionat de l'ONU per als Drets Humans",
            "name": "Volker Türk"
          },
          {
            "flag": "🧒",
            "position": "Directora executiva d'UNICEF",
            "name": "Catherine Russell"
          }
        ]
      },
      {
        "title": "Seguretat, justícia i economia",
        "icon": "🛡️",
        "entries": [
          {
            "flag": "🛡️",
            "position": "Secretari general de l'OTAN",
            "name": "Mark Rutte",
            "detail": "Des d'octubre de 2024; abans, primer ministre dels Països Baixos"
          },
          {
            "flag": "🚓",
            "position": "Secretari general d'Interpol",
            "name": "Valdecy Urquiza",
            "detail": "Brasil"
          },
          {
            "flag": "⚖️",
            "position": "Presidenta de la Cort Penal Internacional",
            "name": "Tomoko Akane"
          },
          {
            "flag": "⚖️",
            "position": "President del Tribunal Europeu de Drets Humans",
            "name": "Mattias Guyomar",
            "detail": "França · des de maig de 2025"
          },
          {
            "flag": "🏛️",
            "position": "Secretari general del Consell d'Europa",
            "name": "Alain Berset"
          },
          {
            "flag": "🕊️",
            "position": "Secretari general de l'OSCE",
            "name": "Feridun Sinirlioğlu"
          },
          {
            "flag": "💵",
            "position": "Directora gerent del FMI",
            "name": "Kristalina Georgieva"
          },
          {
            "flag": "💵",
            "position": "President del Banc Mundial",
            "name": "Ajay Banga"
          },
          {
            "flag": "📦",
            "position": "Directora general de l'OMC",
            "name": "Ngozi Okonjo-Iweala"
          },
          {
            "flag": "📈",
            "position": "Secretari general de l'OCDE",
            "name": "Mathias Cormann"
          },
          {
            "flag": "🏅",
            "position": "Presidenta del Comitè Olímpic Internacional",
            "name": "Kirsty Coventry",
            "detail": "Primera dona al càrrec · des de juny de 2025"
          }
        ]
      }
    ]
  },
  {
    "id": "europa",
    "title": "Europa: caps d'Estat i de govern",
    "shortLabel": "Europa",
    "icon": "🏰",
    "accent": "from-indigo-500 to-violet-700",
    "subsections": [
      {
        "title": "Els 27 de la Unió Europea",
        "icon": "🇪🇺",
        "compact": true,
        "entries": [
          {
            "flag": "🇩🇪",
            "position": "Alemanya",
            "name": "Friedrich Merz",
            "detail": "Canceller · president: Frank-Walter Steinmeier"
          },
          {
            "flag": "🇦🇹",
            "position": "Àustria",
            "name": "Christian Stocker",
            "detail": "Canceller · president: Alexander Van der Bellen"
          },
          {
            "flag": "🇧🇪",
            "position": "Bèlgica",
            "name": "Bart De Wever",
            "detail": "Primer ministre · rei: Felip (Philippe)"
          },
          {
            "flag": "🇧🇬",
            "position": "Bulgària",
            "name": "Rumen Radev",
            "detail": "Primer ministre des de maig de 2026 (abans havia estat president) · presidenta: Iliana Iotova, la primera dona"
          },
          {
            "flag": "🇨🇾",
            "position": "Xipre",
            "name": "Nikos Christodoulides",
            "detail": "President (sistema presidencial)"
          },
          {
            "flag": "🇭🇷",
            "position": "Croàcia",
            "name": "Andrej Plenković",
            "detail": "Primer ministre · president: Zoran Milanović"
          },
          {
            "flag": "🇩🇰",
            "position": "Dinamarca",
            "name": "Mette Frederiksen",
            "detail": "Primera ministra, tercer mandat després de les eleccions de març de 2026 · rei: Frederic X"
          },
          {
            "flag": "🇸🇰",
            "position": "Eslovàquia",
            "name": "Robert Fico",
            "detail": "Primer ministre · president: Peter Pellegrini"
          },
          {
            "flag": "🇸🇮",
            "position": "Eslovènia",
            "name": "Janez Janša",
            "detail": "Primer ministre per quarta vegada, des de juny de 2026 · presidenta: Nataša Pirc Musar",
            "recent": true
          },
          {
            "flag": "🇪🇸",
            "position": "Espanya",
            "name": "Pedro Sánchez",
            "detail": "President del Govern · rei: Felip VI"
          },
          {
            "flag": "🇪🇪",
            "position": "Estònia",
            "name": "Kristen Michal",
            "detail": "Primer ministre · president: Alar Karis; Ülle Madise, elegida el 2 de setembre, pren possessió el 12 d'octubre de 2026",
            "recent": true
          },
          {
            "flag": "🇫🇮",
            "position": "Finlàndia",
            "name": "Petteri Orpo",
            "detail": "Primer ministre · president: Alexander Stubb"
          },
          {
            "flag": "🇫🇷",
            "position": "França",
            "name": "Emmanuel Macron",
            "detail": "President · primer ministre: Sébastien Lecornu"
          },
          {
            "flag": "🇬🇷",
            "position": "Grècia",
            "name": "Kyriakos Mitsotakis",
            "detail": "Primer ministre · president: Konstantinos Tasoulas"
          },
          {
            "flag": "🇭🇺",
            "position": "Hongria",
            "name": "Péter Magyar",
            "detail": "Primer ministre des del 9 de maig de 2026; posa fi a 16 anys d'Orbán · president: András Baka, des d'agost de 2026",
            "recent": true
          },
          {
            "flag": "🇮🇪",
            "position": "Irlanda",
            "name": "Micheál Martin",
            "detail": "Taoiseach · presidenta: Catherine Connolly"
          },
          {
            "flag": "🇮🇹",
            "position": "Itàlia",
            "name": "Giorgia Meloni",
            "detail": "Primera ministra · president: Sergio Mattarella"
          },
          {
            "flag": "🇱🇻",
            "position": "Letònia",
            "name": "Andris Kulbergs",
            "detail": "Primer ministre des del 28 de maig de 2026 · president: Edgars Rinkēvičs"
          },
          {
            "flag": "🇱🇹",
            "position": "Lituània",
            "name": "Mindaugas Sinkevičius",
            "detail": "Primer ministre des de juliol de 2026 · president: Gitanas Nausėda",
            "recent": true
          },
          {
            "flag": "🇱🇺",
            "position": "Luxemburg",
            "name": "Luc Frieden",
            "detail": "Primer ministre · gran duc: Guillem V"
          },
          {
            "flag": "🇲🇹",
            "position": "Malta",
            "name": "Robert Abela",
            "detail": "Primer ministre · presidenta: Myriam Spiteri Debono"
          },
          {
            "flag": "🇳🇱",
            "position": "Països Baixos",
            "name": "Rob Jetten",
            "detail": "Primer ministre des del 23 de febrer de 2026, el més jove de la història del país · rei: Guillem Alexandre"
          },
          {
            "flag": "🇵🇱",
            "position": "Polònia",
            "name": "Donald Tusk",
            "detail": "Primer ministre · president: Karol Nawrocki"
          },
          {
            "flag": "🇵🇹",
            "position": "Portugal",
            "name": "Luís Montenegro",
            "detail": "Primer ministre · president: António José Seguro, des del 9 de març de 2026"
          },
          {
            "flag": "🇷🇴",
            "position": "Romania",
            "name": "Ilie Bolojan",
            "detail": "Primer ministre en funcions: el seu govern va caure el maig de 2026 i el Parlament ha rebutjat els candidats alternatius · president: Nicușor Dan"
          },
          {
            "flag": "🇸🇪",
            "position": "Suècia",
            "name": "Ulf Kristersson",
            "detail": "Primer ministre · eleccions del 13 de setembre de 2026 amb un resultat molt ajustat · rei: Carles XVI Gustau",
            "recent": true
          },
          {
            "flag": "🇨🇿",
            "position": "Txèquia",
            "name": "Andrej Babiš",
            "detail": "Primer ministre des de desembre de 2025 · president: Petr Pavel"
          }
        ]
      },
      {
        "title": "Resta d'Europa",
        "icon": "🗺️",
        "compact": true,
        "entries": [
          {
            "flag": "🇬🇧",
            "position": "Regne Unit",
            "name": "Andy Burnham",
            "detail": "Primer ministre des del 20 de juliol de 2026; substitueix Keir Starmer · rei: Carles III",
            "recent": true
          },
          {
            "flag": "🇳🇴",
            "position": "Noruega",
            "name": "Jonas Gahr Støre",
            "detail": "Primer ministre · rei: Haakon VIII, des del 28 d'agost de 2026 per la mort de Harald V",
            "recent": true
          },
          {
            "flag": "🇨🇭",
            "position": "Suïssa",
            "name": "Guy Parmelin",
            "detail": "President de la Confederació el 2026 (el càrrec és rotatori i anual)"
          },
          {
            "flag": "🇮🇸",
            "position": "Islàndia",
            "name": "Kristrún Frostadóttir",
            "detail": "Primera ministra · presidenta: Halla Tómasdóttir"
          },
          {
            "flag": "🇦🇩",
            "position": "Andorra",
            "name": "Xavier Espot",
            "detail": "Cap de Govern · coprínceps: Emmanuel Macron i el bisbe d'Urgell, Josep-Lluís Serrano Pentinat"
          },
          {
            "flag": "🇲🇨",
            "position": "Mònaco",
            "name": "Albert II",
            "detail": "Príncep sobirà · ministre d'Estat: Christophe Mirmand"
          },
          {
            "flag": "🇱🇮",
            "position": "Liechtenstein",
            "name": "Brigitte Haas",
            "detail": "Primera ministra · príncep: Joan Adam II"
          },
          {
            "flag": "🇸🇲",
            "position": "San Marino",
            "name": "Alice Mina i Vladimiro Selva",
            "detail": "Capitans regents (canvien cada sis mesos)"
          },
          {
            "flag": "🇺🇦",
            "position": "Ucraïna",
            "name": "Volodímir Zelenski",
            "detail": "President · primer ministre: Serhí Koretski, des del 16 de juliol de 2026",
            "recent": true
          },
          {
            "flag": "🇷🇺",
            "position": "Rússia",
            "name": "Vladímir Putin",
            "detail": "President · primer ministre: Mikhaïl Mixustin"
          },
          {
            "flag": "🇧🇾",
            "position": "Bielorússia",
            "name": "Aleksandr Lukaixenko",
            "detail": "President · primer ministre: Aleksandr Turtxin"
          },
          {
            "flag": "🇹🇷",
            "position": "Turquia",
            "name": "Recep Tayyip Erdoğan",
            "detail": "President"
          },
          {
            "flag": "🇷🇸",
            "position": "Sèrbia",
            "name": "Aleksandar Vučić",
            "detail": "President · primer ministre: Đuro Macut · eleccions anticipades el 25 d'octubre de 2026"
          },
          {
            "flag": "🇲🇩",
            "position": "Moldàvia",
            "name": "Maia Sandu",
            "detail": "Presidenta · primer ministre: Vasile Tofan, des de juliol de 2026",
            "recent": true
          },
          {
            "flag": "🇲🇰",
            "position": "Macedònia del Nord",
            "name": "Hristijan Mickoski",
            "detail": "Primer ministre · presidenta: Gordana Siljanovska-Davkova"
          },
          {
            "flag": "🇦🇱",
            "position": "Albània",
            "name": "Edi Rama",
            "detail": "Primer ministre · president: Bajram Begaj"
          },
          {
            "flag": "🇲🇪",
            "position": "Montenegro",
            "name": "Milojko Spajić",
            "detail": "Primer ministre · president: Jakov Milatović"
          },
          {
            "flag": "🇧🇦",
            "position": "Bòsnia i Hercegovina",
            "name": "Borjana Krišto",
            "detail": "Presidenta del Consell de Ministres · presidència col·legiada de tres membres"
          },
          {
            "flag": "🇽🇰",
            "position": "Kosovo",
            "name": "Albin Kurti",
            "detail": "Primer ministre · presidenta en funcions: Albulena Haxhiu, des d'abril de 2026"
          },
          {
            "flag": "🇬🇪",
            "position": "Geòrgia",
            "name": "Irakli Kobakhidze",
            "detail": "Primer ministre · president: Mikheil Kavelashvili"
          },
          {
            "flag": "🇦🇲",
            "position": "Armènia",
            "name": "Nikol Pashinyan",
            "detail": "Primer ministre · el seu partit guanya les eleccions de juny de 2026"
          },
          {
            "flag": "🇦🇿",
            "position": "Azerbaidjan",
            "name": "Ilham Aliyev",
            "detail": "President"
          }
        ]
      }
    ]
  },
  {
    "id": "america",
    "title": "Amèrica",
    "shortLabel": "Amèrica",
    "icon": "🌎",
    "accent": "from-orange-500 to-rose-700",
    "subsections": [
      {
        "title": "Estats Units",
        "icon": "🇺🇸",
        "entries": [
          {
            "flag": "🇺🇸",
            "position": "President dels Estats Units",
            "name": "Donald Trump",
            "detail": "47è president · des del 20 de gener de 2025"
          },
          {
            "flag": "🇺🇸",
            "position": "Vicepresident",
            "name": "JD Vance"
          },
          {
            "flag": "🇺🇸",
            "position": "Secretari d'Estat",
            "name": "Marco Rubio"
          },
          {
            "flag": "🇺🇸",
            "position": "Secretari de Guerra (Defensa)",
            "name": "Pete Hegseth"
          },
          {
            "flag": "🇺🇸",
            "position": "Secretari del Tresor",
            "name": "Scott Bessent"
          },
          {
            "flag": "🇺🇸",
            "position": "Fiscal general",
            "name": "Todd Blanche",
            "detail": "Des d'abril de 2026; substitueix Pam Bondi"
          },
          {
            "flag": "🇺🇸",
            "position": "Secretari de Seguretat Nacional",
            "name": "Markwayne Mullin",
            "detail": "Des de març de 2026; substitueix Kristi Noem"
          },
          {
            "flag": "🇺🇸",
            "position": "Secretari de Salut",
            "name": "Robert F. Kennedy Jr.",
            "detail": "Nebot del president John F. Kennedy"
          },
          {
            "flag": "🇺🇸",
            "position": "Director del FBI",
            "name": "Kash Patel"
          },
          {
            "flag": "🇺🇸",
            "position": "President de la Reserva Federal",
            "name": "Kevin Warsh",
            "detail": "Des del 22 de maig de 2026; substitueix Jerome Powell"
          },
          {
            "flag": "🇺🇸",
            "position": "President de la Cambra de Representants",
            "name": "Mike Johnson"
          },
          {
            "flag": "🇺🇸",
            "position": "President del Tribunal Suprem",
            "name": "John Roberts"
          }
        ]
      },
      {
        "title": "Nord i Centreamèrica i Carib",
        "icon": "🌴",
        "compact": true,
        "entries": [
          {
            "flag": "🇨🇦",
            "position": "Canadà",
            "name": "Mark Carney",
            "detail": "Primer ministre · rei: Carles III"
          },
          {
            "flag": "🇲🇽",
            "position": "Mèxic",
            "name": "Claudia Sheinbaum",
            "detail": "Presidenta, la primera dona · des d'octubre de 2024"
          },
          {
            "flag": "🇬🇹",
            "position": "Guatemala",
            "name": "Bernardo Arévalo",
            "detail": "President"
          },
          {
            "flag": "🇸🇻",
            "position": "El Salvador",
            "name": "Nayib Bukele",
            "detail": "President"
          },
          {
            "flag": "🇭🇳",
            "position": "Hondures",
            "name": "Nasry Asfura",
            "detail": "President"
          },
          {
            "flag": "🇳🇮",
            "position": "Nicaragua",
            "name": "Daniel Ortega i Rosario Murillo",
            "detail": "Copresidents"
          },
          {
            "flag": "🇨🇷",
            "position": "Costa Rica",
            "name": "Laura Fernández",
            "detail": "Presidenta"
          },
          {
            "flag": "🇵🇦",
            "position": "Panamà",
            "name": "José Raúl Mulino",
            "detail": "President"
          },
          {
            "flag": "🇨🇺",
            "position": "Cuba",
            "name": "Miguel Díaz-Canel",
            "detail": "President · primer ministre: Manuel Marrero"
          },
          {
            "flag": "🇩🇴",
            "position": "República Dominicana",
            "name": "Luis Abinader",
            "detail": "President"
          },
          {
            "flag": "🇭🇹",
            "position": "Haití",
            "name": "Alix Didier Fils-Aimé",
            "detail": "Primer ministre · presidència vacant"
          }
        ]
      },
      {
        "title": "Sud-amèrica",
        "icon": "🌎",
        "compact": true,
        "entries": [
          {
            "flag": "🇦🇷",
            "position": "Argentina",
            "name": "Javier Milei",
            "detail": "President"
          },
          {
            "flag": "🇧🇴",
            "position": "Bolívia",
            "name": "Rodrigo Paz",
            "detail": "President"
          },
          {
            "flag": "🇧🇷",
            "position": "Brasil",
            "name": "Luiz Inácio Lula da Silva",
            "detail": "President · eleccions presidencials el 4 d'octubre de 2026"
          },
          {
            "flag": "🇨🇱",
            "position": "Xile",
            "name": "José Antonio Kast",
            "detail": "President des de març de 2026"
          },
          {
            "flag": "🇨🇴",
            "position": "Colòmbia",
            "name": "Abelardo de la Espriella",
            "detail": "President des del 7 d'agost de 2026; guanya Iván Cepeda a la segona volta",
            "recent": true
          },
          {
            "flag": "🇪🇨",
            "position": "Equador",
            "name": "Daniel Noboa",
            "detail": "President"
          },
          {
            "flag": "🇵🇾",
            "position": "Paraguai",
            "name": "Santiago Peña",
            "detail": "President"
          },
          {
            "flag": "🇵🇪",
            "position": "Perú",
            "name": "Keiko Fujimori",
            "detail": "Presidenta des del 28 de juliol de 2026; la primera dona elegida a les urnes",
            "recent": true
          },
          {
            "flag": "🇺🇾",
            "position": "Uruguai",
            "name": "Yamandú Orsi",
            "detail": "President"
          },
          {
            "flag": "🇻🇪",
            "position": "Veneçuela",
            "name": "Delcy Rodríguez",
            "detail": "Presidenta encarregada des del 5 de gener de 2026, després que els EUA capturessin Nicolás Maduro"
          },
          {
            "flag": "🇬🇾",
            "position": "Guyana",
            "name": "Irfaan Ali",
            "detail": "President"
          }
        ]
      }
    ]
  },
  {
    "id": "asia-africa",
    "title": "Àsia, Orient Mitjà i Àfrica",
    "shortLabel": "Àsia i Àfrica",
    "icon": "🌏",
    "accent": "from-rose-500 to-fuchsia-700",
    "subsections": [
      {
        "title": "Àsia i Pacífic",
        "icon": "🌏",
        "compact": true,
        "entries": [
          {
            "flag": "🇨🇳",
            "position": "Xina",
            "name": "Xi Jinping",
            "detail": "President i secretari general del Partit · primer ministre: Li Qiang"
          },
          {
            "flag": "🇯🇵",
            "position": "Japó",
            "name": "Sanae Takaichi",
            "detail": "Primera ministra, la primera dona · emperador: Naruhito"
          },
          {
            "flag": "🇮🇳",
            "position": "Índia",
            "name": "Narendra Modi",
            "detail": "Primer ministre · presidenta: Droupadi Murmu"
          },
          {
            "flag": "🇰🇷",
            "position": "Corea del Sud",
            "name": "Lee Jae-myung",
            "detail": "President des de juny de 2025"
          },
          {
            "flag": "🇰🇵",
            "position": "Corea del Nord",
            "name": "Kim Jong-un",
            "detail": "Líder suprem"
          },
          {
            "flag": "🇵🇰",
            "position": "Pakistan",
            "name": "Shehbaz Sharif",
            "detail": "Primer ministre · president: Asif Ali Zardari"
          },
          {
            "flag": "🇮🇩",
            "position": "Indonèsia",
            "name": "Prabowo Subianto",
            "detail": "President"
          },
          {
            "flag": "🇵🇭",
            "position": "Filipines",
            "name": "Ferdinand Marcos Jr.",
            "detail": "President"
          },
          {
            "flag": "🇻🇳",
            "position": "Vietnam",
            "name": "Tô Lâm",
            "detail": "Secretari general del Partit i, des d'abril de 2026, també president"
          },
          {
            "flag": "🇹🇭",
            "position": "Tailàndia",
            "name": "Anutin Charnvirakul",
            "detail": "Primer ministre, reelegit el març de 2026"
          },
          {
            "flag": "🇧🇩",
            "position": "Bangladesh",
            "name": "Tarique Rahman",
            "detail": "Primer ministre"
          },
          {
            "flag": "🇰🇿",
            "position": "Kazakhstan",
            "name": "Kassym-Jomart Tokàiev",
            "detail": "President"
          },
          {
            "flag": "🇦🇺",
            "position": "Austràlia",
            "name": "Anthony Albanese",
            "detail": "Primer ministre"
          },
          {
            "flag": "🇳🇿",
            "position": "Nova Zelanda",
            "name": "Christopher Luxon",
            "detail": "Primer ministre"
          }
        ]
      },
      {
        "title": "Orient Mitjà",
        "icon": "🕌",
        "compact": true,
        "entries": [
          {
            "flag": "🇮🇱",
            "position": "Israel",
            "name": "Benjamin Netanyahu",
            "detail": "Primer ministre · president: Isaac Herzog"
          },
          {
            "flag": "🇵🇸",
            "position": "Palestina (ANP)",
            "name": "Mohammad Mustafa",
            "detail": "Primer ministre de l'Autoritat Nacional Palestina"
          },
          {
            "flag": "🇮🇷",
            "position": "Iran",
            "name": "Mojtaba Khamenei",
            "detail": "Líder suprem des de març de 2026, després que el seu pare, Ali Khamenei, morís en un atac el 28 de febrer · president: Masoud Pezeshkian"
          },
          {
            "flag": "🇮🇶",
            "position": "Iraq",
            "name": "Ali al-Zaidi",
            "detail": "Primer ministre des de maig de 2026, el més jove de la història del país · president: Nizar Amidi"
          },
          {
            "flag": "🇸🇾",
            "position": "Síria",
            "name": "Ahmed al-Sharaa",
            "detail": "President des de gener de 2025, després de la caiguda d'Assad"
          },
          {
            "flag": "🇱🇧",
            "position": "Líban",
            "name": "Joseph Aoun",
            "detail": "President · primer ministre: Nawaf Salam"
          },
          {
            "flag": "🇸🇦",
            "position": "Aràbia Saudita",
            "name": "Salman bin Abdulaziz",
            "detail": "Rei · príncep hereu i primer ministre: Mohammed bin Salman"
          },
          {
            "flag": "🇦🇪",
            "position": "Emirats Àrabs Units",
            "name": "Mohamed bin Zayed",
            "detail": "President"
          },
          {
            "flag": "🇶🇦",
            "position": "Qatar",
            "name": "Tamim bin Hamad Al Thani",
            "detail": "Emir"
          },
          {
            "flag": "🇯🇴",
            "position": "Jordània",
            "name": "Abdullah II",
            "detail": "Rei · primer ministre: Jafar Hassan"
          },
          {
            "flag": "🇪🇬",
            "position": "Egipte",
            "name": "Abdel Fattah al-Sisi",
            "detail": "President · primer ministre: Mostafa Madbouly"
          }
        ]
      },
      {
        "title": "Àfrica",
        "icon": "🌍",
        "compact": true,
        "entries": [
          {
            "flag": "🇲🇦",
            "position": "Marroc",
            "name": "Mohammed VI",
            "detail": "Rei · primer ministre: Aziz Akhannouch · eleccions legislatives el 23 de setembre de 2026",
            "recent": true
          },
          {
            "flag": "🇩🇿",
            "position": "Algèria",
            "name": "Abdelmadjid Tebboune",
            "detail": "President · primer ministre: Sifi Ghrieb"
          },
          {
            "flag": "🇹🇳",
            "position": "Tunísia",
            "name": "Kaïs Saïed",
            "detail": "President · primera ministra: Sara Zaafarani"
          },
          {
            "flag": "🇿🇦",
            "position": "Sud-àfrica",
            "name": "Cyril Ramaphosa",
            "detail": "President"
          },
          {
            "flag": "🇳🇬",
            "position": "Nigèria",
            "name": "Bola Tinubu",
            "detail": "President"
          },
          {
            "flag": "🇪🇹",
            "position": "Etiòpia",
            "name": "Abiy Ahmed",
            "detail": "Primer ministre"
          },
          {
            "flag": "🇰🇪",
            "position": "Kenya",
            "name": "William Ruto",
            "detail": "President"
          },
          {
            "flag": "🇸🇳",
            "position": "Senegal",
            "name": "Bassirou Diomaye Faye",
            "detail": "President · primer ministre: Ahmadou Al Aminou Lo, des de maig de 2026; Ousmane Sonko, destituït, presideix ara l'Assemblea"
          },
          {
            "flag": "🇬🇭",
            "position": "Ghana",
            "name": "John Mahama",
            "detail": "President"
          },
          {
            "flag": "🇦🇴",
            "position": "Angola",
            "name": "João Lourenço",
            "detail": "President"
          },
          {
            "flag": "🇲🇿",
            "position": "Moçambic",
            "name": "Daniel Chapo",
            "detail": "President"
          },
          {
            "flag": "🇬🇶",
            "position": "Guinea Equatorial",
            "name": "Teodoro Obiang",
            "detail": "President"
          }
        ]
      }
    ]
  },
  {
    "id": "religio",
    "title": "Vaticà i religió",
    "shortLabel": "Religió",
    "icon": "✝️",
    "accent": "from-yellow-400 to-amber-600",
    "subsections": [
      {
        "title": "Església catòlica",
        "icon": "✝️",
        "entries": [
          {
            "flag": "🇻🇦",
            "position": "Papa",
            "name": "Lleó XIV",
            "detail": "Robert Francis Prevost · elegit el 8 de maig de 2025; primer papa nascut als Estats Units. Succeeix Francesc, mort el 21 d'abril de 2025"
          },
          {
            "flag": "🇻🇦",
            "position": "Cardenal secretari d'Estat",
            "name": "Pietro Parolin"
          },
          {
            "flag": "🇻🇦",
            "position": "Presidenta del Governatorat de la Ciutat del Vaticà",
            "name": "Raffaella Petrini",
            "detail": "Primera dona al càrrec"
          },
          {
            "flag": "⛪",
            "position": "President de la Conferència Episcopal Espanyola",
            "name": "Luis Argüello"
          },
          {
            "flag": "🇦🇩",
            "position": "Bisbe d'Urgell i copríncep d'Andorra",
            "name": "Josep-Lluís Serrano Pentinat"
          }
        ]
      }
    ]
  },
  {
    "id": "fets-clau",
    "title": "Fets clau 2025-2026",
    "shortLabel": "Fets clau",
    "icon": "📰",
    "accent": "from-slate-500 to-slate-700",
    "subsections": [
      {
        "title": "Món",
        "icon": "🌍",
        "entries": [
          {
            "flag": "🇻🇪",
            "position": "3 de gener de 2026",
            "name": "Els EUA capturen Nicolás Maduro",
            "detail": "Delcy Rodríguez passa a ser presidenta encarregada de Veneçuela"
          },
          {
            "flag": "🇮🇷",
            "position": "28 de febrer de 2026",
            "name": "Mor Ali Khamenei en un atac",
            "detail": "El seu fill Mojtaba el succeeix com a líder suprem de l'Iran en plena guerra amb els EUA i Israel"
          },
          {
            "flag": "🇭🇺",
            "position": "12 d'abril de 2026",
            "name": "Orbán perd les eleccions a Hongria",
            "detail": "El partit Tisza de Péter Magyar guanya amb majoria de dos terços"
          },
          {
            "flag": "🇬🇧",
            "position": "20 de juliol de 2026",
            "name": "Andy Burnham, primer ministre britànic",
            "detail": "Substitueix Keir Starmer al capdavant del Govern"
          },
          {
            "flag": "🇳🇴",
            "position": "28 d'agost de 2026",
            "name": "Mor el rei Harald V de Noruega",
            "detail": "El succeeix el seu fill, Haakon VIII"
          },
          {
            "flag": "🇺🇳",
            "position": "Setembre de 2026",
            "name": "Cursa per succeir Guterres a l'ONU",
            "detail": "El nou secretari general començarà el gener de 2027"
          }
        ]
      },
      {
        "title": "Espanya i Catalunya",
        "icon": "🇪🇸",
        "entries": [
          {
            "flag": "🟠",
            "position": "Octubre de 2025",
            "name": "Junts trenca amb el PSOE",
            "detail": "Carles Puigdemont escenifica la ruptura de l'acord d'investidura des de Perpinyà"
          },
          {
            "flag": "🌧️",
            "position": "3 de novembre de 2025",
            "name": "Dimiteix Carlos Mazón",
            "detail": "Per la gestió de la DANA del 29 d'octubre de 2024, que va causar 229 morts al País Valencià"
          },
          {
            "flag": "⚖️",
            "position": "Novembre de 2025",
            "name": "Dimiteix el fiscal general de l'Estat",
            "detail": "Álvaro García Ortiz, condemnat pel Tribunal Suprem per revelació de secrets; el substitueix Teresa Peramato"
          },
          {
            "flag": "🏦",
            "position": "Octubre de 2025",
            "name": "Fracassa l'OPA del BBVA sobre el Sabadell",
            "detail": "L'oferta hostil no arriba al mínim d'acceptació"
          },
          {
            "flag": "🎤",
            "position": "Maig de 2026",
            "name": "Espanya no va a Eurovisió",
            "detail": "Boicot de RTVE per la participació d'Israel"
          },
          {
            "flag": "👮",
            "position": "9 de setembre de 2026",
            "name": "Dimiteix Josep Lluís Trapero",
            "detail": "Deixa la direcció general de la Policia després de perdre la confiança de la consellera Parlon; el substitueix Ferran López",
            "recent": true
          },
          {
            "flag": "👮",
            "position": "15 de setembre de 2026",
            "name": "Sílvia Catà, primera comissària en cap dels Mossos",
            "detail": "Substitueix Miquel Esquius. El mateix dia, Ferran López pren possessió com a director general",
            "recent": true
          }
        ]
      }
    ]
  }
];
