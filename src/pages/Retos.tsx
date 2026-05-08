// Pàgina Reptes (Acadèmia · gamificació) · rebranding 2026.
// Estil Duolingo: HUD amb stats, day banner, path/map de lliçons,
// reptes destacats (lliga llamp i marató pro), customize avatar,
// achievements grid, shop. Sidebar amb streak, daily quests i lliga.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';
import { TOPICS } from '../data/tests';
import { getAnsweredIds } from '../lib/testProgress';
import { useFailuresCounts } from '../lib/failures';

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

/* ── Path nodes (mock visuals del progrés) ──────────────── */
type PathNode = {
  state: 'done' | 'current' | 'locked' | 'boss';
  icon: string;
  marginLeft: number;
  pop?: string;
};

const PATH_NODES: PathNode[] = [
  { state: 'done', icon: '★', marginLeft: -120 },
  { state: 'done', icon: '📖', marginLeft: 60 },
  { state: 'done', icon: '★', marginLeft: 140 },
  { state: 'done', icon: '📖', marginLeft: 80 },
  { state: 'done', icon: '★', marginLeft: -40 },
  { state: 'done', icon: '📖', marginLeft: -160 },
  { state: 'done', icon: '★', marginLeft: -80 },
  { state: 'current', icon: '⚡', marginLeft: 60, pop: '¡EMPEZAR!' },
  { state: 'locked', icon: '📖', marginLeft: 160 },
  { state: 'locked', icon: '⚡', marginLeft: 80 },
];

const SHOP_ITEMS = [
  { ico: '❤️', title: 'Recarga total', desc: 'Llena tus 5 corazones', price: 350 },
  { ico: '🛡️', title: 'Protector racha', desc: 'Salva 1 día perdido', price: 200 },
  { ico: '⏰', title: 'Tiempo extra', desc: '+30s en duelos', price: 80 },
  { ico: '🚀', title: 'XP x2 (15 min)', desc: 'Doble experiencia', price: 150 },
];

const ACHIEVEMENTS = [
  { ico: '🔥', title: 'En racha', desc: '7 días seguidos', lvl: 'NIVEL 3', unlocked: true },
  { ico: '📚', title: 'Letrado', desc: '50 lecciones', lvl: 'NIVEL 2', unlocked: true },
  { ico: '⚡', title: 'Veloz', desc: '10 perfectas <60s', lvl: 'NIVEL 1', unlocked: true },
  { ico: '🎯', title: 'Francotirador', desc: '20 fichas perfectas', lvl: 'NIVEL 1', unlocked: true },
  { ico: '👑', title: 'Veterano', desc: '100 días de racha', lvl: '27/100', unlocked: false },
  { ico: '🏆', title: 'Campeón', desc: 'Top 1 liga semanal', lvl: 'BLOQUEADO', unlocked: false },
];

const LEAGUE = [
  { rank: 1, name: '🦊 Lluís_M', xp: 3420, rankClass: 'gold' },
  { rank: 2, name: '🦉 Andrea7', xp: 3180, rankClass: 'silver' },
  { rank: 3, name: '🐺 Pol_22', xp: 2910, rankClass: 'bronze' },
  { rank: 4, name: '🦉 Tu', xp: 2847, rankClass: '', me: true },
  { rank: 5, name: '🐉 Jordi9', xp: 2612, rankClass: '' },
];

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function Retos() {
  useT();
  const stats = useGameStats();
  const { due: failuresDue } = useFailuresCounts();

  const [colorIdx, setColorIdx] = useState(0);
  const [petIdx, setPetIdx] = useState(0);
  const [badgeIdx, setBadgeIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);

  // Calculate quests progress from real data
  const dailyXp = Math.min(50, stats.xp % 50 || 30);
  const objectivePct = Math.round((dailyXp / 50) * 100);

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

          {/* Path / map */}
          <section className="path-section">
            <header className="path-head">
              <h2>UNIDAD 3 · CONSTITUCIÓN ESPAÑOLA · TÍTULO I</h2>
              <span className="unit">{Math.min(7, Math.max(1, Math.floor(stats.totalAnswered / 5)))}/12 lecciones</span>
            </header>
            <div className="path">
              {PATH_NODES.map((n, i) => {
                if (i === 3) {
                  return (
                    <div key={`chk-1-${i}`}>
                      <div className="path-row">
                        <div className={`node ${n.state}`} style={{ marginLeft: n.marginLeft }}>
                          <div className="ring" />
                          <span className="icon-emoji">{n.icon}</span>
                        </div>
                      </div>
                      <div className="checkpoint">
                        <div className="line" />
                        <span className="badge-chk">📍 CHECKPOINT · Detención y derechos</span>
                        <div className="line" />
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={`n-${i}`} className="path-row">
                    <div className={`node ${n.state}`} style={{ marginLeft: n.marginLeft }}>
                      {n.pop && <span className="pop">{n.pop}</span>}
                      <div className="ring" />
                      <span className="icon-emoji">{n.icon}</span>
                    </div>
                  </div>
                );
              })}
              <div className="checkpoint">
                <div className="line" />
                <span
                  className="badge-chk"
                  style={{ background: '#F5E9FF', color: '#6c2bb4', borderColor: '#d3b6ee' }}
                >
                  👑 BOSS · Examen del Título I
                </span>
                <div className="line" />
              </div>
              <div className="path-row">
                <div className="node boss locked" style={{ width: 96, height: 96 }}>
                  <div className="ring" />
                  <span className="icon-emoji" style={{ fontSize: 38 }}>👑</span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured challenges */}
          <section className="challenges">
            <Link to="/test" className="ch-card live">
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
            <Link to="/test/ce78" className="ch-card pro">
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

          {/* Achievements */}
          <section className="ach-section">
            <div
              className="section-head"
              style={{ ['--accent' as never]: 'var(--terracotta)' } as React.CSSProperties}
            >
              <span className="eyebrow">🏅 INSIGNIAS · 4 / 32 DESBLOQUEADAS</span>
              <span className="rule" />
              <Link to="#" className="see-all">Ver todas →</Link>
            </div>
            <div className="ach-grid">
              {ACHIEVEMENTS.map((a, i) => (
                <div key={`ach-${i}`} className={`ach ${a.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="medal">{a.ico}</div>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                  <span className="lvl">{a.lvl}</span>
                </div>
              ))}
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
              <div className="quest done">
                <span className="qico">✅</span>
                <div>
                  <div className="qhead">Completa 1 lección</div>
                  <div className="qprog">
                    <span className="qbar"><span style={{ width: '100%', background: '#2FB66B' }} /></span>
                    <span>1/1</span>
                  </div>
                </div>
                <span className="qreward">+15 ⚡</span>
              </div>
              <div className="quest">
                <span className="qico" style={{ background: '#FFE9D8', color: 'var(--terracotta)' }}>⚡</span>
                <div>
                  <div className="qhead">Gana 50 XP</div>
                  <div className="qprog">
                    <span className="qbar"><span style={{ width: `${objectivePct}%` }} /></span>
                    <span>{dailyXp}/50</span>
                  </div>
                </div>
                <span className="qreward">+30 💎</span>
              </div>
              <div className="quest">
                <span className="qico" style={{ background: '#EAF1FE', color: '#2F6BD8' }}>🎯</span>
                <div>
                  <div className="qhead">3 lecciones perfectas</div>
                  <div className="qprog">
                    <span className="qbar"><span style={{ width: '33%', background: '#2F6BD8' }} /></span>
                    <span>1/3</span>
                  </div>
                </div>
                <span className="qreward">+50 💎</span>
              </div>
              <div className="quest">
                <span className="qico" style={{ background: '#F5E9FF', color: '#9747D6' }}>⏱️</span>
                <div>
                  <div className="qhead">Duelo relámpago</div>
                  <div className="qprog">
                    <span className="qbar"><span style={{ width: '0%' }} /></span>
                    <span>0/1</span>
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
