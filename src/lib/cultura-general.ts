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
        title: 'Invents que han canviat el món',
        icon: '🔧',
        entries: [
          { flag: '📞', position: '1876', name: 'Telèfon — Alexander Graham Bell', detail: 'Patentat el 7 de març. Permet la transmissió de la veu humana per fil elèctric.', recent: true },
          { flag: '💡', position: '1879', name: 'Bombeta incandescent — Thomas Edison', detail: 'Filament de carboni en un buit parcial. Comercialització massiva.' },
          { flag: '✈️', position: '1903', name: 'Avió motoritzat — Germans Wright', detail: 'Primer vol controlat amb motor (Kitty Hawk, Carolina del Nord, 17 desembre).' },
          { flag: '🌐', position: '1989', name: 'World Wide Web — Tim Berners-Lee', detail: 'Proposta presentada al CERN. Bases del web modern: HTTP, HTML i URL.', recent: true },
          { flag: '📺', position: '1925', name: 'Televisió — John Logie Baird', detail: 'Primera transmissió de televisió mecànica.' },
          { flag: '🚗', position: '1885', name: 'Automòbil — Karl Benz', detail: 'Patent del primer cotxe amb motor de combustió interna (Benz Patent-Motorwagen).' },
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
