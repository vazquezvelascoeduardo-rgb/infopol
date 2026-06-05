// Marc general de l'app: capçalera (topbar) i peu segons rebranding 2026.
// La web és sempre en català i en tema clar (s'han eliminat els selectors
// d'idioma i tema). Al sidebar només queda l'ajust de mida de text.
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyInitialTheme } from '../lib/theme';
import { useT } from '../lib/i18n';
import Sidebar from './Sidebar';
import GdprBanner from './GdprBanner';
import UserButton from './UserButton';
import OnboardingTour from './OnboardingTour';
import RegisterNudge from './RegisterNudge';
import BackButton from './BackButton';
import BottomNav from './BottomNav';

function BrandShield({ className = '' }: { className?: string }) {
  // Shield-i (rebranding 2026): escut en tinta amb la "i" d'info
  // dibuixada com a cercle + barra terracota (sense dependència de
  // tipografia, escala perfectament a qualsevol mida).
  return (
    <svg className={`brand-shield ${className}`} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z"
        fill="var(--ink)"
      />
      <circle cx="32" cy="22" r="4.2" fill="var(--terracotta)" />
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill="var(--terracotta)" />
    </svg>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // A mòbil la barra de cerca està col·lapsada en una icona; en clicar
  // s'expandeix sota la capçalera.
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useT();
  // Temporitzador per fer debounce de la cerca mentre s'escriu.
  const searchTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
  }, []);

  useEffect(() => {
    // Tema clar fixat (sense toggle).
    applyInitialTheme();
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith('/cerca')) setQuery('');
  }, [location.pathname]);

  // Quan l'usuari està dins del Catàleg SCT, el topbar no ha de
  // redirigir a /cerca (cerca global) — ha de cercar només dins del
  // catàleg, propagant el query al camp #cat-q del HTML inline.
  const isCatalegSct = location.pathname.includes(
    '/transit/cataleg-d-infraccions-de-transit-sct-2026',
  );

  // Aplica el query al cercador intern del catàleg HTML.
  // Retorna true si l'aplicació ha tingut èxit (camp trobat).
  function applyToCatalegInternal(value: string): boolean {
    if (typeof document === 'undefined') return false;
    const input = document.getElementById('cat-q') as HTMLInputElement | null;
    if (!input) return false;
    input.value = value;
    // Disparem 'input' perquè el filtre del catàleg s'activi.
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (isCatalegSct) {
      // Cerca interna: scroll al cercador del catàleg + aplica el filtre.
      applyToCatalegInternal(q);
      const input = document.getElementById('cat-q');
      if (input) input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setMobileSearchOpen(false);
      return;
    }
    navigate(`/cerca?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    if (isCatalegSct) {
      // Propaga el text al cercador intern del catàleg — no navega fora.
      applyToCatalegInternal(v);
      return;
    }
    // Debounce: esperem ~250 ms d'inactivitat abans de navegar a /cerca,
    // per no generar renders ni historial sorollós a cada tecla.
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    const trimmed = v.trim();
    if (trimmed.length > 0) {
      searchTimer.current = window.setTimeout(() => {
        navigate(`/cerca?q=${encodeURIComponent(trimmed)}`, { replace: true });
      }, 250);
    }
  }

  // L'Acadèmia i l'Operativa tenen el seu propi shell complet (sidebar +
  // topbar + nav) proporcionat per OperativaShellLayout / AcademiaShellLayout.
  // Amaguem el chrome global de l'app en aquestes rutes i en totes les
  // seves subpàgines (Catàleg SCT, Lleis, protocols, calculadora…) perquè
  // no se surti mai del disseny nou.
  const p = location.pathname;
  const isFullShell =
    p === '/operativa' || p.startsWith('/operativa/') ||
    p === '/superbuscador' ||
    p === '/calculadora-alcohol' ||
    p === '/recursos' ||
    p === '/leyes' || p.startsWith('/leyes/') ||
    p === '/academia' || p.startsWith('/academia/');
  if (isFullShell) {
    return (
      <div className="min-h-dvh bg-paper text-ink">
        {children}
        <GdprBanner />
        <RegisterNudge />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink transition-colors">
      <header className="topbar" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="shell topbar-inner">
          <Link to="/" className="brand" aria-label={t('nav.home')}>
            <BrandShield />
            <span className="brand-wordmark">
              <span className="info">info</span>
              <span className="pol">pol</span>
            </span>
          </Link>

          {/* Searchbar inline (desktop) */}
          <form onSubmit={onSubmit} className="hidden sm:block min-w-0">
            <label htmlFor="cerca" className="sr-only">
              {t('search.label')}
            </label>
            <div className="searchbar">
              <svg
                aria-hidden
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="cerca"
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder={isCatalegSct ? 'Cerca dins del catàleg SCT…' : t('search.placeholder')}
                value={query}
                onChange={onChange}
                aria-label={isCatalegSct ? 'Cerca dins del catàleg SCT' : t('search.label')}
              />
              <kbd>⌘K</kbd>
            </div>
          </form>

          {/* Espai expansible a mòbil per empènyer els botons a la dreta */}
          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-2">
            {/* Botó-lupa: només a mòbil. */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(v => !v)}
              aria-label={t('search.label')}
              title={t('search.label')}
              aria-expanded={mobileSearchOpen}
              className="icon-btn sm:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>

            {/* Botó d'usuari: Entrar si no hi ha sessió, avatar si n'hi ha */}
            <UserButton />

            {/* Hamburguesa */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('sidebar.open')}
              title={t('sidebar.open')}
              className="icon-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Barra de cerca expandida a mòbil */}
        {mobileSearchOpen && (
          <div className="sm:hidden border-t border-line px-4 py-2 bg-white">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <label htmlFor="cerca-mobile" className="sr-only">
                {t('search.label')}
              </label>
              <div className="searchbar flex-1">
                <svg
                  aria-hidden
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  id="cerca-mobile"
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  autoFocus
                  placeholder={isCatalegSct ? 'Cerca dins del catàleg SCT…' : t('search.placeholder')}
                  value={query}
                  onChange={onChange}
                  aria-label={isCatalegSct ? 'Cerca dins del catàleg SCT' : t('search.label')}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('search.clearQuery')}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-text-3 hover:bg-paper-2 hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                aria-label={t('search.close')}
                title={t('search.close')}
                className="shrink-0 inline-flex h-10 px-3 items-center justify-center rounded-lg text-sm font-medium text-text-2 hover:bg-paper-2 hover:text-ink transition"
              >
                {t('search.close')}
              </button>
            </form>
          </div>
        )}
      </header>

      <main className="flex-1 layout-main">
        <BackButton />
        {children}
      </main>

      <footer className="border-t border-line mt-16 sm:mt-20">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-9 sm:py-10 text-[13.5px] text-text-3">
          <div className="flex items-center gap-3">
            <BrandShield className="!w-[22px] !h-[22px]" />
            <span>© 2026 Infopol · {t('footer.unofficial')}</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link to="/avis-legal" className="hover:text-ink transition">
              {t('footer.legal')}
            </Link>
            <Link to="/privacitat" className="hover:text-ink transition">
              {t('footer.privacy')}
            </Link>
          </nav>
        </div>
      </footer>

      {/* Menú lateral desplegable */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Banner RGPD a la primera visita */}
      <GdprBanner />

      {/* Tour d'onboarding (només primera visita) */}
      <OnboardingTour />

      {/* Nudge a registre després del primer test (si no té sessió) */}
      <RegisterNudge />

      {/* Barra de navegació inferior (només mòbil) */}
      <BottomNav />
    </div>
  );
}
