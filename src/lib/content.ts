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
];

export type CardKind = 'html' | 'md';

export type Card = {
  moduleSlug: string;
  slug: string; // derivat del nom de fitxer (sense extensió)
  title: string;
  kind: CardKind;
  body: string; // cos (HTML complet o Markdown sense frontmatter)
  raw: string; // fitxer complet, útil per a cerca
  path: string; // ruta relativa al projecte
  searchText: string; // versió text pla del cos, usada per cerca
  icon: string; // icona emoji de la fitxa
};

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

// Taula d'inferència d'icones per paraula clau. L'ordre importa: la
// PRIMERA coincidència guanya. Posem primer les paraules més específiques.
const ICON_HINTS: { kws: string[]; icon: string }[] = [
  // Trànsit / mobilitat — específiques primer
  { kws: ['vmp', 'patinet'], icon: '🛴' },
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

// Construïm les fitxes Markdown.
const mdCards: Card[] = Object.entries(mdFiles).map(([path, raw]) => {
  const parts = path.replace(/^\/content\//, '').split('/');
  const moduleSlug = parts[0];
  const file = parts[parts.length - 1];
  const slug = fileSlug(file);
  const { data, body } = parseFrontmatter(raw);
  const finalTitle = data.title ?? titleFromMarkdown(body, slug);
  const icon = resolveIcon(moduleSlug, finalTitle, body, data.icon);
  return {
    moduleSlug,
    slug,
    title: finalTitle,
    kind: 'md',
    body,
    raw,
    path,
    searchText: body,
    icon,
  };
});

// Construïm les fitxes HTML.
const htmlCards: Card[] = Object.entries(htmlFiles).map(([path, raw]) => {
  const parts = path.replace(/^\/content\//, '').split('/');
  const moduleSlug = parts[0];
  const file = parts[parts.length - 1];
  const slug = fileSlug(file);
  const title = titleFromHtml(raw, slug);
  // Text pla per cerca i inferència d'icona.
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : raw;
  const searchText = decodeEntities(stripTags(bodyHtml))
    .replace(/\s+/g, ' ')
    .trim();
  const explicitIcon = iconFromHtmlMeta(raw);
  const icon = resolveIcon(moduleSlug, title, searchText, explicitIcon);
  return {
    moduleSlug,
    slug,
    title,
    kind: 'html',
    body: raw,
    raw,
    path,
    searchText,
    icon,
  };
});

// Índex global: HTML + Markdown, ordenat per títol en català.
export const ALL_CARDS: Card[] = [...htmlCards, ...mdCards]
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
