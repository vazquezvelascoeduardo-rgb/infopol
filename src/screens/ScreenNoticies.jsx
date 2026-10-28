import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar } from '../components/Shared';
import { NEWS, NEWS_CATS } from '../data/news';

function CatBadge({ cat }) {
  const c = NEWS_CATS[cat];
  if (!c) return null;
  return (
    <span style={{
      background: c.bg, color: c.ink,
      fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 999,
    }}>{c.label}</span>
  );
}

function NewsCard({ item, onOpen }) {
  const c = NEWS_CATS[item.cat];
  const d = new Date(item.date);
  const day = d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 16,
        boxShadow: T.shadow.card,
        borderLeft: `4px solid ${c ? c.color : T.inkFaint}`,
        cursor: 'pointer',
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <CatBadge cat={item.cat} />
        <span style={{ fontSize: 11, color: T.inkMuted }}>{day}</span>
      </div>
      <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: T.ink, lineHeight: 1.25, letterSpacing: -0.2 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 8, lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.summary}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flex: 1 }}>
          {item.tags.slice(0, 3).map(t => (
            <span key={t} style={{ fontSize: 10.5, color: T.inkMuted, background: T.bg,
              padding: '2px 7px', borderRadius: 999, fontWeight: 600 }}>#{t}</span>
          ))}
        </div>
        <Icon name="chevron-right" size={16} color={T.inkMuted} />
      </div>
    </div>
  );
}

function NewsDetail({ item, onClose }) {
  const c = NEWS_CATS[item.cat];
  const d = new Date(item.date);
  const day = d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: T.bg, zIndex: 50, overflowY: 'auto' }}>
      <StatusBar />
      <div style={{ padding: '10px 16px' }}>
        <button onClick={onClose} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.inkSoft,
          padding: 0,
        }}>
          <Icon name="chevron-left" size={18} color={T.inkSoft} />
          Notícies
        </button>
      </div>

      <div style={{ padding: '0 16px 40px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <CatBadge cat={item.cat} />
          <span style={{ fontSize: 11.5, color: T.inkMuted, textTransform: 'capitalize' }}>{day}</span>
        </div>

        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22,
          color: T.ink, lineHeight: 1.2, letterSpacing: -0.6, margin: '0 0 16px',
        }}>{item.title}</h1>

        <div style={{
          background: c ? c.bg : '#f0f0f0',
          borderLeft: `3px solid ${c ? c.color : T.inkFaint}`,
          borderRadius: `0 ${T.r.md}px ${T.r.md}px 0`,
          padding: 14, marginBottom: 16,
        }}>
          <p style={{ fontFamily: T.font, fontSize: 14.5, lineHeight: 1.65, color: T.inkSoft, margin: 0 }}>
            {item.summary}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {item.tags.map(t => (
            <span key={t} style={{ fontSize: 11.5, color: T.inkMuted, background: '#fff',
              padding: '4px 10px', borderRadius: 999, fontWeight: 600,
              boxShadow: T.shadow.card }}>#{t}</span>
          ))}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: c ? c.color : T.ink, color: '#fff',
            padding: '14px 20px', borderRadius: T.r.pill,
            fontFamily: T.font, fontWeight: 800, fontSize: 14,
            textDecoration: 'none', letterSpacing: 0.2,
          }}
        >
          <Icon name="external-link" size={16} color="#fff" />
          Llegir notícia completa
        </a>
        <p style={{ fontSize: 11, color: T.inkFaint, textAlign: 'center', marginTop: 8 }}>
          S'obrirà en el navegador extern
        </p>
      </div>
    </div>
  );
}

const ALL_CATS = Object.keys(NEWS_CATS);

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [activeCat, setActiveCat] = useState('all');

  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = activeCat === 'all' ? sorted : sorted.filter(n => n.cat === activeCat);

  const latestDate = sorted[0]?.date;
  const latestLabel = latestDate
    ? new Date(latestDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  if (selected) {
    return <NewsDetail item={selected} onClose={() => setSelected(null)} />;
  }

  return (
    <div className="screen-no-tabs" style={{ background: T.bg, paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.inkSoft, padding: 0,
        }}>
          <Icon name="chevron-left" size={18} color={T.inkSoft} />
          Inici
        </button>
        <InfoPolWordmark height={16} />
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.4,
          textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -1, color: T.ink, margin: 0, lineHeight: 1.1 }}>
          Notícies
        </h1>
        {latestLabel && (
          <p style={{ fontSize: 12, color: T.inkMuted, marginTop: 4, marginBottom: 0 }}>
            Darrera actualització: {latestLabel}
          </p>
        )}
      </div>

      {/* category filter */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 16px', overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setActiveCat('all')}
          style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 999,
            border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 800, fontSize: 12,
            background: activeCat === 'all' ? T.ink : '#fff',
            color: activeCat === 'all' ? '#fff' : T.inkSoft,
            boxShadow: T.shadow.card,
          }}
        >Totes</button>
        {ALL_CATS.map(cat => {
          const c = NEWS_CATS[cat];
          const isActive = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 999,
                border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 800, fontSize: 12,
                background: isActive ? c.color : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                boxShadow: T.shadow.card,
              }}
            >{c.label}</button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: 40 }}>
            No hi ha notícies en aquesta categoria.
          </div>
        ) : (
          filtered.map(item => (
            <NewsCard key={item.id} item={item} onOpen={setSelected} />
          ))
        )}
      </div>
    </div>
  );
}
