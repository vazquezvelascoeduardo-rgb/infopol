// Marc general de l'app: capçalera i peu.
// La capçalera nomes te logo + cerca + boto del menu lateral.
// Els toggles de tema i idioma viuen al menu lateral (apartat Ajustes).
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';
import { useT } from '../lib/i18n';
import LogoIcon from './LogoIcon';
import Sidebar from './Sidebar';
import GdprBanner from './GdprBanner';

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
    <div className="min-h-dvh flex flex-col bg-bg text-ink transition-colors">
      <header
        className="sticky top-0 z-30 backdrop-blur bg-bg/80 border-b border-line"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={t('nav.home')}>
            <LogoIcon className="h-10 w-10 text-brand drop-shadow-sm" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-black tracking-tight text-lg">
                Info<span className="text-brand">Pol</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                {t('app.tagline')}
              </span>
            </div>
          </Link>

          {/* Cercador inline: només a desktop. A mòbil es mostra com a botó-lupa
              i s'expandeix sota la capçalera. */}
          <form onSubmit={onSubmit} className="flex-1 min-w-0 hidden sm:block">
            <label htmlFor="cerca" className="sr-only">
              {t('search.label')}
            </label>
            <div className="relative">
              <svg
                aria-hidden
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-soft"
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
                className="w-full rounded-xl border pl-10 pr-4 py-2 text-base outline-none focus:ring-2 focus:ring-brand/30
                  border-line bg-paper text-ink placeholder-muted focus:border-brand"
              />
            </div>
          </form>

          {/* Espai expansible a mòbil per empènyer els botons a la dreta */}
          <div className="flex-1 sm:hidden" />

          {/* Botó-lupa: només a mòbil. Toggleja la barra de cerca expandida. */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(v => !v)}
            aria-label={t('search.label')}
            title={t('search.label')}
            aria-expanded={mobileSearchOpen}
            className="sm:hidden shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition
              border-line bg-paper text-ink-2 hover:bg-line-2 hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {/* Botó hamburguesa — dreta del tot. Obre el menú lateral. */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label={t('sidebar.open')}
            title={t('sidebar.open')}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition
              border-line bg-paper text-ink-2 hover:bg-line-2 hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Barra de cerca expandida a mòbil. Apareix sota el header.
            Inclou input gran + botó '✕' que tanca la barra. */}
        {mobileSearchOpen && (
          <div className="sm:hidden border-t border-line px-4 py-2 bg-paper">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <label htmlFor="cerca-mobile" className="sr-only">
                {t('search.label')}
              </label>
              <div className="relative flex-1 min-w-0">
                <svg
                  aria-hidden
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-soft"
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
                  className="w-full rounded-xl border-2 pl-10 pr-9 py-2.5 text-base outline-none focus:ring-2 focus:ring-brand/30
                    border-brand/40 bg-paper text-ink placeholder-muted focus:border-brand"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('search.clearQuery')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full
                      text-soft hover:bg-line-2 hover:text-ink"
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
                className="shrink-0 inline-flex h-10 px-3 items-center justify-center rounded-lg text-sm font-medium transition
                  text-ink-2 hover:bg-line-2 hover:text-ink"
              >
                {t('search.close')}
              </button>
            </form>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line py-3 px-4 text-center text-[11px] text-muted bg-paper">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>© 2026 Infopol.app</span>
          <span aria-hidden className="text-line">·</span>
          <Link to="/avis-legal" className="hover:text-brand">
            {t('footer.legal')}
          </Link>
          <span aria-hidden className="text-line">·</span>
          <Link to="/privacitat" className="hover:text-brand">
            {t('footer.privacy')}
          </Link>
          <span aria-hidden className="text-line">·</span>
          <span className="text-soft">{t('footer.unofficial')}</span>
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
