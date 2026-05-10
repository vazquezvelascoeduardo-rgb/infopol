// Pàgina d'índex de Cultura General · banc de preguntes per matèria.
// Disseny: hero (lila) + zona de tests amb mode destacat "Tots els
// temes" + cards de categoria. Mateix patró UX que /policia-local i
// /mossos però simplificat (no hi ha flashcards ni temari aquí).
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS } from '../data/tests';
import { getTopicStats, levelFromBest, type Level } from '../lib/testStats';
import type { TestTopic } from '../data/tests/types';

const ACCENT = '#9747D6';

const LEVEL_LVL: Record<Level, { lvl: 'easy' | 'medium' | 'hard' | 'none'; label: string }> = {
  none:         { lvl: 'none',   label: 'Sense fer' },
  novice:       { lvl: 'easy',   label: 'Iniciat' },
  intermediate: { lvl: 'medium', label: 'Intermedi' },
  advanced:     { lvl: 'hard',   label: 'Avançat' },
  expert:       { lvl: 'hard',   label: 'Expert' },
};

function accentToColors(accent: string): { c: string; bg: string } {
  const m = accent.match(/from-([a-z]+)-/);
  const color = m ? m[1] : 'slate';
  const map: Record<string, { c: string; bg: string }> = {
    amber: { c: '#9c7a1f', bg: '#FFF1D2' },
    yellow: { c: '#9c7a1f', bg: '#FFF8E0' },
    red: { c: '#C13030', bg: '#FFE4E4' },
    rose: { c: '#C13030', bg: '#FFE4E4' },
    pink: { c: '#C13030', bg: '#FFE4EE' },
    orange: { c: '#D9531A', bg: '#FFE4D2' },
    blue: { c: '#2F6BD8', bg: '#EAF1FE' },
    sky: { c: '#2F6BD8', bg: '#EAF6FE' },
    indigo: { c: '#4338CA', bg: '#E7E5FE' },
    violet: { c: '#7C3AED', bg: '#EFE5FE' },
    purple: { c: '#9747D6', bg: '#F5E9FF' },
    fuchsia: { c: '#A21CAF', bg: '#FCE7FA' },
    emerald: { c: '#0E8A6F', bg: '#E1F4EE' },
    green: { c: '#1f8a4d', bg: '#DFF7E9' },
    teal: { c: '#0E8A8A', bg: '#E1F4F4' },
    slate: { c: '#475569', bg: '#EEF2F6' },
    gray: { c: '#475569', bg: '#EEF2F6' },
    stone: { c: '#57534E', bg: '#F1EFEC' },
  };
  return map[color] ?? map.slate;
}

export default function CulturaGeneral() {
  const { t } = useT();
  const culturaTopics = TOPICS.filter((tp) => tp.category === 'cultura');
  const totalQuestions = culturaTopics.reduce((acc, tp) => acc + tp.questions.length, 0);

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('cultura.title')}</span>
      </nav>

      {/* HERO */}
      <header
        className="card card-accent"
        style={{ ['--accent' as never]: ACCENT } as React.CSSProperties}
      >
        <div className="card-grid">
          <span
            className="appicon lg"
            style={{ ['--accent' as never]: ACCENT } as React.CSSProperties}
          >
            <span style={{ fontSize: 30 }}>🎓</span>
          </span>
          <div>
            <div className="eyebrow" style={{ color: ACCENT }}>
              {t('cultura.badge')}
            </div>
            <h1 className="card-title xl mt-1">{t('cultura.title')}</h1>
            <p className="card-desc">
              {t('cultura.testsSubtitle')}
              {' · '}
              <span className="font-mono">
                {culturaTopics.length} {t('cultura.subjects')} · {totalQuestions} preguntes
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ZONA DE TESTS */}
      <section
        className="tests-zone"
        style={{
          background: 'linear-gradient(180deg, #F5E9FF 0%, var(--white) 60%)',
          borderColor: 'color-mix(in oklab, #9747D6 28%, transparent)',
          boxShadow: '0 2px 14px -8px rgba(151, 71, 214, 0.22)',
        }}
      >
        <header className="tests-zone-head">
          <div className="eyebrow" style={{ color: ACCENT }}>
            🎓 {t('cultura.zoneEyebrow')}
          </div>
          <h2>{t('cultura.zoneTitle')}</h2>
          <p>{t('cultura.zoneSubtitle').replace('{n}', String(totalQuestions))}</p>
        </header>

        {/* Mode destacat: Tots els temes */}
        <div className="tests-zone-modes" style={{ gridTemplateColumns: '1fr' }}>
          <Link to="/cultura-general/tot" className="ts-mode featured">
            <span className="mtag">⚡ {t('cultura.allTag')}</span>
            <div>
              <h3>{t('cultura.allTitle')}</h3>
              <p>{t('cultura.allSub')}</p>
            </div>
            <div className="footer">
              <div className="specs">
                <span>{totalQuestions} preguntes</span>
                <span>·</span>
                <span>{culturaTopics.length} matèries</span>
              </div>
              <span className="cta">
                ▶ {t('test.start')} <span className="arr">→</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="tests-zone-divider">
          <span className="line" />
          <span className="lbl">{t('cultura.orBySubject')}</span>
          <span className="line" />
        </div>

        <div className="test-grid">
          {culturaTopics.map((topic) => (
            <CulturaCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CulturaCard({ topic }: { topic: TestTopic }) {
  const stats = getTopicStats(topic.slug);
  const level = levelFromBest(stats?.best);
  const lvlMeta = LEVEL_LVL[level];
  const colors = accentToColors(topic.accent);
  const total = topic.questions.length;
  const pct = stats?.best
    ? Math.min(100, Math.round((stats.best / 10) * 100))
    : 0;

  return (
    <Link
      to={`/cultura-general/${topic.slug}`}
      className="tcard"
      style={{
        ['--accent' as never]: colors.c,
        ['--accent-bg' as never]: colors.bg,
      } as React.CSSProperties}
    >
      <div className="head">
        <span className="ico" aria-hidden>{topic.icon}</span>
        <span className={`lvl ${lvlMeta.lvl}`}>{lvlMeta.label}</span>
      </div>
      <h4>{topic.title}</h4>
      {topic.description && <p>{topic.description}</p>}
      <div className="specs">
        <span className="spec">{total} preguntes</span>
      </div>
      <div className="footer-row">
        <div className="progress-mini">
          <div className="pmini-bar"><span style={{ width: `${pct}%` }} /></div>
          <span className="pmini-pct">{pct}%</span>
        </div>
        <span className="start">{pct > 0 ? 'Continuar' : 'Començar'} →</span>
      </div>
    </Link>
  );
}
