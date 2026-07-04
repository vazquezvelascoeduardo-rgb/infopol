#!/usr/bin/env node
// scripts/fetch-news.mjs
// Fetches daily news from RSS feeds, summarizes with Claude API, updates src/data/newsGeneral.js

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('Cal definir la variable ANTHROPIC_API_KEY');
  process.exit(1);
}

// ── RSS sources ────────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  // Catalunya
  { url: 'https://www.ccma.cat/rss/324.xml',                                              scope: 'Catalunya' },
  { url: 'https://www.vilaweb.cat/rss2.php',                                              scope: 'Catalunya' },
  { url: 'https://www.naciodigital.cat/rss.xml',                                          scope: 'Catalunya' },
  // Espanya
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',              scope: 'Espanya' },
  { url: 'https://e00-elmundo.uecdn.es/rss/spain.xml',                                    scope: 'Espanya' },
  { url: 'https://www.lavanguardia.com/rss/home.xml',                                     scope: 'Espanya' },
  { url: 'https://www.rtve.es/api/articles/ultimas-noticias.rss',                         scope: 'Espanya' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                                       scope: 'Internacional' },
  { url: 'https://rss.dw.com/rdf/rss-es-all',                                            scope: 'Internacional' },
  // Esports
  { url: 'https://e00-marca.uecdn.es/rss/portada.xml',                                   scope: 'Esports' },
  { url: 'https://feeds.as.com/mrss-s/pages/as/site/as.com/portada',                     scope: 'Esports' },
];

// ── RSS fetch + parse ─────────────────────────────────────────────────────────

async function fetchRSS(source) {
  try {
    const resp = await fetch(source.url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'InfoPol-NewsBot/1.0 (+https://infopol.cat)' },
    });
    if (!resp.ok) { console.warn(`[SKIP] ${source.url} → HTTP ${resp.status}`); return []; }
    const xml = await resp.text();
    return parseRSSItems(xml, source.scope);
  } catch (err) {
    console.warn(`[SKIP] ${source.url} → ${err.message}`);
    return [];
  }
}

function parseRSSItems(xml, scope) {
  const items = [];
  for (const raw of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = raw[1];
    const title = extractField(block, 'title');
    const link  = extractField(block, 'link') || extractAttr(block, 'href');
    const desc  = stripHTML(extractField(block, 'description')).slice(0, 400);
    if (title && link) items.push({ title, link, desc, scope });
  }
  return items.slice(0, 8);
}

function extractField(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
  return (block.match(re)?.[1] ?? '').trim();
}

function extractAttr(block, attr) {
  return (block.match(new RegExp(`${attr}="([^"]+)"`, 'i'))?.[1] ?? '').trim();
}

function stripHTML(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Claude API summarization ──────────────────────────────────────────────────

async function summarizeWithClaude(articles) {
  const prompt = `Ets el redactor de notícies de la web InfoPol (Catalunya). Analitza la llista d'articles d'avui i selecciona els 10-14 més rellevants que cobreixin les categories: política, economia, cultura, descobriments científics, premis, esports, successos/policial, legal/judicial.

Per a cada notícia seleccionada:
- title: Títol clar en català (tradueix si cal, màx 90 caràcters)
- desc: Resum de 2-3 frases en català, precís i informatiu
- tag: Etiqueta curta de categoria (màx 12 car.): 'Catalunya', 'Espanya', 'Internacional', 'Política', 'Economia', 'Esports', 'Successos', 'Cultura', 'Ciència', 'Premis', 'Legal', 'Societat'
- url: URL original (no modifiquis)

Retorna ÚNICAMENT un JSON array, sense cap text addicional:
[{"tag":"...","title":"...","desc":"...","url":"..."}]

Articles d'avui:
${JSON.stringify(articles, null, 0)}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Claude API ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const text = data.content[0].text;
  const start = text.indexOf('[');
  const end   = text.lastIndexOf(']') + 1;
  if (start === -1 || end === 0) throw new Error('No JSON array in Claude response');
  return JSON.parse(text.slice(start, end));
}

// ── Data file update ──────────────────────────────────────────────────────────

function getDateInfo() {
  const d  = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return {
    date:      `${yyyy}-${mm}-${dd}`,
    dateLabel: `${mm}·${dd}`,
    idPrefix:  `ng${yyyy}${mm}${dd}`,
  };
}

function updateDataFile(items, dateInfo) {
  const filePath = join(__dirname, '../src/data/newsGeneral.js');

  let existing = [];
  try {
    const content = readFileSync(filePath, 'utf8');
    const m = content.match(/export const NEWS_GENERAL = (\[[\s\S]*?\]);/);
    if (m) existing = JSON.parse(m[1]);
  } catch (_) {
    console.log('Fitxer nou, creant des de zero...');
  }

  const newItems = items.map((item, i) => ({
    id:        `${dateInfo.idPrefix}-${String(i + 1).padStart(3, '0')}`,
    date:      dateInfo.date,
    dateLabel: dateInfo.dateLabel,
    tag:       item.tag,
    title:     item.title,
    desc:      item.desc,
    url:       item.url,
  }));

  // Replace today's items, keep up to 60 historical
  const historical = existing.filter(n => n.date !== dateInfo.date);
  const combined   = [...newItems, ...historical].slice(0, 60);

  const output =
    `// Actualitat general InfoPol — actualitzat automàticament cada dia a les 22h\n` +
    `export const NEWS_GENERAL = ${JSON.stringify(combined, null, 2)};\n`;

  writeFileSync(filePath, output, 'utf8');
  console.log(`✓ ${newItems.length} notícies escrites per a ${dateInfo.date}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('InfoPol News Bot — iniciant recerca...');
  const dateInfo = getDateInfo();

  const settled = await Promise.allSettled(RSS_SOURCES.map(fetchRSS));
  const allArticles = settled
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  console.log(`Articles bruts obtinguts: ${allArticles.length}`);

  if (allArticles.length < 5) {
    console.error('Massa pocs articles obtinguts. Abortant.');
    process.exit(1);
  }

  console.log('Resumint amb Claude...');
  const summarized = await summarizeWithClaude(allArticles);

  updateDataFile(summarized, dateInfo);
  console.log('Done ✓');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
