import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn, SectionHead } from '../../components/Shared';
import { NOTICIAS, T_CAT_NOTICIA } from '../../data/noticias';

const CAT_FILTERS = [
  { id: 'tot', label: 'Tot' },
  { id: 'politica', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'policial', label: 'Policial' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'premis', label: 'Premis' },
  { id: 'descobriments', label: 'Descobriments' },
  { id: 'internacional', label: 'Internacional' },
];

function NoticiaCard({ item }) {
  const k = T_CAT_NOTICIA[item.cat] || T_CAT_NOTICIA.internacional;
  return (
    <div style={{
      background: '#fff',
      borderRadius: T.r.lg,
      padding: 16,
      borderLeft: `3px solid ${k.solid}`,
      boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          background: k.soft, color: k.ink,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 800, fontSize: 10,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{item.tag}</span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.date}
        </span>
      </div>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
        letterSpacing: -0.2, color: T.ink, lineHeight: 1.25, marginBottom: 6,
      }}>
        {item.title}
      </div>
      <div style={{
        fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5, marginBottom: 12,
      }}>
        {item.summary}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>
          Font: {item.source}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: k.solid, fontFamily: T.font, fontWeight: 800,
            fontSize: 12, textDecoration: 'none',
          }}
        >
          Llegir notícia <Icon name="external-link" size={13} color={k.solid} />
        </a>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: T.r.pill,
      border: active ? 'none' : `1px solid ${T.hairline}`,
      background: active ? color : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      cursor: 'pointer', flexShrink: 0,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

const TODAY = (() => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}·${String(d.getMonth()+1).padStart(2,'0')}·${d.getFullYear()}`;
})();

const LAST_DATE = NOTICIAS[0]?.date || TODAY;

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('tot');

  const filtered = activeCat === 'tot'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  const activeColor = T_CAT_NOTICIA[activeCat]?.solid || T.cat.operativa.solid;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      <div style={{ padding: '8px 16px 4px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          Actualitzat · {LAST_DATE}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Noticias<br /><span style={{ color: T.cat.academia.solid }}>del dia</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, marginBottom: 0, lineHeight: 1.5,
        }}>
          Catalunya · Espanya · Internacional — Actualització diària a les 22h.
        </p>
      </div>

      {/* filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {CAT_FILTERS.map(f => (
          <FilterChip
            key={f.id}
            label={f.label}
            active={activeCat === f.id}
            color={f.id === 'tot' ? T.cat.operativa.solid : (T_CAT_NOTICIA[f.id]?.solid || T.cat.operativa.solid)}
            onClick={() => setActiveCat(f.id)}
          />
        ))}
      </div>

      {/* news list grouped by date */}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} style={{ padding: '0 0 16px' }}>
          <SectionHead
            kicker="Data"
            kickerColor={activeColor}
            title={date}
            style={{ paddingTop: 8 }}
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <NoticiaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
          <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 16, color: T.ink }}>
            No hi ha noticias en aquesta categoria avui
          </div>
          <div style={{ fontSize: 13, color: T.inkMuted, marginTop: 6 }}>
            Torna a revisar més tard o selecciona una altra categoria
          </div>
        </div>
      )}
    </div>
  );
}
