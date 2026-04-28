// Registry de temes de test. Per afegir un tema nou:
//   1. Crea un fitxer src/data/tests/<slug>.ts amb un export default TestTopic
//   2. Importa'l aqui i afegeix-lo a l'array TOPICS
import type { TestTopic } from './types';
import ce78 from './ce78';
import lopsc from './lopsc-4-2015';
import eac from './eac';
import lrbrl from './lrbrl-7-1985';
import lpc from './lpc-16-1991';
import lofcs from './lofcs-2-1986';

export const TOPICS: TestTopic[] = [
  ce78,
  lopsc,
  eac,
  lrbrl,
  lpc,
  lofcs,
];

export function getTopic(slug: string): TestTopic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

// Pool de TOTES les preguntes etiquetades amb el slug del tema d'origen.
// Util per al mode 'test de tots els temes'.
export type TaggedQuestion = TestTopic['questions'][number] & { topicSlug: string };

export function getAllQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}
