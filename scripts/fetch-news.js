#!/usr/bin/env node
/**
 * Daily news fetcher for InfoPol.
 * Uses Claude API with web search to gather news from Catalunya, Spain and internationally.
 * Run via GitHub Actions daily at 22:00 (Spain time).
 *
 * Required env var: ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_PATH = join(__dirname, '..', 'server', 'data', 'news.json');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function pad(n) { return String(n).padStart(2, '0'); }

function loadNews() {
  if (!existsSync(NEWS_PATH)) return [];
  try { return JSON.parse(readFileSync(NEWS_PATH, 'utf8')); }
  catch { return []; }
}

function nextId(existing) {
  const max = existing.reduce((m, n) => {
    const num = parseInt((n.id || '').replace('n', '')) || 0;
    return Math.max(m, num);
  }, 0);
  return (i) => `n${String(max + i + 1).padStart(3, '0')}`;
}

async function fetchNews(today, dateLabel) {
  const prompt = `Ets un periodista especialitzat en informació per a agents de policia de Catalunya. Avui és ${today}.

Cerca les notícies més importants d'avui en les categories i àmbits indicats a continuació.

ÀMBITS GEOGRÀFICS:
- Catalunya: política autonòmica, economia, successos policials, cultura, esports
- Espanya: política nacional, economia, esports, successos rellevants
- Internacional: les 3-4 notícies globals més impactants del dia

CATEGORIES:
- Política: decisions governamentals, eleccions, legislació, acords
- Economia: mercats, empreses, laboral, IPC, criptos, habitatge
- Esports: resultats, fitxatges, competicions (futbol, bàsquet, tennis, MotoGP, etc.)
- Cultura: arts, cinema, música, literatura, premis culturals, exposicions
- Policial: operacions policials, detencions, seguretat pública, successos greus
- Legal: sentències, canvis legislatius, processos judicials rellevants
- Descobriment: ciència, tecnologia, recerca, innovació, salut
- Premi: premis i reconeixements notables (Nobel, Planeta, Oscar, etc.)

Cerca entre 10 i 14 notícies d'avui (${today}). Usa fonts fiables i verificables: ACN, La Vanguardia, El País, ARA, TV3/324, El Periódico, El Mundo, ABC, La Razón, Reuters, AP, AFP, BBC, The Guardian, Le Monde.

Prioritza notícies de Catalunya, però assegura cobertura equilibrada dels tres àmbits.

Per a cada notícia, retorna EXACTAMENT aquest objecte JSON (sense cap altre text):
{
  "tag": "Política|Economia|Esports|Cultura|Policial|Legal|Descobriment|Premi",
  "scope": "Catalunya|Espanya|Internacional",
  "title": "Titular directe i informatiu (màx 90 caràcters)",
  "desc": "Resum en 2-3 frases amb els fets principals. Inclou xifres, llocs o noms concrets quan sigui rellevant.",
  "url": "URL directe i complet a la notícia original"
}

Retorna ÚNICAMENT un array JSON vàlid, sense cap text addicional ni explicacions.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock?.text) throw new Error('No text block in Claude response');

  const text = textBlock.text;
  const match = text.match(/\[[\s\S]*?\]/s);
  if (!match) {
    console.error('Raw response:', text.slice(0, 500));
    throw new Error('No valid JSON array found in Claude response');
  }

  return JSON.parse(match[0]);
}

async function main() {
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const dateLabel = `${pad(now.getMonth() + 1)}·${pad(now.getDate())}`;

  const existing = loadNews();

  if (existing.some(n => n.date === today)) {
    console.log(`News already exists for ${today}. Skipping fetch.`);
    return;
  }

  console.log(`Fetching news for ${today} using Claude + web search...`);

  const fetched = await fetchNews(today, dateLabel);
  console.log(`Claude returned ${fetched.length} news items.`);

  const makeId = nextId(existing);
  const newItems = fetched.map((item, i) => ({
    id: makeId(i),
    date: today,
    dateLabel,
    tag: item.tag || 'General',
    scope: item.scope || 'Internacional',
    title: String(item.title || '').slice(0, 120),
    desc: String(item.desc || ''),
    url: item.url || null,
  }));

  const updated = [...newItems, ...existing].slice(0, 300);

  mkdirSync(dirname(NEWS_PATH), { recursive: true });
  writeFileSync(NEWS_PATH, JSON.stringify(updated, null, 2));

  console.log(`\n✓ Saved ${newItems.length} news items for ${today}:`);
  newItems.forEach(n => console.log(`  [${n.scope}] [${n.tag}] ${n.title}`));
}

main().catch(err => {
  console.error('Fatal error:', err.message || err);
  process.exit(1);
});
