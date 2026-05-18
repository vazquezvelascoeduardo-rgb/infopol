import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar } from '../../components/Shared';

const TAG_STYLE = {
  'Política':     { solid: '#3B6BF5', soft: '#D8E2FE', ink: '#0E2B7A' },
  'Economia':     { solid: '#E89421', soft: '#FBE7C2', ink: '#6B3F08' },
  'Esports':      { solid: '#1FB286', soft: '#CDF0E1', ink: '#0B5A3D' },
  'Cultura':      { solid: '#FF7A1A', soft: '#FFE0CB', ink: '#7A2E04' },
  'Policial':     { solid: '#9C4FE0', soft: '#EBDAFB', ink: '#4A1B7A' },
  'Legal':        { solid: '#9C4FE0', soft: '#EBDAFB', ink: '#4A1B7A' },
  'Descobriment': { solid: '#0BB4C2', soft: '#CCEEF1', ink: '#0A4F56' },
  'Premi':        { solid: '#F0B400', soft: '#FCEFB8', ink: '#5C4400' },
};

const SCOPES = ['Tots', 'Catalunya', 'Espanya', 'Internacional'];
const TAGS = ['Tots', 'Política', 'Economia', 'Esports', 'Cultura', 'Policial', 'Legal', 'Descobriment', 'Premi'];

function tagStyle(tag) {
  return TAG_STYLE[tag] || { solid: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink };
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, border: 'none', borderRadius: T.r.pill, cursor: 'pointer',
      padding: '7px 14px', fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
      background: active ? (color || T.cat.operativa.solid) : '#fff',
      color: active ? '#fff' : T.inkSoft,
      boxShadow: T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function NewsCard({ item }) {
  const ts = tagStyle(item.tag);
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md, padding: 14,
      borderLeft: `3px solid ${ts.solid}`, boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
          background: ts.soft, color: ts.ink, padding: '2px 7px', borderRadius: 999,
        }}>{item.tag}</span>
        {item.scope && (
          <span style={{ fontSize: 10, fontWeight: 700, color: T.inkMuted }}>{item.scope}</span>
        )}
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
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
            fontSize: 11.5, fontWeight: 700, color: ts.solid, marginTop: 8,
          }}
        >
          Llegir notícia <Icon name="arrow-right" size={13} color={ts.solid} />
        </a>
      )}
    </div>
  );
}

function groupByDate(items) {
  const groups = {};
  items.forEach(n => {
    if (!groups[n.date]) groups[n.date] = [];
    groups[n.date].push(n);
  });
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState('Tots');
  const [tag, setTag] = useState('Tots');

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = news.filter(n =>
    (scope === 'Tots' || n.scope === scope) &&
    (tag === 'Tots' || n.tag === tag)
  );

  const groups = groupByDate(filtered);

  function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    const months = ['gen', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'des'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
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
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted }}>InfoPol</div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>Notícies</div>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 11, color: T.inkMuted }}>
          {filtered.length} articles
        </div>
      </div>

      {/* Scope filter */}
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {SCOPES.map(s => (
          <FilterChip key={s} label={s} active={scope === s} onClick={() => setScope(s)} />
        ))}
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {TAGS.map(t => {
          const ts = t === 'Tots' ? null : tagStyle(t);
          return (
            <FilterChip
              key={t}
              label={t}
              active={tag === t}
              color={ts?.solid}
              onClick={() => setTag(t)}
            />
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: T.inkMuted, fontFamily: T.font, fontSize: 14 }}>
          Carregant notícies…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: T.inkMuted, fontFamily: T.font, fontSize: 14 }}>
          Sense notícies per a aquest filtre.
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map(([date, items]) => (
            <div key={date}>
              <div style={{
                fontFamily: T.font, fontWeight: 800, fontSize: 11,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: T.inkMuted, marginBottom: 8, paddingLeft: 2,
              }}>
                {formatDate(date)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(n => <NewsCard key={n.id} item={n} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
