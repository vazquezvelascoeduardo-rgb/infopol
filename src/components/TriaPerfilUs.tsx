// La pregunta que es fa un cop, en entrar per primera vegada.
//
// InfoPol serveix dues persones diferents: qui es prepara l'oposició i
// qui ja està al carrer. Tots dos hi tenen tot, però no els interessa el
// mateix primer. Amb aquesta resposta l'app sap per on començar.
//
// No bloqueja res ni amaga res: la barra lateral segueix igual i es pot
// canviar des de Perfil quan es vulgui.
import { useState } from 'react';

import { useAuth } from '../lib/auth';
import { updateProfile, type PerfilUs } from '../lib/db';
import { I, Mono, RV, V, type NomIc } from '../lib/v3';

const OPCIONS: { id: PerfilUs; icona: NomIc; titol: string; sub: string }[] = [
  {
    id: 'opositor',
    icona: 'cap',
    titol: 'Em preparo una oposició',
    sub: 'Entraràs per l\'Acadèmia: temari, tests i repàs.',
  },
  {
    id: 'actiu',
    icona: 'siren',
    titol: 'Estic en actiu',
    sub: 'Entraràs per l\'Operativa: consulta ràpida en servei.',
  },
  {
    id: 'ambdos',
    icona: 'layers',
    titol: 'Les dues coses',
    sub: 'En servei i preparant-te alhora. Ho veuràs tot al mateix nivell.',
  },
];

export default function TriaPerfilUs({ onFet }: { onFet: (tria: PerfilUs) => void }) {
  const { user, refresh } = useAuth();
  const [desant, setDesant] = useState<PerfilUs | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function tria(id: PerfilUs) {
    if (desant) return;
    setDesant(id);
    setError(null);
    try {
      if (user) {
        await updateProfile(user.id, { perfil_us: id });
        await refresh();
      }
      onFet(id);
    } catch {
      // Si Supabase falla no el deixem encallat: continua igualment i
      // ja ho tornarà a triar més endavant des de Perfil.
      setError('No s\'ha pogut desar, però pots continuar.');
      setDesant(null);
      onFet(id);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: V.paper,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <Mono size={10} color={V.terraInk}>PER COMENÇAR</Mono>
        <h1 style={{
          fontSize: 'clamp(26px,4vw,34px)', letterSpacing: -1.4, lineHeight: 1.1,
          margin: '10px 0 8px', fontWeight: 400, color: V.muted,
        }}>
          <span style={{ fontWeight: 800, color: V.ink }}>Com faràs servir</span> InfoPol?
        </h1>
        <p style={{ fontSize: 14, color: V.muted, lineHeight: 1.5, margin: '0 0 22px' }}>
          Només serveix per ordenar-ho: ho tindràs tot igualment i pots canviar-ho
          quan vulguis des del teu perfil.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OPCIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => void tria(o.id)}
              disabled={!!desant}
              style={{
                textAlign: 'left', cursor: desant ? 'wait' : 'pointer', border: 'none',
                borderRadius: 22, padding: 18, background: V.surface, color: V.ink,
                boxShadow: V.shadow, display: 'flex', alignItems: 'center', gap: 14,
                opacity: desant && desant !== o.id ? 0.5 : 1,
              }}>
              <span style={{
                width: 46, height: 46, flexShrink: 0, borderRadius: RV.md,
                background: V.terraSoft, color: V.terraInk,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I n={o.icona} size={21} sw={1.9} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 16, fontWeight: 800, letterSpacing: -0.4 }}>
                  {o.titol}
                </span>
                <span style={{ display: 'block', fontSize: 12.5, color: V.muted, marginTop: 4, lineHeight: 1.4 }}>
                  {o.sub}
                </span>
              </span>
              <I n="arrow" size={15} sw={2.4} color={V.faint} />
            </button>
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: V.granate, marginTop: 14 }}>{error}</p>
        )}
      </div>
    </div>
  );
}
