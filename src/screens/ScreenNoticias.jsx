import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader } from '../components/Shared';
import newsData from '../data/news.json';

const CAT_COLORS = {
  politica:      T.cat.leyes,
  economia:      T.cat.atajos,
  cultura:       T.cat.academia,
  descobriments: T.cat.physical,
  premis:        T.cat.psico,
  esports:       T.cat.alcohol,
  policial:      T.cat.operativa,
  internacional: T.cat.transito,
};

const FILTERS = [
  { id: 'totes',         label: 'Totes' },
  { id: 'politica',      label: 'Política' },
  { id: 'economia',      label: 'Economia' },
  { id: 'esports',       label: 'Esports' },
  { id: 'policial',      label: 'Policial' },
  { id: 'cultura',       label: 'Cultura' },
  { id: 'descobriments', label: 'Ciència' },
  { id: 'premis',        label: 'Premis' },
  { id: 'internacional', label: 'Internacional' },
];

function NewsCard({ item }) {
  const colors = CAT_COLORS[item.category] || T.cat.operativa;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: '14px 16px',
      borderLeft: `3px solid ${colors.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 9.5, fontWeight: 800, color: colors.solid,
          letterSpacing: 0.7, textTransform: 'uppercase', fontFamily: T.font,
        }}>{item.tag}</span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto',
        }}>{item.dateLabel}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
        {item.desc}
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 10, fontSize: 12, fontWeight: 700,
            color: colors.solid, textDecoration: 'none',
          }}
        >
          Llegir notícia completa <Icon name="arrow-right" size={13} color={colors.solid} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('totes');

  const filtered = activeFilter === 'totes'
    ? newsData
    : newsData.filter(n => n.category === activeFilter);

  // Group by date
  const byDate = filtered.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  function formatDateHeader(dateStr) {
    const [, m, d] = dateStr.split('-');
    const months = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
  }

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Noticias" back />

      {/* Filter chips */}
      <div style={{
        overflowX: 'auto', display: 'flex', gap: 8,
        padding: '0 16px 16px', scrollbarWidth: 'none',
      }}>
        {FILTERS.map(f => {
          const active = activeFilter === f.id;
          const colors = f.id === 'totes' ? T.cat.operativa : (CAT_COLORS[f.id] || T.cat.operativa);
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                flexShrink: 0, border: 'none', cursor: 'pointer',
                padding: '7px 14px', borderRadius: T.r.pill,
                background: active ? colors.solid : '#fff',
                color: active ? '#fff' : T.inkSoft,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                boxShadow: T.shadow.card,
                transition: 'background .15s, color .15s',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* News list grouped by date */}
      {sortedDates.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          color: T.inkMuted, fontFamily: T.font, fontSize: 14,
        }}>
          Cap notícia per a aquest filtre.
        </div>
      ) : (
        sortedDates.map(dateStr => (
          <div key={dateStr} style={{ padding: '0 16px', marginBottom: 24 }}>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
              letterSpacing: 1.2, textTransform: 'uppercase',
              color: T.inkMuted, marginBottom: 10,
            }}>
              {formatDateHeader(dateStr)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {byDate[dateStr].map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
