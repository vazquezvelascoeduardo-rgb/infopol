// Banner d'avís de privacitat (RGPD).
// Es mostra a la primera visita i s'amaga després d'acceptar.
// Es desa la decisió a localStorage per no mostrar-lo en visites futures.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { A } from '../lib/design';

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
      <div className="mx-auto max-w-3xl" style={{ background: A.card, border: `1px solid ${A.line2}`, borderRadius: A.rxl, boxShadow: A.shadowLg, padding: 'clamp(16px,3vw,22px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, background: A.terraSoft, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 22 }} aria-hidden>🔒</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontFamily: A.display, fontWeight: 700, fontSize: 16, letterSpacing: -0.3, color: A.ink }}>
              {t('rgpd.title')}
            </h2>
            <p style={{ margin: '5px 0 0', fontFamily: A.sans, fontSize: 13.5, lineHeight: 1.55, color: A.inkSoft }}>
              {t('rgpd.body')}{' '}
              <Link to="/privacitat" style={{ textDecoration: 'underline', color: A.blue, fontWeight: 600 }}>
                {t('rgpd.more')}
              </Link>
              .
            </p>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <Link to="/privacitat" style={{ fontFamily: A.display, fontWeight: 600, fontSize: 12.5, color: A.inkMuted, padding: '8px 12px', textDecoration: 'none' }}>
            {t('rgpd.privacy')}
          </Link>
          <button type="button" onClick={accept} className="a-btn" style={{ border: 'none', cursor: 'pointer', borderRadius: 14, background: A.ink, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 14, padding: '11px 22px', boxShadow: A.shadowMd }}>
            {t('rgpd.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
