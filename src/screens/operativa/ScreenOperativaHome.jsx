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

const DAILY_NEWS = [
  { date: '10·08', tag: 'Nobel Literatura', title: 'Anne Carson guanya el Nobel de Literatura 2026', desc: 'L\'escriptora canadenca premiada per una obra "audaç i inventiva" en diàleg lúdic amb la tradició clàssica.', url: 'https://cnnespanol.cnn.com/2026/10/08/cultura/premio-nobel-literatura-orix' },
  { date: '10·08', tag: 'Habitatge', title: 'Entra en vigor el primer decret d\'habitatge; la mort de Maricarmen commou Espanya', desc: 'La norma amplia restriccions per a grans tenidors fins al 2030. Sindicats convoquen vaga general per l\'habitatge l\'11 de novembre.', url: 'https://www.infobae.com/espana/agencias/2026/10/07/hoy-sera-noticia-jueves-8-de-octubre/' },
  { date: '10·08', tag: 'Política Estat', title: 'Feijóo exigeix explicacions sobre la jutgessa que investigava el germà de Sánchez', desc: 'La UCO apunta a l\'entorn del PSOE. Les eleccions generals del 29-N marquen tota l\'agenda política.', url: 'https://www.elespanol.com/espana/politica/20261008/ultima-hora-politica-directo-feijoo-reune-genova-cupula-pp-barones-definir-campana-electoral/1003744412713_10.html' },
  { date: '10·08', tag: 'Successos', title: 'Detingut un jove per l\'assassinat a trets d\'un cirurgià plàstic a Marbella', desc: 'La víctima va rebre impactes de bala al lloc de treball. La policia descarta, de moment, vincle amb el crim organitzat.', url: 'https://www.libertaddigital.com/sucesos/2026-10-08/detenido-un-joven-por-el-asesinato-a-tiros-de-un-cirujano-plastico-en-marbella-7472867/' },
  { date: '10·08', tag: 'Internacional', title: 'L\'Iran ataca petrolers a l\'estret d\'Ormuz; el Brent puja un 5% fins als 105 dòlars', desc: 'L\'Ibex 35 cau un 1,3% als mínims de quatre mesos per la tensió als mercats globals de petroli.', url: 'https://es.euronews.com/2026/10/08/euronews-hoy-las-noticias-del-8-de-octubre-de-2026' },
  { date: '10·08', tag: 'Internacional', title: 'Rússia ataca amb drons i míssils sis regions ucraïneses: 19 morts, 4 nens a Pryluki', desc: 'Danys greus a infraestructures energètiques i industrials. Un dels bombardejos més intensos dels últims mesos.', url: 'https://www.infobae.com/america/mundo/' },
  { date: '10·08', tag: 'Esports', title: 'Lamine Yamal, en dubte per al Barça-Getafe; Dani Olmo sorprèn parlant en català', desc: 'Flick ha de decidir si arrisca el davanter blaugrana. Olmo va parlar en croat i català a la roda de premsa de la Roja.', url: 'https://www.elnacional.cat/es/deportes.html' },
  { date: '10·07', tag: 'Nobel Química', title: 'Nobel de Química per a Kagan i Soai per l\'autocatàlisi asimètrica', desc: 'El premi resol un misteri químic centenari sobre l\'origen de l\'homoquiralitat. Aplicació directa en fabricació de fàrmacs.', url: 'https://www.nationalgeographic.com.es/ciencia/nobel-quimica-2026-es-para-henri-b-kagan-y-kenso-soai_29591' },
  { date: '10·06', tag: 'Política Catalunya', title: 'El 29-N paralitza el finançament singular de Catalunya i el traspàs de Rodalies', desc: 'La convocatòria electoral deixa sense tramitació la LOFCA, la condonació de 17.000 M€ del FLA i el traspàs ferroviari.', url: 'https://www.moncloa.com/2026/10/06/financiacion-singular-cataluna-29n-3443469/' },
  { date: '10·05', tag: 'Nobel Medicina', title: 'Nobel de Medicina per l\'optogenètica: la llum com a interruptor de neurones', desc: 'Deisseroth, Hegemann i Nagel premiats per una tècnica que permet mapear funcions cerebrals amb precisió inèdita.', url: 'https://cnnespanol.cnn.com/2026/10/05/ciencia/premio-nobel-medicina-2026-trax' },
];

const NEWS = [
  { date: '04·18', tag: 'LO 1/2026', title: 'Multireincidència — enduriment de furts i estafes lleus', desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026.' },
  { date: '04·14', tag: 'RD 316/2026', title: 'Reforma del Reglament d\'Estrangeria', desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny.' },
  { date: '03·28', tag: 'Circ. 2/2026', title: 'Instrucció sobre identificació i registre de persones', desc: 'Nova circular de la Fiscalia General sobre aplicació de l\'art. 20 LO 4/2015.' },
];

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

      {/* Noticias del dia */}
      <div style={{ padding: '14px 0 0' }}>
        <SectionHead kicker="Noticias" kickerColor={T.cat.academia.solid} title="Actualitat del dia" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAILY_NEWS.map((n, i) => (
            <div key={i}
              onClick={n.url ? () => window.open(n.url, '_blank') : undefined}
              style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.academia.solid}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.academia.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
              {n.url && <div style={{ fontSize: 11, color: T.cat.academia.solid, fontWeight: 700, marginTop: 6 }}>Font →</div>}
            </div>
          ))}
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
    </div>
  );
}
