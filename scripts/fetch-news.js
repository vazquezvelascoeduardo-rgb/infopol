#!/usr/bin/env node
// scripts/fetch-news.js
// Cerca les notícies del dia usant Claude amb web search i actualitza src/data/news.json.
// Requereix: ANTHROPIC_API_KEY en variables d'entorn.
// Ús: node scripts/fetch-news.js

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const NEWS_PATH = join(ROOT, 'src/data/news.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().split('T')[0];
const [, mm, dd] = today.split('-');
const dateLabel = `${mm}·${dd}`;

const SYSTEM = `Ets el redactor de notícies de l'app InfoPol, una aplicació per a agents dels Mossos d'Esquadra.

Tasca: busca i recopila les notícies MÉS RELLEVANTS del dia ${today} cobrint TOTES aquestes categories:
1. POLÍTICA — Catalunya (Generalitat, Parlament), Espanya (Congrés, govern), Internacional
2. ECONOMIA — Borsa (Ibex, BCE), empreses, laboral, habitatge, finances
3. JUDICIAL — Sentències importants, processos penals, detencions rellevants, corrupció
4. SEGURETAT — Operatius policials, bandes criminals, successos greus, emergències
5. ESPORTS — Futbol (lliga, Champions, Mundial si és temporada), tennis, ciclisme, atletisme
6. CULTURA — Premis (Goya, Planeta, literaris), cinema, música, art, festivals, exposicions
7. CIÈNCIA — Descobriments mèdics, tecnologia, medi ambient, recerca
8. SOCIETAT — Clima, turisme, educació, sanitat, habitatge

Per cada notícia, retorna EXACTAMENT aquest objecte JSON:
{
  "tag": "<etiqueta curta en majúscules, màx 20 caràcters, ex: MUNDIAL 2026, JUDICIAL·ESP, CALOR·CAT>",
  "title": "<titular breu i directe en català, màx 85 caràcters>",
  "desc": "<resum de 2 frases en català que expliqui el context i el més rellevant, màx 200 caràcters>",
  "url": "<URL real i funcional de la font original de la notícia, OBLIGATORI>",
  "categoria": "<una d'aquestes exactament: política|economia|judicial|seguretat|esports|cultura|ciència|societat>",
  "ambit": "<una d'aquestes exactament: catalunya|espanya|internacional>"
}

Retorna ÚNICAMENT un JSON array vàlid (sense text addicional fora del JSON) amb entre 10 i 15 notícies.
Ordena per rellevància (les més importants primer).
Prioritza notícies de Catalunya, però cobreix també Espanya i internacional.
IMPORTANT: Cada notícia ha de tenir una URL real i funcional — no inventes URLs.`;

async function callClaude() {
  const messages = [
    {
      role: 'user',
      content: `Busca les notícies més importants d'avui ${today} per a l'app InfoPol. Necessito entre 10 i 15 notícies de totes les categories (política, economia, judicial, seguretat, esports, cultura, ciència, societat) de Catalunya, Espanya i internacional. Inclou sempre una URL real de la font original.`,
    },
  ];

  const createOpts = {
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    system: SYSTEM,
    messages,
  };

  const reqOpts = { headers: { 'anthropic-beta': 'web-search-2025-03-05' } };

  let response = await client.messages.create(createOpts, reqOpts);

  // Gestiona la conversa si retorna tool_use (per si el web search és client-side)
  while (response.stop_reason === 'tool_use') {
    messages.push({ role: 'assistant', content: response.content });
    const toolResults = response.content
      .filter(b => b.type === 'tool_use')
      .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: '{}' }));
    messages.push({ role: 'user', content: toolResults });
    response = await client.messages.create({ ...createOpts, messages }, reqOpts);
  }

  return response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');
}

async function main() {
  console.log(`📰  InfoPol News Bot — ${today}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌  Falta ANTHROPIC_API_KEY a les variables d\'entorn.');
    process.exit(1);
  }

  let existing = [];
  try {
    existing = JSON.parse(readFileSync(NEWS_PATH, 'utf8'));
  } catch {
    console.log('ℹ️  news.json no existeix o no és vàlid, es crearà de nou.');
  }

  const maxId = existing.reduce(
    (m, n) => Math.max(m, parseInt(n.id.replace('n', ''), 10) || 0),
    0
  );

  console.log('🔍  Buscant notícies amb Claude + web search...');
  const text = await callClaude();

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('❌  No s\'ha trobat cap JSON array a la resposta de Claude.');
    console.error('Resposta rebuda:\n', text.slice(0, 600));
    process.exit(1);
  }

  let fresh;
  try {
    fresh = JSON.parse(match[0]);
  } catch (e) {
    console.error('❌  Error parsejant el JSON:', e.message);
    process.exit(1);
  }

  const numbered = fresh.map((n, i) => ({
    id: `n${String(maxId + i + 1).padStart(3, '0')}`,
    date: today,
    dateLabel,
    tag: n.tag || 'NOTÍCIA',
    title: n.title || '',
    desc: n.desc || '',
    url: n.url || null,
    categoria: n.categoria || 'societat',
    ambit: n.ambit || 'espanya',
  }));

  // Conserva els últims 90 articles (aprox. 1 setmana)
  const merged = [...numbered, ...existing].slice(0, 90);
  writeFileSync(NEWS_PATH, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`✅  ${numbered.length} notícies noves afegides | ${merged.length} en total`);
  console.log('📄  Títols d\'avui:');
  numbered.forEach((n, i) => console.log(`   ${i + 1}. [${n.tag}] ${n.title}`));
}

main().catch(err => {
  console.error('❌  Error inesperat:', err.message);
  process.exit(1);
});
