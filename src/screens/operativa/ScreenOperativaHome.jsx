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

// cat: leyes=polític/legal · operativa=succés/seguretat · transito=esports · academia=economia/ciència
const NEWS_GENERAL = [
  { date: '08·19', cat: 'operativa', tag: 'Succés · Cat', title: 'Mossos disparen contra un multireincident que intenta atropellar agents a l\'Hospitalet', desc: 'Un conductor amb antecedents va intentar atropellar agents de la Guàrdia Urbana i Mossos durant un control. Els agents van obrir foc en defensa pròpia.', url: 'https://www.youtube.com/watch?v=DuBTy0GqNwM' },
  { date: '08·19', cat: 'leyes', tag: 'Política · Cat', title: 'Baròmetre CEO: PSC es manté líder, Aliança Catalana puja i Junts baixa', desc: 'El primer sondeig de 2026 del Centre d\'Estudis d\'Opinió dibuixa un nou escenari polític: l\'ascens meteòric d\'Aliança Catalana sacseja el Parlament.', url: 'https://www.elnacional.cat/es' },
  { date: '08·19', cat: 'leyes', tag: 'Política · Cat', title: 'Junts demana la dimissió de Paneque i Nadal pel socavó del Putxet', desc: 'El despreniment ha obligat a desallotjar 93 habitatges al barri barceloní. Junts exigeix responsabilitats polítiques immediates a l\'Ajuntament.', url: 'https://www.elnacional.cat/es' },
  { date: '08·19', cat: 'operativa', tag: 'Política · Esp', title: 'Crisi a Ceuta: 60.000 persones creuen la frontera en dies', desc: 'Sánchez demana una reunió d\'urgència dels ministres d\'Interior de la UE. Marroc nega haver relaxat deliberadament els controls fronterers.', url: 'https://www.infobae.com/espana/2026/08/02/la-crisis-de-ceuta-en-cinco-claves-de-las-falsas-promesas-de-asilo-a-la-avalancha-de-60000-personas-y-el-papel-de-marruecos/' },
  { date: '08·19', cat: 'academia', tag: 'Economia · Esp', title: 'El 52,5% dels espanyols retalla la cistella de la compra per la pujada de preus', desc: 'La inflació persisteix i afecta el consum de les llars. La crisi forrajera al nord per la sequera agreuja la situació del sector ramader.', url: 'https://www.periodistadigital.com/periodismo/20260819/espana-amanece-calor-extremo-incendios-ceuta-granada-futbol-estreno-noticia-689405239189/' },
  { date: '08·18', cat: 'transito', tag: 'Esports', title: 'Oficial: el Barça fitxa Rodri per 10 M€ — campió del món i Baló d\'Or 2024', desc: 'El migcampista de la selecció espanyola signa fins al 2030 procedent del Manchester City. Va rebutjar el Reial Madrid per apostar pel projecte de Flick.', url: 'https://cronicaglobal.elespanol.com/culemania/primer-equipo/20260818/oficial-barca-gran-golpe-anuncia-fichaje-rodri/1003742787586_0.html' },
  { date: '08·19', cat: 'transito', tag: 'Esports', title: 'Tenis: eliminació per marejos al Masters 1.000 de Cincinnati', desc: 'Un tennista va haver d\'abandonar el torneig per dificultats respiratòries i marejos durant el partit en plena onada de calor.', url: 'https://www.elnacional.cat/es/deportes.html' },
  { date: '08·19', cat: 'leyes', tag: 'Internacional', title: 'La UE dóna suport a la Cort Penal Internacional davant la pressió dels EUA', desc: 'La Unió Europea reafirma el seu compromís amb el dret internacional i planta cara a les pressions nord-americanes sobre la CPI.', url: 'https://es.euronews.com/video/2026/08/19/ultimas-noticias-19-agosto-2026-tarde' },
  { date: '08·19', cat: 'operativa', tag: 'Internacional', title: 'EAU suspèn el comerç amb l\'Iran per l\'atac amb míssil balístic', desc: 'Els Emirats Àrabs Units han anunciat la suspensió de totes les relacions comercials amb Iran en resposta al llançament d\'un míssil balístic.', url: 'https://es.euronews.com/video/2026/08/19/ultimas-noticias-19-agosto-2026-tarde' },
  { date: '08·19', cat: 'academia', tag: 'Ciència', title: 'Premis Fronteres del Coneixement XVIII: grafè, CAR-T i criptografia quàntica', desc: 'La FBBVA reconeix 10 personalitats per descobriments com l\'angle màgic del grafè, la immunoteràpia CAR-T i avenços en criptografia postquàntica.', url: 'https://www.elespanol.com/ciencia/investigacion/20260618/premios-fronteras-ensalzan-poder-unificador-ciencia-cultura-frente-mundo-marcado-incertidumbre/1003744288962_0.html' },
  { date: '08·19', cat: 'academia', tag: 'Ciència · Premi', title: 'Premi Nacional de Recerca: Ángel Carracedo per medicina forense i genòmica', desc: 'El catedràtic de la Universitat de Santiago de Compostela rep el Premi Gregorio Marañón per la seva trajectòria pionera en genètica forense.', url: 'https://www.consalud.es/profesionales/espana-premia-la-excelencia-cientifica-de-20-investigadores-y-marca-un-hito-en-el-talento-joven-femenino.html' },
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

      {/* Notícies del dia */}
      <div style={{ padding: '18px 0 24px' }}>
        <SectionHead kicker="19 agost 2026" kickerColor={T.cat.leyes.solid} title="Notícies del dia" action="Tot →" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NEWS_GENERAL.map((n, i) => {
            const k = T.cat[n.cat] || T.cat.operativa;
            return (
              <div key={i} style={{ background: '#fff', borderRadius: T.r.md, padding: 14, borderLeft: `2px solid ${k.solid}`, boxShadow: T.shadow.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: k.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>{n.tag}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
                {n.url && (
                  <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, color: k.solid, fontWeight: 700, fontSize: 11.5, textDecoration: 'none' }}>
                    Llegir notícia <Icon name="arrow-right" size={12} color={k.solid} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
