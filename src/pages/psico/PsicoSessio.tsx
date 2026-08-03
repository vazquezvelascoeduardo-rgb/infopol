// Psicotècnics — la sessió.
//
// La mateixa pantalla serveix per als dos modes, perquè el catàleg torna
// tots els ítems amb la mateixa forma vinguin de la família que vinguin:
//
//  · Entrenament d'una categoria — es corregeix a l'acte i no s'acaba mai.
//  · Simulacre — es corregeix al final, i amb rellotge si l'has demanat.
//
// El dibuix arriba com una cadena SVG i es pinta amb `dangerouslySetInnerHTML`.
// Aquí és segur perquè el SVG no ve de fora ni de cap usuari: el fabrica el
// generador amb números que ell mateix ha calculat. A l'app això mateix ho
// pinta `SvgXml` de react-native-svg amb la mateixa cadena.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  PER_ID, genera, segonsPer, simulacre, type ItemPsico, type Perfil,
} from '../../lib/psicotecnics/cataleg.mjs';
import { I, Mono, RV, V } from '../../lib/v3';

export type Cos = 'pl' | 'mossos';

const ACCENTS: Record<Cos, { accent: string; ink: string; soft: string }> = {
  pl: { accent: '#FF7A1A', ink: '#C4530A', soft: '#FFEDDD' },
  mossos: { accent: '#991B1B', ink: '#991B1B', soft: '#F7E5E5' },
};

const rellotge = (s: number) =>
  `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;

/** El dibuix d'un generador. Cadena SVG, mai res que vingui de fora. */
function Dibuix({ svg, style }: { svg: string; style?: React.CSSProperties }) {
  return (
    <span
      style={{ display: 'block', ...style }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function PsicoSessio({ cos }: { cos: Cos }) {
  const { categoria } = useParams<{ categoria: string }>();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const a = ACCENTS[cos];
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';

  const esSimulacre = categoria === 'simulacre';
  const quantes = Number(params.get('n')) || 30;
  const ambTemps = params.get('t') === '1';
  const perfil = (params.get('perfil') as Perfil) || (cos === 'pl' ? 'iopos' : 'mossos');
  const llavorExamen = Number(params.get('llavor')) || 1;

  // El simulacre es fabrica una sola vegada: amb la mateixa llavor és
  // sempre el mateix examen, i així es pot compartir o repetir igual.
  const preguntes = useMemo<ItemPsico[]>(
    () => (esSimulacre ? simulacre(perfil, quantes, llavorExamen) : []),
    [esSimulacre, perfil, quantes, llavorExamen],
  );

  const [i, setI] = useState(0);
  const [respostes, setRespostes] = useState<(number | null)[]>([]);
  const [triada, setTriada] = useState<number | null>(null);
  const [acabat, setAcabat] = useState(false);
  const [segons, setSegons] = useState(ambTemps ? segonsPer(quantes) : 0);

  // A l'entrenament les preguntes no s'acaben: se'n fabrica una de nova
  // cada vegada, amb una llavor que no s'ha fet servir mai.
  const llavorBase = useRef(Math.floor(Math.random() * 900000) + 1000);
  const item = useMemo<ItemPsico | null>(() => {
    if (esSimulacre) return preguntes[i] ?? null;
    if (!categoria || !PER_ID[categoria]) return null;
    return genera(categoria, llavorBase.current + i);
  }, [esSimulacre, preguntes, i, categoria]);

  // El rellotge. Compta enrere al simulacre amb temps i endavant si no n'hi ha:
  // saber quant has trigat també serveix, encara que no et talli.
  useEffect(() => {
    if (!esSimulacre || acabat) return undefined;
    const t = setInterval(() => {
      setSegons((s) => {
        if (!ambTemps) return s + 1;
        if (s <= 1) { setAcabat(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [esSimulacre, acabat, ambTemps]);

  const respon = useCallback((k: number) => {
    if (triada !== null) return;
    setTriada(k);
    setRespostes((r) => { const n = [...r]; n[i] = k; return n; });
    // Al simulacre no es corregeix fins al final: es passa de llarg.
    if (esSimulacre) setTimeout(segueix, 90);
  }, [triada, i, esSimulacre]);

  function segueix() {
    setTriada(null);
    if (esSimulacre && i + 1 >= preguntes.length) { setAcabat(true); return; }
    setI((n) => n + 1);
  }

  if (!item && !acabat) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: V.muted }}>
        Aquesta categoria no existeix.
        <div style={{ marginTop: 12 }}>
          <button onClick={() => nav(`${arrel}/psicotecnics`)} style={botoSec(a)}>Tornar</button>
        </div>
      </div>
    );
  }

  // ── Resultat del simulacre ───────────────────────────────────
  if (acabat) {
    const encerts = preguntes.reduce(
      (s, p, k) => s + (respostes[k] === p.correcta ? 1 : 0), 0,
    );
    const pct = Math.round((encerts / preguntes.length) * 100);
    // Per categoria, per saber on fluixeges.
    const per: Record<string, { be: number; total: number }> = {};
    preguntes.forEach((p, k) => {
      per[p.categoria] = per[p.categoria] || { be: 0, total: 0 };
      per[p.categoria].total++;
      if (respostes[k] === p.correcta) per[p.categoria].be++;
    });

    return (
      <div style={{ padding: '20px 16px 90px', maxWidth: 620, margin: '0 auto' }}>
        <Mono color={a.ink}>SIMULACRE ACABAT</Mono>
        <div style={{
          background: V.surface, border: `1px solid ${V.border}`, borderRadius: RV.lg,
          padding: 20, margin: '8px 0 20px', textAlign: 'center', boxShadow: V.shadow,
        }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: a.accent, lineHeight: 1 }}>{pct}%</div>
          <div style={{ color: V.muted, fontSize: 14, marginTop: 6 }}>
            {encerts} de {preguntes.length} · {ambTemps ? 'amb temps' : 'sense temps'}
          </div>
        </div>

        <Mono>PER CATEGORIES</Mono>
        <div style={{ display: 'grid', gap: 6, margin: '8px 0 20px' }}>
          {Object.entries(per).sort((x, y) => (x[1].be / x[1].total) - (y[1].be / y[1].total))
            .map(([id, v]) => (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', gap: 10, background: V.surface,
                border: `1px solid ${V.border}`, borderRadius: RV.sm, padding: '9px 12px',
              }}>
                <span style={{ flex: 1, fontSize: 14, color: V.ink }}>
                  {PER_ID[id]?.nom ?? id}
                </span>
                <span style={{
                  fontFamily: V.mono, fontSize: 13,
                  color: v.be === v.total ? V.ok : v.be * 2 < v.total ? V.granate : V.muted,
                }}>
                  {v.be}/{v.total}
                </span>
              </div>
            ))}
        </div>

        <div style={{ display: 'flex', gap: 9 }}>
          <button onClick={() => nav(`${arrel}/psicotecnics`)} style={{ ...botoSec(a), flex: 1 }}>
            Tornar
          </button>
          <button
            onClick={() => nav(`${arrel}/psicotecnics/simulacre?perfil=${perfil}&n=${quantes}`
              + `&t=${ambTemps ? 1 : 0}&llavor=${Math.floor(Math.random() * 900000) + 1000}`)}
            style={{ ...botoPrin(a), flex: 1 }}
          >
            Un altre
          </button>
        </div>
      </div>
    );
  }

  const it = item!;
  const grafiques = it.opcions.some((o) => o.svg);

  return (
    <div style={{ padding: '12px 14px 100px', maxWidth: 620, margin: '0 auto' }}>
      {/* Capçalera: on ets i quant queda */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <button onClick={() => nav(`${arrel}/psicotecnics`)} style={{
          background: 'none', border: 'none', padding: 4, cursor: 'pointer', lineHeight: 0,
        }}>
          <I n="back" size={20} color={V.muted} />
        </button>
        <span style={{ flex: 1, fontSize: 13, color: V.muted }}>
          {esSimulacre
            ? `${i + 1} de ${preguntes.length}`
            : PER_ID[categoria!]?.nom}
        </span>
        {esSimulacre && (
          <span style={{
            fontFamily: V.mono, fontSize: 14, fontWeight: 700,
            color: ambTemps && segons < 60 ? V.granate : V.ink,
          }}>
            {rellotge(segons)}
          </span>
        )}
      </div>

      {esSimulacre && (
        <div style={{ height: 3, background: V.hair, borderRadius: 9, marginBottom: 16 }}>
          <div style={{
            height: '100%', width: `${((i + 1) / preguntes.length) * 100}%`,
            background: a.accent, borderRadius: 9, transition: 'width .2s',
          }} />
        </div>
      )}

      {/* L'enunciat */}
      <p style={{ margin: '0 0 12px', fontSize: 15.5, lineHeight: 1.45, color: V.ink }}>
        {it.enunciat}
      </p>
      {it.svgObjectiu && (
        <Dibuix svg={it.svgObjectiu} style={{ width: 26, marginBottom: 10 }} />
      )}
      {it.svg && (
        <div style={{
          border: `1px solid ${V.border}`, borderRadius: RV.md, padding: 8,
          marginBottom: 14, overflowX: 'auto', background: '#fff',
        }}>
          <Dibuix svg={it.svg} />
        </div>
      )}

      {/* Les opcions */}
      <div style={{
        display: grafiques ? 'grid' : 'flex',
        gridTemplateColumns: grafiques ? '1fr 1fr' : undefined,
        flexDirection: grafiques ? undefined : 'column',
        gap: 8,
      }}>
        {it.opcions.map((o, k) => {
          const escollida = triada === k;
          const esLaBona = triada !== null && k === it.correcta;
          // A l'entrenament es corregeix a l'acte; al simulacre, no.
          const marca = !esSimulacre && triada !== null;
          const vora = marca && esLaBona ? V.ok
            : marca && escollida ? V.granate
              : escollida ? a.accent : V.border;
          const fons = marca && esLaBona ? V.okSoft
            : marca && escollida ? V.granateSoft
              : escollida ? a.soft : V.surface;
          return (
            <button
              key={k}
              onClick={() => respon(k)}
              disabled={triada !== null}
              style={{
                display: 'flex', alignItems: grafiques ? 'stretch' : 'center', gap: 10,
                flexDirection: grafiques ? 'column' : 'row',
                background: fons, border: `1.5px solid ${vora}`, borderRadius: RV.md,
                padding: 11, font: 'inherit', fontSize: 15, color: V.ink,
                textAlign: 'left', cursor: triada === null ? 'pointer' : 'default',
              }}
            >
              <span style={{
                fontFamily: V.mono, fontSize: 11.5, fontWeight: 700, color: V.muted, flexShrink: 0,
              }}>
                {'ABCDE'[k]}
              </span>
              {o.svg ? <Dibuix svg={o.svg} /> : <span>{o.text}</span>}
            </button>
          );
        })}
      </div>

      {/* A l'entrenament, el botó de continuar surt un cop respost */}
      {!esSimulacre && triada !== null && (
        <button onClick={() => segueix()} style={{ ...botoPrin(a), width: '100%', marginTop: 14 }}>
          Següent
        </button>
      )}
    </div>
  );
}

const botoPrin = (a: { accent: string }) => ({
  padding: '13px', borderRadius: RV.sm, border: 'none', background: a.accent,
  color: '#fff', font: 'inherit', fontWeight: 700, fontSize: 15.5, cursor: 'pointer',
});
const botoSec = (a: { ink: string }) => ({
  padding: '13px', borderRadius: RV.sm, border: `1.5px solid ${V.border}`,
  background: V.surface, color: a.ink, font: 'inherit', fontWeight: 650,
  fontSize: 15.5, cursor: 'pointer',
});
