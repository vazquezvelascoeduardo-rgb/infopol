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

const SHOP_ITEMS = [
  { ico: '❤️', title: 'Recarga total', desc: 'Llena tus 5 corazones', price: 350 },
  { ico: '🛡️', title: 'Protector racha', desc: 'Salva 1 día perdido', price: 200 },
  { ico: '⏰', title: 'Tiempo extra', desc: '+30s en duelos', price: 80 },
  { ico: '🚀', title: 'XP x2 (15 min)', desc: 'Doble experiencia', price: 150 },
];

const LEAGUE = [
  { rank: 1, name: '🦊 Lluís_M', xp: 3420, rankClass: 'gold' },
  { rank: 2, name: '🦉 Andrea7', xp: 3180, rankClass: 'silver' },
  { rank: 3, name: '🐺 Pol_22', xp: 2910, rankClass: 'bronze' },
  { rank: 4, name: '🦉 Tu', xp: 2847, rankClass: '', me: true },
  { rank: 5, name: '🐉 Jordi9', xp: 2612, rankClass: '' },
];

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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
            <button type="button" className="icon-btn" title="Notificaciones">
              <span style={{ fontSize: 18 }}>🔔</span>
            </button>
            <span className="avatar">M</span>
          </div>
        </div>
      </header>

      <main className="retos-shell">
        <div className="min-w-0">

          {/* Day banner */}
          <section className="day-banner">
            <div className="eyebrow">RETO DIARIO · HOY</div>
            <h1>¡Hola! Vas con racha de {stats.streakDays} días 🔥</h1>
            <p>
              {failuresDue > 0
                ? <>Tienes <b style={{ color: '#fff' }}>{failuresDue} repasos pendientes</b> · termina hoy y desbloquea el cofre semanal.</>
                : <>Te quedan <b style={{ color: '#fff' }}>{Math.max(1, Math.ceil((50 - dailyXp) / 12))} lecciones</b> para completar tu objetivo diario y desbloquear el cofre semanal.</>
              }
            </p>
            <div className="day-progress">
              <div className="pbar2"><span style={{ width: `${objectivePct}%` }} /></div>
              <span className="day-meta"><b>{dailyXp}/50 XP</b> · Objetivo diario</span>
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
                      {n.state === 'current' && <span className="pop">¡EMPEZAR!</span>}
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

          {/* Featured challenges */}
          <section className="challenges">
            <Link to="/policia-local" className="ch-card live">
              <span className="ch-tag live">EN DIRECTO · 312 jugando</span>
              <h3>🏆 Liga relámpago · 5 min</h3>
              <p>10 preguntas contra otros 5 oponentes. Llega al podio antes que ellos.</p>
              <div className="ch-meta">
                <span className="chip">⏱️ 5 min</span>
                <span className="chip">⚡ +120 XP</span>
                <span className="chip">💎 +50</span>
              </div>
              <span className="ch-cta">Entrar al duelo →</span>
            </Link>
            <Link to="/policia-local/ce78" className="ch-card pro">
              <span className="ch-tag pro">⭐ RETO PRO</span>
              <h3>Maratón CE 1978 · 100 preguntas</h3>
              <p>Sin corazones. Una vez fallas, vuelves al principio. Solo para los más valientes.</p>
              <div className="ch-meta">
                <span className="chip">⏱️ ~45 min</span>
                <span className="chip">⚡ +500 XP</span>
                <span className="chip">🏅 Insignia</span>
              </div>
              <span className="ch-cta">Aceptar reto →</span>
            </Link>
          </section>

          {/* Customize / personalization */}
          <section className="custom">
            <div className="avatar-preview">
              <div className="av-big">M</div>
              <div className="av-name">Marc B.</div>
              <div className="av-rank">NIVEL {stats.level} · CABO 1ª</div>
              <div className="lvl-bar">
                <div className="pbar3"><span style={{ width: `${Math.round((stats.xpInLevel / stats.xpToNext) * 100)}%` }} /></div>
                <span className="num">
                  {stats.xpInLevel.toLocaleString('es-ES')} / {stats.xpToNext.toLocaleString('es-ES')}
                </span>
              </div>
            </div>
            <div>
              <h3>Personaliza tu agente</h3>
              <p className="sub">Cambia colores, mascota e insignia. Algunos se desbloquean con XP o gemas.</p>
              <div className="cu-grid">
                <div className="cu-block">
                  <span className="lab">Color de uniforme</span>
                  <div className="cu-options">
                    {[
                      'linear-gradient(135deg, #F26B1F, #D9531A)',
                      'linear-gradient(135deg, #2F6BD8, #1f4ea0)',
                      'linear-gradient(135deg, #2FB66B, #1f8a4d)',
                      'linear-gradient(135deg, #9747D6, #6c2bb4)',
                    ].map((bg, i) => (
                      <button
                        key={`color-${i}`}
                        type="button"
                        className={`swatch ${colorIdx === i ? 'sel' : ''}`}
                        style={{ background: bg }}
                        onClick={() => setColorIdx(i)}
                        aria-label={`Color ${i + 1}`}
                      />
                    ))}
                    <span className="swatch lock" style={{ background: 'linear-gradient(135deg, #0E0E0E, #2a2a2a)' }} />
                    <span className="swatch lock" style={{ background: 'linear-gradient(135deg, #E89A1C, #b87a14)' }} />
                  </div>
                </div>
                <div className="cu-block">
                  <span className="lab">Mascota guía</span>
                  <div className="pet-row">
                    {['🦉', '🐺', '🦊'].map((p, i) => (
                      <button
                        key={`pet-${i}`}
                        type="button"
                        className={`pet ${petIdx === i ? 'sel' : ''}`}
                        onClick={() => setPetIdx(i)}
                        aria-label={`Mascota ${p}`}
                      >
                        {p}
                      </button>
                    ))}
                    <span className="pet lock">🦁</span>
                    <span className="pet lock">🐉</span>
                  </div>
                </div>
                <div className="cu-block">
                  <span className="lab">Insignia de banda</span>
                  <div className="cu-options">
                    {[
                      { bg: '#FFE9D8', icon: '🎓' },
                      { bg: '#EAF1FE', icon: '⚖️' },
                      { bg: '#DFF7E9', icon: '🛡️' },
                    ].map((b, i) => (
                      <button
                        key={`badge-${i}`}
                        type="button"
                        className={`swatch ${badgeIdx === i ? 'sel' : ''}`}
                        style={{ background: b.bg }}
                        onClick={() => setBadgeIdx(i)}
                        aria-label={`Insignia ${b.icon}`}
                      >
                        {b.icon}
                      </button>
                    ))}
                    <span className="swatch lock" style={{ background: '#FBE5B5' }}>⭐</span>
                  </div>
                </div>
                <div className="cu-block">
                  <span className="lab">Tema de la app</span>
                  <div className="cu-options">
                    {[
                      { bg: 'var(--paper)' },
                      { bg: 'var(--ink)' },
                    ].map((t, i) => (
                      <button
                        key={`theme-${i}`}
                        type="button"
                        className={`swatch ${themeIdx === i ? 'sel' : ''}`}
                        style={{ background: t.bg }}
                        onClick={() => setThemeIdx(i)}
                        aria-label={`Tema ${i + 1}`}
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

          {/* Shop */}
          <section className="shop">
            <h3>💎 Tienda · gasta tus gemas</h3>
            <p className="sub">Power-ups, vidas extra y boosts. Tu inventario te espera en la mochila.</p>
            <div className="shop-grid">
              {SHOP_ITEMS.map((s, i) => (
                <div key={`shop-${i}`} className="shop-item">
                  <div className="si-ico">{s.ico}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <span className="price">💎 {s.price}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="side-rail">
          <div className="side-card streak-card">
            <h3>RACHA SEMANAL</h3>
            <div className="streak-big">
              <span className="streak-num">{stats.streakDays}</span>
              <span className="streak-label">días seguidos 🔥</span>
            </div>
            <div className="streak-days">
              {DAYS.map((d, i) => {
                const cls = i < 5 ? 'done' : i === 5 ? 'today' : 'miss';
                return (
                  <div key={`day-${i}`} className={`sd ${cls}`}>
                    <span className="dot">{cls === 'done' ? '✓' : cls === 'today' ? '★' : '·'}</span>
                    <span>{d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="side-card">
            <h3>RETOS DIARIOS</h3>
            <p className="sub">Se reinician en 8h 23m</p>
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
            <h3>LIGA</h3>
            <p className="sub">Termina en 3d 14h</p>
            <div className="league-row">
              <div>
                <div className="league-name">Liga Zafiro</div>
                <div className="league-tier">Posición 4 · Top 10 ascienden</div>
              </div>
              <div className="league-icon">💎</div>
            </div>
            <ul className="lb">
              {LEAGUE.map((l) => (
                <li key={`lb-${l.rank}`}>
                  <span className={`rank ${l.rankClass}`}>{l.rank}</span>
                  <span className="name">
                    {l.name}
                    {l.me && <span className="me">TÚ</span>}
                  </span>
                  <span className="xp-num">{l.xp.toLocaleString('es-ES')}</span>
                </li>
              ))}
            </ul>
            <div className="lb-promo">
              ⬆️ Necesitas <b style={{ color: '#fff' }}>+63 XP</b> para alcanzar el podio.
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
