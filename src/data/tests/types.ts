// Tipus de dades del sistema de tests.
//
// Cada tema te un array de preguntes amb 4 opcions; el camp `correct`
// es l'index (0-3) de la opcio correcta a l'array original.
// Quan es renderitzen les preguntes, les opcions es barregen aleatoriament
// (vegeu lib/testRunner.ts), aixi que `correct` no s'usa directament al UI.

export type TestQuestion = {
  /** ID estable per al tracking de respostes a localStorage. */
  id: string;
  /** Text de la pregunta. */
  text: string;
  /** 4 opcions de resposta (a, b, c, d) en l'ordre original. */
  options: [string, string, string, string];
  /** Index (0-3) de la resposta correcta. */
  correct: 0 | 1 | 2 | 3;
  /** Referencia (article, secció, etc.) per mostrar a la correcció. */
  reference?: string;
  /** Explicació breu opcional. */
  explanation?: string;
};

export type TestTopic = {
  /** Slug del tema (ex. 'ce78', 'codi-penal'). */
  slug: string;
  /** Titol visible. */
  title: string;
  /** Subtitol o descripcio breu. */
  description?: string;
  /** Icona representativa (emoji). */
  icon: string;
  /** Color/accent per la card (gradient Tailwind). */
  accent: string;
  /** Llista de preguntes. */
  questions: TestQuestion[];
  /**
   * Categoria del tema. 'temari' (default): forma part del temari oficial
   * de Policia Local. 'cultura': cultura general (es separa visualment).
   * 'municipi': test específic d'un municipi. 'mossos': temari específic
   * de Mossos d'Esquadra (no entra al pool combinat de Policia Local).
   * 'actualitat': preguntes d'actualitat (càrrecs vigents, premis, esports,
   * fets recents) — no entra al pool combinat del temari oficial.
   */
  category?: 'temari' | 'cultura' | 'municipi' | 'mossos' | 'actualitat';
  /**
   * Si category='municipi', nom del municipi al qual pertany (ex. 'Terrassa').
   */
  municipi?: string;
  /**
   * Etiqueta opcional que es mostra com a xip a la targeta del test
   * (ex. '🆕 2026' per a un examen oficial recent).
   */
  badge?: string;
  /**
   * Si category='mossos', àmbit del temari oficial al qual pertany (A, B, C, D, E).
   * Àmbit A = Coneixements de l'entorn; B = Institucional; C = Seguretat...
   */
  ambit?: 'A' | 'B' | 'C' | 'D' | 'E';
  /**
   * Si category='mossos', subtema dins l'àmbit (1, 2, 3...). Ex.: A.1, A.2.
   */
  subtema?: number;
};
