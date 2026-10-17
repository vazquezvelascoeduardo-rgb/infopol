import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { InfoPolWordmark, StatusBar, RoundIconBtn, SectionHead } from '../../components/Shared';
import { NOTICIAS, CAT_LABELS } from '../../data/noticias';

const FILTRES = ['Tots', 'Policial', 'Política', 'Economia', 'Internacional', 'Ciència', 'Esports', 'Cultura'];

const FILTRE_KEY = {
  'Tots': null,
  'Policial': 'policial',
  'Política': 'politica',
  'Economia': 'economia',
  'Internacional': 'internacional',
  'Ciència': 'ciencia',
  'Esports': 'esports',
  'Cultura': 'cultura',
};

function AmbitsChip({ ambit }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
      color: T.inkMuted, padding: '3px 0',
    }}>
      {ambit}
    </span>
  );
}

function NoticiaCard({ noticia, onClick }) {
  const catInfo = CAT_LABELS[noticia.cat] || { label: noticia.cat, color: T.cat.operativa.solid };
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: T.r.lg,
        padding: 14,
        borderLeft: `3px solid ${catInfo.color}`,
        boxShadow: T.shadow.card,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
          color: catInfo.color, background: catInfo.color + '18',
          padding: '3px 8px', borderRadius: 999,
        }}>
          {catInfo.label}
        </span>
        <AmbitsChip ambit={noticia.ambit} />
        <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.inkMuted, marginLeft: 'auto' }}>
          {noticia.dataDisplay}
        </span>
      </div>

      <div style={{ fontWeight: 800, fontSize: 14, color: T.ink, lineHeight: 1.3, letterSpacing: -0.1 }}>
        {noticia.title}
      </div>

      <div style={{ fontSize: 12, color: T.inkSoft, lineHeight: 1.5 }}>
        {noticia.resum}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 11, color: T.inkMuted }}>
          Font: <b style={{ color: T.inkSoft }}>{noticia.font}</b>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: catInfo.color, fontWeight: 700, fontSize: 12 }}>
          Llegir més <Icon name="arrow-right" size={13} color={catInfo.color} />
        </div>
      </div>
    </div>
  );
}

function TagPill({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '7px 14px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        fontFamily: T.font,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.2,
        background: active ? (color || T.ink) : T.hairline,
        color: active ? '#fff' : T.inkSoft,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function ScreenNoticias() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState('Tots');

  const key = FILTRE_KEY[filtre];
  const noticias = key ? NOTICIAS.filter(n => n.cat === key) : NOTICIAS;

  const dataDarrera = NOTICIAS[0]?.dataDisplay ?? '—';
  const catColor = key && CAT_LABELS[key] ? CAT_LABELS[key].color : T.cat.operativa.solid;

  return (
    <div className="screen-no-tabs" style={{ paddingBottom: 40 }}>
      <StatusBar />

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RoundIconBtn icon="arrow-left" onClick={() => navigate(-1)} />
          <InfoPolWordmark height={17} />
        </div>
        <RoundIconBtn icon="user" onClick={() => navigate('/perfil')} />
      </div>

      {/* header */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: '#E04F5F', marginBottom: 4 }}>
          Noticias · Actualitat
        </div>
        <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 26, letterSpacing: -0.6, margin: '0 0 4px' }}>
          Última hora
        </h1>
        <div style={{ fontSize: 12, color: T.inkMuted }}>
          Catalunya · Espanya · Internacional · Actualitzat: <b style={{ color: T.inkSoft }}>{dataDarrera}</b>
        </div>
      </div>

      {/* filtres horitzontals */}
      <div style={{ paddingLeft: 16, paddingBottom: 14, display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {FILTRES.map(f => (
          <TagPill
            key={f}
            label={f}
            active={filtre === f}
            color={FILTRE_KEY[f] && CAT_LABELS[FILTRE_KEY[f]] ? CAT_LABELS[FILTRE_KEY[f]].color : T.ink}
            onClick={() => setFiltre(f)}
          />
        ))}
        <div style={{ width: 8, flexShrink: 0 }} />
      </div>

      {/* llista */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {noticias.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.inkMuted, fontSize: 14 }}>
            No hi ha notícies en aquesta categoria avui.
          </div>
        ) : (
          noticias.map(n => (
            <NoticiaCard
              key={n.id}
              noticia={n}
              onClick={() => window.open(n.url, '_blank', 'noopener')}
            />
          ))
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center', fontSize: 11, color: T.inkFaint, lineHeight: 1.6 }}>
        InfoPol Noticias · Actualització diària a les 22:00 h<br/>
        Resums automàtics. Fes clic per llegir la notícia completa a la font original.
      </div>
    </div>
  );
}
