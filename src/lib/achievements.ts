// Logros desbloquejables. Cada logro te un ID estable, una icona, un
// titol i una descripcio. La logica de desbloqueig es centralitza a
// checkAchievements() — s'invoca despres de registrar un test i retorna
// la llista de logros NOUS desbloquejats en aquest moment.
import { TOPICS } from '../data/tests';
import {
  getGlobalStats, unlockAchievement,
  type GlobalStats, type TestResultSummary,
} from './testStats';

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-test', icon: '🎯', title: 'Primer test', description: 'Has fet el teu primer test.' },
  { id: 'pass', icon: '✅', title: 'Aprovat', description: 'Has tret un 5 o més.' },
  { id: 'notable', icon: '🌟', title: 'Notable', description: 'Has tret un 7 o més.' },
  { id: 'excellent', icon: '🏆', title: 'Excel·lent', description: 'Has tret un 9 o més.' },
  { id: 'perfect', icon: '💯', title: 'Perfecte', description: 'Has tret un 10 sense fallades.' },
  { id: 'no-blanks', icon: '✊', title: 'A totes', description: 'Has acabat un test sense deixar cap pregunta en blanc.' },
  { id: 'comeback', icon: '📈', title: 'Anant a millor', description: 'Has superat la teva millor nota en un tema.' },
  { id: 'marathon', icon: '🔁', title: 'Constant', description: 'Has fet 10 tests del mateix tema.' },
  { id: 'versatile', icon: '🌍', title: 'Versàtil', description: 'Has fet almenys un test de cada tema.' },
  { id: 'speed-demon', icon: '⚡', title: 'Velocista', description: 'Has acabat un test de 25+ preguntes en menys de 5 minuts amb un 7 o més.' },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Comprova quins logros nous es desbloquejen amb aquest resultat i els
 * marca al localStorage. Retorna la llista de logros NOUS (no els ja
 * desbloquejats prèviament).
 *
 * Es crida JUST DESPRES de recordTestResult().
 */
export function checkAchievements(
  result: TestResultSummary,
  prevStats: GlobalStats,
): Achievement[] {
  const stats = getGlobalStats();
  const fresh: Achievement[] = [];

  function tryUnlock(id: string) {
    if (unlockAchievement(id)) {
      const a = getAchievementById(id);
      if (a) fresh.push(a);
    }
  }

  // first-test
  const totalAttemptsBefore = Object.values(prevStats.topics)
    .reduce((acc, t) => acc + t.attempts, 0);
  if (totalAttemptsBefore === 0) tryUnlock('first-test');

  // pass / notable / excellent / perfect
  if (result.grade >= 5) tryUnlock('pass');
  if (result.grade >= 7) tryUnlock('notable');
  if (result.grade >= 9) tryUnlock('excellent');
  if (result.grade >= 9.99 && result.wrong === 0 && result.blank === 0) tryUnlock('perfect');

  // no-blanks (en aquest test)
  if (result.blank === 0 && result.total > 0) tryUnlock('no-blanks');

  // comeback: nota actual > millor nota anterior d'aquest tema
  const prevTopic = prevStats.topics[result.topicSlug];
  if (prevTopic && result.grade > prevTopic.best) tryUnlock('comeback');

  // marathon: 10 tests d'un mateix tema
  const cur = stats.topics[result.topicSlug];
  if (cur && cur.attempts >= 10) tryUnlock('marathon');

  // versatile: al menys un test de cada tema
  const allTopicSlugs = TOPICS.map((t) => t.slug);
  const tested = new Set(Object.keys(stats.topics).filter((s) => stats.topics[s].attempts > 0));
  if (allTopicSlugs.every((s) => tested.has(s))) tryUnlock('versatile');

  // speed-demon: ≥25 preguntes en <5 min amb nota ≥7
  if (result.total >= 25 && result.seconds > 0 && result.seconds < 300 && result.grade >= 7) {
    tryUnlock('speed-demon');
  }

  return fresh;
}
