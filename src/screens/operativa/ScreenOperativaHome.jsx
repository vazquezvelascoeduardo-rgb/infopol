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
  { date: '09·20', tag: 'Política · CAT', title: 'Govern celebra dos anys — desplegament per Catalunya', desc: 'Els consellers recorren el territori reivindicant la finançació singular de 4.700 M€ anuals.', url: 'https://www.moncloa.com/2026/09/19/govern-cataluna-consellers-financiacion-singular-3434438' },
  { date: '09·20', tag: 'Política · ESP', title: 'Sánchez presenta el pla IA360 — IA responsable', desc: 'El president del Govern anuncia el pla de desplegament responsable de la intel·ligència artificial a l\'administració.', url: 'https://www.lanocion.es/espanya/20260920/espanya-cierra-el-domingo-entre-pulso-politico-ten-9z8bc.html' },
  { date: '09·20', tag: 'Economia · ESP', title: 'L\'economia espanyola creixerà un 2,5% el 2026', desc: 'Dues dècimes per sobre de les estimacions, impulsada pel consum privat i les exportacions de serveis.', url: 'https://www.cronista.com/espana/economia-finanzas/buenas-noticias-para-los-espanoles-la-economia-crecera-mas-de-lo-esperado-en-2026/' },
  { date: '09·20', tag: 'Esports', title: 'MotoGP GP d\'Àustria — Dèrbi madrileny i Supercopa Endesa', desc: 'Jornada plena: MotoGP a les 14h, Atlètic-Madrid a les 16:15h, Copa Davis Espanya-Xile 17h i Joventut-Barça 19h.', url: 'https://donporque.com/que-deportes-ver-hoy-20-de-septiembre/' },
  { date: '09·20', tag: 'Judicial · CAT', title: 'Judici als 4 agents de Policia pel cas Roger Español (1-O)', desc: 'La Fiscalia demana l\'absolució; les acusacions populars reclamen 13 anys per tortures. Amnistia Internacional observa el procés.', url: 'https://www.moncloa.com/2026/09/14/juicio-policias-1-o-fiscalia-3431141' },
  { date: '09·20', tag: 'Seguretat · CAT', title: 'Delictes a Catalunya cauen un 8,4% fins a l\'agost', desc: '361.074 fets delictius registrats el 2026, la xifra més baixa dels últims tres anys per al mateix període.', url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-09-19/6016129-delitos-caen-84-catalunya-hasta-agosto-361074-casos-registrados' },
  { date: '09·20', tag: 'Policial · CAT', title: 'Detingut a Barcelona per tràfic de 410 kg de cànnabis', desc: 'La Policia Nacional deté un home de 25 anys reclamat per la justícia suïssa mitjançant ordre europea de detenció.', url: 'https://www.moncloa.com/2026/09/19/policia-nacional-fugitivo-barcelona-cannabis-3434391' },
  { date: '09·20', tag: 'Ciència', title: 'Premis Ig Nobel 2026 — cerimònia a Zuric', desc: 'La ciència més insòlita premiada: estudis sobre bessons entre espècies i 1.000 calçotets enterrats en 25 països.', url: 'https://www.que.es/2026/09/05/premios-ig-nobel-2026-ganadores/' },
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
        <SectionHead kicker="Actualitat" kickerColor={T.cat.operativa.solid} title="Última hora normativa" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.map((n, i) => (
            <div key={i} onClick={() => n.url && window.open(n.url, '_blank')} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.operativa.solid}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
              {n.url && <div style={{ fontSize: 10.5, color: T.cat.operativa.solid, marginTop: 6, fontWeight: 700 }}>Llegir notícia →</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
