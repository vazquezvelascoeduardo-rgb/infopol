// Marc persistent d'Operativa (Claude Design).
// Proporciona el shell complet (sidebar + topbar + bottomnav + drawer +
// footer) i renderitza la pàgina activa amb <Outlet/>. Així, en entrar a
// qualsevol categoria (Catàleg SCT, Lleis, protocols, calculadora…) no
// se surt mai del disseny nou: només canvia el contingut central.
import { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { A, Ic, Mono } from '../lib/design';

// Fallback que es mostra NOMÉS a l'àrea de contingut mentre carrega una
// subpàgina lazy, perquè el marc (sidebar/topbar) no desaparegui mai.
function ContentFallback() {
  return <div style={{ display: 'grid', placeItems: 'center', padding: '80px 0' }}>
    <div style={{ width: 26, height: 26, border: `2px solid ${A.line2}`, borderTopColor: A.ink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

const OP = A.blue;

const NAV = [
  { id: 'inici', label: 'Inici', icon: 'home', to: '/operativa' },
  { id: 'cercador', label: 'Cercador', icon: 'search', kicker: 'Infraccions', to: '/superbuscador' },
  { id: 'cataleg', label: 'Catàleg SCT', icon: 'car', kicker: 'Trànsit 2026', to: '/operativa?sec=cataleg' },
  { id: 'lleis', label: 'Lleis', icon: 'scale', kicker: 'Biblioteca', to: '/leyes' },
  { id: 'procediments', label: 'Procediments', icon: 'list', kicker: 'SC i Trànsit', to: '/operativa?sec=procediments' },
  { id: 'recursos', label: 'Recursos', icon: 'star', kicker: 'Eines i telèfons', to: '/recursos' },
] as const;
const MOBILE = ['inici', 'cercador', 'cataleg', 'procediments', 'recursos'];

// Determina quin element del menú s'ha de marcar com a actiu segons la
// ruta i el paràmetre ?sec= de /operativa.
function activeId(pathname: string, sec: string | null): string {
  if (pathname === '/operativa') return sec && NAV.some((n) => n.id === sec) ? sec : 'inici';
  if (pathname.startsWith('/superbuscador')) return 'cercador';
  if (pathname.startsWith('/leyes')) return 'lleis';
  if (pathname.startsWith('/operativa/penal')) return 'procediments';
  if (pathname.startsWith('/operativa/trafico')) return 'procediments';
  if (pathname.startsWith('/recursos')) return 'recursos';
  if (pathname.startsWith('/calculadora-alcohol')) return 'recursos';
  return 'inici';
}

function Logo({ onClick, size = 26 }: { onClick?: () => void; size?: number }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: 'transparent', cursor: onClick ? 'pointer' : 'default', padding: 0 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"><path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill={A.ink} /><circle cx="32" cy="22" r="4.2" fill={A.terracota} /><rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={A.terracota} /></svg>
    <span style={{ fontFamily: A.sans, fontWeight: 800, fontSize: size * 0.72, letterSpacing: -0.6, color: A.ink }}>info<span style={{ color: A.terracota }}>pol</span></span>
  </button>;
}

function NavItem({ n, on, onClick }: { n: typeof NAV[number]; on: boolean; onClick: () => void }) {
  return <button onClick={onClick} className="a-navitem" style={{ border: on ? `1px solid ${A.line}` : '1px solid transparent', cursor: 'pointer', textAlign: 'left', background: on ? A.card : 'transparent', boxShadow: on ? A.shadow : 'none', borderRadius: 13, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: on ? OP : A.bgDeep, display: 'grid', placeItems: 'center', boxShadow: on ? A.inset : 'none' }}><Ic name={n.icon} size={17} color={on ? '#fff' : A.inkSoft} sw={2.2} /></span>
    <span style={{ flex: 1 }}>
      <span style={{ display: 'block', fontFamily: A.display, fontWeight: on ? 700 : 600, fontSize: 14.5, color: on ? A.ink : A.inkSoft }}>{n.label}</span>
      {'kicker' in n && n.kicker && <Mono size={9} color={on ? OP : A.inkFaint} style={{ letterSpacing: 0.6 }}>{n.kicker}</Mono>}
    </span>
  </button>;
}

export default function OperativaShellLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [topQ, setTopQ] = useState('');
  const active = activeId(location.pathname, params.get('sec'));

  const goto = (to: string) => { nav(to); setDrawer(false); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: A.bg }}>
      <aside className="a-sidebar" style={{ width: 256, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, background: A.bgSoft, borderRight: `1px solid ${A.line}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        <div style={{ padding: '2px 6px 0' }}><Logo onClick={() => nav('/')} /></div>
        <div style={{ background: A.blueSoft, borderRadius: 14, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: OP, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="siren" size={18} color="#fff" sw={2.2} /></span>
          <div><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.blueInk }}>Operativa</div><Mono size={9} color={A.blue}>Consulta al carrer</Mono></div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((n) => <NavItem key={n.id} n={n} on={active === n.id} onClick={() => goto(n.to)} />)}
        </nav>
        <button onClick={() => nav('/academia')} className="a-navitem" style={{ marginTop: 'auto', border: 'none', cursor: 'pointer', background: A.terraSoft, borderRadius: 14, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}><Ic name="book" size={18} color="#fff" sw={2.2} /></span>
          <div style={{ flex: 1 }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.terraInk }}>Anar a l'Acadèmia</div><Mono size={9} color={A.terracota}>Prepara l'oposició</Mono></div>
          <Ic name="arrow" size={16} color={A.terracota} />
        </button>
      </aside>

      <div id="a-scroll" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflowY: 'auto' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(244,241,234,0.82)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderBottom: `1px solid ${A.line}`, padding: '12px clamp(16px,3vw,34px)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setDrawer(true)} className="a-only-mobile" style={{ border: 'none', background: A.card, width: 42, height: 42, borderRadius: 12, boxShadow: A.shadow, cursor: 'pointer', placeItems: 'center', flexShrink: 0 }}><Ic name="menu" size={20} color={A.inkSoft} /></button>
          <form onSubmit={(e) => { e.preventDefault(); const v = topQ.trim(); nav(v ? `/superbuscador?q=${encodeURIComponent(v)}` : '/superbuscador'); }} style={{ flex: 1, maxWidth: 620, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={17} color={A.inkMuted} /></span>
            <input value={topQ} onChange={(e) => setTopQ(e.target.value)} placeholder="Cerca infracció, article, multa, punts…" style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, borderRadius: 999, padding: '11px 16px 11px 40px', fontFamily: A.sans, fontSize: 14, color: A.ink, outline: 'none', boxShadow: A.shadow, boxSizing: 'border-box' }} />
          </form>
          <button onClick={() => nav('/perfil')} style={{ width: 42, height: 42, borderRadius: 999, border: 'none', cursor: 'pointer', background: A.ink, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>E</button>
        </header>

        <main className="a-main-pad" style={{ flex: 1, padding: 'clamp(20px,3vw,38px)', maxWidth: 1240, width: '100%', margin: '0 auto' }}><Suspense fallback={<ContentFallback />}><Outlet /></Suspense></main>
        <footer style={{ padding: '24px clamp(20px,3vw,38px)', borderTop: `1px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, color: A.inkMuted }}>© 2026 Infopol · Informació no oficial</span>
        </footer>
      </div>

      {drawer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 160 }}>
          <div onClick={() => setDrawer(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,28,0.4)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, background: A.bgSoft, padding: 18, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: A.shadowLg, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Logo onClick={() => nav('/')} /><button onClick={() => setDrawer(false)} style={{ border: 'none', background: A.card, width: 36, height: 36, borderRadius: 10, boxShadow: A.shadow, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Ic name="x" size={18} color={A.inkSoft} /></button></div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{NAV.map((n) => <NavItem key={n.id} n={n} on={active === n.id} onClick={() => goto(n.to)} />)}</nav>
          </div>
        </div>
      )}

      <nav className="a-bottomnav" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 35, background: 'rgba(251,249,244,0.94)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderTop: `1px solid ${A.line2}`, padding: '8px 6px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around' }}>
        {MOBILE.map((id) => { const n = NAV.find((x) => x.id === id)!; const on = active === id;
          return <button key={id} onClick={() => goto(n.to)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
            <span style={{ width: 40, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: on ? A.blueSoft : 'transparent' }}><Ic name={n.icon} size={21} color={on ? OP : A.inkMuted} sw={2.2} /></span>
            <span style={{ fontFamily: A.sans, fontWeight: on ? 800 : 600, fontSize: 10.5, color: on ? A.ink : A.inkMuted }}>{n.label}</span>
          </button>; })}
      </nav>
    </div>
  );
}
