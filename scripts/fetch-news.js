#!/usr/bin/env node
/**
 * Cerca diària de notícies via Claude API amb web_search.
 * S'executa cada dia a les 22:00 (Europe/Madrid).
 * Cerca notícies de: Catalunya, Espanya, Internacional.
 * Categories: Política, Economia, Cultura, Esports, Policial, Judicial, Ciència, Internacional.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/news.json');
const MAX_TOTAL_NEWS = 60; // màxim d'articles a conservar

const VALID_CATEGORIES = ['Política', 'Economia', 'Cultura', 'Esports', 'Policial', 'Judicial', 'Ciència', 'Internacional', 'Normativa'];
const VALID_SCOPES = ['Catalunya', 'Espanya', 'Internacional'];

function todayLabel() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}·${dd}`;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function loadNews() {
  if (!fs.existsSync(NEWS_FILE)) return [];
  return JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
}

function saveNews(news) {
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), 'utf8');
}

function nextId(existing) {
  const nums = existing.map(n => parseInt(n.id.replace('n', ''), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `n${String(max + 1).padStart(3, '0')}`;
}

async function fetchNews() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[fetch-news] ERROR: ANTHROPIC_API_KEY no definida.');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const today = new Date().toLocaleDateString('ca-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Europe/Madrid',
  });

  const prompt = `Avui és ${today}. Ets un periodista d'un diari català.

Busca les notícies MÉS IMPORTANTS d'avui en tres àmbits:

**1. CATALUNYA** (4-5 notícies): política catalana, economia, cultura, successos policials i judicials, esports.
**2. ESPANYA** (3-4 notícies): política nacional, economia, judicial, esports rellevants.
**3. INTERNACIONAL** (2-3 notícies): geopolítica, descobriments científics, premis internacionals, esports globals.

Per cada notícia retorna un objecte JSON amb exactament aquests camps:
- "title": titular en CATALÀ, clar i concís (màx 90 caràcters)
- "desc": resum breu en CATALÀ (màx 220 caràcters), destacant el fet principal
- "tag": UNA de les opcions: Política / Economia / Cultura / Esports / Policial / Judicial / Ciència / Internacional / Normativa
- "scope": UNA de les opcions: Catalunya / Espanya / Internacional
- "url": URL directa i real a la notícia original (no la portada, sinó l'article concret)
- "source": nom curt del mitjà (ex: "Ara", "El País", "Reuters", "BBC")

Retorna ÚNICAMENT un JSON array vàlid amb entre 9 i 12 notícies. Sense text addicional. Sense markdown. Exemple de format:
[{"title":"...","desc":"...","tag":"Política","scope":"Catalunya","url":"https://...","source":"Ara"},...]`;

  console.log(`[fetch-news] Iniciant cerca per ${today}...`);

  let response;
  try {
    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    });
  } catch (err) {
    console.error('[fetch-news] Error cridant la API:', err.message);
    throw err;
  }

  // Extraiem el text final del model
  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) {
    console.error('[fetch-news] No s\'ha rebut text de resposta.');
    return [];
  }

  // Parsegem el JSON — el model pot afegir ``` per error, ho netejem
  let raw = textBlock.text.trim();
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let articles;
  try {
    articles = JSON.parse(raw);
  } catch (err) {
    console.error('[fetch-news] Error parsejant JSON:', err.message);
    console.error('[fetch-news] Resposta rebuda:', raw.slice(0, 500));
    return [];
  }

  if (!Array.isArray(articles)) {
    console.error('[fetch-news] La resposta no és un array.');
    return [];
  }

  // Validem i normalitzem cada notícia
  const dateISO = todayISO();
  const dateLabel = todayLabel();
  const existing = loadNews();
  const newItems = [];

  for (const a of articles) {
    if (!a.title || !a.desc || !a.tag) continue;

    const tag = VALID_CATEGORIES.includes(a.tag) ? a.tag : 'Internacional';
    const scope = VALID_SCOPES.includes(a.scope) ? a.scope : 'Internacional';

    newItems.push({
      id: nextId([...existing, ...newItems]),
      date: dateISO,
      dateLabel,
      tag,
      category: tag.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
      scope,
      title: String(a.title).slice(0, 90),
      desc: String(a.desc).slice(0, 220),
      source: a.source || '',
      url: a.url || null,
    });
  }

  // Prepend noves notícies i limitem el total
  const merged = [...newItems, ...existing].slice(0, MAX_TOTAL_NEWS);
  saveNews(merged);

  console.log(`[fetch-news] Afegides ${newItems.length} notícies. Total: ${merged.length}.`);
  return newItems;
}

fetchNews().catch(err => {
  console.error('[fetch-news] Error fatal:', err.message);
  process.exit(1);
});
