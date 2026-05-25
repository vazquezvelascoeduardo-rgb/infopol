#!/usr/bin/env node
/**
 * Cerca diària de notícies via Claude API + web search.
 * Actualitza server/data/news.json amb les notícies del dia.
 * Executat per GitHub Actions cada dia a les 22h (hora espanyola).
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().split('T')[0];
const [, month, day] = today.split('-');
const dateLabel = `${month}·${day}`;

const SYSTEM_PROMPT = `Ets un periodista expert en actualitat catalana, espanyola i internacional. La teva tasca és buscar i seleccionar les notícies més rellevants del dia d'avui (${today}).

Cerca notícies variades en les àrees:
- CATALUNYA: política, economia, cultura, esports, successos policials i legals
- ESPANYA: política, economia, cultura, esports, notícies nacionals rellevants
- INTERNACIONAL: política, economia, cultura, descobriments científics, premis i reconeixements, esports, successos

Per a cada notícia proporciona:
- tag: àmbit i categoria en format "Àmbit · Categoria" (exemples: "Catalunya · Política", "Espanya · Economia", "Internacional · Esports", "Internacional · Descobriments", "Catalunya · Successos")
- title: titular clar i breu en català, màxim 85 caràcters
- desc: resum informatiu en català, màxim 145 caràcters
- url: URL directe i verificat a la notícia original

Fonts preferides: La Vanguardia, El País, ACN, El Periódico, RTVE, El Mundo, BBC Mundo, Reuters, AP.
Selecciona entre 8 i 10 notícies variades, evitant repetir àmbit i categoria.

IMPORTANT: Retorna ÚNICAMENT el JSON array, sense cap text addicional ni explicació.
Format exacte:
[
  {
    "tag": "Catalunya · Política",
    "title": "...",
    "desc": "...",
    "url": "https://..."
  }
]`;

async function fetchNewsWithSearch() {
  const messages = [
    {
      role: 'user',
      content: `Busca i selecciona les 8-10 notícies més importants d'avui ${today}. Cobreix Catalunya, Espanya i Internacional. Inclou política, economia, cultura, esports, successos policials i legals, descobriments i premis. Retorna ÚNICAMENT el JSON array.`,
    },
  ];

  let finalText = '';
  let iterations = 0;

  while (iterations < 15) {
    iterations++;

    const response = await client.beta.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
      betas: ['web-search-2025-03-05'],
    });

    const textBlocks = response.content.filter(b => b.type === 'text');
    if (textBlocks.length > 0) {
      finalText = textBlocks.map(b => b.text).join('');
    }

    if (response.stop_reason === 'end_turn') {
      break;
    }

    messages.push({ role: 'assistant', content: response.content });

    const toolUses = response.content.filter(
      b => b.type === 'tool_use' || b.type === 'server_tool_use'
    );
    if (toolUses.length > 0) {
      messages.push({
        role: 'user',
        content: toolUses.map(tu => ({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: 'Search completed.',
        })),
      });
    }
  }

  const match = finalText.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('No JSON array found in response');
    console.error('Response text:', finalText.slice(0, 500));
    return [];
  }

  return JSON.parse(match[0]);
}

async function main() {
  console.log(`\nBuscant notícies per al ${today}...`);

  const rawItems = await fetchNewsWithSearch();
  console.log(`${rawItems.length} notícies trobades`);

  const newItems = rawItems.map((item, idx) => ({
    id: `news-${today}-${String(idx + 1).padStart(3, '0')}`,
    date: today,
    dateLabel,
    tag: item.tag || 'Actualitat',
    title: item.title || '',
    desc: item.desc || '',
    url: item.url || null,
  }));

  let existingNews = [];
  try {
    existingNews = JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  } catch {
    console.log('Fitxer de notícies no trobat, creant-ne un de nou');
  }

  // Remove any existing entries for today to avoid duplicates on re-run
  const filtered = existingNews.filter(n => n.date !== today);

  // Prepend today's news and keep max 150 entries
  const combined = [...newItems, ...filtered].slice(0, 150);

  mkdirSync(dirname(NEWS_FILE), { recursive: true });
  writeFileSync(NEWS_FILE, JSON.stringify(combined, null, 2), 'utf-8');
  console.log(`Desat: ${combined.length} notícies totals a server/data/news.json`);

  // Print summary
  newItems.forEach(n => console.log(`  [${n.tag}] ${n.title}`));
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
