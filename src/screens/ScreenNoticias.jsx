import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, NavHeader, Pill } from '../components/Shared';
import { NOTICIAS } from '../data/noticias';

const CAT_CONFIG = {
  operativa: { label: 'Política', icon: 'scale' },
  leyes:     { label: 'Economia', icon: 'trending-up' },
  atajos:    { label: 'Internacional', icon: 'globe' },
  transito:  { label: 'Esports', icon: 'trophy' },
  psico:     { label: 'Cultura · Ciència', icon: 'star' },
  alcohol:   { label: 'Successos', icon: 'siren' },
  physical:  { label: 'Tecnologia', icon: 'cpu' },
};

const FILTER_TABS = [
  { key: 'all', label: 'Tot' },
  { key: 'operativa', label: 'Política' },
  { key: 'leyes', label: 'Economia' },
  { key: 'atajos', label: 'Internacional' },
  { key: 'transito', label: 'Esports' },
  { key: 'psico', label: 'Cultura' },
  { key: 'alcohol', label: 'Successos' },
];

import { useState } from 'react';

function NewsCard({ n }) {
  const k = T.cat[n.cat] || T.cat.operativa;
  const cfg = CAT_CONFIG[n.cat] || CAT_CONFIG.operativa;
  return (
    <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: k.solid,
            letterSpacing: 0.6, textTransform: 'uppercase',
          }}>{n.tag}</span>
          <span style={{
            fontSize: 10, color: T.inkFaint, fontWeight: 600,
          }}>· {n.area}</span>
          <span style={{
            fontFamily: T.fontMono, fontSize: 10,
            color: T.inkMuted, marginLeft: 'auto',
          }}>{n.date}</span>
        </div>
        <div style={{
          fontWeight: 700, fontSize: 14, color: T.ink,
          lineHeight: 1.3, marginBottom: 4,
        }}>{n.title}</div>
        <div style={{
          fontSize: 12, color: T.inkMuted, lineHeight: 1.45,
        }}>{n.desc}</div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 11,
        }}>
          Llegir més <Icon name="arrow-right" size={12} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeFilter);

  const latestDate = NOTICIAS[0]?.date || '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '10px 16px 6px',
      }}>
        <InfoPolWordmark height={18} />
        <button onClick={() => navigate(-1)} style={{
          width: 34, height: 34, borderRadius: 999,
          background: '#fff', border: 'none',
          boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={16} color={T.ink} />
        </button>
      </div>

      {/* header */}
      <div style={{ padding: '4px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          Actualitzat · {latestDate.replace('·', ' agost')} 2026
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 28, letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Notícies del<br/>
          <span style={{ color: T.cat.academia.solid }}>dia</span>.
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 8, lineHeight: 1.5,
        }}>
          Catalunya · Espanya · Internacional — política, economia, esports, cultura i successos.
        </p>
      </div>

      {/* filter tabs */}
      <div style={{
        overflowX: 'auto', paddingLeft: 16,
        display: 'flex', gap: 6, paddingBottom: 12,
        WebkitOverflowScrolling: 'touch',
      }}>
        {FILTER_TABS.map(f => {
          const isActive = activeFilter === f.key;
          const k = f.key === 'all' ? null : T.cat[f.key];
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: 0.2,
                background: isActive
                  ? (k ? k.solid : T.ink)
                  : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                boxShadow: isActive ? 'none' : T.shadow.card,
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          );
        })}
        <div style={{ width: 10, flexShrink: 0 }} />
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: T.inkMuted, fontSize: 14,
          }}>
            No hi ha notícies en aquesta categoria.
          </div>
        ) : (
          filtered.map((n, i) => <NewsCard key={i} n={n} />)
        )}
      </div>

      {/* footer note */}
      <div style={{
        margin: '20px 16px 0',
        padding: 14,
        background: '#fff',
        borderRadius: T.r.md,
        boxShadow: T.shadow.card,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Icon name="info" size={16} color={T.inkMuted} strokeWidth={2} />
        <p style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.45, margin: 0 }}>
          Les notícies s'actualitzen cada nit a les 22h. Els resums són orientatius; fes clic a cada notícia per llegir la informació completa a la font original.
        </p>
      </div>
    </div>
  );
}
