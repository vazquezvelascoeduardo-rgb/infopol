import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, Pill } from '../components/Shared';
import { NOTICIAS, CATS_NOTICIAS, SCOPES_NOTICIAS } from '../data/news';

const CAT_COLOR = {
  politica:      { solid: T.cat.operativa.solid,  soft: T.cat.operativa.soft,  ink: T.cat.operativa.ink },
  economia:      { solid: T.cat.leyes.solid,       soft: T.cat.leyes.soft,      ink: T.cat.leyes.ink },
  policial:      { solid: T.cat.alcohol.solid,     soft: T.cat.alcohol.soft,    ink: T.cat.alcohol.ink },
  judicial:      { solid: T.cat.transito.solid,    soft: T.cat.transito.soft,   ink: T.cat.transito.ink },
  esports:       { solid: T.cat.academia.solid,    soft: T.cat.academia.soft,   ink: T.cat.academia.ink },
  cultura:       { solid: T.cat.psico.solid,       soft: T.cat.psico.soft,      ink: T.cat.psico.ink },
  internacional: { solid: T.cat.noticias.solid,    soft: T.cat.noticias.soft,   ink: T.cat.noticias.ink },
};

const SCOPE_LABEL = { cat: 'Catalunya', esp: 'Espanya', int: 'Internacional' };

function NewsCard({ item }) {
  const col = CAT_COLOR[item.cat] || CAT_COLOR.internacional;
  const catLabel = CATS_NOTICIAS.find(c => c.id === item.cat)?.label || item.cat;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 16,
        marginBottom: 10,
        boxShadow: T.shadow.card,
        borderLeft: `3px solid ${col.solid}`,
      }}>
        {/* meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: col.soft, color: col.ink,
              fontFamily: T.font, fontWeight: 800, fontSize: 10,
              letterSpacing: 0.5, textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: T.r.pill,
            }}>{catLabel}</span>
            <span style={{
              background: T.bg, color: T.inkMuted,
              fontFamily: T.font, fontWeight: 700, fontSize: 10,
              letterSpacing: 0.5, textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: T.r.pill,
            }}>{SCOPE_LABEL[item.scope] || item.scope}</span>
          </div>
          <Icon name="external-link" size={14} color={T.inkFaint} strokeWidth={2} />
        </div>

        {/* title */}
        <div style={{
          fontFamily: T.fontDisplay,
          fontWeight: 800,
          fontSize: 15,
          lineHeight: 1.25,
          color: T.ink,
          marginBottom: 8,
          letterSpacing: -0.2,
        }}>{item.title}</div>

        {/* summary */}
        <div style={{
          fontFamily: T.font,
          fontSize: 13,
          lineHeight: 1.55,
          color: T.inkSoft,
        }}>{item.summary}</div>

        {/* source + date */}
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: T.font, fontSize: 11, color: T.inkMuted,
        }}>
          <span>{item.source}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [scope, setScope] = useState('tot');
  const [cat, setCat] = useState('tot');

  const filtered = NOTICIAS.filter(n => {
    const scopeOk = scope === 'tot' || n.scope === scope;
    const catOk   = cat   === 'tot' || n.cat   === cat;
    return scopeOk && catOk;
  });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40, background: T.bg, minHeight: '100vh' }}>
      <StatusBar />

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 18px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: 999, border: 'none',
              background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
              display: 'grid', placeItems: 'center',
            }}
          >
            <Icon name="arrow-left" size={18} color={T.ink} />
          </button>
          <InfoPolWordmark height={18} />
        </div>
        <div style={{
          background: T.cat.noticias.soft,
          color: T.cat.noticias.ink,
          padding: '5px 10px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 0.5, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Icon name="newspaper" size={13} color={T.cat.noticias.solid} strokeWidth={2.4} />
          Noticias
        </div>
      </div>

      {/* title */}
      <div style={{ padding: '0 18px 16px' }}>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28,
          letterSpacing: -0.8, margin: 0, lineHeight: 1.1, color: T.ink,
        }}>Notícies del dia</h1>
        <p style={{
          fontFamily: T.font, fontSize: 13, color: T.inkMuted,
          margin: '6px 0 0', lineHeight: 1.4,
        }}>
          Actualitzat el 10 de novembre de 2026 · Catalunya, Espanya i Món
        </p>
      </div>

      {/* scope filter */}
      <div style={{
        padding: '0 18px 10px',
        display: 'flex', gap: 7, overflowX: 'auto',
        scrollbarWidth: 'none', WebkitScrollbar: { display: 'none' },
      }}>
        {SCOPES_NOTICIAS.map(s => (
          <button
            key={s.id}
            onClick={() => setScope(s.id)}
            style={{
              flexShrink: 0,
              padding: '7px 14px', borderRadius: T.r.pill,
              border: 'none', cursor: 'pointer',
              fontFamily: T.font, fontWeight: 800, fontSize: 12,
              letterSpacing: 0.3,
              background: scope === s.id ? T.cat.noticias.solid : '#fff',
              color:      scope === s.id ? '#fff' : T.inkSoft,
              boxShadow:  T.shadow.card,
              transition: 'background .15s, color .15s',
            }}
          >{s.label}</button>
        ))}
      </div>

      {/* category filter */}
      <div style={{
        padding: '0 18px 16px',
        display: 'flex', gap: 6, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {CATS_NOTICIAS.map(c => {
          const col = CAT_COLOR[c.id];
          const isActive = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              style={{
                flexShrink: 0,
                padding: '5px 12px', borderRadius: T.r.pill,
                border: `1.5px solid ${isActive && col ? col.solid : T.hairline}`,
                cursor: 'pointer',
                fontFamily: T.font, fontWeight: 700, fontSize: 11,
                letterSpacing: 0.2,
                background: isActive && col ? col.soft : '#fff',
                color:      isActive && col ? col.ink  : T.inkMuted,
                transition: 'all .15s',
              }}
            >{c.label}</button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 18px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontFamily: T.font, color: T.inkMuted, fontSize: 14,
          }}>
            <Icon name="newspaper" size={36} color={T.inkFaint} style={{ margin: '0 auto 12px' }} />
            <div>Cap notícia amb aquest filtre</div>
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
