import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BUNDLED_CONTENT, BUNDLED_VERSION, CONTENT_KEYS } from './bundled';

// ─────────────────────────────────────────────────────────────────────────────
// Capa de contingut OTA ("over the air").
//
// L'app llegeix TOT el contingut d'aquí, mai directament de src/data/*.
// Ordre de prioritat:
//   1. Contingut remot descarregat en aquesta sessió
//   2. Contingut remot guardat a la memòria cau del dispositiu
//   3. Contingut inclòs al binari (src/content/bundled.js)
//
// Publicar contingut nou = pujar un content.json amb `version` més alt.
// No cal ni build ni revisió d'App Store / Google Play.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_KEY = 'infopol.content.cache.v1';
const CHECK_KEY = 'infopol.content.lastCheck.v1';
const URL_OVERRIDE_KEY = 'infopol.content.url'; // per provar una font alternativa

// Refresca com a molt un cop cada 30 min en arrencades successives.
const MIN_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12000;

/** Fonts de contingut, per ordre. La primera que respongui bé, guanya. */
export const CONTENT_SOURCES = [
  import.meta.env?.VITE_CONTENT_URL,
  'https://raw.githubusercontent.com/vazquezvelascoeduardo-rgb/infopol/main/content/content.json',
].filter(Boolean);

function safeStorage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    localStorage.setItem('__probe__', '1');
    localStorage.removeItem('__probe__');
    return localStorage;
  } catch {
    return null;
  }
}

function readCache() {
  const store = safeStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidBundle(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(bundle) {
  const store = safeStorage();
  if (!store) return;
  try {
    store.setItem(CACHE_KEY, JSON.stringify(bundle));
    store.setItem(CHECK_KEY, String(Date.now()));
  } catch {
    // Quota exhaurida: seguim amb el contingut en memòria, no és fatal.
  }
}

function markChecked() {
  const store = safeStorage();
  if (!store) return;
  try {
    store.setItem(CHECK_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function lastCheckedAt() {
  const store = safeStorage();
  if (!store) return 0;
  const raw = store.getItem(CHECK_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

/**
 * Validació mínima: ha de ser un objecte amb `version` numèric i almenys una
 * clau de contingut reconeguda. Així un fitxer corrupte o una pàgina d'error
 * mai substitueix el contingut bo.
 */
export function isValidBundle(b) {
  if (!b || typeof b !== 'object' || Array.isArray(b)) return false;
  if (typeof b.version !== 'number' || !Number.isFinite(b.version)) return false;
  return CONTENT_KEYS.some(k => b[k] != null);
}

/** Fusiona el remot sobre el local: les claus absents al remot no es perden. */
function mergeBundle(remote) {
  const merged = { ...BUNDLED_CONTENT };
  for (const key of CONTENT_KEYS) {
    if (remote[key] != null) merged[key] = remote[key];
  }
  merged.version = remote.version;
  merged.updatedAt = remote.updatedAt || BUNDLED_CONTENT.updatedAt;
  merged.label = remote.label || 'Contingut actualitzat';
  merged.source = remote.source;
  return merged;
}

async function fetchJson(url, signal) {
  const bust = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${bust}t=${Date.now()}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Prova totes les fonts i retorna el primer bundle vàlid. */
export async function fetchRemoteContent() {
  const store = safeStorage();
  const override = store?.getItem(URL_OVERRIDE_KEY);
  const sources = [override, ...CONTENT_SOURCES].filter(Boolean);

  let lastError = null;
  for (const url of sources) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    try {
      const json = await fetchJson(url, ctrl.signal);
      if (!isValidBundle(json)) throw new Error('Format de contingut no vàlid');
      return { ...json, source: url };
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error('Cap font de contingut disponible');
}

/** Missatges d'error entenedors: mai ensenyem l'error cru del navegador. */
function friendlyError(err) {
  const raw = String(err?.message || err || '');
  if (err?.name === 'AbortError' || /abort/i.test(raw)) return 'La descàrrega ha trigat massa';
  if (/format/i.test(raw)) return 'El contingut descarregat no és vàlid';
  if (/^HTTP 4/.test(raw)) return 'Contingut no trobat al servidor';
  if (/^HTTP 5/.test(raw)) return 'El servidor no respon';
  return 'Sense connexió';
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    const cached = readCache();
    return cached && cached.version > BUNDLED_VERSION ? mergeBundle(cached) : BUNDLED_CONTENT;
  });
  // idle · checking · updated · current · error
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [checkedAt, setCheckedAt] = useState(() => lastCheckedAt());
  const inFlight = useRef(false);

  const refresh = useCallback(async ({ force = false } = {}) => {
    if (inFlight.current) return;
    if (!force && Date.now() - lastCheckedAt() < MIN_CHECK_INTERVAL_MS) {
      // Ja s'ha comprovat fa poc: no repetim la crida, però reflectim que el
      // contingut està al dia en lloc de deixar l'estat com a "pendent".
      setStatus(s => (s === 'idle' ? 'current' : s));
      return;
    }

    inFlight.current = true;
    setStatus('checking');
    setError(null);
    try {
      const remote = await fetchRemoteContent();
      markChecked();
      setCheckedAt(Date.now());
      if (remote.version > content.version) {
        const merged = mergeBundle(remote);
        writeCache(remote);
        setContent(merged);
        setStatus('updated');
      } else {
        setStatus('current');
      }
    } catch (err) {
      setError(friendlyError(err));
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  }, [content.version]);

  // Comprovació en arrencar i cada cop que l'app torna a primer pla.
  useEffect(() => {
    refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const onOnline = () => refresh({ force: true });
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
    };
  }, [refresh]);

  const value = useMemo(() => ({
    ...content,
    meta: {
      version: content.version,
      bundledVersion: BUNDLED_VERSION,
      updatedAt: content.updatedAt,
      label: content.label,
      source: content.source || null,
      isRemote: content.version > BUNDLED_VERSION,
      status,
      error,
      checkedAt,
    },
    refresh,
  }), [content, status, error, checkedAt, refresh]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Accés a tot el contingut. Mai retorna null: cau al contingut del binari. */
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    // Permet renderitzar pantalles soltes (tests, storybook) sense el provider.
    return { ...BUNDLED_CONTENT, meta: { version: BUNDLED_VERSION, isRemote: false, status: 'idle' }, refresh: () => {} };
  }
  return ctx;
}

/** Neteja la memòria cau i torna al contingut del binari. */
export function resetContentCache() {
  const store = safeStorage();
  if (!store) return;
  store.removeItem(CACHE_KEY);
  store.removeItem(CHECK_KEY);
}
