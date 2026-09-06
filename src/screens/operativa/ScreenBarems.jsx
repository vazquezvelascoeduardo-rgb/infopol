import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { T } from '../../tokens';
import Icon from '../../components/Icon';
import { StatusBar, NavHeader, SectionTitle, Pill } from '../../components/Shared';
import FontFooter from '../../components/FontFooter';
import {
  BAREM_VELOCITAT, BAREM_ALCOHOL, FONT,
  sancioVelocitat, sancioAlcohol,
} from '../../data/infractions';

const PERFILS = [
  { id: 'general', label: 'General (major d’edat)' },
  { id: 'professional', label: 'Professional / novell' },
  { id: 'menor', label: 'Menor sense permís' },
  { id: 'menor-novell', label: 'Menor, permís < 2 anys' },
  { id: 'menor-experimentat', label: 'Menor, permís > 2 anys' },
];

function Card({ children, style = {} }) {
  return (
    <div style={{ background: '#fff', borderRadius: T.r.md, padding: 14, boxShadow: T.shadow.card, marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: T.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10,
  border: `1px solid ${T.hairlineStrong}`, background: '#fff', color: T.ink,
  fontFamily: T.font, fontSize: 15, fontWeight: 700,
};

function Resultat({ res, cat }) {
  if (!res) {
    return <div style={{ fontSize: 13, color: T.inkMuted }}>Introdueix les dades per calcular.</div>;
  }
  if (res.senseInfraccio) {
    return (
      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.cat.atajos.ink }}>
        Per sota del primer tram del barem: no hi ha infracció sancionable per aquesta via.
      </div>
    );
  }
  if (res.penal) {
    return (
      <div>
        <Pill bg={T.cat.alcohol.soft} fg={T.cat.alcohol.ink}>Delicte · {res.article}</Pill>
        <div style={{ fontSize: 13, color: T.inkSoft, lineHeight: 1.55, marginTop: 10 }}>{res.avis}</div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 30, letterSpacing: -1, color: T.ink }}>
          {res.fine.toLocaleString('ca')} €
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.inkMuted }}>DTE 50%: {res.fine50} €</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: cat.ink }}>
          {res.punts > 0 ? `−${res.punts} punts` : 'Sense punts'}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 8 }}>
        Tram: {res.tram}{res.perfil ? ` · ${res.perfil}` : ''}
      </div>
      {res.condicional && (
        <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 8, lineHeight: 1.5, padding: 10, background: T.bg, borderRadius: 9 }}>
          {BAREM_ALCOHOL.notaCondicional}
        </div>
      )}
      {res.nota && (
        <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 8, lineHeight: 1.5, padding: 10, background: T.bg, borderRadius: 9 }}>
          {res.nota}
        </div>
      )}
    </div>
  );
}

export default function ScreenBarems() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('b') === 'alcohol' ? 1 : 0);

  const [limit, setLimit] = useState(50);
  const [mesurada, setMesurada] = useState('');
  const [urbana, setUrbana] = useState(true);

  const [taxa, setTaxa] = useState('');
  const [perfil, setPerfil] = useState('general');
  const [reincident, setReincident] = useState(false);

  const resVel = useMemo(
    () => (mesurada === '' ? null : sancioVelocitat(limit, Number(mesurada), urbana)),
    [limit, mesurada, urbana],
  );
  const resAlc = useMemo(
    () => (taxa === '' ? null : sancioAlcohol(Number(String(taxa).replace(',', '.')), perfil, reincident)),
    [taxa, perfil, reincident],
  );

  const cat = tab === 0 ? T.cat.transito : T.cat.alcohol;

  return (
    <div className="screen">
      <StatusBar />
      <NavHeader cat={tab === 0 ? 'transito' : 'alcohol'} kicker={`Catàleg SCT · ${FONT.versioLabel}`} title="Barems sancionadors" back />

      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {['Velocitat', 'Alcoholèmia'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            flex: 1, padding: '10px 0', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: tab === i ? cat.solid : '#fff',
            color: tab === i ? '#fff' : T.inkSoft,
            fontFamily: T.font, fontWeight: 800, fontSize: 13,
            boxShadow: tab === i ? 'inset 0 -2px 0 rgba(0,0,0,0.18)' : T.shadow.card,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: '14px 16px' }}>
        {tab === 0 ? (
          <>
            <SectionTitle>Calculadora</SectionTitle>
            <Card>
              <Field label="Límit de la via (km/h)">
                <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={inputStyle}>
                  {BAREM_VELOCITAT.limits.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Velocitat mesurada (km/h)">
                <input type="number" inputMode="numeric" value={mesurada}
                  onChange={e => setMesurada(e.target.value)} placeholder="p. ex. 78" style={inputStyle} />
              </Field>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[[true, 'Via urbana'], [false, 'Via interurbana']].map(([v, l]) => (
                  <button key={l} onClick={() => setUrbana(v)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 999, cursor: 'pointer',
                    border: urbana === v ? 'none' : `1px solid ${T.hairlineStrong}`,
                    background: urbana === v ? T.ink : '#fff',
                    color: urbana === v ? '#fff' : T.inkSoft,
                    fontFamily: T.font, fontWeight: 700, fontSize: 12,
                  }}>{l}</button>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.5 }}>
                El tipus de via determina el llindar penal de l'art. 379.1 CP: +60 km/h en urbana,
                +80 km/h en interurbana.
              </div>
            </Card>

            <SectionTitle>Resultat</SectionTitle>
            <Card><Resultat res={resVel} cat={cat} /></Card>

            <SectionTitle>Taula completa</SectionTitle>
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: T.r.md, boxShadow: T.shadow.card, marginBottom: 12 }}>
              <table style={{ borderCollapse: 'collapse', fontSize: 11.5, minWidth: '100%' }}>
                <thead>
                  <tr>
                    <th style={th}>Límit</th>
                    {BAREM_VELOCITAT.bands.map(b => (
                      <th key={b.fine} style={th}>{b.fine} €<br /><span style={{ fontWeight: 600, color: T.inkMuted }}>{b.punts || 0} pts</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BAREM_VELOCITAT.limits.map((l, ci) => (
                    <tr key={l}>
                      <td style={{ ...td, fontWeight: 800 }}>{l}</td>
                      {BAREM_VELOCITAT.bands.map(b => (
                        <td key={b.fine} style={td}>
                          {b.to[ci] === null ? `>${b.from[ci] - 1}` : `${b.from[ci]}–${b.to[ci]}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.5, padding: '0 2px 8px' }}>
              {BAREM_VELOCITAT.nota}
            </div>
          </>
        ) : (
          <>
            <SectionTitle>Calculadora</SectionTitle>
            <Card>
              <Field label="Taxa en aire espirat (mg/l)">
                <input type="text" inputMode="decimal" value={taxa}
                  onChange={e => setTaxa(e.target.value)} placeholder="p. ex. 0,42" style={inputStyle} />
              </Field>
              <Field label="Perfil del conductor">
                <select value={perfil} onChange={e => setPerfil(e.target.value)} style={inputStyle}>
                  {PERFILS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={reincident} onChange={e => setReincident(e.target.checked)} />
                <span style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.4 }}>
                  {BAREM_ALCOHOL.reincidencia}
                </span>
              </label>
            </Card>

            <SectionTitle>Resultat</SectionTitle>
            <Card><Resultat res={resAlc} cat={cat} /></Card>

            <div style={{
              background: T.cat.alcohol.soft, borderRadius: T.r.md, padding: 14, marginBottom: 12,
              borderLeft: `3px solid ${T.cat.alcohol.solid}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="siren" size={16} color={T.cat.alcohol.ink} />
                <div style={{ fontWeight: 800, fontSize: 12.5, color: T.cat.alcohol.ink, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Llindar penal
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: T.cat.alcohol.ink, lineHeight: 1.55, marginTop: 8 }}>
                El barem del catàleg acaba a «superior a 0,50 mg/l». A partir de 0,60 mg/l en aire
                espirat (o 1,2 g/l en sang) el fet és delicte de l'art. 379.2 CP i no es formula
                denúncia administrativa.
              </div>
            </div>

            <SectionTitle>Trams del barem</SectionTitle>
            {BAREM_ALCOHOL.perfils.map(p => (
              <Card key={p.id}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: T.ink }}>{p.nom}</div>
                {p.detall && (
                  <div style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 4, lineHeight: 1.5 }}>{p.detall}</div>
                )}
                <TramList trams={p.trams} />
                {(p.subperfils || []).map(s => (
                  <div key={s.id} style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.inkSoft }}>{s.nom}</div>
                    <TramList trams={s.trams} />
                  </div>
                ))}
                {p.reincident && (
                  <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
                    Reincidència: {p.reincident.fine} € · DTE {p.reincident.fine50} € ·{' '}
                    {p.reincident.punts} punts
                  </div>
                )}
              </Card>
            ))}
            <div style={{ fontSize: 11.5, color: T.inkMuted, lineHeight: 1.5, padding: '0 2px 8px' }}>
              {BAREM_ALCOHOL.notaCondicional}
            </div>
          </>
        )}
      </div>

      <FontFooter />
    </div>
  );
}

function TramList({ trams }) {
  const fmt = n => n.toFixed(2).replace('.', ',');
  return (
    <div style={{ marginTop: 8 }}>
      {trams.map(t => (
        <div key={`${t.from}-${t.to}`} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: `1px solid ${T.hairline}`, fontSize: 12.5 }}>
          <span style={{ fontFamily: T.fontMono, color: T.inkSoft, minWidth: 96 }}>
            {t.to === null ? `> ${fmt(t.from - 0.01)}` : `${fmt(t.from)}–${fmt(t.to)}`}
          </span>
          <span style={{ fontWeight: 700 }}>{t.fine} €</span>
          <span style={{ color: T.inkMuted }}>DTE {t.fine50} €</span>
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: T.inkSoft }}>
            {t.punts > 0 ? `−${t.punts}${t.condicional ? '*' : ''}` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

const th = {
  padding: '8px 10px', textAlign: 'left', fontSize: 10.5, fontWeight: 800,
  color: T.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4,
  borderBottom: `1px solid ${T.hairlineStrong}`, whiteSpace: 'nowrap',
};
const td = {
  padding: '7px 10px', borderBottom: `1px solid ${T.hairline}`,
  color: T.inkSoft, whiteSpace: 'nowrap', fontFamily: T.fontMono, fontSize: 11,
};
