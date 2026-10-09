import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, SectionHead, RoundIconBtn } from '../../components/Shared';
import { NEWS, NOTICIA_CATS } from '../../data/news';

const FILTRES = [
  { id: 'tot',           label: 'Tot' },
  { id: 'policial',      label: 'Policial' },
  { id: 'politica',      label: 'Política' },
  { id: 'economia',      label: 'Economia' },
  { id: 'internacional', label: 'Internacional' },
  { id: 'esports',       label: 'Esports' },
  { id: 'ciencia',       label: 'Ciència' },
  { id: 'cultura',       label: 'Cultura' },
];

const AMBIT_COLORS = {
  Catalunya:      { bg: '#D8E2FE', fg: '#0E2B7A' },
  Espanya:        { bg: '#CDF0E1', fg: '#0B5A3D' },
  Internacional:  { bg: '#EBDAFB', fg: '#4A1B7A' },
};

function NoticiaCard({ noticia }) {
  const k = NOTICIA_CATS[noticia.cat] || NOTICIA_CATS.politica;
  const a = AMBIT_COLORS[noticia.ambit] || AMBIT_COLORS.Internacional;
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
        padding: 14,
        borderLeft: `3px solid ${k.solid}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{
            background: k.soft, color: k.ink,
            padding: '3px 8px', borderRadius: 999,
            fontFamily: T.font, fontWeight: 800, fontSize: 9.5, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{k.label}</span>
          <span style={{
            background: a.bg, color: a.fg,
            padding: '3px 8px', borderRadius: 999,
            fontFamily: T.font, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>{noticia.ambit}</span>
          <span style={{ marginLeft: 'auto', fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted }}>{noticia.data}</span>
        </div>
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 14.5,
          color: T.ink, lineHeight: 1.3, marginBottom: 5,
        }}>{noticia.titol}</div>
        <div style={{
          fontSize: 12, color: T.inkSoft, lineHeight: 1.45,
        }}>{noticia.resum}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: k.solid, fontWeight: 700, fontSize: 11.5 }}>
          Llegir article complet <Icon name="arrow-right" size={13} color={k.solid} />
        </div>
      </div>
    </a>
  );
}

export default function ScreenNoticiasHome() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState('tot');

  const noticies = filtre === 'tot' ? NEWS : NEWS.filter(n => n.cat === filtre);
  const darreraData = NEWS.length > 0 ? NEWS[0].data : '';

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 32 }}>
      <StatusBar />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 34, height: 34, borderRadius: 999, border: 'none',
            background: '#fff', boxShadow: T.shadow.card, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name="arrow-left" size={17} color={T.ink} />
          </button>
          <InfoPolWordmark height={17} />
        </div>
        <RoundIconBtn icon="bell" />
      </div>

      {/* Capçalera */}
      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 800, fontSize: 11,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: T.cat.operativa.solid, marginBottom: 4,
        }}>
          Notícies · {darreraData}
        </div>
        <h1 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: 26, letterSpacing: -0.6, margin: 0, lineHeight: 1.05,
        }}>
          Última hora
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.inkMuted, marginTop: 6, marginBottom: 0 }}>
          Catalunya · Espanya · Internacional
        </p>
      </div>

      {/* Filtres de categoria */}
      <div style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', width: 'max-content' }}>
          {FILTRES.map(f => {
            const active = filtre === f.id;
            const k = f.id !== 'tot' ? NOTICIA_CATS[f.id] : null;
            return (
              <button
                key={f.id}
                onClick={() => setFiltre(f.id)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: T.font, fontWeight: 800, fontSize: 12, letterSpacing: 0.3,
                  background: active ? (k ? k.solid : T.ink) : '#fff',
                  color: active ? '#fff' : T.inkSoft,
                  boxShadow: active ? 'none' : T.shadow.card,
                  transition: 'all .15s',
                }}
              >{f.label}</button>
            );
          })}
        </div>
      </div>

      {/* Llista de notícies */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {noticies.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.inkMuted, fontSize: 14, padding: '40px 0' }}>
            Cap notícia en aquesta categoria avui.
          </div>
        ) : (
          noticies.map(n => <NoticiaCard key={n.id} noticia={n} />)
        )}
      </div>

      {/* Peu */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 11.5, color: T.inkFaint, fontFamily: T.font }}>
          Actualitzat cada nit a les 22 h · InfoPol News
        </p>
      </div>
    </div>
  );
}
