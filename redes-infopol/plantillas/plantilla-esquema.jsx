// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Esquema visual
// 4 tipus d'esquema (Tipus A/B/C/D) en format 1080×1080.
//
// Regles de disseny universals:
//   · Fons: blanc o blau molt clar #F0F4F8
//   · Caixes: bordes arrodonits 8px, ombra suau
//   · Colors per nivell:
//       Nivell 1 (arrel)    → navy sòlid, text blanc
//       Nivell 2            → blau mig, text blanc
//       Nivell 3            → blau clar, text navy
//       Nivell 4            → blanc amb voraviu blau, text navy
//   · Línies connectores: grises #888, 2 px
//   · Text en caixes: màxim 4 paraules
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;

const INK    = T.ink;
const BG     = '#F0F4F8';         // blau molt clar
const PAPER  = '#FFFFFF';
const NAVY   = '#0E1A36';
const BLUE_M = T.cat.operativa.solid; // #3B6BF5
const BLUE_L = '#BBD0FB';
const LINE   = '#9AA3B0';         // gris connector (lleugerament tonejat)
const YEL    = T.cat.psico.solid;

// ─── Niveles · helper de colors ──────────────────────────────────
function levelStyle(level) {
  switch (level) {
    case 1: return { bg: NAVY,   text: '#fff', border: 'transparent' };
    case 2: return { bg: BLUE_M, text: '#fff', border: 'transparent' };
    case 3: return { bg: BLUE_L, text: NAVY,   border: 'transparent' };
    case 4: return { bg: '#fff', text: NAVY,   border: BLUE_M };
    default:return { bg: '#fff', text: NAVY,   border: BLUE_M };
  }
}

// ─── BOX ─────────────────────────────────────────────────────────
function Box({ x, y, w, h, level = 2, label, sub, mono = false, anchor = 'center' }) {
  const s = levelStyle(level);
  const dx = anchor === 'center' ? -w / 2 : 0;
  const dy = anchor === 'center' ? -h / 2 : 0;
  return (
    <div style={{
      position: 'absolute',
      left: x + dx, top: y + dy, width: w, height: h,
      background: s.bg, color: s.text,
      borderRadius: 8,
      border: level === 4 ? `2px solid ${s.border}` : `1px solid rgba(0,0,0,0.04)`,
      boxShadow: '0 2px 0 rgba(14,26,54,0.04), 0 8px 18px rgba(14,26,54,0.06)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '6px 14px', textAlign: 'center',
      fontFamily: T.font,
      zIndex: 2,
    }}>
      <div className={mono ? 'mono' : ''} style={{
        fontSize: level === 1 ? 26 : level === 2 ? 22 : level === 3 ? 18 : 17,
        fontWeight: level <= 2 ? 800 : 700,
        letterSpacing: level === 1 ? 0.4 : 0,
        lineHeight: 1.12,
        textWrap: 'balance',
      }}>{label}</div>
      {sub && (
        <div className="mono" style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: level <= 2 ? 'rgba(255,255,255,0.62)' : 'rgba(14,26,54,0.55)',
          marginTop: 4,
        }}>{sub}</div>
      )}
    </div>
  );
}

// ─── FRAME comú (header + body + footer + legend) ────────────────
function DiagramFrame({ tipus, title, subtitle, legend, children, page, total }) {
  const W = 1080, H = 1080;
  const hdr = 130, ftr = 100;
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: BG, color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{
        height: hdr, padding: '0 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(14,26,54,0.06)',
      }}>
        <div>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 12px', borderRadius: 999,
            background: NAVY, color: '#fff',
            fontSize: 13, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: YEL }} />
            ESQUEMA · {tipus}
          </div>
          <div style={{
            fontSize: 36, fontWeight: 900, letterSpacing: -0.8,
            lineHeight: 1.05, color: NAVY,
          }}>{title}</div>
          {subtitle && (
            <div style={{
              marginTop: 4, fontSize: 16, fontWeight: 500,
              color: 'rgba(14,26,54,0.62)',
            }}>{subtitle}</div>
          )}
        </div>
        {page && (
          <div className="mono" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: 2.4,
            color: 'rgba(14,26,54,0.45)',
          }}>{page} / {total}</div>
        )}
      </div>

      {/* BODY */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: hdr, bottom: ftr,
      }}>{children}</div>

      {/* FOOTER · llegenda + logo */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: ftr,
        padding: '0 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(14,26,54,0.06)',
        background: '#fff',
      }}>
        {legend
          ? <Legend items={legend} />
          : <div className="mono" style={{
              fontSize: 14, fontWeight: 600, letterSpacing: 2.4,
              textTransform: 'uppercase', color: 'rgba(14,26,54,0.55)',
            }}>Acadèmia InfoPol · esquema visual</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{
            fontSize: 14, fontWeight: 600, letterSpacing: 2.4,
            textTransform: 'uppercase', color: 'rgba(14,26,54,0.5)',
          }}>@infopol</span>
          <IPMark size={36} ink={NAVY} accent={BLUE_M} />
        </div>
      </div>
    </div>
  );
}

function IPMark({ size = 36, ink = NAVY, accent }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div className="mono" style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.8,
        textTransform: 'uppercase', color: 'rgba(14,26,54,0.45)',
      }}>LLEGENDA</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 14, height: 14, borderRadius: 4,
            background: it.bg || '#fff',
            border: it.border ? `2px solid ${it.border}` : '1px solid rgba(14,26,54,0.1)',
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── LÍNIES SVG ──────────────────────────────────────────────────
function Lines({ paths, color = LINE, width = 2, dashed = false }) {
  return (
    <svg style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1,
    }} viewBox="0 0 1080 850" preserveAspectRatio="none">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color}
              strokeWidth={width} strokeLinecap="round"
              strokeDasharray={dashed ? '6 6' : undefined} />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIPUS A · ÀRBRE JERÀRQUIC · Jerarquia normativa espanyola
// ═══════════════════════════════════════════════════════════════
function DiagramJerarquia() {
  // Body area: 1080 × 850.
  // L1 arrel
  const l1 = { x: 540, y: 90, w: 360, h: 100, level: 1, label: 'CONSTITUCIÓ', sub: 'CE 1978' };
  // L2 · 3 boxes
  const l2 = [
    { x: 200, y: 320, w: 260, h: 92, level: 2, label: 'TRACTATS\nINTERNACIONALS' },
    { x: 540, y: 320, w: 260, h: 92, level: 2, label: 'LLEIS ORGÀNIQUES' },
    { x: 880, y: 320, w: 260, h: 92, level: 2, label: 'LLEIS ORDINÀRIES' },
  ];
  // L3 (sota Lleis ordinàries)
  const l3 = [
    { x: 660, y: 560, w: 220, h: 80, level: 3, label: 'REIAL DECRET' },
    { x: 900, y: 560, w: 220, h: 80, level: 3, label: 'DECRET / ORDRE' },
  ];
  // L4 (sota Tractats — costum + jurisprudència)
  const l4 = [
    { x: 200, y: 560, w: 240, h: 76, level: 4, label: 'COSTUM' },
    { x: 200, y: 660, w: 240, h: 76, level: 4, label: 'JURISPRUDÈNCIA TS' },
  ];

  // Línies: de cada caixa pare al fill (centre-bottom → centre-top)
  // Coordinades dins viewBox 0..1080 × 0..850
  const pathV = (p, c, midY) =>
    `M ${p.x},${p.y + p.h/2} V ${midY} H ${c.x} V ${c.y - c.h/2}`;
  const midA = 240;   // entre L1 i L2
  const midB = 470;   // entre L2 i L3/L4
  const paths = [
    // L1 → cada L2
    ...l2.map((c) => pathV(l1, c, midA)),
    // L2(Lleis ordinàries) → cada L3
    ...l3.map((c) => pathV(l2[2], c, midB)),
    // L2(Tractats) → cada L4
    ...l4.map((c) => pathV(l2[0], c, midB)),
  ];

  return (
    <DiagramFrame
      tipus="TIPUS A · ÀRBRE"
      title="Jerarquia normativa espanyola"
      subtitle="De més general a més concret — qui guanya si hi ha conflicte de normes"
      legend={[
        { bg: NAVY,   label: 'Nivell 1 · CE' },
        { bg: BLUE_M, label: 'Nivell 2' },
        { bg: BLUE_L, label: 'Nivell 3' },
        { bg: '#fff', border: BLUE_M, label: 'Auxiliars' },
      ]}
    >
      <Lines paths={paths} />
      {[l1, ...l2, ...l3, ...l4].map((b, i) => (
        <Box key={i} {...b} label={b.label.split('\n').map((s, j) => (
          <div key={j}>{s}</div>
        ))} />
      ))}

      {/* Mini-anotació */}
      <div style={{
        position: 'absolute', left: 56, bottom: 24,
        padding: '8px 12px', borderRadius: 8,
        background: '#fff', border: '1px dashed rgba(14,26,54,0.18)',
        fontSize: 12, color: 'rgba(14,26,54,0.7)',
        fontFamily: T.fontMono, letterSpacing: 1.2,
        textTransform: 'uppercase', fontWeight: 600,
      }}>↧ jeràrquicament inferior</div>
    </DiagramFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIPUS B · FLUX DE PROCÉS · Fases del procediment penal
// ═══════════════════════════════════════════════════════════════
function DiagramFlux() {
  const steps = [
    { label: 'NOTÍCIA CRIMINIS', sub: '01 · INICI',         detail: 'Mossos reben la denúncia o atestat.' },
    { label: 'INSTRUCCIÓ',       sub: '02 · DILIGÈNCIES',   detail: 'Jutge d\u2019instrucció dirigeix la investigació.' },
    { label: 'JUDICI ORAL',      sub: '03 · VISTA',         detail: 'Tribunal valora proves i declaracions.' },
    { label: 'SENTÈNCIA',        sub: '04 · RESOLUCIÓ',     detail: 'Condemnatòria o absolutòria.' },
    { label: 'EXECUCIÓ',         sub: '05 · COMPLIMENT',    detail: 'Compliment de pena o mesura.' },
  ];

  // Layout horitzontal: 5 caixes a y=170, w=180 h=110, gap 20.
  // Total: 5*180 + 4*20 = 980, x inicial = (1080-980)/2 = 50.
  const W = 180, H = 110, GAP = 20, START = 50, Y = 170;
  const xs = steps.map((_, i) => START + i * (W + GAP) + W / 2);

  // Línies horitzontals · fletxes
  const arrows = steps.slice(0, -1).map((_, i) => {
    const a = xs[i] + W / 2;
    const b = xs[i + 1] - W / 2;
    return `M ${a},${Y + H/2} L ${b - 8},${Y + H/2} L ${b - 18},${Y + H/2 - 8} M ${b - 8},${Y + H/2} L ${b - 18},${Y + H/2 + 8}`;
  });

  return (
    <DiagramFrame
      tipus="TIPUS B · FLUX"
      title="Fases del procediment penal"
      subtitle="De la notícia criminis a l'execució de pena"
      legend={[
        { bg: BLUE_M, label: 'Fase principal' },
        { bg: '#fff', border: BLUE_M, label: 'Detall · què passa' },
      ]}
    >
      <Lines paths={arrows} color={BLUE_M} width={2.5} />
      {steps.map((s, i) => (
        <Box key={i} x={xs[i]} y={Y + H / 2}
             w={W} h={H} level={2} label={s.label} sub={s.sub} />
      ))}

      {/* Línies verticals (cada caixa baixa al seu detall) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                    pointerEvents: 'none' }}
           viewBox="0 0 1080 850" preserveAspectRatio="none">
        {xs.map((cx, i) => (
          <path key={i} d={`M ${cx},${Y + H} L ${cx},${Y + H + 60}`}
                fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round"
                strokeDasharray="6 6" />
        ))}
      </svg>

      {/* Detalls */}
      {steps.map((s, i) => (
        <Box key={`d${i}`} x={xs[i]} y={Y + H + 60 + 60}
             w={W} h={120} level={4} label={s.detail} />
      ))}

      {/* Mini-pas final · resum */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 28,
        padding: '14px 18px', borderRadius: 12,
        background: NAVY, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{
          display: 'inline-grid', placeItems: 'center',
          width: 32, height: 32, borderRadius: 16,
          background: YEL, color: NAVY, fontWeight: 900, fontSize: 16,
        }}>★</span>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.2 }}>
          Cada fase té recursos propis — l'agent intervé sobretot a la fase 01 i a la 03 com a testimoni.
        </span>
      </div>
    </DiagramFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIPUS C · DIAGRAMA RADIAL · Drets del detingut (art. 520 LECrim)
// ═══════════════════════════════════════════════════════════════
function DiagramRadial() {
  const cx = 540, cy = 410, R = 290;
  const items = [
    { label: 'Conèixer els fets',          short: '01' },
    { label: 'Designar advocat',           short: '02' },
    { label: 'Comunicar la detenció',      short: '03' },
    { label: 'Assistència d\u2019intèrpret', short: '04' },
    { label: 'Reconeixement mèdic',        short: '05' },
    { label: 'Guardar silenci',            short: '06' },
    { label: 'No declarar-se culpable',    short: '07' },
  ];
  const N = items.length;
  // Comencem amunt (-90°) i anem en sentit horari
  const pos = items.map((_, i) => {
    const ang = (-90 + (360 / N) * i) * Math.PI / 180;
    return {
      x: cx + R * Math.cos(ang),
      y: cy + R * Math.sin(ang),
    };
  });

  // Línies del centre a cada node — s'aturen a l'arrel del node
  const paths = pos.map((p) =>
    `M ${cx},${cy} L ${p.x},${p.y}`);

  return (
    <DiagramFrame
      tipus="TIPUS C · RADIAL"
      title="Drets del detingut"
      subtitle="Art. 520 LECrim — concepte central + drets bàsics"
      legend={[
        { bg: NAVY,   label: 'Concepte central' },
        { bg: BLUE_M, label: 'Dret bàsic' },
      ]}
    >
      <Lines paths={paths} />

      {/* Centre */}
      <Box x={cx} y={cy} w={260} h={150} level={1}
           label={'DRETS DEL\nDETINGUT'.split('\n').map((s, i) => (<div key={i}>{s}</div>))}
           sub="Art. 520 LECrim" />

      {/* Branques */}
      {pos.map((p, i) => (
        <Box key={i} x={p.x} y={p.y} w={208} h={70} level={2}
             label={items[i].label} sub={items[i].short} />
      ))}
    </DiagramFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIPUS D · TAULA · Competències per cos
// ═══════════════════════════════════════════════════════════════
function DiagramTaula() {
  const rows = [
    { label: 'Seguretat ciutadana',  m: 'full', pl: 'shared', gc: 'rural' },
    { label: 'Trànsit urbà',         m: 'no',   pl: 'full',   gc: 'no'    },
    { label: 'Trànsit interurbà',    m: 'full', pl: 'no',     gc: 'shared'},
    { label: 'Investigació criminal',m: 'full', pl: 'no',     gc: 'shared'},
    { label: 'Custòdia detinguts',   m: 'full', pl: 'partial',gc: 'partial'},
  ];
  const cols = [
    { key: 'm',  name: 'MOSSOS\nD\u2019ESQUADRA' },
    { key: 'pl', name: 'POLICIA\nLOCAL' },
    { key: 'gc', name: 'GUÀRDIA\nCIVIL' },
  ];

  const cell = (v) => {
    switch (v) {
      case 'full':    return { bg: BLUE_M, text: '#fff', icon: '●', label: 'Competència plena' };
      case 'shared':  return { bg: BLUE_L, text: NAVY,   icon: '◐', label: 'Compartida' };
      case 'partial': return { bg: '#FFF6E5', text: '#8A5A0B', icon: '◔', label: 'Auxiliar' };
      case 'rural':   return { bg: BLUE_L, text: NAVY,   icon: '⊕', label: 'Àmbit rural' };
      default:        return { bg: '#fff', text: 'rgba(14,26,54,0.4)', icon: '—', label: 'No' };
    }
  };

  // Layout taula
  const startX = 60, startY = 56;
  const labelW = 320;
  const colW = (1080 - startX * 2 - labelW) / 3; // 213
  const rowH = 90;

  return (
    <DiagramFrame
      tipus="TIPUS D · TAULA"
      title="Competències per cos policial"
      subtitle="Distribució orientativa — sempre amb cooperació prèvia"
      legend={[
        { bg: BLUE_M, label: 'Plena' },
        { bg: BLUE_L, label: 'Compartida' },
        { bg: '#FFF6E5', border: '#F0D89A', label: 'Auxiliar' },
        { bg: '#fff', border: BLUE_M, label: 'No competent' },
      ]}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Header cols */}
        <div style={{
          position: 'absolute', left: startX + labelW, top: startY,
          width: 1080 - startX * 2 - labelW, height: rowH,
          display: 'flex', gap: 8,
        }}>
          {cols.map((c, i) => (
            <div key={i} style={{
              flex: 1, background: NAVY, color: '#fff', borderRadius: 8,
              display: 'grid', placeItems: 'center', padding: 8,
              fontSize: 16, fontWeight: 800, letterSpacing: 0.4,
              lineHeight: 1.1, textAlign: 'center', whiteSpace: 'pre-line',
            }}>{c.name}</div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((r, ri) => {
          const y = startY + (ri + 1) * (rowH + 12);
          return (
            <div key={ri} style={{
              position: 'absolute', left: startX, top: y,
              width: 1080 - startX * 2, height: rowH,
              display: 'flex', alignItems: 'stretch', gap: 8,
            }}>
              {/* Label */}
              <div style={{
                width: labelW,
                background: '#fff', borderRadius: 8,
                border: `2px solid ${BLUE_M}`,
                display: 'flex', alignItems: 'center',
                padding: '0 18px',
                fontSize: 18, fontWeight: 800, color: NAVY,
                letterSpacing: -0.2,
              }}>{r.label}</div>
              {/* Cells */}
              {cols.map((c, ci) => {
                const data = cell(r[c.key]);
                return (
                  <div key={ci} style={{
                    flex: 1, background: data.bg, color: data.text,
                    borderRadius: 8,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 6,
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{data.icon}</div>
                    <div className="mono" style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
                      textTransform: 'uppercase', marginTop: 4, opacity: 0.85,
                    }}>{data.label}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </DiagramFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARRUSEL · Tipus A + slide bonus "Com memoritzar-ho"
// ═══════════════════════════════════════════════════════════════
function SlideMemoritzar() {
  const W = 1080, H = 1080;
  // Mnemotecnia: C·L·O·R·O — Constitució · Lleis · Ordinàries · Reials decrets · Ordres
  const letters = [
    { l: 'C', word: 'Constitució',     hint: 'la norma suprema · 1978' },
    { l: 'L', word: 'Lleis orgàniques',hint: 'matèries reservades · majoria absoluta' },
    { l: 'O', word: 'Ordinàries',      hint: 'lleis "normals" · majoria simple' },
    { l: 'R', word: 'Reials decrets',  hint: 'desenvolupen la llei' },
    { l: 'O', word: 'Ordres mins.',    hint: 'concretes i tècniques' },
  ];
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: BG, color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        height: 130, padding: '0 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 12px', borderRadius: 999,
            background: YEL, color: NAVY,
            fontSize: 13, fontWeight: 800, letterSpacing: 2.4,
            textTransform: 'uppercase', marginBottom: 8,
          }}>★ Com memoritzar-ho</div>
          <div style={{
            fontSize: 36, fontWeight: 900, letterSpacing: -0.8,
            lineHeight: 1.05, color: NAVY,
          }}>Mnemotècnic · C·L·O·R·O</div>
          <div style={{
            marginTop: 4, fontSize: 16, fontWeight: 500,
            color: 'rgba(14,26,54,0.62)',
          }}>Recorda la jerarquia normativa amb una sola paraula.</div>
        </div>
        <div className="mono" style={{
          fontSize: 18, fontWeight: 700, letterSpacing: 2.4,
          color: 'rgba(14,26,54,0.45)',
        }}>2 / 2</div>
      </div>

      {/* Body */}
      <div style={{
        position: 'absolute', left: 56, right: 56, top: 156, bottom: 120,
        display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center',
      }}>
        {letters.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 24,
            padding: '20px 28px', borderRadius: 16,
            background: '#fff', border: '1px solid rgba(14,26,54,0.06)',
            boxShadow: '0 2px 0 rgba(14,26,54,0.04), 0 8px 18px rgba(14,26,54,0.06)',
          }}>
            <div style={{
              flexShrink: 0, width: 96, height: 96, borderRadius: 16,
              background: i === 4 ? BLUE_M : NAVY, color: '#fff',
              display: 'grid', placeItems: 'center',
              fontFamily: T.font, fontWeight: 900,
              fontSize: 72, lineHeight: 1, letterSpacing: -2,
            }}>{row.l}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 32, fontWeight: 800, letterSpacing: -0.4,
                color: NAVY, lineHeight: 1.1,
              }}>{row.word}</div>
              <div style={{
                fontSize: 17, color: 'rgba(14,26,54,0.65)', marginTop: 4,
              }}>{row.hint}</div>
            </div>
            <div className="mono" style={{
              fontSize: 14, fontWeight: 700, letterSpacing: 2.2,
              textTransform: 'uppercase',
              color: 'rgba(14,26,54,0.45)',
            }}>{String(i + 1).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 100,
        padding: '0 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(14,26,54,0.06)', background: '#fff',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', background: YEL, color: NAVY, borderRadius: 12,
          fontSize: 18, fontWeight: 800,
        }}>
          🔖 Guarda aquesta publicació
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{
            fontSize: 14, fontWeight: 600, letterSpacing: 2.4,
            textTransform: 'uppercase', color: 'rgba(14,26,54,0.5)',
          }}>@infopol</span>
          <IPMark size={36} ink={NAVY} accent={BLUE_M} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BANC + REGLES (fitxa final)
// ═══════════════════════════════════════════════════════════════
function BankCard() {
  const ideas = [
    { type: 'A · Àrbre',  label: 'Jerarquia normativa (CE → LO → Llei → RD → O)' },
    { type: 'A · Àrbre',  label: 'Estructura del Cos de Mossos d\u2019Esquadra' },
    { type: 'A · Àrbre',  label: 'Estructura de la Generalitat de Catalunya' },
    { type: 'B · Flux',   label: 'Fases del procediment penal' },
    { type: 'B · Flux',   label: 'Passos d\u2019una detenció' },
    { type: 'C · Radial', label: 'Tipus de penes (CP)' },
    { type: 'C · Radial', label: 'Drets del detingut (art. 520 LECrim)' },
    { type: 'C · Radial', label: 'Classificació de les infraccions de trànsit' },
    { type: 'D · Taula',  label: 'Competències Mossos vs Local vs GC' },
  ];
  return (
    <DCArtboard id="bank" label="Banc + regles tipogràfiques" width={780} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 44, fontFamily: T.font, color: NAVY,
      }}>
        <div className="mono" style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>🧩 Banc d'esquemes</div>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
          9 esquemes a la cua per la sèrie (1 cada 10 dies)
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ideas.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10, background: BG,
            }}>
              <span className="mono" style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 10,
                fontWeight: 800, letterSpacing: 1.2, color: '#fff',
                background: NAVY, flexShrink: 0,
              }}>{it.type.toUpperCase()}</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{it.label}</span>
            </div>
          ))}
        </div>

        <div className="mono" style={{
          marginTop: 22, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase',
          color: 'rgba(14,26,54,0.55)', marginBottom: 10,
        }}>Regles universals</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#0E1A36',
                     lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Fons #F0F4F8 (blau molt clar) per no saturar.</li>
          <li>Caixes amb radi 8 px + ombra suau (no neon).</li>
          <li>Connectors gris #9AA3B0, gruix 2 px.</li>
          <li>Màxim 4 paraules per caixa.</li>
          <li>Llegenda als colors si tenen significat (cantonada inferior).</li>
        </ul>

        <div className="mono" style={{
          marginTop: 18, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase',
          color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>Codi de nivells</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[1, 2, 3, 4].map((lvl) => {
            const s = levelStyle(lvl);
            return (
              <div key={lvl} style={{
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 80, height: 28, borderRadius: 6,
                  background: s.bg, color: s.text,
                  border: lvl === 4 ? `2px solid ${s.border}` : 'none',
                  display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
                }}>NIVELL {lvl}</div>
                <div className="mono" style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: 1.6,
                  textTransform: 'uppercase', color: 'rgba(14,26,54,0.6)',
                }}>{
                  lvl === 1 ? 'arrel · concepte principal' :
                  lvl === 2 ? 'branques principals' :
                  lvl === 3 ? 'detalls / subcategories' :
                              'caixes auxiliars · costums'
                }</div>
              </div>
            );
          })}
        </div>
      </div>
    </DCArtboard>
  );
}

// ─── TWEAKS ────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "show_bonus": true,
  "show_bank": true
}/*EDITMODE-END*/;

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Contingut">
        <TweakRadio
          label="Slide bonus · Com memoritzar-ho"
          value={t.show_bonus ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_bonus', v === 'yes')}
        />
        <TweakRadio
          label="Banc + regles universals"
          value={t.show_bank ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_bank', v === 'yes')}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="diagrams"
                   title="4 tipus d'esquema · 1080×1080"
                   subtitle="Un exemple real per tipus — arbre, flux, radial i taula.">
          <DCArtboard id="a" label="A · Àrbre · Jerarquia normativa"
                      width={1080} height={1080}>
            <DiagramJerarquia />
          </DCArtboard>
          <DCArtboard id="b" label="B · Flux · Procediment penal"
                      width={1080} height={1080}>
            <DiagramFlux />
          </DCArtboard>
          <DCArtboard id="c" label="C · Radial · Drets del detingut"
                      width={1080} height={1080}>
            <DiagramRadial />
          </DCArtboard>
          <DCArtboard id="d" label="D · Taula · Competències per cos"
                      width={1080} height={1080}>
            <DiagramTaula />
          </DCArtboard>
        </DCSection>

        {t.show_bonus && (
          <DCSection id="bonus"
                     title="Slide 2 opcional · Com memoritzar-ho"
                     subtitle="Per a esquemes complexos, afegim un truc visual a continuació.">
            <DCArtboard id="m" label="Mnemotècnic · CLORO"
                        width={1080} height={1080}>
              <SlideMemoritzar />
            </DCArtboard>
          </DCSection>
        )}

        {t.show_bank && (
          <DCSection id="bank"
                     title="Banc d'idees + regles"
                     subtitle="Per planificar la sèrie.">
            <BankCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
