// Pàgina principal de Mossos d'Esquadra · paral·lel a TestList de
// Policia Local. Mateixa estructura: hero + jump buttons + stats
// personals + tests agrupats per àmbit + modes (Test ràpid + Repàs)
// + recents + temari (placeholder mentre no es configuri).
//
// Totes les estadístiques i recents es filtren ALS TEMES DE MOSSOS
// (category 'mossos'); els altres temes (Policia Local) viuen a la
// seva pàgina /policia-local i no es barregen aquí.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, getMossosByAmbit } from '../../data/tests';
import { getTopicStats, levelFromBest, useGlobalStats, type Level } from '../../lib/testStats';
import { useFailuresCounts } from '../../lib/failures';
import { useT } from '../../lib/i18n';
import type { TestTopic } from '../../data/tests/types';

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

const AMBIT_LABELS: Record<string, { title: string; sub: string }> = {
  A: {
    title: "Àmbit A · Coneixements de l'entorn",
    sub: 'Història, geografia, llengua, entorn social i TIC',
  },
  B: { title: 'Àmbit B · Institucional', sub: 'Organització política, administrativa i jurídica' },
  C: { title: 'Àmbit C · Seguretat', sub: 'Seguretat pública i policia' },
  D: { title: 'Àmbit D', sub: '' },
  E: { title: 'Àmbit E', sub: '' },
};

export default function MossosList() {
  const { t } = useT();
  const ambits = getMossosByAmbit();
  const failures = useFailuresCounts();
  const stats = useGlobalStats();

  // Slugs dels temes de Mossos per filtrar stats i recents.
  const mossosSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const tp of TOPICS) {
      if (tp.category === 'mossos') set.add(tp.slug);
    }
    return set;
  }, []);

  const totalTopics = ambits.reduce((acc, a) => acc + a.topics.length, 0);
  const totalQuestions = ambits.reduce(
    (acc, a) => acc + a.topics.reduce((n, tp) => n + tp.questions.length, 0),
    0,
  );

  // Estadístiques personals — només temes de Mossos.
  const accuracy = (() => {
    let correct = 0;
    let total = 0;
    for (const slug of mossosSlugs) {
      const s = stats.topics[slug];
      if (!s) continue;
      correct += s.totalCorrect;
      total += s.totalQuestions;
    }
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  })();

  const completedTests = (() => {
    let acc = 0;
    for (const slug of mossosSlugs) {
      const s = stats.topics[slug];
      if (s) acc += s.attempts;
    }
    return acc;
  })();

  const avgGrade = (() => {
    let sum = 0;
    let n = 0;
    for (const slug of mossosSlugs) {
      const s = stats.topics[slug];
      if (s && s.attempts > 0) {
        sum += s.best;
        n++;
      }
    }
    return n > 0 ? sum / n : 0;
  })();

  const streakDays = (() => {
    const ts: number[] = [];
    for (const slug of mossosSlugs) {
      const s = stats.topics[slug];
      if (s?.lastAt) ts.push(s.lastAt);
    }
    if (ts.length === 0) return 0;
    const days = Math.round((Math.max(...ts) - Math.min(...ts)) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(99, Math.max(1, days));
  })();

  // Nivell qualitatiu del millor tema de Mossos.
  const bestLevel: Level = (() => {
    const order: Level[] = ['none', 'novice', 'intermediate', 'advanced', 'expert'];
    let best: Level = 'none';
    for (const slug of mossosSlugs) {
      const s = stats.topics[slug];
      const lvl = levelFromBest(s?.best);
      if (order.indexOf(lvl) > order.indexOf(best)) best = lvl;
    }
    return best;
  })();
  const bestLevelMeta = LEVEL_LVL[bestLevel];

  // Últims 4 tests de Mossos (per lastAt desc).
  const recents = useMemo(() => {
    return Object.entries(stats.topics)
      .filter(([slug]) => mossosSlugs.has(slug))
      .map(([slug, s]) => ({ slug, ...s }))
      .filter((x) => x.lastAt > 0)
      .sort((a, b) => b.lastAt - a.lastAt)
      .slice(0, 4);
  }, [stats, mossosSlugs]);

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

      {/* JUMP BUTTONS — Tests, Flashcards i Temari */}
      <nav className="pl-jump pl-jump-3" aria-label={t('policiaLocal.jump.aria')}>
        <a href="#mossos-tests" className="pl-jump-btn jump-tests">
          <span className="pl-jump-icon" aria-hidden>📝</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTests')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.tests')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </a>
        <Link to="/mossos/flashcards" className="pl-jump-btn jump-flash">
          <span className="pl-jump-icon" aria-hidden>🃏</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('flashcards.eyebrow')}</span>
            <span className="pl-jump-title">{t('flashcards.title')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
        <a href="#mossos-temari" className="pl-jump-btn jump-temari">
          <span className="pl-jump-icon" aria-hidden>📚</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTemari')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.temari')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </a>
      </nav>

      {/* STATS PERSONALS */}
      <section className="my-stats">
        <div className="my-stat acc">
          <span className="lab">⭐ {t('test.list.stat.accuracy')}</span>
          <div className="num">{accuracy}<span className="u">%</span></div>
        </div>
        <div className="my-stat streak">
          <span className="lab">🔥 {t('test.list.stat.streak')}</span>
          <div className="num">
            {streakDays}<span className="u">{t('test.list.stat.days')}</span>
          </div>
        </div>
        <div className="my-stat done">
          <span className="lab">✅ {t('test.list.stat.completed')}</span>
          <div className="num">
            {completedTests}<span className="u">{t('test.list.stat.tests')}</span>
          </div>
        </div>
        <div className="my-stat lvl">
          <span className="lab">🏆 {t('test.list.stat.level')}</span>
          <div className="num">
            {avgGrade > 0 ? avgGrade.toFixed(1) : '–'}
            <span className="u">{bestLevelMeta.label}</span>
          </div>
        </div>
      </section>

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

      {/* MODES — Test ràpid (tots els temes Mossos) + Repàs (universal) */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--terracotta)', marginTop: 32 } as React.CSSProperties}
      >
        <span className="eyebrow">⚡ {t('test.list.modes.eyebrow')}</span>
        <span className="rule" />
      </div>

      <section className="ts-modes">
        <Link to="/mossos/tot" className="ts-mode featured">
          <span className="mtag">⚡ {t('test.list.modes.featured.tag')}</span>
          <div>
            <h3>{t('test.list.modes.featured.title')}</h3>
            <p>{t('test.list.modes.featured.sub')}</p>
          </div>
          <div className="footer">
            <div className="specs">
              <span>{totalQuestions} preguntes</span>
              <span>·</span>
              <span>{totalTopics} subtemes</span>
            </div>
            <span className="cta">
              ▶ {t('test.start')} <span className="arr">→</span>
            </span>
          </div>
        </Link>

        <Link to="/mossos/repas" className="ts-mode fail">
          <span className="mtag">🔁 {t('test.list.modes.repas.tag')}</span>
          <div>
            <h3>{t('test.list.modes.repas.title')}</h3>
            <p>
              {failures.due > 0
                ? t('test.list.modes.repas.subDue').replace('{n}', String(failures.due))
                : failures.total > 0
                  ? t('test.list.modes.repas.subTotal').replace('{n}', String(failures.total))
                  : t('test.list.modes.repas.subEmpty')}
            </p>
          </div>
          <div className="footer">
            <div className="specs">
              <span>{failures.due} {t('test.list.modes.repas.due')}</span>
              <span>·</span>
              <span>{failures.total} {t('test.list.modes.repas.total')}</span>
            </div>
            <span className="cta">
              {t('test.list.modes.repas.cta')} <span className="arr">→</span>
            </span>
          </div>
        </Link>
      </section>

      {/* RECENTS — només tests de Mossos */}
      {recents.length > 0 && (
        <section className="ts-recent">
          <div
            className="section-head"
            style={{ ['--accent' as never]: 'var(--ink)' } as React.CSSProperties}
          >
            <span className="eyebrow">🕘 {t('test.list.recent.eyebrow')}</span>
            <span className="rule" />
          </div>
          <div className="recent-grid">
            {recents.map((r) => (
              <RecentRow
                key={r.slug}
                slug={r.slug}
                best={r.best}
                last={r.last}
                attempts={r.attempts}
                lastAt={r.lastAt}
              />
            ))}
          </div>
        </section>
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
  const lvlMeta = LEVEL_LVL[level];
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

function RecentRow({
  slug, best, last, attempts, lastAt,
}: {
  slug: string; best: number; last: number; attempts: number; lastAt: number;
}) {
  const { t } = useT();
  const topic = TOPICS.find((x) => x.slug === slug);
  if (!topic) return null;

  const grade = last || best;
  const score10 = Math.round(grade * 10) / 10;
  const tone = grade >= 7 ? 'high' : grade >= 5 ? 'mid' : 'low';
  const when = formatRelative(lastAt, t);

  return (
    <Link to={`/mossos/${slug}`} className="rec-row">
      <span className={`score-circ ${tone}`}>{score10}</span>
      <div className="min-w-0">
        <div className="rttl truncate">{topic.title}</div>
        <div className="rmeta">
          {attempts} {attempts === 1 ? t('test.list.recent.attempt') : t('test.list.recent.attempts')}
          {' · '}
          {t('test.list.recent.bestShort')} {best.toFixed(1)}
        </div>
      </div>
      <span className="when">{when}</span>
      <span className="rcta">{t('test.list.recent.repeat')}</span>
    </Link>
  );
}

function formatRelative(ts: number, t: (k: string) => string): string {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 1) return t('test.list.recent.justNow');
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d`;
  const mo = Math.round(d / 30);
  return `${mo} mes`;
}
