// Els temes d'una categoria de test.
//
// Abans, clicar una categoria a "Fer un test" et llançava directament un
// test barrejat de tot i no hi havia manera d'escollir el tema. Aquesta
// pantalla és el pas que faltava: primer tries la categoria, després el
// tema concret — o el test barrejat de la categoria, si el que vols és
// això.
//
// Els municipis s'agrupen pel nom del municipi, perquè cada ajuntament
// té diversos temes (ordenances, cultura, examen oficial…) i barrejar-los
// tots en una sola llista no diu res.
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getMossosByAmbit, getMunicipiGroups, getTopicsByCategory } from '../../data/tests';
import type { TestTopic } from '../../data/tests/types';
import { useGlobalStats, type GlobalStats } from '../../lib/testStats';
import { I, Mono, V, type NomIc } from '../../lib/v3';
import ConfigTest, { type ConfigEscollida } from './ConfigTest';
import type { Cos } from './ZonaTest';

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

/** Un grup de temes amb capçalera pròpia (els municipis en tenen; la resta, no). */
type Grup = { titol?: string; temes: TestTopic[] };

type Vista = {
  titol: string;
  sub: string;
  icona: NomIc;
  /** Prefix de ruta dels temes d'aquesta categoria. */
  base: string;
  /** Ruta del test barrejat de la categoria, si en té. */
  tot?: string;
  grups: Grup[];
};

function vista(cos: Cos, clau: string): Vista | null {
  if (cos === 'mossos') {
    const g = getMossosByAmbit().find((x) => x.ambit === clau);
    if (!g) return null;
    return {
      titol: `Bloc ${g.ambit}`,
      sub: 'Temes de la guia oficial de Mossos',
      icona: 'layers',
      base: '/mossos',
      grups: [{ temes: g.topics }],
    };
  }

  if (clau === 'municipi') {
    const grups = getMunicipiGroups().map((g) => ({ titol: g.municipi, temes: g.topics }));
    if (!grups.length) return null;
    return {
      titol: 'Municipis',
      sub: 'Temari propi de cada ajuntament',
      icona: 'city',
      base: '/policia-local',
      grups,
    };
  }

  const temes = getTopicsByCategory(clau as 'temari' | 'cultura' | 'actualitat');
  if (!temes.length) return null;

  if (clau === 'cultura') {
    return {
      titol: 'Cultura general',
      sub: 'Història, geografia, art i institucions',
      icona: 'globe',
      base: '/cultura-general',
      tot: '/cultura-general/tot',
      grups: [{ temes }],
    };
  }
  if (clau === 'actualitat') {
    return {
      titol: 'Actualitat',
      sub: 'Càrrecs vigents, premis i fets recents',
      icona: 'news',
      base: '/actualitat',
      tot: '/actualitat/tot',
      grups: [{ temes }],
    };
  }
  return {
    titol: 'Temari',
    sub: 'Lleis i normativa del temari oficial',
    icona: 'book',
    base: '/policia-local',
    tot: '/policia-local/tot',
    grups: [{ temes }],
  };
}

const preguntes = (temes: TestTopic[]) => temes.reduce((a, t) => a + t.questions.length, 0);

/** Millor nota d'un tema, o null si encara no s'ha fet mai. */
function nota(slug: string, stats: GlobalStats): number | null {
  const s = stats.topics[slug];
  if (!s || s.attempts === 0) return null;
  return s.best;
}

export default function CategoriaTemes({ cos: cosProp }: { cos?: Cos }) {
  const nav = useNavigate();
  const { clau = '' } = useParams();
  const cos: Cos = cosProp ?? 'pl';
  const a = ACCENTS[cos];
  const stats = useGlobalStats();
  const [triat, setTriat] = useState<TestTopic | null>(null);

  const v = useMemo(() => vista(cos, clau), [cos, clau]);

  if (!v) {
    return (
      <div className="v3-page v3-anim">
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>Categoria no trobada</h1>
        <p style={{ fontSize: 14, color: V.muted, marginTop: 8 }}>
          Torna a la pantalla de tests i tria'n una de la llista.
        </p>
        <button
          type="button"
          onClick={() => nav(cos === 'mossos' ? '/mossos' : '/policia-local')}
          style={{
            marginTop: 18, cursor: 'pointer', border: 'none', borderRadius: 999,
            padding: '12px 22px', background: V.ink, color: V.fillFg, fontSize: 14, fontWeight: 800,
          }}>
          Tornar als tests
        </button>
      </div>
    );
  }

  const total = v.grups.reduce((n, g) => n + preguntes(g.temes), 0);
  const nTemes = v.grups.reduce((n, g) => n + g.temes.length, 0);

  return (
    <div
      className="v3-page v3-anim"
      style={{
        ['--accent' as never]: a.accent,
        ['--accent-ink' as never]: a.ink,
        ['--accent-soft' as never]: a.soft,
      } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
        <button
          type="button"
          onClick={() => nav(cos === 'mossos' ? '/mossos' : '/policia-local')}
          aria-label="Tornar als tests"
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
            {v.titol}
          </h1>
          <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0' }}>
            {v.sub} · {nTemes} {nTemes === 1 ? 'tema' : 'temes'} · {total.toLocaleString('ca-ES')} preguntes
          </p>
        </div>
      </div>

      {v.tot && (
        <button
          type="button"
          onClick={() => nav(v.tot!)}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
            padding: 22, marginBottom: 18, background: a.accent, color: '#fff',
            boxShadow: `0 14px 30px ${a.glow}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
          <span style={{
            width: 46, height: 46, flexShrink: 0, borderRadius: 15, background: 'rgba(255,255,255,.24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="check" size={21} sw={1.9} color="#fff" />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 18, fontWeight: 800, letterSpacing: -0.6 }}>
              Test barrejat de {v.titol.toLowerCase()}
            </span>
            <span style={{ display: 'block', fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>
              Preguntes de tots els temes de la categoria
            </span>
          </span>
          <span style={{
            width: 34, height: 34, flexShrink: 0, borderRadius: '50%', background: '#fff', color: a.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="play" size={14} ple color={a.accent} />
          </span>
        </button>
      )}

      {v.grups.map((g, gi) => (
        <section key={g.titol ?? gi} style={{ marginBottom: 22 }}>
          {g.titol && (
            <h2 style={{
              fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
              color: V.faint, margin: '0 0 10px', paddingLeft: 2,
            }}>
              {g.titol}
            </h2>
          )}
          <div style={{ display: 'grid', gap: 10 }}>
            {g.temes.map((t) => {
              const millor = nota(t.slug, stats);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setTriat(t)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 18,
                    padding: 16, background: V.surface, color: V.ink, boxShadow: V.shadow,
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                  <span style={{
                    width: 42, height: 42, flexShrink: 0, borderRadius: 13, background: a.soft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
                  }}>
                    {t.icon}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontSize: 15.5, fontWeight: 800, letterSpacing: -0.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {t.title}
                    </span>
                    <span style={{ display: 'flex', gap: 7, marginTop: 7, flexWrap: 'wrap' }}>
                      <Mono size={9.5} color={a.ink} style={{
                        fontWeight: 700, background: a.soft, borderRadius: 8, padding: '4px 8px',
                      }}>
                        {t.questions.length} PREGUNTES
                      </Mono>
                      <Mono size={9.5} color={V.muted} style={{
                        fontWeight: 700, background: V.surface2, borderRadius: 8, padding: '4px 8px',
                      }}>
                        {millor === null ? 'SENSE NOTA' : `MILLOR ${millor.toFixed(1).replace('.', ',')}`}
                      </Mono>
                      {t.badge && (
                        <Mono size={9.5} color={V.blue} style={{
                          fontWeight: 700, background: V.blueSoft, borderRadius: 8, padding: '4px 8px',
                        }}>
                          {t.badge}
                        </Mono>
                      )}
                    </span>
                  </span>
                  <I n="arrow" size={16} sw={2.2} color={V.faint} />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* El full de configuració: l'últim pas abans de començar. */}
      {triat && (
        <ConfigTest
          titol={triat.title}
          meta={`${triat.questions.length} preguntes${nota(triat.slug, stats) !== null
            ? ` · millor nota ${nota(triat.slug, stats)!.toFixed(1).replace('.', ',')}`
            : ' · encara no l\'has fet'}`}
          total={triat.questions.length}
          disponibles={triat.questions.length}
          onTanca={() => setTriat(null)}
          onComenca={(c: ConfigEscollida) => {
            const p = new URLSearchParams({ mode: c.format });
            if (c.quantes) p.set('n', String(c.quantes));
            else p.set('n', 'totes');
            nav(`${v.base}/${triat.slug}?${p.toString()}`);
          }}
        />
      )}
    </div>
  );
}
