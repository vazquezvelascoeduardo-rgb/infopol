import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../../components/Shared';
import { NOTICIAS } from '../../data/news';

const AREAS = [
  { id: 'tot',           label: 'Tot',           color: T.cat.leyes.solid,    soft: T.cat.leyes.soft    },
  { id: 'catalunya',     label: 'Catalunya',     color: T.cat.operativa.solid, soft: T.cat.operativa.soft },
  { id: 'espanya',       label: 'Espanya',       color: T.cat.academia.solid, soft: T.cat.academia.soft  },
  { id: 'internacional', label: 'Internacional', color: T.cat.atajos.solid,   soft: T.cat.atajos.soft    },
  { id: 'esports',       label: 'Esports',       color: T.cat.transito.solid, soft: T.cat.transito.soft  },
];

function NewsCard({ n }) {
  const k = T.cat[n.cat] || T.cat.operativa;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: 14,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: k.ink,
          letterSpacing: 0.5, textTransform: 'uppercase',
          background: k.soft, padding: '3px 8px', borderRadius: T.r.pill,
        }}>{n.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>{n.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.55, marginBottom: 10 }}>{n.summary}</div>
      <a
        href={n.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          color: k.solid, fontWeight: 700, fontSize: 12,
          textDecoration: 'none',
        }}
      >
        Llegir notícia completa <Icon name="arrow-right" size={13} color={k.solid} />
      </a>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [area, setArea] = useState('tot');

  const filtered = area === 'tot' ? NOTICIAS : NOTICIAS.filter(n => n.area === area);
  const activeArea = AREAS.find(a => a.id === area);

  const today = new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 48 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#fff', border: `1px solid ${T.hairline}`, borderRadius: T.r.pill,
            padding: '6px 14px', fontFamily: T.font, fontWeight: 700, fontSize: 12,
            color: T.inkSoft, cursor: 'pointer', boxShadow: T.shadow.card,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <Icon name="arrow-left" size={14} color={T.inkSoft} /> Enrere
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 4 }}>
          Actualitat · {today}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies del dia
        </h1>
      </div>

      {/* Area filter chips */}
      <div style={{ padding: '0 0 14px 16px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, paddingRight: 16, width: 'max-content' }}>
          {AREAS.map(a => (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              style={{
                border: 'none', cursor: 'pointer', borderRadius: T.r.pill,
                padding: '8px 16px', fontFamily: T.font, fontWeight: 700, fontSize: 12,
                background: area === a.id ? a.color : '#fff',
                color: area === a.id ? '#fff' : T.inkSoft,
                boxShadow: T.shadow.card,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '32px 0' }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} n={n} />)
        )}
      </div>

      {/* Footer note */}
      <div style={{ padding: '20px 16px 0', fontSize: 11, color: T.inkFaint, textAlign: 'center', lineHeight: 1.7 }}>
        Resum de notícies del {today}.<br />
        Actualitzat automàticament cada nit per InfoPol.
      </div>
    </div>
  );
}
