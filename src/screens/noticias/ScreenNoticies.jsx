import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, InfoPolWordmark, Pill } from '../../components/Shared';
import { NEWS, NEWS_CATS } from '../../data/news';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function NewsCard({ item }) {
  const k = T.cat[item.colorKey] || T.cat.noticias;
  return (
    <div style={{
      background: T.card, borderRadius: T.r.lg, padding: 16,
      borderLeft: `4px solid ${k.solid}`,
      boxShadow: T.shadow.card, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Pill bg={k.soft} fg={k.ink} size={10}>
          <Icon name={item.icon} size={11} color={k.ink} strokeWidth={2.5} />
          {item.catLabel}
        </Pill>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.inkMuted }}>{formatDate(item.date)}</span>
      </div>

      <h3 style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
        lineHeight: 1.3, letterSpacing: -0.3, color: T.ink, margin: '0 0 8px',
      }}>{item.title}</h3>

      <p style={{
        fontFamily: T.font, fontSize: 13, lineHeight: 1.55,
        color: T.inkSoft, margin: '0 0 12px',
      }}>{item.summary}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.inkMuted }}>
          {item.source}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: T.font, fontWeight: 700, fontSize: 12,
            color: k.solid, textDecoration: 'none',
          }}
        >
          Llegir més <Icon name="arrow-right" size={13} color={k.solid} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NEWS
    : NEWS.filter(n => n.cat === activeCat);

  const today = new Date().toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40, background: T.bg, minHeight: '100vh' }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '4px 18px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: T.card, boxShadow: T.shadow.card, cursor: 'pointer',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Icon name="arrow-left" size={18} color={T.ink} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
            letterSpacing: 1.1, textTransform: 'uppercase',
            color: T.cat.noticias.ink, marginBottom: 2,
          }}>Actualitat · {today}</div>
          <h1 style={{
            fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 24,
            letterSpacing: -0.6, color: T.ink, margin: 0,
          }}>Notícies</h1>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: T.r.sm,
          background: T.cat.noticias.solid, display: 'grid', placeItems: 'center',
        }}>
          <Icon name="newspaper" size={20} color="#fff" strokeWidth={2.2} />
        </div>
      </div>

      {/* category filter */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 18px', width: 'max-content' }}>
          {NEWS_CATS.map(c => {
            const isActive = activeCat === c.id;
            const k = T.cat[c.colorKey] || T.cat.noticias;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{
                  border: 'none', cursor: 'pointer',
                  padding: '7px 14px', borderRadius: T.r.pill,
                  fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  background: isActive ? k.solid : T.card,
                  color: isActive ? '#fff' : T.inkMuted,
                  boxShadow: isActive ? `inset 0 -2px 0 rgba(0,0,0,0.15)` : T.shadow.card,
                  letterSpacing: 0.2,
                  transition: 'all 0.15s',
                }}
              >{c.label}</button>
            );
          })}
        </div>
      </div>

      {/* news list */}
      <div style={{ padding: '0 18px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontFamily: T.font }}>
            No hi ha notícies en aquesta categoria
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ padding: '8px 18px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: T.font, fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Resum informatiu diari actualitzat cada nit. Les notícies enllaçen a les fonts originals.
        </p>
      </div>
    </div>
  );
}
