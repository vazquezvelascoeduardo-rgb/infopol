import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import { StatusBar, InfoPolWordmark, RoundIconBtn } from '../../components/Shared';
import Icon from '../../components/Icon';
import { NOTICIAS, CAT_KEYS, CAT_LABELS } from '../../data/noticias';

const CATS = ['all', ...Object.keys(CAT_LABELS)];

function NewsCard({ noticia }) {
  const k = T.cat[CAT_KEYS[noticia.cat]];
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: k.solid,
            letterSpacing: 0.6, textTransform: 'uppercase',
            background: k.soft, padding: '2px 7px', borderRadius: T.r.pill,
          }}>
            {noticia.tag}
          </span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto', flexShrink: 0 }}>
            {noticia.date}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>
          {noticia.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45, marginBottom: 10 }}>
          {noticia.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontSize: 12, fontWeight: 700 }}>
          Llegir la notícia <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, background: '#fff',
          border: `1px solid ${T.hairline}`, boxShadow: T.shadow.card,
          display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 11,
            letterSpacing: 1.1, textTransform: 'uppercase', color: T.inkMuted,
          }}>
            Dijous, 26 de novembre de 2026
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 16px 16px' }}>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: 0, color: T.ink,
        }}>
          Noticias del dia
        </h1>
        <p style={{ fontSize: 13, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px 14px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {CATS.map(cat => {
          const catKey = cat === 'all' ? 'operativa' : CAT_KEYS[cat];
          const k = T.cat[catKey];
          const isActive = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: T.r.pill,
                border: `1.5px solid ${isActive ? k.solid : T.hairlineStrong}`,
                background: isActive ? k.solid : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {cat === 'all' ? 'Tots' : CAT_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ padding: '0 16px 10px' }}>
        <span style={{ fontFamily: T.font, fontSize: 12, color: T.inkMuted }}>
          {filtered.length} notícies
        </span>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(n => <NewsCard key={n.id} noticia={n} />)}
      </div>
    </div>
  );
}
