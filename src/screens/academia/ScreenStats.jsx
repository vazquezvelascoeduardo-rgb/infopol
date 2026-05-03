import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, ProgressBar, Pill, CatIcon } from '../../components/Shared';

const WEEKLY = [62, 48, 71, 55, 80, 45, 68, 72, 35, 58, 90, 64];

const TOPICS = [
  { t: 'T1 · Constitució', pct: 92, hue: 'atajos' },
  { t: 'T8 · Drets fonamentals', pct: 78, hue: 'tests' },
  { t: 'T3 · Organització Mossos', pct: 70, hue: 'operativa' },
  { t: 'T12 · Codi penal', pct: 64, hue: 'psico' },
  { t: 'T5 · Org. policial', pct: 41, hue: 'alcohol' },
  { t: 'T6 · LECrim', pct: 28, hue: 'transito' },
];

function BigStat({ cat, icon, big, label, sub }) {
  const k = T.cat[cat];
  return (
    <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${k.solid}`, boxShadow: T.shadow.card }}>
      <CatIcon cat={cat} icon={icon} size={32} rounded={9} />
      <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, color: T.ink, marginTop: 8 }}>{big}</div>
      <div style={{ fontSize: 11.5, color: T.inkSoft, fontWeight: 700, marginTop: 1 }}>{label}</div>
      <div style={{ fontSize: 10.5, color: T.inkMuted, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

export default function ScreenStats() {
  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.academia.ink, marginBottom: 4 }}>El teu progrés</div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>Estadístiques</h1>
      </div>

      {/* big stats grid */}
      <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BigStat cat="academia" icon="flame" big="23" label="Dies seguits" sub="Rècord: 41 dies" />
        <BigStat cat="atajos" icon="check" big="78%" label="Encerts globals" sub="+4% aquesta setmana" />
        <BigStat cat="tests" icon="hash" big="412" label="Preguntes fetes" sub="Mossos · oficial" />
        <BigStat cat="psico" icon="clock" big="48h" label="Temps d'estudi" sub="Aquest mes" />
      </div>

      {/* weekly activity chart */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 16, boxShadow: T.shadow.card, borderTop: `3px solid ${T.cat.academia.solid}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.academia.ink }}>Activitat</div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>Últimes 12 setmanes</div>
            </div>
            <Pill bg={T.cat.atajos.soft} fg={T.cat.atajos.ink}>↑ +12%</Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
            {WEEKLY.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: `${v}%`, background: i === 10 ? T.cat.academia.solid : T.cat.academia.soft, borderRadius: 4, boxShadow: i === 10 ? 'inset 0 -2px 0 rgba(0,0,0,0.18)' : 'none' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: T.inkMuted, marginTop: 6, fontFamily: T.fontMono }}>
            <span>S6</span><span>S9</span><span>S12</span><span>S15</span><span>S18</span>
          </div>
        </div>
      </div>

      {/* topic performance */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Rendiment per tema</div>
        <div style={{ background: '#fff', borderRadius: T.r.lg, boxShadow: T.shadow.card, overflow: 'hidden' }}>
          {TOPICS.map((r, i) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < TOPICS.length - 1 ? `1px solid ${T.hairline}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{r.t}</div>
                <div style={{ marginTop: 6 }}>
                  <ProgressBar value={r.pct} color={T.cat[r.hue].solid} height={5} />
                </div>
              </div>
              <div style={{ fontFamily: T.fontMono, fontSize: 13, fontWeight: 800, color: T.cat[r.hue].ink }}>{r.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* XP history */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Historial XP</div>
        <div style={{ background: '#fff', borderRadius: T.r.lg, boxShadow: T.shadow.card, overflow: 'hidden' }}>
          {[
            { day: 'Avui', xp: 120, icon: 'check', cat: 'atajos' },
            { day: 'Ahir', xp: 240, icon: 'cards', cat: 'academia' },
            { day: 'Dijous', xp: 80, icon: 'check', cat: 'tests' },
          ].map((r, i, arr) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: T.cat[r.cat].soft, display: 'grid', placeItems: 'center' }}>
                <Icon name={r.icon} size={16} color={T.cat[r.cat].solid} />
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.ink }}>{r.day}</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 800, color: T.cat[r.cat].ink }}>+{r.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
