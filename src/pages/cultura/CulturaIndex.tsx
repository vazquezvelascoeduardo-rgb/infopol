// Cultura general — índex de les 16 àrees.
//
// Abans aquesta pantalla era un embut cap al test i el temari sencer
// vivia en una sola pàgina interminable. Ara és el que és: un temari de
// setze àrees, cadascuna amb la seva pàgina, i el test al final —quan ja
// t'ho has mirat.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CULTURA_AREAS } from '../../data/cultura-temari';
import { I, Mono, V } from '../../lib/v3';
import { compta, palDe } from './blocs';

export default function CulturaIndex() {
  const nav = useNavigate();

  const arees = useMemo(
    () => CULTURA_AREAS.map((a, i) => ({ ...a, n: i + 1, fets: compta(a), c: palDe(a.id) })),
    [],
  );
  const totalFets = arees.reduce((s, a) => s + a.fets, 0);

  return (
    <div className="v3-page v3-anim">
      <Mono size={10} color={V.terraInk} style={{ letterSpacing: 1.8 }}>CAU A L&apos;EXAMEN</Mono>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.1, margin: '6px 0 0' }}>
        Cultura general
      </h1>
      <p style={{ fontSize: 13.5, color: V.muted, margin: '7px 0 0', maxWidth: 560 }}>
        Setze àrees amb els fets que solen sortir. Tria&apos;n una per repassar-la, o fes el test
        de tot quan ja te les hagis mirat.
      </p>

      {/* Les xifres surten del contingut, no són decoració. */}
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', margin: '20px 0 26px' }}>
        {[
          { valor: String(arees.length), label: 'ÀREES' },
          { valor: totalFets.toLocaleString('ca-ES'), label: 'FETS CLAU' },
        ].map((x) => (
          <div key={x.label}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>{x.valor}</div>
            <Mono size={9} color={V.faint} style={{ display: 'block', marginTop: 3, letterSpacing: 1.4 }}>
              {x.label}
            </Mono>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {arees.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => nav(`/cultura-general/tema/${a.id}`)}
            style={{
              textAlign: 'left', cursor: 'pointer', border: `1px solid ${V.hair}`, borderRadius: 18,
              padding: 17, background: V.surface, color: V.ink, boxShadow: V.shadow,
              display: 'flex', alignItems: 'flex-start', gap: 13,
            }}>
            <span style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 14,
              background: a.c.soft, color: a.c.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: V.mono, fontSize: 13, fontWeight: 800,
            }}>
              {String(a.n).padStart(2, '0')}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>
                {a.es}
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: V.muted, lineHeight: 1.4, marginTop: 4 }}>
                {a.blurb}
              </span>
              <Mono size={9.5} color={a.c.solid} style={{ display: 'block', marginTop: 8, letterSpacing: 1.2 }}>
                {a.fets} FETS
              </Mono>
            </span>
          </button>
        ))}
      </div>

      {/* El test, al final: primer es repassa i després es comprova. */}
      <button
        type="button"
        onClick={() => nav('/cultura-general/tot')}
        style={{
          marginTop: 22, width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
          borderRadius: 22, padding: 20, background: V.terra, color: '#fff',
          boxShadow: '0 14px 30px rgba(255,122,26,.3)',
          display: 'flex', alignItems: 'center', gap: 15,
        }}>
        <span style={{
          width: 46, height: 46, flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n="check" size={21} sw={2} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>
            Test de tota la cultura general
          </span>
          <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,.9)', marginTop: 4 }}>
            Preguntes barrejades de les setze àrees
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 800 }}>›</span>
      </button>
    </div>
  );
}
