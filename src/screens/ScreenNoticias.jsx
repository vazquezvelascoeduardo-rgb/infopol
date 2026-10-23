import { useState } from 'react';
import { T } from '../tokens';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { NEWS, CATEGORIES } from '../data/news';

const CAT_COLORS = {
  politica:      { solid: '#3B6BF5', soft: '#EEF2FF', ink: '#0E2B7A' },
  economia:      { solid: '#1FB286', soft: '#E8FBF5', ink: '#0B5A3D' },
  internacional: { solid: '#9C4FE0', soft: '#F5EEFF', ink: '#4A1B7A' },
  policial:      { solid: '#E04F5F', soft: '#FFF0F0', ink: '#7A1B22' },
  premis:        { solid: '#FF7A1A', soft: '#FFF3EA', ink: '#7A2E04' },
  cultura:       { solid: '#E0A020', soft: '#FFFBEA', ink: '#5C4400' },
  esports:       { solid: '#1E9E5B', soft: '#E8FBF0', ink: '#0B4A28' },
};

const ALL = 'tot';

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 13px',
      borderRadius: 999,
      border: 'none',
      background: active ? color : T.card,
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 0.4,
      cursor: 'pointer',
      boxShadow: active ? 'none' : T.shadow.card,
      flexShrink: 0,
      transition: 'background 0.15s, color 0.15s',
    }}>
      {label}
    </button>
  );
}

function NoticiaCard({ noticia }) {
  const colors = CAT_COLORS[noticia.cat] || CAT_COLORS.politica;
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: T.card,
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${colors.solid}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            background: colors.soft,
            color: colors.ink,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 999,
          }}>{noticia.tag}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{noticia.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35, marginBottom: 4 }}>
          {noticia.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {noticia.desc}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: colors.solid, fontWeight: 700, fontSize: 11 }}>
          Llegir notícia completa →
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState(ALL);

  const filtered = activeCat === ALL
    ? NEWS
    : NEWS.filter(n => n.cat === activeCat);

  const latestDate = NEWS[0]?.date ?? '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>
          Actualitzat {latestDate}
        </span>
      </div>

      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.academia.solid, marginBottom: 4 }}>
          Notícies del dia
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0, color: T.ink }}>
          Última hora
        </h1>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filtres per categoria */}
      <div style={{ paddingLeft: 16, paddingBottom: 14, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <FilterChip
          label="Tot"
          active={activeCat === ALL}
          color={T.ink}
          onClick={() => setActiveCat(ALL)}
        />
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <FilterChip
            key={key}
            label={val.label}
            active={activeCat === key}
            color={CAT_COLORS[key]?.solid ?? T.ink}
            onClick={() => setActiveCat(key)}
          />
        ))}
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 13 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* Peu */}
      <div style={{ margin: '20px 16px 0', padding: '12px 14px', background: T.card, borderRadius: T.r.md, boxShadow: T.shadow.card }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Les notícies s\'actualitzen cada dia a les 22h. Els resums són elaborats per InfoPol a partir de fonts obertes. Fes clic a cada notícia per llegir la informació completa a la font original.
        </div>
      </div>
    </div>
  );
}
