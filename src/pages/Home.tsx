// Pantalla principal de l'app · rebranding 2026.
// Hero + cards en mosaic (Leyes/Operativa/Superbuscador/atajos/Tests) i
// secció d'actualitat. Conserva la funcionalitat existent (favorits,
// novedades, repassos pendents, comptador de notícies no llegides).
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useFavorites, type Bookmark } from '../lib/bookmarks';
import { MODULES } from '../lib/content';
import { NEWS, useNewCount, markNewsSeen } from '../lib/news';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES, useUnreadNoticiesCount } from '../lib/noticies';

/* ── Icones inline (replica les del disseny) ─────────────────── */
function IconLeyes() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="m5 7-2 6c0 2 1.5 3 3.5 3S10 15 10 13L8 7" />
      <path d="m19 7-2 6c0 2 1.5 3 3.5 3S24 15 24 13l-2-6" transform="translate(-3 0)" />
    </svg>
  );
}
function IconOperativa() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18h14" />
      <path d="M7 18a5 5 0 0 1 10 0" />
      <path d="M12 7V4" />
      <path d="m9 5 1 2" />
      <path d="m15 5-1 2" />
    </svg>
  );
}
function IconSuper() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
      <path d="M11 8v3l2 1" />
    </svg>
  );
}
function IconTrafico() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}
function IconAlcohol() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8l-1 7a4 4 0 0 1-3 4 4 4 0 0 1-3-4z" />
      <path d="M12 14v6" />
      <path d="M9 21h6" />
    </svg>
  );
}
function IconRecursos() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}
function IconTests() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

/* ── Blocs auxiliars (favorits + novedades) ────────────────── */
function FavoritesBlock() {
  const { t } = useT();
  const { items: favs, toggle: toggleFav } = useFavorites();
  if (favs.length === 0) return null;
  return (
    <section className="mb-6">
      <div className="section-head">
        <span className="eyebrow">★ {t('home.favorites.title')}</span>
        <span className="rule" />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {favs.map((b) => (
          <FavItem key={`fav-${b.moduleSlug}-${b.slug}`} b={b} onRemove={() => toggleFav(b)} />
        ))}
      </ul>
    </section>
  );
}

function FavItem({ b, onRemove }: { b: Bookmark; onRemove: () => void }) {
  const mod = MODULES.find((m) => m.slug === b.moduleSlug);
  return (
    <li className="group relative">
      <Link
        to={`/leyes/s/${b.moduleSlug}/${b.slug}`}
        className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm transition hover:border-terracotta hover:bg-paper-2 pr-9"
      >
        {mod && (
          <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
        )}
        <span className="truncate text-text">{b.title}</span>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        aria-label="✕"
        className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-paper-2 hover:text-ink opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>
    </li>
  );
}

function NovedadesBlock() {
  const { t } = useT();
  const newCount = useNewCount();
  useEffect(() => {
    if (newCount > 0) {
      const id = setTimeout(() => markNewsSeen(), 1500);
      return () => clearTimeout(id);
    }
  }, [newCount]);
  const recent = NEWS.slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <section className="mt-10">
      <div className="section-head" style={{ ['--accent' as never]: 'var(--c-actualidad)' } as React.CSSProperties}>
        <span className="eyebrow">✨ {t('home.news.title')}</span>
        <span className="rule" />
        {newCount > 0 && (
          <span className="badge">{newCount} {t('home.news.badge')}</span>
        )}
      </div>
      <ul className="grid gap-2">
        {recent.map((n) => {
          const mod = MODULES.find((m) => m.slug === n.moduleSlug);
          return (
            <li key={`news-${n.moduleSlug}-${n.slug}`}>
              <Link
                to={`/leyes/s/${n.moduleSlug}/${n.slug}`}
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm transition hover:border-c-actualidad hover:bg-paper-2"
              >
                {mod && (
                  <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-c-actualidad" />
                )}
                <span className="truncate text-text flex-1">{n.title}</span>
                <span className="text-[11px] font-mono text-text-3 shrink-0">
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

/* ── Pàgina principal ────────────────────────────────────────── */
export default function Home() {
  const { t } = useT();
  const { due: failuresDue } = useFailuresCounts();
  const unreadNoticies = useUnreadNoticiesCount();
  const recentNoticies = NOTICIES.slice(0, 4);

  return (
    <div className="shell pt-6 pb-10">
      <FavoritesBlock />

      {/* HERO */}
      <section className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-end gap-4 my-3 mb-6">
        <div>
          <div className="eyebrow text-terracotta mb-2">
            {t('home.hero.eyebrow')}
          </div>
          <h1 className="m-0 text-[34px] sm:text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em]">
            {t('home.hero.title')}{' '}
            <span className="text-terracotta">{t('home.hero.titleAccent')}</span>
          </h1>
          <p className="mt-2.5 text-text-2 text-base max-w-[640px]">
            {t('home.hero.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/recursos" className="btn btn-ghost">
            {t('home.hero.ctaRecursos')}
          </Link>
          <Link to="/test" className="btn btn-dark">
            {t('home.hero.ctaTests')}
          </Link>
        </div>
      </section>

      {/* TOP CARDS — Leyes + Operativa */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[18px]">
        <Link
          to="/leyes"
          className="card card-accent"
          style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}
        >
          <div className="card-grid">
            <span
              className="appicon lg"
              style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}
            >
              <IconLeyes />
            </span>
            <div>
              <div className="eyebrow" style={{ color: 'var(--c-leyes)' }}>
                {t('home.leyes.badge')}
              </div>
              <h2 className="card-title lg mt-1">{t('home.leyes.title')}</h2>
              <p className="card-desc">{t('home.leyes.desc')}</p>
              <span className="card-cta" style={{ ['--accent' as never]: 'var(--c-leyes)' } as React.CSSProperties}>
                {t('home.leyes.cta')} <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/operativa"
          className="card card-accent"
          style={{ ['--accent' as never]: 'var(--c-operativa)' } as React.CSSProperties}
        >
          <div className="card-grid">
            <span
              className="appicon lg"
              style={{ ['--accent' as never]: 'var(--c-operativa)' } as React.CSSProperties}
            >
              <IconOperativa />
            </span>
            <div>
              <div className="eyebrow" style={{ color: 'var(--c-operativa)' }}>
                {t('home.operativa.badge')}
              </div>
              <h2 className="card-title lg mt-1">{t('home.operativa.title')}</h2>
              <p className="card-desc">{t('home.operativa.desc')}</p>
              <span className="card-cta" style={{ ['--accent' as never]: 'var(--c-operativa)' } as React.CSSProperties}>
                {t('home.operativa.cta')} <span className="arrow">→</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* SUPERBUSCADOR — wide tinted card */}
      <section className="mt-4">
        <Link
          to="/superbuscador"
          className="card card-accent tinted"
          style={{
            ['--accent' as never]: 'var(--c-superbuscador)',
            ['--tint' as never]: 'var(--tint-superbuscador)',
          } as React.CSSProperties}
        >
          <div className="card-grid" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
            <span
              className="appicon lg"
              style={{ ['--accent' as never]: 'var(--c-superbuscador)' } as React.CSSProperties}
            >
              <IconSuper />
            </span>
            <div>
              <div className="eyebrow" style={{ color: 'var(--c-superbuscador)' }}>
                {t('home.superbuscador.badge')}
              </div>
              <h2 className="card-title lg mt-1">{t('home.superbuscador.title')}</h2>
              <p className="card-desc">{t('home.superbuscador.desc')}</p>
            </div>
            <span
              className="card-cta self-center mt-0 hidden sm:inline-flex"
              style={{ ['--accent' as never]: 'var(--c-superbuscador)' } as React.CSSProperties}
            >
              {t('home.superbuscador.cta')} <span className="arrow">→</span>
            </span>
          </div>
        </Link>
      </section>

      {/* 3 MINICARDS — Catálogo · Alcoholemia · Recursos */}
      <section className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          to="/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026"
          className="minicard"
          style={{
            ['--accent' as never]: 'var(--c-trafico)',
            ['--tint' as never]: 'var(--tint-trafico)',
          } as React.CSSProperties}
        >
          <span
            className="appicon"
            style={{ ['--accent' as never]: 'var(--c-trafico)' } as React.CSSProperties}
          >
            <IconTrafico />
          </span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--c-trafico)' }}>
              {t('home.cataleg.badge')}
            </div>
            <h3>{t('home.cataleg.title')}</h3>
            <p>{t('home.cataleg.desc')}</p>
          </div>
          <span className="arrow">→</span>
        </Link>

        <Link
          to="/calculadora-alcohol"
          className="minicard"
          style={{
            ['--accent' as never]: 'var(--c-alcoholemia)',
            ['--tint' as never]: 'var(--tint-alcoholemia)',
          } as React.CSSProperties}
        >
          <span
            className="appicon"
            style={{ ['--accent' as never]: 'var(--c-alcoholemia)' } as React.CSSProperties}
          >
            <IconAlcohol />
          </span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--c-alcoholemia)' }}>
              {t('home.alcohol.badge')}
            </div>
            <h3>{t('home.alcohol.title')}</h3>
            <p>{t('home.alcohol.desc')}</p>
          </div>
          <span className="arrow">→</span>
        </Link>

        <Link
          to="/recursos"
          className="minicard"
          style={{
            ['--accent' as never]: 'var(--c-recursos)',
            ['--tint' as never]: 'var(--tint-recursos)',
          } as React.CSSProperties}
        >
          <span
            className="appicon"
            style={{ ['--accent' as never]: 'var(--c-recursos)' } as React.CSSProperties}
          >
            <IconRecursos />
          </span>
          <div>
            <div className="eyebrow" style={{ color: 'var(--c-recursos)' }}>
              {t('home.recursos.badge')}
            </div>
            <h3>{t('home.recursos.title')}</h3>
            <p>{t('home.recursos.desc')}</p>
          </div>
          <span className="arrow">→</span>
        </Link>
      </section>

      {/* TESTS — wide tinted card with badge */}
      <section className="mt-4">
        <div className="relative">
          {failuresDue > 0 ? (
            <span
              title={t('home.tests.duePending')}
              className="badge absolute -top-3 right-6 z-10"
            >
              🔁 {failuresDue} {t('home.tests.duePendingShort')}
            </span>
          ) : (
            <span className="badge absolute -top-3 right-6 z-10">
              📚 {t('home.tests.badgeNew')}
            </span>
          )}
          <Link
            to="/test"
            className="card card-accent tinted"
            style={{
              ['--accent' as never]: 'var(--c-tests)',
              ['--tint' as never]: 'var(--tint-tests)',
            } as React.CSSProperties}
          >
            <div className="card-grid" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
              <span
                className="appicon lg"
                style={{ ['--accent' as never]: 'var(--c-tests)' } as React.CSSProperties}
              >
                <IconTests />
              </span>
              <div>
                <div className="eyebrow" style={{ color: 'var(--c-tests)' }}>
                  {t('home.tests.badge')}
                </div>
                <h2 className="card-title lg mt-1">{t('home.tests.title')}</h2>
                <p className="card-desc">{t('home.tests.desc')}</p>
              </div>
              <span
                className="card-cta self-center mt-0 hidden sm:inline-flex"
                style={{ ['--accent' as never]: 'var(--c-tests)' } as React.CSSProperties}
              >
                {t('home.tests.cta')} <span className="arrow">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ACTUALIDAD — section-head + news rows */}
      {recentNoticies.length > 0 && (
        <section className="mt-12">
          <div
            className="section-head"
            style={{ ['--accent' as never]: 'var(--c-actualidad)' } as React.CSSProperties}
          >
            <span className="eyebrow">📰 {t('home.actualidad.eyebrow')}</span>
            <span className="rule" />
            {unreadNoticies > 0 && (
              <span className="badge dark">
                {unreadNoticies} {t('home.noticies.newBadge')}
              </span>
            )}
            <Link to="/noticies" className="see-all">
              {t('home.actualidad.viewAll')} →
            </Link>
          </div>
          <ul className="grid gap-2.5">
            {recentNoticies.map((n) => (
              <li key={n.slug}>
                <Link
                  to={`/noticies/${encodeURIComponent(n.slug)}`}
                  className="news-row"
                >
                  <span className="news-icon">📄</span>
                  <div className="min-w-0">
                    <h4>{n.title}</h4>
                    <p>{n.summary}</p>
                  </div>
                  <span className="news-date">{n.publishedAt.slice(5)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NovedadesBlock />
    </div>
  );
}
