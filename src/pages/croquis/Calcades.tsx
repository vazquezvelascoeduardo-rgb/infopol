import { Group, Line } from 'react-konva';
import type { El } from '../../lib/croquisPhysics';
import { esCalcada, geometria } from '../../lib/croquisRoads';

/** Primer tots els vorals, després l'asfalt i finalment la pintura.
 * Així les peces comparteixen una superfície i no se sobreposen les vores. */
export default function Calcades({ els }: { els: El[] }) {
  const roads = els.filter((e) => esCalcada(e) && !e.hidden);
  return <Group listening={false}>
    {['vora', 'asfalt', 'marques'].map((pass) => <Group key={pass}>
      {roads.map((el) => {
        const g = geometria(el), absolute = el.kind === 'via-lliure';
        if (pass === 'marques' && el.roadMarkings === false) return null;
        return <Group key={el.id} x={absolute ? 0 : el.x} y={absolute ? 0 : el.y}
          rotation={absolute ? 0 : el.rotation} scaleX={absolute ? 1 : el.scaleX} scaleY={absolute ? 1 : el.scaleY} opacity={el.opacity ?? 1}>
          {(pass === 'marques' ? g.marks : g.paths).map((path, i) => {
            const points = [...path.points];
            // Un sol píxel de solapament evita la fissura de l'antialiàsing.
            if (pass !== 'marques') for (const start of [true, false]) {
              const a = start ? 0 : points.length - 2, b = start ? 2 : points.length - 4;
              const dx = points[a] - points[b], dy = points[a + 1] - points[b + 1], length = Math.hypot(dx, dy) || 1;
              points[a] += dx / length; points[a + 1] += dy / length;
            }
            return <Line key={i} points={points}
            tension={path.tension ?? 0} lineCap="butt" lineJoin="round"
            stroke={pass === 'asfalt' ? '#D7DAE0' : '#fff'}
            strokeWidth={pass === 'vora' ? g.width : pass === 'asfalt' ? g.width - 8 : 5}
            dash={pass === 'marques' ? [26, 20] : undefined} />;
          })}
        </Group>;
      })}
    </Group>)}
  </Group>;
}
