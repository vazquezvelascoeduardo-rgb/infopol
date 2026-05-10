// Modal que apareix una sola vegada després del primer test
// si l'usuari encara no està registrat. Serveix per recuperar
// progrés entre dispositius.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useAuth } from '../lib/auth';

const SHOWN_KEY = 'infopol:registerNudgeShown';
const TEST_DONE_KEY = 'infopol:firstTestDone';

export default function RegisterNudge() {
  const { t } = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) return; // si ja té sessió, mai mostrem
    function maybeShow() {
      try {
        if (localStorage.getItem(SHOWN_KEY)) return;
        if (!localStorage.getItem(TEST_DONE_KEY)) return;
        setOpen(true);
      } catch { /* noop */ }
    }
    // Comprova en montar (per si l'usuari refresca la pàgina de resultats)
    // i quan TestSession dispara l'event.
    maybeShow();
    window.addEventListener('infopol:test-finished', maybeShow);
    return () => window.removeEventListener('infopol:test-finished', maybeShow);
  }, [user]);

  function close() {
    try { localStorage.setItem(SHOWN_KEY, '1'); } catch { /* noop */ }
    setOpen(false);
  }

  function goRegister() {
    close();
    navigate('/login?signup=1');
  }

  if (!open || user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rn-title"
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          background: 'var(--paper)',
          borderRadius: 20,
          border: '1px solid var(--line)',
          padding: '24px 22px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          marginBottom: 20,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3
            id="rn-title"
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontWeight: 800, fontSize: 20, color: 'var(--ink)', margin: 0,
            }}
          >
            {t('nudge.register.title')}
          </h3>
          <p style={{ marginTop: 8, color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.5 }}>
            {t('nudge.register.desc')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={goRegister}
            style={{
              width: '100%', padding: '12px 18px', borderRadius: 12,
              border: 'none', background: 'var(--terracotta)', color: '#fff',
              fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {t('nudge.register.cta')}
          </button>
          <button
            type="button"
            onClick={close}
            style={{
              width: '100%', padding: '10px 18px', borderRadius: 12,
              border: '1px solid var(--line)', background: 'transparent',
              color: 'var(--text-2)', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {t('nudge.register.skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
