import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn } from '../components/Shared';
import { NEWS_ITEMS, CAT_NEWS } from '../data/news';

const FILTERS = [
  { id: 'tots', label: 'Tots' },
  { id: 'politica', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'esport', label: 'Esport' },
  { id: 'policial', label: 'Policial' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'clima', label: 'Clima' },
];

const SCOPE_ICONS = {
  Catalunya:     'map',
  Espanya:       'flag',
  Barcelona:     'map-pin',
  Internacional: 'globe',
};

function NewsCard({ item }) {
  const k = CAT_NEWS[item.cat] || CAT_NEWS.politica;
  const scopeIcon = SCOPE_ICONS[item.scope] || 'map';
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.lg,
      padding: 14,
      borderLeft: `3px solid ${k.color}`,
      boxShadow: T.shadow.card,
    }}>
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase',
          background: k.bg, color: k.ink,
          padding: '3px 7px', borderRadius: 999,
        }}>{k.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 2 }}>
          <Icon name={scopeIcon} size={11} color={T.inkMuted} />
          <span style={{ fontSize: 10.5, color: T.inkMuted, fontWeight: 600 }}>{item.scope}</span>
        </div>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
      </div>

      {/* title */}
      <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>
        {item.title}
      </div>

      {/* summary */}
      <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5, marginBottom: 10 }}>
        {item.summary}
      </div>

      {/* link */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11.5, fontWeight: 700, color: k.color,
          textDecoration: 'none',
        }}
      >
        Llegir la notícia completa <Icon name="external-link" size={12} color={k.color} />
      </a>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer',
      padding: '7px 13px', borderRadius: 999,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
      whiteSpace: 'nowrap',
      background: active ? color : '#fff',
      color: active ? '#fff' : T.inkSoft,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [active, setActive] = useState('tots');

  const today = new Date();
  const dateStr = `${today.getDate()} d'octubre de ${today.getFullYear()}`;

  const filtered = active === 'tots'
    ? NEWS_ITEMS
    : NEWS_ITEMS.filter(n => n.cat === active);

  const activeColor = active !== 'tots' && CAT_NEWS[active]
    ? CAT_NEWS[active].color
    : T.cat.operativa.solid;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      {/* header */}
      <div style={{ padding: '4px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {dateStr}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.7, margin: 0, lineHeight: 1.05 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* filter chips */}
      <div style={{ paddingLeft: 16, paddingBottom: 14, overflowX: 'auto', display: 'flex', gap: 7 }}>
        {FILTERS.map(f => {
          const col = f.id !== 'tots' && CAT_NEWS[f.id] ? CAT_NEWS[f.id].color : T.cat.operativa.solid;
          return (
            <FilterChip
              key={f.id}
              label={f.label}
              active={active === f.id}
              color={col}
              onClick={() => setActive(f.id)}
            />
          );
        })}
      </div>

      {/* count */}
      <div style={{ padding: '0 16px 10px', fontSize: 11.5, color: T.inkMuted, fontWeight: 600 }}>
        {filtered.length} {filtered.length === 1 ? 'notícia' : 'notícies'}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length > 0
          ? filtered.map(item => <NewsCard key={item.id} item={item} />)
          : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted }}>
              <Icon name="newspaper" size={36} color={T.inkFaint} />
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700 }}>Sense notícies en aquesta categoria</div>
            </div>
          )
        }
      </div>

      {/* footer */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Actualitzat el {dateStr} a les 22:00 h.<br />
          Fonts: EFE, El Nacional, El Economista, Infobae, FC Barcelona.
        </div>
      </div>
    </div>
  );
}
