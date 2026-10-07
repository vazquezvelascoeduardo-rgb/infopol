import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SearchField, SectionHead, CatIcon, Pill, RoundIconBtn } from '../../components/Shared';

function BigCatCard({ cat, icon, kicker, title, desc, cta, onClick }) {
  const k = T.cat[cat];
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.lg, padding: 14, borderTop: `3px solid ${k.solid}`, boxShadow: T.shadow.card, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 158, cursor: 'pointer' }}>
      <CatIcon cat={cat} icon={icon} size={40} rounded={11} />
      <div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 17, letterSpacing: -0.3, marginTop: 1 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.35 }}>{desc}</div>
      </div>
      <div style={{ marginTop: 'auto', color: k.solid, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
        {cta} <Icon name="arrow-right" size={14} color={k.solid} />
      </div>
    </div>
  );
}

function SmallCatCard({ cat, icon, kicker, title, onClick }) {
  const k = T.cat[cat];
  return (
    <div onClick={onClick} style={{ background: '#fff', borderRadius: T.r.md, padding: 12, borderTop: `3px solid ${k.solid}`, boxShadow: T.shadow.card, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <CatIcon cat={cat} icon={icon} size={36} rounded={9} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.9, textTransform: 'uppercase', color: k.ink }}>{kicker}</div>
        <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: -0.2, color: T.ink, marginTop: 1 }}>{title}</div>
      </div>
      <Icon name="chevron-right" size={16} color={T.inkMuted} />
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', padding: '6px 10px 6px 8px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700 }}>
      <Icon name={icon} size={13} color="#fff" strokeWidth={2.4} />{label}
    </div>
  );
}

const NEWS = [
  { date: '04·18', tag: 'LO 1/2026', title: 'Multireincidència — enduriment de furts i estafes lleus', desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026.' },
  { date: '04·14', tag: 'RD 316/2026', title: 'Reforma del Reglament d\'Estrangeria', desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny.' },
  { date: '03·28', tag: 'Circ. 2/2026', title: 'Instrucció sobre identificació i registre de persones', desc: 'Nova circular de la Fiscalia General sobre aplicació de l\'art. 20 LO 4/2015.' },
];

const NOTICIES = [
  { date: '10·07', tag: 'Ciència', title: 'Nobel de Química per a Kagan i Soai per la síntesi asimètrica', desc: 'El francès H. B. Kagan i el japonès K. Soai guanyen el premi per descobrir com crear molècules espill, clau per fabricar fàrmacs.', url: 'https://www.primicias.ec/ciencia-tecnologia/premio-nobel-quimica-2026-henri-kagan-kenso-soai-134375/' },
  { date: '10·07', tag: 'Política', title: 'Sánchez convoca eleccions generals el 29 de novembre', desc: 'El president del Govern anuncia la dissolució anticipada de les Corts. Campanya electoral a partir del 7 de novembre.', url: 'https://periodistadigital.com/periodismo/20261007/10-asuntos-clave-espana-miercoles-7-octubre-2026-amnistia-vivienda-seleccion-noticia-689405254491' },
  { date: '10·07', tag: 'Política', title: 'El TC obre la porta al retorn immediat de Puigdemont', desc: 'El Tribunal Constitucional remet al Suprem la sentència que aplica la llei d\'amnistia, permetent el retorn del president Puigdemont.', url: 'https://infobae.com/espana/agencias/2026/10/07/temas-del-dia-de-efe-espana-del-miercoles-7-de-octubre-de-2026-1350-horas' },
  { date: '10·07', tag: 'Economia', title: 'Vaga general per l\'habitatge convocada per al 11 de novembre', desc: 'Sindicats i col·lectius socials convoquen aturada general per exigir mesures davant la crisi d\'accés a l\'habitatge.', url: 'https://www.infobae.com/espana/agencias/2026/10/06/hoy-sera-noticia-miercoles-7-de-octubre/' },
  { date: '10·01', tag: 'Catalunya', title: 'El Parlament rebutja la proposta de compra d\'habitatge d\'Illa', desc: 'La cambra tomba la iniciativa del Govern de compra compartida d\'habitatge per a majors de 40 anys, amb l\'abstenció dels Comuns.', url: 'https://www.infobae.com/espana/agencias/2026/10/01/el-parlament-catalan-rechaza-la-propuesta-de-illa-de-compra-conjunta-de-vivienda-con-la-generalitat/' },
  { date: '10·07', tag: 'Internacional', title: 'Israel commemora el tercer aniversari de l\'atac de Hamas', desc: 'Primera commemoració amb tots els ostatges retornats. Nous atacs deixen dos morts a Gaza malgrat el cessament del foc.', url: 'https://es.euronews.com/2026/10/07/euronews-hoy-las-noticias-del-7-de-octubre-de-2026-israel-conmemora-los-3-anos-del-ataque-' },
  { date: '10·07', tag: 'Internacional', title: 'La tripulació de la Crew-12 torna a la Terra', desc: 'Els astronautes amerissen amb èxit de retorn a casa, després de més de set mesos a l\'Estació Espacial Internacional.', url: 'https://www.infobae.com/america/agencias/2026/10/07/miercoles-7-de-octubre-de-2026-0200-gmt/' },
  { date: '10·07', tag: 'Internacional', title: 'Iran adverteix que tancarà rutes a l\'estret d\'Ormuz', desc: 'La Guàrdia Revolucionària iraniana afirma controlar l\'estret i anuncia el bloqueig de les rutes que Teheran considera il·legals.', url: 'https://www.prensa-latina.cu/2026/10/07/guardia-revolucionaria-afirma-que-iran-controla-el-estrecho-de-ormuz/' },
  { date: '10·07', tag: 'Seguretat', title: 'La criminalitat a Catalunya baixa un 7,4% en el primer semestre', desc: 'El Ministeri de l\'Interior registra un descens de delictes, però els homicidis augmenten un 16% i les agressions sexuals segueixen altes.', url: 'https://www.diaridetarragona.com/sucesos/270873/delincuencia-baja-7-4-catalunya-reus-desmarca-registra-aumento-9-1.html' },
];

const TAG_COLOR = {
  'Ciència':      { bg: '#CCEEF1', fg: '#0A4F56' },
  'Política':     { bg: '#D8E2FE', fg: '#0E2B7A' },
  'Economia':     { bg: '#FBE7C2', fg: '#6B3F08' },
  'Catalunya':    { bg: '#FFE0CB', fg: '#7A2E04' },
  'Internacional':{ bg: '#EBDAFB', fg: '#4A1B7A' },
  'Seguretat':    { bg: '#FBDADC', fg: '#7A1B22' },
};

export default function ScreenOperativaHome() {
  const navigate = useNavigate();
  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <div style={{ display: 'flex', gap: 8 }}>
          <RoundIconBtn icon="bell" />
          <RoundIconBtn icon="user" onClick={() => navigate('/perfil')} />
        </div>
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Mode operativa · Torn 06–14
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Bon dia, agent <span style={{ color: T.cat.academia.solid }}>Roca</span>.
        </h1>
      </div>

      <div style={{ padding: '0 16px' }}>
        <SearchField placeholder="Cerca article, infracció, paraula clau…" />
      </div>

      <div style={{ padding: '16px 16px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BigCatCard cat="leyes" icon="scale" kicker="Consulta jurídica" title="Lleis" desc="CP, LECrim, FCS, LSV, Seg. Ciutadana, Estrangeria." cta="Obrir" onClick={() => navigate('/operativa/infraccions')} />
        <BigCatCard cat="operativa" icon="siren" kicker="A peu de carrer" title="Operativa" desc="Procediments per situació pas a pas." cta="Entrar" onClick={() => navigate('/operativa/protocol')} />
      </div>

      {/* Superbuscador */}
      <div style={{ padding: '4px 16px' }}>
        <div onClick={() => navigate('/operativa/infraccions')} style={{ background: '#fff', borderRadius: T.r.lg, padding: 16, borderTop: `3px solid ${T.cat.transito.solid}`, boxShadow: T.shadow.card, cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CatIcon cat="transito" icon="car" size={44} rounded={12} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.transito.ink }}>Trànsit · Catàleg SCT</div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 17, letterSpacing: -0.3, marginTop: 2 }}>Superbuscador d'infraccions</div>
              <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>LSV, RGC, RGV, Assegurança i CP. Resultats amb quantia, punts i DTE.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['Alcohol', 'Drogues', 'Velocitat', 'Documentació', 'Telèfon mòbil'].map(t => (
              <span key={t} style={{ fontSize: 11, padding: '5px 10px', background: T.cat.transito.soft, color: T.cat.transito.ink, borderRadius: 999, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2x2 */}
      <div style={{ padding: '12px 16px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <SmallCatCard cat="leyes" icon="book" kicker="Trànsit · SCT" title="Catàleg infraccions" onClick={() => navigate('/operativa/infraccions')} />
        <SmallCatCard cat="alcohol" icon="beaker" kicker="Calculadora" title="Alcoholèmia" onClick={() => navigate('/operativa/infraccions?q=alcohol')} />
        <SmallCatCard cat="atajos" icon="bolt" kicker="Dreceres" title="Recursos ràpids" />
        <SmallCatCard cat="operativa" icon="map" kicker="Patrullatge" title="Mapa d'incidències" onClick={() => navigate('/operativa/mapa')} />
      </div>

      {/* Protocols estrella */}
      <div style={{ padding: '10px 16px' }}>
        <div onClick={() => navigate('/operativa/protocol')} style={{ background: T.cat.operativa.solid, borderRadius: T.r.lg, padding: 16, color: '#fff', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
          <Pill bg="rgba(255,255,255,0.18)" fg="#fff">★ Estrella d'InfoPol</Pill>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, marginTop: 10, letterSpacing: -0.3 }}>Protocols pas a pas</div>
          <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>132 situacions cobertes amb article, sanció i diligència.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Chip icon="route" label="Identificació" />
            <Chip icon="car" label="Control trànsit" />
            <Chip icon="siren" label="Detenció" />
          </div>
        </div>
      </div>

      {/* Actualitat normativa */}
      <div style={{ padding: '14px 0 0' }}>
        <SectionHead kicker="Actualitat" kickerColor={T.cat.operativa.solid} title="Última hora normativa" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.operativa.solid}`, boxShadow: T.shadow.card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notícies del dia */}
      <div style={{ padding: '18px 0 24px' }}>
        <SectionHead kicker="Notícies" kickerColor={T.cat.atajos.solid} title="Notícies del dia" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NOTICIES.map((n, i) => {
            const tc = TAG_COLOR[n.tag] || { bg: T.cat.atajos.soft, fg: T.cat.atajos.ink };
            return (
              <div
                key={i}
                onClick={() => n.url && window.open(n.url, '_blank', 'noopener')}
                style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.atajos.solid}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', background: tc.bg, color: tc.fg, padding: '2px 7px', borderRadius: 999 }}>{n.tag}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
                {n.url && (
                  <div style={{ marginTop: 6, fontSize: 11, color: T.cat.atajos.solid, fontWeight: 700 }}>Llegir notícia →</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
