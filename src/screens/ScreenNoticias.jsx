import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, NavHeader } from '../components/Shared';
import { NOTICIAS, NOTICIA_CATS, NOTICIA_COLOR } from '../data/noticias';

function CatChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: T.r.pill,
      background: active ? color.solid : '#fff',
      color: active ? '#fff' : T.inkMuted,
      border: `1px solid ${active ? color.solid : T.hairline}`,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
      boxShadow: active ? `0 2px 8px ${color.solid}33` : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function NoticiaCard({ item }) {
  const col = NOTICIA_COLOR[item.cat] || NOTICIA_COLOR.politica;
  return (
    <div
      onClick={() => item.link && window.open(item.link, '_blank', 'noopener')}
      style={{
        background: '#fff', borderRadius: T.r.md,
        padding: 14, borderLeft: `3px solid ${col.solid}`,
        boxShadow: T.shadow.card, cursor: item.link ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          display: 'inline-block', padding: '3px 8px', borderRadius: T.r.pill,
          background: col.soft, color: col.ink,
          fontFamily: T.font, fontWeight: 800, fontSize: 10,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>{item.tag}</span>
        <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>
          {item.date}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45, marginBottom: 8 }}>
        {item.desc}
      </div>
      {item.link && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: col.solid, fontSize: 12, fontWeight: 700 }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={col.solid} />
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <InfoPolWordmark height={18} />
      </div>
      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 2 }}>
          Actualitat · {dateLabel}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>
          Noticies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.4 }}>
          Catalunya, Espanya i internacional — política, economia, esports, policial i molt més.
        </p>
      </div>

      {/* category filter */}
      <div style={{ padding: '0 16px 14px', overflowX: 'auto', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {NOTICIA_CATS.map(c => {
          const col = NOTICIA_COLOR[c.key] || { solid: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink };
          return (
            <CatChip
              key={c.key}
              label={c.label}
              active={activeCat === c.key}
              color={col}
              onClick={() => setActiveCat(c.key)}
            />
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontFamily: T.font, fontSize: 14 }}>
            Cap notícia en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(item => <NoticiaCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ padding: '20px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={13} color={T.inkFaint} />
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkFaint, lineHeight: 1.4 }}>
          Resum diari elaborat a partir de fonts obertes. Fes clic a cada notícia per llegir la informació completa.
        </span>
      </div>
    </div>
  );
}
