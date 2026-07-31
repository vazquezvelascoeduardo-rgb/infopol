// Acadèmia — disseny v3 ("Web Acadèmia").
//
// La pantalla és una tria, no un tauler: primer decideixes per a quin cos
// et prepares (Policia Local o Mossos) i després com vols estudiar avui.
// El hero de dalt no és decoratiu — ensenya quants temes has tocat de
// debò, calculat des dels tests que has fet.
//
// Els itineraris que hi havia abans van fora: a l'app mòbil ja es van
// treure i les dues han d'ensenyar el mateix.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TOPICS, getTopicsByCategory } from '../data/tests';
import { useFailuresCounts } from '../lib/failures';
import { globalAverage, useGlobalStats } from '../lib/testStats';
import { useAuth } from '../lib/auth';
import { esBloquejat, plaDelPerfil, type ModulPro } from '../lib/pla';
import { CadenatPro, I, Mono, RV, TitolV, V, type NomIc } from '../lib/v3';

type Cos = 'pl' | 'mossos';

const COSSOS: { id: Cos; label: string }[] = [
  { id: 'pl', label: 'Policia Local' },
  { id: 'mossos', label: 'Mossos' },
];

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

function modes(cos: Cos, pendents: number): Mode[] {
  const base = cos === 'mossos' ? '/mossos' : '/policia-local';
  return [
    {
      titol: 'Estudia per tema',
      sub: 'El temari sencer, tema a tema',
      icona: 'book',
      to: cos === 'mossos' ? '/mossos/temari' : '/leyes',
      destacat: true,
      modul: 'temari-complet',
    },
    { titol: 'Test', sub: "Posa't a prova per temes", icona: 'check', to: base },
    {
      titol: 'Repàs intel·ligent',
      sub: 'Torna a les que has fallat',
      icona: 'brain',
      to: '/policia-local/debilitats',
      insignia: pendents > 0 ? String(pendents) : undefined,
    },
    { titol: 'Resums i esquemes', sub: 'Les lleis en una pàgina', icona: 'layers', to: `${base}/esquemes`, modul: 'esquemes' },
    { titol: 'Flashcards', sub: 'Memoritza articles i xifres', icona: 'cards', to: `${base}/flashcards`, modul: 'flashcards' },
  ];
}

function SelectorCos({ cos, onCanvia }: { cos: Cos; onCanvia: (c: Cos) => void }) {
  return (
    <div style={{
      display: 'inline-flex', background: V.surface2, borderRadius: RV.pill, padding: 4, gap: 4,
    }}>
      {COSSOS.map((c) => {
        const on = c.id === cos;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onCanvia(c.id)}
            aria-pressed={on}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: RV.pill, padding: '9px 18px',
              fontSize: 13, fontWeight: on ? 800 : 600, letterSpacing: -0.2,
              background: on ? V.surface : 'transparent',
              color: on ? V.ink : V.muted,
              boxShadow: on ? V.shadow : 'none',
            }}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function TargetaMode({ m, bloquejat, onClick }: { m: Mode; bloquejat: boolean; onClick: () => void }) {
  const fons = m.destacat ? V.terra : V.surface;
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
        boxShadow: m.destacat ? '0 14px 30px rgba(255,122,26,.3)' : V.shadow,
        display: 'flex', flexDirection: 'column', minHeight: 150,
      }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{
          width: 44, height: 44, borderRadius: 14,
          background: m.destacat ? 'rgba(255,255,255,.24)' : V.terraSoft,
          color: m.destacat ? '#fff' : V.terraInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n={m.icona} size={20} sw={1.9} />
        </span>
        {m.insignia && (
          <span style={{
            fontSize: 11, fontWeight: 700, borderRadius: RV.pill, padding: '6px 11px',
            background: m.destacat ? 'rgba(255,255,255,.24)' : V.terraSoft,
            color: m.destacat ? '#fff' : V.terraInk,
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

function AccesRapid({ icona, titol, sub, valor, to }: {
  icona: NomIc; titol: string; sub: string; valor?: string; to: string;
}) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(to)}
      style={{
        textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 22, padding: 18,
        background: V.surface, color: V.ink, boxShadow: V.shadow,
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
      }}>
      <span style={{
        width: 42, height: 42, flexShrink: 0, borderRadius: 14, background: V.surface2, color: V.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={icona} size={19} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, letterSpacing: -0.4 }}>{titol}</span>
        <span style={{ display: 'block', fontSize: 12, color: V.muted, marginTop: 3 }}>{sub}</span>
      </span>
      {valor && (
        <span style={{ flexShrink: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.7, color: V.terraInk }}>
          {valor}
        </span>
      )}
    </button>
  );
}

export default function Academia() {
  const nav = useNavigate();
  const [cos, setCos] = useState<Cos>('pl');
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

  const nomCos = cos === 'mossos' ? "Mossos d'Esquadra" : 'Policia Local';

  return (
    <div className="v3-page v3-anim">
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
                  cx="55" cy="55" r={RADI} fill="none" stroke={V.terra} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(VOLTA * pct) / 100} ${VOLTA}`}
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
            {modes(cos, failures.due).map((m) => {
              const tancat = !!m.modul && esBloquejat(m.modul, pla);
              return (
                <TargetaMode
                  key={m.titol}
                  m={m}
                  bloquejat={tancat}
                  onClick={() => nav(tancat ? '/perfil' : m.to)}
                />
              );
            })}
          </div>
        </div>

        {/* ── Columna lateral ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Accés ràpid</div>
          <AccesRapid icona="brain" titol="Debilitats" sub="Els temes que et costen" to="/policia-local/debilitats" />
          <AccesRapid
            icona="cards" titol="Flashcards" sub="Repàs espaiat"
            to={cos === 'mossos' ? '/mossos/flashcards' : '/policia-local/flashcards'}
          />
          <AccesRapid icona="medal" titol="Reptes" sub="Missions i objectius" to="/retos" />
          <AccesRapid icona="globe" titol="Cultura general" sub="Cultura i actualitat" to="/cultura-general" />
          <AccesRapid icona="chart" titol="Els meus logros" sub="El que has desbloquejat" to="/policia-local/logros" />
        </div>
      </div>
    </div>
  );
}
