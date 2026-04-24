// Marc de l'app: capçalera amb logo, cerca i botó de tema.
// El contingut de cada pàgina es renderitza dins de <main>.
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Manté sincronitzat el DOM amb l'estat del tema.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Reseteja la caixa de cerca quan sortim de la pàgina de resultats.
  useEffect(() => {
    if (!location.pathname.startsWith('/cerca')) setQuery('');
  }, [location.pathname]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length === 0) return;
    navigate(`/cerca?q=${encodeURIComponent(q)}`);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    // Cerca "viva": naveguem a resultats amb cada tecla si hi ha text.
    if (v.trim().length > 0) {
      navigate(`/cerca?q=${encodeURIComponent(v)}`, { replace: true });
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Inici">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold"
            >
              iP
            </span>
            <span className="hidden sm:inline font-semibold tracking-tight">InfoPol</span>
          </Link>

          <form onSubmit={onSubmit} className="flex-1">
            <label htmlFor="cerca" className="sr-only">
              Cerca
            </label>
            <input
              id="cerca"
              type="search"
              inputMode="search"
              autoComplete="off"
              placeholder="Cerca per títol o contingut…"
              value={query}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Canvia a mode clar' : 'Canvia a mode fosc'}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? (
              // Icona "sol" (clica per passar a clar)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              // Icona "lluna" (clica per passar a fosc)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">{children}</main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        InfoPol · Consulta personal · Les dades són informatives.
      </footer>
    </div>
  );
}
