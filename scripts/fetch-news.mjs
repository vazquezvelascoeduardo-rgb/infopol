#!/usr/bin/env node
/**
 * InfoPol Nightly News Fetcher
 * Fetches headlines from RSS feeds and uses Claude to select, categorize
 * and summarize them in Catalan. Saves to server/data/general-news.json.
 *
 * Usage: ANTHROPIC_API_KEY=... node scripts/fetch-news.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dirname, '../server/data');
const NEWS_FILE = join(DATA_DIR, 'general-news.json');

// ── RSS sources ─────────────────────────────────────────────────
const SOURCES = [
  // Catalunya
  { url: 'https://www.ccma.cat/rss/rss.xml',                                                      name: '3Cat',               region: 'Catalunya' },
  { url: 'https://www.ara.cat/rss.xml',                                                           name: 'Ara',                region: 'Catalunya' },
  { url: 'https://www.naciodigital.cat/rss',                                                      name: 'NacióDigital',       region: 'Catalunya' },
  // Espanya
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',                     name: 'El País',            region: 'Espanya' },
  { url: 'https://www.elconfidencial.com/rss/',                                                   name: 'El Confidencial',    region: 'Espanya' },
  { url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml',                                  name: 'El Mundo',           region: 'Espanya' },
  // Internacional
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada', name: 'El País Intl',     region: 'Internacional' },
  { url: 'https://www.bbc.com/mundo/index.xml',                                                   name: 'BBC Mundo',          region: 'Internacional' },
  // Esports
  { url: 'https://e00-marca.uecdn.es/rss/portada.xml',                                           name: 'Marca',              region: 'Esports' },
  { url: 'https://www.sport.es/es/rss/sport.xml',                                                name: 'Sport',              region: 'Esports' },
];

// ── XML helpers ─────────────────────────────────────────────────
const cleanText = (s) =>
  s.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '')
   .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
   .replace(/&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();

function parseRSS(xml) {
  const items = [];
  const itemRx = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRx.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag) => {
      const rx = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const r = block.match(rx);
      return r ? cleanText(r[1]) : '';
    };
    const title = get('title');
    const desc  = get('description') || get('summary');
    const link  = (() => {
      const a = block.match(/<link[^>]*>([^<]+)<\/link>/i);
      if (a) return a[1].trim();
      const b = block.match(/<link[^>]+href="([^"]+)"/i);
      return b ? b[1] : '';
    })();
    if (title.length > 10 && link) items.push({ title, desc: desc.slice(0, 400), link });
  }
  return items;
}

async function fetchSource(src) {
  try {
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'InfoPolBot/1.0', Accept: 'application/rss+xml,text/xml,*/*' },
      signal: AbortSignal.timeout(13_000),
    });
    if (!res.ok) { console.warn(`  ${src.name}: HTTP ${res.status}`); return []; }
    const items = parseRSS(await res.text()).slice(0, 6);
    console.log(`  ${src.name}: ${items.length} articles`);
    return items.map(i => ({ ...i, source: src.name, region: src.region }));
  } catch (e) {
    console.warn(`  ${src.name}: ${e.message}`);
    return [];
  }
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  const client = new Anthropic();

  const todayISO  = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
  const [, month, day] = todayISO.split('-');
  const dateLabel = `${month}·${day}`;

  console.log(`\nInfoPol News Fetcher — ${todayISO}`);
  console.log('Fetching RSS feeds...');
  const articles = (await Promise.all(SOURCES.map(fetchSource))).flat();
  console.log(`Total: ${articles.length} articles\n`);

  if (articles.length < 3) { console.log('Too few articles, skipping.'); return; }

  const articleList = articles
    .map((a, i) => `[${i + 1}] FONT: ${a.source} (${a.region})\nTÍTOL: ${a.title}\nDESC: ${a.desc || '—'}\nURL: ${a.link}`)
    .join('\n\n---\n\n');

  const userPrompt = `Avui és ${todayISO}. Revisa els articles i selecciona els 10-12 més importants, cobrint diverses categories.

CATEGORIES (usa el text exacte):
"Política" | "Economia" | "Internacional" | "Esports" | "Successos" | "Cultura" | "Ciència" | "Premi"

"Successos" = fets policials, delictes, accidents greus, detencions, judicis.

Per cada notícia, retorna un objecte JSON:
{
  "tag": "<categoria>",
  "title": "<titular en català, max 65 car>",
  "desc": "<resum 1-2 frases en català, max 110 car>",
  "url": "<url original>",
  "source": "<nom font>"
}

ARTICLES:
${articleList}

Respon ÚNICAMENT amb l'array JSON, sense cap altre text.`;

  console.log('Calling Claude API...');
  const msg = await client.messages.create({
    model:      'claude-opus-4-8',
    max_tokens: 2048,
    system:     'Ets el redactor de notícies de l\'app InfoPol per a agents de policia a Catalunya. Estil telegràfic, concís i professional, sempre en català formal.',
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const text = msg.content[0].text.trim();
  let selected;
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    selected = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch (e) {
    console.error('Could not parse Claude response:\n', text);
    process.exit(1);
  }
  console.log(`Claude selected ${selected.length} items`);

  const formatted = selected.map((item, i) => ({
    id:        `g${todayISO.replace(/-/g, '')}${String(i + 1).padStart(2, '0')}`,
    category:  'general',
    date:      todayISO,
    dateLabel,
    tag:       String(item.tag   || 'Notícia').slice(0, 20),
    title:     String(item.title || '').slice(0, 100),
    desc:      String(item.desc  || '').slice(0, 150),
    url:       item.url    || null,
    source:    String(item.source || ''),
  }));

  let existing = [];
  if (existsSync(NEWS_FILE)) {
    try { existing = JSON.parse(readFileSync(NEWS_FILE, 'utf-8')); } catch {}
  }

  const merged = [
    ...formatted,
    ...existing.filter(n => n.date !== todayISO),
  ].slice(0, 900);

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(`\nSaved ${formatted.length} items for ${todayISO} → ${NEWS_FILE}`);
  console.log('Done!\n');
}

main().catch(e => { console.error(e); process.exit(1); });
