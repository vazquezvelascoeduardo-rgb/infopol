// shared.jsx — InfoPol shared UI atoms (logo, chrome, badges, buttons)

const T = window.TOKENS;
const I = window.Icon;

// ── Logo ──────────────────────────────────────────────────────────
function InfoPolLogo({ size = 28, mono = false, color }) {
  // Original mark: stylised shield with horizontal scan line + dot.
  // Not a copy of any real logo.
  const s = size;
  const c = color || (mono ? T.ink : T.cat.operativa.solid);
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 3l11 4v8.5C27 22 22.3 27.5 16 29 9.7 27.5 5 22 5 15.5V7l11-4z" fill={c} />
      <path d="M11 14h10M11 18h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="22" cy="18" r="1.2" fill="#fff"/>
    </svg>
  );
}

function InfoPolWordmark({ height = 22, color }) {
  const ink = color || T.ink;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <InfoPolLogo size={height + 6} />
      <span style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: height,
        letterSpacing: -0.6, color: ink, lineHeight: 1,
      }}>
        info<span style={{ color: T.cat.academia.solid }}>pol</span>
      </span>
    </div>
  );
}

// ── Phone status bar (slim) ──────────────────────────────────────
function StatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 6px', height: 44, boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: c }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.7"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.7"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.7"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.7"/>
        </g></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}>
          <path d="M7.5 3a7 7 0 0 1 5 2l1-1a8.5 8.5 0 0 0-12 0l1 1a7 7 0 0 1 5-2zM7.5 6.2a3.5 3.5 0 0 1 2.5 1l1-1a5 5 0 0 0-7 0l1 1a3.5 3.5 0 0 1 2.5-1z"/>
          <circle cx="7.5" cy="9.5" r="1.3"/>
        </svg>
        <svg width="25" height="11" viewBox="0 0 25 11">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke={c} fill="none" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="7" rx="1.5" fill={c}/>
          <path d="M23 4v3c.7-.2 1.3-.9 1.3-1.5S23.7 4.2 23 4z" fill={c} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}

// ── Home indicator ───────────────────────────────────────────────
function HomeIndicator({ dark = false }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 3,
        background: dark ? '#fff' : T.ink, opacity: 0.95,
      }} />
    </div>
  );
}

// ── Badges & pills ───────────────────────────────────────────────
function Pill({ children, bg, fg, size = 11, weight = 700, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 8px', borderRadius: T.r.pill,
      background: bg || T.cat.operativa.soft,
      color: fg || T.cat.operativa.ink,
      fontFamily: T.font, fontWeight: weight, fontSize: size,
      letterSpacing: 0.4, textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

function CategoryTag({ cat = 'operativa', label, style = {} }) {
  const k = T.cat[cat] || T.cat.operativa;
  return <Pill bg={k.soft} fg={k.ink} style={style}>{label}</Pill>;
}

// ── Chunky duo-style button ──────────────────────────────────────
function DuoButton({ children, color, dark, onClick, full, leftIcon, style = {} }) {
  const k = color ? T.cat[color] : T.cat.academia;
  const bg = k.solid;
  return (
    <button onClick={onClick} style={{
      position: 'relative', border: 'none', cursor: 'pointer',
      width: full ? '100%' : undefined,
      padding: '14px 22px', borderRadius: 16,
      background: bg, color: '#fff',
      fontFamily: T.font, fontWeight: 800, fontSize: 15,
      letterSpacing: 0.4, textTransform: 'uppercase',
      boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.18)`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style,
    }}>
      {leftIcon && <I name={leftIcon} size={18} />}
      {children}
    </button>
  );
}

// ── Square category icon (multicolor system) ─────────────────────
function CatIcon({ cat = 'operativa', icon = 'shield', size = 44, rounded = 12 }) {
  const k = T.cat[cat] || T.cat.operativa;
  return (
    <div style={{
      width: size, height: size, borderRadius: rounded,
      background: k.solid,
      display: 'grid', placeItems: 'center',
      boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
      flexShrink: 0,
    }}>
      <I name={icon} size={Math.round(size * 0.55)} color="#fff" strokeWidth={2.4} />
    </div>
  );
}

// ── Card with optional top color border (matches infopol web language) ──
function ColorCard({ cat = 'operativa', children, style = {}, padding = 18, onClick }) {
  const k = T.cat[cat] || T.cat.operativa;
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: T.r.lg,
      borderTop: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
      padding,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ── Phone-frame tab bar (bottom nav) ─────────────────────────────
function TabBar({ tabs, active, onChange, mode = 'operativa' }) {
  const accent = T.cat[mode === 'academia' ? 'academia' : 'operativa'].solid;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 28, paddingTop: 8,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${T.hairline}`,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          color: active === t.id ? accent : T.inkMuted,
          fontFamily: T.font, fontWeight: 700, fontSize: 10,
          letterSpacing: 0.2, textTransform: 'uppercase',
        }}>
          <I name={t.icon} size={24} strokeWidth={2.2} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Phone frame (matte, with notch + content area) ───────────────
function Phone({ children, dark = false, statusDark = false, w = 320, h = 660, style = {}, scrollable = true }) {
  const bg = dark ? '#0F0F14' : T.bg;
  return (
    <div style={{
      width: w, height: h, borderRadius: 38, position: 'relative',
      background: '#0a0a10', padding: 4,
      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 60px rgba(19,19,26,0.18), 0 0 0 1px rgba(0,0,0,0.4)',
      ...style,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 34, overflow: 'hidden',
        background: bg, position: 'relative',
        fontFamily: T.font, color: T.ink,
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 92, height: 26, borderRadius: 14, background: '#0a0a10',
          zIndex: 50,
        }} />
        <div style={{
          width: '100%', height: '100%',
          overflowY: scrollable ? 'auto' : 'hidden',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
        }} className="no-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Section header inside a screen ───────────────────────────────
function SectionHead({ kicker, kickerColor, title, action, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 16px', marginBottom: 10, ...style,
    }}>
      <div>
        {kicker && <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: kickerColor || T.inkMuted, marginBottom: 2,
        }}>{kicker}</div>}
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: -0.4 }}>{title}</div>
      </div>
      {action && <span style={{ color: T.cat.operativa.solid, fontWeight: 700, fontSize: 13 }}>{action}</span>}
    </div>
  );
}

// ── Search field ─────────────────────────────────────────────────
function SearchField({ placeholder = 'Cercar…', value, onChange, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#fff', borderRadius: T.r.pill,
      border: `1px solid ${T.hairline}`,
      padding: '11px 16px', boxShadow: T.shadow.card,
      ...style,
    }}>
      <I name="search" size={18} color={T.inkMuted} />
      <input
        value={value || ''}
        onChange={onChange}
        readOnly={!onChange}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 14, color: T.ink,
        }}
      />
      <div style={{
        width: 24, height: 24, borderRadius: 6, background: T.bg,
        display: 'grid', placeItems: 'center',
      }}><I name="mic" size={13} color={T.inkSoft} strokeWidth={2.2} /></div>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────
function ProgressBar({ value = 0, max = 100, color, height = 10, bg }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{
      width: '100%', height, borderRadius: height,
      background: bg || 'rgba(19,19,26,0.07)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: height,
        background: color || T.cat.academia.solid,
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.18)',
        transition: 'width .4s ease',
      }} />
    </div>
  );
}

Object.assign(window, {
  InfoPolLogo, InfoPolWordmark, StatusBar, HomeIndicator,
  Pill, CategoryTag, DuoButton, CatIcon, ColorCard,
  TabBar, Phone, SectionHead, SearchField, ProgressBar,
});
