import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn } from '../components/Shared';
import { NEWS, NEWS_CATS } from '../data/news';

const CAT_ALL = { label: 'Totes', color: T.ink, bg: T.hairline, ink: T.inkSoft };

function CatChip({ cat, active, onClick }) {
  const c = cat === 'all' ? CAT_ALL : NEWS_CATS[cat];
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
      background: active ? c.color : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'background 0.15s, color 0.15s',
    }}>
      {c.label}
    </button>
  );
}

function NewsCard({ item }) {
  const c = NEWS_CATS[item.cat];
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${c.color}`, boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
            color: c.ink, background: c.bg, padding: '3px 8px', borderRadius: 999,
          }}>{item.tag}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 5, lineHeight: 1.5 }}>{item.desc}</div>
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 4,
          color: c.color, fontWeight: 700, fontSize: 11,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={c.color} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');

  const cats = ['all', ...Object.keys(NEWS_CATS)];
  const filtered = activeCat === 'all' ? NEWS : NEWS.filter(n => n.cat === activeCat);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '8px 16px 4px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Category filter chips */}
      <div style={{ padding: '8px 0 4px', overflowX: 'auto', display: 'flex', gap: 8, paddingLeft: 16, paddingRight: 16, scrollbarWidth: 'none' }}>
        {cats.map(cat => (
          <CatChip key={cat} cat={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
        ))}
      </div>

      {/* News list */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies en aquesta categoria
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      <div style={{ padding: '4px 16px 16px', textAlign: 'center', fontSize: 11, color: T.inkFaint }}>
        Actualitzat el {new Date().toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · 22:00 h
      </div>
    </div>
  );
}
