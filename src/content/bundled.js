// Contingut de reserva ("fallback") que viatja dins del binari de l'app.
//
// L'app SEMPRE arrenca amb aquest contingut i tot seguit intenta descarregar
// una versió més nova des de la xarxa. Si el `version` remot és superior al
// d'aquí, el remot guanya i queda a la memòria cau del dispositiu.
//
// ⚠️ Per publicar contingut nou NO cal tocar aquest fitxer ni fer cap build:
//    edita `content/content.json` i puja'l. Vegeu CONTENT.md.

import { TEMES, TEST_QUESTIONS, FLASHCARDS, PHYSICAL_TESTS } from '../data/academia.js';
import { TEMARI } from '../data/temari.js';
import { PSICO_CATEGORIES, PSICO_QUESTIONS } from '../data/psicotecnics.js';
import { INFRACTIONS } from '../data/infractions.js';
import { PROTOCOLS } from '../data/protocols.js';

// Versió del contingut que va dins del binari.
// El JSON remot ha de tenir un `version` MÉS ALT per substituir-lo.
export const BUNDLED_VERSION = 1;

export const CONTENT_KEYS = [
  'temes',
  'temari',
  'testQuestions',
  'flashcards',
  'psicoCategories',
  'psicoQuestions',
  'physicalTests',
  'infractions',
  'protocols',
  'news',
];

export const BUNDLED_CONTENT = {
  version: BUNDLED_VERSION,
  updatedAt: '2026-08-13',
  label: 'Contingut inclòs a l\'app',
  temes: TEMES,
  temari: TEMARI,
  testQuestions: TEST_QUESTIONS,
  flashcards: FLASHCARDS,
  psicoCategories: PSICO_CATEGORIES,
  psicoQuestions: PSICO_QUESTIONS,
  physicalTests: PHYSICAL_TESTS,
  infractions: INFRACTIONS,
  protocols: PROTOCOLS,
  news: [],
};
