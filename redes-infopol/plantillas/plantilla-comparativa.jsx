// ──────────────────────────────────────────────────────────────────
// InfoPol · Plantilla — Comparativa A vs B
// Format 1080×1080 (split A|B) + carrusel ampliat opcional (5 slides).
// Regles tipogràfiques: TERMES A i B en majúscules amb Bebas Neue.
// Mateix nombre de línies a cada columna (simetria = pro).
// Iconografia aparellada: mateix estil i pes visual a banda i banda.
// ──────────────────────────────────────────────────────────────────

const T = window.TOKENS;
const { DesignCanvas, DCSection, DCArtboard, Icon } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;

const INK   = T.ink;
const PAPER = T.bg;
const NAVY  = '#0E1A36';            // header navy
const NAVY_DEEP = '#0A1226';        // bg dark for cover/recorda
const A_BG  = T.cat.operativa.solid; // blau mig — #3B6BF5
const B_BG  = '#1A2A52';            // blau fosc
const YEL   = T.cat.psico.solid;    // #F0B400 — diferència clau
const YEL_LIGHT = '#FFE172';

// ─── DADES ────────────────────────────────────────────────────────
// IMPORTANT — escriviu definicions/quan/art que ocupin el MATEIX
// número de línies a banda A i banda B. Aquí 2 línies cada definició,
// 1 línia "quan", 1 línia article.
const COMPS = [
  {
    id: 'detencio-retencio',
    question: 'CONFONS DETENCIÓ AMB RETENCIÓ?',
    cover: '¿Saps quan acaba una retenció i comença una detenció?',
    a: {
      term: 'DETENCIÓ',
      icon: 'lock',
      def: 'Privació formal de llibertat amb trasllat a dependències.',
      when: 'Hi ha indicis racionals de delicte o ordre judicial.',
      art: 'LECrim · art. 489 i seg.',
      detail:
        'És la mesura cautelar més restrictiva: l\u2019agent assumeix la custòdia de la persona, l\u2019informa dels seus drets i la porta a comissaria. Es notifica al jutge en un termini màxim de 72 hores.',
    },
    b: {
      term: 'RETENCIÓ',
      icon: 'clock',
      def: 'Aturada breu per identificar o fer comprovacions in situ.',
      when: 'Cal verificar identitat o si la fuita pot frustrar la diligència.',
      art: 'LO 4/2015 · art. 16',
      detail:
        'Limita la llibertat ambulatòria només el temps imprescindible. La persona no és detinguda ni passa a custòdia: ha de poder marxar tan bon punt s\u2019acaba la comprovació.',
    },
    key: 'La retenció no és privació de llibertat formal — la detenció sí.',
    example:
      'Identificar algú a un control: retenció. Si apareix una ordre de cerca activa: passa a detenció.',
  },
  {
    id: 'identificacio-cacheig',
    question: 'CONFONS IDENTIFICACIÓ AMB CACHEIG?',
    cover: '¿Pots cachear sense haver identificat abans?',
    a: {
      term: 'IDENTIFICACIÓ',
      icon: 'badge',
      def: 'Sol·licitud de dades personals i document acreditatiu.',
      when: 'Sospita raonable o prevenció de delicte o infracció.',
      art: 'LO 4/2015 · art. 16',
      detail:
        'És la diligència més bàsica: comprovar qui és la persona davant teu. Sempre informem del motiu i ho fem amb proporcionalitat. No habilita per si mateixa cap escorcoll ni intervenció corporal.',
    },
    b: {
      term: 'CACHEIG',
      icon: 'search',
      def: 'Escorcoll superficial de la roba i objectes personals.',
      when: 'Indici que la persona porta armes o objectes perillosos.',
      art: 'LO 4/2015 · art. 20',
      detail:
        'Intervé sobre el cos: requereix indicis específics i proporcionalitat. S\u2019ha de fer del mateix sexe quan sigui possible i deixant constància del motiu a l\u2019informe.',
    },
    key: 'Identificar és preguntar; cachear és intervenir sobre el cos.',
    example:
      'Demanar el DNI a un transeünt: identificació. Palpar butxaques per buscar una navalla denunciada: cacheig.',
  },
  {
    id: 'atestat-denuncia',
    question: 'CONFONS ATESTAT AMB DENÚNCIA?',
    cover: '¿Cada incidència acaba en atestat?',
    a: {
      term: 'ATESTAT',
      icon: 'book',
      def: 'Document policial complet d\u2019una actuació amb diligències.',
      when: 'Hi ha indicis de delicte o cal traslladar el cas al jutge.',
      art: 'LECrim · art. 292',
      detail:
        'Inclou totes les diligències practicades: declaracions, recollida d\u2019efectes, identificació de testimonis. Té valor de prova testifical si l\u2019agent compareix al judici.',
    },
    b: {
      term: 'DENÚNCIA',
      icon: 'pen',
      def: 'Comunicació formal d\u2019uns fets per part d\u2019un particular.',
      when: 'El ciutadà vol fer constar un fet sense diligències pròpies.',
      art: 'LECrim · art. 259',
      detail:
        'És el punt d\u2019inici: la persona narra el que ha passat i la policia ho recull. Pot derivar en atestat si els fets requereixen investigació o tenen rellevància penal.',
    },
    key: 'Tota denúncia pot generar atestat, però no a l\u2019inrevés.',
    example:
      'Un veí ve a comissaria a denunciar un robatori: denúncia. Si els agents intervenen al lloc i recullen proves: atestat.',
  },
];

// ─── Helpers de marca ────────────────────────────────────────────
function IPMark({ size = 56, ink = INK, accent }) {
  return (
    <span style={{
      fontFamily: T.font, fontWeight: 900,
      fontSize: size, lineHeight: 1,
      letterSpacing: -size * 0.03, color: ink,
    }}>i<span style={{ color: accent }}>P</span></span>
  );
}

// Bebas Neue és display condensada. Calcula la mida per fer cabre
// el terme més llarg dins de maxWidth, sense superar `base`. Per
// comparatives apliquem la MATEIXA mida als dos termes (la del més
// llarg) — així sempre tenen el mateix pes visual.
function fitBebas(text, maxWidth, base, ratio = 0.44) {
  const need = (text || '').length * ratio * base;
  if (need <= maxWidth) return base;
  return Math.floor(maxWidth / Math.max(1, (text || '').length * ratio));
}
function pairBebasSize(a, b, maxWidth, base, ratio = 0.44) {
  const longer = (a || '').length >= (b || '').length ? a : b;
  return fitBebas(longer, maxWidth, base, ratio);
}

// ─── Pin · scale petites icones lineals ──────────────────────────
function MiniIcon({ name, size = 22, color = '#fff' }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'pin':
      return (<svg {...c}><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>);
    case 'scale':
      return (<svg {...c}><path d="M12 4v17M4 8h16"/><path d="M7 8l-3 7a3 3 0 0 0 6 0l-3-7zM17 8l-3 7a3 3 0 0 0 6 0l-3-7z"/></svg>);
    case 'spark':
      return (<svg {...c}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>);
    default:
      return null;
  }
}

// ─── BIG ICON CIRCLE ─────────────────────────────────────────────
function IconBadge({ name, size = 140, bg = 'rgba(255,255,255,0.12)', stroke = '#fff' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: bg, display: 'grid', placeItems: 'center',
      border: '1px solid rgba(255,255,255,0.22)',
    }}>
      <div style={{ color: stroke }}>
        <Icon name={name} size={size * 0.55} strokeWidth={1.6} />
      </div>
    </div>
  );
}

// ─── COLUMNA A o B ───────────────────────────────────────────────
function CompColumn({ side, bg, termFontSize = 120 }) {
  return (
    <div style={{
      flex: '1 1 50%', minWidth: 0, overflow: 'hidden',
      position: 'relative', background: bg, color: '#fff',
      padding: '64px 56px', display: 'flex', flexDirection: 'column',
    }}>
      {/* Marca A/B a dalt-dreta */}
      <div className="bebas" style={{
        position: 'absolute', top: 28, right: 36,
        fontSize: 80, lineHeight: 1, color: 'rgba(255,255,255,0.16)',
      }}>{side.tag}</div>

      <IconBadge name={side.icon} size={132} />

      <div className="bebas" style={{
        marginTop: 28, fontSize: termFontSize, lineHeight: 0.95,
        letterSpacing: 1, color: '#fff', whiteSpace: 'nowrap',
      }}>{side.term}</div>

      <div style={{
        marginTop: 18, width: 56, height: 4, borderRadius: 2,
        background: 'rgba(255,255,255,0.55)',
      }} />

      <div style={{
        marginTop: 18, fontSize: 26, fontWeight: 600,
        lineHeight: 1.32, color: '#fff',
        minHeight: 26 * 1.32 * 2, textWrap: 'pretty',
      }}>{side.def}</div>

      {/* Quan? */}
      <div style={{ marginTop: 28 }}>
        <div className="mono" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
          marginBottom: 8,
        }}>
          <MiniIcon name="pin" size={16} color="rgba(255,255,255,0.78)" />
          QUAN?
        </div>
        <div style={{
          fontSize: 22, fontWeight: 500, lineHeight: 1.32,
          color: 'rgba(255,255,255,0.92)', textWrap: 'pretty',
        }}>{side.when}</div>
      </div>

      {/* Art. */}
      <div style={{ marginTop: 'auto' }}>
        <div className="mono" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
          marginBottom: 6,
        }}>
          <MiniIcon name="scale" size={16} color="rgba(255,255,255,0.78)" />
          ART.
        </div>
        <div className="mono" style={{
          fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: 0.2,
        }}>{side.art}</div>
      </div>
    </div>
  );
}

// ─── HEADER NAVY ─────────────────────────────────────────────────
function Header({ title, sub, h = 156 }) {
  return (
    <div style={{
      height: h, background: NAVY, color: '#fff',
      padding: '0 60px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '3px solid rgba(255,255,255,0.08)',
    }}>
      <div>
        <div className="mono" style={{
          fontSize: 14, fontWeight: 700, letterSpacing: 2.8,
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
          marginBottom: 8,
        }}>⚡ {sub || 'No els confonguis'}</div>
        <div style={{
          fontFamily: T.font, fontWeight: 900,
          fontSize: 44, lineHeight: 1.04, letterSpacing: -1.2,
        }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IPMark size={44} ink="#fff" accent={YEL} />
      </div>
    </div>
  );
}

// ─── FOOTER YELLOW ──────────────────────────────────────────────
function KeyFooter({ text, h = 140 }) {
  return (
    <div style={{
      height: h, background: YEL, color: INK,
      padding: '0 60px', display: 'flex', alignItems: 'center', gap: 24,
    }}>
      <div className="mono" style={{
        fontSize: 16, fontWeight: 800, letterSpacing: 3,
        textTransform: 'uppercase', color: 'rgba(19,19,26,0.6)',
        flexShrink: 0, writingMode: 'horizontal-tb',
      }}>
        DIFERÈNCIA<br/>CLAU
      </div>
      <div style={{ width: 3, height: '60%', background: INK, opacity: 0.2 }} />
      <div style={{
        fontSize: 30, fontWeight: 800, letterSpacing: -0.4,
        lineHeight: 1.12, color: INK, textWrap: 'pretty',
      }}>{text}</div>
    </div>
  );
}

// ─── SINGLE POST 1080×1080 ──────────────────────────────────────
function SinglePost({ comp }) {
  const W = 1080, H = 1080;
  const hdr = 156, ftr = 140;
  // 540px columna - 112px padding intern ≈ 420px utilitzables.
  const termFs = pairBebasSize(comp.a.term, comp.b.term, 420, 120);
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: NAVY, color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <Header title={comp.question} sub="Confusions habituals · Acadèmia InfoPol" h={hdr} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: hdr, bottom: ftr,
                    display: 'flex' }}>
        <CompColumn side={{ ...comp.a, tag: 'A' }} bg={A_BG} termFontSize={termFs} />
        <CompColumn side={{ ...comp.b, tag: 'B' }} bg={B_BG} termFontSize={termFs} />
        {/* Divisor central tipus full de paper */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: 2, background: 'rgba(255,255,255,0.18)',
          transform: 'translateX(-1px)',
        }} />
        {/* vs central · botó flotant */}
        <div className="bebas" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 96, height: 96, borderRadius: 48,
          background: '#fff', color: NAVY,
          display: 'grid', placeItems: 'center',
          fontSize: 44, letterSpacing: 1,
          boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
          border: `3px solid ${YEL}`,
        }}>vs</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <KeyFooter text={comp.key} h={ftr} />
      </div>
    </div>
  );
}

// ─── CARRUSEL · 5 SLIDES ────────────────────────────────────────

// Slide 1 · Portada
function CCover({ comp }) {
  // Àrea útil per als termes: 1080 - 80×2 padding = 920 px.
  const termFs = pairBebasSize(comp.a.term, comp.b.term, 920, 230);
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: NAVY_DEEP, color: '#fff', fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* Background graphic — A vs B siluetes */}
      <div className="bebas" style={{
        position: 'absolute', top: -40, left: -20,
        fontSize: 600, lineHeight: 0.85, color: 'rgba(59,107,245,0.18)',
      }}>A</div>
      <div className="bebas" style={{
        position: 'absolute', bottom: -120, right: -10,
        fontSize: 600, lineHeight: 0.85, color: 'rgba(240,180,0,0.16)',
      }}>B</div>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '88px 80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mono" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
          }}>◆ Comparativa · 1/5</div>
          <IPMark size={42} ink="#fff" accent={YEL} />
        </div>

        <div>
          <div className="bebas" style={{
            fontSize: termFs, lineHeight: 0.86, letterSpacing: 1,
            color: '#fff', whiteSpace: 'nowrap',
          }}>{comp.a.term}</div>
          <div style={{
            fontSize: 120, fontWeight: 900, lineHeight: 0.9,
            color: YEL, fontStyle: 'italic', letterSpacing: -3,
            margin: '4px 0 8px',
          }}>vs.</div>
          <div className="bebas" style={{
            fontSize: termFs, lineHeight: 0.86, letterSpacing: 1,
            color: '#fff', whiteSpace: 'nowrap',
          }}>{comp.b.term}</div>
        </div>

        <div style={{
          fontSize: 32, fontWeight: 600, letterSpacing: -0.2,
          lineHeight: 1.22, color: 'rgba(255,255,255,0.85)',
          maxWidth: 820, textWrap: 'pretty',
        }}>
          <span style={{
            background: YEL, color: INK, padding: '4px 12px',
            borderRadius: 6, fontWeight: 800,
          }}>Pregunta</span>{' '}
          {comp.cover}
        </div>
      </div>
    </div>
  );
}

// Slide 2 & 3 · Concepte sol
function CDetail({ comp, which }) {
  const side = which === 'a' ? comp.a : comp.b;
  const bg   = which === 'a' ? A_BG : B_BG;
  const idx  = which === 'a' ? 2 : 3;
  // Àrea útil: 1080 - 80×2 padding - 156 icona - 32 gap = 732 px.
  const termFs = fitBebas(side.term, 720, 170);
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: bg, color: '#fff', fontFamily: T.font,
                  overflow: 'hidden' }}>
      {/* Lletra A/B gegantina al fons */}
      <div className="bebas" style={{
        position: 'absolute', bottom: -180, right: -40,
        fontSize: 900, lineHeight: 0.85,
        color: 'rgba(255,255,255,0.08)',
      }}>{which.toUpperCase()}</div>

      <div style={{
        position: 'absolute', inset: 0,
        padding: '72px 80px',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mono" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '8px 16px', borderRadius: 999,
            background: 'rgba(255,255,255,0.16)',
            fontSize: 16, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: 5, background: '#fff',
            }} />
            Concepte {which.toUpperCase()} · {idx}/5
          </div>
          <IPMark size={42} ink="#fff" accent={YEL} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <IconBadge name={side.icon} size={156} />
          <div>
            <div className="bebas" style={{
              fontSize: termFs, lineHeight: 0.9, letterSpacing: 1,
              whiteSpace: 'nowrap',
            }}>{side.term}</div>
          </div>
        </div>

        <div style={{
          fontSize: 38, fontWeight: 700, lineHeight: 1.16,
          letterSpacing: -0.4, color: '#fff', textWrap: 'pretty',
        }}>{side.def}</div>

        <div style={{
          fontSize: 26, fontWeight: 500, lineHeight: 1.42,
          color: 'rgba(255,255,255,0.88)', textWrap: 'pretty',
          marginTop: 4,
        }}>{side.detail}</div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{
            display: 'flex', gap: 18, flexWrap: 'wrap',
          }}>
            <Pill icon="pin" label="QUAN?" text={side.when} />
            <Pill icon="scale" label="ART." text={side.art} mono />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label, text, mono = false }) {
  return (
    <div style={{
      flex: 1, minWidth: 380,
      padding: '20px 24px',
      background: 'rgba(0,0,0,0.22)',
      borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.12)',
    }}>
      <div className="mono" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
        marginBottom: 6,
      }}>
        <MiniIcon name={icon} size={16} color="rgba(255,255,255,0.78)" />
        {label}
      </div>
      <div className={mono ? 'mono' : ''} style={{
        fontSize: mono ? 22 : 22, fontWeight: mono ? 700 : 600,
        color: '#fff', lineHeight: 1.3, textWrap: 'pretty',
      }}>{text}</div>
    </div>
  );
}

// Slide 4 · split (mateix layout que single post però sense KeyFooter)
function CSplit({ comp }) {
  const W = 1080, H = 1080;
  const termFs = pairBebasSize(comp.a.term, comp.b.term, 420, 120);
  return (
    <div style={{ width: W, height: H, position: 'relative',
                  background: NAVY, color: INK, fontFamily: T.font,
                  overflow: 'hidden' }}>
      <Header title="Cara a cara" sub="Comparativa · 4/5" h={140} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 140, bottom: 140,
                    display: 'flex' }}>
        <CompColumn side={{ ...comp.a, tag: 'A' }} bg={A_BG} termFontSize={termFs} />
        <CompColumn side={{ ...comp.b, tag: 'B' }} bg={B_BG} termFontSize={termFs} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%',
                      width: 2, background: 'rgba(255,255,255,0.18)',
                      transform: 'translateX(-1px)' }} />
        <div className="bebas" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 96, height: 96, borderRadius: 48,
          background: '#fff', color: NAVY,
          display: 'grid', placeItems: 'center',
          fontSize: 44, letterSpacing: 1,
          boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
          border: `3px solid ${YEL}`,
        }}>vs</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <KeyFooter text={comp.key} h={140} />
      </div>
    </div>
  );
}

// Slide 5 · Recorda
function CRecorda({ comp }) {
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative',
                  background: NAVY_DEEP, color: '#fff', fontFamily: T.font,
                  overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        padding: '88px 80px',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mono" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: 4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)',
          }}>★ Recorda · 5/5</div>
          <IPMark size={42} ink="#fff" accent={YEL} />
        </div>

        <div style={{
          fontFamily: T.font, fontWeight: 900,
          fontSize: 72, lineHeight: 1.06, letterSpacing: -1.8,
          textWrap: 'pretty',
        }}>
          <span style={{
            background: YEL, color: INK, padding: '0 12px',
            borderRadius: 6, boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}>{comp.key}</span>
        </div>

        {/* Mini comparativa quan/quan */}
        <div style={{
          marginTop: 14,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
        }}>
          <MiniBox bg={A_BG} term={comp.a.term} icon={comp.a.icon} when={comp.a.when} />
          <MiniBox bg={B_BG} term={comp.b.term} icon={comp.b.icon} when={comp.b.when} />
        </div>

        {/* Exemple */}
        <div style={{
          marginTop: 'auto',
          padding: '28px 32px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 22,
        }}>
          <div className="mono" style={{
            fontSize: 14, fontWeight: 700, letterSpacing: 2.4,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
            marginBottom: 10,
          }}>📍 EXEMPLE D'APLICACIÓ</div>
          <div style={{
            fontSize: 28, fontWeight: 600, lineHeight: 1.34,
            color: '#fff', textWrap: 'pretty',
          }}>{comp.example}</div>
        </div>

        {/* CTA bookmark */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, padding: '20px 28px',
          background: YEL, color: INK, borderRadius: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill={INK}>
              <path d="M6 3h12v18l-6-4-6 4V3z" />
            </svg>
            <div style={{
              fontSize: 26, fontWeight: 800, letterSpacing: -0.4,
            }}>Guarda aquesta comparativa</div>
          </div>
          <Icon name="arrow-right" size={32} strokeWidth={2.4} color={INK} />
        </div>
      </div>
    </div>
  );
}

function MiniBox({ bg, term, icon, when }) {
  return (
    <div style={{
      padding: 24, background: bg, borderRadius: 18,
      display: 'flex', flexDirection: 'column', gap: 12,
      minHeight: 200,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ color: '#fff' }}>
          <Icon name={icon} size={32} strokeWidth={1.8} />
        </div>
        <div className="bebas" style={{
          fontSize: 56, lineHeight: 0.9, color: '#fff', letterSpacing: 1,
        }}>{term}</div>
      </div>
      <div style={{
        fontSize: 20, fontWeight: 500, lineHeight: 1.32,
        color: 'rgba(255,255,255,0.9)',
      }}>{when}</div>
    </div>
  );
}

// ─── ROWS ─────────────────────────────────────────────────────────
function SingleRow({ comp }) {
  return (
    <DCSection
      id={`single-${comp.id}`}
      title={`Single · ${comp.a.term} vs ${comp.b.term}`}
      subtitle={comp.key}
    >
      <DCArtboard id={`s-${comp.id}`} label="Single post · 1080×1080"
                  width={1080} height={1080}>
        <SinglePost comp={comp} />
      </DCArtboard>
    </DCSection>
  );
}

function CarouselRow({ comp }) {
  return (
    <DCSection
      id={`car-${comp.id}`}
      title={`Carrusel · ${comp.a.term} vs ${comp.b.term}`}
      subtitle="5 slides · portada · A en detall · B en detall · split · recorda"
    >
      <DCArtboard id={`c1-${comp.id}`} label="1 · Portada" width={1080} height={1080}>
        <CCover comp={comp} />
      </DCArtboard>
      <DCArtboard id={`c2-${comp.id}`} label={`2 · ${comp.a.term}`} width={1080} height={1080}>
        <CDetail comp={comp} which="a" />
      </DCArtboard>
      <DCArtboard id={`c3-${comp.id}`} label={`3 · ${comp.b.term}`} width={1080} height={1080}>
        <CDetail comp={comp} which="b" />
      </DCArtboard>
      <DCArtboard id={`c4-${comp.id}`} label="4 · Cara a cara" width={1080} height={1080}>
        <CSplit comp={comp} />
      </DCArtboard>
      <DCArtboard id={`c5-${comp.id}`} label="5 · Recorda + CTA" width={1080} height={1080}>
        <CRecorda comp={comp} />
      </DCArtboard>
    </DCSection>
  );
}

// ─── BANC DE COMPARATIVES (llistat de següents) ─────────────────
function BankCard() {
  const items = [
    'Detenció vs. Retenció',
    'Identificació vs. Cacheig',
    'Delicte lleu vs. Falta (històric)',
    'Registre vs. Inspecció',
    'Flagrant delicte vs. Quasi-flagrant',
    'Mossos vs. Policia Local (competències)',
    'Atestat vs. Denúncia',
    'Sospitós vs. Investigat vs. Acusat',
    'Multa administrativa vs. Sanció penal',
    'Custòdia vs. Detenció',
  ];
  return (
    <DCArtboard id="bank" label="Banc · idees per la sèrie" width={760} height={1080}>
      <div style={{
        width: '100%', height: '100%', background: '#fff',
        padding: 48, fontFamily: T.font, color: INK,
      }}>
        <div className="mono" style={{
          fontSize: 12, fontWeight: 700, letterSpacing: 2.4,
          textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8,
        }}>🆚 Banc de comparatives</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1 }}>
          10 ja preparades per la sèrie setmanal
        </div>
        <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 6, lineHeight: 1.45 }}>
          Format més guardat d\u2019Instagram. 1 publicació / setmana és el ritme ideal.
        </div>

        <ol style={{
          marginTop: 22, paddingLeft: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {items.map((s, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 12, background: '#FAF8F3',
            }}>
              <div className="mono" style={{
                width: 28, fontSize: 12, color: T.inkMuted,
                fontWeight: 700, letterSpacing: 1.2,
              }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK, flex: 1 }}>{s}</div>
            </li>
          ))}
        </ol>

        <div style={{
          marginTop: 22, padding: 16, borderRadius: 12,
          background: '#0E1A36', color: '#fff',
        }}>
          <div className="mono" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.8,
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 6,
          }}>Regles tipogràfiques</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.5 }}>
            <li>Termes A i B en MAJÚSCULA, Bebas Neue 120 px.</li>
            <li>Mateix nº de línies a cada columna (simetria visual = pro).</li>
            <li>Icones del mateix estil i pes visual.</li>
          </ul>
        </div>
      </div>
    </DCArtboard>
  );
}

// ─── TWEAKS ───────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "show_bank": true,
  "show_full_carousel": true
}/*EDITMODE-END*/;

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Estructura">
        <TweakRadio
          label="Carrusel complet · Identificació vs Cacheig"
          value={t.show_full_carousel ? 'yes' : 'no'}
          options={[
            { value: 'yes', label: 'Sí' },
            { value: 'no',  label: 'No' },
          ]}
          onChange={(v) => setTweak('show_full_carousel', v === 'yes')}
        />
        <TweakRadio
          label="Banc d'idees + regles tipogràfiques"
          value={t.show_bank ? 'yes' : 'no'}
          options={[
            { value: 'yes', label: 'Sí' },
            { value: 'no',  label: 'No' },
          ]}
          onChange={(v) => setTweak('show_bank', v === 'yes')}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ─── APP ──────────────────────────────────────────────────────────
function App() {
  const [t] = useTweaks(TWEAK_DEFAULTS);
  // Carrusel ampliat: només per Identificació vs Cacheig
  const carouselComp = COMPS.find(c => c.id === 'identificacio-cacheig');
  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="singles" title="Single posts · 1080×1080"
                   subtitle="3 exemples del banc: split A | B amb diferència clau a sota.">
          {COMPS.map((c) => (
            <DCArtboard key={c.id} id={`s-${c.id}`}
                        label={`${c.a.term} vs ${c.b.term}`}
                        width={1080} height={1080}>
              <SinglePost comp={c} />
            </DCArtboard>
          ))}
        </DCSection>

        {t.show_full_carousel && carouselComp && (
          <DCSection
            id="carousel"
            title={`Carrusel ampliat · ${carouselComp.a.term} vs ${carouselComp.b.term}`}
            subtitle="5 slides per a temes que demanen més espai."
          >
            <DCArtboard id="c1" label="1 · Portada" width={1080} height={1080}>
              <CCover comp={carouselComp} />
            </DCArtboard>
            <DCArtboard id="c2" label={`2 · ${carouselComp.a.term}`} width={1080} height={1080}>
              <CDetail comp={carouselComp} which="a" />
            </DCArtboard>
            <DCArtboard id="c3" label={`3 · ${carouselComp.b.term}`} width={1080} height={1080}>
              <CDetail comp={carouselComp} which="b" />
            </DCArtboard>
            <DCArtboard id="c4" label="4 · Cara a cara" width={1080} height={1080}>
              <CSplit comp={carouselComp} />
            </DCArtboard>
            <DCArtboard id="c5" label="5 · Recorda + CTA" width={1080} height={1080}>
              <CRecorda comp={carouselComp} />
            </DCArtboard>
          </DCSection>
        )}

        {t.show_bank && (
          <DCSection id="bank" title="Banc de comparatives + regles"
                     subtitle="Llistat per planificar la sèrie setmanal.">
            <BankCard />
          </DCSection>
        )}
      </DesignCanvas>
      <Tweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
