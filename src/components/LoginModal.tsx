// Modal de login d'InfoPol. Mostra un drawer amb dos botons (Google +
// Apple Sign-In) i una breu explicació de què guanya l'usuari en
// registrar-se. Quan el backend (Supabase) no està configurat al
// build, el component no es mostra mai (el sidebar amaga el botó).
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';

type Props = { open: boolean; onClose: () => void };

export default function LoginModal({ open, onClose }: Props) {
  const { signInWithGoogle, signInWithApple, backendEnabled } = useAuth();

  // Tanca amb Escape + bloqueja l'scroll del body mentre està obert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !backendEnabled) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sessió"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
    >
      <button
        aria-label="Tancar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <div
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto
          rounded-t-2xl sm:rounded-2xl shadow-2xl bg-white text-ink
          dark:bg-[#0f1d34] dark:text-slate-100"
        style={{ borderTop: '4px solid var(--terracotta)' }}
      >
        <div className="px-5 sm:px-6 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600
              text-white text-2xl shadow-inner">
              🔐
            </span>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] font-bold
                text-orange-700 dark:text-orange-300">
                Sincronització · InfoPol
              </div>
              <h2 className="mt-1 text-lg font-bold leading-snug">
                Inicia sessió per sincronitzar el teu progrés
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Tancar"
              className="ml-auto rounded-md p-1.5 -mr-1
                text-slate-500 hover:bg-slate-100 hover:text-slate-900
                dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <ul className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">✓</span>
              Continua els tests des de qualsevol dispositiu
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">✓</span>
              Cua de repàs Anki sincronitzada
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">✓</span>
              Lliga setmanal real entre opositors
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">✓</span>
              Favorits i avatar entre dispositius
            </li>
          </ul>

          <div className="mt-5 grid gap-2.5">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center justify-center gap-3 rounded-xl border
                px-4 py-3 text-sm font-bold transition
                border-slate-200 bg-white text-slate-900 hover:bg-slate-50
                dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <GoogleIcon />
              Continua amb Google
            </button>
            <button
              type="button"
              onClick={signInWithApple}
              className="inline-flex items-center justify-center gap-3 rounded-xl border
                px-4 py-3 text-sm font-bold transition
                border-black bg-black text-white hover:bg-black/85
                dark:border-white/15 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <AppleIcon />
              Continua amb Apple
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            En continuar acceptes l'avís legal i la política de privacitat.
            El teu progrés local actual es migra al teu compte la primera
            vegada que entres.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.4-4.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.4 0-13.8 4.1-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 45.5c5.4 0 10.3-2 14-5.3l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 41.2 16.2 45.5 24 45.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C42.6 35.7 45.5 30.7 45.5 25c0-1.5-.2-3-.4-4.5z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM254.6 113.6c30.9-36.7 28.1-70.1 27.2-82.1-27.3 1.6-58.9 18.6-76.9 39.5-19.8 22.4-31.5 50.1-29 81.5 29.5 2.3 56.4-12.8 78.7-38.9z"/>
    </svg>
  );
}
