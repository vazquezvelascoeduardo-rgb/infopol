// Marc general de l'app: capçalera (topbar) i peu segons rebranding 2026.
// Tema (light/dark) i idioma viuen al menú lateral · Sidebar > Ajustes.
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';
import { useT } from '../lib/i18n';
import Sidebar from './Sidebar';
import GdprBanner from './GdprBanner';
import UserButton from './UserButton';

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
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // A mòbil la barra de cerca està col·lapsada en una icona; en clicar
  // s'expandeix sota la capçalera.
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useT();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!location.pathname.startsWith('/cerca')) setQuery('');
  }, [location.pathname]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/cerca?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    if (v.trim().length > 0) {
      navigate(`/cerca?q=${encodeURIComponent(v)}`, { replace: true });
    }
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
                placeholder={t('search.placeholder')}
                value={query}
                onChange={onChange}
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
                  placeholder={t('search.placeholder')}
                  value={query}
                  onChange={onChange}
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

      <main className="flex-1">{children}</main>

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
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Banner RGPD a la primera visita */}
      <GdprBanner />
    </div>
  );
}
