#!/usr/bin/env node
// Genera content/content.json a partir del contingut de src/data/*.
//
//   npm run content:build          → puja la versió +1 respecte al JSON actual
//   npm run content:build -- 12    → fixa la versió 12
//
// Publicar el JSON resultant actualitza totes les apps instal·lades.
// No cal build de l'app ni revisió a les botigues.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'content');
const outFile = join(outDir, 'content.json');

const { BUNDLED_CONTENT } = await import(join(root, 'src/content/bundled.js'));

let nextVersion;
const arg = process.argv[2];
if (arg && Number.isFinite(Number(arg))) {
  nextVersion = Number(arg);
} else if (existsSync(outFile)) {
  const current = JSON.parse(readFileSync(outFile, 'utf8'));
  nextVersion = (Number(current.version) || 0) + 1;
} else {
  nextVersion = BUNDLED_CONTENT.version + 1;
}

if (nextVersion <= BUNDLED_CONTENT.version) {
  console.error(
    `\n⚠️  La versió ${nextVersion} no és superior a la del binari (${BUNDLED_CONTENT.version}).\n` +
    '   Les apps instal·lades ignorarien aquest contingut. Fes servir una versió més alta.\n',
  );
  process.exit(1);
}

const bundle = {
  ...BUNDLED_CONTENT,
  version: nextVersion,
  updatedAt: new Date().toISOString().slice(0, 10),
  label: `Contingut v${nextVersion}`,
};

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${JSON.stringify(bundle, null, 2)}\n`);

const kb = (Buffer.byteLength(JSON.stringify(bundle)) / 1024).toFixed(1);
console.log(`\n✅ content/content.json — versió ${nextVersion} · ${kb} KB`);
console.log(`   ${bundle.temes.length} blocs de temari · ${Object.keys(bundle.temari).length} amb lliçons`);
console.log(`   ${bundle.testQuestions.length} preguntes de test · ${bundle.flashcards.length} flashcards`);
console.log(`   ${bundle.psicoCategories.length} categories de psicotècnics · ${Object.values(bundle.psicoQuestions).reduce((s, q) => s + q.length, 0)} preguntes`);
console.log(`   ${bundle.infractions.length} infraccions · ${bundle.protocols.length} protocols`);
console.log('\n   Puja el fitxer a la branca main i les apps l\'agafaran soles.\n');
