/**
 * fetch-news.mjs
 * Executa cada dia a les 22:00 via GitHub Actions.
 * Llegeix RSS de fonts catalanes, espanyoles i internacionals,
 * demana a Claude que seleccioni i resumeixi les notícies més rellevants,
 * i desa el resultat a server/data/news-general.json.
 *
 * Requereix: ANTHROPIC_API_KEY al entorn (secret de GitHub)
 */

import Anthropic from '@anthropic-ai/sdk';
import RSSParser from 'rss-parser';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news-general.json');
const DATA_DIR  = join(__dirname, '../server/data');

const RSS_SOURCES = [
  // ── Catalunya ────────────────────────────────────────────────
  { url: 'https://www.vilaweb.cat/rss/',                                              region: 'Catalunya',     source: 'VilaWeb' },
  { url: 'https://www.naciodigital.cat/rss.xml',                                      region: 'Catalunya',     source: 'NacióDigital' },
  { url: 'https://www.lavanguardia.com/rss/home.xml',                                 region: 'Catalunya',     source: 'La Vanguardia' },
  { url: 'https://www.elpuntavui.cat/rss/component/k2/items/feed/feed.xml',           region: 'Catalunya',     source: 'El Punt Avui' },

  // ── Espanya ──────────────────────────────────────────────────
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',          region: 'Espanya',       source: 'El País' },
  { url: 'https://www.elmundo.es/rss/portada.xml',                                    region: 'Espanya',       source: 'El Mundo' },
  { url: 'https://rss.elconfidencial.com/espana/',                                    region: 'Espanya',       source: 'El Confidencial' },
  { url: 'https://www.20minutos.es/rss/noticia/',                                     region: 'Espanya',       source: '20minutos' },

  // ── Internacional ────────────────────────────────────────────
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                                   region: 'Internacional', source: 'BBC Mundo' },
  { url: 'https://rss.euronews.com/es/news.rss',                                      region: 'Internacional', source: 'Euronews' },
  { url: 'https://www.lavanguardia.com/rss/mundo.xml',                               region: 'Internacional', source: 'La Vanguardia Internacional' },
];

async function fetchAllRSS() {
  const parser = new RSSParser({ timeout: 10000 });
  const allItems = [];

  for (const src of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(src.url);
      const items = (feed.items || []).slice(0, 6).map(item => ({
        title:       (item.title || '').replace(/<[^>]+>/g, '').trim(),
        snippet:     (item.contentSnippet || item.description || '').replace(/<[^>]+>/g, '').slice(0, 300).trim(),
        url:         item.link || '',
        pubDate:     item.pubDate || '',
        region:      src.region,
        source:      src.source,
      }));
      allItems.push(...items.filter(i => i.title && i.url));
      console.log(`✓ ${src.source}: ${items.length} articles`);
    } catch (e) {
      console.warn(`✗ ${src.source} (${src.url}): ${e.message}`);
    }
  }

  return allItems;
}

async function curateWithClaude(articles) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY no definida');
  const client = new Anthropic();

  const today      = new Date().toISOString().split('T')[0];
  const [y, m, d]  = today.split('-');
  const dateLabel  = `${m}·${d}`;

  const articleList = articles
    .map((a, i) =>
      `[${i + 1}] FONT: ${a.source} | REGIÓ: ${a.region}\n` +
      `TÍTOL: ${a.title}\n` +
      `RESUM: ${a.snippet || 'N/D'}\n` +
      `URL: ${a.url}`
    )
    .join('\n\n');

  const systemPrompt =
    `Ets el redactor de notícies d'InfoPol, app de referència per als Mossos d'Esquadra. ` +
    `Escrius en català estàndard, de manera clara i concisa. ` +
    `Els teus lectors són agents de policia: dóna prioritat a notícies de succes os, judicial-policial, seguretat pública i dret, ` +
    `però cobreix totes les categories demanades.`;

  const userPrompt =
    `Avui és ${today}. Analitza els articles següents i selecciona entre 6 i 10 notícies, ` +
    `intentant cobrir les màximes categories possibles:\n` +
    `• Política  • Economia  • Cultura  • Ciència/Descobriments  • Premis  • Esports  • Successos  • Judicial\n\n` +
    `ARTICLES DISPONIBLES:\n${articleList}\n\n` +
    `Per cada notícia seleccionada retorna ÚNICAMENT un array JSON vàlid sense cap text addicional:\n` +
    `[\n` +
    `  {\n` +
    `    "id": "g${y}${m}${d}-001",\n` +
    `    "date": "${today}",\n` +
    `    "dateLabel": "${dateLabel}",\n` +
    `    "category": "Política|Economia|Cultura|Ciència|Premis|Esports|Successos|Judicial",\n` +
    `    "region": "Catalunya|Espanya|Internacional",\n` +
    `    "title": "Titular breu en català (màx 90 car.)",\n` +
    `    "desc": "Resum de 2-3 frases en català. Context breu si cal.",\n` +
    `    "url": "URL original",\n` +
    `    "source": "Nom del mitjà"\n` +
    `  }\n` +
    `]\n` +
    `Incrementa el número a l'id per cada ítem (001, 002, 003…). Retorna NOMÉS el JSON.`;

  const response = await client.messages.create({
    model:      'claude-opus-4-7',
    max_tokens: 4096,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const raw  = response.content[0].text.trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Resposta de Claude sense JSON vàlid:\n${raw.slice(0, 500)}`);

  return JSON.parse(match[0]);
}

function loadExisting() {
  if (!existsSync(NEWS_FILE)) return [];
  try { return JSON.parse(readFileSync(NEWS_FILE, 'utf8')); }
  catch { return []; }
}

function mergeAndPrune(fresh, existing) {
  const today        = new Date().toISOString().split('T')[0];
  const cutoff       = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const withoutToday = existing.filter(n => n.date !== today && n.date >= cutoff);
  return [...fresh, ...withoutToday];
}

async function main() {
  console.log('── InfoPol News Fetcher ────────────────────');

  console.log('\n[1/3] Llegint RSS feeds…');
  const articles = await fetchAllRSS();
  console.log(`Total articles obtinguts: ${articles.length}`);

  if (articles.length === 0) {
    console.error('Cap article obtingut. Sortint sense modificar el fitxer.');
    process.exit(1);
  }

  console.log('\n[2/3] Curant amb Claude…');
  const fresh = await curateWithClaude(articles);
  console.log(`Claude ha seleccionat ${fresh.length} notícies`);

  console.log('\n[3/3] Desant news-general.json…');
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const existing = loadExisting();
  const merged   = mergeAndPrune(fresh, existing);
  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Fitxer actualitzat: ${merged.length} notícies totals\n`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
