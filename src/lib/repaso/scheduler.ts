// Motor de repàs espaiat — SM-2 MODIFICAT. Lògica 100% PURA:
// no depèn de React ni de Supabase, no té efectes secundaris. Cada funció
// rep l'estat de la targeta + la qualitat de resposta i retorna un estat nou.
//
// Simplificacions respecte a Anki (l'usuari respon un test, no s'autoavalua):
//   - 3 graus de qualitat: 'fail' | 'hard' | 'good'
//     ('fallo' / 'correcta amb dubte' / 'correcta amb seguretat')
//   - En fallar: l'interval es reinicia a 1 dia i el factor de facilitat baixa.
//   - Progressió ideal (respostes 'good' seguides): 1, 4, 7, 14, 30 dies.

/** Grau de resposta. */
export type Grade = 'fail' | 'hard' | 'good';

/** Estat de programació d'una targeta (subconjunt SRS de review_state). */
export type CardSchedule = {
  /** Factor de facilitat (SM-2). Arrencada 2.5, mínim 1.3. */
  ease: number;
  /** Interval actual en dies. */
  intervalDays: number;
  /** Encerts consecutius (es reinicia a 0 en fallar). */
  repetitions: number;
  /** Vegades que s'ha fallat (mai baixa). */
  lapses: number;
  /** Instant de la propera revisió (epoch ms). Una targeta nova venç a 0. */
  dueAt: number;
  /** Instant de l'última revisió (epoch ms). 0 si mai revisada. */
  lastReviewedAt: number;
  /** Últim grau aplicat. */
  lastGrade: Grade | null;
  /** Fase de la targeta. */
  state: 'new' | 'learning' | 'review' | 'lapsed';
  /** Total de revisions fetes. */
  totalReviews: number;
  /** Revisions correctes (hard o good). */
  correctReviews: number;
};

// ---------- Constants del model (ajustables en un sol lloc) ----------
export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;
/** Progressió ideal d'intervals (dies) per a respostes 'good' seguides. */
export const IDEAL_LADDER = [1, 4, 7, 14, 30] as const;
/** Multiplicador per a 'correcta amb dubte' (repassa una mica abans). */
export const HARD_FACTOR = 0.7;
/** Interval al qual es reinicia en fallar. */
export const LAPSE_INTERVAL_DAYS = 1;
/** Encerts consecutius per considerar la targeta "en revisió". */
const GRADUATE_REPETITIONS = 3;

export const DAY_MS = 86_400_000;

/** Qualitat SM-2 (0..5) equivalent a cada grau simplificat. */
const QUALITY: Record<Grade, number> = { fail: 1, hard: 3, good: 5 };

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Arrodoneix a 2 decimals (precisió de la columna numeric(4,2) i tests estables). */
function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/** Variació del factor de facilitat segons SM-2 per a una qualitat q. */
function easeDelta(q: number): number {
  return 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
}

/** Crea l'estat inicial d'una targeta nova (venç immediatament). */
export function createNewCard(): CardSchedule {
  return {
    ease: INITIAL_EASE,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueAt: 0,
    lastReviewedAt: 0,
    lastGrade: null,
    state: 'new',
    totalReviews: 0,
    correctReviews: 0,
  };
}

/** True si la targeta ja toca (nova, o dueAt ja passat). */
export function isDue(card: CardSchedule, now: number): boolean {
  return card.state === 'new' || card.dueAt <= now;
}

/**
 * Aplica una resposta i retorna l'estat NOU (funció pura).
 * @param prev estat previ de la targeta
 * @param grade grau de resposta ('fail' | 'hard' | 'good')
 * @param now instant de la revisió en epoch ms (injectat per ser determinista)
 */
export function review(prev: CardSchedule, grade: Grade, now: number): CardSchedule {
  const ease = round2(clamp(prev.ease + easeDelta(QUALITY[grade]), MIN_EASE, MAX_EASE));

  let repetitions: number;
  let intervalDays: number;
  let lapses: number;
  let state: CardSchedule['state'];

  if (grade === 'fail') {
    // Reinici: interval a 1 dia, ratxa a 0, la facilitat ja ha baixat.
    repetitions = 0;
    intervalDays = LAPSE_INTERVAL_DAYS;
    lapses = prev.lapses + 1;
    state = 'lapsed';
  } else {
    repetitions = prev.repetitions + 1;
    // Base: escala ideal per als primers encerts; després creix per EF.
    const base =
      repetitions <= IDEAL_LADDER.length
        ? IDEAL_LADDER[repetitions - 1]
        : Math.round(prev.intervalDays * ease);
    const factor = grade === 'hard' ? HARD_FACTOR : 1;
    intervalDays = Math.max(1, Math.round(base * factor));
    lapses = prev.lapses;
    state = repetitions >= GRADUATE_REPETITIONS ? 'review' : 'learning';
  }

  return {
    ease,
    intervalDays,
    repetitions,
    lapses,
    dueAt: now + intervalDays * DAY_MS,
    lastReviewedAt: now,
    lastGrade: grade,
    state,
    totalReviews: prev.totalReviews + 1,
    correctReviews: prev.correctReviews + (grade === 'fail' ? 0 : 1),
  };
}
