// Gestió del progrés de tests al localStorage.
// Per cada tema, desem un Set de IDs de preguntes ja respostes (siguin
// correctes o no). Es una llista única que es "consumeix" — quan no
// queda cap pregunta no resposta, el sistema demana reiniciar el tema.
//
// També oferim un hook reactiu que sincronitza estats entre pestanyes
// via storage events.
import { useEffect, useState } from 'react';

const KEY_PREFIX = 'infopol-test-progress-';

function readSet(slug: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + slug);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function writeSet(slug: string, set: Set<string>) {
  try {
    window.localStorage.setItem(KEY_PREFIX + slug, JSON.stringify([...set]));
    window.dispatchEvent(new StorageEvent('storage', { key: KEY_PREFIX + slug }));
  } catch { /* silent */ }
}

export function getAnsweredIds(slug: string): Set<string> {
  return readSet(slug);
}

export function markAnswered(slug: string, ids: string[]) {
  const set = readSet(slug);
  for (const id of ids) set.add(id);
  writeSet(slug, set);
}

export function resetProgress(slug: string) {
  writeSet(slug, new Set());
}

export function useTopicProgress(slug: string) {
  const [answered, setAnswered] = useState<Set<string>>(() => readSet(slug));

  useEffect(() => {
    function sync(e: StorageEvent) {
      if (e.key === KEY_PREFIX + slug || e.key === null) {
        setAnswered(readSet(slug));
      }
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [slug]);

  return {
    answered,
    answeredCount: answered.size,
    reset: () => resetProgress(slug),
  };
}
