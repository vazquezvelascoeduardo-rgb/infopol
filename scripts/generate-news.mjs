#!/usr/bin/env node
/**
 * Genera les notícies diàries per a InfoPol usant Claude API amb cerca web.
 * S'executa cada dia a les 22:00 via GitHub Actions.
 * Actualitza: src/data/noticias.js
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().slice(0, 10);
const dateLabel = today.slice(5).replace('-', '·');

const PROMPT = `Ets el redactor de notícies per a InfoPol, portal d'informació per a agents de les forces de seguretat de Catalunya.

Avui és ${today}. Busca les notícies més rellevants del dia de Catalunya, Espanya i l'àmbit internacional.

Has de cobrir OBLIGATÒRIAMENT les categories següents (almenys 1-2 notícies per categoria):
- política: Catalunya (Generalitat, Parlament), Espanya (Govern central, Congrés), Internacional
- economia: mercat laboral, empreses, mercats, habitatge, inflació
- cultura: arts, literatura, música, cinema, patrimoni, societat
- esports: futbol, bàsquet, atletisme, tennis, esports catalans
- policial: detencions, operacions policials, judicis, sentències, successos greus
- descobriments: ciència, tecnologia, medicina, medi ambient
- premis: reconeixements, guardons, distincions, certàmens

Per a cada notícia genera un objecte JSON amb EXACTAMENT aquest format (sense afegir ni treure camps):
{
  "id": "n-YYYYMMDD-NNN",
  "date": "${today}",
  "dateLabel": "${dateLabel}",
  "categoria": "política|economia|cultura|esports|policial|descobriments|premis",
  "title": "Títol breu i directe (màx 80 caràcters)",
  "desc": "Resum objectiu en 2-3 frases. Explica el fet clau, el context i l'impacte. Màx 250 caràcters.",
  "url": "URL directa a la notícia original (font fiable: elpais.com, lavanguardia.com, ccma.cat, elconfidencial.com, etc.)"
}

On NNN és el número correlatiu de 3 dígits (001, 002, 003...).

Genera entre 12 i 16 notícies. Prioritza notícies d'avui ${today}. Usa fonts fiables.
Retorna ÚNICAMENT l'array JSON vàlid, sense cap text addicional, sense markdown, sense blocs de codi.`;

async function loadExisting() {
  const dataPath = join(ROOT, 'src/data/noticias.js');
  if (!existsSync(dataPath)) return [];
  const content = readFileSync(dataPath, 'utf-8');
  const match = content.match(/export const NOTICIAS = (\[[\s\S]*?\]);/);
  if (!match) return [];
  try {
    return JSON.parse(match[1]).filter(n => n.date !== today);
  } catch {
    return [];
  }
}

async function runWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      const wait = Math.pow(2, i + 1) * 1000;
      console.warn(`Intent ${i + 1} fallat: ${err.message}. Reintentant en ${wait / 1000}s...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

async function generateNews() {
  console.log(`\n📰 Generant notícies per al ${today}...\n`);

  const response = await runWithRetry(() =>
    client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 8192,
      tools: [{ type: 'web_search', name: 'web_search' }],
      messages: [{ role: 'user', content: PROMPT }],
    })
  );

  // Extract final text (after tool use turns)
  let finalText = '';
  for (const block of response.content) {
    if (block.type === 'text') finalText = block.text.trim();
  }

  if (!finalText) throw new Error('Resposta buida de la API');

  // Strip markdown code fences if present
  finalText = finalText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let newsItems;
  try {
    newsItems = JSON.parse(finalText);
  } catch {
    // Try to extract JSON array from text
    const match = finalText.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No s\'ha pogut extreure JSON de la resposta');
    newsItems = JSON.parse(match[0]);
  }

  if (!Array.isArray(newsItems) || newsItems.length === 0) {
    throw new Error('La resposta no conté cap notícia vàlida');
  }

  // Merge with existing (keep last 30 days of previous news)
  const existing = await loadExisting();
  const merged = [...newsItems, ...existing].slice(0, 60);

  const dataPath = join(ROOT, 'src/data/noticias.js');
  const fileContent = `// Actualitzat automàticament el ${today} a les 22:00\nexport const NOTICIAS = ${JSON.stringify(merged, null, 2)};\n`;
  writeFileSync(dataPath, fileContent, 'utf-8');

  console.log(`✅ ${newsItems.length} notícies noves generades per al ${today}`);
  console.log(`📦 Total en arxiu: ${merged.length} notícies\n`);
  newsItems.forEach((n, i) => console.log(`  ${i + 1}. [${n.categoria}] ${n.title}`));
}

generateNews().catch(err => {
  console.error('\n❌ Error generant notícies:', err.message);
  process.exit(1);
});
