import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LLEIS } from '../../data/lleis';

// ─── Theme: modo oscuro institucional Policía Local ─────────────────
const C = {
  bgMain:    '#0A1628',
  bgSection: '#0E2244',
  bgCard:    '#0F2A55',
  bgCard2:   '#142F60',
  line:      'rgba(200,160,40,0.22)',
  line2:     'rgba(255,255,255,0.08)',
  gold:      '#C8A028',
  goldSoft:  '#E2BD3F',
  goldBg:    'rgba(200,160,40,0.10)',
  blue:      '#1A5C96',
  blueSoft:  'rgba(26,92,150,0.22)',
  red:       '#C8281E',
  redSoft:   'rgba(200,40,30,0.18)',
  green:     '#1A7A3C',
  greenSoft: 'rgba(26,122,60,0.20)',
  text:      '#F2EAD3',
  textSoft:  '#C9C2B0',
  textMuted: '#8E897A',
};

const FONT_DISPLAY = "'Oswald', 'Manrope', system-ui, sans-serif";
const FONT_BODY    = "'Source Sans 3', 'Manrope', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ─── Mini chips (badges) ────────────────────────────────────────────
const CHIP_STYLE = {
  info:     { bg: C.blueSoft,   fg: '#9BC4F0', border: 'rgba(26,92,150,0.45)' },
  local:    { bg: C.goldBg,     fg: C.goldSoft, border: 'rgba(200,160,40,0.45)' },
  positivo: { bg: C.greenSoft,  fg: '#74D69A', border: 'rgba(26,122,60,0.45)' },
  negativo: { bg: C.redSoft,    fg: '#F09080', border: 'rgba(200,40,30,0.45)' },
  agravada: { bg: 'rgba(232,154,28,0.18)', fg: '#F2C266', border: 'rgba(232,154,28,0.45)' },
  clave:    { bg: C.goldBg,     fg: C.goldSoft, border: 'rgba(200,160,40,0.45)' },
};

function Chip({ kind = 'info', children }) {
  const s = CHIP_STYLE[kind] || CHIP_STYLE.info;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      background: s.bg, color: s.fg, border: `1px solid ${s.border}`,
      fontFamily: FONT_BODY, fontSize: 11.5, fontWeight: 600,
      letterSpacing: 0.1, lineHeight: 1.3,
    }}>{children}</span>
  );
}

function Note({ kind, text }) {
  const map = {
    agrav: { color: '#F09080', icon: '⚠️', border: 'rgba(200,40,30,0.45)', bg: C.redSoft },
    pol:   { color: '#74D69A', icon: '🚔', border: 'rgba(26,122,60,0.45)', bg: C.greenSoft },
    clave: { color: C.goldSoft, icon: '💡', border: 'rgba(200,160,40,0.45)', bg: C.goldBg },
  }[kind] || { color: C.textSoft, icon: 'ℹ️', border: C.line2, bg: 'rgba(255,255,255,0.04)' };
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      background: map.bg, border: `1px solid ${map.border}`, borderLeft: `3px solid ${map.color}`,
      borderRadius: 8, padding: '8px 10px', marginTop: 8,
    }}>
      <span style={{ fontSize: 13, lineHeight: 1.2, marginTop: 1 }}>{map.icon}</span>
      <span style={{
        fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, lineHeight: 1.45,
      }}>{text}</span>
    </div>
  );
}

function ArtBadge({ children }) {
  return (
    <span style={{
      fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700,
      color: '#0A1628', background: C.gold,
      padding: '3px 8px', borderRadius: 4, letterSpacing: 0.6,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function MiniTabla({ rows }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr',
      border: `1px solid ${C.line2}`, borderRadius: 8, overflow: 'hidden', marginTop: 10,
    }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{ display: 'contents' }}>
          <div style={{
            background: C.bgCard2, color: C.goldSoft,
            padding: '7px 10px', fontFamily: FONT_MONO, fontWeight: 700, fontSize: 11.5,
            borderBottom: i < rows.length - 1 ? `1px solid ${C.line2}` : 'none',
          }}>{k}</div>
          <div style={{
            background: C.bgCard, color: C.text,
            padding: '7px 10px', fontFamily: FONT_BODY, fontSize: 12.5, lineHeight: 1.4,
            borderBottom: i < rows.length - 1 ? `1px solid ${C.line2}` : 'none',
          }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

const TD_COLOR = {
  grave: { bg: 'rgba(200,40,30,0.16)', fg: '#F09080' },
  medio: { bg: 'rgba(232,154,28,0.16)', fg: '#F2C266' },
  leve:  { bg: 'rgba(26,122,60,0.16)',  fg: '#74D69A' },
};

function Tabla({ cols, rows }) {
  const ncols = cols.length;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${ncols}, minmax(0,1fr))`,
      border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden', marginTop: 10,
      fontSize: 12, fontFamily: FONT_BODY,
    }}>
      {cols.map((c, i) => (
        <div key={'h'+i} style={{
          background: C.bgSection, color: C.gold,
          padding: '8px 10px', fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase',
          borderRight: i < ncols - 1 ? `1px solid ${C.line2}` : 'none',
          borderBottom: `1px solid ${C.line}`,
        }}>{c}</div>
      ))}
      {rows.map((row, ri) => {
        const cells = row.slice(0, ncols);
        const tone = row[ncols]; // optional tone tag at end
        const tc = tone ? TD_COLOR[tone] : null;
        return cells.map((cell, ci) => (
          <div key={`${ri}-${ci}`} style={{
            background: tc ? tc.bg : (ri % 2 ? C.bgCard2 : C.bgCard),
            color: tc ? tc.fg : C.text,
            padding: '8px 10px', lineHeight: 1.4,
            borderRight: ci < ncols - 1 ? `1px solid ${C.line2}` : 'none',
            borderBottom: ri < rows.length - 1 ? `1px solid ${C.line2}` : 'none',
            fontWeight: ci === 0 ? 700 : 500,
          }}>{cell}</div>
        ));
      })}
    </div>
  );
}

// ─── Block renderer ─────────────────────────────────────────────────
function Block({ b }) {
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.line2}`, borderLeft: `3px solid ${C.gold}`,
      borderRadius: 10, padding: '12px 14px', marginTop: 10,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <ArtBadge>{b.art}</ArtBadge>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600,
          color: C.text, letterSpacing: 0.3, textTransform: 'uppercase', lineHeight: 1.2,
        }}>{b.title}</span>
      </div>
      {b.body && <p style={{
        margin: '4px 0 0', fontFamily: FONT_BODY, fontSize: 13, color: C.textSoft, lineHeight: 1.5,
      }}>{b.body}</p>}
      {b.chips && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {b.chips.map((c, i) => <Chip key={i} kind={c.kind}>{c.label}</Chip>)}
        </div>
      )}
      {b.mini && <MiniTabla rows={b.mini} />}
      {b.tabla && <Tabla cols={b.tabla.cols} rows={b.tabla.rows} />}
      {b.notes && b.notes.map((n, i) => <Note key={i} kind={n.kind} text={n.text} />)}
    </div>
  );
}

// ─── Section header ─────────────────────────────────────────────────
function CatHeader({ s, open, onClick }) {
  const isDisc  = s.isDisciplinario;
  const isLocal = s.isLocal;
  const bg     = isDisc ? C.red : (isLocal ? C.gold : C.bgSection);
  const fg     = isDisc || isLocal ? '#0A1628' : C.gold;
  const border = isDisc ? 'rgba(200,40,30,0.6)' : (isLocal ? 'rgba(200,160,40,0.6)' : C.line);

  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 10,
      background: bg, border: `1px solid ${border}`, borderRadius: 10,
      padding: '10px 12px', color: fg,
      transition: 'background .15s',
    }}>
      <span style={{
        fontFamily: FONT_MONO, fontWeight: 800, fontSize: 12,
        background: isDisc || isLocal ? 'rgba(10,22,40,0.18)' : C.goldBg,
        color: isDisc || isLocal ? '#0A1628' : C.gold,
        padding: '3px 7px', borderRadius: 4, letterSpacing: 0.6,
      }}>{s.num}</span>
      <span style={{ fontSize: 17, lineHeight: 1 }}>{s.icon}</span>
      <span style={{
        flex: 1, fontFamily: FONT_DISPLAY, fontSize: 14,
        fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: 1.2,
      }}>{s.title}</span>
      <span style={{
        fontFamily: FONT_MONO, fontSize: 10.5, opacity: 0.75, whiteSpace: 'nowrap',
      }}>{s.arts}</span>
      <span style={{
        marginLeft: 4, fontSize: 14, transition: 'transform .2s',
        transform: open ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block',
      }}>▾</span>
    </button>
  );
}

// ─── Hero · escudo + senyera + título ────────────────────────────────
function Hero({ data }) {
  return (
    <div style={{
      background: C.bgSection, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: '18px 16px 16px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Senyera 2 franjas finas */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 4,
        background: `linear-gradient(180deg, ${C.gold} 0%, ${C.gold} 50%, transparent 50%, transparent 56%, ${C.gold} 56%, ${C.gold} 100%)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
        {/* Escudo PL SVG */}
        <svg width="56" height="64" viewBox="0 0 80 92" style={{ flexShrink: 0 }}>
          <path d="M40 4 L74 13 V42 C74 62 60 78 40 88 C20 78 6 62 6 42 V13 Z" fill="#0A1628" stroke={C.gold} strokeWidth="2"/>
          <text x="40" y="38" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="9" fill={C.gold} letterSpacing="1">POLICIA</text>
          <text x="40" y="48" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="9" fill={C.gold} letterSpacing="1">LOCAL</text>
          <g transform="translate(28 56)" fill={C.gold}>
            <polygon points="6,0 7.4,4.2 12,4.2 8.3,6.8 9.7,11 6,8.4 2.3,11 3.7,6.8 0,4.2 4.6,4.2"/>
            <polygon points="18,0 19.4,4.2 24,4.2 20.3,6.8 21.7,11 18,8.4 14.3,11 15.7,6.8 12,4.2 16.6,4.2"/>
          </g>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, color: C.gold,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
          }}>{data.subtitle}</div>
          <h1 style={{
            margin: '4px 0 2px', fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 22, letterSpacing: 0.6, textTransform: 'uppercase',
            color: C.text, lineHeight: 1.05,
          }}>
            LLEI <span style={{ color: C.gold }}>16/1991</span>
          </h1>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 600,
            color: C.textSoft, letterSpacing: 0.6, textTransform: 'uppercase',
          }}>{data.title}</div>
        </div>
      </div>

      <div style={{
        marginTop: 12, fontFamily: FONT_BODY, fontSize: 12, color: C.textSoft, lineHeight: 1.45,
      }}>{data.meta}</div>

      <div style={{
        marginTop: 10, padding: '10px 12px',
        background: C.blueSoft, border: '1px solid rgba(26,92,150,0.45)', borderRadius: 8,
        fontFamily: FONT_BODY, fontSize: 12, color: '#9BC4F0', lineHeight: 1.45,
      }}>
        🏛️ {data.basis}
      </div>

      <div style={{
        marginTop: 8, fontFamily: FONT_MONO, fontSize: 11, color: C.textMuted, letterSpacing: 0.6,
      }}>{data.stats}</div>
    </div>
  );
}

// ─── 4 Escalas · clas-cards ──────────────────────────────────────────
const CLAS_TONE = {
  sup:   { color: C.gold,    bg: 'rgba(200,160,40,0.15)' },
  ejec:  { color: '#9BC4F0', bg: 'rgba(26,92,150,0.18)' },
  inter: { color: '#F2C266', bg: 'rgba(232,154,28,0.16)' },
  bas:   { color: '#74D69A', bg: 'rgba(26,122,60,0.16)' },
};

function Escalas({ data }) {
  return (
    <div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
        letterSpacing: 0.8, textTransform: 'uppercase',
        color: C.gold, margin: '4px 0 8px',
      }}>📋 Las 4 Escalas y 7 Categorías</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {data.escalas.map(e => {
          const tone = CLAS_TONE[e.key];
          return (
            <div key={e.key} style={{
              background: tone.bg, border: `1px solid ${tone.color}55`, borderLeft: `3px solid ${tone.color}`,
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{e.icon}</span>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13,
                  letterSpacing: 0.6, textTransform: 'uppercase', color: tone.color,
                }}>{e.name}</span>
                <span style={{
                  marginLeft: 'auto', fontFamily: FONT_MONO, fontWeight: 700,
                  fontSize: 10.5, color: '#0A1628', background: tone.color,
                  padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5,
                }}>{e.grupo}</span>
              </div>
              <div style={{
                marginTop: 4, fontFamily: FONT_BODY, fontSize: 11.5,
                color: C.textSoft, lineHeight: 1.4,
              }}>{e.cats}</div>
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 10, padding: '10px 12px',
        background: C.goldBg, border: `1px solid ${C.line}`, borderRadius: 8,
        fontFamily: FONT_BODY, fontSize: 12, color: C.text, lineHeight: 1.45,
      }}>
        🚔 <b style={{ color: C.gold }}>Disposición adicional 7ª:</b> {data.bannerEAC}
      </div>
    </div>
  );
}

// ─── Recuerda ────────────────────────────────────────────────────────
function Recuerda({ items }) {
  return (
    <div style={{
      background: `linear-gradient(180deg, rgba(200,160,40,0.20), rgba(200,160,40,0.05))`,
      border: `1px solid ${C.gold}`, borderRadius: 12,
      padding: '14px 14px 12px', marginTop: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
      }}>
        <span style={{ fontSize: 18 }}>📋</span>
        <span style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
          color: C.gold, letterSpacing: 1, textTransform: 'uppercase',
        }}>RECUERDA · Claves Llei 16/1991</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((t, i) => (
          <li key={i} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 8,
            padding: '6px 0', borderTop: i ? `1px solid rgba(200,160,40,0.25)` : 'none',
          }}>
            <span style={{
              fontFamily: FONT_MONO, color: C.gold, fontSize: 11, fontWeight: 700, marginTop: 2,
            }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────
export default function ScreenLlei() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = LLEIS[id] || LLEIS['16-1991'];

  const [openMap, setOpenMap] = useState(() => {
    const m = {};
    data.secciones.forEach(s => { m[s.id] = !!s.open; });
    return m;
  });

  const toggle = (id) => setOpenMap(m => ({ ...m, [id]: !m[id] }));

  return (
    <div style={{
      minHeight: '100dvh', background: C.bgMain, color: C.text,
      fontFamily: FONT_BODY, paddingBottom: 100,
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(10,22,40,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.line2}`,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 'env(safe-area-inset-top, 8px) 14px 8px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width: 34, height: 34, borderRadius: 999, border: `1px solid ${C.line2}`,
          background: C.bgSection, color: C.text, cursor: 'pointer',
          display: 'grid', placeItems: 'center', fontFamily: FONT_BODY,
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 9.5, color: C.gold,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
          }}>Lleis · Catalunya</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700,
            letterSpacing: 0.4, color: C.text,
          }}>LLEI <span style={{ color: C.gold }}>16/1991</span></div>
        </div>
        <button onClick={() => window.print && window.print()} title="Imprimir" style={{
          height: 34, padding: '0 12px', borderRadius: 999, border: `1px solid ${C.gold}`,
          background: C.goldBg, color: C.gold, cursor: 'pointer',
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}>🖨 Imprimir</button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 14px 0' }}>
        <Hero data={data} />

        <div style={{ height: 14 }} />
        <Escalas data={data} />

        <div style={{ height: 14 }} />

        {/* Secciones colapsables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.secciones.map(s => {
            const open = openMap[s.id];
            return (
              <section key={s.id}>
                <CatHeader s={s} open={open} onClick={() => toggle(s.id)} />
                {open && (
                  <div style={{ padding: '4px 2px 0' }}>
                    {s.blocks.map((b, i) => <Block key={i} b={b} />)}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <Recuerda items={data.recuerda} />

        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 18,
        }}>
          <button onClick={() => navigate('/operativa')} style={{
            background: C.bgSection, border: `1px solid ${C.line2}`, color: C.text,
            borderRadius: 999, padding: '10px 14px', fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', cursor: 'pointer',
          }}>← Operativa</button>
          <button onClick={() => navigate('/academia/test')} style={{
            background: C.gold, border: 'none', color: '#0A1628',
            borderRadius: 999, padding: '10px 16px', fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
          }}>Test del tema →</button>
        </div>
      </div>
    </div>
  );
}
