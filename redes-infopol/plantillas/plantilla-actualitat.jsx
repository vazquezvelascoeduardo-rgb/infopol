// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Actualitat policial
// Format dual: Feed 1080×1080 + Reel vertical 1080×1920.
// Sistema "breaking news" editorial — gens sensacionalista.
//
// Estructura comuna:
//   [1] Banda superior · color de tipus + icona + "ACTUALITAT" + data
//   [2] Foto del succés (image-slot) amb overlay blau marí 30%
//       + chip de localització a dalt-esquerra
//   [3] Panell inferior blau marí: headline + bullets de context
//   [4] Peu: Font + iP logo
//
// Variants (codi de color a la banda superior):
//   urgent       — vermell #D62828 + ⚠
//   informativa  — blau operativa + icona diari
//   judicial     — morat trànsit + balança
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;

const INK   = T.ink;
const PAPER = T.bg;
const NAVY  = '#0E1A36';     // panell inferior — més profund que ink
const NAVY2 = '#172648';     // separadors interns
const URGENT_RED = '#D62828';

// ─── Paletes per variant ─────────────────────────────────────────
const KINDS = {
  urgent: {
    label: 'Urgent',
    band:  URGENT_RED,
    bandText: '#fff',
    chip: 'Última hora',
    icon: 'warn',
    dot: true,        // punt vermell pulsant
  },
  info: {
    label: 'Informativa',
    band:  T.cat.operativa.solid,   // #3B6BF5
    bandText: '#fff',
    chip: 'Notícia',
    icon: 'news',
    dot: false,
  },
  judicial: {
    label: 'Judicial',
    band:  T.cat.transito.solid,    // #9C4FE0
    bandText: '#fff',
    chip: 'Sentència',
    icon: 'scale',
    dot: false,
  },
};

// ─── Icones específiques (algunes no estan al set base) ──────────
function VarIcon({ name, size = 36, color = '#fff', sw = 2.2 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'warn':
      return (
        <svg {...c}>
          <path d="M12 3 L22 20 H2 Z" />
          <path d="M12 10v5" />
          <circle cx="12" cy="18" r="0.6" fill={color} stroke="none" />
        </svg>
      );
    case 'news':
      return (
        <svg {...c}>
          <rect x="3" y="5" width="14" height="14" rx="1.5" />
          <path d="M17 9h3v8a2 2 0 0 1-2 2H5" />
          <path d="M6 9h8M6 13h8M6 17h5" />
        </svg>
      );
    case 'scale':
      return (
        <svg {...c}>
          <path d="M12 3v17M4 7h16" />
          <path d="M7 7l-3 7a3 3 0 0 0 6 0L7 7zM17 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
        </svg>
      );
    default:
      return <Icon name="bell" size={size} color={color} />;
  }
}

// ─── DADES — 3 notícies d'exemple ────────────────────────────────
const NEWS = [
  {
    id: 'raval-operatiu',
    kind: 'urgent',
    date: 'DJ · 15 MAIG 2026 · 14:32',
    location: 'BARCELONA · CIUTAT VELLA',
    headline:
      'Operatiu antidroga al Raval: 7 detinguts i 12 kg intervinguts.',
    bullets: [
      'Tres pisos venda al detall desmantellats al carrer Hospital.',
      'Hi participen Mossos i Guàrdia Urbana en col·laboració.',
      'Els detinguts passen avui a disposició judicial.',
    ],
    source: 'ACN · Mossos d\u2019Esquadra',
    photoNote: 'Foto · agents al cordó policial (sense persones identificables)',
  },
  {
    id: 'patrullatge-sabadell',
    kind: 'info',
    date: 'DC · 14 MAIG 2026 · 09:00',
    location: 'VALLÈS OCCIDENTAL · SABADELL',
    headline:
      'Sabadell estrena patrullatge de proximitat als barris del nord.',
    bullets: [
      '40 agents nous distribuïts en 6 sectors de barri.',
      'Pla pilot de 6 mesos amb cita prèvia ciutadana.',
      'Reforç a horari escolar i mercats setmanals.',
    ],
    source: 'Ajuntament de Sabadell',
    photoNote: 'Foto · agent local de barri en context de carrer',
  },
  {
    id: 'tsjc-sentencia',
    kind: 'judicial',
    date: 'DM · 13 MAIG 2026',
    location: 'TRIBUNAL SUPERIOR DE JUSTÍCIA DE CATALUNYA',
    headline:
      'El TSJC ratifica la sanció a un agent per excés en una intervenció.',
    bullets: [
      'Confirma la falta greu imposada en via disciplinària interna.',
      'No hi ha pena penal — sanció administrativa de 4 mesos.',
      'La sentència fixa criteris d\u2019ús proporcional de la força.',
    ],
    source: 'TSJC · Sala Contenciosa',
    photoNote: 'Foto · façana o sala de vistes — sense parts identificables',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
function IPMark({ size = 56, ink = INK, accent }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

// ─── BANDA SUPERIOR ───────────────────────────────────────────────
function TopBand({ kind, date, h = 96, scale = 1 }) {
  const K = KINDS[kind];
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: h,
      background: K.band, color: K.bandText,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${36 * scale}px`,
      zIndex: 5,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    }}>
      {/* Esquerra · icona + ACTUALITAT + variant */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 * scale }}>
        <VarIcon name={K.icon} size={40 * scale} sw={2.4} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 * scale }}>
          <span style={{
            fontFamily: T.font, fontWeight: 900,
            fontSize: 30 * scale, letterSpacing: 4 * scale,
            textTransform: 'uppercase', lineHeight: 1,
          }}>Actualitat</span>
          <span className="mono" style={{
            fontWeight: 600, fontSize: 16 * scale, letterSpacing: 2.4 * scale,
            textTransform: 'uppercase', opacity: 0.78,
          }}>· {K.label}</span>
        </div>
      </div>
      {/* Dreta · punt + data */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 * scale }}>
        {K.dot && (
          <span style={{
            width: 14 * scale, height: 14 * scale, borderRadius: '50%',
            background: '#fff',
            boxShadow: `0 0 0 ${4*scale}px rgba(255,255,255,0.28)`,
            animation: 'ip-pulse 1.4s ease-in-out infinite',
          }} />
        )}
        <span className="mono" style={{
          fontWeight: 600, fontSize: 18 * scale, letterSpacing: 2.2 * scale,
          textTransform: 'uppercase',
        }}>{date}</span>
      </div>
    </div>
  );
}

// ─── PEU · panell inferior ────────────────────────────────────────
function BottomPanel({ news, height, scale = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height, background: NAVY, color: '#fff',
      padding: `${48 * scale}px ${64 * scale}px ${40 * scale}px`,
      display: 'flex', flexDirection: 'column',
      borderTop: `${3 * scale}px solid ${KINDS[news.kind].band}`,
    }}>
      {/* Eyebrow */}
      <div className="mono" style={{
        fontSize: 18 * scale, fontWeight: 700, letterSpacing: 3.4 * scale,
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
        marginBottom: 18 * scale,
        display: 'flex', alignItems: 'center', gap: 14 * scale,
      }}>
        <span style={{
          width: 12 * scale, height: 12 * scale,
          background: KINDS[news.kind].band, display: 'inline-block',
        }} />
        {KINDS[news.kind].chip}
      </div>

      {/* Headline */}
      <div style={{
        fontFamily: T.font, fontWeight: 800,
        fontSize: 60 * scale, lineHeight: 1.04,
        letterSpacing: -1.6 * scale, color: '#fff',
        textWrap: 'pretty',
      }}>{news.headline}</div>

      {/* Bullets */}
      <div style={{
        marginTop: 32 * scale,
        display: 'flex', flexDirection: 'column', gap: 16 * scale,
      }}>
        {news.bullets.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 18 * scale,
          }}>
            <span style={{
              width: 14 * scale, height: 14 * scale, marginTop: 14 * scale,
              background: KINDS[news.kind].band, flexShrink: 0,
            }} />
            <div style={{
              fontSize: 26 * scale, fontWeight: 500, lineHeight: 1.32,
              color: 'rgba(255,255,255,0.88)', letterSpacing: -0.2 * scale,
              textWrap: 'pretty',
            }}>{b}</div>
          </div>
        ))}
      </div>

      {/* Peu · font + logo */}
      <div style={{
        marginTop: 'auto', paddingTop: 24 * scale,
        borderTop: `1px solid rgba(255,255,255,0.14)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div className="mono" style={{
          fontSize: 16 * scale, fontWeight: 600, letterSpacing: 2.4 * scale,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)',
        }}>FONT · {news.source}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 * scale }}>
          <IPMark size={36 * scale} ink="#fff" accent={KINDS[news.kind].band} />
          <span className="mono" style={{
            fontSize: 16 * scale, fontWeight: 700, letterSpacing: 2.2 * scale,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)',
          }}>@infopol</span>
        </div>
      </div>
    </div>
  );
}

// ─── ÀREA D'IMATGE amb overlay ────────────────────────────────────
function PhotoArea({ news, top, height, slotId, scale = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top, height,
      overflow: 'hidden', background: '#1f2937',
    }}>
      {/* image-slot wrapper */}
      <image-slot
        id={slotId}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        shape="rect"
        fit="cover"
        placeholder={news.photoNote}
      />

      {/* Overlay blau translúcid · només quan hi ha foto */}
      <div data-news-overlay style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg,
                       rgba(14, 26, 54, 0.45) 0%,
                       rgba(14, 26, 54, 0.20) 30%,
                       rgba(14, 26, 54, 0.65) 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Chip de localització · dalt esquerra */}
      <div style={{
        position: 'absolute', top: 36 * scale, left: 36 * scale,
        display: 'inline-flex', alignItems: 'center', gap: 12 * scale,
        padding: `${10 * scale}px ${18 * scale}px`,
        background: 'rgba(14, 26, 54, 0.72)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        borderRadius: 999, color: '#fff',
        border: '1px solid rgba(255,255,255,0.18)',
        zIndex: 4, pointerEvents: 'none',
      }}>
        <svg width={18 * scale} height={18 * scale} viewBox="0 0 24 24" fill="none"
             stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span className="mono" style={{
          fontSize: 16 * scale, fontWeight: 700,
          letterSpacing: 2.4 * scale, textTransform: 'uppercase',
        }}>{news.location}</span>
      </div>

      {/* Disclaimer petit · base de la foto */}
      <div style={{
        position: 'absolute', left: 36 * scale, right: 36 * scale,
        bottom: 24 * scale,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 14 * scale,
        zIndex: 4, pointerEvents: 'none',
      }}>
        <span className="mono" style={{
          fontSize: 12 * scale, fontWeight: 500,
          letterSpacing: 1.4 * scale, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.72)',
        }}>📷 sense persones identificables</span>
      </div>
    </div>
  );
}

// ─── SLIDE · FEED 1080×1080 ───────────────────────────────────────
function FeedSlide({ news }) {
  const W = 1080, H = 1080;
  const bandH = 88;
  const photoH = Math.round(H * 0.60);   // 648
  const bottomH = H - photoH;            // 432
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: NAVY, overflow: 'hidden', fontFamily: T.font }}>
      <PhotoArea news={news} top={0} height={photoH} slotId={`${news.id}-feed`} scale={1} />
      <TopBand kind={news.kind} date={news.date} h={bandH} scale={1} />
      <BottomPanel news={news} height={bottomH} scale={1} />
    </div>
  );
}

// ─── SLIDE · REEL 1080×1920 ───────────────────────────────────────
function ReelSlide({ news }) {
  const W = 1080, H = 1920;
  const bandH = 120;
  const photoH = Math.round(H * 0.60);   // 1152
  const bottomH = H - photoH;            // 768
  // El reel pinta tot més gran — escala 1.4
  const s = 1.4;
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: NAVY, overflow: 'hidden', fontFamily: T.font }}>
      <PhotoArea news={news} top={0} height={photoH} slotId={`${news.id}-reel`} scale={s} />
      <TopBand kind={news.kind} date={news.date} h={bandH} scale={s} />
      <BottomPanel news={news} height={bottomH} scale={s} />
    </div>
  );
}

// ─── ROW ──────────────────────────────────────────────────────────
function NewsRow({ news }) {
  const K = KINDS[news.kind];
  return (
    <DCSection
      id={news.id}
      title={`${K.label.toUpperCase()} · ${news.headline.replace(/[.:].*/, '')}`}
      subtitle={`Banda ${K.band} · ${news.location.toLowerCase()}`}
    >
      <DCArtboard id={`${news.id}-feed`} label="Feed · 1080×1080"
                  width={1080} height={1080}>
        <FeedSlide news={news} />
      </DCArtboard>
      <DCArtboard id={`${news.id}-reel`} label="Reel · 1080×1920"
                  width={1080} height={1920}>
        <ReelSlide news={news} />
      </DCArtboard>
    </DCSection>
  );
}

// ─── FITXA DE SISTEMA ────────────────────────────────────────────
function SystemCard() {
  return (
    <DCArtboard id="system" label="Sistema · variants i regles"
                width={760} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 48, fontFamily: T.font, color: INK,
      }}>
        <div className="mono" style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
        }}>Plantilla · Actualitat policial</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Variants per tipus
        </div>
        <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
          La banda superior canvia de color i icona segons la natura de la notícia.
        </div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(KINDS).map(([k, K]) => (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 12, background: '#FAF8F3',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 10,
                background: K.band, display: 'grid', placeItems: 'center',
              }}>
                <VarIcon name={K.icon} size={28} sw={2.2} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{K.label}</div>
                <div className="mono" style={{
                  fontSize: 11, color: T.inkMuted, letterSpacing: 1.4,
                  textTransform: 'uppercase', marginTop: 2,
                }}>{K.chip}</div>
              </div>
              <div className="mono" style={{
                fontSize: 12, color: T.inkSoft, fontWeight: 600,
              }}>{K.band}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 28,
          padding: 16, borderRadius: 12,
          background: '#FFF6E5', border: '1px solid #F0D89A',
        }}>
          <div className="mono" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.8,
            textTransform: 'uppercase', color: '#8A5A0B', marginBottom: 6,
          }}>Regla editorial</div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: '#5C3F08' }}>
            No fer servir imatges sensacionalistes ni víctimes identificables.
            Si dubtes, opta per fotografia institucional o façana.
          </div>
        </div>

        <div className="mono" style={{
          marginTop: 24, fontSize: 12, fontWeight: 700,
          letterSpacing: 2.4, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 10,
        }}>Especs · 1080×1080</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: T.inkSoft }}>
          <Spec k="banda" v="88 px · color variant" />
          <Spec k="foto" v="648 px (60%) · overlay navy" />
          <Spec k="panell" v="432 px · navy #0E1A36" />
          <Spec k="headline" v="Manrope 800 · 60 px" />
          <Spec k="bullets" v="Manrope 500 · 26 px" />
          <Spec k="reel" v="Mateixa estructura · escala 1.4×" />
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

// ─── TWEAKS ──────────────────────────────────────────────────────
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

// ─── ANIMACIÓ punt pulsant ────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('ip-pulse-css')) {
  const s = document.createElement('style');
  s.id = 'ip-pulse-css';
  s.textContent = `
    @keyframes ip-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.55; transform: scale(0.85); }
    }
    /* Amaga l'overlay quan la foto encara no s'ha deixat caure,
       perquè la dropzone (anell discontinu) sigui visible. */
    image-slot:not([data-filled]) + [data-news-overlay] { display: none; }
  `;
  document.head.appendChild(s);
}

// ─── APP ──────────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  return (
    <React.Fragment>
      <DesignCanvas>
        {NEWS.map((n) => <NewsRow key={n.id} news={n} />)}
        {t.show_system && (
          <DCSection id="sys" title="Sistema" subtitle="Variants, regla editorial i especs.">
            <SystemCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
