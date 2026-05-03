// Pàgina d'índex de Cultura General — 7 cards, una per matèria.
// Cada card porta a una pàgina independent /cultura-general/:id
// (amb el seu propi sub-nav, cerca i contingut).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { CULTURA, CULTURA_UPDATED_AT } from '../lib/cultura-general';

export default function CulturaGeneral() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('cultura.title')}</span>
      </nav>

      {/* Capçalera */}
      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-violet-200/70 bg-gradient-to-br from-violet-50/60 via-white to-purple-50/40
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a0f2e] dark:to-[#0f1d34]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-3xl text-white shadow-inner">
            🎓
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-violet-700 dark:text-violet-400/90">
              {t('cultura.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('cultura.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('cultura.indexSubtitle').replace('{date}', formatLongDate(CULTURA_UPDATED_AT))}
            </p>
          </div>
        </div>
      </header>

      {/* Grid de cards — 1 col mòbil, 2 col tauleta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CULTURA.map((sec) => {
          // Comptem entrades totals per a la card.
          const totalEntries = sec.subsections.reduce(
            (acc, sub) => acc + sub.entries.length,
            0,
          );
          const subsectionCount = sec.subsections.length;

          return (
            <Link
              key={sec.id}
              to={`/cultura-general/${encodeURIComponent(sec.id)}`}
              className={`group relative block overflow-hidden rounded-2xl border p-5 transition
                hover:-translate-y-0.5 hover:shadow-md
                border-slate-200 bg-white
                dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-white/20`}
            >
              {/* Banda superior amb el gradient de la matèria */}
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${sec.accent}`} />

              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sec.accent} text-2xl text-white shadow-inner`}
                >
                  {sec.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black text-base sm:text-lg leading-tight tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    {sec.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{subsectionCount} {t('cultura.subsectionsLabel')}</span>
                    <span aria-hidden>·</span>
                    <span>{totalEntries} {t('cultura.entriesLabel')}</span>
                  </div>
                </div>
                <span aria-hidden className="shrink-0 text-slate-400 group-hover:translate-x-1 transition self-center text-lg">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400 text-center">
        {t('cultura.indexFooter')}
      </p>
    </div>
  );
}

function formatLongDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}
