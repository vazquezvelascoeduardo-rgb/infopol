// Diagnòstic per tema.
//
// Els números els calcula el servidor (RPC `topic_diagnostics`), el
// mateix que fa servir l'app: així les dues diuen el mateix i no hi ha
// dues maneres de comptar. Res mockejat — si no hi ha prou respostes,
// es diu "Sense dades" en comptes d'inventar un percentatge.
//
// Els llindars són els de l'app, a propòsit:
//   ≥ 90 %  Dominat
//   ≥ 70 %  En progrés
//   < 70 %  Prioritari
//   < 5 respostes en 30 dies → sense dades
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { CardV, I, Mono, RV, TitolV, V } from '../lib/v3';

type Cos = 'pl' | 'mossos';

type Fila = {
  topic_slug: string;
  title: string;
  category: string;
  ambit: string | null;
  subtema: number | null;
  total: number;
  vistes: number;
  encerts_30d: number;
  respostes_30d: number;
  darrer_repas: string | null;
  bloquejades: number;
};

type Estat = 'verd' | 'ambre' | 'roig' | 'gris';

const ETIQUETA: Record<Estat, string> = {
  verd: 'Dominat',
  ambre: 'En progrés',
  roig: 'Prioritari',
  gris: 'Sense dades',
};

const AMBIT_TITOL: Record<string, string> = {
  A: "Bloc A · Coneixement de l'entorn",
  B: 'Bloc B · Institucional i jurídic',
  C: 'Bloc C · Seguretat i policia',
};

const CAT_TITOL: Record<string, string> = {
  temari: 'Temari · Lleis',
  municipi: 'Municipis',
  cultura: 'Cultura general',
  actualitat: 'Actualitat',
};
const CAT_ORDRE = ['temari', 'municipi', 'cultura', 'actualitat'];

/** Tassa d'encert (0..1), o null si hi ha poques dades. */
function tassa(f: Fila): number | null {
  return f.respostes_30d >= 5 ? f.encerts_30d / f.respostes_30d : null;
}

function classifica(f: Fila): { estat: Estat; pct: number | null } {
  const r = tassa(f);
  const pct = r == null ? null : Math.round(r * 100);
  if (pct == null || f.vistes < 5) return { estat: 'gris', pct };
  if (pct >= 90) return { estat: 'verd', pct };
  if (pct >= 70) return { estat: 'ambre', pct };
  return { estat: 'roig', pct };
}

function colorDe(e: Estat): string {
  if (e === 'verd') return V.ok;
  if (e === 'ambre') return V.warn;
  if (e === 'roig') return V.granate;
  return V.faint;
}

function tintDe(e: Estat): string {
  if (e === 'verd') return V.okSoft;
  if (e === 'ambre') return V.warnSoft;
  if (e === 'roig') return V.granateSoft;
  return V.surface2;
}

/** Anell de progrés. */
function Anell({ pct, color, mida = 108 }: { pct: number | null; color: string; mida?: number }) {
  const r = mida / 2 - 9;
  const volta = 2 * Math.PI * r;
  const fet = pct == null ? 0 : (volta * pct) / 100;
  return (
    <div style={{ position: 'relative', width: mida, height: mida, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${mida} ${mida}`} style={{ width: mida, height: mida, transform: 'rotate(-90deg)' }} aria-hidden>
        <circle cx={mida / 2} cy={mida / 2} r={r} fill="none" stroke={V.surface2} strokeWidth="9" />
        <circle
          cx={mida / 2} cy={mida / 2} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`${fet} ${volta}`}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, fontWeight: 800, letterSpacing: -1, color: V.ink,
      }}>
        {pct == null ? '—' : `${pct}%`}
      </div>
    </div>
  );
}

export default function Diagnostic() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [cos, setCos] = useState<Cos>('pl');
  const [files, setFiles] = useState<Fila[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viu = true;
    if (!supabase || !user) { setFiles([]); return; }
    supabase.rpc('topic_diagnostics')
      .then(({ data, error: e }) => {
        if (!viu) return;
        if (e) { setError('No s\'han pogut carregar les dades.'); setFiles([]); return; }
        setFiles((data ?? []) as Fila[]);
      });
    return () => { viu = false; };
  }, [user]);

  const delCos = useMemo(() => {
    if (!files) return [];
    return files.filter((f) => (cos === 'mossos' ? f.category === 'mossos' : f.category !== 'mossos'));
  }, [files, cos]);

  const temes = useMemo(
    () => delCos.map((f) => ({ f, ...classifica(f) })),
    [delCos],
  );

  const dominats = temes.filter((x) => x.estat === 'verd').length;
  const estatPct = temes.length ? Math.round((dominats / temes.length) * 100) : 0;
  const ambDades = temes.filter((x) => x.estat !== 'gris');
  const prioritari = ambDades.length
    ? ambDades.reduce((m, x) => ((x.pct ?? 100) < (m.pct ?? 100) ? x : m))
    : null;

  // Agrupació: per àmbit a Mossos, per categoria a Policia Local.
  const seccions = useMemo(() => {
    const m = new Map<string, typeof temes>();
    for (const x of temes) {
      const clau = cos === 'mossos' ? (x.f.ambit ?? '?') : (x.f.category || 'temari');
      if (!m.has(clau)) m.set(clau, []);
      m.get(clau)!.push(x);
    }
    const claus = cos === 'mossos'
      ? [...m.keys()].sort()
      : CAT_ORDRE.filter((c) => m.has(c)).concat([...m.keys()].filter((c) => !CAT_ORDRE.includes(c)));
    return claus.map((c) => ({
      clau: c,
      titol: cos === 'mossos' ? (AMBIT_TITOL[c] ?? `Bloc ${c}`) : (CAT_TITOL[c] ?? c),
      items: m.get(c) ?? [],
    }));
  }, [temes, cos]);

  const buit = files !== null && temes.length === 0;

  return (
    <div className="v3-page v3-anim">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap', marginBottom: 20,
      }}>
        <TitolV fort="Diagnòstic" post="per tema" />
        <div style={{ display: 'inline-flex', background: V.surface2, borderRadius: RV.pill, padding: 4, gap: 4 }}>
          {([{ id: 'pl', label: 'Policia Local' }, { id: 'mossos', label: 'Mossos' }] as { id: Cos; label: string }[]).map((c) => {
            const on = c.id === cos;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCos(c.id)}
                aria-pressed={on}
                style={{
                  border: 'none', cursor: 'pointer', borderRadius: RV.pill, padding: '9px 18px',
                  fontSize: 13, fontWeight: on ? 800 : 600,
                  background: on ? V.surface : 'transparent', color: on ? V.ink : V.muted,
                  boxShadow: on ? V.shadow : 'none',
                }}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {files === null && <p style={{ fontSize: 13.5, color: V.muted }}>Calculant…</p>}
      {error && <p style={{ fontSize: 13.5, color: V.granate }}>{error}</p>}

      {buit && !error && (
        <CardV>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>Encara no hi ha prou dades</div>
          <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 16px', lineHeight: 1.5 }}>
            El diagnòstic necessita com a mínim cinc respostes per tema per dir-te res
            que no sigui inventat. Fes uns quants tests i torna.
          </p>
          <button
            type="button"
            onClick={() => nav(cos === 'mossos' ? '/mossos' : '/policia-local')}
            style={{
              border: 'none', background: V.fill, color: V.fillFg, borderRadius: RV.pill,
              padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
            }}>
            Fer un test
          </button>
        </CardV>
      )}

      {!buit && files !== null && (
        <>
          <div style={{
            background: 'var(--v-ink-fixed)', borderRadius: RV.xl, padding: 24, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20,
            boxShadow: '0 14px 30px rgba(21,21,28,.24)',
          }}>
            <div style={{ position: 'relative', width: 108, height: 108, flexShrink: 0 }}>
              <svg viewBox="0 0 108 108" style={{ width: 108, height: 108, transform: 'rotate(-90deg)' }} aria-hidden>
                <circle cx="54" cy="54" r="45" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="10" />
                <circle
                  cx="54" cy="54" r="45" fill="none" strokeWidth="10" strokeLinecap="round"
                  stroke={estatPct >= 60 ? V.ok : estatPct >= 30 ? V.warn : V.terra}
                  strokeDasharray={`${(2 * Math.PI * 45 * estatPct) / 100} ${2 * Math.PI * 45}`}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>{estatPct}%</span>
                <Mono size={8} color="rgba(255,255,255,.55)" style={{ marginTop: 3 }}>FORMA</Mono>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8 }}>
                {dominats} de {temes.length} temes dominats
              </div>
              {prioritari && (
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.66)', lineHeight: 1.5, marginTop: 7 }}>
                  El que més et costa ara: <b style={{ color: '#fff' }}>{prioritari.f.title}</b>
                  {prioritari.pct != null && ` (${prioritari.pct}%)`}.
                </div>
              )}
              <div style={{ display: 'flex', gap: 18, marginTop: 16, flexWrap: 'wrap' }}>
                {(['verd', 'ambre', 'roig', 'gris'] as Estat[]).map((e) => (
                  <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: colorDe(e) }} />
                    <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.75)' }}>
                      {ETIQUETA[e]} · {temes.filter((x) => x.estat === e).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {seccions.map((s) => (
            <div key={s.clau} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 }}>{s.titol}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
                {s.items.map((x) => (
                  <CardV
                    key={x.f.topic_slug}
                    pad={16}
                    r={RV.lg}
                    onClick={() => nav(`/${cos === 'mossos' ? 'mossos' : 'policia-local'}/${x.f.topic_slug}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <Anell pct={x.pct} color={colorDe(x.estat)} mida={52} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.25, lineHeight: 1.3 }}>
                          {x.f.title}
                        </div>
                        <span style={{
                          display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700,
                          borderRadius: RV.pill, padding: '4px 10px',
                          background: tintDe(x.estat), color: colorDe(x.estat),
                        }}>
                          {ETIQUETA[x.estat]}
                        </span>
                      </div>
                      <I n="arrow" size={14} sw={2.4} color={V.faint} />
                    </div>
                  </CardV>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
