// Sistema de traduccions (i18n) de la app.
// Gestió: guardem l'idioma al localStorage i sincronitzem amb l'atribut
// `lang` del <html>. Per defecte, espanyol.
//
// Ús a un component:
//   const { t, locale, setLocale } = useT();
//   <h1>{t('home.title')}</h1>
//
// Les claus són "estables" i funcionen com a identificadors — si una clau
// no existeix en algun idioma, es retorna la clau tal qual (perquè saltin
// a la vista les mancances).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'es' | 'ca';
const STORAGE_KEY = 'infopol-locale';

type Dict = Record<string, string>;

const DICT: Record<Locale, Dict> = {
  es: {
    // Header / layout
    'app.tagline': 'Consulta operativa',
    'nav.home': 'Inicio',
    'search.label': 'Buscar',
    'search.placeholder': 'Buscar por artículo, norma, palabra clave…',
    'theme.toLight': 'Cambiar a modo claro',
    'theme.toDark': 'Cambiar a modo oscuro',
    'theme.light': 'Tema claro',
    'theme.dark': 'Tema oscuro',
    'lang.toggle': 'Cambiar idioma',
    'footer': 'InfoPol · Consulta personal · Información no oficial.',

    // Home
    'home.badge': 'Esquema operativo policial',
    'home.title': 'Consulta rápida',
    'home.subtitle':
      'Normativa, infografías y fichas operativas para el agente de policía local. Elige una sección o usa el buscador para ir directo.',
    'home.sections': 'Secciones',

    // Counts
    'cards.one': 'ficha',
    'cards.other': 'fichas',
    'results.one': 'resultado',
    'results.other': 'resultados',

    // Section
    'section.notFound': 'Sección no encontrada.',
    'section.empty': 'Todavía no hay fichas en esta sección.',

    // Card
    'card.notFound': 'Ficha no encontrada.',

    // Search
    'search.resultsLabel': 'Resultados',
    'search.query': 'Búsqueda:',
    'search.none': 'sin coincidencias',

    // Not found
    'notFound.text': 'Página no encontrada.',
    'back.home': 'Volver al inicio',

    // Modules
    'module.ce78.title': 'CE78',
    'module.ce78.desc': 'Constitución Española de 1978.',
    'module.codi-penal.title': 'Código penal',
    'module.codi-penal.desc': 'Ley Orgánica 10/1995, del Código penal.',
    'module.eac.title': 'EAC',
    'module.eac.desc': 'Estatuto de Autonomía de Cataluña.',
    'module.fcs.title': 'FCS',
    'module.fcs.desc': 'Fuerzas y Cuerpos de Seguridad.',
    'module.lecrim.title': 'LECrim',
    'module.lecrim.desc': 'Ley de Enjuiciamiento Criminal.',
    'module.menors.title': 'Menores',
    'module.menors.desc': 'Normativa relativa a menores.',
    'module.municipi.title': 'Municipio',
    'module.municipi.desc': 'Régimen municipal y ordenanzas.',
    'module.sc.title': 'SC',
    'module.sc.desc': 'Seguridad Ciudadana (LOPSC).',
    'module.transit.title': 'Tráfico',
    'module.transit.desc': 'Tráfico, circulación y seguridad vial.',
  },
  ca: {
    // Header / layout
    'app.tagline': 'Consulta operativa',
    'nav.home': 'Inici',
    'search.label': 'Cerca',
    'search.placeholder': 'Cerca per article, norma, paraula clau…',
    'theme.toLight': 'Canvia a mode clar',
    'theme.toDark': 'Canvia a mode fosc',
    'theme.light': 'Tema clar',
    'theme.dark': 'Tema fosc',
    'lang.toggle': "Canvia d'idioma",
    'footer': 'InfoPol · Consulta personal · Informació no oficial.',

    // Home
    'home.badge': 'Esquema operatiu policial',
    'home.title': 'Consulta ràpida',
    'home.subtitle':
      "Normativa, infografies i fitxes operatives per a l'agent de policia local. Tria una secció o usa el cercador per anar directe.",
    'home.sections': 'Seccions',

    // Counts
    'cards.one': 'fitxa',
    'cards.other': 'fitxes',
    'results.one': 'resultat',
    'results.other': 'resultats',

    // Section
    'section.notFound': 'Secció no trobada.',
    'section.empty': 'Encara no hi ha fitxes en aquesta secció.',

    // Card
    'card.notFound': 'Fitxa no trobada.',

    // Search
    'search.resultsLabel': 'Resultats',
    'search.query': 'Cerca:',
    'search.none': 'cap coincidència',

    // Not found
    'notFound.text': 'Pàgina no trobada.',
    'back.home': "Torna a l'inici",

    // Modules
    'module.ce78.title': 'CE78',
    'module.ce78.desc': 'Constitució Espanyola de 1978.',
    'module.codi-penal.title': 'Codi penal',
    'module.codi-penal.desc': 'Llei Orgànica 10/1995, del Codi penal.',
    'module.eac.title': 'EAC',
    'module.eac.desc': "Estatut d'Autonomia de Catalunya.",
    'module.fcs.title': 'FCS',
    'module.fcs.desc': 'Forces i Cossos de Seguretat.',
    'module.lecrim.title': 'LECrim',
    'module.lecrim.desc': "Llei d'Enjudiciament Criminal.",
    'module.menors.title': 'Menors',
    'module.menors.desc': 'Normativa relativa a menors.',
    'module.municipi.title': 'Municipi',
    'module.municipi.desc': 'Règim municipal i ordenances.',
    'module.sc.title': 'SC',
    'module.sc.desc': 'Seguretat Ciutadana (LOPSC).',
    'module.transit.title': 'Trànsit',
    'module.transit.desc': 'Trànsit, circulació i seguretat viària.',
  },
};

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'ca' ? 'ca' : 'es';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
  }

  function t(key: string): string {
    const d = DICT[locale];
    return d[key] ?? key;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useT(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT ha d’usar-se dins de <LocaleProvider>.');
  return ctx;
}

// Helper per a plurals simples (1 → one, altres → other).
export function plural(t: Ctx['t'], count: number, keyBase: string): string {
  return t(`${keyBase}.${count === 1 ? 'one' : 'other'}`);
}
