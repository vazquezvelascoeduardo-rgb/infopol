// Psicotècnics — la pantalla d'entrada.
//
// Dues maneres d'entrar-hi, i són ben diferents:
//
//  · Per categoria, per entrenar-ne una fins que surti sola.
//  · Simulacre, amb la barreja i el ritme de l'examen de veritat.
//
// Els dos exàmens de referència no porten la mateixa barreja —el de Mossos
// carrega en atenció i dades, el de l'iOpos reparteix en cinc blocs iguals—
// i per això el perfil del simulacre va lligat al cos que estàs preparant.
//
// No hi ha banc de preguntes: cada ítem surt d'una llavor. Dos opositors no
// fan mai el mateix examen, i no hi ha res per copiar.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CATEGORIES, LLARGADES, tempsText } from '../../lib/psicotecnics/cataleg.mjs';
import { I, Mono, RV, V, type NomIc } from '../../lib/v3';

export type Cos = 'pl' | 'mossos';

const ACCENTS: Record<Cos, { accent: string; ink: string; soft: string; kicker: string }> = {
  pl: { accent: '#FF7A1A', ink: '#C4530A', soft: '#FFEDDD', kicker: 'POLICIA LOCAL' },
  mossos: { accent: '#991B1B', ink: '#991B1B', soft: '#F7E5E5', kicker: "MOSSOS D'ESQUADRA" },
};

/** Una icona per categoria, perquè es distingeixin d'un cop d'ull. */
const ICONES: Record<string, NomIc> = {
  'cubs-desplegat': 'layers', 'cubs-mirall': 'layers', 'figura-reflectida': 'gem',
  'figura-girada': 'gem', disc: 'globe', abstracte: 'brain', 'series-figures': 'cards',
  'dau-planol': 'city', 'comptar-simbols': 'text', correspondencies: 'doc',
  numeric: 'chart', dades: 'chart', sinonims: 'book', analogies: 'book',
};

export default function ZonaPsico({ cos }: { cos: Cos }) {
  const nav = useNavigate();
  const a = ACCENTS[cos];
  const arrel = cos === 'pl' ? '/policia-local' : '/mossos';
  const perfil = cos === 'pl' ? 'iopos' : 'mossos';
  const [quantes, setQuantes] = useState(30);
  const [ambTemps, setAmbTemps] = useState(true);

  const comencaSimulacre = () => {
    const llavor = Math.floor(Math.random() * 900000) + 1000;
    nav(`${arrel}/psicotecnics/simulacre`
      + `?perfil=${perfil}&n=${quantes}&t=${ambTemps ? 1 : 0}&llavor=${llavor}`);
  };

  return (
    <div style={{ padding: '18px 16px 90px', maxWidth: 760, margin: '0 auto' }}>
      <Mono color={a.ink}>{a.kicker}</Mono>
      <h1 style={{
        margin: '6px 0 4px', fontSize: 26, fontWeight: 800, color: V.ink, letterSpacing: '-.02em',
      }}>
        Psicotècnics
      </h1>
      <p style={{ margin: '0 0 20px', color: V.muted, fontSize: 14, lineHeight: 1.5 }}>
        No són un banc de preguntes: es fabriquen. Cada vegada surten diferents,
        i la resposta bona no és una opinió, és conseqüència del model.
      </p>

      {/* ── Simulacre ─────────────────────────────────────────── */}
      <div style={{
        background: V.surface, border: `1px solid ${V.border}`, borderRadius: RV.lg,
        padding: 16, marginBottom: 22, boxShadow: V.shadow,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
          <I n="clock" size={19} color={a.accent} />
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: V.ink }}>Simulacre</h2>
        </div>
        <p style={{ margin: '0 0 14px', color: V.muted, fontSize: 13.5, lineHeight: 1.5 }}>
          Amb la barreja i el ritme de l'examen: 80 preguntes en 35 minuts.
          Els formats curts mantenen el mateix ritme.
        </p>

        <Mono>QUANTES PREGUNTES</Mono>
        <div style={{ display: 'flex', gap: 8, margin: '7px 0 14px' }}>
          {LLARGADES.map((n) => (
            <button
              key={n}
              onClick={() => setQuantes(n)}
              style={{
                flex: 1, padding: '11px 8px', borderRadius: RV.sm, cursor: 'pointer',
                border: `1.5px solid ${quantes === n ? a.accent : V.border}`,
                background: quantes === n ? a.soft : V.surface2,
                color: quantes === n ? a.ink : V.ink,
                font: 'inherit', fontWeight: quantes === n ? 700 : 500, fontSize: 15,
              }}
            >
              {n}
              <span style={{ display: 'block', fontSize: 11, fontWeight: 500, color: V.muted }}>
                {tempsText(n)}
              </span>
            </button>
          ))}
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={ambTemps}
            onChange={(e) => setAmbTemps(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: a.accent }}
          />
          <span style={{ fontSize: 14, color: V.ink }}>
            Amb temps
            <span style={{ color: V.muted }}>
              {ambTemps ? ` — ${tempsText(quantes)}, com a l'examen` : ' — sense rellotge, per pensar-hi'}
            </span>
          </span>
        </label>

        <button
          onClick={comencaSimulacre}
          style={{
            width: '100%', padding: '13px', borderRadius: RV.sm, border: 'none',
            background: a.accent, color: '#fff', font: 'inherit', fontWeight: 700,
            fontSize: 15.5, cursor: 'pointer',
          }}
        >
          Començar el simulacre
        </button>
      </div>

      {/* ── Per categories ────────────────────────────────────── */}
      <Mono>PER CATEGORIES</Mono>
      <p style={{ margin: '5px 0 12px', color: V.muted, fontSize: 13.5 }}>
        Per entrenar-ne una fins que surti sola. Les preguntes no s'acaben mai.
      </p>
      <div style={{ display: 'grid', gap: 9 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => nav(`${arrel}/psicotecnics/${c.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              background: V.surface, border: `1px solid ${V.border}`, borderRadius: RV.md,
              padding: '13px 14px', cursor: 'pointer', font: 'inherit', width: '100%',
            }}
          >
            <span style={{
              width: 36, height: 36, borderRadius: RV.xs, background: a.soft,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <I n={ICONES[c.id] ?? 'brain'} size={18} color={a.ink} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 650, fontSize: 15, color: V.ink }}>
                {c.nom}
              </span>
              <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 1 }}>
                {c.descripcio}
              </span>
            </span>
            <I n="arrow" size={17} color={V.faint} />
          </button>
        ))}
      </div>
    </div>
  );
}
