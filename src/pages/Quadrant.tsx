// Quadrant de torns — un mes a la vegada.
//
// La mateixa pantalla que a l'app: tries un torn a dalt i el vas
// posant als dies; tocant un dia que ja el té, se'l treu. A sota, el
// resum del mes amb els torns fets, les hores estimades i el
// desglossament.
//
// Les hores són ESTIMADES a partir del tipus de torn (8 h els senzills,
// 12 h els dobles). No és un registre horari: ni ho pretén ni serveix
// per justificar res davant de ningú.
import { useEffect, useMemo, useState } from 'react';

import {
  DIES, MESOS, META, TORNS, diesDelMes, getQuadrant, iso, offsetInici,
  setQuadrantDay, type QuadrantMap, type TornCode,
} from '../lib/quadrant';
import { CardV, I, Mono, RV, TitolV, V } from '../lib/v3';

export default function Quadrant() {
  const avui = new Date();
  const [any, setAny] = useState(avui.getFullYear());
  const [mes, setMes] = useState(avui.getMonth());
  const [mapa, setMapa] = useState<QuadrantMap>({});
  const [torn, setTorn] = useState<TornCode>('M');

  useEffect(() => { setMapa(getQuadrant(any)); }, [any]);

  const dies = diesDelMes(any, mes);
  const buits = offsetInici(any, mes);

  function toca(dia: number) {
    const clau = iso(any, mes, dia);
    const actual = mapa[clau];
    const nou: TornCode | null = actual === torn ? null : torn;
    setQuadrantDay(clau, nou);
    setMapa((p) => {
      const c = { ...p };
      if (nou) c[clau] = nou;
      else delete c[clau];
      return c;
    });
  }

  function mou(delta: number) {
    let m = mes + delta;
    let a = any;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m);
    setAny(a);
  }

  // Resum del mes: només compta el que hi ha posat de debò.
  const resum = useMemo(() => {
    const compte: Partial<Record<TornCode, number>> = {};
    let torns = 0;
    let hores = 0;
    for (let d = 1; d <= dies; d++) {
      const t = mapa[iso(any, mes, d)];
      if (!t) continue;
      compte[t] = (compte[t] ?? 0) + 1;
      hores += META[t].hores;
      if (META[t].hores > 0) torns++;
    }
    return { compte, torns, hores };
  }, [mapa, any, mes, dies]);

  const esAvui = (d: number) =>
    any === avui.getFullYear() && mes === avui.getMonth() && d === avui.getDate();

  return (
    <div className="v3-page v3-anim">
      <TitolV pre="El meu" fort="quadrant" />
      <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 20px', lineHeight: 1.5 }}>
        Tria un torn i ves marcant els dies. Tocant un dia que ja el té, se'l treu.
      </p>

      <div className="v3-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {/* Selector de torn */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TORNS.map((t) => {
              const on = t.code === torn;
              return (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => setTorn(t.code)}
                  aria-pressed={on}
                  style={{
                    border: `1.5px solid ${on ? t.color : 'transparent'}`,
                    background: on ? t.color : V.surface,
                    color: on ? '#fff' : V.ink,
                    borderRadius: RV.pill, padding: '9px 15px', cursor: 'pointer',
                    fontSize: 12.5, fontWeight: on ? 800 : 600,
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: on ? 'none' : V.shadow,
                  }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: on ? '#fff' : t.color,
                  }} />
                  {t.nom}
                  {t.hores > 0 && (
                    <span style={{ opacity: 0.7, fontWeight: 600 }}>{t.hores} h</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendari */}
          <CardV pad={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <button
                type="button"
                onClick={() => mou(-1)}
                aria-label="Mes anterior"
                style={{
                  width: 38, height: 38, borderRadius: '50%', border: `1px solid ${V.border}`,
                  background: V.surface, color: V.ink, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <I n="back" size={16} sw={2.2} />
              </button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.6 }}>{MESOS[mes]}</div>
                <Mono size={10} color={V.muted}>{any}</Mono>
              </div>
              <button
                type="button"
                onClick={() => mou(1)}
                aria-label="Mes següent"
                style={{
                  width: 38, height: 38, borderRadius: '50%', border: `1px solid ${V.border}`,
                  background: V.surface, color: V.ink, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <I n="arrow" size={16} sw={2.2} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 8 }}>
              {DIES.map((d) => (
                <Mono key={d} size={9.5} color={V.muted} style={{ textAlign: 'center', display: 'block' }}>
                  {d}
                </Mono>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
              {Array.from({ length: buits }, (_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: dies }, (_, i) => {
                const dia = i + 1;
                const t = mapa[iso(any, mes, dia)];
                const meta = t ? META[t] : null;
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toca(dia)}
                    aria-label={`${dia} de ${MESOS[mes]}${meta ? `, ${meta.nom}` : ''}`}
                    style={{
                      aspectRatio: '1', border: esAvui(dia) ? `2px solid ${V.ink}` : '2px solid transparent',
                      borderRadius: 12, cursor: 'pointer',
                      background: meta ? meta.color : V.paper,
                      color: meta ? '#fff' : V.ink,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 1,
                      fontSize: 13, fontWeight: 700, padding: 0,
                    }}>
                    {dia}
                    {meta && (
                      <span style={{ fontSize: 8.5, fontWeight: 800, opacity: 0.9 }}>{meta.code}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardV>
        </div>

        {/* Resum */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div style={{
            background: 'var(--v-ink-fixed)', borderRadius: RV.xl, padding: 24, color: '#fff',
            boxShadow: '0 14px 30px rgba(21,21,28,.24)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Resum del mes</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>{resum.torns}</div>
                <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ display: 'block', marginTop: 4 }}>
                  TORNS
                </Mono>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,.16)' }} />
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>{resum.hores}h</div>
                <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ display: 'block', marginTop: 4 }}>
                  ESTIMADES
                </Mono>
              </div>
            </div>
          </div>

          <CardV>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45, marginBottom: 14 }}>
              Per torn
            </div>
            {resum.torns === 0 && Object.keys(resum.compte).length === 0 ? (
              <p style={{ fontSize: 13, color: V.muted, margin: 0, lineHeight: 1.5 }}>
                Encara no has marcat cap dia d'aquest mes.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TORNS.filter((t) => resum.compte[t.code]).map((t) => (
                  <div key={t.code} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span style={{ width: 11, height: 11, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{t.nom}</span>
                    <span style={{ fontSize: 14, fontWeight: 800 }}>{resum.compte[t.code]}</span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: 11.5, color: V.faint, margin: '16px 0 0', lineHeight: 1.5 }}>
              Les hores són estimades pel tipus de torn. No és un registre horari.
            </p>
          </CardV>
        </div>
      </div>
    </div>
  );
}
