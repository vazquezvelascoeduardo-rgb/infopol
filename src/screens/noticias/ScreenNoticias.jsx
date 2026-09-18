import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, NEWS_CATS } from '../../data/news';

const GEO_LABEL = { CAT: 'Catalunya', ESP: 'Espanya', INT: 'Internacional' };
const GEO_COLOR = { CAT: '#E89421', ESP: '#3B6BF5', INT: '#9C4FE0' };
const CATS = ['totes', ...Object.keys(NEWS_CATS)];
const CAT_LABELS = { totes: 'Totes', ...Object.fromEntries(Object.entries(NEWS_CATS).map(([k, v]) => [k, v.label])) };

function CatChip({ cat, active, onClick }) {
  const meta = cat === 'totes' ? null : NEWS_CATS[cat];
  const bg = active
    ? (meta ? meta.color : T.ink)
    : '#fff';
  const fg = active ? '#fff' : T.inkMuted;
  return (
    <button onClick={onClick} style={{
      background: bg, color: fg,
      border: `1.5px solid ${active ? 'transparent' : T.hairlineStrong}`,
      borderRadius: T.r.pill, padding: '6px 13px',
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
    }}>
      {CAT_LABELS[cat]}
    </button>
  );
}

function NoticiaCard({ n }) {
  const meta = NEWS_CATS[n.cat];
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.lg,
      borderLeft: `3px solid ${meta.color}`,
      boxShadow: T.shadow.card, padding: 14,
    }}>
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{
          background: meta.soft, color: meta.ink,
          borderRadius: T.r.pill, padding: '3px 9px',
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name={meta.icon} size={10} color={meta.ink} strokeWidth={2.5} />
          {meta.label}
        </span>
        <span style={{
          background: GEO_COLOR[n.geo] + '18', color: GEO_COLOR[n.geo],
          borderRadius: T.r.pill, padding: '3px 8px',
          fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
        }}>{GEO_LABEL[n.geo]}</span>
        <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkFaint }}>{n.data}</span>
      </div>

      {/* title */}
      <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, lineHeight: 1.3, letterSpacing: -0.2 }}>
        {n.title}
      </div>

      {/* summary */}
      <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
        {n.resum}
      </div>

      {/* read more */}
      <a
        href={n.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          marginTop: 12, color: meta.color,
          fontWeight: 700, fontSize: 12, textDecoration: 'none',
        }}
      >
        Llegir notícia completa <Icon name="arrow-right" size={13} color={meta.color} />
      </a>
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const lastDate = NOTICIAS[0]?.data ?? '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
          <InfoPolWordmark height={18} />
        </div>
        <RoundIconBtn icon="user" onClick={() => navigate('/perfil')} />
      </div>

      {/* header */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: '#3B6BF5', marginBottom: 4 }}>
          Última hora · {lastDate}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticias del <span style={{ color: '#FF7A1A' }}>dia</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, margin: '6px 0 0', lineHeight: 1.5 }}>
          Catalunya · Espanya · Internacional. Resum diari actualitzat a les 22 h.
        </p>
      </div>

      {/* category filter */}
      <div style={{ padding: '0 16px 14px', overflowX: 'auto', display: 'flex', gap: 6, scrollbarWidth: 'none' }}>
        {CATS.map(cat => (
          <CatChip key={cat} cat={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
        ))}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '40px 0' }}>
            Sense noticias en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ margin: '24px 16px 0', padding: '12px 14px', background: T.hairline, borderRadius: T.r.md }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Les notícies es recopilen automàticament cada dia a les 22:00 h a partir de fonts de premsa obertes. Fes clic a "Llegir notícia completa" per accedir a la font original.
        </div>
      </div>
    </div>
  );
}
