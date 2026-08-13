// Identitat del build que s'està executant en aquest dispositiu.
//
// Serveix per respondre "per què el mòbil i l'iPad no mostren el mateix?":
// si els dos aparells ensenyen números diferents, tenen builds diferents
// instal·lats i el contingut del binari no coincideix.

/* global __APP_VERSION__, __BUILD_TIME__ */

export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
export const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null;

/** Data del build en format curt (DD/MM/AAAA HH:MM). */
export function buildDateLabel() {
  if (!BUILD_TIME) return 'desconegut';
  const d = new Date(BUILD_TIME);
  if (Number.isNaN(d.getTime())) return 'desconegut';
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Com s'està executant l'app en aquest moment:
 *  - 'ios' / 'android'  → app nativa instal·lada (Capacitor)
 *  - 'web'              → navegador o drecera a la pantalla d'inici
 */
export function runtimePlatform() {
  if (typeof window === 'undefined') return 'web';
  const cap = window.Capacitor;
  if (cap?.getPlatform) {
    try {
      return cap.getPlatform();
    } catch {
      /* continua amb la detecció per user agent */
    }
  }
  return 'web';
}

export function platformLabel() {
  const p = runtimePlatform();
  if (p === 'ios') return 'App nativa iOS';
  if (p === 'android') return 'App nativa Android';
  if (typeof navigator !== 'undefined' && window.navigator.standalone) return 'Drecera web (pantalla d\'inici)';
  if (typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches) {
    return 'Drecera web (pantalla d\'inici)';
  }
  return 'Navegador web';
}

/** Model aproximat del dispositiu, només per distingir iPad d'iPhone. */
export function deviceLabel() {
  if (typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent || '';
  if (/iPad/.test(ua)) return 'iPad';
  // iPadOS 13+ es fa passar per Mac; el multi-touch el delata.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'iPad';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/Android/.test(ua)) return 'Android';
  return 'Escriptori';
}
