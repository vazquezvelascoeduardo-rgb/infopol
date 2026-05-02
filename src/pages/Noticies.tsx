// Llistat de notícies. Filtres per categoria + cerca textual.
// Marca totes les notícies com a llegides quan l'usuari arriba a la
// pàgina (per netejar el badge no-llegides).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import {
  NOTICIES, type Noticia, type NoticiaCategoria, markNoticiesSeen,
} from '../lib/noticies';

const CATEGORIES: { id: NoticiaCategoria | 'all'; icon: string; tone: string }[] = [
  { id: 'all',             icon: '📰', tone: 'from-slate-500 to-slate-700' },
  { id: 'normativa',       icon: '📜', tone: 'from-amber-500 to-amber-700' },
  { id: 'jurisprudencia',  icon: '⚖️', tone: 'from-purple-500 to-purple-700' },
  { id: 'oposicions',      icon: '🎓', tone: 'from-blue-500 to-blue-700' },
  { id: 'sector',          icon: '🛡️', tone: 'from-rose-500 to-rose-700' },
  { id: 'app',             icon: '✨', tone: 'from-emerald-500 to-emerald-700' },
];

export default function Noticies() {
  const { t } = useT();
  const [activeCat, setActiveCat] = useState<NoticiaCategoria | 'all'>('all');
  const [query, setQuery] = useState('');

  // Marca com a llegides quan l'usuari obre la llista (al cap d'1 segon
  // — així si entra de rebot no perd el badge).
  useEffect(() => {
    const id = setTimeout(() => markNoticiesSeen(), 1500);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    let list = NOTICIES;
    if (activeCat !== 'all') list = list.filter((n) => n.category === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((n) =>
        n.title.toLowerCase().includes(q)
        || n.summary.toLowerCase().includes(q)
        || n.body.toLowerCase().includes(q)
        || (n.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
      );
    }
    // Ordena per data desc (per si NOTICIES no estigués ordenat).
    return [...list].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [activeCat, query]);

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
      <div className="mb-3">
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

      {/* Filtres per categoria */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCat(c.id)}
            aria-pressed={activeCat === c.id}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition
              ${activeCat === c.id
                ? `bg-gradient-to-r ${c.tone} text-white border-transparent shadow-md`
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}
          >
            <span aria-hidden>{c.icon}</span>
            {t(`noticies.cat.${c.id}`)}
            {activeCat === c.id && (
              <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Resultats */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:bg-white/5 p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>🔍</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('noticies.empty')}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => (
            <li key={n.slug}>
              <NoticiaCard noticia={n} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const { t } = useT();
  const cat = CATEGORIES.find((c) => c.id === noticia.category);
  return (
    <Link
      to={`/noticies/${encodeURIComponent(noticia.slug)}`}
      className="group relative block overflow-hidden rounded-2xl border p-4 sm:p-5 transition
        border-slate-200 bg-white hover:border-blue-300 hover:shadow-md
        dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40"
    >
      {cat && (
        <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cat.tone}`} />
      )}
      <div className="flex items-start gap-3">
        {cat && (
          <span aria-hidden className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.tone} text-xl text-white shadow-inner`}>
            {cat.icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-wider mb-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {t(`noticies.cat.${noticia.category}`)}
            </span>
            <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
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
              {noticia.tags.slice(0, 4).map((tg) => (
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
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}
