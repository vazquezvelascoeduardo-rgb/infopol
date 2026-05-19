// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Reforma (Abans / Després)
// Format: Single post 1080×1080 + carrusel ampliat 5 slides + story 1080×1920.
//
// Regles visuals:
//   · Banda superior verd #06A77D · "REFORMA · llei · data" sempre visible
//   · Bloc ABANS · fons gris clar · text antic tatxat en gris #777
//   · Bloc ARA   · fons verd clar #C8E6C9 · text negre · paraules
//                  noves/canviades ressaltades en groc
//   · Banda inferior groga · "💡 Què canvia per a tu: ..." impacte pràctic
//
// Sintaxi de marques al text:
//   ~~text~~  →  strikethrough (text antic eliminat)
//   ==text==  →  highlight groc (paraules afegides / canviades)
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;

const INK   = T.ink;
const PAPER = T.bg;
const NAVY  = '#0E1A36';
const GREEN = '#06A77D';
const GREEN_DEEP = '#055B45';
const GREEN_LIGHT = '#C8E6C9';
const GRAY_LIGHT = '#ECEEF2';
const STRIKE = '#888888';
const YEL   = T.cat.psico.solid;   // #F0B400
const YEL_HI = '#FFE066';          // highlighter

// ─── DADES ────────────────────────────────────────────────────────
// Exemples il·lustratius. Reescrivibles per a cada reforma real.
const REFORMS = [
  {
    id: 'mobil-conduccio',
    law: 'RGC',
    article: 'art. 18',
    date: '01 GENER 2026',
    title: 'Mòbil al volant',
    bigChange: 'Manipular el mòbil = 6 punts',
    abans: {
      ref: 'Art. 18 RGC · text antic',
      text: 'El conductor no podrà ~~utilitzar telèfons mòbils manuals~~ durant la conducció. Sanció de 200 € i retirada de 3 punts.',
    },
    ara: {
      ref: 'Art. 18 RGC · text vigent',
      text: 'El conductor no podrà ==manipular ni subjectar== cap dispositiu mòbil durant la conducció, ==encara que estigui en suport==. Sanció de 200 € i retirada de ==6 punts==.',
    },
    impact: 'Tocar la pantalla o agafar el mòbil ja és sanció — encara que estigui al suport.',
    minor: [
      'Auriculars: prohibit dur-ne als dos oïdes (abans només era recomanació).',
      'Smartwatch: equiparat a dispositiu mòbil si requereix atenció.',
    ],
    forActive:
      'Comprova-ho a la primera fase del control: la posició de les mans i el suport del mòbil són ara prova directa.',
    forOposant:
      'Reapareix a temari de Trànsit i Seguretat Viària — repassa l\u2019escalat de punts.',
  },
  {
    id: 'respecte-lo42015',
    law: 'LO 4/2015',
    article: 'art. 37.4',
    date: '15 MARÇ 2026',
    title: 'Faltes de respecte als agents',
    bigChange: 'Es passa a "menyspreu o ofensa"',
    abans: {
      ref: 'Art. 37.4 LO 4/2015 · text antic',
      text: 'Constitueix infracció lleu la ~~falta de respecte i consideració deguda~~ a un membre de les Forces i Cossos de Seguretat en l\u2019exercici de les seves funcions.',
    },
    ara: {
      ref: 'Art. 37.4 LO 4/2015 · text vigent',
      text: 'Constitueix infracció lleu el ==menyspreu o ofensa== a un membre de les Forces i Cossos de Seguretat en l\u2019exercici de les seves funcions ==o amb motiu d\u2019aquestes==.',
    },
    impact: 'Els insults o ofenses queden tipificats amb més claredat — i també fora de servei si tenen relació amb la funció.',
    minor: [
      'Sanció lleu: 100 — 600 € (sense canvis).',
      'Compatible amb altres infraccions concurrent.',
    ],
    forActive:
      'Al teu informe, descriu literalment les expressions: l\u2019ofensa s\u2019ha de poder identificar com a tal.',
    forOposant:
      'Tema Seguretat Ciutadana: nova redacció textual a memoritzar.',
  },
  {
    id: 'alcohol-cp379',
    law: 'Codi Penal',
    article: 'art. 379.2',
    date: '01 JULIOL 2026',
    title: 'Taxa d\u2019alcohol en conducció',
    bigChange: 'Mateix delicte, més clar',
    abans: {
      ref: 'Art. 379.2 CP · text antic',
      text: 'Serà castigat qui condueixi ~~sota la influència de l\u2019alcohol~~ amb una taxa superior a 0,60 mg/l en aire espirat o 1,2 g/l en sang.',
    },
    ara: {
      ref: 'Art. 379.2 CP · text vigent',
      text: 'Serà castigat qui condueixi ==amb una taxa==  superior a 0,60 mg/l en aire espirat o 1,2 g/l en sang. ==No cal demostrar influència==: és delicte automàtic.',
    },
    impact: 'Per sobre de 0,60 mg/l no cal demostrar que afecta la conducció — és delicte per si sol.',
    minor: [
      'Pena: 3—6 mesos presó o multa 6—12 mesos.',
      'Retirada del permís d\u20191 a 4 anys.',
    ],
    forActive:
      'A l\u2019atestat, prou amb taxa positiva > 0,60 mg/l + lectura evidencial homologada.',
    forOposant:
      'Repassa la doctrina del TS sobre "influència" — ara queda residual als trams inferiors.',
  },
];

// ─── PARSER DE MARQUES ~~strike~~ + ==hi== ────────────────────────
function parseMarks(text) {
  const parts = [];
  let i = 0;
  while (i < text.length) {
    if (text.slice(i, i + 2) === '~~') {
      const end = text.indexOf('~~', i + 2);
      if (end >= 0) { parts.push({ k: 'strike', t: text.slice(i + 2, end) }); i = end + 2; continue; }
    }
    if (text.slice(i, i + 2) === '==') {
      const end = text.indexOf('==', i + 2);
      if (end >= 0) { parts.push({ k: 'hi', t: text.slice(i + 2, end) }); i = end + 2; continue; }
    }
    // següent marca o final
    const a = text.indexOf('~~', i);
    const b = text.indexOf('==', i);
    const candidates = [a, b].filter((n) => n >= 0);
    const stop = candidates.length ? Math.min(...candidates) : text.length;
    parts.push({ k: 'n', t: text.slice(i, stop) });
    i = stop;
  }
  return parts;
}

function RichText({ text, strikeColor = STRIKE, hiColor = YEL_HI, hiInk = INK, baseColor = INK }) {
  return (
    <React.Fragment>
      {parseMarks(text).map((p, i) => {
        if (p.k === 'strike') return (
          <s key={i} style={{
            color: strikeColor,
            textDecorationColor: strikeColor,
            textDecorationThickness: 2,
          }}>{p.t}</s>
        );
        if (p.k === 'hi') return (
          <mark key={i} style={{
            background: hiColor, color: hiInk,
            padding: '0 8px', borderRadius: 4,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}>{p.t}</mark>
        );
        return <span key={i} style={{ color: baseColor }}>{p.t}</span>;
      })}
    </React.Fragment>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────
function IPMark({ size = 36, ink = NAVY, accent = GREEN }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

function TopBand({ law, article, date, h = 110, scale = 1 }) {
  return (
    <div style={{
      height: h, background: GREEN, color: '#fff',
      padding: `0 ${56 * scale}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `${3 * scale}px solid ${GREEN_DEEP}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 * scale }}>
        <span style={{
          width: 44 * scale, height: 44 * scale, borderRadius: 12,
          background: '#fff', color: GREEN,
          display: 'grid', placeItems: 'center',
          fontFamily: T.font, fontWeight: 900,
          fontSize: 28 * scale, lineHeight: 1,
        }}>↻</span>
        <div>
          <div className="mono" style={{
            fontSize: 14 * scale, fontWeight: 700, letterSpacing: 3 * scale,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
          }}>REFORMA</div>
          <div style={{
            fontSize: 28 * scale, fontWeight: 900, letterSpacing: -0.4 * scale,
            lineHeight: 1.05,
          }}>{law} · {article}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{
          fontSize: 13 * scale, fontWeight: 700, letterSpacing: 2.4 * scale,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
        }}>ENTRADA EN VIGOR</div>
        <div style={{
          fontSize: 24 * scale, fontWeight: 800, letterSpacing: -0.2 * scale,
        }}>{date}</div>
      </div>
    </div>
  );
}

function BottomImpact({ text, h = 135, scale = 1 }) {
  return (
    <div style={{
      height: h, background: YEL, color: INK,
      padding: `0 ${56 * scale}px`,
      display: 'flex', alignItems: 'center', gap: 20 * scale,
    }}>
      <div style={{
        flexShrink: 0, width: 56 * scale, height: 56 * scale, borderRadius: 28 * scale,
        background: INK, color: YEL,
        display: 'grid', placeItems: 'center',
        fontSize: 28 * scale,
      }}>💡</div>
      <div>
        <div className="mono" style={{
          fontSize: 14 * scale, fontWeight: 800, letterSpacing: 2.8 * scale,
          textTransform: 'uppercase', color: 'rgba(19,19,26,0.6)',
          marginBottom: 4 * scale,
        }}>Què canvia per a tu</div>
        <div style={{
          fontSize: 26 * scale, fontWeight: 800, letterSpacing: -0.4 * scale,
          lineHeight: 1.16, color: INK, textWrap: 'pretty',
        }}>{text}</div>
      </div>
    </div>
  );
}

// ─── BLOC ABANS / ARA ────────────────────────────────────────────
function Block({ kind, refLabel, text, scale = 1 }) {
  const isAbans = kind === 'abans';
  const bg = isAbans ? GRAY_LIGHT : GREEN_LIGHT;
  const ico = isAbans ? '✕' : '✓';
  const icoBg = isAbans ? '#6E7585' : GREEN_DEEP;
  const tag = isAbans ? 'ABANS' : 'ARA';
  const baseColor = isAbans ? '#4B4F57' : INK;
  return (
    <div style={{
      flex: 1, position: 'relative',
      background: bg, borderRadius: 18 * scale,
      padding: `${24 * scale}px ${30 * scale}px ${24 * scale}px ${30 * scale}px`,
      display: 'flex', flexDirection: 'column', gap: 12 * scale,
      border: isAbans ? `1px solid rgba(0,0,0,0.06)` : `2px solid ${GREEN_DEEP}`,
      boxShadow: isAbans
        ? '0 2px 0 rgba(0,0,0,0.03)'
        : `0 -2px 0 rgba(6,167,125,0.18) inset, 0 8px 28px rgba(6,167,125,0.18)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 * scale }}>
        <span style={{
          width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale,
          background: icoBg, color: '#fff',
          display: 'grid', placeItems: 'center',
          fontWeight: 900, fontSize: 24 * scale, lineHeight: 1,
        }}>{ico}</span>
        <span style={{
          fontFamily: T.font, fontWeight: 900,
          fontSize: 36 * scale, letterSpacing: -0.4 * scale,
          color: isAbans ? '#5A5F69' : GREEN_DEEP,
        }}>{tag}</span>
        <span className="mono" style={{
          marginLeft: 'auto', fontSize: 13 * scale, fontWeight: 700,
          letterSpacing: 2.4 * scale, textTransform: 'uppercase',
          color: isAbans ? 'rgba(19,19,26,0.45)' : 'rgba(5,91,69,0.7)',
        }}>{refLabel}</span>
      </div>

      <div style={{
        fontSize: 24 * scale, fontWeight: 500,
        lineHeight: 1.36, letterSpacing: -0.2 * scale,
        color: baseColor, textWrap: 'pretty',
        fontStyle: 'normal',
      }}>
        <span style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 32 * scale, lineHeight: 0.6,
          color: isAbans ? 'rgba(0,0,0,0.18)' : 'rgba(5,91,69,0.32)',
          marginRight: 6 * scale, verticalAlign: '-0.2em',
        }}>“</span>
        <RichText text={text} baseColor={baseColor} />
        <span style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 32 * scale, lineHeight: 0.6,
          color: isAbans ? 'rgba(0,0,0,0.18)' : 'rgba(5,91,69,0.32)',
          marginLeft: 6 * scale, verticalAlign: '-0.2em',
        }}>”</span>
      </div>
    </div>
  );
}

// ─── ARROW SEPARATOR ─────────────────────────────────────────────
function ArrowDivider({ scale = 1 }) {
  return (
    <div style={{
      position: 'relative', height: 24 * scale,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: `${6 * scale}px 0`,
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%',
        height: 2, background: 'rgba(14,26,54,0.08)',
      }} />
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'inline-flex', alignItems: 'center', gap: 8 * scale,
        padding: `${6 * scale}px ${14 * scale}px`,
        background: '#fff', color: GREEN_DEEP,
        borderRadius: 999, border: `2px solid ${GREEN}`,
        fontWeight: 900, fontSize: 16 * scale, letterSpacing: 1.4 * scale,
        textTransform: 'uppercase',
      }}>
        <span style={{ fontSize: 18 * scale }}>↓</span> CANVIA A
      </div>
    </div>
  );
}

// ─── SINGLE POST 1080×1080 ───────────────────────────────────────
function SinglePost({ reform }) {
  const W = 1080, H = 1080;
  const hdr = 110, ftr = 135;
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: '#fff', color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <TopBand law={reform.law} article={reform.article} date={reform.date} h={hdr} />

      <div style={{
        position: 'absolute', left: 0, right: 0, top: hdr, bottom: ftr,
        padding: '36px 56px 28px',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        <Block kind="abans" refLabel={reform.abans.ref} text={reform.abans.text} />
        <ArrowDivider />
        <Block kind="ara" refLabel={reform.ara.ref} text={reform.ara.text} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <BottomImpact text={reform.impact} h={ftr} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARRUSEL · 5 SLIDES
// ═══════════════════════════════════════════════════════════════

// Slide 1 · Portada amb countdown
function RPortada({ reform }) {
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: GREEN_DEEP, color: '#fff', fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* Pattern decoratiu */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.08 }}
           viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="ref-dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.6" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#ref-dots)" />
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '80px 72px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '8px 16px', borderRadius: 999,
            background: '#fff', color: GREEN_DEEP,
            fontSize: 16, fontWeight: 800, letterSpacing: 3,
            textTransform: 'uppercase',
          }}>↻ REFORMA · 1/5</div>
          <IPMark size={48} ink="#fff" accent={YEL} />
        </div>

        <div>
          <div className="mono" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
            marginBottom: 10,
          }}>{reform.law} · {reform.article}</div>
          <div style={{
            fontSize: 124, fontWeight: 900, lineHeight: 0.92,
            letterSpacing: -3, color: '#fff', textWrap: 'pretty',
          }}>{reform.title}</div>
          <div style={{
            marginTop: 18,
            fontSize: 32, fontWeight: 600, lineHeight: 1.2,
            color: 'rgba(255,255,255,0.85)', maxWidth: 880,
            letterSpacing: -0.2, textWrap: 'pretty',
          }}>{reform.bigChange}</div>
        </div>

        {/* Caixa entrada en vigor */}
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: 18,
          padding: 24, background: 'rgba(0,0,0,0.22)',
          border: '1px solid rgba(255,255,255,0.16)', borderRadius: 18,
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: 16,
            background: YEL, color: INK,
            display: 'grid', placeItems: 'center',
            fontSize: 56, fontWeight: 900, letterSpacing: -2,
          }}>!</div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="mono" style={{
              fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
            }}>Entrada en vigor</div>
            <div style={{
              fontSize: 44, fontWeight: 900, letterSpacing: -1,
              color: '#fff', lineHeight: 1.06,
            }}>{reform.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 2 · Abans / Després (= single post sense banda inferior)
function RAbansDespres({ reform }) {
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: '#fff', color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <TopBand law={reform.law} article={reform.article} date={reform.date} h={110} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 110, bottom: 0,
        padding: '36px 56px 36px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <Block kind="abans" refLabel={reform.abans.ref} text={reform.abans.text} />
        <ArrowDivider />
        <Block kind="ara" refLabel={reform.ara.ref} text={reform.ara.text} />
        <div className="mono" style={{
          marginTop: 12, alignSelf: 'center',
          fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(14,26,54,0.45)',
        }}>2 / 5 · COMPARATIVA TEXTUAL</div>
      </div>
    </div>
  );
}

// Slide 3 · Altres canvis menors
function RMinor({ reform }) {
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: '#F4F8F6', color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <TopBand law={reform.law} article={reform.article} date={reform.date} h={110} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 110, bottom: 0,
        padding: '48px 64px',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 12px', borderRadius: 999,
            background: GREEN, color: '#fff',
            fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase', marginBottom: 12,
          }}>+ Altres canvis · 3/5</div>
          <div style={{
            fontSize: 56, fontWeight: 900, letterSpacing: -1.4,
            lineHeight: 1.04, color: NAVY, textWrap: 'pretty',
          }}>Detalls menors que s\u2019incorporen amb la reforma.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reform.minor.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 22,
              padding: '24px 28px', borderRadius: 16,
              background: '#fff', border: '1px solid rgba(14,26,54,0.06)',
              boxShadow: '0 2px 0 rgba(14,26,54,0.04), 0 8px 18px rgba(14,26,54,0.05)',
            }}>
              <span style={{
                flexShrink: 0, width: 48, height: 48, borderRadius: 24,
                background: GREEN_LIGHT, color: GREEN_DEEP,
                display: 'grid', placeItems: 'center',
                fontWeight: 900, fontSize: 22,
              }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{
                fontSize: 28, fontWeight: 600, lineHeight: 1.32,
                color: NAVY, letterSpacing: -0.2, textWrap: 'pretty',
              }}>{m}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
          <IPMark size={36} ink={NAVY} accent={GREEN} />
        </div>
      </div>
    </div>
  );
}

// Slide 4 · Impacte policia activa
// Slide 5 · Impacte opositor
function RImpact({ reform, who }) {
  const isActive = who === 'active';
  const idx = isActive ? 4 : 5;
  const tag = isActive ? '🛡️ POLICIA ACTIVA' : '🎓 OPOSITOR';
  const heading = isActive ? 'Què canvia al teu torn' : 'Què canvia al teu temari';
  const text = isActive ? reform.forActive : reform.forOposant;
  const bg = isActive ? NAVY : '#fff';
  const fg = isActive ? '#fff' : NAVY;
  const dim = isActive ? 'rgba(255,255,255,0.65)' : 'rgba(14,26,54,0.6)';
  const chipBg = isActive ? YEL : GREEN;
  const chipFg = isActive ? INK : '#fff';
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: bg, color: fg, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <TopBand law={reform.law} article={reform.article} date={reform.date} h={110} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 110, bottom: 0,
        padding: '56px 72px',
        display: 'flex', flexDirection: 'column', gap: 32,
      }}>
        <div className="mono" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '8px 16px', borderRadius: 999,
          background: chipBg, color: chipFg,
          fontSize: 16, fontWeight: 800, letterSpacing: 2.8,
          textTransform: 'uppercase', alignSelf: 'flex-start',
        }}>{tag} · {idx}/5</div>

        <div style={{
          fontSize: 88, fontWeight: 900, lineHeight: 0.98,
          letterSpacing: -2.2, color: fg, textWrap: 'pretty',
        }}>{heading}</div>

        <div style={{
          fontSize: 36, fontWeight: 600, lineHeight: 1.28,
          letterSpacing: -0.4, color: fg, textWrap: 'pretty',
          maxWidth: 920,
        }}>{text}</div>

        {/* Cita destacada · resum + flux */}
        <div style={{
          marginTop: 'auto',
          padding: '28px 32px', borderRadius: 18,
          background: isActive ? 'rgba(255,255,255,0.06)' : '#F4F8F6',
          border: `1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'rgba(14,26,54,0.08)'}`,
        }}>
          <div className="mono" style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase', color: dim, marginBottom: 8,
          }}>{isActive ? 'Aplica-ho ja' : 'Repassa-ho al temari'}</div>
          <div style={{
            fontSize: 26, fontWeight: 700, letterSpacing: -0.2,
            lineHeight: 1.28, color: fg, textWrap: 'pretty',
          }}>{reform.impact}</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 18,
          borderTop: `1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'rgba(14,26,54,0.08)'}`,
        }}>
          <span className="mono" style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase', color: dim,
          }}>@infopol · acadèmia</span>
          <IPMark size={36} ink={fg} accent={isActive ? YEL : GREEN} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORY 1080×1920 · countdown + enquesta
// ═══════════════════════════════════════════════════════════════
function StoryReform({ reform }) {
  const W = 1080, H = 1920;
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: GREEN_DEEP, color: '#fff', fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* Gradient + dot pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(140% 60% at 50% 0%, ${GREEN} 0%, ${GREEN_DEEP} 60%, #033425 100%)`,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        padding: '120px 80px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '12px 22px', borderRadius: 999,
            background: '#fff', color: GREEN_DEEP,
            fontSize: 22, fontWeight: 800, letterSpacing: 4,
            textTransform: 'uppercase',
          }}>↻ STORY · REFORMA</div>
          <IPMark size={60} ink="#fff" accent={YEL} />
        </div>

        {/* Countdown */}
        <div style={{ marginTop: 80 }}>
          <div className="mono" style={{
            fontSize: 22, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
            marginBottom: 28,
          }}>Compte enrere · entrada en vigor</div>
          <div style={{
            display: 'flex', gap: 18, marginBottom: 36,
          }}>
            {[
              { n: '12', l: 'DIES' },
              { n: '04', l: 'HORES' },
              { n: '37', l: 'MIN' },
              { n: '08', l: 'SEG' },
            ].map((b, i) => (
              <div key={i} style={{
                flex: 1, padding: '28px 0', textAlign: 'center',
                background: 'rgba(0,0,0,0.25)', borderRadius: 22,
                border: '1px solid rgba(255,255,255,0.14)',
              }}>
                <div style={{
                  fontSize: 110, fontWeight: 900, lineHeight: 1,
                  letterSpacing: -3, color: '#fff',
                }}>{b.n}</div>
                <div className="mono" style={{
                  marginTop: 8, fontSize: 16, fontWeight: 700,
                  letterSpacing: 3, color: 'rgba(255,255,255,0.7)',
                }}>{b.l}</div>
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 38, fontWeight: 800, letterSpacing: -0.6,
            lineHeight: 1.14, color: '#fff', textWrap: 'pretty',
          }}>{reform.law} · {reform.article} —<br/>{reform.title}</div>
          <div style={{
            marginTop: 12, fontSize: 24, fontWeight: 600,
            color: 'rgba(255,255,255,0.78)', lineHeight: 1.3,
          }}>{reform.date}</div>
        </div>

        {/* Enquesta · "Sabies que canviava?" */}
        <div style={{ marginTop: 'auto' }}>
          <div className="mono" style={{
            fontSize: 22, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
            marginBottom: 18,
          }}>Enquesta</div>
          <div style={{
            fontSize: 56, fontWeight: 900, letterSpacing: -1.4,
            lineHeight: 1.06, color: '#fff', marginBottom: 24,
            textWrap: 'pretty',
          }}>Sabies que canviava?</div>

          {[
            { label: 'Sí, ho tinc clar', pct: 38 },
            { label: 'En tinc una idea', pct: 41 },
            { label: 'No, primera notícia', pct: 21 },
          ].map((opt, i) => (
            <div key={i} style={{
              position: 'relative', marginBottom: 14,
              padding: '20px 24px', borderRadius: 18,
              background: 'rgba(255,255,255,0.94)', color: INK,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${opt.pct}%`,
                background: i === 1 ? YEL : 'rgba(6,167,125,0.22)',
              }} />
              <div style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>{opt.label}</span>
                <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{opt.pct}%</span>
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 20, textAlign: 'center',
            fontSize: 20, fontWeight: 700, letterSpacing: 1,
            color: 'rgba(255,255,255,0.78)',
          }}>↑ desliça per veure la reforma sencera</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FITXA SISTEMA / BANC
// ═══════════════════════════════════════════════════════════════
function SystemCard() {
  const triggers = [
    'Reformes del Codi Penal',
    'Canvis a la Llei de Seguretat Ciutadana',
    'Modificacions del Reglament de Circulació',
    'Noves instruccions DGP / DGT',
    'Sentències del TC que canviïn la interpretació',
  ];
  return (
    <DCArtboard id="sys" label="Sistema · regles + quan publicar"
                width={820} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 44, fontFamily: T.font, color: NAVY,
      }}>
        <div className="mono" style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>🔁 Reforma · Abans / Després</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Format ORO · alta caducitat, alt nombre de comparticions
        </div>
        <div style={{ fontSize: 14, color: 'rgba(14,26,54,0.65)', marginTop: 6, lineHeight: 1.45 }}>
          Publicar quan hi hagi reforma — no forçar. Single 1080×1080 + story
          complementària. Carrusel ampliat si la reforma és gran.
        </div>

        {/* Mini-preview de marques */}
        <div className="mono" style={{
          marginTop: 22, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase',
          color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>Sintaxi de marques</div>
        <div style={{
          padding: 16, borderRadius: 12, background: '#F4F8F6',
          fontSize: 14, color: NAVY, lineHeight: 1.5, fontFamily: T.fontMono,
        }}>
          <div>~~text~~ → <s style={{ color: STRIKE }}>text antic</s></div>
          <div>==text== → <mark style={{ background: YEL_HI, padding: '0 6px', borderRadius: 4 }}>paraula nova</mark></div>
        </div>

        {/* Regles tipogràfiques */}
        <div className="mono" style={{
          marginTop: 22, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase',
          color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>Regles visuals</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: NAVY,
                     lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Banda superior verd #06A77D · llei + data SEMPRE visibles.</li>
          <li>Text antic en gris #777 amb strikethrough.</li>
          <li>Text nou sobre fons verd #C8E6C9.</li>
          <li>Paraules canviades / afegides en highlight #FFE066.</li>
          <li>Data d\u2019entrada en vigor destacada (caixa groga al portada).</li>
        </ul>

        {/* Quan fer servir */}
        <div className="mono" style={{
          marginTop: 22, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase',
          color: 'rgba(14,26,54,0.55)', marginBottom: 8,
        }}>Quan publicar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {triggers.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10, background: GREEN_LIGHT,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 4, background: GREEN_DEEP,
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </DCArtboard>
  );
}

// ─── TWEAKS ───────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "show_carousel": true,
  "show_story": true,
  "show_system": true
}/*EDITMODE-END*/;

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Contingut">
        <TweakRadio
          label="Carrusel ampliat (5 slides)"
          value={t.show_carousel ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_carousel', v === 'yes')}
        />
        <TweakRadio
          label="Story complementària (1080×1920)"
          value={t.show_story ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_story', v === 'yes')}
        />
        <TweakRadio
          label="Sistema + regles"
          value={t.show_system ? 'yes' : 'no'}
          options={[{ value: 'yes', label: 'Sí' }, { value: 'no', label: 'No' }]}
          onChange={(v) => setTweak('show_system', v === 'yes')}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  // Carrusel ampliat només per a la primera reforma de l'exemple
  const fullReform = REFORMS[0];
  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="singles" title="Single posts · 1080×1080"
                   subtitle="3 reformes d'exemple — banda verda · abans / ara · impacte groc.">
          {REFORMS.map((r) => (
            <DCArtboard key={r.id} id={`s-${r.id}`}
                        label={`${r.law} · ${r.article}`}
                        width={1080} height={1080}>
              <SinglePost reform={r} />
            </DCArtboard>
          ))}
        </DCSection>

        {t.show_carousel && (
          <DCSection
            id="carousel"
            title={`Carrusel ampliat · ${fullReform.law} ${fullReform.article}`}
            subtitle="Per a reformes grans · portada + abans/després + altres canvis + 2 impactes."
          >
            <DCArtboard id="c1" label="1 · Portada + countdown" width={1080} height={1080}>
              <RPortada reform={fullReform} />
            </DCArtboard>
            <DCArtboard id="c2" label="2 · Abans / Després" width={1080} height={1080}>
              <RAbansDespres reform={fullReform} />
            </DCArtboard>
            <DCArtboard id="c3" label="3 · Altres canvis" width={1080} height={1080}>
              <RMinor reform={fullReform} />
            </DCArtboard>
            <DCArtboard id="c4" label="4 · Impacte · policia activa" width={1080} height={1080}>
              <RImpact reform={fullReform} who="active" />
            </DCArtboard>
            <DCArtboard id="c5" label="5 · Impacte · opositor" width={1080} height={1080}>
              <RImpact reform={fullReform} who="opo" />
            </DCArtboard>
          </DCSection>
        )}

        {t.show_story && (
          <DCSection id="story"
                     title="Story complementària · 1080×1920"
                     subtitle="Countdown a l'entrada en vigor + enquesta «Sabies que canviava?».">
            <DCArtboard id="story" label="Story · countdown + enquesta"
                        width={1080} height={1920}>
              <StoryReform reform={fullReform} />
            </DCArtboard>
          </DCSection>
        )}

        {t.show_system && (
          <DCSection id="sys" title="Sistema · regles + quan publicar"
                     subtitle="Marques, regles tipogràfiques i triggers per a la publicació.">
            <SystemCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
