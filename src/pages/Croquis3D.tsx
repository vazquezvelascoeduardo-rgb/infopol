// Recreació 3D de l'accident — three.js via react-three-fiber.
// Es carrega en lazy (chunk separat) des de l'editor 2D de Croquis.tsx.
//
// Reconstrueix l'escena del croquis en 3D: calçada segons el tipus de via,
// vehicles low-poly amb el color/tipus reals, senyals com a pals amb cartell,
// mobiliari (semàfors, fanals, arbres, cons, edificis…) i marques al terra.
// La recreació fa servir EL MATEIX motor físic que el 2D (croquisPhysics):
// velocitats reals, sortides retardades, frenada amb rastre i trompo.
// Càmeres: orbital lliure, persecució, vista del conductor i cenital.
import {
  Fragment, useEffect, useMemo, useRef, useState,
  type CSSProperties, type MutableRefObject, type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { A, Ic, Mono } from '../lib/design';
import {
  BOARD, PX_PER_M, VEHICLES, KIND_EMOJI, buildTimeline, stateAt, fmtRel,
  type El, type Road, type Timeline, type TimelineVeh,
} from '../lib/croquisPhysics';

/* ════════════════ Coordenades 2D (px) → 3D (m) ════════════════ */
const M = PX_PER_M;
const toX = (x: number) => (x - BOARD.w / 2) / M;
const toZ = (y: number) => (y - BOARD.h / 2) / M;
const yawOf = (rot: number) => (-rot * Math.PI) / 180; // 0 = mira cap a −z
const W_M = BOARD.w / M, H_M = BOARD.h / M;            // món en metres

/* ════════════════ Textures (canvas → three) ════════════════ */
const texCache = new Map<string, THREE.CanvasTexture>();
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function emojiTex(emoji: string, bg: string | null = '#fff'): THREE.CanvasTexture {
  const key = `e:${emoji}:${bg}`;
  let t = texCache.get(key); if (t) return t;
  const s = 128, c = document.createElement('canvas'); c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  if (bg) {
    ctx.fillStyle = bg; rrect(ctx, 6, 6, s - 12, s - 12, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(21,21,28,0.3)'; ctx.lineWidth = 4; rrect(ctx, 6, 6, s - 12, s - 12, 24); ctx.stroke();
  }
  ctx.font = `${Math.round(s * 0.58)}px serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(emoji, s / 2, s / 2 + 4);
  t = new THREE.CanvasTexture(c); t.anisotropy = 4; texCache.set(key, t);
  return t;
}
function labelTex(text: string, bg: string, fg = '#fff'): { tex: THREE.CanvasTexture; aspect: number } {
  const key = `l:${text}:${bg}:${fg}`;
  const cached = texCache.get(key);
  if (cached) return { tex: cached, aspect: (cached.image as HTMLCanvasElement).width / 64 };
  const w = Math.max(96, Math.round(text.length * 30 + 44));
  const c = document.createElement('canvas'); c.width = w; c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg; rrect(ctx, 2, 2, w - 4, 60, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; rrect(ctx, 2, 2, w - 4, 60, 16); ctx.stroke();
  ctx.fillStyle = fg; ctx.font = 'bold 30px Manrope, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, 34);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; texCache.set(key, t);
  return { tex: t, aspect: w / 64 };
}

/* ════════════════ Peces bàsiques ════════════════ */
// Tira plana sobre el terra (calçada, línies pintades…).
function Strip({ x = 0, z = 0, w, l, color, y = 0.012, rotY = 0, opacity }: {
  x?: number; z?: number; w: number; l: number; color: string; y?: number; rotY?: number; opacity?: number;
}) {
  return (
    <group position={[x, y, z]} rotation-y={rotY}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial color={color} transparent={opacity != null} opacity={opacity ?? 1} />
      </mesh>
    </group>
  );
}
// Línia discontínua al llarg de z.
function Dashes({ x = 0, z = 0, l, rotY = 0 }: { x?: number; z?: number; l: number; rotY?: number }) {
  const n = Math.floor(l / 2.2);
  return (
    <group position={[x, 0, z]} rotation-y={rotY}>
      {Array.from({ length: n }, (_, i) => (
        <Strip key={i} z={-l / 2 + 1.1 + i * 2.2} w={0.14} l={1.2} color="#F4F2EC" y={0.014} />
      ))}
    </group>
  );
}

const ROAD_COL = '#474A52', ROAD_DK = '#3E4148', LINE = '#F4F2EC', GREEN = '#7FA86C';
/* Calçada 3D segons el tipus de via del croquis. */
function Road3D({ road }: { road: Road }) {
  const LANE = 3.5, RW = LANE * 2;
  if (road === 'cap') return null;
  const vert = (
    <>
      <Strip w={RW} l={H_M} color={ROAD_COL} y={0.005} />
      <Strip x={-LANE} w={0.16} l={H_M} color={LINE} />
      <Strip x={LANE} w={0.16} l={H_M} color={LINE} />
    </>
  );
  const horiz = (
    <>
      <Strip w={W_M} l={RW} color={ROAD_COL} y={0.005} rotY={Math.PI / 2} />
      <Strip z={-LANE} w={W_M} l={0.16} color={LINE} rotY={0} y={0.012} />
      <Strip z={LANE} w={W_M} l={0.16} color={LINE} y={0.012} />
    </>
  );
  if (road === 'recta') return <group>{vert}<Dashes l={H_M} /></group>;
  if (road === 'doble') return (
    <group>{vert}
      <Strip x={-0.16} w={0.13} l={H_M} color="#E8B92E" />
      <Strip x={0.16} w={0.13} l={H_M} color="#E8B92E" />
    </group>
  );
  if (road === 'autovia') {
    const off = (165 + 34) / M;
    return (
      <group>
        <Strip x={-off} w={RW} l={H_M} color={ROAD_COL} y={0.005} />
        <Strip x={off} w={RW} l={H_M} color={ROAD_COL} y={0.005} />
        <mesh position={[0, 0.13, 0]} receiveShadow castShadow>
          <boxGeometry args={[60 / M, 0.26, H_M]} />
          <meshStandardMaterial color={GREEN} />
        </mesh>
        <Dashes x={-off} l={H_M} /><Dashes x={off} l={H_M} />
      </group>
    );
  }
  if (road === 'cruilla') return (
    <group>{vert}{horiz}
      <Strip w={RW} l={RW} color={ROAD_DK} y={0.008} />
      <Dashes z={-(H_M / 4 + LANE / 2)} l={H_M / 2 - RW / 2} />
      <Dashes z={H_M / 4 + LANE / 2} l={H_M / 2 - RW / 2} />
      <Dashes x={-(W_M / 4 + LANE / 2)} l={W_M / 2 - RW / 2} rotY={Math.PI / 2} />
      <Dashes x={W_M / 4 + LANE / 2} l={W_M / 2 - RW / 2} rotY={Math.PI / 2} />
    </group>
  );
  if (road === 'te') return (
    <group>{horiz}
      <Strip z={-H_M / 4} w={RW} l={H_M / 2} color={ROAD_COL} y={0.005} />
      <Strip w={RW} l={RW} color={ROAD_DK} y={0.008} />
      <Dashes z={-(H_M / 4 + LANE / 2)} l={H_M / 2 - RW / 2} />
    </group>
  );
  if (road === 'rotonda') {
    const Ri = 119.5 / M, Ro = 400 / M;
    return (
      <group>
        <Strip w={RW} l={H_M} color={ROAD_COL} y={0.004} />
        <Strip w={W_M} l={RW} color={ROAD_COL} y={0.004} rotY={Math.PI / 2} />
        <mesh rotation-x={-Math.PI / 2} position-y={0.007} receiveShadow>
          <ringGeometry args={[Ri, Ro, 48]} />
          <meshStandardMaterial color={ROAD_DK} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[Ri, Ri, 0.32, 36]} />
          <meshStandardMaterial color={GREEN} />
        </mesh>
      </group>
    );
  }
  // corba: dos trams perpendiculars units per un pedaç central.
  return (
    <group>
      <Strip z={H_M / 4} w={RW} l={H_M / 2} color={ROAD_COL} y={0.005} />
      <Strip x={W_M / 4} w={W_M / 2} l={RW} color={ROAD_COL} y={0.005} rotY={Math.PI / 2} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.007} receiveShadow>
        <circleGeometry args={[LANE * 1.45, 28]} />
        <meshStandardMaterial color={ROAD_DK} />
      </mesh>
    </group>
  );
}

/* ════════════════ Vehicles low-poly ════════════════ */
const DIMS: Record<string, { l: number; w: number; h: number }> = {
  cotxe: { l: 4.4, w: 1.8, h: 1.45 }, furgo: { l: 5.0, w: 1.95, h: 2.2 },
  camio: { l: 8.0, w: 2.4, h: 3.1 }, trailer: { l: 14.5, w: 2.5, h: 3.6 },
  bus: { l: 12.0, w: 2.5, h: 3.1 }, moto: { l: 2.1, w: 0.8, h: 1.3 },
  bici: { l: 1.8, w: 0.5, h: 1.1 }, patinet: { l: 1.2, w: 0.45, h: 1.15 },
  vianant: { l: 0.5, w: 0.5, h: 1.75 }, tractor: { l: 4.2, w: 2.2, h: 2.8 },
  ambulancia: { l: 5.6, w: 2.05, h: 2.5 }, policia: { l: 4.7, w: 1.85, h: 1.5 },
};
const GLASS = '#7FA8C9';
/* Materials: pintura amb clearcoat (brillantor de carrosseria), vidre i plàstic. */
const Paint = ({ color }: { color: string }) => (
  <meshPhysicalMaterial color={color} metalness={0.5} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.22} />
);
const GlassMat = () => (
  <meshPhysicalMaterial color={GLASS} metalness={0.25} roughness={0.06} transparent opacity={0.92} />
);
const Trim = () => <meshStandardMaterial color="#222429" roughness={0.65} />;

function Wheel({ x, z, r = 0.33, w = 0.24 }: { x: number; z: number; r?: number; w?: number }) {
  return (
    <group position={[x, r, z]} rotation-z={Math.PI / 2}>
      <mesh castShadow><cylinderGeometry args={[r, r, w, 18]} /><meshStandardMaterial color="#17171B" roughness={0.92} /></mesh>
      {/* tapaboixes a banda i banda */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, s * (w / 2 + 0.005), 0]}>
          <cylinderGeometry args={[r * 0.55, r * 0.55, 0.02, 14]} />
          <meshStandardMaterial color="#C8CBD2" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
function Lightbar({ z, w, y = 0 }: { z: number; w: number; y?: number }) {
  return (
    <group position={[0, y, z]}>
      <mesh position={[-w / 4, 0, 0]}><boxGeometry args={[w / 2.4, 0.13, 0.28]} /><meshStandardMaterial color="#2E6BE6" emissive="#2E6BE6" emissiveIntensity={1.6} /></mesh>
      <mesh position={[w / 4, 0, 0]}><boxGeometry args={[w / 2.4, 0.13, 0.28]} /><meshStandardMaterial color="#E0455A" emissive="#E0455A" emissiveIntensity={1.6} /></mesh>
    </group>
  );
}
/* Fars (davant) i pilots (darrere). */
function Lights({ l, w, y = 0.56 }: { l: number; w: number; y?: number }) {
  return (
    <>
      {[-1, 1].map((s) => (
        <Fragment key={s}>
          <mesh position={[s * w * 0.32, y, -l / 2 - 0.008]}>
            <boxGeometry args={[0.3, 0.13, 0.04]} />
            <meshStandardMaterial color="#FFF3C4" emissive="#FFE9A8" emissiveIntensity={1} />
          </mesh>
          <mesh position={[s * w * 0.32, y, l / 2 + 0.008]}>
            <boxGeometry args={[0.28, 0.12, 0.04]} />
            <meshStandardMaterial color="#B82626" emissive="#E0455A" emissiveIntensity={0.8} />
          </mesh>
        </Fragment>
      ))}
    </>
  );
}
/* Para-xocs + matrícules + graella. */
function BumpersPlates({ l, w }: { l: number; w: number }) {
  return (
    <>
      <RoundedBox args={[w * 0.99, 0.2, 0.24]} radius={0.07} smoothness={2} position={[0, 0.38, -l / 2 + 0.04]} castShadow><Trim /></RoundedBox>
      <RoundedBox args={[w * 0.99, 0.2, 0.24]} radius={0.07} smoothness={2} position={[0, 0.38, l / 2 - 0.04]} castShadow><Trim /></RoundedBox>
      <mesh position={[0, 0.52, -l / 2 - 0.012]}><boxGeometry args={[w * 0.42, 0.1, 0.02]} /><Trim /></mesh>
      <mesh position={[0, 0.36, -l / 2 - 0.02]}><boxGeometry args={[0.48, 0.11, 0.015]} /><meshStandardMaterial color="#F4F4F4" /></mesh>
      <mesh position={[0, 0.36, l / 2 + 0.02]}><boxGeometry args={[0.48, 0.11, 0.015]} /><meshStandardMaterial color="#F4F4F4" /></mesh>
    </>
  );
}
/* Retrovisors laterals. */
function Mirrors({ l, w, y, color }: { l: number; w: number; y: number; color: string }) {
  return (
    <>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (w / 2 + 0.08), y, -l * 0.16]}>
          <mesh castShadow><boxGeometry args={[0.15, 0.1, 0.06]} /><Paint color={color} /></mesh>
        </group>
      ))}
    </>
  );
}

/* Turisme: xassís arrodonit + cabina de vidre + sostre pintat + detalls. */
function SedanBody({ l, w, h, color }: { l: number; w: number; h: number; color: string }) {
  const bodyH = h * 0.4, cabH = h * 0.46;
  const bodyTop = 0.34 + bodyH;
  return (
    <group>
      <RoundedBox args={[w, bodyH, l]} radius={0.11} smoothness={3} position={[0, 0.34 + bodyH / 2, 0]} castShadow><Paint color={color} /></RoundedBox>
      {/* capó lleugerament més baix al davant */}
      <RoundedBox args={[w * 0.94, bodyH * 0.4, l * 0.22]} radius={0.07} smoothness={2} position={[0, bodyTop - bodyH * 0.16, -l * 0.36]} castShadow><Paint color={color} /></RoundedBox>
      <RoundedBox args={[w * 0.86, cabH, l * 0.48]} radius={0.17} smoothness={3} position={[0, bodyTop + cabH / 2 - 0.1, l * 0.06]} castShadow><GlassMat /></RoundedBox>
      <RoundedBox args={[w * 0.76, 0.07, l * 0.4]} radius={0.03} smoothness={2} position={[0, bodyTop + cabH - 0.1, l * 0.06]} castShadow><Paint color={color} /></RoundedBox>
      <BumpersPlates l={l} w={w} />
      <Lights l={l} w={w} />
      <Mirrors l={l} w={w} y={bodyTop + 0.04} color={color} />
      <Wheel x={-w / 2 + 0.1} z={-l / 2 + 0.82} /><Wheel x={w / 2 - 0.1} z={-l / 2 + 0.82} />
      <Wheel x={-w / 2 + 0.1} z={l / 2 - 0.82} /><Wheel x={w / 2 - 0.1} z={l / 2 - 0.82} />
    </group>
  );
}
/* Furgoneta / ambulància: volum alt amb parabrisa inclinat i finestres. */
function VanBody({ l, w, h, color, windows = true }: { l: number; w: number; h: number; color: string; windows?: boolean }) {
  const bodyH = h * 0.84;
  return (
    <group>
      <RoundedBox args={[w, bodyH, l]} radius={0.13} smoothness={3} position={[0, 0.32 + bodyH / 2, 0]} castShadow><Paint color={color} /></RoundedBox>
      {/* parabrisa inclinat */}
      <mesh position={[0, 0.32 + bodyH * 0.72, -l / 2 + 0.1]} rotation-x={-0.32}>
        <boxGeometry args={[w * 0.84, bodyH * 0.34, 0.05]} /><GlassMat />
      </mesh>
      {/* finestres laterals davanteres */}
      {windows && [-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 + 0.005), 0.32 + bodyH * 0.7, -l * 0.3]}>
          <boxGeometry args={[0.02, bodyH * 0.26, l * 0.22]} /><GlassMat />
        </mesh>
      ))}
      <BumpersPlates l={l} w={w} />
      <Lights l={l} w={w} y={0.6} />
      <Mirrors l={l} w={w} y={0.32 + bodyH * 0.66} color={color} />
      <Wheel x={-w / 2 + 0.1} z={-l / 2 + 0.9} /><Wheel x={w / 2 - 0.1} z={-l / 2 + 0.9} />
      <Wheel x={-w / 2 + 0.1} z={l / 2 - 1.0} /><Wheel x={w / 2 - 0.1} z={l / 2 - 1.0} />
    </group>
  );
}

// Model 3D del vehicle (tipus + color del croquis). Mira cap a −z.
function VehModel({ kind, color }: { kind: string; color: string }) {
  const d = DIMS[kind] ?? DIMS.cotxe;
  const { l, w, h } = d;
  const shadow = (
    <mesh rotation-x={-Math.PI / 2} position-y={0.02} scale={[w * 0.66, l * 0.56, 1]}>
      <circleGeometry args={[1, 24]} />
      <meshBasicMaterial color="#000" transparent opacity={0.22} depthWrite={false} />
    </mesh>
  );
  if (kind === 'vianant') return (
    <group>
      {shadow}
      {/* cames */}
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.09, 0.4, 0]} castShadow><capsuleGeometry args={[0.07, 0.55, 4, 8]} /><meshStandardMaterial color="#3D4350" /></mesh>)}
      {/* tors */}
      <mesh position={[0, 1.02, 0]} castShadow><capsuleGeometry args={[0.19, 0.5, 6, 12]} /><meshStandardMaterial color={color === '#15151C' ? '#E8A33D' : color} /></mesh>
      {/* braços */}
      {[-1, 1].map((s) => <mesh key={'a' + s} position={[s * 0.27, 1.0, 0]} rotation-z={s * 0.18} castShadow><capsuleGeometry args={[0.055, 0.5, 4, 8]} /><meshStandardMaterial color={color === '#15151C' ? '#E8A33D' : color} /></mesh>)}
      {/* cap */}
      <mesh position={[0, 1.52, 0]} castShadow><sphereGeometry args={[0.155, 16, 12]} /><meshStandardMaterial color="#E8C39E" /></mesh>
    </group>
  );
  if (kind === 'moto' || kind === 'bici' || kind === 'patinet') {
    const r = kind === 'moto' ? 0.32 : kind === 'bici' ? 0.34 : 0.16;
    return (
      <group>
        {shadow}
        <Wheel x={0} z={-l / 2 + r} r={r} w={kind === 'moto' ? 0.16 : 0.08} />
        <Wheel x={0} z={l / 2 - r} r={r} w={kind === 'moto' ? 0.16 : 0.08} />
        {kind === 'moto' && (<>
          <RoundedBox args={[0.34, 0.34, l * 0.6]} radius={0.1} smoothness={2} position={[0, r + 0.28, 0.05]} castShadow><Paint color={color} /></RoundedBox>
          <mesh position={[0, r + 0.5, -l / 2 + r + 0.1]} castShadow><boxGeometry args={[0.46, 0.05, 0.05]} /><Trim /></mesh>
        </>)}
        {kind === 'bici' && (<>
          <mesh position={[0, r + 0.2, 0]} rotation-x={0.5} castShadow><boxGeometry args={[0.05, 0.05, l * 0.6]} /><Paint color={color} /></mesh>
          <mesh position={[0, r + 0.45, -l / 2 + r]} castShadow><boxGeometry args={[0.44, 0.04, 0.04]} /><Trim /></mesh>
        </>)}
        {kind === 'patinet' && (<>
          <mesh position={[0, r + 0.06, 0.1]} castShadow><boxGeometry args={[0.16, 0.05, 0.85]} /><Paint color={color} /></mesh>
          <mesh position={[0, r + 0.62, -0.35]} castShadow><cylinderGeometry args={[0.025, 0.025, 1.1, 8]} /><Trim /></mesh>
          <mesh position={[0, r + 1.16, -0.35]} castShadow><boxGeometry args={[0.4, 0.04, 0.04]} /><Trim /></mesh>
        </>)}
        {/* conductor */}
        <mesh position={[0, r + (kind === 'patinet' ? 0.95 : 0.78), kind === 'patinet' ? 0 : 0.12]} castShadow>
          <capsuleGeometry args={[0.17, 0.45, 6, 10]} /><meshStandardMaterial color="#3D4350" />
        </mesh>
        <mesh position={[0, r + (kind === 'patinet' ? 1.52 : 1.34), kind === 'patinet' ? 0 : 0.12]} castShadow>
          <sphereGeometry args={[0.15, 14, 10]} />
          <meshStandardMaterial color={kind === 'bici' ? '#E8C39E' : '#15151C'} roughness={kind === 'bici' ? 0.8 : 0.3} />
        </mesh>
      </group>
    );
  }
  if (kind === 'camio' || kind === 'trailer') {
    const cabL = l * 0.26, boxL = l - cabL - 0.25;
    return (
      <group>
        {shadow}
        <RoundedBox args={[w * 0.96, h * 0.56, cabL]} radius={0.12} smoothness={3} position={[0, 0.42 + h * 0.28, -l / 2 + cabL / 2]} castShadow><Paint color={color} /></RoundedBox>
        <mesh position={[0, 0.42 + h * 0.44, -l / 2 + 0.08]} rotation-x={-0.18}>
          <boxGeometry args={[w * 0.84, h * 0.22, 0.05]} /><GlassMat />
        </mesh>
        <RoundedBox args={[w, h * 0.7, boxL]} radius={0.06} smoothness={2} position={[0, 0.5 + h * 0.35, cabL / 2 + 0.12]} castShadow><meshStandardMaterial color="#EDEEF1" roughness={0.6} /></RoundedBox>
        {/* faldons i para-xocs */}
        <BumpersPlates l={l} w={w} />
        <Lights l={l} w={w} y={0.62} />
        <Mirrors l={l} w={w} y={0.42 + h * 0.42} color={color} />
        <Wheel x={-w / 2 + 0.12} z={-l / 2 + 0.95} r={0.45} w={0.3} /><Wheel x={w / 2 - 0.12} z={-l / 2 + 0.95} r={0.45} w={0.3} />
        <Wheel x={-w / 2 + 0.12} z={l / 2 - 1.1} r={0.45} w={0.3} /><Wheel x={w / 2 - 0.12} z={l / 2 - 1.1} r={0.45} w={0.3} />
        <Wheel x={-w / 2 + 0.12} z={l / 2 - 2.1} r={0.45} w={0.3} /><Wheel x={w / 2 - 0.12} z={l / 2 - 2.1} r={0.45} w={0.3} />
        {kind === 'trailer' && (<><Wheel x={-w / 2 + 0.12} z={0.4} r={0.45} w={0.3} /><Wheel x={w / 2 - 0.12} z={0.4} r={0.45} w={0.3} /></>)}
      </group>
    );
  }
  if (kind === 'tractor') {
    return (
      <group>
        {shadow}
        <RoundedBox args={[w * 0.7, h * 0.42, l * 0.85]} radius={0.1} smoothness={2} position={[0, 0.6 + h * 0.21, 0]} castShadow><Paint color={color} /></RoundedBox>
        {/* cabina envidrada */}
        <RoundedBox args={[w * 0.62, h * 0.4, l * 0.35]} radius={0.08} smoothness={2} position={[0, 0.6 + h * 0.6, l * 0.12]} castShadow><GlassMat /></RoundedBox>
        <mesh position={[0, 0.6 + h * 0.82, l * 0.12]} castShadow><boxGeometry args={[w * 0.66, 0.06, l * 0.38]} /><Paint color={color} /></mesh>
        {/* xemeneia */}
        <mesh position={[w * 0.2, 0.6 + h * 0.55, -l * 0.32]} castShadow><cylinderGeometry args={[0.05, 0.05, h * 0.5, 8]} /><Trim /></mesh>
        <Wheel x={-w / 2 + 0.2} z={l / 2 - 0.95} r={0.88} w={0.42} /><Wheel x={w / 2 - 0.2} z={l / 2 - 0.95} r={0.88} w={0.42} />
        <Wheel x={-w / 2 + 0.22} z={-l / 2 + 0.6} r={0.46} w={0.3} /><Wheel x={w / 2 - 0.22} z={-l / 2 + 0.6} r={0.46} w={0.3} />
      </group>
    );
  }
  if (kind === 'bus') {
    const bodyH = h * 0.88;
    return (
      <group>
        {shadow}
        <RoundedBox args={[w, bodyH, l]} radius={0.16} smoothness={3} position={[0, 0.34 + bodyH / 2, 0]} castShadow><Paint color={color} /></RoundedBox>
        {/* banda de finestres contínua */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (w / 2 + 0.006), 0.34 + bodyH * 0.68, 0]}>
            <boxGeometry args={[0.02, bodyH * 0.3, l * 0.88]} /><GlassMat />
          </mesh>
        ))}
        <mesh position={[0, 0.34 + bodyH * 0.68, -l / 2 + 0.06]} rotation-x={-0.12}>
          <boxGeometry args={[w * 0.86, bodyH * 0.32, 0.05]} /><GlassMat />
        </mesh>
        {/* porta */}
        <mesh position={[w / 2 + 0.006, 0.34 + bodyH * 0.4, -l * 0.32]}>
          <boxGeometry args={[0.015, bodyH * 0.74, 1.1]} /><GlassMat />
        </mesh>
        <BumpersPlates l={l} w={w} />
        <Lights l={l} w={w} y={0.6} />
        <Wheel x={-w / 2 + 0.12} z={-l / 2 + 1.25} r={0.46} w={0.3} /><Wheel x={w / 2 - 0.12} z={-l / 2 + 1.25} r={0.46} w={0.3} />
        <Wheel x={-w / 2 + 0.12} z={l / 2 - 1.6} r={0.46} w={0.3} /><Wheel x={w / 2 - 0.12} z={l / 2 - 1.6} r={0.46} w={0.3} />
      </group>
    );
  }
  if (kind === 'furgo') return <group>{shadow}<VanBody l={l} w={w} h={h} color={color} /></group>;
  if (kind === 'ambulancia') {
    return (
      <group>
        {shadow}
        <VanBody l={l} w={w} h={h} color="#F7F7F7" />
        {/* franja i creu */}
        <mesh position={[0, 0.32 + h * 0.4, 0]}><boxGeometry args={[w + 0.015, 0.24, l * 0.72]} /><meshStandardMaterial color="#E0455A" /></mesh>
        {[-1, 1].map((s) => (
          <Fragment key={s}>
            <mesh position={[s * (w / 2 + 0.012), 0.32 + h * 0.62, l * 0.12]}><boxGeometry args={[0.015, 0.34, 0.1]} /><meshStandardMaterial color="#E0455A" /></mesh>
            <mesh position={[s * (w / 2 + 0.012), 0.32 + h * 0.62, l * 0.12]}><boxGeometry args={[0.015, 0.1, 0.34]} /><meshStandardMaterial color="#E0455A" /></mesh>
          </Fragment>
        ))}
        <Lightbar z={-l * 0.3} w={w} y={0.34 + h * 0.86} />
      </group>
    );
  }
  if (kind === 'policia') {
    return (
      <group>
        {shadow}
        <SedanBody l={l} w={w} h={h} color="#15151C" />
        {/* banda blanca de portes */}
        <mesh position={[0, 0.62, 0]}><boxGeometry args={[w + 0.015, 0.26, l * 0.46]} /><meshStandardMaterial color="#F4F4F4" /></mesh>
        <Lightbar z={-l * 0.06} w={w * 0.8} y={0.34 + h * 0.86 + 0.05} />
      </group>
    );
  }
  // Turisme estàndard.
  return <group>{shadow}<SedanBody l={l} w={w} h={h} color={color} /></group>;
}
/* ── Danys del vehicle (les zones marcades al modal 2D, en 3D) ──
   Abolladures low-poly (icosaedres aplastats amb flat shading) en la
   posició de cada zona. Durant la recreació NO es veuen fins a
   l'instant de l'impacte: el cotxe arriba intacte i surt abonyegat. */
function DamagePatches({ kind, color, danys }: { kind: string; color: string; danys: string[] }) {
  const d = DIMS[kind] ?? DIMS.cotxe;
  const { l, w } = d;
  const dark = useMemo(() => '#' + new THREE.Color(color).multiplyScalar(0.4).getHexString(), [color]);
  const y = 0.6;
  const at: Record<string, [number, number, number]> = {
    front: [0, y, -l / 2 + 0.08], 'front-e': [-w * 0.34, y, -l / 2 + 0.16], 'front-d': [w * 0.34, y, -l / 2 + 0.16],
    'lat-e': [-w / 2 + 0.04, y + 0.08, -l * 0.04], 'lat-d': [w / 2 - 0.04, y + 0.08, -l * 0.04],
    rear: [0, y, l / 2 - 0.08], 'rear-e': [-w * 0.34, y, l / 2 - 0.16], 'rear-d': [w * 0.34, y, l / 2 - 0.16],
  };
  const s = Math.min(w, 1.9) * 0.3;
  return (
    <group>
      {danys.map((z, i) => at[z] && (
        <group key={z} position={at[z]}>
          {/* xapa enfonsada (pintura fosca i mat) */}
          <mesh rotation={[0.4 + i * 0.5, 0.8 + i * 1.1, 0.3]} scale={[1.25, 0.7, 0.9]} castShadow>
            <icosahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color={dark} roughness={0.95} flatShading />
          </mesh>
          {/* frec negre (plàstic / transferència de pintura) */}
          <mesh rotation={[1.2, 0.4 + i * 0.9, 0.9]} scale={[0.95, 0.5, 0.7]}>
            <icosahedronGeometry args={[s * 0.8, 0]} />
            <meshStandardMaterial color="#222227" roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
/* Mostra els danys només a partir de l'impacte PROPI del vehicle
   (l'empès s'abonyega quan el toquen, no quan xoquen els altres). */
function VehDamage({ el, tl, clock }: { el: El; tl: Timeline; clock: MutableRefObject<Clock> }) {
  const ref = useRef<THREE.Group>(null);
  const myVeh = useMemo(() => tl.vehs.find((v) => v.id === el.id) ?? null, [tl, el.id]);
  useFrame(() => {
    if (ref.current) ref.current.visible = !myVeh || clock.current.t >= myVeh.tImpact;
  });
  const danys = el.data?.danys ?? [];
  if (!danys.length) return null;
  return (
    <group ref={ref} visible={!myVeh}>
      <DamagePatches kind={el.kind} color={el.color || '#3B6BF5'} danys={danys} />
    </group>
  );
}

// Aplica transparència de "fantasma" a tot un grup.
function GhostWrap({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    ref.current?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.transparent = true; mat.opacity = 0.22; mat.depthWrite = false;
        m.material = mat; m.castShadow = false;
      }
    });
  }, []);
  return <group ref={ref}>{children}</group>;
}

/* ════════════════ Elements estàtics ════════════════ */
function SignPost({ kind, text }: { kind: string; text?: string }) {
  const isText = kind === 'velocitat' || kind === 'pes-max' || kind === 'altura-max';
  const tex = isText
    ? labelTex(text || KIND_EMOJI[kind] || '?', '#fff', '#15151C').tex
    : emojiTex(KIND_EMOJI[kind] || '🚧');
  return (
    <group>
      <mesh position={[0, 1.25, 0]} castShadow><cylinderGeometry args={[0.05, 0.06, 2.5, 8]} /><meshStandardMaterial color="#8A8F98" /></mesh>
      <sprite position={[0, 2.55, 0]} scale={[0.9, 0.9, 1]}><spriteMaterial map={tex} transparent /></sprite>
    </group>
  );
}
function Decal({ emoji, size = 1.7, opacity = 0.96 }: { emoji: string; size?: number; opacity?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={emojiTex(emoji, null)} transparent opacity={opacity} />
    </mesh>
  );
}
function Billboard({ text, bg, y = 1.6, s = 1 }: { text: string; bg: string; y?: number; s?: number }) {
  const { tex, aspect } = labelTex(text, bg);
  return <sprite position={[0, y, 0]} scale={[aspect * 0.62 * s, 0.62 * s, 1]}><spriteMaterial map={tex} transparent /></sprite>;
}
const SIGN_KINDS = new Set(['perill', 'corba-e', 'corba-d', 'nens', 'vianants-p', 'ciclistes', 'obres', 'semafor-p', 'rotonda-p', 'animals', 'estret', 'ressalt', 'stop', 'cediu', 'noentrar', 'prohibit', 'velocitat', 'no-avancar', 'no-gir-e', 'no-gir-d', 'no-estacionar', 'no-parar', 'pes-max', 'altura-max', 'sentit-o', 'oblig-d', 'oblig-e', 'carril-bici', 'vianants-o', 'rotonda-o', 'aparcament', 'hospital', 'bus-parada', 'pas-senyal']);
function StaticEl({ el }: { el: El }) {
  const k = el.kind;
  const sc = (Math.abs(el.scaleX) + Math.abs(el.scaleY)) / 2 || 1;
  const inner = (() => {
    if (SIGN_KINDS.has(k)) return <SignPost kind={k} text={el.text} />;
    switch (k) {
      case 'zebra': return (
        <group>{[-1.65, -1.1, -0.55, 0, 0.55, 1.1, 1.65].map((x) => (
          <Strip key={x} x={x} w={0.42} l={4.2} color={LINE} y={0.018} />
        ))}</group>
      );
      case 'm-linia': return <Strip w={0.32} l={5.2} color={LINE} y={0.018} />;
      case 'm-stop': return <Strip w={3.4} l={0.55} color={LINE} y={0.018} />;
      case 'm-cebrat': return (
        <group>{[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
          <Strip key={x} x={x} w={0.32} l={3.2} color={LINE} y={0.018} rotY={0.5} />
        ))}</group>
      );
      case 'm-recta': case 'm-recta-esq': case 'm-recta-dre': case 'm-esq': case 'm-dre': return (
        <group>
          {k !== 'm-esq' && k !== 'm-dre' && (<>
            <Strip w={0.34} l={2.6} color={LINE} y={0.018} />
            <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, -1.8]}><circleGeometry args={[0.55, 3]} /><meshBasicMaterial color={LINE} /></mesh>
          </>)}
          {(k === 'm-esq' || k === 'm-recta-esq') && <Strip x={-0.7} z={0.4} w={1.3} l={0.34} color={LINE} y={0.018} />}
          {(k === 'm-dre' || k === 'm-recta-dre') && <Strip x={0.7} z={0.4} w={1.3} l={0.34} color={LINE} y={0.018} />}
        </group>
      );
      case 'semafor': case 'semafor-v': return (
        <group>
          <mesh position={[0, 1.6, 0]} castShadow><cylinderGeometry args={[0.06, 0.07, 3.2, 8]} /><meshStandardMaterial color="#3A3D44" /></mesh>
          <mesh position={[0, 3.25, 0]} castShadow><boxGeometry args={[0.34, k === 'semafor' ? 0.95 : 0.7, 0.3]} /><meshStandardMaterial color="#15151C" /></mesh>
          <mesh position={[0, 3.55, 0.16]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color="#E0455A" emissive="#E0455A" emissiveIntensity={1.6} /></mesh>
          {k === 'semafor' && <mesh position={[0, 3.25, 0.16]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color="#F0B400" emissive="#repos" emissiveIntensity={0.2} /></mesh>}
          <mesh position={[0, k === 'semafor' ? 2.95 : 3.2, 0.16]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color="#1FB286" emissive="#1FB286" emissiveIntensity={0.4} /></mesh>
        </group>
      );
      case 'fanal': return (
        <group>
          <mesh position={[0, 2.4, 0]} castShadow><cylinderGeometry args={[0.07, 0.09, 4.8, 8]} /><meshStandardMaterial color="#5F636B" /></mesh>
          <mesh position={[0.55, 4.75, 0]}><boxGeometry args={[1.1, 0.08, 0.08]} /><meshStandardMaterial color="#5F636B" /></mesh>
          <mesh position={[1.05, 4.65, 0]}><sphereGeometry args={[0.18, 12, 10]} /><meshStandardMaterial color="#FFE08A" emissive="#FFE08A" emissiveIntensity={1.2} /></mesh>
        </group>
      );
      case 'arbre': return (
        <group>
          <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[0.16, 0.22, 2.2, 8]} /><meshStandardMaterial color="#6B4B2A" /></mesh>
          <mesh position={[0, 3.0, 0]} castShadow><sphereGeometry args={[1.5, 14, 12]} /><meshStandardMaterial color="#3FA66B" roughness={0.9} /></mesh>
          <mesh position={[0.7, 2.4, 0.4]} castShadow><sphereGeometry args={[0.9, 12, 10]} /><meshStandardMaterial color="#358F5B" roughness={0.9} /></mesh>
        </group>
      );
      case 'con': return (
        <group>
          <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.5, 0.05, 0.5]} /><meshStandardMaterial color="#E2541B" /></mesh>
          <mesh position={[0, 0.4, 0]} castShadow><coneGeometry args={[0.22, 0.75, 12]} /><meshStandardMaterial color="#FF7A1A" /></mesh>
        </group>
      );
      case 'tanca': return (
        <group>
          <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[2.4, 0.32, 0.07]} /><meshStandardMaterial color="#fff" /></mesh>
          {[-0.9, -0.3, 0.3, 0.9].map((x) => (
            <mesh key={x} position={[x, 0.55, 0.005]}><boxGeometry args={[0.28, 0.32, 0.075]} /><meshStandardMaterial color="#D62B2B" /></mesh>
          ))}
          <mesh position={[-1.05, 0.2, 0]} castShadow><boxGeometry args={[0.07, 0.45, 0.4]} /><meshStandardMaterial color="#9AA0AA" /></mesh>
          <mesh position={[1.05, 0.2, 0]} castShadow><boxGeometry args={[0.07, 0.45, 0.4]} /><meshStandardMaterial color="#9AA0AA" /></mesh>
        </group>
      );
      case 'edifici': return (
        <group>
          <mesh position={[0, 4.5, 0]} castShadow receiveShadow><boxGeometry args={[12, 9, 9]} /><meshStandardMaterial color="#C2C6CE" roughness={0.85} /></mesh>
          <mesh position={[0, 9.15, 0]}><boxGeometry args={[12.4, 0.3, 9.4]} /><meshStandardMaterial color="#8E939C" /></mesh>
        </group>
      );
      case 'illa': return (
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow><boxGeometry args={[0.7, 0.22, 2.6]} /><meshStandardMaterial color={GREEN} /></mesh>
      );

      /* Via personalitzada (les mateixes peces que al 2D, a escala real) */
      case 'c-recta': return (
        <group>
          <Strip w={7} l={8.9} color={ROAD_COL} y={0.024} />
          <Strip x={-3.5} w={0.15} l={8.9} color={LINE} y={0.028} />
          <Strip x={3.5} w={0.15} l={8.9} color={LINE} y={0.028} />
          {[-3.3, -1.1, 1.1, 3.3].map((z) => <Strip key={z} z={z} w={0.14} l={1.2} color={LINE} y={0.028} />)}
        </group>
      );
      case 'c-corba': {
        // Quart d'anella; l'angle coincideix amb la peça 2D (quadrant esq-sup).
        const ri = 80 / M, ro = 410 / M;
        return (
          <group>
            <mesh rotation-x={-Math.PI / 2} position-y={0.024} receiveShadow>
              <ringGeometry args={[ri, ro, 28, 1, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial color={ROAD_COL} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position-y={0.028}>
              <ringGeometry args={[ri, ri + 0.14, 28, 1, Math.PI / 2, Math.PI / 2]} />
              <meshBasicMaterial color={LINE} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position-y={0.028}>
              <ringGeometry args={[ro - 0.14, ro, 28, 1, Math.PI / 2, Math.PI / 2]} />
              <meshBasicMaterial color={LINE} />
            </mesh>
          </group>
        );
      }
      case 'c-cruilla': return (
        <group>
          <Strip w={7} l={14} color={ROAD_COL} y={0.024} />
          <Strip w={14} l={7} color={ROAD_COL} y={0.024} rotY={Math.PI / 2} />
          <Strip w={7} l={7} color={ROAD_DK} y={0.027} />
        </group>
      );
      case 'vorera': return (
        <mesh position={[0, 0.07, 0]} castShadow receiveShadow><boxGeometry args={[4.66, 0.14, 2.97]} /><meshStandardMaterial color="#CFCBC2" roughness={0.95} /></mesh>
      );
      case 'gespa': return <Strip w={4.66} l={2.97} color="#86A86B" y={0.02} />;
      case 'parking': return (
        <group>
          {[-3.6, -1.2, 1.2, 3.6].map((x) => <Strip key={x} x={x} w={0.14} l={5} color={LINE} y={0.024} />)}
          <Strip z={-2.5} w={7.2} l={0.14} color={LINE} y={0.024} />
        </group>
      );

      /* Mobiliari urbà */
      case 'pilona': return (
        <group>
          <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.09, 0.1, 0.85, 10]} /><meshStandardMaterial color="#3A3D44" /></mesh>
          <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.095, 0.095, 0.08, 10]} /><meshStandardMaterial color="#E0455A" emissive="#E0455A" emissiveIntensity={0.4} /></mesh>
        </group>
      );
      case 'contenidor': return (
        <group>
          <mesh position={[0, 0.62, 0]} castShadow><boxGeometry args={[1.4, 1.15, 1.1]} /><meshStandardMaterial color="#2F7D4F" roughness={0.7} /></mesh>
          <mesh position={[0, 1.24, 0]} castShadow><boxGeometry args={[1.44, 0.12, 1.14]} /><meshStandardMaterial color="#256741" /></mesh>
          {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 0.08, 0]}><cylinderGeometry args={[0.08, 0.08, 0.16, 8]} /><meshStandardMaterial color="#1A1A1E" /></mesh>)}
        </group>
      );
      case 'paperera': return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow><cylinderGeometry args={[0.22, 0.18, 0.8, 12]} /><meshStandardMaterial color="#5F636B" /></mesh>
          <mesh position={[0, 0.87, 0]}><cylinderGeometry args={[0.24, 0.24, 0.06, 12]} /><meshStandardMaterial color="#3A3D44" /></mesh>
        </group>
      );
      case 'banc': return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[1.7, 0.07, 0.5]} /><meshStandardMaterial color="#8A6A3F" /></mesh>
          <mesh position={[0, 0.78, -0.22]} rotation-x={-0.22} castShadow><boxGeometry args={[1.7, 0.5, 0.06]} /><meshStandardMaterial color="#8A6A3F" /></mesh>
          {[-0.7, 0.7].map((x) => <mesh key={x} position={[x, 0.22, 0]} castShadow><boxGeometry args={[0.08, 0.45, 0.45]} /><meshStandardMaterial color="#3A3D44" /></mesh>)}
        </group>
      );
      case 'marquesina': return (
        <group>
          {[-1.3, 1.3].map((x) => <mesh key={x} position={[x, 1.2, 0.5]} castShadow><cylinderGeometry args={[0.05, 0.05, 2.4, 8]} /><meshStandardMaterial color="#3A6B92" /></mesh>)}
          <mesh position={[0, 2.45, 0]} castShadow><boxGeometry args={[3.1, 0.1, 1.4]} /><meshStandardMaterial color="#3A6B92" /></mesh>
          <mesh position={[0, 1.25, -0.55]}><boxGeometry args={[3, 1.8, 0.05]} /><meshStandardMaterial color="#B8D6EC" transparent opacity={0.45} /></mesh>
          <mesh position={[0, 0.5, 0.1]} castShadow><boxGeometry args={[1.8, 0.07, 0.4]} /><meshStandardMaterial color="#5F636B" /></mesh>
        </group>
      );
      case 'biona': return (
        <group>
          <mesh position={[0, 0.62, 0]} castShadow><boxGeometry args={[3, 0.32, 0.06]} /><meshStandardMaterial color="#ADB3BC" metalness={0.5} roughness={0.4} /></mesh>
          {[-1.15, -0.4, 0.4, 1.15].map((x) => <mesh key={x} position={[x, 0.3, 0.04]} castShadow><boxGeometry args={[0.1, 0.62, 0.08]} /><meshStandardMaterial color="#7C828C" /></mesh>)}
        </group>
      );
      case 'mur': return (
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow><boxGeometry args={[2.5, 1.4, 0.28]} /><meshStandardMaterial color="#B98A66" roughness={0.9} /></mesh>
      );
      case 'impacte': return <Decal emoji="💥" size={2.2} />;
      case 'collisio': return <Decal emoji="❌" size={1.4} />;
      case 'taca': return (
        <mesh rotation-x={-Math.PI / 2} position-y={0.018}><circleGeometry args={[0.9, 22]} /><meshBasicMaterial color="#1E1E24" transparent opacity={0.55} /></mesh>
      );
      case 'derrapatge': return (
        <group>
          <Strip x={-0.7} w={0.22} l={4.4} color="#2A2A2E" y={0.016} opacity={0.6} />
          <Strip x={0.7} w={0.22} l={4.4} color="#2A2A2E" y={0.016} opacity={0.6} />
        </group>
      );
      case 'ferit': return <Decal emoji="🩹" size={1.3} />;
      case 'etiqueta': return <Billboard text={el.text || 'A'} bg="#E0455A" y={1.9} s={1.1} />;
      case 'text': return <Billboard text={el.text || 'Text'} bg="#15151C" y={1.6} />;
      case 'carrer': return <Billboard text={el.text || 'Carrer'} bg="#1565C0" y={2.4} s={1.2} />;
      case 'mesura': return <Billboard text={el.text || '0,0 m'} bg="#B6531F" y={0.9} s={0.8} />;
      case 'fletxa': return (
        <group>
          <Strip w={0.22} l={2.4} color="#15151C" y={0.02} />
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.022, -1.55]}><circleGeometry args={[0.42, 3]} /><meshBasicMaterial color="#15151C" /></mesh>
        </group>
      );
      case 'nord': return <Billboard text="N ↑" bg="#15151C" y={2.2} s={0.9} />;
      case 'via': return (
        <mesh rotation-x={-Math.PI / 2} position-y={0.02}><circleGeometry args={[0.28, 16]} /><meshBasicMaterial color="#F2B600" transparent opacity={0.8} /></mesh>
      );
      default: {
        const em = KIND_EMOJI[k];
        return em ? <Decal emoji={em} size={1.4} /> : null;
      }
    }
  })();
  if (!inner) return null;
  return (
    <group position={[toX(el.x), 0, toZ(el.y)]} rotation-y={yawOf(el.rotation)} scale={[sc, sc, sc]}>
      {inner}
    </group>
  );
}
// Fons (captura de mapa/foto) com a textura al terra.
function BgImage({ el }: { el: El }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!el.src) return;
    const t = new THREE.TextureLoader().load(el.src, () => setTex(t));
    return () => { t.dispose(); };
  }, [el.src]);
  if (!tex || !tex.image) return null;
  const img = tex.image as HTMLImageElement;
  const w = (img.width * Math.abs(el.scaleX)) / M, h = (img.height * Math.abs(el.scaleY)) / M;
  return (
    <group position={[toX(el.x), 0.003, toZ(el.y)]} rotation-y={yawOf(el.rotation)}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} transparent opacity={el.opacity ?? 1} />
      </mesh>
    </group>
  );
}

/* ════════════════ Animació (rig de física) ════════════════ */
type Clock = { t: number; playing: boolean; speed: number };
type Live = { kmh: Record<string, number>; skidD: Record<string, number> };
function Rig({ tl, vehRefs, clock, live, onTick }: {
  tl: Timeline;
  vehRefs: MutableRefObject<Map<string, THREE.Group>>;
  clock: MutableRefObject<Clock>;
  live: MutableRefObject<Live>;
  onTick: (t: number, playing: boolean) => void;
}) {
  useFrame((_, dt) => {
    const c = clock.current;
    if (c.playing) {
      c.t = Math.min(tl.tTotal, c.t + Math.min(dt, 0.08) * c.speed);
      if (c.t >= tl.tTotal) c.playing = false;
    }
    for (const v of tl.vehs) {
      const st = stateAt(v, c.t);
      const g = vehRefs.current.get(v.id); if (!g) continue;
      const bob = v.kind === 'vianant' && st.moving ? Math.abs(Math.sin(c.t * 7)) * 0.05 : 0;
      g.position.set(toX(st.x), bob, toZ(st.y));
      g.rotation.y = yawOf(st.rotation);
      live.current.kmh[v.id] = st.kmh;
      live.current.skidD[v.id] = st.skidD;
    }
    onTick(c.t, c.playing);
  });
  return null;
}
function SkidTrail3D({ v, live }: { v: TimelineVeh; live: MutableRefObject<Live> }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    const dVis = live.current.skidD[v.id] ?? 0;
    grp.current?.children.forEach((o) => { o.visible = dVis > 4 && (o.userData.d ?? 0) <= dVis; });
  });
  return (
    <group ref={grp}>
      {v.skid.map((s, i) => {
        const th = (s.rot * Math.PI) / 180, ox = (Math.cos(th) * 10) / M, oz = (Math.sin(th) * 10) / M;
        return (
          <Fragment key={i}>
            {[-1, 1].map((sgn) => (
              <group key={sgn} userData={{ d: s.d }} visible={false}
                position={[toX(s.x) + sgn * ox, 0.013, toZ(s.y) + sgn * oz]} rotation-y={yawOf(s.rot)}>
                <mesh rotation-x={-Math.PI / 2}>
                  <planeGeometry args={[0.18, 0.6]} />
                  <meshBasicMaterial color="#1E1E22" transparent opacity={0.55} />
                </mesh>
              </group>
            ))}
          </Fragment>
        );
      })}
    </group>
  );
}
// Trossos de plàstic/vidre que surten disparats a l'impacte.
const DEBRIS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + (i % 3) * 0.41;
  return {
    dx: Math.cos(a) * (1.2 + (i % 4) * 0.7),
    dz: Math.sin(a) * (1.2 + ((i + 2) % 4) * 0.7),
    vy: 1.6 + (i % 5) * 0.55,
    spin: 4 + (i % 3) * 3,
    s: 0.05 + (i % 3) * 0.035,
    glass: i % 3 === 0,
  };
});
function CrashFx3D({ tl, clock }: { tl: Timeline; clock: MutableRefObject<Clock> }) {
  const refs = useRef<{ ring: THREE.Mesh | null; flash: THREE.Sprite | null; debris: (THREE.Mesh | null)[] }[]>(
    tl.impacts.map(() => ({ ring: null, flash: null, debris: [] })),
  );
  const tex = useMemo(() => emojiTex('💥', null), []);
  useFrame(() => {
    const k = (clock.current.t - tl.tImpact) / 0.8;
    const vis = k >= 0 && k <= 1;
    for (const r of refs.current) {
      if (r.ring) {
        r.ring.visible = vis;
        if (vis) { const s = 0.6 + k * 7; r.ring.scale.set(s, s, 1); (r.ring.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k); }
      }
      if (r.flash) {
        r.flash.visible = vis && k < 0.5;
        if (vis) { const s = 1.2 + k * 3.2; r.flash.scale.set(s, s, 1); (r.flash.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - k * 2); }
      }
      r.debris.forEach((m, i) => {
        if (!m) return;
        const dRef = DEBRIS[i];
        m.visible = vis;
        if (vis) {
          // Paràbola balística simple: surt disparat, cau i queda al terra.
          const y = Math.max(0.04, 0.6 + dRef.vy * k - 5.2 * k * k);
          m.position.set(dRef.dx * Math.min(1, k * 1.6), y, dRef.dz * Math.min(1, k * 1.6));
          m.rotation.set(dRef.spin * k, dRef.spin * k * 0.7, dRef.spin * k * 1.3);
        }
      });
    }
  });
  return (
    <>
      {tl.impacts.map((p, i) => (
        <group key={i} position={[toX(p.x), 0.1, toZ(p.y)]}>
          <mesh ref={(m) => { refs.current[i].ring = m; }} rotation-x={-Math.PI / 2} visible={false}>
            <ringGeometry args={[0.86, 1, 36]} /><meshBasicMaterial color="#FF7A1A" transparent />
          </mesh>
          <sprite ref={(s) => { refs.current[i].flash = s; }} position={[0, 1, 0]} visible={false}>
            <spriteMaterial map={tex} transparent />
          </sprite>
          {DEBRIS.map((d, j) => (
            <mesh key={j} ref={(m) => { refs.current[i].debris[j] = m; }} visible={false} castShadow>
              <boxGeometry args={[d.s, d.s * 0.6, d.s]} />
              {d.glass
                ? <meshStandardMaterial color="#BFD9EC" metalness={0.4} roughness={0.1} />
                : <meshStandardMaterial color="#26262B" roughness={0.9} />}
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}
type CamMode = 'orbit' | 'chase' | 'driver' | 'top';
function CamRig({ ui, vehRefs }: {
  ui: MutableRefObject<{ mode: CamMode; follow: string | null }>;
  vehRefs: MutableRefObject<Map<string, THREE.Group>>;
}) {
  useFrame(({ camera }) => {
    const { mode, follow } = ui.current;
    if (mode === 'orbit') return;
    if (mode === 'top') {
      camera.position.lerp(new THREE.Vector3(0, 56, 0.6), 0.09);
      camera.lookAt(0, 0, 0);
      return;
    }
    const g = follow ? vehRefs.current.get(follow) : null; if (!g) return;
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(g.quaternion);
    if (mode === 'chase') {
      const dst = g.position.clone().addScaledVector(fwd, -10).add(new THREE.Vector3(0, 3.8, 0));
      camera.position.lerp(dst, 0.1);
      camera.lookAt(g.position.clone().addScaledVector(fwd, 5).add(new THREE.Vector3(0, 1, 0)));
    } else {
      camera.position.copy(g.position).addScaledVector(fwd, 0.2).add(new THREE.Vector3(0, 1.32, 0));
      camera.lookAt(g.position.clone().addScaledVector(fwd, 40).add(new THREE.Vector3(0, 1.1, 0)));
    }
  });
  return null;
}

/* ════════════════ Visor 3D ════════════════ */
export default function Croquis3D({ els, road, onClose }: { els: El[]; road: Road; onClose: () => void }) {
  const tl = useMemo(() => buildTimeline(els), [els]);
  const vehRefs = useRef(new Map<string, THREE.Group>());
  const clock = useRef<Clock>({ t: 0, playing: false, speed: 1 });
  const live = useRef<Live>({ kmh: {}, skidD: {} });
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recRef = useRef<{ rec: MediaRecorder; chunks: BlobPart[] } | null>(null);

  // Lletres A·B·C per ordre (igual que al 2D).
  const letters = useMemo(() => {
    const m: Record<string, string> = {}; let i = 0;
    for (const e of els) if (VEHICLES.includes(e.kind) && !e.ghost) { m[e.id] = String.fromCharCode(65 + i); i++; }
    return m;
  }, [els]);

  const [uiT, setUiT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState<CamMode>('orbit');
  const [follow, setFollow] = useState<string | null>(tl.vehs[0]?.id ?? null);
  const [recording, setRecording] = useState(false);
  const uiRef = useRef<{ mode: CamMode; follow: string | null }>({ mode: 'orbit', follow: tl.vehs[0]?.id ?? null });
  useEffect(() => { uiRef.current = { mode, follow }; }, [mode, follow]);

  function onTick(t: number, isPlaying: boolean) {
    setUiT((p) => (Math.abs(p - t) > 0.04 || (!isPlaying && p !== t) ? t : p));
    setPlaying((p) => (p === isPlaying ? p : isPlaying));
    if (!isPlaying && recRef.current && t >= tl.tTotal - 0.02) stopRecord();
  }
  function play() {
    if (!tl.vehs.length) { alert('Per recrear en 3D: marca al croquis la posició inicial (📍) i final (🏁) dels vehicles amb clic dret, i posa els km/h a "Dades del vehicle".'); return; }
    if (clock.current.t >= tl.tTotal - 0.05) clock.current.t = 0;
    clock.current.playing = true; setPlaying(true);
  }
  function pause() { clock.current.playing = false; setPlaying(false); }
  function restart() { clock.current.t = 0; clock.current.playing = false; setPlaying(false); setUiT(0); }
  function scrub(v: number) { clock.current.playing = false; clock.current.t = v; setUiT(v); setPlaying(false); }
  function setSpd(s: number) { clock.current.speed = s; setSpeed(s); }
  function startRecord() {
    const cv = glCanvasRef.current;
    if (!cv || typeof MediaRecorder === 'undefined') { alert('Aquest navegador no permet gravar vídeo (prova Chrome o Edge).'); return; }
    if (!tl.vehs.length) { alert('Marca posicions inicial i final dels vehicles per poder gravar la recreació.'); return; }
    const stream = cv.captureStream(30);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
    let rec: MediaRecorder;
    try { rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 9_000_000 }); } catch { rec = new MediaRecorder(stream); }
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const a = document.createElement('a');
      a.download = 'croquis-accident-3d.webm'; a.href = URL.createObjectURL(blob); a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    };
    recRef.current = { rec, chunks };
    rec.start(); setRecording(true);
    clock.current.t = 0; clock.current.playing = true; setPlaying(true);
  }
  function stopRecord() {
    const r = recRef.current; if (!r) return;
    recRef.current = null;
    setTimeout(() => r.rec.stop(), 350);
    setRecording(false);
  }

  const statics = els.filter((e) => !VEHICLES.includes(e.kind) && e.kind !== 'fons');
  const vehicles = els.filter((e) => VEHICLES.includes(e.kind));
  const bg = els.find((e) => e.kind === 'fons');
  const followLetter = follow ? letters[follow] : null;

  const btn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${A.line2}`, background: A.card, cursor: 'pointer', borderRadius: 11, padding: '8px 12px', fontFamily: A.display, fontWeight: 700, fontSize: 13, color: A.ink };
  const activeBtn: CSSProperties = { background: A.terracota, color: '#fff', border: `1px solid ${A.terracota}` };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 140, background: '#0E0F13', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior */}
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(14,15,19,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: A.terracota, display: 'grid', placeItems: 'center' }}><Ic name="car" size={18} color="#fff" sw={2.2} /></span>
        <div style={{ marginRight: 'auto' }}>
          <div style={{ fontFamily: A.display, fontWeight: 700, fontSize: 14.5, color: '#fff', letterSpacing: -0.2 }}>Recreació 3D</div>
          <Mono size={8.5} color="rgba(255,255,255,0.55)">El motor usa les velocitats reals dels vehicles</Mono>
        </div>
        {/* Càmeres */}
        {([['orbit', '🌐 Lliure'], ['chase', '🎥 Persecució'], ['driver', '👁 Conductor'], ['top', '🛩 Cenital']] as [CamMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} style={{ ...btn, ...(mode === m ? activeBtn : { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)' }) }}>{label}</button>
        ))}
        {(mode === 'chase' || mode === 'driver') && tl.vehs.length > 1 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {tl.vehs.map((v) => (
              <button key={v.id} onClick={() => setFollow(v.id)} style={{ ...btn, padding: '8px 10px', ...(follow === v.id ? activeBtn : { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)' }) }}>{letters[v.id] || '?'}</button>
            ))}
          </div>
        )}
        <button onClick={onClose} style={{ ...btn, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' }}><Ic name="x" size={15} color="#fff" /> Tancar</button>
      </header>

      {/* Escena */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Canvas
          shadows dpr={[1, 1.8]}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: [14, 17, 24], fov: 46 }}
          onCreated={({ gl }) => { glCanvasRef.current = gl.domElement; }}
        >
          <color attach="background" args={['#BFD4E6']} />
          <fog attach="fog" args={['#BFD4E6', 75, 190]} />
          <hemisphereLight args={['#D8E6F2', '#7A8468', 0.85]} />
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[28, 44, 18]} intensity={1.5} castShadow
            shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}
            shadow-camera-left={-50} shadow-camera-right={50}
            shadow-camera-top={50} shadow-camera-bottom={-50}
          />
          {/* Terra + via */}
          <mesh rotation-x={-Math.PI / 2} position-y={-0.002} receiveShadow>
            <planeGeometry args={[240, 200]} />
            <meshStandardMaterial color="#9DA882" roughness={1} />
          </mesh>
          {bg && <BgImage el={bg} />}
          {!bg && <Road3D road={road} />}
          {bg && bg.opacity !== 0 && <Road3D road={road} />}

          {/* Elements estàtics */}
          {statics.map((e) => <StaticEl key={e.id} el={e} />)}

          {/* Vehicles */}
          {vehicles.map((v) => {
            const model = <VehModel kind={v.kind} color={v.color || '#3B6BF5'} />;
            if (v.ghost) {
              return (
                <group key={v.id} position={[toX(v.x), 0, toZ(v.y)]} rotation-y={yawOf(v.rotation)}>
                  <GhostWrap>{model}</GhostWrap>
                </group>
              );
            }
            return (
              <group key={v.id}
                ref={(g) => { if (g) vehRefs.current.set(v.id, g); else vehRefs.current.delete(v.id); }}
                position={[toX(v.x), 0, toZ(v.y)]} rotation-y={yawOf(v.rotation)}>
                {model}
                <VehDamage el={v} tl={tl} clock={clock} />
                {letters[v.id] && <Billboard text={letters[v.id]} bg="#15151C" y={(DIMS[v.kind]?.h ?? 1.5) + 1.1} s={0.85} />}
              </group>
            );
          })}

          {/* Física + efectes */}
          {tl.vehs.length > 0 && (
            <>
              <Rig tl={tl} vehRefs={vehRefs} clock={clock} live={live} onTick={onTick} />
              {tl.vehs.map((v) => <SkidTrail3D key={'sk-' + v.id} v={v} live={live} />)}
              <CrashFx3D tl={tl} clock={clock} />
            </>
          )}
          <CamRig ui={uiRef} vehRefs={vehRefs} />
          <OrbitControls enabled={mode === 'orbit'} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={4} maxDistance={110} />
        </Canvas>

        {/* Cronòmetre */}
        {tl.impacts.length > 0 && (uiT > 0 || playing) && (
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(21,21,28,0.85)', color: '#fff', borderRadius: 999, padding: '7px 18px', fontFamily: A.mono, fontWeight: 700, fontSize: 15, letterSpacing: 1, pointerEvents: 'none' }}>
            {fmtRel(uiT, tl.tImpact)}
          </div>
        )}
        {/* Velocitats en directe */}
        {tl.vehs.length > 0 && (uiT > 0 || playing) && (
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 5, pointerEvents: 'none' }}>
            {tl.vehs.map((v) => (
              <div key={v.id} style={{ background: 'rgba(21,21,28,0.82)', color: '#fff', borderRadius: 9, padding: '5px 11px', fontFamily: A.mono, fontWeight: 700, fontSize: 12 }}>
                {letters[v.id] || '?'} · {Math.round(live.current.kmh[v.id] ?? 0)} km/h
              </div>
            ))}
          </div>
        )}

        {/* Barra de reproducció */}
        <div style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 9, background: A.card, border: `1px solid ${A.line2}`, borderRadius: 14, padding: '8px 12px', boxShadow: A.shadowLg, flexWrap: 'wrap', maxWidth: '95%' }}>
          <button onClick={playing ? pause : play} disabled={recording && !playing} style={{ ...btn, background: A.ink, color: '#fff', border: 'none' }}>{playing ? '⏸ Pausa' : '▶ Reproduir'}</button>
          <button onClick={restart} disabled={recording} style={btn} title="Reiniciar">⟲</button>
          <input type="range" min={0} max={Math.max(100, Math.round(tl.tTotal * 100))} value={Math.round(uiT * 100)} onChange={(e) => scrub(Number(e.target.value) / 100)} disabled={recording} style={{ width: 160, accentColor: A.terracota }} />
          <Mono size={10} color={A.inkSoft}>{uiT.toFixed(1)} / {tl.tTotal.toFixed(1)} s</Mono>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', paddingLeft: 6, borderLeft: `1px solid ${A.line}` }}>
            {[0.5, 1, 2].map((s) => <button key={s} onClick={() => setSpd(s)} style={{ ...btn, padding: '7px 9px', ...(speed === s ? { background: A.terraSoft, borderColor: A.terracota } : {}) }}>×{s}</button>)}
          </div>
          <button onClick={recording ? stopRecord : startRecord} style={{ ...btn, color: recording ? A.inkMuted : A.red, borderColor: A.redSoft }}>{recording ? '■ Aturar gravació' : '⬇ Gravar WebM'}</button>
        </div>

        {/* Pista per a la càmera de conductor */}
        {mode === 'driver' && followLetter && (
          <div style={{ position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)', background: 'rgba(21,21,28,0.75)', color: '#fff', borderRadius: 999, padding: '6px 14px', fontFamily: A.sans, fontWeight: 600, fontSize: 12, pointerEvents: 'none' }}>
            👁 Vista del conductor del vehicle {followLetter}
          </div>
        )}
      </div>
    </div>
  );
}
