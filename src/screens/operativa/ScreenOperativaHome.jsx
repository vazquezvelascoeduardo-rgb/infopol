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

const DAILY_NEWS = [
  { date: '08·31', tag: 'Política · Cat', title: 'Junts bloqueja la financiació: exigeix la sortida de la LOFCA', desc: 'Puigdemont condiciona el suport al govern a una reforma que exclogui Catalunya del règim comú de finançament autonòmic.', url: 'https://www.que.es/2026/08/31/financiacion-autonomica-junts-bloqueo/' },
  { date: '08·31', tag: 'Política · Esp', title: 'Sánchez eximeix el Marroc i apunta a Rússia en la crisi de Ceuta', desc: 'El president va defensar a la SER la gestió migratòria a Ceuta i va negar responsabilitat marroquina en l\'onada d\'entrades il·legals.', url: 'https://theobjective.com/espana/2026-08-31/sumario-tarde-tension-ceuta-sanchez-hamlyn-pnv/' },
  { date: '08·31', tag: 'Internacional', title: 'Iran-EUA: primer intercanvi d\'atacs des de juliol al Golf Pèrsic', desc: 'Bombardejos dels EUA a l\'illa iraniana de Larak amb víctimes. Teheran respon amb míssils contra Jordània i els Emirats Àrabs Units.', url: 'https://www.infobae.com/america/agencias/2026/08/31/temas-del-dia-de-efe-internacional-del-lunes-31-de-agosto-de-2026-12gmt-horas/' },
  { date: '08·31', tag: 'Internacional', title: 'Supertanquero en flames a l\'estret d\'Ormuz per mines iranianes', desc: 'La Guàrdia Revolucionària iraniana confirma que el vaixell va ser impactat per dos artefactes al pas clau del comerç petrolier mundial.', url: 'https://es.euronews.com/2026/08/31/euronews-hoy-las-noticias-del-lunes-31-de-agosto-de-2026-espana-e-italia-prorrogan-su-cont' },
  { date: '08·31', tag: 'Tecnologia', title: 'Tim Cook deixa Apple: John Ternus assumeix la direcció executiva', desc: 'Ternus, enginyer de hardware i arquitecte del xip Apple Silicon, pren el relleu de Cook. Gran event de productes el 9 de setembre.', url: 'https://www.infobae.com/america/agencias/2026/08/31/lunes-31-de-agosto-de-2026-0700-gmt/' },
  { date: '08·31', tag: 'Esports · Cat', title: 'Gabriel Jesús fitxa pel FC Barcelona', desc: 'L\'atacant brasiler aterra a Barcelona per signar el contracte, la nit en que el Barça rep el Rayo Vallecano al seu estadi.', url: 'https://www.cope.es/emisoras/catalunya/podcast/episodios/15-05-h-31-agosto-2026-esports-cope-20260831_3427603.html' },
  { date: '08·31', tag: 'Esports · Mot', title: 'Álex Palou, pentacampió de l\'IndyCar', desc: 'El pilot de Mollet del Vallès es corona per cinquena vegada campió de la Fórmula IndyCar nord-americana, referent mundial del motor.', url: 'https://www.periodistadigital.com/periodismo/20260831/10-temas-clave-lunes-31-agosto-2026-espana-calor-luz-futbol-ceuta-noticia-689405242294/' },
  { date: '08·31', tag: 'Esports · Ciclisme', title: 'Vuelta a Espanya: 7a etapa amb sortida a Vall d\'Alba', desc: 'El pelotó pren la sortida a la localitat castellonenca en una etapa de muntanya que promet canvis importants a la classificació general.', url: 'https://www.cope.es/emisoras/comunidad-valenciana/castellon-provincia/castellon/podcast/episodios/15-25h-31-agosto-2026-deportes-cope-castellon-20260831_3427763.html' },
  { date: '08·31', tag: 'Ciència', title: 'La Xina llança la Chang\'e-7 cap al pol sud de la Lluna', desc: 'La sonda espacial xinesa busca confirmar l\'existència de gel d\'aigua en zones permanentment ombrejades del pol lunar sud, clau per a futures missions habitades.', url: 'https://www.cooperativaciencia.cl/ciencia/2025/12/30/ciencia-en-2026-los-hitos-que-transformaran-la-investigacion-segun-la-revista-nature/' },
  { date: '08·31', tag: 'Judicial', title: 'El TS: el canvi de sexe registral no esborra condemnes per violència de gènere', desc: 'El Tribunal Suprem fixa doctrina i estableix que la modificació del sexe al registre civil no té efecte retroactiu sobre condemnes per violència masclista.', url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/' },
  { date: '08·31', tag: 'Cultura', title: '60è Carnaval de Notting Hill: mig milió de persones al carrer a Londres', desc: 'El barri londinenc celebra sis dècades del major festival multicultural d\'Europa amb la seva desfilada caribenya, convertida en símbol de diversitat i resistència.', url: 'https://www.infobae.com/america/agencias/2026/08/31/lunes-31-de-agosto-de-2026-0700-gmt/' },
];

const TAG_COLORS = {
  'Política': '#1D4ED8',
  'Internacional': '#7C3AED',
  'Tecnologia': '#0891B2',
  'Esports': '#D97706',
  'Ciència': '#059669',
  'Judicial': '#DC2626',
  'Cultura': '#DB2777',
};

function tagColor(tag) {
  for (const [key, color] of Object.entries(TAG_COLORS)) {
    if (tag.startsWith(key)) return color;
  }
  return '#6B7280';
}

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

      {/* Notícies del Dia */}
      <div style={{ padding: '18px 0 24px' }}>
        <SectionHead kicker="31·08·2026" kickerColor="#6B7280" title="Notícies del Dia" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAILY_NEWS.map((n, i) => {
            const color = tagColor(n.tag);
            return (
              <div
                key={i}
                onClick={() => n.url && window.open(n.url, '_blank')}
                style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${color}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
                {n.url && (
                  <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 700 }}>Llegir notícia competa →</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
