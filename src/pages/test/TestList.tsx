// Pàgina de Tests · rebranding 2026.
// Disseny: hero fosc + stats personals + grid de categories AMUNT
// (filtres + tcards de tots els temes existents) + modes destacats
// (Test ràpid + Repàs intel·ligent — sense duels ni lliga) + últims
// tests realitzats per l'usuari.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, getMunicipiGroups, getTopicsByCategory } from '../../data/tests';
import {
  globalAverage, getTopicStats, levelFromBest, useGlobalStats, type Level,
} from '../../lib/testStats';
import { useFailuresCounts } from '../../lib/failures';
import { useT } from '../../lib/i18n';

type FilterId = 'all' | 'temari' | 'cultura' | 'municipi';

// Mapeja l'accent Tailwind del topic ('from-red-500 to-rose-700') a un
// color sòlid + un fons translúcid coordinat, per usar a `--accent` /
// `--accent-bg` de la tcard del rebrand.
function accentToColors(accent: string): { c: string; bg: string } {
  const m = accent.match(/from-([a-z]+)-/);
  const color = m ? m[1] : 'slate';
  const map: Record<string, { c: string; bg: string }> = {
    amber:   { c: '#9c7a1f', bg: '#FFF1D2' },
    yellow:  { c: '#9c7a1f', bg: '#FFF8E0' },
    red:     { c: '#C13030', bg: '#FFE4E4' },
    rose:    { c: '#C13030', bg: '#FFE4E4' },
    pink:    { c: '#C13030', bg: '#FFE4EE' },
    orange:  { c: '#D9531A', bg: '#FFE4D2' },
    blue:    { c: '#2F6BD8', bg: '#EAF1FE' },
    sky:     { c: '#2F6BD8', bg: '#E0F2FE' },
    indigo:  { c: '#4338CA', bg: '#E8E8FB' },
    cyan:    { c: '#0891b2', bg: '#E0F7FA' },
    teal:    { c: '#0F766E', bg: '#D7F0EC' },
    emerald: { c: '#1f8a4d', bg: '#DFF7E9' },
    green:   { c: '#1f8a4d', bg: '#DFF7E9' },
    lime:    { c: '#5C8D17', bg: '#EAF6D8' },
    purple:  { c: '#9747D6', bg: '#F5E9FF' },
    violet:  { c: '#7C3AED', bg: '#EDE3FF' },
    fuchsia: { c: '#C026D3', bg: '#FBE4FF' },
    slate:   { c: '#475569', bg: '#E7ECF5' },
    stone:   { c: '#57534E', bg: '#EFEAE3' },
  };
  return map[color] || { c: '#0E0E0E', bg: '#EFEAE3' };
}

const LEVEL_LVL: Record<Level, { lvl: 'easy' | 'medium' | 'hard' | 'none'; label: string }> = {
  none:         { lvl: 'none',   label: 'Sin empezar' },
  novice:       { lvl: 'easy',   label: 'Principiante' },
  intermediate: { lvl: 'medium', label: 'Intermedio' },
  advanced:     { lvl: 'hard',   label: 'Avanzado' },
  expert:       { lvl: 'hard',   label: 'Experto' },
};

export default function TestList() {
  const { t } = useT();
  const [filter, setFilter] = useState<FilterId>('all');
  const stats = useGlobalStats();
  const { attempts, avgGrade } = globalAverage(stats);
  const failures = useFailuresCounts();

  // Recompte per filtre.
  const counts = useMemo(() => ({
    all: TOPICS.length,
    temari: getTopicsByCategory('temari').length,
    cultura: getTopicsByCategory('cultura').length,
    municipi: getTopicsByCategory('municipi').length,
  }), []);

  // Topics filtrats.
  const visibleTopics = useMemo(() => {
    if (filter === 'all') return TOPICS;
    return TOPICS.filter((tt) => (tt.category ?? 'temari') === filter);
  }, [filter]);

  // Total de preguntes (per al ts-pill del hero).
  const totalQuestions = useMemo(
    () => TOPICS.reduce((acc, tt) => acc + tt.questions.length, 0),
    [],
  );

  // Pseudo-stats personals (sense backend/auth, però amb dades reals
  // del progrés guardades a localStorage).
  const accuracy = (() => {
    let c = 0, q = 0;
    for (const k in stats.topics) {
      c += stats.topics[k].totalCorrect;
      q += stats.topics[k].totalQuestions;
    }
    return q > 0 ? Math.round((c / q) * 100) : 0;
  })();
  const completedTests = attempts;
  // "Streak" simple: dies des del primer al darrer test, capat a 99.
  const streak = (() => {
    const ts = Object.values(stats.topics).map((s) => s.lastAt).filter(Boolean);
    if (ts.length === 0) return 0;
    const days = Math.round((Math.max(...ts) - Math.min(...ts)) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(99, Math.max(1, days));
  })();
  // Nivell qualitatiu del millor tema.
  const bestLevel = (() => {
    let best: Level = 'none';
    const order: Level[] = ['none', 'novice', 'intermediate', 'advanced', 'expert'];
    for (const k in stats.topics) {
      const lvl = levelFromBest(stats.topics[k].best);
      if (order.indexOf(lvl) > order.indexOf(best)) best = lvl;
    }
    return best;
  })();
  const bestLevelMeta = LEVEL_LVL[bestLevel];

  // Últims 4 tests (per lastAt desc).
  const recents = useMemo(() => {
    return Object.entries(stats.topics)
      .map(([slug, s]) => ({ slug, ...s }))
      .filter((x) => x.lastAt > 0)
      .sort((a, b) => b.lastAt - a.lastAt)
      .slice(0, 4);
  }, [stats]);

  return (
    <div className="shell pb-10">
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('test.list.title')}</span>
      </nav>

      {/* HERO */}
      <header className="ts-hero">
        <div className="eyebrow">📝 {t('test.list.hero.eyebrow')}</div>
        <h1>
          {t('test.list.hero.titleA')}<br />
          {t('test.list.hero.titlePrefix')}{' '}
          <em>{t('test.list.hero.titleAccent')}</em>
        </h1>
        <p className="lead">{t('test.list.hero.lead')}</p>
        <div className="ts-stats">
          <span className="ts-pill">
            <b>{totalQuestions.toLocaleString('es-ES')}</b>{' '}
            {t('test.list.hero.questions')}
          </span>
          <span className="ts-pill">
            <b>{TOPICS.length}</b> {t('test.list.hero.topics')}
          </span>
          <span className="ts-pill">
            <b>{getMunicipiGroups().length}</b> {t('test.list.hero.municipios')}
          </span>
          <span className="ts-pill"><b>2026</b> · {t('test.list.hero.updated')}</span>
        </div>
      </header>

      {/* STATS PERSONALS */}
      <section className="my-stats">
        <div className="my-stat acc">
          <span className="lab">⭐ {t('test.list.stat.accuracy')}</span>
          <div className="num">{accuracy}<span className="u">%</span></div>
        </div>
        <div className="my-stat streak">
          <span className="lab">🔥 {t('test.list.stat.streak')}</span>
          <div className="num">
            {streak}<span className="u">{t('test.list.stat.days')}</span>
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

      {/* CATEGORIES — al damunt, com demana l'usuari */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: '#2F6BD8', marginTop: 24 } as React.CSSProperties}
      >
        <span className="eyebrow">📚 {t('test.list.cat.eyebrow')}</span>
        <span className="rule" />
      </div>

      <div className="cat-filters" role="tablist">
        <FilterChip
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label={t('test.list.cat.all')}
          n={counts.all}
        />
        <FilterChip
          active={filter === 'temari'}
          onClick={() => setFilter('temari')}
          label={t('test.list.section.temari')}
          n={counts.temari}
        />
        {counts.cultura > 0 && (
          <FilterChip
            active={filter === 'cultura'}
            onClick={() => setFilter('cultura')}
            label={t('test.list.section.cultura')}
            n={counts.cultura}
          />
        )}
        {counts.municipi > 0 && (
          <FilterChip
            active={filter === 'municipi'}
            onClick={() => setFilter('municipi')}
            label={t('test.list.section.municipi')}
            n={counts.municipi}
          />
        )}
      </div>

      <section className="test-grid">
        {visibleTopics.map((topic) => (
          <TestCard key={topic.slug} topic={topic} />
        ))}
      </section>

      {/* MODES — només Test ràpid + Repàs (sense duels, sense lliga) */}
      <div
        className="section-head"
        style={{ ['--accent' as never]: 'var(--terracotta)', marginTop: 32 } as React.CSSProperties}
      >
        <span className="eyebrow">⚡ {t('test.list.modes.eyebrow')}</span>
        <span className="rule" />
      </div>

      <section className="ts-modes">
        <Link to="/policia-local/tot" className="ts-mode featured">
          <span className="mtag">⚡ {t('test.list.modes.featured.tag')}</span>
          <div>
            <h3>{t('test.list.modes.featured.title')}</h3>
            <p>{t('test.list.modes.featured.sub')}</p>
          </div>
          <div className="footer">
            <div className="specs">
              <span>{t('test.list.modes.featured.s1')}</span>
              <span>·</span>
              <span>{t('test.list.modes.featured.s2')}</span>
            </div>
            <span className="cta">
              ▶ {t('test.start')} <span className="arr">→</span>
            </span>
          </div>
        </Link>

        <Link to="/policia-local/repas" className="ts-mode fail">
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

      {/* RECENTS */}
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
              <RecentRow key={r.slug} slug={r.slug} best={r.best} last={r.last}
                attempts={r.attempts} lastAt={r.lastAt} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FilterChip({
  active, onClick, label, n,
}: {
  active: boolean; onClick: () => void; label: string; n: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`cat-filter ${active ? 'active' : ''}`}
    >
      {label}
      <span className="num">{n}</span>
    </button>
  );
}

function TestCard({ topic }: { topic: typeof TOPICS[number] }) {
  const { t } = useT();
  const stats = getTopicStats(topic.slug);
  const level = levelFromBest(stats?.best);
  const lvlMeta = LEVEL_LVL[level];
  const colors = accentToColors(topic.accent);
  const total = topic.questions.length;
  // Progrés segons la millor nota (0-10) — 100% si nota ≥ 9.
  const pct = stats?.best
    ? Math.min(100, Math.round((stats.best / 10) * 100))
    : 0;

  return (
    <Link
      to={`/test/${topic.slug}`}
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
        <span className="spec">{total} {t('test.list.cat.questions')}</span>
        {topic.municipi && <span className="spec">{topic.municipi}</span>}
      </div>
      <div className="footer-row">
        <div className="progress-mini">
          <div className="pmini-bar"><span style={{ width: `${pct}%` }} /></div>
          <span className="pmini-pct">{pct}%</span>
        </div>
        <span className="start">
          {pct > 0
            ? t('test.list.cat.continue')
            : t('test.list.cat.start')}{' '}
          →
        </span>
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
    <Link to={`/test/${slug}`} className="rec-row">
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
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 60) return `${t('test.list.recent.justNow')}`;
  if (h < 24) return `${t('test.list.recent.hoursAgo').replace('{n}', String(h))}`;
  if (d < 7) return `${t('test.list.recent.daysAgo').replace('{n}', String(d))}`;
  return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
