// Lector d'un tema — disseny "Web Temari".
//
// Índex dels apartats a l'esquerra (amb el seu número i el vist quan
// l'has llegit) i el contingut al mig, amb les caixes i les targetes
// que porti el tema. A sota, els dos botons: fer el test de l'apartat i
// passar al següent.
//
// Els apartats llegits es desen al navegador. No és cap mèrit: només
// serveix per saber per on anaves.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { temaPerNum } from '../content/temari-pl';
import { contingutDe } from '../content/temari-pl/carrega';
import { temaMossosPerNum } from '../content/temari-mossos';
import { contingutDeMossos } from '../content/temari-mossos/carrega';
import type { BlocContingut } from '../lib/temari-format';
import { I, Mono, RV, V } from '../lib/v3';

/** Els dos temaris comparteixen lector: només canvia d'on surt el tema. */
export type CosTemari = 'pl' | 'mossos';

const RUTES: Record<CosTemari, { index: string; test: string; tornar: string }> = {
  pl: { index: '/estudi', test: '/policia-local', tornar: 'Estudia per tema' },
  mossos: { index: '/mossos/temari', test: '/mossos', tornar: 'Temari Mossos' },
};

const CLAU_LLEGITS = 'ip.temari.llegits.v1';

function llegits(): Record<string, number[]> {
  try {
    const raw = window.localStorage.getItem(CLAU_LLEGITS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function marcaLlegit(tema: string, apartat: number) {
  try {
    const tot = llegits();
    const llista = new Set(tot[tema] ?? []);
    llista.add(apartat);
    tot[tema] = [...llista];
    window.localStorage.setItem(CLAU_LLEGITS, JSON.stringify(tot));
  } catch { /* si el navegador no deixa desar, tant hi fa */ }
}

/** Caixa destacada: la clau d'examen i els avisos. */
function Caixa({ tipus, html }: { tipus: 'clau' | 'avis'; html: string }) {
  const esClau = tipus === 'clau';
  const fons = esClau ? 'var(--accent-soft, var(--v-terra-soft))' : V.granateSoft;
  const punt = esClau ? 'var(--accent, var(--v-terra))' : V.granate;
  const text = esClau ? 'var(--accent-ink, var(--v-terra-ink))' : V.granate;
  return (
    <div style={{ background: fons, borderRadius: RV.lg, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 9, background: punt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I n={esClau ? 'check' : 'bell'} size={15} sw={2.2} color="#fff" />
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.35, color: text }}>
          {esClau ? "Clau d'examen" : 'Compte'}
        </span>
      </div>
      <div
        className="temari-text"
        style={{ fontSize: 14.5, lineHeight: 1.65 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function Bloc({ b }: { b: BlocContingut }) {
  if (b.tipus === 'text') {
    return (
      <div style={{
        background: V.surface, borderRadius: RV.lg, padding: 22,
        boxShadow: V.shadow, marginBottom: 16,
      }}>
        <div
          className="temari-text"
          style={{ fontSize: 15.5, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: b.html }}
        />
      </div>
    );
  }
  if (b.tipus === 'clau' || b.tipus === 'avis') return <Caixa tipus={b.tipus} html={b.html} />;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
      gap: 14, marginBottom: 22,
    }}>
      {b.articles.map((a) => (
        <div key={a.ref + a.titol} style={{
          background: V.surface, borderRadius: 18, padding: 18, boxShadow: V.shadow,
        }}>
          <div style={{
            fontFamily: V.mono, fontSize: 11, fontWeight: 700,
            color: 'var(--accent-ink, var(--v-terra-ink))',
            background: 'var(--accent-soft, var(--v-terra-soft))',
            borderRadius: 8, padding: '5px 9px', display: 'inline-block',
          }}>
            {a.ref}
          </div>
          <div
            className="temari-text"
            style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.35, marginTop: 11 }}
            dangerouslySetInnerHTML={{ __html: a.titol }}
          />
          <div
            className="temari-text"
            style={{ fontSize: 13, color: V.muted, lineHeight: 1.5, marginTop: 5 }}
            dangerouslySetInnerHTML={{ __html: a.text }}
          />
        </div>
      ))}
    </div>
  );
}

export default function EstudiTema({ cos = 'pl' }: { cos?: CosTemari }) {
  const { num = '' } = useParams();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [fets, setFets] = useState<number[]>([]);

  const rutes = RUTES[cos];
  // Els dos temaris numeren des de l'1: si compartissin clau, el tema 3
  // de Mossos marcaria com a llegit el 3 de Policia Local.
  const clau = cos === 'pl' ? num : `m${num}`;

  const temaPl = cos === 'pl' ? temaPerNum(Number(num)) : undefined;
  const temaMossos = cos === 'mossos' ? temaMossosPerNum(Number(num)) : undefined;
  const tema = temaPl ?? temaMossos;
  const contingut = temaPl
    ? contingutDe(temaPl)
    : temaMossos
      ? contingutDeMossos(temaMossos)
      : null;

  useEffect(() => { setFets(llegits()[clau] ?? []); }, [clau]);
  useEffect(() => { setI(0); }, [clau]);

  // Llegir un apartat el marca. No cal fer res més.
  useEffect(() => {
    if (!contingut?.apartats.length) return;
    marcaLlegit(clau, i);
    setFets((p) => (p.includes(i) ? p : [...p, i]));
  }, [clau, i, contingut]);

  const apartat = contingut?.apartats[i];
  const total = contingut?.apartats.length ?? 0;

  const kicker = useMemo(() => {
    if (!tema) return '';
    const etiqueta = temaMossos ? `TEMA ${temaMossos.codi}` : `TEMA ${tema.num}`;
    return `${etiqueta} · ${tema.titol.split(/[,—]/)[0].toUpperCase()}`;
  }, [tema, temaMossos]);

  if (!tema) {
    return (
      <div className="v3-page v3-anim">
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Tema no trobat</h1>
        <Link to={rutes.index} style={{ fontSize: 14, fontWeight: 700 }}>Torna al temari</Link>
      </div>
    );
  }

  if (!contingut || !apartat) {
    return (
      <div className="v3-page v3-anim">
        <button
          type="button"
          onClick={() => nav(rutes.index)}
          style={{
            border: 'none', background: 'transparent', color: V.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, padding: 0, marginBottom: 14,
            fontSize: 13, fontWeight: 600,
          }}>
          <I n="back" size={15} sw={2.2} /> {rutes.tornar}
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, margin: '0 0 10px' }}>{tema.titol}</h1>
        <p style={{ fontSize: 14, color: V.muted, maxWidth: 560, lineHeight: 1.55 }}>
          Aquest tema encara no té el contingut escrit. Els temes es van redactant un
          a un; quan aquest hi sigui, s'obrirà aquí amb el seu índex d'apartats.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start' }} className="v3-anim">
      {/* Índex dels apartats. Va enganxat a dalt i ocupa tota l'alçada de
          la finestra: si només fes l'alçada del seu contingut, la banda
          blanca quedava tallada a mitja pantalla. */}
      <div className="temari-toc" style={{
        width: 270, flexShrink: 0, borderRight: `1px solid ${V.hair}`,
        position: 'sticky', top: 0, height: '100dvh', overflowY: 'auto',
        padding: '24px 18px', background: V.surface, boxSizing: 'border-box',
      }}>
        <button
          type="button"
          onClick={() => nav(rutes.index)}
          style={{
            border: 'none', background: 'transparent', color: V.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, padding: 0, marginBottom: 16,
            fontSize: 12.5, fontWeight: 600,
          }}>
          <I n="back" size={14} sw={2.2} /> Tot el temari
        </button>
        <Mono size={9.5} color={V.muted} style={{ letterSpacing: 1.8, display: 'block', marginBottom: 14 }}>
          {kicker}
        </Mono>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {contingut.apartats.map((a, k) => {
            const on = k === i;
            const llegit = fets.includes(k) && !on;
            return (
              <button
                key={a.num}
                type="button"
                onClick={() => setI(k)}
                aria-current={on ? 'true' : undefined}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                  borderRadius: 11, padding: '11px 12px',
                  background: on ? 'var(--accent-soft, var(--v-terra-soft))' : 'transparent',
                  color: on ? 'var(--accent-ink, var(--v-terra-ink))' : V.ink,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                <span style={{
                  width: 20, height: 20, flexShrink: 0, borderRadius: 6,
                  background: on ? 'var(--accent, var(--v-terra))' : V.surface2,
                  color: on ? '#fff' : V.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: V.mono, fontSize: 9.5, fontWeight: 700,
                }}>
                  {a.num}
                </span>
                <span style={{
                  flex: 1, fontSize: 13, fontWeight: on ? 800 : 600,
                  letterSpacing: -0.2, lineHeight: 1.3,
                }}>
                  {a.titol}
                </span>
                {llegit && <I n="check" size={14} sw={2.6} color={V.ok} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contingut */}
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '32px clamp(18px,3vw,40px) 44px' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--accent-soft, var(--v-terra-soft))',
              color: 'var(--accent-ink, var(--v-terra-ink))',
              fontSize: 11.5, fontWeight: 700, borderRadius: RV.pill, padding: '6px 13px',
            }}>
              Apartat {i + 1} de {total}
            </span>
            <span style={{
              background: V.surface, border: `1px solid ${V.border}`, color: V.muted,
              fontSize: 11.5, fontWeight: 700, borderRadius: RV.pill, padding: '6px 13px',
            }}>
              {apartat.minuts} min de lectura
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(26px,3.4vw,34px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.12, margin: '0 0 8px' }}>
            {apartat.titol}
          </h2>
          {(apartat.subtitol || contingut.subtitol) && (
            <p style={{ fontSize: 14, color: V.muted, margin: '0 0 26px' }}>
              {apartat.subtitol ?? contingut.subtitol}
            </p>
          )}

          {apartat.blocs.map((b, k) => <Bloc key={k} b={b} />)}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => nav(rutes.test)}
              style={{
                flex: 1, minWidth: 200, cursor: 'pointer', border: 'none', borderRadius: RV.md,
                padding: 16, background: V.fill, color: V.fillFg, fontSize: 14.5, fontWeight: 800,
              }}>
              Fes el test d'aquest tema
            </button>
            {i + 1 < total && (
              <button
                type="button"
                onClick={() => { setI(i + 1); window.scrollTo(0, 0); }}
                style={{
                  cursor: 'pointer', border: `1px solid ${V.border}`, borderRadius: RV.md,
                  padding: '16px 22px', background: V.surface, color: V.ink,
                  fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                Següent apartat →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
