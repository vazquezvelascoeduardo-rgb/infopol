import { A } from '../../lib/design';

const COLORS = [
  ['Blanc', '#FFFFFF'], ['Negre', '#15151C'], ['Plata', '#C0C0C0'], ['Gris', '#9AA0AA'],
  ['Gris fosc', '#50545C'], ['Antracita', '#343A40'], ['Vermell', '#D62B2B'], ['Bordeus', '#800020'],
  ['Corall', '#E0455A'], ['Taronja', '#FF7A1A'], ['Groc', '#F0B400'], ['Daurat', '#C5A253'],
  ['Blau', '#3B6BF5'], ['Blau marí', '#142D4E'], ['Blau cel', '#75B9E7'], ['Turquesa', '#16A6A1'],
  ['Verd', '#1FB286'], ['Verd fosc', '#245C3B'], ['Verd oliva', '#747A3B'], ['Marró', '#795548'],
  ['Beix', '#D7C4A3'], ['Crema', '#F4E8CD'], ['Lila', '#9163CB'], ['Rosa', '#EC80B4'],
];

export default function ColorsVehicle({ color, onChange }: { color?: string; onChange: (color: string) => void }) {
  const actual = /^#[0-9a-f]{6}$/i.test(color ?? '') ? color! : '#3B6BF5';
  return <fieldset style={{ border: 0, padding: 0, margin: '0 0 8px', minWidth: 0 }}>
    <legend style={{ fontWeight: 700, marginBottom: 8 }}>Color del vehicle</legend>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 5 }}>
      {COLORS.map(([nom, valor]) => {
        const seleccionat = actual.toUpperCase() === valor;
        return <button key={valor} type="button" title={nom} aria-label={`Color ${nom.toLowerCase()}`} aria-pressed={seleccionat}
          onClick={() => onChange(valor)}
          style={{ height: 28, minWidth: 0, padding: 0, borderRadius: 7, background: valor, cursor: 'pointer',
            border: `2px solid ${seleccionat ? A.terracota : A.line2}`, boxShadow: seleccionat ? 'inset 0 0 0 2px #fff' : undefined }} />;
      })}
    </div>
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer' }}>
      <input type="color" aria-label="Color personalitzat del vehicle" value={actual}
        onChange={(e) => onChange(e.target.value)} style={{ width: 40, height: 32, padding: 2, border: `1px solid ${A.line2}`, borderRadius: 6, cursor: 'pointer' }} />
      Color personalitzat
    </label>
  </fieldset>;
}
