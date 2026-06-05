// Pantalla de perfil de l'usuari autenticat.
//
// Seccions:
//   - Capçalera (avatar + nom + cuerpo·dept)
//   - Estadístiques (XP, level, gems, streak de `user_progress`)
//   - Editar perfil (nom, cuerpo, núm. TIP, departament — taula `profiles`)
//   - Compte (correu, mètode d'accés, membre des de — read-only)
//   - Seguretat (canvi de contrasenya, només per usuaris d'email)
//   - Sortir
//   - Zona de perill (sol·licitar eliminació de compte via mailto)
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useT } from '../lib/i18n';
import { updateProfile } from '../lib/db';
import MfaSection from '../components/MfaSection';
import { A } from '../lib/design';

// Email del suport per a peticions d'eliminació de compte. Si en un
// futur es crea support@infopol.app, canviar aquesta constant.
const SUPPORT_EMAIL = 'vazquezvelascoeduardo@gmail.com';

export default function Profile() {
  const { user, profile, progress, signOut, refresh, updatePassword } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  // ── Estat del formulari d'editar perfil ──────────────────────
  const [name, setName] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [tipNumber, setTipNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setName(profile?.name ?? '');
    setCuerpo(profile?.cuerpo ?? '');
    setTipNumber(profile?.tip_number ?? '');
    setDepartment(profile?.department ?? '');
  }, [profile]);

  // ── Estat del formulari de canvi de contrasenya ─────────────
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  if (!user) {
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
  const isEmailProvider = provider === 'email';

  const initial = (displayName || '?').slice(0, 1).toUpperCase();
  const hasStats = !!progress;

  // Detecta si hi ha canvis al formulari respecte el profile actual.
  const dirty =
    (profile?.name ?? '') !== name ||
    (profile?.cuerpo ?? '') !== cuerpo ||
    (profile?.tip_number ?? '') !== tipNumber ||
    (profile?.department ?? '') !== department;

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile(user!.id, {
        name: name.trim() || null,
        cuerpo: cuerpo.trim() || null,
        tip_number: tipNumber.trim() || null,
        department: department.trim() || null,
      } as never);
      await refresh();
      setProfileMsg({ type: 'ok', text: t('profile.edit.saved') });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('profile.edit.error');
      setProfileMsg({ type: 'err', text: msg });
    } finally {
      setSavingProfile(false);
    }
  }

  function onCancelProfile() {
    setName(profile?.name ?? '');
    setCuerpo(profile?.cuerpo ?? '');
    setTipNumber(profile?.tip_number ?? '');
    setDepartment(profile?.department ?? '');
    setProfileMsg(null);
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    setPasswordMsg(null);
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'err', text: t('auth.shortPassword') });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'err', text: t('profile.security.passwordsDontMatch') });
      return;
    }
    setChangingPassword(true);
    try {
      await updatePassword(newPassword);
      setPasswordMsg({ type: 'ok', text: t('profile.security.passwordChanged') });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('auth.error.generic');
      setPasswordMsg({ type: 'err', text: msg });
    } finally {
      setChangingPassword(false);
    }
  }

  function onRequestDelete() {
    const subject = encodeURIComponent("Sol·licitud d'eliminació de compte InfoPol");
    const body = encodeURIComponent(
      `Hola,\n\nVull eliminar el meu compte d'InfoPol associat al correu: ${email}\n` +
        `(ID intern: ${user!.id}).\n\n` +
        'Confirmo que entenc que aquesta acció esborrarà tot el meu progrés i és irreversible.\n\n' +
        `Gràcies.`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

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
          <h1 className="text-2xl sm:text-3xl tracking-tight text-ink truncate" style={{ fontFamily: A.display, fontWeight: 700, letterSpacing: '-0.03em' }}>
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
              to="/policia-local"
              className="self-start text-sm font-bold text-ink underline underline-offset-4"
            >
              {t('profile.statsLink')} →
            </Link>
          </div>
        )}
      </section>

      {/* Editar perfil */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="eyebrow mb-4">{t('profile.edit.title')}</h2>
        <form onSubmit={onSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t('profile.nameLabel')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={savingProfile}
            autoComplete="name"
          />
          <Field
            label={t('profile.cuerpo')}
            value={cuerpo}
            onChange={(e) => setCuerpo(e.target.value)}
            disabled={savingProfile}
            placeholder={t('profile.edit.cuerpoPlaceholder')}
          />
          <Field
            label={t('profile.department')}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={savingProfile}
            placeholder={t('profile.edit.departmentPlaceholder')}
          />
          <Field
            label={t('profile.tipNumber')}
            value={tipNumber}
            onChange={(e) => setTipNumber(e.target.value)}
            disabled={savingProfile}
            placeholder={t('profile.edit.tipPlaceholder')}
          />
          {profileMsg && (
            <p
              className={`sm:col-span-2 text-sm ${
                profileMsg.type === 'ok'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {profileMsg.text}
            </p>
          )}
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 mt-1">
            <button
              type="submit"
              disabled={!dirty || savingProfile}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed transition"
              style={{ background: 'var(--ink)' }}
            >
              {savingProfile ? t('auth.loading') : t('profile.edit.save')}
            </button>
            {dirty && (
              <button
                type="button"
                onClick={onCancelProfile}
                disabled={savingProfile}
                className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-bold
                  hover:bg-paper-2 disabled:opacity-50 transition"
              >
                {t('profile.edit.cancel')}
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Compte (read-only) */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="eyebrow mb-4">{t('profile.account')}</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          {email && <Row label={t('profile.email')} value={email} />}
          <Row label={t('profile.provider')} value={providerLabel} />
          {createdAt && <Row label={t('profile.memberSince')} value={createdAt} />}
        </dl>
      </section>

      {/* Comunicacions — opt-in del resum diari de notícies */}
      <NewsletterSection />

      {/* Seguretat */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="eyebrow mb-4">{t('profile.security.title')}</h2>
        {isEmailProvider ? (
          <form onSubmit={onChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label={t('profile.security.newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changingPassword}
              autoComplete="new-password"
            />
            <Field
              label={t('profile.security.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changingPassword}
              autoComplete="new-password"
            />
            {passwordMsg && (
              <p
                className={`sm:col-span-2 text-sm ${
                  passwordMsg.type === 'ok'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-700 dark:text-red-400'
                }`}
              >
                {passwordMsg.text}
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={!newPassword || !confirmPassword || changingPassword}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ background: 'var(--ink)' }}
              >
                {changingPassword ? t('auth.loading') : t('profile.security.changePassword')}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-text-2">
            {t('profile.security.passwordManaged').replace(/\{provider\}/g, providerLabel)}
          </p>
        )}
      </section>

      {/* Verificació en dos passos (2FA TOTP) */}
      <MfaSection />

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

      {/* Zona de perill */}
      <section
        className="rounded-2xl border-2 p-5 mt-2"
        style={{ borderColor: '#9b3030', background: '#fff5f5' }}
      >
        <h2 className="eyebrow mb-2" style={{ color: '#9b3030' }}>
          {t('profile.danger.title')}
        </h2>
        <p className="text-sm text-text-2 mb-3">{t('profile.danger.warning')}</p>
        <button
          type="button"
          onClick={onRequestDelete}
          className="rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition"
          style={{ borderColor: '#9b3030', color: '#9b3030', background: 'white' }}
        >
          {t('profile.danger.requestDelete')}
        </button>
        <p className="text-xs text-text-3 mt-2">{t('profile.danger.note')}</p>
      </section>
    </div>
  );
}

// Secció de comunicacions. Conté el checkbox d'opt-in del resum diari
// que envia l'Edge Function `send-daily-news`. El consentiment queda
// segellat amb `newsletter_subscribed_at` (gestionat pel trigger).
function NewsletterSection() {
  const { user, profile, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const subscribed = !!profile?.newsletter_subscribed;
  const email = user?.email ?? '';

  async function onToggle() {
    if (!user) return;
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(user.id, { newsletter_subscribed: !subscribed });
      await refresh();
      setMsg({
        type: 'ok',
        text: !subscribed
          ? `T'has subscrit. Rebràs el resum a ${email}.`
          : 'T\'has donat de baixa del resum diari.',
      });
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : 'Error en desar la preferència.';
      setMsg({ type: 'err', text });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-paper p-5">
      <h2 className="eyebrow mb-4">Comunicacions</h2>
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={subscribed}
          onChange={onToggle}
          disabled={saving}
          className="mt-1 h-5 w-5 cursor-pointer accent-current"
          style={{ accentColor: 'var(--ink)' }}
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-ink">
            Resum diari de notícies per correu
          </span>
          <span className="text-sm text-text-2">
            Rep cada matí a {email || 'el teu correu'} les 5 notícies més
            rellevants del dia (legislació, successos, tràfic i actualitat
            d'interès per a policia local).
          </span>
          <span className="text-xs text-text-3">
            Pots donar-te de baixa en qualsevol moment des d'aquesta pantalla
            o amb l'enllaç al peu de cada correu.
          </span>
        </div>
      </label>
      {msg && (
        <p
          className={`mt-3 text-sm ${
            msg.type === 'ok'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-red-700 dark:text-red-400'
          }`}
        >
          {msg.text}
        </p>
      )}
    </section>
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
      <span className="text-2xl tracking-tight text-ink" style={{ fontFamily: A.display, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</span>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-text-3">
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
