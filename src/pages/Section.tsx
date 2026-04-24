// Pàgina d'un mòdul: capçalera amb accent de color i llistat de fitxes.
import { Link, useParams } from 'react-router-dom';
import { MODULES, getCardsByModule } from '../lib/content';

export default function Section() {
  const { moduleSlug = '' } = useParams();
  const mod = MODULES.find((m) => m.slug === moduleSlug);

  if (!mod) {
    return (
      <div>
        <p className="text-slate-400">Secció no trobada.</p>
        <Link to="/" className="text-amber-400 underline">
          Torna a l'inici
        </Link>
      </div>
    );
  }

  const cards = getCardsByModule(moduleSlug);

  return (
    <div>
      <nav className="text-sm text-slate-400">
        <Link to="/" className="hover:underline">
          Inici
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{mod.title}</span>
      </nav>

      {/* Capçalera del mòdul amb accent de color */}
      <section className="relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1d34] p-5 sm:p-6 shadow">
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
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-50">
              {mod.title}
            </h1>
            <p className="text-sm text-slate-300">{mod.description}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
            {cards.length} {cards.length === 1 ? 'fitxa' : 'fitxes'}
          </span>
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/15 p-6 text-center text-slate-400">
          Encara no hi ha fitxes en aquesta secció.
          <br />
          Afegeix un fitxer <code className="rounded bg-white/10 px-1 text-slate-200">.html</code>{' '}
          o <code className="rounded bg-white/10 px-1 text-slate-200">.md</code> a{' '}
          <code className="rounded bg-white/10 px-1 text-slate-200">content/{mod.slug}/</code>.
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-1 gap-2">
          {cards.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/s/${c.moduleSlug}/${c.slug}`}
                className="group block rounded-xl border border-white/10 bg-[#0f1d34] px-4 py-3 hover:border-amber-400/40 hover:bg-[#13243e] transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm text-slate-300 ring-1 ring-white/10"
                  >
                    {c.kind === 'html' ? '🖼️' : '📝'}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-100 truncate">
                      {c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400 truncate">
                      {summary(c.searchText)}
                    </div>
                  </div>
                  <span className="ml-auto text-amber-400 opacity-0 group-hover:opacity-100 transition" aria-hidden>
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

// Extreu un resum curt del text pla.
function summary(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > 140 ? t.slice(0, 137) + '…' : t;
}
