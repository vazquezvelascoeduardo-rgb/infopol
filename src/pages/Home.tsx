// Pantalla principal de l'app: dues seccions grans.
//   1) Lleis      → tot el contingut de temari (CE78, Codi penal, FCS, etc.).
//   2) Operativa  → procediments per situació (Trànsit, Seguretat ciutadana…).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useFavorites, useRecents, type Bookmark } from '../lib/bookmarks';
import { MODULES } from '../lib/content';

function BookmarksBlock() {
  const { t } = useT();
  const { items: favs, toggle: toggleFav } = useFavorites();
  const { items: recents, clear: clearRecents } = useRecents();

  // Recents que no son ja favorits (per no duplicar visualment).
  const recentsFiltered = recents.filter(
    (r) => !favs.some((f) => f.moduleSlug === r.moduleSlug && f.slug === r.slug),
  );

  if (favs.length === 0 && recentsFiltered.length === 0) return null;

  return (
    <section className="mb-5 rounded-2xl border p-4 sm:p-5
      border-slate-200/80 bg-white
      dark:border-white/10 dark:bg-[#0f1d34]">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 dark:from-amber-300 dark:to-amber-500" />
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300">
          {t('home.bookmarks.title')}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
      </div>

      {favs.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400/90 mb-1.5">
            ★ {t('home.bookmarks.favs')}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {favs.map((b) => (
              <BookmarkItem key={`fav-${b.moduleSlug}-${b.slug}`} b={b} accent="amber"
                onRemove={() => toggleFav(b)} />
            ))}
          </ul>
        </div>
      )}

      {recentsFiltered.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              ⏱ {t('home.bookmarks.recents')}
            </div>
            <button
              type="button"
              onClick={clearRecents}
              className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              {t('home.bookmarks.clearRecents')}
            </button>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {recentsFiltered.slice(0, 6).map((b) => (
              <BookmarkItem key={`rec-${b.moduleSlug}-${b.slug}`} b={b} accent="slate" />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function BookmarkItem({
  b,
  accent,
  onRemove,
}: {
  b: Bookmark;
  accent: 'amber' | 'slate';
  onRemove?: () => void;
}) {
  const mod = MODULES.find((m) => m.slug === b.moduleSlug);
  const accentRing = accent === 'amber'
    ? 'hover:border-amber-300 dark:hover:border-amber-400/40'
    : 'hover:border-slate-300 dark:hover:border-white/20';
  return (
    <li className="group relative">
      <Link
        to={`/leyes/s/${b.moduleSlug}/${b.slug}`}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition pr-9
          border-slate-200/80 bg-slate-50/40
          dark:border-white/10 dark:bg-white/5
          ${accentRing}`}
      >
        {mod && (
          <span aria-hidden className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${mod.accent}`} />
        )}
        <span className="truncate text-slate-700 dark:text-slate-200">{b.title}</span>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="✕"
          className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md
            text-slate-400 hover:bg-slate-200 hover:text-slate-700
            dark:hover:bg-white/10 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition"
        >
          ✕
        </button>
      )}
    </li>
  );
}

export default function Home() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <BookmarksBlock />

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
            💸
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

      {/* CALCULADORA ALCOHOL + RECURSOS — fila d'atajos */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/calculadora-alcohol"
          className="group relative block overflow-hidden rounded-xl border p-4 shadow-sm transition
            hover:-translate-y-0.5 hover:shadow-md
            border-rose-200/70 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50
            hover:border-rose-400/60
            dark:border-white/10 dark:bg-gradient-to-r dark:from-[#2a0f1a] dark:to-[#0a1628] dark:hover:border-rose-400/40"
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-600" />
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-xl text-white shadow-inner"
            >
              🍷
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-rose-700 dark:text-rose-400/90 font-semibold">
                {t('home.alcohol.badge')}
              </div>
              <h2 className="mt-0.5 text-base font-bold tracking-tight">
                {t('home.alcohol.title')}
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-1">
                {t('home.alcohol.desc')}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center text-rose-700 dark:text-rose-400 text-base font-semibold">
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>

        <Link
          to="/recursos"
          className="group relative block overflow-hidden rounded-xl border p-4 shadow-sm transition
            hover:-translate-y-0.5 hover:shadow-md
            border-emerald-200/70 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50
            hover:border-emerald-400/60
            dark:border-white/10 dark:bg-gradient-to-r dark:from-[#0f2a1f] dark:to-[#0a1628] dark:hover:border-emerald-400/40"
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-700" />
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xl text-white shadow-inner"
            >
              🧰
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400/90 font-semibold">
                {t('home.recursos.badge')}
              </div>
              <h2 className="mt-0.5 text-base font-bold tracking-tight">
                {t('home.recursos.title')}
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-1">
                {t('home.recursos.desc')}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center text-emerald-700 dark:text-emerald-400 text-base font-semibold">
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
