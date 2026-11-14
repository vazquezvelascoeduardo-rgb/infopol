import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, NOTICIAS_CATS } from '../data/noticias';

const GEO_FILTERS = ['Totes', 'Catalunya', 'Espanya', 'Internacional'];
const CAT_FILTERS = ['Totes', 'politica', 'economia', 'esports', 'policial', 'ciencia', 'premis', 'internacional'];

function NewsCard({ item }) {
  const cat = NOTICIAS_CATS[item.catKey] || NOTICIAS_CATS.internacional;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${cat.color}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7,
            textTransform: 'uppercase', color: cat.ink,
            background: cat.soft, padding: '3px 7px', borderRadius: T.r.pill,
            flexShrink: 0,
          }}>{cat.label}</span>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color: T.inkMuted,
            background: T.bg, padding: '3px 7px', borderRadius: T.r.pill,
            flexShrink: 0,
          }}>{item.geo}</span>
          <span style={{
            fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto', flexShrink: 0,
          }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.4 }}>
          {item.desc}
        </div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
          color: cat.color, fontWeight: 700, fontSize: 11,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={cat.color} />
        </div>
      </div>
    </a>
  );
}

function FilterChip({ label, active, color, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        background: active ? color : '#fff',
        color: active ? '#fff' : T.inkSoft,
        border: `1px solid ${active ? color : T.hairlineStrong}`,
        borderRadius: T.r.pill,
        padding: '6px 12px',
        fontFamily: T.font,
        fontWeight: 700,
        fontSize: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.15s',
        boxShadow: active ? T.shadow.card : 'none',
      }}
    >
      {label}
    </button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [geoFilter, setGeoFilter] = useState('Totes');
  const [catFilter, setCatFilter] = useState('Totes');

  const filtered = NOTICIAS.filter(n => {
    const geoOk = geoFilter === 'Totes' || n.geo === geoFilter;
    const catOk = catFilter === 'Totes' || n.catKey === catFilter;
    return geoOk && catOk;
  });

  const today = (() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}·${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {today}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 4, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Cat filter */}
      <div style={{ paddingLeft: 16, marginBottom: 10, overflowX: 'auto', display: 'flex', gap: 8, paddingRight: 16, scrollbarWidth: 'none' }}>
        <FilterChip
          label="Totes"
          active={catFilter === 'Totes'}
          color={T.cat.operativa.solid}
          onPress={() => setCatFilter('Totes')}
        />
        {Object.entries(NOTICIAS_CATS).map(([key, cat]) => (
          <FilterChip
            key={key}
            label={cat.label}
            active={catFilter === key}
            color={cat.color}
            onPress={() => setCatFilter(key)}
          />
        ))}
      </div>

      {/* Geo filter */}
      <div style={{ paddingLeft: 16, marginBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, paddingRight: 16, scrollbarWidth: 'none' }}>
        {GEO_FILTERS.map(geo => (
          <FilterChip
            key={geo}
            label={geo}
            active={geoFilter === geo}
            color={T.cat.operativa.solid}
            onPress={() => setGeoFilter(geo)}
          />
        ))}
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px', marginBottom: 14, display: 'flex', gap: 10 }}>
        {Object.entries(NOTICIAS_CATS).map(([key, cat]) => {
          const count = NOTICIAS.filter(n => n.catKey === key).length;
          if (!count) return null;
          return (
            <div key={key} style={{
              background: cat.soft,
              color: cat.ink,
              padding: '5px 10px',
              borderRadius: T.r.pill,
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>{count}</span> {cat.label}
            </div>
          );
        })}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', color: T.inkMuted,
            padding: '40px 0', fontFamily: T.font, fontSize: 14,
          }}>
            Cap notícia amb aquests filtres.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} item={n} />)
        )}
      </div>

      {/* Footer */}
      <div style={{ margin: '24px 16px 0', padding: 14, background: '#fff', borderRadius: T.r.md, boxShadow: T.shadow.card, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="info" size={16} color={T.inkMuted} />
        <span style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.4 }}>
          Resum diari actualitzat cada nit. Fes clic a cada notícia per llegir la informació completa a la font original.
        </span>
      </div>
    </div>
  );
}
