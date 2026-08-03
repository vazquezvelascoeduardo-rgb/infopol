// Psicotècnics — la pantalla d'entrada.
//
// Va com la resta de tests, i a posta: tot alhora, per blocs o per
// categoria, i abans de començar un full de configuració amb quantes
// preguntes i quin format. Qui ja sap fer un test de temari no ha
// d'aprendre res nou.
//
// Els exàmens no reparteixen per categories soltes sinó per APTITUDS
// —verbal, numèrica, espacial, abstracta i atenció—, i la nota surt de com
// et vagi a cadascuna. Per això els blocs manen i les categories van a
// dins: així saps què has d'entrenar quan una aptitud et falla.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BLOCS, PER_ID, tempsText } from '../../lib/psicotecnics/cataleg.mjs';
import ConfigPsico, { type ConfigPsicoTria } from './ConfigPsico';
import { I, Mono, RV, V, type NomIc } from '../../lib/v3';

export type Cos = 'pl' | 'mossos';

const ACCENTS: Record<Cos, { accent: string; ink: string; soft: string; kicker: string }> = {
  pl: { accent: '#FF7A1A', ink: '#C4530A', soft: '#FFEDDD', kicker: 'POLICIA LOCAL' },
  mossos: { accent: '#991B1B', ink: '#991B1B', soft: '#F7E5E5', kicker: "MOSSOS D'ESQUADRA" },
};

const ICONA_BLOC: Record<string, NomIc> = {
  verbal: 'book', numeric: 'chart', espacial: 'layers', abstracte: 'brain', atencio: 'text',
};

type Tria = { id: string; titol: string; sub: string };

export default function ZonaPsico({ cos }: { cos: Cos }) {
  const nav = useNavigate();
  const a = ACCENTS[cos];
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';
  const [obert, setObert] = useState<string | null>(null);
  const [config, setConfig] = useState<Tria | null>(null);

  const comenca = (c: ConfigPsicoTria) => {
    if (!config) return;
    nav(`${arrel}/psicotecnics/${config.id}?n=${c.quantes}&f=${c.format}&t=${c.ambTemps ? 1 : 0}`);
  };

  const targeta = (t: Tria, principal = false) => (
    <button
      key={t.id}
      onClick={() => setConfig(t)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
        background: principal ? a.accent : V.surface,
        border: principal ? 'none' : `1px solid ${V.border}`,
        borderRadius: principal ? RV.lg : RV.md,
        padding: principal ? '15px 16px' : '12px 13px',
        cursor: 'pointer', font: 'inherit', color: principal ? '#fff' : V.ink,
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 700, fontSize: principal ? 16.5 : 15 }}>
          {t.titol}
        </span>
        <span style={{
          display: 'block', fontSize: 12.5, marginTop: 2,
          color: principal ? 'rgba(255,255,255,.85)' : V.muted,
        }}>
          {t.sub}
        </span>
      </span>
      <I n="arrow" size={17} color={principal ? '#fff' : V.faint} />
    </button>
  );

  return (
    <div style={{ padding: '18px 16px 90px', maxWidth: 760, margin: '0 auto' }}>
      <Mono color={a.ink}>{a.kicker}</Mono>
      <h1 style={{
        margin: '6px 0 4px', fontSize: 26, fontWeight: 800, color: V.ink, letterSpacing: '-.02em',
      }}>
        Psicotècnics
      </h1>
      <p style={{ margin: '0 0 18px', color: V.muted, fontSize: 14, lineHeight: 1.5 }}>
        No és un banc de preguntes: es fabriquen. Cada vegada surten diferents,
        i no s'acaben mai.
      </p>

      {targeta({
        id: 'tot',
        titol: 'Tot alhora',
        sub: `Amb la barreja i el ritme de l'examen — 80 en ${tempsText(80)}`,
      }, true)}

      <div style={{ height: 20 }} />
      <Mono>PER BLOCS D'APTITUD</Mono>
      <p style={{ margin: '5px 0 10px', color: V.muted, fontSize: 13 }}>
        És com reparteixen els exàmens. Toca el bloc per treballar-lo sencer,
        o obre'l per triar-ne una categoria.
      </p>

      <div style={{ display: 'grid', gap: 9 }}>
        {BLOCS.map((b) => (
          <div key={b.id} style={{
            background: V.surface, border: `1px solid ${V.border}`, borderRadius: RV.md,
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setConfig({ id: b.id, titol: b.nom, sub: b.descripcio })}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  background: 'none', border: 'none', padding: '12px 4px 12px 13px',
                  cursor: 'pointer', font: 'inherit', minWidth: 0,
                }}
              >
                <span style={{
                  width: 34, height: 34, borderRadius: RV.xs, background: a.soft,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <I n={ICONA_BLOC[b.id] ?? 'brain'} size={17} color={a.ink} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 650, fontSize: 15, color: V.ink }}>
                    {b.nom}
                  </span>
                  <span style={{ display: 'block', fontSize: 12.5, color: V.muted }}>
                    {b.categories.length} {b.categories.length === 1 ? 'categoria' : 'categories'}
                    {' · '}{b.descripcio}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setObert(obert === b.id ? null : b.id)}
                aria-label={obert === b.id ? 'Tancar' : 'Veure les categories'}
                style={{
                  background: 'none', border: 'none', padding: '12px 13px 12px 6px',
                  cursor: 'pointer', lineHeight: 0,
                }}
              >
                <I
                  n="arrow"
                  size={17}
                  color={V.faint}
                  style={{ transform: `rotate(${obert === b.id ? -90 : 90}deg)`, transition: 'transform .15s' }}
                />
              </button>
            </div>

            {obert === b.id && (
              <div style={{ borderTop: `1px solid ${V.hair}`, padding: 8, display: 'grid', gap: 6 }}>
                {b.categories.map((id) => (
                  <button
                    key={id}
                    onClick={() => setConfig({
                      id, titol: PER_ID[id].nom, sub: PER_ID[id].descripcio,
                    })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                      textAlign: 'left', background: V.surface2, border: `1px solid ${V.hair}`,
                      borderRadius: RV.sm, padding: '9px 11px', cursor: 'pointer', font: 'inherit',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 14, color: V.ink }}>
                        {PER_ID[id].nom}
                      </span>
                      <span style={{ display: 'block', fontSize: 12, color: V.muted }}>
                        {PER_ID[id].descripcio}
                      </span>
                    </span>
                    <I n="arrow" size={15} color={V.faint} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {config && (
        <ConfigPsico
          titol={config.titol}
          meta={config.sub}
          accent={a}
          onTanca={() => setConfig(null)}
          onComenca={comenca}
        />
      )}
    </div>
  );
}
