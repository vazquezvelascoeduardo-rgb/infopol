// La pantalla d'un verb: Estudiar, Practicar o Repassar.
//
// Abans els tres botons de l'Acadèmia anaven directes al temari, al test
// i al repàs, i la resta —esquemes, cultura general, flashcards,
// diagnòstic— quedava escampada per una columna d'accessos al costat. Qui
// entrava per "Estudiar" es pensava que allò era tot el que hi havia.
//
// Ara cada verb té la seva pantalla i hi ensenya tot el que li pertoca,
// amb el principal gran i a dalt. El que abans era la columna del costat
// ha desaparegut: el que hi havia viu aquí dins, on toca.
import { useNavigate, useParams } from 'react-router-dom';

import Capcalera from '../../components/Capcalera';
import { useAuth } from '../../lib/auth';
import { useCos, metaCos } from '../../lib/cos';
import { esBloquejat, plaDelPerfil } from '../../lib/pla';
import { verbs, type Entrada } from '../../lib/verbs';
import { TEMES } from '../../content/temari-pl';
import { CadenatPro, I, RV, V } from '../../lib/v3';

function Targeta({ e, gran, bloquejat, onClick }: {
  e: Entrada; gran: boolean; bloquejat: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={bloquejat}
      style={{
        position: 'relative', textAlign: 'left', width: '100%',
        cursor: bloquejat ? 'not-allowed' : 'pointer', border: 'none', borderRadius: 20,
        transition: 'transform .18s ease, box-shadow .18s ease',
        padding: gran ? 22 : 18,
        background: gran ? 'var(--accent)' : V.surface,
        color: gran ? '#fff' : V.ink,
        boxShadow: gran ? '0 10px 26px var(--accent-ombra)' : '0 1px 2px rgba(21,21,28,.04), 0 6px 18px rgba(21,21,28,.05)',
        display: 'flex', alignItems: 'center', gap: 15,
      }}>
      <span style={{
        width: gran ? 52 : 42, height: gran ? 52 : 42, flexShrink: 0, borderRadius: 15,
        background: gran ? 'rgba(255,255,255,.24)' : 'var(--accent-soft)',
        color: gran ? '#fff' : 'var(--accent-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <I n={e.icona} size={gran ? 24 : 19} sw={1.9} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: gran ? 19 : 15.5, fontWeight: 800, letterSpacing: -0.5 }}>
          {e.titol}
        </span>
        <span style={{
          display: 'block', fontSize: gran ? 13.5 : 12.5, marginTop: 4, lineHeight: 1.4,
          color: gran ? 'rgba(255,255,255,.9)' : V.muted,
        }}>
          {e.sub}
        </span>
      </span>
      {e.insignia && (
        <span style={{
          flexShrink: 0, fontSize: 11, fontWeight: 700, borderRadius: RV.pill, padding: '6px 11px',
          background: gran ? 'rgba(255,255,255,.24)' : 'var(--accent-soft)',
          color: gran ? '#fff' : 'var(--accent-ink)',
        }}>
          {e.insignia}
        </span>
      )}
      {!e.insignia && <span style={{ fontSize: 20, fontWeight: 800, opacity: 0.5 }}>›</span>}
      {bloquejat && <CadenatPro />}
    </button>
  );
}

export default function Verb() {
  const { verb } = useParams<{ verb: string }>();
  const nav = useNavigate();
  const { profile } = useAuth();
  const [cos] = useCos();
  const pla = plaDelPerfil(profile);
  const meta = metaCos(cos);

  const v = verbs(cos, TEMES.length).find((x) => x.id === verb);
  if (!v) {
    return (
      <div className="v3-page v3-anim">
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Això no existeix</h1>
      </div>
    );
  }

  const [principal, ...resta] = v.entrades;

  return (
    <div className="v3-page v3-anim" style={{ ['--accent' as never]: meta.accent }}>
      <Capcalera kicker={`ACADÈMIA · ${meta.label.toUpperCase()}`} titol={v.titol} lead={v.sub} />

      <div style={{ display: 'grid', gap: 12 }}>
        <Targeta
          e={principal}
          gran
          bloquejat={!!principal.modul && esBloquejat(principal.modul, pla)}
          onClick={() => nav(principal.modul && esBloquejat(principal.modul, pla) ? '/perfil' : principal.to)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
        {resta.map((e) => {
          const tancat = !!e.modul && esBloquejat(e.modul, pla);
          return (
            <Targeta
              key={e.to}
              e={e}
              gran={false}
              bloquejat={tancat}
              onClick={() => nav(tancat ? '/perfil' : e.to)}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
}
