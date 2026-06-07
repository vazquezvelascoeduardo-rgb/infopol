// Croquis d'accident — editor 2D professional (Claude Design).
// Eina per recrear un accident de trànsit: tria/configura la via, arrossega
// vehicles, una llibreria àmplia de senyals verticals, marques vials pintades
// al terra, mobiliari urbà i anotacions. Zoom + paneo, capes, escalat, gir i
// volteig. Exporta a PNG en alta resolució per adjuntar a l'atestat.
// Tot al navegador (sense servidor): Konva per arrossegar/rotar/redimensionar.
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stage, Layer, Rect, Group, Line, Circle, Ellipse, Text, RegularPolygon, Arrow, Star, Transformer,
} from 'react-konva';
import type Konva from 'konva';
import { A, Ic, Mono } from '../lib/design';

/* ════════════════════════ Model ════════════════════════ */
type El = {
  id: string; kind: string; x: number; y: number;
  rotation: number; scaleX: number; scaleY: number;
  color?: string; text?: string;
};
type Road = 'recta' | 'doble' | 'autovia' | 'cruilla' | 'te' | 'rotonda' | 'corba' | 'cap';

const RED = '#D62B2B', BLUE = '#0B57A4', DARK = '#15151C', YEL = '#F2B600';
const PAINT = 'rgba(248,247,242,0.92)';            // pintura vial blanca
const VEH_COLORS = ['#3B6BF5', '#E0455A', '#9AA0AA', '#15151C', '#FFFFFF', '#F0B400', '#1FB286', '#FF7A1A'];
const COLORABLE = ['cotxe', 'furgo', 'camio', 'trailer', 'bus', 'moto', 'bici', 'patinet', 'tractor', 'etiqueta', 'text', 'fletxa'];

/* ── Llibreria d'elements (paleta) ── */
const PALETTE: { group: string; items: { kind: string; label: string; emoji: string }[] }[] = [
  { group: 'Vehicles', items: [
    { kind: 'cotxe', label: 'Turisme', emoji: '🚗' },
    { kind: 'furgo', label: 'Furgoneta', emoji: '🚐' },
    { kind: 'camio', label: 'Camió', emoji: '🚚' },
    { kind: 'trailer', label: 'Tràiler', emoji: '🚛' },
    { kind: 'bus', label: 'Autobús', emoji: '🚌' },
    { kind: 'moto', label: 'Moto', emoji: '🏍️' },
    { kind: 'bici', label: 'Bici', emoji: '🚲' },
    { kind: 'patinet', label: 'Patinet (VMP)', emoji: '🛴' },
    { kind: 'vianant', label: 'Vianant', emoji: '🚶' },
    { kind: 'tractor', label: 'Tractor', emoji: '🚜' },
    { kind: 'ambulancia', label: 'Ambulància', emoji: '🚑' },
    { kind: 'policia', label: 'Policia', emoji: '🚓' },
  ] },
  { group: 'Senyals · Perill', items: [
    { kind: 'perill', label: 'Perill', emoji: '⚠️' },
    { kind: 'corba-e', label: 'Corba esq.', emoji: '↰' },
    { kind: 'corba-d', label: 'Corba dre.', emoji: '↱' },
    { kind: 'nens', label: 'Nens', emoji: '🧒' },
    { kind: 'vianants-p', label: 'Vianants', emoji: '🚶' },
    { kind: 'ciclistes', label: 'Ciclistes', emoji: '🚲' },
    { kind: 'obres', label: 'Obres', emoji: '🚧' },
    { kind: 'semafor-p', label: 'Semàfor', emoji: '🚦' },
    { kind: 'rotonda-p', label: 'Rotonda', emoji: '🔄' },
    { kind: 'animals', label: 'Animals', emoji: '🦌' },
    { kind: 'estret', label: 'Estrenyiment', emoji: '🔺' },
    { kind: 'ressalt', label: 'Ressalt', emoji: '⛰️' },
  ] },
  { group: 'Senyals · Prohibició', items: [
    { kind: 'stop', label: 'Stop', emoji: '🛑' },
    { kind: 'cediu', label: 'Cediu el pas', emoji: '🔻' },
    { kind: 'noentrar', label: 'Direcció prohibida', emoji: '⛔' },
    { kind: 'prohibit', label: 'Prohibit (genèric)', emoji: '🚫' },
    { kind: 'velocitat', label: 'Velocitat', emoji: '🔢' },
    { kind: 'no-avancar', label: 'No avançar', emoji: '🚗' },
    { kind: 'no-gir-e', label: 'No girar esq.', emoji: '↰' },
    { kind: 'no-gir-d', label: 'No girar dre.', emoji: '↱' },
    { kind: 'no-estacionar', label: 'No estacionar', emoji: '🅿️' },
    { kind: 'no-parar', label: 'No parar', emoji: '✋' },
    { kind: 'pes-max', label: 'Pes màxim', emoji: '⚖️' },
    { kind: 'altura-max', label: 'Alçada màx.', emoji: '📏' },
  ] },
  { group: 'Senyals · Obligació i indicació', items: [
    { kind: 'sentit-o', label: 'Sentit obligatori', emoji: '⬆️' },
    { kind: 'oblig-d', label: 'Gir dret oblig.', emoji: '➡️' },
    { kind: 'oblig-e', label: 'Gir esq. oblig.', emoji: '⬅️' },
    { kind: 'carril-bici', label: 'Carril bici', emoji: '🚲' },
    { kind: 'vianants-o', label: 'Camí vianants', emoji: '🚶' },
    { kind: 'rotonda-o', label: 'Rotonda oblig.', emoji: '🔄' },
    { kind: 'aparcament', label: 'Aparcament', emoji: '🅿️' },
    { kind: 'hospital', label: 'Hospital', emoji: '🏥' },
    { kind: 'bus-parada', label: 'Parada bus', emoji: '🚌' },
    { kind: 'pas-senyal', label: 'Pas vianants', emoji: '🚸' },
  ] },
  { group: 'Marques al terra', items: [
    { kind: 'm-recta', label: 'Fletxa recta', emoji: '⬆️' },
    { kind: 'm-esq', label: 'Fletxa esq.', emoji: '↖️' },
    { kind: 'm-dre', label: 'Fletxa dreta', emoji: '↗️' },
    { kind: 'm-recta-esq', label: 'Recta + esq.', emoji: '⬆️' },
    { kind: 'm-recta-dre', label: 'Recta + dre.', emoji: '⬆️' },
    { kind: 'm-stop', label: 'Línia STOP', emoji: '🟥' },
    { kind: 'm-cediu', label: 'Línia cediu', emoji: '🔻' },
    { kind: 'zebra', label: 'Pas de vianants', emoji: '🦓' },
    { kind: 'm-pasbici', label: 'Pas de bici', emoji: '🚲' },
    { kind: 'm-cebrat', label: 'Zona zebrada', emoji: '🚧' },
    { kind: 'm-bici', label: 'Símbol bici', emoji: '🚲' },
    { kind: 'm-minusvalid', label: 'Reservat PMR', emoji: '♿' },
    { kind: 'm-linia', label: 'Línia pintada', emoji: '➖' },
  ] },
  { group: 'Entorn i mobiliari', items: [
    { kind: 'semafor', label: 'Semàfor', emoji: '🚦' },
    { kind: 'semafor-v', label: 'Semàfor vianants', emoji: '🚥' },
    { kind: 'fanal', label: 'Fanal', emoji: '💡' },
    { kind: 'arbre', label: 'Arbre', emoji: '🌳' },
    { kind: 'con', label: 'Con', emoji: '🚧' },
    { kind: 'tanca', label: 'Tanca / barrera', emoji: '🚧' },
    { kind: 'edifici', label: 'Edifici', emoji: '🏢' },
    { kind: 'illa', label: 'Illeta / mitjana', emoji: '🟩' },
  ] },
  { group: 'Anotacions', items: [
    { kind: 'fletxa', label: 'Trajectòria', emoji: '↗️' },
    { kind: 'derrapatge', label: 'Frenada', emoji: '〰️' },
    { kind: 'impacte', label: "Punt d'impacte", emoji: '💥' },
    { kind: 'taca', label: 'Vessament', emoji: '🛢️' },
    { kind: 'ferit', label: 'Ferit', emoji: '🩹' },
    { kind: 'mesura', label: 'Cota / mida', emoji: '📐' },
    { kind: 'etiqueta', label: 'Etiqueta A·B', emoji: '🅰️' },
    { kind: 'text', label: 'Text lliure', emoji: '🔤' },
  ] },
];

const ROADS: { id: Road; label: string }[] = [
  { id: 'recta', label: 'Recta (1+1)' },
  { id: 'doble', label: 'Doble línia contínua' },
  { id: 'autovia', label: 'Autovia (mitjana)' },
  { id: 'cruilla', label: 'Cruïlla (X)' },
  { id: 'te', label: 'Cruïlla en T' },
  { id: 'rotonda', label: 'Rotonda' },
  { id: 'corba', label: 'Corba' },
  { id: 'cap', label: 'Sense via' },
];

// Llenç fix (món): tot es dibuixa aquí i la vista fa zoom/paneo per sobre.
const BOARD = { w: 1680, h: 1120 };

let counter = 0;
const uid = () => `el-${++counter}`;
const DEFAULT_COLOR = (k: string) =>
  k === 'cotxe' ? '#3B6BF5'
  : k === 'camio' || k === 'trailer' || k === 'bus' || k === 'furgo' ? '#9AA0AA'
  : k === 'moto' || k === 'patinet' ? '#15151C'
  : k === 'tractor' ? '#1FB286'
  : '#15151C';
const NEEDS_PROMPT: Record<string, { msg: string; def: string }> = {
  velocitat: { msg: 'Velocitat (km/h):', def: '50' },
  text: { msg: "Text de l'etiqueta:", def: 'Vehicle A' },
  etiqueta: { msg: 'Lletra / número:', def: 'A' },
  mesura: { msg: 'Mida (p. ex. 4,5 m):', def: '0,0 m' },
  'pes-max': { msg: 'Pes màxim (t):', def: '5,5' },
  'altura-max': { msg: 'Alçada màx. (m):', def: '3,5' },
};

/* ════════════════════════ Fons de via ════════════════════════ */
const ASPHALT = '#D7DAE0', ASPHALT_DK = '#C6C9D1', TERRAIN = '#E8E4D8';
function RoadBg({ road }: { road: Road }) {
  const W = BOARD.w, H = BOARD.h, cx = W / 2, cy = H / 2, lane = 165;
  const dash = [26, 20];
  const board = (
    <>
      <Rect x={0} y={0} width={W} height={H} fill={TERRAIN} />
      <Rect x={0} y={0} width={W} height={H} stroke="#CFC9B8" strokeWidth={3} />
    </>
  );
  if (road === 'cap') return <Group listening={false}>{board}</Group>;

  const vert = (
    <>
      <Rect x={cx - lane} y={0} width={lane * 2} height={H} fill={ASPHALT} />
      <Line points={[cx - lane, 0, cx - lane, H]} stroke="#fff" strokeWidth={5} />
      <Line points={[cx + lane, 0, cx + lane, H]} stroke="#fff" strokeWidth={5} />
    </>
  );
  const horiz = (
    <>
      <Rect x={0} y={cy - lane} width={W} height={lane * 2} fill={ASPHALT} />
      <Line points={[0, cy - lane, W, cy - lane]} stroke="#fff" strokeWidth={5} />
      <Line points={[0, cy + lane, W, cy + lane]} stroke="#fff" strokeWidth={5} />
    </>
  );

  if (road === 'recta')
    return <Group listening={false}>{board}{vert}<Line points={[cx, 0, cx, H]} stroke="#fff" strokeWidth={5} dash={dash} /></Group>;

  if (road === 'doble')
    return <Group listening={false}>{board}{vert}
      <Line points={[cx - 6, 0, cx - 6, H]} stroke={YEL} strokeWidth={4} />
      <Line points={[cx + 6, 0, cx + 6, H]} stroke={YEL} strokeWidth={4} />
    </Group>;

  if (road === 'autovia') {
    const off = lane + 34;
    return <Group listening={false}>{board}
      <Rect x={cx - off - lane} y={0} width={lane * 2} height={H} fill={ASPHALT} />
      <Rect x={cx + off - lane} y={0} width={lane * 2} height={H} fill={ASPHALT} />
      {/* mitjana central */}
      <Rect x={cx - 30} y={0} width={60} height={H} fill="#CDE8D6" stroke="#9CC8AC" strokeWidth={3} />
      {/* carrils de cada calçada */}
      <Line points={[cx - off, 0, cx - off, H]} stroke="#fff" strokeWidth={4} dash={dash} />
      <Line points={[cx + off, 0, cx + off, H]} stroke="#fff" strokeWidth={4} dash={dash} />
    </Group>;
  }

  if (road === 'cruilla')
    return <Group listening={false}>{board}{vert}{horiz}
      <Rect x={cx - lane} y={cy - lane} width={lane * 2} height={lane * 2} fill={ASPHALT_DK} />
      <Line points={[cx, 0, cx, cy - lane]} stroke="#fff" strokeWidth={5} dash={dash} />
      <Line points={[cx, cy + lane, cx, H]} stroke="#fff" strokeWidth={5} dash={dash} />
      <Line points={[0, cy, cx - lane, cy]} stroke="#fff" strokeWidth={5} dash={dash} />
      <Line points={[cx + lane, cy, W, cy]} stroke="#fff" strokeWidth={5} dash={dash} />
    </Group>;

  if (road === 'te')
    return <Group listening={false}>{board}{vert}
      <Rect x={0} y={cy - lane} width={W} height={lane * 2} fill={ASPHALT} />
      <Line points={[0, cy - lane, cx - lane, cy - lane]} stroke="#fff" strokeWidth={5} />
      <Line points={[cx + lane, cy - lane, W, cy - lane]} stroke="#fff" strokeWidth={5} />
      <Rect x={cx - lane} y={cy - lane} width={lane * 2} height={lane * 2} fill={ASPHALT_DK} />
      <Line points={[cx, 0, cx, cy - lane]} stroke="#fff" strokeWidth={5} dash={dash} />
      <Line points={[0, cy, cx - lane, cy]} stroke="#fff" strokeWidth={5} dash={dash} />
      <Line points={[cx + lane, cy, W, cy]} stroke="#fff" strokeWidth={5} dash={dash} />
    </Group>;

  if (road === 'rotonda') {
    const Rr = 235;
    return <Group listening={false}>{board}
      <Rect x={cx - lane} y={0} width={lane * 2} height={H} fill={ASPHALT} />
      <Rect x={0} y={cy - lane} width={W} height={lane * 2} fill={ASPHALT} />
      <Circle x={cx} y={cy} radius={Rr + lane} fill={ASPHALT} />
      <Circle x={cx} y={cy} radius={Rr + lane} stroke="#fff" strokeWidth={5} />
      <Circle x={cx} y={cy} radius={Rr} fill={ASPHALT_DK} />
      <Circle x={cx} y={cy} radius={Rr} stroke="#fff" strokeWidth={5} dash={dash} />
      <Circle x={cx} y={cy} radius={Rr - lane * 0.7} fill="#CDE8D6" stroke="#9CC8AC" strokeWidth={3} />
    </Group>;
  }

  // corba en L (de baix → dreta)
  const pts = [cx, H, cx, cy + 40, cx + 60, cy - lane * 0.2, W, cy];
  return <Group listening={false}>{board}
    <Line points={pts} stroke={ASPHALT} strokeWidth={lane * 2} lineCap="round" lineJoin="round" tension={0.4} />
    <Line points={pts} stroke="#fff" strokeWidth={5} tension={0.4} dash={dash} />
  </Group>;
}

/* ════════════════════════ Helpers de dibuix ════════════════════════ */
function Em({ ch, s = 26, y = 0 }: { ch: string; s?: number; y?: number }) {
  return <Text text={ch} fontSize={s} width={s * 2} height={s * 2} align="center" verticalAlign="middle" x={-s} y={-s + y} listening={false} />;
}
const Tri = (g: ReactNode) => (<><RegularPolygon sides={3} radius={29} fill="#fff" stroke={RED} strokeWidth={5} /><Group y={5}>{g}</Group></>);
const Prohib = (g: ReactNode, ring = RED) => (<><Circle radius={22} fill="#fff" stroke={ring} strokeWidth={6} />{g}</>);
const Oblig = (g: ReactNode) => (<><Circle radius={22} fill={BLUE} />{g}</>);
const Info = (g: ReactNode) => (<><Rect x={-22} y={-22} width={44} height={44} cornerRadius={7} fill={BLUE} />{g}</>);
const wArrow = (rot = 0) => <Arrow points={[0, 13, 0, -13]} rotation={rot} pointerLength={11} pointerWidth={13} stroke="#fff" fill="#fff" strokeWidth={6} />;
const slash = <Line points={[-15, 15, 15, -15]} stroke={RED} strokeWidth={5} />;
const txt = (t: string, size: number, fill: string, w = 48) => <Text text={t} fontSize={size} fontStyle="bold" fill={fill} width={w} align="center" x={-w / 2} y={-size / 2} listening={false} />;

// fletxa pintada al terra (cap amunt) + braços opcionals
function GroundArrow({ left, right, straight = true }: { left?: boolean; right?: boolean; straight?: boolean }) {
  return (<>
    {straight && <><Rect x={-8} y={-20} width={16} height={56} fill={PAINT} /><Line closed points={[-20, -16, 0, -46, 20, -16]} fill={PAINT} /></>}
    {left && <><Rect x={-44} y={6} width={40} height={16} fill={PAINT} /><Line closed points={[-40, -6, -40, 34, -60, 14]} fill={PAINT} /></>}
    {right && <><Rect x={4} y={6} width={40} height={16} fill={PAINT} /><Line closed points={[40, -6, 40, 34, 60, 14]} fill={PAINT} /></>}
  </>);
}

/* ── Dibuix de cada element (vista cenital) ── */
function Shape({ kind, color, text }: { kind: string; color: string; text?: string }) {
  switch (kind) {
    /* Vehicles */
    case 'cotxe': return (<>
      <Rect x={-22} y={-44} width={44} height={88} cornerRadius={13} fill={color} stroke={DARK} strokeWidth={1.5} shadowColor="#0006" shadowBlur={6} shadowOffsetY={2} />
      <Rect x={-17} y={-30} width={34} height={20} cornerRadius={6} fill="#BFE0FF" opacity={0.95} />
      <Rect x={-17} y={12} width={34} height={16} cornerRadius={6} fill="#BFE0FF" opacity={0.95} />
    </>);
    case 'furgo': return (<>
      <Rect x={-23} y={-46} width={46} height={92} cornerRadius={9} fill={color} stroke={DARK} strokeWidth={1.5} shadowColor="#0006" shadowBlur={6} shadowOffsetY={2} />
      <Rect x={-18} y={-40} width={36} height={16} cornerRadius={5} fill="#BFE0FF" />
      <Line points={[-23, 6, 23, 6]} stroke="#0003" strokeWidth={2} />
    </>);
    case 'camio': return (<>
      <Rect x={-26} y={-12} width={52} height={120} cornerRadius={6} fill="#E7E9EE" stroke={DARK} strokeWidth={1.5} />
      <Rect x={-24} y={-60} width={48} height={50} cornerRadius={10} fill={color} stroke={DARK} strokeWidth={1.5} />
      <Rect x={-19} y={-52} width={38} height={16} cornerRadius={5} fill="#BFE0FF" />
    </>);
    case 'trailer': return (<>
      <Rect x={-27} y={-20} width={54} height={150} cornerRadius={6} fill="#E7E9EE" stroke={DARK} strokeWidth={1.5} />
      <Circle x={0} y={-26} radius={5} fill={DARK} />
      <Rect x={-25} y={-72} width={50} height={48} cornerRadius={10} fill={color} stroke={DARK} strokeWidth={1.5} />
      <Rect x={-20} y={-64} width={40} height={15} cornerRadius={5} fill="#BFE0FF" />
    </>);
    case 'bus': return (<>
      <Rect x={-23} y={-66} width={46} height={132} cornerRadius={14} fill={color} stroke={DARK} strokeWidth={1.5} />
      <Rect x={-18} y={-54} width={36} height={16} cornerRadius={5} fill="#BFE0FF" />
      {[-28, -6, 16, 38].map((y) => <Rect key={y} x={-18} y={y} width={36} height={3} fill="#0003" />)}
    </>);
    case 'moto': return (<>
      <Rect x={-7} y={-22} width={14} height={44} cornerRadius={7} fill={color} stroke={DARK} strokeWidth={1.2} />
      <Rect x={-12} y={-12} width={24} height={5} cornerRadius={2} fill={DARK} />
      <Circle x={0} y={6} radius={8} fill="#222" />
    </>);
    case 'patinet': return (<>
      <Rect x={-5} y={-20} width={10} height={40} cornerRadius={4} fill={color} stroke={DARK} strokeWidth={1.2} />
      <Rect x={-10} y={-20} width={20} height={5} cornerRadius={2} fill={DARK} />
      <Circle x={0} y={20} radius={4} fill="#222" /><Circle x={0} y={-20} radius={4} fill="#222" />
    </>);
    case 'bici': return (<>
      <Circle x={0} y={-15} radius={9} fill="none" stroke={DARK} strokeWidth={3} />
      <Circle x={0} y={15} radius={9} fill="none" stroke={DARK} strokeWidth={3} />
      <Line points={[0, -15, 0, 15]} stroke={color} strokeWidth={4} />
      <Circle x={0} y={-2} radius={6} fill={color} />
    </>);
    case 'vianant': return (<>
      <Circle x={0} y={0} radius={13} fill="#F0B400" stroke={DARK} strokeWidth={1.5} />
      <Circle x={0} y={0} radius={6} fill="#7A5A00" />
    </>);
    case 'tractor': return (<>
      <Rect x={-18} y={-30} width={36} height={70} cornerRadius={6} fill={color} stroke={DARK} strokeWidth={1.5} />
      <Circle x={-22} y={24} radius={14} fill="#222" /><Circle x={22} y={24} radius={14} fill="#222" />
      <Circle x={-18} y={-24} radius={8} fill="#222" /><Circle x={18} y={-24} radius={8} fill="#222" />
    </>);
    case 'ambulancia': return (<>
      <Rect x={-23} y={-48} width={46} height={96} cornerRadius={10} fill="#FFFFFF" stroke={DARK} strokeWidth={1.5} />
      <Rect x={-18} y={-42} width={36} height={15} cornerRadius={5} fill="#BFE0FF" />
      <Rect x={-5} y={-6} width={10} height={26} fill={RED} /><Rect x={-13} y={2} width={26} height={10} fill={RED} />
      <Rect x={-12} y={-50} width={24} height={6} cornerRadius={2} fill="#2E6BE6" />
    </>);
    case 'policia': return (<>
      <Rect x={-23} y={-46} width={46} height={92} cornerRadius={12} fill="#15151C" stroke={DARK} strokeWidth={1.5} />
      <Rect x={-18} y={-40} width={36} height={15} cornerRadius={5} fill="#BFE0FF" />
      <Rect x={-18} y={12} width={36} height={14} cornerRadius={5} fill="#fff" />
      <Rect x={-13} y={-52} width={11} height={6} cornerRadius={2} fill="#2E6BE6" /><Rect x={2} y={-52} width={11} height={6} cornerRadius={2} fill={RED} />
    </>);

    /* Senyals · Perill (triangle) */
    case 'perill': return Tri(txt('!', 26, RED, 20));
    case 'corba-e': return Tri(<Arrow points={[8, 10, 8, -2, -8, -10]} pointerLength={9} pointerWidth={9} stroke={DARK} fill={DARK} strokeWidth={5} tension={0.4} />);
    case 'corba-d': return Tri(<Arrow points={[-8, 10, -8, -2, 8, -10]} pointerLength={9} pointerWidth={9} stroke={DARK} fill={DARK} strokeWidth={5} tension={0.4} />);
    case 'nens': return Tri(<Em ch="🧒" s={20} />);
    case 'vianants-p': return Tri(<Em ch="🚶" s={20} />);
    case 'ciclistes': return Tri(<Em ch="🚲" s={20} />);
    case 'obres': return Tri(<Em ch="🚧" s={20} />);
    case 'semafor-p': return Tri(<><Circle x={0} y={-7} radius={3.4} fill={RED} /><Circle x={0} y={1} radius={3.4} fill={YEL} /><Circle x={0} y={9} radius={3.4} fill="#1FB286" /></>);
    case 'rotonda-p': return Tri(<Em ch="🔄" s={20} />);
    case 'animals': return Tri(<Em ch="🦌" s={20} />);
    case 'estret': return Tri(<><Line points={[-9, 13, -3, -11]} stroke={DARK} strokeWidth={4} /><Line points={[9, 13, 3, -11]} stroke={DARK} strokeWidth={4} /></>);
    case 'ressalt': return Tri(<><Line points={[-12, 8, -4, -4, 0, -6, 4, -4, 12, 8]} stroke={DARK} strokeWidth={4} tension={0.4} /></>);

    /* Senyals · Prohibició */
    case 'stop': return (<><RegularPolygon sides={8} radius={24} rotation={22.5} fill="#D32F2F" stroke="#fff" strokeWidth={2.5} />{txt('STOP', 12, '#fff')}</>);
    case 'cediu': return <RegularPolygon sides={3} radius={26} rotation={180} fill="#fff" stroke={RED} strokeWidth={6} />;
    case 'noentrar': return (<><Circle radius={22} fill="#D32F2F" stroke="#fff" strokeWidth={2.5} /><Rect x={-13} y={-5} width={26} height={10} fill="#fff" /></>);
    case 'prohibit': return Prohib(null);
    case 'velocitat': return Prohib(txt(text || '50', 19, DARK, 44));
    case 'no-avancar': return Prohib(<><Rect x={-12} y={-12} width={11} height={24} cornerRadius={3} fill={DARK} /><Rect x={1} y={-12} width={11} height={24} cornerRadius={3} fill={RED} /></>);
    case 'no-gir-e': return Prohib(<><Arrow points={[6, 12, 6, -2, -8, -2]} pointerLength={7} pointerWidth={8} stroke={DARK} fill={DARK} strokeWidth={4} />{slash}</>);
    case 'no-gir-d': return Prohib(<><Arrow points={[-6, 12, -6, -2, 8, -2]} pointerLength={7} pointerWidth={8} stroke={DARK} fill={DARK} strokeWidth={4} />{slash}</>);
    case 'no-estacionar': return (<><Circle radius={22} fill={BLUE} stroke={RED} strokeWidth={6} />{txt('P', 18, '#fff', 30)}<Line points={[-15, 15, 15, -15]} stroke={RED} strokeWidth={5} /></>);
    case 'no-parar': return (<><Circle radius={22} fill={BLUE} stroke={RED} strokeWidth={6} /><Line points={[-13, 13, 13, -13]} stroke={RED} strokeWidth={5} /><Line points={[13, 13, -13, -13]} stroke={RED} strokeWidth={5} /></>);
    case 'pes-max': return Prohib(txt((text || '5,5') + ' t', 12, DARK, 40));
    case 'altura-max': return Prohib(txt((text || '3,5') + ' m', 12, DARK, 40));

    /* Senyals · Obligació / indicació */
    case 'sentit-o': return Oblig(wArrow(0));
    case 'oblig-d': return Oblig(wArrow(90));
    case 'oblig-e': return Oblig(wArrow(-90));
    case 'carril-bici': return Oblig(<Em ch="🚲" s={18} />);
    case 'vianants-o': return Oblig(<Em ch="🚶" s={18} />);
    case 'rotonda-o': return Oblig(<Em ch="🔄" s={18} />);
    case 'aparcament': return Info(txt('P', 26, '#fff', 36));
    case 'hospital': return (<><Rect x={-22} y={-22} width={44} height={44} cornerRadius={7} fill="#fff" stroke={BLUE} strokeWidth={3} /><Rect x={-4} y={-13} width={8} height={26} fill={RED} /><Rect x={-13} y={-4} width={26} height={8} fill={RED} /></>);
    case 'bus-parada': return Info(<Em ch="🚌" s={20} />);
    case 'pas-senyal': return Info(<Em ch="🚸" s={20} />);

    /* Marques al terra (pintura blanca) */
    case 'm-recta': return <GroundArrow straight />;
    case 'm-esq': return <GroundArrow straight={false} left />;
    case 'm-dre': return <GroundArrow straight={false} right />;
    case 'm-recta-esq': return <GroundArrow straight left />;
    case 'm-recta-dre': return <GroundArrow straight right />;
    case 'm-stop': return (<><Rect x={-46} y={-6} width={92} height={14} fill={PAINT} />{txt('STOP', 26, PAINT, 92)}</>);
    case 'm-cediu': return (<>{[-36, -12, 12].map((x) => <Line key={x} closed points={[x, -10, x + 20, -10, x + 10, 14]} fill={PAINT} />)}</>);
    case 'zebra': return (<>{[-34, -22, -10, 2, 14, 26].map((x) => <Rect key={x} x={x} y={-30} width={8} height={60} fill={PAINT} />)}</>);
    case 'm-pasbici': return (<>{[-30, -10, 10].map((x) => [-26, 6].map((y) => <Rect key={`${x}-${y}`} x={x} y={y} width={14} height={14} fill={PAINT} />))}</>);
    case 'm-cebrat': return (<>{[-40, -24, -8, 8, 24].map((x) => <Line key={x} points={[x, 26, x + 26, -26]} stroke={PAINT} strokeWidth={7} />)}</>);
    case 'm-bici': return <Em ch="🚲" s={34} />;
    case 'm-minusvalid': return (<><Rect x={-26} y={-26} width={52} height={52} cornerRadius={6} fill="#1A65C0" /><Em ch="♿" s={30} /></>);
    case 'm-linia': return <Rect x={-60} y={-5} width={120} height={10} fill={PAINT} />;

    /* Entorn / mobiliari */
    case 'semafor': return (<>
      <Rect x={-11} y={-30} width={22} height={60} cornerRadius={6} fill="#15151C" />
      <Circle x={0} y={-18} radius={7} fill="#E0455A" /><Circle x={0} y={0} radius={7} fill="#F0B400" /><Circle x={0} y={18} radius={7} fill="#1FB286" />
    </>);
    case 'semafor-v': return (<>
      <Rect x={-9} y={-22} width={18} height={44} cornerRadius={5} fill="#15151C" />
      <Circle x={0} y={-10} radius={6} fill="#E0455A" /><Circle x={0} y={10} radius={6} fill="#1FB286" />
    </>);
    case 'fanal': return (<><Line points={[0, 30, 0, -20]} stroke="#6B6B72" strokeWidth={5} /><Line points={[0, -20, 16, -24]} stroke="#6B6B72" strokeWidth={4} /><Ellipse x={20} y={-22} radiusX={9} radiusY={5} fill="#FFE08A" stroke="#C9A23A" strokeWidth={1.5} /></>);
    case 'arbre': return (<><Circle radius={22} fill="#3FA66B" stroke="#2E7D50" strokeWidth={2.5} /><Circle radius={9} fill="#2E7D50" opacity={0.5} /></>);
    case 'con': return (<><Line closed points={[-13, 20, 0, -22, 13, 20]} fill="#FF7A1A" stroke="#C2410C" strokeWidth={1.5} /><Rect x={-8} y={0} width={16} height={6} fill="#fff" /><Rect x={-17} y={18} width={34} height={6} cornerRadius={2} fill="#FF7A1A" stroke="#C2410C" strokeWidth={1} /></>);
    case 'tanca': return (<><Rect x={-44} y={-8} width={88} height={16} cornerRadius={3} fill="#fff" stroke={DARK} strokeWidth={1.2} />{[-40, -20, 0, 20].map((x) => <Rect key={x} x={x} y={-8} width={10} height={16} fill={RED} />)}</>);
    case 'edifici': return (<><Rect x={-44} y={-32} width={88} height={64} cornerRadius={5} fill="#CBCED6" stroke="#9AA0AA" strokeWidth={2} />{[-22, 0, 22].map((x) => <Rect key={x} x={x - 7} y={-18} width={14} height={14} fill="#A9AEB8" />)}</>);
    case 'illa': return <Rect x={-16} y={-62} width={32} height={124} cornerRadius={16} fill="#CDE8D6" stroke="#9CC8AC" strokeWidth={3} />;

    /* Anotacions */
    case 'impacte': return <Star numPoints={10} innerRadius={7} outerRadius={18} fill="#FF7A1A" stroke="#C2410C" strokeWidth={2} />;
    case 'taca': return (<><Ellipse radiusX={34} radiusY={22} fill="rgba(30,30,36,0.5)" /><Ellipse x={16} y={10} radiusX={12} radiusY={8} fill="rgba(30,30,36,0.5)" /></>);
    case 'ferit': return (<><Ellipse radiusX={24} radiusY={9} fill={color} stroke={DARK} strokeWidth={1.2} /><Circle x={-20} y={0} radius={8} fill={color} stroke={DARK} strokeWidth={1.2} /></>);
    case 'derrapatge': return (<><Line points={[-55, -7, 55, -7]} stroke="#2A2A2E" strokeWidth={6} dash={[16, 10]} lineCap="round" /><Line points={[-55, 7, 55, 7]} stroke="#2A2A2E" strokeWidth={6} dash={[16, 10]} lineCap="round" /></>);
    case 'etiqueta': return (<><Circle radius={17} fill={color} stroke="#fff" strokeWidth={2.5} shadowColor="#0007" shadowBlur={5} />{txt(text || 'A', 18, '#fff', 34)}</>);
    default: return null;
  }
}

/* ════════════════════════ Node editable ════════════════════════ */
function Node({ el, onSelect, onChange }: { el: El; onSelect: () => void; onChange: (e: Partial<El>) => void }) {
  const ref = useRef<Konva.Group>(null);
  const common = {
    id: el.id, x: el.x, y: el.y, rotation: el.rotation, scaleX: el.scaleX, scaleY: el.scaleY,
    draggable: true, onClick: onSelect, onTap: onSelect,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => onChange({ x: e.target.x(), y: e.target.y() }),
    onTransformEnd: () => {
      const n = ref.current; if (!n) return;
      onChange({ x: n.x(), y: n.y(), rotation: n.rotation(), scaleX: n.scaleX(), scaleY: n.scaleY() });
    },
  };
  if (el.kind === 'fletxa')
    return <Arrow ref={ref as never} {...common} points={[-60, 0, 60, 0]} pointerLength={17} pointerWidth={17}
      stroke={el.color || '#15151C'} fill={el.color || '#15151C'} strokeWidth={6} hitStrokeWidth={22} />;
  if (el.kind === 'text')
    return <Text ref={ref as never} {...common} text={el.text || 'Text'} fontSize={22} fontStyle="bold"
      fontFamily="Manrope, sans-serif" fill={el.color || '#15151C'} stroke="#fff" strokeWidth={0.7} />;
  if (el.kind === 'mesura')
    return (
      <Group ref={ref} {...common}>
        <Line points={[-60, 0, 60, 0]} stroke={A.terracota} strokeWidth={2.5} hitStrokeWidth={20} />
        <Line points={[-60, -7, -60, 7]} stroke={A.terracota} strokeWidth={2.5} />
        <Line points={[60, -7, 60, 7]} stroke={A.terracota} strokeWidth={2.5} />
        <Text text={el.text || '0,0 m'} fontSize={14} fontStyle="bold" fill={A.terraInk} width={120} align="center" x={-60} y={-22} />
      </Group>
    );
  return (
    <Group ref={ref} {...common}>
      <Shape kind={el.kind} color={el.color || DEFAULT_COLOR(el.kind)} text={el.text} />
    </Group>
  );
}

/* ════════════════════════════ EDITOR ════════════════════════════ */
export default function Croquis() {
  const nav = useNavigate();
  const [road, setRoad] = useState<Road>('cruilla');
  const [els, setEls] = useState<El[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 700 });
  const [view, setView] = useState({ scale: 0, x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const fitView = useCallback((w = size.w, h = size.h, pad = 36) => {
    const s = Math.min((w - pad * 2) / BOARD.w, (h - pad * 2) / BOARD.h);
    return { scale: s, x: (w - BOARD.w * s) / 2, y: (h - BOARD.h * s) / 2 };
  }, [size.w, size.h]);

  // Mida del contenidor + enquadrament inicial.
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current; if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      setSize({ w, h });
      setView((v) => (v.scale === 0 ? fitView(w, h) : v));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transformer sobre el seleccionat.
  useEffect(() => {
    const tr = trRef.current, stage = stageRef.current; if (!tr || !stage) return;
    const node = sel ? stage.findOne('#' + sel) : null;
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [sel, els]);

  // Tecles: Supr esborra, fletxes mouen, Ctrl+D duplica.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement && document.activeElement !== document.body) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { e.preventDefault(); remove(); }
      else if (e.key === 'd' && (e.ctrlKey || e.metaKey) && sel) { e.preventDefault(); duplicate(); }
      else if (sel && e.key.startsWith('Arrow')) {
        e.preventDefault(); const d = e.shiftKey ? 20 : 4;
        const dx = e.key === 'ArrowLeft' ? -d : e.key === 'ArrowRight' ? d : 0;
        const dy = e.key === 'ArrowUp' ? -d : e.key === 'ArrowDown' ? d : 0;
        setEls((p) => p.map((el) => (el.id === sel ? { ...el, x: el.x + dx, y: el.y + dy } : el)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, els]);

  const selEl = useMemo(() => els.find((e) => e.id === sel) || null, [els, sel]);

  function add(kind: string) {
    const id = uid();
    const p = NEEDS_PROMPT[kind];
    const cx = (size.w / 2 - view.x) / (view.scale || 1);
    const cy = (size.h / 2 - view.y) / (view.scale || 1);
    const e: El = {
      id, kind, x: cx + (Math.random() * 50 - 25), y: cy + (Math.random() * 50 - 25),
      rotation: 0, scaleX: 1, scaleY: 1, color: DEFAULT_COLOR(kind),
      ...(p ? { text: (typeof window !== 'undefined' ? window.prompt(p.msg, p.def) : p.def) || p.def } : {}),
    };
    setEls((prev) => [...prev, e]); setSel(id);
  }
  function update(id: string, patch: Partial<El>) { setEls((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e))); }
  function remove() { if (!sel) return; setEls((p) => p.filter((e) => e.id !== sel)); setSel(null); }
  function duplicate() { if (!selEl) return; const id = uid(); setEls((p) => [...p, { ...selEl, id, x: selEl.x + 28, y: selEl.y + 28 }]); setSel(id); }
  function rotate(d: number) { if (selEl) update(selEl.id, { rotation: Math.round((selEl.rotation + d) % 360) }); }
  function scaleBy(f: number) { if (selEl) update(selEl.id, { scaleX: Math.max(0.25, Math.min(6, Math.abs(selEl.scaleX) * f)) * Math.sign(selEl.scaleX || 1), scaleY: Math.max(0.25, Math.min(6, selEl.scaleY * f)) }); }
  function flipH() { if (selEl) update(selEl.id, { scaleX: -selEl.scaleX }); }
  function toFront() { if (!selEl) return; setEls((p) => [...p.filter((e) => e.id !== selEl.id), selEl]); }
  function toBack() { if (!selEl) return; setEls((p) => [selEl, ...p.filter((e) => e.id !== selEl.id)]); }
  function clearAll() { if (els.length && !confirm('Esborrar tot el croquis?')) return; setEls([]); setSel(null); }

  // Zoom amb la roda (centrat al cursor).
  function onWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    const stage = stageRef.current; if (!stage) return;
    const old = view.scale || 1;
    const ptr = stage.getPointerPosition(); if (!ptr) return;
    const m = { x: (ptr.x - view.x) / old, y: (ptr.y - view.y) / old };
    let ns = e.evt.deltaY > 0 ? old * 0.9 : old * 1.111;
    ns = Math.max(0.12, Math.min(4.5, ns));
    setView({ scale: ns, x: ptr.x - m.x * ns, y: ptr.y - m.y * ns });
  }
  function zoom(f: number) {
    const old = view.scale || 1; let ns = Math.max(0.12, Math.min(4.5, old * f));
    const cx = size.w / 2, cy = size.h / 2;
    const m = { x: (cx - view.x) / old, y: (cy - view.y) / old };
    setView({ scale: ns, x: cx - m.x * ns, y: cy - m.y * ns });
  }

  function exportPng() {
    const stage = stageRef.current; if (!stage) return;
    setSel(null);
    const prev = { ...view };
    const f = fitView(size.w, size.h, 8);
    setView(f);
    setTimeout(() => {
      const uri = stage.toDataURL({
        x: f.x, y: f.y, width: BOARD.w * f.scale, height: BOARD.h * f.scale,
        pixelRatio: 2 / f.scale, mimeType: 'image/png',
      });
      const a = document.createElement('a');
      a.download = 'croquis-accident.png'; a.href = uri; a.click();
      setView(prev);
    }, 80);
  }

  const btn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 11, padding: '9px 13px', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink };
  const pct = Math.round((view.scale || 1) * 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: A.bg, display: 'flex', flexDirection: 'column', fontFamily: A.sans }}>
      {/* Top bar */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '10px clamp(12px,2vw,20px)', borderBottom: `1px solid ${A.line}`, background: A.bgSoft, flexWrap: 'wrap' }}>
        <button onClick={() => nav('/')} style={{ ...btn, padding: 9 }} aria-label="Tornar a l'inici"><Ic name="arrowL" size={18} color={A.inkSoft} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 'auto' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="car" size={19} color="#fff" sw={2.2} /></span>
          <div><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.3 }}>Croquis d'accident</div><Mono size={9} color={A.inkMuted}>Editor professional · exporta PNG</Mono></div>
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
        <aside className="cq-palette" style={{ width: 210, flexShrink: 0, overflowY: 'auto', borderRight: `1px solid ${A.line}`, background: A.bgSoft, padding: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PALETTE.map((g) => (
            <div key={g.group}>
              <Mono size={9} color={A.inkMuted} style={{ display: 'block', marginBottom: 8 }}>{g.group}</Mono>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {g.items.map((it) => (
                  <button key={it.kind} onClick={() => add(it.kind)} title={it.label}
                    style={{ border: `1px solid ${A.line}`, background: A.card, cursor: 'pointer', borderRadius: 12, padding: '9px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: A.shadow }}>
                    <span style={{ fontSize: 21, lineHeight: 1 }}>{it.emoji}</span>
                    <span style={{ fontFamily: A.sans, fontWeight: 600, fontSize: 10, color: A.inkSoft, textAlign: 'center', lineHeight: 1.1 }}>{it.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Llenç */}
        <main ref={wrapRef} style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', background: '#EDEBE5' }}>
          <Stage ref={stageRef} width={size.w} height={size.h}
            scaleX={view.scale || 1} scaleY={view.scale || 1} x={view.x} y={view.y}
            draggable
            onWheel={onWheel}
            onDragEnd={(e) => { if (e.target === e.target.getStage()) setView((v) => ({ ...v, x: e.target.x(), y: e.target.y() })); }}
            onMouseDown={(e) => { if (e.target === e.target.getStage()) setSel(null); }}
            onTouchStart={(e) => { if (e.target === e.target.getStage()) setSel(null); }}>
            <Layer listening={false}><RoadBg road={road} /></Layer>
            <Layer>
              {els.map((el) => (
                <Node key={el.id} el={el} onSelect={() => setSel(el.id)} onChange={(patch) => update(el.id, patch)} />
              ))}
              <Transformer ref={trRef} rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                anchorSize={11} borderStroke={A.terracota} anchorStroke={A.terracota} anchorCornerRadius={3}
                boundBoxFunc={(oldB, newB) => (newB.width < 14 || newB.height < 14 ? oldB : newB)} />
            </Layer>
          </Stage>

          {/* Controls de zoom */}
          <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 6, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 13, padding: 5, boxShadow: A.shadowLg }}>
            <button onClick={() => zoom(0.83)} style={{ ...btn, padding: '7px 12px', fontSize: 18, border: 'none' }} aria-label="Allunyar">−</button>
            <button onClick={() => setView(fitView())} style={{ ...btn, padding: '7px 10px', border: 'none', fontSize: 12 }}>{pct}%</button>
            <button onClick={() => zoom(1.2)} style={{ ...btn, padding: '7px 12px', fontSize: 18, border: 'none' }} aria-label="Apropar">+</button>
          </div>

          {/* Mini-barra de l'element seleccionat */}
          {selEl && (
            <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 7, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 14, padding: '8px 11px', boxShadow: A.shadowLg, flexWrap: 'wrap', maxWidth: '94%' }}>
              {COLORABLE.includes(selEl.kind) && (
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingRight: 7, borderRight: `1px solid ${A.line}` }}>
                  {VEH_COLORS.map((c) => (
                    <button key={c} onClick={() => update(selEl.id, { color: c })} aria-label="color"
                      style={{ width: 19, height: 19, borderRadius: '50%', background: c, cursor: 'pointer', border: selEl.color === c ? `2px solid ${A.ink}` : `1px solid ${A.line2}` }} />
                  ))}
                </div>
              )}
              <button onClick={() => rotate(-15)} style={btn} aria-label="Girar esquerra">⟲</button>
              <button onClick={() => rotate(15)} style={btn} aria-label="Girar dreta">⟳</button>
              <button onClick={() => scaleBy(0.85)} style={btn} aria-label="Reduir">−</button>
              <button onClick={() => scaleBy(1.18)} style={btn} aria-label="Ampliar">+</button>
              <button onClick={flipH} style={btn} aria-label="Voltejar">⇋</button>
              <button onClick={toBack} style={btn} title="Enviar al darrere">▽</button>
              <button onClick={toFront} style={btn} title="Portar al davant">△</button>
              <button onClick={duplicate} style={btn}>Duplicar</button>
              <button onClick={remove} style={{ ...btn, color: A.red, borderColor: A.redSoft }}><Ic name="x" size={14} color={A.red} /></button>
            </div>
          )}

          {/* Pista quan està buit */}
          {els.length === 0 && (
            <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', border: `1px solid ${A.line2}`, borderRadius: 999, padding: '8px 16px', fontFamily: A.sans, fontWeight: 600, fontSize: 13, color: A.inkSoft, pointerEvents: 'none', textAlign: 'center' }}>
              👈 Tria la via i arrossega elements · roda del ratolí per fer zoom · arrossega el fons per moure't
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
