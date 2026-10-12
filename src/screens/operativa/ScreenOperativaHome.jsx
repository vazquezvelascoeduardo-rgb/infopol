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
  { date: '10·12', tag: 'Policial · BCN', title: 'Mossos desarticulen la banda que robava a cases de futbolistes a Catalunya', desc: 'Dos homes i una dona detinguts a Gavà vinculats a almenys vuit robos. Entre les víctimes, el porter del FC Barcelona Joan García.', url: 'https://infobae.com/espana/agencias/2026/10/12/desarticulan-un-grupo-criminal-que-cometia-robos-en-casas-de-futbolistas-en-cataluna' },
  { date: '10·12', tag: 'Policial · BCN', title: 'Mort violenta a Nou Barris investigada pels Mossos de matinada', desc: 'Agents de la DIC han obert diligències al districte barceloní per esclarir les circumstàncies del succés.', url: 'https://cronicaglobal.elespanol.com/vida/20261012/mossos-desquadra-investigan-nueva-muerte-violenta-barcelona/1003742801974_0.html' },
  { date: '10·12', tag: 'Política · CAT', title: 'Illa reivindica Catalunya com a "defensora de l\'Espanya plural" el 12-O', desc: 'El president de la Generalitat va assistir al desfile de la Festa Nacional a Madrid i defensà un model d\'Espanya diversa.', url: 'https://cronicaglobal.elespanol.com/politica/20261012/illa-reivindica-octubre-cataluna-defensora-espana-plural/1003742801983_0.html' },
  { date: '10·12', tag: 'Economia', title: 'L\'IBEX 35 tanca la jornada del 12-O amb una pujada de l\'1,33%', desc: 'La borsa espanyola va tancar en positiu impulsada per les finances, el petroli i les telecomunicacions.', url: 'https://mx.investing.com/news/stock-market-news/las-bolsas-de-valores-de-espana-cerraron-con-subidas-el-ibex-35-gano-un-133-3795469' },
  { date: '10·12', tag: 'Economia · BCN', title: 'Barcelona aprova pujar l\'IBI un 150% als propietaris de quatre o més pisos turístics', desc: 'L\'Ajuntament vol limitar la proliferació d\'apartaments d\'ús turístic amb una mesura fiscal per a grans tenidors.', url: 'https://bolsamania.com/noticias/economia/cinco-noticias-mas-importantes-hoy-lunes-12-octubre--23818466.html' },
  { date: '10·12', tag: 'Esports · FCB', title: 'El Barça s\'exercita per al primer desplaçament europeu de la temporada: visita al Galatasaray', desc: 'Amb vuit victòries en vuit partits a la Lliga, el club blaugrana arriba com a líder incontestable a Istanbul.', url: 'https://www.barcablaugranes.com/barcelona-news/134852/fc-barcelona-news-12-october-2026-preparations-begin-for-champions-league-trip-to-galatasaray' },
  { date: '10·12', tag: 'Internacional', title: 'El Papa Lleó XIV serà operat d\'un nòdul pulmonar sense alterar el viatge a Amèrica', desc: 'El Vaticà confirma que la intervenció quirúrgica és programada i que la visita pastoral es mantindrà.', url: 'https://es.euronews.com/video/2026/10/12/ultimas-noticias-12-octubre-2026-tarde' },
  { date: '10·12', tag: 'Internacional', title: 'Corea del Nord llança diversos míssils balístics cap al mar del Japó', desc: 'Seül i Tòquio confirmen els llançaments i activen els seus estats majors enmig d\'una tensió creixent a la península coreana.', url: 'https://www.infobae.com/america/agencias/2026/10/12/lunes-12-de-octubre-de-2026-0700-gmt/' },
  { date: '10·12', tag: 'Internacional', title: 'FMI i Banc Mundial arranquen a Bangkok amb 191 delegats', desc: 'Les reunions anuals debaten sobre intel·ligència artificial, conflictes bèl·lics actius i l\'escalada del deute públic global.', url: 'https://www.infobae.com/america/agencias/2026/10/12/lunes-12-de-octubre-de-2026-0700-gmt/' },
  { date: '10·08', tag: 'Premi Nobel', title: 'Anne Carson guanya el Nobel de Literatura 2026', desc: 'L\'Acadèmia Sueca reconeix la poetessa i assagista canadenca "per la seva obra audaç i inventiva".', url: 'https://www.diaridetarragona.com/cultura/272647/canadiense-anne-carson-premio-nobel-literatura-2026.html' },
  { date: '10·07', tag: 'Premi Nobel', title: 'Nobel de Química per a Henri Kagan i Kenso Soai per la homoquiralitat molecular', desc: 'La Reial Acadèmia Sueca reconeix els seus treballs sobre molècules en mirall, claus per a la indústria farmacèutica.', url: 'https://www.infobae.com/america/mundo/2026/10/07/la-real-academia-sueca-de-ciencias-anuncia-al-ganador-del-premio-nobel-de-quimica-2026/' },
  { date: '10·05', tag: 'Premi Nobel', title: 'Nobel de Medicina per Deisseroth, Hegemann i Nagel per la optogenètica', desc: 'El trio va demostrar com activar neurones amb llum, obrint nous camins per a tractaments de malalties cerebrals.', url: 'https://cnnespanol.cnn.com/2026/10/05/ciencia/premio-nobel-medicina-2026-trax' },
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

      {/* Actualitat normativa */}
      <div style={{ padding: '14px 0 0' }}>
        <SectionHead kicker="Actualitat" kickerColor={T.cat.operativa.solid} title="Última hora" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.operativa.solid}`, boxShadow: T.shadow.card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
              {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 700, color: T.cat.operativa.solid, textDecoration: 'none' }}>Llegir notícia →</a>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
