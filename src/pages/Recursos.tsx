// Pàgina de recursos ràpids — farmàcia de guàrdia, codi alfanumèric
// i altres eines útils per a una intervenció.
//
// Filosofia: tot ha de ser ACCESSIBLE EN 1 TAP des d'aquí. Si afegim
// nous recursos, aquesta pàgina és el punt central.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

// Codi alfanumèric per a comunicacions per ràdio. Base = alfabet
// fonètic policial espanyol (Antonio, Barcelona...) + Ñ (Ñoño) que ja
// es fa servir + Ç (Capça) com a extensió específica catalana.
const CODI_ALFANUMERIC: Array<{ letra: string; paraula: string }> = [
  { letra: 'A', paraula: 'Antonio' },
  { letra: 'B', paraula: 'Barcelona' },
  { letra: 'C', paraula: 'Carmen' },
  { letra: 'Ç', paraula: 'Capça' },
  { letra: 'D', paraula: 'Daniel' },
  { letra: 'E', paraula: 'Enrique' },
  { letra: 'F', paraula: 'Francia' },
  { letra: 'G', paraula: 'Granada' },
  { letra: 'H', paraula: 'Historia' },
  { letra: 'I', paraula: 'Inés' },
  { letra: 'J', paraula: 'José' },
  { letra: 'K', paraula: 'Kilo' },
  { letra: 'L', paraula: 'Lorenzo' },
  { letra: 'M', paraula: 'Madrid' },
  { letra: 'N', paraula: 'Navarra' },
  { letra: 'Ñ', paraula: 'Ñoño' },
  { letra: 'O', paraula: 'Oviedo' },
  { letra: 'P', paraula: 'París' },
  { letra: 'Q', paraula: 'Querido' },
  { letra: 'R', paraula: 'Ramón' },
  { letra: 'S', paraula: 'Sábado' },
  { letra: 'T', paraula: 'Toledo' },
  { letra: 'U', paraula: 'Ulises' },
  { letra: 'V', paraula: 'Valencia' },
  { letra: 'W', paraula: 'Washington' },
  { letra: 'X', paraula: 'Xilófono' },
  { letra: 'Y', paraula: 'Yegua' },
  { letra: 'Z', paraula: 'Zaragoza' },
];

export default function Recursos() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('recursos.title')}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-emerald-200/70 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1d34] dark:to-[#0a1628]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-3xl text-white shadow-inner">
            🧰
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-emerald-700 dark:text-emerald-400/90">
              {t('recursos.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('recursos.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('recursos.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* ── Recurs 1: Farmàcia de guàrdia Viladecans ───────────────── */}
      <section className="mb-5">
        <a
          href="https://www.farmaguia.net/desktop/municipi/viladecans"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border p-5 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md
            border-slate-200 bg-white hover:border-green-400/60
            dark:border-white/10 dark:bg-[#0f1d34] dark:hover:border-green-400/40"
        >
          <div className="flex items-start gap-4">
            <span aria-hidden className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-2xl text-white shadow-inner">
              💊
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-green-700 dark:text-green-400">
                {t('recursos.farmacia.badge')}
              </div>
              <h2 className="mt-0.5 text-lg sm:text-xl font-bold">
                {t('recursos.farmacia.title')}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {t('recursos.farmacia.desc')}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 break-all">
                <span aria-hidden>🔗</span> farmaguia.net
              </div>
            </div>
            <span aria-hidden className="text-green-600 dark:text-green-400 text-xl shrink-0 self-center">
              ↗
            </span>
          </div>
        </a>
      </section>

      {/* ── Recurs 2: Codi alfanumèric ─────────────────────────────── */}
      <section className="mb-5">
        <div className="rounded-2xl border overflow-hidden
          border-slate-200 bg-white
          dark:border-white/10 dark:bg-[#0f1d34]">
          {/* Capçalera del recurs */}
          <div className="px-5 pt-4 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <div className="flex items-start gap-3">
              <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-xl text-white shadow-inner">
                🔤
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-700 dark:text-blue-400">
                  {t('recursos.codi.badge')}
                </div>
                <h2 className="text-lg sm:text-xl font-bold">
                  {t('recursos.codi.title')}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                  {t('recursos.codi.desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Graella de lletres */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 p-3">
            {CODI_ALFANUMERIC.map((item) => (
              <li
                key={item.letra}
                className="flex items-baseline gap-2 rounded-lg px-3 py-2 transition
                  hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span
                  className="font-black text-xl text-blue-700 dark:text-blue-400 w-6 shrink-0 text-center"
                  aria-hidden
                >
                  {item.letra}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {item.paraula}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Placeholder informatiu — més recursos en el futur */}
      <div className="rounded-xl border border-dashed p-5 text-center text-sm
        border-slate-300 bg-slate-50/50 text-slate-500
        dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
        💡 {t('recursos.moreToCome')}
      </div>
    </div>
  );
}
