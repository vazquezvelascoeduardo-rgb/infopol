#!/usr/bin/env node
/**
 * Generador automàtic de notícies per a InfoPol
 * S'executa diàriament a les 22:00 via GitHub Actions.
 *
 * Requereix: ANTHROPIC_API_KEY (variable d'entorn)
 * Actualitza: server/data/news.json
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '..', 'server', 'data', 'news.json');
const MAX_AGE_DAYS = 30;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, dateLabel: `${mm}·${dd}` };
}

function cutoffDate() {
  const d = new Date();
  d.setDate(d.getDate() - MAX_AGE_DAYS);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${day}`;
}

async function fetchNewsFromClaude(date) {
  const prompt = `Ets el redactor de notícies de InfoPol, una app per a agents dels Mossos d'Esquadra i forces de seguretat catalanes.

La data d'avui és ${date}. Fes una cerca exhaustiva a Internet de les notícies MÉS IMPORTANTS del dia en totes aquestes categories:

1. Política de Catalunya (Parlament, Generalitat, partits)
2. Política espanyola (Congrés, Govern central)
3. Economia d'Espanya (PIB, empreses, mercats, laboral)
4. Successos policials i criminals a Catalunya
5. Successos policials i criminals a Espanya
6. Esports (LaLiga, Champions, seleccions, tenis, MotoGP…)
7. Cultura, cinema i art a Catalunya i Espanya
8. Descobriments científics o tecnològics internacionals
9. Premis i reconeixements (nacionals o internacionals)
10. Notícies internacionals destacades (política, conflictes, clima)

Per a CADA notícia important que trobis, crea una entrada amb aquest format exacte.
Inclou mínim 10 notícies (màxim 15), ben variades entre categories i zones geogràfiques.

RETORNA ÚNICAMENT un array JSON vàlid, sense cap text addicional ni markdown:

[
  {
    "tag": "Política · Cat",
    "geo": "Catalunya",
    "title": "Titular concís en català (màx 90 caràcters)",
    "desc": "Resum breu en català (màx 140 caràcters). Directe i precís, com un subtítol de diari.",
    "url": "https://url-real-de-la-noticia.cat/article"
  }
]

Tags vàlids (usa exactament aquests):
"Política · Cat" | "Política · ESP" | "Economia · ESP" | "Economia · Intl" |
"Esports · ESP" | "Esports · Intl" | "Cultura · Cat" | "Cultura · ESP" |
"Policial · Cat" | "Policial · ESP" | "Premis · ESP" | "Premis · Intl" |
"Ciència · Intl" | "Internacional"

Geo vàlids: "Catalunya" | "Espanya" | "Internacional"

IMPORTANT: Retorna ÚNICAMENT el JSON pur, sense explicacions ni blocs de codi.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.filter(b => b.type === 'text').pop();
  if (!textBlock?.text) throw new Error('No s\'ha rebut resposta de text del model');

  const raw = textBlock.text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(raw);
}

async function main() {
  const { date, dateLabel } = getToday();
  console.log(`\n🗞️  InfoPol · Generant notícies per a ${date}…\n`);

  const rawItems = await fetchNewsFromClaude(date);

  const newItems = rawItems.map((item, i) => ({
    id: `n${Date.now()}${String(i).padStart(2, '0')}`,
    date,
    dateLabel,
    tag: item.tag || 'Notícia',
    geo: item.geo || 'Espanya',
    title: String(item.title || '').slice(0, 120),
    desc: String(item.desc || '').slice(0, 160),
    url: item.url || null,
  }));

  if (!existsSync(dirname(NEWS_FILE))) {
    mkdirSync(dirname(NEWS_FILE), { recursive: true });
  }

  let existing = [];
  if (existsSync(NEWS_FILE)) {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf8'));
  }

  const cutoff = cutoffDate();
  const filtered = existing.filter(n => n.date >= cutoff);
  const combined = [...newItems, ...filtered];

  writeFileSync(NEWS_FILE, JSON.stringify(combined, null, 2));
  console.log(`✅ ${newItems.length} notícies noves afegides. Total: ${combined.length} (últims ${MAX_AGE_DAYS} dies).`);
  newItems.forEach(n => console.log(`   · [${n.tag}] ${n.title}`));
}

main().catch(err => {
  console.error('❌ Error generant notícies:', err.message);
  process.exit(1);
});
