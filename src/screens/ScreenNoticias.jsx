import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NEWS, CATEGORIES, CAT_STYLE } from '../data/news';

function CategoryChip({ id, label, icon, active, onClick }) {
  const st = CAT_STYLE[id] || { solid: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink };
  const isAll = id === 'tot';
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 13px', borderRadius: 999, border: 'none',
      background: active ? (isAll ? T.ink : st.solid) : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      boxShadow: T.shadow.card, cursor: 'pointer', flexShrink: 0,
      transition: 'background 0.15s, color 0.15s',
    }}>
      <Icon name={icon} size={13} color={active ? '#fff' : T.inkMuted} strokeWidth={2.3} />
      {label}
    </button>
  );
}

function NewsCard({ item, onClick }) {
  const st = CAT_STYLE[item.category] || CAT_STYLE.politica;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
      onClick={onClick}
    >
      <div style={{
        background: '#fff', borderRadius: T.r.lg, padding: 14,
        borderLeft: `3px solid ${st.solid}`, boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            background: st.soft, color: st.ink,
            padding: '3px 8px', borderRadius: 999,
            fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{item.tag}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {item.desc}
        </div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
          color: st.solid, fontWeight: 700, fontSize: 11,
        }}>
          Llegir notícia completa <Icon name="external-link" size={12} color={st.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('tot');

  const filtered = activeCat === 'tot' ? NEWS : NEWS.filter(n => n.category === activeCat);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      {/* title */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.6, margin: 0, lineHeight: 1.05 }}>
          Noticias
        </h1>
      </div>

      {/* category filter */}
      <div style={{ paddingLeft: 16, paddingBottom: 16, overflowX: 'auto', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <CategoryChip
            key={cat.id}
            {...cat}
            active={activeCat === cat.id}
            onClick={() => setActiveCat(cat.id)}
          />
        ))}
        <div style={{ width: 8, flexShrink: 0 }} />
      </div>

      {/* count */}
      <div style={{ padding: '0 16px 10px' }}>
        <span style={{ fontSize: 12, color: T.inkMuted, fontWeight: 600 }}>
          {filtered.length} notícia{filtered.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* footer disclaimer */}
      <div style={{ padding: '24px 16px 8px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Resum informatiu diari generat per InfoPol.<br />
          Per llegir la notícia completa, fes clic a l'enllaç de cada targeta.
        </span>
      </div>
    </div>
  );
}
