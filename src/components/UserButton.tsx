// Botó d'usuari del header.
// - Sense sessió: botó "Entrar" cap a /login.
// - Amb sessió: avatar circular amb la inicial; clic → /perfil.
// Quan el backend no està habilitat (sense VITE_SUPABASE_*), no es
// renderitza res.
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useT } from '../lib/i18n';

export default function UserButton() {
  const { user, loading, profile, backendEnabled } = useAuth();
  const { t } = useT();

  if (!backendEnabled) return null;

  // Mentre resolem la sessió inicial, deixem un placeholder per evitar
  // un "salt" del header (el botó passa de Entrar → avatar).
  if (loading) {
    return (
      <div
        aria-hidden
        className="icon-btn animate-pulse"
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        title={t('auth.signInOrUp')}
        aria-label={t('auth.signInOrUp')}
        className="icon-btn user-btn-signin"
      >
        <UserIcon />
        <span className="user-btn-label">{t('auth.signIn')}</span>
      </Link>
    );
  }

  const displayName =
    profile?.name ??
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    '';
  const initial = (displayName || '?').slice(0, 1).toUpperCase();

  return (
    <Link
      to="/perfil"
      title={displayName}
      aria-label={t('auth.profile')}
      className="user-avatar-btn"
    >
      {initial}
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
