#!/usr/bin/env node
// scripts/fetch-news.js — fetches daily news and updates server/data/news.json

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news.json');

const { ANTHROPIC_API_KEY, TAVILY_API_KEY } = process.env;

if (!ANTHROPIC_API_KEY || !TAVILY_API_KEY) {
  console.error('Required env vars missing: ANTHROPIC_API_KEY, TAVILY_API_KEY');
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Categories and their search queries (in order of priority)
const SEARCHES = [
  { tag: 'Política CAT', query: 'política Cataluña noticias hoy' },
  { tag: 'Política ESP', query: 'política España gobierno congreso noticias hoy' },
  { tag: 'Internacional', query: 'noticias internacionales mundo hoy importantes' },
  { tag: 'Economia', query: 'economía España mercados finanzas noticias hoy' },
  { tag: 'Esports', query: 'fútbol deportes España noticias hoy resultados' },
  { tag: 'Policial', query: 'sucesos crimen policiales España noticias hoy' },
  { tag: 'Cultura', query: 'cultura arte música cine premios España noticias hoy' },
  { tag: 'Descobriments', query: 'descubrimiento científico tecnología premio Nobel noticias hoy' },
];

async function searchTavily(query) {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 3,
      include_raw_content: false,
      include_answer: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.results || []).slice(0, 2);
}

async function formatWithClaude(articles) {
  const articlesList = articles
    .map((a, i) => [
      `--- Notícia ${i + 1} [${a.tag}] ---`,
      `Títol: ${a.title}`,
      `URL: ${a.url}`,
      `Contingut: ${(a.content || '').slice(0, 350)}`,
    ].join('\n'))
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Ets l'editor de notícies de l'app InfoPol per a agents de policia a Catalunya. Formateja les notícies en català seguint el patró de l'app.

Per a cada notícia, retorna un objecte JSON amb:
- "tag": la categoria entre claudàtors (no la canviïs)
- "title": títol breu i directe en català, sense punt final (màx 65 caràcters)
- "desc": resum de 1-2 frases en català, clar i precís (màx 130 caràcters)
- "url": l'URL original sense modificar

Retorna ÚNICAMENT un array JSON vàlid sense cap text addicional ni markdown ni \`\`\`.

NOTÍCIES:
${articlesList}`,
    }],
  });

  const text = response.content[0].text.trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Unexpected Claude response: ${text.slice(0, 300)}`);
  return JSON.parse(match[0]);
}

function todayStrings() {
  const d = new Date();
  const iso = d.toISOString().split('T')[0];
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { iso, label: `${mm}·${dd}` };
}

async function main() {
  const { iso: today, label: dateLabel } = todayStrings();
  console.log(`InfoPol news fetch — ${today}`);

  const dataDir = join(__dirname, '../server/data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  const existing = existsSync(NEWS_FILE)
    ? JSON.parse(readFileSync(NEWS_FILE, 'utf8'))
    : [];

  // Skip if we already have items for today
  const alreadyToday = existing.filter(n => n.date === today).length;
  if (alreadyToday >= 8) {
    console.log(`Already have ${alreadyToday} items for today, skipping.`);
    return;
  }

  // Compute next ID base
  let nextId = existing.reduce((max, item) => {
    const n = parseInt((item.id || '').replace('n', ''), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0) + 1;

  // Search each category
  const rawArticles = [];
  for (const s of SEARCHES) {
    try {
      process.stdout.write(`  [${s.tag}] searching...`);
      const results = await searchTavily(s.query);
      results.forEach(r => rawArticles.push({ ...r, tag: s.tag }));
      console.log(` ${results.length} results`);
    } catch (err) {
      console.log(` WARN: ${err.message}`);
    }
  }

  if (rawArticles.length === 0) {
    console.log('No results from search APIs, aborting.');
    process.exit(1);
  }

  // Format with Claude
  console.log(`\nFormatting ${rawArticles.length} articles with Claude…`);
  let formatted;
  try {
    formatted = await formatWithClaude(rawArticles);
  } catch (err) {
    console.error('Claude formatting error:', err.message);
    process.exit(1);
  }

  // Build final items
  const newItems = formatted
    .filter(item => item.title && item.desc)
    .map(item => ({
      id: `n${String(nextId++).padStart(3, '0')}`,
      date: today,
      dateLabel,
      tag: item.tag,
      title: item.title,
      desc: item.desc,
      url: item.url || null,
    }));

  // Prepend new items; keep max 60 total
  const merged = [...newItems, ...existing].slice(0, 60);

  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`\nDone. Added ${newItems.length} items. Total: ${merged.length}`);
  newItems.forEach(n => console.log(`  [${n.tag}] ${n.title}`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
