// Daily news fetcher — runs via GitHub Actions at 22:00 CET
// Fetches RSS feeds, summarises with Claude API, saves to data/news.json
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const NEWS_FILE = join(ROOT, 'data', 'news.json');
const MAX_NEWS = 90;

const RSS_SOURCES = [
  // Catalunya
  { url: 'https://www.lavanguardia.com/rss/home.xml',              name: 'La Vanguardia' },
  { url: 'https://www.ara.cat/rss.xml',                            name: 'Ara' },
  { url: 'https://www.elperiodico.com/es/rss/rss_portada.xml',     name: 'El Periódico' },
  { url: 'https://www.naciodigital.cat/rss.xml',                   name: 'Nació Digital' },
  { url: 'https://www.rac1.cat/rss.xml',                           name: 'RAC1' },
  // Espanya
  { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', name: 'El País' },
  { url: 'https://www.rtve.es/api/rss/portada',                    name: 'RTVE' },
  { url: 'https://www.elmundo.es/rss/portada.xml',                 name: 'El Mundo' },
  { url: 'https://www.20minutos.es/rss/',                          name: '20minutos' },
  { url: 'https://www.elconfidencial.com/rss/',                    name: 'El Confidencial' },
  // Esports
  { url: 'https://e00-marca.uecdn.es/rss/portada.xml',             name: 'Marca' },
  { url: 'https://www.mundodeportivo.com/rss/home.xml',            name: 'Mundo Deportivo' },
  { url: 'https://www.sport.es/rss/portada.xml',                   name: 'Sport' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',                 name: 'BBC Mundo' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', name: 'NYT World' },
  { url: 'https://feeds.reuters.com/reuters/topNews',              name: 'Reuters' },
];

function parseRSS(xml) {
  const items = [];
  const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const block of blocks.slice(0, 6)) {
    const get = (tag) => {
      const re = new RegExp(
        `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'
      );
      const m = block.match(re);
      return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
    };

    const title = get('title');
    const link  = get('link') || get('guid');
    const desc  = get('description').slice(0, 400);

    if (title && title.length > 5) {
      items.push({ title, link, desc });
    }
  }
  return items;
}

async function fetchFeed({ url, name }) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(9000),
      headers: { 'User-Agent': 'InfoPol/1.0 RSS Reader (+https://infopol.app)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml).map(item => ({ ...item, source: name }));
  } catch {
    return [];
  }
}

function todayStrings() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, dateLabel: `${mm}·${dd}` };
}

async function main() {
  const client = new Anthropic();
  const { date, dateLabel } = todayStrings();

  console.log(`\n📰 InfoPol fetch-news — ${date}\n`);

  const fetched = await Promise.all(RSS_SOURCES.map(fetchFeed));
  const allItems = fetched.flat();

  console.log(`Obtingudes ${allItems.length} notícies crues de ${RSS_SOURCES.length} fonts`);

  if (allItems.length === 0) {
    console.error('Cap font RSS ha respost. Aturant.');
    process.exit(1);
  }

  const rawBlock = allItems
    .map((item, i) =>
      `[${String(i + 1).padStart(3, '0')}] [${item.source}]\nTítol: ${item.title}\nLink: ${item.link}\nDesc: ${item.desc}`
    )
    .join('\n\n');

  const prompt = `Ets el redactor de notícies de InfoPol, una app per a agents de policia de Catalunya.
Avui és ${date}. Tens les notícies del dia de diverses fonts RSS catalanes, espanyoles i internacionals.

═══════════ NOTÍCIES CRUES ═══════════
${rawBlock}
══════════════════════════════════════

TASCA: Selecciona les 15-20 notícies més rellevants i importants d'avui. Cobreix TOTES les categories que tinguin contingut:

Categories i tags (utilitza exactament aquest format):
• Política Catalunya → tag: "Política · CAT"
• Política Espanya   → tag: "Política · ESP"
• Política Internacional → tag: "Política · INT"
• Economia           → tag: "Economia"
• Cultura i societat → tag: "Cultura"
• Ciència i descobriments → tag: "Ciència"
• Premis i reconeixements → tag: "Premis"
• Esports Catalunya  → tag: "Esports · CAT"
• Esports Espanya    → tag: "Esports · ESP"
• Esports Internacional → tag: "Esports · INT"
• Policial i judicial → tag: "Policial"
• Lleis/normativa    → tag: el codi exacte (ex: "LO 2/2026", "RD 400/2026")

Regles:
- Títol i desc en CATALÀ, concís i informatiu
- Desc: 2-3 frases que expliquin el context i la rellevància per a un agent de policia
- url: el link original (mai null si en tens un)
- id: format ${date.replace(/-/g, '')}_NN (01, 02, 03…)
- NO inventes notícies; usa NOMÉS el que tens a la llista

Retorna ÚNICAMENT un array JSON vàlid, sense cap text addicional ni markdown:
[
  {
    "id": "${date.replace(/-/g, '')}_01",
    "date": "${date}",
    "dateLabel": "${dateLabel}",
    "tag": "Política · CAT",
    "title": "Títol de la notícia en català",
    "desc": "Resum breu en català. Dues o tres frases màxim.",
    "url": "https://..."
  }
]`;

  console.log('Enviant a Claude API per curar i resumir...');

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    console.error('No s\'ha pogut extreure JSON de la resposta de Claude');
    console.error('Resposta:', text.slice(0, 600));
    process.exit(1);
  }

  const newItems = JSON.parse(jsonMatch[0]);
  console.log(`✅ ${newItems.length} notícies curades generades`);

  const dataDir = join(ROOT, 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir);

  let existing = [];
  if (existsSync(NEWS_FILE)) {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf8'));
  }

  // Remove today's entries to avoid duplicates on re-run
  const previous = existing.filter(n => n.date !== date);
  const combined = [...newItems, ...previous].slice(0, MAX_NEWS);

  writeFileSync(NEWS_FILE, JSON.stringify(combined, null, 2), 'utf8');
  console.log(`💾 Desat: ${combined.length} entrades a data/news.json\n`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
