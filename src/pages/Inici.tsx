// Pantalla d'inici de l'àrea privada — disseny v3 ("Web Inici"), tal qual.
//
// Estructura del disseny: titular + filtres a la dreta; a l'esquerra el
// tema en curs, l'activitat setmanal i tres indicadors (ratxa,
// experiència i gemmes); a la dreta el test ràpid, "Avui et toca" i les
// novetats.
//
// Les xifres surten de l'activitat real: els indicadors, de
// `user_progress` (el mateix que alimenta l'app mòbil); l'activitat
// setmanal i el tema en curs, dels tests que has fet.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TOPICS } from '../data/tests';
import { useAuth } from '../lib/auth';
import { getUserProgress, type PerfilUs, type UserProgress } from '../lib/db';
import { useFailuresCounts } from '../lib/failures';
import { NOTICIES } from '../lib/noticies';
import { useGlobalStats } from '../lib/testStats';
import { CardV, I, Mono, RV, TitolV, V, XipV, type NomIc } from '../lib/v3';

const DIES = ['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'];

const FILTRES = ['Tot', 'Acadèmia', 'Operativa', 'Reptes'] as const;
type Filtre = typeof FILTRES[number];

/** "Dijous, 31 de juliol" — la data d'avui en català. */
function dataAvui(): string {
  const d = new Date();
  const dia = d.toLocaleDateString('ca-ES', { weekday: 'long' });
  const mes = d.toLocaleDateString('ca-ES', { month: 'long' });
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${d.getDate()} de ${mes}`;
}

/** "juliol 2026", per a la fila d'actualitat. */
function mesAny(): string {
  const d = new Date();
  return `${d.toLocaleDateString('ca-ES', { month: 'long' })} ${d.getFullYear()}`;
}

/** 17300 → "17,3" + "k XP". Al disseny la xifra i la unitat van separades. */
function xp(n: number): { valor: string; unitat: string } {
  if (n < 1000) return { valor: String(n), unitat: 'XP' };
  return { valor: (n / 1000).toFixed(1).replace('.', ','), unitat: 'k XP' };
}

/** 7235 → "7.235". */
function milers(n: number): string {
  return n.toLocaleString('ca-ES');
}

/**
 * Activitat dels darrers set dies.
 *
 * No desem un historial dia a dia, així que es dedueix de `lastAt`: cada
 * tema recorda quan el vas tocar per última vegada. Compta temes per
 * dia, no preguntes — és una mesura modesta, però és certa.
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

type Tasca = {
  titol: string; sub: string; icona: NomIc; tint: string; accent: string; to: string;
  /** A quin filtre pertany. */
  grup: Exclude<Filtre, 'Tot'>;
};

/**
 * Les files d'"Avui et toca".
 *
 * Les tres primeres són les del disseny; les d'operativa s'hi afegeixen
 * perquè qui està en servei també hi trobi el seu. El filtre de dalt
 * decideix quines es veuen.
 */
function tasques(pendents: number, ratxa: number): Tasca[] {
  return [
    {
      titol: 'Fes un test ràpid',
      sub: ratxa > 0 ? `Mantén la ratxa de ${ratxa} dies` : 'Comença una ratxa',
      icona: 'check', tint: V.terraSoft, accent: V.terraInk, to: '/policia-local', grup: 'Acadèmia',
    },
    {
      titol: pendents > 0 ? `${pendents} preguntes de repàs` : 'Repàs intel·ligent',
      sub: pendents > 0 ? 'El sistema te les ha programat' : 'Cap pregunta pendent',
      icona: 'brain', tint: V.blueSoft, accent: V.blue, to: '/policia-local/debilitats', grup: 'Acadèmia',
    },
    {
      titol: `Actualitat · ${mesAny()}`,
      sub: 'Nou aquesta setmana',
      icona: 'news', tint: V.okSoft, accent: V.ok, to: '/actualitat', grup: 'Acadèmia',
    },
    {
      titol: 'Catàleg SCT',
      sub: 'Infracció, quantia i punts',
      icona: 'car', tint: V.terraSoft, accent: V.terraInk, to: '/operativa?sec=cataleg', grup: 'Operativa',
    },
    {
      titol: 'Checklists penals',
      sub: 'Arbre de decisió per escenari',
      icona: 'tree', tint: V.granateSoft, accent: V.granate, to: '/operativa/penal', grup: 'Operativa',
    },
    {
      titol: "Croquis d'accident",
      sub: 'Dibuixa i exporta a PNG',
      icona: 'crash', tint: V.okSoft, accent: V.ok, to: '/croquis', grup: 'Operativa',
    },
    {
      titol: 'Reptes',
      sub: 'Missions i objectius',
      icona: 'medal', tint: V.warnSoft, accent: V.warn, to: '/retos', grup: 'Reptes',
    },
  ];
}

/** Ordre de les tasques quan el filtre és "Tot", segons el perfil d'ús. */
function ordena(llista: Tasca[], perfil: PerfilUs | null): Tasca[] {
  if (perfil === 'actiu') {
    return [...llista].sort((a, b) => Number(b.grup === 'Operativa') - Number(a.grup === 'Operativa'));
  }
  return llista;
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

function FilaTasca({ t }: { t: Tasca }) {
  return (
    <Link
      to={t.to}
      style={{
        width: '100%', background: V.paper, color: V.ink, borderRadius: RV.md, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
      }}>
      <span style={{
        width: 36, height: 36, flexShrink: 0, borderRadius: 12, background: t.tint, color: t.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={t.icona} size={17} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, letterSpacing: -0.25 }}>{t.titol}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: V.muted, marginTop: 2 }}>{t.sub}</span>
      </span>
      <I n="arrow" size={14} sw={2.4} color={V.faint} />
    </Link>
  );
}

export default function Inici() {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const stats = useGlobalStats();
  const failures = useFailuresCounts();
  const [filtre, setFiltre] = useState<Filtre>('Tot');
  const [progres, setProgres] = useState<UserProgress | null>(null);

  useEffect(() => {
    let viu = true;
    if (!user) { setProgres(null); return; }
    getUserProgress(user.id).then((p) => { if (viu) setProgres(p); }).catch(() => {});
    return () => { viu = false; };
  }, [user]);

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
    return topic ? { topic, nota: millor.last } : null;
  }, [stats.topics]);

  const novetats = useMemo(
    () => [...NOTICIES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3),
    [],
  );

  const ratxa = progres?.streak_count ?? 0;
  const experiencia = xp(progres?.xp ?? 0);
  const gemmes = progres?.gems ?? 0;

  const llista = useMemo(() => {
    const totes = ordena(tasques(failures.due, ratxa), profile?.perfil_us ?? null);
    return filtre === 'Tot' ? totes : totes.filter((t) => t.grup === filtre);
  }, [failures.due, ratxa, filtre, profile?.perfil_us]);

  const apartats = enCurs ? Math.max(0, Math.round((10 - enCurs.nota))) : 0;

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
            {enCurs && apartats > 0 && ` · Et queden ${apartats} apartats del tema en curs`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 7, flexShrink: 0, flexWrap: 'wrap' }}>
          {FILTRES.map((f) => {
            const on = filtre === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFiltre(f)}
                aria-pressed={on}
                style={{
                  cursor: 'pointer', border: `1px solid ${on ? 'transparent' : V.border}`,
                  background: on ? V.fill : V.surface, color: on ? V.fillFg : V.ink,
                  borderRadius: RV.pill, padding: '9px 16px', fontSize: 12.5, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                {f}
              </button>
            );
          })}
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
                  Última nota: {enCurs.nota.toFixed(1).replace('.', ',')} sobre 10.
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
                    Continua estudiant
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
              <Mono size={10.5} color={V.muted}>
                {Object.keys(stats.topics).length} TEMES TOCATS
              </Mono>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 11, height: 126, marginTop: 20 }}>
              {barres.map((b, i) => (
                <div key={b.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: '100%', height: `${Math.max(6, Math.round(b.valor * 100))}%`,
                    borderRadius: RV.pill, background: b.avui ? V.terra : V.surface2,
                    position: 'relative', transformOrigin: 'bottom',
                    animation: 'v3Grow .5s ease both', animationDelay: `${i * 0.05}s`,
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
              icona="flame" valor={String(ratxa)} unitat="dies" etiqueta="Ratxa"
              tint={V.terraSoft} accent={V.terraInk}
            />
            <MiniStat
              icona="bolt" valor={experiencia.valor} unitat={experiencia.unitat} etiqueta="Experiència"
              tint={V.blueSoft} accent={V.blue}
            />
            <MiniStat
              icona="gem" valor={milers(gemmes)} etiqueta="Gemmes"
              tint={V.okSoft} accent={V.ok}
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
                <I n="play" size={15} ple color={V.terra} />
              </span>
            </span>
            <span style={{ display: 'block', fontSize: 23, fontWeight: 800, letterSpacing: -0.9, marginTop: 18 }}>
              Test ràpid
            </span>
            <span style={{ display: 'block', fontSize: 13.5, opacity: 0.92, marginTop: 5, lineHeight: 1.45 }}>
              Tria tema i posa't a prova
            </span>
          </button>

          <CardV>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45, marginBottom: 14 }}>Avui et toca</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {llista.length > 0
                ? llista.map((t) => <FilaTasca key={t.titol} t={t} />)
                : <p style={{ fontSize: 13, color: V.muted, margin: 0 }}>Res pendent en aquest filtre.</p>}
            </div>
          </CardV>

          <CardV>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.45 }}>Novetats</div>
              <Link to="/noticies" style={{ textDecoration: 'none' }}>
                <Mono size={9.5} color={V.terraInk}>{novetats.length} NOVES</Mono>
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
                      {n.source ? `${n.source} · ` : ''}
                      {new Date(n.publishedAt).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' }).toUpperCase()}
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
