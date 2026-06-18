import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader } from '../../components/Shared';
import { NEWS, NEWS_CATS } from '../../data/news';

const ALL_CAT = { label: 'Totes', solid: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink };
const SCOPES = [
  { id: 'tot', label: 'Tot' },
  { id: 'cat', label: 'CAT' },
  { id: 'esp', label: 'ESP' },
  { id: 'int', label: 'INT' },
];
const SCOPE_LABELS = { cat: 'CAT', esp: 'ESP', int: 'INT' };

function NewsCard({ item }) {
  const cat = NEWS_CATS[item.cat] || NEWS_CATS.normatiu;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: 14,
      borderLeft: `3px solid ${cat.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
          background: cat.soft, color: cat.ink,
          padding: '3px 7px', borderRadius: T.r.pill, flexShrink: 0,
        }}>{cat.label}</span>
        {item.scope && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
            background: 'rgba(19,19,26,0.06)', color: T.inkMuted,
            padding: '3px 6px', borderRadius: T.r.pill, flexShrink: 0,
          }}>{SCOPE_LABELS[item.scope]}</span>
        )}
        <span style={{
          fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto', flexShrink: 0,
        }}>{item.dateLabel}</span>
      </div>

      {item.tag && (
        <div style={{
          fontSize: 10.5, fontWeight: 800, color: cat.solid,
          letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3,
        }}>{item.tag}</div>
      )}

      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.45 }}>
        {item.desc}
      </div>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 10, color: cat.solid, fontWeight: 700, fontSize: 12,
            textDecoration: 'none',
          }}
        >
          Llegir notícia <Icon name="arrow-right" size={13} color={cat.solid} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticies() {
  const [activeCat, setActiveCat] = useState('totes');
  const [activeScope, setActiveScope] = useState('tot');

  const catEntries = [['totes', ALL_CAT], ...Object.entries(NEWS_CATS)];

  const filtered = [...NEWS]
    .filter(n => activeCat === 'totes' || n.cat === activeCat)
    .filter(n => activeScope === 'tot' || n.scope === activeScope)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Notícies" back />

      {/* Filtre per categoria */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 12px',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {catEntries.map(([key, c]) => {
          const isActive = activeCat === key;
          return (
            <button key={key} onClick={() => setActiveCat(key)} style={{
              flexShrink: 0,
              padding: '7px 13px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
              background: isActive ? c.solid : '#fff',
              color: isActive ? '#fff' : T.inkMuted,
              fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
              boxShadow: T.shadow.card,
              transition: 'background 0.15s, color 0.15s',
            }}>{c.label}</button>
          );
        })}
      </div>

      {/* Filtre per àmbit */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px' }}>
        {SCOPES.map(s => {
          const isActive = activeScope === s.id;
          return (
            <button key={s.id} onClick={() => setActiveScope(s.id)} style={{
              padding: '5px 14px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
              background: isActive ? T.cat.operativa.solid : T.hairline,
              color: isActive ? '#fff' : T.inkMuted,
              fontFamily: T.font, fontWeight: 700, fontSize: 11,
              transition: 'background 0.15s, color 0.15s',
            }}>{s.label}</button>
          );
        })}
      </div>

      {/* Llistat de notícies */}
      <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: T.inkMuted, fontSize: 14, lineHeight: 1.5,
          }}>
            <Icon name="newspaper" size={32} color={T.inkFaint} strokeWidth={1.5} />
            <div style={{ marginTop: 12 }}>Cap notícia per a aquest filtre</div>
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} item={n} />)
        )}
      </div>
    </div>
  );
}
