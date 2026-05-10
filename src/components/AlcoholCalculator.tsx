// Calculadora d'alcoholèmia: indica el règim sancionador segons la
// taxa mesurada en aire espirat (mg/l) i el tipus de conductor.
//
// Reusable: es fa servir tant a /recursos com a la pàgina dedicada
// /calculadora-alcohol (accés directe des de home).
import { useState } from 'react';
import { useT } from '../lib/i18n';

export type ConductorTipus = 'general' | 'novell' | 'menor' | 'bici';

type AlcoholResult = {
  kind: 'ok' | 'admin' | 'admin-alt' | 'penal';
  titol: string;
  multa?: string;
  punts?: string;
  article?: string;
  accio?: string;
  color: string;
};

export function calculateAlcohol(
  tipus: ConductorTipus,
  reincident: boolean,
  mg: number,
): AlcoholResult | null {
  if (isNaN(mg) || mg < 0) return null;

  // Penal (>0,65 mg/l confirmat) — criteri prudent amb marge d'error.
  if (mg > 0.65) {
    return {
      kind: 'penal',
      titol: '🚔 DELICTE — Art. 379.2 CP (taxa objectiva)',
      multa: 'Penal: presó 3-6 mesos O multa 6-12 mesos O TBC 31-90 dies + privació permís 1-4 anys',
      article: 'Art. 379.2 CP',
      accio: 'CITACIÓ a procediment ràpid (Art. 795 LECrim) · evidencial amb totes les garanties · informar drets 520.2 LECrim · oferir contrast per sang · intervenir permís · immobilització vehicle.',
      color: '#dc2626',
    };
  }

  // Bicicleta / VMP (adult)
  if (tipus === 'bici') {
    if (mg <= 0.25) return { kind: 'ok', titol: '✅ Negativa', color: '#15803d' };
    if (mg <= 0.50) {
      return {
        kind: 'admin', titol: '⚠️ MOLT GREU — Bicicleta/VMP',
        multa: '500 € (DTE 250 €)', punts: '0 punts (no permís)',
        article: 'Art. 20 RGC', color: '#a16207',
      };
    }
    return {
      kind: 'admin-alt', titol: '🔴 MOLT GREU — Bicicleta/VMP tram alt',
      multa: '1.000 € (DTE 500 €)', punts: '0 punts (no permís)',
      article: 'Art. 20 RGC', color: '#dc2626',
    };
  }

  // Menor d'edat (taxa zero)
  if (tipus === 'menor') {
    if (mg === 0) return { kind: 'ok', titol: '✅ Negativa', color: '#15803d' };
    if (mg <= 0.15) {
      return {
        kind: 'admin', titol: '⚠️ MOLT GREU — Menor amb taxa > 0',
        multa: '500 € (DTE 250 €)', punts: '0 punts (sense permís) o 4 punts (amb permís AM)',
        article: 'Art. 14.1 TRLSV', color: '#a16207',
        accio: 'Avisar pares/tutors per recollir el menor.',
      };
    }
    if (mg <= 0.30) {
      return {
        kind: 'admin', titol: '⚠️ MOLT GREU — Menor amb permís (tram baix)',
        multa: '500 € (DTE 250 €)', punts: '–4 punts',
        article: 'Art. 20 RGC', color: '#a16207',
      };
    }
    return {
      kind: 'admin-alt', titol: '🔴 MOLT GREU — Menor amb permís (tram alt)',
      multa: '1.000 € (DTE 500 €)', punts: '–6 punts',
      article: 'Art. 20 RGC', color: '#dc2626',
    };
  }

  // Novell (<2 anys) o Professional
  if (tipus === 'novell') {
    if (mg <= 0.15) return { kind: 'ok', titol: '✅ Negativa', color: '#15803d' };
    if (mg <= 0.30) {
      return reincident
        ? {
            kind: 'admin', titol: '⚠️ MOLT GREU — Tram baix REINCIDENT (novell/professional)',
            multa: '1.000 € (DTE 500 €)', punts: '–4 punts',
            article: 'Art. 20 RGC + Art. 80.2.a TRLSV', color: '#a16207',
          }
        : {
            kind: 'admin', titol: '⚠️ MOLT GREU — Tram baix (novell/professional)',
            multa: '500 € (DTE 250 €)', punts: '–4 punts',
            article: 'Art. 20 RGC', color: '#a16207',
          };
    }
    return {
      kind: 'admin-alt', titol: '🔴 MOLT GREU — Tram alt (novell/professional)',
      multa: '1.000 € (DTE 500 €)', punts: '–6 punts',
      article: 'Art. 20 RGC', color: '#dc2626',
    };
  }

  // General (permís > 2 anys)
  if (mg <= 0.25) return { kind: 'ok', titol: '✅ Negativa', color: '#15803d' };
  if (mg <= 0.50) {
    return reincident
      ? {
          kind: 'admin', titol: '⚠️ MOLT GREU — Tram 1 REINCIDENT (general)',
          multa: '1.000 € (DTE 500 €)', punts: '–4 punts',
          article: 'Art. 20 RGC + Art. 80.2.a TRLSV', color: '#a16207',
        }
      : {
          kind: 'admin', titol: '⚠️ MOLT GREU — Tram 1 (general)',
          multa: '500 € (DTE 250 €)', punts: '–4 punts',
          article: 'Art. 20 RGC', color: '#a16207',
        };
  }
  // 0,51 - 0,65 → admin tram alt
  return {
    kind: 'admin-alt', titol: '🔴 MOLT GREU — Tram alt (general)',
    multa: '1.000 € (DTE 500 €)', punts: '–6 punts',
    article: 'Art. 20 RGC', color: '#dc2626',
  };
}

export default function AlcoholCalculator() {
  const { t } = useT();
  const [tipus, setTipus] = useState<ConductorTipus>('general');
  const [reincident, setReincident] = useState(false);
  const [lectura, setLectura] = useState('');

  const mg = parseFloat(lectura.replace(',', '.'));
  const result = lectura.trim() === '' ? null : calculateAlcohol(tipus, reincident, mg);

  return (
    <div className="space-y-3">
      {/* Tipus de conductor */}
      <div>
        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
          {t('recursos.alcohol.driverType')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            ['general', t('recursos.alcohol.general')],
            ['novell', t('recursos.alcohol.novell')],
            ['menor', t('recursos.alcohol.menor')],
            ['bici', t('recursos.alcohol.bici')],
          ] as const).map(([val, lab]) => (
            <button
              key={val}
              type="button"
              onClick={() => setTipus(val)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition
                ${tipus === val
                  ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-400/15 dark:text-blue-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/20'}`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      {/* Reincident (només si té sentit) */}
      {(tipus === 'general' || tipus === 'novell') && (
        <label className="flex items-start gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={reincident}
            onChange={(e) => setReincident(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="font-medium">{t('recursos.alcohol.reincident')}</span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              {t('recursos.alcohol.reincidentHint')}
            </span>
          </span>
        </label>
      )}

      {/* Lectura mg/l */}
      <div>
        <label htmlFor="alc-input" className="block text-xs uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 mb-1">
          {t('recursos.alcohol.reading')}
        </label>
        <div className="relative">
          <input
            id="alc-input"
            type="text"
            inputMode="decimal"
            value={lectura}
            onChange={(e) => setLectura(e.target.value.replace(/[^0-9.,]/g, ''))}
            placeholder="0,28"
            className="w-full rounded-xl border-2 px-4 py-3 pr-16 text-base font-mono outline-none
              border-slate-200 bg-white text-slate-900
              focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20
              dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono pointer-events-none">
            mg/l
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {t('recursos.alcohol.readingHint')}
        </p>
      </div>

      {/* Resultat — selecció permesa (l'agent ho copia a l'atestat). */}
      {result && (
        <div
          className="rounded-xl border-l-4 p-4 mt-2"
          data-allow-select="true"
          style={{ borderLeftColor: result.color, backgroundColor: result.color + '14' }}
        >
          <div className="font-bold text-base mb-2" style={{ color: result.color }}>
            {result.titol}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {result.multa && (
              <Field label={t('recursos.alcohol.fine')} value={result.multa} />
            )}
            {result.punts && (
              <Field label={t('recursos.alcohol.points')} value={result.punts} />
            )}
            {result.article && (
              <Field label={t('recursos.alcohol.article')} value={result.article} />
            )}
          </div>
          {result.accio && (
            <div className="mt-3 text-sm">
              <div className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">
                {t('recursos.alcohol.action')}
              </div>
              {result.accio}
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        {t('recursos.alcohol.disclaimer')}
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/60 dark:bg-black/20 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-0.5">
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
