import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from './Icon';

// ── Logo ──────────────────────────────────────────────────────────
export function InfoPolLogo({ size = 28, color }) {
  const c = color || T.cat.operativa.solid;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M16 3l11 4v8.5C27 22 22.3 27.5 16 29 9.7 27.5 5 22 5 15.5V7l11-4z" fill={c} />
      <path d="M11 14h10M11 18h7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="22" cy="18" r="1.2" fill="#fff"/>
    </svg>
  );
}

export function InfoPolWordmark({ height = 22, color }) {
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

// ── Status Bar ───────────────────────────────────────────────────
export function StatusBar({ dark = false }) {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const c = dark ? '#fff' : T.ink;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px 6px', height: 48, boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: T.fontMono, fontWeight: 700, fontSize: 14, color: c }}>{time}</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Icon name="signal" size={15} color={c} />
        <Icon name="wifi" size={15} color={c} />
        <Icon name="battery" size={22} color={c} />
      </div>
    </div>
  );
}

// ── Badges & pills ───────────────────────────────────────────────
export function Pill({ children, bg, fg, size = 11, weight = 700, style = {} }) {
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

// ── Chunky Duolingo-style button ─────────────────────────────────
export function DuoButton({ children, color, onClick, full, leftIcon, style = {}, type = 'button' }) {
  const k = color ? T.cat[color] : T.cat.academia;
  return (
    <button type={type} onClick={onClick} style={{
      position: 'relative', border: 'none', cursor: 'pointer',
      width: full ? '100%' : undefined,
      padding: '14px 22px', borderRadius: 16,
      background: k.solid, color: '#fff',
      fontFamily: T.font, fontWeight: 800, fontSize: 15,
      letterSpacing: 0.4, textTransform: 'uppercase',
      boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.18)`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style,
    }}>
      {leftIcon && <Icon name={leftIcon} size={18} color="#fff" />}
      {children}
    </button>
  );
}

// ── Category icon ─────────────────────────────────────────────────
export function CatIcon({ cat = 'operativa', icon = 'shield', size = 44, rounded = 12 }) {
  const k = T.cat[cat] || T.cat.operativa;
  return (
    <div style={{
      width: size, height: size, borderRadius: rounded,
      background: k.solid,
      display: 'grid', placeItems: 'center',
      boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
      flexShrink: 0,
    }}>
      <Icon name={icon} size={Math.round(size * 0.55)} color="#fff" strokeWidth={2.4} />
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────
export function TabBar({ tabs, active, mode = 'operativa', onNavigate }) {
  const navigate = useNavigate();
  const accent = T.cat[mode === 'academia' ? 'academia' : 'operativa'].solid;
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      paddingTop: 8,
      background: 'rgba(246,244,239,0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${T.hairline}`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => {
          if (onNavigate) onNavigate(t.path);
          else navigate(t.path);
        }} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '4px 10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          color: active === t.id ? accent : T.inkMuted,
          fontFamily: T.font, fontWeight: 700, fontSize: 10,
          letterSpacing: 0.2, textTransform: 'uppercase',
          transition: 'color 0.15s',
        }}>
          <Icon name={t.icon} size={24} strokeWidth={2.2} color={active === t.id ? accent : T.inkMuted} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color, height = 10, bg }) {
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

// ── Search field ──────────────────────────────────────────────────
export function SearchField({ placeholder = 'Cercar…', value, onChange, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#fff', borderRadius: T.r.pill,
      border: `1px solid ${T.hairline}`,
      padding: '11px 16px', boxShadow: T.shadow.card,
      ...style,
    }}>
      <Icon name="search" size={18} color={T.inkMuted} />
      <input
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: T.font, fontSize: 14, color: T.ink,
        }}
      />
      <div style={{
        width: 24, height: 24, borderRadius: 6, background: T.bg,
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="mic" size={13} color={T.inkSoft} strokeWidth={2.2} />
      </div>
    </div>
  );
}

// ── Section head ──────────────────────────────────────────────────
export function SectionHead({ kicker, kickerColor, title, action, onAction, style = {} }) {
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
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: T.cat.operativa.solid, fontWeight: 700, fontSize: 13, fontFamily: T.font,
        }}>{action}</button>
      )}
    </div>
  );
}

// ── Nav header (back arrow + title) ──────────────────────────────
export function NavHeader({ cat = 'operativa', kicker, title, back, extra }) {
  const navigate = useNavigate();
  const k = T.cat[cat];
  return (
    <div style={{ padding: '8px 16px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {back && (
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
        )}
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        </div>
        {extra && <div style={{ marginLeft: 'auto' }}>{extra}</div>}
      </div>
      <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>{title}</h1>
    </div>
  );
}

// ── Section title (kicker inside screen) ─────────────────────────
export function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: T.font, fontWeight: 800, fontSize: 11,
      letterSpacing: 1.2, textTransform: 'uppercase',
      color: T.inkMuted, marginBottom: 8,
    }}>{children}</div>
  );
}

// ── Round icon button ─────────────────────────────────────────────
export function RoundIconBtn({ icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 999, background: '#fff',
      border: `1px solid ${T.hairline}`, boxShadow: T.shadow.card,
      display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
    }}>
      <Icon name={icon} size={18} color={T.inkSoft} strokeWidth={2.2} />
    </button>
  );
}

// ── Streak badge ──────────────────────────────────────────────────
export function Streak({ n }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: T.cat.alcohol.soft, color: T.cat.alcohol.ink,
      padding: '6px 10px', borderRadius: 999,
      fontFamily: T.font, fontWeight: 800, fontSize: 13,
    }}>
      <Icon name="flame" size={14} color={T.cat.alcohol.solid} />{n}
    </div>
  );
}

// ── Gem badge ─────────────────────────────────────────────────────
export function GemBadge({ n }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: T.cat.tests.soft, color: T.cat.tests.ink,
      padding: '6px 10px', borderRadius: 999,
      fontFamily: T.font, fontWeight: 800, fontSize: 13,
    }}>
      <Icon name="gem" size={14} color={T.cat.tests.solid} />{n}
    </div>
  );
}
