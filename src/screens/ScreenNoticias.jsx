import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CAT_META } from '../data/news';

const ALL_ID = 'tot';

function CategoryChip({ id, label, color, active, onClick }) {
  const k = T.cat[color];
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      padding: '7px 14px',
      borderRadius: T.r.pill,
      border: 'none',
      background: active ? k.solid : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
      letterSpacing: 0.3,
      boxShadow: T.shadow.card,
      cursor: 'pointer',
      transition: 'background 0.15s, color 0.15s',
    }}>{label}</button>
  );
}

function NewsCard({ item }) {
  const meta = CAT_META[item.cat];
  const k = T.cat[meta.color];
  return (
    <div
      onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: k.solid,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{meta.label} · {item.area}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 5, lineHeight: 1.45 }}>{item.desc}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 11.5 }}>
        Llegir notícia completa <Icon name="arrow-right" size={13} color={k.solid} />
      </div>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState(ALL_ID);

  const filtered = activeCat === ALL_ID
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const lastDate = NOTICIAS[0]?.date || '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 10px' }}>
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
        <InfoPolWordmark height={17} />
        <div style={{ width: 36 }} />
      </div>

      {/* title row */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 4 }}>
          Actualitat · {lastDate ? `${lastDate} · 2026` : ''}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0, color: T.ink }}>
          Noticias del dia
        </h1>
      </div>

      {/* category chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <CategoryChip
          id={ALL_ID}
          label="Tot"
          color="operativa"
          active={activeCat === ALL_ID}
          onClick={() => setActiveCat(ALL_ID)}
        />
        {Object.entries(CAT_META).map(([id, meta]) => (
          <CategoryChip
            key={id}
            id={id}
            label={meta.label}
            color={meta.color}
            active={activeCat === id}
            onClick={() => setActiveCat(id)}
          />
        ))}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: T.inkMuted, fontSize: 14 }}>
            Cap notícia en aquesta categoria.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center', fontSize: 11, color: T.inkFaint }}>
        Noticias recopilades automàticament · InfoPol
      </div>
    </div>
  );
}
