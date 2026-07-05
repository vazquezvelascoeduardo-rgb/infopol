import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { GENERAL_NEWS } from '../data/generalNews';

const AREAS = ['Totes', 'Catalunya', 'Espanya', 'Internacional'];

const AREA_COLOR = {
  Catalunya: T.cat.operativa.solid,
  Espanya:   T.cat.leyes.solid,
  Internacional: T.cat.noticias.solid,
};

const TAG_COLOR = {
  'Política':      T.cat.operativa.solid,
  'Judicial':      T.cat.alcohol.solid,
  'Policial':      T.cat.alcohol.solid,
  'Economia':      T.cat.leyes.solid,
  'Esports':       T.cat.atajos.solid,
  'Cultura':       T.cat.transito.solid,
  'Societat':      T.cat.transito.solid,
  'Ciència':       T.cat.physical.solid,
  'Descobriment':  T.cat.physical.solid,
  'Premis':        T.cat.psico.solid,
  'Internacional': T.cat.noticias.solid,
  'Conflicte':     T.cat.alcohol.solid,
};

function NewsCard({ n }) {
  const areaColor = AREA_COLOR[n.area] || T.cat.noticias.solid;
  const tagColor  = TAG_COLOR[n.tag]   || T.cat.noticias.solid;

  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.md,
      padding: 14,
      borderLeft: `3px solid ${areaColor}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase',
          background: `${areaColor}18`, color: areaColor,
          padding: '2px 7px', borderRadius: 999,
        }}>{n.area}</span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          color: tagColor,
        }}>{n.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 9.5, color: T.inkFaint, marginLeft: 'auto' }}>
          {n.dateLabel}
        </span>
      </div>

      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
        {n.title}
      </div>
      <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>
        {n.desc}
      </div>

      {n.url && (
        <a
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 8, fontSize: 11.5, fontWeight: 700,
            color: areaColor, textDecoration: 'none',
          }}
        >
          Llegir més <Icon name="arrow-right" size={13} color={areaColor} />
        </a>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate  = useNavigate();
  const [area, setArea] = useState('Totes');

  const filtered = area === 'Totes'
    ? GENERAL_NEWS
    : GENERAL_NEWS.filter(n => n.area === area);

  const lastUpdate = GENERAL_NEWS[0]?.dateLabel ?? '—';

  return (
    <div className="screen-no-tabs">
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
        >
          <Icon name="arrow-left" size={22} color={T.ink} />
        </button>
        <InfoPolWordmark height={16} />
      </div>

      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2,
          textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 3,
        }}>
          Actualitzat · {lastUpdate}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24,
          letterSpacing: -0.5, margin: 0,
        }}>
          Notícies del dia
        </h1>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filter chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {AREAS.map(a => {
          const active = a === area;
          const col = a === 'Totes' ? T.cat.noticias.solid : (AREA_COLOR[a] || T.cat.noticias.solid);
          return (
            <button
              key={a}
              onClick={() => setArea(a)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 999,
                border: `1.5px solid ${active ? col : T.hairlineStrong}`,
                background: active ? col : '#fff',
                color: active ? '#fff' : T.inkSoft,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: T.font,
              }}
            >
              {a}
            </button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 13, padding: '40px 0' }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} n={n} />)
        )}
      </div>
    </div>
  );
}
