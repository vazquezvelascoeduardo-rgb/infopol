// Construcció de la sessió de repàs diari.
//
// Fa el mateix que el servei de l'app: ajunta les preguntes que ja tenen
// estat SRS amb les que has fallat i encara no has recuperat, les passa
// pel motor pur (queue.ts) i en talla les primeres.
//
// El motor (scheduler.ts i queue.ts) és còpia literal del de l'app, així
// que les dues programen el repàs igual. El que NO es comparteix encara
// és l'estat: cada dispositiu porta el seu, perquè la sincronització a
// Supabase no existeix a cap de les dues bandes.
import { TOPICS } from '../../data/tests';
import { getAllFailures } from '../failures';
import { getGlobalStats } from '../testStats';
import { getAllSchedules, saveSchedule } from './localStore';
import { buildQueue, DEFAULT_SESSION_LIMIT, type QueueCandidate } from './queue';
import { createNewCard, review, type Grade } from './scheduler';

export type PreguntaSessio = {
  qid: string;
  topicSlug: string;
  topicTitle: string;
  text: string;
  options: string[];
  correct: number;
  reference?: string;
};

/** Totes les preguntes del banc, amb el seu tema. */
function totesLesPreguntes() {
  const out: {
    id: string; topicSlug: string; topicTitle: string;
    text: string; options: string[]; correct: number; reference?: string;
  }[] = [];
  for (const t of TOPICS) {
    for (const q of t.questions) {
      out.push({
        id: q.id, topicSlug: t.slug, topicTitle: t.title,
        text: q.text, options: [...q.options], correct: q.correct, reference: q.reference,
      });
    }
  }
  return out;
}

/** La cua del dia: el que toca repassar, ordenat i limitat. */
export function construeixSessio(limit: number = DEFAULT_SESSION_LIMIT): PreguntaSessio[] {
  const totes = totesLesPreguntes();
  const perId = new Map(totes.map((q) => [q.id, q]));

  const schedules = getAllSchedules();
  const fallades = getAllFailures();
  const stats = getGlobalStats();

  // Tassa de fallada per tema (proxy local: fallades pendents / respostes).
  const fallsPerTema: Record<string, number> = {};
  for (const f of fallades) {
    fallsPerTema[f.topicSlug] = (fallsPerTema[f.topicSlug] ?? 0) + 1;
  }
  const tassaFallada = (slug: string): number => {
    const respostes = stats.topics[slug]?.totalQuestions ?? 0;
    const fc = fallsPerTema[slug] ?? 0;
    if (respostes > 0) return Math.min(1, fc / respostes);
    return fc > 0 ? 1 : 0;
  };

  const qids = new Set<string>([
    ...Object.keys(schedules),
    ...fallades.map((f) => f.questionId),
  ]);

  const now = Date.now();
  const candidats: QueueCandidate[] = [];
  for (const qid of qids) {
    const q = perId.get(qid);
    if (!q) continue;   // la pregunta ja no és al banc
    candidats.push({
      questionId: qid,
      topicId: q.topicSlug,
      schedule: schedules[qid] ?? createNewCard(),
      servable: true,
      topicFailRate: tassaFallada(q.topicSlug),
    });
  }

  return buildQueue(candidats, { now, limit }).map((c) => {
    const q = perId.get(c.questionId)!;
    return {
      qid: c.questionId,
      topicSlug: q.topicSlug,
      topicTitle: q.topicTitle,
      text: q.text,
      options: q.options,
      correct: q.correct,
      reference: q.reference,
    };
  });
}

/** Desa la resposta: actualitza l'estat SRS de la targeta. */
export function registraResposta(qid: string, grau: Grade, now: number = Date.now()): void {
  const previ = getAllSchedules()[qid] ?? createNewCard();
  saveSchedule(qid, review(previ, grau, now));
}
