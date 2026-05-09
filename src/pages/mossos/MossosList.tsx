// Pàgina principal de Mossos d'Esquadra (paral·lel a TestList de
// Policia Local). Mateixa estructura: hero + jump buttons + tests
// agrupats per àmbit + temari (placeholder mentre no es configuri).
import { Link } from 'react-router-dom';
import { getMossosByAmbit } from '../../data/tests';
import { getTopicStats, levelFromBest } from '../../lib/testStats';
import { useT } from '../../lib/i18n';
import type { TestTopic } from '../../data/tests/types';

const LEVEL_LVL: Record<string, { lvl: 'easy' | 'medium' | 'hard' | 'none'; label: string }> = {
  expert: { lvl: 'easy', label: 'Expert' },
  bo: { lvl: 'medium', label: 'Bo' },
  iniciat: { lvl: 'hard', label: 'Iniciat' },
  novell: { lvl: 'none', label: 'Sense fer' },
};

// Mateixa funció de mapping de colors que TestList: deriva el color
// d'accent (per la mtag i la barra superior de la card) a partir del
// `accent` Tailwind del topic ('from-blue-500 to-blue-700' → blau).
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
    purple: { c: '#7C3AED', bg: '#EFE5FE' },
    fuchsia: { c: '#A21CAF', bg: '#FCE7FA' },
    emerald: { c: '#0E8A6F', bg: '#E1F4EE' },
    green: { c: '#2F8B3E', bg: '#E5F5E5' },
    teal: { c: '#0E8A8A', bg: '#E1F4F4' },
    slate: { c: '#475569', bg: '#EEF2F6' },
    gray: { c: '#475569', bg: '#EEF2F6' },
    stone: { c: '#57534E', bg: '#F1EFEC' },
  };
  return map[color] ?? map.slate;
}

const AMBIT_LABELS: Record<string, { title: string; sub: string }> = {
  A: {
    title: "Àmbit A · Coneixements de l'entorn",
    sub: 'Història, geografia, llengua, entorn social i TIC',
  },
  B: {
    title: 'Àmbit B · Institucional',
    sub: 'Organització política, administrativa i jurídica',
  },
  C: {
    title: 'Àmbit C · Seguretat',
    sub: 'Seguretat pública i policia',
  },
  D: { title: 'Àmbit D', sub: '' },
  E: { title: 'Àmbit E', sub: '' },
};

export default function MossosList() {
  const { t } = useT();
  const ambits = getMossosByAmbit();
  const totalTopics = ambits.reduce((acc, a) => acc + a.topics.length, 0);
  const totalQuestions = ambits.reduce(
    (acc, a) => acc + a.topics.reduce((n, tp) => n + tp.questions.length, 0),
    0,
  );

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/academia">{t('sidebar.academia')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('mossos.title')}</span>
      </nav>

      {/* HERO */}
      <header className="ts-hero">
        <div className="eyebrow">🛡️ {t('mossos.hero.eyebrow')}</div>
        <h1>
          {t('mossos.hero.titleA')}<br />
          {t('mossos.hero.titlePrefix')} <em>{t('mossos.hero.titleAccent')}</em>
        </h1>
        <p className="lead">{t('mossos.hero.lead')}</p>
        <div className="ts-stats">
          <span className="ts-pill">
            <b>{totalQuestions.toLocaleString('ca-ES')}</b>{' '}
            {t('test.list.hero.questions')}
          </span>
          <span className="ts-pill">
            <b>{totalTopics}</b> {t('mossos.hero.subtemes')}
          </span>
          <span className="ts-pill">
            <b>{ambits.length}</b> {t('mossos.hero.ambits')}
          </span>
          <span className="ts-pill"><b>2026</b> · {t('test.list.hero.updated')}</span>
        </div>
      </header>

      {/* JUMP BUTTONS — accés ràpid a Tests i Temari */}
      <nav className="pl-jump" aria-label={t('policiaLocal.jump.aria')}>
        <a href="#mossos-tests" className="pl-jump-btn jump-tests">
          <span className="pl-jump-icon" aria-hidden>📝</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTests')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.tests')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </a>
        <a href="#mossos-temari" className="pl-jump-btn jump-temari">
          <span className="pl-jump-icon" aria-hidden>📚</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTemari')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.temari')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </a>
      </nav>

      {/* SECCIÓ DE TESTS — agrupats per àmbit */}
      <div
        id="mossos-tests"
        className="section-head"
        style={{ ['--accent' as never]: '#2F6BD8', marginTop: 32, scrollMarginTop: 80 } as React.CSSProperties}
      >
        <span className="eyebrow">📝 {t('mossos.tests.eyebrow')}</span>
        <span className="rule" />
      </div>

      {ambits.length === 0 ? (
        <p className="text-sm text-text-2 mt-4">{t('mossos.tests.empty')}</p>
      ) : (
        ambits.map((group) => {
          const meta = AMBIT_LABELS[group.ambit] ?? { title: group.ambit, sub: '' };
          return (
            <section key={group.ambit} className="mt-6">
              <div className="ambit-head">
                <h2 className="ambit-title">{meta.title}</h2>
                {meta.sub && <p className="ambit-sub">{meta.sub}</p>}
              </div>
              <div className="test-grid">
                {group.topics.map((topic) => (
                  <MossosCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* TEMARI COMPLET — placeholder fins que es configuri */}
      <section
        id="mossos-temari"
        className="pl-leyes"
        style={{ scrollMarginTop: 80 }}
      >
        <div
          className="section-head"
          style={{ ['--accent' as never]: '#9c7a1f', marginTop: 32 } as React.CSSProperties}
        >
          <span className="eyebrow">📚 {t('mossos.temari.eyebrow')}</span>
          <span className="rule" />
        </div>
        <p className="text-sm text-text-2 mt-2 mb-4">{t('mossos.temari.subtitle')}</p>
        <div className="rounded-2xl border border-dashed border-line bg-paper-2 p-6 text-center">
          <p className="text-sm text-text-2">{t('mossos.temari.coming')}</p>
        </div>
      </section>
    </div>
  );
}

function MossosCard({ topic }: { topic: TestTopic }) {
  const stats = getTopicStats(topic.slug);
  const level = levelFromBest(stats?.best);
  const lvlMeta = LEVEL_LVL[level] ?? LEVEL_LVL.novell;
  const colors = accentToColors(topic.accent);
  const total = topic.questions.length;
  const pct = stats?.best
    ? Math.min(100, Math.round((stats.best / 10) * 100))
    : 0;

  return (
    <Link
      to={`/mossos/${topic.slug}`}
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
