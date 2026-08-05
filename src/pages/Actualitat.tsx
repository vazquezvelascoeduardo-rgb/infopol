// Pàgina d'índex d'Actualitat 2025-2026.
// Mateix patró que Cultura general: capçalera, blocs temàtics inclosos al
// pool i el test mesclat al final.
// Categoria 'actualitat' — no entra al pool combinat del temari oficial.
import { useNavigate } from 'react-router-dom';

import Capcalera from '../components/Capcalera';
import { TOPICS } from '../data/tests';
import { I, Mono, V } from '../lib/v3';

// Blocs temàtics inclosos al pool d'Actualitat (informatiu, sense link).
const BLOCS = [
  { ico: '🏛️', label: 'Càrrecs Catalunya' },
  { ico: '🇪🇸', label: 'Càrrecs Espanya' },
  { ico: '🌍', label: 'Càrrecs internacionals' },
  { ico: '✝️', label: 'Vaticà i casa reial' },
  { ico: '🏆', label: 'Premis i cultura' },
  { ico: '🎬', label: 'Oscars, Goyas, Grammy' },
  { ico: '⚽', label: 'Esports i Eurovisió' },
  { ico: '📰', label: 'Actualitat política i social' },
];

export default function Actualitat() {
  const nav = useNavigate();
  const topics = TOPICS.filter((tp) => tp.category === 'actualitat');

  return (
    <div className="v3-page v3-anim">
      <Capcalera
        kicker="Actualitat 2025–2026"
        titol="Actualitat"
        lead="Càrrecs vigents, premis, esports i fets clau que cauen a l'examen. Actualitzat l'1 d'agost del 2026."
        xifres={[
          { valor: String(BLOCS.length), label: 'blocs temàtics' },
        ]}
      />

      <Mono size={10} color={V.muted} style={{ letterSpacing: 1.6 }}>QUÈ HI ENTRA</Mono>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '11px 0 24px' }}>
        {BLOCS.map((b) => (
          <span
            key={b.label}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 13px', background: V.surface, border: `1px solid ${V.hair}`,
              borderRadius: 999, fontSize: 12.5, fontWeight: 600, color: V.muted,
            }}>
            <span aria-hidden>{b.ico}</span>
            {b.label}
          </span>
        ))}
      </div>

      {/* Cada recull, per separat. Abans només hi havia el test mesclat i
          no hi havia manera de fer només l'últim, que és el que interessa
          quan ja t'has estudiat la resta. */}
      {topics.length > 1 && (
        <>
      <Mono size={10} color={V.muted} style={{ letterSpacing: 1.6 }}>ELS RECULLS</Mono>
      <div style={{ display: 'grid', gap: 10, margin: '11px 0 22px' }}>
        {topics.map((tp) => (
          <button
            key={tp.slug}
            type="button"
            onClick={() => nav(`/actualitat/${tp.slug}`)}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              border: `1px solid ${V.border}`, borderRadius: 18, padding: 16,
              background: V.surface, color: V.ink,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
            <span style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: V.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }} aria-hidden>{tp.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, letterSpacing: -0.3 }}>
                {tp.title}
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 3, lineHeight: 1.35 }}>
                {tp.description}
              </span>
            </span>
            <I n="arrow" size={15} sw={2.2} color={V.faint} />
          </button>
        ))}
      </div>
        </>
      )}

      <button
        type="button"
        onClick={() => nav('/actualitat/tot')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
          borderRadius: 22, padding: 20, background: V.terra, color: '#fff',
          boxShadow: '0 14px 30px rgba(255,122,26,.3)',
          display: 'flex', alignItems: 'center', gap: 15,
        }}>
        <span style={{
          width: 46, height: 46, flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="check" size={21} sw={2} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>
            Test mesclat d&apos;actualitat
          </span>
          <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,.9)', marginTop: 4 }}>
            Preguntes de tots els blocs, barrejades
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 800 }}>›</span>
      </button>
    </div>
  );
}
