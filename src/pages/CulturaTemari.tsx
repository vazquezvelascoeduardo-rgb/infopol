// Cultura General · Temari de repàs (fitxa d'estudi).
// Rèplica del disseny de Claude Design: 16 àrees, ~400 fets, cerca,
// índex lateral sticky i pills de salt ràpid. Contingut en castellà
// (és el temari), chrome en català. S'integra dins el Layout de l'app
// (per això no replica la capçalera/topbar del prototip).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { CULTURA_AREAS, type CulturaArea, type CulturaBlock } from '../data/cultura-temari';

const PAPER = '#f0eee9';
const INK = '#13131A';
const INK_SOFT = '#3A3A45';
const INK_MUTED = '#7A7A85';
const HAIR = 'rgba(19,19,26,0.08)';
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type Pal = { solid: string; soft: string; ink: string };
const PALETTE: Record<string, Pal> = {
  anatomia: { solid: '#E0556A', soft: '#FBDDE2', ink: '#7A1B2B' },
  ciencia: { solid: '#0BB4C2', soft: '#CCEEF1', ink: '#0A4F56' },
  astronomia: { solid: '#6A5AE0', soft: '#E2DEFB', ink: '#2E2480' },
  geografia: { solid: '#1FB286', soft: '#CDF0E1', ink: '#0B5A3D' },
  historia: { solid: '#FF7A1A', soft: '#FFE0CB', ink: '#7A2E04' },
  institucions: { solid: '#3B6BF5', soft: '#D8E2FE', ink: '#0E2B7A' },
  invents: { solid: '#E89421', soft: '#FBE7C2', ink: '#6B3F08' },
  literatura: { solid: '#9C4FE0', soft: '#EBDAFB', ink: '#4A1B7A' },
  arquitectura: { solid: '#B5852A', soft: '#F2E6C4', ink: '#5C4209' },
  pintura: { solid: '#D14D8B', soft: '#FAD9EA', ink: '#73164A' },
  musica: { solid: '#5856D6', soft: '#DEDDF7', ink: '#262585' },
  personatges: { solid: '#C2960A', soft: '#FBEEBE', ink: '#5C4400' },
  cinema: { solid: '#4A5B72', soft: '#DCE3EC', ink: '#1E2A3A' },
  politica: { solid: '#C0392B', soft: '#F6D5D0', ink: '#6E160D' },
  esport: { solid: '#5B9E2D', soft: '#DDEFC9', ink: '#2C4F12' },
  altres: { solid: '#6B7C3B', soft: '#E8EDD4', ink: '#39431B' },
};

type AreaX = CulturaArea & { c: Pal; n: number; count: number };

// ─── Icones (subconjunt necessari, stroke-based) ───────────────────
function Icon({ name, size = 22, color = 'currentColor', sw = 2 }: { name: string; size?: number; color?: string; sw?: number }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'heart': return (<svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>);
    case 'beaker': return (<svg {...common}><path d="M9 3h6" /><path d="M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3" /></svg>);
    case 'star': return (<svg {...common}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.5 1.1 6.4L12 17.5 6.5 20.5l1.1-6.4L3 9.6l6.3-.9L12 3z" /></svg>);
    case 'map': return (<svg {...common}><path d="M9 3l-6 2v16l6-2 6 2 6-2V3l-6 2z" /><path d="M9 3v16M15 5v16" /></svg>);
    case 'flag': return (<svg {...common}><path d="M5 3v18" /><path d="M5 4h12l-2 4 2 4H5" /></svg>);
    case 'briefcase': return (<svg {...common}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>);
    case 'bolt': return (<svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>);
    case 'book': return (<svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z" /><path d="M8 7h7M8 11h7" /></svg>);
    case 'home': return (<svg {...common}><path d="M3 11l9-8 9 8" /><path d="M5 9v12h14V9" /></svg>);
    case 'pen': return (<svg {...common}><path d="M16 3l5 5L8 21H3v-5L16 3z" /></svg>);
    case 'mic': return (<svg {...common}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>);
    case 'user': return (<svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 5-6 8-6s7 2 8 6" /></svg>);
    case 'play': return (<svg {...common}><path d="M6 4l14 8-14 8V4z" fill={color} stroke="none" /></svg>);
    case 'scale': return (<svg {...common}><path d="M12 4v17M4 8h16" /><path d="M7 8l-3 7a3 3 0 0 0 6 0l-3-7zM17 8l-3 7a3 3 0 0 0 6 0l-3-7z" /></svg>);
    case 'trophy': return (<svg {...common}><path d="M8 4h8v5a4 4 0 0 1-8 0V4z" /><path d="M5 5h3M16 5h3M9 14v3h6v-3M8 20h8" /></svg>);
    case 'hash': return (<svg {...common}><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" /></svg>);
    case 'search': return (<svg {...common}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>);
    case 'x': return (<svg {...common}><path d="M6 6l12 12M18 6L6 18" /></svg>);
    case 'arrow-left': return (<svg {...common}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
    case 'arrow-right': return (<svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    default: return (<svg {...common}><circle cx="12" cy="12" r="9" /></svg>);
  }
}

// ─── Comptar fets per àrea ─────────────────────────────────────────
function countItems(area: CulturaArea): number {
  let n = 0;
  for (const b of area.blocks) {
    if (b.k === 'defs' || b.k === 'records' || b.k === 'quotes') n += b.items.length;
    else if (b.k === 'table') n += b.rows.length;
    else if (b.k === 'chips') n += b.items.length;
    else if (b.k === 'works') n += b.items.reduce((s, it) => s + it.w.length, 0);
  }
  return n;
}

const AREAS: AreaX[] = CULTURA_AREAS.map((a, i) => ({
  ...a, c: PALETTE[a.id], n: i + 1, count: countItems(a),
}));
const TOTAL_FACTS = AREAS.reduce((s, a) => s + a.count, 0);

// ─── Cerca: text d'un bloc ─────────────────────────────────────────
function blockText(b: CulturaBlock): string {
  if (b.k === 'defs' || b.k === 'quotes') return (b.title || '') + ' ' + b.items.map((it) => it.join(' ')).join(' ');
  if (b.k === 'records') return (b.title || '') + ' ' + b.items.map((it) => it.join(' ')).join(' ');
  if (b.k === 'table') return (b.title || '') + ' ' + b.head.join(' ') + ' ' + b.rows.map((r) => r.join(' ')).join(' ');
  if (b.k === 'chips') return (b.title || '') + ' ' + b.items.join(' ');
  if (b.k === 'works') return (b.title || '') + ' ' + b.items.map((it) => it.n + ' ' + (it.m || '') + ' ' + it.w.join(' ')).join(' ');
  return '';
}
function filterBlock(b: CulturaBlock, q: string): CulturaBlock | null {
  if (b.k === 'sub') return null;
  if (!blockText(b).toLowerCase().includes(q)) return null;
  if ((b.title || '').toLowerCase().includes(q)) return b;
  const within = <T,>(arr: T[], fn: (x: T) => boolean): T[] => { const f = arr.filter(fn); return f.length ? f : arr; };
  if (b.k === 'defs') return { ...b, items: within(b.items, (it) => it.join(' ').toLowerCase().includes(q)) };
  if (b.k === 'records') return { ...b, items: within(b.items, (it) => it.join(' ').toLowerCase().includes(q)) };
  if (b.k === 'quotes') return { ...b, items: within(b.items, (it) => it.join(' ').toLowerCase().includes(q)) };
  if (b.k === 'table') return { ...b, rows: within(b.rows, (r) => r.join(' ').toLowerCase().includes(q)) };
  if (b.k === 'chips') return { ...b, items: within(b.items, (it) => it.toLowerCase().includes(q)) };
  if (b.k === 'works') return { ...b, items: within(b.items, (it) => (it.n + ' ' + (it.m || '') + ' ' + it.w.join(' ')).toLowerCase().includes(q)) };
  return b;
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 18, border: `1px solid ${HAIR}`,
  padding: 22, boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 6px 18px rgba(19,19,26,0.05)',
};

function BlockTitle({ children, c }: { children?: string; c: Pal }) {
  if (!children) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 7, height: 7, borderRadius: 2, background: c.solid, transform: 'rotate(45deg)' }} />
      <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: c.ink }}>{children}</span>
    </div>
  );
}

function renderBlock(b: CulturaBlock, i: number, c: Pal) {
  switch (b.k) {
    case 'sub':
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0 4px' }}>
          <span style={{ fontSize: 19, fontWeight: 900, color: c.solid, letterSpacing: -0.3 }}>{b.label}</span>
          <span style={{ flex: 1, height: 1, background: `${c.solid}33` }} />
        </div>
      );
    case 'defs':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 0 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 9, height: 9, borderRadius: 5, background: c.solid, marginTop: 7, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: INK, letterSpacing: -0.2, lineHeight: 1.3 }}>{it[0]}</div>
                  <div style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.45, marginTop: 2 }}>{it[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'records':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ padding: '14px 16px', borderRadius: 14, background: PAPER, border: `1px solid ${HAIR}`, borderLeft: `3px solid ${c.solid}` }}>
                <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: INK_MUTED, lineHeight: 1.35 }}>{it[0]}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.ink, letterSpacing: -0.6, marginTop: 5, lineHeight: 1.05 }}>{it[1]}</div>
                {it[2] && <div style={{ fontSize: 12, color: INK_SOFT, marginTop: 4, lineHeight: 1.35 }}>{it[2]}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    case 'table':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ overflow: 'hidden', borderRadius: 12, border: `1px solid ${HAIR}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>{b.head.map((h, k) => (
                  <th key={k} style={{ textAlign: 'left', padding: '11px 16px', background: c.soft, color: c.ink, fontWeight: 800, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', fontFamily: MONO, borderBottom: `1px solid ${c.solid}22` }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri} style={{ background: ri % 2 ? PAPER : '#fff' }}>
                    {r.map((cell, ci) => (
                      <td key={ci} style={{ padding: '10px 16px', color: ci === 0 ? INK : INK_SOFT, fontWeight: ci === 0 ? 700 : 500, borderTop: ri ? `1px solid ${HAIR}` : 'none', lineHeight: 1.4 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'chips':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {b.items.map((it, j) => (
              <span key={j} style={{ padding: '7px 13px', borderRadius: 999, background: c.soft, color: c.ink, fontSize: 13, fontWeight: 700, border: `1px solid ${c.solid}22` }}>{it}</span>
            ))}
          </div>
        </div>
      );
    case 'works':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ padding: '14px 16px', borderRadius: 14, background: PAPER, border: `1px solid ${HAIR}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: INK, letterSpacing: -0.3 }}>{it.n}</span>
                  {it.m && <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: c.ink, background: c.soft, padding: '2px 7px', borderRadius: 5, letterSpacing: 0.4 }}>{it.m}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {it.w.map((w, wi) => (
                    <div key={wi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: c.solid, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.35 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'quotes':
      return (
        <div key={i} style={cardStyle}>
          <BlockTitle c={c}>{b.title}</BlockTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ padding: '18px 20px', borderRadius: 14, background: c.soft, border: `1px solid ${c.solid}22`, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 4, left: 14, fontSize: 44, fontWeight: 900, color: c.solid, opacity: 0.32, lineHeight: 1, fontFamily: 'Georgia, serif' }}>“</span>
                <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: c.ink, lineHeight: 1.4, letterSpacing: -0.2, position: 'relative', paddingLeft: 18 }}>{it[0]}</p>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: c.ink, opacity: 0.7, paddingLeft: 18, textTransform: 'uppercase', letterSpacing: 0.6 }}>— {it[1]}</div>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

function AreaHeader({ area }: { area: AreaX }) {
  const c = area.c;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
      <span style={{ width: 52, height: 52, borderRadius: 14, background: c.soft, display: 'grid', placeItems: 'center', border: `1px solid ${c.solid}22`, flexShrink: 0 }}>
        <Icon name={area.icon} size={26} color={c.solid} sw={2.2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 800, color: c.solid, letterSpacing: 1.4 }}>{String(area.n).padStart(2, '0')}</span>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.7, color: INK, lineHeight: 1.05 }}>{area.es}</h2>
        </div>
        <div style={{ fontSize: 14.5, color: INK_SOFT, fontWeight: 500, marginTop: 3 }}>{area.blurb}</div>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: c.ink, background: c.soft, padding: '5px 11px', borderRadius: 999, letterSpacing: 0.6, flexShrink: 0 }}>{area.count} fets</span>
    </div>
  );
}

function AreaSection({ area, query }: { area: AreaX; query: string }) {
  let blocks = area.blocks;
  if (query) {
    blocks = area.blocks.map((b) => filterBlock(b, query)).filter(Boolean) as CulturaBlock[];
    if (!blocks.length) return null;
  }
  return (
    <section id={`area-${area.id}`} style={{ padding: '34px 0 8px', scrollMarginTop: 92 }}>
      <AreaHeader area={area} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {blocks.map((b, i) => renderBlock(b, i, area.c))}
      </div>
    </section>
  );
}

export default function CulturaTemari() {
  const { t } = useT();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(AREAS[0].id);
  const q = query.trim().toLowerCase();

  const onSection = (id: string) => {
    setActive(id);
    const el = document.getElementById(`area-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  useEffect(() => {
    if (q) return;
    const onScroll = () => {
      let cur = AREAS[0].id;
      for (const a of AREAS) {
        const el = document.getElementById(`area-${a.id}`);
        if (el && el.getBoundingClientRect().top < 220) cur = a.id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [q]);

  const visible = useMemo(
    () => (q ? AREAS.filter((a) => a.blocks.some((b) => filterBlock(b, q))) : AREAS),
    [q],
  );

  return (
    <div className="shell pb-10" style={{ background: PAPER }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/cultura-general">{t('cultura.title')}</Link>
        <span className="sep">/</span>
        <span className="here">Temari de repàs</span>
      </nav>

      {/* HERO */}
      <header style={{ padding: '8px 0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#FFE0CB', color: '#7A2E04', fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#FF7A1A' }} /> CONEIXEMENTS
          </span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: INK_MUTED, letterSpacing: 1.4, textTransform: 'uppercase' }}>FITXA DE REPÀS</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(34px, 7vw, 58px)', fontWeight: 900, letterSpacing: -1.8, lineHeight: 1.0, color: INK }}>
          Cultura <span style={{ color: '#FF7A1A' }}>general</span>
        </h1>
        <p style={{ margin: '14px 0 0', fontSize: 18, color: INK_SOFT, maxWidth: 680, lineHeight: 1.5 }}>
          Tot el temari de cultura condensat en una sola fitxa: <strong>{AREAS.length} àrees</strong> i més de <strong>{Math.round(TOTAL_FACTS / 10) * 10} fets clau</strong> organitzats per repassar de pressa abans del test.
        </p>
        <div style={{ display: 'flex', gap: 26, marginTop: 18, flexWrap: 'wrap' }}>
          <HeroStat n={String(AREAS.length)} l="àrees temàtiques" />
          <HeroStat n={`${TOTAL_FACTS}+`} l="dades per memoritzar" />
          <HeroStat n="9" l="taules de referència" />
          <HeroStat n="~ 60 min" l="lectura completa" mono />
        </div>

        {/* Cercador */}
        <div style={{ marginTop: 22, maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', borderRadius: 999, background: '#fff', border: `1px solid ${HAIR}` }}>
            <Icon name="search" size={16} color={INK_MUTED} sw={2.2} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca un fet, nom, data, concepte…"
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: INK }} />
            {query && (
              <button onClick={() => setQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 }}>
                <Icon name="x" size={15} color={INK_MUTED} sw={2.4} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Pills de salt per àrea */}
      {!q && (
        <div style={{ padding: '18px 0 4px', borderBottom: `1px solid ${HAIR}` }}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: INK_MUTED, marginBottom: 12 }}>SALTA A UNA ÀREA</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 16 }}>
            {AREAS.map((a) => (
              <button key={a.id} onClick={() => onSection(a.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 13px',
                borderRadius: 999, background: a.c.soft, color: a.c.ink, border: `1px solid ${a.c.solid}22`,
                cursor: 'pointer', fontWeight: 800, fontSize: 13,
              }}>
                <Icon name={a.icon} size={15} color={a.c.solid} sw={2.3} />
                {a.ca}
                <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, opacity: 0.6 }}>{a.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div style={{ padding: '16px 0 0', fontSize: 14, color: INK_SOFT }}>
          <strong style={{ color: INK }}>{visible.length}</strong> {visible.length === 1 ? 'àrea' : 'àrees'} amb coincidències per “{query}”.
        </div>
      )}

      {/* Contingut + índex lateral */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {visible.length ? (
            visible.map((a) => <AreaSection key={a.id} area={a} query={q} />)
          ) : (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>Cap resultat per “{query}”.</div>
              <div style={{ fontSize: 15, color: INK_SOFT, marginTop: 6 }}>Prova amb un altre nom, data o concepte.</div>
            </div>
          )}

          {/* CTA final → test */}
          {!q && (
            <div style={{ padding: '20px 0 8px' }}>
              <div style={{ padding: '26px 30px', borderRadius: 20, background: INK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>LLEST PER COMPROVAR-HO?</div>
                  <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginTop: 5 }}>Posa a prova la teva cultura general</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Preguntes tipus test de totes les àrees barrejades.</div>
                </div>
                <Link to="/cultura-general/tot" style={{ padding: '14px 24px', borderRadius: 999, background: '#FF7A1A', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 16, letterSpacing: -0.2, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 -3px 0 rgba(0,0,0,0.18) inset' }}>
                  Començar el test <Icon name="arrow-right" size={18} color="#fff" sw={2.4} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Índex lateral sticky (desktop) */}
        {!q && (
          <aside className="hidden lg:block no-scroll" style={{ position: 'sticky', top: 92, alignSelf: 'flex-start', width: 220, flexShrink: 0, padding: '34px 0 24px', maxHeight: 'calc(100vh - 92px)', overflowY: 'auto' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: INK_MUTED, marginBottom: 12 }}>ÍNDEX · {AREAS.length} ÀREES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {AREAS.map((a) => {
                const on = active === a.id;
                return (
                  <button key={a.id} onClick={() => onSection(a.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
                    background: on ? a.c.soft : 'transparent', color: on ? a.c.ink : INK,
                    border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: on ? 800 : 600, fontSize: 13.5,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: a.c.solid, flexShrink: 0, opacity: on ? 1 : 0.55 }} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.ca}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function HeroStat({ n, l, mono }: { n: string; l: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontFamily: mono ? MONO : undefined, fontSize: 24, fontWeight: 900, color: INK, letterSpacing: -0.5 }}>{n}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: INK_SOFT }}>{l}</span>
    </div>
  );
}
