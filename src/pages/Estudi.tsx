// Estudia per tema — llista del temari.
//
// Segueix el disseny "Web Estudia per tema": fletxa enrere, kicker del
// cos, títol, commutador Policia Local / Mossos i, a sota, el temari
// agrupat per blocs amb el número de cada tema i el progrés.
//
// El temari antic de la web (les fitxes de `content/` per mòduls) ja no
// surt aquí: era una biblioteca de normes, no un temari. Les fitxes
// segueixen accessibles des d'Operativa > Lleis, que és on toquen.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BLOCS, TEMES, temesDelBloc } from '../content/temari-pl';
import { nDisponibles, teContingut } from '../content/temari-pl/carrega';
import { getMossosByAmbit } from '../data/tests';
import { useGlobalStats } from '../lib/testStats';
import { I, Mono, V } from '../lib/v3';

type Cos = 'pl' | 'mossos';

/** Els dos cossos, amb el seu accent. El de Mossos és el granat. */
const COSSOS: { id: Cos; label: string; icona: 'escut' | 'cap'; accent: string; accentInk: string; accentSoft: string }[] = [
  { id: 'pl', label: 'Policia Local', icona: 'cap', accent: '#FF7A1A', accentInk: '#C4530A', accentSoft: '#FFEDDD' },
  { id: 'mossos', label: 'Mossos', icona: 'escut', accent: '#991B1B', accentInk: '#991B1B', accentSoft: '#F7E5E5' },
];

export default function Estudi() {
  const nav = useNavigate();
  const [cos, setCos] = useState<Cos>('pl');
  const stats = useGlobalStats();

  const meta = COSSOS.find((c) => c.id === cos)!;
  const disponibles = nDisponibles();

  const ambitsMossos = useMemo(() => getMossosByAmbit(), []);

  const subtitol = cos === 'pl'
    ? `${TEMES.length} temes de la convocatòria · ${disponibles} amb el contingut escrit`
    : `${ambitsMossos.reduce((a, g) => a + g.topics.length, 0)} temes de la guia oficial`;

  return (
    <div
      className="v3-page v3-anim"
      style={{
        // L'accent del cos tenyeix tota la pantalla, com al disseny.
        ['--accent' as never]: meta.accent,
        ['--accent-ink' as never]: meta.accentInk,
        ['--accent-soft' as never]: meta.accentSoft,
      } as React.CSSProperties}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap', marginBottom: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <button
            type="button"
            onClick={() => nav('/academia')}
            aria-label="Tornar a l'Acadèmia"
            style={{
              width: 40, height: 40, flexShrink: 0, marginTop: 4, borderRadius: '50%',
              border: `1px solid ${V.border}`, background: V.surface, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: V.ink,
            }}>
            <I n="back" size={16} sw={2} />
          </button>
          <div>
            <Mono size={10} color={meta.accentInk} style={{ letterSpacing: 1.8 }}>
              {cos === 'pl' ? 'POLICIA LOCAL' : "MOSSOS D'ESQUADRA"}
            </Mono>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
              Estudia per tema
            </h1>
            <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0' }}>{subtitol}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, padding: 5, background: V.surface2, borderRadius: 14, flexShrink: 0 }}>
          {COSSOS.map((c) => {
            const on = c.id === cos;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCos(c.id)}
                aria-pressed={on}
                style={{
                  cursor: 'pointer', border: 'none', borderRadius: 11, padding: '10px 17px',
                  background: on ? V.surface : 'transparent', color: on ? V.ink : V.muted,
                  boxShadow: on ? V.shadow : 'none',
                  fontSize: 13, fontWeight: 800, letterSpacing: -0.3, whiteSpace: 'nowrap',
                }}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {cos === 'pl' ? (
        BLOCS.map((b) => {
          const temes = temesDelBloc(b.clau);
          if (!temes.length) return null;
          const escrits = temes.filter(teContingut).length;
          return (
            <div key={b.clau} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
                <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>{b.titol}</span>
                <span style={{ flex: 1, height: 1, background: V.hair }} />
                <Mono size={10} color={V.muted}>{escrits}/{temes.length} ESCRITS</Mono>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12 }}>
                {temes.map((t) => {
                  const hi = teContingut(t);
                  return (
                    <button
                      key={t.num}
                      type="button"
                      onClick={() => hi && nav(`/estudi/tema/${t.num}`)}
                      aria-disabled={!hi}
                      title={hi ? undefined : 'Aquest tema encara no té el contingut escrit'}
                      style={{
                        textAlign: 'left', cursor: hi ? 'pointer' : 'not-allowed',
                        border: 'none', borderRadius: 18, padding: 17,
                        background: V.surface, color: V.ink, boxShadow: V.shadow,
                        display: 'flex', alignItems: 'center', gap: 14,
                        opacity: hi ? 1 : 0.55,
                      }}>
                      <span style={{
                        width: 44, height: 44, flexShrink: 0, borderRadius: 14,
                        background: hi ? meta.accentSoft : V.surface2,
                        color: hi ? meta.accentInk : V.muted,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: V.mono, fontSize: 13, fontWeight: 700,
                      }}>
                        {t.num}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>
                          {t.titol}
                        </span>
                        <Mono size={9.5} color={V.faint} style={{ display: 'block', marginTop: 7, letterSpacing: 1.2 }}>
                          {hi ? 'DISPONIBLE' : 'PENDENT DE REDACTAR'}
                        </Mono>
                      </span>
                      {hi && <I n="arrow" size={15} sw={2.4} color={V.faint} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        ambitsMossos.map((g) => (
          <div key={g.ambit} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 8, background: meta.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12.5, fontWeight: 800,
              }}>
                {g.ambit}
              </span>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Bloc {g.ambit}</span>
              <span style={{ flex: 1, height: 1, background: V.hair }} />
              <Mono size={10} color={V.muted}>{g.topics.length} TEMES</Mono>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12 }}>
              {g.topics.map((t, i) => {
                const fets = (stats.topics[t.slug]?.attempts ?? 0) > 0;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => nav(`/mossos/temari/${g.ambit}`)}
                    style={{
                      textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 18, padding: 17,
                      background: V.surface, color: V.ink, boxShadow: V.shadow,
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                    <span style={{
                      width: 44, height: 44, flexShrink: 0, borderRadius: 14,
                      background: meta.accentSoft, color: meta.accentInk,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: V.mono, fontSize: 12, fontWeight: 700,
                    }}>
                      {g.ambit}.{i + 1}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>
                        {t.title}
                      </span>
                      <Mono size={9.5} color={V.faint} style={{ display: 'block', marginTop: 7, letterSpacing: 1.2 }}>
                        {fets ? 'COMENÇAT' : `${t.questions.length} PREGUNTES`}
                      </Mono>
                    </span>
                    <I n="arrow" size={15} sw={2.4} color={V.faint} />
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
