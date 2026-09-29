import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark } from '../../components/Shared';
import { NEWS, NEWS_CATEGORIES } from '../../data/news';

const CAT_COLORS = {
  politica:      { solid: T.cat.operativa.solid,  soft: T.cat.operativa.soft,  ink: T.cat.operativa.ink },
  economia:      { solid: T.cat.leyes.solid,       soft: T.cat.leyes.soft,      ink: T.cat.leyes.ink },
  policial:      { solid: T.cat.alcohol.solid,     soft: T.cat.alcohol.soft,    ink: T.cat.alcohol.ink },
  esports:       { solid: T.cat.psico.solid,       soft: T.cat.psico.soft,      ink: T.cat.psico.ink },
  cultura:       { solid: T.cat.atajos.solid,      soft: T.cat.atajos.soft,     ink: T.cat.atajos.ink },
  internacional: { solid: T.cat.transito.solid,    soft: T.cat.transito.soft,   ink: T.cat.transito.ink },
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CAT_COLORS[item.category] || { solid: T.inkMuted, soft: T.hairline, ink: T.ink };
  const catMeta = NEWS_CATEGORIES.find(c => c.id === item.category);

  return (
    <div
      style={{
        background: T.card,
        borderRadius: T.r.lg,
        padding: '14px 16px',
        boxShadow: T.shadow.card,
        borderLeft: `3px solid ${cat.solid}`,
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: cat.soft, color: cat.ink,
          padding: '3px 9px', borderRadius: T.r.pill,
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <Icon name={catMeta?.icon || 'newspaper'} size={11} color={cat.ink} strokeWidth={2.5} />
          {catMeta?.label || item.category}
        </span>
        <span style={{ fontSize: 11, color: T.inkMuted, marginLeft: 'auto' }}>
          {item.source}
        </span>
      </div>

      {/* title */}
      <div style={{
        fontFamily: T.font, fontWeight: 700, fontSize: 14,
        color: T.ink, lineHeight: 1.4, marginBottom: expanded ? 10 : 0,
      }}>
        {item.title}
      </div>

      {/* expanded: summary + link */}
      {expanded && (
        <>
          <div style={{
            fontSize: 13, color: T.inkSoft, lineHeight: 1.6, marginBottom: 12,
          }}>
            {item.summary}
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: cat.solid, color: '#fff',
              padding: '8px 14px', borderRadius: T.r.pill,
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
            }}
          >
            <Icon name="external-link" size={13} color="#fff" />
            Llegir notícia completa
          </a>
        </>
      )}

      {/* collapse indicator */}
      {!expanded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <span style={{ fontSize: 11, color: T.inkMuted }}>Toca per ampliar</span>
          <Icon name="chevron-down" size={13} color={T.inkMuted} />
        </div>
      )}
    </div>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('tots');

  const filtered = activeCat === 'tots'
    ? NEWS
    : NEWS.filter(n => n.category === activeCat);

  const latestDate = NEWS.length > 0 ? formatDate(NEWS[0].date) : '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40, background: T.bg, minHeight: '100vh' }}>
      <StatusBar />

      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 12px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, color: T.ink,
          }}
        >
          <Icon name="arrow-left" size={20} color={T.ink} />
        </button>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 16, color: T.ink }}>
          Notícies
        </div>
        <div style={{ width: 20 }} />
      </div>

      {/* date header */}
      <div style={{ padding: '0 18px 16px' }}>
        <div style={{
          background: T.ink, borderRadius: T.r.xl, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20, width: 120, height: 120,
            borderRadius: 200, background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: T.cat.operativa.solid,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name="newspaper" size={22} color="#fff" />
          </div>
          <div>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 11,
              letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 3,
            }}>
              Actualitzat avui
            </div>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, color: '#fff' }}>
              {latestDate}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {NEWS.length} notícies · Catalunya · Espanya · Internacional
            </div>
          </div>
        </div>
      </div>

      {/* category filter */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 18px 14px', width: 'max-content' }}>
          {NEWS_CATEGORIES.map(cat => {
            const isActive = activeCat === cat.id;
            const cc = cat.id === 'tots' ? null : CAT_COLORS[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  background: isActive ? (cc ? cc.solid : T.ink) : T.card,
                  color: isActive ? '#fff' : T.inkSoft,
                  boxShadow: isActive ? 'none' : T.shadow.card,
                  transition: 'all 0.15s',
                }}
              >
                <Icon
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#fff' : T.inkMuted}
                  strokeWidth={2.2}
                />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* news list */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontSize: 14, color: T.inkMuted, fontFamily: T.font,
          }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '20px 18px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.6 }}>
          Les notícies s'actualitzen cada dia a les 22:00h.<br/>
          Toca qualsevol notícia per llegir el resum i accedir a la font original.
        </div>
      </div>
    </div>
  );
}
