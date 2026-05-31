/**
 * Script d'actualització de notícies per a InfoPol.
 * Execució diària via GitHub Actions a les 22h (hora peninsular).
 * Usa l'API d'Anthropic amb cerca web per obtenir notícies reals.
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../src/data/news.json');
const DRY_RUN = process.env.DRY_RUN === 'true';

// Format de data d'avui
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const dateLabel = `${mm}·${dd}`;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    'anthropic-beta': 'web-search-2025-03-05',
  },
});

const PROMPT = `Ets el redactor de notícies de InfoPol, una app per a policies en actiu i opositors de Mossos d'Esquadra a Catalunya.

Avui és ${dateStr}. Fes una cerca exhaustiva de les notícies més importants de les últimes hores en:

ÀMBITS GEOGRÀFICS: Catalunya → Espanya → Internacional (en ordre de prioritat)

CATEGORIES OBLIGATÒRIES (busca 1-2 notícies de cada):
- Política: governs, partits, eleccions, declaracions rellevants
- Economia: mercats, empreses, indicadors econòmics, ocupació
- Esport: futbol (especialment Barça, Espanyol, Girona), atletisme, bàsquet
- Policial/Judicial: operacions policials importants, sentències, detencions rellevants, crims
- Cultura: premis, estrenes, esdeveniments culturals, personatges
- Ciència: descobriments, recerca, tecnologia, salut pública

Prioritza notícies d'avui mateix (${dateStr}). Busca en mitjans com La Vanguardia, El País, RTVE, TV3, ElNacional.cat, NacióDigital, El Mundo, etc.

RETORNA EXCLUSIVAMENT un array JSON vàlid (sense text addicional, sense blocs de codi, sense \`\`\`). Cada element:
{
  "id": "n001",
  "date": "${dateStr}",
  "dateLabel": "${dateLabel}",
  "tag": "Política",
  "title": "Titular clar i concís en català (màx 80 caràcters)",
  "desc": "Resum en 1-2 frases en català, directe, informatiu (màx 180 caràcters)",
  "url": "https://url-article-original-verificat.com/..."
}

TAGS permesos (usa exactament un): Política, Economia, Esport, Policial, Judicial, Cultura, Ciència, Internacional, Catalunya, Espanya
Genera entre 10 i 14 notícies. L'array comença amb [ i acaba amb ].`;

async function run() {
  console.log(`\n🔍 InfoPol News Bot — ${dateStr}`);
  console.log('   Buscant notícies amb Anthropic web search...\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: PROMPT }],
  });

  console.log(`   stop_reason: ${response.stop_reason}`);
  console.log(`   blocs resposta: ${response.content.map(b => b.type).join(', ')}`);

  // Recull tots els blocs de text (la resposta final)
  const textContent = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  if (!textContent.trim()) {
    throw new Error('La resposta no conté text. Blocs: ' + response.content.map(b => b.type).join(', '));
  }

  // Extreu el JSON (pot venir embolicat en markdown)
  let jsonStr = textContent.trim();

  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (arrayMatch) jsonStr = arrayMatch[0];

  let items;
  try {
    items = JSON.parse(jsonStr);
  } catch (e) {
    console.error('❌ JSON invàlid rebut:\n', jsonStr.slice(0, 500));
    throw e;
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Array buit o invàlid');
  }

  // Normalitza i valida cada notícia
  const news = items
    .filter(item => item.title && item.desc)
    .map((item, i) => ({
      id: `n${String(i + 1).padStart(3, '0')}`,
      date: item.date || dateStr,
      dateLabel: item.dateLabel || dateLabel,
      tag: item.tag || 'General',
      title: String(item.title).slice(0, 100),
      desc: String(item.desc).slice(0, 220),
      url: item.url || null,
    }));

  console.log(`\n✅ ${news.length} notícies obtingudes:\n`);
  news.forEach(n => {
    console.log(`  [${n.tag.padEnd(12)}] ${n.title}`);
    if (n.url) console.log(`               ${n.url}`);
  });

  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN — no es guarda el fitxer.');
    return;
  }

  writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2) + '\n', 'utf-8');
  console.log(`\n💾 Guardat a src/data/news.json`);
}

run().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
