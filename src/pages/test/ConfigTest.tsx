// Full de configuració del test — disseny "Config sheet".
//
// S'obre en clicar un tema, damunt de la llista, i és l'últim pas abans
// de començar: quantes preguntes, quant de temps hi comptes dedicar i en
// quin format. Abans això era una pantalla sencera; en un full que es
// desplega es veu el tema que has triat al darrere i s'hi entra d'un clic.
import { useEffect, useState } from 'react';

import { I, Mono, RV, V } from '../../lib/v3';

export type FormatTest = 'study' | 'exam';

export type ConfigEscollida = {
  /** Quantes preguntes. `0` vol dir totes les del tema. */
  quantes: number;
  format: FormatTest;
};

const FORMATS: { id: FormatTest; ic: 'brain' | 'clock'; label: string; sub: string }[] = [
  { id: 'study', ic: 'brain', label: 'Estudi', sub: 'Et diu si has encertat a cada pregunta' },
  { id: 'exam', ic: 'clock', label: 'Simulacre', sub: 'Correcció al final, com a l\'examen' },
];

/** Minuts que sol costar un test, a raó de poc menys d'un minut per pregunta. */
const minuts = (n: number) => Math.max(1, Math.round(n * 0.4));

export default function ConfigTest({
  titol, meta, total, disponibles, onTanca, onComenca,
}: {
  titol: string;
  meta: string;
  /** Preguntes que té el tema. */
  total: number;
  /** Preguntes que encara no has contestat mai. */
  disponibles: number;
  onTanca: () => void;
  onComenca: (c: ConfigEscollida) => void;
}) {
  const [quantes, setQuantes] = useState(0);
  const [format, setFormat] = useState<FormatTest>('study');

  // Les opcions que caben: no oferim 50 preguntes si el tema en té 20.
  const opcions = [10, 25, 50].filter((n) => n <= total);
  useEffect(() => { setQuantes(opcions[1] ?? opcions[0] ?? 0); }, [total]);

  // Amb Escape es tanca: és un full, no una pantalla.
  useEffect(() => {
    const t = (e: KeyboardEvent) => { if (e.key === 'Escape') onTanca(); };
    window.addEventListener('keydown', t);
    return () => window.removeEventListener('keydown', t);
  }, [onTanca]);

  const n = quantes || total;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <button
        type="button"
        aria-label="Tanca"
        onClick={onTanca}
        style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,28,.5)', border: 'none', cursor: 'pointer' }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Configura el test de ${titol}`}
        className="v3-config-full"
        style={{
          position: 'relative', width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto',
          background: V.paper, borderRadius: '26px 26px 0 0', padding: 24,
          boxShadow: '0 -18px 50px rgba(21,21,28,.28)',
        }}>
        {/* Capçalera */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 22 }}>
          <span style={{
            width: 42, height: 42, flexShrink: 0, borderRadius: 14,
            background: 'var(--accent-soft, var(--v-terra-soft))',
            color: 'var(--accent-ink, var(--v-terra-ink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="check" size={20} sw={2} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Mono size={9.5} color="var(--accent-ink, var(--v-terra-ink))" style={{ letterSpacing: 1.6 }}>
              CONFIGURA EL TEST
            </Mono>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.6, marginTop: 5, lineHeight: 1.2 }}>
              {titol}
            </div>
            <div style={{ fontSize: 12.5, color: V.muted, marginTop: 4 }}>{meta}</div>
          </div>
          <button
            type="button"
            onClick={onTanca}
            aria-label="Tanca"
            style={{
              width: 34, height: 34, flexShrink: 0, borderRadius: '50%', cursor: 'pointer',
              border: `1px solid ${V.border}`, background: V.surface, color: V.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <I n="x" size={15} sw={2.4} />
          </button>
        </div>

        {/* Quantes preguntes */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3 }}>Nombre de preguntes</span>
            <Mono size={10} color={V.faint}>{n} EN JOC</Mono>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${opcions.length + 1},1fr)`, gap: 8 }}>
            {[...opcions, 0].map((o) => {
              const on = quantes === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => setQuantes(o)}
                  aria-pressed={on}
                  style={{
                    cursor: 'pointer', borderRadius: 14, padding: '14px 6px',
                    border: on ? '2px solid var(--accent, var(--v-terra))' : `1px solid ${V.border}`,
                    background: on ? 'var(--accent-soft, var(--v-terra-soft))' : V.surface,
                    color: on ? 'var(--accent-ink, var(--v-terra-ink))' : V.ink,
                    fontSize: 15, fontWeight: 800, letterSpacing: -0.4,
                  }}>
                  {o === 0 ? 'Totes' : o}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10 }}>Format</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {FORMATS.map((f) => {
              const on = format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  aria-pressed={on}
                  style={{
                    textAlign: 'left', cursor: 'pointer', borderRadius: 16, padding: 15,
                    border: on ? '2px solid var(--accent, var(--v-terra))' : `1px solid ${V.border}`,
                    background: on ? 'var(--accent-soft, var(--v-terra-soft))' : V.surface,
                    color: V.ink, display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                  <span style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 12,
                    background: on ? 'var(--accent, var(--v-terra))' : V.surface2,
                    color: on ? '#fff' : V.muted,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <I n={f.ic} size={17} sw={1.9} color={on ? '#fff' : undefined} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14.5, fontWeight: 800, letterSpacing: -0.35 }}>
                      {f.label}
                    </span>
                    <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 2 }}>
                      {f.sub}
                    </span>
                  </span>
                  <span style={{
                    width: 20, height: 20, flexShrink: 0, borderRadius: '50%',
                    border: on ? '6px solid var(--accent, var(--v-terra))' : `2px solid ${V.border}`,
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Resum */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
          background: V.surface2, borderRadius: 14, padding: '12px 14px',
        }}>
          <I n="clock" size={16} sw={1.9} color={V.muted} />
          <span style={{ fontSize: 12.5, color: V.muted }}>
            {n} preguntes · uns {minuts(n)} min
            {disponibles > 0 && disponibles < total ? ` · ${disponibles} que no has fet mai` : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onTanca}
            style={{
              cursor: 'pointer', border: `1px solid ${V.border}`, borderRadius: RV.md,
              padding: '16px 20px', background: V.surface, color: V.ink,
              fontSize: 14.5, fontWeight: 700,
            }}>
            Cancel·la
          </button>
          <button
            type="button"
            onClick={() => onComenca({ quantes, format })}
            style={{
              flex: 1, cursor: 'pointer', border: 'none', borderRadius: RV.md, padding: 16,
              background: 'var(--accent, var(--v-terra))', color: '#fff',
              fontSize: 15, fontWeight: 800, letterSpacing: -0.3,
            }}>
            Comença el test
          </button>
        </div>
      </div>
    </div>
  );
}
