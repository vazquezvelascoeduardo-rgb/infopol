import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar } from '../components/Shared';
import { NEWS, CAT_META } from '../data/news';

const GEO_OPTIONS = [
  { id: 'tots', label: 'Tots' },
  { id: 'catalunya', label: 'Catalunya' },
  { id: 'espanya', label: 'Espanya' },
  { id: 'internacional', label: 'Internacional' },
];

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = ['gen', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'des'];
  return `${d} ${months[m - 1]}. ${y}`;
}

function NewsCard({ item }) {
  const meta = CAT_META[item.cat] || CAT_META.politica;
  const tk = T.cat[meta.color] || T.cat.operativa;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: T.card,
        borderRadius: T.r.lg,
        padding: '14px 16px',
        boxShadow: T.shadow.card,
        borderLeft: `4px solid ${tk.solid}`,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            background: tk.soft,
            color: tk.ink,
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: T.r.pill,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}>
            {meta.icon} {meta.label}
          </span>
          <span style={{
            background: T.hairline,
            color: T.inkMuted,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: T.r.pill,
            letterSpacing: 0.3,
          }}>
            {item.geoLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="arrow-right" size={14} color={tk.solid} />
        </div>
      </div>

      {/* title */}
      <div style={{
        fontFamily: T.fontDisplay,
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: -0.2,
        lineHeight: 1.3,
        color: T.ink,
        marginBottom: 6,
      }}>
        {item.title}
      </div>

      {/* summary */}
      <div style={{
        fontSize: 13,
        color: T.inkSoft,
        lineHeight: 1.5,
        marginBottom: 10,
      }}>
        {item.summary}
      </div>

      {/* footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid ${T.hairline}`,
        paddingTop: 8,
      }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          {item.source}
        </span>
        <span style={{ fontSize: 11, color: T.inkFaint, fontFamily: T.fontMono }}>
          {formatDate(item.date)}
        </span>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [geoFilter, setGeoFilter] = useState('tots');

  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const filtered = geoFilter === 'tots' ? sorted : sorted.filter(n => n.geo === geoFilter);

  // group by date
  const groups = [];
  filtered.forEach(item => {
    const last = groups[groups.length - 1];
    if (!last || last.date !== item.date) {
      groups.push({ date: item.date, items: [item] });
    } else {
      last.items.push(item);
    }
  });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '4px 16px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: T.card, boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}
        >
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22,
            letterSpacing: -0.6, color: T.ink, lineHeight: 1,
          }}>
            Actualitat 📰
          </div>
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>
            Catalunya · Espanya · Internacional
          </div>
        </div>
      </div>

      {/* geo filter */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {GEO_OPTIONS.map(opt => {
          const active = geoFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setGeoFilter(opt.id)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: T.r.pill,
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 0.3,
                background: active ? T.ink : T.card,
                color: active ? '#fff' : T.inkMuted,
                boxShadow: active ? 'none' : T.shadow.card,
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* news list grouped by date */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies per a aquest filtre.
          </div>
        )}
        {groups.map(group => (
          <div key={group.date}>
            <div style={{
              fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2,
              textTransform: 'uppercase', color: T.inkMuted,
              marginBottom: 10,
            }}>
              {formatDate(group.date)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.items.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
