import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar } from '../../components/Shared';
import { LLEIS } from '../../data/lleis';

const TABS = [
  { id: 'resum',       label: 'Resum' },
  { id: 'cronologia',  label: 'Cronologia' },
  { id: 'estructura',  label: 'Estructura' },
  { id: 'funcions',    label: 'Funcions · art. 11' },
  { id: 'principis',   label: 'Principis' },
  { id: 'operativa',   label: 'Operativa PL' },
  { id: 'reformes',    label: 'Reformes' },
];

function Crumbs({ here }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
      fontSize: 12, color: T.inkMuted, fontWeight: 600,
      overflowX: 'auto', whiteSpace: 'nowrap',
    }}>
      <span style={{ color: T.cat.academia.solid }}>Inici</span>
      <span style={{ color: T.inkFaint }}>/</span>
      <span style={{ color: T.cat.academia.solid }}>Lleis</span>
      <span style={{ color: T.inkFaint }}>/</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: T.cat.leyes.solid }} />
        <span style={{ color: T.cat.academia.solid }}>16/91</span>
      </span>
      <span style={{ color: T.inkFaint }}>/</span>
      <span style={{ color: T.ink }}>{here}</span>
    </div>
  );
}

function ShieldSVG() {
  // Escut estil PL (model ce1978)
  return (
    <svg width="64" height="74" viewBox="0 0 80 92" fill="none" style={{ flexShrink: 0 }}>
      <path d="M40 4 L74 13 V42 C74 62 60 78 40 88 C20 78 6 62 6 42 V13 Z" fill="#1f2a44" stroke="#E89A1C" strokeWidth="2"/>
      <text x="40" y="38" textAnchor="middle" fontFamily={T.fontDisplay} fontWeight="800" fontSize="9" fill="#E89A1C" letterSpacing="1">POLICIA</text>
      <text x="40" y="48" textAnchor="middle" fontFamily={T.fontDisplay} fontWeight="800" fontSize="9" fill="#E89A1C" letterSpacing="1">LOCAL</text>
      <g transform="translate(28 56)" fill="#E89A1C">
        <polygon points="6,0 7.4,4.2 12,4.2 8.3,6.8 9.7,11 6,8.4 2.3,11 3.7,6.8 0,4.2 4.6,4.2"/>
        <polygon points="18,0 19.4,4.2 24,4.2 20.3,6.8 21.7,11 18,8.4 14.3,11 15.7,6.8 12,4.2 16.6,4.2"/>
      </g>
    </svg>
  );
}

function Eyebrow({ children, color = '#9c7a1f', style = {} }) {
  return (
    <div style={{
      fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
      letterSpacing: 1.6, textTransform: 'uppercase', color, ...style,
    }}>{children}</div>
  );
}

function SectionHead({ kicker, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px 10px' }}>
      <span style={{ width: 6, height: 16, borderRadius: 3, background: accent }} />
      <Eyebrow color={accent}>{kicker}</Eyebrow>
      <span style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  );
}

function Hero({ data }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'center',
        background: 'linear-gradient(180deg, #FBF1D6 0%, #FAEAC1 100%)',
        border: '1px solid #E8C97A', borderRadius: T.r.lg, padding: '18px 16px',
      }}>
        <ShieldSVG />
        <div>
          <Eyebrow>Esquema operatiu policial</Eyebrow>
          <h1 style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.6, lineHeight: 1.1, margin: '4px 0 4px',
          }}>
            LLEI <span style={{ color: '#9c7a1f' }}>16/1991</span>
          </h1>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#6b5a30', letterSpacing: -0.1 }}>
            Policies Locals de Catalunya
          </div>
        </div>
      </div>

      <p style={{ margin: '12px 4px 10px', color: T.inkSoft, fontSize: 13.5, lineHeight: 1.45 }}>{data.sub}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {data.stats.map((s, i) => (
          <span key={i} style={{
            background: '#fff', border: '1px solid #E8C97A',
            padding: '5px 10px', borderRadius: 999,
            fontSize: 11.5, fontWeight: 700, color: '#6b5a30',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <span>{s.icon}</span>{s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Pillars({ pillars }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gap: 10 }}>
      {pillars.map((p, i) => (
        <div key={i} style={{
          background: p.bg, border: `1px solid ${p.accent}`, borderRadius: T.r.md,
          padding: '14px 16px',
        }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>{p.icon}</div>
          <h3 style={{
            margin: '6px 0 2px', fontSize: 14, fontWeight: 800,
            color: p.accent, letterSpacing: 0.6,
          }}>{p.title}</h3>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.2 }}>{p.meta}</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: T.ink, marginTop: 6 }}>{p.art}</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

function MetaStrip({ data }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: '#EAF1FE', border: '1px solid #b9d0f6', borderRadius: T.r.md,
        padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center',
      }}>
        <div>
          <Eyebrow color="#2F6BD8" style={{ fontSize: 9.5 }}>📘 LL 16/1991 · 53 ARTS · 5 TÍTOLS</Eyebrow>
          <p style={{ margin: '4px 0 0', color: '#1f3f7a', fontSize: 12.5, lineHeight: 1.4 }}>
            {data.publishedAtLong}. Marc fonamental de la PL a Catalunya.
          </p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '6px 10px', background: '#fff', border: '1px solid #b9d0f6', borderRadius: 10,
          minWidth: 80,
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{data.publishedAt}</div>
          <div style={{ fontWeight: 800, color: '#2F6BD8', fontSize: 13 }}>{data.state}</div>
        </div>
      </div>
    </div>
  );
}

function Cronologia({ items }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: '#fff', border: `1px solid ${T.hairline}`,
        borderRadius: T.r.md, padding: '14px 14px 12px',
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>⏰</span>
          <Eyebrow style={{ fontSize: 11 }}>Cronologia · Llei 16/91</Eyebrow>
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: '0 0 0 4px', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 9, top: 6, bottom: 6, width: 2,
            background: 'linear-gradient(180deg, #E89A1C, #FBE5B5)', borderRadius: 2,
          }} />
          {items.map((it, i) => (
            <li key={i} style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12,
              padding: '6px 0', alignItems: 'start', position: 'relative',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: 999,
                background: it.highlight ? T.cat.academia.solid : '#E89A1C',
                border: '3px solid #fff',
                boxShadow: it.highlight
                  ? `0 0 0 1px ${T.cat.academia.solid}, 0 0 0 5px rgba(255,122,26,.18)`
                  : '0 0 0 1px #E89A1C',
                marginTop: 4, marginLeft: 4, zIndex: 1,
              }} />
              <div>
                <div style={{
                  fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
                  color: it.highlight ? T.cat.academia.solid : '#9c7a1f', letterSpacing: 0.6,
                }}>{it.date}</div>
                <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 1, lineHeight: 1.4 }}>{it.text}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Estructura({ titols }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gap: 8 }}>
      {titols.map(t => (
        <div key={t.id} style={{
          background: '#fff', border: `1px solid ${T.hairline}`,
          borderLeft: `3px solid ${t.accent}`, borderRadius: T.r.md,
          padding: '12px 14px', boxShadow: T.shadow.card,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontFamily: T.fontMono, fontSize: 11, fontWeight: 800,
              color: t.accent, background: `color-mix(in oklab, ${t.accent} 12%, white)`,
              padding: '3px 8px', borderRadius: 6, letterSpacing: 0.6,
            }}>TÍT. {t.id}</span>
            <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.inkMuted }}>{t.arts}</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>{t.name}</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
        </div>
      ))}
    </div>
  );
}

function FuncionsList({ items }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: T.r.md,
        padding: '8px 6px', boxShadow: T.shadow.card,
      }}>
        {items.map((txt, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 10px',
            borderBottom: i < items.length - 1 ? `1px solid ${T.hairline}` : 'none',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              background: T.cat.leyes.soft, color: T.cat.leyes.ink,
              display: 'grid', placeItems: 'center', flexShrink: 0,
              fontFamily: T.fontMono, fontWeight: 800, fontSize: 11,
            }}>{String.fromCharCode(97 + i)}</div>
            <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.45 }}>{txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrincipisGrid({ items }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gap: 8 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          background: '#F8FBFF', border: '1px solid #b9d0f6',
          borderRadius: T.r.md, padding: '12px 14px',
        }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 11, fontWeight: 800,
            color: '#2F6BD8', letterSpacing: 0.6,
          }}>{p.num}</div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>{p.t}</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{p.d}</div>
        </div>
      ))}
    </div>
  );
}

function OperativaGrid({ items }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {items.map((c, i) => (
        <div key={i} style={{
          background: c.hl ? '#FFF4EC' : '#fff',
          border: `1px solid ${c.hl ? '#f5c19a' : T.hairline}`,
          borderRadius: T.r.md, padding: '12px 12px',
          boxShadow: T.shadow.card,
        }}>
          <div style={{
            fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 800,
            color: T.cat.academia.solid, letterSpacing: 0.8,
          }}>{c.art}</div>
          <div style={{ fontWeight: 800, fontSize: 13.5, marginTop: 2, letterSpacing: -0.1 }}>{c.title}</div>
          <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 4, lineHeight: 1.4 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

function Territorial({ items }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{
          background: '#fff', border: `1px solid ${it.highlight ? '#2FB66B' : T.hairline}`,
          boxShadow: it.highlight ? '0 0 0 4px rgba(47,182,107,0.10)' : T.shadow.card,
          borderRadius: T.r.md, padding: '12px 12px',
        }}>
          <span style={{
            display: 'inline-grid', placeItems: 'center',
            width: 36, height: 36, borderRadius: 10,
            background: it.bg, color: it.accent, fontSize: 18,
          }}>{it.icon}</span>
          <div style={{ fontWeight: 800, fontSize: 12.5, marginTop: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>{it.name}</div>
          <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{it.desc}</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMuted, marginTop: 4 }}>{it.meta}</div>
        </div>
      ))}
    </div>
  );
}

function Reformes({ items }) {
  return (
    <div style={{ padding: '0 16px', display: 'grid', gap: 8 }}>
      {items.map((r, i) => (
        <div key={i} style={{
          background: '#fff', border: `1px solid ${T.hairline}`,
          borderLeft: '3px solid #E85D8C',
          borderRadius: T.r.md, padding: '12px 14px', boxShadow: T.shadow.card,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#E85D8C' }}>{r.year}</span>
            <span style={{
              fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMuted,
              background: T.bg, padding: '2px 7px', borderRadius: 6,
            }}>{r.tag}</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 13.5 }}>{r.title}</div>
          <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
          <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMuted, marginTop: 6 }}>{r.date}</div>
        </div>
      ))}
    </div>
  );
}

function Recursos() {
  const items = [
    { icon: '📄', t: 'Text íntegre · DOGC',     d: 'Versió consolidada al portaljuridic' },
    { icon: '📥', t: 'Descarregar PDF',          d: 'Esquema operatiu · 8 pàgines' },
    { icon: '📝', t: 'Test del tema',            d: '30 preguntes · LL 16/91' },
    { icon: '🎯', t: 'Flashcards',               d: 'Memoritza articles clau' },
  ];
  return (
    <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{
          background: '#fff', border: `1px solid ${T.hairline}`,
          borderRadius: T.r.md, padding: '12px 12px', boxShadow: T.shadow.card,
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, alignItems: 'center',
        }}>
          <span style={{
            width: 34, height: 34, borderRadius: 10, background: T.bg,
            display: 'grid', placeItems: 'center', fontSize: 16,
          }}>{it.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 12.5 }}>{it.t}</div>
            <div style={{ fontSize: 11, color: T.inkSoft, marginTop: 1 }}>{it.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StickyTabs({ value, onChange }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(246,244,239,0.94)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      borderBottom: `1px solid ${T.hairline}`,
      margin: '0 -16px',
      padding: '0 16px',
    }}>
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '8px 0', scrollbarWidth: 'none' }}>
        {TABS.map(t => {
          const active = t.id === value;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              flexShrink: 0, padding: '7px 12px', borderRadius: 999,
              border: 'none', cursor: 'pointer',
              background: active ? T.ink : 'transparent',
              color: active ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontSize: 12, fontWeight: 700,
              letterSpacing: 0.1, whiteSpace: 'nowrap',
            }}>{t.label}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function ScreenLlei() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = LLEIS[id] || LLEIS['16-1991'];
  const [tab, setTab] = useState('resum');

  const sections = useMemo(() => ({
    resum: (
      <div style={{ display: 'grid', gap: 14 }}>
        <Hero data={data} />
        <Pillars pillars={data.pillars} />
        <MetaStrip data={data} />
      </div>
    ),
    cronologia: <Cronologia items={data.cronologia} />,
    estructura: (
      <div style={{ display: 'grid', gap: 12 }}>
        <Estructura titols={data.titols} />
        <SectionHead kicker="🏛️ Encaix territorial" accent="#E5484D" />
        <Territorial items={data.territorial} />
      </div>
    ),
    funcions: <FuncionsList items={data.funcions} />,
    principis: <PrincipisGrid items={data.principis} />,
    operativa: <OperativaGrid items={data.operativa} />,
    reformes: <Reformes items={data.reformes} />,
  }), [data]);

  return (
    <div className="screen" style={{ paddingBottom: 90 }}>
      <StatusBar />

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 10px' }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <Eyebrow>Lleis · Catalunya</Eyebrow>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button style={{
            background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: 999,
            padding: '6px 10px', fontSize: 11, fontWeight: 800, color: T.inkSoft, cursor: 'pointer',
          }}>↗ Compartir</button>
          <button style={{
            background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: 999,
            padding: '6px 10px', fontSize: 11, fontWeight: 800, color: T.inkSoft, cursor: 'pointer',
          }}>★ Desar</button>
        </div>
      </div>

      <div style={{ padding: '0 0 6px' }}><Crumbs here={data.shortTitle} /></div>

      {/* Tabs sticky */}
      <div style={{ padding: '0 16px' }}>
        <StickyTabs value={tab} onChange={setTab} />
      </div>

      <div style={{ height: 12 }} />

      {/* Section heading per tab */}
      {tab === 'resum' && (
        <SectionHead kicker={`📘 ${data.code} · ${data.title.split(',')[1] ? 'PL Catalunya' : ''}`} accent={T.cat.leyes.solid} />
      )}
      {tab === 'cronologia' && <SectionHead kicker="⏰ Cronologia" accent="#E89A1C" />}
      {tab === 'estructura' && <SectionHead kicker="📚 Estructura · 5 títols" accent="#2F6BD8" />}
      {tab === 'funcions' && <SectionHead kicker="🛡️ Art. 11 · Funcions de la PL" accent={T.cat.leyes.solid} />}
      {tab === 'principis' && <SectionHead kicker="⚖️ Art. 11.2 · Principis bàsics d'actuació" accent="#2F6BD8" />}
      {tab === 'operativa' && <SectionHead kicker="🚓 Aplicació operativa · 12 articles clau" accent={T.cat.academia.solid} />}
      {tab === 'reformes' && <SectionHead kicker="🔄 Reformes i normativa connexa" accent="#E85D8C" />}

      <div>
        {sections[tab]}
      </div>

      {/* Recursos and foot */}
      <div style={{ height: 22 }} />
      <SectionHead kicker="📚 Recursos i material d'estudi" accent="#2FB66B" />
      <Recursos />

      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', padding: '20px 16px 8px' }}>
        <button onClick={() => navigate('/operativa/infraccions')} style={{
          background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: 999,
          padding: '10px 14px', fontSize: 12.5, fontWeight: 800, color: T.inkSoft, cursor: 'pointer',
        }}>← Lleis</button>
        <button onClick={() => navigate('/academia/test')} style={{
          background: T.cat.academia.solid, color: '#fff', border: 'none', borderRadius: 999,
          padding: '10px 16px', fontSize: 12.5, fontWeight: 800, letterSpacing: 0.4,
          textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
        }}>Test del tema →</button>
      </div>
    </div>
  );
}
