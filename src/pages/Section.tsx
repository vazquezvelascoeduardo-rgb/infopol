// Pàgina d'un mòdul: capçalera amb accent de color i llistat de fitxes.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);

  if (!mod) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <p className="text-slate-600 dark:text-slate-400">Secció no trobada.</p>
        <Link to="/" className="text-amber-600 dark:text-amber-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:underline">Inici</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700 dark:text-slate-200">{mod.title}</span>
      </nav>

      {/* Capçalera del mòdul */}
      <section className="relative mt-3 overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
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
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{mod.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{mod.description}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ring-1
            bg-slate-100 text-slate-600 ring-slate-200
            dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
            {cards.length} {cards.length === 1 ? 'fitxa' : 'fitxes'}
          </span>
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-6 text-center
          border-slate-300 text-slate-500
          dark:border-white/15 dark:text-slate-400">
          Encara no hi ha fitxes en aquesta secció.
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-2">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="group block rounded-xl border px-4 py-3 transition
                  border-slate-200 bg-white hover:border-amber-400/60 hover:bg-amber-50/50
                  dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-amber-400/40 dark:hover:bg-[#13243e]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ring-1
                      bg-slate-100 ring-slate-200
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
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > 140 ? t.slice(0, 137) + '…' : t;
}
