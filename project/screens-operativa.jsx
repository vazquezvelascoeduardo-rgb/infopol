// screens-operativa.jsx — Operativa flow

const TO = window.TOKENS;
const IO = window.Icon;

// ── Home Operativa ──────────────────────────────────────────────
function ScreenOperativaHome() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />

      {/* top bar */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <window.InfoPolWordmark height={18} />
        <div style={{ display: 'flex', gap: 8 }}>
          <RoundIcon icon="bell" />
          <RoundIcon icon="user" />
        </div>
      </div>

      {/* salutation */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: TO.cat.operativa.solid, marginBottom: 4 }}>
          Mode operativa · Torn 06–14
        </div>
        <h1 style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Bon dia, agent <span style={{ color: TO.cat.academia.solid }}>Roca</span>.
        </h1>
      </div>

      {/* search */}
      <div style={{ padding: '0 16px' }}>
        <window.SearchField placeholder="Cerca article, infracció, paraula clau…" />
      </div>

      {/* primary cards (mirroring Leyes / Operativa duo) */}
      <div style={{ padding: '16px 16px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BigCatCard cat="leyes" icon="scale" kicker="Temari" title="Lleis" desc="CP, LECrim, FCS, LSV, Seg. Ciutadana." cta="Obrir" />
        <BigCatCard cat="operativa" icon="siren" kicker="A peu de carrer" title="Operativa" desc="Procediments per situació." cta="Entrar" />
      </div>

      {/* superbuscador */}
      <div style={{ padding: '4px 16px' }}>
        <div style={{
          background: '#fff', borderRadius: TO.r.lg, padding: 16,
          borderTop: `3px solid ${TO.cat.transito.solid}`,
          boxShadow: TO.shadow.card, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <window.CatIcon cat="transito" icon="car" size={44} rounded={12} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: TO.cat.transito.ink }}>
                Trànsit · Catàleg SCT
              </div>
              <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 17, letterSpacing: -0.3, marginTop: 2 }}>
                Superbuscador d'infraccions
              </div>
              <div style={{ fontSize: 12, color: TO.inkMuted, marginTop: 3, lineHeight: 1.4 }}>
                LSV, RGC, RGV, Asseguranza i CP. Resultats amb quantia i DTE.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['Alcohol', 'Drogues', 'Velocitat', 'Documentació', 'Telèfon mòbil'].map(t => (
              <span key={t} style={{ fontSize: 11, padding: '5px 10px', background: TO.cat.transito.soft, color: TO.cat.transito.ink, borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* small triplet — match web 3-row */}
      <div style={{ padding: '12px 16px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <SmallCatCard cat="leyes" icon="book" kicker="Trànsit · SCT" title="Catàleg infraccions" />
        <SmallCatCard cat="alcohol" icon="beaker" kicker="Calculadora" title="Alcoholèmia" />
        <SmallCatCard cat="atajos" icon="bolt" kicker="Dreceres" title="Recursos ràpids" />
        <SmallCatCard cat="operativa" icon="map" kicker="Patrullatge" title="Mapa d'incidències" />
      </div>

      {/* Protocol estrella */}
      <div style={{ padding: '10px 16px' }}>
        <div style={{
          background: TO.cat.operativa.solid, borderRadius: TO.r.lg, padding: 16,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <window.Pill bg="rgba(255,255,255,0.18)" fg="#fff">★ Estrella d'InfoPol</window.Pill>
          <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 18, marginTop: 10, letterSpacing: -0.3 }}>
            Protocols pas a pas
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>
            132 situacions cobertes amb article, sanció i diligència.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Chip icon="route" label="Identificació" />
            <Chip icon="car" label="Control trànsit" />
            <Chip icon="siren" label="Detenció" />
          </div>
        </div>
      </div>

      {/* Actualitat */}
      <div style={{ padding: '14px 0 0' }}>
        <window.SectionHead kicker="Actualitat" kickerColor={TO.cat.operativa.solid} title="Última hora normativa" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { date: '04·18', tag: 'LO 1/2026', title: 'Multireincidència — endurim de furts i estafes lleus', desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril.' },
            { date: '04·14', tag: 'RD 316/2026', title: 'Reforma del Reglament d\'Estrangeria', desc: 'Dues figures noves d\'arrelament. Termini fins al 30 de juny.' },
          ].map((n, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: TO.r.md, padding: 14,
              borderLeft: `2px solid ${TO.cat.operativa.solid}`, boxShadow: TO.shadow.card,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: TO.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: TO.fontMono, fontSize: 10, color: TO.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: TO.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: TO.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoundIcon({ icon }) {
  return (
    <button style={{
      width: 36, height: 36, borderRadius: 999, background: '#fff',
      border: `1px solid ${TO.hairline}`, boxShadow: TO.shadow.card,
      display: 'grid', placeItems: 'center', cursor: 'pointer',
    }}>
      <IO name={icon} size={18} color={TO.inkSoft} strokeWidth={2.2} />
    </button>
  );
}

function BigCatCard({ cat, icon, kicker, title, desc, cta }) {
  const k = TO.cat[cat];
  return (
    <div style={{
      background: '#fff', borderRadius: TO.r.lg, padding: 14,
      borderTop: `3px solid ${k.solid}`, boxShadow: TO.shadow.card,
      display: 'flex', flexDirection: 'column', gap: 8, minHeight: 158,
    }}>
      <window.CatIcon cat={cat} icon={icon} size={40} rounded={11} />
      <div>
        <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 17, letterSpacing: -0.3, marginTop: 1 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: TO.inkMuted, marginTop: 4, lineHeight: 1.35 }}>{desc}</div>
      </div>
      <div style={{ marginTop: 'auto', color: k.solid, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
        {cta} <IO name="arrow-right" size={14} />
      </div>
    </div>
  );
}

function SmallCatCard({ cat, icon, kicker, title }) {
  const k = TO.cat[cat];
  return (
    <div style={{
      background: '#fff', borderRadius: TO.r.md, padding: 12,
      borderTop: `3px solid ${k.solid}`, boxShadow: TO.shadow.card,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <window.CatIcon cat={cat} icon={icon} size={36} rounded={9} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.9, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: -0.2, color: TO.ink, marginTop: 1 }}>{title}</div>
      </div>
      <IO name="chevron-right" size={16} color={TO.inkMuted} />
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.16)', color: '#fff',
      padding: '6px 10px 6px 8px', borderRadius: 999,
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700,
    }}>
      <IO name={icon} size={13} color="#fff" strokeWidth={2.4} />{label}
    </div>
  );
}

// ── Cercador d'infraccions ──────────────────────────────────────
function ScreenInfraccions() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader cat="transito" kicker="Trànsit · Catàleg SCT" title="Infraccions" />

      <div style={{ padding: '0 16px' }}>
        <window.SearchField placeholder="alcohol, mòbil, casc, art. 76..." />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10, paddingBottom: 4 }}>
          {[
            { l: 'Totes', n: 1840, on: true },
            { l: 'Greus', n: 612 },
            { l: 'Molt greus', n: 184 },
            { l: 'LSV', n: 920 },
            { l: 'RGC', n: 760 },
          ].map((f, i) => (
            <button key={i} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              border: f.on ? 'none' : `1px solid ${TO.hairlineStrong}`,
              background: f.on ? TO.ink : '#fff',
              color: f.on ? '#fff' : TO.inkSoft, cursor: 'pointer',
              fontFamily: TO.font, fontSize: 12, fontWeight: 700,
            }}>{f.l} <span style={{ opacity: 0.6, fontWeight: 600, marginLeft: 3 }}>{f.n}</span></button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { sev: 'mg', code: 'A·002', art: 'Art. 77.c LSV', title: 'Conduir amb taxa d\'alcohol superior a 0,60 mg/l aire', euros: '1.000 €', pts: '6 punts', tag: 'Molt greu' },
          { sev: 'g',  code: 'A·011', art: 'Art. 76.a LSV', title: 'Utilitzar manualment dispositius de telefonia', euros: '200 €', pts: '6 punts', tag: 'Greu' },
          { sev: 'mg', code: 'V·041', art: 'Art. 21 RGC',   title: 'Excedir el límit de velocitat en més de 50 km/h en via urbana', euros: '600 €', pts: '6 punts', tag: 'Molt greu' },
          { sev: 'g',  code: 'D·018', art: 'Art. 26.a RGC', title: 'No utilitzar cinturó de seguretat ni dispositiu de retenció', euros: '200 €', pts: '3 punts', tag: 'Greu' },
          { sev: 'l',  code: 'L·203', art: 'Art. 99 LSV',   title: 'Estacionar en zona de càrrega i descàrrega fora d\'horari', euros: '80 €', pts: '—', tag: 'Lleu' },
        ].map((r, i) => (
          <InfraccionRow key={i} {...r} />
        ))}
      </div>
    </div>
  );
}

function InfraccionRow({ sev, code, art, title, euros, pts, tag }) {
  const sevColor = sev === 'mg' ? TO.cat.alcohol : sev === 'g' ? TO.cat.psico : TO.cat.atajos;
  return (
    <div style={{
      background: '#fff', borderRadius: TO.r.md, padding: 14,
      boxShadow: TO.shadow.card, borderLeft: `3px solid ${sevColor.solid}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{
          fontFamily: TO.fontMono, fontSize: 10, color: TO.inkMuted,
          background: TO.bg, padding: '2px 6px', borderRadius: 4,
        }}>{code}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: TO.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>{art}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, color: sevColor.ink, background: sevColor.soft, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.4, textTransform: 'uppercase' }}>{tag}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: TO.ink, lineHeight: 1.35 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <span style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 16, color: TO.ink }}>{euros}</span>
        <span style={{ fontSize: 11, color: TO.inkMuted, fontWeight: 600 }}>· {pts}</span>
        <IO name="chevron-right" size={16} color={TO.inkMuted} style={{ marginLeft: 'auto' }}/>
      </div>
    </div>
  );
}

// ── Fitxa d'infracció ─────────────────────────────────────────
function ScreenFitxa() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader cat="transito" kicker="Art. 77.c · LSV" title="Alcohol > 0,60 mg/l" back />

      {/* hero ficha */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: TO.cat.alcohol.solid, color: '#fff',
          borderRadius: TO.r.lg, padding: 16, position: 'relative', overflow: 'hidden',
        }}>
          <window.Pill bg="rgba(255,255,255,0.2)" fg="#fff">Molt greu · Penal</window.Pill>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
            <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 38, letterSpacing: -1.4, lineHeight: 1 }}>1.000 €</div>
            <div style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>+ 6 punts</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            <Stat label="Possible delicte" value="Art. 379.2 CP" />
            <Stat label="Detenció" value="Procedeix" />
            <Stat label="Permís retirat" value="Sí, immediat" />
            <Stat label="Diligència" value="Atestat" />
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ padding: '14px 16px 0', display: 'flex', gap: 6 }}>
        {[
          { l: 'Resum', on: true }, { l: 'Llei' }, { l: 'Procediment' }, { l: 'Diligència' },
        ].map((t, i) => (
          <button key={i} style={{
            padding: '8px 14px', borderRadius: 999, border: 'none',
            background: t.on ? TO.cat.alcohol.solid : '#fff',
            color: t.on ? '#fff' : TO.inkSoft,
            fontFamily: TO.font, fontWeight: 700, fontSize: 12,
            boxShadow: t.on ? 'inset 0 -2px 0 rgba(0,0,0,0.18)' : TO.shadow.card,
          }}>{t.l}</button>
        ))}
      </div>

      {/* article block */}
      <div style={{ padding: '14px 16px 0' }}>
        <SectionTitle>Tipus penal · CP 379.2</SectionTitle>
        <div style={{ background: '#fff', borderRadius: TO.r.md, padding: 14, boxShadow: TO.shadow.card }}>
          <div style={{ fontSize: 13, color: TO.inkSoft, lineHeight: 1.55 }}>
            <i>"Amb les mateixes penes serà castigat el que conduís un vehicle de motor o ciclomotor sota la influència de begudes alcohòliques. En tot cas serà condemnat amb aquestes penes el que condueixi amb una taxa d'alcohol en aire espirat superior a <b style={{ color: TO.cat.alcohol.solid }}>0,60 mg/l</b>…"</i>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            <window.Pill bg={TO.cat.alcohol.soft} fg={TO.cat.alcohol.ink}>3–6 mesos presó</window.Pill>
            <window.Pill bg={TO.cat.alcohol.soft} fg={TO.cat.alcohol.ink}>6–12 m. multa</window.Pill>
            <window.Pill bg={TO.cat.alcohol.soft} fg={TO.cat.alcohol.ink}>Privació 1–4 anys</window.Pill>
          </div>
        </div>
      </div>

      {/* checklist procedimiento */}
      <div style={{ padding: '14px 16px 24px' }}>
        <SectionTitle>Què has de fer · resum</SectionTitle>
        <div style={{ background: '#fff', borderRadius: TO.r.md, boxShadow: TO.shadow.card, overflow: 'hidden' }}>
          {[
            'Repetir prova al cap de 10 minuts',
            'Informar dels seus drets',
            'Procedir a la detenció',
            'Retirar el permís en l\'acte',
            'Aixecar atestat (model 12.4)',
          ].map((step, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${TO.hairline}` : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: TO.cat.alcohol.soft, color: TO.cat.alcohol.ink,
                display: 'grid', placeItems: 'center',
                fontFamily: TO.fontMono, fontWeight: 700, fontSize: 11,
              }}>{i + 1}</div>
              <div style={{ fontSize: 13.5, color: TO.ink, fontWeight: 500 }}>{step}</div>
              <IO name="chevron-right" size={14} color={TO.inkMuted} style={{ marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 10, padding: 10 }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, opacity: 0.85, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function NavHeader({ cat = 'operativa', kicker, title, back }) {
  const k = TO.cat[cat];
  return (
    <div style={{ padding: '8px 16px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {back && <button style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: TO.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}><IO name="arrow-left" size={18} color={TO.ink} /></button>}
        <div style={{ marginLeft: back ? 0 : 0 }}>
          <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        </div>
        <RoundIcon icon="filter" />
      </div>
      <h1 style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>{title}</h1>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: TO.font, fontWeight: 800, fontSize: 11,
      letterSpacing: 1.2, textTransform: 'uppercase',
      color: TO.inkMuted, marginBottom: 8,
    }}>{children}</div>
  );
}

// ── Protocols pas a pas ─────────────────────────────────────────
function ScreenProtocol() {
  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <window.StatusBar />
      <NavHeader cat="operativa" kicker="Protocol · Trànsit" title="Control d'alcohol" back />

      {/* progress */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: TO.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Pas 3 de 6</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: TO.cat.operativa.solid }}>50%</span>
        </div>
        <window.ProgressBar value={50} color={TO.cat.operativa.solid} />
      </div>

      {/* big situation card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: TO.cat.operativa.solid, color: '#fff',
          borderRadius: TO.r.lg, padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontFamily: TO.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.8 }}>Situació</div>
          <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: -0.4, marginTop: 4 }}>
            El conductor dóna positiu per sobre de 0,60 mg/l. Què fas?
          </div>
        </div>
      </div>

      {/* paso actual */}
      <div style={{ padding: '14px 16px 0' }}>
        <SectionTitle>Acció recomanada</SectionTitle>
        <div style={{
          background: '#fff', borderRadius: TO.r.lg, padding: 16,
          boxShadow: TO.shadow.card,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: TO.cat.alcohol.soft, color: TO.cat.alcohol.ink,
              display: 'grid', placeItems: 'center',
              fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 16,
            }}>3</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TO.fontDisplay, fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>
                Procedir a la detenció
              </div>
              <div style={{ fontSize: 12.5, color: TO.inkMuted, marginTop: 2, lineHeight: 1.4 }}>
                Hi ha indicis racionals d'un delicte contra la seguretat viària (art. 379.2 CP).
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            <ProtoLi>Informa de la detenció i del motiu.</ProtoLi>
            <ProtoLi>Lectura de drets (art. 520 LECrim).</ProtoLi>
            <ProtoLi>Comunica a la sala. Trasllat a comissaria.</ProtoLi>
          </div>

          <div style={{
            marginTop: 14, padding: 12, borderRadius: 12,
            background: TO.cat.psico.soft, display: 'flex', gap: 10,
          }}>
            <IO name="bolt" size={18} color={TO.cat.psico.ink} />
            <div style={{ fontSize: 12, color: TO.cat.psico.ink, lineHeight: 1.4, fontWeight: 600 }}>
              <b>Atenció:</b> si es nega a la segona prova, art. 383 CP — desobediència greu.
            </div>
          </div>
        </div>
      </div>

      {/* bottom action */}
      <div style={{ padding: '18px 16px 0', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 0.4, background: '#fff', border: `1px solid ${TO.hairlineStrong}`,
          borderRadius: 16, padding: '12px 16px', cursor: 'pointer',
          fontFamily: TO.font, fontWeight: 700, fontSize: 13, color: TO.inkSoft,
        }}>← Anterior</button>
        <window.DuoButton color="operativa" full leftIcon="arrow-right">Següent pas</window.DuoButton>
      </div>
    </div>
  );
}

function ProtoLi({ children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: TO.cat.operativa.solid, marginTop: 7 }} />
      <div style={{ fontSize: 13, color: TO.inkSoft, lineHeight: 1.45 }}>{children}</div>
    </div>
  );
}

// ── Mapa d'incidències ─────────────────────────────────────────
function ScreenMapa() {
  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <window.StatusBar />
      <NavHeader cat="operativa" kicker="Patrullatge" title="Mapa d'incidències" />

      {/* fake map */}
      <div style={{
        margin: '0 16px', borderRadius: TO.r.lg, overflow: 'hidden',
        height: 320, position: 'relative',
        background: 'linear-gradient(180deg, #E5EBE0 0%, #D8E3D2 100%)',
        boxShadow: TO.shadow.card,
      }}>
        {/* roads */}
        <svg width="100%" height="100%" viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 80 L320 120" stroke="#fff" strokeWidth="14" />
          <path d="M0 220 L320 200" stroke="#fff" strokeWidth="10" />
          <path d="M120 0 L100 320" stroke="#fff" strokeWidth="12" />
          <path d="M260 0 L240 320" stroke="#fff" strokeWidth="10" />
          <path d="M0 80 L320 120" stroke="rgba(0,0,0,0.05)" strokeDasharray="4 8" />
        </svg>
        {/* parks */}
        <div style={{ position: 'absolute', top: 130, left: 130, width: 90, height: 60, background: 'rgba(31,178,134,0.22)', borderRadius: 14 }} />
        <div style={{ position: 'absolute', top: 230, left: 30, width: 60, height: 50, background: 'rgba(31,178,134,0.22)', borderRadius: 14 }} />

        {/* pins */}
        <Pin x={70} y={110} cat="alcohol" icon="beaker" size={36} />
        <Pin x={190} y={70} cat="transito" icon="car" />
        <Pin x={250} y={170} cat="psico" icon="flag" />
        <Pin x={150} y={240} cat="operativa" icon="siren" pulsing />
        <Pin x={80} y={260} cat="atajos" icon="check" />

        {/* you */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 18, height: 18, borderRadius: 999,
          background: TO.cat.operativa.solid, border: '3px solid #fff',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 0 6px rgba(59,107,245,0.2)',
        }} />
      </div>

      {/* legend / list */}
      <div style={{ padding: '14px 16px 100px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { cat: 'alcohol', l: 'Alcohol' },
            { cat: 'transito', l: 'Trànsit' },
            { cat: 'operativa', l: 'Detencions' },
            { cat: 'psico', l: 'Avisos' },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', borderRadius: 999, padding: '5px 10px',
              border: `1px solid ${TO.hairline}`, fontSize: 11, fontWeight: 700, color: TO.inkSoft,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: TO.cat[t.cat].solid }} />{t.l}
            </div>
          ))}
        </div>

        <SectionTitle>Properes a tu</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { cat: 'operativa', icon: 'siren', d: '0,3 km', t: '14:02', title: 'Aldarull · C/ Indústria 88', tag: 'En curs' },
            { cat: 'alcohol', icon: 'beaker', d: '0,8 km', t: '13:48', title: 'Control alcohol · Av. Diagonal', tag: 'Programat' },
            { cat: 'transito', icon: 'car', d: '1,2 km', t: '13:31', title: 'Accident lleu · Pl. Catalunya', tag: 'Tancat' },
          ].map((r, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: TO.r.md, padding: 12,
              boxShadow: TO.shadow.card, borderLeft: `2px solid ${TO.cat[r.cat].solid}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <window.CatIcon cat={r.cat} icon={r.icon} size={36} rounded={9} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TO.ink }}>{r.title}</div>
                <div style={{ fontSize: 11, color: TO.inkMuted, marginTop: 2 }}>
                  {r.d} · {r.t} · <span style={{ color: TO.cat[r.cat].solid, fontWeight: 700 }}>{r.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pin({ x, y, cat, icon, size = 32, pulsing }) {
  const k = TO.cat[cat];
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -100%)' }}>
      {pulsing && (
        <div style={{
          position: 'absolute', left: '50%', top: '100%',
          width: 32, height: 32, borderRadius: 999,
          background: k.solid, opacity: 0.25,
          transform: 'translate(-50%, -50%) scale(1.5)',
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: '50% 50% 50% 6px',
        background: k.solid, transform: 'rotate(-45deg)',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 6px 14px rgba(19,19,26,0.25)',
        border: '2px solid #fff',
      }}>
        <div style={{ transform: 'rotate(45deg)' }}>
          <IO name={icon} size={size * 0.45} color="#fff" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenOperativaHome, ScreenInfraccions, ScreenFitxa,
  ScreenProtocol, ScreenMapa,
});
