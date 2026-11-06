import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, Pill } from '../../components/Shared';
import { NOTICIAS, CAT_NOTICIA_COLOR } from '../../data/noticias';

function formatData(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ScreenNoticiaDetall() {
  const { id } = useParams();
  const navigate = useNavigate();
  const noticia = NOTICIAS.find(n => n.id === id);

  if (!noticia) {
    return (
      <div className="screen-no-tabs" style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, color: T.ink }}>Notícia no trobada</div>
          <button onClick={() => navigate('/noticias')} style={{
            marginTop: 16, padding: '10px 20px', borderRadius: T.r.pill,
            background: T.cat.leyes.solid, color: '#fff', border: 'none',
            fontFamily: T.font, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Tornar</button>
        </div>
      </div>
    );
  }

  const colorKey = CAT_NOTICIA_COLOR[noticia.cat] || 'operativa';
  const k = T.cat[colorKey];

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 48 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 999, border: 'none',
              background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}
          >
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
            letterSpacing: 1.1, textTransform: 'uppercase', color: k.ink,
          }}>Notícies</div>
        </div>

        {/* pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <Pill bg={k.soft} fg={k.ink} size={11}>{noticia.categoria}</Pill>
          <Pill bg={T.hairline} fg={T.inkMuted} size={11}>{noticia.zona}</Pill>
        </div>

        {/* title */}
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24,
          letterSpacing: -0.6, lineHeight: 1.15, color: T.ink,
          margin: '0 0 12px',
        }}>{noticia.titol}</h1>

        {/* meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: T.font, fontSize: 12, color: T.inkMuted,
        }}>
          <Icon name="calendar" size={13} color={T.inkMuted} />
          <span>{formatData(noticia.data)}</span>
          <span style={{ color: T.hairlineStrong }}>·</span>
          <Icon name="newspaper" size={13} color={T.inkMuted} />
          <span>{noticia.font}</span>
        </div>
      </div>

      {/* separator */}
      <div style={{ height: 1, background: T.hairline, margin: '0 18px 20px' }} />

      {/* body */}
      <div style={{ padding: '0 18px' }}>
        <p style={{
          fontFamily: T.font,
          fontSize: 15,
          lineHeight: 1.7,
          color: T.inkSoft,
          margin: 0,
        }}>{noticia.resum}</p>
      </div>

      {/* link original */}
      <div style={{ padding: '24px 18px 0' }}>
        <div style={{
          background: '#fff',
          borderRadius: T.r.lg,
          padding: 16,
          boxShadow: T.shadow.card,
          borderTop: `3px solid ${k.solid}`,
        }}>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 11,
            letterSpacing: 1.2, textTransform: 'uppercase',
            color: T.inkMuted, marginBottom: 10,
          }}>Notícia completa</div>
          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px',
              background: k.soft,
              borderRadius: T.r.md,
              textDecoration: 'none',
              color: k.ink,
              fontFamily: T.font, fontWeight: 700, fontSize: 13,
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <Icon name="external-link" size={16} color={k.solid} />
              <span style={{
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>Llegir a {noticia.font}</span>
            </div>
            <Icon name="arrow-right" size={16} color={k.solid} style={{ flexShrink: 0 }} />
          </a>
          <div style={{
            marginTop: 10, fontSize: 11, color: T.inkFaint, fontFamily: T.font,
            lineHeight: 1.4,
          }}>
            Contingut proporcionat per tercers. InfoPol no és responsable del contingut extern.
          </div>
        </div>
      </div>
    </div>
  );
}
