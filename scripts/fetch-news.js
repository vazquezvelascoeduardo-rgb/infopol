#!/usr/bin/env node
// Fetches daily news via Claude API (web_search tool) and updates src/data/noticias.js
// Run manually: node scripts/fetch-news.js
// Automated: GitHub Action .github/workflows/daily-news.yml triggers at 22:00 CET

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/data/noticias.js');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('Error: cal definir la variable d\'entorn ANTHROPIC_API_KEY');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const [, month, day] = today.split('-');
const dateLabel = `${month}·${day}`;

const SYSTEM_PROMPT = `Ets el periodista diari d'InfoPol, una aplicació per a agents dels Mossos d'Esquadra de Catalunya. La teva missió és buscar i resumir les notícies més importants del dia per publicar-les a la secció "Notícies" de l'app.

CATEGORIES vàlides: politica, economia, cultura, descobriments, premis, esports, policial
ÀMBITS vàlids: catalunya, espanya, internacional

NORMES:
- Redacta tots els textos en CATALÀ (ortografia normativa)
- title: màxim 12 paraules, directe i informatiu
- desc: 2-3 frases que expliquin el QUÈ, el QUI i la IMPORTÀNCIA. Màxim 60 paraules.
- url: sempre la URL directa a la notícia font (no llistes, no homepages)
- Cobreix Catalunya, Espanya i Internacional equilibradament
- Inclou notícies de totes les categories si n'hi ha prou contingut
- Prioritza notícies d'avui; accepta les de les últimes 48h si no n'hi ha d'altres

RETORNA ÚNICAMENT un array JSON vàlid, sense cap altre text ni markdown.`;

const USER_PROMPT = `Data d'avui: ${today}

Busca les 10-12 notícies més importants d'avui cobrint:
1. Política (Catalunya, Espanya, Internacional)
2. Economia (Catalunya, Espanya, Internacional)
3. Esports (especialment futbol, Mundial si s'escau, i altres esports espanyols/catalans)
4. Successos policials i legals rellevants (Catalunya, Espanya, Internacional)
5. Cultura, premis, descobriments científics o tecnològics destacats

Per a cada notícia, retorna un objecte JSON amb exactament aquests camps:
{
  "category": "politica|economia|cultura|descobriments|premis|esports|policial",
  "scope": "catalunya|espanya|internacional",
  "tag": "[Categoria] · [Àmbit]",
  "title": "[Títol en català]",
  "desc": "[Resum en català, 2-3 frases]",
  "url": "[URL directa a la notícia]"
}

Retorna ÚNICAMENT l'array JSON, sense explicacions ni markdown.`;

async function callAnthropicWithSearch() {
  console.log(`[${today}] Buscant notícies via Claude API...`);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
      messages: [{ role: 'user', content: USER_PROMPT }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const textBlock = data.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text content in API response');

  return textBlock.text.trim();
}

function parseNewsItems(raw) {
  // Remove markdown code fences if present
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let items;
  try {
    items = JSON.parse(clean);
  } catch {
    // Try extracting JSON array from surrounding text
    const match = clean.match(/(\[[\s\S]*\])/);
    if (!match) throw new Error(`Cannot parse JSON from response:\n${raw.slice(0, 500)}`);
    items = JSON.parse(match[1]);
  }

  if (!Array.isArray(items)) throw new Error('Expected a JSON array');
  return items;
}

function buildNewsObjects(items) {
  return items.map((item, i) => ({
    id: `news-${today.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
    date: today,
    dateLabel,
    category: item.category || 'politica',
    scope: item.scope || 'internacional',
    tag: item.tag || `${item.category} · ${item.scope}`,
    title: item.title || '',
    desc: item.desc || '',
    url: item.url || null,
  }));
}

function readExistingItems() {
  try {
    const src = readFileSync(DATA_PATH, 'utf-8');
    const match = src.match(/export const NOTICIAS = (\[[\s\S]*?\]);\s*$/m);
    if (match) return JSON.parse(match[1]);
  } catch { /* first run or corrupt file */ }
  return [];
}

function writeDataFile(newItems, existingItems) {
  // Keep items from the last 30 days, excluding today (we replace them)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const kept = existingItems.filter(n => n.date !== today && n.date >= cutoffStr);
  const all = [...newItems, ...kept];

  const catColorsBlock = `export const CAT_COLORS = {
  politica:      { solid: '#3B6BF5', soft: '#D8E2FE', ink: '#0E2B7A', label: 'Política' },
  economia:      { solid: '#1FB286', soft: '#CDF0E1', ink: '#0B5A3D', label: 'Economia' },
  cultura:       { solid: '#FF7A1A', soft: '#FFE0CB', ink: '#7A2E04', label: 'Cultura' },
  descobriments: { solid: '#0BB4C2', soft: '#CCEEF1', ink: '#0A4F56', label: 'Descobriments' },
  premis:        { solid: '#F0B400', soft: '#FCEFB8', ink: '#5C4400', label: 'Premis' },
  esports:       { solid: '#9C4FE0', soft: '#EBDAFB', ink: '#4A1B7A', label: 'Esports' },
  policial:      { solid: '#E04F5F', soft: '#FBDADC', ink: '#7A1B22', label: 'Policial' },
};`;

  const scopeLabelsBlock = `export const SCOPE_LABELS = {
  catalunya:     'Catalunya',
  espanya:       'Espanya',
  internacional: 'Internacional',
};`;

  const content = `// Auto-generated daily news — last updated ${today}
// Do not edit manually; the GitHub Action daily-news.yml actualitza aquest fitxer cada dia a les 22h

${catColorsBlock}

${scopeLabelsBlock}

export const NOTICIAS = ${JSON.stringify(all, null, 2)};
`;

  writeFileSync(DATA_PATH, content, 'utf-8');
  console.log(`✓ ${DATA_PATH} actualitzat: ${newItems.length} notícies noves, ${all.length} en total`);
}

// ── Main ────────────────────────────────────────────────────────────
const raw = await callAnthropicWithSearch();
const parsed = parseNewsItems(raw);
const newItems = buildNewsObjects(parsed);
const existing = readExistingItems();
writeDataFile(newItems, existing);
