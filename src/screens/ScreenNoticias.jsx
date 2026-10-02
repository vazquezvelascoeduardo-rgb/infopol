import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { NEWS } from '../data/news';

const CAT_FILTERS = [
  { id: 'all',        label: 'Tot' },
  { id: 'política',   label: 'Política' },
  { id: 'economia',   label: 'Economia' },
  { id: 'successos',  label: 'Successos' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'esports',    label: 'Esports' },
  { id: 'ciència',    label: 'Ciència' },
];

function tagMatchesFilter(tag, filterId) {
  if (filterId === 'all') return true;
  return tag.toLowerCase().includes(filterId);
}

function NewsCard({ item }) {
  const k = T.cat[item.cat] || T.cat.operativa;
  const handleOpen = () => window.open(item.url, '_blank', 'noopener,noreferrer');
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}
      onClick={handleOpen}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{
          fontSize: 9.5,
          fontWeight: 800,
          color: k.solid,
          letterSpacing: 0.7,
          textTransform: 'uppercase',
          background: k.soft,
          padding: '2px 7px',
          borderRadius: 999,
        }}>
          {item.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.date}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 5, lineHeight: 1.45 }}>
        {item.desc}
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 11.5 }}>
        Llegir notícia completa <Icon name="arrow-right" size={12} color={k.solid} />
      </div>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = NEWS.filter(n => tagMatchesFilter(n.tag, filter));

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.inkSoft,
          }}
        >
          <Icon name="chevron-left" size={16} color={T.inkSoft} /> Tornar
        </button>
      </div>

      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.leyes.solid, marginBottom: 4 }}>
          Actualitat · Cada dia
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya, Espanya i internacional · Política, economia, esports, cultura i successos.
        </p>
      </div>

      {/* Filtres */}
      <div style={{ paddingBottom: 4, overflowX: 'auto', display: 'flex', gap: 6, padding: '0 16px 10px' }}>
        {CAT_FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                whiteSpace: 'nowrap',
                border: active ? `1.5px solid ${T.cat.leyes.solid}` : `1.5px solid ${T.hairlineStrong}`,
                background: active ? T.cat.leyes.soft : '#fff',
                color: active ? T.cat.leyes.ink : T.inkSoft,
                padding: '6px 12px',
                borderRadius: 999,
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 13 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
