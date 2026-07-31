// Construcció de la CUA diària de repàs. Lògica 100% PURA (sense React ni
// Supabase, sense efectes secundaris). Rep candidats ja carregats i retorna
// l'ordre de la sessió.
//
// Regles:
//   - Una pregunta amb la norma NO vigent (o inactiva) MAI entra a la cua
//     (el seu historial es conserva a la capa de dades; aquí només s'exclou).
//   - Ordre: preguntes VENÇUDES per (dies de retard DESC, tasa de fallada del
//     tema DESC). Més retard primer; a igualtat, el tema que es porta pitjor.
//   - Límit de preguntes per sessió configurable (per defecte 30).
import { DAY_MS, isDue, type CardSchedule } from './scheduler';

/** Límit de preguntes per sessió per defecte. */
export const DEFAULT_SESSION_LIMIT = 30;

/** Candidat a entrar a la cua: estat de la targeta + context per ordenar. */
export type QueueCandidate = {
  questionId: string;
  topicId: string;
  schedule: CardSchedule;
  /** false si la norma no és vigent o la pregunta està inactiva → s'exclou. */
  servable: boolean;
  /** Tasa de fallada del tema (0..1) per desempatar. */
  topicFailRate: number;
};

export type BuildQueueOptions = {
  /** Instant de referència (epoch ms). */
  now: number;
  /** Màxim de preguntes a la sessió. Per defecte DEFAULT_SESSION_LIMIT. */
  limit?: number;
};

/** Dies de retard d'una targeta respecte a ara (0 per a targetes noves). */
export function daysOverdue(card: CardSchedule, now: number): number {
  if (card.state === 'new') return 0;
  const diff = now - card.dueAt;
  return diff <= 0 ? 0 : Math.floor(diff / DAY_MS);
}

/**
 * Construeix la cua de la sessió (funció pura; no muta l'entrada).
 * Filtra: només servibles i que ja toquen; ordena i aplica el límit.
 */
export function buildQueue(
  candidates: readonly QueueCandidate[],
  options: BuildQueueOptions,
): QueueCandidate[] {
  const { now } = options;
  const limit = options.limit ?? DEFAULT_SESSION_LIMIT;

  const due = candidates.filter((c) => c.servable && isDue(c.schedule, now));

  due.sort((a, b) => {
    const byOverdue = daysOverdue(b.schedule, now) - daysOverdue(a.schedule, now);
    if (byOverdue !== 0) return byOverdue;
    return b.topicFailRate - a.topicFailRate;
  });

  return limit < 0 ? due : due.slice(0, limit);
}
