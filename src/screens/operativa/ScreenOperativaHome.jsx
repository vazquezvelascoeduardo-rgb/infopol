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
  { date: '07·24', tag: 'Emergència', title: 'Emergència nacional per incendis a la Serra Oest de Madrid — +10.000 evacuats', desc: 'Tres incendis actius a la Comunitat de Madrid es fusionen en un sol front (#IFSierraOeste). L\'executiu declara emergència d\'interès nacional.', url: 'https://www.comunidad.madrid/noticias/2026/07/23/comunidad-madrid-vive-situacion-critica-incendios-forestales-multiples-extrema-gravedad' },
  { date: '07·24', tag: 'Internacional', title: 'Trump amenaça d\'usar actius iranians congelats per indemnitzar danys al Golf Pèrsic', desc: 'Els EUA consideren mobilitzar reserves iranianes bloquejades com a represàlia pels atacs a vaixells. L\'Iran ho qualifica de \'precedent incendiari\'.', url: 'https://www.infobae.com/america/agencias/2026/07/24/viernes-24-de-julio-de-2026-0700-gmt/' },
  { date: '07·24', tag: 'Justícia Int.', title: 'La CPI vota a Nova York la possible destitució del fiscal Karim Khan', desc: 'Els estats membres del Tribunal Penal Internacional decideixen sobre la dimissió forçada del fiscal en cap, acusat de conducta sexual indeguda.', url: 'https://es.euronews.com/2026/07/24/euronews-hoy-las-noticias-del-jueves-24-de-julio-los-peores-incendios-de-la-comunidad-de-m' },
  { date: '07·23', tag: 'Successos', title: 'Desarticulat a Catalunya un clan familiar per tràfic d\'armes de guerra', desc: 'Operació conjunta Mossos-Policia Nacional. Comissats un llançagranades, 45 pistoles i diverses granades. La xarxa proveïa el crim organitzat arreu d\'Europa.', url: 'https://www.moncloa.com/2026/07/23/desarticulado-clan-familiar-trafico-armas-cataluna-3404132/' },
  { date: '07·21', tag: 'Successos', title: 'Home punxalat al Somorrostro de Barcelona tot trencant una ordre d\'allunyament', desc: 'La víctima va ser agredida amb arma blanca per una persona que hauria vulnerat una ordre judicial de distanciament. Els Mossos investiguen el cas.', url: 'https://www.catalunyapress.es/articulo/sucesos-cataluna/2026-07-21/5960037-apunalado-hombre-sorromostro-despues-quebrantar-supuestamente-orden-alejamiento' },
  { date: '07·19', tag: 'Esports', title: 'Espanya, campiona del món 2026 — Yamal fa història als 19 anys', desc: 'La Roja s\'imposa a l\'Argentina en la final del Mundial amb un gol de Ferran Torres a la pròrroga. Lamine Yamal, el quart campió del món més jove de la història.', url: 'https://www.elfinanciero.com.mx/deportes/mundial-2026/2026/07/19/espana-vs-argentina-en-vivo-quien-es-el-campeon-de-la-copa-del-mundo/' },
  { date: '07·14', tag: 'Ciència', title: 'Almirall (Barcelona) rep el Premi Nacional d\'Innovació 2026 a Gran Empresa', desc: 'El Ministeri de Ciència distingeix el laboratori farmacèutic barceloní per la seva trajectòria en dermatologia mèdica i inversió en R+D de més de 2.000 M€.', url: 'https://www.ciencia.gob.es/Noticias/2026/julio/Morant-llamada-premios-nacionales-innovacion-diseno-2026.html' },
  { date: '07·09', tag: 'Política Cat.', title: 'Baròmetre CEO juliol: PSC perd escons i Aliança Catalana desbanca Junts', desc: 'Primer baròmetre del CEO del 2026: el PSC d\'Illa cedeix terreny, ERC remunta i Aliança Catalana es consolida com a tercera força al Parlament.', url: 'https://www.cope.es/emisoras/catalunya/noticias/ceo-dibuja-nuevo-escenario-politico-psc-pierde-fuelle-alianca-catalana-dispara-hunde-junts-20260709_3401900.html' },
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

      {/* Actualitat */}
      <div style={{ padding: '14px 0 0' }}>
        <SectionHead kicker="Actualitat" kickerColor={T.cat.operativa.solid} title="Última hora" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS.map((n, i) => (
            <div key={i} onClick={n.url ? () => window.open(n.url, '_blank', 'noopener,noreferrer') : undefined} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${T.cat.operativa.solid}`, boxShadow: T.shadow.card, cursor: n.url ? 'pointer' : 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: T.cat.operativa.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
              {n.url && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: T.cat.operativa.solid }}>Llegir notícia →</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
