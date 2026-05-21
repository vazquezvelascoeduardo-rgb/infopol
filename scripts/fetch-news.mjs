#!/usr/bin/env node
/**
 * Cerca les notícies del dia i actualitza src/data/news.json.
 * Requereix ANTHROPIC_API_KEY a l'entorn.
 * Usat pel GitHub Action daily-news.yml (22:00 CEST).
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../src/data/news.json');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const dateLabel = `${mm}·${dd}`;

const PROMPT = `Avui és ${dateStr}. Busca les notícies més importants del dia a Catalunya, Espanya i l'àmbit internacional.

Cobreix TOTES aquestes categories:
- POLÍTICA: política nacional, autonòmica (Catalunya), internacional
- ECONOMIA: mercats, empreses, laboral, energia, preus
- CULTURA: arts, cinema, literatura, música, gastronomia, patrimoni
- CIÈNCIA: descobriments, investigació, tecnologia, salut, medi ambient
- PREMIS: guardons, reconeixements, premis internacionals
- ESPORTS: futbol (Barça, Espanyol, Girona, selecció), bàsquet, tennis, ciclisme, atletisme
- SUCCÉS: successos policials, detencions rellevants, sentències judicials, accidents greus

Per a cada notícia indica l'àmbit geogràfic:
- Catalunya (notícies específicament catalanes)
- Espanya (notícies d'abast estatal)
- Internacional (notícies de l'estranger)

Per a cada notícia:
1. Titular clar i concís (màx 85 caràcters)
2. Resum breu de 1-2 frases (màx 150 caràcters)
3. URL de la font original (diari, agència de notícies)

Selecciona entre 10 i 15 notícies representatives del dia d'avui ${dateStr}.

Retorna ÚNICAMENT un array JSON, sense cap text addicional ni bloc de codi:
[
  {
    "tag": "POLÍTICA",
    "scope": "Catalunya",
    "title": "Titular breu de la notícia",
    "desc": "Breu resum de la notícia en 1-2 frases.",
    "url": "https://font.exemple.com/noticia"
  }
]`;

async function fetchNews() {
  console.log(`\n🔍 Buscant notícies per a ${dateStr}...\n`);

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 8096,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content: PROMPT }],
  });

  let newsItems = [];
  for (const block of response.content) {
    if (block.type !== 'text') continue;
    const text = block.text.trim();
    // Try to extract JSON array (handles both bare JSON and fenced code blocks)
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        newsItems = JSON.parse(match[0]);
        break;
      } catch {
        const cleaned = match[0].replace(/,(\s*[}\]])/g, '$1');
        try { newsItems = JSON.parse(cleaned); break; } catch {}
      }
    }
  }

  if (!newsItems.length) {
    console.error('❌ No s\'han pogut extreure notícies de la resposta.');
    process.exit(1);
  }

  // Load existing news
  let existing = [];
  if (existsSync(NEWS_FILE)) {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  }

  // Remove any entries already saved for today (allows re-running)
  existing = existing.filter(n => n.date !== dateStr);

  // Compute next ID
  const maxId = existing.reduce((m, n) => {
    const num = parseInt((n.id || '').replace('n', '') || '0');
    return Math.max(m, isNaN(num) ? 0 : num);
  }, 0);

  const newEntries = newsItems
    .filter(item => item.title && item.desc)
    .map((item, i) => ({
      id: `n${String(maxId + i + 1).padStart(3, '0')}`,
      date: dateStr,
      dateLabel,
      tag: (item.tag || 'GENERAL').toUpperCase().trim(),
      scope: item.scope || 'Espanya',
      title: (item.title || '').trim(),
      desc: (item.desc || '').trim(),
      url: item.url || null,
    }));

  // Keep 60 days rolling window
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 60);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  const merged = [...newEntries, ...existing].filter(n => n.date >= cutoffStr);

  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2));

  console.log(`✅ ${newEntries.length} notícies afegides per a ${dateStr}\n`);
  newEntries.forEach(n => console.log(`  [${n.tag}/${n.scope}] ${n.title}`));
  console.log();
}

fetchNews().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
