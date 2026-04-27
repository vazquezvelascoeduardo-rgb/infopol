// Gestió de favorits i fitxes recents.
// Tot es desa al localStorage del navegador, no surt mai del dispositiu.
//
// Ús:
//   const { items, isFav, toggle } = useFavorites();
//   const { items: recents, register } = useRecents();
import { useEffect, useState } from 'react';

const FAV_KEY = 'infopol-favs';
const RECENT_KEY = 'infopol-recents';
const MAX_RECENTS = 8;

export type Bookmark = {
  moduleSlug: string;
  slug: string;
  title: string;
  // Per a recents, quan s'ha visitat. Per a favorits no es fa servir.
  visitedAt?: number;
};

function readList(key: string): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is Bookmark =>
      x && typeof x.moduleSlug === 'string' && typeof x.slug === 'string' && typeof x.title === 'string',
    );
  } catch {
    return [];
  }
}

function writeList(key: string, list: Bookmark[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
    // Notifica a altres pestanyes/components.
    window.dispatchEvent(new StorageEvent('storage', { key }));
  } catch { /* localStorage podria estar deshabilitat */ }
}

// ── FAVORITS ────────────────────────────────────────────────────────

export function useFavorites() {
  const [items, setItems] = useState<Bookmark[]>(() => readList(FAV_KEY));

  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === FAV_KEY || e.key === null) {
        setItems(readList(FAV_KEY));
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  function isFav(moduleSlug: string, slug: string): boolean {
    return items.some((it) => it.moduleSlug === moduleSlug && it.slug === slug);
  }

  function toggle(b: Bookmark): boolean {
    const list = readList(FAV_KEY);
    const idx = list.findIndex((it) => it.moduleSlug === b.moduleSlug && it.slug === b.slug);
    let nextList: Bookmark[];
    let added: boolean;
    if (idx >= 0) {
      nextList = [...list.slice(0, idx), ...list.slice(idx + 1)];
      added = false;
    } else {
      nextList = [...list, { moduleSlug: b.moduleSlug, slug: b.slug, title: b.title }];
      added = true;
    }
    writeList(FAV_KEY, nextList);
    setItems(nextList);
    return added;
  }

  function clear() {
    writeList(FAV_KEY, []);
    setItems([]);
  }

  return { items, isFav, toggle, clear };
}

// ── RECENTS ─────────────────────────────────────────────────────────

export function useRecents() {
  const [items, setItems] = useState<Bookmark[]>(() => readList(RECENT_KEY));

  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === RECENT_KEY || e.key === null) {
        setItems(readList(RECENT_KEY));
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Registra una fitxa com a visitada. Si ja era a la llista, la mou
  // al principi i actualitza el timestamp.
  function register(b: Bookmark) {
    const list = readList(RECENT_KEY);
    const filtered = list.filter((it) => !(it.moduleSlug === b.moduleSlug && it.slug === b.slug));
    const next: Bookmark[] = [
      { moduleSlug: b.moduleSlug, slug: b.slug, title: b.title, visitedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENTS);
    writeList(RECENT_KEY, next);
    setItems(next);
  }

  function clear() {
    writeList(RECENT_KEY, []);
    setItems([]);
  }

  return { items, register, clear };
}
