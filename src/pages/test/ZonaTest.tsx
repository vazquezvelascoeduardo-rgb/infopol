// Fer un test — disseny "Web Test categories".
//
// Una sola pantalla per als dos cossos: el commutador de dalt canvia
// entre Policia Local i Mossos i amb ell l'accent de tota la pantalla.
// Abans n'hi havia dues (una a /policia-local i una altra a /mossos)
// amb aspecte diferent, i eren la mateixa cosa.
//
// Les xifres són reals: quantes preguntes té cada categoria i quina és
// la teva millor nota. Si no has fet cap test d'una categoria, no
// s'inventa cap nota: es diu que encara no n'hi ha.
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TOPICS, getMossosByAmbit, getMunicipiGroups, getTopicsByCategory,
} from '../../data/tests';
import type { TestTopic } from '../../data/tests/types';
import { useFailuresCounts } from '../../lib/failures';
import { useGlobalStats, type GlobalStats } from '../../lib/testStats';
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

type Categoria = {
  clau: string;
  titol: string;
  sub: string;
  icona: NomIc;
  to: string;
  temes: TestTopic[];
};

/** Millor nota d'un grup de temes, o null si encara no n'hi ha cap. */
function millorNota(temes: TestTopic[], stats: GlobalStats): number | null {
  let millor: number | null = null;
  for (const t of temes) {
    const s = stats.topics[t.slug];
    if (!s || s.attempts === 0) continue;
    millor = millor === null ? s.best : Math.max(millor, s.best);
  }
  return millor;
}

const preguntes = (temes: TestTopic[]) => temes.reduce((a, t) => a + t.questions.length, 0);

function categories(cos: Cos): Categoria[] {
  if (cos === 'mossos') {
    return getMossosByAmbit().map((g) => ({
      clau: g.ambit,
      titol: `Bloc ${g.ambit}`,
      sub: `${g.topics.length} temes de la guia oficial`,
      icona: 'layers' as NomIc,
      to: `/mossos/cat/${g.ambit}`,
      temes: g.topics,
    }));
  }
  const municipis = getMunicipiGroups().flatMap((g) => g.topics);
  // Totes porten a la llista de temes de la categoria: qui vulgui el test
  // barrejat el té allà dins i a la barra gran de baix. Portar directament
  // a un test de tot deixava sense manera d'escollir un tema concret.
  return [
    {
      clau: 'temari',
      titol: 'Temari',
      sub: 'Lleis i normativa del temari oficial',
      icona: 'book',
      to: '/policia-local/cat/temari',
      temes: getTopicsByCategory('temari'),
    },
    {
      clau: 'cultura',
      titol: 'Cultura general',
      sub: 'Història, geografia, art i institucions',
      icona: 'globe',
      to: '/policia-local/cat/cultura',
      temes: getTopicsByCategory('cultura'),
    },
    {
      clau: 'actualitat',
      titol: 'Actualitat',
      sub: 'Càrrecs vigents, premis i fets recents',
      icona: 'news',
      to: '/policia-local/cat/actualitat',
      temes: getTopicsByCategory('actualitat'),
    },
    {
      clau: 'municipi',
      titol: 'Municipis',
      sub: "Temari propi de cada ajuntament",
      icona: 'city',
      to: '/policia-local/cat/municipi',
      temes: municipis,
    },
  ].filter((c) => c.temes.length > 0);
}

export default function ZonaTest({ cos: cosProp }: { cos?: Cos }) {
  const nav = useNavigate();
  const params = useParams();
  const cos: Cos = cosProp ?? (params.cos === 'mossos' ? 'mossos' : 'pl');

  const stats = useGlobalStats();
  const failures = useFailuresCounts();
  const a = ACCENTS[cos];

  const cats = useMemo(() => categories(cos), [cos]);

  const totalPreguntes = useMemo(() => {
    const llista = cos === 'mossos'
      ? getTopicsByCategory('mossos')
      : TOPICS.filter((t) => (t.category ?? 'temari') !== 'mossos');
    return preguntes(llista);
  }, [cos]);

  const subtitol = `${totalPreguntes.toLocaleString('ca-ES')} preguntes`
    + (failures.due > 0 ? ` · ${failures.due} per repassar` : '');

  return (
    <div
      className="v3-page v3-anim"
      style={{
        ['--accent' as never]: a.accent,
        ['--accent-ink' as never]: a.ink,
        ['--accent-soft' as never]: a.soft,
      } as React.CSSProperties}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap', marginBottom: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div>
            <Mono size={10} color={a.ink} style={{ letterSpacing: 1.8 }}>{a.kicker}</Mono>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
              Fer un test
            </h1>
            <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0' }}>{subtitol}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, padding: 5, background: V.surface2, borderRadius: 14, flexShrink: 0 }}>
          {(['pl', 'mossos'] as Cos[]).map((c) => {
            const on = c === cos;
            return (
              <button
                key={c}
                type="button"
                onClick={() => nav(c === 'mossos' ? '/mossos' : '/policia-local')}
                aria-pressed={on}
                style={{
                  cursor: 'pointer', border: 'none', borderRadius: 11, padding: '10px 17px',
                  background: on ? V.surface : 'transparent', color: on ? V.ink : V.muted,
                  boxShadow: on ? V.shadow : 'none',
                  fontSize: 13, fontWeight: 800, letterSpacing: -0.3, whiteSpace: 'nowrap',
                }}>
                {c === 'pl' ? 'Policia Local' : 'Mossos'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        gap: 14, marginBottom: 16,
      }}>
        {cats.map((c) => {
          const millor = millorNota(c.temes, stats);
          return (
            <button
              key={c.clau}
              type="button"
              onClick={() => nav(c.to)}
              style={{
                textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22, padding: 22,
                background: V.surface, color: V.ink, boxShadow: V.shadow,
                display: 'flex', flexDirection: 'column', minHeight: 176,
              }}>
              <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <span style={{
                  width: 46, height: 46, borderRadius: 15, background: a.soft, color: a.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I n={c.icona} size={21} sw={1.9} />
                </span>
                <span style={{
                  width: 34, height: 34, borderRadius: '50%', background: a.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <I n="play" size={14} ple color="#fff" />
                </span>
              </span>
              <span style={{ display: 'block', fontSize: 18, fontWeight: 800, letterSpacing: -0.55, marginTop: 'auto', paddingTop: 16 }}>
                {c.titol}
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: V.muted, lineHeight: 1.45, marginTop: 5 }}>
                {c.sub}
              </span>
              <span style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
                <Mono size={9.5} color={a.ink} style={{
                  fontWeight: 700, background: a.soft, borderRadius: 8, padding: '5px 9px',
                }}>
                  {preguntes(c.temes).toLocaleString('ca-ES')} PREGUNTES
                </Mono>
                <Mono size={9.5} color={V.muted} style={{
                  fontWeight: 700, background: V.surface2, borderRadius: 8, padding: '5px 9px',
                }}>
                  {millor === null ? 'SENSE NOTA' : `MILLOR ${millor.toFixed(1).replace('.', ',')}`}
                </Mono>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => nav(cos === 'mossos' ? '/mossos/tot' : '/policia-local/tot')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
          padding: 24, background: a.accent, color: '#fff',
          boxShadow: `0 14px 30px ${a.glow}`,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
        <span style={{
          width: 50, height: 50, flexShrink: 0, borderRadius: 16, background: 'rgba(255,255,255,.24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="check" size={23} sw={1.9} color="#fff" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 20, fontWeight: 800, letterSpacing: -0.65 }}>
            Test aleatori de tot
          </span>
          <span style={{ display: 'block', fontSize: 13, opacity: 0.9, marginTop: 5 }}>
            Preguntes barrejades de tot el temari · {totalPreguntes.toLocaleString('ca-ES')} disponibles
          </span>
        </span>
        <span style={{
          width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#fff', color: a.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="play" size={15} ple color={a.accent} />
        </span>
      </button>

      {/* Psicotècnics. Van a part del temari perquè no són temari: no hi ha
          res per estudiar, s'entrenen. I no tenen banc de preguntes, es
          fabriquen, o sigui que no s'acaben mai. */}
      <button
        type="button"
        onClick={() => nav(cos === 'mossos' ? '/mossos/psicotecnics' : '/policia-local/psicotecnics')}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
          padding: 20, marginTop: 14, background: V.surface, color: V.ink, boxShadow: V.shadow,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
        <span style={{
          width: 46, height: 46, flexShrink: 0, borderRadius: 15, background: a.soft, color: a.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="layers" size={21} sw={1.9} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>
            Psicotècnics
          </span>
          <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 4 }}>
            Cinc blocs d'aptitud · es fabriquen, no s'acaben mai
          </span>
        </span>
        <I n="arrow" size={16} sw={2.2} color={V.faint} />
      </button>

      {/* Errors anteriors: només si en tens. Un botó que no porta enlloc
          fa dubtar de si has fet alguna cosa malament. */}
      {failures.total > 0 && (
        <button
          type="button"
          onClick={() => nav('/policia-local/debilitats')}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
            padding: 20, marginTop: 14, background: V.surface, color: V.ink, boxShadow: V.shadow,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
          <span style={{
            width: 46, height: 46, flexShrink: 0, borderRadius: 15, background: V.blueSoft, color: V.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="brain" size={21} sw={1.9} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>
              Errors anteriors
            </span>
            <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 4 }}>
              {failures.due > 0
                ? `${failures.due} preguntes ja et toquen`
                : `${failures.total} guardades, cap per avui`}
            </span>
          </span>
          <I n="arrow" size={16} sw={2.2} color={V.faint} />
        </button>
      )}
    </div>
  );
}
