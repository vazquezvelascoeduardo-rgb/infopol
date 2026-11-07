import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader, Pill } from '../components/Shared';
import { NEWS, NEWS_CATS } from '../data/news';

const FILTER_ALL = 'tot';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function NewsCard({ item, onClick }) {
  const catDef = NEWS_CATS[item.cat] || NEWS_CATS.internacional;
  const col = T.cat[catDef.color];

  return (
    <div onClick={onClick} style={{
      background: T.card,
      borderRadius: T.r.lg,
      padding: 16,
      boxShadow: T.shadow.card,
      borderLeft: `4px solid ${col.solid}`,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: col.soft, display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name={catDef.icon} size={14} color={col.solid} strokeWidth={2.4} />
          </div>
          <span style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 1.1, textTransform: 'uppercase',
            color: col.ink,
          }}>{catDef.label}</span>
        </div>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkMuted, flexShrink: 0 }}>
          {item.region}
        </span>
      </div>

      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800,
        fontSize: 15, lineHeight: 1.3, letterSpacing: -0.3,
        color: T.ink,
      }}>{item.title}</div>

      <div style={{
        fontFamily: T.font, fontSize: 13, lineHeight: 1.55,
        color: T.inkSoft,
      }}>{item.summary}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkMuted }}>
          Font: <b style={{ color: T.inkSoft }}>{item.source}</b>
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: col.solid, fontFamily: T.font, fontWeight: 700, fontSize: 12,
        }}>
          Llegir notícia <Icon name="external-link" size={12} color={col.solid} strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);

  const latestDate = NEWS[0]?.date ?? '';
  const dateLabel = latestDate ? formatDate(latestDate) : '';

  const filters = [FILTER_ALL, ...Object.keys(NEWS_CATS)];
  const filtered = activeFilter === FILTER_ALL
    ? NEWS
    : NEWS.filter(n => n.cat === activeFilter);

  function handleOpen(item) {
    if (item.url) window.open(item.url, '_blank', 'noopener');
  }

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.tests.ink }}>
              Noticias
            </div>
          </div>
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: '0 0 4px' }}>
          Actualitat
        </h1>
        {dateLabel && (
          <div style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginBottom: 16 }}>
            {dateLabel}
          </div>
        )}
      </div>

      {/* filter chips */}
      <div style={{ overflowX: 'auto', display: 'flex', gap: 8, padding: '0 16px 16px', scrollbarWidth: 'none' }}>
        {filters.map(f => {
          const isAll = f === FILTER_ALL;
          const catDef = !isAll ? NEWS_CATS[f] : null;
          const col = catDef ? T.cat[catDef.color] : T.cat.tests;
          const isActive = activeFilter === f;
          return (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0, border: 'none', cursor: 'pointer',
              padding: '6px 14px', borderRadius: T.r.pill,
              background: isActive ? col.solid : '#fff',
              color: isActive ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              letterSpacing: 0.3,
              boxShadow: isActive ? 'none' : T.shadow.card,
              transition: 'all 0.15s',
            }}>
              {isAll ? 'Tot' : catDef.label}
            </button>
          );
        })}
      </div>

      {/* count badge */}
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted }}>
          <b style={{ color: T.ink }}>{filtered.length}</b> notícies
        </span>
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} onClick={() => handleOpen(item)} />
        ))}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
