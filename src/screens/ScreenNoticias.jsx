import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NEWS, CAT_COLOR } from '../data/news';

const CATS = [
  { id: 'tot', label: 'Tot' },
  { id: 'política', label: 'Política' },
  { id: 'economia', label: 'Economia' },
  { id: 'esports', label: 'Esports' },
  { id: 'policial', label: 'Policial' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'ciència', label: 'Ciència' },
  { id: 'cultura', label: 'Cultura' },
];

const CAT_ICON = {
  política: 'scale',
  economia: 'chart',
  esports: 'trophy',
  policial: 'siren',
  internacional: 'globe',
  ciència: 'flask',
  cultura: 'star',
};

function NewsCard({ item }) {
  const colorKey = CAT_COLOR[item.category] || 'operativa';
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
        padding: '12px 14px',
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{
            background: k.soft,
            color: k.ink,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            padding: '3px 7px',
            borderRadius: 999,
          }}>
            {item.tag}
          </span>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: T.inkMuted,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
          }}>
            {item.geo}
          </span>
          <span style={{
            fontFamily: T.fontMono,
            fontSize: 9.5,
            color: T.inkFaint,
            marginLeft: 'auto',
          }}>
            {item.date}
          </span>
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: 13.5,
          color: T.ink,
          lineHeight: 1.3,
          marginBottom: 4,
        }}>
          {item.title}
        </div>
        <div style={{
          fontSize: 11.5,
          color: T.inkMuted,
          lineHeight: 1.45,
        }}>
          {item.desc}
        </div>
        <div style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: k.solid,
          fontSize: 11,
          fontWeight: 700,
        }}>
          Llegir notícia completa <Icon name="arrow-right" size={11} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? T.ink : '#fff',
      color: active ? '#fff' : T.inkSoft,
      border: `1px solid ${active ? T.ink : T.hairlineStrong}`,
      borderRadius: 999,
      padding: '7px 13px',
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 11.5,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [active, setActive] = useState('tot');

  const filtered = active === 'tot' ? NEWS : NEWS.filter(n => n.category === active);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')} de ${
    ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre'][today.getMonth()]
  } de ${today.getFullYear()}`;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <InfoPolWordmark height={17} />
        <div style={{ width: 36 }} />
      </div>

      {/* Title */}
      <div style={{ padding: '10px 16px 4px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.3, textTransform: 'uppercase',
          color: T.cat.alcohol.solid, marginBottom: 4,
        }}>
          Actualitat · {dateStr}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 28, letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Noticias del dia
        </h1>
        <p style={{
          fontSize: 12.5, color: T.inkMuted, marginTop: 6, lineHeight: 1.5, marginBottom: 0,
        }}>
          Catalunya · Espanya · Internacional — {NEWS.length} notícies
        </p>
      </div>

      {/* Filter chips */}
      <div style={{
        padding: '12px 16px 10px',
        overflowX: 'auto',
        display: 'flex',
        gap: 7,
        scrollbarWidth: 'none',
      }}>
        {CATS.map(c => (
          <FilterChip
            key={c.id}
            label={c.label}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>

      {/* Category badge + count */}
      {active !== 'tot' && (
        <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: T.cat[CAT_COLOR[active] || 'operativa'].soft,
            color: T.cat[CAT_COLOR[active] || 'operativa'].ink,
            padding: '5px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>
            <Icon
              name={CAT_ICON[active] || 'newspaper'}
              size={12}
              color={T.cat[CAT_COLOR[active] || 'operativa'].ink}
              strokeWidth={2.5}
            />
            {active} · {filtered.length} notícies
          </div>
        </div>
      )}

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: T.inkMuted, fontSize: 14,
          }}>
            Cap notícia en aquesta categoria
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Footer */}
      <div style={{
        margin: '20px 16px 0',
        padding: '14px 16px',
        background: '#fff',
        borderRadius: T.r.md,
        boxShadow: T.shadow.card,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon name="info" size={16} color={T.inkMuted} />
        <p style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.45, margin: 0 }}>
          Resum diari d'actualitat. Clica cada notícia per llegir l'article complet a la font original.
          Actualitzat cada dia a les 22:00 h.
        </p>
      </div>
    </div>
  );
}
