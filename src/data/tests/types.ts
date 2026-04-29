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
   * Categoria del tema. 'temari' (default): forma part del temari oficial.
   * 'cultura': cultura general (es separa visualment i no entra al pool
   * combinat 'Tots els temes').
   */
  category?: 'temari' | 'cultura';
};
