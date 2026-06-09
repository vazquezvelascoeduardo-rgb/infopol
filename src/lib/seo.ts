// SEO sense dependències: actualitza <title>, meta description, Open
// Graph, Twitter i el canonical segons la ruta. Com que la web és una
// SPA (CSR), aquí ho fem imperativament sobre el DOM en cada navegació.
//
// Ús:
//  - <RouteMeta/> (a App) aplica els títols per defecte de cada secció.
//  - useSeo({...}) a les pàgines dinàmiques (notícia, fitxa de llei…)
//    per posar un títol/descripció a mida.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE = 'https://infopol.app';
const DEFAULT_IMAGE = `${SITE}/pwa-512x512.png`;
const BRAND = 'InfoPol';
const DEFAULT_DESC = 'Normativa, infografies i operativa de butxaca per a agents i aspirants de policia local de Catalunya.';

export type Meta = { title: string; description?: string; image?: string; type?: string; path?: string; jsonLd?: object | null };

// La pàgina que ha posat un títol a mida (per evitar que RouteMeta el trepitgi).
let explicitFor: string | null = null;
export const setExplicit = (p: string | null) => { explicitFor = p; };
export const getExplicit = () => explicitFor;

function metaTag(attr: 'name' | 'property', key: string, content?: string) {
  if (content == null) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function canonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
// JSON-LD específic de la pàgina (article, etc.). El de l'Organization/
// WebSite viu fix a l'index.html.
function jsonLd(obj?: object | null) {
  let el = document.head.querySelector<HTMLScriptElement>('#seo-jsonld');
  if (!obj) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'seo-jsonld'; document.head.appendChild(el); }
  el.textContent = JSON.stringify(obj);
}

export function applyMeta(m: Meta) {
  if (typeof document === 'undefined') return;
  const desc = m.description || DEFAULT_DESC;
  const image = m.image || DEFAULT_IMAGE;
  const path = m.path ?? (typeof location !== 'undefined' ? location.pathname : '/');
  const url = SITE + path;
  document.title = m.title;
  metaTag('name', 'description', desc);
  metaTag('property', 'og:title', m.title);
  metaTag('property', 'og:description', desc);
  metaTag('property', 'og:url', url);
  metaTag('property', 'og:type', m.type || 'website');
  metaTag('property', 'og:image', image);
  metaTag('name', 'twitter:title', m.title);
  metaTag('name', 'twitter:description', desc);
  metaTag('name', 'twitter:image', image);
  canonical(url);
  jsonLd(m.jsonLd ?? null);
}

const t = (s: string) => `${s} · ${BRAND}`;

// Metadades per defecte de cada secció (exactes o per prefix).
const ROUTES: Array<{ p: string; exact?: boolean; title: string; description?: string }> = [
  { p: '/', exact: true, title: 'InfoPol · Normativa i operativa per a policia local de Catalunya', description: DEFAULT_DESC },
  { p: '/operativa', title: t('Operativa policial · catàleg SCT, protocols i recursos'), description: 'Catàleg d\'infraccions de trànsit (SCT), protocols pas a pas, calculadora d\'alcoholèmia i recursos per a agents de policia local de Catalunya.' },
  { p: '/superbuscador', title: t('Superbuscador d\'infraccions de trànsit (SCT)'), description: 'Cerca ràpida entre més de 700 infraccions de trànsit (LSV, RGC, RGCond…) amb import, punts i article.' },
  { p: '/calculadora-alcohol', title: t('Calculadora d\'alcoholèmia · sancions i punts'), description: 'Calcula la sanció per alcoholèmia (administrativa o penal), multa i punts segons la taxa i el tipus de conductor.' },
  { p: '/recursos', title: t('Recursos i telèfons útils'), description: 'Telèfons d\'emergència, farmàcies de guàrdia, validadors i eines ràpides per a la patrulla.' },
  { p: '/croquis', title: t('Croquis d\'accident · editor i recreació'), description: 'Crea el croquis d\'un accident de trànsit, recrea la dinàmica i exporta a imatge o vídeo.' },
  { p: '/academia', title: t('Acadèmia · tests i temari per a oposicions de policia local'), description: 'Prepara l\'oposició de policia local i Mossos: tests oficials, temari, flashcards, esquemes i seguiment del progrés.' },
  { p: '/policia-local', title: t('Tests de Policia Local · temari oficial'), description: 'Tests per temes del temari oficial de policia local de Catalunya, amb repàs intel·ligent dels teus errors.' },
  { p: '/mossos', title: t('Mossos d\'Esquadra · temari i tests'), description: 'Temari i tests per a l\'oposició de Mossos d\'Esquadra, organitzats per àmbits.' },
  { p: '/cultura-general', title: t('Cultura general per a oposicions · tests i temari'), description: 'Més de 400 preguntes de cultura general (història, geografia, art, ciència…) per a oposicions.' },
  { p: '/actualitat', title: t('Actualitat per a oposicions 2026'), description: 'Preguntes d\'actualitat (càrrecs vigents, premis, esports) per a oposicions, actualitzades.' },
  { p: '/retos', title: t('Reptes i progrés · Acadèmia'), description: 'El teu progrés gamificat: XP, ratxa, reptes i assoliments.' },
  { p: '/noticies', title: t('Notícies i novetats normatives · policia local'), description: 'Últimes notícies i novetats normatives d\'interès per a policia local de Catalunya.' },
  { p: '/leyes', title: t('Lleis i normativa · biblioteca'), description: 'Biblioteca de lleis i normativa de referència per a policia local.' },
  { p: '/cerca', title: t('Cerca'), description: DEFAULT_DESC },
  { p: '/avis-legal', title: t('Avís legal'), description: 'Avís legal de InfoPol.' },
  { p: '/privacitat', title: t('Política de privacitat'), description: 'Política de privacitat de InfoPol.' },
  { p: '/login', title: t('Entrar'), description: 'Inicia sessió a InfoPol per desar el teu progrés.' },
];

export function metaForPath(pathname: string): Meta {
  // Coincidència exacta primer.
  const exact = ROUTES.find((r) => r.exact && r.p === pathname);
  if (exact) return { title: exact.title, description: exact.description };
  // Després, el prefix més llarg que coincideixi.
  const pref = ROUTES.filter((r) => !r.exact && (pathname === r.p || pathname.startsWith(r.p + '/')))
    .sort((a, b) => b.p.length - a.p.length)[0];
  if (pref) return { title: pref.title, description: pref.description };
  return { title: `${BRAND} · Policia local de Catalunya`, description: DEFAULT_DESC };
}

// Hook per a pàgines amb títol a mida (notícies, fitxes…).
export function useSeo(meta: Meta) {
  const loc = useLocation();
  useEffect(() => {
    if (!meta.title) return;
    setExplicit(loc.pathname);
    applyMeta({ ...meta, path: loc.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname, meta.title, meta.description, meta.image, meta.type]);
}
