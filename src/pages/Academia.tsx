// Pàgina Acadèmia · rebranding 2026.
// Hero personalitzat + 4 stats (racha/XP/gemas/lliga) + 3 routes
// (Reptes / Mossos / Policia Local) amb progress bars + continuar
// + propers desbloquejos + strip d'altres accessos.
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS, getTopicsByCategory } from '../data/tests';
import { getAnsweredIds } from '../lib/testProgress';
import { useFailuresCounts } from '../lib/failures';

/* ── Càlcul de progrés per a la card "Continuar" ─────────── */
function pickContinueTopic() {
  // Tria un tema "temari" amb progrés > 0% però < 100% per mostrar
  // el "continúa donde lo dejaste". Si no n'hi ha cap, mostra el
  // primer tema del temari oficial.
  const temari = getTopicsByCategory('temari');
  let best: { topic: typeof temari[number]; pct: number } | null = null;
  for (const t of temari) {
    const total = t.questions.length;
    if (total === 0) continue;
    const answered = getAnsweredIds(t.slug).size;
    const pct = Math.round((answered / total) * 100);
    if (pct > 0 && pct < 100) {
      if (!best || pct > best.pct) best = { topic: t, pct };
    }
  }
  if (best) return best;
  // Fallback: primer tema temari sense progrés
  const fallback = temari[0];
  if (!fallback) return null;
  return { topic: fallback, pct: 0 };
}

export default function Academia() {
  const { t } = useT();
  const { due: failuresDue } = useFailuresCounts();
  const cont = pickContinueTopic();

  // Stats: racha (placeholder), XP (n. preguntes contestades a tots
  // els temes), gemes (placeholder), lliga (placeholder).
  const totalAnswered = TOPICS.reduce(
    (acc, top) => acc + getAnsweredIds(top.slug).size,
    0,
  );
  const xp = totalAnswered * 12;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const streakDays = Math.min(99, Math.max(1, Math.floor(totalAnswered / 4)));
  const gems = Math.max(0, totalAnswered * 5);

  // Comptatge de mòduls per a Mossos i Policia Local
  const temariCount = getTopicsByCategory('temari').length;
  const municipiCount = getTopicsByCategory('municipi').length;

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('academia.title')}</span>
      </nav>

      {/* HERO */}
      <header className="ac-hero">
        <div className="eyebrow" style={{ color: 'var(--terracotta)' }}>
          🎓 {t('academia.hero.eyebrow')}
        </div>
        <h1>
          {t('academia.hero.greeting')}<br />
          {t('academia.hero.todayPrefix')}{' '}
          <span style={{ color: 'var(--terracotta)' }}>
            {cont ? cont.topic.title : t('academia.hero.todayDefault')}
          </span>
          .
        </h1>
        <p>{t('academia.hero.subtitle')}</p>
      </header>

      {/* STATS */}
      <section className="ac-stats">
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

      {/* 3 ROUTES */}
      <section className="routes">
        <Link to="/retos" className="route retos">
          <span className="ribbon hot">{t('academia.route.retos.ribbon')}</span>
          <div className="icon-block"><span style={{ fontSize: 44 }}>⚡</span></div>
          <h2>
            {t('academia.route.retos.titleA')}<br />
            {t('academia.route.retos.titleB')}
          </h2>
          <p className="sub">{t('academia.route.retos.sub')}</p>
          <div className="feats">
            <span>{t('academia.route.retos.feat1')}</span>
            <span>{t('academia.route.retos.feat2')}</span>
            <span>{t('academia.route.retos.feat3')}</span>
            <span>{t('academia.route.retos.feat4')}</span>
          </div>
          <div className="progress">
            <div className="pmeta">
              <span>
                {cont
                  ? `${cont.topic.title.toUpperCase()} · TEMARI`
                  : 'COMENÇA EL PRIMER REPTE'}
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

        <Link to="/test" className="route mossos">
          <span className="ribbon">
            PSOE · {temariCount} {t('academia.topics')}
          </span>
          <div className="icon-block"><span style={{ fontSize: 38 }}>🛡️</span></div>
          <h2>
            Mossos<br />d'Esquadra
          </h2>
          <p className="sub">{t('academia.route.mossos.sub')}</p>
          <div className="feats">
            <span>{t('academia.route.mossos.feat1')}</span>
            <span>{t('academia.route.mossos.feat2')}</span>
            <span>{t('academia.route.mossos.feat3')}</span>
            <span>{t('academia.route.mossos.feat4')}</span>
          </div>
          <div className="progress">
            <div className="pmeta">
              <span>{t('academia.topics').toUpperCase()} · {temariCount}</span>
              <span>—</span>
            </div>
            <div className="pbar"><span style={{ width: '34%' }} /></div>
          </div>
          <span className="cta">
            {t('academia.route.mossos.cta')} <span className="arr">→</span>
          </span>
        </Link>

        <Link to="/test" className="route local">
          <span className="ribbon">
            PSOE LOCAL · {municipiCount} {t('academia.topics')}
          </span>
          <div className="icon-block"><span style={{ fontSize: 38 }}>🚓</span></div>
          <h2>
            Policía<br />Local
          </h2>
          <p className="sub">{t('academia.route.local.sub')}</p>
          <div className="feats">
            <span>{t('academia.route.local.feat1')}</span>
            <span>{t('academia.route.local.feat2')}</span>
            <span>{t('academia.route.local.feat3')}</span>
            <span>{t('academia.route.local.feat4')}</span>
          </div>
          <div className="progress">
            <div className="pmeta">
              <span>{municipiCount} {t('academia.cities').toUpperCase()}</span>
              <span>—</span>
            </div>
            <div className="pbar"><span style={{ width: '22%' }} /></div>
          </div>
          <span className="cta">
            {t('academia.route.local.cta')} <span className="arr">→</span>
          </span>
        </Link>
      </section>

      {/* CONTINUE + NEXT */}
      <section className="cont-row">
        <article className="cont-card">
          <div className="eyebrow">
            ↻ {t('academia.continue.eyebrow')}
          </div>
          <h3>{cont ? cont.topic.title : t('academia.continue.empty')}</h3>
          <p className="meta">
            {cont
              ? `${cont.topic.description ?? ''}`
              : t('academia.continue.emptyMeta')}
          </p>
          <div className="progressline">
            <span style={{ width: `${cont ? cont.pct : 0}%` }} />
          </div>
          <div className="pmeta">
            <span>
              {cont
                ? `${getAnsweredIds(cont.topic.slug).size} / ${cont.topic.questions.length} ${t('academia.questions')}`
                : `0 / 0 ${t('academia.questions')}`}
            </span>
            <span>
              {cont
                ? `${Math.max(1, Math.round((cont.topic.questions.length - getAnsweredIds(cont.topic.slug).size) * 0.5))} ${t('academia.minLeft')}`
                : '—'}
            </span>
          </div>
          <div className="row-actions">
            {cont ? (
              <Link to={`/test/${cont.topic.slug}`} className="btn btn-primary">
                ▶ {t('academia.continue.cta')}
              </Link>
            ) : (
              <Link to="/test" className="btn btn-primary">
                ▶ {t('academia.continue.start')}
              </Link>
            )}
            <Link to="/leyes" className="btn btn-ghost">
              {t('academia.continue.viewSyllabus')}
            </Link>
          </div>
        </article>

        <aside className="next-card">
          <div className="eyebrow">
            📅 {t('academia.next.eyebrow')}
          </div>
          <h4>{t('academia.next.title')}</h4>
          <p>{t('academia.next.subtitle')}</p>
          <ul className="next-list">
            <li>
              <span className="nl-ico">🎯</span>
              <b>{t('academia.next.item1')}</b>
              <span className="nl-meta">JUE</span>
            </li>
            <li>
              <span className="nl-ico">⚔️</span>
              <b>{t('academia.next.item2')}</b>
              <span className="nl-meta">VIE</span>
            </li>
            <li>
              <span className="nl-ico">👑</span>
              <b>{t('academia.next.item3')}</b>
              <span className="nl-meta">DOM</span>
            </li>
          </ul>
        </aside>
      </section>

      {/* STRIP — otros accesos */}
      <section>
        <div
          className="section-head"
          style={{ ['--accent' as never]: '#2F6BD8' } as React.CSSProperties}
        >
          <span className="eyebrow">🧭 {t('academia.strip.eyebrow')}</span>
          <span className="rule" />
        </div>
        <div className="strip">
          <Link to="/leyes">
            <span className="si" style={{ background: '#FFF6E8', color: '#9c7a1f' }}>📘</span>
            <div>
              <h5>{t('academia.strip.leyes.title')}</h5>
              <p>{t('academia.strip.leyes.desc')}</p>
            </div>
          </Link>
          <Link to="/test">
            <span className="si" style={{ background: '#EAF1FE', color: '#2F6BD8' }}>📝</span>
            <div>
              <h5>{t('academia.strip.tests.title')}</h5>
              <p>{t('academia.strip.tests.desc')}</p>
            </div>
          </Link>
          <Link to="/operativa">
            <span className="si" style={{ background: '#DFF7E9', color: '#1f8a4d' }}>🚓</span>
            <div>
              <h5>{t('academia.strip.operativa.title')}</h5>
              <p>{t('academia.strip.operativa.desc')}</p>
            </div>
          </Link>
          <Link to="/recursos">
            <span className="si" style={{ background: '#F5E9FF', color: '#9747D6' }}>📚</span>
            <div>
              <h5>{t('academia.strip.recursos.title')}</h5>
              <p>{t('academia.strip.recursos.desc')}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
