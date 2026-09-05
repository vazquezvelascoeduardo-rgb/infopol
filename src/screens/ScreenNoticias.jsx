import { useState } from 'react';
import { T } from '../tokens';
import { StatusBar, NavHeader, Pill } from '../components/Shared';
import Icon from '../components/Icon';
import { NOTICIAS } from '../data/news';

const ZONES = ['Totes', 'Catalunya', 'Espanya', 'Internacional'];
const CATS  = ['Totes', 'Política', 'Economia', 'Judicial', 'Esports', 'Cultura', 'Ciència'];

function FilterPill({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer',
      padding: '7px 14px', borderRadius: T.r.pill,
      background: active ? (color || T.cat.operativa.solid) : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      letterSpacing: 0.2, whiteSpace: 'nowrap',
      boxShadow: active ? 'none' : T.shadow.card,
      border: active ? 'none' : `1px solid ${T.hairline}`,
      transition: 'all 0.15s',
      flexShrink: 0,
    }}>{label}</button>
  );
}

function NewsCard({ item }) {
  const k = T.cat[item.cat] || T.cat.operativa;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: '#fff', borderRadius: T.r.md,
        padding: 14, borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Top row: category pill + zone badge + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: 0.9, textTransform: 'uppercase',
            color: k.ink, background: k.soft,
            padding: '3px 8px', borderRadius: T.r.pill,
          }}>{item.catLabel}</span>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
            color: T.inkMuted, background: T.bg,
            padding: '3px 8px', borderRadius: T.r.pill, border: `1px solid ${T.hairline}`,
          }}>{item.zona}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint, marginLeft: 'auto' }}>
            {item.date}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14.5,
          color: T.ink, lineHeight: 1.3, letterSpacing: -0.2,
        }}>{item.title}</div>

        {/* Summary */}
        <div style={{
          fontSize: 12, color: T.inkMuted, lineHeight: 1.5,
        }}>{item.desc}</div>

        {/* Read more link */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 12, marginTop: 2,
        }}>
          Llegir notícia completa
          <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeZone, setActiveZone] = useState('Totes');
  const [activeCat,  setActiveCat]  = useState('Totes');

  const today = new Date();
  const dateLabel = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const filtered = NOTICIAS.filter(n => {
    const byZone = activeZone === 'Totes' || n.zona === activeZone;
    const byCat  = activeCat  === 'Totes' || n.catLabel === activeCat;
    return byZone && byCat;
  });

  return (
    <div className="screen">
      <StatusBar />

      <NavHeader cat="operativa" kicker="Actualitat · InfoPol" title="Noticias del dia" back />

      {/* Date chip */}
      <div style={{ padding: '0 16px 12px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: T.cat.operativa.soft, color: T.cat.operativa.ink,
          padding: '5px 12px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 700, fontSize: 11,
        }}>
          <Icon name="calendar" size={12} color={T.cat.operativa.ink} strokeWidth={2.4} />
          {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
        </span>
      </div>

      {/* Zone filter */}
      <div style={{ padding: '0 16px 6px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Zona geogràfica</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {ZONES.map(z => (
            <FilterPill key={z} label={z} active={activeZone === z} onClick={() => setActiveZone(z)} />
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.inkMuted, marginBottom: 8 }}>Categoria</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {CATS.map(c => (
            <FilterPill key={c} label={c} active={activeCat === c} onClick={() => setActiveCat(c)} />
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding: '0 16px 10px' }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          {filtered.length} {filtered.length === 1 ? 'notícia' : 'notícies'}
        </span>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            Cap notícia per als filtres seleccionats.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Source note */}
      <div style={{ padding: '0 16px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 10.5, color: T.inkFaint, lineHeight: 1.5 }}>
          Resum elaborat per InfoPol a partir de fonts obertes.{'\n'}Clica cada notícia per accedir a la font original.
        </span>
      </div>
    </div>
  );
}
