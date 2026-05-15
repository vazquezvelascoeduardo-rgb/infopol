// Banner d'invitació al resum diari de notícies. Apareix a Home si:
//   - L'usuari està autenticat
//   - El seu profile té newsletter_subscribed = false
//   - No l'ha descartat manualment a localStorage (es respecten 30 dies)
//
// Click "Activar" → escriu newsletter_subscribed=true al profile.
// Click "Ara no" → guarda timestamp i amaga el banner durant 30 dies.
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { updateProfile } from '../lib/db';

const DISMISS_KEY = 'infopol-newsletter-banner-dismissed';
const DISMISS_DAYS = 30;

function isDismissed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  if (isNaN(ts)) return false;
  const ageDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return ageDays < DISMISS_DAYS;
}

export default function NewsletterBanner() {
  const { user, profile, refresh } = useAuth();
  const [dismissed, setDismissed] = useState<boolean>(() => isDismissed());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Re-llegir l'estat de localStorage quan canvia l'usuari (per si la
  // sessió canvia sense recarregar).
  useEffect(() => {
    setDismissed(isDismissed());
    setDone(false);
  }, [user?.id]);

  // No mostrem si: no hi ha sessió, no s'ha carregat profile, ja està
  // subscrit, o ha descartat el banner recentment.
  if (!user || !profile) return null;
  if (profile.newsletter_subscribed) return null;
  if (dismissed) return null;
  if (done) return null;

  async function onActivate() {
    if (!user) return;
    setBusy(true);
    try {
      await updateProfile(user.id, { newsletter_subscribed: true });
      await refresh();
      setDone(true);
    } catch {
      setBusy(false);
    }
  }

  function onDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch { /* ignore */ }
    setDismissed(true);
  }

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 mb-4 mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      style={{ background: '#FFF1D2', borderLeft: '4px solid #E89A1C' }}
    >
      <div className="flex-1">
        <div
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: '#B97600' }}
        >
          📩 Recomanat
        </div>
        <div className="text-sm sm:text-base font-bold text-ink leading-snug">
          Vols rebre el resum diari de notícies?
        </div>
        <div className="text-xs sm:text-sm text-text-2 leading-relaxed mt-1">
          Cada matí, les 5 notícies més rellevants per a policia local al teu correu.
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onActivate}
          disabled={busy}
          className="rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
          style={{ background: '#E89A1C' }}
        >
          {busy ? 'Activant…' : 'Activar'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          disabled={busy}
          className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-semibold
            text-text-2 hover:bg-paper-2 transition whitespace-nowrap"
        >
          Ara no
        </button>
      </div>
    </section>
  );
}
