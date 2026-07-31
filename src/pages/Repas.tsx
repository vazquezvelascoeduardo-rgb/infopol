// Sessió de REPÀS DIARI — la mateixa que a l'app: tres fases (entrada,
// sessió i resum), sense barra de progrés intrusiva ni gamificació.
//
// Què entra a la sessió ho decideix el motor de repàs espaiat, que és
// còpia literal del de l'app: les preguntes que ja toquen segons quan i
// com les vas respondre, més les que tens pendents d'haver fallat.
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { recordFailure, recordSuccess } from '../lib/failures';
import { construeixSessio, registraResposta, type PreguntaSessio } from '../lib/repaso/sessio';
import type { Grade } from '../lib/repaso/scheduler';
import { CardV, I, Mono, RV, TitolV, V } from '../lib/v3';

const LLETRES = ['A', 'B', 'C', 'D'];

type Fase = 'carregant' | 'entrada' | 'sessio' | 'resum';
type Resultat = { qid: string; topicTitle: string; encert: boolean };

export default function Repas() {
  const nav = useNavigate();
  const [fase, setFase] = useState<Fase>('carregant');
  const [cua, setCua] = useState<PreguntaSessio[]>([]);
  const [idx, setIdx] = useState(0);
  const [triada, setTriada] = useState<number | null>(null);
  const [resultats, setResultats] = useState<Resultat[]>([]);

  const prepara = useCallback(() => {
    const q = construeixSessio();
    setCua(q);
    setIdx(0);
    setTriada(null);
    setResultats([]);
    setFase('entrada');
  }, []);

  useEffect(() => { prepara(); }, [prepara]);

  const actual = cua[idx];

  function respon(i: number) {
    if (triada !== null || !actual) return;
    setTriada(i);
    const encert = i === actual.correct;

    // El grau que veu el motor: encertar-la a la primera és 'good';
    // fallar-la, 'fail'. No hi ha autoavaluació perquè aquí es respon un
    // test, no s'estima la pròpia seguretat.
    const grau: Grade = encert ? 'good' : 'fail';
    registraResposta(actual.qid, grau);

    // I la llista de debilitats, que és la que alimenta /debilitats.
    if (encert) recordSuccess(actual.qid);
    else recordFailure(actual.qid, actual.topicSlug);

    setResultats((p) => [...p, { qid: actual.qid, topicTitle: actual.topicTitle, encert }]);
  }

  function seguent() {
    if (idx + 1 >= cua.length) { setFase('resum'); return; }
    setIdx((i) => i + 1);
    setTriada(null);
  }

  // ── Entrada ───────────────────────────────────────────────────
  if (fase === 'carregant') {
    return <div className="v3-page"><p style={{ color: V.muted, fontSize: 13.5 }}>Preparant el repàs…</p></div>;
  }

  if (fase === 'entrada') {
    const buit = cua.length === 0;
    return (
      <div className="v3-page v3-anim">
        <TitolV fort="Repàs" post="intel·ligent" />
        <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 20px', lineHeight: 1.5 }}>
          El sistema tria què toca avui: el que vas fallar i el que ja fa dies que no repasses.
        </p>

        <CardV style={{ maxWidth: 560 }}>
          {buit ? (
            <>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.6 }}>Avui no toca res</div>
              <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 18px', lineHeight: 1.5 }}>
                No tens preguntes pendents de repassar. Fes tests i el sistema anirà
                programant els repassos sol, segons el que et costi més.
              </p>
              <button
                type="button"
                onClick={() => nav('/policia-local')}
                style={{
                  border: 'none', background: V.fill, color: V.fillFg, borderRadius: RV.pill,
                  padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                }}>
                Fer un test
              </button>
            </>
          ) : (
            <>
              <Mono size={9.5} color={V.terraInk}>AVUI</Mono>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.2, marginTop: 8 }}>
                {cua.length} pregunt{cua.length === 1 ? 'a' : 'es'}
              </div>
              <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 18px', lineHeight: 1.5 }}>
                Respon sense presses. El que encertis trigarà més a tornar; el que falles,
                el tornaràs a veure demà.
              </p>
              <button
                type="button"
                onClick={() => setFase('sessio')}
                style={{
                  border: 'none', background: V.terra, color: '#fff', borderRadius: RV.pill,
                  padding: '13px 26px', fontSize: 14.5, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 10px 22px rgba(255,122,26,.32)',
                }}>
                Començar
              </button>
            </>
          )}
        </CardV>
      </div>
    );
  }

  // ── Resum ─────────────────────────────────────────────────────
  if (fase === 'resum') {
    const encerts = resultats.filter((r) => r.encert).length;
    const pct = resultats.length ? Math.round((encerts / resultats.length) * 100) : 0;
    return (
      <div className="v3-page v3-anim">
        <TitolV fort="Repàs" post="acabat" />
        <CardV style={{ maxWidth: 560, marginTop: 16 }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.6 }}>
            {encerts}<span style={{ fontSize: 20, color: V.muted }}> / {resultats.length}</span>
          </div>
          <div style={{ fontSize: 13.5, color: V.muted, marginTop: 4 }}>{pct}% d'encerts</div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={prepara}
              style={{
                border: 'none', background: V.fill, color: V.fillFg, borderRadius: RV.pill,
                padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              }}>
              Un altre repàs
            </button>
            <button
              type="button"
              onClick={() => nav('/academia')}
              style={{
                border: `1px solid ${V.border}`, background: V.surface, color: V.ink,
                borderRadius: RV.pill, padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              }}>
              Tornar a l'Acadèmia
            </button>
          </div>
        </CardV>

        {resultats.some((r) => !r.encert) && (
          <div style={{ marginTop: 20, maxWidth: 560 }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45, marginBottom: 12 }}>
              Per tornar-hi
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {resultats.filter((r) => !r.encert).map((r, i) => (
                <div key={`${r.qid}-${i}`} style={{
                  background: V.surface, borderRadius: RV.md, padding: '12px 16px',
                  boxShadow: V.shadow, fontSize: 13.5, fontWeight: 600,
                }}>
                  {r.topicTitle}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Sessió ────────────────────────────────────────────────────
  if (!actual) return null;
  const respost = triada !== null;

  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <button
          type="button"
          onClick={() => setFase('resum')}
          aria-label="Acabar"
          style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: '50%', border: `1px solid ${V.border}`,
            background: V.surface, cursor: 'pointer', color: V.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <I n="x" size={16} sw={2} />
        </button>
        <div style={{ flex: 1, height: 9, borderRadius: RV.pill, background: V.surface2, overflow: 'hidden' }}>
          <div style={{
            width: `${((idx + (respost ? 1 : 0)) / cua.length) * 100}%`, height: '100%',
            borderRadius: RV.pill, background: V.terra, transition: 'width .35s ease',
          }} />
        </div>
        <Mono size={12.5} color={V.muted} style={{ fontWeight: 700, letterSpacing: 0 }}>
          {idx + 1}/{cua.length}
        </Mono>
      </div>

      <CardV pad={26} style={{ marginBottom: 14 }}>
        <Mono size={10.5} color={V.terraInk}>{actual.topicTitle.toUpperCase()}</Mono>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1.32, marginTop: 12 }}>
          {actual.text}
        </div>
      </CardV>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {actual.options.map((o, i) => {
          // Els tokens de V són literals: sense el tipus explícit,
          // TypeScript els fixa al primer valor i no deixa reassignar-los.
          let vora: string = 'transparent';
          const fons: string = V.surface;
          let marcaFons: string = V.surface2;
          let marcaText: string = V.muted;
          let text: string = V.ink;
          let lletra: string = LLETRES[i];
          if (respost) {
            if (i === actual.correct) {
              vora = V.ok; marcaFons = V.ok; marcaText = '#fff'; lletra = '✓';
            } else if (i === triada) {
              vora = V.granate; marcaFons = V.granate; marcaText = '#fff'; lletra = '✕';
            } else {
              text = V.muted;
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => respon(i)}
              disabled={respost}
              style={{
                width: '100%', textAlign: 'left', cursor: respost ? 'default' : 'pointer',
                border: `1.5px solid ${vora}`, background: fons, color: text,
                borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center',
                gap: 14, minHeight: 62, boxShadow: V.shadow,
              }}>
              <span style={{
                width: 30, height: 30, flexShrink: 0, borderRadius: 10,
                background: marcaFons, color: marcaText,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13.5, fontWeight: 800,
              }}>
                {lletra}
              </span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{o}</span>
            </button>
          );
        })}
      </div>

      {respost && (
        <>
          {actual.reference && (
            <div style={{
              marginTop: 16, background: V.surface, borderRadius: RV.lg, padding: 18,
              boxShadow: V.shadow,
            }}>
              <Mono size={9.5} color={V.muted}>REFERÈNCIA</Mono>
              <div style={{ fontSize: 14, marginTop: 8 }}>{actual.reference}</div>
            </div>
          )}
          <button
            type="button"
            onClick={seguent}
            style={{
              width: '100%', marginTop: 12, border: 'none', borderRadius: 18, padding: 18,
              background: V.fill, color: V.fillFg, fontSize: 15.5, fontWeight: 800, cursor: 'pointer',
            }}>
            {idx + 1 >= cua.length ? 'Veure el resum' : 'Següent'}
          </button>
        </>
      )}
    </div>
  );
}
