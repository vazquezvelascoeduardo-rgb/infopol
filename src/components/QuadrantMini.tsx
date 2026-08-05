// El quadrant del mes, per al perfil.
//
// El disseny el vol a la vista i no darrere d'un botó: d'un cop d'ull has
// de veure els torns del mes i quantes hores et surten. Clicant-hi s'obre
// el quadrant sencer, que és on s'editen.
import { useEffect, useState } from 'react';

import { META, MESOS, diesDelMes, getQuadrant, iso, offsetInici, type TornCode } from '../lib/quadrant';
import { I, Mono, V } from '../lib/v3';

export default function QuadrantMini({ onObre }: { onObre: () => void }) {
  const avui = new Date();
  const any = avui.getFullYear();
  const mes = avui.getMonth();
  const [mapa, setMapa] = useState<Record<string, TornCode>>({});

  useEffect(() => { setMapa(getQuadrant(any)); }, [any]);

  const dies = diesDelMes(any, mes);
  const buits = offsetInici(any, mes);
  const marcats = Array.from({ length: dies }, (_, i) => mapa[iso(any, mes, i + 1)]).filter(Boolean) as TornCode[];
  const hores = marcats.reduce((a, c) => a + (META[c]?.hores ?? 0), 0);

  return (
    <button
      type="button"
      onClick={onObre}
      className="v3-card"
      style={{
        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
        background: 'var(--v-ink-fixed)', color: '#fff',
        boxShadow: '0 14px 30px rgba(21,21,28,.24)',
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16 }}>
        <span style={{
          width: 40, height: 40, flexShrink: 0, borderRadius: 14, background: V.terra,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="calendar" size={19} sw={1.9} color="#fff" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 16.5, fontWeight: 800, letterSpacing: -0.5 }}>
            El meu quadrant
          </span>
          <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,.6)', marginTop: 3 }}>
            {MESOS[mes]} {any}
          </span>
        </span>
        <I n="arrow" size={16} sw={2.2} color="rgba(255,255,255,.55)" />
      </span>

      <span style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
        {Array.from({ length: buits }, (_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: dies }, (_, i) => {
          const t = mapa[iso(any, mes, i + 1)] ? META[mapa[iso(any, mes, i + 1)]] : null;
          return (
            <span
              key={i}
              style={{
                aspectRatio: '1', borderRadius: 10,
                background: t ? t.color : 'rgba(255,255,255,.07)',
                color: t ? '#fff' : 'rgba(255,255,255,.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11.5, fontWeight: 700,
              }}>
              {i + 1}
            </span>
          );
        })}
      </span>

      <span style={{ display: 'flex', gap: 22, marginTop: 16 }}>
        <span>
          <span style={{ display: 'block', fontSize: 20, fontWeight: 800, letterSpacing: -0.6 }}>
            {marcats.length}
          </span>
          <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ letterSpacing: 1.4 }}>TORNS</Mono>
        </span>
        <span>
          <span style={{ display: 'block', fontSize: 20, fontWeight: 800, letterSpacing: -0.6 }}>
            {hores}h
          </span>
          <Mono size={8.5} color="rgba(255,255,255,.5)" style={{ letterSpacing: 1.4 }}>ESTIMADES</Mono>
        </span>
      </span>
    </button>
  );
}
