// screens-landing.jsx — Public landing + onboarding mode selector

const TL = window.TOKENS;
const IL = window.Icon;

function ScreenLanding() {
  return (
    <div style={{ minHeight: '100%', background: TL.bg, paddingBottom: 32 }}>
      <window.StatusBar />

      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 10px',
      }}>
        <window.InfoPolWordmark height={18} />
        <button style={{
          background: TL.ink, color: '#fff', border: 'none',
          padding: '8px 14px', borderRadius: 999,
          fontFamily: TL.font, fontWeight: 700, fontSize: 12,
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>Entrar</button>
      </div>

      {/* hero */}
      <div style={{ padding: '20px 18px 16px' }}>
        <div style={{
          fontFamily: TL.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: TL.cat.academia.solid, marginBottom: 10,
        }}>Per la teva feina · Per la teva oposició</div>
        <h1 style={{
          fontFamily: TL.fontDisplay, fontWeight: 800,
          fontSize: 38, lineHeight: 1.02, letterSpacing: -1.4,
          color: TL.ink, margin: 0,
        }}>
          La policia<br/>al teu <span style={{ color: TL.cat.academia.solid }}>butxac</span>a.
        </h1>
        <p style={{
          fontFamily: TL.font, fontSize: 14, lineHeight: 1.5,
          color: TL.inkSoft, marginTop: 14, marginBottom: 18,
        }}>
          Cerca infraccions, consulta articles i segueix protocols pas a pas.
          O prepara la teva oposició a Mossos amb tests reals i estadístiques.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <window.DuoButton color="academia" full leftIcon="bolt">Comença gratis</window.DuoButton>
        </div>
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: TL.font, fontSize: 12, color: TL.inkMuted,
        }}>
          <div style={{ display: 'flex' }}>
            {['#FF7A1A', '#3B6BF5', '#1FB286', '#9C4FE0'].map((c, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: 11, background: c,
                border: '2px solid ' + TL.bg, marginLeft: i === 0 ? 0 : -8,
              }} />
            ))}
          </div>
          <span><b style={{ color: TL.ink }}>+12.400</b> agents i opositors</span>
        </div>
      </div>

      {/* dual modes preview */}
      <div style={{ padding: '6px 18px 0' }}>
        <div style={{
          background: TL.cat.operativa.solid, borderRadius: TL.r.xl,
          padding: 18, color: '#fff', position: 'relative', overflow: 'hidden',
          marginBottom: 12,
        }}>
          <div style={{
            position: 'absolute', right: -28, top: -28, width: 130, height: 130,
            borderRadius: 200, background: 'rgba(255,255,255,0.12)',
          }} />
          <window.Pill bg="rgba(255,255,255,0.18)" fg="#fff">Mode operativa</window.Pill>
          <div style={{
            fontFamily: TL.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.4, marginTop: 10,
          }}>Per al policia<br/>en actiu.</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8, lineHeight: 1.4 }}>
            Cercador d'infraccions, articles, protocols pas a pas, mapa d'incidències.
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Tràfic', 'CP', 'Seguretat ciutadana', 'Estrangeria'].map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,0.16)', color: '#fff',
                padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{
          background: TL.cat.academia.solid, borderRadius: TL.r.xl,
          padding: 18, color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -28, top: -28, width: 130, height: 130,
            borderRadius: 200, background: 'rgba(255,255,255,0.12)',
          }} />
          <window.Pill bg="rgba(255,255,255,0.18)" fg="#fff">Mode acadèmia</window.Pill>
          <div style={{
            fontFamily: TL.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.4, marginTop: 10,
          }}>Prepara't els<br/>Mossos.</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8, lineHeight: 1.4 }}>
            Tests oficials, simulacres, flashcards i un pla diari adaptat.
          </div>
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>Ratxa actual</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.4 }}>
                <IL name="flame" size={22} color="#fff" /> 23 dies
              </div>
            </div>
            <div style={{ width: 76, height: 76, borderRadius: 18, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
              <IL name="trophy" size={36} color="#fff" />
            </div>
          </div>
        </div>
      </div>

      {/* trust row */}
      <div style={{ padding: '24px 18px 8px' }}>
        <div style={{
          fontFamily: TL.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase', color: TL.inkMuted, marginBottom: 12,
        }}>Tot el que necessites</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { c: 'leyes', i: 'scale', t: 'Lleis', d: 'CP, LECrim, FCS, LSV…' },
            { c: 'transito', i: 'car', t: 'Infraccions', d: 'LSV, RGC, RGV…' },
            { c: 'operativa', i: 'route', t: 'Protocols', d: 'Pas a pas en ruta' },
            { c: 'tests', i: 'graduation', t: 'Tests Mossos', d: '17 temes oficials' },
          ].map(x => (
            <div key={x.t} style={{
              background: '#fff', borderRadius: TL.r.lg,
              padding: 14, borderTop: `3px solid ${TL.cat[x.c].solid}`,
              boxShadow: TL.shadow.card,
            }}>
              <window.CatIcon cat={x.c} icon={x.i} size={36} rounded={10} />
              <div style={{
                fontFamily: TL.font, fontWeight: 800, fontSize: 11,
                letterSpacing: 1, textTransform: 'uppercase',
                color: TL.cat[x.c].ink, marginTop: 10,
              }}>{x.t}</div>
              <div style={{ fontSize: 12, color: TL.inkMuted, marginTop: 2 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* social proof */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{
          background: '#fff', borderRadius: TL.r.lg, padding: 16,
          boxShadow: TL.shadow.card, borderLeft: `3px solid ${TL.cat.academia.solid}`,
        }}>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[0,1,2,3,4].map(i => <IL key={i} name="star" size={14} color={TL.cat.psico.solid} />)}
          </div>
          <div style={{ fontSize: 14, color: TL.ink, lineHeight: 1.5, fontWeight: 500 }}>
            "Vaig aprovar a la primera. Els tests són idèntics als reals i el pla diari et manté constant."
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: TL.inkMuted }}>
            <b style={{ color: TL.ink }}>Marta C.</b> · Mossos d'Esquadra promo 2025
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenOnboarding() {
  return (
    <div style={{ minHeight: '100%', background: TL.bg, position: 'relative' }}>
      <window.StatusBar />
      <div style={{ padding: '12px 18px 0' }}>
        <window.InfoPolWordmark height={18} />
      </div>

      <div style={{ padding: '40px 18px 0' }}>
        <div style={{
          fontFamily: TL.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase', color: TL.inkMuted,
        }}>Pas 2 de 3</div>
        <h2 style={{
          fontFamily: TL.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, lineHeight: 1.1, margin: '8px 0 6px',
        }}>Per què fas servir<br/>InfoPol?</h2>
        <p style={{ fontSize: 13, color: TL.inkMuted, margin: 0 }}>
          Pots canviar de mode en qualsevol moment.
        </p>
      </div>

      <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ModeCard
          cat="operativa" icon="shield"
          title="Soc policia en actiu"
          desc="Cerca infraccions, articles i protocols mentre patrulles."
          tags={['Tràfic', 'Lleis', 'Protocols', 'Mapa']}
          selected
        />
        <ModeCard
          cat="academia" icon="graduation"
          title="Estic opositant"
          desc="Tests oficials, flashcards, simulacres i pla d'estudi diari."
          tags={['Mossos', 'Català', 'Físiques', 'Psicotècnics']}
        />
        <ModeCard
          cat="atajos" icon="bolt"
          title="Les dues coses"
          desc="Sóc agent i estic preparant un ascens o trasllat a Mossos."
          tags={['Operativa', 'Acadèmia']}
        />
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0,
        padding: '0 18px',
      }}>
        <window.DuoButton color="academia" full leftIcon="arrow-right">Continua</window.DuoButton>
      </div>
    </div>
  );
}

function ModeCard({ cat, icon, title, desc, tags, selected }) {
  const k = TL.cat[cat];
  return (
    <div style={{
      background: '#fff', borderRadius: TL.r.lg,
      padding: 16, position: 'relative', cursor: 'pointer',
      borderTop: `3px solid ${k.solid}`,
      outline: selected ? `2px solid ${k.solid}` : `1px solid ${TL.hairline}`,
      outlineOffset: selected ? -1 : 0,
      boxShadow: selected ? TL.shadow.pop : TL.shadow.card,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <window.CatIcon cat={cat} icon={icon} size={48} rounded={14} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: TL.fontDisplay, fontWeight: 800, fontSize: 16,
            letterSpacing: -0.2, color: TL.ink,
          }}>{title}</div>
          <div style={{ fontSize: 12.5, color: TL.inkMuted, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          border: selected ? `none` : `2px solid ${TL.hairlineStrong}`,
          background: selected ? k.solid : 'transparent',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          {selected && <IL name="check" size={14} color="#fff" strokeWidth={3} />}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {tags.map(t => (
          <span key={t} style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4,
            textTransform: 'uppercase', color: k.ink,
            background: k.soft, padding: '4px 9px', borderRadius: 999,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenLanding, ScreenOnboarding });
