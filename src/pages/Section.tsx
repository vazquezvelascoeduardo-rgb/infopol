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
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{modTitle}</span>
      </nav>

      <section className="relative mt-3 overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34] dark:shadow-none">
        <span
          aria-hidden
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${mod.accent}`}
        />
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mod.accent} text-xl text-white shadow-inner`}
          >
            {mod.icon}
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{modTitle}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{modDesc}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ring-1
            bg-slate-50 text-slate-600 ring-slate-200
            dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
            {cards.length} {plural(t, cards.length, 'cards')}
          </span>
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-6 text-center
          border-slate-300 text-slate-500
          dark:border-white/15 dark:text-slate-400">
          {t('section.empty')}
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-2">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="group block rounded-xl border px-4 py-3 transition
                  border-slate-200 bg-white hover:border-amber-400/60 hover:bg-slate-50
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40 dark:hover:bg-[#13243e]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ring-1
                      bg-slate-50 ring-slate-200
                      dark:bg-white/5 dark:ring-white/10"
                  >
                    {c.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{c.title}</div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                      {summary(c.searchText)}
                    </div>
                  </div>
                  <span className="ml-auto text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition" aria-hidden>
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
