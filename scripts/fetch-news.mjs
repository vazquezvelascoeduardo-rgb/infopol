/**
 * Fetch daily news using Claude with web search.
 * Runs via GitHub Actions at 22:00 CET daily.
 * Writes results to src/data/news.js
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const dateLabel = `${mm}·${dd}`;

const PROMPT = `Ets un editor de notícies. Busca les notícies més rellevants d'avui ${dateStr} a Catalunya, Espanya i al món.

Cobreix obligatòriament aquestes categories i zones:
- Política a Catalunya (govern, Generalitat, partits)
- Política a Espanya (govern central, Congrés, partits)
- Política Internacional (UE, món)
- Economia (Espanya o Internacional: mercats, empreses, sectors)
- Esports (especialment futbol, bàsquet, esports catalans)
- Cultura (cinema, música, literatura, teatre)
- Descobriments / Ciència / Tecnologia
- Premis destacats (qualsevol àmbit)
- Successos policials o judicials (Catalunya o Espanya)

Per cada notícia proporciona:
- "tag": UNA d'aquestes etiquetes exactes: Política, Economia, Cultura, Descobriments, Premis, Esports, Policial, Internacional
- "area": UNA d'aquestes: Catalunya, Espanya, Internacional
- "title": títol en català, màx 70 caràcters, concís i informatiu
- "desc": resum breu en català, entre 100 i 180 caràcters, amb el context essencial
- "url": l'URL complet i real de la notícia a un diari de referència

Retorna entre 8 i 12 notícies d'avui. Prioritza notícies del dia, amb fonts fiables (El País, La Vanguardia, Ara, El Nacional, El Mundo, ABC, El Periódico, Nació Digital, VilaWeb, ElConfidencial, 20minutos, RTVE, TV3, etc.).

IMPORTANT: Retorna ÚNICAMENT un array JSON vàlid. Cap text addicional, cap markdown, cap explicació.
Format exacte: [{"tag":"...","area":"...","title":"...","desc":"...","url":"https://..."}]`;

async function runWebSearch() {
  const messages = [{ role: 'user', content: PROMPT }];

  for (let turn = 0; turn < 20; turn++) {
    const response = await client.beta.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages,
      betas: ['web-search-2025-03-05'],
    });

    const textContent = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    if (response.stop_reason === 'end_turn') {
      return textContent;
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content });

      const toolResults = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => {
          // Find web_search_result block for this tool_use if present
          const resultBlock = response.content.find(
            r => r.type === 'web_search_result' && r.tool_use_id === b.id
          );
          return {
            type: 'tool_result',
            tool_use_id: b.id,
            content: resultBlock
              ? JSON.stringify(resultBlock.content ?? resultBlock)
              : 'Search executed.',
          };
        });

      messages.push({ role: 'user', content: toolResults });
    } else {
      // Unexpected stop reason — return whatever text we have
      return textContent;
    }
  }

  throw new Error('Web search loop exceeded maximum iterations');
}

function parseNewsArray(text) {
  // Try to extract JSON array from response (handles markdown fences too)
  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();

  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error(`No JSON array found in response:\n${text.slice(0, 500)}`);
  }

  return JSON.parse(match[0]);
}

async function main() {
  console.log(`[InfoPol] Fetching news for ${dateStr}...`);

  const rawText = await runWebSearch();

  console.log('[InfoPol] Raw response received, parsing...');

  const items = parseNewsArray(rawText);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Empty or invalid news array');
  }

  const news = items.map((item, i) => ({
    id: `gn-${dateStr}-${String(i + 1).padStart(3, '0')}`,
    date: dateStr,
    dateLabel,
    tag: item.tag ?? 'General',
    area: item.area ?? 'Internacional',
    title: String(item.title ?? '').slice(0, 70),
    desc: String(item.desc ?? '').slice(0, 200),
    url: item.url ?? null,
  }));

  const fileContent = `// Actualitzat automàticament cada dia a les 22:00 per GitHub Actions
// Darrera actualització: ${dateStr}
// Format: { id, date, dateLabel, tag, area, title, desc, url }
export const GENERAL_NEWS = ${JSON.stringify(news, null, 2)};
`;

  const outPath = join(__dirname, '../src/data/news.js');
  writeFileSync(outPath, fileContent, 'utf-8');

  console.log(`[InfoPol] ✅ ${news.length} notícies escrites a src/data/news.js`);
  news.forEach((n, i) =>
    console.log(`  ${i + 1}. [${n.area}·${n.tag}] ${n.title}`)
  );
}

main().catch(err => {
  console.error('[InfoPol] ❌ Error:', err.message);
  process.exit(1);
});
