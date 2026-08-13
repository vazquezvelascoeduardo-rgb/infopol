import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, CatIcon, ProgressBar, Streak, GemBadge } from '../../components/Shared';
import { useContent } from '../../content/ContentProvider';

function Mission({ cat, icon, title, sub, status, pct, xp, onClick }) {
  const k = T.cat[cat];
  const isLocked = status === 'locked';
  const isDone = status === 'done';
  return (
    <div onClick={!isLocked ? onClick : undefined} style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, borderTop: `3px solid ${k.solid}`, opacity: isLocked ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 12, cursor: isLocked ? 'default' : 'pointer' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: isDone ? T.cat.atajos.solid : k.solid, display: 'grid', placeItems: 'center', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)', flexShrink: 0 }}>
        <Icon name={isDone ? 'check' : isLocked ? 'lock' : icon} size={22} color="#fff" strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2 }}>{sub}</div>
        {pct !== undefined && !isDone && (
          <div style={{ marginTop: 8 }}><ProgressBar value={pct} color={k.solid} height={6} /></div>
        )}
      </div>
      {isDone
        ? <div style={{ fontSize: 11, fontWeight: 800, color: T.cat.atajos.ink, background: T.cat.atajos.soft, padding: '4px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>+{xp} XP</div>
        : <Icon name="chevron-right" size={18} color={T.inkMuted} />
      }
    </div>
  );
}

function ToolTile({ cat, icon, title, desc, pct, onClick }) {
  const k = T.cat[cat];
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${k.solid}`, boxShadow: T.shadow.card, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
      <CatIcon cat={cat} icon={icon} size={36} rounded={10} />
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14.5, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>{desc}</div>
        {pct !== undefined && <div style={{ marginTop: 8 }}><ProgressBar value={pct} color={k.solid} height={5} /></div>}
      </div>
    </div>
  );
}

const LEADERBOARD = [
  { p: 1, n: 'Núria S.', xp: 2840 },
  { p: 2, n: 'Jordi A.', xp: 2310 },
  { p: 3, n: 'Mar G.', xp: 2020 },
  { p: 4, n: 'Tu', xp: 1810, you: true },
];

export default function ScreenAcademiaHome() {
  const navigate = useNavigate();
  const { temes = [], testQuestions = [], flashcards = [], psicoCategories = [], psicoQuestions = {} } = useContent();

  const temariPct = (() => {
    const total = temes.reduce((s, t) => s + t.lessons, 0);
    const done = temes.reduce((s, t) => s + t.done, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  })();
  const psicoCount = psicoCategories.reduce((s, c) => s + (psicoQuestions[c.id]?.length || 0), 0);

  return (
    <div className="screen" style={{ background: T.bg }}>
      <StatusBar />

      {/* top bar */}
      <div style={{ padding: '10px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InfoPolWordmark height={16} />
          <div style={{ height: 18, width: 1, background: T.hairlineStrong }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.academia.solid }}>Acadèmia</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Streak n={23} />
          <GemBadge n={420} />
        </div>
      </div>

      {/* hero plan */}
      <div style={{ padding: '6px 16px 4px' }}>
        <div style={{ background: T.cat.academia.solid, color: '#fff', borderRadius: T.r.xl, padding: 18, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: 200, background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.9 }}>El teu pla d'avui</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24, letterSpacing: -0.5, marginTop: 4, lineHeight: 1.1 }}>45 min · 3 missions</div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProgressBar value={33} color="#fff" bg="rgba(255,255,255,0.22)" height={10} />
            <span style={{ fontSize: 12, fontWeight: 800, flexShrink: 0 }}>1/3</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => navigate('/academia/test')} style={{ background: '#fff', color: T.cat.academia.solid, border: 'none', padding: '11px 18px', borderRadius: 14, fontFamily: T.font, fontWeight: 800, fontSize: 13, letterSpacing: 0.4, textTransform: 'uppercase', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <Icon name="play" size={14} color={T.cat.academia.solid} /> Continuar
            </button>
            <span style={{ alignSelf: 'center', fontSize: 12, opacity: 0.85 }}>Pròxim: Tema 8 · Drets fonamentals</span>
          </div>
        </div>
      </div>

      {/* missions */}
      <div style={{ padding: '14px 0 0' }}>
        <SectionHead kicker="Missions d'avui" kickerColor={T.cat.academia.solid} title="Avança el pla" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Mission cat="tests" icon="check" title="Test ràpid · Tema 7" sub="10 preguntes · 8 min" status="done" xp={24} onClick={() => navigate('/academia/test')} />
          <Mission cat="academia" icon="cards" title="Flashcards d'avui" sub="24 cartes · 12 min" status="active" pct={40} onClick={() => navigate('/academia/flashcards')} />
          <Mission cat="psico" icon="spark" title="Repàs Constitució" sub="Lectura · 15 min" status="locked" />
        </div>
      </div>

      {/* tools grid */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionHead kicker="Eines" kickerColor={T.inkMuted} title="Estudia com vulguis" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ToolTile cat="leyes" icon="book" title="Temari" desc={`${temes.length} blocs · ${temariPct}% completat`} pct={temariPct} onClick={() => navigate('/academia/temari')} />
          <ToolTile cat="tests" icon="check" title="Tests Mossos" desc={`${testQuestions.length} preguntes disponibles`} onClick={() => navigate('/academia/test')} />
          <ToolTile cat="academia" icon="cards" title="Flashcards" desc={`Repàs espaiat · ${flashcards.length} cartes`} onClick={() => navigate('/academia/flashcards')} />
          <ToolTile cat="alcohol" icon="clock" title="Simulacre" desc="100 preg · 90 min" onClick={() => navigate('/academia/test')} />
          <ToolTile cat="physical" icon="gauge" title="Físiques" desc="Calculadora de marques" onClick={() => navigate('/academia/fisiques')} />
          <ToolTile cat="psico" icon="spark" title="Psicotècnics" desc={`${psicoCategories.length} categories · ${psicoCount} preguntes`} onClick={() => navigate('/academia/psicotecnics')} />
        </div>
      </div>

      {/* leaderboard */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${T.cat.psico.solid}`, boxShadow: T.shadow.card }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.psico.ink }}>Lliga setmanal</div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>Lliga Or · 4t lloc</div>
            </div>
            <Icon name="trophy" size={24} color={T.cat.psico.solid} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {LEADERBOARD.map(r => (
              <div key={r.p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: r.you ? T.cat.academia.soft : 'transparent' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: r.p === 1 ? T.cat.psico.solid : r.p === 2 ? '#B8B8C0' : r.p === 3 ? '#C28455' : T.bg, color: r.p <= 3 ? '#fff' : T.inkSoft, display: 'grid', placeItems: 'center', fontFamily: T.fontMono, fontWeight: 800, fontSize: 11 }}>{r.p}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: r.you ? 800 : 600, color: T.ink }}>{r.n}</div>
                <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: T.inkSoft }}>{r.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
