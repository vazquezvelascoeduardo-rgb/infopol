// Temari de Mossos d'Esquadra — índex oficial.
//
// Els 20 temes de la guia d'estudi per accedir a la categoria de mosso/a
// (Departament d'Interior i Seguretat Pública), repartits en tres àmbits:
// A coneixements de l'entorn, B institucional i C seguretat.
//
// El contingut s'escriu amb el mateix format que el temari de Policia
// Local — apartats, caixes de clau i avís, targetes d'article i marcador
// sobre el que cau a l'examen — perquè les dues acadèmies s'estudiïn
// igual. Els fitxers viuen a `content/temari-mossos/`.
//
// El codi del tema (A.1, B.3…) i el nom del fitxer han d'anar de la mà:
// si es reordena la llista, s'han de renombrar també els .md.

export type AmbitMossos = 'A' | 'B' | 'C';

export type BlocMossos = {
  clau: AmbitMossos;
  titol: string;
  /** Frase curta per a la portada de l'àmbit. */
  sub: string;
};

export type TemaMossos = {
  /** Número seguit dins de tot el temari (1..20), per a la ruta. */
  num: number;
  /** Codi oficial: A.1, B.3, C.5… */
  codi: string;
  ambit: AmbitMossos;
  titol: string;
  /** Nom del fitxer a content/temari-mossos/, sense extensió. */
  fitxer: string;
};

export const BLOCS_MOSSOS: BlocMossos[] = [
  { clau: 'A', titol: "Àmbit A — Coneixements de l'entorn", sub: 'Història, geografia, llengua, societat i tecnologia.' },
  { clau: 'B', titol: 'Àmbit B — Institucional', sub: "Institucions de Catalunya, de l'Estat i de la Unió Europea." },
  { clau: 'C', titol: 'Àmbit C — Seguretat', sub: 'Competències, organització policial, marc legal i deontologia.' },
];

export const TEMES_MOSSOS: TemaMossos[] = [
  // ── Àmbit A — Coneixements de l'entorn ───────────────────────
  { num: 1, codi: 'A.1', ambit: 'A', fitxer: 'a1-historia-i', titol: 'Història de Catalunya (I) — dels orígens al segle XVIII' },
  { num: 2, codi: 'A.2', ambit: 'A', fitxer: 'a2-historia-ii', titol: 'Història de Catalunya (II) — del segle XIX als nostres dies' },
  { num: 3, codi: 'A.3', ambit: 'A', fitxer: 'a3-historia-policia', titol: 'Història de la policia a Catalunya' },
  { num: 4, codi: 'A.4', ambit: 'A', fitxer: 'a4-sociolinguistic', titol: 'Àmbit sociolingüístic' },
  { num: 5, codi: 'A.5', ambit: 'A', fitxer: 'a5-geografia', titol: 'Marc geogràfic de Catalunya' },
  { num: 6, codi: 'A.6', ambit: 'A', fitxer: 'a6-entorn-social', titol: 'Entorn social a Catalunya' },
  { num: 7, codi: 'A.7', ambit: 'A', fitxer: 'a7-tecnologies', titol: 'Les tecnologies de la informació al segle XXI' },

  // ── Àmbit B — Institucional ──────────────────────────────────
  { num: 8, codi: 'B.1', ambit: 'B', fitxer: 'b1-eac', titol: "L'Estatut d'autonomia de Catalunya" },
  { num: 9, codi: 'B.2', ambit: 'B', fitxer: 'b2-institucions-catalanes', titol: 'Les institucions polítiques de Catalunya' },
  { num: 10, codi: 'B.3', ambit: 'B', fitxer: 'b3-ordenament', titol: "L'ordenament jurídic de l'Estat" },
  { num: 11, codi: 'B.4', ambit: 'B', fitxer: 'b4-drets', titol: 'Els drets humans i els drets constitucionals' },
  { num: 12, codi: 'B.5', ambit: 'B', fitxer: 'b5-institucions-estat', titol: "Les institucions polítiques de l'Estat" },
  { num: 13, codi: 'B.6', ambit: 'B', fitxer: 'b6-organs-jurisdiccionals', titol: 'Els òrgans jurisdiccionals — poder judicial i Tribunal Constitucional' },
  { num: 14, codi: 'B.7', ambit: 'B', fitxer: 'b7-organitzacio-territorial', titol: "L'organització territorial de l'Estat" },
  { num: 15, codi: 'B.8', ambit: 'B', fitxer: 'b8-unio-europea', titol: 'La Unió Europea' },

  // ── Àmbit C — Seguretat ──────────────────────────────────────
  { num: 16, codi: 'C.1', ambit: 'C', fitxer: 'c1-competencies', titol: 'Les competències de la Generalitat en matèria de seguretat' },
  { num: 17, codi: 'C.2', ambit: 'C', fitxer: 'c2-departament', titol: "El Departament d'Interior i Seguretat Pública" },
  { num: 18, codi: 'C.3', ambit: 'C', fitxer: 'c3-coordinacio', titol: 'La coordinació policial' },
  { num: 19, codi: 'C.4', ambit: 'C', fitxer: 'c4-marc-legal', titol: 'El marc legal de la seguretat' },
  { num: 20, codi: 'C.5', ambit: 'C', fitxer: 'c5-deontologia', titol: 'El codi deontològic policial' },
];

export const temaMossosPerNum = (num: number): TemaMossos | undefined =>
  TEMES_MOSSOS.find((t) => t.num === num);

export const temesDeAmbit = (ambit: AmbitMossos): TemaMossos[] =>
  TEMES_MOSSOS.filter((t) => t.ambit === ambit);
