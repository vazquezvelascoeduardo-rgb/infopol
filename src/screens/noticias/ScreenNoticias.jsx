import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../../components/Shared';
import { NOTICIAS, AREAS, TAGS_COLOR } from '../../data/noticias';

const NEWS_COLOR = { solid: '#D63A3A', soft: '#FAE8E8', ink: '#6B1212' };

function TagPill({ tag }) {
  const color = TAGS_COLOR[tag] || T.cat.leyes.solid;
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
      color, background: color + '18',
      padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase',
    }}>{tag}</span>
  );
}

function AreaBadge({ area }) {
  const map = {
    CAT: { bg: T.cat.operativa.soft, fg: T.cat.operativa.ink, label: 'Catalunya' },
    ESP: { bg: T.cat.leyes.soft, fg: T.cat.leyes.ink, label: 'Espanya' },
    INT: { bg: T.cat.transito.soft, fg: T.cat.transito.ink, label: 'Internacional' },
  };
  const s = map[area] || { bg: T.cat.atajos.soft, fg: T.cat.atajos.ink, label: area };
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase',
      background: s.bg, color: s.fg, padding: '2px 7px', borderRadius: 999,
    }}>{s.label}</span>
  );
}

function NoticiaCard({ noticia }) {
  const tagColor = TAGS_COLOR[noticia.tag] || NEWS_COLOR.solid;
  return (
    <a
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${tagColor}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <AreaBadge area={noticia.area} />
          <TagPill tag={noticia.tag} />
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {noticia.date}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.35, marginBottom: 5 }}>
          {noticia.title}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.45 }}>
          {noticia.desc}
        </div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, fontWeight: 700, color: tagColor,
        }}>
          Llegir notícia <Icon name="arrow-right" size={12} color={tagColor} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeArea, setActiveArea] = useState('TOTS');

  const filtered = activeArea === 'TOTS'
    ? NOTICIAS
    : NOTICIAS.filter(n => n.area === activeArea);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '10px 16px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            background: NEWS_COLOR.soft, color: NEWS_COLOR.ink,
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 0.8, textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 999,
          }}>
            Notícies
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          background: NEWS_COLOR.solid,
          borderRadius: T.r.lg,
          padding: '16px 18px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 200, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{
            fontFamily: T.font, fontWeight: 800, fontSize: 10,
            letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.8, marginBottom: 4,
          }}>
            Actualitat · InfoPol
          </div>
          <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 22, letterSpacing: -0.4, lineHeight: 1.1 }}>
            Catalunya · Espanya<br />Internacional
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            Política, economia, cultura, esports, successos i molt més.
          </div>
          <div style={{
            marginTop: 10, fontFamily: T.fontMono, fontSize: 10,
            opacity: 0.7, display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="clock" size={11} color="#fff" />
            Actualitzat avui
          </div>
        </div>
      </div>

      {/* Area filter pills */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {AREAS.map(a => (
          <button
            key={a.id}
            onClick={() => setActiveArea(a.id)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              fontFamily: T.font,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              background: activeArea === a.id ? NEWS_COLOR.solid : '#fff',
              color: activeArea === a.id ? '#fff' : T.inkMuted,
              boxShadow: activeArea === a.id ? 'none' : T.shadow.card,
              transition: 'background 0.15s',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* News list */}
      <div style={{ padding: '0 16px' }}>
        <SectionHead
          kicker={`${filtered.length} notícies`}
          kickerColor={NEWS_COLOR.solid}
          title={activeArea === 'TOTS' ? 'Totes les notícies' : AREAS.find(a => a.id === activeArea)?.label}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {filtered.map(n => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkFaint, lineHeight: 1.5 }}>
          Les notícies s'actualitzen diàriament a les 22h.<br />
          Fes clic a cada notícia per llegir-la completa.
        </div>
      </div>
    </div>
  );
}
