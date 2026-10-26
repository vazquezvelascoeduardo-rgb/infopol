import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, Pill, SectionHead } from '../../components/Shared';
import { NOTICIAS } from '../../data/noticias';

const GEO_TABS = [
  { id: 'all', label: 'Tot' },
  { id: 'catalunya', label: 'Catalunya' },
  { id: 'espanya', label: 'Espanya' },
  { id: 'internacional', label: 'Internacional' },
];

function NoticiaCard({ n }) {
  const k = T.cat[n.color] || T.cat.operativa;
  return (
    <a
      href={n.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', textDecoration: 'none',
        background: '#fff', borderRadius: T.r.lg,
        padding: 16, borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: k.solid,
          letterSpacing: 0.6, textTransform: 'uppercase',
          fontFamily: T.font,
        }}>{n.tag}</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700,
          background: k.soft, color: k.ink,
          padding: '2px 7px', borderRadius: 999,
          fontFamily: T.font, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>{n.catLabel}</span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10,
          color: T.inkMuted, marginLeft: 'auto',
        }}>{n.date}</span>
      </div>
      <div style={{
        fontWeight: 700, fontSize: 14.5, color: T.ink,
        lineHeight: 1.35, fontFamily: T.font,
      }}>{n.title}</div>
      <div style={{
        fontSize: 12.5, color: T.inkMuted, marginTop: 5,
        lineHeight: 1.5,
      }}>{n.desc}</div>
      <div style={{
        marginTop: 10, display: 'flex', alignItems: 'center',
        gap: 4, color: k.solid, fontWeight: 700, fontSize: 11.5,
        fontFamily: T.font,
      }}>
        Llegir notícia completa
        <Icon name="arrow-right" size={13} color={k.solid} />
      </div>
    </a>
  );
}

function GeoLabel({ geo }) {
  const MAP = {
    catalunya: { label: 'Catalunya', color: T.cat.operativa.solid },
    espanya:   { label: 'Espanya',   color: T.cat.leyes.solid },
    internacional: { label: 'Internacional', color: T.cat.transito.solid },
  };
  const m = MAP[geo];
  if (!m) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '12px 16px 4px',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: m.color, flexShrink: 0 }} />
      <span style={{
        fontFamily: T.font, fontWeight: 800, fontSize: 11,
        letterSpacing: 1.1, textTransform: 'uppercase', color: T.inkMuted,
      }}>{m.label}</span>
      <div style={{ flex: 1, height: 1, background: T.hairline }} />
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeGeo, setActiveGeo] = useState('all');

  const filtered = activeGeo === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.geo === activeGeo);

  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.geo]) acc[n.geo] = [];
    acc[n.geo].push(n);
    return acc;
  }, {});

  const geoOrder = ['catalunya', 'espanya', 'internacional'];

  const today = NOTICIAS[0]?.date || '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Nav */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
            letterSpacing: 1.1, textTransform: 'uppercase', color: T.cat.atajos.solid,
          }}>InfoPol · Actualitat</div>
          <h1 style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24,
            letterSpacing: -0.6, margin: 0, lineHeight: 1.1,
          }}>Notícies</h1>
        </div>
        <div style={{
          marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 11,
          color: T.inkMuted, background: '#fff', padding: '5px 10px',
          borderRadius: T.r.pill, boxShadow: T.shadow.card,
        }}>{today}</div>
      </div>

      {/* Geo filter tabs */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {GEO_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveGeo(t.id)}
            style={{
              padding: '7px 14px', borderRadius: T.r.pill, border: 'none',
              cursor: 'pointer', flexShrink: 0,
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              background: activeGeo === t.id ? T.cat.atajos.solid : '#fff',
              color: activeGeo === t.id ? '#fff' : T.inkSoft,
              boxShadow: T.shadow.card,
              transition: 'background 0.15s, color 0.15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* News list */}
      {activeGeo === 'all' ? (
        geoOrder.map(geo => grouped[geo] ? (
          <div key={geo}>
            <GeoLabel geo={geo} />
            <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {grouped[geo].map(n => <NoticiaCard key={n.id} n={n} />)}
            </div>
          </div>
        ) : null)
      ) : (
        <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(n => <NoticiaCard key={n.id} n={n} />)}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '24px 16px 8px',
        textAlign: 'center',
        fontFamily: T.font, fontSize: 11.5, color: T.inkMuted, lineHeight: 1.6,
      }}>
        Notícies recollides automàticament cada dia a les 22:00h.<br />
        <span style={{ color: T.inkFaint }}>Font: EFE, Infobae, El Nacional, CNN en Español</span>
      </div>
    </div>
  );
}
