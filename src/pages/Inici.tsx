// Pantalla d'inici de l'àrea privada (disseny v3 · "Web Inici").
//
// Tot el que es veu aquí surt de l'activitat real de l'usuari: els temes
// que ha tocat, les notes que ha tret i els errors que té pendents. Si
// encara no ha fet res, es diu clarament en comptes d'ensenyar xifres
// inventades.
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TOPICS } from '../data/tests';
import { useAuth } from '../lib/auth';
import type { PerfilUs } from '../lib/db';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES } from '../lib/noticies';
import { globalAverage, useGlobalStats } from '../lib/testStats';
import { CardV, I, Mono, RV, TitolV, V, XipV, type NomIc } from '../lib/v3';

const DIES = ['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'];

/** "Dijous, 31 de juliol" — la data d'avui en català. */
function dataAvui(): string {
  const d = new Date();
  const dia = d.toLocaleDateString('ca-ES', { weekday: 'long' });
  const mes = d.toLocaleDateString('ca-ES', { month: 'long' });
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${d.getDate()} de ${mes}`;
}

/**
 * Activitat dels darrers set dies.
 *
 * No desem un historial dia a dia, així que es dedueix de `lastAt`: cada
 * tema recorda quan el vas tocar per última vegada. Compta temes per dia,
 * no preguntes — és una mesura modesta, però és certa.
 */
function setmana(topics: Record<string, { lastAt: number }>) {
  const ara = new Date();
  const inici = new Date(ara.getFullYear(), ara.getMonth(), ara.getDate());
  inici.setDate(inici.getDate() - ((ara.getDay() + 6) % 7));   // dilluns

  const compte = new Array(7).fill(0);
  for (const t of Object.values(topics)) {
    if (!t?.lastAt) continue;
    const dies = Math.floor((new Date(t.lastAt).getTime() - inici.getTime()) / 86400000);
    if (dies >= 0 && dies < 7) compte[dies]++;
  }
  const max = Math.max(1, ...compte);
  const avui = (ara.getDay() + 6) % 7;
  return DIES.map((d, i) => ({ d, valor: compte[i] / max, avui: i === avui }));
}

function nota(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');
}

function MiniStat({ icona, valor, unitat, etiqueta, tint, accent }: {
  icona: NomIc; valor: string; unitat?: string; etiqueta: string; tint: string; accent: string;
}) {
  return (
    <CardV pad={18} r={RV.lg}>
      <span style={{
        width: 34, height: 34, borderRadius: 11, background: tint, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={icona} size={17} sw={1.9} />
      </span>
      <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -1, marginTop: 13 }}>
        {valor}
        {unitat && <span style={{ fontSize: 13, color: V.muted, fontWeight: 600 }}> {unitat}</span>}
      </div>
      <div style={{ fontSize: 12.5, color: V.muted, fontWeight: 600, marginTop: 3 }}>{etiqueta}</div>
    </CardV>
  );
}

function Tasca({ icona, titol, sub, tint, accent, to }: {
  icona: NomIc; titol: string; sub: string; tint: string; accent: string; to: string;
}) {
  return (
    <Link
      to={to}
      style={{
        width: '100%', background: V.paper, color: V.ink, borderRadius: RV.md, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
      }}>
      <span style={{
        width: 36, height: 36, flexShrink: 0, borderRadius: 12, background: tint, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={icona} size={17} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, letterSpacing: -0.25 }}>{titol}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: V.muted, marginTop: 2 }}>{sub}</span>
      </span>
      <I n="arrow" size={14} sw={2.4} color={V.faint} />
    </Link>
  );
}

/**
 * Les dreceres del costat dret, segons per a què fa servir l'app.
 *
 * Qui està en actiu no vol flashcards com a primera opció: vol el
 * catàleg i les checklists. Qui s'ho prepara, al revés. Qui fa les dues
 * coses veu una barreja. Res queda amagat — tot segueix a la barra
 * lateral.
 */
function dreceresPer(perfil: PerfilUs | null, pendents: number): Parameters<typeof Tasca>[0][] {
  const repas = {
    icona: 'brain' as NomIc, titol: 'Repàs intel·ligent',
    sub: pendents > 0 ? `${pendents} preguntes pendents` : 'Cap pregunta pendent',
    tint: V.terraSoft, accent: V.terraInk, to: '/policia-local/debilitats',
  };
  const flash = {
    icona: 'cards' as NomIc, titol: 'Flashcards', sub: 'Memoritza articles i xifres',
    tint: V.blueSoft, accent: V.blue, to: '/policia-local/flashcards',
  };
  const reptes = {
    icona: 'medal' as NomIc, titol: 'Reptes', sub: 'Missions i objectius',
    tint: V.warnSoft, accent: V.warn, to: '/retos',
  };
  const cataleg = {
    icona: 'car' as NomIc, titol: 'Catàleg SCT', sub: 'Infracció, quantia i punts',
    tint: V.terraSoft, accent: V.terraInk, to: '/operativa?sec=cataleg',
  };
  const checklists = {
    icona: 'tree' as NomIc, titol: 'Checklists penals', sub: 'Arbre de decisió',
    tint: V.granateSoft, accent: V.granate, to: '/operativa/penal',
  };
  const croquis = {
    icona: 'crash' as NomIc, titol: 'Croquis', sub: "Esquema d'accident",
    tint: V.okSoft, accent: V.ok, to: '/croquis',
  };

  if (perfil === 'actiu') return [cataleg, checklists, croquis];
  if (perfil === 'ambdos') return [repas, cataleg, checklists];
  return [repas, flash, reptes];
}

export default function Inici() {
  const nav = useNavigate();
  const { profile } = useAuth();
  const stats = useGlobalStats();
  const failures = useFailuresCounts();
  const { attempts, avgGrade } = globalAverage(stats);

  const perfil = profile?.perfil_us ?? null;
  const dreceres = useMemo(() => dreceresPer(perfil, failures.due), [perfil, failures.due]);

  const barres = useMemo(() => setmana(stats.topics), [stats.topics]);

  // Tema en curs: l'últim que va tocar.
  const enCurs = useMemo(() => {
    let millor: { slug: string; lastAt: number; last: number } | null = null;
    for (const [slug, t] of Object.entries(stats.topics)) {
      if (!t?.lastAt) continue;
      if (!millor || t.lastAt > millor.lastAt) millor = { slug, lastAt: t.lastAt, last: t.last };
    }
    if (!millor) return null;
    const topic = TOPICS.find((t) => t.slug === millor!.slug);
    if (!topic) return null;
    return { topic, nota: millor.last };
  }, [stats.topics]);

  const novetats = useMemo(
    () => [...NOTICIES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3),
    [],
  );

  const temesTocats = Object.keys(stats.topics).length;

  return (
    <div className="v3-page v3-anim">
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap', marginBottom: 22,
      }}>
        <div>
          <TitolV fort="Resum" post="de la teva preparació" />
          <p style={{ fontSize: 13.5, color: V.muted, margin: '8px 0 0' }}>
            {dataAvui()}
            {failures.due > 0 && ` · Tens ${failures.due} pregunta${failures.due === 1 ? '' : 's'} per repassar`}
          </p>
        </div>
      </div>

      <div className="v3-cols">
        {/* ── Columna principal ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <CardV pad={24}>
            {enCurs ? (
              <>
                <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                  <XipV bg={V.terra} fg="#fff">En curs</XipV>
                  <XipV>{enCurs.topic.questions.length} preguntes</XipV>
                </div>
                <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.9 }}>{enCurs.topic.title}</div>
                <div style={{ fontSize: 13.5, color: V.muted, marginTop: 6, lineHeight: 1.45 }}>
                  Última nota: {nota(enCurs.nota)} sobre 10.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 120, height: 9, borderRadius: RV.pill, background: V.surface2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(enCurs.nota * 10)}%`, height: '100%', borderRadius: RV.pill, background: V.terra }} />
                  </div>
                  <Mono size={12.5} color={V.muted} style={{ fontWeight: 700, letterSpacing: 0 }}>
                    {Math.round(enCurs.nota * 10)}%
                  </Mono>
                  <button
                    type="button"
                    onClick={() => nav(`/policia-local/${enCurs.topic.slug}`)}
                    style={{
                      border: 'none', background: V.fill, color: V.fillFg, borderRadius: RV.pill,
                      padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                    Torna-hi
                  </button>
                </div>
              </>
            ) : (
              <>
                <XipV bg={V.terraSoft} fg={V.terraInk}>Comença aquí</XipV>
                <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.9, marginTop: 14 }}>
                  Encara no has fet cap test
                </div>
                <div style={{ fontSize: 13.5, color: V.muted, marginTop: 6, lineHeight: 1.45 }}>
                  Fes-ne un de qualsevol tema i aquí veuràs per on vas, què et falla i què toca repassar.
                </div>
                <button
                  type="button"
                  onClick={() => nav('/policia-local')}
                  style={{
                    marginTop: 20, border: 'none', background: V.fill, color: V.fillFg, borderRadius: RV.pill,
                    padding: '12px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                  }}>
                  Tria un tema
                </button>
              </>
            )}
          </CardV>

          <CardV>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45 }}>Activitat setmanal</div>
              <Mono size={10.5} color={V.muted}>{temesTocats} TEMES TOCATS</Mono>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 11, height: 126, marginTop: 20 }}>
              {barres.map((b, i) => (
                <div key={b.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: '100%', height: `${Math.max(6, Math.round(b.valor * 100))}%`,
                    borderRadius: RV.pill, background: b.avui ? V.terra : V.surface2,
                    position: 'relative', transformOrigin: 'bottom',
                    animation: `v3Grow .5s ease both`, animationDelay: `${i * 0.05}s`,
                  }}>
                    {b.avui && (
                      <span style={{
                        position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)',
                        width: 8, height: 8, borderRadius: '50%', background: '#fff',
                      }} />
                    )}
                  </div>
                  <Mono size={9.5} color={b.avui ? V.ink : V.muted} style={{ letterSpacing: 0 }}>{b.d}</Mono>
                </div>
              ))}
            </div>
          </CardV>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16 }}>
            <MiniStat
              icona="check" valor={String(attempts)} etiqueta="Tests fets"
              tint={V.okSoft} accent={V.ok}
            />
            <MiniStat
              icona="chart" valor={attempts ? nota(avgGrade) : '—'} unitat={attempts ? '/10' : undefined}
              etiqueta="Nota mitjana" tint={V.blueSoft} accent={V.blue}
            />
            <MiniStat
              icona="brain" valor={String(failures.total)} etiqueta="Preguntes fallades"
              tint={V.terraSoft} accent={V.terraInk}
            />
          </div>
        </div>

        {/* ── Columna lateral ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => nav('/policia-local')}
            style={{
              textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: RV.xl, padding: 22,
              background: V.terra, color: '#fff', boxShadow: '0 14px 30px rgba(255,122,26,.32)',
            }}>
            <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{
                width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,.24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I n="check" size={21} sw={2} color="#fff" />
              </span>
              <span style={{
                width: 36, height: 36, borderRadius: '50%', background: '#fff', color: V.terra,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" style={{ width: 15, height: 15 }} fill="currentColor" aria-hidden>
                  <path d="M9 5.5v13l10-6.5Z" />
                </svg>
              </span>
            </span>
            <span style={{ display: 'block', fontSize: 23, fontWeight: 800, letterSpacing: -0.9, marginTop: 18 }}>
              Fes un test
            </span>
            <span style={{ display: 'block', fontSize: 13.5, opacity: 0.92, marginTop: 5, lineHeight: 1.45 }}>
              Tria tema i posa't a prova
            </span>
          </button>

          <CardV>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45, marginBottom: 14 }}>
              {perfil === 'actiu' ? 'Per al servei' : 'Avui et toca'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {dreceres.map((d) => <Tasca key={d.titol} {...d} />)}
            </div>
          </CardV>

          <CardV>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45 }}>Novetats</div>
              <Link to="/noticies" style={{ textDecoration: 'none' }}>
                <Mono size={9.5} color={V.terraInk}>VEURE-LES</Mono>
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {novetats.map((n) => (
                <Link
                  key={n.slug}
                  to={`/noticies/${n.slug}`}
                  style={{ display: 'flex', gap: 11, alignItems: 'flex-start', textDecoration: 'none', color: V.ink }}>
                  <span style={{ width: 4, alignSelf: 'stretch', borderRadius: RV.pill, background: V.terra, flexShrink: 0 }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Mono size={9} color={V.muted} style={{ display: 'block', letterSpacing: 1.2 }}>
                      {new Date(n.publishedAt).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' }).toUpperCase()}
                      {n.source ? ` · ${n.source}` : ''}
                    </Mono>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginTop: 4 }}>
                      {n.title}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </CardV>
        </div>
      </div>
    </div>
  );
}
