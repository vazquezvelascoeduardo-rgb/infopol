import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../tokens';
import Icon from '../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead } from '../components/Shared';
import { NOTICIES, CAT_META, GEO_META } from '../data/noticies';

const CATS = ['totes', ...Object.keys(CAT_META)];

function FilterChip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
      fontFamily: T.font, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap',
      background: active ? color : T.card,
      color: active ? '#fff' : T.inkSoft,
      boxShadow: active ? 'none' : T.shadow.card,
      transition: 'all 0.15s',
    }}>{label}</button>
  );
}

function GeoTag({ geo }) {
  const colors = {
    catalunya:    { bg: '#D8E2FE', fg: '#0E2B7A' },
    espanya:      { bg: '#FBE7C2', fg: '#6B3F08' },
    internacional:{ bg: '#CDF0E1', fg: '#0B5A3D' },
  };
  const c = colors[geo] || { bg: T.hairline, fg: T.inkMuted };
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
      padding: '3px 7px', borderRadius: 999, background: c.bg, color: c.fg,
    }}>{GEO_META[geo]}</span>
  );
}

function NoticiaCard({ n }) {
  const m = CAT_META[n.cat];
  return (
    <a href={n.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={{
        background: T.card, borderRadius: T.r.md, padding: 14,
        borderLeft: `3px solid ${m.color}`, boxShadow: T.shadow.card,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 999, background: m.soft, color: m.ink,
          }}>{m.label}</span>
          <GeoTag geo={n.geo} />
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>{n.date}</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase',
            color: m.color, flexShrink: 0, paddingTop: 1,
          }}>{n.tag}</span>
        </div>

        <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.35, letterSpacing: -0.1 }}>
          {n.title}
        </div>
        <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5 }}>
          {n.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: m.color, fontSize: 11.5, fontWeight: 700 }}>
          Llegir notícia completa <Icon name="arrow-right" size={13} color={m.color} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticies() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('totes');

  const filtered = activeCat === 'totes' ? NOTICIES : NOTICIES.filter(n => n.cat === activeCat);

  const today = new Date().toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <Icon name="chevron-left" size={22} color={T.ink} />
          </button>
          <InfoPolWordmark height={17} />
        </div>
        <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>01·09·2026</div>
      </div>

      {/* hero */}
      <div style={{ padding: '4px 18px 16px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.leyes.solid, marginBottom: 6 }}>
          Actualitat · Diari InfoPol
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 28, lineHeight: 1.05, letterSpacing: -1, color: T.ink, margin: 0 }}>
          Notícies del dia
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 12.5, color: T.inkMuted, marginTop: 6, marginBottom: 0, lineHeight: 1.5, textTransform: 'capitalize' }}>
          {today}
        </p>
      </div>

      {/* filter chips */}
      <div style={{ padding: '0 18px 14px', overflowX: 'auto', display: 'flex', gap: 6, scrollbarWidth: 'none' }}>
        <FilterChip
          label="Totes"
          active={activeCat === 'totes'}
          color={T.ink}
          onClick={() => setActiveCat('totes')}
        />
        {Object.entries(CAT_META).map(([key, m]) => (
          <FilterChip
            key={key}
            label={m.label}
            active={activeCat === key}
            color={m.color}
            onClick={() => setActiveCat(key)}
          />
        ))}
      </div>

      {/* stats row */}
      <div style={{ padding: '0 18px 16px', display: 'flex', gap: 10 }}>
        {[
          { label: 'Notícies', val: filtered.length, color: T.ink },
          { label: 'Catalunya', val: filtered.filter(n => n.geo === 'catalunya').length, color: '#3B6BF5' },
          { label: 'Espanya', val: filtered.filter(n => n.geo === 'espanya').length, color: '#E89421' },
          { label: 'Internacional', val: filtered.filter(n => n.geo === 'internacional').length, color: '#1FB286' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: T.card, borderRadius: T.r.md, padding: '10px 8px', textAlign: 'center', boxShadow: T.shadow.card }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 20, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
            <div style={{ fontSize: 9.5, color: T.inkMuted, fontWeight: 700, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* news list */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies per aquesta categoria avui.
          </div>
        ) : (
          filtered.map(n => <NoticiaCard key={n.id} n={n} />)
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '24px 18px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: T.inkMuted, lineHeight: 1.6 }}>
          Resum diari d'InfoPol · Fonts: Euronews, El Periódico, El Nacional, 9to5Mac, ESPN Deportes, Poder Judicial.
        </div>
      </div>
    </div>
  );
}
