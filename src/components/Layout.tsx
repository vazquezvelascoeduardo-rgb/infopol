// Marc de l'app: capçalera fosca amb l'estètica de les infografies
// (blau marí + accent daurat). Cerca i toggle de tema integrats.
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-dvh flex flex-col bg-[#0a1628] text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a1628]/85 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Inici">
            {/* Escut tipus insígnia policial, daurat */}
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-black shadow-md ring-1 ring-amber-300/50"
            >
              iP
            </span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold tracking-wide text-slate-100">InfoPol</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80">
                Consulta operativa
              </span>
            </div>
          </Link>

          <form onSubmit={onSubmit} className="flex-1">
            <label htmlFor="cerca" className="sr-only">
              Cerca
            </label>
            <div className="relative">
              <svg
                aria-hidden
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                placeholder="Cerca per article, norma, paraula clau…"
                value={query}
                onChange={onChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-base text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/40"
              />
            </div>
          </form>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Canvia a mode clar' : 'Canvia a mode fosc'}
            title={theme === 'dark' ? 'Tema clar' : 'Tema fosc'}
            className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200"
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

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">{children}</main>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        InfoPol · Consulta personal · Informació no oficial.
      </footer>
    </div>
  );
}
