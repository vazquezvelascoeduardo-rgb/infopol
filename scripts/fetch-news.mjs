/**
 * Script de cerca diària de notícies per a InfoPol.
 * S'executa via GitHub Actions cada dia a les 22h.
 * Requereix: ANTHROPIC_API_KEY com a variable d'entorn.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news.json');
const MAX_ITEMS = 60;

const VALID_CATEGORIES = new Set([
  'politica', 'economia', 'esports', 'cultura',
  'policial', 'internacional', 'descobriments', 'premis',
]);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function toDateLabel(iso) {
  const [, m, d] = iso.split('-');
  return `${m}·${d}`;
}

function extractJSON(text) {
  if (!text) return null;
  // Direct parse
  try {
    const p = JSON.parse(text.trim());
    if (Array.isArray(p)) return p;
  } catch {}
  // Find JSON array in text
  const m = text.match(/\[[\s\S]*\]/);
  if (m) {
    try {
      const p = JSON.parse(m[0]);
      if (Array.isArray(p)) return p;
    } catch {}
  }
  return null;
}

function buildPrompt(date) {
  return `Avui és ${date}. Ets un periodista de InfoPol, una app per a agents de policia de Catalunya.

Fes cerques web i troba les notícies més importants del dia. Cobreix totes aquestes categories:

• POLÍTICA: Parlament Catalunya, Generalitat, Govern central, eleccions, partits
• ECONOMIA: mercats, empreses, habitatge, treball, consum, PIB
• ESPORTS: FC Barcelona, Liga, Champions, selecció espanyola, bàsquet, tennis, MotoGP
• CULTURA: cinema, música, art, televisió, festivals, premis literaris
• POLICIAL/LEGAL: operacions policials, detencions, judicis, sentències, legislació nova
• INTERNACIONAL: conflictes, diplomàcia, eleccions, catàstrofes, geopolítica
• DESCOBRIMENTS: ciència, tecnologia, IA, salut, medi ambient, espai
• PREMIS: reconeixements nacionals i internacionals (si n'hi ha avui)

IMPORTANT: Retorna ÚNICAMENT un JSON array vàlid (sense markdown, sense text addicional) amb 10 a 14 notícies:

[
  {
    "tag": "Política",
    "category": "politica",
    "title": "Titular en català, màx 70 caràcters",
    "desc": "Resum informatiu en català, màx 130 caràcters",
    "source": "Nom del mitjà (ex: ARA, TV3, El País, BBC)",
    "url": "https://url-directa-a-la-noticia.com/article"
  }
]

Valors vàlids per "category": politica | economia | esports | cultura | policial | internacional | descobriments | premis
Assegura't que les URLs siguin reals i directes a l'article, no a la portada del diari.`;
}

async function searchNews(date) {
  const messages = [{ role: 'user', content: buildPrompt(date) }];

  for (let iter = 0; iter < 25; iter++) {
    const response = await client.messages.create(
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages,
      },
      { headers: { 'anthropic-beta': 'web-search-2025-03-05' } },
    );

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find(b => b.type === 'text')?.text ?? '';
      return extractJSON(text);
    }

    // Tool use: pass results back to continue the loop
    if (response.stop_reason === 'tool_use') {
      const toolUses = response.content.filter(b => b.type === 'tool_use');
      if (toolUses.length === 0) break;
      messages.push({
        role: 'user',
        content: toolUses.map(b => ({
          type: 'tool_result',
          tool_use_id: b.id,
          content: b.output ?? '',
        })),
      });
    }
  }

  return null;
}

async function main() {
  const date = todayISO();
  console.log(`[InfoPol News] ${date} — iniciant cerca de notícies...`);

  let rawItems = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      rawItems = await searchNews(date);
      if (rawItems && rawItems.length >= 5) break;
      console.warn(`[InfoPol News] Intent ${attempt}: ${rawItems?.length ?? 0} ítems. Reintentant...`);
    } catch (err) {
      console.error(`[InfoPol News] Intent ${attempt} fallit:`, err.message);
      if (attempt === 3) throw err;
    }
  }

  if (!rawItems || rawItems.length === 0) {
    console.error('[InfoPol News] No s\'han pogut obtenir notícies. Sortint.');
    process.exit(1);
  }

  console.log(`[InfoPol News] ${rawItems.length} notícies obtingudes.`);

  const newItems = rawItems.map((item, i) => ({
    id: `n${date.replace(/-/g, '')}${String(i + 1).padStart(2, '0')}`,
    date,
    dateLabel: toDateLabel(date),
    tag: String(item.tag ?? 'Notícia').slice(0, 20),
    category: VALID_CATEGORIES.has(item.category) ? item.category : 'internacional',
    title: String(item.title ?? '').slice(0, 80),
    desc: String(item.desc ?? '').slice(0, 150),
    source: String(item.source ?? '').slice(0, 60),
    url: item.url ?? null,
  }));

  let existing = [];
  if (existsSync(NEWS_FILE)) {
    try {
      existing = JSON.parse(readFileSync(NEWS_FILE, 'utf8'));
    } catch {
      console.warn('[InfoPol News] No s\'ha pogut llegir news.json existent.');
    }
  }

  // Elimina les notícies d'avui per fer el re-run idempotent
  existing = existing.filter(n => n.date !== date);

  const all = [...newItems, ...existing].slice(0, MAX_ITEMS);

  const dir = dirname(NEWS_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(NEWS_FILE, JSON.stringify(all, null, 2), 'utf8');

  console.log(`[InfoPol News] ${newItems.length} notícies noves. Total: ${all.length}. Desat a ${NEWS_FILE}`);
}

main().catch(err => {
  console.error('[InfoPol News] Error fatal:', err);
  process.exit(1);
});
