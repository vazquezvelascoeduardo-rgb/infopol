import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader, Pill } from '../components/Shared';
import { NEWS, NEWS_CATEGORIES, CAT_COLOR } from '../data/news';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function NewsCard({ item }) {
  const colorKey = CAT_COLOR[item.cat] || 'operativa';
  const k = T.cat[colorKey];
  const catLabel = NEWS_CATEGORIES.find(c => c.id === item.cat)?.label || item.cat;

  return (
    <div style={{
      background: T.card,
      borderRadius: T.r.lg,
      padding: '14px 16px',
      boxShadow: T.shadow.card,
      borderLeft: `3px solid ${k.solid}`,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Pill bg={k.soft} fg={k.ink}>{catLabel}</Pill>
        <span style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 700,
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: T.inkMuted,
        }}>{item.area}</span>
      </div>

      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
        letterSpacing: -0.3, color: T.ink, lineHeight: 1.25,
        marginBottom: 6,
      }}>
        {item.title}
      </div>

      <div style={{
        fontFamily: T.font, fontSize: 13, color: T.inkSoft,
        lineHeight: 1.5, marginBottom: 10,
      }}>
        {item.summary}
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: T.font, fontWeight: 700, fontSize: 12,
          color: k.solid, textDecoration: 'none',
          letterSpacing: 0.2,
        }}
      >
        Llegir notícia completa
        <Icon name="arrow-right" size={13} color={k.solid} strokeWidth={2.4} />
      </a>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('tots');

  const filtered = activeCat === 'tots'
    ? NEWS
    : NEWS.filter(n => n.cat === activeCat);

  // Group by date
  const byDate = filtered.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
              letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.operativa.ink,
            }}>Actualitat</div>
            <h1 style={{
              fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26,
              letterSpacing: -0.6, margin: 0, lineHeight: 1.05,
            }}>Notícies</h1>
          </div>
        </div>

        {/* Category filter */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {NEWS_CATEGORIES.map(c => {
            const isActive = activeCat === c.id;
            const colorKey = CAT_COLOR[c.id] || 'operativa';
            const k = c.id === 'tots' ? null : T.cat[colorKey];
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px', borderRadius: T.r.pill, border: 'none',
                  cursor: 'pointer',
                  background: isActive
                    ? (k ? k.solid : T.ink)
                    : '#fff',
                  color: isActive ? '#fff' : T.inkSoft,
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  letterSpacing: 0.3, textTransform: 'uppercase',
                  boxShadow: isActive ? 'none' : T.shadow.card,
                  transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* News list grouped by date */}
      <div style={{ padding: '8px 16px 0' }}>
        {dates.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            fontFamily: T.font, color: T.inkMuted, fontSize: 14,
          }}>
            No hi ha notícies en aquesta categoria.
          </div>
        )}
        {dates.map(date => (
          <div key={date}>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 11,
              letterSpacing: 1.1, textTransform: 'uppercase',
              color: T.inkMuted, marginBottom: 10, marginTop: 8,
              paddingLeft: 2,
            }}>
              {formatDate(date)}
            </div>
            {byDate[date].map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
