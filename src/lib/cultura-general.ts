// Directori de Cultura General — material d'estudi organitzat en 7
// matèries (subcategories) per a opositors i interessats. Mateix
// patró que personalitats.ts / esports.ts / premis.ts.
//
// Per ampliar contingut: afegir entrades dins de la secció corresponent.
// L'ordre dels camps és lliure dins de cada secció.

export type CultEntry = {
  /** Categoria, data o etiqueta principal (ex. "1789 · REVOLUCIÓ FRANCESA"). */
  position: string;
  /** Concepte / nom destacat (ex. "Presa de la Bastilla, 14 de juliol"). */
  name: string;
  /** Detall ampliat (causes, conseqüències, dades clau). */
  detail?: string;
  /** Emoji o símbol que reforça la lectura visual. */
  flag?: string;
  /** Marcar com a 'imprescindible' (apareix amb badge). */
  recent?: boolean;
};

export type CultSubsection = {
  title?: string;
  icon?: string;
  compact?: boolean;
  entries: CultEntry[];
};

export type CultSection = {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  accent: string;
  subsections: CultSubsection[];
};

export const CULTURA_UPDATED_AT = '2026-05-03';

export const CULTURA: CultSection[] = [
  {
    id: 'historia',
    title: 'Història',
    shortLabel: 'Història',
    icon: '📜',
    accent: 'from-amber-600 to-orange-700',
    subsections: [
      {
        title: 'Cronologia universal — fites essencials',
        icon: '🌍',
        entries: [
          { flag: '🏛️', position: '476 dC', name: 'Caiguda de l\'Imperi Romà d\'Occident', detail: "Inici de l'Edat Mitjana. Última deposició: emperador Ròmul Augústul." },
          { flag: '⚓', position: '1492', name: 'Descobriment d\'Amèrica', detail: 'Cristòfor Colom arriba a Guanahaní (Bahames). Inici de l\'Edat Moderna.', recent: true },
          { flag: '⚔️', position: '1789-1799', name: 'Revolució Francesa', detail: 'Presa de la Bastilla (14 juliol 1789), final de la monarquia absoluta. Lema: Llibertat, Igualtat, Fraternitat.', recent: true },
          { flag: '🌍', position: '1914-1918', name: 'Primera Guerra Mundial', detail: 'Detonant: assassinat de Francesc Ferran d\'Àustria. Tractat de Versalles (1919).' },
          { flag: '🌍', position: '1939-1945', name: 'Segona Guerra Mundial', detail: 'Inici: invasió de Polònia per Alemanya. Final: rendició del Japó després de Hiroshima i Nagasaki.', recent: true },
          { flag: '🧱', position: '1989', name: 'Caiguda del Mur de Berlín', detail: 'Final de la Guerra Freda i reunificació alemanya (1990).' },
        ],
      },
      {
        title: 'Història d\'Espanya',
        icon: '🇪🇸',
        entries: [
          { flag: '🕌', position: '711', name: 'Invasió musulmana', detail: 'Tariq ibn Ziyad creua l\'Estret de Gibraltar. 8 segles de presència musulmana fins al 1492.' },
          { flag: '👑', position: '1469', name: 'Matrimoni dels Reis Catòlics', detail: 'Isabel I de Castella + Ferran II d\'Aragó. Unió dinàstica que conduirà a l\'Espanya unificada.', recent: true },
          { flag: '⚓', position: '1898', name: 'Pèrdua de les colònies (Desastre del 98)', detail: 'Cuba, Puerto Rico, Filipines i Guam després de la guerra amb els EUA.' },
          { flag: '⚔️', position: '1936-1939', name: 'Guerra Civil Espanyola', detail: 'Cop d\'estat del 18 juliol 1936. Inici de la dictadura franquista (fins 1975).', recent: true },
          { flag: '📜', position: '1978', name: 'Constitució Espanyola', detail: 'Aprovada per referèndum el 6 desembre. Estableix l\'Estat democràtic, social i de dret.', recent: true },
        ],
      },
    ],
  },

  {
    id: 'invents',
    title: 'Invents i inventors',
    shortLabel: 'Invents',
    icon: '💡',
    accent: 'from-yellow-500 to-orange-600',
    subsections: [
      {
        title: 'Prehistòria',
        icon: '🪨',
        entries: [
          // ── Paleolític Inferior ───────────────────────────────────
          { flag: '🔥', position: 'PALEOLÍTIC INFERIOR · 600.000 aC', name: 'Foc', detail: 'Homo erectus.' },
          { flag: '🪨', position: 'PALEOLÍTIC INFERIOR · 500.000 aC', name: 'Destral de mà / bifaç' },
          { flag: '🪵', position: 'PALEOLÍTIC INFERIOR · 400.000 aC', name: 'Llança de fusta' },
          // ── Paleolític Mitjà ──────────────────────────────────────
          { flag: '🪨', position: 'PALEOLÍTIC MITJÀ · 100.000 aC', name: 'Útils de pedra per percussió', detail: 'Homo neanderthalensis.' },
          { flag: '🦴', position: 'PALEOLÍTIC MITJÀ · 75.000 aC', name: "Indústria de l'os" },
          { flag: '⚱️', position: 'PALEOLÍTIC MITJÀ · 60.000 aC', name: 'Enterraments rituals' },
          // ── Paleolític Superior ───────────────────────────────────
          { flag: '🪔', position: 'PALEOLÍTIC SUPERIOR · 50.000 aC', name: "Llum d'oli" },
          { flag: '🎨', position: 'PALEOLÍTIC SUPERIOR · 45.000 aC', name: 'Pintura rupestre', detail: 'Altamira (Espanya), Lascaux (França).', recent: true },
          { flag: '🪡', position: 'PALEOLÍTIC SUPERIOR · 30.000 aC', name: "Agulla de cosir d'os" },
          { flag: '🏹', position: 'PALEOLÍTIC SUPERIOR · 20.000 aC', name: 'Arc i fletxa' },
          { flag: '🔨', position: 'PALEOLÍTIC SUPERIOR · 10.000 aC', name: 'Martell de pedra' },
          // ── Mesolític ─────────────────────────────────────────────
          { flag: '🏺', position: 'MESOLÍTIC · 8.000 aC', name: 'Ceràmica primitiva' },
          { flag: '🚣', position: 'MESOLÍTIC · 7.500 aC', name: 'Vaixell de rems' },
          { flag: '🧱', position: 'MESOLÍTIC · 6.000 aC', name: 'Maó / totxo' },
          // ── Neolític ──────────────────────────────────────────────
          { flag: '🌾', position: 'NEOLÍTIC · 4.000 aC', name: 'Arada' },
          { flag: '⛵', position: 'NEOLÍTIC · 3.500 aC', name: 'Vela (navegació)', detail: 'Egipte.' },
          { flag: '⚙️', position: 'NEOLÍTIC · 3.200 aC', name: 'Roda', detail: 'Mesopotàmia.', recent: true },
          { flag: '📅', position: 'NEOLÍTIC · 3.000 aC', name: 'Calendari', detail: 'Sumeris i egipcis.' },
          { flag: '📜', position: 'NEOLÍTIC · 3.000 aC', name: 'Escriptura cuneïforme', detail: 'Sumeris.', recent: true },
        ],
      },
      {
        title: 'Edat Antiga (3000 aC - 476 dC)',
        icon: '🏛️',
        entries: [
          // ── Mesopotàmia / Egipte ──────────────────────────────────
          { flag: '🇪🇬', position: 'MESOPOTÀMIA / EGIPTE', name: 'Escriptura jeroglífica', detail: 'Egipcis.' },
          { flag: '🇪🇬', position: 'EGIPTE · 3.000 aC', name: 'Papir' },
          { flag: '🇮🇶', position: 'SUMERIS', name: 'Sistema sexagesimal', detail: 'Base 60 — base del càlcul horari.' },
          { flag: '🍷', position: 'EGIPTE / MESOPOTÀMIA · 3.500 aC', name: 'Vidre' },
          { flag: '🍺', position: 'SUMERIS', name: 'Cervesa' },
          // ── Grècia clàssica ───────────────────────────────────────
          { flag: '🇬🇷', position: 'GRÈCIA · s. III aC', name: "Cargol d'Arquímedes", detail: 'Arquímedes — elevació d\'aigua.' },
          { flag: '🇬🇷', position: 'GRÈCIA · s. III aC', name: 'Palanca i politja', detail: 'Arquímedes — màquines simples.' },
          { flag: '🇬🇷', position: 'GRÈCIA', name: 'Geometria', detail: "Euclides — Els Elements." },
          { flag: '🇬🇷', position: 'GRÈCIA', name: 'Teorema de Pitàgores', detail: 'Pitàgores — a² + b² = c².', recent: true },
          { flag: '🇬🇷', position: 'GRÈCIA', name: 'Astrolabi', detail: 'Hiparc de Nicea — astronomia i navegació.' },
          { flag: '🇬🇷', position: 'GRÈCIA', name: 'Odòmetre', detail: "Heró d'Alexandria." },
          // ── Roma ──────────────────────────────────────────────────
          { flag: '🇮🇹', position: 'ROMA', name: 'Formigó (opus caementicium)', detail: 'Bases de l\'enginyeria romana.' },
          { flag: '🇮🇹', position: 'ROMA', name: 'Aqüeductes i clavegueram' },
          { flag: '🇮🇹', position: 'ROMA', name: 'Calçades romanes', detail: 'Xarxa viària de l\'imperi.' },
          { flag: '📅', position: 'ROMA · 46 aC', name: 'Calendari julià', detail: 'Juli Cèsar — base del calendari occidental fins al gregorià (1582).', recent: true },
          { flag: '⚖️', position: 'ROMA', name: 'Codis legals', detail: 'Base del dret continental.' },
          // ── Xina antiga ───────────────────────────────────────────
          { flag: '🇨🇳', position: 'XINA · s. II aC', name: 'Brúixola' },
          { flag: '🇨🇳', position: 'XINA · 105 dC', name: 'Paper', detail: 'Cai Lun.', recent: true },
          { flag: '🇨🇳', position: 'XINA', name: 'Seda', detail: 'Ruta de la Seda.' },
          { flag: '🇨🇳', position: 'XINA · 132 dC', name: 'Sismògraf', detail: 'Zhang Heng.' },
        ],
      },
      {
        title: 'Edat Mitjana (476 - 1492)',
        icon: '⛪',
        entries: [
          { flag: '🇨🇳', position: 'XINA · s. IX', name: 'Pólvora' },
          { flag: '🇨🇳', position: 'XINA · s. IX', name: 'Paper moneda' },
          { flag: '🇨🇳', position: 'XINA · s. XI', name: 'Brúixola magnètica' },
          { flag: '🇪🇺', position: 'EUROPA · s. XII', name: 'Molí de vent' },
          { flag: '⏰', position: 'EUROPA · s. XIII', name: 'Rellotge mecànic' },
          { flag: '🇮🇹', position: 'ITÀLIA · 1285', name: 'Ulleres', detail: 'Salvino degli Armati.' },
          { flag: '📚', position: 'ALEMANYA · 1440', name: 'Imprempta de tipus mòbils', detail: 'Johannes Gutenberg — revolució del coneixement.', recent: true },
          { flag: '🔫', position: 'EUROPA · s. XV', name: 'Arcabús' },
          { flag: '🔢', position: 'EUROPA', name: 'Xifres aràbigues a Europa', detail: 'Introduïdes per Fibonacci (Liber Abaci, 1202).' },
        ],
      },
      {
        title: 'Renaixement i Edat Moderna (1492 - 1789)',
        icon: '🌍',
        entries: [
          // ── Segles XV-XVI ─────────────────────────────────────────
          { flag: '🇬🇧', position: 'S. XV-XVI · 1564', name: 'Llapis de grafit' },
          { flag: '🇳🇱', position: 'S. XV-XVI · 1590', name: 'Microscopi', detail: 'Zacharias Janssen.' },
          { flag: '🇬🇧', position: 'S. XV-XVI · 1596', name: 'Vàter amb cisterna', detail: 'John Harington.' },
          { flag: '🔭', position: 'S. XV-XVI · 1608', name: 'Telescopi', detail: 'Hans Lippershey · perfeccionat per Galileu Galilei (1609).', recent: true },
          // ── Segle XVII ────────────────────────────────────────────
          { flag: '🌡️', position: 'S. XVII · 1592', name: 'Termòmetre', detail: 'Galileu Galilei.' },
          { flag: '🇫🇷', position: 'S. XVII · 1642', name: 'Calculadora mecànica (Pascalina)', detail: 'Blaise Pascal — primera calculadora mecànica.' },
          { flag: '🇮🇹', position: 'S. XVII · 1643', name: 'Baròmetre', detail: 'Evangelista Torricelli.' },
          { flag: '🇳🇱', position: 'S. XVII · 1656', name: 'Rellotge de pèndul', detail: 'Christiaan Huygens.' },
          { flag: '🍎', position: 'S. XVII · 1687', name: 'Llei de gravitació universal', detail: 'Isaac Newton — Principia Mathematica.', recent: true },
          { flag: '🚂', position: 'S. XVII · 1698', name: 'Màquina de vapor primitiva', detail: 'Thomas Savery.' },
          // ── Segle XVIII ───────────────────────────────────────────
          { flag: '🎹', position: 'S. XVIII · 1700', name: 'Piano', detail: 'Bartolomeo Cristofori.' },
          { flag: '⚡', position: 'S. XVIII · 1752', name: 'Parallamps', detail: 'Benjamin Franklin.' },
          { flag: '🚂', position: 'S. XVIII · 1769', name: 'Màquina de vapor moderna', detail: 'James Watt — motor de la Revolució Industrial.', recent: true },
          { flag: '🎈', position: 'S. XVIII · 1783', name: 'Globus aerostàtic', detail: 'Germans Montgolfier.' },
          { flag: '💉', position: 'S. XVIII · 1796', name: 'Vacuna de la verola', detail: 'Edward Jenner — primera vacuna de la història.' },
          { flag: '🔋', position: 'S. XVIII · 1799', name: 'Pila voltaica', detail: 'Alessandro Volta.', recent: true },
        ],
      },
      {
        title: 'Segle XIX — Revolució Industrial',
        icon: '🏭',
        entries: [
          // ── Transport ─────────────────────────────────────────────
          { flag: '🚂', position: 'TRANSPORT · 1814', name: 'Locomotora de vapor', detail: 'George Stephenson.' },
          { flag: '🚲', position: 'TRANSPORT · 1817', name: 'Bicicleta', detail: 'Karl Drais.' },
          { flag: '⚙️', position: 'TRANSPORT · 1876', name: 'Motor de combustió interna', detail: 'Nikolaus Otto.' },
          { flag: '🚗', position: 'TRANSPORT · 1886', name: 'Automòbil', detail: 'Karl Benz — Benz Patent-Motorwagen.', recent: true },
          { flag: '⚫', position: 'TRANSPORT · 1888', name: 'Pneumàtic', detail: 'John Boyd Dunlop.' },
          { flag: '⛽', position: 'TRANSPORT · 1893', name: 'Motor dièsel', detail: 'Rudolf Diesel.' },
          // ── Comunicació ───────────────────────────────────────────
          { flag: '📡', position: 'COMUNICACIÓ · 1837', name: 'Telègraf elèctric / codi Morse', detail: 'Samuel Morse.' },
          { flag: '☎️', position: 'COMUNICACIÓ · 1876', name: 'Telèfon', detail: 'Alexander Graham Bell.', recent: true },
          { flag: '🔊', position: 'COMUNICACIÓ · 1877', name: 'Fonògraf', detail: 'Thomas Edison — primer enregistrament de so.' },
          { flag: '📻', position: 'COMUNICACIÓ · 1895', name: 'Ràdio', detail: 'Guglielmo Marconi.', recent: true },
          // ── Imatge ────────────────────────────────────────────────
          { flag: '📷', position: 'IMATGE · 1839', name: 'Fotografia (daguerreotip)', detail: 'Louis Daguerre.' },
          { flag: '🎬', position: 'IMATGE · 1895', name: 'Cinematògraf', detail: 'Germans Lumière — primera projecció pública (28 desembre, París).', recent: true },
          // ── Electricitat i ciència ────────────────────────────────
          { flag: '⚡', position: 'ELECTRICITAT · 1831', name: 'Dinamo', detail: 'Michael Faraday — inducció electromagnètica.' },
          { flag: '💡', position: 'ELECTRICITAT · 1879', name: 'Bombeta incandescent', detail: 'Thomas Edison.', recent: true },
          { flag: '⚡', position: 'ELECTRICITAT · 1888', name: 'Corrent altern', detail: 'Nikola Tesla — base de la xarxa elèctrica moderna.' },
          { flag: '☢️', position: 'CIÈNCIA · 1895', name: 'Raigs X', detail: 'Wilhelm Röntgen.', recent: true },
          { flag: '☢️', position: 'CIÈNCIA · 1896', name: 'Radioactivitat', detail: 'Henri Becquerel · aprofundida per Marie i Pierre Curie.', recent: true },
          // ── Vida quotidiana ───────────────────────────────────────
          { flag: '🪡', position: 'VIDA QUOTIDIANA · 1846', name: 'Màquina de cosir', detail: 'Elias Howe.' },
          { flag: '💥', position: 'VIDA QUOTIDIANA · 1867', name: 'Dinamita', detail: 'Alfred Nobel.' },
          { flag: '🤐', position: 'VIDA QUOTIDIANA · 1893', name: 'Cremallera', detail: 'Whitcomb Judson.' },
          { flag: '💊', position: 'VIDA QUOTIDIANA · 1897', name: 'Aspirina', detail: 'Felix Hoffmann (Bayer).' },
        ],
      },
      {
        title: 'Segle XX',
        icon: '✈️',
        entries: [
          // ── Primera meitat ────────────────────────────────────────
          { flag: '✈️', position: '1A MEITAT · 1903', name: 'Avió motoritzat', detail: 'Germans Wright — Kitty Hawk, Carolina del Nord, 17 desembre.', recent: true },
          { flag: '⚛️', position: '1A MEITAT · 1905', name: 'Teoria de la relativitat', detail: 'Albert Einstein — annus mirabilis.', recent: true },
          { flag: '🚗', position: '1A MEITAT · 1908', name: 'Model T (cadena de muntatge)', detail: 'Henry Ford — producció en massa.' },
          { flag: '📺', position: '1A MEITAT · 1926', name: 'Televisió', detail: 'John Logie Baird.' },
          { flag: '💊', position: '1A MEITAT · 1928', name: 'Penicil·lina', detail: 'Alexander Fleming — primer antibiòtic.', recent: true },
          { flag: '🧵', position: '1A MEITAT · 1935', name: 'Nylon', detail: 'Wallace Carothers (DuPont).' },
          { flag: '📡', position: '1A MEITAT · 1935', name: 'Radar', detail: 'Robert Watson-Watt.' },
          { flag: '🖊️', position: '1A MEITAT · 1938', name: 'Bolígraf', detail: 'László Bíró.' },
          { flag: '🚁', position: '1A MEITAT · 1939', name: 'Helicòpter', detail: 'Igor Sikorski.' },
          // ── Segona meitat ─────────────────────────────────────────
          { flag: '☢️', position: '2A MEITAT · 1945', name: 'Bomba atòmica', detail: 'Robert Oppenheimer (Projecte Manhattan).' },
          { flag: '💻', position: '2A MEITAT · 1946', name: 'Ordinador (ENIAC)', detail: 'Eckert i Mauchly — primer ordinador electrònic de propòsit general.' },
          { flag: '🔌', position: '2A MEITAT · 1947', name: 'Transistor', detail: 'Bardeen, Brattain i Shockley (Bell Labs).' },
          { flag: '🧬', position: '2A MEITAT · 1953', name: 'Estructura ADN', detail: 'Watson i Crick (suport de Rosalind Franklin).', recent: true },
          { flag: '💉', position: '2A MEITAT · 1955', name: 'Vacuna poliomielitis', detail: 'Jonas Salk.' },
          { flag: '🛰️', position: '2A MEITAT · 1957', name: 'Satèl·lit (Sputnik)', detail: 'URSS — inici de la cursa espacial.' },
          { flag: '💾', position: '2A MEITAT · 1958', name: 'Microxip', detail: 'Jack Kilby (Texas Instruments).' },
          { flag: '🔆', position: '2A MEITAT · 1960', name: 'Làser', detail: 'Theodore Maiman.' },
          { flag: '🌐', position: '2A MEITAT · 1969', name: 'Internet (ARPANET)', detail: 'Departament de Defensa dels EUA.' },
          { flag: '💾', position: '2A MEITAT · 1971', name: 'Microprocessador', detail: 'Intel — Ted Hoff (4004).' },
          { flag: '📱', position: '2A MEITAT · 1973', name: 'Telèfon mòbil', detail: 'Martin Cooper (Motorola) · comercial 1983.' },
          { flag: '🖥️', position: '2A MEITAT · 1976', name: 'Ordinador personal (Apple I)', detail: 'Steve Jobs i Steve Wozniak.' },
          { flag: '🌐', position: '2A MEITAT · 1989', name: 'World Wide Web', detail: 'Tim Berners-Lee al CERN — HTTP, HTML, URL.', recent: true },
        ],
      },
      {
        title: 'Segle XXI',
        icon: '💻',
        entries: [
          { flag: '📖', position: '2001', name: 'Wikipedia', detail: 'Jimmy Wales i Larry Sanger.' },
          { flag: '👥', position: '2004', name: 'Facebook', detail: 'Mark Zuckerberg (Harvard).' },
          { flag: '▶️', position: '2005', name: 'YouTube', detail: 'Adquirit per Google el 2006.' },
          { flag: '🐦', position: '2006', name: 'Twitter', detail: 'Jack Dorsey · ara X (rebranding 2023).' },
          { flag: '📱', position: '2007', name: 'iPhone (smartphone modern)', detail: 'Steve Jobs (Apple) — revolució mòbil.', recent: true },
          { flag: '₿', position: '2009', name: 'Bitcoin', detail: 'Satoshi Nakamoto (pseudònim) — primera criptomoneda.' },
          { flag: '⚡', position: '2010s', name: 'Cotxe elèctric modern (Tesla)', detail: 'Elon Musk — popularització global.' },
          { flag: '🧬', position: '2012', name: 'CRISPR (edició genètica)', detail: 'Jennifer Doudna i Emmanuelle Charpentier — Nobel 2020.', recent: true },
          { flag: '🤖', position: '2022', name: 'ChatGPT / IA generativa', detail: 'OpenAI — esclat de la intel·ligència artificial conversacional.', recent: true },
        ],
      },
      {
        title: 'A destacar — els més preguntats',
        icon: '⭐',
        entries: [
          { flag: '📚', position: '1440', name: 'Imprempta — Johannes Gutenberg', detail: 'Tipus mòbils.', recent: true },
          { flag: '🔭', position: '1608', name: 'Telescopi — Hans Lippershey / Galileu', detail: 'Astronomia moderna.', recent: true },
          { flag: '🚂', position: '1769', name: 'Màquina de vapor — James Watt', detail: 'Revolució Industrial.', recent: true },
          { flag: '🔋', position: '1799', name: 'Pila elèctrica — Alessandro Volta', detail: 'Primera font d\'electricitat estable.', recent: true },
          { flag: '☎️', position: '1876', name: 'Telèfon — Alexander Graham Bell', recent: true },
          { flag: '💡', position: '1879', name: 'Bombeta — Thomas Edison', recent: true },
          { flag: '📻', position: '1895', name: 'Ràdio — Guglielmo Marconi', recent: true },
          { flag: '🎬', position: '1895', name: 'Cinematògraf — Germans Lumière', recent: true },
          { flag: '☢️', position: '1895', name: 'Raigs X — Wilhelm Röntgen', recent: true },
          { flag: '☢️', position: '1896', name: 'Radioactivitat — Henri Becquerel', recent: true },
          { flag: '✈️', position: '1903', name: 'Avió — Germans Wright', recent: true },
          { flag: '💊', position: '1928', name: 'Penicil·lina — Alexander Fleming', recent: true },
          { flag: '🌐', position: '1989', name: 'WWW (Internet web) — Tim Berners-Lee', recent: true },
        ],
      },
      {
        title: 'Inventors espanyols i catalans destacats',
        icon: '🇪🇸',
        entries: [
          { flag: '🟥', position: '1859', name: 'Submarí (precursor) — Narcís Monturiol', detail: 'Català · vaixell submarí "Ictíneo I" (Barcelona).', recent: true },
          { flag: '🇪🇸', position: '1888', name: 'Submarí — Isaac Peral', detail: 'Primer submarí amb propulsió elèctrica i armament torpede.', recent: true },
          { flag: '🇪🇸', position: 'FINAL S. XIX', name: 'Calculadora digital — Leonardo Torres Quevedo', detail: 'Pioner mundial de la computació mecànica.' },
          { flag: '🇪🇸', position: '1923', name: 'Autogir — Juan de la Cierva', detail: 'Predecessor del helicòpter.' },
          { flag: '🇪🇸', position: '1937', name: 'Futbolí — Alejandro Finisterre', detail: 'Gallec · creat per a invàlids de la Guerra Civil.' },
          { flag: '🇪🇸', position: '1956', name: 'Fregona — Manuel Jalón', detail: 'Aragonès — invent de gran impacte domèstic.' },
          { flag: '🟥', position: '1958', name: 'Xupa-xups — Enric Bernat', detail: 'Català — empresa Chupa Chups (logotip dissenyat per Salvador Dalí, 1969).', recent: true },
          { flag: '🟥', position: 'ATRIBUCIÓ POPULAR', name: "Pinça d'estendre roba", detail: 'Atribució catalana popular.' },
        ],
      },
    ],
  },

  {
    id: 'ciencia',
    title: 'Ciència i física',
    shortLabel: 'Ciència',
    icon: '⚗️',
    accent: 'from-blue-500 to-indigo-700',
    subsections: [
      {
        title: 'Lleis i descobriments fonamentals',
        icon: '🔬',
        entries: [
          { flag: '🍎', position: 'LLEIS DE NEWTON (1687)', name: '3 lleis del moviment + gravitació universal', detail: 'Inèrcia · F=ma · acció-reacció. Base de la mecànica clàssica.', recent: true },
          { flag: '⚛️', position: '1905', name: 'E = mc² — Albert Einstein', detail: 'Equivalència massa-energia. Teoria especial de la relativitat.', recent: true },
          { flag: '🧬', position: '1953', name: 'Estructura ADN — Watson i Crick', detail: 'Doble hèlix amb suport de Rosalind Franklin (Nobel 1962).', recent: true },
          { flag: '🌡️', position: 'TERMODINÀMICA', name: 'Lleis 0a, 1a, 2a i 3a', detail: 'Conservació energia (1a) · entropia (2a) · zero absolut (-273,15°C).' },
          { flag: '⚡', position: '1820', name: 'Electromagnetisme — Faraday i Maxwell', detail: 'Inducció electromagnètica. Bases de la generació elèctrica moderna.' },
          { flag: '☢️', position: '1898', name: 'Radioactivitat — Marie Curie', detail: '2 Nobel: Física (1903) i Química (1911). Descobreix poloni i radi.', recent: true },
        ],
      },
    ],
  },

  {
    id: 'astronomia',
    title: 'Astronomia',
    shortLabel: 'Astronomia',
    icon: '🌌',
    accent: 'from-purple-500 to-indigo-700',
    subsections: [
      {
        title: 'Sistema Solar',
        icon: '🪐',
        entries: [
          { flag: '☀️', position: 'EL SOL', name: 'Estel central · 99,86% de la massa del sistema', detail: 'Distància Terra: 150 milions km (1 ua). Edat: ~4.600 milions d\'anys.', recent: true },
          { flag: '🌍', position: 'PLANETES INTERIORS (rocosos)', name: 'Mercuri · Venus · Terra · Mart', detail: 'Petits, densos, superfície sòlida. Cap o pocs satèl·lits.' },
          { flag: '🪐', position: 'PLANETES EXTERIORS (gegants)', name: 'Júpiter · Saturn · Urà · Neptú', detail: 'Gasosos. Júpiter el més gran. Saturn amb anells. Plutó és planeta nan des del 2006.', recent: true },
          { flag: '🌙', position: 'LA LLUNA', name: 'Únic satèl·lit natural de la Terra', detail: 'Distància: 384.400 km. Influeix marees. Primer humà: Neil Armstrong, Apollo 11 (20 juliol 1969).', recent: true },
          { flag: '☄️', position: 'CINTURÓ D\'ASTEROIDES', name: 'Entre Mart i Júpiter', detail: 'Restes de la formació del sistema. Ceres és el cos més gran (planeta nan).' },
        ],
      },
      {
        title: 'Univers',
        icon: '🌠',
        entries: [
          { flag: '💥', position: 'BIG BANG', name: 'Origen de l\'univers — fa 13.800 milions d\'anys', detail: 'Teoria estàndard de l\'expansió. Confirmada per la radiació còsmica de fons (CMB).', recent: true },
          { flag: '🌌', position: 'VIA LÀCTIA', name: 'La nostra galàxia · 100-400 mil milions d\'estels', detail: 'Diàmetre ~100.000 anys llum. Forma espiral. El Sol està al braç d\'Orió.' },
          { flag: '🌌', position: 'ANDRÒMEDA (M31)', name: 'Galàxia veïna · a 2,5 milions d\'anys llum', detail: 'Col·lisionarà amb la Via Làctia en uns 4.500 milions d\'anys.' },
        ],
      },
    ],
  },

  {
    id: 'geografia',
    title: 'Geografia',
    shortLabel: 'Geografia',
    icon: '🗺️',
    accent: 'from-emerald-500 to-teal-700',
    subsections: [
      {
        title: 'Continents i oceans',
        icon: '🌐',
        entries: [
          { flag: '🌍', position: '7 CONTINENTS', name: 'Àsia · Àfrica · Amèrica del Nord · Amèrica del Sud · Antàrtida · Europa · Oceania', detail: 'Àsia el més extens i poblat. Oceania el menys extens (~9 M km²).', recent: true },
          { flag: '🌊', position: '5 OCEANS', name: 'Pacífic · Atlàntic · Índic · Antàrtic (Austral) · Àrtic', detail: 'Pacífic el més gran (~165 M km², 1/3 superfície terrestre).' },
        ],
      },
      {
        title: 'Capitals europees clau',
        icon: '🏛️',
        compact: true,
        entries: [
          { flag: '🇪🇸', position: 'Espanya', name: 'Madrid' },
          { flag: '🇫🇷', position: 'França', name: 'París' },
          { flag: '🇮🇹', position: 'Itàlia', name: 'Roma' },
          { flag: '🇩🇪', position: 'Alemanya', name: 'Berlín' },
          { flag: '🇬🇧', position: 'Regne Unit', name: 'Londres' },
          { flag: '🇵🇹', position: 'Portugal', name: 'Lisboa' },
          { flag: '🇧🇪', position: 'Bèlgica', name: 'Brussel·les' },
          { flag: '🇳🇱', position: 'Països Baixos', name: 'Amsterdam' },
          { flag: '🇨🇭', position: 'Suïssa', name: 'Berna' },
          { flag: '🇦🇹', position: 'Àustria', name: 'Viena' },
          { flag: '🇬🇷', position: 'Grècia', name: 'Atenes' },
          { flag: '🇸🇪', position: 'Suècia', name: 'Estocolm' },
          { flag: '🇳🇴', position: 'Noruega', name: 'Oslo' },
          { flag: '🇩🇰', position: 'Dinamarca', name: 'Copenhaguen' },
          { flag: '🇫🇮', position: 'Finlàndia', name: 'Hèlsinki' },
        ],
      },
    ],
  },

  {
    id: 'art',
    title: 'Art, literatura i pintura',
    shortLabel: 'Art',
    icon: '🎨',
    accent: 'from-rose-500 to-pink-700',
    subsections: [
      {
        title: 'Pintors imprescindibles',
        icon: '🖼️',
        entries: [
          { flag: '🇪🇸', position: 'PABLO PICASSO (1881-1973)', name: 'Cubisme · Espanya', detail: 'Obres clau: Les Demoiselles d\'Avignon, Guernica.', recent: true },
          { flag: '🇪🇸', position: 'SALVADOR DALÍ (1904-1989)', name: 'Surrealisme · Espanya', detail: 'Obres clau: La persistència de la memòria. Museu Dalí a Figueres.', recent: true },
          { flag: '🇳🇱', position: 'VINCENT VAN GOGH (1853-1890)', name: 'Postimpressionisme · Països Baixos', detail: 'Obres clau: La nit estrellada, Els gira-sols.' },
          { flag: '🇮🇹', position: 'LEONARDO DA VINCI (1452-1519)', name: 'Renaixement · Itàlia', detail: 'Obres clau: La Gioconda (Mona Lisa), L\'últim sopar.', recent: true },
          { flag: '🇪🇸', position: 'DIEGO VELÁZQUEZ (1599-1660)', name: 'Barroc · Espanya', detail: 'Obres clau: Les Menines (al Prado).' },
          { flag: '🇪🇸', position: 'FRANCISCO DE GOYA (1746-1828)', name: 'Romanticisme · Espanya', detail: 'Obres clau: Saturn devorant un fill, La família de Carles IV.' },
        ],
      },
      {
        title: 'Literatura universal',
        icon: '📚',
        entries: [
          { flag: '🇪🇸', position: 'MIGUEL DE CERVANTES (1547-1616)', name: 'Don Quijote de la Mancha (1605/1615)', detail: 'Obra fundacional de la novel·la moderna. Considerat la millor obra en castellà.', recent: true },
          { flag: '🇬🇧', position: 'WILLIAM SHAKESPEARE (1564-1616)', name: 'Hamlet, Romeu i Julieta, Macbeth, El rei Lear', detail: 'Màxim dramaturg de la llengua anglesa.' },
          { flag: '🇩🇪', position: 'JOHANN WOLFGANG VON GOETHE (1749-1832)', name: 'Faust, Les desventures del jove Werther', detail: 'Màxim escriptor en llengua alemanya.' },
          { flag: '🟥', position: 'MERCÈ RODOREDA (1908-1983)', name: 'La plaça del Diamant (1962)', detail: 'Obra fonamental de la literatura catalana del segle XX.', recent: true },
          { flag: '🟥', position: 'JOAN MARAGALL (1860-1911)', name: 'Cant Espiritual · poesia modernista catalana' },
        ],
      },
    ],
  },

  {
    id: 'anatomia',
    title: 'Anatomia humana',
    shortLabel: 'Anatomia',
    icon: '🫀',
    accent: 'from-red-500 to-rose-700',
    subsections: [
      {
        title: 'Sistemes corporals',
        icon: '🧬',
        entries: [
          { flag: '🫀', position: 'SISTEMA CIRCULATORI', name: 'Cor + vasos sanguinis + sang', detail: 'Cor: 4 cambres (2 aurícules, 2 ventricles). Bombeja ~5 L/min. ~100.000 batecs/dia.', recent: true },
          { flag: '🧠', position: 'SISTEMA NERVIÓS', name: 'Cervell + medul·la espinal + nervis', detail: 'SNC + SNP. Cervell: ~86 mil milions de neurones. Pesa ~1,4 kg.', recent: true },
          { flag: '🫁', position: 'SISTEMA RESPIRATORI', name: 'Pulmons + vies aèries', detail: '~16 respiracions/min. Intercanvi O₂ / CO₂ als alvèols.' },
          { flag: '🦴', position: 'SISTEMA OSSI (ESQUELET)', name: '206 ossos en l\'adult (270 en nadons)', detail: 'Suport, protecció, moviment. Os més llarg: fèmur. Més petit: estrep (oïda).', recent: true },
          { flag: '💪', position: 'SISTEMA MUSCULAR', name: 'Més de 600 músculs', detail: '3 tipus: esquelètic (voluntari) · llis (involuntari) · cardíac.' },
          { flag: '🍴', position: 'SISTEMA DIGESTIU', name: 'Boca → esòfag → estómac → intestí prim → gros → recte', detail: 'Procés ~24-72 hores. Òrgans accessoris: fetge, pàncrees, vesícula biliar.' },
        ],
      },
      {
        title: 'Òrgans vitals',
        icon: '🩺',
        compact: true,
        entries: [
          { flag: '🧠', position: 'Cervell', name: 'Centre del SNC' },
          { flag: '🫀', position: 'Cor', name: 'Bomba sanguínia' },
          { flag: '🫁', position: 'Pulmons (×2)', name: 'Intercanvi gasós' },
          { flag: '🟫', position: 'Fetge', name: 'Detoxificació + bilis' },
          { flag: '🫘', position: 'Ronyons (×2)', name: 'Filtració + excreció' },
          { flag: '🟢', position: 'Pàncrees', name: 'Insulina + enzims digestius' },
        ],
      },
    ],
  },
];
