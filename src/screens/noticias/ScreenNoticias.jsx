import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../../components/Shared';
import { NOTICIAS, CATEGORIES_NOTICIAS, CAT_MAP } from '../../data/noticias';

function CatChip({ active, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      padding: '7px 14px',
      borderRadius: T.r.pill,
      border: 'none',
      cursor: 'pointer',
      fontFamily: T.font,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: 0.2,
      background: active ? T.cat.noticias.solid : '#fff',
      color: active ? '#fff' : T.inkSoft,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'background 0.15s, color 0.15s',
    }}>{label}</button>
  );
}

function NoticiaCard({ noticia }) {
  const cat = CAT_MAP[noticia.categoria] || CAT_MAP.politica;
  const k = T.cat[cat.token];
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: '14px 14px 12px',
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
      }}>
        {/* top row: categoria + data + ambit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: k.soft, color: k.ink,
            padding: '3px 8px', borderRadius: T.r.pill,
            fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase',
          }}>
            <Icon name={cat.icon} size={11} color={k.ink} strokeWidth={2.4} />
            {cat.label}
          </div>
          {noticia.ambit && (
            <span style={{ fontSize: 10, fontWeight: 700, color: T.inkMuted, letterSpacing: 0.3 }}>
              · {noticia.ambit}
            </span>
          )}
          <span style={{
            marginLeft: 'auto',
            fontFamily: T.fontMono,
            fontSize: 10,
            color: T.inkFaint,
          }}>{noticia.data}</span>
        </div>

        {/* title */}
        <div style={{
          fontFamily: T.fontDisplay,
          fontWeight: 800,
          fontSize: 14.5,
          letterSpacing: -0.2,
          color: T.ink,
          lineHeight: 1.25,
          marginBottom: 6,
        }}>{noticia.titol}</div>

        {/* summary */}
        <div style={{
          fontSize: 12.5,
          color: T.inkSoft,
          lineHeight: 1.5,
          marginBottom: 10,
        }}>{noticia.resum}</div>

        {/* footer: font + cta */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 10.5, color: T.inkMuted, fontWeight: 600 }}>
            {noticia.font}
          </span>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: k.solid, fontWeight: 700, fontSize: 11.5,
          }}>
            Llegir més <Icon name="arrow-right" size={13} color={k.solid} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.categoria === activeCat);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen">
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '8px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="share" />
      </div>

      {/* Kicker + title */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.noticias.solid, marginBottom: 4,
        }}>
          Resum diari · {dateStr}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26,
          letterSpacing: -0.6, margin: 0, lineHeight: 1.05,
        }}>
          Notícies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Category filter chips */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '0 16px 14px', scrollbarWidth: 'none',
      }}>
        {CATEGORIES_NOTICIAS.map(c => (
          <CatChip
            key={c.id}
            active={activeCat === c.id}
            label={c.label}
            onClick={() => setActiveCat(c.id)}
          />
        ))}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            color: T.inkMuted, fontFamily: T.font, fontSize: 14,
          }}>
            No hi ha notícies per a aquesta categoria.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* Footer stamp */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '8px 16px 16px',
        background: 'rgba(246,244,239,0.94)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: `1px solid ${T.hairline}`,
        textAlign: 'center',
        fontFamily: T.font, fontSize: 11, color: T.inkMuted,
        zIndex: 100,
      }}>
        Actualitzat cada dia a les 22:00 h · InfoPol
      </div>
    </div>
  );
}
