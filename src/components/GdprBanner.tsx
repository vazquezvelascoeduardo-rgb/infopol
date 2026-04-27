// Banner d'avís de privacitat (RGPD).
// Es mostra a la primera visita i s'amaga després d'acceptar.
// Es desa la decisió a localStorage per no mostrar-lo en visites futures.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

const STORAGE_KEY = 'infopol-rgpd';

export default function GdprBanner() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const accepted = window.localStorage.getItem(STORAGE_KEY);
    if (accepted !== 'yes') {
      // Petit delay perquè no aparegui en el primer pintat (suau).
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, 'yes');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('rgpd.title')}
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pt-2 sm:px-6 sm:pb-6"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-white dark:bg-[#0e2244] shadow-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0" aria-hidden>🔒</div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {t('rgpd.title')}
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">
              {t('rgpd.body')}{' '}
              <Link to="/privacitat" className="underline text-blue-700 dark:text-blue-400 font-semibold">
                {t('rgpd.more')}
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <Link
            to="/privacitat"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-2"
          >
            {t('rgpd.privacy')}
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 shadow-lg"
          >
            {t('rgpd.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
