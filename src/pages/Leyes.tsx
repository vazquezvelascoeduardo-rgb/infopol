// Pàgina de "Lleis": tauler de mòduls (era la Home anterior).
// Mostra una targeta per cada mòdul (CE78, Codi penal, FCS, Trànsit…)
// i enllaça a la secció corresponent (/leyes/s/<slug>).
import { Link } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';
import PoliceCarIcon from '../components/PoliceCarIcon';

export default function Leyes() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('leyes.title')}</span>
      </nav>

      {/* Banda superior */}
      <section className="rounded-2xl border p-5 sm:p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] dark:shadow-none">
        <div className="flex items-start gap-4">
          <PoliceCarIcon className="h-16 w-auto shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400/90">
              {t('leyes.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('leyes.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('leyes.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Títol seccions */}
      <div className="mt-7 mb-3 flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-amber-500 dark:bg-amber-400"></span>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          {t('home.sections')}
        </h2>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          const title = t(`module.${m.slug}.title`);
          const desc = t(`module.${m.slug}.desc`);
          return (
            <li key={m.slug}>
              <Link
                to={`/leyes/s/${m.slug}`}
                className="group relative block overflow-hidden rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
                  border-slate-200 bg-white hover:border-amber-400/60
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40"
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${m.accent}`}
                />
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-lg text-white shadow-inner`}
                  >
                    {m.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {desc}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1
                    bg-slate-50 text-slate-600 ring-slate-200
                    dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {count} {plural(t, count, 'cards')}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
