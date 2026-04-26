// Pàgina d'un mòdul: capçalera amb accent de color i llistat de fitxes.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';
import { plural, useT } from '../lib/i18n';

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);
  const { t } = useT();

  if (!mod) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">{t('section.notFound')}</p>
        <Link to="/" className="text-amber-600 dark:text-amber-400 underline">
          {t('back.home')}
        </Link>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);
  const modTitle = t(`module.${mod.slug}.title`);
  const modDesc = t(`module.${mod.slug}.desc`);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-slate-900 hover:underline transition dark:hover:text-slate-100">{t('nav.home')}</Link>
        <span aria-hidden className="text-slate-300 dark:text-slate-600">/</span>
        <Link to="/leyes" className="hover:text-slate-900 hover:underline transition dark:hover:text-slate-100">{t('leyes.title')}</Link>
        <span aria-hidden className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{modTitle}</span>
      </nav>

      <section className="relative mt-4 overflow-hidden rounded-2xl border p-5 sm:p-6
        border-slate-200/80 bg-gradient-to-br from-white to-slate-50/60
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:from-[#0f1d34] dark:to-[#0f1d34] dark:bg-[#0f1d34] dark:shadow-none">
        <span
          aria-hidden
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${mod.accent}`}
        />
        {/* Glow del color del modul a l'angle superior dret */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-15 blur-3xl bg-gradient-to-br ${mod.accent} dark:hidden`}
        />
        <div className="relative flex items-center gap-4">
          <span
            aria-hidden
            className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.accent} text-2xl text-white
              shadow-[0_4px_12px_-4px_rgba(15,23,42,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)]
              ring-1 ring-inset ring-white/20`}
          >
            {mod.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{modTitle}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{modDesc}</p>
          </div>
          <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
            bg-white/80 text-slate-700 ring-1 ring-slate-200/80 backdrop-blur
            dark:bg-white/5 dark:text-slate-200 dark:ring-white/10">
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br ${mod.accent}`} />
            {cards.length} {plural(t, cards.length, 'cards')}
          </span>
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm
          border-slate-300 bg-slate-50/50 text-slate-500
          dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
          {t('section.empty')}
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-2">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/leyes/s/${c.moduleSlug}/${c.slug}`}
                className="group block rounded-xl border px-4 py-3.5 transition duration-150
                  border-slate-200/80 bg-white
                  hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40 dark:hover:bg-[#13243e]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ring-1
                      bg-gradient-to-br from-slate-50 to-slate-100/80 ring-slate-200/80
                      dark:bg-white/5 dark:ring-white/10
                      group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-offset-white
                      transition-all duration-150`}
                    style={
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { '--tw-ring-color': 'rgba(0,0,0,0)' } as any
                    }
                  >
                    {c.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                      {summary(c.searchText)}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all duration-150
                      dark:text-slate-600 dark:group-hover:text-amber-400"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function summary(text: string): string {
  const s = text.replace(/\s+/g, ' ').trim();
  return s.length > 140 ? s.slice(0, 137) + '…' : s;
}
