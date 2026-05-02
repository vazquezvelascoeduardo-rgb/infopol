// Sistema de revisió de preguntes errades (Leitner / Anki-style).
//
// Cada vegada que l'usuari falla una pregunta, en deixem constància aquí
// amb la seva "caixa" Leitner. Una resposta correcta puja la caixa; una
// resposta errada la baixa a 1 (que vol dir 'cal repassar aviat').
// Cada caixa té un interval de repàs:
//
//   Caixa 1 → 1 dia    (acabat de fallar, repàs immediat)
//   Caixa 2 → 2 dies
//   Caixa 3 → 4 dies
//   Caixa 4 → 8 dies
//   Caixa 5 → 16 dies  (després de 2 èxits seguits → 'mastered')
//
// Tot al localStorage (clau 'infopol-test-failures'). Sense backend; les
// dades viuen al dispositiu. Si en el futur volem sincronització entre
// dispositius, només cal afegir una capa de sync sobre aquest mateix
// model.
import { useEffect, useState } from 'react';
import { TOPICS } from '../data/tests';
import type { TestQuestion } from '../data/tests/types';

const STORAGE_KEY = 'infopol-test-failures';

export type Box = 1 | 2 | 3 | 4 | 5;

export type FailureRecord = {
  /** ID de la pregunta (ex. 'manresa-42'). */
  questionId: string;
  /** Slug del tema d'origen (ex. 'manresa'). */
  topicSlug: string;
  /** Caixa Leitner actual (1-5). */
  box: Box;
  /** Vegades que l'usuari ha fallat aquesta pregunta. */
  failures: number;
  /** Èxits consecutius des de l'últim error. */
  successStreak: number;
  /** Timestamp ms del primer error (per ordenar 'noves'). */
  firstFailedAt: number;
  /** Timestamp ms de l'últim error. */
  lastFailedAt: number;
  /** Timestamp ms de l'última revisió (èxit o error). */
  lastReviewedAt?: number;
  /** Timestamp ms de la pròxima revisió programada. */
  nextReviewAt: number;
  /** True quan l'usuari ha demostrat dominar la pregunta (caixa 5 + 2 èxits). */
  mastered: boolean;
};

type FailuresState = Record<string, FailureRecord>;

const EMPTY: FailuresState = {};

// Intervals en dies per caixa.
const BOX_INTERVAL_DAYS: Record<Box, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function read(): FailuresState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY;
    return parsed as FailuresState;
  } catch {
    return EMPTY;
  }
}

function write(s: FailuresState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  } catch { /* silent */ }
}

function nextReviewFromBox(box: Box, now: number): number {
  return now + BOX_INTERVAL_DAYS[box] * ONE_DAY_MS;
}

/** Registra que l'usuari ha fallat una pregunta. Baixa a caixa 1. */
export function recordFailure(questionId: string, topicSlug: string): void {
  const s = read();
  const now = Date.now();
  const prev = s[questionId];
  if (prev) {
    s[questionId] = {
      ...prev,
      box: 1,
      failures: prev.failures + 1,
      successStreak: 0,
      lastFailedAt: now,
      lastReviewedAt: now,
      nextReviewAt: nextReviewFromBox(1, now),
      mastered: false,
    };
  } else {
    s[questionId] = {
      questionId,
      topicSlug,
      box: 1,
      failures: 1,
      successStreak: 0,
      firstFailedAt: now,
      lastFailedAt: now,
      lastReviewedAt: now,
      nextReviewAt: nextReviewFromBox(1, now),
      mastered: false,
    };
  }
  write(s);
}

/**
 * Registra un èxit en una pregunta. Només fa res si la pregunta ja era
 * un fallat conegut: en aquest cas, puja la caixa i programa el següent
 * repàs. Si arriba a caixa 5 amb successStreak >= 2 → 'mastered'.
 */
export function recordSuccess(questionId: string): void {
  const s = read();
  const prev = s[questionId];
  if (!prev) return; // no era un fallat → res a fer
  const now = Date.now();
  const newBox: Box = Math.min(5, prev.box + 1) as Box;
  const newStreak = prev.successStreak + 1;
  const mastered = newBox === 5 && newStreak >= 2;
  s[questionId] = {
    ...prev,
    box: newBox,
    successStreak: newStreak,
    lastReviewedAt: now,
    nextReviewAt: nextReviewFromBox(newBox, now),
    mastered,
  };
  write(s);
}

/** Esborra una pregunta de la llista de fallats (l'usuari la considera dominada). */
export function removeFailure(questionId: string): void {
  const s = read();
  if (!s[questionId]) return;
  delete s[questionId];
  write(s);
}

/** Esborra TOTS els registres de fallats. */
export function resetAllFailures(): void {
  write(EMPTY);
}

/** Retorna tots els registres ordenats per `nextReviewAt` ascendent. */
export function getAllFailures(): FailureRecord[] {
  const s = read();
  return Object.values(s).sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

/** Retorna els registres que toca repassar ara (no masterats i due). */
export function getDueFailures(now: number = Date.now()): FailureRecord[] {
  return getAllFailures().filter((r) => !r.mastered && r.nextReviewAt <= now);
}

/** Comptadors per al dashboard. */
export type FailuresCounts = {
  total: number;       // tots els registres no-masterats
  due: number;         // due ara
  mastered: number;    // ja dominats
};

export function getFailuresCounts(now: number = Date.now()): FailuresCounts {
  const all = getAllFailures();
  let total = 0;
  let due = 0;
  let mastered = 0;
  for (const r of all) {
    if (r.mastered) mastered++;
    else {
      total++;
      if (r.nextReviewAt <= now) due++;
    }
  }
  return { total, due, mastered };
}

// ── Cerca de la pregunta original a partir de l'ID ──────────────────

/**
 * Donat un questionId, retorna la pregunta original (amb topicSlug
 * etiquetat per al render) o null si no existeix (pot passar si la
 * pregunta s'ha eliminat del codi font des que es va guardar).
 */
export function lookupQuestion(
  questionId: string,
): (TestQuestion & { topicSlug: string }) | null {
  for (const t of TOPICS) {
    const q = t.questions.find((qq) => qq.id === questionId);
    if (q) return { ...q, topicSlug: t.slug };
  }
  return null;
}

/**
 * Construeix la pool de preguntes per al mode repàs. Per defecte, només
 * les due ara; opció `all` per repassar totes les no-masterades.
 */
export function buildRepasPool(
  opts: { onlyDue?: boolean; max?: number; now?: number } = {},
): Array<TestQuestion & { topicSlug: string }> {
  const { onlyDue = true, max = 50, now = Date.now() } = opts;
  const records = onlyDue ? getDueFailures(now) : getAllFailures().filter((r) => !r.mastered);
  const out: Array<TestQuestion & { topicSlug: string }> = [];
  for (const r of records) {
    const q = lookupQuestion(r.questionId);
    if (q) out.push(q);
    if (out.length >= max) break;
  }
  return out;
}

// ── HOOK reactiu ────────────────────────────────────────────────────

export function useFailuresCounts(): FailuresCounts {
  const [counts, setCounts] = useState<FailuresCounts>(() => getFailuresCounts());
  useEffect(() => {
    function refresh(e?: StorageEvent) {
      if (!e || e.key === STORAGE_KEY || e.key === null) {
        setCounts(getFailuresCounts());
      }
    }
    refresh();
    window.addEventListener('storage', refresh);
    // Tornem a calcular quan torna el focus per refrescar 'due'.
    window.addEventListener('focus', () => refresh());
    return () => {
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return counts;
}
