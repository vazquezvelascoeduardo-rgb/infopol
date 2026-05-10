// Càrrega del temari de Mossos d'Esquadra (resum oficial 38a Promoció,
// set. 2024) a partir de /content/mossos-temari/{a,b,c}/<slug>.md.
//
// Estructura paral·lela a `lib/content.ts` però simplificada: un sol
// idioma (català), sense HTML, només Markdown.
//
// Cada fitxa correspon a un tema i porta frontmatter:
//   ---
//   title: "Tema A.1 — Història de Catalunya (part I)"
//   tema: "A.1"
//   ambit: "A"
//   lang: ca
//   ---

export type MossosAmbit = 'A' | 'B' | 'C';

export type MossosTema = {
  ambit: MossosAmbit; // 'A', 'B', 'C'
  tema: string;       // 'A.1', 'B.3', etc.
  slug: string;       // ex: 'a1-historia-de-catalunya-part-i'
  title: string;      // títol complet
  shortTitle: string; // títol sense "Tema X.Y — "
  body: string;       // markdown
  searchText: string; // pla per cerca
};

// Metadades per àmbit (mostrades a l'índex i les capçaleres).
export const AMBIT_META: Record<MossosAmbit, {
  label: string;
  short: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
}> = {
  A: {
    label: "Àmbit A — Coneixements de l'entorn",
    short: 'Àmbit A',
    desc: 'Història, geografia, llengua, entorn social i TIC.',
    icon: '🏛️',
    color: '#E89A1C',
    bg: '#FFF1D2',
  },
  B: {
    label: 'Àmbit B — Institucional',
    short: 'Àmbit B',
    desc: "Organització política, administrativa i jurídica de Catalunya, l'Estat i la UE.",
    icon: '⚖️',
    color: '#2F6BD8',
    bg: '#EAF1FE',
  },
  C: {
    label: 'Àmbit C — Seguretat',
    short: 'Àmbit C',
    desc: 'Marc legal de la seguretat, coordinació policial i codi deontològic.',
    icon: '🛡️',
    color: '#C13030',
    bg: '#FFE4E4',
  },
};

const mdFiles = import.meta.glob('/content/mossos-temari/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

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
    data[kv[1]] = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return { data, body };
}

function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/[*_>#\-]+/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const TEMES: MossosTema[] = (() => {
  const list: MossosTema[] = [];
  for (const [path, raw] of Object.entries(mdFiles)) {
    const m = path.match(/\/content\/mossos-temari\/([abc])\/(.+)\.md$/i);
    if (!m) continue;
    const ambit = m[1].toUpperCase() as MossosAmbit;
    const slug = m[2];
    const { data, body } = parseFrontmatter(raw);
    const title = data.title || slug;
    const shortTitle = title.replace(/^Tema\s+[A-E]\.\d+\s*[—-]\s*/i, '').trim();
    const tema = data.tema || '';
    list.push({
      ambit,
      tema,
      slug,
      title,
      shortTitle,
      body,
      searchText: plainText(body),
    });
  }
  // Ordre per número de tema dins de cada àmbit.
  list.sort((a, b) => {
    if (a.ambit !== b.ambit) return a.ambit.localeCompare(b.ambit);
    const na = parseInt(a.tema.split('.')[1] || '0', 10);
    const nb = parseInt(b.tema.split('.')[1] || '0', 10);
    return na - nb;
  });
  return list;
})();

export function getTemesByAmbit(ambit: MossosAmbit): MossosTema[] {
  return TEMES.filter((t) => t.ambit === ambit);
}

export function getTema(ambit: MossosAmbit, slug: string): MossosTema | undefined {
  return TEMES.find((t) => t.ambit === ambit && t.slug === slug);
}
