// Pantalla principal · Home v2 (rebranding 2026).
// Hero compact + 2 lanes (Operativa / Acadèmia) + tools feature grid +
// actualitat. Conserva favorits i comptadors de repassos pendents.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useFavorites, type Bookmark } from '../lib/bookmarks';
import { MODULES } from '../lib/content';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES, useUnreadNoticiesCount } from '../lib/noticies';

/* ── Favorites (preservats) ───────────────────────────────── */
function FavoritesBlock() {
  const { t } = useT();
  const { items: favs, toggle: toggleFav } = useFavorites();
  if (favs.length === 0) return null;
  return (
    <section className="mb-2 mt-4">
      <div className="hs-head">
        <span className="tag">★ {t('home.favorites.title')}</span>
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

/* ── Pàgina principal ────────────────────────────────────── */
export default function Home() {
  const { t } = useT();
  const { due: failuresDue } = useFailuresCounts();
  const unreadNoticies = useUnreadNoticiesCount();
  const recentNoticies = NOTICIES.slice(0, 3);

  return (
    <div className="shell pb-10">
      <FavoritesBlock />

      {/* HERO */}
      <section className="home-hero">
        <div>
          <div className="eyebrow" style={{ color: 'var(--terracotta)' }}>
            {t('home.v2.eyebrow')}
          </div>
          <h1>
            {t('home.v2.title.line1')}<br />
            <span className="acc">{t('home.v2.title.line2')}</span>
          </h1>
          <p>{t('home.v2.subtitle')}</p>
        </div>
        <div className="quick-actions">
          <Link to="/recursos" className="btn btn-ghost">
            {t('home.v2.ctaSecondary')}
          </Link>
          <Link to="/test" className="btn btn-dark">
            {t('home.v2.ctaPrimary')}
          </Link>
        </div>
      </section>

      {/* LANES — Operativa + Academia */}
      <section className="lanes">
        <Link to="/operativa" className="lane operativa">
          <span className="for-who">
            🚓 {t('home.v2.lane.operativa.forWho')}
          </span>
          <div className="lane-icon">🚓</div>
          <h2>
            {t('home.v2.lane.operativa.title')}
            <small>{t('home.v2.lane.operativa.subtitle')}</small>
          </h2>
          <p className="lead">{t('home.v2.lane.operativa.lead')}</p>
          <div className="feats">
            <span>{t('home.v2.lane.operativa.feat1')}</span>
            <span>{t('home.v2.lane.operativa.feat2')}</span>
            <span>{t('home.v2.lane.operativa.feat3')}</span>
            <span>{t('home.v2.lane.operativa.feat4')}</span>
          </div>
          <div className="now">
            <span className="dot" /> {t('home.v2.lane.operativa.status')}
          </div>
          <span className="lane-cta">
            {t('home.v2.lane.operativa.cta')} <span className="arr">→</span>
          </span>
        </Link>

        <Link to="/academia" className="lane academia">
          <span className="for-who">
            🎓 {t('home.v2.lane.academia.forWho')}
          </span>
          <div className="lane-icon">🎓</div>
          <h2>
            {t('home.v2.lane.academia.title')}
            <small>{t('home.v2.lane.academia.subtitle')}</small>
          </h2>
          <p className="lead">{t('home.v2.lane.academia.lead')}</p>
          <div className="feats">
            <span>{t('home.v2.lane.academia.feat1')}</span>
            <span>{t('home.v2.lane.academia.feat2')}</span>
            <span>{t('home.v2.lane.academia.feat3')}</span>
            <span>{t('home.v2.lane.academia.feat4')}</span>
          </div>
          <div className="stats-pills">
            {failuresDue > 0 ? (
              <span className="pill">🔁 {failuresDue} repassos</span>
            ) : (
              <span className="pill">✨ {t('home.tests.badgeNew')}</span>
            )}
            {unreadNoticies > 0 && (
              <span className="pill">📰 {unreadNoticies} {t('home.noticies.newBadge')}</span>
            )}
            <span className="pill">🏆 {MODULES.length} mòduls</span>
          </div>
          <span className="lane-cta" style={{ marginTop: 14 }}>
            {t('home.v2.lane.academia.cta')} <span className="arr">→</span>
          </span>
        </Link>
      </section>

      {/* TOOLS — featured grid */}
      <section className="home-section">
        <div className="hs-head">
          <span className="tag">{t('home.v2.tools.eyebrow')}</span>
          <span className="rule" />
          <Link to="/recursos" className="more">
            {t('home.v2.tools.viewAll')} →
          </Link>
        </div>
        <div className="tools-feature">
          {/* Hero tool: Superbuscador */}
          <Link to="/superbuscador" className="feat-tool hero-tool">
            <span className="ft-arrow" style={{ color: '#5b1fa8' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.super.tag')}</span>
            <h3>{t('home.v2.tools.super.title')}</h3>
            <p>{t('home.v2.tools.super.desc')}</p>
            <div className="ft-mockup">
              <span style={{ fontSize: 18 }}>🔎</span>
              <span className="mq">
                {t('home.v2.tools.super.mockupQuery')}
                <span className="cur" />
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>⌘K</span>
            </div>
            <div className="ft-chips">
              <span className="ft-chip">LSV</span>
              <span className="ft-chip">RGC</span>
              <span className="ft-chip">RGCond</span>
              <span className="ft-chip">CP</span>
            </div>
            <span className="ft-cta">
              {t('home.v2.tools.super.cta')} →
            </span>
          </Link>

          <Link to="/leyes" className="feat-tool s-leyes">
            <span className="ft-arrow" style={{ color: '#9c7a1f' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.leyes.tag')}</span>
            <h3>{t('home.v2.tools.leyes.title')}</h3>
            <p>{t('home.v2.tools.leyes.desc')}</p>
          </Link>

          <Link to="/calculadora-alcohol" className="feat-tool s-alc">
            <span className="ft-arrow" style={{ color: '#B73663' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.alc.tag')}</span>
            <h3>{t('home.v2.tools.alc.title')}</h3>
            <p>{t('home.v2.tools.alc.desc')}</p>
          </Link>

          <Link
            to="/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026"
            className="feat-tool s-trafico"
          >
            <span className="ft-arrow" style={{ color: 'var(--terracotta-2)' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.trafico.tag')}</span>
            <h3>{t('home.v2.tools.trafico.title')}</h3>
            <p>{t('home.v2.tools.trafico.desc')}</p>
          </Link>

          <Link to="/recursos" className="feat-tool s-recursos">
            <span className="ft-arrow" style={{ color: '#1f7847' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.recursos.tag')}</span>
            <h3>{t('home.v2.tools.recursos.title')}</h3>
            <p>{t('home.v2.tools.recursos.desc')}</p>
          </Link>
        </div>
      </section>

      {/* ACTUALIDAD — news rows */}
      {recentNoticies.length > 0 && (
        <section className="home-section">
          <div className="hs-head">
            <span className="tag">{t('home.v2.actualidad.eyebrow')}</span>
            <span className="rule" />
            <Link to="/noticies" className="more">
              {t('home.v2.tools.viewAll')} →
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
    </div>
  );
}
