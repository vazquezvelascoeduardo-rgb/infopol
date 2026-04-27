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
    <div className="min-h-dvh flex flex-col bg-white text-slate-900 dark:bg-[#0a1628] dark:text-slate-100 transition-colors">
      <header
        className="sticky top-0 z-30 backdrop-blur bg-white/95 dark:bg-[#0a1628]/85 border-b border-slate-200 dark:border-white/10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={t('nav.home')}>
            <LogoIcon className="h-10 w-10 text-blue-700 dark:text-white drop-shadow-sm" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-black tracking-tight text-lg">
                Info<span className="text-blue-800 dark:text-blue-400">Pol</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400/80">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                className="w-full rounded-xl border pl-10 pr-4 py-2 text-base outline-none focus:ring-2 focus:ring-amber-400/60
                  border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-400/60
                  dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500"
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
              border-slate-200 bg-white hover:bg-slate-50 text-slate-700
              dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
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
              border-slate-200 bg-white hover:bg-slate-50 text-slate-700
              dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Barra de cerca expandida a mòbil. Apareix sota el header. */}
        {mobileSearchOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-white/10 px-4 py-2 bg-white dark:bg-[#0a1628]">
            <form onSubmit={onSubmit}>
              <label htmlFor="cerca-mobile" className="sr-only">
                {t('search.label')}
              </label>
              <div className="relative">
                <svg
                  aria-hidden
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                  className="w-full rounded-xl border pl-10 pr-4 py-2 text-base outline-none focus:ring-2 focus:ring-amber-400/60
                    border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-400/60
                    dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </form>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-3 px-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>© 2026 Infopol.app</span>
          <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
          <Link to="/avis-legal" className="hover:text-blue-700 dark:hover:text-blue-400">
            {t('footer.legal')}
          </Link>
          <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
          <Link to="/privacitat" className="hover:text-blue-700 dark:hover:text-blue-400">
            {t('footer.privacy')}
          </Link>
          <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-slate-400 dark:text-slate-500">{t('footer.unofficial')}</span>
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
