/**
 * InfoPol · Recollida automàtica de notícies
 * Executa a les 22:00 hora espanyola via GitHub Actions.
 * Requereix: ANTHROPIC_API_KEY com a variable d'entorn.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../src/data/news.json');
const MAX_ITEMS = 90; // ~30 dies × 3 notícies/dia

// ── Fonts RSS ────────────────────────────────────────────────────
const SOURCES = [
  // Catalunya
  { url: 'https://www.vilaweb.cat/rss.xml',                                          name: 'VilaWeb',        scope: 'CAT' },
  { url: 'https://www.naciodigital.cat/rss/portada',                                 name: 'Nació Digital',  scope: 'CAT' },
  { url: 'https://www.rac1.cat/rss/',                                                name: 'RAC1',           scope: 'CAT' },
  // Espanya
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',         name: 'El País',        scope: 'ESP' },
  { url: 'https://www.lavanguardia.com/rss/home.xml',                               name: 'La Vanguardia',  scope: 'ESP+CAT' },
  { url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml',                     name: 'El Mundo',       scope: 'ESP' },
  { url: 'https://www.elperiodico.com/es/rss/rss_portada.xml',                      name: 'El Periódico',   scope: 'CAT+ESP' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                                  name: 'BBC Mundo',      scope: 'INT' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',                  name: 'NYT World',      scope: 'INT' },
  // Esports
  { url: 'https://www.marca.com/rss/portada.html',                                  name: 'Marca',          scope: 'ESP-Sports' },
  { url: 'https://www.mundodeportivo.com/rss/home.xml',                             name: 'Mundo Deportivo', scope: 'CAT-Sports' },
  // Ciència i cultura
  { url: 'https://www.nationalgeographic.com.es/rss/noticias',                      name: 'Nat Geo ES',     scope: 'SCI' },
];

// ── Funcions auxiliars ────────────────────────────────────────────

function extractTag(block, tag) {
  // Handles CDATA, namespaced tags, and plain tags
  const re = new RegExp(
    `<(?:[^:>]+:)?${tag}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</(?:[^:>]+:)?${tag}>`,
    'i'
  );
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function cleanText(s) {
  if (!s) return '';
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRSSItems(xml, sourceName, scope) {
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const title = cleanText(extractTag(block, 'title'));
    const desc  = cleanText(extractTag(block, 'description') || extractTag(block, 'summary') || '');
    const link  = cleanText(extractTag(block, 'link') || extractTag(block, 'guid') || '');
    const pubDate = cleanText(extractTag(block, 'pubDate') || extractTag(block, 'published') || '');
    if (!title || title.length < 10) continue;
    items.push({ source: sourceName, scope, title, desc: desc.slice(0, 300), link, pubDate });
    if (items.length >= 8) break;
  }
  return items;
}

async function fetchSource(source) {
  try {
    const resp = await fetch(source.url, {
      headers: { 'User-Agent': 'InfoPol-NewsBot/1.0 (+https://infopol.app)' },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) { console.warn(`[skip] ${source.name}: HTTP ${resp.status}`); return []; }
    const xml = await resp.text();
    const items = parseRSSItems(xml, source.name, source.scope);
    console.log(`  ✓ ${source.name}: ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`  ✗ ${source.name}: ${err.message}`);
    return [];
  }
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  const today = new Date();
  const dateStr   = today.toISOString().slice(0, 10);
  const month     = String(today.getMonth() + 1).padStart(2, '0');
  const day       = String(today.getDate()).padStart(2, '0');
  const dateLabel = `${month}·${day}`;

  console.log(`\n📰 InfoPol News · ${dateStr}\n`);
  console.log('Recollint RSS...');

  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  const allItems = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);

  console.log(`\nTotal items recollits: ${allItems.length}`);

  if (allItems.length < 3) {
    console.error('No s\'han pogut obtenir suficients notícies. Aborta.');
    process.exit(1);
  }

  // Format items for Claude
  const itemsText = allItems
    .map((it, i) =>
      `[${i}] ${it.source} (${it.scope})\nTítol: ${it.title}\nDesc: ${it.desc}\nURL: ${it.link}`
    )
    .join('\n---\n');

  const prompt = `Ets el redactor de notícies de InfoPol, l'app oficial per a policies de Catalunya.
Data d'avui: ${dateStr}

Se t'han proporcionat ${allItems.length} titulars de premsa. Selecciona les MILLORS notícies d'avui i formata-les per a la secció de notícies de l'app.

CATEGORIES OBLIGATÒRIES (intenta cobrir-les totes; mínim 6 categories):
• politica   → política de Catalunya, Espanya o internacional
• economia   → economia, empresa, mercats, treball, preus
• cultura    → cultura, art, cinema, música, gastronomia, societat
• descobriments → ciència, tecnologia, medi ambient, salut, descobertes
• premis     → premis, guardons, reconeixements, distincions
• esports    → futbol, bàsquet, atletisme, qualsevol esport
• policial   → successos, jutjats, legislació, crims, seguretat
• internacional → notícies globals rellevants (exclou ESP/CAT si ja estan cobertes)

REGLES D'ESTIL:
- Escriu SEMPRE en CATALÀ correcte i periodístic
- "tag": curt i precís. Exemples: "Política · CAT", "Economia · ESP", "Esports", "Internacional", "Policial", "Cultura · CAT", "Ciència", "Premis"
- "title": directe, informatiu, màxim 75 caràcters, sense clickbait
- "desc": 1-2 frases de context (màx 210 caràcters), afegeix dades concretes si en tens
- Inclou la URL original sempre que sigui possible
- Prioritza notícies d'avui (${dateStr}); si no n'hi ha prou, usa les més recents
- Per a policial/legal: prioritza canvis normatius o incidents rellevants

NOTÍCIES DISPONIBLES:
${itemsText}

Respon EXCLUSIVAMENT amb un array JSON vàlid, sense cap text addicional fora del JSON:
[
  {
    "id": "${dateStr}-001",
    "date": "${dateStr}",
    "dateLabel": "${dateLabel}",
    "tag": "Categoria · Àmbit",
    "title": "Títol de la notícia",
    "desc": "Resum breu en 1-2 frases amb dades concretes.",
    "url": "https://exemple.com/noticia",
    "category": "politica"
  }
]`;

  console.log('\nGenerant resum amb Claude...');
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3500,
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = response.content[0].text.trim();

  // Extract JSON array (robust against markdown code fences)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('No s\'ha pogut extreure JSON de la resposta:');
    console.error(rawText.slice(0, 600));
    process.exit(1);
  }

  let newItems;
  try {
    newItems = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Error parsejant JSON:', err.message);
    console.error(rawText.slice(0, 600));
    process.exit(1);
  }

  // Ensure sequential IDs
  newItems = newItems.map((item, i) => ({
    ...item,
    id: `${dateStr}-${String(i + 1).padStart(3, '0')}`,
    date: dateStr,
    dateLabel,
  }));

  console.log(`\n✅ ${newItems.length} notícies generades:`);
  newItems.forEach(n => console.log(`  [${n.category}] ${n.title}`));

  // Load existing, remove today's entries, prepend new ones
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  } catch {
    existing = [];
  }

  const filtered = existing.filter(n => n.date !== dateStr);
  const updated  = [...newItems, ...filtered].slice(0, MAX_ITEMS);

  writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n💾 news.json actualitzat: ${newItems.length} noves + ${filtered.length} anteriors = ${updated.length} total\n`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
