// Resums i esquemes — el temari condensat.
//
// La mateixa pantalla que a l'app: dues coses diferents que abans
// vivien amagades dins de Policia Local i Mossos.
//   · Resum   → el temari desenvolupat, per llegir.
//   · Esquema → la mateixa matèria en quadres, per repassar de pressa.
//
// El commutador de dalt tria el cos i les dues targetes no canvien de
// lloc: així no cal recordar per on s'hi anava a cada itinerari.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CardV, I, RV, TitolV, V, type NomIc } from '../lib/v3';

type Cos = 'pl' | 'mossos';

export default function Resums() {
  const nav = useNavigate();
  const [cos, setCos] = useState<Cos>('pl');

  const opcions: { icona: NomIc; titol: string; sub: string; ruta: string; color: string; tint: string }[] = [
    {
      icona: 'doc', titol: 'Resums', color: V.terraInk, tint: V.terraSoft,
      sub: 'El temari desenvolupat, tema per tema',
      ruta: cos === 'pl' ? '/estudi' : '/mossos/temari',
    },
    {
      icona: 'layers', titol: 'Esquemes', color: V.blue, tint: V.blueSoft,
      sub: 'La mateixa matèria en quadres, per repassar de pressa',
      ruta: cos === 'pl' ? '/policia-local/esquemes' : '/mossos/esquemes',
    },
  ];

  return (
    <div className="v3-page v3-anim">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap', marginBottom: 20,
      }}>
        <TitolV fort="Resums" post="i esquemes" />
        <div style={{ display: 'inline-flex', background: V.surface2, borderRadius: RV.pill, padding: 4, gap: 4 }}>
          {([{ id: 'pl', label: 'Policia Local' }, { id: 'mossos', label: 'Mossos' }] as { id: Cos; label: string }[]).map((c) => {
            const on = c.id === cos;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCos(c.id)}
                aria-pressed={on}
                style={{
                  border: 'none', cursor: 'pointer', borderRadius: RV.pill, padding: '9px 18px',
                  fontSize: 13, fontWeight: on ? 800 : 600,
                  background: on ? V.surface : 'transparent', color: on ? V.ink : V.muted,
                  boxShadow: on ? V.shadow : 'none',
                }}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, maxWidth: 900 }}>
        {opcions.map((o) => (
          <CardV key={o.titol} pad={24} onClick={() => nav(o.ruta)}>
            <span style={{
              width: 50, height: 50, borderRadius: RV.md, background: o.tint, color: o.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <I n={o.icona} size={23} sw={1.9} />
            </span>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.65, marginTop: 16 }}>{o.titol}</div>
            <div style={{ fontSize: 13, color: V.muted, marginTop: 6, lineHeight: 1.45 }}>{o.sub}</div>
          </CardV>
        ))}
      </div>
    </div>
  );
}
