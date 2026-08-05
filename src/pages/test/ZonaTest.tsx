// Fer un test — l'entrada a tots els tests.
//
// Una sola pantalla per als dos cossos: el commutador de dalt canvia
// entre Policia Local i Mossos i amb ell l'accent de tota la pantalla.
// Abans n'hi havia dues (una a /policia-local i una altra a /mossos)
// amb aspecte diferent, i eren la mateixa cosa.
//
// La pantalla no porta comptadors. Quantes preguntes té cada categoria
// no ajuda a decidir res —tries el tema que et toca estudiar, no el que
// en té més— i la millor nota d'una categoria sencera tampoc vol dir
// gaire. Les notes viuen a dins de cada categoria, que és on serveixen.
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getMossosByAmbit, getMunicipiGroups, getTopicsByCategory } from '../../data/tests';
import type { TestTopic } from '../../data/tests/types';
import { useFailuresCounts } from '../../lib/failures';
import { I, Mono, SegV, V, type NomIc } from '../../lib/v3';

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
};

function categories(cos: Cos): Categoria[] {
  if (cos === 'mossos') {
    const blocs: Categoria[] = getMossosByAmbit().map((g) => ({
      clau: g.ambit,
      titol: `Bloc ${g.ambit}`,
      sub: `${g.topics.length} temes de la guia oficial`,
      icona: 'layers' as NomIc,
      to: `/mossos/cat/${g.ambit}`,
    }));
    blocs.push({
      clau: 'psico',
      titol: 'Psicotècnics',
      sub: 'Figures, cubs, sèries, càlcul i verbal',
      icona: 'brain',
      to: '/mossos/psicotecnics',
    });
    return blocs;
  }

  const hiHa = (c: 'temari' | 'cultura' | 'actualitat') => getTopicsByCategory(c).length > 0;
  const municipis = getMunicipiGroups().flatMap((g) => g.topics) as TestTopic[];

  // Els psicotècnics van tercers, al costat de cultura general: no són
  // temari —no hi ha res per estudiar, s'entrenen— però qui ve a fer un
  // test els busca aquí, amb la resta i no al final de tot.
  const totes: (Categoria | null)[] = [
    hiHa('temari') ? {
      clau: 'temari',
      titol: 'Temari',
      sub: 'Lleis i normativa del temari oficial',
      icona: 'book',
      to: '/policia-local/cat/temari',
    } : null,
    hiHa('cultura') ? {
      clau: 'cultura',
      titol: 'Cultura general',
      sub: 'Història, geografia, art i institucions',
      icona: 'globe',
      to: '/policia-local/cat/cultura',
    } : null,
    {
      clau: 'psico',
      titol: 'Psicotècnics',
      sub: 'Figures, cubs, sèries, càlcul i verbal',
      icona: 'brain',
      to: '/policia-local/psicotecnics',
    },
    hiHa('actualitat') ? {
      clau: 'actualitat',
      titol: 'Actualitat',
      sub: 'Càrrecs vigents, premis i fets recents',
      icona: 'news',
      to: '/policia-local/cat/actualitat',
    } : null,
    municipis.length ? {
      clau: 'municipi',
      titol: 'Municipis',
      sub: 'Temari propi de cada ajuntament',
      icona: 'city',
      to: '/policia-local/cat/municipi',
    } : null,
  ];
  return totes.filter((c): c is Categoria => c !== null);
}

export default function ZonaTest({ cos: cosProp }: { cos?: Cos }) {
  const nav = useNavigate();
  const params = useParams();
  const cos: Cos = cosProp ?? (params.cos === 'mossos' ? 'mossos' : 'pl');

  const failures = useFailuresCounts();
  const a = ACCENTS[cos];

  const cats = useMemo(() => categories(cos), [cos]);

  // El test aleatori de Policia Local barreja temari, cultura i
  // actualitat. Els municipis en queden fora a posta: cada ajuntament té
  // el seu i no toca que et caiguin les ordenances d'un altre poble.
  const aleatori = cos === 'mossos' ? '/mossos/tot' : '/policia-local/mixt';
  const aleatoriSub = cos === 'mossos'
    ? "Preguntes barrejades de tots els blocs de la guia"
    : 'Temari, cultura general i actualitat, barrejats';

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
        gap: 20, flexWrap: 'wrap', marginBottom: 20,
      }}>
        <div>
          <Mono size={10} color={a.ink} style={{ letterSpacing: 1.8 }}>{a.kicker}</Mono>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
            Fer un test
          </h1>
          <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0' }}>
            Tria una categoria, o llança'n un de barrejat.
          </p>
        </div>

        {/* El commutador de cos. La pastilla llisca d'una banda a l'altra
            en comptes de saltar-hi: el canvi es veu venir. */}
        <SegV
          opcions={[
            { id: 'pl', label: 'Policia Local' },
            { id: 'mossos', label: 'Mossos' },
          ]}
          valor={cos}
          onTria={(c) => nav(c === 'mossos' ? '/mossos' : '/policia-local')}
          style={{ minWidth: 230 }}
        />
      </div>

      {/* El test aleatori, a dalt: és el que fa més gent i abans quedava
          per sota de la graella, fora de la pantalla. */}
      <button
        type="button"
        className="ap-prem"
        onClick={() => nav(aleatori)}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
          padding: 22, marginBottom: 16, background: a.accent, color: '#fff',
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
            Test aleatori
          </span>
          <span style={{ display: 'block', fontSize: 13, opacity: 0.9, marginTop: 4 }}>
            {aleatoriSub}
          </span>
        </span>
        <I n="arrow" size={18} sw={2.2} color="rgba(255,255,255,.85)" />
      </button>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
        gap: 13,
      }}>
        {cats.map((c) => (
          <button
            key={c.clau}
            type="button"
            className="v3-sura"
            onClick={() => nav(c.to)}
            style={{
              textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22, padding: 20,
              background: V.surface, color: V.ink, boxShadow: V.shadow,
              display: 'flex', flexDirection: 'column', gap: 14, minHeight: 148,
            }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                width: 44, height: 44, borderRadius: 14, background: a.soft, color: a.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I n={c.icona} size={21} sw={1.9} />
              </span>
              <I n="arrow" size={16} sw={2.2} color={V.faint} />
            </span>
            <span style={{ marginTop: 'auto' }}>
              <span style={{ display: 'block', fontSize: 17.5, fontWeight: 800, letterSpacing: -0.55 }}>
                {c.titol}
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: V.muted, lineHeight: 1.45, marginTop: 4 }}>
                {c.sub}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Errors anteriors: només si en tens. Un botó que no porta enlloc
          fa dubtar de si has fet alguna cosa malament. */}
      {failures.total > 0 && (
        <button
          type="button"
          className="v3-sura"
          onClick={() => nav('/policia-local/debilitats')}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
            padding: 18, marginTop: 13, background: V.surface, color: V.ink, boxShadow: V.shadow,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
          <span style={{
            width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: V.blueSoft, color: V.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="brain" size={20} sw={1.9} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 16.5, fontWeight: 800, letterSpacing: -0.5 }}>
              Errors anteriors
            </span>
            <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 3 }}>
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
