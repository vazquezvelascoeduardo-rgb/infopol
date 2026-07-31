// Pàgina principal de Mossos d'Esquadra. La "zona de tests" (hero +
// stats personals + modes ràpids + cards d'àmbit + recents) fa servir
// els mateixos àtoms que /policia-local (src/pages/test/atoms.tsx),
// canviant només el color d'accent (granate Mossos) i basePath.
// Les seccions específiques de Mossos (jump buttons, Temari complet
// per àmbits, Esquemes ràpids) es mantenen amb el seu estil propi.
//
// Totes les estadístiques i recents es filtren ALS TEMES DE MOSSOS
// (category 'mossos'); els altres temes (Policia Local) viuen a la
// seva pàgina /policia-local i no es barregen aquí.
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, getMossosByAmbit } from '../../data/tests';
import { levelFromBest, useGlobalStats, type Level } from '../../lib/testStats';
import { useFailuresCounts } from '../../lib/failures';
import { useT } from '../../lib/i18n';
import { A, Mono } from '../../lib/design';
import { PStat, SecHead, BigMode, TopicCard, RecentRow } from '../test/atoms';
import { AMBIT_META, getTemesByAmbit, type MossosAmbit } from '../../lib/mossosTemari';
import { listEsquemesDetall } from '../../data/esquemes-mossos-detall';

const MOSSOS = '#991B1B'; // granate institucional Mossos
const TEMARI_AMBITS: MossosAmbit[] = ['A', 'B', 'C'];

const LEVEL_LBL: Record<Level, string> = {
  none: 'Sense fer',
  novice: 'Iniciat',
  intermediate: 'Intermedi',
  advanced: 'Avançat',
  expert: 'Expert',
};

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
    <div className="shell pb-10" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/academia">{t('sidebar.academia')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('mossos.title')}</span>
      </nav>

      {/* HERO — mateix estil que TestList però en granate Mossos */}
      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `${MOSSOS}`, color: '#fff', padding: 'clamp(24px,3.2vw,34px)', boxShadow: A.shadow }}>
        <div style={{ position: 'absolute', top: -60, right: -50, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative' }}>
          <Mono size={11} color="rgba(255,255,255,0.85)">Acadèmia · Mossos d'Esquadra</Mono>
          <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', letterSpacing: -1.5, lineHeight: 1.05 }}>
            Zona de test
          </h1>
          <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 15, lineHeight: 1.5, opacity: 0.92, maxWidth: 560 }}>
            {t('mossos.hero.lead')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {[
              [totalQuestions.toLocaleString('ca-ES'), t('test.list.hero.questions')],
              [String(totalTopics), t('mossos.hero.subtemes')],
              [String(ambits.length), t('mossos.hero.ambits')],
              ['2026', t('test.list.hero.updated')],
            ].map(([n, l]) => (
              <span key={l} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: '6px 13px', fontFamily: A.mono, fontWeight: 600, fontSize: 11.5 }}>
                <b style={{ color: '#fff' }}>{n}</b> <span style={{ opacity: 0.82 }}>{l}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* JUMP BUTTONS — Tests, Flashcards, Temari i Esquemes */}
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
        <Link to="/mossos/temari" className="pl-jump-btn jump-temari">
          <span className="pl-jump-icon" aria-hidden>📚</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTemari')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.temari')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
        <Link to="/mossos/esquemes" className="pl-jump-btn jump-esquemes">
          <span className="pl-jump-icon" aria-hidden>✨</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">Format nou</span>
            <span className="pl-jump-title">Esquemes</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
      </nav>

      {/* STATS PERSONALS — PStat compartit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="a-grid-stats">
        <PStat icon="star" color={A.amber} label={t('test.list.stat.accuracy')} value={`${accuracy}%`} />
        <PStat icon="fire" color={A.terraInk} label={t('test.list.stat.streak')} value={`${streakDays}`} sub={t('test.list.stat.days')} />
        <PStat icon="check" color={A.green} label={t('test.list.stat.completed')} value={`${completedTests}`} />
        <PStat icon="trophy" color={MOSSOS} label={t('test.list.stat.level')} value={avgGrade > 0 ? avgGrade.toFixed(1) : '–'} sub={LEVEL_LBL[bestLevel]} />
      </div>

      {/* MODES RÀPIDS: Tot temari Mossos + Repàs */}
      <div id="mossos-tests" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, scrollMarginTop: 80 }} className="a-grid-fork">
        <BigMode
          to="/mossos/tot"
          fons={`${MOSSOS}`}
          tag={t('test.list.modes.featured.tag')}
          title={t('test.list.modes.featured.title')}
          desc={t('test.list.modes.featured.sub')}
          meta={`${totalQuestions} preguntes · ${totalTopics} subtemes`}
          cta={t('test.start')}
        />
        <BigMode
          to="/mossos/repas"
          fons={`${A.terracota}`}
          tag={t('test.list.modes.repas.tag')}
          title={t('test.list.modes.repas.title')}
          desc={
            failures.due > 0
              ? t('test.list.modes.repas.subDue').replace('{n}', String(failures.due))
              : failures.total > 0
                ? t('test.list.modes.repas.subTotal').replace('{n}', String(failures.total))
                : t('test.list.modes.repas.subEmpty')
          }
          meta={`${failures.due} ${t('test.list.modes.repas.due')} · ${failures.total} ${t('test.list.modes.repas.total')}`}
          cta={t('test.list.modes.repas.cta')}
        />
      </div>

      {/* CARDS DE TEMES — agrupats per àmbit, amb SecHead + TopicCard */}
      {ambits.length === 0 ? (
        <p className="text-sm text-text-2 mt-4">{t('mossos.tests.empty')}</p>
      ) : (
        ambits.map((group) => {
          const meta = AMBIT_LABELS[group.ambit] ?? { title: group.ambit, sub: '' };
          return (
            <section key={group.ambit}>
              <SecHead icon="book" color={MOSSOS} title={meta.title} sub={meta.sub || undefined} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                {group.topics.map((topic) => (
                  <TopicCard
                    key={topic.slug}
                    topic={topic}
                    to={`/mossos/${topic.slug}`}
                    accent={MOSSOS}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* RECENTS — només tests de Mossos */}
      {recents.length > 0 && (
        <section>
          <SecHead icon="clock" color={A.ink} title={t('test.list.recent.eyebrow')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recents.map((r) => (
              <RecentRow
                key={r.slug}
                slug={r.slug}
                best={r.best}
                last={r.last}
                attempts={r.attempts}
                lastAt={r.lastAt}
                basePath="/mossos"
              />
            ))}
          </div>
        </section>
      )}

      {/* TEMARI COMPLET — 3 àmbits oficials Mossos */}
      <section
        id="mossos-temari"
        className="pl-leyes"
        style={{ scrollMarginTop: 80 }}
      >
        <div
          className="section-head"
          style={{ ['--accent' as never]: '#9A5B00', marginTop: 32 } as React.CSSProperties}
        >
          <span className="eyebrow">📚 {t('mossos.temari.eyebrow')}</span>
          <span className="rule" />
        </div>
        <p className="text-sm text-text-2 mt-2 mb-4">
          {t('mossosTemari.subtitle')}
        </p>
        <div className="pl-leyes-grid">
          {TEMARI_AMBITS.map((a) => {
            const meta = AMBIT_META[a];
            const count = getTemesByAmbit(a).length;
            return (
              <Link
                key={a}
                to={`/mossos/temari/${a.toLowerCase()}`}
                className="pl-ley-card"
              >
                <span
                  className="pl-ley-icon"
                  aria-hidden
                  style={{ background: meta.bg, color: meta.color }}
                >
                  {meta.icon}
                </span>
                <span className="pl-ley-text">
                  <span className="pl-ley-title">{meta.short}</span>
                  <span className="pl-ley-desc">
                    {meta.desc} · {count} {count === 1 ? 'tema' : 'temes'}
                  </span>
                </span>
                <span className="pl-ley-arr" aria-hidden>→</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 text-right">
          <Link
            to="/mossos/temari"
            className="text-sm font-bold underline"
            style={{ color: '#9A5B00' }}
          >
            {t('mossosTemari.openAll')} →
          </Link>
        </div>
      </section>

      {/* ESQUEMES RÀPIDS — categoria pròpia, paral·lela a Temari */}
      <section
        id="mossos-esquemes"
        className="pl-leyes"
        style={{ scrollMarginTop: 80 }}
      >
        <div
          className="section-head"
          style={{ ['--accent' as never]: '#C4530A', marginTop: 32 } as React.CSSProperties}
        >
          <span className="eyebrow">📝 Esquemes detallats</span>
          <span className="rule" />
        </div>
        <p className="text-sm text-text-2 mt-2 mb-4">
          Resum estructurat de cada tema amb totes les dades clau (lleis, dates i
          xifres) per repassar de pressa abans del test.
        </p>
        <div className="pl-leyes-grid">
          {listEsquemesDetall().map((e) => {
            const meta = AMBIT_META[e.ambit];
            return (
              <Link
                key={e.slug}
                to={`/mossos/esquemes/${e.slug}`}
                className="pl-ley-card"
              >
                <span
                  className="pl-ley-icon"
                  aria-hidden
                  style={{ background: '#FFE0CB', color: '#7A2E04' }}
                >
                  📝
                </span>
                <span className="pl-ley-text">
                  <span className="pl-ley-title">Tema {e.codi} · {e.title}</span>
                  <span className="pl-ley-desc">
                    {meta.short}{e.subtitle ? ` · ${e.subtitle.length > 80 ? e.subtitle.slice(0, 77) + '…' : e.subtitle}` : ''}
                  </span>
                </span>
                <span className="pl-ley-arr" aria-hidden>→</span>
              </Link>
            );
          })}
          {listEsquemesDetall().length === 0 && (
            <p className="text-sm text-text-3" style={{ padding: 16 }}>
              Encara no hi ha esquemes disponibles.
            </p>
          )}
        </div>
        <div className="mt-3 text-right">
          <Link
            to="/mossos/esquemes"
            className="text-sm font-bold underline"
            style={{ color: '#C4530A' }}
          >
            Veure tots els esquemes →
          </Link>
        </div>
      </section>
    </div>
  );
}

