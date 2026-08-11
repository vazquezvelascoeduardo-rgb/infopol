import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, CATS_NOTICIA } from '../../data/news';

const FILTER_ALL = 'totes';
const FILTERS = [
  { id: FILTER_ALL, label: 'Totes' },
  { id: 'politica',      label: 'Política' },
  { id: 'economia',      label: 'Economia' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'societat',      label: 'Societat' },
  { id: 'successos',     label: 'Successos' },
  { id: 'esports',       label: 'Esports' },
];

function CatTag({ cat }) {
  const meta = CATS_NOTICIA[cat];
  const k = T.cat[meta.color];
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px', borderRadius: 999,
      background: k.soft, color: k.ink,
      fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase',
    }}>
      {meta.label}
    </span>
  );
}

function NewsCard({ item }) {
  const meta = CATS_NOTICIA[item.cat];
  const k = T.cat[meta.color];
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <CatTag cat={item.cat} />
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {item.desc}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 11 }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);

  const filtered = activeFilter === FILTER_ALL
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeFilter);

  const lastDate = NOTICIAS[0]?.date ?? '—';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
      </div>

      {/* Hero */}
      <div style={{ padding: '10px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          Actualitat · {lastDate}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.6, margin: 0 }}>
          Notícies del <span style={{ color: T.cat.noticias.solid }}>dia</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional. Política, economia, successos, esports i molt més.
        </p>
      </div>

      {/* Category filters */}
      <div style={{ padding: '0 0 14px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {FILTERS.map(f => {
            const active = activeFilter === f.id;
            const isSpecific = f.id !== FILTER_ALL;
            const k = isSpecific ? T.cat[CATS_NOTICIA[f.id]?.color] : null;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  background: active
                    ? (k ? k.solid : T.ink)
                    : '#fff',
                  color: active ? '#fff' : T.inkSoft,
                  boxShadow: T.shadow.card,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontFamily: T.font }}>
            Sense notícies en aquesta categoria.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, fontFamily: T.font, lineHeight: 1.5 }}>
          Actualitzat cada dia a les 22h · InfoPol Notícies
        </div>
      </div>
    </div>
  );
}
