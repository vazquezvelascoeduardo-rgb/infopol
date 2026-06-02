/**
 * Daily news fetcher for InfoPol.
 * Fetches RSS feeds from Catalan, Spanish, and international sources,
 * uses Claude to select and summarize the top stories in Catalan,
 * then updates server/data/news.json.
 *
 * Run: node scripts/fetch-news.mjs
 * Requires: ANTHROPIC_API_KEY env var
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news.json');
const MAX_STORED_NEWS = 60;

const RSS_SOURCES = [
  // Catalunya
  { url: 'https://www.3cat.cat/rss/noticia/1/', label: '3Cat', scope: 'CAT' },
  { url: 'https://vilaweb.cat/rss', label: 'VilaWeb', scope: 'CAT' },
  { url: 'https://www.elnacional.cat/ca/rss.xml', label: 'El Nacional', scope: 'CAT' },
  { url: 'https://www.naciodigital.cat/rss.xml', label: 'NacióDigital', scope: 'CAT' },
  // Espanya
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', label: 'El País', scope: 'ESP' },
  { url: 'https://www.lavanguardia.com/rss/home.xml', label: 'La Vanguardia', scope: 'ESP' },
  { url: 'https://www.elmundo.es/rss/portada.xml', label: 'El Mundo', scope: 'ESP' },
  { url: 'https://www.eldiario.es/rss/', label: 'ElDiario.es', scope: 'ESP' },
  // Esports
  { url: 'https://www.sport.es/rss/portada.xml', label: 'Sport', scope: 'ESP' },
  { url: 'https://www.mundodeportivo.com/rss/home.xml', label: 'Mundo Deportivo', scope: 'ESP' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml', label: 'BBC Mundo', scope: 'INT' },
  { url: 'https://es.reuters.com/rssFeed/topNews', label: 'Reuters ES', scope: 'INT' },
];

async function fetchRSS(source) {
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'InfoPol NewsBot/1.0; +https://infopol.cat' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSSItems(xml, source);
  } catch (err) {
    console.warn(`  [WARN] ${source.label}: ${err.message}`);
    return [];
  }
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/<[^>]+>/g, '')
    .trim();
}

function extractCDATA(str) {
  const cdata = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return cdata ? cdata[1].trim() : str.trim();
}

function parseRSSItems(xml, source) {
  const items = [];
  const cutoff = Date.now() - 26 * 60 * 60 * 1000; // last 26 hours

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];

    const rawTitle = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
    const rawDesc  = block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '';
    const rawLink  = block.match(/<link>([^<\]]+)<\/link>/)?.[1]
                  ?? block.match(/<link[^>]+href="([^"]+)"/)?.[1]
                  ?? '';
    const rawDate  = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]
                  ?? block.match(/<dc:date>([\s\S]*?)<\/dc:date>/)?.[1]
                  ?? '';

    const title = decodeEntities(extractCDATA(rawTitle));
    const desc  = decodeEntities(extractCDATA(rawDesc)).slice(0, 300);
    const link  = rawLink.trim();
    const pub   = rawDate ? new Date(rawDate.trim()) : new Date();

    if (!title || !link) continue;
    if (!isNaN(pub.getTime()) && pub.getTime() < cutoff) continue;

    items.push({ title, desc, link, source: source.label, scope: source.scope });
  }

  return items.slice(0, 20); // max 20 per source
}

function loadExistingNews() {
  try {
    return JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function nextId(existing) {
  const nums = existing
    .map(n => parseInt(n.id.replace('n', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `n${String(max + 1).padStart(3, '0')}`;
}

function todayLabel() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}·${dd}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function selectAndSummarize(articles, existing) {
  const client = new Anthropic();

  const recentTitles = existing
    .slice(0, 15)
    .map(n => n.title)
    .join('\n');

  const articleList = articles
    .map((a, i) => `[${i + 1}] [${a.scope}] ${a.source}\nTítol: ${a.title}\nResum: ${a.desc}\nURL: ${a.link}`)
    .join('\n\n');

  const prompt = `Ets l'editor de notícies d'InfoPol, un portal d'informació per a agents de policia de Catalunya.

La data d'avui és ${todayISO()}.

NOTÍCIES JA PUBLICADES (no les repeteixis):
${recentTitles || '(cap)'}

ARTICLES DISPONIBLES DE LES DARRERES 26 HORES:
${articleList}

TASCA:
Selecciona les 8–10 notícies més importants i diverses. Cobreix les categories:
- Política (CAT / ESP / Internacional)
- Economia
- Esports
- Policial / Judicial
- Cultura
- Ciència / Descobriments
- Premis / Distinctions

Per a cada notícia, retorna un objecte JSON amb aquests camps exactes:
- "tag": etiqueta curta (ex: "Política · CAT", "Esports", "Policial", "Economia · ESP", "Internacional", "Cultura", "Ciència", "Premis")
- "title": titular en català, concís, màxim 85 caràcters
- "desc": resum en català amb els fets clau, màxim 160 caràcters
- "url": URL de l'article original (la URL exacta de la llista)

Regles:
- Escriu sempre en català
- No repeteixis notícies ja publicades
- Prioritza notícies rellevants per a agents de policia
- Si hi ha notícies policials o judicials importants, inclou-les sempre
- Retorna ÚNICAMENT un array JSON vàlid, sense cap text addicional

Exemple del format esperat:
[
  {
    "tag": "Policial",
    "title": "Operació antidroga al Besòs: 12 detinguts i 40 kg de cocaïna comissats",
    "desc": "Els Mossos d'Esquadra i la Policia Nacional han desarticulat una xarxa de distribució de cocaïna al barri del Besòs.",
    "url": "https://exemple.cat/noticia"
  }
]`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();

  // Extract JSON array even if Claude adds extra text
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Claude did not return a valid JSON array');

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  console.log(`\n InfoPol — Cerca de notícies diària`);
  console.log(`  Data: ${todayISO()}\n`);

  // 1. Fetch all RSS feeds in parallel
  console.log('  Carregant fonts RSS...');
  const results = await Promise.all(RSS_SOURCES.map(fetchRSS));
  const allArticles = results.flat();
  console.log(`  Articles obtinguts: ${allArticles.length}`);

  if (allArticles.length === 0) {
    console.error('  ERROR: No s\'han obtingut articles. Sortint.');
    process.exit(1);
  }

  // 2. Load existing news (to avoid duplicates)
  const existing = loadExistingNews();
  console.log(`  Notícies existents: ${existing.length}`);

  // 3. Call Claude to select and summarize
  console.log('  Seleccionant i resumint amb Claude...');
  let selected;
  try {
    selected = await selectAndSummarize(allArticles, existing);
  } catch (err) {
    console.error(`  ERROR Claude: ${err.message}`);
    process.exit(1);
  }
  console.log(`  Notícies seleccionades: ${selected.length}`);

  // 4. Build new entries
  let counter = existing.length;
  const today = todayISO();
  const label = todayLabel();

  let idBase = existing
    .map(n => parseInt(n.id.replace('n', ''), 10))
    .filter(n => !isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);

  const newEntries = selected.map(item => {
    idBase += 1;
    return {
      id: `n${String(idBase).padStart(3, '0')}`,
      date: today,
      dateLabel: label,
      tag: item.tag ?? 'Actualitat',
      title: (item.title ?? '').slice(0, 120),
      desc: (item.desc ?? '').slice(0, 200),
      url: item.url ?? null,
    };
  });

  // 5. Prepend new entries, keep last MAX_STORED_NEWS
  const updated = [...newEntries, ...existing].slice(0, MAX_STORED_NEWS);

  // 6. Write atomically
  writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n  Fet! ${newEntries.length} notícies noves afegides a news.json`);
  newEntries.forEach(n => console.log(`    [${n.tag}] ${n.title}`));
  console.log('');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
