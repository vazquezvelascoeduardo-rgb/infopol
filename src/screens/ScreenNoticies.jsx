import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, Pill } from '../components/Shared';
import { NEWS, NEWS_DATE } from '../data/news';

const CAT_FILTERS = ['Totes', 'Política', 'Economia', 'Successos', 'Esports', 'Cultura i Ciència', 'Internacional'];

function NewsCard({ item }) {
  const k = T.cat[item.colorKey] || T.cat.operativa;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: '14px 16px',
        boxShadow: T.shadow.card,
        borderTop: `3px solid ${k.solid}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {/* category + source */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Pill bg={k.soft} fg={k.ink} size={10}>
            {item.cat}
          </Pill>
          <span style={{ fontSize: 10.5, color: T.inkFaint, fontFamily: T.font, fontWeight: 600 }}>{item.source}</span>
        </div>

        {/* title */}
        <div style={{
          fontFamily: T.fontDisplay,
          fontWeight: 800,
          fontSize: 15,
          color: T.ink,
          letterSpacing: -0.2,
          lineHeight: 1.25,
        }}>
          {item.title}
        </div>

        {/* summary */}
        <div style={{
          fontFamily: T.font,
          fontSize: 13,
          color: T.inkSoft,
          lineHeight: 1.5,
        }}>
          {item.summary}
        </div>

        {/* read more */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: k.solid, fontFamily: T.font }}>Llegir notícia completa</span>
          <Icon name="external-link" size={11} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ item }) {
  const k = T.cat[item.colorKey] || T.cat.alcohol;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block', padding: '0 16px' }}
    >
      <div style={{
        background: k.solid,
        borderRadius: T.r.xl,
        padding: 20,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: 200, background: 'rgba(255,255,255,0.1)' }} />
        <Pill bg="rgba(255,255,255,0.22)" fg="#fff" size={10}>
          <Icon name="alert" size={10} color="#fff" /> Notícia destacada
        </Pill>
        <div style={{
          fontFamily: T.fontDisplay,
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: -0.4,
          lineHeight: 1.2,
          marginTop: 10,
        }}>
          {item.title}
        </div>
        <div style={{
          fontSize: 12.5,
          opacity: 0.88,
          marginTop: 8,
          lineHeight: 1.5,
        }}>
          {item.summary}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14 }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, fontFamily: T.font }}>Llegir notícia completa</span>
          <Icon name="external-link" size={11} color="#fff" />
        </div>
        <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4, fontFamily: T.font }}>Font: {item.source}</div>
      </div>
    </a>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Totes');

  const featured = NEWS.find(n => n.featured);
  const filtered = NEWS.filter(n => !n.featured && (activeFilter === 'Totes' || n.cat === activeFilter));

  return (
    <div className="screen-no-tabs" style={{ background: T.bg, paddingBottom: 40 }}>
      <StatusBar />

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 34, height: 34, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name="arrow-left" size={17} color={T.ink} />
          </button>
          <InfoPolWordmark height={15} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="newspaper" size={14} color={T.inkMuted} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.inkMuted, fontFamily: T.font }}>
            {NEWS_DATE}
          </span>
        </div>
      </div>

      {/* heading */}
      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.academia.solid, fontFamily: T.font, marginBottom: 4 }}>
          Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 30, letterSpacing: -1, color: T.ink, margin: 0, lineHeight: 1.05 }}>
          Noticies del dia
        </h1>
      </div>

      {/* featured card */}
      {featured && <FeaturedCard item={featured} />}

      {/* filter chips */}
      <div style={{ padding: '16px 16px 4px', display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {CAT_FILTERS.map(f => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 999,
                border: 'none',
                background: isActive ? T.ink : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: isActive ? 'none' : T.shadow.card,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: T.inkMuted, fontSize: 14, fontFamily: T.font }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        )}
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* footer */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11.5, color: T.inkFaint, fontFamily: T.font, lineHeight: 1.6 }}>
          Notícies recopilades de fonts públiques (EFE, Infobae, El Nacional, Moncloa.com…)<br />
          S'actualitzen cada dia a les 22h.
        </div>
      </div>
    </div>
  );
}
