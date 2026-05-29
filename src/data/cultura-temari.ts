// Temari de Cultura General — 16 àrees, ~400 fets clau.
// Dades curades del temari oficial (contingut en castellà, chrome en català).
// Generat des del disseny de Claude Design via scripts/build-cultura-temari.mjs.
//
// Tipus de bloc:
//   sub     → divisor de subsecció { k:'sub', label }
//   defs    → llista terme→definició { k:'defs', title, items:[[t,d],...] }
//   records → targetes etiqueta/valor/nota { k:'records', title, items:[[l,v,n],...] }
//   table   → taula { k:'table', title, head:[...], rows:[[...],...] }
//   chips   → etiquetes { k:'chips', title, items:[...] }
//   works   → obres per autor { k:'works', title, items:[{n,m?,w:[...]}] }
//   quotes  → cites { k:'quotes', title, items:[[cita,autor],...] }

export type CulturaBlock =
  | { k: 'sub'; label: string }
  | { k: 'defs'; title?: string; items: [string, string][] }
  | { k: 'records'; title?: string; items: [string, string, string][] }
  | { k: 'table'; title?: string; head: string[]; rows: string[][] }
  | { k: 'chips'; title?: string; items: string[] }
  | { k: 'works'; title?: string; items: { n: string; m?: string; w: string[] }[] }
  | { k: 'quotes'; title?: string; items: [string, string][] };

export type CulturaArea = {
  id: string;
  ca: string;
  es: string;
  icon: string;
  blurb: string;
  blocks: CulturaBlock[];
};

export const CULTURA_AREAS: CulturaArea[] = [
// ═══ 1 · ANATOMIA HUMANA ════════════════════════════════════════
{
  id: 'anatomia', ca: 'Anatomia', es: 'Anatomía humana', icon: 'heart',
  blurb: 'Sang, ossos, òrgans, hormones i sistemes del cos humà.',
  blocks: [
    { k: 'records', title: 'Xifres clau del cos', items: [
      ['Ossos (adult)', '206', 'nadó: ~300'],
      ['Vèrtebres (adult)', '24', 'fetal/infància: 33'],
      ['Dents (adult)', '32', 'nens: 20'],
      ['Sang (adult)', '4,5–6,5 L', '7–8 % del pes'],
      ['Aigua del cos', '60–70 %', ''],
      ['Pes dels ossos', '14 %', 'del pes corporal'],
    ]},
    { k: 'defs', title: 'Sang i sistema circulatori', items: [
      ['Components de la sang', 'Glòbuls rojos, glòbuls blancs, plaquetes i plasma (transparent)'],
      ['Glòbulos rojos', 'Hematíes / eritrocitos → transportan oxígeno (proteína: hemoglobina)'],
      ['Glóbulos blancos', 'Leucocitos → defensa. Producidos por el sistema linfático (linfa)'],
      ['Plaquetas', 'Trombocitos → coágulos para sanar heridas'],
      ['Arteria aorta', 'La arteria más grande; nace en el ventrículo izquierdo'],
      ['Sístole', 'Fase de contracción del corazón: bombea la sangre a los vasos'],
      ['Diástole', 'Fase de relajación del corazón'],
      ['Bradicardia', 'Frecuencia cardiaca anormalmente baja: < 60 latidos/min'],
      ['Grupos sanguíneos', '0− donante universal · AB+ receptor universal'],
    ]},
    { k: 'defs', title: 'Órganos, hormonas y sistemas', items: [
      ['Insulina', 'Hormona que lleva la glucosa de la sangre a las células (energía). Producida en el páncreas'],
      ['Progesterona', 'Hormona del ciclo menstrual y el embarazo (ovario y placenta); prepara el útero'],
      ['Glándula tiroides', 'Produce hormona tiroidea, calcitonina y tiroxina (yodo); regula crecimiento y metabolismo'],
      ['Hígado', 'Produce la bilis (descompone grasas); único órgano capaz de regenerarse'],
      ['Sistema nervioso', 'Encargado de mover huesos y músculos'],
      ['Piel', 'Mayor órgano del cuerpo. Capas: epidermis, dermis, hipodermis'],
      ['Córnea', 'Capa más externa del ojo; controla el enfoque y la entrada de luz'],
      ['Presbicia', 'Vista cansada: no permite ver con claridad de cerca'],
      ['Músculo más duro', 'La lengua'],
      ['Hueso más largo', 'Fémur (muslo)'],
    ]},
    { k: 'table', title: 'Localización rápida', head: ['Estructura', 'Zona'], rows: [
      ['Astrágalo', 'Pie'],
      ['Húmero', 'Brazo'],
      ['Radio', 'Lateral del antebrazo'],
      ['Esternocleidomastoideo', 'Cuello'],
      ['Trompas de Eustaquio y martillo', 'Oído (sistema auditivo)'],
      ['Nervio trigémino', 'Cráneo'],
    ]},
    { k: 'defs', title: 'Digestión y sentidos', items: [
      ['Intestino delgado', 'Duodeno, yeyuno e íleon (después: intestino grueso)'],
      ['Papilas caliciformes/circunvaladas', 'Perciben el gusto amargo (parte posterior de la lengua)'],
      ['Papilas fungiformes', 'Perciben el sabor dulce'],
      ['Papilas foliadas', 'Perciben el sabor salado'],
    ]},
    { k: 'defs', title: 'Patologías y nutrición', items: [
      ['Infección', 'Invasión de un ser vivo por un microorganismo patógeno'],
      ['Hipertermia / Hipotermia', 'Temperatura corporal anormalmente alta / baja'],
      ['Daltonismo', 'John Dalton; dificultad para discriminar matices de rojo y verde'],
      ['Escorbuto', 'Falta de vitamina C'],
      ['Vitamina D', 'Se sintetiza tras haber tomado el sol'],
    ]},
  ],
},

// ═══ 2 · CIÈNCIA I FÍSICA ═══════════════════════════════════════
{
  id: 'ciencia', ca: 'Ciència i física', es: 'Ciencia y física', icon: 'beaker',
  blurb: 'Materia, química, genética, energía y grandes científicos.',
  blocks: [
    { k: 'records', title: 'Unidades y constantes', items: [
      ['Velocidad de la luz', '300.000 km/s', '299.792,458 km/s'],
      ['Velocidad del sonido', '344 m/s', '1.200 km/h'],
      ['Año luz', 'unidad de distancia', '9,46 × 10¹² km'],
      ['0 °C equivale a', '273,15 K', '32 °F'],
      ['Número Pi', '3,1416', ''],
      ['Vatio (W)', 'potencia eléctrica', ''],
      ['Pascal', 'unidad de presión', ''],
    ]},
    { k: 'defs', title: 'Materia y átomo', items: [
      ['Tabla periódica', 'Creada por Dmitri Mendeléyev; organizada por el peso atómico'],
      ['Electrón', 'Carga negativa. Descubierto por Joseph Thomson'],
      ['Protón / Neutrón', 'Protón: carga positiva · Neutrón: sin carga'],
      ['Átomo / Molécula', 'Átomo: unidad más pequeña de la materia · Molécula: unión de 2+ átomos'],
      ['Acero', 'Aleación de hierro + carbono'],
      ['Rodio', 'Metal más caro. Iridio y osmio: los más pesados'],
      ['Rayos gamma', 'Onda electromagnética de mayor frecuencia (> rayos X > ultravioleta)'],
    ]},
    { k: 'table', title: 'Símbolos químicos', head: ['Símbolo', 'Elemento'], rows: [
      ['Na', 'Sodio'], ['K', 'Potasio'], ['P', 'Fósforo'], ['S', 'Azufre'],
      ['Ag', 'Plata'], ['Au', 'Oro'], ['Cu', 'Cobre'], ['Hg', 'Mercurio'], ['Kr', 'Kriptón'],
    ]},
    { k: 'table', title: 'Alcanos · CnH₂ₙ₊₂', head: ['Nombre', 'Fórmula'], rows: [
      ['Metano', 'CH₄'], ['Etano', 'C₂H₆'], ['Propano', 'C₃H₈'], ['Butano', 'C₄H₁₀'],
      ['Pentano', 'C₅'], ['Hexano', 'C₆'], ['Heptano', 'C₇'], ['Octano', 'C₈'],
      ['Nonano', 'C₉'], ['Decano', 'C₁₀'],
    ]},
    { k: 'defs', title: 'Genética y célula', items: [
      ['ADN', 'Ácido desoxirribonucleico (doble cadena); contiene la info genética (adenina, timina, citosina, guanina)'],
      ['ARN', 'Ácido ribonucleico (cadena simple); posibilita la síntesis de proteínas'],
      ['Cromosoma', 'Molécula de ADN. Humanos: 23 pares (22 autosómicos + 1 sexual X/Y)'],
      ['Mitosis', 'División que genera 2 núcleos con el mismo nº de cromosomas'],
      ['Meiosis', 'División que origina 4 células con la mitad de cromosomas'],
      ['Fotosíntesis', 'Captura CO₂ y expulsa O₂ (en las hojas); proceso contrario: respiración vegetal'],
      ['Oveja Dolly', '1er mamífero clonado a partir de una célula adulta'],
    ]},
    { k: 'defs', title: 'Teorías y científicos', items: [
      ['Mendel', 'Leyes de la genética'],
      ['Darwinismo', 'Selección natural y evolución (El Origen de las Especies, 1859)'],
      ['Lamarckismo', '1ª teoría de la evolución biológica (Filosofía zoológica, 1809)'],
      ['Principio de Arquímedes', 'Un cuerpo sumergido recibe un empuje vertical = peso del fluido desalojado'],
      ['Teorema de Pitágoras', 'Triángulo rectángulo: h² = c₁² + c₂²'],
      ['Newton', 'Teoría de la gravedad (1687); matemático, astrónomo y físico'],
      ['Einstein', 'Teoría de la relatividad; equivalencia masa-energía: E = mc²'],
      ['Marie Curie', 'Descubre el radio y el polonio. 1ª mujer Nobel y única con dos categorías (Física y Química)'],
    ]},
    { k: 'defs', title: 'Ciencias de la Tierra y energía', items: [
      ['Capas de la Tierra', 'Núcleo interno, núcleo externo, manto, manto superior y corteza'],
      ['Géiser', 'Agua del subsuelo + magma incandescente → escape a presión (de fuente o de cono)'],
      ['Volcán', 'Cámara magmática, chimenea, cráter y cono volcánico'],
      ['Energías renovables', 'Eólica (viento), hidráulica (agua), biomasa (residuos orgánicos)'],
      ['1 año en Marte', '687 días terrestres'],
    ]},
  ],
},

// ═══ 3 · ASTRONOMIA ═════════════════════════════════════════════
{
  id: 'astronomia', ca: 'Astronomia', es: 'Astronomía', icon: 'star',
  blurb: 'El sistema solar, la atmósfera, estrellas y coordenadas.',
  blocks: [
    { k: 'records', title: 'Récords del sistema solar', items: [
      ['Montaña más alta del S. Solar', 'Monte Olimpo', 'Marte · 27.000 m'],
      ['Luna más grande', 'Ganímedes', 'orbita Júpiter · Ø 5.260 km'],
      ['Distancia Tierra–Sol', '149,6 M km', ''],
      ['Gravedad de la Tierra', '9,807 m/s²', ''],
      ['Lugar habitado más frío', 'Oymyakon', 'Siberia · −71,2 °C'],
      ['Lugar más frío del mundo', 'Antártida', '−89,2 °C'],
    ]},
    { k: 'table', title: 'Radios', head: ['Astro', 'Radio'], rows: [
      ['Sol', '696.000 km'], ['Tierra', '6.371 km'], ['Luna', '1.737 km'],
    ]},
    { k: 'chips', title: 'Planetas (en orden)', items: [
      'Mercurio', 'Venus', 'Tierra', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno',
    ]},
    { k: 'defs', title: 'Mecánica celeste', items: [
      ['Vía Láctea', 'Forma elíptica'],
      ['Copérnico', 'La Tierra gira alrededor del Sol; fundador de la astronomía moderna'],
      ['Eclipse solar', 'La Luna se interpone entre el Sol y la Tierra (Sol–Luna–Tierra)'],
      ['Eclipse lunar', 'La Luna pasa por la sombra de la Tierra (Sol–Tierra–Luna)'],
      ['Estaciones', 'Causadas por el movimiento de traslación'],
      ['Mareas', 'Influencia gravitacional de la Luna'],
      ['Planetas jovianos', 'Júpiter, Saturno, Urano y Neptuno'],
    ]},
    { k: 'defs', title: 'Estrellas y coordenadas', items: [
      ['Estrella Polar (Polaris)', 'En la Osa Menor; fija en el firmamento (prolongación del eje terrestre)'],
      ['Próxima Centauri', 'Estrella más cercana al sistema solar (sistema Alpha Centauri)'],
      ['Estrellas', 'Hidrógeno + polvo cósmico; condensación de nebulosas'],
      ['Sistema Cervantes', 'Sus planetas: Rocinante, Dulcinea, Quijote y Sancho'],
      ['Meridiano 0', 'Greenwich (norte-sur); fija los husos horarios'],
      ['Paralelo 0', 'Ecuador (oeste-este)'],
      ['Latitud', 'Distancia angular desde un punto hasta el paralelo del ecuador'],
    ]},
    { k: 'chips', title: 'Capas de la atmósfera', items: [
      '1 · Troposfera', '2 · Estratosfera', '3 · Mesosfera', '4 · Termosfera', '5 · Exosfera',
    ]},
    { k: 'records', title: 'Gases de la atmósfera', items: [
      ['Nitrógeno', '78 %', ''], ['Oxígeno', '21 %', ''], ['Argón', '0,9 %', ''],
    ]},
  ],
},

// ═══ 4 · GEOGRAFIA ══════════════════════════════════════════════
{
  id: 'geografia', ca: 'Geografia', es: 'Geografía', icon: 'map',
  blurb: 'Cataluña, España, Europa e internacional: récords y mapas.',
  blocks: [
    { k: 'sub', label: 'Cataluña' },
    { k: 'records', title: 'Datos de Cataluña', items: [
      ['Superficie', '32.108 km²', ''],
      ['Población', '7,6 M', ''],
      ['Provincias', '4', 'BCN, Girona, Tarragona, Lleida'],
      ['Comarcas', '42', ''],
      ['Municipios', '947', ''],
      ['Vegueries', '8', ''],
      ['Barrios de Barcelona', '73', 'distritos: 10'],
      ['Montaña más alta', 'Pica d’Estats', '3.143 m · Pallars Sobirà'],
      ['Río más largo', 'Ter', ''],
      ['Estanque más grande', 'Banyoles', ''],
    ]},
    { k: 'defs', title: 'Ríos y relieve', items: [
      ['Río Llobregat', 'Nace en Castellar de n’Hug, 170 km. Afluentes: Anoia y Cardener'],
      ['Río Sénia', 'Separa Cataluña de Valencia (49 km), desemboca en el Mediterráneo'],
      ['Garona', 'Desemboca en el Atlántico (602 km), entre España y Francia'],
      ['Volcanes de la Garrotxa', 'Croscat y Santa Margarida (municipio de Santa Pau)'],
    ]},
    { k: 'chips', title: 'Las 8 vegueries', items: [
      'Girona', 'Barcelona', 'Penedès', 'Camp de Tarragona', 'Terres de l’Ebre',
      'Alt Pirineu i Aran', 'Lleida', 'Catalunya Central',
    ]},
    { k: 'chips', title: 'Las 42 comarcas', items: [
      'Alt Camp', 'Alt Empordà', 'Alt Penedès', 'Alt Urgell', 'Alta Ribagorça', 'Anoia', 'Aran',
      'Bages', 'Baix Camp', 'Baix Ebre', 'Baix Empordà', 'Baix Llobregat', 'Baix Penedès',
      'Barcelonès', 'Berguedà', 'Cerdanya', 'Conca de Barberà', 'Garraf', 'Garrigues', 'Garrotxa',
      'Gironès', 'Maresme', 'Moianès', 'Montsià', 'Noguera', 'Osona', 'Pallars Jussà',
      'Pallars Sobirà', 'Pla d’Urgell', 'Pla de l’Estany', 'Priorat', 'Ribera d’Ebre', 'Ripollès',
      'Segarra', 'Segrià', 'Selva', 'Solsonès', 'Tarragonès', 'Terra Alta', 'Urgell',
      'Vallès Occidental', 'Vallès Oriental',
    ]},
    { k: 'sub', label: 'España' },
    { k: 'table', title: '17 Comunidades Autónomas', head: ['Comunidad', 'Prov.', 'Capital'], rows: [
      ['Andalucía', '8', 'Sevilla'],
      ['Aragón', '3', 'Zaragoza'],
      ['Asturias', '1', 'Oviedo'],
      ['Islas Baleares', '1', 'Palma'],
      ['Islas Canarias', '2', 'S.C. de Tenerife / Las Palmas'],
      ['Cantabria', '1', 'Santander'],
      ['Castilla-La Mancha', '5', 'Toledo'],
      ['Castilla y León', '9', 'Valladolid (sede)'],
      ['Cataluña', '4', 'Barcelona'],
      ['Extremadura', '2', 'Mérida'],
      ['Galicia', '4', 'Santiago de Compostela'],
      ['La Rioja', '1', 'Logroño'],
      ['Madrid', '1', 'Madrid'],
      ['Navarra', '1', 'Pamplona'],
      ['País Vasco', '3', 'Vitoria (sede)'],
      ['Región de Murcia', '1', 'Murcia'],
      ['Comunidad Valenciana', '3', 'Valencia'],
    ]},
    { k: 'records', title: 'Récords de España', items: [
      ['Río más largo P. Ibérica', 'Tajo', '1.038 km (20 % Portugal)'],
      ['Río más largo de España', 'Ebro', '930 km · atraviesa 7 CCAA'],
      ['Montaña más alta P. Ibérica', 'Mulhacén', '3.479 m · Sierra Nevada'],
      ['Montaña más alta de España', 'Teide', '3.718 m · Tenerife (volcán)'],
      ['CCAA con más provincias', 'Castilla y León', ''],
      ['CCAA con más costa mediterránea', 'Andalucía', ''],
      ['Ciudades autónomas', 'Ceuta y Melilla', ''],
    ]},
    { k: 'sub', label: 'Europa' },
    { k: 'table', title: 'Unión Europea (27) · país · capital · moneda', head: ['País', 'Capital', '€'], rows: [
      ['Alemania', 'Berlín', '€'], ['Austria', 'Viena', '€'], ['Bélgica', 'Bruselas', '€'],
      ['Bulgaria', 'Sofía', 'lev'], ['Chipre', 'Nicosia', '€'], ['Croacia', 'Zagreb', '€'],
      ['Dinamarca', 'Copenhague', 'corona'], ['Eslovaquia', 'Bratislava', '€'], ['Eslovenia', 'Liubliana', '€'],
      ['España', 'Madrid', '€'], ['Estonia', 'Tallin', '€'], ['Finlandia', 'Helsinki', '€'],
      ['Francia', 'París', '€'], ['Grecia', 'Atenas', '€'], ['Hungría', 'Budapest', 'forinto'],
      ['Irlanda', 'Dublín', '€'], ['Italia', 'Roma', '€'], ['Letonia', 'Riga', '€'],
      ['Lituania', 'Vilna', '€'], ['Luxemburgo', 'Luxemburgo', '€'], ['Malta', 'La Valeta', '€'],
      ['Países Bajos', 'Ámsterdam', '€'], ['Polonia', 'Varsovia', 'zloty'], ['Portugal', 'Lisboa', '€'],
      ['Rep. Checa', 'Praga', 'corona'], ['Rumanía', 'Bucarest', 'leu'], ['Suecia', 'Estocolmo', 'corona'],
    ]},
    { k: 'records', title: 'Récords de Europa', items: [
      ['Pico más alto de Europa y UE', 'Elbrus', '5.642 m · Cáucaso'],
      ['Río más largo de Europa', 'Volga', 'desemboca en el mar Caspio'],
      ['Río más largo de la UE', 'Danubio', 'Selva Negra → mar Negro'],
    ]},
    { k: 'defs', title: 'Europa · varios', items: [
      ['Estrecho del Bósforo', 'Turquía; separa la parte europea de la asiática'],
      ['Países bálticos', 'Estonia, Letonia, Lituania, Finlandia y Polonia'],
      ['Groenlandia', 'Pertenece a Dinamarca'],
      ['Volcán Etna', 'Sicilia (isla italiana)'],
    ]},
    { k: 'sub', label: 'Internacional' },
    { k: 'records', title: 'Récords del mundo', items: [
      ['Montaña más alta', 'Everest', '8.848 m · China/Nepal'],
      ['2ª montaña más alta', 'K2', '8.611 m'],
      ['Cordillera más extensa', 'Los Andes', '7.000 km · 7 países'],
      ['Montaña más alta de América', 'Aconcagua', '6.962 m · Argentina'],
      ['Montaña más alta de África', 'Kilimanjaro', 'Tanzania'],
      ['Océano más grande', 'Pacífico', ''],
      ['Río más largo y caudaloso', 'Amazonas', '6.400 km'],
      ['Cascada más alta', 'Salto del Ángel', '979 m · Venezuela'],
      ['Desierto más árido', 'Atacama', 'Chile'],
      ['País más extenso', 'Rusia', '17,1 M km²'],
      ['Continente más poblado', 'Asia', ''],
      ['Ciudad más poblada', 'Tokio', '2 N. Delhi · 3 Shanghái'],
      ['Punto más profundo', 'Abismo de Challenger', 'Fosa de las Marianas · 10.924 m'],
    ]},
    { k: 'defs', title: 'Lugares del mundo', items: [
      ['Cataratas de Iguazú', 'Separan Brasil y Argentina'],
      ['Canal de Suez', 'Egipto; une el mar Mediterráneo con el mar Rojo'],
      ['Estrecho de Bering', 'Separa Alaska y Siberia (EEUU–Rusia)'],
      ['Machu Picchu', 'Poblado incaico, región de Cuzco (Perú)'],
      ['Isla La Española', 'Compartida por Haití y República Dominicana'],
      ['Líneas de Nazca', 'Perú'],
      ['Terremotos y volcanes', 'Se crean en la frontera de las placas tectónicas'],
      ['Desiertos más grandes', '1º Antártico · 2º Ártico · 3º Sáhara'],
    ]},
  ],
},

// ═══ 5 · HISTÒRIA ═══════════════════════════════════════════════
{
  id: 'historia', ca: 'Història', es: 'Historia', icon: 'flag',
  blurb: 'De la prehistoria al s. XX: etapas, fechas y personajes.',
  blocks: [
    { k: 'table', title: 'Fin de cada gran etapa', head: ['Hito', 'Fecha'], rows: [
      ['Escritura → fin de la Prehistoria', '3.500 a.C.'],
      ['Caída del Imperio Romano → fin Edad Antigua', '476 (s. V)'],
      ['Descubrimiento de América → fin Edad Media', '1492 (s. XV)'],
      ['Revolución Francesa → fin Edad Moderna', '1789 (s. XVIII)'],
    ]},
    { k: 'works', title: 'Especies humanas (en orden)', items: [
      { n: 'Australopithecus', w: ['—'] },
      { n: 'Homo habilis', w: ['Herramientas de piedra'] },
      { n: 'Homo erectus', w: ['Descubre el fuego'] },
      { n: 'Homo antecessor', w: ['Hombre de Atapuerca (Burgos)'] },
      { n: 'Homo neanderthal', w: ['Pintura rupestre'] },
      { n: 'Homo sapiens', w: ['Llegan a Europa hace 210.000 años'] },
    ]},
    { k: 'records', title: 'Fechas que caen casi siempre', items: [
      ['Invasión musulmana de la P.I.', '711', 'Don Rodrigo · batalla de Guadalete'],
      ['Independencia de los condados', '988', 'Borrell II'],
      ['Confederación catalanoaragonesa', '1137', 'R. Berenguer IV + Peronella'],
      ['Peste negra', '1348', 's. XIV'],
      ['Diada · caída de Barcelona', '11-IX-1714', 'Guerra de Sucesión'],
      ['Decreto de Nueva Planta', '1716', 'Felipe V'],
      ['Revolución Industrial', '1760–1840', 'Inglaterra'],
      ['I Guerra Mundial', '1914–1918', 'magnicidio de Sarajevo'],
      ['Guerra Civil española', '1936–1939', ''],
      ['II Guerra Mundial', '1939–1945', 'invasión de Polonia'],
      ['Bomba atómica', '1945', 'Hiroshima y Nagasaki · Truman'],
      ['Llegada a la Luna', '1969', 'Apolo 11 · Armstrong y Aldrin'],
      ['Muro de Berlín', '1961–1989', ''],
      ['España entra en la UE', '1986', 'euro: 2002'],
    ]},
    { k: 'defs', title: 'Antigüedad y Roma', items: [
      ['Augusto', '1er emperador romano (Octavio); funda Barcino (~14 a.C.)'],
      ['Trajano', '1er emperador de origen hispánico (98–117)'],
      ['Tarraco', 'Ciudad más importante de la Cataluña romana'],
      ['Coliseo', 'Construido por Vespasiano (72–80 d.C.)'],
      ['Rómulo y Remo', 'Amamantados por la loba Luperca; fundadores de Roma'],
      ['Cartagineses', 'Habitaban la P.I.; desembarco romano en Empúries (218 a.C., Escipión)'],
      ['Muralla romana más larga de España', 'Lugo: 2.266 m, 85 torres'],
      ['Último emperador romano', 'Rómulo Augústulo'],
    ]},
    { k: 'quotes', title: 'Filosofía clásica', items: [
      ['Solo sé que no sé nada', 'Sócrates (la escribió Platón)'],
      ['Cogito ergo sum', 'Descartes'],
    ]},
    { k: 'defs', title: 'Edad Moderna y Contemporánea', items: [
      ['Descubrimiento de América', '1492 · Cristóbal Colón, por mandato de los Reyes Católicos'],
      ['Guerra de los Cien Años', 'Duró 116 años (1337–1453), Francia–Inglaterra'],
      ['DDHH del Hombre y del Ciudadano', 'Resultado de la Revolución Francesa (26 agosto 1789)'],
      ['CE de Cádiz “La Pepa”', '1812, primera constitución española'],
      ['Tratado de Versalles', 'Puso fin oficial a la I Guerra Mundial'],
      ['Eisenhower', 'Dirigió el desembarco de Normandía (1944, Op. Overlord)'],
      ['ONU', '1945, fundada en San Francisco'],
      ['Apartheid', 'Sudáfrica y Namibia: segregación racial (1948–1994)'],
      ['Tratado de Maastricht', '1993: consagra el nombre de Unión Europea'],
    ]},
    { k: 'table', title: 'Creación de las policías', head: ['Cuerpo', 'Año'], rows: [
      ['Mossos d’Esquadra (MMEE)', '1719'],
      ['Guardia Urbana', '1843'],
      ['Guardia Civil (GC)', '1844'],
      ['Cuerpo Nacional de Policía (CNP)', '1986'],
    ]},
    { k: 'chips', title: 'Grandes atentados', items: [
      'Hipercor · 19-J-1987 (ETA)', 'Torres Gemelas · 11-S-2001', 'Trenes de Madrid · 11-M-2004',
      'Maratón de Boston · 15-A-2013', 'Rambla de BCN · 17-A-2017',
    ]},
  ],
},

// ═══ 6 · INSTITUCIONS I ORGANISMES ══════════════════════════════
{
  id: 'institucions', ca: 'Institucions', es: 'Instituciones y organismos', icon: 'briefcase',
  blurb: 'Organismos internacionales y los grandes museos del mundo.',
  blocks: [
    { k: 'table', title: 'Organismos internacionales', head: ['Organismo', 'Sede', 'Año'], rows: [
      ['ONU', 'Nueva York', '1945'],
      ['UNESCO', 'París', '1945'],
      ['UNICEF', 'Nueva York', '1946'],
      ['OMS', 'Ginebra', '1948'],
      ['OTAN (Alianza Atlántica)', 'Bruselas', '1949'],
      ['Cruz Roja', 'Ginebra', '1863'],
      ['FMI', 'Washington', '1944'],
    ]},
    { k: 'defs', title: 'Otros', items: [
      ['Commonwealth', 'Gran Bretaña + colonias (53 países)'],
    ]},
    { k: 'table', title: 'Museos del mundo', head: ['Museo', 'Lugar'], rows: [
      ['Smithsonian (el más grande)', 'Washington'],
      ['NuMu (el más pequeño)', 'Guatemala'],
      ['Charlie Chaplin', 'Suiza'],
      ['Rijksmuseum', 'Ámsterdam'],
      ['Hermitage', 'San Petersburgo'],
      ['Pérgamo', 'Berlín'],
      ['MoMA', 'Nueva York'],
      ['Museo Dalí', 'Figueras'],
      ['Guggenheim (Frank Gehry)', 'Bilbao'],
      ['Ciudad de las Artes y las Ciencias (Calatrava)', 'Valencia'],
    ]},
  ],
},

// ═══ 7 · INVENTS I INVENTORS ════════════════════════════════════
{
  id: 'invents', ca: 'Invents i inventors', es: 'Inventos e inventores', icon: 'bolt',
  blurb: 'Quién inventó qué, de la escritura a la penicilina.',
  blocks: [
    { k: 'table', title: 'Invento → inventor', head: ['Invento', 'Inventor'], rows: [
      ['Escritura', 'Mesopotamia (jeroglíficos: 3100 a.C.)'],
      ['Brújula y pólvora', 'China'],
      ['Imprenta', 'J. Gutenberg, “padre de la imprenta” (1440)'],
      ['Pararrayos y lente bifocal', 'Benjamin Franklin'],
      ['Máquina de vapor', 'James Watt'],
      ['Telescopio', 'Galileo Galilei'],
      ['Telégrafo', 'Samuel Morse'],
      ['Revólver de repetición', 'Samuel Colt (1835–36)'],
      ['Teléfono', 'Antonio Meucci · lo patentó 1º A. Graham Bell'],
      ['Bombilla y fonógrafo', 'Thomas Alva Edison'],
      ['Máquina voladora', 'Hermanos Wright (Orville voló 1º)'],
      ['Penicilina', 'Alexander Fleming (1928)'],
      ['Locomotora', 'G. Stephenson'],
      ['Barómetro', 'Evangelista Torricelli'],
      ['Higrómetro', 'Leonardo da Vinci'],
      ['Anemómetro', 'Leon Battista Alberti'],
      ['Dinamita', 'Alfred Nobel'],
    ]},
  ],
},

// ═══ 8 · LITERATURA ═════════════════════════════════════════════
{
  id: 'literatura', ca: 'Literatura', es: 'Literatura', icon: 'book',
  blurb: 'Autores y obras: española, catalana y extranjera.',
  blocks: [
    { k: 'sub', label: 'Española' },
    { k: 'works', title: 'Generación del 27', items: [
      { n: 'Federico García Lorca', w: ['La casa de Bernarda Alba', 'Romancero gitano', 'Poeta en Nueva York'] },
      { n: 'Rafael Alberti', w: ['Marinero en tierra'] },
      { n: 'Pedro Salinas', w: ['Razón de amor'] },
      { n: 'Dámaso Alonso', w: ['Hijos de la ira'] },
      { n: 'Miguel Hernández', w: ['El rayo que no cesa'] },
    ]},
    { k: 'works', title: 'Generación del 98', items: [
      { n: 'Antonio Machado', m: 'único sin Nobel', w: ['Campos de Castilla'] },
      { n: 'Ortega y Gasset', w: ['La rebelión de las masas'] },
      { n: 'Miguel de Unamuno', w: ['Niebla'] },
      { n: 'Pío Baroja', w: ['La busca'] },
      { n: 'Azorín', w: ['Doña Inés'] },
      { n: 'Juan Ramón Jiménez', w: ['Platero y yo'] },
    ]},
    { k: 'works', title: 'Clásicos y contemporáneos', items: [
      { n: 'Miguel de Cervantes', w: ['El Quijote (1605)'] },
      { n: 'Anónimo', w: ['Lazarillo de Tormes', 'Cantar del Mío Cid'] },
      { n: 'Calderón de la Barca', w: ['La vida es sueño'] },
      { n: 'Góngora', w: ['Soledades'] },
      { n: 'Lope de Vega', w: ['Fuenteovejuna'] },
      { n: 'Quevedo', w: ['El buscón'] },
      { n: 'Bécquer', w: ['Rimas y leyendas'] },
      { n: 'Clarín', w: ['La Regenta'] },
      { n: 'Zorrilla', w: ['Don Juan Tenorio'] },
      { n: 'Pérez Galdós', w: ['Fortunata y Jacinta'] },
      { n: 'Espronceda', w: ['Canción del pirata'] },
      { n: 'Fernando de Rojas', w: ['La Celestina'] },
      { n: 'C. J. Cela', w: ['La colmena'] },
      { n: 'Pérez-Reverte', w: ['El capitán Alatriste', 'La tabla de Flandes'] },
      { n: 'Ruiz Zafón', w: ['La sombra del viento'] },
      { n: 'Ildefonso Falcones', w: ['La catedral del mar'] },
      { n: 'Miguel Delibes', w: ['Cinco horas con Mario'] },
      { n: 'José Echegaray', m: '1er español Nobel', w: ['—'] },
    ]},
    { k: 'sub', label: 'Catalana' },
    { k: 'works', title: 'Autores catalanes', items: [
      { n: 'Mercè Rodoreda', w: ['La plaça del Diamant', 'Mirall trencat'] },
      { n: 'Salvador Espriu', w: ['La pell de brau', 'Ronda de mort a Sinera'] },
      { n: 'Àngel Guimerà', w: ['Terra baixa', 'Mar i cel'] },
      { n: 'Narcís Oller', w: ['La febre d’or'] },
      { n: 'Ausiàs March', w: ['Cant espiritual'] },
      { n: 'Bonaventura C. Aribau', w: ['La pàtria'] },
      { n: 'Ramon Llull', w: ['Blanquerna', 'Arbre de la ciència'] },
      { n: 'Joanot Martorell', w: ['Tirant lo Blanc'] },
      { n: 'Jaume I', w: ['Llibre dels fets'] },
      { n: 'Ramon Muntaner', w: ['Crònica'] },
      { n: 'Jacint Verdaguer', w: ['L’Atlàntida', 'Canigó'] },
      { n: 'Manuel de Pedrolo', w: ['Mecanoscrit del segon origen'] },
    ]},
    { k: 'defs', title: 'Dato catalán', items: [
      ['Homilies d’Organyà', 'Primer texto escrito en catalán'],
    ]},
    { k: 'sub', label: 'Extranjera' },
    { k: 'works', title: 'Autores universales', items: [
      { n: 'Homero', w: ['La Odisea'] },
      { n: 'Dante Alighieri', w: ['La Divina Comedia'] },
      { n: 'Shakespeare', w: ['Hamlet', 'Romeo y Julieta'] },
      { n: 'Platón', w: ['Diálogos'] },
      { n: 'Nietzsche', w: ['Así habló Zaratustra'] },
      { n: 'Descartes', w: ['Discurso del método'] },
      { n: 'Dickens', w: ['Oliver Twist', 'Grandes esperanzas'] },
      { n: 'Julio Verne', w: ['20.000 leguas de viaje submarino'] },
      { n: 'Lewis Carroll', w: ['Alicia en el País de las Maravillas'] },
      { n: 'García Márquez', w: ['Cien años de soledad'] },
      { n: 'Kafka', w: ['La metamorfosis'] },
      { n: 'Agatha Christie', w: ['Diez negritos'] },
      { n: 'Saint-Exupéry', w: ['El principito'] },
      { n: 'J. K. Rowling', w: ['Harry Potter'] },
      { n: 'Stephen King', w: ['It'] },
      { n: 'Paulo Coelho', w: ['El alquimista'] },
      { n: 'Conan Doyle', w: ['Sherlock Holmes'] },
      { n: 'R. L. Stevenson', w: ['Dr. Jekyll y Mr. Hyde', 'La isla del tesoro'] },
    ]},
  ],
},
// ═══ 9 · ARQUITECTURA I MONUMENTS ═══════════════════════════════
{
  id: 'arquitectura', ca: 'Arquitectura', es: 'Arquitectura y monumentos', icon: 'home',
  blurb: 'Arquitectos, edificios y monumentos célebres del mundo.',
  blocks: [
    { k: 'sub', label: 'Cataluña' },
    { k: 'works', title: 'Arquitectos catalanes', items: [
      { n: 'Antoni Gaudí', w: ['Parc Güell', 'Sagrada Família', 'Casa Batlló', 'La Pedrera (Casa Milà)'] },
      { n: 'Puig i Cadafalch', w: ['Casa de les Punxes', 'Casa Martí', 'Casa Amatller'] },
      { n: 'Domènech i Montaner', w: ['Palau de la Música Catalana', 'Hospital de Sant Pau'] },
    ]},
    { k: 'defs', title: 'Monumentos de Barcelona', items: [
      ['Arc de Triomf', 'Motivo: Exposición Universal de 1888'],
      ['Gran Teatre del Liceu', 'Miquel Garriga i Roca'],
      ['Font Màgica de Montjuïc', 'Carles Buïgas'],
      ['Estatua de Colón', '57 m de altura'],
    ]},
    { k: 'sub', label: 'España' },
    { k: 'defs', title: 'Monumentos españoles', items: [
      ['Cuevas de Altamira', 'Cantabria; pintura rupestre'],
      ['Acueducto de Segovia', 'Época romana'],
      ['Generalife / La Alhambra', 'Granada; Patrimonio de la Humanidad'],
      ['Teatro romano de Mérida', 'El mejor conservado de Europa'],
      ['Mezquita de Córdoba', 'Patrimonio cultural de la Humanidad'],
      ['Toros de Guisando', 'Ávila'],
    ]},
    { k: 'sub', label: 'Europa e internacional' },
    { k: 'records', title: 'Récords y datos', items: [
      ['Torre Eiffel', '300 m', 'París'],
      ['Puente más largo del mundo', 'Danyang-Kunshan', 'China'],
      ['Basílica de San Pedro', '193 m de longitud', 'Vaticano; mayor iglesia cristiana'],
    ]},
    { k: 'defs', title: 'Monumentos célebres', items: [
      ['Capilla Sixtina', 'Ciudad del Vaticano'],
      ['Notre Dame', 'Catedral gótica de París'],
      ['Stonehenge', 'Monumento megalítico (Inglaterra)'],
      ['Moáis', 'Isla de Pascua (Chile)'],
      ['Estatua de la Libertad', 'EEUU; regalo de Francia'],
      ['Pirámides de Guiza', 'Keops, Kefrén y Micerino'],
      ['Pirámides y Taj Mahal', 'Monumentos fúnebres'],
    ]},
  ],
},

// ═══ 10 · PINTURA ═══════════════════════════════════════════════
{
  id: 'pintura', ca: 'Pintura', es: 'Pintura', icon: 'pen',
  blurb: 'Los grandes pintores y sus obras (con su museo).',
  blocks: [
    { k: 'works', title: 'Maestros y sus obras', items: [
      { n: 'Goya', w: ['El aquelarre', 'La maja desnuda', 'El 3 de mayo', 'Saturno devorando a su hijo'] },
      { n: 'Velázquez', m: 'Museo del Prado', w: ['Las meninas', 'La rendición de Breda'] },
      { n: 'Dalí', m: 'MoMA', w: ['La persistencia de la memoria', 'Metamorfosis de Narciso', 'El gran masturbador'] },
      { n: 'Picasso', m: 'Reina Sofía / MoMA', w: ['Guernica', 'Las señoritas de Aviñón', 'Retrato de Dora Maar'] },
      { n: 'Botticelli', m: 'Uffizi', w: ['El nacimiento de Venus', 'La primavera'] },
      { n: 'Leonardo da Vinci', m: 'Louvre', w: ['La última cena', 'La Gioconda', 'San Juan Bautista'] },
      { n: 'Van Gogh', m: 'MoMA', w: ['La noche estrellada', 'Los girasoles', 'El sembrador'] },
      { n: 'Monet', w: ['Nenúfares', 'Campo de amapolas', 'La catedral de Rouen'] },
      { n: 'Munch', m: 'Galería Nacional de Noruega', w: ['El grito', 'Madonna', 'La niña enferma'] },
      { n: 'El Greco', w: ['Vista de Toledo', 'El entierro del Conde de Orgaz'] },
      { n: 'Rubens', m: 'Museo del Prado', w: ['Las tres gracias'] },
      { n: 'El Bosco', m: 'Museo del Prado', w: ['El jardín de las delicias'] },
      { n: 'Vermeer', w: ['La joven de la perla'] },
      { n: 'Braque', w: ['Violín y jarra', 'Puerto de Amberes'] },
      { n: 'Santiago Rusiñol', w: ['Jardín de Aranjuez'] },
    ]},
  ],
},

// ═══ 11 · MÚSICA CLÀSSICA ═══════════════════════════════════════
{
  id: 'musica', ca: 'Música clàssica', es: 'Música clásica', icon: 'mic',
  blurb: 'Compositores, óperas y las grandes voces.',
  blocks: [
    { k: 'defs', title: 'Las voces', items: [
      ['Los 3 tenores', 'Pavarotti, Plácido Domingo y José Carreras'],
      ['Joan Sutherland', 'La mejor soprano de coloratura de la historia'],
      ['Sopranos', 'Montserrat Caballé, María Callas, Renata Tebaldi'],
    ]},
    { k: 'works', title: 'Compositores y obras', items: [
      { n: 'Verdi', w: ['Rigoletto', 'La Traviata'] },
      { n: 'Puccini', w: ['La bohème', 'Tosca', 'Madama Butterfly'] },
      { n: 'Rossini', w: ['El barbero de Sevilla'] },
      { n: 'Bach', w: ['Tocata y fuga en re menor', 'Conciertos de Brandeburgo', 'La pasión según Mateo'] },
      { n: 'Vivaldi', w: ['Las cuatro estaciones'] },
      { n: 'Beethoven', m: 'era sordo', w: ['Claro de luna', 'Sinfonía nº 5', 'Sinfonía nº 9 (Himno de la UE)'] },
      { n: 'Mozart', w: ['La flauta mágica', 'Réquiem', 'Las bodas de Fígaro', 'Don Giovanni'] },
    ]},
  ],
},

// ═══ 12 · PERSONATGES CÈLEBRES ══════════════════════════════════
{
  id: 'personatges', ca: 'Personatges', es: 'Personajes célebres', icon: 'user',
  blurb: 'Figuras históricas y frases que hay que reconocer.',
  blocks: [
    { k: 'quotes', title: 'Frases célebres', items: [
      ['El hombre es un lobo para el hombre', 'Hobbes (Leviatán)'],
      ['El hombre es bueno por naturaleza', 'Rousseau'],
      ['Ojo por ojo y el mundo acabará ciego', 'Gandhi'],
      ['Lo bueno, si breve, dos veces bueno', 'Baltasar Gracián'],
    ]},
    { k: 'defs', title: 'Quién es quién', items: [
      ['Hipócrates', 'Padre de la medicina moderna (Antigua Grecia)'],
      ['El Cid (Rodrigo Díaz de Vivar)', 'Caballero castellano del s. XI, héroe de la Reconquista'],
      ['Sansón', 'Personaje bíblico que perdía fuerza al cortarse el pelo'],
      ['Jesse Owens', 'Atleta de EEUU: 4 oros en los JJOO de Berlín 1936'],
      ['Rey Juan Carlos I', 'Coronado el 22-XI-1975, abdicó el 19-VI-2014'],
      ['Rey Felipe VI', 'Coronado el 19-VI-2014'],
      ['Julian Assange', 'Creador de Wikileaks'],
      ['Dassler', 'Rudolf → Puma · Adi → Adidas'],
      ['Elon Musk / Zuckerberg', 'Tesla · Facebook (2004)'],
      ['Papa (2019)', 'Francisco I (Jorge Mario Bergoglio)'],
    ]},
  ],
},

// ═══ 13 · CINEMA ════════════════════════════════════════════════
{
  id: 'cinema', ca: 'Cinema', es: 'Cine', icon: 'play',
  blurb: 'Directores y sus películas más conocidas.',
  blocks: [
    { k: 'works', title: 'Directores y películas', items: [
      { n: 'James Cameron', w: ['Titanic', 'Avatar', 'Terminator'] },
      { n: 'Steven Spielberg', w: ['La lista de Schindler', 'Salvar al soldado Ryan', 'Parque Jurásico', 'Tiburón'] },
      { n: 'Quentin Tarantino', w: ['Malditos bastardos', 'Django', 'Pulp Fiction', 'Kill Bill'] },
      { n: 'Clint Eastwood', w: ['Gran Torino', 'Million Dollar Baby'] },
      { n: 'Roman Polanski', w: ['El pianista'] },
      { n: 'F. F. Coppola', w: ['El padrino'] },
      { n: 'Charles Chaplin', w: ['El gran dictador', 'Tiempos modernos'] },
      { n: 'Ridley Scott', w: ['Gladiator'] },
      { n: 'Peter Jackson', w: ['El señor de los anillos'] },
      { n: 'Robert Zemeckis', w: ['Forrest Gump', 'Regreso al futuro'] },
      { n: 'Peter Weir', w: ['El show de Truman', 'El club de los poetas muertos'] },
    ]},
    { k: 'defs', title: 'Récord', items: [
      ['Película más taquillera', 'Vengadores: Endgame (Joss Whedon, saga Avengers)'],
    ]},
  ],
},

// ═══ 14 · POLÍTICA ══════════════════════════════════════════════
{
  id: 'politica', ca: 'Política', es: 'Política', icon: 'scale',
  blurb: 'Pensadores y presidentes clave.',
  blocks: [
    { k: 'defs', title: 'Pensadores y mandatarios', items: [
      ['Montesquieu', 'Teoría de la separación de poderes (los tres poderes)'],
      ['Rousseau', 'Obra fundamental: El contrato social'],
      ['Prat de la Riba', '1er presidente de la Mancomunitat de Catalunya'],
      ['Josep Tarradellas', '1er presidente de la Generalitat tras el franquismo'],
      ['Felipe González', 'Presidente del Gobierno más tiempo en el cargo (1982–1996)'],
      ['Lluís Companys', 'Presidente de la Generalitat durante la Guerra Civil (1934–1940)'],
      ['Abraham Lincoln', 'Abolió la esclavitud en EEUU (1862)'],
      ['1ª elecciones democráticas (post-franquismo)', '15 de junio de 1977; ganó la UCD'],
    ]},
  ],
},

// ═══ 15 · ESPORT ════════════════════════════════════════════════
{
  id: 'esport', ca: 'Esport', es: 'Deporte', icon: 'trophy',
  blurb: 'Títulos, mundiales y grandes nombres del deporte.',
  blocks: [
    { k: 'records', title: 'Mundiales de fútbol', items: [
      ['2010', 'España', ''], ['2014', 'Alemania', ''], ['2018', 'Francia', ''], ['2022', 'Catar (sede)', ''],
    ]},
    { k: 'defs', title: 'Títulos y figuras', items: [
      ['Champions / Copa de Europa', 'Real Madrid (récord de títulos)'],
      ['Champions femenina', 'Lyon (el más laureado)'],
      ['1er Mundial de fútbol', 'Lo ganó Uruguay'],
      ['Roger Federer', 'Tenista con más torneos de Grand Slam (en su momento)'],
      ['JJOO de invierno 2022', 'Beijing (China)'],
    ]},
    { k: 'defs', title: 'Premios Laureus 2022', items: [
      ['Mejor deportista masculino', 'Max Verstappen'],
      ['Mejor deportista femenina', 'Elaine Thompson-Herah'],
      ['Revelación del año', 'Emma Raducanu'],
      ['Trayectoria de toda una vida', 'Tom Brady'],
    ]},
  ],
},

// ═══ 16 · ALTRES ════════════════════════════════════════════════
{
  id: 'altres', ca: 'Altres', es: 'Otros', icon: 'hash',
  blurb: 'Cultura general transversal: cajón de datos imprescindibles.',
  blocks: [
    { k: 'sub', label: 'Datos sueltos' },
    { k: 'defs', title: 'Lo que más se pregunta', items: [
      ['Caja negra de un avión', 'En realidad es de color naranja'],
      ['iPhone', 'Salió a la venta en 2007'],
      ['Animal más rápido', 'Guepardo (100–120 km/h)'],
      ['Único mamífero sin cuerdas vocales', 'La jirafa'],
      ['Animal con más corazones', 'La lombriz de tierra (5–10)'],
      ['Polo Sur / Polo Norte', 'Antártida (pingüinos) / Ártico (osos polares)'],
      ['Voltaje de los enchufes en España', '230 voltios'],
      ['Disco más vendido del mundo', 'Their Greatest Hits 1971–75 (The Eagles)'],
      ['Religión más extensa / mayoritaria en India', 'Cristianismo / Hinduismo'],
      ['Lengua más hablada de Europa', 'Ruso (después: alemán, francés, inglés)'],
      ['Escala de Richter', 'Mide la intensidad de los terremotos'],
      ['The Beatles', 'Lennon, McCartney, Ringo Starr y Harrison'],
      ['Concurso más veterano de TV en España', 'Saber y Ganar (Jordi Hurtado)'],
    ]},
    { k: 'defs', title: 'Tecnológicas y muertes célebres', items: [
      ['Google', 'Propietaria de Gmail, Android y YouTube'],
      ['Bitcoin / Ethereum', 'Satoshi Nakamoto / Vitalik Buterin'],
      ['Instagram', 'Kevin Systrom y Mike Krieger'],
      ['WhatsApp / Telegram', 'Koum y Acton / los hermanos Dúrov'],
      ['TikTok / Wikipedia', 'Zhang Yiming / Wales y Sanger'],
      ['Gaudí', 'Murió atropellado por un tranvía'],
      ['García Lorca', 'Murió fusilado'],
      ['Stephen Hawking', 'Murió de ELA'],
    ]},
    { k: 'sub', label: 'Tablas' },
    { k: 'table', title: 'Dioses · romano y griego', head: ['Ámbito', 'Romano', 'Griego'], rows: [
      ['Guerra', 'Marte', 'Ares'],
      ['Fuego', 'Vulcano', 'Hefesto'],
      ['Vino', 'Baco', 'Dioniso'],
      ['Cielo / Trueno', 'Júpiter', 'Zeus'],
      ['Mar', 'Neptuno', 'Poseidón'],
      ['Belleza', 'Venus', 'Afrodita'],
      ['Caza', '—', 'Artemisa'],
    ]},
    { k: 'table', title: 'Emperadores romanos por dinastía', head: ['Dinastía', 'Emperadores'], rows: [
      ['Julio-Claudia', 'Augusto, Tiberio, Calígula, Claudio, Nerón'],
      ['Flavia', 'Vespasiano, Tito, Domiciano'],
      ['Antoninos', 'Nerva, Trajano, Adriano, Antonino Pío, Marco Aurelio, Cómodo'],
    ]},
    { k: 'table', title: 'Etiquetas ambientales (DGT)', head: ['Etiqueta', 'Vehículo'], rows: [
      ['0 emisiones (azul)', 'Eléctrico (+ algunos híbridos)'],
      ['Eco (verde y azul)', 'Híbridos, gas natural o GLP'],
      ['C (verde)', 'Gasolina +2006 y diésel +2014'],
      ['B (amarilla)', 'Gasolina +2000 y diésel +2006'],
    ]},
    { k: 'sub', label: 'Geometría' },
    { k: 'defs', title: 'Triángulos y ángulos', items: [
      ['Triángulo equilátero', 'Todos los lados iguales (ángulos de 60º)'],
      ['Triángulo isósceles', 'Dos lados iguales y uno diferente'],
      ['Triángulo escaleno', 'Todos los lados diferentes'],
      ['Ángulo agudo / recto', 'Menos de 90º / exactamente 90º'],
      ['Ángulo obtuso / llano', 'Entre 90º y 180º / 180º'],
      ['Área del rectángulo', 'base × altura'],
      ['Área del círculo', 'π × r²'],
    ]},
    { k: 'chips', title: 'Figuras por nº de lados', items: [
      '5 penta', '6 hexa', '7 hepta', '8 octo', '9 enea', '10 deca',
      '11 endeca', '12 dodeca', '20 icosa', '100 hecta', '1000 kilia',
    ]},
    { k: 'sub', label: 'Lengua y misceláneo' },
    { k: 'defs', title: 'Lengua y conceptos', items: [
      ['Polisémica', 'Palabra con más de un significado'],
      ['Palíndromo', 'Se lee igual de izquierda a derecha y al revés'],
      ['Neologismo', 'Palabra de nueva incorporación a una lengua'],
      ['Lenguas románicas', 'Provienen del latín'],
      ['Els Segadors / La Marsellesa', 'Himno de Cataluña / de Francia'],
      ['www / ONG', 'World Wide Web / Organización No Gubernamental'],
      ['1 hectárea', '10.000 m² (100 áreas)'],
    ]},
    { k: 'defs', title: 'Inicio de las estaciones', items: [
      ['Primavera', '21 de marzo'],
      ['Verano', '21 de junio'],
      ['Otoño', '23 de septiembre'],
      ['Invierno', '21 de diciembre'],
    ]},
    { k: 'chips', title: 'Discos más vendidos de la historia', items: [
      '1 · Thriller (M. Jackson)', '2 · Back in Black (AC/DC)', '3 · The Dark Side of the Moon (Pink Floyd)',
      '4 · The Bodyguard (W. Houston)', '5 · Their Greatest Hits (The Eagles)',
    ]},
  ],
}
];
