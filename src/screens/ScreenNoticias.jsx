import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS } from '../data/noticias';

const CAT_LABELS = {
  operativa: 'Política',
  leyes: 'Economia',
  alcohol: 'Policial',
  academia: 'Internacional',
  transito: 'Esports',
  physical: 'Ciència',
  psico: 'Cultura',
  atajos: 'General',
};

const FILTERS = [
  { key: 'all', label: 'Tot' },
  { key: 'operativa', label: 'Política' },
  { key: 'leyes', label: 'Economia' },
  { key: 'alcohol', label: 'Policial' },
  { key: 'academia', label: 'Internacional' },
  { key: 'transito', label: 'Esports' },
  { key: 'physical', label: 'Ciència' },
];

function NewsCard({ item }) {
  const k = T.cat[item.cat] || T.cat.operativa;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.lg,
      padding: 16,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
          textTransform: 'uppercase', color: k.solid,
          background: k.soft, padding: '3px 7px', borderRadius: 999,
        }}>{item.tag}</span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10,
          color: T.inkMuted, marginLeft: 'auto',
        }}>{item.date}</span>
      </div>
      <div style={{
        fontWeight: 700, fontSize: 14, color: T.ink,
        lineHeight: 1.3, marginBottom: 6,
      }}>{item.title}</div>
      <div style={{
        fontSize: 12, color: T.inkMuted,
        lineHeight: 1.5, marginBottom: 10,
      }}>{item.desc}</div>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 12,
          textDecoration: 'none',
        }}>
          Llegir més <Icon name="arrow-right" size={13} color={k.solid} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === filter);

  const accent = T.cat.atajos.solid;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Nav */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      {/* Header */}
      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.4, textTransform: 'uppercase',
          color: accent, marginBottom: 4,
        }}>Actualitat · {new Date().toLocaleDateString('ca-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 28, letterSpacing: -0.8, margin: 0,
        }}>Notícies <span style={{ color: accent }}>del dia</span></h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, marginBottom: 0, lineHeight: 1.5,
        }}>Catalunya, Espanya i Internacional · Actualitzat cada dia a les 22 h</p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px 16px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {FILTERS.map(f => {
          const active = filter === f.key;
          const k = f.key !== 'all' ? T.cat[f.key] : null;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: T.r.pill,
              border: 'none', cursor: 'pointer',
              background: active ? (k ? k.solid : accent) : '#fff',
              color: active ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              boxShadow: T.shadow.card,
              transition: 'all 0.15s',
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ padding: '0 16px 10px' }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          {filtered.length} {filtered.length === 1 ? 'notícia' : 'notícies'}
        </span>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        margin: '24px 16px 0', padding: 14,
        background: '#fff', borderRadius: T.r.md,
        boxShadow: T.shadow.card, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Les notícies s'actualitzen cada dia a les 22:00 h.<br />
          Font: EFE, El Nacional, Infobae, The Objective i altres mitjans verificats.
        </div>
      </div>
    </div>
  );
}
