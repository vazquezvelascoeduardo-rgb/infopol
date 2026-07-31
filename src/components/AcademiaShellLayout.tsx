// Marc persistent de l'Acadèmia per a les pàgines profundes (tests,
// temari, flashcards, esquemes, mossos, reptes). Mateix shell visual que
// el dashboard /academia (sidebar + topbar + bottomnav), però amb
// navegació per rutes via <Outlet/>, de manera que en entrar a qualsevol
// categoria no se surt del disseny nou. El curs (Policia Local / Mossos)
// es dedueix de la ruta.
import { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { A, Mono } from '../lib/design';

// Fallback que es mostra NOMÉS a l'àrea de contingut mentre carrega una
// subpàgina lazy, perquè el marc (sidebar/topbar) no desaparegui mai.
function ContentFallback() {
  return <div style={{ display: 'grid', placeItems: 'center', padding: '80px 0' }}>
    <div style={{ width: 26, height: 26, border: `2px solid ${A.line2}`, borderTopColor: A.ink, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

/* Icones (set propi de l'Acadèmia: target/sketch/chart no són a lib/design) */
function Ic({ name, size = 22, color = 'currentColor', sw = 2 }: { name: string; size?: number; color?: string; sw?: number }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home': return <svg {...c}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case 'book': return <svg {...c}><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h8M8 11h6" /></svg>;
    case 'target': return <svg {...c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill={color} stroke="none" /></svg>;
    case 'cards': return <svg {...c}><rect x="3" y="7" width="13" height="14" rx="2.5" /><path d="M7 4h11a2 2 0 0 1 2 2v11" /></svg>;
    case 'sketch': return <svg {...c}><path d="M5 3h9l5 5v13H5z" /><path d="M14 3v5h5" /><path d="M8 13h7M8 17h5" /></svg>;
    case 'trophy': return <svg {...c}><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M4 5h3M17 5h3M10 14v3h4v-3M8 21h8M12 17v4" /></svg>;
    case 'chart': return <svg {...c}><path d="M5 21V9M12 21V4M19 21v-8" /></svg>;
    case 'search': return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>;
    case 'menu': return <svg {...c}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'x': return <svg {...c}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'chevD': return <svg {...c}><path d="M6 9l6 6 6-6" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'shield': return <svg {...c}><path d="M12 3l8 3v6c0 4.6-3.4 8.6-8 9.8C7.4 20.6 4 16.6 4 12V6l8-3z" /></svg>;
    case 'car': return <svg {...c}><path d="M5 16l1.2-5a3 3 0 0 1 2.9-2.2h5.8A3 3 0 0 1 17.8 11L19 16" /><rect x="3" y="16" width="18" height="4" rx="1.6" /><path d="M7 20v1.5M17 20v1.5" /></svg>;
    case 'siren': return <svg {...c}><path d="M5 17a7 7 0 0 1 14 0v2H5v-2z" /><path d="M12 6V3M5 9L3 7M19 9l2-2" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

type Course = 'pl' | 'mossos';
const COURSE_META: Record<Course, { name: string; accent: string; icon: string; tag: string; home: string }> = {
  pl: { name: 'Policia Local', accent: '#2563EB', icon: 'car', tag: 'Oposició PL', home: '/policia-local' },
  mossos: { name: "Mossos d'Esquadra", accent: A.blue, icon: 'shield', tag: 'Temari oposició', home: '/mossos' },
};

// Construeix els destins del menú segons el curs actiu.
function navFor(course: Course) {
  const m = course === 'mossos' ? '/mossos' : '/policia-local';
  return [
    { id: 'inici', label: 'Inici', icon: 'home', to: '/academia' },
    { id: 'temari', label: 'Temari', icon: 'book', kicker: 'Estudiar', to: course === 'mossos' ? '/mossos/temari' : '/academia?sec=temari' },
    { id: 'tests', label: 'Tests', icon: 'target', kicker: 'Practicar', to: m },
    { id: 'flashcards', label: 'Flashcards', icon: 'cards', to: `${m}/flashcards` },
    { id: 'esquemes', label: 'Esquemes', icon: 'sketch', to: `${m}/esquemes` },
    { id: 'lliga', label: 'Lliga', icon: 'trophy', to: '/academia?sec=lliga' },
    { id: 'stats', label: 'Estadístiques', icon: 'chart', to: '/academia?sec=stats' },
  ] as const;
}
const MOBILE = ['inici', 'temari', 'tests', 'flashcards', 'lliga'];

function courseOf(pathname: string): Course {
  return pathname.startsWith('/mossos') ? 'mossos' : 'pl';
}
function activeId(pathname: string, search: string): string {
  if (pathname === '/academia') {
    const sec = new URLSearchParams(search).get('sec');
    return ['temari', 'tests', 'flashcards', 'esquemes', 'lliga', 'stats'].includes(sec || '') ? sec! : 'inici';
  }
  if (pathname.includes('/flashcards')) return 'flashcards';
  if (pathname.includes('/esquemes')) return 'esquemes';
  if (pathname.includes('/temari')) return 'temari';
  if (pathname.startsWith('/retos')) return 'lliga';
  if (pathname.startsWith('/policia-local') || pathname.startsWith('/mossos') || pathname.startsWith('/cultura-general') || pathname.startsWith('/actualitat')) return 'tests';
  return 'inici';
}

function Logo({ onClick, size = 26 }: { onClick?: () => void; size?: number }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: 'transparent', cursor: onClick ? 'pointer' : 'default', padding: 0 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"><path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill={A.ink} /><circle cx="32" cy="22" r="4.2" fill={A.terracota} /><rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={A.terracota} /></svg>
    <span style={{ fontFamily: A.sans, fontWeight: 800, fontSize: size * 0.72, letterSpacing: -0.6, color: A.ink }}>info<span style={{ color: A.terraInk }}>pol</span></span>
  </button>;
}

function NavItem({ n, on, accent, onClick }: { n: { id: string; label: string; icon: string; kicker?: string }; on: boolean; accent: string; onClick: () => void }) {
  return <button onClick={onClick} className="a-navitem" style={{ border: on ? `1px solid ${A.line}` : '1px solid transparent', cursor: 'pointer', textAlign: 'left', background: on ? A.card : 'transparent', boxShadow: on ? A.shadow : 'none', borderRadius: 13, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: on ? accent : A.bgDeep, display: 'grid', placeItems: 'center', boxShadow: on ? A.inset : 'none' }}><Ic name={n.icon} size={17} color={on ? '#fff' : A.inkSoft} sw={2.2} /></span>
    <span style={{ flex: 1 }}>
      <span style={{ display: 'block', fontFamily: A.display, fontWeight: on ? 700 : 600, fontSize: 14.5, color: on ? A.ink : A.inkSoft }}>{n.label}</span>
      {n.kicker && <Mono size={9} color={on ? accent : A.inkFaint} style={{ letterSpacing: 0.6 }}>{n.kicker}</Mono>}
    </span>
  </button>;
}

function CourseSwitcher({ course, onPick }: { course: Course; onPick: (c: Course) => void }) {
  const [open, setOpen] = useState(false);
  const c = COURSE_META[course];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: A.shadow }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: c.accent, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: A.inset }}><Ic name={c.icon} size={19} color="#fff" sw={2.2} /></span>
        <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          <Mono size={9} style={{ letterSpacing: 0.8 }}>{c.tag}</Mono>
        </span>
        <Ic name="chevD" size={16} color={A.inkMuted} />
      </button>
      {open && (<>
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 140 }} />
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 141, background: A.card, borderRadius: 14, border: `1px solid ${A.line2}`, boxShadow: A.shadowMd, padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(['mossos', 'pl'] as Course[]).map((id) => { const o = COURSE_META[id];
            return <button key={id} onClick={() => { setOpen(false); onPick(id); }} style={{ border: 'none', background: id === course ? A.bg : 'transparent', cursor: 'pointer', borderRadius: 10, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: o.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name={o.icon} size={17} color="#fff" sw={2.2} /></span>
              <span style={{ flex: 1 }}><span style={{ display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink }}>{o.name}</span><Mono size={9}>{o.tag}</Mono></span>
              {id === course && <Ic name="check" size={16} color={o.accent} sw={3} />}
            </button>; })}
        </div>
      </>)}
    </div>
  );
}

export default function AcademiaShellLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [topQ, setTopQ] = useState('');
  const course = courseOf(location.pathname);
  const accent = COURSE_META[course].accent;
  const NAV = navFor(course);
  const active = activeId(location.pathname, location.search);
  const initial = (auth.profile?.name || auth.user?.email?.split('@')[0] || 'E')[0].toUpperCase();

  const goto = (to: string) => { nav(to); setDrawer(false); };
  const pickCourse = (c: Course) => goto(COURSE_META[c].home);

  const sidebarInner = (closeAfter = false) => (
    <>
      <CourseSwitcher course={course} onPick={pickCourse} />
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map((n) => <NavItem key={n.id} n={n} on={active === n.id} accent={accent} onClick={() => { goto(n.to); if (closeAfter) setDrawer(false); }} />)}
      </nav>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: A.bg }}>
      <aside className="a-sidebar" style={{ width: 256, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, background: A.bgSoft, borderRight: `1px solid ${A.line}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        <div style={{ padding: '2px 6px 0' }}><Logo onClick={() => nav('/')} /></div>
        {sidebarInner()}
        <button onClick={() => nav('/operativa')} className="a-navitem" style={{ marginTop: 'auto', border: 'none', cursor: 'pointer', background: A.blueSoft, borderRadius: 14, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: A.blue, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}><Ic name="siren" size={18} color="#fff" sw={2.2} /></span>
          <div style={{ flex: 1 }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.blueInk }}>Anar a Operativa</div><Mono size={9} color={A.blue}>Consulta al carrer</Mono></div>
          <Ic name="arrow" size={16} color={A.blue} />
        </button>
      </aside>

      <div id="a-scroll" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflowY: 'auto' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(244,241,234,0.82)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderBottom: `1px solid ${A.line}`, padding: '12px clamp(16px,3vw,34px)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setDrawer(true)} className="a-only-mobile" style={{ border: 'none', background: A.card, width: 42, height: 42, borderRadius: 12, boxShadow: A.shadow, cursor: 'pointer', placeItems: 'center', flexShrink: 0 }}><Ic name="menu" size={20} color={A.inkSoft} /></button>
          <form onSubmit={(e) => { e.preventDefault(); const v = topQ.trim(); if (v) nav(`/cerca?q=${encodeURIComponent(v)}`); }} style={{ flex: 1, maxWidth: 560, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={17} color={A.inkMuted} /></span>
            <input value={topQ} onChange={(e) => setTopQ(e.target.value)} placeholder="Cerca per article, norma, paraula clau…" style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, borderRadius: 999, padding: '11px 16px 11px 40px', fontFamily: A.sans, fontSize: 14, color: A.ink, outline: 'none', boxShadow: A.shadow, boxSizing: 'border-box' }} />
          </form>
          <button onClick={() => nav('/perfil')} style={{ width: 42, height: 42, borderRadius: 999, border: 'none', cursor: 'pointer', background: A.ink, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{initial}</button>
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
            {sidebarInner(true)}
          </div>
        </div>
      )}

      <nav className="a-bottomnav" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 35, background: 'rgba(251,249,244,0.94)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderTop: `1px solid ${A.line2}`, padding: '8px 6px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around' }}>
        {MOBILE.map((id) => { const n = NAV.find((x) => x.id === id)!; const on = active === id;
          return <button key={id} onClick={() => goto(n.to)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
            <span style={{ width: 40, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: on ? `${accent}22` : 'transparent' }}><Ic name={n.icon} size={21} color={on ? accent : A.inkMuted} sw={2.2} /></span>
            <span style={{ fontFamily: A.sans, fontWeight: on ? 800 : 600, fontSize: 10.5, color: on ? A.ink : A.inkMuted }}>{n.label}</span>
          </button>; })}
      </nav>
    </div>
  );
}
