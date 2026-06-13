#!/usr/bin/env node
/**
 * Genera les notícies diàries d'InfoPol usant Claude API amb cerca web.
 * Requereix: ANTHROPIC_API_KEY en variables d'entorn.
 * Execució: node scripts/generate-news.js
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/data/news.json');
const MODEL = 'claude-sonnet-4-6';
const MAX_KEEP = 90; // màxim d'items anteriors a conservar

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function todayLabel() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { dateStr: d.toISOString().split('T')[0], dateLabel: `${mm}·${dd}` };
}

function loadExisting(dateStr) {
  if (!existsSync(NEWS_FILE)) return [];
  try {
    const all = JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
    // Exclou les d'avui (es regeneren) i limita les anteriors
    return all.filter(n => n.date !== dateStr).slice(0, MAX_KEEP);
  } catch {
    return [];
  }
}

function extractJson(text) {
  // Extreu el primer array JSON vàlid del text
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    // Intent de reparació bàsic
    const cleaned = match[0].replace(/,\s*]/, ']');
    try { return JSON.parse(cleaned); } catch { return null; }
  }
}

async function callClaudeWithTools(prompt) {
  const messages = [{ role: 'user', content: prompt }];
  const tools = [{ type: 'web_search_20250305', name: 'web_search' }];

  // Bucle de tool use: Claude pot fer múltiples cerques web
  for (let turn = 0; turn < 8; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      tools,
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      // Resposta final — extraiem el text
      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.text || '';
    }

    if (response.stop_reason === 'tool_use') {
      // Claude vol fer cerques web — les afegim com a tool_result
      messages.push({ role: 'assistant', content: response.content });
      const toolResults = response.content
        .filter(b => b.type === 'tool_use')
        .map(b => ({
          type: 'tool_result',
          tool_use_id: b.id,
          content: JSON.stringify({ query: b.input?.query || '', status: 'executed' }),
        }));
      messages.push({ role: 'user', content: toolResults });
      continue;
    }

    // stop_reason desconegut → sortim
    break;
  }
  return '';
}

async function generateNews() {
  const { dateStr, dateLabel } = todayLabel();
  console.log(`\n📰 Generant notícies InfoPol per ${dateStr}…\n`);

  const prompt = `Ets un periodista especialitzat que redacta en català.
La data d'avui és ${dateStr}.

Busca les notícies més importants del dia sobre:
- CATALUNYA: política autonòmica, consell executiu, partits, cultura, economia local
- ESPANYA: govern central, congrés, partits nacionals, economia, tribunals
- INTERNACIONAL: Europa, conflictes, economia global, ciència, esports internacionals

Categories a cobrir (intenta almenys 2 notícies per categoria):
• Política
• Economia
• Cultura
• Descobriments
• Premis
• Esports
• Succés  (fets policials, judicials, detencions, sentències)
• Legislació (lleis, decrets, normativa nova)

Per cada notícia proporciona:
- Un títol curt i clar (màx 80 caràcters)
- Un resum de 1-2 frases (màx 160 caràcters) en català
- L'URL exacta de la font original

Retorna ÚNICAMENT un JSON array sense cap text addicional ni markdown:
[
  {
    "id": "n${dateStr.replace(/-/g, '')}01",
    "date": "${dateStr}",
    "dateLabel": "${dateLabel}",
    "tag": "Política",
    "scope": "Catalunya",
    "title": "Títol de la notícia",
    "desc": "Breu resum de la notícia en català.",
    "url": "https://font.exemple/noticia"
  }
]

Cerca almenys 12-15 notícies variades. Usa fonts fiables: VilaWeb, CCMA/3Cat, El Punt Avui, La Vanguardia, El País, El Mundo, Marca, AS, Reuters, BBC, EFE.
Els valors de "tag" han de ser exactament un d'aquests: Política, Economia, Cultura, Descobriments, Premis, Esports, Succés, Legislació.
Els valors de "scope" han de ser exactament un d'aquests: Catalunya, Espanya, Internacional.`;

  let raw = '';
  try {
    raw = await callClaudeWithTools(prompt);
  } catch (err) {
    console.error('❌ Error cridant Claude API:', err.message);
    process.exit(1);
  }

  const items = extractJson(raw);
  if (!items || items.length === 0) {
    console.error('❌ No s\'ha pogut parsejar el JSON de notícies.');
    console.error('Resposta rebuda:\n', raw.slice(0, 500));
    process.exit(1);
  }

  // Assegura IDs únics
  const newItems = items.map((item, i) => ({
    ...item,
    id: item.id || `n${dateStr.replace(/-/g, '')}${String(i + 1).padStart(2, '0')}`,
  }));

  const previous = loadExisting(dateStr);
  const merged = [...newItems, ...previous];

  mkdirSync(dirname(NEWS_FILE), { recursive: true });
  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(`✅ ${newItems.length} notícies noves guardades.`);
  console.log(`   Total al fitxer: ${merged.length} items.`);
  console.log(`   Fitxer: ${NEWS_FILE}\n`);

  newItems.forEach((n, i) => {
    console.log(`  ${i + 1}. [${n.tag}/${n.scope}] ${n.title}`);
  });
}

generateNews().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
