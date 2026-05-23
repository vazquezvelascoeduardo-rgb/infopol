import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, SectionHead, InfoPolWordmark, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS } from '../../data/noticias';

const CAT_META = {
  política:      { color: T.cat.operativa, icon: 'scale', label: 'Política' },
  economia:      { color: T.cat.leyes, icon: 'chart', label: 'Economia' },
  cultura:       { color: T.cat.academia, icon: 'book', label: 'Cultura' },
  esports:       { color: T.cat.transito, icon: 'bolt', label: 'Esports' },
  policial:      { color: T.cat.alcohol, icon: 'siren', label: 'Policial' },
  descobriments: { color: T.cat.physical, icon: 'check', label: 'Descobriments' },
  premis:        { color: T.cat.psico, icon: 'star', label: 'Premis' },
  internacional: { color: T.cat.atajos, icon: 'route', label: 'Internacional' },
};

const CATEGORIES = ['totes', ...Object.keys(CAT_META)];

function CatBadge({ categoria }) {
  const meta = CAT_META[categoria] || CAT_META.política;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: meta.color.soft, color: meta.color.ink,
      fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
      textTransform: 'uppercase', padding: '3px 8px', borderRadius: T.r.pill,
    }}>
      {meta.label}
    </span>
  );
}

function NewsCard({ item }) {
  const meta = CAT_META[item.categoria] || CAT_META.política;
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.md, padding: 14,
      borderLeft: `3px solid ${meta.color.solid}`,
      boxShadow: T.shadow.card, display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CatBadge categoria={item.categoria} />
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.4 }}>
        {item.desc}
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2,
            color: meta.color.solid, fontSize: 11.5, fontWeight: 700, textDecoration: 'none',
          }}
        >
          Llegir notícia <Icon name="arrow-right" size={12} color={meta.color.solid} />
        </a>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
        background: active ? T.cat.operativa.solid : '#fff',
        color: active ? '#fff' : T.inkSoft,
        boxShadow: active ? 'none' : T.shadow.card,
      }}
    >
      {label === 'totes' ? 'Totes' : (CAT_META[label]?.label || label)}
    </button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('totes');

  const filtered = activeFilter === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.categoria === activeFilter);

  // Group by date
  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
        <InfoPolWordmark height={16} />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24, letterSpacing: -0.5, margin: 0 }}>
          Notícies del dia
        </h1>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 0 12px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <FilterChip
              key={cat}
              label={cat}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </div>
      </div>

      {/* News list grouped by date */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {dates.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: '40px 0', fontSize: 14 }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        )}
        {dates.map(date => (
          <div key={date}>
            <SectionHead
              kicker="Publicades"
              kickerColor={T.cat.operativa.solid}
              title={formatDate(date)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grouped[date].map(item => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  const months = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}
