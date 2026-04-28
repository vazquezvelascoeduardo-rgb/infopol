// Estadistiques personals dels tests (localStorage).
// Per cada tema desem: millor nota, ultima nota, nombre de tests fets,
// totals d'encerts/fallades/blancs, temps total acumulat. Tot al
// localStorage del navegador. No surt mai del dispositiu.
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'infopol-test-stats';

export type TopicStats = {
  /** Tests completats. */
  attempts: number;
  /** Millor nota 0-10 obtinguda en aquest tema. */
  best: number;
  /** Ultima nota 0-10. */
  last: number;
  /** Suma d'encerts en tots els tests d'aquest tema. */
  totalCorrect: number;
  /** Suma de fallades. */
  totalWrong: number;
  /** Suma de blancs. */
  totalBlank: number;
  /** Suma de preguntes respostes. */
  totalQuestions: number;
  /** Temps total acumulat (segons). */
  totalSeconds: number;
  /** Timestamp de l'ultim test. */
  lastAt: number;
};

export type GlobalStats = {
  topics: Record<string, TopicStats>;
  /** Llista de IDs de logros desbloquejats. */
  achievements: string[];
};

const EMPTY: GlobalStats = { topics: {}, achievements: [] };

function read(): GlobalStats {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY;
    return {
      topics: parsed.topics && typeof parsed.topics === 'object' ? parsed.topics : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return EMPTY;
  }
}

function write(s: GlobalStats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  } catch { /* silent */ }
}

export function getTopicStats(slug: string): TopicStats | null {
  return read().topics[slug] ?? null;
}

export function getGlobalStats(): GlobalStats {
  return read();
}

export type TestResultSummary = {
  topicSlug: string;
  grade: number;
  correct: number;
  wrong: number;
  blank: number;
  total: number;
  /** Durada del test en segons. */
  seconds: number;
};

/** Registra el resultat d'un test i actualitza les stats globals. */
export function recordTestResult(r: TestResultSummary) {
  const s = read();
  const prev: TopicStats = s.topics[r.topicSlug] ?? {
    attempts: 0, best: 0, last: 0,
    totalCorrect: 0, totalWrong: 0, totalBlank: 0,
    totalQuestions: 0, totalSeconds: 0, lastAt: 0,
  };
  const next: TopicStats = {
    attempts: prev.attempts + 1,
    best: Math.max(prev.best, r.grade),
    last: r.grade,
    totalCorrect: prev.totalCorrect + r.correct,
    totalWrong: prev.totalWrong + r.wrong,
    totalBlank: prev.totalBlank + r.blank,
    totalQuestions: prev.totalQuestions + r.total,
    totalSeconds: prev.totalSeconds + r.seconds,
    lastAt: Date.now(),
  };
  s.topics[r.topicSlug] = next;
  write(s);
  return { prev, next };
}

/** Marca un logro com a desbloquejat (idempotent). Retorna true si era nou. */
export function unlockAchievement(id: string): boolean {
  const s = read();
  if (s.achievements.includes(id)) return false;
  s.achievements.push(id);
  write(s);
  return true;
}

export function resetAllStats() {
  write(EMPTY);
}

// ── HOOKS reactius ──────────────────────────────────────────────────

export function useGlobalStats(): GlobalStats {
  const [stats, setStats] = useState<GlobalStats>(() => read());
  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === null) setStats(read());
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return stats;
}

// ── Nivell qualitatiu segons millor nota ────────────────────────────

export type Level = 'none' | 'novice' | 'intermediate' | 'advanced' | 'expert';

export function levelFromBest(best: number | undefined | null): Level {
  if (best === undefined || best === null || best === 0) return 'none';
  if (best < 5) return 'novice';
  if (best < 7) return 'intermediate';
  if (best < 9) return 'advanced';
  return 'expert';
}

/** Mitjana global de l'usuari sobre tots els temes (sobre 10). */
export function globalAverage(s: GlobalStats): { attempts: number; avgGrade: number } {
  let attempts = 0;
  let sumGrades = 0;
  for (const t of Object.values(s.topics)) {
    if (t.attempts > 0) {
      attempts += t.attempts;
      // No tenim historic complet de notes; aproximem pel best/last/atempts.
      // Mes correcte: usem (last + best)/2 com a estimacio simple. En absencia
      // d'historic detallat, fem servir 'last' com a pes principal.
      sumGrades += t.last * t.attempts;
    }
  }
  return {
    attempts,
    avgGrade: attempts > 0 ? sumGrades / attempts : 0,
  };
}
