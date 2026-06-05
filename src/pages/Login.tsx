// Pantalla d'inici de sessió i registre.
//
// Mètodes:
//   - Email + contrasenya (entrar i crear compte)
//   - Google OAuth (mateix projecte Supabase que la app mòbil)
//   - Recuperació de contrasenya
//
// Si l'usuari ja està autenticat, redirigeix a `/` (o al `?next=…`).
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useT } from '../lib/i18n';
import { A } from '../lib/design';

type Mode = 'signin' | 'signup';

export default function Login() {
  const { t } = useT();
  const {
    user,
    loading: authLoading,
    backendEnabled,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    requestPasswordReset,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const next = params.get('next') ?? '/';
  const initialMode: Mode = params.get('mode') === 'signup' ? 'signup' : 'signin';

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Tradueix els missatges d'error de Supabase a missatges humans en
  // català. Així l'usuari sap si és la seva culpa o si Supabase l'ha
  // bloquejat per massa intents (rate limit).
  function humanizeAuthError(err: unknown): string {
    const raw = (err instanceof Error ? err.message : String(err)).toLowerCase();
    if (/rate.?limit|too many|429/.test(raw)) return t('auth.error.rateLimit');
    if (/invalid.?(login|credentials|email|password)/.test(raw)) return t('auth.error.invalidCredentials');
    if (/already.?registered|user already exists|already exists/.test(raw)) return t('auth.error.userExists');
    if (/email.?not.?confirmed|confirm.*email/.test(raw)) return t('auth.error.emailNotConfirmed');
    if (/network|fetch|failed to fetch/.test(raw)) return t('auth.error.network');
    return err instanceof Error ? err.message : t('auth.error.generic');
  }

  // Indicador de força de contrasenya (només informatiu — la lògica
  // real de validació la porta Supabase i el check de longitud).
  function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
    if (pw.length === 0) return { level: 0, label: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { level: 1, label: t('auth.password.weak') };
    if (score === 3) return { level: 2, label: t('auth.password.medium') };
    return { level: 3, label: t('auth.password.strong') };
  }

  // Si la sessió ja està iniciada, fora.
  useEffect(() => {
    if (!authLoading && user) {
      navigate(next, { replace: true });
    }
  }, [authLoading, user, next, navigate]);

  if (!backendEnabled) {
    return (
      <div className="shell py-12">
        <p className="text-text-2">
          {t('auth.backendDisabled')}
        </p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setInfo(null);

    const trimmed = email.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(trimmed)) {
      setError(t('auth.invalidEmail'));
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setError(t('auth.shortPassword'));
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithPassword(trimmed, password);
        // L'efecte de dalt redirigirà quan `user` quedi definit.
      } else {
        const { needsEmailConfirmation } = await signUpWithPassword(
          trimmed,
          password,
          name.trim().slice(0, 80) || undefined,
          wantsNewsletter,
        );
        if (needsEmailConfirmation) {
          setInfo(t('auth.confirmEmail'));
          setMode('signin');
          setPassword('');
        }
      }
    } catch (err: unknown) {
      setError(humanizeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setInfo(null);
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      // Supabase redirigeix la pàgina; no cal fer res més aquí.
    } catch (err: unknown) {
      setError(humanizeAuthError(err));
      setGoogleBusy(false);
    }
  }

  async function onForgot() {
    if (!email.trim()) {
      setError(t('auth.forgotPrompt'));
      return;
    }
    setError(null);
    setInfo(null);
    try {
      await requestPasswordReset(email.trim());
      setInfo(t('auth.forgotSent'));
    } catch (err: unknown) {
      setError(humanizeAuthError(err));
    }
  }

  const isSignup = mode === 'signup';
  const disabled = submitting || googleBusy;

  return (
    <div className="shell max-w-md py-8 sm:py-12">
      {/* Capçalera */}
      <div className="flex flex-col items-center gap-3 mb-7">
        <Link to="/" aria-label={t('nav.home')} className="brand-shield-link">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden width="56" height="56">
            <path
              d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z"
              fill="var(--ink)"
            />
            <circle cx="32" cy="22" r="4.2" fill="var(--terracotta)" />
            <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill="var(--terracotta)" />
          </svg>
        </Link>
        <h1 className="text-2xl sm:text-3xl tracking-tight text-ink text-center" style={{ fontFamily: A.display, fontWeight: 700, letterSpacing: '-0.03em' }}>
          {isSignup ? t('auth.title.signup') : t('auth.title.signin')}
        </h1>
        <p className="text-sm text-text-2 text-center">
          {isSignup ? t('auth.subtitle.signup') : t('auth.subtitle.signin')}
        </p>
      </div>

      {/* Avís quan s'arriba aquí per intentar accedir a una zona privada */}
      {next !== '/' && (
        <div
          className="mb-5 rounded-xl border px-4 py-3 text-sm text-text-2 flex items-start gap-2.5"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-2)' }}
          role="status"
        >
          <span aria-hidden className="text-base leading-none mt-0.5">🔒</span>
          <span>Inicia sessió per accedir a aquesta secció i desar el teu progrés.</span>
        </div>
      )}

      <div style={{ background: A.card, border: `1px solid ${A.line}`, borderRadius: A.rxl, boxShadow: A.shadowMd, padding: 'clamp(18px,4vw,26px)' }}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {isSignup && (
          <Field
            label={t('auth.name')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            autoComplete="name"
          />
        )}
        <Field
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          autoComplete="email"
          required
        />
        <PasswordField
          label={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={disabled}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          show={showPassword}
          onToggleShow={() => setShowPassword((s) => !s)}
          showLabel={t('auth.password.show')}
          hideLabel={t('auth.password.hide')}
        />

        {/* Indicador de força (només a signup i amb password no buit) */}
        {isSignup && password.length > 0 && (() => {
          const s = passwordStrength(password);
          const colors = ['#e5e7eb', '#dc2626', '#d97706', '#15803d'];
          return (
            <div className="flex items-center gap-2 -mt-1">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{ background: i <= s.level ? colors[s.level] : colors[0] }}
                  />
                ))}
              </div>
              <span
                className="text-[11px] font-semibold"
                style={{ color: colors[s.level] || 'var(--text-3)' }}
              >
                {s.label}
              </span>
            </div>
          );
        })()}

        {/* Opt-in del resum diari de notícies (només a signup, no-premarcat per RGPD) */}
        {isSignup && (
          <label className="flex items-start gap-2 cursor-pointer select-none mt-1 rounded-xl border border-line bg-paper-2 p-3">
            <input
              type="checkbox"
              checked={wantsNewsletter}
              onChange={(e) => setWantsNewsletter(e.target.checked)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 cursor-pointer"
              style={{ accentColor: 'var(--terracotta)' }}
            />
            <span className="text-xs text-text-2 leading-relaxed">
              <strong className="text-ink">Vull rebre el resum diari de notícies</strong>{' '}
              <span className="text-text-3">(recomanat)</span>
              <br />
              Cada matí, les 5 notícies més rellevants per a policia local al teu correu.
              Pots donar-te de baixa quan vulguis des de <em>/perfil</em>.
            </span>
          </label>
        )}

        {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}
        {info && <p className="text-sm text-emerald-700 dark:text-emerald-400">{info}</p>}

        <button
          type="submit"
          disabled={!email || !password || disabled}
          className="mt-2 w-full rounded-xl px-4 py-3 text-base font-bold text-white shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed transition"
          style={{ background: 'var(--ink)' }}
        >
          {submitting ? t('auth.loading') : isSignup ? t('auth.signUp') : t('auth.signIn')}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-[0.2em] text-text-3">
          {t('auth.or')}
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl border
          px-4 py-3 text-sm font-bold transition
          border-line bg-paper hover:bg-paper-2
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {googleBusy ? t('auth.loading') : t('auth.continueWithGoogle')}
      </button>

      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setInfo(null);
            setMode(isSignup ? 'signin' : 'signup');
          }}
          className="text-sm font-semibold text-ink underline underline-offset-4"
        >
          {isSignup ? t('auth.toggleToSignin') : t('auth.toggleToSignup')}
        </button>
        {!isSignup && (
          <button
            type="button"
            onClick={onForgot}
            className="text-xs text-text-3 hover:text-ink"
          >
            {t('auth.forgot')}
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-2">
        {label}
      </span>
      <input
        {...props}
        className="rounded-xl border px-4 py-3 text-base outline-none focus:ring-2
          border-line bg-paper text-ink placeholder-text-3
          disabled:opacity-50"
        style={{ borderColor: 'var(--line)' }}
      />
    </label>
  );
}

function PasswordField({
  label,
  show,
  onToggleShow,
  showLabel,
  hideLabel,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  show: boolean;
  onToggleShow: () => void;
  showLabel: string;
  hideLabel: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-2">
        {label}
      </span>
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          required
          className="w-full rounded-xl border px-4 py-3 pr-11 text-base outline-none focus:ring-2
            border-line bg-paper text-ink placeholder-text-3
            disabled:opacity-50"
          style={{ borderColor: 'var(--line)' }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? hideLabel : showLabel}
          title={show ? hideLabel : showLabel}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8
            items-center justify-center rounded-md text-text-3 hover:text-ink
            hover:bg-paper-2 transition"
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <path d="M2 2l20 20" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.4-4.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.4 0-13.8 4.1-17.7 10.2z" />
      <path fill="#4CAF50" d="M24 45.5c5.4 0 10.3-2 14-5.3l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 41.2 16.2 45.5 24 45.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C42.6 35.7 45.5 30.7 45.5 25c0-1.5-.2-3-.4-4.5z" />
    </svg>
  );
}
