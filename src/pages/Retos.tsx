// Pàgina Reptes (Acadèmia · gamificació) · rebranding 2026.
// Estil Duolingo: HUD amb stats, day banner, path/map de lliçons,
// reptes destacats (lliga llamp i marató pro), customize avatar,
// achievements grid, shop. Sidebar amb streak, daily quests i lliga.
//
// Comportament funcional:
//   - Cada node del path enllaça un tema real del temari (els 10
//     primers TOPICS de category 'temari'). El nivell d'avenç (done /
//     current / locked) es deriva del progrés real de cada tema.
//   - La personalització (color, mascota, insígnia, tema) es persisteix
//     a localStorage.
//   - La graella d'assoliments mostra els ACHIEVEMENTS reals amb estat
//     desbloquejat segons useGlobalStats().achievements.
//   - Els reptes diaris es calculen a partir de l'activitat d'avui.
//   - La lliga és un placeholder visual fins que tinguem backend.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS, getTopicsByCategory } from '../data/tests';
import { getAnsweredIds } from '../lib/testProgress';
import { useFailuresCounts } from '../lib/failures';
import { useGlobalStats } from '../lib/testStats';
import { ACHIEVEMENTS as REAL_ACHIEVEMENTS } from '../lib/achievements';
import { useAuth } from '../lib/auth';
import { getLeaderboard, type LeaderboardEntry } from '../lib/db';

/* ── Helpers de stats (calculades del progrés real) ─────── */
function useGameStats() {
  const totalAnswered = TOPICS.reduce(
    (acc, top) => acc + getAnsweredIds(top.slug).size,
    0,
  );
  const xp = totalAnswered * 12;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const xpInLevel = xp - (level - 1) * 200;
  const xpToNext = 200;
  const streakDays = Math.min(99, Math.max(1, Math.floor(totalAnswered / 4)));
  const gems = Math.max(0, totalAnswered * 5);
  const hearts = 5;
  return { totalAnswered, xp, level, xpInLevel, xpToNext, streakDays, gems, hearts };
}

/* ── Path nodes — derivats del progrés real dels temes ───── */
type PathNodeView = {
  slug: string;
  title: string;
  state: 'done' | 'current' | 'locked';
  icon: string;
  marginLeft: number;
  pct: number;
};

// Marges (alternants serpentejants) i icones (alternant lliçó / repte).
const PATH_LAYOUT = [
  { ml: -120, ico: '★' },
  { ml: 60,   ico: '📖' },
  { ml: 140,  ico: '★' },
  { ml: 80,   ico: '📖' },
  { ml: -40,  ico: '★' },
  { ml: -160, ico: '📖' },
  { ml: -80,  ico: '★' },
  { ml: 60,   ico: '⚡' },
  { ml: 160,  ico: '📖' },
  { ml: 80,   ico: '⚡' },
];

function buildPathNodes(): PathNodeView[] {
  const temari = getTopicsByCategory('temari').slice(0, PATH_LAYOUT.length);
  return temari.map((topic, i) => {
    const total = topic.questions.length;
    const answered = getAnsweredIds(topic.slug).size;
    const pct = total > 0 ? answered / total : 0;
    return {
      slug: topic.slug,
      title: topic.title,
      pct: Math.round(pct * 100),
      icon: PATH_LAYOUT[i].ico,
      marginLeft: PATH_LAYOUT[i].ml,
      // 'done' si ≥80% respost, 'current' si en curs o si és el primer
      // tema sense progrés, 'locked' la resta (visualment, però amb
      // navegació igualment habilitada — no bloquegem cap test).
      state: pct >= 0.8 ? 'done' : pct > 0 ? 'current' : 'locked',
    } as PathNodeView;
  }).map((n, i, arr) => {
    // Marca com a 'current' el primer 'locked' si no hi ha cap 'current'
    // — així sempre tenim un node "actiu" amb el banderí "EMPEZAR".
    if (n.state !== 'locked') return n;
    const hasCurrent = arr.some((x) => x.state === 'current');
    if (!hasCurrent && arr.slice(0, i).every((x) => x.state !== 'locked')) {
      return { ...n, state: 'current' };
    }
    return n;
  });
}

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Calcula el dia de la setmana com a índex 0..6 (L=0, M=1, ..., D=6).
function dayOfWeekIdx(ts: number): number {
  // getDay(): D=0, L=1, ..., S=6 → reordenem a L=0 ... D=6
  const d = new Date(ts).getDay();
  return d === 0 ? 6 : d - 1;
}

// Per a cada dia de la setmana actual (L..D), si l'usuari ha fet algun
// test aquell dia (mateixa setmana del calendari), marca 'done'. El dia
// d'avui sempre és 'today' (encara que sense activitat). Els dies futurs
// són 'pending'. Els passats sense activitat són 'miss'.
function buildWeekStatus(stats: ReturnType<typeof useGlobalStats>): Array<'done' | 'today' | 'miss' | 'pending'> {
  const today = new Date();
  const todayIdx = dayOfWeekIdx(today.getTime());
  // Inici de la setmana actual (dilluns 00:00)
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - todayIdx);

  const out: Array<'done' | 'today' | 'miss' | 'pending'> = ['miss', 'miss', 'miss', 'miss', 'miss', 'miss', 'miss'];
  for (const s of Object.values(stats.topics)) {
    if (!s.lastAt) continue;
    if (s.lastAt < monday.getTime()) continue;
    const idx = dayOfWeekIdx(s.lastAt);
    if (idx < todayIdx) out[idx] = 'done';
  }
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) out[i] = 'today';
    else if (i > todayIdx) out[i] = 'pending';
  }
  return out;
}

/* ── Customització persistent (color/mascota/insígnia/tema) ── */
const CUST_KEY = 'infopol-retos-cust';
type Cust = { color: number; pet: number; badge: number; theme: number };
const DEFAULT_CUST: Cust = { color: 0, pet: 0, badge: 0, theme: 0 };

function readCust(): Cust {
  if (typeof localStorage === 'undefined') return DEFAULT_CUST;
  try {
    const raw = localStorage.getItem(CUST_KEY);
    if (!raw) return DEFAULT_CUST;
    return { ...DEFAULT_CUST, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CUST;
  }
}

function useCustomization() {
  const [cust, setCust] = useState<Cust>(readCust);
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(CUST_KEY, JSON.stringify(cust)); }
    catch { /* localStorage ple → ignorem en silenci */ }
  }, [cust]);
  return [cust, setCust] as const;
}

/* ── Activitat d'avui (per als reptes diaris) ─────────────── */
function isSameDay(a: number, b: number): boolean {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear()
    && da.getMonth() === db.getMonth()
    && da.getDate() === db.getDate();
}

export default function Retos() {
  useT();
  const stats = useGameStats();
  const { due: failuresDue } = useFailuresCounts();
  const globalStats = useGlobalStats();
  const { user, profile, backendEnabled } = useAuth();

  // Lliga setmanal real (Supabase) — només si hi ha backend.
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  useEffect(() => {
    if (!backendEnabled) return;
    let cancelled = false;
    setLeaderboardLoading(true);
    getLeaderboard(20)
      .then((data) => {
        if (!cancelled) setLeaderboard(data);
      })
      .catch(() => {
        // Sense lliga → array buit, mostrarem missatge.
      })
      .finally(() => {
        if (!cancelled) setLeaderboardLoading(false);
      });
    return () => { cancelled = true; };
  }, [backendEnabled]);

  // Nom mostrat: profile.name, user_metadata.name, primera part del correu, o 'Tu'.
  const displayName =
    profile?.name ??
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Tu';
  const initial = displayName.slice(0, 1).toUpperCase();
  const cuerpoLabel = profile?.cuerpo
    ? `NIVELL ${stats.level} · ${profile.cuerpo.toUpperCase()}`
    : `NIVELL ${stats.level}`;

  // Estat dels 7 dies de la setmana actual a partir de l'activitat real.
  const weekStatus = useMemo(() => buildWeekStatus(globalStats), [globalStats]);

  const [cust, setCust] = useCustomization();
  const { color: colorIdx, pet: petIdx, badge: badgeIdx, theme: themeIdx } = cust;
  const setColorIdx = (i: number) => setCust((c) => ({ ...c, color: i }));
  const setPetIdx = (i: number) => setCust((c) => ({ ...c, pet: i }));
  const setBadgeIdx = (i: number) => setCust((c) => ({ ...c, badge: i }));
  const setThemeIdx = (i: number) => setCust((c) => ({ ...c, theme: i }));

  // Reconstruïm el path quan canvia el progrés (les claus de
  // localStorage de testProgress).
  const pathNodes = useMemo(
    () => buildPathNodes(),
    // re-execució en re-render — getAnsweredIds llegeix del localStorage
    // i el useGlobalStats força refresh quan acabem un test.
    [globalStats],
  );

  // Activitat d'avui: tests fets avui i XP guanyats avui.
  const today = useMemo(() => {
    let testsToday = 0;
    let xpToday = 0;
    let perfectToday = 0;
    const now = Date.now();
    for (const s of Object.values(globalStats.topics)) {
      if (s.lastAt && isSameDay(s.lastAt, now)) {
        testsToday++;
        // Aproximació d'XP avui: 12 XP per cada pregunta de l'últim
        // test (a falta d'historial detallat per intent).
        xpToday += (s.totalCorrect ?? 0) > 0
          ? Math.round((s.totalCorrect / Math.max(1, s.attempts)) * 12)
          : 0;
        if (s.last >= 9.5) perfectToday++;
      }
    }
    return { testsToday, xpToday, perfectToday };
  }, [globalStats]);

  // Quest progress
  const dailyXp = Math.min(50, today.xpToday);
  const objectivePct = Math.round((dailyXp / 50) * 100);
  const lessonQuestPct = today.testsToday > 0 ? 100 : 0;
  const perfectQuestN = Math.min(3, today.perfectToday);
  const perfectQuestPct = Math.round((perfectQuestN / 3) * 100);

  // Pulse animation on progress bars after mount
  useEffect(() => {
    const bars = document.querySelectorAll('.pbar2 > span, .qbar > span, .pbar3 > span');
    bars.forEach((b) => {
      const el = b as HTMLElement;
      const w = el.style.width;
      el.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w; }));
    });
  }, []);

  return (
    <>
      {/* HUD top */}
      <header className="retos-hud">
        <div className="retos-hud-inner">
          <Link to="/academia" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>
            ← Acadèmia
          </Link>
          <div className="stats">
            <span className="stat streak"><span className="ico">🔥</span>{stats.streakDays}</span>
            <span className="stat gems"><span className="ico">💎</span>{stats.gems.toLocaleString('es-ES')}</span>
            <span className="stat hearts"><span className="ico">❤️</span>{stats.hearts}/5</span>
            <span className="stat xp"><span className="ico">⚡</span>{stats.xp.toLocaleString('es-ES')} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/perfil" className="avatar" title={displayName}>
              {initial}
            </Link>
          </div>
        </div>
      </header>

      <main className="retos-shell">
        <div className="min-w-0">

          {/* Day banner */}
          <section className="day-banner">
            <div className="eyebrow">REPTE DIARI · AVUI</div>
            <h1>Hola! Portes una ratxa de {stats.streakDays} dies 🔥</h1>
            <p>
              {failuresDue > 0
                ? <>Tens <b style={{ color: '#fff' }}>{failuresDue} repassos pendents</b> · acaba avui i desbloqueja el cofre setmanal.</>
                : <>Et queden <b style={{ color: '#fff' }}>{Math.max(1, Math.ceil((50 - dailyXp) / 12))} lliçons</b> per completar el teu objectiu diari i desbloquejar el cofre setmanal.</>
              }
            </p>
            <div className="day-progress">
              <div className="pbar2"><span style={{ width: `${objectivePct}%` }} /></div>
              <span className="day-meta"><b>{dailyXp}/50 XP</b> · Objectiu diari</span>
            </div>
          </section>

          {/* Path / map · enllaça temes reals del temari */}
          <section className="path-section">
            <header className="path-head">
              <h2>RUTA TEMARI · TEMES OFICIALS</h2>
              <span className="unit">
                {pathNodes.filter((n) => n.state === 'done').length}/{pathNodes.length}{' '}
                completats
              </span>
            </header>
            <div className="path">
              {pathNodes.map((n, i) => {
                const node = (
                  <Link
                    key={`n-${i}`}
                    to={`/policia-local/${n.slug}`}
                    className="path-row"
                    title={`${n.title} · ${n.pct}%`}
                  >
                    <div className={`node ${n.state}`} style={{ marginLeft: n.marginLeft }}>
                      {n.state === 'current' && <span className="pop">COMENÇAR!</span>}
                      <div className="ring" />
                      <span className="icon-emoji">{n.icon}</span>
                    </div>
                  </Link>
                );
                if (i === 3) {
                  return (
                    <div key={`chk-${i}`}>
                      {node}
                      <div className="checkpoint">
                        <div className="line" />
                        <span className="badge-chk">
                          📍 CHECKPOINT · {pathNodes[i + 1]?.title ?? 'Següent bloc'}
                        </span>
                        <div className="line" />
                      </div>
                    </div>
                  );
                }
                return node;
              })}
              <div className="checkpoint">
                <div className="line" />
                <span
                  className="badge-chk"
                  style={{ background: '#F5E9FF', color: '#6c2bb4', borderColor: '#d3b6ee' }}
                >
                  👑 BOSS · Test de tots els temes
                </span>
                <div className="line" />
              </div>
              <div className="path-row">
                <Link
                  to="/policia-local/tot"
                  className="node boss"
                  style={{ width: 96, height: 96 }}
                  title="Test de tots els temes"
                >
                  <div className="ring" />
                  <span className="icon-emoji" style={{ fontSize: 38 }}>👑</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Featured challenges — enllaços reals (no placeholders) */}
          <section className="challenges">
            <Link to="/policia-local/tot" className="ch-card live">
              <span className="ch-tag live">⚡ TEST RÀPID · MIX</span>
              <h3>🎯 Test mix · tots els temes</h3>
              <p>Preguntes barrejades de tot el temari de Policia Local. Posa't a prova en una sola tirada.</p>
              <div className="ch-meta">
                <span className="chip">⏱️ ~10 min</span>
                <span className="chip">📚 Tots els temes</span>
                <span className="chip">🎲 Aleatori</span>
              </div>
              <span className="ch-cta">Començar →</span>
            </Link>
            <Link to="/policia-local/repas" className="ch-card pro">
              <span className="ch-tag pro">🔁 REPÀS</span>
              <h3>Repàs intel·ligent (Anki)</h3>
              <p>Repassa les preguntes que has fallat segons la corba de l'oblit. Més efectiu que rellegir.</p>
              <div className="ch-meta">
                <span className="chip">⏱️ ~5 min</span>
                <span className="chip">🧠 SRS</span>
                <span className="chip">{failuresDue} pendents</span>
              </div>
              <span className="ch-cta">Repassar →</span>
            </Link>
          </section>

          {/* Customize / personalization */}
          {(() => {
            const COLORS = [
              { grad: 'linear-gradient(135deg, #F26B1F, #D9531A)', name: 'Terracotta' },
              { grad: 'linear-gradient(135deg, #2F6BD8, #1f4ea0)', name: 'Blau' },
              { grad: 'linear-gradient(135deg, #2FB66B, #1f8a4d)', name: 'Verd' },
              { grad: 'linear-gradient(135deg, #9747D6, #6c2bb4)', name: 'Lila' },
            ];
            const PETS = ['🦉', '🐺', '🦊'];
            const BADGES = [
              { bg: '#FFE9D8', icon: '🎓', name: 'Acadèmica' },
              { bg: '#EAF1FE', icon: '⚖️', name: 'Justícia' },
              { bg: '#DFF7E9', icon: '🛡️', name: 'Escut' },
            ];
            const selColor = COLORS[colorIdx] ?? COLORS[0];
            const selPet = PETS[petIdx] ?? PETS[0];
            const selBadge = BADGES[badgeIdx] ?? BADGES[0];
            return (
              <section className="custom">
                <div className="avatar-preview">
                  <div
                    className="av-big"
                    style={{
                      background: selColor.grad,
                      color: '#fff',
                      transition: 'background 0.25s',
                      position: 'relative',
                    }}
                  >
                    {initial}
                    <span
                      style={{
                        position: 'absolute',
                        right: -8,
                        bottom: -8,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: selBadge.bg,
                        border: '3px solid var(--white)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      }}
                      aria-label={`Insígnia ${selBadge.name}`}
                    >
                      {selBadge.icon}
                    </span>
                  </div>
                  <div className="av-name">
                    <span style={{ marginRight: 6, fontSize: 18 }}>{selPet}</span>
                    {displayName}
                  </div>
                  <div className="av-rank">{cuerpoLabel}</div>
                  <div className="lvl-bar">
                    <div className="pbar3">
                      <span style={{ width: `${Math.round((stats.xpInLevel / stats.xpToNext) * 100)}%` }} />
                    </div>
                    <span className="num">
                      {stats.xpInLevel.toLocaleString('es-ES')} / {stats.xpToNext.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
                <div>
                  <h3>Personalitza el teu agent</h3>
                  <p className="sub">
                    Tria color, mascota i insígnia. Es desen automàticament i es reflecteixen al teu avatar.
                  </p>
                  <div className="cu-grid">
                    <div className="cu-block">
                      <span className="lab">Color d'uniforme</span>
                      <div className="cu-options">
                        {COLORS.map((c, i) => (
                          <button
                            key={`color-${i}`}
                            type="button"
                            className={`swatch ${colorIdx === i ? 'sel' : ''}`}
                            style={{ background: c.grad }}
                            onClick={() => setColorIdx(i)}
                            aria-label={c.name}
                            aria-pressed={colorIdx === i}
                            title={c.name}
                          />
                        ))}
                        <span className="swatch lock" style={{ background: 'linear-gradient(135deg, #0E0E0E, #2a2a2a)' }} />
                        <span className="swatch lock" style={{ background: 'linear-gradient(135deg, #E89A1C, #b87a14)' }} />
                      </div>
                    </div>
                    <div className="cu-block">
                      <span className="lab">Mascota guia</span>
                      <div className="pet-row">
                        {PETS.map((p, i) => (
                          <button
                            key={`pet-${i}`}
                            type="button"
                            className={`pet ${petIdx === i ? 'sel' : ''}`}
                            onClick={() => setPetIdx(i)}
                            aria-label={`Mascota ${p}`}
                            aria-pressed={petIdx === i}
                          >
                            {p}
                          </button>
                        ))}
                        <span className="pet lock">🦁</span>
                        <span className="pet lock">🐉</span>
                      </div>
                    </div>
                    <div className="cu-block">
                      <span className="lab">Insígnia de banda</span>
                      <div className="cu-options">
                        {BADGES.map((b, i) => (
                          <button
                            key={`badge-${i}`}
                            type="button"
                            className={`swatch ${badgeIdx === i ? 'sel' : ''}`}
                            style={{ background: b.bg }}
                            onClick={() => setBadgeIdx(i)}
                            aria-label={b.name}
                            aria-pressed={badgeIdx === i}
                            title={b.name}
                          >
                            {b.icon}
                          </button>
                        ))}
                        <span className="swatch lock" style={{ background: '#FBE5B5' }}>⭐</span>
                      </div>
                    </div>
                    <div className="cu-block">
                      <span className="lab">Tema de l'app</span>
                      <div className="cu-options">
                        {[
                          { bg: 'var(--paper)', name: 'Clar' },
                          { bg: 'var(--ink)', name: 'Sistema' },
                        ].map((tt, i) => (
                          <button
                            key={`theme-${i}`}
                            type="button"
                            className={`swatch ${themeIdx === i ? 'sel' : ''}`}
                            style={{ background: tt.bg }}
                            onClick={() => setThemeIdx(i)}
                            aria-label={`Tema ${tt.name}`}
                            aria-pressed={themeIdx === i}
                            title={tt.name}
                          />
                        ))}
                        <span
                          className="swatch lock"
                          style={{ background: 'linear-gradient(135deg, #1f2a44, #0e1530)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Achievements · llistat real de logros amb estat real */}
          <section className="ach-section">
            <div
              className="section-head"
              style={{ ['--accent' as never]: 'var(--terracotta)' } as React.CSSProperties}
            >
              <span className="eyebrow">
                🏅 INSÍGNIES · {globalStats.achievements.length} / {REAL_ACHIEVEMENTS.length}{' '}
                DESBLOQUEJADES
              </span>
              <span className="rule" />
              <Link to="/policia-local/logros" className="see-all">Veure totes →</Link>
            </div>
            <div className="ach-grid">
              {REAL_ACHIEVEMENTS.map((a) => {
                const unlocked = globalStats.achievements.includes(a.id);
                return (
                  <div key={a.id} className={`ach ${unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="medal">{a.icon}</div>
                    <h4>{a.title}</h4>
                    <p>{a.description}</p>
                    <span className="lvl">{unlocked ? 'DESBLOQUEJADA' : 'BLOQUEJADA'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Botiga · placeholder coming-soon (sense items per evitar
              mostrar preus en gemmes que encara no es poden gastar). */}
          <section className="shop shop-empty" style={{
            background: 'var(--paper-2)',
            color: 'var(--text-2)',
            padding: '18px 22px',
            borderRadius: 14,
            border: '1px dashed var(--line)',
            marginTop: 28,
            textAlign: 'center',
          }}>
            <h3 style={{ color: 'var(--ink)', fontSize: 15, margin: 0 }}>
              💎 Botiga · pròximament
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '6px 0 0' }}>
              Aviat podràs gastar les teves gemmes en power-ups, vides extra i boosts.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="side-rail">
          <div className="side-card streak-card">
            <h3>RATXA SETMANAL</h3>
            <div className="streak-big">
              <span className="streak-num">{stats.streakDays}</span>
              <span className="streak-label">dies seguits 🔥</span>
            </div>
            <div className="streak-days">
              {DAYS.map((d, i) => {
                const cls = weekStatus[i];
                return (
                  <div key={`day-${i}`} className={`sd ${cls}`}>
                    <span className="dot">
                      {cls === 'done' ? '✓' : cls === 'today' ? '★' : cls === 'pending' ? '·' : '·'}
                    </span>
                    <span>{d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="side-card">
            <h3>REPTES DIARIS</h3>
            <p className="sub">Es reinicien en 8h 23m</p>
            <div className="mt-2">
              <div className={`quest ${lessonQuestPct >= 100 ? 'done' : ''}`}>
                <span className="qico">{lessonQuestPct >= 100 ? '✅' : '📖'}</span>
                <div>
                  <div className="qhead">Completa 1 lliçó</div>
                  <div className="qprog">
                    <span className="qbar">
                      <span style={{ width: `${lessonQuestPct}%`, background: '#2FB66B' }} />
                    </span>
                    <span>{lessonQuestPct >= 100 ? '1/1' : '0/1'}</span>
                  </div>
                </div>
                <span className="qreward">+15 ⚡</span>
              </div>
              <div className={`quest ${objectivePct >= 100 ? 'done' : ''}`}>
                <span className="qico" style={{ background: '#FFE9D8', color: 'var(--terracotta)' }}>⚡</span>
                <div>
                  <div className="qhead">Guanya 50 XP avui</div>
                  <div className="qprog">
                    <span className="qbar"><span style={{ width: `${objectivePct}%` }} /></span>
                    <span>{dailyXp}/50</span>
                  </div>
                </div>
                <span className="qreward">+30 💎</span>
              </div>
              <div className={`quest ${perfectQuestPct >= 100 ? 'done' : ''}`}>
                <span className="qico" style={{ background: '#EAF1FE', color: '#2F6BD8' }}>🎯</span>
                <div>
                  <div className="qhead">3 tests perfectes</div>
                  <div className="qprog">
                    <span className="qbar">
                      <span style={{ width: `${perfectQuestPct}%`, background: '#2F6BD8' }} />
                    </span>
                    <span>{perfectQuestN}/3</span>
                  </div>
                </div>
                <span className="qreward">+50 💎</span>
              </div>
              <div className={`quest ${failuresDue === 0 && stats.totalAnswered > 0 ? 'done' : ''}`}>
                <span className="qico" style={{ background: '#F5E9FF', color: '#9747D6' }}>🔁</span>
                <div>
                  <div className="qhead">Repassa fallades pendents</div>
                  <div className="qprog">
                    <span className="qbar">
                      <span
                        style={{
                          width: failuresDue === 0 ? '100%' : '0%',
                          background: '#9747D6',
                        }}
                      />
                    </span>
                    <span>{failuresDue === 0 ? '✓ al dia' : `${failuresDue} pendents`}</span>
                  </div>
                </div>
                <span className="qreward">+80 💎</span>
              </div>
            </div>
          </div>

          <div className="side-card league-card">
            <h3>LLIGA</h3>
            <p className="sub">Top 20 d'usuaris per XP</p>
            {!backendEnabled ? (
              <div className="lb-promo" style={{ background: 'var(--paper-2)', color: 'var(--text-2)' }}>
                Inicia sessió per veure la lliga.
              </div>
            ) : leaderboardLoading ? (
              <div className="lb-promo" style={{ background: 'var(--paper-2)', color: 'var(--text-2)' }}>
                Carregant…
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="lb-promo" style={{ background: 'var(--paper-2)', color: 'var(--text-2)' }}>
                Encara no hi ha cap participant. Sigues el primer fent un test!
              </div>
            ) : (
              <>
                <ul className="lb">
                  {leaderboard.slice(0, 5).map((l, i) => {
                    const rank = i + 1;
                    const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
                    const isMe = user?.id === l.id;
                    return (
                      <li key={`lb-${l.id}`}>
                        <span className={`rank ${rankClass}`}>{rank}</span>
                        <span className="name">
                          {l.display_name || 'Anònim'}
                          {isMe && <span className="me">TU</span>}
                        </span>
                        <span className="xp-num">{(l.total_xp ?? 0).toLocaleString('ca-ES')}</span>
                      </li>
                    );
                  })}
                </ul>
                {(() => {
                  const myIdx = leaderboard.findIndex((l) => l.id === user?.id);
                  if (myIdx === -1) {
                    return (
                      <div className="lb-promo">
                        Fes el primer test per entrar a la lliga →
                      </div>
                    );
                  }
                  if (myIdx === 0) {
                    return (
                      <div className="lb-promo">
                        🥇 Estàs al primer lloc!
                      </div>
                    );
                  }
                  const above = leaderboard[myIdx - 1];
                  const diff = (above.total_xp ?? 0) - (leaderboard[myIdx].total_xp ?? 0);
                  return (
                    <div className="lb-promo">
                      ⬆️ Et falten <b style={{ color: '#fff' }}>+{diff} XP</b> per pujar al lloc {myIdx}.
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </aside>
      </main>
    </>
  );
}
