import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn } from '../components/Shared';
import { NEWS, NEWS_CATS } from '../data/news';

const CAT_COLORS = {
  politica:      { solid: T.cat.operativa.solid, soft: T.cat.operativa.soft, ink: T.cat.operativa.ink },
  policial:      { solid: T.cat.alcohol.solid,   soft: T.cat.alcohol.soft,   ink: T.cat.alcohol.ink },
  judicial:      { solid: T.cat.leyes.solid,      soft: T.cat.leyes.soft,     ink: T.cat.leyes.ink },
  esports:       { solid: T.cat.atajos.solid,     soft: T.cat.atajos.soft,    ink: T.cat.atajos.ink },
  cultura:       { solid: T.cat.psico.solid,      soft: T.cat.psico.soft,     ink: T.cat.psico.ink },
  internacional: { solid: T.cat.transito.solid,   soft: T.cat.transito.soft,  ink: T.cat.transito.ink },
};

const GEO_COLOR = {
  Catalunya:     T.cat.academia.solid,
  España:        T.cat.operativa.solid,
  Internacional: T.cat.transito.solid,
};

function NewsCard({ item }) {
  const cc = CAT_COLORS[item.cat] || CAT_COLORS.politica;
  const geoColor = GEO_COLOR[item.geo] || T.inkMuted;
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
        borderLeft: `3px solid ${cc.solid}`,
        boxShadow: T.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, fontFamily: T.font,
            color: cc.ink, background: cc.soft,
            padding: '3px 7px', borderRadius: 999,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{item.catLabel}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: T.font,
            color: geoColor, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>{item.geo}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {item.dateLabel}
          </span>
        </div>

        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {item.desc}
        </div>

        {item.url && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Icon name="external-link" size={12} color={cc.solid} />
            <span style={{ fontSize: 11, fontWeight: 700, color: cc.solid }}>Llegir notícia completa</span>
          </div>
        )}
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('tot');
  const today = new Date();
  const todayLabel = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  const filtered = activeCat === 'tot'
    ? NEWS
    : NEWS.filter(n => n.cat === activeCat);

  const latestDate = NEWS[0]?.date || '';

  return (
    <div className="screen" style={{ paddingBottom: 24 }}>
      <StatusBar />

      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          Actualitat · {todayLabel}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 26, letterSpacing: -0.6, margin: 0,
        }}>
          Notícies del dia
        </h1>
        <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4 }}>
          Catalunya · Espanya · Internacional
        </div>
      </div>

      {/* Filtre per categoria */}
      <div style={{
        display: 'flex', gap: 7, overflowX: 'auto', padding: '0 16px 14px',
        scrollbarWidth: 'none',
      }}>
        {NEWS_CATS.map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
            flexShrink: 0,
            padding: '7px 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontFamily: T.font, fontWeight: 700, fontSize: 12,
            background: activeCat === c.id ? T.cat.operativa.solid : '#fff',
            color: activeCat === c.id ? '#fff' : T.inkSoft,
            boxShadow: T.shadow.card,
            transition: 'background 0.15s, color 0.15s',
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '32px 0' }}>
            Cap notícia per a aquesta categoria
          </div>
        ) : (
          filtered.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

      <div style={{
        margin: '20px 16px 0',
        padding: '12px 14px',
        background: T.cat.operativa.soft,
        borderRadius: T.r.md,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="clock" size={14} color={T.cat.operativa.ink} />
        <span style={{ fontSize: 11.5, color: T.cat.operativa.ink, fontWeight: 600 }}>
          Actualitzat automàticament cada dia a les 22:00 h · Última actualització: {latestDate}
        </span>
      </div>
    </div>
  );
}
