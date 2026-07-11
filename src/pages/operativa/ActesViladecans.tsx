// Catàleg d'actes de la Policia Local de Viladecans.
// Referència ràpida transversal: totes les plantilles del cos amb el
// "quan procedeix" de cadascuna, cercables i agrupades per sèrie.
// Les fitxes d'Operativa hi remeten des del camp «Actes a emplenar».
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';
import { ACTES_VILADECANS, SERIES_LABEL, type ActaVilad } from '../../data/actes-viladecans';

const AMBIT_CHIP: Record<NonNullable<ActaVilad['ambit']>, { label: string; bg: string; fg: string }> = {
  transit: { label: 'Trànsit', bg: '#EAF1FE', fg: '#2F6BD8' },
  penal: { label: 'Penal', bg: '#FFE4E4', fg: '#C13030' },
  admin: { label: 'Admin', bg: '#E1F4EE', fg: '#0E8A6F' },
  mixt: { label: 'Mixt', bg: '#F5E9FF', fg: '#9747D6' },
};

// Normalitza per a cerca sense accents ni majúscules.
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function ActesViladecans() {
  const { t } = useT();
  const [q, setQ] = useState('');
  const [ambit, setAmbit] = useState<'tots' | NonNullable<ActaVilad['ambit']>>('tots');

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return ACTES_VILADECANS.filter((a) => {
      if (ambit !== 'tots' && a.ambit !== ambit && a.ambit !== 'mixt') return false;
      if (!nq) return true;
      return norm(`${a.codi} ${a.nom} ${a.quan} ${a.variants ?? ''}`).includes(nq);
    });
  }, [q, ambit]);

  const bySerie = useMemo(() => {
    const m = new Map<ActaVilad['serie'], ActaVilad[]>();
    for (const a of filtered) {
      if (!m.has(a.serie)) m.set(a.serie, []);
      m.get(a.serie)!.push(a);
    }
    return m;
  }, [filtered]);

  return (
    <div className="shell pb-10" style={{ maxWidth: 880 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <span className="here">Actes PL Viladecans</span>
      </nav>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#B6531F' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>🗂️</span>
        <div className="op-runner-text">
          <span className="eyebrow">OPERATIVA · DOCUMENTACIÓ</span>
          <h1>Actes i documents — PL Viladecans</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '6px 0 0' }}>
            Totes les plantilles del cos amb el <b>quan procedeix</b> cadascuna.
            Les fitxes de Procediments (Trànsit i Penal) indiquen a cada resultat
            quines actes s'han d'emplenar.
          </p>
        </div>
      </header>

      {/* Cercador + filtre d'àmbit */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 10px' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca per codi, nom o situació… (ex: detingut, alcohol, ocupació)"
          style={{
            flex: '1 1 260px', border: '1px solid var(--line)', borderRadius: 12,
            padding: '11px 14px', fontSize: 14, background: 'var(--paper)', color: 'var(--ink)',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['tots', 'transit', 'penal', 'admin'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAmbit(a)}
              style={{
                border: `1.5px solid ${ambit === a ? 'var(--terracotta)' : 'var(--line)'}`,
                background: ambit === a ? 'var(--terracotta)' : 'var(--paper)',
                color: ambit === a ? '#fff' : 'var(--text-2)',
                borderRadius: 999, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {a === 'tots' ? 'Totes' : a === 'transit' ? '🚦 Trànsit' : a === 'penal' ? '⚖️ Penal' : '📋 Admin.'}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 14px' }}>
        {filtered.length} {filtered.length === 1 ? 'document' : 'documents'}
        {q && ` per a «${q}»`}
      </p>

      {/* Llistat per sèries */}
      {(Object.keys(SERIES_LABEL) as ActaVilad['serie'][]).map((serie) => {
        const items = bySerie.get(serie);
        if (!items?.length) return null;
        const meta = SERIES_LABEL[serie];
        return (
          <section key={serie} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderBottom: '2px solid var(--line)', paddingBottom: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{meta.emoji}</span>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', margin: 0 }}>{meta.titol}</h2>
              <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{meta.desc}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((a) => (
                <article
                  key={a.codi + a.nom}
                  style={{
                    border: '1px solid var(--line)', borderRadius: 14, padding: '12px 14px',
                    background: 'var(--paper)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <code style={{
                      background: 'var(--paper-2)', border: '1px solid var(--line)',
                      borderRadius: 8, padding: '3px 9px', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)',
                    }}>{a.codi}</code>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{a.nom}</strong>
                    {a.ambit && (
                      <span style={{
                        background: AMBIT_CHIP[a.ambit].bg, color: AMBIT_CHIP[a.ambit].fg,
                        borderRadius: 999, padding: '2px 9px', fontSize: 10.5, fontWeight: 700,
                      }}>{AMBIT_CHIP[a.ambit].label}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-2)', margin: '7px 0 0' }}>
                    {a.quan}
                  </p>
                  {a.variants && (
                    <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: '5px 0 0' }}>
                      📄 Versions: {a.variants}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '30px 0' }}>
          Cap document coincideix amb la cerca.
        </p>
      )}

      <p style={{ fontSize: 11.5, color: 'var(--text-3)', borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 8 }}>
        ⚠️ Referència d'estudi basada en el llistat de plantilles de la PL de Viladecans
        (2024–2026). Els models poden actualitzar-se: davant del dubte, consulta la
        versió vigent a la intranet del cos.
      </p>
    </div>
  );
}
