// Croquis d'accident — editor 2D (Claude Design).
// Eina per recrear un accident: tria la via (recta, doble sentit, cruïlla,
// T, rotonda), arrossega vehicles, senyals, semàfors, passos de vianants,
// fletxes de trajectòria i text. Exporta a PNG per adjuntar a l'atestat.
// Tot al navegador (sense servidor): Konva per arrossegar/rotar/redimensionar.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stage, Layer, Rect, Group, Line, Circle, Text, RegularPolygon, Arrow, Star, Transformer,
} from 'react-konva';
import type Konva from 'konva';
import { A, Ic, Mono } from '../lib/design';

/* ── Model ── */
type Kind =
  | 'cotxe' | 'moto' | 'camio' | 'bus' | 'bici' | 'vianant'
  | 'stop' | 'cedeix' | 'prohibit' | 'noentrar' | 'velocitat' | 'sentit'
  | 'zebra' | 'semafor' | 'fletxa' | 'impacte' | 'text';
type El = {
  id: string; kind: Kind; x: number; y: number;
  rotation: number; scaleX: number; scaleY: number;
  color?: string; text?: string;
};
type Road = 'recta' | 'doble' | 'cruilla' | 'te' | 'rotonda' | 'cap';

const VEH_COLORS = ['#3B6BF5', '#E0455A', '#9AA0AA', '#15151C', '#FFFFFF', '#F0B400', '#1FB286'];

// Paleta lateral: què es pot afegir.
const PALETTE: { group: string; items: { kind: Kind; label: string; emoji: string }[] }[] = [
  { group: 'Vehicles', items: [
    { kind: 'cotxe', label: 'Cotxe', emoji: '🚗' },
    { kind: 'moto', label: 'Moto', emoji: '🏍️' },
    { kind: 'camio', label: 'Camió', emoji: '🚚' },
    { kind: 'bus', label: 'Autobús', emoji: '🚌' },
    { kind: 'bici', label: 'Bici', emoji: '🚲' },
    { kind: 'vianant', label: 'Vianant', emoji: '🚶' },
  ] },
  { group: 'Senyals', items: [
    { kind: 'stop', label: 'Stop', emoji: '🛑' },
    { kind: 'cedeix', label: 'Cediu el pas', emoji: '🔻' },
    { kind: 'prohibit', label: 'Prohibit', emoji: '⛔' },
    { kind: 'noentrar', label: 'Direcció prohibida', emoji: '🚫' },
    { kind: 'velocitat', label: 'Velocitat', emoji: '🔢' },
    { kind: 'sentit', label: 'Sentit obligatori', emoji: '➡️' },
  ] },
  { group: 'Via i marques', items: [
    { kind: 'zebra', label: 'Pas de vianants', emoji: '🦓' },
    { kind: 'semafor', label: 'Semàfor', emoji: '🚦' },
  ] },
  { group: 'Anotacions', items: [
    { kind: 'fletxa', label: 'Trajectòria', emoji: '↗️' },
    { kind: 'impacte', label: 'Punt d\'impacte', emoji: '💥' },
    { kind: 'text', label: 'Text / etiqueta', emoji: '🔤' },
  ] },
];
const ROADS: { id: Road; label: string }[] = [
  { id: 'recta', label: 'Recta' },
  { id: 'doble', label: 'Doble sentit' },
  { id: 'cruilla', label: 'Cruïlla (X)' },
  { id: 'te', label: 'Cruïlla en T' },
  { id: 'rotonda', label: 'Rotonda' },
  { id: 'cap', label: 'Sense via' },
];

let counter = 0;
const uid = () => `el-${++counter}`;
const DEFAULT_COLOR = (k: Kind) => (k === 'cotxe' ? '#3B6BF5' : k === 'camio' || k === 'bus' ? '#9AA0AA' : k === 'moto' ? '#15151C' : '#3B6BF5');

/* ── Fons de via (no seleccionable) ── */
const ASPHALT = '#D9DBE0';
const ASPHALT_DK = '#C7CAD2';
function RoadBg({ road, w, h }: { road: Road; w: number; h: number }) {
  const cx = w / 2, cy = h / 2;
  const lane = Math.min(180, w * 0.32, h * 0.32); // mitja amplada de calçada
  const dash = [22, 18];
  if (road === 'cap') return null;
  if (road === 'rotonda') {
    const R = Math.min(w, h) * 0.32;
    return (
      <Group listening={false}>
        {/* braços */}
        <Rect x={cx - lane} y={0} width={lane * 2} height={h} fill={ASPHALT} />
        <Rect x={0} y={cy - lane} width={w} height={lane * 2} fill={ASPHALT} />
        <Circle x={cx} y={cy} radius={R + lane} fill={ASPHALT} />
        <Circle x={cx} y={cy} radius={R} fill="#CDE8D6" stroke="#9CC8AC" strokeWidth={3} />
        <Circle x={cx} y={cy} radius={R + lane} stroke="#FFFFFF" strokeWidth={3} dash={dash} />
      </Group>
    );
  }
  const vert = (
    <>
      <Rect x={cx - lane} y={0} width={lane * 2} height={h} fill={ASPHALT} />
      <Line points={[cx - lane, 0, cx - lane, h]} stroke="#FFFFFF" strokeWidth={4} />
      <Line points={[cx + lane, 0, cx + lane, h]} stroke="#FFFFFF" strokeWidth={4} />
    </>
  );
  const horiz = (
    <>
      <Rect x={0} y={cy - lane} width={w} height={lane * 2} fill={ASPHALT} />
      <Line points={[0, cy - lane, w, cy - lane]} stroke="#FFFFFF" strokeWidth={4} />
      <Line points={[0, cy + lane, w, cy + lane]} stroke="#FFFFFF" strokeWidth={4} />
    </>
  );
  if (road === 'recta') {
    return <Group listening={false}>{vert}<Line points={[cx, 0, cx, h]} stroke="#FFFFFF" strokeWidth={4} dash={dash} /></Group>;
  }
  if (road === 'doble') {
    return <Group listening={false}>{vert}
      <Line points={[cx - 5, 0, cx - 5, h]} stroke="#F0B400" strokeWidth={3.5} />
      <Line points={[cx + 5, 0, cx + 5, h]} stroke="#F0B400" strokeWidth={3.5} />
    </Group>;
  }
  if (road === 'cruilla') {
    return <Group listening={false}>{vert}{horiz}
      <Rect x={cx - lane} y={cy - lane} width={lane * 2} height={lane * 2} fill={ASPHALT_DK} />
      <Line points={[cx, 0, cx, cy - lane]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
      <Line points={[cx, cy + lane, cx, h]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
      <Line points={[0, cy, cx - lane, cy]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
      <Line points={[cx + lane, cy, w, cy]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
    </Group>;
  }
  // T: vertical complet + braç horitzontal només a l'esquerra/dreta superior
  return <Group listening={false}>{vert}
    <Rect x={0} y={cy - lane} width={w} height={lane * 2} fill={ASPHALT} />
    <Line points={[0, cy - lane, cx - lane, cy - lane]} stroke="#FFFFFF" strokeWidth={4} />
    <Line points={[cx + lane, cy - lane, w, cy - lane]} stroke="#FFFFFF" strokeWidth={4} />
    <Rect x={cx - lane} y={cy - lane} width={lane * 2} height={lane * 2} fill={ASPHALT_DK} />
    <Line points={[cx, 0, cx, cy - lane]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
    <Line points={[0, cy, cx - lane, cy]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
    <Line points={[cx + lane, cy, w, cy]} stroke="#FFFFFF" strokeWidth={4} dash={dash} />
  </Group>;
}

/* ── Dibuix de cada element (vista cenital) ── */
function Shape({ kind, color }: { kind: Kind; color: string }) {
  const dark = '#0E0E12';
  switch (kind) {
    case 'cotxe':
      return (<>
        <Rect x={-22} y={-44} width={44} height={88} cornerRadius={13} fill={color} stroke={dark} strokeWidth={1.5} shadowColor="#0006" shadowBlur={6} shadowOffsetY={2} />
        <Rect x={-17} y={-30} width={34} height={20} cornerRadius={6} fill="#BFE0FF" opacity={0.95} />
        <Rect x={-17} y={12} width={34} height={16} cornerRadius={6} fill="#BFE0FF" opacity={0.95} />
        <Rect x={-15} y={-7} width={30} height={16} cornerRadius={4} fill="#FFFFFF" opacity={0.18} />
      </>);
    case 'moto':
      return (<>
        <Rect x={-7} y={-22} width={14} height={44} cornerRadius={7} fill={color} stroke={dark} strokeWidth={1.2} />
        <Rect x={-12} y={-12} width={24} height={5} cornerRadius={2} fill={dark} />
        <Circle x={0} y={6} radius={8} fill="#222" />
      </>);
    case 'camio':
      return (<>
        <Rect x={-26} y={-10} width={52} height={120} cornerRadius={6} fill="#E7E9EE" stroke={dark} strokeWidth={1.5} />
        <Rect x={-24} y={-58} width={48} height={50} cornerRadius={10} fill={color} stroke={dark} strokeWidth={1.5} />
        <Rect x={-19} y={-50} width={38} height={16} cornerRadius={5} fill="#BFE0FF" />
      </>);
    case 'bus':
      return (<>
        <Rect x={-23} y={-66} width={46} height={132} cornerRadius={14} fill={color} stroke={dark} strokeWidth={1.5} />
        <Rect x={-18} y={-54} width={36} height={16} cornerRadius={5} fill="#BFE0FF" />
        {[-28, -6, 16, 38].map((y) => <Rect key={y} x={-18} y={y} width={36} height={3} fill="#0003" />)}
      </>);
    case 'bici':
      return (<>
        <Circle x={0} y={-15} radius={9} fill="none" stroke={dark} strokeWidth={3} />
        <Circle x={0} y={15} radius={9} fill="none" stroke={dark} strokeWidth={3} />
        <Line points={[0, -15, 0, 15]} stroke={color} strokeWidth={4} />
        <Circle x={0} y={-2} radius={6} fill={color} />
      </>);
    case 'vianant':
      return (<>
        <Circle x={0} y={0} radius={13} fill="#F0B400" stroke={dark} strokeWidth={1.5} />
        <Circle x={0} y={0} radius={6} fill="#7A5A00" />
      </>);
    case 'stop':
      return (<>
        <RegularPolygon sides={8} radius={24} rotation={22.5} fill="#D32F2F" stroke="#fff" strokeWidth={2.5} />
        <Text text="STOP" fontSize={12} fontStyle="bold" fill="#fff" width={48} align="center" x={-24} y={-7} />
      </>);
    case 'cedeix':
      return <RegularPolygon sides={3} radius={26} rotation={180} fill="#fff" stroke="#D32F2F" strokeWidth={6} />;
    case 'prohibit':
      return <Circle radius={22} fill="#fff" stroke="#D32F2F" strokeWidth={6} />;
    case 'noentrar':
      return (<>
        <Circle radius={22} fill="#D32F2F" stroke="#fff" strokeWidth={2.5} />
        <Rect x={-13} y={-5} width={26} height={10} fill="#fff" />
      </>);
    case 'velocitat':
      return (<>
        <Circle radius={22} fill="#fff" stroke="#D32F2F" strokeWidth={6} />
        <Text text="50" fontSize={20} fontStyle="bold" fill="#15151C" width={44} align="center" x={-22} y={-11} />
      </>);
    case 'sentit':
      return (<>
        <Rect x={-22} y={-22} width={44} height={44} cornerRadius={6} fill="#1565C0" />
        <Arrow points={[0, 14, 0, -12]} pointerLength={10} pointerWidth={12} fill="#fff" stroke="#fff" strokeWidth={5} />
      </>);
    case 'semafor':
      return (<>
        <Rect x={-11} y={-30} width={22} height={60} cornerRadius={6} fill="#15151C" />
        <Circle x={0} y={-18} radius={7} fill="#E0455A" />
        <Circle x={0} y={0} radius={7} fill="#F0B400" />
        <Circle x={0} y={18} radius={7} fill="#1FB286" />
      </>);
    case 'zebra':
      return (<>
        <Rect x={-34} y={-26} width={68} height={52} fill={ASPHALT} />
        {[-28, -16, -4, 8, 20].map((x) => <Rect key={x} x={x} y={-24} width={8} height={48} fill="#fff" />)}
      </>);
    case 'impacte':
      return <Star numPoints={10} innerRadius={7} outerRadius={18} fill="#FF7A1A" stroke="#C2410C" strokeWidth={2} />;
    default:
      return null;
  }
}

/* ── Node editable (arrossegable + seleccionable) ── */
function Node({ el, selected, onSelect, onChange }: {
  el: El; selected: boolean; onSelect: () => void; onChange: (e: Partial<El>) => void;
}) {
  const ref = useRef<Konva.Group>(null);
  const common = {
    id: el.id, x: el.x, y: el.y, rotation: el.rotation, scaleX: el.scaleX, scaleY: el.scaleY,
    draggable: true,
    onClick: onSelect, onTap: onSelect,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => onChange({ x: e.target.x(), y: e.target.y() }),
    onTransformEnd: () => {
      const n = ref.current; if (!n) return;
      onChange({ x: n.x(), y: n.y(), rotation: n.rotation(), scaleX: n.scaleX(), scaleY: n.scaleY() });
    },
  };
  if (el.kind === 'fletxa') {
    return <Arrow ref={ref as never} {...common} points={[-55, 0, 55, 0]} pointerLength={16} pointerWidth={16}
      stroke={selected ? A.terracota : '#15151C'} fill={selected ? A.terracota : '#15151C'} strokeWidth={5} hitStrokeWidth={20} />;
  }
  if (el.kind === 'text') {
    return <Text ref={ref as never} {...common} text={el.text || 'Text'} fontSize={22} fontStyle="bold"
      fill="#15151C" stroke="#fff" strokeWidth={0.6} />;
  }
  return (
    <Group ref={ref} {...common}>
      <Shape kind={el.kind} color={el.color || DEFAULT_COLOR(el.kind)} />
    </Group>
  );
}

/* ════════════════════════════ EDITOR ════════════════════════════ */
export default function Croquis() {
  const nav = useNavigate();
  const [road, setRoad] = useState<Road>('cruilla');
  const [els, setEls] = useState<El[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 900, h: 600 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // Mida del llenç segons el contenidor.
  useEffect(() => {
    const measure = () => { const el = wrapRef.current; if (el) setSize({ w: el.clientWidth, h: el.clientHeight }); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Transformer sobre l'element seleccionat.
  useEffect(() => {
    const tr = trRef.current, stage = stageRef.current; if (!tr || !stage) return;
    if (!sel) { tr.nodes([]); tr.getLayer()?.batchDraw(); return; }
    const node = stage.findOne('#' + sel);
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [sel, els]);

  // Tecla Suprimir esborra el seleccionat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && sel && document.activeElement === document.body) {
        e.preventDefault(); remove();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const selEl = useMemo(() => els.find((e) => e.id === sel) || null, [els, sel]);

  function add(kind: Kind) {
    const id = uid();
    const e: El = {
      id, kind, x: size.w / 2 + (Math.random() * 60 - 30), y: size.h / 2 + (Math.random() * 60 - 30),
      rotation: 0, scaleX: 1, scaleY: 1, color: DEFAULT_COLOR(kind),
      ...(kind === 'text' ? { text: prompt('Text de l\'etiqueta:', 'A') || 'A' } : {}),
    };
    setEls((p) => [...p, e]); setSel(id);
  }
  function update(id: string, patch: Partial<El>) {
    setEls((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove() { if (!sel) return; setEls((p) => p.filter((e) => e.id !== sel)); setSel(null); }
  function duplicate() {
    if (!selEl) return; const id = uid();
    setEls((p) => [...p, { ...selEl, id, x: selEl.x + 30, y: selEl.y + 30 }]); setSel(id);
  }
  function rotate(d: number) { if (selEl) update(selEl.id, { rotation: (selEl.rotation + d) % 360 }); }
  function clearAll() { if (els.length && !confirm('Esborrar tot el croquis?')) return; setEls([]); setSel(null); }

  function exportPng() {
    const stage = stageRef.current; if (!stage) return;
    setSel(null);
    setTimeout(() => {
      const uri = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });
      const a = document.createElement('a');
      a.download = `croquis-accident.png`; a.href = uri; a.click();
    }, 60);
  }

  const btn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 11, padding: '9px 13px', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: A.bg, display: 'flex', flexDirection: 'column', fontFamily: A.sans }}>
      {/* Top bar */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '10px clamp(12px,2vw,20px)', borderBottom: `1px solid ${A.line}`, background: A.bgSoft, flexWrap: 'wrap' }}>
        <button onClick={() => nav('/')} style={{ ...btn, padding: 9 }} aria-label="Tornar a l'inici"><Ic name="arrowL" size={18} color={A.inkSoft} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 'auto' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="car" size={19} color="#fff" sw={2.2} /></span>
          <div><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.3 }}>Croquis d'accident</div><Mono size={9} color={A.inkMuted}>Editor · exporta PNG</Mono></div>
        </div>
        <label style={{ ...btn, gap: 8 }}>
          <Mono size={9} color={A.inkMuted}>Via</Mono>
          <select value={road} onChange={(e) => setRoad(e.target.value as Road)} style={{ border: 'none', background: 'transparent', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink, cursor: 'pointer', outline: 'none' }}>
            {ROADS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <button onClick={clearAll} style={btn}><Ic name="x" size={15} color={A.inkSoft} /> Esborrar tot</button>
        <button onClick={exportPng} style={{ ...btn, background: A.ink, color: '#fff', border: 'none' }}><Ic name="doc" size={16} color="#fff" /> Exportar PNG</button>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Paleta */}
        <aside className="cq-palette" style={{ width: 196, flexShrink: 0, overflowY: 'auto', borderRight: `1px solid ${A.line}`, background: A.bgSoft, padding: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PALETTE.map((g) => (
            <div key={g.group}>
              <Mono size={9} color={A.inkMuted} style={{ display: 'block', marginBottom: 8 }}>{g.group}</Mono>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {g.items.map((it) => (
                  <button key={it.kind} onClick={() => add(it.kind)} title={it.label}
                    style={{ border: `1px solid ${A.line}`, background: A.card, cursor: 'pointer', borderRadius: 12, padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: A.shadow }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{it.emoji}</span>
                    <span style={{ fontFamily: A.sans, fontWeight: 600, fontSize: 10.5, color: A.inkSoft, textAlign: 'center', lineHeight: 1.1 }}>{it.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Llenç */}
        <main ref={wrapRef} style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', background: '#EFEEE9' }}>
          <Stage ref={stageRef} width={size.w} height={size.h}
            onMouseDown={(e) => { if (e.target === e.target.getStage()) setSel(null); }}
            onTouchStart={(e) => { if (e.target === e.target.getStage()) setSel(null); }}>
            <Layer listening={false}><RoadBg road={road} w={size.w} h={size.h} /></Layer>
            <Layer>
              {els.map((el) => (
                <Node key={el.id} el={el} selected={sel === el.id}
                  onSelect={() => setSel(el.id)} onChange={(patch) => update(el.id, patch)} />
              ))}
              <Transformer ref={trRef} rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                anchorSize={10} borderStroke={A.terracota} anchorStroke={A.terracota} anchorCornerRadius={3}
                boundBoxFunc={(oldB, newB) => (newB.width < 18 || newB.height < 18 ? oldB : newB)} />
            </Layer>
          </Stage>

          {/* Mini-barra de l'element seleccionat */}
          {selEl && (
            <div style={{ position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 14, padding: '8px 12px', boxShadow: A.shadowLg, flexWrap: 'wrap', maxWidth: '92%' }}>
              {['cotxe', 'moto', 'camio', 'bus', 'bici'].includes(selEl.kind) && (
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingRight: 8, borderRight: `1px solid ${A.line}` }}>
                  {VEH_COLORS.map((c) => (
                    <button key={c} onClick={() => update(selEl.id, { color: c })} aria-label="color"
                      style={{ width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: selEl.color === c ? `2px solid ${A.ink}` : `1px solid ${A.line2}` }} />
                  ))}
                </div>
              )}
              <button onClick={() => rotate(-15)} style={btn} aria-label="Girar esquerra">⟲</button>
              <button onClick={() => rotate(15)} style={btn} aria-label="Girar dreta">⟳</button>
              <button onClick={duplicate} style={btn}>Duplicar</button>
              <button onClick={remove} style={{ ...btn, color: A.red, borderColor: A.redSoft }}><Ic name="x" size={14} color={A.red} /> Esborrar</button>
            </div>
          )}

          {/* Pista quan està buit */}
          {els.length === 0 && (
            <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.85)', border: `1px solid ${A.line2}`, borderRadius: 999, padding: '8px 16px', fontFamily: A.sans, fontWeight: 600, fontSize: 13, color: A.inkSoft, pointerEvents: 'none' }}>
              👈 Tria una via i arrossega elements des de l'esquerra
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
