// Calculadora de Widmark · retroprojecció a partir de DUES proves
// d'alcoholèmia espaiades en el temps.
//
// Donades:
//   - Hora i taxa de la 1a prova
//   - Hora i taxa de la 2a prova (posterior)
//   - Sexe i pes (per al càlcul d'alcohol consumit)
//   - Hora de l'incident (opcional, per retroprojectar)
//
// Calcula:
//   - β observada (taxa d'eliminació real d'aquesta persona, g/L per hora)
//   - Hora estimada en què el BAC arriba a 0 (eliminació total)
//   - BAC estimat a l'hora de l'incident (retroprojecció)
//   - Grams d'alcohol estimats al pic (Widmark: A = TAS × P × r)
//
// Aquesta eina és informativa. Per ús pericial cal sempre informe oficial.
import { useMemo, useState } from 'react';

type Sex = 'M' | 'F';
type Unit = 'breath' | 'blood';

// Conversió aproximada: 1 mg/L aire ≈ 2 g/L sang (factor 2.0).
const BREATH_TO_BLOOD = 2.0;

// Factor Widmark r: distribució aigua corporal (M=0.7, F=0.6).
const WIDMARK_R: Record<Sex, number> = { M: 0.7, F: 0.6 };

function parseTime(hhmm: string): number | null {
  // Retorna minuts des de mitjanit, o null si invàlid.
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

function fmtTime(totalMin: number): string {
  // Normalitza dins 0-24 (mod 1440).
  const t = ((Math.round(totalMin) % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function WidmarkCalculator() {
  const [sex, setSex] = useState<Sex>('M');
  const [weight, setWeight] = useState<string>('75');
  const [unit, setUnit] = useState<Unit>('blood');
  const [time1, setTime1] = useState<string>('');
  const [bac1, setBac1] = useState<string>('');
  const [time2, setTime2] = useState<string>('');
  const [bac2, setBac2] = useState<string>('');
  const [timeIncident, setTimeIncident] = useState<string>('');

  const result = useMemo(() => {
    const t1 = parseTime(time1);
    const t2 = parseTime(time2);
    const b1 = parseFloat(bac1.replace(',', '.'));
    const b2 = parseFloat(bac2.replace(',', '.'));
    const w = parseFloat(weight.replace(',', '.'));

    if (t1 == null || t2 == null) return null;
    if (isNaN(b1) || isNaN(b2)) return null;
    if (isNaN(w) || w <= 0) return null;

    // Si t2 < t1, assumim que t2 és l'endemà (passa de mitjanit).
    let dtMin = t2 - t1;
    if (dtMin <= 0) dtMin += 1440;
    const dtHours = dtMin / 60;

    // Convertir a sang (g/L) si l'usuari ha entrat en aire espirat (mg/L).
    const b1Blood = unit === 'breath' ? b1 * BREATH_TO_BLOOD : b1;
    const b2Blood = unit === 'breath' ? b2 * BREATH_TO_BLOOD : b2;

    // Eliminació observada (g/L/h). Si negativa, encara està absorbint.
    const beta = (b1Blood - b2Blood) / dtHours;

    // Hora en què BAC arriba a 0 (assumint eliminació lineal des del 2n test).
    let timeZeroMin: number | null = null;
    if (beta > 0 && b2Blood > 0) {
      const minsToZero = (b2Blood / beta) * 60;
      timeZeroMin = t2 + minsToZero;
    }

    // Retroprojecció a l'hora de l'incident (si s'hi entra).
    let bacIncident: number | null = null;
    let bacIncidentBreath: number | null = null;
    let timeIncidentMin: number | null = null;
    const tIncRaw = parseTime(timeIncident);
    if (tIncRaw != null && beta > 0) {
      // L'incident ha de ser anterior al 1r test. Si és posterior, assumim
      // mateix dia previ (resta 24h fins anterior).
      let tInc = tIncRaw;
      while (tInc > t1) tInc -= 1440;
      const minsBack = t1 - tInc;
      bacIncident = b1Blood + beta * (minsBack / 60);
      bacIncidentBreath = bacIncident / BREATH_TO_BLOOD;
      timeIncidentMin = tInc;
    }

    // Estimació d'alcohol consumit (Widmark): A = BAC_pic × P × r
    // Pic estimat: el BAC més alt observat retrojectat (preferim BAC incident
    // si s'ha donat, sinó el b1Blood retrojectat al moment 0 de l'eliminació).
    const r = WIDMARK_R[sex];
    const peakBAC = bacIncident != null ? bacIncident : b1Blood;
    const grams = peakBAC * w * r;
    const drinks = grams / 10; // 1 UBE = 10g

    return {
      dtHours,
      beta,
      betaPerHour: beta, // g/L per hora
      b1Blood,
      b2Blood,
      timeZeroMin,
      bacIncident,
      bacIncidentBreath,
      timeIncidentMin,
      grams,
      drinks,
      r,
      peakBAC,
    };
  }, [sex, weight, unit, time1, bac1, time2, bac2, timeIncident]);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-line bg-paper-2 p-4">
        <p className="text-sm text-text-2">
          Calcula la <strong>taxa d'eliminació real</strong> a partir de dues
          proves d'alcoholèmia espaiades en el temps. Permet retroprojectar
          el BAC a l'hora de l'incident i estimar l'alcohol consumit
          (fórmula de Widmark). Eina informativa — no substitueix l'informe
          pericial.
        </p>
      </div>

      {/* Dades personals */}
      <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Sexe">
          <div className="flex gap-2">
            <SegBtn active={sex === 'M'} onClick={() => setSex('M')}>Home</SegBtn>
            <SegBtn active={sex === 'F'} onClick={() => setSex('F')}>Dona</SegBtn>
          </div>
        </Field>
        <Field label="Pes (kg)">
          <input
            type="number"
            min="20"
            max="250"
            step="1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="wid-input"
          />
        </Field>
        <Field label="Unitat de la mesura">
          <div className="flex gap-2">
            <SegBtn active={unit === 'blood'} onClick={() => setUnit('blood')}>g/L sang</SegBtn>
            <SegBtn active={unit === 'breath'} onClick={() => setUnit('breath')}>mg/L aire</SegBtn>
          </div>
        </Field>
      </fieldset>

      {/* Test 1 */}
      <fieldset className="rounded-xl border border-line p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wide text-text-3">
          Primera prova
        </legend>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Field label="Hora (HH:MM)">
            <input
              type="text"
              placeholder="22:30"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              className="wid-input"
            />
          </Field>
          <Field label={`Taxa (${unit === 'breath' ? 'mg/L aire' : 'g/L sang'})`}>
            <input
              type="number"
              step="0.01"
              placeholder="0.85"
              value={bac1}
              onChange={(e) => setBac1(e.target.value)}
              className="wid-input"
            />
          </Field>
        </div>
      </fieldset>

      {/* Test 2 */}
      <fieldset className="rounded-xl border border-line p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wide text-text-3">
          Segona prova (posterior)
        </legend>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Field label="Hora (HH:MM)">
            <input
              type="text"
              placeholder="23:00"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              className="wid-input"
            />
          </Field>
          <Field label={`Taxa (${unit === 'breath' ? 'mg/L aire' : 'g/L sang'})`}>
            <input
              type="number"
              step="0.01"
              placeholder="0.78"
              value={bac2}
              onChange={(e) => setBac2(e.target.value)}
              className="wid-input"
            />
          </Field>
        </div>
      </fieldset>

      {/* Hora incident opcional */}
      <fieldset className="rounded-xl border border-dashed border-line p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wide text-text-3">
          Hora de l'incident (opcional, per retroprojectar)
        </legend>
        <div className="mt-2">
          <Field label="Hora (HH:MM) — anterior a la primera prova">
            <input
              type="text"
              placeholder="21:45"
              value={timeIncident}
              onChange={(e) => setTimeIncident(e.target.value)}
              className="wid-input"
            />
          </Field>
        </div>
      </fieldset>

      {/* Resultat */}
      {result && (
        <div className="rounded-2xl border-2 border-line bg-paper-2 p-5 flex flex-col gap-4">
          <h3 className="text-lg font-black tracking-tight text-ink">Resultat</h3>

          <ResRow
            label="Temps entre proves"
            value={`${result.dtHours.toFixed(2)} h`}
          />
          <ResRow
            label="Taxa d'eliminació observada (β)"
            value={
              result.beta > 0
                ? `${result.beta.toFixed(3)} g/L per hora`
                : `${result.beta.toFixed(3)} g/L/h (encara absorbint o pic no assolit)`
            }
            tone={result.beta > 0 ? 'good' : 'warn'}
            help={
              result.beta > 0
                ? 'Valor normal: 0.10–0.20 g/L/h. Mitjana: 0.15.'
                : 'Si la 2a prova dóna més que la 1a, encara està en fase d\'absorció.'
            }
          />

          {result.timeZeroMin != null && (
            <ResRow
              label="Hora estimada en què el BAC = 0"
              value={fmtTime(result.timeZeroMin)}
              help="Moment estimat de l'eliminació total (assumint eliminació lineal)."
            />
          )}

          {result.bacIncident != null && result.timeIncidentMin != null && (
            <>
              <div className="border-t border-line pt-3" />
              <h4 className="font-bold text-ink">A l'hora de l'incident ({fmtTime(result.timeIncidentMin)})</h4>
              <ResRow
                label="BAC retroprojectat"
                value={`${result.bacIncident.toFixed(3)} g/L sang  ·  ${result.bacIncidentBreath?.toFixed(3)} mg/L aire`}
                tone="good"
              />
            </>
          )}

          {result.beta > 0 && result.peakBAC > 0 && (
            <>
              <div className="border-t border-line pt-3" />
              <h4 className="font-bold text-ink">Estimació d'alcohol consumit (Widmark)</h4>
              <ResRow
                label="Grams d'alcohol al pic"
                value={`${result.grams.toFixed(1)} g`}
                help={`Fórmula: A = BAC × pes × r (r = ${result.r} per a ${sex === 'M' ? 'home' : 'dona'}).`}
              />
              <ResRow
                label="Equivalent en UBE (Unitats de Beguda Estàndard)"
                value={`${result.drinks.toFixed(1)} UBE`}
                help="1 UBE ≈ 10 g d'alcohol pur (1 canya, 1 copa de vi, 1/2 combinat)."
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-3">
        {label}
      </span>
      {children}
    </label>
  );
}

function SegBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition
        ${active
          ? 'bg-ink text-paper border-ink'
          : 'bg-paper text-ink border-line hover:bg-paper-2'}`}
    >
      {children}
    </button>
  );
}

function ResRow({
  label, value, tone, help,
}: { label: string; value: string; tone?: 'good' | 'warn'; help?: string }) {
  const valueColor =
    tone === 'good' ? 'text-emerald-700'
    : tone === 'warn' ? 'text-amber-700'
    : 'text-ink';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm text-text-2">{label}</span>
        <span className={`text-base font-bold ${valueColor}`}>{value}</span>
      </div>
      {help && <p className="text-xs text-text-3">{help}</p>}
    </div>
  );
}
