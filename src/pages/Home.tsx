// Pantalla principal de l'app — disseny v2 (navy/or, mosaic asimètric).
// Manté tot el contingut i funcionalitat actual: favorits, mòduls
// principals (Lleis, Operativa, Tests, Superbuscador, Recursos, Alcohol,
// Catàleg), Notícies recents i NewsBlock de novetats del temari.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useFavorites, type Bookmark } from '../lib/bookmarks';
import { MODULES } from '../lib/content';
import { NEWS, useNewCount, markNewsSeen } from '../lib/news';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES, useUnreadNoticiesCount } from '../lib/noticies';

// ════════════════════════════════════════════════════════════════════
// HOME
// ════════════════════════════════════════════════════════════════════

export default function Home() {
  const { t } = useT();
  const { due: failuresDue } = useFailuresCounts();
  const unreadNoticies = useUnreadNoticiesCount();
  const recentNoticies = NOTICIES.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      {/* HERO compacte */}
      <Hero />

      {/* FAVORITS — només si n'hi ha */}
      <FavoritesBlock />

      {/* MOSAIC DE MÒDULS — graella de 6 columnes amb spans variables */}
      <section className="mt-8">
        <Eyebrow label={t('home.modules.eyebrow')} />
        <h2 className="mt-3 mb-2 text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]">
          {t('home.modules.title')}{' '}
          <span className="font-serif italic font-normal text-ink-2">
            {t('home.modules.titleSerif')}
          </span>
        </h2>
        <p className="text-muted text-base sm:text-[17px] max-w-xl leading-relaxed">
          {t('home.modules.subtitle')}
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-6 gap-3.5">
          {/* LLEIS — span 4 */}
          <Link
            to="/leyes"
            className="mod-card sm:col-span-4 sm:min-h-[260px] flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-gold">
                <Icon name="scale" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.leyes.badge')}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-[1.1]">
              {t('home.leyes.title')}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {t('home.leyes.desc')}
            </p>
            <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
              <span className="pill-tag">{MODULES.length} mòduls</span>
              <span className="text-[11px] text-soft mono">·</span>
              <span className="text-[11px] text-muted mono">CE78 · CP · LECrim · LOFCS · LSV ...</span>
            </div>
          </Link>

          {/* OPERATIVA — span 2 */}
          <Link
            to="/operativa"
            className="mod-card sm:col-span-2 sm:min-h-[260px] flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-danger">
                <Icon name="shield" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.operativa.badge')}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-[1.1]">
              {t('home.operativa.title')}
            </h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-3">
              {t('home.operativa.desc')}
            </p>
          </Link>

          {/* TESTS — span 3 (amb badge dinàmic de pendents) */}
          <Link
            to="/test"
            className="mod-card sm:col-span-3 sm:min-h-[230px] flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon">
                <Icon name="bookopen" />
              </span>
              {failuresDue > 0 ? (
                <span
                  title={t('home.tests.duePending')}
                  className="rounded-pill bg-danger-soft text-danger px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1"
                >
                  <span aria-hidden>🔁</span>
                  {failuresDue} {t('home.tests.duePendingShort')}
                </span>
              ) : (
                <span className="rounded-pill bg-brand-soft text-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  {t('home.tests.badgeNew')}
                </span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.tests.badge')}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-[1.1]">
              {t('home.tests.title')}
            </h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-2">
              {t('home.tests.desc')}
            </p>
          </Link>

          {/* SUPERBUSCADOR — span 3 */}
          <Link
            to="/superbuscador"
            className="mod-card sm:col-span-3 sm:min-h-[230px] flex flex-col gap-2.5"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-ink">
                <Icon name="search" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.superbuscador.badge')}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-[1.1]">
              {t('home.superbuscador.title')}
            </h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-2">
              {t('home.superbuscador.desc')}
            </p>
          </Link>

          {/* CATÀLEG SCT — span 2 */}
          <Link
            to="/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026"
            className="mod-card sm:col-span-2 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-gold">
                <Icon name="book" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.cataleg.badge')}
            </div>
            <h3 className="text-base font-semibold tracking-tight leading-tight">
              {t('home.cataleg.title')}
            </h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              {t('home.cataleg.desc')}
            </p>
          </Link>

          {/* CALCULADORA ALCOHOL — span 2 */}
          <Link
            to="/calculadora-alcohol"
            className="mod-card sm:col-span-2 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-warn">
                <Icon name="droplet" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.alcohol.badge')}
            </div>
            <h3 className="text-base font-semibold tracking-tight leading-tight">
              {t('home.alcohol.title')}
            </h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              {t('home.alcohol.desc')}
            </p>
          </Link>

          {/* RECURSOS — span 2 */}
          <Link
            to="/recursos"
            className="mod-card sm:col-span-2 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <span aria-hidden className="mod-icon mod-icon-ok">
                <Icon name="tools" />
              </span>
              <Arrow />
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold mt-1">
              {t('home.recursos.badge')}
            </div>
            <h3 className="text-base font-semibold tracking-tight leading-tight">
              {t('home.recursos.title')}
            </h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              {t('home.recursos.desc')}
            </p>
          </Link>
        </div>
      </section>

      {/* ACTUALITAT — Notícies recents */}
      {recentNoticies.length > 0 && (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <Eyebrow label={t('home.noticies.eyebrow')} />
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.05]">
                {t('home.noticies.title')}{' '}
                {unreadNoticies > 0 && (
                  <span className="rounded-pill bg-danger-soft text-danger px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider align-middle inline-flex items-center gap-1">
                    {unreadNoticies} {t('home.noticies.newBadge')}
                  </span>
                )}
              </h2>
            </div>
            <Link
              to="/noticies"
              className="text-sm font-medium text-ink-2 hover:text-ink mono"
            >
              {t('home.noticies.viewAll')} →
            </Link>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentNoticies.map((n) => (
              <li key={n.slug}>
                <Link
                  to={`/noticies/${encodeURIComponent(n.slug)}`}
                  className="block rounded-card border border-line bg-paper p-4 transition hover:border-ink-2 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-18px_rgba(11,18,32,0.18)]"
                >
                  <time className="text-[11px] mono text-muted uppercase tracking-wider">
                    {formatDate(n.publishedAt)}
                  </time>
                  <h3 className="mt-1.5 font-semibold text-base leading-snug tracking-tight line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-muted leading-snug line-clamp-3">
                    {n.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* NOVETATS DEL TEMARI (NewsBlock — si no és buit) */}
      <div className="mt-10">
        <NewsBlock />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════════════════

function Hero() {
  const { t } = useT();
  return (
    <section className="relative pb-2">
      <div className="pill mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-ok shadow-[0_0_0_4px_rgba(31,122,77,0.22)]" />
        <span>{t('home.hero.statusLabel')}</span>
        <span className="pill-tag">CA · ES</span>
      </div>
      <h1 className="text-[40px] sm:text-[58px] leading-[0.96] tracking-[-0.028em] font-semibold mb-3">
        {t('home.hero.title')}
        <span className="block font-serif italic font-normal text-ink-2 text-[44px] sm:text-[64px] leading-none mt-1">
          {t('home.hero.titleSerif')}
        </span>
      </h1>
      <p className="text-base sm:text-[17px] text-muted leading-relaxed max-w-xl">
        {t('home.hero.subtitle')}
      </p>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// FAVORITS
// ════════════════════════════════════════════════════════════════════

function FavoritesBlock() {
  const { t } = useT();
  const { items: favs, toggle: toggleFav } = useFavorites();

  if (favs.length === 0) return null;

  return (
    <section className="mt-8 rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span aria-hidden className="text-gold text-base">★</span>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          {t('home.favorites.title')}
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {favs.map((b) => (
          <FavItem key={`fav-${b.moduleSlug}-${b.slug}`} b={b} onRemove={() => toggleFav(b)} />
        ))}
      </ul>
    </section>
  );
}

function FavItem({ b, onRemove }: { b: Bookmark; onRemove: () => void }) {
  return (
    <li className="group relative">
      <Link
        to={`/leyes/s/${b.moduleSlug}/${b.slug}`}
        className="flex items-center gap-2 rounded-sm border border-line bg-paper px-3 py-2 text-sm transition pr-9
          hover:border-ink-2"
      >
        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
        <span className="truncate text-ink-2">{b.title}</span>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        aria-label="✕"
        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md
          text-soft hover:bg-line-2 hover:text-ink-2 opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>
    </li>
  );
}

// ════════════════════════════════════════════════════════════════════
// NEWSBLOCK (novetats del temari, sense canvis funcionals)
// ════════════════════════════════════════════════════════════════════

function NewsBlock() {
  const { t } = useT();
  const newCount = useNewCount();

  useEffect(() => {
    if (newCount > 0) {
      const t = setTimeout(() => markNewsSeen(), 1500);
      return () => clearTimeout(t);
    }
  }, [newCount]);

  const recent = NEWS.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span aria-hidden className="text-gold text-base">✨</span>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          {t('home.news.title')}
        </h2>
        {newCount > 0 && (
          <span className="rounded-pill bg-brand text-white text-[10px] font-bold px-2 py-0.5">
            {newCount} {t('home.news.badge')}
          </span>
        )}
        <span className="h-px flex-1 bg-line" />
      </div>
      <ul className="space-y-1.5">
        {recent.map((n) => {
          const mod = MODULES.find((m) => m.slug === n.moduleSlug);
          return (
            <li key={`news-${n.moduleSlug}-${n.slug}`}>
              <Link
                to={`/leyes/s/${n.moduleSlug}/${n.slug}`}
                className="flex items-center gap-2 rounded-sm border border-line bg-paper px-3 py-2 text-sm transition
                  hover:border-ink-2"
              >
                {mod && (
                  <span aria-hidden className="w-1.5 h-1.5 shrink-0 rounded-full bg-gold" />
                )}
                <span className="truncate text-ink-2 flex-1">{n.title}</span>
                <span className="text-[10px] mono text-soft shrink-0">
                  {n.addedAt.slice(5)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════

function Eyebrow({ label }: { label: string }) {
  return <div className="eyebrow">{label}</div>;
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="text-soft transition group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
      </svg>
    </span>
  );
}

function Icon({ name }: { name: string }) {
  // Icones SVG simples per al nou disseny. Es poden enriquir més
  // endavant; ara tenim només les necessàries per als 7 mòduls de Home.
  switch (name) {
    case 'scale':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M5 7h14" />
          <path d="M5 7 2 14a4 4 0 0 0 6 0L5 7Z" />
          <path d="M19 7l-3 7a4 4 0 0 0 6 0l-3-7Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z" />
        </svg>
      );
    case 'bookopen':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 5a2 2 0 0 1 2-2h6v18H4a2 2 0 0 1-2-2V5z" />
          <path d="M22 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2V5z" />
        </svg>
      );
    case 'search':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 'book':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
          <path d="M4 16a4 4 0 0 1 4-4h12" />
        </svg>
      );
    case 'droplet':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c3.5 5 6 8.5 6 12a6 6 0 1 1-12 0c0-3.5 2.5-7 6-12z" />
        </svg>
      );
    case 'tools':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a4 4 0 1 0 5 5l-2-2a2 2 0 0 1-3-3l2-2a4 4 0 0 0-2 2z" />
          <path d="m9 11-7 7 3 3 7-7" />
          <path d="M14 14l3 3" />
        </svg>
      );
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}
