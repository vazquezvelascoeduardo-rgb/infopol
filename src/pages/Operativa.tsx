// Pàgina principal del bloc "Operativa": tarjetes per cada tema operatiu.
// Per ara: Trànsit (interactiu) i Seguretat Ciutadana (placeholder).
// Es poden afegir més temes ampliant l'array OPERATIVA_THEMES.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

type OperativaTheme = {
  slug: string;
  icon: string;
  accent: string; // gradient classes
  ready: boolean; // si false → mostra "en construcció"
  to?: string; // ruta destí si està llest
};

const OPERATIVA_THEMES: OperativaTheme[] = [
  {
    slug: 'trafico',
    icon: '🚦',
    accent: 'from-amber-500 to-amber-700',
    ready: true,
    to: '/operativa/trafico',
  },
  {
    slug: 'seguretat-ciutadana',
    icon: '🛡️',
    accent: 'from-slate-500 to-slate-700',
    ready: false,
  },
];

export default function Operativa() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('operativa.title')}</span>
      </nav>

      {/* Banda superior */}
      <section className="rounded-2xl border p-5 sm:p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] dark:shadow-none">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 text-3xl text-white shadow-inner"
          >
            🚨
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/90">
              {t('operativa.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('operativa.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('operativa.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Temes */}
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {OPERATIVA_THEMES.map((th) => {
          const title = t(`operativa.${th.slug}.title`);
          const desc = t(`operativa.${th.slug}.desc`);
          const Card = (
            <div
              className={`group relative block h-full overflow-hidden rounded-2xl border p-5 shadow-sm transition
                ${th.ready
                  ? 'hover:-translate-y-0.5 hover:shadow-md border-slate-200 bg-white hover:border-blue-400/60 dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-blue-400/40'
                  : 'border-dashed border-slate-300 bg-slate-50 opacity-70 cursor-not-allowed dark:border-white/10 dark:bg-white/5'}`}
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${th.accent}`} />
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${th.accent} text-2xl text-white shadow-inner`}
                >
                  {th.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>
              {!th.ready && (
                <div className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider
                  bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {t('operativa.comingSoon')}
                </div>
              )}
              {th.ready && (
                <div className="mt-3 flex items-center justify-end text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  {t('operativa.open')}
                  <span className="ml-1 transition group-hover:translate-x-1" aria-hidden>→</span>
                </div>
              )}
            </div>
          );
          return (
            <li key={th.slug}>
              {th.ready && th.to ? (
                <Link to={th.to} className="block h-full">
                  {Card}
                </Link>
              ) : (
                Card
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
