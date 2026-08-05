// Psicotècnics — la pantalla d'entrada.
//
// Va com la resta de tests, i a posta: la mateixa capçalera, la mateixa
// llista agrupada i el mateix full de configuració. Qui ja sap fer un
// test de temari no ha d'aprendre res nou, i la pantalla no sembla que
// vingui d'una altra web.
//
// Els exàmens no reparteixen per categories soltes sinó per APTITUDS
// —verbal, numèrica, espacial, abstracta i atenció—, i la nota surt de com
// et vagi a cadascuna. Per això els blocs manen i les categories van a
// dins: així saps què has d'entrenar quan una aptitud et falla.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BLOCS, PER_ID, tempsText } from '../../lib/psicotecnics/cataleg.mjs';
import {
  blocMesFluix, encertBloc, encertDe, totalFetes, usePsicoStats,
} from '../../lib/psicoStats';
import ConfigPsico, { type ConfigPsicoTria } from './ConfigPsico';
import { I, Mono, V, type NomIc } from '../../lib/v3';

export type Cos = 'pl' | 'mossos';

const ACCENTS: Record<Cos, { accent: string; ink: string; soft: string; glow: string; kicker: string }> = {
  pl: {
    accent: '#FF7A1A', ink: '#C4530A', soft: '#FFEDDD',
    glow: 'rgba(255,122,26,.32)', kicker: 'POLICIA LOCAL',
  },
  mossos: {
    accent: '#991B1B', ink: '#991B1B', soft: '#F7E5E5',
    glow: 'rgba(153,27,27,.28)', kicker: "MOSSOS D'ESQUADRA",
  },
};

const ICONA_BLOC: Record<string, NomIc> = {
  verbal: 'book', numeric: 'chart', espacial: 'layers', abstracte: 'brain', atencio: 'text',
};

type Tria = { id: string; titol: string; sub: string };

/** Els tres colors del percentatge d'encert. */
function colorsPct(p: number) {
  if (p >= 70) return { fg: V.ok, bg: V.okSoft };
  if (p >= 50) return { fg: V.warn, bg: V.warnSoft };
  return { fg: V.granate, bg: V.granateSoft };
}

export default function ZonaPsico({ cos }: { cos: Cos }) {
  const nav = useNavigate();
  const a = ACCENTS[cos];
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';
  const [obert, setObert] = useState<string | null>(null);
  const [config, setConfig] = useState<Tria | null>(null);
  const stats = usePsicoStats();
  const fetes = totalFetes(stats);
  const fluix = blocMesFluix(stats);

  // L'encert global: la suma de totes les categories. No es desa enlloc
  // perquè el que val és el de cada aptitud; aquí només serveix per tenir
  // una xifra de referència a dalt.
  const encerts = Object.values(stats.categories).reduce((n, c) => n + c.encerts, 0);
  const global = fetes ? Math.round((encerts / fetes) * 100) : null;

  const comenca = (c: ConfigPsicoTria) => {
    if (!config) return;
    nav(`${arrel}/psicotecnics/${config.id}?n=${c.quantes}&f=${c.format}&t=${c.ambTemps ? 1 : 0}`);
  };

  return (
    <div
      className="v3-page v3-anim"
      style={{
        ['--accent' as never]: a.accent,
        ['--accent-ink' as never]: a.ink,
        ['--accent-soft' as never]: a.soft,
      } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => nav(arrel)}
          aria-label="Tornar als tests"
          className="ap-prem ap-toc"
          style={{
            width: 40, height: 40, flexShrink: 0, marginTop: 4, borderRadius: '50%',
            border: `1px solid ${V.border}`, background: V.surface, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: V.ink,
          }}>
          <I n="back" size={16} sw={2} />
        </button>
        <div>
          <Mono size={10} color={a.ink} style={{ letterSpacing: 1.8 }}>{a.kicker}</Mono>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
            Psicotècnics
          </h1>
          <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0', maxWidth: 460, lineHeight: 1.5 }}>
            No és un banc de preguntes: es fabriquen. Cada vegada surten
            diferents, i no s'acaben mai.
          </p>
        </div>
      </div>

      {/* Com et va. Igual que a dins d'una categoria de test: només
          apareix quan hi ha alguna cosa a explicar. */}
      {fetes > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          background: V.surface, borderRadius: 22, boxShadow: V.shadow,
          padding: '16px 6px', marginBottom: 16,
        }}>
          {[
            { et: 'ENCERT GLOBAL', val: global === null ? '—' : `${global}%`, color: global === null ? V.ink : colorsPct(global).fg },
            { et: 'PREGUNTES FETES', val: fetes.toLocaleString('ca-ES'), color: V.ink },
            {
              // El bloc que pitjor et va, amb el nom curt: "ON FLUIXEGES"
              // tot sol no diu en què, i el nom sencer no hi cap.
              et: fluix ? `ON FLUIXEGES · ${fluix.id.toUpperCase()}` : 'ON FLUIXEGES',
              val: fluix ? `${fluix.pct}%` : '—',
              color: fluix ? colorsPct(fluix.pct).fg : V.ink,
            },
          ].map((c, i) => (
            <div
              key={c.et}
              style={{
                textAlign: 'center', padding: '0 8px',
                borderLeft: i === 0 ? 'none' : `1px solid ${V.hair}`,
              }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: c.color }}>
                {c.val}
              </div>
              <Mono size={9} color={V.faint} style={{ letterSpacing: 1.4 }}>{c.et}</Mono>
            </div>
          ))}
        </div>
      )}

      {/* Tot alhora: el simulacre. Va a dalt perquè és el que fa més gent. */}
      <button
        type="button"
        className="ap-prem"
        onClick={() => setConfig({
          id: 'tot',
          titol: 'Tot alhora',
          sub: "Amb la barreja i el ritme de l'examen",
        })}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
          padding: 22, marginBottom: 18, background: a.accent, color: '#fff',
          boxShadow: `0 14px 30px ${a.glow}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
        <span style={{
          width: 46, height: 46, flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="play" size={19} ple color="#fff" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 19, fontWeight: 800, letterSpacing: -0.6 }}>
            Tot alhora
          </span>
          <span style={{ display: 'block', fontSize: 13, opacity: 0.9, marginTop: 4 }}>
            Amb la barreja i el ritme de l'examen — 80 en {tempsText(80)}
          </span>
        </span>
        <I n="arrow" size={18} sw={2.2} color="rgba(255,255,255,.85)" />
      </button>

      <h2 style={{
        fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
        color: V.faint, margin: '0 0 5px', paddingLeft: 16,
      }}>
        Per blocs d'aptitud
      </h2>
      <p style={{ margin: '0 0 10px', paddingLeft: 16, color: V.muted, fontSize: 12.5, lineHeight: 1.5 }}>
        És com reparteixen els exàmens. Toca el bloc per treballar-lo sencer,
        o obre'l per triar-ne una categoria.
      </p>

      <div className="ap-llista">
        {BLOCS.map((b, i) => {
          const pct = encertBloc(stats, b.id);
          const c = pct === null ? null : colorsPct(pct);
          return (
            <div key={b.id} style={{ borderTop: i ? `1px solid ${V.hair}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <button
                  type="button"
                  className="ap-fila"
                  onClick={() => setConfig({ id: b.id, titol: b.nom, sub: b.descripcio })}
                  style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                  <span style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: a.soft,
                    color: a.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <I n={ICONA_BLOC[b.id] ?? 'brain'} size={18} sw={1.9} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 700, letterSpacing: -0.35 }}>
                      {b.nom}
                    </span>
                    <span style={{
                      display: 'block', fontSize: 12.5, color: V.muted, marginTop: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {b.descripcio}
                    </span>
                  </span>
                  {/* La nota del bloc. Si encara no n'has fet cap, no
                      s'inventa res: senzillament no hi és. */}
                  {c && (
                    <span style={{
                      flexShrink: 0, fontSize: 13, fontWeight: 800, letterSpacing: -0.3,
                      color: c.fg, background: c.bg, borderRadius: 999, padding: '4px 10px',
                    }}>
                      {pct}%
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setObert(obert === b.id ? null : b.id)}
                  aria-label={obert === b.id ? 'Tancar' : 'Veure les categories'}
                  aria-expanded={obert === b.id}
                  style={{
                    background: 'none', border: 'none', padding: '0 16px 0 6px',
                    cursor: 'pointer', lineHeight: 0, color: V.faint,
                  }}>
                  <I
                    n="arrow"
                    size={16}
                    sw={2.2}
                    style={{
                      transform: `rotate(${obert === b.id ? -90 : 90}deg)`,
                      transition: 'transform .28s cubic-bezier(.22,1,.36,1)',
                    }}
                  />
                </button>
              </div>

              {obert === b.id && (
                <div className="ap-obre" style={{ padding: '0 16px 12px 61px', display: 'grid', gap: 6 }}>
                  {b.categories.map((id) => {
                    const p = encertDe(stats, id);
                    const pc = p === null ? null : colorsPct(p);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setConfig({
                          id, titol: PER_ID[id].nom, sub: PER_ID[id].descripcio,
                        })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          textAlign: 'left', background: V.surface2, border: 'none',
                          borderRadius: 14, padding: '10px 12px', cursor: 'pointer',
                          font: 'inherit', color: V.ink,
                        }}>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 14, fontWeight: 650, letterSpacing: -0.3 }}>
                            {PER_ID[id].nom}
                          </span>
                          <span style={{ display: 'block', fontSize: 12, color: V.muted, marginTop: 1 }}>
                            {PER_ID[id].descripcio}
                          </span>
                        </span>
                        {pc && (
                          <span style={{
                            flexShrink: 0, fontSize: 12, fontWeight: 800,
                            color: pc.fg, background: pc.bg, borderRadius: 999, padding: '3px 9px',
                          }}>
                            {p}%
                          </span>
                        )}
                        <I n="arrow" size={14} sw={2.2} color={V.faint} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
