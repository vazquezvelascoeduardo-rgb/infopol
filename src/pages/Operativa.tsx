// Operativa — disseny "dashboard amb sidebar" (Claude Design).
// Shell complet (sidebar + topbar + bottomnav + drawer) i 6 seccions
// (Inici, Cercador, Trànsit, Lleis, Protocols, Telèfons), accent blau.
// Consulta ràpida per a agents en servei, cablejat a les rutes reals.
// El chrome global de l'app s'amaga a /operativa (vegeu Layout.tsx).
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MODULES } from '../lib/content';
import { useNoticiesAll } from '../lib/noticiesRemote';
import { searchCataleg, getLawColor, type CatalegRow } from '../lib/cataleg-parser';
import HtmlInline from '../components/HtmlInline';
import { I, Mono as MonoV, RV, TitolV, V, type NomIc } from '../lib/v3';
// El catàleg SCT 2026 (nomenclàtor) es mostra incrustat dins de la secció
// "Catàleg SCT", sense redirigir a la fitxa de la llei.
import catalegRaw from '../../content/transit/cataleg-d-infraccions-de-transit-sct-2026.ca.html?raw';

/* ── Tokens (compartits amb el disseny Acadèmia) ── */
const A = {
  bg: '#F4F1EC', bgDeep: '#EFEAE2', bgSoft: '#FFFFFF', card: '#FFFFFF',
  ink: '#15151C', inkSoft: '#4A463F', inkMuted: '#6E6A63', inkFaint: '#9A938A',
  line: 'rgba(21,21,28,0.07)', line2: '#E5DFD5', night: '#15151C',
  terracota: '#FF7A1A', terraSoft: '#FFEDDD', terraInk: '#C4530A',
  blue: '#0B4F8A', blueSoft: '#E2EDF7', blueInk: '#0B4F8A',
  green: '#186B47', greenSoft: '#E1F0E8', greenInk: '#186B47',
  red: '#991B1B', redSoft: '#F7E5E5', redInk: '#991B1B',
  purple: '#0B4F8A', purpleSoft: '#E2EDF7', purpleInk: '#0B4F8A',
  amber: '#9A5B00', amberSoft: '#FBEEDC', pink: '#991B1B', pinkSoft: '#F7E5E5',
  teal: '#186B47', tealSoft: '#E1F0E8', gold: '#9A5B00',
  display: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  rlg: 22, rxl: 28,
  shadow: '0 4px 14px rgba(21,21,28,0.07)',
  shadowMd: '0 14px 30px rgba(21,21,28,0.09)',
  shadowLg: '0 30px 70px rgba(21,21,28,0.16)',
  inset: 'none',
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
// Infraccions destacades: NO són dades inventades — es treuen del catàleg
// SCT 2026 real (mateix nomenclàtor que el superbuscador). Per a cada
// concepte conegut agafem la primera fila que el parser troba al catàleg.
const FEATURED_QUERIES = [
  'sense permís', 'velocitat', 'alcohol', 'mòbil', 'cinturó',
  'semàfor', 'assegurança', 'drogues', 'casc', 'estacionar',
];
let featuredCache: CatalegRow[] | null = null;
function getFeaturedInfraccions(): CatalegRow[] {
  if (featuredCache) return featuredCache;
  const out: CatalegRow[] = [];
  const seen = new Set<string>();
  for (const query of FEATURED_QUERIES) {
    const hit = searchCataleg(query)[0];
    if (hit && !seen.has(hit.concepte)) { seen.add(hit.concepte); out.push(hit); }
  }
  featuredCache = out;
  return out;
}
const sevLabel = (s?: string) => s === 'MG' ? 'Molt greu' : s === 'G' ? 'Greu' : s === 'L' ? 'Lleu' : '';
const isNumericFine = (s: string) => /^\d/.test(s.replace(/\./g, ''));
const fineLabel = (f?: string) => !f ? '—' : isNumericFine(f) ? `${f} €` : f;

/* ════════════════════════════ PÀGINA ════════════════════════════ */
// Seccions del dashboard d'Operativa. El marc (sidebar/topbar/bottomnav)
// el proporciona OperativaShellLayout; aquí només es renderitza el
// contingut de la secció activa (segons ?sec=).
const SECTIONS = ['inici', 'cercador', 'cataleg', 'lleis', 'procediments'] as const;
type Sec = typeof SECTIONS[number];

export default function Operativa() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const secParam = params.get('sec');
  const section: Sec = (SECTIONS.includes(secParam as Sec) ? secParam : 'inici') as Sec;
  const go = (s: Sec) => {
    setParams(s === 'inici' ? {} : { sec: s });
    document.getElementById('a-scroll')?.scrollTo(0, 0);
  };
  const ctx: OCtx = { nav, go };

  const screens: Record<Sec, ReactNode> = {
    inici: <OpInici ctx={ctx} />,
    cercador: <OpCercador ctx={ctx} />,
    cataleg: <OpCataleg />,
    lleis: <OpLleis ctx={ctx} />,
    procediments: <OpProcediments ctx={ctx} />,
  };

  return <>{screens[section]}</>;
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

/* ── INICI (disseny v3 · "Web Operativa") ── */
// Dues portes grans a dalt (el que més s'obre en servei) i sota, la
// graella d'eines. Sense gradients ni etiquetes de "més usat": al carrer
// el que cal és trobar-ho de seguida, no que et venguin res.
function TargetaGran({ fons, fg, tint, tintFg, icona, titol, sub, onClick }: {
  fons: string; fg: string; tint: string; tintFg: string;
  icona: NomIc; titol: string; sub: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: RV.xl, padding: 24,
        background: fons, color: fg,
        boxShadow: fons === V.surface ? V.shadow : '0 14px 30px rgba(153,27,27,.3)',
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
      <span style={{
        width: 50, height: 50, flexShrink: 0, borderRadius: RV.md, background: tint, color: tintFg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={icona} size={23} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 20, fontWeight: 800, letterSpacing: -0.65 }}>{titol}</span>
        <span style={{
          display: 'block', fontSize: 13, marginTop: 5,
          color: fons === V.surface ? V.muted : undefined,
          opacity: fons === V.surface ? 1 : 0.85,
        }}>{sub}</span>
      </span>
    </button>
  );
}

function EinaOperativa({ icona, titol, sub, tint, accent, onClick }: {
  icona: NomIc; titol: string; sub: string; tint: string; accent: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: RV.lg, padding: 18,
        background: V.surface, color: V.ink, boxShadow: V.shadow,
        display: 'flex', flexDirection: 'column', minHeight: 132,
      }}>
      <span style={{
        width: 40, height: 40, borderRadius: 14, background: tint, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={icona} size={19} sw={1.9} />
      </span>
      <span style={{ display: 'block', fontSize: 15, fontWeight: 800, letterSpacing: -0.4, marginTop: 'auto', paddingTop: 14 }}>
        {titol}
      </span>
      <span style={{ display: 'block', fontSize: 12, color: V.muted, marginTop: 4 }}>{sub}</span>
    </button>
  );
}

function OpInici({ ctx }: { ctx: OCtx }) {
  const news = useNoticiesAll().slice(0, 3);

  // Les tres de dalt (checklists, superbuscador i catàleg) són les que es
  // fan servir al carrer i van destacades; aquí queda la resta.
  const eines: { icona: NomIc; titol: string; sub: string; tint: string; accent: string; onClick: () => void }[] = [
    { icona: 'pill', titol: 'Alcoholèmia', sub: 'Taxa, sanció i via penal', tint: V.warnSoft, accent: V.warn, onClick: () => ctx.nav('/calculadora-alcohol') },
    { icona: 'scales', titol: 'Lleis', sub: 'Biblioteca de normativa', tint: V.warnSoft, accent: V.warn, onClick: () => ctx.nav('/leyes') },
    { icona: 'doc', titol: 'SC i Penal', sub: 'Identificació i escorcoll', tint: V.granateSoft, accent: V.granate, onClick: () => ctx.nav('/operativa/penal') },
    { icona: 'lock', titol: 'Detencions', sub: 'Terminis i drets', tint: V.blueSoft, accent: V.blue, onClick: () => ctx.nav('/operativa/penal/drets-detingut') },
    { icona: 'siren', titol: 'Trànsit', sub: 'Accidents i retirades', tint: V.terraSoft, accent: V.terraInk, onClick: () => ctx.nav('/operativa/trafico') },
    { icona: 'crash', titol: 'Croquis', sub: "Esquema d'accident", tint: V.okSoft, accent: V.ok, onClick: () => ctx.nav('/croquis') },
    { icona: 'bell', titol: 'Recursos', sub: 'Eines i telèfons', tint: V.okSoft, accent: V.ok, onClick: () => ctx.nav('/recursos') },
  ];

  return (
    <div className="v3-page v3-anim">
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap', marginBottom: 6,
      }}>
        <TitolV fort="Operativa" post="de carrer" />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9, background: V.okSoft,
          borderRadius: RV.pill, padding: '9px 15px', flexShrink: 0,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: V.ok }} />
          <MonoV size={10} color={V.ok}>DISPONIBLE SENSE XARXA</MonoV>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: V.muted, lineHeight: 1.5, margin: '0 0 20px' }}>
        Consulta ràpida durant el servei. El contingut es desa al navegador.
      </p>

      {/* Les tres que es toquen més al carrer, en gros i primer de tot. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 16 }}>
        <TargetaGran
          fons={V.granate} fg="#fff" tint="rgba(255,255,255,.2)" tintFg="#fff"
          icona="tree" titol="Checklists penals" sub="Escenaris amb arbre de decisió"
          onClick={() => ctx.nav('/operativa/penal')}
        />
        <TargetaGran
          fons={V.blue} fg="#fff" tint="rgba(255,255,255,.2)" tintFg="#fff"
          icona="search" titol="Superbuscador" sub="Infracció, article, multa o punts"
          onClick={() => ctx.nav('/superbuscador')}
        />
        <TargetaGran
          fons={V.terra} fg="#fff" tint="rgba(255,255,255,.22)" tintFg="#fff"
          icona="car" titol="Catàleg SCT" sub="Nomenclàtor complet 2026"
          onClick={() => ctx.go('cataleg')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(165px,1fr))', gap: 14 }}>
        {eines.map((e) => <EinaOperativa key={e.titol} {...e} />)}
      </div>

      {news.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>Actualitat normativa</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {news.map((n) => (
              <button
                key={n.slug}
                type="button"
                onClick={() => ctx.nav(`/noticies/${encodeURIComponent(n.slug)}`)}
                style={{
                  textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: RV.md, padding: 16,
                  background: V.surface, color: V.ink, boxShadow: V.shadow,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                <span style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 10, background: V.blueSoft, color: V.blue,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I n="news" size={19} sw={1.9} />
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, letterSpacing: -0.25 }}>{n.title}</span>
                <MonoV size={10} color={V.faint}>{n.publishedAt.slice(5)}</MonoV>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfraccioRow({ row, onClick }: { row: CatalegRow; onClick: () => void }) {
  const color = getLawColor(row.lawId);
  return <Card pad={16} hover onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: `3px solid ${color}` }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.concepte}</div>
      <Mono size={10} color={color} style={{ marginTop: 2 }}>{row.lawShort}{row.article ? ` · art. ${row.article}` : ''}{row.severity ? ` · ${sevLabel(row.severity)}` : ''}</Mono>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
      {row.fine && <div style={{ textAlign: 'right' }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.ink }}>{fineLabel(row.fine)}</div><Mono size={9}>Quantia</Mono></div>}
      {row.points && <div style={{ textAlign: 'right' }}><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 16, color: A.red }}>{row.points}</div><Mono size={9}>Punts</Mono></div>}
      <Ic name="chevR" size={18} color={A.inkFaint} />
    </div>
  </Card>;
}

/* ── CERCADOR ── */
function OpCercador({ ctx }: { ctx: OCtx }) {
  const [q, setQ] = useState('');
  const trimmed = q.trim();
  // Cerca en viu sobre el catàleg SCT real (mateix índex que el
  // superbuscador). Clicar una fila obre el superbuscador amb tota la
  // informació; "Veure tots" hi porta amb la cerca completa.
  const results = useMemo(() => (trimmed.length >= 2 ? searchCataleg(trimmed) : []), [trimmed]);
  const featured = useMemo(getFeaturedInfraccions, []);
  const openSuper = (query: string) => ctx.nav(query ? `/superbuscador?q=${encodeURIComponent(query)}` : '/superbuscador');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Superbuscador · SCT" title="Troba qualsevol infracció" desc="Cerca per concepte, article, multa o punts a tot el catàleg SCT 2026 (LSV, RGC, RGCond, RGV, Assegurança i CP)." />
      <form onSubmit={(e) => { e.preventDefault(); openSuper(trimmed); }} style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}><Ic name="search" size={20} color={A.purple} /></span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: conduir sense permís, mòbil, 0,30 mg/l…" style={{ width: '100%', border: `2px solid ${A.purple}`, background: A.card, borderRadius: 18, padding: '16px 18px 16px 50px', fontFamily: A.display, fontWeight: 600, fontSize: 17, color: A.ink, outline: 'none', boxShadow: A.shadowMd, boxSizing: 'border-box' }} />
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{['LSV', 'RGC', 'RGCond', 'RGV', 'CP', 'Assegurança'].map((c) => <button key={c} onClick={() => setQ(c)} style={{ cursor: 'pointer', border: 'none', background: A.purpleSoft, color: A.purpleInk, fontFamily: A.mono, fontWeight: 600, fontSize: 12, padding: '7px 13px', borderRadius: 999 }}>{c}</button>)}</div>

      {trimmed.length >= 2 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <RowLabel icon="list">{results.length} {results.length === 1 ? 'resultat' : 'resultats'}</RowLabel>
            {results.length > 0 && <button onClick={() => openSuper(trimmed)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: A.display, fontWeight: 700, fontSize: 13, color: A.purple }}>Veure al superbuscador <Ic name="arrow" size={15} color={A.purple} /></button>}
          </div>
          {results.length === 0 ? (
            <Card pad={26} style={{ textAlign: 'center' }}><Mono color={A.inkMuted}>Cap infracció per «{trimmed}»</Mono></Card>
          ) : (
            results.slice(0, 40).map((row, i) => <InfraccioRow key={i} row={row} onClick={() => openSuper(row.concepte)} />)
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <RowLabel icon="list">Infraccions destacades</RowLabel>
          {featured.map((row, i) => <InfraccioRow key={i} row={row} onClick={() => openSuper(row.concepte)} />)}
        </div>
      )}
    </div>
  );
}

/* ── CATÀLEG SCT (nomenclàtor incrustat) ── */
function OpCataleg() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Head kicker="Catàleg SCT 2026" title="Catàleg d'infraccions de trànsit" desc="Nomenclàtor oficial complet (LSV, RGC, RGCond, RGV, Assegurança i CP) amb article, gravetat, quantia, DTE i punts. Usa el cercador intern per filtrar." />
      <HtmlInline html={catalegRaw} title="Catàleg SCT 2026" />
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
            <span style={{ width: 46, height: 46, borderRadius: 14, background: A.blueSoft, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 22 }}>{m.icon}</span>
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

/* ── PROCEDIMENTS (SC/Penal i Trànsit, separats) ── */
function OpProcediments({ ctx }: { ctx: OCtx }) {
  const groups = [
    { tone: 'blue', icon: 'shield', title: 'Seguretat Ciutadana / Penal', desc: 'Identificació, escorcoll i cacheig, registres, detencions, drets del detingut i violència de gènere.', route: '/operativa/penal', items: ['Identificació', 'Escorcoll i cacheig', 'Detencions · drets', 'VioGén'] },
    { tone: 'terracota', icon: 'car', title: 'Trànsit', desc: "Control d'alcoholèmia i drogues, accidents amb víctimes, retirada de vehicles i atestats.", route: '/operativa/trafico', items: ['Alcoholèmia', 'Drogues', 'Accidents', 'Retirades'] },
  ];
  const refs = [
    { l: 'Drets del detingut', to: '/operativa/penal/drets-detingut' },
    { l: "Taula d'actes", to: '/operativa/penal/taula-actes' },
    { l: 'Taula de drogues', to: '/operativa/penal/taula-drogues' },
    { l: 'Recursos penals', to: '/operativa/penal/recursos' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Head kicker="Procediments pas a pas" title="Procediments d'actuació" desc="Guies operatives per actuar amb seguretat jurídica, separades per àmbit: Seguretat Ciutadana / Penal i Trànsit." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="a-grid-fork">
        {groups.map((g) => { const k = toneOf(g.tone); const dark = g.tone === 'night';
          const bg = dark ? `linear-gradient(150deg, #2A2D40, ${A.night})` : k.solid;
          return <div key={g.title} className="a-hover" onClick={() => ctx.nav(g.route)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: A.rxl, background: bg, color: '#fff', padding: 24, boxShadow: A.shadowMd, minHeight: 210, display: 'flex', flexDirection: 'column' }}>
            <span style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', marginBottom: 14 }}><Ic name={g.icon} size={26} color="#fff" sw={2.1} /></span>
            <h3 style={{ margin: '0 0 6px', fontFamily: A.display, fontWeight: 700, fontSize: 21, letterSpacing: -0.5, lineHeight: 1.15 }}>{g.title}</h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, opacity: 0.92 }}>{g.desc}</p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '16px 0 0' }}>{g.items.map((it) => <span key={it} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 10, padding: '4px 10px', fontFamily: A.mono, fontWeight: 600, fontSize: 11 }}>{it}</span>)}</div>
            <div style={{ marginTop: 'auto', paddingTop: 18 }}><span className="a-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: dark ? A.night : k.solid, borderRadius: 14, padding: '10px 18px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>Obrir procediments <Ic name="arrow" size={15} color={dark ? A.night : k.solid} /></span></div>
          </div>; })}
      </div>
      <div>
        <RowLabel icon="doc">Referència ràpida</RowLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {refs.map((r) => <Card key={r.l} pad={14} hover onClick={() => ctx.nav(r.to)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: A.blueSoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic name="doc" size={18} color={A.blue} sw={2.1} /></span>
            <span style={{ flex: 1, fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink }}>{r.l}</span>
            <Ic name="chevR" size={16} color={A.inkFaint} />
          </Card>)}
        </div>
      </div>
    </div>
  );
}
