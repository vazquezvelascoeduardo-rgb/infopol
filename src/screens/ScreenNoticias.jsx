import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, SectionHead } from '../components/Shared';
import { NOTICIAS, CATS } from '../data/noticias';

const ALL_CATS = ['totes', 'politica', 'economia', 'policial', 'internacional', 'esports', 'cultura'];

function FilterChip({ label, active, color, soft, ink, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? color : soft || '#F0EFEA',
      color: active ? '#fff' : ink || T.inkMuted,
      border: 'none',
      padding: '6px 12px',
      borderRadius: T.r.pill,
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background 0.15s',
    }}>
      {label}
    </button>
  );
}

function NoticiaCard({ noticia }) {
  const c = CATS[noticia.cat] || CATS.politica;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: 14,
      borderLeft: `3px solid ${c.color}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{
          background: c.soft,
          color: c.ink,
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: 0.7,
          textTransform: 'uppercase',
          padding: '3px 7px',
          borderRadius: T.r.pill,
        }}>
          {noticia.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
          {noticia.dateLabel}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35 }}>
        {noticia.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>
        {noticia.desc}
      </div>
      {noticia.url && (
        <a
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 10,
            fontSize: 11,
            fontWeight: 700,
            color: c.color,
            textDecoration: 'none',
          }}
        >
          Llegir notícia completa <Icon name="arrow-right" size={12} color={c.color} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const latestDate = NOTICIAS.length > 0 ? NOTICIAS[0].dateLabel : '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
        >
          <Icon name="arrow-left" size={20} color={T.ink} />
        </button>
        <div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted }}>
            Actualitat
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.5, margin: 0, color: T.ink }}>
            Noticias
          </h1>
        </div>
        <span style={{
          marginLeft: 'auto',
          fontFamily: T.fontMono,
          fontSize: 11,
          color: T.inkMuted,
          background: '#F0EFEA',
          padding: '4px 8px',
          borderRadius: T.r.sm,
        }}>
          {latestDate}
        </span>
      </div>

      {/* filter chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <FilterChip
          label="Totes"
          active={activeCat === 'totes'}
          color={T.ink}
          soft="#F0EFEA"
          ink={T.inkMuted}
          onClick={() => setActiveCat('totes')}
        />
        {Object.entries(CATS).map(([key, cat]) => (
          <FilterChip
            key={key}
            label={cat.label}
            active={activeCat === key}
            color={cat.color}
            soft={cat.soft}
            ink={cat.ink}
            onClick={() => setActiveCat(key)}
          />
        ))}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 13 }}>
            No hi ha notícies per aquesta categoria avui.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>
    </div>
  );
}
