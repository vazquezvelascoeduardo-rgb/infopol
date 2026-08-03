// Psicotècnics — la sessió.
//
// Ocupa la pantalla sencera i no fa scroll mai: la capçalera i l'enunciat
// prenen el que necessiten i la resta se la reparteixen el dibuix i les
// respostes. Si no hi cabés, el que s'encongeix és el dibuix, no la
// pregunta. El repartiment el fa `psico.css`, que és on hi ha les mides.
//
// Els dos formats són els mateixos que als tests de temari:
//  · Estudi    — et diu si has encertat a cada pregunta.
//  · Simulacre — correcció al final, com a l'examen.
//
// El dibuix arriba com una cadena SVG i es pinta amb `dangerouslySetInnerHTML`.
// Aquí és segur perquè el SVG no ve de fora ni de cap usuari: el fabrica el
// generador amb números que ell mateix ha calculat. A l'app això mateix ho
// pinta `SvgXml` de react-native-svg amb la mateixa cadena.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  BLOCS, PER_ID, genera, segonsPer, simulacre, type ItemPsico,
} from '../../lib/psicotecnics/cataleg.mjs';
import { desaSessio } from '../../lib/psicoStats';
import { I, RV, V } from '../../lib/v3';
import './psico.css';

export type Cos = 'pl' | 'mossos';

const ACCENTS: Record<Cos, { accent: string; ink: string; soft: string }> = {
  pl: { accent: '#FF7A1A', ink: '#C4530A', soft: '#FFEDDD' },
  mossos: { accent: '#991B1B', ink: '#991B1B', soft: '#F7E5E5' },
};

const rellotge = (s: number) =>
  `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;

function Dibuix({ svg }: { svg: string }) {
  // eslint-disable-next-line react/no-danger
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function PsicoSessio({ cos }: { cos: Cos }) {
  const { categoria = '' } = useParams<{ categoria: string }>();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const a = ACCENTS[cos];
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';

  const quantes = Number(params.get('n')) || 20;
  const esEstudi = params.get('f') !== 'exam';
  const ambTemps = params.get('t') === '1';
  const llavorFixa = Number(params.get('llavor')) || 0;

  // Què s'ha demanat: una categoria sola, un bloc d'aptituds o l'examen sencer.
  const esCategoria = !!PER_ID[categoria];
  const bloc = BLOCS.find((b) => b.id === categoria);
  const perfil = categoria === 'tot' ? (cos === 'pl' ? 'iopos' : 'mossos') : categoria;

  const llavorBase = useRef(llavorFixa || Math.floor(Math.random() * 900000) + 1000);
  const preguntes = useMemo<ItemPsico[]>(() => {
    if (esCategoria) {
      return Array.from({ length: quantes }, (_, k) => genera(categoria, llavorBase.current + k));
    }
    if (bloc || categoria === 'tot') return simulacre(perfil, quantes, llavorBase.current);
    return [];
  }, [esCategoria, bloc, categoria, perfil, quantes]);

  const [i, setI] = useState(0);
  const [respostes, setRespostes] = useState<(number | null)[]>([]);
  const [triada, setTriada] = useState<number | null>(null);
  const [acabat, setAcabat] = useState(false);
  const [segons, setSegons] = useState(ambTemps ? segonsPer(quantes) : 0);
  // El resultat es dibuixa cada cop que React repinta; el progrés, una sola
  // vegada. Sense això, sortir i tornar duplicaria la sessió.
  const desat = useRef(false);

  useEffect(() => {
    if (acabat || !preguntes.length) return undefined;
    const t = setInterval(() => {
      setSegons((s) => {
        if (!ambTemps) return s + 1;
        if (s <= 1) { setAcabat(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [acabat, ambTemps, preguntes.length]);

  if (!preguntes.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: V.muted }}>
        Aquesta pràctica no existeix.
        <div style={{ marginTop: 12 }}>
          <button onClick={() => nav(`${arrel}/psicotecnics`)} style={boto(a, true)}>Tornar</button>
        </div>
      </div>
    );
  }

  const respon = (k: number) => {
    if (triada !== null) return;
    setTriada(k);
    setRespostes((r) => { const n = [...r]; n[i] = k; return n; });
    if (!esEstudi) setTimeout(seguent, 110);
  };

  function seguent() {
    setTriada(null);
    if (i + 1 >= preguntes.length) { setAcabat(true); return; }
    setI((n) => n + 1);
  }

  // ── El resultat ──────────────────────────────────────────────
  if (acabat) {
    const be = preguntes.reduce((s, p, k) => s + (respostes[k] === p.correcta ? 1 : 0), 0);
    const per: Record<string, { be: number; total: number }> = {};
    preguntes.forEach((p, k) => {
      per[p.categoria] = per[p.categoria] || { be: 0, total: 0 };
      per[p.categoria].total++;
      if (respostes[k] === p.correcta) per[p.categoria].be++;
    });

    // Es desa un cop, quan s'arriba aquí. Només compten les preguntes
    // contestades: si has deixat el simulacre a mitges, no té sentit
    // penalitzar-te per les que no has arribat a veure.
    if (!desat.current) {
      desat.current = true;
      const fetes = respostes.filter((r) => r !== null && r !== undefined).length;
      if (fetes > 0) {
        const perDesar: Record<string, { fetes: number; encerts: number }> = {};
        preguntes.forEach((p, k) => {
          if (respostes[k] === null || respostes[k] === undefined) return;
          perDesar[p.categoria] = perDesar[p.categoria] || { fetes: 0, encerts: 0 };
          perDesar[p.categoria].fetes++;
          if (respostes[k] === p.correcta) perDesar[p.categoria].encerts++;
        });
        desaSessio({
          per: perDesar,
          segons: ambTemps ? segonsPer(quantes) - segons : segons,
        });
      }
    }
    const titol = esCategoria ? PER_ID[categoria].nom
      : bloc ? bloc.nom : 'Simulacre complet';

    return (
      <div className="psico-sessio" style={{ background: V.paper, color: V.ink, overflowY: 'auto' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', width: '100%', paddingBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: a.ink }}>
            {titol.toUpperCase()}
          </div>
          <div style={{
            background: V.surface, border: `1px solid ${V.border}`, borderRadius: RV.lg,
            padding: 18, margin: '10px 0 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: a.accent, lineHeight: 1 }}>
              {Math.round((be / preguntes.length) * 100)}%
            </div>
            <div style={{ color: V.muted, fontSize: 14, marginTop: 5 }}>
              {be} de {preguntes.length} · {rellotge(ambTemps ? segonsPer(quantes) - segons : segons)}
            </div>
          </div>

          {Object.keys(per).length > 1 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', color: V.muted }}>
                ON HAS FLUIXEJAT
              </div>
              <div style={{ display: 'grid', gap: 6, margin: '8px 0 18px' }}>
                {Object.entries(per)
                  .sort((x, y) => (x[1].be / x[1].total) - (y[1].be / y[1].total))
                  .map(([id, v]) => (
                    <div key={id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, background: V.surface,
                      border: `1px solid ${V.border}`, borderRadius: RV.sm, padding: '9px 12px',
                    }}>
                      <span style={{ flex: 1, fontSize: 14 }}>{PER_ID[id]?.nom ?? id}</span>
                      <span style={{
                        fontFamily: V.mono, fontSize: 13,
                        color: v.be === v.total ? V.ok
                          : v.be * 2 < v.total ? V.granate : V.muted,
                      }}>
                        {v.be}/{v.total}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 9 }}>
            <button onClick={() => nav(`${arrel}/psicotecnics`)} style={{ ...boto(a, true), flex: 1 }}>
              Tornar
            </button>
            <button onClick={() => window.location.reload()} style={{ ...boto(a), flex: 1 }}>
              Un altre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── La pregunta ──────────────────────────────────────────────
  const it = preguntes[i];
  const ambDibuix = !!it.svg;
  const opGrafiques = it.opcions.some((o) => o.svg);
  const marca = esEstudi && triada !== null;
  const textLlarg = !opGrafiques && it.opcions.some((o) => (o.text ?? '').length > 14);

  return (
    <div className="psico-sessio" style={{ background: V.paper, color: V.ink }}>
      <div className="psico-dins">
        {/* Capçalera */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, fontSize: 13,
          color: V.muted,
        }}>
          <button
            onClick={() => nav(`${arrel}/psicotecnics`)}
            aria-label="Sortir"
            style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 0 }}
          >
            <I n="x" size={20} color={V.muted} />
          </button>
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {i + 1} / {preguntes.length}
            {!esCategoria && ` · ${PER_ID[it.categoria]?.nom ?? ''}`}
          </span>
          <span style={{
            fontFamily: V.mono, fontSize: 14, fontWeight: 700,
            color: ambTemps && segons < 60 ? V.granate : V.ink,
          }}>
            {rellotge(segons)}
          </span>
        </div>

        <div style={{ height: 3, background: V.hair, borderRadius: 9, flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${((i + 1) / preguntes.length) * 100}%`,
            background: a.accent, borderRadius: 9, transition: 'width .2s',
          }} />
        </div>

        <p className="psico-enunciat">
          {it.svgObjectiu && (
            <span style={{
              display: 'inline-block', width: 20, verticalAlign: 'middle', marginRight: 5,
            }}>
              <Dibuix svg={it.svgObjectiu} />
            </span>
          )}
          {it.enunciat}
        </p>

        <div className={`psico-cos${ambDibuix ? '' : ' sense-dibuix'}`}>
          {ambDibuix && (
            <div className="psico-estimul" style={{ background: '#fff', border: `1px solid ${V.border}` }}>
              <Dibuix svg={it.svg!} />
            </div>
          )}

          <div className={`psico-ops${it.opcions.length === 5 ? ' cinc' : ''}${textLlarg ? ' text-llarg' : ''}`}>
            {it.opcions.map((o, k) => {
              const sel = triada === k;
              const bona = marca && k === it.correcta;
              const fallada = marca && sel && k !== it.correcta;
              return (
                <button
                  key={k}
                  onClick={() => respon(k)}
                  disabled={triada !== null}
                  className={`psico-op${o.svg ? ' amb-dibuix' : ''}`}
                  style={{
                    borderColor: bona ? V.ok : fallada ? V.granate : sel ? a.accent : V.border,
                    background: bona ? V.okSoft : fallada ? V.granateSoft
                      : sel ? a.soft : V.surface,
                    color: V.ink,
                  }}
                >
                  <span className="lletra" style={{ color: bona ? V.ok : fallada ? V.granate : V.muted }}>
                    {'ABCDE'[k]}
                  </span>
                  {o.svg ? <Dibuix svg={o.svg} /> : <span className="text">{o.text}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {esEstudi && triada !== null && (
          <button onClick={seguent} style={{ ...boto(a), flexShrink: 0 }}>
            {i + 1 >= preguntes.length ? 'Veure el resultat' : 'Següent'}
          </button>
        )}
      </div>
    </div>
  );
}

const boto = (a: { accent: string; ink: string }, secundari = false) => ({
  padding: '12px', borderRadius: RV.sm, cursor: 'pointer', font: 'inherit',
  fontWeight: 700, fontSize: 15.5,
  border: secundari ? `1.5px solid ${V.border}` : 'none',
  background: secundari ? V.surface : a.accent,
  color: secundari ? a.ink : '#fff',
});
