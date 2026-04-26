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

      {/* Banda superior — hero amb tint càlid suau en mode clar */}
      <section className="relative overflow-hidden rounded-2xl border p-5 sm:p-7
        border-slate-200/70 bg-gradient-to-br from-white via-amber-50/30 to-white
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628] dark:shadow-none dark:via-[#0f1d34]">
        {/* Decoració: cercles subtils només en mode clar */}
        <div aria-hidden className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl dark:hidden" />
        <div aria-hidden className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-blue-200/20 blur-3xl dark:hidden" />
        <div className="relative flex items-start gap-4">
          <PoliceCarIcon className="h-16 w-auto shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-700 dark:text-amber-400/90">
              {t('leyes.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {t('leyes.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('leyes.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Títol seccions — accent més pronunciat */}
      <div className="mt-8 mb-4 flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 dark:from-amber-300 dark:to-amber-500"></span>
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-700 dark:text-slate-300">
          {t('home.sections')}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10"></span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {MODULES.map((m) => {
          const count = getCardsByModule(m.slug).length;
          const title = t(`module.${m.slug}.title`);
          const desc = t(`module.${m.slug}.desc`);
          return (
            <li key={m.slug}>
              <Link
                to={`/leyes/s/${m.slug}`}
                className="group relative block overflow-hidden rounded-2xl border p-5 transition duration-200
                  border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60
                  shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                  hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.15)]
                  dark:border-white/10 dark:from-[#0f1d34] dark:to-[#0f1d34] dark:bg-[#0f1d34]
                  dark:hover:border-amber-400/40 dark:shadow-none"
              >
                {/* Banda de color superior amb degradat suau a la dreta */}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${m.accent}`}
                />
                {/* Tint sutil del color del modul al fons en hover */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 bg-gradient-to-br ${m.accent} dark:hidden`}
                  style={{ filter: 'blur(40px)' }}
                />
                <div className="relative flex items-center gap-3.5">
                  <span
                    aria-hidden
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-xl text-white
                      shadow-[0_2px_8px_-2px_rgba(15,23,42,0.15),inset_0_-2px_4px_rgba(0,0,0,0.1)]
                      ring-1 ring-inset ring-white/20`}
                  >
                    {m.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base truncate text-slate-900 dark:text-slate-100">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {desc}
                    </div>
                  </div>
                </div>
                <div className="relative mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
                    bg-slate-100/70 text-slate-600 ring-1 ring-slate-200/60
                    dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {count} {plural(t, count, 'cards')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition dark:text-slate-500 dark:group-hover:text-amber-400" aria-hidden>
                    <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">Obrir</span>
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
