import { BOARD, type El } from './croquisPhysics';

export type Boca = { x: number; y: number; angle: number; width: number; id: string; index: number };
export type Tracat = { points: number[]; tension?: number };
export const PECES: Record<string, NonNullable<El['roadPiece']>> = {
  'c-recta': 'recta', 'c-corba': 'dreta90', 'c-corba-e': 'esquerra90',
  'c-corba-suau': 'dreta45', 'c-corba-suau-e': 'esquerra45',
  'c-cruilla': 'creu', 'c-te': 'te', 'c-y': 'y', 'c-ramal': 'y',
};
export const esCalcada = (el: El) => el.kind === 'via-peca' || el.kind === 'via-lliure' || el.kind in PECES;
export function limitsCalcada(els: El[]) {
  let x = 0, y = 0, right = BOARD.w, bottom = BOARD.h;
  for (const el of els.filter((e) => esCalcada(e) && !e.hidden)) {
    const g = geometria(el), abs = el.kind === 'via-lliure';
    const r = (abs ? 0 : el.rotation) * Math.PI / 180, sx = abs ? 1 : el.scaleX, sy = abs ? 1 : el.scaleY;
    const margin = g.width * Math.max(Math.abs(sx), Math.abs(sy)) / 2 + 40;
    for (const { points: p } of g.paths) for (let i = 0; i < p.length; i += 2) {
      const px = (abs ? 0 : el.x) + p[i] * sx * Math.cos(r) - p[i + 1] * sy * Math.sin(r);
      const py = (abs ? 0 : el.y) + p[i] * sx * Math.sin(r) + p[i + 1] * sy * Math.cos(r);
      x = Math.min(x, px - margin); y = Math.min(y, py - margin);
      right = Math.max(right, px + margin); bottom = Math.max(bottom, py + margin);
    }
  }
  return { x, y, width: right - x, height: bottom - y };
}
const graus = (x: number, y: number) => Math.atan2(y, x) * 180 / Math.PI;
const arc = (r: number, a: number, b: number) => Array.from({ length: 49 }, (_, i) => {
  const t = (a + (b - a) * i / 48) * Math.PI / 180;
  return [Math.cos(t) * r, Math.sin(t) * r];
}).flat();

/** Eixos locals. Les vies antigues conserven la posició i les dimensions. */
export function geometria(el: El): { paths: Tracat[]; marks: Tracat[]; width: number } {
  const w = el.width ?? (el.kind === 'via-lliure' ? 240 : 330);
  let paths: Tracat[] = [];
  let junction = false;
  if (el.kind === 'via-lliure') paths = [{ points: el.points ?? [], tension: el.tension ?? 0.5 }];
  else if (el.kind === 'via-peca') {
    const p = el.roadPiece ?? 'recta', len = Math.max(w * 0.7, el.roadLength ?? 420);
    if (p === 'recta') paths = [{ points: [0, 0, 0, -len] }];
    else if (p.includes('90') || p.includes('45')) {
      const side = p.startsWith('esquerra') ? -1 : 1, angle = p.endsWith('45') ? Math.PI / 4 : Math.PI / 2;
      const r = Math.max(w, el.roadLength ?? 420);
      paths = [{ points: Array.from({ length: 49 }, (_, i) => {
        const t = angle * i / 48;
        return [side * r * (1 - Math.cos(t)), -r * Math.sin(t)];
      }).flat() }];
    } else {
      junction = true;
      paths = [{ points: [0, 0, 0, -len] }];
      if (p === 'creu') paths.push({ points: [0, -len, 0, -len * 2] });
      if (p === 'y') paths.push({ points: [0, -len, -len * 0.8, -len * 1.8] }, { points: [0, -len, len * 0.8, -len * 1.8] });
      else paths.push({ points: [0, -len, -len, -len] }, { points: [0, -len, len, -len] });
    }
  } else {
    switch (el.kind) {
      case 'c-corba': paths = [{ points: arc(245, 180, 270) }]; break;
      case 'c-corba-suau': return { paths: [{ points: arc(260, 200, 245) }], marks: [], width: 280 };
      case 'c-cruilla': junction = true; paths = [{ points: [0, 330, 0, 0] }, { points: [0, 0, 0, -330] }, { points: [0, 0, -330, 0] }, { points: [0, 0, 330, 0] }]; break;
      case 'c-y': junction = true; paths = [{ points: [0, 390, 0, -30] }, { points: [0, -350, -240, 250] }, { points: [0, -350, 240, 250] }]; break;
      case 'c-ramal': junction = true; paths = [{ points: [0, 260, 0, 0] }, { points: [0, 0, 0, -260] }, { points: [0, 0, 400, 260] }]; break;
      default: paths = [{ points: [0, 210, 0, -210] }];
    }
  }
  paths = paths.filter((p) => p.points.length >= 4);
  // Les marques s'aturen abans del centre de les cruïlles.
  const marks = junction ? paths.map((p, i) => {
    const [x, y, ex, ey] = p.points, len = Math.hypot(ex - x, ey - y), gap = Math.min(w * 0.65, len * 0.8);
    return { points: i === 0 ? [x, y, ex - (ex - x) * gap / len, ey - (ey - y) * gap / len]
      : [x + (ex - x) * gap / len, y + (ey - y) * gap / len, ex, ey] };
  }) : paths;
  return { paths, marks, width: w };
}

export function boques(el: El): Boca[] {
  const { paths, width } = geometria(el);
  const coords = paths.flatMap(({ points: p }) => [
    { x: p[0], y: p[1], dx: p[0] - p[2], dy: p[1] - p[3] },
    { x: p[p.length - 2], y: p[p.length - 1], dx: p[p.length - 2] - p[p.length - 4], dy: p[p.length - 1] - p[p.length - 3] },
  ]);
  const unique = coords.filter((p) => coords.filter((q) => Math.hypot(p.x - q.x, p.y - q.y) < 0.01).length === 1);
  const absolute = el.kind === 'via-lliure';
  const sx = absolute ? 1 : el.scaleX, sy = absolute ? 1 : el.scaleY, r = (absolute ? 0 : el.rotation) * Math.PI / 180;
  return unique.map((p, index) => {
    // Tangent exacta de les corbes regulars (la polilínia només és per pintar).
    if (el.kind === 'via-peca' && /90|45/.test(el.roadPiece ?? '')) {
      const a = index === 0 ? Math.PI / 2 : -Math.PI / 2 + (el.roadPiece!.startsWith('esquerra') ? -1 : 1) * (el.roadPiece!.endsWith('45') ? Math.PI / 4 : Math.PI / 2);
      p.dx = Math.cos(a); p.dy = Math.sin(a);
    }
    const dx = p.dx * sx, dy = p.dy * sy;
    const norm = Math.hypot(p.dx, p.dy) || 1;
    return { x: (absolute ? 0 : el.x) + p.x * sx * Math.cos(r) - p.y * sy * Math.sin(r),
      y: (absolute ? 0 : el.y) + p.x * sx * Math.sin(r) + p.y * sy * Math.cos(r),
      angle: graus(dx, dy) + r * 180 / Math.PI,
      width: width * Math.hypot(p.dy / norm * sx, p.dx / norm * sy), id: el.id, index };
  });
}

export function boquesLliures(els: El[]): Boca[] {
  const all = els.filter((e) => esCalcada(e) && !e.hidden).flatMap(boques);
  return all.filter((a) => !all.some((b) => a.id !== b.id && Math.hypot(a.x - b.x, a.y - b.y) < 3));
}

export function encaixa(el: El, index: number, target: Boca): El {
  if (el.kind === 'via-lliure') {
    const p = [...(el.points ?? [])], end = index === 0 ? 0 : p.length - 2;
    p[end] = target.x; p[end + 1] = target.y;
    return { ...el, points: p, width: target.width };
  }
  const boca = boques(el)[index];
  if (!boca) return el;
  const ratio = target.width / boca.width;
  const next = { ...el, rotation: el.rotation + target.angle + 180 - boca.angle, scaleX: el.scaleX * ratio, scaleY: el.scaleY * ratio };
  const moved = boques(next)[index];
  return { ...next, x: next.x + target.x - moved.x, y: next.y + target.y - moved.y };
}

export function apropa(el: El, els: El[], distance: number): El {
  const targets = boquesLliures(els.filter((e) => e.id !== el.id));
  let best: { index: number; target: Boca } | undefined;
  let min = distance;
  for (const a of boques(el)) for (const b of targets) {
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < min) { min = d; best = { index: a.index, target: b }; }
  }
  return best ? encaixa(el, best.index, best.target) : el;
}

/** Allarga la tangent als extrems connectats perquè la via lliure no hi faci un colze. */
export function uneixVia(points: number[], els: El[], width: number): number[] {
  if (points.length < 4) return points;
  const p = [...points], all = boquesLliures(els);
  for (const start of [true, false]) {
    const i = start ? 0 : p.length - 2, j = start ? 2 : p.length - 4;
    const target = all.find((b) => Math.hypot(b.x - p[i], b.y - p[i + 1]) < 3 && Math.abs(b.width - width) < 3);
    if (!target) continue;
    const len = Math.min(width * 0.6, Math.hypot(p[i] - p[j], p[i + 1] - p[j + 1]) * 0.4);
    const rad = target.angle * Math.PI / 180;
    p.splice(start ? 2 : p.length - 2, 0, target.x + Math.cos(rad) * len, target.y + Math.sin(rad) * len);
  }
  return p;
}
