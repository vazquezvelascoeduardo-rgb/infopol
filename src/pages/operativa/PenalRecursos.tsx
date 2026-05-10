// Pàgina de recursos d'atenció a víctimes — telèfons i serveis útils
// per a casos de violència de gènere, domèstica, sexual, suïcidi,
// desaparició, menors, etc.
import { Link } from 'react-router-dom';
import { useT } from '../../lib/i18n';

type Recurs = {
  numero?: string;
  nom: string;
  descripcio: string;
  tipus: 'emergencia' | 'victima' | 'menors' | 'salut' | 'social';
  url?: string;
};

const RECURSOS: Recurs[] = [
  // EMERGÈNCIES
  { numero: '112', nom: "Emergències", descripcio: "Telèfon únic d'emergències (24h)", tipus: 'emergencia' },
  { numero: '061', nom: 'Emergències sanitàries', descripcio: 'Atenció sanitària urgent (24h)', tipus: 'emergencia' },
  { numero: '091', nom: 'Policia Nacional', descripcio: 'Cos Nacional de Policia (24h)', tipus: 'emergencia' },
  { numero: '092', nom: 'Policia Local', descripcio: 'Policia Local (24h)', tipus: 'emergencia' },
  { numero: '088', nom: "Mossos d'Esquadra", descripcio: "Policia de la Generalitat (24h)", tipus: 'emergencia' },

  // VÍCTIMES
  { numero: '016', nom: 'Atenció víctimes violència de gènere', descripcio: 'Gratuït · 24h · NO deixa rastre a la factura · sms 600 000 016', tipus: 'victima' },
  { numero: '024', nom: 'Conducta suïcida', descripcio: 'Línia d\'atenció a la conducta suïcida (24h)', tipus: 'victima' },
  { numero: '717 003 717', nom: 'Telèfon de l\'Esperança', descripcio: 'Suport emocional i suïcidi (24h)', tipus: 'victima' },

  // MENORS
  { numero: '900 20 20 10', nom: 'Fundació ANAR', descripcio: 'Ajuda a infància i adolescència (24h)', tipus: 'menors' },

  // SOCIAL
  { nom: 'SIAD', descripcio: "Servei d'Informació i Atenció a les Dones (cada municipi té el seu — Generalitat de Catalunya)", tipus: 'social' },
  { nom: 'SARA', descripcio: "Servei d'Atenció, Recuperació i Acolliment per a dones víctimes de violència masclista", tipus: 'social' },
];

const TIPUS_META: Record<Recurs['tipus'], { label: string; color: string; icon: string }> = {
  emergencia: { label: 'Emergències', color: '#ef4444', icon: '🚨' },
  victima: { label: 'Atenció a víctimes', color: '#dc2626', icon: '💔' },
  menors: { label: 'Menors', color: '#f59e0b', icon: '👶' },
  salut: { label: 'Salut', color: '#10b981', icon: '🏥' },
  social: { label: 'Serveis socials', color: '#3b82f6', icon: '🤝' },
};

export default function PenalRecursos() {
  const { t } = useT();
  // Agrupem per tipus respectant l'ordre.
  const grouped = new Map<Recurs['tipus'], Recurs[]>();
  for (const r of RECURSOS) {
    if (!grouped.has(r.tipus)) grouped.set(r.tipus, []);
    grouped.get(r.tipus)!.push(r);
  }

  return (
    <div className="shell pb-10" style={{ maxWidth: 760 }}>
      <nav className="crumbs">
        <Link to="/">{t('nav.home')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa">{t('operativa.title')}</Link>
        <span className="sep">/</span>
        <Link to="/operativa/penal">{t('operativa.seguretat-ciutadana.title')}</Link>
        <span className="sep">/</span>
        <span className="here">{t('penal.recursos')}</span>
      </nav>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#dc2626' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>📞</span>
        <div className="op-runner-text">
          <span className="eyebrow">SC / PENAL · TELÈFONS ÚTILS</span>
          <h1>{t('penal.recursos.title')}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '6px 0 0' }}>
            {t('penal.recursos.desc')}
          </p>
        </div>
      </header>

      {[...grouped.entries()].map(([tipus, items]) => {
        const meta = TIPUS_META[tipus];
        return (
          <section
            key={tipus}
            className="penal-bloc"
            style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
          >
            <div className="penal-bloc-head">
              <span className="penal-bloc-icon" aria-hidden>{meta.icon}</span>
              <h2 className="penal-bloc-title">{meta.label}</h2>
              <span className="penal-bloc-count">{items.length}</span>
            </div>
            <ul className="recursos-list">
              {items.map((r, i) => (
                <li key={i}>
                  {r.numero ? (
                    <a
                      href={`tel:${r.numero.replace(/\s+/g, '')}`}
                      className="recurs-card"
                      style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
                    >
                      <span className="recurs-num">{r.numero}</span>
                      <div className="recurs-text">
                        <div className="recurs-nom">{r.nom}</div>
                        <div className="recurs-desc">{r.descripcio}</div>
                      </div>
                    </a>
                  ) : (
                    <div
                      className="recurs-card recurs-static"
                      style={{ ['--accent' as never]: meta.color } as React.CSSProperties}
                    >
                      <span className="recurs-num recurs-num-text">{r.nom}</span>
                      <div className="recurs-text">
                        <div className="recurs-desc">{r.descripcio}</div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
