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
  // Fase 3 — dades completes per a l'informe.
  maniobra?: string;   // què feia el vehicle (gir, avançament, marxa enrere…)
  ocupants?: string;   // nombre d'ocupants
  conductor?: string;  // nom / TIP del conductor
  danys?: string[];    // zones colpejades (front, lat-e, rear-d…)
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
// Massa aproximada (kg) per a la transferència de quantitat de moviment.
const MASS: Record<string, number> = {
  vianant: 80, bici: 95, patinet: 95, moto: 230, cotxe: 1350, policia: 1500,
  furgo: 2300, ambulancia: 2600, camio: 10000, trailer: 19000, bus: 12500, tractor: 4800,
};
// Mitja llargada del vehicle en px (per detectar el CONTACTE físic real
// entre carrosseries, no entre centres).
const HALF_LEN: Record<string, number> = {
  cotxe: 44, furgo: 46, camio: 90, trailer: 121, bus: 66, moto: 22,
  bici: 19, patinet: 20, vianant: 13, tractor: 50, ambulancia: 48, policia: 46,
};
const halfLen = (k: string) => HALF_LEN[k] ?? 44;

export type SkidSample = { x: number; y: number; rot: number; d: number };
export type TimelineVeh = {
  id: string; kind: string;
  declaredKmh: number | null;
  vPre: number;   // px/s constant abans de l'impacte (0 si estava aturat)
  vPost: number;  // px/s a l'instant de l'impacte (fase de frenada/empenta)
  pre: Pt[]; post: Pt[];
  preLen: number; postLen: number;
  tStart: number;  // s en què comença a moure's
  tImpact: number; // s de l'impacte (compartit per tota l'escena)
  tEnd: number;    // s en què queda aturat
  hasImpact: boolean;
  impactPt: Pt | null;
  rotImpact: number; // orientació del vehicle a l'instant de l'impacte
  rotFinal: number;
  spinExtra: number; // graus de trompo extra post-impacte
  pushed: boolean;   // estava aturat/estacionat i el xoc l'ha desplaçat
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
    hasImpact: boolean; impactPt: Pt | null; rotFinal: number; vPre: number;
    declared: number | null; pushed: boolean;
  };
  const raws: Raw[] = [];
  for (const v of els) {
    if (!VEHICLES.includes(v.kind) || v.ghost) continue;
    const gf = finals.find((i) => i.parent === v.id);
    const g0 = inits.find((i) => i.parent === v.id);
    const parked = v.data?.estat === 'parat' || v.data?.estat === 'estacionat';
    // Vehicle quiet que rep el xoc: estava aturat/estacionat (o simplement
    // no té posició inicial) i té posició final → s'espera QUIET fins que
    // el col·lisionen i llavors surt empès fins a la posició final.
    if (gf && (parked || !g0)) {
      raws.push({
        veh: v, pre: [{ x: v.x, y: v.y }], post: smoothPath([{ x: v.x, y: v.y }, { x: gf.x, y: gf.y }]),
        preLen: 0, postLen: Math.hypot(gf.x - v.x, gf.y - v.y),
        hasImpact: true, impactPt: { x: v.x, y: v.y }, rotFinal: gf.rotation,
        vPre: 0, declared: null, pushed: true,
      });
      continue;
    }
    if (!g0 || parked) continue;
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
      vPre: kmh2pxs(declared ?? defKmh(v.kind)), declared, pushed: false,
    });
  }

  // T impacte global: el vehicle que triga més marca el ritme; la resta
  // surt amb retard perquè tothom xoqui al mateix instant.
  let tImpact = 0;
  for (const r of raws) if (r.vPre > 0) tImpact = Math.max(tImpact, r.preLen / r.vPre);
  tImpact = Math.min(14, Math.max(1.2, tImpact || 3));
  // Si algun vehicle no hi arriba pel límit de 14 s, li apugem la velocitat.
  for (const r of raws) if (r.vPre > 0 && r.preLen / r.vPre > tImpact) r.vPre = r.preLen / tImpact;

  // ── Física de l'impacte: transferència de quantitat de moviment ──
  // Cada vehicle amb impacte busca la seva "parella" de xoc (l'impacte
  // més proper d'un altre vehicle) i la velocitat de sortida es calcula
  // amb un xoc inelàstic projectat sobre la seva direcció de sortida:
  //   v' = (m·v·cosθ_propi + m_altre·v_altre·cosθ_altre) / (m + m_altre)
  // Així un camió a 50 arrossega un cotxe aturat amb força, un xoc
  // frontal entre iguals gairebé els atura, i un cotxe que colpeja un
  // mur de massa... no n'hi ha: sense parella, perd un 45% i frena.
  type Work = Raw & { mass: number; rotImpact: number; outDir: number; vPost: number };
  const works: Work[] = raws.map((r) => {
    const rotImpact = r.pushed
      ? r.veh.rotation
      : pointAt(r.pre, Math.max(0, r.preLen - 0.1), r.rotFinal).rot;
    const outDir = r.postLen > 0
      ? pointAt(r.post, Math.min(3, r.postLen), r.rotFinal).rot
      : rotImpact;
    return { ...r, mass: MASS[r.veh.kind] ?? 1300, rotImpact, outDir, vPost: 0 };
  });
  // Quantitat de moviment entre vehicles EN MOVIMENT (parelles de xoc).
  for (const r of works) {
    if (r.pushed || r.postLen <= 0) continue;
    let partner: Work | null = null, bd = 240;
    if (r.impactPt) {
      for (const o of works) {
        if (o === r || !o.impactPt) continue;
        const d = Math.hypot(o.impactPt.x - r.impactPt.x, o.impactPt.y - r.impactPt.y);
        if (d < bd) { bd = d; partner = o; }
      }
    }
    if (partner) {
      const cosSelf = Math.cos(((r.rotImpact - r.outDir) * Math.PI) / 180);
      const cosP = Math.cos(((partner.rotImpact - r.outDir) * Math.PI) / 180);
      const v2 = (r.mass * r.vPre * cosSelf + partner.mass * partner.vPre * cosP) / (r.mass + partner.mass);
      r.vPost = Math.max(Math.abs(v2), kmh2pxs(5));
    } else {
      r.vPost = Math.max(r.vPre * 0.55, kmh2pxs(8));
    }
    // Garantia: arribar a la posició final en menys de 4 s.
    r.vPost = Math.max(r.vPost, (2 * r.postLen) / 4);
  }

  const mkVeh = (r: Work, tHit: number): TimelineVeh => {
    const tPre = r.vPre > 0 ? r.preLen / r.vPre : 0;
    const crushDelay = r.pushed ? 0.07 : 0; // fase de deformació abans de sortir empès
    const tPost = r.postLen > 0 ? crushDelay + (2 * r.postLen) / r.vPost : 0;
    // Trompo: més gir com més angle de sortida i més velocitat d'impacte.
    const dAng = ((r.rotFinal - r.rotImpact + 540) % 360) - 180;
    const spinExtra = Math.abs(dAng) > 45
      ? Math.sign(dAng || 1) * Math.min(26, Math.abs(dAng) * 0.16 + pxs2kmh(r.vPost) * 0.08)
      : 0;
    // Mostres del rastre de frenada (cada ~7 px del tram post-impacte).
    const skid: SkidSample[] = [];
    for (let d = 0; d <= r.postLen; d += 7) {
      const p = pointAt(r.post, d, r.rotFinal);
      skid.push({ x: p.x, y: p.y, rot: p.rot, d });
    }
    return {
      id: r.veh.id, kind: r.veh.kind, declaredKmh: r.declared,
      vPre: r.vPre, vPost: r.vPost,
      pre: r.pre, post: r.post, preLen: r.preLen, postLen: r.postLen,
      tStart: r.pushed ? tHit : Math.max(0, tImpact - tPre),
      tImpact: tHit, tEnd: tHit + tPost,
      hasImpact: r.hasImpact, impactPt: r.impactPt,
      rotImpact: r.rotImpact, rotFinal: r.rotFinal, spinExtra, pushed: r.pushed, skid,
    };
  };

  // 1) Vehicles en moviment: impacten tots a T impacte global.
  const movingVehs = works.filter((w) => !w.pushed).map((w) => mkVeh(w, tImpact));

  // 2) Vehicles empesos: el seu instant d'arrencada és el moment del
  //    CONTACTE FÍSIC real — quan la carrosseria del vehicle que ve els
  //    toca (es recorre la trajectòria sencera del que colpeja, fase
  //    prèvia I posterior, buscant el primer frec entre cossos).
  const pushedVehs = works.filter((w) => w.pushed).map((w) => {
    let tHit = tImpact, found = false;
    let bestMin = 1e9, bestMinT = tImpact;
    let striker: TimelineVeh | null = null, strikerAtMin: TimelineVeh | null = null;
    for (const s of movingVehs) {
      if (s.vPre <= 0) continue;
      const contact = halfLen(s.kind) + halfLen(w.veh.kind) * 0.85;
      const tMax = Math.max(s.tEnd, s.tImpact) + 0.3;
      for (let t = s.tStart; t <= tMax; t += 0.04) {
        const st = stateAt(s, t);
        const dist = Math.hypot(st.x - w.veh.x, st.y - w.veh.y);
        if (dist < bestMin) { bestMin = dist; bestMinT = t; strikerAtMin = s; }
        if (dist <= contact) {
          if (!found || t < tHit) { tHit = t; striker = s; }
          found = true;
          break;
        }
      }
    }
    if (!found && bestMin < 280) { tHit = bestMinT; striker = strikerAtMin; }
    // Velocitat d'empenta: moment que transfereix el vehicle que colpeja
    // A L'INSTANT DEL CONTACTE (pot venir frenant), projectat sobre la
    // direcció de sortida de l'empès.
    if (striker) {
      const st = stateAt(striker, tHit);
      const vS = kmh2pxs(st.kmh);
      const cosP = Math.max(0.2, Math.cos(((st.rotation - w.outDir) * Math.PI) / 180));
      w.vPost = Math.max((striker ? (MASS[striker.kind] ?? 1300) : 1300) * vS * cosP / ((MASS[striker.kind] ?? 1300) + w.mass), kmh2pxs(5));
    } else {
      w.vPost = Math.max((2 * w.postLen) / 1.4, kmh2pxs(6));
    }
    w.vPost = Math.max(w.vPost, (2 * w.postLen) / 4);
    return mkVeh(w, tHit);
  });

  const vehs = [...movingVehs, ...pushedVehs];

  // Punts d'impacte únics (per al destell).
  const impacts: Pt[] = [];
  for (const v of vehs) {
    if (!v.impactPt) continue;
    if (!impacts.some((p) => Math.hypot(p.x - v.impactPt!.x, p.y - v.impactPt!.y) < 80)) impacts.push(v.impactPt);
  }
  const tTotal = Math.max(tImpact, ...vehs.map((v) => v.tEnd)) + 1.0;
  return { vehs, tImpact, tTotal, impacts };
}

// Sacsejada de l'impacte (decau en ~0,45 s); amplitud segons la violència.
function shake(t: number, tImp: number, amp = 1) {
  const dt = t - tImp;
  if (dt < 0 || dt > 0.45) return { dx: 0, dy: 0, dr: 0 };
  const k = dt / 0.45, decay = (1 - k) * (1 - k), ph = dt * 90;
  return {
    dx: Math.sin(ph) * 8 * decay * amp,
    dy: Math.cos(ph * 1.27) * 5 * decay * amp,
    dr: Math.sin(ph * 0.9) * 6 * decay * amp,
  };
}

// Estat (posició, gir, velocitat, frenada) d'un vehicle a l'instant t (s).
export function stateAt(v: TimelineVeh, t: number): VehState {
  const fbRot = v.rotFinal;
  // Abans de començar: quiet a la posició inicial (amb la SEVA orientació
  // si estava aturat/estacionat, no la del fantasma final).
  if (t <= v.tStart) {
    const p = pointAt(v.pre, 0, fbRot);
    return { x: p.x, y: p.y, rotation: v.pushed ? v.rotImpact : p.rot, kmh: 0, skidD: 0, moving: false };
  }
  // Fase prèvia: velocitat constant per la corba.
  if ((t < v.tImpact || v.post.length === 0) && !v.pushed) {
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
  // Els vehicles empesos tenen una breu fase de deformació (70 ms) abans
  // de començar a desplaçar-se.
  const crushDelay = v.pushed ? 0.07 : 0;
  const a = (v.vPost * v.vPost) / (2 * Math.max(1, v.postLen)); // px/s²
  const tau = Math.min(Math.max(0, t - v.tImpact - crushDelay), v.vPost / a);
  const d2 = Math.min(v.postLen, v.vPost * tau - (a * tau * tau) / 2);
  const p = pointAt(v.post, d2, fbRot);
  const k = v.postLen > 0 ? d2 / v.postLen : 1;
  let rot = lerpAngle(v.rotImpact, v.rotFinal, easeOutCubic(k));
  // Trompo amb sobrepassada i retorn amortit (xoc lateral violent).
  rot += v.spinExtra * Math.sin(Math.min(1, k * 1.5) * Math.PI) * Math.pow(1 - k, 1.15);
  const amp = Math.min(1.8, Math.max(0.5, pxs2kmh(v.vPost) / 45));
  const sh = shake(t, v.tImpact, amp);
  const speed = tau > 0 ? Math.max(0, v.vPost - a * tau) : 0;
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
