// Sistema de disseny compartit (Claude Design 2026).
// Paleta, iconografia, tipografies i àtoms (Mono, Card, PageHead, Btn,
// Chip) reutilitzables a totes les pàgines perquè tinguin el mateix
// llenguatge visual que Home, Operativa i Acadèmia.
//
// Les pàgines de contingut es renderitzen DINS del Layout global (topbar
// + footer), per això aquí no hi ha shell; només els blocs interiors.
import { type CSSProperties, type ReactNode } from 'react';

/* ── Tokens ──
   Són els mateixos colors que les variables --v-* de index.css, però
   escrits en hexadecimal. Cal que ho siguin: el croquis dibuixa sobre
   un <canvas> (Konva) i allà una variable CSS no vol dir res.

   La paleta v3 és curta a propòsit — terracota, blau, granat, verd i
   ambre. El lila, el rosa i el turquesa que hi havia abans ara hi
   apunten; es manté el nom perquè les pàgines que els feien servir no
   s'hagin de tocar una per una. */
export const A = {
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
  rlg: 22, rxl: 24,
  shadow: '0 4px 14px rgba(21,21,28,0.07)',
  shadowMd: '0 14px 30px rgba(21,21,28,0.09)',
  shadowLg: '0 30px 70px rgba(21,21,28,0.16)',
  inset: 'none',
};

export type Tone = { solid: string; soft: string; ink: string };
export const TONE: Record<string, Tone> = {
  terracota: { solid: A.terracota, soft: A.terraSoft, ink: A.terraInk },
  blue: { solid: A.blue, soft: A.blueSoft, ink: A.blueInk },
  green: { solid: A.green, soft: A.greenSoft, ink: A.greenInk },
  red: { solid: A.red, soft: A.redSoft, ink: A.redInk },
  purple: { solid: A.purple, soft: A.purpleSoft, ink: A.purpleInk },
  amber: { solid: A.amber, soft: A.amberSoft, ink: '#6B3F08' },
  pink: { solid: A.pink, soft: A.pinkSoft, ink: '#7A1B53' },
  teal: { solid: A.teal, soft: A.tealSoft, ink: '#0A4F56' },
  night: { solid: A.night, soft: '#E7E8EE', ink: A.night },
};
export const toneOf = (t: string): Tone => TONE[t] || TONE.blue;

/* ── Iconografia (SVG inline, stroke) ── */
export function Ic({ name, size = 22, color = 'currentColor', sw = 2, fill = false }: { name: string; size?: number; color?: string; sw?: number; fill?: boolean }) {
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
    case 'arrowL': return <svg {...c}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
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
    case 'mail': return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case 'lock': return <svg {...c}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case 'user': return <svg {...c}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'logout': return <svg {...c}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>;
    case 'google': return <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.05 5.05 0 0 1-2.19 3.32v2.75h3.54c2.07-1.9 3.27-4.71 3.27-8.06z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.75c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.3-1.94-6.17-4.55H2.18v2.84A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.65-2.84z" /><path fill="#EA4335" d="M12 5.27c1.62 0 3.07.56 4.21 1.65l3.14-3.14C17.45 2.02 14.96 1 12 1A11 11 0 0 0 2.18 7.07l3.65 2.84C6.7 7.3 9.13 5.27 12 5.27z" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'clock': return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'fire': return <svg {...c}><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3 .2 1 .8 1.8 1.5 2 .2-2.7 1-5.3 1.5-7z" /></svg>;
    case 'trophy': return <svg {...c}><path d="M8 4h8v4a4 4 0 0 1-8 0V4z" /><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 13h4M9 20h6M12 16v4" /></svg>;
    case 'cards': return <svg {...c}><rect x="3" y="5" width="13" height="16" rx="2" /><path d="M8 5l3-2 9 3-2 13" /></svg>;
    case 'warn': return <svg {...c}><path d="M12 3l9 16H3l9-16z" /><path d="M12 10v4M12 17h.01" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

/* ── Àtoms ──
   Aquestes cinc peces les fan servir totes les pàgines interiors
   (lleis, tests, esquemes, recursos, mossos…). Per això el disseny v3
   s'aplica AQUÍ i no pàgina per pàgina: canviant-les, tot l'interior
   passa al llenguatge nou de cop i amb la mateixa coherència. */

export function Mono({ children, color, size = 11, style = {} }: { children: ReactNode; color?: string; size?: number; style?: CSSProperties }) {
  return <span style={{ fontFamily: A.mono, fontWeight: 600, fontSize: size, letterSpacing: 1.2, textTransform: 'uppercase', color: color || A.inkMuted, ...style }}>{children}</span>;
}

/**
 * Targeta v3: blanca, cantonada de 24 i ombra suau. Sense vora — la
 * vora i l'ombra alhora embrutaven, i el disseny fa servir només ombra.
 */
export function Card({ children, pad = 22, style = {}, onClick, hover = false, className = '' }: { children: ReactNode; pad?: number; style?: CSSProperties; onClick?: () => void; hover?: boolean; className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`${hover ? 'a-hover' : ''} ${className}`.trim()}
      style={{
        background: A.card, borderRadius: 28, padding: pad, boxShadow: A.shadow,
        cursor: onClick ? 'pointer' : 'default', ...style,
      }}>
      {children}
    </div>
  );
}

/**
 * Capçalera de pàgina v3.
 *
 * El titular va en dos pesos: gris fi per al context i negre gruixut per
 * a la paraula que importa. Si es passa `kicker`, va a sobre en mono,
 * però discret — al disseny els kickers no criden.
 */
export function PageHead({ kicker, title, desc, accent = A.terraInk, align = 'left' }: { kicker?: string; title: string; desc?: ReactNode; accent?: string; align?: 'left' | 'center' }) {
  // "Lleis i normativa" → "Lleis" fort + " i normativa" fi.
  const tall = title.indexOf(' ');
  const fort = tall > 0 ? title.slice(0, tall) : title;
  const resta = tall > 0 ? title.slice(tall) : '';
  return (
    <div style={{
      marginBottom: 22, textAlign: align,
      maxWidth: align === 'center' ? 720 : undefined,
      marginLeft: align === 'center' ? 'auto' : undefined,
      marginRight: align === 'center' ? 'auto' : undefined,
    }}>
      {kicker && <Mono color={accent} size={9.5} style={{ letterSpacing: 1.6, display: 'block', marginBottom: 8 }}>{kicker}</Mono>}
      <h1 style={{
        margin: 0, fontFamily: A.display, fontWeight: 400, color: A.inkMuted,
        fontSize: 'clamp(25px,3.4vw,32px)', letterSpacing: -1.5, lineHeight: 1.08,
      }}>
        <span style={{ fontWeight: 800, color: A.ink }}>{fort}</span>{resta}
      </h1>
      {desc && (
        <p style={{
          margin: '8px 0 0', fontFamily: A.sans, fontSize: 13.5, color: A.inkMuted,
          maxWidth: 620, lineHeight: 1.5,
          marginLeft: align === 'center' ? 'auto' : undefined,
          marginRight: align === 'center' ? 'auto' : undefined,
        }}>
          {desc}
        </p>
      )}
    </div>
  );
}

/** Botó v3: píndola de tinta plena, sense ombra de color. */
export function Btn({ children, onClick, type = 'button', tone = A.ink, fg = '#fff', icon, full = false, style = {} }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; tone?: string; fg?: string; icon?: string; full?: boolean; style?: CSSProperties }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="a-btn"
      style={{
        display: 'inline-flex', width: full ? '100%' : undefined, justifyContent: 'center',
        alignItems: 'center', gap: 9, background: tone, color: fg, border: 'none',
        cursor: 'pointer', borderRadius: 999, padding: '13px 22px',
        fontFamily: A.display, fontWeight: 700, fontSize: 14.5, ...style,
      }}>
      {children}{icon && <Ic name={icon} size={17} color={fg} sw={2.3} />}
    </button>
  );
}

/** Píndola d'etiqueta v3: sense mono ni versaletes, com al disseny. */
export function Chip({ children, tone = 'blue', solid = false }: { children: ReactNode; tone?: string; solid?: boolean }) {
  const k = toneOf(tone);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: solid ? k.solid : k.soft, color: solid ? '#fff' : k.ink,
      fontFamily: A.sans, fontWeight: 700, fontSize: 11.5,
      padding: '6px 13px', borderRadius: 999, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/**
 * Contenidor de pàgina.
 *
 * Ja no centra amb marge propi: dins del marc v3 el contingut comença on
 * comença la resta de pantalles, amb el mateix padding. Així una fitxa de
 * llei i la pantalla d'Acadèmia queden alineades.
 */
export function Shell({ children, max = 1100, style = {} }: { children: ReactNode; max?: number; style?: CSSProperties }) {
  return (
    <div
      className="v3-page v3-anim"
      style={{ width: '100%', maxWidth: max, margin: '0 auto', ...style }}>
      {children}
    </div>
  );
}
