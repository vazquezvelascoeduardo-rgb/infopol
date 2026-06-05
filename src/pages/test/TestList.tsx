// Pàgina de Tests (Policia Local) · Claude Design.
// "Zona de test" dividida en blocs clars: modes ràpids (Mix general +
// Errors anteriors), Teoria (tots els temes), Cultura general, Actualitat
// i Municipis. El temari (lleis) NO surt aquí — viu a la secció Lleis.
// Es renderitza dins del marc de l'Acadèmia (AcademiaShellLayout).
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, getTopicsByCategory } from '../../data/tests';
import type { TestTopic } from '../../data/tests/types';
import {
  globalAverage, getTopicStats, levelFromBest, useGlobalStats, type Level,
} from '../../lib/testStats';
import { useFailuresCounts } from '../../lib/failures';
import { A, Ic, Mono, Card, Chip } from '../../lib/design';

const PL = '#2563EB';
const LEVEL_LABEL: Record<Level, string> = {
  none: 'Sense començar', novice: 'Principiant', intermediate: 'Intermedi',
  advanced: 'Avançat', expert: 'Expert',
};

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
            {teoria.map((t) => <TopicCard key={t.slug} topic={t} to={`/policia-local/${t.slug}`} />)}
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
            {municipi.map((t) => <TopicCard key={t.slug} topic={t} to={`/policia-local/${t.slug}`} />)}
          </div>
        </section>
      )}

      {/* RECENTS */}
      {recents.length > 0 && (
        <section>
          <SecHead icon="clock" color={A.ink} title="Últims tests" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recents.map((r) => <RecentRow key={r.slug} slug={r.slug} best={r.best} last={r.last} attempts={r.attempts} lastAt={r.lastAt} />)}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Àtoms ── */
function PStat({ icon, color, label, value, sub }: { icon: string; color: string; label: string; value: string; sub?: string }) {
  return <Card pad={16} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Ic name={icon} size={15} color={color} fill sw={2.2} /><Mono size={10}>{label}</Mono></div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontFamily: A.display, fontWeight: 700, fontSize: 26, color: A.ink, lineHeight: 1 }}>{value}</span>
      {sub && <Mono size={9} color={A.inkMuted}>{sub}</Mono>}
    </div>
  </Card>;
}

function SecHead({ icon, color, title, sub }: { icon: string; color: string; title: string; sub?: string }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
    <span style={{ width: 38, height: 38, borderRadius: 11, background: color, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}><Ic name={icon} size={20} color="#fff" sw={2.1} /></span>
    <div>
      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 19, color: A.ink, letterSpacing: -0.4 }}>{title}</div>
      {sub && <Mono size={10} color={A.inkMuted}>{sub}</Mono>}
    </div>
  </div>;
}

function BigMode({ to, grad, tag, title, desc, meta, cta, wide = false, min = 170 }: { to: string; grad: string; tag: string; title: string; desc: string; meta: string; cta: string; wide?: boolean; min?: number }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', gridColumn: wide ? '1 / -1' : undefined }}>
      <div className="a-hover" style={{ position: 'relative', overflow: 'hidden', borderRadius: A.rxl, backgroundImage: grad, color: '#fff', padding: 24, boxShadow: A.shadowMd, minHeight: min, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ position: 'relative', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '5px 12px' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} /><Mono size={10} color="#fff" style={{ letterSpacing: 1 }}>{tag}</Mono></span>
        <h3 style={{ position: 'relative', margin: '14px 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.15 }}>{title}</h3>
        <p style={{ position: 'relative', margin: 0, fontSize: 13.5, lineHeight: 1.45, opacity: 0.92, maxWidth: 460 }}>{desc}</p>
        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Mono size={10} color="#fff" style={{ opacity: 0.85 }}>{meta}</Mono>
          <span className="a-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: A.ink, borderRadius: 12, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>{cta} <Ic name="arrow" size={15} color={A.ink} /></span>
        </div>
      </div>
    </Link>
  );
}

function TopicCard({ topic, to }: { topic: TestTopic; to: string }) {
  const st = getTopicStats(topic.slug);
  const level = levelFromBest(st?.best);
  const pct = st?.best ? Math.min(100, Math.round((st.best / 10) * 100)) : 0;
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card pad={16} hover style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{topic.icon}</span>
          <Mono size={9} color={pct > 0 ? A.green : A.inkFaint}>{LEVEL_LABEL[level]}</Mono>
        </div>
        <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.2, lineHeight: 1.2 }}>{topic.title}</div>
        {topic.description && <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.inkMuted, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{topic.description}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          {topic.badge && <Chip tone="terracota">{topic.badge}</Chip>}
          <Mono size={10}>{topic.questions.length} preguntes</Mono>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: A.bgDeep, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: PL }} /></div>
          <Mono size={10} color={pct > 0 ? PL : A.inkFaint}>{pct}%</Mono>
        </div>
      </Card>
    </Link>
  );
}

function RecentRow({ slug, best, last, attempts, lastAt }: { slug: string; best: number; last: number; attempts: number; lastAt: number }) {
  const topic = TOPICS.find((x) => x.slug === slug);
  if (!topic) return null;
  const grade = last || best;
  const score10 = Math.round(grade * 10) / 10;
  const tone = grade >= 7 ? A.green : grade >= 5 ? A.amber : A.red;
  return (
    <Link to={`/policia-local/${slug}`} style={{ textDecoration: 'none' }}>
      <Card pad={14} hover style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: tone, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0, boxShadow: A.inset }}>{score10}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15, color: A.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic.title}</div>
          <Mono size={10}>{attempts} {attempts === 1 ? 'intent' : 'intents'} · millor {best.toFixed(1)} · {relTime(lastAt)}</Mono>
        </div>
        <Ic name="arrow" size={17} color={A.inkFaint} />
      </Card>
    </Link>
  );
}

function relTime(ts: number): string {
  if (!ts) return '—';
  const d = Math.floor((Date.now() - ts) / 86400000);
  const h = Math.floor((Date.now() - ts) / 3600000);
  if (h < 1) return 'ara mateix';
  if (h < 24) return `fa ${h} h`;
  if (d < 7) return `fa ${d} d`;
  return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
