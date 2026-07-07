#!/usr/bin/env node
/**
 * InfoPol · Fetcher de noticias diàries
 *
 * Execució: node scripts/fetch-news.mjs
 * Variables d'entorn requerides: ANTHROPIC_API_KEY
 *
 * Obté notícies de fonts RSS catalanes, espanyoles i internacionals,
 * delega a Claude la selecció/categorització/resum en català
 * i escriu el resultat a src/data/noticias.json.
 */
import Anthropic from '@anthropic-ai/sdk';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NOTICIAS_PATH = path.join(__dirname, '../src/data/noticias.json');
const KEEP_DAYS = 7;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Fonts RSS: política, economia, cultura, esports, internacionals
const RSS_FEEDS = [
  // Català
  { url: 'https://www.ara.cat/rss.xml',                                           zone: 'CAT' },
  { url: 'https://www.vilaweb.cat/feed/',                                          zone: 'CAT' },
  { url: 'https://www.naciodigital.cat/feed',                                      zone: 'CAT' },
  // Espanyol nacional
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',      zone: 'ESP' },
  { url: 'https://www.elmundo.es/rss/portada.xml',                                 zone: 'ESP' },
  // Economia
  { url: 'https://cincodias.elpais.com/rss/secciones/economia.xml',               zone: 'ESP' },
  // Esports
  { url: 'https://www.sport.es/rss/portada.xml',                                   zone: 'ESP' },
  { url: 'https://as.com/rss/portada.xml',                                         zone: 'ESP' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                                zone: 'INT' },
  { url: 'https://www.lavanguardia.com/mvc/feed/rss/world.xml',                   zone: 'INT' },
];

function fetchRSS(url) {
  return new Promise((resolve) => {
    try {
      const proto = url.startsWith('https') ? https : http;
      const req = proto.get(
        url,
        { timeout: 12000, headers: { 'User-Agent': 'InfoPol-NewsBot/1.0' } },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        }
      );
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch {
      resolve('');
    }
  });
}

function htmlDecode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function extractItems(xml, zone) {
  const items = [];
  const pattern = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = pattern.exec(xml)) !== null && items.length < 10) {
    const raw = match[1];
    const get = (tag) => {
      const rx = new RegExp(
        `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\/${tag}>`, 'i'
      );
      const m = raw.match(rx);
      return m ? htmlDecode((m[1] ?? m[2] ?? '').trim()) : '';
    };
    const title = get('title');
    const desc  = get('description').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').substring(0, 300).trim();
    const link  = get('link');
    if (title.length > 5 && link) {
      items.push({ title, desc, link, zone });
    }
  }
  return items;
}

async function main() {
  const now       = new Date();
  const dateISO   = now.toISOString().split('T')[0];
  const mm        = String(now.getMonth() + 1).padStart(2, '0');
  const dd        = String(now.getDate()).padStart(2, '0');
  const dateLabel = `${mm}·${dd}`;

  console.log(`\n📰 InfoPol News Fetch — ${dateISO}\n`);

  // 1. Fetch all RSS in parallel
  const results = await Promise.all(RSS_FEEDS.map(f => fetchRSS(f.url)));
  const allItems = [];
  results.forEach((xml, i) => {
    if (!xml) { console.log(`  ⚠  ${RSS_FEEDS[i].url} → sense resposta`); return; }
    const items = extractItems(xml, RSS_FEEDS[i].zone);
    console.log(`  ✓  ${RSS_FEEDS[i].url} → ${items.length} ítems`);
    allItems.push(...items);
  });

  console.log(`\n  Total: ${allItems.length} ítems\n`);
  if (allItems.length === 0) {
    console.log('Cap ítem trobat. Sortida sense canvis.');
    process.exit(0);
  }

  // 2. Deduplicate by title similarity (simple: lowercase first 40 chars)
  const seen = new Set();
  const unique = allItems.filter(it => {
    const key = it.title.toLowerCase().substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 3. Send to Claude for selection, categorisation, and Catalan summarisation
  const itemsList = unique
    .map((it, i) => `[${i + 1}] ${it.title}\n    ${it.desc}\n    ZONA: ${it.zone} | URL: ${it.link}`)
    .join('\n\n');

  const systemPrompt = `Ets el redactor de notícies de l'aplicació InfoPol (eina per a policies catalans).
La teva tasca és seleccionar, categoritzar i resumir notícies en català de forma breu i precisa.
Cobertura: Catalunya (CAT), Espanya (ESP) i Internacional (INT).
Categories possibles per al camp "tag":
  Política · CAT | Política · ESP | Política · INT
  Economia · CAT | Economia · ESP | Economia · INT
  Esports · CAT  | Esports · ESP  | Esports · INT
  Cultura · CAT  | Cultura · ESP  | Cultura · INT
  Policials · CAT| Policials · ESP| Policials · INT
  Judicial · ESP | Judicial · CAT
  Descobriments  | Premis · INT   | Tecnologia · INT
  Seguretat · ESP| Seguretat · CAT`;

  const userPrompt = `Data d'avui: ${dateISO}

Aquí tens ${unique.length} notícies de fonts RSS:

${itemsList}

Tasca:
1. Selecciona entre 10 i 15 notícies importants i diverses d'avui.
2. Prioritza: primer CAT, després ESP, després INT.
3. Assegura varietat de categories (política, economia, esports, cultura, policials, etc.).
4. Per a cada notícia:
   - "tag": usa el format "Categoria · ZONA" dels exemples anteriors
   - "title": titular curt en CATALÀ (màx. 85 car.)
   - "desc": resum de 1-2 frases en CATALÀ (màx. 150 car.)
   - "url": URL original sense modificar

Respon ÚNICAMENT amb un array JSON vàlid, sense cap text addicional:
[{"tag":"...","title":"...","desc":"...","url":"..."}]`;

  console.log('🤖 Cridant Claude API…');
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content[0].text.trim();

  // 4. Parse JSON
  let selected;
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No s\'ha trobat cap array JSON a la resposta');
    selected = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(selected)) throw new Error('La resposta no és un array');
  } catch (err) {
    console.error('Error parsejant la resposta de Claude:', err.message);
    console.error('Resposta (500 car.):', raw.substring(0, 500));
    process.exit(1);
  }

  console.log(`  → ${selected.length} notícies seleccionades\n`);

  // 5. Build final items with metadata
  const newItems = selected.map((it, i) => ({
    id:        `n-${dateISO}-${String(i + 1).padStart(2, '0')}`,
    date:      dateISO,
    dateLabel,
    tag:       (it.tag  || 'General').trim(),
    title:     (it.title || '').trim(),
    desc:      (it.desc  || '').trim(),
    url:       it.url || null,
  }));

  // 6. Merge with existing — keep last KEEP_DAYS days, remove today's old entries
  let existing = [];
  if (fs.existsSync(NOTICIAS_PATH)) {
    try { existing = JSON.parse(fs.readFileSync(NOTICIAS_PATH, 'utf8')); } catch {}
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  const cutoffISO = cutoff.toISOString().split('T')[0];
  const kept = existing.filter(n => n.date && n.date >= cutoffISO && n.date !== dateISO);
  const merged = [...newItems, ...kept];

  // 7. Write to disk
  fs.mkdirSync(path.dirname(NOTICIAS_PATH), { recursive: true });
  fs.writeFileSync(NOTICIAS_PATH, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`✅ ${merged.length} notícies totals guardades a src/data/noticias.json`);
  console.log(`   (${newItems.length} noves d'avui + ${kept.length} dels darrers ${KEEP_DAYS} dies)\n`);
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
