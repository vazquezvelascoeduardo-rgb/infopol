#!/usr/bin/env node
/**
 * Fetch daily news for InfoPol.
 * Reads RSS feeds → sends to Claude API → writes data/news.json
 * Run: node scripts/fetch-news.js
 * Requires: ANTHROPIC_API_KEY env var
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../data/news.json');

// ── RSS sources ───────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  // Catalunya
  { url: 'https://www.ccma.cat/rss/noticies.xml',            region: 'Catalunya' },
  { url: 'https://www.vilaweb.cat/rss.xml',                   region: 'Catalunya' },
  { url: 'https://www.naciodigital.cat/rss.xml',              region: 'Catalunya' },
  { url: 'https://www.elnacional.cat/feed/',                  region: 'Catalunya' },
  // España
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', region: 'España' },
  { url: 'https://statici.elmundo.es/elmundo/rss/portada.xml',region: 'España' },
  { url: 'https://www.rtve.es/api/recordings/current.rss',   region: 'España' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',           region: 'Internacional' },
  { url: 'https://feeds.reuters.com/reuters/topNews',        region: 'Internacional' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchText(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { 'User-Agent': 'InfoPol-NewsBot/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function parseRSS(xml, region) {
  const items = [];
  const itemRx = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRx.exec(xml)) !== null) {
    const block = match[1];
    const title = (/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(block)
      || /<title[^>]*>([\s\S]*?)<\/title>/.exec(block) || [])[1]?.trim();
    const link = (/<link>([\s\S]*?)<\/link>/.exec(block)
      || /<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/.exec(block) || [])[1]?.trim();
    const desc = (/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(block)
      || /<description[^>]*>([\s\S]*?)<\/description>/.exec(block) || [])[1]?.trim();
    const date = (/<pubDate>([\s\S]*?)<\/pubDate>/.exec(block) || [])[1]?.trim();
    if (title && link) {
      items.push({
        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').substring(0, 200),
        link,
        desc: (desc || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim().substring(0, 300),
        date,
        region,
      });
    }
  }
  return items.slice(0, 6); // max 6 per feed
}

function todayId() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

function dateLabel(iso) {
  return iso.slice(5, 7) + '·' + iso.slice(8, 10);
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

// ── Claude ────────────────────────────────────────────────────────────────────

async function summariseWithClaude(rawItems) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const today = new Date().toLocaleDateString('ca-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const prompt = `Ets el redactor de notícies de l'app InfoPol per a agents dels Mossos d'Esquadra de Catalunya.

Avui és ${today}.

A continuació tens fins a ${rawItems.length} titulars de diverses fonts d'RSS de Catalunya, Espanya i internacional.

La teva feina és:
1. Selecciona les 12–15 notícies més rellevants i interessants del dia: política, economia, cultura, descobriments/ciència, premis, esports, fets policials o judicials. Prioritza novetats reals del dia.
2. Per a cada notícia seleccionada, redacta en CATALÀ:
   - Un títol clar i concís (màx. 80 caràcters)
   - Un resum de 2–3 frases (màx. 220 caràcters) que expliqui el fet principal
   - Una etiqueta de categoria curta: Política | Economia | Cultura | Ciència | Premis | Esports | Policial | Judicial | Internacional | Catalunya | Espanya
3. Inclou el link original sense modificar-lo.

Respon EXCLUSIVAMENT en JSON, sense cap text addicional, amb aquest format:
[
  {
    "tag": "Política",
    "title": "...",
    "desc": "...",
    "url": "https://..."
  },
  ...
]

Aquí els titulars de les fonts RSS:
${JSON.stringify(rawItems.map(i => ({ t: i.title, d: i.desc, u: i.link, r: i.region })), null, 2)}`;

  const msg = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Claude did not return JSON array');
  return JSON.parse(jsonMatch[0]);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📡 Fetching RSS feeds…');
  const allItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const xml = await fetchText(feed.url);
      const items = parseRSS(xml, feed.region);
      allItems.push(...items);
      console.log(`  ✓ ${feed.region} — ${items.length} items from ${feed.url}`);
    } catch (err) {
      console.warn(`  ✗ ${feed.url}: ${err.message}`);
    }
  }

  if (allItems.length === 0) {
    console.error('No items fetched — aborting.');
    process.exit(1);
  }

  console.log(`\n🤖 Sending ${allItems.length} items to Claude…`);
  const summarised = await summariseWithClaude(allItems);
  console.log(`  ✓ Got ${summarised.length} news entries`);

  // Load existing news and prepend today's batch
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf8'));
  } catch { /* file may not exist yet */ }

  const today = isoToday();
  // Remove entries from today (to avoid duplicates on re-run)
  existing = existing.filter(n => n.date !== today);

  const todayBase = todayId();
  const fresh = summarised.map((n, i) => ({
    id: `n_${todayBase}_${String(i + 1).padStart(3, '0')}`,
    date: today,
    dateLabel: dateLabel(today),
    tag: n.tag || 'Notícia',
    title: n.title,
    desc: n.desc,
    url: n.url || null,
  }));

  // Keep at most 120 entries total (roughly 8–10 days of history)
  const merged = [...fresh, ...existing].slice(0, 120);

  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2));
  console.log(`\n✅ Saved ${fresh.length} new entries to data/news.json (${merged.length} total)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
