// Càrrega del contingut de fitxes a partir de /content.
// Vite resol `import.meta.glob` en temps de build, així que totes les
// fitxes queden empaquetades amb l'app i disponibles offline.
//
// Es suporten dos formats de fitxa:
//   - .html : es renderitza tal qual (infografia completa, dins d'un iframe).
//   - .md   : es renderitza amb el renderer Markdown propi (fitxa simple).

// Definició dels mòduls (seccions) que apareixen a la pantalla principal.
// L'ordre d'aquest array és el que es veurà al menú.
export type Module = {
  slug: string; // identificador a la URL (ha de coincidir amb la carpeta dins /content)
  title: string; // títol visible
  description: string; // subtítol curt
  accent: string; // classes Tailwind per l'accent de color de la targeta
  icon: string; // icona per defecte del mòdul (fallback si la fitxa no en té)
};

export const MODULES: Module[] = [
  {
    slug: 'ce78',
    title: 'CE78',
    description: 'Constitució Espanyola de 1978.',
    accent: 'from-red-500 to-red-700',
    icon: '⚖️',
  },
  {
    slug: 'codi-penal',
    title: 'Codi penal',
    description: 'Llei Orgànica 10/1995, del Codi penal.',
    accent: 'from-rose-500 to-rose-700',
    icon: '📕',
  },
  {
    slug: 'eac',
    title: 'EAC',
    description: "Estatut d'Autonomia de Catalunya.",
    accent: 'from-yellow-500 to-yellow-700',
    icon: '🏛️',
  },
  {
    slug: 'fcs',
    title: 'FCS',
    description: 'Forces i Cossos de Seguretat.',
    accent: 'from-blue-500 to-blue-700',
    icon: '🛡️',
  },
  {
    slug: 'lecrim',
    title: 'LECrim',
    description: "Llei d'Enjudiciament Criminal.",
    accent: 'from-fuchsia-500 to-fuchsia-700',
    icon: '⚡',
  },
  {
    slug: 'menors',
    title: 'Menors',
    description: 'Normativa relativa a menors.',
    accent: 'from-pink-500 to-pink-700',
    icon: '👦',
  },
  {
    slug: 'municipi',
    title: 'Municipi',
    description: 'Règim municipal i ordenances.',
    accent: 'from-emerald-500 to-emerald-700',
    icon: '🏢',
  },
  {
    slug: 'sc',
    title: 'SC',
    description: 'Seguretat Ciutadana (LOPSC).',
    accent: 'from-slate-500 to-slate-700',
    icon: '🔒',
  },
  {
    slug: 'transit',
    title: 'Trànsit',
    description: 'Trànsit, circulació i seguretat viària.',
    accent: 'from-amber-500 to-amber-700',
    icon: '🚦',
  },
  {
    slug: 'novetats',
    title: 'Novetats normatives',
    description: 'Lleis noves, reformes i actualitzacions normatives recents.',
    accent: 'from-fuchsia-500 to-pink-700',
    icon: '🆕',
  },
];

export type CardKind = 'html' | 'md';

// Idioma del cos d'una fitxa.
export type CardLang = 'es' | 'ca';

// Per a fitxes amb diverses versions d'idioma, guardem el cos per
// idioma. La resta de la fitxa (títol, slug, icona…) és comuna.
export type Card = {
  moduleSlug: string;
  slug: string; // slug "base" sense sufix d'idioma, usat a la URL
  title: string;
  kind: CardKind;
  bodyByLang: Partial<Record<CardLang, string>>; // versions per idioma
  rawByLang: Partial<Record<CardLang, string>>; // fitxer cru per idioma
  pathByLang: Partial<Record<CardLang, string>>; // ruta per idioma
  langs: CardLang[]; // idiomes disponibles, ordenats (es, ca)
  searchText: string; // text pla combinat de TOTES les versions, per a cerca
  icon: string;
};

// Tria el cos d'una fitxa donat un idioma. Si no hi ha versió en aquest
// idioma, retorna l'altre disponible (fallback) i l'idioma realment
// utilitzat. Sempre retorna alguna cosa si la fitxa té com a mínim una
// versió.
export function pickBody(card: Card, locale: CardLang): {
  body: string;
  lang: CardLang;
} {
  if (card.bodyByLang[locale]) {
    return { body: card.bodyByLang[locale]!, lang: locale };
  }
  const fallback = card.langs[0];
  return { body: card.bodyByLang[fallback] ?? '', lang: fallback };
}

// Globs que carreguen TOT el contingut de /content en temps de build.
const mdFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const htmlFiles = import.meta.glob('/content/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Parser minimalista de frontmatter YAML senzill (només `clau: valor`).
// Retorna { data, body }.
function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, front, body] = match;
  const data: Record<string, string> = {};
  for (const line of front.split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    data[key] = value.trim().replace(/^["'](.*)["']$/, '$1');
  }
  return { data, body };
}

// Deriva un títol a partir del primer H1 del cos si no hi ha frontmatter.
function titleFromMarkdown(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

// Extreu un títol d'un document HTML complet: <title> o el primer <h1>.
function titleFromHtml(raw: string, fallback: string): string {
  const t = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t && t[1].trim()) return decodeEntities(stripTags(t[1])).trim();
  const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1].trim()) return decodeEntities(stripTags(h1[1])).trim();
  return fallback;
}

// Extreu un override d'icona d'un HTML via <meta name="infopol-icon" content="…"> o
// <meta name="icon" content="…"> (només quan és un emoji, no una URL).
function iconFromHtmlMeta(raw: string): string | undefined {
  const m = raw.match(
    /<meta\s+name=["'](?:infopol-icon|icon)["']\s+content=["']([^"']+)["']/i,
  );
  if (!m) return undefined;
  const v = m[1].trim();
  // Si sembla una URL / ruta d'imatge, no la fem servir com a "emoji".
  if (/\.(png|jpg|jpeg|svg|ico|webp)$/i.test(v) || v.includes('/')) return undefined;
  return v;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ');
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function fileSlug(name: string): string {
  return name.replace(/\.(md|html)$/i, '');
}

// Separa el sufix d'idioma (".es" o ".ca") del slug del fitxer si hi és.
// Exemple:
//   "vmp-esquema-operativo-policial.es"   →  { slug: "vmp-esquema-operativo-policial", lang: "es" }
//   "viladecans-soroll.ca"                →  { slug: "viladecans-soroll", lang: "ca" }
//   "fitxa-vella-sense-sufix"             →  { slug: "fitxa-vella-sense-sufix", lang: null }
function splitLangFromSlug(rawSlug: string): {
  slug: string;
  lang: CardLang | null;
} {
  const m = rawSlug.match(/^(.+)\.(es|ca)$/i);
  if (m) return { slug: m[1], lang: m[2].toLowerCase() as CardLang };
  return { slug: rawSlug, lang: null };
}

// Detecta l'idioma del text basant-se en marques pràcticament
// inequívoques: les terminacions "-ción" (castellà) vs "-ció" (català).
// Tornem el guanyador per recompte; com a últim recurs, fallback a 'es'
// perquè és l'idioma per defecte de l'app i evita avisos falsos.
function detectLang(text: string): CardLang {
  const cion = (text.match(/ción/g) || []).length;
  const cio = (text.match(/ció[^n]/g) || []).length;
  if (cio > cion) return 'ca';
  if (cion > cio) return 'es';
  // Empat o cap senyal: comprovem caràcters distintius.
  if (/ç/.test(text)) return 'ca';
  if (/ñ/.test(text)) return 'es';
  return 'es';
}

// Taula d'inferència d'icones per paraula clau. L'ordre importa: la
// PRIMERA coincidència guanya. Posem primer les paraules més específiques.
const ICON_HINTS: { kws: string[]; icon: string }[] = [
  // Trànsit / mobilitat — específiques primer
  { kws: ['comunicat 6/2026', 'comunicat 6-2026', 'comunicado 6-2026', 'rd 52/2026', 'rd 52-2026', 'registre nacional vehicles', 'registro nacional vehiculos'], icon: '🛴' },
  { kws: ['vpl', 'vehicle personal lleuger', 'vehiculo personal ligero'], icon: '🛴' },
  { kws: ['vmp', 'patinet'], icon: '🛴' },
  { kws: ['balises v16', 'baliza v16', 'v16'], icon: '🚨' },
  { kws: ['alcoholemia', 'alcoholèmia'], icon: '🍷' },
  { kws: ['cataleg infraccions', 'catàleg infraccions', 'catalogo infracciones'], icon: '🚦' },
  { kws: ['permis de conduir', 'permiso de conducir', 'carnet'], icon: '🪪' },
  { kws: ['tràfic', 'transit', 'trànsit', 'tráfico', 'circulacio', 'circulació'], icon: '🚗' },
  // FCS
  { kws: ['armament', 'arma de foc', "arma de foc", 'reglament d armes', 'reglamento de armas'], icon: '🔫' },
  { kws: ['etica', 'ètica', 'deontologia', 'codi etic', 'codi ètic'], icon: '🎖️' },
  { kws: ['policies locals', 'policia local', 'mossos', 'guardia civil', 'guàrdia civil', 'fcs', 'fcse'], icon: '👮' },
  // Penal
  { kws: ['homicidi', 'assassinat'], icon: '🩸' },
  { kws: ['furt', 'robatori', 'robo', 'hurto'], icon: '🪙' },
  { kws: ['lesions', 'lesiones'], icon: '🤕' },
  { kws: ['codi penal', 'codigo penal', 'delicte', 'delito'], icon: '📕' },
  // LECrim
  { kws: ['atestat', 'atestado'], icon: '📄' },
  { kws: ['detencio', 'detenció', 'detencion'], icon: '🚓' },
  { kws: ['habeas corpus'], icon: '⚖️' },
  { kws: ['lecrim', 'enjudiciament', 'enjuiciamiento'], icon: '📋' },
  // Constitució / drets
  { kws: ['drets fonamentals', 'derechos fundamentales'], icon: '📜' },
  { kws: ['constitucio', 'constitució', 'constitucion', 'ce78', 'ce 78'], icon: '⚖️' },
  // EAC
  { kws: ['generalitat', 'estatut', 'eac', 'catalunya'], icon: '🏛️' },
  // Municipi / ordenances
  { kws: ['civisme'], icon: '🧑‍⚖️' },
  { kws: ['soroll', 'ruido'], icon: '🔊' },
  { kws: ['animal', 'gossos'], icon: '🐕' },
  { kws: ['viladecans'], icon: '🏙️' },
  { kws: ['ordenan', 'ajuntament', 'ayuntamiento', 'municipi', 'municipal', 'lbrl'], icon: '🏢' },
  // Menors
  { kws: ['lorpm', 'menor edat', 'menor de edad', 'menors', 'menores', 'menor'], icon: '👦' },
  // Seguretat ciutadana
  { kws: ['lopsc', 'seguretat ciutadana', 'seguridad ciudadana'], icon: '🛡️' },
];

// Inferència d'icona a partir del títol + un petit tros del cos.
// Retorna `undefined` si no troba cap coincidència (llavors es farà servir
// l'icona del mòdul com a fallback).
function inferIcon(title: string, bodyText: string): string | undefined {
  const hay = normalize(title + ' ' + bodyText.slice(0, 600));
  for (const hint of ICON_HINTS) {
    for (const kw of hint.kws) {
      if (hay.includes(normalize(kw))) return hint.icon;
    }
  }
  return undefined;
}

function resolveIcon(
  moduleSlug: string,
  title: string,
  bodyText: string,
  explicit?: string,
): string {
  if (explicit && explicit.length > 0) return explicit;
  const inferred = inferIcon(title, bodyText);
  if (inferred) return inferred;
  return MODULES.find((m) => m.slug === moduleSlug)?.icon ?? '📄';
}

// Construcció de l'índex de fitxes.
// Agrupem per (moduleSlug, slug-base). Cada fitxa pot tenir versions
// `<base>.es.html` i/o `<base>.ca.html`. Si una fitxa només té un
// idioma, l'altre quedarà undefined (el component mostrarà l'únic
// disponible amb un avís d'idioma).
type CardBuilder = {
  moduleSlug: string;
  slug: string;
  kind: CardKind;
  bodyByLang: Partial<Record<CardLang, string>>;
  rawByLang: Partial<Record<CardLang, string>>;
  pathByLang: Partial<Record<CardLang, string>>;
  titleByLang: Partial<Record<CardLang, string>>;
  searchTextByLang: Partial<Record<CardLang, string>>;
  iconHint?: string;
};

const builders = new Map<string, CardBuilder>();

function ensureBuilder(
  moduleSlug: string,
  slug: string,
  kind: CardKind,
): CardBuilder {
  const key = `${moduleSlug}/${slug}`;
  let b = builders.get(key);
  if (!b) {
    b = {
      moduleSlug,
      slug,
      kind,
      bodyByLang: {},
      rawByLang: {},
      pathByLang: {},
      titleByLang: {},
      searchTextByLang: {},
    };
    builders.set(key, b);
  }
  return b;
}

// Markdown
for (const [path, raw] of Object.entries(mdFiles)) {
  const parts = path.replace(/^\/content\//, '').split('/');
  const moduleSlug = parts[0];
  const file = parts[parts.length - 1];
  const rawSlug = fileSlug(file);
  const { slug, lang: filenameLang } = splitLangFromSlug(rawSlug);
  const { data, body } = parseFrontmatter(raw);
  const lang: CardLang =
    data.lang === 'ca' || data.lang === 'es'
      ? data.lang
      : filenameLang ?? detectLang(body);
  const title = data.title ?? titleFromMarkdown(body, slug);
  const b = ensureBuilder(moduleSlug, slug, 'md');
  b.bodyByLang[lang] = body;
  b.rawByLang[lang] = raw;
  b.pathByLang[lang] = path;
  b.titleByLang[lang] = title;
  b.searchTextByLang[lang] = body;
  if (data.icon) b.iconHint = data.icon;
}

// HTML
for (const [path, raw] of Object.entries(htmlFiles)) {
  const parts = path.replace(/^\/content\//, '').split('/');
  const moduleSlug = parts[0];
  const file = parts[parts.length - 1];
  const rawSlug = fileSlug(file);
  const { slug, lang: filenameLang } = splitLangFromSlug(rawSlug);
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : raw;
  const searchText = decodeEntities(stripTags(bodyHtml))
    .replace(/\s+/g, ' ')
    .trim();
  const lang: CardLang = filenameLang ?? detectLang(searchText);
  const title = titleFromHtml(raw, slug);
  const explicitIcon = iconFromHtmlMeta(raw);
  const b = ensureBuilder(moduleSlug, slug, 'html');
  b.bodyByLang[lang] = raw;
  b.rawByLang[lang] = raw;
  b.pathByLang[lang] = path;
  b.titleByLang[lang] = title;
  b.searchTextByLang[lang] = searchText;
  if (explicitIcon) b.iconHint = explicitIcon;
}

// Convertim els builders en Cards finals.
function buildCard(b: CardBuilder): Card {
  const langs: CardLang[] = (['ca', 'es'] as CardLang[]).filter(
    (l) => b.bodyByLang[l] !== undefined,
  );
  // Títol: prioritzem CA, fallback ES.
  const title =
    b.titleByLang.ca ?? b.titleByLang.es ?? b.slug;
  // Text de cerca: combinem totes les versions perquè la cerca trobi
  // el contingut sigui quin sigui l'idioma actiu.
  const searchText = Object.values(b.searchTextByLang)
    .filter((s): s is string => typeof s === 'string')
    .join('\n');
  // Icona: usem el text de cerca per inferir-la (té text en clar de
  // les versions disponibles).
  const icon = resolveIcon(b.moduleSlug, title, searchText, b.iconHint);
  return {
    moduleSlug: b.moduleSlug,
    slug: b.slug,
    title,
    kind: b.kind,
    bodyByLang: b.bodyByLang,
    rawByLang: b.rawByLang,
    pathByLang: b.pathByLang,
    langs,
    searchText,
    icon,
  };
}

export const ALL_CARDS: Card[] = Array.from(builders.values())
  .map(buildCard)
  .filter((c) => c.langs.length > 0)
  .filter((c) => MODULES.some((m) => m.slug === c.moduleSlug))
  .sort((a, b) => a.title.localeCompare(b.title, 'ca'));

export function getCardsByModule(moduleSlug: string): Card[] {
  return ALL_CARDS.filter((c) => c.moduleSlug === moduleSlug);
}

export function getCard(moduleSlug: string, slug: string): Card | undefined {
  return ALL_CARDS.find((c) => c.moduleSlug === moduleSlug && c.slug === slug);
}

// Cerca global: filtra fitxes per coincidència (no sensible a majúscules/accents)
// en el títol o en el cos text-pla (`searchText`).
export function searchCards(query: string): Card[] {
  const q = normalize(query);
  if (!q) return [];
  return ALL_CARDS.filter(
    (c) => normalize(c.title).includes(q) || normalize(c.searchText).includes(q),
  );
}

// Normalitza text per a la cerca: minúscules i sense accents.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
