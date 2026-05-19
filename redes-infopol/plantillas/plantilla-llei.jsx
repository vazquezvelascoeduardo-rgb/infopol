// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Resum de Llei (carrusel 4 slides · 1080×1080)
// Sistema:
//   · Banda lateral 56px amb color de categoria + nom vertical de llei
//   · Footer 72px: iP · indicador "EN 60 SEGONS" · paginador (n/4)
//   · Jerarquia: nº article > nom llei > contingut > CTA
//   · 4 slides amb paleta i fons diferenciats per donar ritme visual
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;

// ─── Tokens locals ────────────────────────────────────────────────
const INK   = T.ink;            // #13131A
const PAPER = T.bg;             // #F6F4EF
const YEL   = T.cat.psico.solid;     // #F0B400 — destacat
const YEL_S = '#FFE979';        // amarillo highlighter pen
const SLIDE = 1080;

// Sistema d'escala: les artboards són 1080×1080 reals; design canvas
// les escala. Un pas de tipus = px @1080.

// ─── DADES — 3 lleis d'exemple per ensenyar variants ──────────────
const LAWS = [
  {
    id: 'lo4-2015',
    cat: T.cat.operativa,        // blau · operativa
    icon: 'badge',
    lawShort: 'LO 4/2015',
    lawName: 'Protecció de la seguretat ciutadana',
    bandLabel: 'LO 4/2015 · SEGURETAT CIUTADANA',
    article: '37.4',
    articleNice: 'Article 37.4',
    headline: 'Falta de respecte als agents',
    quote:
      'Constitueix infracció lleu la falta de respecte i consideració deguda a un membre de les Forces i Cossos de Seguretat en l\u2019exercici de les seves funcions.',
    quoteRef: 'Art. 37.4 LO 4/2015',
    exampleTitle:
      'A un control, un conductor insulta l\u2019agent en demanar-li la documentació.',
    bullets: [
      'Infracció administrativa lleu, no delicte.',
      'Sanció: 100 — 600 €.',
      'Compatible amb altres infraccions de trànsit.',
    ],
    remember: {
      pre: 'Una falta de respecte a l\u2019agent és ',
      hi:  'sanció administrativa',
      post: ', no penal.',
    },
  },
  {
    id: 'cp-379',
    cat: T.cat.alcohol,          // vermell · alcohol
    icon: 'beaker',
    lawShort: 'CP · LO 10/1995',
    lawName: 'Codi Penal — delictes contra la seguretat viària',
    bandLabel: 'CODI PENAL · ART. 379',
    article: '379',
    articleNice: 'Article 379.2',
    headline: 'Conducció sota influència de l\u2019alcohol',
    quote:
      'Serà castigat qui condueixi un vehicle amb una taxa d\u2019alcohol superior a 0,60 mg/l en aire espirat o 1,2 g/l en sang, amb pena de presó o multa i privació del permís.',
    quoteRef: 'Art. 379.2 CP',
    exampleTitle:
      'Conductor donant 0,72 mg/l en etilòmetre evidencial després d\u2019un control preventiu.',
    bullets: [
      'Delicte contra la seguretat viària.',
      'Presó 3—6 mesos o multa 6—12 mesos.',
      'Retirada del permís d\u20191 a 4 anys.',
    ],
    remember: {
      pre: 'Per sobre de 0,60 mg/l ja és ',
      hi:  'delicte penal',
      post: ', no només infracció.',
    },
  },
  {
    id: 'rgc-117',
    cat: T.cat.transito,         // morat · trànsit
    icon: 'car',
    lawShort: 'RD 1428/2003',
    lawName: 'Reglament General de Circulació',
    bandLabel: 'RGC · ART. 117 · TRÀNSIT',
    article: '117',
    articleNice: 'Article 117',
    headline: 'Ús del cinturó de seguretat',
    quote:
      'Els conductors i ocupants dels vehicles de motor i ciclomotors estan obligats a utilitzar, degudament cordats, els cinturons de seguretat homologats.',
    quoteRef: 'Art. 117 RGC',
    exampleTitle:
      'A un control, el copilot d\u2019un turisme circula sense el cinturó cordat per ciutat.',
    bullets: [
      'Infracció greu de l\u2019art. 76 Llei de Trànsit.',
      'Sanció: 200 € i retirada de 3 punts.',
      'Responsable: el conductor (i l\u2019ocupant si és major d\u2019edat).',
    ],
    remember: {
      pre: 'Cordar el cinturó són ',
      hi:  '3 punts i 200 €',
      post: ' si no es porta.',
    },
  },
];

// ─── Helpers de marca ─────────────────────────────────────────────
function ShieldI({ size = 56, c1 = '#fff', c2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z" fill={c1} />
      <circle cx="32" cy="22" r="4.2" fill={c2} />
      <rect x="28.4" y="30" width="7.2" height="20" rx="3.6" fill={c2} />
    </svg>
  );
}

function IPMark({ size = 64, ink = INK, accent }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

// ─── BANDA LATERAL ────────────────────────────────────────────────
function SideBand({ color, label, onDark = false }) {
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 56,
      background: color, color: '#fff',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      paddingBottom: 36, zIndex: 2,
    }}>
      <div className="mono" style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontSize: 18, letterSpacing: 4, fontWeight: 600,
        textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────
function Footer({ page, total = 4, onDark = false, accent, tag = 'EN 60 SEGONS' }) {
  const fg = onDark ? '#fff' : INK;
  const dim = onDark ? 'rgba(255,255,255,0.55)' : 'rgba(19,19,26,0.5)';
  return (
    <div style={{
      position: 'absolute', left: 56, right: 0, bottom: 0, height: 88,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 72px',
      borderTop: `1px solid ${onDark ? 'rgba(255,255,255,0.12)' : 'rgba(19,19,26,0.08)'}`,
    }}>
      {/* iP wordmark · @infopol */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IPMark size={36} ink={fg} accent={accent} />
        <span className="mono" style={{
          fontSize: 18, color: dim, letterSpacing: 2.4,
          textTransform: 'uppercase', fontWeight: 600,
        }}>@infopol · acadèmia</span>
      </div>
      {/* tag */}
      <div className="mono" style={{
        fontSize: 16, color: dim, letterSpacing: 3.4,
        textTransform: 'uppercase', fontWeight: 600,
      }}>{tag}</div>
      {/* paginador */}
      <div className="mono" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 22, fontWeight: 700, color: fg,
      }}>
        <span>{page}</span>
        <span style={{ color: dim, fontWeight: 500 }}>/ {total}</span>
      </div>
    </div>
  );
}

// ─── TAG PETIT (mono small caps) ─────────────────────────────────
function Eyebrow({ children, color = INK, accent }) {
  return (
    <div className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      fontSize: 20, fontWeight: 700, letterSpacing: 3.4,
      textTransform: 'uppercase', color,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 7,
        background: accent, display: 'inline-block',
      }} />
      {children}
    </div>
  );
}

// ─── SLIDE FRAME ──────────────────────────────────────────────────
function Slide({ children, bg = PAPER, law, page, onDark = false, tag, accentFooter }) {
  return (
    <div style={{
      width: SLIDE, height: SLIDE, position: 'relative',
      background: bg, color: onDark ? '#fff' : INK,
      overflow: 'hidden', fontFamily: T.font,
    }}>
      <SideBand color={law.cat.solid} label={law.bandLabel} onDark={onDark} />
      <div style={{
        position: 'absolute', inset: 0,
        paddingLeft: 56 + 88, paddingRight: 88,
        paddingTop: 96, paddingBottom: 88 + 32,
      }}>
        {children}
      </div>
      <Footer page={page} onDark={onDark} accent={accentFooter ?? law.cat.solid} tag={tag} />
    </div>
  );
}

// ─── SLIDE 1 · PORTADA ────────────────────────────────────────────
function SlidePortada({ law }) {
  return (
    <Slide law={law} bg={law.cat.solid} onDark page={1}
           accentFooter="#fff" tag="RESUM RÀPID · 60 SEGONS">
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div className="mono" style={{
          fontSize: 22, fontWeight: 700, letterSpacing: 4.2,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
        }}>
          ◆ {law.lawShort}
        </div>
        <div className="mono" style={{
          fontSize: 18, fontWeight: 600, letterSpacing: 3.4,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
        }}>
          En 60 segons
        </div>
      </div>

      {/* "ARTICLE" rótulo + número GIANT */}
      <div style={{ marginTop: 32 }}>
        <div className="mono" style={{
          fontSize: 32, fontWeight: 700, letterSpacing: 8,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
          marginBottom: -28,
        }}>Article</div>
        <div style={{
          fontFamily: T.font, fontWeight: 900,
          fontSize: 540, lineHeight: 0.86,
          letterSpacing: -28, color: '#fff',
          marginLeft: -16,
        }}>{law.article}</div>
      </div>

      {/* Nom de llei + headline */}
      <div style={{ marginTop: 40, maxWidth: 820 }}>
        <div style={{
          fontSize: 48, fontWeight: 800,
          letterSpacing: -1.2, lineHeight: 1.06, color: '#fff',
        }}>{law.headline}</div>
        <div style={{
          marginTop: 18, fontSize: 28, fontWeight: 500,
          color: 'rgba(255,255,255,0.78)', lineHeight: 1.3,
          letterSpacing: -0.2,
        }}>{law.lawName}</div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 2 · QUÈ DIU ────────────────────────────────────────────
function SlideQueDiu({ law }) {
  return (
    <Slide law={law} bg="#FFFFFF" page={2} tag="LITERAL · L'ARTICLE">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <Eyebrow accent={law.cat.solid}>Què diu</Eyebrow>
        <div className="mono" style={{
          fontSize: 18, fontWeight: 600, letterSpacing: 3,
          textTransform: 'uppercase', color: T.inkMuted,
        }}>{law.articleNice}</div>
      </div>

      {/* Gegantesc signe " */}
      <div style={{
        position: 'absolute', left: 56 + 56, top: 56,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 480, lineHeight: 0.7, fontWeight: 700,
        color: law.cat.soft, userSelect: 'none', pointerEvents: 'none',
        zIndex: 0,
      }}>“</div>

      {/* Quote */}
      <div style={{
        position: 'relative', zIndex: 1,
        marginTop: 160, maxWidth: 880,
      }}>
        <div style={{
          fontFamily: T.font, fontStyle: 'italic',
          fontSize: 58, lineHeight: 1.14, fontWeight: 500,
          letterSpacing: -0.6, color: INK,
          textWrap: 'pretty',
        }}>{law.quote}</div>

        {/* Ref + barra de color */}
        <div style={{
          marginTop: 48, display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            width: 60, height: 6, borderRadius: 3,
            background: law.cat.solid,
          }} />
          <div className="mono" style={{
            fontSize: 22, fontWeight: 700, letterSpacing: 3.4,
            textTransform: 'uppercase', color: law.cat.ink,
          }}>{law.quoteRef}</div>
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 3 · EXEMPLE PRÀCTIC ────────────────────────────────────
function SlideExemple({ law }) {
  return (
    <Slide law={law} bg={PAPER} page={3} tag="CAS REAL">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 56,
      }}>
        <Eyebrow accent={law.cat.solid}>Exemple pràctic</Eyebrow>
        <div className="mono" style={{
          fontSize: 18, fontWeight: 600, letterSpacing: 3,
          textTransform: 'uppercase', color: T.inkMuted,
        }}>{law.articleNice}</div>
      </div>

      <div style={{ display: 'flex', gap: 56, alignItems: 'flex-start' }}>
        {/* Icon badge */}
        <div style={{ flex: '0 0 auto' }}>
          <div style={{
            width: 240, height: 240, borderRadius: 999,
            background: law.cat.soft,
            display: 'grid', placeItems: 'center',
            border: `2px solid ${law.cat.solid}`,
          }}>
            <div style={{ color: law.cat.solid }}>
              <Icon name={law.icon} size={120} strokeWidth={1.6} />
            </div>
          </div>
        </div>

        {/* Texto */}
        <div style={{ flex: 1, paddingTop: 10 }}>
          <div style={{
            fontSize: 40, fontWeight: 700, letterSpacing: -0.6,
            lineHeight: 1.18, color: INK, textWrap: 'pretty',
          }}>{law.exampleTitle}</div>
        </div>
      </div>

      {/* Bullets */}
      <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {law.bullets.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 24,
            padding: '24px 28px', borderRadius: 18,
            background: '#fff', border: `1px solid ${T.hairline}`,
          }}>
            <div style={{
              minWidth: 44, height: 44, borderRadius: 22,
              background: law.cat.solid, color: '#fff',
              display: 'grid', placeItems: 'center',
              fontFamily: T.fontMono, fontWeight: 700, fontSize: 20,
            }}>{i + 1}</div>
            <div style={{
              fontSize: 30, fontWeight: 600, letterSpacing: -0.3,
              lineHeight: 1.28, color: INK, paddingTop: 4,
              textWrap: 'pretty',
            }}>{b}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

// ─── SLIDE 4 · RECORDA ────────────────────────────────────────────
function SlideRecorda({ law }) {
  return (
    <Slide law={law} bg={INK} onDark page={4}
           accentFooter={law.cat.solid} tag="DESA-HO · COMPARTEIX">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <Eyebrow accent={YEL} color="#fff">Recorda</Eyebrow>
        <div className="mono" style={{
          fontSize: 18, fontWeight: 600, letterSpacing: 3,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
        }}>{law.articleNice}</div>
      </div>

      {/* Frase resum amb highlighter */}
      <div style={{
        marginTop: 24, maxWidth: 880,
        fontSize: 78, fontWeight: 800, lineHeight: 1.08,
        letterSpacing: -1.8, color: '#fff', textWrap: 'pretty',
      }}>
        {law.remember.pre}
        <span style={{
          position: 'relative', display: 'inline',
          padding: '2px 18px 6px 18px',
          background: YEL, color: INK, borderRadius: 8,
          boxDecorationBreak: 'clone',
          WebkitBoxDecorationBreak: 'clone',
        }}>{law.remember.hi}</span>
        <span style={{ color: '#fff' }}>{law.remember.post}</span>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', left: 56 + 88, right: 88, bottom: 88 + 56,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 28, padding: '28px 36px',
          background: YEL, borderRadius: 22,
          boxShadow: '0 -3px 0 rgba(0,0,0,0.12) inset, 0 24px 60px -12px rgba(240,180,0,0.45)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {/* bookmark icon */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
                 stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12v18l-6-4-6 4V3z" fill={INK} stroke="none"/>
            </svg>
            <div>
              <div className="mono" style={{
                fontSize: 16, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', color: 'rgba(19,19,26,0.6)',
                marginBottom: 4,
              }}>CTA · ACCIÓ</div>
              <div style={{
                fontSize: 38, fontWeight: 800, color: INK,
                letterSpacing: -0.6, lineHeight: 1.05,
              }}>Guarda aquesta publicació</div>
            </div>
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: INK, color: YEL,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name="arrow-right" size={36} strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── ROW · una llei sencera (4 slides) ────────────────────────────
function LawRow({ law }) {
  return (
    <DCSection
      id={law.id}
      title={`${law.lawShort} · Art. ${law.article}`}
      subtitle={`${law.headline} — variant ${law.cat.solid}`}
    >
      <DCArtboard id={`${law.id}-1`} label="01 · Portada"
                  width={SLIDE} height={SLIDE}>
        <SlidePortada law={law} />
      </DCArtboard>
      <DCArtboard id={`${law.id}-2`} label="02 · Què diu"
                  width={SLIDE} height={SLIDE}>
        <SlideQueDiu law={law} />
      </DCArtboard>
      <DCArtboard id={`${law.id}-3`} label="03 · Exemple pràctic"
                  width={SLIDE} height={SLIDE}>
        <SlideExemple law={law} />
      </DCArtboard>
      <DCArtboard id={`${law.id}-4`} label="04 · Recorda + CTA"
                  width={SLIDE} height={SLIDE}>
        <SlideRecorda law={law} />
      </DCArtboard>
    </DCSection>
  );
}

// ─── SISTEMA / LLEGENDA ───────────────────────────────────────────
function SystemCard() {
  const cats = [
    { name: 'Seguretat ciutadana', c: T.cat.operativa },
    { name: 'Codi Penal', c: T.cat.alcohol },
    { name: 'Trànsit · circulació', c: T.cat.transito },
    { name: 'Drets · psicotècnic', c: T.cat.psico },
    { name: 'Atestats · operativa', c: T.cat.atajos },
  ];
  return (
    <DCArtboard id="system" label="Sistema · banda de color per categoria"
                width={720} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 56, fontFamily: T.font, color: INK,
      }}>
        <div className="mono" style={{
          fontSize: 14, fontWeight: 700, letterSpacing: 2.8,
          textTransform: 'uppercase', color: T.inkMuted, marginBottom: 12,
        }}>Plantilla · resum de llei</div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Jerarquia visual
        </div>
        <div style={{ fontSize: 16, color: T.inkSoft, marginTop: 8, lineHeight: 1.45 }}>
          Nº article &gt; nom llei &gt; contingut &gt; CTA.
          Cada categoria té un color de banda lateral.
        </div>

        <div style={{
          marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {cats.map(({ name, c }) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 12,
              background: '#FAF8F3',
            }}>
              <div style={{ width: 8, height: 32, borderRadius: 4, background: c.solid }} />
              <div style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>{name}</div>
              <div className="mono" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 1.4,
                textTransform: 'uppercase', color: T.inkMuted,
              }}>{c.solid}</div>
            </div>
          ))}
        </div>

        {/* Especs tipogràfiques */}
        <div className="mono" style={{
          marginTop: 28, fontSize: 14, fontWeight: 700,
          letterSpacing: 2.8, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 12,
        }}>Especs · 1080×1080</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: T.inkSoft }}>
          <Spec k="nº article" v="Manrope 900 · 540 px" />
          <Spec k="headline" v="Manrope 800 · 48 px" />
          <Spec k="cita" v="Manrope 500 italic · 58 px" />
          <Spec k="bullets" v="Manrope 600 · 30 px" />
          <Spec k="recorda" v="Manrope 800 · 78 px · highlight groc" />
          <Spec k="CTA" v="Manrope 800 · 38 px · pill groc" />
          <Spec k="banda" v="56 px · color de categoria" />
          <Spec k="margen" v="left 144 · right/top/bottom 96 px" />
        </div>
      </div>
    </DCArtboard>
  );
}

function Spec({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span className="mono" style={{ color: T.inkMuted }}>{k}</span>
      <span style={{ fontWeight: 600, color: INK, fontFamily: T.fontMono }}>{v}</span>
    </div>
  );
}

// ─── TWEAKS PANEL ────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "show_system": true
}/*EDITMODE-END*/;

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Llegenda">
        <TweakRadio
          label="Mostrar fitxa de sistema"
          value={t.show_system ? 'yes' : 'no'}
          options={[
            { value: 'yes', label: 'Sí' },
            { value: 'no',  label: 'No' },
          ]}
          onChange={(v) => setTweak('show_system', v === 'yes')}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  return (
    <React.Fragment>
      <DesignCanvas>
        {LAWS.map((law) => <LawRow key={law.id} law={law} />)}
        {t.show_system && (
          <DCSection id="system" title="Sistema" subtitle="Tokens i jerarquia que comparteixen les 3 lleis.">
            <SystemCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
