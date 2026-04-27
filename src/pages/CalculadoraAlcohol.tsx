// Pàgina dedicada a la calculadora d'alcoholèmia.
// Accés directe des de home: /calculadora-alcohol
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import AlcoholCalculator from '../components/AlcoholCalculator';

export default function CalculadoraAlcohol() {
  const { t } = useT();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('recursos.alcohol.title')}</span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-rose-200/70 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        dark:border-white/10 dark:bg-gradient-to-br dark:from-[#2a0f1a] dark:to-[#0a1628]">
        <div className="flex items-start gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 text-3xl text-white shadow-inner">
            🍷
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] font-semibold text-rose-700 dark:text-rose-400/90">
              {t('recursos.alcohol.badge')}
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">
              {t('recursos.alcohol.title')}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('recursos.alcohol.desc')}
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border p-4 sm:p-5
        border-slate-200/80 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <AlcoholCalculator />
      </div>
    </div>
  );
}
