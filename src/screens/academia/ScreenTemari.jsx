import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, ProgressBar } from '../../components/Shared';
import { TEMES } from '../../data/academia';

const totalLessons = TEMES.reduce((s, t) => s + t.lessons, 0);
const doneLessons = TEMES.reduce((s, t) => s + t.done, 0);
const globalPct = Math.round((doneLessons / totalLessons) * 100);
const doneBlocs = TEMES.filter(t => t.status === 'done').length;

function Ring({ pct, size = 52 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke={T.hairline} strokeWidth="6" fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={T.cat.academia.solid} strokeWidth="6" fill="none"
        strokeDasharray={`${c * pct/100} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 13, fill: T.ink }}>{pct}%</text>
    </svg>
  );
}

function PathNode({ tema, align }) {
  const k = T.cat[tema.cat] || T.cat.operativa;
  const isDone = tema.status === 'done';
  const isLocked = tema.status === 'locked';
  const isActive = tema.status === 'active';
  const pct = tema.lessons > 0 ? Math.round((tema.done / tema.lessons) * 100) : 0;
  const justify = align === 'left' ? 'flex-start' : 'flex-end';

  return (
    <div style={{ display: 'flex', justifyContent: justify, padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: align === 'left' ? 'row' : 'row-reverse', maxWidth: '90%' }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: isLocked ? '#E7E5DF' : k.solid, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: isLocked ? 'none' : `inset 0 -4px 0 rgba(0,0,0,0.2)${isActive ? `, 0 0 0 5px ${k.soft}` : ''}`, position: 'relative' }}>
          <Icon name={isDone ? 'check' : isLocked ? 'lock' : tema.icon} size={22} color={isLocked ? T.inkMuted : '#fff'} strokeWidth={2.4} />
          {isActive && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 999, background: T.cat.alcohol.solid, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, border: '2px solid #fff' }}>!</div>
          )}
        </div>
        <div style={{ background: '#fff', borderRadius: T.r.md, padding: '10px 14px', boxShadow: T.shadow.card, opacity: isLocked ? 0.55 : 1, textAlign: align === 'left' ? 'left' : 'right', minWidth: 170 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: k.ink }}>Bloc {tema.id}</div>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: T.ink, marginTop: 1, lineHeight: 1.3 }}>{tema.title.replace(/^(Bloc \d+ · )?/, '')}</div>
          <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>
            {isDone ? 'Completat' : isLocked ? 'Bloquejat' : `En curs · ${tema.done}/${tema.lessons} lliçons`}
          </div>
          {isActive && <div style={{ marginTop: 6 }}><ProgressBar value={pct} color={k.solid} height={4} /></div>}
        </div>
      </div>
    </div>
  );
}

function PathConnector({ dim }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, background: dim ? T.hairline : T.cat.academia.soft }} />
    </div>
  );
}

export default function ScreenTemari() {
  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.academia.ink, marginBottom: 4 }}>Acadèmia · Mossos</div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>Temari oficial</h1>
      </div>

      {/* progress summary */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, borderLeft: `3px solid ${T.cat.academia.solid}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.inkMuted }}>Progrés global</div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 2 }}>
                {globalPct}<span style={{ fontSize: 14, color: T.inkMuted }}>%</span>
                <span style={{ fontSize: 12, color: T.inkMuted, fontWeight: 600, marginLeft: 8 }}>{doneBlocs} / {TEMES.length} blocs</span>
              </div>
            </div>
            <Ring pct={globalPct} />
          </div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={globalPct} color={T.cat.academia.solid} />
          </div>
        </div>
      </div>

      {/* learning path */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 10 }}>Camí d'aprenentatge</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TEMES.slice(0, 7).map((tema, i) => (
            <div key={tema.id}>
              <PathNode tema={tema} align={i % 2 === 0 ? 'left' : 'right'} />
              {i < 6 && <PathConnector dim={tema.status === 'locked' || TEMES[i+1].status === 'locked'} />}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: T.inkMuted }}>
          · · · {TEMES.length - 7} blocs més per desbloquejar · · ·
        </div>
      </div>
    </div>
  );
}
