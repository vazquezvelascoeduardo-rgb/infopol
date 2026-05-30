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
import { MODULES } from '../../lib/content';

type CatId = 'temari' | 'cultura' | 'municipi' | 'actualitat';

// Metadades de cada categoria per al selector visual (cat-picker).
const CATEGORIES: { id: CatId; icon: string; title: string; desc: string; c: string; bg: string }[] = [
  { id: 'temari',     icon: '📚', title: 'Lleis i normativa', desc: 'Constitució, EAC, codi penal, trànsit, seguretat ciutadana…', c: '#2F6BD8', bg: '#EAF1FE' },
  { id: 'cultura',    icon: '🧠', title: 'Cultura general',   desc: 'Història, geografia, art, ciència, literatura, música…',     c: '#9747D6', bg: '#F5E9FF' },
  { id: 'actualitat', icon: '📰', title: 'Actualitat',        desc: 'Política, societat i fets rellevants de 2026.',              c: '#D9531A', bg: '#FFE4D2' },
  { id: 'municipi',   icon: '🏛️', title: 'Municipis',          desc: 'Temaris específics per ajuntament.',                         c: '#0F766E', bg: '#D7F0EC' },
];

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
  // Categoria seleccionada al selector. `null` = encara no s'ha triat
  // cap → mostrem les targetes de categories (no temes mesclats).
  const [cat, setCat] = useState<CatId | null>(null);
  const stats = useGlobalStats();
  const { attempts, avgGrade } = globalAverage(stats);
  const failures = useFailuresCounts();

  // Pool de Policia Local: temari + cultura + municipi (NO mossos).
  // Mossos d'Esquadra té la seva pròpia pàgina (/mossos) i no s'ha de
  // barrejar amb el temari de Policia Local.
  const PL_TOPICS = useMemo(
    () => TOPICS.filter((tt) => (tt.category ?? 'temari') !== 'mossos'),
    [],
  );

  // Recompte per filtre.
  const counts = useMemo(() => ({
    all: PL_TOPICS.length,
    temari: getTopicsByCategory('temari').length,
    cultura: getTopicsByCategory('cultura').length,
    municipi: getTopicsByCategory('municipi').length,
    actualitat: getTopicsByCategory('actualitat').length,
  }), [PL_TOPICS]);

  // Metadades per categoria: nombre de temes i de preguntes (per les
  // targetes del selector). Calculat un sol cop.
  const catMeta = useMemo(() => {
    const m: Record<CatId, { topics: number; questions: number }> = {
      temari: { topics: 0, questions: 0 },
      cultura: { topics: 0, questions: 0 },
      municipi: { topics: 0, questions: 0 },
      actualitat: { topics: 0, questions: 0 },
    };
    for (const id of ['temari', 'cultura', 'municipi', 'actualitat'] as CatId[]) {
      const ts = getTopicsByCategory(id);
      m[id] = { topics: ts.length, questions: ts.reduce((a, tp) => a + tp.questions.length, 0) };
    }
    return m;
  }, []);

  // Categories que tenen almenys un tema (per no mostrar targetes buides).
  const availableCats = useMemo(
    () => CATEGORIES.filter((c) => catMeta[c.id].topics > 0),
    [catMeta],
  );

  // Topics filtrats per la categoria activa.
  const visibleTopics = useMemo(() => {
    if (!cat) return [];
    return PL_TOPICS.filter((tt) => (tt.category ?? 'temari') === cat);
  }, [cat, PL_TOPICS]);

  // Total de preguntes (per al ts-pill del hero) — només Policia Local.
  const totalQuestions = useMemo(
    () => PL_TOPICS.reduce((acc, tt) => acc + tt.questions.length, 0),
    [PL_TOPICS],
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
            <b>{PL_TOPICS.length}</b> {t('test.list.hero.topics')}
          </span>
          <span className="ts-pill">
            <b>{getMunicipiGroups().length}</b> {t('test.list.hero.municipios')}
          </span>
          <span className="ts-pill"><b>2026</b> · {t('test.list.hero.updated')}</span>
        </div>
      </header>

      {/* JUMP BUTTONS — Tests, Flashcards i Temari complet */}
      <nav className="pl-jump pl-jump-3" aria-label={t('policiaLocal.jump.aria')}>
        <a href="#pl-tests" className="pl-jump-btn jump-tests">
          <span className="pl-jump-icon" aria-hidden>📝</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTests')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.tests')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </a>
        <Link to="/policia-local/flashcards" className="pl-jump-btn jump-flash">
          <span className="pl-jump-icon" aria-hidden>🃏</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('flashcards.eyebrow')}</span>
            <span className="pl-jump-title">{t('flashcards.title')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
        <Link to="/leyes" className="pl-jump-btn jump-temari">
          <span className="pl-jump-icon" aria-hidden>📚</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">{t('policiaLocal.jump.eyebrowTemari')}</span>
            <span className="pl-jump-title">{t('policiaLocal.jump.temari')}</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
        <Link to="/policia-local/esquemes" className="pl-jump-btn jump-esquemes">
          <span className="pl-jump-icon" aria-hidden>✨</span>
          <span className="pl-jump-text">
            <span className="pl-jump-eyebrow">Format nou</span>
            <span className="pl-jump-title">Esquemes</span>
          </span>
          <span className="pl-jump-arr" aria-hidden>→</span>
        </Link>
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

      {/* ZONA TESTS — wrapper visual perquè la secció no es confongui
          amb stats o lleis. Estructura UX: (1) modes ràpids destacats
          al cim (Tot el temari · Repàs); (2) selecció per tema. */}
      <section
        id="pl-tests"
        className="tests-zone"
        style={{ scrollMarginTop: 80 }}
      >
        <header className="tests-zone-head">
          <div className="eyebrow">📝 {t('test.list.zone.eyebrow')}</div>
          <h2>{t('test.list.zone.title')}</h2>
          <p>{t('test.list.zone.subtitle').replace('{n}', String(totalQuestions))}</p>
        </header>

        {/* MODES destacats: Tot el temari (esquerra, gran) + Repàs (dreta) */}
        <div className="tests-zone-modes">
          <Link to="/policia-local/tot" className="ts-mode featured">
            <span className="mtag">⚡ {t('test.list.modes.featured.tag')}</span>
            <div>
              <h3>{t('test.list.modes.featured.title')}</h3>
              <p>{t('test.list.modes.featured.sub')}</p>
            </div>
            <div className="footer">
              <div className="specs">
                <span>{totalQuestions} preguntes</span>
                <span>·</span>
                <span>{counts.all} temes</span>
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
        </div>

        {/* Separador: tria una categoria */}
        <div className="tests-zone-divider">
          <span className="line" />
          <span className="lbl">{cat ? t('test.list.zone.orByTopic') : 'Tria una categoria'}</span>
          <span className="line" />
        </div>

        {!cat ? (
          /* ── NIVELL 1: selector de categories ── */
          <div className="cat-picker">
            {availableCats.map((c) => (
              <button
                key={c.id}
                type="button"
                className="cat-pick-card"
                onClick={() => setCat(c.id)}
                style={{
                  ['--accent' as never]: c.c,
                  ['--accent-bg' as never]: c.bg,
                } as React.CSSProperties}
              >
                <span className="cp-ico" aria-hidden>{c.icon}</span>
                <span className="cp-body">
                  <span className="cp-title">{c.title}</span>
                  <span className="cp-desc">{c.desc}</span>
                  <span className="cp-meta">
                    {catMeta[c.id].topics} {catMeta[c.id].topics === 1 ? 'tema' : 'temes'}
                    {' · '}
                    {catMeta[c.id].questions.toLocaleString('es-ES')} preguntes
                  </span>
                </span>
                <span className="cp-arr" aria-hidden>→</span>
              </button>
            ))}
          </div>
        ) : (
          /* ── NIVELL 2: temes de la categoria triada ── */
          <>
            <div className="cat-active-head">
              <button type="button" className="cat-back" onClick={() => setCat(null)}>
                ← Categories
              </button>
              <div className="cat-active-chips" role="tablist">
                {availableCats.map((c) => (
                  <FilterChip
                    key={c.id}
                    active={cat === c.id}
                    onClick={() => setCat(c.id)}
                    label={c.title}
                    n={catMeta[c.id].topics}
                  />
                ))}
              </div>
            </div>

            <div className="test-grid">
              {visibleTopics.map((topic) => (
                <TestCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* RECENTS — buit per a usuaris nous */}
      {recents.length === 0 && (
        <section className="ts-recent">
          <div
            className="section-head"
            style={{ ['--accent' as never]: 'var(--ink)' } as React.CSSProperties}
          >
            <span className="eyebrow">🕘 {t('test.list.recent.eyebrow')}</span>
            <span className="rule" />
          </div>
          <div className="ts-empty">
            <span className="ts-empty-ico" aria-hidden>🎯</span>
            <p>
              Encara no has fet cap test. Tria una categoria a dalt i comença —
              el teu progrés es desa automàticament.
            </p>
          </div>
        </section>
      )}

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

      {/* TEMARI COMPLET — totes les lleis del temari de Policia Local. */}
      <section id="pl-temari" className="pl-leyes" style={{ scrollMarginTop: 80 }}>
        <div
          className="section-head"
          style={{ ['--accent' as never]: '#9c7a1f', marginTop: 32 } as React.CSSProperties}
        >
          <span className="eyebrow">📚 {t('policiaLocal.leyes.eyebrow')}</span>
          <span className="rule" />
        </div>
        <p className="text-sm text-text-2 mt-2 mb-4">
          {t('policiaLocal.leyes.subtitle')}
        </p>
        <div className="pl-leyes-grid">
          {MODULES.map((m) => (
            <Link
              key={m.slug}
              to={`/leyes/s/${m.slug}`}
              className="pl-ley-card"
            >
              <span className="pl-ley-icon" aria-hidden>{m.icon}</span>
              <span className="pl-ley-text">
                <span className="pl-ley-title">{m.title}</span>
                <span className="pl-ley-desc">{m.description}</span>
              </span>
              <span className="pl-ley-arr" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>
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

  // Destí especial per a Cultura general i Actualitat: enllaçar al pool
  // sencer (/cultura-general/tot, /actualitat/tot) en lloc del topic
  // individual, per fer-ho equivalent al comportament de la home dels
  // dos blocs (totes les preguntes mesclades, no només les del mix).
  const isCulturaMix = topic.slug === 'cultura-general';
  const isActualitat = topic.category === 'actualitat';
  const linkTo = isCulturaMix
    ? '/cultura-general/tot'
    : isActualitat
      ? '/actualitat/tot'
      : `/policia-local/${topic.slug}`;
  // Total real: per cultura-general (mix general), comptem totes les
  // preguntes de la categoria cultura, no només les del topic principal.
  // Per actualitat, comptem totes les preguntes de la categoria actualitat.
  const total = useMemo(() => {
    if (isCulturaMix) {
      return TOPICS.filter((tp) => tp.category === 'cultura')
        .reduce((acc, tp) => acc + tp.questions.length, 0);
    }
    if (isActualitat) {
      return TOPICS.filter((tp) => tp.category === 'actualitat')
        .reduce((acc, tp) => acc + tp.questions.length, 0);
    }
    return topic.questions.length;
  }, [isCulturaMix, isActualitat, topic]);

  // Progrés segons la millor nota (0-10) — 100% si nota ≥ 9.
  const pct = stats?.best
    ? Math.min(100, Math.round((stats.best / 10) * 100))
    : 0;

  return (
    <Link
      to={linkTo}
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
    <Link to={`/policia-local/${slug}`} className="rec-row">
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
