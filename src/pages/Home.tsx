// Pantalla principal · Home v3 (rebranding 2026 + switch Operativa/Acadèmia).
// Hero compact + tabs Operativa | Acadèmia. Cada tab mostra contingut
// diferent: Operativa = eines del dia a dia (superbuscador, catàleg SCT,
// alcoholèmia, lleis, runners…). Acadèmia = stats + rutes d'estudi.
// L'estat es persisteix a localStorage.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { useFavorites, type Bookmark } from '../lib/bookmarks';
import { MODULES } from '../lib/content';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES, useUnreadNoticiesCount } from '../lib/noticies';
import { TOPICS, getTopicsByCategory } from '../data/tests';
import { getAnsweredIds } from '../lib/testProgress';

type HomeTab = 'operativa' | 'academia';
const TAB_KEY = 'infopol-home-tab';

function readInitialTab(): HomeTab {
  if (typeof localStorage === 'undefined') return 'operativa';
  const v = localStorage.getItem(TAB_KEY);
  return v === 'academia' ? 'academia' : 'operativa';
}

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
  const [tab, setTab] = useState<HomeTab>(readInitialTab);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(TAB_KEY, tab); } catch { /* ignore */ }
  }, [tab]);

  return (
    <div className="shell pb-10">
      <FavoritesBlock />

      {/* HERO compact */}
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
          <Link
            to={tab === 'academia' ? '/policia-local' : '/operativa'}
            className="btn btn-dark"
          >
            {tab === 'academia'
              ? t('home.v2.ctaPrimary')
              : t('home.v2.lane.operativa.cta')}
          </Link>
        </div>
      </section>

      {/* SWITCH Operativa / Academia */}
      <div
        className="home-switch"
        role="tablist"
        aria-label={t('home.switch.aria')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'operativa'}
          className={`home-switch-btn op ${tab === 'operativa' ? 'active' : ''}`}
          onClick={() => setTab('operativa')}
        >
          <span className="hs-icon" aria-hidden>🚓</span>
          <span className="hs-text">
            <span className="hs-eyebrow">{t('home.switch.opEyebrow')}</span>
            <span className="hs-title">{t('home.switch.opTitle')}</span>
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'academia'}
          className={`home-switch-btn ac ${tab === 'academia' ? 'active' : ''}`}
          onClick={() => setTab('academia')}
        >
          <span className="hs-icon" aria-hidden>🎓</span>
          <span className="hs-text">
            <span className="hs-eyebrow">{t('home.switch.acEyebrow')}</span>
            <span className="hs-title">{t('home.switch.acTitle')}</span>
          </span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {tab === 'operativa' ? (
        <OperativaView failuresDue={failuresDue} />
      ) : (
        <AcademiaView failuresDue={failuresDue} />
      )}

      {/* ACTUALIDAD — news rows (visible en ambdues vistes) */}
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
      {unreadNoticies > 0 && tab === 'operativa' && (
        <p className="text-xs text-text-3 mt-2 text-right">
          📰 {unreadNoticies} {t('home.noticies.newBadge')}
        </p>
      )}
    </div>
  );
}

/* ── Vista OPERATIVA — eines del dia a dia ─────────────────── */
function OperativaView({ failuresDue: _ }: { failuresDue: number }) {
  const { t } = useT();
  return (
    <>
      {/* Tools featured grid (existent — superbuscador, lleis, alc, sct, recursos) */}
      <section className="home-section">
        <div className="hs-head">
          <span className="tag">{t('home.v2.tools.eyebrow')}</span>
          <span className="rule" />
          <Link to="/recursos" className="more">
            {t('home.v2.tools.viewAll')} →
          </Link>
        </div>
        <div className="tools-feature">
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

          <Link
            to="/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026"
            className="feat-tool s-trafico"
          >
            <span className="ft-arrow" style={{ color: 'var(--terracotta-2)' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.trafico.tag')}</span>
            <h3>{t('home.v2.tools.trafico.title')}</h3>
            <p>{t('home.v2.tools.trafico.desc')}</p>
          </Link>

          <Link to="/calculadora-alcohol" className="feat-tool s-alc">
            <span className="ft-arrow" style={{ color: '#B73663' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.alc.tag')}</span>
            <h3>{t('home.v2.tools.alc.title')}</h3>
            <p>{t('home.v2.tools.alc.desc')}</p>
          </Link>

          <Link to="/leyes" className="feat-tool s-leyes">
            <span className="ft-arrow" style={{ color: '#9c7a1f' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.leyes.tag')}</span>
            <h3>{t('home.v2.tools.leyes.title')}</h3>
            <p>{t('home.v2.tools.leyes.desc')}</p>
          </Link>

          <Link to="/recursos" className="feat-tool s-recursos">
            <span className="ft-arrow" style={{ color: '#1f7847' }}>→</span>
            <span className="ft-tag">{t('home.v2.tools.recursos.tag')}</span>
            <h3>{t('home.v2.tools.recursos.title')}</h3>
            <p>{t('home.v2.tools.recursos.desc')}</p>
          </Link>
        </div>
      </section>

      {/* Dreceres ràpides — Operativa runners (Trànsit / Penal) */}
      <section className="home-section">
        <div className="hs-head">
          <span className="tag">⚡ {t('home.op.shortcuts')}</span>
          <span className="rule" />
          <Link to="/operativa" className="more">
            {t('home.v2.tools.viewAll')} →
          </Link>
        </div>
        <div className="op-shortcuts">
          <Link to="/operativa/trafico" className="op-short trafico">
            <span className="op-short-icon">🚗</span>
            <div className="op-short-text">
              <span className="op-short-eyebrow">OPERATIVA</span>
              <span className="op-short-title">{t('home.op.trafico')}</span>
              <span className="op-short-desc">{t('home.op.traficoDesc')}</span>
            </div>
            <span className="op-short-arr">→</span>
          </Link>
          <Link to="/operativa/penal" className="op-short penal">
            <span className="op-short-icon">⚖️</span>
            <div className="op-short-text">
              <span className="op-short-eyebrow">OPERATIVA</span>
              <span className="op-short-title">{t('home.op.penal')}</span>
              <span className="op-short-desc">{t('home.op.penalDesc')}</span>
            </div>
            <span className="op-short-arr">→</span>
          </Link>
          <Link to="/operativa/penal/drets-detingut" className="op-short detingut">
            <span className="op-short-icon">📜</span>
            <div className="op-short-text">
              <span className="op-short-eyebrow">REFERÈNCIA</span>
              <span className="op-short-title">{t('home.op.drets')}</span>
              <span className="op-short-desc">{t('home.op.dretsDesc')}</span>
            </div>
            <span className="op-short-arr">→</span>
          </Link>
          <Link to="/operativa/penal/recursos" className="op-short recursos">
            <span className="op-short-icon">📞</span>
            <div className="op-short-text">
              <span className="op-short-eyebrow">REFERÈNCIA</span>
              <span className="op-short-title">{t('home.op.tels')}</span>
              <span className="op-short-desc">{t('home.op.telsDesc')}</span>
            </div>
            <span className="op-short-arr">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Vista ACADÈMIA — stats + rutes d'estudi ───────────────── */
function AcademiaView({ failuresDue }: { failuresDue: number }) {
  const { t } = useT();
  const totalAnswered = TOPICS.reduce(
    (acc, top) => acc + getAnsweredIds(top.slug).size,
    0,
  );
  const xp = totalAnswered * 12;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const streakDays = Math.min(99, Math.max(1, Math.floor(totalAnswered / 4)));
  const gems = Math.max(0, totalAnswered * 5);
  const temariCount = getTopicsByCategory('temari').length;
  const municipiCount = getTopicsByCategory('municipi').length;

  // Continuar tema en curs.
  const cont = (() => {
    const temari = getTopicsByCategory('temari');
    let best: { slug: string; title: string; pct: number } | null = null;
    for (const tt of temari) {
      const total = tt.questions.length;
      if (total === 0) continue;
      const answered = getAnsweredIds(tt.slug).size;
      const pct = Math.round((answered / total) * 100);
      if (pct > 0 && pct < 100 && (!best || pct > best.pct)) {
        best = { slug: tt.slug, title: tt.title, pct };
      }
    }
    if (best) return best;
    const fallback = temari[0];
    return fallback ? { slug: fallback.slug, title: fallback.title, pct: 0 } : null;
  })();

  return (
    <>
      {/* STATS */}
      <section className="ac-stats" style={{ marginTop: 18 }}>
        <div className="ac-stat streak">
          <span className="lab">🔥 {t('academia.stat.streak')}</span>
          <div className="num">
            {streakDays}<span className="u">{t('academia.stat.days')}</span>
          </div>
        </div>
        <div className="ac-stat xp">
          <span className="lab">⚡ {t('academia.stat.xp')}</span>
          <div className="num">
            {xp.toLocaleString('es-ES')}
            <span className="u">XP · {t('academia.stat.level')} {level}</span>
          </div>
        </div>
        <div className="ac-stat gems">
          <span className="lab">💎 {t('academia.stat.gems')}</span>
          <div className="num">{gems.toLocaleString('es-ES')}</div>
        </div>
        <div className="ac-stat rank">
          <span className="lab">🏆 {t('academia.stat.league')}</span>
          <div className="num">
            {failuresDue > 0 ? (
              <>
                🔁 {failuresDue}
                <span className="u">{t('academia.stat.dueShort')}</span>
              </>
            ) : (
              <>
                Zafiro
                <span className="u">{t('academia.stat.position')} 4</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3 ROUTES — Reptes / Mossos / Policia Local */}
      <section className="routes" style={{ marginTop: 22 }}>
        <Link to="/retos" className="route retos">
          <span className="ribbon hot">{t('academia.route.retos.ribbon')}</span>
          <div className="icon-block"><span style={{ fontSize: 44 }}>⚡</span></div>
          <h2>
            {t('academia.route.retos.titleA')}<br />
            {t('academia.route.retos.titleB')}
          </h2>
          <p className="sub">{t('academia.route.retos.sub')}</p>
          <div className="progress">
            <div className="pmeta">
              <span>
                {cont ? `${cont.title.toUpperCase()} · TEMARI` : 'COMENÇA EL PRIMER REPTE'}
              </span>
              <span>{cont ? `${cont.pct}%` : '0%'}</span>
            </div>
            <div className="pbar">
              <span style={{ width: `${cont ? cont.pct : 0}%` }} />
            </div>
          </div>
          <span className="cta">
            {t('academia.route.retos.cta')} <span className="arr">→</span>
          </span>
        </Link>

        <Link to="/mossos" className="route mossos">
          <span className="ribbon">
            {temariCount} {t('academia.topics')}
          </span>
          <div className="icon-block"><span style={{ fontSize: 38 }}>🛡️</span></div>
          <h2>Mossos<br />d'Esquadra</h2>
          <p className="sub">{t('academia.route.mossos.sub')}</p>
          <span className="cta">
            {t('academia.route.mossos.cta')} <span className="arr">→</span>
          </span>
        </Link>

        <Link to="/policia-local" className="route local">
          <span className="ribbon">
            {municipiCount} {t('academia.topics')}
          </span>
          <div className="icon-block"><span style={{ fontSize: 38 }}>🚓</span></div>
          <h2>Policia<br />Local</h2>
          <p className="sub">{t('academia.route.local.sub')}</p>
          <span className="cta">
            {t('academia.route.local.cta')} <span className="arr">→</span>
          </span>
        </Link>
      </section>

      {/* Continuar */}
      {cont && (
        <section className="cont-row" style={{ marginTop: 22 }}>
          <article className="cont-card">
            <div className="eyebrow">↻ {t('academia.continue.eyebrow')}</div>
            <h3>{cont.title}</h3>
            <div className="progressline">
              <span style={{ width: `${cont.pct}%` }} />
            </div>
            <div className="row-actions">
              <Link to={`/policia-local/${cont.slug}`} className="btn btn-primary">
                ▶ {t('academia.continue.cta')}
              </Link>
              <Link to="/leyes" className="btn btn-ghost">
                {t('academia.continue.viewSyllabus')}
              </Link>
            </div>
          </article>
        </section>
      )}
    </>
  );
}
