// Botó global de "← Enrere" / "← Atrás" que apareix sota la capçalera
// en totes les pantalles tret de la home. Fa servir l'historial del
// navegador (navigate(-1)) en comptes d'una ruta fixa, així sempre
// torna a la pàgina anterior real.
import { useLocation, useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useT();

  // No tenim sentit a la home (ja és l'arrel).
  if (location.pathname === '/') return null;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition
          border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300
          dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      >
        <span aria-hidden className="text-base leading-none">←</span>
        {t('back.button')}
      </button>
    </div>
  );
}
