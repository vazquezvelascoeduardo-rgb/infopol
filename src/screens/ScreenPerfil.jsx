import { useNavigate, useSearchParams } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, TabBar, ProgressBar } from '../components/Shared';

const OP_TABS = [
  { id: 'home', label: 'Inici', icon: 'home', path: '/operativa' },
  { id: 'leyes', label: 'Lleis', icon: 'scale', path: '/operativa/infraccions' },
  { id: 'protocol', label: 'Protocols', icon: 'route', path: '/operativa/protocol' },
  { id: 'mapa', label: 'Mapa', icon: 'map', path: '/operativa/mapa' },
  { id: 'me', label: 'Tu', icon: 'user', path: '/perfil?from=op' },
];

const AC_TABS = [
  { id: 'home', label: 'Pla', icon: 'home', path: '/academia' },
  { id: 'temari', label: 'Temari', icon: 'book', path: '/academia/temari' },
  { id: 'tests', label: 'Tests', icon: 'check', path: '/academia/test' },
  { id: 'stats', label: 'Stats', icon: 'chart', path: '/academia/stats' },
  { id: 'me', label: 'Tu', icon: 'user', path: '/perfil?from=ac' },
];

const BADGES = [
  { c: 'leyes', i: 'scale', t: 'Lleis', locked: false },
  { c: 'transito', i: 'car', t: 'Trànsit', locked: false },
  { c: 'academia', i: 'flame', t: '7 dies', locked: false },
  { c: 'tests', i: 'check', t: '100 OK', locked: false },
  { c: 'physical', i: 'bolt', t: 'Físic', locked: true },
  { c: 'psico', i: 'spark', t: 'Psico', locked: true },
  { c: 'alcohol', i: 'beaker', t: 'Tox', locked: true },
  { c: 'atajos', i: 'medal', t: 'Or', locked: true },
];

const SETTINGS = [
  { i: 'bolt', t: 'Mode operativa per defecte', d: 'Activat' },
  { i: 'bell', t: 'Notificacions', d: 'Diari · 19:00' },
  { i: 'graduation', t: 'Oposició objectiu', d: 'Mossos d\'Esquadra 2027' },
  { i: 'lock', t: 'Privacitat i seguretat' },
];

export default function ScreenPerfil() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get('from') || 'op';
  const tabs = from === 'ac' ? AC_TABS : OP_TABS;

  return (
    <>
      <div className="screen">
        <StatusBar />

        {/* hero */}
        <div style={{ background: T.cat.operativa.solid, color: '#fff', padding: '50px 18px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: 200, background: 'rgba(255,255,255,0.10)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: T.cat.academia.solid, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24, border: '3px solid #fff' }}>JR</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18 }}>Jordi Roca</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Agent · TIP 18742 · Regió Policial Metropolitana Nord</div>
            </div>
            <button style={{ border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '7px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Editar</button>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[{ l: 'Nivell', v: '12' }, { l: 'XP total', v: '14.820' }, { l: 'Ratxa', v: '23 dies' }].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* mode switch */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, display: 'flex', gap: 8 }}>
            {[{ label: 'Operativa', path: '/operativa', cat: 'operativa' }, { label: 'Acadèmia', path: '/academia', cat: 'academia' }].map(m => (
              <button key={m.label} onClick={() => navigate(m.path)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 800, fontSize: 13, background: T.cat[m.cat].solid, color: '#fff', boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.18)` }}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* progress overview */}
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, boxShadow: T.shadow.card, borderTop: `3px solid ${T.cat.academia.solid}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.academia.ink, marginBottom: 8 }}>Progrés acadèmia</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Temari Mossos</span>
              <span style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: T.cat.academia.ink }}>64%</span>
            </div>
            <ProgressBar value={64} color={T.cat.academia.solid} />
          </div>
        </div>

        {/* badges */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Insígnies (4/8)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: 10, boxShadow: T.shadow.card, textAlign: 'center', opacity: b.locked ? 0.45 : 1 }}>
                <div style={{ width: 44, height: 44, margin: '0 auto', borderRadius: 999, background: b.locked ? '#E7E5DF' : T.cat[b.c].solid, display: 'grid', placeItems: 'center', boxShadow: b.locked ? 'none' : 'inset 0 -3px 0 rgba(0,0,0,0.18)' }}>
                  <Icon name={b.locked ? 'lock' : b.i} size={22} color={b.locked ? T.inkMuted : '#fff'} strokeWidth={2.4} />
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 6, color: T.inkSoft }}>{b.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* settings */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Configuració</div>
          <div style={{ background: '#fff', borderRadius: T.r.lg, boxShadow: T.shadow.card, overflow: 'hidden' }}>
            {SETTINGS.map((r, i) => (
              <div key={i} style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < SETTINGS.length - 1 ? `1px solid ${T.hairline}` : 'none', cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: T.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={r.i} size={16} color={T.inkSoft} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.t}</div>
                  {r.d && <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 1 }}>{r.d}</div>}
                </div>
                <Icon name="chevron-right" size={16} color={T.inkMuted} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '14px', background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: T.r.lg, fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.cat.alcohol.solid, cursor: 'pointer', boxShadow: T.shadow.card }}>
            Tancar sessió
          </button>
        </div>
      </div>
      <TabBar tabs={tabs} active="me" mode={from === 'ac' ? 'academia' : 'operativa'} />
    </>
  );
}
