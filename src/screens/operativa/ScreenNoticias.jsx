import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, SectionHead, Pill } from '../../components/Shared';
import { NOTICIAS } from '../../data/news';

const SCOPE_COLOR = {
  Catalunya:     T.cat.operativa,
  Espanya:       T.cat.leyes,
  Internacional: T.cat.transito,
};

const CAT_ICON = {
  politica:     'scale',
  economia:     'chart',
  cultura:      'book',
  esports:      'bolt',
  policia:      'siren',
  descobriment: 'beaker',
  societat:     'flag',
};

const SCOPES = ['Catalunya', 'Espanya', 'Internacional'];
const ALL = 'Tots';

function NoticiaCard({ n }) {
  const sc = SCOPE_COLOR[n.scope] || T.cat.operativa;
  return (
    <a
      href={n.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.md,
        padding: 14,
        borderLeft: `3px solid ${sc.solid}`,
        boxShadow: T.shadow.card,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, color: sc.ink,
            letterSpacing: 0.7, textTransform: 'uppercase', fontFamily: T.font,
            background: sc.soft, padding: '2px 7px', borderRadius: T.r.pill,
          }}>
            {n.scope}
          </span>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
            {n.dateLabel}
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
        <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>{n.desc}</div>
        {n.url && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: sc.solid }}>
            <span style={{ fontSize: 11, fontWeight: 700 }}>Llegir notícia</span>
            <Icon name="arrow-right" size={12} color={sc.solid} />
          </div>
        )}
      </div>
    </a>
  );
}

export default function ScreenNoticias() {
  const [activeScope, setActiveScope] = useState(ALL);

  const filtered = activeScope === ALL
    ? NOTICIAS
    : NOTICIAS.filter(n => n.scope === activeScope);

  const byDate = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  const filterBg = (scope) => scope === activeScope
    ? SCOPE_COLOR[scope]?.solid || T.cat.operativa.solid
    : '#fff';

  const filterFg = (scope) => scope === activeScope
    ? '#fff'
    : T.inkMuted;

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat="operativa" kicker="InfoPol · Actualitat" title="Notícies" back />

      {/* Filtres de scope */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[ALL, ...SCOPES].map(s => (
          <button
            key={s}
            onClick={() => setActiveScope(s)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: T.r.pill,
              border: `1.5px solid ${s === activeScope ? 'transparent' : T.hairline}`,
              background: s === ALL
                ? s === activeScope ? T.cat.operativa.solid : '#fff'
                : filterBg(s),
              color: s === ALL
                ? s === activeScope ? '#fff' : T.inkMuted
                : filterFg(s),
              fontFamily: T.font,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              boxShadow: T.shadow.card,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Llista de notícies agrupades per data */}
      <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sortedDates.length === 0 && (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, paddingTop: 40 }}>
            Sense notícies per a aquest àmbit.
          </div>
        )}
        {sortedDates.map(date => (
          <div key={date}>
            <div style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 10.5,
              letterSpacing: 1.1, textTransform: 'uppercase',
              color: T.inkMuted, marginBottom: 10,
            }}>
              {new Date(date + 'T12:00:00').toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {byDate[date].map(n => <NoticiaCard key={n.id} n={n} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
