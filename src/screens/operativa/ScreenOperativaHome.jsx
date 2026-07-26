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
  // 26 juliol 2026
  { date: '07·26', tag: 'Successos', title: 'Incendi Los Gallardos — dotze morts a Almeria', desc: 'Incendi forestal amb almenys 12 víctimes mortals. S\'investiga la caiguda d\'un cable elèctric com a causa.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  { date: '07·26', tag: 'Policia', title: 'Fugitiu reclamat per França — detingut en hotel de Barcelona', desc: 'El Grup de Fugitius de la Brigada Provincial deté el presumpte autor d\'un assassinat a trets a Toló. Extradició accelerada en curs.', url: 'https://www.moncloa.com/2026/07/25/detenido-fugitivo-asesinato-barcelona-3405245/' },
  { date: '07·26', tag: 'Judicial', title: 'Cas Begoña Gómez — Fiscalia reitera la petició d\'absolució', desc: 'El Ministeri Públic descarta corrupció o tràfic d\'influències. La sol·licitud afecta la cònjuge del president, la seva assessora i l\'empresari Barrabés.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  { date: '07·26', tag: 'Clima', title: 'Nova onada de calor — temperatures superiors a 40°C', desc: 'Juny 2026, el mes més calurós a l\'Europa Occidental, segons Copernicus. Temperatures que superen els 40°C amenacen àmplies zones d\'Espanya.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  { date: '07·26', tag: 'Premis', title: 'Premis Nacionals d\'Innovació 2026 — Almirall, gran empresa guanyadora', desc: 'El Ministeri de Ciència atorga el Premi Nacional d\'Innovació a Almirall, farmacèutica barcelonina referent mundial en dermatologia.', url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html' },
  { date: '07·26', tag: 'Internacional', title: 'Trump i l\'OTAN — Espanya "redimida" pel compromís en defensa', desc: 'Donald Trump afirma que Espanya s\'ha "redimit per complet" del seu compromís en defensa de l\'OTAN. El Govern nega qualsevol pagament addicional.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  { date: '07·26', tag: 'Economia', title: 'Decret llei de lloguers — pròrrogues i regulació del lloguer de temporada', desc: 'El Govern prepara mesures per contenir l\'escalada de rendes: pròrrogues fins al juny de 2028, regulació del lloguer de temporada i habitacions.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  { date: '07·26', tag: 'Internacional', title: 'Illa a Vietnam — gira asiàtica per internacionalitzar Catalunya', desc: 'El president de la Generalitat visita Da Nang per reforçar les relacions comercials de Catalunya amb el sud-est asiàtic.', url: 'https://es.euronews.com/video/2026/07/26/ultimas-noticias-26-julio-2026-manana' },
  { date: '07·26', tag: 'Internacional', title: 'Tifó Noul — s\'apropa a la costa sud-oriental de la Xina', desc: 'El tifó avança entre Cantó i Fujian. Les autoritats xineses activen protocols d\'emergència a les zones costaneres afectades.', url: 'https://www.infobae.com/america/agencias/2026/07/26/domingo-26-de-julio-de-2026-0200-gmt/' },
  { date: '07·26', tag: 'Política', title: 'PP paralitza el Tractat d\'Amistat amb França', desc: 'El Senat, a instàncies del PP, remet el Tractat d\'Amistat amb França al Tribunal Constitucional, obrint un nou front en política exterior.', url: 'https://www.periodistadigital.com/periodismo/20260726/10-claves-politicas-periodisticas-marcan-domingo-26-julio-2026-espana-noticia-689405232788/' },
  // Normativa anterior
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
              {n.url && (
                <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700, color: T.cat.operativa.solid, textDecoration: 'none' }}>
                  Llegir + →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
