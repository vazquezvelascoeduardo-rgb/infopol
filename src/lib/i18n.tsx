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

    // Home (landing principal: 2 grandes opciones)
    'home.badge': 'Esquema operativo policial',
    'home.title': 'Consulta rápida',
    'home.subtitle':
      'Normativa, infografías y procedimientos operativos para el agente de policía local. Elige una sección.',
    'home.sections': 'Secciones',
    'home.leyes.badge': 'Temario',
    'home.leyes.title': 'Leyes',
    'home.leyes.desc':
      'Constitución, Código Penal, LECrim, FCS, Tráfico, Seguridad Ciudadana y más. Todas las infografías y normativa.',
    'home.leyes.cta': 'Abrir leyes',
    'home.operativa.badge': 'En la calle',
    'home.operativa.title': 'Operativa',
    'home.operativa.desc':
      'Procedimientos por situación: tráfico, seguridad ciudadana… Selecciona y obtén la norma aplicable.',
    'home.operativa.cta': 'Abrir operativa',

    // Leyes
    'leyes.badge': 'Temario · Normativa',
    'leyes.title': 'Leyes',
    'leyes.subtitle':
      'Normativa, infografías y fichas operativas para el agente de policía local. Elige una sección o usa el buscador para ir directo.',

    // Operativa
    'operativa.badge': 'Procedimientos en la calle',
    'operativa.title': 'Operativa',
    'operativa.subtitle': 'Selecciona el tema operativo con el que estás trabajando.',
    'operativa.comingSoon': 'En construcción',
    'operativa.open': 'Abrir',
    'operativa.trafico.title': 'Tráfico',
    'operativa.trafico.desc': 'Identifica la infracción y aplica la norma',
    'operativa.seguretat-ciutadana.title': 'Seguridad Ciudadana',
    'operativa.seguretat-ciutadana.desc': 'Procedimientos de seguridad ciudadana',

    // Tráfico — listado y runner de checklists
    'checklist.notFound': 'Ese checklist no existe.',
    'checklist.backToList': 'Volver al listado de Tráfico',
    'checklist.start': 'Empezar checklist',
    'checklist.back': 'Atrás',
    'checklist.restart': 'Reiniciar',
    'checklist.startOver': 'Empezar de nuevo',
    'checklist.step': 'Paso {n}',
    'checklist.brokenLink': 'Enlace de checklist roto',
    'checklist.brokenLinkDetail':
      'El nodo "{id}" no existe en este checklist. Reinicia para empezar de cero.',
    'checklist.fine': 'Multa',
    'checklist.points': 'Puntos',
    'checklist.penalty': 'Pena',
    'checklist.action': 'Acción',
    'checklist.actions': 'Actuaciones',
    'checklist.requirements': 'Requisitos',
    'checklist.document': 'Documento a generar',
    'checklist.legalBasis': 'Base legal',
    'checklist.kind.ok': 'Todo correcto',
    'checklist.kind.administrativa': 'Infracción administrativa',
    'checklist.kind.penal': 'Delito (vía penal)',
    'checklist.kind.procediment': 'Procedimiento',

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
    'card.lang.notice.es': 'Esta ficha está en castellano.',
    'card.lang.notice.ca': 'Esta ficha está en catalán.',
    'card.lang.notice.hint':
      'El contenido todavía no está traducido al idioma seleccionado.',

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

    // Home (landing principal: 2 grans opcions)
    'home.badge': 'Esquema operatiu policial',
    'home.title': 'Consulta ràpida',
    'home.subtitle':
      "Normativa, infografies i procediments operatius per a l'agent de policia local. Tria una secció.",
    'home.sections': 'Seccions',
    'home.leyes.badge': 'Temari',
    'home.leyes.title': 'Lleis',
    'home.leyes.desc':
      'Constitució, Codi penal, LECrim, FCS, Trànsit, Seguretat Ciutadana i més. Totes les infografies i normativa.',
    'home.leyes.cta': 'Obrir lleis',
    'home.operativa.badge': 'Al carrer',
    'home.operativa.title': 'Operativa',
    'home.operativa.desc':
      "Procediments per situació: trànsit, seguretat ciutadana… Selecciona i obtén la norma aplicable.",
    'home.operativa.cta': 'Obrir operativa',

    // Lleis
    'leyes.badge': 'Temari · Normativa',
    'leyes.title': 'Lleis',
    'leyes.subtitle':
      "Normativa, infografies i fitxes operatives per a l'agent de policia local. Tria una secció o usa el cercador per anar directe.",

    // Operativa
    'operativa.badge': 'Procediments al carrer',
    'operativa.title': 'Operativa',
    'operativa.subtitle': "Tria el tema operatiu amb el qual estàs treballant.",
    'operativa.comingSoon': 'En construcció',
    'operativa.open': 'Obrir',
    'operativa.trafico.title': 'Trànsit',
    'operativa.trafico.desc': "Identifica la infracció i aplica la norma",
    'operativa.seguretat-ciutadana.title': 'Seguretat Ciutadana',
    'operativa.seguretat-ciutadana.desc': 'Procediments de seguretat ciutadana',

    // Trànsit — llistat i runner de checklists
    'checklist.notFound': 'Aquest checklist no existeix.',
    'checklist.backToList': 'Torna al llistat de Trànsit',
    'checklist.start': 'Comença checklist',
    'checklist.back': 'Enrere',
    'checklist.restart': 'Reinicia',
    'checklist.startOver': 'Tornar a començar',
    'checklist.step': 'Pas {n}',
    'checklist.brokenLink': 'Enllaç de checklist trencat',
    'checklist.brokenLinkDetail':
      "El node \"{id}\" no existeix en aquest checklist. Reinicia per començar de zero.",
    'checklist.fine': 'Multa',
    'checklist.points': 'Punts',
    'checklist.penalty': 'Pena',
    'checklist.action': 'Acció',
    'checklist.actions': 'Actuacions',
    'checklist.requirements': 'Requisits',
    'checklist.document': 'Document a generar',
    'checklist.legalBasis': 'Base legal',
    'checklist.kind.ok': 'Tot correcte',
    'checklist.kind.administrativa': 'Infracció administrativa',
    'checklist.kind.penal': 'Delicte (via penal)',
    'checklist.kind.procediment': 'Procediment',

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
    'card.lang.notice.es': 'Aquesta fitxa està en castellà.',
    'card.lang.notice.ca': 'Aquesta fitxa està en català.',
    'card.lang.notice.hint':
      "El contingut encara no està traduït a l'idioma seleccionat.",

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
