// Marc general de l'app: capçalera i peu.
// La capçalera té: logo, cerca, toggle de tema (clar/fosc) i toggle d'idioma.
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';
import { useT } from '../lib/i18n';
import PoliceCarIcon from './PoliceCarIcon';
import BackButton from './BackButton';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale, setLocale } = useT();

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
      <header className="sticky top-0 z-30 backdrop-blur bg-white/95 dark:bg-[#0a1628]/85 border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2 sm:gap-3">
          {/* Botó hamburguesa per obrir el menú lateral */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label={t('sidebar.open')}
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

          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={t('nav.home')}>
            <PoliceCarIcon className="h-9 w-auto drop-shadow-sm" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-black tracking-tight text-lg">
                Info<span className="text-blue-800 dark:text-blue-400">Pol</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400/80">
                {t('app.tagline')}
              </span>
            </div>
          </Link>

          <form onSubmit={onSubmit} className="flex-1 min-w-0">
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

          {/* Toggle d'idioma: ES | CA */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'es' ? 'ca' : 'es')}
            aria-label={t('lang.toggle')}
            title={t('lang.toggle')}
            className="shrink-0 inline-flex h-10 items-center rounded-xl border px-2 text-xs font-bold tracking-wide transition
              border-slate-200 bg-white hover:bg-slate-50
              dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <span className={locale === 'es' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
              ES
            </span>
            <span className="mx-1 text-slate-300 dark:text-slate-600" aria-hidden>·</span>
            <span className={locale === 'ca' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
              CA
            </span>
          </button>

          {/* Toggle de tema */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition
              border-slate-200 bg-white hover:bg-slate-50 text-slate-700
              dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <BackButton />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        {t('footer')}
      </footer>

      {/* Menú lateral desplegable */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
