// Utilitats per a l'execucio del test:
//   - shuffle (Fisher–Yates)
//   - selecció de N preguntes no respostes (o totes si volem repassar)
//   - permutació de les opcions per pregunta (perque l'usuari no
//     memoritzi 'la C sempre')
//   - calcul de la nota final amb la formula de l'usuari

import type { TestQuestion } from '../data/tests/types';

export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Question amb les opcions ja barrejades. `correctIndex` es l'index
// (0-3) de la resposta correcta DINS de `options`.
export type ShuffledQuestion = {
  question: TestQuestion;
  options: string[];
  correctIndex: number;
};

export function shuffleQuestion(q: TestQuestion): ShuffledQuestion {
  const indices = shuffle([0, 1, 2, 3]);
  const options = indices.map((i) => q.options[i]);
  const correctIndex = indices.indexOf(q.correct);
  return { question: q, options, correctIndex };
}

// Selecciona N preguntes d'entre les disponibles, exclosent les que
// ja siguin a `excludedIds`. Si no n'hi ha prou de no respostes,
// retorna {questions: [], exhausted: true}.
export function pickQuestions(
  pool: TestQuestion[],
  excludedIds: Set<string>,
  count: number,
): { questions: TestQuestion[]; exhausted: boolean } {
  const available = pool.filter((q) => !excludedIds.has(q.id));
  if (available.length === 0) {
    return { questions: [], exhausted: true };
  }
  const shuffled = shuffle(available);
  return {
    questions: shuffled.slice(0, Math.min(count, shuffled.length)),
    exhausted: false,
  };
}

// Calcula puntuacio:
//   correctes: +1
//   fallades:  −0,25 (1/4 d'una correcta)
//   en blanc:  0
// Nota final escalada a 0–10:  max(0, (puntuacio_total / total_preguntes) * 10)
export type Score = {
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  /** Puntuacio bruta (positiu si majoria de correctes, pot ser negatiu). */
  raw: number;
  /** Nota final 0–10 (mai negativa). */
  grade: number;
};

export function computeScore(
  questions: ShuffledQuestion[],
  answers: Array<number | null>,
): Score {
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  for (let i = 0; i < questions.length; i++) {
    const a = answers[i];
    if (a === null || a === undefined) blank++;
    else if (a === questions[i].correctIndex) correct++;
    else wrong++;
  }
  const total = questions.length;
  const raw = correct - wrong * 0.25;
  const grade = total > 0 ? Math.max(0, (raw / total) * 10) : 0;
  return { total, correct, wrong, blank, raw, grade };
}
