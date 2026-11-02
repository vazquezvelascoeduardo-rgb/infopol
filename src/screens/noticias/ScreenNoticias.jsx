import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../../components/Shared';
import { NOTICIAS, NOTICIA_CATS, filterNoticias } from '../../data/news';

const CAT_COLOR = {
  operativa: T.cat.operativa,
  alcohol:   T.cat.alcohol,
  leyes:     T.cat.leyes,
  atajos:    T.cat.atajos,
  transito:  T.cat.transito,
  physical:  T.cat.physical,
  psico:     T.cat.psico,
  academia:  T.cat.academia,
};

function NoticiaCard({ n }) {
  const k = CAT_COLOR[n.cat] || T.cat.operativa;
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
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
          textTransform: 'uppercase', color: k.solid,
          background: k.soft, padding: '3px 7px', borderRadius: 999,
        }}>
          {n.tag}
        </span>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10.5, color: T.inkMuted, marginLeft: 'auto',
        }}>
          {n.date}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <Icon name="map-pin" size={10} color={T.inkFaint} />
        <span style={{ fontSize: 10.5, color: T.inkMuted, fontWeight: 600 }}>{n.geo}</span>
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
        {n.title}
      </div>
      <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5, marginBottom: 10 }}>
        {n.desc}
      </div>

      <a
        href={n.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 12,
          textDecoration: 'none',
        }}
      >
        Llegir la notícia completa
        <Icon name="external-link" size={12} color={k.solid} />
      </a>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        fontFamily: T.font,
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: 0.2,
        background: active ? color : '#fff',
        color: active ? '#fff' : T.inkSoft,
        boxShadow: active ? 'none' : T.shadow.card,
        flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('all');

  const today = new Date();
  const dateStr = today.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const displayed = filterNoticias(NOTICIAS, activeCat);

  return (
    <div className="screen" style={{ paddingBottom: 100 }}>
      <StatusBar />

      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <div style={{
          background: T.cat.alcohol.soft,
          color: T.cat.alcohol.ink,
          padding: '4px 9px',
          borderRadius: 999,
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}>
          En directe
        </div>
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.leyes.solid, marginBottom: 4,
        }}>
          Actualitat · {dateStr}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 12.5, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filtres per categoria */}
      <div style={{
        overflowX: 'auto',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 4,
        display: 'flex',
        gap: 8,
        scrollbarWidth: 'none',
      }}>
        {NOTICIA_CATS.map(c => (
          <FilterChip
            key={c.id}
            label={c.label}
            active={activeCat === c.id}
            color={T.cat.leyes.solid}
            onClick={() => setActiveCat(c.id)}
          />
        ))}
      </div>

      {/* Llista de noticias */}
      <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '40px 0' }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          displayed.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>

      {/* Peu */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.6, margin: 0 }}>
          Resum diari elaborat per InfoPol. Fes clic a cada notícia per llegir la font original.
          <br />Actualitzat cada dia a les 22:00 h.
        </p>
      </div>
    </div>
  );
}
