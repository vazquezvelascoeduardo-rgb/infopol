// Els temes d'una categoria de test.
//
// Abans, clicar una categoria a "Fer un test" et llançava directament un
// test barrejat de tot i no hi havia manera d'escollir el tema. Aquesta
// pantalla és el pas que faltava: primer tries la categoria, després el
// tema concret — o el test barrejat de la categoria, si el que vols és
// això.
//
// Aquí SÍ que hi ha notes, i és l'únic lloc on toca que hi siguin: a la
// pantalla anterior una nota de "tota la cultura general" no vol dir res,
// però la teva millor nota d'un tema concret et diu per on has de tornar
// a passar. Van a dalt de tot en forma de resum, i després una per tema.
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

/** Minúscules i sense accents: qui escriu "barbera" ha de trobar "Barberà". */
function sensAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

type Vista = {
  titol: string;
  sub: string;
  icona: NomIc;
  /** Prefix de ruta dels temes d'aquesta categoria. */
  base: string;
  /** Ruta del test barrejat de la categoria, si en té. */
  tot?: string;
  grups: Grup[];
  /** Mostra el cercador de grups (només té sentit amb molts municipis). */
  cercador?: boolean;
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
      cercador: true,
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

/** Millor nota d'un tema, o null si encara no s'ha fet mai. */
function nota(slug: string, stats: GlobalStats): number | null {
  const s = stats.topics[slug];
  if (!s || s.attempts === 0) return null;
  return s.best;
}

const ambDecimal = (n: number) => n.toFixed(1).replace('.', ',');

/** Els tres colors de la nota: aprovat folgat, just, i suspès. */
function colorsNota(n: number) {
  if (n >= 7) return { fg: V.ok, bg: V.okSoft };
  if (n >= 5) return { fg: V.warn, bg: V.warnSoft };
  return { fg: V.granate, bg: V.granateSoft };
}

/** Resum de com et va la categoria sencera. */
function resum(grups: Grup[], stats: GlobalStats) {
  let millor: number | null = null;
  let provats = 0;
  let tests = 0;
  let total = 0;
  for (const g of grups) {
    for (const t of g.temes) {
      total++;
      const s = stats.topics[t.slug];
      if (!s || s.attempts === 0) continue;
      provats++;
      tests += s.attempts;
      millor = millor === null ? s.best : Math.max(millor, s.best);
    }
  }
  return { millor, provats, tests, total };
}

export default function CategoriaTemes({ cos: cosProp }: { cos?: Cos }) {
  const nav = useNavigate();
  const { clau = '' } = useParams();
  const cos: Cos = cosProp ?? 'pl';
  const a = ACCENTS[cos];
  const stats = useGlobalStats();
  const [triat, setTriat] = useState<TestTopic | null>(null);
  const [cerca, setCerca] = useState('');

  const v = useMemo(() => vista(cos, clau), [cos, clau]);

  // Grups que passen el filtre del cercador. Es busca pel nom del grup
  // (el municipi) i també pel títol dels temes, perquè qui escriu
  // "ordenances" trobi els municipis que en tenen.
  const grupsVisibles = useMemo(() => {
    if (!v) return [];
    const q = sensAccents(cerca.trim());
    if (!q) return v.grups;
    return v.grups.filter(
      (g) =>
        sensAccents(g.titol ?? '').includes(q) ||
        g.temes.some((t) => sensAccents(t.title).includes(q)),
    );
  }, [v, cerca]);

  if (!v) {
    return (
      <div className="v3-page v3-anim">
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>Categoria no trobada</h1>
        <p style={{ fontSize: 14, color: V.muted, marginTop: 8 }}>
          Torna a la pantalla de tests i tria'n una de la llista.
        </p>
      </div>
    );
  }

  const nTemes = v.grups.reduce((n, g) => n + g.temes.length, 0);
  const r = resum(v.grups, stats);

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
          onClick={() => nav(cos === 'mossos' ? '/mossos' : '/policia-local')}
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
            {v.titol}
          </h1>
          <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0' }}>
            {v.sub} · {nTemes} {nTemes === 1 ? 'tema' : 'temes'}
          </p>
        </div>
      </div>

      {/* Com et va la categoria. Només si hi has fet alguna cosa: un panell
          ple de guions no informa de res i fa la pantalla més espessa. */}
      {r.tests > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          background: V.surface, borderRadius: 22, boxShadow: V.shadow,
          padding: '16px 6px', marginBottom: 16,
        }}>
          {[
            { et: 'MILLOR NOTA', val: r.millor === null ? '—' : ambDecimal(r.millor), destaca: true },
            { et: 'TEMES PROVATS', val: `${r.provats}/${r.total}` },
            { et: 'TESTS FETS', val: String(r.tests) },
          ].map((c, i) => (
            <div
              key={c.et}
              style={{
                textAlign: 'center', padding: '0 8px',
                borderLeft: i === 0 ? 'none' : `1px solid ${V.hair}`,
              }}>
              <div style={{
                fontSize: 26, fontWeight: 800, letterSpacing: -1,
                color: c.destaca && r.millor !== null ? colorsNota(r.millor).fg : V.ink,
              }}>
                {c.val}
              </div>
              <Mono size={9} color={V.faint} style={{ letterSpacing: 1.4 }}>{c.et}</Mono>
            </div>
          ))}
        </div>
      )}

      {v.tot && (
        <button
          type="button"
          className="ap-prem"
          onClick={() => nav(v.tot!)}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22,
            padding: 20, marginBottom: 18, background: a.accent, color: '#fff',
            boxShadow: `0 14px 30px ${a.glow}`,
            display: 'flex', alignItems: 'center', gap: 15,
          }}>
          <span style={{
            width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <I n="play" size={18} ple color="#fff" />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 18, fontWeight: 800, letterSpacing: -0.6 }}>
              Test barrejat de {v.titol.toLowerCase()}
            </span>
            <span style={{ display: 'block', fontSize: 12.5, opacity: 0.9, marginTop: 3 }}>
              Preguntes de tots els temes de la categoria
            </span>
          </span>
          <I n="arrow" size={17} sw={2.2} color="rgba(255,255,255,.85)" />
        </button>
      )}

      {/* Cercador de municipis. Amb la llista creixent, baixar amb el dit
          fins al teu poble deixava de ser raonable. */}
      {v.cercador && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: V.surface, borderRadius: 18, boxShadow: V.shadow,
              padding: '0 14px',
            }}>
            <I n="search" size={16} sw={2} color={V.faint} />
            <input
              type="search"
              value={cerca}
              onChange={(e) => setCerca(e.target.value)}
              placeholder="Cerca el teu municipi…"
              aria-label="Cerca el teu municipi"
              style={{
                flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                font: 'inherit', fontSize: 15, color: V.ink, padding: '13px 0',
              }}
            />
            {cerca && (
              <button
                type="button"
                onClick={() => setCerca('')}
                aria-label="Neteja la cerca"
                className="ap-prem ap-toc"
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: V.faint, display: 'flex', padding: 0,
                }}>
                <I n="x" size={15} sw={2} />
              </button>
            )}
          </div>
          {cerca && (
            <Mono size={10} color={V.faint} style={{ letterSpacing: 1.2, paddingLeft: 16, marginTop: 8, display: 'block' }}>
              {grupsVisibles.length === 0
                ? 'CAP MUNICIPI'
                : `${grupsVisibles.length} ${grupsVisibles.length === 1 ? 'MUNICIPI' : 'MUNICIPIS'}`}
            </Mono>
          )}
        </div>
      )}

      {grupsVisibles.length === 0 && v.cercador && (
        <div style={{
          background: V.surface, borderRadius: 22, boxShadow: V.shadow,
          padding: 24, textAlign: 'center', marginBottom: 20,
        }}>
          <p style={{ fontSize: 14, color: V.muted, margin: 0 }}>
            No tenim cap municipi que es digui així.
            <br />
            Si vols que hi afegim el teu, digues-nos-ho.
          </p>
        </div>
      )}

      {grupsVisibles.map((g, gi) => (
        <section key={g.titol ?? gi} style={{ marginBottom: 20 }}>
          {g.titol && (
            <h2 style={{
              fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
              color: V.faint, margin: '0 0 9px', paddingLeft: 16,
            }}>
              {g.titol}
            </h2>
          )}
          {/* Una sola targeta amb un filet entre temes, en comptes de vint
              targetes soltes: la llista es llegeix de dalt a baix i no
              sembla un aparador. */}
          <div className="ap-llista">
            {g.temes.map((t) => {
              const millor = nota(t.slug, stats);
              const c = millor === null ? null : colorsNota(millor);
              return (
                <button
                  key={t.slug}
                  type="button"
                  className="ap-fila"
                  onClick={() => setTriat(t)}>
                  <span style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: a.soft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                  }}>
                    {t.icon}
                  </span>
                  <span style={{
                    flex: 1, minWidth: 0, fontSize: 15, fontWeight: 650, letterSpacing: -0.35,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {t.title}
                  </span>
                  {t.badge && (
                    <span style={{
                      flexShrink: 0, fontSize: 11, fontWeight: 700, color: V.blue,
                      background: V.blueSoft, borderRadius: 999, padding: '3px 9px',
                    }}>
                      {t.badge}
                    </span>
                  )}
                  {/* La millor nota del tema. Si no l'has fet mai, no hi ha
                      res a dir: el buit ja ho diu. */}
                  {c && (
                    <span style={{
                      flexShrink: 0, fontSize: 13, fontWeight: 800, letterSpacing: -0.3,
                      color: c.fg, background: c.bg, borderRadius: 999, padding: '4px 10px',
                    }}>
                      {ambDecimal(millor!)}
                    </span>
                  )}
                  <I n="arrow" size={15} sw={2.2} color={V.faint} style={{ marginLeft: 2 }} />
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
          meta={nota(triat.slug, stats) !== null
            ? `Millor nota: ${ambDecimal(nota(triat.slug, stats)!)}`
            : "Encara no l'has fet"}
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
