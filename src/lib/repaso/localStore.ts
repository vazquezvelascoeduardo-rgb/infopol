// Persistència LOCAL de l'estat SRS del motor de repàs.
//
// Bessó del de l'app (que fa servir AsyncStorage); aquí és localStorage,
// que a la web fa la mateixa feina. La clau és la mateixa a propòsit, i
// és independent del sistema de flashcards antic.
//
// De moment cada dispositiu porta el seu estat: la sincronització amb
// Supabase encara no hi és a cap de les dues bandes.
import type { CardSchedule } from './scheduler';

const KEY = 'ip.repaso.state.v1';
type ScheduleMap = Record<string, CardSchedule>;

export function getAllSchedules(): ScheduleMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScheduleMap) : {};
  } catch {
    return {};
  }
}

export function getSchedule(qid: string): CardSchedule | undefined {
  return getAllSchedules()[qid];
}

export function saveSchedule(qid: string, schedule: CardSchedule): void {
  try {
    const all = getAllSchedules();
    all[qid] = schedule;
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Si el navegador no deixa desar (mode privat, quota), la sessió
    // continua igualment: val més repassar sense memòria que no repassar.
  }
}
