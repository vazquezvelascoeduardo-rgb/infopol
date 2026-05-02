// Sistema de revisió de preguntes errades (estil Anki / SRS).
//
// Cada vegada que l'usuari falla una pregunta, en deixem constància aquí.
// Els intervals entre revisions els calculem a partir del comptador
// d'èxits consecutius des de l'últim error (`successStreak`):
//
//   0 (acabat de fallar) → repàs en 1 dia
//   1                    → 2 dies
//   2                    → 4 dies
//   3 (APRESA)           → 30 dies
//   4                    → 60 dies
//   5                    → 120 dies
//   6+                   → 240 dies (cap màxim)
//
// Quan arriba a 3 èxits seguits, la pregunta queda marcada com a
// "apresa" però NO surt del cicle: torna a aparèixer cada cop més
// espaiada per refrescar la memòria a llarg termini. Si alguna vegada
// l'usuari la torna a fallar, reseteja a 0 èxits → caixa 1.
//
// Tot al localStorage (clau 'infopol-test-failures'). Sense backend.
import { useEffect, useState } from 'react';
import { TOPICS } from '../data/tests';
import type { TestQuestion } from '../data/tests/types';

const STORAGE_KEY = 'infopol-test-failures';

export type FailureRecord = {
  /** ID de la pregunta (ex. 'manresa-42'). */
  questionId: string;
  /** Slug del tema d'origen. */
  topicSlug: string;
  /** Vegades totals que l'usuari ha fallat aquesta pregunta. */
  failures: number;
  /** Èxits consecutius des de l'últim error (0 = acabat de fallar). */
  successStreak: number;
  /** Timestamp ms del primer error registrat. */
  firstFailedAt: number;
  /** Timestamp ms de l'últim error. */
  lastFailedAt: number;
  /** Timestamp ms de l'última revisió (èxit o error). */
  lastReviewedAt?: number;
  /** Timestamp ms de la pròxima revisió programada. */
  nextReviewAt: number;
  /** True quan l'usuari ha demostrat saber-la (3+ èxits seguits). */
  learned: boolean;
};

type FailuresState = Record<string, FailureRecord>;
const EMPTY: FailuresState = {};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Dies fins al pròxim repàs en funció del nombre d'èxits consecutius.
 * 0 = acabat de fallar; 3+ = ja apresa (intervals creixents).
 */
export function intervalDaysForStreak(streak: number): number {
  if (streak <= 0) return 1;
  if (streak === 1) return 2;
  if (streak === 2) return 4;
  if (streak === 3) return 30;   // APRESA
  if (streak === 4) return 60;
  if (streak === 5) return 120;
  return 240; // cap màxim
}

/** Threshold a partir del qual una pregunta es considera 'apresa'. */
export const LEARNED_THRESHOLD = 3;

// ── Lectura/escriptura amb migració de versions anteriors ───────────

function migrateOne(raw: unknown): FailureRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.questionId === 'string' ? r.questionId : null;
  const slug = typeof r.topicSlug === 'string' ? r.topicSlug : null;
  if (!id || !slug) return null;
  // Versió anterior tenia `box: 1..5` i `mastered: bool`. Convertim a streak.
  const successStreak = typeof r.successStreak === 'number'
    ? r.successStreak
    : typeof r.box === 'number'
      ? Math.max(0, (r.box as number) - 1)
      : 0;
  const learned = typeof r.learned === 'boolean'
    ? (r.learned as boolean)
    : typeof r.mastered === 'boolean'
      ? (r.mastered as boolean)
      : successStreak >= LEARNED_THRESHOLD;
  return {
    questionId: id,
    topicSlug: slug,
    failures: typeof r.failures === 'number' ? r.failures : 1,
    successStreak,
    firstFailedAt: typeof r.firstFailedAt === 'number' ? r.firstFailedAt : (r.lastFailedAt as number) || Date.now(),
    lastFailedAt: typeof r.lastFailedAt === 'number' ? r.lastFailedAt : Date.now(),
    lastReviewedAt: typeof r.lastReviewedAt === 'number' ? r.lastReviewedAt : undefined,
    nextReviewAt: typeof r.nextReviewAt === 'number' ? r.nextReviewAt : Date.now(),
    learned,
  };
}

function read(): FailuresState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY;
    const out: FailuresState = {};
    for (const [id, val] of Object.entries(parsed as Record<string, unknown>)) {
      const m = migrateOne(val);
      if (m) out[id] = m;
    }
    return out;
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

function nextReviewFromStreak(streak: number, now: number): number {
  return now + intervalDaysForStreak(streak) * ONE_DAY_MS;
}

// ── API pública ──────────────────────────────────────────────────────

/** Registra que l'usuari ha fallat una pregunta. Reseteja successStreak. */
export function recordFailure(questionId: string, topicSlug: string): void {
  const s = read();
  const now = Date.now();
  const prev = s[questionId];
  s[questionId] = {
    questionId,
    topicSlug,
    failures: (prev?.failures ?? 0) + 1,
    successStreak: 0,
    firstFailedAt: prev?.firstFailedAt ?? now,
    lastFailedAt: now,
    lastReviewedAt: now,
    nextReviewAt: nextReviewFromStreak(0, now),
    learned: false,
  };
  write(s);
}

/**
 * Registra un èxit en una pregunta. Només té efecte si la pregunta
 * existia com a fallat: en aquest cas, incrementa successStreak,
 * marca com a 'apresa' si arriba a 3, i programa el següent repàs
 * més espaiat.
 */
export function recordSuccess(questionId: string): void {
  const s = read();
  const prev = s[questionId];
  if (!prev) return;
  const now = Date.now();
  const newStreak = prev.successStreak + 1;
  s[questionId] = {
    ...prev,
    successStreak: newStreak,
    lastReviewedAt: now,
    nextReviewAt: nextReviewFromStreak(newStreak, now),
    learned: newStreak >= LEARNED_THRESHOLD,
  };
  write(s);
}

/** Esborra una pregunta del registre (l'usuari la considera dominada). */
export function removeFailure(questionId: string): void {
  const s = read();
  if (!s[questionId]) return;
  delete s[questionId];
  write(s);
}

/** Esborra TOTS els registres. */
export function resetAllFailures(): void {
  write(EMPTY);
}

/** Tots els registres ordenats per `nextReviewAt` ascendent (els due primer). */
export function getAllFailures(): FailureRecord[] {
  const s = read();
  return Object.values(s).sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

/** Retorna els registres que toca repassar ara. */
export function getDueFailures(now: number = Date.now()): FailureRecord[] {
  return getAllFailures().filter((r) => r.nextReviewAt <= now);
}

/** Comptadors per al dashboard / badges. */
export type FailuresCounts = {
  /** Total de preguntes guardades (incloent apreses). */
  total: number;
  /** Due ara (apreses incloses si toca refrescar-les). */
  due: number;
  /** Apreses (3+ èxits). */
  learned: number;
  /** Encara per aprendre (< 3 èxits). */
  pending: number;
};

export function getFailuresCounts(now: number = Date.now()): FailuresCounts {
  const all = getAllFailures();
  let total = 0;
  let due = 0;
  let learned = 0;
  let pending = 0;
  for (const r of all) {
    total++;
    if (r.learned) learned++; else pending++;
    if (r.nextReviewAt <= now) due++;
  }
  return { total, due, learned, pending };
}

// ── Cerca de la pregunta original a partir de l'ID ──────────────────

/**
 * Donat un questionId, retorna la pregunta original (amb topicSlug
 * etiquetat) o null si no existeix (pot passar si la pregunta s'ha
 * eliminat del codi font des que es va guardar).
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
 * Construeix la pool de preguntes per al mode repàs. Per defecte només
 * les due ara; si `onlyDue=false`, totes les guardades (incloent
 * apreses no-due, perquè l'usuari pugui forçar un repàs).
 */
export function buildRepasPool(
  opts: { onlyDue?: boolean; max?: number; now?: number } = {},
): Array<TestQuestion & { topicSlug: string }> {
  const { onlyDue = true, max = 50, now = Date.now() } = opts;
  const records = onlyDue ? getDueFailures(now) : getAllFailures();
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
    const onFocus = () => setCounts(getFailuresCounts());
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
  return counts;
}

/** Hook reactiu per a la llista completa (auto-refresca amb localStorage). */
export function useAllFailures(): FailureRecord[] {
  const [list, setList] = useState<FailureRecord[]>(() => getAllFailures());
  useEffect(() => {
    function refresh(e?: StorageEvent) {
      if (!e || e.key === STORAGE_KEY || e.key === null) {
        setList(getAllFailures());
      }
    }
    refresh();
    window.addEventListener('storage', refresh);
    const onFocus = () => setList(getAllFailures());
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
  return list;
}
