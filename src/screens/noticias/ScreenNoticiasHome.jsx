import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../../components/Shared';
import { NEWS, CATS, AMBITS } from '../../data/news';

const CAT_FILTERS = ['totes', 'politica', 'economia', 'esports', 'policial', 'internacional', 'ciencia', 'cultura'];

function AmbitBadge({ ambit }) {
  const colors = {
    cat: { bg: T.cat.operativa.soft, fg: T.cat.operativa.ink },
    esp: { bg: T.cat.leyes.soft,     fg: T.cat.leyes.ink },
    int: { bg: T.cat.tests.soft,     fg: T.cat.tests.ink },
  };
  const c = colors[ambit] || colors.int;
  return (
    <span style={{
      padding: '3px 7px', borderRadius: 999,
      background: c.bg, color: c.fg,
      fontFamily: T.font, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{AMBITS[ambit]}</span>
  );
}

function NewsCard({ item }) {
  const cat = CATS[item.cat] || CATS.internacional;
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${cat.color}`,
        boxShadow: T.shadow.card,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 7px', borderRadius: 999,
            background: cat.soft, color: cat.ink,
            fontFamily: T.font, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.6, textTransform: 'uppercase',
          }}>{cat.label}</span>
          <AmbitBadge ambit={item.ambit} />
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
        </div>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: cat.color }}>
          {item.tag}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.5 }}>
          {item.resum}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: cat.color, fontWeight: 700, fontSize: 12, marginTop: 2 }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={cat.color} />
        </div>
      </div>
    </a>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
      background: active ? color : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.3,
      boxShadow: T.shadow.card,
      flexShrink: 0,
      transition: 'background 0.15s, color 0.15s',
    }}>
      {label}
    </button>
  );
}

export default function ScreenNoticiasHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('totes');

  const today = NEWS[0]?.date || '';
  const filtered = filter === 'totes' ? NEWS : NEWS.filter(n => n.cat === filter);

  const latestDate = NEWS.reduce((acc, n) => (n.date > acc ? n.date : acc), '');

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* Nav */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      {/* Header */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2,
          textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4,
        }}>
          Actualitzat · {latestDate || today} · 22:00h
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.7, margin: 0 }}>
          Noticias del<br/><span style={{ color: T.cat.noticias.solid }}>dia</span>.
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 8, marginBottom: 0, lineHeight: 1.4 }}>
          Resum diari de Catalunya, Espanya i el món. Política, economia, esports, cultura i molt més.
        </p>
      </div>

      {/* Filters */}
      <div style={{ paddingLeft: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingRight: 16, paddingBottom: 4 }}>
          {CAT_FILTERS.map(f => {
            const cat = CATS[f];
            const color = cat ? cat.color : T.cat.noticias.solid;
            const label = cat ? cat.label : 'Totes';
            return (
              <FilterChip
                key={f}
                label={label}
                active={filter === f}
                color={color}
                onClick={() => setFilter(f)}
              />
            );
          })}
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
        {['cat', 'esp', 'int'].map(ambit => {
          const count = NEWS.filter(n => n.ambit === ambit).length;
          const colors = {
            cat: { bg: T.cat.operativa.soft, fg: T.cat.operativa.ink, solid: T.cat.operativa.solid },
            esp: { bg: T.cat.leyes.soft, fg: T.cat.leyes.ink, solid: T.cat.leyes.solid },
            int: { bg: T.cat.tests.soft, fg: T.cat.tests.ink, solid: T.cat.tests.solid },
          };
          const c = colors[ambit];
          return (
            <div key={ambit} style={{
              flex: 1, background: c.bg, borderRadius: T.r.md, padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <div style={{ fontFamily: T.fontMono, fontWeight: 700, fontSize: 20, color: c.solid }}>{count}</div>
              <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: c.fg }}>{AMBITS[ambit]}</div>
            </div>
          );
        })}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px 0' }}>
        <SectionHead
          kicker={`${filtered.length} notícies`}
          kickerColor={T.cat.noticias.solid}
          title={filter === 'totes' ? 'Totes les notícies' : (CATS[filter]?.label || 'Notícies')}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontFamily: T.font, fontSize: 14 }}>
              No hi ha notícies per a aquesta categoria avui.
            </div>
          ) : (
            filtered.map(item => <NewsCard key={item.id} item={item} />)
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Notícies generades automàticament a les 22:00h<br/>
          Fes clic a cada notícia per llegir-la completa a la font original.
        </div>
      </div>
    </div>
  );
}
