import { useState } from 'react';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, Pill, SectionHead, RoundIconBtn } from '../../components/Shared';
import { NEWS, CAT_META } from '../../data/news';

const FILTRES = [
  { id: 'tots',          label: 'Tots' },
  { id: 'policial',      label: 'Policial' },
  { id: 'politica',      label: 'Política' },
  { id: 'economia',      label: 'Economia' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'esports',       label: 'Esports' },
  { id: 'cultura',       label: 'Cultura' },
  { id: 'descobertes',   label: 'Descobertes' },
  { id: 'premis',        label: 'Premis' },
];

const AMBIT_COLORS = {
  Catalunya:     T.cat.operativa.solid,
  Espanya:       T.cat.leyes.solid,
  Internacional: T.cat.transito.solid,
};

function NoticiaCard({ noticia }) {
  const meta   = CAT_META[noticia.categoria] || CAT_META.politica;
  const k      = T.cat[meta.color];
  const ambitC = AMBIT_COLORS[noticia.ambit] || T.inkMuted;

  return (
    <a
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 14,
        borderTop: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        {/* meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: T.r.pill,
            background: k.soft, color: k.ink,
            fontFamily: T.font, fontWeight: 800, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>
            <Icon name={meta.icon} size={11} color={k.ink} strokeWidth={2.6} />
            {meta.label}
          </span>
          <span style={{
            padding: '3px 8px', borderRadius: T.r.pill,
            background: 'rgba(0,0,0,0.05)', color: T.inkMuted,
            fontFamily: T.font, fontWeight: 700, fontSize: 10,
          }}>{noticia.ambit}</span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted,
          }}>{noticia.data.slice(5).replace('-', '·')}</span>
        </div>

        {/* headline */}
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 15, letterSpacing: -0.3, color: T.ink, lineHeight: 1.25,
          marginBottom: 6,
        }}>{noticia.titular}</div>

        {/* summary */}
        <div style={{
          fontSize: 12.5, color: T.inkSoft, lineHeight: 1.5,
          marginBottom: 10,
        }}>{noticia.resum}</div>

        {/* footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${T.hairline}`, paddingTop: 8,
        }}>
          <span style={{ fontSize: 10.5, color: T.inkMuted, fontWeight: 600 }}>
            Font: {noticia.font}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            color: k.solid, fontWeight: 700, fontSize: 11,
          }}>
            Llegir notícia <Icon name="arrow-right" size={13} color={k.solid} />
          </span>
        </div>
      </div>
    </a>
  );
}

function formatDataDisplay(dataStr) {
  const d = new Date(dataStr + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ScreenNoticias() {
  const [filtre, setFiltre] = useState('tots');

  const avui = new Date().toISOString().slice(0, 10);

  const noticiesAvui = NEWS.filter(n => n.data === avui);
  const noticiesAnteriors = NEWS.filter(n => n.data !== avui);

  const aplicarFiltre = (llista) =>
    filtre === 'tots' ? llista : llista.filter(n => n.categoria === filtre);

  const avuiFiltrades    = aplicarFiltre(noticiesAvui);
  const anteriorsFiltrades = aplicarFiltre(noticiesAnteriors);

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* header */}
      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <InfoPolWordmark height={18} />
        <RoundIconBtn icon="bell" />
      </div>

      <div style={{ padding: '4px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: T.cat.operativa.solid, marginBottom: 4 }}>
          Actualitat · Diari
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: 0 }}>
          Notícies
        </h1>
      </div>

      {/* filter chips */}
      <div style={{ paddingLeft: 16, paddingBottom: 14, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingRight: 16 }}>
        {FILTRES.map(f => {
          const actiu = f.id === filtre;
          return (
            <button key={f.id} onClick={() => setFiltre(f.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: T.r.pill,
              border: `1px solid ${actiu ? T.cat.operativa.solid : T.hairlineStrong}`,
              background: actiu ? T.cat.operativa.solid : '#fff',
              color: actiu ? '#fff' : T.inkSoft,
              fontFamily: T.font, fontWeight: 700, fontSize: 12,
              cursor: 'pointer',
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* today's news */}
      {avuiFiltrades.length > 0 && (
        <div style={{ padding: '0 0 8px' }}>
          <SectionHead
            kicker="Avui"
            kickerColor={T.cat.alcohol.solid}
            title={formatDataDisplay(avui)}
            style={{ padding: '0 16px', marginBottom: 10 }}
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {avuiFiltrades.map(n => <NoticiaCard key={n.id} noticia={n} />)}
          </div>
        </div>
      )}

      {/* older news */}
      {anteriorsFiltrades.length > 0 && (
        <div style={{ padding: '12px 0 8px' }}>
          <SectionHead
            kicker="Anteriors"
            kickerColor={T.inkMuted}
            title="Notícies recents"
            style={{ padding: '0 16px', marginBottom: 10 }}
          />
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {anteriorsFiltrades.map(n => <NoticiaCard key={n.id} noticia={n} />)}
          </div>
        </div>
      )}

      {avuiFiltrades.length === 0 && anteriorsFiltrades.length === 0 && (
        <div style={{ padding: '40px 32px', textAlign: 'center' }}>
          <Icon name="search" size={36} color={T.inkFaint} />
          <div style={{ fontWeight: 700, color: T.inkMuted, marginTop: 12 }}>
            Cap notícia per a aquesta categoria
          </div>
        </div>
      )}
    </div>
  );
}
