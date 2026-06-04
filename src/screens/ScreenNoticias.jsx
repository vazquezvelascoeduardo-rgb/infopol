import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, NavHeader } from '../components/Shared';
import { NOTICIAS } from '../data/noticias';

const CAT_COLOR = {
  politica:      T.cat.operativa,
  economia:      T.cat.leyes,
  cultura:       T.cat.psico,
  descobriments: T.cat.physical,
  premis:        T.cat.academia,
  esports:       T.cat.atajos,
  policial:      T.cat.alcohol,
  internacional: T.cat.transito,
};

const GEO_FILTERS = ['Tots', 'Catalunya', 'Espanya', 'Internacional'];

const CAT_FILTERS = [
  { id: 'tots',         label: 'Tots' },
  { id: 'politica',    label: 'Política' },
  { id: 'economia',    label: 'Economia' },
  { id: 'esports',     label: 'Esports' },
  { id: 'cultura',     label: 'Cultura' },
  { id: 'policial',    label: 'Successos' },
  { id: 'descobriments', label: 'Ciència' },
  { id: 'premis',      label: 'Premis' },
  { id: 'internacional', label: 'Internacional' },
];

const MONTHS_CA = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];

function formatDateCA(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} de ${MONTHS_CA[m - 1]} de ${y}`;
}

function NewsCard({ item }) {
  const catK = CAT_COLOR[item.cat] || T.cat.operativa;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${catK.solid}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: catK.ink, background: catK.soft,
            padding: '3px 8px', borderRadius: 999,
            letterSpacing: 0.4, textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>{item.tag}</span>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: T.inkMuted, background: T.bg,
            padding: '3px 8px', borderRadius: 999,
            whiteSpace: 'nowrap',
          }}>{item.geo}</span>
          <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>{item.title}</div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.45 }}>{item.desc}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: catK.solid, fontWeight: 700, fontSize: 11 }}>
          Llegir article <Icon name="arrow-right" size={12} color={catK.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [geo, setGeo] = useState('Tots');
  const [cat, setCat] = useState('tots');

  const latestDate = NOTICIAS[0]?.dateISO || '';
  const filtered = NOTICIAS.filter(n =>
    (geo === 'Tots' || n.geo === geo) &&
    (cat === 'tots' || n.cat === cat)
  );

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Notícies" back />

      {latestDate && (
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ fontSize: 12, color: T.inkMuted, fontWeight: 600 }}>
            Edició del {formatDateCA(latestDate)}
          </div>
        </div>
      )}

      {/* Geo filter */}
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {GEO_FILTERS.map(g => (
            <button key={g} onClick={() => setGeo(g)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999,
              border: geo === g ? 'none' : `1px solid ${T.hairlineStrong}`,
              background: geo === g ? T.ink : '#fff',
              color: geo === g ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>{g}</button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {CAT_FILTERS.map(f => {
            const isActive = cat === f.id;
            const k = f.id !== 'tots' ? (CAT_COLOR[f.id] || T.cat.operativa) : null;
            return (
              <button key={f.id} onClick={() => setCat(f.id)} style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 999,
                border: isActive ? 'none' : `1px solid ${T.hairlineStrong}`,
                background: isActive ? (k ? k.solid : T.ink) : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                fontFamily: T.font, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>{f.label}</button>
            );
          })}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: T.inkMuted }}>
            <Icon name="search" size={36} color={T.inkFaint} />
            <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15 }}>Cap notícia per aquests filtres</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Prova canviant l'àmbit o la categoria.</div>
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
