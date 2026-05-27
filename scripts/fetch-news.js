#!/usr/bin/env node
// Runs daily via GitHub Actions at 22:00 CET.
// Requires: ANTHROPIC_API_KEY environment variable.
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().split('T')[0];
const [, month, day] = today.split('-');
const dateLabel = `${month}·${day}`;

const PROMPT = `Avui és ${today}. Fes una recerca exhaustiva de les notícies més importants d'avui a Catalunya, Espanya i el món.

Busca en CADA una d'aquestes categories:

POLÍTICA:
- Catalunya: Generalitat, Parlament, partits catalans, institucions, consellers, president
- Espanya: Govern central, Congrés, Senat, partits nacionals, president del govern
- Internacional: UE, EEUU, Rússia, Ucraïna, Orient Mitjà, Àsia

ECONOMIA:
- Mercat de valors espanyol (IBEX-35), empreses catalanes i espanyoles
- Habitatge, preus, inflació, atur, exportacions
- Mercats internacionals, Fed, BCE, criptomonedes

POLICIAL / LEGAL:
- Operacions policials rellevants (Mossos, Policia Nacional, Guàrdia Civil)
- Detencions destacades, judicis importants, sentències del TC o TS
- Canvis legislatius que afectin la seguretat pública

ESPORTS:
- FC Barcelona (futbol masculí i femení), Espanyol, altres equips catalans
- Selecció espanyola, LaLiga, Champions League
- Formula 1, MotoGP, tennis, ciclisme, bàsquet NBA/ACB

CULTURA:
- Cinema, música, art, teatre, literatura catalana i espanyola
- Exposicions, festivals, estrenes destacades

CIÈNCIA / DESCOBRIMENTS:
- Investigació científica, medicina, tecnologia
- Descobriments espacials, medi ambient, canvi climàtic

PREMIS:
- Guardons internacionals, nacionals i catalans
- Reconeixements artístics, científics, esportius, humanitaris

Per CADA notícia proporciona:
- tag: etiqueta curta descriptiva en català (ex: "Política · Catalunya", "Esports · F1", "Ciència", "Policial · Mossos")
- category: exactament un de: "politica" | "economia" | "policial" | "esports" | "cultura" | "ciencia" | "premis"
- scope: exactament un de: "catalunya" | "espanya" | "internacional"
- title: titular curt i directe en català (màx 80 caràcters)
- desc: resum de 1-2 frases en català explicant el context i la importància (màx 160 caràcters)
- url: URL real i verificada de la notícia (si no trobes URL fiable, posa null)

Retorna un array JSON amb MÍNIM 18 notícies (2-3 per categoria mínim).
Ordena-les per rellevància i impacte.

IMPORTANT: Retorna ÚNICAMENT el JSON, sense cap text addicional ni markdown.
Format exacte: [{"tag":"...","category":"...","scope":"...","title":"...","desc":"...","url":"..."}]`;

async function fetchNewsItems() {
  console.log(`\n📰 InfoPol News Bot — ${today}\n`);
  console.log('Searching for today\'s news...\n');

  const messages = [{ role: 'user', content: PROMPT }];
  let response;
  let iterations = 0;

  while (iterations < 20) {
    iterations++;
    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
    });

    if (response.stop_reason === 'end_turn') break;

    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const queries = toolUseBlocks.map(b => b.input?.query).filter(Boolean);
      console.log(`  🔍 ${queries.join(' | ')}`);

      messages.push({ role: 'assistant', content: response.content });
      const toolResults = toolUseBlocks.map(b => ({
        type: 'tool_result',
        tool_use_id: b.id,
        content: '',
      }));
      messages.push({ role: 'user', content: toolResults });
    } else {
      break;
    }
  }

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text block in final response');

  let raw = textBlock.text.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  // Handle cases where Claude wraps the array in an object
  if (raw.startsWith('{')) {
    const parsed = JSON.parse(raw);
    const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
    if (key) raw = JSON.stringify(parsed[key]);
  }

  const items = JSON.parse(raw);
  console.log(`\n✅ Got ${items.length} news items`);

  return items.map((item, i) => ({
    id: `n${String(i + 1).padStart(3, '0')}_${today.replace(/-/g, '')}`,
    date: today,
    dateLabel,
    tag: String(item.tag || '').slice(0, 60),
    category: item.category || 'politica',
    scope: item.scope || 'espanya',
    title: String(item.title || '').slice(0, 120),
    desc: String(item.desc || '').slice(0, 200),
    url: item.url && item.url !== 'null' ? item.url : null,
  }));
}

async function main() {
  try {
    const newItems = await fetchNewsItems();

    // Load and keep last 7 days of existing news
    const newsPath = join(__dirname, '../src/data/news.js');
    let existingItems = [];

    if (existsSync(newsPath)) {
      const content = readFileSync(newsPath, 'utf-8');
      const match = content.match(/export const NEWS = (\[[\s\S]*?\]);/);
      if (match) {
        try { existingItems = JSON.parse(match[1]); } catch (e) {
          console.warn('Could not parse existing news.js, starting fresh');
        }
      }
    }

    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 7);
    const oldItems = existingItems.filter(n => {
      if (!n.date) return false;
      return new Date(n.date) >= cutoff && n.date !== today;
    });

    const allItems = [...newItems, ...oldItems];

    const output = [
      '// Auto-generated by scripts/fetch-news.js — do not edit manually',
      `// Last updated: ${today}`,
      `export const NEWS = ${JSON.stringify(allItems, null, 2)};`,
      '',
    ].join('\n');

    writeFileSync(newsPath, output, 'utf-8');
    console.log(`\n📁 Saved ${allItems.length} items (${newItems.length} new + ${oldItems.length} kept from last 7 days)\n`);

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    if (err.message.includes('JSON')) {
      console.error('  → The model did not return valid JSON. Check the prompt or model output.');
    }
    process.exit(1);
  }
}

main();
