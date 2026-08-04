// El marc del "mode focus" — el que envolta qualsevol test mentre el fas.
//
// Viu aquí i no dins d'una pantalla perquè el fan servir els dos tipus de
// test: el de temari (`pages/test/TestSession.tsx`) i el de psicotècnics
// (`pages/psico/PsicoSessio.tsx`). Abans cadascun es dibuixava la seva
// capçalera i el seu peu, i es notava: al de psicos no hi havia ni botó
// d'acabar, ni fletxa d'enrere, ni "Següent" com a la resta.
//
// Aquí hi ha només el marc —barra de dalt, progrés, peu i el diàleg de
// confirmació—. Què hi ha al mig (un enunciat amb quatre respostes, o un
// dibuix amb cinc cubs) el posa cada pantalla.
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** La paleta del mode focus. Va a part de les `--v-*` perquè aquesta
 *  pantalla no canvia amb el tema: sempre és clara, com un examen. */
export const FP = {
  bg: '#F4F1EC', bgDeep: '#EFEAE2', card: '#FFFFFF',
  ink: '#15151C', inkSoft: '#4A463F', inkMuted: '#6E6A63', inkFaint: '#9A938A',
  hairline: 'rgba(21,21,28,0.07)', line2: '#E5DFD5',
  terracota: '#FF7A1A', terraSoft: '#FFEDDD', terraInk: '#C4530A',
  green: '#186B47', greenSoft: '#E1F0E8', greenInk: '#186B47',
  red: '#991B1B', redSoft: '#F7E5E5', redInk: '#991B1B',
  display: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
} as const;

export function FIc({ name, size = 20, color = 'currentColor', sw = 2 }:
  { name: string; size?: number; color?: string; sw?: number }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'x': return <svg {...c}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case 'check': return <svg {...c}><path d="M5 12l4 4 10-10" /></svg>;
    case 'clock': return <svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'arrow': return <svg {...c}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrowL': return <svg {...c}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case 'keyboard': return <svg {...c}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

/** A mòbil el marc s'aprima: fora rellotge i text dels botons. */
export function useEsMobil(limit = 640) {
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return vw < limit;
}

const pastilla = {
  fontFamily: FP.mono, fontWeight: 600, fontSize: 13, background: FP.card,
  padding: '9px 14px', borderRadius: 999,
  boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.05)',
} as const;

/**
 * La barra de dalt: sortir, on ets, quant portes, quantes en portes bé i
 * el botó d'acabar. La creu i "Acabar ara" fan el mateix, i les dues hi
 * han de ser: ningú diria que "sortir" vol dir corregir i veure la nota.
 */
export function BarraFocus({
  index, total, encerts, temps, perillTemps = false, etiquetaAcabar, onAcabar, esMobil,
}: {
  index: number;
  total: number;
  /** Quantes en portes bé. Si és `null`, no es mostra el comptador. */
  encerts: number | null;
  /** El rellotge ja formatat (mm:ss). */
  temps: string;
  /** Pinta el rellotge de vermell (queda poc temps). */
  perillTemps?: boolean;
  etiquetaAcabar: string;
  onAcabar: () => void;
  esMobil: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: esMobil ? 8 : 10, minWidth: 0 }}>
        <button onClick={onAcabar} aria-label={etiquetaAcabar} style={{
          width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer', background: FP.card,
          boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.06)',
          display: 'grid', placeItems: 'center', color: FP.inkSoft, flexShrink: 0,
        }}><FIc name="x" size={18} /></button>
        <span style={{
          ...pastilla, fontSize: esMobil ? 12 : 13, padding: esMobil ? '8px 12px' : '9px 14px',
          color: FP.inkSoft, whiteSpace: 'nowrap',
        }}>
          {esMobil ? '' : 'Pregunta '}<span style={{ color: FP.ink }}>{index + 1}</span>/{total}
        </span>
        {!esMobil && (
          <span style={{ ...pastilla, color: perillTemps ? FP.redInk : FP.inkMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
            <FIc name="clock" size={14} color={perillTemps ? FP.red : FP.inkMuted} />{temps}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {encerts !== null && (
          <span style={{
            fontFamily: FP.mono, fontWeight: 700, fontSize: 13, color: FP.greenInk, background: FP.greenSoft,
            padding: esMobil ? '8px 12px' : '9px 14px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
          }}>
            <FIc name="check" size={14} color={FP.green} sw={3} />{encerts}/{total}
          </span>
        )}
        <button onClick={onAcabar} style={{
          fontFamily: FP.mono, fontWeight: 700, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase',
          color: FP.greenInk, background: FP.greenSoft, border: `1px solid ${FP.green}`,
          padding: esMobil ? '8px 12px' : '9px 16px', borderRadius: 999, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
        }}>
          {!esMobil && <FIc name="check" size={14} color={FP.green} sw={3} />}
          {etiquetaAcabar}
        </button>
      </div>
    </div>
  );
}

/**
 * El progrés. Per a tests curts, un segment per pregunta; per a llargs,
 * una barra i prou — dibuixar tres-cents segments només fa una ratlla
 * borrosa i molta feina al navegador.
 */
export function ProgresFocus({
  index, estat,
}: {
  index: number;
  /** Per cada pregunta: null = sense contestar, true/false = bé/malament. */
  estat: (boolean | null)[];
}) {
  const total = estat.length;
  if (total > 60) {
    return (
      <div style={{ flexShrink: 0, height: 6, borderRadius: 999, background: FP.line2, overflow: 'hidden' }}
        role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index + 1}>
        <div style={{
          width: `${Math.round(((index + 1) / total) * 100)}%`, height: '100%',
          borderRadius: 999, background: FP.terracota, transition: 'width .25s',
        }} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 4, flexShrink: 0, height: 6 }}
      role="progressbar" aria-valuemin={0} aria-valuemax={total}
      aria-valuenow={estat.filter((e) => e !== null).length}>
      {estat.map((e, i) => {
        let bg: string = FP.line2;
        if (e !== null) bg = e ? FP.green : FP.red;
        if (i === index) bg = FP.terracota;
        return <div key={i} style={{ flex: 1, height: '100%', borderRadius: 999, background: bg, transition: 'background .25s' }} />;
      })}
    </div>
  );
}

/** El peu: enrere i endavant. A mòbil, "Següent" ocupa tota l'amplada. */
export function PeuFocus({
  potEnrere, onEnrere, onSeguent, etiquetaSeguent, etiquetaEnrere, esMobil,
}: {
  potEnrere: boolean;
  onEnrere: () => void;
  onSeguent: () => void;
  etiquetaSeguent: string;
  etiquetaEnrere: string;
  esMobil: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, width: esMobil ? '100%' : 'auto' }}>
      <button onClick={onEnrere} disabled={!potEnrere} aria-label={etiquetaEnrere} style={{
        width: 48, height: 50, borderRadius: 14, cursor: potEnrere ? 'pointer' : 'default', flexShrink: 0,
        background: FP.card, border: `1px solid ${FP.line2}`, color: potEnrere ? FP.inkSoft : FP.inkFaint,
        display: 'grid', placeItems: 'center', opacity: potEnrere ? 1 : 0.5,
        boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 4px 12px rgba(19,19,26,0.05)',
      }}><FIc name="arrowL" size={20} /></button>
      <button onClick={onSeguent} style={{
        height: 50, flex: esMobil ? 1 : undefined, padding: '0 24px', borderRadius: 14, border: 'none',
        cursor: 'pointer', background: FP.terracota, color: '#fff', fontFamily: FP.display,
        fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)',
      }}>
        {etiquetaSeguent}
        <FIc name="arrow" size={19} color="#fff" sw={2.4} />
      </button>
    </div>
  );
}

/** El diàleg de "segur que vols acabar?", amb la mateixa cara que els
 *  fulls de configuració: sura al mig sobre el fons difuminat. */
export function DialegFocus({
  titol, text, cancella, confirma, onCancella, onConfirma,
}: {
  titol: string;
  text: string;
  cancella: string;
  confirma: string;
  onCancella: () => void;
  onConfirma: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancella(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancella]);

  return createPortal((
    <div className="ap-vel">
      <button type="button" aria-label={cancella} onClick={onCancella}
        style={{ position: 'absolute', inset: 0, background: 'none', border: 'none', cursor: 'pointer' }} />
      <div role="dialog" aria-modal="true" className="ap-full" style={{ maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 18 }}>
          <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }} aria-hidden>⚠️</span>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: -0.5, color: 'var(--v-ink)' }}>
              {titol}
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.45, color: 'var(--v-muted)' }}>
              {text}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onCancella} style={{
            flex: 1, cursor: 'pointer', border: '1px solid var(--v-border)', borderRadius: 16,
            padding: '14px 18px', background: 'var(--v-surface)', color: 'var(--v-ink)',
            fontSize: 14.5, fontWeight: 700,
          }}>{cancella}</button>
          <button type="button" className="ap-prem" onClick={onConfirma} style={{
            flex: 1, cursor: 'pointer', border: 'none', borderRadius: 16, padding: '14px 18px',
            background: 'var(--v-granate)', color: '#fff', fontSize: 14.5, fontWeight: 800,
          }}>{confirma}</button>
        </div>
      </div>
    </div>
  ), document.body);
}

/** Embolcall de tota la pantalla en mode focus. */
export function MarcFocus({ children, esMobil, style = {} }:
  { children: ReactNode; esMobil: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 120, background: FP.bg,
      display: 'flex', flexDirection: 'column',
      padding: esMobil
        ? '12px 14px calc(12px + env(safe-area-inset-bottom))'
        : '20px clamp(16px,5vw,64px)',
      gap: esMobil ? 11 : 16, overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', fontFamily: FP.sans, color: FP.ink,
      ...style,
    }}>
      {children}
    </div>
  );
}
