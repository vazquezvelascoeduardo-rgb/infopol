// Full de configuració dels psicotècnics.
//
// El mateix full que als tests de temari, i amb els mateixos dos formats,
// perquè és la mateixa decisió: quantes en vols fer i si vols saber com
// t'ha anat sobre la marxa o al final.
//
// L'únic que hi canvia és el temps. Als psicotècnics el rellotge no és un
// afegit: l'examen oficial són 80 preguntes en 35 minuts —vint-i-sis segons
// cadascuna— i bona part del que mesura és si vas prou de pressa. Per això
// els formats curts mantenen el mateix ritme, i per això es pot treure el
// rellotge quan el que vols és entendre-les, no córrer.
import { useEffect, useState } from 'react';

import { LLARGADES, tempsText } from '../../lib/psicotecnics/cataleg.mjs';
import { I, Mono, RV, V } from '../../lib/v3';

export type FormatPsico = 'study' | 'exam';

export type ConfigPsicoTria = {
  quantes: number;
  format: FormatPsico;
  ambTemps: boolean;
};

const FORMATS: { id: FormatPsico; ic: 'brain' | 'clock'; label: string; sub: string }[] = [
  { id: 'study', ic: 'brain', label: 'Estudi', sub: 'Et diu si has encertat a cada pregunta' },
  { id: 'exam', ic: 'clock', label: 'Simulacre', sub: "Correcció al final, com a l'examen" },
];

export default function ConfigPsico({
  titol, meta, accent, onTanca, onComenca,
}: {
  titol: string;
  meta: string;
  accent: { accent: string; ink: string; soft: string };
  onTanca: () => void;
  onComenca: (c: ConfigPsicoTria) => void;
}) {
  const [quantes, setQuantes] = useState(30);
  const [format, setFormat] = useState<FormatPsico>('study');
  const [ambTemps, setAmbTemps] = useState(false);

  // El simulacre porta rellotge per defecte; l'estudi, no.
  useEffect(() => { setAmbTemps(format === 'exam'); }, [format]);

  useEffect(() => {
    const t = (e: KeyboardEvent) => { if (e.key === 'Escape') onTanca(); };
    window.addEventListener('keydown', t);
    return () => window.removeEventListener('keydown', t);
  }, [onTanca]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <button
        onClick={onTanca}
        aria-label="Tancar"
        style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,.34)',
          border: 'none', cursor: 'pointer',
        }}
      />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 520,
        background: V.paper, borderRadius: `${RV.xl}px ${RV.xl}px 0 0`,
        padding: '16px 16px 22px', boxShadow: V.shadowLg,
        maxHeight: '88vh', overflowY: 'auto',
      }}>
        <div style={{
          width: 38, height: 4, borderRadius: 9, background: V.border,
          margin: '0 auto 14px',
        }} />

        <Mono color={accent.ink}>{meta}</Mono>
        <h2 style={{ margin: '4px 0 16px', fontSize: 20, fontWeight: 750, color: V.ink }}>
          {titol}
        </h2>

        <Mono>QUANTES PREGUNTES</Mono>
        <div style={{ display: 'flex', gap: 8, margin: '7px 0 16px' }}>
          {LLARGADES.map((n) => (
            <button
              key={n}
              onClick={() => setQuantes(n)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: RV.sm, cursor: 'pointer',
                border: `1.5px solid ${quantes === n ? accent.accent : V.border}`,
                background: quantes === n ? accent.soft : V.surface,
                color: quantes === n ? accent.ink : V.ink,
                font: 'inherit', fontWeight: quantes === n ? 700 : 500, fontSize: 16,
              }}
            >
              {n}
              <span style={{ display: 'block', fontSize: 11, fontWeight: 500, color: V.muted }}>
                {tempsText(n)}
              </span>
            </button>
          ))}
        </div>

        <Mono>FORMAT</Mono>
        <div style={{ display: 'grid', gap: 8, margin: '7px 0 16px' }}>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
                padding: '11px 12px', borderRadius: RV.sm, cursor: 'pointer', font: 'inherit',
                border: `1.5px solid ${format === f.id ? accent.accent : V.border}`,
                background: format === f.id ? accent.soft : V.surface,
              }}
            >
              <I n={f.ic} size={18} color={format === f.id ? accent.ink : V.muted} />
              <span style={{ flex: 1 }}>
                <span style={{
                  display: 'block', fontWeight: 650, fontSize: 15,
                  color: format === f.id ? accent.ink : V.ink,
                }}>
                  {f.label}
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: V.muted }}>{f.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={ambTemps}
            onChange={(e) => setAmbTemps(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: accent.accent }}
          />
          <span style={{ fontSize: 14, color: V.ink }}>
            Amb rellotge
            <span style={{ color: V.muted }}>
              {ambTemps
                ? ` — ${tempsText(quantes)}, el ritme de l'examen`
                : ' — sense pressa, el temps només es compta'}
            </span>
          </span>
        </label>

        <button
          onClick={() => onComenca({ quantes, format, ambTemps })}
          style={{
            width: '100%', padding: 13, borderRadius: RV.sm, border: 'none',
            background: accent.accent, color: '#fff', font: 'inherit',
            fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
          }}
        >
          Començar
        </button>
      </div>
    </div>
  );
}
