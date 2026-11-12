import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CAT_COLOR } from '../data/noticias';

const CAT_LABEL = {
  politica:      'Política',
  policial:      'Policial · Legal',
  economia:      'Economia',
  internacional: 'Internacional',
  ciencia:       'Ciència',
  cultura:       'Cultura',
  esports:       'Esports',
  meteo:         'Meteorologia',
};

const GEO_FILTERS = ['Totes', 'Catalunya', 'Espanya', 'Internacional'];
const CAT_FILTERS = ['Totes', 'politica', 'policial', 'economia', 'internacional', 'ciencia', 'cultura', 'esports', 'meteo'];

function NewsCard({ item }) {
  const colorKey = CAT_COLOR[item.cat] || 'operativa';
  const k = T.cat[colorKey];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, color: k.ink, letterSpacing: 0.7,
            textTransform: 'uppercase', background: k.soft,
            padding: '3px 7px', borderRadius: 999,
          }}>{item.tag}</span>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.5,
            textTransform: 'uppercase', background: T.bg,
            padding: '3px 7px', borderRadius: 999,
          }}>{item.geo}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {item.date}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 5, lineHeight: 1.45 }}>{item.desc}</div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
          color: k.solid, fontWeight: 700, fontSize: 11,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

function FilterPill({ label, active, colorKey, onClick }) {
  const k = active && colorKey ? T.cat[colorKey] : null;
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      padding: '7px 13px', borderRadius: 999,
      border: 'none', cursor: 'pointer',
      background: active ? (k ? k.soft : T.ink) : '#fff',
      color: active ? (k ? k.ink : '#fff') : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 11,
      letterSpacing: 0.3, textTransform: active ? 'uppercase' : 'none',
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all .15s',
    }}>{label}</button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [geoFilter, setGeoFilter] = useState('Totes');
  const [catFilter, setCatFilter] = useState('Totes');

  const filtered = NOTICIAS.filter(n => {
    const geoOk = geoFilter === 'Totes' || n.geo === geoFilter;
    const catOk = catFilter === 'Totes' || n.cat === catFilter;
    return geoOk && catOk;
  });

  // Group by cat label for display
  const dateToday = '12·11';
  const todayItems = filtered.filter(n => n.date === dateToday);
  const olderItems = filtered.filter(n => n.date !== dateToday);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Dijous 12 de novembre 2026
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Geo filter */}
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {GEO_FILTERS.map(g => (
          <FilterPill key={g} label={g} active={geoFilter === g} onClick={() => setGeoFilter(g)} />
        ))}
      </div>

      {/* Cat filter */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CAT_FILTERS.map(c => (
          <FilterPill
            key={c}
            label={c === 'Totes' ? 'Totes' : CAT_LABEL[c]}
            active={catFilter === c}
            colorKey={c !== 'Totes' ? CAT_COLOR[c] : null}
            onClick={() => setCatFilter(c)}
          />
        ))}
      </div>

      {/* Today's news */}
      {todayItems.length > 0 && (
        <div style={{ padding: '0 0 0' }}>
          <SectionHead
            kicker="Avui"
            kickerColor={T.cat.alcohol.solid}
            title="Última hora"
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayItems.map(n => <NewsCard key={n.id} item={n} />)}
          </div>
        </div>
      )}

      {/* Older items (science/awards) */}
      {olderItems.length > 0 && (
        <div style={{ padding: '20px 0 0' }}>
          <SectionHead
            kicker="Setmana"
            kickerColor={T.cat.physical.solid}
            title="Ciència i premis"
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {olderItems.map(n => <NewsCard key={n.id} item={n} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <Icon name="search" size={36} color={T.inkFaint} />
          <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.inkMuted, marginTop: 12 }}>
            Cap notícia amb aquests filtres
          </div>
        </div>
      )}
    </div>
  );
}
