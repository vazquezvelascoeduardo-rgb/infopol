import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, SectionHead } from '../../components/Shared';
import { NEWS, TODAY_FULL } from '../../data/news';

const N = T.cat.noticias;

const SCOPE_LABELS = {
  cat: 'Catalunya',
  esp: 'Espanya',
  int: 'Internacional',
};

const SCOPE_COLORS = {
  cat: T.cat.operativa,
  esp: T.cat.leyes,
  int: T.cat.atajos,
};

const FILTERS = [
  { id: 'tot', label: 'Tot' },
  { id: 'cat', label: 'Catalunya' },
  { id: 'esp', label: 'Espanya' },
  { id: 'int', label: 'Internacional' },
];

function ScopeBadge({ scope }) {
  const col = SCOPE_COLORS[scope] || T.cat.operativa;
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase',
      background: col.soft, color: col.ink,
      padding: '3px 7px', borderRadius: T.r.pill,
    }}>
      {SCOPE_LABELS[scope] || scope}
    </span>
  );
}

function NewsCard({ item }) {
  const handleOpen = () => {
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md, padding: 14,
      borderLeft: `3px solid ${N.solid}`,
      boxShadow: T.shadow.card, cursor: item.url ? 'pointer' : 'default',
    }} onClick={handleOpen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <ScopeBadge scope={item.scope} />
        <span style={{
          fontSize: 10, fontWeight: 800, color: N.solid,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{item.cat}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>{item.desc}</div>
      {item.url && (
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 4,
          color: N.solid, fontWeight: 700, fontSize: 12,
        }}>
          Llegir més <Icon name="arrow-right" size={13} color={N.solid} />
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('tot');

  const filtered = filter === 'tot' ? NEWS : NEWS.filter(n => n.scope === filter);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '4px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.1, textTransform: 'uppercase', color: N.ink }}>
            InfoPol · Noticias
          </div>
        </div>
      </div>

      {/* Title + date */}
      <div style={{ padding: '10px 16px 4px' }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: N.solid }} />
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.inkMuted, fontWeight: 600 }}>
            {TODAY_FULL} · {filtered.length} notícia{filtered.length !== 1 ? 'cies' : ''}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 14px', borderRadius: T.r.pill, border: 'none',
            cursor: 'pointer', flexShrink: 0,
            background: filter === f.id ? N.solid : '#fff',
            color: filter === f.id ? '#fff' : T.inkSoft,
            fontFamily: T.font, fontWeight: 700, fontSize: 12,
            boxShadow: T.shadow.card,
            transition: 'background 0.15s, color 0.15s',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '32px 0' }}>
            No hi ha noticias per a aquest filtre.
          </div>
        ) : filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
