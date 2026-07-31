// Peces del disseny v3 ("InfoPol Web App").
//
// Els colors no viuen aquí sinó a les variables CSS --v-* de index.css:
// així el mode fosc funciona sol i el JS no ha de saber en quin tema
// estem. Aquí només hi ha el joc d'icones i uns quants components que
// es repeteixen a totes les pantalles.
import type { CSSProperties, ReactNode } from 'react';

/** Variables de la paleta, per fer servir des de JS. */
export const V = {
  paper: 'var(--v-paper)',
  surface: 'var(--v-surface)',
  surface2: 'var(--v-surface2)',
  ink: 'var(--v-ink)',
  inkFixed: 'var(--v-ink-fixed)',
  fill: 'var(--v-fill)',
  fillFg: 'var(--v-fill-fg)',
  muted: 'var(--v-muted)',
  faint: 'var(--v-faint)',
  border: 'var(--v-border)',
  hair: 'var(--v-hair)',
  terra: 'var(--v-terra)',
  terraInk: 'var(--v-terra-ink)',
  terraSoft: 'var(--v-terra-soft)',
  blue: 'var(--v-blue)',
  blueSoft: 'var(--v-blue-soft)',
  granate: 'var(--v-granate)',
  granateSoft: 'var(--v-granate-soft)',
  ok: 'var(--v-ok)',
  okSoft: 'var(--v-ok-soft)',
  warn: 'var(--v-warn)',
  warnSoft: 'var(--v-warn-soft)',
  shadow: '0 4px 14px var(--v-shadow)',
  shadowLg: '0 14px 30px var(--v-shadow)',
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
} as const;

/** Radis del disseny. */
export const RV = { xs: 8, sm: 11, md: 16, lg: 20, xl: 24, pill: 99 } as const;

// Traços de les icones, tal com venen del disseny. Cada entrada és una
// llista de paths que es dibuixen amb el mateix gruix.
const ICO: Record<string, string[]> = {
  home: ['M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19Z', 'M9.5 20.5v-6h5v6'],
  cap: ['M2.5 8.5 12 4.5l9.5 4-9.5 4Z', 'M6 10.6V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.4'],
  siren: ['M8 17.2a4 4 0 0 1 8 0', 'M12 8v2.2M6.4 11.1l1.5 1.5M17.6 11.1l-1.5 1.5', 'M3.8 17.2h16.4M4.5 20.6h15'],
  person: ['M12 4.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z', 'M5.5 20c.6-3.5 3.3-5.6 6.5-5.6s5.9 2.1 6.5 5.6'],
  book: ['M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v12.5a1.5 1.5 0 0 1-1.5 1.5H6a2 2 0 0 1-2-2Z', 'M8 9h8M8 13h5'],
  brain: [
    'M9.5 4.5A2.5 2.5 0 0 0 7 7v.4A2.6 2.6 0 0 0 5 10c0 1 .5 1.8 1.2 2.3A2.6 2.6 0 0 0 5.4 14c0 1.6 1.4 2.9 3.1 2.9h1V4.5Z',
    'M14.5 4.5A2.5 2.5 0 0 1 17 7v.4A2.6 2.6 0 0 1 19 10c0 1-.5 1.8-1.2 2.3a2.6 2.6 0 0 1 .8 1.7c0 1.6-1.4 2.9-3.1 2.9h-1V4.5Z',
    'M12 4.5v15',
  ],
  check: ['M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z', 'M8.4 12.2l2.6 2.6 4.6-5'],
  layers: ['M12 3.5 3.5 8 12 12.5 20.5 8Z', 'M3.5 12 12 16.5 20.5 12', 'M3.5 16 12 20.5 20.5 16'],
  chart: ['M5 19V11M10 19V6M15 19v-5M20 19v-9'],
  medal: ['M12 9.9a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z', 'M8.5 4.5 12 10l3.5-5.5'],
  city: ['M4 20V9l5-3v14', 'M9 20h11V12l-5-2', 'M13 15h1.5M13 18h1.5M17 15h1.5M17 18h1.5'],
  globe: [
    'M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z',
    'M3.8 12h16.4',
    'M12 3.8c2.2 2.3 3.3 5.1 3.3 8.2S14.2 17.9 12 20.2c-2.2-2.3-3.3-5.1-3.3-8.2S9.8 6.1 12 3.8Z',
  ],
  cards: ['M9 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z', 'M4.5 7v10.5A2 2 0 0 0 6.5 19.5'],
  search: ['M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z', 'm16 16 4 4'],
  doc: ['M14 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9Z', 'M14 4v5h5', 'M8.5 13h7M8.5 16.5h5'],
  pen: ['M4.5 19.5h4L20 8a2.1 2.1 0 0 0-3-3L5.5 16.5Z', 'M14.5 6.5 18 10'],
  scales: ['M12 4v16M6 8h12M8 20h8', 'M6 8 3.5 13.5h5Z', 'M18 8l-2.5 5.5h5Z'],
  pill: ['M7.25 9h9.5a3.25 3.25 0 0 1 0 6.5h-9.5a3.25 3.25 0 0 1 0-6.5Z', 'M12 9v6.5'],
  scooter: [
    'M6 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM18.5 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z',
    'M8.5 17.5h7.5L14 7h-2.5',
    'M11.5 7 8 17.5',
  ],
  tree: ['M9.5 3h5v3h-5Z', 'M12 6v4.5M6.5 10.5h11M6.5 10.5v1.6M17.5 10.5v1.6', 'M4 12.1h5v3.2H4ZM15 12.1h5v3.2h-5Z'],
  flame: ['M13 2.5c.5 3.2-1.2 4.6-2.6 6C9 9.9 7.5 11.3 7.5 14a5.5 5.5 0 0 0 11 0c0-3.4-2.3-5.2-3.9-7-1-1.1-1.7-2.2-1.6-4.5Z'],
  bolt: ['M13.5 2 5 13h5l-1 9 9-11.5h-5.2Z'],
  gem: ['M12 3 4 9.5 12 21l8-11.5Z'],
  news: ['M5.5 5.5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z', 'M7 9.5h5M7 13h8'],
  moon: ['M20 14.5A8.5 8.5 0 1 1 10.2 4a7 7 0 0 0 9.8 10.5Z'],
  sun: [
    'M12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z',
    'M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4',
  ],
  text: ['M5 6.5V5h14v1.5', 'M12 5v14M9 19h6'],
  bell: ['M12 3.5a5.5 5.5 0 0 1 5.5 5.5c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5A5.5 5.5 0 0 1 12 3.5Z', 'M10 18a2 2 0 0 0 4 0'],
  lock: ['M7 10.5h10a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 17 20H7a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 7 10.5Z', 'M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5'],
  device: ['M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5Z', 'M10.5 17.5h3'],
  calendar: ['M6 5.5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z', 'M4 10h16M8.5 3.5v3M15.5 3.5v3'],
  arrow: ['m9.5 5.5 6.5 6.5-6.5 6.5'],
  back: ['M14.5 5.5 8 12l6.5 6.5'],
  x: ['M6 6l12 12M18 6 6 18'],
  menu: ['M4 7h16M4 12h16M4 17h16'],
  play: ['M9 5.5v13l10-6.5Z'],
  clock: ['M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z', 'M12 8.4V12l2.4 1.6'],
  car: ['M5 16.5h14', 'M6.5 16.5V12l1.8-4.2h7.4L17.5 12v4.5', 'M7.5 19v-2.5M16.5 19v-2.5'],
  crash: ['M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5Z'],
  logout: ['M15 8.5V6a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 15 18v-2.5', 'M10 12h10M17 9l3 3-3 3'],
};

export type NomIc = keyof typeof ICO | string;

/** Icona de traç del disseny. */
export function I({
  n, size = 20, color = 'currentColor', sw = 1.9, style = {},
}: { n: NomIc; size?: number; color?: string; sw?: number; style?: CSSProperties }) {
  const paths = ICO[n] || [];
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/** Text mono en versaletes: els "kickers" del disseny. */
export function Mono({
  children, size = 9.5, color = V.muted, style = {},
}: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: V.mono, fontSize: size, letterSpacing: 1.4, color, ...style }}>
      {children}
    </span>
  );
}

/** Targeta blanca amb ombra suau — la unitat bàsica de tot el disseny. */
export function CardV({
  children, pad = 22, r = RV.xl, style = {}, onClick,
}: { children: ReactNode; pad?: number; r?: number; style?: CSSProperties; onClick?: () => void }) {
  const s: CSSProperties = {
    background: V.surface, borderRadius: r, padding: pad, boxShadow: V.shadow, ...style,
  };
  if (!onClick) return <div style={s}>{children}</div>;
  return (
    <button type="button" onClick={onClick} style={{ ...s, border: 'none', cursor: 'pointer', textAlign: 'left', color: V.ink, width: '100%' }}>
      {children}
    </button>
  );
}

/**
 * Titular de pantalla del disseny: pes lleuger en gris amb les paraules
 * fortes en negre. Es passa el text partit perquè cada pantalla decideixi
 * què vol destacar.
 */
export function TitolV({ pre, fort, post }: { pre?: string; fort: string; post?: string }) {
  return (
    <h1 style={{
      fontSize: 32, letterSpacing: -1.5, lineHeight: 1.08, margin: 0,
      fontWeight: 400, color: V.muted,
    }}>
      {pre ? `${pre} ` : ''}
      <span style={{ fontWeight: 800, color: V.ink }}>{fort}</span>
      {post ? ` ${post}` : ''}
    </h1>
  );
}

/** Píndola petita d'estat. */
export function XipV({
  children, bg = V.surface2, fg = V.ink,
}: { children: ReactNode; bg?: string; fg?: string }) {
  return (
    <span style={{
      background: bg, color: fg, fontSize: 11.5, fontWeight: 700,
      borderRadius: RV.pill, padding: '6px 13px', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
