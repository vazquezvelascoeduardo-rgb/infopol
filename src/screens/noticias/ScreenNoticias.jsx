import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import { StatusBar, InfoPolWordmark, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS } from '../../data/noticias';

const GEO_COLORS = {
  Catalunya:     { bg: '#FBE7C2', fg: '#6B3F08' },
  Espanya:       { bg: '#D8E2FE', fg: '#0E2B7A' },
  Internacional: { bg: '#CDF0E1', fg: '#0B5A3D' },
};

const TAG_ICONS = {
  'Política':      '🏛',
  'Economia':      '📈',
  'Esports':       '⚽',
  'Cultura':       '🎭',
  'Policial':      '🚔',
  'Legal':         '⚖️',
  'Internacional': '🌍',
  'Descobriments': '🔬',
  'Premis':        '🏆',
};

const GEO_FILTERS = ['Tot', 'Catalunya', 'Espanya', 'Internacional'];

function NoticiaCard({ n }) {
  const geo = GEO_COLORS[n.geo] || { bg: T.cat.noticias.soft, fg: T.cat.noticias.ink };
  const icon = TAG_ICONS[n.tag] || '📰';

  function handleClick() {
    if (n.url) window.open(n.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `2px solid ${T.cat.noticias.solid}`,
        boxShadow: T.shadow.card,
        cursor: n.url ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: T.cat.noticias.solid, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {icon} {n.tag}
        </span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
          background: geo.bg, color: geo.fg, marginLeft: 2,
        }}>
          {n.geo}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {n.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</div>
      {n.url && (
        <div style={{ marginTop: 7, fontSize: 11, color: T.cat.noticias.solid, fontWeight: 700 }}>
          Llegir article complet →
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [geo, setGeo] = useState('Tot');

  const filtered = geo === 'Tot' ? NOTICIAS : NOTICIAS.filter(n => n.geo === geo);

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          Actualitzat diàriament · 22:00
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24, letterSpacing: -0.6, margin: 0 }}>
          Notícies
        </h1>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4 }}>
          Política · Economia · Esports · Cultura · Policial
        </div>
      </div>

      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {GEO_FILTERS.map(g => (
          <button
            key={g}
            onClick={() => setGeo(g)}
            style={{
              background: geo === g ? T.cat.noticias.solid : T.cat.noticias.soft,
              color: geo === g ? '#fff' : T.cat.noticias.ink,
              border: 'none', borderRadius: 999, padding: '6px 14px',
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: '40px 0', fontSize: 14 }}>
            No hi ha notícies disponibles per a aquesta zona
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>
    </div>
  );
}
