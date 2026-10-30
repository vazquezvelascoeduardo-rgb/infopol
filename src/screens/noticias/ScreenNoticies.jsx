import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark, RoundIconBtn } from '../../components/Shared';

const CAT_CONFIG = {
  policial:      { label: 'Policial',      color: T.cat.alcohol,   icon: 'shield' },
  successos:     { label: 'Successos',     color: T.cat.transito,  icon: 'siren' },
  economia:      { label: 'Economia',      color: T.cat.leyes,     icon: 'briefcase' },
  esports:       { label: 'Esports',       color: T.cat.atajos,    icon: 'trophy' },
  internacional: { label: 'Internacional', color: T.cat.physical,  icon: 'map' },
  cultura:       { label: 'Cultura',       color: T.cat.psico,     icon: 'star' },
};

const FILTERS = [
  { id: 'tot', label: 'Tot' },
  { id: 'policial', label: 'Policial' },
  { id: 'successos', label: 'Successos' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'cultura', label: 'Cultura' },
];

const NEWS = [
  {
    id: 'n010',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Policial · Catalunya',
    cat: 'policial',
    title: 'Assassinat a l\'Hospital Joan XXIII de Tarragona',
    desc: 'Un home armat va entrar al centre durant la matinada i va matar a trets un pacient. Els Mossos investiguen vincles amb el crim organitzat i un tiroteig previ. Els sindicats reclamen presència policial als centres sanitaris.',
    url: 'https://www.cope.es/emisoras/catalunya/tarragona-provincia/tarragona/noticias/asesinato-hospital-joan-xxiii-tarragona-destapa-creciente-inseguridad-sindicatos-exigen-policia-centros-20261030_3466199.html',
  },
  {
    id: 'n011',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Economia · Espanya',
    cat: 'economia',
    title: 'La Cambra d\'Espanya preveu creixement del 2,5% i inflació del 3,2%',
    desc: 'La Cambra de Comerç eleva la previsió de creixement al 2,5% per al 2026 i adverteix que la inflació podria mantenir-se prop del 4% els propers mesos. El PIB del tercer trimestre es publica avui.',
    url: 'https://www.infobae.com/espana/agencias/2026/10/30/la-camara-de-espana-preve-un-crecimiento-del-25-para-2026-y-una-inflacion-del-32/',
  },
  {
    id: 'n012',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Internacional · Defensa',
    cat: 'internacional',
    title: 'EEUU i Japó acorden producció conjunta de míssils per als F-35',
    desc: 'Hegseth i Koizumi han signat l\'acord a Cebú per reforçar la defensa al Pacífic. L\'aliança preveu la producció conjunta de míssils de llarg abast per als caces de cinquena generació.',
    url: 'https://www.infobae.com/america/mundo/',
  },
  {
    id: 'n013',
    date: '2026-10-30',
    dateLabel: '10·30',
    tag: 'Internacional · Salut',
    cat: 'internacional',
    title: 'Indonèsia: 300.000 afectats per infecció respiratòria pels incendis de Borneo',
    desc: 'El fum dels incendis forestals ha causat una crisi sanitària amb més de 300.000 casos registrats. Les autoritats han declarat l\'emergència a diverses províncies de Kalimantan.',
    url: 'https://www.infobae.com/america/mundo/',
  },
  {
    id: 'n009',
    date: '2026-10-29',
    dateLabel: '10·29',
    tag: 'Policial · Catalunya',
    cat: 'policial',
    title: 'Disturbis Blocus a Barcelona: 133 detinguts, 85 menors',
    desc: 'Els Mossos anticipen nous aldarulls el 31 d\'octubre. La darrera onada va deixar 133 detinguts —85 menors— i 23 comerços danyats. Al novembre s\'activarà el Pla Proa contra bandes juvenils violentes.',
    url: 'https://www.moncloa.com/2026/10/29/disturbios-blocus-barcelona-31-octubre-3457427/',
  },
  {
    id: 'n008',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Succés · Espanya',
    cat: 'successos',
    title: 'Xoc de trens a Urda (Toledo): 69 morts i desenes de ferits',
    desc: 'Col·lisió frontal entre un AVE de Renfe i un Iryo. 69 morts confirmats, 50+ ferits, 15 en UCI. L\'alta velocitat Madrid–Andalusia va quedar suspesa. La investigació policial cerca les causes.',
    url: 'https://www.cope.es/programas/herrera-en-cope/al-minuto/ultima-hora-accidente-ferroviario-urda-toledo-decenas-victimas-heridos-investigacion-marcha-20261029_3464690.html',
  },
  {
    id: 'n007',
    date: '2026-10-28',
    dateLabel: '10·28',
    tag: 'Ciència · Espanya',
    cat: 'cultura',
    title: 'Premis Nacionals de Recerca 2026 a Vitòria-Gasteiz',
    desc: 'El Rei Felip VI va lliurar 20 guardons de 30.000 euros cadascun. El Premi Santiago Ramón y Cajal de Biologia va recaure en Crisanto Gutiérrez Armenta. Primera vegada que la cerimònia se celebra al País Basc.',
    url: 'https://www.moncloa.com/2026/10/28/premios-nacionales-investigacion-vitoria-3456767',
  },
  {
    id: 'n006',
    date: '2026-10-27',
    dateLabel: '10·27',
    tag: 'Economia · Catalunya',
    cat: 'economia',
    title: 'Catalunya creixerà un 2,6% el 2026 impulsada pel turisme',
    desc: 'La Generalitat eleva la previsió de creixement tres dècimes respecte a la primavera. El turisme compensa l\'estancament de les exportacions de béns. Inflació prevista: 3,7%.',
    url: 'https://www.cronicaglobal.cat/negocis/20261027/catalunya-creix-ritme-turisme-exportacions-sestanquen/1003742806608_0.html',
  },
  {
    id: 'n005',
    date: '2026-10-25',
    dateLabel: '10·25',
    tag: 'Esports · LaLiga',
    cat: 'esports',
    title: 'Barça 1-2 Reial Madrid: el Clàssic trenca l\'imbatibilitat blaugrana',
    desc: 'Mbappé va marcar dos gols al Camp Nou (j.10 LaLiga). El Madrid s\'apodera del liderat provisional. El conjunt blanc tanca octubre amb cinc victòries consecutives entre lliga i Champions League.',
    url: 'https://www.clarosports.com/futbol/laliga/barcelona-vs-real-madrid-en-vivo-laliga-2026-resultado-y-goles-de-la-jornada-10/',
  },
  {
    id: 'n004',
    date: '2026-10-23',
    dateLabel: '10·23',
    tag: 'Premis · Cultura',
    cat: 'cultura',
    title: 'Premis Princesa d\'Astúries 2026: Premi de Recerca per la seqüenciació de l\'ADN',
    desc: 'Klenerman, Balasubramanian i Mayer han rebut el premi pel seu treball pioner en seqüenciació del genoma. Christina Koch ha obtingut el Premi de la Concòrdia. Cerimònia a Oviedo.',
    url: 'https://www.vozpopuli.com/altavoz/cultura/estos-son-todos-los-ganadores-de-los-premios-princesa-de-asturias-2026.html',
  },
  {
    id: 'n001',
    date: '2026-04-18',
    dateLabel: '04·18',
    tag: 'LO 1/2026',
    cat: 'policial',
    title: 'Multireincidència — enduriment de furts i estafes lleus',
    desc: 'Reforma del CP i la LECrim. Vigent des del 10 d\'abril de 2026. Afecta l\'art. 22.8 CP i els arts. 468-470 LECrim.',
    url: null,
  },
  {
    id: 'n002',
    date: '2026-04-14',
    dateLabel: '04·14',
    tag: 'RD 316/2026',
    cat: 'policial',
    title: 'Reforma del Reglament d\'Estrangeria',
    desc: 'Dues figures noves d\'arrelament social. Termini de regularització fins al 30 de juny de 2026.',
    url: null,
  },
  {
    id: 'n003',
    date: '2026-03-28',
    dateLabel: '03·28',
    tag: 'Circ. 2/2026',
    cat: 'policial',
    title: 'Instrucció sobre identificació i registre de persones',
    desc: 'Nova circular de la Fiscalia General sobre l\'aplicació de l\'art. 20 LO 4/2015.',
    url: null,
  },
];

function NewsCard({ item }) {
  const cfg = CAT_CONFIG[item.cat] || CAT_CONFIG.policial;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md,
      padding: 14, borderLeft: `3px solid ${cfg.color.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: cfg.color.solid,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{item.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.dateLabel}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>{item.desc}</div>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 8, fontSize: 11.5, fontWeight: 700,
          color: cfg.color.solid, textDecoration: 'none',
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={cfg.color.solid} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('tot');

  const filtered = activeFilter === 'tot' ? NEWS : NEWS.filter(n => n.cat === activeFilter);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <InfoPolWordmark height={17} />
      </div>

      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          Actualitat · 30 oct 2026
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0, color: T.ink }}>
          Noticies
        </h1>
        <p style={{ fontSize: 13, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Category filter chips */}
      <div style={{ overflowX: 'auto', paddingLeft: 16, paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, paddingRight: 16, width: 'max-content' }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.id;
            const cfg = f.id !== 'tot' ? CAT_CONFIG[f.id] : null;
            const activeColor = cfg ? cfg.color.solid : T.cat.noticias.solid;
            const activeSoft = cfg ? cfg.color.soft : T.cat.noticias.soft;
            const activeInk = cfg ? cfg.color.ink : T.cat.noticias.ink;
            return (
              <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                padding: '7px 14px', borderRadius: 999, border: 'none',
                background: isActive ? activeColor : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                boxShadow: isActive ? 'none' : T.shadow.card,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '30px 0' }}>
            No hi ha noticies en aquesta categoria.
          </div>
        )}
        {filtered.map(item => <NewsCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
