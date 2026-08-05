// Cultura general — una àrea.
//
// Mateixa forma que un tema del temari: capçalera amb l'accent de l'àrea,
// el contingut a sota i, al peu, l'àrea anterior i la següent perquè es
// pugui recórrer tot sense tornar a l'índex cada vegada.
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CULTURA_AREAS } from '../../data/cultura-temari';
import { I, Mono, V } from '../../lib/v3';
import { Bloc, compta, palDe } from './blocs';

export default function CulturaTema() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const i = CULTURA_AREAS.findIndex((a) => a.id === id);
  const area = i >= 0 ? CULTURA_AREAS[i] : null;
  const c = palDe(id ?? '');
  const fets = useMemo(() => (area ? compta(area) : 0), [area]);

  if (!area) {
    return (
      <div className="v3-page v3-anim">
        <p style={{ fontSize: 15, color: V.muted }}>Aquesta àrea no existeix.</p>
        <button
          type="button"
          onClick={() => nav('/cultura-general')}
          style={{
            marginTop: 14, cursor: 'pointer', border: 'none', borderRadius: 999,
            padding: '10px 18px', background: V.terra, color: '#fff', fontWeight: 700, fontSize: 13,
          }}>
          Veure les àrees
        </button>
      </div>
    );
  }

  const anterior = i > 0 ? CULTURA_AREAS[i - 1] : null;
  const seguent = i < CULTURA_AREAS.length - 1 ? CULTURA_AREAS[i + 1] : null;

  return (
    <div className="v3-page v3-anim">
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 8 }}>
        <span style={{
          width: 52, height: 52, flexShrink: 0, borderRadius: 18,
          background: c.soft, color: c.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: V.mono, fontSize: 16, fontWeight: 800,
        }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <div style={{ minWidth: 0 }}>
          <Mono size={10} color={c.solid} style={{ letterSpacing: 1.8 }}>
            CULTURA GENERAL · {i + 1} DE {CULTURA_AREAS.length}
          </Mono>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.12, margin: '5px 0 0' }}>
            {area.es}
          </h1>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: V.muted, margin: '0 0 6px', maxWidth: 620 }}>{area.blurb}</p>
      <Mono size={9.5} color={V.faint} style={{ letterSpacing: 1.3 }}>{fets} FETS CLAU</Mono>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '22px 0 26px' }}>
        {area.blocks.map((b, j) => <Bloc key={j} b={b} i={j} c={c} />)}
      </div>

      {/* Anterior i següent: recórrer el temari sense passar per l'índex. */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { a: anterior, dir: 'ANTERIOR', esq: true },
          { a: seguent, dir: 'SEGÜENT', esq: false },
        ].map(({ a, dir, esq }) => (
          <button
            key={dir}
            type="button"
            disabled={!a}
            onClick={() => a && nav(`/cultura-general/tema/${a.id}`)}
            style={{
              flex: '1 1 220px', textAlign: esq ? 'left' : 'right',
              cursor: a ? 'pointer' : 'default', opacity: a ? 1 : 0.4,
              border: `1px solid ${V.hair}`, borderRadius: 18, padding: 15,
              background: V.surface, color: V.ink,
              display: 'flex', alignItems: 'center', gap: 12,
              flexDirection: esq ? 'row' : 'row-reverse',
            }}>
            <I n={esq ? 'back' : 'arrow'} size={16} sw={2.2} color={V.muted} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <Mono size={9} color={V.faint} style={{ display: 'block', letterSpacing: 1.4 }}>{dir}</Mono>
              <span style={{
                display: 'block', fontSize: 14, fontWeight: 700, letterSpacing: -0.3, marginTop: 3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {a ? a.es : '—'}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
