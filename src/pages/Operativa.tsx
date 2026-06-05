// Operativa — disseny "dashboard amb sidebar" (Claude Design).
// Shell complet (sidebar + topbar + bottomnav + drawer) i 6 seccions
// (Inici, Cercador, Trànsit, Lleis, Protocols, Telèfons), accent blau.
// Consulta ràpida per a agents en servei, cablejat a les rutes reals.
// El chrome global de l'app s'amaga a /operativa (vegeu Layout.tsx).
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useNoticiesAll } from '../lib/noticiesRemote';

/* ── Tokens (compartits amb el disseny Acadèmia) ── */
const A = {
  bg: '#F4F1EA', bgDeep: '#ECE7DC', bgSoft: '#FBF9F4', card: '#FFFFFF',
  ink: '#15151C', inkSoft: '#44444F', inkMuted: '#82828D', inkFaint: '#B4B4BC',
  line: 'rgba(21,21,28,0.07)', line2: 'rgba(21,21,28,0.12)', night: '#15161E',
  terracota: '#FF7A1A', terraSoft: '#FFE7D2', terraInk: '#7A2E04',
  blue: '#3B6BF5', blueSoft: '#E2E9FE', blueInk: '#0E2B7A',
  green: '#1FB286', greenSoft: '#D2F0E2', greenInk: '#0B5A3D',
  red: '#E0455A', redSoft: '#FBDCE0', redInk: '#7A1B22',
  purple: '#9C4FE0', purpleSoft: '#EEE0FB', purpleInk: '#4A1B7A',
  amber: '#E89421', amberSoft: '#FBE7C2', pink: '#E8519B', pinkSoft: '#FCDDEC',
  teal: '#0BB4C2', tealSoft: '#CCEEF1', gold: '#F0B400',
  display: '"Poppins", "Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  sans: '"Manrope", system-ui, sans-serif',
  rlg: 22, rxl: 28,
  shadow: '0 1px 0 rgba(21,21,28,0.03), 0 6px 18px rgba(21,21,28,0.05)',
  shadowMd: '0 2px 4px rgba(21,21,28,0.04), 0 14px 36px rgba(21,21,28,0.09)',
  shadowLg: '0 30px 70px rgba(21,21,28,0.16)',
  inset: 'inset 0 -4px 0 rgba(0,0,0,0.16)',
};
const OP = A.blue;
type Tone = { solid: string; soft: string; ink: string };
const TONE: Record<string, Tone> = {
  terracota: { solid: A.terracota, soft: A.terraSoft, ink: A.terraInk },
  blue: { solid: A.blue, soft: A.blueSoft, ink: A.blueInk },
  green: { solid: A.green, soft: A.greenSoft, ink: A.greenInk },
  red: { solid: A.red, soft: A.redSoft, ink: A.redInk },
  purple: { solid: A.purple, soft: A.purpleSoft, ink: A.purpleInk },
  amber: { solid: A.amber, soft: A.amberSoft, ink: '#6B3F08' },
  pink: { solid: A.pink, soft: A.pinkSoft, ink: '#7A1B53' },
  teal: { solid: A.teal, soft: A.tealSoft, ink: '#0A4F56' },
  night: { solid: A.night, soft: '#E7E8EE', ink: A.night },
  purpleSoft: { solid: A.purple, soft: A.purpleSoft, ink: A.purpleInk },
};
const toneOf = (t: string): Tone => TONE[t] || TONE.blue;

function Ic({ name, size = 22, color = 'currentColor', sw = 2, fill = false }: { name: string; size?: number; color?: string; sw?: number; fill?: boolean }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home': return <svg {...c}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case 'search': return <svg {...c}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>;
    case 'car': return <svg {...c}><path d="M5 16l1.2-5a3 3 0 0 1 2.9-2.2h5.8A3 3 0 0 1 17.8 11L19 16" /><rect x="3" y="16" width="18" height="4" rx="1.6" /><path d="M7 20v1.5M17 20v1.5" /></svg>;
    case 'scale': return <svg {...c}><path d="M12 4v17M6 21h12M5 7h14" /><path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" /></svg>;
    case 'list': return <svg {...c}><path d="M4 6h16M4 12h16M4 18h10" /></svg>;
    case 'phone': return <svg {...c}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
    case 'siren': return <svg {...c}><path d="M5 17a7 7 0 0 1 14 0v2H5v-2z" /><path d="M12 6V3M5 9L3 7M19 9l2-2" /></svg>;
    case 'book': return <svg {...c}><path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h8M8 11h6" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'chevR': return <svg {...c}><path d="M9 6l6 6-6 6" /></svg>;
    case 'chevD': return <svg {...c}><path d="M6 9l6 6 6-6" /></svg>;
    case 'x': return <svg {...c}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'menu': return <svg {...c}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'bolt': return <svg {...c} fill={fill ? color : 'none'} stroke={fill ? 'none' : color}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>;
    case 'grid': return <svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>;
    case 'news': return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h6M7 13h6M16 9h2M16 13h2" /></svg>;
    case 'star': return <svg {...c} fill={fill ? color : 'none'} stroke={fill ? 'none' : color}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.5 1.1 6.4L12 17.5 6.5 20.5l1.1-6.4L3 9.6l6.3-.9L12 3z" /></svg>;
    case 'shield': return <svg {...c}><path d="M12 3l8 3v6c0 4.6-3.4 8.6-8 9.8C7.4 20.6 4 16.6 4 12V6l8-3z" /></svg>;
    case 'heart': return <svg {...c}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>;
    case 'doc': return <svg {...c}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></svg>;
    case 'flask': return <svg {...c}><path d="M9 3h6" /><path d="M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}
function Mono({ children, color, size = 11, style = {} }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return <span style={{ fontFamily: A.mono, fontWeight: 600, fontSize: size, letterSpacing: 1.2, textTransform: 'uppercase', color: color || A.inkMuted, ...style }}>{children}</span>;
}
function Card({ children, pad = 20, style = {}, onClick, hover = false }: { children: ReactNode; pad?: number; style?: CSSProperties; onClick?: () => void; hover?: boolean }) {
  return <div onClick={onClick} className={hover ? 'a-hover' : ''} style={{ background: A.card, borderRadius: A.rlg, padding: pad, boxShadow: A.shadow, border: `1px solid ${A.line}`, cursor: onClick ? 'pointer' : 'default', ...style }}>{children}</div>;
}

/* ── Dades (referència operativa) ── */
const SCT = '/leyes/s/transit/cataleg-d-infraccions-de-transit-sct-2026';
const INFRACCIONS = [
  { concept: 'Conduir sense permís', norma: 'Art. 384 CP', tone: 'red', imp: 'Via penal', punts: '—', grau: 'Delicte' },
  { concept: 'Excés de velocitat (+50%)', norma: 'LSV 77', tone: 'terracota', imp: '600 €', punts: '6', grau: 'MG' },
  { concept: 'Alcoholèmia 0,26–0,50 mg/l', norma: 'LSV 77.c', tone: 'pink', imp: '500 €', punts: '4', grau: 'G' },
  { concept: 'Ús del mòbil conduint', norma: 'RGC 18', tone: 'purple', imp: '200 €', punts: '6', grau: 'G' },
  { concept: 'No usar el cinturó', norma: 'RGC 117', tone: 'blue', imp: '200 €', punts: '3', grau: 'G' },
  { concept: 'Saltar-se un semàfor', norma: 'RGC 146', tone: 'amber', imp: '200 €', punts: '4', grau: 'G' },
];
const PHONES = [
  { num: '112', label: 'Emergències', tone: 'red' },
  { num: '016', label: 'Violència masclista', tone: 'pink' },
  { num: '024', label: 'Conducta suïcida', tone: 'blue' },
  { num: '900202010', label: 'ANAR · Menors', tone: 'green', alt: '900 20 20 10' },
];
const PROTOCOLS = [
  { area: 'SC / Penal', tone: 'blue', route: '/operativa/penal', items: ['Identificació de persones', 'Escorcoll i cacheig', 'Registre de vehicle', "Comís d'efectes"] },
  { area: 'Detencions', tone: 'purple', route: '/operativa/penal/drets-detingut', items: ['Lectura de drets (520 LECrim)', 'Terminis de detenció', 'Assistència lletrada', 'Trasllat i custòdia', "Redacció d'atestat"] },
  { area: 'Trànsit', tone: 'terracota', route: '/operativa/trafico', items: ["Control d'alcoholèmia", 'Test de drogues', 'Accident amb víctimes', 'Retirada de vehicle'] },
  { area: 'Violència de gènere', tone: 'pink', route: '/operativa/penal/violencia-genere', items: ['Valoració del risc', 'Mesures de protecció', 'Activació VioGén', 'Acompanyament a la víctima'] },
];

/* ════════════════════════════ PÀGINA ════════════════════════════ */
const OP_NAV = [
  { id: 'inici', label: 'Inici', icon: 'home' },
  { id: 'cercador', label: 'Cercador', icon: 'search', kicker: 'Infraccions' },
  { id: 'transit', label: 'Trànsit', icon: 'car', kicker: 'Catàleg SCT' },
  { id: 'lleis', label: 'Lleis', icon: 'scale', kicker: 'Biblioteca' },
  { id: 'protocols', label: 'Protocols', icon: 'list', kicker: 'Procediments' },
  { id: 'telefons', label: 'Telèfons', icon: 'phone' },
] as const;
type Sec = typeof OP_NAV[number]['id'];
const OP_MOBILE: Sec[] = ['inici', 'cercador', 'transit', 'lleis', 'protocols'];
const LS = 'infopol-operativa-section';

function Logo({ onClick, size = 26 }: { onClick?: () => void; size?: number }) {
  return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: 'transparent', cursor: onClick ? 'pointer' : 'default', padding: 0 }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none"><path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill={A.ink} /><circle cx="32" cy="22" r="4.2" fill={A.terracota} /><rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={A.terracota} /></svg>
    <span style={{ fontFamily: A.sans, fontWeight: 800, fontSize: size * 0.72, letterSpacing: -0.6, color: A.ink }}>info<span style={{ color: A.terracota }}>pol</span></span>
  </button>;
}
function NavItem({ n, on, onClick }: { n: typeof OP_NAV[number]; on: boolean; onClick: () => void }) {
  return <button onClick={onClick} className="a-navitem" style={{ border: on ? `1px solid ${A.line}` : '1px solid transparent', cursor: 'pointer', textAlign: 'left', background: on ? A.card : 'transparent', boxShadow: on ? A.shadow : 'none', borderRadius: 13, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: on ? OP : A.bgDeep, display: 'grid', placeItems: 'center', boxShadow: on ? A.inset : 'none' }}><Ic name={n.icon} size={17} color={on ? '#fff' : A.inkSoft} sw={2.2} /></span>
    <span style={{ flex: 1 }}>
      <span style={{ display: 'block', fontFamily: A.display, fontWeight: on ? 700 : 600, fontSize: 14.5, color: on ? A.ink : A.inkSoft }}>{n.label}</span>
      {'kicker' in n && n.kicker && <Mono size={9} color={on ? OP : A.inkFaint} style={{ letterSpacing: 0.6 }}>{n.kicker}</Mono>}
    </span>
  </button>;
}

export default function Operativa() {
  const nav = useNavigate();
  const [section, setSection] = useState<Sec>(() => { try { const v = localStorage.getItem(LS); return (OP_NAV.some((n) => n.id === v) ? v : 'inici') as Sec; } catch { return 'inici'; } });
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { try { localStorage.setItem(LS, section); } catch { /* */ } document.getElementById('a-scroll')?.scrollTo(0, 0); }, [section]);
  const go = (s: Sec) => setSection(s);
  const ctx: OCtx = { nav, go };

  const screens: Record<Sec, ReactNode> = {
    inici: <OpInici ctx={ctx} />,
    cercador: <OpCercador ctx={ctx} />,
    transit: <OpTransit ctx={ctx} />,
    lleis: <OpLleis ctx={ctx} />,
    protocols: <OpProtocols ctx={ctx} />,
    telefons: <OpTelefons />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: A.bg }}>
      <aside className="a-sidebar" style={{ width: 256, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, background: A.bgSoft, borderRight: `1px solid ${A.line}`, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        <div style={{ padding: '2px 6px 0' }}><Logo onClick={() => nav('/')} /></div>
        <div style={{ background: A.blueSoft, borderRadius: 14, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: OP, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="siren" size={18} color="#fff" sw={2.2} /></span>
          <div><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.blueInk }}>Operativa</div><Mono size={9} color={A.blue}>Consulta al carrer</Mono></div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {OP_NAV.map((n) => <NavItem key={n.id} n={n} on={section === n.id} onClick={() => go(n.id)} />)}
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
          <div style={{ flex: 1, maxWidth: 620, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={17} color={A.inkMuted} /></span>
            <input placeholder="Cerca infracció, article, multa, punts…" onKeyDown={(e) => { if (e.key === 'Enter') nav('/superbuscador'); }} style={{ width: '100%', border: `1px solid ${A.line2}`, background: A.card, borderRadius: 999, padding: '11px 16px 11px 40px', fontFamily: A.sans, fontSize: 14, color: A.ink, outline: 'none', boxShadow: A.shadow, boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => nav('/perfil')} style={{ width: 42, height: 42, borderRadius: 999, border: 'none', cursor: 'pointer', background: A.ink, color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>E</button>
        </header>

        <main className="a-main-pad" style={{ flex: 1, padding: 'clamp(20px,3vw,38px)', maxWidth: 1240, width: '100%', margin: '0 auto' }}>{screens[section]}</main>
        <footer style={{ padding: '24px clamp(20px,3vw,38px)', borderTop: `1px solid ${A.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, color: A.inkMuted }}>© 2026 Infopol · Informació no oficial</span>
        </footer>
      </div>

      {drawer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 160 }}>
          <div onClick={() => setDrawer(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,28,0.4)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, background: A.bgSoft, padding: 18, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: A.shadowLg, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Logo onClick={() => nav('/')} /><button onClick={() => setDrawer(false)} style={{ border: 'none', background: A.card, width: 36, height: 36, borderRadius: 10, boxShadow: A.shadow, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Ic name="x" size={18} color={A.inkSoft} /></button></div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{OP_NAV.map((n) => <NavItem key={n.id} n={n} on={section === n.id} onClick={() => { go(n.id); setDrawer(false); }} />)}</nav>
          </div>
        </div>
      )}

      <nav className="a-bottomnav" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 35, background: 'rgba(251,249,244,0.94)', backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderTop: `1px solid ${A.line2}`, padding: '8px 6px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around' }}>
        {OP_MOBILE.map((id) => { const n = OP_NAV.find((x) => x.id === id)!; const on = section === id;
          return <button key={id} onClick={() => go(id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
            <span style={{ width: 40, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: on ? A.blueSoft : 'transparent' }}><Ic name={n.icon} size={21} color={on ? OP : A.inkMuted} sw={2.2} /></span>
            <span style={{ fontFamily: A.sans, fontWeight: on ? 800 : 600, fontSize: 10.5, color: on ? A.ink : A.inkMuted }}>{n.label}</span>
          </button>; })}
      </nav>
    </div>
  );
}

type OCtx = { nav: ReturnType<typeof useNavigate>; go: (s: Sec) => void };
const Head = ({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) => (
  <div style={{ marginBottom: 22 }}>
    <Mono color={OP} style={{ letterSpacing: 1.4 }}>{kicker}</Mono>
    <h1 style={{ margin: '8px 0 0', fontFamily: A.display, fontWeight: 700, fontSize: 'clamp(26px,3.4vw,38px)', letterSpacing: -1, color: A.ink, lineHeight: 1.1 }}>{title}</h1>
    {desc && <p style={{ margin: '8px 0 0', fontFamily: A.sans, fontSize: 15, color: A.inkSoft, maxWidth: 560, lineHeight: 1.5 }}>{desc}</p>}
  </div>
);
const RowLabel = ({ icon, children }: { icon: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 14px' }}><Ic name={icon} size={15} color={A.inkMuted} sw={2.2} /><Mono color={A.inkSoft}>{children}</Mono></div>
);

/* ── INICI ── */
function OpInici({ ctx }: { ctx: OCtx }) {
  const news = useNoticiesAll().slice(0, 3);
  const bigs = [
    { grad: `linear-gradient(150deg, ${A.purple}, #7C3AED)`, accent: A.purple, kicker: 'Superbuscador · SCT', title: 'Troba qualsevol infracció en 2 segons', desc: 'Busca per concepte, article, multa o punts en LSV, RGC, RGCond, RGV i CP.', chips: ['LSV', 'RGC', 'RGCond', 'CP'], cta: 'Obrir buscador', onClick: () => ctx.go('cercador') },
    { grad: `linear-gradient(150deg, ${A.terracota}, #E8590C)`, accent: A.terracota, badge: 'Més usat', kicker: 'Trànsit', title: 'Catàleg SCT 2026', desc: 'Fitxa completa per infracció amb quantia, punts i DTE.', chips: ['SCT 2026', 'Punts', 'Quanties', 'L1/L2/L3'], cta: 'Obrir catàleg', onClick: () => ctx.nav(SCT) },
  ];
  const smalls = [
    { tone: 'pink', kicker: 'Calculadora', title: 'Alcoholèmia', icon: 'flask', desc: 'Sanció per mg/l, factor professional/novell i via penal.', onClick: () => ctx.nav('/calculadora-alcohol') },
    { tone: 'amber', kicker: 'Biblioteca', title: 'Lleis', icon: 'scale', desc: 'CE, CP, LECrim, EAC i +40 normes amb esquemes.', onClick: () => ctx.go('lleis') },
    { tone: 'green', kicker: 'Recursos', title: 'Dreceres ràpides', icon: 'star', desc: 'AIAC, validadors i recursos útils en servei.', onClick: () => ctx.nav('/recursos') },
  ];
  const arees = [
    { tone: 'terracota', icon: 'car', title: 'Trànsit', desc: 'Catàleg SCT, alcoholèmia, drogues, accidents, atestats.', meta: '14 proc · LSV · RGC', onClick: () => ctx.go('transit') },
    { tone: 'night', icon: 'shield', title: 'SC / Penal', desc: 'Identificació, registres, escorcoll i cacheig.', meta: '20 proc.', onClick: () => ctx.nav('/operativa/penal') },
    { tone: 'purple', icon: 'scale', title: 'Detencions', desc: 'Terminis, drets, assistència lletrada i atestat.', meta: '5 proc.', onClick: () => ctx.nav('/operativa/penal/drets-detingut') },
    { tone: 'pink', icon: 'heart', title: 'Violència de gènere', desc: 'Valoració risc, mesures urgents i VioGén.', meta: '4 proc.', onClick: () => ctx.nav('/operativa/penal/violencia-genere') },
    { tone: 'green', icon: 'phone', title: 'Telèfons útils', desc: 'Emergències, víctimes, menors i serveis socials.', meta: '112 · 016 · 024', onClick: () => ctx.go('telefons') },
    { tone: 'purpleSoft', icon: 'doc', title: 'Drets del detingut', desc: "Lectura completa per imprimir o adjuntar a l'atestat.", meta: 'Art. 520 LECrim', onClick: () => ctx.nav('/operativa/penal/drets-detingut') },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Head kicker="Operativa · Consulta al carrer" title="Norma, procediment i dreceres" desc="Tot el que necessites en servei: cerca una infracció, obre un protocol o consulta una llei en segons." />
      <div>
        <RowLabel icon="bolt">Eines ràpides · el més usat</RowLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="a-grid-fork">
          {bigs.map((t, i) => (
            <div key={i} onClick={t.onClick} className="a-hover" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: A.rxl, backgroundImage: t.grad, color: '#fff', padding: 24, boxShadow: A.shadowMd, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 999, padding: '5px 12px' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff' }} /><Mono size={10} color="#fff" style={{ letterSpacing: 1 }}>{t.kicker}</Mono></span>
                {t.badge && <span style={{ background: A.gold, color: A.ink, fontFamily: A.mono, fontWeight: 700, fontSize: 10, padding: '4px 10px', borderRadius: 999, letterSpacing: 0.5 }}>{t.badge.toUpperCase()}</span>}
              </div>
              <h3 style={{ margin: '16px 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 23, letterSpacing: -0.5, lineHeight: 1.15, maxWidth: 420 }}>{t.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, opacity: 0.92, maxWidth: 420 }}>{t.desc}</p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '16px 0 0' }}>{t.chips.map((ch) => <span key={ch} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 8, padding: '4px 10px', fontFamily: A.mono, fontWeight: 600, fontSize: 11 }}>{ch}</span>)}</div>
              <div style={{ marginTop: 'auto', paddingTop: 18 }}><span className="a-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: t.accent, borderRadius: 12, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>{t.cta} <Ic name="arrow" size={15} color={t.accent} /></span></div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }} className="a-grid-stats">
          {smalls.map((t, i) => { const k = toneOf(t.tone);
            return <div key={i} onClick={t.onClick} className="a-hover" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: k.soft, padding: 20, minHeight: 150, border: `1px solid ${A.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.6)', borderRadius: 999, padding: '5px 11px' }}><Ic name={t.icon} size={13} color={k.solid} sw={2.2} /><Mono size={9} color={k.ink}>{t.kicker}</Mono></span>
                <span style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.7)', display: 'grid', placeItems: 'center' }}><Ic name="arrow" size={15} color={k.solid} /></span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 20, letterSpacing: -0.4, color: k.ink }}>{t.title}</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: k.ink, opacity: 0.85 }}>{t.desc}</p>
            </div>; })}
        </div>
      </div>
      <div>
        <RowLabel icon="grid">Àrees operatives</RowLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="a-grid-stats">
          {arees.map((a, i) => { const k = toneOf(a.tone); const dark = a.tone === 'night'; const soft = a.tone === 'purpleSoft';
            const bg = dark ? `linear-gradient(150deg, #2A2D40, ${A.night})` : soft ? A.purpleSoft : k.solid; const fg = soft ? A.purpleInk : '#fff';
            return <div key={i} onClick={a.onClick} className="a-hover" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: A.rxl, backgroundImage: dark ? bg : undefined, background: dark ? undefined : bg, color: fg, padding: 22, boxShadow: A.shadowMd, display: 'flex', flexDirection: 'column', border: soft ? `1px solid ${A.line}` : 'none', minHeight: 150 }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: soft ? '#fff' : 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', marginBottom: 14 }}><Ic name={a.icon} size={24} color={soft ? A.purple : '#fff'} sw={2.1} /></span>
              <h3 style={{ margin: '0 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 19, letterSpacing: -0.5, lineHeight: 1.1 }}>{a.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.4, opacity: soft ? 0.8 : 0.9 }}>{a.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <Mono size={10} color={soft ? A.purple : '#fff'} style={{ opacity: 0.9 }}>{a.meta}</Mono>
                <span style={{ width: 30, height: 30, borderRadius: 999, background: soft ? '#fff' : 'rgba(255,255,255,0.22)', display: 'grid', placeItems: 'center' }}><Ic name="arrow" size={15} color={soft ? A.purple : '#fff'} /></span>
              </div>
            </div>; })}
        </div>
      </div>
      {news.length > 0 && (
        <div>
          <RowLabel icon="news">Actualitat normativa</RowLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {news.map((n) => (
              <Card key={n.slug} pad={16} hover onClick={() => ctx.nav(`/noticies/${encodeURIComponent(n.slug)}`)} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: A.blueSoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name="news" size={19} color={A.blue} sw={2.1} /></span>
                <span style={{ flex: 1, fontFamily: A.display, fontWeight: 600, fontSize: 14.5, color: A.ink, minWidth: 0 }}>{n.title}</span>
                <Mono size={10}>{n.publishedAt.slice(5)}</Mono>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfraccioRow({ inf, onClick }: { inf: typeof INFRACCIONS[number]; onClick: () => void }) {
  const k = toneOf(inf.tone);
  return <Card pad={16} hover onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: `3px solid ${k.solid}` }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink, letterSpacing: -0.3 }}>{inf.concept}</div>
      <Mono size={10} color={k.solid} style={{ marginTop: 2 }}>{inf.norma} · Grau {inf.grau}</Mono>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
      <div style={{ textAlign: 'right' }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink }}>{inf.imp}</div><Mono size={9}>Quantia</Mono></div>
      <div style={{ textAlign: 'right' }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: inf.punts === '—' ? A.inkFaint : A.red }}>{inf.punts}</div><Mono size={9}>Punts</Mono></div>
      <Ic name="chevR" size={18} color={A.inkFaint} />
    </div>
  </Card>;
}

/* ── CERCADOR ── */
function OpCercador({ ctx }: { ctx: OCtx }) {
  const [q, setQ] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Superbuscador · SCT" title="Troba qualsevol infracció" desc="Cerca per concepte, article, multa o punts. Obre el superbuscador per resultats complets." />
      <form onSubmit={(e) => { e.preventDefault(); ctx.nav(q.trim() ? `/superbuscador?q=${encodeURIComponent(q.trim())}` : '/superbuscador'); }} style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={20} color={A.purple} /></span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: conduir sense permís, mòbil, 0,30 mg/l…" style={{ width: '100%', border: `2px solid ${A.purple}`, background: A.card, borderRadius: 16, padding: '16px 18px 16px 50px', fontFamily: A.display, fontWeight: 600, fontSize: 17, color: A.ink, outline: 'none', boxShadow: A.shadowMd, boxSizing: 'border-box' }} />
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['LSV', 'RGC', 'RGCond', 'RGV', 'CP', 'Assegurança'].map((c) => <span key={c} style={{ background: A.purpleSoft, color: A.purpleInk, fontFamily: A.mono, fontWeight: 600, fontSize: 12, padding: '7px 13px', borderRadius: 999 }}>{c}</span>)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RowLabel icon="list">Infraccions destacades</RowLabel>
        {INFRACCIONS.map((inf, i) => <InfraccioRow key={i} inf={inf} onClick={() => ctx.nav(SCT)} />)}
      </div>
    </div>
  );
}

/* ── TRÀNSIT ── */
function OpTransit({ ctx }: { ctx: OCtx }) {
  const tiles = [
    { l: 'Catàleg SCT', icon: 'car', tone: 'terracota', to: SCT },
    { l: 'Alcoholèmia', icon: 'flask', tone: 'pink', to: '/calculadora-alcohol' },
    { l: 'Drogues', icon: 'flask', tone: 'purple', to: '/operativa/penal/taula-drogues' },
    { l: 'Accidents', icon: 'siren', tone: 'red', to: '/operativa/trafico' },
    { l: 'Retirades', icon: 'car', tone: 'blue', to: '/operativa/trafico' },
    { l: 'Atestats', icon: 'doc', tone: 'amber', to: '/operativa/penal/taula-actes' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Catàleg SCT 2026" title="Trànsit" desc="Catàleg oficial d'infraccions amb quantia, punts i detracció. Alcoholèmia, drogues, accidents i atestats." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {tiles.map((x) => { const k = toneOf(x.tone);
          return <div key={x.l} className="a-hover" onClick={() => ctx.nav(x.to)} style={{ cursor: 'pointer', background: A.card, border: `1px solid ${A.line}`, borderRadius: A.rlg, boxShadow: A.shadow, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: k.soft, display: 'grid', placeItems: 'center' }}><Ic name={x.icon} size={21} color={k.solid} sw={2.1} /></span>
            <span style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15, color: A.ink }}>{x.l}</span>
          </div>; })}
      </div>
      <div>
        <RowLabel icon="list">Infraccions destacades</RowLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{INFRACCIONS.map((inf, i) => <InfraccioRow key={i} inf={inf} onClick={() => ctx.nav(SCT)} />)}</div>
      </div>
    </div>
  );
}

/* ── LLEIS ── */
function OpLleis({ ctx }: { ctx: OCtx }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Biblioteca de lleis" title="Normativa amb esquemes" desc="CE, CP, LECrim, EAC i +40 normes. Cada matèria amb el seu contingut operatiu." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {MODULES.map((m) => (
          <Card key={m.slug} pad={18} hover onClick={() => ctx.nav(`/leyes/s/${m.slug}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: `3px solid ${A.blue}` }}>
            <span style={{ width: 46, height: 46, borderRadius: 13, background: A.blueSoft, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 22 }}>{m.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.display, fontWeight: 800, fontSize: 15, color: A.ink }}>{m.title}</div>
              {m.description && <div style={{ fontFamily: A.sans, fontSize: 13, color: A.inkMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.description}</div>}
            </div>
            <Ic name="chevR" size={18} color={A.inkFaint} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── PROTOCOLS ── */
function OpProtocols({ ctx }: { ctx: OCtx }) {
  const [open, setOpen] = useState<string | null>('SC / Penal');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Procediments pas a pas" title="Protocols d'actuació" desc="Guies operatives clares per actuar amb seguretat jurídica. Toca un àmbit per desplegar." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROTOCOLS.map((p) => { const k = toneOf(p.tone); const isOpen = open === p.area;
          return <div key={p.area} style={{ background: A.card, borderRadius: A.rlg, border: `1px solid ${isOpen ? k.solid : A.line}`, boxShadow: A.shadow, overflow: 'hidden' }}>
            <button onClick={() => setOpen(isOpen ? null : p.area)} style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
              <span style={{ width: 44, height: 44, borderRadius: 13, background: k.solid, display: 'grid', placeItems: 'center', boxShadow: A.inset, flexShrink: 0 }}><Ic name="shield" size={22} color="#fff" sw={2.1} /></span>
              <div style={{ flex: 1 }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16.5, color: A.ink }}>{p.area}</div><Mono size={10}>{p.items.length} procediments</Mono></div>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: isOpen ? k.soft : A.bgSoft, display: 'grid', placeItems: 'center', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><Ic name="chevD" size={18} color={isOpen ? k.solid : A.inkMuted} /></span>
            </button>
            {isOpen && <div style={{ padding: '4px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {p.items.map((it, i) => <div key={it} className="a-hover" onClick={() => ctx.nav(p.route)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px', borderRadius: 12, background: A.bgSoft }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: k.soft, color: k.ink, display: 'grid', placeItems: 'center', fontFamily: A.mono, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ flex: 1, fontFamily: A.display, fontWeight: 600, fontSize: 14.5, color: A.ink }}>{it}</span>
                <Ic name="arrow" size={16} color={k.solid} /></div>)}
            </div>}
          </div>; })}
      </div>
    </div>
  );
}

/* ── TELÈFONS ── */
function OpTelefons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Contactes d'emergència" title="Telèfons útils" desc="Accés ràpid als números clau en servei. Toca per trucar." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {PHONES.map((p, i) => { const k = toneOf(p.tone);
          return <a key={i} href={`tel:${p.num}`} className="a-hover" style={{ textDecoration: 'none', background: A.card, border: `1px solid ${A.line}`, borderRadius: A.rxl, boxShadow: A.shadow, padding: 22, textAlign: 'center', display: 'block' }}>
            <span style={{ width: 54, height: 54, borderRadius: 16, background: k.solid, display: 'grid', placeItems: 'center', margin: '0 auto 14px', boxShadow: A.inset }}><Ic name="phone" size={26} color="#fff" sw={2.1} /></span>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 30, color: A.ink, letterSpacing: -0.5 }}>{p.alt ? p.alt.split(' ')[0] : p.num}</div>
            <div style={{ fontFamily: A.display, fontWeight: 600, fontSize: 14, color: A.inkSoft, marginTop: 2 }}>{p.label}</div>
            {p.alt && <Mono size={10} style={{ marginTop: 4 }}>{p.alt}</Mono>}
          </a>; })}
      </div>
    </div>
  );
}
