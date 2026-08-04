// Tipus del càlcul del progrés, compartit entre la web i l'app.

export type StatsCategoria = {
  /** Preguntes contestades en total. */
  fetes: number;
  /** Quantes ben contestades. */
  encerts: number;
  /** Sessions acabades. */
  sessions: number;
  /** Millor percentatge d'una sessió (0-100). */
  millor: number;
  /** Percentatge de l'última sessió. */
  ultim: number;
  /** Segons acumulats. */
  segons: number;
  /** Quan va ser l'última vegada. */
  quan: number;
};

export type StatsPsico = { categories: Record<string, StatsCategoria> };

export type ResultatSessio = {
  per: Record<string, { fetes: number; encerts: number }>;
  segons: number;
};

export const CLAU: string;

/** Unes estadístiques buides. Sempre un objecte nou. */
export function cap(): StatsPsico;
/** Llegeix el que s'hagi desat, passi el que passi amb el que hi hagi. */
export function desDeText(cru: string | null | undefined): StatsPsico;
/** Suma una sessió i en torna unes de noves. No toca les que li passes. */
export function aplicaSessio(
  stats: StatsPsico, resultat: ResultatSessio, ara?: number,
): StatsPsico;

export function encertDe(stats: StatsPsico, categoria: string): number | null;
export function encertBloc(stats: StatsPsico, blocId: string): number | null;
export function totalFetes(stats: StatsPsico): number;
export function blocMesFluix(stats: StatsPsico): { id: string; pct: number } | null;
