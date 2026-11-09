import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn } from '../components/Shared';
import { NOTICIAS } from '../data/noticias';

const CAT_ICONS = {
  'Política': 'scale',
  'Seguretat': 'siren',
  'Legal': 'book',
  'Economia': 'chart',
  'Esports': 'trophy',
  'Ciència': 'bolt',
  'Cultura': 'star',
  'Internacional': 'map',
};

function getIcon(cat) {
  const key = Object.keys(CAT_ICONS).find(k => cat.startsWith(k));
  return CAT_ICONS[key] || 'bolt';
}

function NoticiaCard({ noticia }) {
  const k = T.cat[noticia.color] || T.cat.operativa;
  const icon = getIcon(noticia.cat);

  function handleOpen() {
    if (noticia.link) window.open(noticia.link, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      onClick={handleOpen}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: noticia.link ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: k.solid, letterSpacing: 0.6, textTransform: 'uppercase', flex: 1 }}>
          {noticia.cat}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{noticia.date}</span>
        {noticia.link && <Icon name="arrow-right" size={13} color={T.inkMuted} />}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{noticia.title}</div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.4 }}>{noticia.desc}</div>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();

  const dates = [...new Set(NOTICIAS.map(n => n.date))];

  const dateLabel = (d) => {
    const [m, day] = d.split('·');
    const months = ['Gen','Feb','Mar','Abr','Mai','Jun','Jul','Ago','Set','Oct','Nov','Des'];
    return `${parseInt(day)} ${months[parseInt(m) - 1]}`;
  };

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
        <InfoPolWordmark height={18} />
      </div>

      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 4 }}>
          Catalunya · España · Internacional
        </div>
      </div>

      {dates.map(date => (
        <div key={date} style={{ padding: '0 0 16px' }}>
          <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: T.fontMono, fontWeight: 700, fontSize: 11, color: T.inkMuted, letterSpacing: 0.5 }}>
              {dateLabel(date)}
            </div>
            <div style={{ flex: 1, height: 1, background: T.hairline }} />
          </div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {NOTICIAS.filter(n => n.date === date).map((n, i) => (
              <NoticiaCard key={i} noticia={n} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
