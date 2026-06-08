// Pàgina de Tests (Policia Local) · Claude Design.
// "Zona de test" dividida en blocs clars: modes ràpids (Mix general +
// Errors anteriors), Teoria (tots els temes), Cultura general, Actualitat
// i Municipis. El temari (lleis) NO surt aquí — viu a la secció Lleis.
// Es renderitza dins del marc de l'Acadèmia (AcademiaShellLayout).
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, getTopicsByCategory } from '../../data/tests';
import {
  globalAverage, levelFromBest, useGlobalStats, type Level,
} from '../../lib/testStats';
import { useFailuresCounts } from '../../lib/failures';
import { A, Ic, Mono, Card } from '../../lib/design';
import { PStat, SecHead, BigMode, TopicCard, RecentRow, LEVEL_LABEL } from './atoms';

const PL = '#2563EB';

export default function TestList() {
  const stats = useGlobalStats();
  const { attempts, avgGrade } = globalAverage(stats);
  const failures = useFailuresCounts();

  const teoria = useMemo(() => getTopicsByCategory('temari'), []);
  const municipi = useMemo(() => getTopicsByCategory('municipi'), []);
  const cultura = useMemo(() => getTopicsByCategory('cultura'), []);
  const actualitat = useMemo(() => getTopicsByCategory('actualitat'), []);

  const allPL = useMemo(() => TOPICS.filter((t) => (t.category ?? 'temari') !== 'mossos'), []);
  const totalQuestions = useMemo(() => allPL.reduce((a, t) => a + t.questions.length, 0), [allPL]);
  const teoriaQ = teoria.reduce((a, t) => a + t.questions.length, 0);
  const culturaQ = cultura.reduce((a, t) => a + t.questions.length, 0);
  const actualitatQ = actualitat.reduce((a, t) => a + t.questions.length, 0);

  // Estadístiques personals (localStorage).
  const accuracy = (() => {
    let c = 0, q = 0;
    for (const k in stats.topics) { c += stats.topics[k].totalCorrect; q += stats.topics[k].totalQuestions; }
    return q > 0 ? Math.round((c / q) * 100) : 0;
  })();
  const streak = (() => {
    const ts = Object.values(stats.topics).map((s) => s.lastAt).filter(Boolean);
    if (ts.length === 0) return 0;
    const days = Math.round((Math.max(...ts) - Math.min(...ts)) / 86400000) + 1;
    return Math.min(99, Math.max(1, days));
  })();
  const bestLevel = (() => {
    let best: Level = 'none';
    const order: Level[] = ['none', 'novice', 'intermediate', 'advanced', 'expert'];
    for (const k in stats.topics) {
      const lvl = levelFromBest(stats.topics[k].best);
      if (order.indexOf(lvl) > order.indexOf(best)) best = lvl;
    }
    return best;
  })();

  const recents = useMemo(() => Object.entries(stats.topics)
    .map(([slug, s]) => ({ slug, ...s }))
    .filter((x) => x.lastAt > 0)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, 4), [stats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* HERO */}
      <header style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: `linear-gradient(150deg, ${PL}, #14266B)`, color: '#fff', padding: 'clamp(24px,3.2vw,34px)', boxShadow: A.shadowMd }}>
        <div style={{ position: 'absolute', top: -60, right: -50, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative' }}>
          <Mono size={11} color="rgba(255,255,255,0.85)">Acadèmia · Policia Local</Mono>
          <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(28px,4vw,42px)', letterSpacing: -1.5, lineHeight: 1.05 }}>Zona de test</h1>
          <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 15, lineHeight: 1.5, opacity: 0.92, maxWidth: 560 }}>Practica per blocs: teoria, cultura general, actualitat o repassa els teus errors. El progrés es desa automàticament.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {[[totalQuestions.toLocaleString('es-ES'), 'preguntes'], [String(allPL.length), 'temes'], ['2026', 'actualitzat']].map(([n, l]) => (
              <span key={l} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: '6px 13px', fontFamily: A.mono, fontWeight: 600, fontSize: 11.5 }}><b style={{ color: '#fff' }}>{n}</b> <span style={{ opacity: 0.82 }}>{l}</span></span>
            ))}
          </div>
        </div>
      </header>

      {/* STATS PERSONALS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="a-grid-stats">
        <PStat icon="star" color={A.amber} label="Encerts" value={`${accuracy}%`} />
        <PStat icon="fire" color={A.terracota} label="Ratxa" value={`${streak}`} sub="dies" />
        <PStat icon="check" color={A.green} label="Tests fets" value={`${attempts}`} />
        <PStat icon="trophy" color={A.blue} label="Nivell" value={avgGrade > 0 ? avgGrade.toFixed(1) : '–'} sub={LEVEL_LABEL[bestLevel]} />
      </div>

      {/* MODES RÀPIDS: Mix general + Errors anteriors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="a-grid-fork">
        <BigMode to="/policia-local/tot" grad={`linear-gradient(150deg, ${A.blue}, #1E3A8A)`}
          tag="Mix general" title="Tot el temari" desc="Totes les preguntes de teoria barrejades en un sol test." meta={`${teoriaQ} preguntes · ${teoria.length} temes`} cta="Començar" />
        <BigMode to="/policia-local/repas" grad={`linear-gradient(150deg, ${A.terracota}, #C2410C)`}
          tag="Errors anteriors" title="Repàs intel·ligent" desc={failures.total > 0 ? 'Repassa les preguntes que has fallat fins dominar-les.' : 'Quan falles preguntes, apareixen aquí per repassar-les.'}
          meta={`${failures.due} per repassar · ${failures.total} acumulades`} cta="Repassar" />
      </div>

      {/* TEORIA */}
      {teoria.length > 0 && (
        <section>
          <SecHead icon="book" color={PL} title="Teoria" sub={`Lleis i normativa · ${teoria.length} temes`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {teoria.map((t) => <TopicCard key={t.slug} topic={t} to={`/policia-local/${t.slug}`} accent={PL} />)}
          </div>
        </section>
      )}

      {/* CULTURA GENERAL */}
      {culturaQ > 0 && (
        <section>
          <SecHead icon="star" color={A.purple} title="Cultura general" sub={`${culturaQ} preguntes · mesclat`} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="a-grid-fork">
            <BigMode to="/cultura-general/tot" grad={`linear-gradient(150deg, ${A.purple}, #5B2C9E)`}
              tag="Mix cultura" title="Test de cultura general" desc="Història, geografia, art, ciència, literatura i música barrejades." meta={`${culturaQ} preguntes`} cta="Començar" min={150} />
            <Link to="/cultura-general/temari" style={{ textDecoration: 'none' }}>
              <Card pad={20} hover style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10, borderTop: `3px solid ${A.purple}` }}>
                <span style={{ width: 44, height: 44, borderRadius: 13, background: A.purpleSoft, display: 'grid', placeItems: 'center' }}><Ic name="book" size={22} color={A.purple} sw={2.1} /></span>
                <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink, letterSpacing: -0.3 }}>Temari de cultura general</div>
                <div style={{ fontFamily: A.sans, fontSize: 13.5, color: A.inkMuted, lineHeight: 1.45 }}>16 àrees i +400 fets clau per repassar de pressa abans del test.</div>
                <div style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.purple }}>Estudiar <Ic name="arrow" size={15} color={A.purple} /></div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* ACTUALITAT */}
      {actualitatQ > 0 && (
        <section>
          <SecHead icon="news" color={A.terracota} title="Actualitat" sub={`${actualitatQ} preguntes · 2025–2026`} />
          <BigMode to="/actualitat/tot" grad={`linear-gradient(150deg, ${A.terracota}, #C64A13)`} wide
            tag="Mix actualitat" title="Test d'actualitat" desc="Càrrecs vigents, premis, esports i fets clau de 2025 i 2026." meta={`${actualitatQ} preguntes`} cta="Començar" />
        </section>
      )}

      {/* MUNICIPIS */}
      {municipi.length > 0 && (
        <section>
          <SecHead icon="shield" color={A.teal} title="Municipis" sub={`${municipi.length} temaris d'ajuntament`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
            {municipi.map((t) => <TopicCard key={t.slug} topic={t} to={`/policia-local/${t.slug}`} accent={PL} />)}
          </div>
        </section>
      )}

      {/* RECENTS */}
      {recents.length > 0 && (
        <section>
          <SecHead icon="clock" color={A.ink} title="Últims tests" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recents.map((r) => <RecentRow key={r.slug} slug={r.slug} best={r.best} last={r.last} attempts={r.attempts} lastAt={r.lastAt} basePath="/policia-local" />)}
          </div>
        </section>
      )}
    </div>
  );
}

