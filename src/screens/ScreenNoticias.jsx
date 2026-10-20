import { useState } from 'react';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { StatusBar, InfoPolWordmark, RoundIconBtn } from '../components/Shared';
import { NOTICIAS, CATEGORIES, CAT_CONFIG } from '../data/noticias';

function FilterChip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: T.r.pill,
      border: `1.5px solid ${active ? color : T.hairlineStrong}`,
      background: active ? color : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      letterSpacing: 0.2, cursor: 'pointer', flexShrink: 0,
      boxShadow: active ? `0 2px 8px ${color}40` : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function NoticiaCard({ noticia, onOpen }) {
  const cfg = CAT_CONFIG[noticia.categoria] || CAT_CONFIG.politica;
  return (
    <div
      onClick={() => onOpen(noticia)}
      style={{
        background: '#fff', borderRadius: T.r.lg, padding: 16,
        borderLeft: `3px solid ${cfg.color}`,
        boxShadow: T.shadow.card, cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          background: cfg.soft, color: cfg.ink,
          padding: '3px 8px', borderRadius: T.r.pill,
          fontFamily: T.font, fontWeight: 800, fontSize: 10,
          letterSpacing: 0.8, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name={cfg.icon} size={11} color={cfg.ink} strokeWidth={2.4} />
          {noticia.categoria}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {noticia.data}
        </span>
      </div>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15,
        letterSpacing: -0.3, color: T.ink, lineHeight: 1.3, marginBottom: 6,
      }}>{noticia.titol}</div>
      <div style={{
        fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{noticia.resum}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, color: cfg.color, fontWeight: 700, fontSize: 12 }}>
        Llegir font <Icon name="external-link" size={13} color={cfg.color} />
      </div>
    </div>
  );
}

function NoticiaModal({ noticia, onClose }) {
  if (!noticia) return null;
  const cfg = CAT_CONFIG[noticia.categoria] || CAT_CONFIG.politica;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(19,19,26,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg, borderRadius: `${T.r.xl}px ${T.r.xl}px 0 0`,
        padding: '20px 20px 40px', maxHeight: '80vh', overflowY: 'auto',
        boxShadow: T.shadow.pop,
      }}>
        {/* handle */}
        <div style={{ width: 40, height: 4, background: T.hairlineStrong, borderRadius: 4, margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            background: cfg.soft, color: cfg.ink,
            padding: '4px 10px', borderRadius: T.r.pill,
            fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
            letterSpacing: 0.8, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name={cfg.icon} size={12} color={cfg.ink} strokeWidth={2.4} />
            {noticia.categoria}
          </span>
          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.inkMuted, marginLeft: 'auto' }}>{noticia.data}</span>
        </div>

        <h2 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20,
          letterSpacing: -0.5, color: T.ink, lineHeight: 1.2, margin: '0 0 12px',
        }}>{noticia.titol}</h2>

        <p style={{ fontSize: 14.5, color: T.inkSoft, lineHeight: 1.65, margin: '0 0 20px' }}>
          {noticia.resum}
        </p>

        <a href={noticia.font} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px 20px', borderRadius: T.r.md,
          background: cfg.color, color: '#fff',
          fontFamily: T.font, fontWeight: 800, fontSize: 14,
          letterSpacing: 0.3, textDecoration: 'none',
          boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.18)`,
        }}>
          <Icon name="external-link" size={16} color="#fff" />
          Llegir notícia completa
        </a>

        <button onClick={onClose} style={{
          width: '100%', marginTop: 10, padding: '12px', borderRadius: T.r.md,
          background: 'transparent', border: `1.5px solid ${T.hairlineStrong}`,
          fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.inkSoft,
          cursor: 'pointer',
        }}>Tancar</button>
      </div>
    </div>
  );
}

export default function ScreenNoticias() {
  const [catActiva, setCatActiva] = useState('totes');
  const [noticiaOberta, setNoticiaOberta] = useState(null);

  const nFiltrades = catActiva === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.categoria === catActiva);

  const avui = new Date();
  const dataAvui = `${avui.getDate().toString().padStart(2,'0')}·${(avui.getMonth()+1).toString().padStart(2,'0')}·${avui.getFullYear()}`;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Capçalera */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · {dataAvui}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies <span style={{ color: T.cat.academia.solid }}>d'avui</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filtre de categories */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 16px 16px',
        overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {CATEGORIES.map(c => {
          const cfgColor = c.cat ? CAT_CONFIG[c.cat]?.color : T.cat.operativa.solid;
          return (
            <FilterChip
              key={c.id}
              label={c.label}
              active={catActiva === c.id}
              color={cfgColor}
              onClick={() => setCatActiva(c.id)}
            />
          );
        })}
      </div>

      {/* Llistat de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {nFiltrades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies en aquesta categoria.
          </div>
        ) : (
          nFiltrades.map(n => (
            <NoticiaCard key={n.id} noticia={n} onOpen={setNoticiaOberta} />
          ))
        )}
      </div>

      {/* Peu */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Resum diari generat automàticament. Accedeix a la font per llegir la notícia completa.
        </div>
      </div>

      {/* Modal */}
      <NoticiaModal noticia={noticiaOberta} onClose={() => setNoticiaOberta(null)} />
    </div>
  );
}
