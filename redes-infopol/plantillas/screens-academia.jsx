// screens-academia.jsx — Academia (gamified) flow

const TA = window.TOKENS;
const IA = window.Icon;

// ── Home Acadèmia (dashboard) ───────────────────────────────────
function ScreenAcademiaHome() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100, background: TA.bg }}>
      <window.StatusBar />

      {/* top */}
      <div style={{ padding: '10px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <window.InfoPolWordmark height={16} />
          <div style={{ height: 18, width: 1, background: TA.hairlineStrong }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TA.cat.academia.solid }}>Acadèmia</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Streak n={23} />
          <GemBadge n={420} />
        </div>
      </div>

      {/* hero plan */}
      <div style={{ padding: '6px 16px 4px' }}>
        <div style={{
          background: TA.cat.academia.solid, color: '#fff',
          borderRadius: TA.r.xl, padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -50, width: 180, height: 180,
            borderRadius: 200, background: 'rgba(255,255,255,0.10)',
          }} />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.9 }}>El teu pla d'avui</div>
          <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 24, letterSpacing: -0.5, marginTop: 4, lineHeight: 1.1 }}>
            45 min · 3 missions
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <window.ProgressBar value={33} color="#fff" bg="rgba(255,255,255,0.22)" height={10} />
            <span style={{ fontSize: 12, fontWeight: 800 }}>1/3</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button style={{
              background: '#fff', color: TA.cat.academia.solid,
              border: 'none', padding: '11px 18px', borderRadius: 14,
              fontFamily: TA.font, fontWeight: 800, fontSize: 13,
              letterSpacing: 0.4, textTransform: 'uppercase',
              boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <IA name="play" size={14} color={TA.cat.academia.solid} /> Continuar
            </button>
            <span style={{ alignSelf: 'center', fontSize: 12, opacity: 0.85 }}>
              Pròxim: Tema 8 · Drets fonamentals
            </span>
          </div>
        </div>
      </div>

      {/* missions */}
      <div style={{ padding: '14px 0 0' }}>
        <window.SectionHead kicker="Missions d'avui" kickerColor={TA.cat.academia.solid} title="Avança el pla" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Mission cat="tests" icon="check" title="Test ràpid · Tema 7" sub="10 preguntes · 8 min" status="done" />
          <Mission cat="academia" icon="cards" title="Flashcards d'avui" sub="24 cartes · 12 min" status="active" pct={40} />
          <Mission cat="psico" icon="spark" title="Repàs Constitució" sub="Lectura · 15 min" status="locked" />
        </div>
      </div>

      {/* tools grid */}
      <div style={{ padding: '20px 16px 0' }}>
        <window.SectionHead kicker="Eines" kickerColor={TA.inkMuted} title="Estudia com vulguis" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ToolTile cat="leyes" icon="book" title="Temari" desc="17 blocs · 64% completat" pct={64} />
          <ToolTile cat="tests" icon="check" title="Tests Mossos" desc="412 preguntes contestades" />
          <ToolTile cat="academia" icon="cards" title="Flashcards" desc="Repàs espaiat" />
          <ToolTile cat="alcohol" icon="clock" title="Simulacre" desc="100 preg · 90 min" />
          <ToolTile cat="physical" icon="gauge" title="Físiques" desc="Calculadora de marques" />
          <ToolTile cat="psico" icon="spark" title="Psicotècnics" desc="Sèries · numèric · verbal" />
        </div>
      </div>

      {/* leaderboard preview */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{
          background: '#fff', borderRadius: TA.r.lg, padding: 14,
          borderTop: `3px solid ${TA.cat.psico.solid}`, boxShadow: TA.shadow.card,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TA.cat.psico.ink }}>Lliga setmanal</div>
              <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>Lliga Or · 4t lloc</div>
            </div>
            <IA name="trophy" size={24} color={TA.cat.psico.solid} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { p: 1, n: 'Núria S.', xp: 2840, you: false },
              { p: 2, n: 'Jordi A.', xp: 2310, you: false },
              { p: 3, n: 'Mar G.', xp: 2020, you: false },
              { p: 4, n: 'Tu', xp: 1810, you: true },
            ].map(r => (
              <div key={r.p} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 10,
                background: r.you ? TA.cat.academia.soft : 'transparent',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: r.p === 1 ? TA.cat.psico.solid : r.p === 2 ? '#B8B8C0' : r.p === 3 ? '#C28455' : TA.bg,
                  color: r.p <= 3 ? '#fff' : TA.inkSoft,
                  display: 'grid', placeItems: 'center',
                  fontFamily: TA.fontMono, fontWeight: 800, fontSize: 11,
                }}>{r.p}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: r.you ? 800 : 600, color: TA.ink }}>{r.n}</div>
                <div style={{ fontFamily: TA.fontMono, fontSize: 12, fontWeight: 700, color: TA.inkSoft }}>{r.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Streak({ n }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: TA.cat.alcohol.soft, color: TA.cat.alcohol.ink,
      padding: '6px 10px', borderRadius: 999,
      fontFamily: TA.font, fontWeight: 800, fontSize: 13,
    }}>
      <IA name="flame" size={14} color={TA.cat.alcohol.solid} />{n}
    </div>
  );
}

function GemBadge({ n }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: TA.cat.tests.soft, color: TA.cat.tests.ink,
      padding: '6px 10px', borderRadius: 999,
      fontFamily: TA.font, fontWeight: 800, fontSize: 13,
    }}>
      <IA name="gem" size={14} color={TA.cat.tests.solid} />{n}
    </div>
  );
}

function Mission({ cat, icon, title, sub, status, pct }) {
  const k = TA.cat[cat];
  const isLocked = status === 'locked';
  const isDone = status === 'done';
  return (
    <div style={{
      background: '#fff', borderRadius: TA.r.lg, padding: 14,
      boxShadow: TA.shadow.card, borderTop: `3px solid ${k.solid}`,
      opacity: isLocked ? 0.6 : 1,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: isDone ? TA.cat.atajos.solid : k.solid,
        display: 'grid', placeItems: 'center',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
        position: 'relative',
      }}>
        <IA name={isDone ? 'check' : isLocked ? 'lock' : icon} size={22} color="#fff" strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: TA.ink, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: TA.inkMuted, marginTop: 2 }}>{sub}</div>
        {pct && (
          <div style={{ marginTop: 8 }}>
            <window.ProgressBar value={pct} color={k.solid} height={6} />
          </div>
        )}
      </div>
      {isDone ? (
        <div style={{ fontSize: 11, fontWeight: 800, color: TA.cat.atajos.ink, background: TA.cat.atajos.soft, padding: '4px 8px', borderRadius: 999 }}>+24 XP</div>
      ) : (
        <IA name="chevron-right" size={18} color={TA.inkMuted} />
      )}
    </div>
  );
}

function ToolTile({ cat, icon, title, desc, pct }) {
  const k = TA.cat[cat];
  return (
    <div style={{
      background: '#fff', borderRadius: TA.r.lg, padding: 14,
      borderTop: `3px solid ${k.solid}`, boxShadow: TA.shadow.card,
      minHeight: 124, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <window.CatIcon cat={cat} icon={icon} size={36} rounded={10} />
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 14.5, color: TA.ink, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 11, color: TA.inkMuted, marginTop: 2 }}>{desc}</div>
        {pct && (
          <div style={{ marginTop: 8 }}>
            <window.ProgressBar value={pct} color={k.solid} height={5} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Temari (blocs) ─────────────────────────────────────────────
function ScreenTemari() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader2 cat="academia" kicker="Acadèmia · Mossos" title="Temari oficial" />

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          background: '#fff', borderRadius: TA.r.lg, padding: 14,
          boxShadow: TA.shadow.card, borderLeft: `3px solid ${TA.cat.academia.solid}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TA.inkMuted }}>Progrés global</div>
              <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, marginTop: 2 }}>
                64<span style={{ fontSize: 14, color: TA.inkMuted }}>%</span>
                <span style={{ fontSize: 12, color: TA.inkMuted, fontWeight: 600, marginLeft: 8 }}>11 / 17 blocs</span>
              </div>
            </div>
            <Ring pct={64} />
          </div>
          <div style={{ marginTop: 10 }}>
            <window.ProgressBar value={64} color={TA.cat.academia.solid} />
          </div>
        </div>
      </div>

      {/* learning path */}
      <div style={{ padding: '0 16px' }}>
        <SectionTitle2>Camí d'aprenentatge</SectionTitle2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <PathNode i={1} cat="leyes" icon="scale" title="Bloc 1 · Constitució" sub="Completat" status="done" align="left" />
          <PathConnector />
          <PathNode i={2} cat="leyes" icon="book" title="Bloc 2 · Estatut" sub="Completat" status="done" align="right" />
          <PathConnector />
          <PathNode i={3} cat="operativa" icon="shield" title="Bloc 3 · Drets fonamentals" sub="En curs · 7/12 lliçons" status="active" align="left" pct={58} />
          <PathConnector dim />
          <PathNode i={4} cat="academia" icon="briefcase" title="Bloc 4 · Org. policial" sub="Bloquejat" status="locked" align="right" />
          <PathConnector dim />
          <PathNode i={5} cat="transito" icon="hash" title="Bloc 5 · Codi penal" sub="Bloquejat" status="locked" align="left" />
        </div>
      </div>
    </div>
  );
}

function Ring({ pct, size = 52, color }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke={TA.hairline} strokeWidth="6" fill="none" />
      <circle cx={size/2} cy={size/2} r={r}
        stroke={color || TA.cat.academia.solid} strokeWidth="6" fill="none"
        strokeDasharray={`${c * pct/100} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 13, fill: TA.ink }}>
        {pct}%
      </text>
    </svg>
  );
}

function PathNode({ i, cat, icon, title, sub, status, align, pct }) {
  const k = TA.cat[cat];
  const isDone = status === 'done';
  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const justify = align === 'left' ? 'flex-start' : 'flex-end';
  return (
    <div style={{ display: 'flex', justifyContent: justify, padding: '4px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        flexDirection: align === 'left' ? 'row' : 'row-reverse',
        maxWidth: '85%',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: isLocked ? '#E7E5DF' : k.solid,
          display: 'grid', placeItems: 'center', flexShrink: 0,
          boxShadow: isLocked ? 'none' : `inset 0 -4px 0 rgba(0,0,0,0.2), 0 0 0 ${isActive ? '5px' : '0'} ${k.soft}`,
          position: 'relative',
        }}>
          <IA name={isDone ? 'check' : isLocked ? 'lock' : icon} size={22} color={isLocked ? TA.inkMuted : '#fff'} strokeWidth={2.4} />
          {isActive && <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: 999,
            background: TA.cat.alcohol.solid, color: '#fff',
            display: 'grid', placeItems: 'center',
            fontSize: 10, fontWeight: 800, border: '2px solid #fff',
          }}>!</div>}
        </div>
        <div style={{
          background: '#fff', borderRadius: TA.r.md, padding: '10px 14px',
          boxShadow: TA.shadow.card, opacity: isLocked ? 0.55 : 1,
          textAlign: align === 'left' ? 'left' : 'right',
          minWidth: 160,
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: k.ink }}>Bloc {i}</div>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: TA.ink, marginTop: 1 }}>{title.replace(`Bloc ${i} · `, '')}</div>
          <div style={{ fontSize: 11, color: TA.inkMuted, marginTop: 2 }}>{sub}</div>
          {pct && <div style={{ marginTop: 6 }}><window.ProgressBar value={pct} color={k.solid} height={4} /></div>}
        </div>
      </div>
    </div>
  );
}

function PathConnector({ dim }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
      <div style={{
        width: 4, height: 18, borderRadius: 2,
        background: dim ? TA.hairline : TA.cat.academia.soft,
      }} />
    </div>
  );
}

function NavHeader2({ cat, kicker, title }) {
  const k = TA.cat[cat];
  return (
    <div style={{ padding: '6px 16px 14px' }}>
      <div style={{ fontFamily: TA.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: k.ink, marginBottom: 4 }}>{kicker}</div>
      <h1 style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>{title}</h1>
    </div>
  );
}

function SectionTitle2({ children }) {
  return (
    <div style={{
      fontFamily: TA.font, fontWeight: 800, fontSize: 11,
      letterSpacing: 1.2, textTransform: 'uppercase',
      color: TA.inkMuted, marginBottom: 10,
    }}>{children}</div>
  );
}

// ── Test Mossos ──────────────────────────────────────────────
function ScreenTest() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 110, background: TA.bg }}>
      <window.StatusBar />

      {/* exam top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px 12px',
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: TA.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><IA name="x" size={18} color={TA.ink} /></button>

        <div style={{ flex: 1, padding: '0 12px' }}>
          <window.ProgressBar value={47} max={100} color={TA.cat.academia.solid} height={10} />
        </div>

        <div style={{
          background: '#fff', borderRadius: 999, padding: '6px 12px',
          boxShadow: TA.shadow.card, display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: TA.fontMono, fontWeight: 800, fontSize: 12, color: TA.cat.alcohol.solid,
        }}>
          <IA name="clock" size={13} color={TA.cat.alcohol.solid} /> 47:12
        </div>
      </div>

      {/* counter */}
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Streak n={23} />
          <span style={{ fontSize: 11, fontWeight: 700, color: TA.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Pregunta 24/50</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: TA.cat.atajos.solid }}>21 correctes ✓</div>
      </div>

      {/* question card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: '#fff', borderRadius: TA.r.lg, padding: 18,
          boxShadow: TA.shadow.card, borderTop: `3px solid ${TA.cat.tests.solid}`,
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TA.cat.tests.ink, marginBottom: 8 }}>
            Tema 8 · Drets fonamentals
          </div>
          <div style={{ fontFamily: TA.fontDisplay, fontWeight: 700, fontSize: 17, lineHeight: 1.35, color: TA.ink, letterSpacing: -0.2 }}>
            Quin article de la Constitució Espanyola estableix que tothom té dret a la vida i a la integritat física i moral?
          </div>
        </div>
      </div>

      {/* options */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { l: 'A', t: 'Article 14 CE', state: 'idle' },
          { l: 'B', t: 'Article 15 CE', state: 'correct' },
          { l: 'C', t: 'Article 16 CE', state: 'idle' },
          { l: 'D', t: 'Article 17 CE', state: 'wrong' },
        ].map((o, i) => (
          <Option key={i} {...o} />
        ))}
      </div>

      {/* feedback */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          background: TA.cat.atajos.soft, borderRadius: TA.r.md, padding: 14,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999, background: TA.cat.atajos.solid,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <IA name="check" size={18} color="#fff" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: TA.cat.atajos.ink }}>Excel·lent! +24 XP</div>
            <div style={{ fontSize: 12, color: TA.cat.atajos.ink, marginTop: 2, lineHeight: 1.4, opacity: 0.9 }}>
              L'art. 15 CE protegeix el dret a la vida i la integritat física i moral, prohibint la tortura i les penes inhumanes.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <window.DuoButton color="academia" full leftIcon="arrow-right">Següent</window.DuoButton>
      </div>
    </div>
  );
}

function Option({ l, t, state }) {
  let bg = '#fff', fg = TA.ink, border = TA.hairline, badge = TA.bg, badgeFg = TA.inkSoft, icon = null;
  if (state === 'correct') { bg = TA.cat.atajos.soft; fg = TA.cat.atajos.ink; border = TA.cat.atajos.solid; badge = TA.cat.atajos.solid; badgeFg = '#fff'; icon = 'check'; }
  if (state === 'wrong')   { bg = TA.cat.alcohol.soft; fg = TA.cat.alcohol.ink; border = TA.cat.alcohol.solid; badge = TA.cat.alcohol.solid; badgeFg = '#fff'; icon = 'x'; }
  return (
    <div style={{
      background: bg, borderRadius: 14, padding: '14px 14px',
      border: `2px solid ${border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: badge, color: badgeFg,
        display: 'grid', placeItems: 'center',
        fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 13,
      }}>{l}</div>
      <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: fg }}>{t}</div>
      {icon && <IA name={icon} size={18} color={fg} strokeWidth={2.4} />}
    </div>
  );
}

// ── Flashcards ───────────────────────────────────────────────
function ScreenFlashcards() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100, background: TA.bg }}>
      <window.StatusBar />
      <NavHeader2 cat="academia" kicker="Repàs espaiat · 8/24" title="Flashcards" />

      <div style={{ padding: '0 16px' }}>
        <window.ProgressBar value={33} color={TA.cat.academia.solid} />
      </div>

      {/* card stack */}
      <div style={{ padding: '24px 16px 0', position: 'relative', height: 360 }}>
        <CardStub style={{ top: 18, left: 22, right: 22, opacity: 0.5, transform: 'rotate(-3deg)' }} />
        <CardStub style={{ top: 9,  left: 16, right: 16, opacity: 0.8, transform: 'rotate(2deg)' }} />
        <div style={{
          position: 'absolute', top: 0, left: 8, right: 8, bottom: 16,
          background: '#fff', borderRadius: TA.r.xl, padding: 22,
          boxShadow: TA.shadow.pop, borderTop: `4px solid ${TA.cat.academia.solid}`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <window.Pill bg={TA.cat.leyes.soft} fg={TA.cat.leyes.ink}>Tema 12 · CP</window.Pill>
            <span style={{ fontSize: 11, fontWeight: 700, color: TA.inkMuted, fontFamily: TA.fontMono }}>9/24</span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
            color: TA.inkMuted, marginBottom: 8,
          }}>Pregunta</div>
          <div style={{
            fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.4, lineHeight: 1.2, color: TA.ink, flex: 1,
          }}>
            Quina és la pena per al delicte d'omissió del deure de socors?
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: TA.inkMuted, fontSize: 11.5, fontWeight: 600, marginTop: 12 }}>
            <IA name="eye" size={14} color={TA.inkMuted} /> Toca per girar
          </div>
        </div>
      </div>

      {/* response buttons */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{
          fontFamily: TA.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase', color: TA.inkMuted, marginBottom: 8, textAlign: 'center',
        }}>Com ho recordes?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          <RatingBtn cat="alcohol" l="Malament" sub="<1d" />
            <RatingBtn cat="psico" l="Difícil" sub="2d" />
          <RatingBtn cat="tests" l="Bé" sub="5d" />
          <RatingBtn cat="atajos" l="Fàcil" sub="14d" />
        </div>
      </div>
    </div>
  );
}

function CardStub({ style }) {
  return <div style={{ position: 'absolute', height: '100%', background: '#fff', borderRadius: TA.r.xl, boxShadow: TA.shadow.card, ...style }} />;
}

function RatingBtn({ cat, l, sub }) {
  const k = TA.cat[cat];
  return (
    <button style={{
      background: '#fff', border: `2px solid ${k.soft}`,
      borderRadius: 12, padding: '10px 4px', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      <span style={{ fontFamily: TA.font, fontWeight: 800, fontSize: 12, color: k.ink }}>{l}</span>
      <span style={{ fontSize: 10, color: TA.inkMuted, fontWeight: 600, fontFamily: TA.fontMono }}>{sub}</span>
    </button>
  );
}

// ── Estadístiques ──────────────────────────────────────────────
function ScreenStats() {
  const data = [62, 48, 71, 55, 80, 45, 68, 72, 35, 58, 90, 64];
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader2 cat="academia" kicker="El teu progrés" title="Estadístiques" />

      {/* big numbers */}
      <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BigStat cat="academia" icon="flame" big="23" label="Dies seguits" sub="Rècord: 41" />
        <BigStat cat="atajos" icon="check" big="78%" label="Encerts globals" sub="+4% aquesta setmana" />
        <BigStat cat="tests" icon="hash" big="412" label="Preguntes fetes" sub="Mossos · oficial" />
        <BigStat cat="psico" icon="clock" big="48h" label="Temps d'estudi" sub="aquest mes" />
      </div>

      {/* 7-day chart */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: '#fff', borderRadius: TA.r.lg, padding: 16,
          boxShadow: TA.shadow.card, borderTop: `3px solid ${TA.cat.academia.solid}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: TA.cat.academia.ink }}>Activitat</div>
              <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>Últimes 12 setmanes</div>
            </div>
            <window.Pill bg={TA.cat.atajos.soft} fg={TA.cat.atajos.ink}>↑ +12%</window.Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }}>
            {data.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: `${v}%`,
                  background: i === 10 ? TA.cat.academia.solid : TA.cat.academia.soft,
                  borderRadius: 4, boxShadow: i === 10 ? 'inset 0 -2px 0 rgba(0,0,0,0.18)' : 'none',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: TA.inkMuted, marginTop: 6, fontFamily: TA.fontMono }}>
            <span>S6</span><span>S9</span><span>S12</span><span>S15</span><span>S18</span>
          </div>
        </div>
      </div>

      {/* per topic */}
      <div style={{ padding: '14px 16px 0' }}>
        <SectionTitle2>Rendiment per tema</SectionTitle2>
        <div style={{ background: '#fff', borderRadius: TA.r.lg, boxShadow: TA.shadow.card, overflow: 'hidden' }}>
          {[
            { t: 'T1 · Constitució', pct: 92, hue: 'atajos' },
            { t: 'T8 · Drets fonamentals', pct: 78, hue: 'tests' },
            { t: 'T12 · Codi penal', pct: 64, hue: 'psico' },
            { t: 'T5 · Org. policial', pct: 41, hue: 'alcohol' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '12px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${TA.hairline}` : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TA.ink }}>{r.t}</div>
                <div style={{ marginTop: 6 }}>
                  <window.ProgressBar value={r.pct} color={TA.cat[r.hue].solid} height={5} />
                </div>
              </div>
              <div style={{ fontFamily: TA.fontMono, fontSize: 13, fontWeight: 800, color: TA.cat[r.hue].ink }}>{r.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BigStat({ cat, icon, big, label, sub }) {
  const k = TA.cat[cat];
  return (
    <div style={{
      background: '#fff', borderRadius: TA.r.lg, padding: 14,
      borderTop: `3px solid ${k.solid}`, boxShadow: TA.shadow.card,
    }}>
      <window.CatIcon cat={cat} icon={icon} size={32} rounded={9} />
      <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, color: TA.ink, marginTop: 8 }}>
        {big}
      </div>
      <div style={{ fontSize: 11.5, color: TA.inkSoft, fontWeight: 700, marginTop: 1 }}>{label}</div>
      <div style={{ fontSize: 10.5, color: TA.inkMuted, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

// ── Físiques (calc de marques) ─────────────────────────────────
function ScreenFisiques() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader2 cat="physical" kicker="Proves físiques · Mossos" title="Calculadora de marques" />

      {/* user inputs */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: '#fff', borderRadius: TA.r.lg, padding: 14, boxShadow: TA.shadow.card, display: 'flex', gap: 8 }}>
          {[
            { l: 'Sexe', v: 'Dona' },
            { l: 'Edat', v: '28 anys' },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, padding: '6px 10px', background: TA.bg, borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: TA.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{p.l}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: TA.ink, marginTop: 1 }}>{p.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tests */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PhysicTest icon="bolt" name="Course-navette" mark="9.2" unit="palets" rating="Apte ★★★★" pct={82} />
        <PhysicTest icon="flame" name="Circuit d'agilitat" mark="11.4" unit="seg." rating="Apte ★★★" pct={70} />
        <PhysicTest icon="briefcase" name="Press de banca" mark="22" unit="reps" rating="Apte ★★★★★" pct={95} />
        <PhysicTest icon="route" name="Salt horitzontal" mark="1,72" unit="m" rating="No apte" pct={42} fail />
      </div>

      {/* footer */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          background: TA.cat.physical.soft, borderRadius: TA.r.md, padding: 14,
          display: 'flex', gap: 10,
        }}>
          <IA name="bolt" size={20} color={TA.cat.physical.ink} />
          <div style={{ fontSize: 12.5, color: TA.cat.physical.ink, lineHeight: 1.4, fontWeight: 600 }}>
            <b>Estimació actual:</b> 3/4 proves aptes. Treballa salt horitzontal per arribar a la qualificació mínima.
          </div>
        </div>
      </div>
    </div>
  );
}

function PhysicTest({ icon, name, mark, unit, rating, pct, fail }) {
  const k = fail ? TA.cat.alcohol : TA.cat.physical;
  return (
    <div style={{
      background: '#fff', borderRadius: TA.r.lg, padding: 14,
      boxShadow: TA.shadow.card, borderLeft: `3px solid ${k.solid}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <window.CatIcon cat={fail ? 'alcohol' : 'physical'} icon={icon} size={36} rounded={10} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: TA.ink }}>{name}</div>
          <div style={{ fontSize: 11, color: k.ink, marginTop: 1, fontWeight: 700 }}>{rating}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: -0.4, color: TA.ink, lineHeight: 1 }}>{mark}</div>
          <div style={{ fontSize: 10, color: TA.inkMuted, fontWeight: 600 }}>{unit}</div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <window.ProgressBar value={pct} color={k.solid} height={5} />
      </div>
    </div>
  );
}

// ── Perfil ────────────────────────────────────────────────────
function ScreenPerfil() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />

      {/* hero perfil */}
      <div style={{
        background: TA.cat.operativa.solid, color: '#fff',
        padding: '50px 18px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40, width: 180, height: 180,
          borderRadius: 200, background: 'rgba(255,255,255,0.10)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: TA.cat.academia.solid, color: '#fff',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 24,
            border: '3px solid #fff',
          }}>JR</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 18 }}>Jordi Roca</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Agent · TIP 18742 · Barcelona</div>
          </div>
          <button style={{
            border: '1.5px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.12)', color: '#fff',
            padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>Editar</button>
        </div>
        <div style={{
          marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          {[
            { l: 'Nivell', v: '12' },
            { l: 'XP', v: '14.820' },
            { l: 'Ratxa', v: '23 dies' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 12, padding: 10 }}>
              <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</div>
              <div style={{ fontFamily: TA.fontDisplay, fontWeight: 800, fontSize: 18, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* logros */}
      <div style={{ padding: '18px 16px 0' }}>
        <SectionTitle2>Insígnies (8/24)</SectionTitle2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { c: 'leyes', i: 'scale', t: 'Lleis' },
            { c: 'transito', i: 'car', t: 'Trànsit' },
            { c: 'academia', i: 'flame', t: '7 dies' },
            { c: 'tests', i: 'check', t: '100 OK' },
            { c: 'physical', i: 'bolt', t: 'Físic', locked: true },
            { c: 'psico', i: 'spark', t: 'Psico', locked: true },
            { c: 'alcohol', i: 'beaker', t: 'Tox', locked: true },
            { c: 'atajos', i: 'medal', t: 'Or', locked: true },
          ].map((b, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, padding: 10,
              boxShadow: TA.shadow.card, textAlign: 'center',
              opacity: b.locked ? 0.45 : 1,
            }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto', borderRadius: 999,
                background: b.locked ? '#E7E5DF' : TA.cat[b.c].solid,
                display: 'grid', placeItems: 'center',
                boxShadow: b.locked ? 'none' : 'inset 0 -3px 0 rgba(0,0,0,0.18)',
              }}>
                <IA name={b.locked ? 'lock' : b.i} size={22} color={b.locked ? TA.inkMuted : '#fff'} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 6, color: TA.inkSoft }}>{b.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* settings */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionTitle2>Configuració</SectionTitle2>
        <div style={{ background: '#fff', borderRadius: TA.r.lg, boxShadow: TA.shadow.card, overflow: 'hidden' }}>
          {[
            { i: 'bolt', t: 'Mode operativa per defecte', d: 'Activat' },
            { i: 'bell', t: 'Notificacions', d: 'Diari · 19:00' },
            { i: 'graduation', t: 'Oposició objectiu', d: 'Mossos d\'Esquadra 2027' },
            { i: 'lock', t: 'Privacitat i seguretat' },
          ].map((r, i, arr) => (
            <div key={i} style={{
              padding: '14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < arr.length - 1 ? `1px solid ${TA.hairline}` : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: TA.bg,
                display: 'grid', placeItems: 'center',
              }}><IA name={r.i} size={16} color={TA.inkSoft} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.t}</div>
                {r.d && <div style={{ fontSize: 11, color: TA.inkMuted, marginTop: 1 }}>{r.d}</div>}
              </div>
              <IA name="chevron-right" size={16} color={TA.inkMuted} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenAcademiaHome, ScreenTemari, ScreenTest,
  ScreenFlashcards, ScreenStats, ScreenFisiques, ScreenPerfil,
});
