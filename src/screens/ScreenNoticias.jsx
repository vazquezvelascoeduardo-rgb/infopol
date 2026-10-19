import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, Pill } from '../components/Shared';
import { NEWS, NEWS_CATS, SCOPES } from '../data/news';

function NewsCard({ item }) {
  const k = T.cat[item.cat];
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: T.card,
        borderRadius: T.r.lg,
        padding: 14,
        borderLeft: `4px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {/* top row: category + scope */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: k.solid,
              display: 'grid', placeItems: 'center',
              flexShrink: 0,
            }}>
              <Icon name={item.catIcon} size={15} color="#fff" strokeWidth={2.2} />
            </div>
            <span style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 10,
              letterSpacing: 0.8, textTransform: 'uppercase',
              color: k.ink, background: k.soft,
              padding: '3px 7px', borderRadius: 999,
            }}>{item.catLabel}</span>
          </div>
          <span style={{
            fontFamily: T.font, fontWeight: 700, fontSize: 10,
            letterSpacing: 0.4, color: T.inkMuted,
            background: T.bg,
            padding: '3px 8px', borderRadius: 999,
          }}>{item.scope}</span>
        </div>

        {/* title */}
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 15, lineHeight: 1.3,
          letterSpacing: -0.2, color: T.ink,
        }}>{item.title}</div>

        {/* summary */}
        <div style={{
          fontFamily: T.font, fontSize: 12.5,
          lineHeight: 1.55, color: T.inkSoft,
        }}>{item.summary}</div>

        {/* footer: source + link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: T.inkMuted, fontWeight: 600 }}>{item.source}</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 800,
            color: k.ink,
          }}>
            Llegir <Icon name="arrow-right" size={13} color={k.solid} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [scope, setScope] = useState('Totes');
  const [cat, setCat] = useState('all');

  const filtered = NEWS.filter(n => {
    const scopeOk = scope === 'Totes' || n.scope === scope;
    const catOk = cat === 'all' || n.catLabel === cat;
    return scopeOk && catOk;
  });

  const today = NEWS[0]?.date;
  const displayDate = today
    ? new Date(today).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="screen-no-tabs" style={{ background: T.bg, paddingBottom: 32 }}>
      <StatusBar />

      {/* header */}
      <div style={{
        padding: '8px 16px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
          >
            <Icon name="arrow-left" size={20} color={T.ink} />
          </button>
          <InfoPolWordmark height={16} />
          <div style={{ height: 16, width: 1, background: T.hairlineStrong }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: T.cat.operativa.solid }}>
            Notícies
          </span>
        </div>
      </div>

      {/* date strip */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 11,
          letterSpacing: 0.6, textTransform: 'capitalize',
          color: T.inkMuted,
        }}>{displayDate}</div>
      </div>

      {/* scope tabs */}
      <div style={{ padding: '0 16px 10px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
          {SCOPES.map(s => (
            <button key={s} onClick={() => setScope(s)} style={{
              padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontWeight: 800, fontSize: 12, letterSpacing: 0.2,
              background: scope === s ? T.cat.operativa.solid : T.card,
              color: scope === s ? '#fff' : T.inkSoft,
              boxShadow: scope === s ? 'none' : T.shadow.card,
              transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* category filter */}
      <div style={{ padding: '0 16px 14px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
          {NEWS_CATS.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              padding: '5px 11px', borderRadius: 999, border: `1.5px solid ${cat === c.key ? T.cat.operativa.solid : T.hairlineStrong}`,
              cursor: 'pointer', fontFamily: T.font, fontWeight: 700, fontSize: 11,
              background: cat === c.key ? T.cat.operativa.soft : 'transparent',
              color: cat === c.key ? T.cat.operativa.ink : T.inkMuted,
              transition: 'all 0.15s',
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies per a aquesta selecció.
          </div>
        ) : (
          filtered.map(n => <NewsCard key={n.id} item={n} />)
        )}
      </div>
    </div>
  );
}
