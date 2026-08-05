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
import { TEMES_MOSSOS } from '../content/temari-mossos';
import { useFailuresCounts } from '../lib/failures';
import { globalAverage, useGlobalStats } from '../lib/testStats';
import type { ModulPro } from '../lib/pla';
import { CadenatPro, I, Mono, RV, SegV, TitolV, V, type NomIc } from '../lib/v3';
import { COSSOS, metaCos, useCos } from '../lib/cos';
import { verbs } from '../lib/verbs';

type Mode = {
  titol: string;
  sub: string;
  icona: NomIc;
  to: string;
  insignia?: string;
  destacat?: boolean;
  /** Mòdul de pagament al qual pertany, si un dia n'hi ha (lib/pla.ts). */
  modul?: ModulPro;
};

function TargetaMode({ m, bloquejat, onClick }: { m: Mode; bloquejat: boolean; onClick: () => void }) {
  const fons = m.destacat ? 'var(--accent)' : V.surface;
  const text = m.destacat ? '#fff' : V.ink;
  const sub = m.destacat ? 'rgba(255,255,255,.9)' : V.muted;
  return (
    <button
      type="button"
      className={m.destacat ? 'v3-sura' : undefined}
      onClick={onClick}
      aria-disabled={bloquejat}
      style={{
        position: 'relative',
        textAlign: 'left', cursor: bloquejat ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 22, padding: 20,
        background: fons, color: text,
        boxShadow: m.destacat
          ? '0 2px 6px var(--accent-ombra), 0 18px 40px var(--accent-ombra)'
          : V.shadow,
        display: 'flex', flexDirection: 'column', minHeight: 150,
        transition: 'background .32s ease, box-shadow .32s ease, transform .34s cubic-bezier(.22, 1, .36, 1)',
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

export default function Academia() {
  const nav = useNavigate();
  const [cos, setCos] = useCos();
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
      {/* El commutador, enganxat al títol i no a l'altra punta de la
          pantalla: a l'escriptori quedava tan lluny que no es llegia com
          una cosa del títol, sinó com un botó perdut a la dreta. */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 22,
      }}>
        <TitolV fort="Acadèmia" post="de preparació" />
        <SegV opcions={COSSOS.map((c) => ({ id: c.id, label: c.label }))} valor={cos} onTria={setCos} />
      </div>

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
                    transition: 'stroke .32s ease, stroke-dasharray .5s var(--mou)',
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
          {/* Tres botons i prou. Cadascun obre la seva pantalla, i allà
              hi ha tot el que li pertoca amb el principal destacat. */}
          {/* Tres botons i prou. Cadascun obre la seva pantalla, i allà
              hi ha tot el que li pertoca amb el principal destacat. */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {verbs(cos, cos === 'mossos' ? TEMES_MOSSOS.length : TEMES.length).map((v) => (
              <TargetaMode
                key={v.id}
                m={{ titol: v.titol, sub: v.sub, icona: v.icona, insignia: v.insignia, to: '', destacat: v.id === 'practicar' }}
                bloquejat={false}
                onClick={() => nav(`/academia/${v.id}`)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
