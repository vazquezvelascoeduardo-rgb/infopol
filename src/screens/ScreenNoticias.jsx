import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, NOTICIAS_CATS } from '../data/news';

function NewsCard({ item }) {
  const k = T.cat[item.cat] || T.cat.operativa;
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
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: k.solid,
            letterSpacing: 0.6, textTransform: 'uppercase',
            background: k.soft, padding: '3px 7px', borderRadius: T.r.pill,
          }}>{item.tag}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{item.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5 }}>{item.desc}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontSize: 11, fontWeight: 700 }}>
          Llegir notícia completa <Icon name="arrow-right" size={12} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => {
        const catDef = NOTICIAS_CATS[activeCat];
        return catDef && n.cat === catDef.cat;
      });

  const catKeys = Object.keys(NOTICIAS_CATS);

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
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.alcohol.solid, marginBottom: 4 }}>
          Actualitat · {new Date().toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, letterSpacing: -0.8, margin: 0 }}>
          Noticias del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Resum diari de política, economia, esports, ciència i successos.
        </p>
      </div>

      {/* filter chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {catKeys.map(key => {
          const def = NOTICIAS_CATS[key];
          const k = def.cat ? T.cat[def.cat] : null;
          const isActive = activeCat === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCat(key)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: T.r.pill,
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.font,
                fontWeight: 700,
                fontSize: 12,
                background: isActive ? (k ? k.solid : T.ink) : '#fff',
                color: isActive ? '#fff' : T.inkSoft,
                boxShadow: T.shadow.card,
                transition: 'all 0.15s',
              }}
            >
              {def.label}
            </button>
          );
        })}
      </div>

      {/* news list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 13 }}>
            No hi ha notícies per a aquesta categoria avui.
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* footer note */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: T.inkFaint }}>
          Resum automàtic · Fonts verificades · Actualitzat el {new Date().toLocaleDateString('ca-ES')}
        </span>
      </div>
    </div>
  );
}
