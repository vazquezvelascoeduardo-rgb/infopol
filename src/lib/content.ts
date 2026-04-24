// Càrrega del contingut de fitxes Markdown a partir de /content.
// Vite resol `import.meta.glob` en temps de build, així que totes les
// fitxes queden empaquetades amb l'app i disponibles offline.

// Definició dels mòduls (seccions) que apareixen a la pantalla principal.
// L'ordre d'aquest array és el que es veurà al menú.
export type Module = {
  slug: string; // identificador a la URL (ha de coincidir amb la carpeta dins /content)
  title: string; // títol visible
  description: string; // subtítol curt
  accent: string; // classes Tailwind per l'accent de color de la targeta
};

export const MODULES: Module[] = [
  {
    slug: 'transit',
    title: 'Trànsit',
    description: 'Normativa, infraccions i procediments de trànsit.',
    accent: 'from-blue-500 to-blue-700',
  },
  {
    slug: 'ordenances-viladecans',
    title: 'Ordenances Viladecans',
    description: 'Ordenances municipals de Viladecans.',
    accent: 'from-emerald-500 to-emerald-700',
  },
  {
    slug: 'dret-penal',
    title: 'Dret penal',
    description: 'Delictes, faltes i procediment penal.',
    accent: 'from-rose-500 to-rose-700',
  },
  {
    slug: 'dret-administratiu',
    title: 'Dret administratiu',
    description: 'Procediment, recursos i règim jurídic.',
    accent: 'from-amber-500 to-amber-700',
  },
  {
    slug: 'policia-administrativa',
    title: 'Policia administrativa',
    description: 'Activitats, llicències i inspeccions.',
    accent: 'from-violet-500 to-violet-700',
  },
  {
    slug: 'lopsc',
    title: 'LOPSC',
    description: 'Llei Orgànica de Protecció de la Seguretat Ciutadana.',
    accent: 'from-slate-500 to-slate-700',
  },
];

export type Card = {
  moduleSlug: string;
  slug: string; // derivat del nom de fitxer (sense .md)
  title: string;
  body: string; // cos Markdown (sense frontmatter)
  raw: string; // fitxer complet, útil per a cerca
  path: string; // ruta relativa al projecte
};

// Glob que carrega TOT el contingut de /content en temps de build.
// `as: 'raw'` ens dona el text pla; `eager: true` els fa disponibles sincrònicament.
const rawFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Parser minimalista de frontmatter YAML senzill (només `clau: valor`).
// Retorna { data, body } amb `title` com a camp principal.
function parseFrontmatter(raw: string): { title?: string; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { body: raw };
  const [, front, body] = match;
  const data: Record<string, string> = {};
  for (const line of front.split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    // Traiem cometes simples o dobles si n'hi ha.
    data[key] = value.trim().replace(/^["'](.*)["']$/, '$1');
  }
  return { title: data.title, body };
}

// Deriva un títol a partir del primer H1 del cos si no hi ha frontmatter.
function titleFromBody(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

// Construïm l'índex de totes les fitxes.
export const ALL_CARDS: Card[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    // path és tipus "/content/ordenances-viladecans/xxxx.md"
    const parts = path.replace(/^\/content\//, '').split('/');
    const moduleSlug = parts[0];
    const file = parts[parts.length - 1];
    const slug = file.replace(/\.md$/, '');
    const { title, body } = parseFrontmatter(raw);
    const finalTitle = title ?? titleFromBody(body, slug);
    return {
      moduleSlug,
      slug,
      title: finalTitle,
      body,
      raw,
      path,
    };
  })
  // Ignorem fitxers dins de carpetes que no siguin un mòdul reconegut.
  .filter((c) => MODULES.some((m) => m.slug === c.moduleSlug))
  .sort((a, b) => a.title.localeCompare(b.title, 'ca'));

// Obté les fitxes d'un mòdul concret.
export function getCardsByModule(moduleSlug: string): Card[] {
  return ALL_CARDS.filter((c) => c.moduleSlug === moduleSlug);
}

// Obté una fitxa concreta pel seu mòdul + slug.
export function getCard(moduleSlug: string, slug: string): Card | undefined {
  return ALL_CARDS.find((c) => c.moduleSlug === moduleSlug && c.slug === slug);
}

// Cerca global: filtra fitxes per coincidència (no sensible a majúscules/accents)
// en el títol o en el cos.
export function searchCards(query: string): Card[] {
  const q = normalize(query);
  if (!q) return [];
  return ALL_CARDS.filter(
    (c) => normalize(c.title).includes(q) || normalize(c.body).includes(q),
  );
}

// Normalitza text per a la cerca: minúscules i sense accents.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
