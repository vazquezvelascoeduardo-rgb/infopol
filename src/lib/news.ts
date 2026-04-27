// Llistat de novetats / actualitzacions de l'app.
// Es manté manualment aqui. Quan afegim una fitxa nova, la registrem
// amb la seva data per que aparegui al bloc 'Novetats' de la home.
//
// El sistema de "vist" es simple: guardem a localStorage el timestamp
// de l'ultima visita amb novetats reconegudes. Tot el que tingui
// addedAt > lastSeen es considera 'nou'.
import { useEffect, useState } from 'react';

const SEEN_KEY = 'infopol-news-seen';

export type NewsItem = {
  moduleSlug: string; // p.ex. 'transit', 'codi-penal', 'municipi'
  slug: string;       // slug de la fitxa (sense extensio)
  title: string;
  // ISO date (YYYY-MM-DD) de quan s'ha afegit la fitxa.
  addedAt: string;
};

// Llistat manual. Ordenat de mes recent a mes antic.
export const NEWS: NewsItem[] = [
  {
    moduleSlug: 'transit',
    slug: 'balizas-v16',
    title: 'Balises V16 (obligatorietat 2026)',
    addedAt: '2026-04-27',
  },
  {
    moduleSlug: 'codi-penal',
    slug: 'lo-1-2026-multireincidencia',
    title: 'LO 1/2026 de multireincidència',
    addedAt: '2026-04-27',
  },
  {
    moduleSlug: 'municipi',
    slug: 'ordenanca-platges-viladecans',
    title: "Ordenança d'us de les Platges de Viladecans",
    addedAt: '2026-04-27',
  },
];

function getLastSeen(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const v = window.localStorage.getItem(SEEN_KEY);
    if (!v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

function setLastSeen(ts: number) {
  try {
    window.localStorage.setItem(SEEN_KEY, String(ts));
  } catch { /* silent */ }
}

// Hook per al badge: nombre de novetats encara no vistes.
export function useNewCount(): number {
  const [count, setCount] = useState<number>(() => {
    const lastSeen = getLastSeen();
    return NEWS.filter((n) => new Date(n.addedAt).getTime() > lastSeen).length;
  });

  useEffect(() => {
    function sync() {
      const lastSeen = getLastSeen();
      setCount(NEWS.filter((n) => new Date(n.addedAt).getTime() > lastSeen).length);
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return count;
}

// Marca totes les novetats actuals com a vistes.
export function markNewsSeen() {
  setLastSeen(Date.now());
  // Notifica
  try {
    window.dispatchEvent(new StorageEvent('storage', { key: SEEN_KEY }));
  } catch { /* silent */ }
}
