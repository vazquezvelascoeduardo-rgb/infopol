#!/usr/bin/env node
// Valida content/content.json abans de publicar-lo.
//
//   npm run content:check
//   npm run content:check -- https://raw.githubusercontent.com/.../content.json
//
// Comprova el mateix que comprova l'app: que el JSON és vàlid, que la versió
// és superior a la del binari i que les preguntes tenen forma correcta.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const { BUNDLED_VERSION, CONTENT_KEYS } = await import(join(root, 'src/content/bundled.js'));

const target = process.argv[2];
let bundle;

if (target && /^https?:/.test(target)) {
  const res = await fetch(target);
  if (!res.ok) {
    console.error(`❌ No s'ha pogut descarregar (HTTP ${res.status}): ${target}`);
    process.exit(1);
  }
  bundle = await res.json();
} else {
  const file = target || join(root, 'content/content.json');
  if (!existsSync(file)) {
    console.error(`❌ No existeix ${file}. Executa: npm run content:build`);
    process.exit(1);
  }
  bundle = JSON.parse(readFileSync(file, 'utf8'));
}

const errors = [];
const warnings = [];

if (typeof bundle.version !== 'number' || !Number.isFinite(bundle.version)) {
  errors.push('`version` ha de ser un número.');
} else if (bundle.version <= BUNDLED_VERSION) {
  errors.push(
    `\`version\` és ${bundle.version} i el binari porta ${BUNDLED_VERSION}: ` +
    'les apps instal·lades ignorarien aquest contingut.',
  );
}

if (!CONTENT_KEYS.some(k => bundle[k] != null)) {
  errors.push(`El fitxer no conté cap clau de contingut (${CONTENT_KEYS.join(', ')}).`);
}

const checkQuestions = (list, where) => {
  list.forEach((q, i) => {
    const at = `${where}[${i}]${q.id ? ` (${q.id})` : ''}`;
    if (!q.question) errors.push(`${at}: falta \`question\`.`);
    if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${at}: \`options\` ha de tenir 2 opcions o més.`);
    else if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) {
      errors.push(`${at}: \`correct\` (${q.correct}) està fora del rang d'opcions.`);
    }
    if (!q.explanation) warnings.push(`${at}: sense \`explanation\`.`);
  });
};

if (Array.isArray(bundle.testQuestions)) checkQuestions(bundle.testQuestions, 'testQuestions');
for (const [catId, list] of Object.entries(bundle.psicoQuestions || {})) {
  if (Array.isArray(list)) checkQuestions(list, `psicoQuestions.${catId}`);
}

// Cada categoria de psicotècnics hauria de tenir preguntes, i a l'inrevés.
const catIds = new Set((bundle.psicoCategories || []).map(c => c.id));
for (const id of Object.keys(bundle.psicoQuestions || {})) {
  if (!catIds.has(id)) warnings.push(`psicoQuestions.${id}: no hi ha cap categoria amb aquest id.`);
}
for (const id of catIds) {
  if (!(bundle.psicoQuestions || {})[id]?.length) warnings.push(`psicoCategories "${id}": encara no té preguntes.`);
}

// Les lliçons del temari han d'apuntar a blocs existents.
const temaIds = new Set((bundle.temes || []).map(t => String(t.id)));
for (const id of Object.keys(bundle.temari || {})) {
  if (!temaIds.has(String(id))) warnings.push(`temari.${id}: no hi ha cap bloc amb aquest id a \`temes\`.`);
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
for (const e of errors) console.error(`❌ ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s). No publiquis aquest fitxer.\n`);
  process.exit(1);
}

const psicoTotal = Object.values(bundle.psicoQuestions || {}).reduce((s, q) => s + q.length, 0);
console.log(`\n✅ Contingut vàlid — versió ${bundle.version} (binari: ${BUNDLED_VERSION})`);
console.log(`   ${(bundle.temes || []).length} blocs · ${(bundle.testQuestions || []).length} preguntes de test · ${psicoTotal} psicotècnics`);
if (warnings.length) console.log(`   ${warnings.length} avís(os), però es pot publicar.\n`);
else console.log('');
