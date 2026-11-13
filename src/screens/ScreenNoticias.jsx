import { useState } from 'react';
import { T } from '../tokens';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { NOTICIAS, CAT_INFO } from '../data/noticias';

const CATS = ['totes', 'politica', 'internacional', 'economia', 'esports', 'cultura', 'descobriments', 'successos'];
const CAT_LABELS = { totes: 'Totes', ...Object.fromEntries(Object.entries(CAT_INFO).map(([k, v]) => [k, v.label])) };

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px',
      borderRadius: 999,
      border: 'none',
      background: active ? color : T.card,
      color: active ? '#fff' : T.inkMuted,
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: 0.3,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

function NoticiaCard({ noticia }) {
  const ci = CAT_INFO[noticia.cat] || CAT_INFO.politica;
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: T.card,
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${ci.color}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: ci.color,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            background: ci.soft,
            padding: '2px 8px',
            borderRadius: 999,
          }}>
            {noticia.tag}
          </span>
          <span style={{
            fontFamily: T.fontMono,
            fontSize: 10,
            color: T.inkMuted,
            marginLeft: 'auto',
            flexShrink: 0,
          }}>
            {noticia.date}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>
          {noticia.title}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.45 }}>
          {noticia.desc}
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 11,
          color: ci.color,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}>
          Llegir notícia completa →
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  const activeColor = activeCat === 'totes' ? T.ink : (CAT_INFO[activeCat]?.color ?? T.ink);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: activeColor, marginBottom: 4 }}>
          Actualitat · {new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0, color: T.ink }}>
          Noticias del dia
        </h1>
      </div>

      {/* Category filter */}
      <div style={{ paddingBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {CATS.map(c => (
            <FilterChip
              key={c}
              label={CAT_LABELS[c]}
              active={activeCat === c}
              color={c === 'totes' ? T.ink : CAT_INFO[c]?.color}
              onClick={() => setActiveCat(c)}
            />
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ padding: '0 16px 10px', fontFamily: T.font, fontSize: 12, color: T.inkMuted }}>
        <b style={{ color: T.ink }}>{filtered.length}</b> {filtered.length === 1 ? 'notícia' : 'notícies'}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(n => (
          <NoticiaCard key={n.id} noticia={n} />
        ))}
      </div>

      <div style={{ padding: '20px 16px 0', textAlign: 'center', fontSize: 11, color: T.inkFaint }}>
        Actualitzat el 13 de novembre de 2026 · InfoPol
      </div>
    </div>
  );
}
