// Pàgina de referència ràpida — Taula de quantitats consum propi vs
// tràfic (Pautes UF 3.3). Dades hardcoded segons l'spec d'InfoPol.
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';

const TAULA_DROGUES: Array<{
  substancia: string;
  dosi_habitual: string;
  consum_3_5_dies: string;
  notes?: string;
}> = [
  { substancia: 'Heroïna', dosi_habitual: '50-150 mg', consum_3_5_dies: '3 g màxim' },
  { substancia: 'Cocaïna', dosi_habitual: '100-260 mg', consum_3_5_dies: '7,5 g màxim' },
  { substancia: 'Marihuana', dosi_habitual: '1,5-2 g', consum_3_5_dies: '100 g màxim' },
  { substancia: 'Haixix', dosi_habitual: '0,3-0,5 g', consum_3_5_dies: '25 g màxim' },
  { substancia: 'LSD', dosi_habitual: '0,019-0,032 mg', consum_3_5_dies: '3 mg màxim' },
  { substancia: 'Amfetamines', dosi_habitual: '30-60 mg', consum_3_5_dies: '900 mg màxim' },
  { substancia: 'MDMA', dosi_habitual: '20-150 mg', consum_3_5_dies: '2,4 g màxim' },
  { substancia: 'Ketamina', dosi_habitual: '—', consum_3_5_dies: '1 g màxim' },
  { substancia: 'GHB / GBL', dosi_habitual: '—', consum_3_5_dies: '15 g màxim' },
  { substancia: '2CB (rosa)', dosi_habitual: '—', consum_3_5_dies: '3 g màxim' },
];

export default function PenalTaulaDrogues() {
  const { t } = useT();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa" className="hover:underline">{t('operativa.title')}</Link>
        <span aria-hidden>/</span>
        <Link to="/operativa/penal" className="hover:underline">
          {t('operativa.seguretat-ciutadana.title')}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium">
          {t('penal.taulaDrogues')}
        </span>
      </nav>

      <header className="rounded-2xl border p-5 mb-5
        border-slate-200 bg-white
        dark:border-white/10 dark:bg-[#0f1d34]">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-3xl shrink-0">💊</span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">
              {t('operativa.seguretat-ciutadana.title')}
            </div>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-extrabold tracking-tight">
              {t('penal.taulaDrogues.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('penal.taulaDrogues.desc')}
            </p>
          </div>
        </div>
      </header>

      {/* Avís legal */}
      <div className="mb-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50 p-3 text-sm text-amber-900
        dark:border-l-amber-400/70 dark:bg-amber-400/10 dark:text-amber-100">
        <div className="font-bold mb-1">⚠️ {t('penal.taulaDrogues.warning')}</div>
        <p>{t('penal.taulaDrogues.warningText')}</p>
      </div>

      {/* Taula */}
      <div className="rounded-xl border overflow-hidden
        border-slate-200 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-white/5 text-left">
            <tr>
              <th className="px-3 py-2 font-bold">{t('penal.taulaDrogues.substance')}</th>
              <th className="px-3 py-2 font-bold">{t('penal.taulaDrogues.usualDose')}</th>
              <th className="px-3 py-2 font-bold">{t('penal.taulaDrogues.limit35')}</th>
            </tr>
          </thead>
          <tbody>
            {TAULA_DROGUES.map((row, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 0
                    ? 'bg-white dark:bg-[#0f1d34]'
                    : 'bg-slate-50 dark:bg-white/5'
                }
              >
                <td className="px-3 py-2 font-semibold">{row.substancia}</td>
                <td className="px-3 py-2 font-mono">{row.dosi_habitual}</td>
                <td className="px-3 py-2 font-mono">{row.consum_3_5_dies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes interpretatives */}
      <div className="mt-5 rounded-xl border p-4 text-sm
        border-slate-200 bg-slate-50 text-slate-700
        dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <div className="font-bold mb-2">📌 {t('penal.taulaDrogues.howToInterpret')}</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('penal.taulaDrogues.note1')}</li>
          <li>{t('penal.taulaDrogues.note2')}</li>
          <li>{t('penal.taulaDrogues.note3')}</li>
          <li>{t('penal.taulaDrogues.note4')}</li>
        </ul>
      </div>
    </div>
  );
}
