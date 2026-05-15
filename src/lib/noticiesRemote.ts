// Carregador de notícies remotes des de Supabase.
//
// Les notícies "manuals" viuen al fitxer noticies.ts (constant NOTICIES).
// Les notícies "automàtiques" les insereix l'Edge Function `generate-news`
// a la taula public.noticies. Aquest fitxer combina les dues fonts.
//
// Comportament:
//   - Si Supabase no està configurat o falla, només es retorna NOTICIES local.
//   - Mai bloquegem el render: el primer render mostra el contingut local i
//     quan arriba el remot s'afegeix sense flicker.
//   - Deduplicació per `slug` (les remotes guanyen si col·lideixen).

import { useEffect, useState } from 'react';
import { supabase, isBackendEnabled } from './supabase';
import { NOTICIES, type Noticia, type NoticiaCategoria } from './noticies';

type RemoteRow = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  published_at: string;
  source: string | null;
  source_url: string | null;
  tags: string[] | null;
  category: string | null;
  featured: boolean | null;
  image: string | null;
  image_alt: string | null;
  linked_module: string | null;
  linked_slug: string | null;
};

function mapRow(r: RemoteRow): Noticia {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    body: r.body,
    publishedAt: r.published_at,
    source: r.source ?? undefined,
    sourceUrl: r.source_url ?? undefined,
    tags: r.tags ?? undefined,
    category: (r.category as NoticiaCategoria | null) ?? 'noticies',
    featured: r.featured ?? false,
    image: r.image ?? undefined,
    imageAlt: r.image_alt ?? undefined,
    linkedTo: r.linked_module && r.linked_slug
      ? { moduleSlug: r.linked_module, slug: r.linked_slug }
      : undefined,
  };
}

/** Combina locals + remotes deduplicant per slug i ordenant per data desc. */
function merge(local: Noticia[], remote: Noticia[]): Noticia[] {
  const map = new Map<string, Noticia>();
  for (const n of local) map.set(n.slug, n);
  for (const n of remote) map.set(n.slug, n); // remotes guanyen en col·lisió
  return Array.from(map.values()).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
}

// Cache en memòria per evitar re-fetch a cada navegació dins la mateixa sessió.
let cache: Noticia[] | null = null;
let inFlight: Promise<Noticia[]> | null = null;

async function fetchRemote(): Promise<Noticia[]> {
  if (!isBackendEnabled || !supabase) return [];
  const { data, error } = await supabase
    .from('noticies')
    .select('slug,title,summary,body,published_at,source,source_url,tags,category,featured,image,image_alt,linked_module,linked_slug')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return (data as RemoteRow[]).map(mapRow);
}

/**
 * Retorna sempre [...NOTICIES, ...remotes]. El primer render torna només
 * les locals; quan arriba el remot, fa re-render amb la llista combinada.
 */
export function useNoticiesAll(): Noticia[] {
  const [all, setAll] = useState<Noticia[]>(() =>
    cache ? cache : merge(NOTICIES, []),
  );

  useEffect(() => {
    if (cache) {
      setAll(cache);
      return;
    }
    if (!inFlight) {
      inFlight = fetchRemote().then((remote) => {
        const combined = merge(NOTICIES, remote);
        cache = combined;
        return combined;
      });
    }
    let cancelled = false;
    inFlight.then((combined) => {
      if (!cancelled) setAll(combined);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return all;
}

/** Cerca una notícia per slug entre locals + remotes (re-render quan arriba la remota). */
export function useNoticia(slug: string): { noticia: Noticia | undefined; all: Noticia[] } {
  const all = useNoticiesAll();
  const noticia = all.find((n) => n.slug === slug);
  return { noticia, all };
}
