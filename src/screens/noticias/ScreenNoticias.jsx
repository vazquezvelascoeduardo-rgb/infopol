import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, Pill } from '../../components/Shared';
import { NOTICIAS, NOTICIAS_CATS } from '../../data/noticias';

const ALL_CATS = ['tots', ...Object.keys(NOTICIAS_CATS)];

function CatFilter({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 12px',
      scrollbarWidth: 'none',
    }}>
      {ALL_CATS.map(c => {
        const isActive = active === c;
        const meta = NOTICIAS_CATS[c];
        const color = meta ? T.cat[meta.color].solid : T.cat.operativa.solid;
        const label = meta ? meta.label : 'Tots';
        return (
          <button key={c} onClick={() => onChange(c)} style={{
            flexShrink: 0, border: 'none', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 999,
            background: isActive ? color : '#fff',
            color: isActive ? '#fff' : T.inkSoft,
            fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
            letterSpacing: 0.3, textTransform: 'uppercase',
            boxShadow: T.shadow.card,
            transition: 'all 0.15s',
          }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function NoticiaCard({ item, onOpenLink }) {
  const meta = NOTICIAS_CATS[item.cat] || NOTICIAS_CATS.internacional;
  const k = T.cat[meta.color];
  return (
    <div style={{
      background: '#fff', borderRadius: T.r.lg, padding: 16,
      borderLeft: `3px solid ${k.solid}`, boxShadow: T.shadow.card,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6,
          textTransform: 'uppercase', color: k.solid,
          background: k.soft, padding: '3px 8px', borderRadius: 999,
        }}>{item.tag}</span>
        <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{item.date}</span>
      </div>
      <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 15, letterSpacing: -0.2, color: T.ink, lineHeight: 1.25, marginBottom: 7 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>
        {item.summary}
      </div>
      <button
        onClick={() => onOpenLink(item.url)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: k.soft, color: k.ink, border: 'none',
          padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: T.font, fontWeight: 700, fontSize: 11.5,
        }}
      >
        Llegir notícia completa <Icon name="external-link" size={13} color={k.ink} />
      </button>
    </div>
  );
}

export default function ScreenNoticias() {
  const [activeCat, setActiveCat] = useState('tots');

  const filtered = activeCat === 'tots'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);

  function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Notícies" back />

      <div style={{ padding: '0 16px 4px', fontFamily: T.font, fontSize: 12.5, color: T.inkMuted }}>
        Resum diari de notícies de Catalunya, Espanya i internacional.
        Actualitzat cada nit.
      </div>

      <div style={{ padding: '12px 0 0' }}>
        <CatFilter active={activeCat} onChange={setActiveCat} />
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, padding: '40px 0', fontSize: 14 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        )}
        {filtered.map(item => (
          <NoticiaCard key={item.id} item={item} onOpenLink={openLink} />
        ))}
      </div>

      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="info" size={13} color={T.inkMuted} />
        <span style={{ fontSize: 11, color: T.inkMuted, fontStyle: 'italic' }}>
          Les notícies provenen de fonts externes. InfoPol no n'és responsable del contingut.
        </span>
      </div>
    </div>
  );
}
