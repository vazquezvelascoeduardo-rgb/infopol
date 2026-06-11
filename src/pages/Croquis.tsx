// Croquis d'accident — editor 2D professional (Claude Design).
// Eina per recrear un accident de trànsit: tria/configura la via, arrossega
// vehicles, una llibreria àmplia de senyals verticals, marques vials pintades
// al terra, mobiliari urbà i anotacions. Zoom + paneo, capes, escalat, gir i
// volteig. Exporta a PNG en alta resolució per adjuntar a l'atestat.
// La recreació (reproducció + vídeo + 3D) fa servir el motor físic compartit
// de lib/croquisPhysics: velocitats reals, frenades i càmera cinematogràfica.
// Tot al navegador (sense servidor): Konva per arrossegar/rotar/redimensionar.
import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stage, Layer, Rect, Group, Line, Circle, Ellipse, Text, RegularPolygon, Arrow, Star, Transformer, Image as KImage, Arc,
} from 'react-konva';
import type Konva from 'konva';
import { A, Ic, Mono } from '../lib/design';
import {
  BOARD, PX_PER_M, VEHICLES, buildTimeline, stateAt, simRateAt, cineViewAt, fmtRel,
  type El, type Estat, type Road, type VehData, type Timeline,
} from '../lib/croquisPhysics';

const Croquis3D = lazy(() => import('./Croquis3D'));

/* ════════════════════════ Model ════════════════════════ */
// Capçalera de l'atestat (s'imprimeix al croquis exportat).
type Header = {
  num?: string; data?: string; hora?: string; municipi?: string; lloc?: string;
  meteo?: string; llum?: string; calcada?: string; visibilitat?: string; instructor?: string;
};
type Scene = { road: Road; els: El[]; header: Header; legend: boolean };
const STORE_KEY = 'infopol:croquis:v1';

const RED = '#D62B2B', BLUE = '#0B57A4', DARK = '#15151C', YEL = '#F2B600';
const PAINT = 'rgba(248,247,242,0.92)';            // pintura vial blanca
const VEH_COLORS = ['#3B6BF5', '#E0455A', '#9AA0AA', '#15151C', '#FFFFFF', '#F0B400', '#1FB286', '#FF7A1A'];
const COLORABLE = ['cotxe', 'furgo', 'camio', 'trailer', 'bus', 'moto', 'bici', 'patinet', 'tractor', 'etiqueta', 'text', 'fletxa', 'carrer'];
const ESTATS: Record<Estat, { label: string; color: string }> = {
  mov: { label: 'En moviment', color: '#1FB286' },
  parat: { label: 'Aturat', color: '#E89421' },
  estacionat: { label: 'Estacionat', color: '#3B6BF5' },
};

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
  { group: 'Via personalitzada', items: [
    { kind: 'c-recta', label: 'Tram recte', emoji: '🛣️' },
    { kind: 'c-corba', label: 'Corba 90°', emoji: '↪️' },
    { kind: 'c-cruilla', label: 'Encreuament', emoji: '➕' },
    { kind: 'vorera', label: 'Vorera', emoji: '⬜' },
    { kind: 'gespa', label: 'Zona verda', emoji: '🟩' },
    { kind: 'parking', label: 'Places pàrquing', emoji: '🅿️' },
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
    { kind: 'pilona', label: 'Pilona', emoji: '🔘' },
    { kind: 'contenidor', label: 'Contenidor', emoji: '🗑️' },
    { kind: 'paperera', label: 'Paperera', emoji: '🚮' },
    { kind: 'banc', label: 'Banc', emoji: '🪑' },
    { kind: 'marquesina', label: 'Marquesina bus', emoji: '🚏' },
    { kind: 'biona', label: 'Biona / guardarail', emoji: '🛤️' },
    { kind: 'mur', label: 'Mur', emoji: '🧱' },
  ] },
  { group: 'Anotacions', items: [
    { kind: 'fletxa', label: 'Trajectòria', emoji: '↗️' },
    { kind: 'derrapatge', label: 'Frenada', emoji: '〰️' },
    { kind: 'impacte', label: "Punt d'impacte", emoji: '💥' },
    { kind: 'taca', label: 'Vessament', emoji: '🛢️' },
    { kind: 'ferit', label: 'Ferit', emoji: '🩹' },
    { kind: 'collisio', label: 'Punt col·lisió', emoji: '❌' },
    { kind: 'mesura', label: 'Cota / mida', emoji: '📐' },
    { kind: 'etiqueta', label: 'Etiqueta A·B', emoji: '🅰️' },
    { kind: 'text', label: 'Text lliure', emoji: '🔤' },
  ] },
  { group: 'Orientació i carrers', items: [
    { kind: 'nord', label: 'Nord (brúixola)', emoji: '🧭' },
    { kind: 'carrer', label: 'Nom de carrer', emoji: '🪧' },
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

// Llenç fix (món): BOARD viu a lib/croquisPhysics (compartit amb el 3D).
let counter = 0;

// Persistència: carrega l'escena desada i sincronitza el comptador d'ids.
function loadScene(): Scene | null {
  try {
    const raw = typeof localStorage !== 'undefined' && localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Scene;
    if (!s || !Array.isArray(s.els)) return null;
    return { road: s.road || 'cruilla', els: s.els, header: s.header || {}, legend: s.legend !== false };
  } catch { return null; }
}
function syncCounter(els: El[]) {
  for (const e of els) { const n = parseInt(String(e.id).replace('el-', '')); if (n > counter) counter = n; }
}
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
  carrer: { msg: 'Nom del carrer / via:', def: 'Carrer Major' },
};
const METEO = ['Assolellat', 'Ennuvolat', 'Pluja', 'Boira', 'Neu', 'Vent'];
const LLUM = ['Dia', 'Nit', 'Crepuscle', 'Il·luminació artificial'];
const CALCADA = ['Seca', 'Mullada', 'Gel', 'Neu', 'Greixosa'];
const VISIB = ['Bona', 'Reduïda', 'Dolenta'];

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
    case 'collisio': return (<><Circle radius={20} fill="#fff" stroke={RED} strokeWidth={3} /><Line points={[-12, -12, 12, 12]} stroke={RED} strokeWidth={5} /><Line points={[12, -12, -12, 12]} stroke={RED} strokeWidth={5} /></>);
    case 'nord': return (<>
      <Circle radius={22} fill="#fff" stroke={DARK} strokeWidth={2} shadowColor="#0005" shadowBlur={5} />
      <Line closed points={[0, -18, 7, 4, 0, -2, -7, 4]} fill={RED} />
      <Line closed points={[0, 18, 7, -4, 0, 2, -7, -4]} fill="#9AA0AA" />
      <Text text="N" fontSize={11} fontStyle="bold" fill={DARK} width={20} align="center" x={-10} y={-33} listening={false} />
    </>);
    /* Punt de pas (corba de trajectòria d'un vehicle) */
    case 'via': return (<>
      <Circle radius={12} fill={YEL} opacity={0.92} stroke="#fff" strokeWidth={2.5} shadowColor="#0006" shadowBlur={4} />
      <Circle radius={3.5} fill="#7A5A00" />
    </>);

    /* Via personalitzada — peces escalables per compondre el traçat real */
    case 'c-recta': return (<>
      <Rect x={-165} y={-210} width={330} height={420} fill={ASPHALT} />
      <Line points={[-165, -210, -165, 210]} stroke="#fff" strokeWidth={5} />
      <Line points={[165, -210, 165, 210]} stroke="#fff" strokeWidth={5} />
      <Line points={[0, -210, 0, 210]} stroke="#fff" strokeWidth={5} dash={[26, 20]} />
    </>);
    case 'c-corba': return (<>
      <Arc innerRadius={80} outerRadius={410} angle={90} rotation={180} fill={ASPHALT} />
      <Arc innerRadius={78} outerRadius={84} angle={90} rotation={180} fill="#fff" />
      <Arc innerRadius={406} outerRadius={412} angle={90} rotation={180} fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => {
        const a0 = Math.PI + ((i + 0.25) * (Math.PI / 2)) / 7, a1 = a0 + (Math.PI / 2) / 7 * 0.5, r = 245;
        return <Line key={i} points={[Math.cos(a0) * r, Math.sin(a0) * r, Math.cos(a1) * r, Math.sin(a1) * r]} stroke="#fff" strokeWidth={5} />;
      })}
    </>);
    case 'c-cruilla': return (<>
      <Rect x={-165} y={-330} width={330} height={660} fill={ASPHALT} />
      <Rect x={-330} y={-165} width={660} height={330} fill={ASPHALT} />
      <Rect x={-165} y={-165} width={330} height={330} fill={ASPHALT_DK} />
      {[[-165, -330, -165, -165], [165, -330, 165, -165], [-165, 165, -165, 330], [165, 165, 165, 330]].map((p, i) => (
        <Line key={'v' + i} points={p} stroke="#fff" strokeWidth={5} />
      ))}
      {[[-330, -165, -165, -165], [-330, 165, -165, 165], [165, -165, 330, -165], [165, 165, 330, 165]].map((p, i) => (
        <Line key={'h' + i} points={p} stroke="#fff" strokeWidth={5} />
      ))}
    </>);
    case 'vorera': return (<>
      <Rect x={-110} y={-70} width={220} height={140} fill="#D4D0C6" stroke="#B5B0A4" strokeWidth={3} />
      {[-55, 0, 55].map((x) => <Line key={x} points={[x, -70, x, 70]} stroke="#B5B0A4" strokeWidth={1.5} />)}
    </>);
    case 'gespa': return <Rect x={-110} y={-70} width={220} height={140} cornerRadius={8} fill="#BFDCA8" stroke="#9CC8AC" strokeWidth={3} />;
    case 'parking': return (<>
      {[-170, -57, 57, 170].map((x) => <Line key={x} points={[x, -118, x, 118]} stroke={PAINT} strokeWidth={6} />)}
      <Line points={[-170, -118, 170, -118]} stroke={PAINT} strokeWidth={6} />
    </>);

    /* Mobiliari urbà */
    case 'pilona': return (<>
      <Circle radius={9} fill="#3A3D44" stroke="#15151C" strokeWidth={1.5} />
      <Circle radius={3.5} fill="#E0455A" />
    </>);
    case 'contenidor': return (<>
      <Rect x={-26} y={-18} width={52} height={36} cornerRadius={6} fill="#2F7D4F" stroke={DARK} strokeWidth={1.5} />
      <Rect x={-26} y={-18} width={52} height={11} cornerRadius={5} fill="#256741" />
    </>);
    case 'paperera': return (<>
      <Circle radius={10} fill="#5F636B" stroke={DARK} strokeWidth={1.5} />
      <Circle radius={4} fill="#3A3D44" />
    </>);
    case 'banc': return (<>
      <Rect x={-30} y={-9} width={60} height={18} cornerRadius={4} fill="#8A6A3F" stroke="#6B4B2A" strokeWidth={1.5} />
      {[-18, -6, 6, 18].map((x) => <Line key={x} points={[x, -9, x, 9]} stroke="#6B4B2A" strokeWidth={1.5} />)}
    </>);
    case 'marquesina': return (<>
      <Rect x={-44} y={-14} width={88} height={30} cornerRadius={5} fill="#D7E8F5" stroke="#5F8FB5" strokeWidth={2} />
      <Rect x={-46} y={-20} width={92} height={8} cornerRadius={3} fill="#3A6B92" />
      <Em ch="🚌" s={14} y={4} />
    </>);
    case 'biona': return (<>
      <Rect x={-70} y={-5} width={140} height={10} cornerRadius={5} fill="#ADB3BC" stroke="#7C828C" strokeWidth={1.5} />
      {[-55, -18, 18, 55].map((x) => <Rect key={x} x={x - 3} y={3} width={6} height={9} fill="#7C828C" />)}
    </>);
    case 'mur': return (<>
      <Rect x={-60} y={-10} width={120} height={20} fill="#B98A66" stroke="#8F6A4C" strokeWidth={1.5} />
      <Line points={[-60, 0, 60, 0]} stroke="#8F6A4C" strokeWidth={1} />
      {[-40, -10, 20, 50].map((x) => <Line key={x} points={[x, -10, x, 0]} stroke="#8F6A4C" strokeWidth={1} />)}
      {[-25, 5, 35].map((x) => <Line key={x} points={[x, 0, x, 10]} stroke="#8F6A4C" strokeWidth={1} />)}
    </>);
    default: return null;
  }
}

/* ── Imatge de fons (mapa/foto) ── */
function useHtmlImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    if (!src) { setImg(undefined); return; }
    const im = new window.Image();
    im.onload = () => setImg(im);
    im.src = src;
    return () => { im.onload = null; };
  }, [src]);
  return img;
}
// Reescala una imatge a un màxim raonable perquè ocupi poc (export + desat).
function fileToScaledDataUrl(file: Blob, max = 1700): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new window.Image();
    im.onload = () => {
      const sc = Math.min(1, max / Math.max(im.width, im.height));
      const w = Math.max(1, Math.round(im.width * sc)), h = Math.max(1, Math.round(im.height * sc));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); if (!ctx) { reject(new Error('ctx')); return; }
      ctx.drawImage(im, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    im.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    im.src = url;
  });
}

/* ── Efecte visual de l'impacte (destell + ona expansiva), k∈[0,1] ── */
function CrashFx({ x, y, k }: { x: number; y: number; k: number }) {
  if (k < 0 || k > 1) return null;
  const fade = 1 - k;
  return (
    <Group x={x} y={y} listening={false}>
      <Circle radius={12 + k * 80} stroke="#FF7A1A" strokeWidth={7 * fade} opacity={0.85 * fade} />
      <Circle radius={6 + k * 36} fill="#FFB23C" opacity={0.35 * fade} />
      <Star numPoints={12} innerRadius={9 + k * 14} outerRadius={22 + k * 38} rotation={k * 50} fill="#FF7A1A" opacity={fade} />
      <Star numPoints={12} innerRadius={5 + k * 8} outerRadius={13 + k * 18} rotation={-k * 40} fill="#FFE08A" opacity={fade} />
    </Group>
  );
}

/* ════════════════════════ Node editable ════════════════════════ */
function Node({ el, onSelect, onChange, onContext, override, animating }: {
  el: El; onSelect: () => void; onChange: (e: Partial<El>) => void; onContext: (x: number, y: number) => void;
  override?: { x: number; y: number; rotation: number }; animating?: boolean;
}) {
  const ref = useRef<Konva.Group>(null);
  const img = useHtmlImage(el.kind === 'fons' ? el.src : undefined);
  const common = {
    id: el.id,
    x: override ? override.x : el.x, y: override ? override.y : el.y,
    rotation: override ? override.rotation : el.rotation, scaleX: el.scaleX, scaleY: el.scaleY,
    draggable: !animating, onClick: onSelect, onTap: onSelect,
    onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>) => { e.evt.preventDefault(); onSelect(); onContext(e.evt.clientX, e.evt.clientY); },
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => onChange({ x: e.target.x(), y: e.target.y() }),
    onTransformEnd: () => {
      const n = ref.current; if (!n) return;
      onChange({ x: n.x(), y: n.y(), rotation: n.rotation(), scaleX: n.scaleX(), scaleY: n.scaleY() });
    },
  };
  if (el.kind === 'fons') {
    if (!img) return null;
    return <KImage ref={ref as never} {...common} image={img} offsetX={img.width / 2} offsetY={img.height / 2}
      opacity={el.opacity ?? 1} draggable={!el.locked} listening={!el.locked} />;
  }
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
  if (el.kind === 'carrer') {
    const label = el.text || 'Carrer';
    const w = Math.max(72, label.length * 10.5 + 26);
    return (
      <Group ref={ref} {...common}>
        <Rect x={-w / 2} y={-16} width={w} height={32} cornerRadius={8} fill={el.color || '#1565C0'} stroke="#fff" strokeWidth={2} shadowColor="#0006" shadowBlur={5} />
        <Text text={label} fontSize={15} fontStyle="bold" fontFamily="Manrope, sans-serif" fill="#fff" width={w} align="center" x={-w / 2} y={-9} listening={false} />
      </Group>
    );
  }
  const veh = VEHICLES.includes(el.kind);
  const estat = el.data?.estat;
  const kmh = parseInt(el.data?.kmh || '') || 0;
  return (
    <Group ref={ref} {...common} opacity={el.ghost ? 0.42 : 1}>
      {el.ghost && <Rect x={-30} y={-52} width={60} height={104} cornerRadius={12} stroke={DARK} strokeWidth={1.5} dash={[8, 6]} listening={false} />}
      <Shape kind={el.kind} color={el.color || DEFAULT_COLOR(el.kind)} text={el.text} />
      {veh && !el.ghost && estat === 'mov' && (
        <Arrow points={[0, -48, 0, -48 - Math.min(80, 26 + kmh * 0.7)]} pointerLength={13} pointerWidth={13}
          stroke="#1FB286" fill="#1FB286" strokeWidth={5} listening={false} />
      )}
      {veh && !el.ghost && estat === 'estacionat' && (<>
        <Rect x={11} y={-52} width={20} height={20} cornerRadius={5} fill="#3B6BF5" listening={false} />
        <Text text="P" fontSize={15} fontStyle="bold" fill="#fff" width={20} align="center" x={11} y={-50} listening={false} />
      </>)}
    </Group>
  );
}

/* Etiqueta flotant amb lletra (A·B) + matrícula / dades (no gira amb el vehicle). */
function VehBadge({ el, letter }: { el: El; letter?: string }) {
  const d = el.data;
  const estat = !el.ghost ? d?.estat : undefined;
  const id = d?.plate || [d?.marca, d?.model].filter(Boolean).join(' ') || '';
  let label = [letter, id].filter(Boolean).join(' · ').toUpperCase();
  if (el.ghost) label = (letter ? letter + ' · ' : '') + (el.phase === 'final' ? 'FINAL' : 'INICIAL');
  if (!label) return null;
  const w = Math.max(44, label.length * 8.2 + (estat ? 26 : 16));
  return (
    <Group x={el.x} y={el.y + 58} listening={false} opacity={el.ghost ? 0.8 : 1}>
      <Rect x={-w / 2} y={-12} width={w} height={24} cornerRadius={7} fill={el.ghost ? '#F1EEE6' : '#fff'} stroke="rgba(21,21,28,0.18)" strokeWidth={1} shadowColor="#0006" shadowBlur={5} shadowOffsetY={1} />
      {estat && <Circle x={-w / 2 + 11} y={0} radius={5} fill={ESTATS[estat].color} />}
      <Text text={label} fontSize={12.5} fontStyle="bold" fontFamily="Manrope, sans-serif" fill="#15151C"
        x={-w / 2 + (estat ? 18 : 8)} y={-7} width={w - (estat ? 24 : 14)} align="center" />
    </Group>
  );
}

/* Capçalera de l'atestat dibuixada al llenç (s'exporta amb el PNG). */
function TitleBlock({ h }: { h: Header }) {
  const kv = (k: string, v?: string) => (v && v.trim() ? `${k}: ${v}` : null);
  const l2 = [kv('Data', h.data), kv('Hora', h.hora), kv('Municipi', h.municipi), kv('Via/lloc', h.lloc)].filter(Boolean).join('     ');
  const l3 = [kv('Meteo', h.meteo), kv('Llum', h.llum), kv('Calçada', h.calcada), kv('Visibilitat', h.visibilitat), kv('Instructor', h.instructor)].filter(Boolean).join('     ');
  const W = BOARD.w - 52;
  return (
    <Group x={26} y={22} listening={false}>
      <Rect width={W} height={132} cornerRadius={14} fill="#fff" stroke="rgba(21,21,28,0.18)" strokeWidth={1.5} shadowColor="#0006" shadowBlur={10} shadowOffsetY={3} />
      <Rect width={8} height={132} cornerRadius={14} fill={A.terracota} />
      <Text text="CROQUIS D'ACCIDENT" x={28} y={26} fontSize={26} fontStyle="bold" fontFamily="Poppins, sans-serif" fill="#15151C" />
      <Text text={h.num ? `Atestat núm. ${h.num}` : ''} x={W - 420} y={30} width={400} align="right" fontSize={18} fontStyle="bold" fontFamily="Poppins, sans-serif" fill={A.terraInk} />
      <Text text={l2} x={28} y={70} fontSize={16} fontFamily="Manrope, sans-serif" fill="#44444F" />
      <Text text={l3} x={28} y={100} fontSize={16} fontFamily="Manrope, sans-serif" fill="#44444F" />
    </Group>
  );
}

/* Llegenda automàtica de vehicles (A, B, C…). */
function Legend({ rows }: { rows: { letter: string; text: string; color: string }[] }) {
  const W = 420, head = 38, rh = 30, H = head + rows.length * rh + 14;
  return (
    <Group x={26} y={BOARD.h - H - 24} listening={false}>
      <Rect width={W} height={H} cornerRadius={14} fill="#fff" stroke="rgba(21,21,28,0.18)" strokeWidth={1.5} shadowColor="#0006" shadowBlur={10} shadowOffsetY={3} />
      <Text text="LLEGENDA" x={18} y={14} fontSize={15} fontStyle="bold" fontFamily="Poppins, sans-serif" fill="#15151C" />
      <Line points={[14, 34, W - 14, 34]} stroke="rgba(21,21,28,0.12)" strokeWidth={1} />
      {rows.map((r, i) => (
        <Group key={r.letter} y={head + i * rh}>
          <Circle x={26} y={8} radius={11} fill={r.color} stroke="#fff" strokeWidth={2} />
          <Text text={r.letter} x={15} y={1} width={22} align="center" fontSize={14} fontStyle="bold" fontFamily="Poppins, sans-serif" fill="#fff" />
          <Text text={r.text} x={48} y={0} width={W - 62} fontSize={15} fontFamily="Manrope, sans-serif" fill="#15151C" />
        </Group>
      ))}
    </Group>
  );
}

/* Element del menú contextual. */
function MenuItem({ children, onClick, danger, active }: { children: ReactNode; onClick: () => void; danger?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} className="cq-mi" style={{
      display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', border: 'none',
      background: active ? A.terraSoft : 'transparent', cursor: 'pointer', borderRadius: 8, padding: '8px 10px',
      fontFamily: A.sans, fontWeight: 600, fontSize: 13.5, color: danger ? A.red : A.ink,
    }}>{children}</button>
  );
}

const VEH_LABEL: Record<string, string> = Object.fromEntries(PALETTE[0].items.map((i) => [i.kind, i.label]));
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Maniobres tipus (per a l'informe i la llegenda). */
const MANIOBRES = ['Seguia recte', "Girava a l'esquerra", 'Girava a la dreta', 'Marxa enrere', 'Avançament', 'Canvi de carril', 'Incorporació', "Sortida d'estacionament", 'Aturat en senyal', 'Encalç / distracció'];
/* Zones de danys sobre el vehicle (frontal a dalt). */
export const DANYS_ZONES: { id: string; label: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'front-e', label: 'Frontal esq.', x: 0, y: 0, w: 40, h: 70 },
  { id: 'front', label: 'Frontal', x: 40, y: 0, w: 40, h: 70 },
  { id: 'front-d', label: 'Frontal dre.', x: 80, y: 0, w: 40, h: 70 },
  { id: 'lat-e', label: 'Lateral esq.', x: 0, y: 70, w: 40, h: 80 },
  { id: 'lat-d', label: 'Lateral dre.', x: 80, y: 70, w: 40, h: 80 },
  { id: 'rear-e', label: 'Posterior esq.', x: 0, y: 150, w: 40, h: 70 },
  { id: 'rear', label: 'Posterior', x: 40, y: 150, w: 40, h: 70 },
  { id: 'rear-d', label: 'Posterior dre.', x: 80, y: 150, w: 40, h: 70 },
];
export const danysLabels = (ids?: string[]) =>
  (ids ?? []).map((id) => DANYS_ZONES.find((z) => z.id === id)?.label).filter(Boolean).join(' · ');

/* Selector de zones de danys: silueta del vehicle amb 8 zones clicables. */
function DanysPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((z) => z !== id) : [...value, id]);
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <svg width={108} height={198} viewBox="0 0 120 220" style={{ flexShrink: 0 }}>
        <rect x={12} y={6} width={96} height={208} rx={26} fill="#E9EAEE" stroke="#9AA0AA" strokeWidth={2} />
        <rect x={26} y={42} width={68} height={34} rx={8} fill="#BFE0FF" />
        <rect x={26} y={150} width={68} height={28} rx={8} fill="#BFE0FF" />
        {DANYS_ZONES.map((z) => (
          <rect key={z.id} x={z.x + 2} y={z.y + 2} width={z.w - 4} height={z.h - 4} rx={9}
            fill={value.includes(z.id) ? 'rgba(214,43,43,0.5)' : 'rgba(21,21,28,0.02)'}
            stroke={value.includes(z.id) ? '#D62B2B' : 'rgba(21,21,28,0.14)'} strokeWidth={1.5}
            style={{ cursor: 'pointer' }} onClick={() => toggle(z.id)}>
            <title>{z.label}</title>
          </rect>
        ))}
      </svg>
      <div style={{ fontFamily: A.sans, fontSize: 12.5, color: value.length ? A.ink : A.inkMuted, lineHeight: 1.55 }}>
        {value.length ? danysLabels(value) : 'Toca les zones colpejades del vehicle (frontal a dalt). Pots marcar-ne diverses.'}
      </div>
    </div>
  );
}

/* Modal de dades del vehicle. */
function VehModal({ el, onClose, onSave }: { el: El; onClose: () => void; onSave: (d: VehData) => void }) {
  const [d, setD] = useState<VehData>({ estat: 'mov', ...el.data });
  const set = (p: Partial<VehData>) => setD((s) => ({ ...s, ...p }));
  const inp: CSSProperties = { width: '100%', border: `1px solid ${A.line2}`, borderRadius: 10, padding: '10px 12px', fontFamily: A.sans, fontSize: 14, color: A.ink, background: A.bgSoft, outline: 'none' };
  const lbl: CSSProperties = { display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 12, color: A.inkSoft, marginBottom: 5 };
  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(21,21,28,0.45)', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div onMouseDown={(e) => e.stopPropagation()} style={{ width: 'min(440px, 96vw)', maxHeight: '92vh', overflowY: 'auto', background: A.card, borderRadius: 20, boxShadow: A.shadowLg, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="car" size={20} color="#fff" sw={2.2} /></span>
          <div style={{ marginRight: 'auto' }}>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink }}>Dades del vehicle</div>
            <Mono size={9} color={A.inkMuted}>Marca · model · matrícula · estat</Mono>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Ic name="x" size={20} color={A.inkSoft} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={lbl}>Marca</label><input style={inp} value={d.marca || ''} onChange={(e) => set({ marca: e.target.value })} placeholder="Seat" /></div>
          <div><label style={lbl}>Model</label><input style={inp} value={d.model || ''} onChange={(e) => set({ model: e.target.value })} placeholder="León" /></div>
          <div><label style={lbl}>Color</label><input style={inp} value={d.color || ''} onChange={(e) => set({ color: e.target.value })} placeholder="Gris plata" /></div>
          <div><label style={lbl}>Matrícula</label><input style={{ ...inp, textTransform: 'uppercase', fontFamily: A.mono, letterSpacing: 1 }} value={d.plate || ''} onChange={(e) => set({ plate: e.target.value })} placeholder="1234 ABC" /></div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={lbl}>Estat de marxa</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(Object.keys(ESTATS) as Estat[]).map((s) => (
              <button key={s} onClick={() => set({ estat: s })} style={{
                border: `1.5px solid ${d.estat === s ? ESTATS[s].color : A.line2}`, background: d.estat === s ? ESTATS[s].color : A.card,
                color: d.estat === s ? '#fff' : A.inkSoft, cursor: 'pointer', borderRadius: 11, padding: '10px 6px',
                fontFamily: A.display, fontWeight: 700, fontSize: 12.5,
              }}>{ESTATS[s].label}</button>
            ))}
          </div>
        </div>

        {d.estat === 'mov' && (
          <div style={{ marginTop: 14 }}>
            <label style={lbl}>Velocitat aproximada (km/h)</label>
            <input style={inp} inputMode="numeric" value={d.kmh || ''} onChange={(e) => set({ kmh: e.target.value.replace(/[^0-9]/g, '') })} placeholder="50" />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, marginTop: 14 }}>
          <div>
            <label style={lbl}>Maniobra que realitzava</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={d.maniobra || ''} onChange={(e) => set({ maniobra: e.target.value })}>
              <option value="">—</option>
              {MANIOBRES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Ocupants</label>
            <input style={inp} inputMode="numeric" value={d.ocupants || ''} onChange={(e) => set({ ocupants: e.target.value.replace(/[^0-9]/g, '') })} placeholder="1" />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={lbl}>Conductor (nom / DNI)</label>
          <input style={inp} value={d.conductor || ''} onChange={(e) => set({ conductor: e.target.value })} placeholder="J. García — 12345678X" />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={lbl}>Zones de danys</label>
          <DanysPicker value={d.danys ?? []} onChange={(danys) => set({ danys })} />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={lbl}>Notes</label>
          <textarea style={{ ...inp, minHeight: 64, resize: 'vertical' }} value={d.note || ''} onChange={(e) => set({ note: e.target.value })} placeholder="Observacions, testimonis, estat del conductor…" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 12, padding: '12px', fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink }}>Cancel·lar</button>
          <button onClick={() => onSave(d)} style={{ flex: 1.4, border: 'none', background: A.ink, color: '#fff', cursor: 'pointer', borderRadius: 12, padding: '12px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: A.shadowMd }}>Desar dades</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════ EDITOR ════════════════════════════ */
export default function Croquis() {
  const nav = useNavigate();
  const [road, setRoad] = useState<Road>(() => loadScene()?.road ?? 'cruilla');
  const [els, setEls] = useState<El[]>(() => { const s = loadScene(); if (s) syncCounter(s.els); return s?.els ?? []; });
  const [header, setHeader] = useState<Header>(() => loadScene()?.header ?? {});
  const [showLegend, setShowLegend] = useState<boolean>(() => loadScene()?.legend ?? true);
  const [sel, setSel] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 700 });
  const [view, setView] = useState({ scale: 0, x: 0, y: 0 });
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [editVeh, setEditVeh] = useState<string | null>(null);
  const [editAtestat, setEditAtestat] = useState(false);
  const [, setHistTick] = useState(0);
  // Reproducció / vídeo / 3D
  const [showPlayer, setShowPlayer] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cine, setCine] = useState(true);
  const [prog, setProg] = useState(0); // segons de simulació
  const [dur, setDur] = useState(0);   // durada total (s)
  const [anim, setAnim] = useState<{
    ov: Record<string, { x: number; y: number; rotation: number }>;
    kmh: Record<string, number>;
    skidD: Record<string, number>;
  } | null>(null);
  const tlRef = useRef<Timeline | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTsRef = useRef<number | null>(null);
  const tSimRef = useRef(0);
  const speedRef = useRef(1);
  const cineRef = useRef(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const hist = useRef<{ past: Scene[]; future: Scene[] }>({ past: [], future: [] });

  // Lletres automàtiques (A, B, C…) per a cada vehicle, en ordre.
  const vehLetters = useMemo(() => {
    const m: Record<string, string> = {}; let i = 0;
    for (const e of els) if (VEHICLES.includes(e.kind) && !e.ghost) { m[e.id] = String.fromCharCode(65 + i); i++; }
    // els fantasmes hereten la lletra del seu original si en tenen
    return m;
  }, [els]);

  // ── Historial (desfer / refer) ──
  function snapshot(): Scene { return { road, els, header, legend: showLegend }; }
  function pushUndo() { hist.current.past.push(snapshot()); if (hist.current.past.length > 80) hist.current.past.shift(); hist.current.future = []; setHistTick((t) => t + 1); }
  function applyScene(s: Scene) { setRoad(s.road); setEls(s.els); setHeader(s.header); setShowLegend(s.legend); setSel(null); }
  function undo() { const h = hist.current; if (!h.past.length) return; h.future.push(snapshot()); applyScene(h.past.pop()!); setHistTick((t) => t + 1); }
  function redo() { const h = hist.current; if (!h.future.length) return; h.past.push(snapshot()); applyScene(h.future.pop()!); setHistTick((t) => t + 1); }

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

  // Autodesat al navegador.
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ road, els, header, legend: showLegend } as Scene)); } catch { /* quota */ }
  }, [road, els, header, showLegend]);

  // Enganxar (Ctrl+V) una captura de mapa/foto com a fons.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items; if (!items) return;
      for (const it of Array.from(items)) {
        if (it.type.startsWith('image/')) { const f = it.getAsFile(); if (f) { e.preventDefault(); fileToScaledDataUrl(f).then(addBackground).catch(() => {}); } break; }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, view.scale, view.x, view.y, els]);

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
      if (e.key === 'Escape') { setMenu(null); setEditVeh(null); setEditAtestat(false); return; }
      if (document.activeElement && document.activeElement !== document.body) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
      if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { e.preventDefault(); remove(); }
      else if (e.key === 'd' && (e.ctrlKey || e.metaKey) && sel) { e.preventDefault(); duplicate(); }
      else if (sel && e.key.startsWith('Arrow')) {
        e.preventDefault(); const d = e.shiftKey ? 20 : 4;
        const dx = e.key === 'ArrowLeft' ? -d : e.key === 'ArrowRight' ? d : 0;
        const dy = e.key === 'ArrowUp' ? -d : e.key === 'ArrowDown' ? d : 0;
        pushUndo(); setEls((p) => p.map((el) => (el.id === sel ? { ...el, x: el.x + dx, y: el.y + dy } : el)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, els]);

  const selEl = useMemo(() => els.find((e) => e.id === sel) || null, [els, sel]);

  // Genera un id únic garantit (per damunt de qualsevol existent),
  // robust davant de recàrregues, imports o desincronitzacions del comptador.
  function nextId() {
    let max = counter;
    for (const e of els) { const n = parseInt(String(e.id).replace('el-', '')); if (n > max) max = n; }
    counter = max + 1;
    return `el-${counter}`;
  }

  // Peces que han de quedar SOTA la resta (asfalt, voreres, gespa…).
  const GROUND_KINDS = ['c-recta', 'c-corba', 'c-cruilla', 'vorera', 'gespa', 'parking'];
  function add(kind: string) {
    const id = nextId();
    const p = NEEDS_PROMPT[kind];
    const cx = (size.w / 2 - view.x) / (view.scale || 1);
    const cy = (size.h / 2 - view.y) / (view.scale || 1);
    const e: El = {
      id, kind, x: cx + (Math.random() * 50 - 25), y: cy + (Math.random() * 50 - 25),
      rotation: 0, scaleX: 1, scaleY: 1, color: kind === 'carrer' ? '#1565C0' : DEFAULT_COLOR(kind),
      ...(p ? { text: (typeof window !== 'undefined' ? window.prompt(p.msg, p.def) : p.def) || p.def } : {}),
    };
    pushUndo();
    setEls((prev) => GROUND_KINDS.includes(kind)
      ? [...prev.filter((x) => x.kind === 'fons'), e, ...prev.filter((x) => x.kind !== 'fons')]
      : [...prev, e]);
    setSel(id);
  }
  function update(id: string, patch: Partial<El>) { pushUndo(); setEls((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e))); }
  function setVehData(id: string, patch: Partial<VehData>) { pushUndo(); setEls((p) => p.map((e) => (e.id === id ? { ...e, data: { ...e.data, ...patch } } : e))); }
  function openMenu(id: string, clientX: number, clientY: number) {
    const r = wrapRef.current?.getBoundingClientRect();
    setMenu({ id, x: clientX - (r?.left || 0), y: clientY - (r?.top || 0) });
  }
  function remove() { if (!sel) return; pushUndo(); setEls((p) => p.filter((e) => e.id !== sel)); setSel(null); }
  function duplicate() { if (!selEl) return; pushUndo(); const id = nextId(); setEls((p) => [...p, { ...selEl, id, x: selEl.x + 28, y: selEl.y + 28 }]); setSel(id); }
  function rotate(d: number) { if (selEl) update(selEl.id, { rotation: Math.round((selEl.rotation + d) % 360) }); }
  function scaleBy(f: number) { if (selEl) update(selEl.id, { scaleX: Math.max(0.25, Math.min(6, Math.abs(selEl.scaleX) * f)) * Math.sign(selEl.scaleX || 1), scaleY: Math.max(0.25, Math.min(6, selEl.scaleY * f)) }); }
  function flipH() { if (selEl) update(selEl.id, { scaleX: -selEl.scaleX }); }
  function toFront() { if (!selEl) return; pushUndo(); setEls((p) => [...p.filter((e) => e.id !== selEl.id), selEl]); }
  function toBack() { if (!selEl) return; pushUndo(); setEls((p) => [selEl, ...p.filter((e) => e.id !== selEl.id)]); }
  function clearAll() { if (els.length && !confirm('Esborrar tot el croquis?')) return; pushUndo(); setEls([]); setSel(null); }
  function changeRoad(r: Road) { pushUndo(); setRoad(r); }

  // Fons de mapa/foto: l'afegim darrere de tot i amaguem la via dibuixada.
  function addBackground(src: string) {
    const id = nextId(); pushUndo();
    setEls((p) => [{ id, kind: 'fons', src, x: BOARD.w / 2, y: BOARD.h / 2, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, locked: false }, ...p.filter((e) => e.kind !== 'fons')]);
    setRoad('cap'); setSel(id);
  }
  function setBgOpacity(v: number) { setEls((p) => p.map((e) => (e.kind === 'fons' ? { ...e, opacity: v } : e))); }
  function removeBg() { pushUndo(); setEls((p) => p.filter((e) => e.kind !== 'fons')); setSel(null); }
  function openMaps() {
    const q = window.prompt('Adreça o coordenades del lloc (s\'obre Google Maps):', '');
    if (q && q.trim()) window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.trim())}`, '_blank', 'noopener');
  }
  function openIcgc() { window.open('https://www.instamaps.cat/', '_blank', 'noopener'); }

  // Posició inicial (fantasma del vehicle, darrere segons el seu rumb).
  function markInitial(srcId: string) {
    const src = els.find((e) => e.id === srcId); if (!src) return;
    pushUndo(); const id = nextId(); const th = (src.rotation || 0) * Math.PI / 180;
    setEls((p) => [{ ...src, id, ghost: true, phase: 'inicial', parent: srcId, x: src.x - Math.sin(th) * 150, y: src.y + Math.cos(th) * 150 }, ...p]); setSel(id);
  }
  // Posició final (fantasma del vehicle, davant segons el seu rumb).
  function markFinal(srcId: string) {
    const src = els.find((e) => e.id === srcId); if (!src) return;
    pushUndo(); const id = nextId(); const th = (src.rotation || 0) * Math.PI / 180;
    setEls((p) => [{ ...src, id, ghost: true, phase: 'final', parent: srcId, x: src.x + Math.sin(th) * 150, y: src.y - Math.cos(th) * 150 }, ...p]); setSel(id);
  }
  // Punt de col·lisió (davant del vehicle si n'hi ha origen).
  function markCollision(srcId?: string) {
    const src = srcId ? els.find((e) => e.id === srcId) : null;
    pushUndo(); const id = nextId();
    let x = (size.w / 2 - view.x) / (view.scale || 1), y = (size.h / 2 - view.y) / (view.scale || 1);
    if (src) { const th = (src.rotation || 0) * Math.PI / 180; x = src.x + Math.sin(th) * 70; y = src.y - Math.cos(th) * 70; }
    setEls((p) => [...p, { id, kind: 'collisio', x, y, rotation: 0, scaleX: 1, scaleY: 1 }]); setSel(id);
  }
  // Punt de pas: corba la trajectòria prèvia del vehicle (inicial → impacte).
  // Es col·loca a mig camí entre la posició inicial i el vehicle, desplaçat
  // lateralment perquè es vegi que corba; després s'arrossega on calgui.
  function markVia(srcId: string) {
    const src = els.find((e) => e.id === srcId); if (!src) return;
    const g0 = els.find((e) => e.ghost && e.phase === 'inicial' && e.parent === srcId);
    pushUndo(); const id = nextId();
    let x: number, y: number;
    if (g0) {
      const mx = (g0.x + src.x) / 2, my = (g0.y + src.y) / 2;
      const dx = src.x - g0.x, dy = src.y - g0.y, L = Math.hypot(dx, dy) || 1;
      x = mx - (dy / L) * 80; y = my + (dx / L) * 80; // perpendicular
    } else {
      const th = (src.rotation || 0) * Math.PI / 180;
      x = src.x - Math.sin(th) * 110; y = src.y + Math.cos(th) * 110;
    }
    setEls((p) => [...p, { id, kind: 'via', x, y, rotation: 0, scaleX: 1, scaleY: 1, parent: srcId }]); setSel(id);
  }

  // Desar / obrir fitxer .json.
  function exportJson() {
    const data = JSON.stringify({ road, els, header, legend: showLegend } as Scene, null, 2);
    const a = document.createElement('a');
    a.download = 'croquis-accident.json';
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }
  function importJson(file: File) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(String(r.result)) as Scene;
        if (!Array.isArray(s.els)) throw new Error('bad');
        pushUndo(); syncCounter(s.els);
        setRoad(s.road || 'cruilla'); setEls(s.els); setHeader(s.header || {}); setShowLegend(s.legend !== false); setSel(null);
      } catch { alert('El fitxer no és un croquis vàlid.'); }
    };
    r.readAsText(file);
  }

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

  // ── Recreació / vídeo (motor físic de lib/croquisPhysics) ──
  function ensureTimeline(): Timeline {
    if (!tlRef.current) { tlRef.current = buildTimeline(els); setDur(tlRef.current.tTotal); }
    return tlRef.current;
  }
  function applyAt(t: number) {
    const tl = ensureTimeline();
    const ov: Record<string, { x: number; y: number; rotation: number }> = {};
    const kmh: Record<string, number> = {};
    const skidD: Record<string, number> = {};
    for (const v of tl.vehs) {
      const st = stateAt(v, t);
      ov[v.id] = { x: st.x, y: st.y, rotation: st.rotation };
      kmh[v.id] = st.kmh; skidD[v.id] = st.skidD;
    }
    setAnim({ ov, kmh, skidD }); setProg(t); tSimRef.current = t;
  }
  function frame(ts: number) {
    const tl = tlRef.current; if (!tl) return;
    if (lastTsRef.current == null) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000; lastTsRef.current = ts;
    const rate = simRateAt(tl, tSimRef.current, cineRef.current);
    const t = tSimRef.current + dt * speedRef.current * rate;
    if (cineRef.current) setView(cineViewAt(tl, t, fitView()));
    if (t >= tl.tTotal) { applyAt(tl.tTotal); setPlaying(false); lastTsRef.current = null; return; }
    applyAt(t); rafRef.current = requestAnimationFrame(frame);
  }
  function play() {
    if (playing) return;
    tlRef.current = buildTimeline(els); setDur(tlRef.current.tTotal);
    if (!tlRef.current.vehs.length) { alert('Per recrear l\'accident: deixa el cotxe al punt del xoc i, amb clic dret, marca la posició inicial (📍) i la final (🏁). Indica els km/h a "Dades del vehicle" per a velocitats reals.\n\nEls vehicles aturats o estacionats només necessiten la posició final (🏁): sortiran empesos pel xoc.'); return; }
    setSel(null); setMenu(null);
    if (tSimRef.current >= tlRef.current.tTotal - 0.05) tSimRef.current = 0;
    speedRef.current = speed; cineRef.current = cine; lastTsRef.current = null; setPlaying(true);
    rafRef.current = requestAnimationFrame(frame);
  }
  function pausePlay() { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null; setPlaying(false); }
  function restartPlay() { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastTsRef.current = null; tSimRef.current = 0; setProg(0); setPlaying(false); setAnim(null); tlRef.current = null; setView(fitView()); }
  function scrub(v: number) { if (playing) pausePlay(); ensureTimeline(); applyAt(v); }
  function setSpeedVal(s: number) { setSpeed(s); speedRef.current = s; }
  function toggleCine() { setCine((c) => { cineRef.current = !c; return !c; }); }

  // Grava la recreació a WebM (gravant el llenç fotograma a fotograma).
  async function recordWebM() {
    const stage = stageRef.current; if (!stage) return;
    const tl = buildTimeline(els);
    if (!tl.vehs.length) { alert('Abans de gravar: deixa el cotxe al punt del xoc i marca la posició inicial (📍) i la final (🏁) amb clic dret.'); return; }
    if (typeof MediaRecorder === 'undefined') { alert('Aquest navegador no permet gravar vídeo (prova Chrome o Edge).'); return; }
    tlRef.current = tl; setDur(tl.tTotal); setRecording(true); setSel(null); setMenu(null);
    const prev = { ...view }; const f = fitView(size.w, size.h, 8); setView(f);
    await new Promise((r) => setTimeout(r, 160));
    const RW = 1280, RH = Math.round(RW * BOARD.h / BOARD.w);
    const rc = document.createElement('canvas'); rc.width = RW; rc.height = RH;
    const rctx = rc.getContext('2d');
    const stream = rc.captureStream(30);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
    let rec: MediaRecorder;
    try { rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 }); } catch { rec = new MediaRecorder(stream); }
    const chunks: BlobPart[] = []; rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise<void>((res) => { rec.onstop = () => res(); });
    rec.start();
    // Pas de temps real constant; el slow-motion del cine s'aplica al simulat.
    const dtR = 1 / 30; let t = 0; let guard = 0;
    while (t < tl.tTotal && guard < 3600) {
      guard++;
      const rate = simRateAt(tl, t, cineRef.current);
      t = Math.min(tl.tTotal, t + dtR * speedRef.current * rate);
      if (cineRef.current) setView(cineViewAt(tl, t, f));
      applyAt(t);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
      if (rctx) { const sc = stage.toCanvas({ x: f.x, y: f.y, width: BOARD.w * f.scale, height: BOARD.h * f.scale, pixelRatio: 1 }); rctx.drawImage(sc as CanvasImageSource, 0, 0, RW, RH); }
    }
    await new Promise((r) => setTimeout(r, 400));
    rec.stop(); await stopped;
    setAnim(null); setProg(0); tSimRef.current = 0; setView(prev); setRecording(false);
    const blob = new Blob(chunks, { type: 'video/webm' });
    const a = document.createElement('a'); a.download = 'croquis-accident.webm'; a.href = URL.createObjectURL(blob); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }

  // ── Informe imprimible (croquis + seqüència + taula de dades) ──
  function captureFrame(f: { scale: number; x: number; y: number }, pr: number): Promise<string> {
    return new Promise((res) => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const stage = stageRef.current!;
        res(stage.toDataURL({
          x: f.x, y: f.y, width: BOARD.w * f.scale, height: BOARD.h * f.scale,
          pixelRatio: pr / f.scale, mimeType: 'image/jpeg', quality: 0.86,
        }));
      }));
    });
  }
  async function exportInforme() {
    const stage = stageRef.current; if (!stage) return;
    // Obrim la finestra DINS del gest de clic (si no, el navegador la bloqueja).
    const w = window.open('', '_blank');
    if (!w) { alert("El navegador ha bloquejat la finestra de l'informe. Permet finestres emergents per a infopol.app."); return; }
    w.document.write('<p style="font-family:sans-serif;padding:24px;color:#555">Generant l\'informe…</p>');
    setSel(null); setMenu(null);
    const prev = { ...view };
    const f = fitView(size.w, size.h, 8); setView(f);
    const tl = buildTimeline(els); tlRef.current = tl; setDur(tl.tTotal);
    setAnim(null);
    await new Promise((r) => setTimeout(r, 120));
    const croquisPng = await captureFrame(f, 1.6);
    const frames: { label: string; png: string }[] = [];
    if (tl.vehs.length) {
      const seq: [string, number][] = [
        [`Posicions inicials · T −${tl.tImpact.toFixed(1)} s`, 0.001],
        ['Aproximació · T −1,0 s', Math.max(0.01, tl.tImpact - 1)],
        ["Moment de l'impacte · T 0", tl.tImpact + 0.12],
        [`Posicions finals · T +${(tl.tTotal - tl.tImpact - 1).toFixed(1)} s`, tl.tTotal],
      ];
      for (const [label, t] of seq) {
        applyAt(t);
        frames.push({ label, png: await captureFrame(f, 1.05) });
      }
    }
    setAnim(null); setProg(0); tSimRef.current = 0; setView(prev);

    // Taula de vehicles: dades declarades + física derivada de la timeline.
    const rows = els.filter((e) => VEHICLES.includes(e.kind) && !e.ghost).map((e) => {
      const d = e.data || {};
      const tv = tl.vehs.find((v) => v.id === e.id);
      return `<tr>
        <td class="lt">${vehLetters[e.id] || '—'}</td>
        <td>${esc(VEH_LABEL[e.kind] || e.kind)}</td>
        <td>${esc([d.marca, d.model].filter(Boolean).join(' ') || '—')}</td>
        <td class="mono">${esc((d.plate || '—').toUpperCase())}</td>
        <td>${esc(d.color || '—')}</td>
        <td>${d.estat ? ESTATS[d.estat].label : '—'}</td>
        <td>${d.kmh ? d.kmh + ' km/h' : '—'}</td>
        <td>${esc(d.maniobra || '—')}</td>
        <td>${esc(d.ocupants || '—')}</td>
        <td>${esc(d.conductor || '—')}</td>
        <td>${esc(danysLabels(d.danys) || '—')}</td>
        <td>${tv && tv.postLen > 0 ? (tv.postLen / PX_PER_M).toFixed(1) + ' m' : '—'}</td>
      </tr>`;
    }).join('');
    const kv = (k: string, v?: string) => (v && v.trim() ? `<span><b>${k}:</b> ${esc(v)}</span>` : '');
    const hd = [
      kv('Atestat', header.num), kv('Data', header.data), kv('Hora', header.hora),
      kv('Municipi', header.municipi), kv('Via/lloc', header.lloc), kv('Meteo', header.meteo),
      kv('Llum', header.llum), kv('Calçada', header.calcada), kv('Visibilitat', header.visibilitat),
      kv('Instructor', header.instructor),
    ].filter(Boolean).join('');
    const framesHtml = frames.length
      ? `<h2>Seqüència de la recreació</h2>
         <p class="note">Motor físic: velocitats declarades pels implicats · 1 carril = 3,5 m · T 0 = instant de l'impacte.</p>
         <div class="grid">${frames.map((fr) => `<figure><img src="${fr.png}" /><figcaption>${esc(fr.label)}</figcaption></figure>`).join('')}</div>`
      : '';
    const html = `<!doctype html><html lang="ca"><head><meta charset="utf-8" />
<title>Informe del croquis — InfoPol</title>
<style>
  * { box-sizing: border-box; } body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #15151C; margin: 0; padding: 28px; }
  h1 { font-size: 22px; margin: 0 0 4px; } h2 { font-size: 15px; margin: 26px 0 8px; border-bottom: 2px solid #B6531F; padding-bottom: 4px; }
  .meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12px; color: #44444F; margin: 8px 0 4px; }
  .meta b { color: #15151C; }
  img { width: 100%; border: 1px solid #ddd; border-radius: 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  figure { margin: 0; } figcaption { font-size: 11px; color: #44444F; margin-top: 3px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 6px; }
  th, td { border: 1px solid #D8D5CC; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #F4F1EA; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.4px; }
  .lt { font-weight: 800; text-align: center; } .mono { font-family: ui-monospace, monospace; }
  .note { font-size: 10.5px; color: #6B6B72; margin: 2px 0 8px; }
  .foot { margin-top: 26px; font-size: 10px; color: #9A9AA2; border-top: 1px solid #E5E2D9; padding-top: 8px; }
  @media print { body { padding: 10mm; } .grid { page-break-inside: avoid; } table { page-break-inside: avoid; } }
</style></head><body>
  <h1>Informe del croquis d'accident</h1>
  <div class="meta">${hd || '<span style="color:#9A9AA2">Sense dades d\'atestat (omple-les al botó «Atestat» de l\'editor).</span>'}</div>
  <h2>Croquis</h2>
  <img src="${croquisPng}" />
  ${framesHtml}
  <h2>Vehicles implicats</h2>
  <table><thead><tr>
    <th></th><th>Tipus</th><th>Marca i model</th><th>Matrícula</th><th>Color</th><th>Estat</th>
    <th>Velocitat</th><th>Maniobra</th><th>Ocup.</th><th>Conductor</th><th>Danys</th><th>Frenada</th>
  </tr></thead><tbody>${rows || '<tr><td colspan="12" style="color:#9A9AA2">Cap vehicle al croquis.</td></tr>'}</tbody></table>
  <p class="note">«Frenada» = distància recorreguda des de l'impacte fins a la posició final (derivada del croquis a escala 1 carril = 3,5 m).</p>
  <div class="foot">Generat amb InfoPol · infopol.app/croquis · ${new Date().toLocaleString('ca-ES')}</div>
</body></html>`;
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch { /* impressió manual */ } }, 700);
  }

  // Neteja del rAF en desmuntar.
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const btn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 11, padding: '9px 13px', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink };
  const pct = Math.round((view.scale || 1) * 100);
  const animating = !!anim;
  const bgEl = els.find((e) => e.kind === 'fons') || null;
  // Si l'escena canvia mentre no es reprodueix, la línia de temps caduca.
  useEffect(() => { if (!playing && !recording) tlRef.current = null; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [els]);
  const headerFilled = Object.values(header).some((v) => v && String(v).trim());
  const legendRows = els.filter((e) => VEHICLES.includes(e.kind) && !e.ghost).map((e) => {
    const d = e.data || {};
    const text = [[d.marca, d.model].filter(Boolean).join(' '), d.plate, d.color, d.estat ? ESTATS[d.estat].label : ''].filter(Boolean).join(' · ') || 'Vehicle';
    const color = d.estat ? ESTATS[d.estat].color : (e.color && e.color !== '#FFFFFF' ? e.color! : A.ink);
    return { letter: vehLetters[e.id] || '?', text, color };
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: A.bg, display: 'flex', flexDirection: 'column', fontFamily: A.sans }}>
      {/* Top bar */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '10px clamp(12px,2vw,20px)', borderBottom: `1px solid ${A.line}`, background: A.bgSoft, flexWrap: 'wrap' }}>
        <button onClick={() => nav('/')} style={{ ...btn, padding: 9 }} aria-label="Tornar a l'inici"><Ic name="arrowL" size={18} color={A.inkSoft} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 'auto' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="car" size={19} color="#fff" sw={2.2} /></span>
          <div><div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 15.5, color: A.ink, letterSpacing: -0.3 }}>Croquis d'accident</div><Mono size={9} color={A.inkMuted}>Editor professional · exporta PNG</Mono></div>
        </div>
        <button onClick={undo} disabled={!hist.current.past.length} style={{ ...btn, padding: '9px 11px', fontSize: 16, opacity: hist.current.past.length ? 1 : 0.4 }} title="Desfer (Ctrl+Z)">↶</button>
        <button onClick={redo} disabled={!hist.current.future.length} style={{ ...btn, padding: '9px 11px', fontSize: 16, opacity: hist.current.future.length ? 1 : 0.4 }} title="Refer (Ctrl+Maj+Z)">↷</button>
        <button onClick={() => setEditAtestat(true)} style={btn}><Ic name="doc" size={15} color={A.inkSoft} /> Atestat</button>
        <button onClick={() => bgFileRef.current?.click()} style={btn} title="Posar una captura de mapa/foto de fons (o enganxa amb Ctrl+V)">📷 Fons</button>
        <button onClick={openMaps} style={{ ...btn, padding: '9px 11px' }} title="Obrir Google Maps al lloc exacte">🗺️</button>
        <button onClick={openIcgc} style={{ ...btn, padding: '9px 11px' }} title="Obrir ICGC · ortofoto de Catalunya">🛰️</button>
        <input ref={bgFileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) fileToScaledDataUrl(f).then(addBackground).catch(() => {}); e.target.value = ''; }} />
        <label style={{ ...btn, gap: 8 }}>
          <Mono size={9} color={A.inkMuted}>Via</Mono>
          <select value={road} onChange={(e) => changeRoad(e.target.value as Road)} style={{ border: 'none', background: 'transparent', fontFamily: A.display, fontWeight: 700, fontSize: 13.5, color: A.ink, cursor: 'pointer', outline: 'none' }}>
            {ROADS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <button onClick={exportJson} style={btn} title="Desar còpia (.json)">💾 Desar</button>
        <button onClick={() => fileRef.current?.click()} style={btn} title="Obrir un croquis (.json)">📂 Obrir</button>
        <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ''; }} />
        <button onClick={() => setShowPlayer((v) => !v)} style={{ ...btn, ...(showPlayer ? { background: A.terracota, color: '#fff', border: 'none' } : {}) }} title="Recreació en vídeo">▶ Vídeo</button>
        <button onClick={() => setShow3D(true)} style={btn} title="Recreació 3D de l'accident">🧊 3D</button>
        <button onClick={() => { void exportInforme(); }} style={btn} title="Informe imprimible: croquis + seqüència + taula de dades (desa'l com a PDF)">📄 Informe</button>
        <button onClick={clearAll} style={btn}><Ic name="x" size={15} color={A.inkSoft} /> Buidar</button>
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
            onWheel={(e) => { setMenu(null); onWheel(e); }}
            onContextMenu={(e) => e.evt.preventDefault()}
            onDragEnd={(e) => { if (e.target === e.target.getStage()) setView((v) => ({ ...v, x: e.target.x(), y: e.target.y() })); }}
            onMouseDown={(e) => {
              setMenu(null);
              // En acabar una reproducció, l'estat d'animació quedava actiu i
              // bloquejava l'arrossegament de TOTS els elements (el "cartell
              // de carrer que no es mou"). Qualsevol clic fora de reproducció
              // torna al mode edició.
              if (anim && !playing && !recording) { setAnim(null); setProg(0); tSimRef.current = 0; }
              if (e.target === e.target.getStage()) setSel(null);
            }}
            onTouchStart={(e) => {
              setMenu(null);
              if (anim && !playing && !recording) { setAnim(null); setProg(0); tSimRef.current = 0; }
              if (e.target === e.target.getStage()) setSel(null);
            }}>
            <Layer listening={false}><RoadBg road={road} /></Layer>
            <Layer>
              {/* Marques de frenada (es van pintant durant la fase post-impacte) */}
              {anim && tlRef.current?.vehs.map((v) => {
                const dVis = anim.skidD[v.id] ?? 0;
                if (dVis <= 4 || !v.skid.length) return null;
                const ptsL: number[] = [], ptsR: number[] = [];
                for (const s of v.skid) {
                  if (s.d > dVis) break;
                  const th = (s.rot * Math.PI) / 180, ox = Math.cos(th) * 10, oy = Math.sin(th) * 10;
                  ptsL.push(s.x - ox, s.y - oy); ptsR.push(s.x + ox, s.y + oy);
                }
                if (ptsL.length < 4) return null;
                return (
                  <Group key={'skid-' + v.id} listening={false}>
                    <Line points={ptsL} stroke="#2A2A2E" strokeWidth={5} opacity={0.5} lineCap="round" />
                    <Line points={ptsR} stroke="#2A2A2E" strokeWidth={5} opacity={0.5} lineCap="round" />
                  </Group>
                );
              })}
              {els.map((el) => (
                <Fragment key={el.id}>
                  <Node el={el} onSelect={() => setSel(el.id)} onChange={(patch) => update(el.id, patch)}
                    onContext={(cx, cy) => openMenu(el.id, cx, cy)} override={anim?.ov[el.id]} animating={animating} />
                  {VEHICLES.includes(el.kind) && !animating && <VehBadge el={el} letter={vehLetters[el.id]} />}
                </Fragment>
              ))}
              {/* Etiqueta de velocitat en directe sobre cada vehicle */}
              {anim && tlRef.current?.vehs.map((v) => {
                const o = anim.ov[v.id]; if (!o) return null;
                const sp = Math.round(anim.kmh[v.id] ?? 0);
                const label = `${vehLetters[v.id] ? vehLetters[v.id] + ' · ' : ''}${sp} km/h`;
                const w = label.length * 7.6 + 18;
                return (
                  <Group key={'spd-' + v.id} x={o.x} y={o.y - 80} listening={false}>
                    <Rect x={-w / 2} y={-13} width={w} height={26} cornerRadius={8} fill="rgba(21,21,28,0.82)" />
                    <Text text={label} fontSize={13} fontStyle="bold" fontFamily="Manrope, sans-serif" fill="#fff" width={w} align="center" x={-w / 2} y={-7} />
                  </Group>
                );
              })}
              {anim && tlRef.current && tlRef.current.impacts.map((c, i) => (
                <CrashFx key={'fx-' + i} x={c.x} y={c.y} k={(prog - tlRef.current!.tImpact) / 0.7} />
              ))}
              <Transformer ref={trRef} rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                anchorSize={11} borderStroke={A.terracota} anchorStroke={A.terracota} anchorCornerRadius={3}
                boundBoxFunc={(oldB, newB) => (newB.width < 14 || newB.height < 14 ? oldB : newB)} />
            </Layer>
            {/* Capçalera + llegenda (informatiu, s'exporta) */}
            <Layer listening={false}>
              {headerFilled && <TitleBlock h={header} />}
              {showLegend && legendRows.length > 0 && <Legend rows={legendRows} />}
            </Layer>
          </Stage>

          {/* Controls de zoom */}
          <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 6, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 13, padding: 5, boxShadow: A.shadowLg }}>
            <button onClick={() => zoom(0.83)} style={{ ...btn, padding: '7px 12px', fontSize: 18, border: 'none' }} aria-label="Allunyar">−</button>
            <button onClick={() => setView(fitView())} style={{ ...btn, padding: '7px 10px', border: 'none', fontSize: 12 }}>{pct}%</button>
            <button onClick={() => zoom(1.2)} style={{ ...btn, padding: '7px 12px', fontSize: 18, border: 'none' }} aria-label="Apropar">+</button>
          </div>

          {/* Panell del fons de mapa */}
          {bgEl && (
            <div style={{ position: 'absolute', left: 14, top: 14, zIndex: 8, display: 'flex', alignItems: 'center', gap: 10, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 13, padding: '8px 12px', boxShadow: A.shadowLg }}>
              <span style={{ fontSize: 16 }}>🗺️</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Mono size={8.5} color={A.inkMuted}>Fons · opacitat</Mono>
                <input type="range" min={20} max={100} value={Math.round((bgEl.opacity ?? 1) * 100)} onChange={(e) => setBgOpacity(Number(e.target.value) / 100)} style={{ width: 116, accentColor: A.terracota }} />
              </div>
              <button onClick={() => { update(bgEl.id, { locked: !bgEl.locked }); setSel(null); }} style={{ ...btn, padding: '7px 10px' }} title={bgEl.locked ? 'Desbloquejar per moure\'l' : 'Bloquejar (dibuixa per sobre)'}>{bgEl.locked ? '🔒' : '🔓'}</button>
              <button onClick={removeBg} style={{ ...btn, padding: '7px 10px', color: A.red, borderColor: A.redSoft }} title="Treure el fons"><Ic name="x" size={14} color={A.red} /></button>
            </div>
          )}

          {/* Cronòmetre forense (T ± respecte de l'impacte) */}
          {animating && tlRef.current && tlRef.current.impacts.length > 0 && (
            <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 9, background: 'rgba(21,21,28,0.85)', color: '#fff', borderRadius: 999, padding: '7px 18px', fontFamily: A.mono, fontWeight: 700, fontSize: 15, letterSpacing: 1, pointerEvents: 'none' }}>
              {fmtRel(prog, tlRef.current.tImpact)}
            </div>
          )}

          {/* Barra de reproducció / vídeo */}
          {showPlayer && (
            <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', zIndex: 9, display: 'flex', alignItems: 'center', gap: 9, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 14, padding: '8px 12px', boxShadow: A.shadowLg, flexWrap: 'wrap', maxWidth: '95%' }}>
              <button onClick={playing ? pausePlay : play} disabled={recording} style={{ ...btn, background: A.ink, color: '#fff', border: 'none' }}>{playing ? '⏸ Pausa' : '▶ Reproduir'}</button>
              <button onClick={restartPlay} disabled={recording} style={btn} title="Reiniciar">⟲</button>
              <input type="range" min={0} max={Math.max(100, Math.round(dur * 100))} value={Math.round(prog * 100)} onChange={(e) => scrub(Number(e.target.value) / 100)} disabled={recording} style={{ width: 150, accentColor: A.terracota }} />
              <Mono size={10} color={A.inkSoft}>{prog.toFixed(1)} / {dur > 0 ? dur.toFixed(1) : '–'} s</Mono>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', paddingLeft: 6, borderLeft: `1px solid ${A.line}` }}>
                {[0.5, 1, 2].map((s) => <button key={s} onClick={() => setSpeedVal(s)} style={{ ...btn, padding: '7px 9px', ...(speed === s ? { background: A.terraSoft, borderColor: A.terracota } : {}) }}>×{s}</button>)}
              </div>
              <button onClick={toggleCine} style={{ ...btn, padding: '7px 10px', ...(cine ? { background: A.terraSoft, borderColor: A.terracota } : {}) }} title="Càmera cinematogràfica: zoom + slow-motion a l'impacte">🎥</button>
              <button onClick={() => { pausePlay(); setShow3D(true); }} disabled={recording} style={{ ...btn, padding: '7px 10px' }} title="Recreació 3D">🧊 3D</button>
              <button onClick={recordWebM} disabled={recording} style={{ ...btn, color: recording ? A.inkMuted : A.red, borderColor: A.redSoft }}>{recording ? '● Gravant…' : '⬇ Gravar WebM'}</button>
            </div>
          )}

          {/* Mini-barra de l'element seleccionat */}
          {selEl && !animating && (
            <div style={{ position: 'absolute', left: '50%', bottom: showPlayer ? 70 : 14, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 7, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 14, padding: '8px 11px', boxShadow: A.shadowLg, flexWrap: 'wrap', maxWidth: '94%' }}>
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
              👈 Tria la via i arrossega elements · 📷 Fons per posar un mapa (o enganxa amb Ctrl+V) · clic dret per a les dades
            </div>
          )}

          {/* Menú contextual (clic dret) */}
          {menu && (() => {
            const el = els.find((e) => e.id === menu.id); if (!el) return null;
            const isVeh = VEHICLES.includes(el.kind);
            const sep = <div style={{ height: 1, background: A.line, margin: '5px 4px' }} />;
            const estH = Math.min(size.h - 16, isVeh ? 500 : 230);
            const left = Math.max(8, Math.min(menu.x, size.w - 222));
            const top = Math.max(8, Math.min(menu.y, size.h - estH - 8));
            return (
              <>
                <div onMouseDown={() => setMenu(null)} onContextMenu={(e) => { e.preventDefault(); setMenu(null); }} style={{ position: 'absolute', inset: 0, zIndex: 20 }} />
                <div style={{ position: 'absolute', left, top, zIndex: 21, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 13, boxShadow: A.shadowLg, padding: 6, minWidth: 206, maxHeight: size.h - 16, overflowY: 'auto' }}>
                  {isVeh && (<>
                    <MenuItem onClick={() => { setEditVeh(el.id); setMenu(null); }}>🚗 Dades del vehicle…</MenuItem>
                    {sep}
                    <Mono size={9} color={A.inkMuted} style={{ display: 'block', padding: '2px 10px 4px' }}>Estat de marxa</Mono>
                    {(Object.keys(ESTATS) as Estat[]).map((s) => (
                      <MenuItem key={s} active={el.data?.estat === s} onClick={() => { setVehData(el.id, { estat: s }); setMenu(null); }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: ESTATS[s].color, flexShrink: 0 }} />{ESTATS[s].label}
                      </MenuItem>
                    ))}
                    {sep}
                    <MenuItem onClick={() => { markInitial(el.id); setMenu(null); }}>📍 Marca posició inicial</MenuItem>
                    <MenuItem onClick={() => { markFinal(el.id); setMenu(null); }}>🏁 Marca posició final</MenuItem>
                    <MenuItem onClick={() => { markCollision(el.id); setMenu(null); }}>❌ Marca punt de col·lisió</MenuItem>
                    <MenuItem onClick={() => { markVia(el.id); setMenu(null); }}>🟡 Afegir punt de pas (corba)</MenuItem>
                    {sep}
                  </>)}
                  <MenuItem onClick={() => { duplicate(); setMenu(null); }}>Duplicar</MenuItem>
                  <MenuItem onClick={() => { toFront(); setMenu(null); }}>Portar al davant</MenuItem>
                  <MenuItem onClick={() => { toBack(); setMenu(null); }}>Enviar al darrere</MenuItem>
                  {sep}
                  <MenuItem danger onClick={() => { remove(); setMenu(null); }}>Esborrar</MenuItem>
                </div>
              </>
            );
          })()}
        </main>
      </div>

      {/* Modal de dades del vehicle */}
      {editVeh && (() => {
        const el = els.find((e) => e.id === editVeh); if (!el) return null;
        return <VehModal el={el} onClose={() => setEditVeh(null)} onSave={(d) => { setVehData(el.id, d); setEditVeh(null); }} />;
      })()}

      {/* Modal de dades de l'atestat */}
      {editAtestat && (
        <AtestatModal h={header} legend={showLegend} onClose={() => setEditAtestat(false)}
          onSave={(nh, lg) => { pushUndo(); setHeader(nh); setShowLegend(lg); setEditAtestat(false); }} />
      )}

      {/* Recreació 3D (chunk separat, només es carrega en obrir-lo) */}
      {show3D && (
        <Suspense fallback={
          <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(21,21,28,0.8)', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: A.display, fontWeight: 700, fontSize: 17 }}>
            Carregant l'escenari 3D…
          </div>
        }>
          <Croquis3D els={els} road={road} onClose={() => setShow3D(false)} />
        </Suspense>
      )}
    </div>
  );
}

/* Modal de dades de l'atestat (capçalera + llegenda). */
function AtestatModal({ h, legend, onClose, onSave }: { h: Header; legend: boolean; onClose: () => void; onSave: (h: Header, legend: boolean) => void }) {
  const [d, setD] = useState<Header>({ ...h });
  const [lg, setLg] = useState(legend);
  const set = (p: Partial<Header>) => setD((s) => ({ ...s, ...p }));
  const inp: CSSProperties = { width: '100%', border: `1px solid ${A.line2}`, borderRadius: 10, padding: '10px 12px', fontFamily: A.sans, fontSize: 14, color: A.ink, background: A.bgSoft, outline: 'none' };
  const lbl: CSSProperties = { display: 'block', fontFamily: A.display, fontWeight: 700, fontSize: 12, color: A.inkSoft, marginBottom: 5 };
  const Sel = ({ k, opts }: { k: keyof Header; opts: string[] }) => (
    <select style={{ ...inp, cursor: 'pointer' }} value={(d[k] as string) || ''} onChange={(e) => set({ [k]: e.target.value } as Partial<Header>)}>
      <option value="">—</option>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(21,21,28,0.45)', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div onMouseDown={(e) => e.stopPropagation()} style={{ width: 'min(560px, 96vw)', maxHeight: '92vh', overflowY: 'auto', background: A.card, borderRadius: 20, boxShadow: A.shadowLg, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: A.terracota, display: 'grid', placeItems: 'center', boxShadow: A.inset }}><Ic name="doc" size={19} color="#fff" sw={2.2} /></span>
          <div style={{ marginRight: 'auto' }}>
            <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 17, color: A.ink }}>Dades de l'atestat</div>
            <Mono size={9} color={A.inkMuted}>S'imprimeix a la capçalera del croquis</Mono>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Ic name="x" size={20} color={A.inkSoft} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div><label style={lbl}>Atestat núm.</label><input style={inp} value={d.num || ''} onChange={(e) => set({ num: e.target.value })} placeholder="123/2026" /></div>
          <div><label style={lbl}>Data</label><input style={inp} value={d.data || ''} onChange={(e) => set({ data: e.target.value })} placeholder="06/06/2026" /></div>
          <div><label style={lbl}>Hora</label><input style={inp} value={d.hora || ''} onChange={(e) => set({ hora: e.target.value })} placeholder="18:30" /></div>
          <div><label style={lbl}>Municipi</label><input style={inp} value={d.municipi || ''} onChange={(e) => set({ municipi: e.target.value })} placeholder="Viladecans" /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Via / lloc</label><input style={inp} value={d.lloc || ''} onChange={(e) => set({ lloc: e.target.value })} placeholder="Av. de Roureda, 12" /></div>
          <div><label style={lbl}>Meteo</label><Sel k="meteo" opts={METEO} /></div>
          <div><label style={lbl}>Llum</label><Sel k="llum" opts={LLUM} /></div>
          <div><label style={lbl}>Calçada</label><Sel k="calcada" opts={CALCADA} /></div>
          <div><label style={lbl}>Visibilitat</label><Sel k="visibilitat" opts={VISIB} /></div>
          <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Instructor (TIP)</label><input style={inp} value={d.instructor || ''} onChange={(e) => set({ instructor: e.target.value })} placeholder="TIP 12345" /></div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, cursor: 'pointer', fontFamily: A.sans, fontWeight: 600, fontSize: 14, color: A.ink }}>
          <input type="checkbox" checked={lg} onChange={(e) => setLg(e.target.checked)} style={{ width: 18, height: 18 }} />
          Mostrar la llegenda de vehicles (A · B · C…) al croquis
        </label>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 12, padding: '12px', fontFamily: A.display, fontWeight: 700, fontSize: 14, color: A.ink }}>Cancel·lar</button>
          <button onClick={() => onSave(d, lg)} style={{ flex: 1.4, border: 'none', background: A.ink, color: '#fff', cursor: 'pointer', borderRadius: 12, padding: '12px', fontFamily: A.display, fontWeight: 700, fontSize: 14, boxShadow: A.shadowMd }}>Desar atestat</button>
        </div>
      </div>
    </div>
  );
}
