// Sistema d'estudi tipus Anki per a les flashcards.
//
// A diferència de lib/failures.ts (que tracta preguntes FALLADES als
// tests), aquest sistema gestiona l'estudi continuat de TOTES les
// preguntes com a flashcards. Cada carta té un estat SRS independent.
//
// Intervals (en dies des del darrer review):
//   - Again (la fallo / no la sé): 0 (la torno a veure aquesta sessió)
//   - Bona (l'encerto): 1d → 3d → 7d → 14d → 30d → 60d → 120d → 240d
//   - Fàcil (l'encerto fàcilment): salta 2 nivells (multiplica × 2.5)
//
// Storage: una clau per cos (Policia Local i Mossos) per separar pools.

const STORAGE_KEY = (corps: 'pl' | 'mossos') => `infopol-fc-srs-${corps}`;

export type FlashcardState = {
  /** ID estable de la pregunta. */
  cardId: string;
  /** Slug del tema d'origen. */
  topicSlug: string;
  /** Successos consecutius (Bona/Fàcil). 0 = acabada de fallar. */
  streak: number;
  /** Timestamp del proper review (ms epoch). */
  nextReviewAt: number;
  /** Última data de review (ms). */
  lastReviewedAt: number;
  /** Total de revisions. */
  reviews: number;
};

export type Rating = 'again' | 'good' | 'easy';

// Intervals en dies segons streak (índex = streak final).
const INTERVALS_DAYS = [1, 3, 7, 14, 30, 60, 120, 240];

function intervalForStreak(streak: number): number {
  if (streak <= 0) return 0; // Reaparèix avui
  const idx = Math.min(streak - 1, INTERVALS_DAYS.length - 1);
  return INTERVALS_DAYS[idx];
}

function readAll(corps: 'pl' | 'mossos'): Record<string, FlashcardState> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY(corps));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, FlashcardState>;
  } catch {
    return {};
  }
}

function writeAll(corps: 'pl' | 'mossos', data: Record<string, FlashcardState>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY(corps), JSON.stringify(data));
  } catch {
    // localStorage ple → ignorem en silenci.
  }
}

export function getCardState(corps: 'pl' | 'mossos', cardId: string): FlashcardState | null {
  const all = readAll(corps);
  return all[cardId] ?? null;
}

/**
 * Aplica una valoració a una carta. Si no existia, la crea.
 * Retorna el nou estat.
 */
export function rateCard(
  corps: 'pl' | 'mossos',
  cardId: string,
  topicSlug: string,
  rating: Rating,
): FlashcardState {
  const all = readAll(corps);
  const prev = all[cardId];
  const now = Date.now();
  let streak: number;

  if (rating === 'again') {
    streak = 0;
  } else if (rating === 'good') {
    streak = (prev?.streak ?? 0) + 1;
  } else {
    // easy: salta 1 nivell extra
    streak = (prev?.streak ?? 0) + 2;
  }

  const days = intervalForStreak(streak);
  const nextReviewAt = now + days * 24 * 60 * 60 * 1000;

  const next: FlashcardState = {
    cardId,
    topicSlug,
    streak,
    nextReviewAt,
    lastReviewedAt: now,
    reviews: (prev?.reviews ?? 0) + 1,
  };
  all[cardId] = next;
  writeAll(corps, all);
  return next;
}

/**
 * Construeix un pool d'estudi:
 *   - Cartes due (nextReviewAt <= now): màxima prioritat.
 *   - Cartes noves (sense estat): omplen fins arribar a `targetSize`.
 * El pool retornat NO conté cap pregunta repetida.
 */
export function buildStudyPool(
  corps: 'pl' | 'mossos',
  allCardIds: Array<{ id: string; topicSlug: string }>,
  targetSize: number = 20,
): { cardIds: string[]; dueCount: number; newCount: number; totalKnown: number } {
  const all = readAll(corps);
  const now = Date.now();

  const due: Array<{ id: string; topicSlug: string; nextReviewAt: number }> = [];
  const fresh: Array<{ id: string; topicSlug: string }> = [];

  for (const c of allCardIds) {
    const state = all[c.id];
    if (!state) {
      fresh.push(c);
      continue;
    }
    if (state.nextReviewAt <= now) {
      due.push({ ...c, nextReviewAt: state.nextReviewAt });
    }
  }

  // Due primer (per data més antiga primer = més endarrerides).
  due.sort((a, b) => a.nextReviewAt - b.nextReviewAt);

  // Mesclem les noves per varietat.
  for (let i = fresh.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
  }

  const pool: string[] = [];
  for (const d of due) {
    if (pool.length >= targetSize) break;
    pool.push(d.id);
  }
  for (const f of fresh) {
    if (pool.length >= targetSize) break;
    pool.push(f.id);
  }

  return {
    cardIds: pool,
    dueCount: due.length,
    newCount: fresh.length,
    totalKnown: Object.keys(all).length,
  };
}

export type SRSStats = {
  total: number;
  due: number;
  newCards: number;
  studied: number;
  /** Cartes amb streak >= 4 (>= 14 dies entre reviews). */
  mastered: number;
};

export function getSRSStats(
  corps: 'pl' | 'mossos',
  allCardIds: Array<{ id: string; topicSlug: string }>,
): SRSStats {
  const all = readAll(corps);
  const now = Date.now();
  let due = 0;
  let mastered = 0;
  let studied = 0;
  let fresh = 0;
  for (const c of allCardIds) {
    const state = all[c.id];
    if (!state) {
      fresh++;
      continue;
    }
    studied++;
    if (state.nextReviewAt <= now) due++;
    if (state.streak >= 4) mastered++;
  }
  return {
    total: allCardIds.length,
    due,
    newCards: fresh,
    studied,
    mastered,
  };
}

export function resetSRS(corps: 'pl' | 'mossos'): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY(corps));
}
