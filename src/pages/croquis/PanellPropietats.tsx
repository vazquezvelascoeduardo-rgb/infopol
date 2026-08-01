// Panell de propietats del croquis — disseny "Croquis d'accident".
//
// Tot el que abans es feia amb una barreta flotant damunt del llenç (girar
// a copets de 15°, ampliar amb "+", duplicar…) viu aquí, amb controls que
// diuen el valor exacte: rotació, escala i opacitat amb número, i la
// llista de capes per triar un element sense haver-lo de caçar al dibuix.
import type { CSSProperties } from 'react';

import { A, Mono } from '../../lib/design';
import { VEHICLES, type El } from '../../lib/croquisPhysics';

export type AccionsPanell = {
  update: (id: string, patch: Partial<El>) => void;
  duplica: () => void;
  elimina: () => void;
  selecciona: (id: string) => void;
};

const VEH_COLORS = ['#C62828', '#1565C0', '#9E9E9E', '#2E7D32', '#8D6E63', '#212121'];

const seccio: CSSProperties = {
  padding: '16px 15px', borderBottom: `1px solid ${A.line}`,
};

/** Un control lliscant amb el seu valor a la dreta, com al disseny. */
function Control({
  etiqueta, valor, min, max, step = 1, onChange,
}: {
  etiqueta: string; valor: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontFamily: A.sans, fontSize: 12.5, fontWeight: 600, color: A.inkSoft }}>{etiqueta}</span>
        <Mono size={9.5} color={A.terraInk} style={{ background: A.terraSoft, borderRadius: 6, padding: '3px 7px' }}>
          {etiqueta === 'Escala' ? `${valor.toFixed(2)}×` : etiqueta === 'Rotació' ? `${Math.round(valor)}°` : `${Math.round(valor)}%`}
        </Mono>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={etiqueta}
        style={{ width: '100%', accentColor: A.terracota }}
      />
    </div>
  );
}

function BotoAccio({ simbol, children, onClick, perill }: {
  simbol: string; children: string; onClick: () => void; perill?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '13px 6px', cursor: 'pointer', borderRadius: 13,
        border: `1px solid ${perill ? A.redSoft : A.line2}`, background: A.card,
        color: perill ? A.red : A.inkSoft,
        fontFamily: A.sans, fontSize: 11.5, fontWeight: 700,
      }}>
      <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden>{simbol}</span>
      {children}
    </button>
  );
}

export default function PanellPropietats({
  el, els, etiqueta, accions,
}: {
  /** Element seleccionat, o null si no n'hi ha cap. */
  el: El | null;
  /** Tots els elements, per a la llista de capes. */
  els: El[];
  /** Com es diu cada element a la llista. */
  etiqueta: (e: El) => string;
  accions: AccionsPanell;
}) {
  const { update, duplica, elimina, selecciona } = accions;
  const capes = els.filter((e) => e.kind !== 'fons').slice().reverse();

  return (
    <aside
      className="cq-props"
      style={{
        width: 232, flexShrink: 0, borderLeft: `1px solid ${A.line}`,
        background: A.bgSoft, overflowY: 'auto',
      }}>
      {el ? (
        <>
          {/* Color: només per als elements que en tenen */}
          {(VEHICLES.includes(el.kind) || el.kind === 'via-lliure') && (
            <div style={seccio}>
              <Mono size={8.5} color={A.inkFaint} style={{ letterSpacing: 1.4, display: 'block', marginBottom: 11 }}>
                COLOR
              </Mono>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {VEH_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update(el.id, { color: c })}
                    aria-label={`Color ${c}`}
                    style={{
                      width: 27, height: 27, borderRadius: 9, background: c, cursor: 'pointer',
                      border: el.color === c ? `2.5px solid ${A.ink}` : `1px solid ${A.line2}`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={seccio}>
            <Control
              etiqueta="Rotació" valor={el.rotation} min={0} max={359}
              onChange={(v) => update(el.id, { rotation: v })}
            />
            <Control
              etiqueta="Escala" valor={Math.abs(el.scaleX)} min={0.25} max={4} step={0.05}
              onChange={(v) => update(el.id, { scaleX: v * Math.sign(el.scaleX || 1), scaleY: v })}
            />
            <Control
              etiqueta="Opacitat" valor={(el.opacity ?? 1) * 100} min={10} max={100}
              onChange={(v) => update(el.id, { opacity: v / 100 })}
            />
          </div>

          <div style={seccio}>
            <Mono size={8.5} color={A.inkFaint} style={{ letterSpacing: 1.4, display: 'block', marginBottom: 11 }}>
              ACCIONS
            </Mono>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <BotoAccio simbol="⧉" onClick={duplica}>Duplica</BotoAccio>
              <BotoAccio simbol="⟳" onClick={() => update(el.id, { rotation: Math.round((el.rotation + 90) % 360) })}>
                Gira 90°
              </BotoAccio>
              <BotoAccio simbol={el.locked ? '🔒' : '🔓'} onClick={() => update(el.id, { locked: !el.locked })}>
                {el.locked ? 'Desbloqueja' : 'Bloqueja'}
              </BotoAccio>
              <BotoAccio simbol="🗑" perill onClick={elimina}>Elimina</BotoAccio>
            </div>
          </div>
        </>
      ) : (
        <div style={{ ...seccio, color: A.inkMuted, fontFamily: A.sans, fontSize: 12.5, lineHeight: 1.5 }}>
          Tria un element del croquis per veure'n les propietats.
        </div>
      )}

      {/* Capes: la llista d'elements, del davant al darrere */}
      <div style={{ padding: '16px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <Mono size={8.5} color={A.inkFaint} style={{ letterSpacing: 1.4 }}>CAPES</Mono>
          <Mono size={9.5} color={A.inkMuted}>{capes.length}</Mono>
        </div>
        {capes.length === 0 && (
          <div style={{ fontFamily: A.sans, fontSize: 12, color: A.inkMuted }}>Encara no hi ha res al croquis.</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {capes.map((c) => {
            const on = el?.id === c.id;
            return (
              <div
                key={c.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, borderRadius: 10, padding: '8px 9px',
                  background: on ? A.terraSoft : 'transparent',
                }}>
                <button
                  type="button"
                  onClick={() => selecciona(c.id)}
                  style={{
                    flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 9,
                    border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, textAlign: 'left',
                  }}>
                  <span style={{
                    width: 10, height: 10, flexShrink: 0, borderRadius: '50%',
                    background: c.color || A.inkFaint,
                  }} />
                  <span style={{
                    flex: 1, minWidth: 0, fontFamily: A.sans, fontSize: 12.5,
                    fontWeight: on ? 700 : 600, color: on ? A.terraInk : A.inkSoft,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {etiqueta(c)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => update(c.id, { opacity: (c.opacity ?? 1) < 0.15 ? 1 : 0.1 })}
                  aria-label={(c.opacity ?? 1) < 0.15 ? 'Mostrar' : 'Amagar'}
                  title={(c.opacity ?? 1) < 0.15 ? 'Mostrar' : 'Amagar'}
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer', padding: 2,
                    opacity: (c.opacity ?? 1) < 0.15 ? 0.35 : 1, flexShrink: 0,
                  }}>
                  <span style={{ fontSize: 13, lineHeight: 1 }} aria-hidden>{(c.opacity ?? 1) < 0.15 ? '🚫' : '👁'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
