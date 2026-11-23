import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn, Pill } from '../../components/Shared';
import { NOTICIAS, CATEGORIES } from '../../data/noticias';

function NewsCard({ item }) {
  const k = T.cat[item.catColor] || T.cat.operativa;
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
        padding: 16,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontSize: 9.5, fontFamily: T.font, fontWeight: 800,
            letterSpacing: 0.8, textTransform: 'uppercase',
            color: k.ink, background: k.soft,
            padding: '3px 8px', borderRadius: 999,
          }}>{item.catLabel}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{item.date}</span>
        </div>
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 15, letterSpacing: -0.3, color: T.ink,
          lineHeight: 1.25, marginBottom: 6,
        }}>{item.title}</div>
        <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5 }}>{item.summary}</div>
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 12,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const today = NOTICIAS[0]?.date || '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      {/* title */}
      <div style={{ padding: '10px 18px 4px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: T.cat.physical.solid, marginBottom: 6 }}>
          Actualitat · {today}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0, color: T.ink }}>
          Notícies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, lineHeight: 1.45 }}>
          Catalunya, Espanya i internacional. Actualitzat cada dia a les 22h.
        </p>
      </div>

      {/* category filter */}
      <div style={{ padding: '8px 0 12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 18px', width: 'max-content' }}>
          {CATEGORIES.map(c => {
            const active = activeCat === c.id;
            const k = T.cat[c.color];
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  border: 'none', cursor: 'pointer',
                  padding: '8px 14px', borderRadius: T.r.pill,
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  background: active ? k.solid : '#fff',
                  color: active ? '#fff' : T.inkSoft,
                  boxShadow: T.shadow.card,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >{c.label}</button>
            );
          })}
        </div>
      </div>

      {/* count */}
      <div style={{ padding: '0 18px 10px', fontFamily: T.font, fontSize: 11, color: T.inkMuted, fontWeight: 700, letterSpacing: 0.4 }}>
        {filtered.length} notícia{filtered.length !== 1 ? 'cies' : ''} · avui
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* footer note */}
      <div style={{ margin: '20px 16px 0', padding: 14, background: T.cat.physical.soft, borderRadius: T.r.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="info" size={16} color={T.cat.physical.ink} />
          <span style={{ fontFamily: T.font, fontSize: 12, color: T.cat.physical.ink, lineHeight: 1.4 }}>
            Els resums són elaborats per InfoPol a partir de fonts públiques verificades. Fes clic a cada notícia per llegir la informació completa a la font original.
          </span>
        </div>
      </div>
    </div>
  );
}
