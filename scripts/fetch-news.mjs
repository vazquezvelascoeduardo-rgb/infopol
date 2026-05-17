/**
 * Cerca les notícies del dia usant Claude amb cerca web i actualitza server/data/news-daily.json.
 * Executat diàriament a les 22:00 (hora Espanya) via GitHub Actions.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../server/data');
const newsFile = join(dataDir, 'news-daily.json');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

let existingNews = [];
try {
  existingNews = JSON.parse(readFileSync(newsFile, 'utf8'));
} catch {
  existingNews = [];
}

const today = new Date().toISOString().split('T')[0];
const [, month, day] = today.split('-');
const dateLabel = `${month}·${day}`;

const maxId = existingNews.reduce((max, n) => {
  const num = parseInt((n.id || '').replace('nd', '')) || 0;
  return num > max ? num : max;
}, 0);

const client = new Anthropic();

const systemPrompt = `Ets un periodista expert en informació general que escriu en català formal.
Redacta titulars precisos i resums breus i entenedors.
Centra't en fets recents, contrastats i rellevants.
No inventes URLs: usa les fonts reals que has trobat a la cerca.`;

const userPrompt = `Cerca i recull les notícies més importants d'avui, ${today}, a Catalunya, Espanya i al món.

Cobreix obligatòriament aquestes categories (almenys una notícia per categoria):
1. Política (Catalunya i Espanya)
2. Política Internacional (conflictes, diplomàcia, eleccions)
3. Economia (mercats, empreses, ocupació)
4. Esports (futbol, F1, tennis, bàsquet, ciclisme)
5. Successos (crims rellevants, detencions, sentències judicials)
6. Cultura i entreteniment (cinema, música, art, literatura)
7. Ciència i tecnologia (descobriments, innovació, salut)
8. Premis o reconeixements destacats (si n'hi ha avui)

Retorna exactament entre 8 i 10 notícies en format JSON array. Cada element:
{
  "category": "politica|internacional|economia|esports|successos|cultura|ciencia|premis",
  "tag": "Etiqueta en català màx 12 car. (ex: 'Catalunya', 'Esports', 'Successos'...)",
  "title": "Titular concís en català, màx 70 caràcters",
  "desc": "Resum de 1-2 frases en català, màx 150 caràcters",
  "url": "URL completa i real de l'article font"
}

IMPORTANT: Retorna ÚNICAMENT l'array JSON. Cap text addicional, cap markdown.`;

console.log(`\n📰 Cercant notícies per a ${today}...\n`);

let response;
try {
  response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
} catch (err) {
  console.error('Error cridant la API:', err.message);
  process.exit(1);
}

let rawText = '';
for (const block of response.content) {
  if (block.type === 'text') rawText += block.text;
}

let fetchedItems = [];
try {
  const match = rawText.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No s\'ha trobat un array JSON a la resposta');
  fetchedItems = JSON.parse(match[0]);
} catch (e) {
  console.error('Error parsejant JSON:', e.message);
  console.error('Resposta rebuda:', rawText.slice(0, 800));
  process.exit(1);
}

const newItems = fetchedItems.map((item, idx) => ({
  id: `nd${String(maxId + idx + 1).padStart(3, '0')}`,
  date: today,
  dateLabel,
  category: item.category || 'general',
  tag: item.tag || 'General',
  title: item.title || '',
  desc: item.desc || '',
  url: item.url || null,
}));

// Elimina les notícies d'avui si ja existien (re-execució) i afegeix les noves
const filtered = existingNews.filter(n => n.date !== today);
const updated = [...newItems, ...filtered].slice(0, 250);

writeFileSync(newsFile, JSON.stringify(updated, null, 2));

console.log(`✓ ${newItems.length} notícies afegides per a ${today}:\n`);
newItems.forEach(n => console.log(`  [${n.tag}] ${n.title}\n   → ${n.url || 'sense URL'}\n`));
