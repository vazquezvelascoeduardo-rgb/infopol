// Pàgina de referència ràpida — Taula de quantitats consum propi vs
// tràfic (Pautes UF 3.3). Dades hardcoded segons l'spec d'InfoPol.
import { useT } from '../../lib/i18n';

const TAULA_DROGUES: Array<{
  substancia: string;
  dosi_habitual: string;
  consum_3_5_dies: string;
  notes?: string;
}> = [
  { substancia: 'Heroïna', dosi_habitual: '50-150 mg', consum_3_5_dies: '3 g màxim' },
  { substancia: 'Cocaïna', dosi_habitual: '100-260 mg', consum_3_5_dies: '7,5 g màxim' },
  { substancia: 'Marihuana', dosi_habitual: '1,5-2 g', consum_3_5_dies: '100 g màxim' },
  { substancia: 'Haixix', dosi_habitual: '0,3-0,5 g', consum_3_5_dies: '25 g màxim' },
  { substancia: 'LSD', dosi_habitual: '0,019-0,032 mg', consum_3_5_dies: '3 mg màxim' },
  { substancia: 'Amfetamines', dosi_habitual: '30-60 mg', consum_3_5_dies: '900 mg màxim' },
  { substancia: 'MDMA', dosi_habitual: '20-150 mg', consum_3_5_dies: '2,4 g màxim' },
  { substancia: 'Ketamina', dosi_habitual: '—', consum_3_5_dies: '1 g màxim' },
  { substancia: 'GHB / GBL', dosi_habitual: '—', consum_3_5_dies: '15 g màxim' },
  { substancia: '2CB (rosa)', dosi_habitual: '—', consum_3_5_dies: '3 g màxim' },
];

export default function PenalTaulaDrogues() {
  const { t } = useT();
  return (
    <div className="v3-page v3-anim" style={{ maxWidth: 760 }}>

      <header
        className="op-runner-head"
        style={{ ['--accent' as never]: '#8b5cf6' } as React.CSSProperties}
      >
        <span className="op-runner-icon" aria-hidden>💊</span>
        <div className="op-runner-text">
          <span className="eyebrow">SC / PENAL · QUANTITATS UF 3.3</span>
          <h1>{t('penal.taulaDrogues.title')}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '6px 0 0' }}>
            {t('penal.taulaDrogues.desc')}
          </p>
        </div>
      </header>

      {/* Avís legal */}
      <div className="op-warning">
        <div className="op-warning-title">⚠️ {t('penal.taulaDrogues.warning')}</div>
        <p>{t('penal.taulaDrogues.warningText')}</p>
      </div>

      {/* Taula */}
      <div className="op-table-wrap">
        <table className="op-table">
          <thead>
            <tr>
              <th>{t('penal.taulaDrogues.substance')}</th>
              <th>{t('penal.taulaDrogues.usualDose')}</th>
              <th>{t('penal.taulaDrogues.limit35')}</th>
            </tr>
          </thead>
          <tbody>
            {TAULA_DROGUES.map((row, i) => (
              <tr key={i}>
                <td className="strong">{row.substancia}</td>
                <td className="mono">{row.dosi_habitual}</td>
                <td className="mono">{row.consum_3_5_dies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes interpretatives */}
      <div className="op-notes">
        <div className="op-notes-title">📌 {t('penal.taulaDrogues.howToInterpret')}</div>
        <ul>
          <li>{t('penal.taulaDrogues.note1')}</li>
          <li>{t('penal.taulaDrogues.note2')}</li>
          <li>{t('penal.taulaDrogues.note3')}</li>
          <li>{t('penal.taulaDrogues.note4')}</li>
        </ul>
      </div>
    </div>
  );
}
