// Pantalla principal de l'app: dues seccions grans.
//   1) Lleis      → tot el contingut de temari (CE78, Codi penal, FCS, etc.).
//   2) Operativa  → procediments per situació (Trànsit, Seguretat ciutadana…).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

export default function Home() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Targetes principals: Lleis · Operativa · Superbuscador */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* LLEIS */}
        <li>
          <Link
            to="/leyes"
            className="group relative block h-full overflow-hidden rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
              border-slate-200 bg-white hover:border-amber-400/60
              dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700" />
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-3xl text-white shadow-inner"
              >
                ⚖️
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400/90">
                  {t('home.leyes.badge')}
                </div>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t('home.leyes.title')}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {t('home.leyes.desc')}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end text-amber-600 dark:text-amber-400">
              <span className="text-sm font-semibold">
                {t('home.leyes.cta')}
              </span>
              <span className="ml-1 transition group-hover:translate-x-1" aria-hidden>→</span>
            </div>
          </Link>
        </li>

        {/* OPERATIVA */}
        <li>
          <Link
            to="/operativa"
            className="group relative block h-full overflow-hidden rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
              border-slate-200 bg-white hover:border-blue-400/60
              dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-800" />
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 text-3xl text-white shadow-inner"
              >
                🚨
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
                  {t('home.operativa.badge')}
                </div>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  {t('home.operativa.title')}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {t('home.operativa.desc')}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end text-blue-600 dark:text-blue-400">
              <span className="text-sm font-semibold">
                {t('home.operativa.cta')}
              </span>
              <span className="ml-1 transition group-hover:translate-x-1" aria-hidden>→</span>
            </div>
          </Link>
        </li>
      </ul>

      {/* SUPERBUSCADOR — accés directe destacat (full width) */}
      <Link
        to="/superbuscador"
        className="group relative mt-4 block overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm transition
          hover:-translate-y-0.5 hover:shadow-md
          border-purple-200/70 bg-gradient-to-r from-purple-50/70 via-white to-fuchsia-50/60
          hover:border-purple-400/60
          dark:border-white/10 dark:bg-gradient-to-r dark:from-[#1a0f2e] dark:to-[#0a1628] dark:hover:border-purple-400/40"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-700" />
        <div aria-hidden className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-fuchsia-200/30 blur-3xl dark:hidden" />
        <div className="relative flex items-center gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-700 text-3xl text-white shadow-inner"
          >
            🔍
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-purple-700 dark:text-purple-400/90 font-semibold">
              {t('home.superbuscador.badge')}
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
              {t('home.superbuscador.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-1">
              {t('home.superbuscador.desc')}
            </p>
          </div>
          <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-purple-700 dark:text-purple-400">
            {t('home.superbuscador.cta')}
            <span className="ml-1 transition group-hover:translate-x-1" aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
