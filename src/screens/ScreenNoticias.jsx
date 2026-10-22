import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, InfoPolWordmark, Pill, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CAT_META } from '../data/noticias';

const CATS = ['totes', 'politica', 'economia', 'esport', 'judicial', 'internacional', 'cultura'];
const CAT_LABELS = {
  totes: 'Totes',
  politica: 'Política',
  economia: 'Economia',
  esport: 'Esports',
  judicial: 'Judicial',
  internacional: 'Internacional',
  cultura: 'Cultura',
};

function FilterChip({ label, active, color, onClick }) {
  const k = T.cat[color] || T.cat.operativa;
  return (
    <button onClick={onClick} style={{
      background: active ? k.solid : '#fff',
      color: active ? '#fff' : T.inkSoft,
      border: `1.5px solid ${active ? k.solid : T.hairline}`,
      padding: '7px 14px',
      borderRadius: T.r.pill,
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: 0.3,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {label}
    </button>
  );
}

function NoticiaCard({ n, onClick }) {
  const meta = CAT_META[n.cat] || CAT_META.politica;
  const k = T.cat[meta.color];
  return (
    <a
      href={n.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 16,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: k.soft, color: k.ink,
            padding: '3px 8px', borderRadius: T.r.pill,
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 0.6, textTransform: 'uppercase',
          }}>
            <Icon name={meta.icon} size={10} color={k.ink} strokeWidth={2.4} />
            {n.tag}
          </span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {n.date}
          </span>
        </div>

        <div style={{
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 14.5,
          letterSpacing: -0.2,
          color: T.ink,
          lineHeight: 1.35,
          marginBottom: 6,
        }}>
          {n.title}
        </div>

        <div style={{
          fontSize: 12.5,
          color: T.inkMuted,
          lineHeight: 1.5,
          marginBottom: 10,
        }}>
          {n.summary}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: k.solid,
          fontWeight: 700,
          fontSize: 12,
        }}>
          Llegir notícia completa
          <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const lastDate = NOTICIAS[0]?.date ?? '—';
  const activeKey = activeCat === 'totes' ? 'operativa' : (CAT_META[activeCat]?.color || 'operativa');

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 36, height: 36, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <InfoPolWordmark height={18} />
        </div>
        <RoundIconBtn icon="refresh-cw" />
      </div>

      {/* header */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          Actualitzat · {lastDate}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: 0, lineHeight: 1.05,
        }}>
          Noticias del <span style={{ color: T.cat.academia.solid }}>dia</span>
        </h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          marginTop: 6, lineHeight: 1.5,
        }}>
          Política, economia, esports, cultura i successos. Catalunya, Espanya i món.
        </p>
      </div>

      {/* filter chips */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '0 16px 16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {CATS.map(c => (
          <FilterChip
            key={c}
            label={CAT_LABELS[c]}
            active={activeCat === c}
            color={c === 'totes' ? 'operativa' : (CAT_META[c]?.color || 'operativa')}
            onClick={() => setActiveCat(c)}
          />
        ))}
      </div>

      {/* count badge */}
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pill bg={T.cat[activeKey].soft} fg={T.cat[activeKey].ink}>
          {filtered.length} {filtered.length === 1 ? 'notícia' : 'notícies'}
        </Pill>
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(n => (
          <NoticiaCard key={n.id} n={n} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: T.inkMuted }}>
          <Icon name="search" size={32} color={T.inkFaint} />
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14 }}>Cap notícia per a aquesta categoria</div>
        </div>
      )}

      {/* footer */}
      <div style={{
        margin: '24px 16px 0',
        padding: 14,
        background: '#fff',
        borderRadius: T.r.md,
        boxShadow: T.shadow.card,
        borderTop: `2px solid ${T.hairline}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.6 }}>
          Les notícies s'actualitzen cada nit a les 22:00 h.<br />
          Fes clic a cada notícia per llegir la informació completa a la font original.
        </div>
      </div>
    </div>
  );
}
