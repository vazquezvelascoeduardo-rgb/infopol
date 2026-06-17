import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar } from '../components/Shared';
import { NOTICIAS, CAT_COLORS, SCOPE_LABELS } from '../data/noticias';

const FILTERS = [
  { id: 'all', label: 'Totes' },
  { id: 'politica', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'policial', label: 'Policial' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'descobriments', label: 'Descobriments' },
  { id: 'premis', label: 'Premis' },
];

function NewsCard({ n }) {
  const cat = CAT_COLORS[n.category] || CAT_COLORS.politica;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: 14,
      borderLeft: `3px solid ${cat.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: cat.ink,
          letterSpacing: 0.5, textTransform: 'uppercase',
          background: cat.soft, padding: '3px 8px', borderRadius: T.r.pill,
        }}>{cat.label}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: T.inkMuted,
          background: T.bg, padding: '3px 8px', borderRadius: T.r.pill,
        }}>{SCOPE_LABELS[n.scope] || n.scope}</span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto',
        }}>{n.dateLabel}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>
        {n.title}
      </div>
      <div style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.5, marginBottom: n.url ? 9 : 0 }}>
        {n.desc}
      </div>
      {n.url && (
        <a
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 700, color: cat.solid,
            textDecoration: 'none',
          }}
        >
          Llegir article complet
          <Icon name="arrow-right" size={12} color={cat.solid} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.category === activeFilter);

  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 1.1,
            textTransform: 'uppercase', color: T.cat.noticias.solid,
          }}>Actualitat · InfoPol</div>
          <div style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.1,
          }}>Notícies</div>
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ padding: '8px 0 12px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 7, padding: '2px 16px', width: 'max-content' }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.id;
            const color = f.id !== 'all' ? CAT_COLORS[f.id] : null;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: T.r.pill,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: T.font,
                  fontWeight: 700,
                  fontSize: 12,
                  background: isActive ? (color ? color.solid : T.ink) : '#fff',
                  color: isActive ? '#fff' : T.inkSoft,
                  boxShadow: T.shadow.card,
                  transition: 'background 0.15s, color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', color: T.inkMuted,
            padding: '48px 0', fontSize: 14,
          }}>
            No hi ha notícies en aquesta categoria
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} n={n} />)
        )}
      </div>
    </div>
  );
}
