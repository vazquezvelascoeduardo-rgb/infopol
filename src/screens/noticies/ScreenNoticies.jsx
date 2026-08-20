import { useMemo, useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, SectionHead } from '../../components/Shared';
import { NOTICIES, NOTICIES_META, NOTICIES_SCOPES } from '../../data/noticies';

const SCOPE_META = {
  catalunya:     { color: T.cat.operativa, icon: 'pin',    label: 'Catalunya' },
  espanya:       { color: T.cat.leyes,     icon: 'flag',   label: 'Espanya' },
  internacional: { color: T.cat.transito,  icon: 'globe',  label: 'Internacional' },
};

function ScopePill({ scope }) {
  const m = SCOPE_META[scope] || SCOPE_META.espanya;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: m.color.soft, color: m.color.ink,
      padding: '3px 8px 3px 6px', borderRadius: 999,
      fontFamily: T.font, fontSize: 10, fontWeight: 800,
      letterSpacing: 0.4, textTransform: 'uppercase',
    }}>
      <Icon name={m.icon} size={11} color={m.color.solid} strokeWidth={2.4} />
      {m.label}
    </span>
  );
}

function NoticiaCard({ n }) {
  const m = SCOPE_META[n.scope] || SCOPE_META.espanya;
  return (
    <a href={n.url} target="_blank" rel="noopener noreferrer" style={{
      display: 'block', textDecoration: 'none', color: 'inherit',
      background: '#fff', borderRadius: T.r.md, padding: 14,
      borderLeft: `3px solid ${m.color.solid}`, boxShadow: T.shadow.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <ScopePill scope={n.scope} />
        <span style={{ fontSize: 10, fontWeight: 800, color: m.color.solid, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {n.tag.split('·').slice(1).join('·').trim() || n.tag}
        </span>
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>{n.title}</div>
      <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 4, lineHeight: 1.45 }}>{n.desc}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: T.inkFaint, fontWeight: 600 }}>{n.source}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: m.color.solid, fontWeight: 700, fontSize: 12 }}>
          Llegir <Icon name="external-link" size={13} color={m.color.solid} />
        </span>
      </div>
    </a>
  );
}

export default function ScreenNoticies() {
  const [scope, setScope] = useState('all');
  const filtered = useMemo(() => (
    scope === 'all' ? NOTICIES : NOTICIES.filter(n => n.scope === scope)
  ), [scope]);

  const groups = useMemo(() => {
    if (scope !== 'all') return null;
    return ['catalunya', 'espanya', 'internacional']
      .map(id => ({ id, items: NOTICIES.filter(n => n.scope === id) }))
      .filter(g => g.items.length > 0);
  }, [scope]);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />
      <NavHeader
        cat="operativa"
        kicker={`Actualitzat · ${NOTICIES_META.updatedLabel}`}
        title="Notícies del dia"
        back
      />

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {NOTICIES_SCOPES.map(s => {
            const active = scope === s.id;
            return (
              <button key={s.id} onClick={() => setScope(s.id)} style={{
                border: 'none', cursor: 'pointer', flexShrink: 0,
                padding: '7px 14px', borderRadius: 999,
                background: active ? T.ink : '#fff',
                color: active ? '#fff' : T.inkSoft,
                boxShadow: active ? 'none' : T.shadow.card,
                fontFamily: T.font, fontWeight: 700, fontSize: 12,
                letterSpacing: 0.3, textTransform: 'uppercase',
              }}>{s.label}</button>
            );
          })}
        </div>
      </div>

      {groups ? (
        groups.map(g => {
          const m = SCOPE_META[g.id];
          return (
            <div key={g.id} style={{ padding: '10px 0 4px' }}>
              <SectionHead kicker={m.label} kickerColor={m.color.solid} title={`${g.items.length} titulars`} />
              <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.items.map(n => <NoticiaCard key={n.id} n={n} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(n => <NoticiaCard key={n.id} n={n} />)}
        </div>
      )}

      <div style={{ padding: '18px 16px 4px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.5 }}>
          Selecció diària automàtica · {NOTICIES.length} notícies · Fonts obertes
        </div>
      </div>
    </div>
  );
}
