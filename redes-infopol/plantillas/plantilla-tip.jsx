// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Tips InfoPol
// Carrusel 5 slides (1080×1080) + reel storyboard (1080×1920)
// Mostra l'app real (ScreenOperativaHome → ScreenInfraccions → ScreenFitxa)
// amb anotacions grogues sobre el dispositiu.
//
// Regles:
//   · Fons degradat blau #0B2545 → #13315C
//   · Mòbil tipus iPhone genèric (sense marca)
//   · Ombra suau sota el mòbil
//   · Anotacions SEMPRE en groc (cercles, fletxes, subratllats)
//   · Text explicatiu: 6—8 paraules per slide
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;
const { Phone, TabBar, HomeIndicator } = window;
const { ScreenOperativaHome, ScreenInfraccions, ScreenFitxa } = window;

const INK = T.ink;
const NAVY_TOP = '#0B2545';
const NAVY_BOT = '#13315C';
const YEL = '#FFD600';            // groc anotacions (saturat)
const YEL_DEEP = '#F0B400';

const PHONE_W = 320, PHONE_H = 660;

// ─── Frame (Phone + TabBar + HomeIndicator) ──────────────────────
function Frame({ tabMode = 'op', tabActive, children }) {
  return (
    <Phone w={PHONE_W} h={PHONE_H} scrollable={false}>
      {children}
      {tabMode === 'op' && (
        <TabBar
          mode="operativa"
          active={tabActive}
          tabs={[
            { id: 'home',     label: 'Inici',     icon: 'home' },
            { id: 'leyes',    label: 'Lleis',     icon: 'scale' },
            { id: 'protocol', label: 'Protocols', icon: 'route' },
            { id: 'mapa',     label: 'Mapa',      icon: 'map' },
            { id: 'me',       label: 'Tu',        icon: 'user' },
          ]}
        />
      )}
      <HomeIndicator />
    </Phone>
  );
}

// ─── PHONE STAGE (escalat + ombra + capa anotacions en coords del mòbil) ──
function PhoneStage({ scale, x, y, tabMode = 'op', tabActive, screen, children }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: PHONE_W * scale, height: PHONE_H * scale,
    }}>
      <div style={{
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        width: PHONE_W, height: PHONE_H,
        filter: 'drop-shadow(0 28px 36px rgba(0,0,0,0.55))',
      }}>
        <Frame tabMode={tabMode} tabActive={tabActive}>{screen}</Frame>
        {/* Capa d'anotacions · viu en coords del mòbil 320×660 */}
        {children && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 99,
          }}>{children}</div>
        )}
      </div>
    </div>
  );
}

// ─── ANOTACIONS GROGUES (coords mòbil) ───────────────────────────
function HighlightCircle({ x, y, r = 28, label }) {
  return (
    <React.Fragment>
      <div style={{
        position: 'absolute', left: x - r, top: y - r,
        width: r * 2, height: r * 2, borderRadius: '50%',
        border: `4px solid ${YEL}`,
        boxShadow: `0 0 0 6px rgba(255,214,0,0.18), 0 0 22px rgba(255,214,0,0.45)`,
        background: 'rgba(255, 214, 0, 0.12)',
      }} />
      {label && (
        <div style={{
          position: 'absolute', left: x + r + 14, top: y - 14,
          background: YEL, color: '#000',
          padding: '6px 12px', borderRadius: 999,
          fontFamily: T.font, fontWeight: 900, fontSize: 12,
          letterSpacing: 0.4, whiteSpace: 'nowrap',
          boxShadow: '0 8px 18px rgba(0,0,0,0.4)',
        }}>{label}</div>
      )}
    </React.Fragment>
  );
}

function HighlightBox({ x, y, w, h, label, labelPos = 'right' }) {
  return (
    <React.Fragment>
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h,
        borderRadius: 10, border: `3px solid ${YEL}`,
        boxShadow: `0 0 0 4px rgba(255,214,0,0.16), 0 0 18px rgba(255,214,0,0.4)`,
      }} />
      {label && (
        <div style={{
          position: 'absolute',
          ...(labelPos === 'right'
            ? { left: x + w + 10, top: y + h/2 - 12 }
            : { left: x, top: y + h + 8 }),
          background: YEL, color: '#000',
          padding: '5px 10px', borderRadius: 8,
          fontFamily: T.font, fontWeight: 900, fontSize: 11,
          letterSpacing: 0.4, whiteSpace: 'nowrap',
          boxShadow: '0 8px 18px rgba(0,0,0,0.4)',
        }}>{label}</div>
      )}
    </React.Fragment>
  );
}

function YellowUnderline({ x, y, w }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: 6,
      background: YEL, borderRadius: 3,
      boxShadow: '0 0 12px rgba(255,214,0,0.6)',
    }} />
  );
}

// Fletxa SVG en coords del mòbil 320×660
function YellowArrow({ from, to, curve = 0.3, width = 4 }) {
  const [x1, y1] = from, [x2, y2] = to;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  // Control point perpendicular per fer un arc
  const cx = mx + (-dy) * curve;
  const cy = my + (dx) * curve;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
         viewBox={`0 0 ${PHONE_W} ${PHONE_H}`}>
      <defs>
        <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4"
                orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,4 L0,8 z" fill={YEL} />
        </marker>
      </defs>
      <path d={`M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`}
            fill="none" stroke={YEL} strokeWidth={width}
            strokeLinecap="round" markerEnd="url(#ah)" />
    </svg>
  );
}

// ─── BACKGROUND ──────────────────────────────────────────────────
function TipBg({ children, width = 1080, height = 1080 }) {
  return (
    <div style={{
      position: 'relative', width, height,
      background: `linear-gradient(180deg, ${NAVY_TOP} 0%, ${NAVY_BOT} 100%)`,
      overflow: 'hidden', color: '#fff', fontFamily: T.font,
    }}>
      {/* subtle grid pattern */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }}
           viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="tip-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0 L0 0 L0 5" fill="none" stroke="#fff" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#tip-grid)" />
      </svg>
      {/* radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(80% 50% at 50% 110%, rgba(255,214,0,0.12) 0%, transparent 60%)',
      }} />
      {children}
    </div>
  );
}

// ─── PEU & HEADER comuns ────────────────────────────────────────
function TipBadge({ idx, total = 5, tipNumber = 12 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '10px 18px', borderRadius: 999,
      background: YEL, color: '#000',
      fontFamily: T.font, fontWeight: 900,
      fontSize: 18, letterSpacing: 1.4,
      boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
    }}>
      🛠️ TIPS INFOPOL · #{String(tipNumber).padStart(2, '0')} · {idx}/{total}
    </div>
  );
}

function IPMark({ size = 36, ink = '#fff', accent = YEL }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

function SlideFooter() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 64,
      padding: '0 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <span className="mono" style={{
        fontSize: 14, fontWeight: 700, letterSpacing: 2.8,
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
      }}>@infopol · acadèmia</span>
      <span className="mono" style={{
        fontSize: 14, fontWeight: 700, letterSpacing: 2.8,
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
      }}>infopol.cat</span>
      <IPMark size={32} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 1 · HOOK
// ═══════════════════════════════════════════════════════════════
function Slide1Hook() {
  // Phone centrat amb home screen
  const scale = 1.15;
  const phW = PHONE_W * scale, phH = PHONE_H * scale;  // ~368 × 759
  const phX = (1080 - phW) / 2;
  const phY = 290;
  return (
    <TipBg>
      <div style={{ position: 'absolute', top: 48, left: 48, right: 48 }}>
        <TipBadge idx={1} />
      </div>

      {/* Pregunta groga */}
      <div style={{
        position: 'absolute', top: 120, left: 60, right: 60,
        padding: '24px 28px',
        background: YEL, color: '#000', borderRadius: 22,
        boxShadow: '0 20px 36px rgba(0,0,0,0.4)',
        transform: 'rotate(-1.2deg)',
      }}>
        <div className="mono" style={{
          fontSize: 16, fontWeight: 800, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.65)',
          marginBottom: 6,
        }}>SABIES QUE...</div>
        <div style={{
          fontSize: 48, fontWeight: 900, letterSpacing: -1.4,
          lineHeight: 1.04, color: '#000', textWrap: 'pretty',
        }}>...pots trobar qualsevol article en 5 segons amb InfoPol?</div>
      </div>

      <PhoneStage scale={scale} x={phX} y={phY} tabActive="home" screen={<ScreenOperativaHome />} />

      {/* Fletxa decorativa entre pregunta i mòbil */}
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1080,
                    pointerEvents: 'none' }} viewBox="0 0 1080 1080">
        <defs>
          <marker id="big-ah" markerWidth="12" markerHeight="12" refX="6" refY="6"
                  orient="auto">
            <path d="M0,0 L12,6 L0,12 z" fill={YEL} />
          </marker>
        </defs>
        <path d="M 540,260 Q 700,300 540,290"
              fill="none" stroke={YEL} strokeWidth="6" strokeLinecap="round"
              markerEnd="url(#big-ah)" strokeDasharray="0 0" />
      </svg>

      <SlideFooter />
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2 · PAS 1 — Toca Lleis
// ═══════════════════════════════════════════════════════════════
function Slide2Pas1() {
  const scale = 1.32;
  const phW = PHONE_W * scale, phH = PHONE_H * scale;  // 422 × 871
  const phX = 60;
  const phY = (1080 - phH) / 2 - 20;
  return (
    <TipBg>
      <div style={{ position: 'absolute', top: 48, left: 48 }}>
        <TipBadge idx={2} />
      </div>

      <PhoneStage scale={scale} x={phX} y={phY} tabActive="home" screen={<ScreenOperativaHome />}>
        {/* Anotació: cercle groc sobre la pestanya Lleis (segon tab) */}
        {/* Tab bar a y ≈ 610-660, 5 tabs en 320 wide; tab 2 (Lleis) center x ≈ 320*1.5/5 = 96 */}
        <HighlightCircle x={96} y={628} r={32} label="Toca aquí" />
        <YellowArrow from={[210, 540]} to={[112, 612]} curve={0.3} />
      </PhoneStage>

      {/* Anotació al costat dret */}
      <div style={{
        position: 'absolute', right: 60, top: 220, width: 460,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', borderRadius: 999,
          background: YEL, color: '#000', alignSelf: 'flex-start',
          fontWeight: 900, fontSize: 22, letterSpacing: -0.4,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 16,
            background: '#000', color: YEL,
            display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 18,
          }}>1</span>
          PAS 1
        </div>
        <div style={{
          fontSize: 80, fontWeight: 900, letterSpacing: -2.4,
          lineHeight: 0.96, color: '#fff', textWrap: 'pretty',
        }}>Toca la pestanya <span style={{ color: YEL }}>Lleis</span></div>
        <div style={{
          fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.4, letterSpacing: -0.2,
        }}>A la barra inferior, segona icona — la balança.</div>
      </div>

      <SlideFooter />
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3 · PAS 2 — Escriu paraula o número
// ═══════════════════════════════════════════════════════════════
function Slide3Pas2() {
  const scale = 1.32;
  const phW = PHONE_W * scale, phH = PHONE_H * scale;
  const phX = 60;
  const phY = (1080 - phH) / 2 - 20;
  return (
    <TipBg>
      <div style={{ position: 'absolute', top: 48, left: 48 }}>
        <TipBadge idx={3} />
      </div>

      <PhoneStage scale={scale} x={phX} y={phY} tabActive="leyes" screen={<ScreenInfraccions />}>
        {/* Cercador a y ≈ 105, ample full minus padding 16. */}
        <HighlightBox x={14} y={97} w={292} h={42} label="Escriu aquí" labelPos="below" />
        <YellowUnderline x={28} y={130} w={140} />
      </PhoneStage>

      <div style={{
        position: 'absolute', right: 60, top: 220, width: 460,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', borderRadius: 999,
          background: YEL, color: '#000', alignSelf: 'flex-start',
          fontWeight: 900, fontSize: 22, letterSpacing: -0.4,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 16,
            background: '#000', color: YEL,
            display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 18,
          }}>2</span>
          PAS 2
        </div>
        <div style={{
          fontSize: 80, fontWeight: 900, letterSpacing: -2.4,
          lineHeight: 0.96, color: '#fff', textWrap: 'pretty',
        }}>Escriu el número <span style={{ color: YEL }}>o paraula clau</span></div>
        <div style={{
          fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.4, letterSpacing: -0.2,
        }}>"art. 77", "alcohol", "mòbil"… cerca per nombre o tema.</div>
      </div>

      <SlideFooter />
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4 · PAS 3 — Llest! tens la fitxa
// ═══════════════════════════════════════════════════════════════
function Slide4Pas3() {
  const scale = 1.32;
  const phW = PHONE_W * scale, phH = PHONE_H * scale;
  const phX = 60;
  const phY = (1080 - phH) / 2 - 20;
  return (
    <TipBg>
      <div style={{ position: 'absolute', top: 48, left: 48 }}>
        <TipBadge idx={4} />
      </div>

      <PhoneStage scale={scale} x={phX} y={phY} tabActive="leyes" screen={<ScreenFitxa />}>
        {/* Tic verd/groc sobre la fitxa */}
        <div style={{
          position: 'absolute', top: 24, right: 24,
          width: 56, height: 56, borderRadius: 28,
          background: YEL, color: '#000',
          display: 'grid', placeItems: 'center',
          fontWeight: 900, fontSize: 28, lineHeight: 1,
          boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
        }}>✓</div>
      </PhoneStage>

      <div style={{
        position: 'absolute', right: 60, top: 220, width: 460,
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 16px', borderRadius: 999,
          background: YEL, color: '#000', alignSelf: 'flex-start',
          fontWeight: 900, fontSize: 22, letterSpacing: -0.4,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 16,
            background: '#000', color: YEL,
            display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 18,
          }}>3</span>
          LLEST!
        </div>
        <div style={{
          fontSize: 80, fontWeight: 900, letterSpacing: -2.4,
          lineHeight: 0.96, color: '#fff', textWrap: 'pretty',
        }}>Article complet amb <span style={{ color: YEL }}>context</span></div>
        <div style={{
          fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.4, letterSpacing: -0.2,
        }}>Sanció, punts, protocol relacionat i possibles agreujants — tot d'un cop.</div>

        {/* Mini bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {['Sanció + punts visibles', 'Protocol relacionat enllaçat', 'Pots desar-lo a favorits ★'].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11,
                background: YEL, color: '#000',
                display: 'grid', placeItems: 'center',
                fontSize: 14, fontWeight: 900, flexShrink: 0,
              }}>✓</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <SlideFooter />
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5 · CTA · QR + URL + badges
// ═══════════════════════════════════════════════════════════════
function FakeQR({ size = 440, fg = '#000', bg = '#fff' }) {
  const N = 25;
  const cell = size / N;
  const inFinder = (r, c) => (
    (r < 7 && c < 7) ||
    (r < 7 && c > N - 8) ||
    (r > N - 8 && c < 7)
  );
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (inFinder(r, c)) continue;
      // Pseudo-random determinista
      const v = ((r * 17 + c * 31 + r * c * 5) ^ (r << 3) ^ (c << 1)) >>> 0;
      if (v % 100 < 46) cells.push([r, c]);
    }
  }
  const finders = [[0, 0], [0, N - 7], [N - 7, 0]];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`}
         style={{ borderRadius: 16, background: bg, padding: 1, boxSizing: 'border-box' }}>
      {cells.map(([r, c], i) => (
        <rect key={i} x={c} y={r} width={1} height={1} fill={fg} />
      ))}
      {finders.map(([r, c], i) => (
        <g key={`f${i}`} transform={`translate(${c}, ${r})`}>
          <rect x="0" y="0" width="7" height="7" fill={fg} />
          <rect x="1" y="1" width="5" height="5" fill={bg} />
          <rect x="2" y="2" width="3" height="3" fill={fg} />
        </g>
      ))}
      {/* Logo central — iP */}
      <rect x={N/2 - 3} y={N/2 - 3} width="6" height="6" fill={bg} />
      <rect x={N/2 - 2.5} y={N/2 - 2.5} width="5" height="5" fill={fg} rx="0.6" />
    </svg>
  );
}

function StoreBadge({ store }) {
  const isApple = store === 'apple';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 22px', borderRadius: 14,
      background: '#000', color: '#fff',
      border: '1px solid rgba(255,255,255,0.18)',
      minWidth: 200,
    }}>
      <div style={{
        width: 38, height: 38, display: 'grid', placeItems: 'center',
        color: '#fff',
      }}>
        {isApple ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
            <path d="M12.5 4.5c.8-1 2-1.7 3-1.7 0 1.2-.5 2.3-1.2 3.1-.8.9-2 1.6-3 1.5-.1-1.1.5-2.3 1.2-2.9zM18 17.5c-.6 1.4-1 2-1.8 3.2-1.1 1.7-2.6 3.7-4.5 3.7-1.7 0-2.2-1.1-4.5-1.1-2.3 0-2.8 1.1-4.5 1.1C0.8 24.4-.7 22.5-1.8 20.8c-3-4.7-3.3-10.3-1.5-13.2 1.3-2 3.4-3.3 5.4-3.3 2 0 3.3 1.1 4.9 1.1 1.6 0 2.6-1.1 4.9-1.1 1.8 0 3.7 1 5 2.7-4.4 2.4-3.6 8.7.1 10.5z" transform="translate(4, 0) scale(0.85)"/>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M3 3.5v17l11-8.5L3 3.5z" fill="#3DDC84" />
            <path d="M14 12L20 8 14 4z" fill="#FBC02D" />
            <path d="M14 12l6 4-6 4z" fill="#F44336" />
            <path d="M14 12L3 20.5l11-4.5z" fill="#1976D2" opacity="0.85" />
          </svg>
        )}
      </div>
      <div>
        <div className="mono" style={{
          fontSize: 9, fontWeight: 600, letterSpacing: 1.6,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
        }}>{isApple ? 'BAIXA-HO A' : 'CONSEGUEIX-HO A'}</div>
        <div style={{
          fontSize: 22, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1,
          marginTop: 2,
        }}>{isApple ? 'App Store' : 'Google Play'}</div>
      </div>
    </div>
  );
}

function Slide5CTA() {
  return (
    <TipBg>
      <div style={{ position: 'absolute', top: 48, left: 48 }}>
        <TipBadge idx={5} />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '160px 80px 100px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
      }}>
        <div style={{
          fontSize: 64, fontWeight: 900, letterSpacing: -1.8,
          lineHeight: 1.02, color: '#fff', textAlign: 'center',
        }}>Prova-ho a <span style={{ color: YEL }}>infopol.cat</span></div>
        <div style={{
          fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
          letterSpacing: -0.2, textAlign: 'center', maxWidth: 720,
        }}>Escaneja el QR amb la càmera del mòbil i ja ets dins.</div>

        {/* QR */}
        <div style={{
          padding: 24, background: '#fff', borderRadius: 28,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 6px rgba(255,214,0,0.25)',
          position: 'relative',
        }}>
          <FakeQR size={440} />
          {/* iP overlay */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 88, height: 88, borderRadius: 18,
            background: '#fff', display: 'grid', placeItems: 'center',
            border: '6px solid #fff',
          }}>
            <IPMark size={56} ink="#000" accent={YEL_DEEP} />
          </div>
        </div>

        {/* Stores */}
        <div style={{ display: 'flex', gap: 18, marginTop: 6 }}>
          <StoreBadge store="apple" />
          <StoreBadge store="google" />
        </div>
      </div>

      <SlideFooter />
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// REEL 1080×1920 · storyboard (6 frames)
// ═══════════════════════════════════════════════════════════════
function ReelStoryboard() {
  const W = 1080, H = 1920;
  // 6 frames de 1080×320 + header
  return (
    <TipBg width={W} height={H}>
      <div style={{
        position: 'absolute', inset: 0,
        padding: '64px 64px 64px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TipBadge idx={1} total={6} />
          <IPMark size={48} />
        </div>

        <div>
          <div className="mono" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
            marginBottom: 8,
          }}>Reel · storyboard 15—25 s</div>
          <div style={{
            fontSize: 60, fontWeight: 900, letterSpacing: -1.6,
            lineHeight: 1, color: '#fff',
          }}>Cerca un article en <span style={{ color: YEL }}>5 segons</span></div>
        </div>

        {/* 6 frames */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginTop: 6,
        }}>
          {[
            { t: '00:00', dur: '0—3 s', a: 'HOOK',   text: 'Pla curt: pantalla del mòbil + pregunta en text gros.' },
            { t: '00:03', dur: '3—6 s', a: 'PAS 1',  text: 'Dit que toca la pestanya Lleis · vibració háptica.' },
            { t: '00:06', dur: '6—12 s', a: 'PAS 2', text: 'Escriu "art. 77" al cercador. Resultats apareixen.' },
            { t: '00:12', dur: '12—18 s', a: 'PAS 3', text: 'Toca el resultat · obre la fitxa complerta. Pla curt.' },
            { t: '00:18', dur: '18—22 s', a: 'BENEFICI', text: 'Veu en off: «en 5 segons tens tota la informació».' },
            { t: '00:22', dur: '22—25 s', a: 'CTA',    text: 'Pantalla final · "infopol.cat" + QR · 2 s estàtic.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '18px 20px', borderRadius: 16,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mono" style={{
                  padding: '4px 8px', borderRadius: 6, fontSize: 12,
                  fontWeight: 800, letterSpacing: 1.4, background: YEL, color: '#000',
                }}>{f.t}</span>
                <span className="mono" style={{
                  fontSize: 12, fontWeight: 700, letterSpacing: 1.8,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
                }}>{f.dur}</span>
              </div>
              <div style={{
                fontSize: 26, fontWeight: 900, letterSpacing: -0.4,
                color: '#fff', lineHeight: 1.04,
              }}>{f.a}</div>
              <div style={{
                fontSize: 16, fontWeight: 500, lineHeight: 1.36,
                color: 'rgba(255,255,255,0.78)', textWrap: 'pretty',
              }}>{f.text}</div>
            </div>
          ))}
        </div>

        {/* Regles ràpides */}
        <div style={{
          marginTop: 6, padding: '18px 22px', borderRadius: 16,
          background: YEL, color: '#000',
        }}>
          <div className="mono" style={{
            fontSize: 12, fontWeight: 800, letterSpacing: 2.2,
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.65)', marginBottom: 6,
          }}>★ Regles de gravació</div>
          <div style={{
            fontSize: 18, fontWeight: 700, lineHeight: 1.4,
            color: '#000',
          }}>Mòbil real · veu en off curta o text en pantalla + música ·
             durada 15—25 s · acabar SEMPRE amb pantalla "infopol.cat" 2 s.</div>
        </div>

        <div style={{ flex: 1 }} />
        <SlideFooter />
      </div>
    </TipBg>
  );
}

// ═══════════════════════════════════════════════════════════════
// BANC D'IDEES
// ═══════════════════════════════════════════════════════════════
function BankCard() {
  const ideas = [
    'Com cercar un article concret en segons',
    'Com guardar lleis favorites',
    'Mode offline',
    'Com fer tests del temari',
    'Filtres per branca jurídica',
    'Notificacions de canvis normatius',
    'Compartir un article amb un company',
    'Mode fosc · accessibilitat',
  ];
  return (
    <DCArtboard id="bank" label="Banc d'idees · regles" width={780} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 44, fontFamily: T.font, color: INK,
      }}>
        <div className="mono" style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
        }}>🛠️ Tips InfoPol</div>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
          8 tips per a la sèrie setmanal
        </div>
        <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
          Carrusel 4—5 slides + reel. Converteix seguidor en usuari.
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ideas.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10, background: '#F4F8FB',
            }}>
              <span className="mono" style={{
                width: 28, fontSize: 11, fontWeight: 800,
                letterSpacing: 1.2, color: NAVY_BOT,
              }}>#{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: INK, flex: 1 }}>{it}</span>
            </div>
          ))}
        </div>

        {/* Regles disseny */}
        <div className="mono" style={{
          marginTop: 22, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 10,
        }}>Regles de mockup</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: INK,
                     lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Fons degradat blau #0B2545 → #13315C.</li>
          <li>Mòbil sense marca (estil iPhone genèric).</li>
          <li>Ombra suau · drop-shadow 20% opacitat.</li>
          <li>Anotacions SEMPRE en groc #FFD600.</li>
          <li>Text explicatiu: 6—8 paraules per slide.</li>
        </ul>

        <div style={{
          marginTop: 18, padding: 16, borderRadius: 12,
          background: NAVY_TOP, color: '#fff',
        }}>
          <div className="mono" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.8,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6,
          }}>📱 Reel · regla d'or</div>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            Acaba sempre amb pantalla "infopol.cat" 2 segons estàtics.
            És el que la gent recorda.
          </div>
        </div>
      </div>
    </DCArtboard>
  );
}

// ─── TWEAKS ────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "show_reel": true,
  "show_bank": true
}/*EDITMODE-END*/;

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Contingut">
        <TweakRadio
          label="Reel storyboard 1080×1920"
          value={t.show_reel ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_reel', v === 'yes')}
        />
        <TweakRadio
          label="Banc d'idees + regles"
          value={t.show_bank ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_bank', v === 'yes')}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection
          id="tip"
          title="Tip · Com trobar un article en 5 segons"
          subtitle="Carrusel 5 slides 1080×1080 · pantalles reals + anotacions grogues."
        >
          <DCArtboard id="s1" label="1 · Hook" width={1080} height={1080}>
            <Slide1Hook />
          </DCArtboard>
          <DCArtboard id="s2" label="2 · Pas 1 · Toca Lleis" width={1080} height={1080}>
            <Slide2Pas1 />
          </DCArtboard>
          <DCArtboard id="s3" label="3 · Pas 2 · Cerca" width={1080} height={1080}>
            <Slide3Pas2 />
          </DCArtboard>
          <DCArtboard id="s4" label="4 · Llest! Fitxa completa" width={1080} height={1080}>
            <Slide4Pas3 />
          </DCArtboard>
          <DCArtboard id="s5" label="5 · CTA · QR + Stores" width={1080} height={1080}>
            <Slide5CTA />
          </DCArtboard>
        </DCSection>

        {t.show_reel && (
          <DCSection id="reel" title="Reel · storyboard 1080×1920"
                     subtitle="6 frames per a la gravació amb mòbil real.">
            <DCArtboard id="reel" label="Reel storyboard" width={1080} height={1920}>
              <ReelStoryboard />
            </DCArtboard>
          </DCSection>
        )}

        {t.show_bank && (
          <DCSection id="bank" title="Banc + regles"
                     subtitle="8 tips a la cua + regles de disseny i gravació.">
            <BankCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
