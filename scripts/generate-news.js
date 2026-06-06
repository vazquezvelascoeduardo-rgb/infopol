/**
 * Generador diari de notícies per a InfoPol.
 * Usa l'API d'Anthropic amb web_search per buscar i resumir notícies.
 * S'executa via GitHub Actions cada dia a les 22h.
 *
 * Requereix: ANTHROPIC_API_KEY en variables d'entorn.
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'public', 'data', 'noticias.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date();
const DATE_ISO = today.toISOString().split('T')[0];
const DATE_LABEL = `${String(today.getMonth() + 1).padStart(2, '0')}·${String(today.getDate()).padStart(2, '0')}`;

const SYSTEM_PROMPT = `Ets el redactor de notícies de l'app InfoPol, una aplicació per a policies de Catalunya.
Escrius en català, de manera concisa i professional.
Els títols han de ser directes (màx 85 caràcters).
Els resums han de ser de 1-2 frases (màx 160 caràcters).
Sempre retornes JSON vàlid sense markdown ni text addicional.`;

const USER_PROMPT = `Avui és ${DATE_ISO}. Fes una cerca exhaustiva de les notícies més importants del dia a:

ÀMBITS GEOGRÀFICS:
- Catalunya (prioritat màxima)
- Espanya
- Internacional

CATEGORIES que has de cobrir (com a mínim 1-2 notícies per categoria):
- politica → Política (decisions governamentals, eleccions, partits)
- economia → Economia (mercat laboral, empreses, finances, habitatge)
- cultura → Cultura (cinema, teatre, música, patrimoni, llengua)
- descobriments → Descobriments (ciència, tecnologia, medi ambient, salut)
- premis → Premis (guardons literaris, esportius, científics, honorífics)
- esports → Esports (futbol, bàsquet, atletisme, ciclisme, tennis)
- policial → Policial/Legal (detencions, judicis, operacions, normativa)

Busca a fonts de qualitat: Ara, La Vanguardia, El País, El Periódico, 3/24, TV3, BBC, Reuters, Sport, Mundo Deportivo.

Retorna EXACTAMENT aquest JSON (sense cap text fora del JSON):
{
  "articles": [
    {
      "tag": "Política",
      "category": "politica",
      "geo": "Catalunya",
      "title": "Títol curt i directe de la notícia",
      "desc": "Resum d'1-2 frases que explica el fet principal i el context.",
      "url": "https://url-de-la-noticia-original.com/article"
    }
  ]
}

Les categories tag vàlides (en majúscules): Política, Economia, Cultura, Descobriments, Premis, Esports, Policial
Els geo vàlids: Catalunya, Espanya, Internacional
Genera entre 12 i 18 notícies. Verifica que les URLs siguin reals i actuals.`;

async function runAgenticLoop(messages) {
  const allMessages = [...messages];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: allMessages,
    });

    allMessages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock ? textBlock.text : '';
    }

    if (response.stop_reason === 'tool_use') {
      const toolResults = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: '' }));
      allMessages.push({ role: 'user', content: toolResults });
      continue;
    }

    throw new Error(`Stop reason inesperat: ${response.stop_reason}`);
  }
}

function parseArticles(rawText) {
  const match = rawText.match(/\{[\s\S]*"articles"[\s\S]*\}/);
  if (!match) throw new Error('No s\'ha trobat JSON a la resposta');

  const data = JSON.parse(match[0]);
  if (!Array.isArray(data.articles)) throw new Error('El JSON no té el camp articles');

  return data.articles.map((a, i) => ({
    id: `${DATE_ISO.replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
    date: DATE_ISO,
    dateLabel: DATE_LABEL,
    tag: a.tag || 'Notícia',
    category: a.category || 'cultura',
    geo: a.geo || 'Internacional',
    title: (a.title || '').slice(0, 90),
    desc: (a.desc || '').slice(0, 180),
    url: a.url || null,
  }));
}

async function main() {
  console.log(`\n📰 Generant notícies InfoPol per al ${DATE_ISO}...\n`);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Falta la variable d\'entorn ANTHROPIC_API_KEY');
  }

  const rawText = await runAgenticLoop([
    { role: 'user', content: USER_PROMPT },
  ]);

  const articles = parseArticles(rawText);

  mkdirSync(join(ROOT, 'public', 'data'), { recursive: true });

  const output = { lastUpdated: DATE_ISO, articles };
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`✅ ${articles.length} notícies guardades a public/data/noticias.json`);
  articles.forEach(a => console.log(`  [${a.geo}] ${a.tag}: ${a.title}`));
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
