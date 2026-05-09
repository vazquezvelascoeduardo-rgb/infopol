// Pagina de logros (/test/logros): mostra TOTS els logros disponibles
// amb el seu estat (desbloquejat / bloquejat). Els bloquejats es veuen
// difuminats i amb la descripció visible.
import { Link } from 'react-router-dom';
import { ACHIEVEMENTS } from '../../lib/achievements';
import { useGlobalStats } from '../../lib/testStats';
import { useT } from '../../lib/i18n';

export default function Achievements() {
  const { t } = useT();
  const stats = useGlobalStats();
  const unlockedSet = new Set(stats.achievements);
  const total = ACHIEVEMENTS.length;
  const unlocked = unlockedSet.size;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link to="/policia-local" className="hover:underline">{t('test.list.title')}</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-700 dark:text-slate-200">{t('test.achievements.title')}</span>
      </nav>

      <header className="rounded-2xl border p-5 sm:p-6 mb-5
        border-amber-200/70 bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/40
        dark:border-amber-400/30 dark:bg-gradient-to-br dark:from-[#2a210f] dark:to-[#0f1d34]">
        <div className="flex items-center gap-4">
          <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-700 text-3xl text-white shadow-inner">
            🏅
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('test.achievements.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {unlocked} / {total} {t('test.achievements.unlocked')}
            </p>
          </div>
        </div>
        {/* Barra de progrés */}
        <div className="mt-3 h-2 rounded-full bg-amber-100 dark:bg-amber-400/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all"
            style={{ width: `${total > 0 ? (unlocked / total) * 100 : 0}%` }}
          />
        </div>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlockedSet.has(a.id);
          return (
            <li
              key={a.id}
              className={`rounded-xl border p-4 flex items-start gap-3 transition
                ${isUnlocked
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 dark:border-amber-400/40 dark:from-[#2a210f] dark:to-[#0f1d34] shadow-sm'
                  : 'border-slate-200 bg-slate-50/40 dark:border-white/10 dark:bg-white/5 opacity-60'}`}
            >
              <span className={`text-3xl shrink-0 ${isUnlocked ? '' : 'grayscale'}`} aria-hidden>
                {isUnlocked ? a.icon : '🔒'}
              </span>
              <div className="min-w-0 flex-1">
                <div className={`font-bold text-sm ${isUnlocked ? 'text-amber-800 dark:text-amber-200' : 'text-slate-600 dark:text-slate-400'}`}>
                  {a.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {a.description}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 text-center">
        <Link
          to="/policia-local"
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2.5 text-sm font-semibold
            border-slate-200 bg-white text-slate-700 hover:bg-slate-50
            dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          ← {t('test.backToList')}
        </Link>
      </div>
    </div>
  );
}
