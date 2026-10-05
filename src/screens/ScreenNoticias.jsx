import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CATS_NOTICIAS } from '../data/noticias';

const ALL_CATS = ['totes', ...Object.keys(CATS_NOTICIAS)];

function CatPill({ cat, active, onClick }) {
  const def = CATS_NOTICIAS[cat];
  const color = def ? T.cat[def.color].solid : T.cat.operativa.solid;
  const label = def ? def.label : 'Totes';
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 999,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3,
      background: active ? color : T.card,
      color: active ? '#fff' : T.inkMuted,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
      flexShrink: 0,
    }}>
      {label}
    </button>
  );
}

function NewsCard({ item }) {
  const def = CATS_NOTICIAS[item.cat];
  const colorKey = def ? def.color : 'operativa';
  const k = T.cat[colorKey];
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: T.card, borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8, background: k.soft,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name={item.icon} size={14} color={k.solid} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: k.ink, letterSpacing: 0.6, textTransform: 'uppercase', flex: 1, minWidth: 0 }}>
            {item.tag}
          </span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, flexShrink: 0 }}>{item.date}</span>
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45, marginBottom: 8 }}>
          {item.desc}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontSize: 11.5, fontWeight: 700 }}>
          Llegir notícia completa <Icon name="external-link" size={12} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const today = new Date().toLocaleDateString('ca-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {today}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontSize: 13, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.45 }}>
          Catalunya, Espanya i Internacional
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ paddingBottom: 14, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {ALL_CATS.map(cat => (
            <CatPill
              key={cat}
              cat={cat}
              active={activeCat === cat}
              onClick={() => setActiveCat(cat)}
            />
          ))}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: T.hairline }} />
        <span style={{ fontSize: 11, color: T.inkFaint, fontFamily: T.fontMono }}>InfoPol · {today}</span>
        <div style={{ flex: 1, height: 1, background: T.hairline }} />
      </div>
    </div>
  );
}
