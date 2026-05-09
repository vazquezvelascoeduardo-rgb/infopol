// Pantalla de perfil de l'usuari autenticat.
//
// Mostra les dades del compte (Supabase user + taula `profiles` de la
// DB compartida amb la mòbil) i les estadístiques de gamificació
// (`user_progress`: XP, level, gems, streak).
//
// Quan l'usuari encara no té progrés registrat, mostra un placeholder
// amb un enllaç a la pàgina de tests.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useT } from '../lib/i18n';

export default function Profile() {
  const { user, profile, progress, signOut } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) {
    // RequireAuth ja ho hauria de prevenir, però per si es navega
    // directament mentre la sessió encara està carregant.
    return null;
  }

  const displayName =
    profile?.name ??
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    '';
  const email = user.email ?? '';
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : '';
  const provider = (user.app_metadata?.provider as string | undefined) ?? 'email';
  const providerLabel =
    provider === 'google'
      ? 'Google'
      : provider === 'apple'
        ? 'Apple'
        : t('auth.email');

  const initial = (displayName || '?').slice(0, 1).toUpperCase();
  const hasStats = !!progress;

  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <div className="shell max-w-3xl py-8 sm:py-10 flex flex-col gap-6">
      {/* Capçalera */}
      <div className="flex items-center gap-4">
        <div
          className="user-avatar-btn"
          style={{ width: 64, height: 64, fontSize: 24, pointerEvents: 'none' }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink truncate">
            {displayName || email}
          </h1>
          {profile?.cuerpo && (
            <p className="text-sm text-text-2 truncate">
              {profile.cuerpo}
              {profile.department ? ` · ${profile.department}` : ''}
            </p>
          )}
          {!profile?.cuerpo && displayName !== email && email && (
            <p className="text-sm text-text-2 truncate">{email}</p>
          )}
        </div>
      </div>

      {/* Compte */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="eyebrow mb-4">{t('profile.account')}</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          {email && <Row label={t('profile.email')} value={email} />}
          {profile?.name && <Row label={t('profile.nameLabel')} value={profile.name} />}
          {profile?.cuerpo && <Row label={t('profile.cuerpo')} value={profile.cuerpo} />}
          {profile?.department && (
            <Row label={t('profile.department')} value={profile.department} />
          )}
          {profile?.tip_number && (
            <Row label={t('profile.tipNumber')} value={profile.tip_number} />
          )}
          <Row label={t('profile.provider')} value={providerLabel} />
          {createdAt && <Row label={t('profile.memberSince')} value={createdAt} />}
        </dl>
      </section>

      {/* Estadístiques */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="eyebrow mb-4">{t('profile.stats')}</h2>
        {hasStats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label={t('profile.xp')} value={progress!.xp.toLocaleString('ca-ES')} />
            <Stat label={t('profile.level')} value={String(progress!.level)} />
            <Stat label={t('profile.gems')} value={String(progress!.gems)} />
            <Stat label={t('profile.streak')} value={String(progress!.streak_count)} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-text-2">{t('profile.statsEmpty')}</p>
            <Link
              to="/test"
              className="self-start text-sm font-bold text-ink underline underline-offset-4"
            >
              {t('profile.statsLink')} →
            </Link>
          </div>
        )}
      </section>

      {/* Tancar sessió */}
      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="self-start rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-bold
          hover:bg-paper-2 disabled:opacity-50 transition"
        style={{ color: '#9b3030' }}
      >
        {signingOut ? t('auth.loading') : t('auth.signOut')}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[11px] uppercase tracking-wide text-text-3">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper-2 p-4 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-text-3">{label}</span>
      <span className="text-2xl font-black tracking-tight text-ink">{value}</span>
    </div>
  );
}
