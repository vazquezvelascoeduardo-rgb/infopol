import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, InfoPolWordmark } from '../components/Shared';
import { NEWS, NEWS_CATS } from '../data/news';

const ALL = 'totes';

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const months = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function NewsCard({ item }) {
  const cat = NEWS_CATS[item.cat] || NEWS_CATS.cultura;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}
    >
      <div style={{
        background: T.card,
        borderRadius: T.r.lg,
        boxShadow: T.shadow.card,
        overflow: 'hidden',
        borderTop: `3px solid ${cat.color}`,
      }}>
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              background: cat.soft,
              color: cat.ink,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              padding: '3px 9px',
              borderRadius: T.r.pill,
              fontFamily: T.font,
            }}>{cat.label}</span>
            <span style={{ fontSize: 11, color: T.inkMuted, fontFamily: T.font }}>
              {formatDate(item.date)}
            </span>
            <span style={{ fontSize: 11, color: T.inkFaint, fontFamily: T.font, marginLeft: 'auto' }}>
              {item.source}
            </span>
          </div>

          <div style={{
            fontFamily: T.font,
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1.35,
            color: T.ink,
            marginBottom: 8,
          }}>
            {item.title}
          </div>

          <div style={{
            fontFamily: T.font,
            fontSize: 13,
            lineHeight: 1.55,
            color: T.inkSoft,
          }}>
            {item.summary}
          </div>

          <div style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: cat.color,
            fontFamily: T.font,
          }}>
            Llegir notícia completa
            <Icon name="chevron-right" size={12} color={cat.color} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState(ALL);

  const sortedNews = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = activeCat === ALL
    ? sortedNews
    : sortedNews.filter(n => n.cat === activeCat);

  const usedCats = [...new Set(NEWS.map(n => n.cat))];

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px 10px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}>
          <Icon name="chevron-left" size={22} color={T.ink} />
        </button>
        <div style={{ flex: 1 }}>
          <InfoPolWordmark height={18} />
        </div>
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 6,
        }}>
          Actualitat
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, color: T.ink, margin: 0, lineHeight: 1.1,
        }}>
          Noticias del dia
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, marginBottom: 0, lineHeight: 1.5,
        }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* category filter */}
      <div style={{ padding: '0 18px 16px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          <button
            onClick={() => setActiveCat(ALL)}
            style={{
              padding: '7px 14px',
              borderRadius: T.r.pill,
              border: 'none',
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              cursor: 'pointer',
              background: activeCat === ALL ? T.ink : T.card,
              color: activeCat === ALL ? '#fff' : T.inkSoft,
              boxShadow: T.shadow.card,
              letterSpacing: 0.3,
            }}
          >
            Totes
          </button>
          {usedCats.map(catKey => {
            const cat = NEWS_CATS[catKey];
            const isActive = activeCat === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCat(catKey)}
                style={{
                  padding: '7px 14px',
                  borderRadius: T.r.pill,
                  border: 'none',
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  cursor: 'pointer',
                  background: isActive ? cat.color : T.card,
                  color: isActive ? '#fff' : T.inkSoft,
                  boxShadow: T.shadow.card,
                  letterSpacing: 0.3,
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* news list */}
      <div style={{ padding: '0 18px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontFamily: T.font, fontSize: 14, color: T.inkMuted,
          }}>
            No hi ha notícies en aquesta categoria.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
