// Llistat de notícies agrupades per mes (any-mes desc).
// Marca totes les notícies com a llegides quan l'usuari arriba a la
// pàgina (per netejar el badge de no-llegides).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import {
  NOTICIES, type Noticia, groupByMonth, getMonthLabel, markNoticiesSeen,
} from '../lib/noticies';

export default function Noticies() {
  const { t, locale } = useT();
  const [query, setQuery] = useState('');

  // Marca com a llegides quan l'usuari obre la llista (al cap d'1.5s
  // — així si entra de rebot no perd el badge).
  useEffect(() => {
    const id = setTimeout(() => markNoticiesSeen(), 1500);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return NOTICIES;
    const q = query.toLowerCase().trim();
    return NOTICIES.filter((n) =>
      n.title.toLowerCase().includes(q)
      || n.summary.toLowerCase().includes(q)
      || n.body.toLowerCase().includes(q)
      || (n.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('noticies.title')}</span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-blue-200/70 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0e2244] dark:to-[#0f1d34]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-3xl text-white shadow-inner">
            📰
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-blue-700 dark:text-blue-400/90">
              {t('noticies.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('noticies.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('noticies.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Cerca */}
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('noticies.searchPlaceholder')}
          className="w-full rounded-xl border-2 px-4 py-2.5 text-sm
            border-slate-200 bg-white text-slate-800 placeholder-slate-400
            focus:border-blue-400 focus:outline-none
            dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400/40"
        />
      </div>

      {/* Resultats agrupats per mes */}
      {grouped.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:bg-white/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🔍</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('noticies.empty')}
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {grouped.map(({ key, items }) => (
            <section key={key}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 inline-flex items-baseline gap-2">
                  <span aria-hidden className="text-base">📅</span>
                  {getMonthLabel(key, locale)}
                </h2>
                <span className="rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  {items.length}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
              </div>
              <ul className="space-y-3">
                {items.map((n) => (
                  <li key={n.slug}>
                    <NoticiaCard noticia={n} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const { t } = useT();
  return (
    <Link
      to={`/noticies/${encodeURIComponent(noticia.slug)}`}
      className="group relative block overflow-hidden rounded-2xl border p-4 sm:p-5 transition
        border-slate-200 bg-white hover:border-blue-300 hover:shadow-md
        dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-700" />
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-wider mb-1">
            <time className="font-mono text-slate-500 dark:text-slate-400">
              {formatDate(noticia.publishedAt)}
            </time>
            {noticia.featured && (
              <>
                <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
                <span className="rounded-full bg-amber-200 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 px-2 py-0.5 text-[9px] font-bold">
                  ⭐ {t('noticies.featured')}
                </span>
              </>
            )}
          </div>
          <h2 className="font-bold text-base sm:text-lg leading-snug mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            {noticia.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug line-clamp-3">
            {noticia.summary}
          </p>
          {noticia.tags && noticia.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {noticia.tags.slice(0, 5).map((tg) => (
                <span key={tg}
                  className="rounded-md border px-1.5 py-0.5 text-[10px] font-mono
                    border-slate-200 bg-slate-50 text-slate-600
                    dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  {tg}
                </span>
              ))}
            </div>
          )}
        </div>
        <span aria-hidden className="shrink-0 text-slate-400 group-hover:translate-x-1 transition self-center">→</span>
      </div>
    </Link>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}
