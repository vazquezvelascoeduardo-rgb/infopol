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
import { createPortal } from 'react-dom';

import { LLARGADES, tempsText } from '../../lib/psicotecnics/cataleg.mjs';
import { I, Mono, RV, useSortida, V } from '../../lib/v3';

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

  const { surt, tanca } = useSortida(onTanca);

  useEffect(() => {
    const t = (e: KeyboardEvent) => { if (e.key === 'Escape') tanca(); };
    window.addEventListener('keydown', t);
    return () => window.removeEventListener('keydown', t);
  }, [tanca]);

  // Penjat del <body>: veure el comentari del bessó, ConfigTest.
  return createPortal((
    <div className={surt ? 'ap-vel surt' : 'ap-vel'}>
      <button
        onClick={tanca}
        aria-label="Tancar"
        style={{
          position: 'absolute', inset: 0, background: 'none',
          border: 'none', cursor: 'pointer',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Configura ${titol}`}
        className="ap-full"
        style={{ padding: '20px 20px 24px' }}>
        <Mono color={accent.ink} style={{ letterSpacing: 1.6 }}>{meta.toUpperCase()}</Mono>
        <h2 style={{
          margin: '5px 0 18px', fontSize: 21, fontWeight: 800,
          letterSpacing: -0.6, color: V.ink,
        }}>
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
          className="ap-prem"
          onClick={() => onComenca({ quantes, format, ambTemps })}
          style={{
            width: '100%', padding: 15, borderRadius: RV.md, border: 'none',
            background: accent.accent, color: '#fff', font: 'inherit',
            fontWeight: 800, fontSize: 15.5, letterSpacing: -0.3, cursor: 'pointer',
          }}
        >
          Començar
        </button>
      </div>
    </div>
  ), document.body);
}
