// Psicotècnics — la sessió.
//
// Porta el mateix marc que el test de temari (`lib/focus.tsx`): la barra
// de dalt amb la creu i "Acabar ara", el progrés per segments, i el peu
// amb la fletxa d'enrere i "Següent". Abans no en tenia res: s'hi entrava
// i només se'n sortia contestant-ho tot, i no s'assemblava a la resta.
//
// El que sí que és seu és el repartiment de la pantalla: no fa scroll
// mai. La capçalera i l'enunciat prenen el que necessiten i la resta se
// la reparteixen el dibuix i les respostes. Si no hi cabés, el que
// s'encongeix és el dibuix, no la pregunta. Les mides són a `psico.css`.
//
// Els dos formats són els mateixos que als tests de temari:
//  · Estudi    — et diu si has encertat a cada pregunta.
//  · Simulacre — correcció al final, com a l'examen.
//
// El dibuix arriba com una cadena SVG i es pinta amb `dangerouslySetInnerHTML`.
// Aquí és segur perquè el SVG no ve de fora ni de cap usuari: el fabrica el
// generador amb números que ell mateix ha calculat. A l'app això mateix ho
// pinta `SvgXml` de react-native-svg amb la mateixa cadena.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  BLOCS, PER_ID, genera, segonsPer, simulacre, type ItemPsico,
} from '../../lib/psicotecnics/cataleg.mjs';
import { desaSessio } from '../../lib/psicoStats';
import {
  BarraFocus, DialegFocus, FIc, FP, MarcFocus, PeuFocus, ProgresFocus, useEsMobil,
} from '../../lib/focus';
import './psico.css';

export type Cos = 'pl' | 'mossos';

const LLETRES = ['A', 'B', 'C', 'D', 'E'];

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
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';
  const esMobil = useEsMobil();

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
  const [respostes, setRespostes] = useState<(number | null)[]>(() => []);
  // En mode estudi, quines preguntes ja s'han corregit. Una vegada
  // revelada, la resposta no es pot canviar: si no, no seria estudiar.
  const [revelades, setRevelades] = useState<Set<number>>(() => new Set());
  const [acabat, setAcabat] = useState(false);
  const [confirma, setConfirma] = useState(false);
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

  const enBlanc = preguntes.length - respostes.filter((r) => r !== null && r !== undefined).length;

  const demanaAcabar = useCallback(() => {
    if (enBlanc <= 0) { setAcabat(true); return; }
    setConfirma(true);
  }, [enBlanc]);

  const respon = useCallback((k: number) => {
    if (revelades.has(i)) return;
    setRespostes((r) => { const n = [...r]; n[i] = k; return n; });
    if (esEstudi) {
      setRevelades((s) => new Set(s).add(i));
    } else {
      // Al simulacre no hi ha correcció: es passa de llarg, com a l'examen.
      setTimeout(() => setI((n) => (n + 1 < preguntes.length ? n + 1 : n)), 110);
    }
  }, [esEstudi, i, preguntes.length, revelades]);

  const seguent = useCallback(() => {
    if (i + 1 >= preguntes.length) { demanaAcabar(); return; }
    setI((n) => n + 1);
  }, [demanaAcabar, i, preguntes.length]);

  const enrere = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  // Teclat: A-E trien · Enter/→ avancen · ← retrocedeix. Igual que al
  // test de temari, que és on s'aprèn el gest.
  useEffect(() => {
    if (acabat || !preguntes.length) return undefined;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      const idx = LLETRES.indexOf(k);
      const num = Number(e.key);
      const tria = idx >= 0 ? idx : (Number.isFinite(num) && num >= 1 && num <= 5 ? num - 1 : -1);
      if (tria >= 0 && tria < preguntes[i].opcions.length) {
        e.preventDefault(); respon(tria);
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault(); seguent();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); enrere();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [acabat, enrere, i, preguntes, respon, seguent]);

  if (!preguntes.length) {
    return (
      <MarcFocus esMobil={esMobil} style={{ placeContent: 'center', textAlign: 'center' }}>
        <p style={{ color: FP.inkMuted, fontSize: 15 }}>Aquesta pràctica no existeix.</p>
        <div>
          <button onClick={() => nav(`${arrel}/psicotecnics`)} style={{
            border: 'none', borderRadius: 14, padding: '13px 24px', cursor: 'pointer',
            background: FP.terracota, color: '#fff', font: 'inherit', fontWeight: 700, fontSize: 15.5,
          }}>
            Tornar
          </button>
        </div>
      </MarcFocus>
    );
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
    const pct = Math.round((be / preguntes.length) * 100);

    return (
      <MarcFocus esMobil={esMobil} style={{ overflowY: 'auto' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', width: '100%', paddingBottom: 20 }}>
          <div style={{
            fontFamily: FP.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
            color: FP.terraInk, textTransform: 'uppercase',
          }}>
            {titol}
          </div>
          <div style={{
            background: FP.card, border: `1px solid ${FP.hairline}`, borderRadius: 22,
            padding: 24, margin: '10px 0 18px', textAlign: 'center',
            boxShadow: '0 1px 0 rgba(19,19,26,0.04), 0 6px 16px rgba(19,19,26,0.05)',
          }}>
            <div style={{
              fontFamily: FP.display, fontSize: 46, fontWeight: 800, lineHeight: 1,
              letterSpacing: -2, color: pct >= 70 ? FP.green : pct >= 50 ? FP.terraInk : FP.red,
            }}>
              {pct}%
            </div>
            <div style={{ color: FP.inkMuted, fontSize: 14, marginTop: 6 }}>
              {be} de {preguntes.length} · {rellotge(ambTemps ? segonsPer(quantes) - segons : segons)}
            </div>
          </div>

          {Object.keys(per).length > 1 && (
            <>
              <div style={{
                fontFamily: FP.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
                color: FP.inkMuted,
              }}>
                ON HAS FLUIXEJAT
              </div>
              <div style={{ display: 'grid', gap: 6, margin: '8px 0 18px' }}>
                {Object.entries(per)
                  .sort((x, y) => (x[1].be / x[1].total) - (y[1].be / y[1].total))
                  .map(([id, v]) => (
                    <div key={id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, background: FP.card,
                      border: `1px solid ${FP.hairline}`, borderRadius: 14, padding: '11px 14px',
                    }}>
                      <span style={{ flex: 1, fontSize: 14 }}>{PER_ID[id]?.nom ?? id}</span>
                      <span style={{
                        fontFamily: FP.mono, fontSize: 13, fontWeight: 700,
                        color: v.be === v.total ? FP.green
                          : v.be * 2 < v.total ? FP.red : FP.inkMuted,
                      }}>
                        {v.be}/{v.total}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => nav(`${arrel}/psicotecnics`)} style={{
              flex: 1, height: 50, borderRadius: 14, cursor: 'pointer', font: 'inherit',
              fontWeight: 700, fontSize: 15.5, background: FP.card,
              border: `1px solid ${FP.line2}`, color: FP.inkSoft,
            }}>
              Tornar
            </button>
            <button onClick={() => window.location.reload()} style={{
              flex: 1, height: 50, borderRadius: 14, cursor: 'pointer', font: 'inherit',
              fontWeight: 700, fontSize: 16, border: 'none', background: FP.terracota, color: '#fff',
              boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)',
            }}>
              Un altre
            </button>
          </div>
        </div>
      </MarcFocus>
    );
  }

  // ── La pregunta ──────────────────────────────────────────────
  const it = preguntes[i];
  const ambDibuix = !!it.svg;
  const opGrafiques = it.opcions.some((o) => o.svg);
  const revelada = revelades.has(i);
  const triada = respostes[i] ?? null;
  const encerts = preguntes.reduce((s, p, k) => s + (respostes[k] === p.correcta ? 1 : 0), 0);
  const textLlarg = !opGrafiques && it.opcions.some((o) => (o.text ?? '').length > 14);
  const encertada = revelada && triada === it.correcta;

  return (
    <MarcFocus esMobil={esMobil} style={{ overflow: 'hidden' }}>
      <BarraFocus
        index={i}
        total={preguntes.length}
        encerts={esEstudi ? encerts : null}
        temps={rellotge(segons)}
        perillTemps={ambTemps && segons < 60}
        etiquetaAcabar="Acabar ara"
        onAcabar={demanaAcabar}
        esMobil={esMobil}
      />

      <ProgresFocus
        index={i}
        estat={preguntes.map((p, k) => {
          const r = respostes[k];
          if (r === null || r === undefined) return null;
          return r === p.correcta;
        })}
      />

      <div className="psico-dins">
        {/* De quina aptitud és la pregunta. Al simulacre van barrejades i
            si no ho diu, no saps què estàs entrenant. */}
        <span style={{
          alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8,
          background: FP.terraSoft, color: FP.terraInk, fontFamily: FP.mono, fontWeight: 600,
          fontSize: esMobil ? 11 : 12, letterSpacing: 0.6, textTransform: 'uppercase',
          padding: '7px 14px', borderRadius: 999, maxWidth: '100%', flexShrink: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {PER_ID[it.categoria]?.nom ?? 'Psicotècnic'}
        </span>

        <p className="psico-enunciat" style={{
          fontFamily: FP.display, fontWeight: 700, letterSpacing: -0.4, color: FP.ink,
        }}>
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
            <div className="psico-estimul" style={{ background: FP.card, border: `1px solid ${FP.hairline}` }}>
              <Dibuix svg={it.svg!} />
            </div>
          )}

          <div className={`psico-ops${textLlarg ? ' text-llarg' : ''}`}>
            {it.opcions.map((o, k) => {
              const sel = triada === k;
              const bona = revelada && k === it.correcta;
              const fallada = revelada && sel && k !== it.correcta;
              const apagada = revelada && !bona && !sel;

              let fons: string = FP.card;
              let vora: string = FP.hairline;
              let lletra: string = FP.ink;
              let placaFons: string = FP.bgDeep;
              let placaText: string = FP.inkSoft;
              let icona: string | null = null;
              if (sel && !revelada) { vora = FP.terracota; placaFons = FP.terracota; placaText = '#fff'; fons = '#FFFAF5'; }
              if (bona) { vora = FP.green; fons = FP.greenSoft; lletra = FP.greenInk; placaFons = FP.green; placaText = '#fff'; icona = 'check'; }
              if (fallada) { vora = FP.red; fons = FP.redSoft; lletra = FP.redInk; placaFons = FP.red; placaText = '#fff'; icona = 'x'; }
              if (apagada) { lletra = FP.inkMuted; placaText = FP.inkFaint; }

              return (
                <button
                  key={k}
                  onClick={() => respon(k)}
                  disabled={revelada}
                  className={`psico-op${o.svg ? ' amb-dibuix' : ''}`}
                  style={{
                    borderWidth: 2, borderColor: vora, background: fons, color: lletra,
                    opacity: apagada ? 0.65 : 1,
                    boxShadow: revelada ? 'none' : '0 1px 0 rgba(19,19,26,0.04), 0 6px 16px rgba(19,19,26,0.05)',
                    transition: 'border-color .15s, background .15s, opacity .15s',
                    cursor: revelada ? 'default' : 'pointer',
                  }}
                >
                  <span className="lletra" style={{
                    width: o.svg ? 24 : 32, height: o.svg ? 24 : 32, borderRadius: o.svg ? 8 : 10,
                    background: placaFons, color: placaText, fontSize: o.svg ? 12 : 14.5,
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {LLETRES[k]}
                  </span>
                  {o.svg
                    ? <Dibuix svg={o.svg} />
                    : (
                      <span className="text" style={{
                        fontFamily: FP.display, fontWeight: 500, fontSize: esMobil ? 15 : 16,
                        letterSpacing: -0.2, lineHeight: 1.3,
                      }}>
                        {o.text}
                      </span>
                    )}
                  {icona && (
                    <span style={{
                      flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: placaFons,
                      display: 'grid', placeItems: 'center', marginLeft: 'auto',
                    }}>
                      <FIc name={icona} size={14} color="#fff" sw={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* El peu: què ha passat (només en mode estudi) i la navegació. */}
        <div style={{
          flexShrink: 0, display: 'flex', gap: esMobil ? 10 : 16,
          flexDirection: esMobil ? 'column' : 'row',
          alignItems: esMobil ? 'stretch' : 'center',
        }}>
          {esEstudi && revelada && (
            <div style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 11,
              background: encertada ? FP.greenSoft : FP.redSoft,
              border: `1px solid ${encertada ? FP.green : FP.red}`,
              borderRadius: 14, padding: '10px 14px',
            }}>
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: 999,
                background: encertada ? FP.green : FP.red, display: 'grid', placeItems: 'center',
              }}>
                <FIc name={encertada ? 'check' : 'x'} size={14} color="#fff" sw={3} />
              </span>
              <span style={{
                fontSize: 13.5, fontWeight: 600, color: encertada ? FP.greenInk : FP.redInk,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {encertada
                  ? 'Correcte.'
                  : `Incorrecte. ${LLETRES[it.correcta]}${opGrafiques ? '' : `) ${it.opcions[it.correcta].text ?? ''}`}`}
              </span>
            </div>
          )}
          {!esMobil && !(esEstudi && revelada) && <div style={{ flex: 1 }} />}
          <PeuFocus
            potEnrere={i > 0}
            onEnrere={enrere}
            onSeguent={seguent}
            etiquetaSeguent={i + 1 >= preguntes.length ? 'Veure el resultat' : 'Següent'}
            etiquetaEnrere="Anterior"
            esMobil={esMobil}
          />
        </div>
      </div>

      {confirma && (
        <DialegFocus
          titol="Vols acabar ja?"
          text={`Et queden ${enBlanc} preguntes sense contestar. Comptaran com a errades.`}
          cancella="Segueixo"
          confirma="Acabar"
          onCancella={() => setConfirma(false)}
          onConfirma={() => { setConfirma(false); setAcabat(true); }}
        />
      )}
    </MarcFocus>
  );
}
