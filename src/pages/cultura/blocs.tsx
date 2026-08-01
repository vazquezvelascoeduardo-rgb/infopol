// Els blocs del temari de cultura general, pintats amb els tokens v3.
//
// Abans aquest contingut vivia dins d'una sola pàgina amb la seva paleta
// pròpia en hexadecimal: es veia bé de dia i malament de nit, i no
// s'assemblava a la resta del temari. Aquí les peces són compartides,
// fan servir les variables del disseny i cada àrea només hi aporta el
// seu accent.
import type { CulturaArea, CulturaBlock } from '../../data/cultura-temari';
import { Mono, V } from '../../lib/v3';

/** L'accent d'una àrea: color ple, fons suau i color de text llegible. */
export type Pal = { solid: string; soft: string; ink: string };

export const PALETA: Record<string, Pal> = {
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

export function palDe(id: string): Pal {
  return PALETA[id] ?? { solid: V.terra, soft: V.terraSoft, ink: V.terraInk };
}

/** Quants fets té una àrea. Serveix per als comptadors de l'índex. */
export function compta(area: CulturaArea): number {
  let n = 0;
  for (const b of area.blocks) {
    if (b.k === 'defs' || b.k === 'records' || b.k === 'quotes') n += b.items.length;
    else if (b.k === 'table') n += b.rows.length;
    else if (b.k === 'chips') n += b.items.length;
    else if (b.k === 'works') n += b.items.reduce((s, it) => s + it.w.length, 0);
  }
  return n;
}

/** Text pla d'un bloc, per cercar-hi. */
export function textBloc(b: CulturaBlock): string {
  if (b.k === 'defs' || b.k === 'quotes' || b.k === 'records') {
    return (b.title || '') + ' ' + b.items.map((it) => it.join(' ')).join(' ');
  }
  if (b.k === 'table') return (b.title || '') + ' ' + b.head.join(' ') + ' ' + b.rows.map((r) => r.join(' ')).join(' ');
  if (b.k === 'chips') return (b.title || '') + ' ' + b.items.join(' ');
  if (b.k === 'works') return (b.title || '') + ' ' + b.items.map((it) => `${it.n} ${it.m || ''} ${it.w.join(' ')}`).join(' ');
  return '';
}

const targeta: React.CSSProperties = {
  background: V.surface, borderRadius: 20, border: `1px solid ${V.hair}`,
  padding: 22, boxShadow: V.shadow,
};

function TitolBloc({ children, c }: { children?: string; c: Pal }) {
  if (!children) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 7, height: 7, borderRadius: 2, background: c.solid, transform: 'rotate(45deg)' }} />
      <Mono size={12} color={c.solid} style={{ fontWeight: 800, letterSpacing: 1.6 }}>
        {children.toUpperCase()}
      </Mono>
    </div>
  );
}

export function Bloc({ b, i, c }: { b: CulturaBlock; i: number; c: Pal }) {
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
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 9, height: 9, borderRadius: 5, background: c.solid, marginTop: 7, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: V.ink, letterSpacing: -0.2, lineHeight: 1.3 }}>{it[0]}</div>
                  <div style={{ fontSize: 14, color: V.muted, lineHeight: 1.45, marginTop: 2 }}>{it[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'records':
      return (
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{
                padding: '14px 16px', borderRadius: 14, background: V.paper,
                border: `1px solid ${V.hair}`, borderLeft: `3px solid ${c.solid}`,
              }}>
                <Mono size={10.5} color={V.muted} style={{ fontWeight: 700, letterSpacing: 0.8, lineHeight: 1.35 }}>
                  {it[0].toUpperCase()}
                </Mono>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.solid, letterSpacing: -0.6, marginTop: 5, lineHeight: 1.05 }}>
                  {it[1]}
                </div>
                {it[2] && <div style={{ fontSize: 12, color: V.muted, marginTop: 4, lineHeight: 1.35 }}>{it[2]}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    case 'table':
      return (
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          {/* La taula scrolleja dins la seva caixa: a mòbil, si no, empeny
              tota la pàgina cap a la dreta. */}
          <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${V.hair}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 420 }}>
              <thead>
                <tr>
                  {b.head.map((h, k) => (
                    <th key={k} style={{
                      textAlign: 'left', padding: '11px 16px', background: c.soft, color: c.ink,
                      fontWeight: 800, fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase',
                      fontFamily: V.mono, borderBottom: `1px solid ${c.solid}22`, whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr key={ri} style={{ background: ri % 2 ? V.paper : V.surface }}>
                    {r.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: '10px 16px', color: ci === 0 ? V.ink : V.muted,
                        fontWeight: ci === 0 ? 700 : 500,
                        borderTop: ri ? `1px solid ${V.hair}` : 'none', lineHeight: 1.4,
                      }}>
                        {cell}
                      </td>
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
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {b.items.map((it, j) => (
              <span key={j} style={{
                padding: '7px 13px', borderRadius: 999, background: c.soft, color: c.ink,
                fontSize: 13, fontWeight: 700, border: `1px solid ${c.solid}22`,
              }}>
                {it}
              </span>
            ))}
          </div>
        </div>
      );
    case 'works':
      return (
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{ padding: '14px 16px', borderRadius: 14, background: V.paper, border: `1px solid ${V.hair}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: V.ink, letterSpacing: -0.3 }}>{it.n}</span>
                  {it.m && (
                    <Mono size={10.5} color={c.ink} style={{
                      fontWeight: 700, background: c.soft, padding: '2px 7px', borderRadius: 5, letterSpacing: 0.4,
                    }}>
                      {it.m}
                    </Mono>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {it.w.map((w, wi) => (
                    <div key={wi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ width: 5, height: 5, borderRadius: 3, background: c.solid, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, color: V.muted, lineHeight: 1.35 }}>{w}</span>
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
        <div style={targeta}>
          <TitolBloc c={c}>{b.title}</TitolBloc>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {b.items.map((it, j) => (
              <div key={j} style={{
                padding: '18px 20px', borderRadius: 14, background: c.soft,
                border: `1px solid ${c.solid}22`, position: 'relative',
              }}>
                <span aria-hidden style={{
                  position: 'absolute', top: 4, left: 14, fontSize: 44, fontWeight: 900,
                  color: c.solid, opacity: 0.32, lineHeight: 1, fontFamily: 'Georgia, serif',
                }}>
                  “
                </span>
                <p style={{
                  margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: c.ink, lineHeight: 1.4,
                  letterSpacing: -0.2, position: 'relative', paddingLeft: 18,
                }}>
                  {it[0]}
                </p>
                <Mono size={12} color={c.ink} style={{ fontWeight: 700, opacity: 0.75, paddingLeft: 18, letterSpacing: 0.6 }}>
                  — {it[1].toUpperCase()}
                </Mono>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}
