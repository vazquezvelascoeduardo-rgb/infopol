/**
 * fetch-news.mjs
 * Executa cada dia a les 22:00 CET via GitHub Actions.
 * Obté notícies de Catalunya, Espanya i internacional per categories
 * i actualitza server/news.json.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = join(__dirname, '../server/news.json');
const MAX_TOTAL_NEWS = 60;
const MAX_PER_CATEGORY = 2;

// ── Fonts RSS ──────────────────────────────────────────────────────────────

const FEEDS = [
  // Catalunya
  { url: 'https://www.vilaweb.cat/rss/', region: 'cat', name: 'Vilaweb' },
  { url: 'https://www.elnacional.cat/ca/rss', region: 'cat', name: 'El Nacional' },
  // Espanya
  { url: 'https://www.20minutos.es/rss/', region: 'esp', name: '20minutos' },
  { url: 'https://www.elmundo.es/rss/portada.xml', region: 'esp', name: 'El Mundo' },
  { url: 'https://www.elconfidencial.com/rss/espana.xml', region: 'esp', name: 'El Confidencial' },
  // Internacional
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml', region: 'int', name: 'BBC Mundo' },
  { url: 'https://feeds.reuters.com/reuters/es-topNews', region: 'int', name: 'Reuters ES' },
  // Esports
  { url: 'https://www.marca.com/rss/portada.xml', region: 'esp', name: 'Marca' },
  { url: 'https://www.sport.es/rss/portada.xml', region: 'cat', name: 'Sport' },
];

// ── Regles de categorització ──────────────────────────────────────────────

const CATEGORIES = [
  {
    tag: 'Política · Cat',
    keywords: [
      'catalun', 'generalitat', 'parlament', 'independen', 'convergèn',
      'esquerra republican', 'junts per', 'conseller', 'mossos d\'esquadra',
      'csp', 'psc ', 'barcelona alcald', 'presidenta generalitat', 'aragonès',
      'illa govern', 'diputació barcelona',
    ],
    priority: 3,
  },
  {
    tag: 'Esports',
    keywords: [
      'barça', 'fc barcelona', 'futbol club barcelona', 'champions league',
      ' liga ', 'real madrid', 'atlètic', 'atletico de madrid', 'tennis',
      'basket', 'nba', 'motogp', 'fórmula 1', 'formula 1', 'ciclism',
      'atletism', 'mundial futbol', 'copa del rei', 'eurocopa', 'olimpíad',
    ],
    priority: 2,
  },
  {
    tag: 'Successos',
    keywords: [
      'detingut', 'detenido', 'detención', 'arrestat', 'arrest',
      ' mort ', 'muerto', 'morts', 'muertos', 'accident mortal',
      'robatori', 'robo', 'atraco', 'judici', 'juicio', 'condena',
      'condemna', 'assassinat', 'asesinato', 'homicidi', 'terroris',
      'narcotràfic', 'narcotráfico', 'presó', 'prisión', 'fiscal ',
      'tribunal suprem', 'tribunal superior', 'jutjat',
    ],
    priority: 2,
  },
  {
    tag: 'Internacional',
    keywords: [
      'ucraïna', 'ukraine', 'rúsia', 'rusia', 'guerra', 'conflicte armat',
      'trump', 'biden', 'estados unidos', 'eeuu', 'onu', 'otan', 'nato',
      'gaza', 'israel', 'palestin', 'xi jinping', 'china', 'japó', 'japón',
      'corea del nord', 'iran', 'líbia', 'síria', 'sèrbia', 'g7', 'g20',
      'unió europea', 'unión europea', 'comissió europea', 'cimera',
    ],
    priority: 2,
  },
  {
    tag: 'Economia',
    keywords: [
      'economia', 'econom', 'pib', 'inflació', 'inflacion', 'atur', 'desempleo',
      'empresa', 'borsa', 'bolsa', 'ibex', 'euro ', 'pressupost', 'presupuesto',
      'salari minim', 'salario mínimo', 'hipoteca', 'immobi', 'banc centra',
      'banco central', 'crisi', 'crisis econom', 'pib', 'deute', 'deuda',
      'inversió', 'inversión', 'start-up', 'startup', 'mercat laboral',
    ],
    priority: 2,
  },
  {
    tag: 'Cultura',
    keywords: [
      'cinema', 'pelicula', 'pel·lícula', 'film', 'oscar', 'goya', 'bafta',
      'música', 'concert', 'gira', 'teatre', 'teatro', 'exposici', 'premi',
      'premio', 'nobel', 'booker', 'planeta', 'art contemporani',
      'museu', 'museo', 'festival cine', 'festival música', 'escriptor',
      'escritor', 'novel·la', 'novela', 'editorial', 'biblioteca',
    ],
    priority: 2,
  },
  {
    tag: 'Ciència',
    keywords: [
      'ciència', 'ciencia', 'investigació', 'investigacion', 'descobrim',
      'descubrimiento', 'científic', 'cientifico', 'espai ', 'espacio ',
      'nasa', 'esa ', 'intel·ligència artificial', 'inteligencia artificial',
      ' ia ', ' ai ', 'robot', 'virus', 'vacuna', 'canvi climàtic',
      'canvio climático', 'escalfament', 'espècie nova', 'fòssil',
    ],
    priority: 2,
  },
  {
    tag: 'Política · ESP',
    keywords: [
      'pedro sánchez', 'moncloa', 'congreso de los diputados', 'senado',
      'ministerio', 'gobierno de españa', 'partido popular', ' psoe ',
      ' vox ', ' sumar ', ' podemos ', 'feijóo', 'abascal',
      'cortes generales', 'rey felip', 'rey felipe', 'junta electoral',
    ],
    priority: 1,
  },
];

// ── Parseig RSS ───────────────────────────────────────────────────────────

function extractTag(xml, tag) {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (plain) return plain[1].replace(/<[^>]+>/g, '').trim();
  return '';
}

function extractLink(itemXml) {
  // <link> pot ser un element buit o un element amb href
  const href = itemXml.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (href) return href[1];
  const inner = itemXml.match(/<link>([^<]+)<\/link>/i);
  if (inner) return inner[1].trim();
  // guid com a URL
  const guid = itemXml.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([^<]+)<\/guid>/i);
  if (guid) return guid[1].trim();
  return '';
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'");
}

function cleanDesc(raw) {
  const text = raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 220 ? text.substring(0, 217) + '…' : text;
}

function parseItems(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const c = m[1];
    const title = decodeEntities(extractTag(c, 'title'));
    const rawDesc = extractTag(c, 'description') || extractTag(c, 'summary') || '';
    const desc = decodeEntities(cleanDesc(rawDesc));
    const link = extractLink(c) || extractTag(c, 'guid');
    const pubDate = extractTag(c, 'pubDate') || extractTag(c, 'published') || extractTag(c, 'updated');
    if (title && link && title.length > 5) {
      items.push({ title, desc, link, pubDate });
    }
  }
  return items;
}

// ── Cerca i categorització ────────────────────────────────────────────────

async function fetchFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { 'User-Agent': 'InfoPol-NewsBot/1.0' },
      signal: AbortSignal.timeout(12_000),
    });
    if (!resp.ok) {
      console.warn(`  ⚠  ${feed.name}: HTTP ${resp.status}`);
      return [];
    }
    const xml = await resp.text();
    const items = parseItems(xml);
    console.log(`  ✓  ${feed.name}: ${items.length} articles`);
    return items.map(item => ({ ...item, sourceName: feed.name, region: feed.region }));
  } catch (err) {
    console.warn(`  ✗  ${feed.name}: ${err.message}`);
    return [];
  }
}

function categorize(title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  let best = { tag: 'Política · ESP', score: 0 };
  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (text.includes(kw)) score += cat.priority;
    }
    if (score > best.score) best = { tag: cat.tag, score };
  }
  return best.tag;
}

function isRecent(pubDate) {
  if (!pubDate) return true;
  try {
    const age = Date.now() - new Date(pubDate).getTime();
    return age < 36 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

// ── Formatació ────────────────────────────────────────────────────────────

function toISODate(pubDate) {
  try { return new Date(pubDate || Date.now()).toISOString().split('T')[0]; }
  catch { return new Date().toISOString().split('T')[0]; }
}

function toDateLabel(pubDate) {
  const d = pubDate ? new Date(pubDate) : new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}·${dd}`;
}

// ── Principal ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🗞  InfoPol · Cerca de notícies diàries\n');

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const allArticles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  console.log(`\n  Total articles trobats: ${allArticles.length}`);

  const recent = allArticles.filter(a => isRecent(a.pubDate));
  console.log(`  Articles de les últimes 36 h: ${recent.length}`);

  // Eliminar duplicats per títol similar
  const seen = new Set();
  const unique = recent.filter(a => {
    const key = a.title.toLowerCase().substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Categoritzar i seleccionar
  const byCategory = {};
  for (const a of unique) {
    const cat = categorize(a.title, a.desc);
    if (!byCategory[cat]) byCategory[cat] = [];
    if (byCategory[cat].length < MAX_PER_CATEGORY) byCategory[cat].push(a);
  }

  const selected = Object.values(byCategory).flat();
  console.log(`  Seleccionats: ${selected.length} notícies en ${Object.keys(byCategory).length} categories\n`);

  if (selected.length === 0) {
    console.log('  Cap notícia nova. Sortint sense canvis.');
    return;
  }

  // Generar entrades
  const today = new Date().toISOString().split('T')[0];
  const timestamp = today.replace(/-/g, '');
  const newEntries = selected.map((a, i) => ({
    id: `n_${timestamp}_${String(i + 1).padStart(3, '0')}`,
    date: toISODate(a.pubDate),
    dateLabel: toDateLabel(a.pubDate),
    tag: categorize(a.title, a.desc),
    title: a.title,
    desc: a.desc || a.title,
    url: a.link,
  }));

  // Carregar existents i fusionar
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(NEWS_FILE, 'utf-8'));
  } catch {
    existing = [];
  }

  // Eliminar entrades antigues del mateix dia per evitar duplicats en re-execucions
  const filtered = existing.filter(n => !n.id.startsWith(`n_${timestamp}_`));
  const merged = [...newEntries, ...filtered].slice(0, MAX_TOTAL_NEWS);

  writeFileSync(NEWS_FILE, JSON.stringify(merged, null, 2), 'utf-8');

  console.log(`✅ news.json actualitzat: ${newEntries.length} noves + ${filtered.length} anteriors = ${merged.length} total\n`);
  newEntries.forEach(n => {
    console.log(`  [${n.tag}] ${n.title.substring(0, 70)}`);
  });
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
