import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS } from '../data/noticias';

const CAT_ICON = {
  Política: 'landmark',
  Succès: 'siren',
  Internacional: 'globe',
  Cultura: 'star',
  Esports: 'trophy',
  Economia: 'trending-up',
};

function NoticiaCard({ n, onLink }) {
  const k = T.cat[n.catToken] || T.cat.operativa;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
      padding: '14px 14px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: k.ink,
          letterSpacing: 0.7, textTransform: 'uppercase',
          background: k.soft, padding: '3px 7px', borderRadius: T.r.pill,
        }}>{n.cat}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>{n.title}</div>
      <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5, marginBottom: 10 }}>{n.desc}</div>
      <button onClick={() => onLink(n.link)} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        color: k.solid, fontFamily: T.font, fontWeight: 700, fontSize: 12,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        Llegir notícia completa <Icon name="arrow-up-right" size={13} color={k.solid} />
      </button>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const today = NOTICIAS.length > 0 ? NOTICIAS[0].date : '';

  function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const dates = [...new Set(NOTICIAS.map(n => n.date))];

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <InfoPolWordmark height={18} />
        </div>
        <RoundIconBtn icon="bell" />
      </div>

      {/* header */}
      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · Catalunya · Espanya · Món
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.7, margin: 0, lineHeight: 1.05 }}>
          Notícies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Resum diari de les notícies més rellevants per a la feina policial i l'actualitat general.
        </p>
      </div>

      {/* category filter pills */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {['Tot', 'Política', 'Succès', 'Internacional', 'Cultura', 'Economia'].map(cat => {
          const catMap = { Política: 'operativa', Succès: 'alcohol', Internacional: 'atajos', Cultura: 'psico', Economia: 'leyes' };
          const k = cat === 'Tot' ? null : (T.cat[catMap[cat]] || T.cat.operativa);
          return (
            <span key={cat} style={{
              flexShrink: 0,
              padding: '6px 12px', borderRadius: T.r.pill,
              background: k ? k.soft : T.ink,
              color: k ? k.ink : '#fff',
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              letterSpacing: 0.3,
            }}>{cat}</span>
          );
        })}
      </div>

      {/* news by date */}
      {dates.map(date => (
        <div key={date} style={{ marginBottom: 20 }}>
          <SectionHead
            kicker="Avui"
            kickerColor={T.cat.operativa.solid}
            title={date.replace('·', ' de setembre')}
            style={{ marginBottom: 12 }}
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NOTICIAS.filter(n => n.date === date).map(n => (
              <NoticiaCard key={n.id} n={n} onLink={openLink} />
            ))}
          </div>
        </div>
      ))}

      {/* footer */}
      <div style={{ padding: '16px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Notícies actualitzades diàriament a les 22h · InfoPol
        </div>
      </div>
    </div>
  );
}
