/**
 * Fetch daily news from Spanish/Catalan RSS feeds and format them
 * using Claude API. Writes output to src/data/noticias.js.
 *
 * Required env: ANTHROPIC_API_KEY
 * Usage: node scripts/fetch-news.mjs
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RSS_FEEDS = [
  { name: 'El País Portada',       url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' },
  { name: 'El País Internacional', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/seccion/internacional/portada' },
  { name: 'La Vanguardia',         url: 'https://www.lavanguardia.com/rss/home.xml' },
  { name: 'Ara',                   url: 'https://www.ara.cat/rss/' },
  { name: 'NacióDigital',          url: 'https://www.naciodigital.cat/rss.xml' },
  { name: 'Marca',                 url: 'https://www.marca.com/rss/portada.xml' },
  { name: 'El Mundo',              url: 'https://www.elmundo.es/rss/portada.xml' },
];

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'InfoPol-NewsBot/1.0 (+https://infopol.cat)' },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return `=== ${feed.name} ===\n${text.slice(0, 5000)}`;
  } catch {
    console.warn(`⚠ No s'ha pogut carregar: ${feed.name}`);
    return null;
  }
}

async function main() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dateStr = `${mm}·${dd}`;
  const dateISO = `${today.getFullYear()}-${mm}-${dd}`;

  console.log(`📰 Buscant notícies per al ${dateISO}...`);

  const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
  const validFeeds = results.filter(Boolean);

  if (validFeeds.length === 0) throw new Error('Cap feed RSS disponible');
  console.log(`✓ ${validFeeds.length}/${RSS_FEEDS.length} feeds carregats`);

  const feedContent = validFeeds.join('\n\n');

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Avui és ${dateISO}. Se t'han proporcionat feeds RSS de mitjans de comunicació espanyols i catalans.

Extreu 12-16 de les notícies més rellevants d'avui, cobrint el màxim de categories i àmbits geogràfics.

CATEGORIES (usa exactament aquest valor per al camp "cat"):
  politica      → Política de Catalunya o Espanya
  economia      → Economia, mercats, empresa, ocupació
  cultura       → Cultura, art, música, literatura, cinema, gastronomia
  descobriments → Ciència, tecnologia, medi ambient, salut, espai
  premis        → Premis, reconeixements, guardons
  esports       → Futbol, tennis, ciclisme, atletisme, basket, etc.
  policial      → Successos, crims, detencions, judicial, sentències
  internacional → Noticies del món fora d'Espanya

ÀMBIT ("geo"): "Catalunya" | "Espanya" | "Internacional"

ETIQUETA ("tag"): Política | Economia | Cultura | Ciència | Premis | Esports | Successos | Judicial | Internacional

INSTRUCCIONS:
- Escriu "title" en català, màxim 80 caràcters
- Escriu "desc" en català, màxim 2 frases clares i informatives
- Usa la URL real del camp <link> del RSS
- Inclou mínim: 2 Catalunya, 3 Espanya, 3 Internacional
- Inclou mínim: 2 política, 1 economia, 1 cultura, 1 esports, 1 successos/judicial
- NO inventis notícies: només usa les que apareguin als feeds

Respon ÚNICAMENT amb un array JSON vàlid, sense markdown ni text addicional:
[{"cat":"...","tag":"...","geo":"...","title":"...","desc":"...","url":"..."}]

CONTINGUT DELS FEEDS:
${feedContent}`,
    }],
  });

  const raw = response.content.find(b => b.type === 'text')?.text?.trim() ?? '';

  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Resposta sense JSON vàlid:\n${raw.slice(0, 400)}`);

  let articles;
  try {
    articles = JSON.parse(match[0]);
  } catch (e) {
    throw new Error(`JSON invàlid: ${e.message}`);
  }

  const items = articles.map((a, i) => ({
    id: `n${dateISO.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
    date: dateStr,
    dateISO,
    geo: a.geo || 'Internacional',
    cat: a.cat || 'internacional',
    tag: a.tag || 'Internacional',
    title: String(a.title || '').slice(0, 100),
    desc: String(a.desc || ''),
    url: String(a.url || ''),
  }));

  const outPath = join(__dirname, '../src/data/noticias.js');
  const content = `// Actualitzat: ${dateISO}\nexport const NOTICIAS = ${JSON.stringify(items, null, 2)};\n`;

  writeFileSync(outPath, content, 'utf8');
  console.log(`✅ ${items.length} notícies escrites a src/data/noticias.js`);
}

main().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
