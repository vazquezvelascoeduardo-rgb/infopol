// Motor de física de la recreació del croquis — compartit entre el
// reproductor 2D (Croquis.tsx) i el 3D (Croquis3D.tsx).
//
// Converteix l'escena (vehicles + fantasmes inicial/final + punts de pas
// + marques de col·lisió) en una línia de temps EN SEGONS REALS:
//   · Escala física: 1 carril (165 px) = 3,5 m.
//   · Cada vehicle viatja a la SEVA velocitat declarada (km/h) i tots
//     arriben al punt d'impacte al mateix instant (T impacte). Si un
//     vehicle té el trajecte curt, surt més tard (com si estigués aturat
//     a l'stop i arrenqués) — físicament coherent amb el croquis dibuixat.
//   · Després de l'impacte el vehicle decelera uniformement (frenada)
//     fins a aturar-se exactament a la posició final, deixant marca.
//   · Trajectòries amb punts de pas → corba suau (Catmull-Rom).

/* ════════════════ Model compartit ════════════════ */
export type Estat = 'mov' | 'parat' | 'estacionat';
export type VehData = {
  marca?: string; model?: string; color?: string; plate?: string;
  estat?: Estat; kmh?: string; note?: string;
};
export type El = {
  id: string; kind: string; x: number; y: number;
  rotation: number; scaleX: number; scaleY: number;
  color?: string; text?: string; data?: VehData; ghost?: boolean; phase?: 'inicial' | 'final';
  src?: string; locked?: boolean; opacity?: number; // fons (mapa/foto)
  parent?: string; // vehicle d'origen (fantasmes inicial/final i punts de pas)
};
export type Road = 'recta' | 'doble' | 'autovia' | 'cruilla' | 'te' | 'rotonda' | 'corba' | 'cap';

export const BOARD = { w: 1680, h: 1120 };
export const PX_PER_M = 165 / 3.5; // 1 carril (165 px) = 3,5 m
export const VEHICLES = ['cotxe', 'furgo', 'camio', 'trailer', 'bus', 'moto', 'bici', 'patinet', 'vianant', 'tractor', 'ambulancia', 'policia'];

// Emoji per defecte de cada element (el 3D el fa servir per als cartells
// i com a fallback de qualsevol element sense model propi).
export const KIND_EMOJI: Record<string, string> = {
  cotxe: '🚗', furgo: '🚐', camio: '🚚', trailer: '🚛', bus: '🚌', moto: '🏍️',
  bici: '🚲', patinet: '🛴', vianant: '🚶', tractor: '🚜', ambulancia: '🚑', policia: '🚓',
  perill: '⚠️', 'corba-e': '↰', 'corba-d': '↱', nens: '🧒', 'vianants-p': '🚶',
  ciclistes: '🚲', obres: '🚧', 'semafor-p': '🚦', 'rotonda-p': '🔄', animals: '🦌',
  estret: '🔺', ressalt: '⛰️',
  stop: '🛑', cediu: '🔻', noentrar: '⛔', prohibit: '🚫', velocitat: '50',
  'no-avancar': '🚗', 'no-gir-e': '↰', 'no-gir-d': '↱', 'no-estacionar': '🅿️',
  'no-parar': '✋', 'pes-max': '⚖️', 'altura-max': '📏',
  'sentit-o': '⬆️', 'oblig-d': '➡️', 'oblig-e': '⬅️', 'carril-bici': '🚲',
  'vianants-o': '🚶', 'rotonda-o': '🔄', aparcament: '🅿️', hospital: '🏥',
  'bus-parada': '🚌', 'pas-senyal': '🚸',
  'm-recta': '⬆️', 'm-esq': '↖️', 'm-dre': '↗️', 'm-recta-esq': '⬆️', 'm-recta-dre': '⬆️',
  'm-stop': '🟥', 'm-cediu': '🔻', zebra: '🦓', 'm-pasbici': '🚲', 'm-cebrat': '🚧',
  'm-bici': '🚲', 'm-minusvalid': '♿', 'm-linia': '➖',
  semafor: '🚦', 'semafor-v': '🚥', fanal: '💡', arbre: '🌳', con: '🚧',
  tanca: '🚧', edifici: '🏢', illa: '🟩',
  fletxa: '↗️', derrapatge: '〰️', impacte: '💥', taca: '🛢️', ferit: '🩹',
  collisio: '❌', mesura: '📐', etiqueta: '🅰️', text: '🔤', nord: '🧭', carrer: '🪧',
  via: '🟡',
};

/* ════════════════ Geometria ════════════════ */
export type Pt = { x: number; y: number };
const kmh2pxs = (k: number) => (k / 3.6) * PX_PER_M; // km/h → px/s
const pxs2kmh = (v: number) => (v / PX_PER_M) * 3.6;

export const easeOutCubic = (u: number) => 1 - Math.pow(1 - u, 3);
export function lerpAngle(a: number, b: number, u: number) {
  const d = ((b - a + 540) % 360) - 180; return a + d * u;
}
// Rumb en graus (0 = amunt, sentit horari de pantalla).
export const headingDeg = (dx: number, dy: number, fb: number) =>
  (Math.abs(dx) + Math.abs(dy) > 0.4 ? Math.atan2(dx, -dy) * 180 / Math.PI : fb);

// Corba Catmull-Rom densa a partir d'una polilínia de control.
function smoothPath(raw: Pt[], seg = 16): Pt[] {
  if (raw.length <= 2) return raw.slice();
  const out: Pt[] = [];
  for (let i = 0; i < raw.length - 1; i++) {
    const p0 = raw[Math.max(0, i - 1)], p1 = raw[i], p2 = raw[i + 1], p3 = raw[Math.min(raw.length - 1, i + 2)];
    for (let j = 0; j < seg; j++) {
      const u = j / seg, u2 = u * u, u3 = u2 * u;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
      });
    }
  }
  out.push(raw[raw.length - 1]);
  return out;
}
function polyLen(p: Pt[]): number {
  let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
  return l;
}
// Punt + rumb a una distància d al llarg de la polilínia.
function pointAt(p: Pt[], d: number, fbRot: number): { x: number; y: number; rot: number } {
  if (p.length === 0) return { x: 0, y: 0, rot: fbRot };
  if (p.length === 1 || d <= 0) {
    const dir = p.length > 1 ? p[1] : p[0];
    return { x: p[0].x, y: p[0].y, rot: headingDeg(dir.x - p[0].x, dir.y - p[0].y, fbRot) };
  }
  let acc = 0;
  for (let i = 1; i < p.length; i++) {
    const sl = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
    if (acc + sl >= d && sl > 0) {
      const u = (d - acc) / sl;
      return {
        x: p[i - 1].x + (p[i].x - p[i - 1].x) * u,
        y: p[i - 1].y + (p[i].y - p[i - 1].y) * u,
        rot: headingDeg(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y, fbRot),
      };
    }
    acc += sl;
  }
  const a = p[p.length - 2], b = p[p.length - 1];
  return { x: b.x, y: b.y, rot: headingDeg(b.x - a.x, b.y - a.y, fbRot) };
}

/* ════════════════ Línia de temps ════════════════ */
// Velocitat per defecte quan l'agent no n'ha declarat cap (km/h).
const DEF_KMH: Record<string, number> = { vianant: 5, bici: 16, patinet: 20, tractor: 25 };
const defKmh = (k: string) => DEF_KMH[k] ?? 45;

export type SkidSample = { x: number; y: number; rot: number; d: number };
export type TimelineVeh = {
  id: string; kind: string;
  declaredKmh: number | null;
  vPre: number;   // px/s constant abans de l'impacte
  vPost: number;  // px/s a l'instant de l'impacte (fase de frenada)
  pre: Pt[]; post: Pt[];
  preLen: number; postLen: number;
  tStart: number;  // s en què comença a moure's
  tImpact: number; // s de l'impacte (compartit per tota l'escena)
  tEnd: number;    // s en què queda aturat
  hasImpact: boolean;
  impactPt: Pt | null;
  rotFinal: number;
  spinExtra: number; // graus de trompo extra post-impacte
  skid: SkidSample[];
};
export type VehState = { x: number; y: number; rotation: number; kmh: number; skidD: number; moving: boolean };
export type Timeline = { vehs: TimelineVeh[]; tImpact: number; tTotal: number; impacts: Pt[] };

export function buildTimeline(els: El[]): Timeline {
  const inits = els.filter((e) => e.ghost && e.phase === 'inicial');
  const finals = els.filter((e) => e.ghost && e.phase === 'final');
  const cols = els.filter((e) => e.kind === 'collisio');
  const vias = els.filter((e) => e.kind === 'via');
  const viaOf = (vehId: string) =>
    vias.filter((v) => v.parent === vehId)
      .sort((a, b) => parseInt(a.id.replace('el-', '')) - parseInt(b.id.replace('el-', '')))
      .map((v) => ({ x: v.x, y: v.y }));

  type Raw = {
    veh: El; pre: Pt[]; post: Pt[]; preLen: number; postLen: number;
    hasImpact: boolean; impactPt: Pt | null; rotFinal: number; vPre: number; declared: number | null;
  };
  const raws: Raw[] = [];
  for (const v of els) {
    if (!VEHICLES.includes(v.kind) || v.ghost) continue;
    if (v.data?.estat === 'parat' || v.data?.estat === 'estacionat') continue;
    const g0 = inits.find((i) => i.parent === v.id); if (!g0) continue;
    const gf = finals.find((i) => i.parent === v.id);
    const mids = viaOf(v.id);
    let pre: Pt[], post: Pt[], impactPt: Pt | null, rotFinal: number;
    if (gf) {
      pre = smoothPath([{ x: g0.x, y: g0.y }, ...mids, { x: v.x, y: v.y }]);
      post = smoothPath([{ x: v.x, y: v.y }, { x: gf.x, y: gf.y }]);
      impactPt = { x: v.x, y: v.y }; rotFinal = gf.rotation;
    } else {
      // Compatibilitat: sense fantasma final → la marca ❌ propera fa d'impacte.
      const p1 = { x: v.x, y: v.y }, mid = { x: (g0.x + p1.x) / 2, y: (g0.y + p1.y) / 2 };
      let best = 1e9, wp: Pt | null = null;
      for (const c of cols) { const d = Math.hypot(c.x - mid.x, c.y - mid.y); if (d < best) { best = d; wp = { x: c.x, y: c.y }; } }
      if (wp && best <= 340) {
        pre = smoothPath([{ x: g0.x, y: g0.y }, ...mids, wp]);
        post = smoothPath([wp, p1]);
        impactPt = wp;
      } else {
        pre = smoothPath([{ x: g0.x, y: g0.y }, ...mids, p1]);
        post = []; impactPt = null;
      }
      rotFinal = v.rotation;
    }
    const declared = parseInt(v.data?.kmh || '') || null;
    raws.push({
      veh: v, pre, post, preLen: polyLen(pre), postLen: polyLen(post),
      hasImpact: !!impactPt, impactPt, rotFinal,
      vPre: kmh2pxs(declared ?? defKmh(v.kind)), declared,
    });
  }

  // T impacte global: el vehicle que triga més marca el ritme; la resta
  // surt amb retard perquè tothom xoqui al mateix instant.
  let tImpact = 0;
  for (const r of raws) tImpact = Math.max(tImpact, r.preLen / r.vPre);
  tImpact = Math.min(14, Math.max(1.2, tImpact || 3));
  // Si algun vehicle no hi arriba pel límit de 14 s, li apugem la velocitat.
  for (const r of raws) if (r.preLen / r.vPre > tImpact) r.vPre = r.preLen / tImpact;

  const vehs: TimelineVeh[] = raws.map((r) => {
    const tPre = r.preLen / r.vPre;
    const vPost = Math.max(r.vPre * 0.55, kmh2pxs(8));
    const tPost = r.postLen > 0 ? (2 * r.postLen) / vPost : 0;
    // Trompo extra si el gir post-impacte és gran (xoc lateral).
    const hEnd = pointAt(r.pre, r.preLen - 0.1, r.rotFinal).rot;
    const dAng = ((r.rotFinal - hEnd + 540) % 360) - 180;
    const spinExtra = Math.abs(dAng) > 70 ? Math.sign(dAng || 1) * 16 : 0;
    // Mostres del rastre de frenada (cada ~7 px del tram post-impacte).
    const skid: SkidSample[] = [];
    for (let d = 0; d <= r.postLen; d += 7) {
      const p = pointAt(r.post, d, r.rotFinal);
      skid.push({ x: p.x, y: p.y, rot: p.rot, d });
    }
    return {
      id: r.veh.id, kind: r.veh.kind, declaredKmh: r.declared,
      vPre: r.vPre, vPost,
      pre: r.pre, post: r.post, preLen: r.preLen, postLen: r.postLen,
      tStart: Math.max(0, tImpact - tPre), tImpact, tEnd: tImpact + tPost,
      hasImpact: r.hasImpact, impactPt: r.impactPt, rotFinal: r.rotFinal,
      spinExtra, skid,
    };
  });

  // Punts d'impacte únics (per al destell).
  const impacts: Pt[] = [];
  for (const v of vehs) {
    if (!v.impactPt) continue;
    if (!impacts.some((p) => Math.hypot(p.x - v.impactPt!.x, p.y - v.impactPt!.y) < 30)) impacts.push(v.impactPt);
  }
  const tTotal = Math.max(tImpact, ...vehs.map((v) => v.tEnd)) + 1.0;
  return { vehs, tImpact, tTotal, impacts };
}

// Sacsejada de l'impacte (decau en ~0,45 s).
function shake(t: number, tImp: number) {
  const dt = t - tImp;
  if (dt < 0 || dt > 0.45) return { dx: 0, dy: 0, dr: 0 };
  const k = dt / 0.45, decay = (1 - k) * (1 - k), ph = dt * 90;
  return { dx: Math.sin(ph) * 8 * decay, dy: Math.cos(ph * 1.27) * 5 * decay, dr: Math.sin(ph * 0.9) * 6 * decay };
}

// Estat (posició, gir, velocitat, frenada) d'un vehicle a l'instant t (s).
export function stateAt(v: TimelineVeh, t: number): VehState {
  const fbRot = v.rotFinal;
  // Abans de començar: quiet a la posició inicial.
  if (t <= v.tStart) {
    const p = pointAt(v.pre, 0, fbRot);
    return { x: p.x, y: p.y, rotation: p.rot, kmh: 0, skidD: 0, moving: false };
  }
  // Fase prèvia: velocitat constant per la corba.
  if (t < v.tImpact || v.post.length === 0) {
    const d = Math.min(v.preLen, v.vPre * (t - v.tStart));
    const p = pointAt(v.pre, d, fbRot);
    let { x, y } = p;
    // Vianants: lleu balanceig lateral (passes).
    if (v.kind === 'vianant') {
      const th = (p.rot * Math.PI) / 180, sway = Math.sin(d / 13) * 2.5;
      x += Math.cos(th) * sway; y += Math.sin(th) * sway;
    }
    const done = d >= v.preLen - 0.5 && v.post.length === 0;
    return { x, y, rotation: done ? v.rotFinal : p.rot, kmh: done ? 0 : pxs2kmh(v.vPre), skidD: 0, moving: !done };
  }
  // Fase post-impacte: deceleració uniforme fins a aturar-se al final.
  const a = (v.vPost * v.vPost) / (2 * Math.max(1, v.postLen)); // px/s²
  const tau = Math.min(t - v.tImpact, v.vPost / a);
  const d2 = Math.min(v.postLen, v.vPost * tau - (a * tau * tau) / 2);
  const p = pointAt(v.post, d2, fbRot);
  const k = v.postLen > 0 ? d2 / v.postLen : 1;
  const h0 = pointAt(v.post, 0.1, fbRot).rot;
  let rot = lerpAngle(h0, v.rotFinal, easeOutCubic(k));
  rot += v.spinExtra * Math.sin(Math.min(1, k * 1.15) * Math.PI) * (1 - k);
  const sh = shake(t, v.tImpact);
  const speed = Math.max(0, v.vPost - a * tau);
  return {
    x: p.x + sh.dx, y: p.y + sh.dy, rotation: rot + sh.dr,
    kmh: pxs2kmh(speed), skidD: d2, moving: speed > 1,
  };
}

// Factor de pas del temps (slow-motion ×0,3 al voltant de l'impacte
// quan la càmera cinematogràfica està activa).
export function simRateAt(tl: Timeline, t: number, cine: boolean): number {
  if (!cine || !tl.impacts.length) return 1;
  return Math.abs(t - tl.tImpact) <= 0.45 ? 0.3 : 1;
}

// Vista cinematogràfica: zoom suau cap al punt d'impacte al voltant de T.
type View = { scale: number; x: number; y: number };
const smooth01 = (u: number) => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
export function cineViewAt(tl: Timeline, t: number, base: View): View {
  if (!tl.impacts.length) return base;
  const t0 = tl.tImpact - 1.2, t1 = tl.tImpact + 1.1, ramp = 0.55;
  let u = 0;
  if (t >= t0 && t <= t1) u = Math.min(smooth01((t - t0) / ramp), smooth01((t1 - t) / ramp));
  if (u <= 0.001) return base;
  const imp = tl.impacts[0];
  const cX = base.x + (BOARD.w * base.scale) / 2, cY = base.y + (BOARD.h * base.scale) / 2;
  const scale = base.scale * (1 + 0.95 * u);
  const fx = BOARD.w / 2 + (imp.x - BOARD.w / 2) * u;
  const fy = BOARD.h / 2 + (imp.y - BOARD.h / 2) * u;
  return { scale, x: cX - fx * scale, y: cY - fy * scale };
}

// "T −1,2 s" / "T +0,8 s" respecte de l'impacte.
export function fmtRel(t: number, tImpact: number): string {
  const d = t - tImpact;
  return `T ${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(1)} s`;
}
