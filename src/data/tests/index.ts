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
import cp from './cp-10-1995';
import lossp from './lossp-4-2003';
import transit from './transit-lsv';
import codiEtica from './codi-etica-policia';
import lecrim from './lecrim';
import armamentPl from './armament-pl';
import lopvvd from './lopvvd-27-2003';
import lorpm from './lorpm-5-2000';
import lepar from './lepar-11-2009';
import lpac from './lpac-39-40-2015';
import cultura from './cultura-general';
import culturaHistoria from './cultura-historia';
import culturaGeografia from './cultura-geografia';
import culturaSistemaSolar from './cultura-sistema-solar';
import culturaMusica from './cultura-musica';
import culturaTrigonometria from './cultura-trigonometria';
import culturaPintura from './cultura-pintura';
import culturaLiteratura from './cultura-literatura';
import culturaCosHuma from './cultura-cos-huma';
import terrassa from './terrassa';
import manresa from './manresa';
import elprat from './elprat';
import lhospitalet from './lhospitalet';
import badalona from './badalona';
import tarragona from './tarragona';
import vendrell from './vendrell';
import mataro from './mataro';
import mossosA1 from './mossos-a1';
import mossosA2 from './mossos-a2';
import mossosA3 from './mossos-a3';
import mossosA4 from './mossos-a4';
import mossosA5 from './mossos-a5';
import mossosA6 from './mossos-a6';
import mossosA7 from './mossos-a7';
import mossosB1 from './mossos-b1';
import mossosB2 from './mossos-b2';
import mossosB3 from './mossos-b3';
import mossosB4 from './mossos-b4';
import mossosB5 from './mossos-b5';
import mossosB6 from './mossos-b6';
import mossosB7 from './mossos-b7';
import mossosB8 from './mossos-b8';
import mossosC1 from './mossos-c1';
import mossosC2 from './mossos-c2';
import mossosC3 from './mossos-c3';
import mossosC4 from './mossos-c4';
import mossosC5 from './mossos-c5';
import actualitatPl2026 from './actualitat-pl-2026';
import calafell from './calafell';
import sabadell from './sabadell';
import rgc1428 from './rgc-1428-2003';
import estrangeria from './lo4-2000-estrangeria';
import proteccioCivil from './proteccio-civil';
import igualtatGenere from './igualtat-genere';
import reus from './reus';
import terrassa2026 from './terrassa-2026';

export const TOPICS: TestTopic[] = [
  ce78,
  lopsc,
  eac,
  lrbrl,
  lpc,
  lofcs,
  cp,
  lossp,
  transit,
  codiEtica,
  lecrim,
  armamentPl,
  lopvvd,
  lorpm,
  lepar,
  lpac,
  cultura,
  culturaHistoria,
  culturaGeografia,
  culturaSistemaSolar,
  culturaMusica,
  culturaTrigonometria,
  culturaPintura,
  culturaLiteratura,
  culturaCosHuma,
  terrassa,
  manresa,
  elprat,
  lhospitalet,
  badalona,
  tarragona,
  vendrell,
  mataro,
  mossosA1,
  mossosA2,
  mossosA3,
  mossosA4,
  mossosA5,
  mossosA6,
  mossosA7,
  mossosB1,
  mossosB2,
  mossosB3,
  mossosB4,
  mossosB5,
  mossosB6,
  mossosB7,
  mossosB8,
  mossosC1,
  mossosC2,
  mossosC3,
  mossosC4,
  mossosC5,
  actualitatPl2026,
  calafell,
  sabadell,
  rgc1428,
  estrangeria,
  proteccioCivil,
  igualtatGenere,
  reus,
  terrassa2026,
];

export function getTopic(slug: string): TestTopic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

// Pool de TOTES les preguntes etiquetades amb el slug del tema d'origen.
// Util per al mode 'test de tots els temes'. NOMÉS inclou els temes
// de category 'temari' (per defecte); els de category 'cultura' s'exclouen
// del pool combinat — tenen el seu propi mode.
export type TaggedQuestion = TestTopic['questions'][number] & { topicSlug: string };

export function getAllQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    if (t.category && t.category !== 'temari') continue;
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}

/** Pool ABSOLUT: TOTES les preguntes de TOTS els temes (qualsevol
 *  categoria: temari, cultura, municipi, mossos i actualitat). Per al
 *  mode "totes les preguntes de cop". */
export function getEverythingQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}

/** Pool de TOTES les preguntes de Mossos d'Esquadra (totes les
 *  categoria 'mossos'), per al mode 'tot els temes' dins /mossos. */
export function getAllMossosQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    if (t.category !== 'mossos') continue;
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}

/** Pool de TOTES les preguntes de Cultura General (categoria 'cultura'),
 *  per al mode 'tot els temes' dins /cultura-general. */
export function getAllCulturaQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    if (t.category !== 'cultura') continue;
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}

/** Pool de TOTES les preguntes d'Actualitat (categoria 'actualitat'),
 *  per al mode 'tot els temes' dins /actualitat. */
export function getAllActualitatQuestions(): TaggedQuestion[] {
  const out: TaggedQuestion[] = [];
  for (const t of TOPICS) {
    if (t.category !== 'actualitat') continue;
    for (const q of t.questions) {
      out.push({ ...q, topicSlug: t.slug });
    }
  }
  return out;
}

/** Filtre per categoria. */
export function getTopicsByCategory(
  category: 'temari' | 'cultura' | 'municipi' | 'mossos' | 'actualitat',
): TestTopic[] {
  return TOPICS.filter((t) => (t.category ?? 'temari') === category);
}

/** Agrupa els temes 'municipi' pel camp `municipi` (ex. Terrassa → [...]). */
export function getMunicipiGroups(): { municipi: string; topics: TestTopic[] }[] {
  const groups = new Map<string, TestTopic[]>();
  for (const t of TOPICS) {
    if (t.category !== 'municipi') continue;
    const key = t.municipi ?? t.title;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  return Array.from(groups, ([municipi, topics]) => ({ municipi, topics }));
}

/** Temes de Mossos d'Esquadra agrupats per àmbit (A, B, C, D, E). */
export function getMossosByAmbit(): { ambit: string; topics: TestTopic[] }[] {
  const groups = new Map<string, TestTopic[]>();
  for (const t of TOPICS) {
    if (t.category !== 'mossos') continue;
    const key = t.ambit ?? '?';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  // Ordena per subtema dins de cada àmbit
  for (const topics of groups.values()) {
    topics.sort((a, b) => (a.subtema ?? 0) - (b.subtema ?? 0));
  }
  return Array.from(groups, ([ambit, topics]) => ({ ambit, topics })).sort((a, b) =>
    a.ambit.localeCompare(b.ambit),
  );
}
