// Botó "tornar enrere" que apareix a totes les rutes excepte la home.
// Es posiciona just sota el header (que és fixe) i a l'esquerra del
// contingut. Usa l'historial del navegador si n'hi ha; altrament,
// torna a /.
import { useLocation, useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';

export default function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useT();

  // No mostrar a la home ni al login (eviten redundància).
  if (location.pathname === '/' || location.pathname === '/login') return null;

  function handleClick() {
    // Si hi ha història dins l'app (no només l'entrada directa), retrocedeix.
    // window.history.length > 1 no és infal·lible perquè inclou navegacions
    // anteriors al lloc, però funciona en la majoria de casos d'estudi.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="back-btn-wrap">
      <button
        type="button"
        onClick={handleClick}
        className="back-btn"
        aria-label={t('nav.back')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        <span>{t('nav.back')}</span>
      </button>
    </div>
  );
}
