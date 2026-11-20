import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, Pill } from '../../components/Shared';
import { NOTICIAS } from '../../data/noticias';

const CAT_LABELS = {
  totes:         { label: 'Totes',        icon: 'grid' },
  internacional: { label: 'Internacional', icon: 'globe' },
  politica:      { label: 'Política',      icon: 'landmark' },
  economia:      { label: 'Economia',      icon: 'trending-up' },
  policial:      { label: 'Policial',      icon: 'shield' },
  esports:       { label: 'Esports',       icon: 'trophy' },
  cultura:       { label: 'Cultura',       icon: 'book-open' },
};

const CAT_COLOR = {
  internacional: T.cat.operativa,
  politica:      T.cat.leyes,
  economia:      T.cat.atajos,
  policial:      T.cat.transito,
  esports:       T.cat.academia,
  cultura:       T.cat.psico,
};

function FilterChip({ cat, active, onClick }) {
  const info = CAT_LABELS[cat];
  const color = cat === 'totes' ? T.cat.noticias : CAT_COLOR[cat] || T.cat.noticias;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 12px', borderRadius: T.r.pill, border: 'none', cursor: 'pointer',
      background: active ? color.solid : '#fff',
      color: active ? '#fff' : T.inkSoft,
      fontFamily: T.font, fontWeight: 700, fontSize: 12,
      boxShadow: T.shadow.card,
      flexShrink: 0,
      transition: 'background 0.15s, color 0.15s',
    }}>
      <Icon name={info.icon} size={13} color={active ? '#fff' : T.inkMuted} strokeWidth={2.3} />
      {info.label}
    </button>
  );
}

function NoticiaCard({ noticia }) {
  const color = CAT_COLOR[noticia.cat] || T.cat.noticias;
  return (
    <a
      href={noticia.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${color.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Pill bg={color.soft} fg={color.ink} size={10}>{noticia.tag}</Pill>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {noticia.date}·26
          </span>
          <Icon name="external-link" size={12} color={T.inkFaint} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3, marginBottom: 5 }}>
          {noticia.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45 }}>
          {noticia.desc}
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticiasHome() {
  const [activeCat, setActiveCat] = useState('totes');
  const filtered = activeCat === 'totes'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.cat === activeCat);
  const today = new Date();
  const dateStr = today.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <Pill bg={T.cat.noticias.soft} fg={T.cat.noticias.ink}>Diari</Pill>
      </div>

      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.noticias.solid, marginBottom: 4 }}>
          {dateStr}
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Noticies del <span style={{ color: T.cat.noticias.solid }}>dia</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {Object.keys(CAT_LABELS).map(cat => (
          <FilterChip
            key={cat}
            cat={cat}
            active={activeCat === cat}
            onClick={() => setActiveCat(cat)}
          />
        ))}
      </div>

      {/* Top story hero */}
      {activeCat === 'totes' && NOTICIAS.length > 0 && (() => {
        const top = NOTICIAS[0];
        const color = CAT_COLOR[top.cat] || T.cat.noticias;
        return (
          <div style={{ padding: '0 16px 10px' }}>
            <a href={top.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                background: color.solid,
                borderRadius: T.r.xl,
                padding: 18,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}>
                <div style={{ position: 'absolute', right: -28, top: -28, width: 130, height: 130, borderRadius: 200, background: 'rgba(255,255,255,0.1)' }} />
                <Pill bg="rgba(255,255,255,0.2)" fg="#fff">{top.tag} · Destacada</Pill>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 18, letterSpacing: -0.3, marginTop: 10, lineHeight: 1.2 }}>
                  {top.title}
                </div>
                <div style={{ fontSize: 12.5, opacity: 0.88, marginTop: 8, lineHeight: 1.4 }}>
                  {top.desc}
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, opacity: 0.9 }}>
                  Llegir la notícia <Icon name="arrow-right" size={14} color="#fff" />
                </div>
              </div>
            </a>
          </div>
        );
      })()}

      {/* News list */}
      <SectionHead
        kicker="Resum informatiu"
        kickerColor={T.cat.noticias.solid}
        title={`${filtered.length} notícies`}
      />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(activeCat === 'totes' ? filtered.slice(1) : filtered).map(n => (
          <NoticiaCard key={n.id} noticia={n} />
        ))}
      </div>

      <div style={{ padding: '20px 16px 0', textAlign: 'center', fontSize: 11, color: T.inkFaint }}>
        Actualitzat el {dateStr} · Fonts: EFE, El Economista, ESPN, Mossos
      </div>
    </div>
  );
}
