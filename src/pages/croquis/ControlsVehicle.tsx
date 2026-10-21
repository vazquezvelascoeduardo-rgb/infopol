import type { El, Estat } from '../../lib/croquisPhysics';
import ColorsVehicle from './ColorsVehicle';

/** Opcions comunes per a mòbil i escriptori; es desen amb el croquis. */
export default function ControlsVehicle({ el, update }: {
  el: El; update: (id: string, patch: Partial<El>) => void;
}) {
  return (
    <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
      <ColorsVehicle color={el.color} onChange={(color) => update(el.id, { color })} />
      <label>Estat del vehicle
        <select aria-label="Estat del vehicle" value={el.data?.estat ?? ''}
          onChange={(e) => update(el.id, { data: { ...el.data, estat: (e.target.value || undefined) as Estat | undefined } })}
          style={{ display: 'block', width: '100%', marginTop: 5 }}>
          <option value="">Sense indicar</option>
          <option value="mov">En moviment</option>
          <option value="parat">Aturat</option>
          <option value="estacionat">Estacionat</option>
        </select>
      </label>
      <label><input type="checkbox" checked={el.showState !== false}
        onChange={(e) => update(el.id, { showState: e.target.checked })} /> Mostrar fletxa / P i indicador d'estat</label>
      <label><input type="checkbox" checked={el.showLabel !== false}
        onChange={(e) => update(el.id, { showLabel: e.target.checked })} /> Mostrar etiqueta</label>
      <label>Text de l'etiqueta
        <input aria-label="Text de l'etiqueta" value={el.labelText ?? ''} placeholder="Automàtic (A, matrícula…)"
          onChange={(e) => update(el.id, { labelText: e.target.value })}
          style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5 }} />
      </label>
      <span>Arrossega l'etiqueta directament per moure-la.</span>
      <button type="button" onClick={() => update(el.id, { labelX: 0, labelY: 58 })}>Recentrar etiqueta sota el vehicle</button>
    </div>
  );
}
