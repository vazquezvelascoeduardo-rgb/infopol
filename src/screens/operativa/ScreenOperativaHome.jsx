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
  { date: '06·29', tag: 'Política', title: 'El PSC demana al PP retirar els 15 recursos contra la llei d\'amnistia', desc: 'La portaveu del PSC ha reptat el PP a demostrar que vol passar pàgina del procés del 2017. El PP manté quinze recursos davant el TC.', url: 'https://www.elespanol.com/espana/politica/20260629/ultima-hora-politica-directo-juez-interroga-caso-leire-carmen-pano-empresaria-llevo-euros-ferraz/1003744303126_10.html' },
  { date: '06·29', tag: 'Judicial', title: 'El jutge interroga al Cas Leire l\'empresària que va portar diners a Ferraz', desc: 'La comissió d\'investigació de la SEPI al Senat rep l\'excomissari Jesús María Gómez. El cas avança en l\'esclariment del presumpte finançament irregular del PSOE.', url: 'https://www.elespanol.com/espana/politica/20260629/ultima-hora-politica-directo-juez-interroga-caso-leire-carmen-pano-empresaria-llevo-euros-ferraz/1003744303126_10.html' },
  { date: '06·29', tag: 'Política', title: 'El PP registra al Congrés un paquet de mesures fiscals de 3.200 milions', desc: 'El Partit Popular ha registrat una proposició no de llei amb mesures fiscals valorades en 3.200 milions d\'euros, com a proposta alternativa al marc pressupostari del 2027.', url: 'https://theobjective.com/actualidad/2026-06-29/29-de-junio-de-2026-lo-que-tienes-que-saber-de-espana/' },
  { date: '06·29', tag: 'Economia', title: 'El Govern millora en quatre dècimes la previsió de creixement econòmic del 2026', desc: 'El ministre Carlos Cuerpo ha presentat l\'actualització macroeconòmica que servirà de base als pressupostos del 2027, incorporant els efectes del conflicte armat a l\'Iran.', url: 'https://www.infobae.com/espana/agencias/2026/06/28/temas-del-dia-de-efe-espana-del-lunes-29-de-junio-de-2026/' },
  { date: '06·29', tag: 'Economia', title: 'La inflació de juny es manté al 3,2% per tercer mes consecutiu', desc: 'L\'avanç de l\'IPC de juny confirma l\'estabilitat al 3,2%. La rebaixa fiscal sobre carburants s\'anirà reduint a partir de juliol fins a desaparèixer a l\'octubre.', url: 'https://www.infobae.com/espana/agencias/2026/06/28/temas-del-dia-de-efe-espana-del-lunes-29-de-junio-de-2026/' },
  { date: '06·29', tag: 'Internacional', title: 'Iran i els EUA obren sis dies de negociació per acabar el conflicte', desc: 'El cap de la diplomàcia iraniana destaca "progressos majors" gràcies a la mediació de Pakistan i Qatar. Les negociacions busquen un alto el foc i posar fi a l\'ofensiva a la zona.', url: 'https://cnnespanol.cnn.com/mundo' },
  { date: '06·29', tag: 'Internacional', title: 'Onada de calor a Europa: París activa alertes per temperatures extremes', desc: 'França viu una de les onades de calor més intenses de l\'estiu. Les autoritats de París han activat protocols d\'emergència i recomanen evitar l\'exposició solar durant les hores centrals.', url: 'https://cnnespanol.cnn.com/mundo' },
  { date: '06·29', tag: 'Esports', title: 'Mundial 2026: Brasil - Japó i Alemanya - Paraguai, partits de la jornada', desc: 'La fase de grups del Mundial 2026 continua avui als grups G i H. Espanya té programat el seu pròxim partit contra Àustria el 2 de juliol.', url: 'https://www.flashscore.es/futbol/mundial/campeonato-del-mundo/' },
  { date: '06·29', tag: 'Successos', title: 'Desarticulada una xarxa amb 12 plantacions de marihuana indoor a Tarragona', desc: 'Més de 350 agents de la Policia Nacional i els Mossos d\'Esquadra han desmantellat dotze plantacions en quinze entrades i registres a l\'entorn de Cabra del Camp.', url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-06-24/5931236-desmontada-red-12-plantaciones-marihuana-indoor-tarragona' },
  { date: '06·29', tag: 'Ciència', title: 'La COSCE atorga els Premis de Difusió de la Ciència 2026 en dues categories', desc: 'La Confederació de Societats Científiques d\'Espanya estrena les categories sènior (5.000 €) i jove (3.000 €) en la 19a edició dels seus premis de divulgació científica.', url: 'https://cosce.org/cosce-convoca-los-premios-a-la-difusion-de-la-ciencia-2026-por-primera-vez-en-dos-categorias/' },
  { date: '04·18', tag: 'LO 1/2026', title: 'Multireincidència — enduriment de furts i estafes lleus', desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026.', url: null },
  { date: '04·14', tag: 'RD 316/2026', title: 'Reforma del Reglament d\'Estrangeria', desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny.', url: null },
  { date: '03·28', tag: 'Circ. 2/2026', title: 'Instrucció sobre identificació i registre de persones', desc: 'Nova circular de la Fiscalia General sobre aplicació de l\'art. 20 LO 4/2015.', url: null },
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
        <SectionHead kicker="Actualitat" kickerColor={T.cat.operativa.solid} title="Última hora normativa" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.map((n, i) => (
            <div
              key={i}
              onClick={() => n.url && window.open(n.url, '_blank')}
              style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.operativa.solid}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
              {n.url && <div style={{ marginTop: 6, fontSize: 11, color: T.cat.operativa.solid, fontWeight: 700 }}>Llegir notícia →</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
