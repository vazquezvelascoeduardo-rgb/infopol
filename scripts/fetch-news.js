#!/usr/bin/env node
/**
 * Fetch daily news using Claude API with web_search tool.
 * Updates src/data/news.json with the latest articles.
 *
 * Run manually:   ANTHROPIC_API_KEY=sk-... node scripts/fetch-news.js
 * Run via CI:     triggered by .github/workflows/daily-news.yml at 22:00 (Spain)
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../src/data/news.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildDateInfo() {
  const now = new Date();
  const iso = now.toISOString().split('T')[0];
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return { iso, label: `${mm}·${dd}` };
}

function loadExisting() {
  if (!existsSync(NEWS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function extractJson(text) {
  // Try JSON code block first, then bare array
  const codeBlock = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
  if (codeBlock) return JSON.parse(codeBlock[1]);
  const bare = text.match(/\[[\s\S]*\]/);
  if (bare) return JSON.parse(bare[0]);
  throw new Error('No JSON array found in Claude response');
}

async function fetchNews() {
  const { iso, label } = buildDateInfo();
  console.log(`[infopol-news] Date: ${iso}`);

  const userPrompt = `Ets un periodista de l'agència InfoPol. Busca les notícies més importants d'avui (${iso}).

Cobreix TOTES aquestes categories sense excepció:
1. Política – Catalunya (Govern, Parlament), Espanya (Congrés, govern central), Internacional
2. Economia – mercats, empreses, macro
3. Cultura i Descobriments – art, ciència, nous descobriments, publicacions rellevants
4. Premis i Reconeixements – Oscars, Nobel, Goya, Pulitzer, esportius, etc.
5. Esports – futbol (LaLiga, Champions, seleccions), bàsquet, ciclisme, tenis i altres
6. Successos, Crims i Tribunals – detencions, judicis, incidents policials a Catalunya i Espanya

Per a cada notícia retorna un objecte amb exactament aquests camps:
{
  "category": "<Política | Economia | Cultura | Premis | Esports | Successos | Internacional | Descobriments>",
  "tag": "<etiqueta molt breu, ex: Catalunya, Champions, Judici, Premi Nobel>",
  "title": "<titular en català, màx 70 caràcters>",
  "desc": "<resum en català, màx 120 caràcters>",
  "url": "<URL directe a la notícia original>"
}

Retorna entre 8 i 12 notícies. La resposta ha de ser ÚNICAMENT un array JSON, sense markdown addicional, sense text introductori ni explicatiu.`;

  const messages = [{ role: 'user', content: userPrompt }];
  let response;
  const MAX_CONTINUATIONS = 4;

  for (let i = 0; i < MAX_CONTINUATIONS; i++) {
    response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20260209', name: 'web_search' }],
      messages,
    });

    if (response.stop_reason !== 'pause_turn') break;

    // Server-side search hit 10-iteration limit; append and continue
    console.log(`[infopol-news] pause_turn – continuing (attempt ${i + 1})`);
    messages.push({ role: 'assistant', content: response.content });
  }

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const items = extractJson(text);
  console.log(`[infopol-news] Claude returned ${items.length} articles`);

  // Build new entries
  const existing = loadExisting();
  const filtered = existing.filter(n => n.date !== iso); // remove today's existing to avoid duplicates on re-run
  const maxNum = existing.reduce((m, n) => Math.max(m, parseInt(n.id?.slice(1) || '0', 10)), 0);

  const newEntries = items.map((item, i) => ({
    id: `n${String(maxNum + i + 1).padStart(3, '0')}`,
    date: iso,
    dateLabel: label,
    category: item.category || 'General',
    tag: (item.tag || 'InfoPol').slice(0, 30),
    title: (item.title || '').slice(0, 80),
    desc: (item.desc || '').slice(0, 130),
    url: item.url || null,
  }));

  // Latest first, keep 30 max (≈ 3 days of news)
  const allNews = [...newEntries, ...filtered].slice(0, 30);

  writeFileSync(NEWS_FILE, JSON.stringify(allNews, null, 2) + '\n', 'utf-8');
  console.log(`[infopol-news] Saved ${newEntries.length} new articles to news.json`);
  newEntries.forEach(n => console.log(`  [${n.category}] ${n.tag} — ${n.title}`));
}

fetchNews().catch(err => {
  console.error('[infopol-news] ERROR:', err.message);
  process.exit(1);
});
