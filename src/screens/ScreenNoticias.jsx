import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, NavHeader } from '../components/Shared';
import { NOTICIAS, CAT_NOTICIAS } from '../data/noticias';

const FILTERS = [
  { id: 'tot', label: 'Tot' },
  { id: 'catalunya', label: 'Catalunya' },
  { id: 'espanya', label: 'Espanya' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'esports', label: 'Esports' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'successos', label: 'Successos' },
];

function CatPill({ cat }) {
  const k = CAT_NOTICIAS[cat] || CAT_NOTICIAS.internacional;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: T.r.pill,
      background: k.soft,
      color: k.ink,
      fontFamily: T.font,
      fontWeight: 800,
      fontSize: 9.5,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    }}>{k.label}</span>
  );
}

function NoticiaCard({ n }) {
  const k = CAT_NOTICIAS[n.cat] || CAT_NOTICIAS.internacional;
  return (
    <a
      href={n.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.color}`,
        boxShadow: T.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CatPill cat={n.cat} />
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: k.color,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>{n.tag}</span>
          <span style={{
            fontFamily: T.fontMono,
            fontSize: 10,
            color: T.inkMuted,
            marginLeft: 'auto',
          }}>{n.date}</span>
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: 13.5,
          color: T.ink,
          lineHeight: 1.3,
        }}>{n.title}</div>
        <div style={{
          fontSize: 11.5,
          color: T.inkMuted,
          lineHeight: 1.45,
        }}>{n.desc}</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: k.color,
          fontWeight: 700,
          fontSize: 11,
          marginTop: 2,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={k.color} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [active, setActive] = useState('tot');

  const filtered = active === 'tot'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === active);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, background: '#fff',
          border: `1px solid ${T.hairline}`, boxShadow: T.shadow.card,
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · 16 de setembre de 2026
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 12.5, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional — actualitzat a les 22:00 h
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ padding: '0 16px 14px', overflowX: 'auto', display: 'flex', gap: 8 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: T.r.pill,
              border: 'none',
              cursor: 'pointer',
              fontFamily: T.font,
              fontWeight: 700,
              fontSize: 12,
              background: active === f.id ? T.cat.operativa.solid : '#fff',
              color: active === f.id ? '#fff' : T.inkSoft,
              boxShadow: T.shadow.card,
              transition: 'background 0.15s, color 0.15s',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(n => (
          <NoticiaCard key={n.id} n={n} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 24, fontFamily: T.font, fontSize: 11, color: T.inkFaint }}>
        · InfoPol Noticias · Actualitzat cada dia a les 22:00 h ·
      </div>
    </div>
  );
}
