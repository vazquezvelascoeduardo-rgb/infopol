// Tour d'onboarding de 3 passos per a la primera visita.
// Es mostra una sola vegada (marca localStorage 'infopol:onboarded').
// L'usuari pot tancar-lo en qualsevol moment.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useAuth } from '../lib/auth';

const STORAGE_KEY = 'infopol:onboarded';

export default function OnboardingTour() {
  const { t } = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let alreadyDone = false;
    try {
      alreadyDone = !!window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage pot fallar en mode privat — assumim no fet i mostrem.
    }
    if (alreadyDone) return;
    // Petit retard perquè no aparegui alhora que el banner RGPD.
    const id = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  function close() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* noop */
    }
    setOpen(false);
  }

  function next() {
    setStep((s) => Math.min(s + 1, 2));
  }

  function goAndClose(path: string) {
    close();
    navigate(path);
  }

  if (!open) return null;

  const STEPS = [
    {
      icon: '👋',
      title: t('onboarding.step1.title'),
      desc: t('onboarding.step1.desc'),
      cta: t('onboarding.continue'),
      action: next,
    },
    {
      icon: '🎯',
      title: t('onboarding.step2.title'),
      desc: t('onboarding.step2.desc'),
      cta: t('onboarding.step2.cta'),
      action: () => goAndClose('/academia'),
      altCta: t('onboarding.continue'),
      altAction: next,
    },
    {
      icon: '💾',
      title: user ? t('onboarding.step3.titleAuth') : t('onboarding.step3.title'),
      desc: user ? t('onboarding.step3.descAuth') : t('onboarding.step3.desc'),
      cta: user ? t('onboarding.finish') : t('onboarding.step3.cta'),
      action: user ? close : () => goAndClose('/login'),
      altCta: user ? undefined : t('onboarding.skipRegister'),
      altAction: user ? undefined : close,
    },
  ];

  const current = STEPS[step];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn .2s ease-out',
      }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'var(--paper)',
          borderRadius: 20,
          border: '1px solid var(--line)',
          padding: '28px 24px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t('onboarding.close')}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: 999,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-3)',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 12 }}>{current.icon}</div>
          <h2
            id="ob-title"
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontWeight: 800,
              fontSize: 22,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            {current.title}
          </h2>
          <p
            style={{
              marginTop: 10,
              color: 'var(--text-2)',
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {current.desc}
          </p>
        </div>

        {/* Indicador de passos */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            margin: '18px 0 18px',
          }}
          aria-hidden
        >
          {STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? 'var(--terracotta)' : 'var(--line)',
                transition: 'all .2s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={current.action}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {current.cta}
          </button>
          {current.altCta && (
            <button
              type="button"
              onClick={current.altAction}
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'transparent',
                color: 'var(--text-2)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {current.altCta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
