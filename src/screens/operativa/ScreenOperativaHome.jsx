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
  { date: '08·13', tag: 'CIÈNCIA', title: 'Eclipse solar total — primer des de 1905 visible a Espanya peninsular', desc: 'La franja de totalitat va creuar ahir la meitat nord de la Península. La propera oportunitat no arribarà fins al 2180.', url: 'https://es.wikipedia.org/wiki/Eclipse_solar_del_12_de_agosto_de_2026' },
  { date: '08·13', tag: 'MOSSOS', title: '700 Mossos desplegats per l\'eclipse — operació per terra, mar i aire', desc: 'Dispositiu coordinat des de Reus per gestionar les 50.000 persones concentrades al Camp de Tarragona, Terres de l\'Ebre i Ponent.', url: 'https://www.moncloa.com/2026/08/11/mossos-dispositivo-eclipse-solar-cataluna-3413790' },
  { date: '08·13', tag: 'POLÍTICA', title: 'Catalunya es nega a acollir més menors migrants — Ceuta en situació crítica', desc: 'Estarellas afirma que el Govern no pot assumir més acollides mentre continuïn arribant pasteres. Dimecres va arribar una embarcació amb 14 menors a Formentera.', url: 'https://www.elespanol.com/espana/politica/20260813/ultima-hora-politica-directo-infancia-reune-comunidades-aprobar-presupuesto-millones-acogida-menores-ceuta/1003744351777_10.html' },
  { date: '08·13', tag: 'POLÍTICA', title: 'Marroc amenaça suspendre el conveni d\'extradició — IU alerta del risc per a la sobirania', desc: 'Antonio Maíllo (IU) adverteix que la sobirania espanyola "està en perill" davant l\'escalada marroquina contra la regularització de migrants.', url: 'https://www.elespanol.com/espana/politica/20260813/ultima-hora-politica-directo-infancia-reune-comunidades-aprobar-presupuesto-millones-acogida-menores-ceuta/1003744351777_10.html' },
  { date: '08·13', tag: 'ECONOMIA', title: 'Gasoil +15,7% interanual el juliol — s\'activen les mesures del decret anticrisi', desc: 'El preu del gasoil supera el llindar del 15% del decret de contenció per la guerra de l\'Iran. El PIB espanyol creixerà un 2,5% el 2026, per sobre de l\'eurozona.', url: 'https://www.eleconomista.es/' },
  { date: '08·13', tag: 'ECONOMIA', title: 'Rècord de baixes voluntàries — 1,54 milions en el primer semestre de 2026', desc: 'Al juny es van registrar 323.455 baixes voluntàries a la SS, un 3,9% més interanual. La xifra és la més alta des que hi ha registres.', url: null },
  { date: '08·13', tag: 'ESPORTS', title: 'Espanya, campiona del Món 2026 — Ferrán Torres, l\'heroi del Mundial', desc: 'La selecció espanyola es va proclamar campiona de la FIFA World Cup 2026 el 19 de juliol. Els clubs han reprès la pretemporada en ple agost.', url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/espana-triunfa-en-un-mundial-pionero' },
  { date: '08·13', tag: 'ESPORTS', title: 'Trofeu Joan Gamper el 19 d\'agost — FC Barcelona vs Al Ahly al Camp Nou', desc: 'Últim examen de pretemporada del Barça abans del debut a LaLiga el 23 d\'agost. El club torna amb el bicampionat de Lliga i la Supercopa d\'Espanya.', url: 'https://www.fcbarcelona.es/es/futbol/primer-equipo/noticias/' },
  { date: '08·13', tag: 'JUDICIAL', title: '5 anys de presó per violació en un bar de Pamplona — sentència del 10 d\'agost', desc: 'L\'Audiència Provincial de Navarra condemna un home per violar una coneguda als lavabos d\'un local. El tribunal va valorar la declaració de la víctima com a plenament creïble.', url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/' },
  { date: '08·13', tag: 'INTERNACIONAL', title: 'Iran reestructura el comandament militar amb "doctrina ofensiva" — tensió a l\'Estret d\'Ormuz', desc: 'Tehran nomena generals del CGRI amb posicions dures. S\'obren converses via mediadors per un acord provisional amb els EUA.', url: 'https://www.justsecurity.org/153621/early-edition-august-13-2026/' },
  { date: '08·13', tag: 'INTERNACIONAL', title: 'Colòmbia autoritza operacions militars dels EUA contra càrtels en territori colombià', desc: 'Pete Hegseth celebra l\'adhesió de Colòmbia a la coalició antidroga de les Amèriques. Es preveu presència militar nord-americana per a operacions conjuntes.', url: 'https://havanatimes.org/news/international-news-briefs-for-thursday-august-13-2026/' },
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
