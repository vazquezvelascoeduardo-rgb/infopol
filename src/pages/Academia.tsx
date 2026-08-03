// Acadèmia — disseny v3 ("Web Acadèmia").
//
// La pantalla és una tria, no un tauler: primer decideixes per a quin cos
// et prepares (Policia Local o Mossos) i després com vols estudiar avui.
// El hero de dalt no és decoratiu — ensenya quants temes has tocat de
// debò, calculat des dels tests que has fet.
//
// Els itineraris que hi havia abans van fora: a l'app mòbil ja es van
// treure i les dues han d'ensenyar el mateix.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TOPICS, getTopicsByCategory } from '../data/tests';
import { TEMES } from '../content/temari-pl';
import { useFailuresCounts } from '../lib/failures';
import { globalAverage, useGlobalStats } from '../lib/testStats';
import { useAuth } from '../lib/auth';
import { esBloquejat, plaDelPerfil, type ModulPro } from '../lib/pla';
import { CadenatPro, I, Mono, RV, TitolV, V, type NomIc } from '../lib/v3';
import { COSSOS, RUTES, metaCos, useCos, type Cos } from '../lib/cos';

type Mode = {
  titol: string;
  sub: string;
  icona: NomIc;
  to: string;
  insignia?: string;
  destacat?: boolean;
  /** El que abans era una targeta pròpia i ara viu dins d'aquest verb. */
  dins?: { label: string; to: string }[];
  /** Mòdul de pagament al qual pertany, si un dia n'hi ha (lib/pla.ts). */
  modul?: ModulPro;
};

/**
 * Tres verbs, no nou portes.
 *
 * Hi havia cinc targetes a dalt i cinc accessos ràpids al costat, i entre
 * les dues llistes sortien dotze maneres d'entrar que en realitat són tres
 * moments: llegir-t'ho, posar-t'ho a prova i tornar-hi. Qui porta mig any
 * s'hi orienta; qui entra el primer dia, no.
 *
 * El que hi havia no desapareix: passa a dins del verb que li toca, en
 * una fila d'enllaços petits sota cada targeta.
 */
function modes(cos: Cos, temes: number): Mode[] {
  const r = RUTES[cos];
  return [
    {
      titol: 'Estudiar',
      sub: 'El temari, tema a tema, amb els teus subratllats',
      icona: 'book',
      insignia: `${temes} TEMES`,
      to: r.estudi,
      modul: 'temari-complet',
      dins: [
        { label: 'Esquemes', to: r.esquemes },
        { label: 'Cultura general', to: '/cultura-general' },
        { label: 'Actualitat', to: '/noticies' },
      ],
    },
    {
      titol: 'Practicar',
      sub: 'Tests per tema, per blocs o de tot alhora',
      icona: 'check',
      insignia: 'TESTS',
      destacat: true,
      to: r.test,
      dins: [
        { label: 'Flashcards', to: r.flashcards },
        { label: 'Reptes', to: '/retos' },
      ],
    },
    {
      titol: 'Repassar',
      sub: 'Què toca avui i on fluixeges abans de l\'examen',
      icona: 'brain',
      insignia: 'DIARI',
      to: '/repas',
      dins: [
        { label: 'Diagnòstic per tema', to: '/diagnostic' },
        { label: 'Debilitats', to: r.debilitats },
        { label: 'Els meus logros', to: r.logros },
      ],
    },
  ];
}

/**
 * El commutador de cos.
 *
 * La pastilla activa es tenyeix del color del cos i llisca d'un costat a
 * l'altre: així el canvi es veu i no cal buscar quin dels dos està premut.
 */
function SelectorCos({ cos, onCanvia }: { cos: Cos; onCanvia: (c: Cos) => void }) {
  const i = COSSOS.findIndex((c) => c.id === cos);
  return (
    <div style={{
      position: 'relative', display: 'inline-flex', background: V.surface2,
      borderRadius: RV.pill, padding: 4, gap: 4,
    }}>
      <span
        aria-hidden
        style={{
          position: 'absolute', top: 4, bottom: 4, left: 4,
          width: `calc((100% - 12px) / ${COSSOS.length})`,
          transform: `translateX(calc(${i} * (100% + 4px)))`,
          borderRadius: RV.pill, background: 'var(--accent)',
          boxShadow: '0 6px 16px var(--accent-ombra)',
          transition: 'transform .32s cubic-bezier(.4,0,.2,1), background .32s ease',
        }}
      />
      {COSSOS.map((c) => {
        const on = c.id === cos;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onCanvia(c.id)}
            aria-pressed={on}
            style={{
              position: 'relative', border: 'none', cursor: 'pointer', borderRadius: RV.pill,
              padding: '9px 18px', background: 'transparent',
              fontSize: 13, fontWeight: on ? 800 : 600, letterSpacing: -0.2,
              color: on ? '#fff' : V.muted,
              transition: 'color .24s ease',
            }}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function TargetaMode({ m, bloquejat, onClick }: { m: Mode; bloquejat: boolean; onClick: () => void }) {
  const fons = m.destacat ? 'var(--accent)' : V.surface;
  const text = m.destacat ? '#fff' : V.ink;
  const sub = m.destacat ? 'rgba(255,255,255,.9)' : V.muted;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={bloquejat}
      style={{
        position: 'relative',
        textAlign: 'left', cursor: bloquejat ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 22, padding: 20,
        background: fons, color: text,
        boxShadow: m.destacat ? '0 14px 30px var(--accent-ombra)' : V.shadow,
        display: 'flex', flexDirection: 'column', minHeight: 150,
        transition: 'background .32s ease, box-shadow .32s ease',
      }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{
          width: 44, height: 44, borderRadius: 14,
          background: m.destacat ? 'rgba(255,255,255,.24)' : 'var(--accent-soft)',
          color: m.destacat ? '#fff' : 'var(--accent-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .32s ease, color .32s ease',
        }}>
          <I n={m.icona} size={20} sw={1.9} />
        </span>
        {m.insignia && (
          <span style={{
            fontSize: 11, fontWeight: 700, borderRadius: RV.pill, padding: '6px 11px',
            background: m.destacat ? 'rgba(255,255,255,.24)' : 'var(--accent-soft)',
            color: m.destacat ? '#fff' : 'var(--accent-ink)',
            transition: 'background .32s ease, color .32s ease',
          }}>
            {m.insignia}
          </span>
        )}
      </span>
      <span style={{ display: 'block', fontSize: 17, fontWeight: 800, letterSpacing: -0.5, marginTop: 'auto', paddingTop: 15 }}>
        {m.titol}
      </span>
      <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.45, color: sub, marginTop: 5 }}>
        {m.sub}
      </span>
      {bloquejat && <CadenatPro />}
    </button>
  );
}

function AccesRapid({ icona, titol, sub, valor, to, destacat }: {
  icona: NomIc; titol: string; sub: string; valor?: string; to: string;
  /** Amb vora de color i icona plena: es veu que no és un més de la llista. */
  destacat?: boolean;
}) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(to)}
      style={{
        textAlign: 'left', cursor: 'pointer', borderRadius: 22, padding: 18,
        border: destacat ? '1.5px solid var(--accent)' : 'none',
        background: V.surface, color: V.ink,
        boxShadow: destacat ? '0 10px 24px var(--accent-ombra)' : V.shadow,
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        transition: 'border-color .32s ease, box-shadow .32s ease',
      }}>
      <span style={{
        width: 42, height: 42, flexShrink: 0, borderRadius: 14,
        background: destacat ? 'var(--accent)' : V.surface2,
        color: destacat ? '#fff' : V.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .32s ease',
      }}>
        <I n={icona} size={19} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, letterSpacing: -0.4 }}>{titol}</span>
        <span style={{ display: 'block', fontSize: 12, color: V.muted, marginTop: 3 }}>{sub}</span>
      </span>
      {valor && (
        <span style={{ flexShrink: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.7, color: 'var(--accent-ink)' }}>
          {valor}
        </span>
      )}
      {destacat && !valor && (
        <span style={{ flexShrink: 0, fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>›</span>
      )}
    </button>
  );
}

export default function Academia() {
  const nav = useNavigate();
  const [cos, setCos] = useCos();
  const { profile } = useAuth();
  const pla = plaDelPerfil(profile);
  const stats = useGlobalStats();
  const failures = useFailuresCounts();
  const { attempts, avgGrade } = globalAverage(stats);

  // Temes del cos triat i quants n'has tocat de debò.
  const { total, fets, preguntes } = useMemo(() => {
    const llista = cos === 'mossos'
      ? getTopicsByCategory('mossos')
      : TOPICS.filter((t) => (t.category ?? 'temari') !== 'mossos');
    return {
      total: llista.length,
      fets: llista.filter((t) => (stats.topics[t.slug]?.attempts ?? 0) > 0).length,
      preguntes: llista.reduce((a, t) => a + t.questions.length, 0),
    };
  }, [cos, stats.topics]);

  const pct = total ? Math.round((fets / total) * 100) : 0;

  // Anell de progrés del hero.
  const RADI = 46;
  const VOLTA = 2 * Math.PI * RADI;

  const meta = metaCos(cos);
  const nomCos = meta.nom;

  return (
    <div
      className="v3-page v3-anim"
      style={{
        // L'accent del cos tenyeix tota la pantalla i canvia amb transició.
        ['--accent' as never]: meta.accent,
        ['--accent-ink' as never]: meta.accentInk,
        ['--accent-soft' as never]: meta.accentSoft,
        ['--accent-ombra' as never]: meta.ombra,
      } as React.CSSProperties}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap', marginBottom: 22,
      }}>
        <TitolV fort="Acadèmia" post="de preparació" />
        <SelectorCos cos={cos} onCanvia={setCos} />
      </div>

      <div className="v3-cols">
        {/* ── Columna principal ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div style={{
            background: 'var(--v-ink-fixed)', borderRadius: RV.xl, padding: 24, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
            boxShadow: '0 14px 30px rgba(21,21,28,.24)',
          }}>
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg viewBox="0 0 110 110" style={{ width: 110, height: 110, transform: 'rotate(-90deg)' }} aria-hidden>
                <circle cx="55" cy="55" r={RADI} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="10" />
                <circle
                  cx="55" cy="55" r={RADI} fill="none" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(VOLTA * pct) / 100} ${VOLTA}`}
                  // Color literal, no `var(--accent)`: amb una variable, la
                  // transició d'`stroke` es queda amb el color d'abans i
                  // l'anell no canviava en passar de cos.
                  style={{
                    stroke: meta.accent,
                    transition: 'stroke .32s ease, stroke-dasharray .5s cubic-bezier(.4,0,.2,1)',
                  }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1.1, lineHeight: 1 }}>
                  {pct}<span style={{ fontSize: 14 }}>%</span>
                </span>
                <Mono size={8.5} color="rgba(255,255,255,.55)" style={{ marginTop: 4 }}>TEMARI</Mono>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>
                {fets === 0 ? 'Comencem' : pct >= 60 ? 'Vas pel bon camí' : 'A poc a poc'}
              </div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.66)', lineHeight: 1.5, marginTop: 7 }}>
                {fets === 0
                  ? `Tens ${total} temes de ${nomCos} per començar, amb ${preguntes.toLocaleString('ca-ES')} preguntes.`
                  : `Has tocat ${fets} de ${total} temes del temari de ${nomCos}.`}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  { valor: String(attempts), label: 'TESTS FETS' },
                  { valor: attempts ? avgGrade.toFixed(1).replace('.', ',') : '—', label: 'NOTA MITJANA' },
                  { valor: String(failures.total), label: 'PER REPASSAR' },
                ].map((h) => (
                  <div key={h.label}>
                    <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.6 }}>{h.valor}</div>
                    <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ display: 'block', marginTop: 4 }}>
                      {h.label}
                    </Mono>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Com vols estudiar</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {modes(cos, TEMES.length).map((m) => {
              const tancat = !!m.modul && esBloquejat(m.modul, pla);
              return (
                <div key={m.titol} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                  <TargetaMode m={m} bloquejat={tancat} onClick={() => nav(tancat ? '/perfil' : m.to)} />
                  {/* El que abans era una targeta pròpia. Va aquí, petit:
                      qui ho busca ho troba, i qui no, no hi ensopega. */}
                  {m.dins && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', padding: '0 4px' }}>
                      {m.dins.map((d) => (
                        <button
                          key={d.to}
                          type="button"
                          onClick={() => nav(d.to)}
                          style={{
                            border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                            fontSize: 12.5, fontWeight: 600, color: V.muted, textDecoration: 'underline',
                            textDecorationColor: V.border, textUnderlineOffset: 3,
                          }}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Columna lateral ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Accés ràpid</div>
          {/* Cultura general va primera i destacada: cau a l'examen i
              abans quedava perduda entre els altres accessos. Porta al
              temari, que és el que s'estudia; el test ja és a dins. */}
          {/* Aquí només hi ha el que NO és cap dels tres verbs. Cultura
              general i actualitat entren a l'examen però no són el temari;
              la resta ja viu a dins d'Estudiar, Practicar o Repassar. */}
          <AccesRapid
            icona="globe" titol="Cultura general" sub="16 àrees per repassar abans del test"
            to="/cultura-general" destacat
          />
          <AccesRapid
            icona="news" titol="Actualitat" sub="Notícies, personalitats, premis i esports"
            to="/noticies" destacat
          />
          <AccesRapid icona="cards" titol="Quadrant" sub="Els teus torns de servei" to="/quadrant" />
        </div>
      </div>
    </div>
  );
}
